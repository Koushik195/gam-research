// Exide report, part B: cover, the story in charts, and the merger of part2-6 (business, history, industry, tailwind test,
// lead-acid core, lithium-ion (EESL), HDFC Life and other investments, moat, Q1FY27, earnings quality, ownership,
// governance, forecasts, street, valuation, verdict, glossary, statement notes). Shared inputs in EXIDEIND.ctx.js;
// forecast and valuation figures are live tokens ({{...}}) that follow assumptions.json. As of 30-Sep-2026.
const X = require('./EXIDEIND.ctx');
const { F, V, A, SQ, QL, n0, n1, pc, price, mv, MULT, epsSep, rating, postQ1, medTp, coreMed, sectorDr, parts, shares, hdfcDivPS, eesl, C } = X;
const P2 = require('./EXIDEIND.part2'), P3 = require('./EXIDEIND.part3'), P4 = require('./EXIDEIND.part4'), P5 = require('./EXIDEIND.part5'), P6 = require('./EXIDEIND.part6');
const ps = v => n0(v / shares);
const B = parts.base;

const cover = {
  headline: 'A sound battery franchise carrying a costly lithium bet: fairly priced at ₹412',
  lead: `Exide is India's largest lead-acid battery maker (car and two-wheeler batteries for vehicle makers and the replacement market, inverter, solar and industrial batteries), one half of a duopoly with Amara Raja. Q1FY27 was strong: standalone revenue +17.6%, EBITDA margin 12.4%, profit +27%. Around this core sit an 8.70 cr-share stake in HDFC Life and a ₹4,902 cr lithium-ion cell plant (EESL) that is only now shipping samples. The street values Exide **in parts**, and so do we: the core at **${MULT.base}x Sep-28E EPS of ₹${n1(epsSep.base - hdfcDivPS)} (₹${ps(B.core)})** + HDFC Life at market less 20% (₹${ps(B.hdfc)}) + EESL at book less the present value of losses to breakeven (₹${ps(B.eesl)}) + other investments (₹${ps(B.other)}) = **{{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}.** Cross-checks: P/E on all standalone EPS ₹${n0(mv('pe').value)}, DCF ₹${n0(mv('dcf').value)}. Bull {{scen.bull.tp|inr}}; bear {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'The core is doing well, and the cycle helps', p: `Auto-OEM sales grew ~25% for three quarters after the September-2025 GST cut, and those batteries come back as replacement demand in 2.5-3 years. Q1FY27 volumes rose double digits in most lines (4W replacement +10%, 4W OEM +21%, 2W OEM +20%) and prices +4-6%. We model revenue +{{F.salesGrowth.0|pct0}} / +{{F.salesGrowth.1|pct0}} / +{{F.salesGrowth.2|pct0}} and EBITDA margin {{F.ebitdaMargin.0|pct}} → {{F.ebitdaMargin.2|pct}}.` },
    { h: 'But margins are a decade lower and lithium is eating the edges', p: 'The margin was 13-15% in FY16-21 and 10.8-11.7% since; lead is bought at import parity, so a weak rupee hurts, and sulphur and plastics rose sharply in FY26. Telecom and e-rickshaw batteries are moving to lithium (exports and telecom shrank to ~5% and ~3% of revenue in FY26). This is a duopoly with steady volumes, not a business with pricing power.' },
    { h: 'The lithium plant is the swing factor, and it is still a cost', p: `EESL has ₹${n0(C.investments.eeslCost['Jul-26'])} cr of Exide's equity, lost ₹248 cr in FY26 and needs ₹1,400 cr more in FY27. It has Chinese technology (SVOLT), imported materials, no PLI subsidy and 25-30% utilisation guided for year one. We value it at book less ₹${n0(eesl.base.pv)} cr of losses still to come (₹${ps(B.eesl)} a share), below the street's ₹70-82 at book or invested capital.` },
    { h: 'Valuation: the price already pays for the parts', p: `At ₹${n0(price)} the stock trades at ${n1(price / F.eps[1])}x our FY28E standalone EPS. Take out the investments (~₹${n0(X.invNow)} a share) and the core trades at ${n1(X.coreNowSep)}x Sep-28E EPS, against a ${n1(coreMed)}x median since the Exide Life sale; auto-component stocks sat ${Math.abs(sectorDr).toFixed(1)}% below their five-year medians on 30-Sep-2026. The post-Q1 street median target is ₹${n0(medTp)}; it assumes higher multiples (16-18x core) and the plant at full book.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg']],
  flags: [
    { k: 'Accounting', v: 'GREEN' },
    { k: 'Predictability', v: 'AMBER' },
    { k: 'Earnings momentum', v: 'GREEN' },
    { k: 'Competitive position', v: 'AMBER' },
    { k: 'Valuation', v: 'AMBER' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): the first quarter against a weak base (Q2FY26 revenue −2%), and whether price increases keep pace with rupee lead and sulphur costs.',
    'Formal start of commercial production at the Bengaluru cell plant and the first cell revenue (guided "during FY27"); customer approvals at the three 2W OEMs that hold ~80% of the EV market.',
    'EESL funding: the Board reviews the ₹1,400 cr FY27 plan; any Phase-2 (6 to 12 GWh) approval or a PLI application under the re-opened 10 GWh tranche.',
    'China\'s export rules on battery materials (approvals from November) and the end of its export VAT rebate on cells (from 1-Jan-2027), which raises the landed cost of imported cells.',
    'HDFC Life share price: each ₹50 moves our value by ~₹4 a share; any sale of the stake to fund lithium.',
  ],
};

