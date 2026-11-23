// Tube Investments of India: write the derived SOTP parts into assumptions.json. TIINDIA.ctx.js derives the standalone
// P/E (own pre-CG forward P/E median x auto-component de-rating; bull = no de-rating; bear = 25th percentile de-rated),
// the holding-company discount (base = median since Sep-2024; bull = 2021-26 median, floored at zero; bear = level on
// 30-Sep-2026), the stake values at the 30-Sep-2026 closes and TICMPL (base = TII's cost; bull = Mar-26 fair-value mark;
// bear = PV of the ₹500 cr TII still has to put in, equity worth nothing). Standalone profit does not depend on these
// parts, so one pass converges; the next `node src/model.js TIINDIA` reproduces the target.
// Usage: node tools/authoring/TIINDIA.val.js (also run by TIINDIA.js)
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', '..', 'data', 'raw', 'TIINDIA', 'research', 'assumptions.json');

function syncParts() {
  delete require.cache[require.resolve('./TIINDIA.ctx')];
  const X = require('./TIINDIA.ctx');
  const { SAM, DISC, SOTP, TIC, C, n0, n1, cgPx, sgPx, listedMv, OTHER_UNL, PEM, FM, preMed, sectorDr, saSepPat } = X;
  const as = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  const P = as.valuation.parts, r0 = v => Math.round(v);
  const cases = ['base', 'bull', 'bear'], of = f => Object.fromEntries(cases.map(c => [c, r0(f(c))]));
  const next = [
    { name: 'TII standalone businesses: P/E on Sep-28E core EPS', adj: of(c => SOTP[c].saV),
      metricLabel: `Sep-28E core profit (½ FY28E + ½ FY29E, before CG/Shanthi dividends) ₹${n0(saSepPat('base'))} cr × ${SAM.base}x (bull ${SAM.bull}x on ₹${n0(saSepPat('bull'))} cr, bear ${SAM.bear}x on ₹${n0(saSepPat('bear'))} cr)`,
      note: `TII's own one-year-forward P/E while the share was the standalone business only (listing to Mar-2020): median ${n1(preMed)}x, cut by the ${Math.abs(sectorDr).toFixed(1)}% auto-component de-rating at 30-Sep-2026.` },
    { name: 'CG Power: 56.29% stake at market', adj: of(() => SOTP.base.cgMv), metricLabel: `${n1(C.stakes.cg.shares)} cr shares × ₹${cgPx.toFixed(2)} (NSE close, 30-Sep-2026)`, note: 'Subsidiary; 88,64,85,532 shares (AR FY26 note 6a).' },
    { name: 'Shanthi Gears: 70.46% stake at market', adj: of(() => SOTP.base.sgMv), metricLabel: `${C.stakes.sg.shares.toFixed(2)} cr shares × ₹${sgPx.toFixed(2)} (NSE close, 30-Sep-2026)`, note: 'Subsidiary; 5,40,57,475 shares (AR FY26 note 6a).' },
    { name: 'Less: holding-company discount on the listed stakes', adj: of(c => SOTP[c].disc), metricLabel: `Discount × listed stakes ₹${n0(listedMv)} cr (base ${DISC.base}%, bull ${DISC.bull}%, bear ${DISC.bear}%)`, note: 'Derived from TII\'s own discount at 21 quarter-ends since Jun-2021 (see Valuation).' },
    { name: 'TI Clean Mobility: TII\'s investment', adj: of(c => TIC[c]), metricLabel: `Base: TII's cost ₹${n0(TIC.base)} cr; bull: Mar-26 fair-value mark ₹${n0(TIC.bull)} cr; bear: equity worth nothing and the remaining ₹500 cr of the ₹750 cr programme lost (PV ₹${n0(-TIC.bear)} cr)`, note: 'Outside investors (~₹1,780 cr) hold CCPS that convert only at an IPO; their stake was marked at ₹2,404.70 cr in Mar-2026.' },
    { name: 'Other unlisted subsidiaries at cost', adj: of(() => OTHER_UNL), metricLabel: 'TI Medical ₹265 cr, 3xper ₹310 cr, Kcaltech ₹62 cr, Financière C10 (Sedis) ₹61 cr', note: 'At TII\'s cost (AR FY26 note 6a; Q1FY27 deck).' },
  ];
  const pe = as.valuation.blend.methods.find(m => m.key === 'pe');
  const peNext = { ...PEM }, peWhy = `Own one-year-forward P/E on consolidated EPS since Apr-2021: median ${n1(FM.median)}x (no trough years), cut by the ${Math.abs(sectorDr).toFixed(1)}% sector de-rating: ${PEM.base}x. Rough: consolidated EPS carries CG Power at earnings, not at its ~100x market multiple, and TICMPL's losses at 100%.`;
  const changed = JSON.stringify(P) !== JSON.stringify(next) || JSON.stringify(pe.multiple) !== JSON.stringify(peNext) || pe.why !== peWhy;
  if (changed) {
    as.valuation.parts = next; pe.multiple = peNext; pe.why = peWhy;
    fs.writeFileSync(FILE, JSON.stringify(as, null, 1));
    console.log(`TIINDIA.val: updated. SA ${JSON.stringify(SAM)}, discount ${JSON.stringify(DISC)}, P/E ${JSON.stringify(PEM)}. Re-run node src/model.js TIINDIA, then node tools/authoring/TIINDIA.js.`);
  } else console.log(`TIINDIA.val: unchanged. SA ${JSON.stringify(SAM)}, discount ${JSON.stringify(DISC)}, P/E ${JSON.stringify(PEM)}`);
  return { changed };
}

module.exports = { syncParts };
if (require.main === module) syncParts();
