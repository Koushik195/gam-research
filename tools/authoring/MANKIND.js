// Authoring source for the Mankind Pharma initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated; Net Profit on the attributable basis
// and the Mar-2015 column dropped, see MANKIND.patch.js). Part B (MANKIND.research.js + part2-6, shared MANKIND.ctx.js)
// adds the research chapters. Usage: node tools/authoring/MANKIND.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'MANKIND', 'research');
const X = fs.existsSync(path.join(__dirname, 'MANKIND.ctx.js')) ? require('./MANKIND.ctx') : null;
const n0 = v => Math.round(v).toLocaleString('en-IN');

const FYS = ['FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'];
const financials = X && (() => {
  const { A, FY26, EXC_AT, SHR, epsRep, byBase, amortPs, ppaPs, adjEps, ownersEps, n1 } = X;
  const exEps = [2020, 2021, 2022, 2023, 2024, 2025, 2026].map((y, i) => Math.round((A.eps[i] - (EXC_AT[y] || 0) / (A.pat[i] / A.eps[i])) * 10) / 10);
  return {
    id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Revenue ×2.4 since FY20, margins flat at ~25%; the BSV deal lifted revenue by a sixth but took EPS sideways for two years',
    blocks: [
      { p: `Mankind's revenue grew from ₹5,865 cr in FY20 to ₹14,278 cr in FY26 (16% a year), with two step-ups: the domestic franchise compounding at ~12-13% and, from 23-Oct-2024, Bharat Serums and Vaccines (BSV, ~13% of revenue). EBITDA margin has barely moved: 24.5% in FY20, 21.7% in FY23 (raw-material inflation and price controls), 25.4% in FY26, because Mankind reinvests scale in its field force and brands. **Profit is where the deal shows.** FY24 profit to shareholders was ₹1,913 cr (EPS ₹47.75); FY26 was the same ₹1,913 cr (EPS ₹46.34) on 3% more shares, as the deal added ~₹450 cr a year of non-cash amortisation, finance cost jumped from ₹34 cr to ₹639 cr and other income fell when ₹13,768 cr of cash and debt went to the sellers. Before exceptional items and the BSV amortisation, FY26 EPS was ₹${n1(byBase[2026])}, up ${Math.round((byBase[2026] / exEps[4] - 1) * 100)}% on FY24's ₹${n1(exEps[4])}.` },
      { pair: [
        { type: 'column', title: 'Revenue: ₹5,865 cr to ₹14,278 cr in six years', unit: 'Revenue (₹ crore); BSV from 23-Oct-2024', x: FYS, series: [{ name: 'Revenue', values: A.sales, fmt: 'num' }], labels: 'all', highlight: 'FY26', source: 'Screener.in (consolidated)' },
        { type: 'line', title: 'EBITDA margin: a 22-27% range, no trend', unit: 'EBITDA margin (%), revenue less operating costs', x: FYS, series: [{ name: 'EBITDA margin', values: A.ebitdaMargin.map(v => Math.round(v * 10) / 10), fmt: 'pct' }], labels: 'all', min: 15, max: 30, source: 'Screener.in (before exceptional items)' },
      ] },
      { pair: [
        { type: 'hbar', title: 'Where each rupee of FY26 revenue went', unit: 'FY26, % of revenue', x: ['Materials and purchases', 'Employees', 'Other expenses (incl. R&D 2.8%)', 'EBITDA'], series: [{ name: 'Share', values: [28.4, 22.3, 23.9, 25.4], fmt: 'pct' }], labels: 'all', highlight: 'EBITDA', source: 'Screener.in cost split; AR FY26 P&L' },
        { type: 'column', title: 'EPS: flat for three years on a reported basis', unit: 'EPS (₹)', x: FYS, series: [{ name: 'Reported', values: A.eps, fmt: 'n1' }, { name: 'Before exceptional items', values: exEps, fmt: 'n1' }], labels: 'all', source: 'Screener.in (exceptional items after tax per Screener)' },
      ] },
      { exhibit: { type: 'table', title: 'FY24 → FY26: what the BSV deal did to the P&L (₹ crore)', head: ['', 'FY24', 'FY25', 'FY26', 'Note'], wide: [4], rows: [
        ['Revenue', '{{A.sales.4|num}}', '{{A.sales.5|num}}', '{{A.sales.6|num}}', 'BSV for 160 days in FY25, full year in FY26'],
        ['EBITDA (before exceptional items)', '{{A.ebitda.4|num}}', '{{A.ebitda.5|num}}', '{{A.ebitda.6|num}}', 'Company adjusted EBITDA FY26 ₹3,629 cr'],
        ['Depreciation & amortisation', '{{A.dep.4|num}}', '{{A.dep.5|num}}', '{{A.dep.6|num}}', 'Intangible amortisation ₹162 → 362 → 594 cr'],
        ['Finance cost', '{{A.interest.4|num}}', '{{A.interest.5|num}}', '{{A.interest.6|num}}', '₹5,000 cr NCDs at ~8% plus commercial paper'],
        ['Other income (incl. exceptional items)', '{{A.otherIncome.4|num}}', '{{A.otherIncome.5|num}}', '{{A.otherIncome.6|num}}', 'FY25: ₹164 cr Mahananda gain; FY26: −₹130 cr exceptional'],
        ['Tax rate', '22%', '20%', '17%', 'Sikkim exemption, ended in FY27'],
        { hl: true, cells: ['**Profit to shareholders**', '**{{A.pat.4|num}}**', '**{{A.pat.5|num}}**', '**{{A.pat.6|num}}**', ''] },
        ['EPS reported / before exceptional and BSV amortisation (₹)', `${epsRep[2024]} / ${n1(exEps[4])}`, `${epsRep[2025]} / ${n1(byBase[2025])}`, `${epsRep[2026]} / ${n1(byBase[2026])}`, `Amortisation ₹${n1(amortPs(2025))} (FY25) and ₹${n1(amortPs(2026))} (FY26) a share after its tax credit`],
      ], source: 'Screener.in; AR FY25-26 notes 30, 34, 35, 63; GAM' } },
      { callout: `**Our view:** the operating engine is steady rather than spectacular: revenue +12-17% a year, margins flat at ~25%. The deal reset per-share earnings and the tax rate resets them again in FY27 (16.9% → ~25%), so reported EPS is a poor guide to the trend. We forecast EPS to shareholders of ₹${n1(ownersEps[0])} / ${n1(ownersEps[1])} / ${n1(ownersEps[2])} for FY27-29E and ₹${n1(adjEps[0])} / ${n1(adjEps[1])} / ${n1(adjEps[2])} before the BSV amortisation (₹${n1(ppaPs)} a share a year).` },
    ],
  };
})();

