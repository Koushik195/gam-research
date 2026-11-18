// Live, formula-driven workbook for lenders (NBFCs first; banks to follow). Mirrors
// src/forecast-lender.js exactly, so TargetPrice reproduces the engine's base / bull / bear targets.
//   Assumptions – every driver (blue on yellow) with a Base/Bull/Bear switch, balance-sheet ratios
//                 (default = FY26 actual, green), valuation inputs
//   Model       – 1 AUM → 2 P&L (NII → PPOP → provisions → PAT) → 3 balance sheet → 4 funding solver
//                 → 5 ratios. History hard-coded (blue), forecasts are formulas (black), links (green).
//   Valuation   – P/B, P/E, justified P/B, residual income; TargetPrice / Upside; sensitivities
//   KPIs, Quarterly, Quarterly history, Cash Flow (reported)
const { writeRows, header, title, band, colL, FMT } = require('./excel-model');
const { lenderHistory, baseOf } = require('./forecast-lender');
const S2 = require('./excel-lender-sheets');

const NAVY = 'FF0D1F44', BLUE = 'FF0000FF', GREEN = 'FF007A33', INPUT = 'FFFFF2CC', MUTED = 'FF6B7280';
const isNum = v => typeof v === 'number' && Number.isFinite(v);
const at = (arr, i) => (Array.isArray(arr) ? arr[Math.min(i, arr.length - 1)] : arr);

