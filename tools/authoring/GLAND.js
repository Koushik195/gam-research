// Authoring source for the Gland Pharma initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated; all subsidiaries are 100% owned, so
// Net Profit = attributable profit and no patch is needed: FY26 PAT Rs1,027 cr / EPS Rs62.35 = 16.47 cr shares vs
// 16.48 cr issued). Part B (GLAND.research.js + part2-6, shared GLAND.ctx.js) adds the research chapters, cover, rating
// and statement notes. Usage: node tools/authoring/GLAND.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'GLAND', 'research');
const SJ = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8')), SCR = SJ.tables.ratios, PLT = SJ.tables['profit-loss'];
const EY = ['FY19', 'FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'], epsRep = EY.map(y => PLT.rows['EPS in Rs'][PLT.periods.findIndex(p => p.startsWith('Mar 20' + y.slice(2)))]);
const RL = SCR.periods.map(p => 'FY' + p.slice(6, 8));
const SRC = { co: 'Company filings, Screener.in (consolidated; standalone to FY19), GAM Research' };

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Four acts: a fast-growing standalone to FY22, a collapse in FY23, a costly European acquisition, and a recovery that only in FY27 takes EPS past the FY22 peak',
  blocks: [
    { p: "Gland grew revenue from ₹994 cr in FY15 to ₹4,401 cr in FY22 at 34-42% EBITDA margins, selling injectables through US partners; Covid-era demand lifted FY21-22. FY23 broke the run: a partner (Athenex) went bankrupt, another customer was lost, Chinese rivals undercut enoxaparin and heparin, and revenue fell 18% to ₹3,625 cr. The Cenexi acquisition (April 2023) then added ~₹1,500 cr of revenue at a loss, so FY24 revenue jumped 56% while the margin fell to 24% and EPS stayed at ~₹47. FY25 was the low point (revenue −1%, EPS ₹42.4). FY26 recovered: revenue +14.5% to ₹6,431 cr, margin 25.3%, EPS ₹62.35, and Q1FY27 EPS of ₹19.2 puts the twelve months to June 2026 at ₹68.5. Six years after FY20 (EPS ₹49.9), per-share earnings have grown only ~4% a year." },
    { pair: [
      { type: 'column', title: 'Revenue: a fall in FY23, a jump from Cenexi in FY24, a new high in FY26', unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY17', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'line', title: 'EBITDA margin: 42% in FY17, 23% in FY25, 25% now', unit: 'EBITDA margin (%)', x: 'fin.labels', from: 'FY17', to: 'FY26', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 0, max: 50, source: SRC.co },
    ] },
    { pair: [
      { type: 'column', title: 'EPS: ₹73.75 in FY22, ₹42.4 in FY25, ₹62.35 in FY26', unit: '₹ per share', x: EY, series: [{ name: 'Reported EPS', values: epsRep, fmt: 'n1' }], labels: 'all', source: 'Screener.in; exceptional items: FY23 −₹2.4 a share (Athenex provision), FY26 −₹0.9 (Labour Codes)' },
      { type: 'line', title: 'Return on equity: 24% in FY20, 8% in FY25, 10.5% now', unit: 'Return on equity (%)', x: 'fin.labels', from: 'FY17', to: 'FY26', series: [{ name: 'ROE', ref: 'fin.roe', fmt: 'pct' }], labels: 'all', min: 0, max: 30, source: SRC.co },
    ] },
    { callout: "**Our view:** Gland's history is one of a very profitable core (the base business still earns 35-40% EBITDA margins) whose reported numbers were dragged down twice: by a customer shock in FY23 and by Cenexi's losses in FY24-26. The recovery since Q3FY26 is real and broad (US launches, CDMO wins, Cenexi breakeven), but it is also young, and the stock's 2021 valuation was built on a growth rate that the next four years did not deliver." },
  ],
};

