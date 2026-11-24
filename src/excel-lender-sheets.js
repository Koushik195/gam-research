// Lender workbook sheets beyond Assumptions/Model (see src/excel-lender.js):
//   Valuation (primary method + cross-checks, justified P/B, residual income, sensitivities),
//   KPIs, Quarterly (lender format + asset quality), Quarterly history, Cash Flow (reported).
// The Valuation sheet mirrors lenderValue() in src/forecast-lender.js and residualIncome() in src/forecast.js.
const { writeRows, header, title, band, colL, FMT } = require('./excel-model');

const NAVY = 'FF0D1F44', BLUE = 'FF0000FF', GREEN = 'FF007A33', INPUT = 'FFFFF2CC', MUTED = 'FF6B7280';
const isNum = v => typeof v === 'number' && Number.isFinite(v);
const pretty = k => k.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, c => c.toUpperCase());

function buildValuation(wb, M, ctx) {
  const { R, nH, years, col } = ctx, n = years.length;
  const v = M.forecast.assumptions.valuation || {};
  const list = v.blend?.methods || [{ key: 'jpb', method: 'jpb', name: 'Justified P/B', role: 'primary' }, { key: 'ri', method: 'ri', name: 'Residual income', role: 'cross-check' }];
  const rnd = v.blend?.round || 10, ROLES = list.some(m => m.role);
  const ws = wb.addWorksheet('Valuation', { views: [{ showGridLines: false, state: 'frozen', xSplit: 1, ySplit: 4 }], properties: { tabColor: { argb: 'FF16A08A' } } });
  title(ws, `${M.meta.name}: Valuation (target = the method the street uses; the others are cross-checks)`, 'Metrics link to the Model; multiples in blue on yellow (Base / Bull / Bear), live column follows the Scenario switch (Assumptions!B4). Every value is a formula.');
  [50, 34, 13, 9, 9, 9, 11, 13, 12, 11, 70].forEach((w, i) => (ws.getColumn(i + 1).width = w));
  header(ws, 4, ['Method', 'Metric', 'Metric value', 'Base', 'Bull', 'Bear', 'Live multiple', 'Value / share (₹)', ROLES ? 'Role' : 'Weight', ROLES ? 'vs target' : 'Weighted (₹)', 'Why this method / multiple'], null);
  const fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: INPUT } };
  const inp = (cell, val, fmt) => { const c = ws.getCell(cell); c.value = val; c.font = { color: { argb: BLUE }, bold: true }; c.fill = fill; c.numFmt = FMT[fmt]; };
  const fml = (cell, f, fmt, o = {}) => { const c = ws.getCell(cell); c.value = { formula: f }; c.numFmt = FMT[fmt || 'num']; c.font = { bold: !!o.bold, color: { argb: /Model!|Assumptions!/.test(f) || o.link ? GREEN : 'FF000000' } }; return c; };
  const mcell = (yr, key) => `Model!${col(nH + years.indexOf(yr))}${R[key]}`;
  const pick = (m, key) => (m.roll ? `(1-${m.roll[2]})*${mcell(m.roll[0], key)}+${m.roll[2]}*${mcell(m.roll[1], key)}` : `Model!${col(nH + Math.max(0, years.indexOf(m.year)))}${R[key]}`);
  const lbl = (base, m) => `${base} ${m.year || ''}${m.roll ? ` (${Math.round((1 - m.roll[2]) * 100)}% ${m.roll[0]} + ${Math.round(m.roll[2] * 100)}% ${m.roll[1]})` : ''}`;
  let r = 5; const first = r; let primRow = null, jpbRow = null;
  for (const m0 of list) {
    const roll = m0.method === 'jpb' && !m0.roll && !m0.year ? [years[0], years[1], 0.5] : m0.roll, m = { ...m0, roll };
    ws.getCell(`A${r}`).value = m.name; ws.getCell(`A${r}`).font = { bold: true };
    if (m.method === 'pe' || m.method === 'pb') {
      ws.getCell(`B${r}`).value = lbl(m.method === 'pe' ? 'EPS' : 'Book value / share', m);
      fml(`C${r}`, pick(m, m.method === 'pe' ? 'eps' : 'rBvps'), 'd2');
      inp(`D${r}`, m.multiple.base, 'd1'); inp(`E${r}`, m.multiple.bull ?? m.multiple.base, 'd1'); inp(`F${r}`, m.multiple.bear ?? m.multiple.base, 'd1');
      fml(`G${r}`, `CHOOSE(Scenario,D${r},E${r},F${r})`, 'x', { bold: true });
      fml(`H${r}`, `C${r}*G${r}`, 'num');
    } else if (m.method === 'jpb') {
      jpbRow = r;
      ws.getCell(`B${r}`).value = lbl('Book value / share', m);
      fml(`C${r}`, pick(m, 'rBvps'), 'd2');
      ws.getCell(`D${r}`).value = 'computed below'; ws.getCell(`D${r}`).font = { italic: true, size: 8.5, color: { argb: MUTED } };
      fml(`G${r}`, 'JustifiedPB', 'x', { bold: true, link: true });
      fml(`H${r}`, `C${r}*G${r}/(1+Ke/100)^(${m.discountMonths || 0}/12)`, 'num');
    } else if (m.method === 'ri') {
      ws.getCell(`B${r}`).value = 'Residual income, rolled forward to 12 months';
      fml(`H${r}`, 'RIValue', 'num', { link: true });
    } else throw new Error(`lender valuation sheet: method '${m.method}' not supported`);
    ws.getCell(`H${r}`).font = { ...ws.getCell(`H${r}`).font, bold: true };
    if (ROLES) { ws.getCell(`I${r}`).value = m.role === 'primary' ? 'PRIMARY' : 'cross-check'; ws.getCell(`I${r}`).font = { bold: m.role === 'primary', color: { argb: m.role === 'primary' ? NAVY : MUTED } }; if (m.role === 'primary') primRow = r; }
    else { inp(`I${r}`, m.weight || 0, 'pct'); fml(`J${r}`, `H${r}*I${r}`, 'num'); }
    ws.getCell(`K${r}`).value = m.why || ''; ws.getCell(`K${r}`).font = { size: 9 }; ws.getCell(`K${r}`).alignment = { wrapText: true, vertical: 'middle' };
    ws.getRow(r).height = 30; r++;
  }
  const last = r - 1; r++;
  const tot = (label, f, fmt, nm) => { ws.getCell(`A${r}`).value = label; ws.getCell(`A${r}`).font = { bold: true }; const c = fml(`J${r}`, f, fmt, { bold: true }); if (nm) wb.definedNames.add(`Valuation!$J$${r}`, nm); return { c, row: r++ }; };
  let tp;
  if (ROLES) {
    tp = tot(`12-month target price = primary method, rounded to ₹${rnd}`, `ROUND(H${primRow}/${rnd},0)*${rnd}`, 'num', 'TargetPrice');
    for (let x = first; x <= last; x++) fml(`J${x}`, `H${x}/H${primRow}-1`, 'pct');
  } else {
    tot('Weights (should total 100%)', `SUM(I${first}:I${last})`, 'pct');
    const bv = tot('Blended value per share', `SUMPRODUCT(H${first}:H${last},I${first}:I${last})/SUM(I${first}:I${last})`, 'num');
    tp = tot(`12-month target price (rounded to ₹${rnd})`, `ROUND(J${bv.row}/${rnd},0)*${rnd}`, 'num', 'TargetPrice');
  }
  tp.c.fill = fill;
  tot('Upside / (downside) vs CMP', 'TargetPrice/CMP-1', 'pct', 'Upside');
  tot(`Implied P/E on ${years[1]} EPS`, `TargetPrice/${mcell(years[1], 'eps')}`, 'x');
  const prim = list.find(m => m.role === 'primary');
  tot(prim && ['pb', 'jpb'].includes(prim.method) ? 'Implied P/B on the primary method\'s book' : `Implied P/B on ${years[1]} book`, prim && ['pb', 'jpb'].includes(prim.method) ? `TargetPrice/C${primRow}` : `TargetPrice/${mcell(years[1], 'rBvps')}`, 'x');
  tot('Market value at CMP (₹ cr)', 'CMP*Shares', 'num');
  r++;

  // ---- justified P/B (Gordon growth) ----
  band(ws, r++, 'Justified P/B (Gordon growth): P/B = (sustainable ROE − g) ÷ (cost of equity − g)', 4, 1);
  const kv = (label, f, fmt, nm) => { ws.getCell(`A${r}`).value = label; const c = fml(`C${r}`, f, fmt); if (nm) wb.definedNames.add(`Valuation!$C$${r}`, nm); return r++; };
  kv('Cost of equity, %', 'Ke', 'd2'); kv('Long-run growth g, %', 'GrowthG', 'd2'); kv('Sustainable ROE (live scenario), %', 'SustRoe', 'd2');
  const jr = kv('Justified P/B (x)', '(SustRoe-GrowthG)/(Ke-GrowthG)', 'd2', 'JustifiedPB');
  ws.getCell(`C${jr}`).font = { bold: true };
  const jbm = list.find(m => m.method === 'jpb');
  kv('Book value per share it applies to (₹)', jpbRow ? `C${jpbRow}` : `0.5*${mcell(years[0], 'rBvps')}+0.5*${mcell(years[1], 'rBvps')}`, 'd2', 'JustifiedPBBook');
  kv('Justified P/B value per share (₹)', `JustifiedPBBook*JustifiedPB/(1+Ke/100)^(${jbm?.discountMonths || 0}/12)`, 'num');
  const cpb = kv(`Current P/B (CMP ÷ ${ctx.hist[nH - 1]} book value per share) (x)`, `CMP/Model!${col(nH - 1)}${R.rBvps}`, 'd2');
  kv('ROE the current P/B implies = g + P/B × (Ke − g), %', `GrowthG+C${cpb}*(Ke-GrowthG)`, 'd2');
  r++;
  r = buildRi(ws, wb, { r, R, nH, years, col, mcell, fml, v, n });
  r = buildSens(ws, wb, { r, rnd, primRow, prim, fml, jbm });
}

