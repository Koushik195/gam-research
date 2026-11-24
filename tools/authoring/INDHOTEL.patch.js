// INDHOTEL: one correction to Screener's consolidated data, applied in memory by src/model.js on every build.
// Net Profit on the attributable basis. Screener's consolidated "Net Profit" row is profit BEFORE minorities (FY26
// Rs2,247 cr) while "EPS in Rs" is AFTER minorities (Rs14.64). The engine infers shares as Net Profit / EPS, which gives
// 153.5 cr shares instead of the real 142.34 cr (142,34,32,227 shares of Re1; AR FY26 shareholding table), a 7.8% error in every
// per-share value. Minorities are material and rising: Rs163 cr in FY26 (PIEM 41.35%, TajSATS 49%, Benares 48.03%,
// St James Court 20.33%, United Hotels / Northern India Hotels ~45%, ANK and Pride 49% from Dec-2025, Atmantan 49% from
// Jan-2026; AR FY26) and Rs33 cr in Q1FY27 (with share of associates; Q1FY27 deck slide 31). We replace the row with
// Screener's own "Profit for EPS" schedule (= profit attributable to owners), as APOLLOHOSP.patch.js / UPL.patch.js do.
// The Jun-2026 quarter on Screener matches the figures filed on 21-Jul-2026 (revenue Rs2,339 cr, operating EBITDA
// Rs673 cr, attributable PAT Rs358 cr; Q1FY27 deck slide 31), so no quarter is reset.
// Originals are kept under _gamPatch. Idempotent.
// Usage: node tools/authoring/INDHOTEL.patch.js  (prints the check; src/model.js applies patchRaw in memory)
const fs = require('fs');
const path = require('path');
const F = path.join(__dirname, '..', '..', 'data', 'raw', 'INDHOTEL', 'screener.json');

function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const keep = { note: 'Net Profit rows replaced by Screener "Profit for EPS" (after minorities). Originals below.', fetchedAt: S.fetchedAt, original: {} };
  for (const tab of ['profit-loss', 'quarters']) {
    const T = S.tables[tab];
    const pfe = S.schedules?.[tab]?.['Net Profit']?.['Profit for EPS'];
    if (!T || !pfe) throw new Error(`INDHOTEL patch: no Profit for EPS schedule for ${tab}`);
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
  const pl = S.tables['profit-loss'], i = pl.periods.indexOf('Mar 2026');
  console.log('in-memory check | FY26 Net Profit', pl.rows['Net Profit'][i], 'EPS', pl.rows['EPS in Rs'][i], 'implied shares', (pl.rows['Net Profit'][i] / pl.rows['EPS in Rs'][i]).toFixed(2), '(actual 142.34 cr)');
  const q = S.tables.quarters, j = q.periods.indexOf('Jun 2026');
  console.log('Q1FY27 | sales', q.rows.Sales[j], 'EBITDA', q.rows['Operating Profit'][j], 'PBT', q.rows['Profit before tax'][j], 'attributable PAT', q.rows['Net Profit'][j], 'EPS', q.rows['EPS in Rs'][j]);
}
