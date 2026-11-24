// Vishal Mega Mart: write the derived multiples into assumptions.json. VMM.ctx.js derives the P/E multiple (own one-year-
// forward P/E median over the 12 months to 30-Sep-2026, post-listing months skipped, x the retail peers' P/E move against
// their own medians over the same window, nearest half-turn; bull = no move, bear = 25th percentile x the move) and the
// EV/EBITDA cross-check multiple; this script stores them so the engine and the Excel model carry the same target. EPS does
// not depend on the multiples, so one pass converges; the next `node src/model.js VMM` reproduces the target.
// Usage: node tools/authoring/VMM.val.js (also run by VMM.js)
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', '..', 'data', 'raw', 'VMM', 'research', 'assumptions.json');

function syncMultiples() {
  delete require.cache[require.resolve('./VMM.ctx')];
  const X = require('./VMM.ctx');
  const as = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  const pe = as.valuation.blend.methods.find(m => m.key === 'pe'), ev = as.valuation.blend.methods.find(m => m.key === 'ev');
  const same = (a, c) => ['base', 'bull', 'bear'].every(key => a?.[key] === c[key]);
  const changed = !same(pe.multiple, X.MULT) || !same(ev.multiple, X.evMULT);
  if (changed) {
    pe.multiple = { ...X.MULT }; ev.multiple = { ...X.evMULT };
    fs.writeFileSync(FILE, JSON.stringify(as, null, 1));
    console.log(`VMM.val: updated. P/E ${JSON.stringify(X.MULT)}, EV/EBITDA ${JSON.stringify(X.evMULT)}. Re-run node src/model.js VMM, then node tools/authoring/VMM.js.`);
  } else console.log(`VMM.val: unchanged. P/E ${JSON.stringify(X.MULT)}, EV/EBITDA ${JSON.stringify(X.evMULT)}`);
  return { changed };
}

module.exports = { syncMultiples };
if (require.main === module) syncMultiples();
