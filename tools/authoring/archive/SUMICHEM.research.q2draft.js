// Sumitomo Chemical India report, part B: story, business, history, industry, tailwind test,
// parent & pipeline, moat, earnings quality, ownership, governance, forecasts, street, valuation,
// verdict, glossary. Prose numbers come from research/company.json, deep.json, segments.json and
// the built model; forecast and valuation figures are live tokens ({{...}}) that follow assumptions.json.
const fs = require('fs');
const path = require('path');
const { streetBlocks, forwardSeries } = require('./valuation-blend');
const { ruleText, buyBelow: buyAt, sellAbove: sellAt } = require('../../src/ratings');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'SUMICHEM', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'models', 'SUMICHEM.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual;
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const SRC = 'Sumitomo Chemical India annual reports and investor presentations, GAM Research';

const SA = SG.annual, SQ = SG.quarterly, QL = SQ.map(q => q.q);
const A26 = SA.find(a => a.fy === 'FY26'), A23 = SA.find(a => a.fy === 'FY23');
const price = M.price.last, mcap = M.meta.marketCap || price * F.shares;
const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const epsSep28 = mv('pe').metric;
const cash = C.cashAndTreasury.cashAndLiquidInvestmentsCr, cashNow = cash.at(-1).value;
const RP = C.parent.relatedPartyFY26_RsCr, RP27 = C.parent.relatedPartyFY27Approved_RsCr;
// Core ROE: profit less after-tax treasury income, over equity less liquid funds (FY26).
const coreRoe = (A.pat.at(-1) - A.otherIncome.at(-1) * 0.745) / (A.netWorth.at(-1) - cash.find(c => c.date === '2026-03-31').value) * 100;
const fwdPe = forwardSeries('SUMICHEM', M, 'eps').filter(x => x[0] >= '2020-04-01');
const pePeers = D.peers.filter(p => p.pe && !/BESTAGRO|DHARMAJ|INSECTICID|BHARATRAS/.test(p.symbol)).sort((a, b) => b.pe - a.pe);
const rating = 'HOLD';
const buyBelow = Math.round(buyAt(V.tp) / 5) * 5, sellAbove = Math.round(sellAt(V.tp) / 5) * 5;

const cover = {
  headline: 'A cash-rich subsidiary of a Japanese major, priced for growth it has not delivered',
  lead: `Sumitomo Chemical India sells crop-protection chemicals to Indian farmers through 40,000 dealers: about 71% generic products inherited from Excel Crop Care, and 29% patented molecules from its 75% parent, Sumitomo Chemical of Japan. It has no debt and ₹${n0(cashNow)} cr of cash. But revenue has not grown since FY23, and FY27 is being hit by the weakest monsoon since 2015 and a halving of the parent's own orders. The street values it on **P/E on FY28E earnings (36-45x)**, assuming 13-21% a year of earnings growth; we forecast ~8%. Applying **28x to Sep-28E EPS of ₹${n1(epsSep28)}** gives **{{dcf.tp|inr}} ({{dcf.upside|chg}})**: **we initiate with HOLD.** The cross-checks are lower (EV/EBITDA ₹${n0(mv('ev').value)}, DCF ₹${n0(mv('dcf').value)}) because a P/E on total profit capitalises the interest on the cash pile at 28x. Bull case {{scen.bull.tp|inr}}; bear case {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'Growth has stalled for three years', p: `Revenue was ₹${n0(A23.consRev)} cr in FY23 and ₹${n0(A26.consRev)} cr in FY26; domestic crop-protection sales were lower in FY26 than in FY23 (standalone ₹2,485 cr vs ₹2,607 cr). Management concedes peers have grown faster. H1FY27 revenue fell 1%.` },
    { h: 'The parent is both the moat and the ceiling', p: 'Exclusive Indian rights to Sumitomo Japan\'s patented molecules give the company its best products (Excalia Max sales +50% in H1FY27). But the parent decides the timing: its Japan orders halved this year because it is over-stocked, it dropped and then restored the animal-nutrition business, it has started charging a royalty, and its semiconductor plans in India sit with the parent, not the listed company.' },
    { h: 'A lazy balance sheet', p: `₹${n0(cashNow)} cr of cash, ~15% of the market value, earns ~7% before tax and management has no plan to return it (payout ~12%). The core business earns ~${Math.round(coreRoe)}% on its own equity; the cash drags group ROE down to 16%.` },
    { h: 'Valuation: de-rated, but not yet cheap', p: `The stock has fallen 41% from its Aug-2026 high and trades at ${n1(price / F.eps[0])}x our FY27E earnings, versus a ~42x forward median since 2023. On the street's method and our lower growth, 28x gives only ~8% upside, and the cash-adjusted cross-checks give less.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'RED' },
    { k: 'Earnings momentum', v: 'RED' },
    { k: 'Competitive position', v: 'GREEN' },
    { k: 'Valuation', v: 'AMBER' },
  ],
  catalysts: [
    'Q3FY27 results (Jan-2027): how bad the rabi season is after El Niño and low reservoirs.',
    'IMD\'s first monsoon forecast for 2027 (April): the FY28 recovery depends on it.',
    'Delhi High Court on the glyphosate restriction (~11-15% of revenue); final paraquat ban (an opportunity).',
    'Parent decisions: Japan orders normalising, new molecules for India, whether its semiconductor-chemicals project sits in the listed company.',
    'Bhavnagar plant for the parent (Q4FY27); any use of the cash (acquisition or payout).',
  ],
};

