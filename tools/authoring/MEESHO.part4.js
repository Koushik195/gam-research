// Meesho report, part 4: earnings quality, cash bridge, ownership, governance and forecasts.
const C = require('./MEESHO.ctx');
const { n0, n1, A25, A26, q1, D, F, MP, NI, SA, QL, qv } = C;
const SRC = 'Meesho shareholders\' letters and FY26 annual report, GAM Research';
const A24 = SA.find(a => a.fy === 'FY24');

// ---------------------------------------------------------------- Earnings quality
const earnings = {
  id: 'earnings', nav: 'Reported vs adjusted', kicker: 'Earnings quality', title: 'Reported vs adjusted: ESOPs, one-offs and treasury income',
  blocks: [
    { p: `Meesho's headline profit measure, **adjusted EBITDA**, is the segment result: it leaves out share-based pay (ESOP), exceptional items and other income. In FY26 adjusted EBITDA was −₹${n0(-A26.adjEbitda)} cr; ESOP (₹${n0(A26.esop)} cr), exceptional costs (₹${n0(A26.exceptional)} cr: costs of the US-to-India merger and a cloud-vendor settlement), depreciation and interest took it to an operating loss of ~₹1,625 cr, and interest on the cash pile (₹${n0(A26.otherIncome)} cr) brought the pre-tax loss to ₹${n0(-1209.3)} cr. Tax of ₹${n0(A26.tax)} cr was paid by profitable subsidiaries even though the group made a loss.` },
    { pair: [
      { type: 'waterfall', title: 'FY26: from adjusted EBITDA to net loss', unit: '₹ crore', x: ['Adj. EBITDA', 'ESOP', 'Exceptional', 'D&A and interest', 'Other income', 'Tax', 'Net loss'], series: [{ name: 'Bridge', values: [A26.adjEbitda, -A26.esop, -A26.exceptional, -(A26.dep + A26.finCost), A26.otherIncome, -A26.tax, A26.pat] }], fmt: 'num', totalFmt: 'num', source: 'Q1FY27 letter (non-GAAP reconciliation)' },
      { type: 'column', title: 'ESOP cost has come down since the FY25 founder grants vested', unit: 'Share-based payment expense (₹ crore)', x: ['FY24', 'FY25', 'FY26', 'Q1FY26', 'Q1FY27'], series: [{ name: 'ESOP', values: [A24.esop, A25.esop, A26.esop, C.q1y.esop, q1.esop], fmt: 'num' }], labels: 'all', source: SRC },
    ] },
    { bullets: [
      '**One-offs were very large in FY25.** Moving the parent from the US to India cost ₹1,346 cr of exceptional items (₹482 cr ESOP-modification charge, ₹62 cr accelerated vesting, ₹734 cr of perquisite tax paid on behalf of the founders, ₹68 cr deal costs) and ₹2,487 cr of tax. Before them FY25 lost only ~₹108 cr before tax. Investors should compare FY24 → FY26 on adjusted EBITDA, not on reported profit.',
      `**ESOP is a real cost.** ${n1(17.9)} cr option shares (~3.9% of the company) were outstanding at Mar-26 at a ₹1 exercise price. We count them in the share count (474.3 cr) and charge ₹170-210 cr a year of ESOP cost in our forecasts.`,
      `**Other income props up the bottom line.** Treasury income (₹${n0(A26.otherIncome)} cr in FY26) covered a third of the operating loss. It falls if cash is spent; it is not a business profit.`,
      '**Revenue presentation changed in FY26.** From 15-Mar-2025 Meesho piloted a model in which some last-mile partners billed sellers directly (Meesho booked only a facilitation fee), then reverted to the old model during FY26. Revenue as a % of NMV moved with it; compare growth on NMV.',
      '**Contingent liabilities are large.** Income-tax demands of ₹2,072 cr (AY2022-23 and AY2023-24) are under appeal and not provided for; a ₹14 cr GST demand was upheld on first appeal (Apr-2026).',
    ] },
    { callout: '**Accounting flag: AMBER.** The company reconciles every adjusted figure and reports free cash flow, which is good practice. But large one-offs, ESOPs paid in shares, unprovided tax demands of ~30% of cash and the GST question over Valmo\'s freight make reported numbers harder to rely on than the NMV story suggests.' },
  ],
};

