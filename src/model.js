// The analysis engine: raw source data for one company → one normalised model the UI renders.
// Generic across companies: rows are looked up by label aliases, anything missing stays null.
// Usage: node src/model.js MARUTI   (writes data/models/MARUTI.json)
const fs = require('fs');
const path = require('path');
const { loadBenchmark } = require('./benchmark');
const { buildInsights } = require('./insights');
const { buildForecast } = require('./forecast');
const { status: coverageStatus } = require('./coverage');

const ROOT = path.join(__dirname, '..');
const rawDir = sym => path.join(ROOT, 'data', 'raw', sym);
const MODELS = path.join(ROOT, 'data', 'models');

// ---------- small numeric helpers ----------
const isNum = v => typeof v === 'number' && Number.isFinite(v);
const div = (a, b) => (isNum(a) && isNum(b) && b !== 0 ? a / b : null);
const pct = (a, b) => { const r = div(a, b); return r == null ? null : r * 100; };
const growth = (cur, prev) => (isNum(cur) && isNum(prev) && prev > 0 ? (cur / prev - 1) * 100 : null);
const cagr = (end, start, years) => (isNum(end) && isNum(start) && start > 0 && end > 0 && years > 0 ? (Math.pow(end / start, 1 / years) - 1) * 100 : null);
const avg2 = (arr, i) => (i > 0 && isNum(arr[i - 1]) && isNum(arr[i]) ? (arr[i] + arr[i - 1]) / 2 : arr[i]);
const r1 = v => (isNum(v) ? Math.round(v * 10) / 10 : null);
const r2 = v => (isNum(v) ? Math.round(v * 100) / 100 : null);
const zip = (a, b, f) => a.map((x, i) => f(x, b[i], i));
const sum = arr => arr.reduce((s, v) => s + (isNum(v) ? v : 0), 0);

function stats(values) {
  const v = values.filter(isNum).sort((a, b) => a - b);
  if (!v.length) return null;
  const mean = v.reduce((s, x) => s + x, 0) / v.length;
  const sd = Math.sqrt(v.reduce((s, x) => s + (x - mean) ** 2, 0) / v.length);
  const q = p => v[Math.min(v.length - 1, Math.floor(p * v.length))];
  return { mean, sd, median: q(0.5), min: v[0], max: v[v.length - 1], p25: q(0.25), p75: q(0.75), n: v.length };
}
const percentileOf = (values, x) => { const v = values.filter(isNum); return v.length && isNum(x) ? (v.filter(y => y <= x).length / v.length) * 100 : null; };

// ---------- period labels (Indian fiscal year, Apr–Mar) ----------
const MON = { Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12 };
function fyLabel(p) {
  const [m, y] = p.split(' ');
  if (!y) return p; // "TTM"
  return m === 'Mar' ? `FY${y.slice(2)}` : `${m}${y.slice(2)}`;
}
function qLabel(p) {
  const [m, y] = p.split(' ');
  const mm = MON[m];
  const fy = mm <= 3 ? +y : +y + 1;
  const q = mm <= 3 ? 4 : mm <= 6 ? 1 : mm <= 9 ? 2 : 3;
  return `Q${q}FY${String(fy).slice(2)}`;
}
const quarterKey = d => { const [y, m] = d.split('-').map(Number); return `${['Mar', 'Jun', 'Sep', 'Dec'][Math.floor((m - 1) / 3)]} ${y}`; };

