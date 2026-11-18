// Authoring source for the Berger Paints India initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated, bonus-adjusted).
// Part B (BERGEPAINT.research.js + part2-4, shared BERGEPAINT.ctx.js) adds the research chapters.
// Usage: node tools/authoring/BERGEPAINT.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'BERGEPAINT', 'research');
const SCR = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8')).tables.ratios;
const RL = SCR.periods.map(p => 'FY' + p.slice(-2));
const SRC = { co: 'Company filings, Screener.in (consolidated), GAM Research' };

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Ten years: revenue up 2.8x, but the last three years added only 4% a year',
  blocks: [
    { p: 'Berger\'s revenue grew from ₹4,223 cr in FY16 to ₹11,880 cr in FY26, about 11% a year, and net profit from ₹371 cr to ₹1,128 cr, also about 11-12% a year. The decade splits in two. Up to FY23 growth was strong: revenue jumped 29% in FY22 and 21% in FY23 as demand came back after Covid and the industry raised prices to pass on raw-material inflation. Since then revenue grew only 6%, 3% and 3% (FY24-26), even though volumes grew 7-9% a year: prices were cut in economy emulsions, the mix moved to cheaper products (putty, textures, tile adhesives), and new competitors (Birla Opus from 2024) pushed dealer schemes up. Profit followed: up 36% in FY24 when input costs fell, then flat in FY25 and down 5% in FY26 (including a ₹53 cr Labour Code charge).' },
    { pair: [
      { type: 'column', title: 'Revenue: fast to FY23, then 3-6% a year', unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'column', title: 'Net profit: a step up in FY24, flat since', unit: 'Net profit (₹ crore)', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: 14-17% for a decade', unit: 'EBITDA margin (%)', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 10, max: 20, source: SRC.co },
      { type: 'column', title: 'Growth: price did the work in FY22-23, volume since', unit: 'Revenue growth, year on year (%)', x: 'fin.labels', from: 'FY17', to: 'FY26', series: [{ name: 'Revenue growth', ref: 'fin.salesGrowth', fmt: 'pct' }], labels: 'all', source: SRC.co },
    ] },
    { callout: '**Our view:** Berger is a steady compounder of volume (high single digits most years), but in paints the value line is set by the industry\'s pricing. When raw materials spike, everyone raises prices and revenue jumps (FY22-23, Q1FY27); when they fall or a new entrant buys share, prices drift down and revenue lags volume (FY24-26). The EBITDA margin has stayed in a 14-17% band through all of it, the band management still guides to. We do not assume it breaks out.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capex & returns', kicker: 'Capital allocation', title: 'Returns falling from ~28% to ~22%, and a ₹1,800-2,000 cr plant build-out ahead',
  blocks: [
    { p: 'Over FY15-26 Berger generated ₹9,899 cr of operating cash, spent ₹4,504 cr on capex and paid ₹2,925 cr of dividends. Capex came in waves: ₹1,522 cr in FY22-23, then ₹275-518 cr a year. The next wave is bigger: two plants at Panagarh (West Bengal) and Khordha (Odisha) for ₹1,800-2,000 cr together, with Panagarh due to start at the end of FY27. Management guides to ₹600-800 cr of capex in FY27 and CRISIL expects ~₹1,000 cr a year for the next few years. ROCE has drifted from 27-31% (FY16-21, FY24) to 22% in FY26 as value growth stalled; ROE was 17.3% in FY26 against an 11.3% cost of equity.' },
    { pair: [
      { type: 'column', title: 'Cash from operations covers capex and dividends', unit: '₹ crore', x: 'A.labels', from: 'FY17', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }], labels: 'none', source: SRC.co },
      { type: 'line', title: 'ROCE: from ~30% to 22%', unit: 'Return on capital employed (%)', x: RL, series: [{ name: 'ROCE', values: SCR.rows['ROCE %'], fmt: 'pct0' }], labels: 'all', min: 0, max: 40, source: 'Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went (₹ crore)', head: ['', 'FY21-23', 'FY24-26', 'Six years'], rows: [
      ['Cash from operations', '2,338', '4,400', '6,738'],
      ['Capex', '1,708', '1,222', '2,930'],
      ['Dividends paid', '602', '1,162', '1,764'],
      { hl: true, cells: ['**Left over**', '**28**', '**2,016**', '**2,044**'] },
      ['Memo: cash and investments at the end', '{{A.cashAndInvestments.8|num}}', '{{A.cashAndInvestments.11|num}}', ''],
    ], source: 'Screener.in cash flow (consolidated)' } },
    { callout: '**The capital question:** the new plants add capacity for 10+ years of growth and lower freight to the East, Berger\'s strongest region. But they arrive when Birla Opus and JSW have also added large capacity. We model capex of {{F.capex.0|num}} / {{F.capex.1|num}} / {{F.capex.2|num}} cr (FY27-29E), all from cash; ROE stays near 18-19% only if volumes keep growing ~9% a year. There is no buyback plan (MD, Feb-2026); dividends are ~40% of profit.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'Net cash, but inventory-heavy: five months of stock on hand',
  blocks: [
    { p: 'Berger is net cash: the company reports ₹1,198 cr at Mar-2026 and ₹1,424 cr at Jun-2026 (₹992 cr a year earlier). On Screener\'s basis (cash and investments less borrowings, which include leases) it was ₹859 cr at Mar-2026. CRISIL rates it AAA/Stable (reaffirmed 28-Aug-2026) with gearing of ~0.1x and interest cover of 34x. Working capital is the heavy item: inventory of ~144 days of revenue and receivables of ~48 days, against payables of ~105 days, so the cash conversion cycle was 87 days in FY26, up from 73 in FY24. Paint companies carry many SKUs and shades and stock dealers ahead of the festive season; Berger\'s cycle is long even by that standard.' },
    { pair: [
      { type: 'line', title: 'Working-capital days: inventory ~140-145 days', unit: 'Days (of revenue)', x: RL, series: [{ name: 'Inventory days', values: SCR.rows['Inventory Days'], fmt: 'num' }, { name: 'Receivable days', values: SCR.rows['Debtor Days'], fmt: 'num' }, { name: 'Payable days', values: SCR.rows['Days Payable'], fmt: 'num' }], labels: 'last', source: 'Screener.in' },
      { type: 'column', title: 'Cash and investments rebuilt since FY23', unit: 'Cash and investments (₹ crore)', x: 'A.labels', from: 'FY17', series: [{ name: 'Cash and investments', ref: 'A.cashAndInvestments', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-22', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth', '{{A.netWorth.7|num}}', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}'],
      ['Borrowings (incl. leases)', '{{A.borrowings.7|num}}', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}'],
      ['Cash and investments (incl. JV holdings)', '{{A.cashAndInvestments.7|num}}', '{{A.cashAndInvestments.9|num}}', '{{A.cashAndInvestments.10|num}}', '{{A.cashAndInvestments.11|num}}'],
      ['Net fixed assets', '{{A.fixedAssets.7|num}}', '{{A.fixedAssets.9|num}}', '{{A.fixedAssets.10|num}}', '{{A.fixedAssets.11|num}}'],
      ['Capital work in progress', '{{A.cwip.7|num}}', '{{A.cwip.9|num}}', '{{A.cwip.10|num}}', '{{A.cwip.11|num}}'],
      ['Inventories', '{{A.inventories.7|num}}', '{{A.inventories.9|num}}', '{{A.inventories.10|num}}', '{{A.inventories.11|num}}'],
      ['Trade receivables', '{{A.receivables.7|num}}', '{{A.receivables.9|num}}', '{{A.receivables.10|num}}', '{{A.receivables.11|num}}'],
      ['Trade payables', '{{A.payables.7|num}}', '{{A.payables.9|num}}', '{{A.payables.10|num}}', '{{A.payables.11|num}}'],
    ], source: SRC.co } },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: the Dhingra family at 75%, foreign funds have halved',
  blocks: [
    { pair: [
      { type: 'line', title: 'Foreign funds sold, Indian institutions bought', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoters fixed at the 75% ceiling', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 50, max: 80, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY15–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 12 }, hl: true },
      { key: 'ebitda', name: 'EBITDA', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 150 } },
      { key: 'dep', name: 'Depreciation' },
      { key: 'otherIncome', name: 'Other income (incl. JV share)' },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit', hl: true, flag: { type: 'pct', th: 20 } },
      { key: 'eps', name: 'EPS (₹, bonus-adjusted)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' },
      { key: 'capex', name: 'Capex' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 10 }, hl: true },
      { key: 'ebitda', name: 'EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' },
      { key: 'otherIncome', name: 'Other income' },
      { key: 'dep', name: 'Depreciation' },
      { key: 'pat', name: 'Net profit', hl: true },
    ] } },
  ],
};

const statementNotes = {};

module.exports = { financials, capital, balance, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  const B = fs.existsSync(path.join(__dirname, 'BERGEPAINT.research.js')) ? require('./BERGEPAINT.research') : null;
  const report = {
    symbol: 'BERGEPAINT', listing: 'NSE: BERGEPAINT · BSE: 509480', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Consumer & Building Materials',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
