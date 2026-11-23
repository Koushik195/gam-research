// Authoring source for the Tata Consultancy Services initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated). Part B (TCS.research.js +
// part2-4b, shared TCS.ctx.js) adds the research chapters. Usage: node tools/authoring/TCS.js
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'TCS', 'research');
const SCR = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8')).tables.ratios;
const keepR = SCR.periods.map(p => `${p.slice(-4)}-05-30` <= '2026-09-30');
const RL = SCR.periods.filter((_, i) => keepR[i]).map(p => 'FY' + p.slice(-2));
const RR = k => SCR.rows[k].filter((_, i) => keepR[i]);
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'TCS.json'), 'utf8'));
const A = M.annual, ix = l => A.labels.indexOf(l);
const n0 = v => Math.round(v).toLocaleString('en-IN');
const cagr = (a, z, y) => (Math.pow(z / a, 1 / y) - 1) * 100;
const sum = (k, from, to) => A[k].slice(ix(from), ix(to) + 1).reduce((s, x) => s + (x || 0), 0);
const SRC = { co: 'Company filings, Screener.in (consolidated; Net Profit incl. minorities of ~0.5%), GAM Research' };
const S = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8'));
const ofi = S.schedules['cash-flow']['Cash from Financing Activity']['Other financing items'];
const buyback = fy => -(ofi[`Mar 20${fy.slice(2)}`] || 0);
const m = l => A.ebitdaMargin[ix(l)];

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'A decade of steady compounding; the last three years were the slowest in TCS\'s listed history',
  blocks: [
    { p: `TCS's revenue grew from ₹${n0(A.sales[ix('FY16')])} cr in FY16 to ₹${n0(A.sales[ix('FY26')])} cr in FY26, ${cagr(A.sales[ix('FY16')], A.sales[ix('FY26')], 10).toFixed(1)}% a year, and net profit from ₹${n0(A.pat[ix('FY16')])} cr to ₹${n0(A.pat[ix('FY26')])} cr (${cagr(A.pat[ix('FY16')], A.pat[ix('FY26')], 10).toFixed(1)}% a year, held back by FY26's ₹4,868 cr of one-off charges). The pattern is a post-Covid boom and a long slowdown. In US dollars revenue rose 15.9% in FY22 and 8.6% in FY23, then 4.1%, 3.8% and −0.5% (FY24-26); constant-currency growth was −2.4% in FY26, its second decline in six years (FY21, the Covid year: −0.8%), and this time in a year without a recession. Rupee revenue kept growing (+${A.salesGrowth[ix('FY26')].toFixed(1)}% in FY26) only because the rupee fell from ~74 to ~89 per dollar over FY21-26.` },
    { pair: [
      { type: 'column', title: 'Revenue: 9% a year in rupees, much of it currency lately', unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'ends', source: SRC.co },
      { type: 'column', title: 'Profit: FY26 flat after ₹4,868 cr of one-offs', unit: 'Net profit (₹ crore, reported)', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: a narrow 26-28% band for a decade', unit: 'EBITDA margin (%), Screener basis (TCS operating margin + depreciation)', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 20, max: 32, source: SRC.co },
      { type: 'line', title: 'Employee cost is ~58% of revenue', unit: 'Employee cost (% of revenue)', x: 'A.labels', from: 'FY16', series: [{ name: 'Employee cost', ref: 'A.employeePct', fmt: 'pct0' }], labels: 'all', min: 40, max: 65, source: 'Screener.in' },
    ] },
    { callout: `**Our view:** TCS has always been a margin machine: EBITDA margin between ${Math.min(...['FY16', 'FY18', 'FY20', 'FY22', 'FY24', 'FY26'].map(m)).toFixed(0)}% and ${Math.max(...['FY16', 'FY18', 'FY20', 'FY22', 'FY24', 'FY26'].map(m)).toFixed(0)}% in every year shown, through Covid, the FY22 wage war and the FY26 revenue decline. What changed is growth. EPS compounded ~10.7% a year in FY21-26 (before one-offs), but FY24-26 USD growth averaged ~2.5%, and part of FY26's rupee growth was the falling rupee. The question for the stock is whether that slowdown is a cycle or the new normal (see "The AI question").` },
  ],
};

