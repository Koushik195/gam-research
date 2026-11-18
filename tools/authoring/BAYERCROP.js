// Authoring source for the Bayer CropScience Ltd (India) initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, standalone: the company has no subsidiary).
// Part B (BAYERCROP.research.js + part2-4) adds business, history, industry, corn, crop protection, the parent,
// moat, earnings quality, ownership, governance, forecasts, street, valuation and verdict chapters.
// Usage: node tools/authoring/BAYERCROP.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'BAYERCROP', 'research');
const SCR = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8')).tables.ratios;
const RL = SCR.periods.map(p => 'FY' + p.slice(-2));
const SRC = { co: 'Company filings, Screener.in (standalone), GAM Research' };

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Six years of ~6% growth, one bad year, and a margin still below its old level',
  blocks: [
    { p: 'Bayer CropScience\'s revenue rose from ₹4,261 cr in FY21 to ₹5,675 cr in FY26, about 6% a year, almost all of it from corn seed: crop protection grew less than 6% a year. Profit peaked at ₹758 cr in FY23, when a global shortage lifted glyphosate prices, then fell to ₹568 cr in FY25 (EPS −23%) as input costs rose, Chinese generics stopped Bayer raising prices, dealers paid late and a restructuring cost money. FY26 recovered to ₹689 cr (+21%) on a 15.4% EBITDA margin, still below the 18-20% of FY20-24.' },
    { pair: [
      { type: 'column', title: 'Revenue: ~6% a year since FY21', unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY20', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num', growth: true }], source: SRC.co },
      { type: 'column', title: 'Net profit: FY23 peak, FY25 dip, FY26 recovery', unit: 'Net profit (₹ crore)', x: 'fin.labels', from: 'FY20', to: 'FY26', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: 20% in FY20, 12.6% in FY25, 15.4% in FY26', unit: 'EBITDA margin (%)', x: 'fin.labels', from: 'FY20', to: 'FY26', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 0, max: 25, source: SRC.co },
      { type: 'line', title: 'Return on equity stays high because almost all profit is paid out', unit: 'Return on equity (%)', x: 'fin.labels', from: 'FY20', to: 'FY26', series: [{ name: 'ROE', ref: 'fin.roe', fmt: 'pct' }], labels: 'all', min: 0, max: 35, source: SRC.co },
    ] },
    { callout: '**Our view:** this is a slow-growing, cash-generative business. ROE of 20-28% looks excellent, but it is high mainly because the company pays out ~100% of profit and keeps equity small, not because it is compounding. Over FY21-26 EPS grew ~7% a year. Future profit growth needs either faster corn growth or a margin back near 18%, and the FY25 shock showed how quickly the margin can fall.' },
  ],
};

