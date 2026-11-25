// Authoring source for the Reliance Industries (RELIANCE) initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated, attributable profit via
// RELIANCE.patch.js). Part B (RELIANCE.research.js + part2-8, shared RELIANCE.ctx.js) adds the research chapters.
// RELIANCE.sync.js first writes the derived SOTP inputs into assumptions.json. Usage: node tools/authoring/RELIANCE.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'RELIANCE', 'research');
const MF = path.join(__dirname, '..', '..', 'data', 'models', 'RELIANCE.json');
const EPS = fs.existsSync(MF) ? JSON.parse(fs.readFileSync(MF, 'utf8')).forecast.F.eps.map(e => (Math.round(e * 10) / 10).toFixed(1)) : ['–', '–', '–'];
const SRC = { co: 'Company filings, Screener.in (consolidated; profit attributable to RIL shareholders), GAM Research', seg: 'Company presentations and annual-report segment notes; GAM estimates FY27-29E' };

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Twice the EBITDA of FY21, but profit per share has grown only ~9% a year',
  blocks: [
    { p: 'Revenue more than doubled from FY21 (₹4.66 lakh cr, Screener basis) to FY26 (₹10.56 lakh cr), mostly because crude prices recovered. The quality of the growth is in EBITDA: company EBITDA rose from ₹97,580 cr to ₹2,07,911 cr, with Jio (₹34,035 cr to ₹76,560 cr) and Retail (₹9,842 cr to ₹27,034 cr) doing most of the work and O2C up 1.6x. But shareholders saw less of it: depreciation doubled (₹26,572 cr to ₹57,688 cr), interest rose as 5G and new projects were capitalised, and outside investors in Jio and Retail now take ~₹15,000 cr a year. EPS (after the 2024 bonus) went from ₹38.75 to ₹59.69 (FY26 includes ~₹5.4 of Asian Paints gain): ~9% a year.' },
    { pair: [
      { type: 'column', title: 'Revenue follows crude: ₹10.6 lakh cr in FY26, ₹13.7 lakh cr by FY29E', unit: 'Revenue (₹ crore, Screener basis)', x: 'fin.labels', from: 'FY19', to: 'FY29E', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'line', title: 'EBITDA margin (Screener basis, excl. other income): 16-18%', unit: 'EBITDA margin (%)', x: 'fin.labels', from: 'FY19', to: 'FY29E', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 10, max: 20, source: SRC.co },
    ] },
    { pair: [
      { type: 'column', title: `EPS (attributable, bonus-adjusted): ₹${EPS[0]} / ₹${EPS[1]} / ₹${EPS[2]} in FY27-29E`, unit: 'EPS (₹)', x: 'fin.labels', from: 'FY19', to: 'FY29E', series: [{ name: 'EPS', ref: 'fin.eps', fmt: 'n1' }], labels: 'all', source: SRC.co + '. FY26 includes the ₹8,924 cr (pre-tax) gain on Asian Paints shares.' },
      { type: 'column', title: 'ROE stuck at ~8-9%: a heavy asset base earns little', unit: 'Return on equity (%)', x: 'fin.labels', from: 'FY19', to: 'FY29E', series: [{ name: 'ROE', ref: 'fin.roe', fmt: 'pct' }], labels: 'all', source: SRC.co },
    ] },
    { callout: '**Our view:** RIL is a growth company at the segment level and a low-return company at the group level. Every rupee of EBITDA growth since FY21 has needed roughly a rupee of fresh capital (5G spectrum and network, retail stores, new energy), and a growing slice of the profit belongs to minority investors. That is why EPS growth lags EBITDA growth, and why the market values the group on a sum of the parts rather than on headline profit.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capex & returns', kicker: 'Capital allocation', title: 'Capex of ~₹1.3-1.45 lakh cr a year absorbs almost all operating cash flow',
  blocks: [
    { p: 'RIL spent ₹1,31,769 cr in FY24, ₹1,31,107 cr in FY25 and ₹1,44,271 cr in FY26 (segment note), and ₹38,682 cr in Q1FY27, on 5G spectrum and network, retail stores and hyper-local delivery, O2C projects, data centres and the New Energy giga-complex at Jamnagar. Cash from operations was ₹1,92,113 cr in FY26 (Screener), so free cash flow after capex is thin, and the company\'s net debt has stayed at ₹1.17-1.25 lakh cr for two years. We model capex of ₹1.45 / 1.40 / 1.30 lakh cr in FY27-29E. Returns stay low: ROE {{fin.roe.0|pct}} / {{fin.roe.1|pct}} / {{fin.roe.2|pct}} in FY27-29E.' },
    { pair: [
      { type: 'column', title: 'Cash from operations vs capex', unit: '₹ crore', x: 'fin.labels', from: 'FY19', to: 'FY29E', series: [{ name: 'Cash from operations', ref: 'fin.cfo', fmt: 'num' }, { name: 'Capex', ref: 'fin.capex', fmt: 'num' }], labels: 'none', source: SRC.co + '. Forecast cash flow from the engine includes a working-capital release we do not rely on (see Balance sheet).' },
      { type: 'column', title: 'Capex by segment, FY26: Digital and Others (New Energy, media, FMCG) lead', unit: '₹ crore', x: ['O2C', 'Oil & gas', 'Retail', 'Digital', 'Others', 'Unallocable'], series: [{ name: 'FY26 capex', values: [32365, 1756, 21131, 33101, 52521, 3397], fmt: 'num' }], labels: 'all', source: 'AR FY26 segment note (capital expenditure)' },
    ] },
    { callout: '**The capital question:** management promises to keep capex within operating cash flow and net debt below 1x EBITDA, and it has. But the payback on ~₹4 lakh cr spent in FY24-26 depends on businesses that do not yet earn their cost of capital at group level (New Energy, data centres, consumer brands, hyper-local retail). Dividends are only ~10% of profit (₹6 a share for FY26).' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & debt', kicker: 'Balance sheet', title: 'Net debt ₹1.23 lakh cr (0.6x EBITDA), plus ₹1 lakh cr of spectrum dues the headline leaves out',
  blocks: [
    { p: 'At Mar-2026 gross debt was ₹3,74,421 cr against ₹2,49,704 cr of cash and marketable securities: net debt ₹1,24,717 cr on the company\'s definition (₹1,22,914 cr at Jun-2026, 0.6x LTM EBITDA). Three items sit outside that figure: ₹1,04,514 cr of deferred payment liabilities for spectrum (₹99,552 cr non-current), ₹23,579 cr of lease liabilities, and ₹1,44,605 cr of long-term investments at book, of which ₹98,881 cr are preference shares in Jio Digital Fibre (the fibre infrastructure vehicle) carried at a Level-3 fair value. Minority interest on the balance sheet is ₹1,81,836 cr. Ratings: A- (S&P) / Baa1 (Moody\'s), above India\'s sovereign.' },
    { exhibit: { type: 'table', title: 'Net debt by quarter (₹ crore, company definition)', head: ['Mar-25', 'Jun-25', 'Sep-25', 'Dec-25', 'Mar-26', 'Jun-26'], rows: [['1,17,083', '1,17,581', '1,18,545', '1,17,102', '1,24,717', '1,22,914']], source: 'Quarterly results presentations' } },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore, Screener basis)', head: ['', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth (owners)', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}'],
      ['Borrowings incl. leases', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}'],
      ['Cash and investments (incl. strategic)', '{{A.cashAndInvestments.9|num}}', '{{A.cashAndInvestments.10|num}}', '{{A.cashAndInvestments.11|num}}'],
      ['Net fixed assets + CWIP', '{{A.fixedAssets.9|num}} + {{A.cwip.9|num}}', '{{A.fixedAssets.10|num}} + {{A.cwip.10|num}}', '{{A.fixedAssets.11|num}} + {{A.cwip.11|num}}'],
      ['Inventories', '{{A.inventories.9|num}}', '{{A.inventories.10|num}}', '{{A.inventories.11|num}}'],
      ['Trade payables', '{{A.payables.9|num}}', '{{A.payables.10|num}}', '{{A.payables.11|num}}'],
    ], source: SRC.co + '. Screener\'s borrowings exclude ₹99,552 cr of non-current spectrum dues; its investments include the JDFPL preference shares.' } },
    { callout: '**In the model:** the engine\'s forecast cash pile moves "other liabilities" with sales; for RIL those include minority interest, deferred tax and spectrum dues (−43% of sales), so the crude-driven revenue jump would release ~₹77,000 cr of cash that does not exist. We do not use it: the SOTP and our DCF take net debt from our own cash-flow bridge (company EBITDA less cash tax, interest, capex and dividends), which leaves net debt at ~₹1.23 lakh cr in Mar-27E and ~₹1.0 lakh cr in Mar-28E.' },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: Ambani family 50.5%, Indian institutions 21%, foreign funds 17%',
  blocks: [
    { pair: [
      { type: 'line', title: 'Indian institutions have replaced foreign funds', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoter holding steady at ~50%', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 40, max: 55, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY15–FY29E (attributable profit; FY27-29E tax line includes minorities)', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 20 }, hl: true },
      { key: 'ebitda', name: 'EBITDA (Screener basis, excl. other income)', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 250 } },
      { key: 'dep', name: 'Depreciation' },
      { key: 'otherIncome', name: 'Other income (incl. exceptional gains in actuals)' },
      { key: 'interest', name: 'Finance cost' },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit to owners', hl: true, flag: { type: 'pct', th: 20 } },
      { key: 'eps', name: 'EPS (₹)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' },
      { key: 'capex', name: 'Capex' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 15 }, hl: true },
      { key: 'ebitda', name: 'EBITDA (Screener basis)' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' },
      { key: 'otherIncome', name: 'Other income' },
      { key: 'dep', name: 'Depreciation' },
      { key: 'pat', name: 'Net profit to owners', hl: true },
    ] } },
  ],
};

module.exports = { financials, capital, balance, ownershipBase, statements, RD };

if (require.main === module) {
  require('./RELIANCE.sync').syncAll();
  const B = fs.existsSync(path.join(__dirname, 'RELIANCE.research.js')) ? require('./RELIANCE.research') : null;
  const report = {
    symbol: 'RELIANCE', listing: 'NSE: RELIANCE · BSE: 500325', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Oil, Gas & Consumable Fuels',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements],
    statementNotes: { ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
