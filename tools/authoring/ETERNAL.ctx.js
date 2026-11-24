// Shared context for the Eternal report (Part B files): research data, the built model, segment
// history, valuation arithmetic, peer multiples at the 30-Sep-2026 close and the multiple derivation.
const fs = require('fs');
const path = require('path');
const { peersAsOf } = require('./asof-peers');
const { forwardMedian } = require('./valuation-blend');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'ETERNAL', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const SG = rd('segments.json'), D = rd('deep.json'), AS = rd('assumptions.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'ETERNAL.json'), 'utf8'));
const V = M.forecast.dcf, F = M.forecast.F, S = V.sotp, SC = M.forecast.scenarios;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const median = a => { const v = a.filter(x => x != null && Number.isFinite(x)).sort((x, y) => x - y), k = v.length; return k % 2 ? v[(k - 1) / 2] : (v[k / 2 - 1] + v[k / 2]) / 2; };

// ---- segment history ----
const Qs = SG.quarterly, QL = Qs.map(q => q.q);
const qv = k => Qs.map(q => q[k] ?? null);
const pctOf = (a, b) => Qs.map(q => (q[a] != null && q[b] ? Math.round(q[a] / q[b] * 1000) / 10 : null));
const ann = fy => SG.annual.find(a => a.fy === fy);
const A25 = ann('FY25'), A26 = ann('FY26');
const q1 = Qs.at(-1), q1y = Qs.find(q => q.q === 'Q1FY26'), q4 = Qs.find(q => q.q === 'Q4FY26');
const SW = D.swiggyQ1FY27; // Swiggy Q1FY27 comparison (from its letter)

// ---- valuation arithmetic (from the built model) ----
const price = M.price.last, shares = F.shares, mcap = price * shares;
const cashNow = q1.cash; // company-reported cash balance, Jun-26
const part = re => S.parts.find(p => re.test(p.name));
const PF = part(/^Food/), PQ = part(/^Quick/), PG = part(/^Going/), PH = part(/^B2B/), PO = part(/^Others/), PC = part(/^Net cash/), PL = part(/^Add back/);
const exQc = S.parts.filter(p => p !== PQ).reduce((s, p) => s + p.value, 0);
const impliedQc = mcap - exQc; // what the price leaves for Blinkit if everything else is worth our base value
const impliedQcX = impliedQc / PQ.metric;
const impliedFoodX = (mcap - (S.equity - PF.value)) / PF.metric; // food multiple the price implies with every other part at our value
const roll = (k, f) => F.seg[k][f][1] * 0.5 + F.seg[k][f][2] * 0.5; // Sep-28E
const W52 = { high: M.price.high52, low: M.price.low52 };
const fromHigh = (price / (W52.high?.value ?? W52.high) - 1) * 100;

// ---- peers at the 30-Sep-2026 close (internet platforms set) ----
const NET = ['SWIGGY', 'NAUKRI', 'INDIAMART', 'NYKAA', 'PAYTM', 'POLICYBZR'];
const PEERS = peersAsOf(['ETERNAL', ...NET], ASOF), PR = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const med5 = (sym, chart, key) => { const X = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')); const v = (X.charts?.[chart]?.[key] || []).filter(([d, x]) => d <= ASOF && d >= '2021-09-30' && x > 0).map(x => x[1]); return v.length >= 200 ? median(v) : null; };
const MED5PE = Object.fromEntries(NET.map(s => [s, med5(s, 'pe', 'Price to Earning')]));
const drPe = Object.fromEntries(NET.map(s => [s, MED5PE[s] && PR[s].pe ? (PR[s].pe / MED5PE[s] - 1) * 100 : null]));
// Peers with a usable five-year P/E history (§7c): NAUKRI and INDIAMART. SWIGGY (listed Nov-2024, loss-making),
// PAYTM and POLICYBZR (losses for most of the window) and NYKAA (P/E above 1,000x inside the window) are excluded.
const DR_SET = ['NAUKRI', 'INDIAMART'];
const sectorDr = median(DR_SET.map(s => drPe[s]));
const FM = forwardMedian('ETERNAL', M);

module.exports = { fs, path, ROOT, RD, SG, D, AS, M, V, F, S, SC, ASOF, ASOF_TXT, n0, n1, median, Qs, QL, qv, pctOf, ann, A25, A26, q1, q1y, q4, SW,
  price, shares, mcap, cashNow, part, PF, PQ, PG, PH, PO, PC, PL, exQc, impliedQc, impliedQcX, impliedFoodX, roll, W52, fromHigh,
  NET, PEERS, PR, MED5PE, drPe, DR_SET, sectorDr, FM };
