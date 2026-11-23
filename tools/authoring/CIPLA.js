// Authoring source for the Cipla initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated; profit attributable to
// shareholders, see CIPLA.patch.js). Part B (CIPLA.research.js + part2-6, shared CIPLA.ctx.js) adds the research
// chapters, cover, rating and statement notes. Usage: node tools/authoring/CIPLA.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'CIPLA', 'research');
const SRC = { co: 'Company filings, Screener.in (consolidated), GAM Research', est: 'Company, GAM Research estimates' };
const SG = JSON.parse(fs.readFileSync(path.join(RD, 'segments.json'), 'utf8'));
const C = JSON.parse(fs.readFileSync(path.join(RD, 'company.json'), 'utf8'));
const GEO = C.geoRevenue.rows, SQ = SG.quarterly;

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Revenue doubled since FY19; profit tripled to FY25 on a US windfall, then fell 26% in FY26',
  blocks: [
    { p: 'Cipla\'s revenue grew from ₹16,362 cr in FY19 to ₹28,163 cr in FY26 (8% a year). Profit attributable to shareholders grew much faster, from ₹1,528 cr to a peak of ₹5,273 cr in FY25 (23% a year), and then fell to ₹3,879 cr in FY26. The reason is one product. From late 2022 Cipla sold a generic copy of Revlimid (lenalidomide, a blood-cancer drug) in the US under a settlement that capped how much generic makers could sell, so prices stayed high. In FY24-25 it was very profitable. It ended in the December 2025 quarter, and US revenue fell from $233mn in Q2FY26 to $155mn in Q4FY26. India, Africa and Europe kept growing, but not fast enough to fill the gap.' },
    { pair: [
      { type: 'column', title: 'Revenue: 8% a year since FY19; only +2% in FY26', unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY17', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num', growth: true }], source: SRC.est },
      { type: 'column', title: 'EPS: the gRevlimid hump of FY24-25, and the recovery we model', unit: 'EPS, reported (₹)', x: 'fin.labels', from: 'FY17', series: [{ name: 'EPS', ref: 'fin.eps', fmt: 'n1' }], labels: 'all', source: SRC.est },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: ~21% before the windfall (FY22), 26% at the peak, 21% in FY26', unit: 'EBITDA margin excl. other income (%)', x: 'fin.labels', from: 'FY17', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 10, max: 30, source: SRC.est },
      { type: 'stacked', title: 'India is now 45% of revenue; the US fell to 24%', unit: 'Revenue by customer location (₹ crore); Africa = South Africa to FY24, One Africa from FY25', x: GEO.map(g => g.fy), series: [{ name: 'India', values: GEO.map(g => g.india), fmt: 'num' }, { name: 'USA', values: GEO.map(g => g.usa), fmt: 'num' }, { name: 'Africa', values: GEO.map(g => g.africa), fmt: 'num' }, { name: 'Rest of world', values: GEO.map(g => g.row), fmt: 'num' }], minLabel: 2500, source: 'Annual reports (segment notes)' },
    ] },
    { callout: '**Our view:** strip out the windfall and Cipla is a steady business: India grows ~10% a year, Africa and Europe mid-single digits in dollars, and the US depends on a handful of complex launches at any time. The FY24-25 earnings were the exception, not the base. Our FY29E EPS (₹{{F.eps.2|n1}}) is still at the FY25 level.' },
  ],
};

