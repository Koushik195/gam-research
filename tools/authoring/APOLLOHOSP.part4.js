// Apollo report, part 4: Q1FY27 & guidance, earnings quality, ownership, governance, forecasts.
const X = require('./APOLLOHOSP.ctx');
const { C, D, F, A, AS, n0, n1, pc, rup, Q1, FY26, b, YRS, SEG, BH, disch, ipRev, netRev, arpob, RENT, preEbitda, preMargin, pl, isec, shortDate, ann } = X;
const SQ1 = X.SQ.find(q => q.q === 'Q1FY27'), SQ0 = X.SQ.find(q => q.q === 'Q1FY26');

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & guidance', kicker: 'Momentum', title: 'Q1FY27: revenue +21%, EBITDA +28%, profit +34%; management guides ~20% hospital growth',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (₹ crore)', head: ['', 'Q1FY26', 'Q1FY27', 'Change'], rows: [
      ['Revenue (as published)', n0(SQ0.consRev), n0(SQ1.consRev), pc((SQ1.consRev / SQ0.consRev - 1) * 100)],
      ['  Hospitals / HealthCo / AHLL', `${n0(SQ0.hcsRev)} / ${n0(SQ0.hcoRev)} / ${n0(SQ0.ahllRev)}`, `${n0(SQ1.hcsRev)} / ${n0(SQ1.hcoRev)} / ${n0(SQ1.ahllRev)}`, '+22% / +20% / +15%'],
      ['Operating beds / occupancy', `${n0(Q1.bedsPrior)} / ${Q1.occupancyPriorPct}%`, `${n0(Q1.beds)} / ${Q1.occupancyPct}%`, '+4% / +5pp'],
      ['Discharges / ALOS (days) / revenue per in-patient (₹)', '151,517 / 3.14 / 172,328', `${n0(Q1.discharges)} / ${Q1.alos} / ${n0(Q1.arpp)}`, '+13% / −2% / +8%'],
      ['EBITDA: hospitals / HealthCo / AHLL', `${n0(SQ0.hcsEbitda)} / ${n0(SQ0.hcoEbitda)} / ${n0(SQ0.ahllEbitda)}`, `${n0(SQ1.hcsEbitda)} / ${n0(SQ1.hcoEbitda)} / ${n0(SQ1.ahllEbitda)}`, '+20% / +83% / +46%'],
      ['EBITDA (post-Ind AS) / margin', `${n0(SQ0.consEbitda)} / 14.6%`, `${n0(SQ1.consEbitda)} / 15.5%`, '+28% / +90bp'],
      ['Other income incl. associates / interest / depreciation', '53.8 / 108.3 / 214.7', `${n1(Q1.otherIncome + Q1.associates)} / ${n1(Q1.interest)} / ${n1(Q1.dep)}`, ''],
      ['Minorities', '8.2', n1(Q1.minorities), '3.6x'],
      { hl: true, cells: ['**Net profit to owners**', '**432.8**', `**${n1(580.7)}**`, '**+34%**'] },
    ], source: 'Q1FY27 presentation (12-Aug-2026) and call (13-Aug-2026); ICICI Direct and PL quarterly tables (14-Aug-2026)' } },
    { bullets: [
      '**Growth quality:** established hospitals grew 18% (volume +11%, price +4%, case and payer mix +3%), helped by a 60% quarter-on-quarter rebound in Bangladesh patients (still 60-70% of their peak); the five new hospitals added ₹92 cr. Management called the volume growth "not seasonal" and broad-based.',
      '**Margins:** established-hospital margin 25.9% (24.5% for all hospitals a year earlier); new hospitals lost ₹38 cr. HealthCo\'s margin rose to 5.8% as digital costs fell; AHLL to 11.8% on diagnostics.',
      '**Watch:** minorities jumped to ₹30 cr (₹8 cr a year earlier) without explanation; the Parliamentary committee\'s pricing report landed a week before the call.',
    ] },
    { exhibit: { type: 'table', title: 'What management said (May-Aug 2026)', head: ['Topic', 'What was said', 'Source'], wide: [1], rows: C.guidance.map(g => [g.item, rup(g.value), /^http/.test(g.src) ? `${/2026-05/.test(g.src) ? 'Q4FY26 call' : /0a967b34/.test(g.src) ? 'Q1FY27 presentation' : 'Q1FY27 call'} (${shortDate(g.published)})` : `${g.src} (${shortDate(g.published)})`]), source: 'Company presentations and earnings calls' } },
    { exhibit: { type: 'table', title: 'Q1FY27 call: the points that matter', head: ['#', 'Point'], wide: [1], rows: Q1.callPoints.map((p, i) => [String(i + 1), rup(p)]), source: 'Q1FY27 earnings call transcript (13-Aug-2026)' } },
    { callout: '**Why it matters:** management\'s guidance (18-20% hospital growth, ~26% established margin, ~₹150 cr of new-hospital losses) is credible after Q1, and our FY27 forecast sits inside it. The bigger NewCo promise (₹25,000 cr run-rate at 6.5-7% EBITDA by Q4FY27) needs HealthCo and Keimed margins to rise faster than they have; we model less.' },
  ],
};

