// ZYDUSLIFE: two corrections to Screener's consolidated data, applied in memory by src/model.js on every build.
// 1. Net Profit on the attributable basis. Screener's consolidated "Net Profit" row is profit BEFORE minorities
//    (FY26 Rs5,124 cr = PBT Rs6,621 cr - tax Rs1,595 cr + JV share Rs97 cr) while "EPS in Rs" (Rs50.09) is AFTER
//    minorities. The engine infers shares as Net Profit / EPS, which gives 102.3 cr shares instead of the real 100.62 cr
//    (1,006,233,990 shares of Re1, AR FY26 consolidated note 43), a 1.7% error in every per-share value. Minorities are
//    material: the 42.41% of Zydus Wellness that Zydus does not own took Rs83.5 cr in FY26 and Rs147.1 cr in FY25
//    (AR FY26 note 49). We replace the row with Screener's own "Profit for EPS" schedule (= profit attributable to
//    owners: FY26 Rs5,040 cr, as reported), as APOLLOHOSP.patch.js and RAINBOW.patch.js do.
// 2. The Jun-2026 quarter as reported on 11-Aug-2026. Screener's current Jun-2026 column (depreciation Rs530 cr, other
//    income Rs126 cr incl. the JV share, PBT Rs1,369 cr, profit for EPS Rs960 cr, EPS Rs9.63) is a later restatement,
//    not the figures published by the as-of date. As filed: revenue Rs8,017.0 cr, EBITDA Rs1,929.4 cr (company basis,
//    incl. a Rs56.9 cr forex gain), other income Rs106.1 cr less an exceptional charge of Rs18.2 cr (Screener's
//    convention nets exceptional items into other income), finance cost Rs156.0 cr, depreciation and amortisation
//    Rs554.7 cr, PBT Rs1,306.6 cr, tax Rs354.2 cr (27.1%), JV share Rs37.8 cr, PAT Rs990.2 cr, minorities Rs50.4 cr,
//    attributable PAT Rs939.8 cr, EPS Rs9.35 (company release of 11-Aug-2026; PL and MOSL Q1FY27 notes of 11/12-Aug-2026;
//    Kotak Neo results table). Revenue and EBITDA are unchanged from Screener. Earlier quarters match the filings.
// Originals are kept under _gamPatch. Idempotent.
// Usage: node tools/authoring/ZYDUSLIFE.patch.js  (prints the check; src/model.js applies patchRaw in memory)
const fs = require('fs');
const path = require('path');
const F = path.join(__dirname, '..', '..', 'data', 'raw', 'ZYDUSLIFE', 'screener.json');

const AS_FILED = {
  'Jun 2026': { 'Sales': 8017.0, 'Expenses': 6087.6, 'Operating Profit': 1929.4, 'OPM %': 24, 'Other Income': 87.9, 'Interest': 156.0,
    'Depreciation': 554.7, 'Profit before tax': 1306.6, 'Tax %': 27, 'Net Profit': 990.2, 'EPS in Rs': 9.35, 'YoY Sales growth': 22 },
};
const AS_FILED_PFE = { 'Jun 2026': 939.8 }; // profit attributable to owners, as filed

function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const keep = { note: 'Net Profit rows replaced by Screener "Profit for EPS" (after minorities); Jun-2026 quarter reset to the figures as first filed. Originals below.', fetchedAt: S.fetchedAt, original: {} };
  const q = S.tables.quarters;
  for (const [per, vals] of Object.entries(AS_FILED)) {
    const j = q.periods.indexOf(per); if (j < 0) continue;
    keep.original[per] = {};
    for (const [k, v] of Object.entries(vals)) if (q.rows[k]) { keep.original[per][k] = q.rows[k][j]; q.rows[k][j] = v; }
  }
  const qPfe = S.schedules?.quarters?.['Net Profit']?.['Profit for EPS'];
  if (qPfe) for (const [per, v] of Object.entries(AS_FILED_PFE)) if (per in qPfe) { keep.original[`${per} Profit for EPS`] = qPfe[per]; qPfe[per] = v; }
  for (const tab of ['profit-loss', 'quarters']) {
    const T = S.tables[tab];
    const pfe = S.schedules?.[tab]?.['Net Profit']?.['Profit for EPS'];
    if (!T || !pfe) throw new Error(`ZYDUSLIFE patch: no Profit for EPS schedule for ${tab}`);
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
  console.log('in-memory check | FY26 Net Profit', pl.rows['Net Profit'][i], 'EPS', pl.rows['EPS in Rs'][i], 'implied shares', (pl.rows['Net Profit'][i] / pl.rows['EPS in Rs'][i]).toFixed(2), '(actual 100.62 cr)');
  const q = S.tables.quarters, j = q.periods.indexOf('Jun 2026');
  console.log('Q1FY27 as filed | sales', q.rows.Sales[j], 'EBITDA', q.rows['Operating Profit'][j], 'PBT', q.rows['Profit before tax'][j], 'attributable PAT', q.rows['Net Profit'][j], 'EPS', q.rows['EPS in Rs'][j]);
}
