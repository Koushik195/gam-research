// Sun Pharma report, part B: cover, the story in charts, and the merger of part2-6 (business, history, industry, tailwind
// test, innovative medicines, US generics and FDA, India, EM/RoW/API, Organon, R&D, moat, Q1FY27, earnings quality,
// ownership, governance, forecasts, street, valuation, verdict, glossary, statement notes). Shared inputs in
// SUNPHARMA.ctx.js; forecast and valuation figures are live tokens ({{...}}) that follow assumptions.json. As of 30-Sep-2026.
const X = require('./SUNPHARMA.ctx');
const { F, V, A, SA, SQ, QL, n0, n1, pc, price, mv, ADJ, HOUSE, MULT, ORG, k, rating, postQ1, medTp, CONS, fwdNow, epsSep, ASOF_TXT } = X;
const P2 = require('./SUNPHARMA.part2'), P3 = require('./SUNPHARMA.part3'), P3b = require('./SUNPHARMA.part3b'), P4 = require('./SUNPHARMA.part4'), P4b = require('./SUNPHARMA.part4b'), P5 = require('./SUNPHARMA.part5'), P6 = require('./SUNPHARMA.part6');
const O = ORG.base;

const cover = {
  headline: 'India\'s best pharma franchise, about to become half of a bigger, slower and indebted company',
  lead: `Sun is India's largest drugmaker (8.5% of the market), the 13th largest US generics company and, with $1.42 bn of sales from Ilumya, Leqselvi, Unloxcyt and 26 other branded products, the only Indian company with a real global specialty business. On 27-Apr-2026 it agreed to buy **Organon & Co. for an enterprise value of $11.75 bn**, doubling revenue and taking on ~$9.5 bn of net debt; the deal was still awaiting regulatory approvals on ${ASOF_TXT} (closing guided for Q4FY27). The street values Sun on **P/E on 12-month-forward or FY28E earnings**. We forecast standalone EPS of ₹${n1(F.eps[0])} / ₹${n1(F.eps[1])} / ₹${n1(F.eps[2])} for FY27-29E, ~8-11% below the street (higher tax, no forex gains, slower US). On the house rule (Sun's ${n1(ADJ.med)}x median forward P/E on adjusted EPS × the +10.25% pharma factor = **${MULT.base}x Sep-28E EPS of ₹${n1(epsSep.base)}**) plus Organon at what Sun pays (−₹${n1(Math.abs(O.adj))} a share), our target is **{{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}.** Bull case {{scen.bull.tp|inr}}; bear case {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'India and innovative medicines carry the growth', p: `India grew 16% in Q1FY27 (volume +5.4% vs the market's +2%) and Sun's share rose to 8.5% from 8.2%; it is No.1 by prescriptions with 12 specialist groups and No.2 in the new generic semaglutide market. Innovative medicines grew from $674 mn in FY22 to $1,420 mn in FY26 (Ilumya $796 mn) and $351 mn in Q1FY27 (+13%); Ilumya's US decision in psoriatic arthritis is due in late Oct-2026. Together they are ~55% of sales and most of the profit growth.` },
    { h: 'US generics shrink, and the plants are the reason', p: `US sales fell 9.7% to $427 mn in Q1FY27 as gRevlimid ended and competition rose; they have been ~$1.9 bn for three years. Four Indian plants are under FDA action (Halol import alert since 2022, Mohali under consent-decree batch checks, Dadra warning letter, Baska OAI since Dec-2025) and the chairman admits Sun is not getting approvals. From 29-Sep-2026 patented imports into the US carry a 100% Section 232 tariff unless exempt; Sun calls the FY27 impact marginal.` },
    { h: 'Organon: accretive on paper, not obviously valuable', p: `Sun pays 6.2x EBITDA and ~4x adjusted earnings for a company whose revenue fell 3% in 2025 and again in H1-2026, so the street sees 30-40% EPS accretion by FY28. But the earnings come with ~2.3x net debt/EBITDA, falling Nexplanon and China sales and only a third of the portfolio growing. A P/E built on Sun's own history should not be applied to Organon's earnings. We value Organon at cost: no value created until the $350 mn of synergies show.` },
    { h: 'Valuation: fair, not cheap', p: `At ₹${n0(price)} the stock trades at ${n1(fwdNow)}x our FY28E EPS. Its forward P/E since Apr-2021 has a median of ${n1(ADJ.med)}x on adjusted EPS (${n1(HOUSE.med)}x on reported EPS); peers trade 10% above their five-year medians, so the house multiple is ${MULT.base}x. That gives {{dcf.tp|inr}}, below the post-results street median of ₹${n0(medTp)}. The gap is mostly earnings: we are ~10% below the street on FY28E EPS (₹${n1(F.eps[1])} vs ~₹${n1(CONS.fy28Eps)}).` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'AMBER' },
    { k: 'Earnings momentum', v: 'AMBER' },
    { k: 'Competitive position', v: 'GREEN' },
    { k: 'Valuation', v: 'AMBER' },
  ],
  catalysts: [
    'US FDA decision on Ilumya in psoriatic arthritis (action date late Oct-2026): the biggest near-term lever for innovative-medicine growth.',
    'Q2FY27 results (due by mid-November 2026): the US generics base after gRevlimid, R&D returning to 6-7% of sales, Organon deal costs, the tax rate.',
    'Organon closing (guided Q4FY27, i.e. Jan-Mar 2027): remaining regulatory approvals, the financing (bonds vs bank debt, cost), the dividend policy and the purchase-price allocation that will set reported EPS.',
    'Section 232 tariffs on patented drug imports, in force for most companies from 29-Sep-2026: how Sun sources Ilumya, Leqselvi, Unloxcyt and its other branded products for the US.',
    'FDA re-inspections of Halol, Baska and Dadra; new US generic approvals; AbbVie\'s Rinvoq decision in alopecia areata (expected by early 2027) against Leqselvi.',
  ],
};

