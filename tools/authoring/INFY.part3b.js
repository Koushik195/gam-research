// Infosys report, part 3b: our forecasts, the other-income build and GAM vs the street.
const X = require('./INFY.ctx');
const { C, F, A, AS, n0, n1, pc, b, usdTot, usdG, ebitM, br, avgEps, withEps, impliedEps, OI, oiFy26Under, oiTtm, oiTtmUnder, treasuryInc, grossYield, netCashScr, leases, FY26 } = X;
const ar = br('Anand Rathi'), pl = br('Prabhudas Lilladher'), isec = br('ICICI Securities'), nb = br('Nirmal Bang'), mosl = br('Motilal Oswal'), ch = br('Choice Institutional'), one = br('360 ONE Capital');
const gapPct = (g, s) => Math.round((g / s - 1) * 100);

const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: `Our forecasts: ~${n1(X.epsCagrFwd)}% EPS growth a year, more than half of it from the weaker rupee`,
  blocks: [
    { p: `We forecast US$ revenue by vertical (+${n1(usdG[0])}% / +${n1(usdG[1])}% / +${n1(usdG[2])}% in FY27-29E), convert it at ₹95.5 / 97.5 / 99.5 per dollar, and hold the operating (EBIT) margin at ~21% (EBITDA {{F.ebitdaMargin.0|pct}} / {{F.ebitdaMargin.1|pct}} / {{F.ebitdaMargin.2|pct}} after D&A of ~2.6% of revenue). Capex is ~1.5% of revenue; FY27E also carries ~₹4,400 cr for the Optimum and Stratus acquisitions (engine workaround: there is no acquisition line). Tax is 29.6% (guidance 29-30%, incl. minorities); dividends 68% of profit. Every assumption, with our reasoning, is in the Excel model's Assumptions sheet, which recalculates this report's target price.` },
    { exhibit: { type: 'rows', title: 'P&L and cash flow summary (₹ crore)', from: 'FY23', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }, { name: 'EBIT margin (EBITDA less D&A)', ref: 'fin.ebitMargin', fmt: 'pct' },
      { name: 'Other income', ref: 'fin.otherIncome' },
      { name: 'Net profit (attributable)', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n1' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' }, { name: 'DPS (₹)', ref: 'fin.dps', fmt: 'n1' },
      { name: 'Capex (FY27E incl. acquisitions)', ref: 'fin.capex' }, { name: 'Free cash flow', ref: 'fin.fcf' }, { name: 'Cash & investments (forecasts: net of lease liabilities)', ref: 'fin.treasury' }, { name: 'ROE', ref: 'fin.roe', fmt: 'pct' },
    ], source: 'Company, GAM Research estimates. Cash is gross (Screener basis) in actual years and net of lease liabilities in forecasts. FY26 EPS is on the year-end share count (reported basic EPS ₹71.58 on weighted shares).' } },
    { h: 'Other income: built from the treasury, reconciled to FY26 and the last twelve months' },
    { exhibit: { type: 'table', title: 'Other income build (₹ crore)', head: ['', 'FY26 (AR)', 'TTM Jun-26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Opening net cash, Screener basis (cash + investments − leases)', '–', '–', n0(netCashScr), n0(F.treasury[0]), n0(F.treasury[1])],
      ['Treasury income (9.0% on opening net cash)', n0(OI.bankDepositsAndOthers + OI.ncdCpCdGsecFvoci + OI.taxFreeAndGovtBonds + OI.fundGains + OI.fvociGains + OI.taxFreeBondGain), '–', ...[0, 1, 2].map(i => n0(treasuryInc(i)))],
      ['  = yield on average gross cash and investments', '6.7% (company)', '6.8% in Q1FY27', ...[0, 1, 2].map(i => n1(grossYield(i)) + '%')],
      ['Net exchange gains + recurring miscellaneous', n0(OI.fxNet + OI.misc - OI.miscPropertyGain), '–', ...AS.otherIncome.map(n0)],
      ['Interest on tax refunds and property gain (not forecast)', n0(OI.taxRefundInterest + OI.miscPropertyGain), '381 (Q4FY26)', '–', '–', '–'],
      { hl: true, cells: ['**Other income, underlying**', `**${n0(oiFy26Under)}**`, `**${n0(oiTtmUnder)}**`, '**{{F.otherIncome.0|num}}**', '**{{F.otherIncome.1|num}}**', '**{{F.otherIncome.2|num}}**'] },
      ['Memo: as reported by Screener (after the ₹1,289 cr Labour Codes charge)', '3,033', n0(oiTtm), '', '', ''],
    ], source: 'AR FY26 note 2.19; Screener.in quarterly results; CFO commentary (yield on cash 6.7% FY26, 6.8% Q1FY27); GAM Research' } },
    { p: `**How it reconciles.** FY26 other income was ₹${n0(OI.total)} cr, or ₹${n0(oiFy26Under)} cr without tax-refund interest and the property gain. The twelve months to Jun-26 on Screener show ₹${n0(oiTtm)} cr, but that nets the Labour Codes charge; adding it back and removing Q4's ₹381 cr of tax-refund interest gives ₹${n0(oiTtmUnder)} cr. Our FY27E of {{F.otherIncome.0|num}} cr is in line: the cash pile was cut by the ₹18,000 cr buyback in December 2025 and the Optimum/Stratus purchases in Q1FY27, then rebuilds. FY28-29E rise because we keep the buyback share of the payout policy in cash (it earns ~6.7%); if Infosys buys back shares instead, interest falls but the share count falls more, which would add ~1% a year to EPS.` },
    { exhibit: { type: 'table', title: 'GAM vs the street (estimates standing on 30-Sep-2026)', head: ['', 'GAM FY27E', 'Street FY27E', 'GAM FY28E', 'Street FY28E'], rows: [
      ...[ar, pl, isec, nb].map(s => [`EPS (₹), ${s.broker} (${X.shortDate(s.date)})`, '{{F.eps.0|n1}}', n1(s.eps.FY27E), '{{F.eps.1|n1}}', n1(s.eps.FY28E)]),
      ['EPS implied by target ÷ multiple: MOSL / Choice / 360 ONE', '{{F.eps.0|n1}}', '–', '{{F.eps.1|n1}}', [mosl, ch, one].map(s => n1(impliedEps(s))).join(' / ')],
      { hl: true, cells: ['**EPS (₹), average of the four with published EPS**', '**{{F.eps.0|n1}}**', `**${n1(avgEps('FY27E'))}**`, '**{{F.eps.1|n1}}**', `**${n1(avgEps('FY28E'))}**`] },
      ['US$ revenue (mn), Anand Rathi / PL', n0(usdTot[0]), `${n0(ar.usdRev.FY27E)} / ${n0(pl.usdRev.FY27E)}`, n0(usdTot[1]), `${n0(ar.usdRev.FY28E)} / ${n0(pl.usdRev.FY28E)}`],
      ['EBIT margin, Anand Rathi / PL / Nirmal Bang', n1(ebitM(0)) + '%', [ar, pl, nb].map(s => n1(s.ebitMargin.FY27E) + '%').join(' / '), n1(ebitM(1)) + '%', [ar, pl, nb].map(s => n1(s.ebitMargin.FY28E) + '%').join(' / ')],
      ['Revenue (₹ cr), PL / Nirmal Bang', '{{F.sales.0|num}}', `${n0(pl.salesCr.FY27E)} / ${n0(nb.salesCr.FY27E)}`, '{{F.sales.1|num}}', `${n0(pl.salesCr.FY28E)} / ${n0(nb.salesCr.FY28E)}`],
    ], source: 'Anand Rathi, PL and Nirmal Bang result updates (PDFs, 24-Jul-2026); ICICI Securities via DSIJ (24-Jul-2026); Business Today and Trendlyne for MOSL, Choice and 360 ONE targets and multiples. A post-results consensus dated before 30-Sep-2026 was not found.' } },
    { callout: `Our FY27E EPS is ${Math.abs(gapPct(F.eps[0], avgEps('FY27E')))}% ${F.eps[0] >= avgEps('FY27E') ? 'above' : 'below'} the average of the four brokers with published EPS and FY28E ${Math.abs(gapPct(F.eps[1], avgEps('FY28E')))}% ${F.eps[1] >= avgEps('FY28E') ? 'above' : 'below'}: close to Anand Rathi and PL, well above Nirmal Bang (which models a ~19.8% margin) and ICICI Securities. Our US$ growth is in line; the difference is mostly the rupee (₹95.5 and 97.5 vs PL's implied ~93.5 and 95) and the treasury income we keep in the numbers. Our EPS compounds ~${Math.round(X.epsCagrFwd)}% a year over FY26-29E, of which ~4 points come from the weaker rupee (rupee revenue grows ~6.9% a year against ~2.8% in US$).` },
  ],
};

module.exports = { forecasts };
