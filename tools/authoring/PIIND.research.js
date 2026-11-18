// PI Industries report, part B: story, business, history, industry, tailwind test, CSM exports,
// domestic brands, new businesses, moat, guidance, earnings quality, ownership, governance, forecasts,
// street, valuation, verdict, glossary. Prose numbers come from research/company.json, deep.json,
// segments.json and the built model; forecast and valuation figures are live tokens ({{...}}) that
// follow assumptions.json. Written as of 30-Sep-2026 (Q1FY27 basis).
const fs = require('fs');
const path = require('path');
const { streetBlocks, forwardSeries } = require('./valuation-blend');
const { ruleText, buyBelow: buyAt, sellAbove: sellAt } = require('../../src/ratings');
const { peersAsOf } = require('./asof-peers');
const { buildForecast } = require('../../src/forecast');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'PIIND', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'PIIND.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions;
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const rup = s => String(s).replace(/Rs /g, '₹');
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026';
const SRC = 'PI Industries investor presentations, annual reports and earnings calls; GAM Research';

const SA = SG.annual, SQ = SG.quarterly, QL = SQ.map(q => q.q);
const A26 = SA.find(a => a.fy === 'FY26'), A25 = SA.find(a => a.fy === 'FY25');
const price = M.price.last, mcap = M.meta.marketCap || price * F.shares;
const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const epsSep28 = mv('pe').metric, peMult = mv('pe').mult;
const Q1 = C.q1fy27, CC = C.customerConcentration;
const netCash = C.cashAndTreasury.surplusCashNetOfDebtCr.at(-1).value, cashShare = netCash / mcap * 100;

// CSM revenue growth by quarter (FY24 quarters from Motilal Oswal's KPI table, company data).
const CSM24 = { Q1FY25: 1518.7, Q2FY25: 1561.0, Q3FY25: 1503.7, Q4FY25: 1398.6 };
const csmYoY = SQ.map((q, i) => { const base = CSM24[q.q] ?? SQ[i - 4]?.csmRev; return base ? Math.round((q.csmRev / base - 1) * 1000) / 10 : null; });
const domYoY = SQ.map((q, i) => (SQ[i - 4] ? Math.round((q.domRev / SQ[i - 4].domRev - 1) * 1000) / 10 : null));

// One-year-forward P/E history (actual EPS, then our estimates for FY27-28E).
const fwdPe = forwardSeries('PIIND', M, 'eps').filter(x => x[0] >= '2016-04-01');
const stat = (from) => { const v = fwdPe.filter(x => x[0] >= from).map(x => x[1]).sort((a, b) => a - b); return { med: v[Math.floor(v.length / 2)], p25: v[Math.floor(v.length * 0.25)], p75: v[Math.floor(v.length * 0.75)], min: v[0], max: v.at(-1) }; };
const H21 = stat('2021-04-01'), H16 = stat('2016-04-01');

// Peers at the 30-Sep-2026 close, and how far each had de-rated vs its own five-year median P/E.
const PEER_SYMS = ['PIIND', 'SUMICHEM', 'UPL', 'BAYERCROP', 'DHANUKA', 'RALLIS', 'COROMANDEL', 'DIVISLAB', 'SYNGENE', 'NAVINFLUOR'];
const PEERS = peersAsOf(PEER_SYMS, ASOF);
const P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const med5 = sym => { const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')); const v = (S.charts?.pe?.['Price to Earning'] || []).filter(([d, x]) => d <= ASOF && d >= '2021-09-30' && x > 0).map(x => x[1]).sort((a, b) => a - b); return v[Math.floor(v.length / 2)]; };
const derate = Object.fromEntries(PEER_SYMS.map(s => [s, P[s].pe && med5(s) ? (P[s].pe / med5(s) - 1) * 100 : null]));
const AGRO = ['SUMICHEM', 'UPL', 'BAYERCROP', 'DHANUKA', 'RALLIS', 'COROMANDEL'];
const agroDr = AGRO.map(s => derate[s]).sort((a, b) => a - b), agroMed = (agroDr[2] + agroDr[3]) / 2;
const afterDerate = H21.med * (1 + agroMed / 100);
const shortName = n => n.replace('Divis ', "Divi's ").replace(/ Ltd\.?$/, '').replace(/ India$| International$| Laboratories$| Industries$/, '').replace('Bayer Cropscience', 'Bayer CropScience');

// DCF if working capital went back to its FY25 level (engine re-run with a different working-capital ratio).
const b = A.labels.length - 1, b25 = b - 1;
const owc25 = (A.otherAssets[b25] - A.cash[b25] - A.otherLiab[b25]) / A.sales[b25] * 100;
const altDcf = buildForecast(M, { ...AS, owcPctOfSales: owc25 }).dcf.intrinsicTp;

const rating = 'SELL';
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;

// Street as it stood on 30-Sep-2026 (each broker's latest note by then).
const ST = D.street.brokers;
const postQ1 = ST.filter(s => s.date >= '2026-08');
const avgPost = postQ1.reduce((s, x) => s + x.tp, 0) / postQ1.length;
const mosl = ST.find(s => s.broker === 'Motilal Oswal'), pl = ST.find(s => s.broker === 'Prabhudas Lilladher');
const shortDate = d => { const [y, m, dd] = d.split('-'); const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+m - 1]; return dd ? `${+dd}-${mon}-${y.slice(2)}` : `${mon}-${y.slice(2)}`; };

