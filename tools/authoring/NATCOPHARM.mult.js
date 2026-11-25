// Natco Pharma: write the derived multiples into assumptions.json. NATCOPHARM.ctx2.js derives the P/E (house forwardMedian
// since Apr-2021 on reported EPS, trough years excluded as the rule is written, x the pharma sector factor of +8.2%, nearest
// half-turn; bull = 75th percentile x factor, bear = 25th percentile x factor) and the EV/EBITDA cross-check multiple (own
// forward EV/EBITDA median, trough rule on forward EBITDA, x the nine peers' EV/EBITDA factor of +7.5%). The forward series
// uses our FY27E-FY28E EPS for the 2025-26 dates and the trough test uses them too, so a change in EPS can move the median:
// re-run until it prints "unchanged" (normally one pass).
// Usage: node tools/authoring/NATCOPHARM.mult.js   (also run by NATCOPHARM.js)
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', '..', 'data', 'raw', 'NATCOPHARM', 'research', 'assumptions.json');

function syncMult() {
  for (const m of ['./NATCOPHARM.ctx', './NATCOPHARM.ctx2']) delete require.cache[require.resolve(m)];
  const X = require('./NATCOPHARM.ctx2');
  const as = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  const pe = as.valuation.blend.methods.find(m => m.key === 'pe'), ev = as.valuation.blend.methods.find(m => m.key === 'ev');
  const same = (a, c) => ['base', 'bull', 'bear'].every(key => a?.[key] === c[key]);
  const changed = !same(pe.multiple, X.MULT) || !same(ev.multiple, X.evMULT);
  if (changed) {
    pe.multiple = { ...X.MULT }; ev.multiple = { ...X.evMULT };
    fs.writeFileSync(FILE, JSON.stringify(as, null, 1));
    console.log(`NATCOPHARM.mult: updated. P/E ${JSON.stringify(X.MULT)}; EV/EBITDA ${JSON.stringify(X.evMULT)}. Re-run node src/model.js NATCOPHARM, then node tools/authoring/NATCOPHARM.js.`);
  } else console.log(`NATCOPHARM.mult: unchanged. P/E ${JSON.stringify(X.MULT)}; EV/EBITDA ${JSON.stringify(X.evMULT)}`);
  return { changed };
}

module.exports = { syncMult };
if (require.main === module) syncMult();
