// Linde India report, part B: cover, story in charts, and the merger of part2-7 (business, history, industry,
// tailwind test, gases, project engineering, the parent and Praxair India, moat, Q1FY27, earnings quality,
// ownership, governance, forecasts, street, valuation, verdict, glossary, statement notes). Shared inputs in
// LINDEINDIA.ctx.js. Forecast and valuation figures are live tokens ({{...}}) that follow assumptions.json.
const X = require('./LINDEINDIA.ctx');
const { F, V, A, n0, n1, SA, SQ, QL, Q1, FY, RP, PED, price, mv, epsSep28, peMult, H, fwdPe, rating, peFY28, P, sectorDr, pbitM, b, fromAth } = X;
const P2 = require('./LINDEINDIA.part2'), P3 = require('./LINDEINDIA.part3'), P4 = require('./LINDEINDIA.part4'), P5 = require('./LINDEINDIA.part5'), P6 = require('./LINDEINDIA.part6'), P7 = require('./LINDEINDIA.part7');

const cover = {
  headline: 'Good plants, contested governance, and a price that already assumes decades of growth: we initiate at SELL',
  lead: `Linde India is 75% owned by Linde plc, the world's largest industrial-gas company. It sells oxygen, nitrogen and argon from plants inside steel and refinery customers, as merchant liquid and in cylinders (84% of FY26 revenue), and builds air separation plants (Project Engineering). It is spending heavily on four large new plants for Tata Steel, SAIL and Electrosteel, and has a ~₹2,000 cr third-party engineering order book. But profits have barely grown since FY24, ROE is heading to ~10%, and minority shareholders are fighting the parent over business handed to Linde plc's 100%-owned Praxair India. At ₹${n0(price)} the stock trades at ${n1(peFY28)}x our FY28E EPS. Coverage is thin and no broker method is public; the Indian street values gas companies on **P/E**. Applying **${peMult}x** (its ${n1(H.med)}x forward median since 2021, cut for the ~${Math.abs(Math.round(sectorDr))}% de-rating of quality Indian industrial stocks) **to Sep-28E EPS of ₹${n1(epsSep28)}** gives **{{dcf.tp|inr}} ({{dcf.upside|chg}})**: **we initiate with ${rating}**. Bull case {{scen.bull.tp|inr}}; bear case {{scen.bear.tp|inr}}; our DCF is only ₹${n0(mv('dcf').value)}.`,
  arguments: [
    { h: 'The price assumes decades of compounding', p: `${n1(peFY28)}x FY28E EPS and ~${Math.round(X.evNow / F.ebitda[1])}x FY28E EV/EBITDA, against ~25x for Linde plc and ${n1(P.ELLEN.pe)}x trailing for Ellenbarrie, the only other listed Indian gas company. A DCF at an 11.6% cost of equity and 6% terminal growth is worth ₹${n0(mv('dcf').value)} a share: even fifteen years of 7-8% revenue growth cannot fill the gap.` },
    { h: 'Growth is coming, but reaches profit slowly', p: `Gases grew ${n1(Q1.gasYoYPct)}% in Q1FY27 and PED external revenue doubled. New plants add depreciation and interest first: we forecast EPS of ₹${n1(F.eps[0])} in FY27E (FY26 ₹${n1(A.eps[b])} included ~₹12 a share of one-offs), ₹${n1(F.eps[1])} in FY28E and ₹${n1(F.eps[2])} in FY29E, with ROE near ${Math.round(F.roe[1])}%.` },
    { h: 'Minority shareholders come second', p: `Since 2020 new merchant business in South and Central India, and all hydrogen and CO2 business, goes to Praxair India, which Linde plc owns 100% (FY25 turnover ₹${n0(RP.praxairIndia.fy25Turnover)} cr). SEBI and SAT ruled against the company; ${n1(RP.egm2026.againstPct)}% of votes at the Mar-2026 EGM rejected its Praxair dealings; the auditor qualified the FY26 accounts.` },
    { h: 'What could prove us wrong', p: `A corporate action by Linde plc (delisting, or merging Praxair India into Linde India) would be priced well above fundamentals: in 2019 minorities set a ₹2,025 delisting price against a ₹428.5 floor. The scarcity premium has also lasted for years. Our bull case ({{scen.bull.tp|inr}}) assumes the stock keeps its own median multiple and the plants start on time.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Governance', v: 'RED' },
    { k: 'Predictability', v: 'AMBER' },
    { k: 'Earnings momentum', v: 'AMBER' },
    { k: 'Competitive position', v: 'GREEN' },
    { k: 'Valuation', v: 'RED' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): margin after the Q1 dip, finance cost and whether borrowings appear on the half-year balance sheet.',
    'Supreme Court: hearing of the appeal on RPT materiality and of the application to stop SEBI acting on the valuer\'s report (listed in Jul-Aug 2026 but not taken up). Any disclosure of the valuer\'s numbers.',
    'Commissioning of the second Tata Steel Kalinganagar ASU and the third Dahej ASU (FY27), then the SAIL Rourkela and Electrosteel Bokaro ASUs.',
    'FY27 dealings with Praxair India after the EGM defeat: supplies were stopped for the rest of FY26; a new approval resolution or a change in the business allocation.',
    'PED execution of the Tata Electronics fab and OSAT, Reliance and PSU nitrogen orders; new CFO from 15-Sep-2026 (third in 2026).',
  ],
};

// ---------------------------------------------------------------- Story in charts
const AN = SA.filter(a => a.fy !== 'Dec18');
const votes = [RP.agm2021.outcome ? 93.94 : null, RP.egm2026.againstPct, RP.agm2026Votes.publicAgainstPctGAM];
const pePeers = ['LINDEINDIA', 'SOLARINDS', '3MINDIA', 'PIDILITIND', 'NAVINFLUOR', 'ELLEN', 'SRF'].map(s => P[s]).filter(p => p.pe).sort((a, c) => c.pe - a.pe);
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'stacked', title: 'Gases are ~84% of revenue; engineering comes and goes', unit: 'Revenue by segment (₹ crore; FY23 = 15 months)', x: AN.map(a => a.fy), series: [{ name: 'Gases & related products', values: AN.map(a => Math.round(a.gasRev)), fmt: 'num' }, { name: 'Project Engineering (external)', values: AN.map(a => Math.round(a.pedExt)), fmt: 'num' }], minLabel: 200, source: 'Segment notes in results and annual reports' },
      { type: 'column', title: 'Gases profit margin tripled since CY18', unit: 'Segment result (PBIT) as % of segment revenue', x: SA.map(a => a.fy), series: [{ name: 'Gases', values: SA.map(a => Math.round(pbitM(a, 'gas') * 10) / 10), fmt: 'pct0' }, { name: 'Project Engineering (on external revenue)', values: SA.map(a => Math.round(pbitM(a, 'ped') * 10) / 10), fmt: 'pct0' }], labels: 'none', source: 'Segment notes; FY26 Gases includes the ₹90 cr reversal' },
    ] },
    { pair: [
      { type: 'column', title: 'Gases revenue: +9% in Q1FY27 after two flat years', unit: 'Gases segment revenue by quarter (₹ crore)', x: QL, series: [{ name: 'Gases', values: SQ.map(q => Math.round(q.gasRev)), fmt: 'num' }], labels: 'all', source: 'Quarterly results (segment tables)' },
      { type: 'stacked', title: 'Engineering: plants for itself vs for customers', unit: 'Project Engineering revenue (₹ crore)', x: ['FY23', 'FY24', 'FY25', 'FY26'], series: [{ name: 'External customers', values: ['FY23', 'FY24', 'FY25', 'FY26'].map(y => Math.round(X.sa(y).pedExt)), fmt: 'num' }, { name: 'Linde India\'s own plants (at cost)', values: ['FY23', 'FY24', 'FY25', 'FY26'].map(y => Math.round(X.sa(y).pedInter)), fmt: 'num' }], minLabel: 80, source: 'Segment notes (inter-segment revenue)' },
    ] },
    { pair: [
      { type: 'line', title: `Forward P/E: ~${Math.round(H.min)}-${Math.round(H.max)}x since 2022; median ${n1(H.med)}x`, unit: 'Price ÷ next full-year EPS (x)', x: fwdPe.map(x => x[0]), series: [{ name: 'Forward P/E', values: fwdPe.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: H.med, text: `Median: ${n1(H.med)}x` }, { v: peMult, text: `Our target: ${peMult}x`, color: '#cf8f1f' }], source: 'Screener.in prices; actual EPS, GAM estimates for FY27-28E' },
      { type: 'hbar', title: 'The most expensive stock in its peer set', unit: 'Trailing P/E (x), 30-Sep-2026', x: [...pePeers.map(p => X.shortName(p.symbol)), 'Linde plc (2026E, approx.)'], series: [{ name: 'P/E', values: [...pePeers.map(p => p.pe), 25], fmt: 'x' }], labels: 'all', highlight: 'Linde India', source: 'Screener.in at the NSE close; Linde plc: GAM from its market value and 2026 EPS guidance' },
    ] },
    { pair: [
      { type: 'column', title: 'Public shareholders keep voting no', unit: '% of public votes cast against', x: ['RPTs (Jun-21)', 'Praxair RPTs (Mar-26)', 'FY26 accounts (Aug-26)'], series: [{ name: 'Against', values: votes, fmt: 'pct' }], labels: 'all', min: 0, max: 100, source: 'Company voting results; Aug-2026 public share = GAM (promoter votes removed)' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} target, scenarios and DCF vs the price', unit: `₹ per share; CMP ₹${n0(price)}`, x: ['DCF (cross-check)', 'Bear', 'GAM base', 'Bull'], series: [{ name: 'Value', values: [Math.round(mv('dcf').value), M_SCEN('bear'), V.tp, M_SCEN('bull')], fmt: 'inr' }], labels: 'all', highlight: 'GAM base', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'GAM Research' },
    ] },
    { callout: `**In one line:** a well-run plant business with contracted customers, owned by the global leader, whose public shareholders have voted against it on related-party dealings (2021, 2026) and on its FY26 accounts, trading ${Math.abs(Math.round(fromAth))}% below its May-2024 peak but still at more than ${Math.round(peFY28)}x FY28E earnings.` },
  ],
};
function M_SCEN(k) { return X.SC[k].tp; }

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.gases, P3.ped, P3.parent, P3.moat, p.financials, P4.guidance, p.capital, P4.quality, p.balance, P4.ownership(p.ownershipBase), P4.governance, P5.forecasts, P5.street, P6.valuation, P7.risks, p.statements, P7.glossary],
  statementNotes: P7.statementNotes,
};
