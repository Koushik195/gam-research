// GNFC initiation: shared context for the Part B files (research.js, part2-6). Loads the research JSONs
// and the built model and computes the valuation inputs once: own forward P/E (forwardMedian, trough
// years left out), forward EV/EBITDA with the ICDs counted as treasury, peer de-rating, treasury and
// ex-cash views. Written as of 30-Sep-2026 (Q1FY27 basis).
const fs = require('fs');
const path = require('path');
const { forwardSeries, forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { ruleText, buyBelow: buyAt, sellAbove: sellAt, ratingFor } = require('../../src/ratings');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'GNFC', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'GNFC.json'), 'utf8'));
const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'GNFC', 'screener.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, AS = M.forecast.assumptions, SC = M.forecast.scenarios, A = M.annual;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const SRC = 'GNFC annual reports, investor decks and earnings calls; GAM Research';
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const shortDate = d => { if (!d || !/^\d{4}-\d{2}/.test(d)) return d || 'n.d.'; const [y, m, dd] = d.split('-'); return dd ? `${+dd}-${MON[+m - 1]}-${y.slice(2)}` : `${MON[+m - 1]}-${y.slice(2)}`; };

const SA = SG.annual, SQ = SG.quarterly, QL = SQ.map(q => q.q), FYS = SA.map(a => a.fy);
const ann = fy => SA.find(a => a.fy === fy);
const A26 = ann('FY26'), A25 = ann('FY25'), A22 = ann('FY22'), A23 = ann('FY23'), A24 = ann('FY24');
const Q1 = C.q1fy27, b = A.labels.length - 1;
const ix = fy => A.labels.indexOf(fy);
const price = M.price.last, sh = F.shares, mcap = price * sh, sharesActual = C.profile.shares / 1e7;

// Treasury on the engine's basis (cash + investments + ICDs - borrowings) and per share
const T = C.treasuryMar26;
const icd = T.icdGsfs;
const treasury26 = A.cash[b] + A.investments[b] + icd - A.borrowings[b];
const equityStakes = T.equityQuoted.total + T.equityUnquoted.total + T.associateGGRC;
const interestBook = treasury26 - equityStakes;
const tps = v => v / sh;
const opsValueNow = mcap - treasury26; // what the market pays for the operations
const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const epsSep28 = mv('pe').metric, peMult = mv('pe').mult, evMult = mv('ev').mult, ebitdaSep28 = mv('ev').metric;
const yi = y => F.years.indexOf(y);
const sep28 = arr => (arr[1] + arr[2]) / 2;
const tYield = AS.treasuryYield[1] / 100, tax = AS.taxRate[1] / 100;
const treasIncPs28 = sep28(F.years.map((_, i) => (i ? F.treasury[i - 1] : treasury26) * AS.treasuryYield[i] / 100 * (1 - tax) / sh));
const opsEps28 = epsSep28 - treasIncPs28;
const impliedOpsPe = (price - tps((F.treasury[0] + F.treasury[1]) / 2)) / opsEps28;
const tpOpsPe = (V.tp - tps((F.treasury[0] + F.treasury[1]) / 2)) / opsEps28;

