// Authoring source for the Lenskart Solutions initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated; LENSKART.patch.js puts Net Profit on
// the attributable basis). Part B (LENSKART.research.js + part2-6, shared LENSKART.ctx.js) adds the research chapters.
// LENSKART.val.js first syncs the derived multiples into assumptions.json. Usage: node tools/authoring/LENSKART.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'LENSKART', 'research');
const SCR = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8')).tables.ratios;
const keepR = SCR.periods.map(p => /^Mar 20(2[2-9])$/.test(p) && `${p.slice(-4)}-05-30` <= '2026-09-30');
const RL = SCR.periods.filter((_, i) => keepR[i]).map(p => 'FY' + p.slice(-2));
const RR = k => SCR.rows[k].filter((_, i) => keepR[i]);
const SRC = { co: 'Company filings, Screener.in (consolidated; net profit after minorities), GAM Research', ar: 'AR FY26 consolidated cash flow statement and notes' };
const MA = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'models', 'LENSKART.json'), 'utf8')).annual;
const n0 = v => Math.round(v).toLocaleString('en-IN');
const sumR = (k, a, z) => MA[k].slice(MA.labels.indexOf(a), MA.labels.indexOf(z) + 1).reduce((s, x) => s + (x || 0), 0);
const cash4 = { cfo: sumR('cfo', 'FY23', 'FY26'), capex: sumR('capex', 'FY23', 'FY26') };
// FY25-FY26 cash uses from the AR FY26 cash flow statement (₹ crore)
const CF = { FY25: { cfo: 1230.6, capex: 426.7, lp: 468.8, li: 124.6, acq: 133.3 }, FY26: { cfo: 1669.6, capex: 828.5, lp: 619.6, li: 163.4, acq: 421.2 } };
const leftAfter = y => CF[y].cfo - CF[y].capex - CF[y].lp - CF[y].li;

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Revenue up 2.3x in three years and EBITDA margin from 7% to 20%: Lenskart has crossed from losses to scale profits',
  blocks: [
    { p: 'Revenue went from ₹3,788 cr in FY23 (the first year with Owndays, which lifted revenue 152%) to ₹8,814 cr in FY26, 32.5% a year. EBITDA rose from ₹264 cr to ₹1,754 cr and the margin from 7.0% to 19.9% (after Ind AS 116, i.e. before rent; the company\'s own pre-IndAS 116 EBITDA, after rent, passed ₹1,000 cr in FY26, ~11% of revenue). Net profit after minorities went from a ₹64 cr loss in FY23 to ₹494 cr in FY26; FY25\'s ₹296 cr includes a ₹167 cr non-cash gain on the Owndays deferred consideration, so the underlying FY25 profit was ~₹130 cr. Three things drove the margin: product margin (revenue less materials) up from 64% to 71% as frames and lenses moved in-house; the switch from franchise (FoFo) to company stores (CoCo), which cut commissions from ₹733 cr to ₹181 cr while staff costs rose; and operating leverage on stores, marketing and head office.' },
    { pair: [
      { type: 'column', title: 'Revenue: ₹3,788 cr in FY23, ₹8,814 cr in FY26', unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY23', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'column', title: 'Net profit: a ₹64 cr loss in FY23, ₹494 cr in FY26', unit: 'Net profit after minorities (₹ crore)', x: 'fin.labels', from: 'FY23', to: 'FY26', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.co + '. FY25 includes a ₹167 cr non-cash Owndays deferred-consideration gain.' },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: 7.0% in FY23, 19.9% in FY26', unit: 'EBITDA margin, after Ind AS 116 (%)', x: 'fin.labels', from: 'FY23', to: 'FY26', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 0, max: 25, source: SRC.co },
      { type: 'line', title: 'Materials fell from 36% to 29% of revenue; staff costs rose with company stores', unit: '% of revenue', x: 'fin.labels', from: 'FY23', to: 'FY26', series: [{ name: 'Materials', ref: 'A.materialPct', fmt: 'pct0' }, { name: 'Employees', ref: 'A.employeePct', fmt: 'pct0' }], labels: 'all', source: 'Screener.in cost split' },
    ] },
    { callout: '**Our view:** the margin gain is real and mostly structural (manufacturing, franchise buy-backs, scale), not a one-year accident. But read the headline EBITDA carefully: it excludes rent. Rent (lease depreciation ₹704 cr and lease interest ₹163 cr in FY26) is the biggest cost of a store chain, and Lenskart\'s own pre-IndAS 116 margin was ~11% in FY26 and 13.3% in Q1FY27, against a long-term aim of ~25%.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capex & returns', kicker: 'Capital allocation', title: `Stores pay for themselves; the IPO cash is still in the bank: ₹${n0(leftAfter('FY26'))} cr left over in FY26 after capex and rent`,
  blocks: [
    { p: `Over FY23-26 Lenskart generated ₹${n0(cash4.cfo)} cr of operating cash and spent ₹${n0(cash4.capex)} cr on capex (Screener). Operating cash is flattered by Ind AS 116: rent is paid in the financing section. In FY26 operating cash of ₹${n0(CF.FY26.cfo)} cr paid for ₹${n0(CF.FY26.capex)} cr of capex (603 net new stores, the Bhiwadi expansion and Hyderabad), ₹${n0(CF.FY26.lp)} cr of lease principal and ₹${n0(CF.FY26.li)} cr of lease interest, leaving ₹${n0(leftAfter('FY26'))} cr (company: ₹34 cr "before M&A and IPO"). Acquisitions took another ₹${n0(CF.FY26.acq)} cr (Meller, Dealskart and others), funded by pre-IPO cash. The ₹2,150 cr fresh issue (Nov-2025) was almost all unspent at Mar-2026 (₹177 cr used). Company-reported ROCE was 14.7% in FY26, 23.1% excluding idle IPO money, and 23.2% in Q1FY27.` },
    { pair: [
      { type: 'column', title: 'Operating cash now covers capex, but rent eats most of the rest', unit: '₹ crore', x: ['FY25', 'FY26'], series: [{ name: 'Cash from operations', values: [CF.FY25.cfo, CF.FY26.cfo].map(Math.round), fmt: 'num' }, { name: 'Capex', values: [CF.FY25.capex, CF.FY26.capex].map(Math.round), fmt: 'num' }, { name: 'Lease payments (principal + interest)', values: [CF.FY25.lp + CF.FY25.li, CF.FY26.lp + CF.FY26.li].map(Math.round), fmt: 'num' }], labels: 'all', source: SRC.ar },
      { type: 'line', title: 'ROCE (Screener basis, incl. idle cash and goodwill): 8% in FY26', unit: 'Return on capital employed (%), Screener basis', x: RL, series: [{ name: 'ROCE', values: RR('ROCE %'), fmt: 'pct0' }], labels: 'all', min: -5, max: 25, source: 'Screener.in. Company-reported ROCE: 14.7% (FY26), 23.1% excluding IPO proceeds.' },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went (₹ crore)', head: ['', 'FY25', 'FY26'], rows: [
      ['Cash from operations', n0(CF.FY25.cfo), n0(CF.FY26.cfo)], ['Capex (PPE incl. right-of-use purchases and intangibles)', n0(CF.FY25.capex), n0(CF.FY26.capex)],
      ['Lease principal paid', n0(CF.FY25.lp), n0(CF.FY26.lp)], ['Lease interest paid', n0(CF.FY25.li), n0(CF.FY26.li)],
      { hl: true, cells: ['**Left after capex and rent**', `**${n0(leftAfter('FY25'))}**`, `**${n0(leftAfter('FY26'))}**`] },
      ['Acquisitions of subsidiaries (Meller, Dealskart and others)', n0(CF.FY25.acq), n0(CF.FY26.acq)], ['Memo: IPO fresh issue received (gross)', '–', '2,150'],
    ], source: SRC.ar + ' (FY25 capex includes ₹10 cr of intangibles)' } },
    { callout: '**The capital question:** the store machine funds itself, and returns on the core are high (company: stores pay back in under a year). The open questions are the ₹4,104 cr of net cash (Jun-2026): Hyderabad (~₹1,500 cr estimated) will absorb a large part over FY27-28, and the IPO objects allow ₹683 cr for acquisitions and general purposes. Lenskart has been an active buyer (Owndays, Meller, Dealskart, GeoIQ, the Thailand JV); acquisitions at high prices are the main way returns could disappoint.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'Net cash of ₹3,881 cr before leases at Mar-2026 (₹4,104 cr at Jun-2026); ₹2,877 cr of lease liabilities',
  blocks: [
    { p: 'At Mar-2026 Lenskart held ₹4,100 cr of cash, deposits and liquid funds (₹1,544 cr cash and bank balances, ₹513 cr of investments, ₹2,013 cr of bank deposits in "other financial assets") against ₹220 cr of bank borrowings: net cash ₹3,881 cr on the company\'s definition. Lease liabilities were another ₹2,877 cr; Screener counts them as borrowings (₹3,097 cr), so its net debt figure below is not comparable with the company\'s. Goodwill and brands are large (₹2,198 cr and ₹980 cr, mostly Owndays and Meller). Inventory was 43 days of sales at Mar-2026 (59 days a year earlier); the company expects it to rise again as stock is rebuilt.' },
    { pair: [
      { type: 'line', title: 'Inventory days fell in FY26; payables stretched', unit: 'Days (Screener basis, on cost of goods)', x: RL, series: [{ name: 'Inventory days', values: RR('Inventory Days'), fmt: 'num' }, { name: 'Receivable days', values: RR('Debtor Days'), fmt: 'num' }, { name: 'Payable days', values: RR('Days Payable'), fmt: 'num' }], labels: 'last', source: 'Screener.in' },
      { type: 'column', title: 'Screener net debt includes leases: ₹982 cr at Mar-2026', unit: 'Borrowings incl. leases less cash and investments (₹ crore)', x: 'A.labels', from: 'FY23', series: [{ name: 'Net debt incl. leases', ref: 'A.netDebt', fmt: 'num' }], labels: 'all', source: SRC.co + '. Excludes ₹1,985 cr of bank deposits held in other financial assets; including them, net cash after leases was ~₹1,003 cr.' },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-23', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth (owners)', '{{A.netWorth.3|num}}', '{{A.netWorth.4|num}}', '{{A.netWorth.5|num}}', '{{A.netWorth.6|num}}'],
      ['Borrowings incl. lease liabilities', '{{A.borrowings.3|num}}', '{{A.borrowings.4|num}}', '{{A.borrowings.5|num}}', '{{A.borrowings.6|num}}'],
      ['Cash, bank balances and investments (Screener)', '{{A.cashAndInvestments.3|num}}', '{{A.cashAndInvestments.4|num}}', '{{A.cashAndInvestments.5|num}}', '{{A.cashAndInvestments.6|num}}'],
      ['Net fixed assets incl. goodwill and right-of-use', '{{A.fixedAssets.3|num}}', '{{A.fixedAssets.4|num}}', '{{A.fixedAssets.5|num}}', '{{A.fixedAssets.6|num}}'],
      ['Inventories', '{{A.inventories.3|num}}', '{{A.inventories.4|num}}', '{{A.inventories.5|num}}', '{{A.inventories.6|num}}'],
      ['Trade payables', '{{A.payables.3|num}}', '{{A.payables.4|num}}', '{{A.payables.5|num}}', '{{A.payables.6|num}}'],
      ['Memo: bank deposits in other financial assets', '–', '–', '–', '1,985'], ['Memo: lease liabilities (in borrowings)', '–', '1,679', '2,227', '2,877'],
    ], source: SRC.co + '; AR FY26 notes 6-7 and 36 (deposits, leases)' } },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: founders 17.5%; institutions doubled to 36% by Jun-2026 as pre-IPO investors sold',
  blocks: [
    { pair: [
      { type: 'line', title: 'Foreign funds 3.9% → 12.8%, Indian funds 15.9% → 23.6% in six months', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }, { name: 'Public (incl. pre-IPO investors)', ref: 'SH.rows.Public', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in. Screener counts the pre-IPO venture and sovereign holders (SoftBank, ADIA and others) as "public".' },
      { type: 'column', title: 'Founder (promoter) stake ~17.5% since listing', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'all', min: 0, max: 30, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY23–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 30 }, hl: true },
      { key: 'ebitda', name: 'EBITDA (after Ind AS 116)', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 200 } },
      { key: 'dep', name: 'Depreciation (incl. right-of-use)' },
      { key: 'otherIncome', name: 'Other income (history: net of exceptional items and associates)', flag: { type: 'pct', th: 60 } },
      { key: 'interest', name: 'Finance cost (mostly lease interest)' },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit (after minorities)', hl: true, flag: { type: 'pct', th: 40 } },
      { key: 'eps', name: 'EPS (₹)', fmt: 'n2' },
      { key: 'cfo', name: 'Cash from operations (before lease payments)', flag: { type: 'pct', th: 60 } },
      { key: 'capex', name: 'Capex (forecast: incl. lease principal)' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L (as reported by 30-Sep-2026)', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 30 }, hl: true },
      { key: 'ebitda', name: 'EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' },
      { key: 'otherIncome', name: 'Other income (net of exceptional items)' },
      { key: 'dep', name: 'Depreciation' },
      { key: 'pat', name: 'Net profit (after minorities)', hl: true },
    ] } },
  ],
};

const statementNotes = {};

module.exports = { financials, capital, balance, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  require('./LENSKART.val').syncMultiples();
  const B = fs.existsSync(path.join(__dirname, 'LENSKART.research.js')) ? require('./LENSKART.research') : null;
  const report = {
    symbol: 'LENSKART', listing: 'NSE: LENSKART · BSE: 544600', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Consumer services (retail)',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  // research JSONs write rupees as 'Rs'; show them as ₹ in the report
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1).replace(/(^|[^A-Za-z])Rs ?(?=[0-9~])/g, '$1₹'));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
