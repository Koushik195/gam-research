// IndiaMART: write the derived multiples into assumptions.json. INDIAMART.ctx.js derives the P/E multiple (own forward P/E
// median since Apr-2021 on EPS before strategic fair-value gains × the three-name sector move (Info Edge, Just Dial,
// Matrimony.com); nearest half-turn) and the EV/EBITDA cross-check multiple; this script stores them in the valuation block
// so the engine and the Excel model carry the same target. EPS does not depend on the multiples, so one pass converges; the
// next `node src/model.js INDIAMART` reproduces the target. Usage: node tools/authoring/INDIAMART.val.js (also run by INDIAMART.js)
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', '..', 'data', 'raw', 'INDIAMART', 'research', 'assumptions.json');

function syncMultiples() {
  delete require.cache[require.resolve('./INDIAMART.ctx')];
  const X = require('./INDIAMART.ctx');
  const as = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  const pe = as.valuation.blend.methods.find(m => m.key === 'pe'), ev = as.valuation.blend.methods.find(m => m.key === 'ev');
  const same = (a, c) => ['base', 'bull', 'bear'].every(key => a?.[key] === c[key]);
  const changed = !same(pe.multiple, X.MULT) || !same(ev.multiple, X.evMULT);
  if (changed) {
    pe.multiple = { ...X.MULT }; ev.multiple = { ...X.evMULT };
    fs.writeFileSync(FILE, JSON.stringify(as, null, 1));
    console.log(`INDIAMART.val: updated. P/E ${JSON.stringify(X.MULT)}, EV/EBITDA ${JSON.stringify(X.evMULT)}. Re-run node src/model.js INDIAMART, then node tools/authoring/INDIAMART.js.`);
  } else console.log(`INDIAMART.val: unchanged. P/E ${JSON.stringify(X.MULT)}, EV/EBITDA ${JSON.stringify(X.evMULT)}`);
  return { changed };
}

module.exports = { syncMultiples };
if (require.main === module) syncMultiples();
