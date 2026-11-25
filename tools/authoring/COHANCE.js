// Authoring source for the Cohance Lifesciences (formerly Suven Pharmaceuticals) initiating-coverage report (as of 30-Sep-2026,
// Q1FY27 basis). Part A (this file): chapters built on reported financials (Screener, consolidated; Net Profit patched to profit
// attributable to owners and FY25 EPS put on the post-merger share count by COHANCE.patch.js). Part B (COHANCE.research.js +
// part2-6, shared COHANCE.ctx.js) adds the research chapters, cover, rating and statement notes. Usage: node tools/authoring/COHANCE.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'COHANCE', 'research');
const X = fs.existsSync(path.join(__dirname, 'COHANCE.ctx.js')) ? require('./COHANCE.ctx') : null;
const FYS = ['FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'];

const financials = X && (() => {
  const { A, n0, n1, ai, epsU, FY26, C } = X;
  const at = (k, y) => A[k][ai(y)];
  return {
    id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Two businesses glued together in FY25, then a fall: revenue −13% in FY26 and −23% in Q1FY27; EPS ₹12.68 (FY25, merged) → ₹4.68 → a Q1 loss',
    blocks: [
      { p: `Read the history in two parts. **FY20-FY24 is Suven Pharmaceuticals alone**: a pure contract manufacturer for innovator drug companies with revenue of ₹834-1,340 cr and EBITDA margins of 39-46%, the best in Indian pharma. **FY25 onward is the merged company**: Cohance Lifesciences (Advent's API and CDMO platform) was folded in from 1-May-2025 by pooling of interests, so FY25 was restated as if the two had always been one (revenue ₹2,608 cr, of which Suven as first reported was ₹1,198 cr). The +148% jump from FY24 to FY25 is the merger, not growth. Since then the business has shrunk: FY26 revenue fell 13% to ₹2,269 cr as two large CDMO molecules were destocked by their customers (~₹260 cr), API+ fell 8% (a US FDA Warning Letter at the Nacharam formulations plant cost ~₹61 cr) and specialty chemicals slipped 2%. The EBITDA margin halved from 30.6% to ${n1(A.ebitdaMargin[7])}% because the cost base kept rising (new leaders, sales teams, NJ Bio in the US) while revenue fell. Attributable profit fell from ₹487 cr to ₹179 cr and EPS from ₹12.68 to ₹4.68, and Q1FY27 was a loss.` },
      { pair: [
        { type: 'column', title: 'Revenue: Suven alone to FY24, merged from FY25, then down', unit: 'Revenue (₹ crore)', x: FYS, series: [{ name: 'Revenue', values: FYS.map(y => at('sales', y)), fmt: 'num' }], labels: 'all', highlight: 'FY25', source: 'Screener.in (consolidated); FY25 restated for the merger (AR FY26 note 62)' },
        { type: 'line', title: 'EBITDA margin: 46% (Suven) → 31% (merged FY25) → 19%', unit: 'EBITDA margin (%), reported, before other income', x: FYS, series: [{ name: 'EBITDA margin', values: FYS.map(y => Math.round(at('ebitdaMargin', y) * 10) / 10), fmt: 'pct' }, { name: 'Gross margin', values: X.SA.filter(s => FYS.includes(s.fy)).map(s => s.grossMarginPct), fmt: 'pct' }], labels: 'all', min: 0, max: 80, source: 'Screener.in; gross margin = 100 − material cost %' },
      ] },
      { pair: [
        { type: 'column', title: 'EPS per share held: ₹17.8 (FY22) → ₹4.7 (FY26)', unit: 'EPS (₹); FY25 restated on post-merger shares', x: FYS, series: [{ name: 'EPS', values: FYS.map(y => at('eps', y)), fmt: 'n1' }], labels: 'all', source: 'Screener.in; FY25 = AR FY26 diluted EPS (₹12.68; Screener shows ₹19.14 on the pre-merger share count)' },
        { type: 'line', title: 'Return on equity: from 45% to under 5%', unit: 'Return on equity (%)', x: FYS, series: [{ name: 'ROE', values: FYS.map(y => Math.round(at('roe', y) * 10) / 10), fmt: 'pct' }], labels: 'all', min: 0, max: 50, source: 'Screener.in (attributable profit ÷ average equity); FY25 equity includes Cohance at book value' },
      ] },
      { exhibit: { type: 'table', title: 'FY25 → FY26 → Q1FY27: where the profit went (₹ crore)', head: ['', 'FY25 (merged)', 'FY26', 'Q1FY27', 'Note'], wide: [4], rows: [
        ['Revenue', '{{A.sales.6|num}}', '{{A.sales.7|num}}', '422', 'Pharma CDMO ₹1,128 → 889 cr (destocking); API+ ₹1,183 → 1,088 cr'],
        ['Gross margin', '68.7%', '70.8%', '71.5%', 'Held up: the problem is volume and cost, not price'],
        ['EBITDA, reported (before other income)', '{{A.ebitda.6|num}}', '{{A.ebitda.7|num}}', '1', 'After one-time costs of ₹63 cr (FY25), ₹45 cr (FY26), ₹3 cr (Q1)'],
        ['EBITDA, company "adjusted"', '878', '478', '9', `Margin 33.7% → 21.0% → 2.2%; NJ Bio −₹${n1(-C.q1fy27.njBioAdjEbitda)} cr in Q1 alone`],
        ['Depreciation and amortisation', '{{A.dep.6|num}}', '{{A.dep.7|num}}', '50', 'Full year of NJ Bio and Sapala; new plants'],
        ['Other income (Screener, net of exceptional items)', '{{A.otherIncome.6|num}}', '{{A.otherIncome.7|num}}', '12', 'FY26: ₹34.1 cr less ₹29.5 cr exceptional charges'],
        ['Profit before tax', '{{A.pbt.6|num}}', '{{A.pbt.7|num}}', '−43', ''],
        ['Minorities (share of losses absorbed)', '+3', '+29', '+21', '44% of NJ Bio\'s losses fall to its US partners'],
        { hl: true, cells: ['**Profit attributable to owners**', '**{{A.pat.6|num}}**', '**{{A.pat.7|num}}**', '**−24**', 'Before minorities: ₹484 / 150 / −45 cr'] },
        ['EPS (₹, diluted)', '12.68', '4.68', '−0.63', `Our FY27E ₹${n1(epsU[0])}`],
      ], source: 'AR FY26 (consolidated P&L, notes 18(b), 59, 61, 62); Q4FY26 and Q1FY27 decks; Screener.in' } },
      { callout: `**Our view:** the merger doubled the size of the company and diluted its quality. Suven was a 40%+ margin CDMO with a handful of large innovator molecules; the merged company is ~48% API+ (niche APIs and formulations), ~39% Pharma CDMO and ~13% specialty chemicals, with a heavier cost base and two loss-making or sub-scale acquisitions (NJ Bio, Sapala). FY26 and Q1FY27 show what happens when Suven's big molecules destock at the same time: the fixed costs stay and the margin collapses. We forecast EPS of ₹${n1(epsU[0])} / ${n1(epsU[1])} / ${n1(epsU[2])} for FY27-29E: a recovery, but FY29E is still a third below FY25.` },
    ],
  };
})();

