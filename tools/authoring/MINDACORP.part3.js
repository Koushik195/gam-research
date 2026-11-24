// Minda Corporation report, part 3: the two verticals and Minda Vast, Flash Electronics and the other associates/JVs
// (incl. how we model them), the new ventures, and the moat.
const X = require('./MINDACORP.ctx');
const { C, D, SQ, QL, BL, bld, oiB, assocShareOfPat, n0, n1, pc, TAX } = X;
const FL = C.flash, VA = C.vast;
const qcol = (k, t, name) => ({ type: 'column', title: t, unit: `${name} revenue per quarter (₹ crore)`, x: QL, series: [{ name, values: SQ.map(q => q[k]), fmt: 'num' }], labels: 'all', source: 'Company presentations (Q2FY25 and Q2FY26 derived)' });
const yoyQ = k => SQ.map((q, i) => (i >= 4 ? Math.round((q[k] / SQ[i - 4][k] - 1) * 100) : null));

const verticals = {
  id: 'verticals', nav: 'The two verticals', kicker: 'Segments', title: 'Connected systems grow ~30% on clusters and harnesses; mechatronics grows ~13% plus Minda Vast',
  blocks: [
    { h: 'Information & Connected Systems (54% of FY26 revenue)' },
    { p: 'Wiring harnesses (31% of FY26 revenue) and instrument clusters (17%) are the growth engine. Harness growth comes from more content per vehicle (high-voltage harnesses for EVs, power-distribution and battery-disconnect units, CCS wires), share gains in two-wheelers, three-wheelers and trucks, and localisation of connectors (in-house supply now ~18-19% of needs). Japanese car makers are served by Furukawa Minda, an associate, so Minda Corp\'s own harness business is mostly 2W/3W/CV. Clusters are moving from analogue to TFT screens (3-15 inch) across two-wheelers, trucks and cars, with platform-level orders from several OEMs entering production in FY27. Q1FY27: harness >30%, clusters >35%, vertical +34%.' },
    { pair: [
      qcol('ics', 'ICS revenue: ₹575 cr to ₹983 cr a quarter in two years', 'Information & connected systems'),
      { type: 'column', title: 'ICS growth year on year: 20-34% for five quarters', unit: 'Growth year on year (%)', x: QL.slice(4), series: [{ name: 'ICS', values: yoyQ('ics').slice(4), fmt: 'pct0' }, { name: 'Mechatronics', values: yoyQ('mechatronics').slice(4), fmt: 'pct0' }], labels: 'all', source: 'Company presentations; Q1FY27 mechatronics includes ~₹125 cr from Minda Vast (ex-Vast ~+14%)' },
    ] },
    { h: 'Mechatronics, Aftermarket & Others (46%), now with Minda Vast' },
    { p: `Vehicle access and security systems (22% of FY26 revenue: ignition locks, steering locks, handles, immobilisers, smart keys), aluminium die castings (15%; a new export-focused plant in Pune), the Spark Minda aftermarket (~10%) and EV systems. The vertical grew 15% in FY26 and 33% in Q1FY27, of which ~₹${VA.q1Revenue} cr came from Minda Vast (consolidated from Apr-2026 after a change in the shareholders' agreement; Minda still owns 50%). Vast makes PV door handles, latches, locks and passive-entry systems; it had ~₹${VA.fy26Revenue} cr of revenue in FY26 at ~${VA.fy26MarginPct}% EBITDA margin and ${VA.q1MarginPct}% in Q1FY27 (+${VA.q1GrowthPct}% revenue). Management sees the kit value per car (₹8,000-13,000 today) roughly doubling with new products. It lifts Minda Corp's PV share from 15% to 19% but dilutes the margin, and half its profit goes to minorities.` },
    { pair: [
      qcol('mechatronics', 'Mechatronics revenue: ₹863 cr in Q1FY27 incl. Vast', 'Mechatronics, aftermarket & others'),
      { type: 'column', title: 'Our build: the verticals and Vast (₹ crore)', unit: 'Revenue (₹ crore)', x: ['FY26', 'FY27E', 'FY28E', 'FY29E'], series: [
        { name: 'Mechatronics (organic)', values: [BL.base.mechatronics, ...bld.map(r => Math.round(r.mech))], fmt: 'num' },
        { name: 'ICS', values: [BL.base.ics, ...bld.map(r => Math.round(r.ics))], fmt: 'num' },
        { name: 'Minda Vast', values: [0, ...bld.map(r => Math.round(r.vast))], fmt: 'num' }], labels: 'all', source: 'Company (FY26); GAM estimates (assumptions.json "build")' },
    ] },
    { exhibit: { type: 'table', title: 'Our build (₹ crore)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Mechatronics, aftermarket & others (organic)', n0(BL.base.mechatronics), ...bld.map((r, i) => `${n0(r.mech)} (${pc(BL.growth.mechatronics[i])})`)],
      ['Information & connected systems', n0(BL.base.ics), ...bld.map((r, i) => `${n0(r.ics)} (${pc(BL.growth.ics[i])})`)],
      ['Minda Vast (consolidated from FY27)', '–', ...bld.map(r => n0(r.vast))],
      { hl: true, cells: ['**Revenue (= model)**', '**6,185**', ...bld.map(r => `**${n0(r.rev)}**`)] },
    ], source: `GAM estimates. ${AS_WHY()}` } },
  ],
};
function AS_WHY() { return X.AS.build._why; }

