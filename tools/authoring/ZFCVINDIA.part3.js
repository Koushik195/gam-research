// ZF CV India report, part 3: domestic OEM (and the ESC/ADAS step), aftermarket, exports and services (the parent), moat.
const X = require('./ZFCVINDIA.ctx');
const { C, D, SG, SA, SQ, QL, A26, AS, F, BL, bld, RP, n0, n1, pc, pc1, rup } = X;
const GL = SG.growthLines, Q1 = C.q1fy27;
const b26 = { o: BL.base.oem, am: BL.base.am, ex: BL.base.exports, sv: BL.base.services, ot: BL.base.other };

const oem = {
  id: 'oem', nav: 'Domestic OEM & ESC', kicker: 'Business line: domestic OEM', title: 'Domestic OEM: grows with truck production, steps up with regulation; ESC on all trucks from Oct-2027',
  blocks: [
    { p: `Sales to Indian vehicle makers were ₹${n0(A26.oem)} cr in FY26 (+17.5%, against production +16.6%) and ~₹${n0(Q1.oemDerived)} cr in Q1FY27 (+${Q1.oemGrowthPct}% against +${Q1.cvProductionGrowthPct}%). In a normal year ZF CV India grows roughly with truck and bus production: it already supplies most platforms, so share gains are small. Growth above that comes from content: ABS became universal years ago, ESC became mandatory on most buses in Sep-2025 ("that's the uptick that you're seeing"), and from Oct-2027 every truck and bus above 6 tonnes needs ESC plus five ADAS functions. ZF has pneumatic ESC nominations from three major OEMs and full ADAS-suite awards from two; it expects to keep its "majority position" in ESC. Value per vehicle was ₹39.5k in Q4FY26 (₹45.5k in Q3 with one-off price settlements).` },
    { pair: [
      { type: 'column', title: 'OEM revenue per quarter: ₹393-597 cr, following the truck cycle', unit: 'Domestic OEM revenue (₹ crore)', x: QL, series: [{ name: 'Domestic OEM', values: SQ.map(q => q.oem), fmt: 'num' }], labels: 'all', source: 'Q4FY26 presentation p32; Q1FY27 derived from the stated +8.6%' },
      { type: 'column', title: 'Growth by line: OEM and aftermarket up, exports recovering', unit: 'Revenue growth year on year (%)', x: GL.rows.map(r => r[0]), series: [{ name: 'Domestic OEM', values: GL.rows.map(r => r[1]), fmt: 'pct0' }, { name: 'Aftermarket', values: GL.rows.map(r => r[2]), fmt: 'pct0' }, { name: 'Exports', values: GL.rows.map(r => r[3]), fmt: 'pct0' }, { name: 'Services', values: GL.rows.map(r => r[4]), fmt: 'pct0', color: '#7a5c99' }], labels: 'all', source: GL.src },
    ] },
    { exhibit: { type: 'table', title: 'Our build by business line (₹ crore)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Domestic OEM', n0(b26.o), ...bld.map(r => n0(r.o))],
      ['  growth', '+17.5%', ...BL.oemGrowth.map(x => pc1(x))],
      ['Aftermarket', n0(b26.am), ...bld.map(r => n0(r.am))],
      ['  growth', '+15.6%', ...BL.amGrowth.map(x => pc1(x))],
      ['Exports of goods', n0(b26.ex), ...bld.map(r => n0(r.ex))],
      ['  growth', '−11.1%', ...BL.exportsGrowth.map(x => pc1(x))],
      ['Services', n0(b26.sv), ...bld.map(r => n0(r.sv))],
      ['  growth', '+11.2%', ...BL.servicesGrowth.map(x => pc1(x))],
      ['Other operating revenue', n0(b26.ot), ...bld.map(r => n0(r.ot))],
      { hl: true, cells: ['**Revenue (build)**', `**${n0(A26.oem + A26.aftermarket + A26.exports + A26.services + b26.ot)}**`, ...bld.map(r => `**${n0(r.rev)}**`)] },
      ['Revenue in the model', '4,119', '{{F.sales.0|num}}', '{{F.sales.1|num}}', '{{F.sales.2|num}}'],
      ['EBITDA margin (company)', '16.0%', '{{F.ebitdaMargin.0|pct}}', '{{F.ebitdaMargin.1|pct}}', '{{F.ebitdaMargin.2|pct}}'],
    ], source: 'Q4FY26 call; AR FY26 note 18; GAM estimates (assumptions.json "build"); build and model agree to within 0.1%' } },
    { callout: `**Our view:** we model OEM revenue +${BL.oemGrowth[0]}% in FY27E (production ~+6% plus price recovery and bus content), then +${BL.oemGrowth[1]}% and +${BL.oemGrowth[2]}% as truck ESC arrives from Oct-2027. That puts OEM at ~₹${n0(bld[2].o)} cr in FY29E, 51% of revenue. The upside is ADAS content if ZF wins more than braking; the downside is a pre-buy before Oct-2027 followed by a production dip, which is what happened around BS-VI.` },
  ],
};

