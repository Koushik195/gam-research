// Belrise: write the derived multiples into assumptions.json. BELRISE.ctx.js derives the P/E multiple (own forward P/E
// median over the 12 months to 30-Sep-2026 x the same-window auto-component sector move, nearest half-turn; bull = no
// sector move, bear = 25th percentile with the move) and the EV/EBITDA cross-check multiple; this script stores them in
// the valuation block so the engine and the Excel model carry the same target. The forward P/E history uses our FY27-28E
// EPS, so run model → val → model until it reports "unchanged". Usage: node tools/authoring/BELRISE.val.js (also run by BELRISE.js)
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', '..', 'data', 'raw', 'BELRISE', 'research', 'assumptions.json');

function syncMultiples() {
  delete require.cache[require.resolve('./BELRISE.ctx')];
  const X = require('./BELRISE.ctx');
  const as = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  const pe = as.valuation.blend.methods.find(m => m.key === 'pe'), ev = as.valuation.blend.methods.find(m => m.key === 'ev');
  const same = (a, c) => ['base', 'bull', 'bear'].every(key => a?.[key] === c[key]);
  const changed = !same(pe.multiple, X.MULT) || !same(ev.multiple, X.evMULT);
  if (changed) {
    pe.multiple = { ...X.MULT }; ev.multiple = { ...X.evMULT };
    fs.writeFileSync(FILE, JSON.stringify(as, null, 1));
    console.log(`BELRISE.val: updated. P/E ${JSON.stringify(X.MULT)}, EV/EBITDA ${JSON.stringify(X.evMULT)}. Re-run node src/model.js BELRISE, then node tools/authoring/BELRISE.js.`);
  } else console.log(`BELRISE.val: unchanged. P/E ${JSON.stringify(X.MULT)}, EV/EBITDA ${JSON.stringify(X.evMULT)}`);
  return { changed };
}

module.exports = { syncMultiples };
if (require.main === module) syncMultiples();
