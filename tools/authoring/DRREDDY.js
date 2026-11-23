// Authoring source for the Dr. Reddy's Laboratories initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated Ind AS; Net Profit on the
// attributable basis via DRREDDY.patch.js). Part B (DRREDDY.research.js + part2-6, shared DRREDDY.ctx.js) adds the
// research chapters. DRREDDY.mult.js first syncs the derived multiples into assumptions.json.
// Usage: node tools/authoring/DRREDDY.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'DRREDDY', 'research');
const SCR = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8')).tables.ratios;
const keepR = SCR.periods.map(p => `${p.slice(-4)}-05-30` <= '2026-09-30');
const RL = SCR.periods.filter((_, i) => keepR[i]).map(p => 'FY' + p.slice(-2));
const RR = k => SCR.rows[k].filter((_, i) => keepR[i]);
const MOD = JSON.parse(fs.readFileSync(path.join(RD, '..', '..', '..', 'models', 'DRREDDY.json'), 'utf8')), A = MOD.annual, F = MOD.forecast.F;
const ix = l => A.labels.indexOf(l), sumOf = (k, from, to) => A.labels.slice(ix(from), ix(to) + 1).reduce((s, _, j) => s + (A[k][ix(from) + j] || 0), 0);
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const SRC = { co: 'Company filings, Screener.in (consolidated Ind AS; profit attributable to equity holders), GAM Research' };
const cfo = sumOf('cfo', 'FY21', 'FY26'), capexS = sumOf('capex', 'FY21', 'FY26'), cfi = sumOf('cfi', 'FY21', 'FY26'), divs = sumOf('dividendsPaid', 'FY21', 'FY26');
const cfo3a = sumOf('cfo', 'FY21', 'FY23'), cfo3b = sumOf('cfo', 'FY24', 'FY26'), cap3a = sumOf('capex', 'FY21', 'FY23'), cap3b = sumOf('capex', 'FY24', 'FY26');
const cfi3a = sumOf('cfi', 'FY21', 'FY23'), cfi3b = sumOf('cfi', 'FY24', 'FY26'), div3a = sumOf('dividendsPaid', 'FY21', 'FY23'), div3b = sumOf('dividendsPaid', 'FY24', 'FY26');
const salesCagr = (Math.pow(A.sales[ix('FY26')] / A.sales[ix('FY21')], 1 / 5) - 1) * 100;
const pat3 = sumOf('pat', 'FY23', 'FY25'), pat3pre = sumOf('pat', 'FY20', 'FY22');

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Revenue up 1.8x since FY21; profit rode gRevlimid to FY25 and fell back in FY26-27',
  blocks: [
    { p: `Dr. Reddy's grew revenue from ₹${n0(A.sales[ix('FY21')])} cr in FY21 to ₹${n0(A.sales[ix('FY26')])} cr in FY26 (Ind AS, about ${Math.round(salesCagr)}% a year). Profit did something very different. EBITDA (Screener basis: before other income, after impairments) went from ₹${n0(A.ebitda[ix('FY22')])} cr in FY22 to ₹${n0(A.ebitda[ix('FY25')])} cr in FY25 and the margin from 17.5% to 26-28%, because generic Revlimid (gRevlimid, lenalidomide) was sold in the US under volume-limited settlements with few competitors. EPS more than doubled from ₹26.2 (FY22) to ₹67.8 (FY25). Profit attributable to shareholders was ₹${n0(pat3)} cr in FY23-FY25, 2.6x the ₹${n0(pat3pre)} cr of FY20-FY22. In FY26 the windfall ended: North America fell 22%, EBITDA fell to ₹${n0(A.ebitda[ix('FY26')])} cr (19.2%) and EPS to ₹50.3, including about ₹1,100 cr of one-off charges. Q1FY27 EPS was ₹5.32.` },
    { pair: [
      { type: 'column', title: `Revenue: ₹${n0(A.sales[ix('FY21')])} cr in FY21, ₹${n0(A.sales[ix('FY26')])} cr in FY26`, unit: 'Revenue from operations, Ind AS (₹ crore)', x: 'fin.labels', from: 'FY17', to: 'FY29E', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'all', source: SRC.co + '; GAM estimates FY27-29E' },
      { type: 'column', title: 'Profit: the gRevlimid hump of FY23-FY25', unit: 'Net profit attributable to equity holders (₹ crore)', x: 'fin.labels', from: 'FY17', to: 'FY29E', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.co + '. FY22 after ₹756 cr of impairments; FY26 after the SSA, impairments and provisions' },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: 26-28% in FY23-FY25, 16% in FY27E', unit: 'EBITDA margin, Screener basis (before other income, after impairments, %)', x: 'fin.labels', from: 'FY17', to: 'FY29E', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 10, max: 32, source: SRC.co + '; GAM estimates' },
      { type: 'line', title: 'Return on equity: 21% at the peak, ~8% in FY27E', unit: 'ROE (%), attributable profit on average equity', x: 'fin.labels', from: 'FY17', to: 'FY29E', series: [{ name: 'ROE', ref: 'fin.roe', fmt: 'pct' }], labels: 'all', min: 0, max: 25, source: SRC.co + '; GAM estimates' },
    ] },
    { callout: '**Our view:** FY23-FY25 was a windfall, not a new normal. The base business (India, emerging markets, Europe, PSAI and US generics other than lenalidomide) grew double digits, but its margin is mid-teens on Screener\'s basis, not the high-20s of the gRevlimid years. Our FY27E EPS of {{F.eps.0|inr}} is {{F.epsGrowth.0|chg}} vs FY26; FY28E ({{F.eps.1|inr}}) depends on semaglutide coming back in Nov-2026 and abatacept being approved in Dec-2026.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capex, deals & returns', kicker: 'Capital allocation', title: 'The gRevlimid cash went into capacity, biologics, NRT and in-licensing; returns have halved',
  blocks: [
    { p: `Over FY21-26 Dr. Reddy's generated ₹${n0(cfo)} cr of operating cash flow, spent ₹${n0(capexS)} cr on fixed assets (₹${n0(cap3b)} cr of it in FY24-26, building biologics, peptide and injectable capacity) and paid ₹${n0(divs)} cr of dividends. It also spent heavily on deals and licences: the Haleon NRT business (GBP458 mn upfront, ~₹5,141 cr, Sep-2024), Mayne Pharma's US generics portfolio, Indian brands (Progynova, Cyclo-Progynova, Stugeron) and in-licensed innovation (toripalimab, tegoprazan, XACDURO). Net cash fell from ₹${n0(-A.netDebt[ix('FY23')])} cr (Mar-23, Screener basis) to ₹${n0(-A.netDebt[ix('FY26')])} cr (Mar-26); the company's own "net cash surplus", which also counts term deposits and excludes leases, was ₹3,271 cr at Mar-26 and ₹3,057 cr at Jun-26.` },
    { pair: [
      { type: 'column', title: 'Operating cash flow vs capex', unit: '₹ crore', x: 'A.labels', from: 'FY17', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }], labels: 'none', source: SRC.co },
      { type: 'line', title: 'ROCE: 27% in FY23-24, 13% in FY26', unit: 'Return on capital employed (%), Screener basis', x: RL, series: [{ name: 'ROCE', values: RR('ROCE %'), fmt: 'pct0' }], labels: 'all', min: 0, max: 30, source: 'Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went (₹ crore, Screener cash flow)', head: ['', 'FY21-23', 'FY24-26', 'Six years'], rows: [
      ['Cash from operations', n0(cfo3a), n0(cfo3b), n0(cfo)],
      ['Capex (fixed assets)', n0(cap3a), n0(cap3b), n0(capexS)],
      ['All investing cash flow (capex, deals, treasury moves)', n0(cfi3a), n0(cfi3b), n0(cfi)],
      ['Dividends paid', n0(div3a), n0(div3b), n0(divs)],
      ['Memo: NRT acquisition (Sep-2024)', '–', 'GBP458 mn upfront + up to GBP42 mn earn-out', ''],
    ], source: 'Screener.in cash flow (consolidated); AR FY26 note 2.39 B (NRT). FY25 investing outflow includes the NRT purchase (Screener "other investing items" ₹5,287 cr).' } },
    { callout: '**The capital question:** management says the ~₹3,000 cr of net cash "will be used for inorganic" growth across generics, innovation and biosimilars. We model capex of ₹1,800 cr a year (guidance) and no deals, so the engine builds cash to ~₹{{F.treasury.2|num}} cr by FY29E and other income rises with it. If that cash buys businesses that earn less than the 11.6% cost of equity, as the CAR-T and Eftilagimod write-offs (₹228 cr in Q4FY26) did, per-share value falls. The record of the last three years is mixed: NRT is growing and profitable; the biologics capacity has not yet earned anything.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'Net cash ₹3,057 cr, but working capital is 43% of revenue and borrowings are rising',
  blocks: [
    { p: 'At Mar-2026 Dr. Reddy\'s had ₹37,892 cr of equity attributable to shareholders and ₹339 cr of minority interest (Nestle India\'s 49% of the nutraceutical JV). Against it: goodwill ₹1,480 cr and other intangibles ₹10,506 cr (NRT brands, in-licensed products, acquired Indian brands), inventories ₹7,653 cr and receivables ₹10,123 cr. Operating working capital (inventory + receivables − payables) was ₹14,434 cr, ~43% of revenue, and ₹14,353 cr at Jun-26. Gross cash and investments were ₹9,851 cr against ₹7,734 cr of borrowings (₹6,294 cr short-term, ₹1,441 cr leases). The short-term loans have grown from ₹1,119 cr (Mar-23) as the company funds working capital and keeps an interest carry on its deposits.' },
    { pair: [
      { type: 'line', title: 'Receivable days rose to 110; inventory days fell to 228', unit: 'Days (Screener basis)', x: RL, series: [{ name: 'Inventory days', values: RR('Inventory Days'), fmt: 'num' }, { name: 'Receivable days', values: RR('Debtor Days'), fmt: 'num' }, { name: 'Payable days', values: RR('Days Payable'), fmt: 'num' }], labels: 'last', source: 'Screener.in' },
      { type: 'column', title: 'Net cash shrank from ₹5,369 cr (Mar-23) to ₹900 cr (Mar-26) on Screener\'s basis', unit: 'Net debt: borrowings incl. leases less cash and investments (₹ crore; negative = net cash; excludes term deposits in other assets)', x: 'A.labels', from: 'FY17', series: [{ name: 'Net debt', ref: 'A.netDebt', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-22', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth (attributable)', '{{A.netWorth.7|num}}', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}'],
      ['Borrowings (incl. leases)', '{{A.borrowings.7|num}}', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}'],
      ['Cash and investments (incl. equity-accounted stakes)', '{{A.cashAndInvestments.7|num}}', '{{A.cashAndInvestments.9|num}}', '{{A.cashAndInvestments.10|num}}', '{{A.cashAndInvestments.11|num}}'],
      ['Net fixed assets (incl. intangibles)', '{{A.fixedAssets.7|num}}', '{{A.fixedAssets.9|num}}', '{{A.fixedAssets.10|num}}', '{{A.fixedAssets.11|num}}'],
      ['Inventories', '{{A.inventories.7|num}}', '{{A.inventories.9|num}}', '{{A.inventories.10|num}}', '{{A.inventories.11|num}}'],
      ['Trade receivables', '{{A.receivables.7|num}}', '{{A.receivables.9|num}}', '{{A.receivables.10|num}}', '{{A.receivables.11|num}}'],
      ['Trade payables', '{{A.payables.7|num}}', '{{A.payables.9|num}}', '{{A.payables.10|num}}', '{{A.payables.11|num}}'],
    ], source: SRC.co + '. Screener\'s cash excludes ₹1,954 cr of term deposits shown in other financial assets at Mar-26 (AR FY26 note 2.7 C), which the model adds to treasury.' } },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: promoters 26.6%, LIC 12.2%, ADR holders 11.9%; a widely held stock',
  blocks: [
    { pair: [
      { type: 'line', title: 'Domestic institutions up, foreign investors down', unit: '% of shares (FIIs exclude ADR holders)', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoters steady at ~26.6%', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 20, max: 30, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY15–FY29E', rows: [
      { key: 'sales', name: 'Revenue from operations (Ind AS)', flag: { type: 'pct', th: 15 }, hl: true },
      { key: 'ebitda', name: 'EBITDA (Screener basis: before other income, after impairments)', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 250 } },
      { key: 'dep', name: 'Depreciation & amortisation' },
      { key: 'otherIncome', name: 'Other income (incl. treasury, forex, divestment gains, JV share)' },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit attributable to equity holders', hl: true, flag: { type: 'pct', th: 25 } },
      { key: 'eps', name: 'EPS (₹, split-adjusted)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' },
      { key: 'capex', name: 'Capex' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 15 }, hl: true },
      { key: 'ebitda', name: 'EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' },
      { key: 'otherIncome', name: 'Other income' },
      { key: 'dep', name: 'Depreciation & amortisation' },
      { key: 'pat', name: 'Net profit (attributable)', hl: true },
    ] } },
  ],
};

const statementNotes = {};

module.exports = { financials, capital, balance, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  require('./DRREDDY.mult').syncMult();
  const B = fs.existsSync(path.join(__dirname, 'DRREDDY.research.js')) ? require('./DRREDDY.research') : null;
  const report = {
    symbol: 'DRREDDY', listing: 'NSE: DRREDDY · BSE: 500124 · NYSE: RDY', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Pharmaceuticals & Healthcare',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
