// Authoring source for the Dr Lal PathLabs initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated; Net Profit on the attributable basis,
// see LALPATHLAB.patch.js). Part B (LALPATHLAB.research.js + part2-6, shared LALPATHLAB.ctx.js) adds the research chapters.
// Usage: node tools/authoring/LALPATHLAB.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'LALPATHLAB', 'research');
const X = fs.existsSync(path.join(__dirname, 'LALPATHLAB.ctx.js')) ? require('./LALPATHLAB.ctx') : null;
const n0 = v => Math.round(v).toLocaleString('en-IN');

const FYS = ['FY19', 'FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'];
const IX = l => X.A.labels.indexOf(l);
const financials = X && (() => {
  const { A, FY26, epsBase, epsRep, epsU, n1, epsCagr, SA } = X;
  const sl = k => FYS.map(l => A[k][IX(l)]);
  const exEps = FYS.map(l => (l === 'FY25' ? Math.round(epsBase[2025] * 10) / 10 : l === 'FY26' ? Math.round(epsBase[2026] * 10) / 10 : null));
  const cost = v => Math.round(v / FY26.revenue * 1000) / 10;
  return {
    id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Revenue ×2.3 since FY19 and margins back at 28%, but the COVID boom and bust means EPS only regained its FY22 level in FY24',
    blocks: [
      { p: `Dr Lal's revenue grew from ₹1,203 cr in FY19 to ₹2,763 cr in FY26 (13% a year), in three phases. **FY20-22: the COVID boom.** RT-PCR testing (₹242 cr of revenue in FY22) and the Suburban acquisition (consolidated from Nov-2021) took revenue up 32% in FY22 and EPS to ₹20.7. **FY23: the bust.** COVID testing fell to ₹25 cr, revenue fell 3%, and a full year of Suburban's acquisition amortisation and loan interest cut EPS 31% to ₹14.3. **FY24-26: steady rebuild.** Organic growth of 10-12%, margins back to 27-28% on operating leverage, and the Suburban loan repaid; EPS ₹21.4 → ₹${epsRep[2025]} → ₹${epsRep[2026]} (₹${n1(epsBase[2025])} and ₹${n1(epsBase[2026])} before a one-time tax credit in FY25 and the labour-code charge in FY26). Over the whole period the business has been remarkably steady underneath: gross margin ~80% and cash conversion above 100% of EBITDA before tax in every year.` },
      { pair: [
        { type: 'column', title: 'Revenue: ₹1,203 cr to ₹2,763 cr; the FY22 COVID bump is visible', unit: 'Revenue (₹ crore), Screener basis', x: FYS, series: [{ name: 'Revenue', values: sl('sales'), fmt: 'num' }], labels: 'all', highlight: 'FY26', source: 'Screener.in (consolidated)' },
        { type: 'line', title: 'EBITDA margin: 24% in FY23, 28% again since FY25, 31% in Q1FY27', unit: 'EBITDA margin (%), before the FY26 labour-code charge', x: [...FYS, 'Q1FY27'], series: [{ name: 'EBITDA margin', values: [...sl('ebitdaMargin').map(v => Math.round(v * 10) / 10), 31.0], fmt: 'pct' }], labels: 'all', min: 20, max: 33, source: 'Screener.in; Q1FY27 results' },
      ] },
      { pair: [
        { type: 'hbar', title: 'Where each rupee of FY26 revenue went', unit: 'FY26, % of revenue from operations (company)', x: ['Reagents and consumables', 'Employees (incl. ESOP)', 'Fees to collection centres', 'Other expenses', 'EBITDA before labour code'], series: [{ name: 'Share', values: [cost(534.6), cost(503.3), cost(402.4), cost(540.1), 28.3], fmt: 'pct' }], labels: 'all', highlight: 'EBITDA before labour code', source: 'AR FY26 consolidated P&L (₹2,762.9 cr revenue)' },
        { type: 'column', title: 'EPS: the FY23 dip, then +120% in three years', unit: 'EPS (₹, bonus-adjusted)', x: FYS, series: [{ name: 'Reported', values: sl('eps').map(v => Math.round(v * 10) / 10), fmt: 'n1' }, { name: 'Before exceptional items', values: exEps, fmt: 'n1' }], labels: 'all', source: 'Screener.in; AR FY26 notes 33-34; Q4FY26 PPT' },
      ] },
      { exhibit: { type: 'table', title: 'FY24 → FY26: steady growth, two one-offs (₹ crore)', head: ['', 'FY24', 'FY25', 'FY26', 'Note'], wide: [4], rows: [
        ['Revenue', '{{A.sales.9|num}}', '{{A.sales.10|num}}', '{{A.sales.11|num}}', 'Patients +2.6% / +4.3% / +5.3%; revenue per patient +7.6% / +6.0% / +6.7%'],
        ['EBITDA (before labour code)', '{{A.ebitda.9|num}}', '{{A.ebitda.10|num}}', '{{A.ebitda.11|num}}', 'Company reported ₹752 cr in FY26 after the ₹30.1 cr labour-code charge'],
        ['Depreciation & amortisation', '{{A.dep.9|num}}', '{{A.dep.10|num}}', '{{A.dep.11|num}}', `FY26 incl. ₹${n1(X.acq26)} cr of Suburban acquisition amortisation (brand ₹39 cr ends in FY27)`],
        ['Finance cost', '{{A.interest.9|num}}', '{{A.interest.10|num}}', '{{A.interest.11|num}}', 'Lease interest only after the Suburban loan was repaid (FY25)'],
        ['Other income (Screener, net of exceptional)', '{{A.otherIncome.9|num}}', '{{A.otherIncome.10|num}}', '{{A.otherIncome.11|num}}', 'FY26 ₹101 cr less the ₹30 cr labour-code charge'],
        ['Tax rate (%)', '{{A.taxPct.9|num}}', '{{A.taxPct.10|num}}', '{{A.taxPct.11|num}}', 'FY25 incl. a ₹40.8 cr deferred-tax credit; FY26 a ₹12.2 cr prior-year credit'],
        { hl: true, cells: ['**Profit to shareholders**', '**{{A.pat.9|num}}**', '**{{A.pat.10|num}}**', '**{{A.pat.11|num}}**', 'After ₹4.6-5.1 cr of minorities'] },
        ['EPS reported / before exceptional items (₹)', `${epsRep[2024]} / ${epsRep[2024]}`, `${epsRep[2025]} / ${n1(epsBase[2025])}`, `${epsRep[2026]} / ${n1(epsBase[2026])}`, 'Company normalised PAT ₹451 cr (FY25), ₹532 cr (FY26)'],
      ], source: 'Screener.in; AR FY26 consolidated statements and notes 27-34; Q4FY26 PPT' } },
      { callout: `**Our view:** this is a dependable compounder with no balance-sheet risk, not a high-growth story. Underlying EPS grew ~${Math.round(X.histEpsCagr)}% a year from the FY22 COVID peak to FY26. FY27 starts much faster (Q1 revenue +19%, profit +27%) on volumes, mix and a government rate revision. We forecast EPS of ₹${n1(epsU[0])} / ${n1(epsU[1])} / ${n1(epsU[2])} for FY27-29E, a ${Math.round(epsCagr)}% CAGR from FY26's ₹${n1(epsBase[2026])} before exceptional items, helped by the end of Suburban's brand amortisation and a growing cash pile.` },
    ],
  };
})();

