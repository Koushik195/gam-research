// MSUMI (Motherson Sumi Wiring India): in-memory fixes applied by src/model.js on every build (patchRaw); idempotent.
// 1) FY21 column dropped. MSWIL was incorporated on 2-Jul-2020 as a shell subsidiary of SAMIL; the domestic wiring-harness
//    (DWH) business was demerged into it with an appointed date of 1-Apr-2021 (NCLT 22-Dec-2021, effective 5-Jan-2022).
//    Screener's "Mar 2021" P&L is the carved-out DWH business (no EPS), but its Mar-2021 balance sheet is the shell's
//    (equity ₹0.1 cr) and its cash flow is not comparable, so FY21 is dropped from every table (CRAFTSMAN.patch.js
//    precedent). FY21 DWH revenue (₹3,938 cr) is quoted in the text from the FY22 annual report instead.
// 2) Share count. Screener rounds EPS to two decimals (FY26 ₹0.94), so the engine's implied share count (FY26 profit ÷ EPS)
//    is 664.9 cr against 663.17 cr actually outstanding (AR FY26 note 11: 6,631,661,898 shares after the 1:2 bonus of
//    21-Jul-2025). We restate every annual EPS to Net Profit ÷ 663.17 cr (four decimals), so FY27-29E EPS are on the true
//    count. Earlier years are already bonus-adjusted by Screener; restating them only adds precision.
//    The house forward-P/E history (forwardMedian) reads this patched EPS through the built model's raw data only where
//    the engine passes it; valuation-blend.js reads screener.json directly (unpatched, two-decimal EPS), see MSUMI.ctx.js.
const fs = require('fs');
const path = require('path');
const SHARES = 663.1661898; // crore, 31-Mar-2026 and unchanged to 30-Sep-2026

function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const keep = { note: 'FY21 (pre-demerger shell balance sheet) dropped; annual EPS restated to Net Profit / 663.17 cr shares. Originals below.', fetchedAt: S.fetchedAt, original: {} };
  for (const tab of ['profit-loss', 'balance-sheet', 'cash-flow', 'ratios']) {
    const T = S.tables[tab]; if (!T) continue;
    const idx = T.periods.map((p, i) => (p === 'Mar 2021' ? i : -1)).filter(i => i >= 0);
    T.periods = T.periods.filter((_, i) => !idx.includes(i));
    for (const r of Object.keys(T.rows)) T.rows[r] = T.rows[r].filter((_, i) => !idx.includes(i));
  }
  const pl = S.tables['profit-loss'];
  keep.original.eps = pl.rows['EPS in Rs'].slice();
  pl.rows['EPS in Rs'] = pl.periods.map((p, i) => (/^Mar \d{4}$/.test(p) && typeof pl.rows['Net Profit'][i] === 'number' ? Math.round(pl.rows['Net Profit'][i] / SHARES * 10000) / 10000 : pl.rows['EPS in Rs'][i]));
  S._gamPatch = keep;
  return S;
}

module.exports = { patchRaw, SHARES };
if (require.main === module) {
  const S = patchRaw(JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'raw', 'MSUMI', 'screener.json'), 'utf8')));
  const pl = S.tables['profit-loss']; console.log(pl.periods.join(' | ')); console.log(pl.rows['Net Profit'].join(' | ')); console.log(pl.rows['EPS in Rs'].join(' | '));
  const bs = S.tables['balance-sheet']; console.log(bs.periods.join(' | ')); console.log(bs.rows['Equity Capital'].join(' | '));
}
