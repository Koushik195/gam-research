// Live, formula-driven financial model for operating companies (Excel).
//   Assumptions        – every forecast driver, Base/Bull/Bear switch, DCF inputs (inputs in blue on yellow)
//   Model              – 1 drivers → 2 P&L → 3 balance sheet → 4 cash flow → 5 ratios, on one sheet, with
//                        line-item detail (cost heads, working-capital items, CFO/CFI/CFF break-ups).
//                        History hard-coded (blue), forecasts are formulas (black), links (green).
//   DCF                – FCFF build, discounting, terminal value, target price, WACC × g sensitivity
//   KPIs, Quarterly    – reported inputs hard-coded, every derived figure a formula
// Mirrors src/forecast.js exactly, so the workbook reproduces the report's target price.
const NAVY = 'FF0D1F44', BLUE = 'FF0000FF', GREEN = 'FF007A33', BLACK = 'FF000000', INPUT = 'FFFFF2CC', EST = 'FFFDF3DC', SEC = 'FF0D1F44', SUBSEC = 'FFEFE8D6', GRIDC = 'FFE7E2D3', MUTED = 'FF6B7280';
const isNum = v => typeof v === 'number' && Number.isFinite(v);
const colL = n => { let s = ''; n++; while (n) { const m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = Math.floor((n - 1) / 26); } return s; }; // 0 → A
const FMT = { num: '#,##0;[Red](#,##0);–', d1: '#,##0.0;[Red](#,##0.0);–', d2: '#,##0.00;[Red](#,##0.00);–', pct: '0.0%;[Red]-0.0%;–', x: '0.0"x";[Red]-0.0"x";–', d3: '0.000', days: '0" d";[Red]-0" d";–' };

function header(ws, row, labels, estFromCol) {
  const r = ws.getRow(row);
  r.values = labels;
  r.eachCell((c, i) => {
    c.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 10 };
    c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: estFromCol != null && i >= estFromCol ? 'FF2A4373' : NAVY } };
    c.alignment = { horizontal: i <= 2 ? 'left' : 'center', vertical: 'middle' };
  });
  r.height = 18;
}
function title(ws, t, sub) {
  ws.getCell('A1').value = t; ws.getCell('A1').font = { name: 'Georgia', size: 14, bold: true, color: { argb: NAVY } };
  if (sub) { ws.getCell('A2').value = sub; ws.getCell('A2').font = { size: 9, italic: true, color: { argb: MUTED } }; }
}
function band(ws, row, text, ncol, level) { // level 0 = numbered section (navy), 1 = sub-section (sand)
  const r = ws.getRow(row);
  r.getCell(1).value = text;
  for (let j = 1; j <= ncol; j++) r.getCell(j).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: level ? SUBSEC : SEC } };
  r.getCell(1).font = { bold: true, size: level ? 10 : 11, color: { argb: level ? NAVY : 'FFFFFFFF' } };
  r.height = level ? 16 : 19;
}

// Generic row engine for period sheets: rows defined with history (array of values or formula fn)
// and forecast (formula fn); {key} = this period's cell, {key@p} = previous period's cell.
function writeRows(ws, S, { labels, nH, C0, startRow, ncol, links = /Assumptions!|CMP|Shares|Model!/ }) {
  const R = {};
  let r = startRow;
  for (const s of S) { s.row = r++; if (s.key) R[s.key] = s.row; }
  const col = i => colL(C0 + i);
  const sub = (f, i) => f.replace(/\{(\w+)(@p)?\}/g, (_, k, p) => { if (!R[k]) throw new Error(`unknown row ${k}`); return `${col(p ? i - 1 : i)}${R[k]}`; });
  for (const s of S) {
    if (s.band != null) { band(ws, s.row, s.band, ncol, s.level || 0); continue; }
    if (s.note) { const c = ws.getRow(s.row).getCell(1); c.value = s.note; c.font = { italic: true, size: 8.5, color: { argb: MUTED } }; continue; }
    const xr = ws.getRow(s.row);
    const indent = s.indent || 0;
    xr.getCell(1).value = `${'    '.repeat(indent)}${s.label}`;
    xr.getCell(1).font = { bold: !!s.bold, size: 10, italic: !!s.italic, color: { argb: s.check ? 'FFB4232A' : s.italic ? 'FF4B5563' : 'FF1A2233' } };
    xr.getCell(2).value = s.unit || ''; xr.getCell(2).font = { size: 8.5, color: { argb: MUTED } };
    if (s.outline) xr.outlineLevel = 1;
    labels.forEach((_, i) => {
      const c = xr.getCell(C0 + 1 + i);
      const isF = i >= nH;
      let v = null, color = BLACK;
      if (!isF) {
        if (Array.isArray(s.hv)) { v = isNum(s.hv[i]) ? s.hv[i] : null; color = BLUE; }
        else if (typeof s.hv === 'function') { const f = s.hv(i); if (f) { const ff = sub(f, i); v = { formula: ff }; if (links.test(ff)) color = GREEN; } }
      } else if (s.fv) {
        const ff = sub(s.fv(i), i);
        v = { formula: ff }; if (links.test(ff)) color = GREEN;
        c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: EST } };
      }
      c.value = v;
      c.font = { bold: !!s.bold, size: 10, italic: !!s.italic, color: { argb: s.check ? 'FFB4232A' : color } };
      c.numFmt = FMT[s.fmt || 'num'];
    });
    xr.eachCell({ includeEmpty: true }, c => (c.border = s.total ? { top: { style: 'thin', color: { argb: 'FF9AA3B2' } }, bottom: { style: 'hair', color: { argb: GRIDC } } } : { bottom: { style: 'hair', color: { argb: GRIDC } } }));
  }
  return { R, end: r };
}

