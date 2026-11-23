// Authoring source for the Aurobindo Pharma initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated; profit attributable to owners, see
// AUROPHARMA.patch.js). Part B (AUROPHARMA.research.js + part2-7, shared AUROPHARMA.ctx.js) adds the research chapters,
// cover, rating and statement notes. Usage: node tools/authoring/AUROPHARMA.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'AUROPHARMA', 'research');
const MD = path.join(__dirname, '..', '..', 'data', 'models', 'AUROPHARMA.json');
const SRC = { co: 'Company filings, Screener.in (consolidated), GAM Research', est: 'Company, GAM Research estimates' };
const SG = JSON.parse(fs.readFileSync(path.join(RD, 'segments.json'), 'utf8'));
const A = JSON.parse(fs.readFileSync(MD, 'utf8')).annual;
const SA = SG.annual, SQ = SG.quarterly;
const n0 = v => Math.round(v).toLocaleString('en-IN');
const ix = fy => A.labels.indexOf(fy);
const sum3 = k => ['FY24', 'FY25', 'FY26'].reduce((s, y) => s + (A[k][ix(y)] || 0), 0);
const left = y => A.cfo[ix(y)] - A.capex[ix(y)] - (A.acquisitions[ix(y)] || 0) - (A.dividendsPaid[ix(y)] || 0);
const BUYBACK = { FY24: 0, FY25: 930, FY26: 0 }; // Jul-2024 buyback Rs750 cr + buyback tax and costs (AR FY26 note 44B; ICICI Direct cash flow)

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Revenue up 8% a year since FY19; EPS only 6%, with a deep dip in FY23',
  blocks: [
    { p: 'Aurobindo\'s revenue grew from ₹19,564 cr in FY19 to ₹33,653 cr in FY26 (8% a year), as Europe was built by acquisition, injectables grew and the US kept adding products. Profit grew more slowly. EPS before exceptional items went from ₹41.5 to ₹61.3 (6% a year): margins fell from 21% to 15% in FY23, when US prices collapsed, Eugia\'s injectable plants ran into FDA trouble and raw-material costs spiked, and depreciation nearly doubled from FY20 as the company built new plants. FY21\'s reported EPS of ₹91 is inflated by the ₹2,815 cr gain on selling Natrol, its US vitamins business. In FY24-25 a generic version of Revlimid (lenalidomide), sold under volume limits, helped US profits; it faded through FY26, when reported revenue grew 6% but 9.5% excluding it.' },
    { pair: [
      { type: 'column', title: 'Revenue: 8% a year since FY19; +17% in FY27E on the rupee and Lannett', unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY17', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num', growth: true }], source: SRC.est },
      { type: 'column', title: 'EPS: the Natrol gain in FY21, the FY23 slump, then a steady climb', unit: 'EPS, reported (₹)', x: 'fin.labels', from: 'FY17', series: [{ name: 'EPS', ref: 'fin.eps', fmt: 'n1' }], labels: 'all', source: SRC.est },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: 15% in FY23, back to ~20-21% since FY24', unit: 'EBITDA margin excl. other income (%)', x: 'fin.labels', from: 'FY17', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 10, max: 26, source: SRC.est },
      { type: 'stacked', title: 'Europe has grown fastest: 26% of revenue in FY23, 31% in FY26', unit: 'Revenue by business (₹ crore)', x: SA.map(a => a.fy), series: [{ name: 'US', values: SA.map(a => a.us), fmt: 'num' }, { name: 'Europe', values: SA.map(a => a.europe), fmt: 'num' }, { name: 'Growth Markets + ARV', values: SA.map(a => a.gm + a.arv), fmt: 'num' }, { name: 'APIs', values: SA.map(a => a.api + (a.other || 0)), fmt: 'num' }], minLabel: 2500, source: 'Company Q4 presentations (APIs incl. Puerto Rico in FY24-25)' },
    ] },
    { callout: '**Our view:** Aurobindo is a volume business that grows high single digits in rupees and earns ~20% EBITDA margins in a normal year. FY27E looks better than it is: of our 17% revenue growth, roughly 6 points are the weaker rupee and 5 points Lannett. Our FY29E EPS of ₹{{F.eps.2|n1}} (engine share count) implies 17% a year from FY26, mostly in FY27.' },
  ],
};

