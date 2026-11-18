// Authoring source for the Godrej Agrovet initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated; profit attributable to
// owners via GODREJAGRO.patch.js) + the writer. Part B (GODREJAGRO.research.js, merging part2-7 on
// GODREJAGRO.ctx.js) adds the business, history, industry, segments, moat, quality, ownership,
// governance, forecasts, street, valuation and verdict chapters.
// Usage: node tools/authoring/GODREJAGRO.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'GODREJAGRO', 'research');
const SCR = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8')).tables.ratios;
const RL = SCR.periods.map(p => 'FY' + p.slice(-2));
const SRC = { co: 'Company filings, Screener.in (consolidated; profit attributable to owners), GAM Research' };
const M = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'models', 'GODREJAGRO.json'), 'utf8'));
const A = M.annual, ix = l => A.labels.indexOf(l);
const sumY = (k, from, to) => { let s = 0; for (let i = ix(from); i <= ix(to); i++) s += A[k][i] || 0; return s; };
const n0 = v => Math.round(v).toLocaleString('en-IN');
const cf = (a, b) => ({ cfo: sumY('cfo', a, b), capex: sumY('capex', a, b), div: sumY('dividendsPaid', a, b) });
const P1 = cf('FY19', 'FY22'), P2 = cf('FY23', 'FY26'), PT = cf('FY19', 'FY26');
const row = f => [P1, P2, PT].map(p => n0(f(p)));
const cagr5 = (Math.pow(A.sales[ix('FY26')] / A.sales[ix('FY21')], 1 / 5) - 1) * 100;

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Revenue has tripled since FY15; the margin has stayed stuck at 7-9%',
  blocks: [
    { p: `Godrej Agrovet's revenue rose from ₹3,312 cr in FY15 to ₹10,233 cr in FY26, ${Math.round(cagr5)}% a year over the last five years. Profit has grown more slowly and less smoothly. EBITDA margin has never been above 9% in twelve years: it was 9.0% in FY21, fell to 5.6% in FY23 when maize and soymeal spiked and Astec turned down, and recovered to 8.4% in FY26 on oil palm. Profit attributable to shareholders was ₹314 cr in FY21, ₹302 cr in FY23 and ₹473 cr in FY26 (EPS ₹16.3 → ₹15.7 → ₹24.6). Q1FY27 broke the run: revenue +9%, EBITDA ₹240 cr vs ₹270 cr, attributable profit ₹134 cr vs ₹161 cr, as crop care fell after a dry June.` },
    { pair: [
      { type: 'column', title: 'Revenue: ₹3,312 cr (FY15) to ₹10,233 cr (FY26)', unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY17', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num', growth: true }], source: SRC.co },
      { type: 'column', title: 'Profit to shareholders: up 51% since FY21, with a dip in FY23', unit: 'Net profit attributable to owners (₹ crore)', x: 'fin.labels', from: 'FY17', to: 'FY26', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: a 5-9% business for a decade', unit: 'EBITDA margin (%)', x: 'fin.labels', from: 'FY17', to: 'FY26', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 0, max: 12, source: SRC.co },
      { type: 'column', title: 'Quarterly profit: Q1 and Q3 strong, Q4 weak', unit: 'Net profit attributable (₹ crore)', x: 'Q.labels', series: [{ name: 'Net profit', ref: 'Q.pat', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { callout: '**Our view:** this is a collection of low-margin, commodity-linked businesses (feed, dairy, poultry) attached to two high-margin ones (oil palm and crop care) whose profits swing with palm-oil prices and the monsoon. Over FY21-26 the group grew profit ~8.5% a year; the FY26 record owed much to war-inflated palm-oil prices. The new management\'s job is to make the mix better, not just bigger.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capex & returns', kicker: 'Capital allocation', title: 'Cash went into minority buyouts as much as into plants; returns improved mostly through working capital',
  blocks: [
    { p: `In FY19-22 Godrej Agrovet generated ₹${n0(P1.cfo)} cr of operating cash, less than the ₹${n0(P1.capex)} cr it spent on capex plus ₹${n0(P1.div)} cr of dividends: borrowings rose from ₹398 cr to ₹1,599 cr. In FY23-26 operating cash jumped to ₹${n0(P2.cfo)} cr, but about ₹1,030 cr of it (FY25-26) came from a rise in trade payables, much of it supplier financing. Capex was ₹${n0(P2.capex)} cr. The other big use was buying out partners: ₹323 cr for Tyson's 49% of Godrej Foods (Aug-2024) and ₹922 cr for 47.9% of Creamline Dairy (FY25-26), plus ₹199 cr into Astec's rights issue. ROCE (Screener) recovered from 10% (FY23) to 19% (FY26).` },
    { pair: [
      { type: 'column', title: 'Capex vs operating cash flow', unit: '₹ crore', x: 'A.labels', from: 'FY19', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }], labels: 'none', source: SRC.co },
      { type: 'line', title: 'ROCE: 10% in FY23, 19% in FY26', unit: 'Return on capital employed (%)', x: RL, series: [{ name: 'ROCE', values: SCR.rows['ROCE %'], fmt: 'pct0' }], labels: 'all', min: 0, max: 30, source: 'Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went (₹ crore)', head: ['', 'FY19-22', 'FY23-26', 'Eight years'], rows: [
      ['Cash from operations', ...row(p => p.cfo)],
      ['Capex', ...row(p => p.capex)],
      ['Free cash flow', ...row(p => p.cfo - p.capex)],
      ['Dividends paid', ...row(p => p.div)],
      { hl: true, cells: ['**Left after dividends**', ...row(p => p.cfo - p.capex - p.div).map(v => `**${v}**`)] },
      ['Minority buyouts (Godrej Foods 49%, Creamline 47.9%)', '–', '1,245', '1,245'],
      ['Investment in Astec rights issue (inside the group)', '–', '199', '199'],
    ], source: 'Screener.in cash flow (capex = fixed assets purchased); buyouts from AR FY26 (note 55B: ₹323 cr FY25 Godrej Foods, ₹205 cr FY25 + ₹718 cr FY26 Creamline); GAM Research' } },
    { callout: '**The test is FY27-29.** Management now promises discipline: capex of ~₹400 cr in FY27 and ₹300-350 cr a year after, half of it in oil palm, projects only above a 16-18% IRR, and no further big buyouts announced. The buyouts did not add revenue (the businesses were already consolidated); they moved minorities\' share of profit to GAVL\'s shareholders. Creamline earned ₹3 cr of profit in FY26, so ₹718 cr bought very little profit today.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'Moderate debt, and a working-capital gain that suppliers\' banks are funding',
  blocks: [
    { p: 'Net debt was ₹1,157 cr at Mar-2026 (borrowings ₹1,574 cr incl. ₹106 cr of leases, less cash ₹302 cr and investments ₹115 cr, which include the ACI JV at ₹91 cr), about 1.3x EBITDA. CRISIL rates the commercial paper A1+ and puts adjusted gearing at 0.81x (0.57x a year earlier) after the Creamline buyout. The company reports average net working capital down from 45 days (FY24) to 25 days (FY26) and 21 days in Q1FY27. Much of that is trade payables, which rose from ₹628 cr to ₹1,651 cr in two years: Animal Nutrition now uses vendor invoice discounting, i.e. its suppliers are paid early by banks and GAVL pays the banks later. That is cheap funding, but it is debt-like and can be withdrawn.' },
    { pair: [
      { type: 'line', title: 'Payable days up from 32 to 80 in two years', unit: 'Days (of revenue)', x: RL, series: [{ name: 'Inventory days', values: SCR.rows['Inventory Days'], fmt: 'num' }, { name: 'Payable days', values: SCR.rows['Days Payable'], fmt: 'num' }, { name: 'Receivable days', values: SCR.rows['Debtor Days'], fmt: 'num' }], labels: 'last', source: 'Screener.in' },
      { type: 'column', title: 'Net debt: about ₹1,200 cr since FY22', unit: 'Net debt (₹ crore)', x: 'A.labels', from: 'FY17', series: [{ name: 'Net debt', ref: 'A.netDebt', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-22', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth (owners)', '{{A.netWorth.7|num}}', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}'],
      ['Minority interest', '420', '404', '222', '132'],
      ['Borrowings (incl. leases)', '{{A.borrowings.7|num}}', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}'],
      ['Cash and investments', '{{A.cashAndInvestments.7|num}}', '{{A.cashAndInvestments.9|num}}', '{{A.cashAndInvestments.10|num}}', '{{A.cashAndInvestments.11|num}}'],
      ['Inventories', '{{A.inventories.7|num}}', '{{A.inventories.9|num}}', '{{A.inventories.10|num}}', '{{A.inventories.11|num}}'],
      ['Trade payables', '{{A.payables.7|num}}', '{{A.payables.9|num}}', '{{A.payables.10|num}}', '{{A.payables.11|num}}'],
      ['Net fixed assets', '{{A.fixedAssets.7|num}}', '{{A.fixedAssets.9|num}}', '{{A.fixedAssets.10|num}}', '{{A.fixedAssets.11|num}}'],
    ], source: 'Screener.in (minority interest from its balance-sheet schedule)' } },
    { callout: '**Why net worth fell in FY25-26 although profit rose:** the Godrej Foods and Creamline buyouts cost ₹953 cr more than the book value of the stakes acquired, and accounting rules charge that difference to equity. Owners\' net worth went from ₹2,516 cr (Mar-24) to ₹2,032 cr (Mar-26). It flatters ROE (21% in FY26) without any change in the businesses. **In the model**, net debt falls to ~₹{{F.treasury.2|num}} cr (negative = net debt) by Mar-29E as capex stays at ₹350-400 cr and the payout at 45%.' },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: a Godrej Industries subsidiary with a thin institutional following',
  blocks: [
    { pair: [
      { type: 'line', title: 'FIIs ~6.5%, DIIs ~5%: little institutional money', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoters: 74% to 67.6% by reclassification, not selling', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 60, max: 76, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY15–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 15 }, hl: true },
      { key: 'ebitda', name: 'EBITDA', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 150 } },
      { key: 'dep', name: 'Depreciation' },
      { key: 'otherIncome', name: 'Other income' },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit*', hl: true, flag: { type: 'pct', th: 20 } },
      { key: 'eps', name: 'EPS (₹)', fmt: 'n1' },
      { key: 'cfo', name: 'Operating cash' },
      { key: 'capex', name: 'Capex' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 20 }, hl: true },
      { key: 'ebitda', name: 'EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' },
      { key: 'dep', name: 'Depreciation' },
      { key: 'interest', name: 'Interest' },
      { key: 'pat', name: 'Net profit*', hl: true },
    ] } },
    { p: '*Profit attributable to Godrej Agrovet\'s shareholders (after minorities), history and forecasts. Screener\'s "Net Profit" row (before minorities) is replaced by its "Profit for EPS" schedule (tools/authoring/GODREJAGRO.patch.js), so the model\'s share count (19.24 cr) matches the actual 19.23 cr.' },
  ],
};

module.exports = { financials, capital, balance, ownershipBase, statements, RD };

if (require.main === module) {
  const B = fs.existsSync(path.join(__dirname, 'GODREJAGRO.research.js')) ? require('./GODREJAGRO.research') : null;
  const report = {
    symbol: 'GODREJAGRO', listing: 'NSE: GODREJAGRO · BSE: 540743', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Agri & food',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements],
    statementNotes: B?.statementNotes || {},
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
