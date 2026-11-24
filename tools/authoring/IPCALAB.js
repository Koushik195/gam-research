// Authoring source for the Ipca Laboratories initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated; Net Profit on the attributable basis and
// the NCI/deferred-tax working-capital workaround, see IPCALAB.patch.js). Part B (IPCALAB.research.js + part2-6, shared
// IPCALAB.ctx.js) adds the research chapters. Usage: node tools/authoring/IPCALAB.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'IPCALAB', 'research');
const X = fs.existsSync(path.join(__dirname, 'IPCALAB.ctx.js')) ? require('./IPCALAB.ctx') : null;
const n0 = v => Math.round(v).toLocaleString('en-IN');

const FYS = ['FY19', 'FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'];
const IX = l => X.A.labels.indexOf(l);
const financials = X && (() => {
  const { A, FY26, epsBase, epsRep, n1, epsU, UD } = X;
  const sl = k => FYS.map(l => A[k][IX(l)]);
  const exEps = [null, null, null, null, 18.58, 25.82, 35.14, 46.94];
  return {
    id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Revenue ×2.6 since FY19, but margins went round a full cycle: 29% in the COVID year, 15% in FY23, 23% again in Q1FY27',
    blocks: [
      { p: `Ipca's revenue grew from ₹3,746 cr in FY19 to ₹9,599 cr in FY26 (14% a year), in three phases. **FY19-21:** a boom, as anti-malarial and hydroxychloroquine demand peaked with COVID-19 and API prices rose; EBITDA margin reached 28.8% and EPS ₹44.9 in FY21. **FY22-23:** the bust: hydroxychloroquine normalised, institutional anti-malarial tenders shrank, API prices fell while solvent and raw-material costs rose; margin fell to 15.0% and EPS to ₹18.6 in FY23 (−47%). **FY24-26:** the rebuild: Unichem (consolidated from Sep-2023) added ~₹1,500-2,300 cr of revenue at low margins, while Ipca's own business recovered: standalone margin ${FY26.standaloneMarginNote}. Consolidated margin climbed from 17.3% (FY24) to 20.7% (FY26) and 22.9% in Q1FY27 (company basis). EPS to shareholders was ₹${epsRep[2026]} in FY26 (₹${n1(epsBase[2026])} before exceptional items and the one-off Bayshore gain), back to the FY21 peak five years later.` },
      { pair: [
        { type: 'column', title: 'Revenue: ₹3,746 cr to ₹9,599 cr; Unichem from FY24', unit: 'Revenue (₹ crore), Screener basis', x: FYS, series: [{ name: 'Revenue', values: sl('sales'), fmt: 'num' }], labels: 'all', highlight: 'FY26', source: 'Screener.in (consolidated)' },
        { type: 'line', title: 'EBITDA margin: a full cycle in five years', unit: 'EBITDA margin (%), revenue less operating costs', x: [...FYS, 'Q1FY27'], series: [{ name: 'EBITDA margin', values: [...sl('ebitdaMargin').map(v => Math.round(v * 10) / 10), 22.9], fmt: 'pct' }], labels: 'all', min: 10, max: 32, source: 'Screener.in; Q1FY27 = company basis (ex forex gain)' },
      ] },
      { pair: [
        { type: 'hbar', title: 'Where each rupee of FY26 revenue went', unit: 'FY26, % of revenue (Screener)', x: ['Materials and purchases', 'Employees', 'Other expenses (R&D, promotion, freight, power)', 'EBITDA'], series: [{ name: 'Share', values: [29.4, 22.5, 27.4, 20.7], fmt: 'pct' }], labels: 'all', highlight: 'EBITDA', source: 'Screener.in cost split; AR FY26 P&L' },
        { type: 'column', title: 'EPS: back to the FY21 peak, five years later', unit: 'EPS (₹)', x: FYS, series: [{ name: 'Reported', values: sl('eps').map(v => Math.round(v * 10) / 10), fmt: 'n1' }, { name: 'Before exceptional items (company)', values: exEps, fmt: 'n1' }], labels: 'all', source: 'Screener.in; AR FY24 and FY26 note 34' },
      ] },
      { exhibit: { type: 'table', title: 'FY24 → FY26: Unichem in, margins up, exceptional items down (₹ crore)', head: ['', 'FY24', 'FY25', 'FY26', 'Note'], wide: [4], rows: [
        ['Revenue', '{{A.sales.9|num}}', '{{A.sales.10|num}}', '{{A.sales.11|num}}', 'Unichem from Sep-2023; FY26 +8% (institutional −24%)'],
        ['EBITDA', '{{A.ebitda.9|num}}', '{{A.ebitda.10|num}}', '{{A.ebitda.11|num}}', 'Ipca standalone margin 22.7% → 25.2% in FY26; Unichem 12.6% → 8.6%'],
        ['Depreciation & amortisation', '{{A.dep.9|num}}', '{{A.dep.10|num}}', '{{A.dep.11|num}}', 'Unichem plants and fair-value step-ups'],
        ['Finance cost', '{{A.interest.9|num}}', '{{A.interest.10|num}}', '{{A.interest.11|num}}', 'Deal debt repaid by FY26'],
        ['Other income (incl. exceptional items, JV share)', '{{A.otherIncome.9|num}}', '{{A.otherIncome.10|num}}', '{{A.otherIncome.11|num}}', 'Exceptional −₹108 / −205 / −86 cr; FY26 +₹60 cr Bayshore gain'],
        ['Minorities', '−24 (share of Unichem\'s loss)', '48', '43', '47.33% of Unichem, 41.12% of Trophic'],
        { hl: true, cells: ['**Profit to shareholders**', '**{{A.pat.9|num}}**', '**{{A.pat.10|num}}**', '**{{A.pat.11|num}}**', ''] },
        ['EPS reported / before exceptional items (₹)', `${epsRep[2024]} / 25.82`, `${epsRep[2025]} / 35.14`, `${epsRep[2026]} / 46.94`, `FY26 also before the Bayshore gain: ₹${n1(epsBase[2026])}`],
      ], source: 'Screener.in; AR FY24 and FY26 notes 24, 32, 34; Q4FY26 call; Unichem margins from Screener (UNICHEMLAB)' } },
      { callout: `**Our view:** Ipca's own business is in a good phase (standalone margin 26% in Q1FY27, the highest since FY21) and Unichem is starting to help rather than hurt (11% margin in Q1FY27 vs 4% a year earlier). But this is a cyclical company: anti-malarials, APIs and tenders swing, and FY21-23 showed how fast. We forecast EPS to shareholders of ₹${n1(epsU[0])} / ${n1(epsU[1])} / ${n1(epsU[2])} for FY27-29E, a ${Math.round(X.epsCagr)}% CAGR from FY26's ₹${n1(epsBase[2026])} on the same basis, with margins rising to {{F.ebitdaMargin.2|pct}}, still below management's 25-26% ambition.` },
    ],
  };
})();

