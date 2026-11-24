// ITCHOTELS: corrections to Screener's consolidated data, applied in memory by src/model.js on every build (patchRaw).
// 1) Annual P&L on the company's own classification (AR FY26 consolidated statement of profit and loss, p.205):
//    Screener's annual rows move ~Rs37-47 cr a year from operating costs into "Interest" (FY26 Interest Rs55 cr vs
//    finance costs of Rs7.93 cr in the audited accounts; EBITDA Rs1,480 cr vs Rs1,424 cr reported), while its
//    quarterly rows match the company (Q1FY27 EBITDA Rs292 cr, interest Rs2 cr). We restore the audited split so that
//    history, segments (which use company EBITDA) and the forward EV/EBITDA are on one basis:
//      FY25: revenue 3,559.81; operating costs 2,348.93 (EBITDA 1,210.88); other income 66.30 + associates 15.87;
//            finance costs 6.64; depreciation 402.35; PBT 884.06.
//      FY26: revenue 4,139.40; operating costs 2,715.62 (EBITDA 1,423.78, incl. real-estate cost 138.54); other income
//            191.94 + associates 11.87 - exceptional items 80.17 (labour codes 54.19, cyclone Ditwah 25.98);
//            finance costs 7.93; depreciation 416.51; PBT 1,122.98.
//    PBT is unchanged, so profit, tax and EPS are unchanged.
// 2) Net Profit on the attributable basis: Screener's "Net Profit" is before minorities (FY26 Rs821 cr) while EPS is
//    after them (Rs3.92); the engine infers shares as Net Profit / EPS (209.4 cr vs the real 208.30 cr). Replaced by
//    Screener's "Profit for EPS" schedule (FY26 Rs817 cr), as INDHOTEL.patch.js / UPL.patch.js do. Minorities are tiny
//    (Rs4 cr in FY26: Srinivasa Resorts, Fortune Park).
// Not patched (explained in the report): Screener's "Mar 2024" column is the restated comparative period of ~8 months
// (28-Jul-2023, the company's incorporation, to 31-Mar-2024; AR FY25), not a full year, and is never used for growth.
// Originals are kept under _gamPatch. Idempotent.
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', '..', 'data', 'raw', 'ITCHOTELS', 'screener.json');

const AUDITED = {
  'Mar 2025': { Sales: 3559.81, Expenses: 2348.93, 'Other Income': 66.30 + 15.87, Interest: 6.64, Depreciation: 402.35, pbt: 884.06 },
  'Mar 2026': { Sales: 4139.40, Expenses: 2715.62, 'Other Income': 191.94 + 11.87 - 80.17, Interest: 7.93, Depreciation: 416.51, pbt: 1122.98 },
};

function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const keep = { note: 'Annual P&L split restored to the audited accounts; Net Profit = Profit for EPS. Originals below.', fetchedAt: S.fetchedAt, original: {} };
  const T = S.tables['profit-loss'], R = T.rows;
  keep.original['profit-loss'] = JSON.parse(JSON.stringify(R));
  for (const [p, a] of Object.entries(AUDITED)) {
    const i = T.periods.indexOf(p); if (i < 0) continue;
    const ebitda = a.Sales - a.Expenses, pbt = ebitda + a['Other Income'] - a.Interest - a.Depreciation;
    if (Math.abs(pbt - a.pbt) > 0.05) throw new Error(`ITCHOTELS patch ${p}: PBT ${pbt.toFixed(2)} != ${a.pbt}`);
    if (Math.abs(R['Profit before tax'][i] - a.pbt) > 1) throw new Error(`ITCHOTELS patch ${p}: Screener PBT ${R['Profit before tax'][i]} != audited ${a.pbt}`);
    R.Expenses[i] = Math.round(a.Expenses); R['Operating Profit'][i] = Math.round(ebitda); R['OPM %'][i] = Math.round(ebitda / a.Sales * 100);
    R['Other Income'][i] = Math.round(a['Other Income']); R.Interest[i] = Math.round(a.Interest); R.Depreciation[i] = Math.round(a.Depreciation);
  }
  const pfe = S.schedules?.['profit-loss']?.['Net Profit']?.['Profit for EPS'];
  if (!pfe) throw new Error('ITCHOTELS patch: no Profit for EPS schedule');
  R['Net Profit'] = T.periods.map((p, i) => (p === 'TTM' ? R['Net Profit'][i] : typeof pfe[p] === 'number' ? pfe[p] : R['Net Profit'][i]));
  S._gamPatch = keep;
  return S;
}

module.exports = { patchRaw, AUDITED };
if (require.main === module) {
  const S = patchRaw(JSON.parse(fs.readFileSync(FILE, 'utf8'))), T = S.tables['profit-loss'];
  T.periods.forEach((p, i) => console.log(p, ['Sales', 'Expenses', 'Operating Profit', 'Other Income', 'Interest', 'Depreciation', 'Profit before tax', 'Net Profit', 'EPS in Rs'].map(k => `${k} ${T.rows[k][i]}`).join(' | ')));
  const i = T.periods.indexOf('Mar 2026'); console.log('implied shares FY26', (T.rows['Net Profit'][i] / T.rows['EPS in Rs'][i]).toFixed(2), '(actual 208.30 cr)');
}
