// Muthoot Finance report, part 3: the gold test (price vs tonnage vs LTV; what happens if gold falls) and the
// franchise and AUM mix. Spread / NIM and asset quality are in part3b.
const X = require('./MUTHOOTFIN.ctx');
const { C, SG, F, n0, n1, pc, Q1, DEC, LTV, gold30, goldMoveSinceJun, goldMoveSinceMar, ltvInt, fallTo75, fallTo100, kp } = X;
const QG = C.quarterlyGold.rows;
const dRow = (label, d) => [label, pc(d.g), pc(d.pr), pc(d.tn), pc(d.lv), d.g > 0 && d.pr > 0 ? `${Math.round(d.sharePrice)}%` : 'n.m.'];
const yrs = ['FY19', 'FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'];

const goldTest = {
  id: 'gold', nav: 'The gold test', kicker: 'The central question', title: 'How much of the growth is the gold price? Nearly all of it, and that cuts both ways',
  blocks: [
    { p: `A gold loan is sized by the value of the jewellery, so the book can grow in three ways: more gold pledged (tonnes), a higher gold price, or lending a larger share of the gold's value (loan-to-value, LTV). Muthoot publishes all three every quarter for the standalone book, which lets us split its growth exactly. The answer is stark. From FY20 to FY26 the gold book grew ${pc(DEC.fy20_26.g)}; the gold price rose ${pc(DEC.fy20_26.pr)}, the tonnes pledged ${pc(DEC.fy20_26.tn)}, and the book-wide LTV ended where it began (~${Math.round(LTV.FY26)}% of the gold's market value, before accrued interest). On a log basis, ~${Math.round(DEC.fy20_26.sharePrice)}% of the growth was the price of gold.` },
    { exhibit: { type: 'table', title: 'Standalone gold-loan growth split into gold price, tonnes and loan-to-value', head: ['Period', 'Gold book', 'Gold price (₹/g)', 'Tonnes pledged', 'Book LTV', 'Share of growth from price'], rows: [
      dRow('FY20 → FY26 (six years)', DEC.fy20_26), dRow('FY25', DEC.fy25), dRow('FY26', DEC.fy26), dRow('Q1FY27 vs Q1FY26', DEC.yoyQ1), dRow('Q1FY27 vs Q4FY26 (one quarter)', DEC.q1),
    ], source: 'Company presentations (gold AUM, tonnes, Muthoot\'s quarter-end ₹/g); GAM Research. Book LTV = gold AUM ÷ (tonnes × price). Price share = ln(price change) ÷ ln(book change); above 100% means tonnes or LTV fell.' } },
    { p: `**FY26 was a pure price year.** The book grew ${pc(DEC.fy26.g)} although the tonnes pledged fell ${Math.abs(Math.round(DEC.fy26.tn))}% and LTV slipped: customers who needed ₹1 lakh brought less gold because each gram was worth more ("instead of 10 grams, he needs to give only 6 grams for the same loan", MD, May-2026), and small-ticket customers left (about 15 lakh accounts below ₹30,000) while larger tickets grew. **Q1FY27 was the opposite:** the gold price fell ${Math.abs(Math.round(DEC.q1.pr))}% in the quarter, yet the book grew ${pc(DEC.q1.g)} because customers borrowed more against the same gold (LTV ${pc(DEC.q1.lv)}), helped by the new 80-85% LTV tiers and top-ups. That pushed the book's margin of safety down to 36%, the lowest in the five quarters shown.` },
    { pair: [
      { type: 'line', title: 'Book LTV: 58-75% of the gold\'s value, highest after gold falls', unit: 'Standalone gold AUM ÷ market value of pledged gold (%), March; Q1FY27 = Jun-26', x: [...yrs, 'Q1FY27'], series: [{ name: 'Book LTV', values: [...yrs.map(y => Math.round(LTV[y] * 10) / 10), Math.round(LTV.Q1FY27 * 10) / 10], fmt: 'pct' }], labels: 'all', min: 40, max: 80, source: 'Company presentations; GAM Research (excl. accrued interest)' },
      { type: 'column', title: 'Muthoot\'s gold rate: ₹3,955 to ₹13,441 a gram in six years', unit: 'Quarter-end gold rate used by Muthoot (₹ per gram, ~22 carat), March; 30-Sep-26 = press 22-carat rate', x: [...yrs, 'Jun-26', '30-Sep-26'], series: [{ name: '₹ per gram', values: [...yrs.map(y => kp(y).goldPricePerGram), 12942, Math.round(gold30)], fmt: 'num' }], labels: 'all', highlight: '30-Sep-26', source: 'Company presentations; Upstox / StartupTalky (30-Sep-2026) for the last bar' },
    ] },
    { h: 'What happens if gold falls' },
    { p: `**The cushion.** In Jun-2026 the standalone book was ~${Math.round(LTV.Q1FY27)}% of the value of the gold behind it (management: ~${n1(ltvInt)}% including accrued interest). A ${Math.round(fallTo75)}% fall in gold would take the average loan to 75% (the ceiling for loans above ₹5 lakh; loans above ₹3 lakh are now ~69% of the book); a ${Math.round(fallTo100)}% fall would make the average loan worth as much as its gold. New loans written at 75-85% LTV would be under water much sooner. Muthoot resets its lending rate per gram daily and holds "a cushion of at least 25% at disbursal" (AR FY2025-26), and its customers almost always repay: only 23,830 accounts went to auction in FY26 and the gold realised ₹366 cr against ₹316 cr of dues.` },
    { p: `**The precedents.** Twice in fifteen years the gold price has turned against Muthoot. **FY13-FY15:** with an RBI cap of 60% LTV in force and gold falling, the standalone gold book shrank from ₹${n0(C.goldHistory.rows[1][1])} cr to ₹${n0(C.goldHistory.rows[2][1])} cr (−17%) in a year, tonnes from 134 to 118, profit from ₹1,004 cr to ₹671 cr and ROE from 30% to 14%. **FY21-FY23:** Muthoot's gold rate fell 12% from Sep-2020 to Mar-2021; book LTV jumped to ~75%, growth slowed to ~11% a year in FY22-23, lenders cut rates, the standalone yield fell from 20.1% (FY22) to 17.7% (FY23), Stage 3 loans rose to 4.3% (Jun-23) and group ROE fell from 28% to 18%. Losses stayed small both times. The damage was to growth, yield and ROE, not to capital.` },
    { exhibit: { type: 'table', title: 'Gold-price scenarios: what changes in our model (FY28E)', head: ['', 'Bear: gold −20%, rate war', 'Base: gold flat at 30-Sep level', 'Bull: gold +10-15%'], rows: [
      ['AUM growth FY27E / FY28E / FY29E', '+6% / +3% / +1%', '{{F.aumGrowth.0|pct0}} / {{F.aumGrowth.1|pct0}} / {{F.aumGrowth.2|pct0}}', '+23% / +20% / +18%'],
      ['Yield vs base', '−60bp', '18.1% → 17.5%', '+30bp'],
      ['Credit cost vs base', '+40bp', '{{F.creditCost.0|pct}} → {{F.creditCost.2|pct}}', '−10bp'],
      ['FY28E EPS (₹)', '{{scen.bear.eps.1|n2}}', '{{F.eps.1|n2}}', '{{scen.bull.eps.1|n2}}'],
      ['FY28E ROE', '{{scen.bear.roe.1|pct}}', '{{F.roe.1|pct}}', '{{scen.bull.roe.1|pct}}'],
      ['P/B multiple on Sep-28E book', '1.4x (low since 2021)', '1.95x', '2.4x (75th percentile)'],
      { hl: true, cells: ['**12-month value per share**', '**{{scen.bear.tp|inr}}**', '**{{dcf.tp|inr}}**', '**{{scen.bull.tp|inr}}**'] },
    ], source: 'GAM Research. We do not forecast the gold price; the base case holds it at the 30-Sep-2026 level.' } },
    { callout: `**Our view:** the honest answer to "how much is gold?" is "almost everything above mid-teens growth". On ${X.ASOF_TXT} 22-carat gold was ~₹${n0(gold30)} a gram in Kerala and Chennai, ${pc(goldMoveSinceJun)} on end-June and ${pc(goldMoveSinceMar)} on end-March, so the base case starts from a price close to the FY26 peak. A 20% fall would not threaten Muthoot's solvency (customers repay to get their jewellery back, and the gold would still exceed the average loan plus interest by ~${Math.round(100 - ltvInt / 0.8)} points), but history says it would stall growth for 1-2 years and cut ROE by a third. That is the risk you take with this stock.` },
  ],
};

