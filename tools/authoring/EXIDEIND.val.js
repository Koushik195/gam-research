// Exide: write the derived SOTP parts and the P/E cross-check multiple into assumptions.json. EXIDEIND.ctx.js derives
// the core P/E (own core forward P/E since the Exide Life sale x auto-component de-rating, nearest half-turn), values
// HDFC Life at the 30-Sep-2026 close less a discount and EESL at book less the PV of losses to breakeven; this script
// stores those values as the parts' adjustments so the engine and the Excel model carry the same target. EPS does not
// depend on the parts, so one pass converges; the next `node src/model.js EXIDEIND` reproduces the target.
// Usage: node tools/authoring/EXIDEIND.val.js (also run by EXIDEIND.js)
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', '..', 'data', 'raw', 'EXIDEIND', 'research', 'assumptions.json');

function syncMultiples() {
  delete require.cache[require.resolve('./EXIDEIND.ctx')];
  const X = require('./EXIDEIND.ctx');
  const as = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  const r = o => Object.fromEntries(X.CASES.map(c => [c, Math.round(o[c])]));
  const [core, hdfc, eesl] = as.valuation.parts;
  const want = { core: r(X.coreVal), hdfc: r(X.hdfcVal), eesl: r(Object.fromEntries(X.CASES.map(c => [c, X.eesl[c].value]))) };
  const pe = as.valuation.blend.methods.find(m => m.key === 'pe');
  const same = (a, c) => X.CASES.every(k => a?.[k] === c[k]);
  const changed = !same(core.adj, want.core) || !same(hdfc.adj, want.hdfc) || !same(eesl.adj, want.eesl) || !same(pe.multiple, X.peMULT);
  core.adj = want.core; hdfc.adj = want.hdfc; eesl.adj = want.eesl; pe.multiple = { ...X.peMULT };
  core.multiple = undefined;
  core.metricLabel = `Sep-28E standalone EPS Rs${X.n1(X.epsSep.base)} less HDFC Life dividend Rs${X.hdfcDivPS.toFixed(2)} x ${X.MULT.base}x (bull ${X.MULT.bull}x on Rs${X.n1(X.epsSep.bull)}, bear ${X.MULT.bear}x on Rs${X.n1(X.epsSep.bear)}) x ${X.shares.toFixed(2)} cr shares`;
  core.note = `Core P/E = Exide's own forward P/E net of its investments (median ${X.coreMed}x since the Exide Life sale, Jan-2022 to Sep-2026) x the auto-component sector move (${X.pc1(X.sectorDr)}), nearest half-turn.`;
  hdfc.metricLabel = `${X.HDFC_SH.toFixed(2)} cr shares x Rs${X.HDFC_PX} (NSE close, 30-Sep-2026) = Rs${X.n0(X.hdfcMV)} cr, less ${X.DISC.base}% (bull ${X.DISC.bull}%, bear ${X.DISC.bear}%)`;
  hdfc.note = 'Discount = the one MOFSL applies (Rs45/share at the 31-Jul-2026 price of Rs548.5); shares unchanged since 1-Jan-2022 (AR FY26 note 4; HDFC Life Jun-2026 pattern).';
  eesl.metricLabel = `Book equity at Sep-27E Rs${X.n0(X.eesl.base.book)} cr (Mar-26 Rs4,025 cr + FY27 infusion Rs1,400 cr − losses) x ${X.eesl.base.mult} less PV of losses to breakeven Rs${X.n0(X.eesl.base.pv)} cr (bear: 0.5x book)`;
  eesl.note = 'GAM loss path FY27-30E Rs450/350/190/0 cr (bull 400/220/60/0, bear 550/500/350/150), discounted at 12.5% (PLAYBOOK §7c: present value of losses to breakeven).';
  if (changed) {
    fs.writeFileSync(FILE, JSON.stringify(as, null, 1));
    console.log(`EXIDEIND.val: updated. core ${JSON.stringify(want.core)}, HDFC ${JSON.stringify(want.hdfc)}, EESL ${JSON.stringify(want.eesl)}, P/E ${JSON.stringify(X.peMULT)}. Re-run node src/model.js EXIDEIND, then node tools/authoring/EXIDEIND.js.`);
  } else { fs.writeFileSync(FILE, JSON.stringify(as, null, 1)); console.log(`EXIDEIND.val: unchanged. core ${JSON.stringify(want.core)}, P/E ${JSON.stringify(X.peMULT)}`); }
  return { changed };
}

module.exports = { syncMultiples };
if (require.main === module) syncMultiples();
