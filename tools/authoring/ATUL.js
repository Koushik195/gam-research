// Authoring source for the Atul Ltd initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated) + the writer.
// Part B (ATUL.research.js, merging ATUL.part2-4.js) adds business, history, industry, segments,
// moat, earnings quality, ownership, governance, forecasts, street, valuation and verdict chapters.
// Usage: node tools/authoring/ATUL.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'ATUL', 'research');
const SCR = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8')).tables.ratios;
const RL = SCR.periods.map(p => 'FY' + p.slice(-2));
const SRC = { co: 'Company filings, Screener.in (consolidated), GAM Research' };

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Ten years, two cycles: a 2020-21 peak, a 2024 trough, a record FY26 and a war-time Q1',
  blocks: [
    { p: 'Atul\'s revenue rose from ₹2,637 cr in FY15 to ₹5,428 cr in FY23, fell 13% to ₹4,726 cr in FY24 as crop-protection customers destocked and Chinese suppliers cut prices, then recovered to a record ₹6,274 cr in FY26. Profit followed a deeper cycle: net profit peaked at ₹671 cr (EPS ₹225) in FY20, halved to ₹324 cr (EPS ₹110) in FY24, and only regained the old peak in FY26 (₹689 cr, EPS ₹230), helped by ₹206 cr of other income. In other words, shareholders waited six years for earnings to grow. Q1FY27 then delivered the best quarter in the company\'s history: revenue +25%, EBITDA margin 21%, EPS ₹83 (+92%).' },
    { pair: [
      { type: 'column', title: 'Revenue: a record FY26 after the FY24 dip', unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY17', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num', growth: true }], source: SRC.co },
      { type: 'column', title: 'Net profit took six years to beat FY20', unit: 'Net profit (₹ crore)', x: 'fin.labels', from: 'FY17', to: 'FY26', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: 25% at the FY21 peak, 14-16% since FY23', unit: 'EBITDA margin (%, excluding other income)', x: 'fin.labels', from: 'FY17', to: 'FY26', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 0, max: 30, source: SRC.co },
      { type: 'column', title: 'Quarterly profit: Q1FY27 is almost double a normal quarter', unit: 'Net profit (₹ crore)', x: 'Q.labels', series: [{ name: 'Net profit', ref: 'Q.pat', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { callout: '**Our view:** Atul is a cyclical business with a modest underlying growth rate (revenue CAGR ~8% over FY15-26, EPS ~10%). FY23-24 was a trough driven by Chinese pricing; Q1FY27 was a spike driven by war-time prices and inventory gains. Neither is a good base. We value the stock on Sep-28E earnings, after the spike has washed out.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capex & returns', kicker: 'Capital allocation', title: 'Self-funded growth: ₹3,680 cr of capex in ten years, then a sharp brake',
  blocks: [
    { p: 'Over FY17-26 Atul generated ₹5,982 cr of operating cash, spent ₹3,680 cr on plants, paid ₹629 cr of dividends and ₹170 cr on three buybacks, and still added ~₹1,500 cr to its treasury. The first five years were excellent: capex of ₹1,265 cr, ROCE of 19-28%. The next five (FY22-26) were not: ₹2,415 cr of capex, two-thirds of it in FY22-24 for liquid epoxy resin, a caustic-chlorine plant (Atul Products) and API capacity, while ROCE fell to 9% in FY24. Management then braked hard: capex fell to ₹270 cr (FY25) and ₹175 cr (FY26), and free cash flow jumped to ₹848 cr.' },
    { pair: [
      { type: 'column', title: 'Capex vs operating cash flow', unit: '₹ crore', x: 'A.labels', from: 'FY17', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }], labels: 'none', source: SRC.co },
      { type: 'line', title: 'ROCE: from 28% (FY20) to 9% (FY24), 15% in FY26', unit: 'Return on capital employed (%)', x: RL, series: [{ name: 'ROCE', values: SCR.rows['ROCE %'], fmt: 'pct0' }], labels: 'all', min: 0, max: 35, source: 'Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went (₹ crore)', head: ['', 'FY17-21', 'FY22-26', 'Ten years'], rows: [
      ['Cash from operations', '2,751', '3,231', '5,982'],
      ['Capex', '1,265', '2,415', '3,680'],
      ['Free cash flow', '1,486', '816', '2,302'],
      ['Dividends paid', '267', '362', '629'],
      ['Buybacks', '50', '120', '170'],
      { hl: true, cells: ['**Left for the treasury**', '**1,169**', '**334**', '**1,503**'] },
    ], source: 'Screener.in cash flows; buybacks from annual reports (₹50 cr in 2020-21, ₹70 cr in Apr-May 2022, ₹50 cr in Nov-2023 to Jan-2024)' } },
    { callout: '**The capital question.** Atul now earns a 17% ROCE (company basis, FY26) and holds ~₹2,500 cr of cash, funds and listed shares. It has announced only one new project in 2026 (₹167 cr for two herbicides). Management says it is "evaluating large investments". Until it finds them, the cash pile keeps growing and drags ROE down to ~12%. Big buybacks would help shareholders; so far Atul has preferred small ones.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'A fortress balance sheet: ₹2,500 cr of net cash and investments',
  blocks: [
    { p: 'Atul has had more cash than debt every year since FY16. At Mar-26 it held ₹95 cr of cash and ₹2,592 cr of investments against ₹183 cr of borrowings (term loans in Atul Products). The investments include ₹1,648 cr of liquid treasury funds and ~₹870 cr of listed shares (Pfizer ₹453 cr, Arvind ₹140 cr, BASF India ₹84 cr, Arvind Fashions ₹64 cr, Anup Engineering ₹49 cr, Novartis India ₹36 cr). The company\'s own "treasury funds net of borrowings" was ₹1,578 cr. Working capital is steady at ~70 days of sales. Note that the treasury line below is gross cash and investments for actual years and net of debt for forecasts (an engine convention).' },
    { pair: [
      { type: 'line', title: 'Working-capital days: steady at ~70-75 days of receivables', unit: 'Days (of revenue)', x: RL, series: [{ name: 'Receivable days', values: SCR.rows['Debtor Days'], fmt: 'num' }, { name: 'Inventory days', values: SCR.rows['Inventory Days'], fmt: 'num' }], labels: 'last', source: 'Screener.in' },
      { type: 'column', title: 'Net cash: ₹2,504 cr at Mar-26 (Screener basis)', unit: 'Net debt (₹ crore; negative = net cash)', x: 'A.labels', from: 'FY17', series: [{ name: 'Net debt', ref: 'A.netDebt', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-22', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth', '{{A.netWorth.7|num}}', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}'],
      ['Borrowings (incl. leases)', '{{A.borrowings.7|num}}', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}'],
      ['Cash and investments', '{{A.cashAndInvestments.7|num}}', '{{A.cashAndInvestments.9|num}}', '{{A.cashAndInvestments.10|num}}', '{{A.cashAndInvestments.11|num}}'],
      ['Net fixed assets', '{{A.fixedAssets.7|num}}', '{{A.fixedAssets.9|num}}', '{{A.fixedAssets.10|num}}', '{{A.fixedAssets.11|num}}'],
      ['Capital work in progress', '{{A.cwip.7|num}}', '{{A.cwip.9|num}}', '{{A.cwip.10|num}}', '{{A.cwip.11|num}}'],
      ['Inventories', '{{A.inventories.7|num}}', '{{A.inventories.9|num}}', '{{A.inventories.10|num}}', '{{A.inventories.11|num}}'],
      ['Trade receivables', '{{A.receivables.7|num}}', '{{A.receivables.9|num}}', '{{A.receivables.10|num}}', '{{A.receivables.11|num}}'],
    ], source: SRC.co } },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: a Lalbhai family company held mainly by Indian institutions',
  blocks: [
    { pair: [
      { type: 'line', title: 'DIIs ~26%, FIIs only ~7%', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoters steady at ~45%', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 40, max: 50, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY18–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 15 }, hl: true },
      { key: 'ebitda', name: 'EBITDA', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 200 } },
      { key: 'dep', name: 'Depreciation' },
      { key: 'otherIncome', name: 'Other income' },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit', hl: true, flag: { type: 'pct', th: 20 } },
      { key: 'eps', name: 'EPS (₹)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' },
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

const statementNotes = {};

module.exports = { financials, capital, balance, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  const B = fs.existsSync(path.join(__dirname, 'ATUL.research.js')) ? require('./ATUL.research') : null;
  const report = {
    symbol: 'ATUL', listing: 'NSE: ATUL · BSE: 500027', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Chemicals',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
