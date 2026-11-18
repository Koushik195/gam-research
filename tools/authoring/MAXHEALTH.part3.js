// Max Healthcare report, part 3: hospital KPIs (beds, occupancy, ARPOB), payor and specialty mix, expansion pipeline, moat.
const X = require('./MAXHEALTH.ctx');
const { C, D, F, A, NP, n0, n1, rup, SRC, Q1, AK, QK, SQ, QL, NW, BL, YRS, obd, hospGross, netGross, netNet, consRev, OBD26, BEDS26, OBD25, BEDS25, BEDSQ1 } = X;

const hospitals = {
  id: 'hospitals', nav: 'Beds, occupancy & ARPOB', kicker: 'Operating KPIs', title: 'Revenue = beds × occupancy × ARPOB: Max leads on occupancy and ARPOB; now the beds are growing',
  blocks: [
    { p: `Hospital revenue is the product of three numbers: **operational beds**, **occupancy** (the share of beds filled each night) and **ARPOB** (average revenue per occupied bed-day; Max divides gross revenue, including outpatients and pharmacy but excluding Max Lab, by occupied bed-days). Max's occupancy has sat at 74-76% for four years, the highest among large listed chains (Apollo, Fortis 65-69%, Medanta ~62% on the company's comparison), and its ARPOB (₹${n1(AK[3].arpob / 1000)}k in FY26, ₹${n1(Q1.arpob / 1000)}k in Q1FY27) is the highest. ARPOB dipped in FY25 (₹76k → ₹73.9k) because the acquired Lucknow, Nagpur and Noida hospitals bill much less, and again in Q3-Q4FY26 when high-value chemotherapy for CGHS patients stopped; excluding oncology it grew 9% in Q1FY27. EBITDA per bed, Max's favourite measure, was ₹${n1(AK[3].ebitdaPerBedLakh)} lakh in FY26 and ₹${n1(Q1.ebitdaPerBedLakh)} lakh in Q1FY27.` },
    { pair: [
      { type: 'column', title: 'Operational beds: +13% in the year to Jun-2026', unit: 'Operational beds at period end (Network)', x: ['Mar-25', 'Jun-25', 'Mar-26', 'Jun-26'], series: [{ name: 'Operational beds', values: [AK[2].opBedsEnd, QK[0].opBedsEnd, AK[3].opBedsEnd, Q1.opBeds], fmt: 'num' }], labels: 'all', source: 'Company releases (Jun-25 = Jun-26 less 630 added)' },
      { type: 'line', title: 'Quarterly ARPOB: flat for a year, then +5% in Q1FY27', unit: 'ARPOB (₹ per occupied bed-day), Network', x: QL.slice(3), series: [{ name: 'ARPOB', values: SQ.slice(3).map(q => q.arpob), fmt: 'num' }], labels: 'all', min: 60000, max: 85000, source: 'Company presentations; PL (Q2FY26)' },
    ] },
    { exhibit: { type: 'table', title: 'The revenue identity, checked (Network)', head: ['', 'FY25', 'FY26', 'Q1FY27'], rows: [
      ['Gross revenue excl. Max Lab (₹ cr)', n0(NP.FY25.gross - 175), n0(NP.FY26.gross - AK[3].maxLabNetRev), n0(Q1.grossRevenue - QK[4].maxLabNetRev)],
      ['÷ ARPOB (₹)', n0(AK[2].arpob), n0(AK[3].arpob), n0(Q1.arpob)],
      ['= occupied bed-days (lakh)', n1(OBD25 / 1e5), n1(OBD26 / 1e5), n1((Q1.grossRevenue - QK[4].maxLabNetRev) * 1e7 / Q1.arpob / 1e5)],
      ['÷ (days × occupancy)', `365 × ${AK[2].occupancyPct}%`, `365 × ${AK[3].occupancyPct}%`, `91 × ${Q1.occupancyPct}%`],
      { hl: true, cells: ['**= implied average operational beds**', `**${n0(BEDS25)}**`, `**${n0(BEDS26)}**`, `**${n0(BEDSQ1)}**`] },
      ['Operational beds at period end (company)', n0(AK[2].opBedsEnd), n0(AK[3].opBedsEnd), n0(Q1.opBeds)],
      ['Memo: IP discharges × ALOS (lakh bed-days)', n1(AK[2].ipDischarges * AK[2].alos / 1e5), n1(AK[3].ipDischarges * AK[3].alos / 1e5), n1(QK[4].ipDischarges * QK[4].alos / 1e5)],
    ], source: 'Company KPIs and releases; Max Lab revenue ₹175 cr (FY25, deck chart), ₹201 cr (FY26), ₹58 cr (Q1FY27); GAM Research. Average beds are not disclosed: we derive them.' } },
    { callout: `**What would move the numbers:** each 1pp of occupancy on ~${n0(NW.avgOpBeds[0])} beds is ~20,000 bed-days, or ~₹${n0(NW.avgOpBeds[0] * 365 * 0.01 * NW.arpob[0] / 1e7)} cr of Network revenue at FY27E ARPOB; each 1% of ARPOB is ~₹${n0(hospGross[0] / 100)} cr. Because the hospitals are already ~75% full, growth now depends on new beds (avg. operational beds +${Math.round((NW.avgOpBeds[0] / BEDS26 - 1) * 100)}% in FY27E in our build) and on price and mix, not on filling empty ones.` },
  ],
};