// ---------------------------------------------------------------- Story in charts
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'stacked', title: 'Domestic crop protection: no growth since FY23', unit: 'Revenue by market (₹ crore)', x: 'R.segments.annual[].fy', series: [{ name: 'Domestic crop protection', ref: 'R.segments.annual[].agroDomestic', fmt: 'num' }, { name: 'Exports', ref: 'R.segments.annual[].exports', fmt: 'num' }, { name: 'Animal nutrition (pass-through)', ref: 'R.segments.annual[].animalNutrition', fmt: 'num' }], minLabel: 150, source: SRC },
      { type: 'column', title: 'Revenue growth: five quarters without growth', unit: 'Revenue growth, year on year (%)', x: QL, series: [{ name: 'Revenue growth', values: C.revenueMixQuarterly.map(q => q.revYoYPct), fmt: 'pct0' }], labels: 'all', source: SRC },
    ] },
    { pair: [
      { type: 'line', title: 'Cash and liquid investments have doubled in 2½ years', unit: 'Cash, deposits and liquid investments (₹ crore, company figure)', x: cash.map(c => c.date.slice(0, 7)), series: [{ name: 'Liquid funds', values: cash.map(c => c.value), fmt: 'num' }], labels: 'ends', source: 'Company investor presentations' },
      { type: 'column', title: 'Interest income: from ~5% to ~18% of pre-tax profit', unit: 'Other income as % of profit before tax', x: 'A.labels', from: 'FY21', series: [{ name: 'Other income share', ref: 'A.otherIncomeShare', fmt: 'pct0' }], labels: 'all', source: 'Screener.in (consolidated)' },
    ] },
    { pair: [
      { type: 'hbar', title: 'What it sells: insecticides and herbicides are two-thirds', unit: 'FY26 revenue by category (%)', x: ['Insecticides', 'Herbicides', 'Metal phosphides (fumigants)', 'Plant growth regulators', 'Fungicides', 'Animal nutrition & household'], series: [{ name: 'Share', values: [A26.insecticides, A26.herbicides, A26.metalPhosphides, A26.pgr, A26.fungicides, A26.other], fmt: 'pct0' }], labels: 'all', source: 'Annual report FY26' },
      { type: 'hbar', title: 'Still the priciest listed crop-protection stock', unit: 'Trailing P/E (x), 28-Oct-2026', x: pePeers.map(p => p.name.replace(/ India$| International$/, '')), series: [{ name: 'P/E', values: pePeers.map(p => p.pe), fmt: 'x' }], labels: 'all', highlight: 'Sumitomo Chemical', source: 'Screener.in' },
    ] },
    { pair: [
      { type: 'line', title: 'Forward P/E: from ~45x to below 30x', unit: 'Price ÷ next full-year EPS (x)', x: fwdPe.map(x => x[0]), series: [{ name: 'Forward P/E', values: fwdPe.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: 42, text: 'Median since 2023: ~42x' }], source: 'Screener.in prices; actual EPS, GAM estimates for FY27-28E' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street', unit: `₹ per share; CMP ₹${n0(price)}`, x: ['Anand Rathi (Jul)', 'ICICI Direct (Jul)', 'ICICI Securities (Oct)', 'GAM (base)'], series: [{ name: 'Target', values: [650, 625, 485, V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes, GAM Research' },
    ] },
  ],
};

// ---------------------------------------------------------------- Business
const business = {
  id: 'business', nav: 'What it does', kicker: 'The business', title: 'Two businesses under one roof: Excel\'s generics and Sumitomo\'s patents',
  blocks: [
    { p: 'Sumitomo Chemical India (SCIL) is the Indian arm of Sumitomo Chemical, Japan\'s eighth-largest crop-protection company globally. It was a small distributor of its parent\'s products until 2016-19, when it bought and merged Excel Crop Care, a listed Indian maker of generic pesticides with its own plants and brands. Today it does two quite different things: it **makes and sells generic products** (glyphosate, chlorpyriphos, profenofos, aluminium phosphide) that compete on price with Indian and Chinese makers (~71% of revenue); and it **sells the parent\'s patented molecules** under Sumitomo brands (~29%), often formulating them locally. It also exports, distributes household insecticides, and passes through animal-feed additives (methionine) for the parent at a fixed 4-5% margin.' },
    { exhibit: { type: 'table', title: 'Where FY26 revenue came from', head: ['Line', 'Revenue (₹ cr)', 'Share', 'Note'], wide: [3], rows: [
      ['**Domestic crop protection**', n0(A26.agroDomestic), `${Math.round(A26.agroDomestic / A26.consRev * 100)}%`, '81% under own brands; insecticides, herbicides, fumigants, PGRs, fungicides, bio-products'],
      ['**Exports**', n0(A26.exports), `${Math.round(A26.exports / A26.consRev * 100)}%`, `Brazil ₹${n0(A26.exportsBrazil)} cr, Japan (mostly the parent) ₹${n0(A26.exportsJapan)} cr, UAE ₹132 cr; ~25% to group companies`],
      ['**Animal nutrition**', n0(A26.animalNutrition), `${Math.round(A26.animalNutrition / A26.consRev * 100)}%`, 'Methionine sold back-to-back for the parent at ~4-5% margin; paused in Q3FY26, restarted May-2026'],
      ['**Other domestic**', n0(A26.othersDomestic), '1%', 'Environmental health (household and public-health insecticides) and other'],
      { hl: true, cells: ['**Consolidated revenue**', n0(A26.consRev), '100%', 'Net of ₹333 cr of rebates and discounts to dealers (9.3% of gross sales)'] },
    ], source: 'Annual report FY26 (revenue by product categories), investor presentations' } },
    { exhibit: { type: 'table', title: 'Reach and assets', head: ['', 'Detail'], wide: [1], rows: [
      ['Distribution', '15,000+ distributors, ~40,000 dealers, 60 depots, 26 states; ~600 sales staff and 1,500+ field officers; CRISIL estimates ~85% coverage of India'],
      ['Brands', '200+ brands, 20+ "mega brands" (Sumi Max, Excel Mera 71 glyphosate); 700+ SKUs; 200+ registrations'],
      ['Plants', 'Bhavnagar (58 acres, technicals), Gajod (fumigants), Tarapur (active ingredients incl. CTPR), Vapi and Silvassa (formulations); new 50-acre Dahej site'],
      ['Biologicals', 'Barrix Agro Sciences (85%, bought Dec-2023 for ₹78 cr): pheromone traps and biostimulants; ₹90 cr revenue, near-zero profit in FY26'],
      ['R&D', '3 approved labs, 75+ scientists; ₹14 cr spend (0.45% of revenue): new molecules come from the parent, not from India'],
    ], source: 'Annual report FY26, CRISIL, company presentations' } },
  ],
};

