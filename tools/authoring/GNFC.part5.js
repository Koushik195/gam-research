// GNFC report, part B-5: ownership, governance, forecasts (incl. the other-income build), street view.
const X = require('./GNFC.ctx');
const { C, D, A, F, AS, A26, n0, n1, price, epsSep28, treasury26, M, ST, sep28, b } = X;

// ---------------------------------------------------------------- Ownership additions
const O = D.ownership, OD = O.mar26Detail;
const ownership = base => ({ ...base, blocks: [
  { p: `The Government of Gujarat controls GNFC through Gujarat State Investments (21.44%) and GSFC (19.86%), itself a state-controlled company: a 41.30% promoter group, unchanged for years, with no pledge. At June 2026 foreign portfolio investors held ${O.categories.fii}% (down from 20.1% in Dec-2023), domestic institutions ${O.categories.dii}% and the public ${O.categories.public}%. In the March 2026 detail, mutual funds held ${OD.mutualFunds}% and resident individuals ${OD.residentIndividuals}% across ~2.66 lakh shareholders. There is a small cross-holding: GNFC owns 75 lakh GSFC shares.` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Holders (promoters by name; others by category)', head: ['Holder', 'Stake', 'Note'], wide: [2], rows: [
    ...O.named.map(h => [h.name, h.pct.toFixed(2) + '%', /Investments/.test(h.name) ? 'Government of Gujarat holding company' : 'Listed; GNFC holds 75 lakh of its shares']),
    ['Foreign portfolio investors (Jun-2026)', O.categories.fii.toFixed(2) + '%', 'Down from 20.11% in Dec-2023'],
    ['Domestic institutions (Jun-2026)', O.categories.dii.toFixed(2) + '%', `Mutual funds ${OD.mutualFunds}% at Mar-2026`],
    ['Public (Jun-2026)', O.categories.public.toFixed(2) + '%', `${n0(O.shareholdersJun26)} shareholders`],
  ], source: 'BSE shareholding pattern for Jun-2026 (categories, via Screener.in); AR FY26 note 17 and shareholding table (Mar-2026)' } },
  { callout: '**Our read:** a stable state promoter with no pledge, and also no economic incentive to maximise minority returns. Capital allocation (deposits with a state finance company, a ₹7,000-8,000 cr BPA idea, a 35-40% payout) is decided by the state. We could not verify the names of non-promoter holders above 1% in the June 2026 pattern.' },
] });

