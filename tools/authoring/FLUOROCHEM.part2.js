// GFL report, part B (1/3): shared context, cover, story in charts, business, history.
const fs = require('fs');
const path = require('path');
const { forwardSeries, forwardMedian } = require('./valuation-blend');
const { ratingFor } = require('../../src/ratings');
const { peersAsOf } = require('./asof-peers');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'FLUOROCHEM', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'models', 'FLUOROCHEM.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual;
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const SRC = 'GFL annual reports and investor presentations, GAM Research';
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026';
const SA = SG.annual, SQ = SG.quarterly, QL = SQ.map(q => q.q), A26 = SA.find(a => a.fy === 'FY26');
const SQ2 = SQ.filter(q => q.chemRev != null);
const price = M.price.last, mcap = M.meta.marketCap, BM = V.blend.methods, mv = k => BM.find(m => m.key === k);
const epsSep28 = mv('pe').metric, rating = ratingFor(V.upside);
const segE = (k, i) => F.seg[k].adjEbitda[i], chemE = i => ['fp', 'fc', 'bulk', 'oth'].reduce((s, k) => s + segE(k, i), 0);
const chemSep28 = (chemE(1) + chemE(2)) / 2, ndSep27 = -(F.treasury[0] + F.treasury[1]) / 2;
const chemEq20 = 20 * chemSep28 - ndSep27, impliedEvBiz = mcap - chemEq20;
// GFCL EV at the Rs 35 price paid by the promoter group and private placees (GFL held 710.17 cr shares = 96.89% at Mar-26; +5.71 cr warrant shares in May-26).
const evShares = 710.17 / 0.9689 + 5.714, evAt35 = evShares * 35, gflEvAt35 = 710.17 * 35, gflEvPerShare = gflEvAt35 / 10.985;
const fwdPe = forwardSeries('FLUOROCHEM', M, 'eps').filter(x => x[0] >= '2021-04-01');
// House rule: one-year-forward P/E median since Apr-2021, leaving out trough years (forward EPS a loss or below half the previous three-year peak).
const FM = forwardMedian('FLUOROCHEM', M), fwdMed = FM.median, fwdMedAll = FM.medianAll, troughYears = FM.troughYears, troughTxt = troughYears.length > 1 ? `${troughYears[0]}-${troughYears.at(-1).slice(2)}` : troughYears.join('');
const TARGET_PE = M.forecast.assumptions.valuation.blend.methods.find(m => m.key === 'pe').multiple.base;
const PEER_SYMS = ['FLUOROCHEM', 'SRF', 'NAVINFLUOR', 'PIIND', 'AARTIIND', 'DEEPAKNTR', 'VINATIORGA', 'CLEAN', 'ANURAS'];
const PEERS = Object.fromEntries(peersAsOf(PEER_SYMS, ASOF).map(p => [p.symbol, p]));
// Trailing P/E on the as-of date vs its own five-year median (sector de-rating test).
const derate = sym => { const S = JSON.parse(fs.readFileSync(path.join(RD, '..', '..', sym, 'screener.json'), 'utf8')); const pe = S.charts.pe['Price to Earning'].filter(([d, v]) => d <= ASOF && v > 0); const v = pe.filter(([d]) => d >= '2021-09-30').map(x => x[1]).sort((a, b) => a - b); const med = v[Math.floor(v.length / 2)]; return { now: pe.at(-1)[1], med, chg: (pe.at(-1)[1] / med - 1) * 100 }; };
const DR = Object.fromEntries(PEER_SYMS.map(s => [s, derate(s)]));
const peerChg = PEER_SYMS.filter(s => !['FLUOROCHEM', 'ANURAS'].includes(s)).map(s => DR[s].chg).sort((a, b) => a - b), sectorDerate = peerChg[Math.floor(peerChg.length / 2)];
const ctx = { fs, path, C, D, SG, M, F, V, A, n0, n1, SRC, ASOF, ASOF_TXT, SA, SQ, SQ2, QL, A26, price, mcap, mv, epsSep28, rating, chemSep28, ndSep27, chemEq20, impliedEvBiz, evShares, evAt35, gflEvAt35, gflEvPerShare, fwdPe, fwdMed, fwdMedAll, troughYears, troughTxt, TARGET_PE, PEER_SYMS, PEERS, DR, sectorDerate, segE, chemE };

