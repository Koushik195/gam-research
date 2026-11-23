// Bharat Forge: carry the derived multiples into the engine. BHARATFORG.ctx.js derives the P/E multiple (own
// one-year-forward P/E median since Apr-2021 on EPS before exceptional items × auto-component de-rating, nearest
// half-turn; bull = no de-rating; bear = 25th percentile de-rated) and the EV/EBITDA cross-check multiple, and this
// script writes them into assumptions.json. The forward series uses our FY27E-FY28E EPS, which do not depend on
// the multiples, so one pass converges; re-run `node src/model.js BHARATFORG` afterwards.
// Usage: node tools/authoring/BHARATFORG.sync.js   (also run by BHARATFORG.js)
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', '..', 'data', 'raw', 'BHARATFORG', 'research', 'assumptions.json');

function syncMultiples() {
  delete require.cache[require.resolve('./BHARATFORG.ctx')];
  const X = require('./BHARATFORG.ctx');
  const as = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  const prim = as.valuation.blend.methods.find(m => m.role === 'primary'), ev = as.valuation.blend.methods.find(m => m.key === 'ev');
  const same = (a, c) => ['base', 'bull', 'bear'].every(key => a?.[key] === c[key]);
  const changed = !same(prim.multiple, X.MULT) || !same(ev.multiple, X.evMULT);
  if (changed) {
    prim.multiple = { ...X.MULT }; ev.multiple = { ...X.evMULT };
    fs.writeFileSync(FILE, JSON.stringify(as, null, 1));
    console.log(`BHARATFORG.sync: updated. P/E ${JSON.stringify(X.MULT)}, EV/EBITDA ${JSON.stringify(X.evMULT)}. Re-run node src/model.js BHARATFORG, then node tools/authoring/BHARATFORG.js.`);
  } else console.log(`BHARATFORG.sync: unchanged. P/E ${JSON.stringify(X.MULT)}, EV/EBITDA ${JSON.stringify(X.evMULT)}`);
  return { changed };
}

module.exports = { syncMultiples };
if (require.main === module) syncMultiples();
