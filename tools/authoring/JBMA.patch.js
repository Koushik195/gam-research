// JBMA: in-memory fixes applied by src/model.js on every build (patchRaw); idempotent.
// 1) Attributable profit. Screener's consolidated "Net Profit" row is before minority interests (FY26 Rs238 cr) while
//    "EPS in Rs" is after them (Rs9.25). The minorities are the 15% outside holders of JBM Electric Vehicles Pvt Ltd (the
//    e-bus maker; JBM Auto owns 85%, AR FY26 note 37) and the 1% of VT Emobility: FY26 Rs19.3 cr (AR FY26 Board's report).
//    The engine infers shares as Net Profit / EPS: 238 / 9.25 = 25.7 cr instead of the actual 23.65 cr (23,64,94,264 shares
//    of Re1 after the Dec-2024 split, AR FY26 note 36), so every per-share value would be ~9% off. We replace the row with
//    Screener's own "Profit for EPS" schedule (FY26 Rs219 cr = company Rs218.8 cr attributable), as UPL.patch.js,
//    SONACOMS.patch.js and CRAFTSMAN.patch.js do.
// 2) Annual history starts at FY19 (the templates' window). FY15-FY18 are dropped: Screener's FY15-FY16 rows carry
//    minority swings of Rs11-16 cr and pre-bonus share counts, and they add nothing to a FY19-FY29E report.
// 3) The Rs410 cr that JBM Ecolife upstreamed in Jun-2026 to cut JBM Auto's debt (Crisil, 5-Aug-2026) is NOT patched here:
//    the Excel model reads the unpatched screener schedules, so it is carried in assumptions.json as otherTreasury (moved
//    from working capital to net cash in the base year), which both the engine and the Excel model support.
// The forward-P/E history (valuation-blend forwardMedian) reads Screener's unpatched EPS, which is already attributable.
const fs = require('fs');
const path = require('path');

function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const keep = { note: 'Net Profit = Screener "Profit for EPS" (attributable to owners); FY15-18 dropped. Originals below.', fetchedAt: S.fetchedAt, original: {} };
  for (const tab of ['profit-loss', 'quarters']) {
    const T = S.tables[tab];
    const pfe = S.schedules?.[tab]?.['Net Profit']?.['Profit for EPS'];
    if (!T || !pfe) throw new Error(`JBMA patch: no Profit for EPS schedule for ${tab}`);
    const row = T.rows['Net Profit'];
    keep.original[tab] = row.slice();
    T.rows['Net Profit'] = T.periods.map((p, i) => (p === 'TTM' ? row[i] : typeof pfe[p] === 'number' ? pfe[p] : row[i]));
  }
  keep.droppedYears = [];
  for (const tab of ['profit-loss', 'balance-sheet', 'cash-flow', 'ratios']) {
    const T = S.tables[tab]; if (!T) continue;
    const idx = T.periods.map((p, i) => (/\(S\)|^Mar 201[5-8]/.test(p) ? i : -1)).filter(i => i >= 0);
    if (tab === 'profit-loss') keep.droppedYears = idx.map(i => T.periods[i]);
    T.periods = T.periods.filter((_, i) => !idx.includes(i));
    for (const r of Object.keys(T.rows)) T.rows[r] = T.rows[r].filter((_, i) => !idx.includes(i));
  }
  S._gamPatch = keep;
  return S;
}

module.exports = { patchRaw };
if (require.main === module) {
  const S = patchRaw(JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'raw', 'JBMA', 'screener.json'), 'utf8')));
  const pl = S.tables['profit-loss']; console.log(pl.periods.join(' | ')); console.log(pl.rows['Net Profit'].join(' | ')); console.log(pl.rows['EPS in Rs'].join(' | '));
  console.log(pl.periods.map((p, i) => (pl.rows['Net Profit'][i] / pl.rows['EPS in Rs'][i]).toFixed(2)).join(' | '));
}
