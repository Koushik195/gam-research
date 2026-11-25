// Physicswallah: write the derived multiples into assumptions.json. PWL.ctx.js derives the EV/EBITDA multiple (own
// one-year-forward EV/EBITDA median on every daily close from 1-Jan-2026 to 30-Sep-2026, nearest half-turn; bull = 75th
// percentile, bear = 25th percentile; the two-peer sector move is a sensitivity only) and the P/E cross-check the same way.
// The forward series uses our FY27E/FY28E EBITDA and EPS, which do not depend on the multiples, so one pass converges;
// the next `node src/model.js PWL` carries them into the report and the Excel model.
// Usage: node tools/authoring/PWL.val.js   (also run by PWL.js)
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', '..', 'data', 'raw', 'PWL', 'research', 'assumptions.json');

function syncMultiples() {
  delete require.cache[require.resolve('./PWL.ctx')];
  const X = require('./PWL.ctx');
  const as = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  const pe = as.valuation.blend.methods.find(m => m.key === 'pe'), ev = as.valuation.blend.methods.find(m => m.key === 'ev');
  const same = (a, c) => ['base', 'bull', 'bear'].every(key => a?.[key] === c[key]);
  const changed = !same(ev.multiple, X.MULT) || !same(pe.multiple, X.peMULT);
  if (changed) {
    ev.multiple = { ...X.MULT }; pe.multiple = { ...X.peMULT };
    fs.writeFileSync(FILE, JSON.stringify(as, null, 1));
    console.log(`PWL.val: updated. EV/EBITDA ${JSON.stringify(X.MULT)}, P/E ${JSON.stringify(X.peMULT)}. Re-run node src/model.js PWL, then node tools/authoring/PWL.js.`);
  } else console.log(`PWL.val: unchanged. EV/EBITDA ${JSON.stringify(X.MULT)}, P/E ${JSON.stringify(X.peMULT)}`);
  return { changed };
}

module.exports = { syncMultiples };
if (require.main === module) syncMultiples();