// ---------------------------------------------------------------- Governance
const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: honest and conservative, run by rotating civil servants',
  blocks: [
    { exhibit: { type: 'table', title: 'Key people', head: ['Name', 'Role', 'Note'], wide: [2], rows: C.management.map(x => [x.name, x.role, x.note || '']), source: 'AR FY26; press (Sep-2026)' } },
    { verdicts: [
      ['Leadership continuity', 'Weak', 'Four MDs between Feb-2025 and Sep-2026 (Pankaj Joshi, T. Natarajan, Rajkumar Beniwal, Sanjeev Kumar), all serving IAS officers on transfer; chairman changed in Nov-2025.', 'Strategy rests on a professional second line (ED & CFO D. V. Parikh, EDs Patel and Purohit).'],
      ['Board', 'Moderate', 'Ten directors at Mar-2026, four serving IAS officers; government nominees\' sitting fees go to the state treasury.', 'Process-driven, not shareholder-driven.'],
      ['Capital allocation', 'Weak', '₹2,410 cr lent to Gujarat State Financial Services at ~7.25%; treasury of ₹5,200 cr built up over a decade; BPA/phenol idea of ₹7,000-8,000 cr under study.', 'The main question for minority holders.'],
      ['Shareholder returns', 'Moderate', 'One buyback (₹653 cr, Dec-2023); payout 32-49% in FY23-26; "nothing in the pipeline" for another buyback (May-2026).', 'Better than many state companies; not generous given the cash.'],
      ['Related parties', 'Moderate', 'Promoter GSFC a customer/supplier (₹26 cr purchases); stakes in other Gujarat state companies; ICDs with a state entity.', 'Small in P&L terms; the ICDs are the issue.'],
      ['Disclosure', 'Moderate', 'Quarterly decks with segment results and price panels; calls answered in detail; but "no guidance" and no product-level revenue.', 'Adequate.'],
      ['Audit and controls', 'Strong', 'Clean audit opinions; no qualifications; contingent liabilities ₹359 cr.', 'No accounting concerns.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'GAM research compilation (AR FY26, calls to Aug-2026)' },
  ],
};

// ---------------------------------------------------------------- Forecasts
const segRow = (k, name, field, hist, fmt = 'num') => [name, n0(hist), ...[0, 1, 2].map(i => `{{F.seg.${k}.${field}.${i}|${fmt}}}`)];
const oi = C.fy26.otherIncomeNote;
const ttmOi = M.quarterly.otherIncome.slice(-4).reduce((s, x) => s + x, 0);
const tInc = F.years.map((_, i) => (i ? F.treasury[i - 1] : treasury26) * AS.treasuryYield[i] / 100);
const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: FY27E still war-boosted, FY28E back to normal',
  blocks: [
    { p: 'We forecast each segment\'s revenue and segment result (EBIT), as GNFC reports them. Because segment depreciation is not disclosed, a reconciliation line adds back depreciation and removes other income booked inside segments to reach EBITDA on Screener\'s basis. Below EBITDA, depreciation rises with the projects, treasury earns 6% on the opening balance and tax is 25.2%. Every assumption, with our reasoning, is in the Excel model\'s Assumptions sheet, which recalculates the target price.' },
    { exhibit: { type: 'table', title: 'Segment forecasts (₹ crore)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      { sec: 'Chemicals' }, segRow('chem', 'Revenue', 'revenue', A26.chemRev), segRow('chem', 'Segment result (EBIT)', 'adjEbitda', A26.chemEbit),
      { sec: 'Fertilisers' }, segRow('fert', 'Revenue', 'revenue', A26.fertRev), segRow('fert', 'Segment result (EBIT)', 'adjEbitda', A26.fertEbit),
      { sec: 'Others ((n)Code IT)' }, segRow('oth', 'Revenue', 'revenue', A26.othRev), segRow('oth', 'Segment result (EBIT)', 'adjEbitda', A26.othEbit),
      { sec: 'Bridge to EBITDA' }, ['Add back depreciation, less other income in segments and head-office cost', n0(A.ebitda[b] - A26.segEbit), '{{F.unalloc.0|num}}', '{{F.unalloc.1|num}}', '{{F.unalloc.2|num}}'],
      { hl: true, cells: ['**EBITDA**', `**${n0(A.ebitda[b])}**`, '**{{F.ebitda.0|num}}**', '**{{F.ebitda.1|num}}**', '**{{F.ebitda.2|num}}**'] },
    ], source: 'Company (FY26), GAM Research estimates' } },
    { exhibit: { type: 'table', title: 'Other income: built, not plugged (₹ crore)', head: ['', 'FY26 actual', 'TTM to Q1FY27', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Treasury: interest + dividends (FY26) / 6% on opening treasury (forecast)', n0(oi.interest + oi.dividend), '–', ...tInc.map(n0)],
      ['ASGP government grant (non-cash, ₹455 cr left)', n0(oi.grant), '–', '61', '61', '61'],
      ['Recurring misc. income + lease rent', n0(oi.misc + oi.leaseRent), '–', '39', '39', '39'],
      ['GGRC associate share (below PBT on Screener)', '11 (not in total)', '–', '12', '12', '12'],
      ['One-offs: insurance, FX, write-backs', n0(oi.insurance + oi.fxGain + oi.writeBacks), '–', '0', '0', '0'],
      { hl: true, cells: ['**Total other income**', `**${n0(oi.total)}**`, `**${n0(ttmOi)}**`, '**{{F.otherIncome.0|num}}**', '**{{F.otherIncome.1|num}}**', '**{{F.otherIncome.2|num}}**'] },
    ], source: 'AR FY26 consolidated note 28; Screener quarterly results; GAM Research. FY26 actual excludes the associate (₹11 cr, shown separately)' } },
    { callout: `**Reconciliation:** FY27E other income of ₹${n0(F.otherIncome[0])} cr is below FY26's ₹${n0(oi.total)} cr and the TTM ₹${n0(ttmOi)} cr because (1) we leave out ~₹45 cr of one-offs (insurance ₹${n0(oi.insurance)} cr, FX ₹${n0(oi.fxGain)} cr, write-backs), and (2) the treasury yield falls to 6% from ~6.6% (deposit rates fell after the 2025 rate cuts; Q1FY27 other income was ₹101 cr against ₹150 cr a year earlier). FY28-29E fall further as ₹2,900 cr of capex is paid out of treasury.` },
    { exhibit: { type: 'rows', title: 'Group P&L and cash flow summary (₹ crore)', from: 'FY24', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' },
      { name: 'Other income', ref: 'fin.otherIncome' }, { name: 'Net profit', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n1' },
      { name: 'Capex', ref: 'fin.capex' }, { name: 'Free cash flow', ref: 'fin.fcf' }, { name: 'ROE', ref: 'fin.roe', fmt: 'pct' },
    ], source: 'Company, GAM Research estimates' } },
    { exhibit: { type: 'table', title: 'GAM vs the street and the recent run-rate', head: ['', 'TTM to Q1FY27', 'FY26', 'GAM FY27E', 'GAM FY28E', 'GAM FY29E', 'Street'], rows: [
      ['Revenue (₹ cr)', n0(A.ttm.sales), n0(A.sales[b]), '{{F.sales.0|num}}', '{{F.sales.1|num}}', '{{F.sales.2|num}}', 'n.d.'],
      ['EBITDA (₹ cr)', n0(A.ttm.ebitda), n0(A.ebitda[b]), '{{F.ebitda.0|num}}', '{{F.ebitda.1|num}}', '{{F.ebitda.2|num}}', 'n.d.'],
      ['EPS (₹)', n1(A.ttm.eps), n1(A.eps[b]), '{{F.eps.0|n1}}', '{{F.eps.1|n1}}', '{{F.eps.2|n1}}', 'No dated estimates found'],
      ['Implied by street targets at our Sep-28E EPS', '', '', '', '', '', `JM ₹580 = ${n1(580 / epsSep28)}x; ICICI Sec ₹550 = ${n1(550 / epsSep28)}x`],
    ], source: 'Screener.in (TTM), GAM Research; street targets via a third-party blog (Jun-2026), not verified' } },
    { callout: `**What we assume, in one line:** FY27E EPS of ₹{{F.eps.0|n1}} keeps Q1's ₹21 and adds ~₹15 a quarter after; FY28E falls to ₹{{F.eps.1|n1}} as chemical prices normalise and the April-2027 shutdown bites; FY29E recovers to ₹{{F.eps.2|n1}} on the new AN and nitric acid capacity. Sep-28E EPS of ₹${n1(epsSep28)} is no higher than FY26's ₹${n1(A.eps[b])} and well below the TTM ₹${n1(A.ttm.eps)}. A buyer at ₹${n0(price)} is paying ${n1(price / A.ttm.eps)}x war-time TTM earnings but ${n1(price / epsSep28)}x our Sep-28E earnings.` },
  ],
};

