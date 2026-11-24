// Olectra Greentech report, part 3: one chapter per segment (mobility, energy), the Evey/related-party model, and the
// competitive-advantage scorecard.
const X = require('./OLECTRA.ctx');
const { C, D, SA, SQ, QL, BL, bld, n0, n1, yr, mobShare } = X;
const rup = s => String(s).replace(/Rs ?/g, '₹');
const fy = SA.map(a => a.fy), r1 = v => Math.round(v * 10) / 10, r2 = v => Math.round(v * 100) / 100;
const y24 = yr('FY24'), y25 = yr('FY25'), y26 = yr('FY26'), q1 = SQ.find(q => q.q === 'Q1FY27'), q4 = SQ.find(q => q.q === 'Q4FY26');
const segQ = key => SQ.map(q => q[key] ?? null);
const FX = ['FY27E', 'FY28E', 'FY29E'];

const mobility = {
  id: 'mobility', nav: 'E-buses (Mobility)', kicker: 'Segment: Mobility', title: 'E-buses: volumes up 5x in four years, but the segment\'s EBIT rose only 1% in FY26',
  blocks: [
    { p: `The Mobility Division had revenue of ₹${n0(y26.mobRev)} cr in FY26 (+${Math.round((y26.mobRev / y25.mobRev - 1) * 100)}%) on 1,280 vehicles (+32%), and segment EBIT of ₹${n0(y26.mobEbit)} cr (${n1(y26.mobEbit / y26.mobRev * 100)}%, down from ${n1(y25.mobEbit / y25.mobRev * 100)}%). Revenue per vehicle (including maintenance and bus-operation revenue) fell from ₹${y24.revPerUnit} cr (FY24) to ₹${y25.revPerUnit} cr (FY25) and ₹${y26.revPerUnit} cr (FY26) as the mix shifted (9-metre buses are 55% of the order book; tippers are cheaper than 12-metre buses). Q1FY27 revenue was ₹${n0(q1.mobRev)} cr (+69%) on ${q1.units} vehicles (161 a year earlier), but EBIT was only ₹${n0(q1.mobEbit)} cr (${n1(q1.mobEbit / q1.mobRev * 100)}%): the new Seetharampur plant now carries depreciation and fixed costs at low utilisation. Segment assets were ₹${n0(y26.mobAssets)} cr at Mar-26 (₹${n0(y25.mobAssets)} cr a year earlier), so EBIT on segment assets was ${n1(y26.mobEbit / y26.mobAssets * 100)}% (FY25 ${n1(y25.mobEbit / y25.mobAssets * 100)}%).` },
    { pair: [
      { type: 'column', title: `Mobility revenue: ₹84 cr (FY20) to ₹${n0(y26.mobRev)} cr (FY26), ₹${n0(bld[2].mob)} cr by FY29E`, unit: '₹ crore', x: [...fy, ...FX], series: [{ name: 'Revenue', values: [...SA.map(a => Math.round(a.mobRev)), ...bld.map(r => Math.round(r.mob))], fmt: 'num' }], labels: 'all', source: 'Annual reports (segment notes); GAM estimates' },
      { type: 'line', title: `Mobility EBIT margin: 11.9% (FY25), 9.8% (FY26), ${BL.mobMargin[0]}% in our FY27E`, unit: 'Segment EBIT margin (%)', x: [...fy, ...FX], series: [{ name: 'EBIT margin', values: [...SA.map(a => r1(a.mobEbit / a.mobRev * 100)), ...BL.mobMargin], fmt: 'pct' }], labels: 'all', min: 0, max: 15, source: 'Annual reports; GAM estimates' },
    ] },
    { pair: [
      { type: 'column', title: 'Vehicles sold by quarter: lumpy, 156-450', unit: 'Vehicles', x: QL, series: [{ name: 'Vehicles', values: segQ('units'), fmt: 'num' }], labels: 'all', source: 'Company presentations (some quarters derived from half-year and nine-month totals; see segments.json)' },
      { type: 'column', title: 'Mobility revenue by quarter (₹ crore)', unit: '₹ crore', x: QL, series: [{ name: 'Mobility revenue', values: segQ('mobRev').map(v => Math.round(v)), fmt: 'num' }], labels: 'all', source: 'Company presentations; Q2FY25 derived' },
    ] },
    { exhibit: { type: 'table', title: 'Our Mobility build', head: ['', 'FY26', ...FX], rows: [
      ['Vehicles', n0(y26.units), ...bld.map(r => n0(r.units))],
      ['Revenue per vehicle (₹ cr)', String(y26.revPerUnit), ...BL.revPerUnit.map(v => v.toFixed(2))],
      ['Mobility revenue (₹ cr)', n0(y26.mobRev), ...bld.map(r => n0(r.mob))],
      ['EBIT margin', n1(y26.mobEbit / y26.mobRev * 100) + '%', ...BL.mobMargin.map(v => v + '%')],
      ['Segment EBIT (₹ cr)', n0(y26.mobEbit), ...bld.map(r => n0(r.me))],
    ], source: 'AR FY26; GAM estimates (assumptions.json build)' } },
    { callout: `**Our forecast:** ${bld.map(r => n0(r.units)).join(' / ')} vehicles in FY27-29E against guidance of 2,000-2,500 for FY27 and a 5,000-a-year plant. We stay below guidance because Olectra delivered only 64% of its FY26 target, MSRTC's own depots are late, and BYD parts set the pace. A Mobility EBIT margin of ${BL.mobMargin.join('% / ')}% assumes the plant's fixed costs are spread over more buses but tender prices stay tight; management's 12-15% EBITDA band is for the group, including insulators. By FY29E buses are ${Math.round(mobShare[2])}% of our revenue.` },
  ],
};

