// Godrej Industries initiation: shared context for the research parts (data, built model, SOTP, the
// holding-company discount history, peers, street). As of 30-Sep-2026 (Q1FY27 basis).
const fs = require('fs');
const path = require('path');
const { forwardMedian } = require('./valuation-blend');
const { ruleText, buyBelow: buyAt, sellAbove: sellAt, ratingFor } = require('../../src/ratings');
const { peersAsOf } = require('./asof-peers');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'GODREJIND', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'GODREJIND.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, AS = M.forecast.assumptions, SC = M.forecast.scenarios, A = M.annual;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const SRC = 'Godrej Industries investor decks and annual report FY26, GAM Research';
const SA = SG.annual, SQ = SG.quarterly, QL = SQ.map(q => q.q);
const ann = fy => SA.find(a => a.fy === fy);
const A26 = ann('FY26'), A25 = ann('FY25');
const price = M.price.last, sh = F.shares, mcap = price * sh;
const yi = y => F.years.indexOf(y);
const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const P = (V.sotp || V).parts, VP = AS.valuation.parts;
const part = re => P[VP.findIndex(p => re.test(p.name))];
const ps = v => v / sh;
const chemSep28 = (F.seg.chem.adjEbitda[yi('FY28E')] + F.seg.chem.adjEbitda[yi('FY29E')]) / 2;

// SOTP pieces (base) and the look-through value before the discount.
const pChem = part(/^Chemicals/), pGcpl = part(/Consumer/), pGpl = part(/Properties/), pGavl = part(/Agrovet/), pGc = part(/Godrej Capital/), pOth = part(/Investment property/), pNd = part(/net debt/), pDisc = part(/discount/);
const listedMv = pGcpl.value + pGpl.value + pGavl.value;
const ltvBase = P.filter(p => p !== pDisc).reduce((s, p) => s + p.value, 0);
const discBase = -pDisc.value / ltvBase;
const discOf = k => VP.find(p => /discount/.test(p.name)).adj[k];
const gcPb = { base: 2.0, bull: 3.0, bear: 1.0 }, gcBook = 4330, chemMult = { base: 8, bull: 10, bear: 6 };

// Holding-company discount at each quarter-end since Jun-2021 (house method: GIL market value vs its
// look-through value on the same conventions as our SOTP: listed stakes at market, Godrej Capital at
// 2.0x GIL's invested cost (~book), chemicals at 8x trailing EBITDA, other investments at cost, less
// standalone net debt). Chemicals EBITDA before FY25 = PBIT x the FY25-26 EBITDA/PBIT ratio.
const H = D.holdcoHistory;
const ebRatio = (A25.chemEbitda + A26.chemEbitda) / (A25.chemPbit + A26.chemPbit);
const chemEb = fy => (fy === 'FY25' ? A25.chemEbitda : fy === 'FY26' ? A26.chemEbitda : H.chemPbit[fy] * ebRatio);
const lastFy = d => { const y = +d.slice(0, 4), m = +d.slice(5, 7); return `FY${String(m >= 6 ? y : y - 1).slice(2)}`; };
const ndAt = d => { const y = +d.slice(0, 4), m = +d.slice(5, 7); if (m <= 3) return H.netDebtMar[y]; if (d === '2026-06-30') return H.netDebtMar[2026] + 370; const a = H.netDebtMar[y], b = H.netDebtMar[y + 1]; return a + (b - a) * (m - 3) / 12; };
const discRow = (d, close, listed, gc, oth, chemE, nd) => { const mc = close * H.shares, chemV = chemMult.base * chemE, gcV = gcPb.base * gc, ltv = listed + gcV + oth + chemV - nd; return { d, close, mcap: mc, listed, gcV, chemV, nd, ltv, disc: (1 - mc / ltv) * 100, discListed: (1 - mc / listed) * 100 }; };
const discHist = H.rows.map(([d, close, listed, gc, oth]) => discRow(d, close, listed, gc, oth, chemEb(lastFy(d)), ndAt(d)));
const discNow = discRow(ASOF, price, listedMv, 4283, 65, A26.chemEbitda, -pNd.value);
const med = a => { const s = [...a].sort((x, y) => x - y); return s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2; };
const discMedAll = med(discHist.map(r => r.disc)), discRecent = discHist.filter(r => r.d >= '2024-09-30'), discMedRecent = med(discRecent.map(r => r.disc));
const discMedListed = med(discHist.map(r => r.discListed)), discMin = Math.min(...discHist.map(r => r.disc)), discMax = Math.max(...discHist.map(r => r.disc));
const derived = { base: Math.round(discMedRecent), bull: Math.round(discNow.disc), bear: Math.round(discMedAll) };
// Consistency checks: discount parts in assumptions must match the derived discounts.
const assumedPct = k => { const lab = VP.find(p => /discount/.test(p.name)).metricLabel; const m = lab.match(new RegExp(`${k} (\\d+)%`)); return m ? +m[1] : null; };
for (const k of ['base', 'bull', 'bear']) if (assumedPct(k) !== derived[k]) console.warn(`GODREJIND: discount ${k} in assumptions (${assumedPct(k)}%) differs from derived ${derived[k]}%; re-run set-valuation with the derived values.`);

