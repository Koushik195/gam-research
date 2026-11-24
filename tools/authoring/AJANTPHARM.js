// Authoring source for the Ajanta Pharma initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated; no patch: Ajanta has no minorities, so
// Net Profit is profit to shareholders): financial trajectory, margins and the FX presentation, capital allocation, balance
// sheet and cash, ownership base, annotated statements. Part B (AJANTPHARM.research.js + part2-6, shared AJANTPHARM.ctx.js)
// adds the research chapters. Usage: node tools/authoring/AJANTPHARM.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'AJANTPHARM', 'research');
const X = fs.existsSync(path.join(__dirname, 'AJANTPHARM.ctx.js')) ? require('./AJANTPHARM.ctx') : null;
const SRC = { co: 'Company filings, Screener.in (consolidated), GAM Research', est: 'Company, GAM Research estimates' };
const FYS = ['FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'];

const financials = X && (() => {
  const { A, b, ix, n0, n1, pc, epsRep, epsU, cagr, F, FY26 } = X;
  const i20 = ix('FY20'), mg = FYS.map(f => Math.round(A.ebitdaMargin[ix(f)] * 10) / 10);
  return {
    id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: `Revenue 2.1x and EPS 2.4x since FY20; margins steady at 27-28% except the FY21 spike and the FY23 dip`,
    blocks: [
      { p: `Ajanta's revenue grew from ₹${n0(A.sales[i20])} cr in FY20 to ₹${n0(A.sales[b])} cr in FY26 (${n1(cagr(A.sales[i20], A.sales[b], 6))}% a year) and EPS from ₹${n1(epsRep[2020])} to ₹${n1(epsRep[2026])} (${n1(cagr(epsRep[2020], epsRep[2026], 6))}% a year, helped by buybacks). The margin story is unusually flat for a pharma company: Screener's operating margin (before FX hedge losses) was 26-28% in five of the seven years. The exceptions: **FY21** (34.6%), when COVID cut travel and promotion costs, and **FY23** (21.6%), when raw-material and freight costs spiked and Ajanta kept hiring reps; EPS fell 18% that year and recovered by FY24. FY26 was the best year in absolute terms: revenue +${n1(FY26.growth.total)}% on US generics (+${n1(FY26.growth.us)}%), profit ₹${n0(FY26.pat)} cr (+15%). Q1FY27 was stronger still: revenue +25%, profit +31%.` },
      { pair: [
        { type: 'column', title: `Revenue: ₹${n0(A.sales[i20])} cr to ₹${n0(A.sales[b])} cr in six years`, unit: 'Revenue (₹ crore); FY27-29E = GAM', x: 'fin.labels', from: 'FY17', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num', growth: true }], source: SRC.est },
        { type: 'line', title: 'EBITDA margin: 26-28% most years', unit: 'EBITDA margin before FX hedge losses (%), Screener basis', x: FYS, series: [{ name: 'EBITDA margin', values: mg, fmt: 'pct' }], labels: 'all', min: 15, max: 38, highlight: 'FY26', source: 'Screener.in (annual operating profit)' },
      ] },
      { pair: [
        { type: 'column', title: 'EPS: one dip (FY23) in seven years', unit: 'EPS (₹); FY27-29E = GAM', x: [...FYS, ...F.years], series: [{ name: 'EPS', values: [...FYS.map(f => Math.round(epsRep[2000 + +f.slice(2)] * 10) / 10), ...epsU.map(v => Math.round(v * 10) / 10)], fmt: 'n1' }], labels: 'all', highlight: 'FY26', source: 'Screener.in; GAM Research' },
        { type: 'hbar', title: 'Where each rupee of FY26 revenue went', unit: 'FY26, % of revenue (Screener cost split; before the ₹103 cr hedge loss)', x: ['Materials', 'Employees', 'Other expenses (R&D 4.6%, promotion, freight)', 'EBITDA'], series: [{ name: 'Share', values: [A.materialPct[b], A.employeePct[b], 100 - A.materialPct[b] - A.employeePct[b] - A.ebitdaMargin[b], A.ebitdaMargin[b]].map(v => Math.round(v * 10) / 10), fmt: 'pct' }], labels: 'all', highlight: 'EBITDA', source: 'Screener.in; AR FY26' },
      ] },
      { exhibit: { type: 'table', title: 'FY24 → FY27E (₹ crore)', head: ['', 'FY24', 'FY25', 'FY26', 'FY27E', 'Note'], wide: [5], rows: [
        ['Revenue', '{{A.sales.9|num}}', '{{A.sales.10|num}}', '{{A.sales.11|num}}', '{{F.sales.0|num}}', 'FY26 US +49%; FY27E India +17%, US +14%, Asia +10%'],
        ['EBITDA (before FX hedge losses)', '{{A.ebitda.9|num}}', '{{A.ebitda.10|num}}', '{{A.ebitda.11|num}}', '{{F.ebitda.0|num}}', 'Company "adjusted EBITDA" ₹1,172 / 1,268 / 1,498 cr'],
        ['Other income (Screener: net of the hedge loss)', '{{A.otherIncome.9|num}}', '{{A.otherIncome.10|num}}', '{{A.otherIncome.11|num}}', '{{F.otherIncome.0|num}}', 'FY26 company ₹172 cr incl. ₹97 cr FX gain; FY27E excludes FX'],
        ['Depreciation', '{{A.dep.9|num}}', '{{A.dep.10|num}}', '{{A.dep.11|num}}', '{{F.dep.0|num}}', 'Pithampur, Andheri office'],
        ['Effective tax rate', '26.8%', '22.6%', '23.3%', '26%', 'A plant leaves its tax exemption in FY27 (CFO)'],
        { hl: true, cells: ['**Net profit**', '**{{A.pat.9|num}}**', '**{{A.pat.10|num}}**', '**{{A.pat.11|num}}**', '**{{F.pat.0|num}}**', 'No minorities'] },
        ['EPS (₹)', n1(epsRep[2024]), n1(epsRep[2025]), n1(epsRep[2026]), n1(epsU[0]), `FY27E ${pc(epsU[0] / epsRep[2026] * 100 - 100)}`],
      ], source: 'Screener.in; Q1FY27 presentation (adjusted EBITDA); AR FY26; GAM' } },
      { callout: `**Our view:** a consistent compounder: mid-teens revenue growth and stable 27-28% margins for most of the last decade, with no exceptional charges. FY26-Q1FY27 were flattered by a US surge (eight launches, a strong flu season and a weaker rupee) that management itself expects to fade. We forecast EPS of ₹${n1(epsU[0])} / ${n1(epsU[1])} / ${n1(epsU[2])} for FY27-29E, a ${Math.round(X.epsCagr)}% CAGR, slower than FY26's +15% from FY28 as the US normalises and the tax rate rises to 26%.` },
    ],
  };
})();

const margins = X && (() => {
  const { SQ, QL, Q1, FY26, n1, n0, F, AS } = X;
  return {
    id: 'margins', nav: 'Margins & FX', kicker: 'Profitability', title: 'Margins: ~80% gross margin, 27-28% EBITDA margin; the FX lines are booked gross, so reported EBITDA understates the business',
    blocks: [
      { p: `Ajanta keeps about 79-80 paise of every rupee of sales after materials (gross margin ${Q1.grossMarginPct}% in Q1FY27, ${FY26.grossMarginPct}% in FY26), because ~70% of sales are branded generics and it makes almost everything in-house. It spends the gross margin on people (staff costs ${n1(Q1.staffCost / Q1.revenue * 100)}% of sales in Q1FY27: 6,050+ reps worldwide) and on promotion, registrations, freight and R&D (other expenses ${n1(Q1.otherExpenses / Q1.revenue * 100)}%, including the FX hedge loss). The result has been an EBITDA margin of 27-28% before FX for three years. One accounting habit matters: Ajanta books FX gains in other income and mark-to-market losses on its hedges in other expenses, **gross**. In FY26 the hedge loss was ₹${n0(FY26.hedgeLoss)} cr and the FX gain ₹${n0(FY26.fxGain)} cr: reported EBITDA (₹${n0(FY26.reportedEbitda)} cr, 25.6%) looks 190bp worse than the business, and other income looks twice its normal size. We model EBITDA before FX losses and other income before FX gains, i.e. net FX of nil.` },
      { pair: [
        { type: 'line', title: 'Gross margin up to ~80%; EBITDA margin before FX 26-29% for five quarters', unit: 'Quarterly (%)', x: QL, series: [{ name: 'Gross margin', values: SQ.map(q => q.grossMarginPct), fmt: 'pct' }, { name: 'EBITDA margin before FX losses', values: SQ.map(q => q.adjEbitdaMarginPct), fmt: 'pct' }, { name: 'EBITDA margin reported', values: SQ.map(q => q.ebitdaMarginPct), fmt: 'pct' }], labels: 'last', min: 0, max: 90, source: 'ICICI Direct (gross, reported); MOSL (before FX); company' },
        { type: 'column', title: 'Tax rate: 23% in FY26 → 26% from FY27', unit: 'Effective tax rate (%); FY27-29E = GAM', x: ['FY23', 'FY24', 'FY25', 'FY26', 'Q1FY27', ...F.years], series: [{ name: 'Tax rate', values: [21.1, 26.8, 22.6, 23.3, Q1.etrPct, ...AS.taxRate], fmt: 'pct' }], labels: 'all', highlight: 'Q1FY27', source: 'Screener.in; Q1FY27 results; GAM' },
      ] },
      { exhibit: { type: 'table', title: 'How the FX lines distort reported numbers (₹ crore)', head: ['', 'FY25', 'FY26', 'Q1FY26', 'Q1FY27', 'Where it sits'], wide: [5], rows: [
        ['FX gain', '28.2', n1(FY26.fxGain), '9.4', n1(Q1.fxGain), 'Other income'],
        ['Mark-to-market hedge loss', '8.5', n1(FY26.hedgeLoss), '25.2', n1(Q1.fxLoss), 'Other expenses (inside EBITDA)'],
        { hl: true, cells: ['**Net FX**', '**+19.7**', `**${n1(FY26.fxGain - FY26.hedgeLoss)}**`, '**−15.8**', `**+${n1(Q1.fxGain - Q1.fxLoss)}**`, 'In PBT'] },
        ['EBITDA reported / before FX loss', '1,260 / 1,268', `${n0(FY26.reportedEbitda)} / ${n0(FY26.adjEbitda)}`, '351 / 377', `${n0(Q1.reportedEbitda)} / ${n0(Q1.adjEbitda)}`, 'Company presentations'],
        ['Margin reported / before FX loss', '27.1% / 27.3%', '25.6% / 27.5%', '27.0% / 28.9%', `26.1% / ${Q1.adjEbitdaMarginPct}%`, 'Guidance (27% ±1pp) is before FX'],
      ], source: 'Q1FY27 results note 5; AR FY26 note 38 and MD&A; Q1FY27 presentation; FY25 hedge loss = adjusted less reported EBITDA (company)' } },
      { exhibit: { type: 'table', title: 'Cost lines, % of revenue', head: ['', 'Q1FY26', 'Q1FY27', 'FY26', 'What drives it'], wide: [4], rows: [
        ['Materials (COGS)', '21.2%', '20.2%', '21.7%', 'Branded mix; stable API prices; inventory protected Q1 from war-related inflation'],
        ['Employees', '23.3%', '23.4%', '23.7%', '300 reps added in FY26, 250-300 more planned in India in FY27; increments; ~₹9 cr labour-code charge in FY26'],
        ['  of which R&D', '4.3%', '4.1%', '4.6%', 'Guided ~5% of sales; ₹252 cr in FY26'],
        ['Other expenses incl. R&D and hedge loss', '28.6%', '30.3%', '29.0%', 'New therapies (gynaec, nephro), registrations, freight (Middle East rerouting), hedge loss'],
      ], source: 'ICICI Direct and BOBCAPS quarterly tables; AR FY26 MD&A' } },
      { callout: `**So what:** the 27-28% margin is not a cyclical high; it has held through FY24-Q1FY27 with rising investment in people. The near-term pressure is cost (freight and API inflation from the Middle East war, which management said would show from Q2FY27) and mix (the low-margin US business was 30% of Q1 sales). We model {{F.ebitdaMargin.0|pct}} / {{F.ebitdaMargin.1|pct}} / {{F.ebitdaMargin.2|pct}} for FY27-29E: inside the 26-28% guidance band, rising slowly as branded generics grow faster than the US. The bigger change below EBITDA is tax (26% vs 23%), worth ~₹${n1(0.03 * F.pbt[1] / X.SHARES)} of FY28E EPS.` },
    ],
  };
})();

const PA = require('./AJANTPHARM.partA2');
const { capital, balance, ownershipBase, statements, statementNotes } = PA;
module.exports = { financials, margins, capital, balance, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  const B = fs.existsSync(path.join(__dirname, 'AJANTPHARM.research.js')) ? require('./AJANTPHARM.research') : null;
  const report = {
    symbol: 'AJANTPHARM', listing: 'NSE: AJANTPHARM · BSE: 532331', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Healthcare',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, margins, capital, balance, ownershipBase, statements }) : [financials, margins, capital, balance, ownershipBase, statements].filter(Boolean),
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections, ${JSON.stringify(report).match(/"type":/g).length} chart/table exhibits`);
}
