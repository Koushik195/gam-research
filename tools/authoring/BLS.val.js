// BLS International: write the derived multiples into assumptions.json. BLS.ctx.js derives the P/E multiple (own one-year-forward
// P/E median since Apr-2021 x the move of the widened travel + internet peer set vs five-year medians; nearest
// half-turn) and the EV/EBITDA cross-check multiple; this script stores them in the valuation block so the engine and the
// Excel model carry the same target. EPS does not depend on the multiples, so one pass converges; the next
// `node src/model.js BLS` reproduces the target. Usage: node tools/authoring/BLS.val.js (also run by BLS.js)
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', '..', 'data', 'raw', 'BLS', 'research', 'assumptions.json');

function syncMultiples() {
  delete require.cache[require.resolve('./BLS.ctx')];
  const X = require('./BLS.ctx');
  const as = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  const pe = as.valuation.blend.methods.find(m => m.key === 'pe'), ev = as.valuation.blend.methods.find(m => m.key === 'ev');
  const same = (a, c) => ['base', 'bull', 'bear'].every(key => a?.[key] === c[key]);
  const changed = !same(pe.multiple, X.MULT) || !same(ev.multiple, X.evMULT);
  if (changed) {
    pe.multiple = { ...X.MULT }; ev.multiple = { ...X.evMULT };
    fs.writeFileSync(FILE, JSON.stringify(as, null, 1));
    console.log(`BLS.val: updated. P/E ${JSON.stringify(X.MULT)}, EV/EBITDA ${JSON.stringify(X.evMULT)}. Re-run node src/model.js BLS, then node tools/authoring/BLS.js.`);
  } else console.log(`BLS.val: unchanged. P/E ${JSON.stringify(X.MULT)}, EV/EBITDA ${JSON.stringify(X.evMULT)}`);
  return { changed };
}

module.exports = { syncMultiples };
if (require.main === module) syncMultiples();
