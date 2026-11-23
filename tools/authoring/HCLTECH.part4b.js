// HCL Technologies report, part 4b: our forecasts (USD build, segments, P&L, other-income build) vs the street.
const X = require('./HCLTECH.ctx');
const { F, A, AS, UB, KEYS, usd, usdTotal, usdGrowth, ccGrowth, n0, n1, pc, b, A26, OI26, oiTreasury, netTreasury0, ttmOiExLc, withEps, avgEps } = X;
const NM = { itbs: 'IT & Business Services', ers: 'Engineering & R&D', sw: 'HCLSoftware', elim: 'Inter-segment' };
const g = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const segRow = (k, field, hist) => [field === 'revenue' ? 'Revenue' : 'EBIT', n0(hist), ...[0, 1, 2].map(i => `{{F.seg.${k}.${field}.${i}|num}}`)];
const gap = (a, s) => (a / s - 1) * 100;
const vs = (a, s) => (Math.abs(gap(a, s)) < 1 ? 'within 1% of' : `${Math.abs(Math.round(gap(a, s)))}% ${a >= s ? 'above' : 'below'}`);

const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: ~3-4% dollar growth, flat margins, EPS +18% in FY27 on the rupee and ~5% after',
  blocks: [
    { p: `We build revenue in US dollars, segment by segment: constant-currency growth, plus cross-currency moves and acquisitions (Jaspersoft), converted at ₹${UB.rate[0]} per US$ in FY27E (Q1 actual 94.73, then the 30-Sep spot of 95.81) and ₹${UB.rate[1]} in FY28-29E (no further depreciation). Each segment earns an EBIT margin as HCLTech reports it; because the model starts from EBITDA, D&A is added back and then charged on gross block, so group EBIT equals the sum of segment EBIT (checked in our files). Other income is built from treasury yield on cash plus recurring items; tax ${AS.taxRate[0]}%; payout ${AS.payout[0]}%. Capex includes the FY27 acquisitions, the Sarvam stake and ₹3,500 cr of data-centre spend over FY27-29, because they consume cash. Every assumption, with our reasoning, is in the Excel model's Assumptions sheet.` },
    { exhibit: { type: 'table', title: 'Revenue build in US dollars (US$ m)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ...KEYS.map(k => [NM[k], n0(UB.segments[k].baseUsd), ...[0, 1, 2].map(i => `${n0(usd[k][i])} (${g(UB.segments[k].usdGrowth[i])})`)]),
      { hl: true, cells: ['**Total US$ revenue**', `**${n0(A26.usdRev)}**`, ...[0, 1, 2].map(i => `**${n0(usdTotal[i])} (${g(usdGrowth[i])})**`)] },
      ['  of which constant currency (incl. acquisitions)', '+3.9%', ...ccGrowth.map(v => g(v))],
      ['INR per US$ (average)', `${UB.rateFY26}`, ...UB.rate.map(r => r.toFixed(2))],
      { hl: true, cells: ['**Revenue, ₹ cr (model)**', `**${n0(A.sales[b])}**`, '**{{F.sales.0|num}}**', '**{{F.sales.1|num}}**', '**{{F.sales.2|num}}**'] },
    ], source: 'FY26: AR FY26 segment note at the FY26 implied rate (Rs130,144 cr / US$14,664 m = 88.75); segment US$ split derived. GAM estimates. The HPE Telco Solutions acquisition (closed Aug-2026) is not included.' } },
    { exhibit: { type: 'table', title: 'Segment forecasts (₹ crore)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      { sec: 'IT & Business Services' }, segRow('itbs', 'revenue', A26.itbsRev), segRow('itbs', 'adjEbitda', A26.itbsEbit), ['Margin', `${n1(A26.itbsMarginPct)}%`, ...AS.segments[0].marginPct.map(x => `${x.toFixed(1)}%`)],
      { sec: 'Engineering & R&D Services' }, segRow('ers', 'revenue', A26.ersRev), segRow('ers', 'adjEbitda', A26.ersEbit), ['Margin', `${n1(A26.ersMarginPct)}%`, ...AS.segments[1].marginPct.map(x => `${x.toFixed(1)}%`)],
      { sec: 'HCLSoftware' }, segRow('sw', 'revenue', A26.swRev), segRow('sw', 'adjEbitda', A26.swEbit), ['Margin', `${n1(A26.swMarginPct)}%`, ...AS.segments[2].marginPct.map(x => `${x.toFixed(1)}%`)],
      ['Inter-segment elimination (revenue)', n0(A26.elimRev), '{{F.seg.elim.revenue.0|num}}', '{{F.seg.elim.revenue.1|num}}', '{{F.seg.elim.revenue.2|num}}'],
      { hl: true, cells: ['**Group EBIT (sum of segments)**', `**${n0(A26.segEbit)}**`, '**{{F.ebit.0|num}}**', '**{{F.ebit.1|num}}**', '**{{F.ebit.2|num}}**'] },
      ['EBIT margin', `${n1(A26.ebitMarginPct)}%`, ...X.ebitM.map(v => `${n1(v)}%`)],
      ['Add back D&A', n0(A.dep[b]), '{{F.dep.0|num}}', '{{F.dep.1|num}}', '{{F.dep.2|num}}'],
      ['EBITDA (margin)', `${n0(A.ebitda[b])} (${n1(A.ebitdaMargin[b])}%)`, '{{F.ebitda.0|num}} ({{F.ebitdaMargin.0|pct}})', '{{F.ebitda.1|num}} ({{F.ebitdaMargin.1|pct}})', '{{F.ebitda.2|num}} ({{F.ebitdaMargin.2|pct}})'],
    ], source: 'AR FY26 (FY26 segment results exclude the Rs956 cr Labour Codes charge); GAM Research estimates' } },
    { exhibit: { type: 'rows', title: 'Group P&L and cash flow summary (₹ crore)', from: 'FY23', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }, { name: 'EBIT margin', ref: 'fin.ebitMargin', fmt: 'pct' },
      { name: 'Other income', ref: 'fin.otherIncome' },
      { name: 'Net profit (attributable)', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n1' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Capex (forecasts incl. acquisitions)', ref: 'fin.capex' }, { name: 'Free cash flow', ref: 'fin.fcf' }, { name: 'Cash & investments (forecasts: net of borrowings, incl. deposits)', ref: 'fin.treasury' }, { name: 'ROE', ref: 'fin.roe', fmt: 'pct' },
    ], source: 'Company, GAM Research estimates. FY26 other income is net of the Rs956 cr Labour Codes charge (Screener). Cash is gross in actual years and net of borrowings (incl. leases) in forecasts. DPS forecast: Rs' + F.dps.map(d => n1(d)).join(' / ') + ' (90% payout; FY26 actual Rs60).' } },
    { exhibit: { type: 'table', title: 'Other income: built, not plugged (₹ crore)', head: ['', 'FY26 (company)', 'TTM Jun-26 (Screener)', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Treasury income (interest, fund gains)', n0(OI26.treasury), '–', ...oiTreasury.map(n0)],
      ['  yield on opening net treasury', '~6.2%', '', ...AS.treasuryYield.map(y => `${y}%`)],
      ['Recurring non-treasury items', n0(OI26.nonTreasury), '–', ...AS.otherIncome.map(n0)],
      ['Forex (mostly hedge settlements)', n0(OI26.fx), '–', '0', '0', '0'],
      ['Labour Codes charge (Screener nets it here)', '−956', '−956', '–', '–', '–'],
      { hl: true, cells: ['**Other income, Screener basis**', `**${n0(A.otherIncome[b])}**`, `**${n0(ttmOiExLc - 956)}**`, '**{{F.otherIncome.0|num}}**', '**{{F.otherIncome.1|num}}**', '**{{F.otherIncome.2|num}}**'] },
      ['Memo: excluding the Labour Codes charge', n0(OI26.total), n0(ttmOiExLc), '', '', ''],
    ], source: `AR FY26 note 3.20; Screener.in quarters; GAM estimates. Opening net treasury Rs${n0(netTreasury0)} cr at Mar-26 (Screener cash, investments and Rs3,012 cr of long-term deposits, less Rs5,215 cr of borrowings incl. leases).` } },
    { callout: `**Reconciliation:** FY27E other income of ~₹{{F.otherIncome.0|num}} cr is below FY26's ₹${n0(OI26.total + 241)} cr before forex because cash is lower: ₹6,492 cr of dividends and ₹1,427 cr for Sarvam left in Q1 and ~₹3,700 cr for Jaspersoft and HPE Telco in Q2 (gross cash ₹33,447 cr at Mar-26, ₹27,058 cr at Jun-26), and deposit yields fell. It is close to the ₹${n0(ttmOiExLc)} cr of the twelve months to Jun-26 (which includes forex losses). We assume zero forex; Sarvam's equity-accounted result is unknown and left out.` },
    { exhibit: { type: 'table', title: 'GAM vs the street (estimates standing on 30-Sep-2026)', head: ['', 'GAM FY27E', 'Street FY27E', 'GAM FY28E', 'Street FY28E'], rows: [
      ...withEps.map(s => [`EPS (₹), ${s.broker} (${X.shortDate(s.date)})`, '{{F.eps.0|n1}}', n1(s.eps.FY27E), '{{F.eps.1|n1}}', n1(s.eps.FY28E)]),
      { hl: true, cells: ['**EPS (₹), average of the five**', '**{{F.eps.0|n1}}**', `**${n1(avgEps('FY27E'))}**`, '**{{F.eps.1|n1}}**', `**${n1(avgEps('FY28E'))}**`] },
      ['Revenue (₹ cr), MOSL / Equirus / PL / I-Sec', '{{F.sales.0|num}}', withEps.filter(s => s.sales).map(s => n0(s.sales.FY27E)).join(' / '), '{{F.sales.1|num}}', withEps.filter(s => s.sales).map(s => n0(s.sales.FY28E)).join(' / ')],
      ['EBIT margin, MOSL / I-Sec', `${n1(X.ebitM[0])}%`, '17.8% / 17.5%', `${n1(X.ebitM[1])}%`, '17.9% / 17.9%'],
      ['US$ revenue (US$ m), MOSL', n0(usdTotal[0]), '15,054', n0(usdTotal[1]), '15,757'],
    ], source: 'Motilal Oswal (13-Jul-2026), Equirus, PL Capital, ICICI Securities (14-Jul-2026) notes; Geojit (19-Aug-2026, adjusted EPS). A post-results consensus dated before 30-Sep-2026 was not found.' } },
    { callout: `Our EPS is ${vs(F.eps[0], avgEps('FY27E'))} the five-broker average in FY27E and ${vs(F.eps[1], avgEps('FY28E'))} it in FY28E. We are a little higher on rupee revenue (₹95.5 per US$ vs Motilal Oswal's 94.5) and a little lower on dollar growth in FY28 (+${n1(usdGrowth[1])}% vs MOSL's +4.7%). The disagreement with the street is about the multiple, not the earnings. EPS compounds ~${Math.round(X.epsCagrFwd)}% a year over FY26-29E from the ₹64.0 normalised base, but only ~${Math.round(X.epsCagr2729)}% a year after FY27's rupee boost.` },
  ],
};

module.exports = { forecasts };
