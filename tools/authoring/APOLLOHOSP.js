// Authoring source for the Apollo Hospitals Enterprise initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated; profit attributable to owners and
// Q2FY26/Q1FY27 as first published, see APOLLOHOSP.patch.js). Part B (APOLLOHOSP.research.js + part2-6, shared
// APOLLOHOSP.ctx.js) adds the research chapters.
// Usage: node tools/authoring/APOLLOHOSP.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'APOLLOHOSP', 'research');
const SCR = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8')).tables.ratios;
const RL = SCR.periods.map(p => 'FY' + p.slice(-2));
const SRC = { co: 'Company filings, Screener.in (consolidated, post-Ind AS 116; profit attributable to owners), GAM Research' };

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Revenue up 2.2x since FY20 and margins at a decade high, because the digital losses finally shrank',
  blocks: [
    { p: 'Apollo\'s revenue grew from ₹11,247 cr in FY20 to ₹25,228 cr in FY26 (14% a year). Covid cut FY21 by 6%; FY22 jumped 39% on the recovery, Covid testing and vaccination, and the new pharmacy-distribution structure. Since then growth has been a steady 13-16% a year. The margin story is the digital platform: Apollo 24/7 cost ₹619-657 cr a year in FY23-24 and pushed the group EBITDA margin down to ~12.5%; as those costs fell (₹349 cr in FY26) and hospital margins held at ~24%, the group margin rose to 15.0% in FY26 and 15.5% in Q1FY27. Profit attributable to shareholders went from ₹819 cr (FY23) to ₹1,942 cr (FY26), 33% a year.' },
    { pair: [
      { type: 'column', title: 'Revenue: 14% a year since FY20', unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY17', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num', growth: true }], source: SRC.co },
      { type: 'column', title: 'Net profit: up 2.4x in three years', unit: 'Net profit attributable to shareholders (₹ crore)', x: 'fin.labels', from: 'FY17', to: 'FY26', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: 12.4% in FY23, 15.0% in FY26', unit: 'EBITDA margin, post-Ind AS (%)', x: 'fin.labels', from: 'FY19', to: 'FY26', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 8, max: 18, source: SRC.co },
      { type: 'hbar', title: 'Medicines are half the cost: pharmacy distribution is a low-margin trade', unit: 'FY26 costs and EBITDA, % of revenue', x: ['Medicines and consumables (incl. goods for resale)', 'Other expenses (incl. doctors\' fees, utilities)', 'Employees', 'EBITDA (post-Ind AS)'], series: [{ name: 'Share', values: [51.8, 21.3, 11.9, 14.9], fmt: 'pct' }], labels: 'all', highlight: 'EBITDA (post-Ind AS)', source: 'AR FY26 consolidated P&L (materials ₹3,041 cr + purchases ₹10,056 cr; employees ₹3,000 cr; other expenses ₹5,383 cr)' },
    ] },
    { callout: '**Our view:** two businesses with very different economics share one P&L. Hospitals earn ~24% EBITDA margins and ~25% ROCE; HealthCo turns over ₹10,800 cr at a 4.5% margin after digital costs. Group margins will keep rising only if both mix (more hospitals) and digital (breakeven) keep helping; after FY27 most of the easy digital gain is behind us.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capex & returns', kicker: 'Capital allocation', title: 'Self-funded so far; ₹7,500 cr of bed capex still to come',
  blocks: [
    { p: 'Over FY25-26 Apollo generated ₹4,992 cr of operating cash, spent ₹3,675 cr on capex, ₹1,342 cr buying out minorities (IFC and others in AHLL; more of Assam) and ~₹570 cr on dividends; lease payments took another ~₹548 cr. Advent\'s ₹2,475 cr in Apollo HealthCo (FY25) funded HealthCo\'s purchase of Keimed shares rather than hospitals. Returns are good and rising: Screener ROCE (all capital, incl. leases and the CCPS) was 14-15% in FY23-24 and 17% in FY26; the company\'s hospital ROCE, which leaves out work in progress, was 25.4% in FY26 and 28.5% in Q1FY27. The bed plan to FY31 costs ~₹11,150 cr, of which ~₹7,500 cr is still to be spent: ~₹1,500 cr a year on top of ~₹550 cr of recurring capex.' },
    { pair: [
      { type: 'column', title: 'Operating cash flow vs capex', unit: '₹ crore', x: 'A.labels', from: 'FY19', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }], labels: 'none', source: SRC.co },
      { type: 'line', title: 'ROCE: 8% in FY21, 17% in FY25-26', unit: 'Return on capital employed (%)', x: RL, series: [{ name: 'ROCE', values: SCR.rows['ROCE %'], fmt: 'pct0' }], labels: 'all', min: 0, max: 25, source: 'Screener.in (capital includes lease liabilities and the CCPS)' },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went (₹ crore)', head: ['', 'FY25', 'FY26', 'Two years'], rows: [
      ['Cash from operations (Screener)', '{{A.cfo.10|num}}', '{{A.cfo.11|num}}', '4,992'],
      ['Capex (property, plant and equipment)', '{{A.capex.10|num}}', '{{A.capex.11|num}}', '3,675'],
      ['Lease payments: principal + interest (AR note 23)', '256', '291', '548'],
      ['Minority buy-outs (AHLL ₹1,273 cr in Mar-26; Assam ₹69 cr)', '–', '1,342', '1,342'],
      ['Dividends', '{{A.dividendsPaid.10|num}}', '{{A.dividendsPaid.11|num}}', '571'],
      ['Memo: Advent CCPS raised in HealthCo / Keimed shares bought with it', '2,475 / 625', '–', ''],
    ], source: 'Screener.in cash flow; AR FY26 notes 21, 23, 56. Treasury income and acquisitions of investments sit in investing cash flow.' } },
    { callout: '**The capital question:** management says the bed plan is funded "largely from internal accruals"; the hospital business generated ~₹1,550 cr a year after recurring capex and dividends in FY26 (CFO). On our numbers group capex of ~₹2,450-2,550 cr a year (incl. new leases) is covered by operating cash, so net debt excluding leases stays low. The test is returns: new beds cost ~₹2.4 cr per census bed in the FY30-31 plan (Worli ₹2.6 cr, Dwarka ₹2.7 cr), against ~₹1 cr of revenue per bed today.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & leases', kicker: 'Balance sheet', title: 'Three kinds of "debt": ₹3,202 cr of bank debt, ₹2,834 cr of leases and ₹2,457 cr of Advent preference shares',
  blocks: [
    { p: 'Read Apollo\'s balance sheet carefully. Screener\'s "borrowings" of ₹8,493 cr (Mar-26) are three different things: ₹3,202 cr of bank and other debt, ₹2,834 cr of lease liabilities (the present value of hospital rents under Ind AS 116) and ₹2,457 cr of compulsorily convertible preference shares (CCPS) that Advent bought in Apollo HealthCo, which accounting rules treat as a liability but which will turn into Advent\'s 12.1% of the new pharmacy company. Against this the group holds ₹2,336 cr of cash, deposits and liquid funds, plus strategic stakes that Screener counts as investments (Keimed ₹800 cr, the Delhi hospital ₹179 cr at book). So the company reports **net debt of ₹866 cr** (Mar-26; ₹748 cr in Jun-26) excluding leases and CCPS, which is ~0.2x EBITDA.' },
    { pair: [
      { type: 'column', title: 'Borrowings on Screener tripled in five years, mostly leases and CCPS', unit: 'Borrowings incl. lease liabilities and CCPS (₹ crore)', x: 'A.labels', from: 'FY19', series: [{ name: 'Borrowings', ref: 'A.borrowings', fmt: 'num' }], labels: 'all', source: 'Screener.in; AR FY26 notes 22-23' },
      { type: 'line', title: 'Receivable days ~50; supplier credit shrinking', unit: 'Days', x: RL, series: [{ name: 'Receivable days', values: SCR.rows['Debtor Days'], fmt: 'num' }, { name: 'Payable days', values: SCR.rows['Days Payable'], fmt: 'num' }], labels: 'last', source: 'Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth (owners)', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}'],
      ['Borrowings on Screener (all three kinds)', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}'],
      ['  of which bank and other debt (company "gross debt")', '3,162', '2,830', '3,202'],
      ['  of which CCPS (Advent, in HealthCo)', '–', '2,445', '2,457'],
      ['  of which lease liabilities', '2,171', '2,589', '2,834'],
      ['Cash, deposits and liquid funds (company)', '1,658', '2,841', '2,336'],
      { hl: true, cells: ['**Net debt excl. leases and CCPS (company)**', '**1,504**', '**−11 (net cash)**', '**866**'] },
      { hl: true, cells: ['**Net debt incl. leases, excl. CCPS**', '**3,675**', '**2,578**', '**3,700**'] },
      ['Net fixed assets (incl. right-of-use)', '{{A.fixedAssets.9|num}}', '{{A.fixedAssets.10|num}}', '{{A.fixedAssets.11|num}}'],
    ], source: 'Screener.in; AR FY26 notes 22-23 (CCPS, leases); Q4FY24, Q4FY25 and Q4FY26 presentations (gross debt, cash).' } },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: the Reddy family at 28%, Indian funds buying as foreign funds trim',
  blocks: [
    { pair: [
      { type: 'line', title: 'DIIs up from 19% to 24%; FIIs down from 46% to 41%', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoters: 29.3% to 28.0% after a sale in Q2FY26', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 20, max: 35, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY15–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 15 }, hl: true }, { key: 'ebitda', name: 'EBITDA (post-Ind AS)', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 150 } }, { key: 'dep', name: 'Depreciation (incl. right-of-use)' },
      { key: 'otherIncome', name: 'Other income (incl. associates)' }, { key: 'pbt', name: 'Profit before tax' },
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
module.exports = { financials, capital, balance, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  const B = fs.existsSync(path.join(__dirname, 'APOLLOHOSP.research.js')) ? require('./APOLLOHOSP.research') : null;
  const report = {
    symbol: 'APOLLOHOSP', listing: 'NSE: APOLLOHOSP · BSE: 508869', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Healthcare',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
