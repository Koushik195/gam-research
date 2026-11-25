// Authoring source for the IndiaMART InterMESH initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener consolidated; Screener's operating profit deducts the
// share of associates' losses, so model EBITDA is after associates; the company-basis EBITDA is quoted in the text).
// Part B (INDIAMART.research.js + part2-6, shared INDIAMART.ctx.js) adds the research chapters. INDIAMART.val.js first
// syncs the derived multiples into assumptions.json. Usage: node tools/authoring/INDIAMART.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'INDIAMART', 'research');
const SG = JSON.parse(fs.readFileSync(path.join(RD, 'segments.json'), 'utf8'));
const CO = JSON.parse(fs.readFileSync(path.join(RD, 'company.json'), 'utf8'));
const SA = SG.annual, FYS = SA.map(a => a.fy), n0 = v => Math.round(v).toLocaleString('en-IN');
const SRC = { co: 'Company filings, Screener.in (consolidated), GAM Research', deck: 'IndiaMART Q1FY27 investor presentation (21-Jul-2026: five-year tables, legal-entity view)' };
const CU = CO.capitalUse;

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Revenue up 2.3x in five years; the margin fell in FY23-24, recovered in FY25 and has been flat since',
  blocks: [
    { p: `Consolidated revenue grew from ₹670 cr in FY21 to ₹1,569 cr in FY26 (19% a year), almost all of it from the marketplace: IndiaMART standalone ₹665 cr to ₹1,443 cr, Busy (bought in FY23) ₹119 cr in FY26. The margin story has three acts. In FY21 Covid froze hiring and marketing and the EBITDA margin (company basis, before associates) hit 49%. In FY23-24 management spent to grow: headcount and sales teams went up, the paying-supplier base rose from 169K to 214K, and the margin fell to 27-28%. In FY25 it stopped chasing customers who churned, cut acquisition costs and raised prices: margin back to 38%, ~34% in FY26 and 35% in Q1FY27. Revenue growth slowed from 31% (FY23) to 13% (FY26) and 11% (Q1FY27) because the number of paying suppliers stopped growing (217K at Mar-25, 218K at Jun-26). Since FY25 growth has come from price (ARPU ₹61K to ₹69K), not customers.` },
    { pair: [
      { type: 'column', title: 'Revenue: +31% in FY23, +13% in FY26, +11% in Q1FY27', unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY19', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'line', title: 'EBITDA margin (company basis): 49% → 27% → 34%', unit: 'EBITDA before associates, % of revenue', x: FYS, series: [{ name: 'Company EBITDA margin', values: SA.map(a => a.coMargin), fmt: 'pct' }, { name: 'IndiaMART standalone (adjusted)', values: SA.map(a => a.imMargin), fmt: 'pct' }], labels: 'all', min: 0, max: 60, source: SRC.deck },
    ] },
    { pair: [
      { type: 'column', title: 'Net profit: ₹475 cr in FY26, down from ₹551 cr (FY25 had one-off gains and a lower tax rate)', unit: 'Net profit (₹ crore)', x: 'fin.labels', from: 'FY19', to: 'FY26', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'column', title: 'Other income: 31-49% of pre-tax profit since FY22', unit: 'Other income incl. fair-value gains, % of profit before tax', x: 'fin.labels', from: 'FY19', to: 'FY26', series: [{ name: 'Share of PBT', ref: 'fin.otherIncomeShare', fmt: 'pct0' }], labels: 'all', source: SRC.co },
    ] },
    { callout: '**Our view:** this is a high-margin subscription business whose customer count has stalled. Revenue still grows ~10% because IndiaMART keeps raising what its best customers pay, and profit grows a little faster because acquisition spending is low. That combination can last a few years, but not forever: if the base does not grow again, price rises alone will eventually meet resistance (they already did in the Silver tier in FY26).' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capital allocation', kicker: 'Capital allocation', title: '₹3,080 cr of operating cash in six years: ₹1,220 cr into start-ups and Busy, ~₹1,280 cr back to shareholders',
  blocks: [
    { p: `IndiaMART needs almost no capital: customers pay up front (deferred revenue ₹${n0(CO.q1fy27.deferredRevenue)} cr at Jun-26, 1.3x a year's revenue), capex is under ₹20 cr a year and working capital is deeply negative. Operating cash flow was ₹${n0(CU.cfo.slice(0, 6).reduce((s, x) => s + x, 0))} cr over FY21-26. Management used it three ways: (1) **strategic investments** of ₹${n0(-CU.strategic.reduce((s, x) => s + x, 0))} cr, mostly in FY22-23 (Busy ₹509 cr; stakes in 13 start-ups in accounting, logistics and SME software); (2) **capital returns** of ₹${n0(-CU.returned.reduce((s, x) => s + x, 0))} cr in FY21-26 (dividends and an FY24 buyback), plus the ₹60 FY26 dividend paid in Jul-2026 (~₹1,650 cr in all); (3) the rest stayed in treasury, which grew from ₹931 cr before the FY21 QIP to ₹${n0(CO.q1fy27.cashTreasury)} cr.` },
    { exhibit: { type: 'table', title: 'Cash generation and use (₹ crore)', head: ['', ...CU.years], rows: [
      ['Cash from operations', ...CU.cfo.map(n0)],
      ['Strategic investments (incl. Busy)', ...CU.strategic.map(n0)],
      ['Capex', ...CU.capex.map(n0)],
      ['Dividends and buyback', ...CU.returned.map(n0)],
      { hl: true, cells: ['**Closing cash and treasury**', ...CU.closing.map(v => `**${n0(v)}**`)] },
    ], source: 'Q1FY27 investor presentation p38 (cash generation and utilisation; FY21 includes ~₹1,050 cr of QIP proceeds; non-operating income and fair-value changes not shown)' } },
    { pair: [
      { type: 'column', title: 'Deferred revenue keeps growing faster than revenue', unit: 'Consolidated deferred revenue at March (₹ crore)', x: FYS, series: [{ name: 'Deferred revenue', values: SA.map(a => a.defRevCons), fmt: 'num' }], labels: 'all', source: SRC.deck },
      { type: 'line', title: 'ROE: 14-28% since FY22, held down by ~₹3,500 cr of cash', unit: 'Return on equity (%)', x: 'A.labels', from: 'FY21', series: [{ name: 'ROE', ref: 'A.roe', fmt: 'pct0' }], labels: 'all', min: 0, source: SRC.co },
    ] },
    { callout: '**Capital-allocation verdict:** mixed. Returns to shareholders are generous (FY26 payout 76% including a special dividend) and nothing has been wasted on big acquisitions. But the start-up portfolio, bought at ₹750 cr, sits at ₹763 cr of book value after five years, costs ~₹55 cr a year in equity-accounted losses and has so far produced accounting gains, not cash. Busy, the one large purchase (₹509 cr), earned ₹21 cr of EBITDA in FY26. The cash pile earns ~7% before tax; with no debt and negative working capital, shareholders would be better served by a regular buyback than by more minority stakes.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'No debt, ₹3,553 cr of cash and treasury, ₹741 cr of start-up stakes, and customers\' money in advance',
  blocks: [
    { p: `At Mar-2026 IndiaMART held ₹${n0(CO.fy26.cashTreasury)} cr of cash and treasury investments (debt mutual funds, bonds, ETFs, InvITs, deposits) and ₹${n0(CO.fy26.strategic)} cr of strategic investments (associates at equity, other start-ups at fair value), against ₹${CO.fy26.leases} cr of lease liabilities and no borrowings. Goodwill of ₹454 cr (Busy, Livekeeping) is most of the fixed assets. The biggest liability is deferred revenue (₹${n0(CO.fy26.deferredRevenue)} cr): subscriptions paid for but not yet delivered, ~62% due within twelve months. At Jun-2026 treasury was ₹${n0(CO.q1fy27.cashTreasury)} cr (~₹590 a share, 36% of the 30-Sep-2026 share price); the strategic stakes add ~₹125 a share at book.` },
    { exhibit: { type: 'table', title: 'Consolidated balance sheet snapshot (₹ crore)', head: ['', 'Mar-23', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth', '{{A.netWorth.8|num}}', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}'],
      ['Borrowings (leases)', '{{A.borrowings.8|num}}', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}'],
      ['Investments (treasury + strategic)', '{{A.investments.8|num}}', '{{A.investments.9|num}}', '{{A.investments.10|num}}', '{{A.investments.11|num}}'],
      ['Other liabilities (mostly deferred revenue)', '{{A.otherLiab.8|num}}', '{{A.otherLiab.9|num}}', '{{A.otherLiab.10|num}}', '{{A.otherLiab.11|num}}'],
      ['Net fixed assets (incl. ₹454 cr goodwill)', '{{A.fixedAssets.8|num}}', '{{A.fixedAssets.9|num}}', '{{A.fixedAssets.10|num}}', '{{A.fixedAssets.11|num}}'],
      ['Memo: company cash and treasury', n0(SA[2].cashTreasury), n0(SA[3].cashTreasury), n0(SA[4].cashTreasury), n0(SA[5].cashTreasury)],
      ['Memo: strategic investments', n0(SA[2].strategic), n0(SA[3].strategic), n0(SA[4].strategic), n0(SA[5].strategic)],
    ], source: SRC.co + '; memo lines from the Q1FY27 investor presentation (p37).' } },
    { callout: '**So what:** solvency is not a question. Two things matter for valuation: (1) about a third of the market value is cash, which earns a treasury return that we forecast explicitly; (2) reported profit swings with bond-fund marks (−₹34 cr of other income in Q4FY26, +₹107 cr in Q1FY27) and with fair-value gains on the start-ups. We value the business on EPS before the start-up gains and keep the treasury marks in.' },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: the two founders own 47%; foreign funds have cut from 24% to 20%',
  blocks: [
    { pair: [
      { type: 'line', title: 'FIIs down, DIIs up and down, retail up', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }, { name: 'Public', ref: 'SH.rows.Public', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoters steady at ~49%', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 40, max: 55, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { p: '*Consolidated. EBITDA is after the share of associates\' losses (Screener basis; FY26 ₹55 cr). Other income includes treasury mark-to-market and fair-value gains on strategic investments in actual years; forecasts carry no fair-value gains.*' },
    { statement: { title: 'Profit & loss, FY15–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 15 }, hl: true }, { key: 'ebitda', name: 'EBITDA (after associates)', hl: true }, { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 300 } },
      { key: 'dep', name: 'Depreciation' }, { key: 'otherIncome', name: 'Other income (incl. fair-value items)', flag: { type: 'pct', th: 30 } }, { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit', hl: true, flag: { type: 'pct', th: 25 } }, { key: 'eps', name: 'EPS (₹)', fmt: 'n1' }, { key: 'cfo', name: 'Cash from operations' }, { key: 'capex', name: 'Capex' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L (as reported by 30-Sep-2026)', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 15 }, hl: true }, { key: 'ebitda', name: 'EBITDA (after associates)' }, { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' },
      { key: 'otherIncome', name: 'Other income (incl. mark-to-market)' }, { key: 'dep', name: 'Depreciation' }, { key: 'pat', name: 'Net profit', hl: true },
    ] } },
  ],
};

module.exports = { financials, capital, balance, ownershipBase, statements, RD };

if (require.main === module) {
  require('./INDIAMART.val').syncMultiples();
  const B = fs.existsSync(path.join(__dirname, 'INDIAMART.research.js')) ? require('./INDIAMART.research') : null;
  const report = {
    symbol: 'INDIAMART', listing: 'NSE: INDIAMART · BSE: 542726', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Internet & consumer platforms',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements],
    statementNotes: { ...(B?.statementNotes || {}) },
  };
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