const RQ = C.quarterlyGold.rows;
const franchise = {
  id: 'franchise', nav: 'Franchise & AUM mix', kicker: 'Franchise and growth', title: 'The franchise: 6.6 million customers, ₹32 cr of gold loans per branch, and a shift to bigger tickets',
  blocks: [
    { p: `Muthoot's edge is reach and habit. 5,029 standalone branches (7,654 in the group) serve ~2 lakh customers a day; 6.58 million customers had a live loan in Jun-2026. In Q1FY27 it lent ₹8,937 cr to 4.83 lakh new customers and ₹7,352 cr to 4.6 lakh returning inactive customers. Branch productivity is the profit engine: average gold loans per branch rose 40% in a year to ₹32.5 cr, almost entirely from the gold price, so each branch's fixed costs are spread over a much larger book. Cost-to-income fell from 31% (FY25) to 24% (FY26) on our basis.` },
    { pair: [
      { type: 'column', title: 'Active customers flat at 6.4-6.6 million for a year', unit: 'Standalone active gold-loan customers (million), quarter-end', x: ['Jun-25', 'Sep-25', 'Dec-25', 'Mar-26', 'Jun-26'], series: [{ name: 'Customers', values: [6.46, 6.57, 6.53, 6.41, 6.58], fmt: 'n2' }], labels: 'all', min: 6, max: 6.8, highlight: 'Jun-26', source: 'Q1FY27 presentation p29' },
      { type: 'column', title: 'Gold book +44% a year; loan accounts +4%', unit: 'Standalone gold AUM (₹ \'000 cr) at quarter-end', x: RQ.map(r => r[0]), series: [{ name: 'Gold AUM', values: RQ.map(r => Math.round(r[1]) / 10), fmt: 'n1' }], labels: 'all', source: 'Q1FY27 presentation p28-29 (loan accounts 10.46 → 10.91 million)' },
    ] },
    { p: `**Bigger tickets.** The customer count has gone nowhere for a year while the book grew 44%: average loans got bigger. Management says ~15 lakh small accounts (below ₹30,000) left in FY26 and were replaced by loans of ₹50,000-2 lakh, and that loans above ₹3 lakh rose from 51% of the book in Mar-2026 to 69% in Jun-2026. Bigger tickets are cheaper to service but are exactly the customers banks and new entrants want, and they are more rate-sensitive. **Geography:** the south was 84% of the gold book in FY07 and 48% in Q1FY27; the group plans 500-600 new branches in FY27 (200-250 for Muthoot itself, ~200 gold branches at Belstar).` },
    { exhibit: { type: 'table', title: 'Our AUM build vs guidance', head: ['', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Group AUM (₹ cr)', '{{fin.aum.10|num}}', '{{fin.aum.11|num}}', '{{F.aum.0|num}}', '{{F.aum.1|num}}', '{{F.aum.2|num}}'],
      ['Growth', '{{fin.aumGrowth.10|pct}}', '{{fin.aumGrowth.11|pct}}', '{{F.aumGrowth.0|pct}}', '{{F.aumGrowth.1|pct}}', '{{F.aumGrowth.2|pct}}'],
      ['Company guidance (standalone)', 'n.d.', 'n.d.', '15% (to be revised after Q2)', 'n.d.', 'n.d.'],
      ['Gold price assumption', 'actual +33%', 'actual +65%', 'flat at 30-Sep-26', 'flat', 'flat'],
    ], source: 'Company presentations and calls; GAM estimates. Gold price change = Muthoot\'s March-to-March rate.' } },
    { callout: `**Our view:** we model 18% AUM growth in FY27E: Q1 added 5.3% even as gold fell, and gold on 30-Sep was ${pc(goldMoveSinceJun)} above end-June. After that, with gold flat, growth has to come from tonnes (3% a year over FY16-26), bigger tickets and new branches, against new competitors: we take 15% and 13%. Management's habit is to guide 15% in May and raise it later; we are above the guide but well below the 43% of the past year.` },
  ],
};

module.exports = { goldTest, franchise, ...require('./MUTHOOTFIN.part3b') };
