// Atul report, part B (3/3): P&OC segment, moat, earnings quality, ownership, governance.
const { ctx } = require('./ATUL.part2');
const { C, D, F, n0, SRC, SQ, QL, FYS, SA, A26, A25, A24, SA2, Q1 } = ctx;
const SUB = C.subSegmentsFY26.rows, sub = n => SUB.find(r => r.name.startsWith(n));

// ---------------------------------------------------------------- P&OC
const poc = {
  id: 'poc', nav: 'Performance & Other Chemicals', kicker: 'Segment', title: 'Performance & Other Chemicals: ₹1,960 cr of new plants since FY21, a 14% return so far',
  blocks: [
    { pair: [
      { type: 'column', title: 'P&OC revenue by quarter: ₹1,427 cr in Q1FY27 (+34%)', unit: 'P&OC revenue (₹ crore, gross)', x: QL, series: [{ name: 'P&OC', values: SQ.map(q => Math.round(q.pocRev)), fmt: 'num' }], labels: 'all', source: SRC },
      { type: 'column', title: 'P&OC EBIT: ₹240 cr in Q1FY27, 2.4x a year earlier', unit: 'P&OC EBIT (₹ crore)', x: QL, series: [{ name: 'EBIT', values: SQ.map(q => Math.round(q.pocEbit)), fmt: 'num' }], labels: 'all', source: SRC },
    ] },
    { bullets: [
      `**Epoxy (Polymers - Performance Materials, ₹${n0(sub('Polymers - Performance').fy26)} cr, +18%):** the largest business. Liquid epoxy resin capacity went from 30 ktpa (running at 99%) to 80 ktpa in October 2024 (₹200 cr capex plus ₹165 cr working capital). Sales volume rose 21% in FY26 and 40% is exported, though the US now levies a 12.69% anti-dumping duty on Atul's epoxy. Management sees ₹650 cr of unrealised sales from this capacity. India's anti-dumping duty on imports (Nov-2025) protects the home market.`,
      `**Atul Products (caustic-chlorine, ₹${n0(sub('Atul Products').fy26)} cr, +35%):** a 300 TPD caustic soda plant commissioned in December 2023 after ~₹670 cr of funding from Atul; start-up problems cost ₹32 cr in FY24; PBT ₹56 cr in FY26. Chlorine feeds Atul's own chains.`,
      `**Aromatics (₹${n0(sub('Aromatics').fy26)} cr, −3%; volume −7%):** para-cresol and anisole derivatives for fragrances, personal care and additives, where Atul has a significant global share; Asian competition kept prices down.`,
      `**Colors (₹${n0(sub('Colors').fy26)} cr, +9%), bulk chemicals (₹${n0(sub('Bulk').fy26)} cr, +8%) and retail adhesives (₹${n0(sub('Polymers - Retail').fy26)} cr, +20%):** dyes and pigments (sulphur black protected by an anti-dumping duty), resorcinol, and the Lapox/Polygrip brands.`,
      '**The JV drag:** Anaven LLP (50:50 with Nouryon, monochloroacetic acid) lost ₹51 cr in FY24 and ₹36 cr (PBT) in FY26 at low utilisation; ₹12 cr of Atul\'s loan to it and ₹3 cr of interest were overdue at Mar-26.',
    ] },
    { exhibit: { type: 'table', title: 'P&OC: capital in, returns out (₹ crore)', head: ['', ...SA2.map(a => a.fy)], rows: [
      ['Revenue (gross)', ...SA2.map(a => n0(a.pocRev))],
      ['EBIT', ...SA2.map(a => n0(a.pocEbit))],
      ['EBITDA margin', ...SA2.map(a => a.pocEbitdaPct + '%')],
      ['Additions to assets', ...SA2.map(a => n0(a.pocCapex))],
      ['Capital employed (closing)', ...SA2.map(a => n0(a.pocCapEmployed))],
      { hl: true, cells: ['**Pre-tax ROCE**', ...SA2.map(a => `**${a.pocRoce}%**`)] },
    ], source: 'Annual reports (segment notes), GAM calculation' } },
    { pair: [
      { type: 'line', title: 'P&OC EBITDA margin: our forecast stays below FY19-22', unit: 'P&OC EBITDA margin (%, annual)', x: [...FYS, ...F.years], series: [{ name: 'P&OC', values: [...SA.map(a => a.pocEbitdaPct), ...F.years.map((_, i) => Math.round(F.seg.poc.adjEbitda[i] / F.seg.poc.revenue[i] * 1000) / 10)], fmt: 'pct' }], labels: 'all', min: 0, max: 30, source: 'Company annual reports, GAM Research estimates (FY27-29E)' },
      { type: 'column', title: 'Our P&OC forecast: FY28 EBITDA dips as the spike fades', unit: 'P&OC EBITDA (₹ crore)', x: ['FY24', 'FY25', 'FY26', ...F.years], series: [{ name: 'EBITDA', values: [A24.pocEbitda, A25.pocEbitda, A26.pocEbitda, ...F.seg.poc.adjEbitda].map(v => Math.round(v)), fmt: 'num' }], labels: 'all', source: 'Company, GAM Research estimates' },
    ] },
    { callout: `**Our view:** P&OC more than doubled its capital employed in six years (₹${n0(ctx.ann('FY20').pocCapEmployed)} cr at Mar-20 to ₹${n0(A26.pocCapEmployed)} cr at Mar-26) while EBIT fell from ₹604 cr to ₹${n0(A26.pocEbit)} cr. The plants are built; the question is utilisation and price. We model revenue +12% / +8% / +9% (FY27-29E) and EBITDA margin 17% / 15.5% / 16%: better than FY26 (${A26.pocEbitdaPct}%) on volume and anti-dumping protection, far below the 23-26% of FY20-21. Every point of P&OC margin moves FY28E EPS by ~₹${ctx.pocPt.toFixed(0)}.` },
  ],
};

