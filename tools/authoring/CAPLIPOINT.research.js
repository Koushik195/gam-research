// Caplin Point report, part B: cover, the story in charts, and the merger of part2-6 (business, history, industry, tailwind
// test, Latin America & Africa, US/Caplin Steriles, plants, moat, Q1FY27 and guidance, earnings quality, ownership,
// governance and the CCPS, forecasts, street, valuation, risks, glossary, statement notes). Shared inputs in
// CAPLIPOINT.ctx.js (+ core.js). Forecast and valuation figures are live tokens ({{...}}) that follow assumptions.json.
// As of 30-Sep-2026.
const X = require('./CAPLIPOINT.ctx');
const { V, n0, n1, pc, SQ, QL, Q1, FY26, price, mv, MULT, epsU, epsSep, HB, SECTOR, rating, ST, YRS, derate, PEER_SET, shortName, shortDate, peFy28, peTtm, epsRep, sBase, CC, ccpsEpsSep, valCcps, icici, SA } = X;
const P2 = require('./CAPLIPOINT.part2'), P3 = require('./CAPLIPOINT.part3'), P3b = require('./CAPLIPOINT.part3b'), P4 = require('./CAPLIPOINT.part4'), P4b = require('./CAPLIPOINT.part4b'), P5 = require('./CAPLIPOINT.part5'), P5b = require('./CAPLIPOINT.part5b'), P6 = require('./CAPLIPOINT.part6');

const cover = {
  headline: `A cash-rich Latin American generics franchise with a fast-growing US arm, but at ${n1(peFy28)}x FY28E EPS the stock prices in far more than its own history, a fresh USFDA Form 483 and slowing dollar growth allow`,
  lead: `Caplin Point sells plain generic medicines in small Central and South American markets through its own subsidiaries, warehouses and sales teams (Rest of World, 79% of FY26 revenue), and sterile injectables in the US through Caplin Steriles (21%). It is debt-free with ₹${n0(FY26.treasury.gross)} cr of cash and investments, a 35% EBITDA margin and EPS that has risen every year (₹${n1(epsRep[2021])} in FY21 to ₹${n1(epsRep[2026])} in FY26). Q1FY27 was good (revenue +${n1(Q1.growthPct)}%, US +26%). But Latin American sales grew only 3% in dollars in FY26; the US plant is full until early 2027 and an unannounced USFDA inspection (13-21 Aug 2026) ended with 10 observations. We forecast EPS of ₹${n1(epsU[0])} / ${n1(epsU[1])} / ${n1(epsU[2])} for FY27-29E. The only broker that discloses a method (ICICI Securities) uses **P/E**, the house method too: **${MULT.base}x Sep-28E EPS (₹${n1(epsSep)})**, Caplin's ${n1(HB.med)}x median forward P/E since Apr-2021 lifted ${SECTOR}% for pharma's re-rating, gives **{{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}**. Cross-checks: EV/EBITDA ₹${n0(mv('ev').value)}; DCF ₹${n0(mv('dcf').value)}. Bull {{scen.bull.tp|inr}}; bear {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'A good, cash-generating franchise', p: `5,000+ registrations, own warehouses and 700+ people across Central America and the Caribbean; ~41% shelf share in independent pharmacies there; 60% gross margin; EPS up every year since FY21; capex of ~₹1,000 cr funded entirely from cash flow, with treasury still rising to ₹${n0(Q1.freeCash)} cr "free cash" at Jun-26.` },
    { h: 'But the core is growing slowly', p: `Latin American sales were $155 mn in FY26 vs $150 mn in FY25 (+3%); Central America +7%. Rupee growth (+9.5% for Rest of World) came from the weaker rupee and a large El Salvador tender. Chile and Mexico are years from scale. Receivables (138 days) and inventory (181 days) keep absorbing cash.` },
    { h: 'The US is the growth, and the risk', p: `Caplin Steriles grew 28% in FY26 to ₹${n0(FY26.us)} cr with a 30% EBITDA margin; 60 ANDAs approved, 38 launched, own label ~₹100 cr. But it is one site, booked out till February, new lines sell into the US only from FY28-29, and the Aug-2026 inspection produced a 10-observation Form 483. Eight Roads and F-Prime hold CCPS that convert into at least ${CC.minStakePct}% of Caplin Steriles, which the reported EPS ignores.` },
    { h: 'Valuation: well above its own history', p: `At ₹${n0(price)} Caplin trades at ${n1(peTtm)}x trailing and ${n1(peFy28)}x our FY28E EPS, against a ${n1(HB.med)}x median one-year-forward P/E since Apr-2021, and ${n1(derate.CAPLIPOINT)}% above its own five-year median trailing P/E (pharma peers +${SECTOR}%). ICICI's 26x FY28E (₹${n0(icici.tp)}) is the only street target. Even the post-re-rating window since Apr-2024 gives ${X.SENS.w24}x, about ₹${n0(X.val(X.SENS.w24))}: below the price.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'AMBER' },
    { k: 'Earnings momentum', v: 'GREEN' },
    { k: 'Competitive position', v: 'AMBER' },
    { k: 'Balance sheet', v: 'GREEN' },
    { k: 'Governance', v: 'AMBER' },
  ],
  catalysts: [
    'USFDA: Caplin\'s reply to the 10-observation Form 483 (inspection 13-21 Aug 2026) and the FDA\'s classification of the inspection (an OAI classification or warning letter would hit US launches and the new lines).',
    'Q2FY27 results (due by mid-November 2026): collection of the Q1 receivables build, Rest of World growth after the El Salvador tender, US growth with the plant full.',
    'Capacity: Line 7 at Caplin Steriles (due within 6-7 months of Aug-2026), COL-II construction (Mar-2027) and the Pondicherry OSD plant (Q1FY28).',
    'Latin America: Mexico launches (29 approvals, 120+ filings planned), Chile tenders ($12 mn over 18 months), a distributor acquisition in Mexico or Chile.',
    'Capital allocation: use of the cash pile (acquisitions, credit funds, a higher payout).',
  ],
};

