// Aurobindo Pharma: write the derived values into assumptions.json. AUROPHARMA.ctx.js derives (a) the P/E: own one-year-
// forward P/E median since Apr-2021 on EPS before exceptional items x the pharma sector factor (+5.45%), nearest half-turn;
// bull = 75th percentile x factor, bear = 25th percentile x factor; (b) the EV/EBITDA cross-check multiple; (c) other income
// built on gross cash (it depends on the engine's net cash, which depends on other income: two passes converge).
// The P/E applies to EPS per post-buyback share (57.54 cr shares after the Apr-May 2026 buyback); the engine's EPS is on the
// FY26 count (58.09 cr), so the primary method carries the implied multiple = derived multiple x 58.09 / 57.54.
// Usage: node tools/authoring/AUROPHARMA.mult.js   (then node src/model.js AUROPHARMA; repeat until 'unchanged')
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', '..', 'data', 'raw', 'AUROPHARMA', 'research', 'assumptions.json');

function syncMult() {
  delete require.cache[require.resolve('./AUROPHARMA.ctx')];
  const X = require('./AUROPHARMA.ctx');
  const as = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  const pe = as.valuation.blend.methods.find(m => m.key === 'pe'), ev = as.valuation.blend.methods.find(m => m.key === 'ev');
  const same = (a, c) => ['base', 'bull', 'bear'].every(key => a?.[key] === c[key]);
  const oi = X.oiBuild.map(v => Math.round(v));
  const oiSame = oi.every((v, i) => Math.abs(v - as.otherIncome[i]) <= 1);
  const changed = !same(pe.multiple, X.IMPLIED) || !same(ev.multiple, X.evMULT) || !same(as.valuation.derivedPe, X.MULT) || !oiSame;
  if (changed) {
    pe.multiple = { ...X.IMPLIED }; ev.multiple = { ...X.evMULT };
    as.valuation.derivedPe = { ...X.MULT, _note: 'Derived P/E on EPS per post-buyback share (57.54 cr); pe.multiple is the same value restated on the engine EPS (58.09 cr shares).' };
    if (!oiSame) as.otherIncome = oi;
    fs.writeFileSync(FILE, JSON.stringify(as, null, 1));
    console.log(`AUROPHARMA.mult: updated. P/E ${JSON.stringify(X.MULT)} -> implied ${JSON.stringify(X.IMPLIED)}; EV/EBITDA ${JSON.stringify(X.evMULT)}; other income ${JSON.stringify(as.otherIncome)}. Re-run node src/model.js AUROPHARMA.`);
  } else console.log(`AUROPHARMA.mult: unchanged. P/E ${JSON.stringify(X.MULT)} (implied ${JSON.stringify(X.IMPLIED)}); EV/EBITDA ${JSON.stringify(X.evMULT)}; other income ${JSON.stringify(as.otherIncome)}`);
  return { changed };
}

module.exports = { syncMult };
if (require.main === module) syncMult();
