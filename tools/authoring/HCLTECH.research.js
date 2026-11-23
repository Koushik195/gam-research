// HCL Technologies report, part B: cover, story in charts, and the merger of part2-5 (business, history, industry,
// the AI question, tailwind test, segments, KPIs, moat, Q1FY27, earnings quality, ownership, governance, forecasts,
// street, valuation, verdict, glossary, statement notes). Shared inputs in HCLTECH.ctx.js. Forecast and valuation
// figures are live tokens ({{...}}) that follow assumptions.json. As of 30-Sep-2026.
const X = require('./HCLTECH.ctx');
const { F, V, A, n0, n1, pc, SA, SQ, QL, A26, Q1, price, mv, epsSep28, peMult, FM, fwdPe, rating, b, sectorDr, derate, usdGrowth, divYield, medTp } = X;
const P2 = require('./HCLTECH.part2'), P2b = require('./HCLTECH.part2b'), P3 = require('./HCLTECH.part3'), P3b = require('./HCLTECH.part3b');
const P4 = require('./HCLTECH.part4'), P4b = require('./HCLTECH.part4b'), P5 = require('./HCLTECH.part5'), P5b = require('./HCLTECH.part5b');

const cover = {
  headline: 'A well-run cash machine whose growth has shrunk to 3-4%: the price still assumes the AI de-rating will reverse',
  lead: `HCLTech is India's third-largest IT services company (US$14.7 bn revenue in FY26, 2.2 lakh people), controlled by the Nadar family (60.9%). It has been the fastest-growing tier-1 Indian IT firm for three years, yet growth keeps falling: +5.4%, +4.7% and +3.9% in constant currency in FY24-26, FY27 guided at 1-4% and +2.6% YoY in Q1FY27. Bookings are strong (record Q1 TCV of US$2.4 bn plus a US$1.14 bn mega deal) and Advanced AI revenue grew 62%, but management itself expects AI to deflate its traditional work by 2-3% a year. The street values HCLTech on **P/E on FY28E EPS (15-19x)**. Our EPS of ₹${n1(F.eps[0])} (FY27E) and ₹${n1(F.eps[1])} (FY28E) is in line with the street; FY27's +18% is mostly the weaker rupee. Applying **${peMult}x to Sep-28E EPS of ₹${n1(epsSep28)}** (its 19.8x median forward P/E since 2021, cut by the IT sector's ${Math.abs(Math.round(sectorDr))}% de-rating) gives **{{dcf.tp|inr}} ({{dcf.upside|chg}})**: **we initiate with ${rating}.** Cross-checks: EV/EBITDA ₹${n0(mv('ev').value)}, DCF ₹${n0(mv('dcf').value)}. Bull case {{scen.bull.tp|inr}}; bear case {{scen.bear.tp|inr}}. A ~${n1(divYield)}% dividend yield softens, but does not close, the gap.`,
  arguments: [
    { h: 'Growth has converged down to the pack', p: `Constant-currency growth: 13.7% (FY23), 5.4% (FY24), 4.7% (FY25), 3.9% (FY26); FY27 guidance 1-4% and Q1 +2.6%. Two big US telecom clients cut spend, ERS fell 3.7% QoQ and HCLSoftware shrank 5.3%. In dollars we forecast +${n1(usdGrowth[0])}% / +${n1(usdGrowth[1])}% / +${n1(usdGrowth[2])}% for FY27-29E.` },
    { h: 'AI cuts both ways, and the cut is bigger today', p: 'Advanced AI revenue is US$171 m a quarter (+62% YoY) but only ~4.7% of revenue. Management says 40% of the industry\'s work is "AI-disrupted" and can shrink 3-5% a year, 2-3% a year for HCLTech\'s mix, and that "very little" of it is in reported numbers yet. The same deal is ~20% smaller than before.' },
    { h: 'Margins, returns and cash are excellent', p: `EBIT 17.5% in Q1FY27 before restructuring; ROIC 40.7% (Services 47.8%); free cash flow ~100% of net income; ₹26,900 cr net cash; at least 75% of profit returned by policy (90%+ in practice). We model EBIT of ₹{{F.ebit.0|num}} cr in FY27E, ${n1(X.ebitM[0])}% of revenue, inside the 17.5-18.5% guidance.` },
    { h: 'The sector has been re-priced; HCLTech only partly', p: `Eight Indian IT peers trade a median ${Math.abs(Math.round(sectorDr))}% below their five-year median P/E (TCS ${pc(derate.TCS)}, Infosys ${pc(derate.INFY)}); HCLTech ${pc(derate.HCLTECH)}. At ₹${n0(price)} it trades at ${n1(price / F.eps[1])}x our FY28E EPS against ${peMult}x in our target. The street's median target is ₹${n0(medTp)}, flat on the price.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'GREEN' },
    { k: 'Predictability', v: 'AMBER' },
    { k: 'Earnings momentum', v: 'AMBER' },
    { k: 'Competitive position', v: 'AMBER' },
    { k: 'Valuation', v: 'RED' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): the first test of whether the telecom cuts have bottomed; management said it would revisit FY27 guidance after Q2.',
    'The US$1.14 bn mega deal: transition through H2FY27, steady state from April 2027 (management), the main support for FY28 growth.',
    'AI data-centre plan: how much of the up-to-₹3,500 cr comes from HCLTech\'s balance sheet versus partners, clients and debt, and the returns it earns.',
    'HCLSoftware: whether Jaspersoft (US$10-15 m a quarter) and the data portfolio stop the revenue decline; ARR has been flat near US$1.05 bn for two years.',
    'New AI-model releases: Anthropic\'s tools triggered the February 2026 sell-offs; each new capability re-opens the deflation debate.',
  ],
};

// ---------------------------------------------------------------- Story in charts
const YRS = ['FY22', 'FY23', 'FY24', 'FY25', 'FY26'];
const RATED = X.withTp.filter(s => s.rating);
const usdG = [null, ...YRS.slice(1).map((y, i) => Math.round((X.yr(y).usdRev / X.yr(YRS[i]).usdRev - 1) * 1000) / 10)];
const inrG = YRS.map(y => { const i = A.labels.indexOf(y); return Math.round(A.salesGrowth[i] * 10) / 10; });
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: `Constant-currency growth: 13.7% to 3.9% in three years; ~${n1(X.ccGrowth[0])}% in FY27E`, unit: 'Revenue growth, constant currency (%)', x: [...YRS, 'FY27E', 'FY28E', 'FY29E'], series: [{ name: 'CC growth', values: [13.7, 13.7, 5.4, 4.7, 3.9, ...X.ccGrowth.map(v => Math.round(v * 10) / 10)], fmt: 'pct' }], labels: 'all', source: 'Q4FY26 investor release; GAM estimates (FY27E includes Jaspersoft)' },
      { type: 'line', title: 'Quarterly growth has not re-accelerated', unit: 'Growth, constant currency, year on year (%)', x: QL, series: [{ name: 'Company', values: SQ.map(q => q.ccYoYPct), fmt: 'pct' }, { name: 'Services', values: SQ.map(q => q.servicesCcYoYPct), fmt: 'pct' }], labels: 'last', min: 0, max: 8, source: 'HCLTech investor releases' },
    ] },
    { pair: [
      { type: 'column', title: 'Rupee growth flatters: FY27E +{{F.salesGrowth.0|pct}} in rupees, +' + n1(usdGrowth[0]) + '% in dollars', unit: 'Revenue growth (%)', x: [...YRS.slice(1), 'FY27E', 'FY28E', 'FY29E'], series: [{ name: 'In rupees', values: [...inrG.slice(1), ...F.salesGrowth.map(v => Math.round(v * 10) / 10)], fmt: 'pct' }, { name: 'In US dollars', values: [...usdG.slice(1), ...usdGrowth.map(v => Math.round(v * 10) / 10)], fmt: 'pct' }], labels: 'all', source: 'Investor releases, Screener.in; GAM estimates at ₹95.5-95.8 per US$' },
      { type: 'line', title: 'Segment EBIT margins: Services drifting down, software holding', unit: 'Segment EBIT margin (%)', x: SA.filter(a => a.fy >= 'FY21').map(a => a.fy), series: [{ name: 'IT & Business Services', values: SA.filter(a => a.fy >= 'FY21').map(a => a.itbsMarginPct), fmt: 'pct' }, { name: 'Engineering & R&D', values: SA.filter(a => a.fy >= 'FY21').map(a => a.ersMarginPct), fmt: 'pct' }, { name: 'HCLSoftware', values: SA.filter(a => a.fy >= 'FY21').map(a => a.swMarginPct), fmt: 'pct' }], labels: 'last', min: 10, max: 30, source: 'Annual-report segment notes (restated bases)' },
    ] },
    { pair: [
      { type: 'column', title: 'Bookings are strong; they convert slowly', unit: 'New deal wins, TCV (US$ m)', x: SQ.filter(q => q.tcvUsd).map(q => q.q), series: [{ name: 'TCV', values: SQ.filter(q => q.tcvUsd).map(q => q.tcvUsd), fmt: 'num' }], labels: 'all', source: 'Investor releases (Q1FY27 excludes the US$1.14 bn mega deal signed in July)' },
      { type: 'hbar', title: `IT peers trade ${Math.abs(Math.round(sectorDr))}% below their five-year median P/E (median)`, unit: 'Trailing P/E at 30-Sep-2026 vs own five-year median (%)', x: X.PEER_SYMS.map(X.shortName), series: [{ name: 'vs median', values: X.PEER_SYMS.map(s => Math.round(derate[s])), fmt: 'pct' }], labels: 'all', highlight: 'HCLTech', source: 'Screener.in P/E history; NSE closes 30-Sep-2026; GAM Research' },
    ] },
    { pair: [
      { type: 'line', title: `Forward P/E: ~${Math.round(price / F.eps[1])}x now vs a ${Math.round(FM.median)}x median since 2021`, unit: 'Price ÷ next full-year EPS (x)', x: fwdPe.map(x => x[0]), series: [{ name: 'Forward P/E', values: fwdPe.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 2, lines: [{ v: Math.round(FM.median), text: `Median since 2021: ${Math.round(FM.median)}x` }, { v: peMult, text: `Our target: ${peMult}x`, color: '#cf8f1f' }], source: 'Screener.in prices; actual EPS, GAM estimates for FY27-28E' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (Jun-Aug 2026)', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...RATED.map(s => s.broker.split(' (')[0].replace(' Institutional Equities', '')), 'GAM (base)'], series: [{ name: 'Target', values: [...RATED.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: `Brokers with a published rating; ${X.withTp.length - RATED.length} more targets without ratings are in the valuation section (median of all ${X.withTp.length}: ₹${n0(medTp)}). Broker notes, Business Today (14-Jul-2026), GAM Research` },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2b.aiQuestion, P2b.tailwind, P3.itbs, P3.ers, P3.sw, P3b.kpis, P3b.moat, p.financials, P4.guidance, p.capital, P4.quality, p.balance, P4.ownership(p.ownershipBase), P4.governance, P4b.forecasts, P5.street, P5.valuation, P5b.risks, p.statements, P5b.glossary],
  statementNotes: P5b.statementNotes,
};
