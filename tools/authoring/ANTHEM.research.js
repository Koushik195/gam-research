// Anthem Biosciences report, part B: cover, the story in charts, and the merger of part2-6 (business, history & IPO,
// industry, tailwind test, CRDMO pipeline and concentration, specialty ingredients, capacity, moat, quality, margins,
// earnings quality, capital, ownership, governance, Q1FY27, forecasts, street, valuation, verdict, glossary, statement
// notes). Shared inputs in ANTHEM.ctx.js. Forecast and valuation figures are live tokens ({{...}}) that follow assumptions.json.
const X = require('./ANTHEM.ctx');
const { F, V, A, n0, n1, pc, price, mv, MULT, HB, k, SECTOR, rating, epsU, epsSep28, fwdNow, trailPe, YRS, SA, SQ, LINES, crdmoTot, FY26, Q1, ST, withTp, medTpPost, drW, PEER_SET, P, shortName, shortDate, sPe, buyBelow, gNeeded, cashPath } = X;
const P2 = require('./ANTHEM.part2'), P3 = require('./ANTHEM.part3'), P4 = require('./ANTHEM.part4'), P5 = require('./ANTHEM.part5'), P5b = require('./ANTHEM.part5b'), P6 = require('./ANTHEM.part6');

const cover = {
  headline: `India's most profitable CRDMO, carried by three customers: on Anthem's own forward P/E and the sector's re-rating the target is {{dcf.tp|inr}}, a ${rating} by a whisker`,
  lead: `Anthem Biosciences discovers, develops and manufactures molecules for drug innovators (CRDMO, 83% of FY26 revenue of ₹2,124 cr) and sells its own fermentation ingredients (17%). Fourteen client molecules already on the market bring 61% of revenue; three customers bring 57%. Q1FY27 revenue fell 23% to ₹418 cr because key customers moved deliveries to later quarters, while the gross margin held at 65%. We forecast EPS of ₹${n1(epsU[0])} / ${n1(epsU[1])} / ${n1(epsU[2])} for FY27-29E, at the low end of the street. Four of the six brokers that disclose a method use **P/E**, and so do we: Anthem's median one-year-forward P/E since Oct-2025 (${n1(HB.med)}x), lifted ${SECTOR}% for the pharma sector's move over the same window, gives **${MULT.base}x Sep-28E EPS of ₹${n1(epsSep28)} = {{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}**, just above the 15% line. Cross-checks: EV/EBITDA ₹${n0(mv('ev').value)}; DCF ₹${n0(mv('dcf').value)}. Bull {{scen.bull.tp|inr}}; bear {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'The best economics in Indian CRDMO', p: 'EBITDA margin ~40% before other income (43% as the company reports it), ROE ~21%, gross margin 65% since it began making a key intermediate in-house in FY26. ₹1,720 cr of net cash (Jun-2026) pays for Unit IV, which roughly doubles chemistry capacity by FY28, without debt or new shares.' },
    { h: 'A funnel that keeps converting', p: '100+ discovery programmes, 10 molecules in Phase III (two ADCs) and four client drugs approved in FY26, already 8-9% of revenue. Two big pharmas came on board directly in FY26 and a third is being signed. All four FY26 Phase III additions came from Anthem\'s own pipeline.' },
    { h: 'But revenue rests on a few customers and molecules', p: 'Top three customers 57% of FY26 revenue, the top two molecules ~37% (Nomura). A Phase III failure and a withdrawn product cut FY23 revenue 14%; Q3FY26 fell 15% and Q1FY27 23% on timing. FY26 growth (15%) missed the 20% first guided, and management now gives no number. We forecast ~14% growth in FY27, below the street\'s ~20%.' },
    { h: 'A full price, fair only against its own history', p: `₹${n0(price)} is ${n1(trailPe)}x trailing and ${n1(fwdNow)}x our FY28E EPS; the DCF (₹${n0(mv('dcf').value)}) needs ~${Math.round(gNeeded)}% growth for 15 years to reach the price. Our target rests on Anthem's short trading history and a sector re-rating; the upside only just clears the BUY line, so the rule turns HOLD above ~₹${n0(buyBelow)}.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'RED' },
    { k: 'Earnings momentum', v: 'AMBER' },
    { k: 'Competitive position', v: 'AMBER' },
    { k: 'Balance sheet', v: 'GREEN' },
    { k: 'Governance', v: 'AMBER' },
    { k: 'Valuation', v: 'RED' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): how much of the Q1 shortfall the deferred deliveries recover; management called Q1 the softest quarter of the year.',
    'Semaglutide API approval by CDSCO (expected "in a quarter or two" from Jul-2026) and first domestic supplies.',
    'Signing of the third big-pharma contract (revenue expected in the later quarters of FY27) and progress at the late-stage biotech client acquired by a big pharma.',
    'Phase III conversions (two ADCs among the ten) over the next 18-24 months; the US microbial biosimilar starting supply in FY27.',
    'Unit IV Phase I (₹1,200 cr): equipment orders from Jul-2026, commissioning by end-FY28; the promoters\' 18-month lock-in ends around Jan-2027.',
  ],
};

