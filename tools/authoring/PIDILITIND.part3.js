// Pidilite report, part 3: moat, Q1FY27 & guidance, earnings quality, ownership, governance, forecasts.
const X = require('./PIDILITIND.ctx');
const { C, D, F, A, AS, n0, n1, pc, rup, SA, A26, A25, segM, Q1, b, mosl, pl, CONS, shortDate, unallocHist } = X;

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: a wide moat in the core, a contested one in growth categories',
  blocks: [
    { verdicts: [...D.moat.map(r => r.map(rup))], head: ['Dimension', 'Verdict', 'Evidence', 'So what'], title: 'Moat scorecard', source: 'GAM research compilation (company filings, calls and CRISIL to Sep-2026)' },
    { callout: '**Honest verdict:** Pidilite has one of the widest moats in Indian consumer goods. Fevicol\'s brand, the relationship with millions of carpenters and other tradesmen, and a dealer network that reaches 40,000+ towns let it lead price moves and grow volumes 10%+ a year in a category it created. The moat protects **share and volume**, not the **gross margin**: Pidilite has no captive raw materials, so a VAM spike hits profit until prices catch up (FY22-23, early FY27). In the growth categories (tile adhesives, waterproofing) Pidilite is the leader but faces well-funded new entrants, and B2B has no moat at all. Net: a premium franchise, but not one whose margins can only go up.' },
  ],
};

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & guidance', kicker: 'Momentum', title: 'Q1FY27: a strong quarter, helped by cheap inventory that management says will reverse',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (₹ crore)', head: ['', 'Q1FY26', 'Q1FY27', 'Change'], rows: [
      ['Consolidated net sales', n0(Q1.consPrior.revenue), n0(Q1.consRevenue), pc(Q1.consRevenueYoYPct)],
      ['Standalone net sales', '3,467', n0(Q1.saRevenue), pc(Q1.saRevenueYoYPct)],
      ['  Underlying volume growth (UVG)', '9.9%', `${Q1.uvgPct}%`, ''],
      ['  C&B revenue / UVG', '+10.2% / 9.3%', `+22.5% / ${Q1.cbUvgPct}%`, ''],
      ['  B2B revenue / UVG', '+11.6% / 12.6%', `+16.0% / ${Q1.b2bUvgPct}%`, 'Exports UVG −8.4%'],
      ['Standalone gross margin', '53.4%', `${Q1.saGrossMarginPct}%`, '−90bp'],
      ['Advertising & sales promotion (consolidated)', '118', '159', '+35%'],
      ['Consolidated EBITDA', n0(Q1.consPrior.ebitda), n0(Q1.consEbitda), pc(Q1.consEbitdaYoYPct)],
      ['EBITDA margin', `${Q1.consPrior.ebitdaMarginPct}%`, `${Q1.consEbitdaMarginPct}%`, '+120bp'],
      { hl: true, cells: ['**Net profit**', `**${n0(Q1.consPrior.pat)}**`, `**${n0(Q1.consPat)}**`, `**${pc(Q1.consPatYoYPct)}**`] },
    ], source: 'Q1FY27 earnings presentation (4-Aug-2026); Q1FY26 presentation' } },
    { bullets: [
      '**Why margins rose despite inflation:** proactive pricing "based on replacement margins", carry-over of low-cost inventory and fewer trade schemes. All three partly reverse in Q2: "That benefit will unravel in the second quarter because we have bought inventory or materials at higher prices than what prevailed today" (CFO).',
      '**Demand:** "holding quite well", with no visible price elasticity yet; the MD conceded a little upstocking was possible in a quarter of staggered price rises.',
      '**Margin corridor:** 20-24% kept; the low end was retained because margins fell to the "high teens" in the last big inflation (FY22-23).',
    ] },
    { exhibit: { type: 'table', title: 'What management said (May-Aug 2026)', head: ['When', 'Topic', 'What was said', 'Outcome so far'], wide: [2, 3], rows: C.guidance.map(g => [shortDate(g.date), g.item, rup(g.said), g.outcome || '–']), source: 'Pidilite earnings calls (8-May-2026, 5-Aug-2026)' } },
    { callout: '**Why it matters:** Pidilite\'s guidance is a corridor, not a number, and its record is good: FY26 UVG of 11.1% and a 24% margin both met or beat what was said. The open question for FY27 is not demand but how much of the ~10% price stays once VAM has halved. We assume about three-quarters of it does for the year.' },
  ],
};

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: clean, cash-backed and simple',
  blocks: [
    { bullets: [
      `**Cash backs profit.** Operating cash flow was ${Math.round(A.cfoToPat[b])}% of net profit in FY26, ${Math.round(A.cfoToPat[b - 1])}% in FY25 and ${Math.round(A.cfoToPat[b - 2])}% in FY24; over FY15-26 cash from operations (₹${n0(A.cumulative.cfo)} cr) exceeded net profit (₹${n0(A.cumulative.pat)} cr).`,
      '**Few one-offs.** Exceptional items were −₹14 cr in FY26, −₹25 cr in FY25 and −₹72 cr in FY24. FY26 costs include a ₹80 cr New Labour Code charge (consolidated), so the underlying FY26 margin was ~0.5pp higher; Q4FY26 staff costs were helped by reversing a ~₹20 cr discretionary-benefit provision.',
      `**Other income is small.** ₹${n0(A.otherIncome[b])} cr in FY26, ${Math.round(A.otherIncomeShare[b])}% of pre-tax profit; it fell in Q4FY26 on mark-to-market losses on bonds and rebounded in Q1FY27.`,
      '**Revenue recognition.** The auditor\'s key audit matter is revenue measured net of trade discounts and schemes (variable consideration) - the line that will move if Pidilite passes back price through rebates.',
      `**Related party.** Purchases from Vinyl Chemicals (India), an associate with promoter director A B Parekh on its board, were ₹558 cr in FY26 (₹570 cr in FY25). Disclosed every year; we cannot test the pricing.`,
      '**Disclosure.** Good on segments (annual allocable depreciation) and volumes (UVG every quarter); no brand-level revenue or tonnage; quarterly segment data in the decks are standalone only.',
    ] },
    { callout: '**Accounting flag: GREEN.** Unqualified audit (B S R & Co. LLP), strong cash conversion, minor one-offs and a simple balance sheet. The things to watch are scheme and rebate accounting as prices fall back, and the size of related-party purchases.' },
  ],
};

