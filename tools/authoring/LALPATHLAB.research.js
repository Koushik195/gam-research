// Dr Lal PathLabs report, part B: cover, the story in charts, and the merger of part2-6 (business, history, industry,
// tailwind test, network & unit economics, regions, Suburban, bundles & specialised tests, competition & pricing, moat,
// Q1FY27, earnings quality, ownership, governance, forecasts, street, valuation, verdict, glossary, statement notes).
// Shared inputs in LALPATHLAB.ctx.js. Forecast and valuation figures are live tokens ({{...}}) that follow assumptions.json.
const X = require('./LALPATHLAB.ctx');
const { V, n0, n1, pc, SQ, QL, price, mv, MULT, HB, SECTOR, rating, ST, YRS, fwdNow, epsU, epsSep, epsBase, epsRep, sBase, dr5, PEER_SET, shortName, shortDate, medPost, SA } = X;
const P2 = require('./LALPATHLAB.part2'), P3 = require('./LALPATHLAB.part3'), P4 = require('./LALPATHLAB.part4'), P4b = require('./LALPATHLAB.part4b'), P5 = require('./LALPATHLAB.part5'), P5b = require('./LALPATHLAB.part5b'), P6 = require('./LALPATHLAB.part6');

const cover = {
  headline: `North India's diagnostics leader is growing faster again, with no debt and ₹1,700 cr of cash; but at ${n1(fwdNow)}x FY28E earnings the good news is in the price. On the street's P/E method we see {{dcf.upside|chg}}`,
  lead: `Dr Lal PathLabs is India's largest listed pathology chain: 312 labs, 7,727 collection centres and 30 mn patients a year, 75% of revenue from walk-in and home-collection patients, 31% from Delhi NCR and ~77% from North and East India. After three years of 10-12% growth, Q1FY27 revenue rose 19% (patients +8%, revenue per patient +10% incl. a CGHS rate revision) and EBITDA 29% (margin 31%); management now guides 'towards mid-teens' growth. We forecast EPS of ₹${n1(epsU[0])} / ${n1(epsU[1])} / ${n1(epsU[2])} for FY27-29E. Three of the four brokers that disclose a method use **P/E**, and so do we: **${MULT.base}x Sep-28E EPS (₹${n1(epsSep)})**, i.e. Dr Lal's ${n1(HB.med)}x median one-year-forward P/E since Apr-2021 (on EPS before exceptional items) adjusted ${SECTOR}% for the diagnostics peers' move against their own history, gives **{{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}.** Cross-checks: EV/EBITDA ₹${n0(mv('ev').value)}; DCF ₹${n0(mv('dcf').value)}. Bull {{scen.bull.tp|inr}}; bear {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'A strong regional franchise, not a national moat', p: 'Delhi NCR (31% of revenue, the highest-priced market) still grows double digit; North + East are ~77% of revenue. Brand, density and a hub-and-spoke network give the industry\'s best margin (~28% before the Q1 spike). Outside the North it has struggled: West slipped to 14% of revenue after the ₹925 cr Suburban deal; South is 6%.' },
    { h: 'Growth has re-accelerated, partly for one-off reasons', p: 'Revenue growth went 10.6% (Q3FY26) → 16.6% → 19.1% (Q1FY27) as new labs matured, Suburban recovered and SwasthFit bundles (27% of revenue) kept growing ~20%. But 2-3pp came from a government (CGHS/ECHS) rate revision that laps in a year, and Dr Lal has not raised list prices for three years. We model +{{F.salesGrowth.0|pct}} / +{{F.salesGrowth.1|pct}} / +{{F.salesGrowth.2|pct}}.' },
    { h: 'Clean balance sheet, cash looking for a use', p: 'No debt, ₹1,693 cr of cash at Jun-2026, negative working capital, capex of ₹140-150 cr a year and a ~45% payout. The cash is earmarked for M&A (SN Genelab ₹168 cr and Ghana ₹38 cr in Sep-2026). Suburban shows that buying growth outside the North is harder than it looks.' },
    { h: `Valuation: fair after a ${Math.round(X.M.price.returns['1y'])}% rise in a year`, p: `At ₹${n0(price)} the stock trades at ${n1(fwdNow)}x our FY28E EPS against a ${n1(HB.med)}x median since 2021. Our ${MULT.base}x gives {{dcf.tp|inr}}, a little above the post-Q1 street median (₹${n0(medPost)}), and ${pc(V.upside)} away: a HOLD on our rule. A 10% growth premium, or the EV/EBITDA analogue of the sector move, would make it a BUY; we explain why we use neither.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'GREEN' },
    { k: 'Predictability', v: 'GREEN' },
    { k: 'Earnings momentum', v: 'GREEN' },
    { k: 'Competitive position', v: 'AMBER' },
    { k: 'Balance sheet', v: 'GREEN' },
    { k: 'Governance', v: 'AMBER' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): whether patient growth holds near 8% through the fever season and the margin stays above 30% as the CGHS benefit is reinvested; any upgrade of the "towards mid-teens" growth guide.',
    'Pricing: management will decide after H1FY27 whether to take the first list-price increase in over three years.',
    'M&A: closing of SN Genelab (expected by 30-Nov-2026) and any larger platform deal in the South or West.',
    'Network: 12-15 new labs and 3-4 radiology centres in FY27; Suburban\'s return to double-digit growth.',
    'CGHS base effect from Q1FY28; competitive moves by aggregators and hospital labs.',
  ],
};

