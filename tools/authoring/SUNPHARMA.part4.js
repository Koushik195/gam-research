// Sun Pharma report, part 4: R&D and pipeline, competitive advantage scorecard, Q1FY27 and guidance.
const X = require('./SUNPHARMA.ctx');
const { C, D, F, A, SA, SQ, QL, n0, n1, pc, rup, b } = X;
const IN = C.innovative, Q = C.q1fy27, G = C.guidance;

const rnd = {
  id: 'rnd', nav: 'R&D & pipeline', kicker: 'R&D', title: 'R&D at 6% of sales, a third of it on innovation; the in-house pipeline is thin',
  blocks: [
    { p: `Sun spent ₹3,554 cr on R&D in FY26 (6.1% of sales; ₹33,500 cr cumulatively since inception) through 2,700+ scientists. About 39% of FY26 R&D went to innovative medicines (30% in Q1FY27), the rest to generics for the US, India and other markets. Guidance for FY27 is 6-7% of sales; Q1 was 5.4% because some trials ended before new ones started. The US filing machine is large (677 ANDAs filed, 558 approved, 119 pending; 13 NDAs pending) but its output is held back by the plants' FDA status. The innovative pipeline has one near-term event (Ilumya in psoriatic arthritis) and few new molecules; Sun's strategy is to in-license or buy late-stage assets (Ilumya, Winlevi, Leqselvi, Unloxcyt all came from outside) and partner early ones in big markets.` },
    { pair: [
      { type: 'column', title: 'R&D: ₹2,219 cr in FY22, ₹3,554 cr in FY26', unit: 'R&D spend (₹ crore)', x: ['FY22', 'FY23', 'FY24', 'FY25', 'FY26'], series: [{ name: 'R&D', values: SA.map(a => Math.round(a.rnd)), fmt: 'num' }], labels: 'all', source: 'Investor presentation Jun-2026 p.42' },
      { type: 'line', title: 'R&D intensity 5.5-6.7% of sales', unit: 'R&D, % of sales', x: ['FY22', 'FY23', 'FY24', 'FY25', 'FY26'], series: [{ name: 'R&D % of sales', values: SA.map(a => a.rndPct), fmt: 'pct' }], labels: 'all', min: 0, max: 8, source: 'Investor presentation Jun-2026 p.42' },
    ] },
    { exhibit: { type: 'table', title: 'Innovative pipeline (Jun-2026)', head: ['Candidate', 'Indication', 'Stage'], wide: [1, 2], rows: IN.pipeline.map(r => r.map(rup)), source: 'Investor presentations Jun/Sep-2026 p.18; Q1FY27 call; AR FY26 note 61' } },
    { callout: '**Our view:** Sun is a commercial company that buys science rather than discovers it. That has worked (Ilumya), but it means growth depends on deal-making, and the Organon debt will limit deal capacity for two to three years (management will still look at "close-to-market" assets).' },
  ],
};

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat scorecard', title: 'A real moat in India, a moderate one in specialty, none in US generics',
  blocks: [
    { exhibit: { type: 'table', title: 'Competitive advantage scorecard', head: ['Source', 'Strength', 'Evidence', 'So what'], wide: [2, 3], rows: D.moat.map(r => r.map(rup)), source: 'Company presentations and calls; AIOCD/SMSRC via company; GAM Research' } },
    { callout: '**Verdict:** Sun\'s moat is its Indian franchise (scale, prescriber reach, brand breadth) and, to a lesser degree, its specialty commercial platform in US dermatology. Both earn high returns. US generics have no moat and currently a handicap (FDA). Organon adds scale and brands but no obvious moat: established brands decline slowly once generics arrive, and biosimilars are a scale-and-cost game.' },
  ],
};

const qRows = [
  ['Revenue from operations', '₹15,300 cr', '+10.5%', 'India +16%, US −0.1% (₹) / −9.7% ($), EM +15.4%, RoW +10.4%, API +10.5%'],
  ['Gross margin', '80.5%', '+90bp', 'Mix: branded generics and innovative medicines'],
  ['EBITDA incl. forex (company)', '₹4,418 cr (28.9%)', '+2.7%', 'Q1FY26 had gRevlimid sales; forex gain ₹122 cr (lower than a year ago)'],
  ['EBITDA before forex', '₹4,296 cr (28.1%)', '+5.5%', 'R&D only 5.4% of sales (−8% YoY); employee costs 21.1% of sales (+15%)'],
  ['Exceptional items', '−₹204 cr', '', 'Organon deal costs ₹167 cr; labour codes ₹37 cr'],
  ['Tax rate', '27.8%', '24.3% a year ago', '"Low tax rate in India now getting exhausted"; similar until Organon closes'],
  ['Net profit (reported / adjusted)', '₹2,895 cr / ₹3,089 cr', '+27% / +3.1%', 'Reported up because Q1FY26 carried ₹594 cr of exceptional charges'],
  ['Innovative medicines', '$351 mn', '+12.8%', '21.9% of sales; Levulan seasonality; Leqselvi >1,000 prescribers'],
  ['Net cash', '$3.4 bn', '', 'Before Organon'],
];
const guidance = {
  id: 'q1fy27', nav: 'Q1FY27 & guidance', kicker: 'Latest quarter', title: 'Q1FY27: India strong, US weak, profit flat after a higher tax rate; guidance unchanged',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (results 31-Jul-2026)', head: ['', 'Q1FY27', 'YoY', 'Comment'], wide: [3], rows: qRows, source: 'Q1FY27 call and presentation; ICICI Direct and PL notes (2/3-Aug-2026)' } },
    { pair: [
      { type: 'line', title: 'Quarterly EBITDA margin before forex: 24-31%', unit: 'EBITDA before forex, % of revenue', x: QL, series: [{ name: 'Margin', values: SQ.map(q => Math.round(q.ebitdaExFx / q.revenue * 1000) / 10), fmt: 'pct' }], labels: 'all', min: 15, max: 35, source: 'ICICI Direct Q1FY27 quarterly table; Screener revenue' },
      { type: 'column', title: 'R&D dipped to ₹826 cr in Q1FY27; guided 6-7% for FY27', unit: 'R&D (₹ crore per quarter)', x: QL, series: [{ name: 'R&D', values: SQ.map(q => Math.round(q.rnd)), fmt: 'num' }], labels: 'all', source: 'PL Q1FY27 note; Q4FY26 call' },
    ] },
    { exhibit: { type: 'table', title: 'What management guided (standing on 30-Sep-2026)', head: ['Item', 'Guidance'], wide: [1], rows: [
      ['FY27 revenue', rup(G.fy27Revenue)], ['FY27 R&D', G.fy27Rnd], ['Tax rate', G.tax], ['Margins', G.margins], ['Leqselvi / Unloxcyt outside the US', G.specialtyExUs], ['Organon closing', G.organonClose],
    ], source: 'Q4FY26 call (22-May-2026); Q1FY27 call (31-Jul-2026)' } },
    { callout: `**Read-across to our forecasts:** we model FY27E revenue +${n1(F.salesGrowth[0])}% (above the high-single-digit guidance only because the rupee is ~8% weaker than the FY26 average), an EBITDA margin of ${n1(F.ebitdaMargin[0])}% before forex (R&D back to ~6.3% of sales, no gRevlimid) and a ${X.AS.taxRate[0]}% tax rate. That gives FY27E EPS of ₹${n1(F.eps[0])}, +${n1(F.epsGrowth[0])}% on reported FY26 EPS but slightly below FY26 adjusted EPS of ₹51.7 (which included ₹1,240 cr of forex gains).` },
  ],
};

module.exports = { rnd, moat, guidance };
