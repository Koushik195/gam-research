// Tech Mahindra report, part B: cover, story in charts, and the merger of part2-6 (business, history, industry,
// tailwind test, revenue build, operations, margins, other income, moat, Q1FY27 & turnaround, earnings quality,
// ownership, governance, forecasts, street, valuation, verdict, glossary, statement notes). Shared inputs in
// TECHM.ctx.js. Forecast and valuation figures are live tokens ({{...}}) that follow assumptions.json. As of 30-Sep-2026.
const X = require('./TECHM.ctx');
const { F, V, A, n0, n1, pc, SQ, QL, Q1, price, mv, epsSep28, peMult, FMR, fwdPe, fwdNow, rating, sectorDr, postQ1, medTp, derate, DR_SET, shortName, UB, avgEps } = X;
const P2 = require('./TECHM.part2'), P3 = require('./TECHM.part3'), P3b = require('./TECHM.part3b'), P4 = require('./TECHM.part4'), P5 = require('./TECHM.part5'), P6 = require('./TECHM.part6'), P6b = require('./TECHM.part6b');

const cover = {
  headline: 'The turnaround worked, and the price already knows it: a de-rated sector does not pay 18x for a mid-tier IT firm',
  lead: `Tech Mahindra, the Mahindra group's USD 6.4 bn IT services company, has delivered almost exactly what CEO Mohit Joshi promised in April 2024: EBIT margin from 6.1% (FY24) to ${Q1.ebitPct}% in Q1FY27, dollar growth back to ${Q1.ccYoyPct}% in constant currency (peers guide 1-4%), USD 4.1 bn of deals in twelve months and 85%+ of free cash flow paid out. The stock held up while Indian IT had its worst year since 2008 on fears that AI agents shrink the work. We forecast EPS of ₹${n1(F.eps[0])} (FY27E) and ₹${n1(F.eps[1])} (FY28E), in line with consensus. The street values Tech Mahindra on **P/E on FY28E EPS (16.9-20x)**. Applying **${peMult}x to Sep-28E EPS of ₹${n1(epsSep28)}** (its ${n1(FMR.median)}x median forward P/E since 2021, cut by the IT sector's ${Math.abs(Math.round(sectorDr))}% de-rating) gives **{{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}.** Cross-checks: EV/EBITDA ₹${n0(mv('ev').value)}, DCF ₹${n0(mv('dcf').value)}. Bull case {{scen.bull.tp|inr}}; bear case {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'Promises kept', p: `EBIT margin up for 11 straight quarters to ${Q1.ebitPct}%; Q4FY27 "upwards of 15%". Q1FY27 revenue +${Q1.yoyPct}% YoY in dollars with every vertical growing, ROCE ${Q1.roce}%, FCF 108% of profit. Management credibility is the best it has been in a decade.` },
    { h: 'But FY27 is the easy year', p: 'Growth comes off a flat FY24-26 base, large-deal ramps and an auto programme pulled into Q1 (a 1-1.3% Q2 headwind). Communications (32%) grew only 1.3% with "volatility in a large US telecoms client". Margin levers (utilisation 87%, subcontractors, SG&A) are largely used, and there is no plan beyond FY27.' },
    { h: 'AI is a sector problem, not a cycle', p: 'HCLTech says deals are ~20% smaller for the same scope; Cognizant passes AI savings to clients; Gartner cut IT-services growth to 5.3%. Tech Mahindra\'s mix (BPS 16%, testing, infrastructure operations, telecom run work) is more exposed than most. We expect the sector\'s lower multiples to last.' },
    { h: 'Valuation: the premium is the risk', p: `At ₹${n0(price)} the stock trades at ${n1(price / F.eps[0])}x FY27E and ${n1(fwdNow)}x FY28E EPS, a 20-35% premium to Tier-1 peers that have de-rated by 40-50%. On the sector's de-rating our ${peMult}x gives {{dcf.tp|inr}}. The DCF (₹${n0(mv('dcf').value)}) says the price is fair only if today's growth and margins hold for a decade.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBIT margin', 'ebitMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'AMBER' },
    { k: 'Earnings momentum', v: 'GREEN' },
    { k: 'Competitive position', v: 'AMBER' },
    { k: 'Valuation', v: 'RED' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): growth after the European auto reversal, the margin hit from phased wage hikes, and whether the large telecom deal starts ramping.',
    'FY27 delivery: the 15% EBIT margin and above-peer growth; ROCE above 30% by Q4FY27.',
    'A roadmap beyond FY27 (margin and growth goals for FY28-30), likely with the Q4FY27 results.',
    'Sector: peers\' guidance (Infosys, HCLTech), AI-deflation evidence in renewals, US policy (H-1B fee, proposed HIRE Act).',
    'Rupee: a faster fall lifts EBIT but brings back hedge losses; the hedge book is down to USD 0.72 bn.',
  ],
};

