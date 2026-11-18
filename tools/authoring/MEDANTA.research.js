// Global Health (Medanta) report, part B: cover, story in charts, and the merger of part2-6 (business, history,
// industry, tailwind test, hospital KPIs, clusters, expansion, moat, Q1FY27, earnings quality, ownership,
// governance, forecasts, street, valuation, verdict, glossary, statement notes). Shared inputs in MEDANTA.ctx.js.
// Forecast and valuation figures are live tokens ({{...}}) that follow assumptions.json. As of 30-Sep-2026.
const X = require('./MEDANTA.ctx');
const { F, V, A, n0, n1, SQ, QL, Q1, AK, CL, b, price, mv, evMult, ebitdaSep28, HEV, fwdEv, evNow, rating, ST, sectorDrEv, epsCagrFwd, pl, avgPost } = X;
const P2 = require('./MEDANTA.part2'), P3 = require('./MEDANTA.part3'), P4 = require('./MEDANTA.part4'), P5 = require('./MEDANTA.part5'), P6 = require('./MEDANTA.part6');

const cover = {
  headline: 'One of India\'s best hospital franchises, priced for a plan that starts paying only in FY30',
  lead: `Medanta runs six large super-specialty hospitals in North and East India (3,737 beds at Jun-2026), anchored by the 1,440-bed Medicity in Gurugram and by first-mover hospitals in Lucknow and Patna that fill at 68-70% and earn ~32% margins without price increases. Q1FY27 revenue rose 26.5% (in-patients +28%) and the new Noida hospital's loss shrank from ₹32 cr a quarter to ₹4.9 cr. Next comes a near-doubling of beds: 418 brownfield beds in FY27, then 2,950 beds in five greenfields (three in Delhi and Mumbai) that management expects to contribute "more FY30 numbers", for ₹4,858 cr of capex. The street values Medanta on **EV/EBITDA on FY28E or Sep-28E (25-28x)**. We forecast EBITDA (after ESOP, before other income) of ₹${n0(F.ebitda[0])} / ${n0(F.ebitda[1])} / ${n0(F.ebitda[2])} cr and EPS of ₹${n1(F.eps[0])} / ${n1(F.eps[1])} / ${n1(F.eps[2])} for FY27-29E. Applying **${evMult}x to Sep-28E EBITDA of ₹${n0(ebitdaSep28)} cr** (post-Ind AS, lease liabilities in net debt) gives **{{dcf.tp|inr}} ({{dcf.upside|chg}})**: **we initiate with ${rating}.** Cross-checks: P/E ₹${n0(mv('pe').value)}, DCF ₹${n0(mv('dcf').value)}. Bull case {{scen.bull.tp|inr}}; bear case {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'A brand that fills hospitals', p: `Gurugram is ranked India's best hospital (Newsweek 2026) and draws complex cases from across North India and abroad. Lucknow and Patna broke even in their first full year; in Q1FY27 they grew 28% at a ${CL.c2.Q1FY27.marginExNoidaPct}% margin with no tariff increase in Patna in 4.5 years. In-patient volumes doubled from FY22 to FY26.` },
    { h: 'FY27-28 look strong', p: `Noida swings from a ₹78 cr loss (FY26) to profit, 418 brownfield beds open and Lucknow/Patna keep compounding. We model revenue +{{F.salesGrowth.0|pct}} and +{{F.salesGrowth.1|pct}} and EBITDA in line with the street for FY27-28; our margin is lower (${n1(F.ebitdaMargin[1])}% FY28E vs PL's ${n1(pl.ebitda.FY28E / pl.sales.FY28E * 100)}%) because grant income fades and doctors are hired ahead of the new hospitals.` },
    { h: 'Then an air pocket', p: `No greenfield opens before FY30, so revenue growth slows to ~{{F.salesGrowth.2|pct}} in FY29E while ₹1,300-1,400 cr a year of capex goes in; net debt (incl. leases) moves from ~zero to ~₹280 cr and ROE dips to ~15%. Our DCF (₹${n0(mv('dcf').value)}) shows how much of today's price depends on the hospitals that open after FY30.` },
    { h: 'Valuation: at its own history while peers de-rated', p: `At ₹${n0(price)} the stock trades at ${n1(evNow)}x our FY28E EV/EBITDA, close to its ${n1(HEV.med)}x forward median since listing, while listed hospital peers had de-rated ~${Math.round(-sectorDrEv)}% by 30-Sep-2026: that gives ${evMult}x and {{dcf.tp|inr}}. The street (average post-Q1 target ₹${n0(avgPost)}) pays 27-28x.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'GREEN' },
    { k: 'Earnings momentum', v: 'GREEN' },
    { k: 'Competitive position', v: 'GREEN' },
    { k: 'Valuation', v: 'RED' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): Noida breakeven (guided for H2FY27, now "earlier"), the Indore 80-bed cancer unit (end-Q2/early-Q3FY27) and Gurugram\'s extra operating theatres and cath labs.',
    'Brownfield beds: Lucknow +172 (H2FY27), Patna +49 (Q4FY27), Noida to 550; any tariff increase in Patna or Lucknow.',
    'Greenfield milestones: Mumbai (MHADA and environmental clearances), Pitampura building plans, South Delhi civil works, Guwahati construction.',
    'Supply: block sales by Temasek (14.85%) or the co-founder (~10%), who sold 0.74% in May-Jun 2026.',
    'Any O&M or acquisition deal ("a couple" under study, May-2026).',
  ],
};

// ---------------------------------------------------------------- Story in charts
const QQ = SQ.slice(4); // Q1FY26..Q1FY27
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: 'In-patients doubled in four years: growth is volume-led', unit: 'In-patient volumes (\'000 a year)', x: AK.map(k => k.fy), series: [{ name: 'In-patients', values: AK.map(k => Math.round(k.ipVolume / 1000)), fmt: 'num' }], labels: 'all', source: 'AR FY26 p.14; company presentations' },
      { type: 'line', title: 'ARPOB +22% since FY22 with shorter stays', unit: 'Revenue per occupied bed-day (₹)', x: AK.map(k => k.fy), series: [{ name: 'ARPOB', values: AK.map(k => k.arpob), fmt: 'num' }], labels: 'all', source: 'Company presentations' },
    ] },
    { pair: [
      { type: 'column', title: 'Lucknow + Patna grow ~30% a year; Gurugram-led Cluster 1 ~10%', unit: 'Total income growth, year on year (%)', x: ['FY26', 'Q1FY27'], series: [{ name: 'Cluster 1', values: [9.0, 10.1], fmt: 'pct' }, { name: 'Lucknow + Patna', values: [29.2, 28.2], fmt: 'pct' }], labels: 'all', source: 'Q4FY26 presentation pp. 20-21; Q1FY27 presentation pp. 15-16' },
      { type: 'column', title: 'Noida: from a ₹32 cr quarterly loss to almost breakeven', unit: 'Noida EBITDA, company basis (₹ crore)', x: ['Q1FY26', 'Q2FY26', 'Q3FY26', 'Q4FY26', 'Q1FY27'], series: [{ name: 'EBITDA', values: [-3.0, -19.7, -32.0, -23.6, -4.9], fmt: 'n1' }], labels: 'all', source: 'Q1FY27 presentation p.10' },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: Noida took it down in FY26; it recovers, then flattens', unit: 'EBITDA margin, after ESOP, before other income (%)', x: ['FY22', 'FY23', 'FY24', 'FY25', 'FY26', ...F.years], series: [{ name: 'Margin', values: [...A.ebitdaMargin.slice(b - 4, b + 1).map(v => Math.round(v * 10) / 10), ...F.ebitdaMargin], fmt: 'pct' }], labels: 'all', min: 15, max: 30, source: 'Screener.in; GAM estimates FY27-29E' },
      { type: 'column', title: 'Revenue growth accelerated to 26.5% in Q1FY27', unit: 'Revenue growth, year on year (%)', x: QL.slice(4), series: [{ name: 'Growth', values: QQ.map((q, i) => Math.round((q.consRev / SQ[i].consRev - 1) * 1000) / 10), fmt: 'pct' }], labels: 'all', source: 'Screener.in' },
    ] },
    { pair: [
      { type: 'line', title: `Forward EV/EBITDA: median ${n1(HEV.med)}x since listing, ${n1(evNow)}x now`, unit: 'EV (incl. lease liabilities) ÷ next full-year EBITDA, after ESOP (x)', x: fwdEv.map(x => x[0]), series: [{ name: 'Forward EV/EBITDA', values: fwdEv.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: HEV.med, text: `Median since listing: ${n1(HEV.med)}x` }, { v: evMult, text: `Our target: ${evMult}x`, color: '#cf8f1f' }], source: 'Screener.in prices and balance sheets; company cash; GAM estimates FY27-29E' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (notes standing on 30-Sep-26)', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...ST.map(s => `${s.broker} (${X.shortDate(s.date)})`), 'GAM (base)'], series: [{ name: 'Target', values: [...ST.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes and summaries (Mar-2026 to Aug-2026), GAM Research' },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.hospitals, P3.clusters, p.noida, P3.expansion, P3.moat, p.financials, P4.guidance, p.capital, P4.quality, p.balance, P4.ownership(p.ownershipBase), P4.governance, P4.forecasts, P5.street, P5.valuation, P5.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
