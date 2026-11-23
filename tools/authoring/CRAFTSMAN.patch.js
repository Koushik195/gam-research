// CRAFTSMAN: in-memory fixes applied by src/model.js on every build (patchRaw); idempotent.
// 1) Attributable profit. Screener's consolidated "Net Profit" row is before minority interests (FY24 Rs337 cr) while
//    "EPS in Rs" is after them (Rs144.11): until Jun-2024 Craftsman owned 76% of DR Axion India (the other 24% was bought
//    for Rs250 cr on 29-Jun-2024). We put Net Profit on Screener's own "Profit for EPS" basis (FY24 Rs304 cr, FY25 Rs195 cr,
//    FY26 Rs384 cr), as UPL.patch.js / BHARATFORG.patch.js do. FY26 is unchanged (no minorities since Jul-2024).
// 2) Post-QIP share count. Craftsman allotted 22,98,850 new shares at Rs8,700 in a Rs2,000 cr QIP on 18-Jun-2026 (before
//    our 30-Sep-2026 as-of date): shares went from 2,38,55,583 to 2,61,54,433 (Angel One / exchange filing, 18-19 Jun-2026).
//    The engine fixes shares at FY26 profit / EPS, so we restate FY26 EPS to a pro forma Rs146.82 (Rs384 cr / 2.6154 cr);
//    every forecast EPS and the target are then on the post-QIP share count. Reported FY26 EPS was Rs160.96. The house
//    forward-P/E history (forwardMedian) reads Screener's unpatched EPS, so the multiple history is unaffected.
// 3) Mar-26 balance sheet pro forma for the QIP cash (BOSCHLTD.patch.js precedent: tables only). The engine starts the
//    forecast from Mar-26 and has no share-issue line, so without this it would miss Rs2,000 cr of equity and cash. We add
//    the gross proceeds (Rs1,999.99 cr; issue expenses not disclosed by 30-Sep-2026) to Investments and Reserves. The
//    placement document earmarked part of the money for prepaying debt, part for capex and working capital; the split was
//    not public, so we hold it as cash and let the forecast use it (our interest line assumes some prepayment).
// 4) Annual history starts at FY19. Screener's FY15-FY16 columns are standalone ("(S)") and its FY18 cost split is broken
//    (material cost -1% of revenue, other expenses 67%), so FY15-FY18 are dropped (SONACOMS.patch.js precedent).
const fs = require('fs');
const path = require('path');
const SHARES_POST_QIP = 2.6154433; // crore
const QIP = 1999.99; // Rs crore, gross

function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const keep = { note: 'Net Profit = Screener "Profit for EPS"; FY26 EPS pro forma on 2.6154 cr post-QIP shares; Mar-26 investments and reserves +Rs2,000 cr (QIP, Jun-2026); FY15-18 dropped (FY15-16 standalone; FY18 cost split broken). Originals below.', fetchedAt: S.fetchedAt, original: {} };
  for (const tab of ['profit-loss', 'quarters']) {
    const T = S.tables[tab];
    const pfe = S.schedules?.[tab]?.['Net Profit']?.['Profit for EPS'];
    if (!T || !pfe) throw new Error(`CRAFTSMAN patch: no Profit for EPS schedule for ${tab}`);
    const row = T.rows['Net Profit'];
    keep.original[tab] = row.slice();
    T.rows['Net Profit'] = T.periods.map((p, i) => (p === 'TTM' ? row[i] : typeof pfe[p] === 'number' ? pfe[p] : row[i]));
  }
  const pl = S.tables['profit-loss'], j = pl.periods.indexOf('Mar 2026');
  if (j >= 0) {
    keep.original.eps = pl.rows['EPS in Rs'].slice();
    pl.rows['EPS in Rs'][j] = Math.round(pl.rows['Net Profit'][j] / SHARES_POST_QIP * 100) / 100;
  }
  const bs = S.tables['balance-sheet'], k = bs.periods.indexOf('Mar 2026');
  if (k >= 0) {
    keep.original['bs.Mar26'] = { investments: bs.rows.Investments[k], reserves: bs.rows.Reserves[k], total: bs.rows['Total Assets'][k] };
    for (const r of ['Investments', 'Reserves', 'Total Liabilities', 'Total Assets']) bs.rows[r][k] = Math.round((bs.rows[r][k] + QIP) * 100) / 100;
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

module.exports = { patchRaw, SHARES_POST_QIP, QIP };
if (require.main === module) {
  const S = patchRaw(JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'raw', 'CRAFTSMAN', 'screener.json'), 'utf8')));
  const pl = S.tables['profit-loss']; console.log(pl.periods.join(' | ')); console.log(pl.rows['Net Profit'].join(' | ')); console.log(pl.rows['EPS in Rs'].join(' | '));
  const bs = S.tables['balance-sheet']; console.log(bs.periods.join(' | ')); console.log(bs.rows.Investments.join(' | '), '/', bs.rows.Reserves.join(' | '));
}
