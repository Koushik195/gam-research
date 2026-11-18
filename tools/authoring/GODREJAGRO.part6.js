// Godrej Agrovet initiation, part 6: our forecasts vs the street, and the street's view.
const X = require('./GODREJAGRO.ctx');
const { D, F, AS, n0, n1, pctChg, A26, ML, owners, BR, dmy } = X;
const segRow = (k, name, field, hist) => [name, n0(hist), ...[0, 1, 2].map(i => `{{F.seg.${k}.${field}.${i}|num}}`)];
const SEG = [['an', 'Animal Nutrition'], ['veg', 'Vegetable Oil'], ['cc', 'Crop Care (standalone)'], ['ast', 'Astec LifeSciences'], ['dairy', 'Dairy'], ['food', 'Godrej Foods'], ['oth', 'Others']];

const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: ~17% EPS growth after a soft FY27, below the street',
  blocks: [
    { p: `We forecast each segment's revenue and EBITDA margin (segment result plus its depreciation), remove inter-segment sales and deduct central costs of ₹300-320 cr (which also absorb the other income that sits inside segment results). Below EBITDA: depreciation ~₹${n0(F.dep[0])} cr in FY27E rising with the oil-palm capex, finance cost ₹125 cr falling to ₹105 cr, other income ₹115-135 cr including the ACI JV, tax ~26%. **Engine notes:** history is profit attributable to owners (Screener's "Profit for EPS"), so the model's share count (19.24 cr) matches the actual 19.23 cr; the engine has no minority line, so the tax line also carries Astec's minorities, who absorb ~₹18 cr / ₹10 cr / ₹3 cr of Astec's losses in FY27-29E (effective rate ${AS.taxRate.join('% / ')}%). Every assumption is in the Excel model's Assumptions sheet.` },
    { exhibit: { type: 'table', title: 'Segment forecasts (₹ crore)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ...SEG.flatMap(([k, n]) => [{ sec: n }, segRow(k, 'Revenue', 'revenue', A26[k + 'Rev']), segRow(k, 'EBITDA', 'adjEbitda', A26[k + 'Ebitda'])]),
      ['Inter-segment eliminations (revenue)', '−' + n0(-A26.elimRev), '{{F.seg.elim.revenue.0|num}}', '{{F.seg.elim.revenue.1|num}}', '{{F.seg.elim.revenue.2|num}}'],
      ['Central costs (net of segment other income)', '−' + n0(A26.unallocVsScreener), '{{F.unalloc.0|num}}', '{{F.unalloc.1|num}}', '{{F.unalloc.2|num}}'],
    ], source: 'Company (FY26 segment note; Astec from Screener), GAM Research estimates; FY26 central costs = segment EBITDA ₹1,187 cr less Screener EBITDA ₹864 cr' } },
    { exhibit: { type: 'rows', title: 'Group P&L and cash flow summary (₹ crore)', from: 'FY24', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' },
      { name: 'Depreciation', ref: 'fin.dep' }, { name: 'Profit before tax', ref: 'fin.pbt' },
      { name: 'Net profit (attributable)', ref: 'fin.pat' }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n1', hl: true }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Capex', ref: 'fin.capex' }, { name: 'Free cash flow', ref: 'fin.fcf' }, { name: 'ROE', ref: 'fin.roe', fmt: 'pct' },
    ], source: 'Company, GAM Research estimates' } },
    { exhibit: { type: 'table', title: 'GAM vs the street (estimates standing on 30-Sep-2026)', head: ['', 'FY26A', 'GAM FY27E', 'GAM FY28E', 'GAM FY29E', 'MOSL FY27E', 'MOSL FY28E'], rows: [
      ['Revenue (₹ cr)', '10,233', '{{F.sales.0|num}}', '{{F.sales.1|num}}', '{{F.sales.2|num}}', n0(ML.FY27E.sales), n0(ML.FY28E.sales)],
      ['EBITDA (₹ cr)', '864', '{{F.ebitda.0|num}}', '{{F.ebitda.1|num}}', '{{F.ebitda.2|num}}', n0(ML.FY27E.ebitda), n0(ML.FY28E.ebitda)],
      ['Profit to shareholders (₹ cr)', '473', n0(owners(0)), n0(owners(1)), n0(owners(2)), n0(ML.FY27E.adjPat), n0(ML.FY28E.adjPat)],
      ['EPS (₹)', '24.6', '{{F.eps.0|n1}}', '{{F.eps.1|n1}}', '{{F.eps.2|n1}}', n1(ML.FY27E.eps), n1(ML.FY28E.eps)],
    ], source: 'Motilal Oswal (6-Aug-2026, after Q1FY27; adjusted PAT), GAM Research. No dated consensus was found for Aug-Sep 2026; ICICI Securities\' and FundsIndia\'s estimates were not public.' } },
    { callout: `Our FY27E EPS (₹${n1(F.eps[0])}, +${Math.round(F.epsGrowth[0])}%) is ${Math.abs(pctChg(F.eps[0], ML.FY27E.eps))}% below Motilal Oswal's ₹${n1(ML.FY27E.eps)}, and FY28E (₹${n1(F.eps[1])}) ${Math.abs(pctChg(F.eps[1], ML.FY28E.eps))}% below ₹${n1(ML.FY28E.eps)}. The gap is mostly EBITDA: Motilal Oswal has ₹${n0(ML.FY27E.ebitda)} cr for FY27E (+${Math.round((ML.FY27E.ebitda / 864 - 1) * 100)}%), which needs Q2-Q4 EBITDA up ~${Math.round(((ML.FY27E.ebitda - 240) / (864 - 270) - 1) * 100)}% after a −11% Q1. We assume (1) crop care recovers only partly (28% margin), (2) oil-palm margins ease from FY28 as CPO prices fall, (3) dairy and foods stay at 2.5-6% margins. Management's own FY27 guidance is "double-digit" PBT growth; ours is ~${Math.round((F.pbt[0] / 612 - 1) * 100)}% on reported FY26 PBT.` },
  ],
};

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: 'The street: all Buys, with targets cut by a third in a year',
  blocks: [
    { p: `${D.street.split} ${D.street.unknown} The bull case is a turnaround story: a new CEO simplifying a sprawling portfolio, oil palm's maturing plantations and downstream push, crop care diversification, Astec's CDMO recovery and branded foods. We agree with the direction. Our disagreement is about how much of it is already in FY26 profit (war-time palm-oil prices) and how fast the weak businesses (dairy, foods, Astec) earn their cost of capital.` },
    { exhibit: { type: 'table', title: 'Earlier calls (for context)', head: ['Broker', 'Rating', 'Target (₹)', 'Date', 'Note'], wide: [4], rows: D.street.older.map(o => [o.broker, o.rating, o.tp ? n0(o.tp) : '–', o.date, o.method || '–']), source: 'Trendlyne research-report list (dates and targets), broker notes' } },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who'], wide: [0], rows: D.critiques.map(c => [c.argument, c.who]), source: 'Broker notes, earnings calls and filings to 30-Sep-2026' } },
  ],
};

module.exports = { forecasts, street };