function buildAssumptions(wb, M, ctx) {
  const as = M.forecast.assumptions, F = M.forecast.F, v = as.valuation || {}, sc = as.scenarios || {};
  const { years, B } = ctx, nF = years.length;
  const yc = i => colL(2 + i), bullC = colL(2 + nF + 1), bearC = colL(2 + nF + 2), whyC = colL(2 + nF + 3);
  const wa = wb.addWorksheet('Assumptions', { views: [{ showGridLines: false, state: 'frozen', xSplit: 1, ySplit: 9 }], properties: { tabColor: { argb: 'FFC6A44E' } } });
  title(wa, `${M.meta.name}: Model assumptions (lender)`, 'Change the blue cells on yellow: the Model, Valuation and cover recalculate. Green = default taken from FY26 actuals (overwrite to change). Black = formula.');
  wa.getColumn(1).width = 58; wa.getColumn(2).width = 9;
  years.forEach((_, i) => (wa.getColumn(3 + i).width = 12));
  wa.getColumn(3 + nF).width = 3; wa.getColumn(4 + nF).width = 10; wa.getColumn(5 + nF).width = 10; wa.getColumn(6 + nF).width = 95;
  const input = (cell, val, fmt) => { const c = wa.getCell(cell); c.value = val; c.font = { color: { argb: BLUE }, bold: true }; c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: INPUT } }; if (fmt) c.numFmt = FMT[fmt]; return c; };
  const name = (ref, nm) => wb.definedNames.add(`Assumptions!${ref}`, nm);
  wa.getCell('A4').value = 'Scenario (1 = Base, 2 = Bull, 3 = Bear)'; input('B4', 1); name('$B$4', 'Scenario');
  wa.getCell('C4').value = { formula: 'CHOOSE(Scenario,"Base case","Bull case","Bear case")' }; wa.getCell('C4').font = { bold: true, color: { argb: NAVY } };
  wa.getCell('A5').value = `Current market price, CMP (₹, ${M.price.lastDate})`; input('B5', M.price.last, 'num'); name('$B$5', 'CMP');
  wa.getCell('A6').value = `Shares outstanding, end-${B.fy} (crore; attributable profit ÷ EPS)`; input('B6', F.shares, 'd2'); name('$B$6', 'Shares');
  wa.getCell('A7').value = '₹ crore unless stated. Percent inputs are entered as numbers (15 = 15%). Average AUM = (opening + closing) ÷ 2.'; wa.getCell('A7').font = { italic: true, size: 9, color: { argb: MUTED } };
  header(wa, 9, ['Driver', 'Unit', ...years, '', 'Bull Δ', 'Bear Δ', 'Why (GAM Research view)'], null);
  const AR = {};
  let r = 10;
  const why = k => as[`_${k}Why`] || '';
  const dz = (s, k) => (isNum(s?.[k]) ? s[k] : 0);
  const drivers = [
    ['aumGrowth', 'AUM growth', '%', as.aumGrowth, 'aumGrowthDelta'],
    ['yieldOnAum', 'Yield on average AUM (interest income ÷ average AUM)', '%', as.yieldOnAum, 'yieldDelta'],
    ['feeIncomePct', 'Fee, commission & other operating income, % of average AUM', '%', as.feeIncomePct ?? 0, 'feeDelta'],
    ['costOfFunds', 'Cost of funds (interest expense ÷ average borrowings)', '%', as.costOfFunds, 'cofDelta'],
    ['opexPct', 'Operating expenses incl. depreciation, % of average AUM', '%', as.opexPct, 'opexDelta'],
    ['creditCost', 'Credit cost (provisions ÷ average AUM)', '%', as.creditCost, 'creditCostDelta'],
    ['taxRate', 'Tax rate', '%', as.taxRate, null],
    ['payout', 'Dividend payout (on attributable EPS)', '%', as.payout ?? 0, 'payoutDelta'],
    ['otherIncome', 'Other income (non-operating)', '₹ cr', as.otherIncome ?? 0, null],
    ['capitalRaise', 'Equity raised (QIP / rights issue)', '₹ cr', as.capitalRaise ?? 0, null],
    ['newShares', 'New shares issued', 'crore', as.newShares ?? 0, null],
  ];
  const fmtOf = u => (u === '%' ? 'd2' : u === 'crore' ? 'd2' : 'num');
  const setRowH = (row, w) => { wa.getRow(row).height = w && w.length > 120 ? 42 : w && w.length > 70 ? 28 : 15; };
  band(wa, r++, 'Growth, spread, cost and credit drivers (base case + scenario adjustments)', 6 + nF, 1);
  for (const [key, label, unit, vals, dk] of drivers) {
    wa.getCell(`A${r}`).value = label; wa.getCell(`B${r}`).value = unit;
    years.forEach((_, i) => input(`${yc(i)}${r}`, at(vals, i), fmtOf(unit)));
    input(`${bullC}${r}`, dk ? dz(sc.bull, dk) : 0, 'd2'); input(`${bearC}${r}`, dk ? dz(sc.bear, dk) : 0, 'd2');
    wa.getCell(`${whyC}${r}`).value = why(key); wa.getCell(`${whyC}${r}`).alignment = { wrapText: true, vertical: 'middle' }; wa.getCell(`${whyC}${r}`).font = { size: 9 };
    setRowH(r, why(key));
    AR[key] = { base: r, scen: true, unit }; r++;
  }
  const bs = as.bs || {};
  const derived = [
    ['minorityPct', 'Minority interest, % of net profit', '%', as.minorityPct, 'FY26 actual (Screener minority share ÷ net profit).'],
    ['loansPct', 'Loans & other assets, % of AUM', '%', bs.loansPctOfAum, 'FY26 actual. On-book loans net of provisions plus other assets, relative to AUM.'],
    ['liqPct', 'Cash & investments (liquidity), % of AUM', '%', bs.liquidityPctOfAum, 'FY26 actual.'],
    ['fixedPct', 'Fixed assets incl. CWIP, % of AUM', '%', bs.fixedPctOfAum, 'FY26 actual.'],
    ['olPct', 'Other liabilities & provisions (incl. minority interest), % of AUM', '%', bs.otherLiabPctOfAum, 'FY26 actual. Borrowings are the balancing item.'],
    ['depShare', 'Depreciation, % of operating expenses', '%', as.depShareOfOpex, 'FY26 actual.'],
  ];
  r++;
  band(wa, r++, 'Balance-sheet ratios and minorities (default = FY26 actual; overwrite to change)', 6 + nF, 1);
  for (const [key, label, unit, override, note] of derived) {
    wa.getCell(`A${r}`).value = label; wa.getCell(`B${r}`).value = unit;
    if (override != null) years.forEach((_, i) => input(`${yc(i)}${r}`, at(override, i), 'd2'));
    wa.getCell(`${whyC}${r}`).value = override != null ? (as[`_${key}Why`] || 'GAM Research input.') : note; wa.getCell(`${whyC}${r}`).font = { size: 9 };
    AR[key] = { base: r, unit, override: override != null }; r++;
  }
  r++;
  band(wa, r++, 'Live drivers used by the Model (= base + scenario adjustment)', 6 + nF, 1);
  for (const [key, label, unit] of [...drivers, ...derived]) {
    wa.getCell(`A${r}`).value = label; wa.getCell(`B${r}`).value = unit;
    years.forEach((_, i) => {
      const c = yc(i), cell = wa.getCell(`${c}${r}`);
      cell.value = { formula: `${c}${AR[key].base}${AR[key].scen ? `+CHOOSE(Scenario,0,$${bullC}$${AR[key].base},$${bearC}$${AR[key].base})` : ''}` };
      cell.numFmt = FMT[fmtOf(unit)]; cell.font = { bold: true };
    });
    AR[key].live = r; r++;
  }
  r++;
  band(wa, r++, 'Valuation inputs (cost of equity, justified P/B, residual income)', 6 + nF, 1);
  const scal = (label, val, fmt, w, nm) => { wa.getCell(`A${r}`).value = label; input(`B${r}`, val, fmt); wa.getCell(`${whyC}${r}`).value = w || ''; wa.getCell(`${whyC}${r}`).font = { size: 9 }; if (nm) name(`$B$${r}`, nm); return r++; };
  const fx = (label, f, fmt, nm, w) => { wa.getCell(`A${r}`).value = label; const c = wa.getCell(`B${r}`); c.value = { formula: f }; c.numFmt = FMT[fmt]; c.font = { bold: true }; if (w) { wa.getCell(`${whyC}${r}`).value = w; wa.getCell(`${whyC}${r}`).font = { size: 9 }; } if (nm) name(`$B$${r}`, nm); return r++; };
  if (isNum(v.ke)) scal('Cost of equity, %', v.ke, 'd2', v._keWhy || 'Entered directly.', 'Ke');
  else {
    scal('Risk-free rate (10-year G-sec), %', v.rf, 'd2', 'Indian 10-year government bond yield.', 'RiskFree');
    scal('Beta', v.beta, 'd2', v._betaWhy || '', 'Beta');
    scal('Equity risk premium, %', v.erp, 'd2', 'India equity risk premium.', 'ERP');
    fx('Cost of equity = risk-free + beta × ERP, %', 'RiskFree+Beta*ERP', 'd2', 'Ke');
  }
  scal('Long-run growth g in the justified P/B, %', isNum(v.g) ? v.g : v.terminalGrowth, 'd2', 'Justified P/B = (sustainable ROE − g) ÷ (Ke − g). g must be below Ke.', 'GrowthG');
  const sr = r;
  wa.getCell(`A${r}`).value = 'Sustainable (long-run) ROE, % — Base / Bull / Bear in B / G / H; C = live';
  const sBase = isNum(v.sustainableRoe) ? v.sustainableRoe : null;
  // No sustainable ROE given: the engine uses the last forecast year's ROE (linked after the Model is built).
  ctx.sustLink = [];
  if (sBase != null) input(`B${r}`, sBase, 'd2'); else ctx.sustLink.push(`B${r}`);
  for (const [k, c] of [['bull', bullC], ['bear', bearC]]) { if (isNum(sc[k]?.sustainableRoe)) input(`${c}${r}`, sc[k].sustainableRoe, 'd2'); else if (sBase != null) input(`${c}${r}`, sBase, 'd2'); else ctx.sustLink.push(`${c}${r}`); }
  wa.getCell(`C${r}`).value = { formula: `CHOOSE(Scenario,B${r},${bullC}${r},${bearC}${r})` }; wa.getCell(`C${r}`).numFmt = FMT.d2; wa.getCell(`C${r}`).font = { bold: true }; name(`$C$${r}`, 'SustRoe');
  wa.getCell(`${whyC}${r}`).value = v._roeWhy || 'Used by the justified P/B and as the residual-income fade target.'; wa.getCell(`${whyC}${r}`).font = { size: 9 }; r++;
  scal('Residual income: terminal growth, %', v.terminalGrowth, 'd2', 'Growth of residual income after the fade period.', 'TermGrowth');
  scal('Residual income: years over which ROE fades to the sustainable level', v.fadeYears || 8, 'num', 'Linear fade after the last forecast year.', 'FadeYears');
  scal('Residual income: long-run payout, %', v.payoutTo || 30, 'd2', 'Payout rises linearly to this level over the fade period.', 'PayoutTo');
  scal('Residual income: book-value uplift per share, ₹', v.bookUpliftPerShare || 0, 'd2', 'Adjustment to the opening book (normally 0).', 'BookUplift');
  scal('Months to roll the value forward to the 12-month target', v.rollForwardMonths ?? 6, 'num', `Residual income is valued at end-${years[0]}; target date is 12 months after the as-of date.`, 'RollMonths');
  wa.getCell(`A${r}`).value = `Residual-income horizon: ${v.years || 15} years (structure of the Valuation sheet; change it in assumptions.json).`; wa.getCell(`A${r}`).font = { italic: true, size: 9, color: { argb: MUTED } };
  ctx.sustRow = sr;
  return { wa, AR, input };
}

