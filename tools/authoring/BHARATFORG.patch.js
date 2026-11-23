// BHARATFORG: two in-memory fixes applied by src/model.js on every build (patchRaw); idempotent.
// 1) Attributable profit. Screener's consolidated "Net Profit" row is before minority interests
//    (FY26 ₹1,089 cr) while "EPS in Rs" is after them (₹22.58). Minorities are small today but growing
//    (Premji Invest bought 23% of JS Autocast in Feb-2026), so we put Net Profit on Screener's own
//    "Profit for EPS" basis (FY26 ₹1,080 cr), as UPL.patch.js does. Implied FY26 shares = 1,080 / 22.58
//    = 47.83 cr, matching the 47.81 cr actually outstanding.
// 2) Post-QIP share count. Bharat Forge allotted 1,05,82,010 new shares at ₹1,890 in a ₹2,000 cr QIP that
//    closed on 22-Sep-2026, before our 30-Sep-2026 as-of date: shares went from 47.81 cr to 48.87 cr.
//    The engine has no share-issue line for industrial companies (it fixes shares at FY26 profit ÷ EPS),
//    so FY27E-FY29E EPS would be overstated by 2.2%. We therefore restate FY26 EPS to a pro forma
//    ₹22.10 (₹1,080 cr ÷ 48.87 cr); every forecast EPS and the target are then on the post-QIP share count.
//    Reported FY26 EPS was ₹22.58 (statement note in the report). House forward-P/E history reads
//    Screener's unpatched EPS, so the multiple history is unaffected.
const SHARES_POST_QIP = 48.87; // crore (Angel One / exchange filing, 23-Sep-2026)

function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const keep = { note: 'Net Profit = Screener "Profit for EPS"; FY26 EPS pro forma on 48.87 cr post-QIP shares. Originals below.', fetchedAt: S.fetchedAt, original: {} };
  for (const tab of ['profit-loss', 'quarters']) {
    const T = S.tables[tab];
    const pfe = S.schedules?.[tab]?.['Net Profit']?.['Profit for EPS'];
    if (!T || !pfe) throw new Error(`BHARATFORG patch: no Profit for EPS schedule for ${tab}`);
    const row = T.rows['Net Profit'];
    keep.original[tab] = row.slice();
    T.rows['Net Profit'] = T.periods.map((p, i) => (p === 'TTM' ? row[i] : typeof pfe[p] === 'number' ? pfe[p] : row[i]));
  }
  const pl = S.tables['profit-loss'], j = pl.periods.indexOf('Mar 2026');
  if (j >= 0) {
    keep.original.eps = pl.rows['EPS in Rs'].slice();
    pl.rows['EPS in Rs'][j] = Math.round(pl.rows['Net Profit'][j] / SHARES_POST_QIP * 100) / 100;
  }
  S._gamPatch = keep;
  return S;
}

module.exports = { patchRaw, SHARES_POST_QIP };
