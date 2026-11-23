// Hyundai Motor India: write the derived multiples into assumptions.json. HYUNDAI.ctx.js derives the P/E
// (own one-year-forward P/E median over the 12 months to 30-Sep-2026 x the auto-OEM sector's move against
// the same-window medians, nearest half-turn; bull = no sector move, bear = 25th percentile x the move) and
// the EV/EBITDA cross-check multiple. EPS does not depend on the multiples, so one pass converges; the next
// `node src/model.js HYUNDAI` carries them into the report and the Excel model.
// Usage: node tools/authoring/HYUNDAI.mult.js   (also run by HYUNDAI.js)
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', '..', 'data', 'raw', 'HYUNDAI', 'research', 'assumptions.json');

function syncMult() {
  delete require.cache[require.resolve('./HYUNDAI.ctx')];
  const X = require('./HYUNDAI.ctx');
  const as = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  const pe = as.valuation.blend.methods.find(m => m.key === 'pe'), ev = as.valuation.blend.methods.find(m => m.key === 'ev');
  const same = (a, c) => ['base', 'bull', 'bear'].every(key => a?.[key] === c[key]);
  const changed = !same(pe.multiple, X.MULT) || !same(ev.multiple, X.evMULT);
  if (changed) {
    pe.multiple = { ...X.MULT }; ev.multiple = { ...X.evMULT };
    fs.writeFileSync(FILE, JSON.stringify(as, null, 1));
    console.log(`HYUNDAI.mult: updated. P/E ${JSON.stringify(X.MULT)}, EV/EBITDA ${JSON.stringify(X.evMULT)}. Re-run node src/model.js HYUNDAI, then node tools/authoring/HYUNDAI.js.`);
  } else console.log(`HYUNDAI.mult: unchanged. P/E ${JSON.stringify(X.MULT)}, EV/EBITDA ${JSON.stringify(X.evMULT)}`);
  return { changed };
}

module.exports = { syncMult };
if (require.main === module) syncMult();