const capital = X && (() => {
  const { A, n1, FY26, SNG } = X;
  return {
    id: 'capital', nav: 'Capital allocation', kicker: 'Capital allocation', title: 'Capital allocation: light capex, ~45% payouts and one big deal (Suburban, ₹925 cr) that has not yet earned its keep',
    blocks: [
      { p: `Diagnostics needs little capital: a lab is machines (often placed by reagent suppliers), leased premises and people, and most collection centres are franchised. Dr Lal generated ₹2,196 cr of operating cash flow in FY23-26 and spent ₹329 cr on capex (₹173 cr in FY26 alone, including a property for a new precision-diagnostics lab), ₹734 cr on dividends and ₹345 cr repaying the Suburban loan; the rest built cash from ₹601 cr (Mar-23) to ₹1,526 cr (Mar-26) and ₹1,693 cr (Jun-26). Return on capital excluding cash is very high (44% in FY26, company); including the cash and the ₹548 cr of Suburban goodwill, Screener's ROCE is 28%.` },
      { pair: [
        { type: 'column', title: 'Operating cash flow dwarfs capex', unit: '₹ crore', x: FYS, series: [{ name: 'Cash from operations', values: FYS.map(l => A.cfo[IX(l)]), fmt: 'num' }, { name: 'Capex', values: FYS.map(l => A.capex[IX(l)]), fmt: 'num' }], labels: 'none', source: 'Screener.in cash flow (FY22 capex includes assets bought with Suburban)' },
        { type: 'line', title: 'ROCE: 33% → 18% → 28%; the dip was Suburban and COVID', unit: 'Return on capital employed (%), Screener', x: FYS, series: [{ name: 'ROCE', values: FYS.map(l => A.roce[IX(l)]), fmt: 'pct0' }], labels: 'all', min: 0, max: 40, source: 'Screener.in' },
      ] },
      { exhibit: { type: 'table', title: 'Where the cash went, FY24-FY26 (₹ crore)', head: ['', 'FY24', 'FY25', 'FY26'], rows: [
        ['Cash from operations', '{{A.cfo.9|num}}', '{{A.cfo.10|num}}', '{{A.cfo.11|num}}'],
        ['Capex (PPE and software)', '{{A.capex.9|num}}', '{{A.capex.10|num}}', '{{A.capex.11|num}}'],
        ['Lease payments (principal + interest)', '–', '53', '60'],
        ['Suburban loan repaid', '153', '83', '–'],
        ['Dividends', '{{A.dividendsPaid.9|num}}', '{{A.dividendsPaid.10|num}}', '{{A.dividendsPaid.11|num}}'],
        { hl: true, cells: ['**Cash and investments at year-end (company)**', '**877**', '**1,229**', '**1,526**'] },
      ], source: 'Screener.in cash-flow schedules; AR FY26 cash-flow statement and note 30a; Q1FY27 PPT p.11' } },
      { exhibit: { type: 'table', title: 'Acquisitions since FY22', head: ['Deal', 'Price', 'What it brought', 'Result so far'], wide: [2, 3], rows: [
        ['Suburban Diagnostics, Mumbai (Nov-2021, 100%)', '₹925 cr EV (18.5x FY22 EBITDA)', 'A West-India brand: FY21 revenue ₹294 cr, EBITDA ₹57.5 cr (incl. COVID)', `West's share of revenue 15% (FY24-25) → 14% (FY26); ~3 weak quarters after an IT/LIMS change and a move to franchised collection; liquidated into the parent Mar-2025 (₹40.8 cr tax credit); 'very close double digits' growth in Q1FY27; ₹548 cr goodwill and ₹${n1(X.acq26)} cr a year of amortisation in FY26`],
        ['Shahbazkers Diagnostic Centre, Mumbai (FY27)', 'Up to ₹20 cr', 'One lab in a Mumbai micro-market; FY26 revenue ₹6.1 cr', 'Too small to matter; a template for bolt-ons'],
        ['Sunshine Healthcare, Ghana (80%; approved 24-Jul-2026)', '≤ GHS 45.6 mn (~₹38 cr)', 'First African business, via the Dubai holding company', 'Completion reported 26-Sep-2026; financials not disclosed'],
        ['Neuome Technologies (30%; Jul-2026)', '≤ ₹3.5 cr', 'Sample preservation and bio-banking start-up', 'Operational, not financial'],
        ['SN Genelab, Gujarat (70%; approved 24-Sep-2026)', `Up to ₹${SNG.cash} cr in cash; earn-out up to ₹${SNG.earnout} cr`, `Genomics lab; revenue ₹43 / 53 / 58 cr in FY24-26; ~${SNG.evEbitda}x FY26 EV/EBITDA (Emkay)`, 'Close expected by 30-Nov-2026; not in our base forecasts'],
      ], source: 'Business Today (Oct-2021); AR FY26 notes 4, 5, 41; Q4FY26 and Q1FY27 calls; Kotak Neo and Emkay (Sep-2026); Zerodha filings feed' } },
      { callout: `**The Suburban arithmetic.** Dr Lal paid ₹925 cr (18.5x EBITDA) for Suburban in 2021, when its own shares traded at ~72x trailing earnings (Screener), so the deal was cheap relative to Dr Lal's own rating. But the point was to build a second home market in Mumbai and the West, and five years on the West is 14% of revenue, down from 15% in FY24-25 (earlier splits were not retrieved); the company no longer reports Suburban separately, so its return cannot be measured. The next test is the cash pile: ₹1,693 cr at Jun-2026, with M&A (larger platforms in the South and West) named as the main use. Every ₹1,000 cr spent on a deal gives up ~₹${n0(1000 * X.TY / 100 * 0.746)} cr a year of post-tax treasury income, so a deal needs a post-tax return above ~5% from year one just to be neutral for EPS.` },
    ],
  };
})();

