// Authoring source for the Zydus Lifesciences initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated; Net Profit on the attributable
// basis and the Jun-2026 quarter as filed, via ZYDUSLIFE.patch.js). Part B (ZYDUSLIFE.research.js + part2-6, shared
// ZYDUSLIFE.ctx.js) adds the research chapters. ZYDUSLIFE.mult.js first syncs the derived multiples into
// assumptions.json. Usage: node tools/authoring/ZYDUSLIFE.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'ZYDUSLIFE', 'research');
const SCR = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8')).tables.ratios;
const keepR = SCR.periods.map(p => `${p.slice(-4)}-05-30` <= '2026-09-30');
const RL = SCR.periods.filter((_, i) => keepR[i]).map(p => 'FY' + p.slice(-2));
const RR = k => SCR.rows[k].filter((_, i) => keepR[i]);
const MOD = JSON.parse(fs.readFileSync(path.join(RD, '..', '..', '..', 'models', 'ZYDUSLIFE.json'), 'utf8')), A = MOD.annual;
const ix = l => A.labels.indexOf(l), sumOf = (k, from, to) => A.labels.slice(ix(from), ix(to) + 1).reduce((s, _, j) => s + (A[k][ix(from) + j] || 0), 0);
const n0 = v => Math.round(v).toLocaleString('en-IN');
const SRC = { co: 'Company filings, Screener.in (consolidated; profit attributable to owners), GAM Research' };
const cfo = sumOf('cfo', 'FY21', 'FY26'), capexS = sumOf('capex', 'FY21', 'FY26'), cfi = sumOf('cfi', 'FY21', 'FY26'), divs = sumOf('dividendsPaid', 'FY21', 'FY26');
const cfo3a = sumOf('cfo', 'FY21', 'FY23'), cfo3b = sumOf('cfo', 'FY24', 'FY26'), cap3a = sumOf('capex', 'FY21', 'FY23'), cap3b = sumOf('capex', 'FY24', 'FY26');
const cfi3a = sumOf('cfi', 'FY21', 'FY23'), cfi3b = sumOf('cfi', 'FY24', 'FY26'), div3a = sumOf('dividendsPaid', 'FY21', 'FY23'), div3b = sumOf('dividendsPaid', 'FY24', 'FY26');

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Revenue up 1.9x and EBITDA 2.5x since FY21; FY26 was the peak, Q1FY27 the reset',
  blocks: [
    { p: 'Zydus grew revenue from ₹14,404 cr in FY21 to ₹27,148 cr in FY26 (about 13% a year) and company-basis EBITDA from ₹3,391 cr to ₹8,475 cr. The margin went from 24% in FY21 (22% in FY22) to 31%. Three things did it: generic Revlimid (gRevlimid, a limited-competition US launch from Mar-2022), the semi-exclusive generic Myrbetriq (mirabegron), and India growing faster than its market. Two flattered FY26 further: a weaker rupee produced ₹1,198 cr of operating forex gains inside EBITDA, and acquisitions added ₹2,000 cr of revenue (Amplitude, Comfort Click). Reported EPS moved from ₹20.8 (FY21) to ₹50.1 (FY26); before one-offs it moved from ₹23.5 to ₹54.2.' },
    { pair: [
      { type: 'column', title: 'Revenue: ₹14,404 cr in FY21, ₹27,148 cr in FY26', unit: 'Revenue from operations (₹ crore)', x: 'fin.labels', from: 'FY17', to: 'FY29E', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'all', source: SRC.co + '; GAM estimates FY27-29E' },
      { type: 'column', title: 'Attributable profit: the FY22 and FY23 swings are one-offs', unit: 'Net profit attributable to owners (₹ crore)', x: 'fin.labels', from: 'FY17', to: 'FY29E', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.co + '. FY22 includes the animal-health sale gain; FY23 ₹428 cr of exceptional charges' },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: 31% in FY26, 24% from FY27E', unit: 'EBITDA margin, company basis incl. forex gains (%)', x: 'fin.labels', from: 'FY17', to: 'FY29E', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 15, max: 35, source: SRC.co + '; GAM estimates' },
      { type: 'line', title: 'Gross margin rose 10 points as the US mix got richer', unit: 'Gross margin (%), Screener basis', x: 'A.labels', from: 'FY17', series: [{ name: 'Gross margin', ref: 'A.grossMargin', fmt: 'pct' }], labels: 'all', min: 55, max: 80, source: 'Screener.in' },
    ] },
    { callout: '**Our view:** FY24-FY26 was Zydus at its best: limited-competition US products, record margins and a rupee tailwind. FY27 is the reset: gRevlimid is gone, Mirabegron carries a licence fee and faces competition, and the acquisitions bring revenue but also amortisation and interest. Our FY27E EPS of {{F.eps.0|inr}} is {{F.epsGrowth.0|chg}} below FY26. The question for the stock is how fast India, international markets, specialty and Saroglitazar can rebuild what the windfalls provided.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capex, deals & returns', kicker: 'Capital allocation', title: 'From cash-rich to acquisitive: ₹7,000+ cr of deals and a ₹1,100 cr buyback in 15 months',
  blocks: [
    { p: `Over FY21-26 Zydus generated ₹${n0(cfo)} cr of operating cash flow, spent ₹${n0(capexS)} cr on fixed assets and paid ₹${n0(divs)} cr of dividends. Until FY25 it was building cash: net cash was ~₹4,900 cr at Mar-25. Then it changed course. In FY26 it bought Amplitude Surgical (₹2,570 cr), Comfort Click through Zydus Wellness (₹2,877 cr) and the Agenus plants (₹1,080 cr), settled Mirabegron (₹1,060 cr incl. the prepaid licence), and in Q1FY27 bought Assertio (US$166 mn) and bought back ₹1,100 cr of shares. Net debt was ₹5,904 cr at Jun-26 (0.7x EBITDA). FY26 operating cash flow fell to ₹2,117 cr (25% of EBITDA) on the settlement and acquired working capital.` },
    { pair: [
      { type: 'column', title: 'Operating cash flow vs capex: FY26 broke the pattern', unit: '₹ crore', x: 'A.labels', from: 'FY17', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }], labels: 'none', source: SRC.co },
      { type: 'line', title: 'ROCE: 24% in FY25, 21% in FY26 as acquired capital came in', unit: 'Return on capital employed (%), Screener basis', x: RL, series: [{ name: 'ROCE', values: RR('ROCE %'), fmt: 'pct0' }], labels: 'all', min: 0, max: 30, source: 'Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went (₹ crore, Screener cash flow)', head: ['', 'FY21-23', 'FY24-26', 'Six years'], rows: [
      ['Cash from operations', n0(cfo3a), n0(cfo3b), n0(cfo)],
      ['Capex (fixed assets)', n0(cap3a), n0(cap3b), n0(capexS)],
      ['All investing cash flow (capex, deals, treasury moves)', n0(cfi3a), n0(cfi3b), n0(cfi)],
      ['Dividends paid', n0(div3a), n0(div3b), n0(divs)],
      ['Memo: buybacks', '₹750 cr (Jul-2022)', '₹600 cr (Mar-2024)', '+ ₹1,100 cr in Jun-2026'],
    ], source: 'Screener.in cash flow (consolidated); company buyback history (AR FY26). FY23 investing cash flow was positive because of the animal-health sale proceeds.' } },
    { callout: '**The capital question:** we model organic capex of ₹1,500-1,550 cr a year (guidance) and no further deals. The engine then pays down net debt within two years. Management has said it is "comfortable around one-times net debt to EBITDA" and keeps looking for bolt-ons in US specialty and international markets. So our deleveraging path is the cautious case for leverage but the optimistic case for capital discipline. Every deal so far has earned less than the 30%+ returns of the generics business it replaces: the MedTech segment lost ₹178 cr before tax in FY26 and Consumer earned ₹267 cr on ₹10,306 cr of segment assets.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'Goodwill and intangibles are now ₹17,400 cr, 64% of equity; net debt ₹5,904 cr at Jun-26',
  blocks: [
    { p: 'At Mar-2026 Zydus had ₹27,111 cr of equity attributable to owners and ₹2,471 cr of minority interest (the 42.41% of Zydus Wellness it does not own). Against that sat ₹7,543 cr of goodwill (consumer ₹4,966 cr, MedTech ₹1,253 cr, liquid orals ₹545 cr), ₹7,332 cr of other intangibles and ₹2,533 cr of intangibles under development. Borrowings were ₹11,770 cr (plus ₹727 cr of leases) against ₹7,464 cr of cash and liquid investments: net debt ₹4,305 cr (company), rising to ₹5,904 cr at Jun-26. Inventory is high for a generics company, at 282 days of cost of goods on Screener\'s basis (FY26), partly because acquisitions brought stock with them.' },
    { pair: [
      { type: 'line', title: 'Inventory days jumped to 282 in FY26', unit: 'Days (Screener basis)', x: RL, series: [{ name: 'Inventory days', values: RR('Inventory Days'), fmt: 'num' }, { name: 'Receivable days', values: RR('Debtor Days'), fmt: 'num' }, { name: 'Payable days', values: RR('Days Payable'), fmt: 'num' }], labels: 'last', source: 'Screener.in' },
      { type: 'column', title: 'Net debt is back: Screener\'s net debt line', unit: 'Borrowings incl. leases less cash and investments incl. JV stakes (₹ crore)', x: 'A.labels', from: 'FY17', series: [{ name: 'Net debt', ref: 'A.netDebt', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-22', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth (owners)', '{{A.netWorth.7|num}}', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}'],
      ['Borrowings (incl. leases)', '{{A.borrowings.7|num}}', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}'],
      ['Cash and investments (incl. JV stakes)', '{{A.cashAndInvestments.7|num}}', '{{A.cashAndInvestments.9|num}}', '{{A.cashAndInvestments.10|num}}', '{{A.cashAndInvestments.11|num}}'],
      ['Net fixed assets (incl. intangibles)', '{{A.fixedAssets.7|num}}', '{{A.fixedAssets.9|num}}', '{{A.fixedAssets.10|num}}', '{{A.fixedAssets.11|num}}'],
      ['Inventories', '{{A.inventories.7|num}}', '{{A.inventories.9|num}}', '{{A.inventories.10|num}}', '{{A.inventories.11|num}}'],
      ['Trade receivables', '{{A.receivables.7|num}}', '{{A.receivables.9|num}}', '{{A.receivables.10|num}}', '{{A.receivables.11|num}}'],
      ['Trade payables', '{{A.payables.7|num}}', '{{A.payables.9|num}}', '{{A.payables.10|num}}', '{{A.payables.11|num}}'],
    ], source: SRC.co + '. Screener nets goodwill outside fixed assets; borrowings include lease liabilities (₹727 cr at Mar-26).' } },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: the Patel family trust holds 75%; only ~25% floats',
  blocks: [
    { pair: [
      { type: 'line', title: 'Institutions own less than a fifth', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoters at the 75% ceiling', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 60, max: 80, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY15–FY29E', rows: [
      { key: 'sales', name: 'Revenue from operations', flag: { type: 'pct', th: 15 }, hl: true },
      { key: 'ebitda', name: 'EBITDA (company basis, incl. forex gains)', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 250 } },
      { key: 'dep', name: 'Depreciation & amortisation (FY27-28E excl. the Mirabegron licence)' },
      { key: 'otherIncome', name: 'Other income (actual: after exceptional items; FY27-28E: after the licence amortisation)' },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit attributable to owners', hl: true, flag: { type: 'pct', th: 25 } },
      { key: 'eps', name: 'EPS (₹, FY26 share count)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' },
      { key: 'capex', name: 'Capex (FY27E incl. Assertio)' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 15 }, hl: true },
      { key: 'ebitda', name: 'EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' },
      { key: 'otherIncome', name: 'Other income (after exceptional items)' },
      { key: 'dep', name: 'Depreciation & amortisation' },
      { key: 'pat', name: 'Net profit (attributable)', hl: true },
    ] } },
  ],
};

const statementNotes = {};

module.exports = { financials, capital, balance, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  require('./ZYDUSLIFE.mult').syncMult();
  const B = fs.existsSync(path.join(__dirname, 'ZYDUSLIFE.research.js')) ? require('./ZYDUSLIFE.research') : null;
  const report = {
    symbol: 'ZYDUSLIFE', listing: 'NSE: ZYDUSLIFE · BSE: 532321', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Pharmaceuticals & Healthcare',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
