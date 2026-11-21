// Muthoot Finance report, part 4: subsidiaries and minorities, funding and liquidity, capital and leverage,
// the ROA → ROE tree. Moat, Q1FY27/guidance and earnings quality are in part4b.
const X = require('./MUTHOOTFIN.ctx');
const { C, F, A, AS, fin, fi, n0, n1, n2, pc, Q1, price, pbMult, shares } = X;
const SUB = C.subsidiaries, FU = C.funding.jun26;
// Attributable book of the subsidiaries (Jun-26, ₹ cr): Money, Homefin, insurance broking, AMC at 100%; Belstar 66.13%; AAF 72.92%
const subBook = 2529 + 765 + 283 + 138 + 1861 * 0.6613 + 146 * 0.7292, subPerShare = subBook / shares;
const subGap = (pbMult - 1) * subPerShare;

const subsidiaries = {
  id: 'subsidiaries', nav: 'Subsidiaries & minorities', kicker: 'Beyond the parent', title: 'Subsidiaries: one fast-growing gold lender, one recovering microfinance lender, and three small bets',
  blocks: [
    { p: `The subsidiaries are 12% of group AUM and earned ~₹274 cr of the group's ₹2,825 cr profit in Q1FY27. **Muthoot Money** (100%) is the one that matters now: it pivoted from vehicle finance to gold loans in other regions and grew its book 111% to ₹10,550 cr, earning ₹172 cr in Q1 (₹338 cr in FY26 vs ₹12 cr in FY25). The parent put ₹1,000 cr of equity into it in FY26 and lends it ₹3,890 cr. **Belstar Microfinance** (66.13%) lends to women's self-help groups; after losing ₹128 cr in Q1FY26 in the industry-wide microfinance downturn it made ₹66 cr in Q1FY27, and it is opening ~200 gold-loan branches to dilute its unsecured risk. **Muthoot Homefin** (100%, affordable housing) earns a 2-7% ROE on a ₹3,496 cr book; **Asia Asset Finance** (Sri Lanka, 72.92%) and the insurance broker are small.` },
    { exhibit: { type: 'table', title: 'Group profit by entity (₹ crore)', head: ['Entity', 'Stake', 'PAT FY26', 'PAT Q1FY27', 'Net worth Jun-26', 'Comment'], wide: [5], rows: [
      ...SUB.rows.map(r => [r[0], r[1], n0(r[5]), n0(r[6]), n0(r[7]), { 'Muthoot Finance (standalone)': 'Gold loans 95%; ROE 26.6% (Q1)', 'Muthoot Money': 'Gold book +111% YoY; Stage 3 0.67%', 'Belstar Microfinance': 'Q1FY26 loss ₹128 cr; Stage 3 2.85%', 'Muthoot Homefin': 'ROE 7.3% (FY26), 2.2% (Q1)', 'Asia Asset Finance (Sri Lanka, listed)': 'LKR 1,038 Mn PAT in FY26', 'Muthoot Insurance Brokers': 'Premium ₹456 cr in FY26' }[r[0]] || '']),
      { hl: true, cells: ['**Consolidated (after minorities and eliminations)**', '', '**10,590**', '**2,799**', '**40,602**', 'Minority interest ₹17 cr FY26, ₹26 cr Q1FY27'] },
    ], source: 'Q1FY27 presentation p20, p44-54; Q4FY26 presentation; Screener.in ("Profit for EPS")' } },
    { p: `**Minorities are small but no longer zero.** Outside shareholders own 33.87% of Belstar and 27.08% of Asia Asset Finance: their share of profit was ₹143 cr in FY24 (Belstar's best year), ₹17-19 cr in FY25-26 and ₹26 cr in Q1FY27. We model 0.9% of group profit. **How we value them:** the street mostly applies one P/B to consolidated book. The subsidiaries' attributable book was ~₹${n0(subBook)} cr in Jun-2026 (₹${n0(subPerShare)} a share). Valuing them at 1x book instead of our ${pbMult}x group multiple would cut ~₹${n0(subGap)} a share (${Math.round(subGap / X.V.tp * 100)}% of our target). We do not make that cut because Muthoot Money (a gold lender earning ~28% annualised ROE in Q1) is worth more than book, and Belstar and Homefin are worth less; they roughly offset.` },
    { callout: `**Our view:** the subsidiaries are a sideshow to the gold book, with one exception. Muthoot Money shows how much faster a gold lender grows when it starts small (tonnes up from 7 to 12 in a year), but it also competes for the same customers in new regions. Belstar's microfinance book is a reminder that unsecured lending to the same customer segment carries real credit risk: it caused most of the group's ₹1,576 cr of FY25 impairment.` },
  ],
};

