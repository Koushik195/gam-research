// Granules India report, part B: cover, the story in charts, and the merger of part2-6 (business, history, industry, tailwind test,
// finished dosages, legacy molecules, plants & FDA, growth projects, moat, margins, earnings quality, capital & returns, ownership,
// governance, Q1FY27, forecasts, street, valuation, verdict, glossary, statement notes). Shared inputs in GRANULES.ctx.js. Forecast and
// valuation figures are live tokens ({{...}}) that follow assumptions.json.
const X = require('./GRANULES.ctx');
const { V, F, n0, n1, price, mv, MULT, HB, k, SECTOR, rating, epsSep28, fwdNow, trailPe, YRS, SA, SQ, LINES, ST, MW, SET, shortName, shortDate, gNeeded, implPeAtPrice, medTp, ownMv, FM } = X;
const P2 = require('./GRANULES.part2'), P2b = require('./GRANULES.part2b'), P3 = require('./GRANULES.part3'), P3b = require('./GRANULES.part3b');
const P4 = require('./GRANULES.part4'), P4b = require('./GRANULES.part4b'), P5 = require('./GRANULES.part5'), P5c = require('./GRANULES.part5c');
const P5b = require('./GRANULES.part5b'), P6 = require('./GRANULES.part6'), P6b = require('./GRANULES.part6b');
const gapIcici = Math.round(-X.patGap(X.icici, 'FY28E', 1));

const cover = {
  headline: `A better generics business, already priced as one: complex generics lifted margins, but at ~${Math.round(implPeAtPrice)}x Sep-28E EPS the stock sits far above its own history; our rule gives ${MULT.base}x: target {{dcf.tp|inr}}, ${rating}`,
  lead: `Granules India makes paracetamol, metformin and a few other big molecules from the chemical up (API, granules, tablets) and sells mostly tablets (74% of FY26 revenue of ₹5,366 cr) in the US (~72%). It is moving to harder products: complex generics, led by US-made ADHD drugs, rose from 31% to 50% of finished dosages in five quarters and lifted the gross margin to a record 65-66%; Q1FY27 revenue grew 22% and profit 60%. The ₹1,762 cr promoter-led preferential issue, completed on 16-Sep-2026, leaves it with net cash. But its main plant, Gagillapur, has been under an FDA warning letter since Feb-2025, more than half of revenue is still legacy molecules it cannot reprice, and EPS was flat over FY21-FY26. We forecast EPS of ₹${n1(X.epsU[0])} / ${n1(X.epsU[1])} / ${n1(X.epsU[2])} for FY27-29E on 27.28 cr shares, ~${gapIcici}% below ICICI Securities for FY28E. Five of the six brokers that disclose a method use **P/E**, and so do we: Granules' median one-year-forward P/E since Apr-2021 (${n1(HB.med)}x), lifted ${SECTOR}% for the pharma sector's move, gives **${MULT.base}x Sep-28E EPS of ₹${n1(epsSep28)} = {{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}**. Cross-checks: EV/EBITDA ₹${n0(mv('ev').value)}; DCF ₹${n0(mv('dcf').value)}. Bull {{scen.bull.tp|inr}}; bear {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'The mix shift is real', p: 'Complex generics 31% → 50% of FD (FY25 → Q1FY27); gross margin 50% → 65.6% (FY22 → Q1FY27); 3rd largest US maker of controlled substances; Adderall XR share 5% → 29%. Seven of eight plants clean; net cash after Sep-2026.' },
    { h: 'The old problems are not gone', p: 'Gagillapur (~68% of FD capacity) has been under a warning letter since Feb-2025, with 9 approvals (~USD11 bn market) waiting for an FDA visit. Legacy generics are 56% of revenue and Granules held back supply in Q1FY27 rather than absorb costs. EPS ₹22.2 (FY21) → ₹24.0 (FY26).' },
    { h: 'The new engines are small', p: 'Genome Valley (+40% FD capacity) was "very low" utilised in Q1FY27; the Senn peptide CDMO has ~USD20 mn of revenue and lost ₹44.5 cr of EBITDA in FY26; oncology starts in FY29; the green-chemistry project stalled against Chinese prices.' },
    { h: 'The price pays for the success case', p: `₹${n0(price)} is ${n1(trailPe)}x trailing and ${n1(fwdNow)}x our FY28E EPS against a ${n1(HB.med)}x forward median since Apr-2021; Granules' P/E is ${Math.round(ownMv)}% above its five-year median vs +${SECTOR}% for pharma. The DCF needs ~${Math.round(gNeeded)}% growth for 15 years. Street median target ₹${n0(medTp)}.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'AMBER' }, { k: 'Predictability', v: 'AMBER' }, { k: 'Earnings momentum', v: 'GREEN' }, { k: 'Competitive position', v: 'AMBER' },
    { k: 'Balance sheet', v: 'GREEN' }, { k: 'Governance', v: 'AMBER' }, { k: 'Valuation', v: 'RED' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): gross margin once the cheaper US inventory is used up; Senn after a Q1 loss.',
    'FDA re-inspection of Gagillapur (awaited "anytime now" on 29-Sep-2026): the outcome decides when 9 pending approvals launch.',
    'Three controlled-substance launches over the next ~12 months (incl. Adderall IR); GLS utilisation above 50% by end-FY27.',
    'Litigation on the two sole first-to-file products (generic Lumryz, generic Dyanavel XR).',
    'Use of the ₹1,762 cr raised: the CMD is "very actively" looking at acquisitions.',
  ],
};

