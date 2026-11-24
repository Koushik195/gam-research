// Indian Hotels report, part 4b: our forecasts vs the street (hotel revenue build, other income build, P&L summary).
const X = require('./INDHOTEL.ctx');
const { C, F, AS, SEG, n0, n1, YRS, BL, stream, hotelBuild, mosl, idir, axis, shortDate } = X;
const HS = C.hotelRevenueStreams;
const g3 = arr => arr.map(v => n0(v));
const gp = (g, x) => `${g / x - 1 >= 0 ? '+' : '−'}${Math.abs(Math.round((g / x - 1) * 100))}%`;

const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: revenue ~11-14% a year, EBITDA ~13%, EPS ~14% before one-offs; close to the street',
  blocks: [
    { p: `We forecast the hotel segment stream by stream (rooms, F&B, other operating income, management fees; the authoring script checks that the build equals model hotel revenue), air catering on its own growth and margin, and a small inter-segment elimination. Group EBITDA is the sum of the segments (operating, post-Ind AS 116), so lease liabilities count as debt and new leases sit in capex. Other income is built from treasury yield on gross cash plus dividends. Depreciation is ${AS.depRateOnGrossBlock}% of gross block; tax plus minorities less associates ${AS.taxRate[0]}% of profit before tax (the engine has no minority line); payout ${AS.payout[0]}%. Every assumption and our reasoning is in the Excel model's Assumptions sheet, which recalculates the target.` },
    { exhibit: { type: 'table', title: 'Hotel revenue build (₹ crore; checked to equal model hotel revenue)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Room revenue', n0(HS.FY26.room), ...g3(stream.room)], ['  growth', '+11%', ...BL.growth.room.map(v => `+${v}%`)],
      ['Food & beverage', n0(HS.FY26.fnb), ...g3(stream.fnb)], ['  growth', '+9%', ...BL.growth.fnb.map(v => `+${v}%`)],
      ['Other operating income (incl. Atmantan)', n0(HS.FY26.other), ...g3(stream.other)], ['  growth', '+18%', ...BL.growth.other.map(v => `+${v}%`)],
      ['Management fees', n0(HS.FY26.fees), ...g3(stream.fees)], ['  growth', '+22%', ...BL.growth.fees.map(v => `+${v}%`)],
      { hl: true, cells: ['**Hotel segment revenue (model)**', `**${n0(HS.FY26.total)}**`, ...hotelBuild.map(v => `**${n0(v)}**`)] },
      ['Hotel EBITDA margin', '34.3%', ...YRS.map((_, i) => `${n1(SEG.hotel.adjEbitda[i] / SEG.hotel.revenue[i] * 100)}%`)],
      ['Air catering revenue / margin', '1,210 / 23.7%', ...YRS.map((_, i) => `${n0(SEG.ac.revenue[i])} / ${n1(SEG.ac.adjEbitda[i] / SEG.ac.revenue[i] * 100)}%`)],
      { hl: true, cells: ['**Group revenue / operating EBITDA**', '**9,689 / 3,196**', ...YRS.map((_, i) => `**${n0(F.sales[i])} / ${n0(F.ebitda[i])}**`)] },
    ], source: 'Company decks (FY26); GAM estimates (assumptions.json businessLines and segments)' } },
    { exhibit: { type: 'table', title: 'Other income, built (₹ crore)', head: ['', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Treasury: bank interest + mutual-fund gains (~6% on average gross cash)', '184', '219', '~280', '~305', '~335'],
      ['Dividends on equity investments', '19', '33', '~35', '~40', '~40'],
      ['Other (tax-refund interest, write-backs, misc.)', '28', '31', '~15', '~15', '~15'],
      { hl: true, cells: ['**Other income before exceptional items**', '**230**', '**282**', '**{{F.otherIncome.0|num}}**', '**{{F.otherIncome.1|num}}**', '**{{F.otherIncome.2|num}}**'] },
    ], source: 'AR FY26 consolidated note 25; GAM estimates. Screener\'s FY26 other income (₹557 cr) includes ₹309 cr of exceptional items. Q1FY27: ₹80 cr.' } },
    { exhibit: { type: 'rows', title: 'Group P&L and cash flow summary (₹ crore, consolidated)', from: 'FY23', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'Operating EBITDA (post-Ind AS)', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' },
      { name: 'Other income (actuals incl. exceptional items)', ref: 'fin.otherIncome' }, { name: 'Net profit (attributable)', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n1' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Capex (forecasts incl. new leases)', ref: 'fin.capex' }, { name: 'Free cash flow', ref: 'fin.fcf' }, { name: 'Cash & investments (forecasts: net of debt and leases)', ref: 'fin.treasury' }, { name: 'ROE', ref: 'fin.roe', fmt: 'pct' },
    ], source: 'Company, GAM Research estimates. Cash is gross in actual years and net of borrowings and lease liabilities in forecasts.' } },
    { exhibit: { type: 'table', title: 'GAM vs the street (estimates standing on 30-Sep-2026)', head: ['', 'GAM FY27E', 'ICICI Direct / MOSL / Axis FY27E', 'GAM FY28E', 'ICICI Direct / MOSL / Axis FY28E'], rows: [
      ['Revenue (₹ cr)', '{{F.sales.0|num}}', `${n0(idir.est.FY27E.rev)} / ${n0(mosl.est.FY27E.rev)} / ${n0(axis.est.FY27E.rev)}`, '{{F.sales.1|num}}', `${n0(idir.est.FY28E.rev)} / ${n0(mosl.est.FY28E.rev)} / ${n0(axis.est.FY28E.rev)}`],
      ['EBITDA (₹ cr)', '{{F.ebitda.0|num}}', `${n0(idir.est.FY27E.ebitda)} / ${n0(mosl.est.FY27E.ebitda)} / ${n0(axis.est.FY27E.ebitda)}`, '{{F.ebitda.1|num}}', `${n0(idir.est.FY28E.ebitda)} / ${n0(mosl.est.FY28E.ebitda)} / ${n0(axis.est.FY28E.ebitda)}`],
      ['EPS (₹)', '{{F.eps.0|n1}}', `${n1(idir.est.FY27E.eps)} / ${n1(mosl.est.FY27E.eps)} / ${n1(axis.est.FY27E.eps)}`, '{{F.eps.1|n1}}', `${n1(idir.est.FY28E.eps)} / ${n1(mosl.est.FY28E.eps)} / ${n1(axis.est.FY28E.eps)}`],
    ], source: `ICICI Direct (${shortDate(idir.date)}), Motilal Oswal (${shortDate(mosl.date)}), Axis Securities (${shortDate(axis.date)}) Q1FY27 notes; GAM. Brokers' EBITDA definitions may differ slightly.` } },
    { callout: `Our revenue is in line with the street (FY27E ${gp(F.sales[0], idir.est.FY27E.rev)} vs ICICI Direct, ${gp(F.sales[0], mosl.est.FY27E.rev)} vs MOSL); FY28E EBITDA is ${gp(F.ebitda[1], idir.est.FY28E.ebitda)} to ${gp(F.ebitda[1], axis.est.FY28E.ebitda)} versus the three houses, because we assume a slower TajSATS recovery and only modest hotel margin gains. Our FY28E EPS (₹${n1(F.eps[1])}) is below MOSL (₹${n1(mosl.est.FY28E.eps)}), ICICI Direct (₹${n1(idir.est.FY28E.eps)}) and Axis (₹${n1(axis.est.FY28E.eps)}): we deduct a rising minority share (~6.5% of PBT) and expect no associate windfall. **The estimates are not why we are below the street; the multiple is.**` },
  ],
};

module.exports = { forecasts };