// Screener labels differ for banks / NBFCs; first alias found wins.
const ALIAS = {
  sales: ['Sales', 'Revenue'], expenses: ['Expenses'], ebitda: ['Operating Profit', 'Financing Profit'], opm: ['OPM %', 'Financing Margin %'],
  otherIncome: ['Other Income'], interest: ['Interest'], dep: ['Depreciation'], pbt: ['Profit before tax'], taxPct: ['Tax %'],
  pat: ['Net Profit'], eps: ['EPS in Rs'], payout: ['Dividend Payout %'],
  equity: ['Equity Capital', 'Share Capital'], reserves: ['Reserves'], borrowings: ['Borrowings', 'Borrowing'], deposits: ['Deposits'],
  otherLiab: ['Other Liabilities'], totalLiab: ['Total Liabilities'], fixedAssets: ['Fixed Assets', 'Net Block'], cwip: ['CWIP'],
  investments: ['Investments'], otherAssets: ['Other Assets'], totalAssets: ['Total Assets'],
  cfo: ['Cash from Operating Activity'], cfi: ['Cash from Investing Activity'], cff: ['Cash from Financing Activity'], netCash: ['Net Cash Flow'], fcf: ['Free Cash Flow'],
  debtorDays: ['Debtor Days'], inventoryDays: ['Inventory Days'], payableDays: ['Days Payable'], ccc: ['Cash Conversion Cycle'], wcDays: ['Working Capital Days'], roce: ['ROCE %'],
};
function pick(table, key) {
  if (!table) return null;
  for (const a of ALIAS[key] || [key]) {
    const hit = Object.keys(table.rows).find(k => k === a || k.startsWith(a + ' '));
    if (hit) return table.rows[hit];
  }
  return null;
}
// Schedule (line-item) values arrive as {period: value}; align them to a period list.
function sched(raw, section, parent, item, periods) {
  const s = raw.schedules?.[section]?.[parent]?.[item];
  return s ? periods.map(p => (isNum(s[p]) ? s[p] : null)) : periods.map(() => null);
}