// ---------------------------------------------------------------- Cash bridge
const fcfeAdj = A26.fcfe - A26.ltmFcf, other = A26.cash - A25.cash - A26.ltmFcf - fcfeAdj - 4125 + 3344;
const cashBridge = {
  blocks: [
    { exhibit: { type: 'waterfall', title: 'FY26 cash bridge: the IPO money replaced the cost of moving home', unit: 'Company cash balance, ₹ crore', x: ['Mar-25 cash', 'Free cash flow', 'Treasury income', 'IPO (net)', 'Re-domicile tax and one-offs', 'Other', 'Mar-26 cash'], series: [{ name: 'Cash', values: [A25.cash, A26.ltmFcf, fcfeAdj, 4125, -3344, other, A26.cash] }], fmt: 'num', totalFmt: 'num', source: 'FY26 annual report (KPI pages), Q1FY27 letter (FCF and FCFE reconciliation); "other" is the balancing item (GAM)' } },
    { callout: `**Funding:** free cash flow was −₹${n0(-A26.ltmFcf)} cr in FY26 (user acquisition and the Valmo scale-up) and −₹${-q1.ltmFcf} cr in the twelve months to Jun-26; after treasury income, −₹${-q1.ltmFcfe} cr. Meesho does not need new money: cash of ₹${n0(q1.cash)} cr covers more than ten years of the current burn. Our model has free cash flow of {{F.fcf.0|num}} / {{F.fcf.1|num}} / {{F.fcf.2|num}} cr for FY27-29E: the negative working capital (other liabilities exceed other operating assets by ~20% of revenue) releases cash as revenue grows.` },
  ],
};

