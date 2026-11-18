// Aarti Industries report, part B (as of 30-Sep-2026, Q1FY27 basis): story, business, history,
// industry, tailwind test, value chains, energy (fuel additives), projects & guidance record, moat,
// earnings quality, ownership, governance, forecasts, street, valuation, verdict, glossary.
// Prose numbers come from research/company.json, deep.json, segments.json and the built model;
// forecast and valuation figures are live tokens ({{...}}) that follow assumptions.json.
const fs = require('fs');
const path = require('path');
const { streetBlocks, forwardSeries } = require('./valuation-blend');
const { ruleText, buyBelow: buyAt, sellAbove: sellAt } = require('../../src/ratings');
const { peersAsOf } = require('./asof-peers');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'AARTIIND', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'AARTIIND.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, S = M.forecast.scenarios;
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026';
const SRC = 'Aarti Industries annual reports, results presentations and earnings calls; GAM Research';
const SRC_PPT = 'Aarti Industries results and AGM presentations (2025-26)';

// ------------------------------------------------------------------ data helpers
const ai = l => A.labels.indexOf(l);
const price = M.price.last, mcap = M.meta.marketCap || price * F.shares;
const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const ebitdaSep28 = mv('ev').metric, epsSep28 = mv('pe').metric;
const netDebt26 = A.netDebt[ai('FY26')], ebitda26 = A.ebitda[ai('FY26')], ebitda21 = A.ebitda[ai('FY21')];
const capex21_26 = ['FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'].reduce((s, l) => s + A.capex[ai(l)], 0);
const cfo21_26 = ['FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'].reduce((s, l) => s + A.cfo[ai(l)], 0);
const ndE = A.labels.map((l, i) => Math.round(A.netDebt[i] / A.ebitda[i] * 10) / 10);
const sepND = -(F.treasury[1] + F.treasury[2]) / 2; // net debt at Sep-28E (average of Mar-28E and Mar-29E)
const SA = SG.annual, SQ = SG.quarterly, VOL = C.volumes.annual;
const EM = C.endUseMix.rows, emBy = p => EM.find(r => r.period === p);
const high52 = M.price.high52, low52 = M.price.low52, fromHigh = (price / high52 - 1) * 100;
const rating = 'HOLD';
const buyBelow = Math.round(buyAt(V.tp) / 5) * 5, sellAbove = Math.round(sellAt(V.tp) / 5) * 5;
const streetFY28 = { pl: 18.8, idir: 21.4 }, streetEbitda28 = { pl: 1630, idir: 1779 };
const guidLow = 1800, guidHigh = 2200;

// One-year-forward EV/EBITDA: (price × shares + latest reported net debt) ÷ next full fiscal year's
// EBITDA (actuals, then GAM estimates). The shared helper only charts forward P/E or P/B.
function forwardEv() {
  const Sx = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8'));
  const eb = {}, nd = {}, sh = A.shares.at(-1);
  A.labels.forEach((l, i) => { eb[2000 + +l.slice(2)] = A.ebitda[i]; nd[2000 + +l.slice(2)] = A.netDebt[i]; });
  F.years.forEach((y, i) => (eb[2000 + +y.slice(2, 4)] = F.ebitda[i]));
  return Sx.charts.price.Price.filter(([d]) => d <= ASOF).filter((_, i) => i % 5 === 0).map(([d, px]) => {
    const dt = new Date(d), fy = dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1, lastFy = dt.getMonth() >= 5 ? dt.getFullYear() : dt.getFullYear() - 1;
    return [d, eb[fy] > 0 && nd[lastFy] != null ? Math.round((px * sh + nd[lastFy]) / eb[fy] * 10) / 10 : null];
  }).filter(x => x[1] != null);
}
const med = a => { const s = a.filter(x => x != null).sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : null; };
const fwdEv = forwardEv().filter(x => x[0] >= '2019-04-01');
const fwdEvMed23 = med(fwdEv.filter(x => x[0] >= '2023-04-01').map(x => x[1]));
const fwdEvMed25 = med(fwdEv.filter(x => x[0] >= '2025-04-01').map(x => x[1]));
const fwdEvNow = fwdEv.at(-1)[1];
const fwdPe = forwardSeries('AARTIIND', M, 'eps').filter(x => x[0] >= '2019-04-01');
const fwdPeMed25 = med(fwdPe.filter(x => x[0] >= '2025-04-01').map(x => x[1]));
const fwdPeMed23 = med(fwdPe.filter(x => x[0] >= '2023-04-01').map(x => x[1]));

// Peers at the 30-Sep close, and how far each has de-rated vs its own post-Apr-2023 median.
const PEER_SYMS = ['AARTIIND', ...D.peers];
const PEERS = peersAsOf(PEER_SYMS, ASOF);
const derate = PEERS.map(p => {
  const P = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', p.symbol, 'screener.json'), 'utf8'));
  const w = s => (s || []).filter(([d]) => d >= '2023-04-01' && d <= ASOF).map(x => x[1]);
  const evM = med(w(P.charts.evEbitda?.['EV Multiple'])), peM = med(w(P.charts.pe?.['Price to Earning']));
  return { ...p, evMed: evM, peMed: peM, evVs: p.evEbitda && evM ? (p.evEbitda / evM - 1) * 100 : null, peVs: p.pe && peM ? (p.pe / peM - 1) * 100 : null };
});
const peerDer = derate.filter(p => p.symbol !== 'AARTIIND');
const derEvMed = med(peerDer.map(p => p.evVs)), derPeMed = med(peerDer.map(p => p.peVs));
const self = derate.find(p => p.symbol === 'AARTIIND');
const peerEvMed = med(peerDer.map(p => p.evEbitda)), peerRoeMed = med(peerDer.map(p => p.roe));
const SHORT = { 'Aarti Industries Ltd': 'Aarti', 'Deepak Nitrite Ltd': 'Deepak Nitrite', 'Atul Ltd': 'Atul', 'Vinati Organics Ltd': 'Vinati Organics', 'Navin Fluorine International Ltd': 'Navin Fluorine', 'SRF Ltd': 'SRF', 'Clean Science & Technology Ltd': 'Clean Science', 'Laxmi Organic Industries Ltd': 'Laxmi Organic', 'Alkyl Amines Chemicals Ltd': 'Alkyl Amines' };
const shortName = n => SHORT[n] || n.replace(/ Ltd$/, '');

