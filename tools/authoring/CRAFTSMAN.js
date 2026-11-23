// Authoring source for the Craftsman Automation initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated, attributable profit and a pro forma
// post-QIP Mar-26 balance sheet via CRAFTSMAN.patch.js). Part B (CRAFTSMAN.research.js + part2-6, shared CRAFTSMAN.ctx.js)
// adds the research chapters. CRAFTSMAN.ctx.js first syncs the segment build and the derived multiples into
// assumptions.json. Usage: node tools/authoring/CRAFTSMAN.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'CRAFTSMAN', 'research');
const SCR = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8'));
const RT = SCR.tables.ratios;
const keepR = RT.periods.map(p => /^Mar 20(19|2[0-6])$/.test(p));
const RL = RT.periods.filter((_, i) => keepR[i]).map(p => 'FY' + p.slice(-2));
const RR = k => RT.rows[k].filter((_, i) => keepR[i]);
const CF = SCR.schedules['cash-flow'];
const cf = (par, item, yrs) => yrs.reduce((s, y) => s + (CF[par][item][`Mar ${y}`] || 0), 0);
const Y1 = [2021, 2022, 2023], Y2 = [2024, 2025, 2026];
const cash = yrs => { const cfo = cf('Cash from Operating Activity', 'Profit from operations', yrs) + cf('Cash from Operating Activity', 'Working capital changes', yrs) + cf('Cash from Operating Activity', 'Direct taxes', yrs);
  const capex = -cf('Cash from Investing Activity', 'Fixed assets purchased', yrs), acq = -cf('Cash from Investing Activity', 'Other investing items', yrs), div = -cf('Cash from Financing Activity', 'Dividends paid', yrs), int = -cf('Cash from Financing Activity', 'Interest paid fin', yrs);
  const lease = -cf('Cash from Financing Activity', 'Financial liabilities', yrs), eq = cf('Cash from Financing Activity', 'Proceeds from shares', yrs), debt = cf('Cash from Financing Activity', 'Proceeds from borrowings', yrs) + cf('Cash from Financing Activity', 'Repayment of borrowings', yrs);
  return { cfo, capex, acq, div, int, lease, left: cfo - capex - acq - div - int - lease, eq, debt }; };
