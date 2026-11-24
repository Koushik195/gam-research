// Ajanta Pharma report, Part A (2): capital allocation and capex, balance sheet and cash, ownership base, annotated
// statements and their notes. Built on reported financials (Screener, consolidated) and AJANTPHARM.ctx.js.
const fs = require('fs');
const path = require('path');
const X = fs.existsSync(path.join(__dirname, 'AJANTPHARM.ctx.js')) ? require('./AJANTPHARM.ctx') : null;
const FYS = ['FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'];

const capital = X && (() => {
  const { A, ix, n0, n1, C, FY26, F, AS } = X;
  const sum = k => FYS.reduce((s, f) => s + A[k][ix(f)], 0);
  const cfo = sum('cfo'), capex = sum('capex'), div = sum('dividendsPaid'), bb = 136 + 285.6 + 315 + 285; // FY21, FY22, FY24 (₹315 cr paid Apr-2023), FY25 (AR note 23.7)
  return {
    id: 'capital', nav: 'Capital allocation & capex', kicker: 'Capital allocation', title: 'Capital allocation: self-funded growth, ~80% of free cash returned since FY20, capex rising to ₹400 cr for emerging-market capacity',
    blocks: [
      { p: `Ajanta funds itself and gives most of the rest back. Over FY20-26 it generated ₹${n0(cfo)} cr of operating cash flow, spent ₹${n0(capex)} cr on capex (4-9% of sales), paid ₹${n0(div)} cr of dividends and bought back ₹${n0(bb)} cr of shares (four buybacks, plus ₹100 cr in FY19): about ${Math.round((div + bb) / (cfo - capex) * 100)}% of free cash flow went to shareholders. Payout including buybacks was 79% in FY24 and 76% in FY25 (company). FY26 was different: no buyback, a ₹28 dividend (33% of EPS), and cash flow fell to ₹${n0(FY26.cfo)} cr because the US subsidiary stopped factoring receivables (balance sheet chapter). It has made no acquisitions; ICICI Direct reports a planned ~₹1,000 cr budget to in-license or buy products for India, and in Dec-2025 Ajanta licensed Biocon's semaglutide for 26 emerging markets. Capex is rising: ₹${FY26.capexCompany} cr in FY26 (an oral-solid block and liquid plant at Pithampur, a new Mumbai office) and ~₹400 cr guided for FY27, of which ~₹300 cr expands Pithampur for emerging markets. Ajanta does not disclose capacity or utilisation by plant (gap).` },
      { pair: [
        { type: 'column', title: 'Operating cash flow covers capex and payouts (except FY26)', unit: '₹ crore', x: FYS, series: [{ name: 'Cash from operations', values: FYS.map(f => A.cfo[ix(f)]), fmt: 'num' }, { name: 'Capex', values: FYS.map(f => A.capex[ix(f)]), fmt: 'num' }, { name: 'Dividends paid', values: FYS.map(f => A.dividendsPaid[ix(f)]), fmt: 'num' }], labels: 'none', source: 'Screener.in cash flow' },
        { type: 'line', title: 'ROCE: 23-35%, well above the cost of capital', unit: 'Return on capital employed (%)', x: FYS, series: [{ name: 'ROCE', values: FYS.map(f => A.roce[ix(f)]), fmt: 'pct0' }], labels: 'all', min: 0, max: 40, source: 'Screener.in' },
      ] },
      { exhibit: { type: 'table', title: 'Five buybacks since FY19 (₹ crore)', head: ['Year', 'Terms', 'Amount', 'Share of equity'], rows: [...C.buybacks.map(([y, t, a, s]) => [y, t, n0(a), s]), { hl: true, cells: ['**Total**', '', `**${n0(C.buybacks.reduce((s, x) => s + x[2], 0))}**`, ''] }], source: `${C.buybacksSrc}. Promoter trusts tendered ₹168.8 cr of the FY25 buyback (AR FY26 note 53). FY26 had no buyback.` } },
      { exhibit: { type: 'table', title: 'Capex and depreciation: history and our path (₹ crore)', head: ['', 'FY24', 'FY25', 'FY26', ...F.years], rows: [
        ['Capex (cash flow; FY27-29E GAM)', ...['FY24', 'FY25', 'FY26'].map(f => n0(A.capex[ix(f)])), ...AS.capex.map(n0)],
        ['Capex, % of revenue', ...['FY24', 'FY25', 'FY26'].map(f => n1(A.capex[ix(f)] / A.sales[ix(f)] * 100) + '%'), ...AS.capex.map((c, i) => n1(c / F.sales[i] * 100) + '%')],
        ['Depreciation', ...['FY24', 'FY25', 'FY26'].map(f => n0(A.dep[ix(f)])), ...F.dep.map(n0)],
        ['Gross block (year end)', ...['FY24', 'FY25', 'FY26'].map(f => n0(A.grossBlock[ix(f)])), ...F.grossBlock.map(n0)],
      ], source: 'Screener.in; Q1FY27 call (FY27 ~₹400 cr: ~₹300 cr Pithampur, ~₹100 cr maintenance); GAM (no guidance beyond FY27)' } },
      { callout: `**Our read:** a disciplined allocator: no empire-building, high returns, regular buybacks. Two things to watch. First, the payout fell to a third in FY26 as working capital absorbed cash; we model ${AS.payout.join(' / ')}% for FY27-29E (the ₹32 first interim for FY27 is already ~34% of our EPS), which still lets net cash build. Second, a ₹1,000 cr in-licensing or acquisition push would be new for Ajanta: done well it extends the India portfolio; done badly it dilutes 30%+ returns.` },
    ],
  };
})();

