// Authoring source for the OneSource Specialty Pharma initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated; pre-demerger FY21-23 dropped by
// ONESOURCE.patch.js, FY24 = Stelis alone). Part B (ONESOURCE.research.js + part2-6, shared ONESOURCE.ctx.js) adds the
// research chapters, cover, rating and statement notes. Usage: node tools/authoring/ONESOURCE.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'ONESOURCE', 'research');
const X = fs.existsSync(path.join(__dirname, 'ONESOURCE.ctx.js')) ? require('./ONESOURCE.ctx') : null;
const n0 = v => Math.round(v).toLocaleString('en-IN');

const financials = X && (() => {
  const { A, F, epsU, n1, SG, FY26, C, AMORT } = X;
  const SA = SG.annual, yrs = ['FY24 (pro forma)', 'FY25', 'FY26', ...F.years];
  return {
    id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Two years as a combined company: revenue flat at ~₹1,420-1,445 cr, EBITDA down from ₹467 cr to ₹304 cr, reported losses both years; the step-up is all in the forecasts',
    blocks: [
      { p: `OneSource's comparable history is short. The merger that created it took effect on 1-Apr-2024, so FY25 is its first full year; Screener's earlier columns are Stelis Biopharma alone (FY24 revenue ₹172 cr; we drop FY21-23 and show FY24 only as the pre-demerger year), and the company's own pro-forma FY24 for the combined business was revenue ₹1,082 cr and EBITDA ₹225 cr. FY25 revenue rose to ₹1,445 cr with EBITDA of ₹467 cr (32%), lifted by development (MSA) fees from GLP-1 customers preparing their filings. FY26 was meant to be the year commercial supply began; it was not. Canadian semaglutide approvals slipped by one to two quarters, OneSource stopped taking new DDC development work to keep its one cartridge line free for commercial orders, and Q3FY26 revenue fell 26% with EBITDA of only ₹17 cr. FY26 revenue ended 2% lower at ₹1,422 cr and EBITDA 35% lower at ₹304 cr (21%), while employee and other costs rose ahead of the new lines. Reported profit was a loss in both years: depreciation of ~₹275-280 cr includes ₹${n0(AMORT)} cr a year of amortisation of intangibles created by the merger, and finance costs were ₹122-166 cr.` },
      { pair: [
        { type: 'column', title: 'Revenue: flat for two years; our forecast more than doubles it by FY28E', unit: 'Revenue (₹ crore)', x: yrs, series: [{ name: 'Revenue', values: [SA[0].revenue, A.sales[1], A.sales[2], ...F.sales].map(Math.round), fmt: 'num' }], labels: 'all', highlight: 'FY27E', source: 'JM Financial (company pro forma FY24); Screener.in; GAM estimates FY27-29E' },
        { type: 'line', title: 'EBITDA margin: 32% in FY25, 21% in FY26; guided ~40% at steady state', unit: 'EBITDA margin (%), before other income', x: yrs, series: [{ name: 'EBITDA margin', values: [SA[0].ebitdaMarginPct, A.ebitdaMargin[1], A.ebitdaMargin[2], ...F.ebitdaMargin].map(v => Math.round(v * 10) / 10), fmt: 'pct' }], labels: 'all', min: 0, max: 45, source: 'Screener.in; GAM estimates' },
      ] },
      { exhibit: { type: 'table', title: 'FY25 → FY26: where the profit went (₹ crore)', head: ['', 'FY25', 'FY26', 'Note'], wide: [3], rows: [
        ['Revenue', '{{A.sales.1|num}}', '{{A.sales.2|num}}', 'India ₹194 → 396 cr (semaglutide launch); Ireland ₹175 → 70 cr; rest of world ₹413 → 308 cr'],
        ['EBITDA (before other income)', '{{A.ebitda.1|num}}', '{{A.ebitda.2|num}}', `FY26 includes a ₹${n1(FY26.forexGainInOpex)} cr forex gain inside other expenses`],
        ['Employee costs', '215', '242', '380+ hires at the flagship site for the new lines'],
        ['Legal and professional fees', '92', '148', 'Over 10% of FY26 revenue (AR note 26)'],
        ['Depreciation and amortisation', '{{A.dep.1|num}}', '{{A.dep.2|num}}', `Incl. ₹${n0(AMORT)} cr of scheme amortisation each year`],
        ['Finance costs', '{{A.interest.1|num}}', '{{A.interest.2|num}}', 'High-cost debt prepaid; rate below 9%'],
        ['Exceptional items', '−111', '−10', 'FY25 listing and scheme costs; FY26 Prestige legal costs, staff separation, labour codes'],
        { hl: true, cells: ['**Reported net profit**', '**{{A.pat.1|num}}**', '**{{A.pat.2|num}}**', 'Tax credits of ₹50 cr and ₹18 cr'] },
        ['Company "adjusted PAT"', '231', '74', 'Before exceptional items and the full scheme amortisation (no tax adjustment)'],
      ], source: 'AR FY26 (P&L and notes 23-27); Q4FY26 press release; Screener.in' } },
      { pair: [
        { type: 'column', title: `Reported EPS: losses in FY25-26; ₹${n1(epsU[0])} / ${n1(epsU[1])} / ${n1(epsU[2])} forecast`, unit: 'EPS (₹)', x: ['FY25', 'FY26', ...F.years], series: [{ name: 'EPS', values: [A.eps[1], A.eps[2], ...epsU].map(v => Math.round(v * 10) / 10), fmt: 'n1' }], labels: 'all', source: 'Screener.in; GAM estimates (reported basis, after scheme amortisation)' },
        { type: 'column', title: 'EBITDA: ₹467 cr → ₹304 cr → our ₹{{F.ebitda.0|num}} cr', unit: 'EBITDA (₹ crore)', x: ['FY24 (pro forma)', 'FY25', 'FY26', ...F.years], series: [{ name: 'EBITDA', values: [SA[0].ebitda, A.ebitda[1], A.ebitda[2], ...F.ebitda].map(Math.round), fmt: 'num' }], labels: 'all', highlight: 'FY27E', source: 'JM Financial (pro forma FY24); Screener.in; GAM' },
      ] },
      { callout: `**Our view:** nothing in the reported numbers yet proves the GLP-1 thesis; FY25's profits came mostly from development fees, and FY26 showed how much the fixed-cost base hurts when commercial supply is late. The proof starts in FY27: Q1FY27 revenue rose 37% and EBITDA 39%. We forecast EBITDA of ₹{{F.ebitda.0|num}} / {{F.ebitda.1|num}} / {{F.ebitda.2|num}} cr and reported EPS of ₹${n1(epsU[0])} / ${n1(epsU[1])} / ${n1(epsU[2])} for FY27-29E, about a year behind management's plan.` },
    ],
  };
})();

