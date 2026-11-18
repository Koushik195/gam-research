// Pidilite report, part B: cover, story in charts, and the merger of part2-4 (business, history,
// industry, tailwind test, segments, moat, Q1FY27, earnings quality, ownership, governance, forecasts,
// street, valuation, verdict, glossary, statement notes). Shared inputs in PIDILITIND.ctx.js.
// Forecast and valuation figures are live tokens ({{...}}) that follow assumptions.json. As of 30-Sep-2026.
const X = require('./PIDILITIND.ctx');
const { F, V, A, n0, n1, pc, SRC, SA, SQ, QL, A26, segM, Q1, price, mv, epsSep28, peMult, H21, fwdPe, rating, mosl, pl, postQ1, ST, CONS, b } = X;
const P2 = require('./PIDILITIND.part2'), P3 = require('./PIDILITIND.part3'), P4 = require('./PIDILITIND.part4');

const cover = {
  headline: 'India\'s best consumer franchise, priced for it: FY27 growth is half price, and the multiple already assumes decades of compounding',
  lead: `Pidilite owns Fevicol, Dr. Fixit, M-Seal and Fevikwik, sells through ~5,700 distributors and lakhs of small dealers, and earns a 31% ROCE with net cash. Volumes are strong: underlying volume growth (UVG) was 11.1% in FY26 and 11.3% in Q1FY27, even after price rises of up to 12-15% to cover a spike in vinyl acetate monomer (VAM) during the West Asia conflict. But Q1FY27's 21% revenue growth was about half price, VAM has since halved from its peak, management expects to pass some price back, and FY26's 24% EBITDA margin was already the top of its own 20-24% corridor. The street values Pidilite on **P/E (50x FY28E or Jun-28E EPS)**. We forecast EPS of ₹${n1(F.eps[0])} in FY27E and ₹${n1(F.eps[1])} in FY28E, close to the street for FY27 and ~5% below for FY28. Applying **${peMult}x to Sep-28E EPS of ₹${n1(epsSep28)}** gives **{{dcf.tp|inr}} ({{dcf.upside|chg}})**: **we initiate with ${rating}.** Cross-checks: EV/EBITDA ₹${n0(mv('ev').value)}, DCF ₹${n0(mv('dcf').value)}. Bull case {{scen.bull.tp|inr}}; bear case {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'A genuine moat in the core', p: `Fevicol is "synonymous with adhesives" (CRISIL); competitors copy Pidilite's price moves "almost to a T" (MD). C&B UVG was 12.2% in Q1FY27 on top of the price rises. Consolidated C&B segment EBITDA margin was ${n1(segM(A26, 'cb'))}% in FY26 and ROE ${n1(A.roe[b])}%, with capex of only 3-5% of revenue.` },
    { h: 'FY27 growth is flattered by price', p: `Q1FY27 standalone revenue +22.2% = UVG 11.3% plus ~10% price and mix. VAM was consumed at US$${n0(Q1.vamUsdT)}/t in Q1 (US$${n0(Q1.vamUsdTPy)} a year earlier) and fell ~50% from its peak by August; management talks of rebates. We forecast revenue +{{F.salesGrowth.0|pct}} in FY27E, then +{{F.salesGrowth.1|pct}} as price laps.` },
    { h: 'Margins are at the top of the range', p: `EBITDA margin was 17% in FY23 when inputs spiked and ${n1(A.ebitdaMargin[b])}% in FY26 on cheap ones; Q1FY27 26.3% included low-cost inventory that "will unravel in the second quarter" (CFO). We model {{F.ebitdaMargin.0|pct}} / {{F.ebitdaMargin.1|pct}} / {{F.ebitdaMargin.2|pct}}: no further expansion.` },
    { h: 'Valuation: fair, not cheap', p: `At ₹${n0(price)} the stock trades at ${n1(price / F.eps[0])}x our FY27E and ${n1(price / F.eps[1])}x FY28E EPS. Its ${Math.round(H21.med)}x median forward P/E since 2021 has de-rated with consumer peers; our ${peMult}x gives {{dcf.tp|inr}}. A DCF at an 11.3% cost of equity gives only ₹${n0(mv('dcf').value)}: even 15 years of double-digit growth does not support today's price at that discount rate.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'GREEN' },
    { k: 'Predictability', v: 'GREEN' },
    { k: 'Earnings momentum', v: 'AMBER' },
    { k: 'Competitive position', v: 'GREEN' },
    { k: 'Valuation', v: 'RED' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): how much margin the high-cost VAM inventory takes in the quarter, and whether rebates start.',
    'VAM and crude prices: a lasting fall supports margins but brings price give-backs; a renewed spike hits margins again.',
    'UVG through FY27: management wants double digit and "about 100 bps" a year of improvement; watch for demand compression from industry-wide price rises.',
    'Competition in tile adhesives (cement and tile makers entering) and waterproofing; the export recovery in B2B.',
    'Use of ₹4,200 cr of net cash: pioneering categories, partnerships or acquisitions.',
  ],
};

// ---------------------------------------------------------------- Story in charts
const uvgQ = SQ.map(q => q.uvgPct ?? null);
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'stacked', title: 'Consumer & Bazaar is four-fifths of revenue', unit: "Consolidated net revenue by segment (₹ '000 crore)", x: SA.map(a => a.fy), series: [{ name: 'Consumer & Bazaar', values: SA.map(a => Math.round(a.cbRev / 100) / 10), fmt: 'n1' }, { name: 'Business to Business', values: SA.map(a => Math.round(a.b2bRev / 100) / 10), fmt: 'n1' }, { name: 'Others', values: SA.map(a => Math.round(a.othRev / 100) / 10), fmt: 'n1' }], minLabel: 1, source: 'Annual reports, consolidated segment notes (net of inter-segment sales)' },
      { type: 'column', title: 'Underlying volume growth: 8-10%, then 15% and 11%', unit: 'Standalone UVG, year on year (%)', x: QL, series: [{ name: 'UVG', values: uvgQ, fmt: 'pct' }], labels: 'all', source: 'Company presentations (Q1FY25: "double digit", exact figure not given)' },
    ] },
    { pair: [
      { type: 'column', title: 'Q1FY27: revenue +22%, of which volume +11%', unit: 'Standalone growth, year on year (%)', x: QL, series: [{ name: 'Revenue growth', values: SQ.map(q => q.saGrowthPct), fmt: 'pct' }, { name: 'UVG', values: uvgQ, fmt: 'pct' }], labels: 'none', source: 'Company presentations' },
      { type: 'column', title: 'VAM: from US$840/t to ~US$1,800 and back down', unit: 'VAM price (US$ per tonne)', x: ['Q1FY26 (consumed)', 'Q4FY26 (consumed)', 'May-26 (spot)', 'Q1FY27 (consumed)'], series: [{ name: 'VAM', values: [924, 840, 1800, 1370], fmt: 'num' }], labels: 'all', highlight: 'Q1FY27 (consumed)', source: 'Pidilite calls (8-May-2026, 5-Aug-2026); PL (Aug-2026): ~50% off the peak by August' },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: now at the top of the 20-24% corridor', unit: 'Consolidated EBITDA margin (%); dashed lines = management corridor of 20-24%', x: 'fin.labels', from: 'FY19', to: 'FY29E', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 10, max: 30, lines: [{ v: 20, text: '' }, { v: 24, text: '' }], source: 'Screener.in; GAM estimates FY27-29E' },
      { type: 'column', title: 'Segment margins: C&B 33%, B2B 20% in FY26', unit: 'Segment EBITDA margin (% of net revenue)', x: SA.map(a => a.fy), series: [{ name: 'Consumer & Bazaar', values: SA.map(a => Math.round(segM(a, 'cb') * 10) / 10), fmt: 'pct' }, { name: 'Business to Business', values: SA.map(a => Math.round(segM(a, 'b2b') * 10) / 10), fmt: 'pct' }], labels: 'none', source: 'Annual reports: segment result + allocable depreciation, consolidated' },
    ] },
    { pair: [
      { type: 'line', title: `Forward P/E: from ${Math.round(H21.max)}x in 2021 to ~${Math.round(price / F.eps[1])}x`, unit: 'Price ÷ next full-year EPS (x)', x: fwdPe.map(x => x[0]), series: [{ name: 'Forward P/E', values: fwdPe.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 2, lines: [{ v: Math.round(H21.med), text: `Median since 2021: ${Math.round(H21.med)}x` }], source: 'Screener.in prices (bonus-adjusted); actual EPS, GAM estimates for FY27-28E' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (latest notes, Jul-Sep 2026)', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...ST.filter(s => s.date >= '2026-07').map(s => s.broker), 'GAM (base)'], series: [{ name: 'Target', values: [...ST.filter(s => s.date >= '2026-07').map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes and aggregators (Jul-Sep 2026), GAM Research' },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P2.cb, P2.b2b, P3.moat, p.financials, P3.guidance, p.capital, P3.quality, p.balance, P3.ownership(p.ownershipBase), P3.governance, P3.forecasts, P4.street, P4.valuation, P4.risks, p.statements, P4.glossary],
  statementNotes: P4.statementNotes,
};
