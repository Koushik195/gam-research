// Authoring source for the Sona BLW Precision Forgings (Sona Comstar) initiating-coverage report (as of 30-Sep-2026,
// Q1FY27 basis). Part A (this file): chapters built on reported financials (Screener, consolidated, attributable profit
// via SONACOMS.patch.js). Part B (SONACOMS.research.js + part2-6, shared SONACOMS.ctx.js) adds the research chapters.
// SONACOMS.ctx.js first syncs the derived multiples into assumptions.json. Usage: node tools/authoring/SONACOMS.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'SONACOMS', 'research');
const SCR = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8')).tables.ratios;
const keepR = SCR.periods.map(p => /^Mar 20(2[0-6])$/.test(p) && `${p.slice(-4)}-05-30` <= '2026-09-30');
const RL = SCR.periods.filter((_, i) => keepR[i]).map(p => 'FY' + p.slice(-2));
const RR = k => SCR.rows[k].filter((_, i) => keepR[i]);
const SRC = { co: 'Company filings, Screener.in (consolidated; attributable profit), GAM Research' };

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Revenue up 2.8x in five years; margins have stepped down twice and EPS growth has slowed to single digits',
  blocks: [
    { p: 'Sona\'s consolidated revenue rose from ₹1,566 cr in FY21 to ₹4,449 cr in FY26 (Screener basis): 23% a year. The path had two phases. Up to FY24 growth was organic and fast (+36%, +25%, +20%) as EV differential assemblies, micro-hybrid starter motors and new customers ramped up, with EBITDA margins of 25-28%. FY25 slowed to +11% (US and European EV demand), and FY26\'s +25% came almost entirely from buying the railway business of Escorts Kubota (from 1-Jun-2025): by our estimate the automotive business was flat, BEV revenue fell 6% and the margin fell to 24.3%. EPS rose from ₹3.76 (FY21) to ₹10.29 (FY26), but only +10% and +6% in the last two years, because the ₹2,400 cr QIP of Sep-2024 added 5.6% to the share count and the cash it raised went into a lower-margin acquisition.' },
    { pair: [
      { type: 'column', title: 'Revenue: ₹1,566 cr (FY21) to ₹4,449 cr (FY26); FY26 includes ten months of railway', unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY19', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'column', title: 'EPS growth slowed to +10% and +6% after the QIP', unit: 'EPS (₹)', x: 'fin.labels', from: 'FY20', to: 'FY26', series: [{ name: 'EPS', ref: 'fin.eps', fmt: 'n2' }], labels: 'all', source: SRC.co + '. FY20 includes a ₹211 cr post-tax exceptional gain (pre-listing).' },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: 28% in FY21 and FY24, 24.3% in FY26', unit: 'EBITDA margin (%), Screener basis', x: 'fin.labels', from: 'FY19', to: 'FY26', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 15, max: 32, source: SRC.co },
      { type: 'line', title: 'Gross margin down 6 points since FY21 as motors and railway (assembly) grow', unit: 'Gross margin (%)', x: 'A.labels', from: 'FY20', series: [{ name: 'Gross margin', ref: 'A.grossMargin', fmt: 'pct' }], labels: 'all', min: 40, max: 65, source: SRC.co },
    ] },
    { callout: '**Our view:** Sona is still a growth company, but the quality of its growth changed in FY25-26. The early EV products (differential assemblies) carried high value addition; the newer growth engines (traction motors, railway, suspension motors) are assembled products with lower gross and EBITDA margins. Management has cut its margin band twice (25-27% at the IPO, 24-26%, then 23-25% after the railway deal). Higher revenue at lower margins and a bigger equity base explain why ROE fell from 21% (FY24) to 11% (FY26).' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capex & returns', kicker: 'Capital allocation', title: 'Self-funded growth, a ₹2,400 cr QIP and a ₹1,643 cr acquisition: returns are now half the FY24 level',
  blocks: [
    { p: 'Sona has always spent heavily on capacity: capex of 10-16% of revenue in FY21-26 (Screener; FY26 includes ~₹110 cr of land for the railway business). Operating cash flow covered capex and dividends in every year since FY22. In Sep-2024 it raised ₹2,400 cr through a QIP (3.48 cr shares, ~5.6% dilution) with no immediate use; ₹1,643 cr of it went into the railway business in Jun-2025, and the NOVELIC stake was completed. ROCE on Screener\'s basis fell from 24% (FY24) to 14% (FY26) and ROE from 21% to 11%: the cash raised earns little until it is deployed, and the railway business, which management calls high-return on its own capital, was bought at ~1.8x revenue, so its returns on the purchase price are lower.' },
    { pair: [
      { type: 'column', title: 'Operating cash flow vs capex', unit: '₹ crore', x: 'A.labels', from: 'FY20', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }], labels: 'none', source: SRC.co },
      { type: 'line', title: 'ROCE: 22-24% in FY21-24, 14% in FY26 (QIP cash, then the railway purchase)', unit: 'Return on capital employed (%), Screener basis', x: RL, series: [{ name: 'ROCE', values: RR('ROCE %'), fmt: 'pct0' }], labels: 'all', min: 0, max: 35, source: 'Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went (₹ crore)', head: ['', 'FY21-23', 'FY24-26', 'Six years'], rows: [
      ['Cash from operations', '1,121', '2,127', '3,248'],
      ['Capex (cash, incl. land)', '901', '1,229', '2,130'],
      ['Dividends paid', '255', '567', '822'],
      { hl: true, cells: ['**Left over**', '**−35**', '**331**', '**296**'] },
      ['Memo: QIP proceeds (Sep-2024, net)', '', '2,370', ''],
      ['Memo: railway business (Jun-2025) and NOVELIC', '', '~1,800', ''],
    ], source: 'Screener.in cash flow (consolidated); AR FY25 board report 9.1 (QIP); AR FY26 MD&A; Q4FY26 call (acquisitions)' } },
    { callout: '**The capital question:** management says its ~₹2,750 cr of acquisitions (Comstar, NOVELIC, railway) now produce ~40% of revenue and would earn ~₹270 cr of net profit "at comparable margins" (Q1FY27 call). That is a claim, not a disclosure: the company does not report business-unit profit. What is visible is that ROE fell by half in two years and the DENSO deal values the 2W/3W EV business at 4.5x its sales, well below what the market pays for Sona as a whole.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'Net cash ~₹1,000 cr after the railway purchase; working capital has stretched',
  blocks: [
    { p: 'At Mar-2026 Sona held ₹348 cr of cash and bank balances, ₹500 cr of current investments (debt funds) and ₹381 cr of fixed deposits, against ₹243 cr of debt (mostly short-term working-capital loans taken in FY26): net cash ₹1,026 cr on the company\'s basis, down from ₹2,659 cr a year earlier after the railway purchase. In our model the opening net treasury is ₹837 cr because Screener\'s borrowings also include ~₹199 cr of lease liabilities. Working capital stretched in FY26: receivable days rose to 94 and inventory days to 107 as the railway business (Indian Railways and wagon makers pay slowly) was consolidated; Q1FY27 brought a "significant reduction in debtor days" (CFO). Goodwill and intangibles from the railway deal sit in fixed assets (₹3,646 cr at Mar-26 vs ₹2,127 cr).' },
    { pair: [
      { type: 'line', title: 'Receivable and inventory days rose with the railway business', unit: 'Days', x: RL, series: [{ name: 'Inventory days', values: RR('Inventory Days'), fmt: 'num' }, { name: 'Receivable days', values: RR('Debtor Days'), fmt: 'num' }, { name: 'Payable days', values: RR('Days Payable'), fmt: 'num' }], labels: 'last', source: 'Screener.in' },
      { type: 'column', title: 'Cash and investments on Screener\'s basis (FDs excluded)', unit: 'Cash and investments (₹ crore)', x: 'A.labels', from: 'FY20', series: [{ name: 'Cash and investments', ref: 'A.cashAndInvestments', fmt: 'num' }], labels: 'all', source: SRC.co + '. Fixed deposits (₹381 cr at Mar-26) sit in other assets.' },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-22', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth', '{{A.netWorth.3|num}}', '{{A.netWorth.5|num}}', '{{A.netWorth.6|num}}', '{{A.netWorth.7|num}}'],
      ['Borrowings (incl. leases)', '{{A.borrowings.3|num}}', '{{A.borrowings.5|num}}', '{{A.borrowings.6|num}}', '{{A.borrowings.7|num}}'],
      ['Cash and investments (Screener basis)', '{{A.cashAndInvestments.3|num}}', '{{A.cashAndInvestments.5|num}}', '{{A.cashAndInvestments.6|num}}', '{{A.cashAndInvestments.7|num}}'],
      ['Net fixed assets (incl. goodwill, intangibles)', '{{A.fixedAssets.3|num}}', '{{A.fixedAssets.5|num}}', '{{A.fixedAssets.6|num}}', '{{A.fixedAssets.7|num}}'],
      ['Inventories', '{{A.inventories.3|num}}', '{{A.inventories.5|num}}', '{{A.inventories.6|num}}', '{{A.inventories.7|num}}'],
      ['Trade receivables', '{{A.receivables.3|num}}', '{{A.receivables.5|num}}', '{{A.receivables.6|num}}', '{{A.receivables.7|num}}'],
      ['Trade payables', '{{A.payables.3|num}}', '{{A.payables.5|num}}', '{{A.payables.6|num}}', '{{A.payables.7|num}}'],
    ], source: SRC.co + '. Company net cash Mar-26: cash ₹348 cr + current investments ₹500 cr + FDs ₹381 cr − debt ₹243 cr = ₹1,026 cr (AR FY26 MD&A).' } },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: a 28% promoter, 42% Indian institutions, 24% foreign funds',
  blocks: [
    { pair: [
      { type: 'line', title: 'Indian institutions up from 31% to 42% in 18 months; foreign funds down from 33% to 24%', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoter (Aureus Investment) at ~28% since the Sep-2024 QIP', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 0, max: 40, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY19–FY29E', rows: [
      { key: 'sales', name: 'Revenue (FY26 onwards incl. railway)', flag: { type: 'pct', th: 25 }, hl: true },
      { key: 'ebitda', name: 'EBITDA', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 150 } },
      { key: 'dep', name: 'Depreciation' },
      { key: 'otherIncome', name: 'Other income (incl. exceptional items in actual years)', flag: { type: 'pct', th: 50 } },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit (attributable)', hl: true, flag: { type: 'pct', th: 25 } },
      { key: 'eps', name: 'EPS (₹)', fmt: 'n2' },
      { key: 'cfo', name: 'Cash from operations' },
      { key: 'capex', name: 'Capex' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L (as reported by 30-Sep-2026)', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 25 }, hl: true },
      { key: 'ebitda', name: 'EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' },
      { key: 'otherIncome', name: 'Other income (incl. exceptional items)' },
      { key: 'dep', name: 'Depreciation' },
      { key: 'pat', name: 'Net profit (attributable)', hl: true },
    ] } },
  ],
};

module.exports = { financials, capital, balance, ownershipBase, statements, RD };

if (require.main === module) {
  require('./SONACOMS.ctx').syncMultiples();
  const B = fs.existsSync(path.join(__dirname, 'SONACOMS.research.js')) ? require('./SONACOMS.research') : null;
  const report = {
    symbol: 'SONACOMS', listing: 'NSE: SONACOMS · BSE: 543300', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Automobiles & components',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements],
    statementNotes: { ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
