// Authoring source for the Natco Pharma initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated Ind AS; FY26 EPS on the 179.11 mn shares
// in issue via NATCOPHARM.patch.js). Part B (NATCOPHARM.research.js + part2-6, shared NATCOPHARM.ctx.js / ctx2.js) adds the
// research chapters. NATCOPHARM.mult.js first syncs the derived multiples into assumptions.json.
// Usage: node tools/authoring/NATCOPHARM.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'NATCOPHARM', 'research');
const SCR = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8')).tables.ratios;
const keepR = SCR.periods.map(p => `${p.slice(-4)}-05-30` <= '2026-09-30');
const RL = SCR.periods.filter((_, i) => keepR[i]).map(p => 'FY' + p.slice(-2));
const RR = k => SCR.rows[k].filter((_, i) => keepR[i]);
const MOD = JSON.parse(fs.readFileSync(path.join(RD, '..', '..', '..', 'models', 'NATCOPHARM.json'), 'utf8')), A = MOD.annual;
const ix = l => A.labels.indexOf(l), sumOf = (k, from, to) => A.labels.slice(ix(from), ix(to) + 1).reduce((s, _, j) => s + (A[k][ix(from) + j] || 0), 0);
const n0 = v => Math.round(v).toLocaleString('en-IN');
const SRC = { co: 'Company filings, Screener.in (consolidated Ind AS; profit after the associate share), GAM Research' };
const cfo = sumOf('cfo', 'FY21', 'FY26'), capexS = sumOf('capex', 'FY21', 'FY26'), cfi = sumOf('cfi', 'FY21', 'FY26'), divs = sumOf('dividendsPaid', 'FY21', 'FY26');
const cfo3a = sumOf('cfo', 'FY21', 'FY23'), cfo3b = sumOf('cfo', 'FY24', 'FY26'), cap3a = sumOf('capex', 'FY21', 'FY23'), cap3b = sumOf('capex', 'FY24', 'FY26');
const cfi3a = sumOf('cfi', 'FY21', 'FY23'), cfi3b = sumOf('cfi', 'FY24', 'FY26'), div3a = sumOf('dividendsPaid', 'FY21', 'FY23'), div3b = sumOf('dividendsPaid', 'FY24', 'FY26');
const pat4 = sumOf('pat', 'FY23', 'FY26'), pat4pre = sumOf('pat', 'FY18', 'FY21');
const I = { 22: ix('FY22'), 24: ix('FY24'), 25: ix('FY25'), 26: ix('FY26') };

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Four windfall years: revenue doubled and profit rose 4x on gRevlimid; FY27 falls back to about the FY23 level',
  blocks: [
    { p: `Natco's numbers only make sense once you split out generic Revlimid (lenalidomide). Revenue went from ₹${n0(A.sales[ix('FY22')])} cr in FY22 to a peak of ₹${n0(A.sales[ix('FY25')])} cr in FY25, and EBITDA (Screener basis: before other income) from ₹${n0(A.ebitda[ix('FY22')])} cr to ₹${n0(A.ebitda[ix('FY25')])} cr, a 50% margin. EPS went from ₹9.2 to ₹104.4. Profit after tax was ₹${n0(pat4)} cr over FY23-FY26, ${(pat4 / pat4pre).toFixed(1)}x the ₹${n0(pat4pre)} cr of FY18-FY21. The base business underneath grew far more slowly. In FY26 the volume-limited period ended (unlimited generic entry from 31-Jan-2026): revenue fell 8% and EPS to ₹79.2, flattered by a ₹115 cr one-time tax credit. Q1FY27 EPS was ₹11.5, with almost no lenalidomide and 41% of profit coming from the new South African associate, Adcock Ingram.` },
    { pair: [
      { type: 'column', title: `Revenue: ₹${n0(A.sales[ix('FY22')])} cr in FY22, ₹${n0(A.sales[ix('FY25')])} cr at the FY25 peak`, unit: 'Revenue from operations (₹ crore)', x: 'fin.labels', from: 'FY17', to: 'FY29E', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'all', source: SRC.co + '; GAM estimates FY27-29E' },
      { type: 'column', title: 'Profit: the gRevlimid hump of FY23-FY26', unit: 'Net profit after the associate share (₹ crore)', x: 'fin.labels', from: 'FY17', to: 'FY29E', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.co + '. FY26 includes a ₹115 cr one-time deferred-tax credit' },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: 50% at the peak, 25% in FY27E', unit: 'EBITDA margin, Screener basis (before other income, %)', x: 'fin.labels', from: 'FY17', to: 'FY29E', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 0, max: 55, source: SRC.co + '; GAM estimates' },
      { type: 'line', title: 'Return on equity: 25% in FY25, ~8% in FY27E', unit: 'ROE (%), profit on average equity', x: 'fin.labels', from: 'FY17', to: 'FY29E', series: [{ name: 'ROE', ref: 'fin.roe', fmt: 'pct' }], labels: 'all', min: 0, max: 30, source: SRC.co + '; GAM estimates' },
    ] },
    { callout: '**Our view:** FY23-FY26 was a windfall, not a new base. Without lenalidomide Natco is a ~₹3,000 cr revenue business earning a mid-20s EBITDA margin, plus ₹200-235 cr a year of associate profit from Adcock. Our FY27E EPS of {{F.eps.0|inr}} ({{F.epsGrowth.0|chg}}) is close to management\'s ~₹750 cr profit guidance; FY28E ({{F.eps.1|inr}}) needs the two US exclusivity launches management promises for FY28.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capex, deals & returns', kicker: 'Capital allocation', title: 'The gRevlimid cash went into a minority stake in South Africa; then came a rights issue to repay the debt',
  blocks: [
    { p: `Over FY21-26 Natco generated ₹${n0(cfo)} cr of operating cash flow, spent ₹${n0(capexS)} cr on fixed assets and paid ₹${n0(divs)} cr of dividends. It bought back 3.45 mn shares in FY23-FY24 (open market). The big use of the windfall came at the end: ₹2,079 cr (ZAR3,873 mn plus ₹88 cr of costs) for 35.75% of Adcock Ingram in Nov-2025, and ~₹1,060 cr (ZAR1.81 bn) for another 13.25% in July 2026. That is ~₹3,140 cr for 49% of a company Natco does not control (Bidvest keeps 51%), part-funded by ₹400 cr of term debt in FY26 and more loans in FY27. On 25-Sep-2026 the board set a ₹1,279 cr rights issue at ₹750 a share, mainly to repay ₹810.5 cr of those loans. Management has said no to buybacks and wants "another very large transaction".` },
    { pair: [
      { type: 'column', title: 'Operating cash flow vs capex', unit: '₹ crore', x: 'A.labels', from: 'FY17', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }], labels: 'none', source: SRC.co },
      { type: 'line', title: 'ROCE: 33% in FY25, 17% in FY26', unit: 'Return on capital employed (%), Screener basis', x: RL, series: [{ name: 'ROCE', values: RR('ROCE %'), fmt: 'pct0' }], labels: 'all', min: 0, max: 40, source: 'Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went (₹ crore, Screener cash flow)', head: ['', 'FY21-23', 'FY24-26', 'Six years'], rows: [
      ['Cash from operations', n0(cfo3a), n0(cfo3b), n0(cfo)],
      ['Capex (fixed assets)', n0(cap3a), n0(cap3b), n0(capexS)],
      ['All investing cash flow (capex, Adcock, deposits)', n0(cfi3a), n0(cfi3b), n0(cfi)],
      ['Dividends paid', n0(div3a), n0(div3b), n0(divs)],
      ['Memo: Adcock Ingram 35.75% (Nov-2025)', '–', '2,079', ''],
      ['Memo: Adcock Ingram +13.25% (Jul-2026, FY27)', '–', '~1,060', ''],
    ], source: 'Screener.in cash flow (consolidated); AR FY26 note 41 and cash flow statement; Q1FY27 call (14-Aug-2026). Investing cash flow also includes switches between bank deposits and investments.' } },
    { callout: '**The capital question:** Natco earned ~₹5,400 cr of profit in FY23-FY26 and has turned most of the surplus cash into a 49% minority stake that earns ~7% on its cost today (management: "only slightly better than bank interest"). If the next "very large" deal is bought at a full price, per-share value falls. We model no new deal and no rights issue in the base, so the engine builds cash again from FY28.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'Net cash ₹2,400 cr at Mar-26 fell to ~₹1,400 cr after the July Adcock tranche; Adcock sits at ₹2,276 cr of book',
  blocks: [
    { p: 'At Mar-2026 Natco had ₹9,221 cr of equity and no meaningful minority interest. Against it: the Adcock stake at ₹2,275.7 cr (including ₹649 cr of goodwill and ₹393 cr of fair-value uplift), cash and bank balances ₹1,551 cr, deposits with financial institutions ₹704 cr, investments ₹851 cr (incl. eGenesis ₹72.5 cr and bonds), net fixed assets ₹2,803 cr, inventories ₹908 cr and receivables ₹881 cr (down from ₹1,247 cr as the lenalidomide profit-share receivable unwound). Borrowings were ₹714 cr. Management put group net cash at ~₹2,400 cr; after the July Adcock payment it was ~₹1,400 cr (14-Aug-2026). Two items to watch: a ₹494.5 cr refund liability for price protection and returns (₹16.8 cr a year earlier), which will be paid out in FY27, and a ₹232.6 cr net deferred-tax asset (₹50.1 cr a year earlier), much of it from the MAT-credit remeasurement on moving to the new tax regime.' },
    { pair: [
      { type: 'line', title: 'Receivable days fell to 79; inventory days rose to 480', unit: 'Days (Screener basis)', x: RL, series: [{ name: 'Inventory days', values: RR('Inventory Days'), fmt: 'num' }, { name: 'Receivable days', values: RR('Debtor Days'), fmt: 'num' }, { name: 'Payable days', values: RR('Days Payable'), fmt: 'num' }], labels: 'last', source: 'Screener.in' },
      { type: 'column', title: 'Net cash peaked in FY25; FY26 counts the Adcock stake as an investment', unit: 'Net debt: borrowings less cash and investments (₹ crore; negative = net cash; FY26 includes the ₹2,276 cr Adcock stake in investments)', x: 'A.labels', from: 'FY17', series: [{ name: 'Net debt', ref: 'A.netDebt', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-22', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth', `{{A.netWorth.${I[22]}|num}}`, `{{A.netWorth.${I[24]}|num}}`, `{{A.netWorth.${I[25]}|num}}`, `{{A.netWorth.${I[26]}|num}}`],
      ['Borrowings (incl. leases)', `{{A.borrowings.${I[22]}|num}}`, `{{A.borrowings.${I[24]}|num}}`, `{{A.borrowings.${I[25]}|num}}`, `{{A.borrowings.${I[26]}|num}}`],
      ['Cash and investments (FY26 incl. the Adcock stake)', `{{A.cashAndInvestments.${I[22]}|num}}`, `{{A.cashAndInvestments.${I[24]}|num}}`, `{{A.cashAndInvestments.${I[25]}|num}}`, `{{A.cashAndInvestments.${I[26]}|num}}`],
      ['Net fixed assets', `{{A.fixedAssets.${I[22]}|num}}`, `{{A.fixedAssets.${I[24]}|num}}`, `{{A.fixedAssets.${I[25]}|num}}`, `{{A.fixedAssets.${I[26]}|num}}`],
      ['Inventories', `{{A.inventories.${I[22]}|num}}`, `{{A.inventories.${I[24]}|num}}`, `{{A.inventories.${I[25]}|num}}`, `{{A.inventories.${I[26]}|num}}`],
      ['Trade receivables', `{{A.receivables.${I[22]}|num}}`, `{{A.receivables.${I[24]}|num}}`, `{{A.receivables.${I[25]}|num}}`, `{{A.receivables.${I[26]}|num}}`],
      ['Trade payables', `{{A.payables.${I[22]}|num}}`, `{{A.payables.${I[24]}|num}}`, `{{A.payables.${I[25]}|num}}`, `{{A.payables.${I[26]}|num}}`],
    ], source: SRC.co + '. Screener\'s cash excludes ₹703.6 cr of deposits with financial institutions in other financial assets (AR FY26 note 9), which the model adds to treasury.' } },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: the Nannapaneni family 49.4%; domestic institutions have mostly left',
  blocks: [
    { pair: [
      { type: 'line', title: 'Domestic institutions down from 16% to under 6%', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoters steady at ~49.4%', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 40, max: 55, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY15–FY29E', rows: [
      { key: 'sales', name: 'Revenue from operations', flag: { type: 'pct', th: 15 }, hl: true },
      { key: 'ebitda', name: 'EBITDA (Screener basis: before other income)', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 300 } },
      { key: 'dep', name: 'Depreciation & amortisation' },
      { key: 'otherIncome', name: 'Other income (treasury, forex; forecasts incl. the Adcock share)' },
      { key: 'pbt', name: 'Profit before tax (forecasts incl. the Adcock share)' },
      { key: 'pat', name: 'Net profit after the associate share', hl: true, flag: { type: 'pct', th: 25 } },
      { key: 'eps', name: 'EPS (₹)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' },
      { key: 'capex', name: 'Capex' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 20 }, hl: true },
      { key: 'ebitda', name: 'EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' },
      { key: 'otherIncome', name: 'Other income' },
      { key: 'dep', name: 'Depreciation & amortisation' },
      { key: 'pat', name: 'Net profit (after the associate share)', hl: true },
    ] } },
  ],
};

const statementNotes = {};

module.exports = { financials, capital, balance, ownershipBase, statements, statementNotes, RD, n0 };

if (require.main === module) {
  require('./NATCOPHARM.mult').syncMult();
  const B = fs.existsSync(path.join(__dirname, 'NATCOPHARM.research.js')) ? require('./NATCOPHARM.research') : null;
  const report = {
    symbol: 'NATCOPHARM', listing: 'NSE: NATCOPHARM · BSE: 524816', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Pharmaceuticals & Healthcare',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
