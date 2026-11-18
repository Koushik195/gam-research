// Kalyan Jewellers report, part B: business, history, industry, segments, moat, earnings quality,
// ownership, governance, forecasts, street, valuation, verdict, glossary.
// Prose numbers come from research/company.json, deep.json and the built model; forecast and
// valuation figures are live tokens ({{...}}) that follow assumptions.json.
const fs = require('fs');
const path = require('path');
const { ruleText, buyBelow: buyAt, sellAbove: sellAt } = require('../../src/ratings');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'KALYANKJIL', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json');
const M = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'models', 'KALYANKJIL.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf;
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const SRC = 'Kalyan investor presentations, GAM Research';

const Qs = C.segmentsQuarterly.filter(q => q.indiaRev != null), QL = Qs.map(q => q.q);
const qv = k => Qs.map(q => q[k] ?? null);
const ann = fy => C.segmentsAnnual.find(a => a.fy === fy);
const A26 = ann('FY26');
const ST = C.stores.filter(s => /FY/.test(s.period) || /Sep-26|Jun-26/.test(s.period));
const price = M.price.last, mcap = M.meta.marketCap || price * F.shares;
const pe27 = price / F.eps[0], pe28 = price / F.eps[1];
const peSeries = (M.valuation.pe.series || []).map(x => x[1]).filter(v => v > 0 && v < 200);
const peMed = peSeries.slice().sort((a, b) => a - b)[Math.floor(peSeries.length / 2)];
const brokers = D.street.brokers;

const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const dcfPe28 = V.intrinsicTp / F.eps[1];
const epsSep28 = mv('pe').metric;
// One-year-forward P/E history: price ÷ EPS of the next full fiscal year (actuals; our estimates
// for the latest dates). This is the basis the street's 35-40x multiples are quoted on.
const SCR = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8'));
const plT = SCR.tables['profit-loss'];
const epsFY = Object.fromEntries(plT.periods.filter(p => /Mar/.test(p)).map(p => [+p.slice(-4), plT.rows['EPS in Rs'][plT.periods.indexOf(p)]]));
F.years.forEach((y, i) => (epsFY[2000 + +y.slice(2, 4)] = F.eps[i]));
const fwdPe = SCR.charts.price.Price.filter(([d]) => !M.meta.asOf || d <= M.meta.asOf).filter((_, i) => i % 5 === 0).map(([d, px]) => { const dt = new Date(d), fy = dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; return [d, epsFY[fy] > 0 ? Math.round(px / epsFY[fy] * 10) / 10 : null]; }).filter(x => x[1] != null && x[0] >= '2022-04-01');
const streetMethods = [
  ['Jefferies', 'Buy', 830, 'P/E', '38x', 'Sep-28E EPS', '~30% discount to Titan'],
  ['Citi', 'Buy', 800, 'P/E', '40x', 'Mar-28E EPS', 'Strong growth, deleveraging'],
  ['JM Financial', 'Buy', 750, 'n.d.', '–', '–', 'Resilient demand'],
  ['Motilal Oswal', 'Buy', 700, 'P/E', '35x', 'Mar-28E EPS', 'Franchise scale-up, non-South growth'],
  ['Axis Capital', 'Buy', 700, 'n.d.', '–', '–', '–'],
  ['ICICI Securities', 'Buy', 680, 'DCF', '–', '–', 'Debt-free ex gold loans; regional brand optionality'],
  ['BOBCAPS', 'Hold', 600, 'P/E', '35x', 'Jun-28E EPS', 'Limited upside after the rally'],
];
const rating = 'HOLD';
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;
const cover = {
  headline: 'A well-run jeweller, fairly priced: the gold price has already done the heavy lifting',
  lead: `Kalyan Jewellers is India's second-largest listed jeweller: ${C.stores.find(s => /Sep-26/.test(s.period)).total} stores across India, the Middle East, the US/UK and its online brand Candere. Execution has been excellent: revenue has quadrupled in five years and profit grew 89% in FY26 as franchise partners funded new stores and debt was repaid. But most of the recent growth is the gold price, not more grams sold, and margins are thin (6-7% EBITDA) and drifting down as franchise stores share profit. We value Kalyan the way the street does, on **P/E: 30x Sep-28E EPS of ₹${epsSep28.toFixed(1)}** (brokers use 35-40x). That gives **{{dcf.tp|inr}} ({{dcf.upside|chg}})**, just short of our 15% BUY threshold: **we initiate with HOLD.** EV/EBITDA (₹${n0(mv('ev').value)}) confirms it; the DCF (₹${n0(mv('dcf').value)}) warns that cash flows alone support less. Bull case {{scen.bull.tp|inr}}; bear case {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'The growth is real, but mostly gold-price inflation', p: `Revenue grew 43% in FY26 and 38% in Q1FY27 (ex-bullion), but Indian jewellery volumes fell 24% in 2025 (World Gold Council). Kalyan grows grams faster than the market through new stores, yet a large part of the growth is a 30-40% rise in the gold price. If gold flattens, growth falls to the store-addition rate: ~15-18%.` },
    { h: 'The franchise model is clever, but it caps margins', p: 'Two-thirds of India stores are now franchise-owned, company-operated (FOCO): partners put up the capital, Kalyan runs the store and shares the margin. This freed capital to repay ₹1,000 cr of debt, but EBITDA margin falls as the mix shifts (India 5.9% in Q1FY27, 5.1% excluding a one-off gain). Management now guides on PBT margin, not EBITDA.' },
    { h: "Valuation: reasonable on the street's own yardstick, but no bargain", p: `Jewellers are priced on P/E. Kalyan's one-year-forward P/E has averaged ~40x since 2023; the whole sector has since de-rated ~24% (Titan 65x vs 86x norm). Applying that to Kalyan gives 30x, or {{dcf.tp|inr}} on Sep-28E earnings. The street pays 35-40x on more optimistic earnings. Our DCF (₹${n0(mv('dcf').value)}) says cash flows alone support less.` },
    { h: 'Policy is turning against gold', p: 'In May 2026 the government raised gold import duty from 6% to 15% and the Prime Minister asked citizens to defer gold purchases. ICRA expects industry volumes to fall ~15% in FY27. Q2FY27 growth already slowed to 26% (from 38% in Q1).' },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'AMBER' },
    { k: 'Earnings momentum', v: 'GREEN' },
    { k: 'Competitive position', v: 'GREEN' },
    { k: 'Valuation', v: 'AMBER' },
  ],
  catalysts: [
    'Q2FY27 results (by 14-Nov-2026): margin after the gold-exchange push and the duty-gain one-offs.',
    'Gold price direction and any rollback of the 15% import duty.',
    'Store openings: 84 Kalyan (all franchise) + 50 Candere planned in FY27.',
    'Promoter pledge (~25% of promoter shares) and any further block deals.',
  ],
};

