// Authoring source for the Wockhardt initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated; profit attributable to owners, see
// WOCKPHARMA.patch.js). Part B (WOCKPHARMA.research.js + part2-6, shared WOCKPHARMA.ctx.js / ctx2.js) adds the research
// chapters, cover, rating and statement notes. Usage: node tools/authoring/WOCKPHARMA.js  (syncs the derived multiples first)
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'WOCKPHARMA', 'research');
const SRC = { co: 'Company filings, Screener.in (consolidated), GAM Research', est: 'Company, Screener.in, GAM Research estimates (FY27-29E)' };
const cr = v => Math.round(v).toLocaleString('en-IN');

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Twelve years in four acts: decline, a fire sale, survival, and a turnaround that is barely a year old',
  blocks: [
    { p: 'Wockhardt\'s revenue fell from ₹4,482 cr in FY15 to ₹2,651 cr in FY23 as USFDA import alerts (2013, 2016) shut it out of the US and it sold its best Indian brands to Dr Reddy\'s (2020) to pay lenders. It lost money before exceptional items and the sale gain in every year from FY17 to FY25; FY21\'s ₹686 cr "profit" was almost entirely the ₹1,470 cr pre-tax gain on that sale, booked in discontinued operations, while the remaining business lost ₹297 cr. Since FY24 the picture has changed: revenue grew 6%, 8% and 12%, the EBITDA margin rose from 3% (FY24) to 19% (FY26), and profit attributable to owners turned positive in FY26 (₹213 cr; ₹284 cr before ₹85 cr of exceptional charges). The quarterly turn came in Jul-Sep 2025: four profitable quarters in a row since, with Q1FY27 at ₹106 cr.' },
    { pair: [
      { type: 'column', title: 'Revenue: a decade of shrinkage, then three years of growth', unit: 'Revenue from operations (₹ crore); FY27-29E GAM', x: 'fin.labels', from: 'FY17', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num', growth: true }], source: SRC.est },
      { type: 'column', title: 'EPS: losses FY22-25 (FY21 is the Dr Reddy\'s sale gain)', unit: 'EPS, reported (₹; owners); FY27-29E GAM', x: 'fin.labels', from: 'FY17', series: [{ name: 'EPS', ref: 'fin.eps', fmt: 'n1' }], labels: 'all', source: SRC.est },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: from 3% in FY24 to 19% in FY26', unit: 'EBITDA margin (%, Screener basis; R&D mostly capitalised); FY27-29E GAM', x: 'fin.labels', from: 'FY17', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: -5, max: 25, source: SRC.est },
      { type: 'column', title: 'Quarterly profit: the turn came in the Sep-2025 quarter', unit: 'Net profit to owners (₹ crore; Screener, incl. exceptional items)', x: 'Q.labels', series: [{ name: 'Net profit', ref: 'Q.pat', fmt: 'num' }], labels: 'all', highlight: 'Q2FY26', source: 'Screener.in (consolidated, after minorities)' },
    ] },
    { callout: '**Our view:** the turnaround is real but young and narrow. FY26 profit before exceptional items was ₹284 cr on ₹3,373 cr of revenue; the margin gain came from exiting loss-making US generics, cheaper materials (33.6% of sales vs 41.6% in FY24) and insulin volumes in emerging markets. Our FY27E EPS (₹{{F.eps.0|n1}}) is roughly Q1FY27 annualised less Zaynich launch costs; FY28E (₹{{F.eps.1|n1}}) barely grows because Zaynich adds amortisation and launch losses before it adds profit; FY29E (₹{{F.eps.2|n1}}) is the first year Zaynich pays.' },
  ],
};