// Residual income per share, valued at the end of the first forecast year (mirrors residualIncome()):
// ROE = forecast ROE for the explicit years, then fades linearly to the sustainable ROE over FadeYears;
// payout 0 in explicit years, then rises to PayoutTo; terminal value on the sustainable ROE.
function buildRi(ws, wb, { r, R, nH, years, col, mcell, fml, v, n }) {
  const N = v.years || 15, path = v.roePath || null;
  band(ws, r++, `Residual income: book value + present value of returns above the cost of equity (${N} years, then terminal value)`, Math.min(11, 2 + N), 1);
  const hr = r++;
  const yy0 = +years[0].slice(2, 4);
  header(ws, hr, ['Residual income (₹ per share)', `End-${years[0]}`, ...Array.from({ length: N }, (_, k) => `FY${yy0 + k + 1}E`)], null);
  const rows = ['Years from valuation date', 'ROE, %', 'Payout, %', 'Opening book value per share', 'Residual income = (ROE − Ke) × opening book', 'Discount factor at Ke', 'Present value'];
  const RR = {}; rows.forEach((t, i) => { RR[t] = r + i; ws.getCell(`A${r + i}`).value = t; });
  const kR = RR['Years from valuation date'], roeR = RR['ROE, %'], payR = RR['Payout, %'], bkR = RR['Opening book value per share'], riR = RR['Residual income = (ROE − Ke) × opening book'], dR = RR['Discount factor at Ke'], pvR = RR['Present value'];
  fml(`B${bkR}`, `${mcell(years[0], 'rBvps')}+BookUplift`, 'd2', { bold: true });
  const roe0 = path ? String(path[n - 1]) : `${mcell(years[n - 1], 'rRoe')}*100`;
  for (let k = 1; k <= N; k++) {
    const c = colL(1 + k), p = colL(k);
    ws.getColumn(2 + k).width = Math.max(ws.getColumn(2 + k).width || 0, 9);
    fml(`${c}${kR}`, `${k}`, 'num');
    fml(`${c}${roeR}`, k < n ? (path ? String(path[k]) : `${mcell(years[k], 'rRoe')}*100`) : `${roe0}+(SustRoe-${roe0})*MIN(1,(${c}${kR}-${n - 1})/FadeYears)`, 'd2');
    fml(`${c}${payR}`, k < n ? '0' : `MIN(PayoutTo,PayoutTo*(${c}${kR}-${n - 1})/FadeYears)`, 'd1');
    fml(`${c}${bkR}`, k === 1 ? `$B$${bkR}` : `${p}${bkR}*(1+${p}${roeR}/100*(1-${p}${payR}/100))`, 'd2');
    fml(`${c}${riR}`, `(${c}${roeR}-Ke)/100*${c}${bkR}`, 'd2');
    fml(`${c}${dR}`, `1/(1+Ke/100)^${c}${kR}`, 'd3');
    fml(`${c}${pvR}`, `${c}${riR}*${c}${dR}`, 'd2');
  }
  r = pvR + 2;
  const L = colL(1 + N);
  const out = (label, f, fmt, nm, bold) => { ws.getCell(`A${r}`).value = label; ws.getCell(`A${r}`).font = { bold: !!bold }; fml(`C${r}`, f, fmt, { bold }); if (nm) wb.definedNames.add(`Valuation!$C$${r}`, nm); return r++; };
  const fb = out(`Book value per share after year ${N}`, `${L}${bkR}*(1+${L}${roeR}/100*(1-${L}${payR}/100))`, 'd2');
  const spv = out('Sum of present values of residual income', `SUM(C${pvR}:${L}${pvR})`, 'd2');
  const tri = out('Terminal residual income = (sustainable ROE − Ke) × book', `(SustRoe-Ke)/100*C${fb}`, 'd2');
  const tv = out('Terminal value = terminal RI × (1 + g) ÷ (Ke − g)', `C${tri}*(1+TermGrowth/100)/((Ke-TermGrowth)/100)`, 'd2');
  const ptv = out('Present value of terminal value', `C${tv}/(1+Ke/100)^${N}`, 'd2');
  out(`Value per share at end-${years[0]} = book + PV of RI + PV of terminal value`, `B${bkR}+C${spv}+C${ptv}`, 'd2', 'RIPerShare', true);
  out('12-month residual-income value (rolled forward at Ke)', 'RIPerShare*(1+Ke/100)^(RollMonths/12)', 'num', 'RIValue', true);
  return r + 1;
}

