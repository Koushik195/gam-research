// Authoring source for the Bharat Petroleum initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated; BPCL.patch.js puts EPS on the
// 427.26 cr shares outside the treasury trust). Part B (BPCL.research.js + part2-6, shared BPCL.ctx.js) adds the
// research chapters. BPCL.val.js first writes the derived SOTP inputs into assumptions.json.
// Usage: node tools/authoring/BPCL.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'BPCL', 'research');
const SCR = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8')).tables.ratios;
const MOD = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'models', 'BPCL.json'), 'utf8')).annual;
const keepR = SCR.periods.map(p => `${p.slice(4, 8)}-05-30` <= '2026-09-30' && /^Mar \d{4}$/.test(p));
const RL = SCR.periods.filter((_, i) => keepR[i]).map(p => 'FY' + p.slice(6, 8));
const RR = k => SCR.rows[k].filter((_, i) => keepR[i]);
const SRC = { co: 'Company filings, Screener.in (consolidated), GAM Research' };
const n0 = v => Math.round(v).toLocaleString('en-IN');
const ix = fy => MOD.labels.indexOf(fy);
const sum = (k, a, z) => MOD[k].slice(ix(a), ix(z) + 1).reduce((s, x) => s + (x || 0), 0);
const cash = { cfo1: sum('cfo', 'FY21', 'FY23'), cfo2: sum('cfo', 'FY24', 'FY26'), cx1: sum('capex', 'FY21', 'FY23'), cx2: sum('capex', 'FY24', 'FY26'), dv1: Math.abs(sum('dividendsPaid', 'FY21', 'FY23')), dv2: Math.abs(sum('dividendsPaid', 'FY24', 'FY26')) };
const e = fy => n0(MOD.ebitda[ix(fy)]), p = fy => n0(MOD.pat[ix(fy)]);

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'EBITDA of ₹11,000-44,000 cr: two good years, two bad ones, and a loss in Q1FY27',
  blocks: [
    { p: `BPCL's revenue follows the crude price (₹2.3 lakh cr in FY21, ₹4.7 lakh cr in FY23, ₹4.6 lakh cr in FY26, net of excise), so revenue growth says little. What matters is the margin per tonne, and it swings with refining margins (GRM) and with how far the Government lets retail prices follow crude. EBITDA was ₹${e('FY22')} cr in FY22, ₹${e('FY23')} cr in FY23 (retail prices held after the Ukraine war), ₹${e('FY24')} cr in FY24 (crude fell, prices did not), ₹${e('FY25')} cr in FY25 (GRM fell to US$6.8/bbl) and ₹${e('FY26')} cr in FY26 (GRM US$11.7). Profit went ₹${p('FY22')} → ${p('FY23')} → ${p('FY24')} → ${p('FY25')} → ${p('FY26')} cr. FY23 was a trough, FY25 a half-trough, and Q1FY27 (a loss) starts another.` },
    { pair: [
      { type: 'column', title: 'EBITDA swings between ~₹11,000 and ~₹44,000 cr', unit: 'EBITDA (₹ crore)', x: 'fin.labels', from: 'FY19', to: 'FY29E', series: [{ name: 'EBITDA', ref: 'fin.ebitda', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'column', title: 'Net profit: ₹25,843 cr in FY26, a loss in Q1FY27', unit: 'Net profit (₹ crore)', x: 'fin.labels', from: 'FY19', to: 'FY29E', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: 2-10%; mid-cycle ~6-7%', unit: 'EBITDA margin (%), on net sales', x: 'fin.labels', from: 'FY19', to: 'FY29E', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 0, max: 12, source: SRC.co },
      { type: 'column', title: 'Revenue tracks crude, not volumes', unit: 'Net sales (₹ crore)', x: 'fin.labels', from: 'FY19', to: 'FY29E', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'none', source: SRC.co },
    ] },
    { callout: '**Our view:** BPCL has no "normal" year to forecast from; the right base is a cycle average. Over FY22-FY26 downstream EBITDA averaged ~₹5,590 per tonne sold in India (₹2,260 in FY23, ₹8,640 in FY24). We forecast ₹3,600/t for FY27E (Q1 was about −₹2,800/t), then ₹5,400/t and ₹5,500/t: a little below the five-year average, because the 2026 war showed again that marketing margins are a policy decision.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capex & returns', kicker: 'Capital allocation', title: 'A ₹1.7 lakh cr capex plan starts as cash is squeezed; ROE 4-42% with the cycle',
  blocks: [
    { p: `Over FY24-FY26 BPCL generated ₹${n0(cash.cfo2)} cr of operating cash and spent ₹${n0(cash.cx2)} cr on capex and ₹${n0(cash.dv2)} cr on dividends; over FY21-FY23 ₹${n0(cash.cfo1)} cr, ₹${n0(cash.cx1)} cr and ₹${n0(cash.dv1)} cr. For three years capex was modest (₹8,000-10,000 cr) and net debt fell to ₹6,527 cr at Mar-26 (after counting investments at book). That is changing: "Project Aspire" plans ~₹1.7 lakh cr over FY24-FY29 (refineries and petchem ₹75,000 cr, upstream ₹32,000 cr, gas ₹25,000 cr, marketing ₹20,000 cr), led by the ₹49,800 cr Bina refinery expansion and petchem complex (2028). FY27 capex is guided at ₹25,000 cr, against FY26's ₹20,400 cr. A 9 MMTPA refinery-petchem complex in Andhra Pradesh (~₹95,000 cr) is in pre-project work. Management says group debt/equity will peak below 1x. Returns follow the cycle: ROE ${n0(MOD.roe[ix('FY23')])}% in FY23, ${n0(MOD.roe[ix('FY24')])}% in FY24, ${n0(MOD.roe[ix('FY25')])}% in FY25, ${n0(MOD.roe[ix('FY26')])}% in FY26.` },
    { pair: [
      { type: 'column', title: 'Operating cash vs capex: capex now rising', unit: '₹ crore', x: 'A.labels', from: 'FY21', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }], labels: 'none', source: SRC.co },
      { type: 'line', title: 'ROCE: 7% in FY23, 26-32% in good years', unit: 'Return on capital employed (%), Screener basis', x: RL, series: [{ name: 'ROCE', values: RR('ROCE %'), fmt: 'pct0' }], labels: 'all', min: 0, max: 35, source: 'Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went (₹ crore)', head: ['', 'FY21-23', 'FY24-26', 'Six years'], rows: [
      ['Cash from operations', n0(cash.cfo1), n0(cash.cfo2), n0(cash.cfo1 + cash.cfo2)],
      ['Capex', n0(cash.cx1), n0(cash.cx2), n0(cash.cx1 + cash.cx2)],
      ['Dividends paid', n0(cash.dv1), n0(cash.dv2), n0(cash.dv1 + cash.dv2)],
      { hl: true, cells: ['**Left over**', `**${n0(cash.cfo1 - cash.cx1 - cash.dv1)}**`, `**${n0(cash.cfo2 - cash.cx2 - cash.dv2)}**`, `**${n0(cash.cfo1 + cash.cfo2 - cash.cx1 - cash.cx2 - cash.dv1 - cash.dv2)}**`] },
      ['Memo: borrowings incl. leases at the end', '69,376 (Mar-23)', '54,424 (Mar-26)', ''],
    ], source: 'Screener.in cash flow (consolidated). Investments in JVs and BPRL\'s upstream are on top.' } },
    { callout: '**The capital question:** for three years BPCL was a cash machine; from FY27 it becomes a builder again, into petrochemicals (where Indian peers earned 2-3% margins in FY23-FY25), upstream (Brazil impaired twice) and possibly a new refinery. A PSU also has policy roles (energy security, LPG access) that a private refiner would not take on.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & debt', kicker: 'Balance sheet', title: 'Net debt only ~₹6,500 cr at Mar-26 after investments; standalone debt +₹6,900 cr in Q1FY27',
  blocks: [
    { p: 'At Mar-2026 consolidated borrowings were ₹54,424 cr including ₹10,943 cr of leases (₹43,482 cr excluding leases, of which only ₹10,480 cr at the standalone company: most of the rest funds BPRL\'s upstream projects), against ₹17,761 cr of cash and ₹30,136 cr of investments (Petronet LNG and IGL at equity value ₹5,371 cr, Oil India at fair value ₹1,907 cr, BPRL\'s upstream JVs ₹16,259 cr, CGD and other JVs). Net of all investments, debt was ~₹6,500 cr. In Q1FY27 standalone debt rose to ₹17,396 cr (excluding leases; debt/equity 0.19x vs 0.11x) as the marketing loss and working capital absorbed cash. Off balance sheet: a negative LPG buffer of ₹15,804 cr at Jun-2026 (losses not yet compensated) and contingent claims.' },
    { pair: [
      { type: 'column', title: 'Net debt (after investments at book) fell to ~₹6,500 cr in FY26', unit: 'Net debt (₹ crore)', x: 'A.labels', from: 'FY20', series: [{ name: 'Net debt', ref: 'A.netDebt', fmt: 'num' }], labels: 'all', source: SRC.co + '. Borrowings incl. leases less cash and investments.' },
      { type: 'line', title: 'Inventory days 32-52: working capital follows crude', unit: 'Days', x: RL, series: [{ name: 'Inventory days', values: RR('Inventory Days'), fmt: 'num' }, { name: 'Payable days', values: RR('Days Payable'), fmt: 'num' }], labels: 'last', source: 'Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-23', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth', '{{A.netWorth.8|num}}', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}'],
      ['Borrowings incl. leases', '{{A.borrowings.8|num}}', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}'],
      ['Cash and equivalents', '{{A.cash.8|num}}', '{{A.cash.9|num}}', '{{A.cash.10|num}}', '{{A.cash.11|num}}'],
      ['Investments (stakes, JVs)', '{{A.investments.8|num}}', '{{A.investments.9|num}}', '{{A.investments.10|num}}', '{{A.investments.11|num}}'],
      ['Net fixed assets', '{{A.fixedAssets.8|num}}', '{{A.fixedAssets.9|num}}', '{{A.fixedAssets.10|num}}', '{{A.fixedAssets.11|num}}'],
      ['Capital work in progress', '{{A.cwip.8|num}}', '{{A.cwip.9|num}}', '{{A.cwip.10|num}}', '{{A.cwip.11|num}}'],
      ['Inventories', '{{A.inventories.8|num}}', '{{A.inventories.9|num}}', '{{A.inventories.10|num}}', '{{A.inventories.11|num}}'],
    ], source: SRC.co + '. Investments: AR FY26 consolidated notes 7-8. Q1FY27 standalone debt from the Q1 handout (22-Jul-2026).' } },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: the Government 52.98%; foreign funds 16.8%, Indian institutions 21.1%',
  blocks: [
    { pair: [
      { type: 'line', title: 'Foreign funds 14.6% → 19.6% → 16.8%; Indian institutions ~19-22%', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'About 1.05 million shareholders', unit: 'Number of shareholders', x: 'SH.periods', series: [{ name: 'Shareholders', ref: 'SH.rows.No. of Shareholders', fmt: 'num' }], labels: 'ends', source: 'BSE shareholding pattern, Screener.in' },
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
      { key: 'otherIncome', name: 'Other income (incl. JV share; Screener adds exceptional items)' },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit', hl: true, flag: { type: 'pct', th: 40 } },
      { key: 'eps', name: 'EPS (₹, 427 cr shares)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' },
      { key: 'capex', name: 'Capex' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 20 }, hl: true },
      { key: 'ebitda', name: 'EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' },
      { key: 'otherIncome', name: 'Other income (incl. JV share, exceptional items)' },
      { key: 'dep', name: 'Depreciation' },
      { key: 'pat', name: 'Net profit', hl: true },
    ] } },
  ],
};

const statementNotes = {};

module.exports = { financials, capital, balance, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  require('./BPCL.val').syncVal();
  const B = fs.existsSync(path.join(__dirname, 'BPCL.research.js')) ? require('./BPCL.research') : null;
  const report = {
    symbol: 'BPCL', listing: 'NSE: BPCL · BSE: 500547', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Oil, Gas & Consumable Fuels',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
