// HCL Technologies report, part 3: one chapter per segment (IT & Business Services, Engineering & R&D, HCLSoftware).
const X = require('./HCLTECH.ctx');
const { F, AS, n0, n1, pc, SA, SQ, QL, A26, A25, A24, A23, A22, A21, Q1, FY26, segM, usd } = X;
const S = k => AS.usdBuild.segments[k];
const cc = (k, i) => `${S(k).ccGrowth[i] >= 0 ? '+' : '−'}${Math.abs(S(k).ccGrowth[i])}%`;
const SW_Q = SQ.filter(q => q.swUsd);
const swPe = X.peMult * (F.seg.sw.adjEbitda[1] + F.seg.sw.adjEbitda[2]) / 2 * (1 - AS.taxRate[1] / 100) / F.shares;

const itbs = {
  id: 'itbs', nav: 'IT & Business Services', kicker: 'Segment', title: 'IT & Business Services: three-quarters of the company, growing ~4%, with the most AI exposure',
  blocks: [
    { pair: [
      { type: 'column', title: 'ITBS revenue by quarter: US$2.5-2.8 bn, flat for three quarters', unit: 'ITBS revenue, US$ m (mix x total revenue)', x: QL, series: [{ name: 'ITBS', values: SQ.map(q => q.itbsUsd), fmt: 'num' }], labels: 'ends', min: 2000, source: 'Investor releases; GAM (segment US$ derived)' },
      { type: 'line', title: 'ITBS EBIT margin: 15.1% to 17.0% in a year after restructuring', unit: 'ITBS EBIT margin (%)', x: QL, series: [{ name: 'ITBS', values: SQ.map(q => q.itbsEbitPct), fmt: 'pct' }], labels: 'all', min: 12, max: 20, source: 'Investor releases' },
    ] },
    { bullets: [
      `**What it is.** Applications, infrastructure and cloud, digital workplace, networks, cybersecurity, data and AI, and business-process work. ₹${n0(A26.itbsRev)} cr in FY26, up from ₹${n0(A21.itbsRev)} cr in FY21 (${n1((Math.pow(A26.itbsRev / A21.itbsRev, 1 / 5) - 1) * 100)}% a year in rupees). Constant-currency growth was ${FY26.itbsCcGrowthPct}% in FY26 and ${Q1.itbsCcYoYPct}% YoY in Q1FY27 (flat QoQ in a seasonally weak quarter).`,
      `**Margins.** Segment EBIT margin ${n1(A22.itbsMarginPct)}% (FY22), ${n1(A23.itbsMarginPct)}% (FY23), ${n1(A24.itbsMarginPct)}% (FY24), ${n1(A25.itbsMarginPct)}% (FY25), ${n1(A26.itbsMarginPct)}% (FY26, after most of the ~65 bp restructuring charge). Q1FY27 ${Q1.itbsEbitPct}% (+184 bp YoY): the restructuring is paying off and the rupee helps.`,
      '**Where the growth comes from.** Financial services (+5.3% in Q1), public services (+12%), retail (+10%), and large managed-services and modernisation deals; AI Force (HCLTech\'s delivery platform) is now in 92 accounts. **Where it is weak:** two large US telecom clients cut digital spend for CY2026, two SAP programmes were cancelled, and a retail client scaled back a platform build.',
      '**The mega deal.** A Europe-headquartered Fortune Global 50 company chose HCLTech in early July 2026 to run its digital workplace and enterprise networks with AI (US$1.14 bn of new TCV per Equirus and PL). Transition starts in H2FY27; steady state in April 2027; "negligible" FY27 revenue (CEO).',
      '**The AI exposure.** This is where most of the "AI-disrupted" work sits (application support, infrastructure operations, service desks). HCLTech\'s answer is to offer the productivity first ("proactive transformation"), accepting lower revenue per contract to win share.',
    ] },
    { callout: `**Our forecast:** ITBS US$ revenue ${cc('itbs', 0)} / ${cc('itbs', 1)} / ${cc('itbs', 2)} in constant currency for FY27-29E (FY28 includes ~1 pt from the mega deal), i.e. ₹{{F.seg.itbs.revenue.0|num}} cr / ₹{{F.seg.itbs.revenue.1|num}} cr / ₹{{F.seg.itbs.revenue.2|num}} cr at ₹95.5-95.8 per US$, with EBIT margin of ${AS.segments[0].marginPct[0].toFixed(1)}% / ${AS.segments[0].marginPct[1].toFixed(1)}% / ${AS.segments[0].marginPct[2].toFixed(1)}%. We do not return margins to the 17.9% of FY22: AI productivity goes to clients.` },
  ],
};

