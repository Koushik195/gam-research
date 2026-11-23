// Ather Energy: write the derived multiples into assumptions.json. ATHERENERG.ctx.js derives the EV/Sales
// multiple (own one-year-forward EV/Sales median over the 12 months to 30-Sep-2026 x the auto-OEM sector's
// move against the same-window P/E medians, nearest half-turn; bull = no sector move, bear = 25th percentile x
// the move) and the EV/EBITDA cross-check (auto-OEM peers' median EV/EBITDA at the 30-Sep close). Forward
// sales do not depend on the multiples, so one pass converges; the next `node src/model.js ATHERENERG`
// carries them into the report and the Excel model. Usage: node tools/authoring/ATHERENERG.mult.js (also run by ATHERENERG.js)
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', '..', 'data', 'raw', 'ATHERENERG', 'research', 'assumptions.json');

function syncMult() {
  delete require.cache[require.resolve('./ATHERENERG.ctx')];
  const X = require('./ATHERENERG.ctx');
  const as = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  const evs = as.valuation.blend.methods.find(m => m.key === 'evs'), ev = as.valuation.blend.methods.find(m => m.key === 'ev');
  const same = (a, c) => ['base', 'bull', 'bear'].every(key => a?.[key] === c[key]);
  const changed = !same(evs.multiple, X.MULT) || !same(ev.multiple, X.evMULT);
  if (changed) {
    evs.multiple = { ...X.MULT }; ev.multiple = { ...X.evMULT };
    fs.writeFileSync(FILE, JSON.stringify(as, null, 1));
    console.log(`ATHERENERG.mult: updated. EV/Sales ${JSON.stringify(X.MULT)}, EV/EBITDA ${JSON.stringify(X.evMULT)}. Re-run node src/model.js ATHERENERG, then node tools/authoring/ATHERENERG.js.`);
  } else console.log(`ATHERENERG.mult: unchanged. EV/Sales ${JSON.stringify(X.MULT)}, EV/EBITDA ${JSON.stringify(X.evMULT)}`);
  return { changed };
}

module.exports = { syncMult };
if (require.main === module) syncMult();
