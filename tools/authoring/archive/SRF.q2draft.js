// Authoring source for the SRF Ltd initiating-coverage report.
// Part A (this file): chapters built on reported financials (Screener, consolidated).
// Part B (SRF.research.js) adds business, history, industry, segments, moat, earnings quality,
// ownership, governance, forecasts, street, valuation and verdict chapters from research/*.json.
// Usage: node tools/authoring/SRF.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'SRF', 'research');
const SCR = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8')).tables.ratios;
const RL = SCR.periods.map(p => 'FY' + p.slice(-2));
const SRC = { co: 'Company filings, Screener.in (consolidated), GAM Research' };

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Six years of growth, two lost years, and now a record half',
  blocks: [
    { p: 'SRF\'s revenue rose from ₹4,822 cr in FY17 to ₹14,870 cr in FY23, about 21% a year, as the chemicals business grew from a refrigerant maker into a supplier of complex molecules to global agrochemical and pharma companies. Then the cycle turned. In FY24 revenue fell 12% and net profit fell 38%, and FY25 was weaker still (₹1,251 cr). FY26 was a partial recovery (₹1,835 cr). The first half of FY27 is the best in SRF\'s history: revenue up 33% and net profit ₹1,268 cr, already 69% of all of FY26.' },
    { pair: [
      { type: 'column', title: 'Revenue: ~3x in ten years, with a dip in FY24', unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY17', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num', growth: true }], source: SRC.co },
      { type: 'column', title: 'Net profit: FY23 peak, two lost years, recovery', unit: 'Net profit (₹ crore)', x: 'fin.labels', from: 'FY17', to: 'FY26', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: 25% at the peak, 18.5% at the trough', unit: 'EBITDA margin (%)', x: 'fin.labels', from: 'FY17', to: 'FY26', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 10, max: 30, source: SRC.co },
      { type: 'column', title: 'Depreciation has tripled as new plants came on', unit: 'Depreciation (₹ crore)', x: 'A.labels', from: 'FY17', series: [{ name: 'Depreciation', ref: 'A.dep', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { callout: '**Our view:** SRF is a capital-heavy compounder. Gross block went from ₹4,963 cr in FY17 to ₹19,229 cr in FY26, and depreciation from ₹283 cr to ₹852 cr. Each new plant adds fixed cost before it adds profit, so earnings jump when plants fill up and prices are firm (FY21-23, H1FY27), and fall hard when either slips (FY24-25).' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capex & returns', kicker: 'Capital allocation', title: '₹15,600 cr of capex in ten years: returns have not kept up',
  blocks: [
    { p: 'Over FY17-26 SRF generated ₹17,438 cr of operating cash and spent ₹15,594 cr on new plants: 89 paise of every rupee. After ₹1,546 cr of dividends there was almost nothing left, so borrowings doubled from ₹2,396 cr to ₹5,083 cr. That is fine if the new capacity earns well. The test is return on capital employed (ROCE): it peaked at 24% in FY22, fell to 12% in FY25 and was 15% in FY26, about SRF\'s cost of capital.' },
    { pair: [
      { type: 'column', title: 'Capex vs operating cash flow', unit: '₹ crore', x: 'A.labels', from: 'FY17', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }], labels: 'none', source: SRC.co },
      { type: 'line', title: 'ROCE: back to 15%, below the FY22 peak', unit: 'Return on capital employed (%)', x: RL, series: [{ name: 'ROCE', values: SCR.rows['ROCE %'], fmt: 'pct0' }], labels: 'all', min: 0, max: 30, source: 'Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went (₹ crore)', head: ['', 'FY17-21', 'FY22-26', 'Ten years'], rows: [
      ['Cash from operations', '5,295', '12,143', '17,438'],
      ['Capex', '5,633', '9,961', '15,594'],
      ['Free cash flow', '−338', '2,182', '1,844'],
      ['Dividends paid', '428', '1,118', '1,546'],
      { hl: true, cells: ['**Left after dividends**', '**−766**', '**1,064**', '**298**'] },
    ], source: SRC.co } },
    { callout: '**Where it went right and wrong:** split by business, the picture is sharper. Since FY21, capital employed in **chemicals** rose by ₹5,537 cr and its EBIT by ₹1,535 cr: a 28% pre-tax return on the new money. In **films**, capital employed nearly doubled (₹3,425 cr to ₹6,310 cr) while EBIT fell from ₹898 cr to ₹508 cr. Group ROCE fell because of films, not chemicals. CWIP (plants being built) jumped to ₹2,122 cr by Sep-2026, and this round of spending is mostly in chemicals (HFOs, fluoropolymers).' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'Moderate debt, working capital rising with sales',
  blocks: [
    { p: 'Net debt (borrowings less cash and investments) was ₹3,785 cr at March 2026, about 1.1x EBITDA: comfortable for a company of this size. Working capital is the other use of cash. Inventory days (131) and receivable days (59) are high because SRF holds raw materials, refrigerant stock for the cooling season and finished intermediates for global customers. In the six months to Sep-2026 inventory rose ₹590 cr and receivables ₹599 cr as sales jumped, and borrowings rose to ₹5,375 cr.' },
    { pair: [
      { type: 'line', title: 'Working-capital days', unit: 'Days (of revenue)', x: RL, series: [{ name: 'Inventory days', values: SCR.rows['Inventory Days'], fmt: 'num' }, { name: 'Receivable days', values: SCR.rows['Debtor Days'], fmt: 'num' }], labels: 'last', source: 'Screener.in' },
      { type: 'column', title: 'Borrowings doubled over ten years', unit: 'Borrowings incl. leases (₹ crore)', x: 'A.labels', from: 'FY17', series: [{ name: 'Borrowings', ref: 'A.borrowings', fmt: 'num' }], labels: 'all', source: SRC.co },
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
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: domestic funds are replacing foreign investors',
  blocks: [
    { pair: [
      { type: 'line', title: 'FIIs down from 19.6% to 15.2%; DIIs up from 14.5% to 22.5%', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoters hold ~50%', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 40, max: 60, source: 'BSE shareholding pattern, Screener.in' },
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
      { key: 'pat', name: 'Net profit', hl: true, flag: { type: 'pct', th: 25 } },
      { key: 'eps', name: 'EPS (₹)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' },
      { key: 'capex', name: 'Capex' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 20 }, hl: true },
      { key: 'ebitda', name: 'EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' },
      { key: 'dep', name: 'Depreciation' },
      { key: 'interest', name: 'Interest' },
      { key: 'pat', name: 'Net profit', hl: true },
    ] } },
  ],
};

const statementNotes = {};

module.exports = { financials, capital, balance, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  const B = fs.existsSync(path.join(__dirname, 'SRF.research.js')) ? require('./SRF.research') : null;
  const report = {
    symbol: 'SRF', listing: 'NSE: SRF · BSE: 503806', date: '28 October 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Chemicals',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
