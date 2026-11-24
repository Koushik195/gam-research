// JBM Auto report, part B: cover, the story in charts, and the merger of part2-6 (business, history, industry, tailwind
// test, components, e-buses, tool room, moat, Q1FY27, earnings quality, ownership, governance, forecasts, street,
// valuation, verdict, glossary, statement notes). Shared inputs in JBMA.ctx.js; forecast and valuation figures are live
// tokens ({{...}}) that follow assumptions.json. As of 30-Sep-2026.
const X = require('./JBMA.ctx');
X.assertBuild(); X.assertOi();
const { F, V, A, SA, n0, n1, price, mv, FM, sectorDr, MULT, epsSep, rating, sepNow, trailPe, b, nd0, ndEbitda, SENS, k } = X;
const P2 = require('./JBMA.part2'), P3 = require('./JBMA.part3'), P4 = require('./JBMA.part4'), P5 = require('./JBMA.part5'), P6 = require('./JBMA.part6');
const E = epsSep.base;
const fy = SA.map(a => a.fy);
const r1 = v => Math.round(v * 10) / 10;
const ndHist = ['FY22', 'FY23', 'FY24', 'FY25'].map(f => { const i = A.labels.indexOf(f); return r1(A.netDebt[i] / A.ebitda[i]); });
const ndFy26Rep = r1((nd0 + 410) / A.ebitda[b]);

const cover = {
  headline: 'India\'s e-bus leader with a sheet-metal business attached: the stock\'s own history says BUY, its cash flows do not',
  lead: `JBM Auto makes sheet-metal parts for car and truck makers (57% of FY26 revenue), tools and dies (6%) and electric buses (38%), and through its 83%-owned JV JBM Ecolife also runs buses for cities on 10-12-year gross-cost contracts. Revenue tripled in five years to ₹6,088 cr; the EBITDA margin stayed at 10-12%, debt rose to ₹3,029 cr and cash from operations was negative in FY26 as receivables and unbilled revenue piled up. Q1FY27 was solid (revenue +15%, PAT +16%) and Ecolife's ₹750 cr raise let JBM Auto cut debt by ~₹410 cr. We forecast EPS of ₹${n1(F.eps[0])} / ₹${n1(F.eps[1])} / ₹${n1(F.eps[2])} for FY27-29E. No broker note dated on or before 30-Sep-2026 could be found, so we use the house method for auto components: **P/E on Sep-28E EPS**. The stock's ${n1(FM.median)}x forward-P/E median since Apr-2021, cut by the ${Math.abs(sectorDr).toFixed(1)}% auto-component de-rating, gives **${MULT.base}x Sep-28E EPS of ₹${n1(E)} = {{dcf.tp|inr}} ({{dcf.upside|chg}}): ${rating} under our rule.** We flag the gap honestly: that median includes the 2023-24 e-bus re-rating (forward P/E 47-114x); without those two years the multiple would be ${SENS.exHype}x (≈₹${n0(Math.round(SENS.exHype * E / 10) * 10)}). Cross-checks: EV/EBITDA ₹${n0(mv('ev').value)}, DCF ₹${n0(mv('dcf').value)}. Bull {{scen.bull.tp|inr}}; bear {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'A real e-bus franchise', p: 'About 1,282 e-buses sold in FY26 (~24% share by its own count), a ~20,000-bus plant near Delhi, a full range from city buses to sleeper coaches, and an order pipeline of 7,000-7,500 buses to execute over 2-3 years (Crisil, Aug-2026) under PM e-Bus Sewa, PM E-DRIVE and state programmes. Outside investors (IFC, Motilal Oswal; Bain in talks per the press) are funding the operating side.' },
    { h: 'But the group finances its own customer', p: 'Much of the bus revenue is sold to JBM Ecolife, a JV that JBM Auto funded with ₹336 cr of loans, ₹302 cr of preference shares and guarantees at Mar-26. Revenue is booked as buses are built. Receivables (₹2,185 cr) and unbilled revenue (₹1,511 cr) together are ~61% of FY26 revenue; the EV segment earned 4.9% EBIT on its ₹5,129 cr of assets.' },
    { h: 'Earnings grow, helped by lower interest', p: `We model revenue +{{F.salesGrowth.0|n1}}% in FY27E and ~13-14% after, with an EBITDA margin of {{F.ebitdaMargin.0|pct}} → {{F.ebitdaMargin.2|pct}}. EPS grows faster (+{{F.epsGrowth.0|n0}}% in FY27E) because interest falls after the Jun-2026 debt cut. Other income (₹126 cr in FY26, mostly interest, including on loans to the JV) falls to ₹{{F.otherIncome.1|num}} cr. Free cash flow stays near zero: our net debt is still ~₹${n0(-F.treasury[2])} cr at FY29E.` },
    { h: 'Valuation: cheap against its own past, expensive against its cash', p: `At ₹${n0(price)} JBM trades at ${n1(sepNow)}x our Sep-28E EPS and ${n1(trailPe)}x trailing earnings, against a ${n1(FM.median)}x forward-P/E median since Apr-2021, and ~50% below its Feb-2024 peak. On EV/EBITDA (${X.evMULT.base}x) the value is ~₹${n0(mv('ev').value)}; the DCF gives only ₹${n0(mv('dcf').value)} because working capital absorbs most of the cash. The BUY rests on the house multiple; the cross-checks are the main risk to it.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n2'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'AMBER' },
    { k: 'Earnings momentum', v: 'GREEN' },
    { k: 'Balance sheet', v: 'RED' },
    { k: 'Valuation', v: 'AMBER' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026) with the first half-year balance sheet since the debt cut: receivables, unbilled revenue and net debt.',
    'The outcome of the EV-business fundraising (press reports of Bain Capital talks, ~US$300 mn, Aug-2026; JBM: no binding agreement) and the price it sets for the bus business.',
    'Use of the ₹1,500 cr fundraising authority approved by the board on 30-Jul-2026 (an equity issue would dilute EPS).',
    'Bus deliveries under PM e-Bus Sewa and PM E-DRIVE and the 500-bus DRIVN agreement; Ecolife deploying the ~2,000 buses funded by Motilal Oswal.',
    'Crisil\'s expected fall in debt to ₹2,500-2,550 cr by Mar-2027 and gross current assets to ~250 days.',
  ],
};