const cover = {
  headline: 'A world-class contract manufacturer losing its biggest molecule: earnings have not found a floor',
  lead: `PI Industries makes patented agrochemicals for global innovators (76% of revenue), sells crop protection in India (19%) and is building a pharma business (4%). One customer, the owner of the herbicide pyroxasulfone, was **38% of FY26 revenue**, and that molecule is now going generic: the customer's purchases fell 28% in FY26, and on 11-Sep-2026 the originator, Kumiai, cut its full-year operating-profit forecast by 62% on falling generic prices. PI's revenue fell 16% in FY26 and 10% in Q1FY27, and management cut FY27 guidance to "lower single digit" growth. The street values PI on **P/E on FY28E earnings (30-34x)**. We forecast EPS of ₹${n1(F.eps[0])} in FY27E and ₹${n1(F.eps[1])} in FY28E, 9-15% below the street. Applying **${peMult}x to Sep-28E EPS of ₹${n1(epsSep28)}** gives **{{dcf.tp|inr}} ({{dcf.upside|chg}})**: **we initiate with SELL.** The cross-checks: EV/EBITDA ₹${n0(mv('ev').value)}, DCF ₹${n0(mv('dcf').value)}. Bull case {{scen.bull.tp|inr}}; bear case {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'The core molecule is going generic', p: `PI's largest customer bought ₹${n0(CC.largestCustomerRevFy25)} cr in FY25 and ₹${n0(CC.largestCustomerRevFy26)} cr in FY26. Kumiai, the pyroxasulfone originator, brought shipments forward "ahead of the entry of generic versions ... into the U.S. market" (Jun-2026) and then wrote down inventory as generic prices fell (Sep-2026). New products are only 16-18% of CSM revenue, not enough to fill the gap yet.` },
    { h: 'Guidance keeps slipping', p: 'FY25 was meant to grow ~15% and grew 4%; FY26 began with a "single digit growth" target and ended at −16%. In May-2026 management said FY27 would grow at "late-stage single digit or early-stage double digit at the worst case"; in August it said "lower single digit". Q1FY27 export volumes fell 8% and prices fell too.' },
    { h: 'New businesses cost money now, pay later', p: `Pharma lost ₹${n0(-A26.pharmaEbitda)} cr at EBITDA in FY26 on ₹${n0(A26.pharmaRev)} cr of revenue; global biologicals, electronic chemicals and PI's own molecules add more cost. Employee costs rose from 10% to 14% of revenue in FY26. Management targets pharma breakeven only at ₹500-600 cr of revenue, in two to three years.` },
    { h: 'Valuation: de-rated, but not cheap for falling earnings', p: `At ₹${n0(price)} the stock trades at ${n1(price / F.eps[0])}x our FY27E and ${n1(price / F.eps[1])}x FY28E EPS. Its ${Math.round(H21.med)}x median forward P/E since 2021 came with ~31% a year EPS growth; we see FY29E EPS at about the FY26 level. Net cash (₹${n0(netCash)} cr, ~${Math.round(cashShare)}% of market value) cushions, but does not change, the call.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'RED' },
    { k: 'Earnings momentum', v: 'RED' },
    { k: 'Competitive position', v: 'AMBER' },
    { k: 'Valuation', v: 'RED' },
  ],
  catalysts: [
    'Q2FY27 results (early Nov-2026): whether exports start to recover as guided, and how far margins fell in the kharif quarter.',
    'Pyroxasulfone: generic prices and volumes in the US, Australia and Argentina; Kumiai\'s FY10/2026 results (Dec-2026).',
    'Registration and launch of Pioxaniliprole, PI\'s first own molecule (India, FY27), and partners for overseas markets.',
    'Conversion of the US$1.2 bn CSM order book into H2FY27 revenue; the 4-5 molecules due to be commercialised in FY27.',
    'Use of ₹3,800 cr of net cash: management is "evaluating inorganic opportunities".',
  ],
};

// ---------------------------------------------------------------- Story in charts
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'stacked', title: 'Exports (CSM) are three-quarters of revenue, and shrinking', unit: 'Revenue by business line (₹ crore)', x: 'R.segments.annual[].fy', series: [{ name: 'Agchem exports (CSM)', ref: 'R.segments.annual[].csmRev', fmt: 'num' }, { name: 'Domestic agri-brands', ref: 'R.segments.annual[].domRev', fmt: 'num' }, { name: 'Pharma', ref: 'R.segments.annual[].pharmaRev', fmt: 'num' }], minLabel: 400, source: 'Company presentations; Motilal Oswal KPI table (company data)' },
      { type: 'column', title: 'One customer: 44% of revenue in FY25, 38% in FY26', unit: 'Revenue from the largest customer (₹ crore)', x: ['FY25', 'FY26'], series: [{ name: 'Largest customer', values: [CC.largestCustomerRevFy25, CC.largestCustomerRevFy26], fmt: 'num' }], labels: 'all', source: 'Annual report FY26 (credit-risk note)' },
    ] },
    { pair: [
      { type: 'column', title: 'CSM exports: five quarters of decline', unit: 'CSM revenue growth, year on year (%)', x: QL, series: [{ name: 'CSM growth', values: csmYoY, fmt: 'pct0' }], labels: 'all', source: SRC },
      { type: 'line', title: 'EBITDA margin: from 29% to 22%', unit: 'Quarterly EBITDA margin (%)', x: 'Q.labels', series: [{ name: 'EBITDA margin', ref: 'Q.opm', fmt: 'pct0' }], labels: 'all', min: 10, max: 35, source: 'Screener.in (consolidated)' },
    ] },
    { pair: [
      { type: 'column', title: 'Pharma: small, lumpy and loss-making', unit: 'Pharma revenue vs pre-tax segment result (₹ crore)', x: QL.slice(1), series: [{ name: 'Revenue', values: SQ.slice(1).map(q => q.pharmaRev), fmt: 'num' }, { name: 'Segment result', values: SQ.slice(1).map(q => q.pharmaEbt), fmt: 'num' }], labels: 'none', source: 'Company results via Prabhudas Lilladher (Aug-2026)' },
      { type: 'column', title: 'Contract assets and working capital rose in FY26', unit: 'Contract assets (₹ crore)', x: ['Mar-25', 'Dec-25', 'Mar-26', 'Jun-26'], series: [{ name: 'Contract assets', values: [404, 1000, 698, 750], fmt: 'num' }], labels: 'all', source: 'Annual report FY26; earnings calls (Dec-25 and Jun-26 rounded by management)' },
    ] },
    { pair: [
      { type: 'line', title: `Forward P/E: from a ${Math.round(H21.max)}x peak to ~${Math.round(fwdPe.at(-1)[1])}x`, unit: 'Price ÷ next full-year EPS (x)', x: fwdPe.map(x => x[0]), series: [{ name: 'Forward P/E', values: fwdPe.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 2, lines: [{ v: Math.round(H21.med), text: `Median since 2021: ${Math.round(H21.med)}x` }], source: 'Screener.in prices; actual EPS, GAM estimates for FY27-28E' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (notes after Q1FY27)', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...postQ1.map(s => s.broker), 'GAM (base)'], series: [{ name: 'Target', values: [...postQ1.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes and press summaries (Aug-2026), GAM Research' },
    ] },
  ],
};

// ---------------------------------------------------------------- Business
const BL = C.businessLines;
const business = {
  id: 'business', nav: 'What PI does', kicker: 'The business', title: 'Three businesses: a global contract manufacturer, an Indian brand house and a pharma start-up',
  blocks: [
    { p: 'PI Industries, founded in Udaipur in 1946, has two old businesses and several new ones. Its **custom synthesis and manufacturing (CSM)** business, started in 1995, makes active ingredients and intermediates for global agrochemical innovators (Japanese, European and American) under long-term contracts: the customer owns the patent and the market, PI develops the process and makes the molecule. Its **domestic agri-brands** business sells crop-protection products to Indian farmers, many in-licensed from the same innovators. Since 2023 PI has added **pharma** contract research and manufacturing (PI Health Sciences), **global biologicals** (Plant Health Care, now PI AgSciences), **electronic chemicals**, and its own patented molecules.' },
    { exhibit: { type: 'table', title: 'Where FY26 revenue came from', head: ['Business line', 'Revenue (₹ cr)', 'Share', 'FY26 growth', 'What it is'], wide: [4], rows: [
      ['**Agchem exports (CSM)**', n0(A26.csmRev), `${Math.round(A26.csmRev / A26.consRev * 100)}%`, pc((A26.csmRev / A25.csmRev - 1) * 100), 'Patented agchem molecules made for 25+ global innovators; largest molecule pyroxasulfone; 20 molecules commercialised in recent years'],
      ['**Domestic agri-brands**', n0(A26.domRev), `${Math.round(A26.domRev / A26.consRev * 100)}%`, pc((A26.domRev / A25.domRev - 1) * 100), 'Branded insecticides, herbicides, fungicides and biologicals; 15,000+ distributors; brands such as Nominee Gold, Biovita, Brofreya'],
      ['**Pharma (PI Health Sciences)**', n0(A26.pharmaRev), `${Math.round(A26.pharmaRev / A26.consRev * 100)}%`, pc((A26.pharmaRev / A25.pharmaRev - 1) * 100), 'Contract manufacturing (₹231 cr) and research (₹66 cr): Archimica (Lodi, Italy), Therachem (Hyderabad)'],
      { hl: true, cells: ['**Consolidated revenue**', n0(A26.consRev), '100%', pc((A26.consRev / A25.consRev - 1) * 100), 'EBITDA: Agro Chemicals ₹1,848 cr (28.8% margin), Pharma −₹149 cr'] },
    ], source: 'Company presentations; annual report FY26 (note 35)' } },
    { pair: [
      { type: 'hbar', title: 'North America is now the biggest market', unit: 'FY26 revenue by customer location (₹ crore)', x: ['North America', 'India', 'Europe', 'Asia ex-India', 'Rest of world'], series: [{ name: 'Revenue', values: [C.geographyFy26.NorthAmerica, C.geographyFy26.India, C.geographyFy26.Europe, C.geographyFy26.AsiaExIndia, C.geographyFy26.RestOfWorld], fmt: 'num' }], labels: 'all', highlight: 'North America', source: 'Annual report FY26 (note 35 B)' },
      { type: 'hbar', title: 'Asia ex-India collapsed as shipments moved to the US', unit: 'FY25 revenue by customer location (₹ crore)', x: ['North America', 'India', 'Europe', 'Asia ex-India', 'Rest of world'], series: [{ name: 'Revenue', values: [C.geographyFy26.fy25.NorthAmerica, C.geographyFy26.fy25.India, C.geographyFy26.fy25.Europe, C.geographyFy26.fy25.AsiaExIndia, C.geographyFy26.fy25.RestOfWorld], fmt: 'num' }], labels: 'all', highlight: 'Asia ex-India', source: 'Annual report FY26 (note 35 B)' },
    ] },
    { exhibit: { type: 'table', title: 'Reach and assets', head: ['', 'Detail'], wide: [1], rows: [
      ['Manufacturing', '8 manufacturing sites on 150+ acres, incl. five agchem plants in Gujarat (three at Panoli, two at Jambusar); 130+ unit processes; one of the world\'s largest flow-chemistry plants (commissioned Q1FY27); 3 multi-purpose plants under construction; ~80% utilisation in FY26'],
      ['R&D', '700+ scientists incl. 200+ doctorates; ₹356 cr R&D spend in FY26; 250+ patents; 90+ molecules in the pipeline (>60% in advanced stages)'],
      ['Domestic distribution', '15,000+ distributors, 1-1.5 lakh retail points, 25 stock points; partnerships with 25+ global innovators'],
      ['Pharma', 'GMP API plant at Lodi (Italy) with a new kilo-lab and QC lab; CRO centre in Hyderabad; non-GMP sites in India'],
      ['Biologicals', 'PI AgSciences (ex-Plant Health Care plc, bought Aug-2024 for ₹364 cr): peptide platform, US$12-13 mn revenue; EPA-registered foliar bionematicide'],
    ], source: 'Q1FY27 and Q4FY26 presentations, annual report FY26, earnings calls' } },
  ],
};

// ---------------------------------------------------------------- History
const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'From Udaipur (1946) to a global contract manufacturer',
  blocks: [
    { exhibit: { type: 'table', title: 'Key events and what they did to the numbers', head: ['When', 'Event', 'Impact'], wide: [1, 2], rows: [
      ['1946', 'Company incorporated in Udaipur; agri-input distribution from 1961', 'Origin of the domestic brands business'],
      ['1995', 'First Indian company to start agchem custom synthesis for global innovators', 'Became the main engine: 76% of FY26 revenue'],
      ['FY17-20', 'CSM scales up new molecules for innovators; Isagro (Asia), a horticulture specialist, acquired', 'Revenue ₹2,277 cr (FY17) → ₹3,366 cr (FY20)'],
      ['Jul-2020', 'QIP: 1.36 cr shares at ₹1,470 (₹2,000 cr)', 'Net cash from ~nil to ₹2,000 cr+; fully used by FY26'],
      ['FY21-24', 'Export boom: revenue ₹4,577 cr → ₹7,666 cr, net profit ₹738 cr → ₹1,682 cr', 'EPS +31% a year; forward P/E peaked above 60x'],
      ['FY24', 'Twin pharma acquisitions via PI Health Sciences: Archimica (Italy) and Therachem (India/US, Apr-2023)', 'Pharma revenue ₹315 cr in FY24 and losses since'],
      ['Aug-2024', 'Plant Health Care plc (UK) acquired for ₹364 cr; renamed PI AgSciences', 'Global biologicals platform, loss-making'],
      ['Sep-2024', 'Promoters move 16.2% into four family trusts (succession), under a SEBI exemption', 'Promoter group unchanged at 46.1%'],
      ['FY26', 'Revenue −16% (CSM −20%); ₹126 cr gain on settling the Therachem earn-out; ₹110 cr standalone impairment of PI Health Sciences', 'Net profit ₹1,321 cr (−20%)'],
      ['May-2026', 'JMD Rajnish Sarna steps back to non-executive; Dr Atul Gupta (CEO, CSM Agchem) joins the board', 'Stock −7% and −5.5% on 20-21 May after Q4'],
      ['Aug-2026', 'Q1FY27 revenue −10%, PAT −39%; FY27 guidance cut to "lower single digit" growth', 'Stock −9% on 12-Aug'],
      ['Sep-2026', 'Kumiai (pyroxasulfone originator) cuts its operating-profit forecast 62% on generic prices (11-Sep)', 'Stock −4.5% that day, to a 52-week low of ₹2,191 intraday'],
    ], source: 'Company filings and presentations, annual report FY26, NSE, Kumiai releases' } },
    { callout: '**Corporate actions:** one QIP (Jul-2020, ₹2,000 cr). No bonus, split or buyback since; share count 15.17 cr. Dividends are small (₹15 a share for FY26, ~17% of EPS) because cash is kept for capex and acquisitions.' },
  ],
};

// ---------------------------------------------------------------- Industry
const ind = D.industry;
const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'A long agchem downcycle, and generics eating the molecule PI depends on',
  blocks: [
    { p: 'Global crop protection is dominated by a few innovators: the eight largest (Syngenta, Bayer, BASF, Corteva, UPL, FMC, ADAMA, Sumitomo) sold ~US$56 bn in CY2024. The innovators discover molecules and increasingly outsource their manufacture to specialists in India and China. After the 2021-22 boom, the industry spent 2023-26 working off excess stock while Chinese generic makers cut prices. By mid-2026 the innovators were reporting flat sales: Syngenta\'s crop-protection sales rose 4% in H1 2026 (−1% at constant currency), with Latin America −11% on destocking. PI\'s MD called it the longest cycle he had seen, with only "early signs of demand and stabilization" in August 2026.' },
    { p: 'For a contract manufacturer the cycle matters less than the life of its molecules. A patented molecule earns well for its originator and its manufacturer until generics arrive; then prices fall and volumes shift to cheaper suppliers. That is now happening to **pyroxasulfone**: in June 2026 its originator Kumiai said it had brought shipments forward ahead of generic entry into the US, and in September it cut its full-year operating-profit forecast by 62.5% because generic entry outside Japan had pushed market prices down.' },
    { exhibit: { type: 'table', title: 'Forces acting on PI\'s markets (as of 30-Sep-2026)', head: ['Theme', 'Direction', 'What it means for PI'], wide: [2], rows: [
      ['Global destocking', 'Headwind, easing', 'Innovators still cautious; PI expects export recovery only in H2FY27 on "committed customer offtake".'],
      ['Pyroxasulfone generics', 'Headwind', 'Largest customer\'s purchases −28% in FY26; Kumiai wrote down inventory on falling generic prices (Sep-2026).'],
      ['Chinese generic pricing', 'Headwind', 'Glyphosate still ~70% below peak; PI\'s CSM realisations ~5% lower in FY26; "generics pressure continues" (Aug-2026).'],
      ['Input costs (Gulf conflict)', 'Headwind', 'Raw-material prices rose in Mar-Jun 2026; PI\'s gross margin −70bp YoY in Q1FY27.'],
      ['China+1 sourcing', 'Tailwind', 'Innovators diversifying supply; PI\'s enquiries for non-agchem molecules up 25%; order book US$1.2 bn.'],
      ['2026 Indian monsoon', 'Headwind', 'June-September rain ended ~12.6% below normal (IMD), the weakest since 2015; channel stocks high.'],
      ['Biologicals', 'Tailwind', 'Global biologicals ~US$10 bn, growing double digits; PI\'s domestic biologicals +50% in Q1FY27.'],
      ['Pharma CDMO funding', 'Mixed', 'PI cites a "slowdown in biotech funding and geopolitical challenges".'],
    ], source: 'Company calls and presentations, Syngenta H1 2026 release (27-Aug-2026), Kumiai releases (Jun/Sep-2026), IMD and CRISIL via GAM research files' } },
    { pair: [
      { type: 'hbar', title: 'Syngenta crop protection: flat in H1 2026', unit: 'H1 2026 crop-protection sales growth by region (%)', x: ['Europe', 'Brazil', 'AME ex-China', 'North America', 'Latin America ex-Brazil'], series: [{ name: 'Growth', values: [8, 7, 5, -4, -11], fmt: 'pct0' }], labels: 'all', source: 'Syngenta Group H1 2026 media release (27-Aug-2026)' },
      { type: 'column', title: 'Kumiai cut its FY10/2026 operating profit forecast by 62%', unit: 'Operating profit forecast (¥ bn)', x: ['Dec-2025 forecast', 'Sep-2026 forecast', 'FY10/2025 actual'], series: [{ name: 'Operating profit', values: [7.2, 2.7, 10.6], fmt: 'n1' }], labels: 'all', source: 'Kumiai Chemical release, 11-Sep-2026' },
    ] },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Tailwind test: PI caught the last boom; this time the tailwinds are elsewhere',
  blocks: [
    { verdicts: [
      ['China+1 outsourcing by innovators', 'Partly', 'Order book steady at US$1.2 bn; 20 molecules commercialised in recent years; but CSM revenue fell 20% in FY26.', 'Real, but not big enough to offset pyroxasulfone.'],
      ['Agchem cycle recovery', 'Not yet', 'Q1FY27 export volume −8%, prices lower; management expects recovery in H2FY27.', 'A recovery helps volumes, not the generic price of PI\'s biggest molecule.'],
      ['Indian crop-protection growth', 'Yes, modestly', 'Domestic volume +12% in Q1FY27 vs peers\' flat volumes; revenue +3% on lower prices.', 'Good execution in a business that is 19% of revenue.'],
      ['Biologicals boom', 'Partly', 'Domestic biologicals +50% in Q1FY27; global biologicals ~US$12 mn revenue and loss-making.', 'Promising, still small.'],
      ['Pharma outsourcing (CDMO)', 'No', 'Pharma revenue ₹300 cr in FY26, −25% in Q1FY27; EBITDA −₹149 cr.', 'A cost centre for now.'],
      ['Electronic chemicals', 'No', 'Management: "not a significant portion of the top line"; target US$80-100 mn in 5-6 years.', 'An option, not earnings.'],
    ], head: ['Industry tailwind', 'Captured?', 'Evidence', 'So what'], title: 'Tailwind test', source: SRC },
  ],
};

// ---------------------------------------------------------------- CSM
const csm = {
  id: 'csm', nav: 'Agchem exports (CSM)', kicker: 'Segment', title: 'Agchem exports: a great model with one molecule too many',
  blocks: [
    { pair: [
      { type: 'column', title: 'CSM revenue by quarter', unit: 'CSM revenue (₹ crore)', x: QL, series: [{ name: 'CSM', values: SQ.map(q => q.csmRev), fmt: 'num' }], labels: 'all', source: SRC },
      { type: 'column', title: 'Export volumes: down for five quarters', unit: 'Agchem export volume growth, year on year (%)', x: QL.slice(3), series: [{ name: 'Volume growth', values: SQ.slice(3).map(q => q.exportVolumeGrowthPct ?? null), fmt: 'pct0' }], labels: 'all', source: 'Company presentations (Q4FY26 not disclosed)' },
    ] },
    { bullets: [
      `**The model.** PI develops a manufacturing process for an innovator's patented molecule, builds or adapts a plant, and supplies it for years. Customers rarely switch supplier during the patent life because changing a registered process is slow and costly. That gives PI sticky revenue and ~28% EBITDA margins in agchem; PI has never competed with its customers ("zero conflicts").`,
      `**The problem.** One customer took ₹${n0(CC.largestCustomerRevFy26)} cr in FY26 (38% of revenue; ₹${n0(CC.fy26ByDestination.US)} cr shipped to the US), down from ₹${n0(CC.largestCustomerRevFy25)} cr. Analysts on PI's calls name the molecule as pyroxasulfone. Prabhudas Lilladher calls it "off patent"; Kumiai's own filings confirm generic entry in the US and elsewhere in 2026 and falling market prices. PI will not discuss it ("this is not our molecule, it is a partnership").`,
      `**New molecules.** 5 were commercialised in FY26 and 3 in Q1FY27, with 4-5 more planned for FY27. But products launched in the last three years were 15-18% of CSM revenue in FY25, 18% in FY26 and 16-18% in Q1FY27, so their rupee revenue has been flat to down, as an analyst pointed out in May. Management: adoption of new chemistry "has slowed down" in the downcycle.`,
      `**Order book and inventory.** The order book is "around US$1.2 bn", unchanged since May. Contract assets (product made for customers and recognised as revenue before dispatch) were ₹750 cr at Jun-2026, against ₹404 cr at Mar-2025; management says ₹500-700 cr is the normal range.`,
      '**Currency.** The rupee fell ~13% against the dollar over the year to Q1FY27, yet export revenue fell 12% on an 8% volume decline: PI shares currency gains with customers ("pass-through model").',
    ] },
    { exhibit: { type: 'table', title: 'The largest customer, by destination (₹ crore)', head: ['', 'FY25', 'FY26', 'Change'], rows: [
      ['Shipments to the US', n0(CC.fy25ByDestination.US), n0(CC.fy26ByDestination.US), pc((CC.fy26ByDestination.US / CC.fy25ByDestination.US - 1) * 100)],
      ['Shipments to Japan', n0(CC.fy25ByDestination.Japan), n0(CC.fy26ByDestination.Japan), pc((CC.fy26ByDestination.Japan / CC.fy25ByDestination.Japan - 1) * 100)],
      { hl: true, cells: ['**Total, one customer**', `**${n0(CC.largestCustomerRevFy25)}**`, `**${n0(CC.largestCustomerRevFy26)}**`, `**${pc((CC.largestCustomerRevFy26 / CC.largestCustomerRevFy25 - 1) * 100)}**`] },
      ['Share of PI\'s revenue', '44%', '38%', ''],
    ], source: 'Annual report FY26, financial-risk note (customer not named by the company)' } },
    { callout: `**Our view:** PI's CSM franchise is real and well run, and the order book, flow chemistry and 90+ molecule pipeline are genuine assets. But the business is more concentrated than its "20 molecules" message suggests, and its biggest molecule is in the early years of genericisation. We model CSM revenue −2% in FY27, +5% in FY28 and +8% in FY29: the new molecules grow, while pyroxasulfone keeps shrinking.` },
  ],
};

