// Authoring source for the Navin Fluorine International initiating-coverage report.
// Part A (this file): chapters built on reported financials (Screener, consolidated).
// Part B (NAVINFLUOR.research.js) adds the story, business, history, industry, tailwind test, the three
// verticals, moat, earnings quality, ownership, governance, forecasts, street, valuation and verdict.
// Usage: node tools/authoring/NAVINFLUOR.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'NAVINFLUOR', 'research');
const SCR = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8')).tables.ratios;
const RL = SCR.periods.map(p => 'FY' + p.slice(-2));
const SRC = { co: 'Company filings, Screener.in (consolidated), GAM Research' };

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Two flat years, then profit more than doubled in FY26',
  blocks: [
    { p: 'Navin Fluorine\'s revenue grew from ₹742 cr in FY17 to ₹2,077 cr in FY23, about 19% a year, as the company added specialty chemicals, contract manufacturing (CDMO) and the HFO plant built for Honeywell. Then it stalled: revenue was flat in FY24 (₹2,065 cr) and grew 14% in FY25, while new plants added depreciation and interest, so net profit fell from ₹375 cr (FY23) to ₹270-289 cr. FY26 was the breakout: revenue +41% to ₹3,314 cr, EBITDA doubled to ₹1,082 cr and net profit rose 130% to ₹664 cr, as refrigerant prices rose, CDMO grew 59% and the Dahej plants filled up. Q1FY27 kept going: revenue +44%, profit +108%.' },
    { pair: [
      { type: 'column', title: 'Revenue: ~4.5x since FY17, with a pause in FY24', unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY17', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num', growth: true }], source: SRC.co },
      { type: 'column', title: 'Net profit: FY20 boosted by a tax credit; FY26 a true record', unit: 'Net profit (₹ crore)', x: 'fin.labels', from: 'FY17', to: 'FY26', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: from a 19% trough to a 33% peak', unit: 'EBITDA margin (%)', x: 'fin.labels', from: 'FY17', to: 'FY26', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 0, max: 40, source: SRC.co },
      { type: 'column', title: 'Quarterly margin has been ~34% for three quarters', unit: 'EBITDA margin (%)', x: 'Q.labels', series: [{ name: 'EBITDA margin', ref: 'Q.opm', fmt: 'pct0' }], labels: 'all', source: SRC.co },
    ] },
    { callout: '**Our view:** FY26 was not a lucky year; it was the year five years of capex (₹3,125 cr over FY22-26) started to earn. The CFO attributes ~70% of the 990bp margin gain to volumes from new capacity and ~30% to pricing. But part of the pricing is the refrigerant cycle (China R32 at a decade high in 2026), which will not last forever, and Navin does not disclose profit by business, so investors cannot see how much of the margin is cyclical.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capex & returns', kicker: 'Capital allocation', title: '₹3,125 cr of capex in five years: returns have only just caught up',
  blocks: [
    { p: 'Over FY22-26 Navin generated ₹2,226 cr of operating cash but spent ₹3,125 cr on plants (the Honeywell HFO plant, Dahej multi-purpose plants, Project Nectar, two R32 plants, the AHF plant and cGMP4) and ₹310 cr on dividends. The gap was funded first with debt (borrowings rose from ₹25 cr in FY21 to ₹1,466 cr in FY25) and then with a ₹750 cr share sale (QIP) in July 2025. Returns collapsed while the plants were being built (ROCE 11% in FY24-25) and recovered to 21% in FY26. The next leg needs ₹700-1,000 cr a year of capex again (FY27-30 guidance).' },
    { pair: [
      { type: 'column', title: 'Capex ran ahead of operating cash for four years', unit: '₹ crore', x: 'A.labels', from: 'FY17', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }], labels: 'none', source: SRC.co },
      { type: 'line', title: 'ROCE: 11% during the build, 21% now', unit: 'Return on capital employed (%)', x: RL, series: [{ name: 'ROCE', values: SCR.rows['ROCE %'], fmt: 'pct0' }], labels: 'all', min: 0, max: 35, source: 'Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went (₹ crore)', head: ['', 'FY17-21', 'FY22-26', 'Ten years'], rows: [
      ['Cash from operations', '745', '2,226', '2,971'],
      ['Capex', '494', '3,125', '3,619'],
      ['Free cash flow', '251', '−899', '−648'],
      ['Dividends paid', '240', '310', '550'],
      { hl: true, cells: ['**Gap funded by debt and the FY26 QIP**', '**+11**', '**−1,209**', '**−1,198**'] },
    ], source: SRC.co } },
    { callout: '**So what:** the big question for FY27-30 is whether the next ₹2,500-3,500 cr of capex (R32, cGMP4 phase 2, advanced materials, Chemours, cGMP5/6) earns the same ~20% returns. Management says each project passes technical, commercial and financial stage gates and some are customer-funded (35% of Chemours). The FY22-25 record shows that returns can stay low for two to three years after a plant is built.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'Net-debt-free after the QIP; working capital back under control',
  blocks: [
    { p: 'At March 2026 Navin had ₹1,226 cr of borrowings (term loans and ECBs taken for the Dahej projects, mostly in the subsidiary NFASL) and ₹1,321 cr of cash and current investments, mostly the QIP money, so net debt was almost nil (0.01x equity). The company says it became net-debt-free during Q1FY27. Working capital improved sharply: net working capital fell to 74 days of sales in FY26 from 90 days, and management now guides 75-80 days. Inventory days peaked at 197 in FY23 (when new plants were stocking up) and are 121 now.' },
    { pair: [
      { type: 'line', title: 'Working-capital days: the FY23 bulge is gone', unit: 'Days (of revenue)', x: RL, series: [{ name: 'Inventory days', values: SCR.rows['Inventory Days'], fmt: 'num' }, { name: 'Receivable days', values: SCR.rows['Debtor Days'], fmt: 'num' }, { name: 'Payable days', values: SCR.rows['Days Payable'], fmt: 'num' }], labels: 'last', source: 'Screener.in' },
      { type: 'column', title: 'Borrowings: built up for capex, now matched by cash', unit: 'Borrowings incl. leases (₹ crore)', x: 'A.labels', from: 'FY17', series: [{ name: 'Borrowings', ref: 'A.borrowings', fmt: 'num' }, { name: 'Cash & investments', ref: 'A.cashAndInvestments', fmt: 'num' }], labels: 'none', source: SRC.co },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-22', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth', '{{A.netWorth.7|num}}', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}'],
      ['Borrowings (incl. leases)', '{{A.borrowings.7|num}}', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}'],
      ['Cash and investments', '{{A.cashAndInvestments.7|num}}', '{{A.cashAndInvestments.9|num}}', '{{A.cashAndInvestments.10|num}}', '{{A.cashAndInvestments.11|num}}'],
      ['Net fixed assets', '{{A.fixedAssets.7|num}}', '{{A.fixedAssets.9|num}}', '{{A.fixedAssets.10|num}}', '{{A.fixedAssets.11|num}}'],
      ['Capital work in progress', '{{A.cwip.7|num}}', '{{A.cwip.9|num}}', '{{A.cwip.10|num}}', '{{A.cwip.11|num}}'],
      ['Inventories', '{{A.inventories.7|num}}', '{{A.inventories.9|num}}', '{{A.inventories.10|num}}', '{{A.inventories.11|num}}'],
      ['Trade receivables', '{{A.receivables.7|num}}', '{{A.receivables.9|num}}', '{{A.receivables.10|num}}', '{{A.receivables.11|num}}'],
    ], source: SRC.co } },
    { callout: '**Contract liabilities** rose to ₹212 cr (from ₹140 cr): advances from customers towards plant costs (Chemours and the Nectar customer\'s added molecule). That is a good sign of customer commitment, but it also means part of the capex is effectively pre-paid revenue that must be delivered.' },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: a 27% promoter, and foreign funds buying while LIC sells',
  blocks: [
    { pair: [
      { type: 'line', title: 'FIIs up from 15.9% to 23.7% in 2.5 years', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoter (Mafatlal family) at ~27%, diluted by the QIP', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 20, max: 32, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY18–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 15 }, hl: true },
      { key: 'ebitda', name: 'EBITDA', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 250 } },
      { key: 'dep', name: 'Depreciation' },
      { key: 'otherIncome', name: 'Other income' },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit', hl: true, flag: { type: 'pct', th: 25 } },
      { key: 'eps', name: 'EPS (₹)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' },
      { key: 'capex', name: 'Capex' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 20 }, hl: true },
      { key: 'ebitda', name: 'EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' },
      { key: 'otherIncome', name: 'Other income' },
      { key: 'interest', name: 'Interest' },
      { key: 'pat', name: 'Net profit', hl: true },
    ] } },
  ],
};

const statementNotes = {};

module.exports = { financials, capital, balance, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  const B = fs.existsSync(path.join(__dirname, 'NAVINFLUOR.research.js')) ? require('./NAVINFLUOR.research') : null;
  const report = {
    symbol: 'NAVINFLUOR', listing: 'NSE: NAVINFLUOR · BSE: 532504', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Chemicals',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
