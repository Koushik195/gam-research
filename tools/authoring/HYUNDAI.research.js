// Hyundai Motor India report, part B: cover, the story in charts, and the merger of part2-6 (business, history,
// industry, tailwind test, competition, domestic, exports, moat, Q1FY27, earnings quality, ownership,
// governance, forecasts, street, valuation, verdict, glossary, statement notes). Shared inputs in
// HYUNDAI.ctx.js; forecast and valuation figures are live tokens ({{...}}) that follow assumptions.json.
const X = require('./HYUNDAI.ctx');
const { F, V, A, SA, SQ, QL, n0, n1, price, mv, PE12, MULT, sector12, rating, postQ1, medTp, epsSep, Q1 } = X;
const P2 = require('./HYUNDAI.part2'), P3 = require('./HYUNDAI.part3'), P4 = require('./HYUNDAI.part4'), P5 = require('./HYUNDAI.part5'), P6 = require('./HYUNDAI.part6');
const share = a => Math.round(a.domestic / a.industry * 1000) / 10;

const cover = {
  headline: 'A good car company at a fair price: the launches are coming, the premium is not',
  lead: `Hyundai Motor India is India's #4 car maker by domestic volume (${n1(share(X.A26))}% share in FY26, down from ${n1(share(X.A24))}% in FY24) and its largest exporter, 82.5% owned by Hyundai Motor Company, to which it pays a ~2.8% royalty. Volumes and margins are at a low: domestic sales fell two years running as M&M and Tata out-launched it, and a supplier fire and the West Asia conflict cut Q1FY27 EBITDA margin to 9.3% and profit by 35%. Two all-new SUVs (the Bayon mid-SUV and a localised EV), a third shift at Pune and an 8-10% volume guide point to recovery in H2. The street values the stock on **P/E on FY28E (24-30x, median 26x)**. We forecast EPS of ₹${n1(F.eps[0])} / ₹${n1(F.eps[1])} / ₹${n1(F.eps[2])} for FY27-29E, a little below the street. Applying the house rule (**${MULT.base}x Sep-28E EPS of ₹${n1(epsSep.base)}**) gives **{{dcf.tp|inr}} ({{dcf.upside|chg}})**: **we initiate with ${rating}.** Cross-checks: EV/EBITDA ₹${n0(mv('ev').value)}, DCF ₹${n0(mv('dcf').value)}. Bull case {{scen.bull.tp|inr}}; bear case {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'The recovery is real, but it starts from a low base', p: `Domestic sales rose 23% in July and 24% in August (Apr-Aug +12.6%); production lost in June has been made up; Bayon bookings opened on 23-Sep. We model {{F.volume.0|num}} vehicles in FY27E (+{{as.volume.growth.0|n1}}%: domestic +9%, exports flat), then +10% and +8%. FY27E EPS of ₹${n1(F.eps[0])} is still below FY26's ₹66.9 and FY24's ₹74.6.` },
    { h: 'Share loss is the core problem, and two launches only start to fix it', p: 'Hyundai went from #2 to #4 in FY26 (M&M 660k, Tata 631k, Hyundai 585k). One mid-SUV and one EV will help, but rivals launch several SUVs a year and Kia, its sister company, competes in the same segments. Management targets an exit share above ~12.3%, not a return to 14-15%.' },
    { h: 'Margins: 11-14% guided, 9.3% in Q1; we model {{F.ebitdaMargin.0|pct}} → {{F.ebitdaMargin.2|pct}}', p: 'Commodities (precious metals, copper), the Pune ramp-up, weak exports and launch costs weigh on FY27. Utilisation at Chennai Plant 1 (72% → ~90% in CY27) and lower discounts help FY28. A 2.8% royalty to the parent and rising depreciation (₹45,000 cr capex plan to FY30) cap returns.' },
    { h: 'Valuation: fair, not cheap', p: `At ₹${n0(price)} the stock trades at ${n1(price / F.eps[1])}x our FY28E EPS and ${n1(X.trailPe)}x trailing. Its forward P/E has a median of ${n1(PE12.med)}x over the last 12 months (we skip the first year after the Oct-2024 listing); auto peers sit ${Math.abs(sector12).toFixed(1)}% below their own medians for the same window. That gives ${MULT.base}x, close to the street's 24-30x. The street's higher targets (median ₹${n0(medTp)}) come mostly from higher FY28 earnings.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'GREEN' },
    { k: 'Governance (parent and related parties)', v: 'AMBER' },
    { k: 'Earnings momentum', v: 'AMBER' },
    { k: 'Competitive position', v: 'AMBER' },
    { k: 'Valuation', v: 'AMBER' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): how much of the June production loss and the margin shortfall came back; export run-rate.',
    'Bayon launch and pricing (festive 2026) and the localised compact EV (H2FY27): booking and dispatch run-rates, PLI eligibility.',
    'Festive retail (Oct-Nov 2026) against the GST-boosted base of Oct-Nov 2025; industry growth in H2 ("low single digits", management).',
    'West Asia shipping: whether exports recover to 50k+ a quarter (Middle East orders, Exter LHD, new Venue in 35 markets).',
    'Pune third shift (from Oct-2026), Pune Phase 2 (250k by CY28) and the FY28 capex plan; any change in royalty or dividend policy.',
  ],
};

