// UNOMINDA: put Screener's "Net Profit" on the attributable basis (profit after minority interests).
// Why: Screener's consolidated "Net Profit" row is profit BEFORE non-controlling interests (FY26 Rs1,284 cr) while
// "EPS in Rs" is AFTER them (Rs20.73). The engine infers shares as Net Profit / EPS, which gives 61.9 cr shares
// instead of the real 57.74 cr (AR FY26 note 13: 57,74,21,816 shares of Rs2 at Mar-2026), and every per-share
// value goes wrong. Uno Minda's minorities are material (Rs87 cr in FY26, Rs78 cr in FY25: Tokai Rika's 49% of
// Uno Mindarika, Kyoraku's 32% of Uno Minda Kyoraku, Katolec's 49% of Uno Minda Katolec, Westport's 24% of Minda
// Westport), so we replace the row with Screener's own "Profit for EPS" schedule (= profit attributable to owners),
// as UPL.patch.js and MOTHERSON.patch.js do. FY26 1,197 / 20.73 = 57.74 cr shares. Screener's quarters to Jun-2026
// are the as-reported ones (Q1FY27 revenue Rs5,557 cr, owners' PAT Rs296 cr: company deck, 4-Aug-2026); the
// Sep-2026 columns (Q2FY27, filed Nov-2026) are dropped by the engine's as-of freeze.
// Applied in memory by src/model.js on every build (patchRaw); the original row is kept under _gamPatch.
function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const keep = { note: 'Net Profit rows replaced by Screener "Profit for EPS" (attributable to owners, after minorities). Originals below.', fetchedAt: S.fetchedAt, original: {} };
  for (const tab of ['profit-loss', 'quarters']) {
    const T = S.tables[tab];
    const pfe = S.schedules?.[tab]?.['Net Profit']?.['Profit for EPS'];
    if (!T || !pfe) throw new Error(`UNOMINDA patch: no Profit for EPS schedule for ${tab}`);
    const row = T.rows['Net Profit'];
    keep.original[tab] = row.slice();
    T.rows['Net Profit'] = T.periods.map((p, i) => (p === 'TTM' ? row[i] : typeof pfe[p] === 'number' ? pfe[p] : row[i]));
  }
  S._gamPatch = keep;
  return S;
}

module.exports = { patchRaw };