const seasons = {
  id: 'seasons', nav: 'Quarterly pattern', kicker: 'Quarters', title: 'Quarters: Cenexi makes Q2 the weak quarter (European summer shutdown); launches and GPO wins lifted the last three',
  blocks: [
    { p: "Gland's quarters move with partner orders, launches and tender timing rather than a season, with one exception: Cenexi shuts its French and Belgian plants for maintenance every summer, so the September quarter is weak (Cenexi lost €6 mn of EBITDA in Q2FY26 and €8 mn in Q2FY25). The base business lifted revenue from ₹1,041 cr in Q1FY26 to ₹1,265 cr in Q4FY26 as Dalbavancin, the multivitamin infusion and new GPO contracts arrived; Q4FY26's 29% consolidated margin included a 40% base-business margin with milestone income of ~6% of revenue. Q1FY27: revenue ₹1,800 cr (+20%; ~15% in constant currency), EBITDA margin 27.2%, PAT ₹317 cr." },
    { pair: [
      { type: 'column', title: 'Quarterly revenue: a step up from Q3FY26', unit: 'Revenue (₹ crore)', x: 'Q.labels', series: [{ name: 'Revenue', ref: 'Q.sales', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'line', title: 'Quarterly EBITDA margin: 19-26% before Q4FY26, 27-29% since', unit: 'EBITDA margin (%)', x: 'Q.labels', series: [{ name: 'EBITDA margin', ref: 'Q.opm', fmt: 'pct0' }], labels: 'all', min: 0, max: 40, source: SRC.co },
    ] },
    { callout: '**What to watch:** Q2FY27 (results due by mid-November 2026) carries the Cenexi shutdown, though management expects it to be better than last year because heat-wave-delayed releases slipped from Q1. The other swing items are the USFDA approval of the new bag line and the Saudi NUPCO tender awards.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'Net cash of ₹3,100-3,300 cr (a third of equity), but working capital ties up ~38% of sales and depresses returns',
  blocks: [
    { p: "Gland holds ₹3,359 cr of cash and deposits (Mar-2026; ₹3,547 cr at Jun-2026) against ₹243 cr of debt at Cenexi and ₹40 cr of leases: net cash ₹3,116 cr on the company's basis, ₹3,294 cr at June. About a third of shareholders' equity sits in cash earning ~6.5%, which is one reason ROE is only ~10%. The business is working-capital heavy for a B2B manufacturer: inventory is ~284 days of material cost and receivables ~107 days (Screener, FY26); the company's own cash-conversion cycle improved from 172 days (FY25) to 164 (FY26) and 155 (Jun-2026). Inventory write-downs were ₹156 cr in FY26 (₹121 cr in FY25). Cash generation is steady: operating cash flow of ₹915-1,031 cr a year in FY25-26, capex of ~₹400-500 cr, the first dividends (₹329 cr paid in FY25, ₹297 cr in FY26) and the ₹1,022 cr Cenexi purchase in FY24." },
    { pair: [
      { type: 'line', title: 'Inventory and receivable days: high, and not falling much', unit: 'Days', x: RL, series: [{ name: 'Inventory days', values: SCR.rows['Inventory Days'], fmt: 'num' }, { name: 'Receivable days', values: SCR.rows['Debtor Days'], fmt: 'num' }, { name: 'Payable days', values: SCR.rows['Days Payable'], fmt: 'num' }], labels: 'last', source: 'Screener.in (consolidated; inventory and payables on material cost; standalone to FY19)' },
      { type: 'column', title: 'Cash: rebuilt after the Cenexi purchase', unit: 'Cash and deposits (₹ crore)', x: 'A.labels', from: 'FY19', series: [{ name: 'Cash and investments', ref: 'A.cashAndInvestments', fmt: 'num' }], labels: 'all', source: `${SRC.co}; Mar-25 excludes ₹396 cr of non-callable deposits held in other assets` },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-22', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth', '{{A.netWorth.7|num}}', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}'],
      ['Borrowings (Cenexi debt and leases)', '{{A.borrowings.7|num}}', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}'],
      ['Cash and investments', '{{A.cashAndInvestments.7|num}}', '{{A.cashAndInvestments.9|num}}', '{{A.cashAndInvestments.10|num}}', '{{A.cashAndInvestments.11|num}}'],
      ['Inventories', '{{A.inventories.7|num}}', '{{A.inventories.9|num}}', '{{A.inventories.10|num}}', '{{A.inventories.11|num}}'],
      ['Trade receivables', '{{A.receivables.7|num}}', '{{A.receivables.9|num}}', '{{A.receivables.10|num}}', '{{A.receivables.11|num}}'],
      ['Trade payables', '{{A.payables.7|num}}', '{{A.payables.9|num}}', '{{A.payables.10|num}}', '{{A.payables.11|num}}'],
      ['Net fixed assets (incl. Cenexi goodwill and intangibles)', '{{A.fixedAssets.7|num}}', '{{A.fixedAssets.9|num}}', '{{A.fixedAssets.10|num}}', '{{A.fixedAssets.11|num}}'],
      ['Capital work in progress', '{{A.cwip.7|num}}', '{{A.cwip.9|num}}', '{{A.cwip.10|num}}', '{{A.cwip.11|num}}'],
    ], source: SRC.co } },
    { callout: '**Cash in the model:** the forecast "cash & investments" row is net of borrowings (₹3,075 cr at Mar-2026 on Screener\'s figures). With capex of ₹550-750 cr a year and working capital growing with sales, we expect it to reach about {{F.treasury.2|num}} cr by Mar-2029. We assume no acquisition; management talks of in-licensing and biologics, and a large deal would change both the cash and the earnings mix.' },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: Fosun 51.8% at June 2026 (about 45.8% after its September sale), domestic funds 30%, foreign funds 9%',
  blocks: [
    { pair: [
      { type: 'line', title: 'Domestic institutions 30-35%; foreign funds up to ~9%', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in (to Jun-2026)' },
      { type: 'column', title: 'Promoter (Fosun): 57.9% → 51.8% after the June-2024 sale', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoter', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 40, max: 60, source: 'BSE shareholding pattern, Screener.in (to Jun-2026)' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY15–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 15 }, hl: true },
      { key: 'ebitda', name: 'EBITDA', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 300 } },
      { key: 'dep', name: 'Depreciation' },
      { key: 'otherIncome', name: 'Other income (incl. forex and exceptionals in actuals)' },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit', hl: true, flag: { type: 'pct', th: 20 } },
      { key: 'eps', name: 'EPS (₹)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' },
      { key: 'capex', name: 'Capex' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 20 }, hl: true },
      { key: 'ebitda', name: 'EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' },
      { key: 'otherIncome', name: 'Other income (incl. forex and exceptionals)' },
      { key: 'dep', name: 'Depreciation' },
      { key: 'pat', name: 'Net profit', hl: true },
    ] } },
  ],
};

const statementNotes = {};

module.exports = { financials, seasons, balance, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  const B = fs.existsSync(path.join(__dirname, 'GLAND.research.js')) ? require('./GLAND.research') : null;
  const report = {
    symbol: 'GLAND', listing: 'NSE: GLAND · BSE: 543245', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Pharmaceuticals & CDMO',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, seasons, balance, ownershipBase, statements }) : [financials, seasons, balance, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
