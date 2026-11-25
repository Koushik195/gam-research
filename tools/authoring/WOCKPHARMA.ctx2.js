// Wockhardt initiation, context part 2: (1) earnings without Zaynich; (2) the depreciation sensitivity (the engine's single
// rate vs our bottom-up path with Zaynich amortisation from launch); (3) a Zaynich risked NPV on sourced inputs (approved in
// the US and India; EU/EM filings at the 90.6% NDA-to-approval rate; WCK 6777 at phase 2 shown, not valued); (4) what the
// 30-Sep price implies for Zaynich after valuing the base business at the peers' multiple; (5) the SOTP sensitivity.
// None of these enters the base target (PLAYBOOK §7c: sensitivities only). As of 30-Sep-2026.
const X = require('./WOCKPHARMA.ctx');
const { C, F, V, AS, YRS, SHARES, price, mcap, sep, epsSep28, peMult, OWN, win, fyOf, k, baseEbitda, zEbitda, lines, zParts, P, PEER_SET, medOf, half, netDebt26 } = X;
const SR = C.successRates, KE = V.ke, T = AS.taxRate.map(t => t / 100);

// (1) Earnings without Zaynich: base EBITDA - base depreciation (the engine's depreciation is base only) + other income -
//     finance cost (the engine's interest input = finance cost + Zaynich amortisation, engine workaround), taxed
const BASE_DEP = F.dep, FIN = AS.financeCost, Z_AMORT = AS.zaynichAmortisation;
YRS.forEach((y, i) => { if (Math.abs(F.interest[i] - FIN[i] - Z_AMORT[i]) > 0.5) throw new Error(`WOCKPHARMA interest input ${y} != finance cost + Zaynich amortisation`); });
const exZ = YRS.map((_, i) => { const pbt = baseEbitda[i] - BASE_DEP[i] + F.otherIncome[i] - FIN[i]; return { pbt, pat: pbt * (1 - T[i]), eps: pbt * (1 - T[i]) / SHARES }; });
const zDrag = YRS.map((_, i) => F.eps[i] - exZ[i].eps); // EPS impact of Zaynich (launch losses + amortisation)

// (2) Amortisation sensitivity: the target if Zaynich amortisation follows another path (EPS restated each year, the forward
//     P/E window re-derived on the restated FY27E/FY28E EPS, factor and rounding unchanged)
function amortCase(alt) {
  const e = YRS.map((_, i) => F.eps[i] - (alt[i] - Z_AMORT[i]) * (1 - T[i]) / SHARES), by = { 2027: e[0], 2028: e[1], 2029: e[2] };
  const w = win.map(([d, pe, fy]) => pe * F.eps[fy - 2027] / by[fy]).sort((a, b) => a - b), med = w[Math.floor(w.length / 2)];
  const mult = half(med * k), es = (e[1] + e[2]) / 2;
  return { alt, eps: e, med, mult, epsSep: es, tp: Math.round(mult * es / 10) * 10 };
}
const AMORT_CASES = [
  { key: 'short', label: '11.5-year life from launch (to the 2038 patent expiry)', ...amortCase([25, 100, 100]) },
  { key: 'approval', label: 'From approval (Jun-2026) over 15 years', ...amortCase([64, 77, 77]) },
  { key: 'late', label: 'No amortisation until FY28 (capitalised "by FY28")', ...amortCase([0, 88, 88]) },
  { key: 'single', label: 'A single engine rate (4.45% on gross block, our first build)', ...amortCase([63, 66, 70]) },
];