// ---------------------------------------------------------------- Story in charts
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: 'Revenue has quadrupled since FY21', unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY21', max: 70000, series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num', growth: true }], source: 'Company, GAM Research estimates' },
      { type: 'line', title: 'Gold price: up ~3x since 2019', unit: 'Domestic gold price, ₹ per 10g (annual average; 2026 = latest)', x: ['2019', '2020', '2021', '2022', '2023', '2024', '2025', 'Oct-26'], series: [{ name: 'Gold', values: [35220, 48651, 48720, 52670, 65330, 77913, 103000, 149290], fmt: 'num' }], labels: 'ends', source: 'IIFL, market data' },
    ] },
    { pair: [
      { type: 'column', title: 'Indian jewellery demand in tonnes is falling', unit: 'Jewellery demand, tonnes (calendar year)', x: ['2019', '2021', '2022', '2023', '2024', '2025'], series: [{ name: 'Tonnes', values: [544.6, 610.9, 600.4, 562.3, 563.4, 430.5], fmt: 'num' }], labels: 'all', source: 'World Gold Council' },
      { type: 'column', title: 'Franchise stores now two-thirds of India network', unit: 'Kalyan India showrooms, period end', x: ST.map(s => s.period.replace(/ \(.*\)/, '')).filter((_, i) => ST[i].indiaFoco != null), series: [{ name: 'Franchise (FOCO)', values: ST.filter(s => s.indiaFoco != null).map(s => s.indiaFoco), fmt: 'num' }, { name: 'Company-owned', values: ST.filter(s => s.indiaFoco != null).map(s => s.indiaCompanyOwned), fmt: 'num' }], type2: 'stacked', source: SRC },
    ] },
    { pair: [
      { type: 'line', title: 'India EBITDA margin is drifting down', unit: 'India EBITDA, % of revenue (quarterly)', x: QL, series: [{ name: 'India margin', values: qv('indiaEbitdaPct'), fmt: 'pct' }], labels: 'all', source: SRC },
      { type: 'line', title: 'Same-store growth: driven by the gold price', unit: 'India same-store sales growth (%)', x: QL, series: [{ name: 'SSSG', values: qv('indiaSssg'), fmt: 'pct0' }], labels: 'all', source: SRC },
    ] },
    { pair: [
      { type: 'line', title: 'P/E below its post-IPO median, but that median is flattered', unit: 'P/E on trailing earnings (x)', x: 'V.pe.series[].0', series: [{ name: 'P/E', ref: 'V.pe.series[].1', fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: peMed, text: `Median ${n1(peMed)}x` }], source: 'Screener.in' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street', unit: `₹ per share; CMP ₹${price}`, x: [...brokers.map(b => b.broker.replace(' (MOFSL)', '')), 'GAM (base)'], series: [{ name: 'Target', values: [...brokers.map(b => b.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes, GAM Research' },
    ] },
  ],
};
narrative.blocks[1].pair[1].type = 'stacked';

