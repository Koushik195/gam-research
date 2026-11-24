// Alkem Laboratories: write the derived multiples into assumptions.json. ALKEM.ctx.js derives the P/E (Alkem's median
// one-year-forward P/E since Apr-2021 on EPS before exceptional items, x the pharma sector factor of 1.1025, nearest
// half-turn; bull/bear = 75th/25th percentile x the factor) and translates it into the engine's multiple on the engine's
// Sep-28E EPS (which includes minorities, as the engine has no minority line); and the EV/EBITDA cross-check multiple.
// Run with TP_NOCHECK=1 (the ctx refuses to load while assumptions and derivation differ), then rebuild the model.
// Usage: node tools/authoring/ALKEM.mult.js   (repeat until "unchanged"; EPS does not depend on the multiple)
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', '..', 'data', 'raw', 'ALKEM', 'research', 'assumptions.json');

function syncMult() {
  process.env.TP_NOCHECK = '1';
  delete require.cache[require.resolve('./ALKEM.ctx')];
  const X = require('./ALKEM.ctx');
  const as = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  const pe = as.valuation.blend.methods.find(m => m.key === 'pe'), ev = as.valuation.blend.methods.find(m => m.key === 'ev');
  const same = (a, c) => ['base', 'bull', 'bear'].every(key => a?.[key] === c[key]);
  const changed = !same(pe.multiple, X.ENGINE) || !same(ev.multiple, X.EVM);
  pe.why = `How the street values Alkem: P/E (MOSL 27x 12-month-forward EPS, Choice 25x FY28E, BOBCAPS 21x Jun-28E; Nuvama's last public note used SOTP). ${X.MULT.base}x Sep-28E EPS to shareholders = Alkem's ${X.n1(X.HB.med)}x median one-year-forward P/E since Apr-2021 on EPS before exceptional items (A18; ${X.n1(X.HR.med)}x on reported EPS; no trough years) x the pharma sector factor of ${X.k} (median of SUNPHARMA, DIVISLAB, TORNTPHARM, ZYDUSLIFE, CIPLA, AUROPHARMA, IPCALAB, ABBOTINDIA trailing P/E at the 30-Sep close vs their five-year medians, excluding Alkem: +10.25%, PLAYBOOK §7c A20) = ${X.n1(X.HB.med * X.k)}x, rounded to the nearest half-turn. Bull ${X.MULT.bull}x / bear ${X.MULT.bear}x = 75th / 25th percentile (${X.n1(X.HB.p75)}x / ${X.n1(X.HB.p25)}x) x the factor. The engine's EPS includes minorities, so the multiple here is the equivalent on engine EPS: ${X.MULT.base}x x ${X.n1(X.ownersSep)} / ${X.n1(X.epsSep)} = ${X.ENGINE.base}x. No growth, returns or own-de-rating adjustment (sensitivity rows only).`;
  ev.why = `Cross-check. Alkem's median trailing EV/EBITDA since Apr-2021 is ${X.n1(X.HEV.med)}x (Screener); times the EV/EBITDA analogue of the sector factor (${X.pc1(X.sectorEv)}, same eight peers) = ${X.n1(X.HEV.med * X.kev)}x, rounded to ${X.EVM.base}x and applied to trailing EBITDA at the target date (half FY27E + half FY28E) with net cash at Sep-2027. Bull ${X.EVM.bull}x / bear ${X.EVM.bear}x = 75th / 25th percentile x the factor.`;
  if (changed) { pe.multiple = { ...X.ENGINE }; ev.multiple = { ...X.EVM }; }
  fs.writeFileSync(FILE, JSON.stringify(as, null, 1));
  console.log(`ALKEM.mult: ${changed ? 'updated' : 'unchanged'}. P/E engine ${JSON.stringify(X.ENGINE)} (= ${JSON.stringify(X.MULT)} on EPS to shareholders), EV/EBITDA ${JSON.stringify(X.EVM)}.${changed ? ' Re-run node src/model.js ALKEM.' : ''}`);
  return { changed };
}

module.exports = { syncMult };
if (require.main === module) syncMult();
