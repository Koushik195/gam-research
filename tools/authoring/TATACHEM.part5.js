// Tata Chemicals report, part B-5: ownership, governance, forecasts, street view.
const X = require('./TATACHEM.ctx');
const { C, D, A26, n0, n1, F, mosl, sep28 } = X;

// ---------------------------------------------------------------- Ownership additions
const H = D.ownership.named;
const ownership = base => ({ ...base, blocks: [
  { p: 'Tata Sons owns 31.90% and Tata Investment Corporation (itself a Tata Sons subsidiary) 5.97%: a 37.98% promoter group, unchanged for years, with no shares pledged. The largest outside holder is LIC (9.24%). Indian mutual funds own 9.68% (ICICI Prudential Value Fund 4.03%, Kotak Flexicap 2.71%), insurers 11.41% in total and foreign portfolio investors ~12%. Note the cross-holdings: Tata Investment owns 6% of Tata Chemicals, and Tata Chemicals owns shares in Tata Investment.' },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Named holders (Jun-2026)', head: ['Holder', 'Stake', 'Note'], wide: [2], rows: [
    ...H.map(h => [h.name, h.pct.toFixed(2) + '%', /Tata Sons/.test(h.name) ? 'Controls the board; itself 66% owned by the Tata Trusts' : /Investment/.test(h.name) ? 'Promoter group' : /Life/.test(h.name) ? 'Largest non-promoter holder' : '']),
    ['Mutual funds (all)', '9.68%', '35 schemes'],
    ['Foreign portfolio investors (Cat I + II)', '12.06%', '130 holders'],
  ], source: 'Shareholding pattern for the quarter ended 30-Jun-2026 (company website/BSE)' } },
  { callout: '**Our read:** a stable promoter with no pledge. The flip side is that Tata Sons decides capital allocation (including whether the Titan stake is ever sold) and the minority shareholder has little say; the same Tata Sons listing debate that moves this stock is being decided by Tata Sons\' own shareholders.' },
] });

