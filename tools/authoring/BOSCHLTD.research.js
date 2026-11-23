// Bosch Ltd report, part B: cover, the story in charts, and the merger of part2-6 (business, history, industry, tailwind
// test, mobility, RBIC, power tools, moat, Q1FY27, earnings quality, ownership, governance, forecasts, street, valuation,
// verdict, glossary, statement notes). Shared inputs in BOSCHLTD.ctx.js; forecast and valuation figures are live tokens
// ({{...}}) that follow assumptions.json. As of 30-Sep-2026.
const X = require('./BOSCHLTD.ctx');
const { F, V, A, SG, SQ, QL, R, n0, n1, pc, price, mv, FM, cleanMed, sectorDr, MULT, epsSep, rating, postQ1, medTp, C, bld, epsRep, epsClean, S } = X;
const P2 = require('./BOSCHLTD.part2'), P3 = require('./BOSCHLTD.part3'), P4 = require('./BOSCHLTD.part4'), P5 = require('./BOSCHLTD.part5'), P6 = require('./BOSCHLTD.part6');

const cover = {
  headline: 'A better business after RBIC, but the price already pays for it',
  lead: `Bosch Ltd is Robert Bosch's 70.5%-owned Indian mobility flagship: engine management and fuel injection, the aftermarket and power tools, and since Jul-2026 Bosch Chassis Systems India (RBIC: ESP/ABS, braking, airbag electronics), bought from the parent for ₹9,069 cr. Q1FY27 revenue rose 22% and the EBITDA margin reached 14%. With RBIC pooled for the full year we forecast EPS of ₹${n0(F.eps[0])} / ₹${n0(F.eps[1])} / ₹${n0(F.eps[2])} for FY27-29E, close to the street. The street values Bosch on **P/E on one-year-forward EPS** (MOSL ~40x FY28E). Applying the house rule (its clean forward P/E median since 2021, ${n1(cleanMed)}x, cut by the ${Math.abs(sectorDr).toFixed(1)}% auto-component de-rating) gives **${MULT.base}x Sep-28E EPS of ₹${n0(epsSep.base)} = {{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}.** Cross-checks: EV/EBITDA ₹${n0(mv('ev').value)}, DCF ₹${n0(mv('dcf').value)}. Bull case {{scen.bull.tp|inr}}; bear case {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'Momentum is strong, and regulation keeps adding content', p: `Mobility grew 16.9% in FY26 and 25.7% in Q1FY27, well ahead of vehicle production (+11% and +22%), on gasoline and 2-wheeler engine management (OBD-II), premium motorcycles and a revived aftermarket. CAFE Phase 3 (Apr-2027, draft) and CV ADAS (Jan/Oct-2027) are the next content steps. But the GST 2.0 boost is a one-off step and the base turns tough from Q3FY27; management's own May outlook was "flattish".` },
    { h: 'RBIC is a good asset at a fair price, and it is now in the price', p: `RBIC grew 17% a year in FY23-25 with a 19.3% EBITDA margin, against Bosch's 12.8%; it was bought at 10.6x EV/EBITDA, about a third of Bosch's own multiple. It adds ~${Math.round(bld[0].rb / bld[0].rev * 100)}% to FY27E revenue and ~${Math.round(X.accretion27)}% to FY27E EPS, because the ₹9,060 cr of cash it cost earned only ~6.5% before tax. The stock rose ~19% in three sessions after the announcement and ~30% since.` },
    { h: 'Much of the moat is rented from the parent', p: `Royalty and technical fees (₹478 cr, +29%) and group professional and IT charges (₹1,097 cr, +24%) were 7.9% of FY26 revenue against an EBITDA margin of 13.2%; 58% of purchases come from group companies. That is why a dominant supplier earns 12-14% EBITDA margins, below Schaeffler, Sona or ZF CV. Exceptional gains from business sales (FY24, FY26) also flatter reported EPS history.` },
    { h: 'Valuation: the premium is not in the history', p: `At ₹${n0(price)} Bosch trades at ${n1(price / F.eps[1])}x FY28E and ${n1(price / epsSep.base)}x Sep-28E EPS, 29% above its own five-year trailing median, while the auto-component sector sits ${Math.abs(sectorDr).toFixed(1)}% below its medians. Its clean forward P/E has a median of ${n1(cleanMed)}x since Apr-2021; the market now pays ~40x for ~10-12% underlying EPS growth plus a one-time RBIC step. At the street's 40x our target would be ~₹${n0(Math.round(40 * epsSep.base / 10) * 10)}; the gap to the price is the multiple, not the earnings.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'AMBER' },
    { k: 'Earnings momentum', v: 'GREEN' },
    { k: 'Competitive position', v: 'GREEN' },
    { k: 'Valuation', v: 'RED' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): the first quarter with RBIC consolidated (and restated comparatives), and the first full quarter on the smaller treasury.',
    'Festive and post-festive production (Oct-2026 to Mar-2027) against the GST-boosted base of a year earlier.',
    'Analyst visit to RBIC\'s Chakan plant (planned for November): RBIC\'s FY26 numbers, order book and capex.',
    'Regulation: final CAFE Phase 3 norms (from Apr-2027), CV ADAS from Jan-2027, and any notification of ABS for all two-wheelers.',
    'Joint ventures: merger-control approvals and first orders for the Tata AutoComp e-axle JV and the TSF air-systems JV; the FY27 dividend against the 55-85% policy.',
  ],
};

// ---------------------------------------------------------------- Story in charts
const fyH = ['FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'], yH = [2020, 2021, 2022, 2023, 2024, 2025, 2026];
const oiNormal = S.schedules['profit-loss']['Other Income']['Other income normal'];
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: `Revenue: ₹20,035 cr in FY26; RBIC lifts FY27E to ₹${n0(F.sales[0])} cr`, unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY19', to: 'FY29E', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'all', source: 'Screener.in; GAM estimates FY27-29E (incl. RBIC from 1-Apr-2026)' },
      { type: 'column', title: 'Q1FY27: +22%, the fastest growth in two years', unit: 'Revenue growth year on year (%)', x: X.M.quarterly.labels.slice(-8), series: [{ name: 'Revenue growth', values: X.M.quarterly.sales.slice(-8).map((s, i, a) => { const all = X.M.quarterly.sales, j = all.length - 8 + i; return Math.round((all[j] / all[j - 4] - 1) * 1000) / 10; }), fmt: 'pct' }], labels: 'all', source: 'Quarterly results as reported (before RBIC)' },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: 19% before BS-VI, 12-13% after; ~14.7% with RBIC', unit: 'EBITDA margin (%)', x: 'fin.labels', from: 'FY16', to: 'FY29E', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 8, max: 22, source: 'Screener.in; GAM estimates FY27-29E' },
      { type: 'column', title: 'RBIC earns ~19%: the margin Bosch Ltd lost after BS-VI', unit: 'EBITDA margin (%)', x: ['RBIC FY23', 'RBIC FY24', 'RBIC FY25', 'Bosch FY25', 'Bosch FY26'], series: [{ name: 'EBITDA margin', values: [R.ebitdaMarginPct.FY23, R.ebitdaMarginPct.FY24, R.ebitdaMarginPct.FY25, 12.8, 13.2], fmt: 'pct' }], labels: 'all', source: 'RBIC deck (8-Apr-2026); Screener.in' },
    ] },
    { pair: [
      { type: 'column', title: 'Reported EPS swings with one-offs; clean EPS rose steadily', unit: 'EPS (₹)', x: fyH, series: [{ name: 'Reported', values: yH.map(y => Math.round(epsRep[y])), fmt: 'num' }, { name: 'Before exceptional items', values: yH.map(y => Math.round(epsClean[y])), fmt: 'num' }], labels: 'all', source: 'Screener.in; AR note 40' },
      { type: 'column', title: 'Other income halves after the ₹9,060 cr RBIC payment', unit: 'Other income before exceptional items (₹ crore)', x: ['FY22', 'FY23', 'FY24', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], series: [{ name: 'Other income', values: [...['Mar 2022', 'Mar 2023', 'Mar 2024', 'Mar 2025', 'Mar 2026'].map(p => oiNormal[p]), ...F.otherIncome.map(Math.round)], fmt: 'num' }], labels: 'all', source: 'Screener.in ("other income normal"); GAM estimates' },
    ] },
    { pair: [
      { type: 'line', title: `Forward P/E: ${Math.round(price / epsSep.base)}x Sep-28E now vs a ${n1(cleanMed)}x clean median since 2021`, unit: 'Price ÷ next full-year EPS before one-offs (x)', x: X.cleanSeries.map(x => x[0]), series: [{ name: 'Forward P/E (clean)', values: X.cleanSeries.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: MULT.base, text: `Our multiple: ${MULT.base}x`, color: '#cf8f1f' }], source: 'Screener.in prices; EPS before exceptional items; GAM estimates for FY27-28E' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (post-Q1 notes)', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...postQ1.map(s => s.broker.replace('Not named in our source ', 'Unnamed ')), 'GAM (base)'], series: [{ name: 'Target', values: [...postQ1.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: `MOSL (11-Aug-2026); Business Standard roundup (31-Aug-2026); median ₹${n0(medTp)}; GAM Research` },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.mobility, P3.rbic, P3.consumer, P3.moat, p.financials, P4.guidance, p.capital, P4.quality, p.balance, P4.ownership(p.ownershipBase), P4.governance, P4.forecasts, P5.street, P5.valuation, P6.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
