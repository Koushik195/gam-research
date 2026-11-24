// Authoring source for the Alkem Laboratories initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated; Net Profit on the attributable basis,
// see ALKEM.patch.js): financial trajectory, margins and the tax reset, capital allocation, balance sheet, ownership base,
// annotated statements. Part B (ALKEM.research.js + part2-6, shared ALKEM.ctx.js) adds the research chapters.
// Usage: node tools/authoring/ALKEM.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'ALKEM', 'research');
const X = fs.existsSync(path.join(__dirname, 'ALKEM.ctx.js')) ? require('./ALKEM.ctx') : null;
const SRC = { co: 'Company filings, Screener.in (consolidated), GAM Research', est: 'Company, GAM Research estimates' };
const FYS = ['FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'];

const financials = X && (() => {
  const { A, b, ix, n0, n1, pc, epsRep, byBase, ownersEps, cagr, F, ex26 } = X;
  const exEps = FYS.map(f => Math.round(byBase[2000 + +f.slice(2)] * 10) / 10);
  const i20 = ix('FY20');
  return {
    id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Revenue up 1.8x since FY20 and profit 2x; margins swung from 14% to 22% and back to ~20%; FY27 EPS falls on tax',
    blocks: [
      { p: `Alkem's revenue grew from ₹${n0(A.sales[i20])} cr in FY20 to ₹${n0(A.sales[b])} cr in FY26 (${n1(cagr(A.sales[i20], A.sales[b], 6))}% a year): India from ~₹5,450 cr to ₹9,851 cr (~10% a year), the US from ~₹2,200 cr to ₹2,985 cr (5% a year, with a dip in FY25) and other international markets from ~₹700 cr to ₹1,696 cr. Profit to shareholders doubled, from ₹${n0(A.pat[i20])} cr to ₹${n0(A.pat[b])} cr, but not in a straight line. FY23 was a bad year: US price erosion, raw-material inflation and ₹173 cr of exceptional charges cut the EBITDA margin to 14.0% and EPS to ₹82 (₹138 in FY22). Since then the margin has rebuilt to 20.4% and EPS to ₹${n1(epsRep[2026])} reported, ₹${n1(ex26)} before exceptional items. Two things kept profit growth above revenue growth for a decade: Sikkim tax holidays (tax rate 9-18%) and rising treasury income. The first ends in FY27.` },
      { pair: [
        { type: 'column', title: `Revenue: ₹${n0(A.sales[i20])} cr to ₹${n0(A.sales[b])} cr in six years`, unit: 'Revenue (₹ crore); FY27-29E = GAM', x: 'fin.labels', from: 'FY17', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num', growth: true }], source: SRC.est },
        { type: 'line', title: 'EBITDA margin: 14% to 22% in the cycle; ~20-21% now', unit: 'EBITDA margin excl. other income (%)', x: 'fin.labels', from: 'FY17', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 10, max: 25, source: SRC.est },
      ] },
      { pair: [
        { type: 'column', title: 'EPS: the FY23 hole, then four years of growth; FY27E dips on tax', unit: 'EPS (₹); FY27-29E = GAM, to shareholders', x: [...FYS, ...F.years], series: [{ name: 'Reported', values: [...FYS.map(f => epsRep[2000 + +f.slice(2)]), ...ownersEps.map(v => Math.round(v * 10) / 10)], fmt: 'n1' }, { name: 'Before exceptional items', values: [...exEps, ...ownersEps.map(v => Math.round(v * 10) / 10)], fmt: 'n1' }], labels: 'all', source: 'Screener.in (exceptional items after tax); GAM estimates' },
        { type: 'hbar', title: 'Where each rupee of FY26 revenue went', unit: 'FY26, % of revenue (Screener cost split)', x: ['Materials and purchases', 'Employees', 'Manufacturing', 'Other expenses (incl. R&D 4.2%)', 'EBITDA'], series: [{ name: 'Share', values: [A.materialPct[b], A.employeePct[b], A.manufacturingPct[b], A.otherCostPct[b], A.ebitdaMargin[b]].map(v => Math.round(v * 10) / 10), fmt: 'pct' }], labels: 'all', highlight: 'EBITDA', source: 'Screener.in; AR FY26' },
      ] },
      { exhibit: { type: 'table', title: 'FY24 → FY27E: growth in operations, a reset in tax (₹ crore)', head: ['', 'FY24', 'FY25', 'FY26', 'FY27E', 'Note'], wide: [5], rows: [
        ['Revenue', '{{A.sales.9|num}}', '{{A.sales.10|num}}', '{{A.sales.11|num}}', '{{F.sales.0|num}}', 'FY27E incl. ~₹400 cr of Occlutech'],
        ['EBITDA', '{{A.ebitda.9|num}}', '{{A.ebitda.10|num}}', '{{A.ebitda.11|num}}', '{{F.ebitda.0|num}}', 'Margin 17.8% → 20.4% → 20.0%E'],
        ['Other income (Screener: net of exceptional items)', '{{A.otherIncome.9|num}}', '{{A.otherIncome.10|num}}', '{{A.otherIncome.11|num}}', '{{F.otherIncome.0|num}}', 'FY26 company ₹583 cr before ₹175 cr of exceptional charges'],
        ['Effective tax rate (company)', '10.5%', '12.3%', '18.0%', '31%', 'Sikkim holiday ends; new 25.17% regime; Q1FY27 32.4%'],
        { hl: true, cells: ['**Profit to shareholders**', '**{{A.pat.9|num}}**', '**{{A.pat.10|num}}**', '**{{A.pat.11|num}}**', `**${n0(ownersEps[0] * X.SHARES)}**`, 'FY27E after ~₹30 cr of minorities'] },
        ['EPS reported / before exceptional items (₹)', `${n1(epsRep[2024])} / ${n1(byBase[2024])}`, `${n1(epsRep[2025])} / ${n1(byBase[2025])}`, `${n1(epsRep[2026])} / ${n1(byBase[2026])}`, `${n1(ownersEps[0])}`, `FY27E ${pc(ownersEps[0] / ex26 * 100 - 100)} vs FY26 before exceptional items`],
      ], source: 'Screener.in; Q4FY26 presentation; AR FY24-26 tax notes; GAM' } },
      { callout: `**Our view:** the operating engine is steady rather than spectacular: revenue ~10% a year, EBITDA margin back at 20-21%. What changes in FY27 is tax: the rate jumps from 18% to 30-32%, so EPS to shareholders falls to ₹${n1(ownersEps[0])} on our numbers even though EBITDA grows ~10%. From that lower base we model EPS of ₹${n1(ownersEps[1])} / ₹${n1(ownersEps[2])} for FY28-29E (${Math.round(X.epsCagr)}% a year from FY26's ₹${n1(ex26)} before exceptional items).` },
    ],
  };
})();

const margins = X && (() => {
  const { SQ, Q1, FY26, n1, n0, F } = X;
  return {
    id: 'margins', nav: 'Margins & the tax reset', kicker: 'Profitability', title: 'Gross margin at a ten-year high, EBITDA margin flat: new businesses eat the gain; the tax holiday is over',
    blocks: [
      { p: `Alkem's gross margin (revenue less materials) rose from 59-64% in FY25 to 67.9% in Q1FY27, the best in ten years (MOSL), helped by fewer low-margin trade-generic sales, a weak rupee on export prices and old, cheaper API inventory. Little of it reached EBITDA: the Q1FY27 EBITDA margin was ${n1(Q1.ebitdaMarginPct)}% against ${n1(Q1.ebitdaMarginPrevPct)}% a year earlier, because employee costs rose ${n1(Q1.staffCostGrowthPct)}% (about 1,200 more medical representatives, increments and the new US plant) and other expenses ${n1(Q1.otherExpGrowthPct)}% (the Enzene US plant's ~₹60 cr a quarter of running costs, Occlutech due diligence, overseas costs at a weaker rupee). Management guides a 66.5-67% gross margin for the rest of FY27 as costlier API flows through, and 20-21% EBITDA before Occlutech. Q4 is always weak (14.4% in Q4FY26, 12.4% in Q4FY25) because R&D filings bunch there and Indian sales are seasonally low.` },
      { pair: [
        { type: 'line', title: 'Quarterly margins: gross margin up ~3pp, EBITDA margin not', unit: 'Company-reported (%)', x: SQ.map(q => q.q), series: [{ name: 'Gross margin', values: SQ.map(q => q.grossMarginPct), fmt: 'pct' }, { name: 'EBITDA margin', values: SQ.map(q => q.ebitdaMarginPct), fmt: 'pct' }], labels: 'all', min: 0, max: 75, source: 'Company presentations; MOSL and Choice result notes' },
        { type: 'column', title: 'The tax holiday in one chart: 9-23% for five years, ~31% from FY27', unit: 'Effective tax rate (%), consolidated; FY27-29E = GAM', x: ['FY22', 'FY23', 'FY24', 'FY25', 'FY26', 'Q1FY27', ...F.years], series: [{ name: 'Tax rate', values: [8.9, 22.8, 10.5, 12.3, 18.0, 32.4, 31, 30, 29], fmt: 'pct' }], labels: 'all', highlight: 'Q1FY27', source: 'MOSL result update (15-Aug-2026); AR FY26 note 3.7; GAM' },
      ] },
      { exhibit: { type: 'table', title: 'Why the tax rate jumps: FY26 tax reconciliation and what changes', head: ['', 'FY25', 'FY26', 'FY27E onwards'], wide: [3], rows: [
        ['Statutory rate (old regime)', '34.9%', '34.9%', 'New regime: 25.17% (opted from FY27)'],
        ['Deduction on profits of tax-exempt units (Sikkim, section 80-IE)', '−26.8pp', '−24.0pp', 'Gone: the CFO had guided 35-38% under the old regime as the benefit ran out, and the new regime forgoes it'],
        ['Disallowances, others', '+4.2pp', '+7.1pp', 'Continue'],
        ['Losses with no deferred-tax credit (Enzene US, start-ups)', 'small', 'small', '~+3pp at consolidated level (CFO): 30-32% vs 27-29% standalone'],
        { hl: true, cells: ['**Effective tax rate**', '**12.3%**', '**18.0%**', '**31% / 30% / 29% (GAM, FY27-29E)**'] },
        ['MAT credit carried forward (deferred tax asset)', '₹1,430 cr', `₹${n0(FY26.matCredit)} cr`, 'Can be set off under the new regime (Finance Act 2026): lowers cash tax, not book tax'],
      ], source: 'AR FY26 consolidated note 3.7 (B) and (C); Q4FY26 and Q1FY27 calls' } },
      { callout: `**So what:** the tax step-up is permanent and worth ~13pp of PBT, about ₹${n0(0.13 * FY26.pbtBeforeExceptional)} cr of FY26 profit or ₹${n1(0.13 * FY26.pbtBeforeExceptional / X.SHARES)} a share. It explains the whole FY27 EPS decline. The one consolation is cash: the ₹${n0(FY26.matCredit)} cr MAT credit (₹${n0(FY26.matCredit / X.SHARES)} a share), built up while Sikkim profits were exempt, can now be used, so cash tax should run below book tax for some years. We do not model that (the pace is not disclosed), which makes our net-cash path conservative.` },
    ],
  };
})();

const capital = X && (() => {
  const { A, n0, n1, FY26, C } = X;
  return {
    id: 'capital', nav: 'Capital allocation', kicker: 'Capital allocation', title: 'Capital allocation: steady dividends, rising cash, and a turn towards riskier bets (US CDMO, MedTech)',
    blocks: [
      { p: `Alkem turns most of its profit into cash: cash from operations was ₹${n0(A.cfo[9] + A.cfo[10] + A.cfo[11])} cr over FY24-26, against ₹${n0(A.capex[9] + A.capex[10] + A.capex[11])} cr of capex and ₹${n0(A.dividendsPaid[9] + A.dividendsPaid[10] + A.dividendsPaid[11])} cr of dividends. The dividend is ~25-30% of profit (FY26: ₹53 a share, ₹634 cr). The rest piled up as deposits and bonds (gross treasury ₹${n0(FY26.grossTreasury)} cr at Mar-26). What has changed is where the spare money goes. Since FY24 Alkem has spent on new businesses outside its core: Enzene's $50mn biologics plant in New Jersey (opened Sep-2025; runs at a loss of ~₹240 cr a year before revenue), small orthopaedic device companies (Bombay Ortho, Adroit Biomed), up to ₹1,100 cr for 55% of Occlutech (structural heart devices, closed Jul-2026) plus ~₹200 cr to fund it, and treasury money in real estate (₹75 cr written off in Q4FY26).` },
      { pair: [
        { type: 'column', title: 'Cash from operations vs capex and dividends', unit: '₹ crore', x: 'A.labels', from: 'FY17', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }, { name: 'Dividends', ref: 'A.dividendsPaid', fmt: 'num' }], labels: 'none', source: SRC.co },
        { type: 'line', title: 'ROE: 18-19% in good years, 11% in FY23; ~15-16% ahead (tax)', unit: 'Return on equity (%); FY27-29E = GAM (engine, incl. minorities)', x: 'fin.labels', from: 'FY17', series: [{ name: 'ROE', ref: 'fin.roe', fmt: 'pct' }], labels: 'all', min: 0, max: 30, source: SRC.est },
      ] },
      { exhibit: { type: 'table', title: 'Where the cash went (₹ crore)', head: ['', 'FY24', 'FY25', 'FY26', 'Three years'], rows: [
        ['Cash from operations (Screener)', '{{A.cfo.9|num}}', '{{A.cfo.10|num}}', '{{A.cfo.11|num}}', n0(A.cfo[9] + A.cfo[10] + A.cfo[11])],
        ['Capex (fixed assets bought)', '{{A.capex.9|num}}', '{{A.capex.10|num}}', '{{A.capex.11|num}}', n0(A.capex[9] + A.capex[10] + A.capex[11])],
        ['Dividends', '{{A.dividendsPaid.9|num}}', '{{A.dividendsPaid.10|num}}', '{{A.dividendsPaid.11|num}}', n0(A.dividendsPaid[9] + A.dividendsPaid[10] + A.dividendsPaid[11])],
        { hl: true, cells: ['**Left over (before treasury income)**', `**${n0(A.cfo[9] - A.capex[9] - A.dividendsPaid[9])}**`, `**${n0(A.cfo[10] - A.capex[10] - A.dividendsPaid[10])}**`, `**${n0(A.cfo[11] - A.capex[11] - A.dividendsPaid[11])}**`, `**${n0(A.cfo[9] + A.cfo[10] + A.cfo[11] - A.capex[9] - A.capex[10] - A.capex[11] - A.dividendsPaid[9] - A.dividendsPaid[10] - A.dividendsPaid[11])}**`] },
        ['Memo: Occlutech (FY27, Board ceiling) / Enzene US plant (FY25-26)', '–', '~$50mn over FY25-26', '', 'Occlutech up to ₹1,100 cr + ~₹200 cr'],
      ], source: 'Screener.in cash flow; AR FY26 (Board approvals of 13-Feb-2026); GAM' } },
      { callout: `**The capital question:** Alkem's core business needs little capital, which is why its ROE was 18-19% even with ₹5,000 cr+ of cash earning ~7% pre-tax. The new bets are the opposite: capital-heavy, slow to pay back and outside the promoters' core skill. ${C.enzene.fy26}. Management has ruled out more MedTech deals for now, which is the right call; we would rather see the cash returned than spent on a third new vertical.` },
    ],
  };
})();

