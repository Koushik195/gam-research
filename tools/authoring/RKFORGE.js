// Authoring source for the Ramkrishna Forgings initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated; FY26 EPS and the Mar-26 balance
// sheet pro forma for the Jun/Sep-2026 warrant conversions, see RKFORGE.patch.js). Part B (RKFORGE.research.js +
// part2-6, shared RKFORGE.ctx.js) adds the research chapters. Before writing, the build and the derived multiples
// are synced into assumptions.json (RKFORGE.ctx.js). Usage: node tools/authoring/RKFORGE.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'RKFORGE', 'research');
const SCR = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8')).tables.ratios;
const keepR = SCR.periods.map(p => `${p.slice(-4)}-05-30` <= '2026-09-30');
const RL = SCR.periods.filter((_, i) => keepR[i]).map(p => 'FY' + p.slice(-2));
const RR = k => SCR.rows[k].filter((_, i) => keepR[i]);
const SRC = { co: 'Company filings, Screener.in (consolidated), GAM Research' };

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Revenue 3.3x in five years, but FY26 profit was back to FY19\'s level',
  blocks: [
    { p: 'Consolidated revenue rose from ₹1,289 cr in FY21 to ₹4,238 cr in FY26 (27% a year), helped by the post-Covid truck recovery, exports to North America and Europe and two acquisitions. Profit did not keep up. EBITDA margins were 21-22% in FY22-FY24 and then fell to 14-15% in FY25-FY26; depreciation and interest rose from ₹266 cr (FY22) to ₹545 cr (FY26) after ~₹2,900 cr of capex and acquisitions in FY24-FY26. FY26 net profit was ₹72 cr: below FY19\'s ₹120 cr on 2.2x the revenue. FY25\'s ₹415 cr was flattered by a ₹193 cr deferred-tax credit and an ₹83 cr gain on a sold subsidiary; underlying FY25 profit was ~₹110 cr.' },
    { pair: [
      { type: 'column', title: 'Revenue: Covid trough in FY20-21, then 3.3x', unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY17', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'column', title: 'Net profit: FY25 inflated by one-offs, FY26 collapsed to ₹72 cr', unit: 'Net profit (₹ crore), reported', x: 'fin.labels', from: 'FY17', to: 'FY26', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: 21-22% in FY22-24, 14-15% since', unit: 'EBITDA margin (%), Screener basis', x: 'fin.labels', from: 'FY17', to: 'FY26', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 10, max: 25, source: SRC.co },
      { type: 'line', title: 'ROCE: 19% in FY23, 6-7% in FY25-26', unit: 'Return on capital employed (%), Screener basis', x: RL, from: 'FY17', series: [{ name: 'ROCE', values: RR('ROCE %'), fmt: 'pct0' }], labels: 'all', min: 0, max: 25, source: 'Screener.in' },
    ] },
    { callout: '**Our view:** the FY22-FY24 margins show what this asset base earns when plants are full and exports are strong. FY25-FY26 combined three problems: a ₹170 cr inventory write-down in FY25 (~4pp of margin), a 20% fall in exports in FY26 (US tariffs and a weak Class 8 truck market) and new capacity that added depreciation and interest before it added profit. Q1FY27 (18% margin, ₹47 cr profit) is the first quarter that looks like a recovery.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capex & returns', kicker: 'Capital allocation', title: 'Capital-hungry: ₹2,960 cr invested in FY24-26 against ₹1,490 cr of operating cash flow',
  blocks: [
    { p: 'Ramkrishna has spent heavily to grow. Over FY24-FY26 the group generated ₹1,494 cr of operating cash flow and spent ₹2,958 cr in investing activities (new press lines, the casting plant, the Multitech and JMT acquisitions, the wheel JV and Mexico). The gap was filled by a ₹1,000 cr QIP (Nov-2023), more debt (borrowings ₹1,207 cr to ₹2,449 cr) and ₹405 cr of promoter warrants. Inventory runs at ~210 days on Screener\'s measure, so growth also ties up working capital. ROCE fell from 19% in FY23 to 6% in FY26, well below any cost of capital.' },
    { pair: [
      { type: 'column', title: 'Operating cash flow vs capex: three years of negative free cash flow', unit: '₹ crore', x: 'A.labels', from: 'FY19', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }], labels: 'none', source: SRC.co },
      { type: 'line', title: 'Inventory ~210 days, receivables down to 68 days in FY26', unit: 'Days', x: RL, from: 'FY17', series: [{ name: 'Inventory days', values: RR('Inventory Days'), fmt: 'num' }, { name: 'Receivable days', values: RR('Debtor Days'), fmt: 'num' }, { name: 'Payable days', values: RR('Days Payable'), fmt: 'num' }], labels: 'last', source: 'Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went (₹ crore)', head: ['', 'FY21-23', 'FY24-26', 'Six years'], rows: [
      ['Cash from operations', '928', '1,494', '2,422'],
      ['Investing cash flow (capex, acquisitions, JV)', '875', '2,958', '3,833'],
      ['  of which acquisitions (Multitech, Mal Metalliks, JMT)', '–', '432', '432'],
      ['Dividends paid', '32', '78', '110'],
      ['Equity raised (QIP Nov-2023; promoter warrants)', '–', '~1,200', '~1,200'],
    ], source: 'Screener.in cash flow (consolidated). Warrant money: Rs51.2 cr + Rs50.0 cr upfront (Aug-2025, Jan-2026) and Rs100.8 cr on conversion (Mar-2026) in FY26; Rs52.8 cr and Rs149.9 cr more in Jun and Sep-2026 (FY27).' } },
    { callout: '**The capital question:** management says the big capex is done (FY27 ~₹350 cr) and the next two years are about filling plants (68% utilisation in Q1FY27) and cutting net debt by ~₹500 cr a year. That is the right order. The record argues for caution: the FY28 revenue target of ₹8,000 cr slipped to FY29, and the new businesses (castings, Mexico, wheels, aluminium, aerospace) are all at the start of their ramp.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'Net debt ~₹1,900 cr (3x FY26 EBITDA); ratings AA- with a negative tilt',
  blocks: [
    { p: 'The company reported net debt of ₹1,990 cr at Mar-2026 and ₹1,900 cr at Jun-2026 (CFO, Q1FY27 call): ~3x FY26 EBITDA and ~0.6x equity. Gross borrowings were ₹2,449 cr at Mar-2026 (incl. leases). Management targets ~₹1,500 cr by Mar-2027, helped by ₹203 cr of promoter warrant money received in Jun and Sep-2026 (shown in our Mar-2026 opening balance sheet). CRISIL reaffirmed AA-/A1+ with a Negative outlook in Dec-2025 after the inventory affair; India Ratings cut its rating to IND AA- (Stable) from IND AA in May-2026. ~6.75% of the company\'s shares are pledged by promoters.' },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-22', 'Mar-24', 'Mar-25', 'Mar-26*'], rows: [
      ['Net worth', '{{A.netWorth.7|num}}', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}'],
      ['Borrowings (incl. leases)', '{{A.borrowings.7|num}}', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}'],
      ['Cash and investments', '{{A.cashAndInvestments.7|num}}', '{{A.cashAndInvestments.9|num}}', '{{A.cashAndInvestments.10|num}}', '{{A.cashAndInvestments.11|num}}'],
      ['Net fixed assets', '{{A.fixedAssets.7|num}}', '{{A.fixedAssets.9|num}}', '{{A.fixedAssets.10|num}}', '{{A.fixedAssets.11|num}}'],
      ['Inventories', '{{A.inventories.7|num}}', '{{A.inventories.9|num}}', '{{A.inventories.10|num}}', '{{A.inventories.11|num}}'],
      ['Trade receivables', '{{A.receivables.7|num}}', '{{A.receivables.9|num}}', '{{A.receivables.10|num}}', '{{A.receivables.11|num}}'],
      ['Trade payables', '{{A.payables.7|num}}', '{{A.payables.9|num}}', '{{A.payables.10|num}}', '{{A.payables.11|num}}'],
    ], source: SRC.co + '. *Mar-26 pro forma: +₹202.7 cr of warrant money (Jun/Sep-2026) in cash and investments and in net worth. Mar-24 is restated for the inventory overstatement.' } },
    { pair: [
      { type: 'column', title: 'Borrowings doubled in two years of heavy capex', unit: 'Borrowings incl. leases (₹ crore)', x: 'A.labels', from: 'FY19', series: [{ name: 'Borrowings', ref: 'A.borrowings', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'line', title: 'Gross debt to equity: 1.5x in FY22, 0.5x after the QIP, 0.7x now', unit: 'Gross debt ÷ net worth (x)', x: 'A.labels', from: 'FY19', series: [{ name: 'Debt / equity', ref: 'A.debtEquity', fmt: 'x' }], labels: 'all', source: SRC.co },
    ] },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: the Jalan family at 43%, foreign funds 20%, Indian funds only ~5%',
  blocks: [
    { pair: [
      { type: 'line', title: 'Foreign funds sold through the inventory affair; Indian funds small', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoters ~43% since the Nov-2023 QIP', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 35, max: 50, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY15–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 15 }, hl: true },
      { key: 'ebitda', name: 'EBITDA', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 200 } },
      { key: 'dep', name: 'Depreciation' },
      { key: 'otherIncome', name: 'Other income (after exceptional items; JV share in forecasts)' },
      { key: 'interest', name: 'Interest' },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit', hl: true, flag: { type: 'pct', th: 25 } },
      { key: 'eps', name: 'EPS (₹)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' },
      { key: 'capex', name: 'Capex' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 15 }, hl: true },
      { key: 'ebitda', name: 'EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' },
      { key: 'otherIncome', name: 'Other income (after exceptional items)' },
      { key: 'dep', name: 'Depreciation' },
      { key: 'pat', name: 'Net profit', hl: true },
    ] } },
  ],
};

const statementNotes = {};

module.exports = { financials, capital, balance, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  { const X = require('./RKFORGE.ctx'); X.assertBuild(); X.assertOi(); if (X.syncBuild() | X.syncMultiples()) { console.log('assumptions.json changed: run node src/model.js RKFORGE and this script again.'); process.exit(1); } }
  const B = fs.existsSync(path.join(__dirname, 'RKFORGE.research.js')) ? require('./RKFORGE.research') : null;
  const report = {
    symbol: 'RKFORGE', listing: 'NSE: RKFORGE · BSE: 532527', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Auto Components',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
