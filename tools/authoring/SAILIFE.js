// Authoring source for the Sai Life Sciences initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated; no patch needed: Net Profit equals
// "Profit for EPS" in every year and quarter, all subsidiaries are 100% owned, and implied FY26 shares of 21.18 cr match the
// ~21.17 cr outstanding at Mar-26). Part B (SAILIFE.research.js + part2-6, shared SAILIFE.ctx.js) adds the research chapters,
// cover, rating and statement notes. Usage: node tools/authoring/SAILIFE.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'SAILIFE', 'research');
const X = fs.existsSync(path.join(__dirname, 'SAILIFE.ctx.js')) ? require('./SAILIFE.ctx') : null;
const n0 = v => Math.round(v).toLocaleString('en-IN');
const FYS = ['FY19', 'FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'];

const financials = X && (() => {
  const { A, epsU, n1, b, epsCagr, salesCagr5 } = X;
  return {
    id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Revenue ×3 in seven years; margins collapsed in FY22-23 and have rebuilt to 29%; profit only became meaningful in FY25-26',
    blocks: [
      { p: `Sai Life grew revenue from ₹695 cr in FY19 to ₹2,192 cr in FY26, ${n1(salesCagr5)}% a year over the last five years. The path had two halves. In FY19-FY23 revenue grew but profit shrank: the EBITDA margin (Screener basis, forex in other income) fell from 25% to 14% as Sai hired scientists, built biology and DMPK labs, opened Boston and Manchester and added manufacturing blocks ahead of demand, and interest on ₹750-930 cr of debt ate what was left (FY22 net profit ₹6 cr, FY23 ₹10 cr). In FY24-FY26 the investment paid off: revenue +20%, +16% and +29%, margin 19.6% → 24.2% → 28.9%, and the IPO money (₹950 cr, Dec-2024) repaid ₹720 cr of debt, halving interest. Net profit went ₹83 cr → ₹170 cr → ₹349 cr. FY26 had help: a ₹34 cr reversal of a FY25 provision and ₹30 cr of forex gains.` },
      { pair: [
        { type: 'column', title: 'Revenue: ₹695 cr to ₹2,192 cr, faster since FY23', unit: 'Revenue (₹ crore)', x: FYS, series: [{ name: 'Revenue', values: FYS.map((_, i) => A.sales[i]), fmt: 'num' }], labels: 'all', highlight: 'FY26', source: 'Screener.in (consolidated)' },
        { type: 'line', title: 'EBITDA margin: from 14% (FY23) back to 29% (FY26)', unit: 'EBITDA margin (%), Screener basis', x: FYS, series: [{ name: 'EBITDA margin', values: FYS.map((_, i) => Math.round(A.ebitdaMargin[i] * 10) / 10), fmt: 'pct' }], labels: 'all', min: 0, max: 35, source: 'Screener.in (company EBITDA includes forex: 30.1% in FY26)' },
      ] },
      { pair: [
        { type: 'column', title: 'Net profit: ₹6-10 cr in FY22-23, ₹349 cr in FY26', unit: 'Net profit (₹ crore)', x: FYS, series: [{ name: 'Net profit', values: FYS.map((_, i) => A.pat[i]), fmt: 'num' }], labels: 'all', source: 'Screener.in' },
        { type: 'line', title: 'Return on equity: 1% (FY23) to 15% (FY26), diluted by the IPO equity', unit: 'Return on equity (%)', x: FYS, series: [{ name: 'ROE', values: FYS.map((_, i) => Math.round(A.roe[i] * 10) / 10), fmt: 'pct' }], labels: 'all', min: 0, max: 20, source: 'Screener.in (company: 14.0% in FY26)' },
      ] },
      { exhibit: { type: 'table', title: 'FY24 → FY26: where the profit came from (₹ crore)', head: ['', 'FY24', 'FY25', 'FY26', 'Note'], wide: [4], rows: [
        ['Revenue', '{{A.sales.5|num}}', '{{A.sales.6|num}}', '{{A.sales.7|num}}', 'CDMO ₹959 → 1,034 → 1,361 cr; CRO ₹497 → 626 → 775 cr (audited contract revenue)'],
        ['Material margin', '69.6%', '72.5%', '74.0%', 'Mix towards discovery and late-phase/commercial chemistry'],
        ['EBITDA (Screener basis)', '{{A.ebitda.5|num}}', '{{A.ebitda.6|num}}', '{{A.ebitda.7|num}}', 'FY25 hit by a ₹31 cr loss allowance; FY26 helped by a ₹25 cr reversal (₹34 cr incl. contract assets)'],
        ['Other income (incl. forex)', '{{A.otherIncome.5|num}}', '{{A.otherIncome.6|num}}', '{{A.otherIncome.7|num}}', 'FY26: deposit interest ₹18 cr, forex ₹30 cr, less the ₹9 cr labour-code charge'],
        ['Interest', '{{A.interest.5|num}}', '{{A.interest.6|num}}', '{{A.interest.7|num}}', '₹720 cr of debt repaid from the IPO (Dec-2024); leases ₹23 cr a year'],
        ['Depreciation', '{{A.dep.5|num}}', '{{A.dep.6|num}}', '{{A.dep.7|num}}', 'New production blocks and R&D space'],
        { hl: true, cells: ['**Net profit**', '**{{A.pat.5|num}}**', '**{{A.pat.6|num}}**', '**{{A.pat.7|num}}**', 'FY26 ₹355 cr before the exceptional charge'] },
        ['EPS (₹)', '–', String(X.epsRep[2025]), String(X.epsRep[2026]), 'Listed Dec-2024; FY25 EPS on a weighted share count'],
      ], source: 'Screener.in; AR FY26 notes 27, 28, 32, 34; Q4FY26 deck p.32' } },
      { callout: `**Our view:** the margin rebuild is real (material margin up, people cost down from 34% to 31% of sales) but FY26 flatters it: strip out the provision reversal and the margin was ~27.8%, close to Q1FY27's 26.7%. The next leg is harder. FY27 capex of ₹1,100-1,300 cr is about double FY26 and more than operating cash flow, so depreciation and interest climb before the new blocks earn. We forecast EPS of ₹${n1(epsU[0])} / ${n1(epsU[1])} / ${n1(epsU[2])} for FY27-29E, only ~${Math.round(epsCagr)}% a year, although EBITDA grows ~18% a year.` },
    ],
  };
})();

