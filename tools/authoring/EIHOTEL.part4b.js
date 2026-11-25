// EIH report, part 4b: our forecasts (revenue build, other income build, P&L summary) and how they compare.
const X = require('./EIHOTEL.ctx');
const { C, F, AS, SEG, n0, n1, YRS, BL, stream, hotelBuild, axis, shortDate, FY26 } = X;
const g3 = arr => arr.map(v => n0(v));
const f25 = C.fy25;

const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: revenue ~11-12% a year, EBITDA ~13%, EPS ~14% before one-offs, almost all from room rates',
  blocks: [
    { p: `We forecast revenue stream by stream (rooms, F&B incl. flight catering, other services; the authoring script checks that the build equals model revenue) and one operating margin, because EIH reports a single segment. EBITDA is operating and post-Ind AS 116, so lease liabilities count as debt. Other income is built from treasury yield on surplus funds, investment-property rent, recurring items and the share of associates (as on Screener). Depreciation is ${AS.depRateOnGrossBlock}% of gross block; tax plus minorities ${AS.taxRate[0]}% of profit before tax (the engine has no minority line); payout ${AS.payout[0]}%. Every assumption and our reasoning is in the Excel model's Assumptions sheet, which recalculates the target.` },
    { exhibit: { type: 'table', title: 'Revenue build (₹ crore; checked to equal model revenue)', head: ['', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Rooms', n0(f25.room), n0(FY26.room), ...g3(stream.room)], ['  growth', '', `+${Math.round((FY26.room / f25.room - 1) * 100)}%`, ...BL.growth.room.map(v => `+${v}%`)],
      ['Food & beverage (incl. flight catering)', n0(f25.fnb), n0(FY26.fnb), ...g3(stream.fnb)], ['  growth', '', `+${Math.round((FY26.fnb / f25.fnb - 1) * 100)}%`, ...BL.growth.fnb.map(v => `+${v}%`)],
      ['Other services', n0(f25.otherServices), n0(FY26.otherServices), ...g3(stream.other)], ['  growth', '', `+${Math.round((FY26.otherServices / f25.otherServices - 1) * 100)}%`, ...BL.growth.other.map(v => `+${v}%`)],
      { hl: true, cells: ['**Revenue from operations (model)**', `**${n0(f25.revenueOp)}**`, `**${n0(FY26.revenueOp)}**`, ...hotelBuild.map(v => `**${n0(v)}**`)] },
      ['Operating EBITDA / margin', `${n0(f25.opEbitda)} / 37.5%`, `${n0(FY26.opEbitda)} / 34.8%`, ...YRS.map((_, i) => `${n0(F.ebitda[i])} / ${n1(F.ebitdaMargin[i])}%`)],
    ], source: 'AR FY26 note 30 (FY25-26); GAM estimates (assumptions.json businessLines and segments)' } },
    { exhibit: { type: 'table', title: 'Other income incl. associates, built (₹ crore)', head: ['', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Treasury: interest + fund gains (~6.5% on average surplus funds)', '~76', '97', '~95', '~105', '~115'],
      ['Rent from investment property', '28', '29', '~30', '~30', '~30'],
      ['Shared services, write-backs, misc.', '~32', '40', '~20', '~20', '~20'],
      ['Share of associates and JVs (EIH Associated Hotels, Avis, Oberoi Mauritius, La Roseraie)', '59', '57', '~55', '~60', '~65'],
      { hl: true, cells: ['**Other income incl. associates, before exceptional items**', '**195**', '**222**', '**{{F.otherIncome.0|num}}**', '**{{F.otherIncome.1|num}}**', '**{{F.otherIncome.2|num}}**'] },
    ], source: 'AR FY26 note 31 (company other income ₹166 cr; FY25 ₹136 cr); Q4FY26 deck slide 22 (associates); Screener (FY25 ₹195 cr, FY26 ₹222 cr before exceptional items); GAM estimates. FY25 split from the same note (comparatives).' } },
    { exhibit: { type: 'rows', title: 'P&L and cash flow summary (₹ crore, consolidated)', from: 'FY23', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'Operating EBITDA (post-Ind AS)', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' },
      { name: 'Other income incl. associates (actuals incl. exceptional items)', ref: 'fin.otherIncome' }, { name: 'Net profit (attributable)', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n1' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Capex', ref: 'fin.capex' }, { name: 'Free cash flow', ref: 'fin.fcf' }, { name: 'Cash & investments (forecasts: net of leases)', ref: 'fin.treasury' }, { name: 'ROE', ref: 'fin.roe', fmt: 'pct' },
    ], source: 'Company, GAM Research estimates. Cash is gross in actual years and net of lease liabilities in forecasts.' } },
    { exhibit: { type: 'table', title: 'Our numbers against the street and EIH\'s own record', head: ['', 'GAM FY27E', 'GAM FY28E', 'FY26 actual', 'Best year so far'], rows: [
      ['Revenue (₹ cr)', '{{F.sales.0|num}}', '{{F.sales.1|num}}', n0(FY26.revenueOp), 'FY26'],
      ['Operating EBITDA (₹ cr)', '{{F.ebitda.0|num}}', '{{F.ebitda.1|num}}', n0(FY26.opEbitda), `FY25 ₹${n0(f25.opEbitda)} cr`],
      ['EBITDA margin', '{{F.ebitdaMargin.0|pct}}', '{{F.ebitdaMargin.1|pct}}', '34.8%', 'FY25 37.5%'],
      ['EPS (₹)', '{{F.eps.0|n1}}', '{{F.eps.1|n1}}', `${FY26.eps} (${n1(X.epsBei26)} before one-offs)`, `FY25 ${f25.eps}`],
    ], source: `GAM; Screener. No broker FY27E-FY28E estimates are public: Axis Capital (${shortDate(axis.date)}) disclosed only its rating and target, and no consensus is published.` } },
    { callout: `Without street estimates to compare, the honest test is history. Our FY28E EBITDA (₹${n0(F.ebitda[1])} cr) is ${Math.round((F.ebitda[1] / f25.opEbitda - 1) * 100)}% above the FY25 peak, on revenue ${Math.round((F.sales[1] / FY26.revenueOp - 1) * 100)}% above FY26 and a margin still below FY24-25. That needs RevPAR to keep growing ~10% a year with no new owned rooms until the Grand returns; it does not need the margin to recover fully. Our EPS growth (~${Math.round(X.epsCagrFwd)}% a year from FY26's ₹${n1(X.epsBei26)} before one-offs) is helped by a cash pile that keeps growing.` },
  ],
};

module.exports = { forecasts };