function buildSens(ws, wb, { r, rnd, primRow, prim, fml, jbm }) {
  const steps = [-1, -0.5, 0, 0.5, 1], rs = [-3, -1.5, 0, 1.5, 3];
  band(ws, r++, 'Justified P/B value per share (₹): cost of equity down the side, sustainable ROE across', 7, 1);
  const sr = r++;
  ws.getCell(`B${sr}`).value = 'Ke \\ ROE'; ws.getCell(`B${sr}`).font = { bold: true };
  rs.forEach((x, j) => { const c = fml(`${colL(2 + j)}${sr}`, `SustRoe+${x}`, 'd1', { bold: true }); c.numFmt = '0.0"%"'; });
  steps.forEach((x, i) => {
    const rr = r++;
    const kc = fml(`B${rr}`, `Ke+${x}`, 'd1', { bold: true }); kc.numFmt = '0.0"%"';
    rs.forEach((_, j) => {
      const cc = colL(2 + j);
      const c = fml(`${cc}${rr}`, `ROUND((${cc}$${sr}-GrowthG)/($B${rr}-GrowthG)*JustifiedPBBook/(1+$B${rr}/100)^(${jbm?.discountMonths || 0}/12)/${rnd},0)*${rnd}`, 'num');
      if (i === 2 && j === 2) { c.font = { bold: true }; c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: INPUT } }; }
    });
  });
  r++;
  if (prim && ['pe', 'pb'].includes(prim.method) && primRow) {
    band(ws, r++, `Target price (₹) at other ${prim.method === 'pe' ? 'P/E' : 'P/B'} multiples (live scenario's ${prim.method === 'pe' ? 'EPS' : 'book'})`, 4, 1);
    const hr = r++;
    ws.getCell(`B${hr}`).value = 'Multiple (x)'; ws.getCell(`C${hr}`).value = 'Target (₹)'; ws.getCell(`D${hr}`).value = 'vs CMP';
    [2, 3, 4].forEach(c => (ws.getRow(hr).getCell(c).font = { bold: true }));
    steps.forEach(x => {
      const rr = r++;
      fml(`B${rr}`, `G${primRow}+${x}`, 'x', { bold: x === 0 });
      fml(`C${rr}`, `ROUND(B${rr}*C${primRow}/${rnd},0)*${rnd}`, 'num', { bold: x === 0 });
      fml(`D${rr}`, `C${rr}/CMP-1`, 'pct');
    });
  }
  r++;
  ws.getCell(`A${r}`).value = 'P/E and P/B values = metric × live multiple. Justified P/B uses the live sustainable ROE (Assumptions). Residual income fades ROE from the last forecast year to the sustainable level.';
  ws.getCell(`A${r}`).font = { italic: true, size: 9, color: { argb: MUTED } };
  return r + 1;
}

