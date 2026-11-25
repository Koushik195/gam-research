// Caplin Point report, Part A (2): capital allocation and capex, balance sheet and cash, ownership base, annotated
// statements and their notes. Built on reported financials (Screener, consolidated) and CAPLIPOINT.ctx.js.
const fs = require('fs');
const path = require('path');
const X = fs.existsSync(path.join(__dirname, 'CAPLIPOINT.ctx.js')) ? require('./CAPLIPOINT.ctx') : null;
const FYS = ['FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'];

const capital = X && (() => {
  const { A, ix, n0, n1, FY26, F, AS, C } = X;
  const sum = k => FYS.reduce((s, f) => s + (A[k][ix(f)] || 0), 0);
  const cfo = sum('cfo'), capex = sum('capex'), div = sum('dividendsPaid');
  return {
    id: 'capital', nav: 'Capital allocation & capex', kicker: 'Capital allocation', title: 'Capital allocation: ~₹1,000 cr of plants paid from cash flow, a 9-10% payout, and cash still piling up',
    blocks: [
      { p: `Caplin funds everything itself and pays out little. Over FY20-26 it generated ₹${n0(cfo)} cr of operating cash flow, spent ₹${n0(capex)} cr on capex and paid only ₹${n0(div)} cr of dividends; it has never bought back shares and has no debt. The rest (and the rupee's fall, which lifts the value of its overseas cash and receivables) went into a treasury book that reached ₹${n0(FY26.treasury.gross)} cr at Mar-26. Capex has stepped up: ₹${FY26.capex} cr in FY26, ₹55 cr in Q1FY27, against ₹90-190 cr a year before. The ~₹1,000-1,100 cr programme (half spent by May-2026) adds injectable lines for the US (COL-II, five lines plus three in reserve), a 2x oral-solid and dermatology plant in Pondicherry, an oncology API plant and the oncology formulation plant already running; ₹510 cr was left to spend over 18-24 months from May-2026. Mexico (₹100-125 cr), Chile warehouses and a quality lab come on top. Management also wants acquisitions (a distributor in Mexico or Chile, US ANDAs; 15 ANDAs were bought in FY26) and will pay special dividends only "if we don't find" one (Chairman, 12-Aug-2026).` },
      { pair: [
        { type: 'column', title: 'Operating cash flow covers capex; dividends are small', unit: '₹ crore', x: FYS, series: [{ name: 'Cash from operations', values: FYS.map(f => A.cfo[ix(f)]), fmt: 'num' }, { name: 'Capex', values: FYS.map(f => A.capex[ix(f)]), fmt: 'num' }, { name: 'Dividends paid', values: FYS.map(f => Math.round(A.dividendsPaid[ix(f)] || 0)), fmt: 'num' }], labels: 'none', source: 'Screener.in cash flow' },
        { type: 'line', title: 'ROCE: 24-33%, falling as cash and capital work build up', unit: 'Return on capital employed (%)', x: FYS, series: [{ name: 'ROCE', values: FYS.map(f => A.roce[ix(f)]), fmt: 'pct0' }], labels: 'all', min: 0, max: 40, source: 'Screener.in' },
      ] },
      { exhibit: { type: 'table', title: 'Capex and depreciation: history and our path (₹ crore)', head: ['', 'FY24', 'FY25', 'FY26', ...F.years], rows: [
        ['Capex (cash flow; FY27-29E GAM)', ...['FY24', 'FY25', 'FY26'].map(f => n0(A.capex[ix(f)])), ...AS.capex.map(n0)],
        ['Capex, % of revenue', ...['FY24', 'FY25', 'FY26'].map(f => n1(A.capex[ix(f)] / A.sales[ix(f)] * 100) + '%'), ...AS.capex.map((c, i) => n1(c / F.sales[i] * 100) + '%')],
        ['Depreciation', ...['FY24', 'FY25', 'FY26'].map(f => n0(A.dep[ix(f)])), ...F.dep.map(n0)],
        ['Gross block (year end)', ...['FY24', 'FY25', 'FY26'].map(f => n0(A.grossBlock[ix(f)])), ...F.grossBlock.map(n0)],
        ['Dividend per share (₹)', '5', '6', String(FY26.dps), ...F.dps.map(n1)],
      ], source: 'Screener.in; Q4FY26 call (₹510 cr left of the programme); ICICI Direct Q3FY26 (Mexico ₹100-125 cr); GAM' } },
      { exhibit: { type: 'table', title: 'The plant programme (status at Q1FY27)', head: ['Project', 'Where', 'For', 'Status'], wide: [0, 3], rows: C.projects, source: C.projectsSrc } },
      { callout: `**Our read:** frugal and self-funded, which is good; but returns are being diluted. ROCE fell from 33% in FY20 to ${A.roce[ix('FY26')]}% in FY26 as cash piled up and capital work grew, and the next two years add ~₹600 cr of plants that will earn little before FY29 (US products need 9-10 months of regulatory filings to move to a new line). The payout (${AS.payout[0]}% in our model) is low for a company with ₹${n0(FY26.treasury.gross)} cr of treasury and no debt; the cash mostly waits for an acquisition that has been promised for two years.` },
    ],
  };
})();

