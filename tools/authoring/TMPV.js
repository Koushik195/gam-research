// Authoring source for the Tata Motors Passenger Vehicles (TMPV) initiating-coverage report (as of 30-Sep-2026,
// Q1FY27 basis). Part A (this file): chapters built on reported financials (Screener, consolidated). Screener's
// FY15-FY24 columns are the old Tata Motors (cars + trucks); FY25-FY26 revenue and EBITDA are the demerged business
// (JLR + India PV). Part B (TMPV.research.js + part2-6, shared TMPV.ctx.js) adds the research chapters.
// TMPV.sotp.js first syncs the derived SOTP multiples into assumptions.json. Usage: node tools/authoring/TMPV.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'TMPV', 'research');
const SRC = { co: 'Company filings, Screener.in (consolidated; FY15-FY24 = old Tata Motors incl. commercial vehicles), GAM Research', seg: 'Company presentations (segment tables, Ind AS); GAM estimates FY27-29E' };

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'A history that mostly is not this company: only FY25 onwards is the business you buy',
  blocks: [
    { p: 'Screener\'s ten-year history for TMPV is the old Tata Motors: JLR plus Indian cars plus trucks and buses until FY24. The commercial-vehicle business left on 1-Oct-2025, so the annual report restated FY25 revenue and EBITDA without it (₹3,66,094 cr, EBITDA ₹49,123 cr on the company\'s definition), but FY25 profit still contains the CV business as "discontinued operations" and FY26 profit carries an ₹82,616 cr accounting gain on the demerger. **Read FY15-FY24 as context only, and FY26 earnings as not meaningful.** On the comparable basis, revenue fell 8% in FY26 to ₹3,35,582 cr and company EBITDA halved to ₹22,911 cr (6.8%) because JLR lost September and half of October 2025 to a cyber attack; India PV grew revenue 21% at a flat 6.9% margin.' },
    { pair: [
      { type: 'column', title: 'Revenue: FY24 peak includes trucks; FY25-26 are restated without them', unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY19', to: 'FY29E', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'line', title: 'EBITDA margin (Screener basis, excl. grants): 13% in FY25, 6% in FY26, 10% by FY29E', unit: 'EBITDA margin (%)', x: 'fin.labels', from: 'FY19', to: 'FY29E', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 0, max: 16, source: SRC.co },
    ] },
    { exhibit: { type: 'table', title: 'The comparable history: FY25 and FY26 by segment (₹ crore, company EBITDA definition)', head: ['', 'FY25', 'FY26', 'Change'], rows: [
      ['JLR revenue', '3,14,220', '2,73,303', '−13%'], ['JLR EBITDA (margin)', '44,956 (14.3%)', '18,321 (6.7%)', '−59%'],
      ['India PV revenue', '48,451', '58,465', '+21%'], ['India PV EBITDA (margin)', '3,357 (6.9%)', '4,061 (6.9%)', '+21%'],
      ['Others revenue / EBITDA', '3,423 / 810', '3,814 / 529', ''],
      { hl: true, cells: ['**Consolidated EBITDA (incl. grants)**', '**49,123 (13.4%)**', '**22,911 (6.8%)**', '**−53%**'] },
      ['Profit before tax and exceptional items', '28,650', '2,519', '−91%'],
      ['Continuing profit attributable to owners', '19,075', '−1,632', 'after ₹4,142 cr exceptionals'],
    ], source: 'Q4FY26 presentation (segment tables) and AR FY26 (consolidated P&L, re-presented FY25)' } },
    { callout: '**Our view:** FY26 was a lost year, not a new normal: JLR made a 9.2% EBIT margin in Q4FY26 once production was back. But even before the attack JLR had slipped from 8.5% EBIT (FY24-25) to 4.0% in Q1FY26 on US tariffs, China\'s luxury tax and rising discounts, and Q1FY27 was 2.8%. The earnings base we forecast from is about half of what the old Tata Motors earned at its FY24 peak.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capex & returns', kicker: 'Capital allocation', title: 'Peak investment: ₹42K cr of capex a year for new JLR platforms and India capacity',
  blocks: [
    { p: 'This is a capital-hungry business. JLR spent GBP3.6bn in FY26 (GBP2.6bn of it on engineering, 64% capitalised) and guides GBP3.7bn for FY27, as it launches three new architectures (the electric Range Rovers, the EMA platform for Range Rover GT, and Jaguar\'s Type 01); the five-year plan is GBP18bn from FY24. India invested ₹5,218 cr in FY26 (capex ₹4,300 cr, 7.5% of revenue, plus expensed R&D) and plans ~7% a year to FY31 with a front-loaded step-up for capacity (0.9 mn to 1.3 mn units). We model consolidated capex of ₹42,000 / ₹41,500 / ₹41,000 cr in FY27-29E against depreciation of ₹20-26K cr. Returns are low: ROCE was 3% in FY26 on Screener\'s basis, and we forecast ROE of only {{fin.roe.12|pct}} / {{fin.roe.13|pct}} / {{fin.roe.14|pct}} in FY27-29E.' },
    { pair: [
      { type: 'column', title: 'Cash from operations vs capex: FY26 cash flow covered barely a third of capex', unit: '₹ crore', x: 'fin.labels', from: 'FY19', to: 'FY29E', series: [{ name: 'Cash from operations', ref: 'fin.cfo', fmt: 'num' }, { name: 'Capex', ref: 'fin.capex', fmt: 'num' }], labels: 'none', source: SRC.co },
      { type: 'column', title: 'ROE: high in FY24-25, collapsing in FY26 (ex-gain), 7-11% in our forecasts', unit: 'Return on equity (%)', x: 'fin.labels', from: 'FY22', to: 'FY29E', series: [{ name: 'ROE', ref: 'fin.roe', fmt: 'pct0' }], labels: 'all', source: SRC.co + '. FY26 ROE is inflated by the ₹82,616 cr demerger gain.' },
    ] },
    { callout: '**The capital question:** JLR targets free cash flow of only breakeven in FY27 after a GBP2.2bn outflow in FY26, and the India business turns marginally cash-negative in the early years of its plan. Shareholders get ~₹3-8 a share of dividends. Value creation depends on the new JLR models earning their cost of capital; on our numbers JLR\'s return on capital stays below 10% until FY29.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & debt', kicker: 'Balance sheet', title: 'Net automotive debt ₹42K cr at Jun-2026, almost all of it at JLR',
  blocks: [
    { p: 'At Mar-2026 the group had ₹69,953 cr of borrowings plus ₹9,156 cr of leases against ₹48,269 cr of cash, bank deposits and liquid funds: net debt ₹30.7K cr on the company\'s definition (₹1.0K cr net cash a year earlier). By entity: JLR ₹32.7K cr, TML Holdings (JLR\'s parent) ₹5.8K cr, India PV net cash ₹6.7K cr, Tata Technologies net cash ₹1.1K cr. The Jun-2026 quarter added a seasonal JLR outflow: group net debt ₹42.2K cr, JLR GBP3.6bn. JLR has GBP5.9bn of liquidity, including a new GBP2bn five-year loan and a GBP1.5bn UK-government-backed facility; its ratings sit at the investment-grade border, on negative watch. Screener\'s net debt (₹23.1K cr) is lower because its "investments" line includes ₹7.7K cr of stakes valued at book (China JV ₹4,073 cr, associates, equity holdings).' },
    { exhibit: { type: 'table', title: 'Net debt by quarter (₹ thousand crore, company definition incl. leases)', head: ['Mar-25 (pro forma)', 'Jun-25', 'Sep-25', 'Dec-25', 'Mar-26', 'Jun-26'], rows: [['(1.0) net cash', '11.4', '20.1', '39.4', '30.7', '42.2']], source: 'Q4FY26 and Q1FY27 presentations' } },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore, Screener basis)', head: ['', 'Mar-24 (incl. CV)', 'Mar-25 (incl. CV)', 'Mar-26'], rows: [
      ['Net worth (owners)', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}'],
      ['Borrowings incl. leases', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}'],
      ['Cash and investments', '{{A.cashAndInvestments.9|num}}', '{{A.cashAndInvestments.10|num}}', '{{A.cashAndInvestments.11|num}}'],
      ['Net fixed assets + CWIP', '{{A.fixedAssets.9|num}} + {{A.cwip.9|num}}', '{{A.fixedAssets.10|num}} + {{A.cwip.10|num}}', '{{A.fixedAssets.11|num}} + {{A.cwip.11|num}}'],
      ['Inventories', '{{A.inventories.9|num}}', '{{A.inventories.10|num}}', '{{A.inventories.11|num}}'],
      ['Trade payables', '{{A.payables.9|num}}', '{{A.payables.10|num}}', '{{A.payables.11|num}}'],
    ], source: SRC.co + '. CWIP includes ₹76,154 cr of intangible assets under development (JLR engineering) at Mar-26.' } },
    { callout: '**In the model:** the engine carries net debt on Screener\'s basis (the company figure less ₹7.7K cr of investments at book): ₹23.1K cr at Mar-26. In forecasts it moves with free cash flow after dividends; the bridge to the company figure is in the valuation chapter. Negative working capital (suppliers fund ~21% of revenue) means growth releases cash, and a slowdown would consume it.' },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: Tata group 42.5%, Indian institutions 17%, foreign funds 17%',
  blocks: [
    { pair: [
      { type: 'line', title: 'Foreign and Indian institutions each hold ~17%', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoters 46% to 42.5% after DVR conversion (Sep-2024)', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 30, max: 50, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY15–FY29E (FY15-FY24 old Tata Motors incl. CV)', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 15 }, hl: true },
      { key: 'ebitda', name: 'EBITDA (Screener basis, excl. grants)', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 300 } },
      { key: 'dep', name: 'Depreciation' },
      { key: 'otherIncome', name: 'Other income (incl. grants, exceptional items in actuals)' },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit to owners', hl: true, flag: { type: 'pct', th: 30 } },
      { key: 'eps', name: 'EPS (₹)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' },
      { key: 'capex', name: 'Capex' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L (Q2FY25 onwards restated without CV)', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 15 }, hl: true },
      { key: 'ebitda', name: 'EBITDA (Screener basis)' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' },
      { key: 'otherIncome', name: 'Other income (incl. exceptional items)' },
      { key: 'dep', name: 'Depreciation' },
      { key: 'pat', name: 'Net profit to owners', hl: true },
    ] } },
  ],
};

module.exports = { financials, capital, balance, ownershipBase, statements, RD };

if (require.main === module) {
  require('./TMPV.sotp').syncSotp();
  const B = fs.existsSync(path.join(__dirname, 'TMPV.research.js')) ? require('./TMPV.research') : null;
  const report = {
    symbol: 'TMPV', listing: 'NSE: TMPV · BSE: 500570', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Automobiles',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements],
    statementNotes: { ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
