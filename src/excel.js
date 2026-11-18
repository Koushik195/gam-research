// Excel export: the company's full numbers in a formatted workbook.
// Sheets: Cover · P&L · Balance Sheet · Cash Flow · Ratios · Quarterly · Quarterly history ·
//         KPIs · Forecast & DCF · Valuation history · Shareholding.
// Generic: line items come from whatever the company's source data contains (Screener
// statements + their line-item breakdowns); KPIs come from the company's research files.
// The "why" notes behind material moves (initiation.statementNotes) become cell comments.
const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');
const { buildOperatingModel } = require('./excel-model');

const ROOT = path.join(__dirname, '..');
const NAVY = 'FF0D1F44', GOLD = 'FFC6A44E', CREAM = 'FFFBF6E8', EST = 'FFFDF3DC', SEC = 'FFEFE8D6', UP = 'FFDCF1E4', DN = 'FFFBDFE0', GRIDC = 'FFE7E2D3';
const isNum = v => typeof v === 'number' && Number.isFinite(v);
// Indian digit grouping (1,23,45,678) for crore amounts.
const FMT = {
  num: '[>=10000000]##\\,##\\,##\\,##0;[>=100000]##\\,##\\,##0;##,##0',
  neg: '#,##0;[Red]-#,##0',
  d1: '#,##0.0;[Red]-#,##0.0', d2: '#,##0.00;[Red]-#,##0.00',
  pct: '0.0"%";[Red]-0.0"%"', x: '0.0"x"',
};
const readJson = f => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return null; } };

function styleHeader(row) {
  row.eachCell(c => {
    c.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 10 };
    c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: NAVY } };
    c.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
  });
  row.getCell(1).alignment = { horizontal: 'left', vertical: 'middle' };
  row.height = 20;
}
function title(ws, text, sub) {
  ws.getCell('A1').value = text;
  ws.getCell('A1').font = { name: 'Georgia', size: 14, bold: true, color: { argb: NAVY } };
  if (sub) { ws.getCell('A2').value = sub; ws.getCell('A2').font = { size: 9, italic: true, color: { argb: 'FF6B7280' } }; }
}

// A statement sheet: rows = [{label, values, fmt, bold, section, indent, noteKey}], cols = period labels.
function statementSheet(wb, name, heading, sub, cols, rows, notes = {}, estFrom = -1) {
  const ws = wb.addWorksheet(name, { views: [{ state: 'frozen', xSplit: 1, ySplit: 4 }], properties: { defaultRowHeight: 15 } });
  title(ws, heading, sub);
  const head = ws.getRow(4);
  head.values = ['₹ crore unless stated', ...cols];
  styleHeader(head);
  cols.forEach((c, j) => { if (estFrom >= 0 && j >= estFrom) head.getCell(j + 2).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2A4373' } }; });
  ws.getColumn(1).width = 38;
  cols.forEach((_, j) => (ws.getColumn(j + 2).width = 11.5));
  let r = 5;
  for (const row of rows) {
    const xr = ws.getRow(r++);
    if (row.section) {
      xr.getCell(1).value = row.section;
      for (let j = 1; j <= cols.length + 1; j++) xr.getCell(j).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: SEC } };
      xr.getCell(1).font = { bold: true, color: { argb: NAVY } };
      continue;
    }
    xr.getCell(1).value = `${'   '.repeat(row.indent || 0)}${row.label}`;
    xr.getCell(1).font = { bold: !!row.bold, size: 10, color: { argb: row.indent ? 'FF4B5563' : 'FF1A2233' } };
    cols.forEach((col, j) => {
      const c = xr.getCell(j + 2);
      const v = row.values[j];
      c.value = isNum(v) ? v : null;
      c.numFmt = FMT[row.fmt || 'num'];
      c.font = { bold: !!row.bold, size: 10 };
      if (estFrom >= 0 && j >= estFrom) c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: EST } };
      const note = row.noteKey && notes[`${row.noteKey}@${col}`];
      if (note) {
        const prev = row.values[j - (row.yoy ? 4 : 1)];
        const better = isNum(v) && isNum(prev) ? (v >= prev) !== !!row.inverse : null;
        c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: better == null ? CREAM : better ? UP : DN } };
        c.note = { texts: [{ font: { bold: true, size: 9 }, text: `${row.label}, ${col}\n` }, { font: { size: 9 }, text: note.replace(/\*\*/g, '') }] };
      }
    });
    xr.eachCell({ includeEmpty: true }, c => (c.border = { bottom: { style: 'hair', color: { argb: GRIDC } } }));
  }
  if (Object.keys(notes).length) {
    const legend = ws.getRow(r + 1).getCell(1);
    legend.value = 'Green/red cells moved materially; hover over a cell (red triangle) for the reason. Shaded columns are GAM Research estimates.';
    legend.font = { italic: true, size: 9, color: { argb: 'FF6B7280' } };
  }
  return ws;
}

// Align a schedule {period: value} to period list.
const sched = (raw, sec, parent, item, periods) => { const s = raw.schedules?.[sec]?.[parent]?.[item]; return periods.map(p => (s && isNum(s[p]) ? s[p] : null)); };
const pickRow = (t, names) => { for (const n of names) if (t?.rows?.[n]) return t.rows[n]; return null; };
const fromTable = (t, names, periods) => { const row = pickRow(t, names); return periods.map(p => { const i = t.periods.indexOf(p); return row && i >= 0 ? row[i] : null; }); };
const last = (list, k) => { const v = (list || []).filter(o => isNum(o[k])); return v.length ? v[v.length - 1][k] : null; };
const pretty = k => k.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, c => c.toUpperCase()).replace(/\bPct\b/i, '%').replace(/\bFy\b/, 'FY');

