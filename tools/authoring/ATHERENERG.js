// Authoring source for the Ather Energy initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener: FY26 consolidated, FY20-FY25 standalone;
// in-memory fixes in ATHERENERG.patch.js). Part B (ATHERENERG.research.js + part2-6, shared ATHERENERG.ctx.js)
// adds the research chapters. ATHERENERG.mult.js first writes the derived multiples into assumptions.json.
// Usage: node tools/authoring/ATHERENERG.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'ATHERENERG', 'research');
const SRC = { co: 'Company filings, Screener.in (FY26 consolidated; FY20-FY25 standalone), GAM Research. Mar-2026 balance sheet pro forma for the Rs2,500 cr raised in Jul/Aug-2026 (see Balance sheet)' };

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Revenue up 100x since FY20; losses halved in FY26 and almost gone in Q1FY27',
  blocks: [
    { p: 'Ather sold ₹35 cr of scooters in FY20 and ₹3,672 cr in FY26. Growth came in two bursts: FY22-FY23 (the 450X and the FAME-II subsidy) and FY25-FY26 (the Rizta family scooter, launched in Apr-2024, which took Ather beyond the south). FY24 was flat because the subsidy was cut in Jun-2023. Losses peaked at ₹1,060 cr in FY24 (₹885 cr before a one-off charge) and fell to ₹812 cr in FY25 and ₹517 cr in FY26. The EBITDA margin (before other income) went from −40% in FY23 to −11% in FY26 and −2.7% in Q1FY27, as revenue grew faster than fixed costs and the cost of materials per scooter fell 9% in FY26.' },
    { pair: [
      { type: 'column', title: 'Revenue: ₹408 cr in FY22, ₹3,672 cr in FY26', unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY20', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'column', title: 'Net loss: peaked at ₹1,060 cr in FY24, ₹517 cr in FY26', unit: 'Net profit (₹ crore)', x: 'fin.labels', from: 'FY20', to: 'FY26', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: −40% in FY23, −11% in FY26', unit: 'EBITDA margin before other income (%)', x: 'fin.labels', from: 'FY22', to: 'FY26', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', source: SRC.co },
      { type: 'column', title: 'Cost of materials fell from 96% to 79% of revenue', unit: 'Material cost, % of revenue', x: 'A.labels', from: 'FY22', series: [{ name: 'Material cost', ref: 'A.materialPct', fmt: 'pct0' }], labels: 'all', source: 'Screener.in' },
    ] },
    { callout: '**Our view:** the improvement is real and mostly operating leverage: management says about three-quarters of the costs below gross margin are fixed, so each extra scooter lifts the margin. But the business has never made an annual operating profit, and FY26 still lost ₹408 cr at the EBITDA level. Other income (₹146 cr in FY26, mostly interest on IPO cash) is what made the company\'s own "EBITDA" definition look better than Screener\'s.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Cash burn & funding', kicker: 'Capital', title: 'Cash burn: ₹4,000 cr of equity raised since FY20; free cash flow still negative',
  blocks: [
    { p: 'Ather has always been funded by equity. Shares issued raised ₹220 cr (FY20), ₹344 cr (FY21), ₹1,200 cr (FY23), ₹901 cr (FY24), ₹87 cr (FY25) and ₹2,540 cr in FY26 (the May-2025 IPO, net of costs), and another ₹2,500 cr in Jul/Aug-2026 (QIP ₹1,300 cr; India Japan Fund ₹200 cr; Hero MotoCorp and founder warrants ₹1,000 cr, of which ₹250 cr paid). Cash used by operations peaked at ₹871 cr in FY23; FY26 was the first year operations made cash (+₹32 cr), helped by ₹268 cr more supplier credit, customer advances and deferred software revenue. Capex rose to ₹506 cr in FY26 (AURIC factory, EL platform).' },
    { pair: [
      { type: 'column', title: 'Operating cash flow turned positive in FY26', unit: '₹ crore', x: 'A.labels', from: 'FY21', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }], labels: 'none', source: 'Screener.in cash flow realigned to the AR FY26 statement (ATHERENERG.patch.js)' },
      { type: 'column', title: 'Free cash flow: −₹1,060 cr in FY25, −₹474 cr in FY26', unit: 'Free cash flow (₹ crore)', x: 'A.labels', from: 'FY21', series: [{ name: 'Free cash flow', ref: 'A.fcf', fmt: 'num' }], labels: 'all', source: 'Screener.in; AR FY26' },
    ] },
    { callout: '**The capital question:** with ~₹4,400 cr of pro forma net cash, Ather is funded for AURIC Phase 1 and most of Phase 2 on our numbers (free cash flow of {{F.fcf.0|num}} / {{F.fcf.1|num}} / {{F.fcf.2|num}} cr in FY27-29E). The risk is not solvency but dilution and returns: equity has been raised every one or two years, and the company has not yet shown it can earn its cost of capital.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'Net cash of ~₹4,400 cr pro forma; suppliers fund the working capital',
  blocks: [
    { p: 'At Mar-2026 Ather held ₹2,582 cr of cash, bank deposits and liquid funds (₹823 cr cash and bank, ₹552 cr mutual funds, ₹1,207 cr term deposits inside other financial assets, mostly unspent IPO money) against ₹664 cr of borrowings and leases: ₹1,918 cr net. Adding the ₹2,500 cr raised in Jul/Aug-2026 (including the ₹750 cr due when the warrants convert) gives **~₹4,418 cr pro forma, ~₹109 a share** on 40.41 cr fully diluted shares. Working capital is negative (−53 days in FY26, company KPI): trade payables (₹830 cr), customer advances (₹126 cr) and deferred software and extended-warranty revenue (₹197 cr) exceed inventory (₹282 cr) and receivables (₹8 cr). Other current assets include ₹339 cr of GST credit (EVs pay 5% GST on sales but 18-28% on many inputs) and ₹75 cr of subsidy receivable.' },
    { callout: '**Pro forma note:** the engine has no share-issue line for industrial companies, so we add the ₹2,500 cr of equity raised after March to the Mar-2026 balance sheet (investments and reserves) and count the 79.4 lakh warrants as shares. Reported Mar-2026 net worth was ₹2,573 cr; shown here as {{A.netWorth.6|num}} cr. See the statement notes.' },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-23', 'Mar-24', 'Mar-25', 'Mar-26 (pro forma)'], rows: [
      ['Net worth', '{{A.netWorth.3|num}}', '{{A.netWorth.4|num}}', '{{A.netWorth.5|num}}', '{{A.netWorth.6|num}}'],
      ['Borrowings (incl. leases)', '{{A.borrowings.3|num}}', '{{A.borrowings.4|num}}', '{{A.borrowings.5|num}}', '{{A.borrowings.6|num}}'],
      ['Cash and bank balances', '{{A.cash.3|num}}', '{{A.cash.4|num}}', '{{A.cash.5|num}}', '{{A.cash.6|num}}'],
      ['Investments (pro forma incl. ₹2,500 cr raised)', '{{A.investments.3|num}}', '{{A.investments.4|num}}', '{{A.investments.5|num}}', '{{A.investments.6|num}}'],
      ['Net fixed assets', '{{A.fixedAssets.3|num}}', '{{A.fixedAssets.4|num}}', '{{A.fixedAssets.5|num}}', '{{A.fixedAssets.6|num}}'],
      ['Capital work in progress', '{{A.cwip.3|num}}', '{{A.cwip.4|num}}', '{{A.cwip.5|num}}', '{{A.cwip.6|num}}'],
      ['Inventories', '{{A.inventories.3|num}}', '{{A.inventories.4|num}}', '{{A.inventories.5|num}}', '{{A.inventories.6|num}}'],
      ['Trade payables', '{{A.payables.3|num}}', '{{A.payables.4|num}}', '{{A.payables.5|num}}', '{{A.payables.6|num}}'],
    ], source: SRC.co + '. Term deposits of ₹1,207 cr in other financial assets are not in the cash line.' } },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: Hero MotoCorp 30%, founders 10.7%, Indian funds buying, foreign funds selling',
  blocks: [
    { pair: [
      { type: 'line', title: 'Foreign funds sold after the lock-ins ended; Indian funds bought', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Shareholders: 1.4 lakh after the IPO, 2.3 lakh in Jun-2026', unit: 'Number of shareholders', x: 'SH.periods', series: [{ name: 'Shareholders', ref: 'SH.rows.No. of Shareholders', fmt: 'num' }], labels: 'ends', source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY20–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 25 }, hl: true },
      { key: 'ebitda', name: 'EBITDA' , hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 500 } },
      { key: 'dep', name: 'Depreciation' },
      { key: 'otherIncome', name: 'Other income' },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit', hl: true },
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
  require('./ATHERENERG.mult').syncMult();
  const B = fs.existsSync(path.join(__dirname, 'ATHERENERG.research.js')) ? require('./ATHERENERG.research') : null;
  const report = {
    symbol: 'ATHERENERG', listing: 'NSE: ATHERENERG · BSE: 544397', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Automobiles',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
