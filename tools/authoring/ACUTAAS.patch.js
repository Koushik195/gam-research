// ACUTAAS: put Screener's consolidated "Net Profit" on the attributable basis (profit after minority interests).
// Why: Screener's "Net Profit" row is profit BEFORE minorities while "EPS in Rs" is AFTER them. Acutaas has three outside
// partners: 45% of Baba Fine Chemicals (partnership firm; partner Rakesh Gupta), 25% of Indichem Inc (Korea; partner J & Materials
// Co., since FY26) and, from Q1FY27, 10% of Acutaas Chemicals Electrolytes (business partner ARZ). AR FY26 consolidated P&L:
// profit Rs35,636.93 lakh, owners Rs35,625.53 lakh, NCI Rs11.40 lakh; FY25 Rs16,041.77 / 15,871.36 / 170.41 lakh. The gap is
// small in FY25-26 but large in FY24 (Screener Net Profit Rs49 cr vs Profit for EPS Rs43 cr: BFC's partner took ~Rs6 cr) and in
// quarters (Dec-25 106 vs 108, Mar-26 134 vs 132, Jun-26 75 vs 74). The engine infers shares as Net Profit / EPS, which in FY24
// would give 8.4 cr shares instead of ~7.4 cr. We replace the rows with Screener's own "Profit for EPS" schedule (= profit
// attributable to owners), as LAURUSLABS.patch.js does. FY26 check: 356 / 43.51 = 8.18 cr implied shares = 8,18,71,122 shares
// outstanding (Q1FY27 deck p.8). Not changed: the FY24 exceptional item (full impairment of the 50% JV Ami Oncotheranostics LLC,
// Rs32.1 cr, AR FY26 note 50) stays in history; ACUTAAS.ctx.js computes EPS before it for the forward-P/E median.
// Originals are kept under _gamPatch. Idempotent. Usage: node tools/authoring/ACUTAAS.patch.js (prints the checks).
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', '..', 'data', 'raw', 'ACUTAAS', 'screener.json');

function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const keep = { note: 'Net Profit rows replaced by Screener "Profit for EPS" (attributable to owners, after minorities). Originals below.', fetchedAt: S.fetchedAt, original: {} };
  for (const tab of ['profit-loss', 'quarters']) {
    const T = S.tables?.[tab];
    const pfe = S.schedules?.[tab]?.['Net Profit']?.['Profit for EPS'];
    if (!T || !pfe) throw new Error(`ACUTAAS patch: no Profit for EPS schedule for ${tab}`);
    const row = T.rows['Net Profit'];
    keep.original[tab] = row.slice();
    T.rows['Net Profit'] = T.periods.map((p, i) => (p === 'TTM' ? row[i] : typeof pfe[p] === 'number' ? pfe[p] : row[i]));
  }
  S._gamPatch = keep;
  return S;
}

module.exports = { patchRaw };
if (require.main === module) {
  const S = patchRaw(JSON.parse(fs.readFileSync(FILE, 'utf8')));
  const pl = S.tables['profit-loss'];
  for (const p of ['Mar 2023', 'Mar 2024', 'Mar 2025', 'Mar 2026']) {
    const i = pl.periods.indexOf(p);
    console.log(`${p} | Net Profit ${pl.rows['Net Profit'][i]} (was ${S._gamPatch.original['profit-loss'][i]}) | EPS ${pl.rows['EPS in Rs'][i]} | implied shares ${(pl.rows['Net Profit'][i] / pl.rows['EPS in Rs'][i]).toFixed(2)} cr`);
  }
  const q = S.tables.quarters, j = q.periods.indexOf('Jun 2026');
  console.log('Q1FY27 | Net Profit', q.rows['Net Profit'][j], '(was', S._gamPatch.original.quarters[j] + ') EPS', q.rows['EPS in Rs'][j], 'implied shares', (q.rows['Net Profit'][j] / q.rows['EPS in Rs'][j]).toFixed(2));
}