// ---------------------------------------------------------------- Business
const business = {
  id: 'business', nav: 'What Kalyan does', kicker: 'The business', title: 'A gold jeweller with three businesses and an unusual franchise model',
  blocks: [
    { p: 'Kalyan sells gold, diamond and precious-stone jewellery through large showrooms. About 70% of what it sells is plain gold jewellery (studded pieces are ~30% in India and ~16% in the Middle East), so the price a customer pays is mostly the value of the gold plus a making charge. That is why revenue moves with the gold price and why margins are thin: Kalyan earns roughly 12% gross and 6-7% EBITDA on each rupee of sales.' },
    { exhibit: { type: 'table', title: 'Three segments in FY26', head: ['Segment', 'What it is', 'Revenue (₹ cr)', 'EBITDA (₹ cr)', 'Margin', 'Stores (Sep-26)'], wide: [1], rows: [
      ['**India (Kalyan)**', 'Showrooms across 25+ states; ~2/3 franchise-owned', n0(A26.indiaRev), n0(A26.indiaEbitda), (A26.indiaEbitda / A26.indiaRev * 100).toFixed(1) + '%', '365'],
      ['**Middle East**', 'UAE, Qatar, Oman, Kuwait; mostly Indian expatriates', n0(A26.meRev), n0(A26.meEbitda), (A26.meEbitda / A26.meRev * 100).toFixed(1) + '%', '38 (+2 US, 2 UK)'],
      ['**Candere**', 'Lightweight, lifestyle jewellery online and in small stores', n0(A26.candereRev), 'n.d. (PAT −13)', '–', '138'],
      { hl: true, cells: ['**Consolidated**', '', n0(A26.consRev), n0(A26.consEbitda), (A26.consEbitda / A26.consRev * 100).toFixed(1) + '%', '546'] },
    ], source: 'Kalyan Q4FY26 and Q1FY27 investor presentations; n.d. = not disclosed' } },
    { h: 'The franchise (FOCO) model, explained' },
    { p: `Since 2022 almost all new Kalyan showrooms are **franchise-owned, company-operated (FOCO)**. A partner, usually a financial investor rather than a jeweller, pays for the store and the entire inventory, and bears the running costs except staff. Kalyan designs, stocks, staffs and runs the store under its brand, and the two share the margin. Partners earn about 14% on their capital. For Kalyan this means: (1) no capital needed for new stores, so debt has been repaid; (2) a lower EBITDA margin because profit is shared; (3) a higher return on capital. FOCO share of India revenue rose from 40% (Q3FY25) to 57% (Q1FY27).` },
    { callout: `**An accounting point worth knowing:** Kalyan books the jewellery it ships to franchise stores as its own revenue (₹15,050 cr in FY26, about half of standalone sales), with up to 180 days' credit. This is allowed, but it means part of reported revenue is sales into its own franchise network rather than to end-customers.` },
    { pair: [
      { type: 'column', title: 'Store count: ~550 and growing ~25% a year', unit: 'Total stores (all formats), period end', x: C.stores.map(s => s.period.replace(/ \(.*\)/, '')), series: [{ name: 'Stores', values: C.stores.map(s => s.total), fmt: 'num' }], labels: 'ends', source: SRC },
      { type: 'line', title: 'Franchise share of India revenue keeps rising', unit: 'FOCO % of India revenue', x: QL, series: [{ name: 'FOCO share', values: qv('focoRevSharePct'), fmt: 'pct0' }], labels: 'all', source: SRC },
    ] },
  ],
};

// ---------------------------------------------------------------- History
const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'From one Thrissur showroom (1993) to a pan-India chain',
  blocks: [
    { exhibit: { type: 'table', title: 'Key events and what they did to the numbers', head: ['When', 'Event', 'Impact'], wide: [1, 2], rows: [
      ['1993', 'T.S. Kalyanaraman opens the first showroom in Thrissur, Kerala (family in textiles since 1908)', 'Origin of the brand'],
      ['2013', 'Enters Maharashtra and the Middle East', 'Start of the move beyond South India'],
      ['2014-17', 'Warburg Pincus invests ~₹1,200 cr (later ~24%), then more; Candere stake acquired', 'Funded pan-India expansion; debt stayed high'],
      ['Mar-2021', 'IPO at ₹87 (₹800 cr fresh + ₹375 cr sale); listed ~15% below issue', 'Debt reduction; traded below IPO price until Sep-2022'],
      ['2022', 'First franchise (FOCO) showroom; Vinod Rai (ex-CAG) becomes chairman', 'Start of capital-light growth'],
      ['2023-24', 'Warburg sells out in four rounds; promoter buys 2.36% at ₹535 (Aug-2024)', 'Removed a large overhang; promoter stake to ~63%, partly funded by pledged shares'],
      ['Jul-2024', 'Gold import duty cut from 15% to 6%', 'One-off inventory loss of ~₹124 cr in FY25; demand boost'],
      ['Aug-2024', 'Walker Chandiok replaces Deloitte as auditor (end of 10-year term)', 'Routine rotation'],
      ['Jan-2025', 'Stock falls ~38% in 13 sessions on social-media allegations (raids, bribery of fund managers); company and Motilal Oswal AMC deny', 'No adverse finding; promoters pledged more shares the same month'],
      ['Jul-2025', 'ICRA upgrades rating to AA-', 'Lower borrowing cost'],
      ['May-2026', 'Import duty raised to 15%; PM appeals to defer gold buying; MSCI index deletion', 'Stock to ₹340; one-off inventory gains (~₹100 cr in Q1-Q2FY27)'],
      ['Aug-2026', 'Regional brand Akshaya Thanga Maligai launched in Chennai', 'Test of a value format against Tamil Nadu regionals'],
      ['Sep-2026', 'Non-gold-loan debt fully repaid; ₹102 cr of non-core property sold', 'Debt now only gold metal loans and leases'],
    ], source: 'Company filings, Business Standard, ICRA, deep research files' } },
    { callout: '**Corporate actions since listing:** no bonus, split, buyback or QIP. Dividends started in FY23 (payout ~20%). The capital story is debt repayment funded by franchise partners, and a change of guard from Warburg to domestic mutual funds.' },
  ],
};

