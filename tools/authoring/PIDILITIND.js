// Authoring source for the Pidilite Industries initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated, bonus-adjusted).
// Part B (PIDILITIND.research.js + part2-4, shared PIDILITIND.ctx.js) adds the research chapters.
// Usage: node tools/authoring/PIDILITIND.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'PIDILITIND', 'research');
const SCR = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8')).tables.ratios;
const RL = SCR.periods.map(p => 'FY' + p.slice(-2));
const SRC = { co: 'Company filings, Screener.in (consolidated), GAM Research' };

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Ten years of steady compounding, with two input-cost dips',
  blocks: [
    { p: 'Pidilite\'s revenue grew from ₹5,361 cr in FY16 to ₹14,601 cr in FY26, about 10.5% a year, and net profit from ₹807 cr to ₹2,471 cr, about 12% a year. The path was not smooth. Revenue was flat in FY20-21 (slowdown, then Covid), then jumped 36% in FY22 as demand came back and the Araldite business (bought from Huntsman in Nov-2020) was added. Profit lagged in FY22-23 because raw-material costs spiked: gross margin fell from 54% to 43% and EBITDA margin to 17%. As input costs fell in FY24-26, margins recovered to a record 24% and EPS grew 36%, 20% and 18%.' },
    { pair: [
      { type: 'column', title: 'Revenue: 10.5% a year for ten years', unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'ends', source: SRC.co },
      { type: 'column', title: 'Net profit: flat in FY20-23, then up 92% in three years', unit: 'Net profit (₹ crore)', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { pair: [
      { type: 'line', title: 'Gross margin swings with VAM and other inputs', unit: 'Gross margin (%)', x: 'A.labels', from: 'FY16', series: [{ name: 'Gross margin', ref: 'A.grossMargin', fmt: 'pct0' }], labels: 'all', min: 35, max: 60, source: 'Screener.in (100 − material cost % of revenue)' },
      { type: 'line', title: 'EBITDA margin: 17% at the FY23 trough, 24% now', unit: 'EBITDA margin (%)', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 10, max: 30, source: SRC.co },
    ] },
    { callout: '**Our view:** volume growth is the engine and it has been reliable (underlying volume growth of ~9-11% a year in FY25-26). The swing factor is the gross margin: Pidilite buys vinyl acetate monomer (VAM) and other petrochemicals at market prices and passes cost changes on with a lag. FY26\'s 24% EBITDA margin is the top of management\'s own 20-24% corridor, earned on cheap inputs. We do not assume it keeps rising.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capex & returns', kicker: 'Capital allocation', title: 'A capital-light franchise: returns above 30%, cash piling up',
  blocks: [
    { p: 'Pidilite needs little capital. Over FY15-26 it generated ₹16,918 cr of operating cash, spent ₹4,554 cr on capex (about 3-4% of revenue) and paid ₹5,918 cr of dividends. The one big acquisition, Huntsman\'s Indian Araldite business (Nov-2020), added about ₹2,800 cr to the gross block and is the main reason ROCE fell from 33% in FY20 to 24-25% in FY22-23 (input-cost inflation did the rest). Returns have since recovered: ROCE was 31% and ROE 24% in FY26, against a cost of equity near 11%. Cash and investments rose to ₹4,649 cr at Mar-2026.' },
    { pair: [
      { type: 'column', title: 'Cash from operations far exceeds capex', unit: '₹ crore', x: 'A.labels', from: 'FY17', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }], labels: 'none', source: SRC.co },
      { type: 'line', title: 'ROCE: diluted by Araldite in FY21-23, back above 30%', unit: 'Return on capital employed (%)', x: RL, series: [{ name: 'ROCE', values: SCR.rows['ROCE %'], fmt: 'pct0' }], labels: 'all', min: 0, max: 50, source: 'Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went (₹ crore)', head: ['', 'FY21-23', 'FY24-26', 'Six years'], rows: [
      ['Cash from operations', '3,905', '7,839', '11,744'],
      ['Capex', '1,234', '1,604', '2,838'],
      ['Dividends paid (FY26 incl. the ₹509 cr special)', '941', '2,899', '3,840'],
      { hl: true, cells: ['**Left over**', '**1,730**', '**3,336**', '**5,066**'] },
      ['Memo: cash and investments at the end', '{{A.cashAndInvestments.8|num}}', '{{A.cashAndInvestments.11|num}}', ''],
    ], source: 'Screener.in cash flow (consolidated). The Huntsman payment in FY21 sits in other investing flows, so it is not in the "left over" line.' } },
    { callout: '**The capital question:** with capex at 3-5% of revenue (management) and a 50% payout, Pidilite will keep adding ~₹1,000-1,400 cr of net cash a year on our forecasts. Management talks of "pioneering" uses (electronics adhesives, paints, Unofin) and of partnerships, not of buybacks. Large acquisitions have been rare and mostly in its own categories; a big diversifying deal is the main capital-allocation risk.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'Net cash of ~₹4,200 cr and suppliers fund most of the working capital',
  blocks: [
    { p: 'Pidilite has almost no debt: ₹417 cr of borrowings (mostly leases and subsidiaries\' lines) at Mar-2026 against ₹4,649 cr of cash and investments; CRISIL counts an unencumbered surplus of over ₹3,920 cr and rates it AAA. Working capital is tight: inventory of ~98 days and receivables of ~55 days are largely funded by ~86 days of payables, so net working-capital days were only ~18 in FY26. Receivable days did rise from 50 to 55 in FY26, and in May-2026 the CFO said Pidilite was carrying "much higher than normal covers" of critical raw materials such as VAM, so inventory is likely to run higher during FY27.' },
    { pair: [
      { type: 'line', title: 'Working-capital days: inventory and payables both high', unit: 'Days (of revenue)', x: RL, series: [{ name: 'Inventory days', values: SCR.rows['Inventory Days'], fmt: 'num' }, { name: 'Receivable days', values: SCR.rows['Debtor Days'], fmt: 'num' }, { name: 'Payable days', values: SCR.rows['Days Payable'], fmt: 'num' }], labels: 'last', source: 'Screener.in' },
      { type: 'column', title: 'Cash and investments rebuilt after the Araldite deal', unit: 'Cash and investments (₹ crore)', x: 'A.labels', from: 'FY17', series: [{ name: 'Cash and investments', ref: 'A.cashAndInvestments', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-22', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth', '{{A.netWorth.7|num}}', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}'],
      ['Borrowings (incl. leases)', '{{A.borrowings.7|num}}', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}'],
      ['Cash and investments', '{{A.cashAndInvestments.7|num}}', '{{A.cashAndInvestments.9|num}}', '{{A.cashAndInvestments.10|num}}', '{{A.cashAndInvestments.11|num}}'],
      ['Net fixed assets (incl. Araldite intangibles)', '{{A.fixedAssets.7|num}}', '{{A.fixedAssets.9|num}}', '{{A.fixedAssets.10|num}}', '{{A.fixedAssets.11|num}}'],
      ['Inventories', '{{A.inventories.7|num}}', '{{A.inventories.9|num}}', '{{A.inventories.10|num}}', '{{A.inventories.11|num}}'],
      ['Trade receivables', '{{A.receivables.7|num}}', '{{A.receivables.9|num}}', '{{A.receivables.10|num}}', '{{A.receivables.11|num}}'],
      ['Trade payables', '{{A.payables.7|num}}', '{{A.payables.9|num}}', '{{A.payables.10|num}}', '{{A.payables.11|num}}'],
    ], source: SRC.co } },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: the Parekh family at 69%, a thin free float',
  blocks: [
    { pair: [
      { type: 'line', title: 'Foreign funds ~12%, Indian institutions creeping up to ~10%', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoters steady near 69%', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 50, max: 75, source: 'BSE shareholding pattern, Screener.in' },
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
      { key: 'eps', name: 'EPS (₹, bonus-adjusted)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' },
      { key: 'capex', name: 'Capex' },
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

module.exports = { financials, capital, balance, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  const B = fs.existsSync(path.join(__dirname, 'PIDILITIND.research.js')) ? require('./PIDILITIND.research') : null;
  const report = {
    symbol: 'PIDILITIND', listing: 'NSE: PIDILITIND · BSE: 500331', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Consumer & Building Materials',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