const capital = X && (() => {
  const { UD, stakeMv, uniMcap, n1 } = X;
  return {
    id: 'capital', nav: 'Capital allocation', kicker: 'Capital allocation', title: 'Capital allocation: self-funded capex and one big deal (Unichem, ₹1,543 cr); two small bets on Krebs and Lyka went badly',
    blocks: [
      { p: `Ipca funds itself. Over FY22-26 it generated ₹5,070 cr of operating cash flow and spent ₹2,816 cr on capex (6-9% of revenue: APIs, new formulation plants, biotech), ₹406 cr on dividends (₹4 a share a year, ₹6 for FY26) and ₹1,543 cr on Unichem. Borrowings rose to ₹1,481 cr by Mar-23 (cash then ₹1,853 cr) and the cash went on Unichem in FY24; debt was back to ₹704 cr (plus leases) by Mar-26, of which ₹469 cr sits in Unichem. Return on capital followed the cycle: ROCE 31% in FY21, 11% in FY23, 17% in FY26 (Screener).` },
      { pair: [
        { type: 'column', title: 'Operating cash flow covers capex and dividends', unit: '₹ crore', x: FYS, series: [{ name: 'Cash from operations', values: FYS.map(l => X.A.cfo[IX(l)]), fmt: 'num' }, { name: 'Capex', values: FYS.map(l => X.A.capex[IX(l)]), fmt: 'num' }], labels: 'none', source: 'Screener.in cash flow' },
        { type: 'line', title: 'ROCE: 31% → 11% → 17%', unit: 'Return on capital employed (%)', x: FYS, series: [{ name: 'ROCE', values: FYS.map(l => X.A.roce[IX(l)]), fmt: 'pct0' }], labels: 'all', min: 0, max: 35, source: 'Screener.in' },
      ] },
      { exhibit: { type: 'table', title: 'Where the cash went, FY24-FY26 (₹ crore)', head: ['', 'FY24', 'FY25', 'FY26'], rows: [
        ['Cash from operations', '{{A.cfo.9|num}}', '{{A.cfo.10|num}}', '{{A.cfo.11|num}}'],
        ['Capex', '{{A.capex.9|num}}', '{{A.capex.10|num}}', '{{A.capex.11|num}}'],
        ['Unichem purchase and other investing (net)', '−934', '−90', '+374 (Unichem land, plant sales)'],
        ['Dividends', '{{A.dividendsPaid.9|num}}', '{{A.dividendsPaid.10|num}}', '{{A.dividendsPaid.11|num}}'],
        ['Interest paid', '134', '74', '82'],
        { hl: true, cells: ['**Net borrowing raised / (repaid)**', '**−357**', '**−94**', '**−603**'] },
      ], source: 'Screener.in cash-flow schedules; AR FY24 and FY26' } },
      { exhibit: { type: 'table', title: 'The three acquisitions since FY22', head: ['Deal', 'What Ipca paid', 'What it got', 'Result so far'], wide: [2, 3], rows: [
        ['Unichem Laboratories (Apr-Sep 2023)', `₹${n0(UD.costCr)} cr for ${UD.stakePct}% (block from the promoters at ₹402-440 a share plus a 19.29% open offer at ₹440)`, 'A US generics business (Goa plant, Unichem USA front end), Europe (Niche), Brazil, South Africa and APIs; ~₹1,340 cr of revenue and an EBITDA loss in FY23', `Revenue ₹2,202 cr and 8.6% margin in FY26, 11% in Q1FY27; the stake is worth ₹${n0(stakeMv)} cr at ₹${UD.close30Sep} (+${Math.round((stakeMv / UD.costCr - 1) * 100)}%); EU fine and interest ₹184 cr charged (₹126 cr in FY24, ₹58 cr in FY26); Ipca's US products now sold through Unichem USA`],
        ['Krebs Biochemicals (49.65%; stake raised to FY22)', 'Equity, ₹130 cr of preference shares, loans and guarantees', 'A fermentation API maker that supplies an API for Ipca\'s largest brand', '₹130 cr impaired (FY24-25); now being merged into Ipca (board approval 26-Jun-2026)'],
        ['Lyka Labs (40.98%, Nov-2021)', '₹196 cr carrying value (AR FY26)', 'Injectables: animal health, critical care, IVF', 'Revenue flat, EBITDA negative as it builds field forces (Q1FY27 call); shares at ₹83.21 on 30-Sep-2026'],
      ], source: 'AR FY26 (investments note, note 32); Ipca filings (Apr and Sep 2023); Q4FY26 and Q1FY27 calls; NSE closes 30-Sep-2026' } },
      { callout: `**The Unichem arithmetic.** Ipca paid ₹${n0(UD.costCr)} cr for 52.67%, valuing the whole company at ~₹2,930 cr, for a business that lost money at the EBITDA level in FY23. Three years on, Unichem's market value is ₹${n0(uniMcap)} cr and its margin has gone from negative to 11%. The deal is working, slowly: the US front end lets Ipca sell its own approved products (Unichem's US sales +27% in Q1FY27, mostly Ipca's), but Unichem's own portfolio grew only 9% and its plants are still under-used (Goa at 35-40% utilisation, HDFC Securities, Feb-2026). It has not yet earned its cost of capital: Ipca's share of Unichem's profit was roughly ₹${n0(X.TB.unichemPat[0] * UD.stakePct / 100)} cr in our FY27E, a ~${n1(X.TB.unichemPat[0] * UD.stakePct / 100 / UD.costCr * 100)}% return on the price.` },
    ],
  };
})();