const quarters = X && (() => {
  const { n1, Q1 } = X;
  return {
    id: 'quarters', nav: 'The quarterly slide', kicker: 'Quarters', title: 'Eight quarters of decline: revenue ₹840 cr (Q4FY25) to ₹422 cr (Q1FY27); EBITDA margin 27% → 0.3%',
    blocks: [
      { p: `The quarterly series shows a steady slide rather than one bad quarter. Q4FY25 was the peak (₹840 cr of revenue, helped by a big specialty-chemicals quarter). From Q1FY26 the two destocked molecules disappeared from Pharma CDMO, NJ Bio's biotech customers delayed projects, Nacharam was shut for remediation, and costs rose by ~₹50 cr a quarter as the merged company hired leaders and sales teams. Management guided Q1FY27 to be "our lowest quarter ever", and it was: revenue ₹${n1(Q1.revenue)} cr (−23%), reported EBITDA ₹1.2 cr, a ₹45 cr loss before minorities. The standalone business (ex-subsidiaries) still made a 9.2% adjusted margin; NJ Bio lost ₹${n1(-Q1.njBioAdjEbitda)} cr at EBITDA level on ₹${n1(Q1.njBioRevenue)} cr of revenue.` },
      { pair: [
        { type: 'column', title: 'Quarterly revenue: down from the Q4FY25 peak', unit: 'Revenue (₹ crore)', x: 'Q.labels', series: [{ name: 'Revenue', ref: 'Q.sales', fmt: 'num' }], labels: 'all', source: 'Screener.in (consolidated; FY24 quarters are Suven alone)' },
        { type: 'line', title: 'Quarterly EBITDA margin: 42% → 0.3%', unit: 'EBITDA margin (%), reported', x: 'Q.labels', series: [{ name: 'EBITDA margin', ref: 'Q.opm', fmt: 'pct0' }], labels: 'all', min: 0, max: 50, source: 'Screener.in' },
      ] },
      { callout: '**What to watch:** management guides Q2FY27 better than Q1, year-on-year comparability by the end of H1 and growth in H2. Our FY27E needs ₹1,803 cr of revenue in Q2-Q4, +5% on the same quarters of FY26, and an EBITDA margin of ~19% over those nine months. Q2FY27 results are due by mid-November 2026.' },
    ],
  };
})();