// ---------------------------------------------------------------- Moat
const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: integration and two global niches, but little pricing power',
  blocks: [
    { verdicts: D.moat.map(m => [m.dimension, m.verdict[0].toUpperCase() + m.verdict.slice(1), m.evidence, m.verdict === 'advantage' ? 'Supports returns and resilience.' : m.verdict === 'parity' ? 'Keeps Atul competitive; does not set it apart.' : 'Limits margins in downturns.']), head: ['Dimension', 'Verdict', 'Evidence', 'So what'], title: 'Moat scorecard', source: 'GAM research compilation (company filings and presentations to Sep-2026)' },
    { callout: '**Honest verdict:** Atul has a **narrow moat in LSC** (global scale in 2,4-D and indoxacarb, registrations, an integrated chain) and a **cost advantage from its integrated site**, not a moat in P&OC. In epoxy, aromatics and dyes it is a price-taker against Chinese supply: P&OC margins fell from 26% to 10% in two years. What protects shareholders is the balance sheet, not pricing power. A business like this earns 20%+ ROE at the top of the cycle (FY20) and single digits at the bottom (FY24: 6.6%).' },
  ],
};

// ---------------------------------------------------------------- Earnings quality
const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: clean books; strip out other income swings and Q1\'s inventory gains',
  blocks: [
    { bullets: [
      `**Other income is large and volatile.** ₹203 cr in FY26 (22% of PBT): fair-value gains on treasury funds ₹77 cr, exchange gains ₹44 cr, interest ₹21 cr (including a one-off tax refund), dividends ₹20 cr, an interest subsidy ₹15.5 cr. We forecast only treasury income at 4.75% plus ₹20 cr of other items (~₹${n0(F.otherIncome[0])} cr in FY27E), not exchange gains.`,
      '**Segment results include part of other income.** The sum of segment EBITDA exceeded reported EBITDA (excluding other income) by ₹128 cr in FY26 (₹97 cr in FY25, ~₹40-60 cr before). Segment margins therefore look a little better than the group\'s.',
      `**Q1FY27 had inventory gains.** Inventories fell by ₹188 cr in the quarter as stock bought earlier was sold at war-time prices; ICICI Securities called the spread jump "unlikely to sustain".`,
      '**Equity stakes go through OCI.** ~₹870 cr of listed shares (Pfizer ₹453 cr, Arvind ₹140 cr, BASF India ₹84 cr and others) move equity, not profit: total comprehensive income was ₹375 cr in Q1FY27 vs PAT ₹254 cr.',
      '**Minority interest.** Amal (49.86%) is consolidated; ₹11 cr of FY26 profit (₹8.6 cr in Q1FY27) belongs to its other shareholders. Reported EPS is on owners\' profit; our model\'s EPS is equivalent.',
      '**Audit and legal.** Deloitte Haskins & Sells: unmodified opinion, no key audit matters (FY26); contingent liabilities only ~₹11 cr; a GST demand of ₹8.3 cr plus ₹8.4 cr penalty (Dec-2025) is under appeal; ₹152 cr of guarantees for Atul Products\' loans.',
    ] },
    { callout: '**Accounting flag: GREEN.** Conservative books, a Big-4 auditor with no key audit matters, tiny contingent liabilities and no leverage. The adjustments investors should make are about earnings quality, not accounting: ignore exchange gains and fair-value swings in other income, and treat Q1FY27\'s inventory gains as one-off.' },
  ],
};

