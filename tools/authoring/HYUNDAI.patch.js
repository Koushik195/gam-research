// HYUNDAI: fill EPS for FY21-FY24 in Screener's P&L. Hyundai Motor India listed in Oct-2024, so Screener
// shows EPS only from FY25, although the share count has been 81,25,41,100 throughout (the IPO was a pure
// offer for sale by Hyundai Motor Company: no new shares). The company reports basic EPS of Rs57.96 (FY23)
// and Rs74.58 (FY24) in its investor presentations (Q3FY26, Q4FY26), i.e. net profit / 81.254 cr shares;
// FY21-FY22 use the same division (consolidated net profit / 81.254 cr). Net Profit already equals Profit
// for EPS (no minorities), so no profit patch is needed. Applied in memory by src/model.js on every build.
const SHARES_CR = 81.25411;
const REPORTED = { 'Mar 2023': 57.96, 'Mar 2024': 74.58 };

function patchRaw(S) {
  const pl = S.tables?.['profit-loss'];
  if (!pl?.rows?.['EPS in Rs'] || !pl.rows['Net Profit']) return S;
  pl.periods.forEach((p, i) => {
    if (!['Mar 2021', 'Mar 2022', 'Mar 2023', 'Mar 2024'].includes(p) || typeof pl.rows['EPS in Rs'][i] === 'number') return;
    pl.rows['EPS in Rs'][i] = REPORTED[p] ?? Math.round(pl.rows['Net Profit'][i] / SHARES_CR * 100) / 100;
  });
  return S;
}

module.exports = { patchRaw };