const balance = X && (() => {
  const { FY26, grossCash, DEBT, netCashOwn, F, n1, UD, ASSOC_BOOK } = X;
  return {
    id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'Balance sheet: net cash again, but working capital is heavy (~144 days) and Unichem keeps its own debt',
    blocks: [
      { p: `At Mar-26 Ipca had ₹${n0(grossCash[0])} cr of cash, bank deposits and liquid funds (of which Unichem ₹${FY26.balance.unichemCash} cr) against ₹${n0(FY26.balance.borrowingsExLeases)} cr of borrowings (Unichem ₹${FY26.balance.unichemBorrowings} cr, mostly working-capital lines; Ipca ₹235 cr of cheap term loans) and ₹${n0(FY26.balance.leases)} cr of leases: net cash of ₹${n0(grossCash[0] - DEBT[0])} cr including leases (₹${n0(grossCash[0] - DEBT[0] + ASSOC_BOOK)} cr on Screener's basis, which also counts the ₹184 cr Krebs and Lyka stakes). Ipca repaid ~US$50 mn of dollar loans before the rupee fell and its term loans were ~₹193 cr at Jun-26, falling to ~₹70 cr by Mar-27. On our numbers net cash rises to ₹${netCashOwn.map(n0).join(' / ')} cr at Mar-27/28/29. The weak spot is working capital: inventory ₹2,731 cr and receivables ₹2,014 cr against payables of ₹940 cr; net working capital is ~39% of revenue (~144 days, PL), because Ipca carries large API, raw-material and export inventories, and Unichem's US business adds stock in transit.` },
      { pair: [
        { type: 'column', title: 'Net cash: spent on Unichem in FY24, rebuilt since', unit: 'Net cash (₹ crore), cash + liquid investments − borrowings incl. leases; FY27-29E = GAM', x: ['FY22', 'FY23', 'FY24', 'FY25', 'FY26', ...X.YRS], series: [{ name: 'Net cash', values: [823, 998, -279, -39, Math.round(grossCash[0] - DEBT[0] + ASSOC_BOOK), ...netCashOwn.map(v => Math.round(v + ASSOC_BOOK))], fmt: 'num' }], labels: 'all', highlight: 'FY26', source: 'Screener.in (Screener basis incl. associate stakes); GAM (engine path plus the minorities\' cash kept in Unichem/Trophic)' },
        { type: 'line', title: 'Working capital days: high and not falling', unit: 'Days (Screener)', x: FYS, series: [{ name: 'Inventory days', values: FYS.map(l => X.A.inventoryDays[IX(l)]), fmt: 'num' }, { name: 'Receivable days', values: FYS.map(l => X.A.debtorDays[IX(l)]), fmt: 'num' }], labels: 'last', source: 'Screener.in (inventory days on material cost)' },
      ] },
      { exhibit: { type: 'table', title: 'Debt, cash and our path (₹ crore)', head: ['', 'Mar-26', 'Mar-27E', 'Mar-28E', 'Mar-29E'], rows: [
        ['Unichem borrowings (held flat)', n0(FY26.balance.unichemBorrowings), n0(FY26.balance.unichemBorrowings), n0(FY26.balance.unichemBorrowings), n0(FY26.balance.unichemBorrowings)],
        ['Ipca term loans', '235', '70', '–', '–'],
        ['Leases', n0(FY26.balance.leases), n0(FY26.balance.leases), n0(FY26.balance.leases), n0(FY26.balance.leases)],
        ['Gross borrowings incl. leases', ...DEBT.map(n0)],
        ['Cash, deposits and liquid funds', ...grossCash.map(n0)],
        { hl: true, cells: ['**Net cash (ex associate stakes)**', ...[grossCash[0] - DEBT[0], ...netCashOwn].map(v => `**${n0(v)}**`)] },
        ['Interest (year to; model)', '76', ...F.interest.map(n0)],
      ], source: 'AR FY26 notes 15, 20, 35; Screener (UNICHEMLAB); Q1FY27 call; GAM. Cash path = engine net cash + minorities\' cash kept in the subsidiaries + gross debt − ₹184 cr associate stakes (IPCALAB.ctx.js).' } },
      { callout: '**What to watch.** (1) Working capital: Ipca\'s own has been flat for two years (management), but group days have not improved; every 10 days of revenue is ~₹300 cr of cash. (2) Unichem\'s ₹469 cr of debt sits next to ₹295 cr of its own cash; folding Unichem into Ipca one day would simplify this, but no merger had been proposed by 30-Sep-2026. (3) Contingent liabilities are small (₹249 cr, AR FY26 note 38). India Ratings rates Ipca IND AA+/Stable.' },
    ],
  };
})();

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: the Godha and Chandurkar families own 44.7%; domestic mutual funds own almost a third',
  blocks: [
    { pair: [
      { type: 'line', title: 'Domestic institutions have kept adding', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoters: 46.3% → 44.7% (Dec-2024 sale)', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 40, max: 50, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { p: 'Net profit is profit attributable to shareholders (after minorities). Other income in the history includes exceptional items and the share of JV/associates, as Screener reports it. In the forecasts the tax line carries tax plus minorities (₹80-129 cr a year), so profit and EPS are to Ipca\'s shareholders. FY26 net cash in Screener-derived history rows is overstated by the ₹1,685 cr working-capital offset (IPCALAB.patch.js); the model\'s own net cash is ₹600 cr.' },
    { statement: { title: 'Profit & loss, FY15–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 15 }, hl: true }, { key: 'ebitda', name: 'EBITDA', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 200 } }, { key: 'dep', name: 'Depreciation & amortisation' },
      { key: 'otherIncome', name: 'Other income (history incl. exceptional items)' }, { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit (owners)', hl: true, flag: { type: 'pct', th: 25 } }, { key: 'eps', name: 'EPS (₹)', fmt: 'n1' },
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
  const B = fs.existsSync(path.join(__dirname, 'IPCALAB.research.js')) ? require('./IPCALAB.research') : null;
  const report = {
    symbol: 'IPCALAB', listing: 'NSE: IPCALAB · BSE: 524494', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Healthcare',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements].filter(Boolean),
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
