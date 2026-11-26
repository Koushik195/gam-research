// OneSource Specialty Pharma report, part B: cover, the story in charts, and the merger of part2-6 (business, history,
// industry, tailwind test, DDC, base business, biologics, capacity, moat, margins, Q1FY27, earnings quality, capital,
// ownership, governance, forecasts, street, valuation, verdict, glossary, statement notes). Shared inputs in ONESOURCE.ctx.js.
const X = require('./ONESOURCE.ctx');
const { F, V, A, n0, n1, price, mv, EVM, EVH, kev, SECTOR_EV, rating, epsU, ebitdaSep, evNowFwd, evTrail, YRS, SQ, LINES, BL, Q1, C, D, ST, P, W, PEER_SET, shortName, shortDate, sEv2, buyBelow, FROM_TXT } = X;
const P2 = require('./ONESOURCE.part2'), P3 = require('./ONESOURCE.part3'), P4 = require('./ONESOURCE.part4'), P4b = require('./ONESOURCE.part4b');
const P5 = require('./ONESOURCE.part5'), P5b = require('./ONESOURCE.part5b'), P5c = require('./ONESOURCE.part5c'), P6 = require('./ONESOURCE.part6');

const cover = {
  headline: `India's GLP-1 fill-finish leader at the start of its ramp: on its own post-turnaround EV/EBITDA the target is {{dcf.tp|inr}}, a ${rating}, even with the ramp a year late`,
  lead: `OneSource Specialty Pharma is a Bengaluru contract manufacturer formed in 2024 from three Strides-group businesses: drug-device combinations (it fills and assembles generic GLP-1 pens and cartridges), biologics, sterile injectables and soft gelatin capsules. It fills all three generic semaglutide approvals in Canada and ~40% of India's generic pens, and is tripling its cartridge capacity by FY28. Q1FY27 revenue rose 37% to ₹449 cr after a loss-making FY26. We forecast EBITDA of ₹{{F.ebitda.0|num}} / {{F.ebitda.1|num}} / {{F.ebitda.2|num}} cr for FY27-29E, 15-40% below the street for FY27-28 because we assume the plan runs a year late. Three of the four brokers that disclose a method use **EV/EBITDA**, and so do we: OneSource's median forward EV/EBITDA since the Q4FY26 results (${n1(EVH.med)}x), adjusted ${X.pc1(SECTOR_EV)} for the pharma sector over the same window, gives **${EVM.base}x Sep-28E EBITDA of ₹${n0(ebitdaSep)} cr = {{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}**. Cross-checks: P/E ₹${n0(mv('pe').value)}; DCF ₹${n0(mv('dcf').value)}. Bull {{scen.bull.tp|inr}}; bear {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'A head start in the scarcest part of generic GLP-1s', p: 'Sterile fill-finish and pen assembly take ~2 years to build; OneSource built early, got its customers\' products filed on its site and reserved capacity with upfront fees and take-or-pay terms. Line 2 starts in Q2FY27, line 3 within FY27, a fourth in FY28: sterile days rise from 225 to 675.' },
    { h: 'The ramp has started, a year late', p: 'FY26 was guided at ~30% growth and fell 2% when Canadian approvals slipped; Q3FY26 EBITDA was ₹17 cr. Since then: India and Canada launches, Q1FY27 revenue +37%, EBITDA margin 27.5%. We assume FY28 revenue ~18% below the US$400m target and reach it only in FY29E.' },
    { h: 'Governance is the discount the multiple must carry', p: 'Strides-group companies are ~28% of revenue and several cost lines; 37% of the promoters\' 30.5% stake is pledged; the promoter group sold ~8 points after listing; a share-funded purchase of promoter-owned businesses was dropped only after minorities objected. A US$136m arbitration claim is unprovided.' },
    { h: 'A fair multiple, not a stretched one', p: `₹${n0(price)} is ${n1(evTrail)}x trailing but ${n1(evNowFwd)}x our FY28E EBITDA. We use the stock's own post-turnaround multiple with no sector lift; P/E and DCF agree within ~10%. The rule turns HOLD above ~₹${n0(buyBelow)}.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['EBITDA (₹ cr)', 'ebitda', 'num'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'RED' }, { k: 'Predictability', v: 'RED' }, { k: 'Earnings momentum', v: 'GREEN' }, { k: 'Competitive position', v: 'AMBER' },
    { k: 'Balance sheet', v: 'AMBER' }, { k: 'Governance', v: 'RED' }, { k: 'Valuation', v: 'AMBER' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): the first quarter with line 2 commercial, and the hit from the injectables shutdown.',
    "Dr Reddy's resumption of semaglutide supply (paused on 9-Jul-2026) and partner approvals in Brazil, MENA and Turkey through FY27.",
    'Line 3 installation by Mar-2027 and the Q4FY27 exit run-rate, which management says reflects FY28 guidance.',
    'USFDA outcome of the Jun-2026 inspection of the SPD sterile site; new biologics contracts and capacity plans.',
    'Prestige arbitration (SIAC) and any revival of the Steriscience acquisition (management: not before FY28 guidance is met).',
  ],
};

