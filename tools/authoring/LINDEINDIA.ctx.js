// Linde India initiation: shared context for the Part B files (research.js, part2-6). Loads the research
// JSONs and the built model, and computes the valuation inputs (forward P/E history via forwardMedian,
// peer de-rating, EV/EBITDA history) once. Written as of 30-Sep-2026 (Q1FY27 basis).
const fs = require('fs');
const path = require('path');
const { forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor, ruleText } = require('../../src/ratings');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'LINDEINDIA', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'LINDEINDIA.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const SRC = 'Linde India annual reports, results filings and AGM presentation; GAM Research';
const cagr = (a, b, y) => (Math.pow(b / a, 1 / y) - 1) * 100;

// Segments (annual: Dec18-Dec21 calendar years, FY23 15 months, FY24-26 April-March)
const SA = SG.annual, SQ = SG.quarterly, QL = SQ.map(q => q.q);
const sa = fy => SA.find(a => a.fy === fy);
const A24 = sa('FY24'), A25 = sa('FY25'), A26 = sa('FY26');
const segM = (a, k) => a[k + 'Ebitda'] / a[k === 'gas' ? 'gasRev' : 'pedExt'] * 100;
const pbitM = (a, k) => a[k + 'Pbit'] / a[k === 'gas' ? 'gasRev' : 'pedExt'] * 100;
const Q1 = C.q1fy27, FY = C.fy26, RP = C.relatedParty, PJ = C.projects, PED = C.ped;
const SEG = F.seg; // forecast segments: SEG.gas.revenue[i], SEG.ped.adjEbitda[i]

// Price and model outputs
const price = M.price.last, mcap = M.meta.marketCap || price * F.shares;
const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const epsSep28 = mv('pe').metric, peMult = mv('pe').mult, evMult = mv('ev').mult, ebitdaSep28 = mv('ev').metric;
const b = A.labels.length - 1; // FY26
const high52 = M.price.high52, low52 = M.price.low52, ath = 9481, fromAth = (price / ath - 1) * 100;
const epsUnderlyingFY26 = FY.underlyingPatGAM / F.shares;
const epsCagrFwd = cagr(A.eps[b], F.eps[2], 3), epsCagrFwdUnd = cagr(epsUnderlyingFY26, F.eps[2], 3);
const peFY28 = price / F.eps[1], peSep28 = price / epsSep28;
const evNow = mcap - F.treasury[0];

// One-year-forward P/E: house starting point (forwardMedian since Apr-2021, trough years excluded)
const FM = forwardMedian('LINDEINDIA', M);
const fwdPe = FM.series;
const fv = fwdPe.map(x => x[1]).sort((a, c) => a - c), q = p => fv[Math.floor(fv.length * p)];
const H = { med: FM.median, medAll: FM.medianAll, trough: FM.troughYears, p10: q(0.1), p25: q(0.25), p75: q(0.75), min: fv[0], max: fv.at(-1), first: fwdPe[0][0] };
const fwdNow = price / F.eps[0];

// Trailing EV/EBITDA history (Screener), same window
const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'LINDEINDIA', 'screener.json'), 'utf8'));
const evHist = (S.charts.evEbitda['EV Multiple'] || []).filter(([d, x]) => d >= '2021-04-01' && d <= ASOF && x > 0).map(x => x[1]).sort((a, c) => a - c);
const evMed = evHist[Math.floor(evHist.length / 2)];
const ttmEbitda = M.quarterly.ebitda.slice(-4).reduce((s, x) => s + x, 0), ttmEbitdaUnd = ttmEbitda - 90;

// Peers at the 30-Sep-2026 close; de-rating vs each one's five-year median trailing P/E
const PEER_SYMS = ['LINDEINDIA', 'ELLEN', 'SRF', 'PIDILITIND', 'SOLARINDS', 'NAVINFLUOR', '3MINDIA', 'GUJALKALI'];
const PEERS = peersAsOf(PEER_SYMS, ASOF), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const med5 = sym => { const X = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')); const v = (X.charts?.pe?.['Price to Earning'] || []).filter(([d, x]) => d <= ASOF && d >= '2021-09-30' && x > 0).map(x => x[1]).sort((a, c) => a - c); return v[Math.floor(v.length / 2)]; };
const MED5 = Object.fromEntries(PEER_SYMS.map(s => [s, med5(s)]));
const derate = Object.fromEntries(PEER_SYMS.map(s => [s, P[s].pe && MED5[s] ? (P[s].pe / MED5[s] - 1) * 100 : null]));
const DR_SET = ['SRF', 'PIDILITIND', 'SOLARINDS', 'NAVINFLUOR', '3MINDIA']; // GUJALKALI excluded (trough earnings), ELLEN (listed Jul-2025)
const drSorted = DR_SET.map(s => derate[s]).sort((a, c) => a - c), sectorDr = drSorted[2];
const afterDerate = H.med * (1 + sectorDr / 100);
const shortName = s => ({ LINDEINDIA: 'Linde India', ELLEN: 'Ellenbarrie Industrial Gases', SRF: 'SRF', PIDILITIND: 'Pidilite', SOLARINDS: 'Solar Industries', NAVINFLUOR: 'Navin Fluorine', '3MINDIA': '3M India', GUJALKALI: 'Gujarat Alkalies' }[s] || s);

// Rating from the house rule (never typed)
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;

module.exports = { ROOT, RD, C, D, SG, M, F, V, A, AS, SC, ASOF, ASOF_TXT, n0, n1, pc, pc1, SRC, cagr, SA, SQ, QL, sa, A24, A25, A26, segM, pbitM, Q1, FY, RP, PJ, PED, SEG,
  price, mcap, BM, mv, epsSep28, peMult, evMult, ebitdaSep28, b, high52, low52, ath, fromAth, epsUnderlyingFY26, epsCagrFwd, epsCagrFwdUnd, peFY28, peSep28, evNow,
  FM, fwdPe, H, fwdNow, evMed, ttmEbitda, ttmEbitdaUnd, PEER_SYMS, PEERS, P, MED5, derate, DR_SET, sectorDr, afterDerate, shortName, rating, buyBelow, sellAbove, ruleText };
