// M&M Finance report, part 4: funding and liquidity, capital and leverage, the ROA → ROE tree and the
// value-trap question.
const X = require('./M&MFIN.ctx');
const { C, SG, F, A, AS, fin, fi, n0, n1, n2, pc, Q1, AK, shares, price, P, V } = X;
const FD = SG.funding;

const funding = {
  id: 'funding', nav: 'Funding & liquidity', kicker: 'Funding', title: 'Funding: AAA, deposit-taking and well-buffered; an advantage over most NBFCs, not over banks',
  blocks: [
    { p: `MMFSL owed ₹1,25,979 cr at face value in Jun-2026 (standalone). Half was bank and financial-institution loans, a fifth NCDs, 11% public fixed deposits (₹13,719 cr; 88,550+ active depositors in FY26), 9.5% securitisation and assignment, and the rest offshore loans and commercial paper. It is rated AAA by CRISIL, India Ratings and CARE, a notch above Chola (AA+), helped by Mahindra parentage. 44% of borrowings are floating-rate. On our measure the group paid {{fin.costOfFunds.11|pct}} on its borrowings in FY26, down from {{fin.costOfFunds.10|pct}} in FY25 (Chola: ~7.45%).` },
    { pair: [
      { type: 'hbar', title: 'Borrowings by instrument, Jun-2026', unit: '% of ₹1,25,979 cr (face value, standalone)', x: FD.instrument.map(r => r[0]), series: [{ name: 'Share', values: FD.instrument.map(r => r[1]), fmt: 'pct' }], labels: 'all', source: 'Q1FY27 presentation p32' },
      { type: 'hbar', title: 'Borrowings by lender type, Jun-2026', unit: '% of borrowings', x: FD.investor.map(r => r[0]), series: [{ name: 'Share', values: FD.investor.map(r => r[1]), fmt: 'pct' }], labels: 'all', source: 'Q1FY27 presentation p32' },
    ] },
    { pair: [
      { type: 'line', title: 'Cost of funds: down ~50bp in FY26, edging up again', unit: 'Interest expense ÷ average borrowings (%), our measure', x: 'fin.labels', from: 'FY18', to: 'FY29E', series: [{ name: 'Cost of funds', ref: 'fin.costOfFunds', fmt: 'pct' }], labels: 'all', min: 5, max: 10, source: 'Screener.in; GAM estimates' },
      { type: 'column', title: 'Borrowings: ₹1.28 lakh cr, growing faster than equity from here', unit: 'Borrowings incl. deposits at March (₹ \'000 crore)', x: 'fin.labels', from: 'FY18', to: 'FY29E', series: [{ name: 'Borrowings', ref: 'fin.borrowings', scale: 0.001, fmt: 'num' }], labels: 'all', source: 'Screener.in; GAM estimates' },
    ] },
    { callout: `**Why it matters:** NBFCs fail on liquidity before they fail on credit, and M&M Finance learned that in 2018-19, when the IL&FS default froze wholesale funding and its profit fell 42% in FY20. Today it holds ₹${n0(Q1.liquidity)} cr of cash and liquid investments, including ~₹5,000 cr of extra buffer built against the West Asia and monsoon risks, against ₹24,832 cr of borrowings maturing in the six months to Dec-2026, plus undrawn bank lines. The extra buffer has a cost (the CEO tied most of Q1's ~25bp fall in loan income ÷ assets to it; the CFO called it mainly a denominator effect) and management will release it when conditions settle. Funding is a modest edge over AA-rated peers, not over banks.` },
  ],
};