const OH = D.ownership;
const ownership = base => ({ ...base, blocks: [
  { p: `The Parekh family owns ${OH.categoriesPct.promoter}% (Jun-2026), held through family members, four partnership firms, family companies and trusts, with no pledge. Foreign investors own ${OH.categoriesPct.fii}%, Indian institutions ${OH.categoriesPct.dii}% (mutual funds ${OH.categoriesPct.mutualFunds}%) and the public ${OH.categoriesPct.public}%. The number of shareholders was ~${Math.round(OH.counts.shareholders / 1000)},000 at Jun-2026, against ~${Math.round(OH.counts.shareholdersMar21 / 1000)},000 at Mar-2021.` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Largest promoter holding vehicles (31-Mar-2026)', head: ['Holder', 'Stake', 'Note'], wide: [2], rows: [
    ...OH.promoterVehiclesMar26.map(h => [h.name, h.pct + '%', /partner/.test(h.name) ? 'Partnership firm (promoter group)' : 'Family company (promoter group)']),
    ['All promoters (Jun-2026)', OH.categoriesPct.promoter + '%', 'Nil pledged'],
    ['Foreign portfolio investors (Jun-2026)', OH.categoriesPct.fii + '%', ''],
    ['Mutual funds (Jun-2026)', OH.categoriesPct.mutualFunds + '%', ''],
  ], source: 'AR FY26 note 20 (promoter vehicles at 31-Mar-2026); BSE shareholding pattern for Jun-2026 via Screener.in and the Q1FY27 deck. Named institutional holders at Jun-2026 were not available to us.' } },
  { callout: '**Our read:** a stable, unpledged family owner with a professional management team. The free float is only ~31% and Indian funds own little (mutual funds 4.3%), so index flows and foreign funds drive the stock.' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: family-controlled, professionally run, with one related-party habit to watch',
  blocks: [
    { exhibit: { type: 'table', title: 'Key people', head: ['Name', 'Role', 'Note'], wide: [2], rows: C.management.map(m => [m.name, m.role, m.note || '']), source: 'AR FY26 (Annexure 5 and board report); Q1FY27 call' } },
    { verdicts: [
      ['Audit and accounts', 'Strong', 'B S R & Co. LLP; unqualified; detailed segment and related-party notes.', 'No accounting red flags.'],
      ['Promoter and pledge', 'Strong', '69% held by the Parekh family, nil pledged; holding stable for a decade.', 'Aligned, patient owner.'],
      ['Professional management', 'Strong', 'Outside MDs since 2015 (Bharat Puri, then Sudhanshu Vats from Apr-2025) with Kavinder Singh as JMD; smooth handover.', 'Not dependent on one family member.'],
      ['Board', 'Moderate', 'About half independent (CRISIL); three Parekh family directors, two executive.', 'Adequate.'],
      ['Pay', 'Moderate', 'MD 120x, Executive Vice Chairman 105x, JMD 97x the median employee in FY26; rises of 9-13% in a year profit grew 18%.', 'High in absolute terms, in line with results.'],
      ['Related parties', 'Watch', 'Purchases of ₹558 cr from associate Vinyl Chemicals (India), where a promoter director sits on the board.', 'Disclosed; size matters.'],
      ['Capital allocation', 'Moderate', 'Disciplined capex (3-5% of revenue), Araldite deal earned back; cash pile growing with no buyback.', 'Idle cash dilutes ROE.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'GAM research compilation' },
  ],
};

const gapTxt = (g, x, y) => { const u = Math.abs(Math.round((g / x - 1) * 100)), v = Math.abs(Math.round((g / y - 1) * 100)); return u === v ? `~${u}%` : `${Math.min(u, v)}-${Math.max(u, v)}%`; };
const segRow = (k, name, field, hist, fmt = 'num') => [name, hist == null ? '–' : n0(hist), ...[0, 1, 2].map(i => `{{F.seg.${k}.${field}.${i}|${fmt}}}`)];
const mg = i => AS.segments[i].marginPct.map(x => `${x}%`);
const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: FY27 boosted by price, then ~11% growth; EPS ~14% a year',
  blocks: [
    { p: 'We forecast revenue and segment EBITDA for C&B and B2B on the consolidated segment basis (net of inter-segment sales), then deduct corporate costs that are not allocated to segments (~6% of revenue in FY26). Capex follows management\'s 3-5% of revenue; other income is 7% on net cash; tax 25.5%; payout 50%. Every assumption, with our reasoning, is in the Excel model\'s Assumptions sheet, which recalculates this report\'s target price.' },
    { exhibit: { type: 'table', title: 'Segment forecasts (₹ crore)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      { sec: 'Consumer & Bazaar' }, segRow('cb', 'Revenue', 'revenue', A26.cbRev), segRow('cb', 'Segment EBITDA', 'adjEbitda', A26.cbEbitda), ['Margin', `${n1(segM(A26, 'cb'))}%`, ...mg(0)],
      { sec: 'Business to Business' }, segRow('b2b', 'Revenue', 'revenue', A26.b2bRev), segRow('b2b', 'Segment EBITDA', 'adjEbitda', A26.b2bEbitda), ['Margin', `${n1(segM(A26, 'b2b'))}%`, ...mg(1)],
      segRow('oth', 'Others: revenue', 'revenue', A26.othRev),
      ['Corporate costs not allocated', `−${n0(unallocHist.at(-1).v)}`, '{{F.unalloc.0|num}}', '{{F.unalloc.1|num}}', '{{F.unalloc.2|num}}'],
      { hl: true, cells: ['**Group EBITDA**', `**${n0(A.ebitda[b])}**`, '**{{F.ebitda.0|num}}**', '**{{F.ebitda.1|num}}**', '**{{F.ebitda.2|num}}**'] },
    ], source: 'AR FY26 note 46 (FY26), GAM Research estimates' } },
    { exhibit: { type: 'rows', title: 'Group P&L and cash flow summary (₹ crore)', from: 'FY23', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' },
      { name: 'Other income', ref: 'fin.otherIncome' },
      { name: 'Net profit', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n1' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Capex', ref: 'fin.capex' }, { name: 'Free cash flow', ref: 'fin.fcf' }, { name: 'Cash & investments (forecasts net of debt)', ref: 'fin.treasury' }, { name: 'ROE', ref: 'fin.roe', fmt: 'pct' },
    ], source: 'Company, GAM Research estimates. Cash is gross in actual years and net of borrowings (~₹420 cr) in forecasts.' } },
    { exhibit: { type: 'table', title: 'GAM vs the street (estimates standing on 30-Sep-2026)', head: ['', 'GAM FY27E', 'Street FY27E', 'GAM FY28E', 'Street FY28E'], rows: [
      ['EPS (₹), Prabhudas Lilladher (5-Aug-26)', '{{F.eps.0|n1}}', n1(pl.eps.FY27E), '{{F.eps.1|n1}}', n1(pl.eps.FY28E)],
      ['EPS (₹), Motilal Oswal (5-Aug-26)*', '{{F.eps.0|n1}}', n1(mosl.eps.FY27E), '{{F.eps.1|n1}}', n1(mosl.eps.FY28E)],
      [`EPS (₹), consensus of ${CONS.analysts} (7-Aug-26)`, '{{F.eps.0|n1}}', n1(CONS.epsFY27E), '{{F.eps.1|n1}}', 'n.a.'],
      ['Revenue (₹ cr), Prabhudas Lilladher', '{{F.sales.0|num}}', n0(pl.sales.FY27E), '{{F.sales.1|num}}', n0(pl.sales.FY28E)],
      ['Revenue (₹ cr), Motilal Oswal', '{{F.sales.0|num}}', n0(mosl.sales.FY27E), '{{F.sales.1|num}}', n0(mosl.sales.FY28E)],
      ['EBITDA margin, Prabhudas Lilladher / Motilal Oswal', '{{F.ebitdaMargin.0|pct}}', `${n1(pl.ebitda.FY27E / pl.sales.FY27E * 100)}% / ${n1(mosl.ebitda.FY27E / mosl.sales.FY27E * 100)}%`, '{{F.ebitdaMargin.1|pct}}', `${n1(pl.ebitda.FY28E / pl.sales.FY28E * 100)}% / ${n1(mosl.ebitda.FY28E / mosl.sales.FY28E * 100)}%`],
    ], source: 'PL Q1FY27 note (PDF); DSIJ summary of the MOSL note; Simply Wall St consensus. * MOSL EPS = its PAT estimate ÷ 101.78 cr shares (GAM).' } },
    { callout: `We are ${gapTxt(F.eps[0], pl.eps.FY27E, mosl.eps.FY27E)} below the two brokers for FY27 and ${gapTxt(F.eps[1], mosl.eps.FY28E, pl.eps.FY28E)} below for FY28. Revenue is close; the gap is the margin: we hold EBITDA margin near 23.6-23.9% while the brokers take it to 24.3-24.4% in FY28. Our EPS still compounds ~${Math.round(X.epsCagrFwd)}% a year over FY26-29E.` },
  ],
};

module.exports = { moat, guidance, quality, ownership, governance, forecasts };