// ---------------------------------------------------------------- History
const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'From a parent\'s distributor (2000) to a listed generic-plus-specialty company',
  blocks: [
    { exhibit: { type: 'table', title: 'Key events and what they did to the numbers', head: ['When', 'Event', 'Impact'], wide: [1, 2], rows: [
      ['2000-06', 'Sumitomo Chemical India set up; household-insecticide plant bought from Bayer (2003); animal nutrition (2006)', 'Built the distribution and non-crop lines'],
      ['2016', 'Buys 45% of Excel Crop Care at ₹1,259 a share plus 20% via open offer (~₹900 cr in total)', 'Control of a listed generic maker with plants and brands'],
      ['2019', 'Excel merged into SCIL (51 SCIL shares for every 2 Excel shares)', 'Combined revenue ~₹2,230 cr; parent\'s stake falls to 80%'],
      ['Jan-2020', 'SCIL lists on BSE and NSE', ''],
      ['FY21', 'Parent sells 5.3% via offers for sale', 'Promoter at 75%, the legal maximum for a listed company'],
      ['FY24', 'Global destocking: revenue −19%, profit −26%; ₹5 special dividend', 'Earnings reset; ~80% payout that year'],
      ['Dec-2023', 'Buys 85% of Barrix Agro Sciences for ₹78 cr', 'Entry into biologicals; ₹60 cr goodwill'],
      ['FY25-26', 'Land at Dahej and Bhavnagar; plants approved to make molecules for the parent (₹225 cr)', 'Start of contract manufacturing for Sumitomo Japan'],
      ['Q3FY26', 'Parent pulls animal-nutrition distribution (₹72 cr revenue lost), restores it in May-2026', 'Shows how parent decisions move the numbers'],
      ['Sep-2026', 'Dr Suresh Ramachandran becomes MD; Chetan Shah (MD since 2019) becomes chairman', 'Leadership handover'],
      ['Oct-2026', 'Q2FY27: profit −12%, exports −23% (parent orders halved); stock at a 52-week low of ₹334', ''],
    ], source: 'Company filings, annual reports, open-offer documents' } },
    { callout: '**Corporate actions since listing:** no bonus, split or buyback; share count unchanged at 49.9 cr. One special dividend (₹5, Feb-2024). The parent has held exactly 75% since FY21, so it cannot buy more without first delisting or diluting others.' },
  ],
};

