// Bajaj Finance report, part 4: funding and liquidity, capital and leverage, the ROA → ROE tree.
const X = require('./BAJFINANCE.ctx');
const { C, F, A, AS, fin, fi, n0, n1, n2, pc, Q1, price, pbMult, bvSep28, RAISE, newSh, bvSep28Raise, roe28Raise, tpRaise, bhflValue, bhflPerShare, shares } = X;
const V = X.V;

const funding = {
  id: 'funding', nav: 'Funding & liquidity', kicker: 'Funding', title: 'Funding: AAA, diversified, and longer than its loans; a deposit book of ₹68,500 cr',
  blocks: [
    { p: `Bajaj Finance funds itself like a high-grade corporate, not like a bank. In Jun-2026 group borrowings were 50% money markets (bonds and commercial paper), 30% bank loans, 15% public and corporate deposits (₹68,534 cr) and 5% foreign borrowings (ECB). It is rated AAA/Stable by CRISIL, ICRA, CARE and India Ratings, BBB by S&P and Baa3 by Moody's (both at India's sovereign level). The deposit licence is rare among NBFCs; deposits are 20% of Bajaj Finance's own borrowings. What it lacks is a bank's low-cost current and savings accounts, which is why its cost of funds (7.40% in Q1FY27) is well above a large bank's.` },
    { pair: [
      { type: 'hbar', title: 'Borrowing mix: half from the bond and CP markets', unit: 'Share of consolidated borrowings, Jun-2026 (%)', x: ['Money markets (NCDs, CP)', 'Bank loans', 'Deposits', 'Foreign borrowings (ECB)'], series: [{ name: 'Share', values: [50, 30, 15, 5], fmt: 'pct0' }], labels: 'all', source: 'Q1FY27 presentation p24' },
      { type: 'column', title: 'Cost of funds: down 57bp since FY25, now flat', unit: 'Cost of funds, company basis (%)', x: ['FY25', 'Q1FY26', 'Q2FY26', 'Q3FY26', 'Q4FY26', 'Q1FY27'], series: [{ name: 'Cost of funds', values: [7.97, 7.79, 7.52, 7.45, 7.41, 7.40], fmt: 'n2' }], labels: 'all', min: 7, max: 8.2, source: 'Q4FY26 presentation p22; Q1FY27 presentation p6, p43 (Q1-Q2FY26 read from the chart)' },
    ] },
    { exhibit: { type: 'table', title: 'Asset-liability profile of Bajaj Finance (standalone), Jun-2026: positive gaps in every bucket', head: ['Bucket', 'Up to 7 days', 'Up to 1 month', 'Up to 3 months', 'Up to 6 months', 'Up to 1 year', 'Up to 3 years', 'Up to 5 years'], rows: [
      ['Cumulative inflows (₹ cr)', '44,546', '69,522', '1,14,731', '1,71,054', '2,55,917', '4,06,213', '4,46,863'],
      ['Cumulative outflows (₹ cr)', '24,725', '47,632', '79,085', '1,01,068', '1,69,812', '2,98,233', '3,47,670'],
      { hl: true, cells: ['Cumulative surplus (% of outflows)', '80%', '46%', '45%', '69%', '51%', '36%', '29%'] },
    ], source: 'Q1FY27 presentation p44 (behaviourised ALM). Liquidity buffer ₹17,847 cr; daily average LCR 231% vs 100% required.' } },
    { callout: '**Why it matters:** NBFCs fail on liquidity before they fail on credit (IL&FS, DHFL in 2018-19). Bajaj Finance\'s liabilities mature later than its assets on a behavioural basis, it holds a ₹17,800 cr liquidity buffer and its liquidity coverage ratio is 2.3x the requirement. Funding is a strength; it is just not a cost advantage over banks.' },
  ],
};

