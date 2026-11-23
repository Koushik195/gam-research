// EICHERMOT: align Screener's 15-month FY16 column label across tables (Eicher moved from a December to a
// March year-end in 2015-16). The P&L calls it 'Mar 2016 15m'; the balance sheet, cash flow, ratios and
// line-item schedules call it 'Mar 2016'. The engine aligns tables on the P&L periods, so without this the
// FY16 balance-sheet and cash-flow values are dropped (and Excel's FY16 debt/equity divides by zero).
// Net Profit already equals Screener's "Profit for EPS" (no minorities: VECV is equity-accounted), so no
// profit patch is needed. Applied in memory by src/model.js on every build (patchRaw); idempotent.
const OLD = 'Mar 2016', NEW = 'Mar 2016 15m';

function patchRaw(S) {
  for (const [k, t] of Object.entries(S.tables || {})) if (k !== 'profit-loss' && k !== 'quarters') t.periods = t.periods.map(p => (p === OLD ? NEW : p));
  for (const [sec, o] of Object.entries(S.schedules || {})) {
    if (sec === 'quarters') continue;
    for (const par of Object.values(o || {})) for (const item of Object.values(par || {})) if (item && typeof item === 'object' && OLD in item) { item[NEW] = item[OLD]; delete item[OLD]; }
  }
  return S;
}

module.exports = { patchRaw };