// ---------------------------------------------------------------- Industry
const ind = D.industry;
const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'A ₹31,000 cr market growing 5-6% a year, ruled by the monsoon',
  blocks: [
    { p: `India's domestic crop-protection market was about ₹${n0(ind.domesticMarket.sizeFY25Cr)} cr in FY25 and is expected to grow 5-6% a year to FY28 (CRISIL). Indian farmers use far less than most countries (~0.6 kg per hectare vs ~3 kg in the US and ~12.6 kg in Brazil), so there is long-term room, but demand in any one year depends on the monsoon, pest attacks and crop prices. India is also the world's third-largest exporter of these chemicals (~₹38,000 cr in FY25), mainly generics, priced against Chinese supply. The market is fragmented: global innovators (Bayer, Syngenta, BASF, Corteva, Sumitomo), large Indian firms (UPL, PI, Coromandel, Rallis, Dhanuka) and hundreds of small generic makers.` },
    { pair: [
      { type: 'hbar', title: 'Indian farms use very little crop protection', unit: 'Kg of active ingredient per hectare', x: ['Brazil', 'United States', 'European Union', 'China', 'India'], series: [{ name: 'Use', values: [12.6, 3.0, 2.9, 1.8, 0.6], fmt: 'n1' }], labels: 'all', highlight: 'India', source: 'FAO via CRISIL (approximate chart reading)' },
      { type: 'hbar', title: 'Sumitomo is #8 in the world', unit: 'Crop-protection revenue, CY2024 (US$ bn)', x: Object.keys(ind.globalTop8CY24UsdBn).map(k => k === 'Sumitomo Chemical' ? 'Sumitomo (parent)' : k), series: [{ name: 'Revenue', values: Object.values(ind.globalTop8CY24UsdBn), fmt: 'n1' }], labels: 'all', highlight: 'Sumitomo (parent)', source: 'Company reports via research file' },
    ] },
    { exhibit: { type: 'table', title: 'Forces acting on the industry', head: ['Theme', 'Direction', 'What it means'], wide: [2], rows: [
      ['2026 monsoon (weakest since 2015)', 'Headwind', 'June rain ~35-40% short, season ~13% short; farmers skipped spray rounds; El Niño may hurt the winter crop too.'],
      ['Chinese generic prices', 'Headwind', 'Glyphosate still ~70% below its peak; ~71% of SCIL\'s revenue is generics priced off China.'],
      ['Glyphosate restriction (pending)', 'Headwind', 'A 2022 rule limiting use to licensed pest-control operators is stayed in the Delhi High Court; glyphosate is ~11-15% of SCIL revenue.'],
      ['Paraquat ban (draft, Jul-2026)', 'Tailwind', 'Removes a competing weedkiller; management sees more glyphosate demand.'],
      ['Herbicides and farm-labour shortage', 'Tailwind', 'Weedkillers are the fastest-growing category (+10-11% in FY26 for the industry).'],
      ['Biological products', 'Mixed', 'Global market to double by 2029, but new Indian rules froze sales for six months in 2025.'],
      ['Pesticides Management Bill', 'Neutral', 'Draft to replace the 1968 law; earlier drafts lapsed; states could get powers to ban products for a year.'],
    ], source: 'CRISIL, IMD, company calls, broker notes (via research file)' } },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Tailwind test: the industry grew; Sumitomo India mostly did not',
  blocks: [
    { verdicts: [
      ['Rising crop-protection use in India', 'No', 'Industry ~+5-6% a year; SCIL domestic crop-protection sales ₹2,350 cr in FY23 vs ₹2,313 cr in FY26.', 'Losing share to faster-growing peers.'],
      ['Herbicide boom (labour shortage)', 'Yes', 'Herbicides +19% in FY26; strong glyphosate franchise (Excel Mera 71).', 'The best-performing part of the portfolio, but exposed to regulation.'],
      ['Patented molecules from the parent', 'Partly', 'Specialty ~29% of revenue; products launched in the last 3 years only ~8% of domestic sales; Excalia Max +50%.', 'Real, but too small to move the total.'],
      ['India as a manufacturing hub ("China+1")', 'Partly', 'Sales to the parent ₹137 cr; ₹225 cr of plants under way for the parent, output from FY28-29.', 'An option worth watching; still ~4% of revenue.'],
      ['Exports', 'No', 'Exports ₹866 cr in FY23, ₹672 cr in FY26; −23% in Q2FY27.', 'Volatile and parent-dependent.'],
      ['Biologicals', 'Partly', '8-10% of revenue (above the industry), but Barrix earned ~nil and sales were frozen for six months in 2025.', 'Not yet a profit driver.'],
    ], head: ['Industry tailwind', 'Captured?', 'Evidence', 'So what'], title: 'Tailwind test', source: SRC },
  ],
};

// ---------------------------------------------------------------- Parent & pipeline
const parent = {
  id: 'parent', nav: 'The parent & the pipeline', kicker: 'Parent & pipeline', title: 'The parent: the source of the best products, and of the biggest uncertainty',
  blocks: [
    { p: 'Sumitomo Chemical (SCC) owns 75% and supplies the molecules that set SCIL apart from Indian generic makers. SCIL has the exclusive right to sell SCC\'s patented products in India under SCC brands, historically without paying a royalty. India has recently been moved into SCC\'s first tier of countries for early trials of new molecules (two are in Indian trials before their global launch). SCC also wants India as a manufacturing base: SCIL is building plants at Bhavnagar, Tarapur and Dahej to make molecules for SCC worldwide.' },
    { exhibit: { type: 'table', title: 'Money flowing between SCIL and its parent (₹ crore)', head: ['Flow', 'FY26 actual', 'FY27 approved limit', 'Note'], wide: [3], rows: [
      ['Sales to SCC (exports, contract manufacturing)', n0(RP.saleOfGoodsToSCC), n0(RP27.saleOfGoods), 'Japan orders roughly halved in H1FY27 (SCC over-stocked)'],
      ['Purchases from SCC (crop protection, household)', n0(RP.purchaseOfGoodsFromSCC), n0(RP27.purchaseAgroAndEH), 'Technical-grade molecules SCIL formulates and sells'],
      ['Purchases from SCC (animal nutrition)', 'in above', n0(RP27.purchaseAnimalNutrition), 'Methionine pass-through at higher prices after the Gulf conflict'],
      ['Royalty to SCC', '0', n0(RP27.royalty), 'New: 3% of sales on two SCC products'],
      ['Dividend to SCC', n0(RP.dividendPaidToSCC), '–', '75% of the ~12% payout'],
      { hl: true, cells: ['**Total (approved limit = 51% of FY26 revenue)**', n0(RP.totalInclDividend), n0(RP27.total), 'Crosses the listing-rule materiality threshold for the first time; shareholders approved in Jul-2026'] },
    ], source: 'Annual report FY26, AGM notice 2026' } },
    { exhibit: { type: 'table', title: 'Recent launches and the pipeline', head: ['Year', 'Products', 'Note'], wide: [1, 2], rows: [
      ['FY25', 'Meshi, Portion, Ormie (combination products); CTPR technical made at Tarapur', 'Grew 65% in H1FY25'],
      ['FY26', 'Lentigo (SCC rice herbicide), Excalia Max (SCC rice fungicide) and 5 others', 'Excalia Max +50% in H1FY27'],
      ['FY27', 'Topgrain (biostimulant, first global launch), Helibex (insecticide); one more awaiting registration', ''],
      ['Next 3-5 years', '1-2 new specialty molecules a year; 3-4 SCC molecules in the pipeline; 2 SCC discovery molecules in Indian trials', 'Timing set by SCC and Indian registrations'],
      ['Semiconductor chemicals', 'SCC signed an MoU with Tata Electronics (19-Sep-2026); SCIL not named', 'Management: "at MoU stage"; would not say which entity will own it'],
    ], source: 'Company calls and presentations (via research file)' } },
    { callout: '**Our view:** the parent link is worth paying for: it gives SCIL products no Indian generic maker can sell, and SCC has a clear plan to use India as a hub. But the listed company does not control the timing, and the most exciting new idea (semiconductor chemicals) may sit in a separate SCC subsidiary, with SCIL earning little. We value only what is in SCIL\'s numbers.' },
  ],
};