const balance = X && (() => {
  const { n1, FY26, grossCash, netCash, LEASES, YRS, F } = X;
  return {
    id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'Balance sheet: debt-free, ₹1,526 cr of cash and negative working capital; the only liabilities are leases',
    blocks: [
      { p: `At Mar-26 Dr Lal held ₹${n0(FY26.treasury.total)} cr of cash, bank deposits and liquid funds (cash ₹${n0(FY26.treasury.cash)} cr, other bank balances ₹${n0(FY26.treasury.otherBank)} cr, money-market funds ₹${n0(FY26.treasury.currentInvestments)} cr and ₹${n0(FY26.treasury.nonCurrentBank)} cr of deposits longer than a year) and no borrowings; lease liabilities were ₹${n0(FY26.leases.total)} cr. Net cash after leases was ₹${n0(netCash[0])} cr, 4% of the market value. Working capital is negative: patients pay upfront, receivables are ~15 days (mostly B2B and government), inventory is ~30 days of reagents, and suppliers are paid in ~120 days, so growth releases cash. The weak spots are small: ₹548 cr of goodwill and ₹191 cr of intangibles, mostly from Suburban (29% of net worth together), and imported reagents bought from Indian distributors (currency risk, but no dollar debt). On our numbers net cash after leases rises to ₹${netCash.slice(1).map(n0).join(' / ')} cr at Mar-27/28/29 before the SN Genelab and Ghana payments (~₹206 cr).` },
      { pair: [
        { type: 'column', title: 'Cash and investments: ₹601 cr to ₹1,693 cr in three years', unit: '₹ crore (company: cash, deposits and liquid funds); FY27-29E = GAM, gross of leases', x: ['FY23', 'FY24', 'FY25', 'FY26', 'Q1FY27', ...YRS], series: [{ name: 'Cash and investments', values: [601, 877, 1229, 1526, 1693, ...grossCash.slice(1).map(v => Math.round(v))], fmt: 'num' }], labels: 'all', highlight: 'FY26', source: 'Q1FY27 PPT p.11; GAM (engine net cash plus lease liabilities)' },
        { type: 'line', title: 'Cash conversion cycle: negative every year', unit: 'Days (Screener)', x: FYS, series: [{ name: 'Receivable days', values: FYS.map(l => X.A.debtorDays[IX(l)]), fmt: 'num' }, { name: 'Cash conversion cycle', values: FYS.map(l => X.A.ccc[IX(l)]), fmt: 'num' }], labels: 'last', source: 'Screener.in (inventory and payable days on material cost)' },
      ] },
      { exhibit: { type: 'table', title: 'Cash, leases and our path (₹ crore)', head: ['', 'Mar-26', 'Mar-27E', 'Mar-28E', 'Mar-29E'], rows: [
        ['Cash, deposits and liquid funds', ...grossCash.map(n0)],
        ['Lease liabilities', ...LEASES.map(n0)],
        { hl: true, cells: ['**Net cash after leases (engine)**', ...netCash.map(v => `**${n0(v)}**`)] },
        ['Interest (lease, model)', n1(FY26.financeCost.total), ...F.interest.map(n1)],
        ['Memo: SN Genelab + Ghana payments (not modelled)', '–', '~206', '~206', '~206'],
      ], source: 'AR FY26 notes 7, 12, 14, 15, 30a, 41 (leases); GAM. Engine net cash = cash + investments + non-current deposits − lease liabilities; new leases are treated as capex.' } },
      { callout: '**What to watch.** (1) Use of cash: M&A is the stated priority; the size and price of the next deal matter more than any other balance-sheet item. (2) Leases rose from ₹157 cr to ₹199 cr in FY26 with 14 new labs; 12-15 more a year keep them rising. (3) Tax: a Jul-2026 appellate order allowed a ₹32.7 cr ESOP deduction (possible refund, not forecast). CARE upgraded the issuer rating to AA+/Stable on 1-Apr-2026.' },
    ],
  };
})();

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: the Lal family owns 53%; domestic funds have replaced foreign investors since 2024',
  blocks: [
    { pair: [
      { type: 'line', title: 'FIIs out, domestic institutions in', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoters: 54.6% → 53.2%', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 50, max: 56, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { p: 'Net profit is profit attributable to shareholders (after ~₹5 cr a year of minorities). Other income in the history is Screener\'s, net of exceptional items (FY26: the ₹30.1 cr labour-code charge). EPS is bonus-adjusted (1:1 bonus, Dec-2025). In the forecasts the tax line carries tax plus minorities (₹5.5-6.5 cr), so profit and EPS are to Dr Lal\'s shareholders; capex includes new leases.' },
    { statement: { title: 'Profit & loss, FY15–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 15 }, hl: true }, { key: 'ebitda', name: 'EBITDA', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 200 } }, { key: 'dep', name: 'Depreciation & amortisation' },
      { key: 'otherIncome', name: 'Other income (history net of exceptional items)' }, { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit (owners)', hl: true, flag: { type: 'pct', th: 25 } }, { key: 'eps', name: 'EPS (₹)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' }, { key: 'capex', name: 'Capex (forecasts incl. new leases)' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 15 }, hl: true }, { key: 'ebitda', name: 'EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' }, { key: 'otherIncome', name: 'Other income incl. exceptional' },
      { key: 'dep', name: 'Depreciation & amortisation' }, { key: 'interest', name: 'Interest' }, { key: 'pat', name: 'Net profit (owners)', hl: true },
    ] } },
  ],
};

const statementNotes = {};
module.exports = { financials, capital, balance, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  const B = fs.existsSync(path.join(__dirname, 'LALPATHLAB.research.js')) ? require('./LALPATHLAB.research') : null;
  const report = {
    symbol: 'LALPATHLAB', listing: 'NSE: LALPATHLAB · BSE: 539524', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Healthcare',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements].filter(Boolean),
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
