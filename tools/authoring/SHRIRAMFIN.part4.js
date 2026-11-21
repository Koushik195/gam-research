// Shriram Finance report, part 4: funding and liquidity, capital and the MUFG deal, the ROA → ROE tree.
const X = require('./SHRIRAMFIN.ctx');
const { C, F, A, AS, fin, fi, n0, n1, n2, pc, Q1, MU, price, bvps26, bvProForma, epsEx27, bvEx27, roeEx27, roeTw27, avgNwTw27, sharesNow, shares26, carry } = X;
const FU = C.funding.jun26;
// ALM, Jun-2026 (₹ mn, Q1FY27 investor update p28): outflows and inflows by bucket
const OUT = [74815.3, 49874.1, 96211.4, 152203.9, 462061.7, 1123182.3, 288475.1], IN = [225919.8, 144438.7, 184454.1, 308066.8, 571786.0, 1429258.8, 388178.9];
const cum = a => a.map((_, i) => a.slice(0, i + 1).reduce((s, v) => s + v, 0) / 10);
const cO = cum(OUT), cI = cum(IN);

const funding = {
  id: 'funding', nav: 'Funding & liquidity', kicker: 'Funding', title: 'Funding: now AAA, a third from retail deposits, and long on liquidity',
  blocks: [
    { p: `Shriram funds itself from five pools. In Jun-2026 borrowings of ₹${n0(FU.totalBn * 100)} cr were ${n0(FU.deposits)}% public deposits (₹72,070 cr from retail savers, a rare licence for an NBFC), ${n0(FU.termLoans)}% bank term loans, ${n0(FU.ecbLoans + FU.ecBond)}% foreign borrowings (ECB loans and dollar bonds), ${n0(FU.securitisation)}% securitisation (selling pools of loans to banks) and ${n0(FU.ncd)}% rupee bonds. The MUFG deal triggered the change that matters most: ICRA and CRISIL upgraded the company from AA+ to AAA on 9-Apr-2026, India Ratings the next day and Fitch to investment grade (BBB-) on 14-Apr-2026. Its cost of liabilities was 8.56% in Jun-2026 but incremental money cost 7.77%, and bank loans should come at ~8%.` },
    { pair: [
      { type: 'hbar', title: 'Borrowing mix: deposits are the largest single source', unit: 'Share of borrowings, Jun-2026 (%)', x: ['Public deposits', 'Bank term loans', 'ECB loans', 'Securitisation', 'Rupee bonds (NCDs)', 'Dollar bonds (ECB)', 'Subordinated debt'], series: [{ name: 'Share', values: [FU.deposits, FU.termLoans, FU.ecbLoans, FU.securitisation, FU.ncd, FU.ecBond, FU.subDebt], fmt: 'pct' }], labels: 'all', source: 'Q1FY27 investor update p27' },
      { type: 'column', title: 'Cost of money: falling slowly on the book, faster at the margin', unit: 'Cost of liabilities (%) at quarter-end; incremental cost of new borrowing in Q1FY27', x: ['Dec-25', 'Mar-26', 'Jun-26', 'Incremental (Q1FY27)'], series: [{ name: 'Cost', values: [8.69, 8.59, 8.56, 7.77], fmt: 'n2' }], labels: 'all', min: 7, max: 9, highlight: 'Incremental (Q1FY27)', source: 'Q4FY26 call; Q1FY27 call (Parag Sharma)' },
    ] },
    { exhibit: { type: 'table', title: 'Asset-liability profile, Jun-2026: inflows exceed outflows in every bucket to five years', head: ['Bucket (cumulative)', 'Up to 1 month', 'Up to 2 months', 'Up to 3 months', 'Up to 6 months', 'Up to 1 year', 'Up to 3 years', 'Up to 5 years'], rows: [
      ['Inflows (₹ cr)', ...cI.map(n0)], ['Outflows (₹ cr)', ...cO.map(n0)],
      { hl: true, cells: ['Surplus (% of outflows)', ...cI.map((v, i) => `${n0((v / cO[i] - 1) * 100)}%`)] },
    ], source: 'Q1FY27 investor update p28 (ALM statement). Liquidity coverage ratio 262.5% (Jun-26), 323.2% (Mar-26).' } },
    { callout: '**Why it matters:** NBFCs fail on funding before they fail on credit, as the 2018-19 squeeze after IL&FS showed. Today it holds three months of repayments in cash (₹17,000-18,000 cr by policy, more in Jun-26), its assets mature ahead of its liabilities, and a third of its money comes from sticky retail deposits. AAA ratings and a Japanese bank as a 20% shareholder add a funding backstop few NBFCs have. Funding is now a strength; the question is only how much of the cost advantage it keeps rather than passes on.' },
  ],
};

