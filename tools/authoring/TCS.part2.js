// TCS report, part 2: business, history, industry, the AI question (the central question) and tailwind test.
const X = require('./TCS.ctx');
const { C, D, F, A, n0, n1, pc, rup, SRC, SA, SQ, QL, A26, A25, Q1, FY26, EX, VERT, GEO, VN, GN, PG, price, epsSep28, impliedG, eps, usdGrowth } = X;
const PEERG = ['TCS', 'INFY', 'HCLTECH', 'WIPRO', 'TECHM', 'LTM', 'MPHASIS', 'PERSISTENT', 'COFORGE'];

const business = {
  id: 'business', nav: 'What TCS does', kicker: 'The business', title: 'India\'s largest IT services firm: US$30 bn of revenue, 594,000 people, 55 countries',
  blocks: [
    { p: `TCS builds, runs and changes the technology of large companies. Most of its revenue comes from multi-year contracts to develop and maintain applications, run infrastructure and cloud, implement enterprise software (SAP, Salesforce, Oracle, ServiceNow), test software, secure systems and run back-office processes, with a growing layer of consulting and AI work. It sells by industry: **banks and insurers (BFSI) are ${A26.bfsi}% of revenue**, consumer businesses (retail, consumer goods, travel) ${A26.cbg}%, life sciences and healthcare ${A26.lsh}%, manufacturing ${A26.mfg}%, technology companies ${A26.tech}%, telecoms and media ${A26.cmi}%, energy and utilities ${A26.eru}%, and "regional markets" (India, public sector, products) ${A26.rmo}%. By market, **North America is ${A26.na}%**, the UK ${A26.uk}%, continental Europe ${A26.ce}% and India only ${A26.india}%. About 48.7% of revenue is billed in dollars, 15.1% in pounds and 11.9% in euros (Q1FY27).` },
    { pair: [
      { type: 'hbar', title: 'BFSI is a third of revenue', unit: 'Share of FY26 revenue (%)', x: VERT.map(k => VN[k]), series: [{ name: 'Share', values: VERT.map(k => A26[k]), fmt: 'pct' }], labels: 'all', highlight: 'BFSI', source: 'Q4FY26 fact sheet' },
      { type: 'hbar', title: 'Two-thirds of revenue from the US and UK', unit: 'Share of FY26 revenue (%)', x: GEO.map(k => GN[k]), series: [{ name: 'Share', values: GEO.map(k => A26[k]), fmt: 'pct' }], labels: 'all', highlight: 'North America', source: 'Q4FY26 fact sheet' },
    ] },
    { exhibit: { type: 'table', title: 'Scale, clients and assets', head: ['', 'Detail'], wide: [1], rows: [
      ['Revenue', `₹${n0(FY26.revenueCr)} cr / US$${n0(FY26.usdRevenueM)} m in FY26; Q1FY27 ₹${n0(Q1.revenueCr)} cr / US$${n0(Q1.usdRevenueM)} m`],
      ['Clients', `${C.profile.scale.clients100mPlus} clients paying over US$100 m a year, 139 over US$50 m, 504 over US$10 m and ${n0(C.profile.scale.clients1mPlus)} over US$1 m (Q1FY27, last twelve months)`],
      ['People', `${n0(Q1.headcount)} employees (35% women, 148 nationalities); voluntary attrition ${Q1.voluntaryAttritionPct}% (LTM); 202 delivery centres in 55 countries`],
      ['Order book', `TCV US$${FY26.tcvBn} bn in FY26 (US$39.4 bn FY25, US$42.7 bn FY24); US$${Q1.tcvBn} bn in Q1FY27 incl. an US$800 m+ net-new deal with SKF`],
      ['AI', `Annualised AI services revenue US$${Q1.aiAnnualizedRevenueBn} bn (+${Q1.aiQoQPct}% QoQ), ~8.5% of revenue; partnerships with Anthropic (50,000 Claude licences), OpenAI, Mistral, Google, ServiceNow, AMD`],
      ['Products and platforms', 'TCS BaNCS (banking and capital-markets software), ignio (AI operations), iON (education and assessments), Quartz (blockchain); a small share of revenue'],
      ['New businesses', 'HyperVault (AI data centres, 51% with TPG 49%; OpenAI 100 MW anchor); Salesforce practice built by acquisition (ListEngage, Coastal Cloud); MHP (Porsche consulting) agreed in Aug-2026'],
    ], source: 'Q1FY27 fact sheet and press release; Q4FY26 fact sheet; AR FY26' } },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'From a Tata Sons division to India\'s most valuable IT company, and the slowest years in its listed life',
  blocks: [
    { exhibit: { type: 'table', title: 'Key events and what they did to the numbers', head: ['When', 'Event', 'Impact'], wide: [1, 2], rows: C.history.map(h => [h.when, rup(h.event), rup(h.impact) || '–']), source: C.historySrc } },
    { exhibit: { type: 'table', title: 'One-off items in reported profit (₹ crore, before tax)', head: ['Year', 'Item', 'Amount', 'EPS effect'], wide: [1], rows: [
      ['FY24', 'Epic Systems legal settlement', '958', 'Net income Rs46,585 cr before vs Rs45,908 cr reported'],
      ['FY26', 'Restructuring (severance)', n0(EX.fy26.restructuringCr), ''],
      ['FY26', 'Statutory impact of the new Labour Codes', n0(EX.fy26.labourCodesCr), ''],
      ['FY26', 'CSC/DXC legal claim (+ ₹342 cr interest in finance costs)', `${n0(EX.fy26.legalClaimCr)} + 342`, `EPS ₹${FY26.epsReported} reported vs ₹${FY26.epsExExceptional} before one-offs`],
      ['Q1FY27', 'Further CSC/DXC provision after the US Supreme Court', n0(EX.q1fy27.preTaxCr), `EPS ₹${Q1.epsReported} vs ₹${Q1.epsExExceptional}`],
    ].map(r => r.map(rup)), source: 'AR FY26 (P&L, notes 20, 25, 26); Q4FY24 and Q1FY27 fact sheets and press release' } },
    { callout: '**Corporate actions and per-share data:** five buybacks (2017-2023) and a 1:1 bonus (2018); 361.8 cr shares since the Dec-2023 buyback. Screener\'s "Net Profit" includes minorities (~0.5% of profit) and its EPS excludes them, so the implied share count is 363.6 cr; the gap is below 1%, so we use Screener\'s data unchanged and our EPS is on the attributable basis. Screener nets exceptional items into "other income" (FY26: −₹124 cr). Our forecasts and forward P/E history exclude the one-offs above (we show both).' },
  ],
};

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'A low-growth market in the middle of a technology shift',
  blocks: [
    { p: 'IT services is a ~US$1.5 trillion global market (Gartner, ex-cloud infrastructure) growing ~4-5% a year in dollars. Indian firms win share because they deliver from India at a fraction of onshore cost; the top five (TCS, Infosys, HCLTech, Wipro, Tech Mahindra) earn most of their revenue from US and European banks, retailers, manufacturers and tech firms. Growth comes in waves: the 2021-22 cloud-and-digital boom (TCS +15% in constant currency) was followed by three years of cuts to discretionary projects, and since late 2024 by generative and then agentic AI, which can write code, test software and run IT operations with fewer people. That is good for clients and for whoever builds the new systems, and bad for revenue that is billed by the hour or by the head.' },
    { exhibit: { type: 'table', title: 'Forces acting on IT services (as of 30-Sep-2026)', head: ['Theme', 'Direction', 'What it means for TCS'], wide: [2], rows: D.industry.themes.map(r => r.map(rup)), source: D.industry.src } },
    { pair: [
      { type: 'hbar', title: 'Q1FY27: all large-caps grew ~14% in rupees, mostly currency', unit: 'Revenue growth, Jun-2026 quarter, YoY (₹, %)', x: PEERG.map(X.shortName), series: [{ name: 'Growth', values: PEERG.map(s => Math.round(PG[s].q1yoy * 10) / 10), fmt: 'pct' }], labels: 'all', highlight: 'TCS', source: 'Screener.in (consolidated revenue)' },
      { type: 'hbar', title: 'Over three years TCS grew slower than most peers', unit: 'Revenue growth, FY23-26, a year (₹, %)', x: PEERG.map(X.shortName), series: [{ name: 'CAGR', values: PEERG.map(s => Math.round(PG[s].cagr3 * 10) / 10), fmt: 'pct' }], labels: 'all', highlight: 'TCS', source: 'Screener.in (consolidated)' },
    ] },
  ],
};