// ---------------------------------------------------------------- Industry
const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'A huge, slow-growing market where organised players take share',
  blocks: [
    { p: 'India\'s gems and jewellery retail market was worth about ₹12.9 lakh cr in FY26 (CRISIL), roughly 80-85% gold. In value it has grown ~21% a year since FY22, but almost entirely because of the gold price: jewellery demand in tonnes fell from ~563t in 2024 to ~431t in 2025. CRISIL expects only 4-5% value growth to FY30 as high prices hurt affordability. The real opportunity for chains like Kalyan is **share shift**: organised jewellers hold 37-42% today and are expected to reach 45-50% by FY30, helped by mandatory hallmarking and consumer trust.' },
    { pair: [
      { type: 'column', title: 'Organised share: rising ~1.5pp a year', unit: 'Organised share of jewellery retail (%, midpoint of range)', x: ['FY19', 'FY24', 'FY26', 'FY28E', 'FY30E'], series: [{ name: 'Organised', values: [32.5, 38, 39.5, 42.5, 47.5], fmt: 'pct' }], labels: 'all', source: 'CRISIL, Deloitte, BOBCAPS (ranges, midpoints shown)' },
      { type: 'hbar', title: 'The competitive field: Kalyan is #2 listed', unit: 'FY26 revenue (₹ crore)', x: ['Malabar (unlisted)', 'Kalyan', 'Joyalukkas (unlisted, target)', 'Lalithaa', 'PN Gadgil', 'Thangamayil', 'Senco', 'Sky Gold (B2B)', 'BlueStone'], series: [{ name: 'Revenue', values: [66872, 35743, 35000, 25024, 10739, 8499, 8430, 6295, 2436], fmt: 'num' }], labels: 'all', highlight: 'Kalyan', source: 'Company filings, RHPs, press; Titan\'s jewellery business (larger) not shown separately' },
    ] },
    { exhibit: { type: 'table', title: 'Policy and market forces', head: ['Theme', 'Direction', 'What it means'], wide: [2], rows: [
      ['Mandatory hallmarking (HUID)', 'Tailwind', 'Now covers ~380 districts; registered jewellers rose from 43k (2021) to 1.9 lakh. Raises trust in organised chains.'],
      ['Import duty raised to 15% (May-2026)', 'Headwind', 'Makes jewellery dearer; ICRA expects industry volumes −15% in FY27; raises smuggling and working-capital needs. One-off inventory gains for jewellers holding duty-paid stock.'],
      ['PM\'s appeal to defer gold purchases', 'Headwind', 'Made in May-2026 and repeated in Sep-2026 amid forex pressure; jewellery stocks fell 6-12% each time.'],
      ['Record gold prices', 'Mixed', 'Lifts revenue per gram but cuts grams bought; customers shift to lighter, 18k and studded pieces, and exchange old gold (46% of Kalyan\'s Q1FY27 sales).'],
      ['Lab-grown diamonds', 'Headwind', 'LGD prices down ~80% since 2022; pressure on natural-diamond pricing and new competitors in studded jewellery.'],
      ['Weddings', 'Tailwind', '~60% of industry demand is wedding-related and cannot easily be postponed.'],
      ['Competition', 'Headwind', 'Tanishq (Titan) growing 20-38%; Malabar and Joyalukkas scaling; listed regionals (Lalithaa, Thangamayil, PN Gadgil) and online players (CaratLane, BlueStone).'],
    ], source: 'CRISIL (Lalithaa RHP), ICRA, WGC, BIS, press' } },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Tailwind test: Kalyan captures more than its share',
  blocks: [
    { verdicts: [
      ['Shift from unorganised to organised', 'Yes', 'Revenue +43% in FY26 vs industry value growth ~20%; 28% same-store growth in Q1FY27.', 'Kalyan is a clear winner of share shift.'],
      ['Expansion beyond South India', 'Yes', 'Non-South went from 34% of India revenue (FY22) to 50-59%; non-South SSSG 27% in Q1FY27.', 'Proven that the brand travels.'],
      ['Gold price inflation', 'Yes', 'Revenue per gram rises with gold; volumes falling industry-wide.', 'Boosts reported growth; reverses if gold falls.'],
      ['Studded / higher-margin mix', 'No', 'India studded share 29.7% in Q1FY27, down from 30.4% a year earlier; Titan is far ahead.', 'Margin upside not being captured.'],
      ['Online and lightweight (Candere)', 'Partly', 'Candere revenue +64% in Q2FY27 but only ₹425 cr in FY26 and just profitable.', 'Small option, not yet material.'],
      ['Middle East diaspora', 'Partly', 'ME revenue +29% in Q1 but +12% in Q2; store count flat at 38 for two years.', 'Steady, not a growth engine.'],
    ], head: ['Industry tailwind', 'Captured?', 'Evidence', 'So what'], title: 'Tailwind test', source: SRC },
  ],
};

// ---------------------------------------------------------------- Segments
const segments = {
  id: 'segments', nav: 'India, Middle East & Candere', kicker: 'Segments', title: 'India drives everything; the Middle East and Candere are side stories',
  blocks: [
    { pair: [
      { type: 'column', title: 'India revenue by quarter', unit: 'India revenue (₹ crore); Q1FY27 ex-bullion', x: QL, series: [{ name: 'India', values: qv('indiaRev'), fmt: 'num' }], labels: 'ends', source: SRC },
      { type: 'line', title: 'South and non-South grow at a similar pace', unit: 'Same-store sales growth (%)', x: QL, series: [{ name: 'South', values: qv('southSssg'), fmt: 'pct0' }, { name: 'Non-South', values: qv('nonSouthSssg'), fmt: 'pct0' }], labels: 'last', source: SRC },
    ] },
    { pair: [
      { type: 'line', title: 'Studded share is stuck around 30%', unit: 'Studded jewellery, % of India revenue', x: QL, series: [{ name: 'Studded', values: qv('studdedSharePct'), fmt: 'pct' }], labels: 'all', min: 20, max: 40, source: SRC },
      { type: 'column', title: 'Middle East: steady, ~7% margin', unit: 'Middle East revenue (₹ crore)', x: QL, series: [{ name: 'Middle East', values: qv('meRev'), fmt: 'num' }], labels: 'ends', source: SRC },
    ] },
    { bullets: [
      `**India** (${(A26.indiaRev / A26.consRev * 100).toFixed(0)}% of revenue): revenue ₹${n0(A26.indiaRev)} cr in FY26 (+43%), EBITDA margin 6.8%. Q1FY27 +38% ex-bullion with 28% same-store growth; the Q2 update showed +27% and ~20%. The margin has slipped to 5.9% (5.1% underlying) as franchise mix rises and gold-exchange promotions cost 20-30bp.`,
      `**Middle East** (${(A26.meRev / A26.consRev * 100).toFixed(0)}%): ₹${n0(A26.meRev)} cr, margin ~7%. 38 stores, flat for two years; management is negotiating a larger franchise partnership. Growth slowed to +12% in Q2FY27.`,
      `**Candere** (~1%): ₹${n0(A26.candereRev)} cr, growing 50-65% and just profitable. Management once aimed for ₹1,000 cr revenue; it is an option, not a valuation driver.`,
      '**New: Akshaya Thanga Maligai**, a Tamil Nadu value brand (22k-heavy, ~10% studded), to fight regional chains such as Lalithaa and Saravana. Only ~5 stores planned in FY27.',
    ] },
  ],
};

