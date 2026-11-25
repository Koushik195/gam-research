// TBO Tek: write the derived multiples into assumptions.json. TBOTEK.ctx.js derives the P/E multiple (own one-year-forward
// P/E median over the 12 months to 30-Sep-2026 x the same-window move of the widened travel + internet peer set; nearest
// half-turn) and the EV/EBITDA cross-check multiple; this script stores them in the valuation block so the engine and the
// Excel model carry the same target. EPS does not depend on the multiples, so one pass converges; the next
// `node src/model.js TBOTEK` reproduces the target. Usage: node tools/authoring/TBOTEK.val.js (also run by TBOTEK.js)
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', '..', 'data', 'raw', 'TBOTEK', 'research', 'assumptions.json');

function syncMultiples() {
  delete require.cache[require.resolve('./TBOTEK.ctx')];
  const X = require('./TBOTEK.ctx');
  const as = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  const pe = as.valuation.blend.methods.find(m => m.key === 'pe'), ev = as.valuation.blend.methods.find(m => m.key === 'ev');
  const same = (a, c) => ['base', 'bull', 'bear'].every(key => a?.[key] === c[key]);
  const changed = !same(pe.multiple, X.MULT) || !same(ev.multiple, X.evMULT);
  if (changed) {
    pe.multiple = { ...X.MULT }; ev.multiple = { ...X.evMULT };
    fs.writeFileSync(FILE, JSON.stringify(as, null, 1));
    console.log(`TBOTEK.val: updated. P/E ${JSON.stringify(X.MULT)}, EV/EBITDA ${JSON.stringify(X.evMULT)}. Re-run node src/model.js TBOTEK, then node tools/authoring/TBOTEK.js.`);
  } else console.log(`TBOTEK.val: unchanged. P/E ${JSON.stringify(X.MULT)}, EV/EBITDA ${JSON.stringify(X.evMULT)}`);
  return { changed };
}

module.exports = { syncMultiples };
if (require.main === module) syncMultiples();