const aftermarket = {
  id: 'aftermarket', nav: 'Aftermarket', kicker: 'Business line: aftermarket', title: 'Aftermarket: +15.6% in FY26 and Q1FY27, the steadiest part of the business',
  blocks: [
    { p: `Spares and retrofits earned ₹${n0(A26.aftermarket)} cr in FY26 and ₹${Q1.aftermarket} cr in Q1FY27 (+${Q1.aftermarketGrowthPct}%, with a record ₹63 cr in June). They sell into the installed base of millions of trucks and buses fitted with ZF/WABCO air systems, plus new merchandise under the SPARK programme (disc-brake rotors, clutch master cylinders, brake pads, DEF, grease; air springs, cameras and water pumps in the pipeline) and retrofits (door controls, trailer EBS for oil-and-gas fleets). The network grew by 51 distributor branches and 14 service centres in FY26. Selective price increases took effect in July-2026. Margins are not disclosed, but spares normally earn more than OEM supply.` },
    { pair: [
      { type: 'column', title: 'Aftermarket: ₹429 cr (FY23) to ₹584 cr (FY26)', unit: 'Aftermarket revenue (₹ crore)', x: SA.map(a => a.fy), series: [{ name: 'Aftermarket', values: SA.map(a => a.aftermarket), fmt: 'num' }], labels: 'all', source: 'Q4FY26 presentation p33' },
      { type: 'column', title: 'Per quarter: ₹124 cr to ₹158 cr', unit: 'Aftermarket revenue (₹ crore)', x: QL, series: [{ name: 'Aftermarket', values: SQ.map(q => q.aftermarket), fmt: 'num' }], labels: 'all', source: 'Q4FY26 presentation p32; Q1FY27 call' },
    ] },
    { callout: `**Our view:** +${BL.amGrowth[0]}% in FY27E and +${BL.amGrowth[1]}% a year after: slower than FY26 as merchandise is a growing share and as fleet utilisation follows the freight cycle. Some traded items carry thinner margins than ZF's own spares.` },
  ],
};

const parent = {
  id: 'parent', nav: 'Exports & services (the parent)', kicker: 'Business lines: exports and services', title: 'Exports and services: a third of revenue sold to one ZF company at cost-plus prices',
  blocks: [
    { p: `Exports of goods fell 11% to ₹${n0(A26.exports)} cr in FY26 as US tariffs hit truck production (Americas −22% in Q4FY26, Europe +6%; sales ~50:50 between them), then rose ${Q1.exportsGrowthPct}% in Q1FY27 to ₹${Q1.exportsGoods} cr on new actuator and disc-brake-chamber programmes for North America. Services (software, R&D, business support for ZF's commercial-vehicle division) grew 11% to ₹${n0(A26.services)} cr and 12.5% in Q1FY27. Both lines are mostly sold to ZF CV Systems Global GmbH: ₹${n0(RP.zfGlobalSalesGoods)} cr of goods and ₹${n0(RP.zfGlobalServices)} cr of services in FY26, priced at a mark-up on cost (materials and conversion for goods; salaries and rent for services). Shareholders approved up to ₹2,500 cr of such transactions for FY27.` },
    { pair: [
      { type: 'column', title: 'Exports: ₹1,154 cr (FY25) to ₹1,025 cr (FY26)', unit: 'Exports of goods (₹ crore)', x: SA.map(a => a.fy), series: [{ name: 'Exports', values: SA.map(a => a.exports), fmt: 'num' }], labels: 'all', source: 'Q4FY26 presentation p33' },
      { type: 'hbar', title: 'Business with ZF CV Systems Global, FY26', unit: '₹ crore', x: ['Sales of components', 'Services rendered', 'Purchases', 'Royalty (other ZF entities)'], series: [{ name: 'FY26', values: [RP.zfGlobalSalesGoods, RP.zfGlobalServices, RP.zfGlobalPurchases, RP.royalty], fmt: 'num' }], labels: 'all', source: 'AR FY26 AOC-2 and note 35.2' },
    ] },
    { callout: `**Our view:** this half of the business is a low-risk annuity with a capped margin. It brings scale, technology and work that would not otherwise come to India, and it cushions the domestic truck cycle. But the parent sets the volumes and the mark-up, and receivables from it swung from ₹437 cr (Mar-25) to ₹192 cr (Mar-26). We model exports +${BL.exportsGrowth[0]}% a year (back to the FY25 level only in FY28E) and services +${BL.servicesGrowth[0]}% / +${BL.servicesGrowth[1]}% / +${BL.servicesGrowth[2]}%.` },
  ],
};

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: a real moat in Indian air brakes; the export half rides on the parent',
  blocks: [
    { verdicts: D.moat.map(r => r.map(rup)), head: ['Dimension', 'Verdict', 'Evidence', 'So what'], title: 'Moat scorecard', source: 'GAM research compilation (AR FY26, presentations and calls to Sep-2026)' },
    { callout: '**Honest verdict:** in India this is one of the few auto-component franchises with a genuine moat: safety-critical systems, validated on each platform, with a dominant installed base, an aftermarket tail and a regulatory pipeline (ESC, ADAS) it is best placed to win. The moat does not show up as exceptional margins (15-16.5% EBITDA) because a third of revenue is cost-plus business with the parent and because OEMs pass metal costs through slowly. The ADAS part of the 2027 opportunity is contestable.' },
  ],
};

module.exports = { oem, aftermarket, parent, moat };
