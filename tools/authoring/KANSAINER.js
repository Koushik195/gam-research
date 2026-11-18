// Authoring source for the Kansai Nerolac Paints initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated; Net Profit on the
// attributable basis via KANSAINER.patch.js, applied by src/model.js). Part B (KANSAINER.research.js +
// part2-6, shared KANSAINER.ctx.js) adds the research chapters, cover, rating and statement notes.
// Usage: node tools/authoring/KANSAINER.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'KANSAINER', 'research');
const SJ = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8')), SCR = SJ.tables.ratios, PLT = SJ.tables['profit-loss'];
const UE = JSON.parse(fs.readFileSync(path.join(RD, 'company.json'), 'utf8')).underlyingEps;
const EY = ['FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'], epsRep = EY.map(y => PLT.rows['EPS in Rs'][PLT.periods.indexOf('Mar 20' + y.slice(2))]);
const RL = SCR.periods.map(p => 'FY' + p.slice(-2));
const SRC = { co: 'Company filings, Screener.in (consolidated), GAM Research' };

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'A decade of two halves: 11% growth to FY19, then ~6% a year (mostly price) and flat underlying profit',
  blocks: [
    { p: 'Kansai Nerolac\'s consolidated revenue grew from ₹3,505 cr in FY15 to ₹5,424 cr in FY19, about 11.5% a year, with EBITDA margins of 14-18%. Since then it has grown ~6% a year to ₹8,052 cr in FY26, almost all of it in two years: after two flat Covid years came a 26% and 18% price-led jump in FY22-23 as raw-material costs soared, and then three years of 0-3.4% growth (FY24-26) as decorative demand slowed and new rivals arrived. The margin collapsed to 10% in FY22 and has recovered only to 12-13%. Reported profit is misleading: FY24 (₹1,185 cr) and FY25 (₹1,143 cr) include ₹1,327 cr of pre-tax gains from selling land at Kavesar (Thane) and Lower Parel (Mumbai). Before exceptional items, EPS was ₹8.1, ₹8.0 and ₹7.9 in FY24-26: flat.' },
    { pair: [
      { type: 'column', title: 'Revenue: fast to FY19, slow since', unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY15', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'ends', source: SRC.co },
      { type: 'line', title: 'EBITDA margin: 17-18% in the good years, 12% now', unit: 'EBITDA margin (%)', x: 'fin.labels', from: 'FY15', to: 'FY26', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 0, max: 22, source: SRC.co },
    ] },
    { pair: [
      { type: 'column', title: 'Reported EPS doubled in FY24-25 on land sales; underlying EPS ~₹8', unit: '₹ per share', x: EY, series: [{ name: 'Reported EPS', values: epsRep, fmt: 'n1' }, { name: 'EPS before exceptional items', values: EY.map(y => UE[y]), fmt: 'n1' }], labels: 'all', source: 'Screener.in; GAM adjustment (exceptional items after tax removed)' },
      { type: 'line', title: 'Return on equity ~9-11% before land gains', unit: 'Return on equity (%)', x: 'fin.labels', from: 'FY15', to: 'FY26', series: [{ name: 'ROE', ref: 'fin.roe', fmt: 'pct' }], labels: 'all', min: 0, max: 45, source: SRC.co },
    ] },
    { callout: '**Our view:** Nerolac stopped compounding around FY19. Underlying EPS of ₹7.9 in FY26 is barely above FY21\'s ₹6.4 (about 4% a year), and ROE of ~9-10% is below an ~12% cost of equity. Part of that is a ₹2,600 cr pile of cash and investments earning ~6%; part is a decorative business that has not grown for three years. FY27 should be better (price rises, strong auto), but the history argues for caution about extrapolating it.' },
  ],
};

