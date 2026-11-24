// Authoring source for the Minda Corporation initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated; net profit attributable to owners and
// FY26 per-share figures on the fully diluted count, see MINDACORP.patch.js). Part B (MINDACORP.research.js + part2-6,
// shared MINDACORP.ctx.js) adds the research chapters. MINDACORP.val.js first syncs the derived multiples into
// assumptions.json. Usage: node tools/authoring/MINDACORP.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'MINDACORP', 'research');
const SCR = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8')).tables.ratios;
const keepR = SCR.periods.map(p => /^Mar 20(1[6-9]|2\d)$/.test(p) && `${p.slice(-4)}-05-30` <= '2026-09-30');
const RL = SCR.periods.filter((_, i) => keepR[i]).map(p => 'FY' + p.slice(-2));
const RR = k => SCR.rows[k].filter((_, i) => keepR[i]);
const SRC = { co: 'Company filings, Screener.in (consolidated; net profit attributable to owners), GAM Research' };

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Revenue up 2.6x since the Covid year, margin up from 9% to 12%: a quiet re-build',
  blocks: [
    { p: 'Minda Corp\'s revenue was ₹2,435 cr in FY16 and barely higher, ₹2,368 cr, in FY21: five lost years of restructuring (a German plastics subsidiary, KTSN, went insolvent and was written off) and two weak vehicle years. Since then it has grown 21% a year to ₹6,185 cr in FY26, well ahead of vehicle production (FY26: +22% vs ~+12%). The EBITDA margin rose every year, from 9.3% (FY21) to 11.7% (FY26), as wiring harnesses and instrument clusters moved up the value chain (TFT clusters, high-voltage harnesses, in-house connectors). Owners\' EPS went from ₹2.2 (FY21) to ₹15.1 (FY26), but FY22-23 were flattered by one-offs (exceptional gains and a one-time tax benefit): on the company\'s normalised profit, EPS rose from ₹5.7 (FY22) to ₹15.1, 27% a year. From FY26 a growing part of profit is the 49% share of Flash Electronics (₹70 cr), which sits below EBITDA.' },
    { pair: [
      { type: 'column', title: 'Revenue: flat for five years, then 21% a year', unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'column', title: 'Owners\' profit: an FY20 write-off, then ₹53 cr to ₹360 cr', unit: 'Net profit attributable to owners (₹ crore)', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.co + '. FY20: ₹196 cr exceptional loss after tax. FY22-23 include one-offs (normalised PAT ₹137 cr and ₹219 cr).' },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: up every year since FY21', unit: 'EBITDA margin (%)', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 6, max: 14, source: SRC.co },
      { type: 'line', title: 'ROE: 12-15% since FY24, held back by the Flash purchase', unit: 'Return on equity (%), owners', x: 'fin.labels', from: 'FY21', to: 'FY26', series: [{ name: 'ROE', ref: 'fin.roe', fmt: 'pct' }], labels: 'all', min: 0, max: 25, source: SRC.co + '. FY26 equity is pro forma for the ₹316 cr warrant balance (MINDACORP.patch.js).' },
    ] },
    { callout: '**Our view:** Minda Corp is a turnaround that has become a steady grower. Margins are now at a ten-year high but still ordinary for the products (11.7%), returns on equity are middling (12-15%) because ₹1,372 cr was paid for 49% of Flash Electronics in Jan-2025, and growth since FY23 (8-9% a year in FY24-25, 22% in FY26) has been lumpy. Flash adds EV exposure and profit (₹70 cr in FY26), but it arrives as a share of profit, not as revenue or cash.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capex & returns', kicker: 'Capital allocation', title: 'Capital allocation: one big bet (Flash, ₹1,372 cr), partly paid for by selling Pricol',
  blocks: [
    { p: 'Over FY21-26 Minda Corp generated ₹2,147 cr of operating cash and spent ₹1,490 cr on capex, so the core business funds itself. The big moves were financial. In Jan-2024 it sold its 15.7% stake in Pricol for ₹658 cr (bought for ~₹400 cr during a contested stake-building; the gain went through other comprehensive income, not profit). A year later it paid ₹1,372 cr for 49% of Flash Electronics (EV and two-wheeler power electronics, motors), funded largely with debt: gross debt went from ₹348 cr (Mar-24) to ₹1,344 cr (Mar-25). The promoter then took 76.5 lakh warrants at ₹550 (₹421 cr; 25% paid in Jun-2025, the rest due by Dec-2026). Capex is guided at ~₹400-450 cr for FY27 and ~₹2,000 cr over five years (Vision 2030).' },
    { pair: [
      { type: 'column', title: 'Operating cash has covered capex since FY22', unit: '₹ crore', x: 'A.labels', from: 'FY16', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }], labels: 'none', source: SRC.co },
      { type: 'line', title: 'ROCE (Screener basis): 12-16%, diluted by the Flash stake', unit: 'Return on capital employed (%), Screener basis', x: RL, series: [{ name: 'ROCE', values: RR('ROCE %'), fmt: 'pct0' }], labels: 'all', min: 0, max: 25, source: 'Screener.in. The company\'s own ROCE (excluding investments and JV profit) was 20% in FY24-25 and 23.1% in FY26.' },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went (₹ crore)', head: ['', 'FY21-23', 'FY24-26', 'Six years'], rows: [
      ['Cash from operations', '640', '1,507', '2,147'],
      ['Capex (cash)', '494', '996', '1,490'],
      ['49% of Flash Electronics (Jan-2025)', '–', '1,372', '1,372'],
      ['Sale of the Pricol stake (Jan-2024)', '–', '+658', '+658'],
      ['Dividends paid', '48', '99', '147'],
      ['Warrant money from the promoter (25%)', '–', '+105', '+105'],
      { hl: true, cells: ['**Left before interest and debt movements**', '**+98**', '**−197**', '**−99**'] },
      ['Memo: FY27E guided capex; warrant balance due', '', '', '~450; +316'],
    ], source: 'Screener.in cash flow (consolidated); AR FY25 (Flash ₹1,372 cr); AR FY24 note 2.48 and exchange filing (Pricol); AR FY26 note 2.16.8 (warrants); Q4FY26 call (capex).' } },
    { callout: '**The capital question:** the core business earns 20%+ on its own capital (company definition), but shareholders own a group where ~₹1,470 cr sits in Flash at cost. Flash earned ₹137 cr in FY26 (our 49%: ~₹67-70 cr after acquisition-related depreciation), a ~5% return on what was paid. It has to grow 20%+ a year for years (management guides 20-24%) to earn its cost of capital. That is the bet investors are underwriting.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'Moderate debt (~1.2x EBITDA incl. Flash) that the warrant money and cash flow will cut',
  blocks: [
    { p: 'At Mar-2026 Minda Corp had ₹1,212 cr of borrowings (excluding ₹259 cr of leases) and ₹147 cr of cash: net debt ₹1,065 cr, 1.2x EBITDA including 49% of Flash\'s EBITDA and 0.4x equity (company). The ₹316 cr warrant balance due by Dec-2026 takes pro forma net debt to ~₹750 cr. Investments of ₹1,558 cr are almost all the Flash stake (₹1,474 cr) and JV stakes at book value, so on Screener\'s definition (borrowings incl. leases less cash and investments) the group shows net cash: that is not cash. Working capital is steady: receivables 59 days, inventory 66 days, payables 107 days. Ratings: CRISIL AA/Stable and India Ratings AA/Stable.' },
    { pair: [
      { type: 'line', title: 'Inventory days down from 97 to 66 since FY21', unit: 'Days', x: RL, series: [{ name: 'Inventory days', values: RR('Inventory Days'), fmt: 'num' }, { name: 'Receivable days', values: RR('Debtor Days'), fmt: 'num' }, { name: 'Payable days', values: RR('Days Payable'), fmt: 'num' }], labels: 'last', source: 'Screener.in' },
      { type: 'column', title: 'Company net debt: ₹156 cr before Flash, ₹1,065 cr after', unit: 'Net debt excl. leases (₹ crore), company definition', x: ['Mar-24', 'Mar-25', 'Mar-26', 'Mar-26 pro forma'], series: [{ name: 'Net debt', values: [156, 1247, 1065, 749], fmt: 'num' }], labels: 'all', source: 'Q4FY26 presentation p11; pro forma for the ₹316 cr warrant balance (GAM)' },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-22', 'Mar-24', 'Mar-25', 'Mar-26 (pro forma)'], rows: [
      ['Net worth (owners)', '{{A.netWorth.7|num}}', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}'],
      ['Borrowings incl. leases', '{{A.borrowings.7|num}}', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}'],
      ['Cash and investments (incl. Flash and JV stakes at book)', '{{A.cashAndInvestments.7|num}}', '{{A.cashAndInvestments.9|num}}', '{{A.cashAndInvestments.10|num}}', '{{A.cashAndInvestments.11|num}}'],
      ['Net fixed assets', '{{A.fixedAssets.7|num}}', '{{A.fixedAssets.9|num}}', '{{A.fixedAssets.10|num}}', '{{A.fixedAssets.11|num}}'],
      ['Inventories', '{{A.inventories.7|num}}', '{{A.inventories.9|num}}', '{{A.inventories.10|num}}', '{{A.inventories.11|num}}'],
      ['Trade receivables', '{{A.receivables.7|num}}', '{{A.receivables.9|num}}', '{{A.receivables.10|num}}', '{{A.receivables.11|num}}'],
      ['Trade payables', '{{A.payables.7|num}}', '{{A.payables.9|num}}', '{{A.payables.10|num}}', '{{A.payables.11|num}}'],
    ], source: SRC.co + '. Mar-26 net worth and cash include the ₹316 cr warrant balance (pro forma; reported net worth ₹2,639 cr incl. ₹105 cr warrant money).' } },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: the Ashok Minda family 64.8% (65.9% after the warrants), institutions 27%',
  blocks: [
    { pair: [
      { type: 'line', title: 'Foreign funds up from 4% to 9%; Indian institutions ~18%', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoter stake flat at 64.84%', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 55, max: 75, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY15–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 25 }, hl: true },
      { key: 'ebitda', name: 'EBITDA', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 100 } },
      { key: 'dep', name: 'Depreciation' },
      { key: 'otherIncome', name: 'Other income incl. exceptional items (forecast: incl. associates net of minorities, grossed up for tax)', flag: { type: 'pct', th: 40 } },
      { key: 'interest', name: 'Finance cost' },
      { key: 'pbt', name: 'Profit before tax (before associates)' },
      { key: 'pat', name: 'Net profit (owners, incl. associates)', hl: true, flag: { type: 'pct', th: 30 } },
      { key: 'eps', name: 'EPS (₹; FY26 onwards fully diluted)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' },
      { key: 'capex', name: 'Capex' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L (as reported by 30-Sep-2026)', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 20 }, hl: true },
      { key: 'ebitda', name: 'EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' },
      { key: 'otherIncome', name: 'Other income incl. exceptional items' },
      { key: 'dep', name: 'Depreciation' },
      { key: 'pat', name: 'Net profit (owners, incl. associates)', hl: true },
    ] } },
  ],
};

const statementNotes = {};

module.exports = { financials, capital, balance, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  require('./MINDACORP.val').syncMultiples();
  const B = fs.existsSync(path.join(__dirname, 'MINDACORP.research.js')) ? require('./MINDACORP.research') : null;
  const report = {
    symbol: 'MINDACORP', listing: 'NSE: MINDACORP · BSE: 538962', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Automobiles & components',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  // research JSONs write rupees as 'Rs'; show them as ₹ in the report
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1).replace(/(^|[^A-Za-z])Rs ?(?=[0-9~])/g, '$1₹'));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
