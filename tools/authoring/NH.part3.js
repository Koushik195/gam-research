// Narayana Hrudayalaya report, part 3: India hospitals (beds x occupancy x ARPOB, margins, projects), Cayman, UK,
// insurance & clinics, moat.
const X = require('./NH.ctx');
const { C, D, F, A, AS, n0, n1, pc, rup, SRC, SQ, QL, Q1, FY26, YRS, BL, FX, indHospCo, occPct, segE, segR, ann } = X;
const AK = C.annualKpis, PJ = C.projects, sq = SQ;

const india = {
  id: 'india', nav: 'India hospitals', kicker: 'Segment: India hospitals', title: 'India hospitals: revenue = occupied beds × ARPOB, and for three years only ARPOB grew',
  blocks: [
    { p: `Narayana reports ARPOB as revenue per occupied bed per year (₹${n1(Q1.indiaHospitals.arpobMn)} mn in Q1FY27, ~₹52,600 a day) but does not report occupancy ("we typically operate between 60% and 65%", on a bed base it does not disclose). Dividing India hospital revenue by ARPOB gives the number of beds filled on an average day: ~2,774 in FY24, ~2,708 in FY25, ~2,648 in FY26 and ~2,712 in Q1FY27, on ~5,450 operational beds (~50%). So all of FY24-26 growth came from price and case mix: ARPOB +13% in FY25 and FY26, helped by shorter stays (4.3-4.4 days, target 3.9-4.0), robotics, TAVIs, transplants and fewer low-paying international and scheme patients. Q1FY27 was the first quarter of volume growth (IP +8%, OP +9%).` },
    { pair: [
      { type: 'line', title: 'Quarterly ARPOB: +9% YoY in Q1FY27', unit: 'India ARPOB (₹ mn per occupied bed a year)', x: QL, series: [{ name: 'ARPOB', ref: 'R.segments.quarterly[].arpobIndiaMn', fmt: 'n1' }], labels: 'all', source: 'Company presentations' },
      { type: 'column', title: 'India hospital EBITDA: +56% in two years, no new beds', unit: 'India hospital EBITDA, company basis (₹ crore), quarterly', x: QL, series: [{ name: 'EBITDA', ref: 'R.segments.quarterly[].indHospEbitdaCo', fmt: 'num' }], labels: 'all', source: 'Company presentations' },
    ] },
    { exhibit: { type: 'table', title: 'The India revenue build (company basis; ₹ crore)', head: ['', 'FY24', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Operational beds (average)', '–', '–', '~5,450', ...BL.india.opBedsAvg.map(n0)],
      ['Occupied beds', '~2,774', '~2,708', '~2,648', ...BL.india.occupiedBeds.map(n0)],
      ['  implied occupancy of operational beds', '–', '–', '~49%', ...occPct.map(v => `${n1(v)}%`)],
      ['ARPOB (₹ mn a year)', '14.0', '15.9', '17.9', ...BL.india.arpobMn.map(n1)],
      { hl: true, cells: ['**India hospital revenue**', '3,883', '4,305', '4,740', ...indHospCo.map(v => `**${n0(v)}**`)] },
      ['Less: income eliminated on consolidation (PL split)', '–', '23', '69', ...BL.india.intercoCr.map(n0)],
      { hl: true, cells: ['**Model segment revenue**', '–', '{{R.segments.annual.2.indRev|num}}', '{{R.segments.annual.3.indRev|num}}', '{{F.seg.ind.revenue.0|num}}', '{{F.seg.ind.revenue.1|num}}', '{{F.seg.ind.revenue.2|num}}'] },
    ], source: 'Company KPIs; PL Q1FY27 note; GAM estimates (assumptions.json businessLines; NH.ctx.js checks the build equals model revenue). FY24 revenue = EBITDA ₹773 cr ÷ 19.9%.' } },
    { pair: [
      { type: 'hbar', title: 'Bengaluru earns the most per patient', unit: 'IP revenue per patient, Q1FY27 (₹ \'000)', x: C.business.clustersQ1FY27.map(c => c.cluster.split(' (')[0]), series: [{ name: 'IP ARPP', values: C.business.clustersQ1FY27.map(c => c.ipArppK), fmt: 'num' }], labels: 'all', highlight: 'Bengaluru', source: 'Q1FY27 presentation p. 10' },
      { type: 'column', title: 'India capacity to rise ~34% by FY30, at ₹1.8-2.6 cr per owned bed', unit: 'India capacity beds at the end of each year, by project completion year', x: ['Jun-26', 'FY27', 'FY28', 'FY29', 'FY30', 'FY30 + pipeline'], series: [{ name: 'Beds', values: [5775, 5875, 6390, 6960, 7310, 7710], fmt: 'num' }], labels: 'all', highlight: 'Jun-26', min: 5000, source: 'Q1FY27 presentation p. 15 (completion years as of Aug-2026; 400-bed pipeline unnamed)' },
    ] },
    { exhibit: { type: 'table', title: 'The India bed pipeline', head: ['Project', 'Type', 'Beds', 'Cost (₹ cr)', 'Cost per bed (₹ cr)', 'Completion', 'Status (Aug-2026)'], wide: [6], rows: PJ.map(p => [p.name, p.type, n0(p.beds), n0(p.costCr), (p.costCr / p.beds).toFixed(2), p.completion, p.status]), source: rup(C.projectsSrc) + '. Existing network: ~₹0.75 cr per operational bed (Q4FY26 deck).' } },
    { callout: `**Margins:** India hospital EBITDA margin (company basis) rose from 18.2% (FY23) to 23.1% (FY26) and 24.8% in Q1FY27, on operating leverage (no new beds) and case mix; rent is ~2% of revenue. On PL's split, which strips out ~₹66-79 cr a year of income eliminated on consolidation, the margin was 21.8% in FY26 and 23.2% in Q1FY27. We hold it at {{as.segments.0.marginPct.0|pct}} / {{as.segments.0.marginPct.1|pct}} / {{as.segments.0.marginPct.2|pct}} for FY27-29E: core expansion continues but South-West Bengaluru (FY27), HSR and Raipur (FY28) start with losses. India EBITDA {{F.seg.ind.adjEbitda.0|num}} / {{F.seg.ind.adjEbitda.1|num}} / {{F.seg.ind.adjEbitda.2|num}} cr.` },
  ],
};