const flash = {
  id: 'flash', nav: 'Flash & the associates', kicker: 'Associates and minorities', title: `Flash Electronics: a good EV business bought at a full price; associates ~${Math.round(assocShareOfPat[1])}% of FY28E profit`,
  blocks: [
    { p: `Flash Electronics makes magnetos, alternators, regulator-rectifiers, motors, motor controllers and chargers for two- and three-wheelers, with plants in India, Germany and Hungary and customers including Bajaj, Royal Enfield, Suzuki, Yamaha, Piaggio and Mahindra as well as KTM, Ducati, Triumph, BMW, Audi and Porsche. Minda Corp bought 49% on 15-Jan-2025 for ₹${n0(FL.cost)} cr. In FY26 Flash earned ₹${n0(FL.fy26.revenue)} cr of revenue (+17%), ₹${FL.fy26.ebitda} cr of EBITDA (${FL.fy26.marginPct}%) and ₹${FL.fy26.pat} cr of profit; in Q1FY27 revenue rose ${FL.q1fy27.growthPct}% to ₹${FL.q1fy27.revenue} cr but the margin fell to ${FL.q1fy27.marginPct}% on commodity and labour costs. EV products are ~30% of its revenue (+90% in Q1). Management guides 20-24% growth and a 16-17% margin. Minda books 49% of Flash's profit after acquisition-related depreciation: ~₹70 cr in FY26, ~₹18 cr in Q1FY27 (₹25 cr in Q4FY26).` },
    { pair: [
      { type: 'column', title: 'Flash: revenue and EBITDA by quarter', unit: '₹ crore (100% of Flash)', x: ['Q4FY25', 'Q1FY26', 'Q3FY26', 'Q4FY26', 'Q1FY27'], series: [{ name: 'Revenue', values: [371, 376, 488, 493, FL.q1fy27.revenue], fmt: 'num' }, { name: 'EBITDA', values: [43, 59, 90, 89, FL.q1fy27.ebitda], fmt: 'num' }], labels: 'all', source: 'Q4FY26 presentation p10; Q1FY27 presentation p8' },
      { type: 'column', title: 'What Minda paid vs what it earns', unit: '₹ crore', x: ['Price paid (49%)', 'Carrying value Mar-26', '49% of Flash net assets', 'Share of profit FY26'], series: [{ name: '₹ crore', values: [FL.cost, FL.carryingMar26, Math.round(FL.netAssetsMar26 * 0.49), 70], fmt: 'num' }], labels: 'all', source: 'AR FY25; AR FY26 notes 2.4 and 2.49; Q4FY26 call' },
    ] },
    { exhibit: { type: 'table', title: 'How we model associates and minorities (₹ crore; post-tax)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Share of associate/JV profit (Flash ~90%)', '81', ...oiB.map(r => n0(r.as))],
      ['Minority interests (50% of Vast; 40% of Toyodenso JV)', '−2 (loss)', ...oiB.map(r => n0(r.mi))],
      ['Recurring other income (pre-tax)', '15', ...oiB.map(r => n0(r.rec))],
      { hl: true, cells: [`**Other income in the model ((associates − minorities) ÷ (1 − ${Math.round(TAX * 100)}%) + recurring)**`, '14 (Screener)', ...oiB.map(r => `**${n0(r.model)}**`)] },
      ['Associates as % of owners\' profit', '22%', ...assocShareOfPat.map(v => n0(v) + '%')],
    ], source: 'Company (FY26: Flash ~₹70 cr, Furukawa ~₹8 cr, Vast ~₹5 cr); GAM estimates. The engine has no associate or minority line: both enter other income grossed up for tax so that net profit equals owners\' profit.' } },
    { callout: `**Why it matters:** P/E captures Flash (its profit is in EPS); EV/EBITDA and DCF do not, except at its ₹${n0(FL.carryingMar26)} cr book value. On the price paid, Flash earns ~5% a year today; at 20-24% growth and a 16-17% margin Minda's share of its profit would rise ~75% by FY29E in our numbers, which is what the market is paying for. The risk is that two-wheeler EV makers in-source motors and controllers, and that Flash's margin stays near Q1's 15%.` },
  ],
};

