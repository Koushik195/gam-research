// Tenneco Clean Air India report, part 3: the two segments, margins on VAR, the parent and related parties, moat scorecard.
const X = require('./TENNIND.ctx');
const { D, SG, SQ, QL, LB, VAR, SUB, var26, varG, mVar, mVar26, F, A, b, RP, Q1, n0, n1, n2, feesFy26, feesFy25, feesPct, feesOfEbitda } = X;
const SM = D.segmentMarginsFy25, A25 = SG.annual.find(a => a.fy === 'FY25');
const mixAt = (ca, art, mc, ma) => (ca * mc + art * ma) / (ca + art);
// FY26 segment margins are not disclosed: hold the FY25 gap (11 points) and solve for the level that gives the FY26 total
const gap = SM.caPtEbitdaVarPct - SM.artEbitdaVarPct, art26 = mVar26 - LB.fy26.caVar / var26 * gap, ca26 = art26 + gap;
const mix29 = mixAt(LB.caVar[2], LB.artVar[2], ca26, art26);

const segments = {
  id: 'segments', nav: 'The two segments', kicker: 'Segments', title: 'Ride control grows twice as fast; exhaust earns almost twice the margin',
  blocks: [
    { h: 'Advanced Ride Technologies (51% of FY26 VAR)' },
    { p: `ART VAR rose from ₹${n0(A25.artVar)} cr in FY25 to ₹${n0(LB.fy26.artVar)} cr in FY26 (+19.7%) and ₹${n0(Q1.artVar)} cr in Q1FY27 (+${Q1.artGrowth}%). Tenneco has 55% of the Indian car shock-absorber and strut market (52% a year earlier). The growth comes from three things: more cars (the GST cut helped small cars most), richer products (DCx DaVinci, launched with a leading Indian PV maker in Q3FY26, now on several programmes; semi-active electronic dampers on Mahindra's BE6 and XEV 9e) and new customers (four in Q1FY27, new even for conventional dampers). Plants run above 90%; a ₹69 cr western-India plant is coming. The weak spot is margin: in FY25 ART earned only ${SM.artEbitdaVarPct}% of VAR against ${SM.caPtEbitdaVarPct}% in CA&PT (RHP data shown by JM Financial).` },
    { h: 'Clean Air & Powertrain Solutions (49%)' },
    { p: `CA&PT VAR was ₹${n0(A25.caVar)} cr in FY25 and ₹${n0(LB.fy26.caVar)} cr in FY26 (+5.5%); Q1FY27 ₹${n0(Q1.caVar)} cr (+${Q1.caGrowth}%). It includes exhaust after-treatment (58% of truck and 68% of off-highway clean air), spark plugs and ignition, bearings and sealings. ${Q1.caGap}. New wins: a spark-plug order at a large car maker, PV hot-end and CNG cold-end programmes, an SCV after-treatment system, a heat-shield order from Tenneco America, and the first clean-air programme at the Japanese PV leader (for CAFE-3, 2028-29). Kharkhoda (₹71 cr) adds capacity in the north.` },
    { pair: [
      { type: 'line', title: 'Quarterly VAR by segment (₹ crore)', unit: '₹ crore', x: QL, series: [{ name: 'CA&PT', values: SQ.map(q => q.caVar), fmt: 'num' }, { name: 'ART', values: SQ.map(q => q.artVar), fmt: 'num' }], labels: 'last', source: 'Company calls; Q2-Q4FY25 derived from reported growth' },
      { type: 'column', title: 'FY25 EBITDA margin on VAR: exhaust 23.8%, ride control 12.8%', unit: 'EBITDA ÷ VAR (%)', x: ['CA&PT', 'ART', 'Company'], series: [{ name: 'FY25', values: [SM.caPtEbitdaVarPct, SM.artEbitdaVarPct, SM.total], fmt: 'pct' }], labels: 'all', source: 'RHP via JM Financial (7-Jan-2026), Exhibit 1' },
    ] },
    { exhibit: { type: 'table', title: 'Our segment build (₹ crore)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['CA&PT VAR', n0(LB.fy26.caVar), ...LB.caVar.map(n0)], ['growth', '+5.5%', ...LB.caGrowth.map(g => `+${g}%`)],
      ['ART VAR', n0(LB.fy26.artVar), ...LB.artVar.map(n0)], ['growth', '+19.7%', ...LB.artGrowth.map(g => `+${g}%`)],
      { hl: true, cells: ['**VAR**', `**${n0(var26)}**`, ...VAR.map(v => `**${n0(v)}**`)] }, ['growth', '+12.3%', ...varG.map(g => `+${n1(g)}%`)],
      ['Substrates (pass-through, balance to revenue)', n0(LB.fy26.substrates), ...SUB.map(n0)],
      { hl: true, cells: ['**Revenue (model)**', `**${n0(A.sales[b])}**`, ...F.sales.map(v => `**${n0(v)}**`)] },
      ['EBITDA margin on VAR', `${n1(mVar26)}%`, ...mVar.map(m => `${n1(m)}%`)],
      ['ART share of VAR', `${n1(LB.fy26.artVar / var26 * 100)}%`, ...LB.artVar.map((v, i) => `${n1(v / VAR[i] * 100)}%`)],
    ], source: 'Company (FY26); GAM estimates. The engine models one revenue line; TENNIND.ctx.js checks that the build adds up to it.' } },
    { callout: `**The mix problem.** If the FY25 gap between the segments (${n1(gap)} points) still holds, FY26 margins were ~${n1(ca26)}% (CA&PT) and ~${n1(art26)}% (ART). With ART at ${n1(LB.artVar[2] / VAR[2] * 100)}% of VAR by FY29E, mix alone would pull the company margin to ~${n1(mix29)}%. Our ${n1(mVar[2])}% for FY29E therefore assumes ART margins improve as DCx and semi-active dampers (higher value, and "hopefully" better margins, per the CEO) and the new plants scale.` },
  ],
};