const cay = ann('FY26');
const cayman = {
  id: 'cayman', nav: 'Cayman Islands', kicker: 'Segment: Cayman Islands', title: 'Cayman: a 40%+ margin US-dollar hospital whose growth is slowing, plus an insurer still losing money',
  blocks: [
    { p: `Health City Cayman Islands is Narayana's highest-margin asset: two hospitals and 164 beds selling high-end care in US dollars, with no local corporate tax. Hospital revenue grew from US$110 mn (FY23) to US$179 mn (FY26) as Health City Camana Bay opened and the group's own insurer (CIHL) began steering members to it. The company does not report Cayman EBITDA; on PL's split the hospitals earned ₹${n0(cay.cayEbitda)} cr in FY26 (45.6% margin; ~39% if the income eliminated from the India figure is left in India) and US$18 mn in Q1FY27 (41%). Growth has slowed: Q1FY27 hospital revenue +5% YoY in dollars (seasonal Q1, US holidays), and management says double-digit growth is "not physically possible" to sustain and no new Cayman capex is planned.` },
    { pair: [
      { type: 'column', title: 'Cayman hospital revenue: US$110 mn to US$179 mn in three years', unit: 'Hospital revenue (US$ mn)', x: ['FY23', 'FY24', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], series: [{ name: 'Revenue', values: [109.8, 123.9, 140.7, 178.7, ...BL.cayman.hospUsdMnNet.map(v => Math.round((v + 6.6) * 10) / 10)], fmt: 'n1' }], labels: 'all', source: 'Company presentations (FY25 deck shows US$139.9 mn incl. CIHL); GAM estimates gross of ~US$6.6 mn eliminations' },
      { type: 'column', title: 'CIHL: revenue tripled, losses peaked in Q4FY26', unit: 'Cayman insurance (US$ mn): revenue and EBITDA by quarter', x: QL.slice(4), series: [{ name: 'Revenue', values: sq.slice(4).map(q => q.cihlUsdMn), fmt: 'n1' }, { name: 'EBITDA', values: sq.slice(4).map(q => q.cihlEbitdaUsdMn), fmt: 'n1' }], labels: 'all', source: 'Company presentations' },
    ] },
    { bullets: [
      `**Insurance:** CIHL wrote ~US$60 mn a year of premium within 18 months, faster than planned, with a 110-112% loss ratio. EBITDA US$-8.0 mn in FY26 (US$-5.1 mn in Q4 alone), US$-3.7 mn in Q1FY27. July renewals (about a third of accounts) repriced with 100% retention; January renewals are next. We model US$-8.0 / -2.0 / +1.5 mn for FY27-29E; Kotak expects breakeven by end-FY28.`,
      `**Our forecast:** hospital revenue US$${BL.cayman.hospUsdMnNet.map(v => n1(v)).join(' / ')} mn net of eliminations (+8% / +7% / +6%), margin {{as.segments.1.marginPct.0|pct}} / {{as.segments.1.marginPct.1|pct}} / {{as.segments.1.marginPct.2|pct}}, at ₹${FX.usd}/US$ (FY26 average ~₹88.3, so FY27E rupee revenue +16%). Cayman hospital EBITDA {{F.seg.cay.adjEbitda.0|num}} / {{F.seg.cay.adjEbitda.1|num}} / {{F.seg.cay.adjEbitda.2|num}} cr.`,
      '**Risks:** one small island economy (hurricanes, immigration and health-policy changes), a growing book of insurance claims, and US-dollar translation (each 1% move in the rupee is ~₹8 cr of Cayman EBITDA).',
    ] },
  ],
};