// ---------------------------------------------------------------- Moat
const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: a strong network, but no pricing power',
  blocks: [
    { verdicts: D.moat.map(m => [m.dimension, m.verdict[0].toUpperCase() + m.verdict.slice(1), m.evidence, m.verdict === 'advantage' ? 'Supports growth and returns.' : m.verdict === 'parity' ? 'Keeps Kalyan competitive; does not set it apart.' : 'Limits margins and multiples versus Titan.']), head: ['Dimension', 'Verdict', 'Evidence', 'So what'], title: 'Moat scorecard', source: 'GAM research compilation' },
    { callout: '**Honest verdict:** Kalyan\'s advantages are **scale, trust and a capital-light expansion engine**; these are real and explain why it grows faster than the market. But jewellery is a trust business with a commodity inside it: customers can compare gold rates and making charges across the street. Kalyan has **no pricing power**: its EBITDA margin has stayed at 6-8% for a decade, half of Titan\'s jewellery margin. A business like this deserves a growth multiple, but not a premium-brand multiple.' },
  ],
};

// ---------------------------------------------------------------- Earnings quality
const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: one-offs, gold hedges and franchise sales',
  blocks: [
    { bullets: [
      '**Customs duty swings.** Duty changes revalue the stock already paid for: a ₹124 cr loss in FY25 (duty cut) and gains of ~₹41 cr in Q1FY27 and ~₹60 cr expected in Q2FY27 (duty hike). Strip these out when comparing margins.',
      '**Gold hedging.** Almost all gold inventory is hedged through gold metal loans, gold on lease and futures, so gold-price moves largely offset in profit. This is prudent, but hedge accounting makes quarterly gross margins noisy.',
      '**Sales to franchisees.** About half of standalone revenue is jewellery shipped to franchise stores on up to 180 days\' credit. Receivables rose faster than sales in FY26.',
      '**Bullion sales.** From Q1FY27 Kalyan sells some bullion (₹581 cr in Q1); reported revenue growth (+46%) overstates jewellery growth (+38%).',
      '**Exceptional items.** FY26 included a ₹41.5 cr charge for the new Labour Codes.',
    ] },
    { callout: '**Accounting flag: AMBER.** No qualification from the auditor (Walker Chandiok since 2024), and hedging is conservative. But one-offs, franchise sales and bullion make headline growth and margins harder to read than at a simple retailer.' },
  ],
};

// ---------------------------------------------------------------- Ownership additions
const ownership = base => ({ ...base, blocks: [
  { p: 'The promoter family (T.S. Kalyanaraman and sons) holds 62.85%. Warburg Pincus, the private-equity backer since 2014, exited completely in 2023-24, mostly to Indian mutual funds; the promoter bought the last 2.36% at ₹535. Motilal Oswal Midcap Fund is the largest outside holder (9.17%).' },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Named holders and recent deals', head: ['Holder / deal', 'Stake', 'Note'], wide: [2], rows: [
    ['Promoter group (Kalyanaraman family)', '62.85%', '~25% of promoter shares (~15.6% of the company) pledged since Jan-2025, mainly to fund the Warburg stake purchase'],
    ['T.S. Kalyanaraman (individual)', '22.35%', 'Bought ~9 lakh shares in the market in Feb-2026 at ~₹431'],
    ['Motilal Oswal Midcap Fund', '9.17%', 'Largest institutional holder (Jun-2026)'],
    ['Mutual funds (all)', '13.60%', 'Down from 15.41% in the Jun-2026 quarter; a large MF block sale was reported in Jul-2026'],
    ['FIIs (all)', '13.83%', 'Up from 10.82%; BofA bought 0.79% at ₹471 in Jul-2026'],
    ['Warburg Pincus (Highdell)', '0%', 'Exited Aug/Sep-2024 after selling in four rounds from Mar-2023'],
  ], source: 'BSE shareholding pattern, SAST and block-deal filings, press' } },
  { callout: '**Our read:** the promoter pledge is the ownership risk. If the stock falls sharply, lenders could sell pledged shares, adding to the fall. Management says the pledge funded the Warburg purchase and is not for business needs.' },
] });