// P/E cross-check: own one-year-forward P/E since Apr-2021, FY24 trough left out.
const peFm = forwardMedian('GODREJIND', M);

// Peers at the 30-Sep-2026 close.
const CHEM_PEERS = ['GALAXYSURF', 'FINEORG'], HFC_PEERS = ['AADHARHFC', 'HOMEFIRST', 'APTUS', 'BAJAJHFL'], STAKES = ['GODREJCP', 'GODREJPROP', 'GODREJAGRO'];
const PEERS = Object.fromEntries(peersAsOf([...CHEM_PEERS, ...HFC_PEERS, ...STAKES, 'GODREJIND'], ASOF).map(p => [p.symbol, p]));
const sc = s => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', s, 'screener.json'), 'utf8'));
const mdSeries = (ser, from) => { const v = (ser || []).filter(([d, x]) => d >= from && d <= ASOF && x > 0).map(x => x[1]).sort((a, b) => a - b); return v[Math.floor(v.length / 2)]; };
const atSeries = ser => { const v = (ser || []).filter(([d]) => d <= ASOF); return v.length ? v[v.length - 1][1] : null; };
const peerHist = Object.fromEntries([...CHEM_PEERS, ...HFC_PEERS].map(s => { const X = sc(s); const k = PEERS[s].price / (atSeries(X.charts.price.Price) || PEERS[s].price);
  return [s, { ev5y: mdSeries(X.charts.evEbitda?.['EV Multiple'], '2021-10-01'), pb5y: mdSeries(X.charts.pb?.['Price to book value'], '2021-10-01'), pbNow: Math.round(atSeries(X.charts.pb?.['Price to book value']) * k * 10) / 10 }]; }));
const galaxyDerate = Math.round((PEERS.GALAXYSURF.evEbitda / peerHist.GALAXYSURF.ev5y - 1) * 100);

// Holdco cash: FY26 standalone sources and uses.
const HC = C.holdco;
const streetRows = D.street.brokers.map(b => [b.broker, b.rating, b.tp, b.method, b.multiple, b.date, b.thesis]);
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;

module.exports = { fs, path, C, D, SG, M, F, V, AS, SC, A, ASOF, ASOF_TXT, n0, n1, SRC, SA, SQ, QL, ann, A26, A25, price, sh, mcap, yi, BM, mv, P, VP, part, ps, chemSep28,
  pChem, pGcpl, pGpl, pGavl, pGc, pOth, pNd, pDisc, listedMv, ltvBase, discBase, gcPb, gcBook, chemMult, discHist, discNow, discMedAll, discMedRecent, discMedListed, discMin, discMax, discRecent, derived, ebRatio,
  peFm, CHEM_PEERS, HFC_PEERS, PEERS, peerHist, galaxyDerate, HC, streetRows, rating, buyBelow, sellAbove, ruleText };

if (require.main === module) {
  discHist.forEach(r => console.log(r.d, n0(r.mcap), n0(r.listed), n0(r.gcV), n0(r.chemV), n0(r.nd), n0(r.ltv), n1(r.disc), n1(r.discListed)));
  console.log('NOW', n0(discNow.mcap), n0(discNow.ltv), n1(discNow.disc), n1(discNow.discListed), '| medAll', n1(discMedAll), 'medRecent', n1(discMedRecent), 'derived', JSON.stringify(derived), '| peFwd', peFm.median, peFm.medianAll, peFm.troughYears, '| galaxyDerate', galaxyDerate, JSON.stringify(peerHist));
  console.log('TP', V.tp, n1(V.upside), rating, 'bull', SC.bull.tp, 'bear', SC.bear.tp, 'chemSep28', n0(chemSep28), 'ltvBase', n0(ltvBase), 'discBase', n1(discBase * 100));
}