const aiq = {
  id: 'aiquestion', nav: 'The AI question', kicker: 'The central question', title: 'Cycle or de-rating? Both, but the price assumes almost no growth',
  blocks: [
    { p: `This is the question that decides the stock. TCS fell from ~₹3,190 at the end of January 2026 to ₹${n0(price)} on 30-Sep-2026 (−55% from its 2024 peak), and its one-year-forward P/E from ~${Math.round(X.fwdAdj.filter(x => x[0] <= '2026-02-01').at(-1)[1])}x to ~${Math.round(price / eps[1])}x. Two stories explain it. **The cyclical story:** clients have cut discretionary projects for three years, the US-Iran war from late February 2026 and tariffs added uncertainty, and TCS had a company-specific hole: the BSNL network contract, which lifted India to 8.6% of revenue in FY25, tapered in FY26 (India −28.6% in constant currency, ~2.5 points of TCS's −2.4%). **The structural story:** AI lets clients get the same work done with fewer people, so every renewal of an application-maintenance or IT-operations contract is repriced lower, and new money flows to chips, data centres and AI software rather than services.` },
    { exhibit: { type: 'table', title: 'The evidence, both ways', head: ['Evidence', 'Points to', 'Source'], wide: [0], rows: D.industry.aiEvidence.map(r => r.map(rup)), source: 'As listed; all published by 30-Sep-2026' } },
    { pair: [
      { type: 'column', title: 'Constant-currency growth: −3% in FY26, +3% in Q1FY27', unit: 'Constant-currency revenue growth, YoY (%)', x: QL, series: [{ name: 'CC growth', values: SQ.map(q => q.ccYoYPct), fmt: 'pct' }], labels: 'all', source: 'TCS fact sheets' },
      { type: 'column', title: 'AI services run-rate: US$1.5 bn to US$2.6 bn in three quarters', unit: 'Annualised AI services revenue (US$ m)', x: SQ.filter(q => q.aiRunRateM).map(q => q.q), series: [{ name: 'AI run-rate', values: SQ.filter(q => q.aiRunRateM).map(q => q.aiRunRateM), fmt: 'num' }], labels: 'all', source: 'TCS calls (Q2FY26 = figure quoted at the Nov-2025 analyst day)' },
    ] },
    { bullets: [
      '**How big is the deflation?** TCS says renewals pass on 10-15% productivity "in most places", spread over a contract\'s life and usually offset by extra scope. If roughly half its revenue is run-type work renewing every 3-5 years, that is a ~1.5-2.5% a year drag on growth, close to HCLTech\'s 2-3% estimate for its own book and Kotak\'s 3.5% base case. It is real and it will last as long as AI keeps improving.',
      '**What offsets it?** AI work (US$2.6 bn run-rate, ~8.5% of revenue, growing ~14% a quarter but lumpy), modernisation of old systems that AI makes cheaper to replace, vendor consolidation (six mega deals in five quarters) and new lines (HyperVault, Salesforce, MHP). Management\'s own aim for FY27 is to "arrest the degrowth".',
      '**What is cyclical?** BSNL\'s fall (over by Q2FY26), the consumer and airline weakness tied to the West Asia conflict, and deferred projects that TCS expects to resume. The deal pipeline is intact: TCV US$40.7 bn in FY26 and US$9.5 bn in Q1FY27.',
    ] },
    { callout: `**Our verdict:** both are true, and the structural part means TCS will not return to the 8-10% dollar growth of the 2010s: we model ${usdGrowth.map(g => n1(g)).join('% / ')}% USD growth for FY27-29E. But at ₹${n0(price)} the stock trades at ${n1(price / epsSep28)}x our Sep-28E EPS; with a ~52% ROE and an ${n1(X.V.ke)}% cost of equity, that price is consistent with only ~${n1(impliedG)}% a year rupee earnings growth forever, i.e. roughly flat dollar earnings once the rupee's drift is counted. That is a de-rating priced as if AI shrinks TCS, not one that merely slows it. We think the market has overshot.` },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Tailwind test: scale and the rupee help; AI spending mostly flows elsewhere',
  blocks: [
    { verdicts: [
      ['Enterprise AI adoption', 'Partly', `AI services run-rate US$${Q1.aiAnnualizedRevenueBn} bn; but ~8.5% of revenue and it cannibalises legacy work.`, 'Net accretive only from FY28 in our view.'],
      ['AI infrastructure build-out (GPUs, data centres)', 'Not yet', 'Most of this spend goes to chip makers and hyperscalers; HyperVault (OpenAI 100 MW) is TCS\'s attempt to capture some of it, revenue from ~FY28.', 'Optional upside; capital-heavy.'],
      ['Vendor consolidation and mega deals', 'Yes', 'Six mega deals in five quarters (M&S, a UK telecom operator, a US pharmacy retailer, SKF, others); TCV US$40.7 bn in FY26.', 'Scale wins renewals, at lower prices.'],
      ['BFSI technology spending', 'Yes', 'BFSI CC +2.4% YoY in Q1FY27, 32% of revenue; US banks "doing very well" (CEO).', 'The steadiest vertical.'],
      ['Rupee depreciation', 'Yes', 'INR/USD 85.5 (Q1FY26) to 94.8 (Q1FY27); ~110 bp margin help in Q4FY26.', 'Lifts rupee revenue and margins; not guaranteed.'],
      ['Discretionary spending recovery', 'Not yet', 'Clients deferred projects in Q1FY27; consumer, auto and airlines weak.', 'The main cyclical lever if it comes.'],
      ['GCCs (captive centres) in India', 'No (headwind)', 'Clients in-source work; TCS launched a GCC business unit to sell into it.', 'Some work moves out of reach.'],
    ], head: ['Industry tailwind', 'Captured?', 'Evidence', 'So what'], title: 'Tailwind test', source: SRC },
  ],
};

module.exports = { business, history, industry, aiq, tailwind, ...require('./TCS.part2b') };
