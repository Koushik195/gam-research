// Authoring source for the Godrej Industries initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener consolidated, Net Profit on the
// attributable basis after minorities via GODREJIND.patch.js; GIL standalone from the FY26 annual report).
// Part B (GODREJIND.research.js, merging GODREJIND.part2-6.js) adds the research chapters.
// Usage: node tools/authoring/GODREJIND.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'GODREJIND', 'research');
const SG = JSON.parse(fs.readFileSync(path.join(RD, 'segments.json'), 'utf8'));
const CO = JSON.parse(fs.readFileSync(path.join(RD, 'company.json'), 'utf8'));
const SA = SG.annual, FYS = SA.map(a => a.fy);
const n0 = v => Math.round(v).toLocaleString('en-IN');
const SRC = { co: 'Company filings, Screener.in (consolidated; profit attributable to GIL shareholders), GAM Research', sa: 'GIL annual report FY26 (standalone), Screener.in standalone, GAM Research' };
const H = CO.holdco, NDH = H.netDebtHistory;
const mi = SA.map(a => a.consPatPreMi - a.patAttr);

const financials = {
  id: 'trajectory', nav: 'Consolidated financials', kicker: 'Financials', title: 'The consolidated P&L is large, lumpy and mostly not GIL\'s',
  blocks: [
    { p: `Godrej Industries' consolidated revenue was ₹22,237 cr in FY26 and profit before minorities ₹2,412 cr. Neither number tells you much about the stock. Revenue is the sum of four very different businesses that GIL controls: its own chemicals (₹${n0(SA[6].chemRev)} cr), Godrej Agrovet (₹${n0(SA[6].gavlRev)} cr, 65% owned), Godrej Properties (₹${n0(SA[6].gplRev)} cr, 45% owned) and Godrej Capital plus smaller businesses (₹${n0(SA[6].finRev)} cr). Godrej Consumer, GIL's most valuable stake, is not in revenue at all: it is an associate, so only GIL's 23.7% share of its profit (₹445 cr in FY26) appears, inside other income.` },
    { pair: [
      { type: 'stacked', title: 'Revenue: Agrovet is half, Godrej Capital the fastest growing', unit: 'Revenue from operations (₹ crore)', x: FYS, series: [{ name: 'Chemicals', values: SA.map(a => a.chemRev), fmt: 'num' }, { name: 'Godrej Agrovet', values: SA.map(a => a.gavlRev), fmt: 'num' }, { name: 'Godrej Properties', values: SA.map(a => a.gplRev), fmt: 'num' }, { name: 'Godrej Capital & others', values: SA.map(a => a.finRev), fmt: 'num' }], minLabel: 900, source: 'Screener.in (GIL, GPL, GAVL consolidated); GIL decks and AR FY26 (chemicals); residual = GIL less the three' },
      { type: 'column', title: 'Minorities took ₹1,171 cr of FY26 profit: more than GIL kept', unit: '₹ crore', x: FYS, series: [{ name: 'Profit attributable to GIL', values: SA.map(a => a.patAttr), fmt: 'num' }, { name: 'Minorities\' share', values: mi, fmt: 'num' }], labels: 'none', source: SRC.co },
    ] },
    { p: 'Profit is even more distorted. Godrej Properties books revenue only when flats are handed over, years after they are sold, and earns most of its profit as "other income" (interest from joint-venture partners and JV profits: ₹3,256 cr in FY26). Godrej Capital\'s interest cost (~₹1,356 cr in FY26) sits in consolidated interest. So the group\'s EBITDA (₹2,242 cr) is small, other income (₹4,123 cr) is large, and interest (₹2,470 cr) mostly belongs to a lender. Of the ₹2,412 cr profit, minorities (55% of GPL, 35% of GAVL, 9% of Godrej Capital) took ₹1,171 cr; GIL\'s shareholders got ₹1,241 cr, or ₹36.8 a share.' },
    { pair: [
      { type: 'column', title: 'EPS for GIL shareholders: FY24 collapsed, FY26 a record', unit: 'EPS after minorities (₹)', x: 'fin.labels', from: 'FY19', series: [{ name: 'EPS', ref: 'fin.eps', fmt: 'n1' }], labels: 'all', source: 'Screener.in; GAM estimates FY27-29E' },
      { type: 'line', title: 'Consolidated EBITDA margin: 3-11%, driven by GPL and Agrovet', unit: 'EBITDA margin (%)', x: 'fin.labels', from: 'FY19', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 0, max: 15, source: SRC.co },
    ] },
    { callout: '**So what:** do not judge GIL on its consolidated P/E or margins. About three-quarters of its gross asset value is the market value of three listed companies, which investors can buy directly. The questions that matter are (1) what discount the market applies to that portfolio, (2) what the chemicals business and Godrej Capital are worth, and (3) how fast the holding company\'s own debt is growing. The rest of this report is built around those three.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Holding-company cash', kicker: 'Capital allocation', title: 'The holding company borrows to fund Godrej Capital; minorities get no dividend',
  blocks: [
    { p: `GIL standalone is a small business with a big balance sheet. In FY26 it earned ₹${n0(H.fy26pl.dividendIncome)} cr of dividends (from GCPL and GAVL; GPL pays none), ₹${n0(H.fy26pl.rent)} cr of rent and ~₹361 cr of chemicals EBITDA, and paid ₹${n0(H.fy26pl.financeCost)} cr of interest. After corporate costs, standalone profit was ₹${n0(H.fy26pl.pat)} cr (₹${n0(H.fy26pl.patFy25)} cr in FY25). Every rupee GIL has put into Godrej Capital (₹744 cr in FY26, ₹370 cr more in Q1FY27) and into GPL's equity raises has therefore been borrowed.` },
    { exhibit: { type: 'table', title: 'GIL\'s investments since 2021 (₹ crore, at cost)', head: ['Investment', 'Mar-21', 'Mar-23', 'Mar-25', 'Mar-26', 'Jun-26', 'Added since Mar-21'], rows: [
      ['Godrej Properties (44.8%)', '762', '1,780', '2,732', '2,732', '2,732', '1,970'],
      ['Godrej Agrovet (65.1%)', '513', '1,043', '1,043', '1,067', '1,068', '555'],
      ['Godrej Capital / Godrej Investment', '–', '1,494', '3,169', '3,913', '4,283', '4,283'],
      ['Godrej Consumer (23.7%)', '1,366', '1,366', '1,366', '1,366', '1,366', '–'],
      { hl: true, cells: ['**Holding-company net debt (approx.)**', `**${n0(NDH['Mar-21'])}**`, `**${n0(NDH['Mar-23'])}**`, `**${n0(NDH['Mar-25'])}**`, `**${n0(NDH['Mar-26'])}**`, '**~10,157 (est.)**', `**+${n0(10157 - NDH['Mar-21'])}**`] },
    ], source: 'GIL quarterly decks (investments at cost); AR FY26; Screener standalone; GAM estimate for Jun-26 net debt (Mar-26 + Q1 infusion)' } },
    { pair: [
      { type: 'column', title: 'Holding-company net debt has tripled since Mar-2021', unit: 'GIL standalone net debt (₹ crore)', x: ['Mar-21', 'Mar-22', 'Mar-23', 'Mar-24', 'Mar-25', 'Mar-26'], series: [{ name: 'Net debt', values: ['Mar-21', 'Mar-22', 'Mar-23', 'Mar-24', 'Mar-25', 'Mar-26'].map(k => NDH[k]), fmt: 'num' }], labels: 'all', source: SRC.sa + ' (approximate before FY25)' },
      { type: 'column', title: 'Interest now exceeds the dividends GIL receives', unit: 'GIL standalone (₹ crore)', x: ['FY25', 'FY26'], series: [{ name: 'Dividends received', values: [H.fy26pl.dividendIncomeFy25, H.fy26pl.dividendIncome], fmt: 'num' }, { name: 'Interest paid', values: [H.fy26pl.financeCostFy25, H.fy26pl.financeCost], fmt: 'num' }], labels: 'all', source: SRC.sa },
    ] },
    { callout: '**Capital allocation verdict:** the money has gone into the right places for the group (GPL\'s land pipeline, a fast-growing lender), but at GIL\'s level it has been funded with debt, not with dividends or asset sales, and minorities have received no dividend since FY20. Management says the group will put ₹5,000-7,000 cr more into its unlisted businesses over five years (PTI, 22-Apr-2026). Unless Godrej Capital raises outside equity or GIL sells something, holding-company debt keeps rising by ~₹700 cr a year.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Net-debt bridge', kicker: 'Balance sheet', title: 'Two balance sheets: a lender and a developer inside, ~₹10,000 cr of holding-company debt on top',
  blocks: [
    { p: 'Consolidated borrowings were ₹51,564 cr at March 2026, but almost all of it belongs to Godrej Capital (a lender\'s borrowings are its raw material: total assets ₹28,426 cr, net worth ₹4,346 cr) and Godrej Properties (project debt against most of the group\'s ₹59,872 cr of inventory, which customer advances of ₹36,622 cr also fund). Those debts are already reflected in GPL\'s market value and in Godrej Capital\'s book value. What GIL\'s shareholders carry directly is the **holding company\'s own debt**.' },
    { exhibit: { type: 'table', title: 'Holding-company net-debt bridge (GIL standalone, ₹ crore)', head: ['', 'Mar-25', 'Mar-26', 'Jun-26E'], rows: [
      ['Non-convertible debentures (incl. current maturities)', '4,946', n0(H.mar26.ncd), '–'],
      ['Commercial paper', '3,394', n0(H.mar26.commercialPaper), '–'],
      ['Bank loans', '1,717', n0(H.mar26.bankLoans), '–'],
      ['Lease liabilities', n0(H.mar25.leases), n0(H.mar26.leases), '–'],
      { hl: true, cells: ['**Gross debt**', '**10,068**', '**11,063**', '–'] },
      ['Less: mutual funds', `(${n0(H.mar25.mutualFunds)})`, `(${n0(H.mar26.mutualFunds)})`, '–'],
      ['Less: cash and bank', `(${n0(H.mar25.cash)})`, `(${n0(H.mar26.cash)})`, '–'],
      { hl: true, cells: ['**Net debt**', `**${n0(H.mar25.netDebtInclLeases)}**`, `**${n0(H.mar26.netDebtInclLeases)}**`, '**~10,157**'] },
      ['Per GIL share (₹)', n0(H.mar25.netDebtInclLeases / 33.68), n0(H.mar26.netDebtInclLeases / 33.68), '~302'],
    ], source: 'AR FY26 standalone balance sheet and notes 10, 18, 20; Jun-26E = Mar-26 + ₹370 cr Q1FY27 infusion into Godrej Investment (half-year balance sheet not yet published on 30-Sep-2026)' } },
    { callout: '**Refinancing is the real risk, not solvency.** ₹4,505 cr of the debt is commercial paper and maturing NCDs due within a year, rolled over on the strength of the stakes (worth ~₹50,000 cr at market). That works as long as markets stay open; it also means the holding company depends on the Godrej name and on lenders\' comfort with the share prices of GCPL and GPL.' },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: the family owns ~85%; the free float is ~15%',
  blocks: [
    { pair: [
      { type: 'column', title: 'Promoter group raised to 74.64%, just under the 75% limit', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 60, max: 80, source: 'BSE shareholding pattern, Screener.in' },
      { type: 'line', title: 'FIIs and DIIs together own only ~8%', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { p: '*Consolidated. Net profit and EPS are attributable to GIL shareholders (after minorities). In FY27-29E the tax line also carries minorities (engine workaround, see Forecasts). Other income includes the share of profit of associates (mainly Godrej Consumer) and exceptional items.*' },
    { statement: { title: 'Profit & loss, FY18–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 15 }, hl: true }, { key: 'ebitda', name: 'EBITDA', hl: true }, { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 300 } },
      { key: 'dep', name: 'Depreciation' }, { key: 'otherIncome', name: 'Other income (incl. associates, exceptional)' }, { key: 'interest', name: 'Interest (incl. Godrej Capital)' }, { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit (after minorities)', hl: true, flag: { type: 'pct', th: 40 } }, { key: 'eps', name: 'EPS (₹)', fmt: 'n1' }, { key: 'cfo', name: 'Cash from operations' }, { key: 'capex', name: 'Capex' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 15 }, hl: true }, { key: 'ebitda', name: 'EBITDA' }, { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' },
      { key: 'dep', name: 'Depreciation' }, { key: 'interest', name: 'Interest' }, { key: 'pat', name: 'Net profit (after minorities)', hl: true },
    ] } },
  ],
};

module.exports = { financials, capital, balance, ownershipBase, statements, RD };

if (require.main === module) {
  const B = fs.existsSync(path.join(__dirname, 'GODREJIND.research.js')) ? require('./GODREJIND.research') : null;
  const report = {
    symbol: 'GODREJIND', listing: 'NSE: GODREJIND · BSE: 500164', date: '30 September 2026', rating: B?.rating || 'SELL', analysts: 'GAM Research — Chemicals & Holding companies',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements],
    statementNotes: { ...(B?.statementNotes || {}) },
  };
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
