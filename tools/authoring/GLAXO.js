// Authoring source for the GSK India (GlaxoSmithKline Pharmaceuticals) initiating-coverage report (as of 30-Sep-2026,
// Q1FY27 basis). Part A (this file): chapters built on reported financials (Screener, consolidated: the company plus its
// 100% subsidiary Biddle Sawyer; FY = April-March). Part B (GLAXO.research.js + part2-6, shared GLAXO.ctx.js) adds the
// research chapters, cover, rating and statement notes. Usage: node tools/authoring/GLAXO.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'GLAXO', 'research');
const SRC = { co: 'GSK India annual reports; Screener.in (consolidated); GAM Research', est: 'Company, GAM Research estimates' };
const SG = JSON.parse(fs.readFileSync(path.join(RD, 'segments.json'), 'utf8'));
const C = JSON.parse(fs.readFileSync(path.join(RD, 'company.json'), 'utf8'));
const SA = SG.annual, SQ = SG.quarterly, TR = C.treasury, DV = C.dividends.rows, NW = C.nonWorkingCapital;
const n = v => Math.round(v).toLocaleString('en-IN');
const TRK = ['mar22', 'mar23', 'mar24', 'mar25', 'mar26'], TRL = ['Mar-22', 'Mar-23', 'Mar-24', 'Mar-25', 'Mar-26'];

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Revenue +5.5% a year since FY21, EPS before one-offs +17%: margins did all the work, and reported EPS was a mess of one-offs',
  blocks: [
    { p: 'GSK India\'s revenue (continuing operations) grew from ₹2,926 cr in FY21 to ₹3,822 cr in FY26, only 5.5% a year, about half the pace of the Indian drug market. Earnings grew three times faster: EPS before one-off items rose from ₹27.2 to ₹60.1 (17% a year). Almost all of that came from the EBITDA margin (operating profit before other income), which climbed from 20.4% to 34.3% as GSK shifted its mix away from price-controlled products, raised prices where it could, sourced more cheaply, cut ~470 jobs in FY24 (voluntary retirement) and used its field force better. Reported EPS tells a confusing story: ₹5.5 in FY20 (a write-off of the Vemgal plant), ₹100 in FY22 (the sale of the Iodex and Ostocalcium brands), ₹34.8 in FY24 (retirement-scheme costs). FY26 was a stall: revenue +1.9% because a fire at a contract manufacturer cut supplies of Calpol and other brands for most of the year, but EBITDA still rose 11%.' },
    { pair: [
      { type: 'column', title: 'Revenue: ₹2,926 cr (FY21) to ₹3,822 cr (FY26), ₹{{F.sales.2|num}} cr in FY29E', unit: 'Revenue (₹ crore); FY27-29E = GAM', x: 'fin.labels', from: 'FY17', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num', growth: true }], source: SRC.est },
      { type: 'line', title: 'EBITDA margin: 20% to 34% in five years', unit: 'EBITDA margin before other income (%)', x: 'fin.labels', from: 'FY17', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 10, max: 40, source: SRC.est },
    ] },
    { pair: [
      { type: 'hbar', title: 'Where each rupee of FY26 revenue went', unit: 'FY26, % of revenue (consolidated)', x: ['Materials and traded goods', 'Employees', 'Other expenses', 'EBITDA'], series: [{ name: 'Share', values: [35.4, 15.9, 14.5, 34.3], fmt: 'pct' }], labels: 'all', highlight: 'EBITDA', source: 'AR FY26 consolidated P&L (traded goods ₹910 cr = 24% of revenue)' },
      { type: 'column', title: 'EPS: reported swings with one-offs; before them, ₹27 to ₹60 in five years', unit: 'EPS (₹), consolidated; before one-offs = continuing operations before exceptional items (FY20 standalone)', x: SA.map(a => a.fy), series: [{ name: 'Reported', values: SA.map(a => a.eps), fmt: 'n1' }, { name: 'Before one-offs', values: SA.map(a => a.epsBeforeOneOffs), fmt: 'n1' }], labels: 'all', source: 'Annual reports FY21-FY26; Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'FY24 → FY26: the P&L (₹ crore)', head: ['', 'FY24', 'FY25', 'FY26', 'Note'], wide: [4], rows: [
      ['Revenue', '{{A.sales.9|num}}', '{{A.sales.10|num}}', '{{A.sales.11|num}}', '+6.2% / +8.6% / +1.9%: FY26 lost more than ₹100 cr to the contract-manufacturer fire'],
      ['Materials and traded goods', '1,334', '1,391', '1,351', 'Gross margin 61.4% → 64.6%: mix, price, sourcing'],
      ['EBITDA (before other income)', '{{A.ebitda.9|num}}', '{{A.ebitda.10|num}}', '{{A.ebitda.11|num}}', 'Margin 26.3% → 34.3%'],
      ['Other income (company notes)', '123', '146', '145', 'Interest on deposits and gains on liquid funds; Screener files fund gains as exceptional'],
      ['Exceptional items', '(144)', '5', '21', 'FY24 voluntary retirement; property sales'],
      ['Depreciation / finance cost', '70 / 2', '67 / 1', '66 / 3', 'One owned plant (Nashik); leases only'],
      ['Tax rate', '27.7%', '26.4%', '26.3%', 'New regime'],
      { hl: true, cells: ['**Net profit**', '**{{A.pat.9|num}}**', '**{{A.pat.10|num}}**', '**{{A.pat.11|num}}**', '−3% / +57% / +12%'] },
      ['EPS (₹): reported / before one-offs', '34.8 / 41.1', '54.8 / 54.5', '61.2 / 60.1', '16.94 cr shares since the 2018 bonus issue'],
    ], source: 'Screener.in; AR FY24-FY26 consolidated statements (EPS before exceptional items, continuing operations)' } },
    { callout: '**Our view:** the margin story that drove EPS from ₹27 to ₹60 is mostly done: management now says it wants to hold margins near 34% and spend the rest on launches. From here EPS growth has to come from revenue. We forecast revenue growth of 10-13% a year (the fire-hit base, double-digit vaccines, a fast-growing innovation portfolio) and EPS of ₹{{F.eps.0|n1}} / {{F.eps.1|n1}} / {{F.eps.2|n1}} for FY27-29E, ~11% a year, below the street.' },
  ],
};

