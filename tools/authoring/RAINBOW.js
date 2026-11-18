// Authoring source for the Rainbow Children's Medicare initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated; profit attributable to owners,
// see RAINBOW.patch.js). Part B (RAINBOW.research.js + part2-6, shared RAINBOW.ctx.js) adds the research chapters.
// Usage: node tools/authoring/RAINBOW.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'RAINBOW', 'research');
const SCR = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8')).tables.ratios;
const RL = SCR.periods.map(p => 'FY' + p.slice(-2));
const SRC = { co: 'Company filings, Screener.in (consolidated, post-Ind AS 116), GAM Research' };

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Revenue up 2.4x since FY20 and margins above 30%, but growth slowed to 12% in FY26',
  blocks: [
    { p: 'Rainbow\'s revenue grew from ₹719 cr in FY20 to ₹1,703 cr in FY26 (15% a year). FY21 fell 10% in the Covid lockdowns; FY22 jumped 50%, helped by ₹96 cr of one-off Covid-vaccine revenue. Since then growth has been 21%, 10%, 17% and 12%: slower in years when new hospitals were still filling (FY24) and when the paediatric infection season was weak (FY26). Profit attributable to shareholders rose from ₹138 cr (FY22) to ₹278 cr (FY26), ~19% a year, helped by rising interest income in FY23-25.' },
    { pair: [
      { type: 'column', title: 'Revenue: 15% a year since FY20, with two soft years', unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY17', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num', growth: true }], source: SRC.co },
      { type: 'column', title: 'Net profit: doubled since FY22', unit: 'Net profit attributable to shareholders (₹ crore)', x: 'fin.labels', from: 'FY17', to: 'FY26', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: 34% peak in FY23, drifting down as beds are added', unit: 'EBITDA margin, post-Ind AS 116 (%)', x: 'fin.labels', from: 'FY19', to: 'FY26', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 15, max: 40, source: SRC.co },
      { type: 'hbar', title: 'Doctors are the biggest cost: a quarter of revenue', unit: 'FY26 costs and EBITDA, % of revenue', x: ['Professional fees to doctors', 'Employees (nurses, staff)', 'Medicines and consumables', 'Other expenses', 'EBITDA (post-Ind AS)'], series: [{ name: 'Share', values: [24.6, 13.7, 13.3, 16.4, 32.0], fmt: 'pct' }], labels: 'all', highlight: 'EBITDA (post-Ind AS)', source: 'AR FY26 MD&A and consolidated notes 2.22-2.26' },
    ] },
    { callout: '**Our view:** Rainbow earns unusually high margins for an Indian hospital (32% post-Ind AS, 26% after rent) because it runs a focused specialty with full-time doctors and a high share of intensive care. The trend is the issue: every wave of new beds (FY24, FY26-27) has pulled the margin down for 2-3 years, and the next wave is bigger.' },
  ],
};