// ---------------------------------------------------------------- Ownership
const OW = D.ownershipView;
const ownership = base => ({ ...base, blocks: [
  { p: OW.intro },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Who owns Meesho', head: ['Holder', 'Type', 'Stake'], wide: [0], rows: [
    ...OW.named.map(h => [h.name, h.category, h.pct + '%']),
    ...OW.categories.map(c => [c.category, 'Aggregate', c.pct + '%']),
  ], source: OW.source } },
  { exhibit: { type: 'table', title: 'Sales by pre-IPO holders after the lock-in (to 30-Sep-2026)', head: ['Date', 'What happened'], wide: [1], rows: D.events.filter(e => e.date >= '2026-06-09' && e.date <= '2026-09-30' && /sold|block|Fidelity|SoftBank|RPS|lock-in/i.test(e.what)).map(e => [e.date, e.what]), source: 'NSE/BSE bulk and block deals as reported by Inc42, Business Today and Reuters (via Zerodha)' } },
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
const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: break-even in FY28E, a small profit in FY29E',
  blocks: [
    { p: 'We forecast NMV and express revenue and adjusted EBITDA as a % of it. Group reported EBITDA is the sum of the two segments less ESOP cost. Other income is interest on the cash balance at 6.5%; tax is 25% of any profit (we do not count the carried-forward losses that could shelter it). Every assumption is in the Assumptions sheet of the Excel model, which recalculates the target price.' },
    { exhibit: { type: 'table', title: 'Segment forecasts (₹ crore)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      { sec: 'Marketplace' }, ['NMV', n0(A26.nmv), seg('mp', 'driver', 0), seg('mp', 'driver', 1), seg('mp', 'driver', 2)],
      ['Revenue', n0(A26.mpRev), seg('mp', 'revenue', 0), seg('mp', 'revenue', 1), seg('mp', 'revenue', 2)],
      ['Adjusted EBITDA', n0(A26.mpAdjEbitda), seg('mp', 'adjEbitda', 0), seg('mp', 'adjEbitda', 1), seg('mp', 'adjEbitda', 2)],
      { sec: 'New initiatives' }, ['Revenue', n1(A26.niRev), seg('ni', 'revenue', 0), seg('ni', 'revenue', 1), seg('ni', 'revenue', 2)],
      ['Adjusted EBITDA', n0(A26.niAdjEbitda), seg('ni', 'adjEbitda', 0), seg('ni', 'adjEbitda', 1), seg('ni', 'adjEbitda', 2)],
      { sec: 'Group' }, ['ESOP cost', n0(-A26.esop), ...[0, 1, 2].map(i => n0(-C.AS.esop[i]))],
    ], source: 'Company (FY26), GAM Research estimates' } },
    { exhibit: { type: 'rows', title: 'Group P&L and cash flow summary (₹ crore)', from: 'FY24', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'Reported EBITDA', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' },
      { name: 'Depreciation', ref: 'fin.dep' }, { name: 'Other income', ref: 'fin.otherIncome' },
      { name: 'Net profit', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n2' },
      { name: 'Cash from operations', ref: 'fin.cfo' }, { name: 'Free cash flow', ref: 'fin.fcf' },
    ], source: 'Company, GAM Research estimates' } },
    { exhibit: { type: 'table', title: 'GAM vs the street: growth and margin assumptions', head: ['Source (date)', 'NMV growth', 'Margin path (adj. EBITDA, % of NMV)', 'Break-even'], wide: [2], rows: [
      ['**GAM**', `${Math.round((Math.pow(MP.driver[2] / A26.nmv, 1 / 3) - 1) * 100)}% a year FY26-29E`, `${n1(MP.adjEbitda[0] / MP.driver[0] * 100)}% / ${n1(MP.adjEbitda[1] / MP.driver[1] * 100)}% / ${n1(MP.adjEbitda[2] / MP.driver[2] * 100)}% (FY27-29E)`, 'FY28E (marketplace)'],
      ['Jefferies (Jun-2026)', '25% CAGR', '3% by FY30', 'FCF positive by FY28'],
      ['Citi (Jun-2026)', '27% FY26-29', '2.1% by FY29, 3.6% FY30', '–'],
      ['Motilal Oswal (Jul-2026)', '25% FY26-31', '3.75% by FY31 (contribution 7.5%)', '–'],
      ['Axis Capital (Mar-2026)', '29% FY26-30', '3.1% by FY30', '–'],
      ['UBS (Dec-2025)', '~30% FY25-30', '3.2% by FY30 (contribution 6.8%)', '–'],
      ['J.P. Morgan (Apr-2026)', '~23% FY26-31', '4% by FY31', '–'],
      ['Ventura (Aug-2026)', '23.9% FY26-29E (NMV ₹79,137 cr)', 'EBITDA 5.5% of revenue FY29E', 'FY28E'],
      ['Choice (Jul-2026)', '~31% FY25-28E', '–', 'H2FY28E'],
      ['Nomura (Sep-2026)', '23% FY27-30', '–', '–'],
    ], source: 'Broker notes as reported on or before 30-Sep-2026 (Business Today, Business Upturn, DSIJ, Whalesbook, Investment Guru); GAM Research' } },
    { p: 'Our NMV growth sits in the middle of the street (23-30%). Our margins are at the low end: we have the marketplace at 1.3% of NMV in FY29E, below Citi (2.1%) and below the 3-4% that most brokers expect by FY30-31. The difference is our view that Meesho will keep reinvesting logistics savings in lower prices. A consensus EPS series is not meaningful while the company is loss-making; brokers value Meesho on NMV, out-year EBITDA or a DCF.' },
  ],
};

const statementNotes = {
  'pat@FY27E': 'GAM estimate: marketplace loss −1.5% of NMV as festive growth spending rises; treasury income ~₹430 cr.',
  'ebitda@FY28E': 'Marketplace breaks even (+0.2% of NMV); new initiatives −₹200 cr; ESOP −₹190 cr.',
  'pat@FY29E': 'First full-year profit in our model (marketplace +1.3% of NMV).',
  'sales@Q3FY26': 'Festive quarter; NMV +26% only (sale timing), contribution margin hit by the Valmo scale-up (2.3%).',
  'pat@Q4FY25': 'Re-domicile one-offs: ₹1,285 cr of exceptional items.',
  'pat@Q1FY27': 'Smallest loss since listing: contribution margin 4.6%, growth spend held at 2.1% of NMV.',
};

module.exports = { earnings, cashBridge, ownership, governance, forecasts, statementNotes };