const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: 'Dollar revenue: flat for two years, now growing again', unit: 'Revenue (USD mn), by quarter', x: QL, series: [{ name: 'Revenue', values: SQ.map(q => q.usdRev), fmt: 'num' }], labels: 'all', min: 1400, source: 'Company presentations' },
      { type: 'line', title: 'Margin: 8.5% to 14.4% in nine quarters', unit: 'EBIT margin, company definition (%)', x: QL, series: [{ name: 'EBIT margin', values: SQ.map(q => q.ebitPct), fmt: 'pct' }], labels: 'all', min: 6, max: 16, lines: [{ v: 15, text: 'FY27 target' }], source: 'Company presentations' },
    ] },
    { pair: [
      { type: 'column', title: 'Deal wins: three USD 1 bn+ quarters in a row', unit: 'New deal wins (TCV, USD mn)', x: QL, series: [{ name: 'TCV', values: SQ.map(q => q.tcv), fmt: 'num' }], labels: 'all', source: 'Company presentations' },
      { type: 'hbar', title: `The sector de-rated: peers ${Math.abs(Math.round(sectorDr))}% below their five-year P/E (median)`, unit: 'Trailing P/E on 30-Sep-2026 vs five-year median (%)', x: DR_SET.map(shortName), series: [{ name: 'vs median', values: DR_SET.map(s => Math.round(derate[s])), fmt: 'pct0' }], labels: 'all', source: 'Screener.in, NSE closes' },
    ] },
    { pair: [
      { type: 'column', title: `EPS: ₹27 in FY24, ₹54 in FY26, ₹${Math.round(F.eps[2])} by FY29E`, unit: 'EPS (₹, reported basic)', x: 'fin.labels', from: 'FY19', to: 'FY29E', series: [{ name: 'EPS', ref: 'fin.eps', fmt: 'n1' }], labels: 'all', source: 'Company; GAM estimates FY27-29E' },
      { type: 'line', title: `Forward P/E ${n1(fwdNow)}x vs a ${Math.round(FMR.median)}x median since 2021; our target ${peMult}x`, unit: 'Price ÷ next full-year EPS (x), reported EPS', x: fwdPe.map(x => x[0]), series: [{ name: 'Forward P/E', values: fwdPe.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 2, lines: [{ v: Math.round(FMR.median), text: `Median: ${n1(FMR.median)}x` }, { v: peMult, text: `Target: ${peMult}x`, color: '#cf8f1f' }], source: 'Screener.in prices; reported EPS, GAM estimates for forecast years' },
    ] },
    { pair: [
      { type: 'line', title: `Our EBIT margin path: ${n1(X.ebitM[0])}% → ${n1(X.ebitM[2])}%`, unit: 'EBIT margin (%), Screener basis; FY27-29E GAM', x: 'fin.labels', from: 'FY19', to: 'FY29E', series: [{ name: 'EBIT margin', ref: 'fin.ebitMargin', fmt: 'pct' }], labels: 'all', min: 0, max: 20, source: 'Screener.in; GAM estimates' },
      { type: 'hbar', title: `Our {{dcf.tp|inr}} vs the street (median ₹${n0(medTp)})`, unit: `₹ per share; CMP ₹${n0(price)}`, x: [...postQ1.slice().sort((p, q) => q.tp - p.tp).map(s => s.broker), 'GAM (base)'], series: [{ name: 'Target', values: [...postQ1.slice().sort((p, q) => q.tp - p.tp).map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes and press roundups (16-Jul to 28-Sep 2026), GAM Research' },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.growth, P3.people, P3.margins, P3b.otherIncome, P4.moat, p.financials, P4.guidance, p.capital, P3b.quality, p.balance, P4.ownership(p.ownershipBase), P4.governance, P5.forecasts, P5.street, P6.valuation, P6b.risks, p.statements, P6b.glossary],
  statementNotes: P6b.statementNotes,
};