// ---------------------------------------------------------------- Governance
const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: a family business with a strong board and a rumour problem',
  blocks: [
    { exhibit: { type: 'table', title: 'Key people', head: ['Name', 'Role', 'Note'], wide: [2], rows: C.management.slice(0, 9).map(m => [m.name, m.role, m.note || '']), source: 'Kalyan annual report FY26, company filings' } },
    { verdicts: [
      ['Board and chair', 'Strong', 'Chaired by Vinod Rai (ex-CAG); independent directors refreshed in Jan-2026; ex-Shoppers Stop CEO on the board.', 'Better than most family-run retailers.'],
      ['Promoter pledge', 'Weak', '~25% of promoter shares pledged since Jan-2025.', 'Forced-selling risk in a sharp fall.'],
      ['Related parties', 'Moderate', 'Purchases from promoter-group textile and printing firms; promoters give personal guarantees (₹3,000 cr) and property as loan collateral.', 'Small in rupees, but worth monitoring.'],
      ['Allegations (Jan-2025)', 'Moderate', 'Social-media claims of raids and bribery; denied by the company and Motilal Oswal AMC; no regulatory action found.', 'Stock remains sensitive to rumours.'],
      ['Tax disputes', 'Strong', 'Income-tax demand ₹19.8 cr; small GST penalties.', 'Immaterial.'],
      ['Capital allocation', 'Strong', '₹1,000 cr of non-gold debt repaid FY24-26; ~20% dividend payout; non-core property sold.', 'Disciplined since listing.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'GAM research compilation' },
  ],
};

// ---------------------------------------------------------------- Forecasts
const segRow = (k, name, field, hist, fmt = 'num') => [name, n0(hist), ...[0, 1, 2].map(i => `{{F.seg.${k}.${field}.${i}|${fmt}}}`)];
const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: ~18% revenue growth, margins flat, EPS below consensus',
  blocks: [
    { p: 'We forecast each segment\'s revenue and EBITDA margin. Group EBITDA is the sum, plus franchise royalties and other operating income. Gold metal loans are treated as inventory funding (they grow with sales); interest falls as non-gold debt has been repaid. Every assumption, with our reasoning, is in the Excel model\'s Assumptions sheet, which recalculates this report\'s target price.' },
    { exhibit: { type: 'table', title: 'Segment forecasts (₹ crore)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      { sec: 'India' }, segRow('india', 'Revenue', 'revenue', A26.indiaRev), segRow('india', 'EBITDA', 'adjEbitda', A26.indiaEbitda),
      { sec: 'Middle East' }, segRow('me', 'Revenue', 'revenue', A26.meRev), segRow('me', 'EBITDA', 'adjEbitda', A26.meEbitda),
      { sec: 'Candere' }, segRow('candere', 'Revenue', 'revenue', A26.candereRev), segRow('candere', 'EBITDA', 'adjEbitda', 0),
    ], source: 'Company (FY26), GAM Research estimates' } },
    { exhibit: { type: 'rows', title: 'Group P&L and cash flow summary (₹ crore)', from: 'FY24', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' },
      { name: 'Net profit', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n1' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'ROE', ref: 'fin.roe', fmt: 'pct' }, { name: 'Free cash flow', ref: 'fin.fcf' },
    ], source: 'Company, GAM Research estimates' } },
    { exhibit: { type: 'table', title: 'GAM vs the street', head: ['', 'GAM FY27E', 'Consensus FY27E', 'GAM FY28E', 'Consensus FY28E'], rows: [
      ['EPS (₹)', '{{F.eps.0|n1}}', '16.0', '{{F.eps.1|n1}}', '19.1'],
      ['Revenue, MOFSL (₹ cr)', '{{F.sales.0|num}}', '46,683', '{{F.sales.1|num}}', '55,065'],
      ['Revenue, BOBCAPS (₹ cr)', '{{F.sales.0|num}}', '42,576', '{{F.sales.1|num}}', '51,993'],
    ], source: 'Bloomberg consensus via BOBCAPS (Aug-2026), MOFSL, BOBCAPS, GAM Research' } },
    { callout: 'We are ~8% below consensus EPS for FY27-28 because we assume (1) a sharp slowdown in H2FY27 against a very high base (Q4FY26 India revenue was +68%), the duty hike and the Prime Minister\'s appeal; and (2) no recovery in India margin, which has fallen as franchise mix rises.' },
  ],
};

// ---------------------------------------------------------------- Street
const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: 'The street: 8 Buys, 1 Hold. We are more cautious',
  blocks: [
    { exhibit: { type: 'table', title: 'Recent broker calls', head: ['Broker', 'Rating', 'Target (₹)', 'Date', 'Thesis'], wide: [4], rows: brokers.map(b => [b.broker, b.rating, n0(b.tp), b.date, b.thesis || '–']), source: 'Broker notes via Business Today, MOFSL, BOBCAPS' } },
    { p: 'The bull case on the street rests on 20%+ earnings growth for several years, capital-light franchise growth and a 30% discount to Titan (brokers apply 35-40x forward earnings). We agree on the quality of execution. We disagree on two points: (1) how much of the growth is the gold price, which can reverse; and (2) whether a 6% EBITDA-margin business deserves a multiple close to Titan\'s, which earns about twice the margin.' },
  ],
};

