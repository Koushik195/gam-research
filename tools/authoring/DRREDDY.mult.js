// Dr. Reddy's: write the derived multiples into assumptions.json. DRREDDY.ctx.js derives the P/E (own one-year-forward
// P/E median since Apr-2021 on EPS before one-off items x the pharma sector factor of +8.2%, nearest half-turn; bull =
// 75th percentile x factor, bear = 25th percentile x factor) and the EV/EBITDA cross-check multiple (own forward
// EV/EBITDA median x the nine peers' EV/EBITDA factor). The engine's EPS is on the actual share count (834.66 mn), so
// the P/E needs no share-count restatement. The forward series uses our FY27E-FY28E EPS for 2025-26 dates, so a change
// in EPS can move the median: re-run until it prints "unchanged" (normally one pass).
// Usage: node tools/authoring/DRREDDY.mult.js   (also run by DRREDDY.js)
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', '..', 'data', 'raw', 'DRREDDY', 'research', 'assumptions.json');

function syncMult() {
  delete require.cache[require.resolve('./DRREDDY.ctx')];
  const X = require('./DRREDDY.ctx');
  const as = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  const pe = as.valuation.blend.methods.find(m => m.key === 'pe'), ev = as.valuation.blend.methods.find(m => m.key === 'ev');
  const same = (a, c) => ['base', 'bull', 'bear'].every(key => a?.[key] === c[key]);
  const changed = !same(pe.multiple, X.MULT) || !same(ev.multiple, X.evMULT);
  if (changed) {
    pe.multiple = { ...X.MULT }; ev.multiple = { ...X.evMULT };
    fs.writeFileSync(FILE, JSON.stringify(as, null, 1));
    console.log(`DRREDDY.mult: updated. P/E ${JSON.stringify(X.MULT)}; EV/EBITDA ${JSON.stringify(X.evMULT)}. Re-run node src/model.js DRREDDY, then node tools/authoring/DRREDDY.js.`);
  } else console.log(`DRREDDY.mult: unchanged. P/E ${JSON.stringify(X.MULT)}; EV/EBITDA ${JSON.stringify(X.evMULT)}`);
  return { changed };
}

module.exports = { syncMult };
if (require.main === module) syncMult();