// ------------------------------------------------------------------ cover
const cover = {
  headline: 'A scale leader in benzene chemistry with a decade of capex still waiting to earn',
  lead: `Aarti Industries is India's largest maker of benzene-based intermediates (nitrochlorobenzenes, dichlorobenzenes, nitrotoluenes and their derivatives) and, since FY24, a large exporter of a gasoline octane booster (MMA), now 38-43% of revenue. It has spent ~₹${n0(capex21_26)} cr on capex over FY21-26, yet FY26 EBITDA of ₹${n0(ebitda26)} cr was only ${Math.round((ebitda26 / ebitda21 - 1) * 100)}% above FY21, ROCE is ~7% and net debt has risen to ~₹4,300 cr (3.6x EBITDA). Management targets ₹1,800-2,200 cr of EBITDA in FY28; it missed its first FY24 and FY25 targets by 29% and 41%. We forecast ₹${n0(F.ebitda[1])} cr for FY28 and reach the low end a year late. The street is split between **EV/EBITDA** and P/E; we use **12x Sep-28E EV/EBITDA (₹${n0(ebitdaSep28)} cr), less ~₹${n0(sepND)} cr of net debt**, which gives **{{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with HOLD.** P/E (₹${n0(mv('pe').value)}) and DCF (₹${n0(mv('dcf').value)}) cross-checks agree. Bull case {{scen.bull.tp|inr}}; bear case {{scen.bear.tp|inr}}: the leverage makes the range wide.`,
  arguments: [
    { h: 'Real scale, weak pricing power', p: `Aarti is #1 globally in DCB and has 25-40% global share across its benzene products (CRISIL), with no customer above 10% of revenue. But Chinese supply sets prices: gross margin fell from 42% (FY23) to 34% (9MFY26), and FY26 realisations fell 25% while volumes rose 39%. China's export-VAT rebate removal (Apr-2026) has helped the NCB chain; PDA remains structurally weak.` },
    { h: 'Fuel additives: the growth engine is also the risk', p: `MMA output rose from 23 kT (FY22) to 238 kT (FY26) and capacity reached 360 kT in Jul-2026. It carries a thin, crack-linked margin, faces 2-3 Indian and 2-3 Chinese competitors, and lost its Middle East market (~15% of company revenue to 2%) in Q1FY27. Volumes are seasonal (weak Oct-Dec).` },
    { h: 'Guidance has been unreliable; FY28 depends on Zone IV', p: `FY25 EBITDA guidance started at ~₹1,700 cr and ended at ₹997 cr. Zone IV (₹1,600-1,800 cr, originally due FY25-26) is now commissioning in phases with a two-quarter delay, and none of the new projects has take-or-pay contracts. Q1FY27's record ₹382 cr EBITDA included ₹50-60 cr of inventory and currency gains.` },
    { h: 'Valuation: fair, not cheap', p: `At ₹${n1(price)} the stock trades at ${n1(F.evEbitda[1])}x our FY28E EV/EBITDA and ${n1(price / F.eps[1])}x FY28E EPS, ${Math.abs(Math.round(fromHigh))}% below its 52-week high. Our 12x Sep-28E multiple sits below its ~${Math.round(fwdEvMed23)}x forward median since 2023 because the whole sector has de-rated ~${Math.abs(Math.round(derEvMed))}% and Aarti's returns are below its cost of capital. Upside needs EBITDA delivery, not a re-rating.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'RED' },
    { k: 'Earnings momentum', v: 'AMBER' },
    { k: 'Balance sheet', v: 'RED' },
    { k: 'Valuation', v: 'AMBER' },
  ],
  catalysts: [
    'Q2FY27 results (late Oct / early Nov-2026): do volumes recover, and how much of Q1\'s inventory gain reverses as crude-linked prices ease?',
    'Zone IV: commissioning of the five chemistry blocks in H2FY27 and customer re-qualification of commercial batches.',
    'Fuel additives: utilisation of the 360 kT capacity, reopening of the Middle East, and the winter dip in gasoline cracks.',
    'Net debt: management\'s internal target to cut net debt in FY27; CRISIL (AA/Negative) downgrade trigger at gross debt/EBITDA above 3.6x.',
    'Management transition: Suyog Kotecha as MD from 1-Oct-2026, promoter executives move to non-executive roles.',
  ],
};

// ------------------------------------------------------------------ story in charts
const guidChart = { x: ['FY24', 'FY25', 'FY28'], guided: [1375, 1700, guidLow], actual: [A.ebitda[ai('FY24')], A.ebitda[ai('FY25')], F.ebitda[1]] };
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: 'Fuel additives (energy) went from 15% to 43% of revenue', unit: 'Energy as % of company revenue', x: ['FY23', 'FY25', 'Q1FY26', 'Q2FY26', 'Q3FY26', 'Q4FY26', 'FY26', 'Q1FY27'], series: [{ name: 'Energy share', values: [15, emBy('FY25').energy, emBy('Q1FY26').energy, emBy('Q2FY26').energy, emBy('Q3FY26').energy, emBy('Q4FY26').energy, emBy('FY26').energy, emBy('Q1FY27').energy], fmt: 'pct0' }], labels: 'all', source: 'CRISIL (FY23), company presentations' },
      { type: 'column', title: 'MMA output up 10x in four years', unit: 'Fuel-additive (MMA) production (kT)', x: VOL.periods, series: [{ name: 'MMA', values: VOL.MMA, fmt: 'num' }], labels: 'all', source: 'AGM presentation (21-Sep-2026)' },
    ] },
    { pair: [
      { type: 'column', title: `₹${n0(capex21_26)} cr of capex in six years; EBITDA barely moved`, unit: '₹ crore', x: 'A.labels', from: 'FY21', series: [{ name: 'Capex', ref: 'A.capex', fmt: 'num' }, { name: 'EBITDA', ref: 'A.ebitda', fmt: 'num' }], labels: 'none', source: 'Screener.in (consolidated)' },
      { type: 'line', title: 'Net debt / EBITDA: 1.6x (FY19) to 3.6x (FY26)', unit: 'Net debt ÷ EBITDA (x)', x: A.labels.slice(ai('FY19')), series: [{ name: 'Net debt / EBITDA', values: ndE.slice(ai('FY19')), fmt: 'x' }], labels: 'all', min: 0, lines: [{ v: 2.5, text: 'Company target: <2.5x' }], source: 'Screener.in; company target' },
    ] },
    { pair: [
      { type: 'column', title: 'EBITDA guidance vs delivery (FY28: our estimate)', unit: 'EBITDA (₹ crore)', x: guidChart.x, series: [{ name: 'First guidance (low end)', values: guidChart.guided, fmt: 'num' }, { name: 'Actual / GAM FY28E', values: guidChart.actual, fmt: 'num' }], labels: 'all', source: 'Earnings calls Nov-2022 to Jul-2026; FY24 = 25% CAGR from ~₹1,100 cr' },
      { type: 'line', title: 'Gross margin: 42% → 37% as China set prices', unit: 'Gross margin (%)', x: ['FY23', 'FY24', 'FY25', 'FY26'], series: [{ name: 'Gross margin', values: SA.filter(a => ['FY23', 'FY24', 'FY25', 'FY26'].includes(a.fy)).map(a => a.grossMarginPct), fmt: 'pct0' }], labels: 'all', min: 30, max: 45, source: 'India Ratings (FY23-25), CRISIL (FY26)' },
    ] },
    { pair: [
      { type: 'line', title: `Forward EV/EBITDA: ~${Math.round(fwdEvMed23)}x median since 2023, ${n1(fwdEvNow)}x now`, unit: 'EV ÷ next full-year EBITDA (x)', x: fwdEv.map(x => x[0]), series: [{ name: 'Forward EV/EBITDA', values: fwdEv.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: fwdEvMed23, text: `Median since Apr-2023: ${n1(fwdEvMed23)}x` }, { v: 12, text: 'Our target: 12x', color: '#cf8f1f' }], source: 'Screener.in prices; reported EBITDA and net debt; GAM estimates FY27-28E' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street', unit: `₹ per share; CMP ₹${n1(price)}`, x: ['ICICI Direct (Aug)', 'Axis Direct (May)', 'PL (Jul)', 'HDFC Sec (Jun)', 'GAM (base)'], series: [{ name: 'Target', values: [565, 530, 526, 450, V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes standing on 30-Sep-2026; GAM Research' },
    ] },
  ],
};

// ------------------------------------------------------------------ business
const chains = [
  ['**Nitrochlorobenzenes (NCB)**', '108', VOL.NCB.at(-1), C.volumes.utilisationFY26Pct.NCB, 'Pharma (paracetamol via PNCB), dyes, agro', 'Margins recovered after China removed export VAT rebates (Apr-2026)'],
  ['**Dichlorobenzenes (DCB)**', '120 → 140', VOL.DCB.at(-1), C.volumes.utilisationFY26Pct.DCB, 'Polymers (PDCB for EV-linked PPS), agro, pharma', 'Claims #1 globally; debottlenecking to 140 kT'],
  ['**Hydrogenation (chloroanilines etc.)**', '60', VOL.Hydrogenation.at(-1), C.volumes.utilisationFY26Pct.Hydrogenation, 'Agro, dyes, pigments', '"Always had decent margins" (CEO)'],
  ['**Phenylenediamines (PDA)**', '12', VOL.PDA.at(-1), C.volumes.utilisationFY26Pct.PDA, 'Aramid fibres, polymers (US exports)', '"Structurally weak because of our technological disadvantage" (CEO); US tariffs, China'],
  ['**Nitrotoluenes (NT)**', '45', VOL.NT.at(-1), C.volumes.utilisationFY26Pct.NT, 'Agro, dyes', 'Margins suppressed by an isomer imbalance for 2-3 years'],
  ['**Ethylation (MEA/DEA)**', '25-30', VOL.Ethylation.at(-1), C.volumes.utilisationFY26Pct.Ethylation, 'Agro (herbicide intermediates)', 'Ethylene cost passed through under contracts; PEDA downstream plant'],
  ['**Fuel additives (MMA)**', '290 → 360', VOL.MMA.at(-1), C.volumes.utilisationFY26Pct.MMA, 'Gasoline octane booster (refiners, blenders)', '94% exported; Middle East shut in Q1FY27'],
];
const business = {
  id: 'business', nav: 'What it does', kicker: 'The business', title: 'What Aarti does: turns benzene and toluene into 100+ intermediates, and sells an octane booster',
  blocks: [
    { p: 'Aarti Industries was founded in 1984 by first-generation technocrats of the Gogri family. It buys benzene (from Indian refiners), toluene, chlorine, nitric acid and sulphur, and runs them through chlorination, nitration, hydrogenation and ethylation to make more than 100 intermediates. These go into agrochemicals, pharmaceuticals (paracetamol starts from Aarti\'s PNCB), dyes and pigments, polymers and, since FY24, gasoline: the fuel-additive (energy) business makes MMA (monomethyl aniline) from imported aniline and sells it to refiners and blenders as an octane booster. It has 16 plants in Gujarat and Maharashtra, 5,800+ employees and 1,100+ customers in 60+ countries; no customer is 10% of revenue. The pharma business was demerged into Aarti Pharmalabs in 2022.' },
    { p: '**A note on numbers.** Aarti\'s presentations quote revenue *including* GST: ₹9,018 cr for FY26 and ₹2,627 cr for Q1FY27. The audited net figures, used throughout this report and in our model, are ₹8,286 cr and ₹2,387 cr. The company reports a single business segment; end-use shares and volumes come from its presentations.' },
    { exhibit: { type: 'table', title: 'Value chains: capacity, FY26 output and what they serve', head: ['Value chain', 'Capacity (kTPA)', 'FY26 output (kT)', 'FY26 use', 'End markets', 'Note'], wide: [4, 5], rows: chains.map(r => [r[0], r[1], n1(r[2]), r[3] + '%', r[4], r[5]]), source: 'AGM presentation (21-Sep-2026), Q1FY27 presentation and call; DCB/MMA arrows = expansion' } },
    { pair: [
      { type: 'stacked', title: 'Revenue by end use: energy up, others steady', unit: '% of company revenue', x: ['FY25', 'Q1FY26', 'Q2FY26', 'Q3FY26', 'Q4FY26', 'FY26', 'Q1FY27'], series: [
        { name: 'Energy', values: ['FY25', 'Q1FY26', 'Q2FY26', 'Q3FY26', 'Q4FY26', 'FY26', 'Q1FY27'].map(p => emBy(p).energy), fmt: 'pct0' },
        { name: 'Agro & fertilisers', values: ['FY25', 'Q1FY26', 'Q2FY26', 'Q3FY26', 'Q4FY26', 'FY26', 'Q1FY27'].map(p => emBy(p).agro), fmt: 'pct0' },
        { name: 'Polymers', values: ['FY25', 'Q1FY26', 'Q2FY26', 'Q3FY26', 'Q4FY26', 'FY26', 'Q1FY27'].map(p => emBy(p).polymers), fmt: 'pct0' },
        { name: 'Dyes, pharma & others', values: ['FY25', 'Q1FY26', 'Q2FY26', 'Q3FY26', 'Q4FY26', 'FY26', 'Q1FY27'].map(p => emBy(p).dyes + emBy(p).pharma + emBy(p).others), fmt: 'pct0' },
      ], minLabel: 6, source: SRC_PPT },
      { type: 'hbar', title: 'Where it sells: North America and Europe up, Middle East down', unit: 'FY26 revenue by region (%)', x: Object.keys(C.geography.regionFY26), series: [{ name: 'FY26', values: Object.values(C.geography.regionFY26), fmt: 'pct0' }, { name: 'FY25', values: Object.keys(C.geography.regionFY26).map(k => C.geography.regionFY25[k]), fmt: 'pct0' }], labels: 'all', source: 'Annual reports FY25, FY26' },
    ] },
    { callout: '**So what:** Aarti is two businesses. The **non-energy chemistry** (~57-62% of revenue) is a scale business in mature benzene chains where Chinese supply sets the price; the **energy business** is a fast-grown, export-led product whose demand swings with gasoline refining margins. Neither has much pricing power, which is why returns have fallen even as volumes doubled.' },
  ],
};

// ------------------------------------------------------------------ history
const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'From one NCB plant (1986) to a ₹8,300 cr chemicals group, via contracts, a demerger and a capex binge',
  blocks: [
    { exhibit: { type: 'table', title: 'Key events and what they did to the numbers', head: ['When', 'Event', 'Impact'], wide: [1, 2], rows: [
      ['1984-95', 'Founded as Aarti Organic (1984); first NCB plant (1986); listed on BSE (1992) and NSE (1995)', 'Built the benzene-chain base in Vapi and Jhagadia'],
      ['FY18-FY19', 'Two large multi-year supply contracts with global majors, then a third; ₹750 cr QIP', 'Promised ~₹10,000 cr of contracted revenue; funded new blocks'],
      ['Jun-2020', 'Customer cancels the 10-year dicamba-intermediate contract; $120 mn compensation', '₹631 cr booked in FY22 revenue and EBITDA; the ~₹500 cr plant has been underused since'],
      ['FY22', '1:1 bonus; ₹1,200 cr QIP at ₹855 a share', 'Share count to 36.3 cr; peak profit year (₹1,186 cr, inflated by the termination fee)'],
      ['Oct-2022', 'Pharma business demerged into Aarti Pharmalabs (record date 20-Oct-2022; appointed date 1-Jul-2021)', '>₹1,200 cr of gross block left; FY22 and earlier numbers include pharma'],
      ['Apr-2023', '20-year nitric-acid supply deal with Deepak Fertilisers', 'Avoided a captive plant'],
      ['Dec-23 / Jan-24', '9-year ₹3,000 cr+ herbicide-intermediate contract; 4-year ₹6,000 cr+ fuel-additive contract', 'Launched the MMA scale-up: energy from ~15% to 43% of revenue'],
      ['Aug-2024', 'FY25 EBITDA guidance (₹1,450-1,700 cr) withdrawn; Nov-2024: FY28 target ₹1,800-2,200 cr', 'Stock fell from ~₹750 to ~₹400 by Dec-2024'],
      ['Sep-25 / Feb-26', 'CRISIL and India Ratings move outlooks to Negative', 'Deleveraging delayed 12-15 months (India Ratings)'],
      ['Mar-2026', 'Backward-integration amendment (residual 15 years, ₹200-250 cr capex) and a $150 mn agro supply contract to Mar-2030', 'Adds fixed margin from Sep-Oct 2027; agro volumes from FY27'],
      ['Jul-Sep 2026', 'Fuel-additive capacity 360 kT; record Q1FY27; AGM resolutions to make CEO Suyog Kotecha MD from 1-Oct-2026 and move Gogri executives to non-executive roles', 'First professional MD in the company\'s history'],
    ], source: 'Annual reports, earnings calls 2022-26, rating rationales' } },
    { callout: `**Corporate actions:** 1:1 bonus and a ₹1,200 cr QIP in FY22, a ₹750 cr QIP in FY19, a buyback in FY17-18, and the 2022 pharma demerger. Dividends have been cut from ₹3.50 a share (FY22) to ₹1 (FY25, FY26) as debt rose. **Read FY22 with care:** it includes the ₹631 cr termination fee and the pharma business; the company's restated chemicals-only FY22 EBITDA was ₹919 cr, so we start most comparisons in FY23.` },
  ],
};

// ------------------------------------------------------------------ industry
const ind = D.industry;
const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Industry: Chinese overcapacity set the price for three years; policy has started to help',
  blocks: [
    { p: `India's chemical industry is estimated at USD 155-165 bn and expected to reach USD 230-255 bn by 2030 (~8-9% a year), against 3-4% global growth (Aarti's FY26 annual report, citing industry sources). The opportunity is real: global customers want suppliers outside China, and India is the obvious alternative. But since 2022 Chinese capacity additions have flooded commodity and intermediate chemicals, and prices, not demand, have been the problem. Aarti's gross margin fell from 42% in FY23 to 34% in 9MFY26 against a ~45% decadal average (India Ratings), and its blended realisations fell 25% in FY26 even as volumes rose 39% (CRISIL).` },
    { exhibit: { type: 'table', title: 'Forces acting on Aarti\'s markets, 2025-26', head: ['When', 'What happened', 'Direction'], wide: [1], rows: [
      ...ind.timeline.map(t => [t.when, t.what, t.dir]),
      ['2023-26', 'Capacity rationalisation in Europe and North-East Asia; slower Chinese additions (CEO: margins could restructure "post 28, 29")', 'Tailwind (later)'],
    ], source: 'AGM presentation (21-Sep-2026), India Ratings (Feb-2026), Q1FY27 call' } },
    { pair: [
      { type: 'hbar', title: 'Specialty chemicals de-rated ~30% from their post-2023 medians', unit: `Trailing EV/EBITDA on ${ASOF_TXT} vs median since Apr-2023 (%)`, x: derate.filter(p => p.evVs != null).sort((a, b) => a.evVs - b.evVs).map(p => shortName(p.name)), series: [{ name: 'vs median', values: derate.filter(p => p.evVs != null).sort((a, b) => a.evVs - b.evVs).map(p => Math.round(p.evVs)), fmt: 'pct0' }], labels: 'all', highlight: 'Aarti', source: 'Screener.in (multiples scaled to the NSE close)' },
      { type: 'column', title: 'Aarti\'s US-bound products faced a 50% tariff for six months', unit: 'Share of Aarti revenue (%)', x: ['US (FY25)', 'of which exempt', 'Middle East (FY25)', 'Middle East (Q1FY27)'], series: [{ name: 'Share', values: [18, 9, 23, 2], fmt: 'pct0' }], labels: 'all', source: 'India Ratings (US share; "about half" exempt), annual reports, Q1FY27 call' },
    ] },
    { callout: '**So what:** the industry backdrop improved in 2026 (US tariff cut to ~18%, China\'s anti-involution and export-VAT changes, EU FTA), but it was the West Asia conflict that lifted Aarti\'s Q1 prices, and that is not a durable tailwind. Margins across Indian specialty chemicals are still below their pre-2022 levels, and the sector trades well below its old multiples.' },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Tailwind test: volumes, yes; margins and returns, not yet',
  blocks: [
    { verdicts: [
      ['"China+1": customers diversifying away from China', 'Partly', `Repeat long-term contract from a global major (Mar-2026), $150 mn agro contract, no customer >10%; but gross margin 42% → 34% as Chinese prices kept falling.`, 'Aarti wins volume, not price.'],
      ['Indian specialty-chemicals growth (~8-9% a year)', 'Yes', `Net revenue +${Math.round((Math.pow(A.sales[ai('FY26')] / A.sales[ai('FY23')], 1 / 3) - 1) * 100)}% a year FY23-26; volumes +39% in FY26.`, 'Growth is there; it came at lower realisations.'],
      ['Fuel-additive demand (gasoline cracks)', 'Yes', 'MMA 123 kT → 238 kT in FY26; capacity 360 kT; cracks $15-18/bbl in Q1FY27.', 'Captured, but cyclical and seasonal.'],
      ['China anti-involution / VAT rebate removal', 'Partly', 'NCB chain margins "recovered" in Q1FY27; PDA and fluoro products still under pressure.', 'Helps one chain so far.'],
      ['India-US trade deal (tariff ~18%)', 'Partly', 'US was ~18% of FY25 sales; PDA volumes hit by the 50% tariff; US shipments resumed in Q3-Q4FY26.', 'Removes a headwind rather than adding a tailwind.'],
      ['Specialty / higher-value chemistry (Zone IV, CDMO)', 'No', 'Zone IV commissioning in phases, ~1.5-2 years behind the original plan; 5-10 products this year, 25-30 by FY28; no take-or-pay contracts.', 'Not yet in the numbers.'],
    ], head: ['Industry tailwind', 'Captured?', 'Evidence', 'So what'], title: 'Tailwind test', source: SRC },
  ],
};

// ------------------------------------------------------------------ value chains (non-energy)
const volQ = SQ.filter(q => q.ncb != null);
const chainsCh = {
  id: 'chains', nav: 'Non-energy value chains', kicker: 'Value chains', title: 'Non-energy chemistry: volumes up 15-70% since FY23, but each chain has its own problem',
  blocks: [
    { p: `The non-energy business is Aarti's core: NCB, DCB, hydrogenation, PDA, nitrotoluene, ethylation and sulphuric-acid derivatives, sold to agro (18% of revenue), polymers (11-14%), dyes and pigments (11-15%) and pharma (10-14%). Volumes have grown well: FY26 output of NCB was ${n1(VOL.NCB.at(-1))} kT (+${Math.round((VOL.NCB.at(-1) / VOL.NCB[1] - 1) * 100)}% vs FY23), DCB ${n1(VOL.DCB.at(-1))} kT (+${Math.round((VOL.DCB.at(-1) / VOL.DCB[1] - 1) * 100)}%), NT ${n1(VOL.NT.at(-1))} kT (+${Math.round((VOL.NT.at(-1) / VOL.NT[1] - 1) * 100)}%) and ethylation ${n1(VOL.Ethylation.at(-1))} kT (+${Math.round((VOL.Ethylation.at(-1) / VOL.Ethylation[1] - 1) * 100)}%). Most chains ran at 80-86% of capacity in FY26. The problem is margin: management concedes agro margins "remain under pressure", PDA is structurally weak because of a technology disadvantage, and NT margins have been depressed by an isomer imbalance. The bright spot is NCB, where China's removal of export VAT rebates (Apr-2026) lifted prices and margins.` },
    { pair: [
      { type: 'line', title: 'Production by chain: steady volume growth', unit: 'Production (kT)', x: VOL.periods, series: [{ name: 'NCB', values: VOL.NCB, fmt: 'num' }, { name: 'DCB', values: VOL.DCB, fmt: 'num' }, { name: 'Hydrogenation', values: VOL.Hydrogenation, fmt: 'num' }, { name: 'NT', values: VOL.NT, fmt: 'num' }], labels: 'last', source: 'AGM presentation (21-Sep-2026)' },
      { type: 'hbar', title: 'FY26 capacity use: 80-86% except PDA', unit: 'Utilisation, FY26 (%)', x: Object.keys(C.volumes.utilisationFY26Pct), series: [{ name: 'Utilisation', values: Object.values(C.volumes.utilisationFY26Pct), fmt: 'pct0' }], labels: 'all', highlight: 'PDA', source: 'Q4FY26 presentation' },
    ] },
    { pair: [
      { type: 'column', title: 'Quarterly DCB and NCB output: DCB at a record in Q4FY26', unit: 'Production (kT)', x: volQ.map(q => q.q), series: [{ name: 'DCB', values: volQ.map(q => q.dcb), fmt: 'n1' }, { name: 'NCB', values: volQ.map(q => q.ncb), fmt: 'n1' }], labels: 'none', source: 'Q3FY26 and Q4FY26 presentations (not disclosed from Q1FY27)' },
      { type: 'column', title: 'Non-energy volumes: +9-12% YoY for three quarters', unit: 'Non-energy volume growth, YoY (%)', x: ['Q3FY26', 'Q4FY26', 'Q1FY27'], series: [{ name: 'Non-energy', values: [11, 9, 12], fmt: 'pct0' }], labels: 'all', source: SRC_PPT },
    ] },
    { exhibit: { type: 'table', title: 'End markets: what management said in Jul-2026', head: ['End use', 'Share Q1FY27', 'Domestic / export', 'Comment'], wide: [3], rows: [
      ['Agrochemicals & fertilisers', '18%', '58% / 42%', 'Volumes marginally lower as customers resisted high prices; "margin and pricing pressure remains persistent in select products"; $150 mn contract volumes from FY27'],
      ['Dyes, pigments & inks', '15%', '67% / 33%', 'Share up on higher realisations of specialised products; demand soft in a high-price environment'],
      ['Pharmaceuticals', '14%', 'mainly domestic', 'Stable demand; share up on price hikes in PNCB (China VAT removal); NCB debottlenecking possible within existing assets'],
      ['Polymers & additives', '11%', '61% / 39%', 'Soft Q1 after bulk US shipments in Q4; PDCB demand strong (EV, automotive); MPDA (PDA chain) hit by Chinese competition'],
    ], source: 'Q1FY27 presentation (30-Jul-2026) and call (31-Jul-2026)' } },
    { callout: '**Our read:** this is a well-run volume business with good assets and customer access, but it is a price-taker. A recovery to the old 20%+ margins needs Chinese discipline to last; we assume only a gradual margin improvement (EBITDA margin 14.3% → 15.5% over FY27-29E for the whole company).' },
  ],
};

// ------------------------------------------------------------------ energy
const qE = SQ.filter(q => q.energyPct != null);
const energy = {
  id: 'energy', nav: 'Energy (fuel additives)', kicker: 'Fuel additives', title: 'The energy business: 43% of revenue, a commodity spread and a single region shut',
  blocks: [
    { p: `Aarti's "energy" business sells MMA (monomethyl aniline), an octane booster that refiners and blenders add to gasoline at under 1-2%. It is not methyl methacrylate and not fuel trading. Aarti makes MMA from imported aniline (mostly from China), so its spread depends on aniline prices on one side and the gasoline-naphtha crack (how much more gasoline is worth than naphtha) on the other. The business was ~15% of revenue in FY22-23; a 4-year ₹6,000 cr+ contract (Jan-2024) with a multinational conglomerate turned it into the growth engine: production rose from 37.8 kT (FY23) to 237.6 kT (FY26), energy revenue rose 36% to ₹${n0(C.endUseMix.energyRevenueNetFY26.value)} cr in FY26 (CRISIL), and capacity reached 360 kT in Jul-2026.` },
    { pair: [
      { type: 'column', title: 'Quarterly MMA output: doubled in FY26', unit: 'MMA production (kT)', x: SQ.filter(q => q.mma != null).map(q => q.q), series: [{ name: 'MMA', values: SQ.filter(q => q.mma != null).map(q => q.mma), fmt: 'n1' }], labels: 'all', source: 'Presentations; Q1-Q2FY25 from the Nov-2024 call (not disclosed from Q1FY27)' },
      { type: 'column', title: 'Energy volumes still +57% YoY in Q1FY27, but −17% QoQ', unit: 'Energy volume growth, YoY (%)', x: ['Q3FY26', 'Q4FY26', 'Q1FY27'], series: [{ name: 'Energy', values: [78, 98, 57], fmt: 'pct0' }], labels: 'all', source: SRC_PPT },
    ] },
    { exhibit: { type: 'table', title: 'Fuel-additive economics: what drives it', head: ['Driver', 'Evidence', 'Effect'], wide: [1, 2], rows: [
      ['Gasoline-naphtha crack', '$15-18/bbl in Q1FY27 ("healthy"); it went negative on some days in Mar-Apr 2026', 'Sets refiners\' willingness to pay; volumes fall when cracks fall'],
      ['Aniline (raw material)', 'Imported, 1-1.5 months of stock; mostly from China', 'Inventory gains or losses when prices move sharply'],
      ['Seasonality', 'Cracks and demand typically weaken from late October to December', 'H2 volumes and spreads softer'],
      ['Geography', 'Middle East fell from ~15% of company revenue to 2% in Q1FY27; volumes redirected to the US, Europe, Africa (US voyages 2-3 months)', 'Working capital and revenue-recognition lags up'],
      ['Competition', '"More than two or three" Indian and Chinese players; Aarti claims leadership and top-decile cost', 'Limits spreads; Aarti is broadening to a 3-5 product basket'],
      ['Contract', '4-year ₹6,000 cr+ contract (Jan-2024), target volumes met in CY2025; margin guided at 15-17% at constant prices', 'Ends around CY2027-28: renewal risk'],
    ], source: 'Q4FY26 and Q1FY27 calls; Feb-2024 call; CRISIL (Sep-2026)' } },
    { pair: [
      { type: 'column', title: 'Energy share of revenue, quarter by quarter', unit: 'Energy as % of company revenue', x: qE.map(q => q.q), series: [{ name: 'Energy share', values: qE.map(q => q.energyPct), fmt: 'pct0' }], labels: 'all', source: SRC_PPT },
      { type: 'hbar', title: 'Capacity: 200 kT to 360 kT in two years', unit: 'Fuel-additive capacity (kTPA)', x: ['FY25', 'FY26', 'Jul-2026'], series: [{ name: 'Capacity', values: [200, 290, 360], fmt: 'num' }], labels: 'all', source: 'Annual reports, Q1FY27 presentation' },
    ] },
    { callout: '**Our view:** the energy business has been well executed: Aarti found a large niche and filled it fast. But it is a spread business tied to refining margins, with no disclosed margin, a single large contract, new competitors and a seasonal winter. We assume energy volumes fill most of the 360 kT capacity by FY28, at broadly flat spreads; management itself expects energy to fall back to 30-40% of revenue as Zone IV grows.' },
  ],
};

// ------------------------------------------------------------------ projects & guidance record
const projects = {
  id: 'projects', nav: 'Projects & guidance record', kicker: 'Growth projects', title: 'FY28 target of ₹1,800-2,200 cr EBITDA rests on projects that have slipped before',
  blocks: [
    { p: `Management's FY28 bridge (from FY25 EBITDA of ~₹1,016 cr) adds ₹150-200 cr of cost savings (largely done), ₹350-550 cr from volume and margin ramp-up of existing assets (MMA, DCB, NCB, ethylation, NT) and ₹300-450 cr from new capex (Zone IV, MPP, PEDA, the Augene JV). The first two look achievable; the third depends on Zone IV, which is late. Zone IV is a ₹1,600-1,800 cr greenfield site at Jhagadia designed around chlorotoluene and now built as five flexible chemistry blocks plus a multipurpose plant. In Jul-2026, 97% of equipment was erected and 85% of piping done; the CEO said the delay "might lead to a bit slower ramp-up compared to our original anticipation".` },
    { exhibit: { type: 'table', title: 'Projects: first promised vs status in Sep-2026', head: ['Project', 'First promised', 'Status (Jul-Sep 2026)', 'Slippage'], wide: [2], rows: [
      ['Zone IV chlorotoluene / chemistry blocks (₹1,600-1,800 cr)', 'Commissioning FY25, volume FY26 (May-2023)', 'Commissioning in phases in FY27; ramp-up FY28-29', '~1.5-2 years'],
      ['Multipurpose plant (MPP), Zone IV', 'FY25 (Feb-2023)', 'First product expected Aug-2026', '~1.5 years'],
      ['PEDA (4,000 TPA), Zone IV', 'Q4FY26 (Nov-2025)', 'Market seeding; "commercialised soon"', '~2 quarters'],
      ['Calcium chloride, Zone IV', 'Q3FY26 (May-2025)', 'Commercialised', '~1 quarter'],
      ['Fuel additives 200 → 360 kT', '360 kT by Q4FY26 (Feb-2026)', 'Completed Jul-2026', 'On time / faster'],
      ['Ethylation 3x, NT 30 → 45 kT', 'H1FY25 (Nov-2022)', 'Commissioned Q3FY25', '~1-2 quarters'],
      ['Augene JV (amines, 50:50)', 'Supplies from Q1FY27 (Aug-2024)', 'Commissioning Q2FY27; revenue ₹300-400 cr in 1-2 years', 'Small'],
      ['Re Aarti plastic recycling JV', 'Early FY27 (Aug-2025)', 'H2FY27 (labour constraints)', '~2-3 quarters'],
      ['Backward-integration project (₹200-250 cr)', 'Signed Mar-2026', 'Civil work; commissioning Sep-Oct 2027', 'New'],
    ], source: 'Earnings calls and presentations, Nov-2022 to Jul-2026 (see research/sources/calls-history.json)' } },
    { exhibit: { type: 'table', title: 'EBITDA guidance track record (₹ crore)', head: ['Year', 'First guidance', 'Last word before results', 'Actual', 'vs first'], wide: [1, 2], rows: C.guidance.trackRecord.map(t => [t.year, t.first, t.last, t.actual != null ? n0(t.actual) : (t.year === 'FY28' ? `GAM FY28E: ${n0(F.ebitda[1])}` : '–'), t.missVsFirstPct != null ? `${t.missVsFirstPct}%` : (t.year === 'FY28' ? pc((F.ebitda[1] / guidLow - 1) * 100) + ' vs low end' : '–')]), source: 'Earnings calls Nov-2022 to Jul-2026; actuals from Screener (company: FY24 ₹984 cr, FY25 ₹1,016 cr)' } },
    { exhibit: { type: 'table', title: 'Management\'s FY28 EBITDA bridge vs our FY28E', head: ['Building block', 'Management (₹ cr)', 'Our view'], wide: [2], rows: [
      ['FY25 base (company EBITDA)', '1,016', 'Reported'],
      ['Cost optimisation', '150-200', 'Mostly done ("~₹100 cr of fixed and variable cost improvements" in FY26)'],
      ['Volume and margin ramp-up of existing assets', '350-550', 'Largely visible: FY26 +₹156 cr; MMA 360 kT, DCB 140 kT, $150 mn agro contract still to come'],
      ['Capex-led growth (Zone IV, MPP, PEDA, Augene)', '300-450', 'Delayed by ~2 quarters; we include ~a third of it in FY28E'],
      { hl: true, cells: ['**FY28 EBITDA**', `**${n0(guidLow)}-${n0(guidHigh)}**`, `**GAM ${n0(F.ebitda[1])} (FY29E ${n0(F.ebitda[2])})**`] },
    ], source: 'Q1FY27 presentation (bridge), AGM presentation; GAM Research' } },
    { callout: `**Honest verdict:** Aarti's management has been consistently optimistic. The FY25 target fell from ~₹1,700 cr to ₹997 cr; FY24 from an implied ~₹1,375 cr to ₹978 cr. Annual guidance was dropped in 2025. The FY28 target was reaffirmed in Jul-2026 even as Zone IV slipped two quarters. We give management credit for what is in its control (volumes, costs) and haircut what is not (new chemistry, prices): our FY28E EBITDA is ₹${n0(F.ebitda[1])} cr, ${Math.abs(Math.round((F.ebitda[1] / guidLow - 1) * 100))}% below the low end.` },
  ],
};

// ------------------------------------------------------------------ moat
const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: scale and customer access, but no pricing power',
  blocks: [
    { verdicts: D.moat.map(m => [m.dimension, m.verdict, m.evidence, { Advantage: 'Real and hard to copy', Parity: 'Competitive, not decisive', Disadvantage: 'A drag on returns' }[m.verdict]]), head: ['Dimension', 'Verdict', 'Evidence', 'So what'], title: 'Moat scorecard', source: 'GAM research compilation (filings, calls, rating rationales to Sep-2026)' },
    { callout: '**Honest verdict:** Aarti has a **scale and integration advantage** in benzene chemistry (largest Indian producer, global top-3/top-4 positions) and **sticky customer relationships** (long-term contracts, a repeat contract from a global major, no customer above 10%). That is a real moat for *winning volume*. It is **not** a moat for *earning returns*: Chinese producers set the price in most of its chains, the energy business is a spread business, and ROCE has been ~7% for three years. A moat that does not show up in returns deserves a market multiple, not a premium.' },
  ],
};

