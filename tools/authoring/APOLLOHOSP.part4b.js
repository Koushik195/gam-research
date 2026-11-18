// Apollo report, part 4b: our forecasts (bed build, segment build, other income built, P&L, pre-Ind AS view, vs street).
const X = require('./APOLLOHOSP.ctx');
const { C, F, A, AS, n0, n1, pc, Q1, b, YRS, SEG, BH, disch, ipRev, netRev, arpob, RENT, preEbitda, preMargin, pl, isec, shortDate, ann } = X;
const f26 = ann('FY26');
const g3 = arr => arr.map(v => n0(v));
const mg = k => YRS.map((_, i) => `${n1(SEG[k].adjEbitda[i] / SEG[k].revenue[i] * 100)}%`);
const gapTxt = (g, s) => { const v = Math.round((g / s - 1) * 100); return `${v >= 0 ? '+' : '−'}${Math.abs(v)}%`; };
const OI = { treasury: [128, 129, 127], recurring: [45, 48, 49], assoc: [52, 58, 64], open: [2336, 2350, 2300] };
YRS.forEach((y, i) => { const s = OI.treasury[i] + OI.recurring[i] + OI.assoc[i]; if (Math.abs(s - F.otherIncome[i]) > 1) throw new Error(`other income build ${y}: ${s} vs model ${F.otherIncome[i]}`); });

