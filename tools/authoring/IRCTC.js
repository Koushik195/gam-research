// Authoring source for the IRCTC initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated from FY23, standalone before; the
// subsidiary is small). Part B (IRCTC.research.js + part2-6, shared IRCTC.ctx.js) adds the research chapters.
// IRCTC.val.js first syncs the derived multiples into assumptions.json. Usage: node tools/authoring/IRCTC.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'IRCTC', 'research');
const SCRJ = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8'));
const SCR = SCRJ.tables.ratios;
const keepR = SCR.periods.map(p => /^Mar 20(1[6-9]|2\d)/.test(p) && `${p.slice(4, 8)}-05-30` <= '2026-09-30');
const RL = SCR.periods.filter((_, i) => keepR[i]).map(p => 'FY' + p.slice(6, 8));
const RR = k => SCR.rows[k].filter((_, i) => keepR[i]);
const CASH = SCRJ.schedules['balance-sheet']['Other Assets']['Cash Equivalents'];
const CY = ['FY19', 'FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'], CV = CY.map(f => CASH[`Mar 20${f.slice(2)}`]);
const SRC = { co: 'Company filings, Screener.in (standalone to FY22, consolidated from FY23), GAM Research' };

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Revenue up 5x in eleven years; the margin peaked in FY22 and has fallen every year since',
  blocks: [
    { p: 'IRCTC\'s revenue was ₹1,059 cr in FY15 and ₹5,215 cr in FY26. Covid cut FY21 revenue by two-thirds (₹777 cr) because trains and catering stopped; ticketing kept the company profitable. Since FY23 (the first normal year) revenue has grown ~14% a year, but the mix has changed. Catering, which earns a 9-12% segment margin, grew from 42% to 46% of segment revenue, while internet ticketing (80-85% margin) grew only 8-10% a year. So the EBITDA margin has fallen from 46.5% in FY22 (when catering was still partly shut) to 36.0% in FY23, 31.9% in FY26 and 28.2% in Q1FY27. EPS still compounded 11.5% a year over FY23-26 (₹12.57 to ₹17.42), helped by other income on a growing cash pile.' },
    { pair: [
      { type: 'column', title: 'Revenue: Covid hole in FY21, ~14% a year since FY23', unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'column', title: 'Net profit: ₹1,393 cr in FY26, 2.7x FY20', unit: 'Net profit (₹ crore)', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: from 46% (FY22) to 32% (FY26) as catering grew', unit: 'EBITDA margin (%)', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 0, max: 50, source: SRC.co },
      { type: 'column', title: 'Other income is ~15% of pre-tax profit again', unit: 'Other income incl. exceptional items, % of profit before tax', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'Share of PBT', ref: 'fin.otherIncomeShare', fmt: 'pct0' }], labels: 'all', source: SRC.co },
    ] },
    { callout: '**Our view:** IRCTC is two businesses in one wrapper. A near-monopoly ticketing platform makes about three-quarters of segment profit on under 30% of revenue; a large, low-margin catering and services business makes most of the growth. Each rupee of new revenue now carries a much lower margin than the average, so EBITDA grows more slowly than revenue (FY26: revenue +11.6%, EBITDA +7.4%) unless the Railways let the ticketing fee rise.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capex & returns', kicker: 'Capital allocation', title: 'Almost no capital needed: ₹4,572 cr of operating cash in six years, ₹520 cr of capex, ~60% paid out',
  blocks: [
    { p: 'IRCTC runs on other people\'s assets: the Railways own the trains, licensees run most kitchens and vending, and Rail Neer plants are partly PPP. Net fixed assets were ₹839 cr at Mar-2026 (including an office building and right-of-use assets) against ₹5,215 cr of revenue. Over FY21-26 it generated ₹4,572 cr of operating cash, spent ~₹520 cr on capex and paid out ~₹2,700 cr of dividends; the rest went into bank deposits. Returns are very high (ROE 35-46% since FY22) because equity is small and the ticketing business needs no capital. As a CPSE, IRCTC pays dividends under DIPAM\'s guidelines and cannot decide a buyback on its own.' },
    { pair: [
      { type: 'column', title: 'Operating cash flow dwarfs capex', unit: '₹ crore', x: 'A.labels', from: 'FY16', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Free cash flow', ref: 'A.fcf', fmt: 'num' }], labels: 'none', source: SRC.co },
      { type: 'line', title: 'ROE: 35-46% since FY22 (13.5% in Covid-hit FY21)', unit: 'Return on equity (%)', x: 'A.labels', from: 'FY16', series: [{ name: 'ROE', ref: 'A.roe', fmt: 'pct0' }], labels: 'all', min: 0, max: 55, source: SRC.co },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went (₹ crore)', head: ['', 'FY21-23', 'FY24-26', 'Six years'], rows: [
      ['Cash from operations', '1,584', '2,988', '4,572'],
      ['Capex (cash; Screener)', '~170', '~360', '~520'],
      ['Dividends paid', '~700', '~2,040', '~2,740'],
      { hl: true, cells: ['**Left over (into deposits)**', '**~720**', '**~590**', '**~1,310**'] },
      ['Memo: cash and bank balances at the end', '1,931', '2,868', ''],
    ], source: 'Screener.in cash flow (FY21-22 standalone); dividends from the financing cash flow and PL Capital (FY25 ₹880 cr, FY26 ₹760 cr paid). Approximate where marked ~.' } },
    { callout: '**The capital question:** there is not much of one. Management lists an e-ticketing infrastructure refresh, a disaster-recovery site, two Rail Neer expansions, four new Rail Neer plants and a possible move into hotels (Q4FY26 call); together these are small against ₹1,100-1,300 cr a year of free cash flow. The real lever is the payout: 52% in FY26 under DIPAM rules, with the cash pile still growing.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'No debt, ₹2,868 cr of cash and deposits, and ₹1,882 cr owed by the Railways',
  blocks: [
    { p: 'At Mar-2026 IRCTC held ₹412 cr in current accounts and ₹2,456 cr in bank deposits and restricted balances (₹149 cr of it margin money against bank guarantees), plus ₹93 cr of accrued interest; its only debt is ₹81 cr of lease liabilities. Net treasury: ~₹2,868 cr, ~₹36 a share, 8% of the market value. The cash is not all free: IRCTC collects ticket and catering money that it owes the Railways (other current liabilities ₹1,524 cr, trade payables ₹930 cr), but it is also owed ₹1,882 cr of receivables (132 days of revenue), mostly by the Railways for prepaid-train catering and services. Working capital is therefore positive and rising with catering. The balances with the Railways are "subject to reconciliation" (AR note 49).' },
    { pair: [
      { type: 'line', title: 'Receivable days: 118 in FY23-24, 132-135 since', unit: 'Days', x: RL, series: [{ name: 'Receivable days', values: RR('Debtor Days'), fmt: 'num' }], labels: 'last', source: 'Screener.in' },
      { type: 'column', title: 'Cash and bank balances: ₹2,868 cr at Mar-26', unit: 'Cash and bank balances (₹ crore)', x: CY, series: [{ name: 'Cash and bank', values: CV, fmt: 'num' }], labels: 'all', source: 'Screener.in (cash and other bank balances; accrued interest and margin TDRs excluded)' },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-23', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth', '{{A.netWorth.8|num}}', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}'],
      ['Borrowings (leases)', '{{A.borrowings.8|num}}', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}'],
      ['Cash and bank balances', '{{A.cash.8|num}}', '{{A.cash.9|num}}', '{{A.cash.10|num}}', '{{A.cash.11|num}}'],
      ['Trade receivables', '{{A.receivables.8|num}}', '{{A.receivables.9|num}}', '{{A.receivables.10|num}}', '{{A.receivables.11|num}}'],
      ['Trade payables', '{{A.payables.8|num}}', '{{A.payables.9|num}}', '{{A.payables.10|num}}', '{{A.payables.11|num}}'],
      ['Net fixed assets', '{{A.fixedAssets.8|num}}', '{{A.fixedAssets.9|num}}', '{{A.fixedAssets.10|num}}', '{{A.fixedAssets.11|num}}'],
    ], source: SRC.co + '. Mar-26 detail: AR FY26 consolidated balance sheet and notes 10.2-10.4.' } },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: the government 62.4%, LIC 10.7%, foreign funds down to 3.9%',
  blocks: [
    { pair: [
      { type: 'line', title: 'Foreign funds halved in a year; Indian institutions steady', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Government stake fixed at 62.4% since the Dec-2022 OFS', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 50, max: 70, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY15–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 15 }, hl: true },
      { key: 'ebitda', name: 'EBITDA', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 200 } },
      { key: 'dep', name: 'Depreciation' },
      { key: 'otherIncome', name: 'Other income (incl. exceptional items in actual years)', flag: { type: 'pct', th: 40 } },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit', hl: true, flag: { type: 'pct', th: 25 } },
      { key: 'eps', name: 'EPS (₹)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' },
      { key: 'capex', name: 'Capex' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L (as reported by 30-Sep-2026)', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 15 }, hl: true },
      { key: 'ebitda', name: 'EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' },
      { key: 'otherIncome', name: 'Other income (incl. exceptional items)' },
      { key: 'dep', name: 'Depreciation' },
      { key: 'pat', name: 'Net profit', hl: true },
    ] } },
  ],
};

const statementNotes = {};

module.exports = { financials, capital, balance, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  require('./IRCTC.val').syncMultiples();
  const B = fs.existsSync(path.join(__dirname, 'IRCTC.research.js')) ? require('./IRCTC.research') : null;
  const report = {
    symbol: 'IRCTC', listing: 'NSE: IRCTC · BSE: 542830', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Consumer services & internet',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