// KPI sheet: core lender metrics linked to the Model, then KPIs reported by the company (blue),
// extended into the forecast years where the Model has the same metric.
const KMAP = { aum: ['aum', 1], nii: ['nii', 1], ppop: ['ppop', 1], provisions: ['provisions', 1], feeIncome: ['feeIncome', 1], netWorth: ['netWorth', 1], borrowings: ['borrowings', 1], pat: ['pat', 1],
  nim: ['rNim', 100], yieldOnAum: ['rYield', 100], costOfFunds: ['rCof', 100], creditCost: ['rCc', 100], costToIncome: ['cti', 100], roa: ['rRoa', 100], roe: ['rRoe', 100], bvps: ['rBvps', 1] };
const KLABEL = { aum: 'AUM (₹ cr)', customers: 'Customer franchise (crore)', newLoans: 'New loans booked (crore)', branches: 'Branches / locations', employees: 'Employees', gnpa: 'Gross NPA / Stage 3 (%)', nnpa: 'Net NPA / net Stage 3 (%)',
  pcr: 'Provision coverage (%)', crar: 'Capital adequacy, CRAR (%)', tier1: 'Tier 1 capital (%)', nim: 'Net interest margin, reported (%)', costOfFunds: 'Cost of funds, reported (%)', creditCost: 'Credit cost, reported (%)', costToIncome: 'Opex to net total income, reported (%)',
  roa: 'ROA, reported (%)', roe: 'ROE, reported (%)', provisions: 'Impairment / provisions (₹ cr)', feeIncome: 'Fees & other operating income (₹ cr)', deposits: 'Deposits (₹ cr)', casa: 'CASA ratio (%)', lcr: 'Liquidity coverage ratio (%)' };
