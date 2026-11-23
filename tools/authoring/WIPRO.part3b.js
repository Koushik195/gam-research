// Wipro report, part 3b: our forecasts (P&L, other-income build reconciled to FY26 and the TTM, GAM vs street).
const X = require('./WIPRO.ctx');
const { F, A, AS, n0, n1, pc, b, usdF, usdGrowth, itsEbit, mosl, pl, emkay, choice, dc, postEq, netCashPf, netCashJun26, epsPf26 } = X;
const ty = AS.treasuryYield[0];
const trOpen = [netCashPf, F.treasury[0], F.treasury[1]];
const avg = a => a.reduce((s, x) => s + x, 0) / a.length;
const SB = [mosl, pl, emkay, choice, dc];
const stEps = y => SB.map(s => postEq(s, y)).filter(Boolean);
const gap = (g, s) => Math.round((g / s - 1) * 100);

const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: flat FY27 EPS after the buyback, then ~6% a year',
  blocks: [
    { p: `We build revenue in dollars by SMU (see Markets & sectors) and convert at ₹${AS.usdBuild.inrUsd.join(' / ')} per $: IT Services revenue of $${n0(usdF[0])} / ${n0(usdF[1])} / ${n0(usdF[2])} mn (${usdGrowth.map(g => (g >= 0 ? '+' : '') + n1(g) + '%').join(', ')}) gives consolidated revenue of {{F.sales.0|num}} / {{F.sales.1|num}} / {{F.sales.2|num}} cr. EBITDA margin {{F.ebitdaMargin.0|pct}} / {{F.ebitdaMargin.1|pct}} / {{F.ebitdaMargin.2|pct}} corresponds to an IT Services EBIT margin of ~${n1(itsEbit(0))}% / ${n1(itsEbit(1))}% / ${n1(itsEbit(2))}% on the company's basis (Screener EBIT + ~0.3 pp of FX gains and IT Products). Depreciation is 4.73% of gross block (the Q1FY27 run-rate with DTS and Mindsprint amortisation); capex ₹1,500 cr a year; tax including minorities 23.3%; payout 60% in FY27 and 70% after; no further buybacks or acquisitions. All shares are post-buyback (990.4 cr). Every assumption, with our reasoning, is in the Excel model's Assumptions sheet, which recalculates this report's target price.` },
    { exhibit: { type: 'rows', title: 'Group P&L and cash flow summary (₹ crore)', from: 'FY23', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }, { name: 'EBIT margin (Screener basis)', ref: 'fin.ebitMargin', fmt: 'pct' },
      { name: 'Other income', ref: 'fin.otherIncome' },
      { name: 'Net profit (attributable)', ref: 'fin.pat', hl: true }, { name: 'EPS (₹; FY26 pro-forma)', ref: 'fin.eps', fmt: 'n2' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Dividend per share (₹)', ref: 'fin.dps', fmt: 'n1' }, { name: 'Free cash flow', ref: 'fin.fcf' }, { name: 'Cash & investments (forecasts: net of borrowings)', ref: 'fin.treasury' }, { name: 'ROE', ref: 'fin.roe', fmt: 'pct' },
    ], source: 'Company, Screener.in, GAM Research estimates. Cash is gross in actual years and net of borrowings and leases in forecasts; FY26 is pro-forma for the June-2026 buyback and acquisitions.' } },
    { h: 'Other income: built from the treasury, reconciled to FY26 and the last twelve months' },
    { exhibit: { type: 'table', title: 'Other income build (₹ crore)', head: ['Component', 'FY26 actual', 'TTM to Jun-26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      [`Yield on opening net cash (${ty}%: FY26 income ÷ interest-earning book)`, '–', '–', ...trOpen.map(t => n0(t * ty / 100))],
      ['  memo: opening net cash (cash + investments − borrowings and leases)', '37,051 (reported)', '–', ...trOpen.map(n0)],
      [`Yield on the book funded by borrowings and leases (${ty}% × ₹19,122 cr)`, '–', '–', '1,281', '1,281', '1,281'],
      ['Interest + fair-value gains on investments (actual)', '3,649', '–', '–', '–', '–'],
      ['FX gains (Ind AS books them in other income)', '185', '–', '200', '200', '200'],
      ['Q1FY27 income earned before the June payouts', '–', '–', '314', '–', '–'],
      [`Q1FY27 cash build (net cash ₹${n0(netCashJun26)} cr at Jun-26 vs ₹${n0(netCashPf)} cr pro-forma), 3 quarters`, '–', '–', '191', '–', '–'],
      ['Other (gain on building transfer, associates)', '65', '–', '–', '–', '–'],
      { hl: true, cells: ['**Other income**', `**${n0(A.otherIncome[b])}**`, `**${n0(A.ttm.otherIncome)}**`, '**{{F.otherIncome.0|num}}**', '**{{F.otherIncome.1|num}}**', '**{{F.otherIncome.2|num}}**'] },
    ], source: 'AR FY26 note 23 (finance and other income ₹36,491 mn, FX gains ₹1,853 mn); Q1FY27 IFRS balance sheet; Screener.in (FY26 and TTM); GAM estimates. Interest-earning book excludes ~₹2,160 cr of start-up and associate stakes.' } },
    { callout: `**The reconciliation:** FY27E other income of {{F.otherIncome.0|num}} cr is ~₹${n0(A.ttm.otherIncome - F.otherIncome[0])} cr below the twelve months to Jun-26 (₹${n0(A.ttm.otherIncome)} cr) and ~₹${n0(A.otherIncome[b] - F.otherIncome[0])} cr below FY26 (₹${n0(A.otherIncome[b])} cr). The gap is the ₹19,435 cr that left in June (₹15,000 cr buyback, ~₹4,435 cr of acquisitions): at ${ty}% that is ~₹1,300 cr a year, of which we lose ~₹1,000 cr in FY27 because Q1 still earned on the old balance. From FY28 income rebuilds as cash accumulates (we earn the yield on opening balances only, which leaves out ~₹150 cr a year of in-year accrual). Interest costs (${AS.interest.map(n0).join(' / ')} cr) are modelled separately.` },
    { exhibit: { type: 'table', title: 'GAM vs the street (estimates standing on 30-Sep-2026; EPS on post-buyback shares)', head: ['', 'GAM FY27E', 'Street FY27E', 'GAM FY28E', 'Street FY28E'], rows: [
      ...SB.map(s => [`EPS (₹), ${s.broker} (${s.date.slice(8)}-Jul-26)${/pre-buyback/.test(s.shareBasis || '') ? ' *' : ''}`, '{{F.eps.0|n2}}', n2s(postEq(s, 'FY27E')), '{{F.eps.1|n2}}', n2s(postEq(s, 'FY28E'))]),
      ['IT Services EBIT margin: MOSL / PL / Emkay / Choice / Deven Choksey', `${n1(itsEbit(0))}%`, SB.map(s => n1(s.ebitMargin.FY27E) + '%').join(' / '), `${n1(itsEbit(1))}%`, SB.map(s => n1(s.ebitMargin.FY28E) + '%').join(' / ')],
      ['US$ revenue growth: MOSL / PL / Emkay', `${n1(usdGrowth[0])}%`, [mosl, pl, emkay].map(s => n1(s.usdGrowth.FY27E) + '%').join(' / '), `${n1(usdGrowth[1])}%`, [mosl, pl, emkay].map(s => n1(s.usdGrowth.FY28E) + '%').join(' / ')],
    ], source: 'Broker PDFs (MOSL 16-Jul-2026; PL, Emkay, Choice, Deven Choksey 17-Jul-2026). * MOSL and PL print EPS on ~1,050 cr pre-buyback shares; shown here × 1.06 for comparability. Choice\'s EPS does not reconcile with its own PAT line.' } },
    { callout: `Our FY27E EPS is ${Math.abs(gap(F.eps[0], avg(stEps('FY27E'))))}% ${F.eps[0] >= avg(stEps('FY27E')) ? 'above' : 'below'} the average of these five brokers (post-buyback basis) and FY28E ${Math.abs(gap(F.eps[1], avg(stEps('FY28E'))))}% ${F.eps[1] >= avg(stEps('FY28E')) ? 'above' : 'below'}: our margins are at the low end of the street (no return to the 17-17.5% band) and our other income falls more after the buyback. EPS compounds ~${Math.round(X.epsCagrFwd)}% a year over FY26-29E from the pro-forma ₹${n2s(epsPf26)}. Our target does not depend on beating the street on earnings.` },
  ],
};
function n2s(v) { return v == null ? '–' : (Math.round(v * 100) / 100).toFixed(2); }

module.exports = { forecasts };
