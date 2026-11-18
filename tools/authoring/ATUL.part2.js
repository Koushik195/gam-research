// Atul report, part B (1/3): shared context, cover, story in charts, business, history.
// Written as of 30-Sep-2026 (Q1FY27 basis). Prose numbers come from research/company.json, deep.json,
// segments.json and the built model; forecast and valuation figures are live tokens ({{...}}).
const fs = require('fs');
const path = require('path');
const { forwardSeries, forwardMedian } = require('./valuation-blend');
const { ratingFor, buyBelow: buyAt, sellAbove: sellAt } = require('../../src/ratings');
const { peersAsOf } = require('./asof-peers');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'ATUL', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'ATUL.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, AS = M.forecast.assumptions;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const pctChg = (a, b) => Math.round((a / b - 1) * 100);
const SRC = 'Atul annual reports, investor presentations and Analyst Meet 2026, GAM Research';
const SA = SG.annual, SQ = SG.quarterly, QL = SQ.map(q => q.q), FYS = SA.map(a => a.fy);
const ann = fy => SA.find(a => a.fy === fy);
const A26 = ann('FY26'), A25 = ann('FY25'), A24 = ann('FY24'), A21 = ann('FY21');
const SA2 = SA.filter(a => a.fy >= 'FY20');
const price = M.price.last, mcap = price * F.shares;
const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const epsSep28 = mv('pe').metric, pe27 = price / F.eps[0], pe28 = price / F.eps[1], peSep28 = price / epsSep28;
const nc = i => F.treasury[i];
const ncMar27 = Math.round(nc(0) / 100) * 100, ncPerShare = nc(0) / F.shares;
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;
const Q1 = C.q1fy27, BR = D.street.brokers, tpBrokers = BR.filter(b => b.tp);
const moslE = D.street.estimates.mosl, nuvE = D.street.estimates.nuvama;
const pocPt = F.seg.poc.revenue[1] * 0.01 * (1 - AS.taxRate[1] / 100) / F.shares; // EPS per 1pt of P&OC margin, FY28E
const lscShareEbit = Math.round(A26.lscEbit / (A26.lscEbit + A26.pocEbit) * 100);

