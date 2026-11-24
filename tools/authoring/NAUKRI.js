// Authoring source for the Info Edge (India) initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener consolidated, Net Profit on the attributable basis
// after minorities via NAUKRI.patch.js; standalone segments from the annual reports and the Q1FY27 data sheet). Part B
// (NAUKRI.research.js, merging NAUKRI.part2-6.js on the shared NAUKRI.ctx.js) adds the research chapters. NAUKRI.val.js
// first syncs the derived SOTP parts into assumptions.json. Usage: node tools/authoring/NAUKRI.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'NAUKRI', 'research');
const SG = JSON.parse(fs.readFileSync(path.join(RD, 'segments.json'), 'utf8'));
const CO = JSON.parse(fs.readFileSync(path.join(RD, 'company.json'), 'utf8'));
const S5 = CO.standalone, FYS = S5.years, n0 = v => Math.round(v).toLocaleString('en-IN');
const SA = SG.annual, ann = fy => SA.find(a => a.fy === fy);
const SRC = { co: 'Company filings, Screener.in (consolidated; profit attributable to Info Edge shareholders), GAM Research', sa: 'Info Edge annual reports FY23, FY24, FY26 (standalone segment notes and P&L), GAM Research' };
const opPbt = SA.map(a => a.saOpPbt), saRev = SA.map(a => a.saRev);
const fcfSum = 702 + 876 + 1076; // consolidated CFO FY24-26 (Screener)

