// TCS report, part 3: moat, Q1FY27 & guidance, earnings quality, ownership, governance, forecasts.
const X = require('./TCS.ctx');
const { C, D, F, A, AS, ASJ, n0, n1, pc, rup, A26, Q1, FY26, EX, b, eps, VERT, VN, UB, usd, usdGrowth, fxGrowth, withEps, avgEps, shortDate, netCashBase, EPS26ADJ } = X;

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: real, but it protects share and margins, not the volume of legacy work',
  blocks: [
    { verdicts: D.moat.map(r => r.map(rup)), head: ['Dimension', 'Verdict', 'Evidence', 'So what'], title: 'Moat scorecard', source: 'GAM research compilation (TCS filings and calls; Screener peer data, Sep-2026)' },
    { callout: '**Honest verdict:** TCS has the best cost position and the deepest client relationships in Indian IT, and the balance sheet to keep investing. Those advantages win renewals and consolidation deals, as FY26\'s mega deals show. But they are advantages of scale in a people-based business, not of technology. When AI lets a client do the same work with fewer people, the moat stops TCS losing the client, not losing the hours. There is no software-like pricing power here; there is a very efficient operator whose market is being repriced.' },
  ],
};

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & guidance', kicker: 'Momentum', title: 'Q1FY27: growth back above zero, wage hit as expected; "exit at 25% plus"',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance', head: ['', 'Q1FY26', 'Q4FY26', 'Q1FY27', 'YoY'], rows: [
      ['Revenue (₹ crore)', '63,437', '70,698', n0(Q1.revenueCr), pc(Q1.revenueYoYPct)],
      ['Revenue (US$ m)', '7,421', '7,621', n0(Q1.usdRevenueM), pc(Q1.usdYoYPct)],
      ['Constant-currency growth, QoQ / YoY', '−3.3% / −3.1%', '+1.2% / −0.6%', `+${Q1.ccQoQPct}% / +${Q1.ccYoYPct}%`, ''],
      ['Operating (EBIT) margin', '24.5%', '25.3%', `${Q1.ebitMarginPct}%`, '−50bp'],
      ['Net profit before exceptional items (₹ crore)', '12,760', '13,718', n0(Q1.netIncomeExExceptionalCr), '+8.5%'],
      ['EPS before / after exceptional items (₹)', '35.27 / 35.27', '37.92 / 37.92', `${Q1.epsExExceptional} / ${Q1.epsReported}`, ''],
      ['TCV (US$ bn)', '9.4', '12.0', String(Q1.tcvBn), ''],
      { hl: true, cells: ['**Headcount / LTM attrition**', '**613,069 / 13.8%**', '**584,519 / 13.7%**', `**${n0(Q1.headcount)} / ${Q1.voluntaryAttritionPct}%**`, ''] },
    ], source: 'Q1FY27 and Q4FY26 fact sheets; Q1FY27 press release (9-Jul-2026). Q1FY27 exceptional item: Rs668 cr CSC provision.' } },
    { bullets: C.callPoints.map(rup) },
    { exhibit: { type: 'table', title: 'What management said (Jan-2026 to Sep-2026)', head: ['When', 'Topic', 'What was said', 'Outcome so far'], wide: [2, 3], rows: C.guidance.map(g => [shortDate(g.date), g.item, rup(g.said), g.outcome || '–']), source: 'TCS earnings calls; JM Financial management meeting via Business Today (8-Sep-2026)' } },
    { callout: '**Why it matters:** TCS does not give numerical guidance, and its tone ("confident of a good CY2026" in January) has run ahead of results (Q4FY26 +1.2% QoQ CC, Q1FY27 +0.4%). The two things to test in Q2FY27 (results due in October 2026) are whether growth reaches ~1% QoQ as the street expects, and whether margin starts climbing from 24% towards the promised 25%+ exit.' },
  ],
};

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: clean, cash-backed accounts; legal one-offs keep recurring',
  blocks: [
    { bullets: [
      `**Cash backs profit.** Operating cash flow was ${FY26.cfoToNetIncomePct}% of net income in FY26 (TCS basis) and ${Math.round(A.cfoToPat[b])}% on Screener's (reported profit, after one-offs); over FY15-26 cash from operations (₹${n0(A.cumulative.cfo)} cr) was ${Math.round(A.cumulative.cfo / A.cumulative.pat * 100)}% of profit.`,
      `**"One-offs" are partly a cost of doing business in the US.** Legal charges of ₹958 cr (FY24, Epic Systems), ₹1,352 cr (FY26, CSC/DXC incl. interest) and ₹668 cr (Q1FY27, CSC again), plus FY26's ₹1,388 cr severance and ₹2,128 cr labour-code charge. We exclude them from forecasts and the forward P/E history (as the street does) but count the legal ones as a real, if irregular, cost.`,
      `**Other income is ~6% of pre-tax profit** (₹4,402 cr in FY26 before exceptional items): ₹3,854 cr interest (incl. ₹852 cr on tax refunds, unusual), ₹701 cr investment gains and a −₹611 cr FX loss. TCS also had ₹66,475 cr of FX derivatives outstanding and lost ₹2,771 cr on them in FY26, offset in translation.`,
      '**Related parties.** Revenue from Tata group companies ₹7,071 cr (2.6%); brand fee to Tata Sons ₹368 cr; ₹1,500 cr of inter-corporate deposits placed with a Tata Sons subsidiary; FY25 purchases of ₹8,178 cr from Tata group firms were mainly BSNL network equipment from Tejas Networks, passed through revenue at low margin.',
      '**Receivables and goodwill.** Debtor days (incl. unbilled) rose to 93 in FY26 from 67 in FY21; goodwill rose to ₹9,108 cr after the Coastal Cloud and ListEngage deals.',
      '**Disclosure.** Industry and market revenue and CC growth every quarter, TCV, client buckets, headcount and AI revenue; no utilisation or onsite/offshore split any more, and cost categories were restated in Q1FY27.',
    ] },
    { callout: '**Accounting flag: GREEN.** Unqualified audit (B S R & Co.; Walker Chandiok proposed from the 2027 AGM), strong cash conversion, no debt. Watch the litigation pattern in the US, receivable days, and how acquired-company revenue is disclosed as M&A picks up.' },
  ],
};

