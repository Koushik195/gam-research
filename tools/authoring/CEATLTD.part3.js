// CEAT report, part 3: the standalone (India plants) business, Camso, and the moat scorecard.
const X = require('./CEATLTD.ctx');
const { C, D, AS, SQ, n0, n1, segBuild, Q1 } = X;
const QS = Q1.standalone, PR = Q1.pricing, RM = Q1.rm, CM = Q1.camso;
const B = AS.build || X.AJ.build;

const india = {
  id: 'india', nav: 'CEAT standalone', kicker: 'Segment: India plants', title: 'The core: volume growth is strong; the margin is hostage to rubber and to how fast prices move',
  blocks: [
    { p: `The standalone company (all six Indian plants, domestic and export sales) was ₹15,215 cr of FY26 revenue (+15.5%) with a 13.4% EBITDA margin and ₹812 cr of profit. In Q1FY27 revenue rose ${QS.growthPct}% (two-thirds volume, one-third price and mix): replacement up ${QS.replacementGrowth}, OEM ${QS.oemGrowth} and international ${QS.internationalGrowth}. But raw materials rose ${RM.q1QoqPct}% over Q4 (domestic natural rubber ~₹${RM.naturalRubberDomesticRsKg}/kg, crude above $100, the rupee from ${RM.inrUsd}) and the gross margin fell to ${QS.grossMarginPct}%, so EBITDA fell to ₹${QS.ebitda} cr (${QS.ebitdaMarginPct}%). Management expects another ${RM.q2QoqPct}% of cost inflation in Q2.` },
    { exhibit: { type: 'table', title: 'Price increases vs the cost bill (Q1FY27 call, 17-Jul-2026)', head: ['Channel', 'Taken so far', 'Still to come', 'Comment'], wide: [3], rows: [
      ['Replacement (51% of revenue)', `${PR.replacementBy30Jun} by end-June; ${PR.replacementMidJuly} by mid-July`, PR.replacementPlannedJulAug + ' in Jul-Aug', 'Competitors raising prices "in different measures, in different categories"'],
      ['OEM (30%)', '3% index increase in April', 'Double-digit index increase from 1-Jul', 'Formula pricing with a quarter\'s lag'],
      ['International (19%)', PR.international, 'More on fresh orders', 'Order book of ~30 days delays pass-through'],
      { hl: true, cells: ['**Needed in total**', '', `**~${PR.neededTotal}**`, `Raw materials +${RM.q1QoqPct}% in Q1 and +${RM.q2QoqPct}% in Q2; normal gross margin ${PR.normalGrossMarginPct}%`] },
    ], source: 'Q1FY27 call and presentation; MOSL and Emkay (17-18 Jul-2026)' } },
    { exhibit: { type: 'table', title: 'Our standalone revenue build (₹ crore)', head: ['Channel', 'FY26', 'FY27E', 'FY28E', 'FY29E', 'Growth FY27-29E'], rows: [
      ['Replacement', n0(B.base.replacement), ...segBuild.map(r => n0(r.chan.rep)), B.replacementGrowth.map(g => '+' + g + '%').join(' / ')],
      ['OEM', n0(B.base.oem), ...segBuild.map(r => n0(r.chan.oem)), B.oemGrowth.map(g => '+' + g + '%').join(' / ')],
      ['International', n0(B.base.international), ...segBuild.map(r => n0(r.chan.ib)), B.internationalGrowth.map(g => '+' + g + '%').join(' / ')],
      { hl: true, cells: ['**Standalone revenue (= segment)**', '**15,215**', ...segBuild.map(r => `**${n0(r.india)}**`), ''] },
      ['EBITDA margin (GAM)', '13.4%', ...AS.segments[0].marginPct.map(m => m + '%'), 'Q1FY27 9.1%'],
    ], source: 'FY26 mix from the Q1FY27 presentation; GAM estimates (checked against the model in CEATLTD.ctx.js)' } },
    { pair: [
      { type: 'line', title: 'Standalone EBITDA margin: 14.6% in Q4FY26, 9.1% in Q1FY27', unit: 'EBITDA margin (%)', x: SQ.map(q => q.q), series: [{ name: 'Standalone', values: SQ.map(q => q.indiaMarginPct), fmt: 'pct' }], labels: 'all', min: 0, max: 18, source: 'Emkay quarterly tables (18-Jul-2026)' },
      { type: 'line', title: 'Raw materials jumped to 66% of revenue in Q1FY27', unit: 'Raw materials, % of consolidated revenue', x: SQ.map(q => q.q), series: [{ name: 'RM cost', values: SQ.map(q => q.rmPct), fmt: 'pct' }], labels: 'all', min: 50, max: 70, source: 'Emkay quarterly tables (18-Jul-2026)' },
    ] },
    { callout: `**Our view:** CEAT's volumes are strong and its brand lets it push prices, but the gap is unusually large: ~15-16% of increases needed in four months. We assume the standalone margin recovers to ~13% in H2 and to ${AS.segments[0].marginPct[1]}% in FY28E, still below FY26's 13.4%, because the whole industry is adding capacity. If rubber falls while prices hold (as management intends), FY28 margins could be higher; that is our bull case.` },
  ],
};

