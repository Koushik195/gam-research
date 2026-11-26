// Concord Biotech report, part B: cover, the story in charts, and the merger of part2-6 (business, history & corporate actions,
// industry, tailwind test, APIs, formulations & injectables, plants & regulators, moat, margins, Q1FY27, earnings quality, capital
// & returns, ownership, governance, forecasts, street, valuation, risks, glossary, statement notes). Shared inputs in
// CONCORDBIO.ctx.js / ctx2.js. Forecast and valuation figures are live tokens ({{...}}) that follow assumptions.json.
const X = require('./CONCORDBIO.ctx2');
const { V, n0, n1, price, mv, MULT, HB, k, SECTOR, rating, epsU, epsSep28, fwdNow, trailPe, YRS, SA, SQ, LINES, ST, MW, PEER_SET, shortName, shortDate, sAll, gNeeded, implPeAtPrice, medTp, SENS, HFY, C, Q1 } = X;
const ex26 = SENS[4], street40 = SENS[8];
const P2 = require('./CONCORDBIO.part2'), P3 = require('./CONCORDBIO.part3'), P4 = require('./CONCORDBIO.part4'), P5 = require('./CONCORDBIO.part5'), P5b = require('./CONCORDBIO.part5b'), P6 = require('./CONCORDBIO.part6');

