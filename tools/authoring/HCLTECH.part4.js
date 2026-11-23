// HCL Technologies report, part 4: Q1FY27 & guidance, earnings quality, ownership, governance.
const X = require('./HCLTECH.ctx');
const { C, D, F, A, AS, n0, n1, pc, rup, Q1, FY26, b, shortDate, OI26 } = X;

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & guidance', kicker: 'Momentum', title: 'Q1FY27: a beat on margins and record bookings, but guidance held at 1-4%',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance', head: ['', 'Q1FY26', 'Q1FY27', 'Change'], rows: [
      ['Revenue, US$ m', n0(Q1.prior.usdRev), n0(Q1.usdRev), `${pc(Q1.usdYoYPct)} (CC ${pc(Q1.ccYoYPct)})`],
      ['Revenue, ₹ cr', n0(Q1.prior.inrRev), n0(Q1.inrRev), pc(Q1.inrRevYoYPct)],
      ['  IT & Business Services, CC YoY', '', `${Q1.itbsCcYoYPct}%`, 'flat QoQ'],
      ['  Engineering & R&D, CC YoY', '', `${Q1.ersCcYoYPct}%`, '−3.7% QoQ'],
      ['  HCLSoftware, CC YoY', '', `${Q1.swCcYoYPct}%`, '+2.2% QoQ'],
      ['EBIT, ₹ cr (margin)', `${n0(Q1.prior.ebit)} (${Q1.prior.ebitPct}%)`, `${n0(Q1.ebit)} (${Q1.ebitPct}%)`, '+18%; +56 bp'],
      ['EBIT margin excluding restructuring', '16.3%', `${Q1.ebitExRestructuringPct}%`, '+120 bp'],
      ['Segment EBIT: ITBS / ERS / Software', `${Q1.prior.itbsEbitPct}% / ${Q1.prior.ersEbitPct}% / ${Q1.prior.swEbitPct}%`, `${Q1.itbsEbitPct}% / ${Q1.ersEbitPct}% / ${Q1.swEbitPct}%`, ''],
      { hl: true, cells: ['**Net income, ₹ cr / EPS (₹)**', '**3,843 / 14.2**', `**${n0(Q1.netIncome)} / ${Q1.eps}**`, `**${pc(Q1.niYoYPct)}**`] },
      ['New deal TCV, US$ m', n0(Q1.prior.tcvUsd), n0(Q1.tcvUsd), '+33%'],
    ], source: 'Q1FY27 investor release (13-Jul-2026); Screener.in' } },
    { p: rup(Q1.marginBridge) },
    { bullets: Q1.callPoints.map(rup) },
    { exhibit: { type: 'table', title: 'What management said (Jul-2025 to Jul-2026)', head: ['When', 'Topic', 'What was said', 'Outcome so far'], wide: [2, 3], rows: C.guidance.map(g => [shortDate(g.date), g.item, rup(g.said), g.outcome || '–']), source: 'HCLTech investor releases and calls' } },
    { callout: `**Why it matters:** management missed its raised FY26 revenue band by 10 bp and cut its margin band during FY26, but it has delivered close to guidance for years, and the FY27 band (1-4% CC, 17.5-18.5% EBIT) looks achievable: Q1 was +2.6% YoY with EBIT 17.5% before restructuring. The issue is not credibility; it is that the guided growth is low. Our FY27E (${n1(X.ccGrowth[0])}% CC including Jaspersoft, ${n1(X.ebitM[0])}% EBIT) sits near the middle of both bands.` },
  ],
};

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: clean accounts and strong cash; watch the hedge book, the "one-offs" and acquisition accounting',
  blocks: [
    { bullets: [
      `**Cash backs profit.** Operating cash flow was ${Math.round(A.cfoToPat[b])}% of attributable profit in FY26, ${Math.round(A.cfoToPat[b - 1])}% in FY25 and ${Math.round(A.cfoToPat[b - 2])}% in FY24; the company's free cash flow was 107% of net income in FY26 and 99% on a twelve-month basis at Jun-2026. Cash from operations has exceeded profit every year since FY20 (FY18-19 were 89-96%).`,
      '**"One-offs" recur.** Restructuring cost ~65 bp of margin in FY26 and 62 bp in Q1FY27, and FY27 guidance includes another 40-50 bp: three years of "one-time" charges. The Labour Codes charge (₹956 cr, Q3FY26) is genuinely one-off, with a 10-20 bp recurring cost. We treat restructuring as an operating cost in FY27 and assume none after.',
      `**Other income is mostly treasury.** FY26 other income ₹${n0(OI26.total)} cr (company): interest and fund income ₹${n0(OI26.treasury)} cr, other recurring items ₹${OI26.nonTreasury} cr, forex −₹241 cr. FY25's ₹2,485 cr included a ₹574 cr gain on divesting the State Street JV. Screener's FY26 figure (₹${n0(A.otherIncome[b])} cr) nets the Labour Codes charge.`,
      '**Hedges.** A US$1.6 bn USD/INR forward book carried a ₹1,466 cr mark-to-market loss at Mar-2026 (hedging reserve −₹1,062 cr after tax), with hedged transactions running to Dec-2030; settlement losses go through the forex line. Not an accounting problem, but it dilutes the rupee benefit.',
      '**Acquired IP.** About three-quarters of net fixed assets are goodwill (₹23,888 cr at Mar-2026) and other intangibles (~₹5,200 cr), mostly from the IBM software products, Actian and other deals. Amortisation runs through D&A, so EBIT is after it; we do not adjust it back.',
      '**Pay.** CEO pay of US$18.1 m in FY26 (292x the median employee) and ₹131 cr of share-based pay for key managers: high for a company growing 4%.',
      '**Disclosure.** Good on segments, verticals, geographies, clients, software ARR and Advanced AI; utilisation and segment D&A are no longer disclosed.',
    ] },
    { callout: '**Accounting flag: GREEN.** Unqualified audit by B S R & Co. LLP (re-appointed to 2029), strong cash conversion, net cash, clear segment reporting. The items to watch are the recurring "restructuring" line, the hedge losses as the rupee falls, and goodwill on the newer acquisitions (Jaspersoft, HPE Telco Solutions).' },
  ],
};

