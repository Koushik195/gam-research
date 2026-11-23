// Bharat Forge report, part B: cover, the story in charts, and the merger of part2-6 (business, history, industry,
// tailwind test, forgings, defence, overseas, moat, Q1FY27, earnings quality, ownership, governance, forecasts,
// street, valuation, verdict, glossary, statement notes). Shared inputs in BHARATFORG.ctx.js; forecast and valuation
// figures are live tokens ({{...}}) that follow assumptions.json. As of 30-Sep-2026.
const X = require('./BHARATFORG.ctx');
const { F, V, A, SA, SQ, QL, A26, n0, n1, pc, price, mv, adjMed, sectorDr, MULT, epsSep, rating, postQ1, medTp, C, segRev, segE, adj27 } = X;
const P2 = require('./BHARATFORG.part2'), P3 = require('./BHARATFORG.part3'), P4 = require('./BHARATFORG.part4'), P5 = require('./BHARATFORG.part5'), P6 = require('./BHARATFORG.part6');

const cover = {
  headline: 'India\'s forging leader with a real defence option, priced as if the option has already paid',
  lead: `Bharat Forge is India's largest forging company (standalone EBITDA margin 27.5% in FY26) with a fast-growing defence arm (KSSL, order book ₹11,196 cr) and loss-making plants in Europe and the US. Consolidated EPS was flat for seven years (₹22.2 in FY19, ₹22.6 in FY26). We expect it to roughly double by FY28E as defence deliveries start, the German steel plant (CDP) closes and US trucks recover: EPS before exceptional items of ₹${n1(adj27)} / ₹${n1(F.eps[1])} / ₹${n1(F.eps[2])} for FY27-29E on the post-QIP share count, ~10% below the street. The street values the stock on **P/E on FY28E (35-40x)**. The stock's own forward P/E median since 2021 is ${n1(adjMed)}x on clean EPS; cut by the ${Math.abs(sectorDr).toFixed(1)}% auto-component de-rating that gives **${MULT.base}x Sep-28E EPS of ₹${n1(epsSep.base)} = {{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}.** Cross-checks: EV/EBITDA ₹${n0(mv('ev').value)}, DCF ₹${n0(mv('dcf').value)}. Bull case {{scen.bull.tp|inr}}; bear case {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'The Indian forging core is good and recovering', p: `Standalone revenue fell 5% in FY26 on the US truck destocking but held a 27.5% margin; Q1FY27 revenue rose 11.5% with exports +12%. Management guides 20-25% growth for the Indian manufacturing business in FY27 (H2-weighted) and is adding ~₹1,800 cr of capacity for large engines, aerospace and semiconductor parts, funded by a ₹2,000 cr QIP (Sep-2026).` },
    { h: 'Defence: big orders, slow revenue', p: `KSSL's revenue was ₹1,422-1,567 cr for three years while the order book grew to ₹11,196 cr; Q1FY27 revenue rose 71% with a 17% margin. ATAGS and carbine deliveries wait for approvals. We model +35% / +35% / +20% and margins of 15-18%, below management's 22-23% target.` },
    { h: 'Overseas: the drag should shrink, not disappear', p: `Europe and the US earned a 3.8% EBITDA margin on ₹5,398 cr in FY26 and lost ₹328 cr before tax. CDP (₹1,595 cr revenue) will be wound down by end-CY2027 after a ₹358 cr charge in Q1FY27. We give credit for the exit and a partial US recovery; group EBITDA margin {{F.ebitdaMargin.0|pct}} / {{F.ebitdaMargin.1|pct}} / {{F.ebitdaMargin.2|pct}}.` },
    { h: 'Valuation: the defence story is in the price', p: `At ₹${n0(price)} the stock trades at ${n1(price / epsSep.base)}x our Sep-28E EPS and ~94x trailing; the DCF supports only ₹${n0(mv('dcf').value)}. Our ${MULT.base}x comes from its own history; the street's median target is ₹${n0(medTp)} (${pc((medTp / price - 1) * 100)}). At the street's EPS our multiple would give ~₹${n0(Math.round(MULT.base * (47.6 + 60.0) / 2 * X.dil / 10) * 10)}: the gap to the street is as much earnings as multiple.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'RED' },
    { k: 'Earnings momentum', v: 'AMBER' },
    { k: 'Competitive position', v: 'GREEN' },
    { k: 'Valuation', v: 'RED' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): margin recovery after the Q1 cost hit, US plant restart, KSSL execution.',
    'ATAGS final production approval (FOPM) and first deliveries; CQB carbine serial production in H2FY27.',
    'North American Class 8 orders and production into calendar 2027; US tariff decisions on aluminium.',
    'CDP wind-down milestones (closure targeted for Q3 CY2027) and use of the ₹2,000 cr QIP (capex, Indian M&A).',
    'New defence orders (naval systems, ammunition, energetics plant licence in Andhra Pradesh).',
  ],
};

