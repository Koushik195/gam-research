// Authoring source for the Vishal Mega Mart initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated). Part B (VMM.research.js + part2-6,
// shared VMM.ctx.js) adds the research chapters. VMM.val.js first syncs the derived multiples into assumptions.json.
// Usage: node tools/authoring/VMM.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'VMM', 'research');
const ROOT = path.join(__dirname, '..', '..');
const SCR = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8')).tables.ratios;
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'VMM.json'), 'utf8'));
const C = JSON.parse(fs.readFileSync(path.join(RD, 'company.json'), 'utf8'));
const A = M.annual, ix = l => A.labels.indexOf(l);
const keepR = SCR.periods.map(p => /^Mar 20(1[6-9]|2\d)$/.test(p) && `${p.slice(-4)}-05-30` <= '2026-09-30');
const RL = SCR.periods.filter((_, i) => keepR[i]).map(p => 'FY' + p.slice(-2));
const RR = k => SCR.rows[k].filter((_, i) => keepR[i]);
const SRC = { co: 'Company filings, Screener.in (consolidated), GAM Research' };
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const sum = (k, a, z) => A[k].slice(ix(a), ix(z) + 1).reduce((s, x) => s + (x || 0), 0);
const cagr = (k, a, z, y) => (Math.pow(A[k][ix(z)] / A[k][ix(a)], 1 / y) - 1) * 100;
const BS = C.balanceMar26, F26 = C.fy26, GW = BS.goodwill;
const tangEq = l => A.netWorth[ix(l)] - GW; // goodwill unchanged since 2018
const roeExGw = l => A.pat[ix(l)] / ((tangEq(l) + tangEq(A.labels[ix(l) - 1])) / 2) * 100;
const leasePay26 = F26.leasePrincipal + F26.leaseInterest, fcfAfterLeases26 = F26.cfo - F26.capexCash - leasePay26;
const yrs = ['FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'];

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: `Revenue ${(A.sales[ix('FY26')] / A.sales[ix('FY21')]).toFixed(1)}x in five years, margin up ~1pp, profit ${Math.round(A.pat[ix('FY26')] / A.pat[ix('FY21')])}x: operating leverage on a lean, leased store base`,
  blocks: [
    { p: `Consolidated revenue was ₹${n0(A.sales[ix('FY21')])} cr in Covid-hit FY21 and ₹${n0(A.sales[ix('FY26')])} cr in FY26 (${cagr('sales', 'FY21', 'FY26', 5).toFixed(1)}% a year; ${cagr('sales', 'FY22', 'FY26', 4).toFixed(1)}% over FY22-26). Roughly half came from more selling space (9.1 mn sq ft at Mar-22, 13.45 mn at Mar-26) and half from same-store growth of 11-13% a year outside the FY23 post-Covid rebound (25%). Reported EBITDA margin moved from ${n1(A.ebitdaMargin[ix('FY22')])}% in FY22 to ${n1(A.ebitdaMargin[ix('FY26')])}% in FY26; on the company's own pre-Ind AS 116, pre-ESOP basis (rent treated as a cost) the margin rose from 8.4% in FY24 to 10.2% in FY26. Because depreciation (mostly leased-store amortisation) and lease interest grew slower than sales, net profit rose from ₹${n0(A.pat[ix('FY22')])} cr to ₹${n0(A.pat[ix('FY26')])} cr (${cagr('pat', 'FY22', 'FY26', 4).toFixed(0)}% a year). No exceptional items in any year.` },
    { pair: [
      { type: 'column', title: `Revenue: ₹${n0(A.sales[ix('FY26')])} cr in FY26, ~20% growth in each of the last three years`, unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY20', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'line', title: 'Reported EBITDA margin (after Ind AS 116): 14-15%', unit: 'EBITDA margin (%)', x: 'fin.labels', from: 'FY20', to: 'FY26', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 0, max: 20, source: SRC.co + '. Rent sits in depreciation and finance cost under Ind AS 116.' },
    ] },
    { pair: [
      { type: 'column', title: 'Net profit: ₹45 cr in FY20 to ₹839 cr in FY26', unit: 'Net profit (₹ crore)', x: 'fin.labels', from: 'FY20', to: 'FY26', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'column', title: 'Depreciation and finance cost fell as a share of revenue', unit: '% of revenue', x: yrs, series: [{ name: 'Depreciation (mostly leased stores)', values: yrs.map(y => Math.round(A.dep[ix(y)] / A.sales[ix(y)] * 1000) / 10), fmt: 'pct' }, { name: 'Finance cost (leases, bank charges)', values: yrs.map(y => Math.round(A.interest[ix(y)] / A.sales[ix(y)] * 1000) / 10), fmt: 'pct' }], labels: 'all', source: SRC.co },
    ] },
    { callout: '**Our view:** this is a growth-plus-leverage story, not a margin-expansion one. Management reinvests gross-margin gains in price, so the margin rises only because rent (escalating ~5% a year) and head office grow slower than same-store sales. That holds while SSSG stays near 10%; at 5% it would stall.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capital & returns', kicker: 'Capital allocation', title: `Asset-light: cash capex ~2.5% of revenue, ₹${n0(fcfAfterLeases26)} cr of cash left after rent in FY26; ROE ${n1(A.roe[ix('FY26')])}% reported, ~${Math.round(roeExGw('FY26'))}% excluding goodwill`,
  blocks: [
    { p: `Every store is leased, so the cash cost of growth is fit-out, DCs and IT: ₹${n0(F26.capexCash)} cr in FY26 (₹${n0(C.fy25.capexCash)} cr in FY25), ~₹3 cr per new store. The real "capex" is the lease: ₹${n0(F26.rouAdditions)} cr of new right-of-use assets were signed in FY26 and rent payments (lease principal ₹${n0(F26.leasePrincipal)} cr + interest ₹${n0(F26.leaseInterest)} cr) were ₹${n0(leasePay26)} cr. Even after rent, operating cash of ₹${n0(F26.cfo)} cr left ₹${n0(fcfAfterLeases26)} cr, which (with ₹${n0(F26.esopProceeds)} cr of ESOP proceeds) doubled cash and liquid funds to ₹${n0(BS.cash + BS.otherBank + BS.investments)} cr. No dividend has been paid. Reported ROE (${n1(A.roe[ix('FY26')])}%) is held down by ₹${n0(GW)} cr of goodwill from the 2018 buyout; on tangible equity it is ~${Math.round(roeExGw('FY26'))}%.` },
    { pair: [
      { type: 'column', title: 'Operating cash far above cash capex (rent is paid out of the CFO line\'s surplus)', unit: '₹ crore', x: 'A.labels', from: 'FY20', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Cash capex', ref: 'A.capex', fmt: 'num' }], labels: 'none', source: SRC.co + '. Lease payments are in financing cash flow.' },
      { type: 'line', title: 'ROE: reported vs excluding the ₹4,284 cr goodwill', unit: 'Return on equity (%)', x: ['FY22', 'FY23', 'FY24', 'FY25', 'FY26'], series: [{ name: 'ROE (reported)', values: ['FY22', 'FY23', 'FY24', 'FY25', 'FY26'].map(l => Math.round(A.roe[ix(l)] * 10) / 10), fmt: 'pct' }, { name: 'ROE ex-goodwill', values: ['FY22', 'FY23', 'FY24', 'FY25', 'FY26'].map(l => Math.round(roeExGw(l) * 10) / 10), fmt: 'pct' }], labels: 'last', min: 0, max: 40, source: 'Screener.in; GAM calculation (profit ÷ average equity, with and without goodwill)' },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went, FY26 (₹ crore)', head: ['Item', 'FY25', 'FY26'], rows: [
      ['Cash from operations (after tax)', n0(C.fy25.cfo), n0(F26.cfo)],
      ['Cash capex (fit-outs, DCs, IT)', `(${n0(C.fy25.capexCash)})`, `(${n0(F26.capexCash)})`],
      ['Lease payments: principal', `(${n0(C.fy25.leasePrincipal)})`, `(${n0(F26.leasePrincipal)})`],
      ['Finance cost paid (mostly lease interest)', '(149)', `(${n0(F26.interestPaid)})`],
      { hl: true, cells: ['**Cash left after capex and rent**', `**${n0(C.fy25.cfo - C.fy25.capexCash - C.fy25.leasePrincipal - 149.2)}**`, `**${n0(fcfAfterLeases26)}**`] },
      ['ESOP exercise proceeds', '90', n0(F26.esopProceeds)],
      ['Dividends', '0', '0'],
      ['Memo: new leases signed (right-of-use additions, non-cash)', '–', n0(F26.rouAdditions)],
    ], source: 'AR FY26 consolidated cash flow statement and note 3A; FY25 comparatives from the same statement' } },
    { callout: '**The capital question:** VMM needs little capital, but its rent bill is a fixed claim that grows with every store: ₹613 cr in FY26 (4.7% of revenue). We treat new leases as capex in the forecasts and the DCF, so the valuation pays for them. With no debt, rising cash and no dividend policy, a payout is a matter for the board (CEO, May-2026).' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: `No bank debt: ₹${n0(BS.cash + BS.otherBank + BS.investments)} cr of cash and liquid funds against ₹${n0(BS.leaseLiabilities)} cr of lease liabilities; ₹${n0(GW)} cr of goodwill is 58% of equity`,
  blocks: [
    { p: `At Mar-26 VMM had no borrowings. Screener shows ₹${n0(A.borrowings[ix('FY26')])} cr of "borrowings": these are lease liabilities (₹${n0(BS.leaseLiabilities)} cr, up from ₹${n0(BS.leaseLiabilitiesMar25)} cr). Cash, bank deposits and liquid mutual funds were ₹${n0(BS.cash + BS.otherBank + BS.investments)} cr, so net debt including leases was only ₹${n0(BS.leaseLiabilities - BS.cash - BS.otherBank - BS.investments)} cr. The largest asset is goodwill (₹${n0(GW)} cr) from the 2018 Kedaara/Partners Group buyout; it is not amortised but tested each year. Inventory is ₹${n0(BS.inventories)} cr (~${Math.round(A.inventoryDays[ix('FY26')])} days on Screener's basis, down from 110 in FY21; ₹1,900 cr at Jun-26), largely funded by suppliers (payables ₹${n0(BS.tradePayables)} cr): net trade working capital is ~15 days. Contingent liabilities are ₹${n0(BS.contingent.incomeTax + BS.contingent.indirectTax + BS.contingent.other)} cr, mostly vendor, customer and other claims.` },
    { pair: [
      { type: 'line', title: 'Inventory days down from 110 to 80; payables keep pace', unit: 'Days', x: RL, series: [{ name: 'Inventory days', values: RR('Inventory Days'), fmt: 'num' }, { name: 'Payable days', values: RR('Days Payable'), fmt: 'num' }], labels: 'last', source: 'Screener.in' },
      { type: 'column', title: 'Net debt incl. leases fell to ₹274 cr as cash built', unit: 'Lease liabilities less cash and investments (₹ crore)', x: 'A.labels', from: 'FY20', series: [{ name: 'Net debt incl. leases', ref: 'A.netDebt', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-22', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth (incl. ₹4,284 cr goodwill)', '{{A.netWorth.2|num}}', '{{A.netWorth.4|num}}', '{{A.netWorth.5|num}}', '{{A.netWorth.6|num}}'],
      ['Lease liabilities (Screener "borrowings")', '{{A.borrowings.2|num}}', '{{A.borrowings.4|num}}', '{{A.borrowings.5|num}}', '{{A.borrowings.6|num}}'],
      ['Cash and investments', '{{A.cashAndInvestments.2|num}}', '{{A.cashAndInvestments.4|num}}', '{{A.cashAndInvestments.5|num}}', '{{A.cashAndInvestments.6|num}}'],
      ['Fixed assets incl. goodwill and right-of-use', '{{A.fixedAssets.2|num}}', '{{A.fixedAssets.4|num}}', '{{A.fixedAssets.5|num}}', '{{A.fixedAssets.6|num}}'],
      ['Inventories', '{{A.inventories.2|num}}', '{{A.inventories.4|num}}', '{{A.inventories.5|num}}', '{{A.inventories.6|num}}'],
      ['Trade payables', '{{A.payables.2|num}}', '{{A.payables.4|num}}', '{{A.payables.5|num}}', '{{A.payables.6|num}}'],
    ], source: SRC.co + '. In forecasts the model\'s "treasury" line is cash less lease liabilities (negative = net debt incl. leases).' } },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: the PE sponsor is down from 98.8% to 40.1% in 18 months; domestic funds now own ~35%',
  blocks: [
    { pair: [
      { type: 'line', title: 'Domestic funds took most of the stock the sponsor sold', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoter (Samayat: Kedaara, Partners Group): 76% to 40%', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoter', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'all', min: 0, max: 80, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY20–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 25 }, hl: true }, { key: 'ebitda', name: 'EBITDA', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 80 } }, { key: 'dep', name: 'Depreciation' },
      { key: 'otherIncome', name: 'Other income', flag: { type: 'pct', th: 40 } }, { key: 'interest', name: 'Finance cost' }, { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit', hl: true, flag: { type: 'pct', th: 30 } }, { key: 'eps', name: 'EPS (₹)', fmt: 'n2' }, { key: 'cfo', name: 'Cash from operations' }, { key: 'capex', name: 'Capex' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L (as reported by 30-Sep-2026)', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 18 }, hl: true }, { key: 'ebitda', name: 'EBITDA' }, { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' },
      { key: 'otherIncome', name: 'Other income' }, { key: 'interest', name: 'Finance cost' }, { key: 'dep', name: 'Depreciation' }, { key: 'pat', name: 'Net profit', hl: true },
    ] } },
  ],
};

module.exports = { financials, capital, balance, ownershipBase, statements, statementNotes: {}, RD };

if (require.main === module) {
  require('./VMM.val').syncMultiples();
  const B = fs.existsSync(path.join(__dirname, 'VMM.research.js')) ? require('./VMM.research') : null;
  const report = {
    symbol: 'VMM', listing: 'NSE: VMM · BSE: 544307', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Consumer services (retail)',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements],
    statementNotes: { ...(B?.statementNotes || {}) },
  };
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