const seasons = {
  id: 'seasons', nav: 'Seasonality', kicker: 'Seasonality', title: 'The June quarter is the best; the monsoon quarter and the industrial-heavy March quarter are the weakest',
  blocks: [
    { p: 'Decorative paint sells most in April-June (before the monsoon) and October-December (festive repainting); July-September is wet and slow. Industrial demand is steadier, so the mix tilts towards industrial (lower gross margin) in Q2 and Q4. The result is a margin pattern that repeats every year: in FY25-26 about 14-15% in Q1, 11% in Q2, 12% in Q3 and 9-11% in Q4 (consolidated). Q1FY27 was the strongest quarter in two years: revenue +9.8% to ₹2,374 cr, EBITDA margin 13.8% (14.0% a year earlier). Diwali falls in November in 2026, which gives Q3FY27 a full October painting month (it fell in October in 2025).' },
    { pair: [
      { type: 'column', title: 'Quarterly revenue: Q1 is the peak', unit: 'Revenue (₹ crore)', x: 'Q.labels', series: [{ name: 'Revenue', ref: 'Q.sales', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'line', title: 'Quarterly EBITDA margin: the same saw-tooth every year', unit: 'EBITDA margin (%)', x: 'Q.labels', series: [{ name: 'EBITDA margin', ref: 'Q.opm', fmt: 'pct0' }], labels: 'all', min: 0, max: 20, source: SRC.co },
    ] },
    { callout: '**What to watch:** management promised to hold the Q2FY27 margin at last year\'s level (11.0% consolidated) even while consuming high-cost inventory bought during the June raw-material peak, helped by ~3% more decorative price and 3-5% more industrial price. Q2FY27 results are due by mid-November 2026.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'Debt-free, ₹2,600 cr of cash and investments, and working capital coming down',
  blocks: [
    { p: 'Kansai Nerolac has no meaningful debt: ₹303 cr of "borrowings" at Mar-2026 are mostly lease liabilities (₹206 cr) and small subsidiary lines. Cash and investments rose from ₹628 cr (Mar-2023) to ₹2,591 cr (Mar-2026) as the two land sales and ₹2,470 cr of operating cash over FY24-26 came in; CRISIL counts an unencumbered surplus of over ₹2,500 cr and rates the company AAA. Working capital is heavy but improving: inventory fell from ₹1,729 cr (FY23) to ₹1,530 cr (FY26) and the cash conversion cycle from 94 days (Dec-2024) to 82 days (Dec-2025) on the parent\'s measure. Receivables keep rising (₹1,467 cr, 67 days on Screener) because industrial customers, especially auto OEMs, pay slowly.' },
    { pair: [
      { type: 'line', title: 'Inventory days down; receivable days creeping up', unit: 'Days', x: RL, series: [{ name: 'Inventory days', values: SCR.rows['Inventory Days'], fmt: 'num' }, { name: 'Receivable days', values: SCR.rows['Debtor Days'], fmt: 'num' }, { name: 'Payable days', values: SCR.rows['Days Payable'], fmt: 'num' }], labels: 'last', source: 'Screener.in (consolidated)' },
      { type: 'column', title: 'Cash and investments: land sales built the pile', unit: 'Cash and investments (₹ crore)', x: 'A.labels', from: 'FY17', series: [{ name: 'Cash and investments', ref: 'A.cashAndInvestments', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-22', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth', '{{A.netWorth.7|num}}', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}'],
      ['Borrowings (mostly lease liabilities)', '{{A.borrowings.7|num}}', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}'],
      ['Cash and investments', '{{A.cashAndInvestments.7|num}}', '{{A.cashAndInvestments.9|num}}', '{{A.cashAndInvestments.10|num}}', '{{A.cashAndInvestments.11|num}}'],
      ['Inventories', '{{A.inventories.7|num}}', '{{A.inventories.9|num}}', '{{A.inventories.10|num}}', '{{A.inventories.11|num}}'],
      ['Trade receivables', '{{A.receivables.7|num}}', '{{A.receivables.9|num}}', '{{A.receivables.10|num}}', '{{A.receivables.11|num}}'],
      ['Trade payables', '{{A.payables.7|num}}', '{{A.payables.9|num}}', '{{A.payables.10|num}}', '{{A.payables.11|num}}'],
      ['Net fixed assets', '{{A.fixedAssets.7|num}}', '{{A.fixedAssets.9|num}}', '{{A.fixedAssets.10|num}}', '{{A.fixedAssets.11|num}}'],
    ], source: SRC.co } },
    { callout: '**Cash in the model:** the forecast "cash & investments" row is net of borrowings and leases (the engine treats leases as debt), so it starts at ₹2,288 cr, not ₹2,591 cr. Even after ₹1,150 cr of capex over FY27-29E (including the ₹601 cr expansion) and a ~33% payout, we expect it to rise to about {{F.treasury.2|num}} cr by Mar-2029.' },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: Kansai Paint 75%, LIC the largest outside holder, foreign funds below 5%',
  blocks: [
    { pair: [
      { type: 'line', title: 'Domestic institutions ~12%; foreign funds down to ~4%', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Kansai Paint steady at ~75%', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoter', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 60, max: 80, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY15–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 12 }, hl: true },
      { key: 'ebitda', name: 'EBITDA', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 200 } },
      { key: 'dep', name: 'Depreciation' },
      { key: 'otherIncome', name: 'Other income (incl. exceptionals in actuals)' },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit (attributable)', hl: true, flag: { type: 'pct', th: 20 } },
      { key: 'eps', name: 'EPS (₹, bonus-adjusted)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' },
      { key: 'capex', name: 'Capex' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 15 }, hl: true },
      { key: 'ebitda', name: 'EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' },
      { key: 'otherIncome', name: 'Other income (incl. exceptionals)' },
      { key: 'dep', name: 'Depreciation' },
      { key: 'pat', name: 'Net profit (attributable)', hl: true },
    ] } },
  ],
};

const statementNotes = {};

module.exports = { financials, seasons, balance, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  const B = fs.existsSync(path.join(__dirname, 'KANSAINER.research.js')) ? require('./KANSAINER.research') : null;
  const report = {
    symbol: 'KANSAINER', listing: 'NSE: KANSAINER · BSE: 500165', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Consumer & Building Materials',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, seasons, balance, ownershipBase, statements }) : [financials, seasons, balance, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