// ---------------------------------------------------------------- Story in charts
const STREET_TP = ST.filter(s => s.tp && s.date >= '2026-07-24');
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: 'Revenue: ₹798 cr in Q1FY27, +19%, the fastest in four years', unit: 'Revenue (₹ crore), quarterly', x: QL, series: [{ name: 'Revenue', values: SQ.map(q => q.consRev), fmt: 'num' }], labels: 'all', highlight: 'Q1FY27', source: 'Company results; Screener.in' },
      { type: 'hbar', title: 'Delhi NCR is 31%; North + East ~77%', unit: 'FY26 revenue by region (%)', x: ['Delhi NCR', 'UP & Uttarakhand', 'Rest of North', 'East', 'West', 'South', 'Others'], series: [{ name: 'FY26', values: [31, 19, 13, 15, 14, 6, 2], fmt: 'pct0' }], labels: 'all', highlight: 'Delhi NCR', source: 'AR FY26 MD&A p.127' },
    ] },
    { pair: [
      { type: 'line', title: 'Patients: growth back to 8% a quarter', unit: 'Patients (mn), quarterly', x: QL.slice(2), series: [{ name: 'Patients (mn)', values: SQ.slice(2).map(q => q.patientsMn), fmt: 'n1' }], labels: 'all', min: 6, max: 9, source: 'Company presentations and calls; Emkay (Q2FY26)' },
      { type: 'line', title: 'Revenue per patient: ₹861 → ₹968 in six quarters', unit: 'Revenue per patient (₹), quarterly', x: QL.slice(2), series: [{ name: 'Revenue per patient', values: SQ.slice(2).map(q => q.rpp), fmt: 'num' }], labels: 'all', min: 800, max: 1000, source: 'Company calls; Emkay (Q2FY26)' },
    ] },
    { pair: [
      { type: 'column', title: 'EPS: the COVID bump, the FY23 bust, and a steady climb since', unit: 'EPS (₹, bonus-adjusted); FY27-29E = GAM', x: ['FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26', ...YRS], series: [{ name: 'Reported / forecast', values: [epsRep[2021], epsRep[2022], epsRep[2023], epsRep[2024], epsRep[2025], epsRep[2026], ...epsU.map(v => Math.round(v * 10) / 10)], fmt: 'n1' }, { name: 'Before exceptional items', values: [null, null, null, null, Math.round(epsBase[2025] * 10) / 10, Math.round(epsBase[2026] * 10) / 10, null, null, null], fmt: 'n1' }], labels: 'all', source: 'Screener.in; AR FY26; GAM Research' },
      { type: 'line', title: `Forward P/E since 2021: ${n1(fwdNow)}x now vs a ${n1(HB.med)}x median`, unit: 'Price ÷ next full-year EPS before exceptional items (x)', x: sBase.map(x => x[0]), series: [{ name: 'Forward P/E', values: sBase.map(x => Math.min(x[1], 80)), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: MULT.base, text: `Target ${MULT.base}x (median ${n1(HB.med)}x)`, color: '#cf8f1f' }], source: 'Screener.in weekly prices; GAM (2021-22 points above 80x clipped)' },
    ] },
    { pair: [
      { type: 'hbar', title: `Diagnostics peers vs their own five-year P/E: median ${SECTOR}%`, unit: 'P/E at the 30-Sep-2026 close vs five-year median (%)', x: [...[...PEER_SET].sort((a, c) => dr5[c] - dr5[a]).map(shortName), 'Dr Lal PathLabs'], series: [{ name: 'vs median', values: [...[...PEER_SET].sort((a, c) => dr5[c] - dr5[a]).map(s => dr5[s]), dr5.LALPATHLAB], fmt: 'pct' }], labels: 'all', highlight: 'Dr Lal PathLabs', source: 'Screener.in P/E series; asof-peers.js; sector-factor.js' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs post-Q1 street targets', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...STREET_TP.map(s => `${s.broker} (${shortDate(s.date)})`), 'GAM (base)'], series: [{ name: 'Target', values: [...STREET_TP.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes and summaries (Jul-Sep 2026), GAM Research' },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.network, P3.regions, P3.suburban, P3.bundles, P3.competition, P3.moat, p.financials, P4.guidance, p.capital, P4.quality, p.balance, P4.ownership(p.ownershipBase), P4b.governance, P4b.forecasts, P5.street, P5b.valuation, P5.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