const mufgRows = [
  ['Shares (crore)', n1(shares26), n1(sharesNow), pc((sharesNow / shares26 - 1) * 100)],
  ['FY27E EPS (₹)', n2(epsEx27), n2(F.eps[0]), pc((F.eps[0] / epsEx27 - 1) * 100)],
  ['Book value per share, Mar-27E (₹)', n1(bvEx27), n1(F.bvps[0]), pc((F.bvps[0] / bvEx27 - 1) * 100)],
  ['FY27E ROE (%)', `${n1(roeEx27)}%`, `${n1(roeTw27)}% (time-weighted)`, `${n1(roeTw27 - roeEx27)}pp`],
  ['Borrowings ÷ equity, Mar-27E (x)', n2((F.borrowings[0] + F.netWorth[0] - bvEx27 * shares26) / (bvEx27 * shares26)), n2(F.debtEquity[0]), ''],
];
const capital = {
  id: 'capital', nav: 'Capital & the MUFG deal', kicker: 'Capital', title: 'MUFG\'s ₹39,618 cr: good for creditors, fair for shareholders, and a drag on ROE for years',
  blocks: [
    { p: `On 19-Dec-2025 the board agreed to sell MUFG Bank 47.11 cr new shares at ₹840.93 each (₹39,618 cr, about USD 4.4 bn) for 20% of the enlarged company. The price was close to the market (weekly close ₹848 on 12-Dec-2025) and 2.4x Mar-26 book; the stock rose ~19% in the next two weeks. Shareholders approved it on 14-Jan-2026 and the shares were allotted on 8-Apr-2026. It is primary capital: every rupee went to the company, which used ₹37,451 cr in Q1 (mostly to repay borrowings) and parked ₹2,167 cr in liquid funds. MUFG has two board seats and, per management, may not buy shares in the market for 24 months; the Shriram group keeps operational control and 20.3%.` },
    { p: `Capital adequacy went from 20.4% (Mar-26) to 34.2% (Jun-26) against a 15% minimum, and leverage from 3.8x to 2.1x. The FY26 annual report sets the path: "immediate deleveraging to ~2.6x and a calibrated increase towards an optimal leverage level of ~4.5x over the medium term (5-6 years)". On the same measure (borrowings ÷ equity) our model reaches only {{F.debtEquity.2|n2}}x by FY29E (from {{fin.debtEquity.11|n2}}x in FY26 and {{F.debtEquity.0|n2}}x in FY27E), because 18% growth with a 20% payout lets profit rebuild equity almost as fast as the book grows. Reaching ~4.5x would take AUM growth well above 20% for years, or much higher dividends; management has signalled neither.` },
    { exhibit: { type: 'table', title: 'What the MUFG issue does to FY27E (our estimates)', head: ['', 'Without the issue', 'With the issue (our base)', 'Change'], rows: mufgRows, source: 'GAM Research. "Without" removes the ₹39,619 cr and the post-tax interest it saves (~8.85% pre-tax on our basis, ~₹2,600 cr a year); everything else unchanged.' } },
    { pair: [
      { type: 'line', title: 'Borrowings ÷ equity: reset to ~2x, far below the ~4.5x target', unit: 'Borrowings incl. deposits ÷ net worth (x), March', x: 'fin.labels', from: 'FY18', to: 'FY29E', series: [{ name: 'Borrowings ÷ equity', ref: 'fin.debtEquity', fmt: 'n2' }], labels: 'all', min: 0, max: 7, lines: [{ v: 4.5, text: 'Company target ~4.5x (5-6 years)' }], source: 'Screener.in; GAM estimates' },
      { type: 'column', title: 'Capital adequacy: from ~20% to 34% overnight', unit: 'CRAR (%), quarter-end', x: C.quarterlyKpis.filter(q => q.crar).map(q => q.q), series: [{ name: 'CRAR', values: C.quarterlyKpis.filter(q => q.crar).map(q => q.crar), fmt: 'pct' }], labels: 'all', min: 0, max: 40, highlight: 'Q1FY27', source: 'Q4FY26 investor update p27; Q1FY27 investor update p25' },
    ] },
    { callout: `**Our view:** the deal was struck at a fair, market price and adds ~${pc((F.bvps[0] / bvEx27 - 1) * 100).replace('+', '')} to FY27E book per share, but EPS is roughly unchanged and ROE falls by ~${n1(roeEx27 - roeTw27)}pp, because the money earns only the interest it saves until it is levered up. A lower ROE deserves a lower P/B, other things equal, which is why we do not simply apply the old multiple to the new, larger book, as the street does. Dividends: we model a 20% payout (DPS ₹{{F.dps.0|n2}} for FY27E vs ₹10.80 for FY26).` },
  ],
};