const raises = [['FY18', 'QIP + preferential issue to M&M', 2111], ['FY21', 'Rights issue, 1-for-1 at ₹50', 3089], ['FY26', 'Rights issue, 1-for-8 at ₹194', 2996]];
const sh17 = 113 / 2, eps19 = A.eps[A.labels.indexOf('FY19')], epsG = (Math.pow(A.eps[X.b] / eps19, 1 / 7) - 1) * 100;
const capital = {
  id: 'capital', nav: 'Capital & leverage', kicker: 'Capital', title: 'Capital: plenty today, but three raises in nine years and EPS barely above FY19',
  blocks: [
    { p: `Capital adequacy was ${Q1.crar}% in Jun-2026 (Tier 1 ${Q1.tier1}%) against RBI minimums of 15% and 10%, and debt was 5.0x equity. Management says it will not need capital for "at least 6 to 8 quarters" and is comfortable taking debt ÷ equity to "6-plus". Our model agrees: at 14-15% AUM growth and a 36% payout, AUM ÷ equity rises from {{fin.leverage.11|n2}}x to {{fin.leverage.14|n2}}x by FY29E without new equity.` },
    { p: `The longer record is less comfortable. M&M Finance has raised equity three times since FY18, ₹${n0(raises.reduce((s, r) => s + r[2], 0))} cr in all, and the share count has gone from ~${n0(sh17)} cr (FY17) to ${n1(shares)} cr. Net worth grew 16% a year over FY17-26, but book value per share only ~11% a year, and EPS of ₹${n2(A.eps[X.b])} in FY26 is just ${pc((A.eps[X.b] / eps19 - 1) * 100)} above FY19's ₹${n2(eps19)} (${n1(epsG)}% a year). Shareholders have funded growth that has not yet earned its cost of equity.` },
    { exhibit: { type: 'table', title: 'Equity raised since FY18', head: ['Year', 'How', 'Amount (₹ cr)', 'What it funded'], wide: [3], rows: [
      [raises[0][0], raises[0][1], n0(raises[0][2]), 'Growth after the FY16-17 rural downturn'],
      [raises[1][0], raises[1][1], n0(raises[1][2]), 'Covid and IL&FS-era balance-sheet repair; shares doubled'],
      [raises[2][0], raises[2][1], n0(raises[2][2]), '"Strengthened to scale": new products, systems; cut debt ÷ equity from 5.7x to 4.9x'],
    ], source: 'Q1FY27 presentation p43; AR FY26 note 39' } },
    { pair: [
      { type: 'line', title: 'Leverage rises again in our forecast', unit: 'Group AUM ÷ net worth (x)', x: 'fin.labels', from: 'FY18', to: 'FY29E', series: [{ name: 'AUM ÷ equity', ref: 'fin.leverage', fmt: 'n2' }], labels: 'all', min: 3, max: 8, source: 'Company, Screener.in; GAM estimates' },
      { type: 'column', title: 'Tier 1 capital: well above the 10% minimum', unit: 'Tier 1 capital ratio (%), March; Q1FY27 = Jun-2026 (standalone)', x: [...AK.map(k => k.fy), 'Q1FY27'], series: [{ name: 'Tier 1', values: [...AK.map(k => k.tier1), Q1.tier1], fmt: 'n1' }], labels: 'all', min: 0, max: 30, lines: [{ v: 10, text: 'RBI minimum 10%' }], source: 'Company presentations (Q4FY21-Q1FY27)' },
    ] },
    { callout: '**Our view:** capital is not a constraint in FY27-28, and the 36% payout (₹7.50 a share for FY26) is generous for a lender that needs capital to grow. The two are in tension: if M&M Finance really grows 16-18% a year to FY31, it will either cut the payout or raise equity again around FY30. Neither is a problem if ROE is above the cost of equity; at ~12-13% ROE, both destroy a little value.' },
  ],
};