const funding = {
  id: 'funding', nav: 'Funding & liquidity', kicker: 'Funding', title: 'Funding: banks, bonds and dollar notes at ~8.5-9%; short loans give a natural liquidity cushion',
  blocks: [
    { p: `Muthoot cannot take deposits, so it borrows. In Jun-2026 the standalone company owed ₹${n0(FU.total)} cr (principal): ${Math.round(FU.bankLoans / FU.total * 100)}% bank loans, ${Math.round(FU.ncd / FU.total * 100)}% listed debentures, ${Math.round(FU.ecb / FU.total * 100)}% dollar bonds (senior secured notes, hedged; ₹1,366 cr of derivative assets on the consolidated balance sheet), ${Math.round(FU.cp / FU.total * 100)}% commercial paper and ~1% other. It is rated AA+ by CRISIL and ICRA and BB+ (Fitch, S&P) / Ba1 (Moody's) abroad. Debenture funding rose 42% in Q1 alone (₹36,000 cr to ₹51,075 cr) as banks lent less. Interest cost was 7.52% of average loans in Q1 (Motilal Oswal puts the cost of borrowing at ~8.75%).` },
    { pair: [
      { type: 'hbar', title: 'Borrowing mix: banks 43%, debentures 34%, dollar bonds 17%', unit: 'Share of standalone borrowings, Jun-2026 (%)', x: ['Bank loans', 'Listed debentures', 'Dollar bonds (ECB)', 'Commercial paper', 'Other incl. sub-debt'], series: [{ name: 'Share', values: [FU.bankLoans, FU.ncd, FU.ecb, FU.cp, FU.other + FU.subDebt].map(v => Math.round(v / FU.total * 1000) / 10), fmt: 'pct' }], labels: 'all', source: 'Q1FY27 presentation p32-33' },
      { type: 'line', title: 'Cost of funds (our basis): ~8.8-8.9% for three years', unit: 'Interest expense ÷ average borrowings (%), consolidated', x: 'fin.labels', from: 'FY20', to: 'FY29E', series: [{ name: 'Cost of funds', ref: 'fin.costOfFunds', fmt: 'pct' }], labels: 'all', min: 6, max: 10, source: 'Screener.in; GAM estimates' },
    ] },
    { callout: `**Why it matters:** NBFCs fail on liquidity before they fail on credit. Muthoot's loans are short (3-12 months) and turn over every ~4 months, while its borrowings run 1-5 years, so cash comes in faster than it goes out; it also held ₹${n0(C.funding.cashSa)} cr of cash in Jun-2026 (9% of borrowings). The weakness is price, not access: a bank or a AAA-rated NBFC funds itself 100-150bp cheaper, which is exactly the margin new competitors are using against Muthoot.` },
  ],
};

