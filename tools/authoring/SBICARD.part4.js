// SBI Cards report, part 4: funding and liquidity, capital and leverage, the ROA → ROE tree.
const X = require('./SBICARD.ctx');
const { C, F, A, AS, fin, fi, n0, n1, n2, pc, Q1, K26 } = X;
const FD = C.funding;

const funding = {
  id: 'funding', nav: 'Funding & liquidity', kicker: 'Funding', title: 'Funding: AAA-rated and backed by its parent, but priced like a non-bank',
  blocks: [
    { p: `SBI Card cannot take deposits, so it borrows: ₹${n0(K26.borrowings)} cr at Mar-2026 and ₹${n0(Q1.borrowings)} cr at Jun-2026, from bank lines (working-capital loans and term loans), commercial paper and bonds, including subordinated debt that counts as capital. It is rated AAA/Stable (long term) and A1+ (short term) by CRISIL and ICRA. The parent matters here too: State Bank of India had lent it ₹${n0(FD.sbiBorrowings)} cr at Mar-2026, 45% of all borrowings, and earned ₹${n0(FD.sbiFinanceCharges)} cr of its ₹${n0(K26.financeCost)} cr finance cost in FY26 (related-party note, "at arm's length"). Card receivables are short (most are repaid within a month or two, EMIs within about a year), so funding is mostly short term too; the company reports positive cumulative asset-liability gaps in every bucket.` },
    { pair: [
      { type: 'column', title: 'Cost of funds: 7.5% to 6.5% (our basis)', unit: 'Finance cost ÷ average year-end borrowings (%)', x: 'fin.labels', from: 'FY20', to: 'FY29E', series: [{ name: 'Cost of funds', ref: 'fin.costOfFunds', fmt: 'pct' }], labels: 'all', min: 0, max: 9, source: 'Screener.in; GAM estimates (company basis: 7.4% FY25, 6.7% FY26, 6.5% Q1FY27)' },
      { type: 'hbar', title: 'Where the FY26 finance cost went', unit: 'Finance cost by instrument, FY26 (₹ crore)', x: ['Bank borrowings, CP and other loans', 'Subordinated debt', 'Bonds (debt securities)', 'Lease liabilities'], series: [{ name: 'Finance cost', values: [2510, 284, 261, 17], fmt: 'num' }], labels: 'all', source: 'Annual report FY26, note 27' },
    ] },
    { callout: '**Why it matters:** with SBI behind it, SBI Card has never had a funding scare, and its cost of funds (6.5%) is low for a non-bank. But it has no low-cost current and savings deposits, so bank issuers fund the same card balances more cheaply. Its funding cost also reprices fast with market rates; management expects it to drift up, and we add 10-20bp in FY27-28E.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capital & leverage', kicker: 'Capital', title: 'Capital: 25.6% against a 15% minimum; the problem is too much equity, not too little',
  blocks: [
    { p: `Capital adequacy was ${Q1.car}% in Jun-2026 (Tier 1 ${Q1.tier1}%) against RBI minimums of 15% and 10%. It fell to 20.5% at Mar-2024 after the RBI raised the risk weight on card receivables from 100% to 125% in Nov-2023 (the company estimated a ~4pp hit), and has rebuilt as profit was retained and the book stopped growing. Assets were 4.2x equity at Mar-2026 against 4.8x at Mar-2024. Asked why it paid a dividend in a weak year, the MD said: "We are underleveraged actually."` },
    { p: `Two things could free more capital. (1) The RBI's credit-risk rules for banks cut the weight on transactor balances (customers who pay in full) from 125% to 100% from 1-Apr-2027; if the NBFC rules follow, ~40% of SBI Card's receivables would carry less capital (a press estimate put the release at ~450bp of capital ratio). We found no final NBFC version by 30-Sep-2026. (2) A higher payout: the company paid ₹2.50 a share for FY26 (11% of EPS). Our base case keeps a 12% payout, so equity compounds at ~15-16% against receivables growth of 8-13% and leverage keeps falling to {{fin.assetsToEquity.14|n2}}x assets to equity by FY29E. That alone holds ROE near 17%.` },
    { pair: [
      { type: 'column', title: 'Capital ratio rebuilt after the 2023 risk-weight hit', unit: 'Capital adequacy ratio, March (%)', x: ['FY22', 'FY23', 'FY24', 'FY25', 'FY26', 'Jun-26'], series: [{ name: 'CAR', values: [23.8, 23.1, 20.5, 22.9, 25.5, 25.6], fmt: 'n1' }], labels: 'all', highlight: 'Jun-26', min: 0, max: 30, source: 'Annual report FY26 p24; Q1FY27 presentation p17' },
      { type: 'line', title: 'Leverage falls in our model unless payout rises', unit: 'Total assets ÷ net worth (x)', x: 'fin.labels', from: 'FY18', to: 'FY29E', series: [{ name: 'Assets ÷ equity', ref: 'fin.assetsToEquity', fmt: 'n2' }], labels: 'all', min: 2, max: 7, source: 'Screener.in; GAM estimates' },
    ] },
    { callout: `**Our view:** SBI Card does not need equity for years; it needs growth or a higher payout. At a 12% payout and ~17% ROE, equity grows ~15% a year. If receivables grow less than that, capital piles up and ROE drifts down. A higher payout would hold ROE up, but SBI, as the 69% owner, has given no sign of asking for one. DPS: ₹{{F.dps.0|n2}} / ₹{{F.dps.1|n2}} / ₹{{F.dps.2|n2}} in FY27-29E.` },
  ],
};

// ROA tree on average receivables, built from the model
const cols = ['FY23', 'FY24', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'].map(fi);
const r2 = v => (v == null ? '–' : (Math.round(v * 100) / 100).toFixed(2));
const lineOf = (name, fn, hl) => ({ hl, cells: [hl ? `**${name}**` : name, ...cols.map(i => { const v = fn(i); return hl ? `**${r2(v)}**` : r2(v); })] });
const oiPct = i => fin.otherIncome[i] / fin.avgAum[i] * 100;
const tax = i => (fin.ppopPct[i] - fin.creditCost[i] + oiPct(i)) * fin.taxRate[i] / 100;
const roaTree = {
  id: 'roatree', nav: 'ROA → ROE tree', kicker: 'Returns', title: 'From ROA to ROE: ~5% on receivables, levered ~3.3x, gives ~17%',
  blocks: [
    { p: 'A lender\'s return on equity is its return on assets times leverage. A card issuer\'s tree looks unlike any other lender\'s: huge income lines (interest plus fees ~35% of receivables), huge costs (operating cost ~17-18%, credit cost 6-9%), and a thin result that swings with credit cost. Because SBI Card runs low leverage (receivables ~3.6x equity), it needs a ~5% return on receivables to earn 17%.' },
    { exhibit: { type: 'table', title: 'ROA tree, % of average receivables', head: ['', 'FY23', 'FY24', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      lineOf('Interest income (yield)', i => fin.yieldOnAum[i]),
      lineOf('− Interest expense', i => fin.yieldOnAum[i] - fin.nim[i]),
      lineOf('= Net interest margin', i => fin.nim[i], true),
      lineOf('+ Fees and other operating income', i => fin.feePct[i]),
      lineOf('− Operating expenses', i => fin.opexPct[i]),
      lineOf('= Pre-provision profit', i => fin.ppopPct[i], true),
      lineOf('− Gross credit cost', i => fin.creditCost[i]),
      lineOf('+ Other income (recoveries)', oiPct),
      lineOf('− Tax', tax),
      lineOf('= Return on average receivables', i => fin.roaAum[i], true),
      lineOf('× Average receivables ÷ average equity (x)', i => fin.roe[i] / fin.roaAum[i]),
      lineOf('= ROE (%)', i => fin.roe[i], true),
    ], source: 'Annual reports, Screener.in; GAM estimates. ROA on total assets (the company\'s measure) is lower: 3.2% FY26, 3.9% Q1FY27.' } },
    { callout: `**What changes:** FY27E return on receivables recovers to {{F.roaAum.0|pct}} because credit cost falls ~2pp while pre-provision profit slips. After that, operating leverage helps a little (opex falls from {{F.opexPct.0|pct}} to {{F.opexPct.2|pct}} of receivables) but leverage keeps falling, so ROE peaks at {{F.roe.1|pct}} in FY28E. Management's medium-term ROA target of 4-4.5% (on total assets) is in line with our FY28-29E ({{F.roa.1|pct}}, {{F.roa.2|pct}}, the top of the range); it is not consistent with a return to the 22-26% ROEs of FY22-FY24 without much more leverage.` },
  ],
};

module.exports = { funding, capital, roaTree, ...require('./SBICARD.part4b') };