// ---------------------------------------------------------------- Moat
const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: distribution and the parent\'s molecules, not cost or R&D',
  blocks: [
    { verdicts: D.moat.map(m => { const v = m.verdict.split(' ')[0]; return [m.dimension, v[0].toUpperCase() + v.slice(1), m.evidence, v === 'advantage' ? 'Supports margins above generic peers.' : v === 'parity' ? 'Competitive, but China sets the price.' : 'Depends on the parent for innovation.']; }), head: ['Dimension', 'Verdict', 'Evidence', 'So what'], title: 'Moat scorecard', source: 'GAM research compilation' },
    { callout: '**Honest verdict:** SCIL has a **distribution moat** (one of the widest dealer networks in Indian agrochemicals, with disciplined credit: receivables 83 days and almost no sales returns) and **privileged access to a global innovator\'s molecules**. That explains its ~20% EBITDA margin, above Indian generic peers. But it has **no cost advantage** in the 71% of revenue that is generic, and **no research of its own** (0.45% of sales). A distribution business with a borrowed pipeline deserves a premium to generic makers, but not the 40x+ that assumes it can grow at mid-teens: it has not done so since FY23.' },
  ],
};

// ---------------------------------------------------------------- Earnings quality
const AC = C.accounting;
const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: clean audit, but watch interest income, dealer schemes and one-offs',
  blocks: [
    { bullets: [
      `**Interest income.** Other income was ₹147 cr in FY26, ~20% of pre-tax profit. It grows only as fast as the cash pile and falls when deposit rates fall; it should not be valued like operating profit.`,
      '**Dealer rebates and schemes.** Revenue is shown after ₹333 cr of rebates and discounts (9.3% of gross sales). The auditor flags the estimate as a key audit matter. The year-end liability for "additional discounts and schemes" rose 16.5% in FY26 while sales rose 3%.',
      '**Sales returns** were ₹22 cr in FY26 (₹9 cr in FY25) but remain tiny (0.6% of gross sales); management says it has no sales-return policy.',
      '**One-offs.** Q1FY27 profit included a ₹27 cr insurance claim for a 2023 fire at Bhavnagar; Q3FY26 included a ₹16 cr Labour Codes charge.',
      '**Animal-nutrition pass-through** sales (₹185 cr in FY26, up to ₹1,000 cr of purchases approved for FY27) add revenue at a 4-5% margin: they flatter growth and dilute the margin percentage.',
      '**Barrix goodwill** of ₹60 cr sits on a business that made ₹0.08 cr profit in FY26 (impairment test is a key audit matter).',
      '**Data note.** Screener shows an 80% payout for FY25; it belongs to FY24 (₹5 special dividend). FY25\'s payout was ~12%.',
    ] },
    { callout: '**Accounting flag: AMBER.** The audit (B S R & Co., KPMG network, since FY25) is unqualified and the business generates real cash (₹446 cr operating cash flow in FY26). The amber is for the growing dealer-scheme liability and the large share of profit that comes from interest income.' },
  ],
};

// ---------------------------------------------------------------- Ownership additions
const OW = D.ownership;
const ownership = base => ({ ...base, blocks: [
  { p: 'Sumitomo Chemical (Japan) owns exactly 75%, the most a listed company\'s promoter may hold, with nothing pledged. Of the 25% free float, Indian mutual funds have doubled their stake to 7.7% in three years while retail holders shrank from ~149,000 to ~109,000; foreign investors own under 3%.' },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Named holders (Sep-2026)', head: ['Holder', 'Stake', 'Note'], wide: [2], rows: [
    ...OW.holders.filter(h => h.pct != null && !/Individuals/.test(h.name)).map(h => [h.name, h.pct + '%', /promoter/.test(h.name) ? 'Nil pledge; 37.4 cr shares' : '']),
  ], source: 'BSE shareholding pattern via Trendlyne (Sep-2026)' } },
  { callout: '**Our read:** with only 25% of shares tradable and institutions holding half of that, the stock can move sharply on small flows (as in Jul-2026, when it jumped 11% on news about the parent\'s Korean unit). The 75% cap also means the parent cannot add to its stake without an open offer or delisting; we found no sign of either.' },
] });