// ---------------------------------------------------------------- Domestic
const domestic = {
  id: 'domestic', nav: 'Domestic agri-brands', kicker: 'Segment', title: 'Domestic brands: winning volume in a tough season, and a first own molecule',
  blocks: [
    { pair: [
      { type: 'column', title: 'Domestic revenue by quarter: the kharif (Q2) peak', unit: 'Domestic revenue (₹ crore)', x: QL, series: [{ name: 'Domestic', values: SQ.map(q => q.domRev), fmt: 'num' }], labels: 'all', source: SRC },
      { type: 'column', title: 'Volumes grew 12% in Q1FY27; prices fell', unit: 'Domestic volume growth, year on year (%)', x: QL.slice(4), series: [{ name: 'Volume growth', values: SQ.slice(4).map(q => q.domVolumeGrowthPct ?? null), fmt: 'pct0' }], labels: 'all', source: 'Company presentations' },
    ] },
    { bullets: [
      `**FY26 was hard:** revenue −7% (volume −1%) on erratic rain, lower crop prices, high channel stocks and a new licensing regime that froze biological sales for part of the year. Four products were launched (3 herbicides, 1 insecticide).`,
      `**Q1FY27 was better than peers:** volume +12%, revenue +3%, biologicals +50%. PI says it chose market share over price ("our approach has been to push and create market share"), while peers took price.`,
      '**Pioxaniliprole**, a diamide insecticide discovered in PI\'s own labs, is PI\'s first new chemical entity. It was filed for registration in India; management hoped for a launch within FY27 "depending on the regulatory framework" and plans filings in other countries over the next two years. It has not given a revenue target. Another new molecule (dicloromezotiaz, for diamondback moth) is planned for the coming season, which management expects to become a "three-digit" (₹100 cr+) product over 5-7 years.',
      '**The 2026 monsoon** ended ~12.6% below normal (IMD, 30-Sep-2026). PI said in August that sowing had caught up with last year after a late start; the rabi season and channel stocks now matter more.',
    ] },
    { callout: 'Domestic is PI\'s steadiest business and the launch pad for its own molecules, but at ₹1,302 cr it is a fifth of revenue: even 10% growth adds only ~2% to group revenue. We model +4% in FY27 (deficient monsoon, pricing pressure) and +10% a year after.' },
  ],
};

