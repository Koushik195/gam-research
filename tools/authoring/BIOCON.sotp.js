// Biocon: carry the sum of the parts into the engine. The street values Biocon on a sum of the parts (MOSL 6-Aug-2026:
// biosimilars 22x EV/EBITDA, generics 10x, Syngene at market less 15%; Axis Securities 19-Sep-2026: SOTP; Nuvama and
// JM Financial earlier: SOTP). The engine's SOTP method only takes segment drivers of a segment-driven model and has no
// minority line, so BIOCON.ctx2.js derives the multiples (biosimilars: Biocon's own look-through forward EV/EBITDA since
// Apr-2023 x the pharma EV/EBITDA factor; generics: Aurobindo's forward EV/EBITDA since Apr-2021 x the same factor; both
// rounded to the half-turn) and the value of each part per case, and this script writes the IMPLIED P/E per case (sum of
// the parts per share / Sep-28E EPS) into the primary method, the derived consolidated EV/EBITDA cross-check multiples,
// and the parts under assumptions.sotp. EPS does not depend on the multiples, so one pass converges; the next
// `node src/model.js BIOCON` reproduces the target in the report and in the Excel model (TargetPrice = implied P/E x EPS).
// Usage: node tools/authoring/BIOCON.sotp.js   (also run by BIOCON.js)
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', '..', 'data', 'raw', 'BIOCON', 'research', 'assumptions.json');

function syncSotp() {
  for (const m of ['./BIOCON.ctx', './BIOCON.ctx2']) delete require.cache[require.resolve(m)];
  process.env.TP_NOCHECK = '1';
  const X = require('./BIOCON.ctx2');
  delete process.env.TP_NOCHECK;
  const as = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  const prim = as.valuation.blend.methods.find(m => m.role === 'primary'), ev = as.valuation.blend.methods.find(m => m.key === 'ev');
  const r2 = v => Math.round(v * 100) / 100;
  const want = Object.fromEntries(['base', 'bull', 'bear'].map(c => [c, r2(X.SOTP[c].implied)]));
  const parts = Object.fromEntries(['base', 'bull', 'bear'].map(c => [c, { biosimilarsMultiple: X.MBS[c], genericsMultiple: X.MGEN[c], sep28Eps: r2(X.SOTP[c].eps),
    parts: Object.fromEntries(X.SOTP[c].parts.map(p => [p.key, Math.round(p.value)])), totalCr: Math.round(X.SOTP[c].total), perShare: r2(X.SOTP[c].perShare) }]));
  const sotp = { _why: as.sotp._why, syngeneDiscountPct: X.DISC * 100, bicara: { shares: X.BICARA.shares, usd: X.BICARA.px, fx: X.BICARA.fx }, ...parts };
  const same = (a, c) => ['base', 'bull', 'bear'].every(key => a?.[key] === c[key]);
  const changed = !same(prim.multiple, want) || !same(ev.multiple, X.EVM) || JSON.stringify(as.sotp) !== JSON.stringify(sotp);
  if (changed) {
    prim.multiple = want; ev.multiple = { ...X.EVM }; as.sotp = sotp;
    prim.why = `How the street values Biocon: a sum of the parts (MOSL 6-Aug-2026: biosimilars 22x EV/EBITDA, generics 10x, Syngene at market less 15%; Axis Securities 19-Sep-2026 and Nuvama, JM Financial earlier: SOTP). Biosimilars ${X.MBS.base}x Sep-28E EBITDA = Biocon's own look-through one-year-forward EV/EBITDA for the business since Apr-2023 (median ${X.n1(X.HBS.med)}x on ${X.HBS.n} weekly points: market value less the Syngene stake at market less 20%, plus net debt, less generics at Aurobindo's forward median, with BBL's minorities taken pro rata) x the pharma EV/EBITDA factor of +${X.SECTOR_EV}% (nine-name set; Biocon is outside it; PLAYBOOK §7c), rounded to the half-turn. Generics ${X.MGEN.base}x = Aurobindo's forward EV/EBITDA median since Apr-2021 (${X.n1(X.AUD.med)}x) x the same factor (stated peer basis: no own history). Less biopharma net debt at Sep-28E; plus 52.4% of Syngene and the Bicara stake at 30-Sep market value less 20% (house precedent; MOSL uses 15%). No minorities left in parts valued at 100% (BBL wholly owned from 29-Jun-2026). Sum Rs${Math.round(X.SOTP.base.perShare)} a share = ${want.base}x Sep-28E EPS (Rs${X.n1(X.SOTP.base.eps)}). Bull ${X.MBS.bull}x / ${X.MGEN.bull}x (75th percentiles) on bull EBITDA => ${want.bull}x; bear ${X.MBS.bear}x / ${X.MGEN.bear}x (25th percentiles) on bear EBITDA => ${want.bear}x.`;
    ev.why = `Consolidated, on Biocon's own history: ${X.EVM.base}x Sep-28E EBITDA = the ${X.n1(X.EVH.med)}x median trailing EV/EBITDA since Apr-2021 (Screener, EBITDA incl. other income) x the +${X.SECTOR_EV}% factor, restated from the twelve months to Jun-26 (Rs${X.n0(X.ttmChart)} cr incl. other income) to Sep-28E EBITDA before other income (Rs${X.n0(X.ebitdaSep28)} cr). Bull ${X.EVM.bull}x and bear ${X.EVM.bear}x use the 75th and 25th percentiles. The history counts 100% of EBITDA but leaves BBL's minorities (23-24% until Jan-2026) out of EV, so it understates the multiple.`;
    fs.writeFileSync(FILE, JSON.stringify(as, null, 1));
    console.log(`BIOCON.sotp: updated. Biosimilars ${JSON.stringify(X.MBS)}, generics ${JSON.stringify(X.MGEN)}, implied P/E ${JSON.stringify(want)}, EV/EBITDA ${JSON.stringify(X.EVM)}. Re-run node src/model.js BIOCON, then node tools/authoring/BIOCON.js.`);
  } else console.log(`BIOCON.sotp: unchanged. SOTP Rs${X.SOTP.base.perShare.toFixed(0)} (bull Rs${X.SOTP.bull.perShare.toFixed(0)}, bear Rs${X.SOTP.bear.perShare.toFixed(0)}); implied P/E ${JSON.stringify(want)}`);
  return { changed, want };
}

module.exports = { syncSotp };
if (require.main === module) syncSotp();