// ---------------------------------------------------------------- Valuation
const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: 'Valuation: 30x Sep-28E earnings gives {{dcf.tp|inr}}',
  blocks: [
    { h: 'How the street values Kalyan' },
    { p: 'Brokers value jewellers the way they value consumer retailers: on **P/E on earnings two years out**. Four of the five brokers whose method we could find use P/E on 2028 earnings, at 35-40x; only ICICI Securities uses a DCF. We therefore set our target the same way, so that our number is comparable with theirs. The difference between us and the street is in the inputs (our EPS is ~8% below consensus, and our multiple is lower), not in the method.' },
    { exhibit: { type: 'table', title: 'How the street values Kalyan', head: ['Broker', 'Rating', 'Target (₹)', 'Method', 'Multiple', 'On', 'At our EPS (₹)', 'Thesis'], wide: [7], rows: [
      ...streetMethods.map(([b, r, tp, m, x, on, th]) => [b, r, n0(tp), m, x, on, x !== '–' ? n0(parseFloat(x) * (on.startsWith('Sep') ? epsSep28 : on.startsWith('Jun') ? F.eps[1] * 0.75 + F.eps[2] * 0.25 : F.eps[1])) : '–', th]),
      { hl: true, cells: ['**GAM Research**', '**HOLD**', '**{{dcf.tp|num}}**', '**P/E**', '**30x**', '**Sep-28E EPS**', '**{{dcf.tp|num}}**', 'Sector de-rated; growth partly gold-price driven'] },
    ], source: 'Broker notes via Business Today, MOFSL, BOBCAPS, Jefferies coverage; "At our EPS" applies each broker\'s multiple to GAM estimates' } },
    { h: 'Our target multiple: 30x, and why' },
    { p: `The target is a 12-month price, so we apply a **one-year-forward** P/E to the earnings the market will be looking at in October 2027: **Sep-28E EPS of ₹${epsSep28.toFixed(1)}** (half FY28E, half FY29E), the same basis Jefferies uses. To choose the multiple we start from Kalyan's own history and adjust for where the sector is today.` },
    { exhibit: { type: 'table', title: 'Deriving the target multiple', head: ['Yardstick', 'Evidence', 'What it implies'], wide: [1, 2], rows: [
      ['1. Kalyan\'s own history', 'One-year-forward P/E: median ~40x since 2023 (25th-75th percentile 31-51x)', 'Starting point: 40x'],
      ['2. Sector de-rating', 'Titan trades at 65x trailing vs an 86x five-year median: the whole sector is ~24% cheaper than its norm, after the duty hike and record gold prices', '40x × 0.76 ≈ **30x**'],
      ['3. Discount to Titan', 'Kalyan has traded at 0.72x Titan\'s P/E (median since 2023; range 0.53-0.86x); today 0.55x', '30x is ~0.6x Titan\'s current multiple: within its normal range, not stretched'],
      ['4. Growth-adjusted (PEG)', `Our EPS growth FY26-29E ~17% a year`, '30x ≈ 1.8x PEG: in line with Indian consumer retail'],
      ['5. The street', '35-40x on Mar/Jun/Sep-28E EPS', 'We sit below the street, by design'],
    ], source: 'Screener.in (P/E history for Kalyan and Titan), GAM Research' } },
    { pair: [
      { type: 'line', title: 'One-year-forward P/E: 30x is below the post-2023 median', unit: 'Price ÷ next full-year EPS (x)', x: fwdPe.map(x => x[0]), series: [{ name: 'Forward P/E', values: fwdPe.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: 40, text: 'Median since 2023: ~40x' }, { v: 30, text: 'Our target: 30x', color: '#cf8f1f' }], source: 'Screener.in prices; actual EPS, GAM estimates for FY27-28E' },
      { type: 'hbar', title: 'Target and cross-checks vs the share price', unit: '₹ per share (base case)', x: ['P/E 30x Sep-28E (target)', 'EV/EBITDA 17x Sep-28E', 'DCF', 'Share price today'], series: [{ name: 'Value', values: [Math.round(mv('pe').value), Math.round(mv('ev').value), Math.round(mv('dcf').value), price], fmt: 'inr' }], labels: 'all', highlight: 'P/E 30x Sep-28E (target)', source: 'GAM Research' },
    ] },
    { exhibit: { type: 'table', title: 'Target price and cross-checks', head: ['Method', 'Role', 'Basis', 'Multiple', 'Value / share (₹)', 'vs target', 'Bull (₹)', 'Bear (₹)'], rows: [
      ['**P/E**', '**Target**', `Sep-28E EPS ₹${epsSep28.toFixed(1)}`, '30x (bull 36x, bear 24x)', '**{{dcf.blend.methods.0.value|num}}**', '–', '{{scen.bull.blend.methods.0.value|num}}', '{{scen.bear.blend.methods.0.value|num}}'],
      ['EV/EBITDA', 'Cross-check', `Sep-28E EBITDA ₹${n0(mv('ev').metric)} cr`, '17x (bull 20x, bear 13x)', '{{dcf.blend.methods.2.value|num}}', `${mv('ev').vsTarget.toFixed(0)}%`, '{{scen.bull.blend.methods.2.value|num}}', '{{scen.bear.blend.methods.2.value|num}}'],
      ['DCF', 'Cross-check', '15-year FCFF, Ke 12.5%, g 6%', `implies ${n1(dcfPe28)}x FY28E`, '{{dcf.blend.methods.1.value|num}}', `${mv('dcf').vsTarget.toFixed(0)}%`, '{{scen.bull.blend.methods.1.value|num}}', '{{scen.bear.blend.methods.1.value|num}}'],
      { hl: true, cells: ['**12-month target (rounded)**', '', '', '', '**{{dcf.tp|inr}}**', '{{dcf.upside|chg}} vs CMP', '{{scen.bull.tp|inr}}', '{{scen.bear.tp|inr}}'] },
    ], source: 'GAM Research' } },
    { callout: `**What the cross-checks tell us.** EV/EBITDA lands within 3% of the P/E target, so the multiple is internally consistent. The DCF is ${Math.abs(mv('dcf').vsTarget).toFixed(0)}% lower: on cash flows alone, a 6% margin and ₹14,000 cr of inventory do not support even 30x. That is the main risk to the market's way of valuing Kalyan: if growth slows, the multiple can fall towards the DCF. It is also why we use a lower multiple than the street.` },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', '{{as.scenarios.bull.narrative}} The multiple recovers to 36x Sep-28E.'],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', 'India revenue +21% / +18% / +17% (FY27-29E), margin ~6%; 30x Sep-28E EPS.'] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', '{{as.scenarios.bear.narrative}} The multiple falls to 24x, Kalyan\'s 2023 level.'],
    ], source: 'GAM Research' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-41E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Less: net debt at Mar-27 (excl. gold loans, incl. leases)', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
      { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Implied P/E on FY28E', `${n1(dcfPe28)}x`], ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of capital down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Listed peers', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)'], rows: [
      ['**Kalyan**', n0(mcap), n0(A26.consRev), '7.2%', `${n1(price / 13.08)} (FY26); ${n1(pe27)} (FY27E)`],
      ['Titan (group)', '~3,82,000', '–', 'Jewellery EBIT ~11-12%', '~65 (trailing)'],
      ['Thangamayil', '15,126', '8,499', '6.8%', '38.7'],
      ['Sky Gold (B2B)', '12,762', '6,295', '6.9%', '38.1'],
      ['PN Gadgil', '7,292', '10,739', '6.6%', '18.2'],
      ['Lalithaa (IPO, Aug-2026)', '11,250', '25,024', '–', '11.1 (at issue)'],
      ['Senco Gold', '5,488', '8,430', '11.5% (incl. gains)', '9.6'],
    ], source: 'Screener.in, Value Research, RHP; dates vary (Aug-Oct 2026)' } },
  ],
};

