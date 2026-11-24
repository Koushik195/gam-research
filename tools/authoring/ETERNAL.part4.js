// Eternal report, part 4: earnings quality, cash bridge, ownership, governance and forecasts.
const C = require('./ETERNAL.ctx');
const { n0, n1, A25, A26, q1, D, F, Qs } = C;
const SRC = 'Eternal shareholders\' letters, GAM Research';
const fy26q = Qs.filter(q => q.q.endsWith('FY26'));
const s26 = k => fy26q.reduce((s, q) => s + q[k], 0);

// ---------------------------------------------------------------- Earnings quality
const earnings = {
  id: 'earnings', nav: 'Reported vs adjusted', kicker: 'Earnings quality', title: 'Reported vs adjusted profit: ESOPs, rent, tax and a change in revenue',
  blocks: [
    { p: `Eternal's "adjusted EBITDA" and reported EBITDA happen to be close (₹${n0(A26.adjEbitda)} cr vs ₹${n0(A26.ebitda)} cr in FY26), but only because two large items cancel out. Share-based pay (ESOP, ₹${n0(A26.esop)} cr) is left out of adjusted EBITDA, which flatters it; rent (₹${n0(A26.rent)} cr) is counted in adjusted EBITDA but moved below EBITDA in the reported accounts, which flatters reported EBITDA. ESOP cost is real: it is paid in new shares, and the share count has risen every year.` },
    { pair: [
      { type: 'waterfall', title: 'FY26: from adjusted to reported EBITDA', unit: '₹ crore', x: ['Adjusted EBITDA', 'ESOP cost', 'Rent moved below EBITDA', 'Reported EBITDA'], series: [{ name: 'Bridge', values: [A26.adjEbitda, -A26.esop, A26.rent, A26.ebitda] }], fmt: 'num', totalFmt: 'num', source: 'Eternal shareholders\' letters (Annexure B), FY26 quarters summed' },
      { type: 'column', title: 'ESOP cost: ~₹200-250 cr every quarter', unit: 'Share-based payment expense (₹ crore)', x: C.QL, series: [{ name: 'ESOP', values: C.qv('esop'), fmt: 'num' }], labels: 'ends', source: SRC },
    ] },
    { bullets: [
      '**Revenue recognition changed in Q2FY26.** Once Blinkit began owning inventory, its revenue became the full sale value rather than a commission. Reported revenue grew 169% in FY26, but like-for-like growth was ~64%. Compare growth on order value, not revenue, and read margins as a share of NOV.',
      `**Tax is stepping up.** Until FY26 Eternal paid tax mainly on treasury income. The parent company (which houses food delivery) uses up its carried-forward losses in FY27, so its business profit is now taxed, while the subsidiaries that run Blinkit, District and Hyperpure still carry losses that cannot be set off against it. Q1FY27 tax was ₹${q1.tax} cr on profit before tax of ₹${n0(q1.pat + q1.tax)} cr (${Math.round(q1.tax / (q1.pat + q1.tax) * 100)}%). This is why profit fell in Q1FY27 even though EBITDA rose 29% QoQ.`,
      `**Other income is large and partly market-driven.** Treasury income was ₹${n0(A26.otherIncome)} cr in FY26, more than reported EBITDA, and includes mark-to-market gains on debt funds; the company's cash table counts only cash received (₹${n0(s26('treasuryRecd'))} cr in FY26).`,
      '**Nothing is capitalised.** Management says all employee and technology costs are expensed above adjusted EBITDA (Q1FY27 letter). Inventory losses (~1.8% of quick-commerce NOV) are inside cost of goods sold.',
    ] },
    { callout: '**Accounting flag: AMBER.** We see no sign of aggressive accounting, and the company reconciles every adjusted number. But large ESOPs paid in shares, a change in how Blinkit\'s revenue is booked, a rising tax rate and market-driven treasury income all make the headline numbers harder to read than the order-value story suggests.' },
  ],
};

