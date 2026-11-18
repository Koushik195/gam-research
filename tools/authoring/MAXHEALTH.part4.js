// Max Healthcare report, part 4: Q1FY27 & guidance, earnings quality (Network vs consolidated), ownership, governance.
const X = require('./MAXHEALTH.ctx');
const { C, D, F, A, NP, n0, n1, pc, rup, Q1, QK, AK, b, shortDate } = X;
const MEM = C.memorandumFY26, QC = Q1.consolidated;

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & guidance', kicker: 'Momentum', title: 'Q1FY27: revenue +16% with new beds, margin flat, profit +3%; management says the operating leverage comes next',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (₹ crore)', head: ['', 'Q1FY26', 'Q1FY27', 'Change'], rows: [
      { sec: 'Network (company basis, incl. partner societies)' },
      ['Gross revenue', n0(NP.Q1FY26.gross), n0(NP.Q1FY27.gross), '+16% (+20% ex-oncology)'],
      ['Operating EBITDA', n0(NP.Q1FY26.opEbitda), n0(NP.Q1FY27.opEbitda), '+15%'],
      ['  margin (on net revenue)', `${NP.Q1FY26.marginPct}%`, `${NP.Q1FY27.marginPct}%`, '−10bp'],
      ['PAT (incl. other comprehensive income)', n0(NP.Q1FY26.pat), n0(NP.Q1FY27.pat), '+3%'],
      ['Operational beds / occupancy', `${n0(QK[0].opBedsEnd)} / ${QK[0].occupancyPct}%`, `${n0(Q1.opBeds)} / ${Q1.occupancyPct}%`, '+13% / −1pp'],
      ['ARPOB (₹) / IP discharges', `${n0(QK[0].arpob)} / ${n0(QK[0].ipDischarges)}`, `${n0(Q1.arpob)} / ${n0(QK[4].ipDischarges)}`, '+5% / +10%'],
      ['International revenue', n0(QK[0].intlRevenue), n0(QK[4].intlRevenue), '+18%'],
      ['Net debt (excl. leases)', n0(NP.Q1FY26.netDebt), n0(NP.Q1FY27.netDebt), `+${n0(NP.Q1FY27.netDebt - NP.Q1FY26.netDebt)}`],
      { sec: 'MHIL consolidated (Screener; the basis of our model)' },
      ['Revenue', n0(QC.revenuePrior), n0(QC.revenue), pc((QC.revenue / QC.revenuePrior - 1) * 100)],
      ['EBITDA / margin', `${n0(QC.ebitdaPriorScreener)} / ${n1(QC.ebitdaPriorScreener / QC.revenuePrior * 100)}%`, `${n0(QC.ebitdaScreener)} / ${n1(QC.ebitdaScreener / QC.revenue * 100)}%`, pc((QC.ebitdaScreener / QC.ebitdaPriorScreener - 1) * 100)],
      { hl: true, cells: ['**Net profit / EPS (₹)**', `**${n0(QC.patPrior)} / 3.17**`, `**${n0(QC.pat)} / ${QC.eps}**`, `**${pc((QC.pat / QC.patPrior - 1) * 100)}**`] },
    ], source: 'Q1FY27 release and presentation (13-Aug-2026); call (14-Aug-2026); Screener.in' } },
    { bullets: [
      '**Why profit grew only 3-5%:** ₹195 cr of overheads for new units (Smart, Nanavati and Mohali towers, Kalinga) came before their revenue; Network depreciation rose 28% and net finance cost ~80% on the new towers and the ECB for Kalinga; the tax rate rose to 24-26%.',
      '**Growth quality:** OBDs +10% and ARPOB +5%; excluding oncology revenue grew 20% and ARPOB 9%. Kalinga added ₹19 cr of revenue (from 18-May) at 50% occupancy and a ₹35k ARPOB.',
      '**Cash:** free cash from operations ₹397 cr (56% of EBITDA vs a normal 62-65%) as CGHS/PSU receivables built up by ~₹250 cr (DSO 95 days); ₹386 cr went on Kalinga and YPPL and ₹337 cr on projects.',
    ] },
    { exhibit: { type: 'table', title: 'What management said (May-Aug 2026)', head: ['When', 'Topic', 'What was said', 'Outcome so far'], wide: [2, 3], rows: C.guidance.map(g => [shortDate(g.date), g.item, rup(g.said), g.outcome || '–']), source: rup(C.guidanceSrc) } },
    { callout: '**Why it matters:** Max does not give revenue or margin guidance; it guides on beds and on the shape of the ramp ("first occupancy, then revenue, then EBITDA"). The test in the next two quarters is simple: with indirect costs flat until Gurugram opens, EBITDA should grow faster than revenue. If it does not, the new capacity is less profitable than the old.' },
  ],
};