const ers = {
  id: 'ers', nav: 'Engineering & R&D', kicker: 'Segment', title: 'Engineering & R&D: the best FY26 (+9.8%) turned into the weakest Q1 (+0.3%)',
  blocks: [
    { pair: [
      { type: 'column', title: 'ERS revenue by quarter: fell 3.7% QoQ in Q1FY27', unit: 'ERS revenue, US$ m (mix x total revenue)', x: QL, series: [{ name: 'ERS', values: SQ.map(q => q.ersUsd), fmt: 'num' }], labels: 'all', min: 400, source: 'Investor releases; GAM (segment US$ derived)' },
      { type: 'line', title: 'ERS EBIT margin: from 18.9% to 15.6% in six quarters', unit: 'ERS EBIT margin (%)', x: QL, series: [{ name: 'ERS', values: SQ.map(q => q.ersEbitPct), fmt: 'pct' }], labels: 'all', min: 12, max: 20, source: 'Investor releases' },
    ] },
    { bullets: [
      `**What it is.** Product engineering for technology, telecom, auto, aerospace, medical-device and semiconductor companies: software, embedded systems, mechanical design, chip (VLSI) design and verification. ₹${n0(A26.ersRev)} cr in FY26 (${n1((Math.pow(A26.ersRev / A21.ersRev, 1 / 5) - 1) * 100)}% a year since FY21), the largest such business among Indian tier-1 IT companies.`,
      `**FY26 boom, FY27 pause.** CC growth +${FY26.ersCcGrowthPct}% in FY26 (Q2FY26 +13.4% YoY), then +0.3% YoY and -3.7% QoQ in Q1FY27: two large US telecom clients cut discretionary engineering spend and technology clients slowed from a high base (CEO, Jul-2026).`,
      `**Margins.** ${n1(A23.ersMarginPct)}% (FY23), ${n1(A24.ersMarginPct)}% (FY24), ${n1(A25.ersMarginPct)}% (FY25), ${n1(A26.ersMarginPct)}% (FY26), ${Q1.ersEbitPct}% in Q1FY27: wage hikes (~90 bp in Q3FY26), restructuring and now lower utilisation as revenue fell.`,
      '**What could revive it.** Semiconductors (ASIC design on advanced nodes for a global chip major), physical AI and AI-factory engineering, and the HPE Telco Solutions business (telecom software platforms, ~1,500 engineers, closed in Aug-2026). The HPE unit is not in our numbers because its revenue was not disclosed in the sources we saw.',
    ] },
    { callout: `**Our forecast:** ERS ${cc('ers', 0)} / ${cc('ers', 1)} / ${cc('ers', 2)} CC (₹{{F.seg.ers.revenue.0|num}} cr in FY27E), EBIT margin ${AS.segments[1].marginPct[0].toFixed(1)}% / ${AS.segments[1].marginPct[1].toFixed(1)}% / ${AS.segments[1].marginPct[2].toFixed(1)}%, below the 18-20% of FY22-24: engineering pricing is now also exposed to AI tools, and growth needs the telecom cuts to lap.` },
  ],
};

const sw = {
  id: 'sw', nav: 'HCLSoftware', kicker: 'Segment', title: 'HCLSoftware: a 27%-margin cash cow with shrinking revenue and flat recurring revenue',
  blocks: [
    { pair: [
      { type: 'stacked', title: 'Software revenue by type: licences fading, subscription flat', unit: 'HCLSoftware revenue, US$ m', x: ['FY25', 'FY26'], series: [{ name: 'Subscription & support', values: [1173, 1190], fmt: 'num' }, { name: 'Perpetual licences & other', values: [178, 127], fmt: 'num' }, { name: 'Professional services', values: [73, 78], fmt: 'num' }], minLabel: 50, source: 'Q4FY26 investor release' },
      { type: 'line', title: 'ARR stuck around US$1.05 bn for two years', unit: 'Annual recurring revenue, US$ m (quarter end)', x: SW_Q.map(q => q.q), series: [{ name: 'ARR', values: SW_Q.map(q => q.swArrUsd), fmt: 'num' }], labels: 'all', min: 900, max: 1150, source: 'Investor releases' },
    ] },
    { bullets: [
      `**What it is.** Owned software, mostly bought: select IBM products (2019), Actian (data), Zeenea, Wobby and Jaspersoft (analytics, US$240 m, closed Jul-2026). Revenue US$${n0(FY26.swUsd)} m in FY26 (${FY26.swCcGrowthPct}% CC): subscription & support US$${n0(FY26.swSubscriptionUsd)} m (85%), perpetual licences US$${FY26.swPerpetualUsd} m (-29%), services US$${FY26.swServicesUsd} m. Q1FY27 US$${Q1.swUsd} m (${Q1.swCcYoYPct}% YoY CC).`,
      `**Margins are high and lumpy.** Segment EBIT ${n1(A22.swMarginPct)}% (FY22) to ${n1(A26.swMarginPct)}% (FY26) on segment revenue; quarterly from 17.6% (Q1FY27) to 35.0% (Q3FY26) because licence renewals bunch in the December quarter. EBITDA is far higher: amortisation of acquired IP was ₹1,759 cr in FY23 (16% of segment revenue, the last year disclosed), and its run-off has propped up EBIT while revenue stalled.`,
      '**Why it shrinks.** Several products (in what management calls the "experience" portfolio) are mature and declining; government buyers prefer perpetual licences, which are unpredictable; management expects the data and operations portfolios to offset the decline and sees FY27 as "flattish or marginally declining".',
      '**ROIC 21.6%** (Jun-2026, company measure) against 47.8% for Services: the IBM purchase earns its cost of capital but no more.',
    ] },
    { callout: `**Our forecast:** organic CC ${cc('sw', 0)} / ${cc('sw', 1)} / ${cc('sw', 2)}, plus Jaspersoft (+${S('sw').acquisitions[0]}% / +${S('sw').acquisitions[1]}%): ₹{{F.seg.sw.revenue.0|num}} cr in FY27E; EBIT margin ${AS.segments[2].marginPct[0].toFixed(1)}% / ${AS.segments[2].marginPct[1].toFixed(1)}% / ${AS.segments[2].marginPct[2].toFixed(1)}%. None of the brokers we saw values HCLSoftware separately and we do not either: at our ${X.peMult}x P/E its Sep-28E after-tax EBIT is worth ~₹${n0(swPe)} a share; even at 4x FY26 revenue, a generous multiple for a shrinking software business, it would be ~₹${n0(4 * A26.swRev / F.shares)}, ~₹${n0(4 * A26.swRev / F.shares - swPe)} a share more. It does not change the answer.` },
  ],
};

module.exports = { itbs, ers, sw };
