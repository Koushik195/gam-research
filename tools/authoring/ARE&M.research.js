// Amara Raja report, part B: cover, the story in charts, and the merger of part2-6 (business, history, industry, tailwind
// test, lead-acid core, lithium-ion (ARACT) and other subsidiaries, moat, Q1FY27, earnings quality, ownership, governance,
// forecasts, street, valuation, verdict, glossary, statement notes). Shared inputs in ARE&M.ctx.js; forecast and
// valuation figures are live tokens ({{...}}) that follow assumptions.json. As of 30-Sep-2026.
const X = require('./ARE&M.ctx');
const { F, V, SQ, QL, n0, n1, price, mv, MULT, epsSep, rating, postQ1, medTp, coreMed, sectorDr, parts, shares, aract } = X;
const P2 = require('./ARE&M.part2'), P3 = require('./ARE&M.part3'), P4 = require('./ARE&M.part4'), P5 = require('./ARE&M.part5'), P6 = require('./ARE&M.part6');
const ps = v => n0(v / shares);
const B = parts.base;

const cover = {
  headline: `India's number-two battery maker, priced for disappointment at ₹${n0(price)}`,
  lead: `Amara Raja (Amaron) is half of India's lead-acid battery duopoly with Exide: car and two-wheeler batteries for OEMs and the replacement market, home-energy and industrial batteries, and the leader in telecom. Q1FY27 revenue grew 20.6% but the EBITDA margin fell to 10.1%, and the stock then fell ~22% in seven weeks. Around the core sits ARACT, a lithium subsidiary with ₹1,900 cr of equity, a pack business, a BESS plant and a cell plant due in 2027. The street values Amara Raja **in parts**, and so do we: the core at **${MULT.base}x Sep-28E standalone EPS of ₹${n1(epsSep.base)} (₹${ps(B.core)})** + ARACT at book less the present value of losses to breakeven (₹${ps(B.aract)}) + other subsidiaries at book (₹${ps(B.other)}) = **{{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}.** Cross-checks: P/E on all standalone EPS ₹${n0(mv('pe').value)}, DCF ₹${n0(mv('dcf').value)}. Bull {{scen.bull.tp|inr}}; bear {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'Volumes are booming', p: `OEM volumes grew 24% (cars) and 35% (two-wheelers) in Q1FY27 after the GST cut, aftermarket ~15% and home energy 60%; those OEM batteries come back as replacement demand in 3-4 years. We model revenue +{{F.salesGrowth.0|pct0}} / +{{F.salesGrowth.1|pct0}} / +{{F.salesGrowth.2|pct0}} and EBITDA margin {{F.ebitdaMargin.0|pct}} → {{F.ebitdaMargin.2|pct}}.` },
    { h: 'But margins are the problem, and an honest one', p: 'The EBITDA margin was 16-18% a decade ago, 14.4% in FY24, 11.4% in FY26 and 10.1% in Q1FY27: alloys, acid and plastics, more traded goods, OEM mix and spending on brand and capacity. EPS before one-offs grew only ~2% a year in FY21-26. Management still aims for 13-14% but gives no date; we assume 12% by FY29E.' },
    { h: 'Lithium: a cheaper bet than Exide\'s, still a cost', p: `ARACT has ₹1,900 cr of equity (Exide has put ₹4,902 cr into its plant), ₹787 cr of pack revenue and a ₹73 cr loss. The cell plant has slipped to 2027, its Chinese partner fell away and 16 GWh is now an "ambition". We value ARACT at book less ₹${n0(aract.base.pv)} cr of losses still to come (₹${ps(aract.base.value)} a share), in line with MOFSL and ICICI Direct, below Nuvama and Anand Rathi.` },
    { h: 'Valuation: the price has done the work', p: `At ₹${n0(price)} the stock trades at ${n1(price / F.eps[1])}x our FY28E EPS. Net of the subsidiaries (~₹${n0(X.invNow)} a share), the core trades at ${n1(X.coreNowSep)}x Sep-28E EPS against a ${n1(coreMed)}x median since 2021; auto-component stocks sat ${Math.abs(sectorDr).toFixed(1)}% below their five-year medians on 30-Sep-2026, and our ${MULT.base}x includes that. The post-Q1 street median target is ₹${n0(medTp)}.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg']],
  flags: [
    { k: 'Accounting', v: 'GREEN' },
    { k: 'Predictability', v: 'AMBER' },
    { k: 'Earnings momentum', v: 'AMBER' },
    { k: 'Competitive position', v: 'AMBER' },
    { k: 'Valuation', v: 'GREEN' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): whether the June and August price increases lift the margin back above 10.5%, and how much trading falls.',
    'BESS plant start (guided for Q3FY27) and its first orders; ARACT\'s losses in the consolidated accounts.',
    'Equipment for the 2 GWh NMC line (due Q3FY27), cell samples to OEMs, and the re-opened 10 GWh PLI tender.',
    'Any decision on lithium funding beyond the ~₹2,500 cr of initial risk capital.',
    'Export recovery in the Middle East; lead, alloy, acid and plastic prices.',
  ],
};