// ---------------------------------------------------------------- New businesses
const newbiz = {
  id: 'newbiz', nav: 'Pharma & new platforms', kicker: 'New businesses', title: 'Pharma, biologicals and electronics: long gestation, real losses today',
  blocks: [
    { p: `PI has been building a second leg for five years. The money spent shows up in the P&L before the revenue: pharma alone lost ₹${n0(-A26.pharmaEbitda)} cr at EBITDA in FY26 (−50% of its revenue), and analysts on the August call estimated ~₹300 cr of subsidiary losses in FY26, including ~₹120 cr in global biologicals; management gave no figure of its own but confirmed the front-loaded spending would continue for the next few quarters. In the standalone accounts PI wrote down its investment in PI Health Sciences by ₹110 cr in FY26.` },
    { exhibit: { type: 'table', title: 'The new platforms (as of 30-Sep-2026)', head: ['Platform', 'Size today', 'Profitability', 'Management target'], wide: [3], rows: [
      ['Pharma CRDMO (PI Health Sciences)', `₹${n0(A26.pharmaRev)} cr in FY26 (+40%); ₹54 cr in Q1FY27 (−25%)`, `EBITDA −₹${n0(-A26.pharmaEbitda)} cr (FY26); pre-tax −₹82 cr in Q1FY27`, '₹500-600 cr revenue and EBITDA breakeven "in two to three years"'],
      ['Global biologicals (PI AgSciences)', 'US$12-13 mn revenue (FY26)', 'Loss-making (not disclosed; ~₹120 cr EBITDA loss per an analyst)', 'Breakeven "a couple of years from now"; Brazil nematicide sales to more than triple'],
      ['Electronic chemicals', '"Not significant"; first commercial plant supplying', 'Not disclosed', 'US$80-100 mn revenue in 5-6 years'],
      ['Own molecules (NCEs)', 'Pioxaniliprole awaiting registration', 'R&D ₹356 cr in FY26 (all businesses)', 'Launch in India in FY27; overseas filings over two years'],
    ], source: 'Earnings calls (May and Aug-2026), presentations, annual report FY26' } },
    { pair: [
      { type: 'column', title: 'Pharma revenue: FY24 ₹315 cr, FY25 ₹215 cr, FY26 ₹300 cr', unit: 'Pharma revenue (₹ crore)', x: ['FY24', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], series: [{ name: 'Pharma', values: [314.9, 215.1, A26.pharmaRev, ...F.seg.pharma.revenue], fmt: 'num' }], labels: 'all', source: 'Company; GAM estimates for FY27-29E' },
      { type: 'column', title: 'Our pharma EBITDA path: losses narrow, no profit before FY30', unit: 'Pharma EBITDA (₹ crore)', x: ['FY26', 'FY27E', 'FY28E', 'FY29E'], series: [{ name: 'EBITDA', values: [A26.pharmaEbitda, ...F.seg.pharma.adjEbitda], fmt: 'num' }], labels: 'all', source: 'Annual report FY26; GAM estimates' },
    ] },
    { callout: '**Our view:** these are reasonable bets for a cash-rich company whose core molecule is maturing, and PI has a record of patient building (CSM took 10-12 years to matter). But they are bets: pharma revenue has gone up and down with single customers, and none of the platforms has yet shown a path to profit in the numbers. We value them only through the earnings in our forecasts.' },
  ],
};