// ---------------------------------------------------------------- Street
const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: 'The street: barely covered; the few calls we can find are Neutral',
  blocks: [
    { p: 'GNFC has almost no live sell-side coverage. We found no broker note dated July-September 2026 with a published target, method and estimates. A third-party blog (updated 11-Jun-2026) lists JM Financial at Neutral with ₹580 and ICICI Securities at Neutral with ₹550, without dates or methods; we could not find the notes themselves. The last full broker valuation we could read is HDFC Securities\' stock note of Aug-2022 (base case ₹792 at 6.5x FY24E EPS), which shows how the street has valued GNFC: on P/E of one- to two-year-forward earnings, with no separate value for the cash. The stock rallied ~65% from its March-2026 low to ₹604 on 30-Sep-2026, so the market has moved well ahead of the Neutral calls.' },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who'], wide: [0], rows: D.critiques.map(c => [c[0], c[1]]), source: 'Company calls, annual report and GAM Research to 30-Sep-2026' } },
    { callout: `**Where we differ:** the two Neutral targets (₹550-580) sit near the price; ours is lower because we do not capitalise war-time earnings. At ${n1(580 / epsSep28)}x and ${n1(550 / epsSep28)}x our Sep-28E EPS those targets are above GNFC's own ex-trough median forward P/E (8.0x). The bull case for the stock is that the war keeps TDI tight into FY28; we show it as a scenario ({{scen.bull.tp|inr}}), not our base case.` },
  ],
};

module.exports = { ownership, governance, forecasts, street };
