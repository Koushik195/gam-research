// Emcure: write the derived inputs into assumptions.json and rebuild the model until they stop moving.
// (1) Interest and other income from the builds in EMCURE.ctx.js (debt path ↔ profit is circular, so iterate);
// (2) the P/E multiple (Emcure's median one-year-forward P/E since 1-Jan-2025 on EPS before exceptional items × the
//     pharma factor of 1.160, nearest half-turn; bull/bear = 75th/25th percentile × the factor) and the EV/EBITDA
//     cross-check multiple (median trailing EV/EBITDA since 1-Jan-2025 × 1.108), with their "why" text.
// Usage: node tools/authoring/EMCURE.mult.js   (runs src/model.js internally; prints "unchanged" when converged)
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', '..', 'data', 'raw', 'EMCURE', 'research', 'assumptions.json');
const { writeModel } = require('../../src/model');

function once() {
  process.env.TP_NOCHECK = '1';
  delete require.cache[require.resolve('./EMCURE.ctx')];
  const X = require('./EMCURE.ctx');
  const as = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  const pe = as.valuation.blend.methods.find(m => m.key === 'pe'), ev = as.valuation.blend.methods.find(m => m.key === 'ev');
  const int = X.intBuild.map(v => Math.round(v)), oi = X.oiBuild.map(v => Math.round(v));
  const same = (a, c) => ['base', 'bull', 'bear'].every(key => a?.[key] === c[key]);
  const eqArr = (a, c) => a.every((v, i) => v === c[i]);
  const n1 = X.n1;
  const peWhy = `How the street values Emcure: every note standing on 30-Sep-2026 that discloses a method uses P/E (ICICI Direct 30x FY28E, 4-Sep-2026; Motilal Oswal 28x 12-month-forward EPS, 7-Aug-2026; BOB Capital Markets 25x Mar-28E, 6-May-2026; JM Financial 24x Sep-27E, Nov-2025). ${X.MULT.base}x Sep-28E EPS: Emcure's median one-year-forward P/E since 1-Jan-2025 (listed 10-Jul-2024; IPO months skipped; ${X.HB.n} weekly closes plus the 30-Sep close; FY26 EPS before exceptional items and the ₹42.86 cr earn-out true-up = ₹${n1(X.byBase[2026])}, then our FY27-28E), ${n1(X.HB.med)}x, × 1.160 (nine pharma peers' trailing P/E at the 30-Sep close vs their medians over the same window: +16.0%, PLAYBOOK §7c; reproduced ${X.pc1(X.sectorCalc)}) = ${n1(X.HB.med * X.k)}x, nearest half-turn ${X.MULT.base}x. Bull ${X.MULT.bull}x / bear ${X.MULT.bear}x = 75th / 25th percentiles × 1.160. On reported EPS the median is ${n1(X.HR.med)}x (sensitivity). Forecasts carry no exceptional items, so the engine applies the multiple to its own Sep-28E EPS. Checked in EMCURE.ctx.js; written by EMCURE.mult.js.`;
  const evWhy = `Cross-check. Emcure's median trailing EV/EBITDA since 1-Jan-2025 (Screener, ${X.EVH.n} weekly points) is ${n1(X.EVH.med)}x; × 1.108 (the nine peers' EV/EBITDA move against their medians over the same window: +10.8%, PLAYBOOK §7c; reproduced ${X.pc1(X.sectorEvCalc)}) = ${n1(X.EVH.med * X.kev)}x → ${X.EVM.base}x, applied to trailing EBITDA at the target date (half FY27E + half FY28E) less net debt at Sep-27E (engine basis, incl. leases). Bull ${X.EVM.bull}x / bear ${X.EVM.bear}x = 75th / 25th percentiles × 1.108.`;
  const changed = !same(pe.multiple, X.MULT) || !same(ev.multiple, X.EVM) || !eqArr(as.interest, int) || !eqArr(as.otherIncome, oi) || pe.why !== peWhy || ev.why !== evWhy;
  if (changed) {
    pe.multiple = { ...X.MULT }; ev.multiple = { ...X.EVM }; as.interest = int; as.otherIncome = oi; pe.why = peWhy; ev.why = evWhy;
    fs.writeFileSync(FILE, JSON.stringify(as, null, 1));
  }
  return { changed, X, int, oi };
}

function sync(maxIter = 8) {
  for (let i = 0; i < maxIter; i++) {
    const { changed, X, int, oi } = once();
    console.log(`EMCURE.mult pass ${i + 1}: ${changed ? 'updated' : 'unchanged'} | interest ${int} | other income ${oi} | P/E ${JSON.stringify(X.MULT)} | EV ${JSON.stringify(X.EVM)}`);
    if (!changed) return;
    writeModel('EMCURE');
  }
  throw new Error('EMCURE.mult: did not converge');
}

module.exports = { sync };
if (require.main === module) sync();