const cover = {
  headline: 'A good fluoropolymer business carrying an unproven ₹6,000 cr battery bet, priced as if the bet has paid off',
  lead: `Gujarat Fluorochemicals (GFL) is India's largest maker of fluoropolymers (PTFE, PVDF, FKM, PFA: 63% of FY26 revenue), a large refrigerant producer (21%, now booming on its new R32 plant) and a bulk-chemicals maker (13%). It is also building a battery-materials business, GFCL EV, which has absorbed ~₹2,000 cr so far and will take ₹6,000 cr by FY28, yet sold only ₹14 cr in Q1FY27. Most brokers value GFL on **P/E on FY28E earnings** (Prabhudas Lilladher 52x; ICICI Direct's 30x EV/EBITDA is ~54x P/E). We use the same method: **${TARGET_PE}x Sep-28E EPS of ₹${n1(epsSep28)}** gives **{{dcf.tp|inr}} ({{dcf.upside|chg}})**, so **we initiate with ${rating}.** The EV/EBITDA cross-check (₹${n0(mv('ev').value)}) is higher because its starting multiple still includes the trough years; the DCF (₹${n0(mv('dcf').value)}) shows that cash flows support far less while capex and working capital absorb all the cash. Bull case {{scen.bull.tp|inr}}; bear case {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'The core is doing well', p: 'Q1FY27 revenue rose 24% and net profit 20%. Fluoropolymers grew 15% on higher-value grades, refrigerants 52% on R32 (10kt plant full, doubling to 20kt in Q2FY27), and the Chemicals segment\'s EBITDA margin reached 29%. 3M has left the market and AGC plans to shut its UK plant. Management guides 15-20% a year for fluoropolymers.' },
    { h: 'The battery business is still a promise', p: 'GFCL EV had ₹33 cr of segment revenue and an ₹80 cr EBITDA loss in FY26; Q1FY27 revenue was ₹14 cr with a ₹30 cr loss. The Oman plant is on hold and its ~₹1,200 cr of sovereign funding is lost. Management now targets ₹100 cr+ of quarterly revenue by Q4FY27 and the full potential only by FY29.' },
    { h: 'Returns are below the cost of capital, and debt is rising', p: `Return on equity was ~8% in each of FY24-26. Capex of ₹3,150 cr in FY27 and ~₹2,400 cr in FY28, plus heavy working capital (inventory ~450 days), take net debt from ₹2,094 cr to ~₹${n0(-F.treasury[1])} cr by FY28 on our numbers. We forecast ROE of only ${n1(F.roe[2])}% in FY29.` },
    { h: 'Valuation already prices success', p: `At ₹${n0(price)} the stock trades at ${n1(price / F.eps[1])}x our FY28E EPS. Chemical peers have de-rated ~${Math.round(-sectorDerate)}% against their five-year P/E medians; GFL has re-rated (trailing P/E ${n1(DR.FLUOROCHEM.now)}x vs a ${n1(DR.FLUOROCHEM.med)}x median). After valuing chemicals at 20x EBITDA, the price implies ~₹${n0(impliedEvBiz)} cr for a battery business that still loses money.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [{ k: 'Accounting', v: 'AMBER' }, { k: 'Predictability', v: 'RED' }, { k: 'Earnings momentum', v: 'GREEN' }, { k: 'Competitive position', v: 'AMBER' }, { k: 'Valuation', v: 'RED' }],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): the first quarter with the 20kt R32 plant, and whether battery revenue starts to climb.',
    'New funding for GFCL EV to replace the Oman sovereign money: how much, at what valuation, and how much of the subsidiary GFL keeps.',
    'Battery revenue against management\'s target of ₹100 cr+ in Q4FY27; LFP cathode and PVDF binder qualifications.',
    'EU PFAS restriction: ECHA\'s socio-economic committee (SEAC) final opinion expected by end-2026; fluoropolymers are in scope.',
    'India: HFC quota rules (baseline set from Jan-2027), the PTFE anti-dumping case filed by GFL (Mar-2026) and the R-125 duty recommended in Sep-2026.',
    'Approvals for the scheme merging promoter company Inox Leasing and Finance into GFL.',
  ],
};

