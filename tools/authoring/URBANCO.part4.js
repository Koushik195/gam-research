// Urban Company report, part 4: earnings quality, cash bridge, ownership, governance and forecasts.
const C = require('./URBANCO.ctx');
const { n0, n1, A25, A26, q1, D, F, SEG, AS, ntvG } = C;
const SRC = 'Urban Company shareholders\' letters and FY26 annual report, GAM Research';

// ---------------------------------------------------------------- Earnings quality
const earnings = {
  id: 'earnings', nav: 'Reported vs adjusted', kicker: 'Earnings quality', title: 'Reported vs adjusted: rent, ESOPs, the Saudi JV and tax credits',
  blocks: [
    { p: `Urban Company's headline profit measure, **adjusted EBITDA**, is the sum of its four segment results. It is stricter than most on one point (it deducts rent, ₹${A26.leasePay} cr in FY26) and looser on others (it leaves out ESOP cost, one-offs and the loss of the Saudi JV). In FY26 adjusted EBITDA was −₹${-A26.adjEbitda} cr; adding back rent and deducting ESOP (₹${A26.esop} cr) and one-offs (₹${A26.listingFire} cr of listing costs and a warehouse fire) gives Ind AS EBITDA of −₹${-A26.ebitdaIndAs} cr. After depreciation (₹${A26.dep} cr), the JV loss (₹${-A26.jvShare} cr), lease interest (₹${A26.finCost} cr) and treasury income (₹${A26.otherIncome} cr), the pre-tax loss was ₹${-A26.pbt} cr; a ₹${A26.tax} cr tax charge (deferred-tax assets written back) took the net loss to ₹${-A26.pat} cr.` },
    { pair: [
      { type: 'waterfall', title: 'FY26: from adjusted EBITDA to net loss', unit: '₹ crore', x: ['Adj. EBITDA', 'Rent added back', 'ESOP', 'One-offs', 'D&A and interest', 'KSA JV loss', 'Other income', 'Tax', 'Net loss'], series: [{ name: 'Bridge', values: [A26.adjEbitda, A26.leasePay, -A26.esop, -A26.listingFire, -(A26.dep + A26.finCost), A26.jvShare, A26.otherIncome, -A26.tax, A26.pat] }], fmt: 'num', totalFmt: 'num', source: 'Q4FY26 letter (reconciliations, pp. 23-26)' },
      { type: 'column', title: 'ESOP cost is rising after the IPO grants', unit: 'Share-based compensation (₹ crore)', x: ['FY24', 'FY25', 'FY26', 'Q1FY26', 'Q1FY27'], series: [{ name: 'ESOP', values: [C.A24.esop, A25.esop, A26.esop, C.q1y.esop, q1.esop], fmt: 'num' }], labels: 'all', source: SRC },
    ] },
    { bullets: [
      '**FY25 was not a real profit.** The ₹240 cr net profit included a ₹211 cr one-time deferred-tax credit; PBT was ₹29 cr. In FY26 ₹60 cr of those assets were written back because some tax losses may lapse while InstaHelp keeps the group loss-making, and ₹151 cr remain on the standalone balance sheet.',
      `**ESOP is a real cost.** 10.0 cr options (~6.4% of the company) were outstanding at Mar-26 at ₹1. We count them in the share count (156.2 cr) and charge ₹150-170 cr a year in our forecasts (₹${q1.esop} cr in Q1FY27).`,
      '**Treasury income props up the bottom line.** ₹131 cr of interest on bonds and deposits in FY26 covered half of the operating loss; it shrinks as cash funds InstaHelp.',
      '**Two "EBITDA"s.** Screener\'s FY26 EBITDA (−₹254 cr) includes the ₹31 cr Saudi JV loss; the company\'s Ind AS EBITDA (−₹223 cr) does not. Our model follows Screener\'s definition for history and forecasts.',
      '**Tax is paid even in a loss.** Profitable subsidiaries paid ₹8 cr of tax in Q1FY27. Our model taxes only positive group profit, so FY27-28E losses are slightly understated.',
      '**Contingent liabilities are modest:** ₹116 cr, mainly GST demands (₹52 cr paid under protest).',
    ] },
    { callout: '**Accounting flag: AMBER.** Disclosure is excellent: segment P&Ls, a reconciliation to Ind AS and free cash flow every quarter, and the auditor\'s report is clean. But ESOP cost, a JV loss outside adjusted EBITDA, and tax credits that came and went make the headline numbers easy to misread.' },
  ],
};