const margins = {
  id: 'margins', nav: 'Margins after gRevlimid', kicker: 'Profitability', title: 'Margins after the windfall: 25.9% in FY25, 16.7% in Q1FY27, guided 18.5-20% for FY27',
  blocks: [
    { p: 'Cipla\'s EBITDA margin (operating profit before other income) fell 920bp (basis points; 100bp = 1 percentage point) between FY25 and Q1FY27. More than half came from gross margin: gRevlimid and lanreotide were high-margin, and Q1FY27 also carried war-related costs (1-2% of revenue, management) and higher-than-usual inventory write-offs. The rest came from people: employee cost rose from 17.5% of revenue to 21.0% because Cipla staffed its US plants and added field force ahead of launches that have not yet arrived. R&D went from 5.5% of revenue (FY25) to 7.0% (FY26).' },
    { pair: [
      { type: 'waterfall', title: 'FY25 to Q1FY27: gross margin took 5.1pp, staff costs 3.5pp', unit: 'EBITDA margin (%) and change (percentage points); company figures', x: ['FY25', 'Gross margin (mix, gRevlimid, war)', 'Employee cost', 'Other expenses', 'Q1FY27'], series: [{ name: 'pp', values: [25.9, -5.1, -3.5, -0.6, 16.7], fmt: 'n1' }], fmt: 'n1', totalFmt: 'pct', min: 0, max: 30, source: 'Company results (FY25: gross margin 67.6%, employee 17.5%, other 24.2% of revenue; Q1FY27: 62.5%, 21.0%, 24.8%), GAM Research' },
      { type: 'line', title: 'Quarterly EBITDA margin: from 28% to 15% in four quarters', unit: 'EBITDA margin (%), company basis', x: SQ.map(q => q.q), series: [{ name: 'EBITDA margin', values: SQ.map(q => q.ebitdaMarginPct), fmt: 'pct' }, { name: 'Gross margin', values: SQ.map(q => q.grossMarginPct), fmt: 'pct' }], labels: 'all', min: 10, max: 75, source: 'Company presentations; ICICI Direct quarterly table' },
    ] },
    { pair: [
      { type: 'column', title: 'North America: $250mn a quarter at the peak, $155-162mn now', unit: 'North America revenue (US$ mn)', x: SQ.map(q => q.q), series: [{ name: 'North America', values: SQ.map(q => q.naUsd), fmt: 'num' }], labels: 'all', source: 'Company presentations' },
      { type: 'line', title: 'Employee cost: 17% of revenue for a decade, 19% in FY26', unit: 'Employee cost as % of revenue', x: 'A.labels', from: 'FY17', series: [{ name: 'Employee cost %', ref: 'A.employeePct', fmt: 'pct' }], labels: 'all', min: 10, max: 25, source: 'Screener.in' },
    ] },
    { callout: '**Why we model 18.5% for FY27 and 21% after, not 25%:** management guides 18.5-20% for FY27, "predicated on the launches", with most of the improvement in H2. We take the bottom of the range because Q1 was 16.7% and our US build is below management\'s. From FY28 a full year of in-house inhaler launches (gAdvair, gVentolin, gSymbicort) and a richer India chronic mix should take margins back to ~21%, the pre-windfall level, but R&D at ~7% of revenue (vs 5-5.5% before) and price erosion as competitors enter cap the upside. Each 1pp of margin is ~₹340 cr of EBITDA, ~5% of FY28E EPS.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capex & returns', kicker: 'Capital allocation', title: 'Returns: ROIC fell from 33% to 23%; cash keeps piling up',
  blocks: [
    { p: 'Cipla generated ₹13,079 cr of operating cash in FY24-26 and spent ₹5,976 cr on capex (including intangibles and in-licensing upfronts), ₹487 cr on acquisitions and ₹3,028 cr on dividends. The rest went into cash and liquid funds. Capex doubled in FY26 to ₹3,079 cr (new US inhaler and peptide capacity, in-licensed brands); management says the cycle should ease "after another year or so". The company\'s own return on invested capital (ROIC) was 33.1% in FY25 and 22.9% in FY26; return on equity was 11.8% in FY26 because ~₹10,500 cr of cash earns ~6%.' },
    { pair: [
      { type: 'column', title: 'Operating cash flow vs capex', unit: '₹ crore', x: 'A.labels', from: 'FY17', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }], labels: 'none', source: SRC.co },
      { type: 'line', title: 'ROE vs company ROIC: the cash pile drags ROE down', unit: '%', x: ['FY22', 'FY23', 'FY24', 'FY25', 'FY26'], series: [{ name: 'ROIC (company; FY23-24 ex-QCIL)', values: [21.6, 23.8, 31.0, 33.1, 22.9], fmt: 'pct' }, { name: 'ROE (Screener)', ref: 'A.roe', fmt: 'pct' }], labels: 'all', min: 0, max: 40, source: 'Q4FY26 presentation (ROIC); Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went (₹ crore)', head: ['', 'FY24', 'FY25', 'FY26', 'Three years'], rows: [
      ['Cash from operations (Screener)', '{{A.cfo.9|num}}', '{{A.cfo.10|num}}', '{{A.cfo.11|num}}', '13,079'],
      ['Capex incl. intangibles', '{{A.capex.9|num}}', '{{A.capex.10|num}}', '{{A.capex.11|num}}', '5,976'],
      ['Acquisitions', '{{A.acquisitions.9|num}}', '{{A.acquisitions.10|num}}', '{{A.acquisitions.11|num}}', '487'],
      ['Dividends', '{{A.dividendsPaid.9|num}}', '{{A.dividendsPaid.10|num}}', '{{A.dividendsPaid.11|num}}', '3,028'],
      { hl: true, cells: ['**Left over (before treasury income)**', '**1,798**', '**2,332**', '**−542**', '**3,588**'] },
      ['Memo: company net cash (cash, funds, deposits less debt)', '7,707', '10,369', '10,526', ''],
    ], source: 'Screener.in cash flow; company presentations (net cash). Treasury income (~₹650 cr a year) sits in investing cash flow, which is why net cash rose in FY26.' } },
    { callout: '**The capital question:** at ₹9,494 cr (Jun-26) net cash is ~9% of Cipla\'s market value and earns ~6% pre-tax. Management wants to spend it on R&D (respiratory, peptides, 6-8 in-house biosimilars), in-licensing and "differentiated specialty" acquisitions in the US and Europe, and says a large India deal is hard because of overlap. It has not done a large deal since InvaGen-Exelan ($550mn, FY16). Until it does, the cash dilutes returns; we model no acquisition and a 27% payout.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'Balance sheet: ₹10,500 cr of net cash; working capital is the weak spot',
  blocks: [
    { p: 'Cipla has no meaningful debt: ₹614 cr at Mar-2026, mostly lease liabilities (₹356 cr) and small local borrowings. Against this it held ₹11,140 cr of cash, current investments (debt mutual funds) and bank deposits, so net cash was ₹10,526 cr (₹9,494 cr at Jun-2026 after the ₹1,050 cr dividend). Goodwill and intangibles rose to ₹6,850 cr (₹4,986 cr a year earlier) as Cipla capitalised in-licensed brands and products. The weak spot is working capital: inventory was 252 days of cost in FY26 (217 in FY24), as Cipla built stocks for launches and South African tenders.' },
    { pair: [
      { type: 'column', title: 'Net cash: ₹3,900 cr in FY22, ₹10,500 cr in FY26', unit: 'Company net cash (₹ crore): cash, current investments and deposits less debt incl. leases', x: ['FY22', 'FY23', 'FY24', 'FY25', 'FY26', 'Jun-26'], series: [{ name: 'Net cash', values: [3909, 5470, 7707, 10369, 10526, 9494], fmt: 'num' }], labels: 'all', source: 'Company presentations; AR FY26 ten-year highlights' },
      { type: 'line', title: 'Inventory days back above 250', unit: 'Days (Screener)', x: 'A.labels', from: 'FY17', series: [{ name: 'Inventory days', ref: 'A.inventoryDays', fmt: 'num' }, { name: 'Receivable days', ref: 'A.debtorDays', fmt: 'num' }, { name: 'Payable days', ref: 'A.payableDays', fmt: 'num' }], labels: 'last', source: 'Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-23', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth (owners)', '{{A.netWorth.8|num}}', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}'],
      ['Borrowings incl. leases', '{{A.borrowings.8|num}}', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}'],
      ['Cash and investments (Screener; includes ~₹540 cr of strategic stakes)', '{{A.cashAndInvestments.8|num}}', '{{A.cashAndInvestments.9|num}}', '{{A.cashAndInvestments.10|num}}', '{{A.cashAndInvestments.11|num}}'],
      { hl: true, cells: ['**Company gross cash (incl. deposits)**', '**6,273**', '**8,267**', '**10,807**', '**11,140**'] },
      ['Net fixed assets incl. intangibles', '{{A.fixedAssets.8|num}}', '{{A.fixedAssets.9|num}}', '{{A.fixedAssets.10|num}}', '{{A.fixedAssets.11|num}}'],
    ], source: 'Screener.in; AR FY26 ten-year highlights (company cash). Our model starts from the company\'s net cash of ₹10,526 cr (see Forecasts).' } },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: the Hamied family at 29%, Indian funds buying as foreign funds sell',
  blocks: [
    { pair: [
      { type: 'line', title: 'DIIs up from 24% to 34%; FIIs down from 29% to 20%', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoters: 33.5% to 29.2% after two family sales in 2024', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 20, max: 36, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY15–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 12 }, hl: true }, { key: 'ebitda', name: 'EBITDA', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 200 } }, { key: 'dep', name: 'Depreciation & amortisation', flag: { type: 'pct', th: 30 } },
      { key: 'otherIncome', name: 'Other income (Screener: net of exceptional items)', flag: { type: 'pct', th: 40 } }, { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit (owners)', hl: true, flag: { type: 'pct', th: 25 } }, { key: 'eps', name: 'EPS (₹)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' }, { key: 'capex', name: 'Capex incl. intangibles', flag: { type: 'pct', th: 60 } },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 12 }, hl: true }, { key: 'ebitda', name: 'EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' }, { key: 'otherIncome', name: 'Other income' },
      { key: 'dep', name: 'Depreciation' }, { key: 'pat', name: 'Net profit (owners)', hl: true, yoy: true, flag: { type: 'pct', th: 30 } },
    ] } },
  ],
};

const statementNotes = {};
module.exports = { financials, margins, capital, balance, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  const B = fs.existsSync(path.join(__dirname, 'CIPLA.research.js')) ? require('./CIPLA.research') : null;
  const report = {
    symbol: 'CIPLA', listing: 'NSE: CIPLA · BSE: 500087', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Healthcare',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, margins, capital, balance, ownershipBase, statements }) : [financials, margins, capital, balance, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections, ${JSON.stringify(report).match(/"type":/g).length} chart/table exhibits`);
}