const payor = {
  id: 'payor', nav: 'Payors & specialties', kicker: 'Revenue quality', title: 'Who pays: insurers and self-pay patients are 70%, government schemes 21% and falling',
  blocks: [
    { p: `Max's revenue comes from four payor groups: self-pay patients (32.5% in Q1FY27), insurance and corporates (37.8%), international patients (8.8%) and "institutional" government schemes such as CGHS, ECHS and PSU employees (20.9%, but 32% of occupied beds because they pay less per day). Management is explicit that institutional business "has never been profitable" and only absorbs fixed costs, and it is cutting that share as new beds open. The October-2025 CGHS agreement made it uneconomic to give high-value patented chemotherapy drugs to institutional patients, so Max stopped: oncology fell from 26% of inpatient revenue to 21-22%, and Network revenue growth slowed to 10% in Q4FY26. The base effect fades from Q3FY27; management expects oncology to stay at 21-22% of the mix, with other specialties filling the beds. A CGHS rate revision (~₹140 cr a year, full run-rate from June 2026) and a pre-agreed ~6% insurer price increase from Sep-Oct 2026 support FY27 pricing.` },
    { pair: [
      { type: 'stacked', title: 'Payor mix: institutional share peaked in FY26', unit: 'Share of hospital revenue (%)', x: ['FY25', 'FY26', 'Q1FY26', 'Q1FY27'], series: [{ name: 'Self-pay', values: [34.1, 34.2, 33.8, 32.5], fmt: 'pct' }, { name: 'Insurance & corporates', values: [37.7, 34.9, 35.8, 37.8], fmt: 'pct' }, { name: 'International', values: [8.8, 9.1, 8.6, 8.8], fmt: 'pct' }, { name: 'Institutional', values: [19.4, 21.9, 21.8, 20.9], fmt: 'pct' }], minLabel: 5, max: 100, source: 'Company earnings presentations' },
      { type: 'column', title: 'International patients: ~9% of hospital revenue, growing ~18-20%', unit: 'International patient revenue (₹ crore, quarterly)', x: ['Q4FY25', 'Q1FY26', 'Q3FY26', 'Q4FY26', 'Q1FY27'], series: [{ name: 'International', values: [202, 208, 230, 227, 247], fmt: 'num' }], labels: 'all', source: 'Company releases (Q2FY26 not disclosed separately in the files we read)' },
    ] },
    { exhibit: { type: 'table', title: 'Oncology and institutional patients: the two numbers to watch', head: ['', 'Q4FY25', 'Q1FY26', 'Q3FY26', 'Q4FY26', 'Q1FY27'], rows: [
      ['Oncology share of IP revenue', '26%', '26%', '24%', '21%', '22%'],
      ['Institutional patient bed share', '33.2%', '34.1%', '35.8%', '35.5%', '32.3%'],
      ['Network gross revenue growth YoY', '–', '–', '–', '+10%', '+16% (+20% ex-oncology)'],
      ['ARPOB (₹\'000)', '77.1', '78.0', '77.9', '77.9', '81.9'],
    ], source: 'Q4FY26 and Q1FY27 releases' } },
    { callout: '**Our view:** the payor shift is real and positive (more insurance, less CGHS), but it shows how exposed a Delhi hospital is to government pricing: one CGHS agreement took ~4 points off oncology\'s share and slowed growth for three quarters. The Supreme Court\'s questions on drug markups (30-Sep-2026) are the same risk in a bigger form. We do not assume a cap in our base case; our bear case does.' },
  ],
};

