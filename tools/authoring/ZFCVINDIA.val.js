// ZF CV India: write the derived multiples into assumptions.json. ZFCVINDIA.ctx.js derives the P/E multiple (forward P/E
// median since Apr-2021 x auto-component sector de-rating, nearest half-turn; bull = no de-rating, bear = 25th
// percentile de-rated) and the EV/EBITDA cross-check multiple; this script stores them in the valuation block so the
// engine and the Excel model carry the same target. EPS does not depend on the multiples, so one pass converges; the
// next `node src/model.js ZFCVINDIA` reproduces the target. Usage: node tools/authoring/ZFCVINDIA.val.js (also run by ZFCVINDIA.js)
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', '..', 'data', 'raw', 'ZFCVINDIA', 'research', 'assumptions.json');

function syncMultiples() {
  delete require.cache[require.resolve('./ZFCVINDIA.ctx')];
  const X = require('./ZFCVINDIA.ctx');
  const as = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  const pe = as.valuation.blend.methods.find(m => m.key === 'pe'), ev = as.valuation.blend.methods.find(m => m.key === 'ev');
  const same = (a, c) => ['base', 'bull', 'bear'].every(key => a?.[key] === c[key]);
  const changed = !same(pe.multiple, X.MULT) || !same(ev.multiple, X.evMULT);
  if (changed) {
    pe.multiple = { ...X.MULT }; ev.multiple = { ...X.evMULT };
    fs.writeFileSync(FILE, JSON.stringify(as, null, 1));
    console.log(`ZFCVINDIA.val: updated. P/E ${JSON.stringify(X.MULT)}, EV/EBITDA ${JSON.stringify(X.evMULT)}. Re-run node src/model.js ZFCVINDIA, then node tools/authoring/ZFCVINDIA.js.`);
  } else console.log(`ZFCVINDIA.val: unchanged. P/E ${JSON.stringify(X.MULT)}, EV/EBITDA ${JSON.stringify(X.evMULT)}`);
  return { changed };
}

module.exports = { syncMultiples };
if (require.main === module) syncMultiples();
