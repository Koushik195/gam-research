// Max Healthcare report, part B: cover, story in charts, and the merger of part2-6 (business, history, industry, tailwind
// test, beds/occupancy/ARPOB, payor & specialty mix, expansion, moat, Q1FY27, Network vs consolidated, ownership,
// governance, forecasts, street, valuation, verdict, glossary, statement notes). Shared inputs in MAXHEALTH.ctx.js.
// Forecast and valuation figures are live tokens ({{...}}) that follow assumptions.json. As of 30-Sep-2026.
const X = require('./MAXHEALTH.ctx');
const { F, V, A, NP, n0, n1, SQ, QL, Q1, AK, QK, b, price, mv, evMult, ebitdaSep28, HEV, fwdEv, evNow, rating, ST, sectorDrEv, epsCagrAdj, epsAdj26, pl, mosl, avgPost, impliedWacc, netEqEbitda } = X;
const P2 = require('./MAXHEALTH.part2'), P3 = require('./MAXHEALTH.part3'), P4 = require('./MAXHEALTH.part4'), P5 = require('./MAXHEALTH.part5'), P6 = require('./MAXHEALTH.part6');

const cover = {
  headline: 'The best hospital franchise in North India, already priced as one: 4,000 new beds have to prove they earn Max\'s returns',
  lead: `Max runs 17 hospitals and ~6,100 beds, three-quarters of them in Delhi NCR and Mumbai, and fills them better (75% occupancy) and bills more per bed-day (₹${n1(Q1.arpob / 1000)}k ARPOB) than any listed peer. It is now in its biggest build-out: ~4,000 beds by FY30 for ~₹7,000 cr, after ~1,300 acquired beds in FY25. Network revenue rose 16% in Q1FY27, but returns are falling (company pre-tax ROCE 33% in FY23, 21.8% in FY26) and profit lags EBITDA as depreciation and interest arrive first. The street values Max on **EV/EBITDA on FY28E (30-33x Network EBITDA)**. We forecast consolidated EBITDA of ₹${n0(F.ebitda[0])} / ${n0(F.ebitda[1])} / ${n0(F.ebitda[2])} cr and EPS of ₹${n1(F.eps[0])} / ${n1(F.eps[1])} / ${n1(F.eps[2])} for FY27-29E (in line with the street on EBITDA once put on the same basis; brokers' EPS includes partner hospitals Max does not own). Applying **${evMult}x to Sep-28E EBITDA of ₹${n0(ebitdaSep28)} cr** (consolidated, post-Ind AS, lease liabilities in net debt) gives **{{dcf.tp|inr}} ({{dcf.upside|chg}})**: **we initiate with ${rating}.** Cross-checks: P/E ₹${n0(mv('pe').value)}, DCF ₹${n0(mv('dcf').value)}. Bull case {{scen.bull.tp|inr}}; bear case {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'A location and efficiency moat', p: `2,548 operational beds in Delhi NCR at 79% occupancy; network occupancy ~75% for four years even while adding 13% more beds; Network EBITDA of ₹${n1(Q1.ebitdaPerBedLakh)} lakh per bed vs ₹47-58 lakh at Apollo, Fortis and Medanta (company comparison). Brownfield towers next to full hospitals fill fast: Max Smart's new beds were ~80% occupied within weeks.` },
    { h: 'Growth is coming, and it is mostly brownfield', p: `Capacity 6,183 beds (Aug-2026) → ~10,200 by FY30 (+601, +500, +927, +1,981 a year). We model revenue +{{F.salesGrowth.0|pct}}, +{{F.salesGrowth.1|pct}}, +{{F.salesGrowth.2|pct}} (FY27-29E) from a bed-by-bed build: average operational beds ${n0(X.NW.avgOpBeds[0])} → ${n0(X.NW.avgOpBeds[2])}, occupancy 73-74%, ARPOB +5-6% a year.` },
    { h: 'But returns and earnings lag the beds', p: `Capex plus new leases of ₹${n0(F.capex[0])}-${n0(F.capex[1])} cr a year exceeds operating cash in FY27-28E; net debt incl. leases rises to ~₹${n0(Math.round(-F.treasury[2] / 100) * 100)} cr by FY29E. EPS barely moves in FY27E (₹${n1(F.eps[0])} vs ₹${n1(A.eps[b])} reported, ₹${n1(epsAdj26)} before one-offs) and grows ~${Math.round(epsCagrAdj)}% a year to FY29E. Government payers are a drag: CGHS drug caps cut oncology from 26% to 22% of IP revenue, and the Supreme Court questioned hospital drug markups on 30-Sep-2026.` },
    { h: 'Valuation: fair, not cheap', p: `At ₹${n0(price)} Max trades at ${n1(evNow)}x our FY28E EV/EBITDA against a ${n1(HEV.med)}x forward median since Apr-2021; peers had de-rated ~${Math.abs(Math.round(sectorDrEv))}% by 30-Sep-2026, giving ${evMult}x and {{dcf.tp|inr}}. Our DCF (₹${n0(mv('dcf').value)}) is the warning: today's price needs a ~${n1(impliedWacc)}% discount rate, well below our 11.6% cost of equity.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'GREEN' },
    { k: 'Earnings momentum', v: 'AMBER' },
    { k: 'Competitive position', v: 'GREEN' },
    { k: 'Valuation', v: 'AMBER' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): ramp-up of the Max Smart, Nanavati-Max and Mohali towers (management: EBITDA to follow revenue "over the next couple of quarters"), the oncology base effect from Q3, the ~6% insurer price revision from Sep-Oct 2026 and whether DSO comes back from 95 days.',
    'Phased opening of the 500-bed Gurugram greenfield from end-CY2026 (starting with ~200 beds) and its start-up losses.',
    'The Supreme Court proceedings on hospital drug markups and any cap on trade margins; CGHS payments and rate revisions.',
    'Kalinga (Bhubaneswar) turnaround: occupancy 50% and ARPOB ₹35k today; management targets 50-80% higher on both within ~12 months.',
    'Acquisitions (management is comfortable at up to 2.5x net debt/EBITDA) and the medical-college plan (~₹300 cr per college).',
  ],
};

// ---------------------------------------------------------------- Story in charts
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: 'Capacity: 6,183 beds today, ~10,200 planned by FY30', unit: 'Capacity beds at year end (company plan); Aug-26 = current', x: ['Aug-26', 'FY27', 'FY28', 'FY29', 'FY30'], series: [{ name: 'Capacity beds', values: [6183, 6784, 7284, 8211, 10192], fmt: 'num' }], labels: 'all', highlight: 'Aug-26', source: 'Investor presentation, 17-Aug-2026 (+601, +500, +927, +1,981)' },
      { type: 'line', title: 'Occupancy has held at 74-76% for four years while beds were added', unit: 'Network occupancy (% of operational beds)', x: ['FY23', 'FY24', 'FY25', 'FY26', 'Q1FY27'], series: [{ name: 'Occupancy', values: [...AK.map(k => k.occupancyPct), Q1.occupancyPct], fmt: 'pct' }], labels: 'all', min: 60, max: 85, source: 'Company decks and releases (operational beds 4,654 at Mar-25, 5,379 at Jun-26)' },
    ] },
    { pair: [
      { type: 'stacked', title: 'Payor mix: insurance up, government schemes down', unit: 'Share of hospital revenue (%)', x: ['FY25', 'FY26', 'Q1FY26', 'Q1FY27'], series: [{ name: 'Self-pay', values: [34.1, 34.2, 33.8, 32.5], fmt: 'pct' }, { name: 'Insurance & corporates', values: [37.7, 34.9, 35.8, 37.8], fmt: 'pct' }, { name: 'International', values: [8.8, 9.1, 8.6, 8.8], fmt: 'pct' }, { name: 'Institutional (CGHS, ECHS, PSU)', values: [19.4, 21.9, 21.8, 20.9], fmt: 'pct' }], minLabel: 5, max: 100, source: 'Company earnings presentations (May-2026, Aug-2026)' },
      { type: 'hbar', title: 'Network EBITDA is 18% bigger than what MHIL consolidates', unit: 'FY26 operating EBITDA (₹ crore)', x: ['MHIL consolidated (company, pre-ESOP)', 'Balaji Society (Patparganj)', 'Gujarmal Modi Society (Smart)', 'Devki Devi Society (Saket East)', 'Adjustments', 'Network'], series: [{ name: 'EBITDA', values: [2328, 86, 78, 122, 25, 2638], fmt: 'num' }], labels: 'all', highlight: 'Network', source: 'Q4FY26 release, memorandum consolidation. Screener\'s consolidated EBITDA (after ESOP and other items) is ₹2,243 cr' },
    ] },
    { pair: [
      { type: 'column', title: 'EPS lags EBITDA: depreciation and interest come first', unit: 'Growth, year on year (%): consolidated EBITDA vs EPS before one-offs (FY27-29E: GAM)', x: ['FY24', 'FY25', 'FY26', ...F.years], series: [{ name: 'EBITDA', values: [20.3, 23.8, 21.3, ...F.ebitdaGrowth.map(v => Math.round(v * 10) / 10)], fmt: 'pct' }, { name: 'EPS (adjusted)', values: [22.9, 5.3, 20.2, Math.round((F.eps[0] / epsAdj26 - 1) * 1000) / 10, ...F.epsGrowth.slice(1).map(v => Math.round(v * 10) / 10)], fmt: 'pct' }], labels: 'all', source: 'Screener.in; company notes on one-offs; GAM estimates' },
      { type: 'line', title: 'Returns are falling as capital goes into new beds', unit: 'Pre-tax ROCE, company definition (%)', x: ['FY23', 'FY24', 'FY25', 'FY26', 'Q1FY27'], series: [{ name: 'Overall', values: [33, 32, 25.9, 21.8, 20], fmt: 'pct' }, { name: 'Units over 4 years old, excl. CWIP', values: [null, null, 35, 31, 29.2], fmt: 'pct' }], labels: 'all', min: 0, max: 40, source: 'Company decks and releases (May-2025 to Aug-2026)' },
    ] },
    { pair: [
      { type: 'line', title: `Forward EV/EBITDA: median ${n1(HEV.med)}x since Apr-2021, ${n1(evNow)}x now`, unit: 'EV (incl. lease liabilities) ÷ next full-year EBITDA, consolidated (x)', x: fwdEv.map(x => x[0]), series: [{ name: 'Forward EV/EBITDA', values: fwdEv.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [...(Math.abs(HEV.med - evMult) >= 2 ? [{ v: HEV.med, text: `Median: ${n1(HEV.med)}x` }] : []), { v: evMult, text: `Our target: ${evMult}x`, color: '#cf8f1f' }], source: 'Screener.in prices and balance sheets; GAM estimates FY27-29E' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (notes standing on 30-Sep-26)', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...ST.map(s => `${s.broker} (${X.shortDate(s.date)})`), 'GAM (base)'], series: [{ name: 'Target', values: [...ST.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes and aggregators (Feb-Aug 2026); street targets are on Network EBITDA' },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.hospitals, P3.payor, P3.expansion, P3.moat, p.financials, P4.guidance, p.capital, P4.quality, p.balance, P4.ownership(p.ownershipBase), P4.governance, P4.forecasts, P5.street, P5.valuation, P5.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
