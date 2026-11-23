// Dr. Reddy's report, part 2: what the company does, history and corporate actions, industry, tailwind test.
const X = require('./DRREDDY.ctx');
const { C, D, SA, SQ, Q1, FY26, n0, n1, pc, rup } = X;
const f26 = SA.find(a => a.fy === 'FY26'), f25 = SA.find(a => a.fy === 'FY25'), f22 = SA.find(a => a.fy === 'FY22');
const q = Q1.ifrs, sh = v => `${n1(v / f26.revenue * 100)}%`;
const qp = SQ.find(s => s.q === 'Q1FY26');

const business = {
  id: 'business', nav: "What Dr. Reddy's does", kicker: 'Company', title: 'A generics company with four markets and an API arm, turning itself into a branded and biologics business',
  blocks: [
    { p: `Dr. Reddy's Laboratories, founded in Hyderabad in 1984, makes generic medicines and their active ingredients (APIs). It is the only Indian drug maker listed on the New York Stock Exchange (since 2001). It reports two segments. **Global Generics** (89% of FY26 revenue) sells finished medicines in North America, Europe, India and emerging markets. **PSAI** (10%) sells APIs to other drug makers and runs contract development and manufacturing (CDMO). Branded businesses, where doctors prescribe a Dr. Reddy's brand (India, emerging markets and the nicotine-replacement consumer brands bought from Haleon), were 52% of Q1FY27 revenue.` },
    { exhibit: { type: 'table', title: 'FY26 revenue by market and what drives each (IFRS)', head: ['Market', 'FY26 (₹ cr)', 'Share', 'Q1FY27 growth', 'What it is'], wide: [4], rows: [
      ['**North America**', n0(f26.na), sh(f26.na), pc((q.na / qp.na - 1) * 100), `US generics (oral solids, injectables, a few 505(b)(2) products) and, from Q1FY27, generic semaglutide in Canada. US$1.30 bn in FY26 after the ₹453 cr lenalidomide shelf-stock adjustment; US$${q.naUsdMn} mn in Q1FY27. 76 ANDAs pending.`],
      ['**Emerging Markets**', n0(f26.em), sh(f26.em), pc((q.em / qp.em - 1) * 100), `Branded generics in Russia (₹${n0(q.russia)} cr in Q1FY27), other CIS and Romania, and 40+ Rest-of-World countries; 129 launches in FY26.`],
      ['**India**', n0(f26.india), sh(f26.india), pc((q.india / qp.india - 1) * 100), 'Branded generics: #9-10 in the market, 25 brands above ₹100 cr, vaccines (#2), in-licensed innovation (toripalimab), semaglutide (Obeda) from Mar-2026.'],
      ['**Europe**', n0(f26.europe), sh(f26.europe), pc((q.europe / qp.europe - 1) * 100), `Generics in Germany, the UK, France, Italy and Spain, plus the NRT consumer brands (Nicotinell, ₹${n0(q.nrt)} cr in Q1FY27) bought from Haleon in Sep-2024.`],
      ['**PSAI**', n0(f26.psai), sh(f26.psai), pc((q.psai / qp.psai - 1) * 100), 'APIs for other generic makers (incl. semaglutide API) and CDMO services; gross margin 17% in FY26, 4.5% in Q1FY27.'],
      ['Others', n0(f26.others), sh(f26.others), '–', 'Licensing and Aurigene services.'],
      { hl: true, cells: ['**Total (IFRS)**', `**${n0(f26.revenue)}**`, '100%', `**${pc((q.revenue / q.revenuePrior - 1) * 100)}**`, 'Ind AS revenue ₹33,700 cr (the basis of our model)'] },
    ], source: 'AR FY26 MD&A table 1; Q1FY27 release and presentation' } },
    { pair: [
      { type: 'stacked', title: 'Quarterly revenue by market: North America halved, the rest grew', unit: '₹ crore (IFRS)', x: SQ.map(s => s.q), series: [{ name: 'North America', values: SQ.map(s => s.na), fmt: 'num' }, { name: 'Emerging Markets', values: SQ.map(s => s.em), fmt: 'num' }, { name: 'India', values: SQ.map(s => s.india), fmt: 'num' }, { name: 'Europe', values: SQ.map(s => s.europe), fmt: 'num' }], minLabel: 900, source: 'Q1FY27 presentation (historical revenues by segment)' },
      { type: 'stacked', title: 'Annual mix: North America 60% of FY25 Global Generics, 38% of FY26', unit: 'Revenue by market (₹ crore, IFRS)', x: SA.map(a => a.fy), series: [{ name: 'North America', values: SA.map(a => a.na), fmt: 'num' }, { name: 'Emerging Markets', values: SA.map(a => a.em), fmt: 'num' }, { name: 'India', values: SA.map(a => a.india), fmt: 'num' }, { name: 'Europe', values: SA.map(a => a.europe), fmt: 'num' }], minLabel: 2500, source: 'Annual reports FY22, FY24, FY26 (MD&A revenue tables)' },
    ] },
    { callout: '**So what:** strip out lenalidomide and Dr. Reddy\'s is a diversified mid-teens-margin generics company whose growth now comes from branded markets (India, Russia and Rest of World, NRT), not the US. Its big bets for FY27-FY29 are three products: generic semaglutide (outside the US), biosimilar abatacept (US) and a rebuilt US generics launch engine. Each is binary in timing; together they decide whether margins return to 20%+ on our basis.' },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'Forty years in four eras: building a generics business, the gRevlimid windfall, the cliff, and the search for what comes next',
  blocks: [
    { p: 'The statements make sense only against the events that shaped them. Each left a mark: the FY22 impairments, the FY23-FY26 windfall margins, the FY25-FY26 jump in intangibles (NRT), the minority interest from the Nestle JV, and the FY26-FY27 one-offs.' },
    { exhibit: { type: 'table', title: 'Corporate actions and what they did to the numbers', head: ['When', 'What happened', 'Impact on the numbers'], wide: [1, 2], rows: C.history.map(r => [r[0], rup(r[1]), rup(r[2])]), source: 'AR FY26 (equity history, notes 2.16, 2.39); AR FY22; Q4FY26 and Q1FY27 calls; SEC Form 6-K (NRT completion, Sep-2024)' } },
    { exhibit: { type: 'table', title: 'One-off items by year (₹ crore, IFRS; positive = charge)', head: ['Year', 'One-off (gain)/loss', 'What', 'Reported EPS (₹)', 'EPS before one-offs (₹)'], wide: [2], rows: [
      ['FY22', '638', 'Impairments (₹756 cr in the five-year summary)', n1(X.rep[2022]), n1(X.UE.FY22)],
      ['FY23', '(545)', 'One-off gains (MOSL classification)', n1(X.rep[2023]), n1(X.UE.FY23)],
      ['FY24', '(198)', 'One-off gains', n1(X.rep[2024]), n1(X.UE.FY24)],
      ['FY25', '(51)', 'Net one-off gains (MOSL; incl. the ₹149 cr FX reclass on the Louisiana divestment)', n1(X.rep[2025]), n1(X.UE.FY25)],
      ['FY26', '923', 'SSA ₹453 cr, VAT ₹184 cr, CAR-T ₹135 cr, Eftilagimod ₹93 cr, labour codes ₹117 cr (company total ₹981 cr)', n1(X.rep[2026]), n1(X.UE.FY26)],
      ['Q1FY27', '258', 'Semaglutide API provision ₹240 cr and related costs', '5.3', '~7.5'],
    ], source: 'MOSL result update 23-Jul-2026 (one-off table and adjusted EPS, IFRS); Q4FY26 call; Screener (reported Ind AS EPS)' } },
  ],
};

const I = D.industry;
const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Three different industries: price-taking US generics, a 11-13%-growth Indian brand market, and branded emerging markets',
  blocks: [
    { p: `**US generics.** The world's largest generics market is a price-taker business: a few large buyer groups force prices down every year, and excess profit comes only from products with few competitors (first-to-file exclusivity, complex injectables, settlements like lenalidomide's). Dr. Reddy's grew ${I.us.drlGrowthExLenaPct}% excluding lenalidomide against ${I.us.marketGrowthPct}% for the market (IQVIA MAT Jun-2026), helped by launches. Its CEO is candid: "the US market, the generic piece of it, is at best single-digit growth, without the upsides". A new risk appeared on 22-Jul-2026, when the US President announced tariffs on generic medicines; 25-30% of Dr. Reddy's US sales are made by US contract manufacturers.` },
    { p: `**India.** The Indian pharmaceutical market (IPM) grew ${I.india.ipmMatGrowthPct}% on a moving annual basis and ${I.india.ipmMqtGrowthPct}% in the quarter to Jun-2026, mostly through price and new products. Dr. Reddy's grew ${I.india.drlMatGrowthPct}% / ${I.india.drlMqtGrowthPct}% and ranks #${I.india.rankMqt}-${I.india.rankMat}. The biggest new profit pool is semaglutide: Novo Nordisk's patent expired in Mar-2026 and several Indian companies launched on day one; Dr. Reddy's had ~10% share in its first weeks (May-2026).` },
    { p: `**Emerging markets and Canada.** Russia (Dr. Reddy's grew ${I.russia.drlGrowthPct}% vs ${I.russia.marketGrowthPct}% for the market, IQVIA May-2026), CIS and 40+ Rest-of-World countries are branded markets where a company sells its own brands to doctors and pharmacies. Generic semaglutide opens 80+ such markets in 2026-27 as data protection and patents lapse; Canada was first (Dr. Reddy's approval in Q4FY26, launch in Q1FY27). In Canada the list price is ~CAD${I.semaglutide.canadaListCad} a pen, retailers keep ~${I.semaglutide.retailMarginPct}% and provinces take another ${I.semaglutide.provinceRebatePct}%; management expects net prices of US$30+ a pen and not below US$${I.semaglutide.netUsdFloor}.` },
    { h: 'Three tailwinds' },
    { bullets: [
      '**GLP-1 genericisation outside the US:** semaglutide loses protection in India, Canada, Brazil and many emerging markets in 2026-27; demand far exceeds supply and few companies make the peptide API in-house.',
      "**Biosimilars:** the US FDA's draft guidance (raised on the Q4FY26 call) lowers the cost of developing biosimilars, and Dr. Reddy's first US targets (abatacept/Orencia, denosumab/Prolia) are large biologics with few or no biosimilars yet.",
      '**The rupee:** ₹95.81/US$ on 30-Sep-2026 vs ~₹87.5 average in FY26; about 80% of revenue is earned outside India.',
    ] },
    { h: 'And three headwinds' },
    { bullets: [
      '**The end of limited-competition windfalls:** gRevlimid volume limits ended in Jan-2026 and prices collapsed (Dr. Reddy\'s took a ₹453 cr shelf-stock adjustment); US base erosion is single digit to low double digit a year.',
      '**Execution and regulation:** the semaglutide API scale-up failed validation in Jul-2026; USFDA observations at Bachupally (biologics, 7) and Srikakulam (3) in Jun-Jul 2026; any OAI can stall launches.',
      '**Geopolitics and costs:** Russia sanctions and rouble swings; the Middle East conflict raised solvent and freight costs by ~1 point of margin in Q1FY27; US tariff threat on generics.',
    ] },
  ],
};

