// Tube Investments of India report, part B-5: our forecasts vs the street, and the street's view and critiques.
const X = require('./TIINDIA.ctx');
const { C, D, F, AS, A, n0, n1, price, sh, STR, medTp, saB, coreHist, listedMv } = X;
const b = A.labels.length - 1, cons = D.street.consensus;
const blk = k => AS.segments.find(s => s.key === k);
const rup = s => s.replace(/Rs(?=[0-9])/g, '₹');

const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Forecasts', title: 'Our forecasts: consolidated EPS ₹{{F.eps.0|n1}} / ₹{{F.eps.1|n1}} / ₹{{F.eps.2|n1}} (FY27-29E)',
  blocks: [
    { p: 'We build the consolidated P&L from four blocks that add up to reported revenue and EBITDA: TII standalone, CG Power (100%), Shanthi Gears (100%), and a residual for the EV and other new ventures. Only the standalone block feeds the target (through its profit); CG Power and Shanthi Gears are valued at market, and the consolidated forecast matters only for the P/E cross-check.' },
    { exhibit: { type: 'table', title: 'Forecast drivers by block', head: ['Block', 'Revenue growth FY27-29E', 'EBITDA margin FY27-29E', 'Why'], wide: [3], rows: ['sa', 'cg', 'sg', 'res'].map(k => { const s = blk(k); return [`**${s.name}**`, s.growth.map(g => g + '%').join(' / '), s.marginPct.map(m => m + '%').join(' / '), rup(s._why.split('. ').slice(0, 2).join('. ') + '.')]; }), source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Consolidated forecasts (₹ crore)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Revenue', n0(A.sales[b]), '{{F.sales.0|num}}', '{{F.sales.1|num}}', '{{F.sales.2|num}}'],
      ['EBITDA', n0(A.ebitda[b]), '{{F.ebitda.0|num}}', '{{F.ebitda.1|num}}', '{{F.ebitda.2|num}}'],
      ['EBITDA margin', `${n1(A.ebitda[b] / A.sales[b] * 100)}%`, '{{F.ebitdaMargin.0|pct}}', '{{F.ebitdaMargin.1|pct}}', '{{F.ebitdaMargin.2|pct}}'],
      ['Other income (FY26 incl. exceptional items)', n0(A.otherIncome[b]), '{{F.otherIncome.0|num}}', '{{F.otherIncome.1|num}}', '{{F.otherIncome.2|num}}'],
      ['Profit before tax', n0(A.pbt[b]), '{{F.pbt.0|num}}', '{{F.pbt.1|num}}', '{{F.pbt.2|num}}'],
      ['Tax + minorities (% of PBT)', `${n1((A.pbt[b] - A.pat[b]) / A.pbt[b] * 100)}%`, `${AS.taxRate[0]}%`, `${AS.taxRate[1]}%`, `${AS.taxRate[2]}%`],
      { hl: true, cells: ['**Profit attributable to TII**', `**${n0(A.pat[b])}**`, '**{{F.pat.0|num}}**', '**{{F.pat.1|num}}**', '**{{F.pat.2|num}}**'] },
      ['EPS (₹)', n1(A.eps[b]), '{{F.eps.0|n1}}', '{{F.eps.1|n1}}', '{{F.eps.2|n1}}'],
      ['Memo: TII standalone core profit', n0(coreHist.FY26), n0(saB.base[0].pat), n0(saB.base[1].pat), n0(saB.base[2].pat)],
    ], source: 'Screener.in (FY26, after minorities); GAM estimates' } },
    { p: `**Against the street.** The only consensus we found (Trendlyne, ${cons.analysts} analysts, ${cons.date.slice(8)}-Jul-2026, before Q1) expected FY27 revenue +${cons.fy27RevenueGrowth}% and profit +${cons.fy27ProfitGrowth}%. We are higher on both: revenue +{{F.salesGrowth.0|n1}}% (Q1 was already +17%) and attributable profit +{{F.patGrowth.0|n1}}%. The gap is about the size of FY26's one-offs (₹42 cr of exceptional charges after tax and an ₹18 cr fair-value loss on TICMPL's preference shares, which no longer arises after the Mar-2026 restatement): on a clean FY26 base of ~₹${n0(A.pat[b] + 60)} cr our FY27E growth is ${n1((F.pat[0] / (A.pat[b] + 60) - 1) * 100)}%, close to consensus. It rests on CG Power growing ~15% and the ventures' losses no longer widening. MOSL, the only broker with a post-Q1 note in our sources, forecasts ~7% a year standalone profit growth over FY26-28E; our core standalone profit grows ${n1((Math.pow(saB.base[1].pat / coreHist.FY26, 0.5) - 1) * 100)}% a year over the same period, flat in FY27E.` },
    { callout: `**What the engine can and cannot show.** The model has no minority-interest line, so tax and minorities share one rate (${AS.taxRate.join('% / ')}%, against 66% in FY26); the rate falls as the untaxed venture losses shrink relative to CG Power's taxed profit. Model cash and net worth are consolidated and include CG Power's cash, which TII's shareholders cannot reach except through dividends; the standalone balance sheet is in "Balance sheet & cash".` },
  ],
};

const streetRows = STR.map(s => [s.broker, s.rating, n0(s.tp), s.method, s.multiple, s.date.split('-').reverse().join('-'), s.standing]);
const street = {
  id: 'street', nav: 'Street view & critiques', kicker: 'Street view', title: `The street: Buy, with targets of ₹3,130-3,380 standing on 30-Sep-2026`,
  blocks: [
    { p: D.street.coverage + ' ' + D.street.method },
    { exhibit: { type: 'table', title: 'Broker notes we found', head: ['Broker', 'Rating', 'Target (₹)', 'Method', 'Basis', 'Date', 'Standing on 30-Sep-2026'], wide: [4], rows: streetRows, source: 'Investment Guru India (MOSL note summaries), Trendlyne research-report records' } },
    { p: `The street median of the notes standing on 30-Sep-2026 is ₹${n0(medTp)}; Trendlyne's pre-Q1 consensus target was ₹${n0(cons.tp)}. MOSL's method has moved in one direction: the standalone multiple fell from 30x (Aug-2025) to 24x (Feb-2026) to 15x (Aug-2026) and the holding-company discount rose from 30% to 35%, yet its target barely moved (₹3,515 -> ₹3,315 -> ₹3,379) because CG Power's price rose. In other words, the street's target for TII is mostly a target for CG Power less a discount. At MOSL's 35% discount, the CG Power and Shanthi Gears stakes alone are worth ~₹${n0(listedMv * 0.65 / sh)} a TII share at 30-Sep-2026 closes.` },
    { h: 'What the bears and bulls argue' },
    { bullets: [
      ...D.critiques.map(c => `**Bear:** ${c}`),
      '**Bear:** the stake is "trapped": TII has never sold CG Power shares, so TII\'s shareholders get CG Power\'s value only through a small dividend or a future restructuring that has not been announced.',
      '**Bull:** the discount on 30-Sep-2026 (~65% on our convention) is the widest in TII\'s history; even a return to the post-2024 median closes a large part of the gap.',
      '**Bull:** the standalone business is a 44%-ROIC compounder in its own right, and TICMPL has outside investors who valued their stake at ₹2,405 cr in Mar-2026.',
    ] },
  ],
};

module.exports = { forecasts, street };
