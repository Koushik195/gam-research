// Neuland Laboratories report, part B: cover, the story in charts, and the merger of part2-6 (business, history & corporate
// actions, industry, tailwind test, CMS, generic APIs, plants & capacity, moat, margins, earnings quality, capital & returns,
// ownership, governance, Q1FY27, forecasts, street, valuation, verdict, glossary, statement notes). Shared inputs in
// NEULANDLAB.ctx.js / ctx2.js. Forecast and valuation figures are live tokens ({{...}}) that follow assumptions.json.
const X = require('./NEULANDLAB.ctx2');
const { V, n0, n1, price, mv, MULT, HB, k, SECTOR, rating, epsU, epsSep28, fwdNow, trailPe, YRS, SA, SQ, LINES, gdsTot, ST, MW, PEER_SET, shortName, shortDate, sPe, gNeeded, cmsShare26, implPeAtPrice, medTp, ownMv, SENS } = X;
const brk = SENS.find(r => /earnings break/.test(r.name));
const P2 = require('./NEULANDLAB.part2'), P3 = require('./NEULANDLAB.part3'), P4 = require('./NEULANDLAB.part4'), P5 = require('./NEULANDLAB.part5'), P5b = require('./NEULANDLAB.part5b'), P6 = require('./NEULANDLAB.part6');

const cover = {
  headline: `A few innovator molecules doubled Neuland's contract-manufacturing business; the market pays ~${Math.round(implPeAtPrice)}x Sep-28E EPS for it, our rule gives ${MULT.base}x: target {{dcf.tp|inr}}, ${rating}`,
  lead: `Neuland Laboratories makes active pharmaceutical ingredients (APIs) in Hyderabad: generic APIs for drug makers (Prime and Specialty, 34% of FY26 revenue) and, under exclusive contracts, APIs for innovators' new drugs (Custom Manufacturing Solutions, CMS, ${Math.round(cmsShare26)}%). FY26 revenue rose 37% to ₹2,023 cr and EPS to ₹284 as CMS nearly doubled to ₹1,244 cr; Q1FY27 revenue rose 119%. "About 3" commercial molecules drive CMS, and three customer groups were 54% of FY26 revenue. We forecast EPS of ₹${n1(epsU[0])} / ${n1(epsU[1])} / ${n1(epsU[2])} for FY27-29E. Most brokers that disclose a method use **P/E**, and so do we: Neuland's median one-year-forward P/E since Apr-2021 (${n1(HB.med)}x, FY25 before a property gain), lifted ${SECTOR}% for the pharma sector's re-rating, gives **${MULT.base}x Sep-28E EPS of ₹${n1(epsSep28)} = {{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}**. Starting the window at the FY23 earnings break gives ${brk.mult}x (₹${n0(brk.tp)}), still a ${rating}. Cross-checks: EV/EBITDA ₹${n0(mv('ev').value)}; DCF ₹${n0(mv('dcf').value)}. Bull {{scen.bull.tp|inr}}; bear {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'A real CDMO franchise', p: 'CMS revenue went from ₹282 cr (FY22) to ₹1,244 cr (FY26) as molecules Neuland supplied in clinical trials were approved: 99 active projects, 19 commercial, 4 NDAs supported. Forty years of complex chemistry, three USFDA-inspected plants with no warning letter ever, and net cash of ₹309 cr (Jun-2026).' },
    { h: 'But it rests on a handful of molecules', p: 'Three customer groups were 54% of FY26 revenue (34% in FY25); the top five CMS products are 94% of CMS. Quarterly margins swung from 12% to 40% in FY26, FY25 revenue fell 5%, and the generic API base shrank from ₹717 cr (FY24) to ₹688 cr (FY26).' },
    { h: 'Capex is rising and returns will dip', p: '₹1,460 cr of projects approved in 13 quarters (peptides, R&D centre, Unit 1 expansion), with "much higher" capex to come and possibly overseas deals; peptide revenue only from FY28. Free cash flow was −₹49 cr in FY26 and is ~nil in our FY27E; management itself expects ROCE to fall.' },
    { h: 'The price assumes the step-up repeats', p: `₹${n0(price)} is ${n1(trailPe)}x trailing EPS and ${n1(fwdNow)}x our FY28E (~${Math.round(implPeAtPrice)}x Sep-28E). Neuland's own forward P/E since Apr-2021 has a median of ${n1(HB.med)}x because the market twice failed to foresee its earnings jumps; the DCF needs ~${Math.round(gNeeded)}% growth for 15 years. The latest broker targets cluster around ₹19,550-25,819 (median ₹${n0(medTp)}).` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'RED' },
    { k: 'Earnings momentum', v: 'GREEN' },
    { k: 'Competitive position', v: 'AMBER' },
    { k: 'Balance sheet', v: 'GREEN' },
    { k: 'Governance', v: 'AMBER' },
    { k: 'Valuation', v: 'RED' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): after a +119% Q1, watch whether Q2-Q4 hold the ~₹1,790 cr our FY27 needs; lumpiness cuts both ways.',
    'Peptide plant (Module 1): validation from Sep-2026, first customer programmes, then a USFDA inspection; CRISIL expects peptide revenue from FY28.',
    'CMS pipeline: one more commercialisation expected in FY27 and one or two in FY28 (13 projects in phase 3, 7 at pre-registration).',
    'USFDA: closure of the Aug-2026 Unit III inspection (one procedural observation).',
    'Customer events: the brands brokers link to Neuland (BMS\'s Cobenfy, Esperion\'s bempedoic acid, Teva\'s Austedo) and sponsor M&A (an ArchiMed bid for Esperion in May-2026).',
    'Capital allocation: new land and sites, possible overseas investment or M&A for new modalities; the board was asked to consider a stock split.',
  ],
};

