// Authoring source for the GNFC initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated). Part B
// (GNFC.research.js, merging GNFC.part2-6.js on GNFC.ctx.js) adds the research chapters.
// Usage: node tools/authoring/GNFC.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'GNFC', 'research');
const SCR = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8')).tables.ratios;
const RL = SCR.periods.map(p => 'FY' + p.slice(-2));
const M = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'models', 'GNFC.json'), 'utf8'));
const A = M.annual, i = l => A.labels.indexOf(l);
const n0 = v => Math.round(v).toLocaleString('en-IN');
const sumR = (k, a, z) => A[k].slice(i(a), i(z) + 1).reduce((s, v) => s + (v || 0), 0);
const SRC = { co: 'Company filings, Screener.in (consolidated), GAM Research' };

// Where the cash went, FY17-26 (Screener cash flow); buyback from AR FY26 note 17.4
const cf = (a, z) => ({ cfo: sumR('cfo', a, z), capex: sumR('capex', a, z), div: sumR('dividendsPaid', a, z) });
const c1 = cf('FY17', 'FY21'), c2 = cf('FY22', 'FY26');
const buyback = 652.81;
const debtRepaid = A.borrowings[i('FY16')] - A.borrowings[i('FY26')];
// FY26 pre-tax return on operating capital: EBITDA - depreciation over net worth + debt - treasury
// (treasury incl. the Rs2,410 cr ICDs with GSFS that Screener shows in loans and advances, AR FY26 note 9)
const ICD26 = 2410, b = i('FY26');
const opRoce26 = (A.ebitda[b] - A.dep[b]) / (A.netWorth[b] + A.borrowings[b] - (A.cash[b] + A.investments[b] + ICD26 - A.borrowings[b])) * 100;

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'A boom, a bust and a war: ten years of earnings that follow chemical prices',
  blocks: [
    { p: `GNFC's revenue was ₹${n0(A.sales[i('FY16')])} cr in FY16 and ₹${n0(A.sales[i('FY26')])} cr in FY26: about 5.5% a year, with almost all of the growth in one jump (FY22-23) when Chinese supply was disrupted after COVID. EBITDA (operating profit before other income) swung from ₹${n0(A.ebitda[i('FY17')])} cr (FY17) to ₹${n0(A.ebitda[i('FY22')])} cr (FY22) and back to ₹${n0(A.ebitda[i('FY24')])} cr (FY24). Net profit followed: ₹${n0(A.pat[i('FY22')])} cr at the FY22 peak, ₹${n0(A.pat[i('FY24')])} cr in FY24 and ₹${n0(A.pat[i('FY26')])} cr in FY26, of which ₹396 cr came in the single war-hit March quarter. The only loss in fifty years was FY15 (₹${n0(-A.pat[i('FY15')])} cr), the year TDI-II started on borrowed money.` },
    { pair: [
      { type: 'column', title: 'Revenue: one jump in FY22-23, flat since', unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num', growth: true }], source: SRC.co },
      { type: 'column', title: 'EBITDA: ₹2,384 cr in FY22, ₹502 cr in FY24', unit: 'EBITDA (₹ crore)', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'EBITDA', ref: 'fin.ebitda', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: 28% at the peak, 6% at the trough', unit: 'EBITDA margin (%)', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 0, max: 35, source: SRC.co },
      { type: 'column', title: 'Quarterly profit: the war doubled it', unit: 'Net profit (₹ crore)', x: 'Q.labels', series: [{ name: 'Net profit', ref: 'Q.pat', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { callout: `**So what:** GNFC is a price-taker. Its profit is set by the gap between chemical prices (TDI, aniline, acetic acid, nitric acid) and feedstock costs (toluene, benzene, methanol, fuel oil, gas, coal), and Chinese supply sets both. Other income from its treasury (₹${n0(A.otherIncome[i('FY26')])} cr in FY26, ${Math.round(A.otherIncome[i('FY26')] / A.pbt[i('FY26')] * 100)}% of pre-tax profit) steadies the bottom line. FY22-23 was a boom, FY24-25 a trough, and Q4FY26-Q1FY27 is a war spike: none of the three is a good base for valuation.` },
  ],
};

const capital = {
  id: 'capital', nav: 'Cash & capital allocation', kicker: 'Capital allocation', title: 'Ten years of cash: debt repaid, a buyback, and ₹5,200 cr parked',
  blocks: [
    { p: `Over FY17-26 GNFC generated ₹${n0(c1.cfo + c2.cfo)} cr of operating cash. It spent only ₹${n0(c1.capex + c2.capex)} cr on plants (it built nothing large between TDI-II in 2014 and the current projects), repaid ₹${n0(debtRepaid)} cr of debt, paid ₹${n0(c1.div + c2.div)} cr of dividends and bought back ₹${n0(buyback)} cr of shares in Dec-2023 at ₹770. The rest piled up: treasury (cash, deposits, G-secs, equity stakes and inter-corporate deposits) reached ~₹5,200 cr at March 2026, about ₹354 a share. Returns followed the chemical cycle: Screener's ROCE was 33% in FY22 and 12% in FY26 (diluted by the treasury); on operating capital alone the FY26 pre-tax return was ~${Math.round(opRoce26)}%, only slightly above a ~13% cost of equity, and that was helped by the war-time March quarter.` },
    { pair: [
      { type: 'column', title: 'Operating cash flow vs capex: capex finally rising', unit: '₹ crore', x: 'A.labels', from: 'FY17', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }], labels: 'none', source: SRC.co },
      { type: 'line', title: 'ROCE: 33% in FY22, 12% in FY26', unit: 'Return on capital employed (%)', x: RL, series: [{ name: 'ROCE', values: SCR.rows['ROCE %'], fmt: 'pct0' }], labels: 'all', min: 0, max: 40, source: 'Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went (₹ crore)', head: ['', 'FY17-21', 'FY22-26', 'Ten years'], rows: [
      ['Cash from operations', n0(c1.cfo), n0(c2.cfo), n0(c1.cfo + c2.cfo)],
      ['Capex', n0(c1.capex), n0(c2.capex), n0(c1.capex + c2.capex)],
      ['Free cash flow', n0(c1.cfo - c1.capex), n0(c2.cfo - c2.capex), n0(c1.cfo + c2.cfo - c1.capex - c2.capex)],
      ['Dividends paid', n0(c1.div), n0(c2.div), n0(c1.div + c2.div)],
      ['Buyback (Dec-2023, ₹770 a share)', '–', n0(buyback), n0(buyback)],
      ['Debt repaid (borrowings Mar-16 → Mar-26)', '', '', n0(debtRepaid)],
      { hl: true, cells: ['**Left over (mostly into treasury)**', '', '', `**${n0(c1.cfo + c2.cfo - c1.capex - c2.capex - c1.div - c2.div - buyback - debtRepaid)}**`] },
    ], source: SRC.co + '; AR FY26 note 17.4 (buyback)' } },
    { callout: '**Capital allocation from here:** the cash is now being spent. ₹2,800 cr of projects (nitric acid, ammonium nitrate, an ammonia loop upgrade and a coal-fired steam and power plant) run to mid-2027, a ₹480-500 cr boiler follows, and management is studying BPA, polyols and a 350 KTPA acetic acid plant (BPA with an upstream phenol plant alone was put at ₹7,000-8,000 cr in Nov-2025). Meanwhile ₹2,410 cr sits in deposits with Gujarat State Financial Services, a state finance company, at ~7.25%. Minority shareholders get a 35-40% payout and no say in either decision.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & treasury', kicker: 'Balance sheet', title: 'No debt and ₹354 a share of treasury, much of it outside Screener\'s cash line',
  blocks: [
    { p: 'GNFC has had no meaningful debt since FY21. Screener shows "cash and investments" of only ₹2,802 cr at March 2026, down from ₹4,612 cr, but that is a reclassification, not a loss: during FY26 the company moved ₹1,865 cr out of bank deposits and G-secs into inter-corporate deposits (ICDs) with Gujarat State Financial Services, which Screener records under "loans and advances". Adding them back, treasury rose slightly, to ~₹5,200 cr. About ₹1,000 cr of it is equity stakes in other Gujarat state companies (Gujarat Gas, Gujarat Alkalies, GSFC, Gujarat Chemical Port) and the GGRC associate, which earn dividends, not interest.' },
    { exhibit: { type: 'table', title: 'Treasury, company notes vs Screener (₹ crore)', head: ['', 'Mar-25', 'Mar-26'], rows: [
      ['Cash and bank balances (incl. deposits up to 12 months)', '2,308', '1,109'],
      ['Government securities', '1,308', '695'],
      ['ICDs with Gujarat State Financial Services (in "loans and advances")', '545', '2,410'],
      ['Equity stakes and associate (GSFC, GACL, Gujarat Gas, Gujarat Chemical Port, GGRC…)', '996', '998'],
      ['Less: borrowings (incl. leases)', '(106)', '(5)'],
      { hl: true, cells: ['**Treasury, model basis**', '**5,051**', '**5,207**'] },
      ['Memo: Screener "cash and investments"', '4,612', '2,802'],
      ['Memo: subsidy receivable from the government', '262', '496'],
    ], source: 'AR FY26 consolidated notes 8, 9, 11, 14, 15, 19; Screener.in' } },
    { pair: [
      { type: 'line', title: 'Receivable days: 100 in FY20, 30 in FY26', unit: 'Days', x: RL, series: [{ name: 'Receivable days', values: SCR.rows['Debtor Days'], fmt: 'num' }, { name: 'Inventory days', values: SCR.rows['Inventory Days'], fmt: 'num' }], labels: 'last', source: 'Screener.in' },
      { type: 'column', title: 'CWIP: ₹900 cr as the projects get built', unit: 'Capital work in progress (₹ crore)', x: 'A.labels', from: 'FY17', series: [{ name: 'CWIP', ref: 'A.cwip', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { callout: '**Working capital and subsidies:** fertiliser subsidy is paid by the government after sale, so subsidy receivables are the swing item. Total receivables were ₹1,413 cr (100 days of sales) in FY20 against ₹641 cr (30 days) in FY26; subsidy receivables were ₹496 cr at March 2026 and ~₹302 cr at December 2025, and the FY27 subsidy budget is ₹1.71 lakh cr. Our model holds net operating working capital at FY26\'s 1.6% of revenue, which includes that ₹496 cr. Each ₹500 cr of delayed subsidy would cost ~₹34 a share of treasury, not earnings.' },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: the Government of Gujarat controls 41%; foreign funds have been selling',
  blocks: [
    { pair: [
      { type: 'line', title: 'FIIs from 20% to 13%, DIIs ~11%', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoters unchanged at 41.3%', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 30, max: 50, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY18–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 15 }, hl: true },
      { key: 'ebitda', name: 'EBITDA', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 400 } },
      { key: 'dep', name: 'Depreciation' },
      { key: 'otherIncome', name: 'Other income (treasury, grants, misc.)' },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit', hl: true, flag: { type: 'pct', th: 30 } },
      { key: 'eps', name: 'EPS (₹)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' },
      { key: 'capex', name: 'Capex' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 20 }, hl: true },
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
  const B = fs.existsSync(path.join(__dirname, 'GNFC.research.js')) ? require('./GNFC.research') : null;
  const report = {
    symbol: 'GNFC', listing: 'NSE: GNFC · BSE: 500670', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Chemicals & Fertilisers',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
