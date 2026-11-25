// IOC: two in-memory fixes applied by src/model.js on every build (patchRaw); idempotent.
// 1) Attributable profit. Screener's consolidated "Net Profit" row is before minority interests (FY26 ₹43,677 cr)
//    while "EPS in Rs" is after them. Minorities are material: 48.11% of Chennai Petroleum (CPCL) plus 25% of Lanka
//    IOC (FY26 minority share ₹1,581 cr; FY23 ₹1,912 cr). We put Net Profit on Screener's own "Profit for EPS" basis
//    (FY26 ₹42,096 cr), as UPL.patch.js and TIINDIA.patch.js do.
// 2) Share count net of treasury shares. IOC has 1,412.12 cr shares in issue, of which 34.97 cr (2.48%) sit in the
//    IOC Shares Trust (treasury shares; the trust waived dividends from 2-Mar-2020). IOC computes EPS on the
//    1,377.16 cr shares outside the trust (AR FY26 consolidated EPS note; Q1FY27 results note 3), but Screener's EPS
//    divides by all 1,412.12 cr. The engine infers shares as Net Profit ÷ EPS, so we restate every annual and
//    quarterly EPS onto IOC's own basis (× 1,412.12 / 1,377.16): FY26 EPS becomes ₹30.57 (IOC reported ₹30.57;
//    Screener ₹29.81) and Q1FY27 ₹−1.18 (reported ₹−1.18). Market value and every per-share figure are then on
//    1,377.16 cr shares. House forward-P/E history (valuation-blend.js) reads Screener's unpatched EPS; our P/E
//    cross-check is computed on the patched basis in IOC.ctx.js instead.
const SH_ISSUED = 1412.1238383, SH_TRUST = 34.9677684, SH_NET = SH_ISSUED - SH_TRUST; // crore shares (AR FY26)
const K = SH_ISSUED / SH_NET;

function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const keep = { note: 'Net Profit = Screener "Profit for EPS"; EPS restated to 1,377.16 cr shares (net of IOC Shares Trust). Originals below.', fetchedAt: S.fetchedAt, original: {} };
  for (const tab of ['profit-loss', 'quarters']) {
    const T = S.tables[tab];
    const pfe = S.schedules?.[tab]?.['Net Profit']?.['Profit for EPS'];
    if (!T || !pfe) throw new Error(`IOC patch: no Profit for EPS schedule for ${tab}`);
    const row = T.rows['Net Profit'], eps = T.rows['EPS in Rs'];
    keep.original[tab] = { netProfit: row.slice(), eps: eps.slice() };
    T.rows['Net Profit'] = T.periods.map((p, i) => (p === 'TTM' ? row[i] : typeof pfe[p] === 'number' ? pfe[p] : row[i]));
    T.rows['EPS in Rs'] = eps.map(v => (typeof v === 'number' ? Math.round(v * K * 1e4) / 1e4 : v));
  }
  // 3) Capex. IOC's cash-flow statement shows spending on capital work in progress on its own line; Screener keeps it
  //    in "Capital WIP", so "Fixed assets purchased" (FY26 ₹4,002 cr) misses ~85% of capex. The engine reads capex
  //    from that line only, so we add the CWIP line back: FY26 ₹28,362 cr (₹4,002 + ₹24,360 cr).
  const inv = S.schedules?.['cash-flow']?.['Cash from Investing Activity'];
  if (inv?.['Fixed assets purchased'] && inv?.['Capital WIP']) {
    keep.original.fixedAssetsPurchased = { ...inv['Fixed assets purchased'] };
    for (const p of Object.keys(inv['Fixed assets purchased'])) {
      const a = inv['Fixed assets purchased'][p], c = inv['Capital WIP'][p];
      if (typeof a === 'number' && typeof c === 'number') inv['Fixed assets purchased'][p] = a + c;
    }
  }
  S._gamPatch = keep;
  return S;
}

module.exports = { patchRaw, SH_ISSUED, SH_TRUST, SH_NET };
