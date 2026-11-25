// Reliance Industries: write the derived valuation inputs into assumptions.json, then rebuild with node src/model.js RELIANCE.
//  1) GST/excise/inter-segment line held at its FY26 share (19.65%) of gross segment revenue (growth synced each year).
//  2) Segment multiples from RELIANCE.val.js (O2C, Jio, Retail); minorities' parts = -stake x the same multiple.
//  3) Net debt at Sep-27E on the company basis from our cash-flow bridge (half Mar-27E + half Mar-28E), plus investments at
//     book, less leases and spectrum dues. Why not the engine's own net cash: the engine moves 'other liabilities' (which for
//     RIL include Rs1.8 lakh cr of minority interest, deferred tax and spectrum dues) with sales, so a 17% revenue jump on
//     crude prices would 'release' ~Rs77,000 cr of cash that does not exist. Company net debt has sat at Rs1.17-1.25 lakh cr
//     for two years with capex matching operating cash flow.
//  4) P/E cross-check multiple = RIL's own one-year-forward P/E median since Apr-2021 (forwardMedian), nearest half-turn.
// Run until 'unchanged' (the P/E median and the bridge use the built model). Usage: node tools/authoring/RELIANCE.sync.js
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..', '..');
const FILE = path.join(ROOT, 'data', 'raw', 'RELIANCE', 'research', 'assumptions.json');
const MFILE = path.join(ROOT, 'data', 'models', 'RELIANCE.json');
const JIO_OUT = 0.3357, RET_OUT = 0.1644, JPL_ND = 27579, DPL = 99552, INV_BOOK = 150901 - 6296, LEASES = 23579, ND_MAR26 = 124717;

function bridge(M, as) { // company-basis net debt: Mar-26 actual, Mar-27E, Mar-28E, Sep-27E
  const F = M.forecast.F, out = [ND_MAR26];
  for (let i = 0; i < 2; i++) {
    const coEbitda = F.ebitda[i] + as.unallocated[i], cashTax = 0.25 * F.pbt[i];
    const fcf = coEbitda - cashTax - F.interest[i] - F.capex[i] - F.dividends[i] - 450; // 450 = dividends to minorities (FY26 Rs436 cr)
    out.push(out[i] - fcf);
  }
  return { mar26: out[0], mar27: out[1], mar28: out[2], sep27: (out[1] + out[2]) / 2 };
}

function syncAll() {
  delete require.cache[require.resolve('./RELIANCE.val')];
  const { D, half } = require('./RELIANCE.val');
  const as = JSON.parse(fs.readFileSync(FILE, 'utf8')), before = JSON.stringify(as);
  // 1) eliminations
  const S = k => as.segments.find(s => s.key === k), gross = ['o2c', 'ep', 'jio', 'ret', 'oth'];
  const r = -S('elim').base / gross.reduce((t, k) => t + S(k).base, 0);
  const tot = [0, 1, 2].map(i => gross.reduce((t, k) => { const s = S(k); return t + s.base * s.growth.slice(0, i + 1).reduce((p, g) => p * (1 + g / 100), 1); }, 0));
  const el = tot.map(x => -r * x);
  S('elim').growth = el.map((x, i) => Math.round(((x / (i ? el[i - 1] : S('elim').base)) - 1) * 10000) / 100);
  // 2) multiples
  const P = as.valuation.parts, part = re => P.find(p => re.test(p.name));
  part(/^Oil to Chemicals/).multiple = D.o2c.mult; part(/^Jio Platforms/).multiple = D.jio.mult; part(/^Retail/).multiple = D.ret.mult;
  const neg = (m, s) => Object.fromEntries(Object.entries(m).map(([k, v]) => [k, -Math.round(v * s * 10000) / 10000]));
  part(/33\.57% of Jio/).multiple = neg(D.jio.mult, JIO_OUT);
  const jAdj = Math.round(JIO_OUT * (JPL_ND + DPL)); part(/33\.57% of Jio/).adj = { base: jAdj, bull: jAdj, bear: jAdj };
  part(/16\.44% of Reliance Retail/).multiple = neg(D.ret.mult, RET_OUT);
  // 3) net debt lines (replace the engine netCash part)
  let M = fs.existsSync(MFILE) ? JSON.parse(fs.readFileSync(MFILE, 'utf8')) : null;
  const B = M ? bridge(M, as) : { sep27: ND_MAR26 }, nd = -Math.round(B.sep27 / 10) * 10;
  const k = P.findIndex(p => p.netCash || /^Less: net debt/.test(p.name));
  const ndPart = { name: 'Less: net debt at Sep-27E (company basis)', adj: { base: nd, bull: nd, bear: nd }, metricLabel: 'Gross debt less cash and marketable securities; half Mar-27E + half Mar-28E from our cash-flow bridge (RELIANCE.sync.js)', note: `Mar-26 Rs1,24,717 cr; Jun-26 Rs1,22,914 cr. Bridge: company EBITDA - cash tax - interest - capex - dividends, no working-capital release.` };
  const extra = [
    { name: 'Add: investments at book (JDFPL preference shares, JVs, bonds)', adj: { base: INV_BOOK, bull: INV_BOOK, bear: INV_BOOK }, metricLabel: 'Non-current investments Rs1,50,901 cr less Rs6,296 cr of marketable securities already in net debt (Mar-26)', note: 'JDFPL preference shares Rs98,881 cr (fair value, Level 3), JVs and associates Rs16,226 cr, bonds and other.' },
    { name: 'Less: lease liabilities', adj: { base: -LEASES, bull: -LEASES, bear: -LEASES }, metricLabel: 'Mar-26 (segment EBITDA is before rent)', note: 'Ind AS 116 leases, mostly retail stores and towers.' },
  ];
  const drop = p => p.netCash || /^Less: net debt|^Add: investments at book|^Less: lease liabilities/.test(p.name);
  const at = k >= 0 ? k : P.findIndex(p => /^New Energy/.test(p.name)) + 1;
  const keep = P.filter((p, i) => i < at && !drop(p)), rest = P.filter((p, i) => i >= at && !drop(p));
  as.valuation.parts = [...keep, ndPart, ...extra, ...rest];
  // 4) P/E cross-check
  if (M) {
    const { forwardMedian } = require('./valuation-blend');
    const fm = forwardMedian('RELIANCE', M), pe = as.valuation.blend.methods.find(m => m.key === 'pe');
    pe.multiple = { base: half(fm.median), bull: half(fm.median), bear: half(fm.median) };
  }
  as.valuation.blend.methods = as.valuation.blend.methods.filter(m => m.key !== 'dcf');
  const changed = JSON.stringify(as) !== before;
  if (changed) fs.writeFileSync(FILE, JSON.stringify(as, null, 1));
  console.log(`RELIANCE.sync: ${changed ? 'updated - rebuild: node src/model.js RELIANCE' : 'unchanged'}. O2C ${D.o2c.mult.base}x, Jio ${D.jio.mult.base}x, Retail ${D.ret.mult.base}x; elim growth ${S('elim').growth}; net debt Sep-27E ${-nd}; bridge ${JSON.stringify(B)}`);
  return { changed, B };
}

module.exports = { syncAll, bridge, JIO_OUT, RET_OUT, JPL_ND, DPL, INV_BOOK, LEASES, ND_MAR26 };
if (require.main === module) syncAll();
