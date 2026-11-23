// Authoring source for the Tube Investments of India initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener consolidated, Net Profit on the attributable basis
// after minorities via TIINDIA.patch.js; TII standalone from the annual reports). Part B (TIINDIA.research.js, merging
// TIINDIA.part2-6.js on the shared TIINDIA.ctx.js) adds the research chapters. TIINDIA.val.js first syncs the derived
// SOTP parts into assumptions.json. Usage: node tools/authoring/TIINDIA.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'TIINDIA', 'research');
const SG = JSON.parse(fs.readFileSync(path.join(RD, 'segments.json'), 'utf8'));
const CO = JSON.parse(fs.readFileSync(path.join(RD, 'company.json'), 'utf8'));
const SA = SG.annual.filter(a => a.saRev && a.fy >= 'FY23'), FYS = SA.map(a => a.fy);
const FY5 = CO.standaloneFiveYear, n0 = v => Math.round(v).toLocaleString('en-IN');
const SRC = { co: 'Company filings, Screener.in (consolidated; profit attributable to TII shareholders), GAM Research', sa: 'TII annual reports FY22-FY26 (standalone financial highlights), GAM Research' };
const MI = { FY22: 222, FY23: 369, FY24: 522, FY25: 381, FY26: 481 }; // Screener minority share

