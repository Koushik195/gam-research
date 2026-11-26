// ONESOURCE: corrections to Screener's consolidated data, applied in memory by src/model.js on every build (patchRaw).
// Idempotent; originals kept under _gamPatch. Never edit screener.json by hand.
// 1) PRE-DEMERGER YEARS. OneSource is the former Stelis Biopharma. Strides' soft-gel CDMO business and Steriscience's
//    injectables CDMO business were merged into it under an NCLT-sanctioned scheme (order 14-Nov-2024) effective
//    1-Apr-2024, so FY25 is the first year of the combined company. Screener's FY21-FY23 columns (and the Sep-2023 to
//    Mar-2024 quarters) are Stelis alone (revenue Rs21-132 cr, losses of Rs121-800 cr, a biologics business partly sold
//    to Syngene). We drop FY21-FY23 and those three quarters. FY24 (Stelis alone, revenue Rs172 cr) is kept only so the
//    engine has three balance sheets (as ITCHOTELS keeps its part-year FY24); it is labelled pre-demerger in the report
//    and never used for growth. The company's pro-forma FY24 (revenue Rs1,082 cr, EBITDA Rs225 cr) is in segments.json.
// 2) SHARE COUNT. The engine infers shares as FY26 Net Profit / EPS; Screener's rounded figures (-74 / -6.44) give
//    11.49 cr. We set FY26 Net Profit to the audited -Rs73.80 cr (AR FY26 P&L: -738.03 mn) and FY26 EPS to that profit
//    over the share count standing on 30-Sep-2026, 11,46,69,991 (after the 8-Jul-2026 ESOP allotment of 24,190 shares;
//    11,46,21,201 at Mar-26, AR note 11A; +21,450 on 9-Apr-2026, +3,150 on 13-May-2026). EPS shows as -6.44 either way.
//    Net Profit equals attributable profit (no minority interests: all subsidiaries are wholly owned, AR note 31).
// 3) LOOK-AHEAD ON THE COVER (Team B note, 24-Nov-2026). Screener's market cap uses the live (Nov-2026) share count;
//    we restate it on the 30-Sep-2026 count (the as-of freeze then rescales it to the 30-Sep close). The yearly
//    shareholding table carries an off-cycle "Sep 2026" column; we drop non-March yearly columns. The quarterly table's
//    Sep-2026 column and the Sep-2026 quarter/half-year balance sheet are removed by the as-of freeze itself.
// Not changed (explained in the report): Screener nets exceptional items into Other Income (FY26: Rs15.0 cr less
// Rs10.1 cr); scheme amortisation (Rs137.8 cr a year) sits in depreciation, in history and forecasts alike.
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', '..', 'data', 'raw', 'ONESOURCE', 'screener.json');
const SHARES_ASOF = 11.4669991; // crore, 30-Sep-2026
const PAT26 = -73.80; // Rs crore, audited
const DROP_FY = /^Mar 202[123]$/, DROP_Q = /^(Sep 2023|Dec 2023|Mar 2024)$/;

function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const keep = { note: 'ONESOURCE.patch.js: pre-demerger FY21-23 and Sep-23 to Mar-24 quarters dropped; FY26 PAT/EPS on the 30-Sep-2026 share count; market cap on that count; off-cycle yearly shareholding column dropped.', fetchedAt: S.fetchedAt, dropped: {} };
  for (const [tab, T] of Object.entries(S.tables || {})) {
    const re = tab === 'quarters' ? DROP_Q : DROP_FY;
    const idx = T.periods.map((p, i) => (re.test(p) ? i : -1)).filter(i => i >= 0);
    if (!idx.length) continue;
    keep.dropped[tab] = idx.map(i => T.periods[i]);
    T.periods = T.periods.filter((_, i) => !idx.includes(i));
    for (const k of Object.keys(T.rows)) if (Array.isArray(T.rows[k])) T.rows[k] = T.rows[k].filter((_, i) => !idx.includes(i));
  }
  const pl = S.tables['profit-loss'], j = pl.periods.indexOf('Mar 2026');
  if (j >= 0) {
    keep.fy26 = { netProfit: pl.rows['Net Profit'][j], eps: pl.rows['EPS in Rs'][j] };
    pl.rows['Net Profit'][j] = PAT26;
    pl.rows['EPS in Rs'][j] = Math.round(PAT26 / SHARES_ASOF * 10000) / 10000;
  }
  const Y = S.shareholding?.yearly;
  if (Y) {
    const ok = Y.periods.map(p => /^Mar \d{4}$/.test(p));
    if (!ok.every(Boolean)) {
      keep.shareholdingYearlyDropped = Y.periods.filter((_, i) => !ok[i]);
      Y.periods = Y.periods.filter((_, i) => ok[i]);
      for (const k of Object.keys(Y.rows)) Y.rows[k] = Y.rows[k].filter((_, i) => ok[i]);
    }
  }
  const top = S.topRatios || {}, num = s => Number(String(s || '').replace(/[^0-9.\-]/g, ''));
  if (num(top['Current Price']) > 0) { keep.marketCapOriginal = top['Market Cap']; top['Market Cap'] = `₹ ${Math.round(SHARES_ASOF * num(top['Current Price']))} Cr.`; }
  S._gamPatch = keep;
  return S;
}

module.exports = { patchRaw, SHARES_ASOF, PAT26 };
if (require.main === module) {
  const S = patchRaw(JSON.parse(fs.readFileSync(FILE, 'utf8')));
  const pl = S.tables['profit-loss'];
  console.log('annual', pl.periods.join(' | '), '| quarters', S.tables.quarters.periods.join(' | '));
  console.log('FY26 PAT', pl.rows['Net Profit'][pl.periods.indexOf('Mar 2026')], 'EPS', pl.rows['EPS in Rs'][pl.periods.indexOf('Mar 2026')], 'shares', SHARES_ASOF, '| mcap', S.topRatios['Market Cap'], '| yearly SH', S.shareholding.yearly.periods.join(','));
  console.log(JSON.stringify(S._gamPatch));
}
