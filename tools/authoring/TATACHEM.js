// Authoring source for the Tata Chemicals initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated; Net Profit on the
// attributable basis after minorities, see TATACHEM.patch.js). Part B (TATACHEM.research.js, merging
// TATACHEM.part2-5.js) adds the research chapters. Usage: node tools/authoring/TATACHEM.js
const fs = require('fs');
const path = require('path');
const { patch } = require('./TATACHEM.patch');
if (patch().changed) console.warn('TATACHEM.patch: Screener Net Profit put on the attributable basis; re-run node src/model.js TATACHEM, then this script.');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'TATACHEM', 'research');
const SCR = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8')).tables.ratios;
const RL = SCR.periods.map(p => 'FY' + p.slice(-2));
const SRC = { co: 'Company filings, Screener.in (consolidated; profit attributable to Tata Chemicals shareholders), GAM Research' };

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Ten years of going nowhere: revenue up 41%, profit down to a loss',
  blocks: [
    { p: 'Tata Chemicals\' revenue was ₹10,346 cr in FY17 and ₹14,584 cr in FY26: about 4% a year, and almost all of it came in one jump (FY22-23) when soda ash prices spiked after COVID. EBITDA (operating profit) was ₹2,097 cr in FY17, peaked at ₹3,820 cr in FY23 and has fallen every year since, to ₹1,805 cr in FY26. Profit for shareholders tells a worse story. Leave out FY20, inflated by the demerger of the consumer business into Tata Consumer Products (₹6,480 cr of other income that year), and profit was ₹2,317 cr at the FY23 peak, ₹268 cr in FY24, ₹235 cr in FY25 and a loss of ₹1,896 cr in FY26 after a ₹1,837 cr write-down of US goodwill.' },
    { pair: [
      { type: 'column', title: 'Revenue: one jump in FY22-23, flat since', unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY17', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num', growth: true }], source: SRC.co },
      { type: 'column', title: 'EBITDA: down for three years in a row', unit: 'EBITDA (₹ crore)', x: 'fin.labels', from: 'FY17', to: 'FY26', series: [{ name: 'EBITDA', ref: 'fin.ebitda', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: from 23% (FY23) to 12% (FY26)', unit: 'EBITDA margin (%)', x: 'fin.labels', from: 'FY17', to: 'FY26', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 0, max: 35, source: SRC.co },
      { type: 'column', title: 'Depreciation has more than doubled since FY17', unit: 'Depreciation (₹ crore)', x: 'A.labels', from: 'FY17', series: [{ name: 'Depreciation', ref: 'A.dep', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { callout: '**So what:** this is a commodity business on a rising cost base. Depreciation went from ₹512 cr (FY17) to ₹1,201 cr (FY26) as capacity was added in India, the UK and Kenya, and interest is ~₹590 cr a year. With EBITDA at ₹1,805 cr, only ~₹15 cr was left before other income in FY26. Minorities (44.96% of Rallis, 50% of a US partnership) then take ~₹180 cr a year. That is why a ₹14,600 cr revenue company earns almost nothing for its shareholders at the bottom of the soda ash cycle.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capex & returns', kicker: 'Capital allocation', title: '₹12,800 cr of capex in ten years, and returns are at 3%',
  blocks: [
    { p: 'Over FY17-26 the group generated ₹21,460 cr of operating cash and spent ₹12,817 cr on capex and ₹4,308 cr on dividends. That is better cash discipline than many chemical companies: free cash flow was positive in nine of the ten years (FY25 was −₹244 cr). The problem is what the capex earned. Return on capital employed (ROCE) was 12% at the FY23 peak and 3% in FY26, against a cost of capital of ~11%. FY24-25 capex (₹3,840 cr) went into the Mithapur soda ash and bicarb expansions, a UK salt plant and Kenya; the new volumes arrived just as prices fell. The 2008 US acquisition (General Chemical, Green River) was written down by ₹1,837 cr (US$208 mn) in FY26: management\'s own admission that it no longer earns its cost.' },
    { pair: [
      { type: 'column', title: 'Operating cash flow covers capex, but barely in FY25-26', unit: '₹ crore', x: 'A.labels', from: 'FY17', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }], labels: 'none', source: SRC.co },
      { type: 'line', title: 'ROCE: 3% in FY26, a quarter of the cost of capital', unit: 'Return on capital employed (%)', x: RL, series: [{ name: 'ROCE', values: SCR.rows['ROCE %'], fmt: 'pct0' }], labels: 'all', min: 0, max: 40, source: 'Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went (₹ crore)', head: ['', 'FY17-21', 'FY22-26', 'Ten years'], rows: [
      ['Cash from operations', '10,799', '10,661', '21,460'],
      ['Capex', '4,918', '7,899', '12,817'],
      ['Free cash flow', '5,881', '2,762', '8,643'],
      ['Dividends paid (incl. to Rallis minorities)', '2,069', '2,239', '4,308'],
      { hl: true, cells: ['**Left after dividends**', '**3,812**', '**523**', '**4,335**'] },
    ], source: SRC.co + '; FY17-20 cash flows include the consumer business demerged into Tata Consumer Products in FY20' } },
    { callout: '**Capital allocation from here:** management says capex will stay at or below depreciation (~₹1,200-1,300 cr a year) and new money goes to "non-cyclical" products: salt (₹615 cr for 292.5 KTPA), precipitated silica (₹775 cr, under review) and dense soda ash (₹135 cr, by converting the cement plant). Soda ash capacity gets money "only when the cycle returns". That is sensible, but these projects add perhaps ₹200-250 cr of EBITDA by FY29-30 on our estimates: useful, not transforming.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & net debt', kicker: 'Balance sheet', title: 'Net debt of ~₹6,000 cr against shares in Titan and other Tata companies worth ₹8,300 cr',
  blocks: [
    { p: 'Screener shows Tata Chemicals with more cash and investments than debt, but that is because it counts the group\'s stakes in Titan, Indian Hotels, Tata Steel and other Tata companies (₹7,229 cr at March 2026) as cash. They are long-held strategic stakes, not cash the business uses. On the company\'s own definition, net debt (excluding leases) was ₹5,961 cr at March 2026, up from ₹4,884 cr a year earlier (₹460 cr of it from the weaker rupee on overseas loans), and ₹5,692 cr in June 2026 after selling some land and shares. That is ~4x FY26 EBITDA excluding Rallis: high for a cyclical business. Credit ratings are still strong (CARE and CRISIL AA+/Stable) because of the Tata parentage and the investment portfolio.' },
    { exhibit: { type: 'table', title: 'Net debt and the investment portfolio (₹ crore)', head: ['', 'Mar-25', 'Mar-26', 'Jun-26'], rows: [
      ['Borrowings incl. leases (Screener)', '7,072', '8,001', '–'],
      ['Net debt, company definition (ex-leases)', '4,884', '5,961', '5,692'],
      ['Lease liabilities', '768', '887', '894'],
      ['Quoted Tata-group shares (book = market at year-end)', '6,095', '7,229', 'n.d.'],
      ['JVs at book (IMACID 33%, Tata Industries 9%)', '1,327', '1,460', 'n.d.'],
      ['Employee-benefit provisions (mostly UK/US pensions)', '1,203', '1,190', 'n.d.'],
      { hl: true, cells: ['**Quoted shares at 30-Sep-2026 closes (Mar-26 holdings)**', '', '**8,297**', ''] },
    ], source: 'Q4FY26 and Q1FY27 investor decks, AR FY26 notes 9, 21; NSE closes 30-Sep-2026; GAM Research' } },
    { pair: [
      { type: 'column', title: 'Borrowings back above ₹8,000 cr', unit: 'Borrowings incl. leases (₹ crore)', x: 'A.labels', from: 'FY17', series: [{ name: 'Borrowings', ref: 'A.borrowings', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'line', title: 'Inventory and payable days are both ~300', unit: 'Days', x: RL, series: [{ name: 'Inventory days', values: SCR.rows['Inventory Days'], fmt: 'num' }, { name: 'Payable days', values: SCR.rows['Days Payable'], fmt: 'num' }, { name: 'Receivable days', values: SCR.rows['Debtor Days'], fmt: 'num' }], labels: 'last', source: 'Screener.in (days of raw-material cost)' },
    ] },
    { callout: '**What to watch:** management expects FY27 debt near March-2026 levels and plans to sell non-core land from H2. With our forecast of a loss after minorities in FY27, there is little room for big dividends or new projects without selling assets. The obvious liquid asset is the ₹6,300 cr Titan stake; the company has not said it will sell it.' },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: Tata Sons controls 38%; LIC and two fund houses are the big outside holders',
  blocks: [
    { pair: [
      { type: 'line', title: 'DIIs ~21%, FIIs down from 14% to 12%', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoter group unchanged at 37.98%', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 30, max: 45, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { p: '*Net profit and EPS are attributable to Tata Chemicals\' shareholders (after minorities). FY27E: other income is shown net of tax and minorities and the tax line is zero (engine workaround, see Forecasts); FY28-29E: the tax line includes minorities.*' },
    { statement: { title: 'Profit & loss, FY18–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 12 }, hl: true },
      { key: 'ebitda', name: 'EBITDA', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 300 } },
      { key: 'dep', name: 'Depreciation' },
      { key: 'otherIncome', name: 'Other income (incl. exceptional items, JV share)' },
      { key: 'interest', name: 'Interest' },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit (after minorities)', hl: true, flag: { type: 'pct', th: 40 } },
      { key: 'eps', name: 'EPS (₹)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' },
      { key: 'capex', name: 'Capex' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 12 }, hl: true },
      { key: 'ebitda', name: 'EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' },
      { key: 'dep', name: 'Depreciation' },
      { key: 'interest', name: 'Interest' },
      { key: 'pat', name: 'Net profit (after minorities)', hl: true },
    ] } },
  ],
};

const statementNotes = {};

module.exports = { financials, capital, balance, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  const B = fs.existsSync(path.join(__dirname, 'TATACHEM.research.js')) ? require('./TATACHEM.research') : null;
  const report = {
    symbol: 'TATACHEM', listing: 'NSE: TATACHEM · BSE: 500770', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Chemicals',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
