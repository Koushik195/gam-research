// Authoring source for the Bosch Ltd initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated; FY26 excludes Bosch Chassis Systems
// India, bought in Jul-2026; Mar-26 balance sheet pro forma for that purchase, see BOSCHLTD.patch.js). Part B
// (BOSCHLTD.research.js + part2-6, shared BOSCHLTD.ctx.js) adds the research chapters. BOSCHLTD.val.js first syncs the
// derived multiples into assumptions.json. Usage: node tools/authoring/BOSCHLTD.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'BOSCHLTD', 'research');
const SCR = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8')).tables.ratios;
const keepR = SCR.periods.map(p => /^Mar 20(1[6-9]|2\d)$/.test(p) && `${p.slice(-4)}-05-30` <= '2026-09-30');
const RL = SCR.periods.filter((_, i) => keepR[i]).map(p => 'FY' + p.slice(-2));
const RR = k => SCR.rows[k].filter((_, i) => keepR[i]);
const SRC = { co: 'Company filings, Screener.in (consolidated; FY26 before the RBIC purchase), GAM Research' };

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Ten years to double revenue; margins never got back to the pre-BS-VI level',
  blocks: [
    { p: 'Bosch\'s revenue was ₹9,701 cr in FY16 and ₹20,035 cr in FY26: 7.5% a year. The decade had two halves. Up to FY19 Bosch earned an 18-19% EBITDA margin selling diesel fuel-injection systems; then the BS-VI emission rules (Apr-2020), Covid and the collapse of small diesel cars cut revenue by a fifth and the margin to 12% in FY21. Since then revenue has grown 15.6% a year (FY21-26) on vehicle volumes, gasoline and 2-wheeler engine management and the aftermarket, but the margin has only crept back from 12.0% to 13.2%. Reported EPS is noisy: restructuring charges cut it to ₹220 (FY20) and ₹163 (FY21); gains on selling businesses lifted it to ₹845 (FY24) and ₹940 (FY26). Before exceptional items EPS went from ₹330 (FY21) to ₹796 (FY26): ~19% a year.' },
    { pair: [
      { type: 'column', title: 'Revenue: flat for five years, then +15.6% a year since FY21', unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'column', title: 'Reported profit swings with one-offs (FY20-21 charges, FY24 and FY26 gains)', unit: 'Net profit (₹ crore)', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: 19% before BS-VI, 12-13% since', unit: 'EBITDA margin (%)', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 8, max: 22, source: SRC.co },
      { type: 'column', title: 'Other income was 25-40% of pre-tax profit (treasury plus gains)', unit: 'Other income incl. exceptional items, % of profit before tax', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'Share of PBT', ref: 'fin.otherIncomeShare', fmt: 'pct0' }], labels: 'all', source: SRC.co },
    ] },
    { callout: '**Our view:** the operating business has recovered but not re-rated its economics. Bosch Ltd sells much of what the group designs and partly makes elsewhere: 58% of its purchases are from related parties and traded goods are 40% of revenue, so its EBITDA margin sits well below listed peers such as Schaeffler or Sona. Until FY26 a ₹13,000-14,000 cr treasury added ₹800-850 cr a year of other income (28% of pre-tax profit before exceptional items). After the ₹9,060 cr cash payment for RBIC that cushion shrinks to ~₹400-450 cr; the earnings mix shifts from interest to operating profit, which is better quality but not more of it per share than the market already assumes.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capex & returns', kicker: 'Capital allocation', title: 'An asset-light business that piled up cash, then spent two-thirds of it buying a sister company',
  blocks: [
    { p: 'Bosch needs little capital: net fixed assets were ₹1,654 cr at Mar-2026 against ₹20,035 cr of revenue, and cash capex has been only ₹300-650 cr a year. Over FY21-26 it generated ₹8,124 cr of operating cash, spent ₹2,268 cr on capex and paid ₹5,300 cr of dividends (₹1,023 cr of the FY26 cash dividend went to the parent). It also sold three businesses (Project House to a group company in FY24 for ₹781 cr, diagnostics to ETAS in FY25, building technologies to Keenfinity in FY26 for ₹595 cr). Returns were held down by the cash: ROCE of 14-22% since FY21 on Screener\'s basis. In Jul-2026 Bosch paid ₹9,060 cr in cash (plus 2,460 new shares) for RBIC; the new dividend policy (55-85% of profit) and RBIC\'s cash generation now decide how fast the treasury rebuilds.' },
    { pair: [
      { type: 'column', title: 'Operating cash flow covers capex several times over', unit: '₹ crore', x: 'A.labels', from: 'FY16', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }], labels: 'none', source: SRC.co },
      { type: 'line', title: 'ROCE: 26% in FY16-17, 14% in FY21, 22% now (diluted by cash)', unit: 'Return on capital employed (%), Screener basis', x: RL, series: [{ name: 'ROCE', values: RR('ROCE %'), fmt: 'pct0' }], labels: 'all', min: 0, max: 35, source: 'Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went (₹ crore)', head: ['', 'FY21-23', 'FY24-26', 'Six years'], rows: [
      ['Cash from operations', '2,318', '5,806', '8,124'],
      ['Capex (cash)', '1,307', '961', '2,268'],
      ['Dividends paid', '1,858', '3,442', '5,300'],
      { hl: true, cells: ['**Left over (into treasury)**', '**−847**', '**1,403**', '**556**'] },
      ['Memo: proceeds from business sales (exceptional)', '–', '~1,420', ''],
      ['Memo: RBIC purchase (Jul-2026, FY27)', '', '', '9,060 (cash) + 2,460 shares'],
    ], source: 'Screener.in cash flow (consolidated); AR FY24-FY26 note 40 (business sales); RBIC deck and postal ballot notice (Apr-2026)' } },
    { callout: '**The capital question:** RBIC is the first big use of Bosch\'s cash in a decade, and it was bought from the parent. The price (10.6x FY25 EV/EBITDA, 16.6x FY25 profit) is reasonable next to Bosch\'s own ~35x EV/EBITDA, and minority shareholders approved it in a vote the promoter could not join. But the deal also means the parent converted a sister company into ~₹9,060 cr of cash, while Bosch Ltd swapped a ~6.5% pre-tax treasury yield for RBIC\'s ~8-9% after-tax earnings yield on the price. That is accretive (~15% to our FY27E EPS) and sensible; it is not a free lunch.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'No debt; ₹13,600 cr of net treasury at Mar-26, ~₹5,600 cr after paying for RBIC',
  blocks: [
    { p: 'At Mar-2026 Bosch held ₹6,783 cr of debt mutual funds and bonds, ₹4,271 cr of bank deposits, ₹950 cr of secured loans to Bosch group companies (8.90-9.55%, guaranteed by Robert Bosch GmbH), ₹396 cr of cash, ₹137 cr of accrued interest and ₹1,198 cr of listed and unlisted equity (HDFC Bank ₹892 cr, ICICI Bank ₹290 cr), against ₹119 cr of lease liabilities: ~₹13,600 cr net, ~₹4,600 a share. After the ₹9,060 cr RBIC payment (and RBIC\'s own ~₹1,030 cr of cash) the pro forma figure is ~₹5,640 cr, ~₹1,900 a share; the FY26 dividend (₹796 cr) was paid in Aug-2026. In our model the Mar-26 balance sheet is shown on this pro forma basis (investments and reserves both ₹8,020 cr lower), so the FY26 column of the balance sheet and FY26 ROE are not the reported ones (reported net worth ₹14,846 cr, ROE 19.4%). Working capital is light: inventory ~60 days, receivables ~50 days, payables ~98 days.' },
    { pair: [
      { type: 'line', title: 'Inventory days down from 86 to 61; payables up to 98', unit: 'Days', x: RL, series: [{ name: 'Inventory days', values: RR('Inventory Days'), fmt: 'num' }, { name: 'Receivable days', values: RR('Debtor Days'), fmt: 'num' }, { name: 'Payable days', values: RR('Days Payable'), fmt: 'num' }], labels: 'last', source: 'Screener.in' },
      { type: 'column', title: 'Cash and investments on Screener\'s basis (Mar-26 pro forma; deposits excluded)', unit: 'Cash and investments (₹ crore)', x: 'A.labels', from: 'FY16', series: [{ name: 'Cash and investments', ref: 'A.cashAndInvestments', fmt: 'num' }], labels: 'all', source: SRC.co + '. Bank deposits over 12 months and group loans (₹5,357 cr at Mar-26) sit in other assets.' },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-22', 'Mar-24', 'Mar-25', 'Mar-26 (pro forma)'], rows: [
      ['Net worth', '{{A.netWorth.7|num}}', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}'],
      ['Borrowings (leases)', '{{A.borrowings.7|num}}', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}'],
      ['Cash and investments (Screener basis)', '{{A.cashAndInvestments.7|num}}', '{{A.cashAndInvestments.9|num}}', '{{A.cashAndInvestments.10|num}}', '{{A.cashAndInvestments.11|num}}'],
      ['Net fixed assets', '{{A.fixedAssets.7|num}}', '{{A.fixedAssets.9|num}}', '{{A.fixedAssets.10|num}}', '{{A.fixedAssets.11|num}}'],
      ['Inventories', '{{A.inventories.7|num}}', '{{A.inventories.9|num}}', '{{A.inventories.10|num}}', '{{A.inventories.11|num}}'],
      ['Trade receivables', '{{A.receivables.7|num}}', '{{A.receivables.9|num}}', '{{A.receivables.10|num}}', '{{A.receivables.11|num}}'],
      ['Trade payables', '{{A.payables.7|num}}', '{{A.payables.9|num}}', '{{A.payables.10|num}}', '{{A.payables.11|num}}'],
    ], source: SRC.co + '. Mar-26 pro forma: reported net worth ₹14,846 cr and investments ₹8,020 cr, both less the ₹8,020 cr net RBIC outflow (BOSCHLTD.patch.js).' } },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: Robert Bosch 70.5%, Indian institutions 15%, foreign funds 7%',
  blocks: [
    { pair: [
      { type: 'line', title: 'Foreign funds up from 4% to 7% in two years; Indian institutions down', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoter fixed at 70.54%', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 60, max: 80, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY15–FY29E', rows: [
      { key: 'sales', name: 'Revenue (FY27E onwards incl. RBIC)', flag: { type: 'pct', th: 15 }, hl: true },
      { key: 'ebitda', name: 'EBITDA', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 150 } },
      { key: 'dep', name: 'Depreciation' },
      { key: 'otherIncome', name: 'Other income (incl. exceptional items in actual years)', flag: { type: 'pct', th: 40 } },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit', hl: true, flag: { type: 'pct', th: 25 } },
      { key: 'eps', name: 'EPS (₹)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' },
      { key: 'capex', name: 'Capex' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L (as reported by 30-Sep-2026)', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 15 }, hl: true },
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
  require('./BOSCHLTD.val').syncMultiples();
  const B = fs.existsSync(path.join(__dirname, 'BOSCHLTD.research.js')) ? require('./BOSCHLTD.research') : null;
  const report = {
    symbol: 'BOSCHLTD', listing: 'NSE: BOSCHLTD · BSE: 500530', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Automobiles & components',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
