// Authoring source for the Sumitomo Chemical India initiating-coverage report.
// Part A (this file): chapters built on reported financials (Screener, consolidated).
// Part B (SUMICHEM.research.js) adds business, history, industry, products, parent, moat, earnings
// quality, ownership, governance, forecasts, street, valuation and verdict chapters from research/*.json.
// Usage: node tools/authoring/SUMICHEM.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'SUMICHEM', 'research');
const SCR = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8')).tables.ratios;
const RL = SCR.periods.map(p => 'FY' + p.slice(-2));
const SRC = { co: 'Company filings, Screener.in (consolidated), GAM Research' };

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Revenue has stalled for three years; profit grew on margins and interest income',
  blocks: [
    { p: 'Sumitomo Chemical India\'s revenue rose from ₹2,425 cr in FY20 to ₹3,511 cr in FY23, then fell 19% in FY24 as the whole Indian crop-protection industry cut prices and cleared excess stock. It has recovered only to ₹3,238 cr in FY26, so revenue is still 8% below its FY23 peak. Profit has done better: net profit reached a record ₹543 cr in FY26 because the EBITDA margin rose to 20.7% (from 13.8% in FY20) and interest income on a growing cash pile added ₹131 cr.' },
    { pair: [
      { type: 'column', title: 'Revenue: flat since FY23', unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY20', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num', growth: true }], source: SRC.co },
      { type: 'column', title: 'Net profit: a record ₹543 cr in FY26', unit: 'Net profit (₹ crore)', x: 'fin.labels', from: 'FY20', to: 'FY26', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: up from 14% to 21%', unit: 'EBITDA margin (%)', x: 'fin.labels', from: 'FY20', to: 'FY26', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 0, max: 25, source: SRC.co },
      { type: 'column', title: 'Other income now ~18% of pre-tax profit', unit: 'Other income (₹ crore)', x: 'A.labels', from: 'FY20', series: [{ name: 'Other income', ref: 'A.otherIncome', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { callout: '**Our view:** over FY23-26 revenue fell 3% a year while net profit grew 3% a year. The gap came from a higher margin and treasury income. Both have limits: the margin is already at a record, and interest income grows only as fast as the cash pile. Profit growth from here needs revenue growth.' },
  ],
};

const seasons = {
  id: 'seasons', nav: 'Seasonality', kicker: 'Seasonality', title: 'A monsoon business: two quarters make two-thirds of the profit',
  blocks: [
    { p: 'Most of India\'s crops are sown in the kharif (monsoon) season from June to September, and that is when farmers spray most insecticides and herbicides. So April-September (Q1 and Q2) is Sumitomo\'s peak: in FY26 the first half brought 61% of revenue and 66% of net profit. October-March (rabi, the winter crop) is smaller. One weak monsoon, or one season of excess stock at dealers, can wipe out a year\'s growth.' },
    { pair: [
      { type: 'column', title: 'Quarterly revenue: peaks every June and September quarter', unit: 'Revenue (₹ crore)', x: 'Q.labels', series: [{ name: 'Revenue', ref: 'Q.sales', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'column', title: 'Quarterly net profit', unit: 'Net profit (₹ crore)', x: 'Q.labels', series: [{ name: 'Net profit', ref: 'Q.pat', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { callout: '**The current season is weak:** Q1FY27 revenue rose only 1% (domestic −3%) as the monsoon arrived late, and the June-September monsoon ended about 13% below normal, the weakest since 2015. Q1 net profit rose 20%, but mainly because other income almost doubled, partly from a one-off ₹27 cr insurance claim for a 2023 plant fire. This matters for valuation: the June and September quarters set the tone for the whole year.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'No debt, a growing cash pile, and dealer credit as the main use of money',
  blocks: [
    { p: 'Sumitomo carries almost no debt (₹63 cr, mostly leases). Over FY21-26 it generated ₹2,691 cr of operating cash, spent only ₹414 cr on capex and paid ₹532 cr in dividends (including a ₹5 special dividend in FY24), so cash has piled up: ₹2,113 cr at Mar-2026 and ₹2,549 cr at Jun-2026 on the company\'s own count, which includes ~₹840 cr of deposits placed with companies and banks that sit under "other assets" in the balance sheet below. The main use of working capital is credit to dealers and stock for the season: receivable days have fallen from 128 in FY20 to 83 in FY26, while inventory days (166) remain high, as is normal in crop protection, where products must be stocked months before the season.' },
    { pair: [
      { type: 'line', title: 'Receivable days down by a third since FY20', unit: 'Days (of revenue)', x: RL, series: [{ name: 'Receivable days', values: SCR.rows['Debtor Days'], fmt: 'num' }, { name: 'Inventory days', values: SCR.rows['Inventory Days'], fmt: 'num' }], labels: 'last', source: 'Screener.in' },
      { type: 'column', title: 'Operating cash flow vs capex', unit: '₹ crore', x: 'A.labels', from: 'FY20', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }], labels: 'none', source: SRC.co },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-22', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth', '{{A.netWorth.4|num}}', '{{A.netWorth.6|num}}', '{{A.netWorth.7|num}}', '{{A.netWorth.8|num}}'],
      ['Borrowings (incl. leases)', '{{A.borrowings.4|num}}', '{{A.borrowings.6|num}}', '{{A.borrowings.7|num}}', '{{A.borrowings.8|num}}'],
      ['Cash and investments (reported)', '{{A.cashAndInvestments.4|num}}', '{{A.cashAndInvestments.6|num}}', '{{A.cashAndInvestments.7|num}}', '{{A.cashAndInvestments.8|num}}'],
      ['Net fixed assets', '{{A.fixedAssets.4|num}}', '{{A.fixedAssets.6|num}}', '{{A.fixedAssets.7|num}}', '{{A.fixedAssets.8|num}}'],
      ['Inventories', '{{A.inventories.4|num}}', '{{A.inventories.6|num}}', '{{A.inventories.7|num}}', '{{A.inventories.8|num}}'],
      ['Trade receivables', '{{A.receivables.4|num}}', '{{A.receivables.6|num}}', '{{A.receivables.7|num}}', '{{A.receivables.8|num}}'],
    ], source: SRC.co } },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: 75% Japanese parent, and Indian funds buying the rest',
  blocks: [
    { pair: [
      { type: 'line', title: 'DIIs up from 6.0% to 9.7%; FIIs below 3%', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoter (Sumitomo Chemical, Japan) at the 75% cap', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoter', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 60, max: 80, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY18–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 12 }, hl: true },
      { key: 'ebitda', name: 'EBITDA', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 200 } },
      { key: 'dep', name: 'Depreciation' },
      { key: 'otherIncome', name: 'Other income' },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit', hl: true, flag: { type: 'pct', th: 20 } },
      { key: 'eps', name: 'EPS (₹)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 15 }, hl: true },
      { key: 'ebitda', name: 'EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' },
      { key: 'otherIncome', name: 'Other income' },
      { key: 'pat', name: 'Net profit', hl: true },
    ] } },
  ],
};

const statementNotes = {};

module.exports = { financials, seasons, balance, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  const B = fs.existsSync(path.join(__dirname, 'SUMICHEM.research.js')) ? require('./SUMICHEM.research') : null;
  const report = {
    symbol: 'SUMICHEM', listing: 'NSE: SUMICHEM · BSE: 542920', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Agrochemicals',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, seasons, balance, ownershipBase, statements }) : [financials, seasons, balance, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
