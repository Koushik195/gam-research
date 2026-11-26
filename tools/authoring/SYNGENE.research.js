// Syngene International report, part B: cover, the story in charts, and the merger of part2-6 (business, history, industry,
// tailwind test, research services, CDMO and the Zoetis contract, biologics capacity, moat, margins, earnings quality, capital
// and Biocon, ownership, governance, Q1FY27, forecasts, street, valuation, verdict, glossary, statement notes). Shared inputs in
// SYNGENE.ctx.js / ctx2.js. Forecast and valuation figures are live tokens ({{...}}) that follow assumptions.json.
const X = require('./SYNGENE.ctx2');
const { F, V, A, n0, n1, price, mv, MULT, EVH, kev, SECTOR_EV, rating, epsU, evNowFwd, trailEv, YRS, SQ, LINES, ST, PEER_SET, P, MWEV, shortName, shortDate, sEvAll, sellAbove, gNeeded, NC_CO, implEvAtPrice } = X;
const P2 = require('./SYNGENE.part2'), P3 = require('./SYNGENE.part3'), P4 = require('./SYNGENE.part4'), P5 = require('./SYNGENE.part5'), P5b = require('./SYNGENE.part5b'), P6 = require('./SYNGENE.part6');

const cover = {
  headline: `The anchor biologics contract has gone and the market has priced Syngene as if growth went with it: on its own forward EV/EBITDA history and the pharma sector's move the target is {{dcf.tp|inr}}, a ${rating}, with a DCF that says the recovery must be real`,
  lead: `Syngene International (52.4% owned by Biocon) does contract research for drug makers (research services: discovery, dedicated centres such as BMS's 700-scientist unit, translational and clinical work; ~65% of FY26 revenue of ₹3,739 cr) and develops and manufactures their drugs (CDMO, small and large molecules; ~35%). Its biologics plants were built around one commercial product, Zoetis's Librela, under a 10-year programme worth up to US$500 mn; Librela orders collapsed in FY26 and were close to zero in Q1FY27, when revenue fell 16% and the margin fell to 12%. A new Biocon-bred team (Kiran Mazumdar-Shaw as executive chair, Siddharth Mittal as CEO) calls FY27 a 'transition year' and promises growth from FY28. We forecast EPS of ₹${n1(epsU[0])} / ${n1(epsU[1])} / ${n1(epsU[2])} for FY27-29E. The brokers that disclose a method use **EV/EBITDA**, and so do we: Syngene's median one-year-forward EV/EBITDA since Apr-2021 (${n1(EVH.med)}x), lifted ${SECTOR_EV}% for the pharma sector's five-year move, gives **${MULT.base}x Sep-28E EBITDA of ₹${n0(mv('ev').metric)} cr plus net cash = {{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}**. Cross-checks: P/E ₹${n0(mv('pe').value)}; DCF ₹${n0(mv('dcf').value)}, below the price. Bull {{scen.bull.tp|inr}}; bear {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'The franchise is bigger than Librela', p: 'About 400 clients incl. 16 of the top 20 pharma; BMS renewed to 2035; 5,778 scientists; US FDA/EMA/PMDA-approved sites; ex-Librela revenue grew in high single digits in FY26 (CFO). Few Indian peers offer integrated biologics.' },
    { h: 'But the earnings reset is deep and not over', p: `Q1FY27: revenue −16%, operating margin 12%, a loss after severance. Research services also lost price-sensitive clients. Guidance cut twice in six months (Jan-2026, Jul-2026). FY27E EPS ₹${n1(epsU[0])} vs ₹${n1(X.epsEx[2024])} before exceptional items in FY24; ROE ~6%.` },
    { h: 'The biologics capacity is empty for now', p: 'Unit 3 (bought for ₹617 cr, capitalised in Q1FY26) runs clinical batches; Bayview (US$36.5 mn plus fit-out) starts later in FY27 and earns from FY28; the original Bengaluru plant lost its anchor. Depreciation and staff costs arrive before revenue.' },
    { h: 'The price assumes the reset is permanent', p: `₹${n0(price)} is ${n1(evNowFwd)}x our FY28E EBITDA and ${n1(trailEv)}x trailing, against a ${n1(EVH.med)}x forward median since 2021 and 46-55x for Indian CDMO peers. Even at today's multiple, our FY28-29E recovery and the cash build give ~₹${n0(X.SENS.at(-1).tp)}. The DCF (₹${n0(mv('dcf').value)}) needs ~${Math.round(gNeeded)}% growth for 15 years to reach the price: the recovery has to happen.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'RED' },
    { k: 'Earnings momentum', v: 'RED' },
    { k: 'Competitive position', v: 'AMBER' },
    { k: 'Balance sheet', v: 'GREEN' },
    { k: 'Governance', v: 'AMBER' },
    { k: 'Valuation', v: 'GREEN' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): whether H2 starts to recover and hedge losses ease.',
    'Bayview (Baltimore) operationalised later in FY27; customer lock-ins after that; revenue from FY28.',
    'Zoetis\'s FY28 Librela forecast (expected by the end of FY27, per management) and any new commercial biologic for Unit 3.',
    'The new commercial team\'s first full plan: management promised more visibility "from next quarter".',
    'BIOSECURE: the US list of "biotechnology companies of concern" is due within a year of the Dec-2025 enactment.',
  ],
};