const capital = {
  id: 'capital', nav: 'Capital allocation', kicker: 'Capital allocation', title: 'Returns to shareholders: ~90% of operating cash goes back; HyperVault is the new claim on capital',
  blocks: [
    { p: `TCS needs little capital: capex was ₹${n0(sum('capex', 'FY22', 'FY26'))} cr over FY22-26 (~1.5% of revenue) against operating cash flow of ₹${n0(sum('cfo', 'FY22', 'FY26'))} cr. It paid ₹${n0(sum('dividendsPaid', 'FY22', 'FY26'))} cr in dividends and spent ~₹${n0(buyback('FY22') + buyback('FY23') + buyback('FY24'))} cr on buybacks and buyback tax (₹18,000 cr in 2022 at ₹4,500 and ₹17,000 cr in 2023 at ₹4,150 a share: both well above today's price). ROCE rose to 63-65% in FY24-26. Two things are new. In FY26 TCS spent ₹6,770 cr on acquisitions (Coastal Cloud and ListEngage) and agreed to buy MHP from Porsche (EUR320 m EV) in Aug-2026. And it committed, with TPG, up to ₹18,000 cr to HyperVault, its AI data-centre venture (TCS 51%).` },
    { pair: [
      { type: 'column', title: 'Cash from operations vs capex', unit: '₹ crore', x: 'A.labels', from: 'FY17', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }], labels: 'none', source: SRC.co },
      { type: 'line', title: 'ROCE: from ~50% to over 60%', unit: 'Return on capital employed (%)', x: RL, series: [{ name: 'ROCE', values: RR('ROCE %'), fmt: 'pct0' }], labels: 'all', min: 0, max: 80, source: 'Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went (₹ crore)', head: ['', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26', 'Five years'], rows: [
      ['Cash from operations', ...['FY22', 'FY23', 'FY24', 'FY25', 'FY26'].map(l => n0(A.cfo[ix(l)])), n0(sum('cfo', 'FY22', 'FY26'))],
      ['Capex', ...['FY22', 'FY23', 'FY24', 'FY25', 'FY26'].map(l => n0(A.capex[ix(l)])), n0(sum('capex', 'FY22', 'FY26'))],
      ['Acquisitions', ...['FY22', 'FY23', 'FY24', 'FY25', 'FY26'].map(l => n0(A.acquisitions[ix(l)] || 0)), n0(sum('acquisitions', 'FY22', 'FY26'))],
      ['Dividends paid', ...['FY22', 'FY23', 'FY24', 'FY25', 'FY26'].map(l => n0(A.dividendsPaid[ix(l)])), n0(sum('dividendsPaid', 'FY22', 'FY26'))],
      ['Buybacks and buyback tax (other financing items)', ...['FY22', 'FY23', 'FY24', 'FY25', 'FY26'].map(l => n0(Math.max(0, buyback(l)))), n0(buyback('FY22') + buyback('FY23') + buyback('FY24'))],
      { hl: true, cells: ['**Returned as % of cash from operations**', ...['FY22', 'FY23', 'FY24', 'FY25', 'FY26'].map(l => `**${Math.round((A.dividendsPaid[ix(l)] + Math.max(0, buyback(l))) / A.cfo[ix(l)] * 100)}%**`), `**${Math.round((sum('dividendsPaid', 'FY22', 'FY26') + buyback('FY22') + buyback('FY23') + buyback('FY24')) / sum('cfo', 'FY22', 'FY26') * 100)}%**`] },
    ], source: 'Screener.in cash flow (consolidated); buybacks from Screener "other financing items" (FY22 Rs18,000 cr buyback; FY24 Rs17,000 cr buyback plus tax); ICICI Direct (buyback terms)' } },
    { callout: '**The capital question:** TCS has always been an asset-light cash machine that hands back almost everything. HyperVault changes the mix: data centres are capital-heavy, earn lower returns and take years to fill, and the CFO has said the business\'s return ratios will be lower (Oct-2025). TPG funding 49% and project debt limit TCS\'s share (we model ~₹3,000 cr a year), and a 1 GW plan needs >US$6.5 bn in total. We keep a 90% payout (dividends plus buybacks) in our forecasts; a buyback "remains an option" (management via JM Financial, Sep-2026).' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'Net cash of ~₹38,000 cr after leases; receivables have crept up',
  blocks: [
    { p: 'TCS has no borrowings other than lease liabilities (₹11,283 cr at Mar-26). It held ₹50,020 cr of "invested funds" (cash, bank deposits, bonds, mutual funds, ₹1,500 cr of inter-corporate deposits and ₹900 cr of reverse repo), so net cash after leases was ~₹38,000 cr, ~5% of its market value at the 30-Sep-2026 price. Goodwill jumped from ₹1,860 cr to ₹9,108 cr with the Salesforce acquisitions. Receivables are the watch item: debtor days (incl. unbilled revenue) rose from 67 in FY21 to 93 in FY26; DSO in dollar terms was 74 days in Q4FY26 and Q1FY27, down from 76 in Q3FY26.' },
    { pair: [
      { type: 'line', title: 'Debtor days up from 67 to 93 since FY21', unit: 'Days of revenue (incl. unbilled)', x: RL, series: [{ name: 'Debtor days', values: RR('Debtor Days'), fmt: 'num' }], labels: 'all', source: 'Screener.in' },
      { type: 'column', title: 'Cash and investments: steady, because cash is paid out', unit: 'Cash and investments (₹ crore, Screener basis)', x: 'A.labels', from: 'FY17', series: [{ name: 'Cash and investments', ref: 'A.cashAndInvestments', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-22', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth', ...['FY22', 'FY24', 'FY25', 'FY26'].map(l => `{{A.netWorth.${ix(l)}|num}}`)],
      ['Lease liabilities (only "borrowings")', ...['FY22', 'FY24', 'FY25', 'FY26'].map(l => `{{A.borrowings.${ix(l)}|num}}`)],
      ['Cash and investments (Screener basis)', ...['FY22', 'FY24', 'FY25', 'FY26'].map(l => `{{A.cashAndInvestments.${ix(l)}|num}}`)],
      ['Net fixed assets (incl. goodwill)', ...['FY22', 'FY24', 'FY25', 'FY26'].map(l => `{{A.fixedAssets.${ix(l)}|num}}`)],
      ['Trade receivables (billed + unbilled)', ...['FY22', 'FY24', 'FY25', 'FY26'].map(l => `{{A.receivables.${ix(l)}|num}}`)],
      ['Trade payables', ...['FY22', 'FY24', 'FY25', 'FY26'].map(l => `{{A.payables.${ix(l)}|num}}`)],
    ], source: SRC.co + '. Invested funds per TCS (Rs50,020 cr at Mar-26) also include ICDs and reverse repo held in "loans".' } },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: Tata Sons 71.7%; foreign funds have been selling for two years',
  blocks: [
    { pair: [
      { type: 'line', title: 'FIIs down from 12.7% to 9.1% in 18 months; domestic institutions up', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoters unchanged at 71.8%', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 60, max: 80, source: 'BSE shareholding pattern, Screener.in' },
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
      { key: 'otherIncome', name: 'Other income (after exceptional items in actuals)' },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit (incl. minorities)', hl: true, flag: { type: 'pct', th: 12 } },
      { key: 'eps', name: 'EPS (₹)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' },
      { key: 'capex', name: 'Capex' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 8 }, hl: true },
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
  const B = fs.existsSync(path.join(__dirname, 'TCS.research.js')) ? require('./TCS.research') : null;
  const report = {
    symbol: 'TCS', listing: 'NSE: TCS · BSE: 532540', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — IT Services',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
