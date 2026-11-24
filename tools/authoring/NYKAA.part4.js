// Nykaa report, part 4: earnings quality, cash bridge, ownership, governance and forecasts.
const C = require('./NYKAA.ctx');
const { n0, n1, A25, A26, q1, D, F, PM } = C;
const SRC = 'Nykaa FY26 annual report, presentations, GAM Research';

// ---------------------------------------------------------------- Earnings quality
const earnings = {
  id: 'earnings', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: clean accounts, but a high tax rate and a minority to buy out',
  blocks: [
    { p: `Nykaa's accounts are straightforward for an Indian internet company: it reports EBITDA as profit before tax plus interest and depreciation, less other income, and its vertical EBITDA adds up exactly to that number (FY26: ₹${n0(A26.bEbitda)} cr Beauty, ₹${n0(A26.fEbitda)} cr Fashion, ₹${n0(A26.othEbitda)} cr others = ₹${n0(A26.ebitda)} cr). Share-based pay is inside EBITDA and is small (₹${n1(A26.esop)} cr in FY26). Five things still need care.` },
    { bullets: [
      '**Rent sits below EBITDA.** Under Ind AS 116, store and warehouse rent shows up as depreciation of right-of-use assets and interest on lease liabilities (₹491 cr at Mar-26), not as an operating cost. EBITDA therefore overstates cash profit; we deduct lease liabilities as debt in our valuation.',
      `**A minority to buy out.** Nykaa owns 51% of Dot & Key and has promised to buy the other 49% (a put option). The liability was revalued from ₹136 cr to ₹${n0(-PM.value)} cr in FY26 as Dot & Key grew; it is booked in equity, not the P&L. Minorities took ₹4.5 cr of FY26 profit, so profit attributable to shareholders was ₹199 cr, not the ₹204 cr headline.`,
      '**High tax rate.** Tax was 38% of profit before tax in FY26 and Q1FY27, because profits in the parent are taxed at ~25% while losses in subsidiaries (Fashion, others) cannot be set off. The rate should fall as Fashion turns profitable; we assume 35% / 32% / 30%.',
      '**Advertising income inside revenue.** Brands pay Nykaa to promote products on its app; management cites "marketing income" as one driver of the gross-margin gain. It is high-margin but depends on brands\' marketing budgets.',
      '**Less disclosure after resegmentation.** Since FY26 Superstore (eB2B), which loses money, is reported inside Beauty, so investors can no longer see its losses. An exceptional charge of ₹17.4 cr was taken in FY26.',
    ] },
    { callout: '**Accounting flag: AMBER.** No sign of aggressive accounting: S.R. Batliboi gave a clean opinion, adjusted metrics reconcile and dilution is tiny. Amber because rent is below EBITDA, the put option grows with Dot & Key\'s success, and the eB2B losses are now out of sight.' },
  ],
};

// ---------------------------------------------------------------- Cash bridge
const cashBridge = {
  blocks: [
    { exhibit: { type: 'waterfall', title: 'FY26: operating cash profit of ₹795 cr became ₹491 cr of free cash flow', unit: '₹ crore', x: ['Operating cash profit', 'Working capital', 'Tax paid', 'Capex', 'Free cash flow'], series: [{ name: 'Cash', values: [795, -15, -135, -154, 491] }], fmt: 'num', totalFmt: 'num', source: 'Screener.in consolidated cash-flow schedule (FY26 annual report)' } },
    { callout: 'Free cash flow paid down borrowings and lease liabilities (cash from financing -₹433 cr in FY26) rather than building cash. Our model shows free cash flow of {{F.fcf.0|num}} / {{F.fcf.1|num}} / {{F.fcf.2|num}} cr in FY27-29E: lower than FY26 in FY27E because inventory grows with sales (our model ties working capital to revenue), then rising. Net debt including leases moves from ₹918 cr (Mar-26) to {{F.treasury.0|num}} / {{F.treasury.2|num}} cr (FY27E / FY29E, negative = net debt).' },
  ],
};