const AC = C.accounting;
const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: clean audit, but four things distort the headline numbers',
  blocks: [
    { bullets: [
      `**Leases (Ind AS 116).** ${rup(AC.indAs116)} Pre-Ind AS (after rent) the FY26 EBITDA margin was ~${n1((A.ebitda[b] - RENT.FY26) / A.sales[b] * 100)}%, not 15.0%. We value on post-Ind AS EBITDA and count lease liabilities as debt, consistently.`,
      `**Advent's CCPS.** ${rup(AC.ccps)} It inflates Screener's debt by ₹2,457 cr; we add it back in the SOTP because Advent's claim is in the 40.4% of NewCo we do not value.`,
      `**Minorities.** Profit to minorities was ₹61 cr in FY26 (Assam ₹23 cr, Lucknow ₹20 cr, Ahmedabad ₹12 cr, Imperial ₹9 cr) and ₹30 cr in Q1FY27 alone. Screener's "net profit" is before them; we use profit attributable to shareholders and deduct the minorities' share of value.`,
      '**Restated quarters.** Screener now shows Q2FY26 and Q1FY27 revenue lower than first published (₹6,189 cr and ₹6,932 cr vs ₹6,303.5 cr and ₹7,043.5 cr); we use the figures published by 30-Sep-2026.',
      `**ESOPs and one-offs.** ${rup(AC.esop)} FY26 had a ₹19 cr labour-code provision (exceptional); FY22 had ₹220 cr of exceptional gains. Other income (₹237 cr in FY26 incl. associates) is ~9% of pre-tax profit, mostly treasury gains.`,
      `**Cash conversion.** Operating cash flow was ${Math.round(A.cfoToEbitda[b])}% of EBITDA in FY26 (${Math.round(A.cfoToEbitda[b - 1])}% in FY25), and lease payments (₹291 cr) come on top in financing cash flow.`,
      '**Audit.** Deloitte Haskins & Sells, unqualified FY26 opinion; Price Waterhouse takes over after the 2027 AGM (rotation).',
    ] },
    { callout: '**Accounting flag: AMBER.** Nothing suggests the numbers are wrong, but the reported structure is complex: three kinds of "debt", a pharmacy business whose economics are being redistributed, minorities in five hospital subsidiaries, a related-party wholesaler (Keimed, ₹968 cr of purchases in FY26) and restated quarters. Investors who take Screener\'s net profit, debt and EV at face value will mis-value the stock.' },
  ],
};

const OH = D.ownership, J = OH.jun2026;
const ownership = base => ({ ...base, blocks: [
  { p: `The Reddy family owns ${J.promoters}% (Jun-2026), mostly through PCR Investments (18.93%); the four daughters (Preetha, Suneeta, Sangita, Shobana) hold 0.7-2.0% each. The family's stake has fallen from 34.4% in Mar-2019 and from 29.3% to 28.0% in Q2FY26 after Suneeta Reddy sold 1.32%. Foreign investors own ${J.fiis}% (down from 46% in Dec-2023), Indian institutions ${J.diis}% (mutual funds ~17%) and the public ${J.public}%. ${rup(OH.pledge)}` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Largest holders', head: ['Holder', 'Stake', 'Note'], wide: [2], rows: [
    ...OH.promoterEntities.map(h => [h.name, h.pct + '%', 'Promoter group (31-Mar-2026)']),
    ['All promoters (Jun-2026)', J.promoters + '%', 'Small pledge (see text)'],
    ...OH.topHoldersMar26.map(h => [h.name, h.pct + '%', /Singapore|Norway|Global/.test(h.name) ? 'Foreign investor (31-Mar-2026)' : 'Domestic fund / insurer (31-Mar-2026)']),
  ], source: rup(OH.src) } },
  { callout: '**Our read:** a founder family with only 28% and a long, slow sell-down, running the company through four family executives; but a very institutional register (65% FII+DII) and deep liquidity. The bigger alignment question is the scheme: the family is on both sides of the Keimed merger.' },
] });

const G = C.governance;
const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: professional operations, family control, and a related-party merger to watch',
  blocks: [
    { exhibit: { type: 'table', title: 'Key people', head: ['Name', 'Role', 'Note'], wide: [2], rows: C.management.map(m => [m.name, m.role, rup(m.note || '')]), source: 'AR FY26 (remuneration table, notice), Q1FY27 call' } },
    { verdicts: [
      ['Audit and accounts', 'Good', 'Deloitte, unqualified; detailed segment, KPI and Ind AS 116 disclosure every quarter.', 'Complex structure, but well disclosed.'],
      ['Promoter', 'Moderate', `Family at 28.0% and selling slowly; family pay ₹${G.promoterPayCr} cr in FY26 (${G.promoterPayPctOfConsPat}% of profit); founder (Executive Chairman) up for re-appointment.`, 'Control without a large economic stake.'],
      ['Related parties', 'Watch', rup(G.relatedParty), 'The swap ratio decides how much value moves to the family.'],
      ['Management depth', 'Good', 'Group CFO A. Krishnan; hospital CEO Dr Madhu Sasidhar; separate CEOs for HealthCo and AHLL.', 'Bench is deep for a family company.'],
      ['Legal and regulatory', 'Watch', rup(G.landDispute) + ' Parliamentary pricing review (Aug-2026).', 'Low cost so far; headline risk.'],
      ['Capital allocation', 'Good', 'Cradle sold at ~35x EBITDA; IFC bought out; bed plan self-funded; Advent money used for Keimed shares.', 'Sensible, but returns on FY30-31 greenfields are untested.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'GAM research compilation (AR FY26, filings to Sep-2026)' },
  ],
};

module.exports = { guidance, quality, ownership, governance, forecasts: require('./APOLLOHOSP.part4b').forecasts };
