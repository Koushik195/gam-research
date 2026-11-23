// Tech Mahindra report, part 2: what the company does, history and corporate actions, the industry
// (the central question: cyclical slowdown or lasting AI de-rating?) and the tailwind test.
const fs = require('fs');
const path = require('path');
const X = require('./TECHM.ctx');
const { C, D, F, A, ROOT, n0, n1, pc, pc1, SQ, QL, SA, Q1, FY26, P, derate, MED5, DR_SET, sectorDr, shortName, price } = X;
const A26 = SA.find(a => a.fy === 'FY26'), A25 = SA.find(a => a.fy === 'FY25');
const V7 = [['comms', 'Communications'], ['mfg', 'Manufacturing'], ['bfsi', 'BFSI (banking, financial services, insurance)'], ['tme', 'Technology, media & entertainment'], ['rlt', 'Retail, logistics & transport'], ['hls', 'Healthcare & life sciences'], ['others', 'Others']];
const q1yoy = { comms: 1.3, mfg: 17.2, bfsi: 8.1, tme: 3.4, rlt: 8.6, hls: 7.2, others: -7.9 };
const SRCQ = 'Tech Mahindra earnings presentations (Q4FY26: 22-Apr-2026; Q1FY27: 16-Jul-2026)';

const business = {
  id: 'business', nav: 'What Tech Mahindra does', kicker: 'The business', title: 'A USD 6.4 bn IT services firm built around telecom, now selling itself as a vertical specialist',
  blocks: [
    { p: `Tech Mahindra sells IT and business-process work to large companies, mostly in the US and Europe. **IT services** (application development and maintenance, enterprise packages such as SAP and Salesforce, cloud and infrastructure management, engineering services, network services for telecom operators, data and AI) were ₹${n0(C.profile.segmentsFY26.itRevenue)} cr or 84% of FY26 revenue; **BPS** (customer support, back-office and AI-operations work; ~64,000 people) ₹${n0(C.profile.segmentsFY26.bpsRevenue)} cr or 16%. It is part of the Mahindra group (M&M owns 25.3%) and grew out of a 1980s joint venture with British Telecom, which is why **communications is still a third of revenue**, far more than at any large Indian peer. Two portfolio companies have their own products: Comviva (telecom and fintech software, seasonal, strongest in Q4) and Pininfarina (Italian car and architecture design).` },
    { p: `FY26 revenue was USD ${n0(FY26.usdRevenue)} mn (₹${n0(FY26.inrRevenue)} cr) from ~1,100 active clients; 29 clients paid more than USD 50 mn a year (33 by Jun-2026) and the top 10 were 24% of revenue. It employed ${n0(C.profile.headcount.total)} people at Jun-2026 (IT ${n0(C.profile.headcount.it)}, BPS ${n0(C.profile.headcount.bps)}), 77.5% of IT staff offshore in India. Revenue per head is low against peers because BPS is a large, low-price business.` },
    { pair: [
      { type: 'hbar', title: 'Communications is a third of revenue; BFSI only 16%', unit: 'FY26 revenue by vertical (USD mn)', x: V7.map(v => v[1].replace(/ \(.*\)/, '')), series: [{ name: 'FY26', values: V7.map(([k]) => A26[k + 'Usd']), fmt: 'num' }], labels: 'all', highlight: 'Communications', source: SRCQ + '; USD = mix x USD 6,385 mn' },
      { type: 'column', title: 'Americas ~49%, Europe ~26%, rest of world ~24%', unit: 'FY26 revenue by geography (% of total)', x: ['Americas', 'Europe', 'Rest of world'], series: [{ name: 'Share', values: [A26.amPct, A26.euPct, A26.rowPct], fmt: 'pct' }], labels: 'all', source: SRCQ },
    ] },
    { exhibit: { type: 'table', title: 'Verticals: size and momentum', head: ['Vertical', 'FY26 (USD mn)', 'Share', 'FY26 growth', 'Q1FY27 YoY', 'What drives it'], wide: [5], rows: [
      ...V7.map(([k, nm]) => [nm, n0(A26[k + 'Usd']), A26[k + 'Pct'] + '%', pc1(A26.growthPct[k]), pc1(q1yoy[k]), {
        comms: 'Telecom operators (IT, network services, Comviva); two large deals ramping; "volatility in a large US telecoms client"',
        mfg: 'Auto and aerospace engineering and IT; a European auto programme delivered early in Q1FY27',
        bfsi: 'Payments, wealth, insurance; Avant (Canada) bought in May-2026',
        tme: 'Hi-tech clients; volatile spend; a client insourced cloud consumption after its takeover',
        rlt: 'E-commerce, logistics modernisation, warehousing',
        hls: 'Providers and life sciences; vendor consolidation and AI-led work',
        others: 'Public sector and others',
      }[k]]),
      { hl: true, cells: ['**Total**', `**${n0(FY26.usdRevenue)}**`, '**100%**', `**${pc1(FY26.usdGrowthPct)}**`, `**${pc1(Q1.yoyPct)}**`, '6.6% YoY in constant currency in Q1FY27'] },
    ], source: SRCQ } },
    { callout: '**So what:** Tech Mahindra is a mid-tier generalist with one deep specialism (telecom). The new management\'s strategy is to add similar depth in chosen sub-verticals (payments, wealth, insurance, aerospace, life sciences) and to sell AI on top of that domain knowledge. It is a sensible strategy for a firm that cannot win on scale against TCS or Infosys, but it has only one year of results behind it.' },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'From BT joint venture to Satyam rescuer to turnaround story: what each step did to the numbers',
  blocks: [
    { exhibit: { type: 'table', title: 'Corporate history and its impact on the numbers', head: ['When', 'What happened', 'Impact on the numbers'], wide: [1, 2], rows: [
      ['1986-2006', 'Mahindra-British Telecom joint venture (incorporated 1986); renamed Tech Mahindra and listed in 2006', 'Built the telecom franchise that is still a third of revenue'],
      ['2009-2013', 'Acquired Satyam Computer Services after its accounting fraud; merged in 2013 (effective 1-Apr-2011)', 'Doubled the company; left 9.42 cr treasury shares in the TML Benefit Trust and a ₹1,230 cr "alleged advances" suspense account'],
      ['FY21-23', 'Acquisitions (Com Tec Co, Allyis, Activus Connect, Perigord and others) during the post-Covid boom', 'Revenue +18% (FY22) and +19% (FY23); goodwill and intangibles rose; margins fell as several buys lost money'],
      ['FY24', 'Telecom and hi-tech clients cut spend; one-time costs; CEO change (Mohit Joshi from Infosys)', 'Revenue −2%, EBIT margin 6.1%, EPS ₹26.7 (half of FY23): the trough year in our P/E history'],
      ['Apr-2024', 'Three-year plan to FY27: EBIT 15%, ROCE >30%, growth above peers, 85%+ of FCF returned', 'The targets the market now prices'],
      ['FY25-26', 'Project Fortius (cost), portfolio-company integration (~95%), non-core entities liquidated or merged, Surance stake sold', 'EBIT 9.7% (FY25), 12.6% (FY26); FY25 includes a ₹450 cr property-sale gain'],
      ['Nov-2025', 'New Labour Codes notified', '₹272 cr exceptional charge in Q3FY26'],
      ['FY26-Q1FY27', 'Rupee falls from ~85 to ~95/USD', 'Lifts rupee revenue and EBIT; FX hedge losses of ₹480 cr in FY26 and ~₹218 cr in Q1FY27 in other income'],
      ['May-2026', 'Bought 85% of Avant Techno Solutions (Canada; payments, wealth) for ₹188 cr', 'Small; adds to BFSI'],
    ], source: 'Annual report FY26, quarterly results and presentations, GAM Research' } },
    { pair: [
      { type: 'line', title: 'Eleven straight quarters of margin expansion', unit: 'EBIT margin, company definition (%)', x: QL, series: [{ name: 'EBIT margin', values: SQ.map(q => q.ebitPct), fmt: 'pct' }], labels: 'all', min: 6, max: 16, lines: [{ v: 15, text: 'FY27 target' }], source: 'Company presentations' },
      { type: 'column', title: 'Dollar revenue: flat for two years, then +6% YoY', unit: 'Revenue (USD mn), by quarter', x: QL, series: [{ name: 'Revenue', values: SQ.map(q => q.usdRev), fmt: 'num' }], labels: 'all', min: 1400, source: 'Company presentations' },
    ] },
  ],
};

// Rebased share prices (31-Dec-2025 = 100) from each company's cached Screener series, to the as-of date
const reb = sym => { const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')).charts.price.Price.filter(([d]) => d >= '2025-12-26' && d <= '2026-09-30'); const c = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'market', 'closes', '2026-09-30.json'), 'utf8')).closes[sym]; if (c && S.at(-1)[0] < '2026-09-30') S.push(['2026-09-30', c]); return S.map(([d, p]) => [d, Math.round(p / S[0][1] * 1000) / 10]); };
const RB = Object.fromEntries(['TECHM', 'TCS', 'INFY', 'HCLTECH', 'WIPRO'].map(s => [s, reb(s)]));
const IND = D.industry, it = t => IND.filter(x => x.topic === t);
const industry = {
  id: 'industry', nav: 'Industry: cycle or AI?', kicker: 'Industry', title: 'The central question: is the 2026 IT de-rating a cycle or AI shrinking the work? Mostly AI, we think',
  blocks: [
    { p: `Indian IT stocks had their worst year since 2008 in 2026. The trigger was AI: Anthropic's Claude Cowork plug-ins (late Jan-2026) and its post on modernising COBOL with Claude Code (24-Feb) caused the Nifty IT index's worst days since 2020, on the fear that agents will do much of the coding, testing and support work that Indian firms bill by the hour. By 30-Sep-2026 the index was ~28% down for the year against 13% for the Nifty 50, and the five largest IT firms had lost almost half their combined value since Aug-2024. Trailing P/E multiples fell to ${n1(P.TCS.pe)}x (TCS), ${n1(P.INFY.pe)}x (Infosys), ${n1(P.WIPRO.pe)}x (Wipro) and ${n1(P.HCLTECH.pe)}x (HCLTech), ${Math.abs(Math.round(sectorDr))}% below their five-year medians (median of nine IT peers). Tech Mahindra fell least (12% in Jan-Feb against 16-24% for peers) because its own earnings are rising.` },
    { pair: [
      { type: 'line', title: 'Tech Mahindra held up; TCS, Infosys and Wipro fell 30-40% in 2026', unit: 'Share price, 31-Dec-2025 = 100 (weekly)', x: RB.TECHM.map(r => r[0]), series: ['TECHM', 'TCS', 'INFY', 'HCLTECH', 'WIPRO'].map(s => ({ name: shortName(s), values: RB[s].map(r => r[1]), fmt: 'n1', thin: s !== 'TECHM' })), labels: 'last', source: 'Screener.in weekly closes; NSE close on 30-Sep-2026' },
      { type: 'hbar', title: `Peers trade ${Math.abs(Math.round(sectorDr))}% below their five-year P/E (median)`, unit: 'Trailing P/E on 30-Sep-2026 vs five-year median (%)', x: DR_SET.map(shortName), series: [{ name: 'vs median', values: DR_SET.map(s => Math.round(derate[s])), fmt: 'pct0' }], labels: 'all', source: 'Screener.in P/E history (Sep-2021 to Sep-2026), NSE closes' },
    ] },
    { exhibit: { type: 'table', title: 'The evidence, both ways (all published by 30-Sep-2026)', head: ['Side', 'Date', 'What happened'], wide: [2], rows: [
      ...it('deflation').map(x => ['AI is shrinking the work', x.date.slice(0, 7), x.fact]),
      ...it('cyclical').map(x => ['It is (partly) a cycle', x.date.slice(0, 7), x.fact]),
    ], source: 'Company releases and calls, Gartner, NASSCOM, press reports; URLs in GAM research files (deep.json)' } },
    { exhibit: { type: 'table', title: 'How the street now values the sector', head: ['Date', 'View'], wide: [1], rows: it('sellside').map(x => [x.date.slice(0, 7), x.fact]), source: 'Broker notes as reported by Business Today and Kotak Neo' } },
    { callout: '**Our answer: mostly structural, with a cyclical layer on top.** The cyclical part is real: US tariffs, the Iran war and oil at ~USD 100, weak discretionary spending and foreign selling of Indian equities (the Nifty 50 is down too). But the strongest evidence comes from the companies themselves: HCLTech says deals are ~20% smaller for the same scope and legacy revenue erodes 2-3% a year; Cognizant passes AI productivity to clients; Accenture says budgets are flat; Gartner cut its IT-services growth forecast while total tech spending accelerated; TCS, Infosys and HCLTech all shrank headcount. Record deal wins (TCS USD 9.5 bn, HCLTech USD 2.4 bn net new, Tech Mahindra USD 1.1 bn) are not turning into revenue growth at the same pace: that gap is what deflation looks like. We therefore treat the de-rating as mostly lasting: a return to the 22-30x multiples of 2021-24 needs growth of 7-8% that no large firm is guiding for. The upside for investors is earnings growth, not a re-rating.' },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Does Tech Mahindra escape the sector\'s problem? For FY27 yes; after that, probably not',
  blocks: [
    { p: `Tech Mahindra grew ${pc1(Q1.ccYoyPct)} YoY in constant currency in Q1FY27 (organic ${pc1(Q1.organicCcYoyPct)}) while Infosys cut its FY27 guidance to 1.5-3%, HCLTech guides 1-4%, TCS was flat sequentially and Wipro shrank. That gap has three sources, and only one of them is durable. (1) **Its own recovery:** FY24-26 revenue was flat, so the comparison base is low and the large deals signed in FY26 (USD 3.8 bn, +42%) are now ramping. (2) **One-offs:** a European auto programme delivered early added 1-1.3% to Q1 and reverses in Q2. (3) **Mix:** telecom, aerospace and BFSI sub-segments where it built domain depth are growing. Against that, communications (32% of revenue) grew only 1.3% and management flags "volatility in a large US telecoms client".` },
    { pair: [
      { type: 'column', title: 'Deal wins doubled in a year: USD 4.1 bn over the last twelve months', unit: 'Deal wins, last twelve months (USD mn)', x: QL, series: [{ name: 'LTM TCV', values: SQ.map(q => q.ltmTcv), fmt: 'num' }], labels: 'all', source: 'Company presentations' },
      { type: 'line', title: 'Constant-currency growth turned positive in Q3FY26 and reached 6.6%', unit: 'Revenue growth YoY in constant currency (%)', x: SQ.filter(q => q.ccYoy != null).map(q => q.q), series: [{ name: 'CC growth YoY', values: SQ.filter(q => q.ccYoy != null).map(q => q.ccYoy), fmt: 'pct' }], labels: 'all', source: 'Company presentations' },
    ] },
    { exhibit: { type: 'table', title: 'Tailwind scorecard', head: ['Test', 'Verdict', 'Evidence'], wide: [2], rows: [
      ['Deal wins converting to revenue', 'Yes, for now', 'LTM TCV USD 4,063 mn (+37.5%) on revenue of USD 6.5 bn; Q1 every vertical grew YoY'],
      ['Exposure to AI-deflation work', 'High', 'BPS (16%) and run/managed services are where agents bite first; IT headcount −7% YoY because AI tools lifted fixed-price productivity'],
      ['Exposure to telecom budgets', 'High', 'Communications 32% of revenue; +1.3% YoY in Q1FY27'],
      ['Pricing discipline', 'Good', 'Management walks away from deals that promise 70-80% productivity over five years'],
      ['Above-peer growth after FY27', 'Unproven', 'No guidance beyond FY27; we assume ~5% USD growth, in line with the better peers'],
    ], source: 'Company calls and presentations, GAM Research' } },
    { callout: `**Verdict:** the tailwind reaching Tech Mahindra in FY27 is mostly its own (recovery from a low base plus large-deal ramps), not a sector upturn. We model USD growth of {{as.usdBuild.usdGrowthPct.0|pct}} in FY27E, then {{as.usdBuild.usdGrowthPct.1|pct}} and {{as.usdBuild.usdGrowthPct.2|pct}}: better than Tier-1 peers' current guidance, but not enough to escape the sector's lower valuation.` },
  ],
};

module.exports = { business, history, industry, tailwind };
