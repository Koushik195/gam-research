// Muthoot Finance report, part B: cover, story in charts, and the merger of part2-6 (business, history,
// industry, tailwind test, the gold test, franchise, spread and NIM, asset quality, subsidiaries, funding,
// capital, ROA tree, moat, Q1FY27 and guidance, earnings quality, ownership, governance, forecasts, street,
// valuation, verdict, glossary, statement notes). Shared inputs in MUTHOOTFIN.ctx.js. Forecast and valuation
// figures are live tokens ({{...}}) that follow assumptions.json. As of 30-Sep-2026.
const X = require('./MUTHOOTFIN.ctx');
const { F, V, C, SG, n0, n1, pc, price, pbMult, bvSep28, PB21, fwdPb, fwdPbNow, trailPb, rating, ST, Q1, DEC, LTV, mv, kp, goldMoveSinceJun } = X;
const P2 = require('./MUTHOOTFIN.part2'), P3 = require('./MUTHOOTFIN.part3'), P4 = require('./MUTHOOTFIN.part4'), P5 = require('./MUTHOOTFIN.part5'), P6 = require('./MUTHOOTFIN.part6');

const cover = {
  headline: 'India\'s gold-loan leader after its windfall year: the gold price did the heavy lifting, the reset is under way, and at 1.8x forward book the stock already prices much of it',
  lead: `Muthoot Finance lends against household gold jewellery through 7,654 branches and earns returns few lenders anywhere can match (ROE 31% in FY26). But the record was made by the gold price: since FY20 the price of gold explains ~${Math.round(DEC.fy20_26.sharePrice)}% of the growth in its gold book; the tonnes pledged rose only ${Math.round(DEC.fy20_26.tn)}%. In Q1FY27 the yield on loans fell from 20.8% to 17.9% as one-off recoveries ended and competition bit, and profit fell 17% from Q4. The street values the stock on **P/B (~2.0x forward book)**. We forecast EPS of ₹${n1(F.eps[0])} / ₹${n1(F.eps[1])} / ₹${n1(F.eps[2])} for FY27-29E and ROE easing from ~26% to ~22%, with the gold price held flat. Applying **${pbMult}x to Sep-28E book of ₹${n0(bvSep28)}** (derived from its own ${PB21.med.toFixed(1)}x median since 2021 and the lender sector's move) gives **{{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}.** The target needs book growth, not a re-rating. The risk is the gold price: in our bear case (gold −20%, a rate war) the stock is worth {{scen.bear.tp|inr}}; bull {{scen.bull.tp|inr}}.`,
  arguments: [
    { h: 'Gold did the lifting; Muthoot did the selling', p: `Standalone gold loans grew from ₹40,700 cr (FY20) to ₹1,54,084 cr (FY26), 3.8x. The gold price rose 3.4x over the same period; the tonnes pledged only ${Math.round(DEC.fy20_26.tn)}%; the loan-to-value of the whole book ended exactly where it started (~${Math.round(LTV.FY26)}% of the gold's value). In FY26 the book grew ${Math.round(DEC.fy26.g)}% while tonnes fell ${Math.abs(Math.round(DEC.fy26.tn))}%. This is a superb business riding a commodity.` },
    { h: 'FY26 was the peak; FY27 is the reset', p: `FY26's 20.2% standalone yield included recoveries on old bad loans, ARC receipts, auction income and top-up charges that management now calls a "windfall, onetime". Q1FY27's yield was 17.93%, NIM 10.4% (13.4% in Q4), and management guides 18-18.5% "steady state" while admitting a "determined effort to bring down the yield". We forecast EPS +{{F.epsGrowth.0|pct}} in FY27E, ahead of the street's ~5%, because the book is still growing ~5% a quarter.` },
    { h: 'Still the best franchise, now with company', p: `Credit losses were 0.05% of loans in Q1, cost-to-income ~25%, ROA ~6%, and the new RBI gold-loan rules (in force from 1-Apr-2026) reward organised lenders. But banks hold ~₹16 lakh cr of gold loans to the NBFCs' ~₹4 lakh cr, and new entrants grew their gold books 2.5x in a year (Jefferies). We cut the yield 30bp a year from FY28.` },
    { h: 'Valuation: book growth, not a re-rating', p: `At ₹${n0(price)} the stock trades at ${n1(fwdPbNow)}x our FY28E book (median since 2021: ${PB21.med.toFixed(1)}x) and ${n1(price / F.eps[1])}x FY28E EPS. Our {{dcf.tp|inr}} implies ~${n1(V.tp / ((F.bvps[0] + F.bvps[1]) / 2))}x book at the target date, below today's ${n1(trailPb)}x trailing. Cross-checks: justified P/B ₹${n0(mv('jpb').value)}, P/E ₹${n0(mv('pe').value)}, residual income ₹${n0(mv('ri').value)}.` },
  ],
  keyRows: [['AUM (₹ cr)', 'aum', 'num'], ['AUM growth', 'aumGrowth', 'chg'], ['NII (₹ cr)', 'nii', 'num'], ['NIM', 'nim', 'pct'], ['Credit cost', 'creditCost', 'pct'], ['PAT (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n2'], ['BVPS (₹)', 'bvps', 'n1'], ['ROA (on assets)', 'roa', 'pct'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'RED' },
    { k: 'Earnings momentum', v: 'AMBER' },
    { k: 'Competitive position', v: 'GREEN' },
    { k: 'Regulation', v: 'AMBER' },
    { k: 'Valuation', v: 'GREEN' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): management said it would revise the opening 15% AUM guidance after the half-year, and show whether the yield holds at ~18%.',
    `The gold price: on 30-Sep-2026 22-carat gold was ~${Math.round(goldMoveSinceJun)}% above end-June; every 10% move changes the value of the jewellery behind the standalone book by ~₹25,500 cr.`,
    'Competition: new entrants plan ~3,700 gold-loan branches in FY27 (Jefferies), led by Bajaj Finance; watch Muthoot\'s pricing and customer count.',
    'Asset quality under the new rules: standalone Stage 2 loans rose 77% in Q1 as customers adjust to periodic interest servicing.',
    'Credit rating: management hinted that an upgrade from AA+ is being discussed with ICRA and CRISIL; it would lower funding costs.',
  ],
};

