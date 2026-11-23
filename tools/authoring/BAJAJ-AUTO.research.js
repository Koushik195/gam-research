// Bajaj Auto report, part B: cover, the story in charts, and the merger of part2-4. Shared inputs in
// BAJAJ-AUTO.ctx.js. Forecast and valuation figures are live tokens ({{...}}) or computed from the built model.
// As of 30-Sep-2026.
const X = require('./BAJAJ-AUTO.ctx');
const { F, V, n0, n1, pc, SA, SQ, QL, A26, Q1, KTM, price, mv, SOTP, CORE, SAPE, fwdSaAll, rating, saEpsSep28, STR, sectorDr, BACL_PB, KS, avgEps } = X;
const P2 = require('./BAJAJ-AUTO.part2'), P3 = require('./BAJAJ-AUTO.part3'), P4 = require('./BAJAJ-AUTO.part4');
const S = SOTP.base;

const cover = {
  headline: 'A world-class exporter priced for more than its own history says it is worth; KTM and the lender are extras, not the story',
  lead: `Bajaj Auto is India's most profitable two- and three-wheeler maker and its largest vehicle exporter: 5.1 mn vehicles in FY26, 44% of them shipped to 70+ countries, at a 20.5% standalone EBITDA margin. Q1FY27 was a record (volumes +29%, standalone EBITDA +45%) as exports boomed (+54%), the rupee fell to ₹94 per dollar and electric scooters and three-wheelers reached 30% of domestic revenue. But domestic motorcycle share keeps slipping (18.2% in FY24, 15.6% in FY26), and the group now also owns a captive lender (Bajaj Auto Credit, AUM ~₹20,000 cr) and 74.94% of KTM's loss-making parent. The street values Bajaj on **P/E on FY28E/Sep-28E standalone EPS at 23-25x**, some adding KTM and the lender. We do the same, but our derived multiple is **${CORE.base}x** (its own ${n1(SAPE.med)}x median forward P/E since 2021, cut by the sector's ${Math.abs(sectorDr).toFixed(1)}% de-rating): ${CORE.base}x × Sep-28E standalone EPS of ₹${n1(S.eps)} = ₹${n0(S.core)}, plus BACL at ${BACL_PB.base}x book (₹${n0(S.bacl)}) and the KTM stake at market less ${KS.discountPct.base}% (₹${n0(S.ktm)}) gives **{{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}.** Cross-checks: EV/EBITDA ₹${n0(mv('ev').value)}, DCF ₹${n0(mv('dcf').value)}. Bull {{scen.bull.tp|inr}}; bear {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'The export machine is firing', p: `Exports were 2.25 mn units and $2.25 bn in FY26 (+20%) and 12.7 lakh units in Apr-Aug 2026 (+50%). Bajaj is #1 in 9 of 15 key motorcycle export markets, holds ~60% of Nigeria at retail and grows ~2x its top-30 markets. This is a real moat. It is also the most volatile part of the business: Nigeria fell from 50,000 bikes a month to under 5,000 in 2023-24.` },
    { h: 'At home, a premium and EV story with a shrinking commuter base', p: `Bajaj gives up share in 100-125cc commuters "on its own terms" and wins in 150cc+, KTM/Triumph (1.30 lakh units in FY26) and EVs (Chetak 20.7% share and EBITDA positive; #1 in e-3W). The mix lifts margins; the share loss (2W Vahan share −60 bp YoY in Q1FY27) caps volume. The festive Pulsar relaunch is the test.` },
    { h: 'Margins: great, but helped by things that can reverse', p: `Standalone EBITDA margin 20.9% in Q1FY27 despite commodity inflation of ~4.5% of revenue. The cushions: a rupee that weakened ~10% in a year, PLI incentives of ₹1,040 cr (~9% of FY26 EBITDA) and price rises. We model ${X.AS.segments[0].marginPct[0]}% / ${X.AS.segments[0].marginPct[1]}% / ${X.AS.segments[0].marginPct[2]}% (FY27-29E), slightly below the street.` },
    { h: 'Valuation: the street pays for a re-rating', p: `At ₹${n0(price)} the stock trades at ${n1(price / saEpsSep28('base'))}x Sep-28E standalone EPS (~${n1((price - S.bacl - S.ktm) / S.eps)}x after taking out BACL and KTM), against a ${n1(SAPE.med)}x median since 2021. Our EPS is in line with the street (FY28E ₹${n1(X.SAEPS[1])} vs ~₹${n1(avgEps('FY28E'))}); the gap is the multiple: 23-25x assumes the 2024 peak multiple is the new normal.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹, FY26 count)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'AMBER' },
    { k: 'Earnings momentum', v: 'GREEN' },
    { k: 'Competitive position', v: 'AMBER' },
    { k: 'Valuation', v: 'RED' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): how much of the broader cost inflation management warned about hits the margin, and whether the rupee keeps offsetting it.',
    'Festive season (Oct-Nov 2026) and the Pulsar relaunch: an all-new 150cc Pulsar and ~10 facelifts by September, two new 125cc brands within FY27. Domestic share (Vahan) is the number to watch.',
    'Exports: management targets 250k+ units a month from Q2 (Aug-2026: 280k incl. 3W). Nigeria\'s pre-election buying could fade after the 2027 elections.',
    'KTM: Bajaj Mobility returned to positive EBIT in Q2 2026 (EUR1.3 m); H2 2026 results and covenant tests from Jun-2027 (net debt/EBITDA ≤4.5x).',
    'Capacity from 7 mn to 9 mn units a year and Chetak from 50k to 60k a month: supply has been the constraint in EVs and exports.',
  ],
};

// ---------------------------------------------------------------- Story in charts
const fwd = fwdSaAll.filter((_, i) => i % 2 === 0 || i === fwdSaAll.length - 1);
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'stacked', title: 'Exports are back to 44% of volume', unit: "Vehicles sold ('000)", x: SA.map(a => a.fy), series: [{ name: 'Domestic', values: SA.map(a => Math.round((a.dom2w + a.dom3w) / 1000)), fmt: 'num' }, { name: 'Exports', values: SA.map(a => Math.round((a.exp2w + a.exp3w) / 1000)), fmt: 'num' }], minLabel: 300, source: 'Company sales releases, AR FY26, MOSL (FY20-21)' },
      { type: 'line', title: 'Domestic motorcycle share: 18.2% to 15.6% in two years', unit: 'Bajaj share of domestic motorcycle sales (%)', x: SA.filter(a => a.mcSharePct).map(a => a.fy), series: [{ name: 'Share', values: SA.filter(a => a.mcSharePct).map(a => a.mcSharePct), fmt: 'pct' }], labels: 'all', min: 10, max: 20, source: 'AR FY26 Table 1 (SIAM)' },
    ] },
    { pair: [
      { type: 'column', title: 'Export revenue at a record $2.25 bn', unit: 'Export revenue (USD m)', x: SA.map(a => a.fy), series: [{ name: 'Exports', values: SA.map(a => a.expUsdM), fmt: 'num' }], labels: 'all', source: 'AR FY26 Table 4 (FY25-26); ICICI Direct (FY20-24)' },
      { type: 'line', title: 'Margin held above 20% as the rupee fell from ₹85.6 to ₹94.4 per dollar', unit: 'Standalone EBITDA margin (%), by quarter', x: QL.slice(4), series: [{ name: 'EBITDA margin', values: SQ.slice(4).map(q => q.saMarginPct), fmt: 'pct' }], labels: 'all', min: 16, max: 24, source: 'Screener.in standalone; realised USD/INR from company calls' },
    ] },
    { pair: [
      { type: 'column', title: 'Chetak: from 212 scooters to 3 lakh a year', unit: 'Chetak domestic sales (units)', x: SA.map(a => a.fy), series: [{ name: 'Chetak', values: SA.map(a => a.chetak), fmt: 'num' }], labels: 'all', source: 'AR FY26 Table 2' },
      { type: 'column', title: 'KTM: revenue more than halved, now recovering', unit: 'Bajaj Mobility (KTM) revenue (EUR m); 2026 = H1 x 2 for scale only', x: [...KTM.history.map(h => String(h.y)), 'H1-26 x2'], series: [{ name: 'Revenue', values: [...KTM.history.map(h => h.revenueEurM), Math.round(KTM.h1_2026.revenueEurM * 2)], fmt: 'num' }], labels: 'all', highlight: 'H1-26 x2', source: 'Bajaj Mobility AG annual report 2025 and H1 2026 report' },
    ] },
    { pair: [
      { type: 'line', title: `Forward P/E on standalone EPS: ${n1(price / X.SAEPS[1])}x FY28E now vs a ${n1(SAPE.med)}x median since 2021`, unit: 'Price ÷ next full-year standalone EPS (x)', x: fwd.map(x => x[0]), series: [{ name: 'Forward P/E', values: fwd.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 2, lines: [{ v: SAPE.med, text: `Median since Apr-2021: ${n1(SAPE.med)}x` }, { v: CORE.base, text: `Our multiple: ${CORE.base}x`, color: '#cf8f1f' }], source: 'Screener.in prices; standalone EPS, GAM estimates FY27-28E' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (Jul-2026 notes)', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...STR.filter(s => s.tp).map(s => s.broker), 'GAM (base)'], series: [{ name: 'Target', values: [...STR.filter(s => s.tp).map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes and Business Today (21-26 Jul 2026), GAM Research' },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P2.domestic, P2.exportsSec, P2.threeW, P2.bacl, P2.ktm, P3.moat, p.financials, P3.guidance, p.capital, P3.quality, p.balance, P3.ownership(p.ownershipBase), P3.governance, P3.forecasts, P4.street, P4.valuation, P4.risks, p.statements, P4.glossary],
  statementNotes: P4.statementNotes,
};
