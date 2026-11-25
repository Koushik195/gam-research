// Authoring source for the Piramal Pharma initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated; Net Profit = profit attributable to
// owners, minority share nil; FY26 EPS restated on the 132.92 cr shares in issue by PPLPHARMA.patch.js). Part B
// (PPLPHARMA.research.js + part2-6, shared PPLPHARMA.ctx.js) adds the research chapters, cover, rating and statement notes.
// PPLPHARMA.sotp.js first syncs the sum of the parts into assumptions.json as an implied EV/EBITDA on Sep-28E EBITDA.
// Usage: node tools/authoring/PPLPHARMA.js
const { fs, path, RD, A, b, ix, RR, n0, n1, sum, SRC, FY } = require('./PPLPHARMA.base');

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Five years: revenue up 40%, EBITDA down 35%, profit gone. The overseas build-out and one customer explain most of it',
  blocks: [
    { p: `Revenue grew from ₹${n0(A.sales[ix('FY21')])} cr in FY21 to a peak of ₹${n0(A.sales[ix('FY25')])} cr in FY25 and slipped to ₹${n0(A.sales[b])} cr in FY26. EBITDA before other income went the other way: ₹${n0(A.ebitda[ix('FY21')])} cr (${n1(A.ebitdaMargin[ix('FY21')])}%) in FY21, a collapse to ₹${n0(A.ebitda[ix('FY23')])} cr (${n1(A.ebitdaMargin[ix('FY23')])}%) in FY23 as Covid-era CDMO orders faded and new overseas plants added fixed cost, a recovery to ₹${n0(A.ebitda[ix('FY25')])} cr (${n1(A.ebitdaMargin[ix('FY25')])}%) in FY25, and a second fall to ₹${n0(A.ebitda[b])} cr (${n1(A.ebitdaMargin[b])}%) in FY26 when one large on-patent customer stopped ordering to use up its stock. Below EBITDA the costs of growth kept rising: depreciation from ₹${n0(A.dep[ix('FY21')])} cr to ₹${n0(A.dep[b])} cr and interest from ₹${n0(A.interest[ix('FY21')])} cr to ₹${n0(A.interest[b])} cr (peak ₹${n0(A.interest[ix('FY24')])} cr in FY24). Net profit fell from ₹${n0(A.pat[ix('FY21')])} cr in FY21 to losses in FY23 (₹${n0(A.pat[ix('FY23')])} cr) and FY26 (₹${n0(A.pat[b])} cr), with near-zero profits in between.` },
    { pair: [
      { type: 'column', title: 'Revenue: +40% in five years, but FY26 went backwards', unit: 'Revenue (₹ crore)', x: FY, series: [{ name: 'Revenue', values: FY.map(l => A.sales[ix(l)]), fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'line', title: 'EBITDA margin before other income: 23% in FY21, 10% in FY26', unit: 'EBITDA margin (%), Screener basis', x: FY, series: [{ name: 'EBITDA margin', values: FY.map(l => A.ebitdaMargin[ix(l)]), fmt: 'pct' }], labels: 'all', min: 0, max: 30, source: SRC.co },
    ] },
    { pair: [
      { type: 'column', title: 'Depreciation and interest now take nearly all of EBITDA', unit: '₹ crore', x: FY, series: [{ name: 'EBITDA', values: FY.map(l => A.ebitda[ix(l)]), fmt: 'num' }, { name: 'Depreciation', values: FY.map(l => A.dep[ix(l)]), fmt: 'num' }, { name: 'Interest', values: FY.map(l => A.interest[ix(l)]), fmt: 'num' }], labels: 'none', source: SRC.co },
      { type: 'column', title: 'Net profit: losses in FY23 and FY26, near zero in between', unit: 'Net profit (₹ crore)', x: FY, series: [{ name: 'Net profit', values: FY.map(l => A.pat[ix(l)]), fmt: 'num' }], labels: 'all', source: `${SRC.co}. FY26 includes ₹196 cr of exceptional items (₹176 cr impairment)` },
    ] },
    { callout: `**Our view:** Piramal Pharma has spent five years building capacity ahead of demand (₹${n0(sum('capex', 'FY21', 'FY26'))} cr of capex plus acquisitions), and the return has not come yet: ROCE was ${RR('ROCE %').at(-1)}% in FY26 on Screener's basis. The operating story for FY27 is better (Q1 revenue +17%, EBITDA +72%), but even our FY29E EBITDA of ₹{{F.ebitda.2|num}} cr leaves only ~₹{{F.pat.2|num}} cr of profit after depreciation, interest and a tax bill that runs ahead of profit.` },
  ],
};

const seasons = {
  id: 'seasons', nav: 'Quarterly pattern', kicker: 'Quarters', title: 'Quarters: the March quarter makes the year; Q1 is always the weakest',
  blocks: [
    { p: `CDMO customers take delivery late in the fiscal year, so revenue and especially profit bunch in the March quarter: Q4FY25 EBITDA (Screener basis) was ₹561 cr out of ₹1,445 cr for the year (39%), Q4FY26 ₹461 cr out of ₹922 cr (50%). The June quarter is the weakest: Q1FY25 10.5% margin, Q1FY26 5.5%. Q1FY27 revenue was ₹2,270 cr (+17%) with a 8.6% margin (12.5% on the company's basis including other income), a loss of ₹69 cr, and the company says FY27 will again be weighted to the second half. Reading one quarter as a run-rate is the most common mistake with this stock.` },
    { pair: [
      { type: 'column', title: 'Quarterly revenue: the March quarter stands out every year', unit: 'Revenue (₹ crore)', x: 'Q.labels', series: [{ name: 'Revenue', ref: 'Q.sales', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'line', title: 'Quarterly EBITDA margin: 17-21% in Q4, 5-10% in Q1', unit: 'EBITDA margin (%), Screener basis', x: 'Q.labels', series: [{ name: 'EBITDA margin', ref: 'Q.opm', fmt: 'pct0' }], labels: 'all', min: 0, max: 25, source: SRC.co },
    ] },
    { callout: '**What to watch:** Q2FY27 (results due by mid-November 2026): the first quarter with Kenalog supplies, CDMO order conversion at the overseas sites, and whether management upgrades the "early-to-mid-teens" growth guidance, which it said it would revisit after the September quarter.' },
  ],
};

const { balance, ownershipBase, statements } = require('./PPLPHARMA.partA2');
const statementNotes = {};

module.exports = { financials, seasons, balance, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  require('./PPLPHARMA.sotp').syncSotp();
  const B = fs.existsSync(path.join(__dirname, 'PPLPHARMA.research.js')) ? require('./PPLPHARMA.research') : null;
  const report = {
    symbol: 'PPLPHARMA', listing: 'NSE: PPLPHARMA · BSE: 543635', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Pharmaceuticals & CDMO',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, seasons, balance, ownershipBase, statements }) : [financials, seasons, balance, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
