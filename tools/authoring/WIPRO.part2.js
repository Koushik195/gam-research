// Wipro report, part 2: business, history, industry, the central question (AI: cyclical or structural?), tailwind
// test. SMU and people chapters in part2b.
const X = require('./WIPRO.ctx');
const { C, D, F, n0, n1, pc, rup, SRC, FY26, Q1 } = X;
const PG = D.peers, SE = D.sectorEvidence;
const m = (r, v) => n1(r / v * 100);
const S = FY26.smuRevInrM, R = FY26.smuResultInrM;

const business = {
  id: 'business', nav: 'What Wipro does', kicker: 'The business', title: 'A $10.5 bn IT services firm: run-the-business work for 1,233 clients, a third of it for banks',
  blocks: [
    { p: `Wipro writes, runs and maintains software and IT systems for large companies, mostly in the US and Europe, from delivery centres in India (60% of service revenue is earned offshore). Its work spans application development and maintenance, cloud and infrastructure management, enterprise software (SAP, Oracle, Salesforce), engineering services for technology and manufacturing clients (boosted by the DTS acquisition from Harman in Dec-2025), business process services, cybersecurity and consulting through **Capco**, a banking-focused consultancy. Almost all revenue (99%+) is **IT Services**, reported in dollars; **IT Products** (reselling software) was only ₹694 cr in FY26. More than half the work is fixed-price (53.6% in Q1FY27), so Wipro keeps the productivity gains it delivers on time and absorbs the overruns.` },
    { exhibit: { type: 'table', title: 'IT Services by Strategic Market Unit, FY26', head: ['SMU', 'What it covers', 'Revenue (₹ cr)', 'Share', 'Segment margin', 'Q1FY27 YoY (CC)'], wide: [1], rows: [
      ['**Americas 1**', 'US, Canada, LatAm: technology, communications, media, health, consumer', n0(S.americas1 / 10), `${FY26.smuMixPct.americas1}%`, `${m(R.americas1, S.americas1)}%`, `${Q1.smuYoyCcPct.americas1}%`],
      ['**Americas 2**', 'US, Canada, LatAm: banking, capital markets, insurance, energy, manufacturing', n0(S.americas2 / 10), `${FY26.smuMixPct.americas2}%`, `${m(R.americas2, S.americas2)}%`, `${Q1.smuYoyCcPct.americas2}%`],
      ['**Europe**', 'UK & Ireland, Switzerland, Germany, Western Europe', n0(S.europe / 10), `${FY26.smuMixPct.europe}%`, `${m(R.europe, S.europe)}%`, `+${Q1.smuYoyCcPct.europe.toFixed(1)}%`],
      ['**APMEA**', 'Australia/NZ, South-East Asia, Japan, India, Middle East, Africa', n0(S.apmea / 10), `${FY26.smuMixPct.apmea}%`, `${m(R.apmea, S.apmea)}%`, `+${Q1.smuYoyCcPct.apmea}%`],
      ['Unallocated', 'Corporate costs not charged to SMUs', '–', '–', `₹${n0(-R.unallocated / 10)} cr cost`, ''],
      { hl: true, cells: ['**IT Services**', `**$${n0(FY26.itsUsdM)} mn**`, `**${n0(FY26.itsRevInrM / 10)}**`, '**100%**', `**${FY26.itsMarginPct}%**`, `**+${Q1.yoyCcPct}%**`] },
    ], source: 'Q1FY27 press release (segment table, SMUs restated for the Apr-2026 realignment); Q1FY27 datasheet. Segment margin = segment result ÷ segment revenue (GAM calculation).' } },
    { pair: [
      { type: 'hbar', title: 'Banks and insurers are a third of revenue', unit: 'Share of IT Services revenue, Q1FY27 (%)', x: ['BFSI', 'Consumer', 'Technology & communications', 'Energy, manufacturing & resources', 'Health'], series: [{ name: 'Share', values: [Q1.sectorMixPct.bfsi, Q1.sectorMixPct.consumer, Q1.sectorMixPct.techComms, Q1.sectorMixPct.emr, Q1.sectorMixPct.health], fmt: 'pct' }], labels: 'all', source: 'Wipro Q1FY27 datasheet' },
      { type: 'hbar', title: 'The growing regions earn the lowest margins', unit: 'Segment result ÷ revenue, FY26 (%)', x: ['Americas 1', 'Americas 2', 'APMEA', 'Europe'], series: [{ name: 'Margin', values: [R.americas1 / S.americas1 * 100, R.americas2 / S.americas2 * 100, R.apmea / S.apmea * 100, R.europe / S.europe * 100], fmt: 'pct' }], labels: 'all', source: 'Q1FY27 press release (FY26 segment table); GAM calculation' },
    ] },
    { exhibit: { type: 'table', title: 'Reach and scale', head: ['', 'Detail'], wide: [1], rows: [
      ['Clients', '1,233 active; 16 above $100 mn a year (22 in FY24), 45 above $50 mn, 714 above $1 mn; top client 4.4%, top 10 23.6% of revenue (Q1FY27)'],
      ['People', '243,044 employees (Q1FY27), incl. Mindsprint; utilisation 83.6%; voluntary attrition 13.9%'],
      ['Currencies', 'US$ 59%, GBP 12%, EUR 8%, INR 6%, AUD 4%, CAD 2%, others 9% of revenue (Q1FY27)'],
      ['Platforms and AI', 'Wipro Intelligence (WINGS delivery platform, WEGA engineering platform), AI-native business & platforms unit (Apr-2026), Applied AI Centre of Excellence for Anthropic\'s Claude models, $500 mn Wipro Ventures fund'],
    ], source: 'Wipro Q1FY27 datasheet, deck and call' } },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'Three CEOs in ten years, four buybacks in seven, and dollar revenue back where it was in FY22',
  blocks: [
    { exhibit: { type: 'table', title: 'Key events and what they did to the numbers', head: ['When', 'Event', 'Impact'], wide: [1, 2], rows: C.history.map(h => [h.when, rup(h.event), rup(h.impact) || '–']), source: C.historySrc } },
    { callout: '**Corporate actions and per-share data:** the 1:1 bonus in Dec-2024 doubled the share count; Screener restates all earlier EPS for it (FY24 ₹10.57 = ₹21.1 before the bonus), so the per-share history in this report is consistent. The June-2026 buyback cut shares from 1,050.4 cr to 990.4 cr. Our model puts FY26 on that post-buyback count: pro-forma EPS ₹13.33 against ₹12.58 reported (₹12.60 under IFRS), and the Mar-26 balance sheet less the ₹15,000 cr paid out and ~₹4,435 cr spent on acquisitions after March. Exceptional items are small (₹39 cr gain in FY26); restructuring charges in Q1 and Q3 FY26 and a labour-code charge in Q4FY26 sit inside operating costs.' },
  ],
};

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Indian IT: a $315 bn export industry growing in low single digits, with AI rewriting the price of its core work',
  blocks: [
    { p: 'Indian IT services companies sell engineers\' time and outcomes to global corporations, mostly from India. The model worked for 30 years because Indian engineers cost a fraction of Western ones and clients kept outsourcing more. Nasscom put FY26 industry revenue at $315 bn (+6.1%) but headcount grew only 2.3%, and it flagged pricing compression. The large listed firms did worse: TCS −2.4% and Wipro −1.6% in constant currency in FY26, Infosys +3.1%, HCLTech +3.9%. FY27 guidance is 1.5-3.0% (Infosys, trimmed in July) and 1-4% (HCLTech). The 2025-26 slowdown has three causes at once: cautious client budgets (tariffs, the West Asia war, oil above $100, US rates near 5%), US visa costs, and generative/agentic AI, which lets clients do the same work with fewer people and asks the vendor to pass the savings on.' },
    { exhibit: { type: 'table', title: 'Forces acting on Indian IT services (as of 30-Sep-2026)', head: ['Theme', 'Direction', 'What it means for Wipro'], wide: [2], rows: D.industry.themes, source: D.industry.src } },
    { pair: [
      { type: 'hbar', title: 'FY26: Wipro and TCS shrank, Infosys and HCLTech grew', unit: 'Revenue growth in constant currency, FY26 (%)', x: ['HCLTech', 'Infosys', 'Wipro', 'TCS'], series: [{ name: 'CC growth', values: [PG.fy26CcGrowthPct.HCLTECH, PG.fy26CcGrowthPct.INFY, PG.fy26CcGrowthPct.WIPRO, PG.fy26CcGrowthPct.TCS], fmt: 'pct' }], labels: 'all', highlight: 'Wipro', source: 'Company releases (Apr-2026)' },
      { type: 'hbar', title: 'Valuations: every large peer trades far below its five-year median P/E', unit: 'Trailing P/E on 30-Sep-2026 vs five-year median (%)', x: ['TCS', 'INFY', 'WIPRO', 'LTM', 'LTTS', 'MPHASIS', 'HCLTECH', 'PERSISTENT', 'COFORGE'].map(X.shortName), series: [{ name: 'vs median', values: ['TCS', 'INFY', 'WIPRO', 'LTM', 'LTTS', 'MPHASIS', 'HCLTECH', 'PERSISTENT', 'COFORGE'].map(s => X.derate[s]), fmt: 'pct' }], labels: 'all', highlight: 'Wipro', source: 'Screener.in P/E history, NSE closes on 30-Sep-2026; GAM calculation' },
    ] },
  ],
};

