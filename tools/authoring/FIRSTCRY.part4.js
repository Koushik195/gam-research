// FirstCry report, part 4: earnings quality, cash bridge, ownership, governance and forecasts.
const C = require('./FIRSTCRY.ctx');
const { n0, n1, A25, A26, q1, q1y, D, F, SEG, AS, segM, adjE, C: CO, KEYS } = C;
const SRC = 'FirstCry investor presentations and FY26 annual report, GAM Research';
const f6 = CO.fy26, rent = f6.leasePrincipal + f6.leaseInterest;

// ---------------------------------------------------------------- Earnings quality
const earnings = {
  id: 'earnings', nav: 'Reported vs adjusted', kicker: 'Earnings quality', title: 'Reported vs adjusted: ESOPs, rent, brand amortisation and recurring "one-offs"',
  blocks: [
    { p: `FirstCry's headline measure, **adjusted EBITDA** (₹${n0(A26.adjEbitda)} cr in FY26, ${A26.adjEbitdaPct}% of revenue), leaves out four real costs. ESOP cost (₹${n0(A26.esop)} cr) is a genuine expense paid in shares. Rent (₹${n0(rent)} cr of lease payments) sits in depreciation and interest under Ind AS 116. Brand amortisation (₹${n0(f6.brandAmort)} cr) reflects the price paid for Globalbees brands. Exceptional items (₹${n0(-f6.exceptional)} cr: impairments, write-offs, a fire) have appeared every year. After depreciation on equipment, interest, tax (₹${n0(f6.tax)} cr paid by profitable entities while others lose money) and minorities (₹${n0(-f6.nciShare)} cr), the loss attributable to shareholders was ₹${n0(-f6.patOwners)} cr. The company's own "cash profit after tax" (₹${n0(f6.cashPat)} cr) adds back ESOP, amortisation and exceptionals but deducts cash rent.` },
    { pair: [
      { type: 'waterfall', title: 'FY26: from adjusted EBITDA to the owners\' loss', unit: '₹ crore', x: ['Adj. EBITDA', 'ESOP', 'D&A', 'Interest', 'Other income', 'Exceptional', 'Tax', 'Minorities', 'Owners\' loss'], series: [{ name: 'Bridge', values: [A26.adjEbitda, -A26.esop, -f6.dep, -f6.financeCost, f6.otherIncome, f6.exceptional, -f6.tax, -f6.nciShare, f6.patOwners] }], fmt: 'num', totalFmt: 'num', source: 'Q4FY26 presentation (reconciliation), FY26 annual report' },
      { type: 'column', title: 'ESOP cost: falling from here on the granted options', unit: 'Share-based payment expense (₹ crore)', x: ['FY23', 'FY24', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], series: [{ name: 'ESOP', values: [...C.SA.map(a => a.esop), ...AS.esop], fmt: 'num' }], labels: 'all', source: `${SRC}; FY27-29E: company schedule for granted options (₹118 / 64 / 30 cr) plus our allowance for new grants` },
    ] },
    { bullets: [
      '**Exceptional items are not exceptional.** ₹50 cr in FY25, ₹50 cr in FY26 and ₹18 cr in Q1FY27, mostly Globalbees impairments and inventory write-offs. FY25 hid a ₹197 cr impairment behind a ₹174 cr gain from cutting the earn-outs owed to brand founders.',
      '**Two "EBITDA"s.** Screener\'s EBITDA (₹262 cr in FY26) is after ESOP cost; the company\'s adjusted EBITDA (₹486 cr) is before it. Our model and Excel follow Screener for history and deduct ESOP in forecasts.',
      '**Minorities.** Screener\'s headline net profit is before minorities; we use profit attributable to owners for history. Our forecast EPS includes 100% of Globalbees profit (the engine has no minority line); JM Financial (May-2026) expects minorities to take ₹53 cr in FY28E and ₹112 cr in FY29E, so our forecast EPS overstates what reaches FirstCry\'s shareholders.',
      '**Tax is paid in a loss year**, because profits in India multi-channel cannot be set off against losses elsewhere; our FY27E assumes ~₹42 cr.',
      '**Earn-outs:** ₹388 cr owed to Globalbees brand founders sits in other financial liabilities; changes in its value go through exceptional items.',
    ] },
    { callout: '**Accounting flag: AMBER.** Disclosure is good (segment P&Ls, reconciliations, an ESOP schedule, cash profit), the auditor (Walker Chandiok) gave a clean opinion, and the IPO-proceeds monitoring is published. But adjusted EBITDA excludes ESOP and rent, "exceptional" charges recur, and earn-out remeasurements can flatter profit.' },
  ],
};