const AC = C.accounting;
const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: clean audits, but two sets of numbers and a string of one-offs',
  blocks: [
    { bullets: [
      `**Network vs consolidated.** ${rup(AC.basis)} In FY26 the partner societies added ₹${n0(MEM.opEbitda.balaji + MEM.opEbitda.gmModi + MEM.opEbitda.devkiDevi)} cr of EBITDA and ₹${n0(MEM.pat.balaji + MEM.pat.gmModi + MEM.pat.devkiDevi)} cr of profit that MHIL does not own; MHIL earns from them through fees (₹638 cr of intra-network revenue) and interest on ₹746 cr of loans.`,
      `**One-offs.** ${rup(AC.oneOffs)} Reported EPS was ₹11.37 / 10.88 / 11.07 / 14.82 in FY23-26; before one-offs ₹${n1(X.EPS_ADJ.FY23)} / ${n1(X.EPS_ADJ.FY24)} / ${n1(X.EPS_ADJ.FY25)} / ${n1(X.EPS_ADJ.FY26)}. We use the adjusted series for growth rates and the P/E cross-check.`,
      `**Goodwill and intangibles.** ${rup(AC.intangibles)}`,
      `**Leases.** ${rup(AC.leases)}`,
      `**Working capital.** ${rup(AC.workingCapital)} Operating cash was ${Math.round(A.cfoToEbitda[b])}% of EBITDA in FY26 (${Math.round(A.cfoToEbitda[b - 1])}% in FY25).`,
      '**Non-cash items below "operating EBITDA".** The company\'s headline EBITDA excludes ESOP cost (₹48 cr in FY26) and fair-value moves on contingent consideration owed to societies (₹10 cr gain in FY26); Screener\'s EBITDA (our base) is after them.',
      '**Audit.** S.R. Batliboi & Co. LLP (EY); unqualified. The Network memorandum consolidation is certified by an independent firm but the societies\' IGAAP numbers are not audited by Max\'s auditor.',
    ] },
    { callout: '**Accounting flag: AMBER.** Nothing suggests aggressive accounting, and disclosure is better than most peers (Network and consolidated, memorandum consolidation every quarter). But investors must do work to compare like with like: the company\'s headline EBITDA, PAT and KPIs include hospitals it does not own, tax one-offs have flattered reported EPS in two of the last four years, and merger goodwill hides the true return on capital.' },
  ],
};

const OH = D.ownership;
const ownership = base => ({ ...base, blocks: [
  { p: `The promoter, Abhay Soi, owns ${OH.categoriesPct.promoter}% (Jun-2026) personally, with no pledge reported. Foreign investors own ${OH.categoriesPct.fii}% (down from 54.8% a year earlier), Indian mutual funds ${OH.categoriesPct.mf}% and other domestic institutions (insurers incl. LIC) ${OH.categoriesPct.otherDii}%; the public holds only ${OH.categoriesPct.public}%. ${rup(OH.peExits)}` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Largest holders', head: ['Holder', 'Stake', 'Note'], wide: [2], rows: [
    ...OH.promoterVehicles.map(h => [h.name, h.pct + '%', 'Promoter (individual), 23.07 cr shares']),
    ['All promoters (Jun-2026)', OH.categoriesPct.promoter + '%', 'No pledge reported'],
    ...OH.institutions.map(h => [h.name, h.pct + '%', `${h.asOf}${h.prior ? `; ${h.prior}% a year earlier` : ''}`]),
    ['Other large holders (Jun-2026, company list)', '–', rup(OH.topPublicJun26)],
  ], source: rup(OH.src) } },
  { callout: '**Our read:** a professional promoter with a large personal stake (worth ~₹21,000 cr at the as-of price), a register dominated by long-only institutions, and no PE overhang since KKR left in 2022. The steady rotation from foreign to Indian funds over the last year has coincided with a 28% fall from the Jul-2025 high; the remaining foreign holders (42%) are still the swing factor for the share price.' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: strong board and disclosure, very high CMD pay, a complex structure',
  blocks: [
    { exhibit: { type: 'table', title: 'Key people', head: ['Name', 'Role', 'Note'], wide: [2], rows: C.management.map(m => [m.name, m.role, m.note || '']), source: rup(C.managementSrc) } },
    { verdicts: [
      ['Audit and accounts', 'Strong', 'S.R. Batliboi (EY), unqualified; Network and consolidated numbers reconciled every quarter; CARE AA+ (Stable).', 'No red flags; read the basis carefully.'],
      ['Promoter', 'Good', 'Abhay Soi 23.7%, no pledge; architect of the BLK, Nanavati and Max turnarounds.', 'Aligned, but a single-person franchise.'],
      ['Pay', 'Weak', 'CMD fixed pay ₹27.4 cr in FY26, 627x the median employee (he waived FY26 variable pay; ₹8.6 cr variable for FY25 was paid in FY26).', 'High even for a top Indian CEO; watch ESOP dilution too (~0.1% a year).'],
      ['Board', 'Strong', '8 directors, 5 independent incl. two former HCA executives (Michael Neeb, Dr Pranav Mehta); one woman director.', 'Healthcare-literate oversight.'],
      ['Related parties and structure', 'Watch', 'Radiant Life Care (Soi family) is a related party; three partner societies run by Max but not owned; ₹746 cr lent to one of them (9.25%).', 'Economic rights are contractual (to 2064-2105), not ownership.'],
      ['Capital allocation', 'Good but stretched', 'Lucknow EBITDA ~5x its acquisition level (CMD); Dwarka broke even in 6 months; but ~₹7,000 cr of new projects, acquisitions up to 2.5x net debt/EBITDA and a medical-college plan at once.', 'Execution bandwidth and returns are the key test.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'GAM research compilation (AR FY26; company releases and calls)' },
  ],
};

module.exports = { guidance, quality, ownership, governance, forecasts: require('./MAXHEALTH.part4b').forecasts };
