// COHANCE: put Screener's consolidated data on the attributable, post-merger basis.
// (1) Net Profit -> "Profit for EPS". Screener's "Net Profit" row is profit BEFORE minorities, while "EPS in Rs" is AFTER them.
//     Cohance has two subsidiaries that are not wholly owned: NJ Bio Inc (USA, 56% owned since 20-Dec-2024; 44% minority with a
//     put option) and Sapala Organics (India, 67.5% owned since 11-Jul-2024; 32.5% minority). NJ Bio makes losses, so the
//     minorities ABSORB part of them: FY26 profit Rs150.12 cr, owners Rs179.23 cr, NCI -Rs29.11 cr (AR FY26 consolidated P&L);
//     Q1FY27 loss Rs45.2 cr, owners -Rs24.1 cr (NCI -Rs21.1 cr; Q1FY27 deck note 4). The engine infers shares as Net Profit / EPS,
//     which on Screener's raw rows gives 32 cr shares for FY26 instead of 38.3 cr. We use Screener's own "Profit for EPS"
//     schedule (as ACUTAAS / LAURUSLABS patches do). FY26 check: 179 / 4.68 = 38.25 cr = 38.26 cr shares of Rs1 (AR FY26 note 17).
// (2) FY25 EPS on the post-merger share count. Suven Pharmaceuticals absorbed Cohance Lifesciences with effect from 1-May-2025
//     (pooling of interests, Ind AS 103 Appendix C; 12,80,02,184 new shares at 11 Suven shares for 295 Cohance shares). Screener
//     shows the RESTATED FY25 profit (Rs487 cr, merged) divided by the PRE-merger 25.46 cr shares (EPS Rs19.14). The audited
//     restated FY25 EPS is Rs12.79 basic / Rs12.68 diluted (AR FY26 note 59; weighted 38.12 cr / 38.37 cr shares incl. shares
//     to be issued under the scheme). We set FY25 EPS to Rs12.68 (diluted, like Screener's FY26 Rs4.68) and FY25 quarterly EPS
//     to Profit for EPS / 38.37 cr, so the per-share history is on one post-merger basis. FY19-FY24 are Suven alone (25.46 cr
//     shares; Cohance not restated into them) and are left as Screener has them.
// Originals are kept under _gamPatch. Idempotent. Usage: node tools/authoring/COHANCE.patch.js (prints the checks).
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', '..', 'data', 'raw', 'COHANCE', 'screener.json');
const FY25_EPS = 12.68, FY25_SHARES = 38.3713858; // AR FY26 note 59: diluted EPS and weighted diluted shares (crore)
const FY25_Q = ['Jun 2024', 'Sep 2024', 'Dec 2024', 'Mar 2025'];

function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const keep = { note: 'Net Profit rows replaced by Screener "Profit for EPS" (attributable to owners); FY25 EPS (annual and quarterly) restated to the post-merger share count (AR FY26 note 59). Originals below.', fetchedAt: S.fetchedAt, original: {}, originalEps: {} };
  for (const tab of ['profit-loss', 'quarters']) {
    const T = S.tables?.[tab];
    const pfe = S.schedules?.[tab]?.['Net Profit']?.['Profit for EPS'];
    if (!T || !pfe) throw new Error(`COHANCE patch: no Profit for EPS schedule for ${tab}`);
    const row = T.rows['Net Profit'];
    keep.original[tab] = row.slice();
    keep.originalEps[tab] = T.rows['EPS in Rs'].slice();
    T.rows['Net Profit'] = T.periods.map((p, i) => (p === 'TTM' ? row[i] : typeof pfe[p] === 'number' ? pfe[p] : row[i]));
  }
  const pl = S.tables['profit-loss'], i25 = pl.periods.indexOf('Mar 2025');
  if (i25 >= 0) pl.rows['EPS in Rs'][i25] = FY25_EPS;
  const q = S.tables.quarters;
  FY25_Q.forEach(p => { const j = q.periods.indexOf(p); if (j >= 0) q.rows['EPS in Rs'][j] = Math.round(q.rows['Net Profit'][j] / FY25_SHARES * 100) / 100; });
  S._gamPatch = keep;
  return S;
}

module.exports = { patchRaw, FY25_EPS, FY25_SHARES };
if (require.main === module) {
  const S = patchRaw(JSON.parse(fs.readFileSync(FILE, 'utf8')));
  const pl = S.tables['profit-loss'];
  for (const p of ['Mar 2024', 'Mar 2025', 'Mar 2026']) {
    const i = pl.periods.indexOf(p);
    console.log(`${p} | Net Profit ${pl.rows['Net Profit'][i]} (was ${S._gamPatch.original['profit-loss'][i]}) | EPS ${pl.rows['EPS in Rs'][i]} (was ${S._gamPatch.originalEps['profit-loss'][i]}) | implied shares ${(pl.rows['Net Profit'][i] / pl.rows['EPS in Rs'][i]).toFixed(2)} cr`);
  }
  const q = S.tables.quarters;
  for (const p of [...FY25_Q, 'Mar 2026', 'Jun 2026']) { const j = q.periods.indexOf(p); console.log(p, '| Net Profit', q.rows['Net Profit'][j], '(was', S._gamPatch.original.quarters[j] + ') EPS', q.rows['EPS in Rs'][j], '(was', S._gamPatch.originalEps.quarters[j] + ')'); }
}
