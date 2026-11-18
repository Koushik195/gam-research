// Tata Chemicals initiation: shared context for the research parts (data, built model, peers, own
// forward-multiple history with trough years left out, street, derived numbers). As of 30-Sep-2026.
const fs = require('fs');
const path = require('path');
const { forwardMedian } = require('./valuation-blend');
const { ruleText, buyBelow: buyAt, sellAbove: sellAt, ratingFor } = require('../../src/ratings');
const { peersAsOf } = require('./asof-peers');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'TATACHEM', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'TATACHEM.json'), 'utf8'));
const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'TATACHEM', 'screener.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, AS = M.forecast.assumptions, SC = M.forecast.scenarios, A = M.annual;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const SRC = 'Tata Chemicals investor decks, earnings calls and annual reports, GAM Research';

const SA = SG.annual, SQ = SG.quarterly, QL = SQ.map(q => q.q), FYS = SA.map(a => a.fy);
const ann = fy => SA.find(a => a.fy === fy);
const A26 = ann('FY26'), A25 = ann('FY25'), A23 = ann('FY23'), A22 = ann('FY22');
const Q1 = C.q1fy27;
const price = M.price.last, sh = F.shares, mcap = price * sh;
const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const P = V.sotp.parts, VP = AS.valuation.parts;
const part = re => P[VP.findIndex(p => re.test(p.name))];
const yi = y => F.years.indexOf(y);
const sep28 = k => (F.seg[k].adjEbitda[yi('FY28E')] + F.seg[k].adjEbitda[yi('FY29E')]) / 2;
const OPS = ['india', 'us', 'uk', 'ken', 'sg'];
const opsEbitda = OPS.reduce((s, k) => s + sep28(k), 0);
const opsValue = P.slice(0, 5).reduce((s, p) => s + p.value, 0);
const opsMult = opsValue / opsEbitda;
const otherItems = V.sotp.equity - opsValue; // everything below the operating businesses (incl. net cash)
const impliedOpsMult = (mcap - otherItems) / opsEbitda; // what the share price pays for the operations
const rallisMcap = 3883, rallisCash = 489, quotedMV = 8297, quotedBook = 7229, alcadNci = 99, pension = 1190, div26 = 280;
const netCash26 = A.cash[A.cash.length - 1] + A.investments[A.investments.length - 1] - A.borrowings[A.borrowings.length - 1];
const ebitdaSep28 = mv('ev').metric;