const margins = {
  id: 'margins', nav: 'Margins', kicker: 'Profitability', title: 'Margins: gross margin at a record 60-61%, but staff costs eat most of it',
  blocks: [
    { p: 'Gross margin (revenue less materials) rose from 58.8% in Q1FY26 to 61.3% in Q4FY26 and 60.4% in Q1FY27, its best levels in five years: the company now makes its own penicillin intermediates (Pen-G and 6-APA) instead of importing them from China, ships more of Europe\'s products from its own plants in India and China, and sells more injectables. But employee cost rose from 14.2% of revenue (Q1FY25) to 16.2% (Q1FY27) as new plants were staffed (Pen-G, China, biosimilars, US sites), and the Pen-G plant uses a lot of power. The result is an EBITDA margin that has sat at 20-21% for nine quarters.' },
    { pair: [
      { type: 'line', title: 'Quarterly EBITDA margin stuck at 20-21%; gross margin rising', unit: 'Company basis (%)', x: SQ.map(q => q.q), series: [{ name: 'EBITDA margin', values: SQ.map(q => q.ebitdaMarginPct), fmt: 'pct' }, { name: 'Gross margin', values: SQ.map(q => q.grossMarginPct), fmt: 'pct' }], labels: 'all', min: 15, max: 65, source: 'Company presentations; ICICI Direct quarterly table (6-Aug-2026)' },
      { type: 'waterfall', title: 'FY26 to FY27E: Pen-G, China and lower R&D lift the margin ~0.6pp', unit: 'EBITDA margin (%) and change (pp); GAM estimates', x: ['FY26', 'Lower R&D (4.7% -> 3.8%)', 'Pen-G and China turn profitable', 'gRevlimid gone, price erosion, Eugia, Lannett start-up', 'FY27E'], series: [{ name: 'pp', values: [20.4, 0.9, 1.0, -1.3, 21.0], fmt: 'n1' }], fmt: 'n1', totalFmt: 'pct', min: 0, max: 25, source: 'Company (FY26 R&D Rs1,590 cr; FY27 guidance Rs1,450-1,500 cr; Pen-G FY26 EBITDA loss Rs200 cr+; China FY26 loss ~US$7mn); GAM estimates' },
    ] },
    { pair: [
      { type: 'line', title: 'Employee cost: 14% of revenue in FY25, 15.4% in FY26', unit: 'Employee cost as % of revenue (Screener)', x: 'A.labels', from: 'FY17', series: [{ name: 'Employee cost %', ref: 'A.employeePct', fmt: 'pct' }], labels: 'all', min: 8, max: 18, source: 'Screener.in' },
      { type: 'line', title: 'Gross margin: 54.6% in FY23, 59.9% in FY26', unit: 'Gross margin (%), Screener (revenue less materials)', x: 'A.labels', from: 'FY17', series: [{ name: 'Gross margin', ref: 'A.grossMargin', fmt: 'pct' }], labels: 'all', min: 45, max: 65, source: 'Screener.in' },
    ] },
    { callout: '**Why we model 21.0% for FY27 and 21.5% after, not 22-23%:** management guides "north of 21%" and EBITDA above ₹8,000 cr for FY27; we take 21.0% (₹{{F.ebitda.0|num}} cr). From FY28 Lannett\'s synergies (fewer staff, cheaper procurement, filling a plant that runs at ~40%) and a full year of Pen-G and China profits add ~50bp. We do not go to ICICI Direct\'s 22.3% for FY28 because two of Eugia\'s injectable plants cannot get new US approvals and US prices keep falling on old products. Each 1pp of FY28E margin is ~₹430 cr of EBITDA, ~6% of EPS.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capex & returns', kicker: 'Capital allocation', title: 'Capital allocation: ₹3,000 cr of capex a year, ROE stuck near 11%',
  blocks: [
    { p: `Over FY24-26 Aurobindo generated ₹${n0(sum3('cfo'))} cr of operating cash and spent ₹${n0(sum3('capex'))} cr on capex: the Pen-G plant (₹3,058 cr), the Taizhou plant in China, biosimilar and biologics capacity (CuraTeQ, TheraNym), US plants (Dayton, Raleigh) and new injectable lines. It returned ₹${n0(sum3('dividendsPaid'))} cr as dividends and ₹930 cr through the Jul-2024 buyback (incl. tax), and ₹800 cr more through the Apr-May 2026 buyback. In Q1FY27 it paid US$247mn for Lannett. Return on equity was ${A.roe[ix('FY24')].toFixed(1)}%, ${A.roe[ix('FY25')].toFixed(1)}% and ${A.roe[ix('FY26')].toFixed(1)}% in FY24-26: below a ~12% cost of equity. The new plants are only now starting to earn.` },
    { pair: [
      { type: 'column', title: 'Operating cash flow vs capex: capex absorbed most of it until FY26', unit: '₹ crore', x: 'A.labels', from: 'FY17', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }], labels: 'none', source: SRC.co },
      { type: 'line', title: 'ROE and ROCE: from 25%+ before FY20 to ~10-14%', unit: '%', x: 'A.labels', from: 'FY17', series: [{ name: 'ROE', ref: 'A.roe', fmt: 'pct' }, { name: 'ROCE (Screener)', ref: 'A.roce', fmt: 'pct' }], labels: 'last', min: 0, max: 30, source: 'Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went (₹ crore)', head: ['', 'FY24', 'FY25', 'FY26', 'Three years'], rows: [
      ['Cash from operations (Screener)', '{{A.cfo.9|num}}', '{{A.cfo.10|num}}', '{{A.cfo.11|num}}', n0(sum3('cfo'))],
      ['Capex incl. intangibles', '{{A.capex.9|num}}', '{{A.capex.10|num}}', '{{A.capex.11|num}}', n0(sum3('capex'))],
      ['Acquisitions (Screener line)', '{{A.acquisitions.9|num}}', '{{A.acquisitions.10|num}}', '{{A.acquisitions.11|num}}', n0(sum3('acquisitions'))],
      ['Dividends', '{{A.dividendsPaid.9|num}}', '{{A.dividendsPaid.10|num}}', '{{A.dividendsPaid.11|num}}', n0(sum3('dividendsPaid'))],
      { hl: true, cells: ['**Left over before buybacks and treasury income**', `**${n0(left('FY24'))}**`, `**${n0(left('FY25'))}**`, `**${n0(left('FY26'))}**`, `**${n0(left('FY24') + left('FY25') + left('FY26'))}**`] },
      ['Buyback incl. tax (Jul-2024; the Apr-May 2026 buyback of ₹800 cr falls in FY27)', '0', n0(BUYBACK.FY25), '0', n0(BUYBACK.FY25)],
      ['Memo: company net cash incl. investments, year-end', '149', '359', '3,002', ''],
    ], source: 'Screener.in cash flow; company presentations (net cash); AR FY26 note 44B (buyback). The Khandelwal brands (₹325 cr, Jan-2026) do not show in Screener\'s acquisitions line.' } },
    { callout: '**The capital question:** management says the platforms built over the past decade (Pen-G, China, biosimilars, the MSD contract plant, US manufacturing) are "transitioning from an investment phase to a monetisation phase". The numbers have to show it: we model ROE of {{F.roe.0|pct}} / {{F.roe.1|pct}} / {{F.roe.2|pct}} for FY27-29E, still below the cost of equity, with capex falling to ~5.5% of revenue by FY29E. A large acquisition (it bid up to US$5.5bn for Zentiva in 2025) would reset that clock.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'Balance sheet: cash and debt of ~₹8,500 cr each; working capital is the weak spot',
  blocks: [
    { p: 'Aurobindo runs gross cash and gross debt side by side: at Jun-2026 it held ₹8,790 cr of cash and investments and ₹8,393 cr of debt, mostly foreign-currency working-capital and term loans (₹6,709 cr of ₹7,673 cr at Mar-2026; packing credit at 2.2-4.4%), so net cash was only ₹397 cr (US$42mn) after paying for Lannett (US$247mn) and the buyback (US$85mn). The average cost of debt was 4.8% in Q1FY27. The real drag is working capital: inventory was ₹12,053 cr at Mar-2026, 326 days of material cost (Screener), as the company stocks thousands of products for many markets and builds inventory for launches; receivables rose to 77 days.' },
    { pair: [
      { type: 'column', title: 'Net cash: ₹3,000 cr at Mar-26, ~₹400 cr after Lannett and the buyback', unit: 'Company net cash incl. investments (₹ crore)', x: ['Mar-22', 'Mar-23', 'Mar-24', 'Mar-25', 'Mar-26', 'Jun-26'], series: [{ name: 'Net cash', values: [2523, 1591, 149, 359, 3002, 397], fmt: 'num' }], labels: 'all', source: 'Company presentations (debt profile)' },
      { type: 'line', title: 'Inventory days above 300 again', unit: 'Days (Screener)', x: 'A.labels', from: 'FY17', series: [{ name: 'Inventory days', ref: 'A.inventoryDays', fmt: 'num' }, { name: 'Receivable days', ref: 'A.debtorDays', fmt: 'num' }, { name: 'Payable days', ref: 'A.payableDays', fmt: 'num' }], labels: 'last', source: 'Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-23', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth (owners)', '{{A.netWorth.8|num}}', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}'],
      ['Borrowings incl. leases (Screener)', '{{A.borrowings.8|num}}', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}'],
      ['Cash and investments (Screener)', '{{A.cashAndInvestments.8|num}}', '{{A.cashAndInvestments.9|num}}', '{{A.cashAndInvestments.10|num}}', '{{A.cashAndInvestments.11|num}}'],
      { hl: true, cells: ['**Company gross debt / gross cash**', '**4,862 / 6,453**', '**6,318 / 6,467**', '**7,948 / 8,307**', '**7,673 / 10,676**'] },
      ['Net fixed assets incl. intangibles', '{{A.fixedAssets.8|num}}', '{{A.fixedAssets.9|num}}', '{{A.fixedAssets.10|num}}', '{{A.fixedAssets.11|num}}'],
      ['Capital work in progress', '{{A.cwip.8|num}}', '{{A.cwip.9|num}}', '{{A.cwip.10|num}}', '{{A.cwip.11|num}}'],
    ], source: 'Screener.in; Q4FY26 presentation (company debt and cash). Screener counts leases and strategic investments; the company figures do not.' } },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: the founding families hold 52%, 7% of the company is pledged',
  blocks: [
    { pair: [
      { type: 'line', title: 'Indian funds now own more than foreign investors', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoters: steady at ~51.8-51.9%', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 45, max: 55, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY15–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 12 }, hl: true }, { key: 'ebitda', name: 'EBITDA', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 200 } }, { key: 'dep', name: 'Depreciation & amortisation', flag: { type: 'pct', th: 30 } },
      { key: 'otherIncome', name: 'Other income (Screener: net of exceptional items, incl. forex)', flag: { type: 'pct', th: 40 } }, { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit (owners)', hl: true, flag: { type: 'pct', th: 25 } }, { key: 'eps', name: 'EPS (₹, FY26 share count)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' }, { key: 'capex', name: 'Capex incl. intangibles (FY27E incl. Lannett)', flag: { type: 'pct', th: 60 } },
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
  // keep the derived values in assumptions.json in sync (multiples, other income); rebuild the model after a change
  const { changed } = require('./AUROPHARMA.mult').syncMult();
  if (changed) console.log('AUROPHARMA: assumptions changed; run node src/model.js AUROPHARMA, then this script again.');
  const B = fs.existsSync(path.join(__dirname, 'AUROPHARMA.research.js')) ? require('./AUROPHARMA.research') : null;
  const report = {
    symbol: 'AUROPHARMA', listing: 'NSE: AUROPHARMA · BSE: 524804', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Healthcare',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, margins, capital, balance, ownershipBase, statements }) : [financials, margins, capital, balance, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections, ${JSON.stringify(report).match(/"type":/g).length} chart/table exhibits`);
}
