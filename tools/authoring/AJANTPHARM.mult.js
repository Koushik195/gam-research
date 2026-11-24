// Ajanta Pharma: write the derived inputs into assumptions.json, from AJANTPHARM.ctx.js:
//   (1) revenueGrowth from the market build (businessLines), (2) the other-income carry (FY26 treasury income on the Mar-26
//   book + miscellaneous income − the engine's 7.5% on Mar-26 net cash), (3) the P/E multiples (Ajanta's median
//   one-year-forward P/E since Apr-2021 on reported EPS, house forwardMedian, x the pharma factor 1.082 for names outside the
//   nine-peer set, nearest half-turn; bull/bear = 75th/25th percentile x the factor) and (4) the EV/EBITDA cross-check
//   multiples (trailing EV/EBITDA median since Apr-2021 x 1.075). Run with TP_NOCHECK=1 (the ctx refuses to load while
//   assumptions and derivation differ), then rebuild the model. The forward-P/E history uses our FY27E/FY28E EPS, so repeat
//   (mult → model) until it prints "unchanged".
// Usage: node tools/authoring/AJANTPHARM.mult.js
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', '..', 'data', 'raw', 'AJANTPHARM', 'research', 'assumptions.json');

function syncMult() {
  process.env.TP_NOCHECK = '1';
  delete require.cache[require.resolve('./AJANTPHARM.ctx')];
  const X = require('./AJANTPHARM.ctx');
  const as = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  const pe = as.valuation.blend.methods.find(m => m.key === 'pe'), ev = as.valuation.blend.methods.find(m => m.key === 'ev');
  const same = (a, c) => ['base', 'bull', 'bear'].every(key => a?.[key] === c[key]);
  const sameArr = (a, c, tol) => a.length === c.length && a.every((v, i) => Math.abs(v - c[i]) < tol);
  const oi = X.YRS.map(() => X.OI_CARRY);
  const changed = !same(pe.multiple, X.MULT) || !same(ev.multiple, X.EVM) || !sameArr(as.revenueGrowth, X.growthFromBuild, 0.0015) || !sameArr(as.otherIncome, oi, 0.05);
  pe.why = `How the street values Ajanta: P/E (MOSL 32x 12-month-forward EPS, PL and ICICI Direct 32x FY28E, BOBCAPS 30x Jun-28E, ICICI Securities 28x FY28E; Jefferies' method not public). ${X.MULT.base}x Sep-28E EPS = Ajanta's ${X.n1(X.HB.med)}x median one-year-forward P/E since Apr-2021 (house forwardMedian, reported EPS: the company reports no exceptional items; no trough years) x the pharma sector factor of ${X.k} (median of the nine-peer set's trailing P/E at the 30-Sep close vs their five-year medians: +8.2% for names outside the set, PLAYBOOK §7c A21) = ${X.n1(X.HB.med * X.k)}x, rounded to the nearest half-turn. Bull ${X.MULT.bull}x / bear ${X.MULT.bear}x = 75th / 25th percentile (${X.n1(X.HB.p75)}x / ${X.n1(X.HB.p25)}x) x the factor. No growth, returns or own-move adjustment (sensitivity rows only).`;
  ev.why = `Cross-check. Ajanta's median trailing EV/EBITDA since Apr-2021 is ${X.n1(X.HEV.med)}x (Screener); times the EV/EBITDA analogue of the sector factor (+7.5%, PLAYBOOK §7c A21) = ${X.n1(X.HEV.med * X.kev)}x, rounded to ${X.EVM.base}x and applied to trailing EBITDA at the target date (half FY27E + half FY28E) with net cash at Sep-2027. Bull ${X.EVM.bull}x / bear ${X.EVM.bear}x = 75th / 25th percentile x the factor.`;
  if (changed) { pe.multiple = { ...X.MULT }; ev.multiple = { ...X.EVM }; as.revenueGrowth = X.growthFromBuild.slice(); as.otherIncome = oi; }
  fs.writeFileSync(FILE, JSON.stringify(as, null, 1));
  console.log(`AJANTPHARM.mult: ${changed ? 'updated' : 'unchanged'}. revenueGrowth ${JSON.stringify(as.revenueGrowth)}, otherIncome ${X.OI_CARRY}, P/E ${JSON.stringify(X.MULT)}, EV/EBITDA ${JSON.stringify(X.EVM)}.${changed ? ' Re-run node src/model.js AJANTPHARM.' : ''}`);
  return { changed };
}

module.exports = { syncMult };
if (require.main === module) syncMult();
