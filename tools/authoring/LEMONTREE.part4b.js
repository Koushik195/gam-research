// Lemon Tree report, part 4b: our forecasts (revenue build, P&L summary) and how they compare with the street.
const X = require('./LEMONTREE.ctx');
const { C, D, F, AS, n0, n1, YRS, BL, stream, hotelBuild, FY26 } = X;
const g3 = arr => arr.map(v => n0(v));
const f25 = X.ann('FY25'), f26 = X.ann('FY26');
const EST = D.street.estimates, pl = EST.find(e => /Prabhudas/.test(e.broker)), icd = EST.find(e => /ICICI Direct/.test(e.broker));

const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: `Our forecasts: revenue ~10% a year, EBITDA ~12%, EPS ~${Math.round(X.epsCagrFwd)}% before one-offs as margins recover and interest falls`,
  blocks: [
    { p: `We forecast revenue in two streams (owned and leased hotels; fees from third-party hotels; the authoring script checks that the build equals model revenue) and one operating margin, because Lemon Tree reports a single segment. EBITDA is operating and post-Ind AS 116, so lease liabilities count as debt. Finance cost falls as free cash flow repays bank debt; depreciation is ${AS.depRateOnGrossBlock}% of gross block; tax plus minorities is ${AS.taxRate[0]}% of profit before tax (tax ~25.5% plus minorities ~21% of profit after tax; the engine has no minority line); no dividend. We model the group as it stands; Warburg-funded acquisitions and the scheme are not in the numbers. Every assumption and our reasoning is in the Excel model's Assumptions sheet, which recalculates the target.` },
    { exhibit: { type: 'table', title: 'Revenue build (₹ crore; checked to equal model revenue)', head: ['', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Owned and leased hotels', n0(f25.owned), n0(f26.owned), ...g3(stream.owned)], ['  growth', '', `+${Math.round((f26.owned / f25.owned - 1) * 100)}%`, ...BL.growth.owned.map(v => `+${v}%`)],
      ['Fees from third-party hotels', n1(f25.fees3p), n1(f26.fees3p), ...g3(stream.fees)], ['  growth', '', `+${Math.round((f26.fees3p / f25.fees3p - 1) * 100)}%`, ...BL.growth.fees.map(v => `+${v}%`)],
      { hl: true, cells: ['**Revenue from operations (model)**', `**${n0(f25.consRev)}**`, `**${n0(f26.consRev)}**`, ...hotelBuild.map(v => `**${n0(v)}**`)] },
      ['Operating EBITDA / margin', `${n0(f25.consEbitda)} / 49.3%`, `${n0(f26.consEbitda)} / 47.8%`, ...YRS.map((_, i) => `${n0(F.ebitda[i])} / ${n1(F.ebitdaMargin[i])}%`)],
      ['Memo: fees from Fleur (eliminated)', n1(f25.feesFleur), n1(f26.feesFleur), 'n.f.', 'n.f.', 'n.f.'],
    ], source: 'Q4FY26 call (fees); Screener; GAM estimates (assumptions.json businessLines and segments); n.f. = not forecast' } },
    { exhibit: { type: 'rows', title: 'P&L and cash flow summary (₹ crore, consolidated)', from: 'FY23', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'Operating EBITDA (post-Ind AS)', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' },
      { name: 'Finance cost', ref: 'fin.interest' }, { name: 'Depreciation', ref: 'fin.dep' },
      { name: 'Net profit (attributable)', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n1' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Capex', ref: 'fin.capex' }, { name: 'Free cash flow', ref: 'fin.fcf' }, { name: 'Cash & investments (forecasts: net of debt and leases)', ref: 'fin.treasury' }, { name: 'ROE', ref: 'fin.roe', fmt: 'pct' },
    ], source: 'Company, GAM Research estimates. Cash is gross in actual years; in forecasts it is net cash (negative = net debt incl. leases).' } },
    { exhibit: { type: 'table', title: 'Our numbers against the street (standing on 30-Sep-2026)', head: ['', 'GAM FY27E', 'PL FY27E', 'ICICI Direct FY27E', 'GAM FY28E', 'PL FY28E', 'ICICI Direct FY28E'], rows: [
      ['Revenue (₹ cr)', '{{F.sales.0|num}}', n0(pl.fy27.sales), n0(icd.fy27.sales), '{{F.sales.1|num}}', n0(pl.fy28.sales), n0(icd.fy28.sales)],
      ['Operating EBITDA (₹ cr)', '{{F.ebitda.0|num}}', n0(pl.fy27.ebitda), n0(icd.fy27.ebitda), '{{F.ebitda.1|num}}', n0(pl.fy28.ebitda), n0(icd.fy28.ebitda)],
      ['EBITDA margin', '{{F.ebitdaMargin.0|pct}}', `${pl.fy27.marginPct}%`, `${icd.fy27.marginPct}%`, '{{F.ebitdaMargin.1|pct}}', `${pl.fy28.marginPct}%`, `${icd.fy28.marginPct}%`],
      ['EPS, attributable (₹)', '{{F.eps.0|n1}}', n1(pl.fy27.eps), 'n.c.', '{{F.eps.1|n1}}', n1(pl.fy28.eps), 'n.c.'],
    ], source: `PL (${X.shortDate(pl.date)}); ICICI Direct (${X.shortDate(icd.date)}; its EPS is before minorities, n.c. = not comparable); GAM` } },
    { callout: `Our FY28E EBITDA (₹${n0(F.ebitda[1])} cr) sits between PL (₹${n0(pl.fy28.ebitda)} cr) and ICICI Direct (₹${n0(icd.fy28.ebitda)} cr), on revenue ${Math.round((F.sales[1] / FY26.revenueOp - 1) * 100)}% above FY26 and a margin of {{F.ebitdaMargin.1|pct}}, just below management's 50% (which includes other income). Our EPS is close to PL's. The swing factor is the margin: each point in FY28E is ~₹${n0(F.sales[1] / 100)} cr of EBITDA and ~₹${n1(F.sales[1] / 100 * (1 - AS.taxRate[1] / 100) / X.sh)} of EPS.` },
  ],
};

module.exports = { forecasts };
