// Asahi India Glass: write the derived multiples into assumptions.json. ASAHIINDIA.ctx.js derives the EV/EBITDA target
// multiple (own forward EV/EBITDA median since Apr-2021 x the auto-component EV/EBITDA de-rating, nearest half-turn;
// bull = no de-rating, bear = 25th percentile de-rated) and the P/E cross-check multiple; this script stores them in the
// valuation block so the engine and the Excel model carry the same target. EBITDA and EPS do not depend on the multiples,
// so one pass converges; the
// next `node src/model.js ASAHIINDIA` reproduces the target. Usage: node tools/authoring/ASAHIINDIA.val.js (also run by ASAHIINDIA.js)
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', '..', 'data', 'raw', 'ASAHIINDIA', 'research', 'assumptions.json');

function syncMultiples() {
  delete require.cache[require.resolve('./ASAHIINDIA.ctx')];
  const X = require('./ASAHIINDIA.ctx');
  const as = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  const ev = as.valuation.blend.methods.find(m => m.key === 'ev'), pe = as.valuation.blend.methods.find(m => m.key === 'pe');
  const same = (a, c) => ['base', 'bull', 'bear'].every(key => a?.[key] === c[key]);
  const changed = !same(ev.multiple, X.EVM) || !same(pe.multiple, X.MULT);
  if (changed) {
    ev.multiple = { ...X.EVM }; pe.multiple = { ...X.MULT };
    fs.writeFileSync(FILE, JSON.stringify(as, null, 1));
    console.log(`ASAHIINDIA.val: updated. P/E ${JSON.stringify(X.MULT)}, EV/EBITDA ${JSON.stringify(X.EVM)}. Re-run node src/model.js ASAHIINDIA, then node tools/authoring/ASAHIINDIA.js.`);
  } else console.log(`ASAHIINDIA.val: unchanged. P/E ${JSON.stringify(X.MULT)}, EV/EBITDA ${JSON.stringify(X.EVM)}`);
  return { changed };
}

module.exports = { syncMultiples };
if (require.main === module) syncMultiples();