// ROA tree on average AUM, built from the model
const cols = ['FY24', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'].map(fi);
const r2 = v => (v == null ? '–' : (Math.round(v * 100) / 100).toFixed(2));
const lineOf = (name, fn, hl) => ({ hl, cells: [hl ? `**${name}**` : name, ...cols.map(i => { const v = fn(i); return hl ? `**${r2(v)}**` : r2(v); })] });
const tax = i => (fin.ppopPct[i] - fin.creditCost[i]) * fin.taxRate[i] / 100;
const roaTree = {
  id: 'roatree', nav: 'ROA → ROE tree', kicker: 'Returns', title: 'From ROA to ROE: ~3.5% on AUM levered ~4.5x before MUFG; more ROA but only ~3x leverage after',
  blocks: [
    { p: 'A lender\'s return on equity is its return on assets times leverage. Shriram earns a high return on its loans for a vehicle lender (high yields, controlled costs) but has run with modest leverage, so its ROE has been 16-18%, not the 20%+ of the best consumer lenders. The MUFG money raises ROA (less interest to pay) and cuts leverage by more, so ROE falls.' },
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
    ], source: `Company, Screener.in; GAM estimates. FY24 includes Shriram Housing Finance; FY25 ROE includes the SHFL gain (other income). FY27E leverage and ROE use opening and closing equity; on time-weighted equity FY27E ROE is ~${n1(roeTw27)}% and leverage ~${n1(F.avgAum[0] / avgNwTw27)}x.` } },
    { callout: `**What changes:** ROA on AUM rises from {{fin.roaAum.11|pct}} in FY26 to {{F.roaAum.0|pct}} in FY27E almost entirely because interest expense falls by ~1pp of AUM. Leverage (average AUM ÷ average equity) falls from ~${n1(fin.avgAum[fi('FY26')] / ((fin.netWorth[fi('FY25')] + fin.netWorth[fi('FY26')]) / 2))}x to ~${n1(F.avgAum[0] / avgNwTw27)}x on time-weighted equity, so ROE drops to ~${n1(roeTw27)}%. From there ROA eases as yields fall, and ROE creeps up only as leverage rebuilds: ~14% by FY29E. Getting back to 16-18% needs leverage back near FY26 levels (~4.6x AUM ÷ equity, 3.8x borrowings ÷ equity); management targets ~4.5x borrowings ÷ equity, but only over five to six years.` },
  ],
};

module.exports = { funding, capital, roaTree, ...require('./SHRIRAMFIN.part4b') };