const margins = {
  id: 'margins', nav: 'Margins & mix', kicker: 'Profitability', title: 'Margins: 20.4% (FY21) to 34.3% (FY26) on mix, price and a smaller cost base; we model 34-35%, not more',
  blocks: [
    { p: 'Between FY21 and FY26 GSK India added 13.8 points to its EBITDA margin. Materials and traded goods fell from 43.0% to 35.4% of revenue (7.6 points): the CFO lists three levers, a mix shift away from price-controlled products, pricing in step with peers where allowed, and cheaper sourcing for NLEM products (forward contracts, new suppliers). Employee costs fell from 21.1% to 15.9% (5.2 points) after the FY24 voluntary retirement scheme and as sales per representative rose (₹15-16 lakh a month in Q1FY27). Other expenses fell one point despite launch spending. The quarterly pattern matters for FY27: Q1 is the weakest quarter (31.5% in Q1FY27, with promotion deliberately front-loaded before the monsoon season) and Q2-Q3 the strongest (34-36%).' },
    { pair: [
      { type: 'waterfall', title: 'FY21 to FY26: margin +13.8pp, from gross margin and staff costs', unit: 'EBITDA margin (%) and change (percentage points)', x: ['FY21', 'Materials (mix, price, sourcing)', 'Employee cost', 'Other expenses', 'FY26'], series: [{ name: 'pp', values: [20.4, 7.6, 5.2, 1.0, 34.3], fmt: 'n1' }], fmt: 'n1', totalFmt: 'pct', min: 0, max: 40, source: 'Screener.in expense ratios (FY21: materials 43.0%, employees 21.1%, other 15.5%; FY26: 35.4%, 15.9%, 14.5%); GAM' },
      { type: 'line', title: 'Quarterly margins: gross 65%, EBITDA 31.6% in a seasonally weak Q1FY27', unit: '% of revenue (consolidated)', x: SQ.map(q => q.q), series: [{ name: 'Gross margin', values: SQ.map(q => q.grossMarginPct), fmt: 'pct' }, { name: 'EBITDA margin', values: SQ.map(q => q.ebitdaMarginPct), fmt: 'pct' }], labels: 'all', min: 20, max: 70, source: 'Screener.in quarterly results (consolidated)' },
    ] },
    { pair: [
      { type: 'line', title: 'Costs as % of revenue: materials and staff down sharply', unit: '% of revenue', x: SA.map(a => a.fy), series: [{ name: 'Materials and traded goods', values: SA.map(a => a.materialsPct), fmt: 'pct' }, { name: 'Employee cost', values: SA.map(a => a.employeePct), fmt: 'pct' }, { name: 'Other expenses', values: SA.map(a => a.otherExpPct), fmt: 'pct' }], labels: 'ends', min: 10, max: 45, source: 'Screener.in (consolidated)' },
      { type: 'column', title: 'Employees: 4,364 (FY20) to 3,103 (FY26)', unit: 'Permanent employees at year-end', x: SA.map(a => a.fy), series: [{ name: 'Employees', values: SA.map(a => a.employees), fmt: 'num' }], labels: 'all', source: 'AR FY26 ten-year summary' },
    ] },
    { callout: '**Why we model {{F.ebitdaMargin.0|pct}} / {{F.ebitdaMargin.1|pct}} / {{F.ebitdaMargin.2|pct}} and not more:** management guided to "34% kind of range" for FY27 and says its priority is growth, not margin: three launches in the next few quarters (Blenrep, Arexvy, bepirovirsen) need new haematology and liver field forces, patient-assistance programmes and medical education, and the innovative products are imported, so they carry lower gross margins than locally made antibiotics. Price control (~40% of sales at +0.65% a year) also caps pricing. Motilal Oswal models 37% for FY28E; each 1pp of FY28E margin is ~₹48 cr of EBITDA, ~₹2.1 of EPS (3%).' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capital allocation', kicker: 'Capital allocation', title: 'Capital allocation: ~90% of profit paid out and specials after asset sales; but the Vemgal plant destroyed ~₹890 cr',
  blocks: [
    { p: 'GSK India needs little capital: one owned plant (Nashik), ~20 contract manufacturers and imported vaccines and specialty products. Capex was ₹55 cr in FY26 (₹23 cr in FY25) against ₹903 cr of operating cash flow (₹1,290 cr in FY25). It pays out almost everything: dividends were 89-99% of EPS in FY23-26 (₹57 a share for FY26, ₹966 cr, paid in Aug-2026), with special dividends when it sells assets (₹20 a share after the Thane land, ₹60 after the Iodex/Ostocalcium sale). The blemish is the Vemgal plant in Karnataka: capital work in progress reached ₹1,003 cr by Mar-2019, then the global ranitidine (Zinetac) recall removed its purpose and GSK wrote off ~₹890 cr and sold the site for ~₹180 cr. The FY22 brand sale went to a GSK group company (GlaxoSmithKline Asia, now Haleon) for ₹1,649 cr, about 6x the brands\' FY21 sales of ₹273 cr; minority shareholders approved it.' },
    { pair: [
      { type: 'stacked', title: 'Dividend per share: regular plus specials', unit: '₹ per share, by year earned', x: DV.map(d => d.fy), series: [{ name: 'Regular', values: DV.map(d => d.regular), fmt: 'num' }, { name: 'Special', values: DV.map(d => d.special), fmt: 'num' }], minLabel: 10, source: 'AR FY26 and FY22 ten-year summaries' },
      { type: 'column', title: 'Operating cash flow vs capex', unit: '₹ crore', x: 'A.labels', from: 'FY17', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }], labels: 'none', source: SRC.co },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went (₹ crore)', head: ['', 'FY24', 'FY25', 'FY26', 'Three years'], rows: [
      ['Cash from operations', '{{A.cfo.9|num}}', '{{A.cfo.10|num}}', '{{A.cfo.11|num}}', '2,775'],
      ['Capex', '{{A.capex.9|num}}', '{{A.capex.10|num}}', '{{A.capex.11|num}}', '109'],
      ['Dividends paid (previous year\'s dividend, plus FY25\'s ₹12 special)', '{{A.dividendsPaid.9|num}}', '{{A.dividendsPaid.10|num}}', '{{A.dividendsPaid.11|num}}', '2,005'],
      ['Interest received on deposits', '93', '118', '119', '330'],
      { hl: true, cells: ['**Company cash, deposits and liquid funds at year-end**', `**${n(TR.mar24.total)}**`, `**${n(TR.mar25.total)}**`, `**${n(TR.mar26.total)}**`, ''] },
    ], source: 'Screener.in cash flow; AR FY24-FY26 consolidated notes (cash, bank balances, current investments)' } },
    { callout: `**The capital question.** ₹${n(TR.mar26.total)} cr of cash is ~6% of GSK India's market value and earns ~5% before tax, far below the business's 45% return on equity. Cash rises by only ~₹100-250 cr a year because almost all profit goes out as dividends, three-quarters of it to GSK plc (₹480 cr in FY26 after tax deducted). We assume a 90% payout and no acquisitions. The risk is not hoarding but the parent's choices on assets: in the last seven years the listed company sold its Thane land, a plant and two brands, the last to a group company.` },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: `Balance sheet: debt-free, ₹${n(TR.mar26.total)} cr of cash and funds, and working capital funded by suppliers; watch ₹${n(NW.net)} cr of tax and legal provisions`,
  blocks: [
    { p: `At Mar-26 GSK India had no borrowings; its only financial debt was ₹${TR.mar26.leases} cr of leases. It held ₹${n(TR.mar26.total)} cr of treasury: ₹${n(TR.mar26.currentAccounts + TR.mar26.depositsUnder3m)} cr of cash and short deposits, ₹${n(TR.mar26.deposits3to12m)} cr of 3-12-month deposits and ₹${n(TR.mar26.mutualFunds)} cr in liquid mutual funds. Net cash was therefore ₹${n(TR.mar26.total - TR.mar26.leases)} cr (~₹161 a share), before the ₹966 cr dividend paid in Aug-2026. Against that sit ₹${n(NW.net)} cr of non-operating liabilities: net tax balances (₹${n(NW.taxLiabilities)} cr of current tax liabilities less tax assets and deferred tax) and provisions for old price-control and indirect-tax disputes (₹${n(NW.provisionPricing + NW.provisionOthers + NW.provisionDivestment)} cr). Their timing is unknown; we treat them as debt-like in the DCF discussion. Working capital is negative: inventory of ~124 days of cost is funded by ~154 days of supplier credit, and customers pay in ~26 days.` },
    { pair: [
      { type: 'stacked', title: `Treasury: ₹${n(TR.mar22.total)} cr (Mar-22) to ₹${n(TR.mar23.total)} cr after the ₹90 dividend, back to ₹${n(TR.mar26.total)} cr`, unit: '₹ crore; company basis', x: TRL, series: [{ name: 'Cash and deposits < 3 months', values: TRK.map(k => Math.round(TR[k].currentAccounts + TR[k].depositsUnder3m)), fmt: 'num' }, { name: 'Deposits 3-12 months', values: TRK.map(k => Math.round(TR[k].deposits3to12m)), fmt: 'num' }, { name: 'Liquid mutual funds', values: TRK.map(k => Math.round(TR[k].mutualFunds)), fmt: 'num' }], minLabel: 150, source: 'AR FY23-FY26 consolidated notes' },
      { type: 'line', title: 'Working capital: suppliers fund the inventory', unit: 'Days (Screener)', x: 'A.labels', from: 'FY17', series: [{ name: 'Inventory days', ref: 'A.inventoryDays', fmt: 'num' }, { name: 'Receivable days', ref: 'A.debtorDays', fmt: 'num' }, { name: 'Payable days', ref: 'A.payableDays', fmt: 'num' }], labels: 'last', source: 'Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-23', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth', '{{A.netWorth.8|num}}', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}'],
      ['Lease liabilities (Screener "borrowings")', '{{A.borrowings.8|num}}', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}'],
      { hl: true, cells: ['**Company cash, deposits and liquid funds**', `**${n(TR.mar23.total)}**`, `**${n(TR.mar24.total)}**`, `**${n(TR.mar25.total)}**`, `**${n(TR.mar26.total)}**`] },
      ['Inventories', '460', '525', '482', '458'],
      ['Trade receivables', '192', '222', '293', '273'],
      ['Trade payables', '428', '625', '708', '570'],
      ['Net tax balances and long-dated provisions (debt-like)', '–', '–', '–', n(NW.net)],
      ['Net fixed assets incl. right-of-use', '330', '321', '284', '281'],
    ], source: 'Screener.in; AR FY23-FY26 consolidated notes. Our model starts from the company\'s net cash of ₹2,722 cr and takes the ₹719 cr out of working capital (GLAXO.patch.js)' } },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: GSK plc owns 75%, Indian funds 8%, foreign funds 5%; a 25% free float',
  blocks: [
    { pair: [
      { type: 'line', title: 'FIIs up to ~4.8%, DIIs down to ~7.8%', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoters: 75.00%, at the legal maximum', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 60, max: 80, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { p: 'Consolidated accounts (GSK India and its 100% subsidiary Biddle Sawyer). Screener\'s "other income" line includes exceptional items and, in FY22, the ₹1,314 cr after-tax profit on the Iodex/Ostocalcium sale; the notes below give the company figures. FY21 onward are continuing operations. Forecast years (FY27-29E) are GAM estimates; see Forecasts for the drivers.' },
    { statement: { title: 'Profit & loss, FY15–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 12 }, hl: true }, { key: 'ebitda', name: 'EBITDA', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 200 } }, { key: 'dep', name: 'Depreciation & amortisation', flag: { type: 'pct', th: 40 } },
      { key: 'otherIncome', name: 'Other income (incl. exceptional items, Screener)', flag: { type: 'pct', th: 50 } }, { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit', hl: true, flag: { type: 'pct', th: 25 } }, { key: 'eps', name: 'EPS (₹)', fmt: 'n1' },
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
  const B = fs.existsSync(path.join(__dirname, 'GLAXO.research.js')) ? require('./GLAXO.research') : null;
  const report = {
    symbol: 'GLAXO', listing: 'NSE: GLAXO · BSE: 500660', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Healthcare',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, margins, capital, balance, ownershipBase, statements }) : [financials, margins, capital, balance, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections, ${JSON.stringify(report).match(/"type":/g).length} chart/table exhibits`);
}