// ------------------------------------------------------------------ earnings quality
const AC = C.accounting;
const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: clean audit, but tax credits, inventory gains and FX make profit noisy',
  blocks: [
    { bullets: [
      '**Gross vs net revenue.** The headline ₹9,018 cr FY26 revenue includes ₹732 cr of GST; the audited net figure is ₹8,286 cr. Margins quoted by the company on the gross figure (13.0%) look lower than on the net (14.1%).',
      '**Tax credits.** FY26 profit benefited from a tax *credit* (effective rate −15%): tax depreciation on new plants wiped out normal tax, MAT paid (₹64 cr) was booked as a MAT-credit asset, and deferred-tax assets on tax losses (₹324 cr) exceeded the deferred-tax liability (₹270 cr). Management guides 9-15% while Zone IV tax depreciation lasts; at a normal ~25% rate FY26 profit would have been ~₹270 cr, not ₹419 cr.',
      '**Inventory and currency gains.** Q1FY27 EBITDA of ₹382 cr included ₹50-60 cr of inventory and FX gains (CEO, CRISIL). FX on trade is in EBITDA; FX on loans is in finance cost (₹64 cr loss in FY26, incl. ₹39 cr in Q4). When crude-linked prices fall, these gains reverse.',
      '**Exceptional items.** FY26 included +₹28.5 cr of interest on tax refunds and −₹15.4 cr for the new labour codes.',
      '**Working capital.** Receivables rose from ₹786 cr to ₹1,403 cr in FY26 (longer US voyages, revenue on delivery), operating cash flow fell from ₹1,238 cr to ₹781 cr, and ₹246 cr of supplier-finance arrangements sit inside payables. Working capital rose again in Q1FY27.',
      '**Contract income.** Shortfall fees from customers (₹24 cr FY26, ₹72 cr FY25) are booked as operating revenue; FY22 included a ₹631 cr termination fee.',
      '**Related parties.** Sales to promoter-linked Valiant Organics ₹273 cr; transport services from Kalpesh Roadlines ₹170 cr (a related party from Apr-2025); CSR of ₹12 cr to promoter-linked trusts.',
    ] },
    { callout: `**Accounting flag: AMBER.** The audit by Gokhale & Sathe is unqualified, with revenue cut-off and inventory as key audit matters. We see no sign of manipulation, but reported profit is flattered by a below-normal tax rate and noisy with inventory and FX swings, and cash conversion weakened in FY26 (CFO/EBITDA ${Math.round(A.cfo[ai('FY26')] / ebitda26 * 100)}% vs ${Math.round(A.cfo[ai('FY25')] / A.ebitda[ai('FY25')] * 100)}% in FY25).` },
  ],
};

