// Deepak Fertilisers report, part B: merges DEEPAKFERT.part2-7.js and adds the forecasts and street chapters.
// Written as of 30-Sep-2026 (Q1FY27 basis). Forecast and valuation figures are live tokens ({{...}}) that
// follow assumptions.json; shared numbers come from DEEPAKFERT.ctx.js.
const P2 = require('./DEEPAKFERT.part2'), P3 = require('./DEEPAKFERT.part3'), P4 = require('./DEEPAKFERT.part4'), P5 = require('./DEEPAKFERT.part5'), P6 = require('./DEEPAKFERT.part6'), P7 = require('./DEEPAKFERT.part7');
const { ctx } = require('./DEEPAKFERT.ctx');
const { C, D, F, A, AS, n0, n1, ai, A26, rating, ndHist, ndF, EE, ST } = ctx;
const OI = C.fy26.otherIncome;
const segRow = (k, name, field, hist25, hist26) => [name, hist25, hist26, ...[0, 1, 2].map(i => `{{F.seg.${k}.${field}.${i}|num}}`)];

// ---------------------------------------------------------------- forecasts
const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: EBITDA up 70% by FY28E, but EPS flat at ~₹110-115 after the Q1 windfall',
  blocks: [
    { p: `We model the two reported segments. **Chemicals** revenue is built from TAN volume × realisation (650 / 880 / 930 kt at ₹58 / 50 / 48 per kg), industrial chemicals (₹2,130 / 2,550 / 2,700 cr with Dahej) and ammonia/blasting/other sales (₹1,500 / 1,300 / 1,300 cr), with EBITDA margins of 37.5% / 32% / 31%. **Fertilisers** grow 2% / 6% / 6% at 5.5% / 7.5% / 8% margins. Corporate costs (net of the other income booked in segment results) are ₹260-280 cr. Below EBITDA: depreciation steps up as the ~₹4,650 cr of new plant starts (₹600-680 cr), interest rises to ₹430 cr in FY27E once capitalisation stops and then falls with debt (₹400 / 310 cr), tax 25.5%, payout 17-20%. Capex ₹950 / 500 / 600 cr. Every input is on the Excel model's Assumptions sheet, which recalculates this report's target.` },
    { exhibit: { type: 'table', title: 'Segment forecasts (₹ crore)', head: ['', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      { sec: 'Chemicals' }, segRow('chem', 'Revenue', 'revenue', n0(ctx.A25.chemRev), n0(A26.chemRev)), segRow('chem', 'EBITDA', 'adjEbitda', n0(ctx.A25.chemEbitda), n0(A26.chemEbitda)),
      { sec: 'Fertilisers' }, segRow('fert', 'Revenue', 'revenue', n0(ctx.A25.fertRev), n0(A26.fertRev)), segRow('fert', 'EBITDA', 'adjEbitda', n0(ctx.A25.fertEbitda), n0(A26.fertEbitda)),
      { sec: 'Group' }, ['Realty & others revenue', n0(ctx.A25.othRev), n0(A26.othRev), ...[0, 1, 2].map(i => `{{F.seg.oth.revenue.${i}|num}}`)],
      ['Unallocated (corporate costs net of other income in segment results)', `−${n0(ctx.A25.unallocVsScreener)}`, `−${n0(A26.unallocVsScreener)}`, ...[0, 1, 2].map(i => `{{F.unalloc.${i}|num}}`)],
      { hl: true, cells: ['**Reported EBITDA**', n0(A.ebitda[ai('FY25')]), n0(A.ebitda[ai('FY26')]), '{{F.ebitda.0|num}}', '{{F.ebitda.1|num}}', '{{F.ebitda.2|num}}'] },
    ], source: 'Company (FY25-26 segment notes; EBITDA = segment EBIT + segment D&A), GAM estimates' } },
    { exhibit: { type: 'rows', title: 'P&L and cash flow summary (₹ crore)', from: 'FY23', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' },
      { name: 'Depreciation', ref: 'fin.dep' }, { name: 'Other income', ref: 'fin.otherIncome' },
      { name: 'Net profit', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n1' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Capex', ref: 'fin.capex' }, { name: 'Free cash flow', ref: 'fin.fcf' }, { name: 'ROE', ref: 'fin.roe', fmt: 'pct' },
    ], source: 'Company, GAM estimates' } },
    { exhibit: { type: 'table', title: 'Other income: built from its parts (₹ crore)', head: ['', 'FY26 actual', 'FY27E', 'Why'], wide: [3], rows: [
      ['Interest on deposits and cash', n1(OI.interestOnDeposits), '~20', '~₹350-450 cr of cash at ~5%'],
      ['Interest on an income-tax refund', n1(OI.interestOnTaxRefund), '0', 'One-off'],
      ['Gain on selling mutual funds / fair-value gains', n1(OI.gainOnSaleOfInvestments + OI.fairValueGain), '0', 'The ₹126 cr of funds were sold by Jun-26'],
      ['Realised hedging gains', n1(OI.ofWhichHedgingGain), '0', 'Volatile; not forecast'],
      ['Other non-operating and unwinding', n1(OI.otherNonOperating - OI.ofWhichHedgingGain + OI.unwinding), '~10', 'Recurring miscellaneous'],
      { hl: true, cells: ['**Total**', `**${n1(OI.total)}**`, '**{{F.otherIncome.0|num}}**', 'Q1FY27 ₹6 cr; TTM ₹85 cr'] },
    ], source: 'Annual Report 2025-26 note 29; Screener.in (quarters); GAM estimates. FY28-29E: ₹35 / 40 cr as cash rebuilds' } },
    { exhibit: { type: 'table', title: 'Net debt path (₹ crore)', head: ['', 'FY24', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Net debt, model basis (borrowings incl. leases and the CCD debt part, less cash and investments)', ...['FY24', 'FY25', 'FY26'].map(l => n0(ndHist(l))), ...[0, 1, 2].map(i => n0(ndF(i)))],
      ['Net debt, company measure (excl. leases)', '–', '3,305', '4,824', '–', '–', '–'],
      ['Net debt / EBITDA, model basis (x)', ...['FY24', 'FY25', 'FY26'].map(l => n1(ndHist(l) / A.ebitda[ai(l)])), ...[0, 1, 2].map(i => n1(ndF(i) / F.ebitda[i]))],
    ], source: 'Screener.in (history), company presentations (company measure; ₹4,719 cr at Jun-26), GAM estimates. Working capital is held at FY26\'s ~23% of revenue, which includes ₹751 cr of subsidy owed by the government; a faster subsidy cycle would cut net debt further' } },
    { exhibit: { type: 'table', title: 'GAM vs the street (latest detailed estimates found)', head: ['', 'GAM FY27E', 'Emkay FY27E', 'GAM FY28E', 'Emkay FY28E'], rows: [
      ['Revenue (₹ cr)', '{{F.sales.0|num}}', n0(EE.FY27E.revenue), '{{F.sales.1|num}}', n0(EE.FY28E.revenue)],
      ['EBITDA (₹ cr)', '{{F.ebitda.0|num}}', n0(EE.FY27E.ebitda), '{{F.ebitda.1|num}}', n0(EE.FY28E.ebitda)],
      ['EPS (₹)', '{{F.eps.0|n1}}', n1(EE.FY27E.eps), '{{F.eps.1|n1}}', n1(EE.FY28E.eps)],
      ['Net debt, end-year (₹ cr)', '{{F.treasury.0|num}}', '–', '{{F.treasury.1|num}}', `−${n0(EE.netDebtFY28E)}`],
    ], source: 'Emkay initiation (18-Nov-2025), the only detailed published estimates we found; no consensus dated Jul-Sep 2026 was found. GAM net debt shown as negative net cash (model basis)' } },
    { callout: `Our FY27E EPS (₹${n1(F.eps[0])}) is above Emkay's pre-war ₹${n1(EE.FY27E.eps)} because Q1FY27 alone earned ₹38.8; our FY28E (₹${n1(F.eps[1])}) is ~${Math.round((1 - F.eps[1] / EE.FY28E.eps) * 100)}% below its ₹${n1(EE.FY28E.eps)}. EBITDA is similar (₹${n0(F.ebitda[1])} cr vs ₹${n0(EE.FY28E.ebitda)} cr); the gap is below EBITDA: Emkay assumed net debt falling to ~₹${n0(EE.netDebtFY28E)} cr by FY28E (interest ~₹220 cr), we see ~₹${n0(ndF(1))} cr (interest ₹400 cr) because capex continues and working capital grows with revenue. EPS growth over FY27-29E is ~${Math.round((Math.pow(F.eps[2] / F.eps[0], 0.5) - 1) * 100)}% a year: the volume and gas gains replace the fading windfall rather than add to it.` },
  ],
};

