// TVS Motor report, part 6: our forecasts vs the street, and the street's view with critiques. Valuation in part6b,
// risks / verdict / glossary / statement notes in part6c.
const X = require('./TVSMOTOR.ctx');
const { F, D, BUILD, ST, medTp, avgTp, avgEps, n0, n1, pc, price, shortDate, W, FM } = X;
const P6B = require('./TVSMOTOR.part6b'), P6C = require('./TVSMOTOR.part6c');
const CON = D.street.consensus.bloombergEPS_asOf21Jul2026;
const gap = (a, b) => pc((a / b - 1) * 100);

const forecasts = {
  id: 'forecasts', nav: 'Forecasts vs street', kicker: 'Estimates', title: 'Our forecasts: more volume than the street in FY27, less margin in FY29',
  blocks: [
    { p: `We forecast FY27-29E EPS of {{F.eps.0|inr}} / {{F.eps.1|inr}} / {{F.eps.2|inr}}. Our FY27E is ${gap(F.eps[0], CON.FY27)} above the Bloomberg consensus quoted on 21-Jul-2026 (₹${n1(CON.FY27)}) and ${gap(F.eps[0], avgEps('FY27'))} vs the average of the post-results broker notes we found (₹${n1(avgEps('FY27'))}); FY28E is ${gap(F.eps[1], CON.FY28)} vs consensus (₹${n1(CON.FY28)}) and ${gap(F.eps[1], avgEps('FY28'))} vs brokers (₹${n1(avgEps('FY28'))}). Most notes were written before the July and August sales releases, which ran +38% and +21%; our FY27E volume growth (+{{F.salesGrowth.0|n1}}% revenue on +18% units) is above most brokers (PL: ~12% volume CAGR FY26-28E). Our FY29E is lower than the few brokers who publish it (Emkay ₹154, Arihant ₹148) because we take the PLI out after FY28.` },
    { exhibit: { type: 'table', title: 'GAM forecasts vs the street', head: ['', 'FY26A', 'FY27E', 'FY28E', 'FY29E', 'Street / comment'], wide: [5], rows: [
      ['Vehicles (mn)', '5.89', ...F.volume.map(v => (v / 1e6).toFixed(2)), 'PL: volume CAGR 12.2% FY26-28E'],
      ['Revenue (₹ cr)', '{{fin.sales.11|num}}', '{{F.sales.0|num}}', '{{F.sales.1|num}}', '{{F.sales.2|num}}', 'MOSL: revenue CAGR 20% FY26-28E; Emkay 19% FY26-29E'],
      ['EBITDA margin', '{{fin.ebitdaMargin.11|pct}}', '{{F.ebitdaMargin.0|pct}}', '{{F.ebitdaMargin.1|pct}}', '{{F.ebitdaMargin.2|pct}}', 'MOSL 13.5% by FY28E; Arihant 13.3%/13.9% FY27/28E; BOBCAPS ~12.5%'],
      ['Net profit (₹ cr)', '{{fin.pat.11|num}}', '{{F.pat.0|num}}', '{{F.pat.1|num}}', '{{F.pat.2|num}}', 'FY27E includes the ₹150 cr Q1 fair-value gain'],
      { hl: true, cells: ['**EPS (₹), GAM**', '{{fin.eps.11|n1}}', '**{{F.eps.0|n1}}**', '**{{F.eps.1|n1}}**', '**{{F.eps.2|n1}}**', ''] },
      ['EPS (₹), Bloomberg consensus (21-Jul-2026)', '', n1(CON.FY27), n1(CON.FY28), '–', 'As quoted by BOBCAPS'],
      ['EPS (₹), broker average (Jul-2026 notes)', '', n1(avgEps('FY27')), n1(avgEps('FY28')), '–', `Range FY28E ₹${n0(Math.min(...ST.filter(s => s.eps?.FY28).map(s => s.eps.FY28)))}-${n0(Math.max(...ST.filter(s => s.eps?.FY28).map(s => s.eps.FY28)))}`],
    ], source: 'GAM Research; broker notes 21-24 Jul 2026; Bloomberg consensus as quoted by BOBCAPS' } },
    { exhibit: { type: 'table', title: 'The segment build behind our revenue (checked against the model)', head: ['', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ["Domestic ICE 2W ('000)", ...BUILD.map(b => n0(b.units.domIce))], ["Electric 2W ('000)", ...BUILD.map(b => n0(b.units.ev))], ["Exports 2W + 3W ('000)", ...BUILD.map(b => n0(b.units.exp))], ["Domestic 3W ('000)", ...BUILD.map(b => n0(b.units.dom3w))],
      ['Revenue: domestic ICE, 3W and spares (₹ cr)', ...BUILD.map(b => n0(b.dom))], ['Revenue: EV (₹ cr)', ...BUILD.map(b => n0(b.ev))], ['Revenue: exports (₹ cr)', ...BUILD.map(b => n0(b.exp))], ['Government incentives (₹ cr)', ...BUILD.map(b => n0(b.incent))],
      { hl: true, cells: ['**Build total vs model revenue**', ...BUILD.map(b => `${n0(b.total)} vs ${n0(b.model)}`)] },
    ], source: 'GAM Research (assumptions.json businessLines; reconciled in TVSMOTOR.ctx.js)' } },
    { callout: '**Where we could be wrong:** (1) volumes: every 5% of extra FY28E volume adds ~5% to EPS; (2) margin: every 50bp of EBITDA margin is ~₹340 cr of FY28E EBITDA, ~5% of EPS; (3) PLI: if the scheme is renewed, FY29E EPS would be ~5% higher; (4) other income: fair-value marks swing ±₹100-150 cr a year.' },
  ],
};

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street: ${ST.length} targets of ₹${n0(Math.min(...ST.map(s => s.tp)))}-${n0(Math.max(...ST.map(s => s.tp)))}, median ₹${n0(medTp)}; nobody says Sell`,
  blocks: [
    { p: `We found ${ST.length} targets published around the Q1FY27 results (21-24 Jul 2026): ${ST.filter(s => /BUY/i.test(s.rating)).length} Buy, ${ST.filter(s => /ADD|ACCUM/i.test(s.rating)).length} Add/Accumulate and ${ST.filter(s => /HOLD/i.test(s.rating)).length} Hold, no Sell. The median target is ₹${n0(medTp)} (average ₹${n0(avgTp)}), set when the stock was ₹3,792-3,828; at ₹${n0(price)} on 30-Sep-2026 that is ~${Math.round((medTp / price - 1) * 100)}% upside. Earlier in the year JPMorgan (Overweight, ₹4,440, Apr-2026) and Goldman Sachs (Buy, ₹4,100, Apr-2026) upgraded the stock; Emkay reiterated Buy at ₹5,300 on 18-Aug-2026 with the most explicit SOTP (35x Jun-28E core earnings = ₹4,876, TVS Credit at 2x FY28E book = ₹426, cash ₹17).` },
    { h: 'What the street assumes' },
    { bullets: [
      `**A 33-35x standalone multiple.** That is about TVS's own one-year-forward P/E since 2023 (${n1(W.since23)}x) or its FY17-20 average (${n1(W.fy17to20)}x), not its ${n1(FM.median)}x median since 2021, and it is applied to standalone EPS that excludes ~₹28 a share of annual subsidiary losses.`,
      '**TVS Credit at ₹93-426 a share** (1.3-2.0x book), added on top of a standalone multiple whose history already includes the market\'s value of TVS Credit.',
      '**Nothing for Norton and the e-bike losses,** except Axis (other investments at 1x book). Nirmal Bang and BOBCAPS flag the overseas investments as a concern.',
      '**Margins drifting up to 13.3-13.9%** (Arihant, MOSL) with no mention of the PLI ending in FY28.',
    ] },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who'], wide: [0], rows: D.critiques, source: 'Broker notes, calls and filings to 30-Sep-2026; GAM Research' } },
    { exhibit: { type: 'table', title: 'Other street comments after Q1FY27 (no target found)', head: ['Broker', 'Date', 'Comment'], wide: [2], rows: D.street.comments.map(c => [c.broker.replace(/ \(.*\)/, ''), shortDate(c.date), c.thesis]), source: 'Upstox and Investing.com summaries, 22-Jul-2026' } },
  ],
};

module.exports = { forecasts, street, valuation: P6B.valuation, risks: P6C.risks, glossary: P6C.glossary, statementNotes: P6C.statementNotes };