const raiseRows = [
  ['Book value per share, Sep-28E (₹)', n1(bvSep28), n1(bvSep28Raise), pc((bvSep28Raise / bvSep28 - 1) * 100)],
  ['ROE, FY28E', `${n1(F.roe[1])}%`, `${n1(roe28Raise)}%`, `${n1(roe28Raise - F.roe[1])}pp`],
  ['Shares (crore)', n1(shares), n1(shares + newSh), pc(newSh / shares * 100)],
  [`Value at our ${pbMult}x Sep-28E book (₹)`, n0(V.tp), n0(tpRaise), pc((tpRaise / V.tp - 1) * 100)],
];
const capital = {
  id: 'capital', nav: 'Capital & leverage', kicker: 'Capital', title: 'Capital: growth needs equity every few years, and the next raise was announced on 24-Sep-2026',
  blocks: [
    { p: `Capital adequacy (standalone) was ${Q1.crar}% in Jun-2026 (Tier 1 ${Q1.tier1}%) against a 15% minimum; group assets were 4.9x net worth (company's leverage measure; ~4.3x standalone). The constraint is not the regulatory minimum but the company's own comfort level and the 125% risk weight on consumer loans. At 22-25% AUM growth and an 18% payout, retained profit grows equity by only ~16-17% a year, so leverage creeps up. Without new equity our model takes assets to {{fin.assetsToEquity.14|n2}}x equity by FY29E, from {{fin.assetsToEquity.11|n2}}x in FY26.` },
    { p: `On 30-Jul-2026 the MD said: "First protocol most likely will be BHFL dilution. And then if our growth momentum continues to accelerate, then ... think about capital raise", and "we don't foresee raising capital". Eight weeks later, on 24-Sep-2026, the company told the exchanges its board would meet at the start of October to consider raising equity by a QIP and/or a preferential issue. No size was given; Jefferies estimated ~₹15,000 cr (~10% of FY28E net worth) and linked it to the staggered BHFL sell-down and the Mar-2028 succession. The stock fell ~5% that day.` },
    { exhibit: { type: 'table', title: `What a ₹${n0(RAISE)} cr raise at the 30-Sep price would do (not in our base case)`, head: ['', 'Base case', 'With raise', 'Change'], rows: raiseRows, source: 'GAM Research. Assumes issue at ₹959 in H2FY27, proceeds earning the post-tax cost of funds. The final size, price and buyer (QIP vs Bajaj Finserv) were not known on 30-Sep-2026.' } },
    { p: `**Why we leave it out of the base case:** on 30-Sep-2026 neither size nor price was known, and at ~4.4x book the raise adds to book value per share (+${n1((bvSep28Raise / bvSep28 - 1) * 100)}%) but cuts ROE by ~${n1(F.roe[1] - roe28Raise)}pp. At an unchanged ${pbMult}x the target would rise to ~₹${n0(tpRaise)}; but a lower ROE deserves a lower multiple (at our justified P/B maths, ~1.3pp of ROE is worth ~0.4x), so the two roughly cancel. **What we do model** is the BHFL sell-down: selling ~11.7% of BHFL at ₹82 raises ~₹8,000 cr; after ~14.6% tax on the gain and the minority stake created, about ₹3,900 cr is added to the parent's equity over FY27-28E. At the 30-Sep price BFL's 86.7% of BHFL was worth ₹${n0(bhflValue)} cr, ₹${n0(bhflPerShare)} per BFL share.` },
    { pair: [
      { type: 'line', title: 'Leverage creeps up without fresh equity', unit: 'Total assets ÷ net worth (x)', x: 'fin.labels', from: 'FY18', to: 'FY29E', series: [{ name: 'Assets ÷ equity', ref: 'fin.assetsToEquity', fmt: 'n2' }], labels: 'all', min: 3.5, max: 7, source: 'Screener.in; GAM estimates (incl. BHFL sale proceeds, excl. the new raise)' },
      { type: 'column', title: 'Capital adequacy has come down from 28% to 21%', unit: 'CRAR, standalone (%), March', x: C.annualKpis.map(k => k.fy), series: [{ name: 'CRAR', values: C.annualKpis.map(k => k.crar), fmt: 'pct' }], labels: 'all', min: 0, max: 32, source: 'Q1FY27 presentation p26-27' },
    ] },
    { callout: `**Our view:** the raise is the price of the growth the market wants. Bajaj Finance raised equity in FY18, FY20 and FY24 and kept compounding after each; the dilution is small (~2-3% of shares) and done at 4-5x book. What grates is the message: management ruled it out on 30 July and called it eight weeks later. The company gave no reason; the RBI's August draft and the points Jefferies raised (slow BHFL sell-down, the Mar-2028 succession) are the obvious candidates, and none of them is reassuring. Dividends: we model an 18% payout (DPS ₹{{F.dps.0|n2}} in FY27E).` },
  ],
};

// ROA tree on average AUM, built from the model
const cols = ['FY24', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'].map(fi);
const r2 = v => (v == null ? '–' : (Math.round(v * 100) / 100).toFixed(2));
const lineOf = (name, fn, hl) => ({ hl, cells: [hl ? `**${name}**` : name, ...cols.map(i => { const v = fn(i); return hl ? `**${r2(v)}**` : r2(v); })] });
const tax = i => (fin.ppopPct[i] - fin.creditCost[i]) * fin.taxRate[i] / 100;
const roaTree = {
  id: 'roatree', nav: 'ROA → ROE tree', kicker: 'Returns', title: 'From ROA to ROE: 4.5% on assets, levered ~4.5x, gives ~20%',
  blocks: [
    { p: 'A lender\'s return on equity is its return on assets times leverage. Bajaj Finance earns more per rupee of loans than almost any Indian lender because its yields are high and its costs and losses are controlled; it needs only ~4.5x leverage (a large bank runs at 10x+) to reach a ~20% ROE. The tree shows where FY26 fell short and where FY27E recovers.' },
    { exhibit: { type: 'table', title: 'ROA tree, % of average AUM', head: ['', 'FY24', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      lineOf('Interest income (yield)', i => fin.yieldOnAum[i]),
      lineOf('− Interest expense', i => fin.yieldOnAum[i] - fin.nim[i]),
      lineOf('= Net interest margin', i => fin.nim[i], true),
      lineOf('+ Fees and other income', i => fin.feePct[i]),
      lineOf('− Operating expenses', i => fin.opexPct[i]),
      lineOf('= Pre-provision profit', i => fin.ppopPct[i], true),
      lineOf('− Loan losses (credit cost)', i => fin.creditCost[i]),
      lineOf('− Tax (approx.)', tax),
      lineOf('= ROA on AUM (attributable)', i => fin.roaAum[i], true),
      lineOf('× Average AUM ÷ average equity (x)', i => fin.roe[i] / fin.roaAum[i]),
      lineOf('= ROE (%)', i => fin.roe[i], true),
    ], source: 'Company, Screener.in; GAM estimates. Tax and other income are small balancing items; ROA on AUM is close to the company\'s ROA on average AUF (4.3% FY26, 4.7% Q1FY27).' } },
    { callout: `**What changes:** FY27E ROA recovers to {{F.roaAum.0|pct}} because credit cost falls ~55bp while NIM slips only ~10bp. After that, margins fall faster than costs, so ROA drifts down to {{F.roaAum.2|pct}} and ROE stays ~20% only because leverage rises. That is the honest shape of the story: a franchise holding returns by running harder, not one whose returns are expanding.` },
  ],
};

module.exports = { funding, capital, roaTree, ...require('./BAJFINANCE.part4b') };
