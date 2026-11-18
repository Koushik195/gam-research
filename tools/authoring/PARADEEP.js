// Authoring source for the Paradeep Phosphates initiating-coverage report (as of 30-Sep-2026).
// Part A (this file): chapters built on reported financials (Screener, consolidated; FY25 onwards restated for
// the MCFL merger, see PARADEEP.patch.js) + the writer. Part B (PARADEEP.research.js, merging PARADEEP.part2-5.js
// on PARADEEP.ctx.js) adds the research chapters, cover, rating and statement notes.
// Usage: node tools/authoring/PARADEEP.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'PARADEEP', 'research');
const SCR = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8')).tables.ratios;
const RL = SCR.periods.map(p => 'FY' + p.match(/\d{4}/)[0].slice(-2));
const SRC = { co: 'Company filings, Screener.in (consolidated; FY25 onwards incl. MCFL), GAM Research' };
const M = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'models', 'PARADEEP.json'), 'utf8'));
const A = M.annual, ix = l => A.labels.indexOf(l), F = M.forecast.F;
const sumY = (k, from, to) => { let s = 0; for (let i = ix(from); i <= ix(to); i++) s += A[k][i] || 0; return s; };
const n0 = v => Math.round(v).toLocaleString('en-IN');
const cf = (a, b) => ({ cfo: sumY('cfo', a, b), capex: sumY('capex', a, b), div: sumY('dividendsPaid', a, b) });
const P1 = cf('FY19', 'FY22'), P2 = cf('FY23', 'FY26'), PT = cf('FY19', 'FY26');
const row = (k, f) => [P1, P2, PT].map(p => n0(f(p)));
const nd = l => A.netDebt[ix(l)];
const snap = k => ['FY22', 'FY24', 'FY25', 'FY26'].map(l => `{{A.${k}.${ix(l)}|num}}`); // tokens by label, robust to Screener adding older years

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Revenue up five times since FY19, mostly bought and priced in; profit per tonne is the number to watch',
  blocks: [
    { p: 'Paradeep\'s revenue rose from ₹4,358 cr in FY19 to ₹21,826 cr in FY26. Three things did it, and only one is organic: (1) the Goa plant bought from Zuari Agro Chemicals in June 2022 (FY23 revenue +70%); (2) the merger of Mangalore Chemicals & Fertilizers, which added ~₹3,100 cr of revenue in FY25 (the restated FY25 is ₹16,959 cr against ₹13,820 cr for Paradeep alone); and (3) fertiliser prices and subsidies, which follow world raw materials (FY23 up, FY24 down 13%, FY26 up 29%). EBITDA went from ₹452 cr to ₹2,208 cr and net profit from ₹159 cr to ₹996 cr. Per share the record is bumpier: EPS ₹6.92 (FY22, before the IPO), ₹3.73, ₹1.23 (FY24, the trough), ₹6.39 (FY25 restated) and ₹9.60 (FY26). Q1FY27 profit rose 24% to ₹393 cr on cheap opening stock.' },
    { pair: [
      { type: 'column', title: 'Revenue: acquisitions and prices, then volume', unit: 'Revenue (₹ crore; FY25 onwards incl. MCFL)', x: 'fin.labels', from: 'FY19', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num', growth: true }], source: SRC.co },
      { type: 'column', title: 'Net profit: ₹100 cr in FY24, ₹996 cr in FY26', unit: 'Net profit (₹ crore)', x: 'fin.labels', from: 'FY19', to: 'FY26', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: 6% in FY23-24, 10% in FY26', unit: 'EBITDA margin (%)', x: 'fin.labels', from: 'FY19', to: 'FY26', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 0, max: 14, source: SRC.co },
      { type: 'column', title: 'Interest and depreciation take ~42% of FY26 EBITDA', unit: '₹ crore', x: 'A.labels', from: 'FY19', series: [{ name: 'Depreciation', ref: 'A.dep', fmt: 'num' }, { name: 'Interest', ref: 'A.interest', fmt: 'num' }], labels: 'none', source: SRC.co },
    ] },
    { callout: '**Our view:** this is a regulated conversion business whose margin is set by the subsidy table and whose growth has come from buying plants. Organic volume growth is real (sales 3.82 mt → 4.21 mt in FY26, NPK +22%) but the earnings line swings with policy: EBITDA margin was 5.8% in FY24 and 10.1% in FY26. Below EBITDA, ₹528 cr of finance cost (incl. ₹145 cr of exchange loss) and ₹403 cr of depreciation took 42% of FY26 EBITDA, so EPS moves far more than EBITDA.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capex & returns', kicker: 'Capital allocation', title: 'Eight years of operating cash did not pay for the plants: debt and new shares did',
  blocks: [
    { p: `Over FY19-26 Paradeep generated ₹${n0(PT.cfo)} cr of operating cash in total and spent ₹${n0(PT.capex)} cr on fixed assets. Working capital is the reason: in FY23 (−₹2,377 cr) and FY26 (−₹1,012 cr) operating cash was negative because inventory and subsidy receivables jumped with prices. The rest was funded by the May-2022 IPO (₹975 cr of new shares), by issuing 22.2 cr shares for MCFL (₹1,706 cr of stock) and by debt: net debt rose from ₹${n0(nd('FY22'))} cr (Mar-22) to ₹${n0(nd('FY26'))} cr (Mar-26). ROCE has been 7-15%, at or below the cost of capital except in good years.` },
    { pair: [
      { type: 'column', title: 'Operating cash vs capex: working capital eats the cash', unit: '₹ crore', x: 'A.labels', from: 'FY19', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }], labels: 'none', source: SRC.co },
      { type: 'line', title: 'ROCE: 15% in a good year, 7% in a bad one', unit: 'Return on capital employed (%)', x: RL, series: [{ name: 'ROCE', values: SCR.rows['ROCE %'], fmt: 'pct0' }], labels: 'all', min: 0, max: 20, source: 'Screener.in (FY24 and earlier PPL alone)' },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went (₹ crore)', head: ['', 'FY19-22', 'FY23-26', 'Eight years'], rows: [
      ['Cash from operations', ...row('cfo', p => p.cfo)],
      ['Capex', ...row('capex', p => p.capex)],
      ['Free cash flow', ...row('fcf', p => p.cfo - p.capex)],
      ['Dividends paid', ...row('div', p => p.div)],
      { hl: true, cells: ['**Left after dividends**', ...row('left', p => p.cfo - p.capex - p.div).map(v => `**${v}**`)] },
      ['Acquisitions: Goa plant (FY23, ~$280 mn per PL); MCFL (FY26, all-stock ₹1,706 cr); Mahad SSP (FY26, ₹73 cr)', '–', 'see left', 'see left'],
    ], source: 'Screener.in cash flow (capex = fixed assets purchased; FY24 and earlier PPL alone); annual report FY26 (note 44(a), 45); Prabhudas Lilladher initiation (Goa price)' } },
    { callout: `**The test is FY27-29.** Capex runs at ~₹800 cr, ₹1,600 cr and ₹1,500 cr in FY27-29E (our estimates) for the phosphoric acid, sulphuric acid and 1.0 mt granulation projects, roughly ₹3,900 cr in three years against FY26 EBITDA of ₹2,208 cr. Management says the projects take EBITDA per tonne from ~₹5,000 to ₹7,000+. If they do, returns rise to the high teens; if subsidies keep lagging costs, the company will have added debt and depreciation for little. We model net debt of ~₹${n0(Math.round(-F.treasury[2] / 100) * 100)} cr at Mar-29E (₹${n0(nd('FY26'))} cr at Mar-26).` },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'Net debt ~₹6,500 cr, and the government is the biggest debtor',
  blocks: [
    { p: 'At Mar-2026 Paradeep owed ₹6,872 cr of borrowings (₹6,057 cr short-term, mostly working-capital lines and buyer\'s credit for imports) plus ₹34 cr of leases, against cash, bank balances and liquid funds of ₹409 cr: net debt ~₹6,500 cr, up from ~₹3,800 cr a year earlier. Two things it does not control drive this. The government owed it ₹3,847 cr of subsidy at Mar-2026 (₹2,357 cr a year earlier) and ₹4,600 cr at Jun-2026. And management deliberately bought ~30 extra days of raw materials before the Middle East crisis (inventory ₹4,627 cr vs ₹2,556 cr), which it says unwound in Q1FY27, cutting gross debt to ~₹6,500 cr by June. ICRA rates the company AA- (Stable), upgraded during FY26.' },
    { pair: [
      { type: 'column', title: 'Net debt: from ₹1,000 cr (FY21) to ₹6,500 cr (FY26)', unit: 'Borrowings incl. leases less cash and investments (₹ crore)', x: 'A.labels', from: 'FY19', series: [{ name: 'Net debt', ref: 'A.netDebt', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'line', title: 'Working-capital days: receivables and inventory up in FY26', unit: 'Days (of revenue)', x: RL, series: [{ name: 'Receivable days (incl. subsidy)', values: SCR.rows['Debtor Days'], fmt: 'num' }, { name: 'Inventory days', values: SCR.rows['Inventory Days'], fmt: 'num' }, { name: 'Payable days', values: SCR.rows['Days Payable'], fmt: 'num' }], labels: 'last', source: 'Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-22', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth', ...snap('netWorth')],
      ['Borrowings (incl. leases)', ...snap('borrowings')],
      ['Cash and investments', ...snap('cashAndInvestments')],
      { hl: true, cells: ['**Net debt**', ...snap('netDebt').map(v => `**${v}**`)] },
      ['Trade receivables (incl. subsidy)', ...snap('receivables')],
      ['of which subsidy due from the government', 'n.a.', 'n.a.', '2,357', '3,847'],
      ['Inventories', ...snap('inventories')],
      ['Trade payables', ...snap('payables')],
      ['Net fixed assets', ...snap('fixedAssets')],
    ], source: 'Screener.in (Mar-22 and Mar-24 PPL alone; Mar-25 restated incl. MCFL); annual report FY26 note 8 (subsidy); n.a. = not collected' } },
    { callout: '**What the model does with working capital:** the engine holds working capital at the FY26 ratio, 31% of revenue (FY22 31%, FY23 34%, FY24 32%, FY25 23%). That is the subsidy cycle: when fertiliser prices and subsidy per tonne rise, inventory and the government\'s dues rise with them and banks fund the gap. Our FY27E revenue +22% therefore adds ~₹1,500 cr of working capital and net debt rises to ~₹7,500 cr at Mar-27E (3.5x EBITDA) before easing towards 2.8x by FY29E. A faster subsidy payment cycle (like FY25\'s 23%) would cut net debt by ~₹2,000 cr; we do not assume it.' },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: Adventz and OCP control 58%; foreign funds have left, Indian small-cap funds have arrived',
  blocks: [
    { pair: [
      { type: 'line', title: 'FIIs: 15.0% (Sep-25) → 5.1% (Jun-26); DIIs back to 18%', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoters steady at 56-58%', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 50, max: 60, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: `Profit & loss, ${A.labels[0]}–FY29E`, rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 20 }, hl: true },
      { key: 'ebitda', name: 'EBITDA', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 150 } },
      { key: 'dep', name: 'Depreciation' },
      { key: 'otherIncome', name: 'Other income' },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit', hl: true, flag: { type: 'pct', th: 25 } },
      { key: 'eps', name: 'EPS (₹)', fmt: 'n1' },
      { key: 'cfo', name: 'Operating cash' },
      { key: 'capex', name: 'Capex' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 25 }, hl: true },
      { key: 'ebitda', name: 'EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' },
      { key: 'dep', name: 'Depreciation' },
      { key: 'interest', name: 'Interest' },
      { key: 'pat', name: 'Net profit', hl: true },
    ] } },
    { p: 'FY24 and earlier: Paradeep alone (FY17-18 standalone; Goa from Jun-2022). FY25 and Q1FY25 onwards: restated to include MCFL from 1-Apr-2024; FY25 EPS on the restated share basis (₹6.39, not Screener\'s ₹8.12). Q2FY24-Q4FY24 quarters are pre-merger. Forecasts: GAM Research.' },
  ],
};

const statementNotes = {};

module.exports = { financials, capital, balance, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  const Bp = fs.existsSync(path.join(__dirname, 'PARADEEP.research.js')) ? require('./PARADEEP.research') : null;
  const report = {
    symbol: 'PARADEEP', listing: 'NSE: PARADEEP · BSE: 543530', date: '30 September 2026', rating: Bp?.rating || 'HOLD', analysts: 'GAM Research — Agri inputs',
    cover: Bp?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: Bp ? Bp.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(Bp?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
