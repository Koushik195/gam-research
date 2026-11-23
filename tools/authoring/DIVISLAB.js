// Authoring source for the Divi's Laboratories initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated; no minorities, so no patch).
// Part B (DIVISLAB.research.js + part2-6, shared DIVISLAB.ctx.js) adds the research chapters, cover, rating and
// statement notes. Usage: node tools/authoring/DIVISLAB.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'DIVISLAB', 'research');
const SJ = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8')), SCR = SJ.tables.ratios, PLT = SJ.tables['profit-loss'];
const UE = JSON.parse(fs.readFileSync(path.join(RD, 'company.json'), 'utf8')).underlyingEps;
const EY = ['FY19', 'FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'], epsRep = EY.map(y => PLT.rows['EPS in Rs'][PLT.periods.indexOf('Mar 20' + y.slice(2))]);
const RL = SCR.periods.map(p => 'FY' + p.slice(-2));
const SRC = { co: "Company filings, Screener.in (consolidated), GAM Research" };

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Three acts: steady compounding to FY20, a Covid windfall in FY21-22, a two-year hangover, and a recovery that is now running ahead of the old peak',
  blocks: [
    { p: "Divi's grew revenue from ₹3,115 cr in FY15 to ₹5,394 cr in FY20 (~12% a year) at 33-38% EBITDA margins. Covid then turned a steady compounder into a boom-and-bust: revenue jumped 29% in each of FY21 and FY22 to ₹8,960 cr, the margin hit 43% and EPS reached ₹111.5, helped by emergency supplies such as the API for Merck's molnupiravir. When those orders stopped in FY23 and generic API prices fell, revenue dropped 13%, the margin fell to 28% (FY24) and EPS sank to ₹60.3. The recovery since has been real: revenue +19% in FY25 and +13% in FY26 to ₹10,560 cr, EPS ₹96.7, and Q1FY27 EPS of ₹34.0 puts the trailing twelve months at ~₹110, near the Covid peak. But the margin (32.6% in FY26) is still below the pre-Covid 33-38% band, and part of the recent growth is the weak rupee." },
    { pair: [
      { type: 'column', title: 'Revenue: Covid jump, FY23 drop, new high in FY26', unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY15', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'line', title: 'EBITDA margin: 43% at the Covid peak, 28% at the trough, 33% now', unit: 'EBITDA margin (%)', x: 'fin.labels', from: 'FY15', to: 'FY26', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 0, max: 50, source: SRC.co },
    ] },
    { pair: [
      { type: 'column', title: 'EPS: ₹111 at the Covid peak, ₹60 two years later, ₹97 in FY26', unit: '₹ per share', x: EY, series: [{ name: 'Reported EPS', values: epsRep, fmt: 'n1' }], labels: 'all', source: 'Screener.in; exceptional items are small (FY26 Labour Codes ₹55 cr after tax = ₹2.1 a share)' },
      { type: 'line', title: 'Return on equity: 28% at the peak, 12% at the trough, 16% now', unit: 'Return on equity (%)', x: 'fin.labels', from: 'FY15', to: 'FY26', series: [{ name: 'ROE', ref: 'fin.roe', fmt: 'pct' }], labels: 'all', min: 0, max: 35, source: SRC.co },
    ] },
    { callout: "**Our view:** strip out the Covid years and Divi's has compounded EPS at ~8-9% a year over a decade (₹42 in FY16 to ₹97 in FY26), with an ROE that has fallen from the mid-20s to the mid-teens as the balance sheet filled with cash, inventory and new plants. The next leg depends on custom-synthesis projects that are built and validated but not yet commercial. The history says Divi's executes; it also says one-off demand can flatter a year badly, which is why we treat Q1FY27 with care." },
  ],
};