// ROA tree on average AUM, built from the model
const cols = ['FY24', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'].map(fi);
const r2 = v => (v == null ? '–' : (Math.round(v * 100) / 100).toFixed(2));
const lineOf = (name, fn, hl) => ({ hl, cells: [hl ? `**${name}**` : name, ...cols.map(i => { const v = fn(i); return hl ? `**${r2(v)}**` : r2(v); })] });
const oi = i => fin.otherIncome[i] / fin.avgAum[i] * 100;
const tax = i => (fin.ppopPct[i] - fin.creditCost[i] + oi(i)) * fin.taxRate[i] / 100;
// What it takes to reach ~15% ROE (FY28E, at our leverage)
const t = AS.taxRate[1] / 100, lev = F.roe[1] / F.roaAum[1];
const cc13 = 1.3 * F.totalAssets.map((x, i) => x / F.aum[i])[1]; // 1.3% of assets ≈ % of AUM
const dCc = (F.creditCost[1] - cc13) * (1 - t) * lev, dFee = (AS.feeIncomePct[0] - AS.feeIncomePct[1]) * (1 - t) * lev, dOpex = 0.2 * (1 - t) * lev;
const roaTree = {
  id: 'roatree', nav: 'ROA → ROE: value trap?', kicker: 'Returns', title: 'Can M&M Finance fix its returns? Better, yes; 15% ROE needs everything to go right',
  blocks: [
    { p: 'A lender\'s return on equity is its return on assets times leverage. M&M Finance earns less per rupee of loans than the best vehicle lenders because its yields have been competed down, its costs of serving rural borrowers are high, and its credit cost is volatile; and it runs less leverage (~5-6x AUM to equity) than Chola (~7.5x). The tree shows FY26\'s recovery and our forecast.' },
    { exhibit: { type: 'table', title: 'ROA tree, % of average group AUM', head: ['', 'FY24', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      lineOf('Interest income (yield)', i => fin.yieldOnAum[i]),
      lineOf('− Interest expense', i => fin.yieldOnAum[i] - fin.nim[i]),
      lineOf('= Net interest margin', i => fin.nim[i], true),
      lineOf('+ Fees and other operating income', i => fin.feePct[i]),
      lineOf('− Operating expenses (incl. broker payouts)', i => fin.opexPct[i]),
      lineOf('= Pre-provision profit', i => fin.ppopPct[i], true),
      lineOf('− Loan losses (credit cost)', i => fin.creditCost[i]),
      lineOf('+ Other income, associates, exceptional', oi),
      lineOf('− Tax', tax),
      lineOf('= ROA on AUM', i => fin.roaAum[i], true),
      lineOf('× Average AUM ÷ average equity (x)', i => fin.roe[i] / fin.roaAum[i]),
      lineOf('= ROE (%)', i => fin.roe[i], true),
    ], source: 'Company, Screener.in; GAM estimates. ROA on AUM is above the company\'s ROA on assets (2.0% in FY26) because assets include ~11% of cash and investments.' } },
    { exhibit: { type: 'table', title: 'What it would take to reach ~15% ROE in FY28E', head: ['Step', 'Change vs our base', 'ROE (pp)'], wide: [1], rows: [
      ['Our base FY28E ROE', `Credit cost {{F.creditCost.1|n2}}% of AUM, fees {{F.feePct.1|pct}}, opex {{F.opexPct.1|pct}}`, `${n1(F.roe[1])}%`],
      ['Credit cost at the bottom of guidance (1.3% of assets)', `≈${n2(cc13)}% of AUM instead of {{F.creditCost.1|n2}}%`, `+${n1(dCc)}`],
      ['IRDAI caps do not bite', 'Fees stay at the FY27E level', `+${n1(dFee)}`],
      ['Opex 20bp lower (digital productivity)', 'Opex ÷ AUM −0.20pp', `+${n1(dOpex)}`],
      { hl: true, cells: ['**ROE if all three happen**', '', `**${n1(F.roe[1] + dCc + dFee + dOpex)}%**`] },
    ], source: 'GAM arithmetic at our FY28E leverage and tax rate' } },
    { callout: `**Value trap or not?** A value trap looks cheap and stays cheap because returns never improve. M&M Finance is not cheap on fundamentals: at a ${n1(V.ke)}% cost of equity and ~13% ROE, it is worth ~1.1x book (our justified P/B), and it trades at ${n2(price / A.bvps[X.b])}x FY26 book. Returns have improved (ROA 2.0% in FY26 vs 1.7% in FY24; 2.4% in Q1FY27) and the transformation is real. But getting from ~13% to the ~15% the most bullish brokers model (Emkay 14.9% FY28E, 15.6% FY29E) needs credit cost at the bottom of the range, no IRDAI damage and further cost cuts, all at once, in a drought year. Our answer: not a trap at this price, but no bargain either; the stock already pays for a good part of the turnaround.` },
  ],
};

module.exports = { funding, capital, roaTree, ...require('./M&MFIN.part4b') };
