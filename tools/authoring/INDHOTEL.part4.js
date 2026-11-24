// Indian Hotels report, part 4: Q1FY27 & guidance, earnings quality, ownership, governance.
const X = require('./INDHOTEL.ctx');
const { C, D, n0, n1, Q1, FY26 } = X;
const G = C.guidance, AC = C.accounting, MN = C.management, MI = C.minorities;

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & guidance', kicker: 'Momentum', title: 'Q1FY27: revenue +15%, EBITDA +17%, profit +21%; management guides 12-14% for FY27 and says Q2 started better',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (₹ crore)', head: ['', 'Q1FY26', 'Q1FY27', 'Change'], rows: [
      ['Revenue from operations', '2,041', n0(Q1.revenueOp), '+15%'],
      ['  Hotels', '1,754', n0(Q1.hotelOpRev), '+17%'],
      ['  Air catering (TajSATS)', '287', n0(Q1.acOpRev), '+3%'],
      ['Operating EBITDA / margin', '576 / 28.2%', `${n0(Q1.opEbitda)} / ${Q1.opEbitdaMarginPct}%`, '+17% / +0.6 pp'],
      ['  Hotels / margin', '509 / 29.0%', `${n0(Q1.hotelOpEbitda)} / ${Q1.hotelOpMarginPct}%`, '+21%'],
      ['  Air catering / margin', '66 / 23.0%', `${n0(Q1.acOpEbitda)} / ${Q1.acOpMarginPct}%`, '−13%'],
      ['Room revenue / F&B / other / fees', '857 / 589 / 161 / 133 (derived)', `${Q1.roomRev} / ${Q1.fnbRev} / ${Q1.otherOpIncome} / ${Q1.mgmtFees}`, `+${Q1.roomGrowthPct}% / +${Q1.fnbGrowthPct}% / +${Q1.otherGrowthPct}% / +${Q1.mgmtFeesGrowthPct}%`],
      ['Profit before tax', '440', n0(Q1.pbt), '+21%'],
      { hl: true, cells: ['**Profit attributable to owners / EPS (₹)**', '**296 / 2.08**', `**${n0(Q1.patAttributable)} / ${Q1.eps}**`, '**+21%**'] },
      ['Gross cash', '–', n0(Q1.grossCashJun26), 'from ₹4,345 cr at Mar-26'],
    ], source: 'Q1FY27 deck (21-Jul-2026) slides 6, 26, 31; Screener.in. Q1FY26 streams derived from the Q1FY27 growth rates.' } },
    { bullets: [
      `**What went right:** domestic RevPAR +${Q1.domesticRevparGrowthPct}% with standalone occupancy ${Q1.standaloneOccupancyPct}% (${Q1.standaloneOccupancyPyPct}%), renovated hotels driving rates (Fort Aguada, Taj Palace), management fees +${Q1.mgmtFeesGrowthPct}%, Ginger +${Q1.gingerGrowthPct}%, Atmantan and Brij adding ₹30 cr of revenue.`,
      `**What went wrong:** TajSATS (+3%, margin ${Q1.acOpMarginPct}%) and the international hotels (St James Court EBITDA ₹36 cr vs ₹48 cr) were hit by the West Asia conflict and airline capacity cuts; ~₹${Q1.oneOffCosts}-15 cr of start-up costs for Frankfurt and the Noida kitchen.`,
      '**Q2 outlook (said on 21-Jul-2026):** "July is trending ahead of where we are on Q1"; management expected Q2 growth at least as good as Q1\'s 14.6% and did not change the 12-14% FY27 guide.',
    ] },
    { exhibit: { type: 'table', title: 'What management said (May-Jul 2026)', head: ['Topic', 'What was said'], wide: [1], rows: [
      ['FY27 revenue', G.fy27Revenue], ['Q2', G.q2], ['Acquisitions', G.acquisitions], ['Management fees', G.mgmtFees], ['Openings', G.openings], ['Capex', G.capex], ['Ginger', G.ginger],
      ['Accelerate 2030 targets', `Revenue ₹${n0(G.accelerate2030.revenue)} cr (FY26 ₹9,971 cr incl. other income), ${G.accelerate2030.hotels} hotels, ROCE ${G.accelerate2030.roce} (17.4% in FY26), net cash positive; excludes future acquisitions`],
    ], source: 'Q4FY26 call (11-May-2026); Q1FY27 call (21-Jul-2026); AR FY26 p.18' } },
    { callout: '**Why it matters:** the guide implies ~7-9% like-for-like growth plus 4-5 points from new hotels and deals. Q1 delivered the top end (14.6%) despite the travel shock. The test is H2: the peak wedding and MICE season and the TajSATS recovery. Our FY27E consolidated growth of {{F.salesGrowth.0|pct}} sits at the top of the guide.' },
  ],
};

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: clean audits and strong cash, but exceptional items every year and a rising minority share',
  blocks: [
    { bullets: [
      `**Exceptional items.** ${AC.exceptionalEveryYear} FY26 reported PAT ₹${n0(FY26.reportedPat)} cr vs ₹${n0(FY26.patBei)} cr before exceptional items; FY25 ₹1,908 cr vs ₹${n0(C.fy25.patBei)} cr. We value and forecast on profit before exceptional items.`,
      `**Minorities.** Partners own 49% of TajSATS, 41% of PIEM, 48% of Benares, 20% of St James Court and 49% of ANK, Pride, Atmantan and Brij. FY26: TajSATS ₹85 cr, PIEM ₹40 cr, Benares ₹21 cr, St James Court ₹7 cr, others ₹11 cr = ~₹163 cr (7% of profit before minorities, up from 5% in FY23-24); ₹33 cr in Q1FY27 alone. Every 2025-26 deal adds a 49% partner. Minority interest on the balance sheet rose from ₹672 cr to ₹1,887 cr in two years.`,
      `**Leases.** ${AC.leases}`,
      `**Goodwill.** ${AC.goodwill}`,
      `**TajSATS revenue.** ${AC.airportLevy}`,
      `**Cash conversion.** Operating cash ${Math.round(X.A.cfoToEbitda[X.b])}% of EBITDA in FY26 (${Math.round(X.A.cfoToEbitda[X.b - 1])}% in FY25); company free cash flow ₹${n0(FY26.fcf)} cr = 75% of profit before exceptional items.`,
    ] },
    { callout: '**Accounting flag: AMBER.** Nothing aggressive in the accounts, and the cash is real (net cash ~₹4,300 cr, AAA rating). But reported profit has been lifted by one-off gains in each of the last two years, smaller charges keep appearing below the line (key money, labour codes, contingencies), and the share of profit going to minority partners is rising with each 51% acquisition.' },
  ],
};