// (3) Zaynich risked NPV (per share, at 30-Sep-2026). Revenue: our FY27-29E build, then a straight-line ramp to the peak in
//     FY34 (seven years after the US launch), flat to FY38 (composition patent to 2038), then -35% a year. EBITDA margin from
//     our build to 40% at peak. Tax 25% from FY30. Working capital 20% of the revenue increase. Discounted at the 13.4% cost of
//     equity, mid-year. EU and emerging-market revenue (not yet approved) x 90.6% (BIO 2011-20 NDA-to-approval). Non-India
//     value x 85.85% (Bio AG holds the US/EU business; 14.15% minority). India share of revenue taken as in our FY29E build.
const USDINR = 94, FY = n => 2027 + n;
function zNpv(peakUsdMn, { margin = 40, peakFy = 2034, ke = KE } = {}) {
  const peak = peakUsdMn * USDINR / 10, r = [], z29 = lines.zaynich[2];
  for (let n = 0; FY(n) <= 2045; n++) {
    const fy = FY(n); let rev, m;
    if (n < 3) { rev = lines.zaynich[n]; m = zEbitda[n] / rev * 100; }
    else if (fy <= peakFy) { rev = z29 + (peak - z29) * (fy - 2029) / (peakFy - 2029); m = zEbitda[2] / z29 * 100 + (margin - zEbitda[2] / z29 * 100) * (fy - 2029) / (peakFy - 2029); }
    else if (fy <= 2038) { rev = peak; m = margin; } else { rev = peak * Math.pow(0.65, fy - 2038); m = margin; }
    r.push({ fy, rev, m });
  }
  const euEmShare = n => (n < 3 ? zParts.euEm[n] / lines.zaynich[n] || 0 : zParts.euEm[2] / lines.zaynich[2]);
  const indiaShare = zParts.india[2] / lines.zaynich[2];
  let npv = 0, prevRev = 0;
  r.forEach((x, n) => {
    const prob = 1 - euEmShare(n) * (1 - SR.ndaToApproval / 100), ebitda = x.rev * x.m / 100, tax = Math.max(ebitda, 0) * (n < 3 ? T[n] : 0.25);
    const fcf = (ebitda - tax - 0.2 * (x.rev - prevRev)) * prob * (indiaShare + (1 - indiaShare) * 0.8585); prevRev = x.rev;
    npv += fcf / Math.pow(1 + ke / 100, n + 0.5 - 0.5); // FY27 cash flows ~mid-FY27 ≈ 6 months after 30-Sep-2026
  });
  return { npv, perShare: npv / SHARES, path: r };
}
// GAM peak: the chairman's US$1bn US market for new Gram-negative antibiotics x 22.5% (his 20-25% long-term share), and
// the US at ~40% of global revenue (his rule of thumb): US$225mn US, ~US$560mn global.
const PEAK_GAM = Math.round(1000 * 0.225 / 0.4), Z_GAM = zNpv(PEAK_GAM), Z_MGMT = zNpv(1500), Z_MGMT2 = zNpv(2000);

// (4) What the price implies: EV at 30-Sep less the base business at the nine peers' median trailing EV/EBITDA on FY27E
//     base EBITDA (a one-year-forward proxy); solve the Zaynich peak whose NPV fills the gap.
const peerEv = medOf(PEER_SET.map(s => P[s].evEbitda)), peerPe = medOf(PEER_SET.map(s => P[s].pe));
const evMkt = mcap + netDebt26, baseValue = peerEv * baseEbitda[0], impliedZ = evMkt - baseValue;
let lo = 100, hi = 6000; for (let i = 0; i < 50; i++) { const mid = (lo + hi) / 2; if (zNpv(mid).npv < impliedZ) lo = mid; else hi = mid; }
const PEAK_IMPLIED = Math.round((lo + hi) / 2);

// (5) SOTP sensitivity: base business at the peers' median trailing P/E on Sep-28E ex-Zaynich EPS + Zaynich NPV (GAM peak)
//     rolled 12 months at the cost of equity
const exZSep = (exZ[1].eps + exZ[2].eps) / 2;
const sotpTp = Math.round((peerPe * exZSep + Z_GAM.perShare * (1 + KE / 100)) / 10) * 10;
const sotpMgmt = Math.round((peerPe * exZSep + Z_MGMT.perShare * (1 + KE / 100)) / 10) * 10;


module.exports = { BASE_DEP, FIN, Z_AMORT, exZ, zDrag, amortCase, AMORT_CASES, zNpv, PEAK_GAM, Z_GAM, Z_MGMT, Z_MGMT2, peerEv, peerPe, evMkt, baseValue, impliedZ, PEAK_IMPLIED, exZSep, sotpTp, sotpMgmt, USDINR };

if (require.main === module) {
  console.log('exZ eps', exZ.map(e => e.eps.toFixed(1)), 'model eps', F.eps, 'drag', zDrag.map(v => v.toFixed(1)));
  AMORT_CASES.forEach(c => console.log(c.key, c.alt, 'eps', c.eps.map(v => v.toFixed(1)), 'med', c.med.toFixed(1), 'mult', c.mult, 'tp', c.tp));
  console.log('Z NPV GAM peak US$', PEAK_GAM, 'mn', Math.round(Z_GAM.npv), 'cr =', Z_GAM.perShare.toFixed(0), '/sh | mgmt 1.5bn', Z_MGMT.perShare.toFixed(0), '| 2bn', Z_MGMT2.perShare.toFixed(0));
  console.log('peer EV/EBITDA', peerEv, 'P/E', peerPe, '| EV mkt', Math.round(evMkt), 'base value', Math.round(baseValue), 'implied Z', Math.round(impliedZ), 'implied peak US$mn', PEAK_IMPLIED);
  console.log('exZ Sep28', exZSep.toFixed(1), 'SOTP tp', sotpTp, 'mgmt', sotpMgmt);
}
