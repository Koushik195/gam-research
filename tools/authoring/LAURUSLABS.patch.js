// LAURUSLABS: put Screener's consolidated "Net Profit" on the attributable basis (profit after minority interests).
// Why: Screener's "Net Profit" row is profit BEFORE minorities (FY26 Rs890 cr; company "profit for the year" Rs890.14 cr)
// while "EPS in Rs" is AFTER minorities (Rs16.46; AR FY26 note 25: profit attributable Rs888.79 cr on 53.97 cr weighted
// shares). The minority is the 21.66% outside stake in Laurus Bio (Laurus holds 78.34%, AR FY26 AOC-1). The engine infers
// shares as Net Profit / EPS, which gives 54.07 cr instead of the real 53.99 cr (539,856,582 shares at Mar-2026, AR note 11):
// small in FY26 (0.1%) but Rs6 cr in Q1FY27 (Rs362 cr reported vs Rs368 cr attributable, as Laurus Bio's minority absorbed
// a loss). We replace the rows with Screener's own "Profit for EPS" schedule (= profit attributable to owners), as
// CIPLA.patch.js and SUNPHARMA.patch.js do. The original rows are kept under _gamPatch. Idempotent.
// Usage: node tools/authoring/LAURUSLABS.patch.js  (prints the check; src/model.js applies patchRaw in memory)
const fs = require('fs');
const path = require('path');
const F = path.join(__dirname, '..', '..', 'data', 'raw', 'LAURUSLABS', 'screener.json');

function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const keep = { note: 'Net Profit rows replaced by Screener "Profit for EPS" (attributable to owners, after minorities). Originals below.', fetchedAt: S.fetchedAt, original: {} };
  for (const tab of ['profit-loss', 'quarters']) {
    const T = S.tables[tab];
    const pfe = S.schedules?.[tab]?.['Net Profit']?.['Profit for EPS'];
    if (!T || !pfe) throw new Error(`LAURUSLABS patch: no Profit for EPS schedule for ${tab}`);
    const row = T.rows['Net Profit'];
    keep.original[tab] = row.slice();
    T.rows['Net Profit'] = T.periods.map((p, i) => (p === 'TTM' ? row[i] : typeof pfe[p] === 'number' ? pfe[p] : row[i]));
  }
  S._gamPatch = keep;
  return S;
}

module.exports = { patchRaw };
if (require.main === module) {
  const S = patchRaw(JSON.parse(fs.readFileSync(F, 'utf8')));
  const pl = S.tables['profit-loss'];
  for (const p of ['Mar 2022', 'Mar 2023', 'Mar 2024', 'Mar 2025', 'Mar 2026']) {
    const i = pl.periods.indexOf(p);
    console.log(`${p} | Net Profit ${pl.rows['Net Profit'][i]} (was ${S._gamPatch.original['profit-loss'][i]}) | EPS ${pl.rows['EPS in Rs'][i]} | implied shares ${(pl.rows['Net Profit'][i] / pl.rows['EPS in Rs'][i]).toFixed(2)} cr (actual 53.9-54.0 cr)`);
  }
  const q = S.tables.quarters, j = q.periods.indexOf('Jun 2026');
  console.log('Q1FY27 | Net Profit', q.rows['Net Profit'][j], '(was', S._gamPatch.original.quarters[j] + ') EPS', q.rows['EPS in Rs'][j], 'implied shares', (q.rows['Net Profit'][j] / q.rows['EPS in Rs'][j]).toFixed(2));
}
