// Sai Life Sciences report, part B: cover, the story in charts, and the merger of part2-6 (business, history & IPO, industry,
// tailwind test, CRO, CDMO pipeline and customers, capacity, moat, quality, margins, earnings quality, capital, ownership,
// governance, Q1FY27, forecasts, street, valuation, verdict, glossary, statement notes). Shared inputs in SAILIFE.ctx.js.
// Forecast and valuation figures are live tokens ({{...}}) that follow assumptions.json.
const X = require('./SAILIFE.ctx');
const { F, V, A, n0, n1, price, mv, MULT, EVH, kev, SECTOR_EV, rating, epsU, evNowFwd, fwdNow, trailPe, YRS, SQ, LINES, FY26, Q1, ST, drWev, PEER_SET, P, shortName, shortDate, sEv, sellAbove, gNeeded, cashPath, hsie } = X;
const P2 = require('./SAILIFE.part2'), P3 = require('./SAILIFE.part3'), P4 = require('./SAILIFE.part4'), P5 = require('./SAILIFE.part5'), P5b = require('./SAILIFE.part5b'), P6 = require('./SAILIFE.part6');

const cover = {
  headline: `A good integrated CRDMO priced for a re-rating the sector has not had: on Sai Life's own forward EV/EBITDA and the pharma sector's move the target is {{dcf.tp|inr}}, a ${rating}`,
  lead: `Sai Life Sciences discovers molecules for drug innovators (CRO, 35% of FY26 revenue of ₹2,192 cr) and develops and makes them (CDMO, 65%), almost all for export and mostly for large pharma: 19 of the top 25 are clients, repeat customers bring over 90% of revenue and no customer is above ~12%. Q1FY27 revenue rose 12% (CRO +24%, CDMO +6%) and management guides 15-20% growth a year with a stronger H2. We forecast EBITDA in line with the street but EPS of only ₹${n1(epsU[0])} / ${n1(epsU[1])} / ${n1(epsU[2])} for FY27-29E, well below it, because capex doubles to ₹1,100-1,300 cr in FY27 and is funded with debt. Every broker that discloses a method uses **EV/EBITDA**, and so do we: Sai's median one-year-forward EV/EBITDA since Jul-2025 (${n1(EVH.med)}x), lifted ${SECTOR_EV}% for the pharma sector's move over the same window, gives **${MULT.base}x Sep-28E EBITDA of ₹${n0(mv('ev').metric)} cr less net debt = {{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}**. Cross-checks: P/E ₹${n0(mv('pe').value)}; DCF ₹${n0(mv('dcf').value)}. Bull {{scen.bull.tp|inr}}; bear {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'A real franchise with large pharma', p: 'An integrated discovery-to-commercial platform; 33 commercial and 14 late-phase molecules; five of six recent late-phase additions came through dedicated large-pharma teams; a clean USFDA/PMDA record; the margin rebuilt from 14% (FY23) to 29% (FY26).' },
    { h: 'But the next three years are capex-heavy', p: `₹2,800 cr of capex in FY27-29E against ~₹1,700 cr in the previous six years; net debt goes from ~₹${n0(-cashPath[0])} cr to ~₹${n0(-cashPath[3])} cr (incl. leases). EBITDA grows ~${Math.round(X.ebitdaCagr)}% a year; EPS only ~${Math.round(X.epsCagr)}%. HDFC Securities' FY28E EPS (₹${n1(hsie.eps.FY28E)}) was set before the capex guide doubled.` },
    { h: 'FY26 looked better than the run-rate', p: 'A ₹34 cr provision reversal and ₹30 cr of forex gains helped FY26; the underlying company margin was ~27.5%, Q1FY27 26.7%. CDMO growth slowed to 6% in Q1 and management will not guide by business.' },
    { h: 'The price has outrun the history and the sector', p: `₹${n0(price)} is ${n1(evNowFwd)}x our FY28E EBITDA and ${n1(trailPe)}x trailing EPS; Sai's EV/EBITDA is ${X.pc1(drWev.SAILIFE)} above its own median since Jul-2025 while the pharma set is +${SECTOR_EV}%. The DCF needs ~${Math.round(gNeeded)}% growth for 15 years. The rule says SELL above ~₹${n0(sellAbove)}.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'AMBER' },
    { k: 'Earnings momentum', v: 'AMBER' },
    { k: 'Competitive position', v: 'GREEN' },
    { k: 'Balance sheet', v: 'AMBER' },
    { k: 'Governance', v: 'GREEN' },
    { k: 'Valuation', v: 'RED' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): whether CDMO recovers from +6% and H2 shapes up as guided.',
    'First 225 KL production block at Bidar starting in H2/Q3FY27; ~1,150 KL by end-FY27.',
    'Two regulatory milestones for late-phase molecules in FY27 (and one in Q2FY28); a large-pharma process-development FTE deal expected by end-Q2FY27.',
    'FY28 capex guidance and the Choutuppal greenfield plan (peptide plant by 2028).',
    'BIOSECURE: the OMB list of "biotechnology companies of concern" is due by Dec-2026, a year after enactment.',
  ],
};

// ---------------------------------------------------------------- Story in charts
const STREET_TP = ST.filter(s => s.tp).slice().sort((a, c) => c.tp - a.tp);
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'stacked', title: 'Revenue: ₹1,695 cr (FY25) to ~₹3,585 cr (FY29E), CDMO two-thirds', unit: 'Revenue (₹ crore), deck basis', x: ['FY25', 'FY26', ...YRS], series: [{ name: 'CDMO', values: [1068, FY26.cdmoDeck, ...LINES.cdmo.map(Math.round)], fmt: 'num' }, { name: 'CRO', values: [626, FY26.croDeck, ...LINES.cro.map(Math.round)], fmt: 'num' }], minLabel: 400, source: 'Q4FY26 deck; GAM estimates FY27-29E' },
      { type: 'column', title: 'Lumpy quarters: ₹280 cr (Q1FY25) to ₹602 cr (Q4FY26)', unit: 'Revenue (₹ crore), quarterly', x: SQ.map(q => q.q), series: [{ name: 'Revenue', values: SQ.map(q => q.revenue), fmt: 'num' }], labels: 'all', highlight: 'Q1FY27', source: 'Screener.in' },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin rebuilt from 14% to 29%', unit: 'EBITDA margin (%), Screener basis', x: ['FY22', 'FY23', 'FY24', 'FY25', 'FY26', ...YRS], series: [{ name: 'EBITDA margin', values: [...[3, 4, 5, 6, 7].map(i => Math.round(A.ebitdaMargin[i] * 10) / 10), ...F.ebitdaMargin], fmt: 'pct' }], labels: 'all', min: 0, max: 35, source: 'Screener.in; GAM estimates' },
      { type: 'column', title: 'Capex doubles: ₹593 cr (FY26) to ₹1,200 cr (FY27E)', unit: '₹ crore', x: ['FY24', 'FY25', 'FY26', ...YRS], series: [{ name: 'Operating cash flow', values: [A.cfo[5], A.cfo[6], A.cfo[7], ...F.cfo.map(Math.round)], fmt: 'num' }, { name: 'Capex', values: [A.capex[5], A.capex[6], A.capex[7], ...F.capex], fmt: 'num' }], labels: 'all', source: 'Screener.in; GAM estimates' },
    ] },
    { pair: [
      { type: 'column', title: 'EBITDA +18% a year, EPS +10%: depreciation and interest absorb the growth', unit: 'Index, FY26 = 100', x: ['FY26', ...YRS], series: [{ name: 'EBITDA', values: [100, ...F.ebitda.map(e => Math.round(e / A.ebitda[X.b] * 100))], fmt: 'num' }, { name: 'EPS', values: [100, ...epsU.map(e => Math.round(e / X.epsRep[2026] * 100))], fmt: 'num' }], labels: 'all', source: 'Screener.in; GAM estimates' },
      { type: 'line', title: `Forward EV/EBITDA since Jul-2025: median ${n1(EVH.med)}x, target ${MULT.base}x, now ${n1(evNowFwd)}x`, unit: 'EV ÷ next full-year EBITDA (x)', x: sEv.map(x => x[0]), series: [{ name: 'Forward EV/EBITDA', values: sEv.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, min: 15, max: 45, lines: [{ v: MULT.base, text: `Target: ${MULT.base}x (median ${n1(EVH.med)}x × ${kev.toFixed(3)})`, color: '#cf8f1f' }], source: 'Screener.in weekly prices; GAM estimates FY27-28E' },
    ] },
    { pair: [
      { type: 'hbar', title: `Pharma EV/EBITDA moved +${SECTOR_EV}% over Sai's window; Sai ${X.pc1(drWev.SAILIFE)}`, unit: 'Trailing EV/EBITDA at the 30-Sep-2026 close vs median since 1-Jul-2025 (%)', x: [...[...PEER_SET].sort((a, c) => drWev[c] - drWev[a]).map(shortName), 'Sai Life (not in set)'], series: [{ name: 'vs median', values: [...[...PEER_SET].sort((a, c) => drWev[c] - drWev[a]).map(s => Math.round(drWev[s] * 10) / 10), Math.round(drWev.SAILIFE * 10) / 10], fmt: 'pct' }], labels: 'all', highlight: 'Sai Life (not in set)', source: 'Screener.in EV Multiple series; asof-peers.js; PLAYBOOK §7c peer set' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (notes standing on 30-Sep-26)', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...STREET_TP.map(s => `${s.broker.replace(/ Institutional Equities/, '')} (${shortDate(s.date)})`), 'GAM (base)'], series: [{ name: 'Target', values: [...STREET_TP.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes and trackers (Jan to Aug-2026), GAM Research' },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.cro, P3.cdmo, P3.capacity, P4.moat, P4.quality, p.seasons, p.financials, P4.margins, P5.q1, P4.earnings, p.balance, P4.capital, P4.ownership(p.ownershipBase), P4.governance, P5.forecasts, P5.street, P5b.valuation, P6.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