// ---------------------------------------------------------------- Ownership additions
const OW = D.ownership;
const ownership = base => ({ ...base, blocks: [
  { p: `The Lalbhai family (Chairman Sunil Lalbhai and MD Samveg Lalbhai) and family companies, led by Aagam Holdings (22.6%) and Arvind Farms (9.5%), own ${OW.pattern.promoters}% (Jun-2026). Indian institutions own ${OW.pattern.diis}%: mutual funds ${OW.pattern.mutualFunds}% (ICICI Prudential Smallcap 4.4%, DSP Small Cap 4.3%) and insurers ${OW.pattern.insurance}% (LIC 5.4%, SBI Life 3.7%). Foreign investors own only ${OW.pattern.fiis}%. The number of shareholders fell from ~67,500 (FY23) to ~56,600.` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Named holders (Jun-2026)', head: ['Holder', 'Stake', 'Type'], rows: OW.named.map(h => [h.name, h.pct.toFixed(2) + '%', h.type]), source: 'Atul shareholding pattern for the Jun-2026 quarter (Regulation 31)' } },
  { callout: `**Our read:** a stable family promoter with steady creeping additions (44.5% in 2017 to 45.3%) and a deep domestic institutional base. One blemish: ${OW.pledge} It is small (0.44% of the company) but unusual for a cash-rich promoter group.` },
] });

// ---------------------------------------------------------------- Governance
const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: conservative and long-tenured; pay, sprawl and succession are the questions',
  blocks: [
    { exhibit: { type: 'table', title: 'Key people', head: ['Name', 'Role', 'Note'], wide: [2], rows: C.management.map(m => [m.name, m.role, m.note || '']), source: 'Annual report FY26, company intimations (Jul-2026)' } },
    { verdicts: [
      ['Board', 'Strong', '7 independent directors of 11 at Mar-26 (8 of 12 from Aug-2026) (ex-HUL, ex-Indian Bank/NSDL, ex-Tata, ex-P&G, lawyers, a valuation expert); independent directors lead 83% of committees.', 'Experienced, majority independent.'],
      ['Promoter and pledge', 'Moderate', '45.3% held steadily; but the MD has pledged 48% of his direct holding (0.34% of the company).', 'Aligned; pledge is a small blemish.'],
      ['Pay', 'Weak', 'CMD paid 288x the median employee (134x before commission) in FY26; KMP pay +33% to ₹28.9 cr.', 'High for a mid-sized company.'],
      ['Succession', 'Weak', 'CMD has been MD since 1984 and the MD since 2000; no succession plan disclosed.', 'Key-person risk over the next decade.'],
      ['Group sprawl', 'Moderate', '35+ Indian subsidiaries, many dormant shells; a hospital, date palms and finance subsidiaries; Anaven JV loan overdue.', 'Non-core capital and complexity.'],
      ['Disclosure', 'Moderate', 'Good annual reports and sub-segment detail, but no earnings calls, no volumes or utilisation; growth-headroom numbers changed sharply between April and June 2026.', 'Hard to model between annual meetings.'],
      ['Audit and capital discipline', 'Strong', 'Deloitte, no key audit matters; net cash every year since FY16; no equity dilution.', 'Very conservative.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'GAM research compilation (AR FY26, shareholding pattern, intimations)' },
  ],
};

module.exports = { poc, moat, quality, ownership, governance };