// ---------------------------------------------------------------- Verdict
const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: 'Our honest summary: great business, close to fair value',
  blocks: [
    { callout: '**What you are buying:** India\'s best-executing mass-market jeweller, growing ~20% a year with a capital-light franchise engine, a strong board and falling debt.' },
    { callout: `**What you are paying:** ${n1(pe28)}x FY28E earnings, below Kalyan's own history and at its widest discount to Titan. On the street's method (P/E) and our inputs, the target is {{dcf.tp|inr}} ({{dcf.upside|chg}}). That is just short of our 15% BUY threshold, and the DCF warns that cash flows support a lower price if growth slows.` },
    { exhibit: { type: 'table', title: 'What would make it a BUY', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      ['Price falls below ~₹500 (15%+ upside to our target)', 'Medium', 'Share price; gold-price and policy headlines'],
      ['Margin recovers as cash-for-gold and studded mix improve', 'Medium', 'India EBITDA margin back above 6.5%'],
      ['Duty rollback or easing of the PM\'s appeal', 'Low-medium', 'Government statements; budget (Feb-2027)'],
      ['Faster franchise roll-out (100+ stores a year)', 'Low-medium', 'Quarterly store adds'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What would make it a SELL', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['Gold price falls 15-20%', 'Medium', 'Revenue growth falls to single digits; one-off inventory losses; multiple contracts towards the DCF value'],
      ['Promoter pledge triggered in a sell-off', 'Low', 'Forced selling'],
      ['New allegations / rumours', 'Medium', 'Sharp price moves as in Jan-2025'],
      ['Competition from Tanishq, Malabar and regionals', 'Medium', 'Lower same-store growth, higher discounts'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: HOLD, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText} Kalyan sits just under the BUY line.`,
      `**Buy below ~₹${n0(buyBelow)}**, or if India EBITDA margin recovers above 6.5% while growth stays above 20%.`,
      `**Sell above ~₹${n0(sellAbove)}** (${n1(sellAbove / epsSep28)}x Sep-28E), or if margins slip below 5.5% or the gold price falls sharply.`,
      '**Biggest swing factor:** the gold price. Kalyan\'s revenue, earnings and multiple all track it.',
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Revenue growth, FY26', v: '+43%', d: 'gold price ~+40%' },
      { k: 'India EBITDA margin, Q1FY27', v: '5.9%', d: '5.1% ex one-off; 6.8% in FY26' },
      { k: 'Franchise share of India revenue', v: '57%', d: 'from 40% in Q3FY25' },
      { k: 'Target multiple', v: '30x', d: `Sep-28E EPS ₹${epsSep28.toFixed(1)}; street 35-40x` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

// ---------------------------------------------------------------- Glossary
const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['FOCO', 'Franchise-owned, company-operated: the partner owns the store and stock; Kalyan runs it and shares the margin.'],
      ['COCO', 'Company-owned, company-operated store.'],
      ['SSSG / LTL', 'Same-store sales growth (like-for-like): growth from stores open for over a year, excluding new stores.'],
      ['Studded jewellery', 'Jewellery set with diamonds or precious stones; higher margin than plain gold.'],
      ['Making charge', 'The fee for craftsmanship, added to the gold value; the jeweller\'s main source of margin on plain gold.'],
      ['Gold metal loan (GML)', 'Gold borrowed from a bank to stock showrooms, repaid in gold; cheaper than cash loans and a natural hedge.'],
      ['Gold exchange / cash-for-gold', 'Customers trade in old gold for new jewellery (exchange) or sell it for cash; reduces the need to import gold.'],
      ['HUID hallmarking', 'Mandatory 6-digit hallmark identifying each piece and certifying purity.'],
      ['Customs duty', 'Tax on imported gold: cut to 6% in Jul-2024, raised to 15% in May-2026.'],
      ['EBITDA / PBT margin', 'Operating profit before depreciation and interest / profit before tax, as % of revenue.'],
      ['DCF / WACC', 'Discounted cash flow valuation; WACC is the required annual return used to discount future cash.'],
      ['P/E', 'Share price divided by earnings per share.'],
    ], source: 'GAM Research' } },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, business, history, industry, tailwind, segments, moat, p.financials, quality, p.balance, ownership(p.ownershipBase), governance, forecasts, street, valuation, risks, p.statements, glossary],
  statementNotes: {
    'sales@FY27E': 'GAM: +20%; H2 slows against the gold-price surge of Q3-Q4FY26 and the duty hike.',
    'ebitdaMargin@FY27E': 'Franchise mix and gold-exchange promotions keep margin near 6.4%.',
  },
};