// ---------------------------------------------------------------- Story in charts
const STREET_TP = ST.filter(s => s.tp && s.standing);
const sortedPeers = [...PEER_SET].sort((a, c) => derate[c] - derate[a]);
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: `Revenue: ₹${n0(Q1.revenue)} cr in Q1FY27, +${n1(Q1.growthPct)}%`, unit: 'Revenue (₹ crore), quarterly', x: QL, series: [{ name: 'Revenue', values: SQ.map(q => Math.round(q.consRev)), fmt: 'num' }], labels: 'all', highlight: 'Q1FY27', source: 'Company results; Screener.in' },
      { type: 'hbar', title: 'Four-fifths Latin America and Africa; the US is a fifth', unit: 'FY26 revenue by segment (₹ crore)', x: ['Rest of World (LatAm + Africa)', 'USA (Caplin Steriles)'], series: [{ name: 'FY26', values: [FY26.row, FY26.us].map(Math.round), fmt: 'num' }], labels: 'all', highlight: 'USA (Caplin Steriles)', source: 'AR FY26 note 26; segment note' },
    ] },
    { pair: [
      { type: 'column', title: 'US sales: +26% in Q1FY27, over a quarter of all growth', unit: 'USA segment revenue (₹ crore), quarterly', x: QL, series: [{ name: 'USA', values: SQ.map(q => Math.round(q.us)), fmt: 'num' }], labels: 'all', highlight: 'Q1FY27', source: 'Company segment notes' },
      { type: 'line', title: 'Segment margins: US rising, Rest of World slipping', unit: 'Segment PBT / revenue (%)', x: QL, series: [{ name: 'Rest of World', values: SQ.map(q => q.rowMarginPct), fmt: 'pct' }, { name: 'USA', values: SQ.map(q => q.usMarginPct), fmt: 'pct' }], labels: 'last', min: 0, max: 45, source: 'Company segment notes' },
    ] },
    { pair: [
      { type: 'column', title: 'EPS has risen every year; we slow it to ~11% a year', unit: 'EPS to shareholders (₹); FY27-29E = GAM', x: ['FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26', ...YRS], series: [{ name: 'EPS', values: [2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029].map(y => Math.round(epsRep[y] * 10) / 10), fmt: 'n1' }], labels: 'all', highlight: 'FY26', source: `Screener.in; GAM (ICICI FY28E ₹${icici.eps.FY28E})` },
      { type: 'line', title: `Forward P/E: ${n1(peFy28)}x FY28E today vs a ${n1(HB.med)}x median`, unit: 'Price ÷ next full-year EPS (x), every fifth week', x: sBase.map(x => x[0]), series: [{ name: 'Forward P/E', values: sBase.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: HB.med, text: `Median ${n1(HB.med)}x` }, { v: MULT.base, text: `Target ${MULT.base}x`, color: '#cf8f1f' }], source: 'Screener.in; GAM' },
    ] },
    { pair: [
      { type: 'hbar', title: `Pharma re-rated (+${SECTOR}%); Caplin far more (${pc(derate.CAPLIPOINT)})`, unit: 'Trailing P/E at the 30-Sep-2026 close vs five-year median (%)', x: [...sortedPeers.map(shortName), 'Caplin Point'], series: [{ name: 'vs median', values: [...sortedPeers.map(s => Math.round(derate[s] * 10) / 10), Math.round(derate.CAPLIPOINT * 10) / 10], fmt: 'pct' }], labels: 'all', highlight: 'Caplin Point', source: 'Screener.in P/E series; asof-peers.js' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street and the price', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...STREET_TP.map(s => `ICICI Securities (${shortDate(s.date)})`), 'GAM bull', 'GAM (base)', 'GAM bear'], series: [{ name: 'Target', values: [...STREET_TP.map(s => s.tp), X.SC.bull.tp, V.tp, X.SC.bear.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'ICICI Securities (13-Aug-2026); GAM Research' },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.latam, P3.us, P3b.plants, P3b.moat, p.financials, p.margins, P4.guidance, p.capital, P4.quality, p.balance, P4.ownership(p.ownershipBase), P4.governance, P4b.forecasts, P5.street, P5b.valuation, P5.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