const PCTK = /Pct|Ratio|Share|Yield|nim|npa|pcr|crar|tier|roa|roe|cost|margin|Growth|casa|lcr|stage/i;

function buildKpis(wb, M, { R, nH, hist, years }) {
  const ak = M.research?.company?.annualKpis || [];
  const labels = [...hist, ...years];
  const ws = wb.addWorksheet('KPIs', { views: [{ showGridLines: false, state: 'frozen', xSplit: 2, ySplit: 4 }], properties: { tabColor: { argb: 'FFA85FC0' } } });
  title(ws, `${M.meta.name}: Lender KPIs`, 'Section 1 links to the Model (green). Section 2: company-reported KPIs in blue; forecast columns link to the Model where it carries the same metric. Blank = not disclosed.');
  ws.getColumn(1).width = 52; ws.getColumn(2).width = 7; labels.forEach((_, i) => (ws.getColumn(3 + i).width = 11));
  header(ws, 4, ['KPI', 'Unit', ...labels], 3 + nH);
  const mref = (key, i) => `Model!${colL(2 + i)}${R[key]}`;
  const S = [];
  const L = (key, label, unit, hv, fv, opt = {}) => S.push({ key, label, unit, hv, fv, ...opt });
  S.push({ band: '1   CORE LENDER METRICS (from the Model)', level: 0 });
  const CORE = [['aum', 'AUM (year-end)', '₹ cr', 'num'], ['aumG', 'AUM growth', '%', 'pct'], ['nii', 'Net interest income', '₹ cr', 'num'], ['rNim', 'Net interest margin (NII ÷ average AUM)', '%', 'pct'],
    ['cti', 'Cost-to-income', '%', 'pct'], ['rCc', 'Credit cost (provisions ÷ average AUM)', '%', 'pct'], ['patAttrib', 'Attributable net profit', '₹ cr', 'num'], ['rRoa', 'ROA', '%', 'pct'], ['rRoe', 'ROE', '%', 'pct'],
    ['rLev', 'AUM ÷ net worth', 'x', 'd2'], ['rEqAum', 'Net worth ÷ AUM', '%', 'pct'], ['rBvps', 'Book value per share', '₹', 'd2']];
  for (const [k, label, unit, fmt] of CORE) L(`c_${k}`, label, unit, i => `IF(${mref(k, i)}="","",${mref(k, i)})`, i => mref(k, i), { fmt, bold: k === 'aum' || k === 'rRoe' });
  const keys = [...new Set(ak.flatMap(o => Object.keys(o)))].filter(k => k !== 'fy' && k !== 'src' && ak.some(o => isNum(o[k])));
  if (keys.length) {
    S.push({ band: '2   REPORTED KPIs (company disclosures)', level: 0 });
    for (const k of keys) {
      const map = KMAP[k];
      L(`k_${k}`, KLABEL[k] || pretty(k), PCTK.test(k) ? '%' : '', hist.map(l => { const x = ak.find(o => o.fy === l)?.[k]; return isNum(x) ? x : null; }),
        map ? i => `${mref(map[0], i)}${map[1] !== 1 ? `*${map[1]}` : ''}` : null, { fmt: PCTK.test(k) ? 'd2' : 'num' });
    }
  }
  writeRows(ws, S, { labels, nH, C0: 2, startRow: 5, ncol: 2 + labels.length });
}

