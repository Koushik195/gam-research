// DMart: write the derived multiples into assumptions.json. DMART.ctx.js derives the P/E multiple (forward P/E
// median since Apr-2021 (house function, reported EPS) x retail-sector de-rating, nearest half-turn; bull = no de-rating, bear = 25th
// percentile de-rated) and the EV/EBITDA cross-check multiple; this script stores them in the valuation block so the engine
// and the Excel model carry the same target. EPS does not depend on the multiples, so one pass converges; the next
// `node src/model.js DMART` reproduces the target. Usage: node tools/authoring/DMART.val.js (also run by DMART.js)
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', '..', 'data', 'raw', 'DMART', 'research', 'assumptions.json');

function syncMultiples() {
  delete require.cache[require.resolve('./DMART.ctx')];
  const X = require('./DMART.ctx');
  const as = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  const pe = as.valuation.blend.methods.find(m => m.key === 'pe'), ev = as.valuation.blend.methods.find(m => m.key === 'ev');
  const same = (a, c) => ['base', 'bull', 'bear'].every(key => a?.[key] === c[key]);
  const changed = !same(pe.multiple, X.MULT) || !same(ev.multiple, X.evMULT);
  if (changed) {
    pe.multiple = { ...X.MULT }; ev.multiple = { ...X.evMULT };
    fs.writeFileSync(FILE, JSON.stringify(as, null, 1));
    console.log(`DMART.val: updated. P/E ${JSON.stringify(X.MULT)}, EV/EBITDA ${JSON.stringify(X.evMULT)}. Re-run node src/model.js DMART, then node tools/authoring/DMART.js.`);
  } else console.log(`DMART.val: unchanged. P/E ${JSON.stringify(X.MULT)}, EV/EBITDA ${JSON.stringify(X.evMULT)}`);
  return { changed };
}

module.exports = { syncMultiples };
if (require.main === module) syncMultiples();
