// Authoring source for the Chambal Fertilisers & Chemicals initiating-coverage report (as of 30-Sep-2026).
// Part A (this file): chapters built on reported financials (Screener, consolidated) + the writer.
// Part B (CHAMBLFERT.research.js, merging CHAMBLFERT.part2-6.js on CHAMBLFERT.ctx.js) adds the business,
// history, industry, segments, Gadepan-III reset, TAN, moat, quality, ownership, governance, forecasts,
// street, valuation and verdict chapters.
// Usage: node tools/authoring/CHAMBLFERT.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'CHAMBLFERT', 'research');
const SCR = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8')).tables.ratios;
const RL = SCR.periods.map(p => 'FY' + p.slice(-2));
const SRC = { co: 'Company filings, Screener.in (consolidated), GAM Research' };
const M = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'models', 'CHAMBLFERT.json'), 'utf8'));
const A = M.annual, ix = l => A.labels.indexOf(l);
const sumY = (k, from, to) => { let s = 0; for (let i = ix(from); i <= ix(to); i++) s += A[k][i] || 0; return s; };
const n0 = v => Math.round(v).toLocaleString('en-IN');
const cf = (a, b) => ({ cfo: sumY('cfo', a, b), capex: sumY('capex', a, b), div: sumY('dividendsPaid', a, b) });
const P1 = cf('FY19', 'FY22'), P2 = cf('FY23', 'FY26'), PT = cf('FY19', 'FY26');
const row = f => [P1, P2, PT].map(p => n0(f(p)));
const SEG = JSON.parse(fs.readFileSync(path.join(RD, 'segments.json'), 'utf8')).annual;
const s26 = SEG.find(a => a.fy === 'FY26');

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Revenue follows gas and fertiliser prices; profit has grown, but on a policy ceiling',
  blocks: [
    { p: `Chambal's revenue rose from ₹12,206 cr in FY20 to ₹20,794 cr in FY26, but the path was jagged: +73% in FY23 (record fertiliser prices after the Russia-Ukraine war), −35% in FY24 and −7% in FY25 as prices fell, then +25% in FY26 as traded DAP and NPK volumes more than doubled. Most of that is price, not volume: urea sales have stayed at 32.6-34.7 lakh t a year since FY21 because the three Gadepan plants already run above capacity. Profit has grown more steadily: net profit ₹1,226 cr (FY20), ₹1,566 cr (FY22), ₹1,034 cr (FY23), ₹1,953 cr (FY26). FY26 EPS of ₹48.8 is a record. Q1FY27 EPS was ₹13.1 (−5%), as the IMACID joint venture lost money and finance cost rose.` },
    { pair: [
      { type: 'column', title: 'Revenue swings with fertiliser prices', unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY17', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num', growth: true }], source: SRC.co },
      { type: 'column', title: 'Net profit: a record ₹1,953 cr in FY26', unit: 'Net profit (₹ crore)', x: 'fin.labels', from: 'FY17', to: 'FY26', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: high when traded volumes are low', unit: 'EBITDA margin (%)', x: 'fin.labels', from: 'FY17', to: 'FY26', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 0, max: 22, source: SRC.co },
      { type: 'column', title: 'Quarterly profit: Q4 is always the weak quarter', unit: 'Net profit (₹ crore)', x: 'Q.labels', series: [{ name: 'Net profit', ref: 'Q.pat', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { callout: '**Our view:** read the margin with care. Group EBITDA margin falls when Chambal sells more imported fertiliser (a 4% margin business) and rises when it sells less, even if profit per tonne of urea is unchanged. The numbers that matter are urea EBITDA per tonne (₹5,556 in FY24, ₹6,228 in FY25, ₹6,431 in FY26), the traded margin and the IMACID share. The first of these is about to change: Gadepan-III loses its NIP-2012 pricing in December 2026.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capital allocation', kicker: 'Capital allocation', title: 'Debt repaid, a buyback, a TAN plant, and now a ₹10,000 cr question',
  blocks: [
    { p: `In FY19-22 Chambal generated ₹${n0(P1.cfo)} cr of operating cash (FY21 alone ₹6,944 cr as the government cleared subsidy arrears) and spent ₹${n0(P1.capex)} cr, mostly to finish Gadepan-III. It used the cash to cut borrowings from ₹10,113 cr (FY20) to ₹3,936 cr (FY21). In FY23-26 operating cash was ₹${n0(P2.cfo)} cr; capex of ₹${n0(P2.capex)} cr went largely into the ₹1,645 cr TAN plant, ₹843 cr into a buyback (Feb-2024: 1.56 cr shares at ₹450, including tax and costs) and the rest into repaying all long-term debt by FY25. FY26 operating cash fell to ₹138 cr because subsidy receivables jumped by ~₹1,700 cr. Dividends were ₹10 a share for FY25 and ₹11 for FY26, a payout of ~23-25%.` },
    { pair: [
      { type: 'column', title: 'Operating cash swings with subsidy payments', unit: '₹ crore', x: 'A.labels', from: 'FY19', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }], labels: 'none', source: SRC.co },
      { type: 'line', title: 'ROCE: 25-27% in FY25-26, on a regulated base', unit: 'Return on capital employed (%)', x: RL, series: [{ name: 'ROCE', values: SCR.rows['ROCE %'], fmt: 'pct0' }], labels: 'all', min: 0, max: 32, source: 'Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went (₹ crore)', head: ['', 'FY19-22', 'FY23-26', 'Eight years'], rows: [
      ['Cash from operations', ...row(p => p.cfo)],
      ['Capex', ...row(p => p.capex)],
      ['Free cash flow', ...row(p => p.cfo - p.capex)],
      ['Dividends paid', ...row(p => p.div)],
      { hl: true, cells: ['**Left after dividends**', ...row(p => p.cfo - p.capex - p.div).map(v => `**${v}**`)] },
      ['Buyback (Feb-2024, incl. tax and costs)', '–', '843', '843'],
      ['Borrowings at the end of the period', n0(A.borrowings[ix('FY22')]), n0(A.borrowings[ix('FY26')]), ''],
    ], source: 'Screener.in cash flow (capex = fixed assets purchased); buyback from Annual Report FY24 (₹678 cr + ₹159 cr tax + ₹5 cr costs); GAM Research' } },
    { callout: '**The next decision is much bigger than anything so far.** Under the National Investment Policy for Urea-2026 (approved 15-Jul-2026) Chambal is preparing a fourth urea plant at Gadepan: ~1.3 mt for ₹9,500-10,000 cr, EBITDA of ~₹12,000-13,500 a tonne, commissioning "within 2030". Financial bids were expected by mid-October; the Board and the government had not approved it on 30-Sep. Management calls the returns "dilutive" versus NIP-2012 (an ROE band of 12-16%) and says a buyback is off the table while projects are in view. We do not model it: it would roughly double gross block, absorb the cash we forecast, and earn returns close to, or only slightly above, our 11.9% cost of equity.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'Debt-free in structure, but the government owes it ₹2,462 cr',
  blocks: [
    { p: `Chambal repaid its last long-term loans in FY25. What borrowing remains is short-term and funds one thing: money owed by the government. Subsidy receivables were ₹1,954 cr at Mar-2026 (total trade receivables ₹2,075 cr vs ₹368 cr a year earlier) because provisional urea prices paid earlier on a higher gas price were adjusted downwards, and ₹2,462 cr at Jun-2026. Short-term borrowings were ₹963 cr at Mar-2026; management said net cash was "0-0 almost" then and net debt ~₹200 cr at Jun-2026. Screener shows net cash of ₹570 cr at Mar-2026, but that counts the ₹577 cr IMACID stake (equity-accounted) as an investment. Inventory (₹2,280 cr) is mostly imported DAP/NPK bought ahead of the Kharif season.` },
    { pair: [
      { type: 'line', title: 'Receivable days jumped in FY26 (subsidy adjustments)', unit: 'Days (of revenue)', x: RL, series: [{ name: 'Receivable days', values: SCR.rows['Debtor Days'], fmt: 'num' }, { name: 'Inventory days', values: SCR.rows['Inventory Days'], fmt: 'num' }, { name: 'Payable days', values: SCR.rows['Days Payable'], fmt: 'num' }], labels: 'last', source: 'Screener.in' },
      { type: 'column', title: 'Net debt: ₹9,728 cr (FY20) to roughly nil', unit: 'Net debt (₹ crore; negative = net cash; incl. IMACID stake)', x: 'A.labels', from: 'FY17', series: [{ name: 'Net debt', ref: 'A.netDebt', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-22', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth', '{{A.netWorth.7|num}}', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}'],
      ['Borrowings (incl. leases)', '{{A.borrowings.7|num}}', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}'],
      ['Cash and investments (incl. IMACID stake)', '{{A.cashAndInvestments.7|num}}', '{{A.cashAndInvestments.9|num}}', '{{A.cashAndInvestments.10|num}}', '{{A.cashAndInvestments.11|num}}'],
      ['of which IMACID (equity-accounted)', 'n.a.', '499', '544', '577'],
      ['Trade receivables (mostly subsidy)', '{{A.receivables.7|num}}', '{{A.receivables.9|num}}', '{{A.receivables.10|num}}', '{{A.receivables.11|num}}'],
      ['Inventories', '{{A.inventories.7|num}}', '{{A.inventories.9|num}}', '{{A.inventories.10|num}}', '{{A.inventories.11|num}}'],
      ['Trade payables', '{{A.payables.7|num}}', '{{A.payables.9|num}}', '{{A.payables.10|num}}', '{{A.payables.11|num}}'],
      ['Net fixed assets', '{{A.fixedAssets.7|num}}', '{{A.fixedAssets.9|num}}', '{{A.fixedAssets.10|num}}', '{{A.fixedAssets.11|num}}'],
      ['Capital work in progress (TAN)', '{{A.cwip.7|num}}', '{{A.cwip.9|num}}', '{{A.cwip.10|num}}', '{{A.cwip.11|num}}'],
    ], source: 'Screener.in; IMACID carrying value from the FY24 presentation and Annual Report FY26 (segment reconciliation); n.a. = not collected' } },
    { callout: `**What the model does with cash and working capital:** the engine holds operating working capital at Mar-2026's ${(Math.round(M.forecast.F.owcPct * 10) / 10).toFixed(1)}% of revenue. That is high by Chambal's recent standard (about 2% at Mar-2025, nil at Mar-2024) because Mar-2026 caught a subsidy adjustment, and lower than the Jun-2026 peak. We keep it: gas is still dear, a high-price year stretches the subsidy budget, and traded fertilisers (paid by the government with a lag) are now a third of revenue. If receivables return to FY24-25 levels, ~₹1,800 cr more cash would appear. Forecast "net treasury" includes the IMACID stake at book; net cash excluding it rises from roughly nil at Mar-2026 to ~₹${n0(Math.round((M.forecast.F.treasury[2] - 577) / 100) * 100)} cr by Mar-29E.` },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: three K K Birla family groups, buying more; foreign funds selling',
  blocks: [
    { pair: [
      { type: 'line', title: 'FIIs down from 20.2% to 14.9% in five quarters', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoters creeping up to 61.3%', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 58, max: 63, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY15–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 15 }, hl: true },
      { key: 'ebitda', name: 'EBITDA', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 200 } },
      { key: 'dep', name: 'Depreciation' },
      { key: 'otherIncome', name: 'Other income (incl. IMACID share)' },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit', hl: true, flag: { type: 'pct', th: 20 } },
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
    { p: `Screener basis: other income includes the share of IMACID's profit (₹${n0(128.81)} cr in FY26), except in Q1FY27, where Screener nets the ₹25 cr IMACID loss inside EBITDA (company EBITDA ₹851 cr vs ₹826 cr shown). Urea segment FY26: revenue ₹${n0(s26.ureaRev)} cr, EBITDA ₹${n0(s26.ureaEbitda)} cr.` },
  ],
};

const statementNotes = {};

module.exports = { financials, capital, balance, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  const B = fs.existsSync(path.join(__dirname, 'CHAMBLFERT.research.js')) ? require('./CHAMBLFERT.research') : null;
  const report = {
    symbol: 'CHAMBLFERT', listing: 'NSE: CHAMBLFERT · BSE: 500085', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Agri inputs',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