// ---------------------------------------------------------------- Story in charts
const H = SA.map(s => s.fy), FMS = FM.series;
const STREET_TP = ST.filter(s => s.tp).slice().sort((a, c) => c.tp - a.tp);
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'stacked', title: 'Tablets carry the business; API shrank after FY23', unit: 'Revenue (₹ crore)', x: [...H, ...YRS], series: [{ name: 'Finished dosages', values: [...SA.map(s => Math.round(s.fd)), ...LINES.fd.map(Math.round)], fmt: 'num' }, { name: 'API + PFI', values: [...SA.map(s => Math.round(s.api + s.pfi)), ...YRS.map((_, i) => Math.round(LINES.api[i] + LINES.pfi[i]))], fmt: 'num' }, { name: 'Peptide CDMO', values: [...SA.map(s => Math.round(s.cdmo)), ...LINES.cdmo.map(Math.round)], fmt: 'num' }], minLabel: 300, source: 'AR FY26, company decks (FY22-26); GAM estimates FY27-29E' },
      { type: 'column', title: 'Complex generics: 31% → 50% of finished dosages', unit: 'Complex generics, % of FD revenue', x: ['FY25', 'Q1FY26', 'FY26', 'Q4FY26', 'Q1FY27'], series: [{ name: 'Complex share', values: [31, 39, 43, 46, 50], fmt: 'pct0' }], labels: 'all', highlight: 'Q1FY27', source: 'Company decks' },
    ] },
    { pair: [
      { type: 'line', title: 'Record gross margin; EBITDA margin only 22-24%', unit: '% of revenue', x: SQ.map(q => q.q), series: [{ name: 'Gross margin', values: SQ.map(q => q.grossMarginPct), fmt: 'pct' }, { name: 'EBITDA margin', values: SQ.map(q => q.ebitdaMarginPct), fmt: 'pct' }], labels: 'last', min: 0, max: 75, source: 'Company decks; Screener.in' },
      { type: 'column', title: `EPS: flat for five years, then ₹${n1(X.epsU[2])} by FY29E`, unit: 'EPS (₹); FY26 pro forma and FY27-29E on 27.28 cr shares', x: ['FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26', 'FY26 PF', ...YRS], series: [{ name: 'EPS', values: [X.epsRep[2021], X.epsRep[2022], X.epsRep[2023], X.epsRep[2024], X.epsRep[2025], X.epsRep[2026], Math.round(X.A.eps[X.b] * 10) / 10, ...X.epsU.map(v => Math.round(v * 10) / 10)], fmt: 'n1' }], labels: 'all', source: 'Screener.in; GAM Research' },
    ] },
    { pair: [
      { type: 'line', title: `Forward P/E since Apr-2021: median ${n1(HB.med)}x, target ${MULT.base}x, today ~${Math.round(fwdNow)}x`, unit: 'Price ÷ next full-year EPS (x)', x: FMS.map(x => x[0]), series: [{ name: 'Forward P/E', values: FMS.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, min: 0, max: 32, lines: [{ v: HB.med, text: `Median ${n1(HB.med)}x` }, { v: MULT.base, text: `Target: ${MULT.base}x (× ${k.toFixed(3)})`, color: '#cf8f1f' }], source: 'Screener.in weekly prices (every 5th week); GAM estimates FY27-28E' },
      { type: 'hbar', title: `Pharma +${SECTOR}% above five-year medians; Granules +${Math.round(ownMv)}%`, unit: 'Trailing P/E at the 30-Sep-2026 close vs five-year median (%)', x: [...[...SET].sort((a, c) => MW[c].mv - MW[a].mv).map(shortName), 'Granules (not in set)'], series: [{ name: 'vs median', values: [...[...SET].sort((a, c) => MW[c].mv - MW[a].mv).map(s => MW[s].mv), ownMv], fmt: 'pct' }], labels: 'all', highlight: 'Granules (not in set)', source: 'Screener.in P/E series; asof-peers.js; PLAYBOOK §7c peer set' },
    ] },
    { pair: [
      { type: 'column', title: 'Net debt to net cash in two steps (Feb and Sep-2026)', unit: 'Net debt (₹ crore), company basis; negative = net cash', x: ['Mar-24', 'Mar-25', 'Mar-26', 'Jun-26', 'Jun-26 + Sep*'], series: [{ name: 'Net debt', values: [842, 706, 402, 101, Math.round(101.2 - X.PF.cashCr)], fmt: 'num' }], labels: 'all', highlight: 'Jun-26 + Sep*', source: 'Company decks; *GAM: Jun-26 less the warrant balance received on 16-Sep-2026' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (notes standing on 30-Sep-26)', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...STREET_TP.map(s => `${s.broker.replace(/ \(.*\)/, '')} (${shortDate(s.date)})`), 'GAM (base)'], series: [{ name: 'Target', values: [...STREET_TP.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes and summaries (Mar-Jul 2026), GAM Research' },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2b.industry, P2b.tailwind, P3.fd, P3.molecules, P3b.plants, P3b.growth, P4.moat, p.seasons, p.financials, P4.margins, P5.q1, P4.earnings, p.balance, P4b.capital, P4b.ownership(p.ownershipBase), P4b.governance, P5.forecasts, P5c.street, P5b.valuation, P6.risks, p.statements, P6b.glossary],
  statementNotes: P6b.statementNotes,
};
