// APOLLOHOSP: two corrections to Screener's consolidated data, applied in memory by src/model.js on every build.
// 1. Net Profit on the attributable basis. Screener's consolidated "Net Profit" row is profit BEFORE minorities
//    (FY26 Rs2,003 cr) while "EPS in Rs" is AFTER minorities (Rs135.04). The engine infers shares as Net Profit / EPS,
//    which gives 14.83 cr shares instead of the real 14.38 cr (143,784,657 shares of Rs5; AR FY26 note 19), a 3.1%
//    error in every per-share value. Minorities are material: Rs61 cr in FY26 (Lucknow 49%, Ahmedabad 50%, Indore
//    45%, Kerala 40% and others) and Rs30 cr in Q1FY27 alone (PL Q1FY27 note: Rs297 mn). We replace the row with
//    Screener's own "Profit for EPS" schedule (= profit attributable to owners), as RAINBOW.patch.js does.
// 2. The Jun-2026 quarter as reported on 12-Aug-2026. Screener's current Jun-2026 column (revenue Rs6,932 cr, EBITDA
//    Rs1,077 cr) is a later restatement, not the figures published by the as-of date. As filed: revenue Rs7,043.5 cr,
//    expenses Rs5,951.4 cr, EBITDA Rs1,092.1 cr, other income Rs48.8 cr plus Rs13.4 cr share of associates (Screener
//    puts associates in other income), interest Rs120.4 cr, depreciation Rs235.1 cr, PBT incl. associates Rs798.8 cr,
//    tax Rs188.4 cr, PAT Rs610.4 cr, attributable PAT Rs580.7 cr, EPS Rs40.39 (Q1FY27 investor presentation slide 10;
//    ICICI Direct and Prabhudas Lilladher Q1FY27 notes of 14-Aug-2026, company data). Profit and EPS are unchanged.
//    The Sep-2025 column (Q2FY26) was restated the same way (revenue Rs6,189 cr vs Rs6,303.5 cr filed on 7-Nov-2025:
//    EBITDA Rs941.1 cr, interest Rs109.6 cr, depreciation Rs217.8 cr, other income Rs54.7 cr + associates Rs6.3 cr;
//    Q2FY26 investor presentation; ICICI Direct and PL quarterly tables). Both restatements appear to take out Apollo Cradle
//    and Fertility (being combined with Cloudnine), presented separately in later filings; the report keeps the
//    figures as published by 30-Sep-2026.
// Originals are kept under _gamPatch. Idempotent.
// Usage: node tools/authoring/APOLLOHOSP.patch.js  (prints the check; src/model.js applies patchRaw in memory)
const fs = require('fs');
const path = require('path');
const F = path.join(__dirname, '..', '..', 'data', 'raw', 'APOLLOHOSP', 'screener.json');

const AS_FILED = {
  'Jun 2026': { 'Sales': 7043.5, 'Expenses': 5951.4, 'Operating Profit': 1092.1, 'OPM %': 16, 'Other Income': 62.2, 'Interest': 120.4,
    'Depreciation': 235.1, 'Profit before tax': 798.8, 'Tax %': 24, 'Net Profit': 610.4, 'EPS in Rs': 40.39, 'YoY Sales growth': 21 },
  'Sep 2025': { 'Sales': 6303.5, 'Expenses': 5362.4, 'Operating Profit': 941.1, 'OPM %': 15, 'Other Income': 61.0, 'Interest': 109.6,
    'Depreciation': 217.8, 'Profit before tax': 674.7, 'Tax %': 27, 'Net Profit': 494.0, 'EPS in Rs': 33.19, 'YoY Sales growth': 13 },
};

function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const keep = { note: 'Net Profit rows replaced by Screener "Profit for EPS" (after minorities); Jun-2026 and Sep-2025 quarters reset to the figures as first filed. Originals below.', fetchedAt: S.fetchedAt, original: {} };
  const q = S.tables.quarters;
  for (const [per, vals] of Object.entries(AS_FILED)) {
    const j = q.periods.indexOf(per); if (j < 0) continue;
    keep.original[per] = {};
    for (const [k, v] of Object.entries(vals)) if (q.rows[k]) { keep.original[per][k] = q.rows[k][j]; q.rows[k][j] = v; }
  }
  for (const tab of ['profit-loss', 'quarters']) {
    const T = S.tables[tab];
    const pfe = S.schedules?.[tab]?.['Net Profit']?.['Profit for EPS'];
    if (!T || !pfe) throw new Error(`APOLLOHOSP patch: no Profit for EPS schedule for ${tab}`);
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
  console.log('in-memory check | FY26 Net Profit', pl.rows['Net Profit'][i], 'EPS', pl.rows['EPS in Rs'][i], 'implied shares', (pl.rows['Net Profit'][i] / pl.rows['EPS in Rs'][i]).toFixed(2), '(actual 14.38 cr)');
  const q = S.tables.quarters, j = q.periods.indexOf('Jun 2026');
  console.log('Q1FY27 as filed | sales', q.rows.Sales[j], 'EBITDA', q.rows['Operating Profit'][j], 'PBT', q.rows['Profit before tax'][j], 'attributable PAT', q.rows['Net Profit'][j], 'EPS', q.rows['EPS in Rs'][j]);
}
