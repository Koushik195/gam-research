// TMPV report, part 3: JLR (GBP x FX build), India PV + EV (units x realisation build) and the moat.
const X = require('./TMPV.ctx');
const { C, D, SQ, QL, A26, A25, F, AS, jlrB, pvB, n0, n1, pc1, rup, seg, MULT, jlrSep, pvSep, V } = X;
const Q = C.q1fy27;
const jm = i => seg('jlr').adjEbitda[i] / seg('jlr').revenue[i] * 100, pm = i => seg('pv').adjEbitda[i] / seg('pv').revenue[i] * 100;

const jlr = {
  id: 'jlr', nav: 'Jaguar Land Rover', kicker: 'Segment: JLR (81% of revenue)', title: 'JLR: three great nameplates, a lost FY26 and a launch-heavy recovery that has not started yet',
  blocks: [
    { p: `JLR earned an 8.5% EBIT margin in FY24 and FY25 on GBP29bn of revenue. FY26 broke that: US tariffs, China's luxury tax and rising discounts had already cut Q1FY26 EBIT to 4.0% before the cyber attack shut production for September; FY26 ended with revenue of GBP22.9bn (−21%), EBIT 0.7% and free cash flow of −GBP2.2bn. Q4FY26 (9.2% EBIT) showed the business works at full production. Q1FY27 was weak again: wholesales ${n0(Q.jlr.wholesales)} (−9%), revenue GBP${n1(Q.jlr.revenueGbp / 1000)}bn, EBIT ${Q.jlr.ebitPct}%, PBT GBP${Q.jlr.pbtGbp}m and FCF −GBP${n1(-Q.jlr.fcfGbp / 1000)}bn, hit by a supplier fire, the Middle East, China (−25%) and discounts at 7.1% of revenue.` },
    { pair: [
      { type: 'column', title: 'JLR quarterly revenue: the cyber-attack hole in Q2-Q3FY26', unit: 'JLR revenue (GBP m, IFRS)', x: QL, series: [{ name: 'Revenue', values: SQ.map(q => q.jlrRevGbp), fmt: 'num' }], labels: 'all', source: 'Company presentations' },
      { type: 'line', title: 'JLR EBIT margin: 10.7% in Q4FY25, 2.8% in Q1FY27', unit: 'Adjusted EBIT margin (%, IFRS)', x: QL, series: [{ name: 'EBIT margin', values: SQ.map(q => Math.round(q.jlrEbitGbp / q.jlrRevGbp * 1000) / 10), fmt: 'pct' }], labels: 'all', min: -10, max: 12, source: 'Company presentations' },
    ] },
    { exhibit: { type: 'table', title: 'Our JLR build', head: ['', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Revenue (GBP m)', n0(A25.jlrRevGbp), n0(A26.jlrRevGbp), ...jlrB.map(r => n0(r.gbp))],
      ['  growth', '0%', '−20.9%', ...jlrB.map(r => pc1(r.gbpG))],
      ['INR per GBP (segment revenue ÷ GBP revenue)', n1(A25.jlrRev / A25.jlrRevGbp * 10), n1(A26.jlrRev / A26.jlrRevGbp * 10), ...jlrB.map(r => n1(r.fx))],
      { hl: true, cells: ['**Revenue (₹ crore, Ind AS)**', `**${n0(A25.jlrRev)}**`, `**${n0(A26.jlrRev)}**`, ...jlrB.map(r => `**${n0(r.model)}**`)] },
      ['EBITDA margin (company definition)', n1(A25.jlrEbitda / A25.jlrRev * 100) + '%', n1(A26.jlrEbitda / A26.jlrRev * 100) + '%', ...[0, 1, 2].map(i => n1(jm(i)) + '%')],
      ['EBITDA (₹ crore)', n0(A25.jlrEbitda), n0(A26.jlrEbitda), ...seg('jlr').adjEbitda.map(n0)],
      ['Memo: EBIT margin implied (D&A ~5.3% of revenue)', '8.5%', '0.7%', ...[0, 1, 2].map(i => n1(jm(i) - 5.3) + '%')],
    ], source: 'Company presentations; GAM estimates (assumptions.json jlrBuild); the model and the build agree within 0.3%' } },
    { bullets: [
      `**FY27 guidance (17-Jun-2026):** revenue ~GBP26bn, EBIT c.4%, investment GBP3.7bn, FCF breakeven. We are below it: GBP25.5bn and ~3.5% EBIT, because Q1 delivered 2.8% and management says China "is most probably going to get a little bit worse before it stabilizes".`,
      '**What should lift FY28:** Range Rover Electric (production from Sep-2026), Range Rover Sport Electric, Range Rover GT (first EMA car) and Jaguar Type 01 (early 2027); management targets ASP "well north of GBP80,000" within ~18 months and ~12,000 EVs in FY27. Plus GBP1.7bn of savings over two years to bring breakeven back to ~300k units.',
      '**What could stop it:** VME (discounts) stuck at 7%; warranty costs "stubbornly high"; China luxury tax; US tariffs within a quota; launch execution (Range Rover Electric deliveries were already pushed into 2026, per Jul-2025 press reports). Ratings at the investment-grade border, on negative watch.',
    ] },
    { callout: `**How we value it:** ${MULT.jlr.base}x Sep-28E EBITDA of ₹${n0(jlrSep)} cr = ₹${n0(jlrSep * MULT.jlr.base)} cr, ₹${n0(jlrSep * MULT.jlr.base / X.shares)} a share. The multiple is what TMPV's own share price has implied for JLR since the demerger (median ${n1(X.jlrMed)}x, after valuing India PV like Maruti), cut by the auto-sector de-rating. The street uses 1-2x EV/EBITDA (Emkay 1x, ICICI Securities 1.5x, Motilal Oswal and Nuvama 2x) or 3x EV/EBIT (JM). Low, but JLR spends ~12% of revenue on investment, so EBITDA overstates the cash it makes.` },
  ],
};

