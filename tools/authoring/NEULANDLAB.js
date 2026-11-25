// Authoring source for the Neuland Laboratories initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated; no minorities, so Net Profit = attributable
// profit and no patch is needed). Part B (NEULANDLAB.research.js + part2-6, shared NEULANDLAB.ctx.js / ctx2.js) adds the research
// chapters, cover, rating and statement notes. Usage: node tools/authoring/NEULANDLAB.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'NEULANDLAB', 'research');
const X = fs.existsSync(path.join(__dirname, 'NEULANDLAB.ctx2.js')) ? require('./NEULANDLAB.ctx2') : null;
const n0 = v => Math.round(v).toLocaleString('en-IN');
const FYS = ['FY17', 'FY18', 'FY19', 'FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'];

const financials = X && (() => {
  const { A, epsRep, epsU, n1, ai, salesCagr10, eps25ex, OIN, SA } = X;
  const at = (k, y) => A[k][ai(y)];
  return {
    id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Ten years in three acts: idle capacity (FY18-20), the CMS step-up (FY23-24), then a doubling of CMS in FY26; EPS ₹13 to ₹284',
    blocks: [
      { p: `Neuland's revenue grew from ₹510 cr in FY16 to ₹2,023 cr in FY26, ${n1(salesCagr10)}% a year, but in three very different acts. **Act one (FY18-FY20):** it bought Unit III in 2017 before it had orders to fill it; revenue stalled and the EBITDA margin fell to 9-14%, with EPS of ₹13. **Act two (FY23-FY24):** innovator molecules it had supplied in clinical trials were approved and ordered commercially; CMS revenue went from ₹282 cr (FY22) to ₹765 cr (FY24), the margin rose to 30% and EPS to ₹234. **Act three (FY26):** after a flat FY25 (revenue −5%, flagged in advance by management), CMS nearly doubled to ₹1,244 cr and EPS reached ₹284, while the generic API business shrank. FY25 reported EPS (₹202.7) includes a ₹76.4 cr gain on transferring a Hyderabad property; before it, EPS was ~₹${n1(eps25ex)}.` },
      { pair: [
        { type: 'column', title: 'Revenue: ₹579 cr to ₹2,023 cr, with flat years in FY18, FY22 and FY25', unit: 'Revenue (₹ crore)', x: FYS, series: [{ name: 'Revenue', values: FYS.map(y => at('sales', y)), fmt: 'num' }], labels: 'all', highlight: 'FY26', source: 'Screener.in (consolidated)' },
        { type: 'line', title: 'EBITDA margin: 9% (FY19) to 30% (FY24), 22% (FY25), 29% (FY26)', unit: 'EBITDA margin (%), before other income', x: FYS, series: [{ name: 'EBITDA margin', values: FYS.map(y => Math.round(at('ebitdaMargin', y) * 10) / 10), fmt: 'pct' }], labels: 'all', min: 0, max: 40, source: 'Screener.in' },
      ] },
      { pair: [
        { type: 'column', title: 'EPS: ₹13 (FY20) to ₹284 (FY26); FY25 includes a property gain', unit: 'EPS (₹), reported', x: FYS, series: [{ name: 'EPS', values: FYS.map(y => epsRep[2000 + +y.slice(2)]), fmt: 'n1' }], labels: 'all', source: 'Screener.in (FY25 includes the ₹76.4 cr gain on the Nanakramguda property; ~₹149 before it)' },
        { type: 'line', title: 'Return on equity: 2-11% in FY18-22, 18-26% since', unit: 'Return on equity (%)', x: FYS, series: [{ name: 'ROE', values: FYS.map(y => Math.round(at('roe', y) * 10) / 10), fmt: 'pct' }], labels: 'all', min: 0, max: 35, source: 'Screener.in (net profit ÷ average equity)' },
      ] },
      { exhibit: { type: 'table', title: 'FY24 → FY26: where the profit came from (₹ crore)', head: ['', 'FY24', 'FY25', 'FY26', 'Note'], wide: [4], rows: [
        ['Revenue', '{{A.sales.9|num}}', '{{A.sales.10|num}}', '{{A.sales.11|num}}', `CMS ₹765 → 637 → 1,244 cr; Prime + Specialty ₹${n0(SA[2].gds)} → ${n0(SA[3].gds)} → ${n0(SA[4].gds)} cr`],
        ['Material cost (% of revenue)', `${SA[2].materialPct}%`, `${SA[3].materialPct}%`, `${SA[4].materialPct}%`, 'Mix: CMS commercial molecules carry richer margins'],
        ['EBITDA before other income', '{{A.ebitda.9|num}}', '{{A.ebitda.10|num}}', '{{A.ebitda.11|num}}', 'Margin 29.7% → 22.4% → 28.7%'],
        ['Other income (Screener: incl. the FY25 gain, net of asset-sale losses)', '{{A.otherIncome.9|num}}', '{{A.otherIncome.10|num}}', '{{A.otherIncome.11|num}}', `FY26 (company): interest ₹${n1(OIN.FY26.interestFd + OIN.FY26.interestDeposits)} cr, fund gains ₹${n1(OIN.FY26.mfGain)} cr, forex ₹${n1(OIN.FY26.forex)} cr`],
        ['Depreciation', '{{A.dep.9|num}}', '{{A.dep.10|num}}', '{{A.dep.11|num}}', 'New blocks and the R&D-centre lease'],
        ['Finance cost', '{{A.interest.9|num}}', '{{A.interest.10|num}}', '{{A.interest.11|num}}', 'FY26: leases ₹7.0 cr, borrowings ₹11.7 cr'],
        { hl: true, cells: ['**Net profit**', '**{{A.pat.9|num}}**', '**{{A.pat.10|num}}**', '**{{A.pat.11|num}}**', 'No minorities'] },
        ['EPS (₹)', String(epsRep[2024]), String(epsRep[2025]), String(epsRep[2026]), `₹${n1(eps25ex)} in FY25 before the property gain (GAM estimate)`],
      ], source: 'Screener.in; AR FY26 (consolidated P&L, notes 21, 25, 28, 36(b)); Q4FY23/Q4FY25/Q4FY26 decks (segment data)' } },
      { callout: `**Our view:** Neuland is a good chemistry business whose profits now depend on a few innovator molecules. FY26 profit is real (cash conversion was weak because of working capital, not because of accounting), but it is a CMS story: the generic APIs that built the company shrank in FY25-26. FY26 also had ~₹11 cr of forex gains and a helpful rupee. We forecast EPS of ₹${n1(epsU[0])} / ${n1(epsU[1])} / ${n1(epsU[2])} for FY27-29E, ~${Math.round(X.epsCagr)}% a year.` },
    ],
  };
})();