function buildModelSheet(wb, M, ctx) {
  const A = M.annual, { H, years, hist, nH, nF, labels, C0, col, AR } = ctx;
  const notes = M.research?.initiation?.statementNotes || {};
  const wm = wb.addWorksheet('Model', { views: [{ showGridLines: false, state: 'frozen', xSplit: 2, ySplit: 4, zoomScale: 90 }], properties: { tabColor: { argb: 'FF2B5CA6' }, outlineProperties: { summaryBelow: true } } });
  title(wm, `${M.meta.name}: Integrated lender model (₹ crore)`, `${M.meta.basis === 'standalone' ? 'Standalone' : 'Consolidated'} · history ${hist[0]}–${hist[nH - 1]} as reported (blue) · ${years[0]}–${years[nF - 1]} formulas driven by the Assumptions sheet · AUM, provisions and fee income from company disclosures.`);
  wm.getColumn(1).width = 62; wm.getColumn(2).width = 7;
  labels.forEach((_, i) => (wm.getColumn(C0 + 1 + i).width = 11));
  header(wm, 4, ['₹ crore', 'Unit', ...labels], C0 + 1 + nH);
  wm.getCell('C3').value = 'Reported →'; wm.getCell('C3').font = { size: 9, italic: true, color: { argb: MUTED } };
  wm.getCell(`${col(nH)}3`).value = 'GAM estimates →'; wm.getCell(`${col(nH)}3`).font = { size: 9, italic: true, bold: true, color: { argb: 'FF9A6A10' } };
  const aL = (key, i) => `Assumptions!${colL(2 + (i - nH))}$${AR[key].live}`;
  const S = [];
  const bandRow = (t, level = 0) => S.push({ band: t, level });
  const L = (key, label, unit, hv, fv, opt = {}) => S.push({ key, label, unit, hv, fv, ...opt });
  const note = t => S.push({ note: t });
  const DEP = (A.deposits || []).some(v => isNum(v) && v);
  const ratio = (key, label, unit, f, fmt, first = 0, opt = {}) => L(key, label, unit, i => (i >= first ? `IFERROR(${f(i)},"")` : null), f, { fmt, ...opt });

  bandRow('1   BALANCE-SHEET GROWTH');
  L('aum', 'Assets under management (AUM), year-end', '₹ cr', H.aum, i => `{aum@p}*(1+${aL('aumGrowth', i)}/100)`, { bold: true });
  L('aumG', 'AUM growth', '%', i => (i ? `IFERROR({aum}/{aum@p}-1,"")` : null), i => '{aum}/{aum@p}-1', { fmt: 'pct', italic: true, indent: 1 });
  L('avgAum', 'Average AUM = (opening + closing) ÷ 2', '₹ cr', i => (i ? 'IF(COUNT({aum@p},{aum})=2,AVERAGE({aum@p},{aum}),"")' : null), i => 'AVERAGE({aum@p},{aum})');

  bandRow('2   PROFIT & LOSS');
  L('interestIncome', 'Interest income', '₹ cr', i => (H.feeKnown ? 'IF(ISNUMBER({feeIncome}),{sales}-{feeIncome},"")' : '{sales}-{feeIncome}'), i => `${aL('yieldOnAum', i)}/100*{avgAum}`, { indent: 1 });
  L('feeIncome', 'Fees, commission & other operating income', '₹ cr', H.feeIncome, i => `${aL('feeIncomePct', i)}/100*{avgAum}`, { indent: 1 });
  L('sales', 'Total income from operations (Screener: Revenue)', '₹ cr', A.sales, i => '{interestIncome}+{feeIncome}', { bold: true, total: true });
  L('salesG', 'Total income growth', '%', i => (i ? 'IFERROR({sales}/{sales@p}-1,"")' : null), i => '{sales}/{sales@p}-1', { fmt: 'pct', italic: true, indent: 1 });
  L('interest', 'Interest expense (finance cost) = cost of funds × average borrowings', '₹ cr', A.interest, i => `${aL('costOfFunds', i)}/100*AVERAGE({borrowings@p},{borrowings})`);
  L('nii', 'Net interest income (NII)', '₹ cr', i => 'IFERROR({interestIncome}-{interest},"")', i => '{interestIncome}-{interest}', { bold: true });
  L('nti', 'Net total income (NII + fees = Revenue − interest)', '₹ cr', i => '{sales}-{interest}', i => '{sales}-{interest}', { bold: true, total: true });
  L('opexExDep', 'Operating expenses excl. depreciation', '₹ cr', i => 'IF(ISNUMBER({provisions}),{expenses}-{provisions},"")', i => '{opex}-{dep}', { indent: 1 });
  L('dep', 'Depreciation', '₹ cr', A.dep, i => `{opex}*${aL('depShare', i)}/100`, { indent: 1 });
  L('opex', 'Operating expenses incl. depreciation', '₹ cr', i => 'IFERROR({opexExDep}+{dep},"")', i => `${aL('opexPct', i)}/100*{avgAum}`, { total: true });
  L('cti', 'Cost-to-income (operating expenses ÷ net total income)', '%', i => 'IFERROR({opex}/{nti},"")', i => '{opex}/{nti}', { fmt: 'pct', italic: true, indent: 1 });
  L('ppop', 'Pre-provision operating profit (PPOP)', '₹ cr', i => 'IFERROR({nti}-{opex},"")', i => '{nti}-{opex}', { bold: true });
  L('provisions', 'Provisions & write-offs (impairment on financial instruments)', '₹ cr', H.provisions, i => `${aL('creditCost', i)}/100*{avgAum}`);
  L('otherIncome', 'Other income (non-operating, incl. exceptional items)', '₹ cr', A.otherIncome, i => `${aL('otherIncome', i)}`);
  L('pbt', 'Profit before tax', '₹ cr', A.pbt, i => '{ppop}-{provisions}+{otherIncome}', { bold: true, total: true });
  L('tax', 'Tax', '₹ cr', i => '{pbt}-{pat}', i => `{pbt}*${aL('taxRate', i)}/100`);
  L('taxR', 'Effective tax rate', '%', i => 'IFERROR({tax}/{pbt},"")', i => '{tax}/{pbt}', { fmt: 'pct', italic: true, indent: 1 });
  L('pat', 'Net profit (consolidated; Screener: Net Profit)', '₹ cr', A.pat, i => '{pbt}-{tax}', { bold: true, total: true });
  L('patG', 'Net profit growth', '%', i => (i ? 'IFERROR({pat}/{pat@p}-1,"")' : null), i => '{pat}/{pat@p}-1', { fmt: 'pct', italic: true, indent: 1 });
  L('minority', 'Minority interest (outside shareholders of subsidiaries)', '₹ cr', H.minority, i => `{pat}*${aL('minorityPct', i)}/100`, { indent: 1 });
  L('patAttrib', 'Net profit attributable to shareholders', '₹ cr', i => '{pat}-N({minority})', i => '{pat}-{minority}', { bold: true });
  L('shares', 'Shares outstanding', 'crore', i => 'IFERROR({patAttrib}/{eps},"")', i => (i === nH ? `Shares+${aL('newShares', i)}` : `{shares@p}+${aL('newShares', i)}`), { fmt: 'd2' });
  L('eps', 'Earnings per share (EPS)', '₹', A.eps, i => '{patAttrib}/{shares}', { fmt: 'd2', bold: true });
  L('epsG', 'EPS growth', '%', i => (i ? 'IFERROR({eps}/{eps@p}-1,"")' : null), i => '{eps}/{eps@p}-1', { fmt: 'pct', italic: true, indent: 1 });
  L('dps', 'Dividend per share (DPS)', '₹', A.dps, i => `{eps}*${aL('payout', i)}/100`, { fmt: 'd2' });
  L('dividends', 'Dividends (DPS × shares)', '₹ cr', i => 'IFERROR({dps}*{shares},"")', i => '{dps}*{shares}', { italic: true });
  bandRow('Tie-out to the Screener lines', 1);
  L('expenses', 'Screener "Expenses" = operating expenses excl. depreciation + provisions', '₹ cr', A.expenses, i => '{opexExDep}+{provisions}', { italic: true, indent: 1 });
  L('fp', 'Screener "Financing Profit" = Revenue − interest − Expenses', '₹ cr', i => '{sales}-{interest}-{expenses}', i => '{sales}-{interest}-{expenses}', { italic: true, indent: 1 });
  L('pbtChk', 'Check: PPOP − provisions + other income − PBT (0; ±1 = rounding)', '₹ cr', i => 'IFERROR(ROUND({ppop}-{provisions}+{otherIncome}-{pbt},0),"")', i => 'ROUND({ppop}-{provisions}+{otherIncome}-{pbt},0)', { check: true });

  bandRow('3   BALANCE SHEET');
  bandRow('Equity & liabilities', 1);
  L('eqcap', 'Equity share capital', '₹ cr', A.equity, i => '{eqcap@p}', { indent: 1 });
  L('reserves', 'Reserves & surplus', '₹ cr', A.reserves, i => '{netWorth}-{eqcap}', { indent: 1 });
  L('netWorth', "Net worth (shareholders' funds)", '₹ cr', i => '{eqcap}+{reserves}', i => `{netWorth@p}+{patAttrib}-{dividends}+${aL('capitalRaise', i)}`, { bold: true, total: true });
  if (DEP) {
    L('borrowRep', 'Borrowings', '₹ cr', A.borrowings, null, { indent: 1, outline: true });
    L('deposits', 'Deposits', '₹ cr', A.deposits, null, { indent: 1, outline: true });
  }
  L('borrowings', `${DEP ? 'Borrowings + deposits' : 'Borrowings'} (forecast: the balancing item, from the funding block)`, '₹ cr', DEP ? i => 'N({borrowRep})+N({deposits})' : ctx.H.borrowings, i => '{fundK}-{retR}*{patSolved}', { bold: true });
  L('otherLiab', 'Other liabilities & provisions (incl. minority interest)', '₹ cr', A.otherLiab, i => `{aum}*${aL('olPct', i)}/100`);
  L('tl', 'TOTAL EQUITY & LIABILITIES', '₹ cr', i => '{netWorth}+{borrowings}+{otherLiab}', i => '{netWorth}+{borrowings}+{otherLiab}', { bold: true, total: true });
  bandRow('Assets', 1);
  L('loans', 'Loans & other assets (net of provisions)', '₹ cr', i => '{totalAssets}-{liquidity}-{fixedAssets}', i => `{aum}*${aL('loansPct', i)}/100`);
  L('investments', 'Investments', '₹ cr', A.investments, null, { indent: 1, outline: true });
  L('cash', 'Cash & bank balances', '₹ cr', A.cash, null, { indent: 1, outline: true });
  L('liquidity', 'Cash & investments (liquidity)', '₹ cr', i => 'N({investments})+N({cash})', i => `{aum}*${aL('liqPct', i)}/100`);
  L('fixedAssets', 'Fixed assets incl. capital work in progress', '₹ cr', H.fixedAssets, i => `{aum}*${aL('fixedPct', i)}/100`);
  L('totalAssets', 'TOTAL ASSETS', '₹ cr', A.totalAssets, i => '{loans}+{liquidity}+{fixedAssets}', { bold: true, total: true });
  L('check', 'Balance check: assets − liabilities (0; ±1 = rounding in reported totals)', '₹ cr', i => 'ROUND({totalAssets}-{tl},0)', i => 'ROUND({totalAssets}-{tl},0)', { check: true });

  bandRow('4   FUNDING: interest on average borrowings without a circular reference');
  note('Interest depends on closing borrowings, which depend on the profit kept in the business that year. Solving the two equations together gives net profit directly; borrowings then follow.');
  L('fundK', 'Borrowings needed before this year\'s retained profit (K) = total assets − other liabilities − opening net worth − equity raised', '₹ cr', null, i => `{totalAssets}-{otherLiab}-{netWorth@p}-${aL('capitalRaise', i)}`, { italic: true });
  L('retR', 'Net worth retained per ₹1 of net profit (r) = (1 − minority %) × (1 − payout)', 'x', null, i => `(1-${aL('minorityPct', i)}/100)*(1-${aL('payout', i)}/100)`, { fmt: 'd3', italic: true });
  L('preX', 'Profit before interest expense and tax (X) = interest income + fees − opex − provisions + other income', '₹ cr', null, i => '{interestIncome}+{feeIncome}-{opex}-{provisions}+{otherIncome}', { italic: true });
  L('patSolved', 'Net profit solved = (1 − t) × [X − CoF/2 × (opening borrowings + K)] ÷ [1 − (1 − t) × CoF/2 × r]', '₹ cr', null,
    i => `(1-${aL('taxRate', i)}/100)*({preX}-${aL('costOfFunds', i)}/200*({borrowings@p}+{fundK}))/(1-(1-${aL('taxRate', i)}/100)*${aL('costOfFunds', i)}/200*{retR})`, { italic: true });
  L('avgBor', 'Average borrowings', '₹ cr', i => (i ? 'IFERROR(AVERAGE({borrowings@p},{borrowings}),"")' : null), i => 'AVERAGE({borrowings@p},{borrowings})');
  L('patChk', 'Check: solved net profit − P&L net profit (0)', '₹ cr', null, i => 'ROUND({patSolved}-{pat},2)', { check: true, fmt: 'd2' });

  bandRow('5   RATIOS & VALUATION');
  bandRow('Spread & margins (% of average AUM unless stated)', 1);
  ratio('rYield', 'Yield on average AUM', '%', i => '{interestIncome}/{avgAum}', 'pct', 1);
  ratio('rCof', 'Cost of funds (on average borrowings)', '%', i => '{interest}/{avgBor}', 'pct', 1);
  ratio('rSpread', 'Spread: yield − cost of funds', '%', i => '{rYield}-{rCof}', 'pct', 1);
  ratio('rNim', 'Net interest margin, NIM (NII ÷ average AUM)', '%', i => '{nii}/{avgAum}', 'pct', 1, { bold: true });
  ratio('rFee', 'Fees & other operating income ÷ average AUM', '%', i => 'IF(ISNUMBER({feeIncome}),{feeIncome}/{avgAum},"")', 'pct', 1);
  ratio('rNti', 'Net total income ÷ average AUM', '%', i => '{nti}/{avgAum}', 'pct', 1);
  ratio('rOpex', 'Operating expenses ÷ average AUM', '%', i => '{opex}/{avgAum}', 'pct', 1);
  ratio('rPpop', 'PPOP ÷ average AUM', '%', i => '{ppop}/{avgAum}', 'pct', 1);
  ratio('rCc', 'Credit cost: provisions ÷ average AUM', '%', i => 'IF(ISNUMBER({provisions}),{provisions}/{avgAum},"")', 'pct', 1, { bold: true });
  ratio('rRoaAum', 'Attributable profit ÷ average AUM', '%', i => '{patAttrib}/{avgAum}', 'pct', 1);
  bandRow('Returns & capital', 1);
  ratio('rRoa', 'Return on assets, ROA (attributable profit ÷ average total assets)', '%', i => '{patAttrib}/AVERAGE({totalAssets@p},{totalAssets})', 'pct', 1, { bold: true });
  ratio('rRoe', 'Return on equity, ROE (attributable profit ÷ average net worth)', '%', i => '{patAttrib}/AVERAGE({netWorth@p},{netWorth})', 'pct', 1, { bold: true });
  ratio('rLev', 'Leverage: AUM ÷ net worth', 'x', i => '{aum}/{netWorth}', 'd2');
  ratio('rTaNw', 'Total assets ÷ net worth', 'x', i => '{totalAssets}/{netWorth}', 'd2');
  ratio('rEqAum', 'Net worth ÷ AUM (capital proxy)', '%', i => '{netWorth}/{aum}', 'pct');
  ratio('rDe', 'Borrowings ÷ net worth', 'x', i => '{borrowings}/{netWorth}', 'd2');
  bandRow('Growth', 1);
  ratio('rNiiG', 'NII growth', '%', i => '{nii}/{nii@p}-1', 'pct', 1);
  ratio('rPpopG', 'PPOP growth', '%', i => '{ppop}/{ppop@p}-1', 'pct', 1);
  ratio('rBvpsG', 'Book value per share growth', '%', i => '{rBvps}/{rBvps@p}-1', 'pct', 1);
  bandRow('Per share & valuation at CMP', 1);
  ratio('rBvps', 'Book value per share (BVPS)', '₹', i => '{netWorth}/{shares}', 'd2', 0, { bold: true });
  ratio('rPay', 'Dividend payout', '%', i => '{dps}/{eps}', 'pct');
  ratio('rPe', 'P/E', 'x', i => 'IF(N({eps})>0,CMP/{eps},"n.m.")', 'x');
  ratio('rPb', 'P/B', 'x', i => 'IF(N({rBvps})>0,CMP/{rBvps},"n.m.")', 'x');
  ratio('rDy', 'Dividend yield', '%', i => '{dps}/CMP', 'pct');
  const ncol = 2 + labels.length;
  const { R, end } = writeRows(wm, S, { labels, nH, C0, startRow: 5, ncol });
  wm.getCell(`A${end + 1}`).value = 'Colour code: blue = reported (hard-coded) · black = formula · green = linked to Assumptions / named inputs · shaded columns = GAM estimates. Ratios on average balances.';
  wm.getCell(`A${end + 1}`).font = { italic: true, size: 9, color: { argb: MUTED } };
  // statement notes ("<row key>@<FY>") as cell comments on the reported columns
  for (const s of S) if (s.key) hist.forEach((l, i) => {
    const t = notes[`${s.key}@${l}`]; if (!t) return;
    wm.getRow(s.row).getCell(C0 + 1 + i).note = { texts: [{ font: { bold: true, size: 9 }, text: `${s.label}, ${l}\n` }, { font: { size: 9 }, text: String(t).replace(/\*\*/g, '') }] };
  });
  return { R };
}

