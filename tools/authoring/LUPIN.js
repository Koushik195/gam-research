// Authoring source for the Lupin initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated; profit attributable to owners, see
// LUPIN.patch.js). Part B (LUPIN.research.js + part2-6, shared LUPIN.ctx.js) adds the research chapters, cover, rating
// and statement notes. Usage: node tools/authoring/LUPIN.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'LUPIN', 'research');
const SRC = { co: 'Company filings, Screener.in (consolidated), GAM Research', est: 'Company, GAM Research estimates' };
const SG = JSON.parse(fs.readFileSync(path.join(RD, 'segments.json'), 'utf8'));
const SA = SG.annual, SQ = SG.quarterly;

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'From two loss years to a record: profit went from a ₹1,528 cr loss (FY22) to ₹5,333 cr (FY26)',
  blocks: [
    { p: 'Lupin\'s revenue grew from ₹14,665 cr in FY19 to ₹27,958 cr in FY26 (10% a year), but profit has been a roller-coaster. It made losses in FY20 (impairments, the Japan exit) and FY22 (a ₹1,878 cr US antitrust settlement over the diabetes drug Glumetza and a ₹708 cr write-down of Solosec), and earned only ₹430 cr in FY23 when US prices fell and costs rose. Then three US products that few rivals could copy changed everything: the first generic of the COPD inhaler Spiriva (Aug-2023), the overactive-bladder drug Mirabegron (Apr-2024, launched before the patent fight was settled) and the kidney drug Tolvaptan (May-2025, six months of legal exclusivity that turned into more than a year alone). Profit rose to ₹1,914 cr in FY24, ₹3,282 cr in FY25 and ₹5,333 cr in FY26.' },
    { pair: [
      { type: 'column', title: 'Revenue: flat for six years, then +40% in two', unit: 'Revenue from operations (₹ crore)', x: 'fin.labels', from: 'FY17', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num', growth: true }], source: SRC.est },
      { type: 'column', title: 'EPS: losses in FY20 and FY22, a peak in FY26, lower in FY27E', unit: 'EPS, reported (₹)', x: 'fin.labels', from: 'FY17', series: [{ name: 'EPS', ref: 'fin.eps', fmt: 'n1' }], labels: 'all', source: SRC.est },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: 1% in FY22, 29% in FY26, ~23-25% in our forecasts', unit: 'EBITDA margin excl. forex and other income (%)', x: 'fin.labels', from: 'FY17', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 0, max: 32, source: SRC.est },
      { type: 'stacked', title: 'The US is now 42% of sales; India 30%', unit: 'Product sales by market (₹ crore); FY25 onward on the new reporting basis', x: SA.filter(r => r.us).map(r => r.fy).concat(['Q1FY27 x4']), series: [{ name: 'US', values: [...SA.filter(r => r.us).map(r => r.us), SQ.at(-1).us * 4], fmt: 'num' }, { name: 'India', values: [...SA.filter(r => r.us).map(r => r.india), SQ.at(-1).india * 4], fmt: 'num' }, { name: 'Other developed', values: [...SA.filter(r => r.us).map(r => r.odm), SQ.at(-1).odm * 4], fmt: 'num' }, { name: 'Emerging + API', values: [...SA.filter(r => r.us).map(r => r.em + r.api), (SQ.at(-1).em + SQ.at(-1).api) * 4], fmt: 'num' }], minLabel: 1500, source: 'Company press releases; Q1FY27 annualised' },
    ] },
    { callout: '**Our view:** the FY26 profit is a peak, not a base. Our FY27E EPS (₹{{F.eps.0|n1}}) is {{F.epsGrowth.0|chg}} as Tolvaptan and Mirabegron lose their pricing; FY28-29E recover only slowly (₹{{F.eps.1|n1}} / ₹{{F.eps.2|n1}}) as new launches replace them. The business underneath is much better than in FY23 (India, Europe and emerging markets now earn real money), but it is not a ₹117-EPS business without exclusivities.' },
  ],
};