const uk = {
  id: 'uk', nav: 'United Kingdom', kicker: 'Segment: United Kingdom', title: 'UK: Narayana bought a 95%-NHS day-surgery business at 9.2x EBITDA; the first full quarter disappointed',
  blocks: [
    { p: `On 30-Oct-2025 Narayana's UK subsidiary agreed to buy Practice Plus Group Hospitals from Bridgepoint-owned Practice Plus Group for £188.8 mn (₹2,201 cr), completing on 6-Nov-2025. The EV of ~£183 mn was 9.2x FY25 EBITDA before IFRS 16 (£20 mn) and 7-8x the next twelve months; after IFRS 16 FY25 EBITDA was £29 mn, both excluding £6.1 mn of start-up losses at the new Birmingham centre. A £150 mn seven-year loan sits in the UK business and is to be repaid from its cash flow. PPG grew revenue 12% a year for five years (£229 mn in FY24, £250 mn FY25E, September year-ends); it is the UK's fifth-largest private network and fourth-largest NHS provider, but ~95% of revenue is NHS-funded (Spire ~35%, Ramsay 60-70%).` },
    { pair: [
      { type: 'column', title: 'UK revenue: ~£65-68 mn a quarter', unit: 'Revenue (£ mn); Q3FY26 from 6-Nov-2025', x: ['Q3FY26', 'Q4FY26', 'Q1FY27'], series: [{ name: 'Revenue', values: [42.3, 67.6, 65.0], fmt: 'n1' }], labels: 'all', source: 'Q1FY27 presentation p. 13' },
      { type: 'line', title: 'UK EBITDA margin: 10.5% in Q4, 8.8% in a heatwave Q1', unit: 'EBITDA margin after new-centre losses, post-IFRS 16 (%)', x: ['Q3FY26', 'Q4FY26', 'Q1FY27', 'FY27E', 'FY28E', 'FY29E'], series: [{ name: 'Margin', values: [8.6, 10.5, 8.8, ...AS.segments[2].marginPct], fmt: 'pct' }], labels: 'all', min: 0, max: 15, source: 'Company presentations; GAM estimates' },
    ] },
    { bullets: [
      '**Q1FY27:** revenue £65.0 mn (+5% YoY like-for-like); EBITDA £5.7 mn post-IFRS 16 (£3.3 mn pre-IFRS 16) after a £1.1 mn new-centre loss. A severe heatwave knocked out chillers and theatre days, and some impact spilled into Q2. Separation from the seller is complete; certification of NH\'s software as a medical device adds 4-6 months.',
      '**The plan:** standardise implants and consumables, automate administration (NH\'s Athma software), and raise the private (self-pay and insured) share from ~5-7% toward the ~30% of the nearest peer over 4-5 years. Management targets a 20-22% ROCE by FY29-30 and says UK margins will move "closer to where the market is", not to India or Cayman levels.',
      `**Our forecast:** £${BL.uk.gbpMn.join(' / ')} mn revenue (+5% a year) at {{as.segments.2.marginPct.0|pct}} / {{as.segments.2.marginPct.1|pct}} / {{as.segments.2.marginPct.2|pct}} margins (₹${FX.gbp}/£): EBITDA {{F.seg.uk.adjEbitda.0|num}} / {{F.seg.uk.adjEbitda.1|num}} / {{F.seg.uk.adjEbitda.2|num}} cr. The UK adds ~₹3,400 cr of revenue but, after acquisition interest and purchase-price amortisation, little profit: it lost £1.9 mn in its first five months.`,
    ] },
  ],
};