const fp = SQ.map(q => q.fpRev), fc = SQ.map(q => q.fcRev);
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'stacked', title: 'Fluoropolymers are two-thirds of revenue', unit: 'Revenue by business line (₹ crore)', x: SA.map(a => a.fy), series: [{ name: 'Fluoropolymers', values: SA.map(a => Math.round(a.fpRev)), fmt: 'num' }, { name: 'Fluorochemicals', values: SA.map(a => Math.round(a.fcRev)), fmt: 'num' }, { name: 'Bulk chemicals', values: SA.map(a => Math.round(a.bulkRev)), fmt: 'num' }, { name: 'Battery & other', values: SA.map(a => Math.round(a.battRev + a.othOpRev)), fmt: 'num' }], minLabel: 300, source: 'Annual reports (audited product-wise revenue)' },
      { type: 'column', title: 'R32 lifted refrigerants 52% in Q1FY27', unit: 'Quarterly revenue (₹ crore)', x: QL, series: [{ name: 'Fluoropolymers', values: fp, fmt: 'num' }, { name: 'Fluorochemicals', values: fc, fmt: 'num' }], labels: 'none', source: 'Investor presentations' },
    ] },
    { pair: [
      { type: 'line', title: 'Chemicals margin back to 29%', unit: 'Chemicals segment EBITDA margin (%, company basis)', x: SQ2.map(q => q.q), series: [{ name: 'Chemicals', values: SQ2.map(q => Math.round(q.chemEbitda / q.chemRev * 1000) / 10), fmt: 'pct' }], labels: 'all', min: 15, max: 35, source: 'Investor presentations' },
      { type: 'column', title: 'Battery materials: losses, not yet revenue', unit: 'GFCL EV segment EBITDA (₹ crore)', x: SQ2.map(q => q.q), series: [{ name: 'EBITDA', values: SQ2.map(q => q.evEbitda), fmt: 'num' }], labels: 'all', source: 'Investor presentations' },
    ] },
    { pair: [
      { type: 'stacked', title: 'Capex triples in FY27, mostly for batteries', unit: 'Capex (₹ crore)', x: ['FY24', 'FY25', 'FY26', 'FY27 (plan)'], series: [{ name: 'Chemicals (GFL)', values: [381, 606, 270, 800], fmt: 'num' }, { name: 'Battery materials (GFCL EV)', values: [669, 519, 787, 2300], fmt: 'num' }], minLabel: 200, source: 'Q1FY27 investor presentation' },
      { type: 'line', title: 'ROE: ~8% for three years, ~12% by FY29E', unit: 'Return on equity (%)', x: 'fin.labels', from: 'FY22', series: [{ name: 'ROE', ref: 'fin.roe', fmt: 'pct' }], labels: 'all', min: 0, max: 30, source: 'Screener.in; GAM estimates for FY27-29E' },
    ] },
    { pair: [
      { type: 'line', title: `Forward P/E: ${n1(fwdMed)}x median outside trough years`, unit: 'Price ÷ next full-year EPS (x)', x: fwdPe.map(x => x[0]), series: [{ name: 'Forward P/E', values: fwdPe.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: fwdMed, text: `Median since 2021 excl. ${troughTxt}: ${n1(fwdMed)}x` }, { v: TARGET_PE, text: `Our target: ${TARGET_PE}x`, color: '#cf8f1f' }], source: 'Screener.in prices; actual EPS, GAM estimates for FY27-28E' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street', unit: `₹ per share; CMP ₹${n0(price)}`, x: ['ICICI Direct (Aug)', 'ICICI Securities (Aug)', 'Axis Capital (Aug)', 'Elara (May)', 'DRChoksey (Aug)', 'Prabhudas Lilladher (Aug)', 'JM Financial (Feb)', 'GAM (base)'], series: [{ name: 'Target', values: [5800, 5050, 4800, 4698, 4612, 4498, 3505, V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes to 30-Sep-2026, GAM Research' },
    ] },
  ],
};