const financials = {
  id: 'trajectory', nav: 'Consolidated financials', kicker: 'Financials', title: 'Consolidated revenue doubled since FY22; profit for TII\'s shareholders halved since FY24',
  blocks: [
    { p: `TII's consolidated revenue was ₹22,847 cr in FY26, almost double FY22's ₹12,447 cr (the first full year with CG Power). But only ₹8,556 cr of it is TII's own business; ₹12,418 cr is CG Power, of which TII owns 56%. So the consolidated numbers say more about CG Power than about TII. Profit attributable to TII's shareholders was ₹637 cr (₹32.9 a share) in FY26, against ₹1,201 cr (₹62.1) in FY24. Two things explain the fall. FY24 carried a one-off: CG Power's ~₹540 cr of exceptional gains in the Dec-2023 quarter. And the new ventures, mostly TI Clean Mobility's electric vehicles, went from a small loss to a large one: the residual block (consolidated less TII, CG Power and Shanthi Gears) lost ₹${n0(-SG.annual[5].resEbitda)} cr at EBITDA in FY26 against ₹${n0(-SG.annual[3].resEbitda)} cr in FY24, and none of that loss is shared with minorities.` },
    { pair: [
      { type: 'stacked', title: 'CG Power is more than half of consolidated revenue', unit: 'Revenue from operations (₹ crore)', x: FYS, series: [{ name: 'TII standalone', values: SA.map(a => a.saRev), fmt: 'num' }, { name: 'CG Power', values: SA.map(a => a.cgRev), fmt: 'num' }, { name: 'Shanthi Gears', values: SA.map(a => a.sgRev), fmt: 'num' }, { name: 'EV and new ventures', values: SA.map(a => a.resRev), fmt: 'num' }], minLabel: 900, source: 'TII decks and AR (standalone); Screener.in (CG Power, Shanthi Gears); residual = consolidated less the three' },
      { type: 'column', title: 'EBITDA by block: the new ventures now lose ~₹550 cr a year', unit: 'EBITDA (₹ crore)', x: FYS, series: [{ name: 'TII standalone', values: SA.map(a => Math.round(a.saEbitda)), fmt: 'num' }, { name: 'CG Power', values: SA.map(a => a.cgEbitda), fmt: 'num' }, { name: 'Shanthi Gears', values: SA.map(a => a.sgEbitda), fmt: 'num' }, { name: 'EV and new ventures', values: SA.map(a => Math.round(a.resEbitda)), fmt: 'num' }], labels: 'none', source: 'As left; standalone EBITDA = PBDIT less other income (AR)' },
    ] },
    { pair: [
      { type: 'column', title: 'EPS for TII shareholders: FY24 was flattered by CG Power one-offs', unit: 'EPS after minorities (₹)', x: 'fin.labels', from: 'FY21', series: [{ name: 'EPS', ref: 'fin.eps', fmt: 'n1' }], labels: 'all', source: 'Screener.in; GAM estimates FY27-29E' },
      { type: 'column', title: 'Minorities took ₹481 cr of FY26 profit, almost as much as TII kept', unit: '₹ crore', x: Object.keys(MI), series: [{ name: 'Profit attributable to TII', values: ['FY22', 'FY23', 'FY24', 'FY25', 'FY26'].map(f => SG.annual.find(a => a.fy === f).patAttr), fmt: 'num' }, { name: 'Minorities\' share', values: Object.values(MI), fmt: 'num' }], labels: 'none', source: SRC.co },
    ] },
    { callout: '**So what:** do not judge TII on its consolidated P/E (73x trailing on 30-Sep-2026) or its 10% consolidated margin. About 85% of what TII owns is the market value of CG Power, which investors can buy directly. The questions that matter are (1) what TII\'s own businesses earn and are worth, (2) what discount the market puts on the CG Power stake, and (3) how much more cash the EV and other new ventures will absorb. The rest of this report is built around those three.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capital allocation', kicker: 'Capital allocation', title: 'A cash machine at the core; the cash goes into new ventures, not to shareholders',
  blocks: [
    { p: `TII's own businesses need little capital and return a lot on it: pre-tax ROIC of 44-55% in FY22-26 (company definition), free cash flow of ₹${n0(FY5.fcf.slice(1).reduce((s, x) => s + x, 0))} cr over FY22-26 (₹826 cr in FY26, 100% of profit). Where did it go? Into new subsidiaries: TII's cost of its unlisted subsidiaries rose from ₹161 cr (Mar-2022) to ₹1,673 cr (Mar-2026), mostly TI Clean Mobility (₹1,000 cr), TI Medical (₹265 cr) and 3xper (₹285 cr). Shareholders received ₹3.50 a share every year (~₹68 cr, under 10% of profit). Another ₹250 cr goes into TICMPL in Q3FY27 and ~₹300 cr a year into other subsidiaries.` },
    { exhibit: { type: 'table', title: 'Where TII\'s standalone cash went, FY22-26 (₹ crore)', head: ['', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26', 'Five years'], rows: [
      ['Free cash flow (company definition)', ...FY5.fcf.slice(1).map(n0), n0(FY5.fcf.slice(1).reduce((s, x) => s + x, 0))],
      ['Added to unlisted subsidiaries (at cost)', '100', '317', '652', '173', '370', '1,612'],
      ['CG Power warrants converted (at cost)', '79', '73', '–', '–', '–', '152'],
      ['Dividends paid (₹3.50 a share)', '68', '68', '68', '68', '68', '~340'],
      { hl: true, cells: ['**Net debt at year-end (negative = net cash)**', ...FY5.netDebt.slice(1).map(v => `**${n0(v)}**`), '**from 65 to −380**'] },
      ['Memo: pre-tax ROIC (%)', ...FY5.roicPreTax.slice(1).map(String), ''],
    ], source: 'TII AR FY22-FY26 (financial highlights, investment notes 6/6a); additions = change in cost of unlisted subsidiaries (FY22 from ₹61 cr at Mar-21; impaired units excluded)' } },
    { pair: [
      { type: 'column', title: 'Standalone free cash flow: ₹826 cr in FY26', unit: '₹ crore', x: FY5.years.slice(1), series: [{ name: 'Free cash flow', values: FY5.fcf.slice(1), fmt: 'num' }], labels: 'all', source: SRC.sa },
      { type: 'column', title: 'TII\'s cost of unlisted subsidiaries: 10x in four years', unit: '₹ crore, at 31 March', x: ['Mar-22', 'Mar-23', 'Mar-24', 'Mar-25', 'Mar-26'], series: [{ name: 'Unlisted subsidiaries at cost', values: ['mar22', 'mar23', 'mar24', 'mar25', 'mar26'].map(k => CO.stakes.unlistedCostCr[k]), fmt: 'num' }], labels: 'all', source: 'TII AR investment notes; GAM Research' },
    ] },
    { callout: '**Capital allocation verdict:** the CG Power deal (2020) was one of the best capital-allocation decisions in Indian industry: TII\'s 88.65 cr CG shares cost ₹806 cr and were worth ~₹75,700 cr on 30-Sep-2026. The ventures since then (EV, medical devices, CDMO, optics, MIM) have absorbed ~₹1,600 cr and none earns its cost of capital yet. TII behaves like a venture holding company funded by a precision-tube business. That is the case for owning it if you trust the Murugappa team to repeat CG Power, and the reason for the discount if you do not.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'Net cash at every level; large minorities',
  blocks: [
    { p: 'TII standalone had ₹380 cr of net cash at March 2026 (no borrowings; debt net of cash and current investments, company definition). The consolidated balance sheet held ₹1,469 cr of cash and ₹1,024 cr of investments against ₹754 cr of borrowings, mostly in CG Power. Minority interest (non-controlling interest) was ₹6,450 cr at March 2026: CG Power\'s other shareholders (₹3,754 cr) and, since the March-2026 restated shareholders\' agreement, TICMPL\'s outside investors (₹2,469 cr; their convertible preference shares were reclassified from a liability to minority interest). Screener shows minorities inside "other liabilities"; net worth below is TII shareholders\' equity only.' },
    { exhibit: { type: 'table', title: 'Consolidated balance sheet snapshot (₹ crore)', head: ['', 'Mar-22', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth (TII shareholders)', '{{A.netWorth.5|num}}', '{{A.netWorth.7|num}}', '{{A.netWorth.8|num}}', '{{A.netWorth.9|num}}'],
      ['Borrowings', '{{A.borrowings.5|num}}', '{{A.borrowings.7|num}}', '{{A.borrowings.8|num}}', '{{A.borrowings.9|num}}'],
      ['Cash', '{{A.cash.5|num}}', '{{A.cash.7|num}}', '{{A.cash.8|num}}', '{{A.cash.9|num}}'],
      ['Investments', '{{A.investments.5|num}}', '{{A.investments.7|num}}', '{{A.investments.8|num}}', '{{A.investments.9|num}}'],
      ['Net fixed assets', '{{A.fixedAssets.5|num}}', '{{A.fixedAssets.7|num}}', '{{A.fixedAssets.8|num}}', '{{A.fixedAssets.9|num}}'],
      ['Capital work in progress', '{{A.cwip.5|num}}', '{{A.cwip.7|num}}', '{{A.cwip.8|num}}', '{{A.cwip.9|num}}'],
      ['Memo: TII standalone net debt (negative = net cash)', '65', '180', '12', '−380'],
    ], source: SRC.co + '; TII AR (standalone net debt)' } },
    { callout: '**So what:** solvency is not the issue anywhere in the group. The issue is where the cash sits: CG Power\'s cash belongs to CG Power\'s shareholders (TII gets 56% of its dividends, ~₹115 cr a year), while TICMPL\'s losses are funded by TII\'s standalone cash and outside investors.' },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: Murugappa family 44%; institutions 43%',
  blocks: [
    { pair: [
      { type: 'column', title: 'Promoter group steady at ~44%', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 30, max: 60, source: 'BSE shareholding pattern, Screener.in' },
      { type: 'line', title: 'Foreign and domestic institutions own ~22% and ~21%', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { p: '*Consolidated. Net profit and EPS are attributable to TII shareholders (after minorities). In FY27-29E the tax line also carries minorities (engine workaround, see Forecasts). Other income includes exceptional items in actual years.*' },
    { statement: { title: 'Profit & loss, FY18–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 15 }, hl: true }, { key: 'ebitda', name: 'EBITDA', hl: true }, { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 150 } },
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
  require('./TIINDIA.val').syncParts();
  const B = fs.existsSync(path.join(__dirname, 'TIINDIA.research.js')) ? require('./TIINDIA.research') : null;
  const report = {
    symbol: 'TIINDIA', listing: 'NSE: TIINDIA · BSE: 540762', date: '30 September 2026', rating: B?.rating || 'BUY', analysts: 'GAM Research — Automobiles & components',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements],
    statementNotes: { ...(B?.statementNotes || {}) },
  };
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
