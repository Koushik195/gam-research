// Caplin Point: write the derived inputs into assumptions.json, then rebuild the model, until nothing changes.
// CAPLIPOINT.ctx.js derives (1) revenueGrowth from the segment build (businessLines), (2) the other-income carry (6.4% on
// the gap between the gross treasury book and the engine's net cash + grants and miscellaneous income), (3) the engine tax
// rate = (20.5% tax on PBT + minorities) / PBT from taxBuild, (4) the P/E multiples (Caplin's median one-year-forward P/E
// since Apr-2021 on reported EPS, house forwardMedian, x the pharma factor 1.082 for names outside the nine-peer set,
// nearest half-turn; bull/bear = 75th/25th percentile x the factor) and (5) the EV/EBITDA cross-check multiples (trailing
// EV/EBITDA median since Apr-2021 x 1.075). The ctx refuses to load while assumptions and derivation differ, so this runs
// it with TP_NOCHECK=1. The forward-P/E history uses our FY27E/FY28E EPS, hence the loop.
// Usage: node tools/authoring/CAPLIPOINT.mult.js   (runs src/model.js itself; repeats until "unchanged")
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const ROOT = path.join(__dirname, '..', '..');
const FILE = path.join(ROOT, 'data', 'raw', 'CAPLIPOINT', 'research', 'assumptions.json');
const same = (a, c) => JSON.stringify(a) === JSON.stringify(c);
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);

function syncOnce() {
  process.env.TP_NOCHECK = '1';
  for (const m of ['./CAPLIPOINT.ctx', './CAPLIPOINT.core']) delete require.cache[require.resolve(m)];
  const X = require('./CAPLIPOINT.ctx');
  const as = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  const pe = as.valuation.blend.methods.find(m => m.key === 'pe'), ev = as.valuation.blend.methods.find(m => m.key === 'ev');
  const want = { revenueGrowth: X.growthFromBuild.slice(), otherIncome: X.YRS.map(() => X.OI_CARRY), taxRate: X.taxRateBuild.slice(), pe: { ...X.MULT }, ev: { ...X.EVM } };
  const peWhy = `How the street values Caplin: the only broker note standing on 30-Sep-2026 that discloses a method (ICICI Securities, 13-Aug-2026) uses P/E, 26x FY28E EPS; ICICI used EV/EBITDA until Feb-2026. P/E is also the house method for thinly covered pharma names. ${X.MULT.base}x Sep-28E EPS = Caplin's ${n1(X.HB.med)}x median one-year-forward P/E since Apr-2021 (house forwardMedian, ${X.HB.n} points, reported EPS: the company reports no exceptional items; no trough years, EPS rose every year from ₹32.0 in FY21 to ₹84.4 in FY26) x the pharma sector factor of ${X.k} (median of the nine-peer set's trailing P/E at the 30-Sep close vs their five-year medians: +8.2% for names outside the set, PLAYBOOK §7c A21; reproduced at ${X.sectorCalc.toFixed(2)}%) = ${n1(X.HB.med * X.k)}x, rounded to the nearest half-turn. Bull ${X.MULT.bull}x / bear ${X.MULT.bear}x = 75th / 25th percentile (${n1(X.HB.p75)}x / ${n1(X.HB.p25)}x) x the factor. No growth, returns or own-move adjustment; the post-re-rating window since Apr-2024 (${n1(X.H24.med)}x, ${X.SENS.w24}x with the same-window peer move) is a sensitivity row. The model's EPS is EPS to shareholders (minorities in the tax line). Checked in CAPLIPOINT.ctx.js; written by CAPLIPOINT.mult.js.`;
  const evWhy = `Cross-check. Caplin's median trailing EV/EBITDA since Apr-2021 is ${n1(X.HEV.med)}x (Screener); times the EV/EBITDA analogue of the sector factor (+7.5%, PLAYBOOK §7c A21) = ${n1(X.HEV.med * X.kev)}x, rounded to ${X.EVM.base}x and applied to trailing EBITDA at the target date (half FY27E + half FY28E) plus the engine's net cash at Sep-2027 (which deducts the ₹216.6 cr Caplin Steriles CCPS at book). Bull ${X.EVM.bull}x / bear ${X.EVM.bear}x = 75th / 25th percentile x the factor.`;
  const changed = !same(as.revenueGrowth, want.revenueGrowth) || !same(as.otherIncome, want.otherIncome) || !same(as.taxRate, want.taxRate) || !same(pe.multiple, want.pe) || !same(ev.multiple, want.ev) || pe.why !== peWhy || ev.why !== evWhy;
  if (changed) {
    as.revenueGrowth = want.revenueGrowth; as.otherIncome = want.otherIncome; as.taxRate = want.taxRate; pe.multiple = want.pe; ev.multiple = want.ev; pe.why = peWhy; ev.why = evWhy;
    fs.writeFileSync(FILE, JSON.stringify(as, null, 1));
  }
  return { changed, want };
}

if (require.main === module) {
  for (let i = 0; i < 10; i++) {
    const { changed, want } = syncOnce();
    console.log(`CAPLIPOINT.mult pass ${i + 1}: ${changed ? 'updated' : 'unchanged'} ${JSON.stringify(want)}`);
    if (!changed) break;
    execFileSync(process.execPath, [path.join(ROOT, 'src', 'model.js'), 'CAPLIPOINT'], { stdio: 'inherit' });
  }
}
module.exports = { syncOnce };
