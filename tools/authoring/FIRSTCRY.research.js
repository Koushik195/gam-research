// FirstCry report, part B: research chapters. This file holds the cover, the story in charts and the business chapter,
// and merges part2 (history, industry, tailwind), part3 (India multi-channel, International, Globalbees & preschools, moat),
// part4 (earnings quality, cash, ownership, governance, forecasts), part5 (street, valuation) and part6 (risks, glossary).
// Written as of 30-Sep-2026 (Q1FY27 basis). Forecast and valuation figures are live tokens.
const C = require('./FIRSTCRY.ctx');
const { n0, n1, n2, QL, qv, A26, q1, vsIssue, SO, medTp, OWN, fwdNow, sectorMs, pc1, PI, C: CO } = C;
const P2 = require('./FIRSTCRY.part2'), P3 = require('./FIRSTCRY.part3'), P4 = require('./FIRSTCRY.part4'), P5 = require('./FIRSTCRY.part5'), P6 = require('./FIRSTCRY.part6');
const SRC = 'FirstCry investor presentations (Q1FY26-Q1FY27), GAM Research';
const fromHigh = (C.price / C.M.price.high52 - 1) * 100;
const w12 = C.fwd.filter(x => x[0] >= C.FROM);

const cover = {
  headline: P5.headline,
  lead: `FirstCry (Brainbees Solutions) is India's largest specialist retailer of baby and kids' products: ₹${n0(A26.gmv)} cr of orders in FY26 through its app and 1,188 stores, plus a loss-making Gulf business and 51.68% of Globalbees, a D2C brand roll-up. India growth has re-accelerated (revenue +${q1.imcRevYoYPct}% in Q1FY27), but a diaper price war with quick-commerce apps cut the India margin to ${q1.imcAePct}% and the group still lost ₹${-q1.patOwners} cr in the quarter. The stock trades at ₹{{P.last|num}}, ${Math.abs(Math.round(vsIssue))}% below its ₹465 IPO price and ${n2(fwdNow)}x next year's sales, against a 12-month median of ${n2(OWN.med)}x. Our sum of the parts at ${PI.mult}x Sep-28E sales gives **{{dcf.tp|inr}} ({{dcf.upside|chg}})**: **we initiate with ${P5.rating}.** Bull case {{scen.bull.tp|inr}}; bear case {{scen.bear.tp|inr}} ({{scen.bear.upside|chg}}). The street's consensus target is ₹${n0(medTp)}.`,
  arguments: P5.coverArguments,
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA (₹ cr)', 'ebitda', 'num'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'AMBER' },
    { k: 'Earnings momentum', v: 'AMBER' },
    { k: 'Competitive position', v: 'AMBER' },
    { k: 'Balance sheet', v: 'GREEN' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): does India gross margin recover as promised (input costs passed on, diaper intensity easing) while revenue growth stays above 15%?',
    'Q3FY27 (festive and winter season, the strongest quarter): the test of management\'s "dramatically reduce" the YoY margin gap.',
    'Store openings: ~90-100 net additions promised for FY27 after a year of pause.',
    'Globalbees growth returning from Q3FY27; International loss trend; any sale by SoftBank or Mahindra.',
  ],
};

// ---------------------------------------------------------------- 1. Story in charts
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'line', title: `India revenue growth: from 7.5% to ${q1.imcRevYoYPct}% in a year`, unit: 'India multi-channel revenue growth, YoY %', x: QL, series: [{ name: 'Revenue growth', values: qv('imcRevYoY'), fmt: 'pct' }], labels: 'all', source: SRC },
      { type: 'line', title: 'But the gross margin fell two points', unit: 'Consolidated gross margin, % of revenue', x: QL, series: [{ name: 'Gross margin', values: qv('gmPct'), fmt: 'pct' }], labels: 'all', source: SRC },
    ] },
    { pair: [
      { type: 'column', title: `India adjusted EBITDA margin: ${q1.imcAePct}% in Q1FY27`, unit: '% of India multi-channel revenue', x: QL, series: [{ name: 'Margin', values: qv('imcAePct'), fmt: 'pct' }], labels: 'all', source: SRC },
      { type: 'column', title: 'International and Globalbees: losses shrinking, profits small', unit: 'Adjusted EBITDA by quarter (₹ crore)', x: QL, series: [{ name: 'International', values: qv('intlAe'), fmt: 'num' }, { name: 'Globalbees', values: qv('gbAe'), fmt: 'num' }], labels: 'all', source: SRC },
    ] },
    { pair: [
      { type: 'line', title: `Share price: ${Math.abs(Math.round(vsIssue))}% below the ₹465 IPO price, ${Math.abs(Math.round(fromHigh))}% off the 52-week high`, unit: '₹, weekly', x: 'P.series[].0', series: [{ name: 'Price', ref: 'P.series[].1', fmt: 'num', thin: true }], labels: 'extremes', maxTicks: 6, source: 'Screener.in, NSE' },
      { type: 'line', title: `The market pays ${n2(fwdNow)}x forward sales; the 12-month median is ${n2(OWN.med)}x`, unit: 'EV ÷ next full year attributable sales (x)', x: w12.map(x => x[0]), series: [{ name: 'EV/forward sales', values: w12.map(x => x[1]), fmt: 'n2', thin: true }], labels: 'last', maxTicks: 6, lines: [{ v: OWN.med, text: `Median ${n2(OWN.med)}x (our multiple ${PI.mult}x, after a ${pc1(sectorMs)} sector move)` }], source: 'Screener.in weekly prices; revenue actual and GAM estimates' },
    ] },
    { pair: [
      { type: 'column', title: 'Our forecast: reported EBITDA more than triples by FY29E', unit: 'EBITDA after ESOP cost (₹ crore)', x: 'fin.labels', from: 'FY23', series: [{ name: 'EBITDA', ref: 'fin.ebitda', fmt: 'num' }], labels: 'all', source: 'Company, GAM Research estimates' },
      { type: 'hbar', title: 'Sum of the parts: India is most of the value', unit: '₹ per share', x: SO.parts.map(p => p.name), series: [{ name: '₹/share', values: SO.parts.map(p => Math.round(p.perShare * 10) / 10), fmt: 'n1' }], labels: 'all', source: 'GAM Research estimates' },
    ] },
  ],
};

