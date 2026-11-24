// Minda Corporation report, part B: cover, the story in charts, and the merger of part2-6 (business, history, industry,
// tailwind test, verticals, Flash and the JVs, moat, Q1FY27, earnings quality, ownership, governance, forecasts, street,
// valuation, verdict, glossary, statement notes). Shared inputs in MINDACORP.ctx.js; forecast and valuation figures are
// live tokens ({{...}}) that follow assumptions.json. As of 30-Sep-2026.
const X = require('./MINDACORP.ctx');
const { F, V, A, SQ, QL, BL, n0, n1, pc, price, mv, FM, adjMed, sectorDr, MULT, epsSep, rating, postQ1, medTp, C, organic27 } = X;
const P2 = require('./MINDACORP.part2'), P3 = require('./MINDACORP.part3'), P4 = require('./MINDACORP.part4'), P5 = require('./MINDACORP.part5'), P6 = require('./MINDACORP.part6');
const Q = C.q1fy27, FL = C.flash;
const shortDate = d => { const [y, m, dd] = d.split('-'); return `${+dd}-${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+m - 1]}-${y.slice(2)}`; };

const cover = {
  headline: 'Good growth, a costly EV bet and a full price: the multiple, not the business, sets the call',
  lead: `Minda Corporation (Spark Minda) makes wiring harnesses, instrument clusters, vehicle-access systems and die castings, mainly for two-wheelers and trucks, and owns 49% of Flash Electronics (EV and two-wheeler power electronics). Revenue grew 21% a year over FY21-26 and the EBITDA margin rose to 11.7%; Q1FY27 revenue rose 33% (~${Math.round(Q.salesExVast / 1386 * 100 - 100)}% organic, the rest from consolidating Minda Vast). We forecast EPS of ₹${n1(F.eps[0])} / ₹${n1(F.eps[1])} / ₹${n1(F.eps[2])} for FY27-29E on the fully diluted share count (promoter warrants at ₹550 treated as converted), 6-8% below the street (3-5% before the dilution). The street values Minda Corp on **P/E on one-year-forward EPS** (32-34x FY28E/Jun-28E). The house rule (its own forward P/E median since 2021 on EPS before one-offs, ${n1(adjMed)}x, cut by the ${Math.abs(sectorDr).toFixed(1)}% auto-component de-rating) gives **${MULT.base}x Sep-28E EPS of ₹${n1(epsSep.base)} = {{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}.** Cross-checks: EV/EBITDA ₹${n0(mv('ev').value)}, DCF ₹${n0(mv('dcf').value)}. Bull case {{scen.bull.tp|inr}}; bear case {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'The core business is growing well', p: `Wiring harnesses (31% of FY26 revenue) and instrument clusters (17%) grew 30-35% in Q1FY27 on premiumisation (TFT clusters, high-voltage harnesses) and share gains in two-wheelers and trucks; the Information & Connected Systems vertical grew 29% in FY26. Lifetime orders of ₹10,000 cr in FY26 and ₹2,500 cr in Q1FY27. We model revenue +{{F.salesGrowth.0|pct0}} / +{{F.salesGrowth.1|pct0}} / +{{F.salesGrowth.2|pct0}} (FY27E includes ~₹560 cr from Minda Vast).` },
    { h: 'Flash is the EV story, and it is expensive', p: `Minda paid ₹1,372 cr for 49% of Flash (Jan-2025). Flash grew 17% in FY26 to ₹1,803 cr at a 17.2% EBITDA margin and 42% in Q1FY27, but its profit reaches Minda only as a share of profit (₹70 cr in FY26, ~5% on the price paid) and its Q1 margin fell to 15.4%. We expect ₹${n0(BL.associates[0])} / ${n0(BL.associates[1])} / ${n0(BL.associates[2])} cr of associate profit, ${Math.round(X.assocShareOfPat[1])}% of FY28E profit.` },
    { h: 'Margins are rising, but they are tier-1 margins', p: 'EBITDA margin rose from 9.3% (FY21) to 11.7% (FY26); Q1FY27 was 11.5% with Minda Vast (8.4%) diluting. Management guides 11.5-12% for FY27 and 12.5% by FY30. Commodity costs are passed through with a 1-2 quarter lag and no mark-up, so there is no pricing power to push margins much higher. ROE is 14-16% in our forecasts.' },
    { h: 'Valuation: full', p: `At ₹${n0(price)} the stock trades at ${n1(price / F.eps[1])}x our FY28E and ${n1(price / epsSep.base)}x Sep-28E EPS, against its own forward median of ${n1(adjMed)}x since 2021; auto-component stocks sat ${Math.abs(sectorDr).toFixed(1)}% below their five-year medians on 30-Sep-2026. The street's 32-34x on undiluted EPS ~5% above ours is what gets it to ₹815-867. We like the direction of the business; the price already pays for it.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'AMBER' },
    { k: 'Earnings momentum', v: 'GREEN' },
    { k: 'Competitive position', v: 'AMBER' },
    { k: 'Valuation', v: 'RED' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): the first quarter against the GST-boosted base from Q3, Minda Vast margin, Flash margin recovery from 15.4%.',
    'Conversion of the promoter\'s 76.5 lakh warrants (₹316 cr balance due within 18 months of the Jun-2025 allotment, i.e. by Dec-2026): 3.2% dilution, debt reduction.',
    'Start of production: sunroofs (HCMF JV, Q2FY27), Turntide motor controllers (guided Oct-Nov 2026), Toyodenso switches (Q4FY27).',
    'Festive-season production (Oct-Dec 2026) in two-wheelers and trucks, Minda Corp\'s two largest end markets.',
    'New orders and Vision 2030 progress: exports (₹420 cr in FY25, target ₹1,500 cr by FY30), PV share (19% in Q1FY27, target 25%).',
  ],
};

