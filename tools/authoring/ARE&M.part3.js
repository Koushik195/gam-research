// Amara Raja report, part 3: the lead-acid core (business-line build), the lithium-ion subsidiary ARACT (losses and how
// we value it, with the other subsidiaries), and the competitive-advantage scorecard.
const X = require('./ARE&M.ctx');
const { C, D, F, SQ, QL, BL, LINES, LN, bld, n0, n1, pc, shares, aract, otherVal } = X;
const E = C.aract, EB = BL.aract, ps = v => n0(v / shares);

const core = {
  id: 'core', nav: 'Lead-acid core', kicker: 'The core business', title: 'Lead-acid: ~15% growth in FY27E, ~9% after, with the margin rebuilding to ~12%',
  blocks: [
    { p: `We build revenue from three lines (Nuvama's FY26 split; the company reports no automotive/industrial split). Automotive is three-quarters of the business and has the strongest near-term growth (OEM boom now, replacement later, home energy); industrial grows slowly as UPS offsets telecom moving to lithium; lubes are small but growing. The build gives revenue of ₹${n0(F.sales[0])} / ${n0(F.sales[1])} / ${n0(F.sales[2])} cr for FY27-29E (+{{F.salesGrowth.0|pct0}}, +{{F.salesGrowth.1|pct0}}, +{{F.salesGrowth.2|pct0}}), against management's view of ~9-10% a year for lead-acid volumes. ${BL._why}` },
    { exhibit: { type: 'table', title: 'Business-line build (₹ crore)', head: ['Line', 'FY26', 'FY27E', 'FY28E', 'FY29E', 'Growth FY27E / 28E / 29E'], rows: [
      ...LINES.map(k => [LN[k], n0(BL.base[k]), ...bld.map(r => n0(r[k])), BL.growth[k].map(g => g + '%').join(' / ')]),
      { hl: true, cells: ['**Total = model revenue**', `**${n0(X.base26)}**`, ...bld.map(r => `**${n0(r.rev)}**`), bld.map((r, i) => pc((r.rev / (i ? bld[i - 1].rev : X.base26) - 1) * 100)).join(' / ')] },
    ], source: 'GAM Research; FY26 split from Nuvama (11-Aug-2026) and AR FY26 note 22' } },
    { pair: [
      { type: 'column', title: 'Quarterly revenue: Q1FY27 jumped to ₹4,041 cr', unit: 'Revenue (₹ crore), standalone', x: QL, series: [{ name: 'Revenue', values: SQ.map(q => q.sales), fmt: 'num' }], labels: 'all', source: 'Quarterly results (standalone)' },
      { type: 'line', title: 'Quarterly EBITDA margin: from 14% to 10%', unit: 'EBITDA margin (%)', x: QL, series: [{ name: 'EBITDA margin', values: SQ.map(q => q.marginPct), fmt: 'pct' }], labels: 'all', min: 8, max: 16, source: 'Screener.in (standalone)' },
    ] },
    { p: `**Margin.** ${X.CORE._marginWhy} Gross margin (after materials and traded goods) fell from 32.2% in FY25 to 30.9% in FY26 and ~28.5% in Q1FY27 (360 ONE; MOFSL: raw materials 71.5% of sales). Each 0.5 point of margin is ~₹${n1(F.sales[1] * 0.005 * (1 - X.TAX) / shares)} of FY28E EPS (~${Math.round(F.sales[1] * 0.005 * (1 - X.TAX) / F.pat[1] * 100)}%).` },
    { callout: '**So what:** the core is a reliable grower, not a margin story: ~9-15% revenue growth, an ~11-12% margin, capex of ~₹400-500 cr a year and EPS before one-offs rising from ₹42 (FY26) to ₹{{F.eps.2|n1}} (FY29E), helped by operating leverage and, once the ARACT funding stops, interest on rebuilt cash. Management\'s 13-14% margin would add ~15% to our FY29E EPS; we do not assume it.' },
  ],
};

