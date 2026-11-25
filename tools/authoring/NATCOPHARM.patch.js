// NATCOPHARM: share count only. Screener's consolidated "Net Profit" already equals profit attributable to owners (its
// "Profit for EPS" schedule matches for FY23-FY26: FY26 Rs1,418 cr = AR FY26 profit after the associate share Rs1,418.5 cr;
// the minority share is nil or ~Rs1-2 cr in every year), so no profit row is touched. The engine infers shares as FY26 Net
// Profit / EPS; Screener's FY26 EPS (Rs78.5) gives 18.06 cr shares, but Natco has had 179,109,870 shares of Rs2 in issue
// since the FY24 buyback (AR FY26 consolidated note 15: unchanged at 31-Mar-2025 and 31-Mar-2026; reported basic EPS
// Rs79.20 on the same weighted count). We set FY26 EPS to Net Profit / 17.9109870 cr, so per-share values use the shares
// in issue (the market-cap basis of the 30-Sep-2026 close, which is cum-rights: the 2-for-21 rights issue has a record
// date of 1-Oct-2026 and is not in the base). PPLPHARMA.patch.js precedent. The Q2FY27 (Sep-2026) columns Screener
// already holds are dropped by the engine's as-of freeze, not here. Original row kept under _gamPatch. Idempotent.
// Usage: node tools/authoring/NATCOPHARM.patch.js (prints the check; src/model.js applies patchRaw on every build).
const fs = require('fs');
const path = require('path');
const F = path.join(__dirname, '..', '..', 'data', 'raw', 'NATCOPHARM', 'screener.json');
const SHARES = 17.910987; // crore shares in issue at 31-Mar-2026 (AR FY26 note 15), unchanged to 30-Sep-2026

function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const pl = S.tables['profit-loss'], i26 = pl.periods.indexOf('Mar 2026');
  const pfe = S.schedules?.['profit-loss']?.['Net Profit']?.['Profit for EPS'];
  if (i26 < 0 || !pfe) throw new Error('NATCOPHARM patch: FY26 column or Profit for EPS schedule missing');
  const np = pl.rows['Net Profit'][i26];
  if (Math.abs(np - pfe['Mar 2026']) > 2) throw new Error(`NATCOPHARM patch: Net Profit ${np} differs from Profit for EPS ${pfe['Mar 2026']}; revisit the patch`);
  const keep = { note: 'FY26 EPS set to Net Profit / 17.911 cr shares in issue (AR FY26 note 15). Net Profit = Profit for EPS, unchanged.', fetchedAt: S.fetchedAt, original: { eps: pl.rows['EPS in Rs'].slice() } };
  pl.rows['EPS in Rs'][i26] = Math.round(np / SHARES * 10000) / 10000;
  // Rights-issue leak guard (as-of rule): Screener's live Market Cap counts the ~17.06 mn rights shares allotted on
  // 23-Oct-2026, and its shareholding tables carry an off-quarter "Oct 2026" column (post-rights pattern) that the
  // engine's as-of freeze keeps because it only filters Mar/Jun/Sep/Dec periods. We set Market Cap to the 179.11 mn
  // shares in issue at 30-Sep-2026 x the live price, and drop off-quarter shareholding columns dated after 30-Sep-2026.
  const num = s => Number(String(s || '').replace(/[^0-9.\-]/g, ''));
  const top = S.topRatios || {}, liveSh = num(top['Market Cap']) / num(top['Current Price']);
  if (liveSh && Math.abs(liveSh / SHARES - 1) > 0.02) { keep.original.marketCap = top['Market Cap']; top['Market Cap'] = `₹ ${Math.round(SHARES * num(top['Current Price']))} Cr.`; }
  const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const late = p => { const [m, y] = String(p).split(' '), mi = MON.indexOf(m); return mi >= 0 && !['Mar', 'Jun', 'Sep', 'Dec'].includes(m) && (+y * 12 + mi) > (2026 * 12 + 8); };
  for (const part of ['quarterly', 'yearly']) {
    const T = S.shareholding?.[part]; if (!T) continue;
    const drop = T.periods.map(late);
    if (drop.some(Boolean)) { keep.original[`shareholding.${part}`] = T.periods.filter((_, i) => drop[i]); T.periods = T.periods.filter((_, i) => !drop[i]); for (const k of Object.keys(T.rows)) T.rows[k] = T.rows[k].filter((_, i) => !drop[i]); }
  }
  S._gamPatch = keep;
  return S;
}

module.exports = { patchRaw, SHARES };
if (require.main === module) {
  const S = patchRaw(JSON.parse(fs.readFileSync(F, 'utf8')));
  const pl = S.tables['profit-loss'];
  for (const p of ['Mar 2023', 'Mar 2024', 'Mar 2025', 'Mar 2026']) {
    const i = pl.periods.indexOf(p);
    console.log(`${p} | Net Profit ${pl.rows['Net Profit'][i]} | EPS ${pl.rows['EPS in Rs'][i]} (Screener ${S._gamPatch.original.eps[i]}) | implied shares ${(pl.rows['Net Profit'][i] / pl.rows['EPS in Rs'][i]).toFixed(3)} cr (in issue ${SHARES})`);
  }
}
