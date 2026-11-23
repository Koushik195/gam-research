// Authoring source for the Hero MotoCorp initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated; profit incl. associates in
// actual years, before associates in our forecasts). Part B (HEROMOTOCO.research.js + part2-4b, shared
// HEROMOTOCO.ctx.js) adds the research chapters. Usage: node tools/authoring/HEROMOTOCO.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'HEROMOTOCO', 'research');
const SCR = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8'));
const R = SCR.tables.ratios, keepR = R.periods.map(p => `${p.slice(-4)}-05-30` <= '2026-09-30');
const RL = R.periods.filter((_, i) => keepR[i]).map(p => 'FY' + p.slice(-2));
const RR = k => R.rows[k].filter((_, i) => keepR[i]);
const CF = SCR.schedules['cash-flow'], cfY = (row, sub, ys) => ys.reduce((t, y) => t + (SCR.schedules['cash-flow'][row][sub][`Mar ${y}`] || 0), 0);
const n0 = v => Math.round(v).toLocaleString('en-IN');
const yrs1 = [2021, 2022, 2023], yrs2 = [2024, 2025, 2026];
const cfo = ys => ys.reduce((t, y) => t + SCR.tables['cash-flow'].rows['Cash from Operating Activity'][SCR.tables['cash-flow'].periods.indexOf(`Mar ${y}`)], 0);
const capex = ys => -cfY('Cash from Investing Activity', 'Fixed assets purchased', ys);
const divs = ys => -cfY('Cash from Financing Activity', 'Dividends paid', ys);
const grp = ys => -(cfY('Cash from Investing Activity', 'Investment in group cos', ys) + cfY('Cash from Investing Activity', 'Acquisition of companies', ys));
const W = [yrs1, yrs2].map(ys => ({ cfo: cfo(ys), capex: capex(ys), div: divs(ys), grp: grp(ys) }));
W.forEach(w => (w.left = w.cfo - w.capex - w.div - w.grp));
const SRC = { co: 'Company filings, Screener.in (consolidated), GAM Research' };

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'A decade of slow growth, then FY26: record volumes after the GST cut',
  blocks: [
    { p: 'Hero\'s consolidated revenue grew from ₹28,457 cr in FY16 to ₹47,411 cr in FY26, only 5.2% a year, and profit from ₹3,112 cr to ₹5,776 cr (6.4% a year). For most of the decade volumes went nowhere: a new emission standard (BS6, Apr-2020), Covid and a rural slowdown pushed revenue down to ₹29,551 cr in FY22. The recovery since then has come in three steps: price increases and a better mix (FY23-24, EBITDA margin from 11% to 14%), a steady FY25 (+8%) and the September-2025 GST cut, which lifted FY26 volumes 9.6% to 64.69 lakh and revenue 16%. Note that reported FY26 profit includes a one-time ₹722 cr gain from the dilution of Hero\'s stake in its associates (Ather\'s IPO and a private placement): before associates and one-offs, FY26 EPS was ~₹283, not ₹287.' },
    { pair: [
      { type: 'column', title: 'Revenue: 5% a year for ten years, +16% in FY26', unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'ends', source: SRC.co },
      { type: 'column', title: 'Profit: flat for six years, then up 2.5x from FY22', unit: 'Net profit, reported (₹ crore)', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: from 11% (FY22) back to 15%', unit: 'EBITDA margin (%)', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 8, max: 18, source: SRC.co },
      { type: 'line', title: 'Material costs drive the margin cycle', unit: 'Raw material cost (% of revenue), Screener', x: RL.filter((_, i) => i >= 1), series: [{ name: 'Material cost', values: Object.entries(SCR.schedules['profit-loss'].Expenses['Material Cost %']).filter(([k]) => /^Mar 20(1[6-9]|2[0-6])$/.test(k)).map(([, v]) => v), fmt: 'pct0' }], labels: 'all', min: 60, max: 75, source: 'Screener.in' },
    ] },
    { callout: '**Our view:** Hero is a mature, cash-rich business whose growth depends on rural incomes and the price of a 100cc motorcycle. FY26 was helped by a one-off tax cut; FY27 by price increases. The margin recovery since FY22 is real (price discipline, cost programme "LEAP", parts), but the EV build-out costs ~2.3-2.6 points of margin and commodity costs turned up again in 2026. We do not expect the 15%+ margins of FY16-18 while VIDA is loss-making.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capex & returns', kicker: 'Capital allocation', title: 'Returns back to the mid-30s; most cash goes out as dividends, a growing slice into stakes',
  blocks: [
    { p: `Hero needs little capital: capex was ₹${n0(W[1].capex)} cr over FY24-26 against ₹${n0(W[1].cfo)} cr of operating cash flow. ROCE fell from ~50% in FY15-16 to 18% in FY22 (low volumes, BS6 costs) and is back at 35% in FY26. Dividends took ₹${n0(W[1].div)} cr over FY24-26; investments in group companies and start-ups (Ather, Euler Motors, Zero Motorcycles) ₹${n0(W[1].grp)} cr. In FY27 the pattern changes: ₹1,998 cr went into Ather in August-2026 alone (₹1,758 cr of shares from GIC plus 25% of ₹960 cr of warrants), with ₹720 cr more due if the warrants are converted, and capex rises to the guided ₹1,500 cr.` },
    { pair: [
      { type: 'column', title: 'Cash from operations covers capex several times over', unit: '₹ crore', x: 'A.labels', from: 'FY17', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }], labels: 'none', source: SRC.co },
      { type: 'line', title: 'ROCE: 50% to 18% to 35%', unit: 'Return on capital employed (%)', x: RL, series: [{ name: 'ROCE', values: RR('ROCE %'), fmt: 'pct0' }], labels: 'all', min: 0, max: 60, source: 'Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went (₹ crore)', head: ['', 'FY21-23', 'FY24-26', 'Six years'], rows: [
      ['Cash from operations', n0(W[0].cfo), n0(W[1].cfo), n0(W[0].cfo + W[1].cfo)],
      ['Capex', n0(W[0].capex), n0(W[1].capex), n0(W[0].capex + W[1].capex)],
      ['Dividends paid', n0(W[0].div), n0(W[1].div), n0(W[0].div + W[1].div)],
      ['Investments in group companies and acquisitions', n0(W[0].grp), n0(W[1].grp), n0(W[0].grp + W[1].grp)],
      { hl: true, cells: ['**Left over (added to treasury)**', `**${n0(W[0].left)}**`, `**${n0(W[1].left)}**`, `**${n0(W[0].left + W[1].left)}**`] },
    ], source: 'Screener.in cash flow (consolidated). FY27 adds ~₹2,000 cr of Ather purchases (Aug-2026).' } },
    { callout: '**The capital question:** Hero pays out 70%+ of profit and still adds to cash. The debate is the use of the rest. Management has chosen to own a third of Ather (₹2,700 cr committed in 2026 at ₹1,260-1,480 a share) while also building VIDA, and to fund Hero FinCorp (which lost ₹226 cr in FY26). The Ather stake has been a good investment so far; Hero FinCorp has not.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'Net cash of ~₹15,400 cr plus ~₹3,900 cr of stakes at book; suppliers fund the working capital',
  blocks: [
    { p: 'At Mar-2026 Hero held ₹767 cr of cash and ₹19,286 cr of investments, of which ₹3,901 cr were its associates at book value (Hero FinCorp ₹2,407 cr, Ather ₹1,093 cr, Euler ₹401 cr) and ~₹400 cr other strategic holdings. Borrowings were ₹779 cr (₹280 cr leases, ₹499 cr working-capital loans in the Colombia and Bangladesh subsidiaries). Net treasury excluding the stakes was ~₹15,400 cr, about ₹765 a share. Working capital is negative: suppliers are paid in ~88 days while dealers pay in ~18 and inventory turns in ~31, so growth releases cash (FY26 working-capital inflow ₹2,375 cr).' },
    { pair: [
      { type: 'line', title: 'Payables far exceed receivables and stock', unit: 'Days (of revenue)', x: RL, series: [{ name: 'Inventory days', values: RR('Inventory Days'), fmt: 'num' }, { name: 'Receivable days', values: RR('Debtor Days'), fmt: 'num' }, { name: 'Payable days', values: RR('Days Payable'), fmt: 'num' }], labels: 'last', source: 'Screener.in' },
      { type: 'column', title: 'Cash and investments: ₹20,053 cr at Mar-26 (incl. stakes at book)', unit: 'Cash and investments (₹ crore)', x: 'A.labels', from: 'FY17', series: [{ name: 'Cash and investments', ref: 'A.cashAndInvestments', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-22', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth (excl. minorities)', '{{A.netWorth.7|num}}', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}'],
      ['Borrowings (incl. leases)', '{{A.borrowings.7|num}}', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}'],
      ['Cash and investments (incl. associates at book)', '{{A.cashAndInvestments.7|num}}', '{{A.cashAndInvestments.9|num}}', '{{A.cashAndInvestments.10|num}}', '{{A.cashAndInvestments.11|num}}'],
      ['  of which associates at book', '–', '3,084', '2,981', '3,901'],
      ['Net fixed assets', '{{A.fixedAssets.7|num}}', '{{A.fixedAssets.9|num}}', '{{A.fixedAssets.10|num}}', '{{A.fixedAssets.11|num}}'],
      ['Inventories', '{{A.inventories.7|num}}', '{{A.inventories.9|num}}', '{{A.inventories.10|num}}', '{{A.inventories.11|num}}'],
      ['Trade receivables', '{{A.receivables.7|num}}', '{{A.receivables.9|num}}', '{{A.receivables.10|num}}', '{{A.receivables.11|num}}'],
      ['Trade payables', '{{A.payables.7|num}}', '{{A.payables.9|num}}', '{{A.payables.10|num}}', '{{A.payables.11|num}}'],
    ], source: SRC.co + '; associates from AR FY24-26 (note 9A). Minorities (₹200 cr at Mar-26) sit in other liabilities.' } },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: the Munjal family at 34.7%; foreign funds up, domestic funds down',
  blocks: [
    { pair: [
      { type: 'line', title: 'FIIs up from 27% to 31%; DIIs down from 28% to 24%', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoters steady at 34.7%', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 30, max: 40, source: 'BSE shareholding pattern, Screener.in' },
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
      { key: 'otherIncome', name: 'Other income (actuals incl. associates and exceptional items)' },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit (forecasts before associates)', hl: true, flag: { type: 'pct', th: 20 } },
      { key: 'eps', name: 'EPS (₹)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' },
      { key: 'capex', name: 'Capex' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 12 }, hl: true },
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
  const B = fs.existsSync(path.join(__dirname, 'HEROMOTOCO.research.js')) ? require('./HEROMOTOCO.research') : null;
  const report = {
    symbol: 'HEROMOTOCO', listing: 'NSE: HEROMOTOCO · BSE: 500182', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Automobiles',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
