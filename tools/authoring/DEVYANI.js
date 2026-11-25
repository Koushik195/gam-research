// Authoring source for the Devyani International initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated; DEVYANI.patch.js puts Net Profit on
// the attributable basis). Part B (DEVYANI.research.js + part2-6, shared DEVYANI.ctx.js/ctx2.js) adds the research chapters.
// DEVYANI.val.js first syncs the derived multiple, the P/E cross-check multiple and the minorities deduction into assumptions.json.
// Usage: node tools/authoring/DEVYANI.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'DEVYANI', 'research');
const SCR = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8')).tables.ratios;
const keepR = SCR.periods.map(p => /^Mar 20(1[89]|2[0-9])$/.test(p) && `${p.slice(-4)}-05-30` <= '2026-09-30');
const RL = SCR.periods.filter((_, i) => keepR[i]).map(p => 'FY' + p.slice(-2));
const RR = k => SCR.rows[k].filter((_, i) => keepR[i]);
const SRC = { co: 'Company filings, Screener.in (consolidated; net profit after minorities), GAM Research', ar: 'AR FY26 consolidated cash flow statement' };
const MA = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'models', 'DEVYANI.json'), 'utf8')).annual;
const n0 = v => Math.round(v).toLocaleString('en-IN');
const sumR = (k, a, z) => MA[k].slice(MA.labels.indexOf(a), MA.labels.indexOf(z) + 1).reduce((s, x) => s + (x || 0), 0);
const cash5 = { cfo: sumR('cfo', 'FY22', 'FY26'), capex: sumR('capex', 'FY22', 'FY26') };
// FY25-FY26 cash uses from the AR FY26 consolidated cash flow statement (Rs crore)
const CF = { FY25: { cfo: 900.2, capex: 491.0, leaseP: 141.5, leaseI: 206.0, int: 54.5 }, FY26: { cfo: 919.2, capex: 459.0, leaseP: 180.4, leaseI: 223.4, int: 52.3 } };
const leftAfter = y => CF[y].cfo - CF[y].capex - CF[y].leaseP - CF[y].leaseI - CF[y].int;

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Revenue nearly tripled in four years (Thailand, Biryani By Kilo, stores); profit did not: FY26 was a loss',
  blocks: [
    { p: 'Revenue went from ₹2,084 cr in FY22 to ₹5,611 cr in FY26 (28% a year), but about ₹1,690 cr of FY26 revenue is Thailand (bought in January 2024) and own brands added ~₹230 cr, mostly Biryani By Kilo (bought in June 2025). India grew from ~₹3,318 cr (FY25) to ₹3,752 cr (FY26), +13%. EBITDA after Ind AS 116 (i.e. before rent) rose from ₹476 cr to ₹855 cr (company basis), but the margin fell from 22.8% (FY22, the post-Covid delivery boom) to 15.2%, as KFC same-store sales fell for 13 quarters, Pizza Hut shrank and Thailand came in at lower margins. After rent ("operating EBITDA") the margin went from 14.4% to 8.0%. Depreciation of stores and right-of-use assets (₹670 cr) and lease interest (₹223 cr) take almost all of it: net profit after minorities was ₹265 cr in FY23, ₹9 cr in FY25 and a loss of ₹38.6 cr in FY26.' },
    { pair: [
      { type: 'column', title: 'Revenue: ₹2,084 cr (FY22) to ₹5,611 cr (FY26)', unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY19', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'all', source: SRC.co + '. FY24 includes 2½ months of Thailand.' },
      { type: 'column', title: 'Net profit: ₹265 cr in FY23, a ₹39 cr loss in FY26', unit: 'Net profit after minorities (₹ crore)', x: 'fin.labels', from: 'FY19', to: 'FY26', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.co + '. FY24 includes a ₹151 cr post-tax exceptional gain (Screener schedule).' },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: 23% in FY22, 15% in FY26 (Screener basis)', unit: 'EBITDA margin, after Ind AS 116 (%)', x: 'fin.labels', from: 'FY19', to: 'FY26', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 0, max: 30, source: SRC.co + '. FY20 onwards after Ind AS 116 (rent excluded). Company basis FY26: 15.2%.' },
      { type: 'line', title: 'Materials ~30-32% of revenue; staff costs rising to 15%', unit: '% of revenue', x: 'fin.labels', from: 'FY19', to: 'FY26', series: [{ name: 'Materials', ref: 'A.materialPct', fmt: 'pct0' }, { name: 'Employees', ref: 'A.employeePct', fmt: 'pct0' }], labels: 'all', source: 'Screener.in cost split' },
    ] },
    { callout: '**Our view:** Devyani has bought growth (Thailand, BBK) faster than it has earned it. The Indian KFC engine stalled in FY24-FY26 (same-store sales down for 13 quarters) while the store count kept rising, so fixed costs grew faster than sales. The turn in KFC SSSG since Q4FY26 (+4.9%, +3.3%) is the first evidence of operating leverage in three years; EPS only becomes meaningful if that lasts.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capex & returns', kicker: 'Capital allocation', title: `After capex, rent and interest almost nothing was left: ₹${n0(leftAfter('FY26'))} cr in FY26`,
  blocks: [
    { p: `Over FY22-26 Devyani generated ₹${n0(cash5.cfo)} cr of operating cash and spent ₹${n0(cash5.capex)} cr on capex (Screener), plus ~₹1,090 cr (via the Temasek-co-owned holding company) for Thailand in FY24 and ₹420 cr in shares for Sky Gate in FY26. Operating cash is flattered by Ind AS 116: rent is paid in the financing section. In FY26 ₹${n0(CF.FY26.cfo)} cr of operating cash paid for ₹${n0(CF.FY26.capex)} cr of capex (217 net new stores), ₹${n0(CF.FY26.leaseP + CF.FY26.leaseI)} cr of lease payments (principal ₹${n0(CF.FY26.leaseP)} cr, interest ₹${n0(CF.FY26.leaseI)} cr) and ₹${n0(CF.FY26.int)} cr of other interest, leaving ₹${n0(leftAfter('FY26'))} cr. Devyani has never paid a dividend. Return on capital is low: Screener ROCE (incl. right-of-use assets and goodwill) ~5-6% since FY24.` },
    { pair: [
      { type: 'column', title: 'Operating cash covers capex; rent takes the rest', unit: '₹ crore', x: ['FY25', 'FY26'], series: [{ name: 'Cash from operations', values: [CF.FY25.cfo, CF.FY26.cfo].map(Math.round), fmt: 'num' }, { name: 'Capex', values: [CF.FY25.capex, CF.FY26.capex].map(Math.round), fmt: 'num' }, { name: 'Lease payments (principal + interest)', values: [CF.FY25.leaseP + CF.FY25.leaseI, CF.FY26.leaseP + CF.FY26.leaseI].map(Math.round), fmt: 'num' }], labels: 'all', source: SRC.ar },
      { type: 'line', title: 'ROCE fell from 18% (FY23) to ~5-6% after Thailand', unit: 'Return on capital employed (%), Screener basis', x: RL, series: [{ name: 'ROCE', values: RR('ROCE %'), fmt: 'pct0' }], labels: 'all', min: -20, max: 25, source: 'Screener.in (capital employed includes right-of-use assets and goodwill)' },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went (₹ crore)', head: ['', 'FY25', 'FY26'], rows: [
      ['Cash from operations', n0(CF.FY25.cfo), n0(CF.FY26.cfo)], ['Capex (PPE and intangibles)', n0(CF.FY25.capex), n0(CF.FY26.capex)],
      ['Lease principal', n0(CF.FY25.leaseP), n0(CF.FY26.leaseP)], ['Lease interest', n0(CF.FY25.leaseI), n0(CF.FY26.leaseI)], ['Other interest paid', n0(CF.FY25.int), n0(CF.FY26.int)],
      { hl: true, cells: ['**Left after capex, rent and interest**', `**${n0(leftAfter('FY25'))}**`, `**${n0(leftAfter('FY26'))}**`] },
      ['Memo: Thai equity infusion (FY26, via DMCC, partly bank-funded)', '–', '357'], ['Memo: Sky Gate (paid in new shares)', '–', '420'],
    ], source: SRC.ar + '; AR FY26 notes 53 and 57' } },
    { callout: '**The capital question:** stores pay back only if same-store sales grow; on FY24-FY26 trends they barely covered rent and depreciation. The Sapphire merger adds Sapphire\'s ₹1,400 cr of lease liabilities and a ~₹320 cr one-time fee to Yum!, and is paid in shares (46% more), not cash.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'Net debt ₹3,336 cr at Mar-2026, of which ₹2,473 cr is store leases; ₹1,722 cr of goodwill and brands',
  blocks: [
    { p: 'At Mar-2026 Devyani had ₹1,361 cr of bank borrowings (long-term ₹786 cr, short-term ₹575 cr, incl. a ~₹240 cr bridge loan for the Thai equity infusion that management says was repaid in April 2026) and ₹2,473 cr of lease liabilities, against ₹497 cr of cash and investments. Screener counts leases as borrowings, so its net debt (₹3,336 cr) is the lease-inclusive figure; bank net debt was ~₹864 cr, about 1.9x FY26 EBITDA after rent (₹450 cr). Goodwill (₹683 cr), brands (₹495 cr, mostly BBK), territory rights (₹413 cr, Thailand) and franchise rights (₹130 cr) add up to ₹1,722 cr, more than the owners\' equity of ₹1,542 cr. Minorities (mainly Camas in Thailand) hold another ₹343 cr of book equity. Working capital is negative: suppliers fund inventory.' },
    { pair: [
      { type: 'line', title: 'Negative working capital: payables far exceed inventory', unit: 'Days (Screener basis)', x: RL, series: [{ name: 'Inventory days', values: RR('Inventory Days'), fmt: 'num' }, { name: 'Receivable days', values: RR('Debtor Days'), fmt: 'num' }, { name: 'Payable days', values: RR('Days Payable'), fmt: 'num' }], labels: 'last', source: 'Screener.in' },
      { type: 'column', title: 'Net debt incl. leases: ₹1,188 cr (FY22) to ₹3,336 cr (FY26)', unit: 'Borrowings incl. leases less cash and investments (₹ crore)', x: 'A.labels', from: 'FY20', series: [{ name: 'Net debt incl. leases', ref: 'A.netDebt', fmt: 'num' }], labels: 'all', source: SRC.co + '. The FY24 jump is Thailand\'s leases and debt.' },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-23', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth (owners)', '{{A.netWorth.7|num}}', '{{A.netWorth.8|num}}', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}'],
      ['Borrowings incl. lease liabilities', '{{A.borrowings.7|num}}', '{{A.borrowings.8|num}}', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}'],
      ['Cash, bank balances and investments', '{{A.cashAndInvestments.7|num}}', '{{A.cashAndInvestments.8|num}}', '{{A.cashAndInvestments.9|num}}', '{{A.cashAndInvestments.10|num}}'],
      ['Net fixed assets incl. goodwill and right-of-use', '{{A.fixedAssets.7|num}}', '{{A.fixedAssets.8|num}}', '{{A.fixedAssets.9|num}}', '{{A.fixedAssets.10|num}}'],
      ['Memo: lease liabilities (in borrowings)', '1,487', '1,996', '2,256', '2,473'], ['Memo: minorities (book)', '−6', '293', '308', '343'],
    ], source: SRC.co + '; Screener borrowings and other-liabilities schedules' } },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: the Jaipuria family (RJ Corp) 61.4%; Indian funds 18.8%, foreign funds down to 6.8%',
  blocks: [
    { pair: [
      { type: 'line', title: 'Foreign funds 12.5% → 6.8%, Indian funds 8.5% → 18.8% since Dec-2023', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }, { name: 'Public', ref: 'SH.rows.Public', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in (to Jun-2026)' },
      { type: 'column', title: 'Promoter stake 62.7% → 61.4% (Sky Gate shares issued in Jun-2025)', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'all', min: 0, max: 70, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY22–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 25 }, hl: true },
      { key: 'ebitda', name: 'EBITDA (after Ind AS 116)', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 200 } },
      { key: 'dep', name: 'Depreciation (incl. right-of-use and impairment)' },
      { key: 'otherIncome', name: 'Other income (history: incl. exceptional items and exchange differences)', flag: { type: 'pct', th: 60 } },
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
      { key: 'otherIncome', name: 'Other income (incl. exceptional items)' },
      { key: 'dep', name: 'Depreciation' },
      { key: 'pat', name: 'Net profit (after minorities)', hl: true },
    ] } },
  ],
};

const statementNotes = {};

module.exports = { financials, capital, balance, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  require('./DEVYANI.val').syncMultiples();
  const B = fs.existsSync(path.join(__dirname, 'DEVYANI.research.js')) ? require('./DEVYANI.research') : null;
  const report = {
    symbol: 'DEVYANI', listing: 'NSE: DEVYANI · BSE: 543330', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Consumer services (QSR)',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  // research JSONs write rupees as 'Rs'; show them as ₹ in the report
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1).replace(/(^|[^A-Za-z])Rs ?(?=[0-9~])/g, '$1₹'));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