// ---------------------------------------------------------------- Governance
const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: a well-run subsidiary, with the usual minority-shareholder questions',
  blocks: [
    { exhibit: { type: 'table', title: 'Key people', head: ['Name', 'Role', 'Note'], wide: [2], rows: C.management.slice(0, 10).map(m => [m.name, m.role.replace(/ \(.*\)/, ''), (m.note || '').split(';').slice(0, 2).join(';')]), source: 'Annual report FY26, AGM notice 2026' } },
    { verdicts: [
      ['Audit and accounts', 'Strong', 'B S R & Co. (KPMG) since FY25 after a routine rotation from EY; unqualified opinion.', 'No accounting concerns found.'],
      ['Board', 'Moderate', 'Seven directors from Sep-2026: three independent, two parent nominees, the MD, and the former MD as non-executive chairman.', 'An ex-MD as chair with an advisory package blurs independence.'],
      ['Related parties', 'Moderate', 'Parent transactions approved up to ₹1,624 cr for FY27 (51% of revenue); a royalty has started.', 'Normal for an MNC subsidiary; needs watching.'],
      ['Pay', 'Moderate', 'Former MD paid ₹9.8 cr in FY26 (~126x the median employee); up to ₹3 cr a year approved for him as chairman.', 'High for the size of the company.'],
      ['Capital allocation', 'Weak', `₹${n0(cashNow)} cr of cash, ~12% payout, no buyback, no plan to return cash; one small acquisition (Barrix) has not earned its price.`, 'The cash belongs to all shareholders but is managed for the parent\'s plans.'],
      ['Legal and environment', 'Moderate', 'Contingent liabilities only ₹60 cr; legacy pollution order at the old Excel plant in Bhavnagar; a 2023 fire there.', 'Small in money terms.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'GAM research compilation' },
  ],
};

// ---------------------------------------------------------------- Forecasts
const cons = D.street.consensus.stockAnalysis_SnP;
const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: ~8% earnings growth, well below the street',
  blocks: [
    { p: 'We forecast revenue as one line, because the company reports one segment and does not give sales or profit by product. FY27 is nearly flat after the weak monsoon and the parent\'s reduced orders; FY28-29 assume normal monsoons, new plants for the parent and steady launches (+10% and +9%). The EBITDA margin stays around 20-20.5%, management\'s floor. Interest income follows the cash pile at 7.5-8.5%. Every assumption is in the Excel model\'s Assumptions sheet, which recalculates this report\'s target price.' },
    { exhibit: { type: 'rows', title: 'P&L and cash flow summary (₹ crore)', from: 'FY23', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' },
      { name: 'Other (mainly interest) income', ref: 'fin.otherIncome' },
      { name: 'Net profit', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n1' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Free cash flow', ref: 'fin.fcf' }, { name: 'Cash & investments (net)', ref: 'fin.treasury' }, { name: 'ROE', ref: 'fin.roe', fmt: 'pct' },
    ], source: 'Company, GAM Research estimates' } },
    { exhibit: { type: 'table', title: 'GAM vs the street', head: ['', 'GAM FY27E', 'Street FY27E', 'GAM FY28E', 'Street FY28E'], rows: [
      ['EPS (₹), consensus', '{{F.eps.0|n1}}', n1(cons.fy27Eps.avg), '{{F.eps.1|n1}}', `${n1(cons.nextYearEps)}*`],
      ['Revenue (₹ cr), consensus', '{{F.sales.0|num}}', n0(cons.fy27Revenue.avg), '{{F.sales.1|num}}', `${n0(cons.nextYearRevenue)}*`],
      ['EPS (₹), ICICI Direct', '{{F.eps.0|n1}}', '12.3', '{{F.eps.1|n1}}', '13.9'],
      ['EPS (₹), Anand Rathi', '{{F.eps.0|n1}}', '13.2', '{{F.eps.1|n1}}', '16.0'],
      ['Revenue (₹ cr), ICICI Securities (Apr-26)', '{{F.sales.0|num}}', '3,583', '{{F.sales.1|num}}', '4,022'],
    ], source: 'S&P consensus via StockAnalysis (* year not labelled; assumed FY28E), broker notes, GAM Research' } },
    { callout: `We are ~${Math.abs(Math.round((F.eps[1] / cons.nextYearEps - 1) * 100))}% below the street for FY28 mainly on revenue: brokers assume ~20% growth in FY28 after a flat FY27 (ICICI Securities models 12% a year from FY26). Sumitomo India has not grown revenue since FY23, and management\'s 12-14% aspiration was not repeated in 2026. If the parent\'s plants and molecules do deliver, the bull case covers it.` },
  ],
};

