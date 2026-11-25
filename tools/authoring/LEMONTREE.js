// Authoring source for the Lemon Tree Hotels initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file + LEMONTREE.partA2.js): chapters built on reported financials (Screener, consolidated; LEMONTREE.patch.js puts
// Net Profit on the attributable basis, so Screener's FY26 profit ÷ EPS = 79.09 cr shares vs the actual 79.22 cr).
// Part B (LEMONTREE.research.js + part2-6, shared LEMONTREE.ctx.js / ctx2.js) adds the research chapters.
// Usage: node tools/authoring/LEMONTREE.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'LEMONTREE', 'research');
const SRC = { co: 'Company filings, Screener.in (consolidated, post-Ind AS 116; profit attributable to owners), GAM Research' };

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Revenue 2.2x pre-Covid and margins up from ~36% to ~48%; but margins have slipped for two years and a fifth of the profit goes to minorities',
  blocks: [
    { p: 'Consolidated revenue was ₹669 cr in FY20, fell to ₹252 cr in FY21 (Covid) and reached ₹1,444 cr in FY26. The rebound was fast (FY23 ₹875 cr, +118%; FY24 ₹1,071 cr, +22%; FY25 ₹1,286 cr, +20%) as Aurika Mumbai Skycity opened in Oct-2023 and room rates rose. FY26 grew 12%. Operating EBITDA margin jumped from 36% in FY20 to 51% in FY23, then eased to 49% in FY24-25 and **47.8% in FY26**, because Lemon Tree expensed a large renovation programme, invested in technology and lost GST input credit on rooms below ₹7,500 (together 5.8% of revenue in FY26). Profit attributable to shareholders was ₹197 cr in FY25 and ₹227 cr in FY26 (₹245 cr before the labour-code charge); minorities (Fleur Hotels\' outside shareholder) took another ₹61 cr.' },
    { pair: [
      { type: 'column', title: 'Revenue: ₹669 cr pre-Covid, ₹1,444 cr in FY26', unit: 'Revenue from operations, consolidated (₹ crore)', x: 'fin.labels', from: 'FY19', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num', growth: true }], source: SRC.co },
      { type: 'column', title: 'Attributable profit: losses in FY20-22, ₹227 cr in FY26', unit: 'Net profit attributable to owners, reported (₹ crore)', x: 'fin.labels', from: 'FY19', to: 'FY26', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { pair: [
      { type: 'line', title: 'Operating EBITDA margin: 36% before Covid, 51% at the peak, 48% now', unit: 'Operating EBITDA margin, consolidated (%)', x: 'fin.labels', from: 'FY19', to: 'FY26', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', source: SRC.co },
      { type: 'column', title: 'Interest and depreciation still take almost half of EBITDA', unit: 'FY26, ₹ crore (consolidated)', x: ['Operating EBITDA', 'Finance cost (bank + leases)', 'Depreciation', 'Tax', 'Minorities', 'Attributable profit'], series: [{ name: '₹ cr', values: [690, 180, 139, 71, 61, 227], fmt: 'num' }], labels: 'all', highlight: 'Attributable profit', source: 'Screener.in; Q4FY26 deck slide 16 (exceptional charge of ₹33 cr and other income not shown)' },
    ] },
    { callout: '**Our view:** Lemon Tree\'s owned hotels are among the most profitable mid-market assets in India, and the post-Covid recovery is real: EBITDA is 2.9x FY20. But the last two years have been about spending (renovation, technology) and a tax change, not growth in margins. The equity story now rests on two promises: margins back to ~50% in FY28 and a fee business that compounds as ~5,000 signed rooms open. Before shareholders see the profit, interest, depreciation and Warburg Pincus\'s 41% of Fleur take a large share.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capex & returns', kicker: 'Capital allocation', title: 'Capex has fallen to ~₹100 cr a year and free cash repays debt; the next big spending decision moves to Fleur and Warburg',
  blocks: [
    { p: 'The heavy spending is behind Lemon Tree: capex was ₹644 cr in FY20 (Aurika Mumbai and other projects) and ₹331 cr in FY24, then ₹96 cr in FY25 and ₹138 cr in FY26 (Screener). Operating cash flow was ₹542 cr in both FY25 and FY26 (79-86% of EBITDA), so free cash flow of ₹406-448 cr a year has gone to debt: bank debt fell from ₹1,699 cr (Mar-25) to ₹1,500 cr (Mar-26) and ₹1,475 cr (Jun-26), and the cost of debt from 8.57% to 7.48%. No dividend has ever been paid. CRISIL expects ₹90-100 cr of capex a year in FY27-29 (Aurika Shimla, Shillong, Varanasi). The larger plan, ~₹2,500-3,000 cr of acquisitions and developments, will be made by Fleur with Warburg Pincus\'s up to ₹960 cr and new debt; none of it is committed, and none is in our numbers.' },
    { pair: [
      { type: 'column', title: 'Operating cash has covered capex every year since FY22', unit: '₹ crore', x: 'A.labels', from: 'FY19', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }], labels: 'none', source: SRC.co },
      { type: 'line', title: 'ROE ~18% on a thin equity base; ROCE only 14%', unit: 'ROE (attributable) and ROCE, consolidated (%)', x: 'A.labels', from: 'FY19', series: [{ name: 'ROE', ref: 'A.roe', fmt: 'pct' }, { name: 'ROCE (Screener)', ref: 'A.roce', fmt: 'pct' }], labels: 'last', source: 'Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went (₹ crore)', head: ['', 'FY24', 'FY25', 'FY26'], rows: [
      ['Cash from operations (Screener)', '{{A.cfo.9|num}}', '{{A.cfo.10|num}}', '{{A.cfo.11|num}}'],
      ['Capex (fixed assets)', '{{A.capex.9|num}}', '{{A.capex.10|num}}', '{{A.capex.11|num}}'],
      { hl: true, cells: ['**Free cash flow (no dividends paid)**', '{{A.fcf.9|num}}', '{{A.fcf.10|num}}', '{{A.fcf.11|num}}'] },
      ['Borrowings incl. leases at year end', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}'],
      ['Memo: bank debt (company)', 'n.a.', '1,699', '1,500'],
    ], source: 'Screener.in cash flow and balance sheet; Q4FY26 deck slide 17' } },
    { callout: '**The capital question:** Lemon Tree itself needs little capital now. The question is what Fleur does with Warburg\'s money and up to ~₹1,300 cr of new debt: management talks of buying operating hotels at 6-8x EBITDA and building in "demand-dense" cities, with Fleur\'s ROCE at ~12.5-13% today and a 15% target. After the scheme, Lemon Tree shareholders will own ~74% of Fleur directly and indirectly, so they carry most of that risk.' },
  ],
};

module.exports = { financials, capital, RD, SRC };
Object.assign(module.exports, require('./LEMONTREE.partA2'));

if (require.main === module) {
  const P = module.exports;
  const B = fs.existsSync(path.join(__dirname, 'LEMONTREE.research.js')) ? require('./LEMONTREE.research') : null;
  const parts = { financials: P.financials, capital: P.capital, balance: P.balance, ownershipBase: P.ownershipBase, statements: P.statements };
  const report = {
    symbol: 'LEMONTREE', listing: 'NSE: LEMONTREE · BSE: 541233', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Consumer services',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections(parts) : Object.values(parts),
    statementNotes: { ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
