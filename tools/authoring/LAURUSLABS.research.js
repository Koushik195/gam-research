// Laurus Labs report, part B: cover, story in charts, and the merger of part2-6 (business, history, industry, tailwind
// test, CDMO, Affordable Medicines, Laurus Bio and advanced biologics, capacity, moat, quality and USFDA, margins,
// earnings quality, capital, ownership, governance, forecasts, street, valuation, verdict, glossary, statement notes).
// Shared inputs in LAURUSLABS.ctx.js. Forecast and valuation figures are live tokens ({{...}}) that follow assumptions.json.
const X = require('./LAURUSLABS.ctx');
const { F, V, A, AS, C, n0, n1, price, mv, epsSep28, peMult, rating, EXM, K, sectorDr, LINES, YRS, fwdPe, postQ1, medTp, avgEps, P, SET, r1, derate, shortName, buyBelow, fwdNow, peSep, Q1, SA, SQ, cdmoShare, aboveCmp, tpAbove, ai } = X;
const P2 = require('./LAURUSLABS.part2'), P3 = require('./LAURUSLABS.part3'), P4 = require('./LAURUSLABS.part4'), P5 = require('./LAURUSLABS.part5'), P6 = require('./LAURUSLABS.part6');

const cover = {
  headline: 'A real CDMO transformation, priced as if it were already finished: Laurus\'s own history supports ~38.5x earnings; the price pays ~66x',
  lead: `Laurus Labs makes anti-retroviral (ARV) medicines and their ingredients for about a third of the world's HIV patients and has become one of India's larger contract manufacturers (CDMO) for drug innovators. Of FY26 revenue of ₹6,813 cr, 28% was CDMO for innovators, 3% Laurus Bio (fermentation), 40% generic APIs and 29% formulations. Q1FY27 was a record: revenue +29% to ₹2,026 cr, CDMO +69% to ₹835 cr, EBITDA margin 31.5%. The stock nearly doubled from ~₹1,009 at end-March to ₹${n0(price)} on 30-Sep-2026, above ${postQ1.length - aboveCmp} of the ${postQ1.length} post-results targets and level with or below the other ${aboveCmp} (median ₹${n0(medTp)}). Brokers that disclose a method mostly use **P/E** (Motilal Oswal 65x 12-month forward, BOBCAPS 55x Jun-28E). Our EPS of ₹${n1(F.eps[0])} / ₹${n1(F.eps[1])} / ₹${n1(F.eps[2])} for FY27-29E is in line with the street. Laurus's own one-year-forward P/E median since 2021 on EPS before exceptional items (${n1(EXM.med)}x, trough years left out) times the pharma sector factor (×${K}) gives **${peMult}x Sep-28E EPS of ₹${n1(epsSep28)} = {{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}**. Cross-checks: EV/EBITDA ₹${n0(mv('ev').value)}, DCF ₹${n0(mv('dcf').value)}. Bull case {{scen.bull.tp|inr}}; bear case {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'The transformation is real', p: `CDMO rose from ~14% of revenue in FY20 to 31% in FY26 and 43% in Q1FY27 (with Bio). Three patented APIs went commercial in 18 months, 55% of CDMO revenue is now commercial supply, a new big-pharma client joined in Q1, and capex is tied to named customer demand. The USFDA record is clean (21 inspections, no active warning letter). We do not dispute the quality of the turnaround.` },
    { h: 'It is still lumpy and capital-hungry', p: `Laurus has done this before: one large order lifted CDMO to ₹2,167 cr in FY23 and its end cut it to ₹922 cr in FY24, taking EPS from ₹14.7 to ₹3.0. Today 45% of CDMO revenue is Phase III and launch supply. Capex doubles to ₹2,000 cr in FY27 (~24% of sales), asset turns are ~0.9x and free cash flow turns negative in FY27E on our numbers.` },
    { h: 'Our forecasts are not bearish', p: `We model CDMO +${AS.businessLines.growth.cdmo[0]}% in FY27 and +${AS.businessLines.growth.cdmo[1]}% a year after, an EBITDA margin of ${n1(AS.ebitdaMargin[0])}-${n1(AS.ebitdaMargin[2])}% (management: ">30%") and EPS growing ~${n1(X.epsCagrFwd)}% a year to FY29E. Our FY27E/FY28E EPS (₹${n1(F.eps[0])} / ₹${n1(F.eps[1])}) sits beside the street average of the brokers we could read (₹${n1(avgEps('FY27E'))} / ₹${n1(avgEps('FY28E'))}).` },
    { h: 'The problem is the price', p: `At ₹${n0(price)} Laurus trades at ${n1(peSep)}x our Sep-28E and ${n1(fwdNow)}x FY28E EPS, almost double its ${n1(EXM.med)}x five-year median. Our ${peMult}x target multiple already includes the FY22 boom years and a sector premium. Even our bull case ({{scen.bull.tp|inr}}) sits below today's price. The rule would turn us buyers below ~₹${n0(buyBelow)}.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'RED' },
    { k: 'Earnings momentum', v: 'GREEN' },
    { k: 'Competitive position', v: 'AMBER' },
    { k: 'Governance', v: 'AMBER' },
    { k: 'Valuation', v: 'RED' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): whether CDMO revenue holds near the Q1 run-rate of ₹835 cr (management: "plus/minus ₹100 crores") and the margin stays near 30%.',
    'Conversion of Phase III CDMO programmes to commercial supply; validation of the commercial peptide block (from Q2FY27) and any disclosed peptide contract.',
    'Commissioning milestones: Laurus Bio\'s 400 KL fermentation plant (by Dec-2026), the first Unit 7 block (commercial validation by Mar-2027), the KRKA JV formulation plant (Phase I mid-2027).',
    'ARV: tender pricing, donor funding and the uptake of long-acting injectables, where Laurus has no lenacapavir licence.',
    'Capex and debt: FY28 capex guidance and the start of the 532-acre Laurus Pharma Zone (>USD600 mn over ~8 years).',
  ],
};