const camso = {
  id: 'camso', nav: 'Camso', kicker: 'Segment: Camso', title: 'Camso: a global brand bought at ~1x revenue, losing money until the Michelin transition ends',
  blocks: [
    { p: `Camso makes bias tyres and rubber tracks for compact construction equipment (skid-steer loaders, mini-excavators) under the Camso and Hauler brands, in Sri Lanka. CEAT signed for it on 6-Dec-2024 and closed on 1-Sep-2025, paying ₹${n0(C.camso.consideration)} cr; the brand itself (USD44 mn) transfers after three years. During the transition CEAT sells to Michelin, which resells to customers and keeps 25-30% of the value chain, and the plant buys compounds from Michelin because it has no mixers or calenders. Customer prices run at ~USD${CM.runRateUsdMnPerMonth} mn a month (~USD120 mn a year); ${CM.customersMovedByJunePct}% of customers had moved to CEAT by June and ${CM.customersMovedBySepPct}% were expected by September; the upstream equipment (USD30 mn) is due by Q4FY27, so FY28 is the first year CEAT controls the whole chain.` },
    { p: `So far the numbers are poor. Subsidiary revenue (consolidated less standalone) was ₹${n0(SQ[SQ.length - 1].subsRev)} cr in Q1FY27, down 15% q/q, and EBITDA about −₹${Math.abs(Math.round(SQ[SQ.length - 1].subsEbitda))} cr as CEAT opened warehouses and offices in Germany, the UK, France, Poland and the US before the revenue moved over. Q1 also carried a ₹48 cr finance-cost hit because the Sri Lankan Camso entity owes the parent USD80 mn and the Sri Lankan rupee fell from ~315 to ~335 per dollar; it cannot be hedged. USD24.5 mn of that loan is being converted into equity. US tariffs are 10% on Sri Lankan OHT tyres and tracks (tracks ~50% of US sales) plus 25% on the steel in tracks.` },
    { exhibit: { type: 'table', title: 'Camso: what we assume (₹ crore)', head: ['', 'FY26 (7 months)', 'Q1FY27', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Revenue (subsidiaries)', n0(X.sa('FY26').subsRev), n0(SQ[SQ.length - 1].subsRev), '{{F.seg.subs.revenue.0|num}}', '{{F.seg.subs.revenue.1|num}}', '{{F.seg.subs.revenue.2|num}}'],
      ['EBITDA margin', n1(X.sa('FY26').subsEbitda / X.sa('FY26').subsRev * 100) + '%', 'negative', ...AS.segments[1].marginPct.map(m => m + '%')],
      ['EBITDA', n0(X.sa('FY26').subsEbitda), n0(SQ[SQ.length - 1].subsEbitda), '{{F.seg.subs.adjEbitda.0|num}}', '{{F.seg.subs.adjEbitda.1|num}}', '{{F.seg.subs.adjEbitda.2|num}}'],
    ], source: 'AR FY26 note 52; Emkay quarterly tables; Q4FY26 and Q1FY27 calls; GAM estimates' } },
    { callout: '**Our view:** strategically sensible (a global brand in a niche CEAT already knew from Ambernath, bought for ~1x revenue with almost no goodwill), but the payback is slow. Even at our FY29E (₹133 cr of EBITDA) EBITDA is only ~8% of the ~₹1,600 cr outlay including the brand, before depreciation and tax: well below CEAT\'s cost of capital. Management talked about 12-13% margins on ₹1,000-1,200 cr of revenue; we will believe it when the H2FY27 numbers show direct billing working.' },
  ],
};

const moatRows = D.moat.map(([dim, v, ev]) => [dim, v, ev, {
  'Brand and replacement pull': 'Lets CEAT lead price increases in two-wheelers and hold share',
  'OEM and EV position': 'Builds the future replacement base',
  'Cost position': 'Margins move with the industry; no protection in a squeeze',
  Scale: 'Smaller than MRF and Apollo; less purchasing power',
  Camso: 'Could be a second engine or a drag; too early to tell',
}[dim] || '']);
const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: a real consumer brand; no cost moat; Camso unproven',
  blocks: [
    { verdicts: moatRows, head: ['Dimension', 'Verdict', 'Evidence', 'So what'], title: 'Moat scorecard', source: 'GAM research compilation (annual report, presentations and calls to Jul-2026; MOSL market shares)' },
    { callout: '**Honest verdict:** CEAT has a narrow moat in branded two-wheeler and car tyres: dealers and riders ask for it, it can raise prices first in those categories, and it wins OEM EV fitments. It has no moat against the raw-material cycle (nobody in Indian tyres does), it is sub-scale in truck radials, and Camso is a bet, not an advantage yet. Returns above the cost of capital come only in good years (ROE 15-17% in FY24 and FY26, 2-6% in FY22-23).' },
  ],
};

module.exports = { india, camso, moat };
