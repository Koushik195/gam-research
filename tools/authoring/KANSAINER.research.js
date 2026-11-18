// Kansai Nerolac report, part B: cover, story in charts, and the merger of part2-6 (business, history,
// industry, tailwind test, decorative, industrial, the parent, moat, Q1FY27, earnings quality, capital,
// ownership, governance, forecasts, street, valuation, verdict, glossary, statement notes). Shared inputs in
// KANSAINER.ctx.js. Forecast and valuation figures are live tokens ({{...}}) that follow assumptions.json.
const X = require('./KANSAINER.ctx');
const { D, F, V, A, n0, n1, pc, SQ, QL, Q1, price, mv, epsSep28, peMult, peFY28, peExCash, cashPerShare, cashMar26, rating, lines, decoShare, BL, fwdAdj, HA, RELY, relYr, relNow, P, PEERS, shortName, pl, mncl, landGains, UE } = X;
const P2 = require('./KANSAINER.part2'), P3 = require('./KANSAINER.part3'), P4 = require('./KANSAINER.part4'), P5 = require('./KANSAINER.part5'), P6 = require('./KANSAINER.part6');
const BO = D.industry.birlaOpus, Qd = Q1.consolidated;

const cover = {
  headline: 'A strong industrial business tied to a shrinking decorative one: cheap enough to buy, but this is not a compounder',
  lead: `Kansai Nerolac is the 74.96%-owned Indian arm of Kansai Paint (Japan). About 55% of its ₹8,052 cr FY26 revenue is industrial coatings, where it leads automotive paint (~61% share) and powder coatings; about 45% is decorative paint, where it is losing ground to Grasim's Birla Opus (Q1FY27 revenue ₹${n0(BO.q1fy27RevenueCr)} cr, more than Nerolac's whole decorative business) and JSW's Dulux. Revenue grew only ~2% a year in FY23-26 and EPS before land-sale gains was flat at ~₹8. FY27 starts better: Q1 revenue +${Qd.growthPct}% on ~5% price rises and booming auto output. The street values the stock on **P/E** (PL 25x Jun-28E, MNCL 23x FY28E). We forecast EPS of ₹${n1(F.eps[0])} in FY27E and ₹${n1(F.eps[1])} in FY28E, slightly below the street. Applying **${peMult}x to Sep-28E EPS of ₹${n1(epsSep28)}** gives **{{dcf.tp|inr}} ({{dcf.upside|chg}})**: **we initiate with ${rating}**, with low conviction. Cross-checks: EV/EBITDA ₹${n0(mv('ev').value)}, DCF ₹${n0(mv('dcf').value)}. Bull case {{scen.bull.tp|inr}}; bear case {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'The price already assumes decorative keeps shrinking', p: `At ₹${n0(price)} the stock trades at ${n1(peFY28)}x our FY28E EPS (~${n1(peExCash)}x after ₹${n0(cashPerShare)} a share of net cash), against a ${n1(HA.med)}x median since 2021 on EPS before exceptional items. Its P/E relative to Asian Paints fell from ${relYr[RELY.indexOf('2023')]} (2023) to ${relNow}. ${peMult}x, a midpoint between the sector's and its own de-rating, gives {{dcf.upside|chg}}.` },
    { h: 'Industrial is the real franchise', p: 'Nerolac supplies ~61% of India\'s automotive OEM paint (FY24; 61-81% at the seven largest two- and three-wheeler makers), leads powder coatings and grows double digit in performance coatings. Industrial grew double digit in Q1FY27, and a ₹601 cr expansion in auto, powder and resin capacity is under way.' },
    { h: 'Decorative is a melting ice cube, not a turnaround', p: `Decorative fell from ~55% of revenue (FY24) to ~45% (FY26). In Q1FY27 its volumes grew only low single digit while Birla Opus grew ${BO.q1fy27GrowthPct}%. Management aims to "maintain our position, if not improve" and says competitive intensity "continues to remain intact". We model decorative +${BL.decorativeGrowth[0]}% in FY27 (mostly price) and +${BL.decorativeGrowth[1]}% a year after.` },
    { h: 'Value stock or value trap? Some of each', p: `Not a classic trap: earnings should grow ~11% a year to FY29E, the balance sheet holds ₹${n0(cashMar26)} cr of cash and investments, and the industrial half deserves more than ${n1(peFY28)}x. But ROE is ~10%, below a 12% cost of equity, the DCF (₹${n0(mv('dcf').value)}) sits below the price, and ₹${n0(landGains)} cr of land-sale gains flattered FY24-25. The upside is a re-rating call, not a growth call.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'GREEN' },
    { k: 'Predictability', v: 'AMBER' },
    { k: 'Earnings momentum', v: 'AMBER' },
    { k: 'Competitive position', v: 'AMBER' },
    { k: 'Valuation', v: 'GREEN' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): whether the margin holds at last year\'s 11.0% while high-cost inventory is used up, and decorative growth after the price rises.',
    'The festive season (Diwali in November gives a full October painting month) and whether decorative volumes recover against Birla Opus and JSW Dulux.',
    'Auto output once the base includes the post-GST-cut surge (from October 2026), and how much of the industrial price rises OEMs accept.',
    'Completion of the Nerofix merger (expected in Q2FY27 per CRISIL) and progress on the ₹601 cr auto, powder and resin capacity.',
    'Raw materials and the rupee: a lasting fall in crude would bring scheme increases or price cuts in decorative.',
  ],
};

// ---------------------------------------------------------------- Story in charts
const decoQ1lo = Qd.revenue * 0.45, decoQ1hi = Qd.revenue * 0.55;
const g = s => P[s] ? D.peers.q1fy27SalesGrowthPct[s] : null;
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'stacked', title: 'Industrial is now the bigger half, and grows faster in our model', unit: 'Revenue by business (₹ crore; FY26 split approximate)', x: ['FY26', ...F.years], series: [{ name: 'Industrial (auto, powder, performance, refinish)', values: [BL.base.industrial, ...lines.ind.map(Math.round)], fmt: 'num' }, { name: 'Decorative', values: [BL.base.decorative, ...lines.deco.map(Math.round)], fmt: 'num' }], minLabel: 1500, source: 'Management statements (Feb-2026) for the FY26 split; GAM estimates' },
      { type: 'column', title: 'Decorative share of revenue, as management describes it', unit: 'Decorative as % of revenue (approximate)', x: ['FY24', 'FY25', 'FY26', 'FY29E'], series: [{ name: 'Decorative share', values: [55, 50, 45, Math.round(decoShare(2))], fmt: 'pct0' }], labels: 'all', min: 0, max: 70, source: 'Calls: Nov-2024 ("generally 55%"), Aug-2025 ("50-50"), Feb-2026 ("roughly 45%"); GAM FY29E' },
    ] },
    { pair: [
      { type: 'hbar', title: 'Q1FY27: Nerolac grew slowest of the listed paint makers', unit: 'Revenue growth, Jun-2026 quarter, YoY (%)', x: ['Indigo Paints', 'Asian Paints', 'Berger Paints', 'Kansai Nerolac'], series: [{ name: 'Growth', values: [g('INDIGOPNTS'), g('ASIANPAINT'), g('BERGEPAINT'), g('KANSAINER')], fmt: 'pct' }], labels: 'all', highlight: 'Kansai Nerolac', source: 'Screener.in quarterly results (consolidated)' },
      { type: 'hbar', title: `Birla Opus's quarterly revenue now exceeds Nerolac's decorative revenue`, unit: 'Decorative revenue, Jun-2026 quarter (₹ crore)', x: ['Birla Opus (Grasim)', 'Nerolac decorative if 55% of sales', 'Nerolac decorative if 45% of sales'], series: [{ name: 'Revenue', values: [BO.q1fy27RevenueCr, Math.round(decoQ1hi), Math.round(decoQ1lo)], fmt: 'num' }], labels: 'all', highlight: 'Birla Opus (Grasim)', source: 'Grasim Q1FY27 release (12-Aug-2026); Nerolac Q1FY27 revenue × management\'s 45-55% decorative share (GAM)' },
    ] },
    { pair: [
      { type: 'column', title: 'Automotive OEM paint: share rising from 58% to 61%', unit: 'Kansai Nerolac share of India auto OEM coatings (%)', x: ['FY22', 'FY23', 'FY24'], series: [{ name: 'Share', values: [58.1, 58.8, 61.0], fmt: 'pct' }], labels: 'all', min: 50, max: 65, source: 'Kansai Paint India strategy briefing (24-Feb-2026), company estimates' },
      { type: 'line', title: 'Quarterly EBITDA margin: 9-16%, no lasting improvement', unit: 'Consolidated EBITDA margin (%)', x: QL, series: [{ name: 'EBITDA margin', values: SQ.map(q => q.consPbditMarginPct), fmt: 'pct' }], labels: 'all', min: 0, max: 20, source: 'Company presentations; Screener (Q4FY25, Q4FY26)' },
    ] },
    { pair: [
      { type: 'line', title: `Forward P/E (EPS before exceptional items): from ~${Math.round(HA.max)}x to ~${Math.round(fwdAdj.at(-1)[1])}x`, unit: 'Price ÷ next full-year EPS before exceptional items (x)', x: fwdAdj.map(x => x[0]), series: [{ name: 'Forward P/E', values: fwdAdj.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: HA.med, text: `Median since 2021: ${n1(HA.med)}x` }, { v: peMult, text: `Our target: ${peMult}x`, color: '#cf8f1f' }], source: 'Screener.in prices; GAM EPS before exceptional items (FY22-26), GAM estimates (FY27-28E)' },
      { type: 'column', title: 'Valued at half of Asian Paints\' P/E, down from ~70%', unit: 'Nerolac trailing P/E ÷ Asian Paints trailing P/E (yearly median)', x: RELY.map(y => y === '2026' ? '2026 (to Sep)' : y), series: [{ name: 'Relative P/E', values: relYr, fmt: 'n2' }], labels: 'all', min: 0, max: 1, source: 'Screener.in P/E history (weekly), GAM' },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.decorative, P3.industrial, P3.parent, P3.moat, p.seasons, p.financials, P4.guidance, P4.quality, p.balance, P4.capital, P4.ownership(p.ownershipBase), P4.governance, P5.forecasts, P5.street, P5.valuation, P6.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