// ---------------------------------------------------------------- Cash bridge
const cashBridge = {
  blocks: [
    { exhibit: { type: 'waterfall', title: 'FY26 cash bridge: the IPO money paid for InstaHelp', unit: 'Company cash & treasury investments, ₹ crore', x: ['Mar-25 cash', 'Core adj. EBITDA', 'InstaHelp loss', 'Treasury income', 'Capex', 'JV and other', 'IPO (net)', 'Mar-26 cash'], series: [{ name: 'Cash', values: [A25.cash, A26.adjEbitdaExIH, A26.ihAe, 115, -A26.capex, 5 - 20 - 11, 472, A26.cash] }], fmt: 'num', totalFmt: 'num', source: 'Q4FY26 letter (reconciliation of adjusted EBITDA to change in cash: working capital +5, investment in JV −20, other −11)' } },
    { callout: `**Funding:** cash burn was ₹80 cr in FY26 and ₹3 cr in Q1FY27 (working capital released ₹36 cr in the quarter); free cash flow (after rent and capex) was −₹${-A26.fcf} cr in FY26 and −₹${-q1.fcf} cr in Q1FY27. Cash of ₹${n0(q1.cash)} cr covers several years of InstaHelp losses at today's rate, so on our numbers no new equity is needed. Our model has free cash flow of {{F.fcf.0|num}} / {{F.fcf.1|num}} / {{F.fcf.2|num}} cr for FY27-29E and net cash of {{F.treasury.0|num}} cr at Mar-27.` },
  ],
};

// ---------------------------------------------------------------- Ownership
const OW = D.ownershipView;
const ownership = base => ({ ...base, blocks: [
  { p: OW.intro },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Who owns Urban Company', head: ['Holder', 'Type', 'Stake'], wide: [0], rows: [
    ...OW.named.map(h => [h.name, h.category, h.pct + '%']),
    ...OW.categories.map(c => [c.category, 'Aggregate', c.pct + '%']),
  ], source: OW.source } },
  { exhibit: { type: 'table', title: 'Lock-ins and large trades (to 30-Sep-2026)', head: ['Date', 'What happened'], wide: [1], rows: D.events.filter(e => /lock-in|block|bulk|SBI MF/i.test(e.what)).map(e => [e.date, e.what]), source: 'NSE/BSE bulk and block deals and lock-in calendars as reported by Business Standard, Business Today, Outlook Business and Motilal Oswal' } },
  { callout: OW.read },
] });

// ---------------------------------------------------------------- Governance
const G = D.governanceView;
const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: G.title,
  blocks: [
    { exhibit: { type: 'table', title: 'Key people', head: ['Name', 'Role', 'Note'], wide: [2], rows: G.people, source: G.peopleSource } },
    { verdicts: G.verdicts, head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: G.source },
  ],
};

