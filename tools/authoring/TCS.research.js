// TCS report, part B: cover, story in charts, and the merger of part2-4b (business, history, industry, the AI
// question, tailwind test, industries, deals, people, moat, Q1FY27, earnings quality, ownership, governance,
// forecasts, street, valuation, verdict, glossary, statement notes). Shared inputs in TCS.ctx.js.
// Forecast and valuation figures are live tokens ({{...}}) that follow assumptions.json. As of 30-Sep-2026.
const X = require('./TCS.ctx');
const { F, V, A, n0, n1, SA, SQ, QL, A26, Q1, FY26, price, eps, mv, epsSep28, peMult, FM, HA, fwdAdj, rating, ST, TONLY, medTp, impliedG, usd, usdGrowth, epsCagrFwd, EPS26ADJ, sectorDr, derate } = X;
const P2 = require('./TCS.part2'), P3 = require('./TCS.part3'), P4 = require('./TCS.part4');

const cover = {
  headline: 'Slower for good, priced for decline: AI caps TCS\'s growth but does not justify 12x earnings',
  lead: `TCS is India's largest IT-services company (FY26 revenue ₹${n0(FY26.revenueCr)} cr / US$${n0(FY26.usdRevenueM)} m; 25% EBIT margin; ~52% ROE), 71.7% owned by Tata Sons. Its revenue fell 2.4% in constant currency in FY26 as the BSNL contract tapered and clients cut discretionary work, and the stock lost 55% from its 2024 peak as investors concluded that generative and agentic AI will shrink traditional IT services. Our answer to the central question: **both** are true. AI takes 10-15% out of each renewal, so growth will stay well below the 8-10% of the 2010s; but the order book (US$40.7 bn TCV in FY26), new AI work (US$2.6 bn run-rate) and the weak rupee keep earnings growing. We forecast USD revenue +${usdGrowth.map(g => n1(g)).join('% / +')}% and EPS of ₹${n1(eps[0])} / ₹${n1(eps[1])} / ₹${n1(eps[2])} for FY27-29E, ~4% above the street in FY28E. The street values TCS on **P/E, 14-15x FY28E**. Our multiple is derived from TCS's ${n1(HA.med)}x median forward P/E since 2021, cut by the sector's ${Math.abs(Math.round(sectorDr))}% de-rating (TCS itself is ${Math.abs(Math.round(derate.TCS))}% below its median): **${peMult}x Sep-28E EPS of ₹${n1(epsSep28)} gives {{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}.** Cross-checks: EV/EBITDA ₹${n0(mv('ev').value)}, DCF ₹${n0(mv('dcf').value)}. Bull case {{scen.bull.tp|inr}}; bear case {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'Growth is slower for good', p: `FY26 CC growth was −2.4%, the widest gap to peers on record; Q1FY27 recovered to +3.2% YoY but only +0.4% QoQ. TCS passes 10-15% productivity to clients at each renewal. We model USD growth of ${usdGrowth.map(g => n1(g)).join(' / ')}% for FY27-29E, below the "high single digit" management hopes for once deflation is absorbed.` },
    { h: 'The franchise is intact', p: `TCV US$40.7 bn in FY26 with five mega deals, plus the US$800 m+ SKF win in Q1; 66 clients over US$100 m a year (from 62); FY26 EBITDA margin 27% vs Infosys 24%, HCLTech 21%, Wipro 19%; AI services US$2.6 bn annualised, +14% a quarter. TCS is losing hours, not clients.` },
    { h: 'The rupee and payouts carry the return', p: `FY27E EPS +${n1((eps[0] / EPS26ADJ - 1) * 100)}% on FY26's ₹${EPS26ADJ} adjusted base, almost all from the rupee (₹95.4 vs ₹89.0 per dollar). TCS returns ~90% of earnings: ₹110 a share in FY26, a ${n1(110 / price * 100)}% dividend yield at ₹${n0(price)}. EPS compounds ~${n1(epsCagrFwd)}% a year to FY29E.` },
    { h: 'Valuation: priced as if it were shrinking', p: `At ₹${n0(price)} TCS trades at ${n1(price / eps[1])}x FY28E (its lowest forward P/E in ten years; ${n1(FM.median)}x median since 2021), a price consistent with only ~${n1(impliedG)}% a year rupee earnings growth forever. Our ${peMult}x applies only the sector's de-rating; the street's 14-15x and today's price assume TCS deserves a much bigger discount (its own −${Math.abs(Math.round(derate.TCS))}% gives ${n1(X.afterOwn)}x, about the current price).` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBIT margin', 'ebitMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'GREEN' },
    { k: 'Predictability', v: 'AMBER' },
    { k: 'Earnings momentum', v: 'AMBER' },
    { k: 'Competitive position', v: 'AMBER' },
    { k: 'Valuation', v: 'GREEN' },
  ],
  catalysts: [
    'Q2FY27 results (due in October 2026): whether CC growth reaches ~1% QoQ as management\'s "Q2 better than Q1" implies, and margin climbs from 24.0% towards the 25%+ exit.',
    'AI revenue and deal conversion: the AI run-rate (US$2.6 bn), SKF and UK-telecom ramps, and the BSNL add-on purchase order (final PO awaited in Sep-2026).',
    'Capital allocation: a buyback "remains an option" at a price far below the 2022-23 buybacks (₹4,150-4,500); MHP closing and HyperVault funding.',
    'Rupee and macro: INR ~₹95.8 per dollar on 30-Sep-2026; West Asia conflict, tariffs and US discretionary spending.',
    'AI model launches: the February 2026 sell-off showed how each new agentic-AI release moves IT stocks, whatever the near-term numbers.',
  ],
};

