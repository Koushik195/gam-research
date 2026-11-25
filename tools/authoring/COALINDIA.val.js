// Coal India: write the derived multiples into assumptions.json. COALINDIA.ctx.js derives the EV/EBITDA multiple (own
// one-year-forward EV/EBITDA median since Apr-2021 x the peers' EV/EBITDA move vs their five-year medians, nearest
// half-turn; bull/bear ± 1 turn) and the P/E cross-check multiple the same way; this script stores them in the valuation
// block so the engine and the Excel model carry the same target. EBITDA and net cash do not depend on the multiples, so
// one pass converges; the next `node src/model.js COALINDIA` reproduces the target.
// Usage: node tools/authoring/COALINDIA.val.js (also run by COALINDIA.js)
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', '..', 'data', 'raw', 'COALINDIA', 'research', 'assumptions.json');

function syncMultiples() {
  delete require.cache[require.resolve('./COALINDIA.ctx')];
  const X = require('./COALINDIA.ctx');
  const as = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  const ev = as.valuation.blend.methods.find(m => m.key === 'ev'), pe = as.valuation.blend.methods.find(m => m.key === 'pe');
  const same = (a, c) => ['base', 'bull', 'bear'].every(key => a?.[key] === c[key]);
  const changed = !same(ev.multiple, X.MULT) || !same(pe.multiple, X.peMULT);
  if (changed) {
    ev.multiple = { base: X.MULT.base, bull: X.MULT.bull, bear: X.MULT.bear }; pe.multiple = { base: X.peMULT.base, bull: X.peMULT.bull, bear: X.peMULT.bear };
    fs.writeFileSync(FILE, JSON.stringify(as, null, 1));
    console.log(`COALINDIA.val: updated. EV/EBITDA ${JSON.stringify(ev.multiple)}, P/E ${JSON.stringify(pe.multiple)}. Re-run node src/model.js COALINDIA, then node tools/authoring/COALINDIA.js.`);
  } else console.log(`COALINDIA.val: unchanged. EV/EBITDA ${JSON.stringify(X.MULT)}, P/E ${JSON.stringify(X.peMULT)}`);
  return { changed };
}

module.exports = { syncMultiples };
if (require.main === module) syncMultiples();
