// Authoring source for the MRF Ltd initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated; history from FY17 because MRF moved
// from a September to a March year with an 18-month FY16, see MRF.patch.js). Part B (MRF.research.js + part2-6, shared
// MRF.ctx.js) adds the research chapters. MRF.val.js first syncs the derived multiples into assumptions.json.
// Usage: node tools/authoring/MRF.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'MRF', 'research');
const SCR = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8')).tables.ratios;
const keepR = SCR.periods.map(p => /^Mar 20(1[7-9]|2\d)$/.test(p) && `${p.slice(-4)}-05-30` <= '2026-09-30');
const RL = SCR.periods.filter((_, i) => keepR[i]).map(p => 'FY' + p.slice(-2));
const RR = k => SCR.rows[k].filter((_, i) => keepR[i]);
const SRC = { co: 'Company filings, Screener.in (consolidated), GAM Research' };

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Revenue doubled in seven years; profit follows the rubber price, not the volume',
  blocks: [
    { p: 'MRF\'s revenue was ₹16,062 cr in FY19 and ₹31,149 cr in FY26: 9.9% a year, and 14.0% a year since FY21 as vehicle sales recovered and tyre prices rose. Profit did not follow a line. The EBITDA margin swung from 18.3% in FY21 to 10.4% in FY23, back to 17.0% in FY24 and 15.8% in FY26, almost entirely on the cost of natural rubber and crude-linked inputs (carbon black, synthetic rubber, nylon cord), which take 60-67% of revenue. EPS went from ₹3,011 (FY21) to ₹1,578 (FY22), ₹4,907 (FY24) and ₹5,720 (FY26). The FY17-18 revenue figures are distorted by the change from excise duty to GST (Jul-2017), so we use FY19 as the start of growth comparisons.' },
    { pair: [
      { type: 'column', title: 'Revenue: ₹16,062 cr (FY19) to ₹31,149 cr (FY26)', unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY17', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'column', title: 'Net profit: the FY22-23 rubber squeeze halved it, FY24-26 tripled it', unit: 'Net profit (₹ crore)', x: 'fin.labels', from: 'FY17', to: 'FY26', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: 10% to 20% depending on raw materials', unit: 'EBITDA margin (%)', x: 'fin.labels', from: 'FY17', to: 'FY26', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 5, max: 22, source: SRC.co },
      { type: 'line', title: 'Raw materials: 56-67% of revenue', unit: 'Material cost, % of revenue', x: 'A.labels', from: 'FY17', series: [{ name: 'Material cost', ref: 'A.materialPct', fmt: 'pct0' }], labels: 'all', min: 45, max: 75, source: 'Screener.in (consolidated)' },
    ] },
    { callout: '**Our view:** MRF is a very large, well-run converter of rubber into tyres, and its profit is a spread: tyre prices minus rubber and crude. Over ten years the spread averaged ~15% of revenue (median FY17-26: 15.0%), but it has been above 17% or below 11% in four of those ten years. The volume engine is reliable; the margin is not. That is why its earnings, and the P/E the market pays, move in wide cycles.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capex & returns', kicker: 'Capital allocation', title: 'Heavy capex, a 4% payout and a growing cash pile: returns of 10-13% on equity',
  blocks: [
    { p: 'Tyres need capital. MRF spent ₹18,410 cr on capex over FY17-26 (₹8,505 cr in FY17-21 and ₹9,905 cr in FY22-26), close to its ₹24,153 cr of operating cash flow, and lifted capacity to 99.4 mn tyres (CARE). Capex peaked at ₹3,291 cr in FY23 and slowed to ₹1,309-1,434 cr in FY25-26, so free cash flow jumped to ₹3,164 cr in FY26. Dividends were only ₹567 cr in ten years: MRF pays ₹200-235 a share, ~4% of profit. The rest stayed in the company, so net worth grew from ₹8,641 cr to ₹20,974 cr, and cash and liquid investments reached ₹7,572 cr (CARE, Mar-26). The result is modest returns: ROE of 10-13% in normal years, 5% in the FY22-23 trough, never above 13.3% since FY18.' },
    { pair: [
      { type: 'column', title: 'Cash from operations vs capex', unit: '₹ crore', x: 'A.labels', from: 'FY17', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }], labels: 'none', source: SRC.co },
      { type: 'line', title: 'ROE and ROCE: 10-17% in good years, 5-7% in FY22-23', unit: '%', x: 'A.labels', from: 'FY17', series: [{ name: 'ROE', ref: 'A.roe', fmt: 'pct' }, { name: 'ROCE (Screener)', values: RR('ROCE %'), fmt: 'pct0' }], labels: 'last', min: 0, max: 30, source: 'Screener.in; GAM Research' },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went (₹ crore)', head: ['', 'FY17-21', 'FY22-26', 'Ten years'], rows: [
      ['Cash from operations', '12,218', '11,935', '24,153'],
      ['Capex (cash)', '8,505', '9,905', '18,410'],
      ['Dividends paid', '180', '387', '567'],
      { hl: true, cells: ['**Left over (into treasury)**', '**3,533**', '**1,643**', '**5,176**'] },
      ['Memo: net worth, end of period', '13,413', '20,974', ''],
      ['Memo: family directors\' pay, FY26 alone', '', '157', 'vs dividends of ~100'],
    ], source: 'Screener.in cash flow (consolidated); AR FY26 corporate governance report (directors\' remuneration)' } },
    { callout: '**The capital question:** MRF keeps reinvesting at returns close to its cost of equity (~12%) and lets the rest pile up in debt funds and deposits that earn ~6% before tax. A higher payout or a buyback would lift ROE; the family has shown no interest in either, and the board pays its five executive directors (all family) more than all shareholders together receive in dividends. Capex is now rising again: capital commitments doubled to ₹1,514 cr at Mar-26.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'Net cash of ~₹4,400 cr after leases; working capital is the swing item',
  blocks: [
    { p: 'At Mar-2026 MRF held ₹3,057 cr of debt and arbitrage mutual funds, ₹323 cr of bonds, ₹3,880 cr of bank deposits (₹2,013 cr of them longer than a year, which Screener counts in other assets), ₹305 cr of cash and ₹18 cr of listed shares: ₹7,582 cr gross. Against that it owed ₹2,367 cr to banks (mostly working-capital loans repayable on demand) and ₹840 cr of leases: net cash ~₹5,215 cr before leases, ~₹4,376 cr after (₹10,300 a share). CARE counts dealer deposits and supplier acceptances as debt too and puts net cash at ₹1,462 cr. Working capital is large: inventory of ~100-120 days of cost, partly rubber bought ahead; receivables ~42 days; payables only ~60 days. The engine\'s "treasury" is net of borrowings and leases in forecast years.' },
    { pair: [
      { type: 'line', title: 'Inventory days 100-120; payables ~60', unit: 'Days', x: RL, series: [{ name: 'Inventory days', values: RR('Inventory Days'), fmt: 'num' }, { name: 'Receivable days', values: RR('Debtor Days'), fmt: 'num' }, { name: 'Payable days', values: RR('Days Payable'), fmt: 'num' }], labels: 'last', source: 'Screener.in' },
      { type: 'column', title: 'Cash and investments on Screener\'s basis (long deposits excluded)', unit: 'Cash and investments (₹ crore)', x: 'A.labels', from: 'FY17', series: [{ name: 'Cash and investments', ref: 'A.cashAndInvestments', fmt: 'num' }], labels: 'all', source: SRC.co + '. Bank deposits over 12 months (₹2,013 cr at Mar-26) sit in other assets.' },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-22', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth', '{{A.netWorth.5|num}}', '{{A.netWorth.7|num}}', '{{A.netWorth.8|num}}', '{{A.netWorth.9|num}}'],
      ['Borrowings (incl. leases)', '{{A.borrowings.5|num}}', '{{A.borrowings.7|num}}', '{{A.borrowings.8|num}}', '{{A.borrowings.9|num}}'],
      ['Cash and investments (Screener basis)', '{{A.cashAndInvestments.5|num}}', '{{A.cashAndInvestments.7|num}}', '{{A.cashAndInvestments.8|num}}', '{{A.cashAndInvestments.9|num}}'],
      ['Net fixed assets', '{{A.fixedAssets.5|num}}', '{{A.fixedAssets.7|num}}', '{{A.fixedAssets.8|num}}', '{{A.fixedAssets.9|num}}'],
      ['Capital work in progress', '{{A.cwip.5|num}}', '{{A.cwip.7|num}}', '{{A.cwip.8|num}}', '{{A.cwip.9|num}}'],
      ['Inventories', '{{A.inventories.5|num}}', '{{A.inventories.7|num}}', '{{A.inventories.8|num}}', '{{A.inventories.9|num}}'],
      ['Trade receivables', '{{A.receivables.5|num}}', '{{A.receivables.7|num}}', '{{A.receivables.8|num}}', '{{A.receivables.9|num}}'],
      ['Trade payables', '{{A.payables.5|num}}', '{{A.payables.7|num}}', '{{A.payables.8|num}}', '{{A.payables.9|num}}'],
    ], source: SRC.co + '. AR FY26 notes 3, 5, 10, 11 for the treasury split.' } },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: Mammen family 27.8%, foreign funds 17%, Indian institutions 12%',
  blocks: [
    { pair: [
      { type: 'line', title: 'Foreign funds down from 19.8% to 17.4% in two years', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoter stake steady at ~27.8%', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 20, max: 35, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY17–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 15 }, hl: true },
      { key: 'ebitda', name: 'EBITDA', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 250 } },
      { key: 'dep', name: 'Depreciation' },
      { key: 'otherIncome', name: 'Other income (incl. exceptional items in actual years)', flag: { type: 'pct', th: 40 } },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit', hl: true, flag: { type: 'pct', th: 30 } },
      { key: 'eps', name: 'EPS (₹)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' },
      { key: 'capex', name: 'Capex' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L (as reported by 30-Sep-2026)', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 12 }, hl: true },
      { key: 'ebitda', name: 'EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' },
      { key: 'otherIncome', name: 'Other income (incl. exceptional items)' },
      { key: 'dep', name: 'Depreciation' },
      { key: 'pat', name: 'Net profit', hl: true },
    ] } },
  ],
};

const statementNotes = {};

module.exports = { financials, capital, balance, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  require('./MRF.val').syncMultiples();
  const B = fs.existsSync(path.join(__dirname, 'MRF.research.js')) ? require('./MRF.research') : null;
  const report = {
    symbol: 'MRF', listing: 'NSE: MRF · BSE: 500290', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Automobiles & components',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
