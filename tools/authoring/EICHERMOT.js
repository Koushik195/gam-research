// Authoring source for the Eicher Motors initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated = Royal Enfield; VECV is a
// joint venture whose 54.4% profit share Screener adds to other income). Part B (EICHERMOT.research.js + part2-6,
// shared EICHERMOT.ctx.js) adds the research chapters. EICHERMOT.sotp.js first syncs the SOTP into
// assumptions.json (implied P/E on Sep-28E EPS). Usage: node tools/authoring/EICHERMOT.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'EICHERMOT', 'research');
const SCR = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8')).tables.ratios;
const keepR = SCR.periods.map(p => `${p.slice(-4)}-05-30` <= '2026-09-30');
const RL = SCR.periods.filter((_, i) => keepR[i]).map(p => 'FY' + p.slice(-2));
const RR = k => SCR.rows[k].filter((_, i) => keepR[i]);
const SRC = { co: 'Company filings, Screener.in (consolidated: Royal Enfield, with VECV\'s profit share in other income), GAM Research' };

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Revenue up 2.7x and EPS 4x since FY21, but margins peaked in FY24',
  blocks: [
    { p: 'Eicher\'s consolidated revenue (Royal Enfield only) went from ₹8,720 cr in FY21, a Covid year, to ₹23,408 cr in FY26: about 22% a year. EPS went from ₹49.3 to ₹201.1, about 33% a year, helped by three things on top of volume: operating leverage, a growing share of VECV\'s profit (₹0 in FY21, ₹798 cr in FY26) and rising treasury income (₹482 cr to ₹1,487 cr). Before that, FY19-FY21 were poor years: volumes fell from 8.3 lakh to 6.1 lakh as Royal Enfield raised prices for new safety rules and Covid hit, and EBITDA margin slid from 30% to 20%.' },
    { pair: [
      { type: 'column', title: 'Revenue: flat for five years, then 22% a year since FY21', unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY17', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'column', title: 'Net profit quadrupled in five years', unit: 'Net profit (₹ crore)', x: 'fin.labels', from: 'FY17', to: 'FY26', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: 31% at the FY18 peak, 26% in FY24, 24.7% now', unit: 'EBITDA margin (%)', x: 'fin.labels', from: 'FY17', to: 'FY26', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 15, max: 35, source: SRC.co },
      { type: 'column', title: 'Other income (treasury + VECV) is a third of pre-tax profit', unit: 'Other income incl. VECV share, % of profit before tax', x: 'fin.labels', from: 'FY17', to: 'FY26', series: [{ name: 'Share of PBT', ref: 'fin.otherIncomeShare', fmt: 'pct0' }], labels: 'all', source: SRC.co },
    ] },
    { callout: '**Our view:** the FY22-FY26 earnings run was real but flattered. Royal Enfield\'s own operating profit grew from ₹2,178 cr to ₹5,789 cr (2.7x); the rest of EPS growth came from VECV\'s recovery from a CV-cycle trough (₹60 cr share in FY22) and from a larger cash pile earning higher rates. Those two sources are worth ~₹2,300 cr of FY26 pre-tax profit, 31% of the total: they are real, but VECV is cyclical and treasury income does not deserve the same multiple as motorcycles.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capex & returns', kicker: 'Capital allocation', title: 'High returns on a small asset base; capex now doubling for capacity and EVs',
  blocks: [
    { p: 'Royal Enfield needs little capital. Net fixed assets were ₹3,852 cr at Mar-2026 against ₹23,408 cr of revenue, and working capital is negative in most years because dealers pay before suppliers are paid. Cash from operations over FY21-26 was ₹18,550 cr, capex ₹4,988 cr and dividends ₹5,369 cr; the rest built a treasury of ~₹19,700 cr (net of debt, excluding VECV). Reported ROE was 24% in FY24-FY26, held down by that cash; on operating capital alone returns are well above 50%. Capex is now rising: Cheyyar brownfield (₹958 cr, 2 mn capacity by FY27-28), the Tada greenfield (₹1,225 cr phase 1, +0.45 mn by FY2029-30), the Flying Flea EV platform and new models.' },
    { pair: [
      { type: 'column', title: 'Operating cash flow covers capex several times over', unit: '₹ crore', x: 'A.labels', from: 'FY17', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }], labels: 'none', source: SRC.co },
      { type: 'line', title: 'ROCE: 53% in FY17, 17% in FY21, 31% now (diluted by cash)', unit: 'Return on capital employed (%), Screener basis', x: RL, series: [{ name: 'ROCE', values: RR('ROCE %'), fmt: 'pct0' }], labels: 'all', min: 0, max: 60, source: 'Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went (₹ crore)', head: ['', 'FY21-23', 'FY24-26', 'Six years'], rows: [
      ['Cash from operations', '6,041', '12,509', '18,550'],
      ['Capex', '1,855', '3,133', '4,988'],
      ['Dividends paid', '1,039', '4,330', '5,369'],
      { hl: true, cells: ['**Left over (into treasury)**', '**3,147**', '**5,046**', '**8,193**'] },
      ['Memo: dividends received from VECV', 'n.d.', '353 (FY25-26)', ''],
    ], source: 'Screener.in cash flow (consolidated); AR FY26 note 8 (VECV dividends Rs136 cr FY25, Rs217.6 cr FY26)' } },
    { callout: '**The capital question:** we model capex of ₹1,700-1,800 cr a year (5-6% of revenue, twice the FY21-25 level) and a 41% payout. Even so, the treasury keeps growing by ₹3,000-4,000 cr a year. Eicher could pay out far more; it has chosen to keep the cash, invest €50 mn in Stark Future (written down by ₹302 cr in FY25) and commit up to ₹750 cr to a vehicle-finance JV with Volvo. Neither is a disaster, but neither earns what Royal Enfield earns.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'No debt, ~₹19,700 cr of net treasury and a VECV stake carried at ₹3,723 cr',
  blocks: [
    { p: 'At Mar-2026 Eicher held ₹13,591 cr of debt funds, target-maturity funds and bonds, ₹5,921 cr of bank deposits (inside other assets), ₹451 cr of bills discounted for VECV\'s vendors and ₹256 cr of cash, against ₹514 cr of borrowings (incl. ₹195 cr of leases): ~₹19,700 cr net, ~₹720 a share. Separately it carries its 54.4% of VECV at ₹3,723 cr (cost ₹5 cr plus retained profits) and strategic equity stakes at ₹181 cr. Screener\'s "investments" line (₹17,496 cr) mixes the treasury funds with the VECV stake. Inventory is ~55 days of revenue; receivables only ~6 days; suppliers are paid in ~76 days.' },
    { pair: [
      { type: 'line', title: 'Inventory ~55 days; customers pay almost at once', unit: 'Days (of revenue)', x: RL, series: [{ name: 'Inventory days', values: RR('Inventory Days'), fmt: 'num' }, { name: 'Receivable days', values: RR('Debtor Days'), fmt: 'num' }, { name: 'Payable days', values: RR('Days Payable'), fmt: 'num' }], labels: 'last', source: 'Screener.in' },
      { type: 'column', title: 'Cash and investments ₹17,752 cr (Screener; plus ₹5,921 cr deposits)', unit: 'Cash and investments incl. the VECV stake (₹ crore)', x: 'A.labels', from: 'FY17', series: [{ name: 'Cash and investments', ref: 'A.cashAndInvestments', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-22', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth', '{{A.netWorth.7|num}}', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}'],
      ['Borrowings (incl. leases)', '{{A.borrowings.7|num}}', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}'],
      ['Cash and investments (incl. VECV stake)', '{{A.cashAndInvestments.7|num}}', '{{A.cashAndInvestments.9|num}}', '{{A.cashAndInvestments.10|num}}', '{{A.cashAndInvestments.11|num}}'],
      ['Net fixed assets', '{{A.fixedAssets.7|num}}', '{{A.fixedAssets.9|num}}', '{{A.fixedAssets.10|num}}', '{{A.fixedAssets.11|num}}'],
      ['Inventories', '{{A.inventories.7|num}}', '{{A.inventories.9|num}}', '{{A.inventories.10|num}}', '{{A.inventories.11|num}}'],
      ['Trade receivables', '{{A.receivables.7|num}}', '{{A.receivables.9|num}}', '{{A.receivables.10|num}}', '{{A.receivables.11|num}}'],
      ['Trade payables', '{{A.payables.7|num}}', '{{A.payables.9|num}}', '{{A.payables.10|num}}', '{{A.payables.11|num}}'],
    ], source: SRC.co + '. Bank deposits (₹5,921 cr at Mar-26) sit in other assets and are not in the cash and investments line.' } },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: the Lal family at 49%, foreign funds 25.5%, Indian institutions 16%',
  blocks: [
    { pair: [
      { type: 'line', title: 'Foreign funds sold, Indian institutions bought in 2026', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoters steady at ~49%', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 40, max: 60, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY15–FY29E', rows: [
      { key: 'sales', name: 'Revenue (Royal Enfield)', flag: { type: 'pct', th: 15 }, hl: true },
      { key: 'ebitda', name: 'EBITDA', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 200 } },
      { key: 'dep', name: 'Depreciation' },
      { key: 'otherIncome', name: 'Other income (treasury + VECV share, after exceptional items)' },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit', hl: true, flag: { type: 'pct', th: 20 } },
      { key: 'eps', name: 'EPS (₹)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' },
      { key: 'capex', name: 'Capex' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 15 }, hl: true },
      { key: 'ebitda', name: 'EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' },
      { key: 'otherIncome', name: 'Other income (incl. VECV share)' },
      { key: 'dep', name: 'Depreciation' },
      { key: 'pat', name: 'Net profit', hl: true },
    ] } },
  ],
};

const statementNotes = {};

module.exports = { financials, capital, balance, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  require('./EICHERMOT.sotp').syncSotp();
  const B = fs.existsSync(path.join(__dirname, 'EICHERMOT.research.js')) ? require('./EICHERMOT.research') : null;
  const report = {
    symbol: 'EICHERMOT', listing: 'NSE: EICHERMOT · BSE: 505200', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Automobiles',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