const PL = C.pipeline;
const expansion = {
  id: 'expansion', nav: 'Expansion pipeline', kicker: 'Growth plan', title: 'The next ~4,000 beds: mostly brownfield towers next to full hospitals, plus Gurugram, Lucknow, Thane and Pune',
  blocks: [
    { p: `On 17-Aug-2026 Max showed capacity rising from 6,183 beds to ~10,200 by FY30 (+601 in FY27, +500 in FY28, +927 in FY29, +1,981 in FY30), with land and contracts for ~4,300 more later. The company estimates ₹6,961 cr of outflow for the projects under way over FY27-30, excluding land, routine capex and unfirmed projects. The mix is the attraction: brownfield towers at Saket (Smart, Vikrant), Nanavati, Patparganj, Vaishali, Dwarka, Nagpur and Lucknow sit next to hospitals that are already ~80% full, need no new brand or doctors from scratch, and break even at lower occupancy ("50-55%" for most units, per the CMD). The greenfields (Gurugram Sector 56, Shaheed Path Lucknow, Pune) and the asset-light leases (Zirakpur, Thane, Dehradun, Pitampura) carry more ramp-up risk. About 1,350 of the planned beds (Smart, Patparganj, Vikrant) are in partner societies that Max funds with loans.` },
    { exhibit: { type: 'table', title: 'Pipeline (management timelines as of Aug-2026)', head: ['Project', 'Beds', 'Timing', 'Type'], wide: [0, 2], rows: PL.map(p => [p.project, n0(p.beds), rup(p.timing), p.type]), source: rup(C.pipelineSrc) } },
    { pair: [
      { type: 'column', title: 'Capex plan: ~₹7,000 cr over FY27-30 (projects under way)', unit: 'Estimated outflow, company (₹ crore); excludes land and routine capex', x: ['FY27', 'FY28', 'FY29', 'FY30'], series: [{ name: 'Outflow', values: [1711, 2340, 2025, 885], fmt: 'num' }], labels: 'all', source: 'Investor presentation, 17-Aug-2026, p.16' },
      { type: 'column', title: 'Our build: average operational beds +41% to FY29E', unit: 'Average operational beds (Network; FY26 derived from KPIs)', x: ['FY26', ...YRS], series: [{ name: 'Beds', values: [Math.round(BEDS26), ...NW.avgOpBeds], fmt: 'num' }], labels: 'all', source: 'GAM estimates (assumptions.json businessLines)' },
    ] },
    { callout: `**Our view:** this is the right kind of growth (brownfield in strong locations), but it is capital-hungry and back-loaded: half the new beds arrive in FY30, while the money goes out in FY27-29. Disclosed costs are ~₹2.0-2.1 cr per bed (Vaishali ₹425 cr for 202 beds; Shaheed Path ~₹1,400 cr for 712), against Network revenue of ~₹${n1(hospGross[0] * 1e7 / NW.avgOpBeds[0] / 1e7)} cr per operational bed in FY27E and Network EBITDA of ~₹0.7 cr per bed (₹71 lakh in Q1FY27): an EBITDA yield of ~35% on cost for a full, mature bed, but several years of losses or low returns while new beds fill. We assume avg. beds rise to ${n0(NW.avgOpBeds[2])} by FY29E at 73-74% occupancy; the payoff from FY30 openings is outside our forecast window and only in our DCF.` },
  ],
};

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: a real moat built on location, doctors and execution, but not on price',
  blocks: [
    { verdicts: [...D.moat.map(r => r.map(rup))], head: ['Dimension', 'Verdict', 'Evidence', 'So what'], title: 'Moat scorecard', source: 'GAM research compilation (company filings and calls to Sep-2026)' },
    { callout: '**Honest verdict:** Max has a genuine moat in Delhi NCR and Mumbai: scarce land next to busy hospitals, senior clinicians in transplant, cancer, cardiac and neuro care, and a management team that has repeatedly bought weak hospitals and lifted them to network margins. The moat protects **occupancy and returns**, not **price**: government schemes, insurers and now courts set limits on what a hospital can charge, and every large competitor is adding beds in the same cities, which pushes up doctors\' pay. It is a strong franchise, not a monopoly.' },
  ],
};

module.exports = { hospitals, payor, expansion, moat };