const evey = {
  id: 'evey', nav: 'The Evey model', kicker: 'Related parties', title: 'The Evey model: the parent\'s operator wins the contract, buys the bus and pays Olectra when its lenders and the state pay',
  blocks: [
    { p: rup(`${C.structure.evey} ${C.structure.rptSales}`) },
    { exhibit: { type: 'table', title: 'Who owes Olectra money (trade receivables, ₹ crore)', head: ['Counterparty', 'Contract', 'Mar-25', 'Mar-26'], rows: [
      ['Evey Trans (MSR) Pvt Ltd', 'MSRTC (Maharashtra)', '119.9', '345.3'],
      ['Evey Trans (TEL) Pvt Ltd', 'Telangana', '36.0', '137.4'],
      ['Evey Trans (MUM) Pvt Ltd', 'BEST (Mumbai)', '317.4', '108.8'],
      ['Evey Trans Pvt Ltd', 'Parent operator', '12.8', '64.2'],
      ['Megha Engineering & Infrastructures', 'MEIL group', '25.5', '44.5'],
      ['Other Evey SPVs, MEIL Foundation, OHA Commute', '', '77.7', '17.7'],
      { hl: true, cells: ['**Related parties**', '', '**589.3**', '**717.9**'] },
      ['Others (state utilities, contractors, exporters)', '', '108.4', '275.2'],
      { hl: true, cells: ['**Gross trade receivables**', '', '**697.7**', '**993.1**'] },
    ], source: 'AR FY26 consolidated notes 11 and 33. The \'other Evey SPVs\' line balances the itemised note 33 balances to the note 11 total (within ₹3 cr). Contract names from the AGM notice and press; non-related customers include insulator buyers.' } },
    { bullets: [
      rup(`**Pricing.** ${C.structure.rptApprovals}`),
      rup(`**Credit support runs both ways.** ${C.structure.loc} MEIL in turn guarantees Olectra's plant loan and was asked to lend ₹150 cr for the TGSRTC project.`),
      '**Why it worked so far.** ICRA (Oct-2025) notes that working capital improved in FY25 because Evey\'s SPVs drew project debt faster, and that Olectra usually gets ~60% of the price on or before delivery and the rest in 120-180 days. Olectra\'s payment therefore depends on Evey raising debt and on states paying Evey.',
      '**What we cannot see.** Evey\'s accounts, its debt, the per-km fees it earns and the margin Olectra earns on each Evey bus versus a bus sold to a third party are not disclosed.',
    ] },
    { callout: '**So what:** the arrangement is common in Indian e-buses (JBM does the same with JBM Ecolife) and it fills the factory. But it means the listed company\'s revenue, margin and receivables are set in deals between companies controlled by the same promoter. We treat the related-party share as an accounting and governance flag (AMBER), not as evidence of wrongdoing: the auditor gave a clean opinion and the large contracts are put to shareholders for approval.' },
  ],
};