const cover = {
  headline: `A rare fermentation-API franchise coming out of a lost year: Concord's own short history gives ${MULT.base}x Sep-28E EPS, the price pays ${Math.round(implPeAtPrice)}x: target {{dcf.tp|inr}}, ${rating} on the house rule, with low conviction`,
  lead: `Concord Biotech grows microbes in 1,250 m³ of fermenters in Gujarat to make active pharmaceutical ingredients (APIs) few others can: immunosuppressants for transplant patients (tacrolimus, mycophenolate, cyclosporine; 58% of revenue), oncology and anti-infective molecules, 79% of revenue in all, plus formulations (21%), now including a new injectable plant. FY26 revenue fell 12% and EPS 30% to ₹24.9 as customers deferred orders, EU supplies stalled on a regulatory approval and two tenders were lost; Q1FY27 revenue rose 26%. We forecast EPS of ₹${n1(epsU[0])} / ${n1(epsU[1])} / ${n1(epsU[2])} for FY27-29E. Both brokers that disclose a method use **P/E**, and so do we: Concord's median one-year-forward P/E since 1-Jan-2024 (${n1(HB.med)}x; listed Aug-2023, post-listing months skipped), lifted ${SECTOR}% for the pharma peers' move over the same window, gives **${MULT.base}x Sep-28E EPS of ₹${n1(epsSep28)} = {{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}**. That median is inflated by FY26: the year the market priced on FY26 EPS reads ${n1(HFY[2026].med)}x; leaving it out gives ${ex26.mult}x (₹${n0(ex26.tp)}), still a ${X.ratingFor(ex26.up)}. Cross-checks: EV/EBITDA ₹${n0(mv('ev').value)}; DCF ₹${n0(mv('dcf').value)}, which says the cash flows do not support even today's price. Bull {{scen.bull.tp|inr}}; bear {{scen.bear.tp|inr}}. Per-share figures are before the 1:1 bonus approved on 23-Sep-2026.`,
  arguments: [
    { h: 'A real, hard-to-copy niche', p: '1,250 m³ of fermentation capacity, 30+ fermentation APIs, a 20%+ global volume share in five molecules, approvals from the USFDA, EU, Japan, Korea and Brazil, 300+ customers (top ten only 37.6%), no debt and ₹442 cr of cash. Gross margins of 74-79% show limited competition.' },
    { h: 'But mature molecules and lumpy buyers', p: 'Immunosuppressants are 74% of API revenue; tacrolimus and mycophenolate are decades-old generics. FY26 showed that customers can defer orders for quarters, and Q1FY27\'s share gains were "primarily driven by pricing". FY25\'s EPS of ₹35.5 returns only in FY28E on our numbers.' },
    { h: 'New bets cost margin for now', p: 'The injectable plant (₹600 cr peak revenue) runs at ~5% utilisation and the US front end (Stellon, 75% owned) has just started selling: together ~₹48 cr of costs, 4-5 points of margin. Management targets ~40% EBITDA in FY28; we assume 38%. Cash may also go to acquisitions in "adjacencies".' },
    { h: 'A mechanical BUY, not a strong one', p: `₹${n0(price)} is ${n1(trailPe)}x trailing EPS and ${n1(fwdNow)}x our FY28E. Our rule reads 3 years of history in which the stock traded at ${Math.round(HB.min)}-${Math.round(HB.max)}x the EPS that came in; the street's P/E users sit at 25-40x FY28E (40x gives ₹${n0(street40.tp)}), the latest targets cluster at ₹1,190-1,645 (median ₹${n0(medTp)}), and the DCF needs ~${Math.round(gNeeded)}% growth for 15 years.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'GREEN' },
    { k: 'Predictability', v: 'RED' },
    { k: 'Earnings momentum', v: 'GREEN' },
    { k: 'Competitive position', v: 'AMBER' },
    { k: 'Balance sheet', v: 'GREEN' },
    { k: 'Governance', v: 'AMBER' },
    { k: 'Valuation', v: 'AMBER' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): our FY27 needs Q2-Q4 revenue 15% above a year earlier; Q4 orders decide the year.',
    '1:1 bonus: shareholder approval and a record date still to come (board approval 23-Sep-2026); no change to value.',
    'Injectables: first third-party contract-manufacturing orders expected in H2FY27; emerging-market registrations take 12-15 months.',
    'CDMO: at least one more innovator project expected to convert in FY27 (today 1-2% of revenue).',
    'Middle East and US Veterans Affairs tenders (~₹25 cr each) still on hold; any return is upside to formulations.',
    'USFDA: closure of the one procedural observation at the Valthera formulation plant (inspection ended 18-Sep-2026).',
    'Capital allocation: management is "exploring" acquisitions in fermentation adjacencies (peptides, veterinary).',
  ],
};

// ---------------------------------------------------------------- Story in charts
const STREET_TP = ST.filter(s => s.tp).slice().sort((a, c) => c.tp - a.tp);
const T10 = C.history.top10;
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'stacked', title: 'APIs are ~80% of revenue; FY26 fell, we see FY25 regained in FY27E', unit: 'Revenue (₹ crore)', x: [...SA.map(s => s.fy), ...YRS], series: [{ name: 'APIs', values: [...SA.map(s => s.api), ...LINES.api.map(Math.round)], fmt: 'num' }, { name: 'Formulations', values: [...SA.map(s => s.formulations), ...LINES.formulations.map(Math.round)], fmt: 'num' }], minLabel: 80, source: 'Company decks (FY23-26); GAM estimates FY27-29E' },
      { type: 'stacked', title: 'Quarterly: Q4FY25 was a ₹430 cr bulk quarter; FY26 orders came in smaller lots', unit: 'Revenue (₹ crore)', x: SQ.map(q => q.q), series: [{ name: 'APIs', values: SQ.map(q => q.api), fmt: 'num' }, { name: 'Formulations', values: SQ.map(q => q.formulations), fmt: 'num' }], minLabel: 30, source: 'Company decks and calls (Q2FY26 derived)' },
    ] },
    { pair: [
      { type: 'column', title: 'Top-10 customers: 48% of revenue (FY21) to 38% (FY26)', unit: 'Share of revenue (%)', x: Object.keys(T10), series: [{ name: 'Top 10 customers', values: Object.values(T10), fmt: 'pct' }], labels: 'all', min: 0, max: 60, source: 'AR FY26; Q1FY27 deck p.20' },
      { type: 'hbar', title: 'Utilisation (Q1FY27): Dholka full, Limbasi half, injectables 5%', unit: 'Capacity utilisation (%)', x: ['Unit I API (Dholka, 450 m³)', 'Unit III API (Limbasi, 800 m³)', 'Unit II formulations (Valthera)', 'Unit IV injectables (Valthera)'], series: [{ name: 'Utilisation', values: [Q1.utilisation.unit1, Q1.utilisation.unit3, Q1.utilisation.unit2, Q1.utilisation.injectables], fmt: 'pct0' }], labels: 'all', source: 'Q1FY27 call (3-Aug-2026)' },
    ] },
    { pair: [
      { type: 'column', title: `EPS: ₹35.5 (FY25) to ₹24.9 (FY26) and ₹${n1(epsU[2])} (FY29E)`, unit: 'EPS (₹, pre-bonus); FY27-29E = GAM', x: ['FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26', ...YRS], series: [{ name: 'EPS', values: [X.epsRep[2021], X.epsRep[2022], X.epsRep[2023], X.epsRep[2024], X.epsRep[2025], X.epsRep[2026], ...epsU.map(v => Math.round(v * 10) / 10)], fmt: 'n1' }], labels: 'all', highlight: 'FY26', source: 'Screener.in (bonus restatement undone); GAM Research' },
      { type: 'line', title: `Forward P/E since listing: median ${n1(HB.med)}x since Jan-24, target ${MULT.base}x, today ~${Math.round(fwdNow)}x`, unit: 'Price ÷ next full-year EPS (x)', x: sAll.map(x => x[0]), series: [{ name: 'Forward P/E', values: sAll.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, min: 0, max: 110, lines: [{ v: HB.med, text: `Median ${n1(HB.med)}x` }, { v: MULT.base, text: `Target: ${MULT.base}x (× ${k.toFixed(3)})`, color: '#cf8f1f' }], source: 'Screener.in weekly prices (pre-bonus); reported EPS; GAM estimates FY27-28E' },
    ] },
    { pair: [
      { type: 'hbar', title: `Pharma peers' P/E vs their medians since Jan-2024: median +${SECTOR}%`, unit: 'Trailing P/E at the 30-Sep-2026 close vs median since 1-Jan-2024 (%)', x: [...PEER_SET].sort((a, c) => MW[c].mv - MW[a].mv).map(shortName), series: [{ name: 'vs median', values: [...PEER_SET].sort((a, c) => MW[c].mv - MW[a].mv).map(s => Math.round(MW[s].mv * 10) / 10), fmt: 'pct' }], labels: 'all', source: 'Screener.in P/E series; asof-peers.js; sector-factor.js --from 2024-01-01' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (latest notes found)', unit: `₹ per share (pre-bonus); CMP ₹${n0(price)}`, x: [...STREET_TP.map(s => `${s.broker.replace(/ (Institutional Equities|Stock Broking)/, '')} (${shortDate(s.date)})`), 'GAM (base)'], series: [{ name: 'Target', values: [...STREET_TP.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes and aggregators (Jan- to Aug-2026); GAM Research' },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.api, P3.formulations, P3.capacity, P4.moat, p.seasons, p.financials, P4.margins, P5.q1, P4.earnings, p.balance, P4.capital, P4.ownership(p.ownershipBase), P4.governance, P5.forecasts, P5.street, P5b.valuation, P6.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
