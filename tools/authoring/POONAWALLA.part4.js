// Poonawalla Fincorp report, part 4: funding and liquidity, capital and leverage, the ROA → ROE tree.
const X = require('./POONAWALLA.ctx');
const { C, F, A, AS, fin, fi, n0, n1, n2, pc, Q1, QK, AK, price, pbMult, bvSep28, NORAISE, RAISE, raisePx, shares, V } = X;

const funding = {
  id: 'funding', nav: 'Funding & liquidity', kicker: 'Funding', title: 'Funding: AAA-rated and lengthened, but with no deposit franchise the cost stays ~7.7%',
  blocks: [
    { p: `Poonawalla borrows from banks (term loans and working-capital lines), the bond market (NCDs), commercial paper and foreign lenders (ECB). In FY26 it raised ₹13,830 cr through NCDs, lifting them from ~7% of borrowings (Mar-2025) to ~32% (Mar-2026), and long-term money from 75.2% of borrowings (Q1FY26) to 88.5% (Q1FY27). Borrowings were ₹${n0(Q1.borrowings)} cr in Jun-2026. CRISIL and CARE rate it AAA/Stable (A1+ for CP), backed by the Poonawalla group; in Dec-2020, before the takeover, Magma was rated AA- (CARE). The cost of borrowing was ${Q1.cofCo}% in Q1FY27, down from 8.07% in Q4FY25 but up 9bp on the quarter.` },
    { pair: [
      { type: 'column', title: 'Longer funding: long-term money up to 88.5%', unit: 'Long-term borrowings, % of total', x: ['Q1FY26', 'Q4FY26', 'Q1FY27'], series: [{ name: 'Long-term share', values: [75.2, 86.5, 88.5], fmt: 'pct' }], labels: 'all', min: 0, max: 100, source: 'Q1FY27 call (CFO and ED)' },
      { type: 'column', title: 'Bond market share: from 7% to 32% in a year', unit: 'NCDs (incl. sub-debt NCDs), % of borrowings', x: ['Mar-25', 'Mar-26', 'Jun-26'], series: [{ name: 'NCD share', values: [7, 32, 32], fmt: 'pct0' }], labels: 'all', min: 0, max: 40, source: 'Q4FY26 presentation p20; Q1FY27 presentation p20' },
    ] },
    { exhibit: { type: 'table', title: 'Asset-liability profile, Jun-2026: positive cumulative gaps in every bucket', head: ['Bucket', '0-7 days', '8-14 days', '15-30 days', '1-2 m', '2-3 m', '3-6 m', '6-12 m', '1-3 y', '3-5 y'], rows: [
      { hl: true, cells: ['Cumulative surplus (₹ cr)', '2,000', '2,316', '2,872', '4,960', '6,186', '9,520', '2,467', '3,515', '496'] },
      ['Cumulative surplus (% of outflows)', '215%', '211%', '177%', '158%', '111%', '126%', '10%', '8%', '1%'],
    ], source: `Q1FY27 presentation p22 (structural liquidity). Liquidity ₹${n0(Q1.liquidity)} cr in cash and undrawn lines; LCR ${Q1.lcr}%. Mar-2026 showed a small 3-5 year gap (−2%) before the QIP money arrived.` } },
    { callout: '**Why it matters:** NBFCs fail on liquidity before they fail on credit. Poonawalla\'s funding is now longer and more diversified than at any time in its history, and the ALM is positive in every bucket. The thin spots are the 6-month-to-5-year buckets (surpluses of 1-10%), which a 35-40% growth plan will keep stretching, and the absence of any cheap funding source: unlike banks or deposit-taking NBFCs, every rupee is wholesale.' },
  ],
};