// ---------------------------------------------------------------- Moat
const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: real in process chemistry, weak where it matters now',
  blocks: [
    { verdicts: [
      ...D.moat.map(r => r.map(rup)),
      ['Pricing power', 'Disadvantage', 'CSM realisations ~5% lower in FY26; currency gains shared with customers; domestic prices cut to win volume.', 'PI is a price-taker in the downcycle.'],
    ], head: ['Dimension', 'Verdict', 'Evidence', 'So what'], title: 'Moat scorecard', source: 'GAM research compilation (company filings and calls to Sep-2026)' },
    { callout: '**Honest verdict:** PI\'s moat is **process chemistry and trust**: global innovators have given it complex molecules for 30 years, it handles hazardous chemistry at scale, and it has never competed with its customers. That moat protects PI *within* a molecule\'s patent life. It does not protect PI when the molecule itself goes generic, and today ~38% of revenue sits with one customer whose molecule is doing exactly that. The domestic business is a good brand house but not a moat; the new platforms have none yet. Net: a moat that is narrower than the 2021-24 valuation assumed.' },
  ],
};

// ---------------------------------------------------------------- Guidance & Q1FY27
const guidance = {
  id: 'guidance', nav: 'Q1FY27 & guidance', kicker: 'Momentum', title: 'Q1FY27 and guidance: three years of targets, two big misses and a fresh cut',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (₹ crore)', head: ['', 'Q1FY26', 'Q1FY27', 'Change'], rows: [
      ['Revenue', '1,900', n0(Q1.revenue), pc(Q1.revenueYoYPct)],
      ['  CSM exports', '1,490', n0(Q1.csmRev), pc(Q1.csmYoYPct)],
      ['  Domestic agri-brands', '339', n0(Q1.domRev), pc(Q1.domYoYPct)],
      ['  Pharma', '72', n0(Q1.pharmaRev), pc(Q1.pharmaYoYPct)],
      ['Gross margin', '57.4%', `${Q1.grossMarginPct}%`, '−70bp'],
      ['EBITDA (company)', '522', n0(Q1.ebitda), '−29%'],
      ['EBITDA margin', '27.5%', `${Q1.ebitdaMarginPct}%`, '−577bp'],
      { hl: true, cells: ['**Net profit**', '**400**', `**${n0(Q1.pat)}**`, `**${pc(Q1.patYoYPct)}**`] },
    ], source: 'Q1FY27 presentation and results (11-Aug-2026)' } },
    { exhibit: { type: 'table', title: 'What management said vs what happened', head: ['When', 'Topic', 'What was said', 'Outcome'], wide: [2, 3], rows: C.guidance.map(g => [shortDate(g.date), g.item, rup(g.said), g.outcome || '–']), source: 'PI earnings calls and presentations, May-2023 to Aug-2026; Motilal Oswal (12-Aug-2026)' } },
    { callout: '**Why it matters:** the street\'s FY28E EPS (₹86-89) assumes the H2FY27 export recovery arrives and margins return to ~25%. Management\'s own guidance has been cut twice in a year, and the largest customer\'s problem (generic prices) is not one that a cyclical recovery fixes. We give the guidance less weight than the street does.' },
  ],
};

// ---------------------------------------------------------------- Earnings quality
const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: clean audit, but watch working capital, one-offs and interest income',
  blocks: [
    { bullets: [
      '**One-offs.** FY26 net profit of ₹1,321 cr includes a ₹126 cr gain from writing back the Therachem earn-out after a settlement with the sellers (pharma), less a ₹23 cr Labour Code charge. Excluding them, profit fell ~26%. Screener shows the net ₹97 cr inside other income.',
      `**Working capital.** Net working capital went from 73 to 139 days of sales in FY26 (annual report): receivables rose as PI gave "calibrated credit support" to Indian distributors, inventories rose, and contract assets rose to ₹698 cr. Cash from operations fell to ₹474 cr (₹1,413 cr in FY25), only ${Math.round(474 / A.pat[b] * 100)}% of net profit.`,
      '**Contract assets.** Under Ind AS 115 PI books revenue on some contract manufacturing as it produces, before shipment. That is allowed, but it means revenue can run ahead of dispatches; the balance went from ₹404 cr (Mar-25) to ~₹1,000 cr (Dec-25) and ₹750 cr (Jun-26).',
      `**Interest income.** Other income was ₹316 cr before exceptional items in FY26, ~${Math.round(316 / (A.pbt[b] - 97) * 100)}% of pre-tax profit before one-offs. It depends on the cash pile and deposit rates, not on the business.`,
      '**Impairment.** The auditor\'s key audit matter in the standalone accounts is the carrying value of investments in subsidiaries: PI booked a ₹110 cr impairment on PI Health Sciences in FY26. Goodwill (incl. Isagro) is tested annually.',
      '**Disclosure gaps.** PI does not disclose CSM vs domestic margins, the revenue of its largest molecule, or the losses of global biologicals and electronic chemicals.',
    ] },
    { callout: '**Accounting flag: AMBER.** The audit (Price Waterhouse Chartered Accountants LLP) is unqualified and the segment note reconciles. The amber is for the doubling of working-capital days, the reliance on contract-asset accounting, and the one-off gain inside FY26 profit.' },
  ],
};

