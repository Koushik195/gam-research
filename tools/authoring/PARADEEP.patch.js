// PARADEEP: put the merger-affected rows of Screener's data on the company's restated basis.
// Why: Mangalore Chemicals & Fertilizers (MCFL) merged into Paradeep Phosphates (NCLT orders 24/26-Sep-2025,
// effective 16-Oct-2025, appointed date 1-Apr-2024; 22,16,23,331 new shares allotted 3-Dec-2025 at 187 PPL
// shares per 100 MCFL shares). The FY26 accounts restate FY25 to include MCFL. Screener carries the restated
// FY25 profit (₹662 cr) but divides it by the pre-merger share count (EPS ₹8.12); the company's restated
// basic EPS is ₹6.39 (FY26 annual report, consolidated P&L, note 28: 103.67 cr weighted shares).
// Quarterly: Screener's Jun-2024 quarter is still pre-merger PPL alone (sales ₹2,377 cr, profit ₹5 cr), while
// Sep-2024 onwards are restated; and EPS for Jun-2024..Sep-2025 uses the old share count. We replace the
// Jun-2024 quarter with the restated figures (H1FY25 less Q2FY25 in the Q2FY26 presentation) and set the
// quarterly EPS to the restated values the company published (Q2FY26 and Q3FY26 presentations, Q4FY26 and
// Q1FY27 presentations). FY19-FY24 stay as reported (PPL alone, before MCFL): see the report's history chapter.
// The original rows are kept under _gamPatch. Applied in memory by src/model.js on every build.
const PATCH = {
  annualEps: { 'Mar 2025': 6.39 },
  // Restated Q1FY25 (₹ cr): revenue 77,751 − 46,192 mn; EBITDA incl. other income 7,754 − 5,273 mn; other income
  // 459 − 202 mn; EBIT 6,050 − 4,412 mn; PBT 3,832 − 3,365 mn; PAT 2,806 − 2,553 mn (Q2FY26 presentation).
  q1fy25: { Sales: 3155.9, 'Operating Profit': 222.4, 'Other Income': 25.7, Interest: 117.1, Depreciation: 84.3, 'Profit before tax': 46.7, 'Net Profit': 25.3, 'EPS in Rs': 0.24 },
  quarterEps: { 'Sep 2024': 2.46, 'Dec 2024': 2.02, 'Mar 2025': 1.66, 'Jun 2025': 3.05, 'Sep 2025': 3.30 },
};

function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const keep = { note: 'Merger restatement: FY25 EPS, Jun-2024 quarter and quarterly EPS put on the restated (post-merger) basis. Originals below.', fetchedAt: S.fetchedAt, original: {} };
  const pl = S.tables['profit-loss'];
  for (const [p, v] of Object.entries(PATCH.annualEps)) {
    const i = pl.periods.indexOf(p); if (i < 0) continue;
    keep.original[`pl.EPS.${p}`] = pl.rows['EPS in Rs'][i]; pl.rows['EPS in Rs'][i] = v;
  }
  const q = S.tables.quarters, j = q.periods.indexOf('Jun 2024');
  if (j >= 0) {
    const Q = PATCH.q1fy25;
    for (const [k, v] of Object.entries(Q)) if (q.rows[k]) { keep.original[`q.${k}.Jun 2024`] = q.rows[k][j]; q.rows[k][j] = v; }
    if (q.rows.Expenses) q.rows.Expenses[j] = Math.round((Q.Sales - Q['Operating Profit']) * 10) / 10;
    if (q.rows['OPM %']) q.rows['OPM %'][j] = Math.round(Q['Operating Profit'] / Q.Sales * 100);
    if (q.rows['Tax %']) q.rows['Tax %'][j] = Math.round((1 - Q['Net Profit'] / Q['Profit before tax']) * 100);
  }
  for (const [p, v] of Object.entries(PATCH.quarterEps)) {
    const i = q.periods.indexOf(p); if (i < 0) continue;
    keep.original[`q.EPS.${p}`] = q.rows['EPS in Rs'][i]; q.rows['EPS in Rs'][i] = v;
  }
  // YoY sales growth for the restated quarters (Jun-2025 vs restated Jun-2024)
  const yi = q.periods.indexOf('Jun 2025');
  if (yi >= 0 && j >= 0 && q.rows['YoY Sales growth']) q.rows['YoY Sales growth'][yi] = Math.round((q.rows.Sales[yi] / q.rows.Sales[j] - 1) * 100);
  S._gamPatch = keep;
  return S;
}

module.exports = { patchRaw, PATCH };
