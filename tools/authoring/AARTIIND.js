// Authoring source for the Aarti Industries initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated, NET of GST).
// Part B (AARTIIND.research.js) adds business, history, industry, value chains, energy, contracts,
// moat, earnings quality, ownership, governance, forecasts, street, valuation and verdict chapters.
// Usage: node tools/authoring/AARTIIND.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'AARTIIND', 'research');
const SCR = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8')).tables.ratios;
const RL = SCR.periods.map(p => 'FY' + p.slice(-2));
const SRC = { co: 'Company filings, Screener.in (consolidated, revenue net of GST), GAM Research' };

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Revenue up 84% since FY21, EBITDA up only 19%: a decade of capex has not yet paid',
  blocks: [
    { p: 'Aarti\'s net revenue rose from ₹4,506 cr in FY21 to ₹8,286 cr in FY26 (13% a year), helped by new capacity and the fuel-additive (MMA) business. EBITDA did not follow: it peaked at ₹1,720 cr in FY22 (a year flattered by a one-off contract-termination receipt and by the pharma business, demerged in 2022), fell to ₹978 cr in FY24 and recovered only to ₹1,168 cr in FY26, just 19% above FY21. The EBITDA margin halved from 28% in FY22 to 14% in FY26 as Chinese oversupply cut prices across benzene-based chemicals and the fastest-growing product (MMA) carried a thin margin. Meanwhile depreciation and interest more than doubled, so net profit fell from ₹535 cr in FY21 to ₹419 cr in FY26.' },
    { pair: [
      { type: 'column', title: 'Net revenue: ₹8,286 cr in FY26, up 14%', unit: 'Revenue, net of GST (₹ crore)', x: 'fin.labels', from: 'FY19', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num', growth: true }], source: SRC.co },
      { type: 'column', title: 'EBITDA: still below the FY22 peak', unit: 'EBITDA (₹ crore)', x: 'fin.labels', from: 'FY19', to: 'FY26', series: [{ name: 'EBITDA', ref: 'fin.ebitda', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: from 28% (FY22) to 14%', unit: 'EBITDA margin (%)', x: 'fin.labels', from: 'FY19', to: 'FY26', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 0, max: 30, source: SRC.co },
      { type: 'column', title: 'Depreciation and interest now eat 70% of EBITDA', unit: '₹ crore', x: 'A.labels', from: 'FY19', series: [{ name: 'Depreciation', ref: 'A.dep', fmt: 'num' }, { name: 'Interest', ref: 'A.interest', fmt: 'num' }], labels: 'none', source: SRC.co },
    ] },
    { pair: [
      { type: 'column', title: 'Net profit: ₹419 cr in FY26, below FY21', unit: 'Net profit (₹ crore)', x: 'fin.labels', from: 'FY19', to: 'FY26', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'line', title: 'Return on capital employed: 22% → 7%', unit: 'ROCE (%)', x: RL, series: [{ name: 'ROCE', values: SCR.rows['ROCE %'], fmt: 'pct0' }], labels: 'all', min: 0, source: 'Screener.in' },
    ] },
    { callout: '**Our view:** Aarti has spent ~₹7,640 cr on capex over FY21-26 and its EBITDA is about where it was in FY21. ROCE of ~7% (CRISIL: 7.2%) is barely above Aarti\'s ~6% pre-tax borrowing cost and far below a ~13% cost of equity. The FY26 profit of ₹419 cr also benefited from a tax *credit* (effective tax −15%). The investment case rests on the new assets finally earning a return: the company targets ₹1,800-2,200 cr of EBITDA in FY28, 54-88% above FY26.' },
  ],
};

const seasons = {
  id: 'quarters', nav: 'Quarterly run-rate', kicker: 'Quarters', title: 'Quarters: a record Q1FY27, but inflated by prices, inventory and currency gains',
  blocks: [
    { p: 'Quarterly revenue has risen from ₹1,675 cr in Q1FY26 to ₹2,387 cr in Q1FY27 (+43%), and EBITDA from ₹212 cr to ₹382 cr. Read the Q1FY27 number carefully: management says revenue growth was "primarily driven by higher input prices passed on to customers" after the West Asia conflict lifted benzene, sulphur, methanol and aniline prices; volumes actually fell 12% from Q4FY26 (energy −17%, non-energy −7%). EBITDA was helped by ₹50-60 cr of inventory and currency gains (CEO estimate), so the underlying run-rate was roughly ₹320-330 cr, close to Q4FY26. Fuel additives (the energy business) are also seasonal: demand softens from late October to December as gasoline cracks weaken in winter.' },
    { pair: [
      { type: 'column', title: 'Quarterly revenue: a step up on input prices', unit: 'Revenue, net of GST (₹ crore)', x: 'Q.labels', series: [{ name: 'Revenue', ref: 'Q.sales', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'column', title: 'Quarterly EBITDA: ₹382 cr in Q1FY27 incl. ~₹50-60 cr of gains', unit: 'EBITDA (₹ crore)', x: 'Q.labels', series: [{ name: 'EBITDA', ref: 'Q.ebitda', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: 12-16%, never back to the old 20%+', unit: 'EBITDA margin (%)', x: 'Q.labels', series: [{ name: 'EBITDA margin', ref: 'Q.opm', fmt: 'pct0' }], labels: 'all', min: 0, max: 20, source: SRC.co },
      { type: 'column', title: 'Effective tax rate: negative for most of the last two years', unit: 'Tax as % of profit before tax', x: 'Q.labels', series: [{ name: 'Tax rate', ref: 'Q.taxPct', fmt: 'pct0' }], labels: 'all', source: SRC.co },
    ] },
    { callout: '**So what:** Q1FY27 annualised gives ~₹1,500 cr of EBITDA, but strip out the one-off gains and the run-rate is ~₹1,300 cr, still ~28% short of the low end of the FY28 target of ₹1,800 cr. Revenue growth is mostly price; if crude-linked raw-material prices fall, revenue falls too, and the inventory gains can turn into losses.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'Net debt has risen to ~₹4,200 cr (3.6x EBITDA) after six years of negative free cash flow',
  blocks: [
    { p: 'Aarti has funded its capex mostly with debt. Over FY21-26 it generated ₹5,940 cr of operating cash flow but spent ₹7,640 cr on capex, and free cash flow was negative in every year (−₹340 cr in FY26). Net debt rose from ₹2,381 cr in FY21 to ₹4,226 cr in FY26 (company: ~₹4,300 cr), or 3.6x EBITDA, against management\'s own target of below 2.5x. The FY26 balance sheet also shows ₹2,030 cr of capital work in progress, mostly the ~₹1,800 cr Zone IV project that is not yet earning. In Q1FY27 working capital rose again with input prices and exports, so debt and finance costs went up. Receivable days jumped from 39 to 62 in FY26 as exports to the US (2-3 month voyages, revenue booked on delivery) grew.' },
    { pair: [
      { type: 'column', title: 'Net debt: up ~1.8x since FY21', unit: 'Borrowings less cash and investments (₹ crore)', x: 'A.labels', from: 'FY19', series: [{ name: 'Net debt', ref: 'A.netDebt', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'column', title: 'Operating cash flow vs capex: capex ahead every year', unit: '₹ crore', x: 'A.labels', from: 'FY19', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }], labels: 'none', source: SRC.co },
    ] },
    { pair: [
      { type: 'line', title: 'Working-capital days: receivables up sharply in FY26', unit: 'Days', x: RL, series: [{ name: 'Receivable days', values: SCR.rows['Debtor Days'], fmt: 'num' }, { name: 'Inventory days', values: SCR.rows['Inventory Days'], fmt: 'num' }, { name: 'Payable days', values: SCR.rows['Days Payable'], fmt: 'num' }], labels: 'last', source: 'Screener.in' },
      { type: 'column', title: 'Capital work in progress (incl. intangibles under development): ₹2,187 cr waiting to earn', unit: 'CWIP (₹ crore)', x: 'A.labels', from: 'FY19', series: [{ name: 'CWIP', ref: 'A.cwip', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-22', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth', '{{A.netWorth.7|num}}', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}'],
      ['Borrowings', '{{A.borrowings.7|num}}', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}'],
      ['Cash and investments', '{{A.cashAndInvestments.7|num}}', '{{A.cashAndInvestments.9|num}}', '{{A.cashAndInvestments.10|num}}', '{{A.cashAndInvestments.11|num}}'],
      ['Net debt', '{{A.netDebt.7|num}}', '{{A.netDebt.9|num}}', '{{A.netDebt.10|num}}', '{{A.netDebt.11|num}}'],
      ['Net fixed assets', '{{A.fixedAssets.7|num}}', '{{A.fixedAssets.9|num}}', '{{A.fixedAssets.10|num}}', '{{A.fixedAssets.11|num}}'],
      ['Capital work in progress', '{{A.cwip.7|num}}', '{{A.cwip.9|num}}', '{{A.cwip.10|num}}', '{{A.cwip.11|num}}'],
      ['Inventories', '{{A.inventories.7|num}}', '{{A.inventories.9|num}}', '{{A.inventories.10|num}}', '{{A.inventories.11|num}}'],
      ['Trade receivables', '{{A.receivables.7|num}}', '{{A.receivables.9|num}}', '{{A.receivables.10|num}}', '{{A.receivables.11|num}}'],
    ], source: SRC.co } },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: Gogri-led promoter group at 41.8%, LIC and Indian funds the main outside holders',
  blocks: [
    { pair: [
      { type: 'line', title: 'DIIs up from 15.8% to 21.1%; FIIs down from 10.8% to 7.0%', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoter group: a slow drift down to 41.8%', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoter', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 35, max: 46, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY18–FY29E', rows: [
      { key: 'sales', name: 'Revenue (net of GST)', flag: { type: 'pct', th: 12 }, hl: true },
      { key: 'ebitda', name: 'EBITDA', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 200 } },
      { key: 'dep', name: 'Depreciation' },
      { key: 'otherIncome', name: 'Other income' },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit', hl: true, flag: { type: 'pct', th: 20 } },
      { key: 'eps', name: 'EPS (₹)', fmt: 'n1' },
      { key: 'capex', name: 'Capex' },
      { key: 'cfo', name: 'Cash from operations' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L', rows: [
      { key: 'sales', name: 'Revenue (net of GST)', yoy: true, flag: { type: 'pct', th: 15 }, hl: true },
      { key: 'ebitda', name: 'EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' },
      { key: 'interest', name: 'Interest' },
      { key: 'pat', name: 'Net profit', hl: true },
    ] } },
  ],
};

const statementNotes = {};

module.exports = { financials, seasons, balance, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  const B = fs.existsSync(path.join(__dirname, 'AARTIIND.research.js')) ? require('./AARTIIND.research') : null;
  const report = {
    symbol: 'AARTIIND', listing: 'NSE: AARTIIND · BSE: 524208', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Specialty Chemicals',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, seasons, balance, ownershipBase, statements }) : [financials, seasons, balance, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
