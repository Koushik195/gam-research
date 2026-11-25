// Authoring source for the ONGC initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported standalone financials (Screener standalone; ONGC AR FY26 ten-year table).
// Part B (ONGC.research.js, merging ONGC.part2-6.js on the shared ONGC.ctx.js) adds the research chapters. ONGC.val.js first
// syncs the build-derived segment path, tax rate and the SOTP parts into assumptions.json. Usage: node tools/authoring/ONGC.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'ONGC', 'research');
const SG = JSON.parse(fs.readFileSync(path.join(RD, 'segments.json'), 'utf8'));
const CO = JSON.parse(fs.readFileSync(path.join(RD, 'company.json'), 'utf8'));
const SA = SG.annual, FYS = SA.map(a => a.fy), FY5 = CO.fiveYear, n0 = v => Math.round(v).toLocaleString('en-IN');
const SRC = { sa: 'ONGC AR FY26 ten-year table (standalone), Screener.in standalone, GAM Research', scr: 'Screener.in (standalone), GAM estimates FY27-29E' };
const realRsT = a => Math.round(a.crudeRev * 1e7 / (a.crudeSold * 1e6)); // Rs per tonne of crude sold
const lev = a => a.royalty + a.cess + a.saed;

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Standalone profit follows the oil price and the government\'s share of it, not volumes',
  blocks: [
    { p: `ONGC's standalone revenue has moved between ₹68,000 cr (FY21, crude at US$45) and ₹1,44,500 cr (FY23, US$93) with almost no change in volume: crude sold fell every year, from 21.3 MMT in FY20 to 18.8 MMT in FY26, and gas from 19.4 to 15.5 BCM. Price did all the work. In FY26 revenue was ₹1,32,506 cr and net profit ₹32,894 cr (EPS ₹26.15), down 8% as Brent averaged US$70. Then the Strait of Hormuz crisis lifted Brent to ~US$97-98 in Q1FY27: revenue rose 45% to ₹46,460 cr and profit 112% to a record ₹17,034 cr in one quarter. **The so-what: a year of ONGC profit is mostly a bet on Brent and on how much of it the government lets ONGC keep.**` },
    { pair: [
      { type: 'stacked', title: 'Revenue by product: crude is ~two-thirds, gas has risen to ~27%', unit: 'Revenue (₹ crore, gross of windfall tax)', x: FYS, series: [{ name: 'Crude oil', values: SA.map(a => a.crudeRev), fmt: 'num' }, { name: 'Natural gas', values: SA.map(a => a.gasRev), fmt: 'num' }, { name: 'Value-added products', values: SA.map(a => a.vapRev), fmt: 'num' }], minLabel: 9000, source: 'ONGC AR FY26 ten-year table' },
      { type: 'column', title: 'Volumes sold have fallen every year since FY20', unit: 'Crude (MMT) and gas (BCM) sold', x: FYS, series: [{ name: 'Crude sold (MMT)', values: SA.map(a => a.crudeSold), fmt: 'n1' }, { name: 'Gas sold (BCM)', values: SA.map(a => a.gasSold), fmt: 'n1' }], labels: 'none', source: 'ONGC AR FY26 ten-year table (incl. JV share)' },
    ] },
    { pair: [
      { type: 'column', title: 'EPS: FY27E jumps on the Hormuz spike, then falls back with crude', unit: 'Standalone EPS (₹)', x: 'fin.labels', from: 'FY19', series: [{ name: 'EPS', ref: 'fin.eps', fmt: 'n1' }], labels: 'all', source: SRC.scr },
      { type: 'column', title: 'Royalty, cess and windfall tax took 20-29% of product revenue', unit: 'Statutory levies (₹ crore)', x: FYS, series: [{ name: 'Royalty', values: SA.map(a => a.royalty), fmt: 'num' }, { name: 'OIDB cess', values: SA.map(a => a.cess), fmt: 'num' }, { name: 'Windfall tax (SAED) and other', values: SA.map(a => a.saed), fmt: 'num' }], labels: 'none', source: 'ONGC AR FY26 ten-year table' },
    ] },
    { exhibit: { type: 'table', title: 'What each tonne of crude earned, and what the government took (standalone)', head: ['', ...FYS], rows: [
      ['Indian crude basket (US$/bbl)', ...SA.map(a => a.basket.toFixed(1))],
      ['INR per US$', ...SA.map(a => a.fx.toFixed(1))],
      ['Crude revenue per tonne sold (₹)', ...SA.map(a => n0(realRsT(a)))],
      ['Statutory levies (₹ cr)', ...SA.map(a => n0(lev(a)))],
      ['  of which windfall tax / other levies (₹ cr)', ...SA.map(a => n0(a.saed))],
      ['Levies as % of product revenue', ...SA.map(a => `${Math.round(lev(a) / (a.crudeRev + a.gasRev + a.vapRev) * 100)}%`)],
      ['Exploration write-offs (₹ cr)', ...SA.map(a => n0(a.explWo))],
      { hl: true, cells: ['**Net profit (₹ cr)**', ...SA.map(a => `**${n0(a.pat)}**`)] },
    ], source: 'ONGC AR FY26 (ten-year table, PPAC data in MD&A); Screener.in' } },
    { callout: '**So what:** the government shares in ONGC\'s upside three times: royalty and cess (a fixed share of price), the APM gas cap (it keeps the formula price above US$7.00), and, when prices spike, an ad hoc windfall tax (₹23,800 cr in FY23-25). It did not re-impose the windfall tax in the 2026 spike (to 30-Sep-2026), and it cut royalty in May-2026. That is the single biggest reason FY27E earnings are high, and the single biggest risk to them.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capital allocation', kicker: 'Capital allocation', title: 'Half the cash goes back to shareholders; the rest into flat production and state-directed investments',
  blocks: [
    { p: `ONGC spent ₹${n0(FY5.capexCr.reduce((s, x) => s + x, 0))} cr of capex in FY22-26 (₹35,878 cr in FY26; ₹62,057 cr in FY25 was a one-year peak) and declared ₹${n0(FY5.dividendDeclaredCr.reduce((s, x) => s + x, 0))} cr of dividends (DPS ₹10.50 to ₹13.25). The capex has held production flat, not grown it: standalone crude 19.5 MMT in FY22, 19.3 MMT in FY26. The large investments outside E&P were made at the government's direction: HPCL (₹36,915 cr, Jan-2018), OPaL (₹21,181 cr of equity, still loss-making in Q1FY27) and ONGC Green (₹4,700 cr).` },
    { exhibit: { type: 'table', title: 'Where the cash went, FY22-26 (₹ crore)', head: ['', ...FY5.years, 'Five years'], rows: [
      ['Capex (AR)', ...FY5.capexCr.map(n0), n0(FY5.capexCr.reduce((s, x) => s + x, 0))],
      ['Dividend declared for the year', ...FY5.dividendDeclaredCr.map(n0), n0(FY5.dividendDeclaredCr.reduce((s, x) => s + x, 0))],
      ['DPS (₹)', ...FY5.dpsRs.map(v => v.toFixed(2)), ''],
      ['Cash and bank at year-end', ...FY5.cashCr.map(n0), ''],
      ['Borrowings (excl. leases)', ...FY5.borrowingsCr.map(n0), ''],
      ['Lease liabilities', ...FY5.leaseLiabCr.map(n0), ''],
      ['Site-restoration fund deposits', ...FY5.srfCr.map(n0), ''],
    ], source: 'ONGC AR FY26 ten-year table' } },
    { pair: [
      { type: 'column', title: 'Dividend per share: up every year since FY21', unit: 'DPS (₹)', x: FYS, series: [{ name: 'DPS', values: SA.map(a => a.dps), fmt: 'n1' }], labels: 'all', source: 'ONGC AR FY26' },
      { type: 'column', title: 'Capex has not bought growth: standalone crude output is flat', unit: 'ONGC own-field crude (MMT)', x: CO.business.production.years, series: [{ name: 'Crude (own fields)', values: CO.business.production.crudeOwnMmt, fmt: 'n1' }, { name: 'Gas (own fields, BCM)', values: CO.business.production.gasOwnBcm, fmt: 'n1' }], labels: 'all', source: 'ONGC AR FY26 MD&A' },
    ] },
    { callout: '**Capital allocation verdict:** the dividend is reliable (it rose every year from FY21; FY26 paid out ₹16,669 cr, 51% of profit, through two interims and a final) and the balance sheet is strong. But the capital ONGC controls is not fully its own: the government, which owns 58.89%, has used it to buy HPCL, rescue OPaL and fund national exploration missions. Minority shareholders get the dividend; they do not decide where the rest goes.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'Net cash, with stakes worth ₹1 lakh crore and few debts',
  blocks: [
    { p: 'At March 2026 ONGC standalone had ₹28,660 cr of cash and bank balances against ₹7,823 cr of borrowings; the rest of Screener\'s ₹33,645 cr "borrowings" are lease liabilities (₹25,822 cr: rigs, vessels, offshore facilities). It also held ₹32,728 cr in a site-restoration fund (a ring-fenced deposit for decommissioning fields) and ₹1,13,379 cr of investments at book value (subsidiaries at cost, IOC and GAIL at fair value), whose market value was ~₹98,000 cr for the quoted ones (AR).' },
    { exhibit: { type: 'table', title: 'Standalone balance sheet snapshot (₹ crore)', head: ['', 'Mar-22', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth', '{{A.netWorth.7|num}}', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}'],
      ['Borrowings incl. leases', '{{A.borrowings.7|num}}', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}'],
      ['Cash and bank', '{{A.cash.7|num}}', '{{A.cash.9|num}}', '{{A.cash.10|num}}', '{{A.cash.11|num}}'],
      ['Investments (book)', '{{A.investments.7|num}}', '{{A.investments.9|num}}', '{{A.investments.10|num}}', '{{A.investments.11|num}}'],
      ['Net fixed assets', '{{A.fixedAssets.7|num}}', '{{A.fixedAssets.9|num}}', '{{A.fixedAssets.10|num}}', '{{A.fixedAssets.11|num}}'],
      ['Capital work in progress', '{{A.cwip.7|num}}', '{{A.cwip.9|num}}', '{{A.cwip.10|num}}', '{{A.cwip.11|num}}'],
    ], source: 'Screener.in (standalone); ONGC AR FY26' } },
    { callout: '**So what:** solvency is not a question. Two items deserve attention: contingent liabilities (the Panna-Mukta-Tapti arbitration alone is ~₹15,216 cr, where ONGC chose not to defend itself), and guarantees for subsidiaries (ONGC has guaranteed OPaL\'s debt to cut its funding cost). In the engine\'s forecast, "treasury" is cash plus investments at book less borrowings, so it is not all spendable cash.' },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: the government 58.89%, other state entities ~20%',
  blocks: [
    { pair: [
      { type: 'column', title: 'Promoter (President of India) steady at 58.89%', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoter', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 40, max: 70, source: 'BSE shareholding pattern, Screener.in' },
      { type: 'line', title: 'Domestic institutions ~19%, foreign ~8%', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { p: '*Standalone. Revenue is net of the windfall tax (SAED) in FY23-FY25, as Screener shows it; EBITDA is after exploration write-offs. Other income includes dividends from HPCL, MRPL, IOC, GAIL and Petronet.*' },
    { statement: { title: 'Profit & loss, FY18–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 15 }, hl: true }, { key: 'ebitda', name: 'EBITDA', hl: true }, { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 300 } },
      { key: 'dep', name: 'Depreciation, depletion and impairment' }, { key: 'otherIncome', name: 'Other income (incl. dividends)', flag: { type: 'pct', th: 40 } }, { key: 'interest', name: 'Interest (mostly leases)' }, { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit', hl: true, flag: { type: 'pct', th: 30 } }, { key: 'eps', name: 'EPS (₹)', fmt: 'n1' }, { key: 'cfo', name: 'Cash from operations' }, { key: 'capex', name: 'Capex' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L (as reported by 30-Sep-2026)', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 15 }, hl: true }, { key: 'ebitda', name: 'EBITDA' }, { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' },
      { key: 'otherIncome', name: 'Other income' }, { key: 'dep', name: 'Depreciation' }, { key: 'pat', name: 'Net profit', hl: true },
    ] } },
  ],
};

module.exports = { financials, capital, balance, ownershipBase, statements, RD };

if (require.main === module) {
  require('./ONGC.val').syncParts();
  const B = fs.existsSync(path.join(__dirname, 'ONGC.research.js')) ? require('./ONGC.research') : null;
  const report = {
    symbol: 'ONGC', listing: 'NSE: ONGC · BSE: 500312', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Oil, gas & consumable fuels',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements],
    statementNotes: { ...(B?.statementNotes || {}) },
  };
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
