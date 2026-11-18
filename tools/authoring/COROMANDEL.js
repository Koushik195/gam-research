// Authoring source for the Coromandel International initiating-coverage report (as of 30-Sep-2026).
// Part A (this file): chapters built on reported financials (Screener, consolidated) + the writer.
// Part B (COROMANDEL.research.js, merging COROMANDEL.part2-5.js on COROMANDEL.ctx.js) adds the
// business, history, industry, segments, projects, moat, quality, ownership, governance, forecasts,
// street, valuation and verdict chapters.
// Usage: node tools/authoring/COROMANDEL.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'COROMANDEL', 'research');
const SCR = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8')).tables.ratios;
const RL = SCR.periods.map(p => 'FY' + p.slice(-2));
const SRC = { co: 'Company filings, Screener.in (consolidated), GAM Research' };
const M = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'models', 'COROMANDEL.json'), 'utf8'));
const A = M.annual, ix = l => A.labels.indexOf(l);
const sumY = (k, from, to) => { let s = 0; for (let i = ix(from); i <= ix(to); i++) s += A[k][i] || 0; return s; };
const n0 = v => Math.round(v).toLocaleString('en-IN');
const cf = (a, b) => ({ cfo: sumY('cfo', a, b), capex: sumY('capex', a, b), div: sumY('dividendsPaid', a, b) });
const P1 = cf('FY19', 'FY22'), P2 = cf('FY23', 'FY26'), PT = cf('FY19', 'FY26');
const row = (k, f) => [P1, P2, PT].map(p => n0(f(p)));

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Revenue has tripled in ten years; profit per rupee of sales has not',
  blocks: [
    { p: 'Coromandel\'s revenue rose from ₹11,306 cr in FY15 to ₹31,480 cr in FY26. Most of that is price, not volume: fertiliser prices and subsidies follow global raw materials, so revenue jumped 55% in FY23 (after the Russia-Ukraine war), fell 26% in FY24 and rose 31% in FY26 as the Middle East crisis lifted input prices again. Profit has grown more slowly. Net profit was ₹1,329 cr in FY21 and ₹1,898 cr in FY26 (₹1,956 cr attributable to shareholders), and FY25\'s ₹2,055 cr included a ₹398 cr land gain. EBITDA margin fell from 14% in FY21 to 10.3% in FY26. Q1FY27 continued the squeeze: revenue +16%, net profit −24% to ₹382 cr.' },
    { pair: [
      { type: 'column', title: 'Revenue swings with global fertiliser prices', unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY17', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num', growth: true }], source: SRC.co },
      { type: 'column', title: 'Net profit: up 43% in five years, flat since FY23', unit: 'Net profit (₹ crore, incl. minorities)', x: 'fin.labels', from: 'FY17', to: 'FY26', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: 14% in FY21, 10% in FY26', unit: 'EBITDA margin (%)', x: 'fin.labels', from: 'FY17', to: 'FY26', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 0, max: 16, source: SRC.co },
      { type: 'column', title: 'Quarterly profit: Q2 is the big quarter, Q4 the weak one', unit: 'Net profit (₹ crore)', x: 'Q.labels', series: [{ name: 'Net profit', ref: 'Q.pat', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { callout: '**Our view:** this is a policy-regulated volume business. The government sets the subsidy per kg of nutrient and, in practice, the farm-gate price, so fertiliser margins are squeezed whenever raw materials rise faster than the subsidy (FY23, Q4FY26-Q1FY27) and recover when policy catches up. Growth in profit comes from volume, cost (backward integration) and the non-subsidy businesses (crop protection, specialty nutrients, retail), not from pricing power.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capex & returns', kicker: 'Capital allocation', title: 'The cash pile has gone into acid plants, a mine and an agrochemical company; returns are falling',
  blocks: [
    { p: `In FY19-22 Coromandel generated ₹${n0(P1.cfo)} cr of operating cash and spent only ₹${n0(P1.capex)} cr on plants: it repaid ~₹2,560 cr of debt and built a cash pile. In FY23-26 capex rose to ₹${n0(P2.capex)} cr (the Kakinada sulphuric and phosphoric acid plants, granulation, crop protection capacity), and it bought control of the Senegal rock mine (BMCC) and 53% of NACL Industries (₹820 cr). Management puts the total at "close to ₹7,000 crores" over three to four years. So far returns have fallen: ROCE was 35-38% in FY22-23 and 22% in FY26, because the new assets are not yet earning and FY26 fertiliser margins were squeezed.` },
    { pair: [
      { type: 'column', title: 'Capex vs operating cash flow', unit: '₹ crore', x: 'A.labels', from: 'FY19', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }], labels: 'none', source: SRC.co },
      { type: 'line', title: 'ROCE: from 38% (FY23) to 22% (FY26)', unit: 'Return on capital employed (%)', x: RL, series: [{ name: 'ROCE', values: SCR.rows['ROCE %'], fmt: 'pct0' }], labels: 'all', min: 0, max: 45, source: 'Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went (₹ crore)', head: ['', 'FY19-22', 'FY23-26', 'Eight years'], rows: [
      ['Cash from operations', ...row('cfo', p => p.cfo)],
      ['Capex', ...row('capex', p => p.capex)],
      ['Free cash flow', ...row('fcf', p => p.cfo - p.capex)],
      ['Dividends paid', ...row('div', p => p.div)],
      { hl: true, cells: ['**Left after dividends**', ...row('left', p => p.cfo - p.capex - p.div).map(v => `**${v}**`)] },
      ['Acquisitions: NACL ₹820 cr + ₹144 cr rights, BMCC ₹103 cr', '–', '≥1,067', '≥1,067'],
    ], source: 'Screener.in cash flow (capex = fixed assets purchased); acquisitions from annual reports FY25-26 (notes 38A-B), GAM Research' } },
    { callout: '**The test is FY27-29.** Management says it will now pause big projects ("normal sustainable capex of ₹300 crores") and harvest: own acid for 60% of needs, ~5 lakh t a year of Senegal rock, a 7.5 lakh t granulation train from Q4FY27, and NACL. If fertiliser EBITDA per tonne rises from ~₹5,000 to the targeted ₹6,500, returns recover; if subsidies keep lagging costs, the new assets mainly add depreciation (Q1FY27 D&A ₹203 cr vs ₹121 cr a year earlier).' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'Net cash, but the government is the biggest debtor',
  blocks: [
    { p: 'Coromandel has net cash: at Mar-2026 cash, investments and ₹1,564 cr of inter-corporate deposits with Bajaj Finance exceeded borrowings and leases (₹1,506 cr) by ~₹2,600 cr, down from ~₹4,570 cr a year earlier after the NACL purchase, capex and a build-up of working capital. Working capital is driven by two things it does not control: raw-material prices (inventory rose 51% to ₹7,204 cr in FY26; much of it is funded by ₹5,022 cr of acceptances, i.e. bank-backed supplier credit) and the pace of subsidy payments (₹2,168 cr owed by the government at Mar-2026, ₹3,254 cr at Jun-2026). Borrowings rose to ₹1,506 cr (incl. ₹639 cr of leases) as NACL\'s debt was consolidated.' },
    { pair: [
      { type: 'line', title: 'Working-capital days: inventory up to 111', unit: 'Days (of revenue)', x: RL, series: [{ name: 'Inventory days', values: SCR.rows['Inventory Days'], fmt: 'num' }, { name: 'Payable days', values: SCR.rows['Days Payable'], fmt: 'num' }, { name: 'Receivable days (ex-subsidy)', values: SCR.rows['Debtor Days'], fmt: 'num' }], labels: 'last', source: 'Screener.in' },
      { type: 'column', title: 'Net debt: negative = net cash (ex-ICDs)', unit: 'Net debt (₹ crore; negative = net cash; excludes ICDs)', x: 'A.labels', from: 'FY17', series: [{ name: 'Net debt', ref: 'A.netDebt', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-22', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth (incl. minorities on Screener)', '{{A.netWorth.7|num}}', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}'],
      ['Borrowings (incl. leases)', '{{A.borrowings.7|num}}', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}'],
      ['Cash and investments (ex-ICDs)', '{{A.cashAndInvestments.7|num}}', '{{A.cashAndInvestments.9|num}}', '{{A.cashAndInvestments.10|num}}', '{{A.cashAndInvestments.11|num}}'],
      ['ICDs with Bajaj Finance', '–', '–', '785', '1,564'],
      ['Government subsidy receivable', 'n.a.', '1,377', '1,654', '2,168'],
      ['Inventories', '{{A.inventories.7|num}}', '{{A.inventories.9|num}}', '{{A.inventories.10|num}}', '{{A.inventories.11|num}}'],
      ['Trade payables (incl. acceptances)', '{{A.payables.7|num}}', '{{A.payables.9|num}}', '{{A.payables.10|num}}', '{{A.payables.11|num}}'],
      ['Net fixed assets', '{{A.fixedAssets.7|num}}', '{{A.fixedAssets.9|num}}', '{{A.fixedAssets.10|num}}', '{{A.fixedAssets.11|num}}'],
    ], source: 'Screener.in; annual reports FY25-26 (subsidy receivable, ICDs); n.a. = not collected' } },
    { callout: '**What the model does with cash:** our forecasts treat cash, investments and the ICDs as one net-cash figure (the engine shows net cash, not gross cash, for forecast years). Net cash rises to ~₹{{F.treasury.2|num}} cr by Mar-29E because capex falls and the payout stays ~18%. A higher dividend or another acquisition is the obvious use; neither is in our numbers.' },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: a Murugappa company, with Indian funds replacing foreign ones',
  blocks: [
    { pair: [
      { type: 'line', title: 'FIIs down to 11.5%, DIIs up to 19.9%', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoters steady at ~56-57%', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 50, max: 60, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY15–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 15 }, hl: true },
      { key: 'ebitda', name: 'EBITDA', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 150 } },
      { key: 'dep', name: 'Depreciation' },
      { key: 'otherIncome', name: 'Other income' },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit*', hl: true, flag: { type: 'pct', th: 20 } },
      { key: 'eps', name: 'EPS (₹)', fmt: 'n1' },
      { key: 'cfo', name: 'Operating cash' },
      { key: 'capex', name: 'Capex' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 20 }, hl: true },
      { key: 'ebitda', name: 'EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' },
      { key: 'dep', name: 'Depreciation' },
      { key: 'interest', name: 'Interest' },
      { key: 'pat', name: 'Net profit', hl: true },
    ] } },
    { p: '*History: total profit incl. minorities (Screener). Forecasts: profit attributable to shareholders × 0.97, an engine workaround that keeps EPS correct (see Forecasts).' },
  ],
};

const statementNotes = {};

module.exports = { financials, capital, balance, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  const B = fs.existsSync(path.join(__dirname, 'COROMANDEL.research.js')) ? require('./COROMANDEL.research') : null;
  const report = {
    symbol: 'COROMANDEL', listing: 'NSE: COROMANDEL · BSE: 506395', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Agri inputs',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
