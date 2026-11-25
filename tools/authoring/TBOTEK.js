// Authoring source for the TBO Tek initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated from FY18; FY17 standalone).
// Part B (TBOTEK.research.js + part2-6, shared TBOTEK.ctx.js) adds the research chapters.
// TBOTEK.val.js first syncs the derived multiples into assumptions.json. Usage: node tools/authoring/TBOTEK.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'TBOTEK', 'research');
const SCRJ = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8'));
const SCR = SCRJ.tables.ratios;
const keepR = SCR.periods.map(p => /^Mar 20(1[8-9]|2\d)/.test(p) && `${p.slice(4, 8)}-05-30` <= '2026-09-30');
const RL = SCR.periods.filter((_, i) => keepR[i]).map(p => 'FY' + p.slice(6, 8));
const RR = k => SCR.rows[k].filter((_, i) => keepR[i]);
const SRC = { co: 'Company filings, Screener.in (consolidated; FY17 standalone), GAM Research' };

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Revenue up ~8x since FY18 and profit up ~7x; the margin has fallen for three years as TBO invested and bought a lower-margin business',
  blocks: [
    { p: 'TBO\'s revenue was ₹343 cr in FY18 and ₹2,677 cr in FY26. Covid cut FY21 revenue by 75% (₹142 cr, a loss of ₹34 cr) because travel stopped. Since FY23, the first normal year, revenue has grown ~36% a year, but that number mixes three things: organic growth (FY26 organic revenue +23%, GTV +13%), the shift to hotels (which earn a higher take rate than air tickets) and, from Oct-2025, Classic Vacations, which books ~25% of its GTV as revenue. Net profit rose from ₹148 cr (FY23) to ₹244 cr (FY26), only 18% a year, because the EBITDA margin fell from 18.7% (FY24) to 14.1% (FY26): TBO hired sales staff in Europe, APAC and LATAM ahead of revenue, and Classic Vacations runs at a lower margin on its gross revenue. Depreciation and interest also rose with the acquisition.' },
    { pair: [
      { type: 'column', title: 'Revenue: Covid hole in FY21, ~36% a year since FY23 (part acquired)', unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY18', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'column', title: 'Net profit: ₹244 cr in FY26, +6% on FY25', unit: 'Net profit (₹ crore)', x: 'fin.labels', from: 'FY18', to: 'FY26', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: 18.7% (FY24) to 14.1% (FY26) on investment and the CV mix', unit: 'EBITDA margin (% of revenue)', x: 'fin.labels', from: 'FY18', to: 'FY26', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: -20, max: 25, source: SRC.co },
      { type: 'column', title: 'Other income: 18-27% of pre-tax profit in FY25-26', unit: 'Other income incl. exceptional items, % of profit before tax', x: 'fin.labels', from: 'FY22', to: 'FY26', series: [{ name: 'Share of PBT', ref: 'fin.otherIncomeShare', fmt: 'pct0' }], labels: 'all', source: SRC.co },
    ] },
    { callout: '**Our view:** revenue is the wrong yardstick for TBO because its accounting mix changes (net commissions on most bookings, gross revenue at Classic Vacations). Gross profit is the cleaner measure: ₹1,194 cr in FY25, ₹1,674 cr in FY26 (+40%, +18% organic) and ₹552 cr in Q1FY27 (+66%, +16% organic). The investment story is that SG&A has stopped growing faster than gross profit: organic EBITDA was 27.5% of gross profit in Q1FY27, up from 23.5% in Q4FY26.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capex & returns', kicker: 'Capital allocation', title: 'Almost no capex; the capital went into an IPO-funded sales build-out and a USD 125 mn acquisition',
  blocks: [
    { p: 'TBO is asset-light: cash capex was ₹38-67 cr a year in FY24-26, mostly capitalised technology. Its big capital decisions are elsewhere. The IPO raised ₹400 cr of new money in May-2024 (₹382 cr net), spent by Mar-2026 on technology, overseas sales and marketing (via Tek Travels DMCC) and general purposes. In Oct-2025 it bought Classic Vacations for USD 125 mn (~₹1,100 cr), with USD 70 mn of new debt, an inter-company loan and cash, adding ₹449 cr of goodwill. Returns have fallen as equity grew: ROE was 52% in FY23 and 18% in FY26 (IPO cash and goodwill in the base).' },
    { pair: [
      { type: 'column', title: 'Operating cash flow: strong until FY26, then working capital absorbed it', unit: '₹ crore', x: 'A.labels', from: 'FY20', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Free cash flow', ref: 'A.fcf', fmt: 'num' }], labels: 'none', source: SRC.co },
      { type: 'line', title: 'ROE: 52% in FY23, 18% in FY26 after the IPO and the acquisition', unit: 'Return on equity (%)', x: 'A.labels', from: 'FY20', series: [{ name: 'ROE', ref: 'A.roe', fmt: 'pct0' }], labels: 'all', min: -20, max: 60, source: SRC.co },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went, FY23-26 (₹ crore)', head: ['', 'FY23', 'FY24', 'FY25', 'FY26'], rows: [
      ['Cash from operations', '{{A.cfo.6|num}}', '{{A.cfo.7|num}}', '{{A.cfo.8|num}}', '{{A.cfo.9|num}}'],
      ['Capex (cash)', '{{A.capex.6|num}}', '{{A.capex.7|num}}', '{{A.capex.8|num}}', '{{A.capex.9|num}}'],
      ['Share issue proceeds (IPO)', '0', '2', '390', '3'],
      ['Borrowings raised (gross)', '0', '134', '0', '645 (acquisition loan)'],
      ['Other investing flows (deposits, liquid funds, acquisitions)', '−78', '−116', '−390', '−294 (incl. Classic Vacations)'],
      { hl: true, cells: ['**Cash and equivalents at year-end (Screener)**', '{{A.cash.6|num}}', '{{A.cash.7|num}}', '{{A.cash.8|num}}', '{{A.cash.9|num}}'] },
    ], source: 'Screener.in cash flow and balance sheet; other investing flows = investing cash flow less capex. AR FY26 note 49 for the deal terms.' } },
    { callout: '**The capital question:** cash generation is real (₹1,984 cr of cash and liquid investments at Jun-2026, ₹392 cr more than in March) but most of it is float: TBO collects from agents and pays suppliers, so receivables (₹5,314 cr) and payables (₹5,422 cr) roughly offset. The free cash that matters is ~EBITDA less tax and capex, i.e. ~₹300-400 cr a year at FY27E levels. No dividend has been paid; we expect cash to go to debt repayment (from Q3FY27) and further acquisitions.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'A float business: ₹5.3k cr owed by agents, ₹5.4k cr owed to suppliers, ₹1.6k cr of cash, ₹756 cr of debt',
  blocks: [
    { p: 'At Mar-2026 TBO held ₹1,592 cr of cash, bank deposits and liquid investments (₹1,984 cr at Jun-2026) against ₹756 cr of borrowings (the USD 70 mn acquisition loan, a EUR 6 mn working-capital line at Jumbonline and lease liabilities). Net cash was ~₹836 cr, ~₹77 a share, ~5% of the market value. The balance sheet is dominated by working capital on GTV: trade receivables from agents ₹5,314 cr (~53 days of FY26 GTV; Screener shows 724 "debtor days" because it divides by net revenue) and trade payables to hotels and airlines ₹5,422 cr. Working capital swings with the season and supplier terms: it absorbed ~₹420 cr in FY26 (cash from operations −₹21 cr) and released cash in Q1FY27. Goodwill was ₹555 cr (Classic Vacations ₹449 cr), so book value is ~35% intangible.' },
    { pair: [
      { type: 'line', title: 'Working capital days: negative throughout (suppliers fund the agents)', unit: 'Working capital days (on revenue)', x: RL, series: [{ name: 'Working capital days', values: RR('Working Capital Days'), fmt: 'num' }], labels: 'last', source: 'Screener.in' },
      { type: 'column', title: 'Receivables and payables grew with GTV and roughly offset', unit: '₹ crore', x: 'A.labels', from: 'FY21', series: [{ name: 'Trade receivables', ref: 'A.receivables', fmt: 'num' }, { name: 'Trade payables', ref: 'A.payables', fmt: 'num' }], labels: 'none', source: 'Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-23', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth', '{{A.netWorth.6|num}}', '{{A.netWorth.7|num}}', '{{A.netWorth.8|num}}', '{{A.netWorth.9|num}}'],
      ['Borrowings (incl. leases)', '{{A.borrowings.6|num}}', '{{A.borrowings.7|num}}', '{{A.borrowings.8|num}}', '{{A.borrowings.9|num}}'],
      ['Cash and equivalents', '{{A.cash.6|num}}', '{{A.cash.7|num}}', '{{A.cash.8|num}}', '{{A.cash.9|num}}'],
      ['Investments (liquid funds)', '{{A.investments.6|num}}', '{{A.investments.7|num}}', '{{A.investments.8|num}}', '{{A.investments.9|num}}'],
      ['Trade receivables', '{{A.receivables.6|num}}', '{{A.receivables.7|num}}', '{{A.receivables.8|num}}', '{{A.receivables.9|num}}'],
      ['Trade payables', '{{A.payables.6|num}}', '{{A.payables.7|num}}', '{{A.payables.8|num}}', '{{A.payables.9|num}}'],
      ['Net fixed assets incl. goodwill and intangibles', '{{A.fixedAssets.6|num}}', '{{A.fixedAssets.7|num}}', '{{A.fixedAssets.8|num}}', '{{A.fixedAssets.9|num}}'],
    ], source: SRC.co + '. Goodwill: AR FY26 consolidated note 4.' } },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: founders 44.4%, pre-IPO funds still 22%, domestic funds up from 7% to 21% since listing',
  blocks: [
    { pair: [
      { type: 'line', title: 'Foreign holders (incl. pre-IPO funds) selling, domestic funds buying', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoter group steady at 44.4% since listing', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 30, max: 50, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY18–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 30 }, hl: true },
      { key: 'ebitda', name: 'EBITDA', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 200 } },
      { key: 'dep', name: 'Depreciation and amortisation' },
      { key: 'otherIncome', name: 'Other income (incl. exceptional items in actual years)', flag: { type: 'pct', th: 40 } },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit', hl: true, flag: { type: 'pct', th: 25 } },
      { key: 'eps', name: 'EPS (₹)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' },
      { key: 'capex', name: 'Capex' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L (as reported by 30-Sep-2026)', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 20 }, hl: true },
      { key: 'ebitda', name: 'EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' },
      { key: 'otherIncome', name: 'Other income (incl. exceptional items)' },
      { key: 'dep', name: 'Depreciation and amortisation' },
      { key: 'pat', name: 'Net profit', hl: true },
    ] } },
  ],
};

const statementNotes = {};

module.exports = { financials, capital, balance, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  require('./TBOTEK.val').syncMultiples();
  const B = fs.existsSync(path.join(__dirname, 'TBOTEK.research.js')) ? require('./TBOTEK.research') : null;
  const report = {
    symbol: 'TBOTEK', listing: 'NSE: TBOTEK · BSE: 544174', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Consumer services & internet',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