const pv = {
  id: 'pv', nav: 'India PV & EV', kicker: 'Segment: Tata Passenger Vehicles', title: 'India PV: share gains and EV leadership, but a 4-7% EBITDA margin',
  blocks: [
    { p: `Tata's Indian car business sold ${n0(A26.pvUnits)} cars in FY26 (+15%, twice the industry) and ${n0(Q.pv.wholesales)} in Q1FY27 (+46%), reaching #2 on registrations with ${Q.pv.vahanSharePct}% share. Electric cars were ~20% of Q1FY27 sales (24% in July), and Tata holds ~40% of India's EV market. Revenue per car rose ~8% to ₹9.8 lakh in Q1FY27 on EV and Sierra mix. Profit has not followed: EBITDA ${Q.pv.ebitdaPct}% in Q1FY27 including ₹${Q.pv.pli} cr of PLI incentives, because commodity inflation (4.5% of revenue) wiped out a 2% cost reduction and only 1% of price increases stuck. Management targets 8% EBITDA by FY29 and 10% by FY31 after PLI ends; 1.2 mn+ cars by FY31.` },
    { pair: [
      { type: 'column', title: 'India PV volumes: 1.25 lakh in Q1FY26, 2 lakh in Q4FY26', unit: 'Wholesales incl. exports (units)', x: QL.slice(2), series: [{ name: 'Units', values: SQ.slice(2).map(q => q.pvUnits), fmt: 'num' }], labels: 'all', source: 'Company presentations' },
      { type: 'line', title: 'India PV EBITDA margin incl. PLI: 9.4% in Q4FY26, 4.3% in Q1FY27', unit: 'EBITDA margin (%)', x: QL, series: [{ name: 'EBITDA margin', values: SQ.map(q => Math.round(q.pvEbitda / q.pvRev * 1000) / 10), fmt: 'pct' }], labels: 'all', min: 0, max: 10, source: 'Company presentations' },
    ] },
    { exhibit: { type: 'table', title: 'Our India PV build', head: ['', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Wholesales incl. exports', n0(A25.pvUnits), n0(A26.pvUnits), ...pvB.map(r => n0(r.units))],
      ['Revenue per car (₹)', n0(A25.pvRev * 1e7 / A25.pvUnits), n0(A26.pvRev * 1e7 / A26.pvUnits), ...pvB.map(r => n0(r.real))],
      { hl: true, cells: ['**Revenue (₹ crore)**', `**${n0(A25.pvRev)}**`, `**${n0(A26.pvRev)}**`, ...pvB.map(r => `**${n0(r.model)}**`)] },
      ['EBITDA margin incl. PLI', n1(A25.pvEbitda / A25.pvRev * 100) + '%', n1(A26.pvEbitda / A26.pvRev * 100) + '%', ...[0, 1, 2].map(i => n1(pm(i)) + '%')],
      ['  of which PLI (GAM estimate from FY27E)', '0.7%', '1.8%', '~2.2%', '~2.3%', '0% (scheme ends)'],
      ['EBITDA (₹ crore)', n0(A25.pvEbitda), n0(A26.pvEbitda), ...seg('pv').adjEbitda.map(n0)],
    ], source: 'Company presentations; GAM estimates (assumptions.json pvBuild). Management: FY29 revenue ₹115K cr+, EBITDA 8%.' } },
    { callout: `**How we value it:** ${MULT.pv.base}x Sep-28E EBITDA of ₹${n0(pvSep)} cr = ₹${n0(pvSep * MULT.pv.base)} cr, ₹${n0(pvSep * MULT.pv.base / X.shares)} a share: Maruti Suzuki's forward EV/EBITDA median since 2021 (${n1(X.marMed)}x) cut by the sector de-rating. The street uses 11-14x (Nuvama and JM 11x, Motilal Oswal 13x, ICICI Securities 14x). Applying Maruti's multiple to a business with half Maruti's margin is generous; the PLI-free FY29E EBITDA is lower than FY28E in our numbers, which the Sep-28E blend captures.` },
  ],
};

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: real brand power at JLR, little cost advantage anywhere',
  blocks: [
    { verdicts: D.moat.map(r => r.map(rup)), head: ['Dimension', 'Verdict', 'Evidence', 'So what'], title: 'Moat scorecard', source: 'GAM research compilation (company filings, calls and Investor Days to Aug-2026)' },
    { callout: '**Honest verdict:** JLR has a genuine but narrow moat: Range Rover and Defender command luxury prices and hold their value better than rivals. It does not have scale, and its returns depend on a small number of models. Tata\'s Indian car business has no moat yet: it wins share with good products and EVs, but earns half Maruti\'s margin and relied on PLI incentives for a quarter of its FY26 EBITDA. **There is brand power here, not a cost or scale moat.**' },
  ],
};

module.exports = { jlr, pv, moat };