// ---------------------------------------------------------------- Story in charts
const usdLabels = [...SA.map(a => a.fy), 'FY27E', 'FY28E', 'FY29E'], usdVals = [...SA.map(a => a.usdRevM), ...usd.map(u => Math.round(u.tot))];
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: 'Constant-currency growth: negative for most of FY26', unit: 'CC revenue growth, YoY (%)', x: QL, series: [{ name: 'CC growth', values: SQ.map(q => q.ccYoYPct), fmt: 'pct' }], labels: 'all', source: 'TCS fact sheets' },
      { type: 'column', title: 'US dollar revenue: flat for three years, ~4% growth in our forecasts', unit: 'Revenue (US$ m)', x: usdLabels, series: [{ name: 'USD revenue', values: usdVals, fmt: 'num' }], labels: 'ends', source: 'TCS fact sheets; GAM estimates FY27-29E' },
    ] },
    { pair: [
      { type: 'line', title: 'EBIT margin: 24-25%, through a revenue decline', unit: 'Operating (EBIT) margin before exceptional items (%)', x: QL, series: [{ name: 'EBIT margin', values: SQ.map(q => q.ebitMarginPct), fmt: 'pct' }], labels: 'all', min: 20, max: 28, source: 'TCS fact sheets' },
      { type: 'line', title: 'The rupee did the growing: ₹83 to ₹95 per dollar', unit: 'Effective ₹ per US$ (TCS revenue basis)', x: QL, series: [{ name: '₹ per US$', values: SQ.map(q => q.inrPerUsd), fmt: 'n1' }], labels: 'all', min: 80, max: 100, source: 'TCS fact sheets; GAM calculation' },
    ] },
    { pair: [
      { type: 'column', title: 'Order intake holds at US$9-12 bn a quarter', unit: 'TCV signed (US$ m)', x: QL, series: [{ name: 'TCV', values: SQ.map(q => q.tcvM), fmt: 'num' }], labels: 'all', source: 'TCS fact sheets' },
      { type: 'column', title: `EPS: ₹136 reported (₹146 before one-offs) in FY26, ₹${Math.round(eps[2])} by FY29E`, unit: 'EPS (₹; FY26 reported)', x: 'fin.labels', from: 'FY19', to: 'FY29E', series: [{ name: 'EPS', ref: 'fin.eps', fmt: 'n1' }], labels: 'all', source: 'Screener.in; GAM estimates FY27-29E' },
    ] },
    { pair: [
      { type: 'line', title: `Forward P/E: ~${Math.round(price / eps[1])}x now vs ${n1(HA.med)}x median since 2021`, unit: 'Price ÷ next full-year EPS before one-offs (x)', x: fwdAdj.map(x => x[0]), series: [{ name: 'Forward P/E', values: fwdAdj.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 2, lines: [{ v: HA.med, text: `Median since 2021: ${n1(HA.med)}x` }], source: 'Screener.in prices; EPS before one-offs, GAM estimates FY27-29E' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (Jul-Sep 2026)', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...ST.filter(s => s.eps).map(s => s.broker), `Street median (${X.allTp.length} targets)`, 'GAM (base)'], series: [{ name: 'Target', values: [...ST.filter(s => s.eps).map(s => s.tp), medTp, V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes with published estimates (9-11 Jul 2026); Business Today roundups; GAM Research' },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.aiq, P2.tailwind, P2.verticals, P2.deals, P2.people, P3.moat, p.financials, P3.guidance, p.capital, P3.quality, p.balance, P3.ownership(p.ownershipBase), P3.governance, P3.forecasts, P4.street, P4.valuation, P4.risks, p.statements, P4.glossary],
  statementNotes: P4.statementNotes,
};