function buildAnnual(raw) {
  const pl = raw.tables['profit-loss'], bs = raw.tables['balance-sheet'], cf = raw.tables['cash-flow'], rt = raw.tables.ratios;
  // P&L carries a TTM column; balance sheet / cash flow don't. Align everything on the FY columns.
  const periods = pl.periods.filter(p => p !== 'TTM');
  const n = periods.length;
  const fromTable = (t, key) => {
    const row = pick(t, key);
    if (!row) return Array(n).fill(null);
    return periods.map(p => { const i = t.periods.indexOf(p); return i >= 0 ? row[i] ?? null : null; });
  };
  const A = { periods, labels: periods.map(fyLabel) };
  for (const k of ['sales', 'expenses', 'ebitda', 'opm', 'otherIncome', 'interest', 'dep', 'pbt', 'taxPct', 'pat', 'eps', 'payout']) A[k] = fromTable(pl, k);
  for (const k of ['equity', 'reserves', 'borrowings', 'deposits', 'otherLiab', 'totalLiab', 'fixedAssets', 'cwip', 'investments', 'otherAssets', 'totalAssets']) A[k] = fromTable(bs, k);
  for (const k of ['cfo', 'cfi', 'cff', 'netCash', 'fcf']) A[k] = fromTable(cf, k);
  for (const k of ['debtorDays', 'inventoryDays', 'payableDays', 'ccc', 'wcDays', 'roce']) A[k] = fromTable(rt, k);

  const S = (sec, par, item) => sched(raw, sec, par, item, periods);
  A.materialPct = S('profit-loss', 'Expenses', 'Material Cost %');
  A.manufacturingPct = S('profit-loss', 'Expenses', 'Manufacturing Cost %');
  A.employeePct = S('profit-loss', 'Expenses', 'Employee Cost %');
  A.otherCostPct = S('profit-loss', 'Expenses', 'Other Cost %');
  A.exceptional = S('profit-loss', 'Other Income', 'Exceptional items');
  A.patExExceptional = S('profit-loss', 'Net Profit', 'Profit excl Excep');
  A.inventories = S('balance-sheet', 'Other Assets', 'Inventories');
  A.receivables = S('balance-sheet', 'Other Assets', 'Trade receivables');
  A.cash = S('balance-sheet', 'Other Assets', 'Cash Equivalents');
  A.payables = S('balance-sheet', 'Other Liabilities', 'Trade Payables');
  A.customerAdvances = S('balance-sheet', 'Other Liabilities', 'Advance from Customers');
  A.grossBlock = S('balance-sheet', 'Fixed Assets', 'Gross Block');
  A.capex = S('cash-flow', 'Cash from Investing Activity', 'Fixed assets purchased').map(v => (isNum(v) ? -v : null));
  A.acquisitions = S('cash-flow', 'Cash from Investing Activity', 'Acquisition of companies').map(v => (isNum(v) ? -v : null));
  A.dividendsPaid = S('cash-flow', 'Cash from Financing Activity', 'Dividends paid').map(v => (isNum(v) ? -v : null));
  A.wcChange = S('cash-flow', 'Cash from Operating Activity', 'Working capital changes');
  A.taxesPaid = S('cash-flow', 'Cash from Operating Activity', 'Direct taxes').map(v => (isNum(v) ? -v : null));

  // ---- derived ----
  A.netWorth = zip(A.equity, A.reserves, (e, r) => (isNum(e) && isNum(r) ? e + r : null));
  A.shares = zip(A.pat, A.eps, (p, e) => div(p, e)); // crore shares, implied
  A.bvps = zip(A.netWorth, A.shares, div);
  A.dps = A.eps.map((e, i) => (isNum(e) && isNum(A.payout[i]) ? (e * A.payout[i]) / 100 : null));
  A.ebit = zip(A.pbt, A.interest, (p, i) => (isNum(p) ? p + (i || 0) : null));
  A.ebitdaMargin = zip(A.ebitda, A.sales, pct);
  A.ebitMargin = zip(A.ebit, A.sales, pct);
  A.pbtMargin = zip(A.pbt, A.sales, pct);
  A.npm = zip(A.pat, A.sales, pct);
  A.grossMargin = A.materialPct.map(m => (isNum(m) ? 100 - m : null));
  A.otherIncomeShare = zip(A.otherIncome, A.pbt, pct);
  A.depPct = zip(A.dep, A.sales, pct);
  A.salesGrowth = A.sales.map((v, i) => growth(v, A.sales[i - 1]));
  A.ebitdaGrowth = A.ebitda.map((v, i) => growth(v, A.ebitda[i - 1]));
  A.patGrowth = A.pat.map((v, i) => growth(v, A.pat[i - 1]));
  A.epsGrowth = A.eps.map((v, i) => growth(v, A.eps[i - 1]));
  A.roe = A.pat.map((p, i) => pct(p, avg2(A.netWorth, i)));
  A.roa = A.pat.map((p, i) => pct(p, avg2(A.totalAssets, i)));
  A.assetTurnover = A.sales.map((s, i) => div(s, avg2(A.totalAssets, i)));
  A.fixedAssetTurnover = A.sales.map((s, i) => div(s, avg2(A.fixedAssets, i)));
  A.leverage = A.totalAssets.map((t, i) => div(avg2(A.totalAssets, i), avg2(A.netWorth, i)));
  A.debtEquity = zip(A.borrowings, A.netWorth, div);
  A.cashAndInvestments = zip(A.cash, A.investments, (c, v) => (isNum(c) || isNum(v) ? (c || 0) + (v || 0) : null));
  A.netDebt = zip(A.borrowings, A.cashAndInvestments, (b, c) => (isNum(b) ? b - (c || 0) : null));
  A.interestCover = zip(A.ebit, A.interest, (e, i) => (isNum(i) && i > 0 ? e / i : null));
  A.cfoToEbitda = zip(A.cfo, A.ebitda, pct);
  A.cfoToPat = zip(A.cfo, A.pat, pct);
  A.fcfCalc = zip(A.cfo, A.capex, (c, x) => (isNum(c) && isNum(x) ? c - x : null));
  A.fcfToPat = zip(A.fcfCalc, A.pat, pct);
  A.capexToSales = zip(A.capex, A.sales, pct);
  A.capexToDep = zip(A.capex, A.dep, div);
  A.capitalEmployed = zip(A.netWorth, A.borrowings, (n, b) => (isNum(n) ? n + (b || 0) : null));
  // Return on capital excluding the treasury book: EBIT less other income over operating capital.
  A.coreRoce = A.ebit.map((e, i) => {
    const opCap = isNum(A.capitalEmployed[i]) ? A.capitalEmployed[i] - (A.cashAndInvestments[i] || 0) : null;
    return isNum(e) && isNum(opCap) && opCap > 0 ? ((e - (A.otherIncome[i] || 0)) / opCap) * 100 : null;
  });
  // Incremental return: change in EBIT over change in capital employed across 3 years.
  A.incrementalRoce = A.ebit.map((e, i) => (i >= 3 ? pct(e - A.ebit[i - 3], A.capitalEmployed[i] - A.capitalEmployed[i - 3]) : null));
  const t = pl.periods.indexOf('TTM');
  A.ttm = t >= 0 ? Object.fromEntries(['sales', 'expenses', 'ebitda', 'opm', 'otherIncome', 'interest', 'dep', 'pbt', 'taxPct', 'pat', 'eps'].map(k => [k, pick(pl, k)?.[t] ?? null])) : null;

  const last = n - 1;
  A.cagr = {};
  for (const k of ['sales', 'ebitda', 'pat', 'eps', 'bvps', 'dps']) {
    A.cagr[k] = Object.fromEntries([3, 5, 10].map(y => [`${y}y`, last - y >= 0 ? r1(cagr(A[k][last], A[k][last - y], y)) : null]));
  }
  A.cumulative = {
    years: n,
    cfo: sum(A.cfo), capex: sum(A.capex), fcf: sum(A.fcfCalc), dividends: sum(A.dividendsPaid), acquisitions: sum(A.acquisitions), pat: sum(A.pat),
  };
  return A;
}