const capital = X && (() => {
  const { DEAL, FY26, n1 } = X;
  return {
    id: 'capital', nav: 'Capital allocation', kicker: 'Capital allocation', title: 'One big bet: ₹13,768 cr for BSV at ~28x EBITDA, funded with debt, a QIP and an asset sale; returns fell from ~26% to 14%',
    blocks: [
      { p: 'Until 2024 Mankind was a cash machine with a clean balance sheet: net cash of ~₹3,070 cr at Mar-24 (Screener basis), modest capex (₹390-830 cr a year), no dividends, and one bolt-on (Panacea Biotec\'s specialty brands, FY22). BSV changed that. Mankind paid ₹13,768 cr (enterprise value ₹13,630 cr at signing on 25-Jul-2024, completed 23-Oct-2024) for a business with FY24 revenue of ₹1,723 cr and adjusted EBITDA of ₹489 cr: ~28x EBITDA, a little below the ~30x trailing EV/EBITDA at which Mankind itself traded at the time (Screener). It funded the deal with ₹5,000 cr of NCDs and up to ₹5,000 cr of commercial paper, then retired debt with a ₹3,000 cr QIP (Dec-2024, 1.19 cr shares at ₹2,520, +3% dilution) and ₹562 cr from selling Mahananda Spa & Resorts to Chalet Hotels (Feb-2025). Of the price, ₹6,473 cr (47%) is goodwill and ₹8,253 cr finite-life intangibles.' },
      { pair: [
        { type: 'column', title: 'Cash from operations has grown with EBITDA', unit: '₹ crore', x: FYS, series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }], labels: 'none', source: 'Screener.in cash flow (FY22 capex includes the Panacea brands)' },
        { type: 'line', title: 'ROCE: from 37% to 14% after the deal', unit: 'Return on capital employed (%)', x: FYS.slice(1), series: [{ name: 'ROCE', values: [37, 32, 22, 26, 17, 14], fmt: 'pct0' }], labels: 'all', min: 0, max: 45, source: 'Screener.in (company: 12% reported, 41% excluding the BSV acquisition)' },
      ] },
      { exhibit: { type: 'table', title: 'Where the cash went, FY24-FY26 (₹ crore)', head: ['', 'FY24', 'FY25', 'FY26'], rows: [
        ['Cash from operations', '{{A.cfo.4|num}}', '{{A.cfo.5|num}}', '{{A.cfo.6|num}}'],
        ['Capex', '{{A.capex.4|num}}', '{{A.capex.5|num}}', '{{A.capex.6|num}}'],
        ['BSV acquisition (net of cash acquired)', '–', '13,768', '–'],
        ['QIP proceeds / Mahananda sale', '–', '2,963 / 562', '21 (ESOPs) / –'],
        ['Interest paid', '26', '98', '669'],
        ['Dividends', '–', '–', '41'],
        { hl: true, cells: ['**Net borrowing raised / (repaid)**', '**+34**', '**+7,378**', '**−2,240**'] },
      ], source: 'Screener.in cash-flow schedules; AR FY25 notes 53-54' } },
      { callout: `**The BSV arithmetic.** At ~28x FY24 EBITDA the deal earns an EBITDA yield of ~3.6% on its price before synergies, against ~8% pre-tax on the NCDs that funded it, and the amortisation (~₹${DEAL.ppa.amortisationPerYearCr} cr a year) is not tax-deductible. It creates value only if BSV's specialty brands compound at high teens for years (Q1FY27: +21%) and Mankind's reach lifts BSV's margin. Management has not quantified synergies; HDFC Securities flagged them as delayed in Feb-2026. The company's "ROCE excluding the acquisition" (41%) shows the base business is excellent; the reported 12% shows what shareholders actually earn on the capital now employed.` },
    ],
  };
})();