// ---------------------------------------------------------------- Story in charts
const STREET_TP = ST.filter(s => s.tp).slice().sort((a, c) => c.tp - a.tp);
const sortedSet = [...PEER_SET].sort((a, c) => W.ev[c].mv - W.ev[a].mv);
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: 'Quarterly revenue: the Q3FY26 hole and the recovery', unit: 'Revenue (₹ crore)', x: SQ.map(q => q.q), series: [{ name: 'Revenue', values: SQ.map(q => q.revenue), fmt: 'num' }], labels: 'all', highlight: 'Q1FY27', source: 'Company decks; Screener.in' },
      { type: 'line', title: 'EBITDA margin swings with approvals: 43% → 6% → 27.5%', unit: '% of revenue', x: SQ.map(q => q.q), series: [{ name: 'EBITDA margin', values: SQ.map(q => q.ebitdaMarginPct), fmt: 'pct' }], labels: 'all', min: 0, max: 50, source: 'Company decks; Screener.in' },
    ] },
    { pair: [
      { type: 'stacked', title: 'Our build: DDC & biologics drive the step-up', unit: 'Revenue (₹ crore); FY26 split = GAM estimate', x: ['FY26', ...YRS], series: [{ name: 'DDC & biologics', values: [BL.base.ddc, ...LINES.ddc.map(Math.round)], fmt: 'num' }, { name: 'Base business', values: [BL.base.core, ...LINES.core.map(Math.round)], fmt: 'num' }], minLabel: 300, source: 'Screener.in; GAM estimates (no segment disclosure)' },
      { type: 'hbar', title: 'Who pays: two customers 32%, Strides-group entities 28% of FY26 revenue', unit: 'Share of FY26 revenue (%)', x: ['Two customers above 10%', 'Related parties (Strides group)', 'India', 'United States'], series: [{ name: 'FY26', values: [C.topCustomers.FY26.pct, C.relatedRevenue.FY26pct, Math.round(C.geography.FY26.india / C.fy26.revenue * 1000) / 10, Math.round(C.geography.FY26.usa / C.fy26.revenue * 1000) / 10], fmt: 'pct' }], labels: 'all', source: 'AR FY26 notes 20.1, 32, 35 (categories overlap)' },
    ] },
    { pair: [
      { type: 'column', title: 'EBITDA: ₹304 cr (FY26) to ₹{{F.ebitda.2|num}} cr (FY29E); street higher', unit: 'EBITDA (₹ crore)', x: ['FY25', 'FY26', ...YRS, 'FY28E street (ICICI)'], series: [{ name: 'EBITDA', values: [A.ebitda[1], A.ebitda[2], ...F.ebitda, X.isec.ebitda.FY28E].map(Math.round), fmt: 'num' }], labels: 'all', highlight: 'FY28E', source: 'Screener.in; GAM; ICICI Securities (6-Sep-2026)' },
      { type: 'line', title: `Forward EV/EBITDA: ~31x on ramp-year FY27E, ${n1(EVH.med)}x on FY28E since 13-May-26`, unit: 'EV ÷ next full-year EBITDA (x)', x: sEv2.map(x => x[0]), series: [{ name: 'Forward EV/EBITDA', values: sEv2.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', min: 10, max: 40, lines: [{ v: EVM.base, text: `Target: ${EVM.base}x (median ${n1(EVH.med)}x × ${kev.toFixed(3)})`, color: '#cf8f1f' }], source: 'Screener.in weekly prices; company net debt; GAM estimates' },
    ] },
    { pair: [
      { type: 'hbar', title: `Pharma EV/EBITDA moved ${X.pc1(SECTOR_EV)} over OneSource's window`, unit: `EV/EBITDA at the 30-Sep-2026 close vs median since ${FROM_TXT} (%)`, x: [...sortedSet.map(shortName), 'OneSource (not in set)'], series: [{ name: 'vs median', values: [...sortedSet.map(s => Math.round(W.ev[s].mv * 10) / 10), Math.round(W.ev.ONESOURCE.mv * 10) / 10], fmt: 'pct' }], labels: 'all', highlight: 'OneSource (not in set)', source: 'Screener.in EV/EBITDA series; asof-peers.js; PLAYBOOK §7c peer set' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (notes standing on 30-Sep-26)', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...STREET_TP.map(s => `${s.broker} (${shortDate(s.date)})`), 'GAM (base)'], series: [{ name: 'Target', values: [...STREET_TP.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes and summaries (May-2025 to Sep-2026), GAM Research' },
    ] },
  ],
};

const valuation = { ...P5b.valuation, blocks: [...P5b.valuation.blocks, ...P5c.blocks] };
module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.ddc, P3.base, P3.biologics, P3.capacity, P4.moat, p.seasons, p.financials, P4.margins, P5.q1, P4.earnings, p.balance, P4.capital, P4b.ownership(p.ownershipBase), P4b.governance, P5.forecasts, P5.street, valuation, P6.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