const energy = {
  id: 'energy', nav: 'Insulators (Energy)', kicker: 'Segment: Energy', title: 'Insulators: revenue +81% and EBIT +144% in FY26 on transmission spending; Q1FY27 margin back to 22%',
  blocks: [
    { p: `The Energy Division makes composite polymer insulators. Revenue was flat at ₹108-143 cr a year from FY20 to FY24, then rose to ₹${n0(y25.enRev)} cr (FY25) and ₹${n0(y26.enRev)} cr (FY26) as India\'s transmission build-out and exports (~37% of FY26 division revenue) took off. Segment EBIT rose from ₹${n0(y24.enEbit)} cr (FY24) to ₹${n0(y26.enEbit)} cr (FY26), a ${n1(y26.enEbit / y26.enRev * 100)}% margin and ${Math.round(y26.enEbit / (y26.enEbit + y26.mobEbit) * 100)}% of group segment EBIT. Q4FY26 was exceptional (₹${n0(q4.enRev)} cr at a ${n1(q4.enEbit / q4.enRev * 100)}% margin); Q1FY27 revenue was ₹${n0(q1.enRev)} cr (+47% year on year, −23% on Q4) at ${n1(q1.enEbit / q1.enRev * 100)}%. Insulator orders are fixed-price, so margins swing with resin and metal costs (ICRA). Management aims to grow the division five-fold in three years with new products (hollow-core insulators for substations) and capacity.` },
    { pair: [
      { type: 'column', title: `Insulator revenue: ₹117 cr (FY20) to ₹${n0(y26.enRev)} cr (FY26), ₹${n0(bld[2].en)} cr by FY29E`, unit: '₹ crore', x: [...fy, ...FX], series: [{ name: 'Revenue', values: [...SA.map(a => Math.round(a.enRev)), ...bld.map(r => Math.round(r.en))], fmt: 'num' }], labels: 'all', source: 'Annual reports; GAM estimates' },
      { type: 'line', title: 'Insulator EBIT margin by quarter: 22-38%', unit: 'Segment EBIT margin (%)', x: QL, series: [{ name: 'EBIT margin', values: SQ.map(q => r1(q.enEbit / q.enRev * 100)), fmt: 'pct' }], labels: 'all', min: 0, max: 45, source: 'Company presentations' },
    ] },
    { callout: `**Our forecast:** +${BL.enGrowth.join('% / +')}% at a ${BL.enMargin[0]}% EBIT margin, well below the five-fold ambition and below FY26's 34.5%, because Q1FY27 showed how quickly the margin falls when the mix or input costs turn. Each 5pp of insulator margin is worth ~₹${n0(bld[1].en * 0.05)} cr of FY28E EBIT, about ${Math.round(bld[1].en * 0.05 / bld[1].seg * 100)}% of the group's.` },
  ],
};

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: an early start and a group operator, but licensed technology and tender pricing',
  blocks: [
    { verdicts: [
      ['First mover and installed base', 'Moderate', '3,800+ vehicles on the road; first e-bus maker in India (2017)', 'Reference fleet helps in tenders; buyers still choose on price per km'],
      ['Group operator (Evey)', 'Double-edged', 'Evey won MSRTC, BEST, TGSRTC and BMTC contracts', 'Fills the plant; pricing and cash are set inside the group'],
      ['Technology', 'Weak', 'BYD supplies batteries, chassis and parts; own platforms only from Q3FY27', 'Geopolitical and supply risk; little proprietary IP yet'],
      ['Manufacturing scale', 'Moderate', 'Seetharampur: 5,000 a year, scalable to 10,000', 'Only an advantage once filled; FY26 output 1,280'],
      ['Insulators', 'Moderate', 'Largest composite insulator maker in India; 25-35% EBIT', 'Real niche, but 14% of revenue'],
    ], head: ['Source', 'Strength', 'Evidence', 'So what'], title: 'Competitive advantage scorecard', source: 'AR FY26; ICRA (Oct-2025); GAM Research' },
    { callout: rup(`**Verdict:** ${D.moat.verdict}`) },
  ],
};

module.exports = { mobility, evey, energy, moat };