const raiseRows = [
  ['Book value per share, Sep-28E (₹)', n1(NORAISE.bvSep28), n1(bvSep28), pc((bvSep28 / NORAISE.bvSep28 - 1) * 100)],
  ['ROE, FY28E / FY29E (%)', `${n1(NORAISE.roe28)} / ${n1(NORAISE.roe29)}`, `${n1(F.roe[1])} / ${n1(F.roe[2])}`, `${n1(F.roe[1] - NORAISE.roe28)}pp / ${n1(F.roe[2] - NORAISE.roe29)}pp`],
  ['EPS, FY28E (₹)', n2(NORAISE.eps28), n2(F.eps[1]), pc((F.eps[1] / NORAISE.eps28 - 1) * 100)],
  ['AUM ÷ net worth, FY28E / FY29E (x)', `${n2(NORAISE.lev28)} / ${n2(NORAISE.lev29)}`, `${n2(F.leverage[1])} / ${n2(F.leverage[2])}`, ''],
  ['Net worth ÷ AUM, FY28E (%)', n1(NORAISE.eqAum28), n1(F.equityToAum[1]), 'proxy for capital adequacy (minimum 15%)'],
  [`Value at our ${pbMult}x Sep-28E book (₹)`, n0(NORAISE.tp), n0(V.tp), pc((V.tp / NORAISE.tp - 1) * 100)],
];
const capital = {
  id: 'capital', nav: 'Capital & leverage', kicker: 'Capital', title: 'Capital: ₹4,000 cr raised in seven months, and the growth plan needs more',
  blocks: [
    { p: `Capital adequacy (CRAR) was ${Q1.crar}% in Jun-2026 (Tier 1 ${Q1.tier1}%) against a 15% minimum. It had fallen from 33.8% (Mar-2024) to 22.9% (Mar-2025) and 16.8% (Mar-2026) as the book doubled, and was rebuilt by two raises: ₹1,500 cr from the promoter at ₹452.51 (Sep-2025) and a ₹2,500 cr QIP at ₹370.75 (Apr-2026), 6.74 cr shares or ~8% dilution. Risk weights are ~100-125% on most of the book, so CRAR moves roughly with equity ÷ AUM (19.5% in Jun-2026).` },
    { p: `The arithmetic is simple. At ~12-14% ROE and no dividend, retained profit grows equity ~12-15% a year; at 30-40% AUM growth, equity ÷ AUM falls ~3pp a year. Without new money, our model takes it to ${n1(NORAISE.eqAum28)}% by FY28E, below the regulatory floor once deductions are counted. The MD said in July the QIP leaves the company "comfortable for the next 4 to 5 quarters", and the board's enabling approval of Jan-2026 was for ₹5,500 cr. **We therefore assume a further ₹${n0(RAISE)} cr raise in FY28E** at the 30-Sep close (₹${n0(raisePx)}, ${n1(AS.newShares[1])} cr shares, ~7.7% dilution), as Emkay also does. It is not announced.` },
    { exhibit: { type: 'table', title: `What the assumed ₹${n0(RAISE)} cr FY28E raise does (base case includes it)`, head: ['', 'Without the raise', 'Base case (with raise)', 'Change'], rows: raiseRows, source: 'GAM Research (same engine, raise removed). Raising at ~2.2x book adds to book per share and cuts ROE and EPS.' } },
    { callout: `**Our view:** the raise is the price of the growth. Issued at ~2.2x book it lifts book per share by ~${n0((bvSep28 / NORAISE.bvSep28 - 1) * 100)}%, which mechanically raises a P/B-based target, while cutting FY28E ROE by ~${n1(NORAISE.roe28 - F.roe[1])}pp. This matters for the rating: without the raise the same ${pbMult}x would give ₹${n0(NORAISE.tp)} (HOLD), but without it the growth we model would breach capital rules. The promoter has backed the company twice (2021, 2025); the next raise's price will matter more than its size.` },
    { pair: [
      { type: 'line', title: 'Leverage rises even with two more raises', unit: 'AUM ÷ net worth (x)', x: 'fin.labels', from: 'FY23', to: 'FY29E', series: [{ name: 'AUM ÷ equity', ref: 'fin.leverage', fmt: 'n2' }], labels: 'all', min: 0, max: 8, source: 'Company, Screener.in; GAM estimates (incl. the Apr-2026 QIP and the assumed FY28E raise)' },
      { type: 'column', title: 'Capital adequacy: 34% to 19% in two years', unit: 'CRAR (%), March; Jun-26 after the QIP', x: ['Mar-24', 'Mar-25', 'Sep-25', 'Mar-26', 'Jun-26'], series: [{ name: 'CRAR', values: [AK.FY24.crar, AK.FY25.crar, 20.85, AK.FY26.crar, Q1.crar], fmt: 'pct' }], labels: 'all', min: 0, max: 36, highlight: 'Jun-26', source: 'Company presentations' },
    ] },
  ],
};