function buildQuarterly(raw) {
  const q = raw.tables.quarters;
  if (!q) return null;
  const periods = q.periods;
  const Q = { periods, labels: periods.map(qLabel) };
  for (const k of ['sales', 'expenses', 'ebitda', 'opm', 'otherIncome', 'interest', 'dep', 'pbt', 'taxPct', 'pat', 'eps']) Q[k] = pick(q, k) || periods.map(() => null);
  const S = (par, item) => sched(raw, 'quarters', par, item, periods);
  Q.salesYoY = S('Sales', 'YOY Sales Growth %');
  Q.patYoY = S('Net Profit', 'YOY Profit Growth %');
  Q.materialPct = S('Expenses', 'Material Cost %');
  Q.employeePct = S('Expenses', 'Employee Cost %');
  Q.npm = zip(Q.pat, Q.sales, pct);
  Q.otherIncomeShare = zip(Q.otherIncome, Q.pbt, pct);
  Q.salesQoQ = Q.sales.map((v, i) => growth(v, Q.sales[i - 1]));
  Q.ebitdaYoY = Q.ebitda.map((v, i) => (i >= 4 ? growth(v, Q.ebitda[i - 4]) : null));
  return Q;
}

// 20 years of quarterly sales and margins from the chart series.
function buildLongQuarterly(raw) {
  const m = raw.charts?.margins;
  if (!m?.OPM) return null;
  const byQ = {};
  for (const [series, key] of [['Quarter Sales', 'sales'], ['GPM', 'gpm'], ['OPM', 'opm'], ['NPM', 'npm']]) {
    for (const [d, v] of m[series] || []) (byQ[d] ||= { date: d })[key] = v;
  }
  const rows = Object.values(byQ).sort((a, b) => a.date.localeCompare(b.date));
  rows.forEach((r, i) => {
    r.label = qLabel(quarterKey(r.date));
    r.salesYoY = i >= 4 ? r1(growth(r.sales, rows[i - 4].sales)) : null;
  });
  return rows;
}

function valuationBlock(series, priceNow) {
  if (!series?.length) return null;
  const pts = series.filter(([, v]) => isNum(v) && v > 0);
  if (!pts.length) return null;
  const lastDate = new Date(pts[pts.length - 1][0]);
  const since = yrs => { const c = new Date(lastDate); c.setFullYear(c.getFullYear() - yrs); const iso = c.toISOString().slice(0, 10); return pts.filter(([d]) => d >= iso).map(([, v]) => v); };
  const all = pts.map(([, v]) => v);
  const current = all[all.length - 1];
  const out = { current, series: pts, windows: {} };
  for (const [k, vals] of [['all', all], ['10y', since(10)], ['5y', since(5)], ['3y', since(3)]]) {
    const s = stats(vals);
    if (!s) continue;
    out.windows[k] = { ...Object.fromEntries(Object.entries(s).map(([a, b]) => [a, r2(b)])), percentile: r1(percentileOf(vals, current)), zScore: r2(s.sd ? (current - s.mean) / s.sd : null) };
  }
  // Price the stock would trade at if the multiple reverted to its 10-year median (same earnings base);
  // median, not mean, so earnings-trough spikes in the multiple don't inflate it.
  const w = out.windows['10y'] || out.windows.all;
  if (isNum(priceNow) && w) out.impliedPriceAtMedian = Math.round((priceNow * w.median) / current);
  return out;
}