const newjv = {
  id: 'newjv', nav: 'New ventures & Vision 2030', kicker: 'New businesses', title: 'Three new JVs and a Vision 2030 target that needs ~20% growth a year',
  blocks: [
    { exhibit: { type: 'table', title: 'New ventures (all known by 30-Sep-2026)', head: ['Venture', 'Stake / accounting', 'Product and status', 'Ambition'], wide: [2], rows: C.otherJVs.slice(0, 3).map(([n, s, w]) => [n, s, w, '']).map((r, i) => { r[3] = ['₹650 cr revenue by 2030; lifetime orders >₹1,000 cr', '₹500 cr revenue by 2030; 15% market share', 'Controllers SOP Oct-Nov 2026; motors in advanced talks'][i]; return r; }), source: 'Q4FY26 presentation p5-6; Vision 2030 deck p39; Q4FY26 and Q1FY27 calls' } },
    { p: 'Vision 2030 (Sep-2025): group revenue of ₹17,500 cr+ by FY30 (management later said this includes Flash and inorganic moves; group revenue was ~₹9,000 cr in FY26), EBITDA margin above 12.5%, ROCE above 25%, debt-equity 0.3x, exports ₹1,500 cr and PVs 25% of revenue, with ~₹2,000 cr of capex over five years. The CFO says ~19-20% a year gets there. Our forecasts imply consolidated revenue of ₹{{F.sales.2|num}} cr in FY29E (~15% a year after FY27) and a {{F.ebitdaMargin.2|pct}} margin: below the vision, because we do not model acquisitions and we assume the GST-driven volume boost fades.' },
    { callout: '**Our read:** the JVs give Minda Corp access to technology it lacks (switches, sunroofs, axial-flux motors), but two of the three are equity-accounted and all three will lose money before they earn it. Their revenue is small against a ₹7,700 cr company in FY27E; they matter for FY29 and beyond.' },
  ],
};

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: customer breadth and partners, no pricing power',
  blocks: [
    { verdicts: D.moat, head: ['Dimension', 'Verdict', 'Evidence', 'So what'], title: 'Moat scorecard', source: 'GAM research compilation (annual reports, presentations and calls to Aug-2026; broker notes)' },
    { callout: '**Verdict: no durable moat, a decent franchise.** Minda Corp is an established, mid-sized supplier to most Indian two-wheeler and truck makers, moving up the value chain in harnesses and clusters with partners\' help. Its listed rivals (Motherson Sumi Wiring in harnesses, Pricol in instrument clusters) are larger or as capable in their niches, margins have never exceeded 12%, and commodity costs are passed through without a margin. Growth and returns depend on winning programmes one by one.' },
  ],
};

module.exports = { verticals, flash, newjv, moat };