// Own one-year-forward P/E since Apr-2021 (house rule) and context statistics
const FM = forwardMedian('GNFC', M);
const fwdPe = forwardSeries('GNFC', M, 'eps');
const fyOf = d => { const dt = new Date(d); return dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; };
const medOf = v => { const s = [...v].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
const fwd21 = fwdPe.filter(x => x[0] >= '2021-04-01');
const peByFy = Object.fromEntries([...new Set(fwd21.map(x => fyOf(x[0])))].map(fy => [`FY${String(fy).slice(2)}`, medOf(fwd21.filter(x => fyOf(x[0]) === fy).map(x => x[1]))]));
const exPeak = medOf(FM.series.filter(x => fyOf(x[0]) !== 2023).map(x => x[1]));
const fwdNow = price / F.eps[1];
const fwdPreWar = medOf(fwd21.filter(x => x[0] >= '2025-04-01' && x[0] <= '2026-02-27').map(x => x[1]));

// Own forward EV/EBITDA since Apr-2021: EV = market value + borrowings - cash - investments - ICDs
// (ICD balances: cumulative 'Inter corporate deposits' cash flows, matching AR FY25-26 notes)
const ICD = { 2019: 160, 2020: 165, 2021: 400, 2022: 2400, 2023: 800, 2024: 350, 2025: 545, 2026: 2410 };
const eb = {}; A.labels.forEach((l, i) => (eb[2000 + +l.slice(2)] = A.ebitda[i])); F.years.forEach((y, i) => (eb[2000 + +y.slice(2, 4)] = F.ebitda[i]));
const nd = {}; A.labels.forEach((l, i) => { const y = 2000 + +l.slice(2); nd[y] = (A.borrowings[i] || 0) - (A.cash[i] || 0) - (A.investments[i] || 0) - (ICD[y] || 0); });
const bsYr = d => { const dt = new Date(d); return dt.getMonth() >= 5 ? dt.getFullYear() : dt.getFullYear() - 1; };
const troughEv = fy => { const pk = Math.max(...[eb[fy - 1], eb[fy - 2], eb[fy - 3]].filter(v => v != null)); return !(eb[fy] > 0) || eb[fy] < 0.5 * pk; };
const evAll = S.charts.price.Price.filter(([d]) => d >= '2021-04-01' && d < ASOF).map(([d, px]) => [d, Math.round((px * sh + nd[bsYr(d)]) / eb[fyOf(d)] * 10) / 10, fyOf(d)]);
evAll.push([ASOF, Math.round((price * sh + nd[2026]) / eb[2028] * 10) / 10, 2028]);
const evKept = evAll.filter(x => !troughEv(x[2]));
const evMed = medOf(evKept.map(x => x[1])), evMedAll = medOf(evAll.map(x => x[1]));
const evTroughYears = [...new Set(evAll.filter(x => troughEv(x[2])).map(x => `FY${String(x[2]).slice(2)}`))];
const evByFy = Object.fromEntries([...new Set(evAll.map(x => x[2]))].map(fy => [`FY${String(fy).slice(2)}`, medOf(evAll.filter(x => x[2] === fy).map(x => x[1]))]));
const evNow = evAll[evAll.length - 1][1];

// Peers at the 30-Sep-2026 close vs their own five-year medians
const PEER_SYMS = ['GNFC', 'GSFC', 'CHAMBLFERT', 'DEEPAKFERT', 'DCMSHRIRAM', 'GHCL', 'TATACHEM', 'GUJALKALI'];
const PEERS = Object.fromEntries(peersAsOf(PEER_SYMS, ASOF).map(p => [p.symbol, p]));
const med5 = (sym, key, field) => { const X = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')); return medOf((X.charts?.[key]?.[field] || []).filter(([d, x]) => d >= '2021-10-01' && d <= ASOF && x > 0).map(x => x[1])); };
const MED5 = Object.fromEntries(PEER_SYMS.map(s => [s, { pe: med5(s, 'pe', 'Price to Earning'), ev: med5(s, 'evEbitda', 'EV Multiple') }]));
const drPe = s => (PEERS[s].pe / MED5[s].pe - 1) * 100, drEv = s => (PEERS[s].evEbitda / MED5[s].ev - 1) * 100;
const PE_PEERS = ['GSFC', 'CHAMBLFERT', 'DEEPAKFERT', 'DCMSHRIRAM', 'GHCL']; // TATACHEM, GUJALKALI: P/E distorted by collapsed earnings
const EV_PEERS = PEER_SYMS.filter(s => s !== 'GNFC');
const sectorDrPe = medOf(PE_PEERS.map(drPe)), sectorDrEv = medOf(EV_PEERS.map(drEv));
const derivedPe = FM.median * (1 + sectorDrPe / 100), derivedEv = evMed * (1 + sectorDrEv / 100);
if (Math.abs(Math.round(derivedPe * 2) / 2 - peMult) > 0.01) console.warn(`GNFC.ctx: derived P/E ${n1(derivedPe)}x rounds to ${Math.round(derivedPe * 2) / 2}x but assumptions use ${peMult}x`);
if (Math.abs(Math.round(derivedEv * 2) / 2 - evMult) > 0.01) console.warn(`GNFC.ctx: derived EV/EBITDA ${n1(derivedEv)}x rounds to ${Math.round(derivedEv * 2) / 2}x but assumptions use ${evMult}x`);
const shortName = s => ({ GNFC: 'GNFC', GSFC: 'GSFC', CHAMBLFERT: 'Chambal Fertilisers', DEEPAKFERT: 'Deepak Fertilisers', DCMSHRIRAM: 'DCM Shriram', GHCL: 'GHCL', TATACHEM: 'Tata Chemicals', GUJALKALI: 'Gujarat Alkalies' }[s] || s);

// Street (as it stood on 30-Sep-2026) and the rating from the house rule
const ST = D.street.brokers;
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;
const epsCagr = (Math.pow(epsSep28 / A.eps[b], 1 / 2.5) - 1) * 100;

module.exports = { fs, path, ROOT, RD, C, D, SG, M, S, F, V, AS, SC, A, ASOF, ASOF_TXT, n0, n1, pc, SRC, shortDate, SA, SQ, QL, FYS, ann, A26, A25, A22, A23, A24, Q1, b, ix,
  price, sh, mcap, sharesActual, T, icd, treasury26, equityStakes, interestBook, tps, opsValueNow, BM, mv, epsSep28, peMult, evMult, ebitdaSep28, yi, sep28, treasIncPs28, opsEps28, impliedOpsPe, tpOpsPe,
  FM, fwdPe, peByFy, exPeak, fwdNow, fwdPreWar, ICD, evAll, evKept, evMed, evMedAll, evTroughYears, evByFy, evNow,
  PEER_SYMS, PEERS, MED5, drPe, drEv, PE_PEERS, EV_PEERS, sectorDrPe, sectorDrEv, derivedPe, derivedEv, shortName, ST, rating, buyBelow, sellAbove, ruleText, epsCagr };
