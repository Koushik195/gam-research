// OLECTRA: in-memory fixes applied by src/model.js on every build (patchRaw); idempotent.
// 1) Attributable profit. Screener's consolidated "Net Profit" row is before minority interests (FY26 Rs180 cr) while
//    "EPS in Rs" is after them (Rs21.62). The minorities are small (Rs2.0 cr in FY26: the SSISPL-OGL-BYD consortium and
//    other subsidiaries, AR FY26), but the engine infers shares as Net Profit / EPS (180 / 21.62 = 8.33 cr instead of the
//    8.208 cr shares of Rs4 in issue, AR FY26 note 15). We replace the row with Screener's own "Profit for EPS" schedule
//    (FY26 Rs177 cr), as UPL, JBMA and CRAFTSMAN do; the remaining gap is Screener's rounding to whole crores.
// 2) Annual history starts at FY19 (the templates' window): FY15-FY18 predate the MEIL takeover and the share issues
//    of FY18-19, and add nothing to a FY19-FY29E report.
// 3) Header industry label: Screener says "Passenger Cars & Utility Vehicles"; relabelled "Commercial Vehicles (electric buses)".
// The forward-P/E history (valuation-blend forwardMedian) reads Screener's unpatched EPS, which is already attributable.
const fs = require('fs');
const path = require('path');

function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const keep = { note: 'Net Profit = Screener "Profit for EPS" (attributable to owners); FY15-18 dropped. Originals below.', fetchedAt: S.fetchedAt, original: {} };
  for (const tab of ['profit-loss', 'quarters']) {
    const T = S.tables[tab];
    const pfe = S.schedules?.[tab]?.['Net Profit']?.['Profit for EPS'];
    if (!T || !pfe) throw new Error(`OLECTRA patch: no Profit for EPS schedule for ${tab}`);
    const row = T.rows['Net Profit'];
    keep.original[tab] = row.slice();
    T.rows['Net Profit'] = T.periods.map((p, i) => (p === 'TTM' ? row[i] : typeof pfe[p] === 'number' ? pfe[p] : row[i]));
  }
  keep.droppedYears = [];
  for (const tab of ['profit-loss', 'balance-sheet', 'cash-flow', 'ratios']) {
    const T = S.tables[tab]; if (!T) continue;
    const idx = T.periods.map((p, i) => (/\(S\)|^Mar 201[5-8]/.test(p) ? i : -1)).filter(i => i >= 0);
    if (tab === 'profit-loss') keep.droppedYears = idx.map(i => T.periods[i]);
    T.periods = T.periods.filter((_, i) => !idx.includes(i));
    for (const r of Object.keys(T.rows)) T.rows[r] = T.rows[r].filter((_, i) => !idx.includes(i));
  }
  // 3) Screener files Olectra under "Passenger Cars & Utility Vehicles"; it makes buses and tippers. Relabel the industry
  //    level shown in the report header (the sector and index levels are untouched).
  if (Array.isArray(S.sectorPath) && S.sectorPath[3] === 'Passenger Cars & Utility Vehicles') { keep.sectorLabel = S.sectorPath[3]; S.sectorPath[3] = 'Commercial Vehicles (electric buses)'; }
  S._gamPatch = keep;
  return S;
}

module.exports = { patchRaw };
if (require.main === module) {
  const S = patchRaw(JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'raw', 'OLECTRA', 'screener.json'), 'utf8')));
  const pl = S.tables['profit-loss']; console.log(pl.periods.join(' | ')); console.log(pl.rows['Net Profit'].join(' | ')); console.log(pl.rows['EPS in Rs'].join(' | '));
  console.log(pl.periods.map((p, i) => (pl.rows['Net Profit'][i] / pl.rows['EPS in Rs'][i]).toFixed(2)).join(' | '));
}