// ---------------------------------------------------------------- Story in charts
const H = SA.filter(a => a.fy >= 'FY22');
const tpRows = postQ1.slice().sort((a, c) => c.tp - a.tp);
const cdmoPct = [...SA.filter(a => a.cdmoSM != null || a.cdmo != null).map(a => Math.round(((a.cdmoSM ?? 0) + (a.bio ?? 0) + (a.cdmo ?? 0)) / a.revenue * 1000) / 10), Math.round((Q1.cdmoSM + Q1.bio) / Q1.revenue * 1000) / 10, ...YRS.map((_, i) => Math.round(cdmoShare(i) * 10) / 10)];
const cfoCapexY = ['FY19', 'FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'];
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'stacked', title: 'CDMO carries the growth; generics grow slowly', unit: 'Revenue by division (₹ crore)', x: [...H.map(h => h.fy), ...YRS], series: [{ name: 'CDMO small molecules', values: [...H.map(h => h.cdmoSM), ...LINES.cdmo.map(Math.round)], fmt: 'num' }, { name: 'Laurus Bio', values: [...H.map(h => h.bio), ...LINES.bio.map(Math.round)], fmt: 'num' }, { name: 'Generic API', values: [...H.map(h => h.api), ...LINES.api.map(Math.round)], fmt: 'num' }, { name: 'Formulations', values: [...H.map(h => h.fdf), ...LINES.fdf.map(Math.round)], fmt: 'num' }], minLabel: 900, source: 'Company presentations (FY22-24 read from charts; Bio by difference); GAM estimates FY27-29E' },
      { type: 'column', title: 'CDMO share of revenue: 14% in FY20, 43% in Q1FY27', unit: 'CDMO (incl. Bio), % of revenue', x: [...SA.filter(a => a.cdmoSM != null || a.cdmo != null).map(a => a.fy), 'Q1FY27', ...YRS], series: [{ name: 'CDMO share', values: cdmoPct, fmt: 'pct0' }], labels: 'all', min: 0, max: 60, source: 'Company presentations; GAM estimates FY27-29E (FY23 includes the one-off order)' },
    ] },
    { pair: [
      { type: 'column', title: 'Quarterly CDMO revenue quadrupled in two years', unit: 'CDMO small molecules (₹ crore)', x: SQ.map(q => q.q), series: [{ name: 'CDMO small molecules', values: SQ.map(q => q.cdmoSM), fmt: 'num' }], labels: 'all', source: 'Company presentations; Choice (Q1-Q3FY25)' },
      { type: 'line', title: 'Gross margin up 7.6 points, EBITDA margin up 17 points', unit: '% of revenue', x: SQ.map(q => q.q), series: [{ name: 'Gross margin', values: SQ.map(q => q.grossMarginPct), fmt: 'pct' }, { name: 'EBITDA margin', values: SQ.map(q => q.ebitdaMarginPct), fmt: 'pct' }], labels: 'last', min: 0, max: 70, source: 'Company (gross margin); Screener.in (EBITDA before other income)' },
    ] },
    { pair: [
      { type: 'column', title: 'Capex has eaten almost all operating cash for a decade', unit: '₹ crore', x: [...cfoCapexY, ...YRS], series: [{ name: 'Operating cash flow', values: [...cfoCapexY.map(y => A.cfo[ai(y)]), ...F.cfo.map(Math.round)], fmt: 'num' }, { name: 'Capex', values: [...cfoCapexY.map(y => A.capex[ai(y)]), ...F.capex], fmt: 'num' }], labels: 'all', source: 'Screener.in; GAM estimates FY27-29E (engine operating cash flow excludes treasury income)' },
      { type: 'line', title: `Forward P/E: median ${n1(EXM.med)}x since 2021 (troughs out), ${n1(fwdNow)}x now`, unit: 'Price ÷ next full-year EPS (x)', x: fwdPe.filter(x => x[0] >= '2019-04-01').map(x => x[0]), series: [{ name: 'Forward P/E', values: fwdPe.filter(x => x[0] >= '2019-04-01').map(x => Math.min(x[1], 120)), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, max: 120, lines: [{ v: peMult, text: `Target: ${peMult}x (median ${n1(EXM.med)}x × ${K})`, color: '#cf8f1f' }], source: 'Screener.in prices; reported EPS; GAM estimates FY27-28E; capped at 120x (FY23-24 trough dates reach ~170x)' },
    ] },
    { pair: [
      { type: 'hbar', title: `The price is above ${postQ1.length - aboveCmp} of ${postQ1.length} post-results targets`, unit: `₹ per share; CMP ₹${n0(price)}`, x: [...tpRows.map(s => `${s.broker} (${s.rating})`), 'GAM (base)'], series: [{ name: 'Target', values: [...tpRows.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes and press/aggregator reports 24-29 Jul-2026 as cited in deep.json; GAM Research' },
      { type: 'hbar', title: `Pharma trades above its five-year P/E: median ${X.pc1(sectorDr)}`, unit: 'Trailing P/E at 30-Sep-2026 vs own five-year median (%)', x: [...SET.map(shortName), 'Laurus (not in set)'], series: [{ name: 'vs median', values: [...SET.map(s => r1(derate[s])), r1(derate.LAURUSLABS)], fmt: 'pct' }], labels: 'all', highlight: 'Laurus (not in set)', source: 'Screener.in P/E history; NSE closes on 30-Sep-2026; PLAYBOOK §7c peer set' },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.cdmo, P3.generics, P3.bio, P3.capacity, P4.moat, P4.quality, p.seasons, p.financials, P4.margins, P4.earnings, p.balance, P4.capital, P4.ownership(p.ownershipBase), P4.governance, P5.forecasts, P5.street, P5.valuation, P6.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
