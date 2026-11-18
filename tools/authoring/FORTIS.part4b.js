// Fortis report, part 4b: our forecasts vs the street (segment build, other income, pre-Ind AS view).
const X = require('./FORTIS.ctx');
const { F, A, AS, n0, n1, pc, b, YRS, HS, DG, EL, hospM, diagM, ESOP, postEsopHospM, RENT, preEbitda, preMargin, OI, pl, mosl, shortDate, netOcc, netArpob } = X;

const epsGaps = [F.eps[0] / pl.eps.FY27E, F.eps[0] / mosl.eps.FY27E, F.eps[1] / pl.eps.FY28E, F.eps[1] / mosl.eps.FY28E].map(r => Math.round((1 - r) * 100));
const epsGapLo = Math.min(...epsGaps), epsGapHi = Math.max(...epsGaps);
const gap = (ours, theirs) => `${ours >= theirs ? '+' : '−'}${Math.abs(Math.round((ours / theirs - 1) * 100))}%`;
const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: `Our forecasts: revenue ~14% a year from beds; EPS ~${Math.round((Math.pow(F.eps[2] / A.eps[b], 1 / 3) - 1) * 100)}% a year, ${epsGapLo}-${epsGapHi}% below the street`,
  blocks: [
    { p: `We forecast the hospitals bottom-up (operational beds × occupancy × gross ARPOB × 0.945, by cohort; see Bed pipeline) and Agilus from revenue growth and margin, and deduct the tests Agilus does for Fortis hospitals. Segment margins are company operating EBITDA (before ESOP); the ESOP charge (₹151 / 120 / 100 cr) is deducted separately, so model EBITDA equals Screener's. Depreciation is 3.3% of gross block, finance cost falls as free cash flow repays debt, tax plus minorities is ~26.5%, payout 7%. We model no acquisitions and no IHH equity. Every assumption, with our reasoning, is in the Excel model's Assumptions sheet, which recalculates this report's target price.` },
    { exhibit: { type: 'table', title: 'Segment build (₹ crore)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      { sec: 'Hospitals' },
      ['Revenue', n0(A.sales[b] - 1527 + 172), ...HS.revenue.map(n0)], ['  growth', '+19.1%', ...AS.segments[0].growth.map(g => `+${g}%`)],
      ['  network occupancy / ARPOB (₹ cr)', '68% / 2.51', ...YRS.map((_, i) => `${n1(netOcc[i])}% / ${netArpob[i].toFixed(2)}`)],
      ['Operating EBITDA (before ESOP)', '1,724', ...HS.adjEbitda.map(n0)], ['  margin', '22.2%', ...hospM.map(m => `${n1(m)}%`)],
      ['  margin after ESOP', '22.2%', ...postEsopHospM.map(m => `${n1(m)}%`)],
      { sec: 'Diagnostics (Agilus, gross)' },
      ['Revenue', '1,527', ...DG.revenue.map(n0)], ['Operating EBITDA', '360', ...DG.adjEbitda.map(n0)], ['  margin', '23.6%', ...diagM.map(m => `${n1(m)}%`)],
      { sec: 'Group' },
      ['Inter-segment eliminations', '−172', ...EL.revenue.map(n0)],
      ['Less: ESOP charge', '–', ...ESOP.map(v => `−${v}`)],
      { hl: true, cells: ['**Revenue (model)**', `**${n0(A.sales[b])}**`, '**{{F.sales.0|num}}**', '**{{F.sales.1|num}}**', '**{{F.sales.2|num}}**'] },
      { hl: true, cells: ['**EBITDA after ESOP (model)**', `**${n0(A.ebitda[b])}**`, '**{{F.ebitda.0|num}}**', '**{{F.ebitda.1|num}}**', '**{{F.ebitda.2|num}}**'] },
    ], source: 'Company (FY26); GAM estimates (assumptions.json segments and businessLines)' } },
    { exhibit: { type: 'table', title: 'Other income, built (₹ crore)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ...OI.rows.map(r => [r[0], n1(r[1]), ...r[2].map(v => n0(v))]),
      { hl: true, cells: ['**Other income incl. associates (model)**', `**${n1(OI.fy26)}**`, '**{{F.otherIncome.0|num}}**', '**{{F.otherIncome.1|num}}**', '**{{F.otherIncome.2|num}}**'] },
      ['Memo: exceptional items (Screener books them here)', '−22.2', '0', '0', '0'],
      ['Memo: twelve months to Jun-26, Screener (incl. −₹25 cr exceptional) / before exceptional', `${n0(A.ttm.otherIncome)} / 68`, '', '', ''],
    ], source: 'AR FY26 note 6(xxii) and P&L; quarterly presentations; GAM estimates. Built on gross cash because the model\'s net cash is after debt and leases.' } },
    { exhibit: { type: 'rows', title: 'Group P&L and cash flow summary (₹ crore)', from: 'FY23', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA (after ESOP)', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' },
      { name: 'Other income', ref: 'fin.otherIncome' }, { name: 'Net profit (owners)', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n1' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Capex', ref: 'fin.capex' }, { name: 'Free cash flow', ref: 'fin.fcf' }, { name: 'Cash & investments (forecasts net of debt and leases)', ref: 'fin.treasury' }, { name: 'ROE', ref: 'fin.roe', fmt: 'pct' },
    ], source: 'Company, GAM Research estimates. Cash is gross in actual years and net of borrowings and lease liabilities in forecasts (net debt ₹2,686 cr at Mar-26 on that basis).' } },
    { exhibit: { type: 'table', title: 'Pre-Ind AS view (lease payments deducted)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['EBITDA post-Ind AS (model)', n0(A.ebitda[b]), '{{F.ebitda.0|num}}', '{{F.ebitda.1|num}}', '{{F.ebitda.2|num}}'],
      ['Less: lease payments (FY27-29E = GAM estimate)', n1(RENT.FY26), ...YRS.map(y => n0(RENT[y]))],
      { hl: true, cells: ['**EBITDA pre-Ind AS**', `**${n0(A.ebitda[b] - RENT.FY26)}**`, ...preEbitda.map(v => `**${n0(v)}**`)] },
      ['  margin', `${n1((A.ebitda[b] - RENT.FY26) / A.sales[b] * 100)}%`, ...preMargin.map(v => `${n1(v)}%`)],
    ], source: 'AR FY26 note 10 (lease cash outflow ₹99.6 cr); GAM estimates. The difference is small for Fortis, which owns most of its hospitals.' } },
    { exhibit: { type: 'table', title: 'GAM vs the street (estimates standing on 30-Sep-2026)', head: ['', 'GAM FY27E', 'Street FY27E', 'GAM FY28E', 'Street FY28E'], rows: [
      [`Revenue (₹ cr), PL (${shortDate(pl.date)}) / MOSL (${shortDate(mosl.date)})`, '{{F.sales.0|num}}', `${n0(pl.sales.FY27E)} / ${n0(mosl.sales.FY27E)}`, '{{F.sales.1|num}}', `${n0(pl.sales.FY28E)} / ${n0(mosl.sales.FY28E)}`],
      ['EBITDA after ESOP (₹ cr), PL / MOSL', '{{F.ebitda.0|num}}', `${n0(pl.ebitda.FY27E)} / ${n0(mosl.ebitda.FY27E)}`, '{{F.ebitda.1|num}}', `${n0(pl.ebitda.FY28E)} / ${n0(mosl.ebitda.FY28E)}`],
      ['EBITDA margin, PL / MOSL', '{{F.ebitdaMargin.0|pct}}', `${n1(pl.ebitda.FY27E / pl.sales.FY27E * 100)}% / ${n1(mosl.ebitda.FY27E / mosl.sales.FY27E * 100)}%`, '{{F.ebitdaMargin.1|pct}}', `${n1(pl.ebitda.FY28E / pl.sales.FY28E * 100)}% / ${n1(mosl.ebitda.FY28E / mosl.sales.FY28E * 100)}%`],
      ['EPS (₹), PL / MOSL', '{{F.eps.0|n1}}', `${n1(pl.eps.FY27E)} / ${n1(mosl.eps.FY27E)}`, '{{F.eps.1|n1}}', `${n1(pl.eps.FY28E)} / ${n1(mosl.eps.FY28E)}`],
    ], source: 'PL Q1FY27 note (8-Aug-2026); MOSL notes (8-Aug and 4-Sep-2026). ICICI Securities, Nomura and others: estimates not public. No consensus dated before 30-Sep-2026 was found.' } },
    { callout: `Our revenue is in line with the street (${gap(F.sales[0], pl.sales.FY27E)} vs PL and ${gap(F.sales[0], mosl.sales.FY27E)} vs MOSL for FY27E). The gap is the margin: we assume the hospital margin before ESOP rises to 23.4% by FY28E, not to the ~26% that management's 25%-after-ESOP target implies, so our FY28E EBITDA is ${gap(F.ebitda[1], pl.ebitda.FY28E)} vs PL and ${gap(F.ebitda[1], mosl.ebitda.FY28E)} vs MOSL, and EPS ${gap(F.eps[1], pl.eps.FY28E)} / ${gap(F.eps[1], mosl.eps.FY28E)}. EPS still grows ~${Math.round(X.epsCagrFwd || ((Math.pow(F.eps[2] / A.eps[b], 1 / 3) - 1) * 100))}% a year over FY26-29E as interest falls and Agilus minorities stay small.` },
  ],
};

module.exports = { forecasts };
