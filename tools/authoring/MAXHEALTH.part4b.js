// Max Healthcare report, part 4b: our forecasts vs the street (bed build, other income build, P&L summary).
const X = require('./MAXHEALTH.ctx');
const { C, F, A, AS, n0, n1, NP, AK, b, YRS, NW, BL, obd, hospGross, netGross, netNet, consRev, BEDS26, OBD26, netEqEbitda, CONS_TO_NET, pl, mosl, shortDate, epsAdj26 } = X;
const OB = AS.otherIncomeBuild, OI = C.otherIncomeFy26;
const g3 = arr => arr.map(v => n0(v));
const gapTxt = (g, ...xs) => { const v = xs.filter(Boolean).map(x => Math.round((g / x - 1) * 100)); const lo = Math.min(...v), hi = Math.max(...v); return lo === hi ? `${lo >= 0 ? '+' : '−'}${Math.abs(lo)}%` : `${lo >= 0 ? '+' : '−'}${Math.abs(lo)}% to ${hi >= 0 ? '+' : '−'}${Math.abs(hi)}%`; };

const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: revenue ~17% a year from new beds and price; EPS ~15% a year as depreciation and interest absorb part of the growth',
  blocks: [
    { p: `We forecast Network hospital revenue bottom-up (average operational beds × 365 × occupancy × ARPOB), add Max Lab, convert gross to net revenue and take MHIL's consolidated share of the Network, and run the model on the resulting growth rate (the authoring script checks the build equals model revenue). EBITDA is MHIL consolidated on Screener's basis (after ESOP cost, post-Ind AS 116), so lease liabilities count as debt and new leases are added to capex. Capex includes the ₹386 cr paid for Kalinga and YPPL, the company's project outflow estimate (which includes funding of partner-society projects), routine capex and new leases. Depreciation is ${AS.depRateOnGrossBlock}% of gross block, tax plus minorities ${AS.taxRate[0]}%, payout ${AS.payout[0]}%. Every assumption, with our reasoning, is in the Excel model's Assumptions sheet, which recalculates this report's target price.` },
    { exhibit: { type: 'table', title: 'Bed build (₹ crore; checked to sum to model revenue)', head: ['', 'FY26 (actual / derived)', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Average operational beds', n0(BEDS26), ...g3(NW.avgOpBeds)],
      ['× 365 × occupancy', `${AK[3].occupancyPct}%`, ...NW.occupancyPct.map(v => `${v}%`)],
      ['= occupied bed-days (lakh)', n1(OBD26 / 1e5), ...obd.map(v => n1(v / 1e5))],
      ['× ARPOB (₹)', n0(AK[3].arpob), ...g3(NW.arpob)],
      ['= Network hospital gross revenue', n0(NP.FY26.gross - AK[3].maxLabNetRev), ...g3(hospGross)],
      ['+ Max Lab', n0(AK[3].maxLabNetRev), ...g3(BL.maxLab)],
      ['= Network gross revenue', n0(NP.FY26.gross), ...g3(netGross)],
      ['× net/gross', (NP.FY26.net / NP.FY26.gross).toFixed(3), ...BL.grossToNet.map(v => v.toFixed(3))],
      ['= Network net revenue', n0(NP.FY26.net), ...g3(netNet)],
      ['× MHIL consolidated share', (A.sales[b] / NP.FY26.net).toFixed(3), ...BL.consShare.map(v => v.toFixed(3))],
      { hl: true, cells: ['**= Revenue, MHIL consolidated (model)**', `**${n0(A.sales[b])}**`, '**{{F.sales.0|num}}**', '**{{F.sales.1|num}}**', '**{{F.sales.2|num}}**'] },
    ], source: 'Company KPIs (FY26); GAM estimates (assumptions.json businessLines)' } },
    { exhibit: { type: 'table', title: 'Other income, built (₹ crore)', head: ['', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Interest on bank deposits (treasury; 4.5% on average cash)', n1(OI.fy25.bankDepositInterest), n1(OI.bankDepositInterest), ...OB.treasury.map(String)],
      ['Interest on loans to partner societies (9.25%)', n1(OI.fy25.phfLoanInterest), n1(OI.phfLoanInterest), ...OB.phfLoans.map(String)],
      ['Recurring other (write-backs, unwinding, EPCG, tax-refund interest, other)', n1(OI.fy25.total - OI.fy25.bankDepositInterest - OI.fy25.phfLoanInterest), n1(OI.total - OI.bankDepositInterest - OI.phfLoanInterest - OI.contingentFvGain - OI.assetSaleGain - OI.leaseModification), ...OB.recurring.map(String)],
      ['One-offs (contingent-consideration gain, asset sales, lease changes)', '–', n1(OI.contingentFvGain + OI.assetSaleGain + OI.leaseModification), '0', '0', '0'],
      { hl: true, cells: ['**Other income before exceptional items**', `**${n1(OI.fy25.total)}**`, `**${n1(OI.total)}**`, '**{{F.otherIncome.0|num}}**', '**{{F.otherIncome.1|num}}**', '**{{F.otherIncome.2|num}}**'] },
      ['Memo: twelve months to Jun-26 (Screener, before exceptional items)', '', '166.6', '', '', ''],
    ], source: 'AR FY26 note 28; Screener quarterly results; GAM estimates. Screener\'s FY26 "Other Income" (₹114 cr) is net of ₹48 cr of exceptional items.' } },
    { exhibit: { type: 'rows', title: 'Group P&L and cash flow summary (₹ crore, MHIL consolidated)', from: 'FY23', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA (post-Ind AS)', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' },
      { name: 'Other income', ref: 'fin.otherIncome' }, { name: 'Net profit', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n1' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Capex (forecasts incl. acquisitions, PHF funding, leases)', ref: 'fin.capex' }, { name: 'Free cash flow', ref: 'fin.fcf' }, { name: 'Cash & investments (forecasts: net of debt and leases)', ref: 'fin.treasury' }, { name: 'ROE', ref: 'fin.roe', fmt: 'pct' },
    ], source: 'Company, GAM Research estimates. Cash is gross in actual years and net of borrowings and lease liabilities in forecasts.' } },
    { exhibit: { type: 'table', title: 'GAM vs the street (estimates standing on 30-Sep-2026; street = Network basis)', head: ['', 'GAM FY27E', 'PL / MOSL FY27E', 'GAM FY28E', 'PL / MOSL FY28E'], rows: [
      ['Network net revenue (₹ cr)', n0(netNet[0]), `${n0(pl.sales.FY27E / 10)} / ${n0(mosl.sales.FY27E / 10)}`, n0(netNet[1]), `${n0(pl.sales.FY28E / 10)} / ${n0(mosl.sales.FY28E / 10)}`],
      [`Network EBITDA (₹ cr; GAM = consolidated ÷ ${n1(CONS_TO_NET * 100)}%)`, n0(netEqEbitda[0]), `${n0(pl.ebitda.FY27E / 10)} / ${n0(mosl.ebitda.FY27E / 10)}`, n0(netEqEbitda[1]), `${n0(pl.ebitda.FY28E / 10)} / ${n0(mosl.ebitda.FY28E / 10)}`],
      ['Consolidated EBITDA, GAM (₹ cr)', '{{F.ebitda.0|num}}', '–', '{{F.ebitda.1|num}}', '–'],
      ['EPS (₹): GAM consolidated; street Network', '{{F.eps.0|n1}}', `${n1(pl.eps.FY27E)} / ${n1(mosl.eps.FY27E)}`, '{{F.eps.1|n1}}', `${n1(pl.eps.FY28E)} / ${n1(mosl.eps.FY28E)}`],
    ], source: `PL Q1FY27 note (${shortDate(pl.date)}); MOSL 1QFY27 update (${shortDate(mosl.date)}); GAM. No dated consensus EPS before 30-Sep-2026 was found.` } },
    { callout: `On revenue and EBITDA we are in line with the street once both are on the Network basis (EBITDA ${gapTxt(netEqEbitda[0], pl.ebitda.FY27E / 10, mosl.ebitda.FY27E / 10)} for FY27E and ${gapTxt(netEqEbitda[1], pl.ebitda.FY28E / 10, mosl.ebitda.FY28E / 10)} for FY28E). Our FY28E EPS is ${[pl.eps.FY28E, mosl.eps.FY28E].map(x => Math.round((1 - F.eps[1] / x) * 100)).sort((p, q) => p - q).filter((v, i, arr) => arr.indexOf(v) === i).join('-')}% below the street for three reasons: brokers divide **Network** profit by MHIL's shares (the partner societies added ₹174 cr, ~₹1.8 a share, in FY26 and more as Max Smart's tower fills); they use a 20-23% tax rate (Network, where the societies pay little tax) against our ${AS.taxRate[0]}% for MHIL (Q1FY27: 26%); and our capex, and so depreciation and interest, is higher. On our numbers EPS grows ~${Math.round(X.epsCagrAdj)}% a year over FY26-29E from ₹${n1(epsAdj26)} before one-offs, and EBITDA ~${Math.round(X.ebitdaCagrFwd)}%.` },
  ],
};

module.exports = { forecasts };
