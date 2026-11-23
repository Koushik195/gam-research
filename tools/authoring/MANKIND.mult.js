// Mankind Pharma: write the derived multiples into assumptions.json. MANKIND.ctx.js derives the P/E (Mankind's median
// one-year-forward P/E since 1-Nov-2023 on EPS before exceptional items and before the BSV amortisation, x the pharma
// sector factor of 1.110, nearest half-turn; bull/bear = 75th/25th percentile x the factor) and translates it into the
// engine's multiple on reported Sep-28E EPS (the engine values reported EPS); and the EV/EBITDA cross-check multiple.
// Run with TP_NOCHECK=1 (the ctx refuses to load while assumptions and derivation differ), then rebuild the model.
// Usage: TP_NOCHECK=1 node tools/authoring/MANKIND.mult.js   (repeat until "unchanged"; EPS does not depend on the multiple)
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', '..', 'data', 'raw', 'MANKIND', 'research', 'assumptions.json');

function syncMult() {
  process.env.TP_NOCHECK = '1';
  delete require.cache[require.resolve('./MANKIND.ctx')];
  const X = require('./MANKIND.ctx');
  const as = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  const pe = as.valuation.blend.methods.find(m => m.key === 'pe'), ev = as.valuation.blend.methods.find(m => m.key === 'ev');
  const same = (a, c) => ['base', 'bull', 'bear'].every(key => a?.[key] === c[key]);
  const changed = !same(pe.multiple, X.ENGINE) || !same(ev.multiple, X.EVM);
  if (changed) {
    pe.multiple = { ...X.ENGINE }; ev.multiple = { ...X.EVM };
    fs.writeFileSync(FILE, JSON.stringify(as, null, 1));
    console.log(`MANKIND.mult: updated. P/E engine ${JSON.stringify(X.ENGINE)} (= ${JSON.stringify(X.MULT)} on adjusted EPS), EV/EBITDA ${JSON.stringify(X.EVM)}. Re-run node src/model.js MANKIND.`);
  } else console.log(`MANKIND.mult: unchanged. P/E engine ${JSON.stringify(X.ENGINE)} (= ${JSON.stringify(X.MULT)}), EV/EBITDA ${JSON.stringify(X.EVM)}`);
  return { changed };
}

module.exports = { syncMult };
if (require.main === module) syncMult();
