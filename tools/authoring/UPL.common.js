// Shared data and helpers for the UPL Part B files (UPL.research.js, UPL.part2-4.js).
const fs = require('fs');
const path = require('path');
const { forwardSeries, forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'UPL', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json'), AS = rd('assumptions.json');
const M = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'models', 'UPL.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const pc = (a, b) => Math.round((a / b - 1) * 1000) / 10;
const SA = SG.annual, SQ = SG.quarterly, QL = SQ.map(q => q.q);
const A25 = SA.find(a => a.fy === 'FY25'), A26 = SA.find(a => a.fy === 'FY26');
const Q1 = C.q1fy27.results;
const price = M.price.last, shares = F.shares, mcap = price * shares;
const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const P = V.sotp.parts, VP = AS.valuation.parts;
const yi = y => F.years.indexOf(y);
const sep28 = arr => (arr[yi('FY28E')] + arr[yi('FY29E')]) / 2;
const epsSep28 = mv('pe').metric;
// Platforms: FY26 actual and Sep-28E (company basis)
const PLAT = [['corp', 'UPL Corp'], ['sas', 'UPL SAS'], ['adv', 'Advanta'], ['sf', 'SUPERFORM']];
const segE = (k, y) => F.seg[k].adjEbitda[yi(y)], segR = (k, y) => F.seg[k].revenue[yi(y)];
// One-year-forward P/E history since Apr-2021 (playbook window)
const fwdPe = forwardSeries('UPL', M, 'eps').filter(x => x[0] >= '2021-04-01');
const med = a => { const v = a.slice().sort((x, y) => x - y); return v[Math.floor(v.length / 2)]; };
// House rule (forwardMedian): median since Apr-2021 leaving out trough years (forward EPS a loss or < half the prior three-year high)
const FM = forwardMedian('UPL', M), fwdMed = FM.median, fwdMedAll = FM.medianAll, troughYears = FM.troughYears;const fwdMedYr = y => med(fwdPe.filter(x => x[0].startsWith(y)).map(x => x[1]));
// Peers as of 30-Sep-2026 (trailing multiples at the NSE close) and their five-year median P/E
const PEER_SYMS = ['UPL', 'PIIND', 'SUMICHEM', 'BAYERCROP', 'DHANUKA', 'RALLIS', 'COROMANDEL'];
const PEERS = Object.fromEntries(peersAsOf(PEER_SYMS, ASOF).map(p => [p.symbol, p]));
const pe5y = sym => {
  const S = JSON.parse(fs.readFileSync(path.join(RD, '..', '..', sym, 'screener.json'), 'utf8'));
  return med(S.charts.pe['Price to Earning'].filter(x => x[0] >= '2021-09-30' && x[0] <= ASOF && x[1] > 0).map(x => x[1]));
};
const CP_PEERS = ['PIIND', 'SUMICHEM', 'BAYERCROP', 'DHANUKA', 'RALLIS'];
const deRate = CP_PEERS.map(s => [s, PEERS[s].pe, pe5y(s), PEERS[s].pe / pe5y(s)]);
const deRateMed = med(deRate.map(r => r[3]));
// Company-basis EBITDA path (platforms less group eliminations; excludes FX on trade balances and associates)
const coEbitda = i => PLAT.reduce((t, [k]) => t + F.seg[k].adjEbitda[i], 0);
const SRC = 'UPL investor presentations (platform data), annual reports, Screener.in, GAM Research';
// Target multiple step: house forward median × crop-protection peers' median de-rating, rounded to a whole multiple
const deRated = fwdMed * deRateMed, coromandelRatio = PEERS.COROMANDEL.pe / pe5y('COROMANDEL');
module.exports = { fs, path, C, D, SG, AS, M, F, V, ASOF, ASOF_TXT, n0, n1, pc, SA, SQ, QL, A25, A26, Q1, price, shares, mcap, BM, mv, P, VP, yi, sep28, epsSep28, PLAT, segE, segR, fwdPe, fwdMed, fwdMedAll, troughYears, deRated, coromandelRatio, fwdMedYr, PEERS, PEER_SYMS, deRate, deRateMed, coEbitda, SRC, med };
