// Piramal Pharma report, part 5: our forecasts vs the street (incl. the other-income build) and the street view.
// The valuation chapter is in part5v / part5b.
const X = require('./PPLPHARMA.ctx');
const { D, F, V, A, AS, BL, LINES, LEB, n0, n1, rup, shortDate, b, price, OB, OI_BUILD, OIN, coOI26, coOI25, assoc26, assoc25, ttmCoOI, ttmAssoc, JVPAT, ICICI_EST, postQ1, medTp, avgTp, mosl, YRS, intRate } = X;
const L = k => LINES[k].map(n0);

const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: EBITDA +60% by FY28E, but EPS only ₹{{F.eps.1|n1}}; below the bulls on margin and well below them on tax',
  blocks: [
    { p: `We forecast revenue and EBITDA from a three-business build (CDMO, CHG, PCH, less eliminations) that sums to the model. Revenue grows ${n1(AS.revenueGrowth[0])}% / ${n1(AS.revenueGrowth[1])}% / ${n1(AS.revenueGrowth[2])}% (FY27-29E) and the EBITDA margin before other income rises from 10.4% (FY26) to ${n1(AS.ebitdaMargin[0])}% / ${n1(AS.ebitdaMargin[1])}% / ${n1(AS.ebitdaMargin[2])}%. Depreciation rises to ~₹${n0(F.dep[2])} cr, interest stays at ₹${AS.interest.join(' / ')} cr (~${n1(intRate[1])}% on a gross debt that rises in FY27), and tax runs at ~₹${n0(F.tax[0])} / ${n0(F.tax[1])} / ${n0(F.tax[2])} cr: ${AS.taxRate.join('% / ')}% of profit before tax, because India profits are taxed and overseas losses are not credited. Capex is ₹${AS.capex.join(' / ')} cr (FY27E incl. ₹332 cr for Kenalog). Every assumption is in the Excel model's Assumptions sheet, which recalculates this report's target.` },
    { exhibit: { type: 'table', title: 'Business build (₹ crore; segment EBITDA are GAM estimates)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['CDMO revenue', n0(BL.base.cdmo), ...L('cdmo')], ['  EBITDA margin', `~${X.M26.cdmo}%`, ...BL.margin.cdmo.map(v => `${n1(v)}%`)],
      ['CHG revenue', n0(BL.base.chg), ...L('chg')], ['  EBITDA margin', `~${n1(X.M26.chg)}%`, ...BL.margin.chg.map(v => `${n1(v)}%`)],
      ['PCH revenue', n0(BL.base.pch), ...L('pch')], ['  EBITDA margin', `~${X.M26.pch}%`, ...BL.margin.pch.map(v => `${n1(v)}%`)],
      ['Eliminations / other', n0(BL.base.elim), ...LINES.elim.map(n0)],
      { hl: true, cells: ['**Revenue (model)**', `**${n0(A.sales[b])}**`, '**{{F.sales.0|num}}**', '**{{F.sales.1|num}}**', '**{{F.sales.2|num}}**'] },
      { hl: true, cells: ['**EBITDA before other income (model)**', `**${n0(A.ebitda[b])}**`, '**{{F.ebitda.0|num}}**', '**{{F.ebitda.1|num}}**', '**{{F.ebitda.2|num}}**'] },
    ], source: 'Company presentations (FY26 business revenue); GAM estimates; the build sums to model revenue and EBITDA' } },
    { exhibit: { type: 'rows', title: 'P&L and cash flow summary (₹ crore)', from: 'FY23', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA (before other income)', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' },
      { name: 'Depreciation', ref: 'fin.dep' }, { name: 'Interest', ref: 'fin.interest' },
      { name: 'Other income incl. associates (actuals after exceptionals)', ref: 'fin.otherIncome' },
      { name: 'Net profit', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n1' },
      { name: 'Free cash flow', ref: 'fin.fcf' }, { name: 'Net cash (negative = net debt; forecasts)', ref: 'fin.treasury' }, { name: 'ROE', ref: 'fin.roe', fmt: 'pct' },
    ], source: 'Company, GAM Research estimates' } },
    { h: 'Other income is built, not plugged' },
    { exhibit: { type: 'table', title: 'Other-income build and reconciliation (₹ crore)', head: ['', 'FY25', 'FY26', 'TTM Jun-26', 'FY27E', 'FY28E', 'FY29E', 'Basis'], wide: [7], rows: [
      ['Interest and fund income', n1(OIN.FY25.interestDeposits + OIN.FY25.interestTaxRefund + OIN.FY25.fvtpl + OIN.FY25.investmentGain), n1(OIN.FY26.interestDeposits + OIN.FY26.interestTaxRefund + OIN.FY26.fvtpl + OIN.FY26.investmentGain), '–', ...OB.interestFund.map(String), 'AR note 27; ~₹1,250 cr of cash and liquid funds'],
      ['Miscellaneous incl. grant amortisation', n1(OIN.FY25.misc), n1(OIN.FY26.misc), '–', ...OB.miscGrant.map(String), 'AR note 27'],
      ['Rent and asset-sale gains', n1(OIN.FY25.leaseRent + OIN.FY25.ppeGain), n1(OIN.FY26.leaseRent + OIN.FY26.ppeGain), '–', ...OB.rentGains.map(String), 'AR note 27'],
      ['Write-backs of provisions / liabilities', n1(OIN.FY25.writeBacks), n1(OIN.FY26.writeBacks), '–', ...OB.writeBacks.map(String), 'Q1FY27 lifted by reversals (CFO); lower after'],
      ['Forex gains', n1(OIN.FY25.forex), n1(OIN.FY26.forex), '–', ...OB.forex.map(String), 'Rupee ~88.5 → ~95/$ in FY27; gentler after'],
      { hl: true, cells: ['**Company other income**', `**${n1(coOI25)}**`, `**${n1(coOI26)}**`, `**${ttmCoOI}**`, ...OI_BUILD.map(o => `**${o.co}**`), 'In company EBITDA, not in ours'] },
      ['AbbVie JV: 49% of JV profit', '69.1', '60.2', '–', ...OI_BUILD.map(o => n1(o.jv)), `JV profit ₹${n1(OB.abbvieJvPat26)} cr in FY26 +${OB.abbvieGrowth[0]}% a year`],
      ['Yapan Bio share', '3.8', '−3.0', '–', ...OB.yapan.map(String), 'Loss-making; FY26 level'],
      { hl: true, cells: ['**Other income incl. associates (model)**', `**${n1(coOI25 + assoc25)}**`, `**${n1(coOI26 + assoc26)}**`, `**${ttmCoOI + ttmAssoc}**`, '**{{F.otherIncome.0|num}}**', '**{{F.otherIncome.1|num}}**', '**{{F.otherIncome.2|num}}**', 'Before exceptional items'] },
    ], source: 'AR FY26 notes 27 and 36; quarterly presentations (TTM = Q2FY26-Q1FY27); GAM estimates' } },
    { exhibit: { type: 'table', title: 'GAM vs management and the street (estimates standing on 30-Sep-2026)', head: ['', 'FY27E', 'FY28E', 'FY29E', 'Comment'], wide: [4], rows: [
      ['GAM revenue (₹ cr)', '{{F.sales.0|num}}', '{{F.sales.1|num}}', '{{F.sales.2|num}}', `Management: early-to-mid-teens growth in FY27; ICICI Direct ${n0(ICICI_EST.rev[0])} / ${n0(ICICI_EST.rev[1])}; Choice 13% CAGR FY26-29E`],
      ['GAM EBITDA (₹ cr)', '{{F.ebitda.0|num}}', '{{F.ebitda.1|num}}', '{{F.ebitda.2|num}}', `ICICI Direct ${n0(ICICI_EST.ebitda[0])} / ${n0(ICICI_EST.ebitda[1])} (16.4% / 17.9% margin); Choice 13% margin FY27E`],
      ['GAM net profit (₹ cr)', '{{F.pat.0|num}}', '{{F.pat.1|num}}', '{{F.pat.2|num}}', `Motilal Oswal adj. PAT ₹110 cr / ₹300 cr; ICICI Direct ₹${n0(ICICI_EST.pat[0])} cr / ₹${n0(ICICI_EST.pat[1])} cr`],
      { hl: true, cells: ['**GAM EPS (₹)**', '**{{F.eps.0|n1}}**', '**{{F.eps.1|n1}}**', '**{{F.eps.2|n1}}**', `ICICI Direct ₹${ICICI_EST.eps[0]} / ₹${ICICI_EST.eps[1]}: higher margin and lower tax rate`] },
    ], source: 'Broker notes of 30-Jul to 2-Aug-2026 as cited in deep.json; Q4FY26 and Q1FY27 calls; GAM Research' } },
    { callout: '**Where we could be wrong:** the H2 skew. If CDMO orders convert as RFP counts suggest, FY27 margins could reach the ICICI Direct path (16-18%) and FY28E EBITDA would be ~₹300 cr higher than ours; the bull case (revenue +3pp, margin +2pp) gives FY28E EPS of ₹{{scen.bull.eps.1|n1}}. If they do not, margins stall near FY26 levels (bear FY28E EPS ₹{{scen.bear.eps.1|n1}}).' },
  ],
};