const margins = {
  id: 'margins', nav: 'Margins', kicker: 'Profitability', title: 'Margins: 19-21% now, but reported EBITDA leaves out most of the R&D bill',
  blocks: [
    { p: 'The company\'s EBITDA margin was 20.2% in Q1FY27 (₹188 cr) and 18.7% in FY26 (₹630 cr; Screener\'s basis 19.3%). Three things drove the rise from 5.4% in FY23: the exit from US generics (FY25 US revenue US$11mn, loss-making), lower material costs as insulin and UK injectables replaced low-margin lines, and about 50 cost projects. But the margin flatters the business in one important way: of an R&D spend of ~10% of revenue in FY26, only ₹120 cr (3.6%) went through the P&L; the rest (~₹215 cr) was capitalised as NCE development, building a ₹1,708 cr intangible under development (₹1,055 cr for Zaynich). That cost comes back as amortisation once the drugs launch. Quarterly margins also swing with emerging-market insulin tenders (23% in Q4FY26, 21% in Q1FY27).' },
    { pair: [
      { type: 'line', title: 'Quarterly EBITDA margin: 10% to 23% in a year', unit: 'EBITDA margin (%, Screener)', x: 'Q.labels', series: [{ name: 'EBITDA margin', ref: 'Q.opm', fmt: 'pct' }], labels: 'all', min: -10, max: 30, source: 'Screener.in' },
      { type: 'line', title: 'Material and staff cost as a share of revenue', unit: '% of revenue (Screener)', x: 'A.labels', from: 'FY17', series: [{ name: 'Material cost', ref: 'A.materialPct', fmt: 'pct' }, { name: 'Employee cost', ref: 'A.employeePct', fmt: 'pct' }], labels: 'last', min: 15, max: 50, source: 'Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'R&D: what is expensed and what is capitalised (₹ crore)', head: ['', 'FY25', 'FY26', 'Q1FY27'], rows: [
      ['EBITDA before R&D (company)', '537', '751', '222'], ['R&D expensed', '119', '120', '34'], ['EBITDA (company)', '418', '630', '188'],
      ['Total R&D, % of revenue (AR MD&A)', 'n.d.', '~10%', 'n.d.'],
      ['Intangible assets under development at year-end', cr(1520), cr(1708), 'n.d.'],
      ['  of which Zaynich (WCK 5222) / Foviscu (WCK 4282) / Miqnaf (WCK 4873)', '848 / 312 / 272', '1,055 / 350 / 201', ''],
    ], source: 'Company press releases (4-May-2026, 10-Aug-2026); AR FY26 note 6 and MD&A' } },
    { callout: '**Why we model {{F.ebitdaMargin.0|pct}} / {{F.ebitdaMargin.1|pct}} / {{F.ebitdaMargin.2|pct}}:** the base business (everything except Zaynich) rises from 21.3% to 22.3% as biosimilars and India branded grow fastest; Zaynich costs ₹60 cr (FY27E) and ₹45 cr (FY28E) of EBITDA before it earns ₹100 cr in FY29E. So the group margin is flat for two years. Each 1pp of FY28E margin is ~₹45 cr of EBITDA, ~10% of FY28E EPS.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Cash & returns', kicker: 'Capital allocation', title: 'Cash: positive operating cash flow in only three of the last six years; shareholders funded the gap',
  blocks: [
    { p: 'Operating cash flow was −₹287 cr in FY21, ₹413 cr in FY22, ₹153 cr in FY23, ₹219 cr in FY24, −₹22 cr in FY25 and ₹390 cr in FY26; capex (including capitalised NCE development) ran at ₹166-365 cr a year. The shortfall, debt repayment and the antibiotic programme were paid for by selling assets (the India brands, ₹1,850 cr in 2020) and by shareholders: a ₹748 cr rights issue (FY22), a ₹468 cr QIP (Mar-2024) and a ₹1,000 cr QIP (Nov-2024 at ₹1,105). The share count rose from 11.1 cr to 16.2 cr. Working capital is heavy: inventory days rose to 286 in FY26 as insulin and UK volumes grew. Returns are still thin: ROE was 4.6% in FY26 and we forecast {{F.roe.1|pct}} in FY28E.' },
    { pair: [
      { type: 'column', title: 'Operating cash flow vs capex', unit: '₹ crore (capex incl. capitalised NCE development)', x: 'fin.labels', from: 'FY17', series: [{ name: 'Cash from operations', ref: 'fin.cfo', fmt: 'num' }, { name: 'Capex', ref: 'fin.capex', fmt: 'num' }], labels: 'none', source: SRC.est },
      { type: 'line', title: 'ROE: negative for four years, single digits ahead', unit: 'ROE (%)', x: 'fin.labels', from: 'FY17', series: [{ name: 'ROE', ref: 'fin.roe', fmt: 'pct' }], labels: 'all', min: -20, max: 25, source: SRC.est },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash came from and went, FY22-FY26 (₹ crore)', head: ['', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26', 'Five years'], rows: [
      ['Cash from operations', '{{A.cfo.7|num}}', '{{A.cfo.8|num}}', '{{A.cfo.9|num}}', '{{A.cfo.10|num}}', '{{A.cfo.11|num}}', '1,153'],
      ['Capex (incl. NCE development)', '{{A.capex.7|num}}', '{{A.capex.8|num}}', '{{A.capex.9|num}}', '{{A.capex.10|num}}', '{{A.capex.11|num}}', '1,366'],
      ['Equity raised (rights issue, QIPs)', '748', '–', '468', '983', '–', '2,199'],
      ['Interest paid', '190', '242', '197', '164', '195', '988'],
      { hl: true, cells: ['**Operating cash flow less capex and interest**', '**11**', '**(298)**', '**(194)**', '**(551)**', '**(169)**', '**(1,201)**'] },
    ], source: 'Screener.in cash flow (interest paid, proceeds from shares); GAM Research' } },
    { callout: '**The capital question:** the antibiotic bet consumed more than ₹2,000 cr of capex over FY19-26 (ICRA) and ~US$800mn over 25 years (chairman). Management says no acquisitions are needed and capex will be ₹200-300 cr a year, but an enabling resolution for up to ₹3,000 cr of new equity was put to the August 2026 AGM, after unused enablers of ₹2,000 cr (2025). We model no new shares; a raise at ₹2,100 would add ~9% to the share count.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & debt', kicker: 'Balance sheet', title: 'Debt: down from ₹3,582 cr (FY20) to ₹2,233 cr, but ~₹950 cr of it is owed to the promoters',
  blocks: [
    { p: 'Borrowings peaked at ₹4,160 cr in FY17 and were ₹3,582 cr in FY20; the Dr Reddy\'s sale, the rights issue and the QIPs brought them to ₹2,021 cr (FY25). They rose again to ₹2,233 cr in FY26 as Wockhardt replaced working-capital lines with NBFC term loans (Tata Capital ₹334 cr at 10.55%, Axis Finance ₹182 cr at 11.25%), secured partly by pledged promoter shares. About ₹950 cr of the debt is lent by promoter entities at 5.9-12.3%, repayable by 20-Jun-2027 with an option to renew; the company quotes net debt/equity of 0.1 "excluding promoter debt". Liquid funds were ₹662 cr at Mar-26 (₹467 cr free, ICRA). ICRA upgraded the rating to A- (Stable) in May 2026: total debt/OPBDITA 3.4x, interest cover 3.1x. External repayments are ₹171 cr (FY27) and ₹198 cr (FY28).' },
    { pair: [
      { type: 'column', title: 'Borrowings: halved from the FY17 peak', unit: 'Borrowings incl. leases and promoter loans (₹ crore)', x: ['FY17', 'FY18', 'FY19', 'FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'], series: [{ name: 'Borrowings', values: [4160, 3748, 3375, 3582, 2674, 2198, 2184, 2356, 2021, 2233], fmt: 'num' }], labels: 'all', source: 'Screener.in (consolidated)' },
      { type: 'line', title: 'Working capital: inventory days at 286', unit: 'Days (Screener)', x: 'A.labels', from: 'FY17', series: [{ name: 'Inventory days', ref: 'A.inventoryDays', fmt: 'num' }, { name: 'Receivable days', ref: 'A.debtorDays', fmt: 'num' }, { name: 'Payable days', ref: 'A.payableDays', fmt: 'num' }], labels: 'last', source: 'Screener.in (inventory and payable days on cost of materials)' },
    ] },
    { exhibit: { type: 'table', title: 'From reported borrowings to our model\'s opening net debt (Mar-26, ₹ crore)', head: ['', '₹ crore', 'Source'], rows: [
      ['Borrowings (incl. ₹108 cr leases)', cr(2233), 'AR FY26 notes 18, 22, 36'], ['  of which loans from promoter entities', '~950', 'ICRA (21-May-2026); ₹748 cr non-current, note 18.3'],
      ['Less: cash and bank', `(${cr(250)})`, 'Balance sheet'], ['Less: current investments (QIP money in funds)', `(${cr(412)})`, 'Balance sheet'],
      ['Add: 14.15% minority in Wockhardt Bio AG (at book)', cr(341), 'Note 42'], ['Less: net deferred tax assets (incl. ₹196 cr MAT credit)', `(${cr(440)})`, 'Note 9'], ['Less: assets held for sale', `(${cr(91)})`, 'Note 40'],
      { hl: true, cells: ['**Model opening net debt**', `**${cr(1381)}**`, 'Engine: 2,233 − 250 − 412 − 190'] },
    ], source: 'AR FY26; ICRA; GAM Research' } },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-23', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth (owners)', '{{A.netWorth.8|num}}', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}'],
      ['Borrowings incl. leases', '{{A.borrowings.8|num}}', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}'],
      ['Cash and investments', '{{A.cashAndInvestments.8|num}}', '{{A.cashAndInvestments.9|num}}', '{{A.cashAndInvestments.10|num}}', '{{A.cashAndInvestments.11|num}}'],
      ['Net fixed assets incl. goodwill and intangibles', '{{A.fixedAssets.8|num}}', '{{A.fixedAssets.9|num}}', '{{A.fixedAssets.10|num}}', '{{A.fixedAssets.11|num}}'],
      ['CWIP incl. intangibles under development', '{{A.cwip.8|num}}', '{{A.cwip.9|num}}', '{{A.cwip.10|num}}', '{{A.cwip.11|num}}'],
    ], source: 'Screener.in (consolidated)' } },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: the Khorakiwala family at 49.1% (down from 74% in 2017), with 18.8% of its shares pledged',
  blocks: [
    { pair: [
      { type: 'line', title: 'Domestic funds arrived with the QIPs; foreign investors ~7%', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoters: diluted by the fund-raises, now 49.1%', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 40, max: 60, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY15–FY29E (owners\' share; FY27-29E GAM)', rows: [
      { key: 'sales', name: 'Revenue from operations', flag: { type: 'pct', th: 12 }, hl: true }, { key: 'ebitda', name: 'EBITDA', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 300 } }, { key: 'dep', name: 'Depreciation (FY27-29E excl. Zaynich amortisation)', flag: { type: 'pct', th: 25 } },
      { key: 'otherIncome', name: 'Other income (Screener: net of exceptional items)', flag: { type: 'pct', th: 80 } }, { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit (owners)', hl: true, flag: { type: 'pct', th: 50 } }, { key: 'eps', name: 'EPS (₹)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' }, { key: 'capex', name: 'Capex (incl. NCE development)', flag: { type: 'pct', th: 50 } },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 15 }, hl: true }, { key: 'ebitda', name: 'EBITDA (Screener)' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' }, { key: 'otherIncome', name: 'Other income (net of exceptional items)' },
      { key: 'dep', name: 'Depreciation' }, { key: 'pat', name: 'Net profit (owners)', hl: true, yoy: true, flag: { type: 'pct', th: 50 } },
    ] } },
  ],
};

module.exports = { financials, margins, capital, balance, ownershipBase, statements, RD };

if (require.main === module) {
  require('./WOCKPHARMA.mult').syncMult();
  const B = fs.existsSync(path.join(__dirname, 'WOCKPHARMA.research.js')) ? require('./WOCKPHARMA.research') : null;
  const report = {
    symbol: 'WOCKPHARMA', listing: 'NSE: WOCKPHARMA · BSE: 532300', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Healthcare',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, margins, capital, balance, ownershipBase, statements }) : [financials, margins, capital, balance, ownershipBase, statements],
    statementNotes: { ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections, ${JSON.stringify(report).match(/"type":/g).length} chart/table exhibits`);
}