// ---------------------------------------------------------------- Story in charts
const fy = ['FY24', 'FY25', 'FY26'], fyE = ['FY27E', 'FY28E', 'FY29E'];
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: 'EPS flat for seven years; our forecast roughly doubles it by FY28E', unit: 'EPS (₹), reported; FY26 pro forma for the QIP', x: 'fin.labels', from: 'FY19', to: 'FY29E', series: [{ name: 'EPS', ref: 'fin.eps', fmt: 'n1' }], labels: 'all', source: 'Screener.in; GAM estimates FY27-29E (FY27E after the ₹358 cr Q1 charge)' },
      { type: 'column', title: 'India earns the EBITDA; overseas and EV barely break even', unit: 'EBITDA (₹ crore), company basis', x: [...fy, ...fyE], series: [{ name: 'India (standalone, KSSL, subsidiaries)', values: [...fy.map(y => X.yr(y).indiaEbitda), ...fyE.map((_, i) => segE('bfl')[i] + segE('kssl')[i] + segE('othInd')[i])].map(Math.round), fmt: 'num' }, { name: 'Overseas + e-mobility', values: [...fy.map(y => X.yr(y).overseasEbitda + X.yr(y).emobEbitda), ...fyE.map((_, i) => segE('eu')[i] + segE('us')[i] + segE('emob')[i])].map(Math.round), fmt: 'num' }], labels: 'all', source: 'Analyst updates; GAM estimates' },
    ] },
    { pair: [
      { type: 'line', title: 'Standalone margin 26-29%; group margin 15-18%', unit: 'EBITDA margin (%)', x: QL, series: [{ name: 'Standalone', values: SQ.map(q => Math.round(q.bflEbitda / q.bflRev * 1000) / 10), fmt: 'pct' }, { name: 'Consolidated', values: SQ.map(q => Math.round(q.consEbitdaCo / q.consRev * 1000) / 10), fmt: 'pct' }], labels: 'last', min: 10, max: 32, source: 'Quarterly analyst updates' },
      { type: 'column', title: 'Defence: order book ₹11,196 cr, revenue still ~₹400 cr a quarter', unit: '₹ crore', x: QL, series: [{ name: 'KSSL revenue', values: SQ.map(q => q.ksslRev), fmt: 'num' }], labels: 'all', source: 'Quarterly analyst updates' },
    ] },
    { pair: [
      { type: 'column', title: 'Standalone exports bottomed in Q3FY26 and are recovering', unit: 'Standalone exports (₹ crore)', x: QL, series: [{ name: 'Exports', values: SQ.map(q => q.bflExpRev), fmt: 'num' }], labels: 'all', source: 'Quarterly analyst updates' },
      { type: 'column', title: 'Our revenue mix: defence and Indian units grow, Europe shrinks', unit: 'Revenue (₹ crore)', x: ['FY26', ...fyE], series: [{ name: 'Standalone', values: [A26.bflRev, ...segRev('bfl')].map(Math.round), fmt: 'num' }, { name: 'KSSL', values: [A26.ksslRev, ...segRev('kssl')].map(Math.round), fmt: 'num' }, { name: 'Europe', values: [A26.euRev, ...segRev('eu')].map(Math.round), fmt: 'num' }, { name: 'US', values: [A26.usRev, ...segRev('us')].map(Math.round), fmt: 'num' }], labels: 'none', source: 'Analyst updates; GAM estimates' },
    ] },
    { pair: [
      { type: 'line', title: `Forward P/E (clean EPS): ${Math.round(price / epsSep.base)}x Sep-28E now vs a ${Math.round(adjMed)}x median`, unit: 'Price ÷ next full-year EPS before exceptional items (x)', x: X.adjSeries.map(x => x[0]), series: [{ name: 'Forward P/E', values: X.adjSeries.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: Math.round(adjMed), text: `Median since 2021: ${n1(adjMed)}x` }], source: 'Screener.in prices; adjusted EPS (Emkay), GAM estimates for FY27-28E' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (notes after Q1FY27)', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...postQ1.map(s => s.broker), 'GAM (base)'], series: [{ name: 'Target', values: [...postQ1.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: `Broker notes, 10-11 Aug-2026 (median ₹${n0(medTp)}), GAM Research` },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.forgings, P3.defence, P3.overseas, P3.moat, p.financials, P4.guidance, p.capital, P4.quality, p.balance, P4.ownership(p.ownershipBase), P4.governance, P4.forecasts, P5.street, P5.valuation, P6.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
