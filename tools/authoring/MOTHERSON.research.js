// Samvardhana Motherson report, part B: cover, the story in charts, and the merger of part2-6 (business, history,
// industry, tailwind test, competition, divisions, moat, Q1FY27, earnings quality, ownership, governance, forecasts,
// street, valuation, verdict, glossary, statement notes). Shared inputs in MOTHERSON.ctx.js; forecast and valuation
// figures are live tokens ({{...}}) that follow assumptions.json. As of 30-Sep-2026.
const X = require('./MOTHERSON.ctx');
const { F, V, A, SA, SQ, QL, n0, n1, n2, pc, price, mv, FM, sectorDr, MULT, epsSep, rating, postQ1, medTp, segRev, segM } = X;
const P2 = require('./MOTHERSON.part2'), P3 = require('./MOTHERSON.part3'), P4 = require('./MOTHERSON.part4'), P5 = require('./MOTHERSON.part5'), P6 = require('./MOTHERSON.part6');
const E = epsSep.base;

const cover = {
  headline: 'A world-class consolidator, but growth is bought, margins are thin and the street\'s earnings look high',
  lead: `Samvardhana Motherson (SAMIL) is one of the world's largest auto-component groups: wiring harnesses, bumpers and interior modules, mirrors and cameras, cockpit assembly and a growing set of non-auto businesses, in 425+ plants for almost every car maker, with no customer above 9% of revenue. Q1FY27 was strong (revenue +17%, EBITDA +26%), and July's acquisitions of Nexans Autoelectric and 81% of Yutaka Giken add ~USD2 bn of revenue. But most FY27 growth is acquisitions and a ~10-13% weaker rupee, EBITDA margins have stayed at 7-10% for a decade, and ROCE is 16% against a 40% target. The street values SAMIL on **P/E: 23-26x FY28E EPS** (median target ₹${n0(medTp)}). We forecast EPS of ₹${n2(F.eps[0])} / ₹${n2(F.eps[1])} / ₹${n2(F.eps[2])} for FY27-29E, 10-16% below the street because we carry the acquired plants' depreciation and debt. The house multiple (${n1(FM.median)}x forward median since the 2022 reorganisation, cut by the ${Math.abs(sectorDr).toFixed(1)}% component-sector de-rating) is **${MULT.base}x Sep-28E EPS of ₹${n2(E)}**, giving **{{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}.** Cross-checks: EV/EBITDA ₹${n0(mv('ev').value)}, DCF ₹${n0(mv('dcf').value)}. Bull case {{scen.bull.tp|inr}}; bear case {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'A genuine franchise: breadth, customers, and the first call when a supplier fails', p: 'Top-3 in mirrors, India\'s harness leader (through MSWIL and its own exports), cockpit assembler for European OEMs; USD96 bn of booked business (22% pure-EV programmes); leverage at a record-low 0.8x. Car makers hand SAMIL distressed suppliers to rescue: 15 since Sep-2022, plus Nexans and Yutaka in July 2026.' },
    { h: 'But FY27 growth is mostly bought and translated', p: `We model reported revenue +{{F.salesGrowth.0|n1}}% in FY27E, of which ~₹13,350 cr (~11 points) is Nexans and Yutaka; the rest includes a rupee ~13% weaker against the euro and copper passed through. Modules & Polymer Products, 42% of divisional revenue and 57% made in Europe, shrank in euros in Q1FY27. Global light-vehicle production fell 1.8%.` },
    { h: 'Margins and returns are the weak spot', p: `EBITDA margin 9.5% in FY26 and 8.8% in Q1FY27; the acquisitions start at 6-7%. We model {{F.ebitdaMargin.0|pct}} / {{F.ebitdaMargin.1|pct}} / {{F.ebitdaMargin.2|pct}} and ROE rising to {{F.roe.2|pct}} by FY29E, close to a ~12.5% cost of equity. "Exceptional" restructuring recurs (₹413 cr in FY26). Our FY28E EPS of ₹${n2(F.eps[1])} is below MOSL's ₹7.5 and Emkay's ₹7.1.` },
    { h: 'Valuation: the street pays above the stock\'s own history', p: `At ₹${n2(price)} SAMIL trades at ${n1(price / F.eps[1])}x our FY28E EPS (${n1(price / 7.5)}x MOSL's). Its forward P/E median since 2022 is ${n1(FM.median)}x; component peers were ~9% below their five-year medians on 30-Sep-2026. That gives ${MULT.base}x; even the street's 24x on our Sep-28E EPS is only ₹${n0(24 * E)}. The gap to the street is half earnings, half multiple.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n2'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'AMBER' },
    { k: 'Earnings momentum', v: 'GREEN' },
    { k: 'Competitive position', v: 'GREEN' },
    { k: 'Valuation', v: 'RED' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): first quarter with Nexans and Yutaka; copper and polymer recoveries; acquired-unit margins.',
    'Consumer electronics: commissioning of the third plant in Q3FY27 and first disclosure of its revenue run-rate.',
    'Closing of Shenzhen Autocruis (Q3FY27) and any new acquisition: management says more are in the pipeline.',
    'European production and the Q4 annual commodity and volume settlements with customers.',
    'Conversion of the ₹1,500 cr CCDs from Sep-2027 (up to ~11.8 cr shares) and any listing of an incubated business.',
  ],
};

