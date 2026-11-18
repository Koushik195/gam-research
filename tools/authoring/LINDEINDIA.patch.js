// LINDEINDIA: align Screener's 15-month FY23 column label across tables. The P&L calls it
// 'Mar 2023 15m'; the balance sheet, cash flow, ratios and line-item schedules call it 'Mar 2023'.
// The engine aligns tables on the P&L periods, so without this FY23 balance-sheet/cash-flow values
// are dropped (and Excel's FY23 debt/equity divides by zero).
// Applied in memory by src/model.js on every build (patchRaw), so a fresh Screener fetch cannot undo
// it. Idempotent.
const OLD = 'Mar 2023', NEW = 'Mar 2023 15m';

function patchRaw(S) {
  for (const [k, t] of Object.entries(S.tables || {})) if (k !== 'profit-loss' && k !== 'quarters') t.periods = t.periods.map(p => (p === OLD ? NEW : p));
  for (const [sec, o] of Object.entries(S.schedules || {})) {
    if (sec === 'quarters') continue;
    for (const par of Object.values(o || {})) for (const item of Object.values(par || {})) if (item && typeof item === 'object' && OLD in item) { item[NEW] = item[OLD]; delete item[OLD]; }
  }
  return S;
}

module.exports = { patchRaw };
