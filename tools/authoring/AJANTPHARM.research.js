// Ajanta Pharma report, part B: cover, the story in charts, and the merger of part2-6 (business, history, industry, tailwind
// test, India, Asia & Africa, US, moat, Q1FY27 and guidance, earnings quality, ownership, governance, forecasts, street,
// valuation, risks, glossary, statement notes). Shared inputs in AJANTPHARM.ctx.js. Forecast and valuation figures are live
// tokens ({{...}}) that follow assumptions.json. As of 30-Sep-2026.
const X = require('./AJANTPHARM.ctx');
const { F, V, n0, n1, pc, SQ, QL, Q1, FY26, price, mv, MULT, epsU, epsSep, HB, k, SECTOR, rating, ST, YRS, derate, PEER_SET, P, shortName, shortDate, peFy28, peTtm, epsRep, sBase, CONS, BL } = X;
const P2 = require('./AJANTPHARM.part2'), P3 = require('./AJANTPHARM.part3'), P4 = require('./AJANTPHARM.part4'), P5 = require('./AJANTPHARM.part5'), P5b = require('./AJANTPHARM.part5b'), P6 = require('./AJANTPHARM.part6');

const cover = {
  headline: `A high-quality branded-generics compounder priced for more than it will deliver: the US surge is fading, and at ${n1(peFy28)}x FY28E EPS the stock is above its own history even after the sector's re-rating`,
  lead: `Ajanta sells first-to-market branded generics in India (30% of sales), Asia (22%) and Africa (16%), plus US generics (29%) and anti-malarial tenders (3%), with ~80% gross margins, 27-28% EBITDA margins, ROCE above 30% and net cash. Q1FY27 was strong (revenue +25% to ₹${n0(Q1.revenue)} cr, profit +31%), but the US, which grew 49% in FY26 on launches, a flu season and a weak rupee, fell 7% QoQ in dollars and is guided to mid-single-digit growth; Asia is hit by the Middle East war. We forecast EPS of ₹${n1(epsU[0])} / ${n1(epsU[1])} / ${n1(epsU[2])} for FY27-29E, below consensus from FY28. Every broker that discloses a method uses **P/E**, and so do we: **${MULT.base}x Sep-28E EPS (₹${n1(epsSep)})**, i.e. Ajanta's ${n1(HB.med)}x median forward P/E since Apr-2021 lifted ${SECTOR}% for the pharma sector's re-rating, gives **{{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}**, a marginal call close to the HOLD line. Cross-checks: EV/EBITDA ₹${n0(mv('ev').value)}; DCF ₹${n0(mv('dcf').value)}. Bull {{scen.bull.tp|inr}}; bear {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'An excellent business', p: `#1 in ophthalmology and dermatology in its covered Indian markets, growing ~1.4x the IPM (IQVIA +${Q1.iqvia.ajanta}% vs +${Q1.iqvia.ipm}%); a rare own-field-force franchise in 21 African countries growing 15-30%; ~80% gross margin; no acquisitions, no exceptional charges, five buybacks since FY19.` },
    { h: 'But FY26 flattered the US, and that is fading', p: `US sales +${n1(FY26.growth.us)}% to ₹${n0(FY26.us)} cr in FY26 (eight launches in 15 months, a strong flu season); Q1FY27 US$51 mn, −7% QoQ; no launches until Q4FY27; FY27 filings cut to 5-7. We model US +${BL.growth.us[0]}% in FY27E (rupee-aided) and +${BL.growth.us[1]}% in FY28E; the street has more.` },
    { h: 'Cash, tax and governance flags', p: 'Operating cash flow halved to ₹529 cr in FY26 as factoring ended (receivables 125 days); the tax rate rises from 23% to ~26%; 14% of the company is pledged by non-executive promoters, one of whom sold 2.8% in Jun-2026; an Aug-2025 income-tax search is unresolved; the MD and JMD take ₹27.5 cr each.' },
    { h: 'Valuation: full', p: `At ₹${n0(price)} Ajanta trades at ${n1(peTtm)}x trailing and ${n1(peFy28)}x our FY28E EPS against a ${n1(HB.med)}x median one-year-forward P/E since Apr-2021, and ${n1(derate.AJANTPHARM)}% above its own five-year median trailing P/E (pharma peers +${SECTOR}%). Our ${MULT.base}x Sep-28E target is in the street's 28-32x range; the gap is our lower EPS. On consensus EPS the same multiple gives a HOLD.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'AMBER' },
    { k: 'Earnings momentum', v: 'GREEN' },
    { k: 'Competitive position', v: 'GREEN' },
    { k: 'Balance sheet', v: 'GREEN' },
    { k: 'Governance', v: 'AMBER' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): Asia catch-up from deferred shipments, the US run-rate in dollars, raw-material and freight inflation flowing into gross margin.',
    'US: launches planned for Q4FY27 subject to FDA approval; the Section 232 tariff study (generics exempt until Apr-2027); price erosion on the FY25-26 launches.',
    'Emerging markets: end of the Middle East disruption; semaglutide filings and approvals in Asia and Africa (Biocon licence, approvals ~1.5-2 years out).',
    'Governance: outcome of the income-tax search (block-period return filed 6-Apr-2026); further promoter sales or pledge changes.',
    'Capital allocation: use of the ~₹1,000 cr in-licensing/acquisition budget; second interim dividend for FY27.',
  ],
};

// ---------------------------------------------------------------- Story in charts
const STREET_TP = ST.filter(s => s.tp);
const sortedPeers = [...PEER_SET].sort((a, c) => derate[c] - derate[a]);
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: 'Revenue: ₹1,626 cr in Q1FY27, +25%', unit: 'Revenue (₹ crore), quarterly', x: QL, series: [{ name: 'Revenue', values: SQ.map(q => q.consRev), fmt: 'num' }], labels: 'all', highlight: 'Q1FY27', source: 'Company; Screener.in' },
      { type: 'hbar', title: 'Two-thirds branded generics; the US is the largest single market', unit: 'FY26 revenue by market (₹ crore)', x: ['India branded', 'US generics', 'Asia branded', 'Africa branded', 'Africa institutional'], series: [{ name: 'FY26', values: [FY26.india, FY26.us, FY26.asia, FY26.africa, FY26.inst].map(Math.round), fmt: 'num' }], labels: 'all', highlight: 'India branded', source: 'AR FY26 note 53' },
    ] },
    { pair: [
      { type: 'line', title: 'Gross margin up to ~80%; EBITDA margin before FX 26-29% for five quarters', unit: 'Quarterly (%)', x: QL, series: [{ name: 'Gross margin', values: SQ.map(q => q.grossMarginPct), fmt: 'pct' }, { name: 'EBITDA margin before FX losses', values: SQ.map(q => q.adjEbitdaMarginPct), fmt: 'pct' }], labels: 'last', min: 0, max: 90, source: 'ICICI Direct; MOSL; company' },
      { type: 'column', title: 'US sales: the surge peaked in Q4FY26', unit: 'US generics (₹ crore), quarterly', x: QL, series: [{ name: 'US', values: SQ.map(q => Math.round(q.us)), fmt: 'num' }], labels: 'all', highlight: 'Q4FY26', source: 'Company press releases; MOSL' },
    ] },
    { pair: [
      { type: 'column', title: 'EPS keeps growing, but more slowly than the street expects', unit: 'EPS (₹); FY27-29E = GAM', x: ['FY22', 'FY23', 'FY24', 'FY25', 'FY26', ...YRS], series: [{ name: 'EPS', values: [2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029].map(y => Math.round(epsRep[y] * 10) / 10), fmt: 'n1' }], labels: 'all', highlight: 'FY26', source: `Screener.in; GAM (consensus FY28E ₹${CONS.FY28E})` },
      { type: 'line', title: `Forward P/E: ${n1(peFy28)}x FY28E today vs a ${n1(HB.med)}x median`, unit: 'Price ÷ next full-year EPS (x), every fifth week', x: sBase.map(x => x[0]), series: [{ name: 'Forward P/E', values: sBase.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: HB.med, text: `Median ${n1(HB.med)}x` }, { v: MULT.base, text: `Target ${MULT.base}x`, color: '#cf8f1f' }], source: 'Screener.in; GAM' },
    ] },
    { pair: [
      { type: 'hbar', title: `Pharma re-rated (+${SECTOR}%); Ajanta more (${pc(derate.AJANTPHARM)})`, unit: 'Trailing P/E at the 30-Sep-2026 close vs five-year median (%)', x: [...sortedPeers.map(shortName), 'Ajanta Pharma'], series: [{ name: 'vs median', values: [...sortedPeers.map(s => Math.round(derate[s] * 10) / 10), Math.round(derate.AJANTPHARM * 10) / 10], fmt: 'pct' }], labels: 'all', highlight: 'Ajanta Pharma', source: 'Screener.in P/E series; asof-peers.js' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (notes standing on 30-Sep-26)', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...STREET_TP.map(s => `${s.broker.replace(' (institutional)', '')} (${shortDate(s.date)})`), 'GAM (base)'], series: [{ name: 'Target', values: [...STREET_TP.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes (30-Jul to 3-Aug-2026), GAM Research' },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.india, P3.emerging, P3.us, P3.moat, p.financials, p.margins, P4.guidance, p.capital, P4.quality, p.balance, P4.ownership(p.ownershipBase), P4.governance, P4.forecasts, P5.street, P5b.valuation, P5.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
