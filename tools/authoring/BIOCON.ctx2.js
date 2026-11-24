// Biocon initiation: shared context, part 2. The biosimilars multiple from Biocon's own look-through history, the sum of
// the parts per case (carried into the engine as an implied P/E by BIOCON.sotp.js), the consolidated EV/EBITDA and P/E
// histories (cross-check and sensitivity), the street and the rating. As of 30-Sep-2026.
const X = require('./BIOCON.ctx');
const { S, SYN, F, V, A, AS, SC, ASOF, n0, n1, half, pct, at, b, YRS, sep, price, SHARES, fyOf, ebs, corp, SY, ndBio, ndOwn, AUD, MGEN, kev, k, M, D } = X;
const { forwardMedian, forwardSeries } = require('./valuation-blend');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor, ruleText } = require('../../src/ratings');
const medOf = X.medOf;

// ---- 1) Biocon's look-through one-year-forward EV/EBITDA of the biosimilars business, Apr-2023 to 30-Sep-2026 -------
// Window starts in FY24: the first full year after the Viatris biosimilars deal (closed 29-Nov-2022; it doubled the
// business and added $1.2 bn of acquisition debt and a 23-24% minority in BBL) and after Biocon cut its Syngene stake
// from 70.4% (Mar-22) to 54.9% (Mar-23). Earlier prices value a different company (PLAYBOOK §4: "or from a demerger").
// EV attributable to Biocon's shareholders = market value − Syngene stake at market less 20% + (1 − m) x net debt ex
// Syngene − generics at Aurobindo's forward median (8.9x) − the one-time US lenalidomide EBITDA (FY25, at 1x).
// Divided by (1 − m) x next-full-year EBITDA of biosimilars incl. corporate costs. m = minorities' share of BBL
// (AR FY25/FY26 note 39: 24.4% Mar-24, 23.2% Mar-25, 1.3% Mar-26; 0 from 29-Jun-2026). All non-Syngene net debt is
// treated as BBL's (the acquisition debt and notes are BBL's; Biocon standalone's structured NCDs were < Rs1,600 cr).
const SH_EVENTS = [['2025-06-19', 133.70], ['2026-01-05', 150.83], ['2026-01-14', 162.09], ['2026-06-29', 162.97]]; // AR FY26; MOSL 6-Aug-26
const sharesAt = d => SH_EVENTS.filter(([x]) => x <= d).map(x => x[1]).pop() || 120.06;
const synStake = d => (d < '2024-12-01' ? 54.9 : d < '2026-04-01' ? 52.5 : 52.4) / 100; // AR FY25/FY26; Syngene promoter holding fell in the Dec-24 quarter
const synShares = d => (d < '2026-05-31' ? 40.2 : 40.3);
const mAt = d => (d < '2024-04-01' ? 0.244 : d < '2026-01-05' ? 0.232 : d < '2026-06-29' ? 0.013 : 0);
const ND_EX = { 2023: 13550 + 635, 2024: 13018 + 557, 2025: 13115 + 856, 2026: 10461 + 1116 }; // consolidated net debt (Screener: borrowings − cash − investments) + Syngene net cash, at March
const ND_EX_JUN26 = (15551 - 2354 - 479 - 1620) + 1116; // Jun-26 balance sheet (Q1FY27 fact sheet), Syngene at Mar-26
const STEPS = [['2025-06-19', -4500], ['2026-01-05', 1800], ['2026-01-14', -4150], ['2026-01-21', 1800]]; // QIPs in, Mylan cash out ($200 mn x 2)
const dayFrac = (d, from, to) => (new Date(d) - new Date(from)) / (new Date(to) - new Date(from));
function ndExAt(d) { // linear between March balance sheets, with the FY26 cash events as steps; Q1FY27 to the Jun-26 balance sheet
  if (d >= '2026-06-30') return ND_EX_JUN26;
  if (d >= '2026-04-01') return ND_EX[2026] + (ND_EX_JUN26 - ND_EX[2026]) * dayFrac(d, '2026-03-31', '2026-06-30');
  const y = +d.slice(0, 4) - (d.slice(5) < '04-01' ? 1 : 0), from = `${y}-03-31`, to = `${y + 1}-03-31`;
  const steps = STEPS.filter(([x]) => x > from && x <= to), stepTot = steps.reduce((s, x) => s + x[1], 0), stepTo = steps.filter(([x]) => x <= d).reduce((s, x) => s + x[1], 0);
  return ND_EX[y] + (ND_EX[y + 1] - ND_EX[y] - stepTot) * dayFrac(d, from, to) + stepTo;
}
const ebCons = {}; { const pl = S.tables['profit-loss']; pl.periods.forEach((p, i) => { if (/^Mar \d{4}$/.test(p)) ebCons[+p.slice(-4)] = pl.rows['Operating Profit'][i]; }); }
const ebSyn = X.ebOf(SYN);
const LENA25 = 281; // one-time US lenalidomide EBITDA in FY25: generics EBITDA Rs377 cr reported vs Rs96 cr ex-lenalidomide (Q4FY26 presentation: FY26 Rs166 cr = +73% like for like)
const E_GEN = { 2025: 296.9 - LENA25, 2026: 43.0, 2027: ebs.generics[0], 2028: ebs.generics[1], 2029: ebs.generics[2] };
const E_EX = { 2025: ebCons[2025] - ebSyn[2025] - LENA25, 2026: ebCons[2026] - ebSyn[2026] };
YRS.forEach((y, i) => (E_EX[2027 + i] = F.ebitda[i] - ebs.services[i]));
const E_BS = Object.fromEntries(Object.keys(E_EX).map(y => [y, E_EX[y] - E_GEN[y]])); // biosimilars incl. corporate costs
const DISC = 0.2;
const bioPx = S.charts.price.Price.filter(([d]) => d >= '2023-04-01' && d <= ASOF); if (bioPx.at(-1)[0] < ASOF) bioPx.push([ASOF, price]);
const synPxS = SYN.charts.price.Price.filter(([d]) => d <= ASOF);
const synPxAt = d => (d === ASOF ? SY.price : at(synPxS, d));
const lookRow = ([d, px]) => {
  const fy = fyOf(d), m = mAt(d), mc = px * sharesAt(d), syn = synStake(d) * synPxAt(d) * synShares(d), nd = ndExAt(d);
  const evAttr = mc - (1 - DISC) * syn + (1 - m) * nd - AUD.med * E_GEN[fy] - (fy === 2025 ? LENA25 : 0);
  return { d, px, fy, m, mc, syn, nd, evAttr, ebBs: E_BS[fy], mult: evAttr / ((1 - m) * E_BS[fy]) };
};
const LOOK = bioPx.map(lookRow);
const lv = LOOK.map(r => r.mult);
const HBS = { med: pct(lv, 0.5), p25: pct(lv, 0.25), p75: pct(lv, 0.75), min: Math.min(...lv), max: Math.max(...lv), now: LOOK.at(-1).mult, n: lv.length };
const byFy = fy => pct(LOOK.filter(r => r.d.slice(0, 4) - (r.d.slice(5) < '04-01') === fy).map(r => r.mult), 0.5);
const HBS_BYFY = { FY24: byFy(2023), FY25: byFy(2024), FY26: byFy(2025), FY27: byFy(2026) };
const MBS = { base: half(HBS.med * kev), bull: half(HBS.p75 * kev), bear: half(HBS.p25 * kev) };
// sensitivities on the same window: Syngene at full market value; minorities at book (no pro rata); generics at 10x (MOSL)
const sensMed = f => pct(bioPx.map(f), 0.5);
const SENS = {
  synFull: sensMed(([d, px]) => { const r = lookRow([d, px]); return (r.evAttr - DISC * r.syn) / ((1 - r.m) * r.ebBs); }),
  noMinority: sensMed(([d, px]) => { const r = lookRow([d, px]); return (r.mc - (1 - DISC) * r.syn + r.nd - AUD.med * E_GEN[r.fy] - (r.fy === 2025 ? LENA25 : 0)) / r.ebBs; }),
  gen10: sensMed(([d, px]) => { const r = lookRow([d, px]); return (r.evAttr + (AUD.med - 10) * E_GEN[r.fy]) / ((1 - r.m) * r.ebBs); }),
};