// ------------------------------------------------------------------ ownership additions
const OH = D.ownership;
const ownership = base => ({ ...base, blocks: [
  { p: `The Gogri-led promoter group owns ${OH.categoriesPct.promoter}% (Jun-2026) through ~50 family members, trusts and investment companies; no single holding exceeds 4.1% and nothing is pledged. The group's stake has drifted down from 43.5% (Dec-2023). Domestic institutions own ${OH.categoriesPct.dii}% (mutual funds ${OH.categoriesPct.mutualFunds}%, LIC 6.8%), foreign investors ${OH.categoriesPct.fii}% (down from 10.8% in Dec-2023), and ~${Math.round(OH.shareholders / 1000)},000 shareholders hold the rest.` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Named holders (Jun-2026)', head: ['Holder', 'Stake', 'Note'], wide: [2], rows: [
    ...OH.named.map(h => [h.name, n1(h.pct) + '%', '']),
    ['Largest promoter holdings', '', OH.promoterGroup.slice(0, 5).map(p => `${p.name} ${p.pct}%`).join('; ')],
    ['Promoter group (total)', OH.categoriesPct.promoter + '%', 'Nil pledged'],
    ['Foreign portfolio investors (total)', OH.categoriesPct.fii + '%', 'None at 1% or more'],
  ], source: 'BSE shareholding pattern via Screener.in (quarter to Jun-2026, the latest public on 30-Sep-2026)' } },
  { callout: '**Our read:** Indian institutions (LIC, ICICI Prudential, HDFC, Nippon) have been buyers through the downturn while foreign investors left. The promoter family is fragmented (no single holding above 4.1%), and from Oct-2026 executive control passes to a professional MD.' },
] });

