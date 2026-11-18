// Linde India report, part B (4 of 6): Q1FY27 & outlook, earnings quality, ownership, management & governance.
const X = require('./LINDEINDIA.ctx');
const { C, D, A, F, n0, n1, pc, Q1, FY, RP, b } = X;
const rup = s => String(s).replace(/Rs /g, '₹');

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & outlook', kicker: 'Momentum', title: 'Q1FY27: revenue +22% on engineering, profit −2% as margins slipped; no guidance, a slow project calendar',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (₹ crore)', head: ['', 'Q1FY26', 'Q1FY27', 'Change'], rows: [
      ['Revenue', n0(Q1.revenueQ1FY26), n0(Q1.revenue), pc(Q1.revenueYoYPct)],
      ['  Gases', n0(Q1.gasRevQ1FY26), n0(Q1.gasRev), pc(Q1.gasYoYPct)],
      ['  Project Engineering (external)', n0(Q1.pedExtQ1FY26), n0(Q1.pedExt), pc((Q1.pedExt / Q1.pedExtQ1FY26 - 1) * 100)],
      ['Gases segment result (PBIT)', n1(Q1.gasPbitQ1FY26), n1(Q1.gasPbit), `margin ${n1(Q1.gasPbitMarginPct)}% (${n1(Q1.gasPbitMarginQ1FY26Pct)}%)`],
      ['PED segment result (PBIT)', n1(Q1.pedPbitQ1FY26), n1(Q1.pedPbit), pc((Q1.pedPbit / Q1.pedPbitQ1FY26 - 1) * 100)],
      ['EBITDA (Screener)', n0(Q1.ebitdaQ1FY26), n0(Q1.ebitdaScreener), `margin ${Q1.opmPct}% (${Q1.opmQ1FY26Pct}%)`],
      ['Depreciation', n0(Q1.depreciationQ1FY26), n1(Q1.depreciation), 'new plants'],
      ['Finance cost', '3.2', n1(Q1.financeCost), `₹${n1(Q1.financeCostQ4FY26)} cr in Q4FY26`],
      { hl: true, cells: ['**Net profit**', `**${n1(Q1.patQ1FY26)}**`, `**${n1(Q1.pat)}**`, `**${pc(Q1.patYoYPct)}**`] },
      ['EPS (₹)', '12.57', n1(Q1.eps), ''],
    ], source: 'Q1FY27 results (11-Aug-2026), segment table; Screener.in' } },
    { p: 'Linde India holds no earnings calls and gives no numerical guidance; the MD presents once a year at the AGM. The Aug-2026 presentation listed the plants under construction and a ~₹2,000 cr third-party engineering order book, and showed management\'s view of end-market growth to 2030 (steel 6-8%, healthcare 7-8%, chemicals and energy 7-9%, semiconductors and solar 18-20%). Against that, here is what was said and what happened.' },
    { exhibit: { type: 'table', title: 'What the company said vs what happened', head: ['Item', 'What was said', 'Outcome by Sep-2026'], wide: [1, 2], rows: [
      ['Dahej merchant ASU (250 tpd)', 'Commissioned in FY24', 'Delivered; "faster-than-anticipated ramp-up" and maximum loading in FY25'],
      ['Ludhiana merchant ASU (250 tpd)', 'Committed for North India demand', 'Commissioned in FY25'],
      ['Tata Steel Kalinganagar (2 x 1,800 TPD)', 'FY25 report: one ASU commissioned, second "under construction/commissioning"', 'Still listed as under construction/commissioning at the Aug-2026 AGM'],
      ['Third Dahej ASU (Asian Paints pipeline)', 'Contract announced in the FY25 report', 'Scheduled for commissioning in FY27'],
      ['PED order book ₹2,021 cr (Mar-2025)', '"Positions us well for continued growth"', 'FY26 external revenue fell 9.5% ("project timing"); Q1FY27 more than doubled'],
      ['FY26 profit growth', 'Chairman: EBITDA +17%, PAT +23%', 'True as reported; ~₹105 cr after tax came from a liability reversal and a JV one-off'],
    ], source: 'Annual reports FY25-FY26; AGM presentation (Aug-2026); Q1FY27 results' } },
    { callout: '**Why it matters:** the plants are being delivered, but more slowly than the market seems to assume, and the company gives investors almost nothing to track them by: no volumes, no project costs, no calls. Q1FY27 shows the pattern we expect for FY27: revenue up on engineering, margin down as power, overheads and depreciation rise ahead of the new on-site fees.' },
  ],
};

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: real cash, but a qualified audit opinion and one-offs in FY26',
  blocks: [
    { bullets: [
      '**One-offs in FY26.** Expenses were reduced by a ₹90 cr "reversal of related liabilities considering change in certain contractual arrangements" (Q2FY26, Gases segment; no further explanation given), and the consolidated P&L includes ~₹49 cr from the Bellary Oxygen JV, which sold its plant to JSW Steel and is being wound up. Together ~₹105 cr after tax, a fifth of FY26 profit.',
      '**Qualified audit opinion.** PwC qualified the FY26 standalone and consolidated statements: the effect of applying SEBI\'s aggregate test to related-party dealings is "presently not determinable". It also added an emphasis of matter on the SEBI-ordered valuation. The Q1FY27 limited review carries the same qualification.',
      '**Engineering revenue is an estimate.** PED revenue is booked on percentage of completion; cost-to-complete is a key audit matter. Plants built for Linde India itself are eliminated "at cost", which supports reported external PED margins.',
      `**Costs capitalised.** ₹${n1(C.accounting.expensesCapitalisedFY26)} cr of retainer and other costs were capitalised into projects in FY26 (₹8.1 cr in FY25); small, but it rises with the capex programme.`,
      '**Lease accounting.** On-site plants dedicated to one customer are treated as operating leases (Linde India as lessor): ₹127 cr of lease rentals in FY26.',
      `**Cash conversion is good.** Operating cash flow was ₹${n0(A.cfo[b])} cr in FY26 against net profit of ₹${n0(A.pat[b])} cr; cash from operations has been 82-121% of EBITDA (before tax) every year since CY18. Customer advances (₹377 cr) and long supplier credit fund working capital.`,
      `**Contingent liabilities are small:** ₹${n0(C.contingentLiabilities.total)} cr (excise, sales tax, income tax), against ₹4,266 cr of net worth.`,
    ] },
    { callout: '**Accounting flag: AMBER.** Profits turn into cash and the P&L is simple. The amber is for the qualified opinion (a compliance matter whose financial effect is unknown), a fifth of FY26 profit coming from one-offs that were thinly explained, and engineering revenue that rests on estimates.' },
  ],
};