// ---------------------------------------------------------------- street
const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: 'The street: thin coverage, one Neutral and one stale Buy',
  blocks: [
    { p: `Only two brokers had published calls we could find standing on 30-Sep-2026: **Keynote Capitals Neutral ₹1,534** (3-Jun-2026, after Q4FY26; it had a Buy at ₹1,317 in Feb-2026, which the stock passed) and **Emkay Global BUY ₹2,000** (initiation, 18-Nov-2025; no later Emkay note was found). Trendlyne's consensus on 5-May-2026 showed a ₹1,815 target from two calls. The bulls (Emkay) argue that Gopalpur, Dahej and the Equinor contract lift EBITDA by more than 50% over FY26-28E and that listing DMSL would reveal its value (Emkay put DMSL alone at more than the whole company's market value). The caution (Keynote's downgrade; our view) is about price: the stock had already rallied from ~₹1,044 (Feb-2026) to ~₹1,400-1,650 by mid-2026 on war-time spreads.` },
    { exhibit: { type: 'table', title: 'Earlier calls (for context)', head: ['Broker', 'Date', 'Rating', 'Target (₹)', 'Method'], rows: D.street.earlier.map(o => [o.broker, o.date.split('-').reverse().join('-'), o.rating, n0(o.tp), o.method]), source: 'Trendlyne research listing; FundsIndia blog (calls dated to 30-Sep-2026 only)' } },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who'], wide: [0], rows: D.critiques.map(c => [c.point, c.who]), source: 'Broker notes, rating rationales and filings to 30-Sep-2026' } },
  ],
};

module.exports = {
  rating, cover: P2.cover,
  sections: p => [P2.narrative, P3.business, P3.history, P3.industry, P3.tailwind, P4.chemicals, P4.fertilisers, P4.projects, P5.moat, p.seasons, p.financials, P5.quality, p.balance, P5.ownership(p.ownershipBase), P5.governance, forecasts, street, P7.valuation, P6.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