function buildOperatingModel(wb, M) {
  const A = M.annual, F = M.forecast.F, as = M.forecast.assumptions, d = as.dcf, raw = M.raw;
  const ak = M.research?.company?.annualKpis || [];
  const hist = A.labels, years = F.years, nH = hist.length, nF = years.length;
  const labels = [...hist, ...years];
  const C0 = 2; // first period column = C
  const col = i => colL(C0 + i);
  const b = nH - 1; // base year (FY26)
  const S_ = (sec, par, item) => { const s = raw?.schedules?.[sec]?.[par]?.[item]; return A.periods.map(p => (s && isNum(s[p]) ? s[p] : null)); };
  const add = (...arrs) => arrs[0].map((_, i) => (arrs.some(a => isNum(a[i])) ? arrs.reduce((t, a) => t + (isNum(a[i]) ? a[i] : 0), 0) : null));

  // ---------------- historical detail (reported) ----------------
  const H = {
    units: hist.map(l => ak.find(x => x.fy === l)?.units ?? null),
    rmPct: A.materialPct, empPct: A.employeePct, mfgPct: A.manufacturingPct,
    oiNormal: S_('profit-loss', 'Other Income', 'Other income normal'), oiExc: S_('profit-loss', 'Other Income', 'Exceptional items'),
    ltb: S_('balance-sheet', 'Borrowings', 'Long term Borrowings'), stb: S_('balance-sheet', 'Borrowings', 'Short term Borrowings'),
    lease: S_('balance-sheet', 'Borrowings', 'Lease Liabilities'), pref: S_('balance-sheet', 'Borrowings', 'Preference Capital'), othb: S_('balance-sheet', 'Borrowings', 'Other Borrowings'),
    payables: S_('balance-sheet', 'Other Liabilities', 'Trade Payables'), advances: S_('balance-sheet', 'Other Liabilities', 'Advance from Customers'),
    othLiab: add(S_('balance-sheet', 'Other Liabilities', 'Other liability items'), S_('balance-sheet', 'Other Liabilities', 'Non controlling int')),
    gb: S_('balance-sheet', 'Fixed Assets', 'Gross Block'), ad: S_('balance-sheet', 'Fixed Assets', 'Accumulated Depreciation'),
    inventories: S_('balance-sheet', 'Other Assets', 'Inventories'), receivables: S_('balance-sheet', 'Other Assets', 'Trade receivables'),
    oca: add(S_('balance-sheet', 'Other Assets', 'Loans n Advances'), S_('balance-sheet', 'Other Assets', 'Other asset items')),
    pfo: S_('cash-flow', 'Cash from Operating Activity', 'Profit from operations'),
    wcRec: S_('cash-flow', 'Cash from Operating Activity', 'Receivables'), wcInv: S_('cash-flow', 'Cash from Operating Activity', 'Inventory'),
    wcPay: S_('cash-flow', 'Cash from Operating Activity', 'Payables'),
    wcOth: add(S_('cash-flow', 'Cash from Operating Activity', 'Loans Advances'), S_('cash-flow', 'Cash from Operating Activity', 'Other WC items')),
    taxPaid: S_('cash-flow', 'Cash from Operating Activity', 'Direct taxes'),
    capex: S_('cash-flow', 'Cash from Investing Activity', 'Fixed assets purchased'), faSold: S_('cash-flow', 'Cash from Investing Activity', 'Fixed assets sold'),
    invPurch: S_('cash-flow', 'Cash from Investing Activity', 'Investments purchased'), invSold: S_('cash-flow', 'Cash from Investing Activity', 'Investments sold'),
    intDiv: add(S_('cash-flow', 'Cash from Investing Activity', 'Interest received'), S_('cash-flow', 'Cash from Investing Activity', 'Dividends received')),
    acq: S_('cash-flow', 'Cash from Investing Activity', 'Acquisition of companies'),
    othInv: add(S_('cash-flow', 'Cash from Investing Activity', 'Other investing items'), S_('cash-flow', 'Cash from Investing Activity', 'Redemp n Canc of Shares')),
    borrowIn: S_('cash-flow', 'Cash from Financing Activity', 'Proceeds from borrowings'), borrowOut: S_('cash-flow', 'Cash from Financing Activity', 'Repayment of borrowings'),
    intPaid: S_('cash-flow', 'Cash from Financing Activity', 'Interest paid fin'), divPaid: S_('cash-flow', 'Cash from Financing Activity', 'Dividends paid'),
    othFin: add(S_('cash-flow', 'Cash from Financing Activity', 'Financial liabilities'), S_('cash-flow', 'Cash from Financing Activity', 'Other financing items')),
    opBorrow: S_('cash-flow', 'Cash from Operating Activity', 'Operating borrowings'),
    shareIssue: add(S_('cash-flow', 'Cash from Financing Activity', 'Proceeds from shares'), S_('cash-flow', 'Cash from Financing Activity', 'Proceeds from debentures')),
  };
  // Treasury deposits reported inside other assets (base year only): moved out of working capital
  const OT = as.otherTreasury || null;
  H.odep = hist.map((_, i) => (OT && i === b ? OT.base : null));
  if (OT && isNum(H.oca[b])) H.oca[b] -= OT.base;
  // Operating debt (gold metal loans) moved from borrowings to working-capital liabilities (base year)
  const OD = as.operatingDebt || null;
  H.gml = hist.map((_, i) => (OD && i === b ? OD.base : null));
  if (OD && isNum(H.stb[b])) H.stb[b] -= OD.base;
  // Base-case raw-material % chosen so that EBITDA margin equals the report's forecast margin,
  // with employee / manufacturing / other expense ratios held at FY26 levels.
  const othB = A.expenses[b] - A.sales[b] * ((H.rmPct[b] || 0) + (H.empPct[b] || 0) + (H.mfgPct[b] || 0)) / 100;
  const fixedPct = (H.empPct[b] || 0) + (H.mfgPct[b] || 0) + othB / A.sales[b] * 100;
  const SEG = as.segments || null; // segment-driven business (platforms)
  const SOTP = as.valuation?.method === 'sotp';
  const BLEND = as.valuation?.blend || null; // multi-method target price (Valuation sheet)
  const rmBase = SEG ? null : as.ebitdaMargin.map(mg => 100 - mg - fixedPct);
  const segHist = SEG ? (M.research?.segments?.annual || []) : [];
  const segH = (field) => hist.map(l => { const o = segHist.find(x => x.fy === l); return o && isNum(o[field]) ? o[field] : null; });

  // =============================== ASSUMPTIONS ===============================
  const wa = wb.addWorksheet('Assumptions', { views: [{ showGridLines: false, state: 'frozen', xSplit: 1, ySplit: 9 }], properties: { tabColor: { argb: 'FFC6A44E' } } });
  title(wa, `${M.meta.name}: Model assumptions`, 'Change the blue cells on yellow: the Model, DCF and cover recalculate. Green = default taken from FY26 actuals (overwrite to change). Black = formula.');
  wa.getColumn(1).width = 52; wa.getColumn(2).width = 11;
  [3, 4, 5].forEach(c => (wa.getColumn(c).width = 12)); wa.getColumn(6).width = 3; wa.getColumn(7).width = 10; wa.getColumn(8).width = 10; wa.getColumn(9).width = 95;
  const input = (cell, v, fmt) => { const c = wa.getCell(cell); c.value = v; c.font = { color: { argb: BLUE }, bold: true }; c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: INPUT } }; if (fmt) c.numFmt = FMT[fmt]; return c; };
  const name = (ref, nm) => wb.definedNames.add(`Assumptions!${ref}`, nm);
  wa.getCell('A4').value = 'Scenario (1 = Base, 2 = Bull, 3 = Bear)'; input('B4', 1); name('$B$4', 'Scenario');
  wa.getCell('C4').value = { formula: 'CHOOSE(Scenario,"Base case","Bull case","Bear case")' }; wa.getCell('C4').font = { bold: true, color: { argb: NAVY } };
  wa.getCell('A5').value = `Current market price, CMP (₹, ${M.price.lastDate})`; input('B5', M.price.last, 'num'); name('$B$5', 'CMP');
  wa.getCell('A6').value = 'Shares outstanding (crore)'; input('B6', +F.shares.toFixed(4), 'd2'); name('$B$6', 'Shares');
  wa.getCell('A7').value = '₹ crore unless stated. Percent inputs are entered as numbers (15 = 15%).'; wa.getCell('A7').font = { italic: true, size: 9, color: { argb: MUTED } };
  header(wa, 9, ['Driver', 'Unit', ...years, '', 'Bull Δ', 'Bear Δ', 'Why (GAM Research view)'], null);
  const AR = {};
  let r = 10;
  const sc = as.scenarios || {};
  const segDrivers = SEG ? SEG.flatMap(s => [
    [`g_${s.key}`, `${s.name}: ${s.driverLabel} growth`, '%', s.growth, sc.bull?.segments?.[s.key]?.growthDelta ?? 0, sc.bear?.segments?.[s.key]?.growthDelta ?? 0, s._why || ''],
    [`r_${s.key}`, `${s.name}: revenue as % of ${s.driverLabel}`, '%', s.revPct, 0, 0, s._revWhy || ''],
    [`m_${s.key}`, `${s.name}: ${s.marginLabel || 'adj. EBITDA'} as % of ${s.driverLabel}`, '%', s.marginPct, sc.bull?.segments?.[s.key]?.marginDelta ?? 0, sc.bear?.segments?.[s.key]?.marginDelta ?? 0, s._marginWhy || ''],
  ]).concat([
    ['unalloc', as._unallocLabel || 'Unallocated corporate costs', '₹ cr', as.unallocated, 0, 0, as._unallocWhy || ''],
    ['esop', 'ESOP (share-based) cost', '₹ cr', as.esop, 0, 0, as._esopWhy || ''],
  ]) : null;
  const drivers = SEG ? [...segDrivers,
    ['capex', 'Capex', '₹ cr', as.capex, 0, 0, as._capexWhy],
    ['yield', 'Yield on cash & investments', '%', as.treasuryYield, 0, 0, as._treasuryWhy],
    ...(as.otherIncome ? [['othInc', 'Other income (non-treasury: deposits, misc.)', '₹ cr', as.otherIncome, 0, 0, as._otherIncomeWhy || '']] : []),
    ['interest', as._interestLabel || 'Interest cost (mainly on leases)', '₹ cr', as.interest, 0, 0, as._interestWhy || ''],
    ['taxRate', 'Tax rate', '%', as.taxRate, 0, 0, as._taxWhy || ''],
    ['payout', 'Dividend payout', '%', as.payout, 0, 0, ''],
  ] : [
    ...(as.volume ? [
      ['volGrowth', 'Volume growth', '%', as.volume.growth, sc.bull?.volumeGrowthDelta ?? 0, sc.bear?.volumeGrowthDelta ?? 0, as.volume._why],
      ['rpuGrowth', 'Revenue per vehicle growth', '%', as.revPerUnitGrowth, sc.bull?.revPerUnitDelta ?? 0, sc.bear?.revPerUnitDelta ?? 0, as._revPerUnitWhy],
    ] : [
      ['revGrowth', 'Revenue growth', '%', as.revenueGrowth, sc.bull?.revenueGrowthDelta ?? 0, sc.bear?.revenueGrowthDelta ?? 0, as._revenueWhy || ''],
    ]),
    ['rmPct', 'Raw material cost, % of revenue', '%', rmBase, -(sc.bull?.marginDelta ?? 0), -(sc.bear?.marginDelta ?? 0), `The main cost and the swing factor for margins (FY26 ${H.rmPct[b]}%). Set so that EBITDA margin is ${as.ebitdaMargin.map(x => x + '%').join(' / ')}: ${as._marginWhy}`],
    ['capex', 'Capex', '₹ cr', as.capex, 0, 0, as._capexWhy],
    ['yield', 'Yield on cash & investments', '%', as.treasuryYield, 0, 0, as._treasuryWhy],
    ...(as.otherIncome ? [['othInc', 'Other income (non-treasury: one-offs, misc.)', '₹ cr', as.otherIncome, 0, 0, as._otherIncomeWhy || '']] : []),
    ['interest', 'Interest cost', '₹ cr', as.interest, 0, 0, as._interestWhy || 'Negligible borrowings; held at FY26 level.'],
    ['taxRate', 'Tax rate', '%', as.taxRate, 0, 0, as._taxWhy || 'Normalised corporate tax rate.'],
    ['payout', 'Dividend payout', '%', as.payout, 0, 0, as._payoutWhy || 'In line with the company\'s payout history.'],
  ];
  const fmtOf = u => (u === '%' ? 'd1' : u === 'days' ? 'd1' : 'num');
  band(wa, r++, 'Growth, cost and capital drivers (base case + scenario adjustments)', 9, 1);
  for (const [key, label, unit, vals, bull, bear, why] of drivers) {
    wa.getCell(`A${r}`).value = label; wa.getCell(`B${r}`).value = unit;
    years.forEach((_, i) => input(`${colL(2 + i)}${r}`, vals[i], fmtOf(unit)));
    input(`G${r}`, bull, 'd1'); input(`H${r}`, bear, 'd1');
    wa.getCell(`I${r}`).value = why || ''; wa.getCell(`I${r}`).alignment = { wrapText: true, vertical: 'middle' }; wa.getCell(`I${r}`).font = { size: 9 };
    wa.getRow(r).height = why && why.length > 120 ? 42 : why && why.length > 70 ? 28 : 15;
    wa.getRow(r).eachCell({ includeEmpty: true }, c => (c.alignment = { ...(c.alignment || {}), vertical: 'middle' }));
    AR[key] = { base: r, scen: true }; r++;
  }
  const CL = { rm: 'Raw material cost', emp: 'Employee cost', mfg: 'Manufacturing cost', oth: 'Other expenses (royalty, freight, advertising, power, etc.)', ...(as.costLabels || {}) };
  const derived = [
    ...(SEG ? [
      ['rmShare', `${CL.rm}, % of total costs`, '%', 'FY26 cost mix (forecast costs = revenue − EBITDA, split in FY26 proportions).'],
      ['empShare', `${CL.emp}, % of total costs`, '%', 'FY26 cost mix.'],
      ['mfgShare', `${CL.mfg}, % of total costs`, '%', 'FY26 cost mix.'],
    ] : [
      ['empPct', 'Employee cost, % of revenue', '%', 'FY26 level.'],
      ['mfgPct', 'Manufacturing cost, % of revenue', '%', 'FY26 level.'],
      ['othPct', 'Other expenses (royalty, freight, advertising, etc.), % of revenue', '%', 'FY26 level.'],
    ]),
    ['depRate', 'Depreciation rate on average gross block', '%', 'FY26 actual.'],
    ['invDays', 'Inventory days (of revenue)', 'days', 'FY26 actual.'],
    ['recDays', 'Receivable days', 'days', 'FY26 actual.'],
    ['ocaPct', 'Other current assets (loans, advances, other), % of revenue', '%', 'FY26 actual.'],
    ['payDays', 'Payable days (of revenue)', 'days', 'FY26 actual: suppliers fund the business.'],
    ['advPct', 'Advances from customers, % of revenue', '%', 'FY26 actual.'],
    ['olPct', 'Other liabilities & provisions, % of revenue', '%', 'FY26 actual.'],
    ...(OD ? [['gmlPct', `${OD.label}, % of revenue`, '%', OD._why || 'FY26 actual.']] : []),
  ];
  r++;
  band(wa, r++, 'Cost ratios and working capital (default = FY26 actual; overwrite to change)', 9, 1);
  for (const [key, label, unit, why] of derived) {
    wa.getCell(`A${r}`).value = label; wa.getCell(`B${r}`).value = unit; wa.getCell(`I${r}`).value = why; wa.getCell(`I${r}`).font = { size: 9 };
    AR[key] = { base: r }; r++;
  }
  r++;
  band(wa, r++, 'Live drivers used by the Model (= base + scenario adjustment)', 9, 1);
  for (const [key, label, unit] of [...drivers, ...derived]) {
    wa.getCell(`A${r}`).value = label; wa.getCell(`B${r}`).value = unit;
    years.forEach((_, i) => {
      const c = colL(2 + i);
      const cell = wa.getCell(`${c}${r}`);
      cell.value = { formula: `${c}${AR[key].base}${AR[key].scen ? `+CHOOSE(Scenario,0,$G$${AR[key].base},$H$${AR[key].base})` : ''}` };
      cell.numFmt = FMT[fmtOf(unit)]; cell.font = { bold: true };
    });
    AR[key].live = r; r++;
  }
  if (!SOTP || d) {
  r++;
  band(wa, r++, SOTP ? 'DCF cross-check inputs (the target price is on the SOTP sheet)' : 'Valuation (DCF) inputs', 9, 1);
  const scal = (label, v, fmt, why, nm) => { wa.getCell(`A${r}`).value = label; input(`B${r}`, v, fmt); wa.getCell(`I${r}`).value = why || ''; wa.getCell(`I${r}`).font = { size: 9 }; if (nm) name(`$B$${r}`, nm); r++; };
  scal('Risk-free rate (10-year G-sec), %', d.rf, 'd1', 'Indian 10-year government bond yield.', 'RiskFree');
  scal('Beta', d.beta, 'd2', d._betaWhy || 'Below-market sensitivity: net cash, defensive volumes.', 'Beta');
  scal('Equity risk premium, %', d.erp, 'd1', 'Standard India equity risk premium.', 'ERP');
  wa.getCell(`A${r}`).value = 'Cost of equity = WACC (no debt), %'; wa.getCell(`B${r}`).value = { formula: 'RiskFree+Beta*ERP' }; wa.getCell(`B${r}`).numFmt = FMT.d1; wa.getCell(`B${r}`).font = { bold: true }; name(`$B$${r}`, 'Ke'); r++;
  scal('Terminal growth, %', d.terminalGrowth, 'd1', d._tgWhy || 'India long-run nominal GDP (~10%) less a maturity/competition discount.', 'TermGrowth');
  scal(`Revenue growth faded to by year ${d.years || 15}, %`, d.fadeGrowthTo, 'd1', d._fadeGrowthWhy || '≈5% volume + 3.5% price.', 'FadeGrowth');
  wa.getCell(`A${r}`).value = `EBITDA margin faded to by year ${d.years || 15}, % (live value in C)`; input(`B${r}`, d.fadeMarginTo, 'd1'); input(`G${r}`, sc.bull?.fadeMarginTo ?? d.fadeMarginTo, 'd1'); input(`H${r}`, sc.bear?.fadeMarginTo ?? d.fadeMarginTo, 'd1');
  wa.getCell(`C${r}`).value = { formula: `CHOOSE(Scenario,B${r},G${r},H${r})` }; wa.getCell(`C${r}`).numFmt = FMT.d1; wa.getCell(`C${r}`).font = { bold: true }; name(`$C$${r}`, 'FadeMargin');
  wa.getCell(`I${r}`).value = 'Base / Bull / Bear in B / G / H; C picks the live one.'; wa.getCell(`I${r}`).font = { size: 9 }; r++;
  scal(`Capex % of revenue faded to by year ${d.years || 15}, %`, d.fadeCapexPctTo, 'd1', d._fadeCapexWhy || 'Maintenance-level capex once the 4mn-unit build-out is complete.', 'FadeCapex');
  scal('Depreciation % of revenue (DCF years), %', d.depPctOfSales, 'd1', 'Long-run depreciation intensity.', 'DepPctSales');
  scal('Months to roll the value forward to the 12-month target', d.rollForwardMonths ?? 6, 'num', 'Valuation date end-FY27 (Mar-27); target date ~Oct-27.', 'RollMonths');
  }

  // =============================== MODEL ===============================
  const wm = wb.addWorksheet('Model', { views: [{ showGridLines: false, state: 'frozen', xSplit: 2, ySplit: 4, zoomScale: 90 }], properties: { tabColor: { argb: 'FF2B5CA6' }, outlineProperties: { summaryBelow: true } } });
  title(wm, `${M.meta.name}: Integrated financial model (₹ crore)`, `${M.meta.basis === 'standalone' ? 'Standalone' : 'Consolidated'} · history ${hist[0]}–${hist[b]} as reported (blue) · ${years[0]}–${years[nF - 1]} formulas driven by the Assumptions sheet · use the 1/2 buttons on the left to collapse/expand line-item detail.`);
  wm.getColumn(1).width = 50; wm.getColumn(2).width = 8;
  labels.forEach((_, i) => (wm.getColumn(C0 + 1 + i).width = 11));
  header(wm, 4, ['₹ crore', 'Unit', ...labels], C0 + 1 + nH);
  wm.getCell('C3').value = 'Reported →'; wm.getCell('C3').font = { size: 9, italic: true, color: { argb: MUTED } };
  wm.getCell(`${col(nH)}3`).value = 'GAM estimates →'; wm.getCell(`${col(nH)}3`).font = { size: 9, italic: true, bold: true, color: { argb: 'FF9A6A10' } };
  const aL = (key, i) => `Assumptions!${colL(2 + (i - nH))}$${AR[key].live}`;
  const S = [];
  const bandRow = (t, level = 0) => S.push({ band: t, level });
  const L = (key, label, unit, hv, fv, opt = {}) => S.push({ key, label, unit, hv, fv, ...opt });
  const note = t => S.push({ note: t });
  const pct100 = (k, i) => `{${k}}/100`;

  bandRow('1   OPERATING DRIVERS');
  if (SEG) {
    // Segment build-up: driver (e.g. GOV) → revenue (% of driver) → adjusted EBITDA (% of driver)
    for (const sg of SEG) {
      const k = sg.key;
      bandRow(sg.name, 1);
      L(`d_${k}`, sg.driverLabel, '₹ cr', segH(sg.hist?.driver), i => `{d_${k}@p}*(1+${aL(`g_${k}`, i)}/100)`, { indent: 1 });
      L(`dg_${k}`, `${sg.driverLabel} growth`, '%', i => (i ? `IFERROR({d_${k}}/{d_${k}@p}-1,"")` : null), i => `{d_${k}}/{d_${k}@p}-1`, { fmt: 'pct', italic: true, indent: 2 });
      L(`rv_${k}`, 'Revenue', '₹ cr', segH(sg.hist?.revenue), i => `{d_${k}}*${aL(`r_${k}`, i)}/100`, { indent: 1 });
      L(`tr_${k}`, `Revenue as % of ${sg.driverLabel}`, '%', i => `IFERROR({rv_${k}}/{d_${k}},"")`, i => `{rv_${k}}/{d_${k}}`, { fmt: 'pct', italic: true, indent: 2 });
      L(`ae_${k}`, sg.marginLabel ? sg.marginLabel[0].toUpperCase() + sg.marginLabel.slice(1) : 'Adjusted EBITDA', '₹ cr', segH(sg.hist?.adjEbitda), i => `{d_${k}}*${aL(`m_${k}`, i)}/100`, { indent: 1, bold: true });
      L(`am_${k}`, `${sg.marginLabel || 'Adjusted EBITDA'} as % of ${sg.driverLabel}`, '%', i => `IFERROR({ae_${k}}/{d_${k}},"")`, i => `{ae_${k}}/{d_${k}}`, { fmt: 'pct', italic: true, indent: 2 });
    }
    bandRow('Consolidation', 1);
    const sumOf = p => SEG.map(sg => `{${p}_${sg.key}}`).join('+');
    L('segRev', 'Sum of segment revenue', '₹ cr', i => `IF(COUNT(${SEG.map(sg => `{rv_${sg.key}}`).join(',')})=${SEG.length},${sumOf('rv')},"")`, i => sumOf('rv'), { total: true });
    L('segRecon', 'Inter-segment eliminations & other (reported − sum of segments)', '₹ cr', i => `IFERROR({sales}-{segRev},"")`, i => '0', { italic: true, indent: 1 });
    L('segAe', 'Sum of segment adjusted EBITDA', '₹ cr', i => `IF(COUNT(${SEG.map(sg => `{ae_${sg.key}}`).join(',')})=${SEG.length},${sumOf('ae')},"")`, i => sumOf('ae'), { total: true });
    L('unalloc', 'Unallocated costs, ESOP & other (reported EBITDA − segments)', '₹ cr', i => `IFERROR({ebitda}-{segAe},"")`, i => `-${aL('unalloc', i)}-${aL('esop', i)}`, { italic: true, indent: 1 });
  } else if (!as.volume) {
    L('salesG0', 'Revenue growth (driver)', '%', i => (i ? `IFERROR({sales}/{sales@p}-1,"")` : null), i => `${aL('revGrowth', i)}/100`, { fmt: 'pct', indent: 1 });
  } else {
    L('units', 'Vehicles sold', 'units', H.units, i => `{units@p}*(1+${aL('volGrowth', i)}/100)`);
    L('unitsG', 'Volume growth', '%', i => (i ? `IFERROR({units}/{units@p}-1,"")` : null), i => `{units}/{units@p}-1`, { fmt: 'pct', italic: true, indent: 1 });
    L('rpu', 'Revenue per vehicle', '₹', i => `IFERROR({sales}*10^7/{units},"")`, i => `{rpu@p}*(1+${aL('rpuGrowth', i)}/100)`);
    L('rpuG', 'Revenue per vehicle growth', '%', i => (i ? `IFERROR({rpu}/{rpu@p}-1,"")` : null), i => `{rpu}/{rpu@p}-1`, { fmt: 'pct', italic: true, indent: 1 });
  }

  bandRow('2   PROFIT & LOSS');
  L('sales', 'Revenue from operations', '₹ cr', A.sales, i => (SEG ? `{segRev}+{segRecon}` : as.volume ? `{units}*{rpu}/10^7` : `{sales@p}*(1+{salesG0})`), { bold: true });
  L('salesG', 'Revenue growth', '%', i => (i ? `{sales}/{sales@p}-1` : null), i => `{sales}/{sales@p}-1`, { fmt: 'pct', italic: true, indent: 1 });
  bandRow('Operating expenses', 1);
  if (SEG) {
    // Costs follow from EBITDA (built from segments); split in the FY26 cost mix.
    L('rmPct', `${CL.rm}, % of revenue`, '%', H.rmPct, i => `{rm}/{sales}*100`, { fmt: 'd1', italic: true, indent: 1, outline: true });
    L('rm', CL.rm, '₹ cr', i => `{sales}*{rmPct}/100`, i => `{opex}*${aL('rmShare', i)}/100`, { indent: 1, outline: true });
    L('empPct', `${CL.emp}, % of revenue`, '%', H.empPct, i => `{emp}/{sales}*100`, { fmt: 'd1', italic: true, indent: 1, outline: true });
    L('emp', CL.emp, '₹ cr', i => `{sales}*{empPct}/100`, i => `{opex}*${aL('empShare', i)}/100`, { indent: 1, outline: true });
    L('mfgPct', `${CL.mfg}, % of revenue`, '%', H.mfgPct, i => `{mfg}/{sales}*100`, { fmt: 'd1', italic: true, indent: 1, outline: true });
    L('mfg', CL.mfg, '₹ cr', i => `{sales}*{mfgPct}/100`, i => `{opex}*${aL('mfgShare', i)}/100`, { indent: 1, outline: true });
    L('othPct', `${CL.oth.replace(/ (.*)/, '')}, % of revenue`, '%', i => `{oth}/{sales}*100`, i => `{oth}/{sales}*100`, { fmt: 'd1', italic: true, indent: 1, outline: true });
    L('oth', CL.oth, '₹ cr', i => `{opex}-{rm}-{emp}-{mfg}`, i => `{opex}-{rm}-{emp}-{mfg}`, { indent: 1, outline: true });
    L('opex', 'Total operating expenses', '₹ cr', A.expenses, i => `{sales}-{ebitda}`, { total: true });
    L('ebitda', 'EBITDA (reported)', '₹ cr', i => `{sales}-{opex}`, i => `{segAe}+{unalloc}`, { bold: true });
  } else {
    L('rmPct', 'Raw material cost, % of revenue', '%', H.rmPct, i => `${aL('rmPct', i)}`, { fmt: 'd1', italic: true, indent: 1, outline: true });
    L('rm', 'Raw material cost', '₹ cr', i => `{sales}*{rmPct}/100`, i => `{sales}*{rmPct}/100`, { indent: 1, outline: true });
    L('empPct', 'Employee cost, % of revenue', '%', H.empPct, i => `${aL('empPct', i)}`, { fmt: 'd1', italic: true, indent: 1, outline: true });
    L('emp', 'Employee cost', '₹ cr', i => `{sales}*{empPct}/100`, i => `{sales}*{empPct}/100`, { indent: 1, outline: true });
    L('mfgPct', 'Manufacturing cost, % of revenue', '%', H.mfgPct, i => `${aL('mfgPct', i)}`, { fmt: 'd1', italic: true, indent: 1, outline: true });
    L('mfg', 'Manufacturing cost', '₹ cr', i => `{sales}*{mfgPct}/100`, i => `{sales}*{mfgPct}/100`, { indent: 1, outline: true });
    L('othPct', 'Other expenses, % of revenue', '%', i => `{oth}/{sales}*100`, i => `${aL('othPct', i)}`, { fmt: 'd1', italic: true, indent: 1, outline: true });
    L('oth', 'Other expenses (royalty, freight, advertising, power, etc.)', '₹ cr', i => `{opex}-{rm}-{emp}-{mfg}`, i => `{sales}*{othPct}/100`, { indent: 1, outline: true });
    L('opex', 'Total operating expenses', '₹ cr', A.expenses, i => `{rm}+{emp}+{mfg}+{oth}`, { total: true });
    L('ebitda', 'EBITDA', '₹ cr', i => `{sales}-{opex}`, i => `{sales}-{opex}`, { bold: true });
  }
  L('ebitdaM', 'EBITDA margin', '%', i => `{ebitda}/{sales}`, i => `{ebitda}/{sales}`, { fmt: 'pct', italic: true, indent: 1 });
  L('dep', 'Depreciation', '₹ cr', A.dep, i => `${aL('depRate', i)}/100*AVERAGE({gb@p},{gb})`);
  L('ebit', 'EBIT (operating profit)', '₹ cr', i => `{ebitda}-{dep}`, i => `{ebitda}-{dep}`, { bold: true, total: true });
  L('oiN', 'Treasury & other income', '₹ cr', H.oiNormal, i => `${aL('yield', i)}/100*MAX({treasury@p},0)${as.otherIncome ? `+${aL('othInc', i)}` : ''}`, { indent: 1, outline: true });
  L('oiX', 'Exceptional items', '₹ cr', H.oiExc, i => `0`, { indent: 1, outline: true });
  L('oi', 'Other income', '₹ cr', i => `{oiN}+{oiX}`, i => `{oiN}+{oiX}`, { total: true });
  L('interest', 'Interest', '₹ cr', A.interest, i => `${aL('interest', i)}`);
  L('pbt', 'Profit before tax', '₹ cr', i => `{ebit}+{oi}-{interest}`, i => `{ebit}+{oi}-{interest}`, { bold: true, total: true });
  L('tax', 'Tax (incl. minorities/associates in history)', '₹ cr', i => `{pbt}-{pat}`, i => `{pbt}*${aL('taxRate', i)}/100`);
  L('taxR', 'Effective tax rate', '%', i => `IFERROR({tax}/{pbt},"")`, i => `{tax}/{pbt}`, { fmt: 'pct', italic: true, indent: 1 });
  L('pat', 'Net profit', '₹ cr', A.pat, i => `{pbt}-{tax}`, { bold: true, total: true });
  L('patG', 'Net profit growth', '%', i => (i ? `IFERROR({pat}/{pat@p}-1,"")` : null), i => `{pat}/{pat@p}-1`, { fmt: 'pct', italic: true, indent: 1 });
  L('shares', 'Shares outstanding', 'crore', i => `IFERROR({pat}/{eps},"")`, i => `Shares`, { fmt: 'd2' });
  L('eps', 'Earnings per share (EPS)', '₹', A.eps, i => `{pat}/{shares}`, { fmt: 'd1', bold: true });
  L('dps', 'Dividend per share (DPS)', '₹', A.dps, i => `{eps}*${aL('payout', i)}/100`, { fmt: 'd1' });
  note('Cost split for history uses Screener\'s whole-number cost percentages; "other expenses" is the balancing item so total operating expenses equal the reported figure.');

  bandRow('3   BALANCE SHEET');
  bandRow("Shareholders' funds", 1);
  L('eqcap', 'Equity share capital', '₹ cr', A.equity, i => `{eqcap@p}`, { indent: 1 });
  L('reserves', 'Reserves & surplus', '₹ cr', A.reserves, i => `{nw}-{eqcap}`, { indent: 1 });
  L('nw', 'Net worth', '₹ cr', i => `{eqcap}+{reserves}`, i => `{nw@p}+{pat}-{dpsTot}${SEG ? `+${aL('esop', i)}` : ''}`, { bold: true, total: true });
  bandRow('Borrowings', 1);
  L('ltb', 'Long-term borrowings', '₹ cr', H.ltb, i => `{ltb@p}`, { indent: 1, outline: true });
  L('stb', 'Short-term borrowings', '₹ cr', H.stb, i => `{stb@p}`, { indent: 1, outline: true });
  L('lease', 'Lease liabilities', '₹ cr', H.lease, i => `{lease@p}`, { indent: 1, outline: true });
  L('othb', 'Other borrowings', '₹ cr', H.othb, i => `{othb@p}`, { indent: 1, outline: true });
  const PREF = H.pref.some(v => isNum(v) && v);
  if (PREF) L('pref', 'Preference capital (converted to equity at IPO)', '₹ cr', H.pref, i => `{pref@p}`, { indent: 1, outline: true });
  const debtF = `{ltb}+{stb}+{lease}+{othb}${PREF ? '+{pref}' : ''}`;
  L('debt', 'Total borrowings', '₹ cr', i => debtF, i => debtF, { total: true });
  bandRow('Other liabilities', 1);
  L('payables', 'Trade payables', '₹ cr', H.payables, i => `{sales}*${aL('payDays', i)}/365`, { indent: 1, outline: true });
  L('advances', 'Advances from customers', '₹ cr', H.advances, i => `{sales}*${aL('advPct', i)}/100`, { indent: 1, outline: true });
  L('othLiab', 'Other liabilities & provisions', '₹ cr', H.othLiab, i => `{sales}*${aL('olPct', i)}/100`, { indent: 1, outline: true });
  if (OD) L('gml', OD.label, '₹ cr', H.gml, i => `{sales}*${aL('gmlPct', i)}/100`, { indent: 1, outline: true });
  const olF = `{payables}+{advances}+{othLiab}${OD ? '+{gml}' : ''}`;
  L('ol', OD ? 'Total other liabilities (incl. gold metal loans)' : 'Total other liabilities', '₹ cr', i => olF, i => olF, { total: true });
  L('tl', 'TOTAL EQUITY & LIABILITIES', '₹ cr', i => `{nw}+{debt}+{ol}`, i => `{nw}+{debt}+{ol}`, { bold: true, total: true });
  bandRow('Fixed assets', 1);
  L('gb', 'Gross block', '₹ cr', H.gb, i => `{gb@p}-{capexCf}`, { indent: 1, outline: true });
  L('ad', 'Less: accumulated depreciation', '₹ cr', H.ad, i => `{ad@p}+{dep}`, { indent: 1, outline: true });
  L('nb', 'Net block', '₹ cr', i => `{gb}-{ad}`, i => `{gb}-{ad}`, { total: true });
  L('cwip', 'Capital work in progress', '₹ cr', A.cwip, i => `{cwip@p}`);
  L('inv', 'Investments (treasury)', '₹ cr', A.investments, i => `{inv@p}-{invPurch}-{invSold}`);
  bandRow('Current assets', 1);
  L('inventories', 'Inventories', '₹ cr', H.inventories, i => `{sales}*${aL('invDays', i)}/365`, { indent: 1, outline: true });
  L('receivables', 'Trade receivables', '₹ cr', H.receivables, i => `{sales}*${aL('recDays', i)}/365`, { indent: 1, outline: true });
  L('oca', 'Loans, advances & other current assets', '₹ cr', H.oca, i => `{sales}*${aL('ocaPct', i)}/100`, { indent: 1, outline: true });
  if (OT) L('odep', OT.label, '₹ cr', H.odep, i => `{odep@p}`, { indent: 1, outline: true });
  L('cash', 'Cash & bank', '₹ cr', A.cash, i => `{cash@p}+{netcf}`, { indent: 1, outline: true });
  const caF = `{inventories}+{receivables}+{oca}+{cash}${OT ? '+{odep}' : ''}`;
  L('ca', 'Total current assets', '₹ cr', i => caF, i => caF, { total: true });
  L('ta', 'TOTAL ASSETS', '₹ cr', i => `{nb}+{cwip}+{inv}+{ca}`, i => `{nb}+{cwip}+{inv}+{ca}`, { bold: true, total: true });
  L('check', 'Balance check: assets − liabilities (0; ±1 = rounding in reported totals)', '₹ cr', i => `ROUND({ta}-{tl},0)`, i => `ROUND({ta}-{tl},0)`, { check: true });
  const trF = `{cash}+{inv}${OT ? '+{odep}' : ''}-{debt}`;
  L('treasury', `Net cash: cash + investments${OT ? ' + deposits' : ''} − borrowings`, '₹ cr', i => trF, i => trF, { italic: true });
  L('owc', 'Operating working capital (current assets ex-cash − other liabilities)', '₹ cr', i => `{inventories}+{receivables}+{oca}-{ol}`, i => `{inventories}+{receivables}+{oca}-{ol}`, { italic: true });

  bandRow('4   CASH FLOW');
  bandRow('Operating activities', 1);
  L('pfo', SEG ? 'Operating profit before working-capital changes (forecast: EBITDA + non-cash ESOP)' : 'Operating profit before working-capital changes', '₹ cr', H.pfo, i => (SEG ? `{ebitda}+${aL('esop', i)}` : `{ebitda}`), { indent: 1 });
  L('wcInv', '(Increase) / decrease in inventories', '₹ cr', H.wcInv, i => `-({inventories}-{inventories@p})`, { indent: 2, outline: true });
  L('wcRec', '(Increase) / decrease in receivables', '₹ cr', H.wcRec, i => `-({receivables}-{receivables@p})`, { indent: 2, outline: true });
  L('wcPay', 'Increase / (decrease) in payables', '₹ cr', H.wcPay, i => `{payables}-{payables@p}`, { indent: 2, outline: true });
  L('wcOth', 'Other working-capital items', '₹ cr', H.wcOth, i => `({advances}-{advances@p})+({othLiab}-{othLiab@p})-({oca}-{oca@p})`, { indent: 2, outline: true });
  L('wcOpb', 'Operating borrowings (gold metal loans) raised / (repaid)', '₹ cr', H.opBorrow, i => (OD ? '{gml}-{gml@p}' : '0'), { indent: 2, outline: true });
  L('wc', 'Working-capital changes', '₹ cr', i => `{wcInv}+{wcRec}+{wcPay}+{wcOth}+{wcOpb}`, i => `{wcInv}+{wcRec}+{wcPay}+{wcOth}+{wcOpb}`, { indent: 1, total: true });
  L('taxPaid', 'Direct taxes paid (forecast: tax on operating profit)', '₹ cr', H.taxPaid, i => `-({ebit}-{interest})*{taxR}`, { indent: 1 });
  L('cfo', 'Cash from operations (CFO)', '₹ cr', i => `{pfo}+{wc}+{taxPaid}`, i => `{pfo}+{wc}+{taxPaid}`, { bold: true, total: true });
  bandRow('Investing activities', 1);
  L('capexCf', 'Purchase of fixed assets (capex)', '₹ cr', H.capex, i => `-${aL('capex', i)}`, { indent: 1, outline: true });
  L('faSold', 'Sale of fixed assets', '₹ cr', H.faSold, i => `0`, { indent: 1, outline: true });
  L('invPurch', 'Purchase of investments (forecast: surplus cash invested)', '₹ cr', H.invPurch, i => `-({cfo}+{capexCf}+{faSold}+{intDiv}+{acq}+{othInv}+{cff})`, { indent: 1, outline: true });
  L('invSold', 'Sale of investments', '₹ cr', H.invSold, i => `0`, { indent: 1, outline: true });
  L('intDiv', 'Interest & dividends received (forecast: treasury income after tax)', '₹ cr', H.intDiv, i => `{oi}*(1-{taxR})`, { indent: 1, outline: true });
  L('acq', 'Acquisitions', '₹ cr', H.acq, i => `0`, { indent: 1, outline: true });
  L('othInv', 'Other investing items', '₹ cr', H.othInv, i => `0`, { indent: 1, outline: true });
  L('cfi', 'Cash from investing (CFI)', '₹ cr', i => `{capexCf}+{faSold}+{invPurch}+{invSold}+{intDiv}+{acq}+{othInv}`, i => `{capexCf}+{faSold}+{invPurch}+{invSold}+{intDiv}+{acq}+{othInv}`, { bold: true, total: true });
  bandRow('Financing activities', 1);
  L('borrowIn', 'Proceeds from borrowings', '₹ cr', H.borrowIn, i => `MAX({debt}-{debt@p},0)`, { indent: 1, outline: true });
  L('borrowOut', 'Repayment of borrowings', '₹ cr', H.borrowOut, i => `MIN({debt}-{debt@p},0)`, { indent: 1, outline: true });
  L('intPaid', 'Interest paid', '₹ cr', H.intPaid, i => `-{interest}`, { indent: 1, outline: true });
  L('divPaid', 'Dividends paid', '₹ cr', H.divPaid, i => `-{dpsTot}`, { indent: 1, outline: true });
  L('shareIssue', 'Proceeds from issue of shares (IPO / QIP / ESOP)', '₹ cr', H.shareIssue, i => `0`, { indent: 1, outline: true });
  L('othFin', 'Other financing items (lease payments, etc.)', '₹ cr', H.othFin, i => `0`, { indent: 1, outline: true });
  const cffF = '{shareIssue}+{borrowIn}+{borrowOut}+{intPaid}+{divPaid}+{othFin}';
  L('cff', 'Cash from financing (CFF)', '₹ cr', i => cffF, i => cffF, { bold: true, total: true });
  L('netcf', 'Net change in cash (CFO + CFI + CFF)', '₹ cr', i => `{cfo}+{cfi}+{cff}`, i => `{cfo}+{cfi}+{cff}`, { bold: true, total: true });
  L('fcf', 'Free cash flow (CFO − capex − interest)', '₹ cr', i => `{cfo}+{capexCf}+{intPaid}`, i => `{cfo}+{capexCf}+{intPaid}`, { bold: true });
  L('dpsTot', 'Memo: dividends declared (DPS × shares)', '₹ cr', i => `IFERROR({dps}*{shares},0)`, i => `{dps}*{shares}`, { italic: true });
  note('Forecast cash flow invests all surplus cash in treasury investments, so cash & bank is held flat and the balance sheet always balances.');

  bandRow('5   RATIOS & VALUATION');
  const ratio = (key, label, unit, f, fmt, first = 0, opt = {}) => L(key, label, unit, i => (i >= first ? f(i) : null), f, { fmt, ...opt });
  bandRow('Growth & margins', 1);
  ratio('rEbitdaG', 'EBITDA growth', '%', i => `IFERROR({ebitda}/{ebitda@p}-1,"")`, 'pct', 1);
  ratio('rEpsG', 'EPS growth', '%', i => `IFERROR({eps}/{eps@p}-1,"")`, 'pct', 1);
  ratio('rGm', 'Gross margin (revenue − raw material)', '%', i => `1-{rmPct}/100`, 'pct');
  ratio('rEbitM', 'EBIT margin', '%', i => `{ebit}/{sales}`, 'pct');
  ratio('rNpm', 'Net margin', '%', i => `{pat}/{sales}`, 'pct');
  ratio('rOiShare', 'Other income as % of profit before tax', '%', i => `{oi}/{pbt}`, 'pct');
  bandRow('Returns', 1);
  ratio('rRoe', 'Return on equity (ROE)', '%', i => `{pat}/AVERAGE({nw@p},{nw})`, 'pct', 1);
  ratio('rRoce', 'Return on capital employed (ROCE, pre-tax)', '%', i => `({ebit}+{oi})/AVERAGE({nw@p}+{debt@p},{nw}+{debt})`, 'pct', 1);
  ratio('rCore', 'Return on operating capital (EBIT ÷ net block + CWIP + working capital)', '%', i => `IFERROR({ebit}/({nb}+{cwip}+{owc}),"")`, 'pct');
  ratio('rAt', 'Asset turnover', 'x', i => `{sales}/AVERAGE({ta@p},{ta})`, 'd2', 1);
  bandRow('Working capital & cash', 1);
  ratio('rInvD', 'Inventory days', 'days', i => `{inventories}/{sales}*365`, 'days');
  ratio('rRecD', 'Receivable days', 'days', i => `{receivables}/{sales}*365`, 'days');
  ratio('rPayD', 'Payable days', 'days', i => `{payables}/{sales}*365`, 'days');
  ratio('rCcc', 'Cash conversion cycle (inventory + receivable − payable days)', 'days', i => `{rInvD}+{rRecD}-{rPayD}`, 'days');
  ratio('rCxS', 'Capex / revenue', '%', i => `-{capexCf}/{sales}`, 'pct');
  ratio('rCxD', 'Capex / depreciation', 'x', i => `-{capexCf}/{dep}`, 'd1');
  ratio('rCfoE', 'CFO / EBITDA', '%', i => `{cfo}/{ebitda}`, 'pct');
  ratio('rFcfP', 'Free cash flow / net profit', '%', i => `{fcf}/{pat}`, 'pct');
  ratio('rDe', 'Debt / equity', 'x', i => `{debt}/{nw}`, 'd2');
  bandRow('Per share & valuation at CMP', 1);
  ratio('rBvps', 'Book value per share', '₹', i => `IFERROR({nw}/{shares},"")`, 'num');
  ratio('rPay', 'Dividend payout', '%', i => `IFERROR({dps}/{eps},"")`, 'pct');
  ratio('rPe', 'P/E', 'x', i => `IF(N({eps})>0,CMP/{eps},"n.m.")`, 'x');
  ratio('rPb', 'P/B', 'x', i => `IF(N({rBvps})>0,CMP/{rBvps},"n.m.")`, 'x');
  ratio('rEv', 'EV/EBITDA (EV = market cap − net cash)', 'x', i => `IF({ebitda}>0,(CMP*Shares-{treasury})/{ebitda},"n.m.")`, 'x');
  ratio('rDy', 'Dividend yield', '%', i => `{dps}/CMP`, 'pct');
  ratio('rFy', 'Free cash flow yield', '%', i => `{fcf}/(CMP*Shares)`, 'pct');
  const ncol = 2 + labels.length;
  const { R, end } = writeRows(wm, S, { labels, nH, C0, startRow: 5, ncol });
  wm.getCell(`A${end + 1}`).value = 'Colour code: blue = reported (hard-coded) · black = formula · green = linked to Assumptions / named inputs · shaded columns = GAM estimates.';
  wm.getCell(`A${end + 1}`).font = { italic: true, size: 9, color: { argb: MUTED } };
  // Assumption defaults taken from FY26 actuals in the Model
  const bc = col(b), bp = col(b - 1);
  years.forEach((_, i) => {
    const c = colL(2 + i);
    const set = (key, f, fmt = 'd1') => { const cell = wa.getCell(`${c}${AR[key].base}`); cell.value = { formula: f }; cell.numFmt = FMT[fmt]; cell.font = { color: { argb: GREEN } }; };
    if (SEG) { set('rmShare', `Model!${bc}${R.rm}/Model!${bc}${R.opex}*100`); set('empShare', `Model!${bc}${R.emp}/Model!${bc}${R.opex}*100`); set('mfgShare', `Model!${bc}${R.mfg}/Model!${bc}${R.opex}*100`); }
    else { set('empPct', `Model!${bc}${R.empPct}`); set('mfgPct', `Model!${bc}${R.mfgPct}`); set('othPct', `Model!${bc}${R.othPct}`); }
    if (isNum(as.depRateOnGrossBlock)) input(`${c}${AR.depRate.base}`, as.depRateOnGrossBlock, 'd2');
    else set('depRate', `Model!${bc}${R.dep}/AVERAGE(Model!${bp}${R.gb},Model!${bc}${R.gb})*100`, 'd2');
    set('invDays', `Model!${bc}${R.inventories}/Model!${bc}${R.sales}*365`); set('recDays', `Model!${bc}${R.receivables}/Model!${bc}${R.sales}*365`);
    set('ocaPct', `Model!${bc}${R.oca}/Model!${bc}${R.sales}*100`, 'd2'); set('payDays', `Model!${bc}${R.payables}/Model!${bc}${R.sales}*365`);
    set('advPct', `Model!${bc}${R.advances}/Model!${bc}${R.sales}*100`, 'd2'); set('olPct', `Model!${bc}${R.othLiab}/Model!${bc}${R.sales}*100`, 'd2');
    if (OD) set('gmlPct', `Model!${bc}${R.gml}/Model!${bc}${R.sales}*100`, 'd2');
  });

  // =============================== DCF / SOTP ===============================
  if (SOTP) buildSotpSheet(wb, M, { R, nH, years, col });
  if (!SOTP || d) {
  const wd = wb.addWorksheet('DCF', { views: [{ showGridLines: false, state: 'frozen', xSplit: 1, ySplit: 0 }], properties: { tabColor: { argb: 'FF16A08A' } } });
  title(wd, `${M.meta.name}: Discounted cash flow valuation`, 'Free cash flow to the firm (FCFF) from the operating business; treasury income excluded and net cash (or net debt) added separately. Every cell is a formula.');
  const N = d.years || 15, nE = nF;
  const m = (key, j) => `Model!${col(nH + j)}${R[key]}`;
  wd.getColumn(1).width = 44; wd.getColumn(2).width = 13;
  for (let k = 1; k <= N; k++) wd.getColumn(2 + k).width = 10.5;
  let dr = 4;
  band(wd, dr++, 'Inputs (linked)', 4, 1);
  const DV = {};
  const kv = [
    ['Cost of equity = WACC, %', 'Ke', 'd1'], ['Terminal growth, %', 'TermGrowth', 'd1'],
    [`Base-year (${years[nE - 1]}) revenue growth, %`, `${m('salesG', nE - 1)}*100`, 'd1'], ['Base-year EBITDA margin, %', `${m('ebitdaM', nE - 1)}*100`, 'd1'],
    ['Base-year capex % of revenue', `-${m('capexCf', nE - 1)}/${m('sales', nE - 1)}*100`, 'd1'], [`Tax rate (${years[nE - 1]}), %`, `${m('taxR', nE - 1)}*100`, 'd1'],
    ['Operating working capital % of revenue', `${m('owc', nE - 1)}/${m('sales', nE - 1)}*100`, 'd2'],
    [`Net cash at valuation date (end-${years[0]})`, m('treasury', 0), 'num'],
  ];
  for (const [label, f, fmt] of kv) { wd.getCell(`A${dr}`).value = label; const c = wd.getCell(`B${dr}`); c.value = { formula: f }; c.numFmt = FMT[fmt]; c.font = { color: { argb: GREEN } }; DV[label] = `$B$${dr}`; dr++; }
  const g0 = DV[`Base-year (${years[nE - 1]}) revenue growth, %`], m0 = DV['Base-year EBITDA margin, %'], c0 = DV['Base-year capex % of revenue'], tR = DV[`Tax rate (${years[nE - 1]}), %`], wcp = DV['Operating working capital % of revenue'], nc = DV[`Net cash at valuation date (end-${years[0]})`];
  dr++;
  const yr = dr;
  header(wd, yr, ['FCFF build', `${years[0]} base`, ...Array.from({ length: N }, (_, k) => `FY${+years[0].slice(2, 4) + k + 1}E`)], null);
  const rows = ['Years from valuation date', 'Revenue growth, %', 'Revenue', 'EBITDA margin, %', 'EBITDA', 'Depreciation', 'EBIT', 'Tax on EBIT', 'NOPAT (EBIT after tax)', 'Capex % of revenue', 'Capex', 'Increase in working capital', 'FCFF = NOPAT + depreciation − capex − ΔWC', 'Discount factor (mid-year)', 'Present value of FCFF'];
  const RR = {}; rows.forEach((t, i) => { RR[t] = yr + 1 + i; wd.getCell(`A${yr + 1 + i}`).value = t; });
  const FC = 'FCFF = NOPAT + depreciation − capex − ΔWC';
  wd.getCell(`B${RR.Revenue}`).value = { formula: m('sales', 0) }; wd.getCell(`B${RR.Revenue}`).numFmt = FMT.num; wd.getCell(`B${RR.Revenue}`).font = { color: { argb: GREEN } };
  for (let k = 1; k <= N; k++) {
    const c = colL(1 + k), p = colL(k);
    const fade = `(${c}${RR['Years from valuation date']}-${nE - 1})/(${N}-${nE - 1})`;
    const explicit = k < nE;
    const set = (row, f, fmt) => { const cell = wd.getCell(`${c}${RR[row]}`); cell.value = { formula: f }; cell.numFmt = FMT[fmt]; if (/Model!/.test(f)) cell.font = { color: { argb: GREEN } }; if (!explicit) cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF7F4EC' } }; };
    set('Years from valuation date', `${k}`, 'num');
    set('Revenue growth, %', explicit ? `${m('salesG', k)}*100` : `${g0}+(FadeGrowth-${g0})*${fade}`, 'd1');
    set('Revenue', `${p}${RR.Revenue}*(1+${c}${RR['Revenue growth, %']}/100)`, 'num');
    set('EBITDA margin, %', explicit ? `${m('ebitdaM', k)}*100` : `${m0}+(FadeMargin-${m0})*${fade}`, 'd1');
    set('EBITDA', `${c}${RR.Revenue}*${c}${RR['EBITDA margin, %']}/100`, 'num');
    set('Depreciation', `${c}${RR.Revenue}*DepPctSales/100`, 'num');
    set('EBIT', `${c}${RR.EBITDA}-${c}${RR.Depreciation}`, 'num');
    set('Tax on EBIT', `${c}${RR.EBIT}*${tR}/100`, 'num');
    set('NOPAT (EBIT after tax)', `${c}${RR.EBIT}-${c}${RR['Tax on EBIT']}`, 'num');
    set('Capex % of revenue', explicit ? `-${m('capexCf', k)}/${m('sales', k)}*100` : `${c0}+(FadeCapex-${c0})*${fade}`, 'd1');
    set('Capex', `${c}${RR.Revenue}*${c}${RR['Capex % of revenue']}/100`, 'num');
    set('Increase in working capital', `${wcp}/100*${c}${RR.Revenue}*(${c}${RR['Revenue growth, %']}/(100+${c}${RR['Revenue growth, %']}))`, 'num');
    set(FC, `${c}${RR['NOPAT (EBIT after tax)']}+${c}${RR.Depreciation}-${c}${RR.Capex}-${c}${RR['Increase in working capital']}`, 'num');
    set('Discount factor (mid-year)', `1/(1+Ke/100)^(${c}${RR['Years from valuation date']}-0.5)`, 'd3');
    set('Present value of FCFF', `${c}${RR[FC]}*${c}${RR['Discount factor (mid-year)']}`, 'num');
  }
  [FC, 'Present value of FCFF', 'EBITDA', 'Revenue'].forEach(t => (wd.getCell(`A${RR[t]}`).font = { bold: true }));
  wd.getCell(`A${RR['Present value of FCFF'] + 1}`).value = `Shaded columns: years beyond the explicit forecast, where growth, margin and capex fade linearly to the long-run inputs.`;
  wd.getCell(`A${RR['Present value of FCFF'] + 1}`).font = { italic: true, size: 8.5, color: { argb: MUTED } };
  const LL = colL(1 + N), F1 = colL(2);
  const fcffR = `$${F1}$${RR[FC]}:$${LL}$${RR[FC]}`, kR = `$${F1}$${RR['Years from valuation date']}:$${LL}$${RR['Years from valuation date']}`;
  dr = RR['Present value of FCFF'] + 3;
  band(wd, dr++, 'From enterprise value to target price', 4, 1);
  const out = {};
  const sumRow = (label, f, fmt, bold, nm) => { wd.getCell(`A${dr}`).value = label; const c = wd.getCell(`B${dr}`); c.value = { formula: f }; c.numFmt = FMT[fmt]; c.font = { bold: !!bold }; wd.getCell(`A${dr}`).font = { bold: !!bold }; out[label] = `$B$${dr}`; if (nm) wb.definedNames.add(`DCF!$B$${dr}`, nm); dr++; };
  sumRow('Sum of present values of FCFF', `SUM(${F1}${RR['Present value of FCFF']}:${LL}${RR['Present value of FCFF']})`, 'num');
  sumRow(`Terminal value = year-${N} FCFF × (1 + g) ÷ (WACC − g)`, `${LL}${RR[FC]}*(1+TermGrowth/100)/((Ke-TermGrowth)/100)`, 'num');
  sumRow('Present value of terminal value', `${out[`Terminal value = year-${N} FCFF × (1 + g) ÷ (WACC − g)`]}/(1+Ke/100)^${N}`, 'num');
  sumRow(`Enterprise value (end-${years[0]})`, `${out['Sum of present values of FCFF']}+${out['Present value of terminal value']}`, 'num', true);
  sumRow('Add: net cash & investments', `${nc}`, 'num');
  sumRow('Equity value', `${out[`Enterprise value (end-${years[0]})`]}+${out['Add: net cash & investments']}`, 'num', true);
  sumRow('Shares (crore)', 'Shares', 'd2');
  sumRow(`Value per share (end-${years[0]})`, `${out['Equity value']}/Shares`, 'num');
  const tpLabel = BLEND ? '12-month DCF value per share (rolled forward at Ke)' : '12-month target price (rolled forward at Ke, rounded to ₹10)';
  if (BLEND) { sumRow(tpLabel, `${out[`Value per share (end-${years[0]})`]}*(1+Ke/100)^(RollMonths/12)`, 'num', true, 'DCFValue'); sumRow('DCF value vs CMP', 'DCFValue/CMP-1', 'pct', true); }
  else { sumRow(tpLabel, `ROUND(${out[`Value per share (end-${years[0]})`]}*(1+Ke/100)^(RollMonths/12)/10,0)*10`, 'num', true, 'TargetPrice'); sumRow('Upside / (downside) vs CMP', 'TargetPrice/CMP-1', 'pct', true, 'Upside'); }
  sumRow('Terminal value as % of enterprise value', `${out['Present value of terminal value']}/${out[`Enterprise value (end-${years[0]})`]}`, 'pct');
  const tpRef = BLEND ? 'DCFValue' : 'TargetPrice';
  sumRow(`Implied P/E on ${years[1]} EPS`, `${tpRef}/${m('eps', 1)}`, 'x');
  sumRow(`Implied EV/EBITDA on ${years[1]}`, `(${tpRef}*Shares-${nc})/${m('ebitda', 1)}`, 'x');
  wd.getCell(out[tpLabel].replace(/\$/g, '')).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: INPUT } };
  dr += 1;
  band(wd, dr++, 'Target price sensitivity (₹): WACC down the side, terminal growth across', 7, 1);
  const sr = dr;
  wd.getCell(`B${sr}`).value = 'WACC \\ g'; wd.getCell(`B${sr}`).font = { bold: true };
  const steps = [-1, -0.5, 0, 0.5, 1];
  steps.forEach((x, j) => { const c = wd.getCell(`${colL(2 + j)}${sr}`); c.value = { formula: `TermGrowth+${x}` }; c.numFmt = '0.0"%"'; c.font = { bold: true }; });
  steps.forEach((x, i) => {
    const rr = sr + 1 + i;
    const wc_ = wd.getCell(`B${rr}`); wc_.value = { formula: `Ke+${x}` }; wc_.numFmt = '0.0"%"'; wc_.font = { bold: true };
    steps.forEach((_, j) => {
      const cc = colL(2 + j), w = `$B${rr}`, g = `${cc}$${sr}`;
      const cell = wd.getCell(`${cc}${rr}`);
      cell.value = { formula: `ROUND((SUMPRODUCT(${fcffR},(1+${w}/100)^-(${kR}-0.5))+$${LL}$${RR[FC]}*(1+${g}/100)/((${w}-${g})/100)/(1+${w}/100)^${N}+${nc})/Shares*(1+Ke/100)^(RollMonths/12)/10,0)*10` };
      cell.numFmt = FMT.num;
      if (i === 2 && j === 2) { cell.font = { bold: true }; cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: INPUT } }; }
    });
  });

  } // end DCF
  // =============================== KPIs (formula-driven) ===============================
  if (SEG || (!as.volume && M.research?.segments?.kpiBlocks)) buildSegmentKpiSheet(wb, M); else if (as.volume) buildKpiSheet(wb, M, { R, nH, hist, years });
  if (BLEND) buildValuationSheet(wb, M, { R, nH, years, col, intrinsic: SOTP ? (d ? { sotp: 'SOTPValue', dcf: 'DCFValue' } : 'SOTPValue') : 'DCFValue' });
  buildQuarterlySheet(wb, M);
  buildLongQuarterly(wb, M);
  wb.calcProperties = { fullCalcOnLoad: true };
  return { R, AR };
}