// ---------------------------------------------------------------- Ownership additions
const OH = D.ownership;
const ownership = base => ({ ...base, blocks: [
  { p: `The Singhal family owns ${OH.categoriesPct.promoter}% (Mayank Singhal 20.45%, his mother Madhu Singhal 9.42% and four family trusts 16.21%), with nothing pledged. Indian institutions own ${OH.categoriesPct.dii}%: mutual funds ${OH.categoriesPct.mutualFunds}% (30 schemes) and insurers ${OH.categoriesPct.insurance}%. Foreign investors have cut their stake from 17.0% (Jun-2025) to ${OH.categoriesPct.fpi}% (Jun-2026). The number of shareholders rose to ~${Math.round(OH.counts.shareholders / 1000)},000 (~${Math.round(OH.counts.shareholdersMar26 / 1000)},000 in Mar-2026) as the price fell.` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Named holders (Jun-2026)', head: ['Holder', 'Stake', 'Note'], wide: [2], rows: [
    ...OH.named.map(h => [h.name, h.pct + '%', /ICICI/.test(h.name) ? 'Largest outside holder' : /LIC/.test(h.name) ? 'Shown under one scheme name; likely LIC\'s total' : /trusts/.test(h.name) ? 'Created Sep-2024 for succession' : '']),
    ['All mutual funds', OH.categoriesPct.mutualFunds + '%', `${OH.counts.mfSchemes} schemes`],
    ['Foreign portfolio investors', OH.categoriesPct.fpi + '%', `${OH.counts.fpis} FPIs; none above 1%`],
  ], source: 'BSE shareholding pattern (quarter to Jun-2026, the latest public on 30-Sep-2026)' } },
  { callout: '**Our read:** a stable founder family with no pledge is a strength. Domestic funds have been buyers through the fall; foreign funds sellers. With institutions holding ~46%, the stock reacts sharply to earnings misses (−7% on 20-May, −9% on 12-Aug-2026).' },
] });

// ---------------------------------------------------------------- Governance
const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: a professional family company, with a high-paid founder and a thin disclosure record',
  blocks: [
    { exhibit: { type: 'table', title: 'Key people', head: ['Name', 'Role', 'Note'], wide: [2], rows: C.management.map(m => [m.name, m.role, m.note || '']), source: 'Annual report FY26, earnings calls (2026)' } },
    { verdicts: [
      ['Audit and accounts', 'Strong', 'Price Waterhouse Chartered Accountants LLP (second term from 2022); unqualified opinion; detailed segment note.', 'No accounting red flags.'],
      ['Board', 'Moderate', '10 directors at Mar-2026; chair is non-executive but not independent; a promoter-family director retires at the 2026 AGM; external board evaluation (WTW).', 'Adequate, not exceptional.'],
      ['Promoter and pledge', 'Strong', '46.09% with nil pledge; shares moved to family trusts for succession (2024).', 'Aligned, stable owner.'],
      ['Pay', 'Weak', 'Executive Vice Chair & MD paid 294x the median employee in FY26, a year profit fell 20%.', 'High for the results.'],
      ['Management continuity', 'Moderate', 'JMD stepped back for health reasons (May-2026); CEO CSM added to the board; Group CFO now leads investor relations.', 'Depth below the founder still being built.'],
      ['Disclosure', 'Weak', 'No molecule, customer, CSM-margin or biologicals-loss disclosure; investors asked for it on both 2026 calls.', 'Makes the stock hard to underwrite.'],
      ['Capital allocation', 'Moderate', 'QIP cash used for capex and acquisitions; pharma acquisitions so far loss-making (₹110 cr impairment).', 'Returns on new capital not yet proven.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'GAM research compilation' },
  ],
};

// ---------------------------------------------------------------- Forecasts
const segRow = (k, name, field, hist, fmt = 'num') => [name, hist == null ? 'n.d.' : n0(hist), ...[0, 1, 2].map(i => `{{F.seg.${k}.${field}.${i}|${fmt}}}`)];
const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: FY27 EPS −22%, then a slow recovery, below the street',
  blocks: [
    { p: 'We forecast each business line\'s revenue, and an EBITDA margin for Agro Chemicals (CSM and domestic together, as the company does not split them) and for Pharma. Capex follows the ₹700-800 cr guidance; other income follows the net cash pile at 7.5-8%; tax is 24% as guided. Every assumption, with our reasoning, is in the Excel model\'s Assumptions sheet, which recalculates this report\'s target price.' },
    { exhibit: { type: 'table', title: 'Business-line forecasts (₹ crore)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      { sec: 'Agchem exports (CSM)' }, segRow('csm', 'Revenue', 'revenue', A26.csmRev), segRow('csm', 'EBITDA (agro margin)', 'adjEbitda', null),
      { sec: 'Domestic agri-brands' }, segRow('dom', 'Revenue', 'revenue', A26.domRev), segRow('dom', 'EBITDA (agro margin)', 'adjEbitda', null),
      { sec: 'Pharma (PI Health Sciences)' }, segRow('pharma', 'Revenue', 'revenue', A26.pharmaRev), segRow('pharma', 'EBITDA', 'adjEbitda', A26.pharmaEbitda),
      ['Agro Chemicals EBITDA margin', '28.8%', `${AS.segments[0].marginPct[0]}%`, `${AS.segments[0].marginPct[1]}%`, `${AS.segments[0].marginPct[2]}%`],
      ['Reconciling items (Screener basis)', '+32', '{{F.unalloc.0|num}}', '{{F.unalloc.1|num}}', '{{F.unalloc.2|num}}'],
    ], source: 'Company (FY26; CSM vs domestic EBITDA not disclosed), GAM Research estimates' } },
    { exhibit: { type: 'rows', title: 'Group P&L and cash flow summary (₹ crore)', from: 'FY23', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' },
      { name: 'Other (mainly interest) income', ref: 'fin.otherIncome' },
      { name: 'Net profit', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n1' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Capex', ref: 'fin.capex' }, { name: 'Free cash flow', ref: 'fin.fcf' }, { name: 'Cash & investments (net of debt)', ref: 'fin.treasury' }, { name: 'ROE', ref: 'fin.roe', fmt: 'pct' },
    ], source: 'Company, GAM Research estimates' } },
    { exhibit: { type: 'table', title: 'GAM vs the street (estimates standing on 30-Sep-2026)', head: ['', 'GAM FY27E', 'Street FY27E', 'GAM FY28E', 'Street FY28E'], rows: [
      ['EPS (₹), Motilal Oswal (12-Aug-26)', '{{F.eps.0|n1}}', n1(mosl.eps.FY27E), '{{F.eps.1|n1}}', n1(mosl.eps.FY28E)],
      ['EPS (₹), Prabhudas Lilladher (12-Aug-26)', '{{F.eps.0|n1}}', n1(pl.eps.FY27E), '{{F.eps.1|n1}}', n1(pl.eps.FY28E)],
      ['Revenue (₹ cr), Motilal Oswal', '{{F.sales.0|num}}', n0(mosl.sales.FY27E), '{{F.sales.1|num}}', n0(mosl.sales.FY28E)],
      ['Revenue (₹ cr), Prabhudas Lilladher', '{{F.sales.0|num}}', n0(pl.sales.FY27E), '{{F.sales.1|num}}', n0(pl.sales.FY28E)],
    ], source: 'Broker notes (12-Aug-2026). Jefferies cut FY27-28E EPS by 12%/11% (levels not disclosed in the sources we saw). No dated consensus for Jul-Sep 2026 was found.' } },
    { callout: `We are ${Math.round((1 - F.eps[0] / mosl.eps.FY27E) * 100)}-${Math.round((1 - F.eps[0] / pl.eps.FY27E) * 100)}% below the two brokers for FY27 and ${Math.round((1 - F.eps[1] / pl.eps.FY28E) * 100)}-${Math.round((1 - F.eps[1] / mosl.eps.FY28E) * 100)}% below for FY28. The gap is revenue (we have FY27 flat, against management's "lower single digit" growth and brokers' +3-5%) and margin (we assume no return to FY25-26's 26-28% group margin while pyroxasulfone prices fall and new businesses lose money). Other income in our model follows Q1's run rate (₹66 cr a quarter).` },
  ],
};

