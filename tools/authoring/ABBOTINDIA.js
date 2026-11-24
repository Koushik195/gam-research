// Authoring source for the Abbott India initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, standalone: Abbott India has no subsidiaries;
// FY = April-March). Part B (ABBOTINDIA.research.js + part2-6, shared ABBOTINDIA.ctx.js) adds the research chapters,
// cover, rating and statement notes. Usage: node tools/authoring/ABBOTINDIA.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'ABBOTINDIA', 'research');
const SRC = { co: 'Abbott India annual reports; Screener.in (standalone); GAM Research', est: 'Company, GAM Research estimates' };
const SG = JSON.parse(fs.readFileSync(path.join(RD, 'segments.json'), 'utf8'));
const C = JSON.parse(fs.readFileSync(path.join(RD, 'company.json'), 'utf8'));
const SA = SG.annual, SQ = SG.quarterly, TR = C.treasury, DV = C.dividends.rows;

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Revenue +10% a year since FY21, EPS +18%: margins did the heavy lifting, and that tailwind is now mostly spent',
  blocks: [
    { p: 'Abbott India\'s revenue grew from ₹4,310 cr in FY21 to ₹6,929 cr in FY26, 10% a year, almost exactly the pace of the Indian drug market. Earnings grew much faster: EPS rose from ₹325 to ₹730 (18% a year). Two things explain the gap. First, the EBITDA margin (operating profit before other income) widened from 21.4% to 27.3% as Abbott\'s own brands grew faster than the low-margin Novo Nordisk insulin it distributes, and as employee and other costs grew slower than sales. Second, interest on a growing cash pile lifted other income from ₹81 cr to ₹288 cr. FY26 was the first sign of a slowdown: revenue +8.1%, EPS +9.7%, and Q1FY27 revenue grew only 4.3%.' },
    { pair: [
      { type: 'column', title: 'Revenue: ₹2,289 cr (FY15) to ₹6,929 cr (FY26)', unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY17', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num', growth: true }], source: SRC.est },
      { type: 'line', title: 'EBITDA margin: 14% to 27% in a decade', unit: 'EBITDA margin before other income (%)', x: 'fin.labels', from: 'FY17', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 10, max: 32, source: SRC.est },
    ] },
    { pair: [
      { type: 'hbar', title: 'Where each rupee of FY26 revenue went', unit: 'FY26, % of revenue', x: ['Materials and traded goods', 'Employees', 'Other expenses', 'EBITDA'], series: [{ name: 'Share', values: [53.3, 9.7, 9.7, 27.3], fmt: 'pct' }], labels: 'all', highlight: 'EBITDA', source: 'AR FY26 P&L (traded goods ₹3,164 cr = 46% of revenue)' },
      { type: 'column', title: 'EPS: ₹325 (FY21) to ₹730 (FY26); our ₹{{F.eps.2|num}} in FY29E', unit: 'EPS (₹); FY27-29E = GAM', x: 'fin.labels', from: 'FY19', series: [{ name: 'EPS', ref: 'fin.eps', fmt: 'num' }], labels: 'all', source: SRC.est },
    ] },
    { exhibit: { type: 'table', title: 'FY24 → FY26: the P&L (₹ crore)', head: ['', 'FY24', 'FY25', 'FY26', 'Note'], wide: [4], rows: [
      ['Revenue', '{{A.sales.9|num}}', '{{A.sales.10|num}}', '{{A.sales.11|num}}', '+9.6% / +8.1%; includes ₹81 cr of services to Abbott affiliates (FY26)'],
      ['Materials and traded goods', '3,220', '3,497', '3,693', 'Traded goods ₹3,164 cr in FY26 (Novo products and third-party-made brands)'],
      ['EBITDA (before other income)', '{{A.ebitda.9|num}}', '{{A.ebitda.10|num}}', '{{A.ebitda.11|num}}', 'Company "EBITDA" of ₹2,180 cr adds other income'],
      ['Other income', '{{A.otherIncome.9|num}}', '{{A.otherIncome.10|num}}', '{{A.otherIncome.11|num}}', '89% is interest on bank deposits'],
      ['Depreciation / finance cost', '71 / 12', '72 / 11', '76 / 25', 'Mostly leased offices (Ind AS 116)'],
      ['Tax rate', '25.8%', '25.0%', '25.4%', 'New regime'],
      { hl: true, cells: ['**Net profit**', '**{{A.pat.9|num}}**', '**{{A.pat.10|num}}**', '**{{A.pat.11|num}}**', '+26% / +18% / +10%'] },
      ['EPS (₹)', '{{A.eps.9|n1}}', '{{A.eps.10|n1}}', '{{A.eps.11|n1}}', 'No dilution: 2.12 cr shares since 2011'],
    ], source: 'Screener.in; AR FY26 ten-year highlights and notes 24-31' } },
    { callout: '**Our view:** Abbott India is a steady compounder whose margin expansion is maturing. From here, EPS growth should track revenue (7-8% a year on our numbers) plus a little mix-driven margin, i.e. ~9% a year, half the FY21-26 pace. We forecast EPS of ₹{{F.eps.0|n1}} / {{F.eps.1|n1}} / {{F.eps.2|n1}} for FY27-29E.' },
  ],
};