function buildKpiSheet(wb, M, { R, nH, hist, years }) {
  const ak = M.research?.company?.annualKpis || [], dd = M.research?.deepdive || {};
  const byFy = (list, f) => hist.map(l => { const o = (list || []).find(x => x.fy === l); return o && isNum(o[f]) ? o[f] : null; });
  const ws = wb.addWorksheet('KPIs', { views: [{ showGridLines: false, state: 'frozen', xSplit: 2, ySplit: 4 }], properties: { tabColor: { argb: 'FFA85FC0' } } });
  title(ws, `${M.meta.name}: Operating KPIs`, 'Reported/disclosed figures in blue; derived figures are formulas (black) or links to the Model (green). Blank = not disclosed.');
  const labels = [...hist, ...years];
  ws.getColumn(1).width = 50; ws.getColumn(2).width = 8; labels.forEach((_, i) => (ws.getColumn(3 + i).width = 11));
  header(ws, 4, ['KPI', 'Unit', ...labels], 3 + nH);
  const mref = (key, i) => `Model!${colL(2 + i)}${R[key]}`;
  const S = [];
  const L = (key, label, unit, hv, fv, opt = {}) => S.push({ key, label, unit, hv, fv, ...opt });
  const bandRow = (t, level = 0) => S.push({ band: t, level });
  const has = arr => arr.some(isNum);
  bandRow('1   VOLUMES');
  L('dom', 'Domestic volume', 'units', byFy(ak, 'domestic'), null, { indent: 1 });
  L('exp', 'Export volume', 'units', byFy(ak, 'exports'), null, { indent: 1 });
  L('tot', 'Total volume (domestic + exports)', 'units', i => `IF(COUNT({dom},{exp})=2,{dom}+{exp},${mref('units', i)})`, i => `${mref('units', i)}`, { bold: true, total: true });
  L('totG', 'Volume growth', '%', i => (i ? `IFERROR({tot}/{tot@p}-1,"")` : null), i => `{tot}/{tot@p}-1`, { fmt: 'pct', italic: true, indent: 1 });
  L('expSh', 'Exports as % of volume', '%', i => `IFERROR({exp}/{tot},"")`, null, { fmt: 'pct', italic: true, indent: 1 });
  bandRow('2   MARKET POSITION');
  if (has(byFy(ak, 'marketShare'))) L('ms', 'Domestic passenger-vehicle market share', '%', byFy(ak, 'marketShare'), null, { fmt: 'd1' });
  if (has(byFy(ak, 'suvShare'))) L('suv', 'SUVs as % of Maruti volume', '%', byFy(ak, 'suvShare'), null, { fmt: 'd1' });
  if (has(byFy(ak, 'cngShare'))) L('cng', 'CNG as % of Maruti volume', '%', byFy(ak, 'cngShare'), null, { fmt: 'd1' });
  bandRow('3   UNIT ECONOMICS (per vehicle)');
  L('rpv', 'Revenue per vehicle', '₹', i => `IFERROR(${mref('sales', i)}*10^7/{tot},"")`, i => `${mref('sales', i)}*10^7/{tot}`);
  L('rmpv', 'Raw material cost per vehicle', '₹', i => `IFERROR(${mref('rm', i)}*10^7/{tot},"")`, i => `${mref('rm', i)}*10^7/{tot}`, { indent: 1 });
  L('ebpv', 'EBITDA per vehicle', '₹', i => `IFERROR(${mref('ebitda', i)}*10^7/{tot},"")`, i => `${mref('ebitda', i)}*10^7/{tot}`, { bold: true });
  L('patpv', 'Net profit per vehicle', '₹', i => `IFERROR(${mref('pat', i)}*10^7/{tot},"")`, i => `${mref('pat', i)}*10^7/{tot}`, { indent: 1 });
  const ue = dd.unitEconomics || [];
  if (has(byFy(ue, 'discountPerVehicle'))) L('disc', 'Discounts & incentives per vehicle (standalone)', '₹', byFy(ue, 'discountPerVehicle'), null, { indent: 1 });
  if (has(byFy(ue, 'employeeCostPerVehicle'))) L('empv', 'Employee cost per vehicle (standalone)', '₹', byFy(ue, 'employeeCostPerVehicle'), null, { indent: 1 });
  if (has(byFy(ue, 'royaltyPct'))) L('roy', 'Royalty to Suzuki, % of sales (standalone)', '%', byFy(ue, 'royaltyPct'), null, { fmt: 'd2', indent: 1 });
  const ut = dd.utilisation || [];
  if (has(byFy(ut, 'capacity'))) {
    bandRow('4   CAPACITY');
    L('cap', 'Installed capacity', 'units', byFy(ut, 'capacity'), null);
    L('prod', 'Production', 'units', byFy(ut, 'production'), null);
    L('util', 'Capacity utilisation (production ÷ capacity)', '%', i => `IFERROR({prod}/{cap},"")`, null, { fmt: 'pct', bold: true });
  }
  const dist = dd.distribution || [];
  if (has(byFy(dist, 'salesOutlets'))) {
    bandRow('5   DISTRIBUTION');
    L('out', 'Sales outlets', 'nos', byFy(dist, 'salesOutlets'), null, { bold: true });
    L('outG', 'Outlet growth', '%', i => (i ? `IFERROR({out}/{out@p}-1,"")` : null), null, { fmt: 'pct', italic: true, indent: 1 });
    L('nexa', 'of which Nexa (premium) outlets', 'nos', byFy(dist, 'nexa'), null, { indent: 1 });
    L('nexaSh', 'Nexa share of outlets', '%', i => `IFERROR({nexa}/{out},"")`, null, { fmt: 'pct', italic: true, indent: 1 });
    L('svc', 'Service workshops', 'nos', byFy(dist, 'serviceWorkshops'), null);
    L('vpo', 'Vehicles sold per outlet (domestic)', 'units', i => `IFERROR({dom}/{out},"")`, null, { italic: true, indent: 1 });
  }
  writeRows(ws, S, { labels, nH, C0: 2, startRow: 5, ncol: 2 + labels.length });
}

