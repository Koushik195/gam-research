// Shared context for the Nykaa report (Part B files): research data, the built model, segment history,
// valuation arithmetic, peer multiples at the 30-Sep-2026 close and the multiple derivation.
const fs = require('fs');
const path = require('path');
const { peersAsOf } = require('./asof-peers');
const { forwardMedian } = require('./valuation-blend');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'NYKAA', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const SG = rd('segments.json'), D = rd('deep.json'), AS = rd('assumptions.json'), CO = rd('company.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'NYKAA.json'), 'utf8'));
const V = M.forecast.dcf, F = M.forecast.F, S = V.sotp, SC = M.forecast.scenarios;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const median = a => { const v = a.filter(x => x != null && Number.isFinite(x)).sort((x, y) => x - y), k = v.length; return k % 2 ? v[(k - 1) / 2] : (v[k / 2 - 1] + v[k / 2]) / 2; };

// ---- segment history ----
const Qs = SG.quarterly, QL = Qs.map(q => q.q);
const qv = k => Qs.map(q => q[k] ?? null);
const ann = fy => SG.annual.find(a => a.fy === fy);
const A25 = ann('FY25'), A26 = ann('FY26');
const q1 = Qs.at(-1), q1y = Qs.find(q => q.q === 'Q1FY26');

// ---- valuation arithmetic (from the built model) ----
const price = M.price.last, shares = F.shares;
const part = re => S.parts.find(p => re.test(p.name));
const PB = part(/^Beauty/), PF = part(/^Fashion/), PO = part(/^Others/), PC = part(/^Net debt/), PM = part(/^Dot/);
const exFashion = S.parts.filter(p => p !== PF).reduce((s, p) => s + p.value, 0);
const roll = (k, f) => F.seg[k][f][1] * 0.5 + F.seg[k][f][2] * 0.5; // Sep-28E
const W52 = { high: M.price.high52, low: M.price.low52 };
const hi52 = W52.high?.value ?? W52.high, lo52 = W52.low?.value ?? W52.low;
const fromHigh = (price / hi52 - 1) * 100;
const IPO_ADJ = 187.5; // ₹1,125 IPO price ÷ 6 (5:1 bonus, Nov-2022)

// ---- peers at the 30-Sep-2026 close (internet platforms set, as ETERNAL) ----
const NET = ['ETERNAL', 'SWIGGY', 'NAUKRI', 'INDIAMART', 'PAYTM', 'POLICYBZR'];
const PEERS = peersAsOf(['NYKAA', ...NET], ASOF), PR = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const mcap = PR.NYKAA.mcapCr; // market value at the 30-Sep close, as shown on the cover
const med5 = (sym, chart, key) => { const X = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')); const v = (X.charts?.[chart]?.[key] || []).filter(([d, x]) => d <= ASOF && d >= '2021-09-30' && x > 0).map(x => x[1]); return v.length >= 200 ? median(v) : null; };
const MED5PE = Object.fromEntries(NET.map(s => [s, med5(s, 'pe', 'Price to Earning')]));
const drPe = Object.fromEntries(NET.map(s => [s, MED5PE[s] && PR[s].pe ? (PR[s].pe / MED5PE[s] - 1) * 100 : null]));
// Peers with a usable five-year P/E history (§7c, same set as ETERNAL): NAUKRI and INDIAMART. ETERNAL (losses
// until FY24, P/E above 700x at the as-of date), SWIGGY (listed Nov-2024, loss-making), PAYTM and POLICYBZR
// (losses for most of the window) are excluded; NYKAA itself is excluded.
const DR_SET = ['NAUKRI', 'INDIAMART'];
const sectorDr = median(DR_SET.map(s => drPe[s]));
const impliedF = mcap - exFashion, impliedFX = impliedF / PF.metric; // Fashion EV/GMV the price implies
const impliedBX = (mcap - (S.equity - PB.value)) / PB.metric; // Beauty EV/EBITDA the price implies
const FM = forwardMedian('NYKAA', M);

module.exports = { fs, path, ROOT, RD, SG, D, AS, CO, M, V, F, S, SC, ASOF, ASOF_TXT, n0, n1, median, Qs, QL, qv, ann, A25, A26, q1, q1y,
  price, shares, mcap, part, PB, PF, PO, PC, PM, impliedF, impliedFX, impliedBX, roll, W52, hi52, lo52, fromHigh, IPO_ADJ,
  NET, PEERS, PR, MED5PE, drPe, DR_SET, sectorDr, FM };