// ---------------------------------------------------------------- Cash bridge
const cashBridge = {
  blocks: [
    { exhibit: { type: 'waterfall', title: 'FY26 cash bridge: profit and treasury income paid for capex; inventory took the rest', unit: 'Company cash balance, ₹ crore', x: ['Mar-25 cash', 'Adj. EBITDA', 'Treasury income', 'Capex', 'Working capital', 'Other', 'Mar-26 cash'], series: [{ name: 'Cash', values: [A25.cash, A26.adjEbitda, s26('treasuryRecd'), s26('capex'), s26('nwcChange'), A26.cash - A25.cash - A26.adjEbitda - s26('treasuryRecd') - s26('capex') - s26('nwcChange'), A26.cash] }], fmt: 'num', totalFmt: 'num', source: 'Eternal Q1FY27 shareholders\' letter (consolidated cash balance table)' } },
    { callout: `**Funding:** cash rose ₹316 cr in Q1FY27 to ₹${n0(C.cashNow)} cr: adjusted EBITDA (₹${q1.adjEbitda} cr) and treasury income (₹${q1.treasuryRecd} cr) more than covered capex (₹${-q1.capex} cr) and inventory (₹${-q1.nwcChange} cr). Eternal no longer needs outside money. Our model shows free cash flow of {{F.fcf.0|num}} / {{F.fcf.1|num}} / {{F.fcf.2|num}} cr for FY27-29E, lower than the company's own cash table because the model holds working capital at FY26's ratio to revenue (8.8%, a balance-sheet measure that includes GST and other receivables), above the company's own net working capital (~3.3% of quick-commerce NOV at steady state). That costs about ₹4 a share in our valuation.` },
  ],
};