const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: `Revenue: ₹1,982 cr (FY21) to ₹6,088 cr (FY26), ₹${n0(F.sales[2])} cr by FY29E`, unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY19', to: 'FY29E', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'all', source: 'Screener.in; GAM estimates FY27-29E' },
      { type: 'stacked', title: 'E-buses went from 12% to 38% of revenue in six years', unit: 'Segment revenue (₹ crore)', x: fy, series: [{ name: 'Components', values: SA.map(a => Math.round(a.coRev)), fmt: 'num' }, { name: 'Tool room', values: SA.map(a => Math.round(a.trRev)), fmt: 'num' }, { name: 'E-buses (OEM)', values: SA.map(a => Math.round(a.evRev)), fmt: 'num' }], source: 'Annual reports FY21, FY23, FY25, FY26 (segment notes)' },
    ] },
    { pair: [
      { type: 'line', title: 'Segment EBIT margins: tool room ~20%, e-buses ~11%, components ~8% (FY26)', unit: 'Segment EBIT margin (%)', x: fy, series: [{ name: 'Components', values: SA.map(a => r1(a.coEbit / a.coRev * 100)), fmt: 'pct' }, { name: 'Tool room', values: SA.map(a => r1(a.trEbit / a.trRev * 100)), fmt: 'pct' }, { name: 'E-buses', values: SA.map(a => r1(a.evEbit / a.evRev * 100)), fmt: 'pct' }], labels: 'last', min: 0, max: 30, source: 'Annual reports (segment result before interest and tax)' },
      { type: 'hbar', title: 'EBIT per ₹100 of segment assets (FY26): e-buses earn ₹4.9, components ₹17', unit: 'Segment EBIT ÷ segment assets (%)', x: ['Components', 'Tool room', 'E-buses'], series: ['FY24', 'FY25', 'FY26'].map(f => { const a = X.yr(f); return { name: f, values: [r1(a.coEbit / a.coAssets * 100), r1(a.trEbit / a.trAssets * 100), r1(a.evEbit / a.evAssets * 100)], fmt: 'pct' }; }), labels: 'all', source: 'Annual reports FY25-26 (segment result and segment assets)' },
    ] },
    { pair: [
      { type: 'column', title: 'Trade receivables: ₹670 cr (FY24) to ₹2,185 cr (FY26)', unit: 'Trade receivables (₹ crore)', x: 'A.labels', from: 'FY19', series: [{ name: 'Receivables', ref: 'A.receivables', fmt: 'num' }], labels: 'all', source: 'Screener.in. Unbilled revenue (contract assets) comes on top: ₹1,126 cr (FY25), ₹1,511 cr (FY26), AR FY26.' },
      { type: 'column', title: `Net debt / EBITDA: ${ndFy26Rep}x (FY26) to ~${n1(ndEbitda[2])}x by FY29E in our model`, unit: 'Net debt ÷ EBITDA (x)', x: ['FY22', 'FY23', 'FY24', 'FY25', 'FY26', 'FY26 PF', 'FY27E', 'FY28E', 'FY29E'], series: [{ name: 'Net debt / EBITDA', values: [...ndHist, ndFy26Rep, r1(nd0 / A.ebitda[b]), ...ndEbitda.map(r1)], fmt: 'x' }], labels: 'all', source: 'Screener.in (borrowings less cash and investments, incl. JV preference shares); FY26 PF = after the ₹410 cr repaid in Jun-2026; GAM estimates. Crisil\'s adjusted debt/EBITDA: 4.5x (FY26).' },
    ] },
    { pair: [
      { type: 'line', title: `Forward P/E: ${Math.round(sepNow)}x Sep-28E vs a ${Math.round(FM.median)}x median since Apr-2021`, unit: 'Price ÷ next full-year EPS (x)', x: X.fwdWeekly.map(x => x[0]), series: [{ name: 'Forward P/E', values: X.fwdWeekly.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: FM.median, text: `Median: ${n1(FM.median)}x` }, { v: MULT.base, text: `Our multiple: ${MULT.base}x`, color: '#cf8f1f' }], source: 'Screener.in weekly prices; actual EPS (as reported), GAM estimates for FY27-28E' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} against the cross-checks', unit: `₹ per share; CMP ₹${n0(price)}`, x: ['P/E (target)', 'EV/EBITDA', 'DCF', 'P/E ex 2023-24 re-rating', 'Share price'], series: [{ name: 'Value', values: [Math.round(mv('pe').value), Math.round(mv('ev').value), Math.round(mv('dcf').value), Math.round(SENS.exHype * E), price], fmt: 'inr' }], labels: 'all', highlight: 'P/E (target)', source: 'GAM Research. No broker targets dated on or before 30-Sep-2026 were found.' },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.components, P3.ebus, P3.toolroom, P3.moat, p.financials, P4.guidance, p.capital, P4.quality, p.balance, P4.ownership(p.ownershipBase), P4.governance, P4.forecasts, P5.street, P5.valuation, P6.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