const balance = X && (() => {
  const { A, ix, n0, n1, FY26, F, TRS, nc0 } = X;
  const ncS = f => A.cash[ix(f)] + A.investments[ix(f)] - A.borrowings[ix(f)];
  return {
    id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'Balance sheet: net cash, almost no contingent liabilities, but working capital jumped when factoring stopped (receivables 94 → 125 days)',
    blocks: [
      { p: `At Mar-26 Ajanta held ₹${n0(TRS.cash + TRS.currentInvestments + TRS.bankOther)} cr of cash and current investments (debt funds ₹${n0(TRS.mutualFunds)} cr, NCDs ₹${n0(TRS.ncds)} cr, commercial paper ₹${n0(TRS.cps)} cr, cash ₹${n0(TRS.cash)} cr) against ₹${n0(FY26.borrowings)} cr of working-capital loans and ₹${FY26.leases} cr of leases: net cash of ₹${n0(FY26.netCashCompany)} cr on the company's definition (₹${n0(FY26.netCashCompanyPrev)} cr at Mar-25), ₹${n0(nc0)} cr on Screener's (after leases, including a ₹${n1(TRS.llpStake)} cr unlisted stake). The loans are new: in FY26 the US subsidiary stopped selling its receivables to factors and borrowed against them instead. Receivables rose from ₹${n0(FY26.receivablesPrev)} cr to ₹${n0(FY26.receivables)} cr (${FY26.receivableDaysPrev} → ${FY26.receivableDays} days on the company's measure) and operating cash flow halved; management calls 125 days "the new normal" and says the interest is offset by investment income. Inventory improved (${FY26.inventoryDaysPrev} → ${FY26.inventoryDays} days). Contingent liabilities are only ₹8 cr (AR note 55), plus two patent cases and the pending income-tax search. CARE rates Ajanta AA+/Stable.` },
      { pair: [
        { type: 'column', title: 'Net cash: buybacks keep it modest; our path builds it', unit: 'Net cash (₹ crore), cash + investments − borrowings incl. leases (Screener basis); FY27-29E = GAM', x: ['FY22', 'FY23', 'FY24', 'FY25', 'FY26', ...F.years], series: [{ name: 'Net cash', values: [...['FY22', 'FY23', 'FY24', 'FY25', 'FY26'].map(ncS), ...F.treasury.map(Math.round)], fmt: 'num' }], labels: 'all', highlight: 'FY26', source: 'Screener.in; GAM (engine)' },
        { type: 'column', title: 'Receivables jumped in FY26 as factoring ended', unit: '₹ crore, year end', x: FYS, series: [{ name: 'Receivables', values: FYS.map(f => A.receivables[ix(f)]), fmt: 'num' }, { name: 'Inventory', values: FYS.map(f => A.inventories[ix(f)]), fmt: 'num' }, { name: 'Payables', values: FYS.map(f => A.payables[ix(f)]), fmt: 'num' }], labels: 'none', source: 'Screener.in balance-sheet schedules' },
      ] },
      { exhibit: { type: 'table', title: 'Cash, debt and our path (₹ crore)', head: ['', 'Mar-25', 'Mar-26', 'Mar-27E', 'Mar-28E', 'Mar-29E'], rows: [
        ['Cash and current investments', n0(TRS.prevCash + TRS.prevCurrentInvestments), n0(TRS.cash + TRS.currentInvestments), '–', '–', '–'],
        ['Working-capital loans (US subsidiary)', '3', n0(FY26.borrowings), '–', '–', '–'],
        ['Net cash, company definition (ex leases)', n0(FY26.netCashCompanyPrev), n0(FY26.netCashCompany), '–', '–', '–'],
        { hl: true, cells: ['**Net cash, Screener / engine basis (after leases)**', `**${n0(ncS('FY25'))}**`, `**${n0(nc0)}**`, ...F.treasury.map(v => `**${n0(v)}**`)] },
        ['Engine working capital, % of revenue', '27%', n1(F.owcPct) + '%', n1(F.owcPct) + '%', n1(F.owcPct) + '%', n1(F.owcPct) + '%'],
        ['Dividends paid (year to)', '349', '350', ...F.dividends.map(n0)],
      ], source: 'AR FY26 notes 15, 48 (capital management) and MD&A; Screener.in; GAM. The engine holds working capital at its FY26 share of revenue (36%), so every ₹100 of extra sales ties up ₹36' } },
      { callout: '**What to watch.** (1) Receivables: 125 days is a lot for a business whose US customers are large distributors such as Cencora; if the loans are repaid and factoring does not return, cash conversion should recover only slowly. (2) The forward hedge book: hedging 50-75% of net FX exposure for 6-18 months (CARE) produces the gross gains and losses in the P&L. (3) The income-tax search (Aug-2025) has no provision; the block-period return showed no undisclosed income.' },
    ],
  };
})();

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: the Agrawal family owns 63.5% after a Jun-2026 sale; domestic funds are the buyers; 14% of the company is pledged',
  blocks: [
    { pair: [
      { type: 'line', title: 'DIIs up from 17% to 22%; FIIs down to under 8%', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoters: 66.3% → 63.5% (Jun-2026 block)', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 55, max: 70, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { p: 'Net profit is profit to shareholders (Ajanta has no minority interests). Screener\'s annual operating profit is before the FX hedge loss and its annual other income is net of it (FY26: −₹103 cr pre-tax, shown by Screener as an exceptional item); its quarterly EBITDA is after the loss and quarterly other income includes FX gains. Forecasts assume net FX of nil.' },
    { statement: { title: 'Profit & loss, FY15–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 15 }, hl: true }, { key: 'ebitda', name: 'EBITDA (before FX hedge losses)', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 300 } }, { key: 'dep', name: 'Depreciation & amortisation', flag: { type: 'pct', th: 25 } },
      { key: 'otherIncome', name: 'Other income (history net of FX hedge losses)', flag: { type: 'pct', th: 50 } }, { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit', hl: true, flag: { type: 'pct', th: 20 } }, { key: 'eps', name: 'EPS (₹)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations', flag: { type: 'pct', th: 40 } }, { key: 'capex', name: 'Capex', flag: { type: 'pct', th: 60 } },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 20 }, hl: true }, { key: 'ebitda', name: 'EBITDA (after FX hedge losses)' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' }, { key: 'otherIncome', name: 'Other income (incl. FX gains)' },
      { key: 'dep', name: 'Depreciation & amortisation' }, { key: 'interest', name: 'Interest' }, { key: 'pat', name: 'Net profit', hl: true },
    ] } },
  ],
};

