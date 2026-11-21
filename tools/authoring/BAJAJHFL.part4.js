// Bajaj Housing Finance report, part 4: funding and liquidity, capital and leverage, the ROA → ROE tree.
const X = require('./BAJAJHFL.ctx');
const { C, F, A, AS, fin, fi, n0, n1, n2, pc, Q1 } = X;
const FU = C.funding, QK = C.quarterlyKpis;
const crarProxy = i => C.fy26.crar * fin.equityToAum[i] / fin.equityToAum[fi('FY26')]; // CRAR scaled by equity ÷ AUM (risk weights unknown)

const funding = {
  id: 'funding', nav: 'Funding & liquidity', kicker: 'Funding', title: 'Funding: AAA, long-dated and diversified, but still dearer than a bank\'s deposits',
  blocks: [
    { p: `BHFL funds itself like a top-rated corporate. In Jun-2026 its ₹1.1 lakh cr of borrowings were 46.5% bonds (NCDs), 38.3% bank loans from 18 banks, 9.9% refinance from the National Housing Bank and 5.3% commercial paper; in FY26 it added floating-rate pass-through certificates. Long-term debt is rated AAA/Stable by CRISIL and India Ratings. It borrows mostly for 3-5 years, so its liabilities mature after its assets on a behavioural basis: the cumulative surplus is positive in every bucket up to one year. The liquidity buffer is small (₹2,516 cr) but the liquidity coverage ratio was 158% against the 100% required. Cost of funds was 7.2% in Q1FY27, 50bp lower than a year earlier.` },
    { pair: [
      { type: 'hbar', title: 'Borrowing mix: bonds and bank loans, little short-term paper', unit: 'Share of borrowings, Jun-2026 (%)', x: ['Bonds (NCDs)', 'Bank loans', 'NHB refinance', 'Commercial paper'], series: [{ name: 'Share', values: [46.5, 38.3, 9.9, 5.3], fmt: 'pct' }], labels: 'all', source: 'Q1FY27 presentation p26' },
      { type: 'column', title: 'Cost of funds: 7.9% to 7.2%, now flattening', unit: 'Cost of funds, company basis (%), quarter', x: QK.map(q => q.q), series: [{ name: 'Cost of funds', values: QK.map(q => q.costOfFunds), fmt: 'n1' }], labels: 'all', min: 6.5, max: 8.2, source: 'Q1FY27 presentation p24' },
    ] },
    { callout: '**Why it matters:** housing-finance companies fail on funding, not on credit (DHFL, 2019). BHFL\'s funding is as good as a non-bank\'s gets: AAA, long-dated, diversified and backed by a strong parent. It is not a cost advantage over banks, which fund home loans with deposits costing far less; that is the root of the margin problem.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capital & leverage', kicker: 'Capital', title: 'Capital: plenty for now; ROE rises only by spending it',
  blocks: [
    { p: `Capital adequacy was ${Q1.crar}% in Jun-2026 (Tier 1 ${Q1.tier1}%) against a 15% minimum; total assets were ${Q1.leverage}x equity against an internal ceiling of 8x and guidance of 5.8-6.3x for FY27. BHFL has never paid a dividend. With the ₹5,560 cr raised in FY25 still being deployed, it has spare capital, and that is precisely why ROE is low: ROA of ~2.2% on loan assets times ~5.6x leverage is ~12%. The path to a higher ROE runs through more leverage, not better margins.` },
    { exhibit: { type: 'table', title: 'Capital path in our model (no new equity)', head: ['', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Net worth (₹ cr)', '{{fin.netWorth.5|num}}', '{{fin.netWorth.6|num}}', '{{F.netWorth.0|num}}', '{{F.netWorth.1|num}}', '{{F.netWorth.2|num}}'],
      ['Total assets ÷ equity (x)', '{{fin.assetsToEquity.5|n2}}', '{{fin.assetsToEquity.6|n2}}', '{{F.assetsToEquity.0|n2}}', '{{F.assetsToEquity.1|n2}}', '{{F.assetsToEquity.2|n2}}'],
      ['Equity ÷ AUM (%)', '{{fin.equityToAum.5|pct}}', '{{fin.equityToAum.6|pct}}', '{{F.equityToAum.0|pct}}', '{{F.equityToAum.1|pct}}', '{{F.equityToAum.2|pct}}'],
      ['CRAR (%): reported, then our proxy', `${C.annualKpis.find(k => k.fy === 'FY25').crar}`, `${C.fy26.crar}`, n1(crarProxy(fi('FY27E'))), n1(crarProxy(fi('FY28E'))), n1(crarProxy(fi('FY29E')))],
      ['ROE (%)', '{{fin.roe.5|pct}}', '{{fin.roe.6|pct}}', '{{F.roe.0|pct}}', '{{F.roe.1|pct}}', '{{F.roe.2|pct}}'],
    ], source: 'Company; GAM estimates. CRAR proxy = FY26 CRAR scaled by equity ÷ AUM (risk weights by product are not disclosed; a faster-growing commercial book would push it lower).' } },
    { p: `**Future equity needs.** Retaining all profit grows equity ~13-14% a year against AUM growth of 20%+, so leverage rises ~0.4x a year: ${n2(F.assetsToEquity[2])}x by FY29E, ~8x around FY32 if nothing changes, with CRAR (on our rough proxy) nearing 16% by FY31, too close to the 15% floor for comfort. So BHFL needs no equity for the forecast period, but a 20%-growth mortgage lender at a 12-14% ROE cannot fund itself for ever. The next raise, probably early in the 2030s, could double as the route to the 25% public float: a fresh issue to outside investors dilutes the parent without the parent selling. That option is not in our numbers and has not been announced.` },
    { pair: [
      { type: 'line', title: 'Leverage creeps back toward its FY22 peak', unit: 'Total assets ÷ net worth (x)', x: 'fin.labels', from: 'FY20', to: 'FY29E', series: [{ name: 'Assets ÷ equity', ref: 'fin.assetsToEquity', fmt: 'n2' }], labels: 'all', min: 4, max: 8.5, lines: [{ v: 8, text: 'Internal ceiling 8x', color: '#b4232a' }], source: 'Company, Screener.in; GAM estimates' },
      { type: 'column', title: 'Capital adequacy: 28% after the IPO, 22% now', unit: 'CRAR (%), March; regulatory minimum 15%', x: C.annualKpis.filter(k => k.fy >= 'FY20').map(k => k.fy), series: [{ name: 'CRAR', values: C.annualKpis.filter(k => k.fy >= 'FY20').map(k => k.crar), fmt: 'pct' }], labels: 'all', min: 0, max: 32, lines: [{ v: 15, text: 'Minimum 15%', color: '#b4232a' }], source: 'Q1FY27 presentation p10' },
    ] },
    { callout: '**Our view:** capital is a strength in the short term and the reason ROE is low. Management\'s own FY27 assessment (ROE 12-13% at 5.8-6.3x leverage) tells you what this business earns at a comfortable gearing. We model ROE rising to {{F.roe.2|pct}} by FY29E as leverage reaches {{F.assetsToEquity.2|n2}}x; bulls who expect 14-15% are assuming 7-8x leverage or a margin recovery that management is not guiding to.' },
  ],
};

// ROA tree on average AUM, built from the model
const cols = ['FY24', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'].map(fi);
const r2 = v => (v == null ? '–' : (Math.round(v * 100) / 100).toFixed(2));
const lineOf = (name, fn, hl) => ({ hl, cells: [hl ? `**${name}**` : name, ...cols.map(i => { const v = fn(i); return hl ? `**${r2(v)}**` : r2(v); })] });
const tax = i => (fin.ppopPct[i] - fin.creditCost[i]) * fin.taxRate[i] / 100;
const roaTree = {
  id: 'roatree', nav: 'ROA → ROE tree', kicker: 'Returns', title: 'From ROA to ROE: ~2% on assets, levered ~6x, gives 12-13%',
  blocks: [
    { p: 'A lender\'s return on equity is its return on assets times leverage. BHFL\'s ROA is excellent for a mortgage lender because its costs and losses are tiny; but a mortgage lender\'s ROA is small by nature (a home loan yields ~9%), so even at 6x leverage the ROE is only 12-13%. The tree (on average AUM, which includes assigned loans) shows where FY27E loses margin and where it gets it back.' },
    { exhibit: { type: 'table', title: 'ROA tree, % of average AUM', head: ['', 'FY24', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      lineOf('Interest income (yield)', i => fin.yieldOnAum[i]),
      lineOf('− Interest expense', i => fin.yieldOnAum[i] - fin.nim[i]),
      lineOf('= Net interest margin', i => fin.nim[i], true),
      lineOf('+ Fees and other income', i => fin.feePct[i]),
      lineOf('− Operating expenses', i => fin.opexPct[i]),
      lineOf('= Pre-provision profit', i => fin.ppopPct[i], true),
      lineOf('− Loan losses (credit cost)', i => fin.creditCost[i]),
      lineOf('− Tax (approx.)', tax),
      lineOf('= ROA on AUM', i => fin.roaAum[i], true),
      lineOf('× Average AUM ÷ average equity (x)', i => fin.roe[i] / fin.roaAum[i]),
      lineOf('= ROE (%)', i => fin.roe[i], true),
    ], source: 'Company, Screener.in; GAM estimates. ROA on AUM is ~12% below the company\'s ROA on average loan assets (2.3% FY26).' } },
    { callout: '**What changes:** FY27E ROA on AUM falls to {{F.roaAum.0|pct}} (from {{fin.roaAum.6|pct}}) because margin drops ~25bp while costs and losses fall only ~10bp. After that ROA drifts to {{F.roaAum.2|pct}} and ROE rises to {{F.roe.2|pct}} only because each rupee of equity supports more loans. That is a franchise holding returns by gearing up, not one whose returns are expanding.' },
  ],
};

module.exports = { funding, capital, roaTree, ...require('./BAJAJHFL.part4b') };