function buildQuarterlySheet(wb, M) {
  const Q = M.quarterly; if (!Q) return;
  const qk = (M.research?.company?.quarterlyKpis || []);
  const ql = Q.labels, n = ql.length;
  const ws = wb.addWorksheet('Quarterly', { views: [{ showGridLines: false, state: 'frozen', xSplit: 2, ySplit: 4 }], properties: { tabColor: { argb: 'FFCF8F1F' } } });
  title(ws, `${M.meta.name}: Quarterly results and KPIs`, 'Reported in blue; derived lines are formulas. Q1 = Apr–Jun. YoY = vs the same quarter a year earlier.');
  ws.getColumn(1).width = 50; ws.getColumn(2).width = 8; ql.forEach((_, i) => (ws.getColumn(3 + i).width = 11));
  header(ws, 4, ['₹ crore', 'Unit', ...ql], null);
  const byQ = f => ql.map(l => { const o = qk.find(x => x.q === l); return o && isNum(o[f]) ? o[f] : null; });
  const S = [];
  const L = (key, label, unit, hv, opt = {}) => S.push({ key, label, unit, hv, ...opt });
  const bandRow = (t, level = 0) => S.push({ band: t, level });
  const yoy = k => i => (i >= 4 ? `IFERROR({${k}}/${colL(2 + i - 4)}{ROW_${k}}-1,"")` : null);
  bandRow('1   VOLUMES');
  L('qdom', 'Domestic volume', 'units', byQ('domestic'), { indent: 1 });
  L('qexp', 'Export volume', 'units', byQ('exports'), { indent: 1 });
  L('qunits', 'Total volume', 'units', byQ('units'), { bold: true });
  L('qunitsG', 'Volume growth YoY', '%', 'yoy:qunits', { fmt: 'pct', italic: true, indent: 1 });
  bandRow('2   PROFIT & LOSS');
  L('qsales', 'Revenue', '₹ cr', Q.sales, { bold: true });
  L('qsalesG', 'Revenue growth YoY', '%', 'yoy:qsales', { fmt: 'pct', italic: true, indent: 1 });
  L('qrpv', 'Revenue per vehicle', '₹', i => `IFERROR({qsales}*10^7/{qunits},"")`, { indent: 1 });
  L('qrmPct', 'Raw material cost, % of revenue', '%', Q.materialPct, { fmt: 'd1', italic: true, indent: 1 });
  L('qrm', 'Raw material cost', '₹ cr', i => `{qsales}*{qrmPct}/100`, { indent: 1 });
  L('qempPct', 'Employee cost, % of revenue', '%', Q.employeePct, { fmt: 'd1', italic: true, indent: 1 });
  L('qemp', 'Employee cost', '₹ cr', i => `{qsales}*{qempPct}/100`, { indent: 1 });
  L('qoth', 'Other expenses (balancing)', '₹ cr', i => `{qexp_}-{qrm}-{qemp}`, { indent: 1 });
  L('qexp_', 'Total operating expenses', '₹ cr', Q.expenses, { total: true });
  L('qebitda', 'EBITDA', '₹ cr', i => `{qsales}-{qexp_}`, { bold: true });
  L('qmargin', 'EBITDA margin', '%', i => `{qebitda}/{qsales}`, { fmt: 'pct', italic: true, indent: 1 });
  L('qebpv', 'EBITDA per vehicle', '₹', i => `IFERROR({qebitda}*10^7/{qunits},"")`, { indent: 1 });
  L('qoi', 'Other income', '₹ cr', Q.otherIncome);
  L('qint', 'Interest', '₹ cr', Q.interest);
  L('qdep', 'Depreciation', '₹ cr', Q.dep);
  L('qpbt', 'Profit before tax', '₹ cr', i => `{qebitda}+{qoi}-{qint}-{qdep}`, { bold: true, total: true });
  L('qtax', 'Tax', '₹ cr', i => `{qpbt}-{qpat}`);
  L('qtaxR', 'Effective tax rate', '%', i => `IFERROR({qtax}/{qpbt},"")`, { fmt: 'pct', italic: true, indent: 1 });
  L('qpat', 'Net profit', '₹ cr', Q.pat, { bold: true, total: true });
  L('qpatG', 'Net profit growth YoY', '%', 'yoy:qpat', { fmt: 'pct', italic: true, indent: 1 });
  L('qeps', 'EPS', '₹', Q.eps, { fmt: 'd1' });
  // resolve YoY specs into functions now that keys are known
  if (!qk.some(x => isNum(x.units))) for (let j = S.length - 1; j >= 0; j--) if (['qdom', 'qexp', 'qunits', 'qunitsG', 'qrpv', 'qebpv'].includes(S[j].key) || S[j].band === '1   VOLUMES') S.splice(j, 1);
  if (!Q.materialPct?.some(isNum)) for (let j = S.length - 1; j >= 0; j--) if (['qrmPct', 'qrm', 'qempPct', 'qemp', 'qoth'].includes(S[j].key)) S.splice(j, 1);
  for (const s of S) if (typeof s.hv === 'string' && s.hv.startsWith('yoy:')) { const k = s.hv.slice(4); s.hv = i => (i >= 4 ? `IFERROR({${k}}/${colL(2 + i - 4)}{ROW:${k}}-1,"")` : null); s.yoyKey = k; }
  // writeRows can't express "4 periods back", so pre-assign rows and substitute directly
  let rr = 5; for (const s of S) { s._row = rr++; }
  const rowOf = k => S.find(x => x.key === k)._row;
  for (const s of S) if (s.yoyKey) { const k = s.yoyKey; const f = s.hv; s.hv = i => { const v = f(i); return v ? v.replace(`{ROW:${k}}`, String(rowOf(k))) : null; }; }
  writeRows(ws, S, { labels: ql, nH: n, C0: 2, startRow: 5, ncol: 2 + n });
  const notes = qk.filter(x => x.marginDrivers || x.commentary);
  if (notes.length) {
    let r = 5 + S.length + 1;
    band(ws, r++, '3   WHAT MOVED THE NUMBERS EACH QUARTER (management commentary)', 2 + n, 0);
    for (const x of notes) {
      ws.getCell(`A${r}`).value = x.q; ws.getCell(`A${r}`).font = { bold: true };
      ws.mergeCells(`B${r}:${colL(1 + n)}${r}`);
      ws.getCell(`B${r}`).value = x.marginDrivers || x.commentary; ws.getCell(`B${r}`).alignment = { wrapText: true, vertical: 'top' }; ws.getCell(`B${r}`).font = { size: 9 };
      ws.getRow(r).height = 48; r++;
    }
  }
}

