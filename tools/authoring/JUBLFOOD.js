// Authoring source for the Jubilant FoodWorks initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated; JUBLFOOD.patch.js puts Net Profit on
// the attributable basis). Part B (JUBLFOOD.research.js + part2-6, shared JUBLFOOD.ctx.js/ctx2.js) adds the research chapters.
// JUBLFOOD.val.js first syncs the derived multiples and the minorities deduction into assumptions.json.
// Usage: node tools/authoring/JUBLFOOD.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'JUBLFOOD', 'research');
const SCR = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8')).tables.ratios;
const keepR = SCR.periods.map(p => /^Mar 20(1[89]|2[0-9])$/.test(p) && `${p.slice(-4)}-05-30` <= '2026-09-30');
const RL = SCR.periods.filter((_, i) => keepR[i]).map(p => 'FY' + p.slice(-2));
const RR = k => SCR.rows[k].filter((_, i) => keepR[i]);
const SRC = { co: 'Company filings, Screener.in (consolidated; net profit after minorities), GAM Research', ar: 'AR FY26 consolidated cash flow statement and notes' };
const MA = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'models', 'JUBLFOOD.json'), 'utf8')).annual;
const n0 = v => Math.round(v).toLocaleString('en-IN');
const sumR = (k, a, z) => MA[k].slice(MA.labels.indexOf(a), MA.labels.indexOf(z) + 1).reduce((s, x) => s + (x || 0), 0);
const cash5 = { cfo: sumR('cfo', 'FY22', 'FY26'), capex: sumR('capex', 'FY22', 'FY26') };
// FY25-FY26 cash uses from the AR FY26 consolidated cash flow statement (Rs crore); lease payments include lease interest
const CF = { FY25: { cfo: 1657.9, capex: 862.9, lease: 545.0, int: 220.1, div: 78.9 }, FY26: { cfo: 1893.6, capex: 998.8, lease: 641.4, int: 110.9, div: 81.2 } };
const leftAfter = y => CF[y].cfo - CF[y].capex - CF[y].lease - CF[y].int;

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Revenue doubled in four years, mostly by buying Turkey; EBITDA margin stuck near 20% and EPS still below FY22',
  blocks: [
    { p: 'Revenue went from ₹4,396 cr in FY22 to ₹9,513 cr in FY26 (21% a year), but nearly half of the increase is DP Eurasia (Turkey, Azerbaijan, Georgia), consolidated from 1-Feb-2024 and worth ₹2,456 cr of FY26 revenue. Sales within India grew from ~₹5,100 cr (FY23, incl. Dunkin\') to ₹6,848 cr (FY26, ex-Dunkin\'), ~10-11% a year. EBITDA (after Ind AS 116, i.e. before rent) rose from ₹1,106 cr to ₹1,902 cr (Screener; company ₹1,888 cr), with the margin drifting from 25% (FY22, the post-Covid delivery boom) to ~20%. Net profit after minorities fell from ₹420 cr (FY22) to ₹211 cr (FY25) as depreciation, store openings, acquisition debt and Turkish accounting piled up, then recovered to ₹428 cr in FY26, helped by an ₹82 cr gain on selling the Russian business. EPS before one-offs was ₹6.58 in FY22 and ~₹5.86 in FY26.' },
    { pair: [
      { type: 'column', title: 'Revenue: ₹4,396 cr (FY22) to ₹9,513 cr (FY26); Turkey added from FY24', unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY19', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'all', source: SRC.co + '. FY25-26 re-presented without Dunkin\'.' },
      { type: 'column', title: 'Net profit: ₹420 cr in FY22, ₹211 cr in FY25, ₹428 cr in FY26', unit: 'Net profit after minorities (₹ crore)', x: 'fin.labels', from: 'FY19', to: 'FY26', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.co + '. FY24 includes a ₹170 cr DP Eurasia remeasurement gain (pre-tax); FY26 an ₹82 cr Russia sale gain.' },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: 25% in FY22, ~20% since FY24', unit: 'EBITDA margin, after Ind AS 116 (%)', x: 'fin.labels', from: 'FY19', to: 'FY26', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 0, max: 30, source: SRC.co + '. FY20 onwards after Ind AS 116 (rent excluded).' },
      { type: 'line', title: 'Materials up to 28% of revenue with Turkey and Popeyes; staff costs ~17%', unit: '% of revenue', x: 'fin.labels', from: 'FY19', to: 'FY26', series: [{ name: 'Materials', ref: 'A.materialPct', fmt: 'pct0' }, { name: 'Employees', ref: 'A.employeePct', fmt: 'pct0' }], labels: 'all', source: 'Screener.in cost split' },
    ] },
    { callout: '**Our view:** JFL\'s headline growth since FY24 is bought growth: Turkey added ~₹2,500 cr of revenue at a similar EBITDA margin but with acquisition debt, minorities and hyperinflation accounting. The Indian core has grown ~11% a year with a flat ~20% EBITDA margin (12-13% after rent). EPS before one-offs only got back above ₹5.5 in FY26; the earnings story from here is operating leverage on a supply chain built for ~5,000 stores, not more acquisitions.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capex & returns', kicker: 'Capital allocation', title: `Cash after capex and rent turned positive again: ₹${n0(leftAfter('FY26'))} cr in FY26 after ₹${n0(CF.FY26.capex)} cr of capex`,
  blocks: [
    { p: `Over FY22-26 JFL generated ₹${n0(cash5.cfo)} cr of operating cash and spent ₹${n0(cash5.capex)} cr on capex (Screener), plus ₹770 cr for control of DP Eurasia in FY24. Operating cash is flattered by Ind AS 116: rent is paid in the financing section. In FY26 ₹${n0(CF.FY26.cfo)} cr of operating cash paid for ₹${n0(CF.FY26.capex)} cr of capex (351 net new stores, the Mumbai commissary, technology), ₹${n0(CF.FY26.lease)} cr of lease payments (principal and interest) and ₹${n0(CF.FY26.int)} cr of other interest, leaving ₹${n0(leftAfter('FY26'))} cr; dividends took ₹${n0(CF.FY26.div)} cr. Management says supply-chain capex is past its peak (capacity for ~5,000 stores) and guides ₹750-900 cr a year for India. Return on capital is modest: Screener ROCE (incl. goodwill and right-of-use assets) 15% in FY26; the company's standalone pre-Ind AS ROCE was 18.9% (target 20%+).` },
    { pair: [
      { type: 'column', title: 'Operating cash covers capex; rent takes another third', unit: '₹ crore', x: ['FY25', 'FY26'], series: [{ name: 'Cash from operations', values: [CF.FY25.cfo, CF.FY26.cfo].map(Math.round), fmt: 'num' }, { name: 'Capex', values: [CF.FY25.capex, CF.FY26.capex].map(Math.round), fmt: 'num' }, { name: 'Lease payments (principal + interest)', values: [CF.FY25.lease, CF.FY26.lease].map(Math.round), fmt: 'num' }], labels: 'all', source: SRC.ar },
      { type: 'line', title: 'ROCE fell from 44% (FY19) to 11-15% after Ind AS 116 and Turkey', unit: 'Return on capital employed (%), Screener basis', x: RL, series: [{ name: 'ROCE', values: RR('ROCE %'), fmt: 'pct0' }], labels: 'all', min: 0, max: 50, source: 'Screener.in (capital employed includes right-of-use assets and goodwill). Company standalone pre-Ind AS ROCE: 18.9% in FY26.' },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went (₹ crore)', head: ['', 'FY25', 'FY26'], rows: [
      ['Cash from operations', n0(CF.FY25.cfo), n0(CF.FY26.cfo)], ['Capex (PPE and intangibles)', n0(CF.FY25.capex), n0(CF.FY26.capex)],
      ['Lease payments (principal and interest)', n0(CF.FY25.lease), n0(CF.FY26.lease)], ['Other finance cost paid', n0(CF.FY25.int), n0(CF.FY26.int)],
      { hl: true, cells: ['**Left after capex, rent and interest**', `**${n0(leftAfter('FY25'))}**`, `**${n0(leftAfter('FY26'))}**`] },
      ['Dividends paid', n0(CF.FY25.div), n0(CF.FY26.div)], ['Memo: DP Eurasia additional stake (FY24)', '–', '770 (FY24)'],
    ], source: SRC.ar + '; AR FY24 note 41 (DP Eurasia consideration)' } },
    { callout: '**The capital question:** the store machine now funds itself with a little to spare, and FY26 interest fell by ₹118 cr as Turkish lira debt was refinanced in euro. The risk is the reverse of the past: two euro term loans that financed DP Eurasia (₹1,183 cr) fall due in FY27 and must be refinanced or repaid, and Popeyes (35-40 stores a year) is still loss-making at the EBITDA level.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'Net debt ₹4,468 cr at Mar-2026, of which ₹3,157 cr is store leases and ₹1,745 cr bank debt',
  blocks: [
    { p: 'At Mar-2026 JFL had ₹1,745 cr of bank borrowings (two euro term loans for DP Eurasia ₹1,183 cr, guaranteed by the parent; a secured term loan ₹372 cr; working-capital lines) and ₹3,157 cr of lease liabilities, against ₹434 cr of cash, bank deposits and investments (incl. ~₹99 cr of non-current investments, mostly associates). Screener counts leases as borrowings, so its net debt (₹4,468 cr) is the lease-inclusive figure; bank net debt was ~₹1,311 cr, about 1.1x FY26 EBITDA after rent (₹1,246 cr, our estimate). Goodwill (₹799 cr) and intangible assets (₹1,355 cr, mainly the DP Eurasia brand and master-franchise rights, treated as indefinite-life) are large. Working capital is negative: suppliers fund the inventory (cash conversion cycle −84 days).' },
    { pair: [
      { type: 'line', title: 'Negative working capital: payables far exceed inventory', unit: 'Days (Screener basis)', x: RL, series: [{ name: 'Inventory days', values: RR('Inventory Days'), fmt: 'num' }, { name: 'Receivable days', values: RR('Debtor Days'), fmt: 'num' }, { name: 'Payable days', values: RR('Days Payable'), fmt: 'num' }], labels: 'last', source: 'Screener.in' },
      { type: 'column', title: 'Net debt incl. leases: ₹616 cr (FY22) to ₹4,468 cr (FY26)', unit: 'Borrowings incl. leases less cash and investments (₹ crore)', x: 'A.labels', from: 'FY20', series: [{ name: 'Net debt incl. leases', ref: 'A.netDebt', fmt: 'num' }], labels: 'all', source: SRC.co + '. The FY24 jump is DP Eurasia\'s debt and leases plus the euro acquisition loan.' },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-23', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth (owners)', '{{A.netWorth.8|num}}', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}'],
      ['Borrowings incl. lease liabilities', '{{A.borrowings.8|num}}', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}'],
      ['Cash, bank balances and investments', '{{A.cashAndInvestments.8|num}}', '{{A.cashAndInvestments.9|num}}', '{{A.cashAndInvestments.10|num}}', '{{A.cashAndInvestments.11|num}}'],
      ['Net fixed assets incl. goodwill and right-of-use', '{{A.fixedAssets.8|num}}', '{{A.fixedAssets.9|num}}', '{{A.fixedAssets.10|num}}', '{{A.fixedAssets.11|num}}'],
      ['Memo: lease liabilities (in borrowings)', '–', '–', '2,870', '3,157'], ['Memo: bank borrowings', '–', '–', '1,502', '1,745'],
    ], source: SRC.co + '; AR FY26 balance sheet and note 16' } },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: the Bhartia family 40.3%; Indian funds now 40%, foreign funds down to 13%',
  blocks: [
    { pair: [
      { type: 'line', title: 'Foreign funds 27.8% → 13.3%, Indian funds 21.9% → 39.6% in 2½ years', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }, { name: 'Public', ref: 'SH.rows.Public', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in (to Jun-2026)' },
      { type: 'column', title: 'Promoter stake 41.9% → 40.3% (Jun-2025 quarter sale)', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'all', min: 0, max: 50, source: 'BSE shareholding pattern, Screener.in' },
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
      { key: 'dep', name: 'Depreciation (incl. right-of-use)' },
      { key: 'otherIncome', name: 'Other income (history: incl. exceptional items, associates and discontinued operations)', flag: { type: 'pct', th: 60 } },
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
      { key: 'otherIncome', name: 'Other income (incl. exceptional and discontinued items)' },
      { key: 'dep', name: 'Depreciation' },
      { key: 'pat', name: 'Net profit (after minorities)', hl: true },
    ] } },
  ],
};

const statementNotes = {};

module.exports = { financials, capital, balance, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  require('./JUBLFOOD.val').syncMultiples();
  const B = fs.existsSync(path.join(__dirname, 'JUBLFOOD.research.js')) ? require('./JUBLFOOD.research') : null;
  const report = {
    symbol: 'JUBLFOOD', listing: 'NSE: JUBLFOOD · BSE: 533155', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Consumer services (QSR)',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  // research JSONs write rupees as 'Rs'; show them as ₹ in the report
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1).replace(/(^|[^A-Za-z])Rs ?(?=[0-9~])/g, '$1₹'));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