// ---------------------------------------------------------------- Story in charts
const yoyQ = X.M.quarterly.sales.map((s, i, a) => (i >= 4 ? Math.round((s / a[i - 4] - 1) * 1000) / 10 : null)).slice(-8);
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: `Lead-acid revenue: ₹17,269 cr in FY26; ₹${n0(F.sales[2])} cr by FY29E`, unit: 'Revenue (₹ crore), standalone', x: 'fin.labels', from: 'FY19', to: 'FY29E', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'all', source: 'Screener.in (standalone); GAM estimates FY27-29E' },
      { type: 'column', title: 'Q1FY27: +17.6%, the fastest growth in three years', unit: 'Revenue growth year on year (%), standalone', x: X.M.quarterly.labels.slice(-8), series: [{ name: 'Revenue growth', values: yoyQ, fmt: 'pct' }], labels: 'all', source: 'Quarterly results (standalone)' },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: 13-15% before FY22, ~11-12% since', unit: 'EBITDA margin (%)', x: 'fin.labels', from: 'FY16', to: 'FY29E', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 8, max: 16, source: 'Screener.in (standalone); GAM estimates FY27-29E' },
      { type: 'column', title: 'Subsidiaries (mostly EESL) cost ₹45-95 cr of profit a quarter', unit: 'Consolidated less standalone net profit (₹ crore)', x: QL, series: [{ name: 'Subsidiary drag', values: SQ.map(q => q.groupDrag), fmt: 'num' }], labels: 'all', source: 'Screener.in consolidated and standalone quarterly results' },
    ] },
    { pair: [
      { type: 'hbar', title: `Sum of the parts: ₹${n0(V.tp)} a share, three-quarters from the core`, unit: '₹ per share (base case)', x: ['Lead-acid core', 'HDFC Life stake', 'EESL (lithium-ion)', 'Other investments', 'Target (rounded)', 'Share price'], series: [{ name: 'Value', values: [B.core, B.hdfc, B.eesl, B.other].map(v => Math.round(v / shares)).concat([V.tp, price]), fmt: 'inr' }], labels: 'all', highlight: 'Target (rounded)', source: 'GAM Research' },
      { type: 'column', title: 'EESL: ₹4,902 cr of equity in, no cell revenue yet', unit: 'Cumulative equity at cost (₹ crore)', x: ['Mar-23', 'Mar-24', 'Mar-25', 'Mar-26', 'Jul-26', 'Mar-27E'], series: [{ name: 'EESL equity', values: [715, 2302, 3302, 4802, 4902, 6202], fmt: 'num' }], labels: 'all', source: 'Annual reports (note 4); Q1FY27 call; Mar-27E = Board-approved ₹1,400 cr for FY27' },
    ] },
    { pair: [
      { type: 'line', title: `Core forward P/E (price less investments): median ${n1(coreMed)}x since Jan-2022`, unit: 'Core price ÷ next full-year EPS (x)', x: X.coreSeries.map(x => x[0]), series: [{ name: 'Core forward P/E', values: X.coreSeries.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: MULT.base, text: `Our multiple: ${MULT.base}x`, color: '#cf8f1f' }], source: 'Screener.in prices; standalone EPS before the FY22 sale gain; HDFC Life at market less 20%; EESL at book; GAM estimates FY27-28E' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (post-Q1)', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...postQ1.map(s => s.broker), 'GAM (base)'], series: [{ name: 'Target', values: [...postQ1.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: `Broker notes and aggregators, 3/4-Aug-2026; median ₹${n0(medTp)}; GAM Research` },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.core, P3.lithium, P3.investments, P3.moat, p.financials, P4.guidance, p.capital, P4.quality, p.balance, P4.ownership(p.ownershipBase), P4.governance, P4.forecasts, P5.street, P5.valuation, P6.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