// ---------------------------------------------------------------- Story in charts
const fy = ['FY22', 'FY23', 'FY24', 'FY25', 'FY26'];
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'stacked', title: 'Four businesses of similar size; India and EM grew fastest', unit: 'Gross sales by business (₹ crore)', x: fy, series: [{ name: 'India', values: SA.map(a => Math.round(a.india)), fmt: 'num' }, { name: 'US', values: SA.map(a => Math.round(a.us)), fmt: 'num' }, { name: 'Emerging Markets', values: SA.map(a => Math.round(a.em)), fmt: 'num' }, { name: 'Rest of World + API', values: SA.map(a => Math.round(a.row + a.apiOther)), fmt: 'num' }], minLabel: 4000, source: 'Investor presentations (FY22-24 read from chart, rounded)' },
      { type: 'column', title: 'Innovative medicines: $674 mn in FY22, $1,420 mn in FY26', unit: 'Global innovative medicines sales ($ mn)', x: fy, series: [{ name: 'Innovative medicines', values: SA.map(a => a.innovUsdM), fmt: 'num' }], labels: 'all', source: 'Investor presentations; Q4FY26 call' },
    ] },
    { pair: [
      { type: 'column', title: 'US sales: ~$470 mn a quarter, then $427 mn in Q1FY27', unit: 'US formulations ($ mn per quarter)', x: QL, series: [{ name: 'US', values: SQ.map(q => q.usUsdM), fmt: 'num' }], labels: 'all', source: 'PL Q1FY27 note (company data)' },
      { type: 'column', title: 'India: ₹4,145 cr a quarter two years ago, ₹5,475 cr now', unit: 'India formulations (₹ crore per quarter)', x: QL, series: [{ name: 'India', values: SQ.map(q => Math.round(q.india)), fmt: 'num' }], labels: 'all', source: 'PL Q1FY27 note; company presentations' },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin before forex: 28-30% in our forecasts', unit: 'EBITDA margin (%), Screener basis', x: 'fin.labels', from: 'FY19', to: 'FY29E', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 15, max: 35, source: 'Screener.in; GAM estimates FY27-29E (standalone)' },
      { type: 'column', title: `Reported EPS: ₹12 in FY21, ₹48 in FY26, ₹${Math.round(F.eps[2])} in FY29E (standalone)`, unit: 'EPS (₹)', x: 'fin.labels', from: 'FY19', to: 'FY29E', series: [{ name: 'EPS', ref: 'fin.eps', fmt: 'n1' }], labels: 'all', source: 'Screener.in; GAM estimates FY27-29E (before exceptional items; Organon excluded)' },
    ] },
    { pair: [
      { type: 'line', title: `Forward P/E: ~21-23x in 2021-23, ~31-34x since 2024`, unit: 'Price ÷ next full-year EPS (x)', x: X.fwdPe.map(x => x[0]), series: [{ name: 'Forward P/E (reported EPS)', values: X.fwdPe.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 2, lines: [{ v: Math.round(HOUSE.med), text: `Median since Apr-2021: ${n1(HOUSE.med)}x` }, { v: MULT.base, text: `Our standalone multiple: ${MULT.base}x`, color: '#cf8f1f' }], source: 'Screener.in prices; actual EPS, GAM estimates for FY27-28E' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (notes standing on 30-Sep-2026)', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...postQ1.map(s => s.broker), 'GAM (base)'], series: [{ name: 'Target', values: [...postQ1.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: `Broker notes, 2-Aug to 21-Sep-2026 (median ₹${n0(medTp)}), GAM Research` },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.innovative, P3.us, P3.india, P3b.emrow, P3b.organon, P4.rnd, P4.moat, p.financials, P4.guidance, p.capital, P4b.quality, p.balance, P4b.ownership(p.ownershipBase), P4b.governance, P5.forecasts, P5.street, P5.valuation, P6.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