const tpRows = postQ1.slice().sort((a, c) => c.tp - a.tp);
const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street: three Buys and one Reduce after Q1; median target ₹${n0(medTp)}; everyone on EV/EBITDA, most on a sum of the parts`,
  blocks: [
    { p: `After Q1FY27 we found four notes dated 30-31 Jul 2026 and none in August-September. Motilal Oswal (Buy, ₹230 from ₹190) and ICICI Direct (Buy, ₹240 from ₹220) use sums of the parts on EV/EBITDA; ICICI Securities' institutional desk (Buy, ₹245) did not disclose its method in the sources we saw; Choice (Reduce, ₹200) uses 24x FY28E consolidated EV/EBITDA and says the order book has not yet caught up with the funding recovery. JM Financial's last note we found (16-Apr-2026, before Q4) was Buy at ₹211; InCred's initiation (Sep-2025, Buy ₹276) used 24.6x FY27F EV/EBITDA. Median of the four post-results targets ₹${n0(medTp)}, average ~₹${n0(avgTp)}; an aggregator showed 10 Buy and 1 Sell with an average of ₹233 (20-Aug-2026).` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who'], wide: [0], rows: D.critiques.map(r => r.map(rup)), source: 'Calls, filings, broker notes and press to 30-Sep-2026; GAM' } },
    { callout: `**Where we differ from the Buys:** not on the direction of the business (we agree it is recovering) but on what to pay for it. Our EBITDA is 15-21% below ICICI Direct's, yet our target is higher, because Piramal's own forward EV/EBITDA history (median ~20x since May-2023) is above the blended multiple their segment SOTPs imply (~17-18x). On our estimates their multiples give ₹${n0(X.SENS[8].tp)} and ₹${n0(X.SENS[9].tp)}, against our ₹${n0(V.tp)}. If the market prices Piramal like the brokers do rather than like its own past, the upside largely disappears.` },
  ],
};

module.exports = { forecasts, street, valuation: require('./PPLPHARMA.part5v').valuation };