// ---------------------------------------------------------------- Story in charts
const STREET_TP = ST.filter(s => s.tp).slice().sort((a, c) => c.tp - a.tp);
const sEvChart = sEvAll.filter((_, i) => i % 2 === 0 || i === sEvAll.length - 1);
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'stacked', title: 'Revenue: ₹3,739 cr (FY26) falls to ~₹3,476 cr in FY27E, then recovers', unit: 'Revenue (₹ crore), GAM split', x: ['FY25', 'FY26', ...YRS], series: [{ name: 'Research services', values: [X.SA[5].research, X.SA[6].research, ...LINES.research.map(Math.round)], fmt: 'num' }, { name: 'CDMO', values: [X.SA[5].cdmo, X.SA[6].cdmo, ...LINES.cdmo.map(Math.round)], fmt: 'num' }], minLabel: 600, source: 'Company shares of revenue (calls); GAM split and estimates FY27-29E' },
      { type: 'column', title: 'Quarterly revenue: Q1FY27 ₹736 cr, the lowest in three years', unit: 'Revenue (₹ crore), quarterly', x: SQ.map(q => q.q), series: [{ name: 'Revenue', values: SQ.map(q => q.revenue), fmt: 'num' }], labels: 'all', highlight: 'Q1FY27', source: 'Screener.in' },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: ~29% for years, 24.6% in FY26, 20% in FY27E', unit: 'EBITDA margin (%), Screener basis', x: ['FY22', 'FY23', 'FY24', 'FY25', 'FY26', ...YRS], series: [{ name: 'EBITDA margin', values: [...['FY22', 'FY23', 'FY24', 'FY25', 'FY26'].map(f => Math.round(A.ebitdaMargin[X.ai(f)] * 10) / 10), ...F.ebitdaMargin], fmt: 'pct' }], labels: 'all', min: 0, max: 35, source: 'Screener.in; GAM estimates' },
      { type: 'column', title: 'Two customers were 41% of FY25 revenue, 37% of FY26', unit: 'Share of revenue (%)', x: ['FY25', 'FY26'], series: [{ name: 'Two customers above 10%', values: [41.1, 37.2], fmt: 'pct' }], labels: 'all', min: 0, max: 50, source: 'AR FY26 note 33 (not named; BMS and Zoetis in our reading)' },
    ] },
    { pair: [
      { type: 'column', title: 'EPS before exceptional items: ₹13.0 (FY24) to a ₹5 trough, back to ~₹11 by FY29E', unit: 'EPS (₹)', x: ['FY23', 'FY24', 'FY25', 'FY26', ...YRS], series: [{ name: 'EPS', values: [2023, 2024, 2025, 2026].map(y => Math.round(X.epsEx[y] * 10) / 10).concat(epsU.map(e => Math.round(e * 10) / 10)), fmt: 'n1' }], labels: 'all', source: 'Screener.in; company pre-exceptional PAT; GAM estimates' },
      { type: 'line', title: `Forward EV/EBITDA since Apr-2021: median ${n1(EVH.med)}x, target ${MULT.base}x, now ${n1(evNowFwd)}x`, unit: 'EV ÷ next full-year EBITDA (x)', x: sEvChart.map(x => x[0]), series: [{ name: 'Forward EV/EBITDA', values: sEvChart.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, min: 10, max: 45, lines: [{ v: MULT.base, text: `Target: ${MULT.base}x (median ${n1(EVH.med)}x × ${kev.toFixed(3)})`, color: '#cf8f1f' }], source: 'Screener.in weekly prices; actual EBITDA FY23-26; GAM estimates FY27-28E' },
    ] },
    { pair: [
      { type: 'hbar', title: `Pharma EV/EBITDA is ${SECTOR_EV}% above its five-year median; Syngene ${X.pc1(MWEV.SYNGENE.mv)}`, unit: 'Trailing EV/EBITDA at the 30-Sep-2026 close vs five-year median (%)', x: [...[...PEER_SET].sort((a, c) => MWEV[c].mv - MWEV[a].mv).map(shortName), 'Syngene (not in set)'], series: [{ name: 'vs median', values: [...[...PEER_SET].sort((a, c) => MWEV[c].mv - MWEV[a].mv).map(s => Math.round(MWEV[s].mv * 10) / 10), Math.round(MWEV.SYNGENE.mv * 10) / 10], fmt: 'pct' }], labels: 'all', highlight: 'Syngene (not in set)', source: 'Screener.in EV Multiple series; asof-peers.js; PLAYBOOK §7c peer set' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (latest notes found)', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...STREET_TP.map(s => `${s.broker} (${shortDate(s.date)})`), 'GAM (base)'], series: [{ name: 'Target', values: [...STREET_TP.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes and news reports (Jul-2025 to Jul-2026), GAM Research' },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.research, P3.cdmo, P3.capacity, P4.moat, p.seasons, p.financials, P4.margins, P5.q1, P4.earnings, p.balance, P4.capital, P4.ownership(p.ownershipBase), P4.governance, P5.forecasts, P5.street, P5b.valuation, P6.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
