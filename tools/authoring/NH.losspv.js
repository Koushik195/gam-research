// Narayana: present value of start-up losses still to come (India clinics + India insurance; Cayman insurance), used for
// the `adj` lines of the sum of the parts (NH.ctx.js re-checks the values written to assumptions.json). Losses from the
// 12-month target date (Sep-2027): half of FY28E (Oct-27 to Mar-28, mid-point 0.25 years out), FY29E (1 year), then a
// straight-line run-off from the FY29E level to zero in the stated breakeven year (2, 3, ... years out). Case EBITDA =
// segment revenue × (base margin + scenario margin delta); revenue has no scenario delta for these segments.
// Discounted at the cost of equity in assumptions.valuation.lossPV.ke. Pre-tax EBITDA losses (conservative).
function pvLosses(A, key, kase) {
  const LP = A.valuation.lossPV, seg = A.segments.find(s => s.key === key), d = kase === 'base' ? 0 : (A.scenarios[kase].segments?.[key]?.marginDelta || 0);
  let rev = seg.base; const ebitda = seg.growth.map((g, i) => { rev *= 1 + g / 100; return rev * (seg.marginPct[i] + d) / 100; });
  const be = +LP[key].breakeven[kase].slice(2, 4), fy29 = ebitda[2];
  const flows = [['H2FY28E', 0.25, Math.min(0, ebitda[1] / 2)], ['FY29E', 1, Math.min(0, fy29)]];
  if (fy29 < 0) for (let fy = 30; fy < be; fy++) flows.push([`FY${fy}E`, fy - 28, fy29 * (be - fy) / (be - 29)]);
  const pv = flows.reduce((s, [, t, x]) => s + x / Math.pow(1 + LP.ke / 100, t), 0);
  return { pv, flows: flows.map(([y, t, x]) => [y, t, Math.round(x * 10) / 10]), breakeven: LP[key].breakeven[kase] };
}
module.exports = { pvLosses };