function priceBlock(raw, bench) {
  const px = (raw.charts?.price?.Price || []).filter(([, v]) => isNum(v));
  if (!px.length) return null;
  const last = px[px.length - 1];
  const at = (yrs) => { const c = new Date(last[0]); c.setFullYear(c.getFullYear() - yrs); const iso = c.toISOString().slice(0, 10); return px.find(([d]) => d >= iso); };
  const returns = {};
  for (const y of [1, 3, 5, 10, 15, 20]) { const p = at(y); if (p && p[0] > px[0][0]) returns[`${y}y`] = r1(y === 1 ? growth(last[1], p[1]) : cagr(last[1], p[1], y)); }
  let peak = 0, maxDd = 0, maxDdDate = null;
  const drawdown = px.map(([d, v]) => { peak = Math.max(peak, v); const dd = (v / peak - 1) * 100; if (dd < maxDd) { maxDd = dd; maxDdDate = d; } return [d, r1(dd)]; });
  const yr = px.filter(([d]) => d >= at(1)?.[0]);
  // Relative performance: both rebased to 100 from the first common date.
  let relative = null;
  if (bench.length) {
    const b0 = bench[0][0];
    const stock = px.filter(([d]) => d >= b0);
    let j = 0;
    const rows = [];
    for (const [d, v] of stock) {
      while (j + 1 < bench.length && bench[j + 1][0] <= d) j++;
      if (bench[j][0] <= d) rows.push([d, v, bench[j][1]]);
    }
    if (rows.length) {
      const [, s0, i0] = rows[0];
      relative = { start: rows[0][0], series: rows.map(([d, s, i]) => [d, r1((s / s0) * 100), r1((i / i0) * 100)]) };
      const [, sN, iN] = rows[rows.length - 1];
      const yrs = (new Date(rows[rows.length - 1][0]) - new Date(rows[0][0])) / (365.25 * 864e5);
      relative.stockCagr = r1(cagr(sN, s0, yrs));
      relative.indexCagr = r1(cagr(iN, i0, yrs));
      const oneY = rows.find(([d]) => d >= at(1)?.[0]);
      if (oneY) { relative.stock1y = r1(growth(sN, oneY[1])); relative.index1y = r1(growth(iN, oneY[2])); }
    }
  }
  return {
    last: last[1], lastDate: last[0], series: px, dma50: raw.charts.price.DMA50, dma200: raw.charts.price.DMA200,
    high52: Math.max(...yr.map(([, v]) => v)), low52: Math.min(...yr.map(([, v]) => v)), allTimeHigh: peak,
    returns, drawdown, maxDrawdown: r1(maxDd), maxDrawdownDate: maxDdDate, currentDrawdown: drawdown[drawdown.length - 1][1], relative,
  };
}

