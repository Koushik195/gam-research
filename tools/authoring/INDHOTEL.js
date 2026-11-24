// Authoring source for The Indian Hotels Company (IHCL) initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file + INDHOTEL.partA2.js): chapters built on reported financials (Screener, consolidated; INDHOTEL.patch.js puts
// Net Profit on the attributable basis, so Screener's FY26 profit ÷ EPS = 142.35 cr shares = the actual 142.34 cr).
// Part B (INDHOTEL.research.js + part2-6, shared INDHOTEL.ctx.js / ctx2.js) adds the research chapters.
// Usage: node tools/authoring/INDHOTEL.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'INDHOTEL', 'research');
const SCR = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8')).tables.ratios;
const RL = SCR.periods.map(p => 'FY' + p.slice(-2));
const SRC = { co: 'Company filings, Screener.in (consolidated, post-Ind AS 116; profit attributable to owners), GAM Research' };

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Revenue more than doubled from pre-Covid and margins rose by 11 points; profit before one-offs grew ~25% a year since FY23',
  blocks: [
    { p: 'Consolidated revenue was ₹4,463 cr in FY20, collapsed to ₹1,575 cr in FY21 (Covid) and reached ₹9,689 cr in FY26: 19% a year over FY23-26. Part of the recent growth is bought or consolidated: TajSATS became a subsidiary in Aug-2024 (₹717 cr of revenue in FY25, ₹1,210 cr in FY26), ANK/Pride joined in Dec-2025, Atmantan in Jan-2026 and Brij in Apr-2026. The hotel business alone grew from ₹6,769 cr (FY24) to ₹8,487 cr (FY26), 12% a year. Operating EBITDA margin moved from 22% (FY20) to 31% (FY23) and 33% (FY26) as room rates rose faster than costs and management fees (almost all profit) grew. Profit attributable to owners before exceptional items went from ₹956 cr (FY23) to ₹1,849 cr (FY26); reported profit is higher (₹2,084 cr) because of a ₹399 cr gain on selling the Taj GVK stake.' },
    { pair: [
      { type: 'column', title: 'Revenue: from ₹4,463 cr pre-Covid to ₹9,689 cr', unit: 'Revenue from operations, consolidated (₹ crore)', x: 'fin.labels', from: 'FY19', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num', growth: true }], source: SRC.co },
      { type: 'column', title: 'Attributable profit: losses in FY21-22, a record ₹2,084 cr in FY26', unit: 'Net profit attributable to owners, reported (₹ crore)', x: 'fin.labels', from: 'FY19', to: 'FY26', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { pair: [
      { type: 'line', title: 'Operating EBITDA margin: 22% before Covid, 33% now', unit: 'Operating EBITDA margin, consolidated (%)', x: 'fin.labels', from: 'FY19', to: 'FY26', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', source: SRC.co },
      { type: 'hbar', title: 'Staff and "other" costs take over half of revenue', unit: 'FY26 costs and EBITDA, % of consolidated revenue (₹9,689 cr)', x: ['Food and materials', 'Employees', 'Other expenses (power, license fees, repairs, marketing)', 'Operating EBITDA'], series: [{ name: 'Share', values: [9.8, 25.7, 31.5, 33.0], fmt: 'pct' }], labels: 'all', highlight: 'Operating EBITDA', source: 'Screener.in cost schedule (FY26)' },
    ] },
    { callout: '**Our view:** this is the best-run large hotel company in India, and the post-Covid profit recovery is real: margins are 11 points above FY20 and the balance sheet went from net debt to ~₹4,300 cr of net cash. But three things flatter the headline growth: consolidation of TajSATS, acquisitions, and exceptional gains in each of the last two years. On a like-for-like basis the hotels grow at high single digits to low double digits.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capex & returns', kicker: 'Capital allocation', title: 'Cash generation funds renovations, acquisitions and rising dividends; returns are up but still well below the 20% target',
  blocks: [
    { p: 'IHCL turns ~78% of operating EBITDA into operating cash (FY26: ₹2,471 cr of ₹3,196 cr). Capex was ₹637 cr in FY24 and ~₹1,050 cr a year in FY25-26 (₹2,500 cr+ over three years: Taj Mahal Palace, Taj Palace Delhi, The President, Fort Aguada, Varanasi expansion, Ekta Nagar), and the company guides ₹1,100-1,300 cr for FY27. Acquisitions took ~₹420 cr in FY26 (ANK/Pride ₹190 cr, Atmantan ₹232 cr) and ~₹222 cr in Apr-2026 (Brij), partly funded by the ₹592 cr Taj GVK sale. Dividends rose from ₹155 cr (FY24) to ₹342 cr (FY26). The company\'s pre-tax ROCE was 13% in FY23 and 17.4% in FY26; the Accelerate 2030 target is 20%+, which needs more managed hotels and fewer rupees per key on the balance sheet.' },
    { pair: [
      { type: 'column', title: 'Operating cash covers capex about twice over', unit: '₹ crore', x: 'A.labels', from: 'FY21', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }], labels: 'none', source: SRC.co },
      { type: 'line', title: 'Company ROCE: 5% (FY17) to 17% (FY26)', unit: 'Pre-tax ROCE, company definition (%); ROE before exceptional items', x: ['FY17', 'FY20', 'FY23', 'FY26'], series: [{ name: 'ROCE (company)', values: [5, 7, 13, 17.4], fmt: 'pct' }, { name: 'ROE (company)', values: [null, 7, 13, 16], fmt: 'pct' }], labels: 'all', min: 0, max: 25, source: 'Q4FY26 deck slide 32; AR FY26 p.14 (17.4%)' },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went (₹ crore)', head: ['', 'FY25', 'FY26', 'Two years'], rows: [
      ['Cash from operations (Screener)', '{{A.cfo.10|num}}', '{{A.cfo.11|num}}', '4,665'],
      ['Capex (fixed assets)', '1,074', '1,037', '2,111'],
      ['Acquisitions (ANK/Pride ₹190 cr, Atmantan ₹232 cr)', '–', '422', '422'],
      ['Sale of the Taj GVK stake', '–', '+592', '+592'],
      ['Dividends paid', '{{A.dividendsPaid.10|num}}', '{{A.dividendsPaid.11|num}}', '594'],
      { hl: true, cells: ['**Left over (before lease payments and other items)**', '**868**', '**1,262**', '**2,130**'] },
      ['Memo: company gross cash at year end', '3,073', '4,345', ''],
    ], source: 'Screener.in cash flow; AR FY26 note 28-29; Q4FY26 deck slide 30 (gross cash ₹3,073 cr → ₹4,345 cr, free cash flow ₹1,450 cr)' } },
    { callout: '**The capital question:** IHCL can fund ₹1,100-1,300 cr of capex, ₹400-500 cr of dividends and bolt-on deals from cash flow and still add to its ₹4,400 cr cash pile. The risk is not the balance sheet but returns: owned luxury keys cost ₹2-4 cr each to build and renovations are now a permanent ~₹650 cr a year. Every new owned project (Bandstand ~450 keys, Shiroda, Lakshadweep) dilutes ROCE for years before it adds to it.' },
  ],
};

module.exports = { financials, capital, RD, SRC, SCR, RL };
Object.assign(module.exports, require('./INDHOTEL.partA2'));

if (require.main === module) {
  const P = module.exports;
  const B = fs.existsSync(path.join(__dirname, 'INDHOTEL.research.js')) ? require('./INDHOTEL.research') : null;
  const parts = { financials: P.financials, capital: P.capital, balance: P.balance, ownershipBase: P.ownershipBase, statements: P.statements };
  const report = {
    symbol: 'INDHOTEL', listing: 'NSE: INDHOTEL · BSE: 500850', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Consumer services',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections(parts) : Object.values(parts),
    statementNotes: { ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