// ---------------------------------------------------------------- Cash bridge
const cashBridge = {
  blocks: [
    { exhibit: { type: 'waterfall', title: 'FY26 cash bridge: operations paid for capex, but not for rent and debt', unit: '₹ crore', x: ['Cash from operations', 'Capex', 'Lease payments', 'Earn-outs paid', 'Interest received', 'Borrowings & interest (net)', 'Deposits & other', 'Change in cash'], series: [{ name: 'Cash', values: [f6.cfo, -189.1, -rent, -f6.acqStakes, 144.7, -26.1, -25.0, -24.9] }], fmt: 'num', totalFmt: 'num', source: 'FY26 annual report, consolidated cash flow statement (deposits & other: net bank-deposit placements −₹23 cr; share issues net of IPO costs −₹2 cr)' } },
    { callout: `**Funding:** after capex and rent FirstCry used ~₹80 cr of cash in FY26, covered by ~₹145 cr of interest on its IPO deposits. Our model has free cash flow (after new leases, which we carry in capex) of {{F.fcf.0|num}} / {{F.fcf.1|num}} / {{F.fcf.2|num}} cr in FY27-29E and net cash after leases of {{F.treasury.0|num}} cr at Mar-27. No new equity is needed; the ₹1,741 cr of gross cash is the cushion.` },
  ],
};

// ---------------------------------------------------------------- Ownership
const OW = D.ownership;
const ownership = base => ({ ...base, blocks: [
  { p: `FirstCry has no promoter: it declares itself "professionally managed". The largest holders at Mar-2026 were SoftBank's SVF Frog (19.8%), Mahindra & Mahindra (8.6%), SBI Mutual Fund (8.4%), the ESOP trust (7.0%), founder-CEO Supam Maheshwari (5.2%) and Premji Invest (5.1%). In the Jun-2026 pattern foreign funds held ${OW.categories.FIIs}% and domestic funds ${OW.categories.DIIs}%; SoftBank, Mahindra and the founder are counted in "public" (${OW.categories.Public}%). ${OW.othersNote}` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Who owns FirstCry', head: ['Holder', 'Type', 'Stake'], wide: [0], rows: [
    ...CO.holdersMar26.map(([h, p]) => [h, 'Named holder, Mar-2026', p + '%']),
    ...Object.entries(OW.categories).map(([c, p]) => [c, 'Category, Jun-2026', p + '%']),
  ], source: `${CO.holdersSrc}; BSE shareholding pattern (Jun-2026) via Screener.in` } },
  { callout: '**What it means:** SoftBank and Mahindra still hold ~28% between them and Mahindra cut its stake from 9.6% to 8.6% in FY26, so supply from pre-IPO investors can cap rallies. Domestic mutual funds (SBI MF the largest) have been the buyers.' },
] });

