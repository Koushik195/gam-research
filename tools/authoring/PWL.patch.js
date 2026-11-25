// PWL (Physicswallah): in-memory fixes applied by src/model.js on every build (patchRaw); idempotent. Never edit screener.json.
// 1) FY21 dropped. Screener's first column is "Mar 2021 (S) 10m": a ten-month standalone period of the company incorporated
//    in Jun-2020 (revenue ₹25 cr), before any subsidiary or offline centre. It is not comparable with FY22 onwards and would
//    show a false 9x revenue jump in FY22 (TENNIND precedent).
// 2) Equity mis-filed as borrowings. Screener puts an equity item under "Borrowings → Preference Capital": at Mar-2025 the
//    Series A/A1/B CCPS (₹834.45 cr, "instrument entirely equity in nature", AR FY26 consolidated balance sheet) and at
//    Mar-2026 the ₹823.60 cr "other equity reserve" (AR FY26 note 10(a)). Both are equity: we add them to Reserves.
//    Borrowings are left as Screener has them, because the Excel model reads Screener's borrowing schedule directly
//    (unpatched); the same amount is added to Investments (and to Total assets / liabilities), which both the engine
//    and the Excel model read from this patched table, so both start from the true net treasury (₹5,027 cr less
//    ₹1,052 cr of leases and bank debt) without touching working capital.
//    True borrowings: Mar-25 ₹0.33 cr bank debt + ₹996 cr lease liabilities; Mar-26 ₹10.50 cr + ₹1,041.61 cr leases
//    (consolidated balance sheet). Lease liabilities stay in borrowings, matching the engine's post-IndAS EBITDA.
//    FY23-FY24 are left as reported: the CCPS were then carried as liabilities at fair value (the FY24 loss includes it).
// 3) Share count. The engine sets forecast shares at FY26 profit ÷ FY26 EPS (−₹24 cr ÷ −₹0.08 = ~302 cr, a rounding
//    artefact). We use 290.09 cr shares: shares in issue and diluted shares in JM Financial's 14-Aug-2026 note
//    (2,900.9 mn), equal to the 285.97 cr issued at Mar-2026 (AR FY26 note 9) plus options exercised since (3.04 cr
//    options outstanding at Mar-2026 at ₹1, AR FY26 note 39). FY26 EPS is restated: −₹24.17 cr ÷ 290.09 cr.
const SHARES_FD = 290.09; // crore
const EQUITY_IN_BORROWINGS = { 'Mar 2025': 834, 'Mar 2026': 824 }; // ₹ crore, Screener "Preference Capital"

function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const keep = { note: 'PWL.patch.js: FY21 (10-month standalone) dropped; CCPS / other equity reserve added to reserves and offset in investments (FY25-26; borrowings as Screener); FY26 EPS on 290.09 cr shares.', fetchedAt: S.fetchedAt, dropped: {} };
  // 1) drop FY21
  for (const tab of ['profit-loss', 'balance-sheet', 'cash-flow', 'ratios']) {
    const T = S.tables?.[tab]; if (!T) continue;
    const idx = T.periods.map((p, i) => (/^Mar 2021/.test(p) ? i : -1)).filter(i => i >= 0);
    if (!idx.length) continue;
    keep.dropped[tab] = idx.map(i => T.periods[i]);
    T.periods = T.periods.filter((_, i) => !idx.includes(i));
    for (const r of Object.keys(T.rows)) T.rows[r] = T.rows[r].filter((_, i) => !idx.includes(i));
  }
  for (const G of Object.values(S.schedules || {})) for (const grp of Object.values(G || {})) for (const item of Object.values(grp || {}))
    if (item && typeof item === 'object') for (const p of Object.keys(item)) if (/^Mar 2021/.test(p)) delete item[p];
  // 2) equity out of borrowings
  const bs = S.tables['balance-sheet'];
  const pref = S.schedules?.['balance-sheet']?.Borrowings?.['Preference Capital'];
  keep.moved = {};
  for (const [p, v] of Object.entries(EQUITY_IN_BORROWINGS)) {
    const i = bs.periods.indexOf(p); if (i < 0) continue;
    if (pref && Math.abs((pref[p] || 0) - v) > 1) throw new Error(`PWL patch: Screener preference capital ${p} is ${pref[p]}, expected ${v}`);
    bs.rows.Reserves[i] += v; bs.rows.Investments[i] += v; bs.rows['Total Liabilities'][i] += v; bs.rows['Total Assets'][i] += v; keep.moved[p] = v;
  }
  // 3) FY26 EPS on the diluted share count
  const pl = S.tables['profit-loss'], j = pl.periods.indexOf('Mar 2026');
  if (j < 0) throw new Error('PWL patch: no Mar 2026 column');
  keep.eps = pl.rows['EPS in Rs'][j];
  pl.rows['EPS in Rs'][j] = Math.round(pl.rows['Net Profit'][j] / SHARES_FD * 1e5) / 1e5;
  S._gamPatch = keep;
  return S;
}

module.exports = { patchRaw, SHARES_FD };
if (require.main === module) {
  const fs = require('fs'), path = require('path');
  const S = patchRaw(JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'raw', 'PWL', 'screener.json'), 'utf8')));
  for (const t of ['profit-loss', 'balance-sheet']) console.log(t, S.tables[t].periods.join(' | '));
  console.log('Borrowings', S.tables['balance-sheet'].rows.Borrowings.join(' | '), 'Reserves', S.tables['balance-sheet'].rows.Reserves.join(' | '));
  console.log('EPS', S.tables['profit-loss'].rows['EPS in Rs'].join(' | '));
}
