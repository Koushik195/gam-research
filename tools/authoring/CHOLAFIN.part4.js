// Cholamandalam report, part 4: funding and liquidity, capital and leverage, the ROA → ROE tree.
const X = require('./CHOLAFIN.ctx');
const { C, F, A, AS, fin, fi, n0, n1, n2, pc, Q1, shares, sharesNow, price, P } = X;

const funding = {
  id: 'funding', nav: 'Funding & liquidity', kicker: 'Funding', title: 'Funding: diversified and liquid, but AA+, wholesale and more expensive than a bank',
  blocks: [
    { p: `Chola borrowed ₹2,20,247 cr in Jun-2026 (standalone). About half comes from banks (much of it priority-sector lending, where Chola has bargaining power), the rest from bonds and debentures (private and public), commercial paper, securitisation, foreign borrowings and subordinated Tier II debt. It takes no public deposits. It is rated AA+ by ICRA (outlook positive), CARE and India Ratings, one notch below the AAA of Bajaj Finance and bank-owned NBFCs; the CFO said peers got AAA "by leveraging explicit parental support", which the Murugappa group does not provide for Chola's funding. On our measure Chola paid {{fin.costOfFunds.11|pct}} on its borrowings in FY26, against ~7.3% for Bajaj Finance.` },
    { exhibit: { type: 'table', title: 'Asset-liability profile, Jun-2026: positive cumulative gaps in every bucket', head: ['Bucket', 'Up to 1 month', 'Up to 2 months', 'Up to 3 months', 'Up to 6 months', 'Up to 1 year', 'Up to 3 years', 'Up to 5 years'], rows: [
      ['Cumulative inflows (₹ cr)', '13,099', '22,209', '33,274', '55,955', '95,140', '1,91,257', '2,31,449'],
      ['Cumulative outflows (₹ cr)', '10,947', '18,105', '29,039', '46,647', '85,639', '1,88,592', '2,15,316'],
      { hl: true, cells: ['Cumulative surplus (% of outflows)', '19.7%', '22.7%', '14.6%', '20.0%', '11.1%', '1.4%', '7.5%'] },
    ], source: 'Q1FY27 presentation p77 (Ind AS ALM, standalone). Liquidity ₹23,984 cr incl. undrawn lines; cash ₹22,765 cr incl. ₹7,615 cr of high-quality liquid assets; average LCR 194% vs 100% required (p78, p85).' } },
    { pair: [
      { type: 'line', title: 'Cost of funds: down ~60bp in FY26, now flat to rising', unit: 'Interest expense ÷ average borrowings (%), our measure', x: 'fin.labels', from: 'FY18', to: 'FY29E', series: [{ name: 'Cost of funds', ref: 'fin.costOfFunds', fmt: 'pct' }], labels: 'all', min: 5, max: 9.5, source: 'Screener.in; GAM estimates' },
      { type: 'column', title: 'Borrowings have tripled in four years', unit: 'Borrowings at March (₹ \'000 crore)', x: 'fin.labels', from: 'FY20', to: 'FY29E', series: [{ name: 'Borrowings', ref: 'fin.borrowings', scale: 0.001, fmt: 'num' }], labels: 'all', source: 'Screener.in; GAM estimates' },
    ] },
    { callout: '**Why it matters:** NBFCs fail on liquidity before they fail on credit (IL&FS and DHFL in 2018-19). Chola passed that test in 2018-20 and holds ample liquidity today, with no cumulative mismatch in any bucket. But the 1-3 year bucket is thin (1.4%), and in a rate-hiking cycle Chola reprices faster than a deposit-funded bank: ~25-30% of its bank loans are linked to 1-3 month MCLR. Funding is a sound, unremarkable business for Chola, not a source of advantage.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capital & leverage', kicker: 'Capital', title: 'Capital: self-funding at ~20% growth, with the CCDs now fully converted',
  blocks: [
    { p: `Capital adequacy was ${Q1.crar}% in Jun-2026 (Tier 1 ${Q1.tier1}%) against RBI minimums of 15% and 10%. Management's rule is explicit: it will consider raising equity "if our Tier 1 ratio were to approach 13%", and it expects to fund growth internally as long as pre-tax ROTA is ~3.5% and growth stays below 23-25%. Chola retains ~97% of profit (dividend ₹2 a share since FY21), so equity grows ~20% a year from profit alone, roughly matching AUM growth. Our model keeps business AUM at {{fin.leverage.12|n2}}-{{fin.leverage.14|n2}}x equity in FY27-29E, close to {{fin.leverage.11|n2}}x in FY26.` },
    { p: `The last capital raise was the Oct-2023 composite QIP: ₹2,000 cr of shares and ₹2,000 cr of 7.5% compulsorily convertible debentures (CCDs). The CCDs converted at 15-16.5% discounts to the market price: ₹1,370 cr in FY26 (at ₹1,369-1,393), ₹200 cr in Jul-2026 (₹1,476) and the last ₹430 cr on 30-Sep-2026 (₹1,407.59). The share count rose from ${n1(shares)} cr in March to ${n2(sharesNow)} cr on 30-Sep-2026; we include the ₹630 cr conversion in FY27E equity. Converting at a discount to a price of ~4.6x book still added to book value per share.` },
    { pair: [
      { type: 'line', title: 'Leverage steady: AUM ~7.3x equity', unit: 'Business AUM ÷ net worth (x)', x: 'fin.labels', from: 'FY18', to: 'FY29E', series: [{ name: 'AUM ÷ equity', ref: 'fin.leverage', fmt: 'n2' }], labels: 'all', min: 5, max: 10, source: 'Company, Screener.in; GAM estimates (incl. CCD conversion)' },
      { type: 'column', title: 'Tier 1 capital: 13-17% since FY18', unit: 'Tier 1 capital ratio (%), March; Q1FY27 = Jun-2026', x: [...C.annualKpis.map(k => k.fy), 'Q1FY27'], series: [{ name: 'Tier 1', values: [...C.annualKpis.map(k => k.tier1), Q1.tier1], fmt: 'n1' }], labels: 'all', min: 0, max: 20, lines: [{ v: 13, text: 'Raise trigger ~13%' }], source: 'Q1FY27 presentation p10, p78; Q4FY26 call' },
    ] },
    { callout: '**Our view:** capital is not a constraint at our forecast growth, which is a real difference from Bajaj Finance. The trade-off is the dividend: at ~3% of profit it is among the lowest of any large Indian financial. Shareholders are paid in book growth, which only works while ROE stays well above the cost of equity. If growth ran at the 24% of our bull case for long, Tier 1 would drift toward 13% and Chola would raise equity, as it did in FY20 and FY24.' },
  ],
};

// ROA tree on average AUM, built from the model
const cols = ['FY24', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'].map(fi);
const r2 = v => (v == null ? '–' : (Math.round(v * 100) / 100).toFixed(2));
const lineOf = (name, fn, hl) => ({ hl, cells: [hl ? `**${name}**` : name, ...cols.map(i => { const v = fn(i); return hl ? `**${r2(v)}**` : r2(v); })] });
const oi = i => fin.otherIncome[i] / fin.avgAum[i] * 100;
const tax = i => (fin.ppopPct[i] - fin.creditCost[i] + oi(i)) * fin.taxRate[i] / 100;
const roaTree = {
  id: 'roatree', nav: 'ROA → ROE tree', kicker: 'Returns', title: 'From ROA to ROE: ~2.6% on loans, levered ~7.5x, gives ~20%',
  blocks: [
    { p: 'A lender\'s return on equity is its return on assets times leverage. Chola earns less per rupee of loans than Bajaj Finance (yields ~14% vs ~15.5%, and a higher funding cost) but runs ~7.5x leverage on secured loans, against ~4.5x for Bajaj, so both end up near 20%. The tree shows FY26\'s drag from credit cost and the FY27E recovery.' },
    { exhibit: { type: 'table', title: 'ROA tree, % of average business AUM', head: ['', 'FY24', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      lineOf('Interest income (yield)', i => fin.yieldOnAum[i]),
      lineOf('− Interest expense', i => fin.yieldOnAum[i] - fin.nim[i]),
      lineOf('= Net interest margin', i => fin.nim[i], true),
      lineOf('+ Fees and other operating income', i => fin.feePct[i]),
      lineOf('− Operating expenses', i => fin.opexPct[i]),
      lineOf('= Pre-provision profit', i => fin.ppopPct[i], true),
      lineOf('− Loan losses (credit cost)', i => fin.creditCost[i]),
      lineOf('+ Other income (mostly recoveries)', oi),
      lineOf('− Tax', tax),
      lineOf('= ROA on AUM', i => fin.roaAum[i], true),
      lineOf('× Average AUM ÷ average equity (x)', i => fin.roe[i] / fin.roaAum[i]),
      lineOf('= ROE (%)', i => fin.roe[i], true),
    ], source: 'Company, Screener.in; GAM estimates. ROA on AUM is close to the company\'s ROA (PAT) on assets of 2.4-2.5%; the company\'s pre-tax ROTA was 3.3% in FY26 and 3.7% in Q1FY27.' } },
    { callout: '**What changes:** FY27E ROA on AUM rises to {{F.roaAum.0|pct}} because credit cost falls ~23bp and NIM rises ~12bp. From FY28E the IRDAI haircut takes ~15bp off fee income, so ROA slips to {{F.roaAum.1|pct}} and ROE to {{F.roe.1|pct}} before recovering slightly. Management\'s 3.5% pre-tax ROTA target is in reach in FY27E; holding it beyond depends on fees and on vehicle losses, two lines we are more cautious on than the company.' },
  ],
};

module.exports = { funding, capital, roaTree, ...require('./CHOLAFIN.part4b') };
