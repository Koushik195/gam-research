// L&T Finance report, part 4: funding and liquidity, capital and leverage, the ROA → ROE tree.
const X = require('./LTF.ctx');
const { C, F, A, AS, fin, fi, n0, n1, n2, pc, Q1, shares, price, P } = X;
const FD = C.funding;

const funding = {
  id: 'funding', nav: 'Funding & liquidity', kicker: 'Funding', title: 'Funding: AAA thanks to L&T, well matched, but wholesale money with no deposits',
  blocks: [
    { p: `LTF borrowed ₹${n0(Q1.borrowings)} cr in Jun-2026 (₹${n0(FD.borrowingsJun25)} cr a year earlier) from banks (priority-sector and other term loans), private and retail debentures, commercial paper and foreign borrowings (ECB). It takes no public deposits. All four domestic agencies rate it AAA, which the company attributes to its business mix and to "strategic importance and strong support from L&T"; S&P (BBB) and Fitch (BBB-) rate it at India's sovereign level, which opens the door to foreign borrowing the CFO says he is not using yet. Its weighted average cost of borrowing was 7.35% in FY26 and 7.20% in Q1FY27, and it expects 7.35-7.40% for FY27 assuming one or two rate rises. Priority-sector bank loans (available because most rural loans qualify) keep it cheaper than AA-rated peers.` },
    { exhibit: { type: 'table', title: 'Asset-liability profile, Jun-2026: positive cumulative gaps in every bucket to one year', head: ['Bucket', '1-7 days', '8-14 days', '14 days-1 month', '1-2 months', '2-3 months', '3-6 months', '6-12 months'], rows: [
      ['Cumulative inflows (₹ cr)', '13,817', '15,454', '19,916', '26,954', '34,480', '52,647', '86,056'],
      ['Cumulative outflows (₹ cr)', '2,161', '3,351', '5,552', '8,845', '13,604', '22,734', '43,683'],
      ['Cumulative surplus (₹ cr)', '11,656', '12,102', '14,364', '18,109', '20,877', '29,914', '42,373'],
      { hl: true, cells: ['Surplus (% of outflows)', '539%', '361%', '259%', '205%', '153%', '132%', '97%'] },
    ], source: 'Q1FY27 presentation p40 (structural liquidity statement; inflows − outflows reconcile to the printed gaps). One-year repricing gap +₹7,931 cr (assets ₹84,799 cr vs liabilities ₹76,868 cr).' } },
    { pair: [
      { type: 'line', title: 'Cost of funds: down ~45bp in FY26, now drifting up', unit: 'Interest expense ÷ average borrowings (%), our measure', x: 'fin.labels', from: 'FY18', to: 'FY29E', series: [{ name: 'Cost of funds', ref: 'fin.costOfFunds', fmt: 'pct' }], labels: 'all', min: 5, max: 9, source: 'Screener.in; GAM estimates' },
      { type: 'column', title: 'Borrowings: flat for five years, now +20% a year', unit: 'Borrowings at March (₹ \'000 crore)', x: 'fin.labels', from: 'FY19', to: 'FY29E', series: [{ name: 'Borrowings', ref: 'fin.borrowings', scale: 0.001, fmt: 'num' }], labels: 'all', source: 'Screener.in; GAM estimates' },
    ] },
    { callout: '**Why it matters:** NBFCs fail on liquidity before they fail on credit, and LTF came through the 2018-19 IL&FS shock and Covid without a funding crisis, helped by its parent. Today it holds ~₹9,000 cr of surplus liquidity as a norm (₹13,000 cr+ in total) and has positive gaps in every bucket. The L&T name is the closest thing LTF has to a funding advantage, but it is a rating, not a deposit base: in a rate-hiking cycle LTF reprices faster than a bank.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capital & leverage', kicker: 'Capital', title: 'Capital: plenty today (Tier 1 17%), being used up by 25% growth',
  blocks: [
    { p: `Capital adequacy was ${Q1.crar}% in Jun-2026 (Tier 1 ${Q1.tier1}%) against RBI minimums of 15% and 10%. It was 22.8% in FY24 and 22.3% in FY25: the four years of shrinkage left LTF over-capitalised, which is one reason its ROE was so low. Growth is now using that capital up: debt/equity rose from 3.61x (Mar-25) to 4.09x (Jun-26) and Tier 1 fell ~3.6pp in five quarters. With a 23% payout, equity grows ~10% a year from profit against 20-24% book growth, so our model takes AUM from {{fin.leverage.11|n2}}x equity in FY26 to {{fin.leverage.14|n2}}x in FY29E. The last equity raise was the ~₹3,000 cr rights issue of FY21; we assume none in our forecast.` },
    { pair: [
      { type: 'line', title: 'Leverage rising from a low base', unit: 'Book ÷ net worth (x)', x: 'fin.labels', from: 'FY19', to: 'FY29E', series: [{ name: 'Book ÷ equity', ref: 'fin.leverage', fmt: 'n2' }], labels: 'all', min: 2, max: 8, source: 'Company, Screener.in; GAM estimates' },
      { type: 'column', title: 'Tier 1 capital: 21% to 17% in two years', unit: 'Tier 1 capital ratio (%), March; Q1FY27 = Jun-2026', x: ['FY24', 'FY25', 'FY26', 'Q1FY27'], series: [{ name: 'Tier 1', values: [...C.annualKpis.filter(k => k.tier1).map(k => k.tier1), Q1.tier1], fmt: 'n1' }], labels: 'all', min: 0, max: 25, lines: [{ v: 10, text: 'RBI minimum 10%' }], source: 'Company presentations' },
    ] },
    { callout: '**Our view:** capital is not a constraint before FY29 at our growth rates, and leverage of ~5.5x by FY29E is still below Cholamandalam (~7x) or Shriram. But part of the ROE improvement LTF promises (16-18% by FY31) is simply leverage: more debt on the same equity. That raises returns in good years and losses in bad ones. If growth ran at 25%+ for long, LTF would need equity around FY30, or a lower payout.' },
  ],
};

// ROA tree on average book, built from the model
const cols = ['FY24', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'].map(fi);
const r2 = v => (v == null ? '–' : (Math.round(v * 100) / 100).toFixed(2));
const lineOf = (name, fn, hl) => ({ hl, cells: [hl ? `**${name}**` : name, ...cols.map(i => { const v = fn(i); return hl ? `**${r2(v)}**` : r2(v); })] });
const oi = i => fin.otherIncome[i] / fin.avgAum[i] * 100;
const tax = i => (fin.ppopPct[i] - fin.creditCost[i] + oi(i)) * fin.taxRate[i] / 100;
const roaTree = {
  id: 'roatree', nav: 'ROA → ROE tree', kicker: 'Returns', title: 'From ROA to ROE: ~2.8% on the book, levered only ~4x, gives ~11-15%',
  blocks: [
    { p: 'A lender\'s return on equity is its return on assets times leverage. LTF earns a respectable return on its book (~2.7-2.9% after tax on our basis, similar to Cholamandalam\'s) but runs only ~4-5x leverage, against ~7.5x at Cholamandalam; so its ROE is 11-15%, not ~20%. The tree shows where FY27-29E returns come from: lower credit cost and more leverage, partly offset by the IRDAI fee haircut.' },
    { exhibit: { type: 'table', title: 'ROA tree, % of average book', head: ['', 'FY24', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      lineOf('Interest income (yield)', i => fin.yieldOnAum[i]),
      lineOf('− Interest expense', i => fin.yieldOnAum[i] - fin.nim[i]),
      lineOf('= Net interest margin', i => fin.nim[i], true),
      lineOf('+ Fees and other operating income', i => fin.feePct[i]),
      lineOf('− Operating expenses', i => fin.opexPct[i]),
      lineOf('= Pre-provision profit', i => fin.ppopPct[i], true),
      lineOf('− Credit losses', i => fin.creditCost[i]),
      lineOf('+ Other income', oi),
      lineOf('− Tax', tax),
      lineOf('= ROA on book', i => fin.roaAum[i], true),
      lineOf('× Average book ÷ average equity (x)', i => fin.roe[i] / fin.roaAum[i]),
      lineOf('= ROE (%)', i => fin.roe[i], true),
    ], source: 'Annual reports, Screener.in; GAM estimates. ROA on the book is above the company\'s ROA on total assets (2.37% in FY26) because total assets include ~₹18,500 cr of cash, investments and SRs. FY24 other income (₹474 cr) included insurance income later shown in fees.' } },
    { callout: '**What changes:** FY27E ROA on the book rises to {{F.roaAum.0|pct}} as credit cost falls ~10bp and leverage rises; FY28E slips to {{F.roaAum.1|pct}} because our IRDAI haircut takes ~30bp off fees (~22bp after tax), then recovers to {{F.roaAum.2|pct}}. ROE climbs from {{fin.roe.11|pct}} to {{F.roe.2|pct}}, more from leverage than from margins. Management targets an ROA (on assets) of at least 2.8% by Q4FY27; our full-year ROA on assets is {{F.roa.0|pct}} in FY27E and {{F.roa.1|pct}} in FY28E. The gap is our credit-cost caution and the fee haircut.' },
  ],
};

module.exports = { funding, capital, roaTree, ...require('./LTF.part4b') };
