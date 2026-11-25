// IRCTC: write the derived multiples into assumptions.json. IRCTC.ctx.js derives the P/E multiple (own forward P/E median
// since Apr-2021 × the five-name sector move (internet platforms + railway-PSU services); nearest half-turn) and the
// EV/EBITDA cross-check multiple; this script stores them in the valuation block so the engine and the Excel model carry
// the same target. EPS does not depend on the multiples, so one pass converges; the next `node src/model.js IRCTC`
// reproduces the target. Usage: node tools/authoring/IRCTC.val.js (also run by IRCTC.js)
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', '..', 'data', 'raw', 'IRCTC', 'research', 'assumptions.json');

function syncMultiples() {
  delete require.cache[require.resolve('./IRCTC.ctx')];
  const X = require('./IRCTC.ctx');
  const as = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  const pe = as.valuation.blend.methods.find(m => m.key === 'pe'), ev = as.valuation.blend.methods.find(m => m.key === 'ev');
  const same = (a, c) => ['base', 'bull', 'bear'].every(key => a?.[key] === c[key]);
  const changed = !same(pe.multiple, X.MULT) || !same(ev.multiple, X.evMULT);
  if (changed) {
    pe.multiple = { ...X.MULT }; ev.multiple = { ...X.evMULT };
    fs.writeFileSync(FILE, JSON.stringify(as, null, 1));
    console.log(`IRCTC.val: updated. P/E ${JSON.stringify(X.MULT)}, EV/EBITDA ${JSON.stringify(X.evMULT)}. Re-run node src/model.js IRCTC, then node tools/authoring/IRCTC.js.`);
  } else console.log(`IRCTC.val: unchanged. P/E ${JSON.stringify(X.MULT)}, EV/EBITDA ${JSON.stringify(X.evMULT)}`);
  return { changed };
}

module.exports = { syncMultiples };
if (require.main === module) syncMultiples();