// ---------------------------------------------------------------- Story in charts
const yrs = ['FY19', 'FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'];
const idx = k => yrs.map(y => Math.round(kp(y)[k] / kp('FY19')[k] * 100));
const GQ = SG.goldQuarterly.filter(q => q.yield != null);
const ent = SG.quarterly.find(q => q.q === 'Q1FY27'), ENT = SG.entities.filter(e => e.key !== 'intra');
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: 'Group AUM: ₹38,000 cr to ₹1.8 lakh cr in seven years', unit: 'Consolidated loan AUM at March (₹ \'000 crore)', x: 'fin.labels', from: 'FY19', to: 'FY29E', series: [{ name: 'AUM', ref: 'fin.aum', scale: 0.001, fmt: 'num' }], labels: 'all', source: 'Company presentations; GAM estimates FY27-29E (gold price held flat)' },
      { type: 'line', title: 'The gold book tracks the gold price, not the tonnes', unit: 'Index, FY19 = 100 (standalone, at March)', x: yrs, series: [{ name: 'Gold-loan AUM', values: idx('goldAumSa'), fmt: 'num' }, { name: 'Gold price per gram', values: idx('goldPricePerGram'), fmt: 'num' }, { name: 'Tonnes pledged', values: idx('tonnes'), fmt: 'num' }], labels: 'ends', source: 'Company presentations (Q4FY20-Q4FY26), GAM Research' },
    ] },
    { pair: [
      { type: 'column', title: 'The yield windfall is over: 20.8% to 17.9% in one quarter', unit: 'Standalone interest income ÷ average loan assets (%); dashed lines = 18-18.5% "steady state"', x: GQ.map(q => q.q), series: [{ name: 'Yield', values: GQ.map(q => q.yield), fmt: 'n2' }], labels: 'all', highlight: 'Q1FY27', min: 15, max: 22, lines: [{ v: 18, text: '' }, { v: 18.5, text: '' }], source: 'Q4FY26 and Q1FY27 presentations' },
      { type: 'column', title: 'Margin of safety on the book: 36%, the thinnest in five quarters', unit: '1 − gold-loan AUM ÷ market value of pledged gold (%), quarter-end, excl. accrued interest', x: C.quarterlyGold.rows.map(r => r[0]), series: [{ name: 'Margin of safety', values: C.quarterlyGold.rows.map(r => r[5]), fmt: 'pct0' }], labels: 'all', highlight: 'Jun-26', min: 0, max: 50, source: 'Q1FY27 presentation p28' },
    ] },
    { pair: [
      { type: 'hbar', title: 'Nine-tenths of the group is the standalone gold lender', unit: 'Loan AUM by entity, Jun-2026 (₹ crore, before ₹3,890 cr of intra-group loans)', x: ENT.map(e => e.name), series: [{ name: 'AUM', values: ENT.map(e => ent[e.key]), fmt: 'num' }], labels: 'all', highlight: 'Muthoot Finance (standalone)', source: 'Q1FY27 presentation p18' },
      { type: 'line', title: 'ROE: 31% in FY26, easing to the low 20s', unit: 'ROE and ROA on total assets (%), attributable', x: 'fin.labels', from: 'FY19', to: 'FY29E', series: [{ name: 'ROE', ref: 'fin.roe', fmt: 'pct' }, { name: 'ROA', ref: 'fin.roa', fmt: 'pct' }], labels: 'ends', min: 0, max: 34, source: 'Screener.in; GAM estimates' },
    ] },
    { pair: [
      { type: 'line', title: `Forward P/B: ${PB21.max.toFixed(1)}x in Jan-2026, ${n1(fwdPbNow)}x on 30-Sep`, unit: `Price ÷ next full-year book value per share (x); orange line = our ${pbMult}x`, x: fwdPb.map(x => x[0]), series: [{ name: 'Forward P/B', values: fwdPb.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 2, lines: [{ v: PB21.med, text: `Median since 2021: ${PB21.med.toFixed(1)}x` }, { v: pbMult, text: '', color: '#cf8f1f' }], source: 'Screener.in prices; book value per share on attributable profit; GAM estimates FY27-28E' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (Aug-Sep 2026)', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...ST.filter(s => s.tp).map(s => s.broker), 'GAM (base)'], series: [{ name: 'Target', values: [...ST.filter(s => s.tp).map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: price, axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes and press roundups (2-Aug to 10-Sep 2026), GAM Research' },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.goldTest, P3.franchise, P3.spread, P3.quality, P4.subsidiaries, P4.funding, P4.capital, P4.roaTree, p.financials, P4.moat, P4.guidance, P4.earningsQuality, p.balance, P5.ownership(p.ownershipBase), P5.governance, P5.forecasts, P5.street, P6.valuation, P6.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
