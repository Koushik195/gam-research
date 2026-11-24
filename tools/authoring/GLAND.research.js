// Gland Pharma report, part B: cover, story in charts, and the merger of part2-6 (business, history, industry, tailwind
// test, base business and markets, Cenexi, CDMO and pipeline, capacity and USFDA, moat, margins, earnings quality, capital,
// ownership, governance, forecasts, street, valuation, verdict, glossary, statement notes). Shared inputs in GLAND.ctx.js.
// Forecast and valuation figures are live tokens ({{...}}) that follow assumptions.json.
const X = require('./GLAND.ctx');
const { F, V, A, AS, C, SQ, SA, n0, n1, pc1, price, mv, epsSep28, peMult, rating, FMA, FM21, KW, K5, FW, LINES, LEB, HB, fwdPe, postQ1, medTp, SET, shortName, buyBelow, fwdNow, peFY27, Q1, ytd, r1, ACQ_TXT } = X;
const P2 = require('./GLAND.part2'), P3 = require('./GLAND.part3'), P4 = require('./GLAND.part4'), P5 = require('./GLAND.part5'), P6 = require('./GLAND.part6');

const cover = {
  headline: 'A very profitable injectables core finally showing through, priced about where its post-Cenexi history says it should be',
  lead: `Gland Pharma makes generic and complex injectables for partners (US generic companies, big pharma, tender agencies) from four Indian sites, and since April 2023 owns Cenexi, a French-Belgian contract manufacturer. Of FY26 revenue of ₹6,431 cr, 71% was the base business (36.5% EBITDA margin) and 29% Cenexi (a small loss); 53% went to the US. Growth has returned: Q1FY27 revenue +20% (~15% in constant currency), EBITDA margin 27.2%, Cenexi in profit, and a 55-SKU contract-manufacturing deal from 2029. The stock rose ~${Math.round(ytd)}% in 2026 to ₹${n0(price)} on 30-Sep-2026, even as Fosun sold 6% on 4-Sep. Brokers that disclose a method all use **P/E** (Motilal Oswal 30x 12-month forward, ICICI Direct 33x FY28E, Nomura 27.5x FY28-29E). We forecast EPS of ₹${n1(F.eps[0])} / ₹${n1(F.eps[1])} / ₹${n1(F.eps[2])} for FY27-29E. Gland's own one-year-forward P/E median since the Cenexi deal closed (${n1(FMA.median)}x), times the pharma peers' move over the same window (×${KW.toFixed(3)}), gives **${peMult}x Sep-28E EPS of ₹${n1(epsSep28)} = {{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}**. Cross-checks: EV/EBITDA ₹${n0(mv('ev').value)}, DCF ₹${n0(mv('dcf').value)}. Bull case {{scen.bull.tp|inr}}; bear case {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'The core is excellent', p: "The base business earned a 36.5% EBITDA margin in FY26 and 40% in Q4FY26, on 1.7 bn units of sterile capacity, 342 approved ANDAs and a regulatory record without a warning letter or import alert. Its cost position wins US GPO contracts and big-pharma transfers from European plants that cost 5-6x more to run. Few Indian companies can match it in injectables." },
    { h: 'Cenexi has been the drag, and is only now turning', p: `Cenexi cost ~€230 mn (enterprise value), needs a ~€60 mn capex plan (2025-27) and lost money for three years (EBITDA −€19 mn in FY25). It made €2 mn in Q1FY27. We model a ${AS.businessLines.ebitdaMargin.cenexi[0]}% / ${AS.businessLines.ebitdaMargin.cenexi[1]}% / ${AS.businessLines.ebitdaMargin.cenexi[2]}% margin for FY27-29E, below management's mid-teens goal, because every Cenexi target so far has slipped.` },
    { h: 'Growth is back, but the big drivers are back-ended', p: `We forecast revenue +${n1(AS.revenueGrowth[0])}% / +${n1(AS.revenueGrowth[1])}% / +${n1(AS.revenueGrowth[2])}%, a little below management's new ~20% four-year ambition. The 55-SKU deal starts in CY2029, GLP-1 US volumes in FY30-31 and the large complex injectables after FY29. Medium-term guidance moved from 'low-20s' (May-2025) to 15% (May-2026) to ~20% (Aug-2026).` },
    { h: 'The price already reflects the recovery', p: `At ₹${n0(price)} the stock trades at ${n1(peFY27)}x our FY27E and ${n1(fwdNow)}x FY28E EPS. Our ${peMult}x is the post-acquisition median lifted ${r1(FW.pe)}% for a sector that trades above its history; the since-2021 median (${n1(FM21.median)}x, ×${K5}) would justify ~₹${n0(Math.round(X.half(FM21.median * K5) * epsSep28 / 10) * 10)}, but it mixes standalone-Gland prices and the 2021 bubble. Below ~₹${n0(buyBelow)} the rule would make us buyers.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'AMBER' },
    { k: 'Earnings momentum', v: 'GREEN' },
    { k: 'Competitive position', v: 'GREEN' },
    { k: 'Governance', v: 'AMBER' },
    { k: 'Valuation', v: 'AMBER' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): the Cenexi summer quarter, base-business margin after the Q1 currency help, and the updated four-year growth outlook management promised for "next quarter".',
    'USFDA approval of the new ready-to-use bag line (management hoped for August-September 2026) and the ophthalmic/BFS lines; the Saudi NUPCO tender awards.',
    'Deepak Sapra (ex-Dr. Reddy\'s) joins as CEO from 16-Nov-2026, filling a gap since April 2026.',
    'Fosun: two 6% sales in two years and no disclosed lock-up; a further sale would add supply, though the last block was absorbed by domestic funds.',
    'GLP-1 partner launches outside the US (e.g., a Canada filing that could launch in Q4FY27) and new CDMO contracts.',
  ],
};

// ---------------------------------------------------------------- Story in charts
const FYH = ['FY24', 'FY25', 'FY26'], XH = [...FYH, ...F.years];
const tpRows = postQ1.slice().sort((a, c) => c.tp - a.tp);
const g26 = SA.find(a => a.fy === 'FY26').geo;
const cdmoPct = [...SA.map(a => Math.round(a.model.techTransfer / a.revenue * 1000) / 10), Math.round(Q1.cdmo / Q1.revenue * 1000) / 10];
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'stacked', title: 'Revenue: the base business does most of the growing', unit: 'Revenue by business (₹ crore)', x: XH, series: [{ name: 'Base business', values: [...HB.map(h => Math.round(h.base)), ...LINES.base.map(Math.round)], fmt: 'num' }, { name: 'Cenexi', values: [...HB.map(h => Math.round(h.cenexi)), ...LINES.cenexi.map(Math.round)], fmt: 'num' }], minLabel: 1200, source: 'Investor presentations (base business vs Cenexi); GAM estimates FY27-29E' },
      { type: 'column', title: 'EBITDA: Cenexi moves from a loss to a small profit', unit: 'EBITDA (₹ crore)', x: XH, series: [{ name: 'Base business', values: [...HB.map(h => Math.round(h.baseEb)), ...LEB.base.map(Math.round)], fmt: 'num' }, { name: 'Cenexi', values: [...HB.map(h => Math.round(h.cenexiEb)), ...LEB.cenexi.map(Math.round)], fmt: 'num' }], labels: 'all', source: 'Investor presentations (company EBITDA after ESOP cost); GAM estimates FY27-29E' },
    ] },
    { pair: [
      { type: 'column', title: 'Cenexi quarterly EBITDA: losses through FY25, small profits since', unit: 'Cenexi EBITDA (₹ crore)', x: SQ.map(q => q.q), series: [{ name: 'Cenexi EBITDA', values: SQ.map(q => Math.round(q.cenexiEbitda / 10)), fmt: 'num' }], labels: 'all', source: 'Investor presentations; Q1FY27 = €2 mn at ~₹106/€ (GAM)' },
      { type: 'hbar', title: 'The US is 53% of revenue; Europe (mostly Cenexi) 22%', unit: 'FY26 revenue by market (₹ crore)', x: ['United States', 'Europe', 'Rest of world', 'India', 'Canada', 'Australia & NZ'], series: [{ name: 'Revenue', values: [g26.USA, g26.Europe, g26['Rest of World'], g26.India, g26.Canada, g26.Australia + g26['New Zealand']].map(v => Math.round(v / 10)), fmt: 'num' }], labels: 'all', source: 'AR FY26 MD&A (revenue by market)' },
    ] },
    { pair: [
      { type: 'column', title: 'Contract manufacturing (CDMO) is now half of revenue', unit: 'CDMO / tech transfer incl. Cenexi, % of revenue', x: [...FYH, 'Q1FY27'], series: [{ name: 'CDMO share', values: cdmoPct, fmt: 'pct' }], labels: 'all', min: 0, max: 60, source: 'AR FY26 MD&A (business model); Q1FY27 presentation' },
      { type: 'line', title: `Forward P/E: ${n1(FM21.median)}x median since 2021, ${n1(FMA.median)}x since the Cenexi deal, ${n1(fwdNow)}x now`, unit: 'Price ÷ next full-year EPS (x)', x: fwdPe.map(x => x[0]), series: [{ name: 'Forward P/E', values: fwdPe.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: peMult, text: `Target: ${peMult}x (median since ${ACQ_TXT} ${n1(FMA.median)}x × ${KW.toFixed(3)})`, color: '#cf8f1f' }], source: 'Screener.in prices; reported EPS; GAM estimates FY27-28E' },
    ] },
    { pair: [
      { type: 'hbar', title: 'Our target sits at the middle of the post-results street', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...tpRows.map(s => `${s.broker} (${s.rating})`), 'GAM (base)'], series: [{ name: 'Target', values: [...tpRows.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes and press roundups of 10-11 Aug 2026 as cited in deep.json; GAM Research' },
      { type: 'hbar', title: `Pharma trades above its post-2023 P/E: median ${pc1(FW.pe)}`, unit: `Trailing P/E at 30-Sep-2026 vs median since ${ACQ_TXT} (%)`, x: [...SET.map(shortName), 'Gland'], series: [{ name: 'vs median', values: [...SET.map(s => r1(FW.dr[s])), r1(FW.dr.GLAND)], fmt: 'pct' }], labels: 'all', highlight: 'Gland', source: 'Screener.in P/E history; NSE closes on 30-Sep-2026; PLAYBOOK §7c peer set' },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.base, P3.cenexi, P3.cdmo, P3.capacity, P4.moat, p.seasons, p.financials, P4.margins, P4.quality, p.balance, P4.capital, P4.ownership(p.ownershipBase), P4.governance, P5.forecasts, P5.street, P5.valuation, P6.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