function buildLongQuarterly(wb, M) {
  const LQ = M.longQuarterly; if (!LQ?.length) return;
  const ql = LQ.map(x => x.label), n = ql.length;
  const ws = wb.addWorksheet('Quarterly history', { views: [{ showGridLines: false, state: 'frozen', xSplit: 2, ySplit: 4 }] });
  title(ws, `${M.meta.name}: Quarterly revenue and margins since ${ql[0]}`, 'Long-run series (Screener). Growth is a formula.');
  ws.getColumn(1).width = 34; ws.getColumn(2).width = 6; ql.forEach((_, i) => (ws.getColumn(3 + i).width = 9));
  header(ws, 4, ['', 'Unit', ...ql], null);
  const S = [
    { key: 'ls', label: 'Revenue', unit: '₹ cr', hv: LQ.map(x => x.sales), bold: true },
    { key: 'lsg', label: 'Revenue growth YoY', unit: '%', hv: i => (i >= 4 ? `IFERROR(${colL(2 + i)}5/${colL(2 + i - 4)}5-1,"")` : null), fmt: 'pct', italic: true },
    { key: 'lg', label: 'Gross margin', unit: '%', hv: LQ.map(x => x.gpm), fmt: 'd1' },
    { key: 'lo', label: 'Operating (EBITDA) margin', unit: '%', hv: LQ.map(x => x.opm), fmt: 'd1', bold: true },
    { key: 'ln', label: 'Net margin', unit: '%', hv: LQ.map(x => x.npm), fmt: 'd1' },
  ];
  writeRows(ws, S, { labels: ql, nH: n, C0: 2, startRow: 5, ncol: 2 + n });
}

