// Infosys report, part 3: moat, Q1FY27 & guidance, earnings quality, ownership, governance.
const X = require('./INFY.ctx');
const { C, D, F, A, AS, n0, n1, pc, rup, Q1, FY26, b, OI, shortDate, P } = X;

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: a narrow moat that protects relationships, not prices',
  blocks: [
    { verdicts: D.moat.map(r => r.map(rup)), head: ['Dimension', 'Verdict', 'Evidence', 'So what'], title: 'Moat scorecard', source: 'GAM research compilation (fact sheets, AR FY26, calls and broker notes to Sep-2026); peers from Screener.in' },
    { callout: `**Honest verdict:** Infosys has a real but narrow moat. Large clients do not switch IT vendors lightly - the knowledge of their systems, the security clearances and the risk of a botched transition all favour the incumbent - and Infosys's ~21% margin (Screener EBITDA margin ${P.INFY.ebitdaMargin}% in FY26 vs TCS ${P.TCS.ebitdaMargin}%, HCLTech ${P.HCLTECH.ebitdaMargin}%, Wipro ${P.WIPRO.ebitdaMargin}%) and ${P.INFY.roe}% ROE show it. But the moat protects the relationship, not the price: clients can and do demand that AI productivity gains be passed on, and Infosys's own scale advantage - hundreds of thousands of engineers - matters less when software writes software. There is no product moat. If AI services do not grow fast enough, the moat will keep Infosys in the room while the bill gets smaller.` },
  ],
};

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & guidance', kicker: 'Momentum', title: 'Q1FY27: margins fine, growth not; guidance cut for the second quarter running',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance', head: ['', 'Q1FY26', 'Q1FY27', 'Change'], rows: [
      ['Revenue (US$ mn)', n0(Q1.usdRevPrior), n0(Q1.usdRev), `${pc(Q1.usdYoYPct)} reported, +${Q1.ccYoYPct}% cc`],
      ['  Sequential growth (cc)', '–', `+${Q1.ccQoQPct}%`, `incl. ~${Q1.acqQoQContributionPct}% from acquisitions: organic ${Q1.organicQoQPct}%`],
      ['Revenue (₹ crore)', n0(Q1.inrRevPrior), n0(Q1.inrRev), pc(Q1.inrYoYPct)],
      ['Operating (EBIT) margin', `${Q1.opMarginPriorPct}%`, `${Q1.opMarginPct}%`, '+30 bp YoY, +20 bp QoQ'],
      ['Net profit (₹ crore)', n0(Q1.patPrior), n0(Q1.pat), pc((Q1.pat / Q1.patPrior - 1) * 100)],
      ['EPS (₹)', n1(Q1.epsPrior), n1(Q1.eps), pc(Q1.epsYoYPct)],
      ['Large-deal TCV (US$ bn) / net new', '3.8 / 55%', `${Q1.tcvBn} / ${Q1.netNewPct}%`, `${Q1.largeDeals} deals`],
      ['AI-first services, % of revenue', '–', `${Q1.aiRevPct}%`, `${Q1.aiRevPctQ3FY26}% in Q3FY26`],
      ['Free cash flow (US$ mn)', '884', n0(Q1.fcfUsd), `${Q1.fcfToPatPct}% of net profit`],
      ['Utilisation excl. trainees / attrition', '85.2% / 14.4%', `${Q1.utilExTraineesPct}% / ${Q1.attritionPct}%`, ''],
    ], source: 'Q1FY27 fact sheet, press release and call (23-Jul-2026)' } },
    { bullets: C.q1fy27.callPoints.map(rup) },
    { exhibit: { type: 'table', title: 'What management guided and what happened', head: ['When', 'Topic', 'What was said', 'Outcome so far'], wide: [2, 3], rows: C.guidance.map(g => [shortDate(g.date), g.item, rup(g.said), rup(g.outcome || '–')]), source: C.guidanceSrc } },
    { callout: '**Why it matters:** the 1.5-3.0% band now contains 1.7 points of acquisitions, so the organic business is guided to grow ~0-1.3%. Management\'s record on margins is good (20-22% met every year) and on revenue mixed (FY26 delivered inside a raised band; FY27 cut twice in substance, once in April by starting low and again in July). Our FY27E (US$ +2.0%, EBIT ~21.0%) sits at the guidance midpoint for growth and in the middle of the margin band.' },
  ],
};

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: clean accounts, cash above profit, tax one-offs to strip out',
  blocks: [
    { bullets: [
      `**Cash backs profit.** Operating cash flow was ${Math.round(A.cfoToPat[b])}% of attributable profit in FY26, ${Math.round(A.cfoToPat[b - 1])}% in FY25 and ${Math.round(A.cfoToPat[b - 2])}% in FY24; over FY15-26 cash from operations (₹${n0(A.cumulative.cfo)} cr) was ${Math.round(A.cumulative.cfo / A.cumulative.pat * 100)}% of profit. Free cash flow adjusted for the Labour Codes payments and tax refunds was 106% of profit in FY26 (company).`,
      `**Tax orders flatter some years.** Favourable orders under sections 250/254 of the Income Tax Act brought interest on refunds and reversals of old provisions: +₹4.76 of EPS in FY24 (₹1,933 cr of interest), +₹1.03 in FY25, and in FY26 ₹381 cr of interest plus ₹774 cr of tax reversals in Q4. We leave tax-refund interest out of our forecasts and show the forward P/E history both with and without these items.`,
      `**Other income is real but includes currency.** FY26 other income of ₹${n0(OI.total)} cr (AR note 2.19) was ₹${n0(OI.bankDepositsAndOthers + OI.ncdCpCdGsecFvoci + OI.taxFreeAndGovtBonds)} cr of interest, ₹${n0(OI.fundGains + OI.fvociGains + OI.taxFreeBondGain)} cr of gains on funds and bonds, ₹${n0(OI.taxRefundInterest)} cr of tax-refund interest, a net ₹${n0(OI.fxNet)} cr of exchange gains (₹2,451 cr of hedge losses against ₹2,948 cr of translation gains) and ₹${n0(OI.misc)} cr of other items (incl. a ₹165 cr property gain). Screener nets the ₹1,289 cr Labour Codes charge into this row (₹3,033 cr).`,
      '**One-off charges are disclosed and small.** The Labour Codes charge (₹1,289 cr, Q3FY26) is a genuine one-off from new law; acquisition amortisation (~50 bp of margin in Q4FY26) is recurring as long as Infosys keeps buying companies.',
      '**Revenue recognition.** Fixed-price contracts use percentage-of-completion estimates (the auditor\'s key audit matter); unbilled revenue is ~US$2 bn. Large deals are reported as total contract value over 3-5 years, not as revenue, and the conversion is slowing as renewals are repriced.',
      '**Disclosure.** Good: eight verticals, four geographies, client buckets, utilisation, attrition, deal TCV and cash every quarter, in US$ and ₹. Weak: no disclosure of AI deflation, pricing or the revenue from GCC clients; "AI-first revenue" is the company\'s own definition.',
    ] },
    { callout: '**Accounting flag: GREEN.** Unqualified audit by Deloitte Haskins & Sells LLP, cash conversion above 100%, no debt, and one-offs clearly flagged by the company. Watch acquisition accounting (earn-outs, retention pay) as M&A picks up, and the size of tax-order gains in the year they arrive.' },
  ],
};