const seasons = {
  id: 'seasons', nav: 'Seasonality', kicker: 'Seasonality', title: 'A seasonal business: children fall sick in the monsoon and winter',
  blocks: [
    { p: 'Paediatric admissions rise with respiratory and vector-borne infections in the monsoon (July-September) and winter (October-December). So Q2 and Q3 are Rainbow\'s strong quarters and Q1 (April-June, summer holidays) the weakest: in FY25 occupancy was 42% in Q1 and 60% in Q2. Seasonal patients are mostly low-acuity and stay longer, so ARPOB moves the other way (lowest in Q2). FY26 had a weak season: Q2 occupancy fell to 52% from 60% and revenue grew only 7% in Q2 and 12% in Q3. Management says growth would have been 18-20% instead of 12% with a normal season, and that it is working to depend less on it.' },
    { pair: [
      { type: 'column', title: 'Quarterly revenue: peaks in Q2-Q3, flat through FY26\'s weak season', unit: 'Revenue (₹ crore)', x: 'Q.labels', series: [{ name: 'Revenue', ref: 'Q.sales', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'line', title: 'Occupancy swings 15-20 points within a year', unit: 'Network occupancy (%), quarterly', x: 'R.segments.quarterly[].q', series: [{ name: 'Occupancy', ref: 'R.segments.quarterly[].occupancyPct', fmt: 'pct' }], labels: 'all', min: 30, max: 65, source: 'Company presentations (Q1FY25-Q1FY27)' },
    ] },
    { callout: '**Why it matters now:** the 2026 monsoon arrived late and ended ~13% below normal (IMD); on 31-Jul-2026 management said it was "too early" to call the season. Our FY27 forecast assumes a season between FY25 (strong) and FY26 (weak). Q2FY27 results (due by mid-November 2026) will show it.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capex & returns', kicker: 'Capital allocation', title: 'Self-funded growth so far; the next capex cycle is twice as large',
  blocks: [
    { p: 'Rainbow has funded its growth without debt. Over FY25-26 it generated ₹816 cr of operating cash, paid ₹183 cr of rent (lease payments), spent ₹362 cr on capex and ₹203 cr on two acquisitions, and paid ₹60 cr of dividends. Returns are good but falling: ROCE (Screener, post-Ind AS) was 23-24% in FY22-23 and 17% in FY26, as ~780 beds were added in two years. The company\'s own return on capital employed excluding cash was 23.7% in FY26 (26.0% in FY25). The next phase is bigger: ~₹2,200 cr over five years for ~2,500 beds (₹440 cr a year, twice FY26 capex).' },
    { pair: [
      { type: 'column', title: 'Operating cash flow vs capex', unit: '₹ crore', x: 'A.labels', from: 'FY19', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }], labels: 'none', source: SRC.co },
      { type: 'line', title: 'ROCE: 24% in FY23, 17% in FY26', unit: 'Return on capital employed (%)', x: RL, series: [{ name: 'ROCE', values: SCR.rows['ROCE %'], fmt: 'pct0' }], labels: 'all', min: 0, max: 30, source: 'Screener.in (capital includes lease liabilities)' },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went (₹ crore)', head: ['', 'FY25', 'FY26', 'Two years'], rows: [
      ['Cash from operations (Screener)', '{{A.cfo.10|num}}', '{{A.cfo.11|num}}', '816'],
      ['Lease payments: rent, principal + interest (AR note 2.32)', '87', '96', '183'],
      ['Capex', '{{A.capex.10|num}}', '{{A.capex.11|num}}', '362'],
      ['Acquisitions (Warangal, Guwahati)', '0', '203', '203'],
      ['Dividends', '{{A.dividendsPaid.10|num}}', '{{A.dividendsPaid.11|num}}', '60'],
      { hl: true, cells: ['**Left over**', '**133**', '**−125**', '**8**'] },
      ['Memo: cash, deposits and investments (company)', '~696', '594', ''],
    ], source: 'Screener.in cash flow; AR FY26. Treasury income (₹40-50 cr a year) sits in investing cash flow and is not in "left over". Mar-25 cash = Screener cash and investments + ₹105 cr of bank deposits (AR FY26).' } },
    { callout: '**The capital question:** management says all ~₹2,200 cr will come from internal accruals. On our numbers operating cash after rent (~₹400-600 cr a year in FY27-29E) roughly covers capex (₹380-480 cr) and dividends, so cash stays near ₹600 cr and there is little room for a large acquisition without debt. Returns on the new hospitals, mostly outside the South, decide whether this cycle creates value.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & leases', kicker: 'Balance sheet', title: 'No borrowings, but ₹891 cr of lease liabilities: net cash on one basis, net debt on the other',
  blocks: [
    { p: 'Rainbow has no bank debt. It leases most of its hospital buildings (lease terms of 3-20 years; most new spokes are leased, the Gurugram projects are on owned land). Under Ind AS 116 the present value of future rent sits on the balance sheet as a lease liability: ₹891 cr at Mar-2026 (₹764 cr a year earlier; ₹146 cr of new leases in FY26), and rent appears as depreciation (₹54 cr) and interest (₹78 cr) rather than as an expense. Against this the company holds ₹594 cr of cash, bank deposits and debt mutual funds (₹613 cr at Jun-2026). So Rainbow has **net cash of ~₹600 cr ignoring leases**, or **net debt of ~₹300 cr including them**. Both are fine; what matters is using one basis consistently (see Valuation).' },
    { pair: [
      { type: 'column', title: 'Lease liabilities have grown with the network', unit: 'Borrowings (₹ crore): lease liabilities, plus ₹30-60 cr of bank debt and preference capital in FY19-22', x: 'A.labels', from: 'FY19', series: [{ name: 'Lease liabilities', ref: 'A.borrowings', fmt: 'num' }], labels: 'all', source: 'Screener.in (borrowings schedule: all lease liabilities since FY23)' },
      { type: 'line', title: 'Suppliers fund the working capital', unit: 'Days', x: RL, series: [{ name: 'Receivable days', values: SCR.rows['Debtor Days'], fmt: 'num' }, { name: 'Payable days', values: SCR.rows['Days Payable'], fmt: 'num' }], labels: 'last', source: 'Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-23', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth (owners)', '{{A.netWorth.8|num}}', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}'],
      ['Lease liabilities (no bank debt)', '{{A.borrowings.8|num}}', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}'],
      ['Cash and mutual funds (Screener)', '{{A.cashAndInvestments.8|num}}', '{{A.cashAndInvestments.9|num}}', '{{A.cashAndInvestments.10|num}}', '{{A.cashAndInvestments.11|num}}'],
      ['Bank deposits in other financial assets (AR)', '484', '188', '105', '153'],
      { hl: true, cells: ['**Net cash excl. leases**', '**~589**', '**~506**', '**~696**', '**~591**'] },
      { hl: true, cells: ['**Net debt incl. leases**', '**~−19**', '**~259**', '**~68**', '**~300**'] },
      ['Net fixed assets (incl. right-of-use buildings)', '{{A.fixedAssets.8|num}}', '{{A.fixedAssets.9|num}}', '{{A.fixedAssets.10|num}}', '{{A.fixedAssets.11|num}}'],
    ], source: 'Screener.in; AR FY24 and FY26 (bank deposits, current and non-current); GAM Research. Negative net debt = net cash.' } },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: founder family at 50%, Indian funds buying as foreign funds sell',
  blocks: [
    { pair: [
      { type: 'line', title: 'DIIs up from 14% to 23%; FIIs down from 25% to 16%', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoters steady at ~49.8%', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 40, max: 55, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY15–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 15 }, hl: true }, { key: 'ebitda', name: 'EBITDA (post-Ind AS)', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 200 } }, { key: 'dep', name: 'Depreciation (incl. right-of-use)' },
      { key: 'otherIncome', name: 'Other income' }, { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit (owners)', hl: true, flag: { type: 'pct', th: 25 } }, { key: 'eps', name: 'EPS (₹)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' }, { key: 'capex', name: 'Capex (forecasts incl. new leases)' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 20 }, hl: true }, { key: 'ebitda', name: 'EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' }, { key: 'otherIncome', name: 'Other income' },
      { key: 'dep', name: 'Depreciation' }, { key: 'pat', name: 'Net profit (owners)', hl: true },
    ] } },
  ],
};

const statementNotes = {};
module.exports = { financials, seasons, capital, balance, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  const B = fs.existsSync(path.join(__dirname, 'RAINBOW.research.js')) ? require('./RAINBOW.research') : null;
  const report = {
    symbol: 'RAINBOW', listing: 'NSE: RAINBOW · BSE: 543524', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Healthcare',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, seasons, capital, balance, ownershipBase, statements }) : [financials, seasons, capital, balance, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