const statementNotes = {
  'ebitdaMargin@FY21': '34.6%: COVID year; travel and promotion spending fell.',
  'pat@FY21': '+40%: margin spike.',
  'ebitdaMargin@FY23': '−630bp to 21.6%: raw-material and freight inflation; continued field-force hiring.',
  'pat@FY23': '−18%: the only profit decline in the period.',
  'ebitdaMargin@FY24': '27.8%: costs normalised; branded growth.',
  'pat@FY24': '+39%: margin recovery; buyback of ₹315 cr paid.',
  'sales@FY26': '+17%: US +49% (eight launches in 15 months, strong flu season); India +14%; Asia −1% (Middle East war).',
  'otherIncome@FY26': 'Screener nets the ₹103 cr hedge loss against the company\'s ₹172 cr (incl. ₹97 cr FX gain).',
  'cfo@FY26': '−54%: receivables +₹671 cr as the US subsidiary stopped factoring (borrowed ₹212 cr instead).',
  'opm@Q4FY26': '23%: ₹42 cr hedge loss inside expenses; 26% before it.',
  'otherIncome@Q4FY26': 'Includes ₹44 cr FX gain.',
  'sales@Q1FY27': '+25%: India +24%, US +57%, Africa branded +29%; Asia −16%.',
  'otherIncome@Q1FY27': 'Includes ₹50 cr FX gain; ₹31 cr hedge loss sits in expenses.',
  'pat@Q1FY27': '+31%; tax rate 25.2%.',
};

module.exports = { capital, balance, ownershipBase, statements, statementNotes };