// ---------------------------------------------------------------- Story in charts
const yrs = ['FY23', 'FY24', 'FY25', 'FY26'], DIV = [['wh', 'Wiring Harness'], ['mpp', 'Modules & Polymers'], ['vs', 'Vision'], ['ia', 'Integrated Assemblies'], ['eb', 'Emerging']];
const hist = k => yrs.map(l => SA.find(a => a.fy === l)[k + 'Rev'] || 0);
const q1g = DIV.map(([k]) => Math.round((SQ[8][k + 'Rev'] / SQ[4][k + 'Rev'] - 1) * 1000) / 10);
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'stacked', title: 'Divisional revenue: ₹90k cr (FY23) to ~₹2.2 lakh cr (FY29E), much of it acquired', unit: 'Economic revenue incl. 100% of JVs (₹ crore)', x: [...yrs, ...F.years], series: DIV.map(([k, nm], i) => ({ name: nm, values: [...hist(k), ...segRev(k).map(Math.round)], fmt: 'num', ...(i === 4 ? { color: '#6b7a8c' } : {}) })), labels: 'none', source: 'SAMIL presentations; GAM estimates FY27-29E (incl. Nexans in Wiring Harness and Yutaka in Emerging)' },
      { type: 'hbar', title: 'Q1FY27 growth by division: harness and emerging lead', unit: 'Revenue growth YoY, Q1FY27 (%)', x: DIV.map(d => d[1]), series: [{ name: 'Growth', values: q1g, fmt: 'pct' }], labels: 'all', source: 'Q1FY27 presentation. The rupee was ~13% weaker vs the euro.' },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: 7-10% for a decade; ~10% in our forecasts', unit: 'EBITDA margin (%)', x: 'fin.labels', from: 'FY17', to: 'FY29E', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 5, max: 12, source: 'Screener.in (history); GAM estimates (company EBITDA basis)' },
      { type: 'hbar', title: 'Division margins, FY26 vs our FY29E', unit: 'EBITDA margin (%)', x: DIV.map(d => d[1]), series: [{ name: 'FY26', values: DIV.map(([k]) => Math.round(SA[3][k + 'Ebitda'] / SA[3][k + 'Rev'] * 1000) / 10), fmt: 'pct' }, { name: 'FY29E', values: DIV.map(([k]) => Math.round(segM(k, 2) * 10) / 10), fmt: 'pct' }], labels: 'all', source: 'SAMIL presentations; GAM estimates' },
    ] },
    { pair: [
      { type: 'column', title: `EPS: ₹1.47 (FY23) to ₹3.66 (FY26), ₹${n2(F.eps[2])} by FY29E`, unit: 'EPS (₹, bonus-adjusted)', x: 'fin.labels', from: 'FY19', to: 'FY29E', series: [{ name: 'EPS', ref: 'fin.eps', fmt: 'n2' }], labels: 'all', source: 'Screener.in; GAM estimates' },
      { type: 'line', title: 'ROE: 10-12% in FY25-26, only modestly above the cost of equity by FY29E', unit: 'Return on equity (%)', x: 'fin.labels', from: 'FY19', to: 'FY29E', series: [{ name: 'ROE', ref: 'fin.roe', fmt: 'pct' }], labels: 'all', min: 0, max: 20, lines: [{ v: Math.round(V.ke * 10) / 10, text: `Cost of equity ${n1(V.ke)}%` }], source: 'Screener.in; GAM estimates' },
    ] },
    { pair: [
      { type: 'line', title: `Forward P/E: ${Math.round(price / F.eps[1])}x our FY28E now vs a ${Math.round(FM.median)}x median since 2022`, unit: 'Price ÷ next full-year EPS (x)', x: FM.series.map(x => x[0]), series: [{ name: 'Forward P/E', values: FM.series.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: Math.round(FM.median * 10) / 10, text: `Median since 2022: ${n1(FM.median)}x` }], source: 'Screener.in prices; actual EPS, GAM estimates for FY27-29E' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (notes standing on 30-Sep-2026)', unit: `₹ per share; CMP ₹${n2(price)}`, x: [...postQ1.map(s => s.broker), 'GAM (base)'], series: [{ name: 'Target', values: [...postQ1.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: `Broker notes, 6-7 Aug 2026 (median ₹${n0(medTp)}), GAM Research` },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P2.competition, P3.wh, P3.mpp, P3.vsia, P3.eb, P3.moat, p.financials, P4.guidance, p.capital, P4.quality, p.balance, P4.ownership(p.ownershipBase), P4.governance, P4.forecasts, P5.street, P5.valuation, P6.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