const OH = D.ownership;
const ownership = base => ({ ...base, blocks: [
  { p: `Tata Sons owns ${OH.named[0].pct}% and the promoter group ${OH.categoriesPct.promoter}% (Jun-2026), unpledged; TCS paid Tata Sons ₹28,291 cr of dividends in FY26. Foreign investors own ${OH.categoriesPct.fii}% (12.7% in Dec-2024), Indian institutions ${OH.categoriesPct.dii}% (LIC ${OH.named[1].pct}%) and the public ${OH.categoriesPct.public}%. Retail shareholders rose from ${n1(OH.counts.shareholdersJun25 / 1e5)} lakh to ${n1(OH.counts.shareholders / 1e5)} lakh in a year as the price fell.` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Largest holders (30-Jun-2026)', head: ['Holder', 'Stake'], rows: OH.named.map(h => [h.name, h.pct + '%']).concat([['Mutual funds (all)', '5.68%'], ['Insurance companies (all)', '6.71%'], ['Foreign portfolio investors (all)', `${OH.categoriesPct.fii}%`]]), source: OH.src } },
  { callout: '**Our read:** an unusually stable owner with a 71.7% stake and every reason to want high payouts. The free float is small (~28%), which limits index weight and liquidity relative to market value. Foreign investors have cut their stake by a third in 18 months; domestic funds and retail have absorbed the selling.' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: strong board and accounts; group ties and US litigation to watch',
  blocks: [
    { exhibit: { type: 'table', title: 'Key people', head: ['Name', 'Role', 'Note'], wide: [2], rows: C.management.map(m => [m.name, m.role, rup(m.note || '')]), source: C.managementSrc } },
    { verdicts: [
      ['Audit and accounts', 'Strong', 'B S R & Co., unqualified; rotation to Walker Chandiok from the 2027 AGM.', 'No accounting red flags.'],
      ['Promoter', 'Strong, with group ties', 'Tata Sons 71.7%, no pledges; Chairman is the Tata Sons chairman; brand fee ₹368 cr; ICDs with a group company.', 'Aligned on payouts; group transactions are small but need watching.'],
      ['Management', 'Strong', 'CEO K Krithivasan (since 2023, 35+ years at TCS); COO Aarthi Subramanian to 2030; CFO Samir Seksaria.', 'Deep bench; growth record under this team is weak (FY26 −2.4% CC).'],
      ['Pay', 'Reasonable', 'CEO ₹28.1 cr in FY26 (+6.3%), mostly commission; 333x the median employee.', 'In line with large-cap peers.'],
      ['Litigation and compliance', 'Watch', 'CSC/DXC judgement (~US$220 m in total provisions); Epic Systems (FY24); US EEOC probe and bias class actions (denied).', 'Recurring US legal costs.'],
      ['Capital allocation', 'Good, changing', 'Returns ~90% of operating cash; buybacks done at ₹4,150-4,500; now M&A and HyperVault.', 'Discipline must hold as capital needs rise.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'GAM research compilation (AR FY26, shareholding patterns, filings, press)' },
  ],
};

const ubRow = k => [VN[k], n0(UB.baseUsdM * UB.mixPct[k] / 100), ...[0, 1, 2].map(i => `${n0(usd[i][k])} (${UB.growthPct[k][i] >= 0 ? '+' : ''}${UB.growthPct[k][i]}%)`)];
const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: EPS ~7% a year from FY26\'s adjusted base, nearly half of it from the rupee',
  blocks: [
    { p: `We build revenue in US dollars by industry and convert at ₹${UB.inrPerUsd.join(' / ')} per dollar (FY26: ₹${UB.inrPerUsdFy26}). EBIT margin is 24.6% / 25.0% / 25.2%. Other income is built from a 7% yield on cash; capex includes TCS's share of HyperVault; payout is 90% (dividends plus buybacks); tax 25%. Forecasts are before exceptional items. Every assumption and our reasoning is in the Excel model's Assumptions sheet, which recalculates the target.` },
    { exhibit: { type: 'table', title: 'US dollar revenue build (US$ m; growth in brackets)', head: ['Industry', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ...VERT.map(ubRow),
      { hl: true, cells: ['**Total US$ revenue**', `**${n0(UB.baseUsdM)}**`, ...usd.map((u, i) => `**${n0(u.tot)} (+${n1(usdGrowth[i])}%)**`)] },
      ['₹ per US$ (change)', String(UB.inrPerUsdFy26), ...UB.inrPerUsd.map((x, i) => `${x} (+${n1(fxGrowth[i])}%)`)],
      { hl: true, cells: ['**Revenue, ₹ crore (= model)**', `**${n0(A.sales[b])}**`, '**{{F.sales.0|num}}**', '**{{F.sales.1|num}}**', '**{{F.sales.2|num}}**'] },
    ], source: 'TCS fact sheets (FY26 mix); GAM Research. The build is checked against model revenue in the authoring script.' } },
    { exhibit: { type: 'rows', title: 'P&L and cash flow summary (₹ crore)', from: 'FY23', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBIT margin (TCS operating margin)', ref: 'fin.ebitMargin', fmt: 'pct' }, { name: 'EBITDA', ref: 'fin.ebitda' },
      { name: 'Other income (actuals after exceptional items)', ref: 'fin.otherIncome' },
      { name: 'Net profit', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n1' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Free cash flow', ref: 'fin.fcf' }, { name: 'Cash & investments (forecasts: net of leases, incl. ICDs)', ref: 'fin.treasury' }, { name: 'ROE', ref: 'fin.roe', fmt: 'pct' },
    ], source: 'Company, GAM Research estimates. FY24 and FY26 actuals include one-offs (FY26 EPS Rs146.0 before them). Cash is gross in actual years. Forecast EPS in model tables is rounded to the rupee.' } },
    { exhibit: { type: 'table', title: 'Other income: built, not plugged (₹ crore)', head: ['', 'FY26 (before exceptional)', 'TTM Jun-26', 'FY27E', 'FY28E'], rows: [
      ['Treasury yield 7.0% × opening net cash after leases', '–', '–', `${n0(0.07 * netCashBase)} (on ${n0(netCashBase)})`, `${n0(0.07 * F.treasury[0])}`],
      ['7.0% on the funds that offset lease liabilities', '–', '–', '~790', '~830'],
      ['Recurring other items (tax-refund interest at a normal level, rent, lease gains)', '–', '–', '~200', '~200'],
      ['Q1FY27 actual above our run-rate', '–', '–', '655', '–'],
      { hl: true, cells: ['**Total other income**', '**4,402**', '**4,310**', '**{{F.otherIncome.0|num}}**', '**{{F.otherIncome.1|num}}**'] },
      ['Memo: FY26 items we do not repeat', 'Tax-refund interest 852, FVOCI sale gains 333, litigation awards 191, FX loss −611', '', '', ''],
    ], source: 'AR FY26 note 13; Screener quarterly other income (Q2FY26-Q1FY27, adding back exceptional items); GAM Research' } },
    { exhibit: { type: 'table', title: 'GAM vs the street (estimates standing on 30-Sep-2026)', head: ['Broker (date)', 'EPS FY27E', 'EPS FY28E', 'USD revenue FY27E / FY28E', 'EBIT FY27E / FY28E'], rows: [
      ['**GAM**', `**${n1(eps[0])}**`, `**${n1(eps[1])}**`, `**${n0(usd[0].tot)} / ${n0(usd[1].tot)}**`, '**24.6% / 25.0%**'],
      ...withEps.map(s => [`${s.broker} (${shortDate(s.date)})`, n1(s.eps.FY27E), n1(s.eps.FY28E), s.usdM ? `${n0(s.usdM.FY27E)} / ${n0(s.usdM.FY28E)}` : '–', s.ebitPct ? `${s.ebitPct.FY27E}% / ${s.ebitPct.FY28E}%` : '–']),
      { hl: true, cells: ['**Average of the brokers above**', `**${n1(avgEps('FY27E'))}**`, `**${n1(avgEps('FY28E'))}**`, '', ''] },
    ], source: 'Broker Q1FY27 notes (PDFs, 9-11 Jul-2026); Bloomberg consensus FY27E EPS Rs155.6 (BOBCAPS note)' } },
    { callout: `Our FY27E EPS (₹${n1(eps[0])}) is ${n1((eps[0] / avgEps('FY27E') - 1) * 100)}% above the broker average and FY28E (₹${n1(eps[1])}) ${n1((eps[1] / avgEps('FY28E') - 1) * 100)}% above: we hold the rupee near its 30-Sep-2026 level (~₹95.8) with a 1.5% annual drift, and assume slightly faster FY28 growth (BSNL, SKF), and our numbers exclude the Q1FY27 CSC charge. EPS compounds ~${n1(X.epsCagrFwd)}% a year over FY26-29E from the ₹${EPS26ADJ} adjusted base (+${n1((eps[0] / EPS26ADJ - 1) * 100)}% in FY27E, almost all of it from the weaker rupee, since the wage hike keeps the margin below FY26's).` },
  ],
};

module.exports = { moat, guidance, quality, ownership, governance, forecasts };
