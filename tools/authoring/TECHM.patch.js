// TECHM: put Screener's profit and EPS rows on the basis Tech Mahindra reports (and the street uses).
// Why: (1) Screener's consolidated "Net Profit" row is profit BEFORE minorities (Q1FY27 Rs1,486 cr vs
// Rs1,465 cr attributable); we replace it with Screener's own "Profit for EPS" schedule (= profit
// attributable to owners), as ASIANPAINT.patch.js does. (2) Screener's "EPS in Rs" divides that profit by
// ALL issued shares (~98.0 cr), including the 94,235,629 shares held by the TML Benefit Trust, which the
// consolidated accounts eliminate as treasury shares (AR FY26, consolidated note 20: issued 979,841,252;
// less TML Benefit Trust 94,235,629; adjusted 885,605,623). Reported basic EPS uses ~88.6 cr shares
// (FY26 Rs54.28 vs Screener Rs49.10). The engine infers shares as Net Profit / EPS, so without this patch
// every per-share number would be ~10% too low against company and broker figures.
// Method: EPS = Profit for EPS / (Screener-implied shares - 9.4235629 cr), overridden by the reported basic
// EPS where we have it (FY25-26 annual report; quarterly results and decks Q4FY25-Q1FY27).
// The original rows are kept under _gamPatch. Idempotent. src/model.js applies patchRaw on every build.
// Usage: node tools/authoring/TECHM.patch.js  (prints the check)
const fs = require('fs');
const path = require('path');
const F = path.join(__dirname, '..', '..', 'data', 'raw', 'TECHM', 'screener.json');
const TRUST = 9.4235629; // crore shares held by TML Benefit Trust (unchanged in FY25-FY26)
// Reported basic EPS (Rs). Annual: AR FY26 consolidated P&L. Quarterly: results / earnings decks.
const REPORTED = {
  'profit-loss': { 'Mar 2025': 48.0, 'Mar 2026': 54.28 },
  quarters: { 'Mar 2025': 13.17, 'Jun 2025': 12.87, 'Sep 2025': 13.48, 'Dec 2025': 12.66, 'Mar 2026': 15.27, 'Jun 2026': 16.53 },
};

function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const keep = { note: 'Net Profit -> Screener "Profit for EPS" (attributable); EPS -> reported basic basis (excl. TML Benefit Trust treasury shares). Originals below.', fetchedAt: S.fetchedAt, original: {} };
  for (const tab of ['profit-loss', 'quarters']) {
    const T = S.tables[tab];
    const pfe = S.schedules?.[tab]?.['Net Profit']?.['Profit for EPS'];
    if (!T || !pfe) throw new Error(`TECHM patch: no Profit for EPS schedule for ${tab}`);
    const np = T.rows['Net Profit'], eps = T.rows['EPS in Rs'];
    keep.original[tab] = { 'Net Profit': np.slice(), 'EPS in Rs': eps.slice() };
    const pat = T.periods.map((p, i) => (p !== 'TTM' && typeof pfe[p] === 'number' ? pfe[p] : np[i]));
    T.rows['EPS in Rs'] = T.periods.map((p, i) => {
      if (REPORTED[tab][p] != null) return REPORTED[tab][p];
      if (typeof eps[i] !== 'number' || !eps[i] || typeof pat[i] !== 'number') return eps[i];
      const sharesAll = pat[i] / eps[i];
      return Math.round(pat[i] / (sharesAll - TRUST) * 100) / 100;
    });
    T.rows['Net Profit'] = pat;
  }
  S._gamPatch = keep;
  return S;
}

module.exports = { patchRaw, TRUST };
if (require.main === module) {
  const S = patchRaw(JSON.parse(fs.readFileSync(F, 'utf8')));
  const pl = S.tables['profit-loss'];
  for (const p of ['Mar 2022', 'Mar 2023', 'Mar 2024', 'Mar 2025', 'Mar 2026']) {
    const i = pl.periods.indexOf(p);
    console.log(p, '| Net Profit', pl.rows['Net Profit'][i], '| EPS', pl.rows['EPS in Rs'][i], '| implied shares', (pl.rows['Net Profit'][i] / pl.rows['EPS in Rs'][i]).toFixed(2), 'cr');
  }
  console.log('reported: FY26 basic EPS 54.28 on ~88.6 cr weighted shares; FY24 diluted 26.58, FY23 54.54, FY22 62.81 (AR FY26 KPI page)');
}