// ---------------------------------------------------------------- Ownership
const OW = D.ownershipView;
const ownership = base => ({ ...base, blocks: [
  { p: OW.intro },
  ...base.blocks,
  { exhibit: { type: 'table', title: `Who owns Nykaa (${OW.asOf})`, head: ['Holder', 'Type', 'Stake'], wide: [0], rows: [
    ...OW.named.map(h => [h.name, h.category, h.pct.toFixed(2) + '%']),
    ...OW.categories.map(c => [c.category, 'Aggregate', c.pct.toFixed(2) + '%']),
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
    { p: 'Our read: a founder who has built and run the business for 14 years, with two of her children now running Beauty and the owned brands and professional CEOs in Fashion and Superstore. The board has an independent majority and the auditor is a large firm. The main governance question is succession and family influence, not honesty: the auditor\'s opinion on the FY26 accounts is unmodified and we saw no accounting concerns.' },
  ],
};

// ---------------------------------------------------------------- Forecasts
const HK = { beauty: ['bGmv', 'bRev', 'bEbitda'], fashion: ['fGmv', 'fRev', 'fEbitda'], oth: ['othRev', 'othRev', 'othEbitda'] };
const segRow = (k, name, j, fld) => [name, n0(A26[HK[k][j]]), ...[0, 1, 2].map(i => `{{F.seg.${k}.${fld}.${i}|num}}`)];
const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: EBITDA nearly triples by FY29E; EPS grows faster',
  blocks: [
    { p: 'We build the forecast vertical by vertical. Each vertical\'s GMV (revenue for the small GCC business) grows at our assumed rate; revenue and EBITDA are a % of GMV. Group EBITDA is the sum of the verticals, as Nykaa reports it. Below EBITDA, depreciation is a % of gross block (including leased stores), interest covers leases and working-capital loans, and tax falls from 35% to 30% as Fashion turns profitable.' },
    { exhibit: { type: 'table', title: 'Vertical forecasts (₹ crore)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      { sec: 'Beauty' }, segRow('beauty', 'GMV', 0, 'driver'), segRow('beauty', 'Revenue', 1, 'revenue'), segRow('beauty', 'EBITDA', 2, 'adjEbitda'),
      { sec: 'Fashion' }, segRow('fashion', 'GMV', 0, 'driver'), segRow('fashion', 'Revenue', 1, 'revenue'), segRow('fashion', 'EBITDA', 2, 'adjEbitda'),
      { sec: 'Others (GCC, international)' }, segRow('oth', 'Revenue', 1, 'revenue'), segRow('oth', 'EBITDA', 2, 'adjEbitda'),
    ], source: 'Company (FY26), GAM Research estimates' } },
    { exhibit: { type: 'rows', title: 'Group P&L and cash flow summary (₹ crore)', from: 'FY24', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' },
      { name: 'Depreciation', ref: 'fin.dep' }, { name: 'Interest', ref: 'fin.interest' },
      { name: 'Net profit', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n2' },
      { name: 'Cash from operations', ref: 'fin.cfo' }, { name: 'Free cash flow', ref: 'fin.fcf' },
    ], source: 'Company, GAM Research estimates' } },
    { callout: `**Against management's FY30 ambition** (EBITDA 4-5x FY26, i.e. ₹3,000-3,750 cr): our FY29E EBITDA of {{F.ebitda.2|num}} cr is ~${n1(F.ebitda[2] / A26.ebitda)}x FY26, which would need another ~40% in FY30 to reach the low end. We are a little behind the plan on purpose: Q1FY27 margins were boosted by Fashion's sudden turn, and quick commerce is a live threat in mass beauty.` },
  ],
};

const statementNotes = {
  'sales@FY27E': 'GAM estimate: Beauty GMV +27%, Fashion GMV +42% (Nike partnership until it laps in Q4FY27).',
  'pat@FY27E': 'GAM estimate: EBITDA +50%; tax 35% (losses in Fashion subsidiaries still not offset).',
  'ebitdaMargin@FY29E': 'Beauty ~11.8% of NSV; Fashion ~5% of NSV (target: high single digit by FY30).',
  'pat@Q3FY26': 'Exceptional charge (₹16 cr pre-tax) in the quarter; festive season.',
  'sales@Q1FY27': 'Revenue +29%, the fastest in 13 quarters; Fashion GMV +53% (Nike partnership).',
  'ebitda@Q1FY27': 'EBITDA +68%: Beauty 10.3% of NSV, Fashion at breakeven.',
};

module.exports = { earnings, cashBridge, ownership, governance, forecasts, statementNotes };
