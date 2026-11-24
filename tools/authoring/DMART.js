// Authoring source for the DMart (Avenue Supermarts) initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated). Part B (DMART.research.js +
// part2-6, shared DMART.ctx.js) adds the research chapters. DMART.val.js first syncs the derived multiples into
// assumptions.json. Usage: node tools/authoring/DMART.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'DMART', 'research');
const ROOT = path.join(__dirname, '..', '..');
const SCR = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8')).tables.ratios;
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'DMART.json'), 'utf8'));
const C = JSON.parse(fs.readFileSync(path.join(RD, 'company.json'), 'utf8'));
const A = M.annual, ix = l => A.labels.indexOf(l);
const keepR = SCR.periods.map(p => /^Mar 20(1[6-9]|2\d)$/.test(p) && `${p.slice(-4)}-05-30` <= '2026-09-30');
const RL = SCR.periods.filter((_, i) => keepR[i]).map(p => 'FY' + p.slice(-2));
const RR = k => SCR.rows[k].filter((_, i) => keepR[i]);
const SRC = { co: 'Company filings, Screener.in (consolidated), GAM Research' };
const n0 = v => Math.round(v).toLocaleString('en-IN');
const sum = (k, a, z) => A[k].slice(ix(a), ix(z) + 1).reduce((s, x) => s + (x || 0), 0);
const cagr = (k, a, z, y) => (Math.pow(A[k][ix(z)] / A[k][ix(a)], 1 / y) - 1) * 100;
const BS = C.balanceMar26, mg = A.ebitdaMargin.slice(ix('FY18'), ix('FY26') + 1);
const cfo = [sum('cfo', 'FY18', 'FY21'), sum('cfo', 'FY22', 'FY26')], cap = [sum('capex', 'FY18', 'FY21'), sum('capex', 'FY22', 'FY26')];

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: `Revenue ${(A.sales[ix('FY26')] / A.sales[ix('FY20')]).toFixed(1)}x in six years at a steady ~8% EBITDA margin; profit growth has lagged since FY23`,
  blocks: [
    { p: `DMart's consolidated revenue was ₹${n0(A.sales[ix('FY20')])} cr in FY20 and ₹${n0(A.sales[ix('FY26')])} cr in FY26 (${cagr('sales', 'FY20', 'FY26', 6).toFixed(1)}% a year), almost all from new stores: retail area went from 7.8 mn to 20.6 mn sq ft. The EBITDA margin is remarkably stable, ${Math.min(...mg).toFixed(1)}-${Math.max(...mg).toFixed(1)}% since FY18, because DMart chooses to hand cost savings back to customers (gross margin is held at 14-15%). What has changed is the line below EBITDA: depreciation rose from ₹${n0(A.dep[ix('FY23')])} cr in FY23 to ₹${n0(A.dep[ix('FY26')])} cr in FY26 and finance cost doubled in FY26 (more leased stores, first commercial paper), while other income fell as cash was spent. So net profit grew only ${cagr('pat', 'FY23', 'FY26', 3).toFixed(1)}% a year over FY23-26 against revenue growth of ${cagr('sales', 'FY23', 'FY26', 3).toFixed(1)}%. FY23 and FY25 profit include one-off tax gains of ₹138.8 cr and ₹36.0 cr.` },
    { pair: [
      { type: 'column', title: `Revenue: ₹${n0(A.sales[ix('FY26')])} cr in FY26; only FY21 (Covid) broke the run`, unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'line', title: 'EBITDA margin: a flat 7.5-9% band by design', unit: 'EBITDA margin (%)', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 0, max: 12, source: SRC.co },
    ] },
    { pair: [
      { type: 'column', title: 'Net profit: growth slowed to ~8% a year after FY23', unit: 'Net profit (₹ crore)', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.co + ' (FY23 and FY25 include one-off tax gains)' },
      { type: 'column', title: 'Depreciation and finance cost are rising faster than revenue', unit: '% of revenue', x: ['FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'], series: [{ name: 'Depreciation', values: ['FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'].map(y => Math.round(A.dep[ix(y)] / A.sales[ix(y)] * 1000) / 10), fmt: 'pct' }, { name: 'Finance cost', values: ['FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'].map(y => Math.round(A.interest[ix(y)] / A.sales[ix(y)] * 1000) / 10), fmt: 'pct' }], labels: 'all', source: SRC.co },
    ] },
    { callout: '**Our view:** DMart is a volume machine with a fixed margin. Growth comes from opening stores, not from squeezing more out of each rupee of sales. That is a strength (customers trust the prices) and a limit: when same-store growth slows and new stores take longer to ramp, profit growth cannot be rescued by margin, and the rising cost of owning and now leasing stores shows up below EBITDA.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capex & returns', kicker: 'Capital allocation', title: 'Every rupee goes into stores: capex now exceeds operating cash, and returns have drifted down to ~13% ROE',
  blocks: [
    { p: `DMart buys the land and builds most of its stores (only ${C.fy26.kpi.leasedStores} of 500 were leased at Mar-26). That keeps rent out of the P&L and prices low, but it ties up capital: ₹${n0(cap[0])} cr of capex in FY18-21 and ₹${n0(cap[1])} cr in FY22-26 against ₹${n0(cfo[1])} cr of operating cash in FY22-26. FY26 capex was ₹${n0(A.capex[ix('FY26')])} cr (FY25 ₹${n0(A.capex[ix('FY25')])} cr), and ₹${n0(BS.capitalCommitments)} cr of contracts for sites under construction were still to be paid at Mar-26 (₹${n0(BS.capitalCommitmentsMar25)} cr a year earlier). It has never paid a dividend; the two equity raises (IPO 2017, QIP 2020) funded the land bank until FY25. ROE fell from ${A.roe[ix('FY23')].toFixed(1)}% in FY23 to ${A.roe[ix('FY26')].toFixed(1)}% in FY26; management's own ROCE (EBIT on capital employed net of cash) was 17.1% in FY26.` },
    { pair: [
      { type: 'column', title: 'Capex has outrun operating cash in most years', unit: '₹ crore', x: 'A.labels', from: 'FY16', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }], labels: 'none', source: SRC.co },
      { type: 'line', title: 'ROE: from 18-19% before Covid to ~13%', unit: 'Return on equity and on capital employed (%)', x: RL, series: [{ name: 'ROE', values: RL.map(l => Math.round(A.roe[ix(l)] * 10) / 10), fmt: 'pct' }, { name: 'ROCE (Screener)', values: RR('ROCE %'), fmt: 'pct0' }], labels: 'last', min: 0, max: 30, source: 'Screener.in; GAM calculation (ROE on average equity)' },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went (₹ crore)', head: ['', 'FY18-21', 'FY22-26', 'Nine years'], rows: [
      ['Cash from operations', n0(cfo[0]), n0(cfo[1]), n0(cfo[0] + cfo[1])],
      ['Capex (cash)', n0(cap[0]), n0(cap[1]), n0(cap[0] + cap[1])],
      { hl: true, cells: ['**Free cash flow**', `**${n0(cfo[0] - cap[0])}**`, `**${n0(cfo[1] - cap[1])}**`, `**${n0(cfo[0] + cfo[1] - cap[0] - cap[1])}**`] },
      ['Equity raised', '~4,100 (QIP, Feb-2020)', '–', ''],
      ['Dividends paid', '0', '0', '0'],
      ['Memo: borrowings incl. leases at the end of the period', n0(A.borrowings[ix('FY21')]), n0(A.borrowings[ix('FY26')]), ''],
    ], source: 'Screener.in cash flow (consolidated); AR FY26; QIP proceeds per Business Today (Feb-2020)' } },
    { callout: `**The capital question:** DMart\'s model is capital-hungry: FY26 capex of ₹${n0(A.capex[ix('FY26')])} cr was ~₹${Math.round(A.capex[ix('FY26')] / 85)} cr per store opened (it also buys land 2-3 years ahead), and a new store takes years to reach full throughput. At ~15% store growth a year, capex runs ahead of cash and debt rises (management: ~₹2,000 cr of borrowings by Mar-27). We model ROE of {{F.roe.0|pct}} / {{F.roe.1|pct}} / {{F.roe.2|pct}} for FY27-29E: positive economics, but no longer the 18-20% of the pre-Covid years.` },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: `No longer net cash: ₹${n0(BS.borrowings)} cr of commercial paper and ₹${n0(BS.leaseLiabilities)} cr of leases against ₹${n0(BS.cash + BS.otherBank + BS.investments)} cr of cash at Mar-26`,
  blocks: [
    { p: `Until FY25 DMart carried no debt apart from leases. In FY26 it issued commercial paper and short-term loans (₹${n0(BS.borrowings)} cr at Mar-26) and lease liabilities rose to ₹${n0(BS.leaseLiabilities)} cr (₹${n0(BS.leaseLiabilitiesMar25)} cr) as more stores were leased; cash, bank deposits and investments fell to ₹${n0(BS.cash + BS.otherBank + BS.investments)} cr. Net debt is ₹${n0(BS.borrowings - BS.cash - BS.otherBank - BS.investments)} cr before leases and ₹${n0(A.netDebt[ix('FY26')])} cr including them: tiny against ₹${n0(BS.equity)} cr of equity and ~₹5,200 cr of EBITDA (debt/equity 0.09x). Inventory is the main working-capital item: ₹${n0(BS.inventories)} cr (~${Math.round(A.inventoryDays[ix('FY26')])} days), up as more distribution centres opened; DMart pays suppliers in ~${Math.round(A.payableDays[ix('FY26')])} days on purpose, buying better prices with its own cash. Contingent liabilities are ₹${n0(BS.contingent.indirectTax + BS.contingent.incomeTax + BS.contingent.other)} cr, mostly indirect-tax disputes.` },
    { pair: [
      { type: 'line', title: 'Inventory ~35 days, payables ~8: DMart funds its own stock', unit: 'Days', x: RL, series: [{ name: 'Inventory days', values: RR('Inventory Days'), fmt: 'num' }, { name: 'Payable days', values: RR('Days Payable'), fmt: 'num' }], labels: 'last', source: 'Screener.in' },
      { type: 'column', title: 'Net debt incl. leases turned positive in FY26', unit: 'Net debt incl. lease liabilities (₹ crore; negative = net cash)', x: 'A.labels', from: 'FY16', series: [{ name: 'Net debt', ref: 'A.netDebt', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-21', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth', '{{A.netWorth.6|num}}', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}'],
      ['Borrowings incl. leases', '{{A.borrowings.6|num}}', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}'],
      ['Cash and investments', '{{A.cashAndInvestments.6|num}}', '{{A.cashAndInvestments.9|num}}', '{{A.cashAndInvestments.10|num}}', '{{A.cashAndInvestments.11|num}}'],
      ['Net fixed assets (incl. right-of-use)', '{{A.fixedAssets.6|num}}', '{{A.fixedAssets.9|num}}', '{{A.fixedAssets.10|num}}', '{{A.fixedAssets.11|num}}'],
      ['Capital work in progress', '{{A.cwip.6|num}}', '{{A.cwip.9|num}}', '{{A.cwip.10|num}}', '{{A.cwip.11|num}}'],
      ['Inventories', '{{A.inventories.6|num}}', '{{A.inventories.9|num}}', '{{A.inventories.10|num}}', '{{A.inventories.11|num}}'],
      ['Trade payables', '{{A.payables.6|num}}', '{{A.payables.9|num}}', '{{A.payables.10|num}}', '{{A.payables.11|num}}'],
    ], source: SRC.co + '. Borrowings include lease liabilities (₹1,460 cr at Mar-26). In forecasts the model\'s "treasury" line is net cash (negative = net debt).' } },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: the Damani family 74.5%, at the 75% public-float limit; institutions hold ~18%',
  blocks: [
    { pair: [
      { type: 'line', title: 'Foreign and domestic funds: ~9% each', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoter holding flat at ~74.5%', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 60, max: 80, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY15–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 25 }, hl: true },
      { key: 'ebitda', name: 'EBITDA', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 80 } },
      { key: 'dep', name: 'Depreciation' },
      { key: 'otherIncome', name: 'Other income', flag: { type: 'pct', th: 40 } },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit', hl: true, flag: { type: 'pct', th: 25 } },
      { key: 'eps', name: 'EPS (₹)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' },
      { key: 'capex', name: 'Capex' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L (as reported by 30-Sep-2026)', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 18 }, hl: true },
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
  require('./DMART.val').syncMultiples();
  const B = fs.existsSync(path.join(__dirname, 'DMART.research.js')) ? require('./DMART.research') : null;
  const report = {
    symbol: 'DMART', listing: 'NSE: DMART · BSE: 540376', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Consumer services (retail)',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