const margins = {
  id: 'margins', nav: 'Margins & mix', kicker: 'Profitability', title: 'Margins: 18.5% (FY20) to 28.8% (Q1FY27), built on mix and cost discipline rather than price',
  blocks: [
    { p: 'Abbott India sells two kinds of products. Its own brands (Thyronorm, Udiliv, Duphalac, Cremaffin, Duphaston, Vertin and others) earn a high margin: BOBCAPS estimates the "core" portfolio\'s EBITDA margin at 41.8% (Q4FY26). The Novo Nordisk insulin and diabetes brands it distributes earn a thin distribution margin. As own brands rose from ~64% of revenue (FY21) to ~65-68% and costs grew slower than sales, the margin widened by almost 9 points in six years. Q1FY27 showed the mechanism clearly: partner sales fell, gross margin jumped 283bp to 48.6% and EBITDA margin rose to 28.8% even though revenue grew only 4%.' },
    { pair: [
      { type: 'waterfall', title: 'FY20 to FY26: margin +8.8pp, from gross margin, staff and other costs', unit: 'EBITDA margin (%) and change (percentage points)', x: ['FY20', 'Gross margin (mix)', 'Employee cost', 'Other expenses', 'FY26'], series: [{ name: 'pp', values: [18.5, 3.2, 2.0, 3.6, 27.3], fmt: 'n1' }], fmt: 'n1', totalFmt: 'pct', min: 0, max: 30, source: 'AR FY26 ten-year highlights (FY20: materials 56.5%, employees 11.6%, other 13.3% of revenue; FY26: 53.3%, 9.7%, 9.7%); GAM' },
      { type: 'line', title: 'Quarterly margins: gross margin 48.6% and EBITDA margin 28.8% in Q1FY27', unit: '% of revenue', x: SQ.map(q => q.q), series: [{ name: 'Gross margin', values: SQ.map(q => q.grossMarginPct), fmt: 'pct' }, { name: 'EBITDA margin', values: SQ.map(q => q.ebitdaMarginPct), fmt: 'pct' }], labels: 'all', min: 20, max: 52, source: 'Company results (ICICI Direct quarterly table, 13-Aug-2026)' },
    ] },
    { pair: [
      { type: 'stacked', title: 'Own brands vs Novo partner brands: ~35% of sales is distribution', unit: 'Revenue (₹ crore, sale-of-products basis); FY26 = 65/35 estimate', x: ['FY21', 'FY22', 'FY23', 'FY24', 'FY26E'], series: [{ name: 'Own brands', values: [...SA.filter(a => a.core).map(a => a.core), SA.find(a => a.fy === 'FY26').coreEst], fmt: 'num' }, { name: 'Novo partner brands', values: [...SA.filter(a => a.partner).map(a => a.partner), SA.find(a => a.fy === 'FY26').partnerEst], fmt: 'num' }], minLabel: 1000, source: 'BOBCAPS initiation (company split FY21-24); BOBCAPS 13-May-2026 and 3-Sep-2026 (65/35); GAM' },
      { type: 'line', title: 'Employee and other costs: from 25% of revenue to 19%', unit: '% of revenue', x: SA.map(a => a.fy), series: [{ name: 'Employee cost', values: SA.map(a => Math.round(a.employee / a.revenue * 1000) / 10), fmt: 'pct' }, { name: 'Other expenses', values: SA.map(a => Math.round(a.otherExp / a.revenue * 1000) / 10), fmt: 'pct' }], labels: 'ends', min: 5, max: 15, source: 'AR FY26 ten-year highlights' },
    ] },
    { callout: '**Why we model 28.5% / 29.0% / 29.5% and not more:** the mix tailwind continues as partner sales shrink (own brands rise from ~68% to ~71% of revenue by FY29E on our build), but Abbott will have to spend on launches (75 planned in five years), GLP-1 promotion and field force, and price control limits price increases on ~26% of its own portfolio. Each 1pp of margin is ~₹79 cr of FY28E EBITDA, ~₹28 of EPS (3%).' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capital allocation', kicker: 'Capital allocation', title: 'Capital allocation: almost no capex, 71-90% of profit paid out, and still ₹4,400 cr of cash',
  blocks: [
    { p: 'Abbott India needs very little capital. It owns one plant (Goa), buys most of what it sells from contract manufacturers and from Novo Nordisk, and spent only ₹41 cr on capex in FY26 against ₹1,319 cr of operating cash flow. So almost all profit is free cash. The company has paid out 71-90% of profit as dividends in each of the last six years: a regular final dividend of ~72% of EPS since FY24, plus special dividends in FY20-23 and FY26 (₹131 a share). Even so, bank deposits grew from ₹3,785 cr (Mar-25) to ₹4,410 cr (Mar-26), because interest received (₹385 cr in FY26) and ₹29 cr from selling two Mumbai offices more than covered the gap. Management describes capital allocation as "measured and consistent" and mentions "potential acquisitions", but we found no acquisition since the Solvay Pharma India merger (2011), and the FY25-26 cash-flow statements show none.' },
    { pair: [
      { type: 'stacked', title: 'Dividend per share: regular plus specials', unit: '₹ per share, by year earned', x: DV.map(d => d.fy), series: [{ name: 'Regular', values: DV.map(d => d.regular), fmt: 'num' }, { name: 'Special', values: DV.map(d => d.special), fmt: 'num' }], minLabel: 100, source: 'AR FY26 ten-year highlights' },
      { type: 'column', title: 'Operating cash flow vs capex', unit: '₹ crore', x: 'A.labels', from: 'FY17', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }], labels: 'none', source: SRC.co },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went (₹ crore)', head: ['', 'FY24', 'FY25', 'FY26', 'Three years'], rows: [
      ['Cash from operations', '{{A.cfo.9|num}}', '{{A.cfo.10|num}}', '{{A.cfo.11|num}}', '3,544'],
      ['Capex', '{{A.capex.9|num}}', '{{A.capex.10|num}}', '{{A.capex.11|num}}', '142'],
      ['Dividends paid (previous year\'s dividend)', '{{A.dividendsPaid.9|num}}', '{{A.dividendsPaid.10|num}}', '{{A.dividendsPaid.11|num}}', '2,571'],
      ['Lease payments (offices)', '–', '54', '57', ''],
      { hl: true, cells: ['**Left over before interest received**', '**474**', '**34**', '**212**', ''] },
      ['Memo: interest received on deposits', '–', '125', '385', 'FY26 includes accrued interest from earlier years'],
      ['Memo: company cash and deposits at year-end', '–', n(TR.mar25.total), n(TR.mar26.total), 'Excl. ₹139 cr of interest accrued (Mar-26)'],
    ], source: 'Screener.in cash flow; AR FY26 cash-flow statement and notes 5, 6, 10-12' } },
    { callout: '**The capital question.** ₹4,410 cr of deposits is 7.7% of Abbott\'s market value and earns ~6% before tax (~4.5% after), well below the 34% ROE of the business. Minority shareholders cannot force a decision; the parent, with 75% of the shares and 75% of every dividend (₹757 cr in FY26), effectively sets the payout. We assume an 80% payout and no acquisition; a larger special dividend or a buyback would lift ROE but not EPS much.' },
  ],
};
function n(v) { return Math.round(v).toLocaleString('en-IN'); }

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'Balance sheet: debt-free, ₹4,238 cr of net cash, and working capital funded by suppliers',
  blocks: [
    { p: `At Mar-26 Abbott India had no borrowings; its only financial liability was ₹172 cr of leases (₹125 cr of it for offices rented from Abbott Healthcare). Against this it held ₹4,410 cr of cash and bank deposits: ₹442 cr of cash and short deposits, ₹1,790 cr of 3-12-month deposits and ₹2,178 cr of deposits maturing after more than a year, which Screener files under "other assets" (so its "cash" of ₹2,255 cr understates the true figure by half). Net cash was therefore ₹4,238 cr, ~₹1,995 a share. Working capital is lean: inventory of 94 days of cost is funded by 109 days of supplier credit, and customers pay in ~19 days.` },
    { pair: [
      { type: 'column', title: 'Cash and deposits: ₹3,785 cr (Mar-25) to ₹4,410 cr (Mar-26)', unit: '₹ crore; company basis (all bank deposits)', x: ['Mar-25', 'Mar-26'], series: [{ name: 'Cash and short deposits', values: [TR.mar25.cashAndEquivalents, TR.mar26.cashAndEquivalents], fmt: 'num' }, { name: 'Deposits < 12 months', values: [TR.mar25.deposits3to12m + TR.mar25.depositsCurrentPortion, TR.mar26.deposits3to12m], fmt: 'num' }, { name: 'Deposits > 12 months', values: [TR.mar25.depositsOver12m, TR.mar26.depositsOver12m], fmt: 'num' }], labels: 'all', source: 'AR FY26 notes 6, 10, 11, 12' },
      { type: 'line', title: 'Working capital: suppliers fund the inventory', unit: 'Days (Screener)', x: 'A.labels', from: 'FY17', series: [{ name: 'Inventory days', ref: 'A.inventoryDays', fmt: 'num' }, { name: 'Receivable days', ref: 'A.debtorDays', fmt: 'num' }, { name: 'Payable days', ref: 'A.payableDays', fmt: 'num' }], labels: 'last', source: 'Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-23', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth', '{{A.netWorth.8|num}}', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}'],
      ['Lease liabilities (Screener "borrowings")', '{{A.borrowings.8|num}}', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}'],
      ['Screener "cash equivalents" (cash + deposits under 12 months)', '{{A.cash.8|num}}', '{{A.cash.9|num}}', '{{A.cash.10|num}}', '{{A.cash.11|num}}'],
      { hl: true, cells: ['**Company cash and all bank deposits**', '–', '–', `**${n(TR.mar25.total)}**`, `**${n(TR.mar26.total)}**`] },
      ['Inventories', '649', '620', '882', '947'],
      ['Trade payables', '892', '1,003', '1,058', '1,107'],
      ['Net fixed assets incl. right-of-use', '{{A.fixedAssets.8|num}}', '{{A.fixedAssets.9|num}}', '{{A.fixedAssets.10|num}}', '{{A.fixedAssets.11|num}}'],
    ], source: 'Screener.in; AR FY26 notes. Our model starts from the company\'s net cash of ₹4,238 cr (see Forecasts).' } },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: Abbott owns 75%, Indian funds 9%, foreign funds almost nothing; a 25% free float',
  blocks: [
    { pair: [
      { type: 'line', title: 'DIIs ~9%, FIIs below 0.5%', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoters: 74.99%, at the legal maximum', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 60, max: 80, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { p: 'Standalone accounts (Abbott India has no subsidiaries). Other income is mostly interest on bank deposits. Forecast years (FY27-29E) are GAM estimates; see Forecasts for the drivers.' },
    { statement: { title: 'Profit & loss, FY15–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 12 }, hl: true }, { key: 'ebitda', name: 'EBITDA', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 150 } }, { key: 'dep', name: 'Depreciation & amortisation (incl. leases)', flag: { type: 'pct', th: 50 } },
      { key: 'otherIncome', name: 'Other income (mostly deposit interest)', flag: { type: 'pct', th: 40 } }, { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit', hl: true, flag: { type: 'pct', th: 20 } }, { key: 'eps', name: 'EPS (₹)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' }, { key: 'capex', name: 'Capex' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 10 }, hl: true }, { key: 'ebitda', name: 'EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' }, { key: 'otherIncome', name: 'Other income' },
      { key: 'dep', name: 'Depreciation' }, { key: 'pat', name: 'Net profit', hl: true, yoy: true, flag: { type: 'pct', th: 20 } },
    ] } },
  ],
};

const statementNotes = {};
module.exports = { financials, margins, capital, balance, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  const B = fs.existsSync(path.join(__dirname, 'ABBOTINDIA.research.js')) ? require('./ABBOTINDIA.research') : null;
  const report = {
    symbol: 'ABBOTINDIA', listing: 'NSE: ABBOTINDIA · BSE: 500488', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Healthcare',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, margins, capital, balance, ownershipBase, statements }) : [financials, margins, capital, balance, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections, ${JSON.stringify(report).match(/"type":/g).length} chart/table exhibits`);
}