// ---------------------------------------------------------------- Story in charts
const yoyQ = X.M.quarterly.sales.map((s, i, a) => (i >= 4 ? Math.round((s / a[i - 4] - 1) * 1000) / 10 : null)).slice(-8);
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: `Revenue: ₹6,185 cr in FY26; ₹${n0(F.sales[2])} cr by FY29E`, unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY19', to: 'FY29E', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'all', source: 'Screener.in; GAM estimates FY27-29E (FY27E includes Minda Vast)' },
      { type: 'column', title: 'Growth accelerated from 8% to 33% in two years', unit: 'Revenue growth year on year (%), as reported', x: X.M.quarterly.labels.slice(-8), series: [{ name: 'Revenue growth', values: yoyQ, fmt: 'pct' }], labels: 'all', source: 'Quarterly results as reported (Q1FY27 includes ~₹125 cr from Minda Vast)' },
    ] },
    { pair: [
      { type: 'stacked', title: 'Two verticals: connected systems now 53% of revenue', unit: 'Revenue by vertical (₹ crore)', x: QL, series: [{ name: 'Mechatronics, aftermarket & others', values: SQ.map(q => q.mechatronics), fmt: 'num' }, { name: 'Information & connected systems', values: SQ.map(q => q.ics), fmt: 'num' }], minLabel: 400, source: 'Company presentations (Q2FY25 and Q2FY26 derived from annual totals)' },
      { type: 'column', title: 'Flash Electronics: revenue +17% in FY26, +42% in Q1FY27', unit: 'Flash revenue (₹ crore, 100%)', x: ['FY25', 'FY26', 'Q1FY26', 'Q1FY27'], series: [{ name: 'Revenue', values: [1537, FL.fy26.revenue, 376, FL.q1fy27.revenue], fmt: 'num' }], labels: 'all', source: 'Q4FY26 presentation p10; Q1FY27 presentation p8. Minda Corp owns 49% (equity-accounted).' },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: 9.3% in FY21 to 11.7% in FY26', unit: 'EBITDA margin (%)', x: 'fin.labels', from: 'FY16', to: 'FY29E', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 6, max: 14, source: 'Screener.in; GAM estimates FY27-29E' },
      { type: 'column', title: 'Associates (mostly Flash) become a fifth of profit', unit: 'Share of associate/JV profit, post-tax (₹ crore; FY27-29E GAM)', x: ['FY23', 'FY24', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], series: [{ name: 'Share of associates and JVs', values: [-10, 2, 16, 81, ...BL.associates], fmt: 'num' }], labels: 'all', source: 'Company presentations (FY23-26); GAM estimates' },
    ] },
    { pair: [
      { type: 'line', title: `Forward P/E: ${n1(price / epsSep.base)}x Sep-28E now vs a ${n1(adjMed)}x median since 2021`, unit: 'Price ÷ next full-year EPS before one-offs (x)', x: X.adjSeries.map(x => x[0]), series: [{ name: 'Forward P/E', values: X.adjSeries.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: MULT.base, text: `Our multiple: ${MULT.base}x`, color: '#cf8f1f' }], source: 'Screener.in prices and EPS (FY22-23 on normalised profit); GAM estimates for FY27-28E' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...X.ST.map(s => s.broker), 'GAM (base)'], series: [{ name: 'Target', values: [...X.ST.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: `Broker notes, 23-May to 16-Aug-2026; post-Q1 median ₹${n0(medTp)}; GAM Research` },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.verticals, P3.flash, P3.newjv, P3.moat, p.financials, P4.guidance, p.capital, P4.quality, p.balance, P4.ownership(p.ownershipBase), P4.governance, P4.forecasts, P5.street, P5.valuation, P6.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