// ROA tree on average AUM, built from the model; FY24 includes the net exceptional gain in the balancing row
const cols = ['FY24', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'].map(fi);
const r2 = v => (v == null ? '–' : (Math.round(v * 100) / 100).toFixed(2));
const lineOf = (name, fn, hl) => ({ hl, cells: [hl ? `**${name}**` : name, ...cols.map(i => { const v = fn(i); return hl ? `**${r2(v)}**` : r2(v); })] });
const t = i => (fin.taxRate[i] ?? 25) / 100;
const pre = i => fin.ppopPct[i] - fin.creditCost[i];
const i26 = fi('FY26'), i27 = fi('FY27E');
const bp = v => Math.round(Math.abs(v) * 100);
const roaAt = (cc, opex) => (F.ntiPct[2] - opex - cc) * (1 - AS.taxRate[2] / 100); // FY29E ROA on AUM at other cost levels
const roaTree = {
  id: 'roatree', nav: 'ROA → ROE tree', kicker: 'Returns', title: 'From ROA to ROE: ~2% on assets at ~6x leverage gives only ~12-14%',
  blocks: [
    { p: 'A lender\'s return on equity is its return on assets times leverage. Poonawalla earns a high yield, but pays a lot to run its book (opex ~4% of AUM) and loses ~2-2.5% to bad loans, so only ~2% of AUM reaches the bottom line even in our improving forecast. With ~6x AUM ÷ equity, that gives a 12-14% ROE. To reach the 18-20%+ that the share price implies, it needs management\'s 3-3.5% ROA, or much more leverage, which capital rules do not allow.' },
    { exhibit: { type: 'table', title: 'ROA tree, % of average AUM', head: ['', 'FY24', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      lineOf('Interest income (yield)', i => fin.yieldOnAum[i]),
      lineOf('− Interest expense', i => fin.yieldOnAum[i] - fin.nim[i]),
      lineOf('= Net interest margin', i => fin.nim[i], true),
      lineOf('+ Fees and other income', i => fin.feePct[i]),
      lineOf('− Operating expenses', i => fin.opexPct[i]),
      lineOf('= Pre-provision profit', i => fin.ppopPct[i], true),
      lineOf('− Credit cost', i => fin.creditCost[i]),
      lineOf('− Tax on the above (approx.)', i => pre(i) * t(i)),
      lineOf('± Other income and exceptional items, after tax', i => fin.roaAum[i] - pre(i) * (1 - t(i))),
      lineOf('= ROA on AUM', i => fin.roaAum[i], true),
      lineOf('× Average AUM ÷ average equity (x)', i => fin.roe[i] / fin.roaAum[i]),
      lineOf('= ROE (%)', i => fin.roe[i], true),
    ], source: 'Annual Reports FY25-FY26, Screener.in; GAM estimates. FY24: provisions exclude the ₹1,473 cr exceptional provision and write-off, which sit with the ₹2,309 cr housing-sale gain in the "other and exceptional" row. FY25 credit cost includes the ₹666 cr STPL clean-up.' } },
    { callout: `**What changes:** ROA on AUM rises from ${n2(fin.roaAum[fi('FY26')])}% in FY26 to {{F.roaAum.0|pct}} in FY27E as credit cost falls ~${bp(fin.creditCost[i26] - fin.creditCost[i27])}bp, opex ~${bp(fin.opexPct[i26] - fin.opexPct[i27])}bp and NIM rises ~${bp(fin.nim[i27] - fin.nim[i26])}bp, then to {{F.roaAum.2|pct}} by FY29E. Management's 3-3.5% target is a long way off: on our FY29E yield and funding, even credit cost of 1.5% and opex of 3.3% of AUM at the same time would give ~${n1(roaAt(1.5, 3.3))}%. Possible, but not yet visible in any quarter; we do not put it in the base case.` },
  ],
};

module.exports = { funding, capital, roaTree, ...require('./POONAWALLA.part4b') };
