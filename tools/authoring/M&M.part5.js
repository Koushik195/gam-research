// M&M report, part 5: moat, Q1FY27 and guidance, earnings quality, ownership, governance, forecasts vs the street,
// street view and critiques. As of 30-Sep-2026.
const X = require('./M&M.ctx3');
const { n0, n1, F, D, C, sh, price, streetRows, tpMean, rating, V } = X;
const Q1 = C.q1fy27, ST = D.street, CN = ST.consensus;
const icici = { rev: [170200, 186286], ebitda: [21405, 24547], pat: [16080, 18616], eps: [134.8, 156.0] }, mosl = { pat: [16340, 20270], margin27: 12.7 };

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: real in tractors and pickups, earned in SUVs, unproven in EVs',
  blocks: [
    { exhibit: { type: 'table', title: 'Moat scorecard', head: ['Source of advantage', 'Strength', 'Evidence'], wide: [2], rows: D.moat, source: 'Company; SIAM; GAM Research' } },
    { p: '**Verdict: a wide moat in tractors and small pickups, a narrow one in SUVs.** Tractors and pickups are rural, finance-dependent, service-heavy businesses where M&M\'s dealer reach, resale values and M&M Finance give it a durable lead: share has stayed in the 40s for decades. In SUVs the lead is product-led: it was won with the XUV700/Scorpio-N/Thar cycle and must be re-won with every model; Maruti (No.1 by volume), Tata and Hyundai-Kia are all investing. In EVs M&M is ahead today, but a platform lead in a market at 9% penetration with falling battery costs is not yet a moat.' },
    { callout: '**So what:** the moat justifies a premium to mass-market carmakers, which is why we value the core on M&M\'s own history rather than on a peer average. It does not justify assuming that the 2024-25 multiple is the new normal.' },
  ],
};

const quarter = {
  id: 'q1fy27', nav: 'Q1FY27 and guidance', kicker: 'Latest results', title: 'Q1FY27: volumes strong, margins hit, and management calls the bottom',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (results of 30-Jul-2026)', head: ['', 'Q1FY27', 'Q1FY26', 'Change'], rows: [
      ['Standalone revenue from operations (₹ cr)', n0(Q1.standalone.revenueFromOps), n0(34083), '+23%'],
      ['Core EBITDA (₹ cr) / margin', `${n0(Q1.standalone.ebitda)} / 12.2%`, `${n0(4884)} / 14.3%`, '+5% / −210bp'],
      ['Standalone PAT (₹ cr)', n0(Q1.standalone.pat), n0(3450), '+7%'],
      ['Auto revenue / PBIT margin', `${n0(Q1.segments.autoRevenue)} / 7.1%`, `${n0(24949)} / 8.9%`, '+24% / −180bp'],
      ['Farm revenue / PBIT margin', `${n0(Q1.segments.farmRevenue)} / 18.5%`, `${n0(9186)} / 19.8%`, '+19% / −130bp'],
      ['Vehicles (incl. LMM, MEAL) / tractors', `${n0(Q1.volumes.vehicles)} / ${n0(Q1.volumes.tractors)}`, `${n0(247249)} / ${n0(134089)}`, '+23% / +18%'],
      ['SUV revenue share / tractor share', '25.0% / 44.9%', '27.3% / 45.2%', '−230bp / −30bp'],
      ['Consolidated revenue / PAT (₹ cr)', `${n0(Q1.consolidated.revenue)} / ${n0(Q1.consolidated.pat)}`, `${n0(45529)} / ${n0(4083)}`, '+28% / +34%'],
    ], source: 'Q1FY27 press release, analyst-meet deck and transcript; ICICI Direct result update (31-Jul-2026)' } },
    { bullets: [
      `**Margins:** ${Q1.commodity}`,
      `**Guidance:** ${Q1.guidance}`,
      `**Capacity:** ${Q1.capacity}`,
      '**Group:** M&M Finance PAT +78% (GS3 3.45%), Tech Mahindra PAT +28% (EBIT margin 14.4%), "growth gems" PAT 3x; consolidated ROE 23%.',
    ] },
    { callout: '**Our read:** the quarter showed strong demand and good cost control, but also how exposed margins are to commodities; management\'s "Q1 is the low point" depends on commodities not rising again. Since the call, M&M\'s domestic UVs grew 50% in August (on a weak pre-GST-cut base) and tractors only 5%.' },
  ],
};

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Accounting', title: 'Earnings quality: good cash conversion, but read the reported revenue with care',
  blocks: [
    { bullets: C.accounting.map(a => a) },
    { pair: [
      { type: 'column', title: 'Operating cash flow covers profit comfortably', unit: 'Operating cash flow ÷ net profit (%)', x: 'fin.labels', from: 'FY19', to: 'FY26', series: [{ name: 'CFO/PAT', fn: "g('fin.cfo')[i] / g('fin.pat')[i] * 100", fmt: 'pct0' }], labels: 'all', source: 'Screener.in (standalone); GAM Research' },
      { type: 'column', title: 'Other income is ~20% of pre-tax profit', unit: 'Other income (treasury + group income − write-downs) as % of PBT', x: 'fin.labels', from: 'FY19', to: 'FY29E', series: [{ name: 'Other income / PBT', ref: 'fin.otherIncomeShare', fmt: 'pct0' }], labels: 'all', source: 'Screener.in (standalone, adjusted); GAM estimates' },
    ] },
    { callout: '**Accounting flag: AMBER.** Nothing we found is aggressive, and cash conversion is strong (negative working capital). But three things make the reported numbers look better than the operating business: dividends from group companies shown inside revenue (₹2,190 cr in FY26), e-SUVs booked at full value for a ~0.4% margin, and a steady stream of write-downs of group companies that the company treats as exceptional. Our core EPS strips all three.' },
  ],
};

