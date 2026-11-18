// Linde India report, part B (5 of 7): our forecasts, the street.
const X = require('./LINDEINDIA.ctx');
const { D, F, A, AS, n0, n1, pc, pc1, SEG, A26, FY, b, epsUnderlyingFY26, epsCagrFwd, epsCagrFwdUnd } = X;
const G = AS.segments.find(s => s.key === 'gas'), PD = AS.segments.find(s => s.key === 'ped');
const rup = s => String(s).replace(/Rs /g, '₹');
// The segment build must reproduce model EBITDA and revenue (engine check).
F.years.forEach((y, i) => {
  const rev = SEG.gas.revenue[i] + SEG.ped.revenue[i], e = SEG.gas.adjEbitda[i] + SEG.ped.adjEbitda[i] - AS.unallocated[i];
  if (Math.abs(rev / F.sales[i] - 1) > 0.002 || Math.abs(e / F.ebitda[i] - 1) > 0.002) throw new Error(`Segment build off model in ${y}`);
});

const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: EPS resets in FY27, then grows ~8% a year as the new plants start',
  blocks: [
    { p: `We model the two reported segments separately. Gases grow ${G.growth.join('% / ')}% in FY27-29E as the JSL, second Tata Kalinganagar, Dahej, SAIL Rourkela and Electrosteel plants come on stream, with segment EBITDA margin rising from FY26's underlying 36.3% to ${G.marginPct[2]}%. Project Engineering external revenue rises sharply in FY27E on the semiconductor and refinery orders and margins return towards the long-run ~15%. Unallocated corporate costs grow ~6% a year. Depreciation rises with the new plants (6.6% of gross block), interest rises as capex is funded partly with debt, tax is 25.5% and the dividend stays ~₹12-13 a share. FY27E EPS falls ${Math.abs(Math.round(F.epsGrowth[0]))}% because FY26 included ~₹12 a share of one-offs; on an underlying basis (FY26 ~₹${n1(epsUnderlyingFY26)}) it falls ~${Math.abs(Math.round((F.eps[0] / epsUnderlyingFY26 - 1) * 100))}%. Every assumption is in the Excel model's Assumptions sheet, which recalculates the target price.` },
    { exhibit: { type: 'table', title: 'Segment build (₹ crore)', head: ['', 'FY24', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Gases revenue', ...['FY24', 'FY25', 'FY26'].map(y => n0(X.sa(y).gasRev)), ...SEG.gas.revenue.map(n0)],
      ['  growth', '', pc1((X.A25.gasRev / X.A24.gasRev - 1) * 100), pc1((A26.gasRev / X.A25.gasRev - 1) * 100), ...G.growth.map(pc1)],
      ['  segment EBITDA', ...['FY24', 'FY25', 'FY26'].map(y => n0(X.sa(y).gasEbitda)), ...SEG.gas.adjEbitda.map(n0)],
      ['  EBITDA margin', ...['FY24', 'FY25', 'FY26'].map(y => n1(X.segM(X.sa(y), 'gas')) + '%'), ...G.marginPct.map(m => n1(m) + '%')],
      ['Project Engineering external revenue', ...['FY24', 'FY25', 'FY26'].map(y => n0(X.sa(y).pedExt)), ...SEG.ped.revenue.map(n0)],
      ['  segment EBITDA', ...['FY24', 'FY25', 'FY26'].map(y => n0(X.sa(y).pedEbitda)), ...SEG.ped.adjEbitda.map(n0)],
      ['  EBITDA margin', ...['FY24', 'FY25', 'FY26'].map(y => n1(X.segM(X.sa(y), 'ped')) + '%'), ...PD.marginPct.map(m => n1(m) + '%')],
      ['Unallocated corporate costs', ...['FY24', 'FY25', 'FY26'].map(y => n0(X.sa(y).unallocEbitda)), ...AS.unallocated.map(u => n0(-u))],
      { hl: true, cells: ['**EBITDA (model)**', '**702**', '**765**', '**909**', '**{{F.ebitda.0|num}}**', '**{{F.ebitda.1|num}}**', '**{{F.ebitda.2|num}}**'] },
    ], source: 'Segment notes (FY26 Gases includes the ₹90 cr reversal); GAM estimates. The build reproduces model revenue and EBITDA.' } },
    { exhibit: { type: 'rows', title: 'P&L and cash flow summary (₹ crore)', from: 'FY24', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' },
      { name: 'Depreciation', ref: 'fin.dep' }, { name: 'Other income', ref: 'fin.otherIncome' },
      { name: 'Net profit', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n1' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Capex', ref: 'fin.capex' }, { name: 'Free cash flow', ref: 'fin.fcf' }, { name: 'Cash (net of debt in forecasts)', ref: 'fin.treasury' }, { name: 'ROE', ref: 'fin.roe', fmt: 'pct' },
    ], source: 'Company, GAM Research estimates' } },
    { exhibit: { type: 'table', title: 'GAM vs the street (as of 30-Sep-2026)', head: ['', 'FY27E', 'FY28E', 'FY29E', 'Comment'], wide: [4], rows: [
      ['GAM revenue growth', '{{F.salesGrowth.0|chg}}', '{{F.salesGrowth.1|chg}}', '{{F.salesGrowth.2|chg}}', 'No company guidance'],
      ['GAM EBITDA margin', '{{F.ebitdaMargin.0|pct}}', '{{F.ebitdaMargin.1|pct}}', '{{F.ebitdaMargin.2|pct}}', `FY26 ${n1(A.ebitdaMargin[b])}% reported, ~32% without the reversal`],
      ['GAM EPS (₹)', '{{F.eps.0|n1}}', '{{F.eps.1|n1}}', '{{F.eps.2|n1}}', `FY26 ₹${n1(A.eps[b])} reported, ~₹${n1(epsUnderlyingFY26)} underlying`],
      ['GAM dividend per share (₹)', '{{F.dps.0|n1}}', '{{F.dps.1|n1}}', '{{F.dps.2|n1}}', '₹12 a share paid for FY23-FY26'],
      ['Street EPS (₹)', 'n.a.', 'n.a.', 'n.a.', 'No broker or consensus estimates dated Jul-Sep 2026 found (see gaps)'],
    ], source: 'GAM Research' } },
    { callout: `**Where we could be wrong:** our FY26-29E EPS growth is ${n1(epsCagrFwd)}% a year reported and ~${n1(epsCagrFwdUnd)}% underlying. Upside would come from the plants starting earlier, merchant prices staying high, PED margins holding near FY26's 31%, or lower depreciation. Our bull case (Gases +3 points of growth and +1.5 points of margin a year, PED faster and richer) gives FY29E EPS of ₹{{scen.bull.eps.2|n1}}, ~${Math.round((X.SC.bull.eps[2] / F.eps[2] - 1) * 100)}% above our base. Downside: plant delays, falling merchant prices and the Praxair restrictions.` },
  ],
};

const ST = D.street;
const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: 'The street: almost no public coverage, and the little there is cannot be verified',
  blocks: [
    { p: `${rup(ST.coverageNote.split('. Aggregators')[0])}. A blog updated on 16-Jun-2026 lists JM Financial (Neutral, ₹7,800) and Kotak Securities (Neutral, ₹7,300) without dates, methods or links; we could not verify either. We found no estimates of FY27-29E EPS. The plain conclusion: for a ₹54,000 cr company, Linde India is barely covered, and the price is set by a small float rather than by analysts. The street method we can observe for Indian gas stocks is one-year-forward P/E (Motilal Oswal on Ellenbarrie, Sep-2025, 40x FY27E).` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Source'], wide: [0], rows: D.critiques.map(r => r.map(rup)), source: 'Regulatory orders, voting results, filings and press to 30-Sep-2026' } },
  ],
};

module.exports = { forecasts, street };