// Actuals + estimates on one axis (FY15 … FY29E) for the report's exhibits.
function combinedSeries(A, F) {
  const out = { labels: [...A.labels, ...F.years], nActual: A.labels.length };
  const map = { sales: 'sales', ebitda: 'ebitda', ebitdaMargin: 'ebitdaMargin', dep: 'dep', otherIncome: 'otherIncome', pbt: 'pbt', pat: 'pat', eps: 'eps', dps: 'dps', capex: 'capex', cfo: 'cfo', fcf: ['fcfCalc', 'fcf'], netWorth: 'netWorth', bvps: 'bvps', roe: 'roe', coreRoce: 'coreRoce', salesGrowth: 'salesGrowth', ebitdaGrowth: 'ebitdaGrowth', patGrowth: 'patGrowth', epsGrowth: 'epsGrowth', treasury: ['cashAndInvestments', 'treasury'] };
  for (const [k, src] of Object.entries(map)) {
    const [a, f] = Array.isArray(src) ? src : [src, src];
    out[k] = [...(A[a] || A.labels.map(() => null)), ...(F[f] || F.years.map(() => null))];
  }
  out.ebitMargin = out.labels.map((_, i) => (isNum(out.ebitda[i]) && isNum(out.dep[i]) ? (out.ebitda[i] - out.dep[i]) / out.sales[i] * 100 : null));
  out.npm = out.labels.map((_, i) => pct(out.pat[i], out.sales[i]));
  out.capexToSales = out.labels.map((_, i) => pct(out.capex[i], out.sales[i]));
  out.otherIncomeShare = out.labels.map((_, i) => pct(out.otherIncome[i], out.pbt[i]));
  return out;
}

function readJson(file) { try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return null; } }

// ---------- as-of freeze ----------
// A published report is fixed at its as-of date: results, balance sheets and shareholding that
// were not public by then are dropped, and prices/multiples stop at that date. Results count as
// public ~45 days after quarter-end (60 for the March quarter / annual), shareholding ~21 days.
const MON_END = { Mar: 2, Jun: 5, Sep: 8, Dec: 11 };
function releasedBy(period, asOf, lag) {
  const [m, y] = String(period).split(' ');
  if (!(m in MON_END) || !y) return true; // 'TTM' etc.
  const end = new Date(Date.UTC(+y, MON_END[m] + 1, 0));
  end.setUTCDate(end.getUTCDate() + (lag ?? (m === 'Mar' ? 60 : 45)));
  return end.toISOString().slice(0, 10) <= asOf;
}
function freezeAsOf(raw, asOf) {
  const R = JSON.parse(JSON.stringify(raw));
  const live = { quarter: raw.tables?.quarters ? qLabel(raw.tables.quarters.periods.at(-1)) : null, price: raw.charts?.price?.Price?.at(-1) };
  for (const t of Object.values(R.tables || {})) {
    const keep = t.periods.map(p => releasedBy(p, asOf));
    t.periods = t.periods.filter((_, i) => keep[i]);
    for (const k of Object.keys(t.rows)) t.rows[k] = t.rows[k].filter((_, i) => keep[i]);
  }
  for (const sec of Object.values(R.schedules || {})) for (const par of Object.values(sec || {})) for (const item of Object.values(par || {}))
    if (item && typeof item === 'object') for (const p of Object.keys(item)) if (/^[A-Z][a-z]{2} \d{4}$/.test(p) && !releasedBy(p, asOf)) delete item[p];
  // TTM = last four released quarters
  const q = R.tables?.quarters, pl = R.tables?.['profit-loss'], t = pl?.periods.indexOf('TTM');
  if (q && pl && t >= 0) for (const k of Object.keys(pl.rows)) {
    const qr = q.rows[k]; if (!qr || /%/.test(k)) { if (/%/.test(k)) pl.rows[k][t] = null; continue; }
    const last4 = qr.slice(-4); pl.rows[k][t] = last4.length === 4 && last4.every(isNum) ? r2(sum(last4)) : null;
  }
  if (R.shareholding?.quarterly) {
    const S = R.shareholding.quarterly, keep = S.periods.map(p => releasedBy(p, asOf, 21));
    S.periods = S.periods.filter((_, i) => keep[i]);
    for (const k of Object.keys(S.rows)) S.rows[k] = S.rows[k].filter((_, i) => keep[i]);
  }
  for (const [name, ch] of Object.entries(R.charts || {})) for (const k of Object.keys(ch || {}))
    if (Array.isArray(ch[k])) ch[k] = ch[k].filter(([d]) => (name === 'margins' ? releasedBy(quarterKey(d), asOf) : d <= asOf));
  // Exact closing price on the as-of date, when the exchange close is on file (Screener's series is weekly).
  const closes = readJson(path.join(ROOT, 'data', 'market', 'closes', `${asOf}.json`));
  const close = closes?.closes?.[R.symbol];
  if (isNum(close) && R.charts?.price?.Price && (R.charts.price.Price.at(-1)?.[0] || '') < asOf) R.charts.price.Price.push([asOf, close]);
  // headline ratios at the as-of price
  const px = R.charts?.price?.Price || [], last = px[px.length - 1];
  const n = s => (s ? Number(String(s).replace(/[^0-9.\-]/g, '')) : null);
  const top = R.topRatios || {};
  if (last) {
    const shares = n(top['Market Cap']) / n(top['Current Price']);
    const yr = px.filter(([d]) => d >= `${+asOf.slice(0, 4) - 1}${asOf.slice(4)}`).map(([, v]) => v);
    const ttmEps = pl && t >= 0 ? pick(pl, 'eps')?.[t] : null;
    top['Current Price'] = `₹ ${last[1]}`;
    if (isNum(shares)) top['Market Cap'] = `₹ ${Math.round(shares * last[1])} Cr.`;
    top['High / Low'] = `₹ ${Math.max(...yr)} / ${Math.min(...yr)}`;
    if (isNum(ttmEps) && ttmEps > 0) top['Stock P/E'] = String(r1(last[1] / ttmEps));
  }
  R.asOf = asOf;
  return { raw: R, live };
}