const OH = D.ownership;
const ownership = base => ({ ...base, blocks: [
  { p: `The Nadar family controls HCLTech through holding companies: Vama Sundari Investments (Delhi) held 44.21% and HCL Holdings 16.46% at Mar-2026, with smaller stakes in HCL Corporation, the Shiv Nadar Foundation and the Kiran Nadar Museum of Art; the promoter group held ${OH.categoriesPct.promoter}% at Jun-2026. No promoter shares are pledged. Foreign investors held ${OH.categoriesPct.fii}% (down from 19.4% in Dec-2024), Indian institutions ${OH.categoriesPct.dii}% (mutual funds 9.2% and insurers, banks and pension funds 9.7% at Mar-2026) and the public ${OH.categoriesPct.public}%. Shareholders jumped to ~${n1(OH.counts.shareholders / 1e5)} lakh at Jun-2026 from ~${n1(OH.counts.shareholdersMar26 / 1e5)} lakh in March as retail investors bought the fall.` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Largest holders', head: ['Holder', 'Stake', 'Note'], wide: [2], rows: [
    ...OH.namedMar26.map(h => [h.name, h.pct + '%', 'At 31-Mar-2026']),
    ['Promoter group (Jun-2026)', OH.categoriesPct.promoter + '%', 'Unchanged in substance for years'],
    ['Foreign portfolio investors (Jun-2026)', OH.categoriesPct.fii + '%', 'Mar-2026: 15.6% (AR)'],
    ['Domestic institutions (Jun-2026)', OH.categoriesPct.dii + '%', 'Mar-2026: mutual funds 9.22%, insurers/banks/pension funds 9.66%'],
  ], source: OH.src + '. Named institutional holders at Jun-2026 were not available to us.' } },
  { callout: '**Our read:** a stable, founder-controlled company with a professional CEO. The family has been a patient owner and has backed the high-payout policy, which suits its holding companies (Vama Sundari received ₹6,472 cr of dividends in FY26). Foreign investors have been sellers for two years; domestic funds have absorbed it.' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: a clean, family-controlled board; pay is the weak spot',
  blocks: [
    { exhibit: { type: 'table', title: 'Key people', head: ['Name', 'Role', 'Note'], wide: [2], rows: C.management.map(m => [m.name, m.role, rup(m.note || '')]), source: C.managementSrc } },
    { verdicts: [
      ['Audit and accounts', 'Strong', 'B S R & Co. LLP, re-appointed in Aug-2024 to the 2029 AGM; unqualified FY26 opinion.', 'No accounting red flags.'],
      ['Board', 'Adequate', 'Chairperson is the promoter (Roshni Nadar Malhotra); her husband is a non-executive director; independent directors include Amitabh Kant, Bhavani Balasubramanian, Deepak Kapoor, Lee Fang Chew, Nishi Vasudeva, Simon England, Vanitha Narayanan and Kimsuka Narsimhan (from Apr-2026).', 'Family control, professional management.'],
      ['Promoters', 'Strong', '60.9% held through family companies; no pledges; dividends are the family\'s main income from the stake.', 'Aligned with minority shareholders on payouts.'],
      ['Management', 'Strong', 'CEO C Vijayakumar since 2016 (re-appointed to Mar-2030); long-tenured CFO and leadership.', 'Continuity through the AI transition.'],
      ['Pay', 'Watch', 'CEO US$18.1 m in FY26 (+67% including LTI), 292x the median employee; KMP share-based pay ₹131 cr.', 'High relative to growth.'],
      ['Capital allocation', 'Good, with a new risk', '90% payout; small, mostly sensible acquisitions; FY27 adds Sarvam (US$150 m) and an AI data-centre business.', 'Watch returns on the data-centre capital.'],
      ['Related parties', 'Clean', 'Dealings with family entities are small (receivables ₹32 cr, payables ₹43 cr at Mar-2026).', 'No concern.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'GAM research compilation (AR FY26, shareholding patterns, filings)' },
  ],
};

module.exports = { guidance, quality, ownership, governance };
