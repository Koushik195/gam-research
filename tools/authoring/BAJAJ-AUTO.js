// Authoring source for the Bajaj Auto initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener consolidated after BAJAJ-AUTO.patch.js:
// profit attributable to owners, BACL's funding cost inside EBITDA, the KTM associate share in other income).
// Part B (BAJAJ-AUTO.research.js + part2-4, shared BAJAJ-AUTO.ctx.js) adds the research chapters.
// Usage: node tools/authoring/BAJAJ-AUTO.js   (runs BAJAJ-AUTO.sotp.js first)
const fs = require('fs');
const path = require('path');
const { syncSotp } = require('./BAJAJ-AUTO.sotp');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'BAJAJ-AUTO', 'research');
const SCR = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8')).tables.ratios;
const keepR = SCR.periods.map(p => `${p.slice(-4)}-05-30` <= '2026-09-30');
const RL = SCR.periods.filter((_, i) => keepR[i]).map(p => 'FY' + p.slice(-2));
const RR = k => SCR.rows[k].filter((_, i) => keepR[i]);
const SG = JSON.parse(fs.readFileSync(path.join(RD, 'segments.json'), 'utf8')).annual;
const SRC = { co: 'Company filings, Screener.in (consolidated; attributable profit; BACL funding cost in EBITDA), GAM Research', sa: 'Screener.in (standalone), AR FY26' };

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Five years of 17% EPS growth in the core business; the group accounts got messier in FY26',
  blocks: [
    { p: 'Bajaj Auto the company (standalone) grew revenue from ₹27,741 cr in FY21 to ₹58,732 cr in FY26, about 16% a year, and EPS from ₹157 to ₹352, about 17% a year. EBITDA margin rose from 17.8% to 20.5%: exports recovered, three-wheelers and premium bikes grew faster than commuters, and the rupee weakened. The consolidated accounts tell a noisier story because of KTM. In FY25 Bajaj booked a ₹915 cr loss as its share of KTM\'s collapse (EPS fell to ₹262 from ₹276). In FY26 it booked ₹1,599 cr of one-off accounting gains when it took control of KTM, partly offset by KTM\'s losses (EPS ₹384). Strip out KTM and the two lines move together.' },
    { pair: [
      { type: 'column', title: 'Standalone revenue doubled in five years', unit: 'Standalone revenue from operations (₹ crore)', x: SG.map(a => a.fy), series: [{ name: 'Standalone', values: SG.map(a => a.saRev), fmt: 'num' }], labels: 'all', source: SRC.sa },
      { type: 'line', title: 'Standalone EBITDA margin: 15.9% to 20.5%', unit: 'Standalone EBITDA margin (%)', x: SG.map(a => a.fy), series: [{ name: 'Standalone', values: SG.map(a => a.saMarginPct), fmt: 'pct' }], labels: 'all', min: 12, max: 24, source: SRC.sa },
    ] },
    { pair: [
      { type: 'column', title: 'Consolidated EPS: KTM\'s loss in FY25, one-off gains in FY26', unit: 'EPS attributable to owners (₹)', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'EPS', ref: 'fin.eps', fmt: 'n1' }], labels: 'all', source: SRC.co },
      { type: 'line', title: 'Material cost back to 67% of revenue', unit: 'Raw material as % of consolidated revenue (Screener basis)', x: 'A.labels', from: 'FY16', series: [{ name: 'Material cost', ref: 'A.materialPct', fmt: 'pct0' }], labels: 'all', min: 55, max: 80, source: 'Screener.in' },
    ] },
    { callout: '**Our view:** the core business is a high-return, cash-rich exporter whose margin has been helped by three things that can reverse: a weak rupee (realised ₹94.4 per dollar in Q1FY27 vs ₹85.6 a year before), PLI incentives (₹1,040 cr in FY26, double FY25) and a richer mix as commuter bikes lost share. The consolidated accounts now also carry a lender (BACL, ₹19,774 cr of assets) and a loss-making European motorcycle maker (KTM). That is why we value the three pieces separately.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capex & returns', kicker: 'Capital allocation', title: 'Asset-light at home, capital-heavy outside: ROCE fell from the 30s to 28% as cash went to KTM and BACL',
  blocks: [
    { p: 'Bajaj\'s own factories need little capital: standalone capex was ~₹500 cr in FY26, under 1% of revenue, and working capital is negative because suppliers are paid after dealers pay Bajaj. Group ROCE (Screener) was 34% in FY24 and 28% in FY25-26 because money went elsewhere: ₹2,300 cr into BAIH BV (for KTM) and BACL in FY26 alone, and the consolidated balance sheet now includes BACL\'s ₹18,450 cr loan book and KTM\'s plants and brands. Consolidated cash from operations was negative in FY25 (−₹1,406 cr) and only ₹2,597 cr in FY26 because BACL\'s loan growth runs through operating cash flow; standalone free cash flow was more than ₹8,000 cr in FY26 (CFO).' },
    { pair: [
      { type: 'column', title: 'Consolidated operating cash flow fell as BACL\'s loans grew', unit: '₹ crore', x: 'A.labels', from: 'FY19', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }], labels: 'none', source: SRC.co },
      { type: 'line', title: 'ROCE: 45% in FY16, 28% now', unit: 'Return on capital employed (%), consolidated', x: RL, series: [{ name: 'ROCE', values: RR('ROCE %'), fmt: 'pct0' }], labels: 'all', min: 0, max: 50, source: 'Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went, FY24-FY27 (₹ crore)', head: ['Use', 'Amount', 'Note'], wide: [2], rows: [
      ['Buyback FY24 (tender at ₹10,000)', '4,000', 'Plus tax; share count 28.3 cr to 27.9 cr'],
      ['Dividend paid Jul-2025 (₹210 a share)', '~5,900', 'FY25 profit'],
      ['Into BAIH BV (KTM) and BACL, FY26', '>2,300', 'Last BACL infusion ₹300 cr (Oct-2025, Tier 2)'],
      ['Dividend + buyback paid Jul-2026', '9,825', '₹150 dividend (₹4,192 cr) + ₹5,633 cr buyback at ₹12,000: 100% of FY26 profit'],
      { hl: true, cells: ['**Surplus cash after the July-2026 payout**', '**~11,000**', 'Management expects ~₹15,000 cr again by Mar-2027'] },
    ], source: 'Q2FY26-Q1FY27 calls, AR FY26, MOSL (21-Jul-2026)' } },
    { callout: '**The capital question:** Bajaj is generous with cash (100% of FY26 profit paid out) and disciplined in its own plants, but it has now put about €880 m of support and its balance sheet behind KTM, a business that lost €1.08 bn in 2024. Capacity is also going from 7 mn to 9 mn units a year. We model consolidated capex of ₹2,100-2,200 cr a year (incl. ~€100 m at KTM).' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'Net cash of ~₹21,000 cr outside the lender; borrowings are BACL\'s and KTM\'s',
  blocks: [
    { p: 'Screener shows consolidated borrowings of ₹22,713 cr at Mar-2026, up from ₹124 cr in FY23. None of it is Bajaj Auto\'s own debt (standalone borrowings ₹73 cr, a sales-tax deferral). About ₹16,068 cr is BACL\'s funding (bank loans, ECBs, NCDs) against its ₹18,450 cr loan book, and ~₹6,230 cr is KTM\'s (mainly the €473 m drawn under the €550 m refinancing of Feb-2026), plus ₹659 cr of leases. Cash and investments were ₹27,714 cr. Excluding BACL\'s borrowings, which fund its loans, net cash was about ₹21,000 cr. Inventory days jumped to 54 in FY26 because KTM\'s inventory came into the group.' },
    { pair: [
      { type: 'column', title: 'Borrowings arrived with BACL (FY25) and KTM (FY26)', unit: 'Consolidated borrowings incl. leases (₹ crore)', x: 'A.labels', from: 'FY20', series: [{ name: 'Borrowings', ref: 'A.borrowings', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'line', title: 'Working capital still negative in the core; KTM adds stock', unit: 'Days (of revenue), consolidated', x: RL, series: [{ name: 'Inventory days', values: RR('Inventory Days'), fmt: 'num' }, { name: 'Receivable days', values: RR('Debtor Days'), fmt: 'num' }, { name: 'Payable days', values: RR('Days Payable'), fmt: 'num' }], labels: 'last', source: 'Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-23', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth (owners)', '{{A.netWorth.8|num}}', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}'],
      ['Borrowings incl. leases', '{{A.borrowings.8|num}}', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}'],
      ['  of which BACL (operating funding)', '–', 'small', '~8,437', '16,068'],
      ['Cash and investments', '{{A.cashAndInvestments.8|num}}', '{{A.cashAndInvestments.9|num}}', '{{A.cashAndInvestments.10|num}}', '{{A.cashAndInvestments.11|num}}'],
      ['Net fixed assets', '{{A.fixedAssets.8|num}}', '{{A.fixedAssets.9|num}}', '{{A.fixedAssets.10|num}}', '{{A.fixedAssets.11|num}}'],
      ['Inventories', '{{A.inventories.8|num}}', '{{A.inventories.9|num}}', '{{A.inventories.10|num}}', '{{A.inventories.11|num}}'],
    ], source: SRC.co + '; AR FY26 note 16 (BACL borrowings), BACL FY25 balance sheet. Minorities (₹1,388 cr at Mar-26, KTM) are outside owners\' net worth.' } },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: the Bajaj family group holds 55%; domestic funds have replaced foreign ones',
  blocks: [
    { pair: [
      { type: 'line', title: 'Foreign funds down from 12% to 9% in 18 months; Indian funds up', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoters steady at 55%', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 40, max: 60, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY15–FY29E (consolidated, attributable)', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 15 }, hl: true },
      { key: 'ebitda', name: 'EBITDA (after BACL funding cost)', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 150 } },
      { key: 'dep', name: 'Depreciation' },
      { key: 'otherIncome', name: 'Other income (incl. associates, exceptional items)', flag: { type: 'pct', th: 40 } },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit (attributable)', hl: true, flag: { type: 'pct', th: 20 } },
      { key: 'eps', name: 'EPS (₹, FY26 share count)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' },
      { key: 'capex', name: 'Capex' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L (consolidated)', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 15 }, hl: true },
      { key: 'ebitda', name: 'EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' },
      { key: 'otherIncome', name: 'Other income' },
      { key: 'dep', name: 'Depreciation' },
      { key: 'pat', name: 'Net profit (attributable)', hl: true },
    ] } },
  ],
};

module.exports = { financials, capital, balance, ownershipBase, statements, RD };

if (require.main === module) {
  syncSotp(); // keeps the engine's implied SOTP multiple in step with the built model
  const B = fs.existsSync(path.join(__dirname, 'BAJAJ-AUTO.research.js')) ? require('./BAJAJ-AUTO.research') : null;
  const report = {
    symbol: 'BAJAJ-AUTO', listing: 'NSE: BAJAJ-AUTO · BSE: 532977', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Auto & Auto Components',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements],
    statementNotes: B?.statementNotes || {},
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
