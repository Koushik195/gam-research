// Acutaas Chemicals report, part B: cover, the story in charts, and the merger of part2-6 (business, history & corporate actions,
// industry, tailwind test, CDMO and molecule exposure, base intermediates, specialty chemicals (battery, semiconductors,
// commodity), capacity & capex, moat, margins, earnings quality, capital & returns, ownership, governance, Q1FY27, forecasts,
// street, valuation, verdict, glossary, statement notes). Shared inputs in ACUTAAS.ctx.js. Forecast and valuation figures are
// live tokens ({{...}}) that follow assumptions.json.
const X = require('./ACUTAAS.ctx');
const { V, n0, n1, price, mv, MULT, HB, k, SECTOR, rating, epsU, epsSep28, fwdNow, trailPe, YRS, SA, SQ, LINES, pharmaTot, specTot, ST, MW, PEER_SET, shortName, shortDate, sPe, gNeeded, cdmoShare26, implPeAtPrice, medTp, chemCalc, ownMv } = X;
const gapE = ST.filter(s => s.eps).flatMap(s => [['FY27E', 0], ['FY28E', 1]].filter(([y]) => s.eps[y]).map(([y, i]) => (1 - epsU[i] / s.eps[y]) * 100));
const gapTxt = `${Math.round(Math.min(...gapE))}-${Math.round(Math.max(...gapE))}%`;
const P2 = require('./ACUTAAS.part2'), P3 = require('./ACUTAAS.part3'), P4 = require('./ACUTAAS.part4'), P5 = require('./ACUTAAS.part5'), P5b = require('./ACUTAAS.part5b'), P6 = require('./ACUTAAS.part6');