const lithium = {
  id: 'lithium', nav: 'Lithium-ion (ARACT)', kicker: 'The lithium-ion bet', title: `ARACT: ₹1,900 cr invested, a pack business that sells and a cell plant still to come: worth ~₹${ps(aract.base.value)} a share to us`,
  blocks: [
    { p: `${E.plan} ${E.funding}` },
    { exhibit: { type: 'table', title: 'ARACT so far (₹ crore)', head: ['', 'FY23', 'FY24', 'FY25', 'FY26', 'Aug-26'], rows: [
      ['Equity from Amara Raja (cumulative, at cost)', '100', '400', '850', '1,500', '1,900'],
      ['Book equity (net worth)', '99', '416', '854', '1,431', '~1,816 (GAM)'],
      ['Revenue (packs, chargers; mostly imported cells)', '–', '440', '506', '787', '₹209 cr New Energy revenue in Q1FY27'],
      ['Profit / (loss) after tax', '(1)', '17', '(12)', '(73)', '~(12) group drag in Q1FY27'],
    ], source: 'Form AOC-1 in AR FY23, FY24, FY25, FY26; Q1FY27 deck and call; Q1FY27 = consolidated less standalone profit (all subsidiaries)' } },
    { p: `**Why losses rise before they fall.** The pack business roughly breaks even; the losses come from cell R&D (₹100-150 cr in FY27), the customer-qualification plant, and from FY28E the 2 GWh NMC line, whose depreciation arrives before customers have approved the cells (EV makers test for a long time; storage buyers faster). Indian cells cost 15-20% more than Chinese ones, the Gotion technology tie-up did not happen, and cathode materials still come from China. The BESS plant is cheap (₹250-300 cr for 10 GWh) and could fill quickly, but on imported cells it earns 5-8% operating margins. ${E.returns} Our loss path is a GAM estimate (no company guidance; brokers publish only valuations): ${EB.loss.base.join(' / ')} cr in FY27-30E, breakeven in FY30E.` },
    { exhibit: { type: 'table', title: 'How we value ARACT and the other subsidiaries (₹ crore unless stated)', head: ['', 'Bull', 'Base', 'Bear'], rows: [
      ['ARACT losses FY27E / FY28E / FY29E / FY30E', ...['bull', 'base', 'bear'].map(c => EB.loss[c].join(' / '))],
      [`Book equity at Sep-27E (Mar-26 ₹1,431 cr + ₹${n0(EB.infusion[0])} cr FY27 infusion − losses)`, ...['bull', 'base', 'bear'].map(c => n0(aract[c].book))],
      ['× multiple of book', ...['bull', 'base', 'bear'].map(c => aract[c].mult + 'x')],
      [`Less: PV of losses after Sep-27E, to breakeven (${EB.pvRate}%)`, ...['bull', 'base', 'bear'].map(c => '(' + n0(aract[c].pv) + ')')],
      { hl: true, cells: ['**ARACT value**', ...['bull', 'base', 'bear'].map(c => `**${n0(aract[c].value)}**`)] },
      ['Per Amara Raja share (₹)', ...['bull', 'base', 'bear'].map(c => ps(aract[c].value))],
      ['Other subsidiaries at book (ARCSPL ₹615 cr, ARPSL ₹71 cr, ARBME ₹9 cr)', n0(otherVal), n0(otherVal), n0(otherVal)],
      ['Street on New Energy, ₹ per share: MOFSL (investment) / ICICI Direct (0.8x CWIP) / Avendus (DCF) / Anand Rathi (NPV incl. BESS) / Nuvama (2x P/B)', '', '92 / 130 / 120 / 356 / 306', ''],
    ], source: 'GAM Research (PLAYBOOK §7c: start-up losses valued as the present value of losses to breakeven); AR FY26 Form AOC-1; broker notes May-Aug 2026' } },
    { callout: `**Our view:** ARACT is a real option with a better start than most (₹787 cr of pack revenue, >60% of telecom with lead-acid, a cheap BESS line), but the cell plant is late, has no technology partner and no cost edge over China. We value it at what has been put in, net of the losses still to come: ₹${ps(aract.base.value)} a share, close to MOFSL, ICICI Direct and Avendus (₹92-130) and far below Nuvama and Anand Rathi (₹306-356), who already pay for BESS profits and a cell ramp. The bull case adds ~₹${n0((aract.bull.value - aract.base.value) / shares)}; half of book (bear) costs ~₹${n0((aract.base.value - aract.bear.value) / shares)}. Cell capacity beyond the first 2 GWh is not in our numbers.` },
  ],
};

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: a strong number-two franchise, but no pricing power and no edge in lithium cells',
  blocks: [
    { verdicts: [
      ['Brand and distribution', 'Strong', D.moat.brand, 'The replacement buyer chooses by brand and availability; Amaron is one of two national brands.'],
      ['Scale and recycling', 'Moderate', D.moat.scale, 'Captive recycling secures lead and EPR compliance but adds no cost edge while scrap is dear.'],
      ['OEM and telecom relationships', 'Strong', D.moat.oem, 'Sticky and growing, but OEM and telecom business is priced on lead formulas with thin margins.'],
      ['Pricing power', 'Weak', D.moat.pricing, 'A duopoly that competes; costs are passed on late, not marked up.'],
      ['Technology (lithium-ion cells)', 'Weak', 'Own NMC cell (2170) from earlier technology access, no current partner; cathode from China; cells 15-20% dearer than imports; not in the ACC PLI scheme so far.', 'No advantage yet; the edge is customers (telecom, 3W) and the pack business.'],
    ], head: ['Source', 'Verdict', 'Evidence', 'So what'], title: 'Competitive advantage scorecard', source: 'AR FY26; Q4FY26 and Q1FY27 calls and deck; Screener.in' },
    { callout: '**Verdict:** a narrow moat in lead-acid (brand, distribution, OEM and telecom relationships) shared with one rival, which keeps returns on operating capital in the high teens (~18% excluding investments in FY26, company) but margins ordinary. In lithium there is no moat today; Amara Raja has customers, not cost or technology leadership.' },
  ],
};

module.exports = { core, lithium, moat };