// ---------------------------------------------------------------- Street
const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: 'The street: few analysts, all positive, and slow to cut',
  blocks: [
    { p: 'Coverage is thin. Only three houses have notes we could open: ICICI Securities (institutional), ICICI Direct (its retail arm) and Anand Rathi, all with BUY ratings. Of nine analysts polled by S&P, six say Strong Buy, two Buy and one Hold, with an average target of ~₹584, but most targets were set in May-July 2026, before the monsoon failed and Q2 disappointed. ICICI Securities cut its target to ₹485 on 28-Oct-2026. The bull case on the street rests on the parent: its molecules, its plants in India and, since July, its semiconductor-chemicals plans.' },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who'], wide: [0], rows: D.critiques.map(c => [c.point, c.who]), source: 'Earnings-call questions, broker notes, press (via research file)' } },
  ],
};

// ---------------------------------------------------------------- Valuation
const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: 'Valuation: 28x Sep-28E earnings gives {{dcf.tp|inr}}',
  blocks: [
    ...streetBlocks('SUMICHEM', {
      rating,
      streetIntro: 'Every broker whose method we could find values SCIL on **P/E on FY28E earnings**: ICICI Direct 45x, Anand Rathi 40x (raised from 36x for the semiconductor option), ICICI Securities 36.5x (averaged with 29x EV/EBITDA). We use the same method so that our target is comparable, applied to the earnings the market will look at in October 2027 (Sep-28E: half FY28E, half FY29E). The gap between us and the street is in the multiple and in our lower earnings, not in the method.',
      street: [
        ['ICICI Direct', 'Buy', 625, 'P/E', '45x', 'FY28E EPS', 'Closer engagement with the parent justifies a premium'],
        ['Anand Rathi', 'Buy', 650, 'P/E', '40x', 'FY28E EPS', 'Semiconductor-chemicals option; ~15% core EBITDA growth'],
        ['ICICI Securities (Apr)', 'Buy', 515, 'P/E + EV/EBITDA', '36.5x', 'FY28E EPS', 'Parent pipeline; debt-free'],
        ['ICICI Securities (Oct)', 'Buy', 485, 'n.d.', '–', '–', 'Cut on monsoon and exports; "entry point"'],
      ],
      ourThesis: 'Growth has stalled; P/E on total profit flatters the cash',
      streetSource: 'Broker notes (Apr-Oct 2026); "At our EPS" applies each broker\'s multiple to GAM FY28E EPS; n.d. = not disclosed',
      derivationIntro: 'We start from the stock\'s own one-year-forward P/E history and adjust for how far the sector has de-rated and for the growth we actually expect.',
      derivation: [
        ['1. Its own history', 'One-year-forward P/E: median ~42x since 2023 (25th-75th percentile 40-46x); ~43x since 2021', 'Starting point: 42x'],
        ['2. Sector de-rating', 'PI Industries 29x trailing vs a 38x five-year median (−22%); Dhanuka 13x vs 17x (−24%)', '42x × 0.77 ≈ 32x'],
        ['3. Growth', 'Street multiples come with 13-21% a year EPS growth to FY28; we forecast ~8% (FY26-29E), as revenue has not grown since FY23', 'A further ~12% discount: **28x**'],
        ['4. Peers', 'Bayer CropScience (closest MNC-subsidiary model, ROE 24%) 20x; PI 29x; Dhanuka 14.5x; UPL 23x', '28x keeps a premium for the parent\'s molecules and the balance sheet'],
        ['5. The cash', `₹${n0(cashNow)} cr of cash (~15% of market value) earns ~7%; at 28x P/E each rupee of cash is valued at ~₹1.6`, 'Why we cross-check on EV/EBITDA, which counts cash at face value'],
      ],
      derivationSource: 'Screener.in (P/E history to 28-Oct-2026), broker notes, GAM Research',
      history: { field: 'eps', from: '2020-04-01', median: 42, label: 'Median since 2023: ~42x', title: 'One-year-forward P/E: our 28x vs history', yearStep: 1 },
      crossNote: `**What the cross-checks tell us.** EV/EBITDA (18x Sep-28E EBITDA plus the cash at face value) gives ₹${n0(mv('ev').value)}, ${Math.abs(mv('ev').vsTarget).toFixed(0)}% below the P/E target: the difference is the premium a P/E puts on interest income. The DCF (₹${n0(mv('dcf').value)}) is far lower: at an 11.6% cost of capital, ~20% EBITDA margins and our growth, cash flows support well under today's price. The market has always priced SCIL for faster growth than it has delivered; if growth stays at high single digits, the multiple has further to fall.`,
    }),
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', '{{as.scenarios.bull.narrative}} The multiple recovers to 35x.'],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', 'Revenue +1% / +10% / +9% (FY27-29E), EBITDA margin ~20.5%; 28x Sep-28E EPS.'] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', '{{as.scenarios.bear.narrative}} The multiple falls to 22x.'],
    ], source: 'GAM Research' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-42E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Add: net cash and investments at Mar-27', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
      { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of capital down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Listed crop-protection peers', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', 'EV/EBITDA (x)', 'ROE'], rows: D.peers.filter(p => !/BESTAGRO|DHARMAJ|INSECTICID|BHARATRAS/.test(p.symbol)).map(p => [p.symbol === 'SUMICHEM' ? '**Sumitomo Chemical India**' : p.name, n0(p.mcapCr), n0(p.revenueFy26), p.ebitdaMarginFy26 + '%', n1(p.pe), n1(p.evEbitda), p.roe + '%']), source: 'Screener.in, 28-Oct-2026 (trailing multiples; Bayer, Dhanuka, Rallis standalone)' } },
  ],
};