const ev = list => list.map(e => `${rup(e.fact)} (${e.published.slice(0, 7)})`);
const aiQuestion = {
  id: 'ai-question', nav: 'The AI question', kicker: 'The central question', title: 'Cyclical slowdown or lasting de-rating? Both, and Wipro is more exposed than most',
  blocks: [
    { p: 'This is the question that decides every Indian IT stock. By 30-Sep-2026 the Nifty IT index had fallen ~40% from its Dec-2024 peak (−27% in 2026 alone, −11% in September), and the large firms traded at 12-18x trailing earnings against 20-30x five-year medians. Two explanations compete. The **cyclical** one: clients froze discretionary budgets in a year of tariffs, war, oil shocks and rising US rates; when they thaw, growth and multiples recover, as after past downturns. The **structural** one: AI coding and agents do a growing share of the work Indian IT is paid for (maintenance, testing, support, BPO), clients demand the savings, and revenue per unit of work falls for years. The evidence below is dated to 30-Sep-2026.' },
    { h: 'What the market and the cycle tell us' }, { bullets: ev(SE.price) },
    { h: 'Evidence for the structural case' }, { bullets: ev(SE.deflation) },
    { h: 'Evidence for the cyclical case' }, { bullets: [...ev(SE.counter), ...ev(SE.demand)] },
    { exhibit: { type: 'table', title: 'Where Wipro sits on the question', head: ['Test', 'Wipro', 'So what'], wide: [1, 2], rows: [
      ['Share of revenue in AI-exposed run work', 'High: application management, infrastructure, BPS and cost-takeout deals; management says these budgets are "getting compressed"', 'More of the book is renegotiated each year with productivity give-backs'],
      ['AI revenue to offset it', 'Not disclosed; "Reimagine AI" projects are early', 'TCS ($2.6 bn run-rate) and HCLTech ($171 mn a quarter) at least show the offset'],
      ['Growth before AI fears', 'Shrinking since FY24 (−4.4%, −2.3%, −1.6% CC) while Infosys and HCLTech grew in FY26', 'Not only an AI story: execution and Americas client losses too'],
      ['Headcount', '−2,500 in Q1FY27 excluding Mindsprint; revenue per average employee ~$44.1k (FY26) vs ~$45.1k (FY25)', 'Volume is shrinking faster than revenue'],
      ['Balance sheet and payout', 'Net cash, 70%+ payout, ~5% yield', 'Limits the downside; does not create growth'],
    ], source: 'Wipro Q1FY27 call and datasheet; peers\' releases (Jul-2026); GAM Research' } },
    { callout: `**Our verdict:** both. The 2026 demand slump is partly cyclical (macro shocks, deal slippage, a client-specific issue at Wipro), and some of it will reverse. But AI pricing pressure is real, measurable (2-3% a year of deflation in brokers' and HCLTech's estimates, falling headcount at most large firms) and will not reverse with the cycle. That justifies a permanently lower multiple for traditional IT services than the 20-30x of 2021-24. Wipro is more exposed than Infosys or HCLTech and at least as exposed as TCS: a large run book, no disclosed AI offset, and no organic growth even before the AI scare. We therefore model ~2-3% annual dollar growth after FY27, margins below management's band, and a ${X.peMult}x multiple, ~${Math.abs(Math.round(X.sectorDr))}% below its post-2021 median, in line with the de-rating of its peers rather than a return to history.` },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Tailwind test: the rupee reaches Wipro; the growth tailwinds mostly reach its rivals',
  blocks: [
    { verdicts: [
      ['New AI work (data, agents, AI governance, sovereign AI)', 'Partly', 'Wins in AI model evaluation and data operations for a global technology firm; Capco won an AI-governance award; no AI revenue disclosed.', 'Not yet big enough to show in growth.'],
      ['Vendor consolidation and cost-takeout deals', 'Yes, at a price', 'FY26 large deals $7.8 bn (+45% CC); Olam deal > $1 bn; but deals start at lower margins and ramp slowly.', 'Supports revenue, dilutes margin.'],
      ['Rupee depreciation', 'Yes', 'Realised Rs87.9/$ FY26, Rs93.5 Q1FY27; rupee revenue +10.7% YoY in Q1 on +1.0% in dollars.', 'Lifts rupee EPS; not a business improvement.'],
      ['BFSI spending recovery', 'Not yet', 'BFSI +2.6% YoY CC in Q1 but −1.2% QoQ; eight-quarter BFSI growth 0% (Choice).', 'Peers capture it first.'],
      ['Engineering and R&D services', 'Partly (bought)', 'DTS (Harman) from Dec-2025; technology & communications +10.8% YoY.', 'Real growth pocket, small.'],
      ['Global capability centres (GCCs)', 'No (headwind)', 'Clients insource work to their own Indian centres; Wipro cited client insourcing in BFSI.', 'Shrinks the outsourced pool.'],
      ['Europe and APMEA demand', 'Yes, partly bought', 'Europe +6% and APMEA +13.5% YoY CC in Q1, helped by DTS and Mindsprint.', 'Offsets Americas, at lower margins.'],
    ], head: ['Industry tailwind', 'Captured?', 'Evidence', 'So what'], title: 'Tailwind test', source: SRC },
  ],
};

module.exports = { business, history, industry, aiQuestion, tailwind, ...require('./WIPRO.part2b') };