const OH = D.ownership;
const ownership = base => ({ ...base, blocks: [
  { p: `${rup(OH.promoter)}. Of the 25% public float, Indian mutual funds held ${OH.categoriesPct.mutualFundsMar26}% and insurers ${OH.categoriesPct.insuranceMar26}% at Mar-2026; in Jun-2026 domestic institutions held ${OH.categoriesPct.dii}% and foreign portfolio investors only ${OH.categoriesPct.fii}%. Individuals, companies and others own ~${OH.categoriesPct.public}%: ${n0(OH.counts.shareholdersJun26)} shareholders. The float is thin and largely retail.` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Who holds the shares (Jun-2026 unless stated)', head: ['Holder', 'Stake', 'Note'], wide: [2], rows: [
    ['The BOC Group Ltd (UK), Linde plc group', '75.00%', '63,963,167 shares; nil pledge; did not vote on the Mar-2026 RPT resolution'],
    ['Domestic institutions', `${OH.categoriesPct.dii}%`, `of which mutual funds ${OH.categoriesPct.mutualFundsMar26}% (Mar-2026)`],
    ['Foreign portfolio investors', `${OH.categoriesPct.fii}%`, ''],
    
    ['Public: individuals, bodies corporate, others', `${OH.categoriesPct.public}%`, `${n0(OH.counts.shareholdersJun26)} shareholders; bodies corporate ${OH.categoriesPct.bodiesCorporateMar26}% (Mar-2026)`],
  ], source: 'BSE shareholding pattern (Jun-2026, latest public on 30-Sep-2026) via Screener; Mar-2026 pattern for sub-categories; named fund holdings above 1% were not accessible' } },
  { callout: '**Our read:** at exactly 75% the parent cannot buy more shares without a delisting offer, and it cannot reach 90% without minority approval at a price minorities set. That is the "delisting option" some investors pay for. It cuts both ways: the 2019 attempt failed on price, and since 2020 the parent has reserved some new business for Praxair India, which it owns 100%.' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: competent operations, but a board and parent that keep losing votes, rulings and CFOs',
  blocks: [
    { exhibit: { type: 'table', title: 'Key people (as of 30-Sep-2026)', head: ['Name', 'Role', 'Note'], wide: [2], rows: C.management.map(m => [m.name, m.role, m.note]), source: 'Annual report FY26; Q1FY27 board outcome; AGM voting results' } },
    { verdicts: [
      ['Related parties', 'Weak', 'Business allocation with Praxair India never put to minorities; SEBI and SAT ruled against the company; 89% against at the Mar-2026 EGM.', 'The central risk for minority holders.'],
      ['Audit and accounts', 'Moderate', 'PwC qualified opinion (RPT compliance); emphasis of matter on the valuation; KAM on PED revenue.', 'Numbers are credible; compliance is not settled.'],
      ['Shareholder votes', 'Weak', '~86% of public votes against adopting the FY26 accounts; ~77% against re-appointing the chairman (Aug-2026).', 'Public holders have lost confidence; the promoter\'s 75% carries every ordinary resolution anyway.'],
      ['Board', 'Moderate', 'Six directors: three independents (two appointed in Sep-2024; a former group CFO, a former MD and a former HR head), two Linde plc nominees (legal, M&A), the MD.', 'Independents chair audit and NRC; the chair is the parent\'s lawyer.'],
      ['Management continuity', 'Weak', 'MD changed Jan-2026; CFO left Feb-2026, interim CFO, new CFO from Sep-2026.', 'Turnover during a capex peak and a legal fight.'],
      ['Disclosure', 'Weak', 'No calls, no volumes, no project costs or returns; AGM deck once a year.', 'Hard to model or monitor.'],
      ['Capital allocation', 'Moderate', 'Debt repaid after 2019; ₹2,100 cr of capex in FY25-26; ₹12 dividend held.', 'Sensible growth spending; returns undisclosed.'],
      ['Pay', 'Strong', 'Outgoing MD 13x median employee pay; independent directors ~2.2-2.5x.', 'Modest.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'GAM research compilation (annual report FY26, voting results, company filings to Sep-2026)' },
  ],
};

module.exports = { guidance, quality, ownership, governance };
