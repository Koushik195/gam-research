// ASAHIINDIA: in-memory fix applied by src/model.js on every build (patchRaw); idempotent.
// Share count. AIS issued 1,18,37,261 shares in a Rs1,000 cr QIP on 19-Sep-2025, taking the count from 24.31 cr to
// 25,49,27,192 (25.49 cr), unchanged since (Q1FY27 paid-up capital Rs25.49 cr). The engine fixes the forecast share
// count at FY26 Net Profit / FY26 EPS; Screener's rounded Rs345 cr / Rs13.52 gives 25.52 cr (+0.1%). We restate FY26
// EPS to Rs345 cr / 25.4927 cr so every forecast EPS and the EV/EBITDA target use the actual post-QIP count.
// Reported FY26 EPS was Rs13.82 on 24.94 cr weighted shares (AR FY26 note 34); Screener shows Rs13.52.
const SHARES = 25.4927192; // crore (AR FY26 note 12; Q1FY27 results: paid-up Rs2,549 lakh at Re1)

function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const pl = S.tables['profit-loss'], j = pl.periods.indexOf('Mar 2026');
  const keep = { note: 'FY26 EPS restated to Net Profit / 25.4927 cr post-QIP shares. Original below.', fetchedAt: S.fetchedAt, original: {} };
  if (j >= 0) {
    keep.original.eps = pl.rows['EPS in Rs'].slice();
    pl.rows['EPS in Rs'][j] = Math.round(pl.rows['Net Profit'][j] / SHARES * 10000) / 10000;
  }
  S._gamPatch = keep;
  return S;
}

module.exports = { patchRaw, SHARES };