const balance = X && (() => {
  const { ndCo, lev, grossDebt, grossCash, intBuild, ND_CO0, DTL_UNWIND, YRS, F, OTHER_DEBT, n1 } = X;
  return {
    id: 'balance', nav: 'Debt & deleveraging', kicker: 'Balance sheet', title: 'Net debt from ₹5,784 cr to ₹3,377 cr in five quarters; on our numbers Mankind is net cash by Mar-28',
    blocks: [
      { p: `Borrowings were ₹6,204 cr at Mar-26 (company): the three acquisition NCDs (₹5,000 cr face; ₹1,250 cr at 7.99% repaid on 16-Apr-2026, ₹1,250 cr at 7.99% due 16-Oct-2026, ₹2,500 cr at 7.97% due 16-Nov-2027; secured by a pledge of BSV shares), ₹639 cr of working-capital loans, ₹74 cr of term loans and ₹339 cr of loans from related parties, against ₹2,272 cr of cash, deposits and liquid funds. Net debt was ₹${n0(ND_CO0)} cr (1.1x adjusted EBITDA) and ₹3,377 cr at Jun-26 (0.9x). Management says the acquisition debt will be repaid by FY28. Our path, which adds back the ~₹${n0(DTL_UNWIND)} cr a year of tax the engine does not see (the BSV amortisation is not deductible), gives net debt of ₹${n0(ndCo[1])} cr at Mar-27 and net cash of ₹${n0(-ndCo[2])} cr at Mar-28 and ₹${n0(-ndCo[3])} cr at Mar-29, funded entirely by free cash flow.` },
      { pair: [
        { type: 'column', title: 'Net debt: falling ~₹480 cr a quarter', unit: 'Net debt (₹ crore), company definition', x: ['Mar-25', 'Jun-25', 'Sep-25', 'Dec-25', 'Mar-26', 'Jun-26'], series: [{ name: 'Net debt', values: [5784, 5249, 4791, 4294, 3932, 3377], fmt: 'num' }], labels: 'all', highlight: 'Jun-26', source: 'Company investor presentations (Q4FY26, Q1FY27)' },
        { type: 'line', title: 'Net debt / EBITDA: 1.8x to 0.9x; net cash by FY28E', unit: 'Net debt ÷ EBITDA (x); FY27-29E = GAM path', x: ['Mar-25', 'Mar-26', 'Jun-26', ...YRS], series: [{ name: 'Net debt / EBITDA', values: [1.8, 1.1, 0.9, ...lev.slice(1).map(v => Math.round(v * 100) / 100)], fmt: 'x' }], labels: 'all', min: -1, max: 2, source: 'Company decks (adjusted EBITDA); GAM Research' },
      ] },
      { exhibit: { type: 'table', title: 'Debt maturities and our deleveraging path (₹ crore)', head: ['', 'Mar-26', 'Mar-27E', 'Mar-28E', 'Mar-29E'], rows: [
        ['Acquisition NCDs outstanding (face)', '5,000', '2,500', '–', '–'],
        ['Other borrowings (working capital, related-party, term loans)', n0(OTHER_DEBT), n0(OTHER_DEBT), n0(OTHER_DEBT), n0(OTHER_DEBT)],
        ['Gross borrowings (ex-leases)', ...grossDebt.map(n0)],
        ['Cash, deposits and liquid funds', ...grossCash.map(n0)],
        { hl: true, cells: ['**Net debt / (net cash), company basis**', ...ndCo.map(v => `**${v >= 0 ? n0(v) : '(' + n0(-v) + ')'}**`)] },
        ['Net debt / EBITDA', ...lev.map(v => v.toFixed(2) + 'x')],
        ['Interest (year to; model)', '639', ...F.interest.map(n0)],
      ], source: 'AR FY26 note 22; GAM Research. Interest built from the NCD coupons and dates plus 7.5% on other borrowings, leases and other finance costs (checked against the model in MANKIND.ctx.js).' } },
      { callout: '**What to watch.** (1) The ₹2,500 cr NCD due Nov-2027 is the last acquisition debt; we assume it is repaid from cash, not refinanced. (2) ₹339 cr of loans from promoter-related parties sit inside consolidated borrowings (rates not disclosed). (3) Once net cash, Mankind will either restart dealmaking (management calls BSV a platform for complex products) or raise payouts from today\'s token ₹1 a share; our forecasts assume neither.' },
    ],
  };
})();

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: the Juneja and Arora families own 72.6%; the private-equity overhang is gone',
  blocks: [
    { pair: [
      { type: 'line', title: 'Domestic institutions have replaced foreign ones', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoters: 76.5% → 72.6% (MPS sale, QIP)', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 60, max: 80, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { p: 'Net profit is profit attributable to shareholders (after minorities). FY24-FY25 are continuing operations. Other income in the history includes exceptional items (FY25 +₹166 cr, FY26 −₹132 cr per Screener). Forecast profit includes ~₹27-33 cr a year of minorities\' share (no minority line in the engine); our EPS to shareholders deducts it.' },
    { statement: { title: 'Profit & loss, FY20–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 15 }, hl: true }, { key: 'ebitda', name: 'EBITDA', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 200 } }, { key: 'dep', name: 'Depreciation & amortisation (incl. BSV)' },
      { key: 'otherIncome', name: 'Other income (history incl. exceptional items)' }, { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit (owners; forecasts before minorities)', hl: true, flag: { type: 'pct', th: 25 } }, { key: 'eps', name: 'EPS (₹)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' }, { key: 'capex', name: 'Capex' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 20 }, hl: true }, { key: 'ebitda', name: 'EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' }, { key: 'otherIncome', name: 'Other income incl. exceptional' },
      { key: 'dep', name: 'Depreciation & amortisation' }, { key: 'interest', name: 'Interest' }, { key: 'pat', name: 'Net profit (owners)', hl: true },
    ] } },
  ],
};

const statementNotes = {};
module.exports = { financials, capital, balance, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  const B = fs.existsSync(path.join(__dirname, 'MANKIND.research.js')) ? require('./MANKIND.research') : null;
  const report = {
    symbol: 'MANKIND', listing: 'NSE: MANKIND · BSE: 543904', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Healthcare',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements].filter(Boolean),
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