// ---------------------------------------------------------------- Story in charts
const H = SA.filter(s => s.fy >= 'FY23');
const STREET_TP = ST.filter(s => s.tp).slice().sort((a, c) => c.tp - a.tp);
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'stacked', title: 'CRDMO carries the growth: ₹808 cr (FY23) to ~₹2,900 cr (FY29E)', unit: 'Revenue (₹ crore)', x: [...H.map(h => h.fy), ...YRS], series: [{ name: 'CRDMO', values: [...H.map(h => Math.round(h.crdmo)), ...crdmoTot.map(Math.round)], fmt: 'num' }, { name: 'Specialty ingredients', values: [...H.map(h => Math.round(h.si)), ...LINES.si.map(Math.round)], fmt: 'num' }], minLabel: 300, source: 'RHP (FY23-25); AR FY26; GAM estimates FY27-29E' },
      { type: 'column', title: 'Lumpy quarters: −15% in Q3FY26, +26% in Q4, −23% in Q1FY27', unit: 'Revenue (₹ crore), quarterly', x: SQ.map(q => q.q), series: [{ name: 'Revenue', values: SQ.map(q => q.revenue), fmt: 'num' }], labels: 'all', highlight: 'Q1FY27', source: 'Company investor presentations' },
    ] },
    { pair: [
      { type: 'line', title: 'Gross margin stepped up to ~65% after backward integration', unit: '% of revenue', x: SQ.map(q => q.q), series: [{ name: 'Gross margin', values: SQ.map(q => q.grossMarginPct), fmt: 'pct' }, { name: 'EBITDA margin (before other income)', values: SQ.map(q => q.ebitdaMarginPct), fmt: 'pct' }], labels: 'last', min: 20, max: 75, source: 'Screener.in' },
      { type: 'hbar', title: 'Three customers paid 57% of FY26 revenue', unit: 'Share of FY26 revenue (%)', x: ['Customer A', 'Customer B', 'Customer C', 'All others'], series: [{ name: 'FY26', values: [FY26.customerConcentration.A, FY26.customerConcentration.B, FY26.customerConcentration.C, Math.round((100 - FY26.customerConcentration.top3) * 100) / 100], fmt: 'pct' }], labels: 'all', highlight: 'Customer A', source: 'AR FY26 consolidated note 41' },
    ] },
    { pair: [
      { type: 'column', title: 'EPS: ₹6.5 (FY24) to ₹16.4 (FY29E)', unit: 'EPS (₹); FY27-29E = GAM', x: ['FY24', 'FY25', 'FY26', ...YRS], series: [{ name: 'EPS', values: [X.epsRep[2024], X.epsRep[2025], X.epsRep[2026], ...epsU.map(v => Math.round(v * 10) / 10)], fmt: 'n1' }], labels: 'all', source: 'Screener.in; GAM Research' },
      { type: 'line', title: `Forward P/E since Oct-2025: median ${n1(HB.med)}x, target ${MULT.base}x`, unit: 'Price ÷ next full-year EPS (x)', x: sPe.map(x => x[0]), series: [{ name: 'Forward P/E', values: sPe.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, min: 40, max: 75, lines: [{ v: MULT.base, text: `Target: ${MULT.base}x (median ${n1(HB.med)}x × ${k.toFixed(3)})`, color: '#cf8f1f' }], source: 'Screener.in weekly prices; GAM estimates FY27-28E' },
    ] },
    { pair: [
      { type: 'hbar', title: `Pharma re-rated +${SECTOR}% over Anthem's window; Anthem ${X.pc1(drW.ANTHEM)}`, unit: 'Trailing P/E at the 30-Sep-2026 close vs median since 1-Oct-2025 (%)', x: [...[...PEER_SET].sort((a, c) => drW[c] - drW[a]).map(shortName), 'Anthem (not in set)'], series: [{ name: 'vs median', values: [...[...PEER_SET].sort((a, c) => drW[c] - drW[a]).map(s => Math.round(drW[s] * 10) / 10), Math.round(drW.ANTHEM * 10) / 10], fmt: 'pct' }], labels: 'all', highlight: 'Anthem (not in set)', source: 'Screener.in P/E series; asof-peers.js; PLAYBOOK §7c peer set' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (notes standing on 30-Sep-26)', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...STREET_TP.map(s => `${s.broker.replace(/ \(.*\)/, '')} (${shortDate(s.date)})`), 'GAM (base)'], series: [{ name: 'Target', values: [...STREET_TP.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes and summaries (Aug-2025 to Aug-2026), GAM Research' },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.crdmo, P3.si, P3.capacity, P4.moat, P4.quality, p.seasons, p.financials, P4.margins, P5.q1, P4.earnings, p.balance, P4.capital, P4.ownership(p.ownershipBase), P4.governance, P5.forecasts, P5.street, P5b.valuation, P6.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
