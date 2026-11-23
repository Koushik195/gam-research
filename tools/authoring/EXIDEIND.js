// Authoring source for the Exide Industries initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported STANDALONE financials (Screener standalone = the lead-acid business; the
// lithium-ion subsidiary EESL is valued separately). Part B (EXIDEIND.research.js + part2-6, shared EXIDEIND.ctx.js)
// adds the research chapters. EXIDEIND.val.js first syncs the SOTP parts into assumptions.json.
// Usage: node tools/authoring/EXIDEIND.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'EXIDEIND', 'research');
const MOD = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'models', 'EXIDEIND.json'), 'utf8'));
const SCR = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8')).tables.ratios;
const keepR = SCR.periods.map(p => /^Mar 20(1[6-9]|2\d)$/.test(p) && `${p.slice(-4)}-05-30` <= '2026-09-30');
const RL = SCR.periods.filter((_, i) => keepR[i]).map(p => 'FY' + p.slice(-2));
const RR = k => SCR.rows[k].filter((_, i) => keepR[i]);
const SRC = { co: 'Company filings, Screener.in (standalone Exide Industries), GAM Research' };
const AN = MOD.annual, ix = l => AN.labels.indexOf(l), sum = (k, a, z) => AN[k].slice(ix(a), ix(z) + 1).reduce((s, x) => s + (x || 0), 0);
const n0 = v => Math.round(v).toLocaleString('en-IN');
const cash = { cfo: [sum('cfo', 'FY21', 'FY23'), sum('cfo', 'FY24', 'FY26')], capex: [sum('capex', 'FY21', 'FY23'), sum('capex', 'FY24', 'FY26')], div: [sum('dividendsPaid', 'FY21', 'FY23'), sum('dividendsPaid', 'FY24', 'FY26')], eesl: [715, 4087] };
const six = k => cash[k][0] + cash[k][1];

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Revenue up 2.5 times in ten years, but margins fell from 14-15% to 11%: a volume business that lost its premium',
  blocks: [
    { p: 'Standalone revenue (the lead-acid business) was ₹6,795 cr in FY16 and ₹17,269 cr in FY26: 9.8% a year, and 11.5% a year since FY21. Growth came from volumes and from passing on lead and other input costs; FY26 grew only 4% after a lost quarter around the September-2025 GST change. The EBITDA margin is the weak spot: 13.3-15.0% in FY16-21, then 10.8-11.7% since FY22 as input costs rose faster than prices, competition from Amara Raja stayed tight and telecom and e-rickshaw batteries moved to lithium. Reported profit is muddled by one item: FY22 includes the ₹4,694 cr pre-tax gain on selling Exide Life to HDFC Life. Before it, EPS rose from ₹8.9 (FY21) to ₹13.1 (FY26), 8% a year.' },
    { pair: [
      { type: 'column', title: 'Revenue: ₹6,795 cr in FY16, ₹17,269 cr in FY26', unit: 'Revenue (₹ crore), standalone', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'line', title: 'EBITDA margin: from 13-15% to ~11% since FY22', unit: 'EBITDA margin (%)', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 8, max: 16, source: SRC.co },
    ] },
    { pair: [
      { type: 'column', title: 'EPS before the FY22 Exide Life gain: ₹8.9 to ₹13.1 in five years', unit: 'EPS (₹), standalone; FY22 shown before the sale gain', x: ['FY19', 'FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'], series: [{ name: 'EPS', values: [9.93, 9.71, 8.92, 10.02, 10.63, 12.39, 12.67, 13.07], fmt: 'n1' }], labels: 'all', source: SRC.co + '. FY22 reported EPS ₹55.1 incl. the Exide Life gain (₹3,832 cr after tax).' },
      { type: 'line', title: 'ROE: 12-15% before FY22, ~8% since', unit: 'Return on equity (%), standalone', x: ['FY17', 'FY18', 'FY19', 'FY20', 'FY21', 'FY23', 'FY24', 'FY25', 'FY26'], series: [{ name: 'ROE', values: ['FY17', 'FY18', 'FY19', 'FY20', 'FY21', 'FY23', 'FY24', 'FY25', 'FY26'].map(l => AN.roe[ix(l)]), fmt: 'pct' }], labels: 'all', min: 0, max: 18, source: SRC.co + '. FY22 (54%, sale gain) left out. Equity now carries ~₹10,000 cr of HDFC Life shares and EESL that earn little.' },
    ] },
    { callout: '**Our view:** the core business is a steady, cash-generative duopoly franchise growing ~9-11% a year at an ~11-12% margin. What has changed is the balance sheet around it: half of standalone equity now sits in an insurance stake (₹5,140 cr at Mar-26) and a lithium-ion start-up (₹4,802 cr invested by Mar-26) that earn almost nothing yet. That is why ROE fell from 12-15% to ~8% and why the street values Exide in parts.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capital allocation', kicker: 'Capital allocation', title: `Where the cash went: ₹${n0(six('cfo'))} cr of operating cash in six years, ₹4,802 cr of it into lithium-ion`,
  blocks: [
    { p: `Over FY21-26 the standalone business generated ₹${n0(six('cfo'))} cr of operating cash. It spent ₹${n0(six('capex'))} cr on lead-acid capex (about ₹400-600 cr a year: debottlenecking and automation more than new plants), paid ₹${n0(six('div'))} cr of dividends (₹2 a share most years) and put ₹4,802 cr of equity into Exide Energy Solutions (EESL), its lithium-ion cell subsidiary. The Exide Life sale (Jan-2022) brought ₹726 cr of cash and 8.70 cr HDFC Life shares, which Exide still holds. FY27 adds ₹1,400 cr for EESL (₹100 cr paid in July) against ~₹500 cr of lead-acid capex; management says both are funded from operating cash flow, and the standalone company stays debt-free.` },
    { pair: [
      { type: 'column', title: 'Operating cash flow vs lead-acid capex', unit: '₹ crore, standalone', x: 'A.labels', from: 'FY16', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }], labels: 'none', source: SRC.co + '. FY22 CFO near zero: tax of ~₹775 cr on the Exide Life gain and a working-capital build.' },
      { type: 'column', title: 'Equity put into EESL: ₹4,902 cr by Jul-2026', unit: 'Cumulative equity in EESL at cost (₹ crore)', x: ['Mar-23', 'Mar-24', 'Mar-25', 'Mar-26', 'Jul-26'], series: [{ name: 'EESL equity', values: [715, 2302, 3302, 4802, 4902], fmt: 'num' }], labels: 'all', source: 'AR FY23, FY25, FY26 (note 4); Q1FY27 call' },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went (₹ crore, standalone)', head: ['', 'FY21-23', 'FY24-26', 'Six years'], rows: [
      ['Cash from operations', n0(cash.cfo[0]), n0(cash.cfo[1]), n0(six('cfo'))],
      ['Lead-acid capex', n0(cash.capex[0]), n0(cash.capex[1]), n0(six('capex'))],
      ['Equity into EESL (lithium-ion)', n0(cash.eesl[0]), n0(cash.eesl[1]), n0(six('eesl'))],
      ['Dividends paid', n0(cash.div[0]), n0(cash.div[1]), n0(six('div'))],
      ['Memo: cash from the Exide Life sale (FY22)', '726', '', '726'],
      ['Memo: FY27 EESL approval / lead-acid capex', '', '', '1,400 / ~500'],
    ], source: SRC.co + '; AR notes (EESL at cost); AR FY23 note 54 (sale consideration)' } },
    { callout: '**The capital question:** lead-acid needs little capital (capex ~3% of revenue) and turns cash; the lithium-ion plant needs a lot (₹4,902 cr so far for 6 GWh, more for 12 GWh) and has not earned a rupee from cells yet. Investors are being asked to trust that a first-generation Indian cell plant, with Chinese technology, imported materials and no PLI subsidy, will earn its cost of capital.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'Debt-free, with ₹10,700 cr of investments: HDFC Life, EESL and a thin cash buffer',
  blocks: [
    { p: 'At Mar-2026 the standalone company had no borrowings other than ₹375 cr of lease liabilities. Its investments of ₹10,734 cr were: HDFC Life shares ₹5,140 cr (at fair value, ₹590.6 a share), EESL ₹4,802 cr (at cost), other subsidiaries and small holdings ₹538 cr, and liquid funds ₹254 cr; cash was ₹165 cr. So liquid money was only ~₹420 cr: almost all the surplus cash of recent years has gone into EESL. Working capital fell to 23 days in FY26 (inventory 106 days, receivables 31, payables 95) as payables rose. In our model liquid funds go to about zero in FY27 (₹1,400 cr to EESL) and rebuild from FY28 if no more equity is needed.' },
    { pair: [
      { type: 'line', title: 'Payable days up from 55 to 95; inventory ~106 days', unit: 'Days', x: RL, series: [{ name: 'Inventory days', values: RR('Inventory Days'), fmt: 'num' }, { name: 'Receivable days', values: RR('Debtor Days'), fmt: 'num' }, { name: 'Payable days', values: RR('Days Payable'), fmt: 'num' }], labels: 'last', source: 'Screener.in (standalone)' },
      { type: 'column', title: 'Investments (HDFC Life, EESL) dwarf the operating assets', unit: 'Cash and investments (₹ crore), standalone', x: 'A.labels', from: 'FY16', series: [{ name: 'Cash and investments', ref: 'A.cashAndInvestments', fmt: 'num' }], labels: 'all', source: SRC.co + '. Includes the HDFC Life stake at fair value and EESL at cost.' },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore, standalone)', head: ['', 'Mar-22', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth', '{{A.netWorth.7|num}}', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}'],
      ['Borrowings (leases)', '{{A.borrowings.7|num}}', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}'],
      ['Cash and investments (HDFC Life, EESL, liquid funds)', '{{A.cashAndInvestments.7|num}}', '{{A.cashAndInvestments.9|num}}', '{{A.cashAndInvestments.10|num}}', '{{A.cashAndInvestments.11|num}}'],
      ['Net fixed assets', '{{A.fixedAssets.7|num}}', '{{A.fixedAssets.9|num}}', '{{A.fixedAssets.10|num}}', '{{A.fixedAssets.11|num}}'],
      ['Inventories', '{{A.inventories.7|num}}', '{{A.inventories.9|num}}', '{{A.inventories.10|num}}', '{{A.inventories.11|num}}'],
      ['Trade receivables', '{{A.receivables.7|num}}', '{{A.receivables.9|num}}', '{{A.receivables.10|num}}', '{{A.receivables.11|num}}'],
      ['Trade payables', '{{A.payables.7|num}}', '{{A.payables.9|num}}', '{{A.payables.10|num}}', '{{A.payables.11|num}}'],
    ], source: SRC.co + '. The HDFC Life stake moves with its share price through other comprehensive income (−₹834 cr in FY26).' } },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: Chloride Eastern 46%, Indian institutions 19%, foreign funds 11%',
  blocks: [
    { pair: [
      { type: 'line', title: 'Foreign funds down from ~14% to ~11%; Indian institutions up to 19%', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoter stake unchanged at 45.99%', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 40, max: 50, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials (standalone)',
  blocks: [
    { statement: { title: 'Profit & loss, FY15–FY29E (standalone)', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 20 }, hl: true },
      { key: 'ebitda', name: 'EBITDA', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 100 } },
      { key: 'dep', name: 'Depreciation' },
      { key: 'otherIncome', name: 'Other income (FY22 incl. Exide Life gain)', flag: { type: 'pct', th: 40 } },
      { key: 'interest', name: 'Finance cost' },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit', hl: true, flag: { type: 'pct', th: 30 } },
      { key: 'eps', name: 'EPS (₹)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' },
      { key: 'capex', name: 'Capex (lead-acid)' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L (standalone, as reported by 30-Sep-2026)', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 15 }, hl: true },
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
  require('./EXIDEIND.val').syncMultiples();
  const B = fs.existsSync(path.join(__dirname, 'EXIDEIND.research.js')) ? require('./EXIDEIND.research') : null;
  const report = {
    symbol: 'EXIDEIND', listing: 'NSE: EXIDEIND · BSE: 500086', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Automobiles & components',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  // research JSONs write rupees as 'Rs'; show them as ₹ in the report
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1).replace(/(^|[^A-Za-z])Rs ?(?=[0-9~])/g, '$1₹'));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
