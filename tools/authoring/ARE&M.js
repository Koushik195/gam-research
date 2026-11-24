// Authoring source for the Amara Raja Energy & Mobility initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported STANDALONE financials (Screener standalone = the lead-acid business;
// the lithium-ion subsidiary ARACT and the other subsidiaries are valued separately). Part B (ARE&M.research.js +
// part2-6, shared ARE&M.ctx.js) adds the research chapters. ARE&M.val.js first syncs the built other income / finance
// cost and the SOTP parts into assumptions.json. The & in the symbol is kept in every file and folder name.
// Usage: node "tools/authoring/ARE&M.js"   (run node src/model.js "ARE&M" before and after)
const fs = require('fs');
const path = require('path');
const SYM = 'ARE&M';
const RD = path.join(__dirname, '..', '..', 'data', 'raw', SYM, 'research');
const MOD = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'models', `${SYM}.json`), 'utf8'));
const SCR = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8')).tables.ratios;
const keepR = SCR.periods.map(p => /^Mar 20(1[6-9]|2\d)$/.test(p) && `${p.slice(-4)}-05-30` <= '2026-09-30');
const RL = SCR.periods.filter((_, i) => keepR[i]).map(p => 'FY' + p.slice(-2));
const RR = k => SCR.rows[k].filter((_, i) => keepR[i]);
const SRC = { co: 'Company filings, Screener.in (standalone Amara Raja Energy & Mobility), GAM Research' };
const AN = MOD.annual, ix = l => AN.labels.indexOf(l), sum = (k, a, z) => AN[k].slice(ix(a), ix(z) + 1).reduce((s, x) => s + (x || 0), 0);
const n0 = v => Math.round(v).toLocaleString('en-IN');
const cash = { cfo: [sum('cfo', 'FY21', 'FY23'), sum('cfo', 'FY24', 'FY26')], capex: [sum('capex', 'FY21', 'FY23'), sum('capex', 'FY24', 'FY26')], div: [sum('dividendsPaid', 'FY21', 'FY23'), sum('dividendsPaid', 'FY24', 'FY26')], subs: [200, 2033] };
const six = k => cash[k][0] + cash[k][1];

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Revenue tripled in ten years, but the EBITDA margin fell from 16-18% to 11%: a premium battery maker that became an ordinary one',
  blocks: [
    { p: 'Standalone revenue (the lead-acid business) was ₹4,618 cr in FY16 and ₹13,549 cr in FY26: 11.4% a year, and 13.6% a year since FY21. Growth came from volumes (cars, two-wheelers, inverters, telecom), from passing on lead costs, and since FY24 from more traded goods (₹2,128 cr, 16% of FY26 revenue: inverters, home UPS, lubes and batteries bought in). The weak spot is margin: 16-18% in FY15-17 and 14-16% to FY21, then 11.8% in FY22, a recovery to 14.4% in FY24 and a slide to 11.4% in FY26 and 10.1% in Q1FY27 as alloys, acid and plastics rose, trading grew and the company spent on brand and capacity. Reported profit carries one-offs: a ₹48 cr fire charge in FY23 and insurance income of ₹111 cr (FY25) and ₹259 cr net (FY26). Before them, EPS went from ₹37.9 (FY21) to ₹42.4 (FY26): just 2% a year.' },
    { pair: [
      { type: 'column', title: 'Revenue: ₹4,618 cr in FY16, ₹13,549 cr in FY26', unit: 'Revenue (₹ crore), standalone', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'line', title: 'EBITDA margin: from 16-18% to 11.4%', unit: 'EBITDA margin (%)', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 8, max: 20, source: SRC.co },
    ] },
    { pair: [
      { type: 'column', title: 'EPS before one-offs: ₹37.9 in FY21, ₹42.4 in FY26', unit: 'EPS (₹), standalone, before exceptional items', x: ['FY19', 'FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'], series: [{ name: 'EPS', values: [28.3, 38.7, 37.9, 29.9, 44.9, 49.5, 48.1, 42.4], fmt: 'n1' }], labels: 'all', source: SRC.co + '. Reported EPS: FY23 ₹42.8, FY25 ₹52.7, FY26 ₹53.0 (exceptional items after tax at 25.17%). FY23 as first reported (17.08 cr shares).' },
      { type: 'line', title: 'ROE: 24% in FY15, 12.5% in FY26', unit: 'Return on equity (%), standalone', x: 'fin.labels', from: 'FY15', to: 'FY26', series: [{ name: 'ROE', ref: 'A.roe', fmt: 'pct' }], labels: 'all', min: 0, max: 28, source: SRC.co + '. FY25-26 include insurance income; equity now carries ₹2,234 cr of investments in subsidiaries (ARACT ₹1,500 cr) that earn nothing yet.' },
    ] },
    { callout: '**Our view:** the core is a solid, cash-generative number-two in a two-player market, growing ~9-15% a year, but its margin is now an ordinary 10-12%, not the 15%+ that once earned it a premium to Exide. Underlying EPS has barely grown in five years. What has changed around it: ₹2,234 cr has gone into subsidiaries (lithium, recycling, chargers) and the parent now borrows a little to keep funding the lithium plan.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capital allocation', kicker: 'Capital allocation', title: `Where the cash went: ₹${n0(six('cfo'))} cr of operating cash in six years, ₹2,233 cr of it into subsidiaries`,
  blocks: [
    { p: `Over FY21-26 the standalone business generated ₹${n0(six('cfo'))} cr of operating cash. It spent ₹${n0(six('capex'))} cr on lead-acid capex (₹440-760 cr a year, including reinstating the Chittoor tubular plant after the January-2023 fire), paid ₹${n0(six('div'))} cr of dividends (20% payout since FY24) and put ₹2,233 cr of equity into subsidiaries: ARACT (lithium-ion) ₹1,500 cr, ARCSPL (lead recycling) ₹600 cr and ARPSL (chargers, power systems) ₹133 cr, plus ₹120 cr of loans to ARPSL. A further ₹400 cr went into ARACT by Aug-2026 (₹1,900 cr in total). Management's group capex for FY27 is ~₹1,700 cr, of which ~₹1,300 cr is New Energy; it calls ~₹2,500 cr the "initial risk capital" for lithium and says the parent can fund it from ₹700-800 cr a year of cash after tax and dividends.` },
    { pair: [
      { type: 'column', title: 'Operating cash flow vs lead-acid capex', unit: '₹ crore, standalone', x: 'A.labels', from: 'FY16', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }], labels: 'none', source: SRC.co + '. Capex as computed by Screener (FY25-26 include the tubular-plant rebuild).' },
      { type: 'stacked', title: 'Equity put into subsidiaries: ₹2,634 cr by Aug-2026', unit: 'Cumulative investment at cost (₹ crore)', x: ['Mar-23', 'Mar-24', 'Mar-25', 'Mar-26', 'Aug-26'], series: [{ name: 'ARACT (lithium)', values: [100, 400, 850, 1500, 1900], fmt: 'num' }, { name: 'ARCSPL, ARPSL, others', values: [101, 454, 734, 734, 734], fmt: 'num' }], labels: 'all', source: 'Standalone note 5 (AR FY24, AR FY26); Q1FY27 deck (₹1,900 cr into ARACT till date)' },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went (₹ crore, standalone)', head: ['', 'FY21-23', 'FY24-26', 'Six years'], rows: [
      ['Cash from operations', n0(cash.cfo[0]), n0(cash.cfo[1]), n0(six('cfo'))],
      ['Lead-acid capex', n0(cash.capex[0]), n0(cash.capex[1]), n0(six('capex'))],
      ['Equity into subsidiaries (ARACT, ARCSPL, ARPSL)', n0(cash.subs[0]), n0(cash.subs[1]), n0(six('subs'))],
      ['Dividends paid', n0(cash.div[0]), n0(cash.div[1]), n0(six('div'))],
      ['Memo: Mangal plastics business (FY24, paid in shares)', '', '672', '672'],
      ['Memo: FY27 plan: New Energy / lead-acid capex (group)', '', '', '~1,300 / ~400'],
    ], source: SRC.co + '; AR notes (investments at cost, Mangal demerger consideration); Q1FY27 call' } },
    { callout: '**The capital question:** lead-acid needs modest capital (capex ~4-5% of revenue) and turns cash; lithium needs a lot more (the original plan was ₹9,500 cr for 16 GWh). So far Amara Raja has been more cautious than Exide (₹1,900 cr into ARACT vs Exide\'s ₹4,902 cr into its cell company) and has built a pack business that already sells ₹800 cr a year. But the cell plant has slipped to 2027, the Chinese technology partner fell away, and management now calls 16 GWh an "ambition". Every rupee beyond the ₹2,500 cr of risk capital is still undecided.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'Nearly debt-free, but no longer cash-rich: ₹2,234 cr sits in subsidiaries and the parent borrows a little',
  blocks: [
    { p: 'At Mar-2026 the standalone company had ₹271 cr of short-term borrowings and ₹101 cr of lease liabilities against ₹115 cr of cash: a small net debt of ~₹156 cr (before leases). Its ₹2,585 cr of investments were almost all subsidiaries at cost: ARACT ₹1,500 cr, ARCSPL ₹600 cr, ARPSL ₹133 cr; mutual funds had been run down from ₹62 cr to nil. Goodwill of ₹428 cr comes from the Mangal plastics demerger. Working capital is moderate: on Screener\'s basis inventory was 89 days, receivables 31 days and payables 47 days in FY26, a 74-day cash cycle (93 days in FY21-22). In our model the parent borrows ~₹500 cr in FY27 to put ₹1,000 cr into ARACT, and turns net cash again in FY28 if no more lithium money is needed.' },
    { pair: [
      { type: 'line', title: 'Cash cycle down to 74 days; receivables 31 days', unit: 'Days', x: RL, series: [{ name: 'Inventory days', values: RR('Inventory Days'), fmt: 'num' }, { name: 'Receivable days', values: RR('Debtor Days'), fmt: 'num' }, { name: 'Payable days', values: RR('Days Payable'), fmt: 'num' }], labels: 'last', source: 'Screener.in (standalone)' },
      { type: 'column', title: 'Investments (subsidiaries) now dwarf the cash', unit: 'Cash and investments (₹ crore), standalone', x: 'A.labels', from: 'FY16', series: [{ name: 'Cash and investments', ref: 'A.cashAndInvestments', fmt: 'num' }], labels: 'all', source: SRC.co + '. From FY24 mostly investments in ARACT, ARCSPL and ARPSL at cost.' },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore, standalone)', head: ['', 'Mar-23', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth', '{{A.netWorth.8|num}}', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}'],
      ['Borrowings (incl. leases)', '{{A.borrowings.8|num}}', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}'],
      ['Cash and investments (incl. subsidiaries at cost)', '{{A.cashAndInvestments.8|num}}', '{{A.cashAndInvestments.9|num}}', '{{A.cashAndInvestments.10|num}}', '{{A.cashAndInvestments.11|num}}'],
      ['Net fixed assets', '{{A.fixedAssets.8|num}}', '{{A.fixedAssets.9|num}}', '{{A.fixedAssets.10|num}}', '{{A.fixedAssets.11|num}}'],
      ['Inventories', '{{A.inventories.8|num}}', '{{A.inventories.9|num}}', '{{A.inventories.10|num}}', '{{A.inventories.11|num}}'],
      ['Trade receivables', '{{A.receivables.8|num}}', '{{A.receivables.9|num}}', '{{A.receivables.10|num}}', '{{A.receivables.11|num}}'],
      ['Trade payables', '{{A.payables.8|num}}', '{{A.payables.9|num}}', '{{A.payables.10|num}}', '{{A.payables.11|num}}'],
    ], source: SRC.co + '. Mar-23 as first reported (before the Mangal restatement).' } },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: the Galla family 33%, foreign funds 17%, Indian institutions 15%, retail 35%',
  blocks: [
    { pair: [
      { type: 'line', title: 'Foreign funds down from 24% to 17% since Mar-2024', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoter stake 32.86% since the Mangal demerger', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 20, max: 40, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials (standalone)',
  blocks: [
    { statement: { title: 'Profit & loss, FY15–FY29E (standalone)', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 15 }, hl: true },
      { key: 'ebitda', name: 'EBITDA', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 100 } },
      { key: 'dep', name: 'Depreciation' },
      { key: 'otherIncome', name: 'Other income (incl. exceptional items)', flag: { type: 'pct', th: 40 } },
      { key: 'interest', name: 'Finance cost' },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit', hl: true, flag: { type: 'pct', th: 20 } },
      { key: 'eps', name: 'EPS (₹)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' },
      { key: 'capex', name: 'Capex (lead-acid)' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L (standalone, as reported by 30-Sep-2026)', rows: [
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
  require('./ARE&M.val').syncMultiples();
  const B = fs.existsSync(path.join(__dirname, 'ARE&M.research.js')) ? require('./ARE&M.research') : null;
  const report = {
    symbol: SYM, listing: 'NSE: ARE&M · BSE: 500008', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Automobiles & components',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  // research JSONs write rupees as 'Rs'; show them as ₹ in the report
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1).replace(/(^|[^A-Za-z])Rs ?(?=[0-9~])/g, '$1₹'));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