// ------------------------------------------------------------------ governance
const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: a family company moving to professional management',
  blocks: [
    { exhibit: { type: 'table', title: 'Key people', head: ['Name', 'Role', 'Note'], wide: [2], rows: C.management.map(m => [m.name, m.role, m.note]), source: 'Annual report FY26 (27-Aug-2026), Q1FY27 disclosures' } },
    { verdicts: [
      ['Audit and accounts', 'Strong', 'Gokhale & Sathe; unqualified, no emphasis of matter; KAMs on revenue cut-off and inventory.', 'No red flags; tax and FX noise (see earnings quality).'],
      ['Board', 'Moderate', '14 directors, 7 independent (50%); three promoter executives to become non-executive from 1-Oct-2026.', 'Better balance, but the promoter family keeps three board seats plus the chairman emeritus.'],
      ['Management transition', 'Moderate', 'CEO Suyog Kotecha (joined Jun-2024, ex-Reliance and McKinsey) to become MD from 1-Oct-2026, subject to AGM approval (21-Sep-2026; vote not verified).', 'Positive for execution if the board gives him real authority.'],
      ['Guidance and disclosure', 'Weak', 'FY24-25 EBITDA guidance missed by 29-41%; product volumes removed from slides from Q1FY27 because the data were "getting utilized in a situation which was not favourable for the company".', 'Less disclosure just as the story gets harder to track.'],
      ['Capital allocation', 'Weak', `~₹${n0(capex21_26)} cr capex over FY21-26 vs ₹${n0(cfo21_26)} cr of operating cash flow; ROCE 22% (FY22) → 7%; dividends cut to ₹1.`, 'Growth has been bought with debt; returns have not followed yet.'],
      ['Related parties and pay', 'Moderate', 'Valiant Organics sales ₹273 cr; Kalpesh Roadlines ₹170 cr; FY26 pay: two promoter MDs ₹5.19 cr each (104x median), CEO ₹4.78 cr (152x incl. options).', 'Normal for an Indian family group; worth watching.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'GAM research compilation (annual report FY26, calls, rating rationales)' },
  ],
};

// ------------------------------------------------------------------ forecasts
const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: EBITDA up ~16% a year, but below the street and management',
  blocks: [
    { p: 'We forecast revenue as one line (Aarti reports one segment) with the EBITDA margin as a driver, and track energy / non-energy and value-chain volumes as KPIs. **FY27E:** revenue +18% (Q1 +43% on input-price pass-through; CRISIL expects >15%), margin 14.3% (Q1 16.0% included one-off gains; underlying ~14%). **FY28E:** revenue +8% (volumes +10-12%, prices easing), margin 15.0%. **FY29E:** +10%, 15.5%. Capex ₹750 / 350 / 300 cr; tax 14-18%; interest falls as debt is repaid. Every assumption is in the Excel model\'s Assumptions sheet, which recalculates this report\'s target price.' },
    { exhibit: { type: 'rows', title: 'P&L and cash flow summary (₹ crore)', from: 'FY23', rowsRef: [
      { name: 'Revenue (net of GST)', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' },
      { name: 'Depreciation', ref: 'fin.dep' },
      { name: 'Net profit', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n1' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Capex', ref: 'fin.capex' }, { name: 'Free cash flow', ref: 'fin.fcf' }, { name: 'ROE', ref: 'fin.roe', fmt: 'pct' },
    ], source: 'Company, GAM Research estimates' } },
    { exhibit: { type: 'table', title: 'Net debt path (₹ crore)', head: ['', 'FY23', 'FY24', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Net debt (borrowings less cash and investments)', ...['FY23', 'FY24', 'FY25', 'FY26'].map(l => n0(A.netDebt[ai(l)])), ...F.treasury.map(t => n0(-t))],
      ['Net debt / EBITDA (x)', ...['FY23', 'FY24', 'FY25', 'FY26'].map(l => n1(ndE[ai(l)])), ...F.treasury.map((t, i) => n1(-t / F.ebitda[i]))],
    ], source: 'Screener.in (history; company figure for FY26 is ~₹4,313 cr), GAM estimates' } },
    { exhibit: { type: 'table', title: 'GAM vs the street (estimates standing on 30-Sep-2026)', head: ['', 'GAM FY27E', 'Street FY27E', 'GAM FY28E', 'Street FY28E'], rows: [
      ['EPS (₹), Prabhudas Lilladher (31-Jul)', '{{F.eps.0|n1}}', '15.1', '{{F.eps.1|n1}}', '18.8'],
      ['EPS (₹), ICICI Direct (3-Aug)', '{{F.eps.0|n1}}', '14.3', '{{F.eps.1|n1}}', '21.4'],
      ['EBITDA (₹ cr), Prabhudas Lilladher', '{{F.ebitda.0|num}}', '1,443', '{{F.ebitda.1|num}}', '1,630'],
      ['EBITDA (₹ cr), ICICI Direct', '{{F.ebitda.0|num}}', '1,484', '{{F.ebitda.1|num}}', '1,779'],
      ['Revenue (₹ cr), PL / ICICI Direct', '{{F.sales.0|num}}', '9,878 / 9,688', '{{F.sales.1|num}}', '10,588 / 10,805'],
      ['EBITDA (₹ cr), management target', '–', '–', '{{F.ebitda.1|num}}', '1,800-2,200'],
    ], source: 'Broker notes (Jul-Aug 2026); company guidance. No consensus dated Jul-Sep 2026 was found.' } },
    { callout: `Our FY28E EBITDA (₹${n0(F.ebitda[1])} cr) is ${Math.round((1 - F.ebitda[1] / streetEbitda28.pl) * 100)}-${Math.round((1 - F.ebitda[1] / streetEbitda28.idir) * 100)}% below the two brokers and ${Math.round((1 - F.ebitda[1] / guidLow) * 100)}% below the low end of management's target; our FY28E EPS (₹${n1(F.eps[1])}) is ${Math.round((1 - F.eps[1] / streetFY28.pl) * 100)}-${Math.round((1 - F.eps[1] / streetFY28.idir) * 100)}% below, because we also assume more depreciation as Zone IV is capitalised and a gradual return of the tax rate. The gap is Zone IV timing and margins. We still forecast strong growth: EBITDA +${Math.round((Math.pow(F.ebitda[2] / ebitda26, 1 / 3) - 1) * 100)}% a year and EPS +${Math.round((Math.pow(F.eps[2] / A.eps[ai('FY26')], 1 / 3) - 1) * 100)}% a year over FY26-29E, with free cash flow turning positive from FY28E and net debt falling to ~₹${n0(-F.treasury[2])} cr by Mar-29E.` },
  ],
};

// ------------------------------------------------------------------ street
const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: 'The street: split on rating and on method; average target ~₹518',
  blocks: [
    { p: 'Four houses had calls standing on 30-Sep-2026: ICICI Direct BUY ₹565 (3-Aug, 14x FY28E EV/EBITDA), Axis Direct HOLD ₹530 (6-May), Prabhudas Lilladher ACCUMULATE ₹526 (31-Jul, 28x FY28E P/E) and HDFC Securities REDUCE ₹450 (Jun-2026; its post-Q1 target was not retrieved). The average is ~₹518, 9% above the 30-Sep price. The bulls see the end of a heavy capex cycle and EBITDA guidance becoming visible; the cautious see margin pressure and execution risk. Multiples were cut through 2025 (Emkay 30x → 25x P/E, PL 25x → 24x) and partly restored in 2026 (PL 28x, ICICI Direct 12x → 14x EV/EBITDA).' },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who'], wide: [0], rows: D.critiques.map(c => [c.point, c.who]), source: 'Broker notes, calls, rating rationales and filings to 30-Sep-2026' } },
  ],
};

// ------------------------------------------------------------------ valuation
const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: 'Valuation: 12x Sep-28E EV/EBITDA gives {{dcf.tp|inr}}',
  blocks: [
    ...streetBlocks('AARTIIND', {
      rating,
      streetIntro: 'The street is split. ICICI Direct values Aarti on **EV/EBITDA** (14x FY28E EBITDA); Prabhudas Lilladher on **P/E** (28x FY28E EPS); Emkay (2024-25) used P/E. We use **EV/EBITDA** as the primary method because three features of Aarti make P/E misleading: net debt is 3.6x EBITDA (EV/EBITDA charges for it, P/E only through interest); the tax rate is temporarily 9-15% because of tax depreciation on new plants; and depreciation on Zone IV, which is not yet earning, depresses EPS. Management and both rating agencies also frame the story in EBITDA and debt/EBITDA. We apply the multiple to Sep-28E (half FY28E, half FY29E) EBITDA and deduct net debt at the same date. P/E is our cross-check for the other half of the street.',
      street: [
        ['ICICI Direct (3-Aug)', 'Buy', 565, 'EV/EBITDA', '14x', 'FY28E EBITDA', 'End of heavy capex; energy momentum; FY28 guidance visible'],
        ['Axis Direct (6-May)', 'Hold', 530, 'n.d.', '–', '–', 'Downgraded from Buy after Q4FY26'],
        ['Prabhudas Lilladher (31-Jul)', 'Accumulate', 526, 'P/E', '28x', 'FY28E EPS', 'Projects support medium-term growth; near-term margin pressure'],
        ['HDFC Securities (8-Jun)', 'Reduce', 450, 'n.d.', '–', '–', 'Cautious on margins and execution'],
        ['ICICI Direct (6-Feb, superseded)', 'Buy', 515, 'EV/EBITDA', '12x', 'FY28E EBITDA', 'Macro and capex-led tailwinds'],
      ],
      ourThesis: 'Good assets, unreliable guidance, leverage; fair value close to the price',
      streetSource: 'Broker notes (Feb-Aug 2026) via Trendlyne; "At our EPS" applies P/E multiples to GAM FY28E EPS; n.d. = not disclosed in what we read',
      derivationIntro: 'We start from the stock\'s own one-year-forward EV/EBITDA since the 2022 pharma demerger, adjust for the sector\'s de-rating, and then ask whether Aarti\'s growth and returns justify more or less than that.',
      derivation: [
        ['1. Its own history', `One-year-forward EV/EBITDA: median ${n1(fwdEvMed23)}x since Apr-2023 (post-demerger); ${n1(fwdEvMed25)}x since Apr-2025; ${n1(fwdEvNow)}x on our FY28E today`, `Starting point: ~${Math.round(fwdEvMed23)}x`],
        ['2. Sector de-rating', `On ${ASOF_TXT} specialty-chemical peers traded ${Math.round(Math.max(...peerDer.map(p => p.evVs)))}% to ${Math.round(Math.min(...peerDer.map(p => p.evVs)))}% vs their post-2023 median EV/EBITDA (median ${Math.round(derEvMed)}%): ${peerDer.sort((a, b) => a.evVs - b.evVs).slice(0, 4).map(p => `${shortName(p.name)} ${Math.round(p.evVs)}%`).join(', ')}`, `${Math.round(fwdEvMed23)}x × ${n1(1 + derEvMed / 100)} ≈ ${n1(fwdEvMed23 * (1 + derEvMed / 100))}x`],
        ['3. Growth', `Our EBITDA CAGR FY26-29E is ~${Math.round((Math.pow(F.ebitda[2] / ebitda26, 1 / 3) - 1) * 100)}%, faster than most peers as new capacity ramps; but it is back-end loaded and depends on Zone IV`, 'Add ~1x: **12x**'],
        ['4. Returns', `ROCE ~7% (FY26) vs a cost of capital of ~11-12%; peers' median ROE ${n1(peerRoeMed)}% vs Aarti ${n1(self.roe)}%; peer median trailing EV/EBITDA ${n1(peerEvMed)}x`, 'No premium until returns exceed the cost of capital'],
        ['5. Cross-read', `ICICI Direct's 14x is on FY28E (a year earlier than our Sep-28E basis) and on EBITDA ${Math.round((streetEbitda28.idir / F.ebitda[1] - 1) * 100)}% above ours; our 12x on Sep-28E implies ${n1(12 * ebitdaSep28 / F.ebitda[1])}x our FY28E`, 'Consistent with a lower-conviction view on FY28'],
      ],
      derivationSource: `Screener.in (multiples to ${ASOF_TXT}), broker notes, GAM Research`,
      crossNote: `**What the cross-checks tell us.** P/E at 25x Sep-28E EPS of ₹${n1(epsSep28)} gives ₹${n0(mv('pe').value)}, ${Math.abs(mv('pe').vsTarget).toFixed(0)}% ${mv('pe').vsTarget >= 0 ? 'above' : 'below'} the target, even though EPS benefits from a 15-18% tax rate. The DCF (₹${n0(mv('dcf').value)}, ~11.6% WACC, 5.5% terminal growth) is ${Math.abs(mv('dcf').vsTarget).toFixed(0)}% lower: on our cash flows, with capex falling to ~5% of revenue, today's price already discounts most of the EBITDA recovery. All three methods cluster around the share price, which is why we are at HOLD.`,
    }),
    { pair: [
      { type: 'line', title: 'One-year-forward EV/EBITDA: our 12x vs history', unit: 'EV ÷ next full-year EBITDA (x)', x: fwdEv.map(x => x[0]), series: [{ name: 'Forward EV/EBITDA', values: fwdEv.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: fwdEvMed23, text: `Median since Apr-2023: ${n1(fwdEvMed23)}x` }, { v: 12, text: 'Our target: 12x', color: '#cf8f1f' }], source: 'Screener.in prices; reported EBITDA and net debt; GAM estimates for FY27-28E' },
      { type: 'line', title: 'One-year-forward P/E: our 25x cross-check vs history', unit: 'Price ÷ next full-year EPS (x)', x: fwdPe.map(x => x[0]), series: [{ name: 'Forward P/E', values: fwdPe.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: fwdPeMed25, text: `Median since Apr-2025: ${n1(fwdPeMed25)}x` }, { v: 25, text: 'Cross-check: 25x', color: '#cf8f1f' }], source: 'Screener.in prices; actual EPS, GAM estimates for FY27-28E' },
    ] },
    { exhibit: { type: 'table', title: 'From EBITDA to target price (base case)', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Sep-28E EBITDA (half FY28E, half FY29E)', n0(ebitdaSep28)],
      ['× EV/EBITDA multiple', '12x'],
      ['= Enterprise value', n0(ebitdaSep28 * 12)],
      ['less net debt at Sep-28E (GAM)', n0(sepND)],
      ['= Equity value', n0(ebitdaSep28 * 12 - sepND)],
      ['÷ shares (crore)', n1(F.shares)],
      { hl: true, cells: ['**12-month target (rounded)**', '**{{dcf.tp|inr}}**'] },
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Multiple 14x; FY28E EPS ₹${n1(S.bull.eps[1])}.`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Revenue +18% / +8% / +10% (FY27-29E), EBITDA margin 14.3-15.5%; 12x Sep-28E EV/EBITDA; FY28E EPS ₹${n1(F.eps[1])}.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Multiple 9x; FY28E EPS ₹${n1(S.bear.eps[1])}.`],
    ], source: 'GAM Research' } },
    { callout: `**Why the range is so wide:** net debt of ~₹${n0(sepND)} cr at Sep-28E is ~${Math.round(sepND / (ebitdaSep28 * 12) * 100)}% of our enterprise value, so every 1x of EV/EBITDA moves the target by ~₹${n0(ebitdaSep28 / F.shares)} a share, and every ₹100 cr of EBITDA (at 12x) by ~₹${n0(1200 / F.shares)}. Leverage magnifies both the bull and the bear case.` },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-42E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Less: net debt at Mar-27E', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
      { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ], source: 'GAM Research. Net debt is shown as a negative number. The engine discounts at one rate: we enter a WACC of ~11.6% (cost of equity ~13.1%, post-tax cost of debt ~6.5%, ~22% debt weight).' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): discount rate down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Listed specialty-chemical peers', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', 'EV/EBITDA (x)', 'ROE', 'EV/EBITDA vs post-2023 median'], rows: derate.map(p => [p.symbol === 'AARTIIND' ? '**Aarti Industries**' : shortName(p.name), n0(p.mcapCr), n0(p.revenue), n1(p.ebitdaMargin) + '%', n1(p.pe), n1(p.evEbitda), n1(p.roe) + '%', p.evVs != null ? pc(p.evVs) : '–']), source: `Screener.in, trailing multiples at the NSE close on ${ASOF_TXT} (Alkyl Amines standalone)` } },
  ],
};