// ---- 2) Sum of the parts per case at Sep-28E ---------------------------------------------------------------------
const BICARA = { shares: 5523897, px: 18.61, fx: 95.81 }; // AR FY26 note 5; Nasdaq close 30-Sep-2026; PTI rupee close
BICARA.valueCr = BICARA.shares * BICARA.px * BICARA.fx / 1e7;
const SYN_MV = SY.stake / 100 * SY.price * SY.shares; // Biocon's 52.4% of Syngene at the 30-Sep close (Rs365.3 x 40.3 cr shares)
const ebB = YRS.map((_, i) => ebs.biosimilars[i] + corp[i]), ebG = ebs.generics;
const caseEb = c => { if (c === 'base') return F.ebitda; const s = AS.scenarios[c]; let sales = A.sales[b]; return YRS.map((_, i) => (sales *= 1 + (AS.revenueGrowth[i] + s.revenueGrowthDelta) / 100) * (AS.ebitdaMargin[i] + s.marginDelta) / 100); };
const caseEps = c => (c === 'base' ? F.pat.map(p => p / SHARES) : SC[c].eps);
function sotp(c) {
  const eb = caseEb(c), scale = YRS.map((_, i) => eb[i] / F.ebitda[i]); // scenario EBITDA allocated pro rata to the segments
  const bs = sep(ebB.map((x, i) => x * scale[i])), gen = sep(ebG.map((x, i) => x * scale[i]));
  const dPat = YRS.map((_, i) => (caseEps(c)[i] - caseEps('base')[i]) * SHARES); // extra profit lowers net debt
  const nd = sep(ndBio.map((x, i) => x - dPat.slice(0, i + 1).reduce((s, y) => s + y, 0)));
  const parts = [
    { key: 'bs', name: 'Biosimilars (incl. corporate costs)', method: `${MBS[c]}x Sep-28E EBITDA ₹${n0(bs)} cr`, value: MBS[c] * bs, metric: bs, mult: MBS[c] },
    { key: 'gen', name: 'Generics (APIs and formulations)', method: `${MGEN[c]}x Sep-28E EBITDA ₹${n0(gen)} cr`, value: MGEN[c] * gen, metric: gen, mult: MGEN[c] },
    { key: 'nd', name: 'Less: biopharma net debt at Sep-28E', method: 'Group net debt less Syngene\'s cash and the Bicara stake (our path)', value: -nd },
    { key: 'syn', name: 'Syngene: 52.4% stake', method: `Market value ₹${n0(SYN_MV)} cr at the 30-Sep close, less 20%`, value: SYN_MV * (1 - DISC) },
    { key: 'bic', name: 'Bicara Therapeutics: 5.52 mn shares', method: `$${BICARA.px} x ₹${BICARA.fx}/$ = ₹${n0(BICARA.valueCr)} cr, less 20%`, value: BICARA.valueCr * (1 - DISC) },
  ];
  const total = parts.reduce((s, p) => s + p.value, 0), perShare = total / SHARES, eps = sep(caseEps(c));
  return { c, parts, total, perShare, eps, implied: perShare / eps, bsEb: bs, genEb: gen, nd };
}
const SOTP = Object.fromEntries(['base', 'bull', 'bear'].map(c => [c, sotp(c)]));

