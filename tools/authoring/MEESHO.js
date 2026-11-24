// Authoring source for the Meesho initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials. Part B (MEESHO.research.js, merging
// MEESHO.part2.js … part6.js) adds the marketplace-economics, competition, street and valuation chapters.
// Usage: node tools/authoring/MEESHO.js   (then node src/model.js MEESHO)
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'MEESHO', 'research');
const SRC = { co: 'Company filings, Screener.in (consolidated from FY23; FY21-22 standalone), GAM Research' };

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Revenue up 16x in five years; losses shrinking but not gone',
  blocks: [
    { p: 'Meesho\'s revenue rose from ₹793 cr in FY21 to ₹12,626 cr in FY26 (+34% in FY26). Revenue is mostly what sellers pay for delivery through Meesho\'s logistics network, plus advertising; Meesho charges sellers no commission, so revenue is ~30% of the value of goods delivered (NMV). Losses peaked at ₹3,248 cr in FY22, fell to ₹328 cr in FY24, and jumped again in FY25 (₹3,942 cr) only because of ~₹3,800 cr of one-off costs from moving the parent company from the US to India. FY26 lost ₹1,358 cr as Meesho spent more to win users and absorbed a costly logistics scale-up. Q1FY27 lost ₹133 cr, the smallest quarterly loss since listing.' },
    { pair: [
      { type: 'column', title: 'Revenue: 34% growth in FY26, 48% in Q1FY27', unit: 'Revenue from operations (₹ crore)', x: 'fin.labels', from: 'FY21', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num', growth: true }], source: SRC.co },
      { type: 'column', title: 'Net loss: FY25 was inflated by ~₹3,800 cr of re-domicile one-offs', unit: 'Net profit / (loss), ₹ crore', x: 'fin.labels', from: 'FY21', to: 'FY26', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { pair: [
      { type: 'column', title: 'Quarterly revenue keeps rising', unit: 'Revenue from operations, quarterly (₹ crore)', x: 'Q.labels', series: [{ name: 'Revenue', ref: 'Q.sales', fmt: 'num' }], labels: 'ends', source: SRC.co },
      { type: 'column', title: 'Quarterly EBITDA loss halved from its Q3FY26 peak', unit: 'Reported EBITDA, quarterly (₹ crore)', x: 'Q.labels', series: [{ name: 'EBITDA', ref: 'Q.ebitda', fmt: 'num' }], labels: 'ends', source: SRC.co },
    ] },
    { callout: '**Our view:** reported EBITDA margins (−12% of revenue in FY26) look worse than the business because revenue is only ~30% of order value. The better yardstick is profit as a share of NMV: marketplace adjusted EBITDA was −2.8% of NMV in FY26 and −1.2% in Q1FY27. Other income (₹416 cr in FY26, interest on ₹6,750 cr of cash) still covers a third of the operating loss. Break-even at the operating level is the next milestone; we expect it in FY28E.' },
  ],
};

const cash = {
  id: 'cash', nav: 'Cash & balance sheet', kicker: 'Balance sheet', title: 'Cash: ₹6,521 cr, no debt, and sellers fund the working capital',
  blocks: [
    { p: 'Meesho held ₹6,521 cr of cash, bank deposits and treasury investments at Jun-2026 (company figure) and has no borrowings beyond ₹63 cr of leases. The IPO (Dec-2025) brought in ₹4,125 cr net of costs, but ₹3,344 cr went on one-time costs of the re-domicile (mainly ₹2,780 cr of income tax paid in FY26), so cash rose only from ₹6,593 cr to ₹6,750 cr over FY26. Working capital is negative: Meesho collects from buyers before it pays sellers and logistics partners, so growth releases cash. Screener\'s "cash + investments" (₹3,103 cr at Mar-26) is lower than the company figure because ~₹3,647 cr of bank deposits sit inside other assets.' },
    { pair: [
      { type: 'column', title: 'Operating cash flow: FY26 hit by ₹2,780 cr of one-off tax', unit: 'Cash from operations (₹ crore)', x: 'fin.labels', from: 'FY21', to: 'FY26', series: [{ name: 'CFO', ref: 'fin.cfo', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'column', title: 'Equity raised in FY22-FY23 (venture rounds), FY25 and FY26 (IPO)', unit: 'Cash from financing (₹ crore)', x: 'A.labels', from: 'FY21', series: [{ name: 'CFF', ref: 'A.cff', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth', '{{A.netWorth.3|num}}', '{{A.netWorth.4|num}}', '{{A.netWorth.5|num}}'],
      ['Borrowings (lease liabilities only)', '{{A.borrowings.3|num}}', '{{A.borrowings.4|num}}', '{{A.borrowings.5|num}}'],
      ['Investments', '{{A.investments.3|num}}', '{{A.investments.4|num}}', '{{A.investments.5|num}}'],
      ['Cash & equivalents', '{{A.cash.3|num}}', '{{A.cash.4|num}}', '{{A.cash.5|num}}'],
      ['Company cash balance (incl. bank deposits)', '3,499', '6,593', '6,750'],
      ['Other liabilities (incl. seller payables)', '{{A.otherLiab.3|num}}', '{{A.otherLiab.4|num}}', '{{A.otherLiab.5|num}}'],
      ['Cash from operations', '{{A.cfo.3|num}}', '{{A.cfo.4|num}}', '{{A.cfo.5|num}}'],
    ], source: 'Screener.in, FY26 annual report (company cash balance)' } },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: venture investors selling, Indian funds buying',
  blocks: [
    { pair: [
      { type: 'line', title: 'Domestic institutions nearly doubled their stake after the lock-in', unit: '% of shares', x: 'SH.periods', series: [{ name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }, { name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'The "public" bucket (incl. venture investors) is shrinking', unit: '% of shares in the Public bucket', x: 'SH.periods', series: [{ name: 'Public', ref: 'SH.rows.Public', fmt: 'pct' }], labels: 'all', source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY21–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 40 }, hl: true },
      { key: 'ebitda', name: 'EBITDA', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 500 } },
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
  'sales@FY22': 'Standalone (Fashnear Technologies, the Indian operating company). Growth funded by heavy discounts.',
  'sales@FY23': 'First consolidated year. Zero-commission model for sellers.',
  'pat@FY22': 'Peak loss: customer acquisition and discounts.',
  'pat@FY24': 'Loss cut to ₹328 cr; free cash flow turned positive.',
  'pat@FY25': 'Re-domicile from the US: ₹1,346 cr exceptional costs (ESOP modification, founders\' perquisite tax) and ₹2,487 cr tax. Underlying loss ~₹108 cr before one-offs and tax.',
  'otherIncome@FY25': 'Screener nets ₹1,282 cr of exceptional items into other income; recurring other income was ₹472 cr.',
  'ebitda@FY26': 'Valmo logistics scale-up (Q2-Q3) and higher user-acquisition spend; includes ~₹57 cr of exceptional costs on Screener.',
  'cfo@FY26': 'Includes ₹2,780 cr of income tax paid on the re-domicile (one-off).',
};

module.exports = { financials, cash, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  const B = fs.existsSync(path.join(__dirname, 'MEESHO.research.js')) ? require('./MEESHO.research') : null;
  const report = {
    symbol: 'MEESHO', listing: 'NSE: MEESHO · BSE: 544632', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Internet & Consumer Platforms',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, cash, ownershipBase, statements }) : [financials, cash, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