// Sector-format statements (research/statements.json): one sheet per statement, annual and quarterly,
// plus a sector ratio sheet built from the company's KPI series.
const SECTOR_SHEETS = {
  insurer: {
    revenueAccount: ['Revenue Account', 'Revenue Account (policyholders\' account)', 'The insurance P&L: premiums earned, claims, commission and expenses → underwriting result.'],
    profitLoss: ['P&L (Shareholders)', 'Profit & Loss Account (shareholders\' account)', 'Transfer from the revenue account plus shareholders\' investment income, less shareholders\' expenses → profit.'],
    balanceSheet: ['Balance Sheet', 'Balance Sheet', 'Sources and application of funds, in IRDAI format.'],
    cashFlow: ['Cash Flow', 'Cash Flow Statement (receipts & payments)', 'Direct-method cash flow as published by the insurer.'],
  },
};
const SECTOR_RATIOS = {
  insurer: [
    { section: 'Premiums' }, ['gwp', 'Gross written premium (₹ cr)', 'num', true], ['gwpGrowth', 'GWP growth (%)', 'pct'], ['nwp', 'Net written premium (₹ cr)'], ['retention', 'Retention ratio, NWP/GWP (%)', 'pct'], ['nep', 'Net earned premium (₹ cr)'], ['marketShare', 'Market share (%)', 'pct'],
    { section: 'Underwriting' }, ['lossRatio', 'Loss (claims) ratio (%)', 'pct', false, true], ['expenseRatio', 'Expense ratio (%)', 'pct', false, true], ['combinedRatio', 'Combined ratio (%)', 'pct', true, true], ['combinedRatio1n', 'Combined ratio excl. 1/n effect (%)', 'pct'], ['uwResult', 'Underwriting result (₹ cr)', 'num', true],
    { section: 'Investments' }, ['aum', 'Investment assets (₹ cr)'], ['investmentIncome', 'Investment income (₹ cr)'], ['investmentYield', 'Investment yield (%)', 'pct'],
    { section: 'Profit, capital & returns' }, ['pbt', 'Profit before tax (₹ cr)'], ['pat', 'Net profit (₹ cr)', 'num', true], ['eps', 'EPS (₹)', 'd2'], ['roe', 'ROE (%)', 'pct'], ['netWorth', 'Net worth (₹ cr)'], ['bvps', 'Book value per share (₹)', 'd1'], ['solvency', 'Solvency ratio (x)', 'd2'],
  ],
};
function sectorStatements(wb, M, ST, notes, contents) {
  const sheets = SECTOR_SHEETS[ST.sector] || {};
  const rowsOf = list => (list || []).map(r => (r.section ? { section: r.section } : { label: r.label, values: r.values || [], bold: !!r.bold, indent: r.indent || 0, fmt: r.fmt || 'neg', noteKey: r.key }));
  const basis = `${ST.basis || ''}. ${ST.unit || '₹ crore'}.`;
  for (const [key, [name, heading, sub]] of Object.entries(sheets)) {
    if (ST.annual?.[key]?.length) {
      statementSheet(wb, name, `${M.meta.name}: ${heading}, annual`, `${sub} ${basis}`, ST.annual.periods, rowsOf(ST.annual[key]), notes);
      contents.push([name, `${heading}, ${ST.annual.periods[0]}–${ST.annual.periods[ST.annual.periods.length - 1]}`]);
    }
  }
  for (const [key, [name, heading, sub]] of Object.entries(sheets)) {
    if (ST.quarterly?.[key]?.length) {
      const qname = `${name} (Q)`.slice(0, 31);
      statementSheet(wb, qname, `${M.meta.name}: ${heading}, quarterly`, `${sub} ${basis} Quarter = three months (Q1 = Apr–Jun).`, ST.quarterly.periods, rowsOf(ST.quarterly[key]), notes);
      contents.push([qname, `${heading}, ${ST.quarterly.periods[0]}–${ST.quarterly.periods[ST.quarterly.periods.length - 1]}`]);
    }
  }
  const spec = SECTOR_RATIOS[ST.sector];
  if (spec && M.kfin) {
    const cols = M.kfin.labels, nA = M.fin?.nActual ?? cols.length;
    const rows = spec.map(s => (s.section ? s : { label: s[1], values: (M.kfin[s[0]] || (M.fin?.[s[0]]) || []).slice(0, cols.length), fmt: s[2] || 'num', bold: !!s[3], inverse: !!s[4], noteKey: s[0] }));
    statementSheet(wb, `${ST.sector === 'insurer' ? 'Insurance' : 'Sector'} ratios`, `${M.meta.name}: Key ratios`, 'Company disclosures and GAM Research estimates (shaded).', cols, rows, notes, nA);
    contents.push([`${ST.sector === 'insurer' ? 'Insurance' : 'Sector'} ratios`, 'Premium growth, loss/expense/combined ratios, investment yield, ROE, solvency, with estimates']);
  }
  for (const n of ST.notes || []) contents.push(['', `Note: ${n}`]);
}