// ---------------------------------------------------------------- Story in charts
const yoyQ = X.M.quarterly.sales.map((s, i, a) => (i >= 4 ? Math.round((s / a[i - 4] - 1) * 1000) / 10 : null)).slice(-8);
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: `Lead-acid revenue: ₹13,549 cr in FY26; ₹${n0(F.sales[2])} cr by FY29E`, unit: 'Revenue (₹ crore), standalone', x: 'fin.labels', from: 'FY19', to: 'FY29E', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'all', source: 'Screener.in (standalone); GAM estimates FY27-29E' },
      { type: 'column', title: 'Q1FY27: +20.6%, the fastest growth in years', unit: 'Revenue growth year on year (%), standalone', x: X.M.quarterly.labels.slice(-8), series: [{ name: 'Revenue growth', values: yoyQ, fmt: 'pct' }], labels: 'all', source: 'Quarterly results (standalone)' },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: 16-18% a decade ago, ~11% now', unit: 'EBITDA margin (%)', x: 'fin.labels', from: 'FY16', to: 'FY29E', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 8, max: 20, source: 'Screener.in (standalone); GAM estimates FY27-29E' },
      { type: 'column', title: 'Subsidiaries (mostly ARACT) now cost ₹10-30 cr of profit a quarter', unit: 'Consolidated less standalone net profit (₹ crore)', x: QL, series: [{ name: 'Subsidiary effect', values: SQ.map(q => q.groupDrag), fmt: 'num' }], labels: 'all', source: 'Screener.in consolidated and standalone quarterly results' },
    ] },
    { pair: [
      { type: 'hbar', title: `Sum of the parts: ₹${n0(V.tp)} a share, ~85% from the core`, unit: '₹ per share (base case)', x: ['Lead-acid core', 'ARACT (lithium-ion)', 'Other subsidiaries', 'Target (rounded)', 'Share price'], series: [{ name: 'Value', values: [B.core, B.aract, B.other].map(v => Math.round(v / shares)).concat([V.tp, price]), fmt: 'inr' }], labels: 'all', highlight: 'Target (rounded)', source: 'GAM Research' },
      { type: 'column', title: 'ARACT: ₹1,900 cr of equity in by Aug-2026', unit: 'Cumulative equity at cost (₹ crore)', x: ['Mar-23', 'Mar-24', 'Mar-25', 'Mar-26', 'Aug-26', 'Mar-27E'], series: [{ name: 'ARACT equity', values: [100, 400, 850, 1500, 1900, 1500 + X.BL.aract.infusion[0]], fmt: 'num' }], labels: 'all', source: 'Standalone note 5 (AR FY24, FY26); Q1FY27 deck; Mar-27E = GAM (to the ~₹2,500 cr of risk capital)' },
    ] },
    { pair: [
      { type: 'line', title: `Core forward P/E (price less subsidiaries): median ${n1(coreMed)}x since Apr-2021`, unit: 'Core price ÷ next full-year EPS before one-offs (x)', x: X.coreSeries.map(x => x[0]), series: [{ name: 'Core forward P/E', values: X.coreSeries.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: MULT.base, text: `Our multiple: ${MULT.base}x`, color: '#cf8f1f' }], source: 'Screener.in prices; standalone EPS before exceptional items; subsidiaries at book; GAM estimates FY27-29E' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (post-Q1)', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...postQ1.map(s => s.broker), 'GAM (base)'], series: [{ name: 'Target', values: [...postQ1.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: `Broker notes 11-13-Aug-2026; median ₹${n0(medTp)}; GAM Research` },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.core, P3.lithium, P3.moat, p.financials, P4.guidance, p.capital, P4.quality, p.balance, P4.ownership(p.ownershipBase), P4.governance, P4.forecasts, P5.street, P5.valuation, P6.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