// ---------------------------------------------------------------- Street
const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: 'The street: split, and cutting targets after every quarter',
  blocks: [
    { p: `Six houses published after the Q1FY27 results (12-13 Aug-2026): Motilal Oswal Buy ₹3,000, Jefferies Buy ₹2,910, Deven Choksey Accumulate ₹2,833, HSBC Hold ₹2,720, Prabhudas Lilladher Hold ₹2,569 and Citi Sell ₹2,375, an average of ~₹${n0(avgPost)}. Most had cut their targets: Motilal Oswal from ₹3,500 (May) and ₹4,260 (Nov-2025), Prabhudas Lilladher from ₹2,792 and Deven Choksey from ₹2,976 (May); HSBC and Jefferies also cut. Older calls still standing were Axis Securities Buy ₹3,320 (May), Keynote Neutral ₹2,924 (May) and Geojit Hold ₹3,090 (June). Bulls rely on the US$1.2 bn order book, new molecules and the H2 recovery; bears on pyroxasulfone generics, concentration and losses in new businesses. None of the notes we found was written after Kumiai's 11-Sep profit warning.` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who'], wide: [0], rows: D.critiques, source: 'Broker notes, earnings calls and filings to 30-Sep-2026' } },
  ],
};

// ---------------------------------------------------------------- Valuation
const drRow = s => `${shortName(P[s].name)} ${pc(derate[s])}`;
const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${peMult}x Sep-28E earnings gives {{dcf.tp|inr}}`,
  blocks: [
    ...streetBlocks('PIIND', {
      rating,
      streetIntro: `The two brokers that disclose a method after Q1FY27 value PI on **P/E on FY28E earnings**: Motilal Oswal 34x ("a ~9% discount to the six-year average of 37x"), Prabhudas Lilladher 30x; HSBC notes the stock at 28x FY28E. We use the same method so our target is comparable, applied to the earnings the market will look at in September 2027 (Sep-28E: half FY28E, half FY29E). The "At our EPS" column applies each broker's multiple to our FY28E EPS: most of the gap between us and the street is in the earnings, not the method.`,
      street: ST.map(s => [`${s.broker} (${shortDate(s.date)})`, s.rating, s.tp, s.method || 'n.d.', s.multiple || '–', s.on || '–', s.thesis]),
      ourThesis: 'Core molecule going generic; earnings not yet at a floor',
      streetSource: 'Broker notes and press summaries to 30-Sep-2026 (Jefferies, HSBC, Citi via Livesquawk/Groww; Deven Choksey, Axis, Geojit, Keynote via Trendlyne); n.d. = not disclosed in the sources we saw',
      derivationIntro: 'We start from the stock\'s own one-year-forward P/E history, adjust for how far listed crop-protection stocks had de-rated by 30-Sep-2026, and then for the growth we actually expect.',
      derivation: [
        ['1. Its own history', `One-year-forward P/E: median ${n1(H21.med)}x since Apr-2021 (25th-75th percentile ${n1(H21.p25)}-${n1(H21.p75)}x); ${n1(H16.med)}x since 2016; Motilal Oswal quotes a six-year average of 37x`, `Starting point: ${Math.round(H21.med)}x`],
        ['2. Sector de-rating', `On ${ASOF_TXT} the six listed crop-protection peers traded at ${AGRO.map(drRow).join(', ')} vs their five-year median P/E (median ${pc(agroMed)}); PI itself ${pc(derate.PIIND)}`, `${Math.round(H21.med)}x × ${(1 + agroMed / 100).toFixed(2)} ≈ ${n1(afterDerate)}x`],
        ['3. Growth', `The ${Math.round(H21.med)}x was paid for ~31% a year EPS growth (FY21-24). We forecast FY29E EPS of ₹${n1(F.eps[2])}, about the FY26 level (₹${n1(A.eps[b])}); the street's FY28E is ₹86-89`, `A further ~10% discount: **${peMult}x**`],
        ['4. Peers', `Bayer CropScience ${n1(P.BAYERCROP.pe)}x, UPL ${n1(P.UPL.pe)}x, Coromandel ${n1(P.COROMANDEL.pe)}x, Sumitomo Chemical India ${n1(P.SUMICHEM.pe)}x trailing; CDMOs Syngene ${n1(P.SYNGENE.pe)}x, Divi's ${n1(P.DIVISLAB.pe)}x`, `${peMult}x forward sits in the middle of agchem peers; CDMO multiples apply to only ~4% of revenue`],
        ['5. Returns', `ROE ${n1(A.roe[b])}% in FY26 and ~9-10% in FY27-29E (diluted by net cash), against an ~${n1(V.ke)}% cost of equity; core ROCE ex-cash ~17% (FY26)`, 'No case for a premium to the de-rated sector'],
      ],
      derivationSource: `Screener.in (P/E history to ${ASOF_TXT}), broker notes, GAM Research`,
      history: { field: 'eps', from: '2016-04-01', median: Math.round(H21.med), label: `Median since 2021: ${Math.round(H21.med)}x`, title: `One-year-forward P/E: our ${peMult}x vs history`, yearStep: 2 },
      crossNote: `**What the cross-checks tell us.** EV/EBITDA (16x Sep-28E EBITDA plus net cash at face value) gives ₹${n0(mv('ev').value)}, ${Math.round(mv('ev').vsTarget)}% above the P/E target: PI's cash is worth a little more counted rupee for rupee than capitalised as interest income. The DCF (₹${n0(mv('dcf').value)}) is far lower: at an ${n1(V.ke)}% cost of capital, 5.5% terminal growth and working capital held at FY26's 139 days, cash flows support well under today's price. If working capital returned to FY25's level, the DCF would be ~₹${n0(altDcf)}, still below the target. The market (and the street) is paying for a recovery that has kept slipping.`,
    }),
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', '{{as.scenarios.bull.narrative}} Multiple 32x (its 25th-percentile since 2021).'],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `CSM −2% / +5% / +8%, domestic +4% / +10% / +10%, pharma +10% / +25% / +25% (FY27-29E); agro EBITDA margin 26.5-27.5%; ${peMult}x Sep-28E EPS.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', '{{as.scenarios.bear.narrative}} Multiple 21x (its lowest since 2016).'],
    ], source: 'GAM Research' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-42E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Add: net cash at Mar-27', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
      { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
      ['Memo: DCF with working capital at FY25\'s level', `₹${n0(altDcf)}`],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of capital down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Listed peers: crop protection and CDMO', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', 'vs 5-yr median P/E', 'EV/EBITDA (x)', 'ROE'], rows: PEERS.map(p => [p.symbol === 'PIIND' ? '**PI Industries**' : shortName(p.name), n0(p.mcapCr), n0(p.revenue), p.ebitdaMargin + '%', n1(p.pe), pc(derate[p.symbol]), n1(p.evEbitda), p.roe + '%']), source: `Screener.in, trailing multiples at the NSE close on ${ASOF_TXT} (Bayer, Dhanuka, Rallis standalone)` } },
  ],
};