// Sum-of-the-parts sheet: each part = metric (linked from the Model) × multiple + adjustment,
// with Base / Bull / Bear inputs chosen by the Scenario switch; plus net cash.
function buildSotpSheet(wb, M, { R, nH, years, col }) {
  const v = M.forecast.assumptions.valuation;
  const ws = wb.addWorksheet('SOTP', { views: [{ showGridLines: false, state: 'frozen', xSplit: 1, ySplit: 4 }], properties: { tabColor: { argb: 'FF16A08A' } } });
  title(ws, `${M.meta.name}: Sum-of-the-parts valuation`, 'Each business valued separately on its forecast metric. Inputs in blue on yellow; the live multiple and adjustment follow the Scenario switch (Assumptions!B4).');
  [44, 34, 13, 10, 10, 10, 11, 11, 11, 11, 13, 11, 90].forEach((w, i) => (ws.getColumn(i + 1).width = w));
  header(ws, 4, ['Business', 'Metric', 'Metric (₹ cr)', 'Multiple: Base', 'Bull', 'Bear', 'Live multiple', 'Adj: Base', 'Bull', 'Bear', 'Value (₹ cr)', '₹ / share', 'Basis'], null);
  const fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: INPUT } };
  const inp = (cell, val, fmt) => { const c = ws.getCell(cell); c.value = val; c.font = { color: { argb: BLUE }, bold: true }; c.fill = fill; c.numFmt = FMT[fmt || 'd1']; };
  const rowKey = { driver: 'd_', revenue: 'rv_', adjEbitda: 'ae_' };
  let r = 5; const first = r; let cashRow = null;
  for (const p of v.parts) {
    ws.getCell(`A${r}`).value = p.name; ws.getCell(`A${r}`).font = { bold: true };
    // metric from the Model: one forecast year, or `roll` = [fromYear, toYear, weightOnTo]
    const pick = rowk => {
      const at = y => `Model!${col(nH + Math.max(0, years.indexOf(y)))}${R[rowk]}`;
      return p.roll ? `(1-${p.roll[2]})*${at(p.roll[0])}+${p.roll[2]}*${at(p.roll[1])}` : at(p.year || years[0]);
    };
    if (p.netCash) {
      cashRow = r;
      ws.getCell(`B${r}`).value = p.metricLabel || `Net cash & investments, end-${years[0]}`;
      ws.getCell(`K${r}`).value = { formula: pick('treasury') }; ws.getCell(`K${r}`).font = { color: { argb: GREEN }, bold: true };
    } else {
      ws.getCell(`B${r}`).value = p.metricLabel || `${p.field} ${p.year}`;
      const rowk = p.seg ? rowKey[p.field] + p.seg : p.unalloc ? 'unalloc' : null;
      if (rowk) { ws.getCell(`C${r}`).value = { formula: pick(rowk) }; ws.getCell(`C${r}`).font = { color: { argb: GREEN } }; }
      const mu = p.multiple || { base: 0 };
      inp(`D${r}`, mu.base, 'd2'); inp(`E${r}`, mu.bull ?? mu.base, 'd2'); inp(`F${r}`, mu.bear ?? mu.base, 'd2');
      ws.getCell(`G${r}`).value = { formula: `CHOOSE(Scenario,D${r},E${r},F${r})` }; ws.getCell(`G${r}`).numFmt = FMT.d2; ws.getCell(`G${r}`).font = { bold: true };
      const a = p.adj || { base: 0 };
      inp(`H${r}`, a.base, 'num'); inp(`I${r}`, a.bull ?? a.base, 'num'); inp(`J${r}`, a.bear ?? a.base, 'num');
      ws.getCell(`K${r}`).value = { formula: `N(C${r})*G${r}+CHOOSE(Scenario,H${r},I${r},J${r})` }; ws.getCell(`K${r}`).font = { bold: true };
    }
    ws.getCell(`C${r}`).numFmt = FMT.num; ws.getCell(`K${r}`).numFmt = FMT.num;
    ws.getCell(`L${r}`).value = { formula: `K${r}/Shares` }; ws.getCell(`L${r}`).numFmt = FMT.num;
    if (p.note) { ws.getCell(`M${r}`).value = p.note; ws.getCell(`M${r}`).font = { size: 9, italic: true, color: { argb: MUTED } }; }
    r++;
  }
  const last = r - 1;
  r++;
  const tot = (label, f, fmt, nm, bold = true) => { ws.getCell(`A${r}`).value = label; ws.getCell(`A${r}`).font = { bold }; const c = ws.getCell(`K${r}`); c.value = { formula: f }; c.numFmt = FMT[fmt]; c.font = { bold }; if (nm) wb.definedNames.add(`SOTP!$K${r}`, nm); return r++; };
  const BL = !!v.blend;
  const eq = tot('Equity value', `SUM(K${first}:K${last})`, 'num');
  tot('Shares (crore)', 'Shares', 'd2', null, false);
  const vps = tot('Value per share', `K${eq}/Shares`, 'num');
  if (BL) { wb.definedNames.add(`SOTP!$K${vps}`, 'SOTPValue'); tot('SOTP value vs CMP', 'SOTPValue/CMP-1', 'pct'); }
  else { const tp = tot(`12-month target price (rounded to ₹${v.round || 5})`, `ROUND(K${vps}/${v.round || 5},0)*${v.round || 5}`, 'num', 'TargetPrice'); ws.getCell(`K${tp}`).fill = fill; tot('Upside / (downside) vs CMP', 'TargetPrice/CMP-1', 'pct', 'Upside'); }
  tot('Market value at CMP', 'CMP*Shares', 'num', null, false);
  if (cashRow) tot('Value the market puts on the businesses (market value less net cash)', `CMP*Shares-K${cashRow}`, 'num', null, false);
  ws.getCell(`A${r + 1}`).value = 'Value = metric × live multiple + live adjustment. Adjustments carry items such as the present value of losses still to be funded before a business breaks even.';
  ws.getCell(`A${r + 1}`).font = { italic: true, size: 9, color: { argb: MUTED } };
}