// ---------------------------------------------------------------- Ownership
const OW = D.ownershipView;
const ownership = base => ({ ...base, blocks: [
  { p: OW.intro },
  ...base.blocks,
  { exhibit: { type: 'table', title: `Who owns Eternal (${OW.asOf})`, head: ['Holder', 'Type', 'Stake'], wide: [0], rows: [
    ...OW.named.map(h => [h.name, h.category, h.pct + '%']),
    ...OW.categories.map(c => [c.category, 'Aggregate', c.pct + '%']),
  ], source: OW.source } },
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
const HK = { food: ['foodNov', 'foodRev', 'foodAdjEbitda'], qc: ['qcNov', 'qcRev', 'qcAdjEbitda'], go: ['goNov', 'goRev', 'goAdjEbitda'], hp: ['hpRev', 'hpRev', 'hpAdjEbitda'], oth: ['othRev', 'othRev', 'othAdjEbitda'] };
const segRow = (k, name, j, fld) => [name, n0(A26[HK[k][j]]), ...[0, 1, 2].map(i => `{{F.seg.${k}.${fld}.${i}|num}}`)];
const T = D.consensus['trendlyne_2026-09-11'];
const CS = { title: 'GAM vs consensus (S&P Capital IQ via Trendlyne, 11-Sep-2026)', FY27E: { revenue: T.FY27E.revenueCrAvg, eps: T.FY27E.epsAvg }, FY28E: { revenue: T.FY28E.revenueCrAvg, eps: T.FY28E.epsAvg },
  source: 'S&P Capital IQ consensus via Trendlyne (Wayback capture of 11-Sep-2026; ' + T.FY27E.nRev + ' revenue and ' + T.FY27E.nEps + ' EPS estimates), GAM Research',
  comment: `Our revenue is close to the street. Our EPS is well below it for two reasons. (1) Tax: Q1FY27 tax was 66% of profit before tax because the parent's past losses are used up while subsidiary losses cannot be offset; we assume ~58% for FY27E, which the street does not appear to fully reflect (consensus FY27E net profit ~₹${n0(T.FY27E.netIncomeCrAvg)} cr against our {{F.pat.0|num}} cr). (2) Blinkit margins: we assume 1.0% / 2.2% / 3.4% of NOV for FY27-29E, below management's path to 6% (Nomura forecasts 0.9-2% for FY27-28). EPS does not drive our valuation, which rests on segment EBITDA and order value, but it is why the stock looks expensive on P/E (~${Math.round(C.price / F.eps[1])}x our FY28E EPS).` };
const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: EBITDA ~4x by FY29E, led by Blinkit',
  blocks: [
    { p: 'We build the forecast business by business. Each segment\'s order value (or revenue) grows at our assumed rate; revenue and adjusted EBITDA are a % of it. Group reported EBITDA is the sum of the segments, less ESOP cost, plus rent (moved below EBITDA by accounting rules). A small negative line turns adjusted revenue into reported revenue. Every assumption is in the Assumptions sheet of the Excel model, which recalculates the target price.' },
    { exhibit: { type: 'table', title: 'Segment forecasts (₹ crore)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      { sec: 'Food delivery' }, segRow('food', 'NOV', 0, 'driver'), segRow('food', 'Adjusted revenue', 1, 'revenue'), segRow('food', 'Adjusted EBITDA', 2, 'adjEbitda'),
      { sec: 'Quick commerce (Blinkit)' }, segRow('qc', 'NOV', 0, 'driver'), segRow('qc', 'Revenue (1P)', 1, 'revenue'), segRow('qc', 'Adjusted EBITDA', 2, 'adjEbitda'),
      { sec: 'Going-out (District)' }, segRow('go', 'NOV', 0, 'driver'), segRow('go', 'Adjusted EBITDA', 2, 'adjEbitda'),
      { sec: 'B2B supplies (Hyperpure)' }, segRow('hp', 'Revenue', 1, 'revenue'), segRow('hp', 'Adjusted EBITDA', 2, 'adjEbitda'),
      { sec: 'Others (Bistro, Nugget)' }, segRow('oth', 'Revenue', 1, 'revenue'), segRow('oth', 'Adjusted EBITDA', 2, 'adjEbitda'),
    ], source: 'Company (FY26), GAM Research estimates' } },
    { exhibit: { type: 'rows', title: 'Group P&L and cash flow summary (₹ crore)', from: 'FY24', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'Reported EBITDA', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' },
      { name: 'Depreciation', ref: 'fin.dep' }, { name: 'Other income', ref: 'fin.otherIncome' },
      { name: 'Net profit', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n1' },
      { name: 'Cash from operations', ref: 'fin.cfo' }, { name: 'Free cash flow', ref: 'fin.fcf' },
    ], source: 'Company, GAM Research estimates' } },
    { exhibit: { type: 'table', title: CS.title, head: ['', 'GAM FY27E', 'Street FY27E', 'GAM FY28E', 'Street FY28E'], rows: [
      ['Revenue (₹ cr)', '{{F.sales.0|num}}', n0(CS.FY27E.revenue), '{{F.sales.1|num}}', n0(CS.FY28E.revenue)],
            ['EPS (₹)', '{{F.eps.0|n1}}', n1(CS.FY27E.eps), '{{F.eps.1|n1}}', n1(CS.FY28E.eps)],
    ], source: CS.source } },
    { p: CS.comment },
  ],
};

const statementNotes = {
  'pat@FY27E': 'GAM estimate: EBITDA more than doubles, but the tax rate jumps (~58%) as the parent\'s carried-forward losses run out.',
  'sales@FY27E': 'First full year of Blinkit\'s inventory model (revenue = full sale value) plus ~72% NOV growth.',
  'ebitdaMargin@FY29E': 'Blinkit margin ~3.8% of NOV; still below the 6% steady-state target.',
  'sales@Q2FY26': 'Blinkit moved to owning inventory: revenue now includes the full sale value (like-for-like growth ~65%).',
  'pat@Q1FY27': 'Tax rose to ₹180 cr (66% of PBT): the parent\'s past losses are being used up.',
};

module.exports = { earnings, cashBridge, ownership, governance, forecasts, statementNotes };