// ---------------------------------------------------------------- 2. Business
const business = {
  id: 'business', nav: 'What FirstCry does', kicker: 'The business', title: 'A specialist for parents, online and in stores, with three side businesses',
  blocks: [
    { p: 'FirstCry sells everything a family needs from pregnancy to a child\'s twelfth year: diapers, baby care, clothes, footwear, toys, strollers, nursery and school supplies. Parents buy through its app and website (78% of India GMV) or 1,188 FirstCry and BabyHug stores, most run by franchisees. More than half of what it sells in India is its own brands (BabyHug and others), some made in its own plants; the rest comes from 7,900+ brands. A parenting app and partnerships with 13,500+ hospitals bring in new parents. Around this core sit three other segments: **International** (online in the UAE and Saudi Arabia), **Globalbees** (51.68% of a group of D2C brands sold mostly on marketplaces) and **Others** (preschools).' },
    { exhibit: { type: 'table', title: 'FirstCry in FY26 and Q1FY27', head: ['Measure', 'FY26', 'Q1FY27', 'What it tells you'], wide: [3], rows: [
      ['GMV, India + International (₹ cr)', n0(A26.gmv), n0(q1.gmv), `+10% in FY26; +${CO.q1fy27.gmvYoYPct}% in Q1`],
      ['Revenue (₹ cr)', n0(A26.revenue), n0(q1.revenue), `+12% in FY26; +${CO.q1fy27.revenueYoYPct}% in Q1`],
      ['Gross margin', `${A26.gmPct}%`, `${q1.gmPct}%`, `${CO.q1fy27.grossMarginPrevPct}% in Q1FY26: diapers and input costs`],
      ['Adjusted EBITDA (₹ cr)', n0(A26.adjEbitda), n0(q1.adjEbitda), 'Before ESOP cost and rent'],
      ['ESOP cost (₹ cr)', n0(A26.esop), n0(q1.esop), 'Falling as old grants vest'],
      ['Net loss to owners (₹ cr)', n0(-CO.fy26.patOwners), n0(-q1.patOwners || -CO.q1fy27.patOwners), 'Loss narrowing'],
      ['Stores', n0(A26.stores), n0(q1.stores), '651 franchise, 537 company-owned at Jun-26'],
      ['Annual customers (India)', '–', `${CO.q1fy27.indiaAutcMn} mn`, '+10% YoY'],
    ], source: 'Q4FY26 and Q1FY27 presentations, FY26 annual report' } },
    { pair: [
      { type: 'hbar', title: 'India is two-thirds of revenue and most of the profit', unit: 'Q1FY27 revenue by segment (₹ crore)', x: ['India multi-channel', 'Globalbees', 'International', 'Others', 'Inter-segment'], series: [{ name: 'Revenue', values: [q1.imcRev, q1.gbRev, q1.intlRev, q1.othRev, q1.elimRev], fmt: 'num' }], labels: 'all', source: SRC },
      { type: 'waterfall', title: 'Q1FY27: from segment profit to reported EBITDA', unit: '₹ crore', x: ['India', 'International', 'Globalbees', 'Others', 'Inter-segment', 'ESOP', 'EBITDA'], series: [{ name: 'Bridge', values: [q1.imcAe, q1.intlAe, q1.gbAe, q1.othAe, q1.elimAe, -q1.esop, q1.ebitda] }], fmt: 'num', totalFmt: 'num', source: SRC },
    ] },
    { exhibit: { type: 'tiles', title: 'FirstCry in numbers (Q1FY27)', tiles: [
      { k: 'GMV', v: `₹${n0(q1.gmv)} cr`, d: `quarter, +${CO.q1fy27.gmvYoYPct}%` },
      { k: 'Stores', v: n0(q1.stores), d: 'FirstCry and BabyHug' },
      { k: 'Home brands', v: '>58%', d: 'of India GMV (FY26)' },
      { k: 'India margin', v: `${q1.imcAePct}%`, d: 'adjusted EBITDA, % of revenue' },
      { k: 'Cash & deposits', v: `₹${n0(CO.fy26.cash + CO.fy26.bankBalances + CO.fy26.ncDeposits + CO.fy26.investments)} cr`, d: 'Mar-2026; borrowings ₹595 cr' },
    ], source: 'Q1FY27 presentation, FY26 annual report' } },
    { callout: '**Two numbers matter most.** India revenue growth shows whether FirstCry is winning parents back from quick commerce and horizontals (17.7% in Q1FY27, from 7.5%). The India adjusted EBITDA margin shows whether it can do that profitably (5.7% in Q1FY27, 8.8% in FY26, 9.5% in FY25). The stock will follow the second.' },
  ],
};

const rating = P5.rating;
module.exports = {
  rating, cover,
  sections: p => [narrative, business, P2.history, P2.industry, P2.tailwind, P3.imc, P3.intl, P3.gb, P3.moat, p.financials, P4.earnings,
    { ...p.cash, blocks: [...p.cash.blocks, ...P4.cashBridge.blocks] }, P4.ownership(p.ownershipBase), P4.governance, P4.forecasts, P5.street, P5.valuation, P6.risks(P5.rating), p.statements, P6.glossary],
  statementNotes: { ...P4.statementNotes },
};