function buildLenderWorkbook(wb, M, contents) {
  const A = M.annual, F = M.forecast.F, as = M.forecast.assumptions;
  const H = lenderHistory(M, as), B = baseOf(M, as, H);
  const hist = A.labels, years = F.years, nH = hist.length, nF = years.length, C0 = 2;
  const ctx = { H, B, hist, years, nH, nF, labels: [...hist, ...years], C0, col: i => colL(C0 + i) };
  const { wa, AR, input } = buildAssumptions(wb, M, ctx);
  ctx.AR = AR;
  const { R } = buildModelSheet(wb, M, ctx);
  ctx.R = R;
  // Assumption defaults from FY26 actuals in the Model (green), unless the analyst entered them.
  const bc = ctx.col(nH - 1);
  const def = {
    minorityPct: `MAX(0,Model!${bc}${R.minority})/Model!${bc}${R.pat}*100`, loansPct: `Model!${bc}${R.loans}/Model!${bc}${R.aum}*100`, liqPct: `Model!${bc}${R.liquidity}/Model!${bc}${R.aum}*100`,
    fixedPct: `Model!${bc}${R.fixedAssets}/Model!${bc}${R.aum}*100`, olPct: `Model!${bc}${R.otherLiab}/Model!${bc}${R.aum}*100`, depShare: `Model!${bc}${R.dep}/Model!${bc}${R.opex}*100`,
  };
  for (const [key, f] of Object.entries(def)) if (!AR[key].override) years.forEach((_, i) => { const c = wa.getCell(`${colL(2 + i)}${AR[key].base}`); c.value = { formula: f }; c.numFmt = FMT.d2; c.font = { color: { argb: GREEN } }; });
  for (const cell of ctx.sustLink || []) { const c = wa.getCell(cell); c.value = { formula: `Model!${ctx.col(nH + nF - 1)}${R.rRoe}*100` }; c.numFmt = FMT.d2; c.font = { color: { argb: GREEN } }; }
  S2.buildValuation(wb, M, ctx);
  S2.buildKpis(wb, M, ctx);
  S2.buildQuarterly(wb, M);
  S2.buildLongQuarterly(wb, M);
  S2.buildCashFlow(wb, M);
  wb.calcProperties = { fullCalcOnLoad: true };
  contents.push(['Assumptions', 'All forecast drivers (AUM growth, yield, cost of funds, opex, credit cost…) and valuation inputs, with a Base/Bull/Bear switch (inputs in blue)']);
  contents.push(['Model', 'Integrated lender model: AUM → NII → PPOP → provisions → PAT → book value → ROA/ROE; history hard-coded, forecasts formula-driven']);
  contents.push(['Valuation', 'Target price on the primary method, with P/E, justified P/B and residual-income cross-checks and sensitivities (all formulas)']);
  for (const [n, d] of [['KPIs', 'Lender KPIs: AUM, spreads, credit cost, returns, capital, plus reported KPIs from company disclosures'], ['Quarterly', 'Quarterly P&L in lender format with asset quality (gross / net NPA) and reported quarterly KPIs'], ['Quarterly history', 'Long-run quarterly revenue and margins'], ['Cash Flow (reported)', 'Annual cash flow as reported (loan growth sits in operating cash flow)']])
    if (wb.getWorksheet(n)) contents.push([n, d]);
  return { R, AR };
}

module.exports = { buildLenderWorkbook };
