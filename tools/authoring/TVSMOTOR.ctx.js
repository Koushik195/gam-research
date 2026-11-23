// TVS Motor: shared inputs for the report (as of 30-Sep-2026). Loads the built model and research files and computes
// the valuation: standalone multiple (forwardMedian x sector de-rating), TVS Credit on P/B, the other subsidiaries as
// the present value of losses to breakeven, the SOTP (base/bull/bear), the EV/EBITDA cross-check multiple, the
// segment build check against model revenue, and the street summary.
const fs = require('fs');
const path = require('path');
const { forwardMedian, forwardSeries } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { ratingFor, buyBelow: buyAt, sellAbove: sellAt } = require('../../src/ratings');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'TVSMOTOR', 'research');
const J = f => JSON.parse(fs.readFileSync(f, 'utf8'));
const M = J(path.join(ROOT, 'data', 'models', 'TVSMOTOR.json'));
const C = J(path.join(RD, 'company.json')), D = J(path.join(RD, 'deep.json')), SG = J(path.join(RD, 'segments.json')), AS = J(path.join(RD, 'assumptions.json'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, SC = M.forecast.scenarios, b = A.labels.length - 1;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026', price = M.price.last, shares = F.shares;
const n0 = v => Math.round(v).toLocaleString('en-IN'), n1 = v => (Math.round(v * 10) / 10).toLocaleString('en-IN', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const pc = v => `${v >= 0 ? '+' : '−'}${n1(Math.abs(v))}%`;
const median = a => { const s = [...a].sort((x, y) => x - y), m = s.length; return m % 2 ? s[(m - 1) / 2] : (s[m / 2 - 1] + s[m / 2]) / 2; };
const half = v => Math.round(v * 2) / 2, tenth = v => Math.round(v * 10) / 10;
const sep28 = e => (e[1] + e[2]) / 2;
// Sep-28E EPS exactly as the engine uses it (unrounded metric of the primary method), so the SOTP and the target agree
const primOf = B => B?.methods?.find(m => m.role === 'primary')?.metric;
const EPS = { base: primOf(V.blend) ?? sep28(F.eps), bull: primOf(SC.bull.blend) ?? sep28(SC.bull.eps), bear: primOf(SC.bear.blend) ?? sep28(SC.bear.eps) };

// 1. Standalone multiple: own one-year-forward P/E since Apr-2021 (house rule) x sector de-rating
const FM = forwardMedian('TVSMOTOR', M);
const pct = (arr, p) => { const s = [...arr].sort((x, y) => x - y); return s[Math.floor(p * s.length)]; };
const fv = FM.series.map(x => x[1]), FMp25 = pct(fv, 0.25), FMp75 = pct(fv, 0.75), FMmin = Math.min(...fv), FMmax = Math.max(...fv);
const fwdAll = forwardSeries('TVSMOTOR', M, 'eps');
const winMed = (from, to = '9999') => median(fwdAll.filter(x => x[0] >= from && x[0] <= to).map(x => x[1]));
const W = { since16: winMed('2016-04-01'), since23: winMed('2023-04-01'), fy17to20: winMed('2016-04-01', '2020-03-31') };
const fwdNow = price / F.eps[1];
const PEER_SYMS = ['TVSMOTOR', 'MARUTI', 'M&M', 'BAJAJ-AUTO', 'EICHERMOT', 'HEROMOTOCO', 'ASHOKLEY', 'ESCORTS'];
const PEERS = peersAsOf(PEER_SYMS, ASOF), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const med5 = sym => { const X = J(path.join(ROOT, 'data', 'raw', sym, 'screener.json')); return median((X.charts?.pe?.['Price to Earning'] || []).filter(([d, x]) => d <= ASOF && d >= '2021-09-30' && x > 0).map(x => x[1])); };
const MED5 = Object.fromEntries(PEER_SYMS.map(s => [s, med5(s)]));
const derate = Object.fromEntries(PEER_SYMS.map(s => [s, (P[s].pe / MED5[s] - 1) * 100]));
const EXCL = { TVSMOTOR: 'the company itself', ESCORTS: 'FY26 profit doubled on the gain from selling the railway equipment division (other income ₹1,618 cr vs ₹601 cr), so its trailing P/E is artificially low', ASHOKLEY: 'loss-making in FY21-22 (no P/E for 40 of the 260 weeks) and a recovery-year P/E of ~35x in 2023 distort its five-year median' };
const OTHERS = PEER_SYMS.filter(s => !EXCL[s]);
const sectorDr = median(OTHERS.map(s => derate[s])), sectorDrAll = median(PEER_SYMS.filter(s => s !== 'TVSMOTOR').map(s => derate[s]));
const factor = 1 + sectorDr / 100;
const MULT = { base: half(FM.median * factor), bull: half(FMp75 * factor), bear: half(FMp25 * factor) };
const shortName = s => ({ TVSMOTOR: 'TVS Motor', MARUTI: 'Maruti Suzuki', 'M&M': 'M&M (standalone)', 'BAJAJ-AUTO': 'Bajaj Auto', EICHERMOT: 'Eicher Motors', HEROMOTOCO: 'Hero MotoCorp', ASHOKLEY: 'Ashok Leyland', ESCORTS: 'Escorts Kubota' }[s] || s);

// 2. TVS Credit on P/B of Sep-28E book
const TC = C.tvsCredit, T26 = TC.annual.find(x => x.fy === 'FY26'), T25 = TC.annual.find(x => x.fy === 'FY25');
const stake = (TC.stake.afterDirect + TC.stake.mar26Indirect) / 100;
const roa26 = T26.pat / ((T26.aum + T25.aum) / 2) * 100;
const TCF = (() => { let aum = T26.aum, nw = T26.netWorth; const g = [18, 17, 16], roa = [3.2, 3.2, 3.2], out = [];
  for (let i = 0; i < 3; i++) { const a0 = aum; aum *= 1 + g[i] / 100; const pat = (a0 + aum) / 2 * roa[i] / 100, nw0 = nw; nw += pat; out.push({ fy: F.years[i], aum, pat, nw, roe: pat / ((nw + nw0) / 2) * 100, lev: aum / nw }); } return out; })();
const tcBook = (TCF[1].nw + TCF[2].nw) / 2;
const LENDERS = ['BAJFINANCE', 'CHOLAFIN', 'SHRIRAMFIN', 'M&MFIN', 'HDBFS', 'LTF', 'POONAWALLA'];
const LPB = LENDERS.map(s => { const L = J(path.join(ROOT, 'data', 'models', `${s}.json`)); const p = L.forecast.dcf.blend?.primary; return { sym: s, tpMult: p?.mult, fwdPb: L.price.last / L.forecast.F.bvps[0], roe: L.forecast.F.roe[1] }; });
const lenderMed = median(LPB.map(x => x.tpMult)), lenderFwdMed = median(LPB.map(x => x.fwdPb));
const deal = { value: TC.stake.impliedEquityValue, pbTrail: TC.stake.impliedEquityValue / TC.q1fy27.netWorth, pbSep28: TC.stake.impliedEquityValue / tcBook, pe: TC.stake.impliedEquityValue / (T26.pat - TC.q1fy27.q1fy26Pat + TC.q1fy27.pat) };
const tcKe = 14, tcG = 9, tcRoe = 16, justPb = (tcRoe - tcG) / (tcKe - tcG);
const PB = { base: tenth(lenderMed), bull: tenth(deal.pbTrail), bear: tenth(justPb) };
const tcPer = k => PB[k] * tcBook * stake / shares;

// 3. Other subsidiaries: present value (at Sep-27, Ke) of losses to breakeven, plus PT TVS and Ultraviolette
const ke = V.ke, pv = path_ => path_.reduce((s, l, t) => s + l / Math.pow(1 + ke / 100, t), 0);
const ptTvs = C.subsidiariesFY26.rows.find(r => /Indonesia/.test(r[0]))[1] * 15, uv = C.investmentsAtCost.fy26.ultraviolette;
const LOSS = { base: [-1000, -650, -300], bull: [-700, -300, 0], bear: [-1300, -1300, -1300, -800, -400] };
const OTH = Object.fromEntries(Object.entries(LOSS).map(([k, l]) => [k, { pvLoss: pv(l), value: pv(l) + ptTvs + uv }]));
const othPer = k => OTH[k].value / shares;

// 4. SOTP and the implied multiple of standalone Sep-28E EPS (carried into the engine by TVSMOTOR.sotp.js)
const SOTP = Object.fromEntries(['base', 'bull', 'bear'].map(k => { const sa = MULT[k] * EPS[k], tc = tcPer(k), ot = othPer(k), tot = sa + tc + ot; return [k, { eps: EPS[k], mult: MULT[k], standalone: sa, tvsCredit: tc, others: ot, perShare: tot, implied: tot / EPS[k] }]; }));
// EV/EBITDA cross-check: median trailing EV/EBITDA since Apr-2021 x the same de-rating, restated to Sep-28E EBITDA
const S = J(path.join(ROOT, 'data', 'raw', 'TVSMOTOR', 'screener.json'));
const evMed = median((S.charts?.evEbitda?.['EV Multiple'] || []).filter(([d, x]) => d >= '2021-04-01' && d <= ASOF && x > 0).map(x => x[1]));
const ttmEbitda = M.quarterly.ebitda.slice(-4).reduce((s, x) => s + x, 0), ebitdaSep28 = (F.ebitda[1] + F.ebitda[2]) / 2;
const evMult = { base: tenth(evMed * factor * ttmEbitda / ebitdaSep28) };
evMult.bull = tenth(evMult.base * MULT.bull / MULT.base); evMult.bear = tenth(evMult.base * MULT.bear / MULT.base);

// 5. Segment build vs model revenue (engine limit: one volume line)
const BL = AS.businessLines, bb = BL.base;
const BUILD = (() => { let u = { domIce: bb.domIce, ev: bb.ev, exp2w: bb.exp2w, w3: bb.w3 }, r = { domIce: bb.realDomIce, ev: bb.realEv, exp: bb.realExp }; const out = [];
  for (let i = 0; i < 3; i++) { for (const k of Object.keys(BL.growth)) u[k] *= 1 + BL.growth[k][i] / 100; for (const k of Object.keys(BL.realGrowth)) r[k] *= 1 + BL.realGrowth[k][i] / 100;
    const exp = u.exp2w + u.w3 * BL.exp3wShare[i], dom3w = u.w3 * (1 - BL.exp3wShare[i]);
    const dom = (u.domIce + dom3w) * r.domIce / 1e4, ev = u.ev * r.ev / 1e4, ex = exp * r.exp / 1e4, sub = dom + ev + ex, tot = sub / (1 - BL.incentivePct[i] / 100);
    out.push({ fy: F.years[i], units: { ...u, exp, dom3w }, real: { ...r }, dom, ev, exp: ex, incent: tot - sub, total: tot, vol: (u.domIce + u.ev + u.exp2w + u.w3) * 1000, model: F.sales[i], gap: (tot / F.sales[i] - 1) * 100 }); } return out; })();
const buildOk = BUILD.every(x => Math.abs(x.gap) < 0.5) && BUILD.every((x, i) => Math.abs(x.vol / F.volume[i] - 1) < 0.005);

// 6. Street and rating
const ST = D.street.brokers.filter(s => s.tp), tps = ST.map(s => s.tp);
const medTp = median(tps), avgTp = tps.reduce((s, x) => s + x, 0) / tps.length;
const avgEps = y => { const e = ST.filter(s => s.eps?.[y]); return e.reduce((t, s) => t + s.eps[y], 0) / e.length; };
const rating = ratingFor(V.upside), buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;
const shortDate = d => new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }).replace(' ', '-');

module.exports = { ROOT, RD, M, F, V, A, AS, SC, C, D, SG, b, ASOF, ASOF_TXT, price, shares, n0, n1, pc, median, EPS, FM, FMp25, FMp75, FMmin, FMmax, W, fwdNow,
  PEER_SYMS, PEERS, P, MED5, derate, EXCL, OTHERS, sectorDr, sectorDrAll, factor, MULT, shortName, TC, T25, T26, stake, roa26, TCF, tcBook, LPB, lenderMed, lenderFwdMed, deal, tcKe, tcG, tcRoe, justPb, PB, tcPer,
  ke, LOSS, OTH, ptTvs, uv, othPer, SOTP, evMed, ttmEbitda, ebitdaSep28, evMult, BUILD, buildOk, ST, medTp, avgTp, avgEps, rating, buyBelow, sellAbove, shortDate };
if (require.main === module) {
  console.log('FM', FM.median, 'p25/p75', FMp25, FMp75, 'trough', FM.troughYears, 'windows', W, 'fwdNow', fwdNow.toFixed(1));
  console.log('derate', Object.fromEntries(PEER_SYMS.map(s => [s, n1(derate[s])])), 'sector', n1(sectorDr), 'all', n1(sectorDrAll), 'MULT', MULT);
  console.log('TVSC book Sep-28E', n0(tcBook), 'PB', PB, 'lenders', LPB.map(x => `${x.sym} ${x.tpMult}/${x.fwdPb.toFixed(2)}`).join(' '), 'deal', JSON.stringify(deal));
  console.log('OTH', JSON.stringify(OTH)); console.log('SOTP', JSON.stringify(SOTP)); console.log('EV', evMed, evMult, 'ttm', ttmEbitda, 'sep28', ebitdaSep28);
  console.log('BUILD', BUILD.map(x => `${x.fy} build ${n0(x.total)} vs model ${n0(x.model)} (${n1(x.gap)}%) vol ${n0(x.vol)} vs ${n0(F.volume[BUILD.indexOf(x)])}`).join(' | '), 'ok', buildOk);
  console.log('TP', V.tp, 'upside', n1(V.upside), rating, 'street med', medTp, 'avg', n0(avgTp), 'n', ST.length);
}