const margins = {
  id: 'margins', nav: 'Margins', kicker: 'Profitability', title: 'Margins: 10% in FY23, 29% in FY26, guided ~25% for FY27 and falling through the year',
  blocks: [
    { p: 'Lupin\'s EBITDA margin (operating profit before forex and other income) rose 19 percentage points in three years. Most of it is gross margin: material cost fell from 40.7% of revenue in FY23 to 26.2% in FY26 (Screener), because the new US products sell at prices far above their cost and because India shifted away from low-margin in-licensed products (12% of the Rx portfolio in FY25, 6% now). Staff and other costs also fell as a share of a much larger revenue base. Q1FY27 was another record (gross margin 74.6%, EBITDA margin 30.0%), but management guides ~25% for the full year, which implies ~22-24% for the rest of FY27 as two new generics of Tolvaptan arrive and Mirabegron prices fall.' },
    { pair: [
      { type: 'line', title: 'Quarterly EBITDA margin peaked at 31% in Q2-Q3FY26', unit: 'EBITDA margin (%), company basis (excl. forex and other income, on product sales)', x: SQ.filter(q => q.ebitdaMarginPct).map(q => q.q), series: [{ name: 'EBITDA margin', values: SQ.filter(q => q.ebitdaMarginPct).map(q => q.ebitdaMarginPct), fmt: 'pct' }, { name: 'Gross margin', values: SQ.filter(q => q.ebitdaMarginPct).map(q => q.grossMarginPct), fmt: 'pct' }], labels: 'all', min: 15, max: 80, source: 'Company releases and calls' },
      { type: 'line', title: 'Material cost: 41% of revenue in FY23, 26% in FY26', unit: '% of revenue (Screener)', x: 'A.labels', from: 'FY17', series: [{ name: 'Material cost', ref: 'A.materialPct', fmt: 'pct' }, { name: 'Employee cost', ref: 'A.employeePct', fmt: 'pct' }], labels: 'last', min: 10, max: 45, source: 'Screener.in' },
    ] },
    { pair: [
      { type: 'column', title: 'US sales: USD282mn a quarter (Q1FY26) to USD371mn (Q4FY26)', unit: 'US sales (US$ mn); Q2-Q4FY27 = guidance midpoint', x: [...SQ.map(q => q.q), 'Q2-Q4FY27 guide'], series: [{ name: 'US', values: [...SQ.map(q => q.usUsd), 265], fmt: 'num' }], labels: 'all', highlight: 'Q2-Q4FY27 guide', source: 'Company releases; management: USD250-280mn a quarter (Q1FY27 call)' },
      { type: 'column', title: 'R&D: ~8% of sales, among the highest in Indian pharma', unit: 'R&D spend (₹ crore)', x: SQ.filter(q => q.rdCr).map(q => q.q), series: [{ name: 'R&D', values: SQ.filter(q => q.rdCr).map(q => q.rdCr), fmt: 'num' }], labels: 'all', source: 'Company releases and calls' },
    ] },
    { callout: '**Why we model {{F.ebitdaMargin.0|pct}} / {{F.ebitdaMargin.1|pct}} / {{F.ebitdaMargin.2|pct}}:** FY27E matches the ~25% guidance on product sales (Q2-Q4 ~24% after Q1\'s 30%). FY28E loses a full year of Tolvaptan pricing and faces broad Mirabegron entry from Sep-2027; the apixaban oral suspension, biosimilars and India/Europe scale offset part of it. Adjacent businesses (diagnostics, digital health, consumer, CDMO) still cost 100-150bp of margin and should move to breakeven. Each 1pp of FY28E margin is ~₹330 cr of EBITDA, ~5% of EPS.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Cash & returns', kicker: 'Capital allocation', title: 'Returns: ROE from −12% (FY22) to 27% (FY26); the windfall cash paid for VISUfarma',
  blocks: [
    { p: 'Lupin generated ₹13,982 cr of operating cash in FY24-26 and spent ₹4,666 cr on capex (including intangibles and the ₹711 cr Mirabegron licence) and ₹1,096 cr on dividends. The rest turned net debt of ₹2,527 cr (Mar-23) into net cash of ₹4,636 cr (Mar-26). In April 2026 ₹1,970 cr of it went on VISUfarma, a European eye-care company (enterprise value €190mn, €53mn revenue in 2025), so net cash was ₹2,831 cr in June. Return on equity was 26.9% in FY26 and the company\'s own ROCE 28.4%; we expect ROE to fall to ~15-18% as profit drops and cash builds.' },
    { pair: [
      { type: 'column', title: 'Operating cash flow vs capex', unit: '₹ crore (FY27E capex incl. VISUfarma ₹1,970 cr)', x: 'fin.labels', from: 'FY17', series: [{ name: 'Cash from operations', ref: 'fin.cfo', fmt: 'num' }, { name: 'Capex', ref: 'fin.capex', fmt: 'num' }], labels: 'none', source: SRC.est },
      { type: 'line', title: 'ROE: negative in FY22, 27% at the FY26 peak', unit: 'ROE (%)', x: 'fin.labels', from: 'FY17', series: [{ name: 'ROE', ref: 'fin.roe', fmt: 'pct' }], labels: 'all', min: -15, max: 30, source: SRC.est },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went (₹ crore)', head: ['', 'FY24', 'FY25', 'FY26', 'Three years'], rows: [
      ['Cash from operations (Screener)', '{{A.cfo.9|num}}', '{{A.cfo.10|num}}', '{{A.cfo.11|num}}', '13,982'],
      ['Capex incl. intangibles', '{{A.capex.9|num}}', '{{A.capex.10|num}}', '{{A.capex.11|num}}', '4,666'],
      ['Dividends', '{{A.dividendsPaid.9|num}}', '{{A.dividendsPaid.10|num}}', '{{A.dividendsPaid.11|num}}', '1,096'],
      { hl: true, cells: ['**Left over (before interest and treasury income)**', '**2,536**', '**953**', '**4,731**', '**8,220**'] },
      ['Memo: company net cash / (net debt) at year-end', '(477)', '310', '4,636', 'Jun-26: 2,831'],
    ], source: 'Screener.in cash flow; company press releases (net debt). FY24 capex is low because of a Screener classification; FY26 includes the Mirabegron prepaid licence.' } },
    { callout: '**The capital question:** Lupin will rebuild ~₹4,000 cr of cash a year on our numbers. Management wants specialty assets in ophthalmology, pulmonology and rare neurology (including clinical-stage ones), plus India innovation (Bofanglutide, a long-acting GLP-1 from Gan & Lee). Its record is mixed: Gavis (US, USD880mn in FY16) ended in impairments; VISUfarma is too new to judge. We model no further acquisitions and a 16% payout.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'Balance sheet: ₹10,600 cr of gross cash, ₹6,600 cr of debt; net cash ~₹4,000 cr',
  blocks: [
    { p: 'Lupin carries both cash and debt. At Mar-2026 it held ₹10,594 cr of cash, liquid funds and bank deposits (including ₹1,364 cr deposited against a US term loan) and owed ₹6,616 cr: US-dollar term loans at SOFR + 1.0-1.2%, short-term working-capital loans and ₹706 cr of leases. The company reports net cash of ₹4,636 cr (it leaves out leases); our model starts from ₹3,978 cr, the same gross cash less all borrowings including leases. Goodwill and other intangibles rose from ₹4,571 cr to ₹5,545 cr in FY26 (the Mirabegron licence, product rights) and will rise again with VISUfarma. Working capital improved: the company\'s operating working capital fell from 110 days of sales (Mar-25) to 87 days (Mar-26), then rose to 90 days in June as sales jumped.' },
    { pair: [
      { type: 'column', title: 'Net debt of ₹2,527 cr (FY23) became net cash of ₹4,636 cr (FY26)', unit: 'Company net cash (₹ crore; negative = net debt)', x: ['FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26', 'Jun-26'], series: [{ name: 'Net cash', values: [-663, -1923, -2527, -477, 310, 4636, 2831], fmt: 'num' }], labels: 'all', source: 'Company press releases' },
      { type: 'line', title: 'Working capital: inventory is the big item', unit: 'Days (Screener)', x: 'A.labels', from: 'FY17', series: [{ name: 'Inventory days', ref: 'A.inventoryDays', fmt: 'num' }, { name: 'Receivable days', ref: 'A.debtorDays', fmt: 'num' }, { name: 'Payable days', ref: 'A.payableDays', fmt: 'num' }], labels: 'last', source: 'Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-23', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth (owners)', '{{A.netWorth.8|num}}', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}'],
      ['Borrowings incl. leases', '{{A.borrowings.8|num}}', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}'],
      ['Cash and investments (Screener)', '{{A.cashAndInvestments.8|num}}', '{{A.cashAndInvestments.9|num}}', '{{A.cashAndInvestments.10|num}}', '{{A.cashAndInvestments.11|num}}'],
      { hl: true, cells: ['**Company gross cash (incl. earmarked deposits)**', '', '', '**5,412**', '**10,594**'] },
      ['Net fixed assets incl. goodwill and intangibles', '{{A.fixedAssets.8|num}}', '{{A.fixedAssets.9|num}}', '{{A.fixedAssets.10|num}}', '{{A.fixedAssets.11|num}}'],
    ], source: 'Screener.in; AR FY26 balance sheet and notes 10, 21, 25 (gross cash = current investments + cash + other bank balances + earmarked deposits).' } },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: the Gupta family at 46.9%, unchanged for years; mutual funds have been selling',
  blocks: [
    { pair: [
      { type: 'line', title: 'FIIs back to 22%; DIIs (mostly mutual funds) down to 25%', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoters: steady at ~47%, no pledge', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 40, max: 50, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY15–FY29E', rows: [
      { key: 'sales', name: 'Revenue from operations', flag: { type: 'pct', th: 12 }, hl: true }, { key: 'ebitda', name: 'EBITDA (excl. forex and other income)', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 300 } }, { key: 'dep', name: 'Depreciation, amortisation & impairment', flag: { type: 'pct', th: 30 } },
      { key: 'otherIncome', name: 'Other income (Screener: incl. forex, net of exceptional items)', flag: { type: 'pct', th: 60 } }, { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit (owners)', hl: true, flag: { type: 'pct', th: 30 } }, { key: 'eps', name: 'EPS (₹)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' }, { key: 'capex', name: 'Capex incl. intangibles (FY27E incl. VISUfarma)', flag: { type: 'pct', th: 60 } },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 15 }, hl: true }, { key: 'ebitda', name: 'EBITDA (Screener, incl. forex)' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' }, { key: 'otherIncome', name: 'Other income (net of exceptional items)' },
      { key: 'dep', name: 'Depreciation' }, { key: 'pat', name: 'Net profit (owners)', hl: true, yoy: true, flag: { type: 'pct', th: 30 } },
    ] } },
  ],
};

const statementNotes = {};
module.exports = { financials, margins, capital, balance, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  const B = fs.existsSync(path.join(__dirname, 'LUPIN.research.js')) ? require('./LUPIN.research') : null;
  const report = {
    symbol: 'LUPIN', listing: 'NSE: LUPIN · BSE: 500257', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Healthcare',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, margins, capital, balance, ownershipBase, statements }) : [financials, margins, capital, balance, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections, ${JSON.stringify(report).match(/"type":/g).length} chart/table exhibits`);
}
