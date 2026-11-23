// TIINDIA: put Screener's "Net Profit" on the attributable basis (profit after minority interests).
// Why: Screener's consolidated "Net Profit" row is profit BEFORE minorities (FY26 Rs1,118 cr) while "EPS in Rs"
// is AFTER them (Rs32.90). The engine infers shares as Net Profit / EPS, which would give ~34 cr shares instead
// of the real 19.36 cr, and every per-share value would be wrong. TII's minorities are very large: 43.71% of
// CG Power, 29.54% of Shanthi Gears, 33% of TI Medical and Kcaltech (FY26 minority share Rs481 cr, FY24 Rs522 cr).
// We replace the row with Screener's own "Profit for EPS" schedule (= profit attributable to owners), as
// UPL.patch.js and MOTHERSON.patch.js do. FY26: 637 / 32.90 = 19.36 cr shares (19,35,52,869 at Mar-2026). EPS
// needs no patch. Applied in memory by src/model.js on every build (patchRaw); the original row is kept under
// _gamPatch.
function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const keep = { note: 'Net Profit rows replaced by Screener "Profit for EPS" (attributable to owners, after minorities). Originals below.', fetchedAt: S.fetchedAt, original: {} };
  for (const tab of ['profit-loss', 'quarters']) {
    const T = S.tables[tab];
    const pfe = S.schedules?.[tab]?.['Net Profit']?.['Profit for EPS'];
    if (!T || !pfe) throw new Error(`TIINDIA patch: no Profit for EPS schedule for ${tab}`);
    const row = T.rows['Net Profit'];
    keep.original[tab] = row.slice();
    T.rows['Net Profit'] = T.periods.map((p, i) => (p === 'TTM' ? row[i] : typeof pfe[p] === 'number' ? pfe[p] : row[i]));
  }
  // Screener's first two annual columns (Mar 2015 (S), Mar 2016) are empty (zeros, from before TII's 2017 listing);
  // the Excel model's growth formulas divide by them. Drop them from every annual table (originals kept above).
  const EMPTY = ['Mar 2015 (S)', 'Mar 2016'];
  keep.droppedPeriods = EMPTY;
  for (const tab of ['profit-loss', 'balance-sheet', 'cash-flow', 'ratios']) {
    const T = S.tables[tab]; if (!T) continue;
    const idx = T.periods.map((p, i) => (EMPTY.includes(p) ? -1 : i)).filter(i => i >= 0);
    T.periods = idx.map(i => T.periods[i]);
    for (const k of Object.keys(T.rows)) T.rows[k] = idx.map(i => T.rows[k][i]);
  }
  S._gamPatch = keep;
  return S;
}

module.exports = { patchRaw };
