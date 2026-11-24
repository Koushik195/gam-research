// MEESHO: in-memory fixes applied by src/model.js on every build (patchRaw); idempotent. Never edit screener.json.
// 1) Share count. The engine fixes forecast shares at FY26 profit ÷ FY26 EPS. Screener's FY26 EPS (−₹2.97) gives
//    ~457 cr shares; the reported EPS (−₹3.11) uses a weighted 437 cr (IPO shares were issued in Dec-2025). We value
//    Meesho on fully diluted shares: 456.41 cr issued at Mar-26 (FY26 annual report, note 16: 4,564,055,196 shares)
//    + 17.90 cr shares under options outstanding at Mar-26 (ESOP 2024 Pool 1: 2,311,840 options × 49 shares;
//    Pool 2: 1,095,186 options × 60 shares; exercise price ₹1, so in the money; AR FY26 note 32) = 474.31 cr.
//    Options were being exercised after the Jun-2026 lock-in expiry (~461 cr shares at Jun-26, implied by the
//    shareholding filing), so the diluted count is the right base. FY26 EPS is restated: −₹1,357.7 cr ÷ 474.31 cr.
// 2) FY21-FY22 are standalone ("Mar 2021 (S)") in Screener's tables but unlabelled in its schedules, so the engine
//    finds no capex, cash or gross block for those years. Copy each schedule value to the "(S)" key (ATHERENERG
//    precedent). The standalone company (then Fashnear Technologies) was the whole Indian operating business, so
//    FY21-22 are kept; consolidated accounts start in FY23.
const SHARES_FD = 474.31; // crore, fully diluted at Mar-26

function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const keep = { note: 'MEESHO.patch.js: FY26 EPS on 474.31 cr fully diluted shares; (S) schedule keys.', fetchedAt: S.fetchedAt };
  const pl = S.tables['profit-loss'], j = pl.periods.indexOf('Mar 2026');
  if (j < 0) throw new Error('MEESHO patch: no Mar 2026 column');
  keep.eps = pl.rows['EPS in Rs'][j];
  pl.rows['EPS in Rs'][j] = Math.round(pl.rows['Net Profit'][j] / SHARES_FD * 1e5) / 1e5;
  const sPeriods = new Set(Object.values(S.tables).flatMap(t => t.periods.filter(p => / \(S\)$/.test(p))));
  for (const sec of Object.values(S.schedules || {})) for (const par of Object.values(sec || {})) for (const item of Object.values(par || {})) {
    if (!item || typeof item !== 'object') continue;
    for (const p of sPeriods) { const k = p.replace(' (S)', ''); if (item[p] === undefined && item[k] !== undefined) item[p] = item[k]; }
  }
  S._gamPatch = keep;
  return S;
}

module.exports = { patchRaw, SHARES_FD };