const balance = X && (() => {
  const { n0, cashPath, TRE, coNC0, Q1 } = X;
  return {
    id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'Balance sheet: small net cash (₹251 cr at Jun-26), but ₹696 cr owed to minority partners, ₹1,284 cr of goodwill and heavy working capital',
    blocks: [
      { p: `On the company's definition Cohance has net cash: cash, bank balances and liquid funds of ₹${n0(TRE.mar26.cash + TRE.mar26.otherBank + TRE.mar26.currentInv)} cr against ₹${n0(TRE.mar26.borrowings)} cr of borrowings at Mar-26 (₹${n0(coNC0)} cr; the deck says ₹153 cr), and ₹${n0(Q1.netCash)} cr at Jun-26 after receivables fell. Three items change the picture. (1) **₹696 cr owed to minority partners**: Cohance must buy the remaining 44% of NJ Bio (the sellers hold a put option) and 32.5% of Sapala (two tranches, full ownership by FY30); the liability is carried at fair value and is debt in all but name. (2) **₹231 cr of lease liabilities.** (3) **Goodwill of ₹1,284 cr** (33% of equity), of which ₹419 cr is NJ Bio, a business losing ~₹50 cr a quarter; its impairment test assumes 24% revenue growth and a discount rate cut from 10.7% to 10.1%. Working capital is heavy: core net working capital ₹959 cr, 154 days of sales in FY26 (141 days at Jun-26). There is also an unquoted US investment (Raisin Aggregator LP) carried at ₹260 cr that earns nothing.` },
      { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-24 (Suven)', 'Mar-25 (merged)', 'Mar-26'], rows: [
        ['Net worth (owners)', '{{A.netWorth.5|num}}', '{{A.netWorth.6|num}}', '{{A.netWorth.7|num}}'],
        ['Borrowings incl. leases', '{{A.borrowings.5|num}}', '{{A.borrowings.6|num}}', '{{A.borrowings.7|num}}'],
        ['Cash and investments (incl. the ₹260 cr Raisin stake at Mar-26)', '{{A.cashAndInvestments.5|num}}', '{{A.cashAndInvestments.6|num}}', '{{A.cashAndInvestments.7|num}}'],
        ['Liability to buy out minorities', '–', '652', '696'],
        ['Inventories', '{{A.inventories.5|num}}', '{{A.inventories.6|num}}', '{{A.inventories.7|num}}'],
        ['Trade receivables', '{{A.receivables.5|num}}', '{{A.receivables.6|num}}', '{{A.receivables.7|num}}'],
        ['Net fixed assets (incl. ₹1,284 cr goodwill)', '{{A.fixedAssets.5|num}}', '{{A.fixedAssets.6|num}}', '{{A.fixedAssets.7|num}}'],
      ], source: 'Screener.in (consolidated); AR FY26 notes 6, 9, 22' } },
      { callout: `**Cash in the model.** The engine starts from net debt of ₹${n0(-cashPath[0])} cr at Mar-26: Screener cash and investments less borrowings, leases and the ₹696 cr minority buy-out liability (we move it out of working capital into net debt). Net debt falls to ₹${n0(-cashPath[1])} / ${n0(-cashPath[2])} / ${n0(-cashPath[3])} cr by Mar-27/28/29E after ₹250-300 cr of capex a year and working capital at ~38% of sales. Two caveats: the model counts only the owners' share of NJ Bio's losses, while the group funds all of them (~₹60 cr more cash out in FY27E), and the timing and price of the minority buy-outs are not disclosed.` },
    ],
  };
})();

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: Advent controls 57.5% and has pledged 54% of the company for a US$285 mn holdco loan; domestic funds bought what Advent sold',
  blocks: [
    { pair: [
      { type: 'line', title: 'Domestic institutions up, foreign investors down', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoters: 50.1% (Suven) → 66.4% (merger) → 57.5% (block sale)', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'all', min: 30, max: 70, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { p: 'Consolidated. FY19-FY24 are Suven Pharmaceuticals alone; FY25 is restated for the Cohance merger (pooling of interests) and FY26 onward is the merged company. Net profit and EPS are attributable to owners (after minorities in NJ Bio and Sapala); FY25 EPS is on the post-merger share count. EBITDA is reported (after one-time costs, before FX gains); Screener nets exceptional items into other income. Forecast other income is treasury income at 6.5% on average liquid funds plus ₹3 cr; the forecast tax line carries tax plus the minorities\' share.' },
    { statement: { title: 'Profit & loss, FY19–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 25 }, hl: true }, { key: 'ebitda', name: 'EBITDA (reported, before other income)', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 300 } }, { key: 'dep', name: 'Depreciation & amortisation' },
      { key: 'otherIncome', name: 'Other income (history net of exceptional items)' }, { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit (attributable)', hl: true, flag: { type: 'pct', th: 30 } }, { key: 'eps', name: 'EPS (₹)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' }, { key: 'capex', name: 'Capex' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 25 }, hl: true }, { key: 'ebitda', name: 'EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' }, { key: 'otherIncome', name: 'Other income incl. exceptional' },
      { key: 'dep', name: 'Depreciation' }, { key: 'pat', name: 'Net profit (attributable)', hl: true },
    ] } },
  ],
};

const statementNotes = {};
module.exports = { financials, quarters, balance, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  const B = fs.existsSync(path.join(__dirname, 'COHANCE.research.js')) ? require('./COHANCE.research') : null;
  const report = {
    symbol: 'COHANCE', listing: 'NSE: COHANCE · BSE: 543064', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Pharmaceuticals & CDMO',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, quarters, balance, ownershipBase, statements }) : [financials, quarters, balance, ownershipBase, statements].filter(Boolean),
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