const balance = X && (() => {
  const { A, ix, n0, n1, FY26, F, TRS, nc0, Q1, CC } = X;
  const ncS = f => A.cash[ix(f)] + A.investments[ix(f)] - A.borrowings[ix(f)];
  return {
    id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'Balance sheet: ₹1,480 cr of treasury and no debt, but 138 days of receivables and 181 days of inventory',
    blocks: [
      { p: `At Mar-26 Caplin held ₹${n0(TRS.gross)} cr of cash and investments (cash ₹${n0(TRS.cash)} cr, bank deposits ₹${n0(TRS.bankOther)} cr, current investments ₹${n0(TRS.currentInvestments)} cr, non-current investments ₹${n0(TRS.nonCurrentInvestments)} cr), against ₹${n1(TRS.borrowings + TRS.leases)} cr of loans and leases. The company calls ₹${n0(TRS.freeCashCompany)} cr of this "free cash reserves" (₹${n0(Q1.freeCash)} cr at Jun-26). Screener adds the ₹${n1(CC.total)} cr of Caplin Steriles CCPS held by Eight Roads and F-Prime to borrowings, so its net cash (and our engine's) is ₹${n0(nc0)} cr; we keep it that way because the CCPS are a claim on Caplin Steriles, not Caplin Point's equity (governance chapter). **The weak spot is working capital.** Caplin keeps about six months of stock in its own warehouses in Latin America and sells on credit to pharmacies and governments: receivables were ₹${n0(FY26.balance.receivables)} cr (${FY26.balance.receivableDaysCompany} days on the company's measure, ${FY26.balance.receivableDaysExFctr} days excluding currency translation) and inventory ₹${n0(FY26.balance.inventories)} cr at Mar-26. In Q1FY27 inventory rose to ₹${Q1.inventory} cr (a deliberate buffer against the Middle East war) and receivables by ₹46 cr (government supplies), so operating cash flow fell to ₹${Q1.cfo} cr. Bad debts have been "virtually negligible" (Chairman), and much of the book is in dollars or dollar-linked currencies.` },
      { pair: [
        { type: 'column', title: 'Net cash keeps building, even with ₹250-320 cr of capex', unit: 'Net cash (₹ crore): cash + investments − borrowings incl. the ₹217 cr CCPS (Screener / engine basis); FY27-29E = GAM', x: ['FY22', 'FY23', 'FY24', 'FY25', 'FY26', ...F.years], series: [{ name: 'Net cash', values: [...['FY22', 'FY23', 'FY24', 'FY25', 'FY26'].map(ncS), ...F.treasury.map(Math.round)], fmt: 'num' }], labels: 'all', highlight: 'FY26', source: 'Screener.in; GAM (engine)' },
        { type: 'column', title: 'Receivables and inventory grow faster than sales', unit: '₹ crore, year end', x: FYS, series: [{ name: 'Receivables', values: FYS.map(f => A.receivables[ix(f)]), fmt: 'num' }, { name: 'Inventory', values: FYS.map(f => A.inventories[ix(f)]), fmt: 'num' }, { name: 'Payables', values: FYS.map(f => A.payables[ix(f)]), fmt: 'num' }], labels: 'none', source: 'Screener.in balance-sheet schedules' },
      ] },
      { exhibit: { type: 'table', title: 'Cash, claims and our path (₹ crore)', head: ['', 'Mar-25', 'Mar-26', 'Mar-27E', 'Mar-28E', 'Mar-29E'], rows: [
        ['Cash, bank deposits and investments (gross)', n0(TRS.prevGross), n0(TRS.gross), '–', '–', '–'],
        ['Loans and leases', '5', n1(TRS.borrowings + TRS.leases), '–', '–', '–'],
        ['Caplin Steriles CCPS (Eight Roads / F-Prime), at book', n1(CC.total), n1(CC.total), n1(CC.total), n1(CC.total), n1(CC.total)],
        { hl: true, cells: ['**Net cash, Screener / engine basis (after the CCPS)**', `**${n0(ncS('FY25'))}**`, `**${n0(nc0)}**`, ...F.treasury.map(v => `**${n0(v)}**`)] },
        ['Engine working capital, % of revenue', '–', n1(F.owcPct) + '%', n1(F.owcPct) + '%', n1(F.owcPct) + '%', n1(F.owcPct) + '%'],
        ['Dividends paid (year to)', '38', '46', ...F.dividends.map(n0)],
      ], source: 'AR FY26 notes 3, 8, 10, 11, 15-17, 20, 22; Screener.in; GAM. Screener\'s "other assets" also hold ₹125 cr of capital advances and other current assets, so the engine\'s working capital (59% of revenue) ties up 59 paise of every extra rupee of sales: conservative for cash, deliberately' } },
      { callout: `**What to watch.** (1) Receivables: the company is "comfortable" at 100-130 days and expects the Q1 build to be collected by Q3FY27; government tenders (El Salvador, Chile, Mexico) pay slower than pharmacies. (2) Currency: El Salvador, Panama and Ecuador use dollars and Guatemala's currency is stable, but a sharp move in Central American or Chilean currencies would hit both receivables and the ₹${n0(FY26.balance.fctrGain)} cr translation gain booked in FY26. (3) Cash yield: ~6.4% on ₹1,480 cr; management is moving into credit and debt funds.` },
    ],
  };
})();

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: the Paarthipan family owns 70.6%, unchanged for three years; institutions own only ~8%',
  blocks: [
    { pair: [
      { type: 'line', title: 'FIIs up from 3% to ~6%; DIIs ~2.5%', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoters: 70.6%, steady', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 60, max: 75, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { p: 'Net profit is profit to shareholders (Screener "Profit for EPS"; minorities, mainly 31% of the Guatemala distributor, are ₹4-8 cr a year). EBITDA is before other income. Forecast tax includes minorities (engine workaround). Other income in forecasts excludes FX gains.' },
    { statement: { title: 'Profit & loss, FY16–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 20 }, hl: true }, { key: 'ebitda', name: 'EBITDA (before other income)', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 300 } }, { key: 'dep', name: 'Depreciation & amortisation', flag: { type: 'pct', th: 25 } },
      { key: 'otherIncome', name: 'Other income', flag: { type: 'pct', th: 40 } }, { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit to shareholders', hl: true, flag: { type: 'pct', th: 25 } }, { key: 'eps', name: 'EPS (₹)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations', flag: { type: 'pct', th: 40 } }, { key: 'capex', name: 'Capex', flag: { type: 'pct', th: 60 } },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 20 }, hl: true }, { key: 'ebitda', name: 'EBITDA (before other income)' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' }, { key: 'otherIncome', name: 'Other income (incl. FX gains)' },
      { key: 'dep', name: 'Depreciation & amortisation' }, { key: 'pat', name: 'Net profit to shareholders', hl: true },
    ] } },
  ],
};

const statementNotes = {
  'sales@FY21': '+23%: COVID-era demand in Latin America; strong private-market growth.',
  'cfo@FY21': 'Working capital released (receivables collected); CFO ₹269 cr vs ₹45 cr.',
  'ebitdaMargin@FY24': '+250bp to 32.6%: LatAm product pruning; Caplin Steriles profitable.',
  'otherIncome@FY25': '+39%: larger treasury book; ₹20.8 cr FX gain.',
  'sales@FY26': '+13%: Rest of World +9.5% (LatAm +3% in dollars, El Salvador tender in Q4), USA +28%.',
  'pat@FY26': '+20%: margin to 35%; other income ₹116 cr (incl. ₹18.6 cr FX, ₹16.8 cr realised fund gains).',
  'capex@FY26': '₹248 cr: COL-II injectables, oncology plant, Pondicherry OSD; capex programme half done.',
  'sales@Q4FY26': '+19%: ~₹50-55 cr El Salvador tender shipped; US +35%.',
  'sales@Q1FY27': '+20%: Rest of World +18% (tender spill-over, weak rupee), USA +26%.',
  'pat@Q1FY27': '+16% to shareholders; tax 20.5%; depreciation +33% on new plants.',
};

module.exports = { capital, balance, ownershipBase, statements, statementNotes };
