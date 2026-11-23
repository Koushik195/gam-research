// Zydus Lifesciences: write the derived multiples into assumptions.json. ZYDUSLIFE.ctx.js derives the P/E (own
// one-year-forward P/E median since Apr-2021 on EPS before one-offs x the pharma sector factor of +5.45%, nearest
// half-turn; bull = 75th percentile x factor, bear = 25th percentile x factor) and the EV/EBITDA cross-check multiple.
// The P/E applies to EPS per post-buyback share (99.75 cr shares after the Jun-2026 buyback); the engine's EPS is on the
// FY26 count (100.62 cr), so the primary method carries the implied multiple = derived multiple x 100.62 / 99.75.
// EPS does not depend on the multiples, so one pass converges; the next `node src/model.js ZYDUSLIFE` carries them
// into the report and the Excel model.
// Usage: node tools/authoring/ZYDUSLIFE.mult.js   (also run by ZYDUSLIFE.js)
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', '..', 'data', 'raw', 'ZYDUSLIFE', 'research', 'assumptions.json');

function syncMult() {
  delete require.cache[require.resolve('./ZYDUSLIFE.ctx')];
  const X = require('./ZYDUSLIFE.ctx');
  const as = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  const pe = as.valuation.blend.methods.find(m => m.key === 'pe'), ev = as.valuation.blend.methods.find(m => m.key === 'ev');
  const same = (a, c) => ['base', 'bull', 'bear'].every(key => a?.[key] === c[key]);
  const changed = !same(pe.multiple, X.IMPLIED) || !same(ev.multiple, X.evMULT) || !same(as.valuation.derivedPe, X.MULT);
  if (changed) {
    pe.multiple = { ...X.IMPLIED }; ev.multiple = { ...X.evMULT };
    as.valuation.derivedPe = { ...X.MULT, _note: 'Derived P/E on EPS per post-buyback share (99.75 cr); pe.multiple is the same value restated on the engine EPS (100.62 cr shares).' };
    fs.writeFileSync(FILE, JSON.stringify(as, null, 1));
    console.log(`ZYDUSLIFE.mult: updated. P/E ${JSON.stringify(X.MULT)} -> implied ${JSON.stringify(X.IMPLIED)}; EV/EBITDA ${JSON.stringify(X.evMULT)}. Re-run node src/model.js ZYDUSLIFE, then node tools/authoring/ZYDUSLIFE.js.`);
  } else console.log(`ZYDUSLIFE.mult: unchanged. P/E ${JSON.stringify(X.MULT)} (implied ${JSON.stringify(X.IMPLIED)}); EV/EBITDA ${JSON.stringify(X.evMULT)}`);
  return { changed };
}

module.exports = { syncMult };
if (require.main === module) syncMult();
