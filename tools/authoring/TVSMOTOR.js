// Authoring source for the TVS Motor Company initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// The engine models the STANDALONE auto business (Screener standalone; consolidated copy in research/); TVS Credit and the
// other subsidiaries are valued in a sum of the parts (TVSMOTOR.ctx.js), carried into the engine by TVSMOTOR.sotp.js.
// Part A (this file): chapters on reported financials + the writer. Part B: TVSMOTOR.research.js + part2-6.
// Usage: node tools/authoring/TVSMOTOR.js   (run node src/model.js TVSMOTOR before and after)
const fs = require('fs');
const path = require('path');
const { syncSotp } = require('./TVSMOTOR.sotp');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'TVSMOTOR', 'research');
const h = key => `i < 6 ? null : g('fin.${key}')[i]`; // statements start at FY21 (index 6 on fin.labels)
const SRC = { co: 'Company filings, Screener.in (standalone), GAM Research', est: 'Company, Screener.in (standalone); GAM Research estimates (FY27-29E)', calls: 'TVS Motor results releases and earnings calls, GAM Research' };

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Five years of 23% revenue growth and a margin that doubled, but still a 13% business',
  blocks: [
    { p: 'From FY21 to FY26 standalone revenue grew from ₹{{fin.sales.6|num}} cr to ₹{{fin.sales.11|num}} cr (~23% a year), EBITDA from ₹{{fin.ebitda.6|num}} cr to ₹{{fin.ebitda.11|num}} cr and net profit from ₹{{fin.pat.6|num}} cr to ₹{{fin.pat.11|num}} cr (~43% a year). Three things did it: volumes nearly doubled (3.05mn to 5.89mn vehicles), revenue per vehicle rose ~46% (premium motorcycles, scooters, EVs and exports), and the EBITDA margin rose from {{fin.ebitdaMargin.6|pct}} to {{fin.ebitdaMargin.11|pct}} as raw materials fell from 76% to 71% of sales and fixed costs were spread over more units.' },
    { pair: [
      { type: 'column', title: 'Revenue has almost tripled since FY21', unit: 'Standalone revenue (₹ crore)', x: 'fin.labels', from: 'FY17', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num', growth: true }], source: SRC.est },
      { type: 'line', title: 'EBITDA margin: 8.5% to 12.9% in five years, then flat', unit: 'EBITDA margin (%), standalone', x: 'fin.labels', from: 'FY17', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 5, max: 15, source: SRC.est },
    ] },
    { pair: [
      { type: 'line', title: 'Raw materials fell from 76% to 71% of sales', unit: 'Material cost as % of sales (standalone)', x: 'A.labels', series: [{ name: 'Material cost %', ref: 'A.materialPct', fmt: 'pct0' }], labels: 'all', min: 60, max: 80, source: 'Screener.in, GAM Research' },
      { type: 'column', title: 'EBITDA per vehicle: ₹4.1k in FY20 to ₹10.3k in FY26', unit: "EBITDA per vehicle sold (₹ '000)", x: 'fin.labels', from: 'FY20', series: [{ name: 'EBITDA/vehicle', fn: "g('kpi.units')[i] ? g('fin.ebitda')[i] * 1e7 / g('kpi.units')[i] / 1000 : null", fmt: 'n1' }], labels: 'all', source: SRC.est },
    ] },
    { p: 'Our forecasts keep growth strong but slower: revenue +{{F.salesGrowth.0|pct}} / +{{F.salesGrowth.1|pct}} / +{{F.salesGrowth.2|pct}} in FY27-29E, EBITDA margin {{F.ebitdaMargin.0|pct}} / {{F.ebitdaMargin.1|pct}} / {{F.ebitdaMargin.2|pct}}, and EPS ₹{{F.eps.0|num}} / ₹{{F.eps.1|num}} / ₹{{F.eps.2|num}}. FY29E margin and EPS growth dip because the auto PLI scheme, worth ~0.6-0.9% of revenue, ends in March 2028. Depreciation rises with ₹3,000-3,500 cr a year of capex (FY27E ~₹{{F.dep.0|num}} cr vs ₹{{fin.dep.11|num}} cr in FY26).' },
    { pair: [
      { type: 'column', title: 'EPS: ₹76 in FY26 to ₹{{F.eps.2|num}} in FY29E', unit: 'Standalone EPS (₹)', x: 'fin.labels', from: 'FY20', series: [{ name: 'EPS', ref: 'fin.eps', fmt: 'num', growth: true }], source: SRC.est },
      { type: 'line', title: 'Standalone ROE is high because ₹11,300 cr sits in subsidiaries at cost', unit: 'Return on average standalone equity (%)', x: 'fin.labels', from: 'FY20', series: [{ name: 'ROE', ref: 'fin.roe', fmt: 'pct' }], labels: 'all', min: 0, max: 40, source: SRC.est },
    ] },
    { callout: '**Read the margin right.** At {{fin.ebitdaMargin.11|pct}} TVS earns about ₹10,300 of EBITDA per vehicle. Its FY26 margin compares with 14.9% at Hero MotoCorp, 20.8% at Bajaj Auto and 24.7% at Eicher (consolidated, Screener). The margin story of FY21-26 was real, but it has stalled at 12.5-13.1% for six quarters and now carries a PLI benefit that ends after FY28. The growth is in volumes and mix, not in margin.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'Strong cash generation, but the cash goes to subsidiaries and a ₹1,900 cr preference payout',
  blocks: [
    { p: 'At March 2026 the standalone company had net worth of ₹{{A.netWorth.11|num}} cr and borrowings of ₹{{A.borrowings.11|num}} cr, of which ₹1,899 cr were the 6% bonus preference shares (NCRPS) issued to shareholders in September 2025 and redeemed on 1-Sep-2026. Its investments of ₹{{A.investments.11|num}} cr were almost all strategic: ₹7,172 cr in TVS Motor (Singapore), the holding company for Norton and the e-bike business, ₹2,515 cr in TVS Credit, ₹511 cr in the Dubai hub, ₹477 cr in PT TVS Indonesia and ₹314 cr in DriveX. Cash was ₹{{A.cash.11|num}} cr. Working capital is negative: suppliers are paid in ~90 days, customers pay in ~16 (dealers are cash-and-carry), and ₹946 cr of payables sat in supplier-finance arrangements.' },
    { pair: [
      { type: 'column', title: 'Operating cash flow ₹5,730 cr in FY26', unit: 'Cash from operations and capex (₹ crore), standalone', x: 'A.labels', series: [{ name: 'CFO', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num', slot: 2 }], source: 'Screener.in, GAM Research' },
      { type: 'column', title: 'Investments in group companies: ₹6,600 cr in FY24 to ₹11,300 cr', unit: 'Standalone investments (₹ crore, mostly subsidiaries at cost)', x: 'A.labels', series: [{ name: 'Investments', ref: 'A.investments', fmt: 'num' }], source: 'Screener.in; AR FY26 note 4' },
    ] },
    { exhibit: { type: 'table', title: 'Where the FY26 cash went (₹ crore, approximate)', head: ['Item', '₹ crore', 'Source / comment'], wide: [2], rows: [
      ['Operating cash flow', '5,730', 'Screener (standalone cash flow)'],
      ['Capex', '(2,013)', 'Screener; FY27 guided ~₹3,500 cr'],
      ['Investments in subsidiaries', '(~2,400)', 'Q4FY26 call: mostly Norton, ~₹200 cr TVS Credit, ~₹300 cr Dubai; FY27 ~70% of this'],
      ['Sale of Rapido stake', '288', 'AR FY26 (₹114 cr invested)'],
      ['Dividend', '(570)', '₹12 per share, Mar-2026'],
      ['NCRPS issued (bonus, non-cash in FY26) → redeemed 1-Sep-2026', '(1,900) in FY27', '₹40 per share; paid out of borrowings and cash'],
    ], source: SRC.co } },
    { p: 'In our model the standalone "treasury" (cash + investments − debt) includes the subsidiaries at cost, earns no yield, and grows from ₹{{fin.treasury.11|num}} cr to ₹{{F.treasury.2|num}} cr by FY29E because the engine has no line for money sent to subsidiaries. In reality ₹1,700-1,900 cr a year is guided to go out. That is why we value the subsidiaries separately and do not add standalone net cash to the P/E value.' },
    { callout: '**So what.** TVS generates ~₹3,800 cr of operating free cash flow, but less than half of it reaches shareholders: in FY26 ~₹2,400 cr went into subsidiaries, most of it into businesses that lose money (Norton, the Swiss e-bike group). The ₹1,900 cr NCRPS payout in September 2026 was the first large cash return in years. Capital allocation is the weakest part of the TVS story.' },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: the Venu Srinivasan family controls 50.3% through TVS Holdings; domestic funds bought in Q1FY27',
  blocks: [
    { pair: [
      { type: 'line', title: 'Foreign funds sold, domestic funds bought in the June quarter', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoter holding unchanged at 50.27% for three years', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 45, max: 55, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials (standalone)',
  blocks: [
    { p: 'Standalone TVS Motor (the auto business plus investments at cost). FY25 is restated for the merger of Sundaram Auto Components. Flags mark large moves; notes explain them.' },
    { statement: { title: 'Standalone P&L, FY21–FY29E', source: SRC.est, rows: [
      { key: 'sales', name: 'Revenue', fn: h('sales'), flag: { type: 'pct', th: 28 }, hl: true }, { key: 'ebitda', name: 'EBITDA', fn: h('ebitda'), flag: { type: 'pct', th: 35 } }, { key: 'ebitdaMargin', name: 'EBITDA margin %', fn: h('ebitdaMargin'), fmt: 'pct', flag: { type: 'bps', th: 120 } },
      { key: 'dep', name: 'Depreciation', fn: h('dep'), flag: { type: 'pct', th: 22 } }, { key: 'otherIncome', name: 'Other income (incl. fair-value marks)', fn: h('otherIncome') }, { key: 'pbt', name: 'Profit before tax', fn: h('pbt') },
      { key: 'pat', name: 'Net profit', fn: h('pat'), hl: true, flag: { type: 'pct', th: 45 } }, { key: 'eps', name: 'EPS (₹)', fn: h('eps'), fmt: 'n1' }, { key: 'capex', name: 'Capex', fn: h('capex'), flag: { type: 'pct', th: 60 } },
      { key: 'cfo', name: 'Cash from operations', fn: h('cfo') }, { key: 'netWorth', name: 'Net worth', fn: h('netWorth') }, { key: 'roe', name: 'ROE %', fn: h('roe'), fmt: 'pct' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L (standalone)', source: 'Screener.in (standalone), as published to 30-Sep-2026', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, hl: true }, { key: 'ebitda', name: 'EBITDA' }, { key: 'opm', name: 'EBITDA margin %', fn: "g('Q.ebitda')[i] / g('Q.sales')[i] * 100", fmt: 'pct' }, { key: 'otherIncome', name: 'Other income' }, { key: 'pat', name: 'Net profit', hl: true }, { key: 'eps', name: 'EPS (₹)', fmt: 'n2' },
    ] } },
  ],
};

module.exports = { financials, balance, ownershipBase, statements, RD, SRC };

if (require.main === module) {
  syncSotp(); // keeps the engine's implied SOTP multiple in step with the built model
  const B = fs.existsSync(path.join(__dirname, 'TVSMOTOR.research.js')) ? require('./TVSMOTOR.research') : null;
  const report = {
    symbol: 'TVSMOTOR', listing: 'NSE: TVSMOTOR · BSE: 532343', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Auto & Auto Components',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, balance, ownershipBase, statements }) : [financials, balance, ownershipBase, statements],
    statementNotes: B?.statementNotes || {},
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections, ${JSON.stringify(report).match(/"type":/g).length} exhibits`);
}