const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: revenue ~16% a year, EBITDA ~20%, EPS ~23%, below the street on hospital margins',
  blocks: [
    { p: 'We forecast each reported business separately and add them up. Hospital revenue comes from a bed build (average operating beds × occupancy × 365 ÷ length of stay = discharges; × revenue per in-patient; grossed up for out-patients and scaled from the network, which includes Delhi, to the consolidated hospitals); the authoring script checks the build equals model revenue. HealthCo and AHLL run on revenue growth and margins. EBITDA is post-Ind AS (rent excluded), as reported, so lease liabilities count as debt and new leases are in capex. Depreciation is 5.0% of gross block, finance cost rises with leases and capex, tax plus minorities is 27.7%, payout 15%. Every assumption, with our reasoning, is in the Excel model\'s Assumptions sheet, which recalculates this report\'s target price.' },
    { exhibit: { type: 'table', title: 'Hospital bed build (checked to equal model hospital revenue)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Average operating beds (network incl. Delhi)', '~8,071', ...g3(BH.avgBeds)],
      ['Occupancy', `${f26.occupancyPct}% (67.7% on average beds)`, ...BH.occupancyPct.map(v => `${v}%`)],
      ['ALOS (days)', String(f26.alos), ...BH.alos.map(v => v.toFixed(2))],
      ['= discharges (\'000)', n0(f26.dischargesK), ...disch.map(v => n0(v / 1000))],
      ['× revenue per in-patient (₹)', n0(f26.arpp), ...g3(BH.arpp)],
      ['  memo: revenue per occupied bed-day (₹)', n0(f26.arpp / f26.alos), ...g3(arpob)],
      ['= in-patient revenue (₹ cr)', n0(f26.dischargesK * f26.arpp / 1e4), ...g3(ipRev)],
      ['÷ in-patient share → network net revenue (₹ cr)', `${n0(f26.netRevNetwork)} (81.7%)`, ...YRS.map((_, i) => `${n0(netRev[i])} (${BH.ipSharePct[i]}%)`)],
      ['× consolidated share (excl. Delhi)', '91.4%', ...BH.consSharePct.map(v => `${v}%`)],
      { hl: true, cells: ['**Hospital revenue (model, ₹ cr)**', `**${n0(f26.hcsRev)}**`, ...SEG.hcs.revenue.map(v => `**${n0(v)}**`)] },
      ['  growth', '+13%', ...YRS.map((_, i) => pc(AS.segments[0].growth[i]))],
    ], source: 'Company KPIs (FY26, Q1FY27); GAM estimates (assumptions.json businessLines)' } },
    { exhibit: { type: 'table', title: 'Segment build (₹ crore)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      { sec: 'Hospitals' }, ['Revenue', n0(f26.hcsRev), ...g3(SEG.hcs.revenue)], ['EBITDA margin', '24.4%', ...mg('hcs')], ['EBITDA', n0(f26.hcsEbitda), ...g3(SEG.hcs.adjEbitda)],
      { sec: 'Apollo HealthCo (after 24/7 cost and ESOP)' }, ['Revenue', n0(f26.hcoRev), ...g3(SEG.hco.revenue)], ['EBITDA margin', '4.5%', ...mg('hco')], ['EBITDA', n0(f26.hcoEbitda), ...g3(SEG.hco.adjEbitda)],
      { sec: 'AHLL (Cradle and fertility deconsolidated from Q3FY27)' }, ['Revenue', n0(f26.ahllRev), ...g3(SEG.ahll.revenue)], ['EBITDA margin', '11.4%', ...mg('ahll')], ['EBITDA', n0(f26.ahllEbitda), ...g3(SEG.ahll.adjEbitda)],
      { hl: true, cells: ['**Group EBITDA (post-Ind AS)**', `**${n0(f26.consEbitda)}**`, '**{{F.ebitda.0|num}}**', '**{{F.ebitda.1|num}}**', '**{{F.ebitda.2|num}}**'] },
    ], source: 'Company (FY26); GAM estimates. FY26 group EBITDA is the company figure (Screener ₹3,779 cr).' } },
    { exhibit: { type: 'table', title: 'Other income, built (₹ crore; includes share of associates, as Screener does)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Treasury: deposit interest + fund gains', '139.0', ...OI.treasury.map(String)],
      ['  basis: 5.5% × opening company treasury', '~5.3% on ~₹2,600 cr', ...OI.open.map(v => `₹${n0(v)} cr`)],
      ['Recurring: other interest, dividends, misc., write-backs', '50.7', ...OI.recurring.map(String)],
      ['Share of associates (Delhi hospital, FHPL, others)', '44.9', ...OI.assoc.map(String)],
      ['One-offs (PPE gains); labour-code exceptional and reclassification (Screener)', '1.9; −29.2', '0', '0', '0'],
      { hl: true, cells: ['**Other income (model)**', `**${n0(A.otherIncome[b])}**`, '**{{F.otherIncome.0|num}}**', '**{{F.otherIncome.1|num}}**', '**{{F.otherIncome.2|num}}**'] },
      ['Memo: twelve months to Jun-26 (patched Screener) / Q1FY27', `${n0(A.ttm.otherIncome)} / ${n1(Q1.otherIncome + Q1.associates)}`, '', '', ''],
    ], source: 'AR FY26 notes 10 and 32; company treasury (Mar-26 ₹2,336 cr; Jun-26 ₹2,496 cr); GAM estimates. Built on gross treasury because the model\'s net cash is after leases and CCPS.' } },
    { exhibit: { type: 'rows', title: 'Group P&L and cash flow summary (₹ crore)', from: 'FY23', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA (post-Ind AS)', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' },
      { name: 'Other income (incl. associates)', ref: 'fin.otherIncome' }, { name: 'Net profit (owners)', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n1' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Capex (forecasts incl. new leases)', ref: 'fin.capex' }, { name: 'Free cash flow', ref: 'fin.fcf' }, { name: 'Cash & investments (forecasts net of leases and CCPS)', ref: 'fin.treasury' }, { name: 'ROE', ref: 'fin.roe', fmt: 'pct' },
    ], source: 'Company, GAM Research estimates. Cash is gross in actual years and net of all borrowings (bank debt, lease liabilities and CCPS; ₹8,493 cr at Mar-26) in forecasts.' } },
    { exhibit: { type: 'table', title: 'Pre-Ind AS view (rent deducted)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['EBITDA post-Ind AS', n0(f26.consEbitda), '{{F.ebitda.0|num}}', '{{F.ebitda.1|num}}', '{{F.ebitda.2|num}}'],
      ['Less: lease payments (FY27-29E = GAM estimate)', n0(RENT.FY26), ...YRS.map(y => n0(RENT[y]))],
      { hl: true, cells: ['**EBITDA pre-Ind AS**', `**${n0(f26.consEbitda - RENT.FY26)}**`, ...preEbitda.map(v => `**${n0(v)}**`)] },
      ['  margin', `${n1((f26.consEbitda - RENT.FY26) / f26.consRev * 100)}%`, ...preMargin.map(v => `${n1(v)}%`)],
    ], source: 'AR FY26 note 23 (lease payments ₹290.7 cr); Q1FY27 lease rent ₹84.7 cr; GAM estimates' } },
    { exhibit: { type: 'table', title: 'GAM vs the street (estimates standing on 30-Sep-2026)', head: ['', 'GAM FY27E', 'Street FY27E', 'GAM FY28E', 'Street FY28E'], rows: [
      [`EPS (₹): PL (${shortDate(pl.date)}) / ICICI Securities (${shortDate(isec.date)})`, '{{F.eps.0|n1}}', `${n1(pl.eps.FY27E)} / ${n1(isec.eps.FY27E)}`, '{{F.eps.1|n1}}', `${n1(pl.eps.FY28E)} / ${n1(isec.eps.FY28E)}`],
      ['Revenue (₹ cr): PL / ICICI', '{{F.sales.0|num}}', '29,666 / 29,756', '{{F.sales.1|num}}', '33,805 / 34,361'],
      ['EBITDA (₹ cr): PL / ICICI', '{{F.ebitda.0|num}}', `${n0(pl.ebitda.FY27E)} / ${n0(isec.ebitda.FY27E)}`, '{{F.ebitda.1|num}}', `${n0(pl.ebitda.FY28E)} / ${n0(isec.ebitda.FY28E)}`],
      ['EBITDA margin: PL / ICICI', '{{F.ebitdaMargin.0|pct}}', '16.2% / 15.6%', '{{F.ebitdaMargin.1|pct}}', '17.4% / 16.2%'],
    ], source: 'PL Q1FY27 note (14-Aug-2026, PDF); ICICI Direct Q1FY27 note (14-Aug-2026, PDF). No consensus dated before 30-Sep-2026 was found.' } },
    { callout: `Our revenue is in line with the street; the gap is margin. We hold the hospital margin at ${mg('hcs')[0]}-${mg('hcs')[2]} because Gurgaon and the other new hospitals lose money into FY28, and we give HealthCo slower margin gains than management's NewCo target. So our EPS is ${gapTxt(F.eps[0], pl.eps.FY27E)} vs PL and ${gapTxt(F.eps[0], isec.eps.FY27E)} vs ICICI for FY27, and ${gapTxt(F.eps[1], pl.eps.FY28E)} / ${gapTxt(F.eps[1], isec.eps.FY28E)} for FY28. EPS still grows ~${Math.round(X.epsCagrFwd)}% a year over FY26-29E and EBITDA ~${Math.round(X.ebitdaCagrFwd)}%.` },
  ],
};

module.exports = { forecasts };