const seasons = X && {
  id: 'seasons', nav: 'Lumpy quarters', kicker: 'Quarters', title: 'Lumpy, not seasonal: quarterly revenue swung from ₹293 cr to ₹776 cr in FY26 and the margin from 12% to 40%',
  blocks: [
    { p: 'Neuland has no stable seasonal pattern. Its CMS revenue depends on when a few innovators order and when batches ship: Q1FY26 brought ₹293 cr of revenue at a 12% EBITDA margin, Q4FY26 ₹776 cr at 40%. Management\'s own description is blunt: Q4FY26 was "more of a Q3 plus Q4 kind of a performance", and "variability remains an inherent characteristic of our business". With roughly 45% of costs fixed (employees ~17% of sales, manufacturing and other costs ~17-18%), margins move with revenue. Q1FY27 (₹642 cr, 34.7%) was "broadly in line" with management\'s plan.' },
    { pair: [
      { type: 'column', title: 'Quarterly revenue: no two quarters alike', unit: 'Revenue (₹ crore)', x: 'Q.labels', series: [{ name: 'Revenue', ref: 'Q.sales', fmt: 'num' }], labels: 'all', source: 'Screener.in (consolidated)' },
      { type: 'line', title: 'Quarterly EBITDA margin: 12% to 40%', unit: 'EBITDA margin (%)', x: 'Q.labels', series: [{ name: 'EBITDA margin', ref: 'Q.opm', fmt: 'pct0' }], labels: 'all', min: 0, max: 50, source: 'Screener.in' },
    ] },
    { callout: `**What to watch:** our FY27 forecast (₹${n0(X.F.sales[0])} cr) needs ~₹${n0(X.F.sales[0] - 642)} cr from Q2-Q4, ${Math.round(((X.F.sales[0] - 642) / 1730 - 1) * 100)}% above the same quarters of FY26 (₹1,730 cr, inflated by Q4). A single quarter tells little; management asks investors to judge 10-12 quarters. Q2FY27 results are due by mid-November 2026.` },
  ],
};