// ---------------------------------------------------------------- Forecasts
const seg = (k, f, i) => `{{F.seg.${k}.${f}.${i}|num}}`;
const segRows = (k, label, a) => [{ sec: label }, ['NTV', n0(A26[a + 'Ntv']), seg(k, 'driver', 0), seg(k, 'driver', 1), seg(k, 'driver', 2)], ['Revenue', n0(A26[a + 'Rev']), seg(k, 'revenue', 0), seg(k, 'revenue', 1), seg(k, 'revenue', 2)], ['Adjusted EBITDA', n0(A26[a + 'Ae']), seg(k, 'adjEbitda', 0), seg(k, 'adjEbitda', 1), seg(k, 'adjEbitda', 2)]];
const grp = i => Object.values(SEG).reduce((t, s) => t + s.adjEbitda[i], 0);
const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: the core triples its profit, the group breaks even in FY29E',
  blocks: [
    { p: 'We forecast NTV for each of the four segments and express revenue and adjusted EBITDA (after rent) as a % of it. Group EBITDA adds rent back, deducts the Saudi JV loss and ESOP cost. Other income is 7.2% on cash less leases; tax is 25% of any profit. Every assumption is in the Assumptions sheet of the Excel model, which recalculates the target price.' },
    { exhibit: { type: 'table', title: 'Segment forecasts (₹ crore)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ...segRows('ics', 'India consumer services', 'ics'), ...segRows('intl', 'International', 'intl'), ...segRows('native', 'Native', 'native'), ...segRows('ih', 'InstaHelp', 'ih'),
      { sec: 'Group' }, { hl: true, cells: ['Adjusted EBITDA (company definition)', n0(A26.adjEbitda), ...[0, 1, 2].map(i => n0(grp(i)))] }, ['ESOP cost', n0(-A26.esop), ...[0, 1, 2].map(i => n0(-AS.esop[i]))],
    ], source: 'Company (FY26), GAM Research estimates' } },
    { exhibit: { type: 'rows', title: 'Group P&L and cash flow summary (₹ crore)', from: 'FY24', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA (Screener definition)', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' },
      { name: 'Depreciation', ref: 'fin.dep' }, { name: 'Other income', ref: 'fin.otherIncome' },
      { name: 'Net profit', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n2' },
      { name: 'Cash from operations', ref: 'fin.cfo' }, { name: 'Free cash flow', ref: 'fin.fcf' },
    ], source: 'Company, GAM Research estimates' } },
    { exhibit: { type: 'table', title: 'GAM vs the street: growth and margin assumptions', head: ['Source (date)', 'India services NTV growth', 'Margin / profit path', 'InstaHelp'], wide: [2], rows: [
      ['**GAM**', `${Math.round((Math.pow(SEG.ics.driver[2] / A26.icsNtv, 1 / 3) - 1) * 100)}% a year FY26-29E`, `India services ${n1(SEG.ics.adjEbitda[0] / SEG.ics.driver[0] * 100)}% / ${n1(SEG.ics.adjEbitda[1] / SEG.ics.driver[1] * 100)}% / ${n1(SEG.ics.adjEbitda[2] / SEG.ics.driver[2] * 100)}% of NTV; group adj. EBITDA positive in FY29E`, `Loss ₹${n0(-SEG.ih.adjEbitda[0])} / ${n0(-SEG.ih.adjEbitda[1])} / ${n0(-SEG.ih.adjEbitda[2])} cr`],
      ['Company guidance', 'None', 'Group adj. EBITDA breakeven by Q3FY28; ~₹1,000 cr by FY31; India services 9-10% of NTV', '"2 years, if not longer" of investment'],
      ['Emkay (Aug-2026)', '19.8% FY26-29E', 'Group profitable in FY30E', 'Loss peaks ₹940 cr in FY28E; breakeven FY31E'],
      ['UBS (Aug-2026)', 'Group NTV ~32% CAGR', '–', '–'],
      ['Ambit (Mar-2026)', '18% FY26-28E', 'DCF; India ex-InstaHelp valued at 35x FY28E EBITDA', 'Breakeven FY31E'],
      ['Kotak (Nov-2025)', '17% FY25-28E', 'International NTV +33% a year', '–'],
      ['Motilal Oswal (Mar-2026)', '~17% a year to FY37E', 'India services 50x EBITDA', '1.5x FY28E NTV'],
      ['Goldman Sachs (Oct-2025)', 'Revenue +24% a year FY25-30E', 'India ex-InstaHelp EBITDA +35% a year', '–'],
    ], source: 'Broker notes as reported on or before 30-Sep-2026 (Business Standard broker PDFs, Business Today, investing.com, Inc42); GAM Research' } },
    { p: `Our India-services growth (${Math.round(ntvG('ics', 0))}% in FY27E, ~21% a year to FY29E) is at the top of the street's 17-20% range because the core has accelerated for four quarters. Our InstaHelp losses sit between management's breakeven guidance and Emkay's much larger build-out, so our group breakeven comes in FY29E, about a year after guidance. Consensus EPS is not meaningful while the group is loss-making.` },
  ],
};

const statementNotes = {
  'pat@FY27E': 'GAM estimate: InstaHelp loss ~₹560 cr against ~₹210 cr of core adjusted EBITDA; ESOP ₹150 cr.',
  'ebitda@FY28E': 'India services 6.8% of NTV; InstaHelp loss ~₹480 cr; ESOP ₹160 cr.',
  'pat@FY29E': 'First full-year profit in our model; group adjusted EBITDA ~₹160 cr.',
  'pat@Q4FY26': 'InstaHelp loss ₹119 cr and ₹61 cr deferred-tax write-back.',
  'pat@Q3FY25': 'Includes the ₹211 cr one-time deferred-tax credit.',
  'pat@Q1FY27': 'Core adjusted EBITDA ₹67 cr; InstaHelp loss ₹132 cr; ESOP ₹38 cr.',
};

module.exports = { earnings, cashBridge, ownership, governance, forecasts, statementNotes };
