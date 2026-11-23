// Authoring source for the Laurus Labs initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated; Net Profit patched to the
// attributable basis by LAURUSLABS.patch.js). Part B (LAURUSLABS.research.js + part2-6, shared LAURUSLABS.ctx.js) adds
// the research chapters, cover, rating and statement notes. Usage: node tools/authoring/LAURUSLABS.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'LAURUSLABS', 'research');
const SJ = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8')), SCR = SJ.tables.ratios, PLT = SJ.tables['profit-loss'];
const EY = ['FY19', 'FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'], epsRep = EY.map(y => PLT.rows['EPS in Rs'][PLT.periods.indexOf('Mar 20' + y.slice(2))]);
const RL = SCR.periods.map(p => 'FY' + p.slice(-2));
const SRC = { co: 'Company filings, Screener.in (consolidated), GAM Research' };
const MF = JSON.parse(fs.readFileSync(path.join(RD, '..', '..', '..', 'models', 'LAURUSLABS.json'), 'utf8')).forecast.F;
const nd = i => Math.round(-MF.treasury[i]).toLocaleString('en-IN');

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Four acts: an ARV ingredient maker to FY20, a three-year boom, a one-year bust, and a CDMO-led rebuild that has now passed the old peak',
  blocks: [
    { p: 'Laurus grew revenue from ₹1,327 cr in FY15 to ₹2,832 cr in FY20 (~16% a year) as an anti-retroviral (ARV) ingredient maker earning 15-21% EBITDA margins. FY21 changed everything: revenue jumped 70% to ₹4,814 cr on an ARV formulation and API surge, the margin hit 32% and EPS rose from ₹4.8 to ₹18.3. FY22-23 held revenue up, FY23 helped by one very large contract-manufacturing order, but ARV prices were already falling. When that order ended in FY24, revenue fell 17%, the margin collapsed to 15.5% and EPS to ₹3.0, with new plants adding cost before revenue. The rebuild since has been led by contract manufacturing for innovators (CDMO): revenue +10% in FY25 and +23% in FY26 to ₹6,813 cr, margin 26.2%, EPS ₹16.5. Q1FY27 EPS of ₹6.8 takes trailing EPS to ~₹20, above the FY21 peak for the first time.' },
    { pair: [
      { type: 'column', title: 'Revenue: the FY21 jump, the FY24 drop, a new high in FY26', unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY15', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'line', title: 'EBITDA margin: 32% at the peak, 15.5% in the trough, 26% in FY26', unit: 'EBITDA margin (%)', x: 'fin.labels', from: 'FY15', to: 'FY26', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 0, max: 40, source: SC_NOTE() },
    ] },
    { pair: [
      { type: 'column', title: 'EPS: ₹18.3 at the peak, ₹3.0 three years later, ₹16.5 in FY26', unit: '₹ per share', x: EY, series: [{ name: 'Reported EPS', values: epsRep, fmt: 'n1' }], labels: 'all', source: 'Screener.in; FY25 includes a ₹39 cr after-tax land-sale gain (₹0.7 a share)' },
      { type: 'line', title: 'Return on equity: 45% at the peak, 4% in the trough, 18% now', unit: 'Return on equity (%)', x: 'fin.labels', from: 'FY15', to: 'FY26', series: [{ name: 'ROE', ref: 'fin.roe', fmt: 'pct' }], labels: 'all', min: 0, max: 50, source: SRC.co },
    ] },
    { callout: '**Our view:** Laurus has compounded revenue at ~14% a year for a decade, but its profits swing far more than its revenue because it runs a high fixed-cost plant base: a 17% revenue fall in FY24 cut EPS by 80%. The same operating leverage works in reverse now, which is why FY26-27 earnings have risen so fast. History says one big product or contract can flatter two years badly, so we treat the Q1FY27 margin with care.' },
  ],
};
function SC_NOTE() { return 'Screener.in (EBITDA before other income); company EBITDA includes other income'; }