// Segment KPI sheet (platforms): quarterly segment metrics; reported in blue, derived lines are formulas.
function buildSegmentKpiSheet(wb, M) {
  const q = M.research?.segments?.quarterly || []; if (!q.length) return;
  const ql = q.map(x => x.q), n = ql.length;
  const ws = wb.addWorksheet('KPIs', { views: [{ showGridLines: false, state: 'frozen', xSplit: 2, ySplit: 4 }], properties: { tabColor: { argb: 'FFA85FC0' } } });
  title(ws, `${M.meta.name}: Segment KPIs by quarter`, `Reported in blue; growth, margins and shares are formulas.${M.research.segments.kpiBlocks ? '' : ' GOV = gross order value.'} Blank = not disclosed.`);
  ws.getColumn(1).width = 50; ws.getColumn(2).width = 9; ql.forEach((_, i) => (ws.getColumn(3 + i).width = 11));
  header(ws, 4, ['KPI', 'Unit', ...ql], null);
  const has = f => q.some(x => isNum(x[f]));
  const byQ = f => q.map(x => (isNum(x[f]) ? x[f] : null));
  const S = [];
  const L = (key, label, unit, hv, opt = {}) => S.push({ key, label, unit, hv, ...opt });
  const blocks = M.research.segments.kpiBlocks || [
    ['1   CONSOLIDATED', [['gov', 'B2C gross order value (GOV)', '₹ cr', 1], ['revenue', 'Revenue from operations', '₹ cr', 1], ['adjEbitda', 'Adjusted EBITDA', '₹ cr', 0, 'revenue'], ['pat', 'Net profit / (loss)', '₹ cr'], ['cash', 'Cash & investments', '₹ cr']]],
    ['2   FOOD DELIVERY', [['foodGov', 'Gross order value', '₹ cr', 1], ['foodRev', 'Revenue', '₹ cr', 1], ['foodAdjEbitda', 'Adjusted EBITDA', '₹ cr', 0, 'foodGov'], ['foodContribPct', 'Contribution margin, % of GOV', '%'], ['mtu', 'Platform monthly transacting users', 'mn', 1]]],
    ['3   INSTAMART (QUICK COMMERCE)', [['imGov', 'Gross order value', '₹ cr', 1], ['imRev', 'Revenue', '₹ cr', 1], ['imAdjEbitda', 'Adjusted EBITDA', '₹ cr', 0, 'imGov'], ['imContribPct', 'Contribution margin, % of GOV', '%'], ['imStores', 'Dark stores (period end)', 'nos'], ['imSqftMn', 'Dark-store area', 'mn sq ft'], ['imAov', 'Average order value', '₹', 1]]],
    ['4   OUT-OF-HOME & OTHERS', [['oohGov', 'Out-of-home GOV', '₹ cr', 1], ['oohAdjEbitda', 'Out-of-home adjusted EBITDA', '₹ cr'], ['scRev', 'Supply chain & distribution revenue', '₹ cr', 1], ['scAdjEbitda', 'Supply chain adjusted EBITDA', '₹ cr'], ['piAdjEbitda', 'Platform innovations adjusted EBITDA', '₹ cr']]],
  ];
  for (const [bt, rows] of blocks) {
    if (!rows.some(([f]) => has(f))) continue;
    S.push({ band: bt, level: 0 });
    for (const [f, label, unit, growth, marginOf] of rows) {
      if (!has(f)) continue;
      L(f, label, unit, byQ(f), { fmt: unit === '%' || unit === 'mn' || unit === 'mn sq ft' ? 'd1' : 'num', bold: !!growth });
      if (growth) L(f + 'G', 'growth YoY', '%', null, { fmt: 'pct', italic: true, indent: 1, yoyKey: f });
      if (marginOf && has(marginOf)) L(f + 'M', `as % of ${/Gov$/.test(marginOf) ? 'GOV' : 'revenue'}`, '%', () => `IFERROR({${f}}/{${marginOf}},"")`, { fmt: 'pct', italic: true, indent: 1 });
      if (f === 'imStores') L('imStoresAdd', 'stores added in quarter', 'nos', i => (i ? `IFERROR({imStores}-{imStores@p},"")` : null), { italic: true, indent: 1 });
    }
  }
  if (has('foodGov') && has('imGov')) { S.push({ band: '5   MIX', level: 0 }); L('imShare', 'Instamart as % of food + Instamart GOV', '%', () => `IFERROR({imGov}/({imGov}+{foodGov}),"")`, { fmt: 'pct' }); }
  let rr = 5; for (const s of S) s._row = rr++;
  const rowOf = k => S.find(x => x.key === k)._row;
  for (const s of S) if (s.yoyKey) { const k = s.yoyKey; s.hv = i => (i >= 4 ? `IFERROR({${k}}/${colL(2 + i - 4)}${rowOf(k)}-1,"")` : null); }
  writeRows(ws, S, { labels: ql, nH: n, C0: 2, startRow: 5, ncol: 2 + n });
}