const OH = D.ownership;
const ownership = base => ({ ...base, blocks: [
  { p: `The founder families (Murthy, Nilekani, Gopalakrishnan, Dinesh, Shibulal and relatives) own ${OH.categoriesPct.promoter}% (Jun-2026, excluding ADRs), down from 14.38% in March only because two Shibulal family members were reclassified from promoter group to public (approved at the 23-Jun-2026 AGM); the company issued or bought no shares. Domestic institutions own ${OH.categoriesPct.dii}% - mutual funds ${OH.categoriesPct.mf}% and insurers ${OH.categoriesPct.insurance}%, led by LIC at 11.7% - and foreign investors ${OH.categoriesPct.fii}%, down from ~34% in early 2024 as foreign funds sold Indian IT. ADRs (NYSE) are 7.5% of all shares. Shareholders numbered ~${n1(OH.shareholdersJun26 / 1e5)} lakh at Jun-2026.` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Largest holders (Jun-2026)', head: ['Holder', 'Stake'], rows: OH.named.map(([nm, p]) => [nm, p.toFixed(2) + '%']), source: OH.src } },
  { callout: '**Our read:** a widely held company with a founder group that no longer controls it (13.8%) but still chairs it (Nandan Nilekani). No pledges. LIC (11.7%) and the large mutual funds are the swing holders; foreign funds have been sellers for two years, which partly explains the de-rating.' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: strong board and accounts; a CEO handover in the middle of the AI shift',
  blocks: [
    { exhibit: { type: 'table', title: 'Key people', head: ['Name', 'Role', 'Note'], wide: [2], rows: C.management.map(m => [m.name, m.role, rup(m.note || '')]), source: C.managementSrc } },
    { verdicts: [
      ['Audit and accounts', 'Strong', 'Deloitte Haskins & Sells LLP, unqualified FY26 opinion; IFRS and Ind AS results reconcile; one-offs disclosed.', 'No accounting red flags.'],
      ['Board and chair', 'Strong', 'Nine directors at Mar-2026: seven independent, the CEO and co-founder Nandan Nilekani (non-executive chairman since 2017); D. Sundaram is lead independent director; every board committee is made up only of independent directors. Nitin Paranjpe named vice chairman from 30-Apr-2026.', 'Stable and independent since the 2017 crisis.'],
      ['Past governance episodes', 'Resolved', '2017: CEO Vishal Sikka resigned after a public dispute with founders (Panaya deal, severance). 2019: anonymous whistle-blower complaint against the CEO and CFO; audit-committee probe with outside counsel and PwC found it "substantially without merit".', 'History matters less than today\'s processes, which are good.'],
      ['Succession', 'Watch', 'Salil Parekh (CEO since 2018) leaves on 31-Mar-2027; Ashiss Dash, an insider (31 years, EURS head), takes over. Announced eight months ahead, with a mentoring period.', 'Orderly, but a new CEO must reset strategy as AI reshapes the industry.'],
      ['Legal and regulatory', 'Watch', 'US DOJ investigation into H-1B classification of employees at one client (outcome unknown); income-tax claims not acknowledged ₹1,326 cr; ₹2,399 cr paid to tax authorities under dispute.', 'Small against ₹4 lakh cr of market value; reputational risk in the US.'],
      ['Capital allocation', 'Strong', '85% of FCF returned (82.1% in FY25-26); dividends raised every year; buybacks at ₹1,800 (Dec-2025) look expensive in hindsight.', 'Shareholder-friendly; timing of buybacks has been poor.'],
      ['Promoters', 'Neutral', '13.8% (Jun-2026), no pledges; reclassifications reduce the group over time.', 'Aligned but not controlling.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'AR FY26 and FY20; Q1FY27 call; AGM notice (28-May-2026); Wikipedia (2017 history)' },
  ],
};

module.exports = { moat, guidance, quality, ownership, governance };