function buildQuarterly(wb, M) {
  const Q = M.quarterly; if (!Q) return;
  const rq = M.raw?.tables?.quarters, qk = M.research?.company?.quarterlyKpis || [];
  const ql = Q.labels, n = ql.length;
  const rawRow = nm => Q.periods.map(p => { const i = rq ? rq.periods.indexOf(p) : -1, row = rq?.rows?.[nm]; return row && i >= 0 && isNum(row[i]) ? row[i] : null; });
  const ws = wb.addWorksheet('Quarterly', { views: [{ showGridLines: false, state: 'frozen', xSplit: 2, ySplit: 4 }], properties: { tabColor: { argb: 'FFCF8F1F' } } });
  title(ws, `${M.meta.name}: Quarterly results (lender format) and asset quality`, 'Reported in blue; derived lines are formulas. Q1 = Apr–Jun. YoY = vs the same quarter a year earlier. Screener "Expenses" = operating expenses excl. depreciation + provisions.');
  ws.getColumn(1).width = 52; ws.getColumn(2).width = 7; ql.forEach((_, i) => (ws.getColumn(3 + i).width = 11));
  header(ws, 4, ['₹ crore', 'Unit', ...ql], null);
  const S = [];
  const L = (key, label, unit, hv, opt = {}) => S.push({ key, label, unit, hv, ...opt });
  const has = a => a.some(isNum);
  S.push({ band: '1   PROFIT & LOSS', level: 0 });
  L('qsales', 'Total income (Revenue)', '₹ cr', Q.sales, { bold: true });
  L('qsalesG', 'Total income growth YoY', '%', 'yoy:qsales', { fmt: 'pct', italic: true, indent: 1 });
  L('qint', 'Interest expense', '₹ cr', Q.interest);
  L('qnti', 'Net total income (Revenue − interest)', '₹ cr', () => '{qsales}-{qint}', { bold: true });
  L('qntiG', 'Net total income growth YoY', '%', 'yoy:qnti', { fmt: 'pct', italic: true, indent: 1 });
  L('qexp', 'Expenses (opex excl. depreciation + provisions)', '₹ cr', Q.expenses);
  L('qfp', 'Financing profit (net total income − expenses)', '₹ cr', () => '{qnti}-{qexp}', { total: true });
  L('qfm', 'Financing margin (financing profit ÷ revenue)', '%', () => 'IFERROR({qfp}/{qsales},"")', { fmt: 'pct', italic: true, indent: 1 });
  L('qoi', 'Other income', '₹ cr', Q.otherIncome);
  L('qdep', 'Depreciation', '₹ cr', Q.dep);
  L('qpbt', 'Profit before tax', '₹ cr', () => '{qfp}+{qoi}-{qdep}', { bold: true, total: true });
  L('qtax', 'Tax', '₹ cr', () => '{qpbt}-{qpat}');
  L('qtaxR', 'Effective tax rate', '%', () => 'IFERROR({qtax}/{qpbt},"")', { fmt: 'pct', italic: true, indent: 1 });
  L('qpat', 'Net profit', '₹ cr', Q.pat, { bold: true, total: true });
  L('qpatG', 'Net profit growth YoY', '%', 'yoy:qpat', { fmt: 'pct', italic: true, indent: 1 });
  L('qeps', 'EPS', '₹', Q.eps, { fmt: 'd2' });
  const gn = rawRow('Gross NPA %'), nn = rawRow('Net NPA %');
  if (has(gn) || has(nn)) {
    S.push({ band: '2   ASSET QUALITY (as reported)', level: 0 });
    L('qgnpa', 'Gross NPA / Stage 3 (%)', '%', gn, { fmt: 'd2' });
    L('qnnpa', 'Net NPA / net Stage 3 (%)', '%', nn, { fmt: 'd2' });
    L('qpcr', 'Approximate provision coverage on Stage 3 = 1 − net ÷ gross', '%', () => 'IFERROR(1-{qnnpa}/{qgnpa},"")', { fmt: 'pct', italic: true, indent: 1 });
  }
  const keys = [...new Set(qk.flatMap(o => Object.keys(o)))].filter(k => !['q', 'src', 'commentary', 'marginDrivers'].includes(k) && qk.some(o => isNum(o[k])));
  if (keys.length) {
    S.push({ band: '3   REPORTED QUARTERLY KPIs (company disclosures)', level: 0 });
    for (const k of keys) L(`qk_${k}`, KLABEL[k] || pretty(k), PCTK.test(k) ? '%' : '', ql.map(l => { const o = qk.find(x => x.q === l); return o && isNum(o[k]) ? o[k] : null; }), { fmt: PCTK.test(k) ? 'd2' : 'num' });
  }
  let rr = 5; for (const s of S) s._row = rr++;
  const rowOf = k => S.find(x => x.key === k)._row;
  for (const s of S) if (typeof s.hv === 'string' && s.hv.startsWith('yoy:')) { const k = s.hv.slice(4); s.hv = i => (i >= 4 ? `IFERROR({${k}}/${colL(2 + i - 4)}${rowOf(k)}-1,"")` : null); }
  writeRows(ws, S, { labels: ql, nH: n, C0: 2, startRow: 5, ncol: 2 + n });
  const notes = qk.filter(x => x.marginDrivers || x.commentary);
  if (notes.length) {
    let r = 5 + S.length + 1;
    band(ws, r++, '4   WHAT MOVED THE NUMBERS EACH QUARTER (management commentary)', 2 + n, 0);
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
  title(ws, `${M.meta.name}: Quarterly revenue and margins since ${ql[0]}`, 'Long-run series (Screener). For a lender, the operating margin is the financing margin (financing profit ÷ revenue). Growth is a formula.');
  ws.getColumn(1).width = 40; ws.getColumn(2).width = 6; ql.forEach((_, i) => (ws.getColumn(3 + i).width = 9));
  header(ws, 4, ['', 'Unit', ...ql], null);
  const S = [
    { key: 'ls', label: 'Revenue (total income)', unit: '₹ cr', hv: LQ.map(x => x.sales), bold: true },
    { key: 'lsg', label: 'Revenue growth YoY', unit: '%', hv: i => (i >= 4 ? `IFERROR(${colL(2 + i)}5/${colL(2 + i - 4)}5-1,"")` : null), fmt: 'pct', italic: true },
    { key: 'lo', label: 'Financing margin', unit: '%', hv: LQ.map(x => x.opm), fmt: 'd1', bold: true },
    { key: 'ln', label: 'Net margin', unit: '%', hv: LQ.map(x => x.npm), fmt: 'd1' },
  ];
  writeRows(ws, S, { labels: ql, nH: n, C0: 2, startRow: 5, ncol: 2 + n });
}

// Reported cash flow (Screener line items). For a lender, loan growth sits inside operating cash flow
// ("Loans Advances"), so operating cash flow is negative while the book grows.
function buildCashFlow(wb, M) {
  const A = M.annual, sch = M.raw?.schedules?.['cash-flow']; if (!sch) return;
  const hist = A.labels, n = hist.length, isP = k => /^[A-Z][a-z]{2} \d{4}$/.test(k);
  const ws = wb.addWorksheet('Cash Flow (reported)', { views: [{ showGridLines: false, state: 'frozen', xSplit: 2, ySplit: 4 }] });
  title(ws, `${M.meta.name}: Cash flow as reported (₹ crore)`, 'Screener line items (blue). For a lender, loans disbursed net of repayments are an operating outflow, funded by borrowings in financing activities.');
  ws.getColumn(1).width = 46; ws.getColumn(2).width = 6; hist.forEach((_, i) => (ws.getColumn(3 + i).width = 11));
  header(ws, 4, ['₹ crore', 'Unit', ...hist], null);
  const S = [];
  for (const [parent, total, totalLabel] of [['Cash from Operating Activity', A.cfo, 'Cash from operating activities'], ['Cash from Investing Activity', A.cfi, 'Cash from investing activities'], ['Cash from Financing Activity', A.cff, 'Cash from financing activities']]) {
    S.push({ band: totalLabel, level: 1 });
    for (const [item, vals] of Object.entries(sch[parent] || {})) {
      if (!vals || typeof vals !== 'object') continue;
      const arr = A.periods.map(p => (isNum(vals[p]) ? vals[p] : null));
      if (!arr.some(x => isNum(x) && x !== 0) || !Object.keys(vals).some(isP)) continue;
      S.push({ key: `cf${S.length}`, label: item.replace(/ fin$/, '').replace(/ n /g, ' & '), unit: '₹ cr', hv: arr, indent: 1 });
    }
    S.push({ key: `cft${S.length}`, label: totalLabel, unit: '₹ cr', hv: total, bold: true, total: true });
  }
  S.push({ key: 'ncf', label: 'Net cash flow', unit: '₹ cr', hv: A.netCash, bold: true, total: true });
  writeRows(ws, S, { labels: hist, nH: n, C0: 2, startRow: 5, ncol: 2 + n });
}

module.exports = { buildValuation, buildKpis, buildQuarterly, buildLongQuarterly, buildCashFlow };