// Valuation summary: intrinsic value (DCF / SOTP, linked) and relative multiples on Model forecasts,
// each with Base / Bull / Bear multiples and a weight; the weighted blend is the target price.
function buildValuationSheet(wb, M, { R, nH, years, col, intrinsic }) {
  const B = M.forecast.assumptions.valuation.blend;
  const ws = wb.addWorksheet('Valuation', { views: [{ showGridLines: false, state: 'frozen', xSplit: 1, ySplit: 4 }], properties: { tabColor: { argb: 'FF0D1F44' } } });
  title(ws, `${M.meta.name}: Valuation summary (target price = weighted blend of methods)`, 'Intrinsic value is linked from the DCF / SOTP sheet; relative values use the Model forecasts. Multiples and weights in blue on yellow; live column follows the Scenario switch.');
  [40, 26, 13, 9, 9, 9, 10, 12, 9, 12, 70].forEach((w, i) => (ws.getColumn(i + 1).width = w));
  const ROLES = B.methods.some(m => m.role);
  header(ws, 4, ['Method', 'Metric', 'Metric value', 'Base', 'Bull', 'Bear', 'Live multiple', 'Value / share (₹)', ROLES ? 'Role' : 'Weight', ROLES ? 'vs target' : 'Weighted (₹)', 'Why this method / multiple'], null);
  const fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: INPUT } };
  const inp = (cell, val, fmt) => { const c = ws.getCell(cell); c.value = val; c.font = { color: { argb: BLUE }, bold: true }; c.fill = fill; c.numFmt = FMT[fmt]; };
  if (!R) { // stand-alone workbook (no live Model): own scenario switch and price
    ws.getCell('A3').value = 'Scenario (1 = Base, 2 = Bull, 3 = Bear)'; inp('C3', 1, 'num'); wb.definedNames.add('Valuation!$C$3', 'Scenario');
    ws.getCell('E3').value = 'CMP (₹)'; inp('F3', M.price.last, 'num'); wb.definedNames.add('Valuation!$F$3', 'CMP');
  }
  const rowKey = { pe: 'eps', pb: 'rBvps', evEbitda: 'ebitda', evSales: 'sales' };
  const BV = M.forecast.dcf.blend;
  // stand-alone sheets: each scenario's own forecast metric / intrinsic value (from the engine)
  const sv = (bm, field, kase) => { const src = kase === 'base' ? BV : M.forecast.scenarios[kase]?.blend; const x = src?.methods.find(y => y.key === bm.key)?.[field]; return Math.round((x ?? bm[field]) * 1e6) / 1e6; };
  const metricLabel = { pe: 'EPS', pb: 'Book value / share', evEbitda: 'EBITDA', evSales: 'Revenue', evGov: 'Gross order value (GOV)' };
  let r = 5; const first = r; let primRow = null;
  for (const m of B.methods) {
    ws.getCell(`A${r}`).value = m.name; ws.getCell(`A${r}`).font = { bold: true };
    const bm = BV.methods.find(x => x.key === (m.key || m.method));
    if (['dcf', 'sotp', 'ri'].includes(m.method)) {
      ws.getCell(`B${r}`).value = { dcf: 'DCF value, rolled to 12 months', sotp: 'Sum of the parts', ri: 'Residual income (P/B–ROE), rolled to 12 months' }[m.method];
      const iv = intrinsic && typeof intrinsic === 'object' ? intrinsic[m.method] : intrinsic;
      if (iv) { ws.getCell(`H${r}`).value = { formula: iv }; ws.getCell(`H${r}`).font = { color: { argb: GREEN }, bold: true }; }
      else { ws.getCell(`H${r}`).value = { formula: `CHOOSE(Scenario,${sv(bm, 'value', 'base')},${sv(bm, 'value', 'bull')},${sv(bm, 'value', 'bear')})` }; ws.getCell(`H${r}`).font = { bold: true }; }
    } else {
      const k = Math.max(0, years.indexOf(m.year));
      const gov = (M.forecast.assumptions.segments || []).filter(s => s.driverLabel === 'GOV');
      const cell = (yr, key) => `Model!${col(nH + years.indexOf(yr))}${R[key]}`;
      const roll = (key, f = c => c) => (m.roll ? `(1-${m.roll[2]})*${f(cell(m.roll[0], key))}+${m.roll[2]}*${f(cell(m.roll[1], key))}` : f(`Model!${col(nH + k)}${R[key]}`));
      const mc = !R ? null : m.method === 'evGov' ? gov.map(s => `Model!${col(nH + k)}${R['d_' + s.key]}`).join('+') : roll(rowKey[m.method]);
      ws.getCell(`B${r}`).value = `${metricLabel[m.method]} ${m.year}${m.roll ? ` (${Math.round((1 - m.roll[2]) * 100)}% ${m.roll[0]} + ${Math.round(m.roll[2] * 100)}% ${m.roll[1]})` : ''}`;
      if (mc) { ws.getCell(`C${r}`).value = { formula: mc }; ws.getCell(`C${r}`).font = { color: { argb: GREEN } }; }
      else { ws.getCell(`C${r}`).value = { formula: `CHOOSE(Scenario,${sv(bm, 'metric', 'base')},${sv(bm, 'metric', 'bull')},${sv(bm, 'metric', 'bear')})` }; } ws.getCell(`C${r}`).numFmt = m.method === 'pe' || m.method === 'pb' ? FMT.d1 : FMT.num;
      inp(`D${r}`, m.multiple.base, 'd1'); inp(`E${r}`, m.multiple.bull ?? m.multiple.base, 'd1'); inp(`F${r}`, m.multiple.bear ?? m.multiple.base, 'd1');
      ws.getCell(`G${r}`).value = { formula: `CHOOSE(Scenario,D${r},E${r},F${r})` }; ws.getCell(`G${r}`).numFmt = FMT.x; ws.getCell(`G${r}`).font = { bold: true };
      const nc = R ? `(${m.roll ? `(1-${m.roll[2]})*Model!${col(nH + years.indexOf(m.roll[0]))}${R.treasury}+${m.roll[2]}*Model!${col(nH + years.indexOf(m.roll[1]))}${R.treasury}` : `Model!${col(nH + k)}${R.treasury}`})` : '0';
      ws.getCell(`H${r}`).value = { formula: m.method.startsWith('ev') ? `(C${r}*G${r}+${nc})/Shares` : `C${r}*G${r}` };
    }
    ws.getCell(`H${r}`).numFmt = FMT.num;
    if (ROLES) { ws.getCell(`I${r}`).value = m.role === 'primary' ? 'PRIMARY' : 'cross-check'; ws.getCell(`I${r}`).font = { bold: m.role === 'primary', color: { argb: m.role === 'primary' ? NAVY : MUTED } }; if (m.role === 'primary') primRow = r; }
    else { inp(`I${r}`, m.weight, 'pct'); ws.getCell(`J${r}`).value = { formula: `H${r}*I${r}` }; ws.getCell(`J${r}`).numFmt = FMT.num; }
    ws.getCell(`K${r}`).value = m.why || ''; ws.getCell(`K${r}`).font = { size: 9 }; ws.getCell(`K${r}`).alignment = { wrapText: true, vertical: 'middle' };
    ws.getRow(r).height = 30; r++;
  }
  const last = r - 1; r++;
  const tot = (label, f, fmt, nm) => { ws.getCell(`A${r}`).value = label; ws.getCell(`A${r}`).font = { bold: true }; const c = ws.getCell(`J${r}`); c.value = { formula: f }; c.numFmt = FMT[fmt]; c.font = { bold: true }; if (nm) wb.definedNames.add(`Valuation!$J${r}`, nm); return r++; };
  let tp;
  if (ROLES) {
    tp = tot(`12-month target price = primary method, rounded to ₹${B.round || 10}`, `ROUND(H${primRow}/${B.round || 10},0)*${B.round || 10}`, 'num', 'TargetPrice');
    for (let x = first; x <= last; x++) { ws.getCell(`J${x}`).value = { formula: `H${x}/TargetPrice-1` }; ws.getCell(`J${x}`).numFmt = FMT.pct; }
  } else {
    tot('Weights (should total 100%)', `SUM(I${first}:I${last})`, 'pct');
    const bv = tot('Blended value per share', `SUMPRODUCT(H${first}:H${last},I${first}:I${last})/SUM(I${first}:I${last})`, 'num');
    tp = tot(`12-month target price (rounded to ₹${B.round || 10})`, `ROUND(J${bv}/${B.round || 10},0)*${B.round || 10}`, 'num', 'TargetPrice');
  }
  ws.getCell(`J${tp}`).fill = fill;
  tot('Upside / (downside) vs CMP', 'TargetPrice/CMP-1', 'pct', 'Upside');
  if (R) tot('Implied P/E on ' + years[1] + ' EPS', `TargetPrice/Model!${col(nH + 1)}${R.eps}`, 'x');
  r++;
  ws.getCell(`A${r}`).value = 'Relative values: P/E and P/B = metric × multiple; EV/EBITDA and EV/sales add that year\'s net cash (negative = net debt) and divide by shares.';
  ws.getCell(`A${r}`).font = { italic: true, size: 9, color: { argb: MUTED } };
}

module.exports = { buildOperatingModel, buildValuationSheet, writeRows, header, title, band, colL, FMT }; // helpers shared with excel-lender.js
