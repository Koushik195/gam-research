// Authoring source for the Indian Oil Corporation initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated; IOC.patch.js puts profit on the
// owners' basis, EPS on 1,377.16 cr shares and adds CWIP spending to capex). Part B (IOC.research.js + part2-6, shared
// IOC.ctx.js) adds the research chapters. IOC.val.js first writes the derived SOTP inputs into assumptions.json.
// Usage: node tools/authoring/IOC.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'IOC', 'research');
const SCR = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8')).tables.ratios;
const MOD = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'models', 'IOC.json'), 'utf8')).annual;
const keepR = SCR.periods.map(p => `${p.slice(4, 8)}-05-30` <= '2026-09-30' && /^Mar \d{4}$/.test(p));
const RL = SCR.periods.filter((_, i) => keepR[i]).map(p => 'FY' + p.slice(6, 8));
const RR = k => SCR.rows[k].filter((_, i) => keepR[i]);
const SRC = { co: 'Company filings, Screener.in (consolidated), GAM Research' };
const n0 = v => Math.round(v).toLocaleString('en-IN');
const ix = fy => MOD.labels.indexOf(fy);
const sum = (k, a, z) => MOD[k].slice(ix(a), ix(z) + 1).reduce((s, x) => s + (x || 0), 0);
const cash = { cfo1: sum('cfo', 'FY21', 'FY23'), cfo2: sum('cfo', 'FY24', 'FY26'), cx1: sum('capex', 'FY21', 'FY23'), cx2: sum('capex', 'FY24', 'FY26'), dv1: Math.abs(sum('dividendsPaid', 'FY21', 'FY23')), dv2: Math.abs(sum('dividendsPaid', 'FY24', 'FY26')) };

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Boom, bust, boom, bust, boom: EBITDA of ₹31,000-77,000 cr in alternate years',
  blocks: [
    { p: `IOC's revenue follows the crude price (₹3.6 lakh cr in FY21, ₹8.4 lakh cr in FY23, ₹7.8 lakh cr in FY26, net of excise), so revenue growth says little. What matters is the margin per tonne, and it swings with two things IOC does not control: refining margins (cracks) and how far the government lets retail prices follow crude. EBITDA was ₹${n0(MOD.ebitda[ix('FY22')])} cr in FY22, ₹${n0(MOD.ebitda[ix('FY23')])} cr in FY23 (retail prices held while crude spiked after the Ukraine war), ₹${n0(MOD.ebitda[ix('FY24')])} cr in FY24 (crude fell, prices did not), ₹${n0(MOD.ebitda[ix('FY25')])} cr in FY25 (refining margins collapsed to US$4.80/bbl) and ₹${n0(MOD.ebitda[ix('FY26')])} cr in FY26. Profit attributable to shareholders went ₹25,102 → 9,792 → 41,730 → 13,598 → 42,096 cr. Two of the last five years were troughs; Q1FY27 (a loss) starts a third.` },
    { pair: [
      { type: 'column', title: 'EBITDA alternates between ~₹35,000 and ~₹77,000 cr', unit: 'EBITDA (₹ crore)', x: 'fin.labels', from: 'FY19', to: 'FY29E', series: [{ name: 'EBITDA', ref: 'fin.ebitda', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'column', title: 'Net profit to shareholders: ₹42,096 cr in FY26, a loss in Q1FY27', unit: 'Net profit, owners (₹ crore)', x: 'fin.labels', from: 'FY19', to: 'FY29E', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: 3.6-11%; mid-cycle ~7-8%', unit: 'EBITDA margin (%), on net sales', x: 'fin.labels', from: 'FY19', to: 'FY29E', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 0, max: 12, source: SRC.co },
      { type: 'column', title: 'Revenue tracks crude, not volumes', unit: 'Net sales (₹ crore)', x: 'fin.labels', from: 'FY19', to: 'FY29E', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'none', source: SRC.co },
    ] },
    { callout: '**Our view:** IOC has no "normal" year to forecast from; the right base is a cycle average. Over FY22-FY26 petroleum-segment EBITDA averaged ~₹5,950 per tonne sold (₹3,800 in trough years, ₹8,300-8,600 in good years). We forecast ₹3,800/t for FY27E (Q1 was close to zero before inventory gains), then ₹5,600/t and ₹5,900/t as the expansions add volume, i.e. slightly below the five-year average because the 2026 war showed again that marketing margins are a policy decision.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capex & returns', kicker: 'Capital allocation', title: 'Capex of ₹28,000-37,000 cr a year has absorbed almost all the cash; ROE 6-30% with the cycle',
  blocks: [
    { p: `Over FY24-FY26 IOC generated ₹${n0(cash.cfo2)} cr of operating cash and spent ₹${n0(cash.cx2)} cr on capex and ₹${n0(cash.dv2)} cr on dividends; over FY21-FY23 ₹${n0(cash.cfo1)} cr, ₹${n0(cash.cx1)} cr and ₹${n0(cash.dv1)} cr. The money went into the Panipat (15→25 MMTPA), Gujarat (13.7→18) and Barauni (6→9) refinery expansions, the Paradip PX-PTA complex and pipelines: ~₹90,000 cr of projects due to be commissioned by Dec-2026. Management does not plan a pause: it guides ₹30,000-40,000 cr a year for another 2-3 years (petrochemicals ~₹1 lakh cr over 5-6 years, renewables, CBG, SAF, ships). Returns follow the cycle: ROE 22.7% in FY26 and 8.7% in FY25 (standalone), 29.8% in FY24 and 7.1% in FY23.` },
    { pair: [
      { type: 'column', title: 'Operating cash vs capex: the gap is the cycle', unit: '₹ crore', x: 'A.labels', from: 'FY21', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex (incl. CWIP)', ref: 'A.capex', fmt: 'num' }], labels: 'none', source: SRC.co + '. Capex = fixed assets purchased + capital work in progress (cash flow).' },
      { type: 'line', title: 'ROCE: 7% in trough years, ~20% in good ones', unit: 'Return on capital employed (%), Screener basis', x: RL, series: [{ name: 'ROCE', values: RR('ROCE %'), fmt: 'pct0' }], labels: 'all', min: 0, max: 25, source: 'Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went (₹ crore)', head: ['', 'FY21-23', 'FY24-26', 'Six years'], rows: [
      ['Cash from operations', n0(cash.cfo1), n0(cash.cfo2), n0(cash.cfo1 + cash.cfo2)],
      ['Capex (incl. capital work in progress)', n0(cash.cx1), n0(cash.cx2), n0(cash.cx1 + cash.cx2)],
      ['Dividends paid', n0(cash.dv1), n0(cash.dv2), n0(cash.dv1 + cash.dv2)],
      { hl: true, cells: ['**Left over**', `**${n0(cash.cfo1 - cash.cx1 - cash.dv1)}**`, `**${n0(cash.cfo2 - cash.cx2 - cash.dv2)}**`, `**${n0(cash.cfo1 + cash.cfo2 - cash.cx1 - cash.cx2 - cash.dv1 - cash.dv2)}**`] },
      ['Memo: borrowings incl. leases at the end', '1,48,977 (Mar-23)', '1,31,822 (Mar-26)', ''],
    ], source: 'Screener.in cash flow (consolidated); capex adds the capital-work-in-progress line (IOC.patch.js). Investments in JVs (₹622-6,364 cr a year) are on top.' } },
    { callout: '**The capital question:** the expansions should lift group refining capacity from 80.75 to ~98 MMTPA, but the returns depend on margins IOC cannot fix, and the next ₹1 lakh cr goes into petrochemicals, where IOC earned 2-3% EBITDA margins in FY23-FY25. A PSU also has policy roles (energy security, strategic reserves, LPG access) that a private refiner would not take on.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & debt', kicker: 'Balance sheet', title: 'Net debt ~₹54,000 cr at Mar-26 after ₹73,000 cr of investments; borrowings +₹31,000 cr in Q1FY27',
  blocks: [
    { p: 'At Mar-2026 consolidated borrowings were ₹1,31,822 cr including ₹11,733 cr of leases, against ₹4,415 cr of cash and ₹73,298 cr of investments (listed stakes in ONGC, GAIL and Oil India at fair value ₹34,157 cr; Petronet LNG and ~30 other joint ventures at equity value ₹25,009 cr; ₹6,185 cr of government securities; other ₹7,947 cr). Net of all investments, debt was ~₹54,000 cr; net of cash only, ~₹1,27,000 cr. Working capital swings with crude: in Q1FY27 standalone borrowings rose from ₹1,10,668 cr to ₹1,41,453 cr (gross debt/equity 0.71x) as inventories were carried at war prices. Off balance sheet: a negative LPG buffer (under-recoveries not yet compensated) of ₹29,730 cr at Jun-2026, and contingent tax and other claims.' },
    { pair: [
      { type: 'column', title: 'Net debt (after investments at book) fell to ~₹54,000 cr in FY26', unit: 'Net debt (₹ crore)', x: 'A.labels', from: 'FY20', series: [{ name: 'Net debt', ref: 'A.netDebt', fmt: 'num' }], labels: 'all', source: SRC.co + '. Borrowings incl. leases less cash and investments.' },
      { type: 'line', title: 'Inventory days 60-110: working capital follows crude', unit: 'Days (of revenue)', x: RL, series: [{ name: 'Inventory days', values: RR('Inventory Days'), fmt: 'num' }, { name: 'Payable days', values: RR('Days Payable'), fmt: 'num' }], labels: 'last', source: 'Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-23', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth (owners)', '{{A.netWorth.8|num}}', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}'],
      ['Borrowings incl. leases', '{{A.borrowings.8|num}}', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}'],
      ['Cash and equivalents', '{{A.cash.8|num}}', '{{A.cash.9|num}}', '{{A.cash.10|num}}', '{{A.cash.11|num}}'],
      ['Investments (stakes, JVs, government securities)', '{{A.investments.8|num}}', '{{A.investments.9|num}}', '{{A.investments.10|num}}', '{{A.investments.11|num}}'],
      ['Net fixed assets', '{{A.fixedAssets.8|num}}', '{{A.fixedAssets.9|num}}', '{{A.fixedAssets.10|num}}', '{{A.fixedAssets.11|num}}'],
      ['Capital work in progress', '{{A.cwip.8|num}}', '{{A.cwip.9|num}}', '{{A.cwip.10|num}}', '{{A.cwip.11|num}}'],
      ['Inventories', '{{A.inventories.8|num}}', '{{A.inventories.9|num}}', '{{A.inventories.10|num}}', '{{A.inventories.11|num}}'],
    ], source: SRC.co + '. Investments: AR FY26 consolidated note 4. Q1FY27 standalone borrowings from the Q1 call (1-Aug-2026).' } },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: the Government 51.5%, ONGC and Oil India 19.4%, LIC 6%; free float ~23%',
  blocks: [
    { pair: [
      { type: 'line', title: 'Foreign funds 7.5% → 9.8% → 9.1%; Indian institutions ~9-10%', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'About 2.9 million shareholders', unit: 'Number of shareholders', x: 'SH.periods', series: [{ name: 'Shareholders', ref: 'SH.rows.No. of Shareholders', fmt: 'num' }], labels: 'ends', source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY19–FY29E (consolidated; profit and EPS to owners)', rows: [
      { key: 'sales', name: 'Revenue (net of excise)', flag: { type: 'pct', th: 20 }, hl: true },
      { key: 'ebitda', name: 'EBITDA', hl: true, flag: { type: 'pct', th: 40 } },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 250 } },
      { key: 'dep', name: 'Depreciation' },
      { key: 'otherIncome', name: 'Other income (incl. JV share; Screener adds exceptional items)' },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit (owners)', hl: true, flag: { type: 'pct', th: 40 } },
      { key: 'eps', name: 'EPS (₹, 1,377 cr shares)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' },
      { key: 'capex', name: 'Capex (incl. CWIP)' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 20 }, hl: true },
      { key: 'ebitda', name: 'EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' },
      { key: 'otherIncome', name: 'Other income (incl. JV share)' },
      { key: 'dep', name: 'Depreciation' },
      { key: 'pat', name: 'Net profit (owners)', hl: true },
    ] } },
  ],
};

const statementNotes = {};

module.exports = { financials, capital, balance, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  require('./IOC.val').syncVal();
  const B = fs.existsSync(path.join(__dirname, 'IOC.research.js')) ? require('./IOC.research') : null;
  const report = {
    symbol: 'IOC', listing: 'NSE: IOC · BSE: 530965', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Oil, Gas & Consumable Fuels',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