// Own one-year-forward EV/EBITDA since Apr-2021 (Screener basis: market value + borrowings - cash -
// all investments at book), leaving out trough years (forward EBITDA below half the best of the
// previous three years) - the same rule forwardMedian applies to P/E.
const eb = {}; A.labels.forEach((l, i) => (eb[2000 + +l.slice(2)] = A.ebitda[i])); F.years.forEach((y, i) => (eb[2000 + +y.slice(2, 4)] = F.ebitda[i]));
const nd = {}; A.labels.forEach((l, i) => (nd[2000 + +l.slice(2)] = (A.borrowings[i] || 0) - (A.cash[i] || 0) - (A.investments[i] || 0)));
const fyOf = d => { const dt = new Date(d); return dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; };
const bsYr = d => { const dt = new Date(d); return dt.getMonth() >= 5 ? dt.getFullYear() : dt.getFullYear() - 1; };
const troughFy = fy => { const pk = Math.max(...[eb[fy - 1], eb[fy - 2], eb[fy - 3]].filter(v => v != null)); return !(eb[fy] > 0) || eb[fy] < 0.5 * pk; };
const evAll = S.charts.price.Price.filter(([d]) => d >= '2021-04-01' && d <= ASOF).map(([d, px]) => [d, Math.round((px * sh + nd[bsYr(d)]) / eb[fyOf(d)] * 10) / 10, fyOf(d)]);
const evKept = evAll.filter(x => !troughFy(x[2]));
const medOf = a => { const s = a.map(x => x[1]).sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
const evMed = medOf(evKept), evMedAll = medOf(evAll), evNow = evAll[evAll.length - 1][1];
const evTroughYears = [...new Set(evAll.filter(x => troughFy(x[2])).map(x => `FY${String(x[2]).slice(2)}`))];
const evByFy = Object.fromEntries([...new Set(evAll.map(x => x[2]))].map(fy => [`FY${String(fy).slice(2)}`, medOf(evAll.filter(x => x[2] === fy))]));
const evChart = evAll.filter((_, i) => i % 2 === 0);
const peFm = forwardMedian('TATACHEM', M);

// What our target implies on that same basis, and the claims that basis ignores.
const tpEvFy28 = (V.tp * sh - netCash26) / F.ebitda[1];
const claims = { rallisMinority: 0.4496 * (rallisMcap - rallisCash), alcad: alcadNci * 6, pension, quotedDiscount: quotedBook - quotedMV * 0.8, rallisDiscount: 0.5504 * rallisMcap * 0.2, dividend: div26 };
const claimsTotal = Object.values(claims).reduce((s, v) => s + v, 0);
const claimsTurns = claimsTotal / F.ebitda[1];
const evClaimsPs = (0.4496 * mv('ev').mult * sep28('ral') + alcadNci * mv('ev').mult + pension + (quotedBook - quotedMV * 0.8) + div26) / sh;

// Peers at the 30-Sep-2026 close and against their own five-year medians.
const PEER_SYMS = ['TATACHEM', 'GHCL', 'GUJALKALI', 'DCMSHRIRAM', 'RALLIS', 'SRF', 'AARTIIND'];
const PEERS = Object.fromEntries(peersAsOf(PEER_SYMS, ASOF).map(p => [p.symbol, p]));
const peerMed = Object.fromEntries(PEER_SYMS.map(s => {
  const X = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', s, 'screener.json'), 'utf8'));
  const md = (ser) => { const v = (ser || []).filter(([d, x]) => d >= '2021-10-01' && d <= ASOF && x > 0).map(x => x[1]).sort((a, b) => a - b); return v[Math.floor(v.length / 2)]; };
  return [s, { pe5y: md(X.charts?.pe?.['Price to Earning']), ev5y: md(X.charts?.evEbitda?.['EV Multiple']) }];
}));
const derate = s => Math.round((PEERS[s].evEbitda / peerMed[s].ev5y - 1) * 100);
const commodityDerates = ['GHCL', 'GUJALKALI', 'DCMSHRIRAM'].map(derate).sort((a, b) => a - b);
const sectorDerate = 1 + commodityDerates[1] / 100; // median of the three commodity chemical peers
const derivedGroup = Math.round(evMed * sectorDerate * 10) / 10;
const evAtClose = (mcap - netCash26) / F.ebitda[1];

// Street (latest note per broker standing on 30-Sep-2026).
const streetRows = D.street.brokers.map(b => [b.broker, b.rating, b.tp, b.method, b.multiple || '–', b.date]);
const mosl = D.street.brokers.find(b => /Motilal/.test(b.broker));
const tpBrokers = D.street.brokers.filter(b => b.tp && b.date >= '2026-03-01');

const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;
const mosHit = i => F.eps[i];

module.exports = { fs, path, C, D, SG, M, S, F, V, AS, SC, A, ASOF, ASOF_TXT, n0, n1, SRC, SA, SQ, QL, FYS, ann, A26, A25, A23, A22, Q1, price, sh, mcap,
  BM, mv, P, VP, part, sep28, OPS, opsEbitda, opsValue, opsMult, otherItems, impliedOpsMult, rallisMcap, rallisCash, quotedMV, quotedBook, alcadNci, pension, div26, netCash26, ebitdaSep28,
  evAll, evKept, evMed, evMedAll, evNow, evTroughYears, evByFy, evChart, peFm, tpEvFy28, claims, claimsTotal, claimsTurns, sectorDerate, derivedGroup, evClaimsPs, commodityDerates, evAtClose,
  PEER_SYMS, PEERS, peerMed, derate, streetRows, mosl, tpBrokers, rating, buyBelow, sellAbove, ruleText, mosHit };
