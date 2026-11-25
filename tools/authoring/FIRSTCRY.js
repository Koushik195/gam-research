// Authoring source for the FirstCry (Brainbees Solutions) initiating-coverage report.
// Part A (this file): chapters built on reported financials. Part B (FIRSTCRY.research.js, merging
// FIRSTCRY.part2.js … part6.js) adds the business, segment, street and valuation chapters.
// Usage: node tools/authoring/FIRSTCRY.js   (then node src/model.js FIRSTCRY)
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'FIRSTCRY', 'research');
const SRC = { co: 'Company filings, Screener.in (consolidated; net profit attributable to owners), GAM Research' };

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Revenue up 5x since FY21; losses shrinking, but still losses',
  blocks: [
    { p: 'FirstCry\'s revenue rose from ₹1,603 cr in FY21 to ₹8,548 cr in FY26, helped by the Globalbees acquisitions in FY22-FY23, but growth has slowed sharply: +18% in FY25, +12% in FY26 and +13% in Q1FY27. The group has not made a full-year profit since FY21 (₹215 cr owners\' profit, of which ₹118 cr was a tax credit). Losses attributable to shareholders narrowed from ₹441 cr in FY23 to ₹140 cr in FY26, and to ₹31 cr in Q1FY27, mostly because ESOP charges, Globalbees losses and International losses all fell. Reported EBITDA (after ESOP cost) was ₹262 cr in FY26, 3.1% of revenue.' },
    { pair: [
      { type: 'column', title: 'Revenue: growth slowed from 50%+ to 12%', unit: 'Revenue from operations (₹ crore)', x: 'fin.labels', from: 'FY21', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num', growth: true }], source: SRC.co },
      { type: 'column', title: 'Net loss to owners has shrunk for three years', unit: 'Net profit attributable to owners (₹ crore)', x: 'fin.labels', from: 'FY21', to: 'FY26', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { pair: [
      { type: 'column', title: 'Quarterly EBITDA: positive but thin, and seasonal (Q3 peak)', unit: 'Reported EBITDA after ESOP cost, quarterly (₹ crore)', x: 'Q.labels', series: [{ name: 'EBITDA', ref: 'Q.ebitda', fmt: 'num' }], labels: 'ends', source: SRC.co },
      { type: 'line', title: 'EBITDA margin: 3-5% of revenue', unit: 'Reported EBITDA margin, quarterly (%)', x: 'Q.labels', series: [{ name: 'EBITDA margin', ref: 'Q.opm', fmt: 'pct' }], labels: 'ends', source: SRC.co },
    ] },
    { callout: '**Our view:** the profit gap is structural, not just a phase. Adjusted EBITDA (₹486 cr in FY26, 5.7% of revenue) is before ESOP cost (₹224 cr) and before rent (₹255 cr of lease payments sit in depreciation and interest). Brand amortisation from the Globalbees deals (₹88 cr) and recurring exceptional charges (₹50 cr) come on top. India multi-channel is profitable after all of that; International and Globalbees are not yet. Without a recovery in India gross margin, the group stays near breakeven.' },
  ],
};

const cash = {
  id: 'cash', nav: 'Cash & balance sheet', kicker: 'Balance sheet', title: 'Balance sheet: IPO cash covers debt and leases; first positive operating cash flow in FY26',
  blocks: [
    { p: 'At Mar-26 FirstCry held ₹1,741 cr of cash, bank deposits and investments (incl. ₹334 cr of deposits longer than a year) against ₹595 cr of bank borrowings (mostly working-capital lines) and ₹999 cr of lease liabilities on stores and warehouses: net cash of ₹1,147 cr before leases and ₹148 cr after them. It also owes ₹388 cr to the founders of Globalbees brands (earn-outs, a debt-like item). Cash from operations turned positive for the first time in FY26 (₹365 cr) as inventory fell by ₹137 cr; capex was ₹189 cr. But lease payments (₹255 cr) are shown under financing, so after rent free cash flow was close to nil.' },
    { pair: [
      { type: 'column', title: 'Operating cash flow positive for the first time in FY26', unit: 'Cash from operations (₹ crore)', x: 'fin.labels', from: 'FY21', to: 'FY26', series: [{ name: 'CFO', ref: 'fin.cfo', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'column', title: 'Financing: the IPO money came in FY25', unit: 'Cash from financing (₹ crore)', x: 'A.labels', from: 'FY21', series: [{ name: 'CFF', ref: 'A.cff', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth (incl. minorities)', '{{A.netWorth.6|num}}', '{{A.netWorth.7|num}}', '{{A.netWorth.8|num}}'],
      ['Borrowings (incl. leases)', '{{A.borrowings.6|num}}', '{{A.borrowings.7|num}}', '{{A.borrowings.8|num}}'],
      ['Cash & bank (excl. long deposits)', '{{A.cash.6|num}}', '{{A.cash.7|num}}', '{{A.cash.8|num}}'],
      ['Inventories', '{{A.inventories.6|num}}', '{{A.inventories.7|num}}', '{{A.inventories.8|num}}'],
      ['Fixed assets (incl. right-of-use, goodwill, brands)', '{{A.fixedAssets.6|num}}', '{{A.fixedAssets.7|num}}', '{{A.fixedAssets.8|num}}'],
      ['Cash from operations', '{{A.cfo.6|num}}', '{{A.cfo.7|num}}', '{{A.cfo.8|num}}'],
    ], source: SRC.co } },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: no promoter; SoftBank, Mahindra and domestic funds hold the big blocks',
  blocks: [
    { pair: [
      { type: 'line', title: 'Domestic funds bought as foreign funds sold', unit: '% of shares', x: 'SH.periods', series: [{ name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }, { name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: '"Public" (incl. SoftBank, Mahindra, the founder) holds two-thirds', unit: '% of shares held by the "public" category', x: 'SH.periods', series: [{ name: 'Public', ref: 'SH.rows.Public', fmt: 'pct' }], labels: 'all', source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY20–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 40 }, hl: true },
      { key: 'ebitda', name: 'EBITDA (after ESOP cost)', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 150 } },
      { key: 'dep', name: 'Depreciation & amortisation', flag: { type: 'pct', th: 40 }, inverse: true },
      { key: 'otherIncome', name: 'Other income (net of exceptional items)' },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit (owners; forecasts before minorities)', hl: true },
      { key: 'cfo', name: 'Cash from operations' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 35 }, hl: true },
      { key: 'ebitda', name: 'EBITDA (after ESOP cost)' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' },
      { key: 'dep', name: 'Depreciation' },
      { key: 'pat', name: 'Net profit (owners)', hl: true },
    ] } },
  ],
};

const statementNotes = {
  'sales@FY22': 'Globalbees starts consolidating the D2C brands it acquired in FY22-FY23.',
  'sales@FY23': 'Revenue +135%: first full year of Globalbees and its brand acquisitions (last one Sep-2022).',
  'pat@FY23': 'Peak loss: ESOP cost ₹361 cr, Globalbees and International start-up losses, brand amortisation.',
  'dep@FY23': 'Amortisation of acquired Globalbees brands and right-of-use assets for new stores and warehouses.',
  'cfo@FY23': 'Inventory and working-capital build in Globalbees and the new International operations.',
  'otherIncome@FY25': 'Net of ₹50 cr exceptional items (₹197 cr Globalbees impairment offset by a ₹174 cr earn-out remeasurement gain and other items).',
  'cfo@FY26': 'First positive operating cash flow: inventory fell ₹137 cr; lease payments (₹255 cr) are in financing.',
  'pat@FY26': 'Owners\' loss ₹140 cr after ₹63 cr absorbed by Globalbees minorities; ₹50 cr exceptional charges.',
  'ebitdaMargin@FY26': 'ESOP cost rose to ₹224 cr (2.6% of revenue) from ₹154 cr; gross margin fell 1.2pp on diaper discounting in H2.',
};

module.exports = { financials, cash, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  const B = fs.existsSync(path.join(__dirname, 'FIRSTCRY.research.js')) ? require('./FIRSTCRY.research') : null;
  const report = {
    symbol: 'FIRSTCRY', listing: 'NSE: FIRSTCRY · BSE: 544226', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Internet & Consumer Platforms',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, cash, ownershipBase, statements }) : [financials, cash, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
