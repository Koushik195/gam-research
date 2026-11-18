// Authoring source for the Gujarat State Fertilizers & Chemicals (GSFC) initiating-coverage report (as of 30-Sep-2026).
// Part A (this file): chapters built on reported financials (Screener, consolidated) + the writer.
// Part B (GSFC.research.js, merging GSFC.part2-5.js on GSFC.ctx.js) adds the business, history, industry,
// segments, portfolio, moat, quality, ownership, governance, forecasts, street, valuation and verdict chapters.
// Usage: node tools/authoring/GSFC.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'GSFC', 'research');
const SCR = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8')).tables.ratios;
const RL = SCR.periods.map(p => 'FY' + p.slice(-2));
const SRC = { co: 'Company filings, Screener.in (consolidated), GAM Research' };
const M = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'models', 'GSFC.json'), 'utf8'));
const A = M.annual, ix = l => A.labels.indexOf(l);
const sumY = (k, from, to) => { let s = 0; for (let i = ix(from); i <= ix(to); i++) s += A[k][i] || 0; return s; };
const n0 = v => Math.round(v).toLocaleString('en-IN');
const cf = (a, b) => ({ cfo: sumY('cfo', a, b), capex: sumY('capex', a, b), div: sumY('dividendsPaid', a, b), pat: sumY('pat', a, b) });
const P1 = cf('FY19', 'FY22'), P2 = cf('FY23', 'FY26'), PT = cf('FY19', 'FY26');
const row = f => [P1, P2, PT].map(p => n0(f(p)));
const INV = 4609.70, NC26 = 1333, F = M.forecast.F;

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Revenue doubled in eleven years; profit only moves when a boom arrives',
  blocks: [
    { p: 'GSFC\'s revenue rose from ₹5,311 cr in FY15 to ₹10,946 cr in FY26, but most of that is fertiliser prices and subsidy, not volume: manufactured fertiliser sales were 16.0 lakh t in FY19 and 17.7 lakh t in FY26. Profit has had one good spell. In FY22-23 a global price boom lifted EBITDA to ₹1,321-1,588 cr and net profit to ₹1,266 cr (EPS ₹31.8). Outside that spell net profit has been ₹410-675 cr a year (₹110 cr in FY20, when industrial products lost ₹69 cr at the EBIT level), and FY26\'s ₹673 cr (EPS ₹16.9) is 65% above FY15\'s ₹409 cr: 4.6% a year. EBITDA margin was 7.2% in FY26. Other income (dividends from the share portfolio and interest) was ₹287 cr, a third of profit before tax. Q1FY27: revenue +64% to ₹3,583 cr on the Middle East price shock, PAT +14% to ₹159 cr.' },
    { pair: [
      { type: 'column', title: 'Revenue: price-driven, peaked in FY23', unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY17', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num', growth: true }], source: SRC.co },
      { type: 'column', title: 'Net profit: one boom (FY22-23), otherwise ₹450-675 cr', unit: 'Net profit (₹ crore)', x: 'fin.labels', from: 'FY17', to: 'FY26', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: 14-15% in the boom, ~7% now', unit: 'EBITDA margin (%)', x: 'fin.labels', from: 'FY17', to: 'FY26', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 0, max: 16, source: SRC.co },
      { type: 'column', title: 'Other income is a third of pre-tax profit', unit: 'Other income as % of PBT', x: 'fin.labels', from: 'FY17', to: 'FY26', series: [{ name: 'Other income / PBT', ref: 'fin.otherIncomeShare', fmt: 'pct0' }], labels: 'all', source: SRC.co },
    ] },
    { callout: '**Our view:** GSFC is a commodity producer whose margins are set by two outside forces: the government\'s subsidy tables for fertilisers and Chinese supply for caprolactam, nylon and melamine. When both line up (FY22-23) profit doubles; when they do not, the business earns a mid-single-digit return on its capital and the dividend and interest income from the portfolio does much of the work.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capex & returns', kicker: 'Capital allocation', title: 'Profits have not turned into cash since FY24, and a new capex cycle is starting',
  blocks: [
    { p: `In FY19-22 GSFC generated ₹${n0(P1.cfo)} cr of operating cash (helped by a ₹1,054 cr working-capital release in FY21), spent ₹${n0(P1.capex)} cr on plants and cut borrowings from ₹1,559 cr (Mar-20) to ₹6 cr (Mar-22). In FY23-26 it earned ₹${n0(P2.pat)} cr of profit but only ₹${n0(P2.cfo)} cr of operating cash, because subsidy receivables, inventory and traded stock rose; capex was ₹${n0(P2.capex)} cr (Urea-II revamp, SA-V acid plant, solar) and dividends ₹${n0(P2.div)} cr. The cash pile peaked at ~₹2,300 cr net (Mar-24) and was ₹1,333 cr at Mar-26; at Jun-26 GSFC had borrowed ~₹500 cr. ROCE has been 6-7% since FY24.` },
    { pair: [
      { type: 'column', title: 'Operating cash vs capex', unit: '₹ crore', x: 'A.labels', from: 'FY19', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }], labels: 'none', source: SRC.co },
      { type: 'line', title: 'ROCE: 13% in the boom, 6-7% since', unit: 'Return on capital employed (%)', x: RL, series: [{ name: 'ROCE', values: SCR.rows['ROCE %'], fmt: 'pct0' }], labels: 'all', min: 0, max: 15, source: 'Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went (₹ crore)', head: ['', 'FY19-22', 'FY23-26', 'Eight years'], rows: [
      ['Net profit', ...row(p => p.pat)],
      ['Cash from operations', ...row(p => p.cfo)],
      ['Capex', ...row(p => p.capex)],
      ['Free cash flow', ...row(p => p.cfo - p.capex)],
      ['Dividends paid', ...row(p => p.div)],
      { hl: true, cells: ['**Left after dividends**', ...row(p => p.cfo - p.capex - p.div).map(v => `**${v}**`)] },
    ], source: 'Screener.in cash flow (capex = fixed assets purchased), GAM Research' } },
    { callout: '**The next test:** management plans a 600 TPD phosphoric acid and 1,800 TPD sulphuric acid complex at Sikka (EPC award expected by Sep-2026, cost not disclosed) and an integrated complex on 276.7 ha at Dahej (configuration stage). We pencil in ₹400 cr of capex in FY27 and ₹800 cr a year in FY28-29. Nothing in GSFC\'s record says these projects will earn more than the 6-7% the existing assets do; backward integration into acid is logical (it removes the sulphur and P₂O₅ exposure that crushed Q1FY27 margins), but the returns depend on world prices when the plants start.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'A balance sheet made of shares in other companies',
  blocks: [
    { p: `Net worth was ₹12,266 cr at Mar-2026 (₹308 a share, twice the share price). ₹4,610 cr of it is shares in other companies, carried at fair value (listed shares at the March price, unlisted ones such as Indian Potash at the company\'s valuation); price moves go to reserves, not profit, which is why reserves swing (₹11,693 cr at Mar-22, ₹12,059 cr at Mar-25). Operating cash: ₹200 cr of cash and bank plus ₹1,160 cr of deposits with financial institutions, against ₹27 cr of debt: net cash of ~₹1,333 cr. Working capital is driven by subsidy and stock: government subsidy receivable ₹1,453 cr and inventory ₹1,879 cr at Mar-26 (₹1,087 cr and ₹1,479 cr a year earlier). In Q1FY27 the DAP special package (paid ~6 months after sale) and rabi stocking took the company to ~₹500 cr of borrowings.` },
    { pair: [
      { type: 'line', title: 'Working-capital days rose in FY26', unit: 'Days (of revenue)', x: RL, series: [{ name: 'Inventory days', values: SCR.rows['Inventory Days'], fmt: 'num' }, { name: 'Working capital days', values: SCR.rows['Working Capital Days'], fmt: 'num' }, { name: 'Receivable days (ex-subsidy)', values: SCR.rows['Debtor Days'], fmt: 'num' }], labels: 'last', source: 'Screener.in' },
      { type: 'column', title: 'Investments at fair value: ₹4,610 cr at Mar-26', unit: 'Investments on the balance sheet (₹ crore)', x: 'A.labels', from: 'FY17', series: [{ name: 'Investments', ref: 'A.investments', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-22', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth', '{{A.netWorth.7|num}}', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}'],
      ['Investments (fair value)', '{{A.investments.7|num}}', '{{A.investments.9|num}}', '{{A.investments.10|num}}', '{{A.investments.11|num}}'],
      ['Cash and bank (Screener)', '{{A.cash.7|num}}', '{{A.cash.9|num}}', '{{A.cash.10|num}}', '{{A.cash.11|num}}'],
      ['Deposits with financial institutions', '–', '–', '–', '1,160'],
      ['Borrowings', '{{A.borrowings.7|num}}', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}'],
      ['Government subsidy receivable', 'n.a.', 'n.a.', '1,087', '1,453'],
      ['Inventories', '{{A.inventories.7|num}}', '{{A.inventories.9|num}}', '{{A.inventories.10|num}}', '{{A.inventories.11|num}}'],
      ['Net fixed assets', '{{A.fixedAssets.7|num}}', '{{A.fixedAssets.9|num}}', '{{A.fixedAssets.10|num}}', '{{A.fixedAssets.11|num}}'],
    ], source: 'Screener.in; annual reports FY25-26 (FI deposits, subsidy receivable); n.a. = not collected' } },
    { callout: `**What the model does with cash:** the engine treats cash, deposits and the ₹4,610 cr investment book as one "treasury" figure and holds the investments at book. Excluding the investments, we expect net cash of ~₹${n0(F.treasury[0] - INV)} cr at Mar-27E and ~₹${n0(F.treasury[2] - INV)} cr at Mar-29E (₹${n0(NC26)} cr at Mar-26) as working capital absorbs ~₹830 cr in FY27 and the Sikka project begins. The engine keeps working capital at the Mar-26 ratio (25.6% of revenue): we leave it there because subsidy receivables, which drive it, were rising, not falling, at Jun-26.` },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: the Gujarat government controls it; foreign funds have left',
  blocks: [
    { pair: [
      { type: 'line', title: 'FIIs down from 19.8% to 12.4%', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Shareholders: 2 lakh to 3 lakh since Dec-2023', unit: 'Number of shareholders', x: M.shareholding.periods, series: [{ name: 'Shareholders', values: M.shareholding.rows['No. of Shareholders'], fmt: 'num' }], labels: 'ends', source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY15–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 15 }, hl: true },
      { key: 'ebitda', name: 'EBITDA', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 150 } },
      { key: 'dep', name: 'Depreciation' },
      { key: 'otherIncome', name: 'Other income' },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit', hl: true, flag: { type: 'pct', th: 20 } },
      { key: 'eps', name: 'EPS (₹)', fmt: 'n1' },
      { key: 'cfo', name: 'Operating cash' },
      { key: 'capex', name: 'Capex' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 20 }, hl: true },
      { key: 'ebitda', name: 'EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' },
      { key: 'otherIncome', name: 'Other income' },
      { key: 'dep', name: 'Depreciation' },
      { key: 'pat', name: 'Net profit', hl: true },
    ] } },
  ],
};

module.exports = { financials, capital, balance, ownershipBase, statements, RD };

if (require.main === module) {
  const B = fs.existsSync(path.join(__dirname, 'GSFC.research.js')) ? require('./GSFC.research') : null;
  const report = {
    symbol: 'GSFC', listing: 'NSE: GSFC · BSE: 500690', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Agri inputs',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements],
    statementNotes: B?.statementNotes || {},
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
