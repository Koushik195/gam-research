// Bajaj Housing Finance report, part 2: what the company does, history and corporate actions.
const X = require('./BAJAJHFL.ctx');
const { C, SG, n0, n1, pc, Q1 } = X;

const PR = C.products.rows, QN = SG.quarterly.find(q => q.q === 'Q1FY27'), QO = SG.quarterly.find(q => q.q === 'Q1FY26');
const QK = C.quarterlyKpis, adds = QK.slice(1).map((q, i) => [q.q, q.aum - QK[i].aum]);
const business = {
  id: 'business', nav: 'What BHFL does', kicker: 'Company', title: 'A full-range mortgage lender: home loans for salaried Indians, plus rent-backed loans to landlords and builders',
  blocks: [
    { p: `Bajaj Housing Finance (BHFL) is a housing-finance company (HFC) owned 86.7% by Bajaj Finance, registered with the National Housing Bank and treated by the RBI as an "upper-layer" NBFC, the tier with bank-like rules. It is India's largest HFC that does not take deposits and the second largest HFC overall after LIC Housing Finance. It lends only against property. In FY26 it earned ₹10,512 cr of interest and ₹639 cr of fees and other income (insurance commissions, charges, and income on loans it sold), paid ₹6,760 cr of interest, spent ₹867 cr on operations and set aside ₹191 cr for bad loans, leaving ₹3,320 cr of pre-tax profit.` },
    { p: `The arithmetic is thin. In Q1FY27 the loan book yielded 8.9% and funding cost 7.2%, a gross spread of 1.7 percentage points. Equity-funded loans and fee income lift the net interest margin to 3.7% of loans. From that, operating costs take ~0.7% and bad loans ~0.05-0.2%, leaving a return on assets of 2.3%. A ~6x leverage turns that into a 12-13% return on equity. Every one of those numbers is good for a mortgage lender; together they are still a modest business.` },
    { exhibit: { type: 'table', title: 'Four mortgage businesses: size, growth and asset quality (Jun-2026)', head: ['Business', 'AUM (₹ cr)', 'YoY growth', 'Share of AUM', 'Gross NPA', 'What it is'], wide: [5], rows: [
      ...PR.map(r => [r.name, n0(QN[r.key]), r.growthQ1 != null ? `+${r.growthQ1}%` : pc((QN[r.key] / QO[r.key] - 1) * 100), `${n1(QN[r.key] / QN.total * 100)}%`, `${r.gnpaJun26.toFixed(2)}%`, `${r.what}${r.ats ? `. ${r.ats}` : ''}`]),
      { hl: true, cells: ['**Total**', `**${n0(QN.total)}**`, `**+${Q1.aumGrowth}%**`, '**100%**', `**${Q1.gnpa.toFixed(2)}%**`, ''] },
    ], source: 'Q1FY27 presentation p4, p31-35, p38 (growth rates as reported; ticket sizes at origination)' } },
    { pair: [
      { type: 'stacked', title: 'Lease-rental loans doubled in two years; home loans grew 18-22%', unit: 'AUM by business (₹ \'000 crore), March; Q1FY27 = Jun-2026', x: [...SG.annual.map(a => a.fy), 'Q1FY27'], series: SG.lines.map(l => ({ name: l.name.replace(' (incl. top-ups)', ''), values: [...SG.annual, QN].map(a => Math.round(a[l.key] / 100) / 10), fmt: 'n1' })), minLabel: 8, source: 'Annual reports FY2024-25 and FY2025-26 (table 1a); Q1FY27 presentation p38' },
      { type: 'column', title: 'A record ₹8,918 cr of AUM added in Q1FY27', unit: 'Increase in AUM in the quarter (₹ crore)', x: adds.map(a => a[0]), series: [{ name: 'AUM added', values: adds.map(a => a[1]), fmt: 'num' }], labels: 'all', highlight: 'Q1FY27', source: 'Q1FY27 presentation p23 (quarter-end AUM)' },
    ] },
    { p: `Distribution is lean: 224 branches in 182 locations across 20 states and union territories, 2,025 employees (Jun-2026), centralised underwriting hubs, ~95% of retail applications and agreements digital. Home loans come through developers whose projects BHFL has approved (9,800+ projects) and finances, through direct-selling agents and connectors, and through digital partners. Lease-rental and developer loans are sold relationship by relationship to 332 landlords and 608 developers. In 2024 BHFL added "Sambhav", a separate unit for near-prime and affordable home loans (ticket ~₹28 lakh, target yields 9-13%), now disbursing ₹450-465 cr a month.` },
    { callout: `**Why this matters:** BHFL is two businesses in one balance sheet. The retail half (home loans and LAP, 64% of AUM) is a scale business where banks set the price and BHFL competes on speed and service. The commercial half (lease-rental and developer loans, 35%) carries higher yields per rupee of cost and has had no losses, but it is lumpy, concentrated (an average lease-rental loan is ₹137 cr) and capped by the rule that half of an HFC's assets must be individual home loans.` },
  ],
};