// Peers at the 30-Sep-2026 close, with each peer's five-year median trailing P/E (Screener).
const PEER_SYMS = ['ATUL', 'VINATIORGA', 'NAVINFLUOR', 'DEEPAKNTR', 'AARTIIND', 'SRF', 'CLEAN', 'TATACHEM', 'PIIND'];
const PEERS = Object.fromEntries(peersAsOf(PEER_SYMS, ASOF).map(p => [p.symbol, p]));
const median = a => { const v = a.filter(x => x != null).slice().sort((x, y) => x - y); return v.length ? v[Math.floor(v.length / 2)] : null; };
const med5 = (sym, chart, key) => { const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')); return median((S.charts[chart]?.[key] || []).filter(([d, v]) => d >= '2021-09-30' && d <= ASOF && v > 0 && v < 300).map(x => x[1])); };
for (const s of PEER_SYMS) { PEERS[s].pe5 = med5(s, 'pe', 'Price to Earning'); PEERS[s].ev5 = med5(s, 'evEbitda', 'EV Multiple'); PEERS[s].peVs = PEERS[s].pe5 ? (PEERS[s].pe / PEERS[s].pe5 - 1) * 100 : null; }
const sectorDerate = median(PEER_SYMS.map(s => PEERS[s].peVs));
const AT = PEERS.ATUL;
const pname = p => p.name.replace(/ Ltd$/, '').replace(' International', '').replace(' & Technology', '');

// One-year-forward P/E history (actual EPS, then our estimates).
const fwd = forwardSeries('ATUL', M, 'eps');
const fwd19 = fwd.filter(x => x[0] >= '2019-04-01'), fwd21 = fwd.filter(x => x[0] >= '2021-04-01');
const fwdMed21 = median(fwd21.map(x => x[1])), fwdMed19 = median(fwd19.map(x => x[1]));
const fwdMed24 = median(fwd.filter(x => x[0] >= '2024-04-01').map(x => x[1]));
// House starting point: forward P/E median since Apr-2021 excluding trough years (forward EPS a loss or below half the previous three-year peak).
const FM = forwardMedian('ATUL', M), fwdMedX = FM.median, troughTxt = FM.troughYears.join(', ');
const PE_X = mv('pe').mult, PE_BULL = mv('pe').multiple.bull, PE_BEAR = mv('pe').multiple.bear, deratedMed = fwdMedX * (1 + sectorDerate / 100);

// Net cash path (actual: cash + investments − borrowings; forecast: model treasury, net of debt).
const ncLabels = ['FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26', ...F.years];
const ncVals = [...['FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'].map(l => -M.annual.netDebt[M.annual.labels.indexOf(l)]), ...F.years.map((_, i) => Math.round(nc(i)))];

const ctx = { C, D, SG, M, F, V, AS, n0, n1, pctChg, SRC, SA, SQ, QL, FYS, ann, A26, A25, A24, A21, SA2, price, mcap, BM, mv, epsSep28, pe27, pe28, peSep28, nc, ncMar27, ncPerShare,
  rating, buyBelow, sellAbove, Q1, BR, tpBrokers, moslE, nuvE, pocPt, lscShareEbit, PEER_SYMS, PEERS, sectorDerate, AT, pname, fwd19, fwdMed21, fwdMed19, fwdMed24, FM, fwdMedX, troughTxt, PE_X, PE_BULL, PE_BEAR, deratedMed, ncLabels, ncVals, ASOF, ASOF_TXT, median };

// ---------------------------------------------------------------- Cover
const cover = {
  headline: 'Q1 was a spike; on normal earnings this cash-rich chemical house is fairly priced',
  lead: `Atul makes crop-protection actives and pharma ingredients (Life Science Chemicals, ~28% of revenue but ${lscShareEbit}% of segment profit) and a wide range of performance chemicals: epoxy resins, aromatics, dyes, caustic-chlorine (Performance & Other Chemicals, ~72%). Q1FY27 was its best quarter ever (EPS ₹83, +92%) on war-time chemical prices and inventory gains that we expect to fade, so we model FY28E EPS of only ₹${n1(F.eps[1])} (+${Math.round(F.epsGrowth[1])}%), ${Math.abs(pctChg(F.eps[1], moslE.FY28E.eps))}% below Motilal Oswal. At ₹${n0(price)} the stock trades at ${n1(peSep28)}x Sep-28E EPS and holds ~₹${n0(ncMar27)} cr of net cash by Mar-27 (~${Math.round(nc(0) / mcap * 100)}% of its market value). We value Atul as the street does, on **P/E: ${PE_X}x Sep-28E EPS of ₹${n1(epsSep28)}**, which gives **{{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}.** EV/EBITDA (₹${n0(mv('ev').value)}) is higher because it credits the net cash in full; our DCF (₹${n0(mv('dcf').value)}) is a little lower. Both bracket the price: the good business and the cash are paid for, the Q1 spike is not. Bull case {{scen.bull.tp|inr}}; bear case {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'Life Science Chemicals is the jewel', p: `Atul holds 13% of the world market in the herbicide 2,4-D and 14% in the insecticide indoxacarb. LSC earned ₹${n0(A26.lscEbit)} cr of EBIT in FY26 (${A26.lscEbitPct}% margin) on ₹${n0(A26.lscRev)} cr of revenue, a ${A26.lscRoce}% pre-tax return on its capital. Growth is slow (~4% a year over FY19-26) and Chinese pricing caps it, but it is a genuinely high-return franchise.` },
    { h: 'P&OC: big plants, thin returns, now being sweated', p: `Atul spent ₹1,970 cr in FY22-24, mostly in P&OC (an 80 ktpa epoxy resin plant, a 300 TPD caustic-chlorine plant, aromatics). P&OC EBIT fell from ₹576 cr (FY22) to ₹240 cr (FY24) and its ROCE is still only ${A26.pocRoce}% (FY26). The plants now run without new capex; India's anti-dumping duty on epoxy imports (Nov-2025) helps. Q1FY27's 16.8% EBIT margin was a war-time spike; we model ~15.5% EBITDA (FY26: ${A26.pocEbitdaPct}%).` },
    { h: 'A cash machine with a capital-allocation question', p: `Capex fell from ₹875 cr (FY23) to ₹175 cr (FY26) and free cash flow reached ₹848 cr. Net cash grows to ~₹${n0(Math.round(nc(2) / 100) * 100)} cr by FY29E in our model. That pile holds ROE at ~${Math.round(F.roe[1])}%, about the cost of equity. Three buybacks returned only ₹170 cr since 2020. Better use of the cash is upside we do not model.` },
    { h: 'Valuation: fair once the trough year is left out', p: `Brokers use 25-30x FY28E EPS on higher earnings. Atul's one-year-forward P/E median since 2021 is ${n1(fwdMedX)}x leaving out ${troughTxt}, a trough year under our house rule (${Math.round(FM.medianAll)}x with it). Indian chemical stocks were ~${Math.abs(Math.round(sectorDerate))}% below their medians on ${ASOF_TXT} (Atul −${Math.abs(Math.round(AT.peVs))}%), so ~${Math.round(deratedMed)}x, less ~15% because returns only match the cost of equity: ${PE_X}x. The stock is at ${n1(pe28)}x our FY28E: about fair.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'GREEN' },
    { k: 'Predictability', v: 'AMBER' },
    { k: 'Earnings momentum', v: 'AMBER' },
    { k: 'Competitive position', v: 'AMBER' },
    { k: 'Valuation', v: 'AMBER' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): how much of Q1\'s P&OC margin (16.8% EBIT vs ~9% in FY26) survives as war-time prices and inventory gains fade.',
    'Utilisation of the 80 ktpa epoxy resin plant and Atul Products\' caustic-chlorine chain; epoxy exports to the US despite its anti-dumping duty (12.69% for Atul).',
    'Capital allocation: a large project, an acquisition or a bigger buyback from a ~₹2,500 cr treasury.',
    'The ₹167 cr MCPP-p/MCPA herbicide plant (approved Jul-2026, 67 weeks) and new crop-protection launches.',
    'Chinese pricing in 2,4-D, epoxy and para-cresol, and India\'s trade-remedy decisions.',
  ],
};

