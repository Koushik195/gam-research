// Authoring source for the BLS International initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated; Net Profit attributable to owners via
// BLS.patch.js). Part B (BLS.research.js + part2-6, shared BLS.ctx.js) adds the research chapters. BLS.val.js first syncs
// the derived multiples into assumptions.json. Usage: node tools/authoring/BLS.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'BLS', 'research');
const SCRJ = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8'));
const SCR = SCRJ.tables.ratios;
const keepR = SCR.periods.map(p => /^Mar 20(1[8-9]|2\d)/.test(p) && `${p.slice(4, 8)}-05-30` <= '2026-09-30');
const RL = SCR.periods.filter((_, i) => keepR[i]).map(p => 'FY' + p.slice(6, 8));
const RR = k => SCR.rows[k].filter((_, i) => keepR[i]);
const SRC = { co: 'Company filings, Screener.in (consolidated; net profit attributable to owners), GAM Research' };

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Revenue 6x and owners\' profit 14x since Covid; the margin jump is done and growth is slowing',
  blocks: [
    { p: 'BLS earned ₹786 cr of revenue in FY20 and ₹478 cr in Covid-hit FY21, when visa centres shut. Since then revenue has grown to ₹2,998 cr (FY26) and owners\' profit from ₹50 cr to ₹687 cr. Two different engines did this. From FY22 to FY25 the visa business took its centres in-house (from a partner-run to a self-managed model) and sold more value-added services, so the Visa & Consular EBITDA margin rose from 14.6% to 34.5% (40.1% in FY26) on revenue that grew ~15% a year (FY23-25). From FY25 acquisitions took over: iDATA and Citizenship Invest in visa, Aadifidelis (loan distribution) in digital, which more than doubled Digital revenue in FY26 at a 7% margin. So consolidated revenue grew 37% in FY26 but EBITDA 30% and owners\' EPS 35%; in Q1FY27 revenue rose 25% and EPS 11%.' },
    { pair: [
      { type: 'column', title: 'Revenue: ₹478 cr (FY21) to ₹2,998 cr (FY26)', unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'column', title: 'Owners\' profit: ₹687 cr in FY26, 14x FY21', unit: 'Net profit attributable to owners (₹ crore)', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: 9% (FY21) to 30% (FY25), then down as low-margin digital grew', unit: 'EBITDA margin, Screener basis (%)', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 0, max: 35, source: SRC.co + '. Screener\'s annual EBITDA excludes bank charges (₹30 cr in FY26); company basis 27.3%.' },
      { type: 'column', title: 'Other income: 9-13% of pre-tax profit since FY23', unit: 'Other income, % of profit before tax', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'Share of PBT', ref: 'fin.otherIncomeShare', fmt: 'pct0' }], labels: 'all', source: SRC.co },
    ] },
    { callout: '**Our view:** the easy margin gain is behind BLS. Visa margins are at ~40% and management only promises to hold them; volumes were flat in Q1FY27; the new growth (Aadhaar centres at 10-15%, loan distribution at 4-5%, BC banking at ~8%) earns a fraction of the visa margin. Each rupee of new revenue therefore adds less profit than the average, and the tax-plus-minorities leakage is rising. Revenue can grow 20%+ while EPS grows in the low to mid teens.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capex & returns', kicker: 'Capital allocation', title: 'Little capital needed, ~₹2,500 cr of cash generated in five years, much of it spent on acquisitions',
  blocks: [
    { p: 'Visa centres are leased and applicants pay up front, so BLS needs little capital: cash capex was ₹137 cr in FY26 (₹161 cr in FY25) against ₹903 cr of operating cash flow. Over FY22-26 it generated ~₹2,530 cr from operations. About ₹1,010 cr went into acquisitions (₹82 cr net in FY23 for Zero Mass, 88% bought in Jun-2022 at a ₹120 cr valuation; ₹899 cr in FY25: iDATA, Citizenship Invest for ₹260 cr, 57% of Aadifidelis), ~₹510 cr into capex and only ~₹220 cr into dividends; the rest built the cash pile. In FY27 so far BLS E-Services has paid ₹157 cr for Atyati Technologies and BLS ₹45 cr for more BLS E-Services shares, and the ₹125 cr Aadhaar build-out is three-quarters done. Returns are high (ROE 31-35% in FY24-26) but falling as goodwill (₹1,213 cr, half of net worth) and cash build up.' },
    { pair: [
      { type: 'column', title: 'Operating cash flow far exceeds capex', unit: '₹ crore', x: 'A.labels', from: 'FY18', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Free cash flow', ref: 'A.fcf', fmt: 'num' }], labels: 'none', source: SRC.co },
      { type: 'line', title: 'ROE: 33% in FY26, falling as cash and goodwill grow', unit: 'Return on equity (%)', x: 'A.labels', from: 'FY18', series: [{ name: 'ROE', ref: 'A.roe', fmt: 'pct0' }], labels: 'all', min: 0, max: 45, source: SRC.co },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went (₹ crore)', head: ['', 'FY22-23', 'FY24-26', 'Five years'], rows: [
      ['Cash from operations', '446', '2,082', '2,528'],
      ['Capex (cash)', '150', '362', '512'],
      ['Acquisitions (cash, net)', '82', '930', '1,012'],
      ['Dividends paid (incl. to subsidiaries\' minorities)', '39', '182', '221'],
      ['Raised by BLS E-Services (IPO, FY24)', '–', '296', '296'],
      { hl: true, cells: ['**Memo: company net cash at the end**', '**556 (Mar-23)**', '**1,434 (Mar-26)**', ''] },
    ], source: 'Screener.in consolidated cash flow (FY22-26); company decks (net cash).' } },
    { callout: '**The capital question:** management wants to spend ~₹2,000 cr on acquisitions over four to five years and says each deal must earn 17-20%; when asked on the Aug-2026 call what value past deals have created, the CFO could not answer. A buyback is "not under consideration". Our forecasts assume no new acquisitions, so cash builds to ~₹{{F.treasury.2|num}} cr (net of leases and minorities at book) by FY29E: either it is spent on deals we cannot model, or it is a source of upside through buybacks.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'Net cash ₹1,434 cr (₹1,617 cr at Jun-26), negative working capital, and ₹1,213 cr of goodwill',
  blocks: [
    { p: 'At Mar-2026 BLS held ₹494 cr of cash, ₹688 cr of bank deposits, ₹152 cr of longer deposits and ~₹331 cr of debt funds and bonds, against ₹230 cr of borrowings (₹205 cr drawn in FY25, the year of the iDATA purchase) and ₹200 cr of lease liabilities: net cash ₹1,434 cr on the company\'s definition (before leases), ₹1,617 cr at Jun-2026. Part of it belongs to BLS E-Services (₹155 cr of unspent IPO money at Mar-26, most of it since used for Atyati), whose minorities own ~47%. Working capital is negative (fees are collected before the service is delivered; receivables 21 days). The big non-cash asset is goodwill and intangibles from acquisitions, ₹1,213 cr plus ₹55 cr of other intangibles, tested for impairment every year (none so far).' },
    { pair: [
      { type: 'line', title: 'Working-capital days: negative since FY24', unit: 'Days', x: RL, series: [{ name: 'Working-capital days', values: RR('Working Capital Days'), fmt: 'num' }], labels: 'last', source: 'Screener.in' },
      { type: 'column', title: 'Company net cash: ₹407 cr (FY22) to ₹1,434 cr (FY26)', unit: 'Net cash, company definition (₹ crore)', x: ['FY22', 'FY23', 'FY24', 'FY25', 'FY26', 'Jun-26'], series: [{ name: 'Net cash', values: [407, 556, 1135, 928, 1434, 1617], fmt: 'num' }], labels: 'all', source: 'Company decks (Q1FY27 p.26; Q1FY27 call)' },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore; Screener basis)', head: ['', 'Mar-23', 'Mar-24', 'Mar-25', 'Mar-26 (pro forma)'], rows: [
      ['Net worth (owners)', '{{A.netWorth.8|num}}', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}'],
      ['Borrowings incl. leases', '{{A.borrowings.8|num}}', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}'],
      ['Cash and bank balances', '{{A.cash.8|num}}', '{{A.cash.9|num}}', '{{A.cash.10|num}}', '{{A.cash.11|num}}'],
      ['Investments', '{{A.investments.8|num}}', '{{A.investments.9|num}}', '{{A.investments.10|num}}', '{{A.investments.11|num}}'],
      ['Fixed assets incl. goodwill', '{{A.fixedAssets.8|num}}', '{{A.fixedAssets.9|num}}', '{{A.fixedAssets.10|num}}', '{{A.fixedAssets.11|num}}'],
      ['Trade receivables', '{{A.receivables.8|num}}', '{{A.receivables.9|num}}', '{{A.receivables.10|num}}', '{{A.receivables.11|num}}'],
    ], source: SRC.co + '. Mar-26 pro forma (BLS.patch.js): investments less the Atyati price (₹156.8 cr, Jul-2026) and ₹45.2 cr of BLS E-Services shares bought in Apr-Aug 2026; reserves less ₹45.2 cr.' } },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: the Aggarwal family 70.4%, foreign funds down to 4.1%',
  blocks: [
    { pair: [
      { type: 'line', title: 'Foreign funds have more than halved since Dec-2024', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoters steady at ~70.4%', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 60, max: 75, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY15–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 20 }, hl: true },
      { key: 'ebitda', name: 'EBITDA (Screener basis: before bank charges)', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 300 } },
      { key: 'dep', name: 'Depreciation & amortisation' },
      { key: 'otherIncome', name: 'Other income', flag: { type: 'pct', th: 40 } },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit to owners (forecast: after tax and minorities)', hl: true, flag: { type: 'pct', th: 30 } },
      { key: 'eps', name: 'EPS (₹)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' },
      { key: 'capex', name: 'Capex' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L (as reported by 30-Sep-2026)', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 20 }, hl: true },
      { key: 'ebitda', name: 'EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' },
      { key: 'otherIncome', name: 'Other income' },
      { key: 'dep', name: 'Depreciation' },
      { key: 'pat', name: 'Net profit to owners', hl: true },
    ] } },
  ],
};

const statementNotes = {};

module.exports = { financials, capital, balance, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  require('./BLS.val').syncMultiples();
  const B = fs.existsSync(path.join(__dirname, 'BLS.research.js')) ? require('./BLS.research') : null;
  const report = {
    symbol: 'BLS', listing: 'NSE: BLS · BSE: 540073', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Consumer services & internet',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