const qv = SQ.map(q => q.ebitdaVarPct);
const margins = {
  id: 'margins', nav: 'Margins & VAR', kicker: 'Profitability', title: 'A record 18.8% of VAR in FY26, 17.9% in Q1FY27: listing costs and oil-linked inputs',
  blocks: [
    { p: `EBITDA on VAR rose from 14.6% (FY23) and 14.3% (FY24) to 18.6% (FY25) and 18.8% (FY26), helped by Tenneco's P3 cost programme, better plant loading and price recoveries. It fell to ${Q1.ebitdaVarPct}% in Q1FY27 (${Q1.ebitdaVarPctLy}% a year earlier). Management gave two reasons: the cost of being a listed company (a full leadership team, directors' fees, compliance, legal and IT) and inputs that are not indexed to customer prices (crude-linked plastics and rubber, LPG/CNG) after the West Asia war. Steel is indexed back-to-back with a one-quarter lag. Recoveries and productivity added 60 bp in Q1. Employee cost rose 30% YoY in Q4FY26 (JM Financial).` },
    { pair: [
      { type: 'line', title: 'EBITDA margin on VAR by quarter', unit: 'EBITDA ÷ VAR (%)', x: QL, series: [{ name: 'On VAR', values: qv, fmt: 'pct' }, { name: 'On revenue', values: SQ.map(q => (q.revenue ? Math.round(q.ebitda / q.revenue * 1000) / 10 : null)), fmt: 'pct' }], labels: 'last', min: 13, max: 21, source: 'Company; Screener.in; GAM' },
      { type: 'column', title: 'Substrates: 9-12% of VAR (pass-through, no margin)', unit: 'Substrates ÷ VAR (%)', x: QL.slice(1), series: [{ name: 'Substrates', values: SQ.slice(1).map(q => Math.round(q.substrates / q.var * 1000) / 10), fmt: 'pct' }], labels: 'all', source: 'Company VAR; Screener.in revenue; GAM' },
    ] },
    { callout: `**Our margin path:** ${n1(mVar[0])}% / ${n1(mVar[1])}% / ${n1(mVar[2])}% of VAR in FY27-29E ({{as.ebitdaMargin.0|pct}} / {{as.ebitdaMargin.1|pct}} / {{as.ebitdaMargin.2|pct}} of revenue). That is below FY26's record and below JM Financial's FY28E (18.1% of revenue): we give back some of the listing-cost and commodity hit, but not the mix effect.` },
  ],
};

