// Authoring source for the UPL Ltd initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated; Net Profit on the
// attributable basis after minorities, see UPL.patch.js). Part B (UPL.research.js + UPL.part2-4.js) adds
// the research chapters. Usage: node tools/authoring/UPL.js
const fs = require('fs');
const path = require('path');
const { patch } = require('./UPL.patch');
if (patch().changed) console.warn('UPL.patch: Screener Net Profit put on the attributable basis; re-run node src/model.js UPL, then this script.');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'UPL', 'research');
const SCR = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8')).tables.ratios;
const RL = SCR.periods.map(p => 'FY' + p.slice(-2));
const MP = path.join(__dirname, '..', '..', 'data', 'models', 'UPL.json');
const MF = fs.existsSync(MP) ? JSON.parse(fs.readFileSync(MP, 'utf8')).forecast?.F : null;
const ndTxt = i => (MF ? Math.round(-MF.treasury[i]).toLocaleString('en-IN') : 'n.a.');
const SRC = { co: 'Company filings, Screener.in (consolidated; profit attributable to UPL shareholders), GAM Research' };

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'A decade in three acts: Arysta, a boom, a bust and a slow repair',
  blocks: [
    { p: 'UPL\'s revenue went from ₹16,312 cr in FY17 to ₹51,839 cr in FY26. Most of the jump came in one step: the debt-funded purchase of Arysta LifeScience in FY19, which lifted revenue 64% in FY20. The boom of FY21-23 (revenue ₹53,576 cr and attributable profit ₹3,570 cr in FY23) ended with the global destocking of FY24, when revenue fell 20%, the EBITDA margin halved to 10% and UPL lost ₹1,200 cr. FY25 and FY26 were a repair: revenue +11% in FY26, EBITDA +27% to ₹9,078 cr and profit back to ₹1,922 cr, still only about half of FY22-23.' },
    { pair: [
      { type: 'column', title: 'Revenue: Arysta tripled the base; FY24 broke the run', unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY17', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num', growth: true }], source: SRC.co },
      { type: 'column', title: 'Profit for UPL shareholders: still half of the FY22-23 peak', unit: 'Profit after minorities (₹ crore)', x: 'fin.labels', from: 'FY17', to: 'FY26', series: [{ name: 'Net profit (attributable)', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: 22% at the peak, 10% in the bust', unit: 'EBITDA margin, statutory basis (%)', x: 'fin.labels', from: 'FY17', to: 'FY26', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 0, max: 25, source: SRC.co },
      { type: 'column', title: 'Depreciation and interest eat ~70% of EBITDA', unit: '₹ crore', x: 'A.labels', from: 'FY17', series: [{ name: 'Depreciation & amortisation', ref: 'A.dep', fmt: 'num' }, { name: 'Finance costs', ref: 'A.interest', fmt: 'num' }], labels: 'none', source: SRC.co },
    ] },
    { callout: '**Our view:** UPL is a big operating business with a thin layer of profit for its own shareholders. In FY26, of ₹9,078 cr of statutory EBITDA, ₹3,244 cr went in depreciation and amortisation (much of it Arysta intangibles), ₹3,401 cr in finance costs (including the cost of factoring receivables), ₹937 cr in tax and ₹298 cr to minority partners: ₹1,922 cr was left, a 3.7% net margin and a 6% return on equity. Small changes in EBITDA therefore move EPS a lot, in both directions.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Cash & capital allocation', kicker: 'Capital allocation', title: 'Where the cash went: an acquisition, then eight years of paying for it',
  blocks: [
    { p: 'UPL generates a lot of operating cash: ₹52,900 cr over FY19-26. But in FY19 it paid ₹29,945 cr for acquisitions (Arysta) with borrowed money, and since then interest has absorbed a large share of the cash. Over FY22-26 UPL earned ₹34,574 cr from operations, spent ₹11,144 cr on capex, paid ₹13,898 cr of interest and ₹2,985 cr of dividends, and still raised ₹6,196 cr of share capital (the 2024 rights issue and money from investors in its platforms) to bring debt down. Return on capital employed (ROCE) was 21-22% before Arysta; it has been 3-14% since.' },
    { pair: [
      { type: 'column', title: 'Operating cash vs capex', unit: '₹ crore', x: 'A.labels', from: 'FY17', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }], labels: 'none', source: SRC.co },
      { type: 'line', title: 'ROCE: never back above 14% after Arysta', unit: 'Return on capital employed (%)', x: RL, series: [{ name: 'ROCE', values: SCR.rows['ROCE %'], fmt: 'pct0' }], labels: 'all', min: 0, max: 25, source: 'Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went (₹ crore)', head: ['', 'FY19-21', 'FY22-26'], rows: [
      ['Cash from operations', '18,307', '34,574'],
      ['Capex', '−5,677', '−11,144'],
      ['Acquisitions (Arysta in FY19)', '−30,885', '−130'],
      ['Interest paid', '−4,308', '−13,898'],
      ['Dividends paid', '−1,339', '−2,985'],
      ['Share proceeds (FY25-26: rights issue and platform investors)', '3,027', '6,196'],
      { hl: true, cells: ['**Change in debt and cash needed to balance (approx.)**', '**−20,875 (borrowed)**', '**+12,613 (repaid / cash built)**'] },
    ], source: 'Screener.in cash-flow schedules; GAM calculation (other financing and investing items omitted)' } },
    { callout: '**So what:** every rupee of operating cash since FY22 has gone first to the lenders. That only changes if EBITDA keeps rising and debt keeps falling, which is the bull case. Capex is modest (₹1,700-2,700 cr a year in FY22-26, 4-6% of revenue) because UPL\'s plants are largely built; registrations and data (intangibles) are part of that spend.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Debt, working capital & cash', kicker: 'Balance sheet', title: 'Net debt is lower than in FY24, but seasonal, dollar-denominated and flattered by factoring',
  blocks: [
    { p: 'UPL\'s debt moves with the farming calendar: it peaks in June-December, when UPL builds stock and extends credit for the Latin American and Indian seasons, and falls by March when customers pay. On the company\'s numbers net debt was ₹15,325 cr ($1.6 bn) at March 2026, 1.6x EBITDA, then ₹23,649 cr ($2.5 bn) at June 2026, 2.4x trailing EBITDA. About 98% of the debt is in US dollars, so a weaker rupee raises it in rupee terms. UPL also sells receivables to banks without recourse: ₹10,231 cr at March 2026. That is not debt in the accounts, but it is financing: adding it takes March 2026 net debt to ~₹25,600 cr, or 2.7x EBITDA. Working capital days (Screener basis) look low only because payables and advances fund most of the inventory and receivables.' },
    { exhibit: { type: 'table', title: 'Net debt on the company\'s definition (₹ crore)', head: ['', 'Mar-25', 'Mar-26', 'Jun-26'], rows: [
      ['Gross debt (excl. leases)', '27,123', '22,045', '28,570'],
      ['Cash and liquid investments', '9,856', '6,720', '4,921'],
      { hl: true, cells: ['**Net debt**', '**17,267**', '**15,325**', '**23,649**'] },
      ['Net debt / EBITDA (company)', '2.1x', '1.6x', '2.4x (TTM)'],
      ['Receivables factored without recourse', '8,875', '10,231', '6,755'],
      ['Net debt incl. factoring', '26,142', '25,556', '30,404'],
      ['Net debt in US$ mn', '2,021', '1,616', '2,498'],
    ], source: 'UPL FY26 and Q1FY27 presentations; Mar-25 gross debt includes the $400 mn perpetual bond (redeemed May-2025); factoring from presentation footnotes; GAM calculation' } },
    { pair: [
      { type: 'line', title: 'Working-capital days: payables fund the stock', unit: 'Days (of revenue)', x: RL, series: [{ name: 'Inventory days', values: SCR.rows['Inventory Days'], fmt: 'num' }, { name: 'Receivable days', values: SCR.rows['Debtor Days'], fmt: 'num' }, { name: 'Payable days', values: SCR.rows['Days Payable'], fmt: 'num' }], labels: 'last', source: 'Screener.in' },
      { type: 'column', title: 'Borrowings (incl. leases): Arysta step-up, slow repayment', unit: 'Borrowings (₹ crore, March year-end)', x: 'A.labels', from: 'FY17', series: [{ name: 'Borrowings', ref: 'A.borrowings', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore, March)', head: ['', 'Mar-23', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth (UPL shareholders)', '{{A.netWorth.8|num}}', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}'],
      ['Borrowings (incl. leases)', '{{A.borrowings.8|num}}', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}'],
      ['Cash and investments', '{{A.cashAndInvestments.8|num}}', '{{A.cashAndInvestments.9|num}}', '{{A.cashAndInvestments.10|num}}', '{{A.cashAndInvestments.11|num}}'],
      ['Net fixed assets (incl. intangibles)', '{{A.fixedAssets.8|num}}', '{{A.fixedAssets.9|num}}', '{{A.fixedAssets.10|num}}', '{{A.fixedAssets.11|num}}'],
      ['Inventories', '{{A.inventories.8|num}}', '{{A.inventories.9|num}}', '{{A.inventories.10|num}}', '{{A.inventories.11|num}}'],
      ['Trade receivables', '{{A.receivables.8|num}}', '{{A.receivables.9|num}}', '{{A.receivables.10|num}}', '{{A.receivables.11|num}}'],
      ['Trade payables', '{{A.payables.8|num}}', '{{A.payables.9|num}}', '{{A.payables.10|num}}', '{{A.payables.11|num}}'],
      ['Minority interests (in other liabilities)', '8,571', '7,899', '8,613', '6,573'],
    ], source: SRC.co + '; minority interests from Screener balance-sheet schedule (incl. the perpetual bond until FY25)' } },
    { callout: `**Our model's net debt** is borrowings including leases less cash and all investments (₹14,824 cr at Mar-26; it counts ~₹2,000 cr of stakes in associates as cash-like). It falls to ~₹${ndTxt(0)} cr by Mar-27E and ~₹${ndTxt(1)} cr by Mar-28E on free cash flow of ₹2,700-4,400 cr a year. That is a March figure: the June-December peak is ₹8,000-9,000 cr higher.` },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: foreign funds have doubled down while Indian institutions sold',
  blocks: [
    { pair: [
      { type: 'line', title: 'FIIs 34% → 42%; DIIs 17% → 14%', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoters hold a third', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 25, max: 40, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY18–FY29E (net profit attributable to UPL shareholders)', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 15 }, hl: true },
      { key: 'ebitda', name: 'EBITDA (statutory basis)', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 300 } },
      { key: 'dep', name: 'Depreciation & amortisation' },
      { key: 'otherIncome', name: 'Other income' },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit (after minorities)', hl: true, flag: { type: 'pct', th: 40 } },
      { key: 'eps', name: 'EPS (₹)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' },
      { key: 'capex', name: 'Capex' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L (statutory basis)', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 20 }, hl: true },
      { key: 'ebitda', name: 'EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' },
      { key: 'dep', name: 'Depreciation' },
      { key: 'interest', name: 'Finance costs' },
      { key: 'pat', name: 'Net profit (after minorities)', hl: true },
    ] } },
  ],
};

module.exports = { financials, capital, balance, ownershipBase, statements, statementNotes: {}, RD };

if (require.main === module) {
  const B = fs.existsSync(path.join(__dirname, 'UPL.research.js')) ? require('./UPL.research') : null;
  const report = {
    symbol: 'UPL', listing: 'NSE: UPL · BSE: 512070', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Agrochemicals',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements],
    statementNotes: B?.statementNotes || {},
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