// ---------------------------------------------------------------- Verdict
const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: 'Our honest summary: a quality franchise at a price that still assumes a quick recovery',
  blocks: [
    { callout: `**What you are buying:** one of the world's leading agchem contract manufacturers, with 30 years of innovator relationships, strong process chemistry, a steady Indian brand business, a first own molecule close to launch, and ₹${n0(netCash)} cr of net cash.` },
    { callout: `**What you are paying:** ${n1(price / F.eps[0])}x our FY27E and ${n1(price / F.eps[1])}x FY28E EPS for a company whose earnings fell 20% in FY26 and are falling again, whose biggest molecule (~38% of revenue through one customer) is going generic, and whose new businesses lose money. On the street's method and our inputs the target is {{dcf.tp|inr}} ({{dcf.upside|chg}}): below our −5% SELL line.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      [`Price below ~₹${n0(sellAbove)} (HOLD) or ~₹${n0(buyBelow)} (BUY)`, 'Medium', 'Share price around the Q2FY27 results'],
      ['Exports grow again in H2FY27 with new molecules above 25% of CSM revenue', 'Medium', 'CSM growth and new-product share each quarter'],
      ['Pyroxasulfone volumes hold up despite generics', 'Low-medium', 'Largest-customer revenue (annual report); Kumiai results'],
      ['Pioxaniliprole registered and selling, with an overseas partner', 'Medium', 'Registration (India), first-season sales, partnership announcements'],
      ['Pharma losses halve', 'Low-medium', 'Pharma segment result each quarter'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['Generic pyroxasulfone prices fall further and the customer cuts orders again', 'Medium', 'CSM revenue down again in FY28; EPS 15-20% below our estimate'],
      ['The H2FY27 export recovery slips into FY28', 'Medium', 'FY27 revenue down mid-single digits'],
      ['A large, expensive acquisition with the cash', 'Low-medium', 'Returns dilution; PI has said it is "evaluating inorganic opportunities"'],
      ['Working capital stays at ~140 days', 'Medium', 'Free cash flow stays thin; DCF near ₹1,300'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: SELL, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**We would move to HOLD below ~₹${n0(sellAbove)} and to BUY below ~₹${n0(buyBelow)}**, or sooner on proof that new molecules are replacing pyroxasulfone (CSM growing with new products above 25%).`,
      '**Biggest swing factor:** the pace at which pyroxasulfone volumes and prices fall. PI does not disclose it; the annual report\'s largest-customer number and Kumiai\'s results are the best guides.',
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Largest customer, share of revenue', v: '38%', d: `₹${n0(CC.largestCustomerRevFy26)} cr in FY26, −28%` },
      { k: 'Revenue, FY26', v: '−16%', d: `₹${n0(A25.consRev)} → ₹${n0(A26.consRev)} cr; Q1FY27 −10%` },
      { k: 'Pharma EBITDA, FY26', v: `−₹${n0(-A26.pharmaEbitda)} cr`, d: `on ₹${n0(A26.pharmaRev)} cr revenue` },
      { k: 'Our FY28E EPS vs the street', v: `₹${n1(F.eps[1])}`, d: `street ₹${n1(pl.eps.FY28E)}-${n1(mosl.eps.FY28E)}` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

// ---------------------------------------------------------------- Glossary
const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['Crop protection / agrochemicals', 'Insecticides, herbicides (weedkillers), fungicides and other products that protect crops.'],
      ['Innovator', 'A company that discovers and patents new molecules (e.g. Syngenta, Bayer, Kumiai) and often outsources their manufacture.'],
      ['CSM (custom synthesis and manufacturing)', 'Making a specific molecule or intermediate for one innovator under a long-term contract; the customer owns the product and the market.'],
      ['Active ingredient / intermediate', 'The biologically active chemical in a product / a chemical building block used to make it.'],
      ['Generic / off-patent', 'A molecule whose patent has expired, so others may make it; prices usually fall.'],
      ['Pyroxasulfone (AXEEV)', 'A pre-emergence herbicide discovered by Kumiai Chemical (Japan); PI\'s largest export product.'],
      ['NCE', 'New chemical entity: a newly discovered molecule. Pioxaniliprole is PI\'s first.'],
      ['Diamide', 'A class of modern insecticides (e.g. chlorantraniliprole, CTPR) that act on insect muscles.'],
      ['Biologicals / peptides', 'Crop products based on natural organisms or proteins; PI\'s peptide platform came with Plant Health Care.'],
      ['CRDMO / CDMO / CRO', 'Contract research, development and manufacturing for pharma and biotech companies.'],
      ['Contract assets', 'Revenue recognised for goods made under a contract but not yet invoiced or shipped.'],
      ['Kharif / rabi', 'India\'s monsoon (June-October) and winter (November-March) crop seasons.'],
      ['P/E, EV/EBITDA', 'Share price ÷ earnings per share; enterprise value (market value less net cash) ÷ operating profit before depreciation.'],
      ['Sep-28E', 'Half of FY28E plus half of FY29E: the 12-month-forward earnings the market will look at in September 2027.'],
      ['DCF / WACC', 'Discounted cash flow valuation; WACC is the required annual return used to discount future cash.'],
    ], source: 'GAM Research' } },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, business, history, industry, tailwind, csm, domestic, newbiz, moat, p.financials, guidance, p.capital, quality, p.balance, ownership(p.ownershipBase), governance, forecasts, street, valuation, risks, p.statements, glossary],
  statementNotes: {
    'sales@FY19': '+25%: export-led growth as new CSM molecules ramped up; material costs rose to 55% of sales (51% in FY18).',
    'sales@FY20': '+18%: includes the Isagro (Asia) acquisition (₹434 cr paid for acquisitions in FY20).',
    'sales@FY22': '+16%: exports ₹3,990 cr, domestic ₹1,309 cr; material costs at 55% of sales held the margin at 21.6%.',
    'sales@FY23': '+23%: exports +26% (volume ~11%, price, currency and mix ~15%), domestic +12% (Q4FY23 presentation).',
    'ebitdaMargin@FY17': '+362bp: material costs fell to 51% of sales from 55%.',
    'ebitdaMargin@FY18': '−259bp: revenue flat at ₹2,277 cr while employee and other costs rose.',
    'ebitdaMargin@FY23': '+216bp: product mix and operating leverage (company).',
    'ebitdaMargin@FY24': '+270bp: gross margin 45% → 50% on product mix; new products drove most of the growth.',
    'pat@FY16': '+27%: EBITDA +14%, margin up to 20.8%.',
    'pat@FY17': '+47%: EBITDA +28% (margin 24.4%) and tax rate down to 23% from 31%.',
    'pat@FY21': '+61%: revenue +36%; other income ₹129 cr (QIP cash) vs ₹50 cr.',
    'pat@FY23': '+46%: EBITDA +35% and a lower tax rate (18% vs 21%).',
    'sales@Q2FY26': '−16% YoY: CSM −18% (volume −17%), domestic −13% on erratic rain.',
    'sales@Q3FY26': '−28% YoY: CSM −32% (volume −29%) on customer delivery schedules; domestic −8%.',
    'sales@FY21': '+36%: exports scaled up new molecules; QIP year.',
    'sales@FY24': '+18%: last year of the export boom; pharma acquisitions added ₹315 cr.',
    'pat@FY24': 'Record ₹1,682 cr; tax rate only 15% (SEZ benefits).',
    'sales@FY26': '−16%: CSM −20% (volume −14%), domestic −7%; largest customer −28%.',
    'pat@FY26': 'Includes ₹126 cr earn-out write-back less ₹23 cr Labour Code charge.',
    'otherIncome@FY26': 'Includes ₹97 cr of net exceptional items (Screener basis).',
    'cfo@FY26': 'Working capital 73 → 139 days.',
    'sales@FY27E': 'GAM: flat; Q1 −10%, H2 export recovery assumed.',
    'pat@FY27E': 'Lower margin (new businesses, prices) and tax at 24%.',
    'sales@FY28E': 'New molecules grow; pyroxasulfone keeps shrinking.',
  },
};