const financials = {
  id: 'trajectory', nav: 'Financials', kicker: 'Financials', title: 'The operating business doubled in four years; reported profit is mostly fair-value gains',
  blocks: [
    { p: `Info Edge's standalone business (Naukri, 99acres, Jeevansathi, Shiksha) grew revenue from ₹${n0(saRev[0])} cr in FY22 to ₹${n0(saRev[4])} cr in FY26 (${Math.round((Math.pow(saRev[4] / saRev[0], 1 / 4) - 1) * 100)}% a year) and operating profit before other income from ₹${n0(opPbt[0])} cr to ₹${n0(opPbt[4])} cr (${Math.round((Math.pow(opPbt[4] / opPbt[0], 1 / 4) - 1) * 100)}% a year). Almost all of it is Recruitment: its segment result was ₹${n0(ann('FY26').recRes)} cr in FY26, more than the whole standalone operating profit, because 99acres still lost ₹${n0(-ann('FY26').reRes)} cr. Reported consolidated profit tells a different and misleading story: ₹12,760 cr in FY22 (the Zomato listing gain), a loss in FY23 (write-downs), ₹1,450 cr in FY26. It swings with fair-value gains on the venture funds, write-offs of start-ups and the losses of consolidated subsidiaries. Standalone EPS before exceptional items, the number management reports, rose from ₹${S5.epsPreExc[0]} (FY22) to ₹${S5.epsPreExc[4]} (FY26), 24% a year.` },
    { pair: [
      { type: 'stacked', title: 'Recruitment is three-quarters of standalone revenue', unit: 'Standalone revenue (₹ crore)', x: FYS, series: [{ name: 'Recruitment', values: SA.map(a => a.recRev), fmt: 'num' }, { name: '99acres', values: SA.map(a => a.reRev), fmt: 'num' }, { name: 'Jeevansathi + Shiksha', values: SA.map(a => a.othRev), fmt: 'num' }], minLabel: 150, source: SRC.sa },
      { type: 'column', title: 'Segment results: Recruitment earns it all; 99acres is reaching break-even', unit: 'Segment result (₹ crore)', x: FYS, series: [{ name: 'Recruitment', values: SA.map(a => Math.round(a.recRes)), fmt: 'num' }, { name: '99acres', values: SA.map(a => Math.round(a.reRes)), fmt: 'num' }, { name: 'Jeevansathi + Shiksha', values: SA.map(a => Math.round(a.othRes)), fmt: 'num' }], labels: 'none', source: SRC.sa },
    ] },
    { pair: [
      { type: 'column', title: 'Standalone EPS before exceptional items: +24% a year FY22-26', unit: 'EPS (₹, post-split)', x: FYS, series: [{ name: 'Standalone EPS before exceptional items', values: S5.epsPreExc, fmt: 'n1' }], labels: 'all', source: 'Info Edge AR FY26 (five-year chart)' },
      { type: 'column', title: 'Reported consolidated EPS swings with fair-value gains', unit: 'Consolidated EPS after minorities (₹)', x: 'fin.labels', from: 'FY22', series: [{ name: 'EPS', ref: 'fin.eps', fmt: 'n1' }], labels: 'all', source: 'Screener.in; GAM estimates FY27-29E (no fair-value gains)' },
    ] },
    { callout: '**So what:** judge Info Edge on two things, not on its consolidated P/E (54x trailing on 30-Sep-2026, on profit that includes fair-value gains): (1) what the operating businesses, above all Naukri, earn and are worth, and (2) what the market pays for the Eternal and PB Fintech stakes, which were 56% of its market value on 30-Sep-2026. The rest of the report is built around those two questions.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capital allocation', kicker: 'Capital allocation', title: 'A cash machine that funds venture bets: two of them made the company\'s fortune',
  blocks: [
    { p: `Naukri needs almost no capital: customers pay up front (deferred revenue ₹${n0(S5.deferredRevenue[4])} cr at Mar-26), capex is ~₹80 cr a year and consolidated operating cash flow was ₹${n0(fcfSum)} cr over FY24-26. Info Edge has used that cash in three ways. (1) **Venture investing**: early stakes in Zomato (cost ₹146 cr) and Policybazaar (cost ₹568 cr) are worth ₹38,386 cr and ₹6,116 cr at 30-Sep-2026 closes; about 135 other start-ups (~₹4,900 cr invested including other investors' money in its AIFs) are worth much less, and ₹673 cr had been written off or provided for by Mar-2023. (2) **Building verticals**: 99acres lost money in every year from FY22 to FY26 while it bought market leadership. (3) **Dividends**: ₹8.40 a share for FY26 (49% of standalone EPS). The cash pile (₹${n0(S5.cashInclWos[4])} cr at Mar-26, incl. ₹1,007 cr of unused 2020 QIP money) keeps growing.` },
    { exhibit: { type: 'table', title: 'Where the value came from (₹ crore)', head: ['Item', 'Cost / invested', 'Value on 30-Sep-2026', 'Comment'], rows: [
      ['Eternal (Zomato), 12.43%', '146', '38,386', '119.96 cr shares × ₹320; Info Edge sold 4.93 cr shares in the 2021 IPO for ₹375 cr'],
      ['PB Fintech (Policybazaar), 12.12%', '568', '6,116', '5.75 cr shares × ₹1,063.90'],
      ['Other start-ups and AIF portfolios (Info Edge share)', '–', '2,828', 'At book (AR FY26); ₹673 cr written off or provided for by Mar-2023'],
      ['Cash incl. wholly owned subsidiaries', '–', n0(CO.q1fy27.standalone.cash), 'Jun-2026; bank deposits and debt funds'],
    ], source: 'Info Edge AR FY23 and FY26, Q1FY27 deck (cost of listed stakes), NSE closes on 30-Sep-2026' } },
    { pair: [
      { type: 'column', title: 'Cash keeps building: ₹4,963 cr at Mar-2026', unit: '₹ crore, incl. wholly owned subsidiaries', x: ['Mar-22', 'Mar-23', 'Mar-24', 'Mar-25', 'Mar-26', 'Jun-26'], series: [{ name: 'Cash', values: [...S5.cashInclWos, CO.q1fy27.standalone.cash], fmt: 'num' }], labels: 'all', source: 'Info Edge annual reports; Q1FY27 deck; JM Financial (Mar-25)' },
      { type: 'column', title: 'Deferred revenue: customers fund the business', unit: 'Standalone deferred sales revenue at March (₹ crore)', x: ['Mar-24', 'Mar-25', 'Mar-26'], series: [{ name: 'Deferred revenue', values: S5.deferredRevenue.slice(2), fmt: 'num' }], labels: 'all', source: 'Q1FY27 deck data sheet' },
    ] },
    { callout: '**Capital allocation verdict:** two of the best venture bets in Indian internet history (Zomato and Policybazaar), funded by a near-monopoly that throws off cash. The cost is real too: years of 99acres losses, a long tail of start-ups that will mostly be written off, and a cash pile earning ~7% before tax. Shareholders receive the value of the stakes only through the share price; Info Edge has not sold Eternal or PB Fintech shares since the IPOs.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'A balance sheet of investments: ₹42,000 cr of them against ₹259 cr of borrowings',
  blocks: [
    { p: 'At March 2026 the consolidated balance sheet held ₹42,299 cr of investments (Eternal and PB Fintech at fair value ₹35,676 cr, debt funds, the AIF portfolios and joint ventures), ₹3,640 cr of bank deposits inside other financial assets, and only ₹259 cr of borrowings (mostly lease liabilities). Against the unrealised gains sits a deferred tax liability of ₹4,988 cr; non-controlling interests of ₹2,456 cr are mostly the outside investors in Info Edge\'s venture funds. Screener shows both inside "other liabilities"; net worth below is Info Edge shareholders\' equity only.' },
    { exhibit: { type: 'table', title: 'Consolidated balance sheet snapshot (₹ crore)', head: ['', 'Mar-22', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth (Info Edge shareholders)', '{{A.netWorth.7|num}}', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}'],
      ['Borrowings (incl. leases)', '{{A.borrowings.7|num}}', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}'],
      ['Cash (Screener)', '{{A.cash.7|num}}', '{{A.cash.9|num}}', '{{A.cash.10|num}}', '{{A.cash.11|num}}'],
      ['Investments', '{{A.investments.7|num}}', '{{A.investments.9|num}}', '{{A.investments.10|num}}', '{{A.investments.11|num}}'],
      ['Net fixed assets (incl. acquired intangibles)', '{{A.fixedAssets.7|num}}', '{{A.fixedAssets.9|num}}', '{{A.fixedAssets.10|num}}', '{{A.fixedAssets.11|num}}'],
      ['Memo: cash incl. wholly owned subsidiaries (company)', n0(S5.cashInclWos[0]), n0(S5.cashInclWos[2]), n0(S5.cashInclWos[3]), n0(S5.cashInclWos[4])],
    ], source: SRC.co + '; Info Edge annual reports (cash)' } },
    { callout: '**So what:** solvency is not a question. The questions are what the investments are worth and who gets that value: the deferred tax liability (₹4,988 cr against ~₹35,000 cr of unrealised gains) shows that ~14% of any gain on Eternal and PB Fintech would go in tax if Info Edge ever sold, and the AIF minorities show that part of the venture portfolio belongs to other investors. Our SOTP counts only Info Edge\'s share.' },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: founders 37.5%; Indian institutions now outweigh foreign ones',
  blocks: [
    { pair: [
      { type: 'column', title: 'Promoter group steady at ~37.5%', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 30, max: 45, source: 'BSE shareholding pattern, Screener.in' },
      { type: 'line', title: 'Foreign investors sold; domestic institutions bought', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { p: '*Consolidated. Net profit and EPS are attributable to Info Edge shareholders (after minorities). Other income includes exceptional items and fair-value gains in actual years; forecasts carry none.*' },
    { statement: { title: 'Profit & loss, FY18–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 15 }, hl: true }, { key: 'ebitda', name: 'EBITDA', hl: true }, { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 300 } },
      { key: 'dep', name: 'Depreciation' }, { key: 'otherIncome', name: 'Other income (incl. exceptional items)', flag: { type: 'pct', th: 50 } }, { key: 'interest', name: 'Interest' }, { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit (after minorities)', hl: true, flag: { type: 'pct', th: 30 } }, { key: 'eps', name: 'EPS (₹)', fmt: 'n1' }, { key: 'cfo', name: 'Cash from operations' }, { key: 'capex', name: 'Capex' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L (as reported by 30-Sep-2026)', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 15 }, hl: true }, { key: 'ebitda', name: 'EBITDA' }, { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' },
      { key: 'otherIncome', name: 'Other income (incl. exceptional items)' }, { key: 'dep', name: 'Depreciation' }, { key: 'pat', name: 'Net profit (after minorities)', hl: true },
    ] } },
  ],
};

module.exports = { financials, capital, balance, ownershipBase, statements, RD };

if (require.main === module) {
  require('./NAUKRI.val').syncParts();
  const B = fs.existsSync(path.join(__dirname, 'NAUKRI.research.js')) ? require('./NAUKRI.research') : null;
  const report = {
    symbol: 'NAUKRI', listing: 'NSE: NAUKRI · BSE: 532777', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Internet & consumer platforms',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements],
    statementNotes: { ...(B?.statementNotes || {}) },
  };
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