const cover = {
  headline: `One molecule turned a generic-intermediates maker into a 36%-margin business; the market pays ~${Math.round(implPeAtPrice)}x Sep-28E EPS for it, our rule gives ${MULT.base}x: target {{dcf.tp|inr}}, ${rating}`,
  lead: `Acutaas Chemicals (formerly Ami Organics) makes advanced intermediates for drug makers (88% of FY26 revenue of ₹1,339 cr) and specialty chemicals (12%). FY26 profit more than doubled to ₹356 cr as a 10-year contract to supply darolutamide intermediates to Orion's Fermion (for Bayer's prostate-cancer drug Nubeqa) scaled to ~₹635 cr, ~${Math.round(cdmoShare26)}% of revenue, and the EBITDA margin jumped from 23% to 36%. Q1FY27 revenue rose 59%. We forecast EPS of ₹${n1(epsU[0])} / ${n1(epsU[1])} / ${n1(epsU[2])} for FY27-29E, ${gapTxt} below the street for FY27-28, mainly because we do not forecast forex gains or high other income. The brokers that disclose a method use **P/E**, and so do we: Acutaas's median one-year-forward P/E since Apr-2022 (${n1(HB.med)}x), lifted ${SECTOR}% for the pharma sector's move over the same window, gives **${MULT.base}x Sep-28E EPS of ₹${n1(epsSep28)} = {{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}**. Cross-checks: EV/EBITDA ₹${n0(mv('ev').value)}; DCF ₹${n0(mv('dcf').value)}. Bull {{scen.bull.tp|inr}}; bear {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'A real step-change in economics', p: 'Gross margin 45% → 58% and EBITDA margin 23% → 36% in one year; Q4FY26 42%. ROE back to 24% with net cash (₹314 cr at Jun-2026). Strong chemistry: 90%+ backward integration and 50-90% global shares in key intermediates (trazodone, dolutegravir, entacapone).' },
    { h: 'But it rests on one molecule', p: `CDMO was ~${Math.round(cdmoShare26)}% of FY26 revenue, mostly darolutamide for one customer, and explains almost all of the margin jump. Nubeqa's patents run to 2033 (US) and 2035 (EU). The base business of generic intermediates was flat in FY24-26 (₹511 → 539 cr).` },
    { h: 'New engines are early and lower-margin', p: 'Battery electrolyte additives started supplying in Q1FY27 (4,000 MT, ~15% target margin, against Chinese incumbents); semiconductor chemicals are ₹16 cr today (BFC) with the Korean plant earning from FY28; a ₹212 cr electronic-chemicals plant comes by end-FY28. They dilute margins before they add much profit.' },
    { h: 'The price pays for the future, our rule pays for the past', p: `₹${n0(price)} is ${n1(trailPe)}x trailing and ${n1(fwdNow)}x our FY28E EPS, ~${Math.round(implPeAtPrice)}x Sep-28E. Acutaas's own forward P/E since Apr-2022 has a median of ${n1(HB.med)}x because the market did not foresee the FY26 jump; the DCF needs ~${Math.round(gNeeded)}% growth for 15 years. The street median target is ₹${n0(medTp)}; ours is far lower.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'AMBER' },
    { k: 'Earnings momentum', v: 'GREEN' },
    { k: 'Competitive position', v: 'AMBER' },
    { k: 'Balance sheet', v: 'GREEN' },
    { k: 'Governance', v: 'AMBER' },
    { k: 'Valuation', v: 'RED' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): Q2 is seasonally stronger than Q1; watch CDMO momentum and the first battery-additive revenue.',
    'Apixaban generics after the Eliquis patent expiry (Nov-2026 onwards): Acutaas has lined up 25-30 generic customers for its intermediates (PL).',
    'Four validated CDMO molecules start contributing in H2FY27 (₹50-100 cr each at peak, after regulatory approvals).',
    'Battery additives: third product trial runs from Q3FY27, fourth product contract; ECMS incentive (up to ~₹30 cr).',
    'Indichem (Korea) customer qualifications in FY27 for revenue from FY28; announcements on the new R&D centre and land for the next pharma plant.',
  ],
};

// ---------------------------------------------------------------- Story in charts
const H = SA.filter(s => s.fy >= 'FY22');
const STREET_TP = ST.filter(s => s.tp).slice().sort((a, c) => c.tp - a.tp);
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'stacked', title: 'Pharma intermediates carry the business; specialty grows from FY27', unit: 'Revenue (₹ crore)', x: [...H.map(h => h.fy), ...YRS], series: [{ name: 'Pharma intermediates (incl. CDMO)', values: [...H.map(h => Math.round(h.pharma)), ...pharmaTot.map(Math.round)], fmt: 'num' }, { name: 'Specialty chemicals', values: [...H.map(h => Math.round(h.specialty)), ...specTot.map(Math.round)], fmt: 'num' }], minLabel: 120, source: 'Company decks (FY22-26); GAM estimates FY27-29E' },
      { type: 'column', title: 'CDMO: ₹57 cr (FY24) to ~₹1,010 cr (FY28E)', unit: 'CDMO revenue (₹ crore)', x: ['FY24', 'FY25', 'FY26', ...YRS], series: [{ name: 'CDMO', values: [56.8, 282.2, 635.1, ...LINES.cdmo].map(Math.round), fmt: 'num' }], labels: 'all', highlight: 'FY26', source: 'PL initiation, Jul-2026 (company data); GAM estimates FY27-29E' },
    ] },
    { pair: [
      { type: 'line', title: 'Gross margin up 16 points in two years', unit: '% of revenue', x: SQ.map(q => q.q), series: [{ name: 'Gross margin', values: SQ.map(q => q.grossMarginPct), fmt: 'pct' }, { name: 'EBITDA margin', values: SQ.map(q => q.ebitdaMarginPct), fmt: 'pct' }], labels: 'last', min: 0, max: 70, source: 'Screener.in; company decks' },
      { type: 'column', title: 'Seasonal quarters: Q1 low, Q4 high, every year', unit: 'Revenue (₹ crore), quarterly', x: SQ.map(q => q.q), series: [{ name: 'Revenue', values: SQ.map(q => q.revenue), fmt: 'num' }], labels: 'all', highlight: 'Q1FY27', source: 'Company decks; PL (segment data)' },
    ] },
    { pair: [
      { type: 'column', title: `EPS: ₹19.4 (FY25) to ₹${n1(epsU[2])} (FY29E)`, unit: 'EPS (₹); FY27-29E = GAM', x: ['FY24', 'FY25', 'FY26', ...YRS], series: [{ name: 'EPS', values: [X.epsRep[2024], X.epsRep[2025], X.epsRep[2026], ...epsU.map(v => Math.round(v * 10) / 10)], fmt: 'n1' }], labels: 'all', source: 'Screener.in; GAM Research (FY24 incl. the JV write-off)' },
      { type: 'line', title: `Forward P/E since Apr-2022: median ${n1(HB.med)}x, target ${MULT.base}x, today ~${Math.round(fwdNow)}x`, unit: 'Price ÷ next full-year EPS (x)', x: sPe.map(x => x[0]), series: [{ name: 'Forward P/E', values: sPe.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, min: 0, max: 70, lines: [{ v: HB.med, text: `Median ${n1(HB.med)}x` }, { v: MULT.base, text: `Target: ${MULT.base}x (× ${k.toFixed(3)})`, color: '#cf8f1f' }], source: 'Screener.in weekly prices; FY24 EPS before the JV write-off; GAM estimates FY27-28E' },
    ] },
    { pair: [
      { type: 'hbar', title: `Pharma re-rated +${SECTOR}% over Acutaas's window; Acutaas +${Math.round(ownMv)}%; chemicals ${Math.round(chemCalc)}%`, unit: 'Trailing P/E at the 30-Sep-2026 close vs median since 1-Apr-2022 (%)', x: [...[...PEER_SET].sort((a, c) => MW[c].mv - MW[a].mv).map(shortName), 'Acutaas (not in set)', 'Chemicals set (median of 15)'], series: [{ name: 'vs median', values: [...[...PEER_SET].sort((a, c) => MW[c].mv - MW[a].mv).map(s => Math.round(MW[s].mv * 10) / 10), Math.round(ownMv * 10) / 10, Math.round(chemCalc * 10) / 10], fmt: 'pct' }], labels: 'all', highlight: 'Acutaas (not in set)', source: 'Screener.in P/E series; asof-peers.js; PLAYBOOK §7c peer set; chemicals set from the published chemicals reports' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (notes standing on 30-Sep-26)', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...STREET_TP.map(s => `${s.broker.replace(/ \(.*\)/, '')} (${shortDate(s.date)})`), 'GAM (base)'], series: [{ name: 'Target', values: [...STREET_TP.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes and summaries (Jul-Sep 2026), GAM Research' },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.cdmo, P3.base, P3.specialty, P3.capacity, P4.moat, p.seasons, p.financials, P4.margins, P5.q1, P4.earnings, p.balance, P4.capital, P4.ownership(p.ownershipBase), P4.governance, P5.forecasts, P5.street, P5b.valuation, P6.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