// ---- 3) Cross-check: consolidated EV/EBITDA, Biocon's own trailing history (Screener 'EV Multiple', EBITDA incl. other
// income) since Apr-2021 x the EV factor, restated to Sep-28E EBITDA before other income -----------------------------
const evHist = (S.charts.evEbitda['EV Multiple'] || []).filter(([d, x]) => d >= '2021-04-01' && d <= ASOF && x > 0).map(x => x[1]);
const EVH = { med: pct(evHist, 0.5), p25: pct(evHist, 0.25), p75: pct(evHist, 0.75), now: X.P.BIOCON.evEbitda };
const ttmChart = at((S.charts.evEbitda.EBITDA || []).filter(([d]) => d <= ASOF), ASOF), ebitdaSep28 = sep(F.ebitda);
const EVM = { base: half(EVH.med * kev * ttmChart / ebitdaSep28), bull: half(EVH.p75 * kev * ttmChart / ebitdaSep28), bear: half(EVH.p25 * kev * ttmChart / ebitdaSep28) };

// ---- 4) P/E history (sensitivity only): house forwardMedian on reported EPS, and on EPS before one-offs (MOSL adjusted PAT)
const FM = forwardMedian('BIOCON', M);
const ADJ_PAT = { 2023: 749.1, 2024: 216.6, 2025: 245.2, 2026: 424.0 }; // MOSL 6-Aug-2026 'Adjusted PAT' (Rs cr): before exceptional items and one-off gains
const epsAdjBy = {}; Object.entries(ADJ_PAT).forEach(([y, p]) => (epsAdjBy[y] = p / (y < 2026 ? 120.06 : SHARES))); YRS.forEach((y, i) => (epsAdjBy[2027 + i] = F.pat[i] / SHARES));
const fwdAdj = S.charts.price.Price.filter(([d]) => d >= '2022-04-01' && d <= ASOF).map(([d, px]) => [d, px / epsAdjBy[fyOf(d)]]).filter(x => x[1] > 0);
const PEADJ = { med: pct(fwdAdj.map(x => x[1]), 0.5), min: Math.min(...fwdAdj.map(x => x[1])), max: Math.max(...fwdAdj.map(x => x[1])) };
const fwdPe = forwardSeries('BIOCON', M, 'eps').filter(x => x[0] >= '2016-04-01');
const peNowSep = price / sep(F.pat.map(p => p / SHARES)), peNow28 = price / (F.pat[1] / SHARES);