// ---------------------------------------------------------------- Story in charts
const fy = ['FY22', 'FY23', 'FY24', 'FY25', 'FY26'], fy4 = ['FY23', 'FY24', 'FY25', 'FY26'];
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'stacked', title: 'Exports carried FY26 as domestic volumes fell', unit: 'Vehicles sold (\'000)', x: fy, series: [{ name: 'Domestic', values: fy.map(l => Math.round(X.yr(l).domestic / 1000)), fmt: 'num' }, { name: 'Exports', values: fy.map(l => Math.round(X.yr(l).exports / 1000)), fmt: 'num' }], minLabel: 60, source: 'AR FY26; investor presentations' },
      { type: 'line', title: `Domestic market share: ${n1(share(X.yr('FY23')))}% in FY23, ${n1(share(X.A26))}% in FY26`, unit: 'Hyundai domestic ÷ industry PV wholesales (%)', x: fy4, series: [{ name: 'Market share', values: fy4.map(l => share(X.yr(l))), fmt: 'pct' }], labels: 'all', min: 10, max: 16, source: 'Company; SIAM' },
    ] },
    { pair: [
      { type: 'line', title: 'Quarterly EBITDA margin: from 14% to 9.3%', unit: 'EBITDA margin (%)', x: QL, series: [{ name: 'EBITDA margin', values: SQ.map(q => q.marginPct), fmt: 'pct' }], labels: 'all', min: 6, max: 16, lines: [{ v: 11, text: 'Bottom of the 11-14% guide', color: '#b4232a' }], source: 'Screener.in; investor presentations' },
      { type: 'column', title: 'Volumes: 7.75 lakh in FY26, ~9.8 lakh by FY29E', unit: 'Vehicles sold (domestic + exports)', x: 'fin.labels', from: 'FY22', to: 'FY29E', series: [{ name: 'Volume', ref: 'kpi.units', fmt: 'num' }], labels: 'all', source: 'Company; GAM estimates FY27-29E' },
    ] },
    { pair: [
      { type: 'column', title: `EPS: ₹74.6 in FY24, ₹${n1(F.eps[0])} in FY27E, ₹${Math.round(F.eps[2])} by FY29E`, unit: 'EPS (₹)', x: 'fin.labels', from: 'FY21', to: 'FY29E', series: [{ name: 'EPS', ref: 'fin.eps', fmt: 'n1' }], labels: 'all', source: 'Company, Screener.in; GAM estimates FY27-29E' },
      { type: 'column', title: 'Capex doubles: Pune, EVs and 26 launches', unit: 'Capex (₹ crore)', x: 'fin.labels', from: 'FY21', to: 'FY29E', series: [{ name: 'Capex', ref: 'fin.capex', fmt: 'num' }], labels: 'all', source: 'Screener.in; company guidance (FY27 ~₹7,500 cr); GAM estimates' },
    ] },
    { pair: [
      { type: 'line', title: `Forward P/E: ${n1(X.fwdNow)}x now vs ${n1(PE12.med)}x 12-month median`, unit: 'Price ÷ next full-year EPS (x)', x: X.fwdPe.map(x => x[0]), series: [{ name: 'Forward P/E', values: X.fwdPe.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: MULT.base, text: `Our multiple: ${MULT.base}x`, color: '#cf8f1f' }], source: 'Screener.in prices; actual EPS, GAM estimates for FY27-28E' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (notes standing on 30-Sep-2026)', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...postQ1.map(s => s.broker), 'GAM (base)'], series: [{ name: 'Target', values: [...postQ1.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: `Broker notes, 30-Jul to 3-Sep-2026 (median ₹${n0(medTp)}), GAM Research` },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P2.competition, P3.domestic, P3.exports, P3.moat, p.financials, P4.guidance, p.capital, P4.quality, p.balance, P4.ownership(p.ownershipBase), P4.governance, P4.forecasts, P5.street, P5.valuation, P6.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
