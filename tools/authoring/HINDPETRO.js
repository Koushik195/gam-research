// Authoring source for the Hindustan Petroleum (HPCL) initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated; no patch needed: subsidiaries are
// 100%-owned and there are no treasury shares). Part B (HINDPETRO.research.js + part2-6, shared HINDPETRO.ctx.js) adds the
// research chapters. HINDPETRO.val.js first writes the derived SOTP inputs into assumptions.json.
// Usage: node tools/authoring/HINDPETRO.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'HINDPETRO', 'research');
const SCR = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8')).tables.ratios;
const MOD = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'models', 'HINDPETRO.json'), 'utf8')).annual;
const keepR = SCR.periods.map(p => `${p.slice(4, 8)}-05-30` <= '2026-09-30' && /^Mar \d{4}$/.test(p));
const RL = SCR.periods.filter((_, i) => keepR[i]).map(p => 'FY' + p.slice(6, 8));
const RR = k => SCR.rows[k].filter((_, i) => keepR[i]);
const SRC = { co: 'Company filings, Screener.in (consolidated), GAM Research' };
const n0 = v => Math.round(v).toLocaleString('en-IN');
const ix = fy => MOD.labels.indexOf(fy);
const sum = (k, a, z) => MOD[k].slice(ix(a), ix(z) + 1).reduce((s, x) => s + (x || 0), 0);
const cash = { cfo1: sum('cfo', 'FY21', 'FY23'), cfo2: sum('cfo', 'FY24', 'FY26'), cx1: sum('capex', 'FY21', 'FY23'), cx2: sum('capex', 'FY24', 'FY26'), dv1: Math.abs(sum('dividendsPaid', 'FY21', 'FY23')), dv2: Math.abs(sum('dividendsPaid', 'FY24', 'FY26')) };
const E = fy => n0(MOD.ebitda[ix(fy)]);

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'From a ₹7,192 cr EBITDA loss to a ₹30,645 cr profit in three years, and back to a loss in one quarter',
  blocks: [
    { p: `HPCL's revenue follows the crude price (₹2.3 lakh cr in FY21, ₹4.4 lakh cr in FY23-FY26, net of excise), so revenue growth says little. What matters is the margin on each tonne it sells, and that swings with two things HPCL does not control: refining cracks and how far the Government lets retail prices follow crude. EBITDA was ₹${E('FY22')} cr in FY22, −₹${n0(-MOD.ebitda[ix('FY23')])} cr in FY23 (retail prices held while crude spiked after the Ukraine war), ₹${E('FY24')} cr in FY24, ₹${E('FY25')} cr in FY25 (weak cracks, LPG losses) and a record ₹${E('FY26')} cr in FY26. Net profit went ₹7,294 → −6,980 → 16,015 → 6,736 → 18,047 cr. Because HPCL sells twice what it refines, a marketing squeeze hits it harder than IOC or BPCL: Q1FY27 alone lost ₹12,265 cr.` },
    { pair: [
      { type: 'column', title: 'EBITDA: a loss in FY23, a record in FY26, a loss again in FY27E', unit: 'EBITDA (₹ crore)', x: 'fin.labels', from: 'FY19', to: 'FY29E', series: [{ name: 'EBITDA', ref: 'fin.ebitda', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'column', title: 'Net profit: ₹18,047 cr in FY26, a loss in FY27E', unit: 'Net profit (₹ crore)', x: 'fin.labels', from: 'FY19', to: 'FY29E', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: −1.6% to 7%; a 4-5% mid-cycle', unit: 'EBITDA margin (%), on net sales', x: 'fin.labels', from: 'FY19', to: 'FY29E', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: -2, max: 8, source: SRC.co },
      { type: 'column', title: 'Revenue tracks crude, not volumes', unit: 'Net sales (₹ crore)', x: 'fin.labels', from: 'FY19', to: 'FY29E', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'none', source: SRC.co },
    ] },
    { callout: '**Our view:** HPCL has no "normal" year to forecast from. Over FY22-FY26 EBITDA averaged ~₹3,100 per tonne sold (₹4,300 without the FY23 loss year; ₹5,300-6,000 in good years). We forecast ₹700/t for FY27E (Q1 was −₹12,300/t), then ₹4,300/t and ₹4,500/t: the five-year average without FY23, because the Vizag residue upgrade and HRRL supply should help, while the 2026 war showed again that marketing margins are a policy decision.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capex & returns', kicker: 'Capital allocation', title: 'Capex of ₹10,000-14,000 cr a year plus ~₹19,000 cr into HRRL; ROE −23% to +31% with the cycle',
  blocks: [
    { p: `Over FY24-FY26 HPCL generated ₹${n0(cash.cfo2)} cr of operating cash and spent ₹${n0(cash.cx2)} cr on fixed assets (Screener's line; the company's own capex figure is higher, ₹10,223-11,270 cr a year standalone) and ₹${n0(cash.dv2)} cr on dividends; over FY21-FY23 ₹${n0(cash.cfo1)} cr, ₹${n0(cash.cx1)} cr and ₹${n0(cash.dv1)} cr. The money went into the Visakh Refinery Modernisation (8.3 → 15 MMTPA) and its residue upgrade, the Mumbai expansion, pipelines, marketing and the Chhara LNG terminal; on top, HPCL has put ₹18,916 cr into HPCL Rajasthan Refinery (₹10,630 cr of equity and a ₹8,286 cr subordinated loan) of a ₹19,600 cr commitment. Management capped FY27 capex at ₹9,700 cr to protect the balance sheet. Returns follow the cycle: standalone ROE 32.5% in FY26, 16.9% in FY25 (AR), and a loss in FY23.` },
    { pair: [
      { type: 'column', title: 'Operating cash vs capex: the gap is the cycle', unit: '₹ crore', x: 'A.labels', from: 'FY21', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex (fixed assets purchased)', ref: 'A.capex', fmt: 'num' }], labels: 'none', source: SRC.co + '. Capex = Screener "fixed assets purchased"; loans to HRRL (₹3,829-3,970 cr a year in FY25-FY26) are on top.' },
      { type: 'line', title: 'ROCE: −8% in FY23, 22% in FY26', unit: 'Return on capital employed (%), Screener basis', x: RL, series: [{ name: 'ROCE', values: RR('ROCE %'), fmt: 'pct0' }], labels: 'all', min: -10, max: 30, source: 'Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went (₹ crore)', head: ['', 'FY21-23', 'FY24-26', 'Six years'], rows: [
      ['Cash from operations', n0(cash.cfo1), n0(cash.cfo2), n0(cash.cfo1 + cash.cfo2)],
      ['Capex (fixed assets purchased)', n0(cash.cx1), n0(cash.cx2), n0(cash.cx1 + cash.cx2)],
      ['Dividends paid', n0(cash.dv1), n0(cash.dv2), n0(cash.dv1 + cash.dv2)],
      { hl: true, cells: ['**Left over**', `**${n0(cash.cfo1 - cash.cx1 - cash.dv1)}**`, `**${n0(cash.cfo2 - cash.cx2 - cash.dv2)}**`, `**${n0(cash.cfo1 + cash.cfo2 - cash.cx1 - cash.cx2 - cash.dv1 - cash.dv2)}**`] },
      ['Memo: investments in and loans to JVs (mainly HRRL)', 'large (HRRL equity)', '~₹11,000', ''],
      ['Memo: borrowings incl. leases at the end', '70,671 (Mar-23)', '55,964 (Mar-26)', ''],
    ], source: 'Screener.in cash flow (consolidated); AR FY26 (HRRL loan ₹4,325 → 8,286 cr; investments in JVs).' } },
    { callout: '**The capital question:** HPCL has spent a decade building refining to cover its marketing (Visakh, HRRL), yet still buys about half of what it sells. HRRL\'s cost nearly doubled to ₹79,459 cr and it carries ~₹53,000 cr of project debt off HPCL\'s balance sheet; whether it earns its cost of capital will decide whether that ₹19,600 cr was well spent.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & debt', kicker: 'Balance sheet', title: 'Net debt ~₹27,800 cr at Mar-26 after investments; gross debt +₹25,000 cr in Q1FY27',
  blocks: [
    { p: 'At Mar-2026 consolidated borrowings were ₹55,964 cr including ₹5,066 cr of leases, against ₹171 cr of cash and ₹28,012 cr of investments (HRRL ₹10,192 cr, HMEL ₹7,676 cr, MRPL ₹2,391 cr and other joint ventures ₹2,638 cr at equity value; Oil India ₹1,908 cr at fair value; ₹3,107 cr of government securities). Net of all investments, debt was ~₹27,800 cr, the lowest since FY19, after a strong FY26 (debt/equity 0.80x from 1.38x). It did not last: in Q1FY27 gross debt rose from ₹47,600 cr to ₹72,600 cr (debt/equity ~1.4-1.5x) as HPCL lost money and carried crude at war prices. Off balance sheet: a negative LPG buffer (under-recoveries not yet compensated) of ₹16,410 cr at Jun-2026, HRRL\'s project debt (~₹53,000 cr, 74% HPCL) and HMEL\'s net debt (~₹38,100 cr, 48.99%).' },
    { pair: [
      { type: 'column', title: 'Net debt (after investments at book): ₹27,800 cr in FY26', unit: 'Net debt (₹ crore)', x: 'A.labels', from: 'FY20', series: [{ name: 'Net debt', ref: 'A.netDebt', fmt: 'num' }], labels: 'all', source: SRC.co + '. Borrowings incl. leases less cash and investments.' },
      { type: 'line', title: 'Inventory 25-53 days; payables ~30', unit: 'Days (of revenue)', x: RL, series: [{ name: 'Inventory days', values: RR('Inventory Days'), fmt: 'num' }, { name: 'Payable days', values: RR('Days Payable'), fmt: 'num' }], labels: 'last', source: 'Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-23', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth', '{{A.netWorth.8|num}}', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}'],
      ['Borrowings incl. leases', '{{A.borrowings.8|num}}', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}'],
      ['Cash and equivalents', '{{A.cash.8|num}}', '{{A.cash.9|num}}', '{{A.cash.10|num}}', '{{A.cash.11|num}}'],
      ['Investments (JVs, MRPL, Oil India, G-secs)', '{{A.investments.8|num}}', '{{A.investments.9|num}}', '{{A.investments.10|num}}', '{{A.investments.11|num}}'],
      ['Net fixed assets', '{{A.fixedAssets.8|num}}', '{{A.fixedAssets.9|num}}', '{{A.fixedAssets.10|num}}', '{{A.fixedAssets.11|num}}'],
      ['Capital work in progress', '{{A.cwip.8|num}}', '{{A.cwip.9|num}}', '{{A.cwip.10|num}}', '{{A.cwip.11|num}}'],
      ['Inventories', '{{A.inventories.8|num}}', '{{A.inventories.9|num}}', '{{A.inventories.10|num}}', '{{A.inventories.11|num}}'],
    ], source: SRC.co + '. Investments: AR FY26 consolidated notes 6, 7, 12. Q1FY27 gross debt from Emkay (24-Jul-2026).' } },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: ONGC 54.9%; mutual funds and foreign funds ~36%; free float ~45%',
  blocks: [
    { pair: [
      { type: 'line', title: 'Foreign funds 12.6% → 17.3% → 13.6%; Indian institutions ~20-23%', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'About 0.5 million shareholders', unit: 'Number of shareholders', x: 'SH.periods', series: [{ name: 'Shareholders', ref: 'SH.rows.No. of Shareholders', fmt: 'num' }], labels: 'ends', source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY19–FY29E (consolidated)', rows: [
      { key: 'sales', name: 'Revenue (net of excise)', flag: { type: 'pct', th: 20 }, hl: true },
      { key: 'ebitda', name: 'EBITDA', hl: true, flag: { type: 'pct', th: 40 } },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 250 } },
      { key: 'dep', name: 'Depreciation' },
      { key: 'otherIncome', name: 'Other income (incl. JV and associate share)' },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit', hl: true, flag: { type: 'pct', th: 40 } },
      { key: 'eps', name: 'EPS (₹, 212.78 cr shares)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' },
      { key: 'capex', name: 'Capex (fixed assets purchased)' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 20 }, hl: true },
      { key: 'ebitda', name: 'EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' },
      { key: 'otherIncome', name: 'Other income (incl. JV share)' },
      { key: 'dep', name: 'Depreciation' },
      { key: 'pat', name: 'Net profit', hl: true },
    ] } },
  ],
};

const statementNotes = {};

module.exports = { financials, capital, balance, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  require('./HINDPETRO.val').syncVal();
  const B = fs.existsSync(path.join(__dirname, 'HINDPETRO.research.js')) ? require('./HINDPETRO.research') : null;
  const report = {
    symbol: 'HINDPETRO', listing: 'NSE: HINDPETRO · BSE: 500104', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Oil, Gas & Consumable Fuels',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