const capital = {
  id: 'capital', nav: 'Capital & leverage', kicker: 'Capital', title: 'Capital: CRAR down from 32% to 20% as the book outgrew profit; still ample, and no raise in our model',
  blocks: [
    { p: `Standalone capital adequacy was ${Q1.crar}% in Jun-2026 (Tier 1 ${Q1.tier1}%) against the 15% minimum for NBFCs. That is well down from 31.8% in Mar-2023: the book grew 50% in FY26 and 43% in FY25 while equity grew 17% and 33% from retained profit, so the ratio fell as leverage rose. Muthoot has not raised equity since 2015; it pays a modest dividend (₹30 for FY26, 11% of EPS) and keeps the rest. Group AUM was 4.6x net worth in FY26 (3.5x in FY24).` },
    { pair: [
      { type: 'column', title: 'Standalone CRAR: 31.8% (Mar-23) to 20.3% (Jun-26)', unit: 'Capital adequacy (%), March; Q1FY27 = Jun-26', x: [...C.annualKpis.filter(k => k.crar).map(k => k.fy), 'Q1FY27'], series: [{ name: 'CRAR', values: [...C.annualKpis.filter(k => k.crar).map(k => k.crar), Q1.crar], fmt: 'pct' }], labels: 'all', min: 0, max: 35, highlight: 'Q1FY27', source: 'Company presentations (Q4FY22-Q1FY27)' },
      { type: 'line', title: 'Leverage peaks in FY26 and falls back in our model', unit: 'AUM ÷ net worth (x)', x: 'fin.labels', from: 'FY19', to: 'FY29E', series: [{ name: 'AUM ÷ equity', ref: 'fin.leverage', fmt: 'n2' }], labels: 'all', min: 2, max: 6, source: 'Screener.in; GAM estimates' },
    ] },
    { p: `**In our forecast** ROE of ~22-26% with a 12% payout grows book ~20-24% a year, faster than AUM (13-18%), so leverage falls from {{fin.leverage.11|n2}}x to {{F.leverage.2|n2}}x by FY29E and CRAR rebuilds. That is a choice, not a constraint: if gold rises again and growth returns to 30%+, CRAR would head toward the high teens and Muthoot would either slow growth, cut the dividend or raise equity. Dividends: ₹{{F.dps.0|n2}} / ₹{{F.dps.1|n2}} / ₹{{F.dps.2|n2}} for FY27-29E (yield ~{{F.divYield.0|n1}}%).` },
    { callout: '**Our view:** capital is not a near-term issue: 20% CRAR on a book secured by liquid gold is strong. But the cushion has been used up quickly, and the rating agencies watch it. The payout ratio (11% in FY26 vs ~20% before) has quietly fallen to protect it; we would not expect a higher dividend while growth stays fast.' },
  ],
};

// ROA tree on average AUM, built from the model
const cols = ['FY23', 'FY24', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'].map(fi);
const r2 = v => (v == null ? '–' : (Math.round(v * 100) / 100).toFixed(2));
const lineOf = (name, fn, hl) => ({ hl, cells: [hl ? `**${name}**` : name, ...cols.map(i => { const v = fn(i); return hl ? `**${r2(v)}**` : r2(v); })] });
const tax = i => (fin.ppopPct[i] - fin.creditCost[i]) * fin.taxRate[i] / 100;
const roaTree = {
  id: 'roatree', nav: 'ROA → ROE tree', kicker: 'Returns', title: 'From ROA to ROE: ~6% on assets, levered ~4.5x, gave 31% in FY26; we model ~5.5% and ~24%',
  blocks: [
    { p: 'A lender\'s return on equity is its return on assets times leverage. Muthoot earns an exceptional return per rupee of loans because its yield is high, its costs are spread over a very large average loan, and its losses are tiny; it needs only ~4-5x leverage (a bank runs at 10x+) to earn 20-30% on equity. The tree shows FY26\'s windfall and where we expect returns to settle.' },
    { exhibit: { type: 'table', title: 'ROA tree, % of average AUM (consolidated)', head: ['', 'FY23', 'FY24', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      lineOf('Interest income (yield)', i => fin.yieldOnAum[i]),
      lineOf('− Interest expense', i => fin.yieldOnAum[i] - fin.nim[i]),
      lineOf('= Net interest margin', i => fin.nim[i], true),
      lineOf('+ Fees and other income', i => fin.feePct[i]),
      lineOf('− Operating expenses', i => fin.opexPct[i]),
      lineOf('= Pre-provision profit', i => fin.ppopPct[i], true),
      lineOf('− Credit cost', i => fin.creditCost[i]),
      lineOf('− Tax (approx.)', tax),
      lineOf('= ROA on AUM (attributable)', i => fin.roaAum[i], true),
      lineOf('× Average AUM ÷ average equity (x)', i => fin.roe[i] / fin.roaAum[i]),
      lineOf('= ROE (%)', i => fin.roe[i], true),
    ], source: 'Company, Screener.in; GAM estimates. Tax and non-operating income are small balancing items; the company\'s standalone ROA on average loans was 7.55% in FY26 and 6.09% in Q1FY27.' } },
    { callout: `**What changes:** FY26 ROA on AUM of {{fin.roaAum.11|pct}} came from a 12.7% NIM. With yields back near 18% and falling, ROA settles at {{F.roaAum.0|pct}} in FY27E and {{F.roaAum.2|pct}} by FY29E, and ROE eases to {{F.roe.2|pct}} as leverage falls. Still among the best returns of any Indian lender, but the FY26 level of 31% was the peak of the cycle, not a new normal.` },
  ],
};

module.exports = { subsidiaries, funding, capital, roaTree, ...require('./MUTHOOTFIN.part4b') };
