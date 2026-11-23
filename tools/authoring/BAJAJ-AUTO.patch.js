// BAJAJ-AUTO: three in-memory corrections to Screener consolidated data. 1. "Net Profit" on the attributable basis (profit for the owners of
// Bajaj Auto, after non-controlling interests). Why: since 18-Nov-2025 Bajaj consolidates Bajaj Mobility AG
// (BMAG, the listed parent of KTM AG) line by line through BAIH BV -> Bajaj Auto International Holdings AG,
// which owns ~74.94% of BMAG. The other ~25% of BMAG's losses belong to minority shareholders. Screener's
// "Net Profit" row is profit BEFORE minorities (FY26 Rs10,574.50 cr) while "EPS in Rs" is AFTER minorities
// (Rs384.41 diluted; profit for the owners Rs10,744.21 cr, AR FY26 consolidated P&L). Because the minorities'
// share is a LOSS (-Rs169.71 cr in FY26, all in Q4FY26: BMAG lost Rs871.86 cr before tax in its first six weeks
// in the group, 18-Nov to 31-Dec-2025, AR FY26 note 46), attributable profit is HIGHER than Net Profit. The engine
// infers shares as Net Profit / EPS: 10,574.50 / 384.41 = 27.51 cr instead of the real 27.95 cr (279,497,838
// shares of Rs10 at 31-Mar-2026; equity capital Rs279.50 cr, AR FY26 note 13), a 1.6% error in every per-share value.
// We replace the row with Screener's own "Profit for EPS" schedule (= profit attributable to owners), as
// ASIANPAINT.patch.js and UPL.patch.js do. Quarterly: Q4FY26 minority share +Rs170 cr, Q1FY27 +Rs37 cr.
// The original rows are kept under _gamPatch. Idempotent. Note: the July-2026 buyback (up to 4,694,000 shares at
// Rs12,000) cut the count to ~274.8 mn (27.48 cr) after the FY26 year-end; the engine still uses the FY26 count (see
// assumptions.json _shareNote and BAJAJ-AUTO.ctx.js).
// Usage: node tools/authoring/BAJAJ-AUTO.patch.js  (prints the check; src/model.js applies patchRaw in memory)
const fs = require('fs');
const path = require('path');
const F = path.join(__dirname, '..', '..', 'data', 'raw', 'BAJAJ-AUTO', 'screener.json');

// 2. Bajaj Auto Credit (BACL, the captive lender) is a lending business: its interest cost is its cost of
//    goods. Screener puts it in "Interest" with the group's financing costs. We move it into Expenses, so
//    consolidated EBITDA is struck after BACL's funding cost and "Interest" is only the cost of the non-lending
//    debt (KTM's bank loans, leases, sales-tax deferral). PBT and profit do not change. Annual: FY25 Rs320.81 cr,
//    FY26 Rs908.38 cr (BACL audited results 5-May-2026; = consolidated finance cost less the Rs68.09 cr / Rs260.21 cr
//    left unallocated in AR FY26 note 44). Quarterly: FY25 = consolidated less standalone interest (the two sum to
//    FY25 exactly); Q3FY26 Rs254.85 cr and Q4FY26 Rs274.05 cr (BACL results); Q1FY26 Rs174 cr and Q1FY27 Rs305 cr
//    (BACL operating profit less PBDT, Capital Market data via JM Financial, 20-Jul-2026 and Jul-2025); Q2FY26 =
//    FY26 less the other three quarters.
const BACL_FIN = { annual: { 'Mar 2025': 320.81, 'Mar 2026': 908.38 },
  quarters: { 'Jun 2024': 26, 'Sep 2024': 59, 'Dec 2024': 106, 'Mar 2025': 130, 'Jun 2025': 174, 'Sep 2025': 205.48, 'Dec 2025': 254.85, 'Mar 2026': 274.05, 'Jun 2026': 305 } };
// 3. KTM (Pierer Bajaj AG / PMAG) was an associate until 18-Nov-2025. Screener puts the share of its loss inside
//    "Expenses" in FY25 (-Rs915.48 cr, AR FY26 consolidated P&L) and in Q2FY26 (-Rs634 cr = FY26 share Rs560.74 cr
//    less the Rs1,195 cr booked in Q4FY26, Q4FY26 call), which understates EBITDA. We move it to "Other Income",
//    where Screener already shows the FY26 annual figure and Q4FY26. PBT unchanged. (The FY25 quarterly split is
//    not disclosed in what we hold, so FY25 quarters are left as Screener shows them.)
const ASSOC = { annual: { 'Mar 2025': -915.48 }, quarters: { 'Sep 2025': -634 } };

function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const keep = { note: 'Net Profit rows replaced by Screener "Profit for EPS" (attributable to owners, after non-controlling interests in Bajaj Mobility AG); BACL finance cost moved from Interest to Expenses; KTM associate share moved from Expenses to Other Income. Originals below.', fetchedAt: S.fetchedAt, original: {} };
  for (const tab of ['profit-loss', 'quarters']) {
    const T = S.tables[tab];
    const pfe = S.schedules?.[tab]?.['Net Profit']?.['Profit for EPS'];
    if (!T || !pfe) throw new Error(`BAJAJ-AUTO patch: no Profit for EPS schedule for ${tab}`);
    keep.original[tab] = Object.fromEntries(['Net Profit', 'Expenses', 'Operating Profit', 'OPM %', 'Other Income', 'Interest'].map(k => [k, (T.rows[k] || []).slice()]));
    const row = T.rows['Net Profit'];
    T.rows['Net Profit'] = T.periods.map((p, i) => (p === 'TTM' ? row[i] : typeof pfe[p] === 'number' ? pfe[p] : row[i]));
    const key = tab === 'quarters' ? 'quarters' : 'annual';
    T.periods.forEach((p, i) => {
      const f = BACL_FIN[key][p] || 0, a = ASSOC[key][p] || 0; // a < 0: a loss sitting in Expenses
      if (!f && !a) return;
      const r = k => T.rows[k];
      r('Expenses')[i] = Math.round((r('Expenses')[i] + f + a) * 100) / 100;
      r('Operating Profit')[i] = Math.round((r('Operating Profit')[i] - f - a) * 100) / 100;
      r('Interest')[i] = Math.round((r('Interest')[i] - f) * 100) / 100;
      r('Other Income')[i] = Math.round((r('Other Income')[i] + a) * 100) / 100;
      if (r('OPM %')) r('OPM %')[i] = Math.round(r('Operating Profit')[i] / r('Sales')[i] * 100);
    });
  }
  S._gamPatch = keep;
  return S;
}

module.exports = { patchRaw };
if (require.main === module) {
  const S = patchRaw(JSON.parse(fs.readFileSync(F, 'utf8')));
  const pl = S.tables['profit-loss'], i = pl.periods.indexOf('Mar 2026');
  console.log('in-memory check | FY26 Net Profit', pl.rows['Net Profit'][i], 'EPS', pl.rows['EPS in Rs'][i], 'implied shares', (pl.rows['Net Profit'][i] / pl.rows['EPS in Rs'][i]).toFixed(2), '(actual 27.95 cr at Mar-26; 27.48 cr after the Jul-26 buyback)');
  const q = S.tables.quarters, j = q.periods.indexOf('Jun 2026');
  console.log('Q1FY27 | attributable PAT', q.rows['Net Profit'][j], 'EPS', q.rows['EPS in Rs'][j], 'implied shares', (q.rows['Net Profit'][j] / q.rows['EPS in Rs'][j]).toFixed(2));
}