const c1 = cash(Y1), c2 = cash(Y2);
const f0 = v => Math.round(v).toLocaleString('en-IN');
const SRC = { co: 'Company filings, Screener.in (consolidated; attributable profit; Mar-26 pro forma for the Jun-2026 QIP), GAM Research' };

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Revenue up 5.2x in five years, mostly in aluminium; the EBITDA margin halved from 28% to 15%',
  blocks: [
    { p: 'Craftsman\'s consolidated revenue rose from ₹1,560 cr in FY21 to ₹8,069 cr in FY26 (Screener basis): 39% a year. Three things drove it. First, the aluminium business, ₹330 cr in FY21, became ₹4,789 cr in FY26 (59% of revenue) through new plants (alloy wheels at Bhiwadi and Shoolagiri) and two acquisitions: DR Axion (from Feb-2023) and the loss-making Sunbeam Lightweighting (from Oct-2024). Second, powertrain machining for trucks, tractors and off-highway engines grew from ₹811 cr to ₹2,179 cr. Third, industrial and engineering (storage, material handling, gears) grew from ₹419 cr to ₹1,102 cr. The EBITDA margin fell from 28% (FY21) to 15% (FY25-26) because aluminium earns far less than powertrain machining, Sunbeam lost money and new plants started half-empty. Net profit rose from ₹97 cr to ₹384 cr, but two QIPs (Jun-2024, Jun-2026) raised the share count by 24%, so EPS on today\'s 2.615 cr shares is ₹146.8 for FY26 (₹161 reported on the shares then outstanding).' },
    { pair: [
      { type: 'column', title: 'Revenue: ₹1,560 cr (FY21) to ₹8,069 cr (FY26)', unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY19', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'column', title: 'Net profit tripled in four years; FY25 dipped on Sunbeam losses', unit: 'Net profit, attributable (₹ crore)', x: 'fin.labels', from: 'FY19', to: 'FY26', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.co + '. FY23-25 after DR Axion\'s 24% minority.' },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: 27-28% (FY20-21) to 15% (FY25-26)', unit: 'EBITDA margin (%), Screener basis', x: 'fin.labels', from: 'FY19', to: 'FY26', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 10, max: 32, source: SRC.co },
      { type: 'line', title: 'Gross margin: 61% (FY19) to 45% (FY26) as metal-heavy aluminium took over the mix', unit: 'Gross margin (%)', x: 'A.labels', from: 'FY19', series: [{ name: 'Gross margin', ref: 'A.grossMargin', fmt: 'pct' }], labels: 'all', min: 30, max: 70, source: SRC.co },
    ] },
    { callout: '**Our view:** Craftsman is a growth company, but much of its growth is in a lower-quality business. Powertrain machining (17% EBIT margin in FY26) built the company; aluminium (10%) is now six-tenths of it, needs a new plant every year or two and passes metal prices through with a lag. Q1FY27 (revenue +36%, EBITDA margin 15.8%) shows the margin has stopped falling. Whether it can rise depends on Sunbeam reaching mid-teens EBITDA and new plants filling up, while the company keeps spending ₹1,000-1,500 cr a year.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capex & returns', kicker: 'Capital allocation', title: '₹2,800 cr of capex and ~₹800 cr of acquisitions in three years, funded by debt and two QIPs; returns are mediocre',
  blocks: [
    { p: `Craftsman spends heavily: capex of ₹${f0(c2.capex)} cr in FY24-26 (₹631 cr, ₹992 cr and ₹1,188 cr, 14-17% of revenue) against ₹${f0(c1.capex)} cr in FY21-23. Cash from operations, ₹${f0(c2.cfo)} cr over the three years, covered less than half of it, because working capital absorbed ~₹1,200 cr as the aluminium business grew. Acquisitions (DR Axion's last 24%, Sunbeam, the German foundry, the Sriperumbudur land companies) took another ~₹${f0(c2.acq)} cr. The gap was filled with ₹${f0(c2.debt)} cr of net new borrowing and the ₹1,200 cr QIP of Jun-2024; the ₹2,000 cr QIP of Jun-2026 resets leverage again. ROCE on Screener's basis was 18-21% in FY22-24 and 12-14% in FY25-26; the company reports 16% for FY26 on average capital employed.` },
    { pair: [
      { type: 'column', title: 'Operating cash flow vs capex: capex has run ahead since FY24', unit: '₹ crore', x: 'A.labels', from: 'FY19', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }], labels: 'none', source: SRC.co },
      { type: 'line', title: 'ROCE: ~20% in FY22-24, 12-14% after Sunbeam and the new plants', unit: 'Return on capital employed (%), Screener basis', x: RL, series: [{ name: 'ROCE', values: RR('ROCE %'), fmt: 'pct0' }], labels: 'all', min: 0, max: 30, source: 'Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went (₹ crore)', head: ['', 'FY21-23', 'FY24-26'], rows: [
      ['Cash from operations (before interest)', f0(c1.cfo), f0(c2.cfo)],
      ['Capex', f0(c1.capex), f0(c2.capex)],
      ['Acquisitions and other investing', f0(c1.acq), f0(c2.acq)],
      ['Interest paid', f0(c1.int), f0(c2.int)],
      ['Lease payments', f0(c1.lease), f0(c2.lease)],
      ['Dividends paid', f0(c1.div), f0(c2.div)],
      { hl: true, cells: ['**Left over**', `**${f0(c1.left)}**`, `**${f0(c2.left)}**`] },
      ['Funded by: net borrowing', f0(c1.debt), f0(c2.debt)],
      ['Funded by: share issues (IPO Mar-2021; QIP Jun-2024)', f0(c1.eq), f0(c2.eq)],
      ['Memo: QIP Jun-2026 (after FY26)', '', '2,000'],
    ], source: 'Screener.in cash flow schedules (consolidated). FY23 acquisitions = DR Axion 76%; FY25 = DR Axion 24% (₹250 cr), Sunbeam (₹376 cr of OCDs at purchase) and others; FY26 = Suprash/Srikara land companies and others.' } },
    { callout: '**The capital question:** management argues that building plants early is cheaper than building them later (replacement cost 5-7x 2016 levels) and that operating leverage will come as plants fill. That may be true, but the record so far is that each new rupee of capital has earned less than the old ones: ROCE fell from ~20% to ~14% while capital employed tripled, and shareholders were asked for ₹3,200 cr in two years. Our model has ROE reaching only ~{{F.roe.2|pct}} by FY29E.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'Net debt ~₹1,430 cr pro forma for the QIP; working capital and capex keep it from falling fast',
  blocks: [
    { p: 'At Mar-2026 Craftsman had ₹3,623 cr of borrowings on Screener\'s basis (long-term ₹2,411 cr, short-term ₹930 cr, leases ₹283 cr) against ₹193 cr of cash and investments: net debt ₹3,430 cr (the company reports ~₹3,100 cr and 2.43x EBITDA, excluding leases). The ₹2,000 cr QIP of 18-Jun-2026 brings pro forma net debt to ~₹1,430 cr, ~1.2x FY26 EBITDA; we add the QIP to the Mar-26 balance sheet in our model (net worth ₹5,264 cr pro forma vs ₹3,264 cr reported). Management says net debt / EBITDA will fall below 2x in FY27 and then towards 1.5x, and that it will not need to raise equity again. With ₹1,500 cr of capex and growing working capital, our model has net debt rising to ~₹2,250 cr by Mar-27 (1.4x EBITDA) and staying near that level. The Gurgaon land of Sunbeam, held for sale, could bring in ~₹400 cr (implied by the CMD); we do not count it.' },
    { pair: [
      { type: 'line', title: 'Inventory days 145-220; payables do the funding', unit: 'Days', x: RL, series: [{ name: 'Inventory days', values: RR('Inventory Days'), fmt: 'num' }, { name: 'Receivable days', values: RR('Debtor Days'), fmt: 'num' }, { name: 'Payable days', values: RR('Days Payable'), fmt: 'num' }], labels: 'last', source: 'Screener.in' },
      { type: 'column', title: 'Borrowings doubled in two years to ₹3,623 cr (Mar-26)', unit: 'Borrowings incl. leases (₹ crore)', x: 'A.labels', from: 'FY19', series: [{ name: 'Borrowings', ref: 'A.borrowings', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-22', 'Mar-24', 'Mar-25', 'Mar-26 (pro forma)'], rows: [
      ['Net worth', '{{A.netWorth.3|num}}', '{{A.netWorth.5|num}}', '{{A.netWorth.6|num}}', '{{A.netWorth.7|num}}'],
      ['Borrowings (incl. leases)', '{{A.borrowings.3|num}}', '{{A.borrowings.5|num}}', '{{A.borrowings.6|num}}', '{{A.borrowings.7|num}}'],
      ['Cash and investments', '{{A.cashAndInvestments.3|num}}', '{{A.cashAndInvestments.5|num}}', '{{A.cashAndInvestments.6|num}}', '{{A.cashAndInvestments.7|num}}'],
      ['Net fixed assets (incl. land, intangibles)', '{{A.fixedAssets.3|num}}', '{{A.fixedAssets.5|num}}', '{{A.fixedAssets.6|num}}', '{{A.fixedAssets.7|num}}'],
      ['Inventories', '{{A.inventories.3|num}}', '{{A.inventories.5|num}}', '{{A.inventories.6|num}}', '{{A.inventories.7|num}}'],
      ['Trade receivables', '{{A.receivables.3|num}}', '{{A.receivables.5|num}}', '{{A.receivables.6|num}}', '{{A.receivables.7|num}}'],
      ['Trade payables', '{{A.payables.3|num}}', '{{A.payables.5|num}}', '{{A.payables.6|num}}', '{{A.payables.7|num}}'],
    ], source: SRC.co + '. Mar-26 net worth and investments include the ₹2,000 cr QIP of 18-Jun-2026 (reported Mar-26: net worth ₹3,264 cr, investments ₹14 cr).' } },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: the founder holds 38%, Indian institutions 33%, foreign funds 17%',
  blocks: [
    { pair: [
      { type: 'line', title: 'Indian institutions doubled to 33% in two years; foreign funds 15-17%', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoters: 55% (Mar-24) to 42.4% after two QIPs and a block sale', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 0, max: 60, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY19–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 25 }, hl: true },
      { key: 'ebitda', name: 'EBITDA', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 150 } },
      { key: 'dep', name: 'Depreciation' },
      { key: 'otherIncome', name: 'Other income (incl. exceptional items in actual years)', flag: { type: 'pct', th: 50 } },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit (attributable)', hl: true, flag: { type: 'pct', th: 25 } },
      { key: 'eps', name: 'EPS (₹; FY26 on post-QIP shares)', fmt: 'n2' },
      { key: 'cfo', name: 'Cash from operations' },
      { key: 'capex', name: 'Capex' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L (as reported by 30-Sep-2026)', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 25 }, hl: true },
      { key: 'ebitda', name: 'EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' },
      { key: 'otherIncome', name: 'Other income (incl. exceptional items)' },
      { key: 'interest', name: 'Interest' },
      { key: 'dep', name: 'Depreciation' },
      { key: 'pat', name: 'Net profit (attributable)', hl: true },
    ] } },
  ],
};

module.exports = { financials, capital, balance, ownershipBase, statements, RD, c1, c2 };

if (require.main === module) {
  const X = require('./CRAFTSMAN.ctx');
  if (X.syncBuild() || X.syncMultiples()) { console.log('Assumptions changed: run node src/model.js CRAFTSMAN, then this script again.'); process.exit(0); }
  const B = fs.existsSync(path.join(__dirname, 'CRAFTSMAN.research.js')) ? require('./CRAFTSMAN.research') : null;
  const report = {
    symbol: 'CRAFTSMAN', listing: 'NSE: CRAFTSMAN · BSE: 543276', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Automobiles & components',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements],
    statementNotes: { ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
