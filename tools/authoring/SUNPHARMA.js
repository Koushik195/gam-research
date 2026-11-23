// Authoring source for the Sun Pharmaceutical Industries initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated; Net Profit on the attributable basis via
// SUNPHARMA.patch.js). Part B (SUNPHARMA.research.js + part2-6, shared SUNPHARMA.ctx.js) adds the research chapters.
// SUNPHARMA.sotp.js first syncs the sum of the parts (standalone Sun P/E + the pending Organon deal at cost) into
// assumptions.json as an implied P/E on standalone Sep-28E EPS. Usage: node tools/authoring/SUNPHARMA.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'SUNPHARMA', 'research');
const SCR = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8'));
const M = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'models', 'SUNPHARMA.json'), 'utf8'));
const A = M.annual, b = A.labels.length - 1, ix = l => A.labels.indexOf(l);
const RT = SCR.tables.ratios, keepR = RT.periods.map(p => `${p.slice(-4)}-05-30` <= '2026-09-30');
const RL = RT.periods.filter((_, i) => keepR[i]).map(p => 'FY' + p.slice(-2));
const RR = k => RT.rows[k].filter((_, i) => keepR[i]);
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const sum = (k, from, to) => { let s = 0; for (let i = ix(from); i <= ix(to); i++) s += A[k][i] || 0; return s; };
const SRC = { co: 'Company filings, Screener.in (consolidated; net profit attributable to owners), GAM Research' };
const cfo2126 = sum('cfo', 'FY21', 'FY26'), capex2126 = sum('capex', 'FY21', 'FY26'), acq2126 = sum('acquisitions', 'FY21', 'FY26'), div2126 = sum('dividendsPaid', 'FY21', 'FY26');
const cagr = (a, c, y) => (Math.pow(c / a, 1 / y) - 1) * 100;

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Revenue up 75% in five years; margins up 3 points; reported profit dented by a charge every year',
  blocks: [
    { p: `Sun's consolidated revenue went from ₹${n0(A.sales[ix('FY21')])} cr in FY21 to ₹${n0(A.sales[b])} cr in FY26: ${n1(cagr(A.sales[ix('FY21')], A.sales[b], 5))}% a year. EBITDA before forex gains rose from ₹${n0(A.ebitda[ix('FY21')])} cr to ₹${n0(A.ebitda[b])} cr and the margin from ${n1(A.ebitdaMargin[ix('FY21')])}% to ${n1(A.ebitdaMargin[b])}%, as innovative medicines grew from 13% of sales in FY22 to 22% in FY26 and India kept gaining share. Reported EPS looks volatile (₹12.1 in FY21, ₹13.6 in FY22, ₹47.8 in FY26) because of large litigation charges in FY21-22 (Ranbaxy-era US cases, Taro price-fixing). On the company's adjusted basis EPS rose from ₹32.0 in FY22 to ₹51.7 in FY26, ${n1(cagr(32.0, 51.7, 4))}% a year, and only 3.5% in FY26 as forex gains, gRevlimid and a low tax rate peaked.` },
    { pair: [
      { type: 'column', title: 'Revenue: 9-15% growth every year since FY21', unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY17', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'line', title: 'EBITDA margin before forex: 21% in FY20, 28-29% now', unit: 'EBITDA margin (%), Screener basis (forex gains excluded)', x: 'fin.labels', from: 'FY17', to: 'FY26', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 15, max: 35, source: SRC.co },
    ] },
    { pair: [
      { type: 'column', title: 'Reported net profit: FY21-22 hit by US litigation charges', unit: 'Net profit attributable (₹ crore)', x: 'fin.labels', from: 'FY17', to: 'FY26', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'column', title: 'Exceptional charges after tax: something every year', unit: 'Exceptional items after tax (₹ crore, Screener)', x: ['FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26', 'Q1FY27'], series: [{ name: 'Exceptional (after tax)', values: [2824, 3444, 131, 414, 527, 949, 145], fmt: 'num' }], labels: 'all', source: 'Screener.in schedules; company presentations (details in the earnings-quality chapter)' },
    ] },
    { callout: '**Our view:** the FY21-26 record is good but not spectacular: ~12% revenue growth, a 3-point margin gain and ~13% adjusted EPS growth since FY22. The best part of it (innovative medicines, India share gains) is real and recurring. Two parts were windfalls that are now gone or fading: gRevlimid in the US (limited-volume generic sales that ended in Jan-2026) and a ₹1,240 cr forex gain in FY26 as the rupee fell ~10%. Meanwhile a charge of ₹130-950 cr after tax has hit reported profit every year since FY22.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capex & returns', kicker: 'Capital allocation', title: 'Cash generative, but ROE stuck at ~15-16% because of a large cash pile and goodwill',
  blocks: [
    { p: `Over FY21-26 Sun generated ₹${n0(cfo2126)} cr of operating cash, spent ₹${n0(capex2126)} cr on capex (incl. intangibles), ₹${n0(acq2126)} cr on acquisitions (Concert ₹4,686 cr in FY23, Checkpoint ₹3,405 cr in FY26) and ₹${n0(div2126)} cr on dividends, and paid ~₹2,900 cr for Taro's minority in FY25. The rest built ₹${n0(A.cash[b] + A.investments[b] - A.borrowings[b])} cr of net cash (Screener basis, Mar-26). Working capital is heavy: inventory ~${RR('Inventory Days').at(-1)} days of cost of goods and receivables ~${RR('Debtor Days').at(-1)} days of sales, typical of a global generics and branded business. Reported ROE was ${n1(A.roe[b])}% in FY26 (company: 15.7%; 17.4% in FY25 before charges); ROCE on Screener's basis ${RR('ROCE %').at(-1)}%.` },
    { pair: [
      { type: 'column', title: 'Operating cash flow covers capex 3-6x', unit: '₹ crore', x: 'A.labels', from: 'FY17', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }], labels: 'none', source: SRC.co },
      { type: 'line', title: 'ROCE: 10% in FY18-20, 21% in FY26', unit: 'Return on capital employed (%), Screener basis', x: RL, series: [{ name: 'ROCE', values: RR('ROCE %'), fmt: 'pct0' }], labels: 'all', min: 0, max: 30, source: 'Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went (₹ crore)', head: ['', 'FY21-23', 'FY24-26', 'Six years'], rows: [
      ['Cash from operations', n0(sum('cfo', 'FY21', 'FY23')), n0(sum('cfo', 'FY24', 'FY26')), n0(cfo2126)],
      ['Capex (incl. intangibles)', n0(sum('capex', 'FY21', 'FY23')), n0(sum('capex', 'FY24', 'FY26')), n0(capex2126)],
      ['Acquisitions', n0(sum('acquisitions', 'FY21', 'FY23')), n0(sum('acquisitions', 'FY24', 'FY26')), n0(acq2126)],
      ['Dividends paid', n0(sum('dividendsPaid', 'FY21', 'FY23')), n0(sum('dividendsPaid', 'FY24', 'FY26')), n0(div2126)],
      { hl: true, cells: ['**Left over**', `**${n0(sum('cfo', 'FY21', 'FY23') - sum('capex', 'FY21', 'FY23') - sum('acquisitions', 'FY21', 'FY23') - sum('dividendsPaid', 'FY21', 'FY23'))}**`, `**${n0(sum('cfo', 'FY24', 'FY26') - sum('capex', 'FY24', 'FY26') - sum('acquisitions', 'FY24', 'FY26') - sum('dividendsPaid', 'FY24', 'FY26'))}**`, `**${n0(cfo2126 - capex2126 - acq2126 - div2126)}**`] },
      ['Memo: Taro minority buyout (FY25, financing cash flow)', '', '~2,900', '~2,900'],
    ], source: 'Screener.in cash flow (consolidated)' } },
    { callout: '**The capital question has changed.** For a decade Sun was a cash compounder that bought small specialty assets (Concert, Checkpoint, in-licensing) with surplus cash and paid ~33% of profit as dividends. Organon changes that: ~$2.25 bn of cash plus ~$1.75 bn of new debt for the equity and ~$8 bn of Organon debt taken on, for a business growing −3% to +1% a year. Sun goes from net cash to ~2.3x net debt/EBITDA; the chairman says debt repayment comes first and the dividend policy is not yet decided.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: `Net cash of ₹${n0(A.cash[b] + A.investments[b] - A.borrowings[b])} cr ($3.4 bn) before Organon; heavy working capital`,
  blocks: [
    { p: `At Mar-2026 Sun held ₹${n0(A.cash[b])} cr of cash and bank balances and ₹${n0(A.investments[b])} cr of investments (mostly debt funds and bonds, plus strategic stakes) against ₹${n0(A.borrowings[b])} cr of borrowings (incl. ₹546 cr of leases): ₹${n0(A.cash[b] + A.investments[b] - A.borrowings[b])} cr net on Screener's basis; the company quotes $3.2 bn at Mar-26 and $3.4 bn at Jun-26. Net fixed assets rose to ₹${n0(A.fixedAssets[b])} cr as Leqselvi and Unloxcyt intangibles were capitalised. Inventories (₹${n0(A.inventories[b])} cr) and receivables (₹${n0(A.receivables[b])} cr) together are ~${Math.round((A.inventories[b] + A.receivables[b]) / A.sales[b] * 100)}% of sales; payables only ₹${n0(A.payables[b])} cr. After Organon closes the balance sheet will carry ~$9.5 bn of net debt (ICICI Securities) and a large block of goodwill and acquired intangibles.` },
    { pair: [
      { type: 'line', title: 'Inventory ~360 days of cost of goods; receivables ~95 days', unit: 'Days (Screener basis)', x: RL, series: [{ name: 'Inventory days', values: RR('Inventory Days'), fmt: 'num' }, { name: 'Receivable days', values: RR('Debtor Days'), fmt: 'num' }, { name: 'Payable days', values: RR('Days Payable'), fmt: 'num' }], labels: 'last', source: 'Screener.in' },
      { type: 'column', title: 'Cash and investments ₹36,326 cr at Mar-26', unit: 'Cash and investments (₹ crore)', x: 'A.labels', from: 'FY17', series: [{ name: 'Cash and investments', ref: 'A.cashAndInvestments', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-22', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth', '{{A.netWorth.7|num}}', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}'],
      ['Borrowings (incl. leases)', '{{A.borrowings.7|num}}', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}'],
      ['Cash and investments', '{{A.cashAndInvestments.7|num}}', '{{A.cashAndInvestments.9|num}}', '{{A.cashAndInvestments.10|num}}', '{{A.cashAndInvestments.11|num}}'],
      ['Net fixed assets (incl. intangibles)', '{{A.fixedAssets.7|num}}', '{{A.fixedAssets.9|num}}', '{{A.fixedAssets.10|num}}', '{{A.fixedAssets.11|num}}'],
      ['Inventories', '{{A.inventories.7|num}}', '{{A.inventories.9|num}}', '{{A.inventories.10|num}}', '{{A.inventories.11|num}}'],
      ['Trade receivables', '{{A.receivables.7|num}}', '{{A.receivables.9|num}}', '{{A.receivables.10|num}}', '{{A.receivables.11|num}}'],
      ['Trade payables', '{{A.payables.7|num}}', '{{A.payables.9|num}}', '{{A.payables.10|num}}', '{{A.payables.11|num}}'],
    ], source: SRC.co + '. Goodwill (₹9,833 cr at Mar-26) sits inside net fixed assets on Screener.' } },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: the Shanghvi family 54.5%, domestic institutions up to 22%, foreign funds down to 14.5%',
  blocks: [
    { pair: [
      { type: 'line', title: 'Foreign funds sold for six quarters; Indian institutions bought', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoters steady at 54.5%', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 40, max: 60, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY15–FY29E (standalone Sun: Organon not in the forecasts)', rows: [
      { key: 'sales', name: 'Revenue from operations', flag: { type: 'pct', th: 15 }, hl: true },
      { key: 'ebitda', name: 'EBITDA (before forex gains)', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 200 } },
      { key: 'dep', name: 'Depreciation and amortisation' },
      { key: 'otherIncome', name: 'Other income (incl. forex gains, after exceptional items in actuals)' },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit (attributable)', hl: true, flag: { type: 'pct', th: 20 } },
      { key: 'eps', name: 'EPS (₹)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' },
      { key: 'capex', name: 'Capex (incl. intangibles)' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L (Screener quarterly basis: EBITDA includes forex gains)', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 15 }, hl: true },
      { key: 'ebitda', name: 'EBITDA (incl. forex)' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' },
      { key: 'otherIncome', name: 'Other income (after exceptional items)' },
      { key: 'dep', name: 'Depreciation' },
      { key: 'pat', name: 'Net profit (attributable)', hl: true },
    ] } },
  ],
};

const statementNotes = {};

module.exports = { financials, capital, balance, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  require('./SUNPHARMA.sotp').syncSotp();
  const B = fs.existsSync(path.join(__dirname, 'SUNPHARMA.research.js')) ? require('./SUNPHARMA.research') : null;
  const report = {
    symbol: 'SUNPHARMA', listing: 'NSE: SUNPHARMA · BSE: 524715', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Healthcare',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