const insurance = {
  id: 'insurance', nav: 'Insurance & clinics', kicker: 'Integrated care', title: 'Insurance and clinics: a sound idea that costs ₹100-150 cr a year until it works',
  blocks: [
    { p: 'Narayana is trying to become a "payer-provider": own the patient through clinics and an insurance policy, then treat them in its hospitals, as Kaiser Permanente does in the US. It runs this experiment in two places. In the Cayman Islands CIHL already insures a large share of the market and lifts hospital volumes. In India, 11 clinics (₹61 cr revenue, ~30% of Bengaluru hospital outpatient footfall) and Narayana Health Insurance (premium ₹44 cr in FY26, ₹26 cr in Q1FY27) are small. Management says it is the only hospital-promoted insurer in India and that it can price group renewals using its own clinical data, but Indian rules do not let it reprice individuals for deteriorating health.' },
    { exhibit: { type: 'table', title: 'What integrated care costs (₹ crore)', head: ['', 'FY24', 'FY25', 'FY26', 'Q1FY27', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['India clinics + India insurance EBITDA (NHIC + NHIL)', '−32', '−64', '−67', n0(sq.at(-1).icEbitdaCo), ...segE('ic').map(n0)],
      ['Cayman insurance EBITDA (CIHL)', '–', '–', '−72', n0(sq.at(-1).cihlEbitda), ...segE('cihl').map(n0)],
      { hl: true, cells: ['**Total**', '**−32**', '**−64**', '**−139**', `**${n0(sq.at(-1).icEbitdaCo + sq.at(-1).cihlEbitda)}**`, ...YRS.map((_, i) => `**${n0(segE('ic')[i] + segE('cihl')[i])}**`)] },
      ['NHIL: premium written / claims ratio', '–', '₹2.4 cr', '₹43.8 cr', '₹26.2 cr / 219%', '', '', ''],
    ], source: 'Company presentations (Q4FY24-Q1FY27); PL Q1FY27 note; GAM estimates' } },
    { callout: `**Our view:** the Cayman model is working commercially (revenue, steerage), and repricing should take CIHL to breakeven by FY29E. India is far from it: a 219% claims ratio on a small group book, a clinic network that management says will keep burning cash at the same rate as it doubles, and Kotak expects ₹120 cr of losses in FY27E. Neither unit is described as structurally loss-making (each clinic breaks even ~18 months after opening; NHIL is scaling), so in the sum of the parts we deduct the present value of the losses still to come until breakeven (${X.LPV.ic.base.breakeven} on our path): ₹${n0(-X.pIc.value)} cr, ~₹${n0(-X.pIc.perShare)} a share at the Sep-2027 target date, not a perpetuity. If the losses never ended, capitalising them at the India multiple would cost ~₹${n0(-X.icSep28 * X.IND_X / X.F.shares)} a share instead.` },
  ],
};

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: a real cost moat in India; none yet in the UK',
  blocks: [
    { verdicts: D.moat.map(m => [m[0], m[1], m[2], m[3]]), head: ['Source', 'Verdict', 'Evidence', 'So what'], title: 'Competitive advantage scorecard', source: SRC },
    { callout: '**Honest verdict:** Narayana\'s moat is cost and clinical volume in Indian tertiary care, built over 25 years on cheap beds and high throughput. It is a genuine advantage, but it is narrowing as the company builds beds at today\'s prices and pays to enter new businesses. Cayman is a good niche business with a small market. The UK has no moat today: Narayana is a price-taker from a single buyer (the NHS) and must prove it can run a lower-cost hospital in a high-cost country.' },
  ],
};

module.exports = { india, cayman, uk, insurance, moat };
