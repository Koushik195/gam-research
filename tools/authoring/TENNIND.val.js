// Tenneco Clean Air India: write the derived multiples into assumptions.json. TENNIND.ctx.js derives the P/E multiple
// (own one-year-forward P/E median on every daily close since the 19-Nov-2025 listing x the auto-component peers' move
// against their medians over the same window, nearest half-turn; bull = no sector move, bear = 25th percentile x the move)
// and the EV/EBITDA cross-check multiple. The own forward P/E uses our FY27E/FY28E EPS, which does not depend on the
// multiples, so one pass converges; the next `node src/model.js TENNIND` carries them into the report and the Excel model.
// Usage: node tools/authoring/TENNIND.val.js   (also run by TENNIND.js)
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', '..', 'data', 'raw', 'TENNIND', 'research', 'assumptions.json');

function syncMultiples() {
  delete require.cache[require.resolve('./TENNIND.ctx')];
  const X = require('./TENNIND.ctx');
  const as = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  const pe = as.valuation.blend.methods.find(m => m.key === 'pe'), ev = as.valuation.blend.methods.find(m => m.key === 'ev');
  const same = (a, c) => ['base', 'bull', 'bear'].every(key => a?.[key] === c[key]);
  const changed = !same(pe.multiple, X.MULT) || !same(ev.multiple, X.evMULT);
  if (changed) {
    pe.multiple = { ...X.MULT }; ev.multiple = { ...X.evMULT };
    fs.writeFileSync(FILE, JSON.stringify(as, null, 1));
    console.log(`TENNIND.val: updated. P/E ${JSON.stringify(X.MULT)}, EV/EBITDA ${JSON.stringify(X.evMULT)}. Re-run node src/model.js TENNIND, then node tools/authoring/TENNIND.js.`);
  } else console.log(`TENNIND.val: unchanged. P/E ${JSON.stringify(X.MULT)}, EV/EBITDA ${JSON.stringify(X.evMULT)}`);
  return { changed };
}

module.exports = { syncMultiples };
if (require.main === module) syncMultiples();
