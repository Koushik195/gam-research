// TENNIND (Tenneco Clean Air India): in-memory fix applied by src/model.js on every build (patchRaw); idempotent.
// FY21 and FY22 columns dropped. Screener marks both "(S)": they are the standalone accounts of the 2018 shell company
// (Tenneco Clean Air India Pvt Ltd) before the March-2025 common-control combination, in which it acquired Tenneco
// Automotive India, Federal-Mogul Ignition Products India, Federal-Mogul Sealings India and Federal-Mogul Bearings India
// through a share swap (189,515,480 new shares, AR FY26 consolidated note 39). The combination is pooled (Ind AS 103
// Appendix C) and restated from 1-Apr-2022, so FY23 onwards are like-for-like consolidated figures; FY21-22 (revenue
// Rs949 cr / Rs1,571 cr) cover only part of today's business and would show a false 65% jump in FY23 (MSUMI/CRAFTSMAN
// precedent). Share count: 403,604,309 shares throughout FY23-FY26 on Screener's restated EPS (Net Profit / EPS = 40.4 cr);
// the Nov-2025 IPO was a pure offer for sale, so no new shares. Minority interest is ~Rs1 cr a year (Profit for EPS = Net
// Profit within Rs1 cr), so no profit patch is needed.
const fs = require('fs');
const path = require('path');
const DROP = ['Mar 2021', 'Mar 2022'];

function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const keep = { note: 'FY21-FY22 (standalone shell, pre-combination) dropped from every annual table.', fetchedAt: S.fetchedAt, dropped: {} };
  for (const tab of ['profit-loss', 'balance-sheet', 'cash-flow', 'ratios']) {
    const T = S.tables?.[tab]; if (!T) continue;
    const idx = T.periods.map((p, i) => (DROP.includes(p.replace(/ \(S\)$/, '')) ? i : -1)).filter(i => i >= 0);
    if (!idx.length) continue;
    keep.dropped[tab] = idx.map(i => T.periods[i]);
    T.periods = T.periods.filter((_, i) => !idx.includes(i));
    for (const r of Object.keys(T.rows)) T.rows[r] = T.rows[r].filter((_, i) => !idx.includes(i));
  }
  for (const tab of ['profit-loss', 'balance-sheet', 'cash-flow']) {
    const G = S.schedules?.[tab]; if (!G) continue;
    for (const grp of Object.values(G)) for (const item of Object.values(grp)) if (item && typeof item === 'object') for (const p of DROP) delete item[p];
  }
  S._gamPatch = keep;
  return S;
}

module.exports = { patchRaw };
if (require.main === module) {
  const S = patchRaw(JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'raw', 'TENNIND', 'screener.json'), 'utf8')));
  for (const t of ['profit-loss', 'balance-sheet', 'cash-flow', 'ratios']) console.log(t, S.tables[t].periods.join(' | '));
  console.log(S.tables['profit-loss'].rows['EPS in Rs'].join(' | '));
}
