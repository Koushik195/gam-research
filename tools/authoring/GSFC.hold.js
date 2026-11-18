// GSFC holding-discount history (house method, as GODREJIND): GSFC's market value vs its look-through
// value (LTV) at each quarter-end since Jun-2021. LTV = core business at k x trailing EBITDA + listed
// holdings at that day's closes + unlisted holdings at the latest March book + net cash (March balance
// sheets, interpolated in between; Mar-27 = our estimate). Discount = 1 - market value / LTV.
// "Normal" quarters: trailing EBITDA within 1.5x either side of the window median, which leaves out
// the FY22-23 boom (LTV inflated by peak EBITDA) and the FY25 trough (LTV deflated), the same idea as
// the house rule that drops trough years from forward P/E medians.
const med = a => { const s = a.filter(x => x != null).slice().sort((x, y) => x - y); return s.length ? (s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2) : null; };

function holdHistory(H, nc27, k = 6) {
  const ncM = { ...H.netCashMar, 2027: nc27 };
  const ncAt = d => { const y = +d.slice(0, 4), m = +d.slice(5, 7); return m <= 3 ? ncM[y] : ncM[y] + (ncM[y + 1] - ncM[y]) * (m - 3) / 12; };
  const rows = H.rows.map(([d, close, listed, unlisted, ebitda]) => {
    const mcap = close * H.shares, nc = ncAt(d), core = k * ebitda, ltv = core + listed + unlisted + nc;
    return { d, close, mcap, listed, unlisted, ebitda, nc, core, ltv, disc: (1 - mcap / ltv) * 100, mcapToListed: mcap / listed, impliedCore: mcap - listed - unlisted - nc };
  });
  const ebMed = med(rows.map(r => r.ebitda));
  rows.forEach(r => (r.normal = r.ebitda <= 1.5 * ebMed && r.ebitda >= ebMed / 1.5));
  return { rows, ebMed, medAll: med(rows.map(r => r.disc)), medNormal: med(rows.filter(r => r.normal).map(r => r.disc)), medRecent: med(rows.filter(r => r.d >= '2024-09-30').map(r => r.disc)),
    nNormal: rows.filter(r => r.normal).length, medMcapToListed: med(rows.map(r => r.mcapToListed)), medImpliedCoreX: med(rows.map(r => r.impliedCore / r.ebitda)), ncAt };
}

// The same measure on 30-Sep-2026: TTM EBITDA to Q1FY27, holdings at the 30-Sep closes, net cash
// interpolated between Mar-26 (actual) and Mar-27E (model).
function holdNow(H, nc27, ttmEbitda, k = 6) {
  const A = H.asOf, mcap = A.close * H.shares, nc = H.netCashMar[2026] + (nc27 - H.netCashMar[2026]) * 0.5;
  const ltv = k * ttmEbitda + A.listed + A.unlistedFv + A.associates + nc;
  return { mcap, nc, ltv, disc: (1 - mcap / ltv) * 100, impliedCore: mcap - A.listed - A.unlistedFv - A.associates - nc, ncJunActual: H.netCashJun26Actual.value,
    discJunCash: (1 - mcap / (k * ttmEbitda + A.listed + A.unlistedFv + A.associates + H.netCashJun26Actual.value)) * 100 };
}

module.exports = { holdHistory, holdNow, med };