// ---------------------------------------------------------------- Story in charts
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'stacked', title: `LSC now earns ~${lscShareEbit}% of segment profit on ~28% of revenue`, unit: 'Segment EBIT (₹ crore)', x: FYS, series: [{ name: 'Life Science Chemicals', values: SA.map(a => Math.round(a.lscEbit)), fmt: 'num' }, { name: 'Performance & Other Chemicals', values: SA.map(a => Math.round(a.pocEbit)), fmt: 'num' }], minLabel: 80, source: 'Company annual reports (segment notes)' },
      { type: 'line', title: 'P&OC margins never recovered from the FY23 slump', unit: 'Segment EBITDA margin (%, annual)', x: FYS, series: [{ name: 'Life Science Chemicals', values: SA.map(a => a.lscEbitdaPct), fmt: 'pct' }, { name: 'Performance & Other Chemicals', values: SA.map(a => a.pocEbitdaPct), fmt: 'pct' }], labels: 'last', min: 0, max: 30, source: 'Company annual reports; EBITDA = segment EBIT + segment depreciation' },
    ] },
    { pair: [
      { type: 'line', title: 'Q1FY27: P&OC margin almost doubles on war-time prices', unit: 'Segment EBIT margin (%, quarterly)', x: QL, series: [{ name: 'Life Science Chemicals', values: SQ.map(q => q.lscEbitPct), fmt: 'pct' }, { name: 'Performance & Other Chemicals', values: SQ.map(q => q.pocEbitPct), fmt: 'pct' }], labels: 'last', min: 0, max: 35, source: 'Company presentations and results; Q2-Q4 derived from half-year, nine-month and full-year figures' },
      { type: 'line', title: 'LSC returns ~40%; P&OC ~14% after the capex wave', unit: 'Segment pre-tax ROCE (%)', x: SA2.map(a => a.fy), series: [{ name: 'Life Science Chemicals', values: SA2.map(a => a.lscRoce), fmt: 'pct0' }, { name: 'Performance & Other Chemicals', values: SA2.map(a => a.pocRoce), fmt: 'pct0' }], labels: 'all', source: 'Company annual reports; GAM calculation (segment EBIT ÷ average segment assets less liabilities)' },
    ] },
    { pair: [
      { type: 'column', title: 'Capex down, cash flow up', unit: '₹ crore', x: 'fin.labels', from: 'FY20', series: [{ name: 'Cash from operations', ref: 'fin.cfo', fmt: 'num' }, { name: 'Capex', ref: 'fin.capex', fmt: 'num' }], labels: 'none', source: 'Company, GAM Research estimates' },
      { type: 'column', title: `Net cash heading to ~₹${n0(Math.round(nc(2) / 100) * 100)} cr`, unit: 'Net cash and investments (₹ crore)', x: ncLabels, series: [{ name: 'Net cash', values: ncVals, fmt: 'num' }], labels: 'all', source: 'Company (FY20-26: cash + investments − borrowings), GAM Research estimates' },
    ] },
    { pair: [
      { type: 'line', title: `Forward P/E: ${Math.round(pe28)}x our FY28E today`, unit: 'Price ÷ next full-year EPS (x)', x: fwd19.map(x => x[0]), series: [{ name: 'Forward P/E', values: fwd19.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: Math.round(fwdMedX), text: `Median since 2021 ex-${troughTxt}: ${Math.round(fwdMedX)}x` }, { v: PE_X, text: `Our target: ${PE_X}x`, color: '#cf8f1f' }], source: `Screener.in prices; actual EPS, GAM estimates for FY27-29E; median excludes the ${troughTxt} trough year (house rule)` },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...tpBrokers.map(b => b.broker.replace(' Institutional Equities', '')), 'GAM (base)'], series: [{ name: 'Target', values: [...tpBrokers.map(b => b.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes and press reports (Dec-2025 to Jul-2026), GAM Research' },
    ] },
  ],
};

module.exports = { ctx, cover, narrative };