const CA = C.corporateActions;
const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'Built in eight years on ~₹13,100 cr of parent and IPO equity; listed because the RBI required it',
  blocks: [
    { p: 'BHFL started lending in FY18 as Bajaj Finance\'s mortgage arm. It grew AUM from ₹3,570 cr to ₹1,40,706 cr in eight years, funded by ₹9,200 cr of equity from the parent (FY18-FY25, incl. a ₹2,000 cr rights issue in Apr-2024; ₹328 cr more before FY18), a ₹3,560 cr IPO fresh issue, and retained profit. The listing was not optional: the RBI classed BHFL as an "upper-layer" NBFC in FY23, which requires a stock-market listing within three years. The IPO in Sep-2024 drew record demand (63.6x subscribed) and set a valuation the stock has been unwinding ever since.' },
    { exhibit: { type: 'table', title: 'Key events and what they did to the numbers', head: ['When', 'Event', 'Impact on the numbers'], wide: [1, 2], rows: [
      ['FY18-FY20', 'Lending starts; ₹4,700 cr of parent equity', 'AUM ₹3,570 cr → ₹32,705 cr; ROE 1% → 9%'],
      ['FY21', 'Covid: lockdown and moratorium', 'Loan losses 0.80% of loans; ROE 7.8%; AUM growth slowed to 19%'],
      ['FY23', 'Classified as an upper-layer NBFC; ₹2,500 cr equity', 'Listing mandated within three years; ROE 14.6%'],
      ['FY24', 'Peak returns', 'ROE 15.2% at 6.7x leverage; credit cost 6bp'],
      ['Apr-2024 / Sep-2024', '₹2,000 cr rights issue; IPO (₹3,560 cr fresh + ₹3,000 cr sold by the parent at ₹70), 63.6x subscribed', 'Equity +63% in FY25; ROE 13.4%; leverage 6.7x → 5.2x. Sambhav (near-prime/affordable unit) launched in 2024'],
      ['16/17-Sep-2024', 'Listed at ₹150, closed ₹165; ₹181.5 the next day', 'Forward P/B ~6x; the stock\'s peak'],
      ['FY25-FY26', 'RBI rate cuts passed through (incl. ₹17,000 cr repo-linked loans); prime pricing war with banks', 'Portfolio yield 9.8% (Q1FY25) → 8.9% (Q1FY27); NIM 3.9% → 3.7% in the last year (company basis)'],
      ['2-Dec-2025', 'Parent sells ~2% in a bulk deal', 'Stake 88.70% → 86.70%; stock −9% that day'],
      ['13-Mar-2026', 'Float deadline extended from Sep-2027 to 15-Sep-2029', 'Sell-down can be spread over three more years'],
      ['Q1FY27', 'Record AUM addition; FY27 assessment (AUM +21-23%, NIM −20-25bp, ROE 12-13%)', 'PAT +23%; credit cost 5bp on a ₹2,300 cr assignment'],
    ], source: 'Company presentations and annual reports; Business Standard (Sep-2024); BusinessToday (Dec-2025)' } },
    { pair: [
      { type: 'column', title: 'Equity came in big steps: ₹12,760 cr since FY18', unit: 'Equity raised (₹ crore): parent infusions, rights issue and IPO fresh issue', x: C.annualKpis.map(k => k.fy), series: [{ name: 'Equity raised', values: C.annualKpis.map(k => k.capitalInfusion), fmt: 'num' }], labels: 'all', source: 'Q1FY27 presentation p10 (9-year snapshot; excludes ₹328 cr before FY18)' },
      { type: 'line', title: 'AUM growth: from 37% (FY22) to the low 20s', unit: 'AUM growth (%)', x: 'fin.labels', from: 'FY21', to: 'FY29E', series: [{ name: 'AUM growth', ref: 'fin.aumGrowth', fmt: 'pct' }], labels: 'all', min: 0, max: 45, source: 'Company presentations; GAM estimates' },
    ] },
  ],
  _ca: CA,
};

module.exports = { business, history, ...require('./BAJAJHFL.part2b') };
