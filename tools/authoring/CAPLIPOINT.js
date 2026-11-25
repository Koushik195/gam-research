// Authoring source for the Caplin Point Laboratories initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated, Net Profit patched to the attributable
// figure by CAPLIPOINT.patch.js): financial trajectory and margins; CAPLIPOINT.partA2.js adds capital allocation, balance
// sheet and cash, ownership base and annotated statements. Part B (CAPLIPOINT.research.js + part2-6, shared
// CAPLIPOINT.ctx.js / core.js) adds the research chapters. Usage: node tools/authoring/CAPLIPOINT.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'CAPLIPOINT', 'research');
const X = fs.existsSync(path.join(__dirname, 'CAPLIPOINT.ctx.js')) ? require('./CAPLIPOINT.ctx') : null;
const n1c = v => v.toLocaleString('en-IN', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const SRC = { co: 'Company filings, Screener.in (consolidated), GAM Research', est: 'Company, GAM Research estimates' };
const FYS = ['FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'];

const financials = X && (() => {
  const { A, b, ix, n0, n1, pc, epsRep, epsU, cagr, F, FY26, Q1 } = X;
  const i20 = ix('FY20'), mg = FYS.map(f => Math.round(A.ebitdaMargin[ix(f)] * 10) / 10);
  return {
    id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Revenue 2.5x and EPS 3.0x since FY20, with margins up from 30% to 35%; every year a record',
    blocks: [
      { p: `Caplin's revenue grew from ₹${n0(A.sales[i20])} cr in FY20 to ₹${n0(A.sales[b])} cr in FY26 (${n1(cagr(A.sales[i20], A.sales[b], 6))}% a year) and EPS from ₹${n1(epsRep[2020])} to ₹${n1(epsRep[2026])} (${n1(cagr(epsRep[2020], epsRep[2026], 6))}% a year). EPS has risen every single year, from ₹${n1(epsRep[2021])} in FY21 to ₹${n1(epsRep[2026])} in FY26, with no exceptional charges and no equity raised. Two things drove the margin from 30% to 35%: Latin American gross margins rose (LatAm gross margin 67% → 71% in FY26 alone, per the Vice-Chairman) as Caplin pruned low-margin products, and the US business (Caplin Steriles) went from losses to a 30% EBITDA margin. **Growth is slowing, though:** revenue grew 20-23% a year in FY21-22, 13-16% in FY23-26; FY26 was +${n1(A.salesGrowth[b])}% (Latin America +3% in dollars; the rest was the rupee and a large El Salvador tender). Q1FY27 was faster: revenue +${n1(Q1.growthPct)}%, profit to shareholders +${n1((Q1.patOwners / Q1.patOwnersPrev - 1) * 100)}%.` },
      { pair: [
        { type: 'column', title: `Revenue: ₹${n0(A.sales[i20])} cr to ₹${n0(A.sales[b])} cr in six years`, unit: 'Revenue (₹ crore); FY27-29E = GAM', x: 'fin.labels', from: 'FY17', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num', growth: true }], source: SRC.est },
        { type: 'line', title: 'EBITDA margin: 30-31% to 35% in three years', unit: 'EBITDA margin before other income (%), Screener basis', x: FYS, series: [{ name: 'EBITDA margin', values: mg, fmt: 'pct' }], labels: 'all', min: 20, max: 40, highlight: 'FY26', source: 'Screener.in (annual operating profit)' },
      ] },
      { pair: [
        { type: 'column', title: 'EPS: up every year; our forecasts slow the pace', unit: 'EPS to shareholders (₹); FY27-29E = GAM', x: [...FYS, ...F.years], series: [{ name: 'EPS', values: [...FYS.map(f => Math.round(epsRep[2000 + +f.slice(2)] * 10) / 10), ...epsU.map(v => Math.round(v * 10) / 10)], fmt: 'n1' }], labels: 'all', highlight: 'FY26', source: 'Screener.in; GAM Research' },
        { type: 'hbar', title: 'Where each rupee of FY26 revenue went', unit: 'FY26, % of revenue (Screener cost split)', x: ['Materials and traded goods', 'Employees', 'Other expenses (R&D 3.7%, freight, promotion)', 'EBITDA'], series: [{ name: 'Share', values: [A.materialPct[b], A.employeePct[b], 100 - A.materialPct[b] - A.employeePct[b] - A.ebitdaMargin[b], A.ebitdaMargin[b]].map(v => Math.round(v * 10) / 10), fmt: 'pct' }], labels: 'all', highlight: 'EBITDA', source: 'Screener.in; AR FY26 note 33 (R&D ₹79.9 cr expensed)' },
      ] },
      { exhibit: { type: 'table', title: 'FY24 → FY27E (₹ crore)', head: ['', 'FY24', 'FY25', 'FY26', 'FY27E', 'Note'], wide: [5], rows: [
        ['Revenue', '{{A.sales.9|num}}', '{{A.sales.10|num}}', '{{A.sales.11|num}}', '{{F.sales.0|num}}', 'FY27E: Rest of World +14% (incl. ~6-7pp rupee), USA +25%'],
        ['EBITDA (before other income)', '{{A.ebitda.9|num}}', '{{A.ebitda.10|num}}', '{{A.ebitda.11|num}}', '{{F.ebitda.0|num}}', `Company "EBITDA" adds other income: ₹${n0(FY26.companyEbitda)} cr in FY26`],
        ['Other income', '{{A.otherIncome.9|num}}', '{{A.otherIncome.10|num}}', '{{A.otherIncome.11|num}}', '{{F.otherIncome.0|num}}', `FY26 company ₹${n1(FY26.otherIncome.total)} cr incl. ₹${n1(FY26.otherIncome.fx)} cr FX gain; FY27E excludes FX`],
        ['Depreciation', '{{A.dep.9|num}}', '{{A.dep.10|num}}', '{{A.dep.11|num}}', '{{F.dep.0|num}}', 'Oncology plant and CSL Line 6 capitalised Apr-2026'],
        ['Effective tax rate (incl. minorities in FY27E)', '18.3%', '20.1%', '19.1%', '{{F.tax.0|num}} cr', 'Tax 20.5% of PBT + ~₹9.5 cr minorities'],
        { hl: true, cells: ['**Net profit to shareholders**', '**{{A.pat.9|num}}**', '**{{A.pat.10|num}}**', '**{{A.pat.11|num}}**', '**{{F.pat.0|num}}**', `Minorities ₹${n1(FY26.nci)} cr in FY26 (Guatemala 31%)`] },
        ['EPS (₹)', n1(epsRep[2024]), n1(epsRep[2025]), n1(epsRep[2026]), n1(epsU[0]), `FY27E ${pc(epsU[0] / epsRep[2026] * 100 - 100)}`],
      ], source: 'Screener.in (Net Profit patched to the attributable figure); AR FY26; Q1FY27 press release; GAM' } },
      { callout: `**Our view:** a genuine compounder by the numbers: six years of 17% revenue growth, rising margins, no debt, no dilution. But the drivers are changing. The legacy Latin American business is growing slowly in dollars and leaning on tenders and a weak rupee; the US business is growing 25-30% but from a small base (21% of revenue) and on a single site that has just received a 10-observation Form 483. We forecast EPS of ₹${n1(epsU[0])} / ${n1(epsU[1])} / ${n1(epsU[2])} for FY27-29E, a ${Math.round(X.epsCagr)}% CAGR against ${Math.round(X.epsCagrHist)}% over FY21-26: new plants add depreciation and start-up costs before revenue, and we leave FX gains out of other income.` },
    ],
  };
})();

const margins = X && (() => {
  const { SQ, QL, Q1, FY26, n1, n0, F, AS, SA } = X;
  return {
    id: 'margins', nav: 'Margins', kicker: 'Profitability', title: "Margins: ~60% gross margin, 35% EBITDA margin; the company's 38% 'EBITDA' includes other income",
    blocks: [
      { p: `Caplin keeps about 60 paise of every rupee of sales after materials (gross margin ${Q1.grossMarginPct}% in Q1FY27, ${FY26.grossMarginPct}% in FY26) and spends little on people (9% of sales) because it sells plain generics through distributors and its own small LatAm teams, not through large field forces. Other expenses (freight, registrations, promotion, R&D of ₹${n1(FY26.rnd)} cr) take ~16%. The result is a ${n1(X.A.ebitdaMargin[X.b])}% EBITDA margin in FY26 on Screener's basis. **Read the company's numbers with care:** its press release shows an "EBITDA" of ₹${n0(FY26.companyEbitda)} cr (${n1(FY26.companyEbitda / FY26.revenue * 100)}% of revenue) because it adds other income (₹${n1(FY26.otherIncome.total)} cr, mostly interest on the cash pile); before other income it is ₹${n0(FY26.companyEbitdaExOi)} cr. By segment, Rest of the World (Latin America and Africa) earned a ${SA[2].rowMarginPct}% pre-tax margin in FY26 and the USA ${SA[2].usMarginPct}% (Caplin Steriles' EBITDA margin was 30%, ${FY26.lines.cslEbitdaQ4Pct}% in Q4FY26). The US margin is rising fast (${SQ.at(-1).usMarginPct}% pre-tax in Q1FY27); the Rest of World margin is drifting down (${SQ[2].rowMarginPct}% in Q1FY26 → ${SQ.at(-1).rowMarginPct}% in Q1FY27) as Caplin spends on Chile, Mexico, oncology and brand marketing.` },
      { pair: [
        { type: 'line', title: 'Gross margin ~60%; EBITDA margin 33-35% for seven quarters', unit: 'Quarterly (%)', x: QL, series: [{ name: 'Gross margin', values: SQ.map(q => q.grossMarginPct), fmt: 'pct' }, { name: 'EBITDA margin (before other income)', values: SQ.map(q => q.ebitdaMarginPct), fmt: 'pct' }], labels: 'last', min: 0, max: 70, source: 'ICICI Direct quarterly tables (company data)' },
        { type: 'line', title: 'Segment margins: the US is catching up; Rest of World drifts down', unit: 'Segment result (PBT before unallocated other income) / segment revenue (%)', x: QL, series: [{ name: 'Rest of the World', values: SQ.map(q => q.rowMarginPct), fmt: 'pct' }, { name: 'USA (Caplin Steriles)', values: SQ.map(q => q.usMarginPct), fmt: 'pct' }], labels: 'last', min: 0, max: 45, source: 'Company segment notes (Q3FY26, Q1FY27 results)' },
      ] },
      { exhibit: { type: 'table', title: 'Two definitions of EBITDA (₹ crore)', head: ['', 'FY25', 'FY26', 'Q1FY26', 'Q1FY27', 'Note'], wide: [5], rows: [
        ['Gross profit', '1,166.6', n1c(FY26.grossProfit), '315.0', '365.2', 'Revenue less materials and traded goods'],
        ['Employee, R&D and other operating costs', '519.7', n1c(FY26.employee + FY26.rnd + FY26.otherOpex), '137.2', n1(Q1.opex), 'Company presentation'],
        { hl: true, cells: ['**EBITDA before other income (our basis)**', '**646.9**', `**${n1c(FY26.companyEbitdaExOi)}**`, '**177.8**', `**${n1(Q1.ebitdaScreener)}**`, 'Screener / ICICI Direct basis'] },
        ['Other income', '96.4', n1(FY26.otherIncome.total), '23.1', n1(Q1.otherIncome), 'Interest, fund gains, FX'],
        ['Company "EBITDA"', '743.4', n1c(FY26.companyEbitda), '200.9', n1(Q1.companyEbitda), `Margin ${n1(FY26.companyEbitda / FY26.revenue * 100)}% / ${Q1.companyEbitdaMarginPct}% "on revenue"`],
      ], source: 'Q1FY27 press release and presentation; ICICI Direct; GAM' } },
      { pair: [
        { type: 'column', title: 'Tax rate: 19-20%, guided ~20%', unit: 'Effective tax rate (%); FY27-29E tax on PBT, before minorities', x: ['FY23', 'FY24', 'FY25', 'FY26', 'Q1FY27', ...F.years], series: [{ name: 'Tax rate', values: [16.4, 18.3, 20.1, FY26.etrPct, Q1.etrPct, ...AS.taxBuild.taxOnPbt], fmt: 'pct' }], labels: 'all', highlight: 'Q1FY27', source: 'Screener.in; Q1FY27 results; GAM' },
        { type: 'column', title: 'Our EBITDA margin path: flat at ~35%', unit: 'EBITDA margin before other income (%)', x: ['FY24', 'FY25', 'FY26', 'Q1FY27', ...F.years], series: [{ name: 'EBITDA margin', values: [SA[0].ebitdaMarginPct, SA[1].ebitdaMarginPct, SA[2].ebitdaMarginPct, Q1.ebitdaMarginPct, ...AS.ebitdaMargin], fmt: 'pct' }], labels: 'all', highlight: 'Q1FY27', min: 25, max: 40, source: 'Screener.in; ICICI Direct; GAM' },
      ] },
      { callout: `**So what:** the margin is high for a generic company and has risen for three years, but the easy gains (pruning LatAm products, the US turning profitable) are behind it. From here, mix (the US at 30-33% EBITDA margin vs LatAm's ~45% pre-tax) pulls down while operating leverage at Caplin Steriles pulls up, and three new plants start in FY28 with costs ahead of revenue. We model {{F.ebitdaMargin.0|pct}} / {{F.ebitdaMargin.1|pct}} / {{F.ebitdaMargin.2|pct}} for FY27-29E. Management talks of 38-39% "EBITDA" (with other income) and 26-29% PAT margins for the next 18 months; our PAT margin is ${n1(F.pat[0] / F.sales[0] * 100)}% in FY27E (profit to shareholders).` },
    ],
  };
})();

const PA = require('./CAPLIPOINT.partA2');
const { capital, balance, ownershipBase, statements, statementNotes } = PA;
module.exports = { financials, margins, capital, balance, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  const B = fs.existsSync(path.join(__dirname, 'CAPLIPOINT.research.js')) ? require('./CAPLIPOINT.research') : null;
  const report = {
    symbol: 'CAPLIPOINT', listing: 'NSE: CAPLIPOINT · BSE: 524742', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Healthcare',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, margins, capital, balance, ownershipBase, statements }) : [financials, margins, capital, balance, ownershipBase, statements].filter(Boolean),
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections, ${JSON.stringify(report).match(/"type":/g).length} chart/table exhibits`);
}
