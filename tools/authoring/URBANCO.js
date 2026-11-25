// Authoring source for the Urban Company initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials. Part B (URBANCO.research.js, merging
// URBANCO.part2.js … part6.js) adds the segment, competition, street and valuation chapters.
// Usage: node tools/authoring/URBANCO.js   (then node src/model.js URBANCO)
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'URBANCO', 'research');
const SRC = { co: 'Company filings, Screener.in (consolidated), GAM Research' };

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Revenue up 7x in six years; the core now makes money, InstaHelp spends it',
  blocks: [
    { p: 'Urban Company\'s revenue rose from ₹219 cr in FY20 to ₹1,556 cr in FY26 (+36% in FY26). Revenue is the company\'s share of what customers pay (commission and fees), plus products it sells to its service partners and Native\'s water purifiers and locks; it is ~36% of the value customers spend on the platform (NTV, ₹4,290 cr in FY26). The loss peaked at ₹514 cr in FY22, fell to ₹93 cr in FY24, and FY25 showed a ₹240 cr profit only because of a ₹211 cr one-time tax credit. In FY26 the loss was back at ₹235 cr: the core businesses earned ₹106 cr of adjusted EBITDA, but the new InstaHelp house-help service lost ₹235 cr and ₹60 cr of deferred-tax assets were written back.' },
    { pair: [
      { type: 'column', title: 'Revenue: 36% growth in FY26, 44% in Q1FY27', unit: 'Revenue from operations (₹ crore)', x: 'fin.labels', from: 'FY20', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num', growth: true }], source: SRC.co },
      { type: 'column', title: 'Net profit: FY25\'s "profit" was a tax credit', unit: 'Net profit / (loss), ₹ crore', x: 'fin.labels', from: 'FY20', to: 'FY26', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { pair: [
      { type: 'column', title: 'Quarterly revenue keeps rising', unit: 'Revenue from operations, quarterly (₹ crore)', x: 'Q.labels', series: [{ name: 'Revenue', ref: 'Q.sales', fmt: 'num' }], labels: 'ends', source: SRC.co },
      { type: 'column', title: 'Quarterly EBITDA: the InstaHelp build-out shows from Q2FY26', unit: 'EBITDA as reported by Screener, quarterly (₹ crore)', x: 'Q.labels', series: [{ name: 'EBITDA', ref: 'Q.ebitda', fmt: 'num' }], labels: 'ends', source: SRC.co },
    ] },
    { callout: '**Our view:** read Urban Company in two halves. The core (India services, International, Native) is profitable and its margin is rising: adjusted EBITDA went from ₹12 cr in FY25 to ₹106 cr in FY26 and ₹67 cr in Q1FY27 alone. InstaHelp is a start-up inside a listed company, losing more than the core earns. Group EBITDA as reported (Screener −₹254 cr in FY26) also carries ESOP cost (₹104 cr) and the Saudi JV loss (₹31 cr). Treasury income (₹137 cr) covers about half of the loss.' },
  ],
};

const cash = {
  id: 'cash', nav: 'Cash & balance sheet', kicker: 'Balance sheet', title: 'Cash: ₹2,019 cr, no debt, customers pay up front',
  blocks: [
    { p: 'Urban Company held ₹2,019 cr of cash, deposits and treasury investments at Jun-2026 (company figure) and has no borrowings: the ₹136 cr of "borrowings" on Screener are lease liabilities on offices and training centres. The IPO brought in ₹469 cr net in Sep-2025. Working capital is negative: customers pay when they book, while partners and suppliers are paid later, so growth releases a little cash; Native\'s inventory (₹90 cr at Mar-26) is the main use. Screener\'s "cash + investments" (₹1,794 cr at Mar-26) is lower than the company figure because ₹227 cr of deposits sit inside other assets.' },
    { pair: [
      { type: 'column', title: 'Operating cash flow turned negative again in FY26', unit: 'Cash from operations (₹ crore)', x: 'fin.labels', from: 'FY20', to: 'FY26', series: [{ name: 'CFO', ref: 'fin.cfo', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'column', title: 'Equity raised in FY22 (venture rounds) and FY26 (IPO)', unit: 'Cash from financing (₹ crore)', x: 'A.labels', from: 'FY20', series: [{ name: 'CFF', ref: 'A.cff', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth', '{{A.netWorth.4|num}}', '{{A.netWorth.5|num}}', '{{A.netWorth.6|num}}'],
      ['Borrowings (lease liabilities only)', '{{A.borrowings.4|num}}', '{{A.borrowings.5|num}}', '{{A.borrowings.6|num}}'],
      ['Investments', '{{A.investments.4|num}}', '{{A.investments.5|num}}', '{{A.investments.6|num}}'],
      ['Cash & equivalents', '{{A.cash.4|num}}', '{{A.cash.5|num}}', '{{A.cash.6|num}}'],
      ['Company cash & treasury investments (incl. deposits)', '1,316', '1,630', '2,021'],
      ['Other liabilities (incl. partner and supplier payables)', '{{A.otherLiab.4|num}}', '{{A.otherLiab.5|num}}', '{{A.otherLiab.6|num}}'],
      ['Cash from operations', '{{A.cfo.4|num}}', '{{A.cfo.5|num}}', '{{A.cfo.6|num}}'],
    ], source: 'Screener.in; Q4FY26 letter (company cash balance)' } },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: venture funds selling, SBI Mutual Fund buying',
  blocks: [
    { pair: [
      { type: 'line', title: 'Domestic institutions doubled their stake after the lock-in', unit: '% of shares', x: 'SH.periods', series: [{ name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }, { name: 'FIIs (incl. venture funds)', ref: 'SH.rows.FIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoters (the three founders) hold 19%', unit: '% of shares held by promoters', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'all', source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY20–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 40 }, hl: true },
      { key: 'ebitda', name: 'EBITDA', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 800 } },
      { key: 'dep', name: 'Depreciation' },
      { key: 'otherIncome', name: 'Other income' },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit / (loss)', hl: true },
      { key: 'cfo', name: 'Cash from operations' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 60 }, hl: true },
      { key: 'ebitda', name: 'EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' },
      { key: 'otherIncome', name: 'Other income' },
      { key: 'pat', name: 'Net profit / (loss)', hl: true },
    ] } },
  ],
};

const statementNotes = {
  'sales@FY22': 'Post-Covid rebound (+77%); heavy spending on growth.',
  'pat@FY22': 'Peak loss: expansion and marketing.',
  'pat@FY24': 'Loss cut to ₹93 cr; India services near adjusted-EBITDA breakeven.',
  'pat@FY25': 'Includes a one-time deferred-tax credit of ₹211 cr; PBT only ₹29 cr. KSA deconsolidated into a JV from Jan-2025.',
  'ebitda@FY26': 'InstaHelp loss ₹235 cr; listing costs ₹19 cr and a ₹9 cr warehouse-fire loss; KSA JV loss (₹31 cr) sits inside Screener\'s EBITDA.',
  'pat@FY26': 'Includes ₹60 cr reversal of deferred-tax assets (losses likely to lapse; ESOP exercises).',
  'cfo@FY26': 'Operating cash outflow as InstaHelp scaled; the IPO (₹469 cr net) funded it.',
};

module.exports = { financials, cash, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  const B = fs.existsSync(path.join(__dirname, 'URBANCO.research.js')) ? require('./URBANCO.research') : null;
  const report = {
    symbol: 'URBANCO', listing: 'NSE: URBANCO · BSE: 544515', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Internet & Consumer Platforms',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, cash, ownershipBase, statements }) : [financials, cash, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