// ---------------------------------------------------------------- Governance
const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: a clean Tata board; capital allocation is the weak spot',
  blocks: [
    { exhibit: { type: 'table', title: 'Key people', head: ['Name', 'Role', 'Note'], wide: [2], rows: C.management.map(x => [x.name, x.role, x.note || '']), source: 'AR FY26' } },
    { verdicts: [
      ['Board', 'Strong', 'Seven directors, four independent; chaired by S. Padmanabhan (from May-2025); Tata Sons nominee on the board.', 'Typical Tata governance: process-driven.'],
      ['Promoter and pledge', 'Strong', '37.98% with no pledge; no promoter selling.', 'Aligned, but the controlling shareholder is a holding company with its own agenda.'],
      ['Related parties', 'Moderate', 'Salt sold to Tata Consumer Products under the 2020 demerger arrangement; cross-holdings with Tata Investment; stakes in many Tata companies.', 'Arm\'s length per management; worth watching on salt pricing.'],
      ['Capital allocation', 'Weak', 'US (2008) acquisition written down by ₹1,837 cr; UK soda ash closed after years of losses; FY24-25 expansions came into a downturn; ROCE 3%.', 'The main governance question for investors.'],
      ['Pay', 'Moderate', 'MD & CEO paid 138x the median employee in FY26 (+7%).', 'In line with large Indian groups.'],
      ['Disclosure', 'Strong', 'Unit-wise P&L every quarter; segment re-cut explained.', 'Better than most peers.'],
      ['Contingent liabilities', 'Moderate', 'Kenya land-rates claim ₹891 cr (won in the Court of Appeal, under appeal); UK/US pension deficits ₹1,190 cr provided.', 'Manageable against ₹21,000 cr of net worth.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'GAM research compilation' },
  ],
};

// ---------------------------------------------------------------- Forecasts
const segRow = (k, name, field, hist, fmt = 'num') => [name, n0(hist), ...[0, 1, 2].map(i => `{{F.seg.${k}.${field}.${i}|${fmt}}}`)];
const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: a loss in FY27E and far below the street for FY28E',
  blocks: [
    { p: 'We forecast each operating unit\'s revenue and EBITDA margin, the way the company reports to analysts. Group EBITDA is their sum. Below EBITDA, depreciation rises with capitalised projects (~₹1,350-1,450 cr), interest stays near ₹600 cr because debt does not fall, and minorities take ~₹220-250 cr a year. Every assumption, with our reasoning, is in the Excel model\'s Assumptions sheet, which recalculates the target price.' },
    { exhibit: { type: 'table', title: 'Unit forecasts (₹ crore)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      { sec: 'India (standalone)' }, segRow('india', 'Revenue', 'revenue', A26.indiaRev), segRow('india', 'EBITDA', 'adjEbitda', A26.indiaEbitda),
      { sec: 'US (TCNA)' }, segRow('us', 'Revenue', 'revenue', A26.usRev), segRow('us', 'EBITDA', 'adjEbitda', A26.usEbitda),
      { sec: 'UK' }, segRow('uk', 'Revenue', 'revenue', A26.ukRev), segRow('uk', 'EBITDA', 'adjEbitda', A26.ukEbitda),
      { sec: 'Kenya' }, segRow('ken', 'Revenue', 'revenue', A26.kenRev), segRow('ken', 'EBITDA', 'adjEbitda', A26.kenEbitda),
      { sec: 'Singapore' }, segRow('sg', 'Revenue', 'revenue', A26.sgRev), segRow('sg', 'EBITDA', 'adjEbitda', A26.sgEbitda),
      { sec: 'Rallis India (100%)' }, segRow('ral', 'Revenue', 'revenue', A26.ralRev), segRow('ral', 'EBITDA', 'adjEbitda', A26.ralEbitda),
      segRow('oth', 'Inter-company revenue', 'revenue', A26.othRev),
    ], source: 'Company (FY26), GAM Research estimates' } },
    { exhibit: { type: 'rows', title: 'Group P&L and cash flow summary (₹ crore)', from: 'FY24', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' },
      { name: 'Net profit (after minorities)', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n1' },
      { name: 'Capex', ref: 'fin.capex' }, { name: 'Free cash flow', ref: 'fin.fcf' }, { name: 'ROE', ref: 'fin.roe', fmt: 'pct' },
    ], source: 'Company, GAM Research estimates' } },
    { exhibit: { type: 'table', title: 'GAM vs the street', head: ['', 'GAM FY27E', 'Motilal Oswal FY27E', 'GAM FY28E', 'Motilal Oswal FY28E', 'JM Financial Sep-27E'], rows: [
      ['Revenue (₹ cr)', '{{F.sales.0|num}}', n0(mosl.estimates.FY27E.salesCr), '{{F.sales.1|num}}', n0(mosl.estimates.FY28E.salesCr), '–'],
      ['EBITDA (₹ cr)', '{{F.ebitda.0|num}}', n0(mosl.estimates.FY27E.ebitdaCr), '{{F.ebitda.1|num}}', n0(mosl.estimates.FY28E.ebitdaCr), '–'],
      ['EPS (₹)', '{{F.eps.0|n1}}', n1(mosl.estimates.FY27E.eps), '{{F.eps.1|n1}}', n1(mosl.estimates.FY28E.eps), '42'],
    ], source: 'Motilal Oswal (28-Jul-2026), JM Financial (13-Oct-2025, stale), GAM Research. No FY27-28 consensus dated Jul-Sep 2026 was found.' } },
    { callout: `**Why we are so far below the street.** For FY28E our EBITDA is ₹${n0(F.ebitda[1])} cr against Motilal Oswal's ₹2,918 cr. The gap is (1) the US: we have ₹${n0(F.seg.us.adjEbitda[1])} cr vs ₹760 cr, because we do not assume Chinese capacity closes; (2) India: ₹${n0(F.seg.india.adjEbitda[1])} cr vs ₹1,344 cr, because we take management's "around 18%" sustainable margin seriously (we use 19.5-20%); (3) UK and Kenya. Below EBITDA, the street also assumes interest falls fast (Motilal Oswal ₹478 cr in FY27E vs Q1's annualised ~₹600 cr). If soda ash prices recover as the street expects, FY28E EPS could be several times ours (Motilal Oswal ₹43 vs our ₹{{F.eps.1|n1}}): that is closer to our bull case than our base case.` },
  ],
};

// ---------------------------------------------------------------- Street
const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: 'The street: mostly Hold/Sell, targets ₹566-880, and split on whether soda ash recovers in FY28',
  blocks: [
    { p: 'Of the brokers with a call standing on 30-Sep-2026, one is a Buy (Axis Capital ₹880, upgraded on 15-Sep-2026, the day of the Tata Sons rally), three are Hold/Neutral (Motilal Oswal ₹700, Geojit ₹815, HSBC ₹760) and two are Sell/Underweight (Kotak ₹620, Morgan Stanley ~₹566). JM Financial\'s Add (₹970, Oct-2025) has not been updated in the public record. The bulls point to India, the investment portfolio and an eventual soda ash recovery; the bears to Chinese oversupply, the US collapse and thin earnings. No broker we found puts a value on the Tata Sons stake.' },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who'], wide: [0], rows: D.critiques.map(c => [c[0], c[1]]), source: 'Broker notes, earnings calls and company disclosures to 30-Sep-2026' } },
    { callout: `**Where we differ:** the street's targets cluster around ₹700-800 because most models assume FY28E EBITDA of ₹2,500-2,900 cr. On our numbers (₹${n0(F.ebitda[1])} cr) the same method gives far less. Our Sep-28E US EBITDA (₹${n0(sep28('us'))} cr) is the single biggest difference.` },
  ],
};

module.exports = { ownership, governance, forecasts, street };
