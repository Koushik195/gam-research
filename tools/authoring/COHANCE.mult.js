// Cohance Lifesciences: write the derived multiples and the built other income, interest and tax-plus-minorities rate into
// assumptions.json. COHANCE.ctxB.js derives the P/E (median one-year-forward P/E since 1-Apr-2021 on every weekly close plus the
// 30-Sep close, post-merger per-share basis, EPS before exceptional items, trough years FY26-FY28 left out, x 1.082, nearest
// half-turn; bull/bear = 75th/25th percentile x 1.082) and the EV/EBITDA cross-check (same dates, x 1.075). COHANCE.ctxA.js builds
// other income (6.5% on average liquid funds + Rs3.0 cr), interest (leases + borrowings) and tax plus minorities (entity build).
// They depend on the engine's forecasts, so run this after every forecast change, rebuild the model, and repeat until "unchanged".
// Usage: TP_NOCHECK=1 node tools/authoring/COHANCE.mult.js
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', '..', 'data', 'raw', 'COHANCE', 'research', 'assumptions.json');

function syncMult() {
  process.env.TP_NOCHECK = '1';
  for (const m of ['./COHANCE.ctxA', './COHANCE.ctxB', './COHANCE.ctx']) delete require.cache[require.resolve(m)];
  const X = require('./COHANCE.ctx');
  const as = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  const pe = as.valuation.blend.methods.find(m => m.key === 'pe'), ev = as.valuation.blend.methods.find(m => m.key === 'ev');
  const same = (a, c) => ['base', 'bull', 'bear'].every(key => a?.[key] === c[key]);
  const { n1, n2, HB, HREP, HMRG, HF28, MULT, EVM, EVH, k } = X;
  const peWhy = `How the street values Cohance: BOBCAPS, the one broker whose method we could read, uses P/E (40x Jun-28E EPS); the CDMO peers are valued on P/E. Structural break: Suven Pharmaceuticals absorbed Cohance Lifesciences from 1-May-2025 (11 Suven shares for 295 Cohance shares; 25.46 cr to 38.26 cr shares). The own window from that date holds two forward years, FY27E (Rs${n2(X.epsU[0])}) and FY28E (Rs${n2(X.epsU[1])}), and both are trough years (below half of FY25's Rs${n2(X.ex[2025])} before exceptional items, i.e. Rs${n2(X.line(X.ex, 2028))}), so the post-merger window gives no usable median (all points ${n1(HMRG.med)}x; FY28E points ${n1(HF28.med)}x). ${MULT.base}x = the median one-year-forward P/E of the listed share since 1-Apr-2021 on every weekly close plus the 30-Sep close (post-merger per-share basis: FY25 restated EPS on 38.37 cr shares; FY23-24 Suven), on EPS before exceptional items, trough years FY26-FY28 left out (${HB.n} points from the FY23-FY25 forward years), of ${n1(HB.med)}x x 1.082 (the nine pharma peers' trailing P/E at the 30-Sep close vs their five-year medians, the house factor for names outside the set; reproduced ${X.pc1(X.sector5)}) = ${n1(HB.med * k)}x, nearest half-turn. Reported-EPS median ${n1(HREP.med)}x (sensitivity). Bull ${MULT.bull}x / bear ${MULT.bear}x = 75th / 25th percentile (${n1(HB.p75)}x / ${n1(HB.p25)}x) x 1.082. No own-move blend, no growth uplift (sensitivities only). Written by COHANCE.mult.js.`;
  const evWhy = `Cross-check: median one-year-forward EV/EBITDA on the same dates (EV = price x shares then outstanding less the last published net cash; Suven for the FY23-24 forward years, merged pro forma for FY25) of ${n1(EVH.med)}x x 1.075 (the nine peers' EV/EBITDA move against five-year medians; reproduced ${X.pc1(X.sector5Ev)}) = ${n1(EVH.med * X.kev)}x, nearest half-turn, on Sep-28E EBITDA plus Sep-28E net cash after the Rs696 cr minority buy-out liability. Bull ${EVM.bull}x / bear ${EVM.bear}x = 75th / 25th percentile x 1.075.`;
  const intR = X.intBuild.map(v => Math.round(v * 10) / 10);
  const chg = { oi: as.otherIncome.some((v, i) => v !== X.oiBuild[i]), int: as.interest.some((v, i) => v !== intR[i]), tax: as.taxRate.some((v, i) => v !== X.taxBuild[i]) };
  const changed = chg.oi || chg.int || chg.tax || !same(pe.multiple, MULT) || !same(ev.multiple, EVM) || pe.why !== peWhy || ev.why !== evWhy;
  if (changed) {
    pe.multiple = { ...MULT }; ev.multiple = { ...EVM }; pe.why = peWhy; ev.why = evWhy;
    as.otherIncome = X.oiBuild.slice(); as.interest = intR; as.taxRate = X.taxBuild.slice();
    fs.writeFileSync(FILE, JSON.stringify(as, null, 1));
    console.log(`COHANCE.mult: updated. P/E ${JSON.stringify(MULT)}, EV ${JSON.stringify(EVM)}, OI ${JSON.stringify(X.oiBuild)}, interest ${JSON.stringify(intR)}, tax+NCI ${JSON.stringify(X.taxBuild)}. Re-run node src/model.js COHANCE.`);
  } else console.log(`COHANCE.mult: unchanged. P/E ${JSON.stringify(MULT)}, EV ${JSON.stringify(EVM)}, OI ${JSON.stringify(X.oiBuild)}, interest ${JSON.stringify(intR)}, tax+NCI ${JSON.stringify(X.taxBuild)}`);
  return { changed };
}

module.exports = { syncMult };
if (require.main === module) syncMult();