const tailwind = {
  id: 'tailwinds', nav: 'Tailwind test', kicker: "Does the tailwind reach Dr. Reddy's?", title: 'Tailwind test: India, EM and the rupee reach it; semaglutide and biosimilars are promised but not yet banked',
  blocks: [
    { p: 'A sector tailwind helps a shareholder only if the company captures it and keeps the profit. We score each driver.' },
    { verdicts: [
      ['India chronic and innovation growth', 'Yes', 'India +16% in FY26, +17% in Q1FY27 (15.5% organic) vs IPM 11-13%; toripalimab ₹100 cr+ in two years; 28 launches in FY26.', 'Real, ~21% of revenue; partly bought (Progynova, Stugeron) and in-licensed.'],
      ['Semaglutide outside the US', 'Partly', '180,000 pens sold before the API failure; 6-7 mn pens guided for Nov-26 to Mar-27 (was 10-11 mn); Canada price already set for three players.', 'Large but delayed; competitors (Apotex, Sandoz using Dr. Reddy\'s product) use the gap.'],
      ['US biosimilars', 'Not yet', 'Abatacept goal date mid-Dec-2026; rituximab approved Aug-2026 (Fresenius Kabi sells it); denosumab stuck at partner Alvotech.', 'Biologics sales ~US$100 mn and loss-making; break-even only after abatacept.'],
      ['Emerging-market branded growth', 'Yes', 'EM +23% in FY26 and +31% in Q1FY27; RoW +42%; 129 launches in FY26.', 'Helped by currency; Russia grows below its market.'],
      ['Weaker rupee', 'Yes', 'Revenue and other income lift; US$354 mn hedged at ₹92.3-94.6 to Mar-2027.', 'Cyclical; hedges cap part of the gain.'],
      ['US generics launches', 'Partly', 'Bosutinib and sugammadex first to market in 2026; 27 launches targeted in FY27.', 'Base still ~US$950 mn a year vs ~US$1 bn in FY22; CEO admits R&D misses.'],
      ['Consumer health (NRT)', 'Yes', 'Nicotinell growing high single digit to low double digit; integration complete Mar-2026; "very healthy" margin.', 'Bought for GBP458 mn; returns on that price are moderate.'],
    ], head: ['Tailwind', 'Captured?', 'Evidence', 'So what'], title: 'Tailwind scorecard: four captured, two partly, one not yet', source: 'Company calls and presentations; IQVIA via company; GAM Research' },
    { callout: '**Our view:** the tailwinds Dr. Reddy\'s already captures (India, emerging markets, NRT, the rupee) are steady but modest in margin. The ones that could restore 20%+ margins on our basis (semaglutide, abatacept) are real but each has slipped at least once in 2026. We model them, but later and smaller than management.' },
  ],
};

module.exports = { business, history, industry, tailwind };