const balance = X && (() => {
  const { cashPath, CO_NC0, Q1, n1, TRE } = X;
  return {
    id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'Net cash of ₹158 cr at Mar-26 and ₹309 cr at Jun-26; working capital ballooned to 137 days in FY26 and is the cash risk',
    blocks: [
      { p: `Neuland moved from net debt of ₹212 cr (Mar-22) to net cash of ₹229 cr (Mar-25) as CMS profits came in, helped by ₹107 cr of mutual-fund investments and the FY25 property sale. FY26 went backwards: free cash flow was −₹49 cr because receivables rose ₹226 cr and inventory ₹125 cr (working capital 137 days of sales vs 107) while capex doubled to ₹397 cr. At Mar-26 cash and deposits were ₹${n1(TRE.mar26.cash + TRE.mar26.otherBank)} cr against ₹${n1(TRE.mar26.borrowings)} cr of bank debt (company net cash ₹${n1(CO_NC0)} cr) plus ₹${n1(TRE.mar26.leases)} cr of lease liabilities, mostly the new R&D centre. Q1FY27 released working capital (84 days) and net cash rose to ₹${n0(Q1.netCash)} cr. CRISIL rates Neuland A+ (outlook raised to Positive in Aug-2026) and expects borrowings to rise with capex, with peak gearing below 0.45x.` },
      { pair: [
        { type: 'column', title: 'Net debt to net cash: −₹212 cr (Mar-22) to +₹309 cr (Jun-26)', unit: 'Net cash (₹ crore), company basis', x: ['Mar-22', 'Mar-23', 'Mar-24', 'Mar-25', 'Mar-26', 'Jun-26'], series: [{ name: 'Net cash', values: [-212, -63, 32.6, 228.7, 156.8, Q1.netCash], fmt: 'num' }], labels: 'all', highlight: 'Jun-26', source: 'Company decks (net debt incl. mutual funds; excl. leases)' },
        { type: 'line', title: 'Receivable and inventory days: inventory is the heavy part', unit: 'Days', x: FYS.slice(3), series: [{ name: 'Receivable days', values: X.A.debtorDays.slice(5), fmt: 'num' }, { name: 'Inventory days', values: X.A.inventoryDays.slice(5), fmt: 'num' }], labels: 'last', source: 'Screener.in (inventory days on material cost)' },
      ] },
      { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-23', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
        ['Net worth', '{{A.netWorth.8|num}}', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}'],
        ['Borrowings (incl. leases)', '{{A.borrowings.8|num}}', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}'],
        ['Cash, deposits and investments', '{{A.cashAndInvestments.8|num}}', '{{A.cashAndInvestments.9|num}}', '{{A.cashAndInvestments.10|num}}', '{{A.cashAndInvestments.11|num}}'],
        ['Inventories', '{{A.inventories.8|num}}', '{{A.inventories.9|num}}', '{{A.inventories.10|num}}', '{{A.inventories.11|num}}'],
        ['Trade receivables', '{{A.receivables.8|num}}', '{{A.receivables.9|num}}', '{{A.receivables.10|num}}', '{{A.receivables.11|num}}'],
        ['Trade payables', '{{A.payables.8|num}}', '{{A.payables.9|num}}', '{{A.payables.10|num}}', '{{A.payables.11|num}}'],
        ['Net fixed assets (incl. ₹279 cr goodwill)', '{{A.fixedAssets.8|num}}', '{{A.fixedAssets.9|num}}', '{{A.fixedAssets.10|num}}', '{{A.fixedAssets.11|num}}'],
        ['Capital work in progress', '{{A.cwip.8|num}}', '{{A.cwip.9|num}}', '{{A.cwip.10|num}}', '{{A.cwip.11|num}}'],
      ], source: 'Screener.in (consolidated); AR FY26 balance sheet and notes 33-37' } },
      { callout: `**Cash in the model.** The engine starts from ₹${n0(cashPath[0])} cr of net cash at Mar-26 (Screener cash less borrowings and ₹105 cr of leases; the company's ₹${n1(CO_NC0)} cr excludes leases) and builds it to ₹${n0(cashPath[1])} / ${n0(cashPath[2])} / ${n0(cashPath[3])} cr by Mar-27/28/29E after capex of ₹450-480 cr a year and a 12% payout. It holds working capital at ~21% of sales (Screener basis, the FY26 peak), so if days normalise towards Q1FY27's 84, cash would be higher.` },
    ],
  };
})();

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: the Davuluri family owns 32.6%, unchanged for years; domestic funds have tripled their stake to 16.5% since 2023',
  blocks: [
    { pair: [
      { type: 'line', title: 'Domestic institutions up, the public down', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }, { name: 'Public', ref: 'SH.rows.Public', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoters: a steady ~32.6%', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'all', min: 20, max: 40, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { p: 'Consolidated. History FY15-FY26; no minority interests. EBITDA is before other income (the company\'s own "EBITDA" includes other income). Screener nets the FY25 exceptional gain (₹76.4 cr) and losses on asset sales into other income. Forecast other income is treasury income at 5.0% on average gross cash plus ₹1.5 cr; no forex gains are forecast.' },
    { statement: { title: 'Profit & loss, FY15–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 25 }, hl: true }, { key: 'ebitda', name: 'EBITDA (before other income)', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 400 } }, { key: 'dep', name: 'Depreciation' },
      { key: 'otherIncome', name: 'Other income (history incl. exceptional items)' }, { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit', hl: true, flag: { type: 'pct', th: 30 } }, { key: 'eps', name: 'EPS (₹)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' }, { key: 'capex', name: 'Capex' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 25 }, hl: true }, { key: 'ebitda', name: 'EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' }, { key: 'otherIncome', name: 'Other income incl. exceptional' },
      { key: 'dep', name: 'Depreciation' }, { key: 'pat', name: 'Net profit', hl: true },
    ] } },
  ],
};

const statementNotes = {};
module.exports = { financials, seasons, balance, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  const B = fs.existsSync(path.join(__dirname, 'NEULANDLAB.research.js')) ? require('./NEULANDLAB.research') : null;
  const report = {
    symbol: 'NEULANDLAB', listing: 'NSE: NEULANDLAB · BSE: 524558', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Pharmaceuticals',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, seasons, balance, ownershipBase, statements }) : [financials, seasons, balance, ownershipBase, statements].filter(Boolean),
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