const seasons = {
  id: 'seasons', nav: 'Quarterly pattern', kicker: 'Quarters', title: 'No real seasonality, but lumpy: custom-synthesis shipments move margins by 3-6 points from one quarter to the next',
  blocks: [
    { p: "Divi's sells bulk APIs and intermediates on customers' delivery schedules, so quarters swing with shipment timing rather than with a season. In FY25-26 the EBITDA margin moved between 29% and 34%, highest when custom synthesis was a bigger share. Q1FY27 broke the range: revenue +27.8% to ₹3,080 cr, gross margin 68% and EBITDA margin 40.7%, as validation batches of the three dedicated projects shipped, the rupee was far weaker than a year earlier (standalone growth was ~10% in constant currency) and inventory rose by ~₹500 cr. Management asked investors to judge margins by the year, not the quarter (Nilima Divi, 1-Aug-2026)." },
    { pair: [
      { type: 'column', title: 'Quarterly revenue: a step up in Q1FY27', unit: 'Revenue (₹ crore)', x: 'Q.labels', series: [{ name: 'Revenue', ref: 'Q.sales', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'line', title: 'Quarterly EBITDA margin: 29-34% for two years, then 41%', unit: 'EBITDA margin (%)', x: 'Q.labels', series: [{ name: 'EBITDA margin', ref: 'Q.opm', fmt: 'pct0' }], labels: 'all', min: 0, max: 50, source: SRC.co },
    ] },
    { callout: '**What to watch:** whether the Q2FY27 gross margin stays above ~60% once the three-month raw-material stockpile (bought at high solvent prices) is consumed, and whether custom synthesis stays near 60% of revenue without validation batches. Q2FY27 results are due by mid-November 2026.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'No debt and ₹3,400-3,600 cr of cash, but working capital ties up ~44% of sales and capex has absorbed the free cash flow',
  blocks: [
    { p: "Divi's has no borrowings (₹7 cr of leases at Mar-2026). Cash and bank deposits fell from ₹4,213 cr (Mar-2023) to ₹3,414 cr (Mar-2026) because capex (₹2,520 cr in FY26, 24% of sales) and the ₹797 cr dividend took everything the business produced: free cash flow on Screener's basis was only ₹215-258 cr a year in FY24-26. Working capital is the other drain. Inventory is ~346 days of material cost (Screener) and reached ₹4,413 cr at Jun-2026 after the three-month stockpile; receivables are ~100 days. Customers now fund part of the build: Divi's received ₹1,207 cr of advances in FY26, including a ₹456 cr interest-free refundable advance and ₹402 cr of capacity-reservation payments released to revenue over the contract (AR FY26 notes 14-16)." },
    { pair: [
      { type: 'line', title: 'Inventory and receivable days: high, and not falling', unit: 'Days', x: RL, series: [{ name: 'Inventory days', values: SCR.rows['Inventory Days'], fmt: 'num' }, { name: 'Receivable days', values: SCR.rows['Debtor Days'], fmt: 'num' }, { name: 'Payable days', values: SCR.rows['Days Payable'], fmt: 'num' }], labels: 'last', source: 'Screener.in (consolidated; inventory and payables on material cost)' },
      { type: 'column', title: 'Cash and investments: drawn down by capex since FY23', unit: 'Cash and investments (₹ crore)', x: 'A.labels', from: 'FY17', series: [{ name: 'Cash and investments', ref: 'A.cashAndInvestments', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-22', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth', '{{A.netWorth.7|num}}', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}'],
      ['Borrowings (leases only)', '{{A.borrowings.7|num}}', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}'],
      ['Cash and investments', '{{A.cashAndInvestments.7|num}}', '{{A.cashAndInvestments.9|num}}', '{{A.cashAndInvestments.10|num}}', '{{A.cashAndInvestments.11|num}}'],
      ['Inventories', '{{A.inventories.7|num}}', '{{A.inventories.9|num}}', '{{A.inventories.10|num}}', '{{A.inventories.11|num}}'],
      ['Trade receivables', '{{A.receivables.7|num}}', '{{A.receivables.9|num}}', '{{A.receivables.10|num}}', '{{A.receivables.11|num}}'],
      ['Trade payables', '{{A.payables.7|num}}', '{{A.payables.9|num}}', '{{A.payables.10|num}}', '{{A.payables.11|num}}'],
      ['Net fixed assets', '{{A.fixedAssets.7|num}}', '{{A.fixedAssets.9|num}}', '{{A.fixedAssets.10|num}}', '{{A.fixedAssets.11|num}}'],
      ['Capital work in progress', '{{A.cwip.7|num}}', '{{A.cwip.9|num}}', '{{A.cwip.10|num}}', '{{A.cwip.11|num}}'],
    ], source: SRC.co } },
    { callout: '**Cash in the model:** the forecast "cash & investments" row is net of borrowings (₹3,476 cr at Mar-2026). With ₹5,800 cr of capex over FY27-29E and working capital growing with sales, we expect it to rise only to about {{F.treasury.2|num}} cr by Mar-2029. Customer advances sit inside "other liabilities", so the model treats them as working capital, not debt; if a project were cancelled, the ₹456 cr refundable advance would have to be repaid.' },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: the Divi family 52%, foreign funds 20%, domestic institutions 19%',
  blocks: [
    { pair: [
      { type: 'line', title: 'Foreign funds up to ~20%; domestic institutions ~19%', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoters steady at ~51.9%', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoter', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 40, max: 60, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY15–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 15 }, hl: true },
      { key: 'ebitda', name: 'EBITDA', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 300 } },
      { key: 'dep', name: 'Depreciation' },
      { key: 'otherIncome', name: 'Other income (incl. forex and exceptionals in actuals)' },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit', hl: true, flag: { type: 'pct', th: 20 } },
      { key: 'eps', name: 'EPS (₹, bonus-adjusted)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' },
      { key: 'capex', name: 'Capex' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 20 }, hl: true },
      { key: 'ebitda', name: 'EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' },
      { key: 'otherIncome', name: 'Other income (incl. forex and exceptionals)' },
      { key: 'dep', name: 'Depreciation' },
      { key: 'pat', name: 'Net profit', hl: true },
    ] } },
  ],
};

const statementNotes = {};

module.exports = { financials, seasons, balance, ownershipBase, statements, statementNotes, RD, UE };

if (require.main === module) {
  const B = fs.existsSync(path.join(__dirname, 'DIVISLAB.research.js')) ? require('./DIVISLAB.research') : null;
  const report = {
    symbol: 'DIVISLAB', listing: 'NSE: DIVISLAB · BSE: 532488', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Pharmaceuticals & CDMO',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, seasons, balance, ownershipBase, statements }) : [financials, seasons, balance, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