const seasons = {
  id: 'seasons', nav: 'Quarterly pattern', kicker: 'Quarters', title: 'Quarters swing with approvals, not seasons: Q3FY26 EBITDA fell to ₹17 cr, then recovered for two quarters; soft gels make H2 stronger',
  blocks: [
    { p: 'OneSource\'s quarters move with its customers\' regulatory calendar. When development (MSA) work is billed, margins are high (Q4FY25 EBITDA margin 43%); when the cartridge line waits for approvals, revenue and margin collapse (Q3FY26: revenue ₹290 cr, margin 6%). With semaglutide launches in India (Mar-2026) and Canada (from May-2026), Q4FY26 and Q1FY27 recovered to ₹428 cr and ₹449 cr. The base business has a seasonal tilt: soft-gel demand (cold and flu products) is H2-heavy, so the second half is normally stronger (CEO, 25-Jul-2026).' },
    { pair: [
      { type: 'column', title: 'Quarterly revenue: ₹290-449 cr, with a deep dip in Q3FY26', unit: 'Revenue (₹ crore)', x: 'Q.labels', series: [{ name: 'Revenue', ref: 'Q.sales', fmt: 'num' }], labels: 'all', source: 'Screener.in (consolidated)' },
      { type: 'line', title: 'Quarterly EBITDA margin: 6% to 43%', unit: 'EBITDA margin (%)', x: 'Q.labels', series: [{ name: 'EBITDA margin', ref: 'Q.opm', fmt: 'pct0' }], labels: 'all', min: 0, max: 50, source: 'Screener.in' },
    ] },
    { callout: '**What to watch:** the second cartridge line was due to start commercial supply in Q2FY27, while a sterile-injectables site is shut for ~4 months in Q2-Q3. Our FY27E needs ~₹1,700 cr from Q2-Q4 (~₹567 cr a quarter, +21% on Q1FY27). Q2FY27 results are due by mid-November 2026.' },
  ],
};

module.exports = { financials, seasons, RD };
const P0 = fs.existsSync(path.join(__dirname, 'ONESOURCE.partA2.js')) ? require('./ONESOURCE.partA2') : {};
Object.assign(module.exports, P0);

if (require.main === module) {
  const B = fs.existsSync(path.join(__dirname, 'ONESOURCE.research.js')) ? require('./ONESOURCE.research') : null;
  const base = { financials, seasons, balance: P0.balance, ownershipBase: P0.ownershipBase, statements: P0.statements };
  const report = {
    symbol: 'ONESOURCE', listing: 'NSE: ONESOURCE · BSE: 544292', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Pharmaceuticals & CDMO',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections(base) : Object.values(base).filter(Boolean),
    statementNotes: { ...(P0.statementNotes || {}), ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