const seasons = {
  id: 'seasons', nav: 'Quarterly pattern', kicker: 'Quarters', title: 'Lumpy, with a second-half bias: H2 has usually carried ~60% of the year; FY26 split 48/52 and FY27 is guided H2-heavy',
  blocks: [
    { p: 'Sai ships development and commercial campaigns, so a quarter rises or falls with a few deliveries. Management says the business has historically split 40/60 between the first and second halves; FY26 was an exception at 48/52 after a strong H1. In Q1FY25 revenue fell to ₹280 cr as a commercial customer destocked, and the quarter made a loss; in Q3FY26 the margin reached 34% on a rich mix. Q1FY27 revenue rose 12% to ₹554 cr with CDMO only +6%; management expects H2FY27 to be stronger as the first new 225 KL production block at Bidar starts. Quarterly margins (Screener basis) have ranged 24-34% since FY25.' },
    { pair: [
      { type: 'column', title: 'Quarterly revenue: from ₹280 cr (Q1FY25) to ₹602 cr (Q4FY26)', unit: 'Revenue (₹ crore)', x: 'Q.labels', series: [{ name: 'Revenue', ref: 'Q.sales', fmt: 'num' }], labels: 'all', source: 'Screener.in (consolidated)' },
      { type: 'line', title: 'Quarterly EBITDA margin: 24-34% since Q2FY25', unit: 'EBITDA margin (%)', x: 'Q.labels', series: [{ name: 'EBITDA margin', ref: 'Q.opm', fmt: 'pct0' }], labels: 'all', min: 0, max: 40, source: 'Screener.in' },
    ] },
    { callout: '**What to watch:** our FY27 forecast needs ~₹2,007 cr from Q2-Q4, +18% on last year, against +12% in Q1. That depends on the Bidar block starting on time in Q3 and three new commercial molecules ramping. Q2FY27 results are due by mid-November 2026.' },
  ],
};