async function buildWorkbook(symbol) {
  const raw = readJson(path.join(ROOT, 'data', 'raw', symbol, 'screener.json'));
  const M = readJson(path.join(ROOT, 'data', 'models', `${symbol}.json`));
  if (!raw || !M) throw new Error(`No data for ${symbol}`);
  const notes = M.research?.initiation?.statementNotes || {};
  const A = M.annual, Q = M.quarterly, fin = M.fin, F = M.forecast?.F;
  const wb = new ExcelJS.Workbook();
  wb.creator = 'GAM Research'; wb.created = new Date();

  // ---------- cover ----------
  const cv = wb.addWorksheet('Cover', { views: [{ showGridLines: false }] });
  const logo = path.join(ROOT, 'assets', 'guardian-logo.png');
  if (fs.existsSync(logo)) cv.addImage(wb.addImage({ filename: logo, extension: 'png' }), { tl: { col: 0.2, row: 0.3 }, ext: { width: 90, height: 90 } });
  cv.getColumn(1).width = 16; cv.getColumn(2).width = 34; cv.getColumn(3).width = 70;
  cv.getCell('B2').value = 'GAM Research'; cv.getCell('B2').font = { name: 'Georgia', size: 18, bold: true, color: { argb: NAVY } };
  cv.getCell('B3').value = `${M.meta.name} — Financial Model`; cv.getCell('B3').font = { name: 'Georgia', size: 14, color: { argb: NAVY } };
  cv.getCell('B4').value = `Consolidated · ₹ crore · Data as of ${M.price?.lastDate || ''} · Built ${new Date(M.builtAt).toLocaleDateString('en-IN')}`; cv.getCell('B4').font = { size: 9, color: { argb: 'FF6B7280' } };
  const ic = M.research?.initiation;
  let r = 7;
  const kv = (k, v) => { cv.getCell(`B${r}`).value = k; cv.getCell(`B${r}`).font = { bold: true, size: 10 }; cv.getCell(`C${r}`).value = v; cv.getCell(`C${r}`).alignment = { wrapText: true }; r++; };
  const LENDER = M.forecast?.type === 'lender'; // NBFCs/banks: live lender workbook (src/excel-lender.js)
  const LIVE0 = LENDER || (!M.research?.statements && M.forecast && M.forecast.type !== 'insurer');
  if (ic && M.forecast) {
    kv('Rating', ic.rating);
    if (LIVE0) {
      kv('Target price (12m, live)', { formula: 'TEXT(TargetPrice,"₹#,##0")&"   ("&TEXT(Upside,"+0.0%;-0.0%")&" vs CMP ₹"&TEXT(CMP,"#,##0")&", "&Assumptions!C4&")"' });
    } else kv('Target price (12m)', `₹${M.forecast.dcf.tp.toLocaleString('en-IN')} (${M.forecast.dcf.upside.toFixed(1)}% vs CMP ₹${M.price.last.toLocaleString('en-IN')})`);
  }
  kv('Sector', (M.meta.sectorPath || []).join(' › '));
  kv('Source', 'Screener.in (consolidated statements and line-item breakdowns); company filings; GAM Research estimates and KPI research.');
  r++;
  cv.getCell(`B${r}`).value = 'Contents'; cv.getCell(`B${r}`).font = { bold: true, color: { argb: GOLD }, size: 11 }; r++;
  const contents = [];

  // Companies whose statements follow a sector format (insurers' IRDAI revenue account, banks'
  // schedules…) carry them in research/statements.json; those replace the generic Screener layout.
  const ST = M.research?.statements;
  // Operating companies with a forecast get the live, formula-driven model (Assumptions → Model → DCF).
  const LIVE = !LENDER && !ST && M.forecast && M.forecast.type !== 'insurer';
  if (LIVE) {
    buildOperatingModel(wb, { ...M, raw });
    contents.push(['Assumptions', 'All forecast drivers and valuation inputs, with a Base/Bull/Bear switch (inputs in blue)']);
    contents.push(['Model', 'Integrated model on one sheet: drivers → P&L → balance sheet → cash flow → ratios; history hard-coded, forecasts formula-driven']);
    contents.push(['DCF', 'Formula-driven FCFF, discounting, terminal value, target price and WACC × growth sensitivity']);
    contents.push(['KPIs', 'Operating KPIs: volumes, market position, per-vehicle economics, capacity, distribution (derived lines are formulas)']);
    contents.push(['Quarterly', 'Quarterly volumes and P&L with cost split, margins, YoY growth, and what moved the numbers']);
    contents.push(['Quarterly history', 'Long-run quarterly revenue and margins']);
  }
  if (LENDER) require('./excel-lender').buildLenderWorkbook(wb, { ...M, raw }, contents);
  const DET = LIVE ? ' detail' : '';
  if (ST) sectorStatements(wb, M, ST, notes, contents);
  else if (!LIVE && !LENDER) {
  // ---------- P&L ----------
  const pl = raw.tables['profit-loss'];
  const per = A.periods;
  const est = F ? F.years : [];
  const cols = [...A.labels, ...est];
  const ext = (arr, f) => [...arr, ...((F && f && F[f]) || est.map(() => null))];
  const S = (sec, parent, item) => sched(raw, sec, parent, item, per);
  const plRows = [
    { label: 'Revenue from operations', values: ext(A.sales, 'sales'), bold: true, noteKey: 'sales' },
    { label: 'Revenue growth (%)', values: ext(A.salesGrowth, 'salesGrowth'), fmt: 'pct', indent: 1 },
    { label: 'Total operating expenses', values: [...A.expenses, ...est.map((_, i) => (F?.sales && F?.ebitda ? F.sales[i] - F.ebitda[i] : null))] },
    { label: 'Material cost (% of revenue)', values: A.materialPct, fmt: 'pct', indent: 1, noteKey: 'materialPct', inverse: true },
    { label: 'Manufacturing cost (% of revenue)', values: A.manufacturingPct, fmt: 'pct', indent: 1 },
    { label: 'Employee cost (% of revenue)', values: A.employeePct, fmt: 'pct', indent: 1 },
    { label: 'Other costs (% of revenue)', values: A.otherCostPct, fmt: 'pct', indent: 1 },
    { label: 'EBITDA (operating profit)', values: ext(A.ebitda, 'ebitda'), bold: true, noteKey: 'ebitda' },
    { label: 'EBITDA margin (%)', values: ext(A.ebitdaMargin, 'ebitdaMargin'), fmt: 'pct', indent: 1, noteKey: 'ebitdaMargin' },
    { label: 'Other income', values: ext(A.otherIncome, 'otherIncome'), noteKey: 'otherIncome' },
    { label: 'of which exceptional items', values: S('profit-loss', 'Other Income', 'Exceptional items'), indent: 1 },
    { label: 'Finance cost (interest)', values: ext(A.interest, 'interest') },
    { label: 'Depreciation', values: ext(A.dep, 'dep'), noteKey: 'dep', inverse: true },
    { label: 'Profit before tax', values: ext(A.pbt, 'pbt'), bold: true },
    { label: 'Tax rate (%)', values: [...A.taxPct, ...est.map(() => (M.forecast ? M.forecast.assumptions.taxRate[0] : null))], fmt: 'pct', indent: 1 },
    { label: 'Net profit', values: ext(A.pat, 'pat'), bold: true, noteKey: 'pat' },
    { label: 'Net profit growth (%)', values: ext(A.patGrowth, 'patGrowth'), fmt: 'pct', indent: 1 },
    { label: 'Net margin (%)', values: fin ? fin.npm : A.npm, fmt: 'pct', indent: 1 },
    { label: 'Profit excluding exceptional items', values: S('profit-loss', 'Net Profit', 'Profit excl Excep') },
    { label: 'EPS (₹)', values: ext(A.eps, 'eps'), fmt: 'd2', bold: true },
    { label: 'Dividend per share (₹)', values: ext(A.dps, 'dps'), fmt: 'd1' },
    { label: 'Dividend payout (%)', values: [...A.payout, ...est.map(() => (M.forecast ? M.forecast.assumptions.payout[0] : null))], fmt: 'pct' },
    { label: 'Shares outstanding (crore)', values: A.shares, fmt: 'd2', noteKey: 'equityShares' },
  ];
  statementSheet(wb, 'P&L' + DET, `${M.meta.name}: Profit & Loss (annual)`, 'Consolidated, ₹ crore. FY = year to March. Shaded columns are GAM Research estimates.', cols, plRows, notes, A.labels.length);
  contents.push(['P&L' + DET, 'Annual profit & loss with cost structure, FY' + A.labels[0].slice(2) + ' onward, plus estimates']);

  // ---------- Balance sheet ----------
  const bs = raw.tables['balance-sheet'];
  const bsRows = [
    { section: 'Equity & liabilities' },
    { label: 'Equity share capital', values: A.equity },
    { label: 'Reserves', values: A.reserves },
    { label: 'Net worth (shareholders\' funds)', values: A.netWorth, bold: true },
    { label: 'Borrowings', values: A.borrowings, bold: true },
    ...['Long term Borrowings', 'Short term Borrowings', 'Lease Liabilities', 'Other Borrowings'].map(i => ({ label: i, values: S('balance-sheet', 'Borrowings', i), indent: 1 })),
    { label: 'Other liabilities', values: A.otherLiab, bold: true },
    { label: 'Trade payables', values: A.payables, indent: 1, noteKey: 'payables' },
    { label: 'Advance from customers', values: A.customerAdvances, indent: 1 },
    { label: 'Non-controlling interest', values: S('balance-sheet', 'Other Liabilities', 'Non controlling int'), indent: 1 },
    { label: 'Other liability items', values: S('balance-sheet', 'Other Liabilities', 'Other liability items'), indent: 1 },
    { label: 'Total liabilities', values: A.totalLiab, bold: true },
    { section: 'Assets' },
    { label: 'Net block (fixed assets)', values: A.fixedAssets, bold: true },
    { label: 'Gross block', values: A.grossBlock, indent: 1 },
    { label: 'Accumulated depreciation', values: S('balance-sheet', 'Fixed Assets', 'Accumulated Depreciation'), indent: 1 },
    ...['Land', 'Building', 'Plant Machinery', 'Computers', 'Furniture n fittings', 'Vehicles', 'Other fixed assets'].map(i => ({ label: `Gross block: ${i.replace(' n ', ' & ').toLowerCase()}`, values: S('balance-sheet', 'Fixed Assets', i), indent: 2 })),
    { label: 'Capital work in progress', values: A.cwip },
    { label: 'Investments', values: A.investments, noteKey: 'investments' },
    { label: 'Other assets', values: A.otherAssets, bold: true },
    { label: 'Inventories', values: A.inventories, indent: 1 },
    { label: 'Trade receivables', values: A.receivables, indent: 1, noteKey: 'receivables', inverse: true },
    { label: 'Cash & equivalents', values: A.cash, indent: 1 },
    { label: 'Loans & advances', values: S('balance-sheet', 'Other Assets', 'Loans n Advances'), indent: 1 },
    { label: 'Other asset items', values: S('balance-sheet', 'Other Assets', 'Other asset items'), indent: 1 },
    { label: 'Total assets', values: A.totalAssets, bold: true },
    { section: 'Memo' },
    { label: 'Cash + investments − borrowings (net cash)', values: A.cashAndInvestments.map((c, i) => (isNum(c) ? c - (A.borrowings[i] || 0) : null)), bold: true },
    { label: 'Book value per share (₹)', values: A.bvps, fmt: 'd1' },
  ];
  statementSheet(wb, 'Balance Sheet' + DET, `${M.meta.name}: Balance Sheet (annual)`, 'Consolidated, ₹ crore, as at 31 March. Forecast balance-sheet items are in the Forecast & DCF sheet.', A.labels, bsRows, notes);
  contents.push(['Balance Sheet' + DET, 'Annual balance sheet with debt, liabilities, fixed-asset and current-asset breakdowns']);

  // ---------- Cash flow ----------
  const CFO = ['Profit from operations', 'Receivables', 'Inventory', 'Payables', 'Loans Advances', 'Other WC items', 'Working capital changes', 'Direct taxes'];
  const CFI = ['Fixed assets purchased', 'Fixed assets sold', 'Investments purchased', 'Investments sold', 'Interest received', 'Dividends received', 'Acquisition of companies', 'Other investing items'];
  const CFF = ['Proceeds from borrowings', 'Repayment of borrowings', 'Interest paid fin', 'Dividends paid', 'Financial liabilities', 'Other financing items'];
  const lbl = s => s.replace(' fin', '').replace(' n ', ' & ');
  const cfRows = [
    { label: 'Cash from operating activities', values: A.cfo, bold: true, noteKey: 'cfo' },
    ...CFO.map(i => ({ label: lbl(i), values: S('cash-flow', 'Cash from Operating Activity', i), indent: 1 })),
    { label: 'Cash from investing activities', values: A.cfi, bold: true },
    ...CFI.map(i => ({ label: lbl(i), values: S('cash-flow', 'Cash from Investing Activity', i), indent: 1 })),
    { label: 'Cash from financing activities', values: A.cff, bold: true },
    ...CFF.map(i => ({ label: lbl(i), values: S('cash-flow', 'Cash from Financing Activity', i), indent: 1 })),
    { label: 'Net cash flow', values: A.netCash, bold: true },
    { section: 'Memo' },
    { label: 'Capex (fixed assets purchased)', values: A.capex, noteKey: 'capex', inverse: true },
    { label: 'Free cash flow (CFO − capex)', values: A.fcfCalc, bold: true },
    { label: 'CFO / EBITDA (%)', values: A.cfoToEbitda, fmt: 'pct' },
    { label: 'CFO / net profit (%)', values: A.cfoToPat, fmt: 'pct' },
    { label: 'Capex / depreciation (x)', values: A.capexToDep, fmt: 'x' },
  ];
  statementSheet(wb, 'Cash Flow' + DET, `${M.meta.name}: Cash Flow (annual)`, 'Consolidated, ₹ crore, year to March.', A.labels, cfRows, notes);
  contents.push(['Cash Flow' + DET, 'Annual cash flow with operating, investing and financing breakdowns; free cash flow']);

  // ---------- Ratios ----------
  const rtRows = [
    { section: 'Growth' },
    { label: 'Revenue growth (%)', values: A.salesGrowth, fmt: 'pct' }, { label: 'EBITDA growth (%)', values: A.ebitdaGrowth, fmt: 'pct' }, { label: 'Net profit growth (%)', values: A.patGrowth, fmt: 'pct' }, { label: 'EPS growth (%)', values: A.epsGrowth, fmt: 'pct' },
    { section: 'Margins' },
    { label: 'Gross margin (100 − material %)', values: A.grossMargin, fmt: 'pct' }, { label: 'EBITDA margin (%)', values: A.ebitdaMargin, fmt: 'pct' }, { label: 'EBIT margin (%)', values: A.ebitMargin, fmt: 'pct' }, { label: 'PBT margin (%)', values: A.pbtMargin, fmt: 'pct' }, { label: 'Net margin (%)', values: A.npm, fmt: 'pct' }, { label: 'Other income as % of PBT', values: A.otherIncomeShare, fmt: 'pct' },
    { section: 'Returns' },
    { label: 'Return on equity, ROE (%)', values: A.roe, fmt: 'pct' }, { label: 'Return on capital employed, ROCE (%)', values: A.roce, fmt: 'pct' }, { label: 'Return on operating capital, ex cash (%)', values: A.coreRoce, fmt: 'pct' }, { label: 'Incremental ROCE, 3-year (%)', values: A.incrementalRoce, fmt: 'pct' }, { label: 'Return on assets (%)', values: A.roa, fmt: 'pct' },
    { section: 'DuPont (ROE = net margin × asset turnover × leverage)' },
    { label: 'Net margin (%)', values: A.npm, fmt: 'pct' }, { label: 'Asset turnover (x)', values: A.assetTurnover, fmt: 'd2' }, { label: 'Leverage: assets / equity (x)', values: A.leverage, fmt: 'd2' },
    { section: 'Efficiency & working capital' },
    { label: 'Fixed-asset turnover (x)', values: A.fixedAssetTurnover, fmt: 'd2' }, { label: 'Debtor days', values: A.debtorDays }, { label: 'Inventory days', values: A.inventoryDays, noteKey: 'inventoryDays', inverse: true }, { label: 'Payable days', values: A.payableDays }, { label: 'Cash conversion cycle (days)', values: A.ccc }, { label: 'Working capital days', values: A.wcDays },
    { section: 'Balance sheet & cash' },
    { label: 'Debt / equity (x)', values: A.debtEquity, fmt: 'd2' }, { label: 'Interest cover (x)', values: A.interestCover, fmt: 'x' }, { label: 'Capex / sales (%)', values: A.capexToSales, fmt: 'pct' }, { label: 'FCF / net profit (%)', values: A.fcfToPat, fmt: 'pct' },
    { section: 'Per share (₹)' },
    { label: 'EPS', values: A.eps, fmt: 'd2' }, { label: 'Book value per share', values: A.bvps, fmt: 'd1' }, { label: 'Dividend per share', values: A.dps, fmt: 'd1' },
  ];
  statementSheet(wb, 'Ratios' + DET, `${M.meta.name}: Key ratios (annual)`, 'Computed by GAM Research from consolidated statements.', A.labels, rtRows, notes);
  contents.push(['Ratios' + DET, 'Growth, margins, returns, DuPont, working-capital days, leverage, per-share data']);

  // ---------- Quarterly ----------
  if (Q) {
    const qRows = [
      { label: 'Revenue', values: Q.sales, bold: true, noteKey: 'sales', yoy: true },
      { label: 'Revenue growth YoY (%)', values: Q.salesYoY, fmt: 'pct', indent: 1 },
      { label: 'Revenue growth QoQ (%)', values: Q.salesQoQ, fmt: 'pct', indent: 1 },
      { label: 'Total expenses', values: Q.expenses },
      { label: 'Material cost (% of revenue)', values: Q.materialPct, fmt: 'pct', indent: 1, noteKey: 'materialPct', inverse: true, yoy: true },
      { label: 'Employee cost (% of revenue)', values: Q.employeePct, fmt: 'pct', indent: 1 },
      { label: 'EBITDA', values: Q.ebitda, bold: true, noteKey: 'ebitda', yoy: true },
      { label: 'EBITDA margin (%)', values: Q.opm, fmt: 'pct', indent: 1, noteKey: 'opm' },
      { label: 'EBITDA growth YoY (%)', values: Q.ebitdaYoY, fmt: 'pct', indent: 1 },
      { label: 'Other income', values: Q.otherIncome, noteKey: 'otherIncome' },
      { label: 'Finance cost', values: Q.interest },
      { label: 'Depreciation', values: Q.dep },
      { label: 'Profit before tax', values: Q.pbt, bold: true },
      { label: 'Tax rate (%)', values: Q.taxPct, fmt: 'pct', indent: 1 },
      { label: 'Net profit', values: Q.pat, bold: true, noteKey: 'pat', yoy: true },
      { label: 'Net profit growth YoY (%)', values: Q.patYoY, fmt: 'pct', indent: 1 },
      { label: 'Net margin (%)', values: Q.npm, fmt: 'pct', indent: 1 },
      { label: 'EPS (₹)', values: Q.eps, fmt: 'd2' },
    ];
    statementSheet(wb, 'Quarterly', `${M.meta.name}: Quarterly P&L`, 'Consolidated, ₹ crore. Q1 = Apr–Jun. Quarterly balance sheet and cash flow are not published by Indian companies (half-yearly only).', Q.labels, qRows, notes);
    contents.push(['Quarterly', `Quarterly P&L, ${Q.labels[0]}–${Q.labels[Q.labels.length - 1]}, with highlighted moves`]);
  }
  if (M.longQuarterly?.length) {
    const LQ = M.longQuarterly;
    statementSheet(wb, 'Quarterly history', `${M.meta.name}: Quarterly revenue and margins since ${LQ[0].label}`, 'Consolidated. Long-run series from Screener charts.', LQ.map(x => x.label), [
      { label: 'Revenue (₹ crore)', values: LQ.map(x => x.sales), bold: true }, { label: 'Revenue growth YoY (%)', values: LQ.map(x => x.salesYoY), fmt: 'pct' },
      { label: 'Gross margin (%)', values: LQ.map(x => x.gpm), fmt: 'pct' }, { label: 'Operating (EBITDA) margin (%)', values: LQ.map(x => x.opm), fmt: 'pct' }, { label: 'Net margin (%)', values: LQ.map(x => x.npm), fmt: 'pct' },
    ]);
    contents.push(['Quarterly history', `${LQ.length} quarters of revenue and margins`]);
  }
  } // end generic statements

  // ---------- KPIs (company-specific, from research) ----------
  const R = M.research || {};
  const kpiBlocks = [];
  const fyCols = A.labels;
  const fromList = (list, field) => fyCols.map(l => { const o = (list || []).find(x => x.fy === l); return o && isNum(o[field]) ? o[field] : null; });
  const KPI_LABELS = {
    units: 'Total volume (units)', domestic: 'Domestic volume (units)', exports: 'Export volume (units)', marketShare: 'Domestic market share (%)', realisation: 'Net realisation per vehicle (₹)', capacity: 'Installed capacity (units)', suvShare: 'SUV share of volume (%)',
    realisationPerVehicle: 'Revenue per vehicle (₹, standalone)', ebitdaPerVehicle: 'EBITDA per vehicle (₹)', discountPerVehicle: 'Discounts per vehicle (₹)', royaltyPct: 'Royalty to parent (% of sales)', royaltyCr: 'Royalty to parent (₹ crore)', adPct: 'Advertising (% of sales)', rndCr: 'R&D spend (₹ crore)', rndPct: 'R&D spend (% of sales)', employeeCostPerVehicle: 'Employee cost per vehicle (₹)',
    production: 'Production (units)', gwp: 'Gross written premium, GWP (₹ cr)', gdpi: 'Gross direct premium, GDPI (₹ cr)', nwp: 'Net written premium, NWP (₹ cr)', nep: 'Net earned premium, NEP (₹ cr)', netClaims: 'Net claims incurred (₹ cr)', lossRatio: 'Loss (claims) ratio (%)', expenseRatio: 'Expense ratio (%)', combinedRatio: 'Combined ratio (%)', combinedRatio1n: 'Combined ratio, 1/n adjusted (%)', uwResult: 'Underwriting result (₹ cr)', investmentIncome: 'Investment income (₹ cr)', aum: 'Investment assets / AUM (₹ cr)', investmentYield: 'Investment yield (%)', pbt: 'Profit before tax (₹ cr)', pat: 'Net profit (₹ cr)', roe: 'ROE (%)', solvency: 'Solvency ratio (x)', netWorth: 'Net worth (₹ cr)', retention: 'Retention ratio (%)', marketShare: 'Market share (%)', marketSharePrivate: 'Share among private insurers (%)', policiesMn: 'Policies (million)', netSalesRsMn: 'Net sales (₹ million, standalone)', utilisation: 'Capacity utilisation (%)', salesOutlets: 'Sales outlets', nexa: 'Nexa outlets', arena: 'Arena outlets', serviceWorkshops: 'Service workshops', ruralShare: 'Rural share of sales (%)', firstTimeBuyers: 'First-time buyers (%)',
  };
  const pctKeys = /Share|Pct|utilisation|firstTime|rural|Ratio|retention|Yield|^roe$/i;
  const addList = (heading, list) => {
    if (!list?.length) return;
    const keys = [...new Set(list.flatMap(o => Object.keys(o)))].filter(k => k !== 'fy' && k !== 'src' && list.some(o => isNum(o[k])));
    if (!keys.length) return;
    kpiBlocks.push({ section: heading });
    for (const k of keys) kpiBlocks.push({ label: KPI_LABELS[k] || pretty(k), values: fromList(list, k), fmt: pctKeys.test(k) ? 'pct' : 'num' });
  };
  addList('Volumes, share and capacity', R.company?.annualKpis);
  addList('Unit economics', R.deepdive?.unitEconomics);
  addList('Manufacturing', R.deepdive?.utilisation);
  addList('Distribution & customers', R.deepdive?.distribution);
  if (R.governance?.forensic) addList('Related party & governance', R.governance.forensic);
  if (kpiBlocks.length && !LIVE && !LENDER) {
    statementSheet(wb, 'KPIs', `${M.meta.name}: Operating KPIs`, 'From company presentations, annual reports and GAM Research. Blank = not disclosed.', fyCols, kpiBlocks);
    // Quarterly operating KPIs where available
    const qk = (R.company?.quarterlyKpis || []).filter(q => Object.values(q).some(isNum));
    const qKeys = [...new Set(qk.flatMap(q => Object.keys(q)))].filter(k => qk.some(q => isNum(q[k])));
    if (qk.length) {
      const ws = statementSheet(wb, 'KPIs (quarterly)', `${M.meta.name}: Quarterly operating KPIs`, 'From company presentations and GAM Research.', qk.map(x => x.q), qKeys.map(k => ({ label: KPI_LABELS[k] || pretty(k), values: qk.map(q => q[k]), fmt: pctKeys.test(k) ? 'pct' : 'num' })));
      const rr = ws.rowCount + 2;
      ws.getCell(`A${rr}`).value = 'What moved the numbers each quarter'; ws.getCell(`A${rr}`).font = { bold: true, color: { argb: NAVY } };
      qk.forEach((x, i) => { ws.getCell(`A${rr + 1 + i}`).value = x.q; ws.getCell(`B${rr + 1 + i}`).value = x.marginDrivers || x.commentary || ''; ws.mergeCells(`B${rr + 1 + i}:N${rr + 1 + i}`); ws.getCell(`B${rr + 1 + i}`).alignment = { wrapText: true, vertical: 'top' }; ws.getRow(rr + 1 + i).height = 45; });
    }
    contents.push(['KPIs', ST?.sector === 'insurer' ? 'Insurance KPIs from company disclosures: premiums, ratios, investments, solvency, segment and channel data' : 'Company-specific operating KPIs: volumes, share, unit economics, capacity, distribution']);
  }

  // ---------- Forecast & DCF ----------
  if (M.forecast && !LIVE && !LENDER) {
    const { assumptions: as, dcf } = M.forecast;
    const ws = wb.addWorksheet('Forecast & DCF', { views: [{ state: 'frozen', ySplit: 4, xSplit: 1 }] });
    title(ws, `${M.meta.name}: GAM Research forecasts and DCF valuation`, 'Estimates are GAM Research\'s; see the initiating-coverage report for rationale.');
    ws.getColumn(1).width = 40;
    const yc = ['FY26A', ...F.years];
    const put = (row, label, vals, fmt = 'num', bold) => { const x = ws.getRow(row); x.getCell(1).value = label; x.getCell(1).font = { bold }; vals.forEach((v, j) => { const c = x.getCell(j + 2); c.value = isNum(v) ? v : null; c.numFmt = FMT[fmt]; c.font = { bold }; if (j) c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: EST } }; }); };
    const h = ws.getRow(4); h.values = ['₹ crore unless stated', ...yc]; styleHeader(h);
    const b = A.labels.length - 1;
    let row = 5;
    const ins = M.forecast.type === 'insurer';
    const AK = R.company?.annualKpis;
    const lines = ins ? [
      ['Gross written premium (GWP)', [last(AK, 'gwp'), ...F.gwp], 'num', true], ['GWP growth (%)', [null, ...F.gwpGrowth], 'pct'],
      ['Net written premium (NWP)', [last(AK, 'nwp'), ...F.nwp]], ['Net earned premium (NEP)', [last(AK, 'nep'), ...F.nep], 'num', true],
      ['Loss (claims) ratio (%)', [last(AK, 'lossRatio'), ...F.lossRatio], 'pct'], ['Expense ratio (%)', [last(AK, 'expenseRatio'), ...F.expenseRatio], 'pct'], ['Combined ratio (%)', [last(AK, 'combinedRatio'), ...F.combinedRatio], 'pct', true],
      ['Underwriting result', [last(AK, 'uwResult'), ...F.uwResult]], ['Investment assets', [last(AK, 'aum'), ...F.aum]], ['Investment income', [last(AK, 'investmentIncome'), ...F.investmentIncome]],
      ['Profit before tax', [A.pbt[b], ...F.pbt]], ['Net profit', [A.pat[b], ...F.pat], 'num', true], ['EPS (₹)', [A.eps[b], ...F.eps], 'd2', true], ['EPS growth (%)', [A.epsGrowth[b], ...F.epsGrowth], 'pct'],
      ['Net worth', [A.netWorth[b], ...F.netWorth]], ['Book value per share (₹)', [A.bvps[b], ...F.bvps], 'd1'], ['ROE (%)', [A.roe[b], ...F.roe], 'pct'],
      ['P/E at CMP (x)', [M.price.last / A.eps[b], ...F.pe], 'x'], ['P/B at CMP (x)', [M.price.last / A.bvps[b], ...F.pb], 'x'],
    ] : [
      ['Volume (units)', [R.company?.annualKpis?.find(x => x.fy === A.labels[b])?.units, ...F.volume]],
      ['Revenue per vehicle (₹)', [null, ...F.revPerUnit]],
      ['Revenue', [A.sales[b], ...F.sales], 'num', true], ['Revenue growth (%)', [A.salesGrowth[b], ...F.salesGrowth], 'pct'],
      ['EBITDA', [A.ebitda[b], ...F.ebitda], 'num', true], ['EBITDA margin (%)', [A.ebitdaMargin[b], ...F.ebitdaMargin], 'pct'],
      ['Depreciation', [A.dep[b], ...F.dep]], ['Other income', [A.otherIncome[b], ...F.otherIncome]], ['Profit before tax', [A.pbt[b], ...F.pbt]],
      ['Net profit', [A.pat[b], ...F.pat], 'num', true], ['EPS (₹)', [A.eps[b], ...F.eps], 'd1', true], ['EPS growth (%)', [A.epsGrowth[b], ...F.epsGrowth], 'pct'], ['DPS (₹)', [A.dps[b], ...F.dps], 'd1'],
      ['Capex', [A.capex[b], ...F.capex]], ['Operating cash flow', [A.cfo[b], ...F.cfo]], ['Free cash flow', [A.fcfCalc[b], ...F.fcf], 'num', true],
      ['Net worth', [A.netWorth[b], ...F.netWorth]], ['Net cash & investments', [A.cashAndInvestments[b] - (A.borrowings[b] || 0), ...F.treasury]],
      ['ROE (%)', [A.roe[b], ...F.roe], 'pct'], ['P/E at CMP (x)', [M.price.last / A.eps[b], ...F.pe], 'x'], ['EV/EBITDA at CMP (x)', [null, ...F.evEbitda], 'x'], ['Dividend yield (%)', [null, ...F.divYield], 'pct'],
    ];
    for (const [l, v, f, bo] of lines) put(row++, l, v, f, bo);
    row += 1;
    ws.getCell(`A${row}`).value = 'Key assumptions'; ws.getCell(`A${row}`).font = { bold: true, color: { argb: NAVY } }; row++;
    const asm = ins ? [['GWP growth (%)', [null, ...as.gwpGrowth], 'pct'], ['Retention, NWP/GWP (%)', [null, ...[].concat(as.retention)], 'pct'], ['Earned ratio, NEP/NWP (%)', [null, ...[].concat(as.earnedRatio)], 'pct'], ['Loss ratio (%)', [null, ...as.lossRatio], 'pct'], ['Expense ratio (%)', [null, ...as.expenseRatio], 'pct'], ['Investment yield (%)', [null, ...[].concat(as.investmentYield)], 'pct'], ['Tax rate (%)', [null, ...[].concat(as.taxRate)], 'pct']] : [['Volume growth (%)', [null, ...(as.volume?.growth || [])], 'pct'], ['Revenue per vehicle growth (%)', [null, ...(as.revPerUnitGrowth || [])], 'pct'], ['EBITDA margin (%)', [null, ...as.ebitdaMargin], 'pct'], ['Capex (₹ crore)', [null, ...as.capex]], ['Treasury yield (%)', [null, ...as.treasuryYield], 'pct'], ['Tax rate (%)', [null, ...as.taxRate], 'pct'], ['Payout (%)', [null, ...as.payout], 'pct']];
    for (const [l, v, f] of asm) put(row++, l, v, f);
    row += 1;
    if (ins) {
      ws.getCell(`A${row}`).value = 'Valuation: price-to-book vs sustainable ROE'; ws.getCell(`A${row}`).font = { bold: true, color: { argb: NAVY } }; row++;
      const kv2 = [['Cost of equity (%)', dcf.ke, 'pct'], ['Sustainable ROE (%)', dcf.sustainableRoe, 'pct'], ['Long-term growth (%)', dcf.terminalGrowth, 'pct'], ['Justified P/B = (ROE - g) / (Ke - g) (x)', dcf.justifiedPb, 'd2'], [`Book value per share, ${dcf.bookYear} (₹)`, dcf.book, 'd1'], [dcf.blend ? 'Residual income value, 12 months (₹)' : '12-month target price (₹)', dcf.intrinsicTp ?? dcf.tp], [dcf.blend ? 'vs CMP (%)' : 'Upside vs CMP (%)', ((dcf.intrinsicTp ?? dcf.tp) / M.price.last - 1) * 100, 'pct'], ...(dcf.blend ? [['Blended 12-month target price (₹): see Valuation sheet', dcf.tp]] : [['Implied P/E on ' + dcf.impliedPeLabel + ' (x)', dcf.impliedPe, 'x']]), ['Current P/B (x)', dcf.currentPb, 'd2']];
      for (const [l, v, f2] of kv2) { const xr = ws.getRow(row++); xr.getCell(1).value = l; xr.getCell(2).value = v; xr.getCell(2).numFmt = FMT[f2 || 'num']; if (/target/.test(l)) { xr.getCell(1).font = { bold: true }; xr.getCell(2).font = { bold: true }; } }
      row++;
    } else {
    ws.getCell(`A${row}`).value = 'DCF valuation'; ws.getCell(`A${row}`).font = { bold: true, color: { argb: NAVY } }; row++;
    const dh = ws.getRow(row++); dh.values = ['Year', 'Revenue', 'Growth %', 'EBITDA margin %', 'Capex', 'Free cash flow to firm', 'Discount factor', 'Present value']; styleHeader(dh);
    for (const d of dcf.rows) { const x = ws.getRow(row++); x.values = [d.year, d.sales, d.growth, d.margin, d.capex, d.fcff, d.disc, d.pv]; [2, 5, 6, 8].forEach(c => (x.getCell(c).numFmt = FMT.num)); [3, 4].forEach(c => (x.getCell(c).numFmt = FMT.pct)); x.getCell(7).numFmt = '0.000'; }
    row++;
    const kvs = [['Cost of equity / WACC (%)', dcf.wacc, 'pct'], ['Terminal growth (%)', dcf.terminalGrowth, 'pct'], ['PV of explicit cash flows', dcf.pvExplicit], ['PV of terminal value', dcf.pvTv], ['Enterprise value', dcf.ev], ['Add: net cash & investments', dcf.netCash], ['Equity value', dcf.equity], ['Shares (crore)', F.shares, 'd2'], ['Value per share (₹)', dcf.perShare], ['12-month target price (₹)', dcf.tp], ['Upside vs CMP (%)', dcf.upside, 'pct'], ['Implied P/E on ' + dcf.impliedPeLabel + ' (x)', dcf.impliedPe, 'x']];
    for (const [l, v, f] of kvs) { const x = ws.getRow(row++); x.getCell(1).value = l; x.getCell(2).value = v; x.getCell(2).numFmt = FMT[f || 'num']; if (/target/.test(l)) { x.getCell(1).font = { bold: true }; x.getCell(2).font = { bold: true }; } }
    row++;
    }
    ws.getCell(`A${row}`).value = ins ? 'Target price sensitivity (₹): cost of equity (rows) × sustainable ROE (columns)' : 'Target price sensitivity (₹): WACC (rows) × terminal growth (columns)'; ws.getCell(`A${row}`).font = { bold: true, color: { argb: NAVY } }; row++;
    const sh = ws.getRow(row++); sh.values = [ins ? 'Ke \\ ROE' : 'WACC \\ g', ...dcf.sens.gs.map(g => `${g.toFixed(1)}%`)]; styleHeader(sh);
    dcf.sens.waccs.forEach((w, i) => { const x = ws.getRow(row++); x.values = [`${w.toFixed(1)}%`, ...dcf.sens.grid[i]]; for (let c = 2; c <= 6; c++) x.getCell(c).numFmt = FMT.num; });
    row++;
    ws.getCell(`A${row}`).value = 'Scenarios'; ws.getCell(`A${row}`).font = { bold: true, color: { argb: NAVY } }; row++;
    const sch = ws.getRow(row++); sch.values = ['Scenario', 'FY27E EPS', 'FY28E EPS', 'FY29E EPS', 'Value (₹)', 'vs CMP (%)', 'What has to happen']; styleHeader(sch);
    const sc = M.forecast.scenarios;
    const scRows = [['Bull', ...sc.bull.eps, sc.bull.tp, sc.bull.upside, sc.bull.narrative], ['Base (GAM)', ...F.eps, dcf.tp, dcf.upside, 'GAM Research base case'], ['Bear', ...sc.bear.eps, sc.bear.tp, sc.bear.upside, sc.bear.narrative]].map(r => [r[0], ...r.slice(1, 1 + F.years.length), ...r.slice(-3)]);
    for (const s of scRows) { const x = ws.getRow(row++); x.values = s; [2, 3, 4].forEach(c => (x.getCell(c).numFmt = FMT.d1)); x.getCell(5).numFmt = FMT.num; x.getCell(6).numFmt = FMT.pct; x.getCell(7).alignment = { wrapText: true }; x.height = 30; }
    for (let c = 2; c <= 8; c++) ws.getColumn(c).width = 14;
    ws.getColumn(7).width = 16;
    if (dcf.blend && !LIVE) { require('./excel-model').buildValuationSheet(wb, M, { R: null, nH: 0, years: F.years, col: null, intrinsic: null }); contents.push(['Valuation', 'Target price as a weighted blend of methods']); }
    contents.push(['Forecast & DCF', `GAM Research estimates ${F.years[0]}–${F.years[F.years.length - 1]}, assumptions, ${ins ? 'P/B–ROE valuation' : 'DCF'}, sensitivity and scenarios`]);
  }

  // ---------- Valuation history ----------
  const V = M.valuation;
  if (V?.pe?.series?.length) {
    const ws = wb.addWorksheet('Valuation history', { views: [{ state: 'frozen', xSplit: 1, ySplit: 4 }] });
    title(ws, `${M.meta.name}: Valuation multiples history (weekly)`, 'Trailing multiples from Screener.');
    const opco = !ST && !LENDER;
    const h = ws.getRow(4); h.values = opco ? ['Date', 'Share price (₹)', 'P/E (x)', 'EV/EBITDA (x)', 'Price/Book (x)', 'Mkt cap/Sales (x)'] : ['Date', 'Share price (₹)', 'P/E (x)', 'Price/Book (x)']; styleHeader(h);
    const map = (s) => Object.fromEntries((s?.series || []).map(([d, v]) => [d, v]));
    const pe = map(V.pe), ev = map(V.evEbitda), pb = map(V.pb), ms = map(V.mcapSales);
    let row = 5;
    for (const [d, px] of M.price.series) { const x = ws.getRow(row++); x.values = opco ? [new Date(d), px, pe[d] ?? null, ev[d] ?? null, pb[d] ?? null, ms[d] ?? null] : [new Date(d), px, pe[d] ?? null, pb[d] ?? null]; x.getCell(1).numFmt = 'dd-mmm-yyyy'; x.getCell(2).numFmt = FMT.num; for (let c = 3; c <= 6; c++) x.getCell(c).numFmt = '0.0'; }
    [14, 14, 10, 12, 12, 14].forEach((w, i) => (ws.getColumn(i + 1).width = w));
    contents.push(['Valuation history', `Weekly share price with ${opco ? 'P/E, EV/EBITDA, P/B and Mcap/Sales' : 'P/E and P/B'} since ${M.price.series[0][0].slice(0, 4)}`]);
  }

  // ---------- Shareholding ----------
  if (M.shareholding) {
    const S2 = M.shareholding;
    statementSheet(wb, 'Shareholding', `${M.meta.name}: Shareholding pattern (quarterly)`, '% of equity, from BSE filings.', S2.periods, Object.entries(S2.rows).map(([k, v]) => ({ label: k, values: v, fmt: /Share/.test(k) ? 'num' : 'pct', bold: k === 'Promoters' })));
    const sh = R.products?.shareholders;
    if (sh?.holdersAbove1?.length) {
      const ws = wb.getWorksheet('Shareholding');
      let row = ws.rowCount + 3;
      ws.getCell(`A${row}`).value = `Named holders above 1% (${sh.asOf || ''})`; ws.getCell(`A${row}`).font = { bold: true, color: { argb: NAVY } }; row++;
      for (const x of sh.holdersAbove1) { ws.getCell(`A${row}`).value = x.name; ws.getCell(`B${row}`).value = x.pct; ws.getCell(`B${row}`).numFmt = FMT.pct; ws.getCell(`C${row}`).value = x.type; row++; }
    }
    contents.push(['Shareholding', 'Quarterly shareholding pattern and named holders above 1%']);
  }

  // contents list on cover
  for (const [sheet, desc] of contents) {
    const c = cv.getCell(`B${r}`);
    c.value = sheet ? { text: sheet, hyperlink: `#'${sheet}'!A1` } : '';
    c.font = { color: { argb: 'FF2B5CA6' }, underline: true, size: 10 };
    if (!sheet) cv.mergeCells(`C${r}:C${r}`);
    cv.getCell(`C${r}`).value = desc; cv.getCell(`C${r}`).font = { size: 10 };
    r++;
  }
  r += 1;
  cv.getCell(`B${r}`).value = `For internal use by GAM. Figures are ${M.meta.basis === 'standalone' ? 'standalone' : 'consolidated'} unless stated; estimates are GAM Research's and subject to change. Not investment advice.`;
  cv.getCell(`B${r}`).font = { italic: true, size: 8.5, color: { argb: 'FF6B7280' } };
  cv.mergeCells(`B${r}:C${r}`);
  return wb;
}

module.exports = { buildWorkbook };

if (require.main === module) {
  const sym = (process.argv[2] || 'MARUTI').toUpperCase();
  buildWorkbook(sym).then(async wb => {
    const out = path.join(ROOT, 'output', `${sym}-financial-model.xlsx`);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    await wb.xlsx.writeFile(out);
    console.log(`wrote ${out}: ${wb.worksheets.map(w => w.name).join(', ')}`);
  });
}