// ---- 5) Rating and street -----------------------------------------------------------------------------------------
const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;
const ST = (D.street && D.street.brokers) || [];
const withTp = ST.filter(s => s.tp && s.standing), medTp = withTp.length ? medOf(withTp.map(s => s.tp)) : null;
const dcfLessMi = (mv('dcf') ? mv('dcf').value : V.perShare) - SY.minority / 100 * SY.price * SY.shares / SHARES;
const tpCheck = Math.round(SOTP.base.perShare / 10) * 10;
if (!process.env.TP_NOCHECK && M.forecast.dcf.blend && Math.abs(V.tp - tpCheck) > 10) throw new Error(`BIOCON target ${V.tp} != SOTP ${tpCheck}: run node tools/authoring/BIOCON.sotp.js then node src/model.js BIOCON`);

module.exports = { ...X, sharesAt, synStake, mAt, ND_EX, ND_EX_JUN26, STEPS, ndExAt, ebCons, ebSyn, LENA25, E_GEN, E_EX, E_BS, DISC, LOOK, HBS, HBS_BYFY, MBS, SENS,
  BICARA, SYN_MV, ebB, ebG, caseEb, caseEps, SOTP, evHist, EVH, ttmChart, ebitdaSep28, EVM, FM, ADJ_PAT, epsAdjBy, fwdAdj, PEADJ, fwdPe, peNowSep, peNow28,
  BM, mv, rating, ruleText, buyBelow, sellAbove, ST, withTp, medTp, dcfLessMi, tpCheck };

if (require.main === module) {
  const Y = module.exports;
  console.log('HBS', JSON.stringify(Object.fromEntries(Object.entries(HBS).map(([a, v]) => [a, +v.toFixed(2)]))), 'byFY', JSON.stringify(HBS_BYFY), 'MBS', MBS, 'MGEN', MGEN, 'AUD', AUD);
  console.log('SENS', JSON.stringify(SENS), 'E_BS', JSON.stringify(E_BS), 'E_GEN', JSON.stringify(E_GEN));
  LOOK.filter((_, i) => i % 26 === 0 || i === LOOK.length - 1).forEach(r => console.log(r.d, 'px', r.px, 'mc', n0(r.mc), 'syn', n0(r.syn), 'nd', n0(r.nd), 'm', r.m, 'fy', r.fy, 'mult', r.mult.toFixed(1)));
  ['base', 'bull', 'bear'].forEach(c => { const s = SOTP[c]; console.log(c, s.parts.map(p => `${p.key} ${n0(p.value)}`).join(' | '), '=> Rs', s.perShare.toFixed(1), 'eps', s.eps.toFixed(2), 'implied', s.implied.toFixed(2)); });
  console.log('EVH', EVH, 'ttmChart', ttmChart, 'ebitdaSep28', n0(ebitdaSep28), 'EVM', EVM, '| FM', FM.median, FM.medianAll, FM.troughYears, '| PEADJ', JSON.stringify(PEADJ));
  console.log('TP', V.tp, 'upside', V.upside.toFixed(1), rating, BM.map(m => `${m.key} ${Math.round(m.value)}`).join(' '), 'scen', SC.bull.tp, SC.bear.tp, 'dcf less MI', dcfLessMi.toFixed(0));
}