const geo = C.geographyFY26;
const business = {
  id: 'business', nav: 'What GFL does', kicker: 'The business', title: 'One fluorine chain, four businesses',
  blocks: [
    { p: 'GFL is the chemicals arm of the INOX group (the Jain family), which also controls Inox Wind and Inox Clean Energy. Its businesses form one chain. Fluorspar (it owns a mine in Morocco) becomes hydrofluoric acid (HF); HF plus chloroform from its own chlor-alkali plant makes the refrigerant R22; R22 is cracked into TFE, the building block of PTFE and other fluoropolymers. Each step adds value and gives GFL control over cost and quality that importers do not have. It runs three sites in Gujarat (Ranjitnagar, Dahej and Jolva) and warehouses in Europe, the US and the Middle East. Exports are about 60% of revenue; no customer is more than 10%.' },
    { exhibit: { type: 'table', title: 'The four businesses in FY26', head: ['Business', 'What it makes', 'Revenue (₹ cr)', 'Share', 'Note'], wide: [1, 4], rows: [
      ...C.businessLines.map(b => [`**${b.name}**`, b.products, n0(b.fy26RevCr), `${(b.fy26RevCr / A26.consRev * 100).toFixed(b.fy26RevCr < 100 ? 1 : 0)}%`, b.note]),
      ['Other operating revenue', 'Export incentives, scrap', n0(A26.othOpRev), `${(A26.othOpRev / A26.consRev * 100).toFixed(0)}%`, ''],
      { hl: true, cells: ['**Revenue from operations**', '', n0(A26.consRev), '100%', `Chemicals segment EBITDA ₹${n0(A26.chemEbitda)} cr (27.3%); battery segment −₹${n0(-A26.evEbitda)} cr`] },
    ], source: 'Annual report FY26 (product-wise revenue, segment note), Q1FY27 presentation' } },
    { pair: [
      { type: 'hbar', title: 'Europe and the US buy 44% of output', unit: 'FY26 revenue by customer location (₹ crore)', x: ['India', 'Europe', 'USA', 'Rest of world'], series: [{ name: 'Revenue', values: [geo.India, geo.Europe, geo.USA, geo.RestOfWorld].map(Math.round), fmt: 'num' }], labels: 'all', highlight: 'India', source: 'Annual report FY26' },
      { type: 'hbar', title: 'Battery materials address ~70% of an LFP cell\'s cost', unit: 'Share of LFP cell cost (%)', x: ['Cathode (LFP)', 'Anode', 'Separator', 'Electrolyte', 'Others (foils etc.)'], series: [{ name: 'Share', values: [42, 20, 12, 10, 16], fmt: 'pct0' }], labels: 'all', source: 'Q1FY27 investor presentation (GFCL EV offers cathode, anode, electrolyte, binders)' },
    ] },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'From an R22 plant (1989) to India\'s fluoropolymer leader, and now batteries',
  blocks: [
    { exhibit: { type: 'table', title: 'Key events and what they did to the numbers', head: ['When', 'Event'], wide: [1], rows: C.history.map(h => [h.when, h.event]), source: 'Company filings, annual reports, presentations, exchange filings' } },
    { callout: '**Corporate actions since listing (2019):** no bonus, split, buyback or equity issue at GFL; share count unchanged at 10.985 cr. Dividends are small (₹3 a share for FY26). The action has been at the subsidiary: GFCL EV sold shares and warrants at ₹35 to the promoter family and others (₹292 cr), ₹430 cr of convertible preference shares to IFC, and ~26% of its Oman unit to outside investors. Every new round at GFCL EV reduces GFL shareholders\' share of the battery business.' },
  ],
};

module.exports = { ctx, cover, narrative, business, history };