const ownership = base => ({ ...base, blocks: [
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Shareholding, Jun-2026 (latest before the as-of date)', head: ['Holder', '% of shares', 'Comment'], wide: [2], rows: [
    ['Promoters (Mahindra family entities)', '18.44%', 'Steady; no pledge disclosed'],
    ['Foreign institutions', '34.89%', 'Down from 41.9% in Jun-2024'],
    ['Domestic institutions (incl. LIC)', '32.58%', 'Up from 26.2%; LIC has a nominee director'],
    ['M&M Benefit Trust / M&M ESOP Trust', '6.79% / 3.34%', 'Treasury-like holdings (in "others" and "public"); we count all 124.35 cr shares'],
    ['Retail and others', '~14%', '9.9 lakh shareholders'],
  ], source: 'BSE shareholding pattern via Screener.in; AR FY26 notes 15-16' } },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Management and governance: a professional team with a capital-allocation rule',
  blocks: [
    { exhibit: { type: 'table', title: 'Governance scorecard', head: ['Area', 'Score', 'Evidence'], wide: [2], rows: [
      ['Board', 'GREEN', C.governance.board],
      ['Management', 'GREEN', 'Group CEO & MD Anish Shah (since Apr-2021), Rajesh Jejurikar (auto and farm), CFO Amarjyoti Barua; consistent delivery on guidance (FY26 SUV growth 19% vs "mid-to-high teens")'],
      ['Capital allocation', 'AMBER', '18% ROE hurdle and exits from loss-makers; but ₹7,101 cr of cumulative write-downs and ₹8,975 cr still committed to MEAL'],
      ['Related parties', 'AMBER', C.governance.relatedParty],
      ['Pay', 'AMBER', 'Group CEO pay 514x the median employee in FY26 (incl. ESOP value)'],
      ['Auditor', 'GREEN', `${C.governance.auditor}; no qualifications reported`],
      ['Promoter', 'GREEN', 'Mahindra family holds 18.44%; Anand Mahindra non-executive chairman; no pledge'],
    ], source: 'AR FY26 (governance report, BRSR, remuneration annexure); GAM Research' } },
  ],
};