// ------------------------------------------------------------------ verdict
const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: 'Our honest summary: good assets, a stretched balance sheet and a price that already assumes recovery',
  blocks: [
    { callout: '**What you are buying:** India\'s largest benzene-chemistry platform (#1 globally in DCB, 25-40% global share across products), a fast-grown fuel-additive franchise, long customer relationships, ~₹2,000 cr of new capacity about to start, and a professional MD from Oct-2026.' },
    { callout: `**What you are paying:** ${n1(F.evEbitda[1])}x our FY28E EV/EBITDA and ${n1(price / F.eps[1])}x FY28E EPS for a company with ~7% ROCE, 3.6x net debt/EBITDA, two Negative rating outlooks and a record of missing its own targets. On the street's EV/EBITDA method and our numbers, the target is {{dcf.tp|inr}} ({{dcf.upside|chg}}): HOLD.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      [`Price below ~₹${n0(buyBelow)} (BUY at our target)`, 'Medium', 'Share price around Q2FY27 results'],
      ['Zone IV blocks commission on the revised timeline and run at >50% in FY28', 'Medium', 'Quarterly commissioning updates; new-product revenue'],
      ['Underlying EBITDA run-rate above ₹400 cr a quarter without inventory gains', 'Medium', 'Q2-Q4FY27 results'],
      ['Net debt below ₹3,500 cr / <2.5x EBITDA', 'Low-medium', 'Half-yearly balance sheet; CRISIL outlook'],
      ['Middle East fuel-additive exports reopen and cracks stay above $15/bbl', 'Medium', 'Energy volumes QoQ'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['Crude-linked prices fall: inventory losses replace Q1 gains', 'Medium', 'FY27E EBITDA −₹50-100 cr'],
      ['Gasoline-naphtha cracks collapse or the fuel-additive contract is not renewed', 'Medium', 'Energy volumes and spreads down; FY28E EBITDA −10-15%'],
      ['Zone IV slips again or ramps slowly (no take-or-pay)', 'Medium', 'FY28E EBITDA below ₹1,500 cr; multiple towards 9-10x'],
      ['Working capital keeps rising; CRISIL downgrade (gross debt/EBITDA >3.6x)', 'Low-medium', 'Higher interest; equity raise risk'],
      ['Chinese pricing pressure returns after the VAT/anti-involution effect fades', 'Medium', 'Margin back to ~13%'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: HOLD, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**We would move to BUY below ~₹${n0(buyBelow)} and to SELL above ~₹${n0(sellAbove)}**, or earlier on proof that Zone IV is ramping and underlying quarterly EBITDA is above ₹400 cr.`,
      '**Biggest swing factor:** Zone IV timing and the energy spread. Because of the debt, a ₹100 cr change in Sep-28E EBITDA moves our target by ~₹33 a share.',
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Capex FY21-26 vs EBITDA growth', v: `₹${n0(capex21_26)} cr`, d: `EBITDA +${Math.round((ebitda26 / ebitda21 - 1) * 100)}% FY21-26` },
      { k: 'Net debt / EBITDA (FY26)', v: `${n1(ndE[ai('FY26')])}x`, d: 'target <2.5x' },
      { k: 'Fuel additives share of revenue', v: '38-43%', d: 'from 15% in FY23' },
      { k: 'Our FY28E EBITDA vs guidance', v: `₹${n0(F.ebitda[1])} cr`, d: 'guidance ₹1,800-2,200 cr' },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

// ------------------------------------------------------------------ glossary
const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['Benzene / toluene derivatives', 'Chemicals made by adding chlorine, nitro or other groups to benzene or toluene; the building blocks for agrochemicals, drugs, dyes and polymers.'],
      ['NCB / DCB', 'Nitrochlorobenzenes (e.g. PNCB, used for paracetamol) and dichlorobenzenes (e.g. PDCB, used for PPS polymers).'],
      ['PDA / NT', 'Phenylenediamines (aramid fibres, polymers) and nitrotoluenes (agro, dyes).'],
      ['Ethylation / MEA, DEA / PEDA', 'Adding ethyl groups using ethylene; MEA and DEA are ethylated anilines used in herbicides; PEDA is a downstream product of DEA.'],
      ['MMA (monomethyl aniline)', 'An aniline derivative used as an octane booster in gasoline; Aarti\'s "energy" or "fuel additives" business.'],
      ['Gasoline-naphtha crack', 'The price gap between gasoline and naphtha; when it is high, refiners pay more to upgrade naphtha into gasoline using boosters like MMA.'],
      ['Zone IV / MPP', 'Aarti\'s new ₹1,600-1,800 cr site at Jhagadia (chlorotoluene and other chemistry blocks) and its multipurpose plant for small-volume products.'],
      ['Anti-involution', 'China\'s policy push (from 2025) against destructive price wars and excess capacity.'],
      ['Take-or-pay', 'A contract where the customer pays for an agreed volume even if it does not take delivery.'],
      ['Gross vs net revenue', 'Aarti\'s headline revenue includes GST collected (gross); the audited "net revenue from operations" excludes it.'],
      ['MAT / MAT credit', 'Minimum alternate tax paid on book profit when normal tax is lower; it can be set off against future normal tax, so it is booked as an asset.'],
      ['EV/EBITDA', 'Enterprise value (market value plus net debt) ÷ operating profit before depreciation, interest and tax.'],
      ['ROCE', 'Return on capital employed: operating profit ÷ (equity + debt).'],
      ['DCF / WACC', 'Discounted cash flow valuation; WACC is the blended required return on equity and debt used to discount cash flows.'],
    ], source: 'GAM Research' } },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, business, history, industry, tailwind, chainsCh, energy, projects, moat, p.seasons, p.financials, quality, p.balance, ownership(p.ownershipBase), governance, forecasts, street, valuation, risks, p.statements, glossary],
  statementNotes: {
    'sales@FY22': '+35%: includes ₹631 cr contract-termination income and the pharma business (demerged 2022).',
    'ebitda@FY22': 'Includes the ₹631 cr termination fee; restated chemicals-only EBITDA ₹919 cr.',
    'pat@FY22': 'Peak year, flattered by the termination fee.',
    'ebitda@FY23': 'First year after the pharma demerger; FY23 guidance (~₹1,100 cr) met.',
    'ebitda@FY24': 'First guidance implied ~₹1,375 cr; Chinese price pressure and agro destocking.',
    'sales@FY25': '+14%: volumes +17%; fuel additives scaled up.',
    'ebitda@FY25': 'FY25 guidance started at ~₹1,700 cr; withdrawn Aug-2024.',
    'pat@FY26': 'Includes a tax credit (effective rate −15%) and ₹28.5 cr of interest on tax refunds.',
    'cfo@FY26': 'Receivables up ₹617 cr as US exports (long voyages) grew.',
    'sales@FY27E': 'GAM: +18%, mostly input-price pass-through (Q1 +43%).',
    'ebitda@FY28E': `GAM ₹${n0(F.ebitda[1])} cr vs management target ₹1,800-2,200 cr.`,
    'capex@FY28E': 'Capex falls as Zone IV completes (CRISIL: ₹200-250 cr a year from FY28).',
  },
};