// ---------------------------------------------------------------- Governance
const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Management & governance: founder-run, no promoter, investor-heavy board',
  blocks: [
    { exhibit: { type: 'table', title: 'Key people', head: ['Name', 'Role', 'Note'], wide: [2], rows: CO.management, source: 'FY26 annual report; Q1FY27 call' } },
    { verdicts: [
      ['Board independence', 'Adequate', CO.board, 'Four independents out of seven; two investor nominees.'],
      ['Pay', 'Watch', 'CEO pay was 114x the median employee in FY26 (+4%); ESOP cost ₹224 cr (2.6% of revenue).', 'High share-based pay for a loss-making company.'],
      ['Capital allocation', 'Mixed', 'Globalbees roll-up led to impairments, minorities and earn-outs; IPO objects varied at the 2026 AGM.', 'The core is well run; acquisitions destroyed value.'],
      ['Disclosure', 'Good', 'Segment P&Ls, reconciliations, ESOP schedule and cash profit every quarter.', 'Easy to follow the numbers.'],
      ['Related parties / promoter', 'Clean', 'No identifiable promoter; no material related-party issues found in the FY26 annual report.', 'Lower governance risk than promoter-run peers.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'FY26 annual report, GAM Research' },
  ],
};

// ---------------------------------------------------------------- Forecasts
const seg = (k, f, i) => `{{F.seg.${k}.${f}.${i}|num}}`;
const segRows = (k, label, g, r, e) => [{ sec: label }, ...(g ? [['GMV', n0(A26[g]), seg(k, 'driver', 0), seg(k, 'driver', 1), seg(k, 'driver', 2)]] : []), ['Revenue', n0(A26[r]), seg(k, 'revenue', 0), seg(k, 'revenue', 1), seg(k, 'revenue', 2)], ['Adjusted EBITDA', n0(A26[e]), seg(k, 'adjEbitda', 0), seg(k, 'adjEbitda', 1), seg(k, 'adjEbitda', 2)]];
const JM = D.street.brokers.find(x => x.est).est;
const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: revenue +14% a year; EBITDA margin back to 7% by FY29E',
  blocks: [
    { p: 'We forecast GMV for India and International and express revenue and adjusted EBITDA as a % of GMV; Globalbees, preschools and inter-segment sales are forecast on revenue. Group EBITDA deducts ESOP cost. Other income is interest on deposits plus recurring items; tax is paid by the profitable entities. Every assumption is in the Assumptions sheet of the Excel model, which recalculates the target price.' },
    { exhibit: { type: 'table', title: 'Segment forecasts (₹ crore)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ...segRows('imc', 'India multi-channel', 'indiaGmv', 'imcRev', 'imcAe'), ...segRows('intl', 'International', 'intlGmv', 'intlRev', 'intlAe'), ...segRows('gb', 'Globalbees', null, 'gbRev', 'gbAe'), ...segRows('oth', 'Others (preschools)', null, 'othRev', 'othAe'),
      { sec: 'Group' }, ['Inter-segment sales', n0(A26.elimRev), seg('elim', 'revenue', 0), seg('elim', 'revenue', 1), seg('elim', 'revenue', 2)],
      { hl: true, cells: ['Adjusted EBITDA (company definition)', n0(A26.adjEbitda), ...adjE.map(n0)] }, ['ESOP cost', n0(-A26.esop), ...AS.esop.map(x => n0(-x))],
    ], source: 'Company (FY26), GAM Research estimates' } },
    { exhibit: { type: 'rows', title: 'Group P&L and cash flow summary (₹ crore)', from: 'FY24', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA (after ESOP)', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' },
      { name: 'Depreciation', ref: 'fin.dep' }, { name: 'Other income', ref: 'fin.otherIncome' },
      { name: 'Net profit', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n2' },
      { name: 'Cash from operations', ref: 'fin.cfo' }, { name: 'Free cash flow', ref: 'fin.fcf' },
    ], source: 'Company, GAM Research estimates (forecast net profit before Globalbees minorities)' } },
    { exhibit: { type: 'table', title: 'GAM vs JM Financial (May-2026, the only full forecast found)', head: ['₹ crore', 'FY27E GAM', 'FY27E JM', 'FY28E GAM', 'FY28E JM', 'FY29E GAM', 'FY29E JM'], rows: [
      ['Revenue', '{{F.sales.0|num}}', n0(JM.revFY27E), '{{F.sales.1|num}}', n0(JM.revFY28E), '{{F.sales.2|num}}', n0(JM.revFY29E)],
      ['EBITDA (after ESOP)', '{{F.ebitda.0|num}}', n0(JM.ebitdaFY27E), '{{F.ebitda.1|num}}', n0(JM.ebitdaFY28E), '{{F.ebitda.2|num}}', n0(JM.ebitdaFY29E)],
      ['EPS (₹)', '{{F.eps.0|n1}}', '1.5', '{{F.eps.1|n1}}', '5.9', '{{F.eps.2|n1}}', '10.9'],
    ], source: 'JM Financial result update (26-May-2026); GAM Research. JM EPS is after minorities on 533 mn diluted shares.' } },
    { p: 'Our revenue is 1-3% below JM\'s and our EBITDA 25-30% lower: JM wrote its numbers before the Q1FY27 margin drop and assumes a faster gross-margin recovery; it also deducts minorities (₹53 cr in FY28E), so its EPS is on a different basis. Management gives no numerical guidance. Consensus EPS is not meaningful while the group is loss-making.' },
  ],
};

const statementNotes = {
  'ebitda@FY27E': 'GAM: India multi-channel 7.6% of revenue after the Q1 gross-margin hit; ESOP ₹120 cr.',
  'pat@FY27E': 'Near breakeven: ~₹42 cr of tax paid by profitable entities on a small group profit.',
  'ebitda@FY28E': 'India margin back to 8.6%; International loss ~₹40 cr; ESOP ₹80 cr.',
  'pat@Q1FY27': 'Owners\' loss ₹31 cr: India gross margin −200bp YoY; ESOP ₹30 cr; exceptional ₹18 cr.',
  'pat@Q4FY25': 'Owners\' loss ₹77 cr: Globalbees impairment and ESOP ₹82 cr.',
};

module.exports = { earnings, cashBridge, ownership, governance, forecasts, statementNotes };