const forecasts = {
  id: 'forecasts', nav: 'Our forecasts vs the street', kicker: 'Estimates', title: 'Our forecasts vs the street: higher revenue, similar profit',
  blocks: [
    { exhibit: { type: 'table', title: 'GAM vs the street (estimates standing on 30-Sep-2026; ₹ crore)', head: ['', 'GAM FY27E', 'Street FY27E', 'GAM FY28E', 'Street FY28E', 'Comment'], wide: [5], rows: [
      ['Revenue', n0(F.sales[0]), n0(icici.rev[0]), n0(F.sales[1]), n0(icici.rev[1]), 'ICICI Direct; we build in the August volume data (+42% vehicles) and capacity of 68-82k a month'],
      ['EBITDA', n0(F.ebitda[0]), n0(icici.ebitda[0]), n0(F.ebitda[1]), n0(icici.ebitda[1]), 'ICICI Direct'],
      ['EBITDA margin', `${n1(F.ebitdaMargin[0])}%`, `12.6-${mosl.margin27}%`, `${n1(F.ebitdaMargin[1])}%`, '13.2%', 'ICICI Direct; Motilal Oswal 12.7% for FY27'],
      ['Net profit', n0(F.pat[0]), `${n0(CN.fy27Pat[0])}-${n0(CN.fy27Pat[1])}`, n0(F.pat[1]), `${n0(CN.fy28Pat[0])}-${n0(CN.fy28Pat[1])}`, 'ICICI Direct-Motilal Oswal range'],
      ['EPS (₹), all 124.35 cr shares', n1(F.eps[0]), n1(icici.pat[0] / sh), n1(F.eps[1]), n1(icici.pat[1] / sh), 'ICICI Direct quotes ₹134.8 / ₹156.0 on ~119 cr shares'],
    ], source: 'ICICI Direct (31-Jul-2026), Motilal Oswal (30-Jul-2026, via DSIJ); GAM estimates' } },
    { p: `Our profit is ${n1((F.pat[0] / ((CN.fy27Pat[0] + CN.fy27Pat[1]) / 2) - 1) * 100)}% above the street midpoint for FY27 and ${n1((F.pat[1] / ((CN.fy28Pat[0] + CN.fy28Pat[1]) / 2) - 1) * 100)}% for FY28. We are not more cautious on earnings than the street; we differ on the multiple. Our standalone profit includes ~₹2,100-2,400 cr a year of dividends and other income from group companies, which we strip out (₹${n1(F.years.map((y, i) => X.AS.groupIncome[i] * (1 - X.t) / sh)[1])} a share in FY28E) before applying the core multiple.` },
  ],
};

const street = {
  id: 'street', nav: 'Street view & critiques', kicker: 'The street', title: `Street view: Buy, with targets 25-65% above the price; we disagree on the multiple`,
  blocks: [
    { p: ST._method },
    { exhibit: { type: 'table', title: 'Broker views standing on 30-Sep-2026', head: ['Broker', 'Rating', 'Target (₹)', 'Method', 'Multiple', 'On', 'Thesis', 'Date'], wide: [6], rows: streetRows.map(r => [r[0], r[1], n0(r[2]), r[3], r[4], r[5], r[6], r[7]]), source: 'Broker notes as cited in deep.json (Trendlyne, DSIJ, ICICI Direct, Investmentguru, Aliceblue); n.d. = not disclosed' } },
    { p: `The average target is ₹${n0(tpMean)} (${((tpMean / price - 1) * 100).toFixed(0)}% above the 30-Sep price). Most targets were set on 30-31 July at ~₹3,284; the stock then fell 10% by 30 September with the rest of the sector (Maruti −16%, Escorts −12% from end-July), as crude, El Nino and the West Asia escalation weighed. Our {{dcf.tp|inr}} (${rating}) is below every broker.` },
    { exhibit: { type: 'table', title: 'Critiques of the bull case, and our view', head: ['Critique', 'Our view'], wide: [0, 1], rows: D.critiques.map((c, i) => [c, ['Valid: our FY28E UV growth (+12%) already assumes share gains.', 'Valid: our FY28E tractor volumes fall 2%; the bear case is worse.', 'Valid: we value MEAL separately; M&M itself earns only ~0.4% on the e-SUVs it builds, so nothing is counted twice.', 'Partly: at GAM targets the two stakes are worth ~₹16 a share less.', 'Valid: this is the core of our SELL.', 'Valid: we use the street\'s 20% and show the target barely moves with it.'][i] || '–']), source: 'GAM Research' } },
  ],
};

module.exports = { moat, quarter, quality, ownership, governance, forecasts, street };