const OH = D.ownership;
const ownership = base => ({ ...base, blocks: [
  { p: `The Tata group owns ${OH.categoriesPct.promoter}% (Jun-2026): Tata Sons 35.66% plus small holdings by Tata Investment, Tata Chemicals and others; no pledge. Foreign investors own ${OH.categoriesPct.fii}% (27.8% in Dec-2024), mutual funds ${OH.categoriesPct.mf}%, insurers ${OH.categoriesPct.insurance}% and other domestic institutions (incl. the NPS Trust) ~${OH.categoriesPct.otherDii}%; the public ${OH.categoriesPct.public}% across ${n0(OH.shareholders)} shareholders.` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Largest holders', head: ['Holder', 'Jun-2026', 'Mar-2026'], rows: [
    ...OH.promoterVehicles.map(h => [`${h[0]} (promoter group)`, h[1] + '%', h[1] + '%']),
    ...OH.institutions.map(h => [h[0], h[1] + '%', h[2] + '%']),
  ], source: OH.src } },
  { callout: '**Our read:** a stable, patient promoter (Tata Sons has held ~35.7% for years and its chairman chairs IHCL) and a register shifting from foreign to Indian institutions. Foreign selling over 2025-26 coincided with the stock falling from its 2025 highs; Indian mutual funds, insurers and the NPS Trust have been the buyers.' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: Tata board, AAA balance sheet, steady management; pay is high and group dealings need watching',
  blocks: [
    { exhibit: { type: 'table', title: 'Key people', head: ['Name', 'Role'], rows: [...MN.board, ...MN.kmp], source: 'AR FY26' } },
    { verdicts: [
      ['Board and promoter', 'Strong', 'Chaired by N. Chandrasekaran (Tata Sons chairman, no commission); four independent directors.', 'Tata governance standards; long-term owner.'],
      ['Balance sheet discipline', 'Strong', 'From net debt in FY22 to ~₹4,300 cr net cash; ICRA AAA (Stable).', 'Room for deals without equity.'],
      ['Pay', 'Watch', `MD & CEO pay ${MN.ceoPayToMedian}x the median employee (FY26); KMP increases ${MN.kmpPayRisePct}% vs ${MN.staffPayRisePct}% for staff.`, 'High, though in line with large Indian peers.'],
      ['Related parties', 'Watch', 'Oriental Hotels (37% group stake) being merged at 25:117; Tata Neu loyalty and group procurement; IHCL manages hotels for associates.', 'Merger terms set by the group on both sides; minorities of OHL get IHCL paper.'],
      ['Capital allocation', 'Good, with caveats', 'Renovations earning visible returns (Varanasi wing 40% margin in Q1); but four 51% acquisitions in a year and owned greenfields (Bandstand ~450 keys) tie up capital.', 'ROCE 17.4% vs 20%+ target.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'AR FY26; company decks and calls; GAM Research' },
  ],
};

module.exports = { guidance, quality, ownership, governance, forecasts: require('./INDHOTEL.part4b').forecasts };