const balance = X && (() => {
  const { A, n0, FY26, Q1, ndCo, F } = X;
  return {
    id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: `Balance sheet: ₹${n0(FY26.netCashCompany)} cr of net cash, a long working-capital cycle and ₹${n0(FY26.matCredit)} cr of MAT credit`,
    blocks: [
      { p: `At Mar-26 Alkem held ₹${n0(FY26.grossTreasury)} cr of cash, bank and NBFC deposits, bonds and funds against ₹${n0(FY26.borrowingsExLease)} cr of borrowings (mostly overdrafts secured on its own deposits) and ₹${n0(FY26.leases)} cr of leases: net cash of ₹${n0(FY26.netCashCompany)} cr on the company's definition, ₹${n0(Q1.netCashCompany)} cr at Jun-26. Screener shows only ₹${n0(A.cash[11])} cr of cash and ₹1,869 cr of investments because ₹3,600 cr of deposits sit in "other financial assets"; our model starts from the company's figure (see ALKEM.patch.js). The working-capital cycle is long: inventory of ${A.inventoryDays[11]} days of cost of goods and receivables of ${A.debtorDays[11]} days (trade generics and the US channel need stock and credit). Two non-cash assets deserve a note: a ₹${n0(FY26.deferredTaxAssetNet)} cr deferred tax asset, of which ₹${n0(FY26.matCredit)} cr is MAT credit usable under the new tax regime, and goodwill and intangibles of ~₹925 cr before Occlutech.` },
      { pair: [
        { type: 'column', title: 'Net cash: ₹4,870 cr (Jun-25) to ₹5,764 cr (Jun-26); dips in FY27E (Occlutech)', unit: 'Company net cash (₹ crore), ex-leases; FY27-29E = GAM', x: ['Jun-25', 'Sep-25', 'Mar-26', 'Jun-26', ...F.years], series: [{ name: 'Net cash', values: [4870, 4940, ...[FY26.netCashCompany, Q1.netCashCompany], ...ndCo.slice(1).map(Math.round)], fmt: 'num' }], labels: 'all', highlight: 'Jun-26', source: 'Company presentations; Nuvama (Jun/Sep-25 company figures); GAM' },
        { type: 'line', title: 'Inventory days back up to 239', unit: 'Days (Screener)', x: 'A.labels', from: 'FY17', series: [{ name: 'Inventory days', ref: 'A.inventoryDays', fmt: 'num' }, { name: 'Receivable days', ref: 'A.debtorDays', fmt: 'num' }, { name: 'Payable days', ref: 'A.payableDays', fmt: 'num' }], labels: 'last', source: 'Screener.in' },
      ] },
      { exhibit: { type: 'table', title: 'Treasury at Mar-26: where the cash is (₹ crore)', head: ['Item', 'Mar-25', 'Mar-26', 'Note'], wide: [3], rows: [
        ['Cash and cash equivalents', '304', '248', 'AR note 3.9'],
        ['Bank deposits 3-12 months', '1,259', '1,485', 'AR note 3.10 (₹424 cr under lien for overdrafts)'],
        ['Bank deposits over 12 months', '1,888', '2,428', 'In "other financial assets" (note 3.4)'],
        ['Deposits with NBFCs', '523', '1,165', 'Credit exposure to non-bank lenders'],
        ['Current investments (funds) / bonds and other non-current investments', '902 / 911', '737 / 1,097', 'Debt securities at amortised cost ₹1,386 cr'],
        { hl: true, cells: ['**Gross treasury**', '**5,788**', `**${n0(FY26.grossTreasury)}**`, ''] },
        ['Borrowings (ex-leases)', '1,063', n0(FY26.borrowingsExLease), 'Overdrafts at 5.7-9.0%, partly secured on deposits'],
        { hl: true, cells: ['**Net cash (company basis, Q4FY26 deck)**', '–', `**${n0(FY26.netCashCompany)}**`, 'GAM sum ₹5,536 cr; we use the company figure'] },
      ], source: 'AR FY26 consolidated balance sheet and notes 3.2, 3.4, 3.9, 3.10, 3.13; Q4FY26 presentation' } },
      { callout: '**What to watch:** (1) ₹1,165 cr of the treasury is in NBFC deposits, a credit risk large banks would not carry; (2) the real-estate write-down shows treasury money has gone into non-core assets before; (3) after Occlutech, net cash dips in FY27E and rebuilds to ~₹8,400 cr by Mar-29 on our numbers, about 13% of today\'s market value.' },
    ],
  };
})();

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: promoters below 50% after a run of family sales; Indian funds are the buyers',
  blocks: [
    { pair: [
      { type: 'line', title: 'DIIs up from 16% to 23% since Dec-23; FIIs ~10%', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoters: 56.7% (Dec-23) to 49.7% (Jun-26)', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 40, max: 60, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { p: 'Net profit is profit attributable to shareholders (after minorities) for history. Forecast profit is before minorities (~₹30-60 cr a year; the engine has no minority line); our EPS to shareholders deducts them. Screener nets exceptional items against other income in the history (FY26 −₹175 cr).' },
    { statement: { title: 'Profit & loss, FY15–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 15 }, hl: true }, { key: 'ebitda', name: 'EBITDA', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 200 } }, { key: 'dep', name: 'Depreciation & amortisation', flag: { type: 'pct', th: 30 } },
      { key: 'otherIncome', name: 'Other income (history net of exceptional items)', flag: { type: 'pct', th: 40 } }, { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit (owners; forecasts before minorities)', hl: true, flag: { type: 'pct', th: 25 } }, { key: 'eps', name: 'EPS (₹)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' }, { key: 'capex', name: 'Capex (FY27E incl. Occlutech)', flag: { type: 'pct', th: 60 } },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 15 }, hl: true }, { key: 'ebitda', name: 'EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' }, { key: 'otherIncome', name: 'Other income (net of exceptional)' },
      { key: 'dep', name: 'Depreciation' }, { key: 'interest', name: 'Interest' }, { key: 'pat', name: 'Net profit (owners)', hl: true, yoy: true, flag: { type: 'pct', th: 30 } },
    ] } },
  ],
};

const statementNotes = {};
module.exports = { financials, margins, capital, balance, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  const B = fs.existsSync(path.join(__dirname, 'ALKEM.research.js')) ? require('./ALKEM.research') : null;
  const report = {
    symbol: 'ALKEM', listing: 'NSE: ALKEM · BSE: 539523', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Healthcare',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, margins, capital, balance, ownershipBase, statements }) : [financials, margins, capital, balance, ownershipBase, statements].filter(Boolean),
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections, ${JSON.stringify(report).match(/"type":/g).length} chart/table exhibits`);
}
