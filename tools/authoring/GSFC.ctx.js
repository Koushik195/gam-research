// GSFC initiation: shared context for the research parts (data, built model, SOTP pieces, holding-discount
// history, forward P/E, peers, street). Written as of 30-Sep-2026 (Q1FY27 basis).
const fs = require('fs');
const path = require('path');
const { forwardMedian, forwardSeries } = require('./valuation-blend');
const { ruleText, buyBelow: buyAt, sellAbove: sellAt, ratingFor } = require('../../src/ratings');
const { peersAsOf } = require('./asof-peers');
const { holdHistory, holdNow, med } = require('./GSFC.hold');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'GSFC', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'GSFC.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, AS = M.forecast.assumptions, SC = M.forecast.scenarios, A = M.annual;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const pctChg = (a, b) => Math.round((a / b - 1) * 100);
const SRC = 'GSFC annual reports, media releases and earnings calls, GAM Research';
const SA = SG.annual, SQ = SG.quarterly, QL = SQ.map(q => q.q), FYS = SA.map(a => a.fy);
const ann = fy => SA.find(a => a.fy === fy);
const A26 = ann('FY26'), A25 = ann('FY25'), A24 = ann('FY24'), A23 = ann('FY23'), A22 = ann('FY22');
const Q1 = C.q1fy27, price = M.price.last, sh = F.shares, TRUE_SH = C.profile.shares.count / 1e7, mcap = price * TRUE_SH;
const yi = y => F.years.indexOf(y);
const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const P = V.sotp.parts, VP = AS.valuation.parts, part = re => P[VP.findIndex(p => re.test(p.name))];
const K = VP[0].multiple.base, INV = D.holdcoHistory.asOf.invBookMar26;
const s27 = a => a[yi('FY27E')] * 0.5 + a[yi('FY28E')] * 0.5;
const coreEb27 = s27(F.seg.fert.adjEbitda) + s27(F.seg.ip.adjEbitda) + s27(F.unalloc);
const pFert = part(/^Fertilizer/), pIp = part(/^Industrial/), pCen = part(/^Central/), pGnfc = part(/^GNFC/), pGas = part(/Gujarat Energy/), pGipcl = part(/^GIPCL/), pOth = part(/^Other listed/), pUnl = part(/^Unlisted/), pAsc = part(/^Associates/), pInv = part(/investments at Mar-26/), pNc = part(/^Net cash/), pDisc = part(/holding discount/);
const listedMv = pGnfc.value + pGas.value + pGipcl.value + pOth.value, unlistedV = pUnl.value + pAsc.value;
const coreV = pFert.value + pIp.value + pCen.value, ncSep27 = pNc.value + pInv.value;
const ltvBase = P.filter(p => p !== pDisc).reduce((s, p) => s + p.value, 0), discBase = -pDisc.value / ltvBase * 100;
const nc = i => F.treasury[i] - INV; // net cash excluding the investment book (model)

// Holding discount history (GSFC.hold.js) and the as-of level.
const H = D.holdcoHistory, ttmEb = M.annual.ttm.ebitda;
const HH = holdHistory(H, nc(0), K), NOW = holdNow(H, nc(0), ttmEb, K);
const derived = { base: Math.round(HH.medNormal), bull: Math.round(HH.medRecent), bear: Math.round(HH.medAll) };
const conv = [5, 6, 7].map(k => { const h = holdHistory(H, nc(0), k), d = h.medNormal; const ltv = k * coreEb27 + listedMv + unlistedV + ncSep27; return { k, d, now: holdNow(H, nc(0), ttmEb, k).disc, ps: ltv * (1 - d / 100) / sh }; });
const assumedPct = k => { const m = pDisc && VP.find(p => /holding discount/.test(p.name)).metricLabel.match(new RegExp(`${k} (\\d+)%`)); return m ? +m[1] : null; };
for (const k of ['base', 'bull', 'bear']) if (assumedPct(k) !== derived[k]) console.warn(`GSFC: holding discount ${k} in assumptions (${assumedPct(k)}%) differs from derived ${derived[k]}%; re-run set-valuation.`);
const investShare = (listedMv + unlistedV) / mcap * 100, listedShare = listedMv / mcap * 100;