const seasons = {
  id: 'seasons', nav: 'Quarterly pattern', kicker: 'Quarters', title: 'No seasonality to speak of, but lumpy: CDMO deliveries and ARV tenders move quarters, and the margin has climbed for nine quarters',
  blocks: [
    { p: 'Laurus has no true seasonality. Quarters move with CDMO shipment timing (customers order campaigns, not monthly volumes) and with ARV tender deliveries, which pushed formulations to ₹607 cr in Q3FY26 and back to ₹451 cr in Q4. The trend matters more than the pattern: the EBITDA margin rose from ~14% in Q1FY25 to 31.5% in Q1FY27 as CDMO revenue rose from ₹214 cr to ₹835 cr a quarter, gross margin climbed from 55% to 62.7% and fixed costs were spread over more revenue.' },
    { pair: [
      { type: 'column', title: 'Quarterly revenue: a step up to ₹2,026 cr in Q1FY27', unit: 'Revenue (₹ crore)', x: 'Q.labels', series: [{ name: 'Revenue', ref: 'Q.sales', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'line', title: 'Quarterly EBITDA margin: 14% to 32% in two years', unit: 'EBITDA margin (%)', x: 'Q.labels', series: [{ name: 'EBITDA margin', ref: 'Q.opm', fmt: 'pct0' }], labels: 'all', min: 0, max: 40, source: SRC.co },
    ] },
    { callout: '**What to watch:** whether CDMO revenue holds near ₹700-900 cr a quarter once Phase III and launch stocking (45% of Q1 CDMO revenue) normalises, and whether the margin stays near 30% as new plants start depreciating. Q2FY27 results are due by mid-November 2026.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'Net debt of ₹2,300-2,700 cr, working capital at ~260 days, and a decade in which capex has absorbed almost all the cash the business made',
  blocks: [
    { p: 'Laurus has funded its growth with debt and reinvestment, not equity. Net debt was ₹2,285 cr at Mar-2026 (1.25x EBITDA) and ₹2,656 cr at Jun-2026 (1.28x) as capex picked up. Free cash flow (operating cash flow less capex) was close to zero in every year from FY21 to FY25 and only turned clearly positive in FY26 (₹554 cr), helped by higher profit and customer advances (₹645 cr at Mar-2026 vs ₹395 cr a year earlier). Working capital is heavy: inventory ~317 days of material cost and receivables ~115 days (Screener), a cash conversion cycle of ~263 days. CARE (3-Jul-2026) rates the bank debt AA (Stable) and calls liquidity strong, with ~60% use of ₹2,000 cr of working-capital lines.' },
    { pair: [
      { type: 'line', title: 'Inventory and receivable days: high, and higher than before the boom', unit: 'Days', x: RL, series: [{ name: 'Inventory days', values: SCR.rows['Inventory Days'], fmt: 'num' }, { name: 'Receivable days', values: SCR.rows['Debtor Days'], fmt: 'num' }, { name: 'Payable days', values: SCR.rows['Days Payable'], fmt: 'num' }], labels: 'last', source: 'Screener.in (consolidated; inventory and payables on material cost)' },
      { type: 'column', title: 'Net debt: up through the bust, down a little in FY26', unit: 'Borrowings less cash and investments (₹ crore)', x: 'A.labels', from: 'FY17', series: [{ name: 'Net debt', ref: 'A.netDebt', fmt: 'num' }], labels: 'all', source: 'Screener.in (includes lease liabilities; investments are mostly stakes in associates and the KRKA JV)' },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-22', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth (owners)', '{{A.netWorth.7|num}}', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}'],
      ['Borrowings (incl. leases)', '{{A.borrowings.7|num}}', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}'],
      ['Cash and investments', '{{A.cashAndInvestments.7|num}}', '{{A.cashAndInvestments.9|num}}', '{{A.cashAndInvestments.10|num}}', '{{A.cashAndInvestments.11|num}}'],
      ['Inventories', '{{A.inventories.7|num}}', '{{A.inventories.9|num}}', '{{A.inventories.10|num}}', '{{A.inventories.11|num}}'],
      ['Trade receivables', '{{A.receivables.7|num}}', '{{A.receivables.9|num}}', '{{A.receivables.10|num}}', '{{A.receivables.11|num}}'],
      ['Trade payables', '{{A.payables.7|num}}', '{{A.payables.9|num}}', '{{A.payables.10|num}}', '{{A.payables.11|num}}'],
      ['Net fixed assets', '{{A.fixedAssets.7|num}}', '{{A.fixedAssets.9|num}}', '{{A.fixedAssets.10|num}}', '{{A.fixedAssets.11|num}}'],
      ['Capital work in progress', '{{A.cwip.7|num}}', '{{A.cwip.9|num}}', '{{A.cwip.10|num}}', '{{A.cwip.11|num}}'],
    ], source: SRC.co } },
    { callout: `**Cash in the model:** the forecast "cash & investments" row is net of borrowings, so it is negative: net debt on Screener\'s basis rises from ₹2,095 cr at Mar-2026 to about ₹${nd(0)} cr at Mar-2027E because of the ₹2,000 cr capex, then falls to ~₹${nd(1)} cr and ~₹${nd(2)} cr in FY28-29E as the plants earn. Screener counts ₹309 cr of investments (mostly stakes in associates and the KRKA JV) as cash, so the engine\'s net debt is ~₹300 cr lower than a strict figure; it changes the EV cross-check by ~₹6 a share. Customer advances sit in other liabilities, so the model treats them as working capital, not debt.` },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: promoters 27.5%, foreign funds 28%, domestic institutions 14%, and a large retail base',
  blocks: [
    { pair: [
      { type: 'line', title: 'Foreign funds up to 28% in Jun-2026; domestic institutions ~14%', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoters steady at ~27.5%', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoter', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 20, max: 35, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY15–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 15 }, hl: true },
      { key: 'ebitda', name: 'EBITDA (before other income)', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 300 } },
      { key: 'dep', name: 'Depreciation' },
      { key: 'otherIncome', name: 'Other income (incl. exceptionals in actuals)' },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit (attributable)', hl: true, flag: { type: 'pct', th: 20 } },
      { key: 'eps', name: 'EPS (₹)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' },
      { key: 'capex', name: 'Capex' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 20 }, hl: true },
      { key: 'ebitda', name: 'EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' },
      { key: 'otherIncome', name: 'Other income' },
      { key: 'dep', name: 'Depreciation' },
      { key: 'pat', name: 'Net profit (attributable)', hl: true },
    ] } },
  ],
};

const statementNotes = {};

module.exports = { financials, seasons, balance, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  const B = fs.existsSync(path.join(__dirname, 'LAURUSLABS.research.js')) ? require('./LAURUSLABS.research') : null;
  const report = {
    symbol: 'LAURUSLABS', listing: 'NSE: LAURUSLABS · BSE: 540222', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Pharmaceuticals & CDMO',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, seasons, balance, ownershipBase, statements }) : [financials, seasons, balance, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
