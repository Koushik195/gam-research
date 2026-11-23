// Authoring source for the Tech Mahindra initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated; Net Profit on the
// attributable basis and EPS on the reported share count via TECHM.patch.js). Part B (TECHM.research.js +
// part2-6, shared TECHM.ctx.js) adds the research chapters. Usage: node tools/authoring/TECHM.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'TECHM', 'research');
const SCR = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8')).tables.ratios;
const keepR = SCR.periods.map(p => `${p.slice(-4)}-05-30` <= '2026-09-30');
const RL = SCR.periods.filter((_, i) => keepR[i]).map(p => 'FY' + p.slice(-2));
const RR = k => SCR.rows[k].filter((_, i) => keepR[i]);
const SRC = { co: 'Company filings, Screener.in (consolidated; profit attributable to shareholders, EPS on reported share count), GAM Research' };

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Ten years of revenue growth, five years of flat earnings: EPS was ₹51 in FY21 and ₹54 in FY26',
  blocks: [
    { p: 'Tech Mahindra\'s revenue grew from ₹26,494 cr in FY16 to ₹56,815 cr in FY26, about 7.9% a year in rupees, but profit attributable to shareholders only from ₹2,993 cr to ₹4,811 cr (4.9% a year). The last five years were a round trip. Revenue jumped 18% in FY22 and 19% in FY23 on a post-Covid boom and acquisitions (~₹4,600 cr of non-treasury investing outflows in FY22 alone), then fell 2% in FY24 when telecom and hi-tech clients cut spending. The EBITDA margin halved from 18% (FY21-22) to 8.7% (FY24) and EPS fell from ₹63.4 (FY22) to ₹26.7 (FY24). The turnaround since then is real: margin 13.1% in FY25 and 15.9% in FY26, EPS back to ₹54.3. But FY26 EPS is still below FY22, and in dollars revenue was flat for three years (USD 6,277 mn in FY24, 6,264 mn in FY25, 6,385 mn in FY26).' },
    { pair: [
      { type: 'column', title: 'Revenue: 7.9% a year, mostly from the rupee and acquisitions', unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY16', to: 'FY29E', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'ends', source: SRC.co + '; GAM estimates FY27-29E' },
      { type: 'column', title: 'EPS: ₹63 in FY22, ₹27 in FY24, ₹54 in FY26, ₹74 in FY27E', unit: 'EPS (₹, reported basic; FY27-29E GAM)', x: 'fin.labels', from: 'FY16', to: 'FY29E', series: [{ name: 'EPS', ref: 'fin.eps', fmt: 'n1' }], labels: 'all', source: SRC.co },
    ] },
    { pair: [
      { type: 'line', title: 'EBIT margin: 6.1% to 12.6% in two years; 15% is the FY27 goal', unit: 'EBIT margin (%), Screener basis (EBITDA less depreciation)', x: 'fin.labels', from: 'FY16', to: 'FY29E', series: [{ name: 'EBIT margin', ref: 'fin.ebitMargin', fmt: 'pct' }], labels: 'all', min: 0, max: 20, lines: [{ v: 15, text: 'FY27 target 15%' }], source: SRC.co + '. The company\'s own EBIT was 6.1% (FY24), 9.7% (FY25), 12.6% (FY26)' },
      { type: 'line', title: 'People costs fell from 56% to 54% of revenue in FY26 (50% in Q1FY27)', unit: 'Employee cost, % of revenue (Screener; subcontracting sits in other costs)', x: 'A.labels', from: 'FY16', series: [{ name: 'Employee cost', ref: 'A.employeePct', fmt: 'pct0' }], labels: 'all', min: 40, max: 60, source: 'Screener.in' },
    ] },
    { callout: '**Our view:** two things went wrong in FY23-24 and both were self-inflicted as much as cyclical. Tech Mahindra bought growth (Com Tec Co, Allyis, Activus Connect and Perigord among others; ~₹6,700 cr of non-treasury investing outflows in FY21-23) just before demand turned, and leaned on telecom clients who then cut budgets. The new team\'s fix (Project Fortius) was cost first: fewer subcontractors, more offshore and fixed-price productivity, integrated back offices. That has worked. What has not yet been proven is growth: FY27\'s 6% dollar growth would be the first year above peers since FY23.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Cash & returns', kicker: 'Capital allocation', title: 'Cash generation is steady; returns halved in FY24 and are only now back to the FY22 level',
  blocks: [
    { p: 'An IT services company needs little capital: capex was ₹594-1,015 cr a year in FY22-26 (1.1-2.1% of revenue). Cash from operations was ₹6,172 cr in FY26 (128% of attributable profit) and ₹18,334 cr over FY24-26. Most of it goes back to shareholders: ₹11,785 cr of dividends over FY24-26, more than the ₹11,421 cr of profit. The policy is to return at least 85% of free cash flow over five years; FY26\'s ₹51 a share was 91% of FCF. The weak spot is the past use of capital: goodwill and acquired intangibles are ₹10,426 cr (35% of net worth), much of it from the FY22 spree, and return on capital fell from 26% (FY22) to 12% (FY24).' },
    { pair: [
      { type: 'column', title: 'Cash from operations covers capex several times', unit: '₹ crore', x: 'A.labels', from: 'FY17', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }, { name: 'Dividends paid', ref: 'A.dividendsPaid', fmt: 'num' }], labels: 'none', source: SRC.co },
      { type: 'line', title: 'ROCE: 26% in FY22, 12% in FY24, 23% in FY26', unit: 'Return on capital employed (%), Screener', x: RL, series: [{ name: 'ROCE', values: RR('ROCE %'), fmt: 'pct0' }], labels: 'all', min: 0, max: 35, source: 'Screener.in. Company ROCE (its definition): 22.6% Q4FY25, 26.2% Q4FY26, 28.3% Q1FY27; FY27 goal above 30%' },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went (₹ crore)', head: ['', 'FY21-23', 'FY24-26', 'Six years'], rows: [
      ['Cash from operations', '18,951', '18,334', '37,285'],
      ['Capex', '2,639', '2,081', '4,720'],
      ['Acquisitions and other investing (net, ex treasury)', '~6,700', '~630', '~7,330'],
      ['Dividends paid', '10,003', '11,785', '21,788'],
      { hl: true, cells: ['**Left over before acquisitions**', '**6,309**', '**4,468**', '**10,777**'] },
    ], source: 'Screener.in cash flow (consolidated). Acquisitions approximated from "other investing items" (FY21 −₹1,067 cr, FY22 −₹4,642 cr, FY23 −₹999 cr, FY24 −₹884 cr, FY25 +₹77 cr, FY26 +₹178 cr).' } },
    { callout: '**The capital question:** with growth slow and the policy at 85%+ of FCF, the dividend yield is 3.3% at ₹1,524 on FY26\'s ₹51 and ~4% on our FY27E. The risk is a return to large acquisitions to buy growth; management\'s stated plan is tuck-ins (Avant, ₹188 cr in May-2026). We model ₹850-950 cr of capex and an 85% payout.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'Net cash of ~₹6,300 cr after leases; receivables are the big asset to watch',
  blocks: [
    { p: 'At Mar-2026 Tech Mahindra held ₹5,105 cr of cash and bank balances and ₹3,371 cr of investments (mostly mutual funds), against ₹70 cr of borrowings and ₹2,117 cr of lease liabilities: net cash of ~₹6,300 cr after leases (USD 892 mn of cash on the company\'s definition). Cash rose to ₹9,695 cr (USD 1,026 mn) in Jun-2026. The largest operating asset is receivables: ₹13,358 cr billed and unbilled (86 days of revenue on Screener\'s basis); DSO fell from 95 days (Q1FY26) to 84 (Q1FY27), helped by early client payments that management expects to reverse. Goodwill is ₹8,456 cr. A ₹1,230 cr "suspense account" for alleged advances to the old Satyam sits outside liabilities (see governance).' },
    { pair: [
      { type: 'line', title: 'Receivable days jumped after the FY22 acquisitions; now falling', unit: 'Debtor days (Screener, incl. unbilled)', x: RL, series: [{ name: 'Debtor days', values: RR('Debtor Days'), fmt: 'num' }], labels: 'last', source: 'Screener.in; company DSO 84 days in Q1FY27' },
      { type: 'column', title: 'Cash and investments: ₹8,531 cr at Mar-26', unit: 'Cash and investments (₹ crore, gross)', x: 'A.labels', from: 'FY17', series: [{ name: 'Cash and investments', ref: 'A.cashAndInvestments', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-22', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth (excl. minorities)', '{{A.netWorth.7|num}}', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}'],
      ['Borrowings (incl. leases)', '{{A.borrowings.7|num}}', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}'],
      ['Cash and investments', '{{A.cashAndInvestments.7|num}}', '{{A.cashAndInvestments.9|num}}', '{{A.cashAndInvestments.10|num}}', '{{A.cashAndInvestments.11|num}}'],
      ['Net fixed assets (incl. goodwill, intangibles, leases)', '{{A.fixedAssets.7|num}}', '{{A.fixedAssets.9|num}}', '{{A.fixedAssets.10|num}}', '{{A.fixedAssets.11|num}}'],
      ['Trade receivables (billed + unbilled)', '{{A.receivables.7|num}}', '{{A.receivables.9|num}}', '{{A.receivables.10|num}}', '{{A.receivables.11|num}}'],
      ['Trade payables', '{{A.payables.7|num}}', '{{A.payables.9|num}}', '{{A.payables.10|num}}', '{{A.payables.11|num}}'],
    ], source: SRC.co + '. Minorities (₹462 cr at Mar-26) sit in other liabilities on Screener.' } },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: Mahindra & Mahindra 25.3%, domestic institutions now 37%',
  blocks: [
    { pair: [
      { type: 'line', title: 'Domestic institutions up from 31% to 37% in 18 months; foreign funds down', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoters ~35% (incl. the 9.6% treasury trust)', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 30, max: 40, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY15–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 12 }, hl: true },
      { key: 'ebitda', name: 'EBITDA', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 200 } },
      { key: 'dep', name: 'Depreciation & amortisation' },
      { key: 'otherIncome', name: 'Other income (incl. FX, associates, exceptional items)' },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit (attributable)', hl: true, flag: { type: 'pct', th: 20 } },
      { key: 'eps', name: 'EPS (₹, reported basic)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' },
      { key: 'capex', name: 'Capex' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 12 }, hl: true },
      { key: 'ebitda', name: 'EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' },
      { key: 'otherIncome', name: 'Other income' },
      { key: 'dep', name: 'Depreciation' },
      { key: 'pat', name: 'Net profit (attributable)', hl: true },
    ] } },
  ],
};

const statementNotes = {};
module.exports = { financials, capital, balance, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  const B = fs.existsSync(path.join(__dirname, 'TECHM.research.js')) ? require('./TECHM.research') : null;
  const report = {
    symbol: 'TECHM', listing: 'NSE: TECHM · BSE: 532755', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — IT Services',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