const parent = {
  id: 'parent', nav: 'The parent & related parties', kicker: 'Related parties', title: `Tenneco takes ${n1(feesPct)}% of revenue in fees: fair for the technology, but it charges royalty on pass-through substrates`,
  blocks: [
    { p: `Tenneco India pays its parent group a royalty for technology and trademarks and, from FY26, "network fees" that replaced management-support and corporate-support charges. FY26: royalty ₹${n1(RP.royaltyFy26)} cr, network fees ₹${n1(RP.networkFeeFy26)} cr, total ₹${n0(feesFy26)} cr (${n1(feesPct)}% of revenue, ${n1(feesOfEbitda)}% of EBITDA); FY25 ₹${n0(feesFy25)} cr. ${RP.royaltyBasis}. Because the base is revenue, the ~₹${n0(LB.fy26.substrates)} cr of substrates (no value added) cost ~₹${n0(LB.fy26.substrates * 0.025)} cr of royalty a year. ${RP.apa}.` },
    { exhibit: { type: 'table', title: 'Money flows with the Tenneco group (₹ crore)', head: ['Item', 'FY25', 'FY26', 'Comment'], wide: [3], rows: [
      ['Royalty (technology and trademark)', n1(RP.royaltyFy25), n1(RP.royaltyFy26), '2.5% of revenue less intercompany sales'],
      ['Management support + corporate support charges', n1(RP.mgmtSupportFy25 + RP.corpSupportFy25), '–', 'Replaced by network fees'],
      ['Network fees', '–', n1(RP.networkFeeFy26), 'New in FY26'],
      { hl: true, cells: ['**Total fees**', `**${n0(feesFy25)}**`, `**${n0(feesFy26)}**`, `**${n1(feesFy25 / 4890 * 100)}% → ${n1(feesPct)}% of revenue**`] },
      ['Purchases of goods from group companies', n1(RP.purchasesFromGroupFy25), n1(RP.purchasesFromGroupFy26), 'Largest: Tenneco Automotive Europe (₹34 cr) and a Chinese ride-control affiliate (₹11 cr)'],
      ['Services sold to group companies', n1(RP.servicesSoldToGroupFy25), n1(RP.servicesSoldToGroupFy26), 'Services billed to group companies'],
      ['Dividends paid (all to the parent, pre-IPO)', '409', '1,037', 'No final dividend for FY26'],
      ['Motocare India sold to a fellow subsidiary', '829 (consideration)', '663 collected', 'Mar-2025 sale; gain in capital reserve'],
    ], source: 'AR FY26 consolidated notes 25, 28, 39, 45; Screener.in cash flow' } },
    { callout: `**Verdict:** management calls a 2.5% royalty "fairly average" (it says some MNCs charge 5-6%), and the access is real: Euro VII know-how, semi-active suspension and export programmes moved from Europe. The governance points are narrower: the royalty base includes pass-through substrates; the fee structure was reshaped in the IPO year; ~70% of the export order book is sold to Tenneco companies at transfer prices; and the parent took ₹1,037 cr of dividends and ₹3,600 cr of IPO proceeds before selling another 15%. None of it is improper; all of it means value can leave through channels minority shareholders do not control.` },
  ],
};

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'A real but parent-dependent moat',
  blocks: [
    { exhibit: { type: 'table', title: 'Competitive advantage scorecard (1 = weak, 5 = strong)', head: ['Factor', 'Score', 'Evidence'], wide: [2], rows: D.moat.map(m => [m.factor, `${m.score}/5`, m.text]), source: 'GAM Research' } },
    { callout: `**Honest verdict:** narrow moat, ${(D.moat.reduce((s, m) => s + m.score, 0) / D.moat.length).toFixed(1)}/5. Leadership in truck exhaust and car dampers is earned and sticky (platform validation, decades-long customer ties), but much of the technology belongs to the parent, which also decides where export programmes go, and the exhaust half shrinks as battery EVs grow. Ride control is the more durable half; it is also the lower-margin one.` },
  ],
};

module.exports = { segments, margins, parent, moat };