const seasons = {
  id: 'seasons', nav: 'Seasonality', kicker: 'Seasonality', title: 'A kharif business: the June quarter alone makes ~40% of the profit',
  blocks: [
    { p: 'Indian farmers buy most crop protection and corn seed for the kharif (monsoon) season, sown in June-July. Bayer CropScience ships early, so April-June (Q1) is its biggest quarter: in FY26 it brought 34% of revenue and 40% of net profit, and April-September 61% of revenue. October-March covers the rabi (winter) crops: wheat herbicides and rabi/spring corn in the south and east. The pattern explains Q2FY26 (−11%, when rain did not stop and farmers missed sprays) and Q1FY27 (−4%, a weak, late monsoon).' },
    { pair: [
      { type: 'column', title: 'Quarterly revenue: the June quarter is the peak', unit: 'Revenue (₹ crore)', x: 'Q.labels', series: [{ name: 'Revenue', ref: 'Q.sales', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'column', title: 'Quarterly net profit', unit: 'Net profit (₹ crore)', x: 'Q.labels', series: [{ name: 'Net profit', ref: 'Q.pat', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { callout: '**The current season is weak:** Q1FY27 revenue fell 4% even before the June-September monsoon ended 12.6% below normal (IMD), with June 35% short. Net profit rose 15%, but ₹64 cr of the ₹89 cr other income was a one-off gain on selling the flubendiamide marketing rights; without it profit fell ~2%. With El Niño expected to last until February 2027 and southern reservoirs a third below normal, the rabi season is also at risk.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'No debt, ₹1,480 cr of cash at the March peak, and heavy inventory',
  blocks: [
    { p: 'Bayer CropScience has no borrowings, only ₹82 cr of lease liabilities. At Mar-2026 it held ₹1,479 cr of bank balances, liquid funds and investments (₹929 cr a year earlier). March is the seasonal high point: dealers pay before the year end and suppliers are owed a lot, and cash then falls as stock is built and credit given for kharif and two dividends (₹90 in December, ₹60 after the August AGM) are paid. Over FY21-26 operating cash flow was ₹3,804 cr, capex ₹327 cr and dividends ₹3,481 cr: nearly everything left over is paid out. The weak spot is inventory: 289 inventory days in FY26 (319 in FY25, Screener basis), because seed is produced a season ahead and technical-grade chemicals are imported from the parent months before use.' },
    { pair: [
      { type: 'line', title: 'Inventory days stay high; receivable days ~70', unit: 'Days', x: RL, series: [{ name: 'Inventory days', values: SCR.rows['Inventory Days'], fmt: 'num' }, { name: 'Receivable days', values: SCR.rows['Debtor Days'], fmt: 'num' }, { name: 'Payable days', values: SCR.rows['Days Payable'], fmt: 'num' }], labels: 'last', source: 'Screener.in (standalone)' },
      { type: 'column', title: 'Operating cash flow vs dividends paid', unit: '₹ crore', x: 'A.labels', from: 'FY20', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Dividends paid', ref: 'A.dividendsPaid', fmt: 'num' }], labels: 'none', source: SRC.co },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-22', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth', '{{A.netWorth.7|num}}', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}'],
      ['Borrowings (lease liabilities only)', '{{A.borrowings.7|num}}', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}'],
      ['Cash and investments', '{{A.cashAndInvestments.7|num}}', '{{A.cashAndInvestments.9|num}}', '{{A.cashAndInvestments.10|num}}', '{{A.cashAndInvestments.11|num}}'],
      ['Inventories', '{{A.inventories.7|num}}', '{{A.inventories.9|num}}', '{{A.inventories.10|num}}', '{{A.inventories.11|num}}'],
      ['Trade receivables', '{{A.receivables.7|num}}', '{{A.receivables.9|num}}', '{{A.receivables.10|num}}', '{{A.receivables.11|num}}'],
      ['Trade payables', '{{A.payables.7|num}}', '{{A.payables.9|num}}', '{{A.payables.10|num}}', '{{A.payables.11|num}}'],
      ['Net fixed assets (incl. leased)', '{{A.fixedAssets.7|num}}', '{{A.fixedAssets.9|num}}', '{{A.fixedAssets.10|num}}', '{{A.fixedAssets.11|num}}'],
    ], source: SRC.co } },
    { callout: '**Cash in the model:** the forecast "cash & investments" row is net of lease liabilities (the engine treats leases as debt), so it starts at ₹1,397 cr, not ₹1,479 cr. Because we assume a ~95% payout, the cash pile stays roughly flat.' },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: 71.4% Bayer group, 9% Indian mutual funds, a 13% retail float',
  blocks: [
    { pair: [
      { type: 'line', title: 'DIIs ~11.6%; FIIs below 4%', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Bayer group steady at 71.4%', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoter', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 60, max: 80, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY15–FY29E', rows: [
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
      { key: 'dep', name: 'Depreciation' },
      { key: 'pat', name: 'Net profit', hl: true },
    ] } },
  ],
};

const statementNotes = {};

module.exports = { financials, seasons, balance, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  const B = fs.existsSync(path.join(__dirname, 'BAYERCROP.research.js')) ? require('./BAYERCROP.research') : null;
  const report = {
    symbol: 'BAYERCROP', listing: 'NSE: BAYERCROP · BSE: 506285', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Agrochemicals',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, seasons, balance, ownershipBase, statements }) : [financials, seasons, balance, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