// ---------------------------------------------------------------- Story in charts
const STREET_TP = ST.filter(s => s.tp && !/older/.test(s.broker)).slice().sort((a, c) => c.tp - a.tp);
const CMSY = ['FY22', 'FY23', 'FY24', 'FY25', 'FY26'], CMSV = X.C.cms.revenue;
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'stacked', title: 'CMS went from 30% to 61% of revenue in four years', unit: 'Revenue (₹ crore)', x: [...SA.map(s => s.fy), ...YRS], series: [{ name: 'CMS (contract manufacturing)', values: [...SA.map(s => s.cms), ...LINES.cms.map(Math.round)], fmt: 'num' }, { name: 'Generic APIs (Prime + Specialty)', values: [...SA.map(s => Math.round(s.gds)), ...gdsTot.map(Math.round)], fmt: 'num' }, { name: 'Others', values: [...SA.map(s => Math.round(s.others)), ...LINES.others.map(Math.round)], fmt: 'num' }], minLabel: 150, source: 'Company decks (FY22-26; Prime/Specialty from disclosed shares); GAM estimates FY27-29E' },
      { type: 'stacked', title: 'CMS growth is commercial molecules, not development work', unit: 'CMS revenue (₹ crore)', x: CMSY, series: [{ name: 'Commercial', values: CMSY.map(y => CMSV[y][0]), fmt: 'num' }, { name: 'Development (incl. launch quantities)', values: CMSY.map(y => CMSV[y][1]), fmt: 'num' }], minLabel: 60, source: 'Company decks (Q4FY23, Q4FY25, Q4FY26)' },
    ] },
    { pair: [
      { type: 'line', title: 'Quarterly CMS share: 35% (Q4FY25) to 68% (Q4FY26)', unit: 'CMS share of revenue (%)', x: SQ.map(q => q.q), series: [{ name: 'CMS share', values: SQ.map(q => q.cmsPct), fmt: 'pct0' }], labels: 'all', min: 0, max: 80, source: 'Company decks; Screener.in revenue' },
      { type: 'column', title: 'Top-5 customers: 44% of revenue (FY23) to 70% (Q1FY27)', unit: 'Share of revenue (%)', x: ['FY23', 'FY25', 'FY26', 'Q1FY27'], series: [{ name: 'Top 5 customers', values: [44, 52, 64, 70], fmt: 'pct0' }, { name: 'Top 10 customers', values: [55, 64, 73, 77], fmt: 'pct0' }], labels: 'all', source: 'Company decks (Key Operating Metrics)' },
    ] },
    { pair: [
      { type: 'column', title: `EPS: ₹62.9 (FY21) to ₹${n1(epsU[2])} (FY29E)`, unit: 'EPS (₹); FY27-29E = GAM', x: ['FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26', ...YRS], series: [{ name: 'EPS', values: [X.epsRep[2021], X.epsRep[2022], X.epsRep[2023], X.epsRep[2024], X.epsRep[2025], X.epsRep[2026], ...epsU.map(v => Math.round(v * 10) / 10)], fmt: 'n1' }], labels: 'all', source: 'Screener.in; GAM Research (FY25 incl. the property gain)' },
      { type: 'line', title: `Forward P/E since Apr-2021: median ${n1(HB.med)}x, target ${MULT.base}x, today ~${Math.round(fwdNow)}x`, unit: 'Price ÷ next full-year EPS (x)', x: sPe.map(x => x[0]), series: [{ name: 'Forward P/E', values: sPe.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, min: 0, max: 70, lines: [{ v: HB.med, text: `Median ${n1(HB.med)}x` }, { v: MULT.base, text: `Target: ${MULT.base}x (× ${k.toFixed(3)})`, color: '#cf8f1f' }], source: 'Screener.in weekly prices; FY25 EPS before the property gain; GAM estimates FY27-28E' },
    ] },
    { pair: [
      { type: 'hbar', title: `Pharma trades +${SECTOR}% above its five-year medians; Neuland +${Math.round(ownMv)}%`, unit: 'Trailing P/E at the 30-Sep-2026 close vs five-year median (%)', x: [...[...PEER_SET].sort((a, c) => MW[c].mv - MW[a].mv).map(shortName), 'Neuland (not in set)'], series: [{ name: 'vs median', values: [...[...PEER_SET].sort((a, c) => MW[c].mv - MW[a].mv).map(s => Math.round(MW[s].mv * 10) / 10), Math.round(ownMv * 10) / 10], fmt: 'pct' }], labels: 'all', highlight: 'Neuland (not in set)', source: 'Screener.in P/E series; asof-peers.js; PLAYBOOK §7c peer set' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (latest notes found)', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...STREET_TP.map(s => `${s.broker.replace(/ \(.*\)/, '').replace('Institutional Equities', '')} (${shortDate(s.date)})`), 'GAM (base)'], series: [{ name: 'Target', values: [...STREET_TP.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes and news summaries (Dec-2025 to Aug-2026); GAM Research' },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.cms, P3.gds, P3.capacity, P4.moat, p.seasons, p.financials, P4.margins, P5.q1, P4.earnings, p.balance, P4.capital, P4.ownership(p.ownershipBase), P4.governance, P5.forecasts, P5.street, P5b.valuation, P6.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