function buildModel(symbol) {
  let raw = readJson(path.join(rawDir(symbol), 'screener.json'));
  if (!raw) throw new Error(`No raw data for ${symbol}; run fetch first`);
  // Per-company data correction (e.g. UPL: Net Profit on the attributable basis), applied on every
  // build so a fresh Screener fetch cannot undo it: tools/authoring/<SYM>.patch.js exporting patchRaw.
  const patchFile = path.join(ROOT, 'tools', 'authoring', `${symbol}.patch.js`);
  if (fs.existsSync(patchFile)) { const p = require(patchFile); if (typeof p.patchRaw === 'function') raw = p.patchRaw(raw); }
  const research = {};
  for (const k of ['street', 'company', 'industry', 'story', 'assumptions', 'initiation', 'deepdive', 'governance', 'products', 'statements', 'segments', 'history']) research[k] = readJson(path.join(rawDir(symbol), 'research', `${k}.json`));
  // The report is frozen at its as-of date (assumptions.asOf); live values are kept for the library.
  const asOf = research.assumptions?.asOf || null;
  const liveQuarter = raw.tables?.quarters ? qLabel(raw.tables.quarters.periods.at(-1)) : null, livePx = raw.charts?.price?.Price?.at(-1);
  if (asOf) raw = freezeAsOf(raw, asOf).raw;

  const annual = buildAnnual(raw);
  const quarterly = buildQuarterly(raw);
  const longQuarterly = buildLongQuarterly(raw);
  const price = priceBlock(raw, loadBenchmark());
  const valuation = {
    pe: valuationBlock(raw.charts?.pe?.['Price to Earning'], price?.last),
    evEbitda: valuationBlock(raw.charts?.evEbitda?.['EV Multiple'], price?.last),
    pb: valuationBlock(raw.charts?.pb?.['Price to book value'], price?.last),
    mcapSales: valuationBlock(raw.charts?.mcapSales?.['Market Cap to Sales'], price?.last),
    epsTtm: raw.charts?.pe?.EPS || [],
    bookValue: raw.charts?.pb?.['Book value'] || [],
    ebitdaTtm: raw.charts?.evEbitda?.EBITDA || [],
  };
  const top = raw.topRatios || {};
  const n = s => (s ? Number(String(s).replace(/[^0-9.\-]/g, '')) : null);
  const meta = {
    symbol, name: raw.name, about: raw.about, keyPoints: raw.keyPoints, sectorPath: (raw.sectorPath || []).slice(0, 4),
    indices: (raw.sectorPath || []).slice(4), links: raw.links, pros: raw.pros, cons: raw.cons,
    marketCap: n(top['Market Cap']), price: n(top['Current Price']), pe: n(top['Stock P/E']), bookValue: n(top['Book Value']),
    dividendYield: n(top['Dividend Yield']), roce: n(top['ROCE']), roe: n(top['ROE']), faceValue: n(top['Face Value']),
    fetchedAt: raw.fetchedAt, source: raw.source, basis: raw.basis || 'consolidated',
    asOf, liveQuarter, livePrice: livePx?.[1] ?? null, livePriceDate: livePx?.[0] ?? null,
  };
  // Screener's 52-week range uses intraday highs/lows; prefer it over our weekly closes.
  const hl = String(top['High / Low'] || '').replace(/[₹,\s]/g, '').split('/').map(Number);
  if (price && hl.length === 2 && hl.every(isNum)) [price.high52, price.low52] = hl;
  const shareholding = raw.shareholding?.quarterly ? { periods: raw.shareholding.quarterly.periods, rows: raw.shareholding.quarterly.rows } : null;
  const model = {
    meta, annual, quarterly, longQuarterly, valuation, price, shareholding, peers: raw.peers, growthBoxes: raw.growth,
    documents: raw.documents, research, builtAt: new Date().toISOString(),
  };
  model.insights = buildInsights(model);
  if (research.assumptions) {
    model.forecast = buildForecast(model, research.assumptions);
    model.fin = combinedSeries(annual, model.forecast.F);
    if (model.forecast.finExtra) { Object.assign(model.fin, model.forecast.finExtra); delete model.forecast.finExtra; } // lender lines (aum, nii, nim, roa…) with history
  }
  // Published call (rating, target) comes from the coverage log, not the authoring files.
  if (research.history?.events?.length && model.forecast) {
    model.coverage = coverageStatus(model, research.history);
    if (model.coverage && research.initiation) research.initiation.rating = model.coverage.rating;
  }
  // Company KPIs (research) on the same FY axis as the statements, extended with forecast values of
  // the same name (e.g. units, gwp, combinedRatio). Used by report exhibits as kfin.<key>.
  const ak = research.company?.annualKpis;
  if (ak?.length) {
    const labels = model.fin?.labels || annual.labels;
    const F = model.forecast?.F || {};
    const nA = model.fin?.nActual ?? annual.labels.length;
    const alias = { units: 'volume' };
    const keys = new Set([...ak.flatMap(r => Object.keys(r)), ...Object.keys(F)].filter(k => k !== 'fy' && k !== 'src' && k !== 'years'));
    model.kfin = { labels };
    for (const k of keys) {
      const fk = F[k] ? k : F[alias[k]] ? alias[k] : null;
      if (!ak.some(r => isNum(r[k])) && !fk) continue;
      model.kfin[k] = labels.map((l, i) => (i < nA ? ak.find(r => r.fy === l)?.[k] ?? null : fk && Array.isArray(F[fk]) ? F[fk][i - nA] ?? null : null));
    }
    // Growth series (e.g. gwpGrowth) for actual years, derived from the level series.
    for (const k of Object.keys(model.kfin)) {
      const base = k.endsWith('Growth') && model.kfin[k.slice(0, -6)];
      if (base) model.kfin[k] = model.kfin[k].map((v, i) => v ?? (i && isNum(base[i]) && isNum(base[i - 1]) && base[i - 1] > 0 ? (base[i] / base[i - 1] - 1) * 100 : null));
    }
  }
  return model;
}

function writeModel(symbol) {
  const m = buildModel(symbol);
  fs.mkdirSync(MODELS, { recursive: true });
  fs.writeFileSync(path.join(MODELS, `${symbol}.json`), JSON.stringify(m));
  return m;
}

module.exports = { buildModel, writeModel, stats, cagr, growth };

if (require.main === module) {
  const sym = (process.argv[2] || 'MARUTI').toUpperCase();
  const m = writeModel(sym);
  console.log(`${m.meta.name}: ${m.annual.labels[0]}–${m.annual.labels.at(-1)}, ${m.quarterly?.labels.length} qtrs, ${m.longQuarterly?.length} long qtrs, ${Object.keys(m.insights).length} insight chapters`);
}
