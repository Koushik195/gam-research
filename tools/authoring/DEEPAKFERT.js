// Authoring source for the Deepak Fertilisers and Petrochemicals initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated; Net Profit on the
// attributable basis via DEEPAKFERT.patch.js) + the writer.
// Part B (DEEPAKFERT.research.js, merging DEEPAKFERT.part2-6.js on DEEPAKFERT.ctx.js) adds the story, business,
// history, industry, segment and project chapters, moat, quality, ownership, governance, forecasts, street,
// valuation and verdict.
// Usage: node tools/authoring/DEEPAKFERT.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'DEEPAKFERT', 'research');
const SCR = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8')).tables.ratios;
const RL = SCR.periods.map(p => 'FY' + p.slice(-2));
const SRC = { co: 'Company filings, Screener.in (consolidated), GAM Research' };
const MP = path.join(__dirname, '..', '..', 'data', 'models', 'DEEPAKFERT.json');
const M = fs.existsSync(MP) ? JSON.parse(fs.readFileSync(MP, 'utf8')) : null;
const A = M?.annual, ai = l => A.labels.indexOf(l);
const n0 = v => Math.round(v).toLocaleString('en-IN');
const sumL = (k, ls) => ls.reduce((s, l) => s + (A[k][ai(l)] || 0), 0);
const P1 = ['FY19', 'FY20', 'FY21', 'FY22'], P2 = ['FY23', 'FY24', 'FY25', 'FY26'], PT = [...P1, ...P2];
const cf = ls => (A ? { cfo: sumL('cfo', ls), capex: sumL('capex', ls), div: sumL('dividendsPaid', ls) } : { cfo: 0, capex: 0, div: 0 });
const C1 = cf(P1), C2 = cf(P2), CT = cf(PT);
const row = f => [C1, C2, CT].map(p => n0(f(p)));

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Revenue tripled in a decade; profit has followed global ammonia, not a rising line',
  blocks: [
    { p: 'Revenue rose from ₹3,808 cr in FY15 to ₹11,506 cr in FY26, but in jumps and falls: +47% in FY23 when the Russia-Ukraine war lifted ammonia, nitric acid and fertiliser prices, −23% in FY24 when they fell back, +18% and +12% in FY25-26. EBITDA tells the same story: ₹961 cr (FY21), ₹2,165 cr at the FY23 peak, ₹1,287 cr in FY24, ₹1,925 cr in FY25 and ₹1,684 cr in FY26, when phosphoric acid, sulphur and a planned ammonia shutdown (~₹75 cr) hurt. Below EBITDA the 500 ktpa ammonia plant changed the cost base: depreciation went from ₹233 cr (FY22) to ₹424 cr and interest from ₹155 cr to ₹404 cr (FY24), ₹353 cr in FY26 only because ₹116 cr was capitalised into the new projects. Then Q1FY27 broke every record: EBITDA ₹845 cr (26% margin) and profit ₹490 cr, two-thirds of FY26\'s full-year profit in one quarter.' },
    { pair: [
      { type: 'column', title: 'Revenue: ₹11,506 cr in FY26, three times FY15', unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY17', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num', growth: true }], source: SRC.co },
      { type: 'column', title: 'EBITDA: FY23 peak of ₹2,165 cr not yet beaten on a full year', unit: 'EBITDA (₹ crore)', x: 'fin.labels', from: 'FY17', to: 'FY26', series: [{ name: 'EBITDA', ref: 'fin.ebitda', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: 15-19% since FY21, set by global spreads', unit: 'EBITDA margin (%)', x: 'fin.labels', from: 'FY17', to: 'FY26', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 0, max: 22, source: SRC.co },
      { type: 'column', title: 'Net profit: ₹1,210 cr (FY23), ₹453 cr (FY24), ₹737 cr (FY26)', unit: 'Net profit attributable to shareholders (₹ crore)', x: 'fin.labels', from: 'FY17', to: 'FY26', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { pair: [
      { type: 'column', title: 'Depreciation and interest stepped up with the ammonia plant', unit: '₹ crore', x: 'A.labels', from: 'FY19', series: [{ name: 'Depreciation', ref: 'A.dep', fmt: 'num' }, { name: 'Interest', ref: 'A.interest', fmt: 'num' }], labels: 'none', source: SRC.co },
      { type: 'line', title: 'ROCE: 25% at the FY23 peak, 11% in FY26', unit: 'Return on capital employed (%)', x: RL, series: [{ name: 'ROCE', values: SCR.rows['ROCE %'], fmt: 'pct0' }], labels: 'all', min: 0, max: 30, source: 'Screener.in' },
    ] },
    { callout: '**Our view:** this is a spread business. Deepak buys gas, ammonia, phosphoric acid, sulphur and propylene and sells products whose prices follow global benchmarks (TAN, nitric acid, IPA, ammonia) or government subsidy rates (fertilisers). Profit therefore moves with global spreads, as FY23-FY24 and now Q1FY27 show. What management controls is volume (Gopalpur and Dahej add ~64% to TAN and ~40% to nitric acid capacity), cost (own ammonia, the Equinor gas contract) and mix (B2C mining services, specialty fertilisers). Our forecasts lean on those, not on the war-time spreads lasting.' },
  ],
};

const seasons = {
  id: 'quarters', nav: 'Quarterly run-rate', kicker: 'Quarters', title: 'Quarters: three weak ones, then a ₹845 cr record in Q1FY27 on war-time prices',
  blocks: [
    { p: 'Quarterly EBITDA ran at ₹460-515 cr through FY25 and Q1FY26, slid to ₹353-354 cr in Q3-Q4FY26 (fertiliser costs ahead of subsidies, weak IPA, the ammonia turnaround), and then jumped to ₹845 cr in Q1FY27. The jump came from the Chemicals segment (EBIT ₹805 cr, 43% of its revenue): ammonia traded at ~$780-800/t FOB Middle East in May-June 2026, TAN realisations rose to ~₹70/kg (₹45/kg in FY26) as imports dried up, and the first Equinor LNG cargo (May-2026) lowered gas cost. Fertilisers earned only ₹44 cr. TAN volumes actually fell 12% (a PESO licensing-portal change) and IPA volumes 76% (propylene curtailed by the government).' },
    { pair: [
      { type: 'column', title: 'Quarterly revenue: +22% YoY in Q1FY27, mostly price', unit: 'Revenue (₹ crore)', x: 'Q.labels', series: [{ name: 'Revenue', ref: 'Q.sales', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'column', title: 'Quarterly EBITDA: ₹353 cr (Q3FY26) to ₹845 cr (Q1FY27)', unit: 'EBITDA (₹ crore)', x: 'Q.labels', series: [{ name: 'EBITDA', ref: 'Q.ebitda', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: 12% for two quarters, then 26%', unit: 'EBITDA margin (%)', x: 'Q.labels', series: [{ name: 'EBITDA margin', ref: 'Q.opm', fmt: 'pct0' }], labels: 'all', min: 0, max: 30, source: SRC.co },
      { type: 'column', title: 'Quarterly net profit: ₹139 cr (Q4FY26) to ₹490 cr', unit: 'Net profit (₹ crore)', x: 'Q.labels', series: [{ name: 'Net profit', ref: 'Q.pat', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { callout: '**So what:** do not annualise Q1FY27. Management itself called Q2 seasonally soft (monsoon cuts blasting), ammonia was already back near $600/t by the end of July and Tampa ammonia fell for a fourth month in September. We assume ~₹670 cr of EBITDA a quarter for Q2-Q4FY27: lower spreads, offset by a full quarter of Equinor gas and the first output from Gopalpur and Dahej. Q2FY27 results are due by mid-November 2026.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'Net debt peaked near ₹4,800 cr; the projects are paid for, the cash has to follow',
  blocks: [
    { p: `Two building cycles explain the debt. The ammonia plant took net debt from ~₹1,500 cr (FY22) to ~₹3,500 cr (FY24); Gopalpur and Dahej (FY25-27) took it to ₹4,824 cr at Mar-26 on the company's measure (₹5,001 cr on Screener's, which also counts ₹184 cr of leases and the ₹181 cr debt part of DMSL's CCDs). FY26 was a poor cash year: operating cash flow was only ₹206 cr on ₹1,684 cr of EBITDA because receivables rose by ₹728 cr (subsidy due from the government ₹751 cr, up from ₹619 cr) and inventory by ₹669 cr. Q1FY27's profits brought net debt down to ₹4,719 cr (1.4x annualised EBITDA) even after ₹515 cr of capex. Over FY19-26 Deepak generated ₹${n0(CT.cfo)} cr of operating cash and spent ₹${n0(CT.capex)} cr on plants.` },
    { pair: [
      { type: 'column', title: 'Net debt: ~₹1,500 cr (FY22) to ~₹5,000 cr (FY26)', unit: 'Borrowings incl. leases less cash and investments (₹ crore)', x: 'A.labels', from: 'FY19', series: [{ name: 'Net debt', ref: 'A.netDebt', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'column', title: 'Operating cash vs capex: FY26 cash flow collapsed', unit: '₹ crore', x: 'A.labels', from: 'FY19', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }], labels: 'none', source: SRC.co },
    ] },
    { pair: [
      { type: 'line', title: 'Working-capital days: receivables and inventory up in FY26', unit: 'Days', x: RL, series: [{ name: 'Receivable days', values: SCR.rows['Debtor Days'], fmt: 'num' }, { name: 'Inventory days', values: SCR.rows['Inventory Days'], fmt: 'num' }, { name: 'Payable days', values: SCR.rows['Days Payable'], fmt: 'num' }], labels: 'last', source: 'Screener.in' },
      { type: 'column', title: 'Capital work in progress: ₹3,053 cr at Mar-26 (Gopalpur + Dahej)', unit: 'CWIP (₹ crore)', x: 'A.labels', from: 'FY19', series: [{ name: 'CWIP', ref: 'A.cwip', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went (₹ crore)', head: ['', 'FY19-22', 'FY23-26', 'Eight years'], rows: [
      ['Cash from operations', ...row(p => p.cfo)], ['Capex', ...row(p => p.capex)], ['Free cash flow', ...row(p => p.cfo - p.capex)], ['Dividends paid', ...row(p => p.div)],
      { hl: true, cells: ['**Left after dividends**', ...row(p => p.cfo - p.capex - p.div).map(v => `**${v}**`)] },
    ], source: 'Screener.in cash flow (capex = fixed assets purchased), GAM Research' } },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-22', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth', '{{A.netWorth.7|num}}', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}'],
      ['Borrowings (incl. leases)', '{{A.borrowings.7|num}}', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}'],
      ['Cash and investments', '{{A.cashAndInvestments.7|num}}', '{{A.cashAndInvestments.9|num}}', '{{A.cashAndInvestments.10|num}}', '{{A.cashAndInvestments.11|num}}'],
      ['Net fixed assets', '{{A.fixedAssets.7|num}}', '{{A.fixedAssets.9|num}}', '{{A.fixedAssets.10|num}}', '{{A.fixedAssets.11|num}}'],
      ['Capital work in progress', '{{A.cwip.7|num}}', '{{A.cwip.9|num}}', '{{A.cwip.10|num}}', '{{A.cwip.11|num}}'],
      ['Inventories', '{{A.inventories.7|num}}', '{{A.inventories.9|num}}', '{{A.inventories.10|num}}', '{{A.inventories.11|num}}'],
      ['Trade receivables (incl. subsidy due)', '{{A.receivables.7|num}}', '{{A.receivables.9|num}}', '{{A.receivables.10|num}}', '{{A.receivables.11|num}}'],
      ['Fertiliser subsidy due from the government', 'n.a.', 'n.a.', '619', '751'],
    ], source: 'Screener.in; Annual Report 2025-26 note 11 (subsidy receivable); n.a. = not collected' } },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: the Mehta family holds 45.6%; Indian funds are buying, foreign funds are not',
  blocks: [
    { pair: [
      { type: 'line', title: 'DIIs up from 3.5% to 14.7%; FIIs down to 10.0%', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoters unchanged at 45.6%', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 40, max: 50, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY15–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 15 }, hl: true }, { key: 'ebitda', name: 'EBITDA', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 300 } }, { key: 'dep', name: 'Depreciation' }, { key: 'otherIncome', name: 'Other income' },
      { key: 'pbt', name: 'Profit before tax' }, { key: 'pat', name: 'Net profit', hl: true, flag: { type: 'pct', th: 25 } }, { key: 'eps', name: 'EPS (₹)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' }, { key: 'capex', name: 'Capex' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 20 }, hl: true }, { key: 'ebitda', name: 'EBITDA' }, { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' },
      { key: 'interest', name: 'Interest' }, { key: 'dep', name: 'Depreciation' }, { key: 'pat', name: 'Net profit', hl: true },
    ] } },
  ],
};

module.exports = { financials, seasons, balance, ownershipBase, statements, RD };

if (require.main === module) {
  const B = fs.existsSync(path.join(__dirname, 'DEEPAKFERT.research.js')) ? require('./DEEPAKFERT.research') : null;
  const report = {
    symbol: 'DEEPAKFERT', listing: 'NSE: DEEPAKFERT · BSE: 500645', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Chemicals & agri inputs',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, seasons, balance, ownershipBase, statements }) : [financials, seasons, balance, ownershipBase, statements],
    statementNotes: B?.statementNotes || {},
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
