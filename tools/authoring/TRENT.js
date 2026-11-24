// Authoring source for the Trent initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated). Part B (TRENT.research.js +
// part2-6, shared TRENT.ctx.js) adds the research chapters. TRENT.val.js first syncs the derived multiples into
// assumptions.json. Usage: node tools/authoring/TRENT.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'TRENT', 'research');
const ROOT = path.join(__dirname, '..', '..');
const SCR = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8')).tables.ratios;
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'TRENT.json'), 'utf8'));
const C = JSON.parse(fs.readFileSync(path.join(RD, 'company.json'), 'utf8'));
const A = M.annual, ix = l => A.labels.indexOf(l);
const keepR = SCR.periods.map(p => /^Mar 20(1[6-9]|2\d)$/.test(p) && `${p.slice(-4)}-05-30` <= '2026-09-30');
const RL = SCR.periods.filter((_, i) => keepR[i]).map(p => 'FY' + p.slice(-2));
const RR = k => SCR.rows[k].filter((_, i) => keepR[i]);
const SRC = { co: 'Company filings, Screener.in (consolidated), GAM Research' };
const n0 = v => Math.round(v).toLocaleString('en-IN');
const sum = (k, a, z) => A[k].slice(ix(a), ix(z) + 1).reduce((s, x) => s + (x || 0), 0);
const cagr = (k, a, z, y) => (Math.pow(A[k][ix(z)] / A[k][ix(a)], 1 / y) - 1) * 100;
const BS = C.balanceMar26, FC = C.fy26.consolidated;
const liquid = BS.cash + BS.otherBank + BS.currentInvestments + BS.bonds + BS.gsecs + BS.preference;
const cfo = [sum('cfo', 'FY18', 'FY21'), sum('cfo', 'FY22', 'FY26')], cap = [sum('capex', 'FY18', 'FY21'), sum('capex', 'FY22', 'FY26')];
const dv = [sum('dividendsPaid', 'FY18', 'FY21'), sum('dividendsPaid', 'FY22', 'FY26')].map(Math.abs);
const yrs7 = ['FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'];

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: `Revenue ${(A.sales[ix('FY26')] / A.sales[ix('FY20')]).toFixed(1)}x in six years and the margin up to ~19%, but depreciation is now growing faster than revenue`,
  blocks: [
    { p: `Trent's consolidated revenue was ₹${n0(A.sales[ix('FY20')])} cr in FY20 and ₹${n0(A.sales[ix('FY26')])} cr in FY26 (${cagr('sales', 'FY20', 'FY26', 6).toFixed(0)}% a year), almost all from Zudio's store roll-out (233 stores in FY22, 963 in FY26) and a steadier Westside. The EBITDA margin rose from ${A.ebitdaMargin[ix('FY22')].toFixed(1)}% in FY22 to ${A.ebitdaMargin[ix('FY26')].toFixed(1)}% in FY26 as scale, RFID-led manpower savings and a better gross margin came through. Two things make the profit line harder to read. FY24 profit (₹${n0(A.pat[ix('FY24')])} cr) includes a one-off ₹439 cr after-tax gain from reassessing lease terms, so FY25 growth looks flat. And rent sits below EBITDA under Ind AS 116: depreciation (mostly on leased stores) rose from ₹${n0(A.dep[ix('FY24')])} cr in FY24 to ₹${n0(A.dep[ix('FY26')])} cr in FY26 (${(A.dep[ix('FY26')] / A.sales[ix('FY26')] * 100).toFixed(1)}% of revenue, from ${(A.dep[ix('FY25')] / A.sales[ix('FY25')] * 100).toFixed(1)}%), so FY26 net profit grew ${A.patGrowth[ix('FY26')].toFixed(0)}% while EBITDA grew ${A.ebitdaGrowth[ix('FY26')].toFixed(0)}%.` },
    { pair: [
      { type: 'column', title: `Revenue: ₹${n0(A.sales[ix('FY26')])} cr in FY26, ~6x FY20`, unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'line', title: 'EBITDA margin: from 13% (FY22) to ~19% (FY26)', unit: 'EBITDA margin, Ind AS (%)', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 0, max: 25, source: SRC.co + '. FY20 onwards under Ind AS 116 (rent below EBITDA).' },
    ] },
    { pair: [
      { type: 'column', title: 'Net profit: FY24 flattered by a ₹439 cr lease gain', unit: 'Net profit (₹ crore)', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.co + ' (FY24 includes the exceptional lease-reassessment gain; FY26 a ₹26 cr labour-code charge)' },
      { type: 'column', title: 'Depreciation and finance cost as % of revenue: depreciation is climbing again', unit: '% of revenue', x: yrs7, series: [{ name: 'Depreciation', values: yrs7.map(y => Math.round(A.dep[ix(y)] / A.sales[ix(y)] * 1000) / 10), fmt: 'pct' }, { name: 'Finance cost', values: yrs7.map(y => Math.round(A.interest[ix(y)] / A.sales[ix(y)] * 1000) / 10), fmt: 'pct' }], labels: 'all', source: SRC.co },
    ] },
    { callout: '**Our view:** Trent has been one of India\'s fastest-compounding retailers, and its margin gains are real (gross margin and staff productivity). But the easy part of the margin story is behind it (management: the manpower-efficiency cycle has "largely been realised"), and the growth is now space-led with falling sales per sq ft. That shows up as depreciation outgrowing revenue, which caps how fast EPS can grow even if EBITDA keeps rising ~20% a year.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capex & returns', kicker: 'Capital allocation', title: 'Self-funded growth on leased stores: high returns, but the cheque book is getting bigger (and a ₹2,500 cr raise is approved)',
  blocks: [
    { p: `Trent leases almost all its stores, so the cash it puts into a new store is fit-out, deposits and inventory (₹3-4 cr for a Zudio), and rent is paid over the lease. That keeps returns high: ROE ${A.roe[ix('FY26')].toFixed(0)}% in FY26 (${A.roe[ix('FY25')].toFixed(0)}% in FY25; FY24's ${A.roe[ix('FY24')].toFixed(0)}% was flattered by the one-off), and management reports operating ROCE of over 29%. Over FY22-26 operating cash was ₹${n0(cfo[1])} cr and cash capex ₹${n0(cap[1])} cr; on top, lease payments were ₹${n0(FC.leasePayments)} cr in FY26 alone (₹${n0(FC.leasePaymentsFY25)} cr in FY25), and right-of-use additions ₹${n0(FC.rouAdditions)} cr. Dividends are modest (₹${n0(dv[1])} cr over FY22-26, ~9% of profit). In April 2026 the board approved in principle a ~₹2,500 cr equity raise (rights issue or otherwise) to speed up store upgrades, new brands, warehousing and automation, and Star's roll-out including real estate; it had not been launched by 30-Sep-2026. We do not model it: at the 30-Sep price it would add ~1.8% to the share count.` },
    { pair: [
      { type: 'column', title: 'Operating cash has covered capex, but leases are the bigger bill', unit: '₹ crore', x: 'A.labels', from: 'FY18', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }], labels: 'none', source: SRC.co + '. Capex excludes lease payments (₹797 cr in FY26).' },
      { type: 'line', title: 'ROE ~28% and ROCE ~28-31% after the Zudio scale-up', unit: 'Return on equity and on capital employed (%)', x: RL.filter(l => l >= 'FY18'), series: [{ name: 'ROE', values: RL.filter(l => l >= 'FY18').map(l => Math.round(A.roe[ix(l)] * 10) / 10), fmt: 'pct' }, { name: 'ROCE (Screener)', values: RR('ROCE %').slice(RL.indexOf('FY18')), fmt: 'pct0' }], labels: 'last', min: -10, max: 50, source: 'Screener.in; GAM calculation (ROE on average equity; FY24 includes the lease gain)' },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went (₹ crore)', head: ['', 'FY18-21', 'FY22-26', 'Nine years'], rows: [
      ['Cash from operations', n0(cfo[0]), n0(cfo[1]), n0(cfo[0] + cfo[1])],
      ['Capex (cash, excl. leases)', n0(cap[0]), n0(cap[1]), n0(cap[0] + cap[1])],
      { hl: true, cells: ['**Free cash flow before lease payments**', `**${n0(cfo[0] - cap[0])}**`, `**${n0(cfo[1] - cap[1])}**`, `**${n0(cfo[0] + cfo[1] - cap[0] - cap[1])}**`] },
      ['Memo: lease payments FY25 / FY26', '', `${n0(FC.leasePaymentsFY25)} / ${n0(FC.leasePayments)}`, ''],
      ['Dividends paid', n0(dv[0]), n0(dv[1]), n0(dv[0] + dv[1])],
      ['Memo: borrowings incl. leases at the end of the period', n0(A.borrowings[ix('FY21')]), n0(A.borrowings[ix('FY26')]), ''],
    ], source: 'Screener.in cash flow (consolidated); AR FY26 consolidated cash flow (lease payments)' } },
    { callout: `**The capital question:** Trent\'s model needs little capital per store but a lot of stores, and every store adds a lease. Free cash flow after lease payments was only ~₹${n0(A.cfo[ix('FY26')] - A.capex[ix('FY26')] - FC.leasePayments)} cr in FY26 on ₹${n0(A.pat[ix('FY26')])} cr of profit. We model capex plus lease payments of ₹{{F.capex.0|num}} / {{F.capex.1|num}} / {{F.capex.2|num}} cr for FY27-29E and ROE of {{F.roe.0|pct}} / {{F.roe.1|pct}} / {{F.roe.2|pct}}: still excellent, but drifting down as sales per sq ft fall.` },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: `Net cash of ~₹${n0(liquid - BS.ncd)} cr before leases; ₹${n0(BS.leaseLiabilities)} cr of lease liabilities; the NCD was repaid in May-2026`,
  blocks: [
    { p: `At Mar-26 Trent held ₹${n0(liquid)} cr of cash, liquid funds, bonds and government securities against a ₹${n0(BS.ncd)} cr 5.78% NCD (repaid on 29-May-2026): net cash of ~₹${n0(liquid - BS.ncd)} cr before leases. Lease liabilities were ₹${n0(BS.leaseLiabilities)} cr (₹${n0(BS.leaseLiabilitiesMar25)} cr a year earlier), so net debt including leases was ~₹${n0(BS.leaseLiabilities - liquid + BS.ncd)} cr against ₹${n0(BS.equity)} cr of equity. Another ₹${n0(BS.jvInvestments)} cr sits in the equity-accounted Star JV and Inditex associates. Inventory (₹${n0(BS.inventories)} cr, ~${Math.round(A.inventoryDays[ix('FY26')])} days) has come down from ~128 days in FY22 as inventory turns rose to 5.1x; payables are ~${Math.round(A.payableDays[ix('FY26')])} days. Contingent liabilities are small (₹${n0(BS.contingent.incomeTax + BS.contingent.indirectTax + BS.contingent.claims)} cr, mostly income tax).` },
    { pair: [
      { type: 'line', title: 'Inventory days down from ~128 to ~74', unit: 'Days', x: RL, series: [{ name: 'Inventory days', values: RR('Inventory Days'), fmt: 'num' }, { name: 'Payable days', values: RR('Days Payable'), fmt: 'num' }], labels: 'last', source: 'Screener.in' },
      { type: 'column', title: 'Net debt incl. leases: ~₹900 cr (Screener basis)', unit: 'Net debt incl. lease liabilities (₹ crore; negative = net cash)', x: 'A.labels', from: 'FY18', series: [{ name: 'Net debt', ref: 'A.netDebt', fmt: 'num' }], labels: 'all', source: SRC.co + '. Screener counts the JV/associate investments as cash; excluding them, net debt incl. leases was ~₹1,400 cr at Mar-26.' },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-21', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth', '{{A.netWorth.6|num}}', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}'],
      ['Borrowings incl. leases', '{{A.borrowings.6|num}}', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}'],
      ['Cash and investments (incl. JV stakes)', '{{A.cashAndInvestments.6|num}}', '{{A.cashAndInvestments.9|num}}', '{{A.cashAndInvestments.10|num}}', '{{A.cashAndInvestments.11|num}}'],
      ['Net fixed assets (incl. right-of-use)', '{{A.fixedAssets.6|num}}', '{{A.fixedAssets.9|num}}', '{{A.fixedAssets.10|num}}', '{{A.fixedAssets.11|num}}'],
      ['Inventories', '{{A.inventories.6|num}}', '{{A.inventories.9|num}}', '{{A.inventories.10|num}}', '{{A.inventories.11|num}}'],
      ['Trade payables', '{{A.payables.6|num}}', '{{A.payables.9|num}}', '{{A.payables.10|num}}', '{{A.payables.11|num}}'],
    ], source: SRC.co + '. Borrowings include lease liabilities (₹2,061 cr at Mar-26) and the ₹500 cr NCD. In forecasts the model\'s "treasury" line is net cash incl. leases (negative = net debt).' } },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: Tata Sons group 37%; foreign funds halved their stake in two years while domestic funds bought',
  blocks: [
    { pair: [
      { type: 'line', title: 'FIIs from ~28% to ~15%; DIIs from ~13% to ~23%', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoter holding flat at 37.01%', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 0, max: 50, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY15–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 30 }, hl: true },
      { key: 'ebitda', name: 'EBITDA', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 150 } },
      { key: 'dep', name: 'Depreciation', flag: { type: 'pct', th: 40 } },
      { key: 'otherIncome', name: 'Other income', flag: { type: 'pct', th: 60 } },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit', hl: true, flag: { type: 'pct', th: 30 } },
      { key: 'eps', name: 'EPS (₹)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' },
      { key: 'capex', name: 'Capex' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L (as reported by 30-Sep-2026)', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 22 }, hl: true },
      { key: 'ebitda', name: 'EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' },
      { key: 'otherIncome', name: 'Other income' },
      { key: 'interest', name: 'Finance cost' },
      { key: 'dep', name: 'Depreciation' },
      { key: 'pat', name: 'Net profit', hl: true },
    ] } },
  ],
};

const statementNotes = {};

module.exports = { financials, capital, balance, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  require('./TRENT.val').syncMultiples();
  const B = fs.existsSync(path.join(__dirname, 'TRENT.research.js')) ? require('./TRENT.research') : null;
  const report = {
    symbol: 'TRENT', listing: 'NSE: TRENT · BSE: 500251', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Consumer services (retail)',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