const balance = X && (() => {
  const { cashPath, GROSS, BORR, LEASES, TRE, n1 } = X;
  return {
    id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'From ₹930 cr of debt to roughly net debt-free after the IPO, and back to borrowing: we see net debt of ~₹1,100 cr by Mar-28 as capex doubles',
    blocks: [
      { p: `Sai carried ₹750-930 cr of borrowings in FY22-24 while it built capacity on thin profits. The IPO's ₹950 cr fresh issue (Dec-2024) repaid ₹720 cr of it. At Mar-26 Sai had ₹${n0(GROSS[0])} cr of cash, deposits and funds (₹111 cr of cash and bank balances, ₹51 cr of investments and ₹${n0(TRE.fdsInOtherFinancialAssets)} cr of fixed deposits held in other financial assets) against ₹${n0(TRE.borrowings)} cr of bank debt and ₹${n0(TRE.leases)} cr of lease liabilities: net debt including leases of ~₹${n0(-cashPath[0])} cr, net debt/equity 0.01. That position is now reversing. FY26 capex of ₹633 cr already used most of the IPO cash (₹464 cr of cash at Mar-25 became ₹111 cr), and FY27 capex is guided at ₹1,100-1,300 cr against operating cash flow of ~₹500 cr. Receivables are well run (62 days in FY26), but contract assets and other current assets (₹624 cr) have grown with revenue recognised over time.` },
      { pair: [
        { type: 'column', title: 'Net debt incl. leases: ₹845 cr (FY23) → net cash (FY25) → ~₹1,100 cr (FY28-29E)', unit: 'Net debt incl. leases (₹ crore), year-end', x: ['FY22', 'FY23', 'FY24', 'FY25', 'FY26', ...X.YRS], series: [{ name: 'Net debt', values: [X.A.netDebt[3], X.A.netDebt[4], X.A.netDebt[5], Math.round(-(464 + 2 + 42 - 352)), Math.round(-cashPath[0]), ...X.F.treasury.map(t => Math.round(-t))], fmt: 'num' }], labels: 'all', highlight: 'FY26', source: 'Screener.in; AR FY25-26 (fixed deposits in other financial assets); GAM estimates (negative = net cash)' },
        { type: 'line', title: 'Receivable days down from 136 to 62; inventory days ~95', unit: 'Days', x: FYS, series: [{ name: 'Receivable days', values: X.A.debtorDays.slice(), fmt: 'num' }, { name: 'Inventory days', values: X.A.inventoryDays.slice(), fmt: 'num' }], labels: 'last', source: 'Screener.in (inventory days on material cost)' },
      ] },
      { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-23', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
        ['Net worth', '{{A.netWorth.4|num}}', '{{A.netWorth.5|num}}', '{{A.netWorth.6|num}}', '{{A.netWorth.7|num}}'],
        ['Borrowings incl. leases', '{{A.borrowings.4|num}}', '{{A.borrowings.5|num}}', '{{A.borrowings.6|num}}', '{{A.borrowings.7|num}}'],
        ['Cash and bank balances', '{{A.cash.4|num}}', '{{A.cash.5|num}}', '{{A.cash.6|num}}', '{{A.cash.7|num}}'],
        ['Inventories', '{{A.inventories.4|num}}', '{{A.inventories.5|num}}', '{{A.inventories.6|num}}', '{{A.inventories.7|num}}'],
        ['Trade receivables', '{{A.receivables.4|num}}', '{{A.receivables.5|num}}', '{{A.receivables.6|num}}', '{{A.receivables.7|num}}'],
        ['Trade payables', '{{A.payables.4|num}}', '{{A.payables.5|num}}', '{{A.payables.6|num}}', '{{A.payables.7|num}}'],
        ['Net fixed assets', '{{A.fixedAssets.4|num}}', '{{A.fixedAssets.5|num}}', '{{A.fixedAssets.6|num}}', '{{A.fixedAssets.7|num}}'],
        ['Capital work in progress', '{{A.cwip.4|num}}', '{{A.cwip.5|num}}', '{{A.cwip.6|num}}', '{{A.cwip.7|num}}'],
      ], source: 'Screener.in (consolidated). Screener\'s cash excludes ₹111.5 cr of fixed deposits in other financial assets at Mar-26 (₹42 cr at Mar-25)' } },
      { callout: `**Cash in the model.** The engine's net figure starts at ₹${n0(cashPath[0])} cr at Mar-26 (cash, investments and deposits less borrowings including ₹${LEASES} cr of leases) and falls to ₹${n0(cashPath[1])} cr at Mar-27E, ₹${n0(cashPath[2])} cr at Mar-28E and ₹${n0(cashPath[3])} cr at Mar-29E: free cash flow is about −₹${n0(-X.F.fcf[0])} cr in FY27E and only turns positive in FY29E. We assume Sai keeps ~₹200 cr of cash and borrows the rest, so bank debt rises from ₹${n0(BORR[0])} cr to ~₹${n0(BORR[2])} cr by Mar-28E (net debt ~${n1(-cashPath[2] / X.F.ebitda[1])}x FY28E EBITDA): comfortable for an AA-rated company, but it turns ₹11 cr of FY26 bank interest into ~₹${n0(X.intBorrow[1])} cr in FY28E.` },
    ],
  };
})();

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: the Kanumuri family 34.5%, domestic institutions 32.7%, foreign investors 19.7%; TPG sold its last 24.7% in 2025',
  blocks: [
    { pair: [
      { type: 'line', title: 'Institutions absorbed TPG\'s stake in Jun-Aug 2025', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }, { name: 'Public (incl. TPG until Aug-25)', ref: 'SH.rows.Public', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoters: 35.2% → 34.5% (ESOP dilution only)', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'all', min: 30, max: 40, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { p: 'Consolidated. History FY19-FY26 (EPS only from FY25, after listing). EBITDA is on Screener\'s basis: forex gains sit in other income, while the company reports them inside EBITDA. Screener nets exceptional items into other income (FY26 −₹9 cr). Forecast other income is interest on the cash Sai keeps (no forex); forecast interest is built from bank debt, leases and other finance costs.' },
    { statement: { title: 'Profit & loss, FY19–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 20 }, hl: true }, { key: 'ebitda', name: 'EBITDA (Screener basis)', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 300 } }, { key: 'dep', name: 'Depreciation' },
      { key: 'otherIncome', name: 'Other income (history incl. forex and exceptional items)' }, { key: 'interest', name: 'Interest' }, { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit', hl: true, flag: { type: 'pct', th: 25 } }, { key: 'eps', name: 'EPS (₹)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' }, { key: 'capex', name: 'Capex' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 20 }, hl: true }, { key: 'ebitda', name: 'EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' }, { key: 'otherIncome', name: 'Other income incl. forex and exceptional' },
      { key: 'interest', name: 'Interest' }, { key: 'dep', name: 'Depreciation' }, { key: 'pat', name: 'Net profit', hl: true },
    ] } },
  ],
};

const statementNotes = {};
module.exports = { financials, seasons, balance, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  const B = fs.existsSync(path.join(__dirname, 'SAILIFE.research.js')) ? require('./SAILIFE.research') : null;
  const report = {
    symbol: 'SAILIFE', listing: 'NSE: SAILIFE · BSE: 544306', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Pharmaceuticals & CRDMO',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, seasons, balance, ownershipBase, statements }) : [financials, seasons, balance, ownershipBase, statements].filter(Boolean),
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
