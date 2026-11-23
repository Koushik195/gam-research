// Authoring source for the Samvardhana Motherson (SAMIL) initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated; Net Profit put on the
// attributable basis by MOTHERSON.patch.js). Part B (MOTHERSON.research.js + part2-6, shared MOTHERSON.ctx.js) adds
// the research chapters. MOTHERSON.ctx.js first syncs the derived multiples into assumptions.json.
// Usage: node src/model.js MOTHERSON && node tools/authoring/MOTHERSON.js && node src/model.js MOTHERSON
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'MOTHERSON', 'research');
const SCR = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8')).tables.ratios;
const keepR = SCR.periods.map(p => `${p.slice(-4)}-05-30` <= '2026-09-30');
const RL = SCR.periods.filter((_, i) => keepR[i]).map(p => 'FY' + p.slice(-2));
const RR = k => SCR.rows[k].filter((_, i) => keepR[i]);
const SRC = { co: 'Company filings, Screener.in (consolidated; net profit attributable to owners), GAM Research' };

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Revenue up 60% and EPS 2.5x since FY23, but the margin has stayed at 8-10%',
  blocks: [
    { p: 'The company in its present shape dates from the January 2022 reorganisation (the domestic wiring-harness business went to MSWIL; the promoters\' SAMIL, owner of 49% of SMRP BV, was merged in), so FY23 is the first clean year. Since then revenue went from ₹78,701 cr to ₹1,26,104 cr (FY26), about 17% a year, and EPS from ₹1.47 to ₹3.66, about 36% a year. Three things did it: the post-Covid recovery in car production, a string of acquisitions (SAS, Yachiyo, Atsumitec and a dozen smaller ones) and a weaker rupee, which lifts the value of revenue earned in euros and dollars. Operating margin moved only from 7.8% to 9.6% (Screener basis): SAMIL is a high-volume, thin-margin assembler.' },
    { pair: [
      { type: 'column', title: 'Revenue more than doubled from FY21 to FY26', unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY17', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'column', title: 'Net profit to owners: a trough in FY22, then 4x', unit: 'Net profit attributable to owners (₹ crore)', x: 'fin.labels', from: 'FY17', to: 'FY26', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.co + '. Before FY22 the company owned 51% of SMRP BV, so the history is not like-for-like.' },
    ] },
    { pair: [
      { type: 'line', title: 'Operating margin: 7-10% for a decade', unit: 'EBITDA margin (%), Screener basis', x: 'fin.labels', from: 'FY17', to: 'FY26', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 5, max: 12, source: SRC.co },
      { type: 'line', title: 'ROCE: 25% in FY15, 6% in FY21-22, 13% now', unit: 'Return on capital employed (%), Screener basis', x: RL, series: [{ name: 'ROCE', values: RR('ROCE %'), fmt: 'pct0' }], labels: 'all', min: 0, max: 30, source: 'Screener.in' },
    ] },
    { callout: '**Our view:** the growth is real but it is mostly bought or translated. Over FY23-26 acquisitions added several billion dollars of revenue, the euro averaged ~₹101 in FY26 against ~₹91 in FY25 (company figures), and organic volumes in Europe, still SAMIL\'s biggest region, barely grew. Profit grew faster than revenue because interest fell after the Sep-2024 equity raise and because acquired plants were restructured. Returns are the weak spot: ROCE of 13% (Screener) or 16% on the company\'s own adjusted basis, against a 40% target that management has carried through two five-year plans.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capex & returns', kicker: 'Capital allocation', title: 'Capex doubled to ~₹6,000 cr a year, plus acquisitions; cash covers it, returns do not yet show it',
  blocks: [
    { p: 'SAMIL reinvests most of what it earns. Over FY24-26 it generated ₹25,139 cr of operating cash, spent ₹14,740 cr on capex and ₹3,550 cr on acquisitions and paid ₹2,127 cr of dividends; it also raised ₹6,376 cr of equity and convertibles in Sep-2024 (QIP + CCDs), which is why net debt fell. FY27 capex is guided at ₹6,000 cr ±10%, half for growth (60% of that in non-auto, mainly the ~₹7,500 cr consumer-electronics programme), and July 2026 brought two more acquisitions (Nexans Autoelectric, EUR207 mn EV; 81% of Yutaka Giken, USD184 mn). Payout is 16%; the Vision 2030 policy is "up to 40%".' },
    { pair: [
      { type: 'column', title: 'Operating cash flow vs capex', unit: '₹ crore', x: 'A.labels', from: 'FY17', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }], labels: 'none', source: SRC.co },
      { type: 'line', title: 'Working capital is funded by suppliers (negative days)', unit: 'Days (of revenue)', x: RL, series: [{ name: 'Inventory days', values: RR('Inventory Days'), fmt: 'num' }, { name: 'Receivable days', values: RR('Debtor Days'), fmt: 'num' }, { name: 'Payable days', values: RR('Days Payable'), fmt: 'num' }], labels: 'last', source: 'Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went (₹ crore)', head: ['', 'FY21-23', 'FY24-26', 'Six years'], rows: [
      ['Cash from operations', '12,157', '25,139', '37,296'],
      ['Capex (fixed assets bought)', '6,699', '14,740', '21,439'],
      ['Acquisitions', '–', '3,550', '3,550'],
      ['Dividends paid', '1,138', '2,127', '3,265'],
      { hl: true, cells: ['**Left over before financing**', '**4,320**', '**4,722**', '**9,042**'] },
      ['Memo: equity and CCDs raised (Sep-2024)', '–', '6,376', '6,376'],
    ], source: 'Screener.in cash flow (consolidated); AR FY26' } },
    { callout: '**The capital question:** SAMIL earns a return close to its cost of capital (ROE {{F.roe.0|pct}} in FY27E against a ~12.5% cost of equity) and keeps buying assets that start below group margins. Each deal is cheap (Nexans at ~4x EBITDA), but cheap assets are cheap for a reason: they need restructuring, and the FY26 accounts carried ₹379 cr of it. The 40% ROCE target is aspirational; we model ROE rising to {{F.roe.2|pct}} by FY29E.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'Net debt ~₹8,000 cr (0.8x EBITDA with leases), ₹6,651 cr of JV stakes, ₹7,309 cr of goodwill',
  blocks: [
    { p: 'At Jun-2026 gross debt was ₹16,606 cr (including ₹1,500 cr of compulsorily convertible debentures that turn into equity from Sep-2027) and cash ₹8,606 cr: net debt ₹8,000 cr, plus ₹3,257 cr of leases. The company\'s "effective net debt" (leases in, CCDs out) was ₹9,757 cr, 0.8x trailing EBITDA, the lowest ever; liquidity ₹15,633 cr. July\'s two acquisitions (~₹3,900 cr) will push it up. The balance sheet also holds ₹6,651 cr of equity-accounted JV stakes (MSWIL 33.43% at ₹3,794 cr, worth ₹8,179 cr at market in Mar-26), ₹7,309 cr of goodwill and ₹2,680 cr of minority interests. Screener\'s "investments" line (₹7,238 cr) is mostly those JV stakes, not cash.' },
    { pair: [
      { type: 'column', title: 'Borrowings (incl. leases and CCDs)', unit: '₹ crore', x: 'A.labels', from: 'FY17', series: [{ name: 'Borrowings', ref: 'A.borrowings', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'column', title: 'Effective net debt fell from ₹16,019 cr (Jun-24) to ₹9,757 cr (Jun-26)', unit: 'Effective net debt, ₹ crore (company definition)', x: ['Jun-24', 'Sep-24', 'Dec-24', 'Mar-25', 'Jun-25', 'Sep-25', 'Dec-25', 'Mar-26', 'Jun-26'], series: [{ name: 'Effective net debt', values: [16019, 11594, 10554, 9791, 11228, 11599, 11993, 9811, 9757], fmt: 'num' }], labels: 'all', source: 'Q1FY27 presentation slide 23 (net debt + leases − ₹1,500 cr CCDs)' },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-22', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth (owners)', '{{A.netWorth.7|num}}', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}'],
      ['Borrowings (incl. leases, CCDs)', '{{A.borrowings.7|num}}', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}'],
      ['Cash and investments (incl. JV stakes)', '{{A.cashAndInvestments.7|num}}', '{{A.cashAndInvestments.9|num}}', '{{A.cashAndInvestments.10|num}}', '{{A.cashAndInvestments.11|num}}'],
      ['Net fixed assets (incl. goodwill, intangibles)', '{{A.fixedAssets.7|num}}', '{{A.fixedAssets.9|num}}', '{{A.fixedAssets.10|num}}', '{{A.fixedAssets.11|num}}'],
      ['Inventories', '{{A.inventories.7|num}}', '{{A.inventories.9|num}}', '{{A.inventories.10|num}}', '{{A.inventories.11|num}}'],
      ['Trade receivables', '{{A.receivables.7|num}}', '{{A.receivables.9|num}}', '{{A.receivables.10|num}}', '{{A.receivables.11|num}}'],
      ['Trade payables', '{{A.payables.7|num}}', '{{A.payables.9|num}}', '{{A.payables.10|num}}', '{{A.payables.11|num}}'],
    ], source: SRC.co + '. Engine note: the model\'s "net cash" counts the JV stakes at book value and the CCDs as debt; minorities (₹2,680 cr) are not deducted.' } },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: the Sehgal family 48.6%, Sumitomo Wiring 9.4%, Indian funds ~21%, foreign funds ~13%',
  blocks: [
    { pair: [
      { type: 'line', title: 'Indian institutions have overtaken foreign funds', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoters 48.6% after Sumitomo Wiring moved to "public" (Jun-2025)', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 40, max: 70, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY15–FY29E', rows: [
      { key: 'sales', name: 'Revenue (reported, excl. JVs)', flag: { type: 'pct', th: 15 }, hl: true },
      { key: 'ebitda', name: 'EBITDA', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 150 } },
      { key: 'dep', name: 'Depreciation and amortisation' },
      { key: 'otherIncome', name: 'Other income (incl. JV share, after exceptional items)' },
      { key: 'interest', name: 'Finance cost' },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit to owners', hl: true, flag: { type: 'pct', th: 25 } },
      { key: 'eps', name: 'EPS (₹, bonus-adjusted)', fmt: 'n2' },
      { key: 'cfo', name: 'Cash from operations' },
      { key: 'capex', name: 'Capex' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 15 }, hl: true },
      { key: 'ebitda', name: 'EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' },
      { key: 'otherIncome', name: 'Other income (incl. JV share)' },
      { key: 'dep', name: 'Depreciation' },
      { key: 'pat', name: 'Net profit to owners', hl: true },
    ] } },
  ],
};

module.exports = { financials, capital, balance, ownershipBase, statements, RD };

if (require.main === module) {
  require('./MOTHERSON.ctx').syncMultiples();
  const B = fs.existsSync(path.join(__dirname, 'MOTHERSON.research.js')) ? require('./MOTHERSON.research') : null;
  const report = {
    symbol: 'MOTHERSON', listing: 'NSE: MOTHERSON · BSE: 517334', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Automobiles & Auto Components',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements],
    statementNotes: { ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  // research JSONs write rupees as 'Rs'; the report uses ₹ (never inside URLs: only 'Rs' directly before a number)
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1).replace(/\bRs ?(?=\d)/g, '₹'));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