// Forward P/E (house median, trough years out) and the peers' de-rating.
const fm = forwardMedian('GSFC', M), fwd = forwardSeries('GSFC', M, 'eps');
const FERT = ['CHAMBLFERT', 'PARADEEP', 'DEEPAKFERT', 'RCF', 'NFL', 'GNFC', 'COROMANDEL'];
const PEER_SYMS = ['GSFC', ...FERT];
const PEERS = Object.fromEntries(peersAsOf(PEER_SYMS, ASOF).map(p => [p.symbol, p]));
const med5 = (sym, chart, key) => { const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')); return med((S.charts[chart]?.[key] || []).filter(([d, v]) => d >= '2021-10-01' && d <= ASOF && v > 0 && v < 300).map(x => x[1])); };
for (const s of PEER_SYMS) { const p = PEERS[s]; p.pe5 = med5(s, 'pe', 'Price to Earning'); p.ev5 = med5(s, 'evEbitda', 'EV Multiple'); p.pb5 = med5(s, 'pb', 'Price to book value'); p.peVs = (p.pe / p.pe5 - 1) * 100; p.evVs = (p.evEbitda / p.ev5 - 1) * 100; }
const peDerate = med(FERT.map(s => PEERS[s].peVs)), evDerate = med(FERT.map(s => PEERS[s].evVs));
if (Math.round(peDerate) !== Math.round((mv('pe').multiple.base / fm.median - 1) * 100)) console.warn(`GSFC: P/E de-rating ${Math.round(peDerate)}% vs multiple ${mv('pe').multiple.base}x on median ${fm.median}x`);
const SHORT = { CHAMBLFERT: 'Chambal Fertilisers', PARADEEP: 'Paradeep Phosphates', DEEPAKFERT: 'Deepak Fertilisers', RCF: 'RCF', NFL: 'National Fertilizers', GNFC: 'GNFC', COROMANDEL: 'Coromandel', GSFC: 'GSFC' };
const pname = p => SHORT[p.symbol] || p.name;
const bvps26 = A.netWorth[A.labels.indexOf('FY26')] / TRUE_SH, pb = price / bvps26;

// Valuation pieces.
const pe27 = price / F.eps[0], pe28 = price / F.eps[1], epsSep28 = mv('pe').metric;
const dcfV = mv('dcf').value, peV = mv('pe').value;
const dcfAdj = (V.ev + nc(0) + (listedMv + unlistedV) * (1 - derived.base / 100)) / sh * Math.pow(1 + V.ke / 100, 0.5); // DCF with holdings after the base discount
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 5) * 5, sellAbove = Math.round(sellAt(V.tp) / 5) * 5;
const BR = D.street.brokers;
const fertPt = F.seg.fert.revenue[1] * 0.01 * (1 - AS.taxRate[1] / 100) / sh; // EPS per 1pt of fertiliser margin, FY28E
const ipPt = F.seg.ip.revenue[1] * 0.01 * (1 - AS.taxRate[1] / 100) / sh;

module.exports = { fs, path, ROOT, RD, C, D, SG, M, F, V, AS, SC, A, ASOF, ASOF_TXT, n0, n1, pctChg, SRC, SA, SQ, QL, FYS, ann, A26, A25, A24, A23, A22, Q1, price, sh, TRUE_SH, mcap, yi, BM, mv, P, VP, part, K, INV,
  coreEb27, pFert, pIp, pCen, pGnfc, pGas, pGipcl, pOth, pUnl, pAsc, pInv, pNc, pDisc, listedMv, unlistedV, coreV, ncSep27, ltvBase, discBase, nc, H, HH, NOW, derived, conv, investShare, listedShare, ttmEb,
  fm, fwd, FERT, PEER_SYMS, PEERS, peDerate, evDerate, pname, bvps26, pb, pe27, pe28, epsSep28, dcfV, peV, dcfAdj, rating, buyBelow, sellAbove, ruleText, BR, fertPt, ipPt, med };

if (require.main === module) {
  console.log('TP', V.tp, n1(V.upside), rating, 'bull', SC.bull.tp, 'bear', SC.bear.tp, '| mcap', n0(mcap), 'listed', n0(listedMv), n1(listedShare) + '%', 'all inv', n1(investShare) + '%', '| disc derived', JSON.stringify(derived), 'now', n1(NOW.disc), 'junCash', n1(NOW.discJunCash), 'impliedCore', n0(NOW.impliedCore));
  console.log('hist medAll', n1(HH.medAll), 'normal', n1(HH.medNormal), HH.nNormal, 'recent', n1(HH.medRecent), 'ebMed', HH.ebMed, 'mcap/listed', HH.medMcapToListed.toFixed(2), 'impliedCoreX', n1(HH.medImpliedCoreX), '| conv', JSON.stringify(conv.map(c => [c.k, n1(c.d), n1(c.now), n1(c.ps)])));
  console.log('fwd P/E', fm.median, fm.medianAll, fm.troughYears, 'peDerate', n1(peDerate), 'evDerate', n1(evDerate), 'pb', n1(pb * 100) / 100, 'dcfAdj', n0(dcfAdj), 'coreEb27', n0(coreEb27), 'ncSep27', n0(ncSep27), 'ltv', n0(ltvBase), n1(discBase), 'buy<', buyBelow, 'sell>', sellAbove);
  PEER_SYMS.forEach(s => { const p = PEERS[s]; console.log(s, p.pe, n1(p.pe5), n1(p.peVs), p.evEbitda, n1(p.ev5), n1(p.evVs), p.pb5); });
}