// ---------------------------------------------------------------- Verdict
const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: 'Our honest summary: a good franchise, but the growth has to come back first',
  blocks: [
    { callout: '**What you are buying:** one of India\'s widest crop-protection distribution networks, exclusive access to a global innovator\'s patented molecules, ~20% EBITDA margins, disciplined dealer credit and ₹2,500 cr of cash with no debt.' },
    { callout: `**What you are paying:** ${n1(price / F.eps[1])}x our FY28E earnings for a company whose revenue has not grown in three years, whose best new idea may sit with its parent, and whose cash earns 7%. On the street's method and our inputs the target is {{dcf.tp|inr}} ({{dcf.upside|chg}}): fair, not cheap. Cash-adjusted cross-checks are lower.` },
    { exhibit: { type: 'table', title: 'What would make it a BUY', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      [`Price below ~₹${n0(buyBelow)} (15%+ upside)`, 'Medium', 'Share price after Q3FY27'],
      ['Growth returns to double digits with a normal monsoon', 'Medium', 'Domestic revenue growth in H1FY28; IMD forecast (Apr-2027)'],
      ['Plants for the parent ramp up', 'Medium', 'Bhavnagar (Q4FY27), Tarapur and Dahej (FY28-29); sales to SCC'],
      ['Cash returned or invested well', 'Low', 'Special dividend, buyback or a sensible acquisition'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What would make it a SELL', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['A second weak monsoon (El Niño)', 'Medium', 'FY28 EPS 10-15% below our estimate; multiple towards 22x'],
      ['Glyphosate restricted by the courts', 'Low-medium', 'Up to 11-15% of revenue at risk'],
      ['The parent keeps value outside SCIL (semiconductors, royalties)', 'Medium', 'Removes the premium the street pays'],
      ['Chinese generic price cuts', 'Medium', 'Margin below 19%'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: HOLD, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**Buy below ~₹${n0(buyBelow)}**, or on proof that domestic revenue is growing at double digits again.`,
      `**Sell above ~₹${n0(sellAbove)}**, or if the monsoon fails again in 2027.`,
      '**Biggest swing factor:** the monsoon. One season decides the year; two weak ones in a row would test the 28x multiple.',
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Revenue, FY23 → FY26', v: `₹${n0(A23.consRev)} → ₹${n0(A26.consRev)} cr`, d: 'no growth in three years' },
      { k: 'Cash and liquid funds', v: `₹${n0(cashNow)} cr`, d: '~15% of market value' },
      { k: 'Patented / specialty share', v: '~29%', d: 'generics ~71%' },
      { k: 'Our EPS vs street, FY28E', v: `${Math.round((F.eps[1] / cons.nextYearEps - 1) * 100)}%`, d: 'we assume ~10% growth, not ~20%' },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

// ---------------------------------------------------------------- Glossary
const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['Crop protection / agrochemicals', 'Insecticides, herbicides (weedkillers), fungicides and other chemicals that protect crops.'],
      ['Generic', 'A molecule whose patent has expired; many companies can make it, so it competes on price.'],
      ['Specialty / patented molecule', 'A newer product still protected by patent or data rights; here mostly from the parent, Sumitomo Chemical Japan.'],
      ['Technical / formulation', 'Technical = the pure active ingredient; formulation = the product mixed for farmers to spray.'],
      ['Kharif / rabi', 'India\'s monsoon (June-October) and winter (November-March) cropping seasons.'],
      ['PGR', 'Plant growth regulator: products that change how a plant grows or ripens (e.g. gibberellic acid).'],
      ['Metal phosphides', 'Fumigants (e.g. aluminium phosphide) used to protect stored grain.'],
      ['Biologicals / biostimulants', 'Products based on natural organisms or extracts that protect or strengthen crops.'],
      ['CSM / contract manufacturing', 'Making a specific molecule for another company (here, the parent) under contract.'],
      ['Rebates and schemes', 'Discounts and incentives paid to distributors and dealers, deducted from revenue.'],
      ['Minimum public shareholding', 'Indian rule that at least 25% of a listed company\'s shares must be held by the public; caps the promoter at 75%.'],
      ['P/E, EV/EBITDA', 'Share price ÷ earnings per share; enterprise value (market value less net cash) ÷ operating profit before depreciation.'],
      ['DCF / WACC', 'Discounted cash flow valuation; WACC is the required annual return used to discount future cash.'],
    ], source: 'GAM Research' } },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, business, history, industry, tailwind, parent, moat, p.seasons, p.financials, quality, p.balance, ownership(p.ownershipBase), governance, forecasts, street, valuation, risks, p.statements, glossary],
  statementNotes: {
    'sales@FY22': '+16%: good season and price increases; exports +52%.',
    'sales@FY24': '−19%: global destocking and Chinese price cuts; domestic −15%, exports −36%.',
    'pat@FY24': '−26%: lower volumes and prices.',
    'sales@FY25': '+11%: volumes +20-30%, prices ~10% lower.',
    'pat@FY26': 'Record; includes a ₹16 cr Labour Codes charge; other income ₹131 cr after it.',
    'otherIncome@FY27E': 'Includes the ₹27 cr insurance claim for the FY23 Bhavnagar fire.',
    'sales@FY27E': 'GAM: flat; weakest monsoon since 2015; parent\'s Japan orders halved.',
    'sales@FY28E': 'GAM: normal monsoon assumed; plants for the parent start up.',
  },
};
