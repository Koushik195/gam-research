// Bosch Ltd report, part 3: Automotive Products (mobility), RBIC (safety and braking), Consumer Goods, and the moat.
const X = require('./BOSCHLTD.ctx');
const { C, D, SG, SA, SQ, QL, A26, R, AS, F, bld, rbicPat, n0, n1, pc, pc1, rup } = X;
const BL = AS.build, Q1 = C.q1fy27, GL = SG.growthLines;
const g = (a, b) => pc1((a / b - 1) * 100);

const mobility = {
  id: 'mobility', nav: 'Automotive (mobility)', kicker: 'Segment: Automotive Products', title: 'Mobility: +17% in FY26 and +23% in Q1FY27, led by engine content; the aftermarket finally moving',
  blocks: [
    { p: `Automotive Products earned ₹${n0(A26.auto)} cr in FY26 (+${n1((A26.auto / SA[3].auto - 1) * 100)}%) and a segment result of ₹${n0(A26.autoResult)} cr (${n1(A26.autoResult / A26.auto * 100)}% of revenue, after allocated depreciation). Power Solutions grew 17.6%, ahead of production (+11%): more gasoline injection and engine management in cars, plus trucks, tractors and off-highway machines. The 2-Wheeler business grew 69% on OBD-II sensors and engine management for premium motorcycles. The aftermarket grew only 3.7% as the independent aftermarket stagnated. In Q1FY27 the segment grew ${n1(Q1.mobilityGrowthPct)}% (Power Solutions +${Q1.powerSolutionsGrowthPct}%, 2-Wheeler +${Q1.twoWheelerGrowthPct}%, aftermarket +${Q1.aftermarketGrowthPct}%) with a ${Q1.segments.autoPbitPct}% segment margin. Management called the Power Solutions gain "largely volume effect and maybe also some new introductions".` },
    { pair: [
      { type: 'column', title: 'Automotive revenue: +23% in Q1FY27 on the GST surge', unit: 'Automotive Products revenue per quarter (₹ crore)', x: QL, series: [{ name: 'Automotive', values: SQ.map(q => Math.round(q.auto)), fmt: 'num' }], labels: 'all', source: 'MOSL 1QFY27 note (company segment data); FY25 quarters derived from reported growth' },
      { type: 'column', title: 'Business-line growth: 2-wheelers and Power Solutions lead', unit: 'Revenue growth year on year (%)', x: GL.rows.map(r => r[0]), series: [{ name: 'Power Solutions', values: GL.rows.map(r => r[1]), fmt: 'pct0' }, { name: '2-Wheeler', values: GL.rows.map(r => r[2]), fmt: 'pct0' }, { name: 'Aftermarket', values: GL.rows.map(r => r[3]), fmt: 'pct0' }], labels: 'all', source: GL.src + ' (Q4FY26 aftermarket growth not disclosed)' },
    ] },
    { exhibit: { type: 'table', title: 'Our build: Bosch\'s own businesses plus RBIC (₹ crore)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Automotive Products', n0(BL.base.auto), ...bld.map(r => n0(r.au))],
      ['  growth', '+14.5%', ...BL.autoGrowth.map(x => pc1(x))],
      ['Consumer Goods', n0(BL.base.cg), ...bld.map(r => n0(r.cg))],
      ['Others', n0(BL.base.others), ...bld.map(r => n0(r.ot))],
      { hl: true, cells: ['**Bosch Ltd (before RBIC)**', `**${n0(A26.total)}**`, ...bld.map(r => `**${n0(r.bosch)}**`)] },
      ['  EBITDA margin', '13.2%', ...BL.boschMargin.map(x => n1(x) + '%')],
      ['RBIC (FY26 our estimate)', n0(BL.base.rbic), ...bld.map(r => n0(r.rb))],
      ['  EBITDA margin', '~19%', ...BL.rbicMargin.map(x => n1(x) + '%')],
      { hl: true, cells: ['**Consolidated revenue**', `**${n0(A26.total)}**`, ...bld.map(r => `**${n0(r.rev)}**`)] },
      ['Revenue in the model', n0(A26.total), '{{F.sales.0|num}}', '{{F.sales.1|num}}', '{{F.sales.2|num}}'],
      ['EBITDA (build / model margin)', '2,650', ...bld.map((r, i) => `${n0(r.ebitda)} / {{F.ebitdaMargin.${i}|pct}}`)],
    ], source: 'AR FY26 note 33; RBIC deck; GAM estimates (assumptions.json "build"); model and build agree to within 0.1%' } },
    { callout: `**Our view:** we assume Automotive grows ${BL.autoGrowth[0]}% in FY27 (Q2 +18%, Q3 +13%, Q4 +9% as the GST base bites), then ${BL.autoGrowth[1]}% and ${BL.autoGrowth[2]}%, with Bosch's own margin at ${BL.boschMargin.join('% / ')}%. That is above management's "flattish" May outlook and close to the run-rate since. The upside is CAFE 3 and CV ADAS content from 2027; the downside is that GST pulled demand forward and that every point of growth comes with more traded content from the parent.` },
  ],
};

const rbic = {
  id: 'rbic', nav: 'RBIC (safety & braking)', kicker: 'Segment: Bosch Chassis Systems', title: 'RBIC: the best business in the group\'s India portfolio, bought at a fair price from the parent',
  blocks: [
    { p: `RBIC makes the brakes and safety electronics that regulation and buyers increasingly demand: ESP and ABS (it introduced both in India), conventional and new braking systems (iBooster and integrated power brakes for EVs), airbag control units and vehicle-dynamics sensors. Revenue grew from ₹${n0(R.revenue.FY23)} cr (FY23) to ₹${n0(R.revenue.FY25)} cr (FY25), 17% a year, and the EBITDA margin from ${R.ebitdaMarginPct.FY23}% to ${R.ebitdaMarginPct.FY25}% on localisation and a richer mix; 9MFY26 revenue was ₹${n0(R.revenue['9MFY26'])} cr. Management expects to "hold margins very steady for the next 5 years or so", with "some pressure" from OEM customisation, and says the order book is "very, very full". The portfolio is powertrain-agnostic: an electric car needs ESP and brakes as much as a petrol car.` },
    { exhibit: { type: 'table', title: 'The deal', head: ['', 'Detail'], wide: [1], rows: [
      ['Price', `₹${n0(R.consideration)} cr for 100% (₹${n0(R.cashPaid)} cr cash + 2,460 Bosch shares at ₹35,200); 10.6x FY25 EV/EBITDA, ${n1(R.consideration / R.patFY25)}x FY25 PAT, ${n1(R.consideration / R.netWorthMar25)}x Mar-25 book`],
      ['Implied cash in RBIC', `~₹${n0(R.impliedCash)} cr (equity value less 10.6x FY25 EBITDA of ₹${n0(R.ebitdaFY25)} cr)`],
      ['Process', 'PwC valuation (DCF and comparable companies), ICICI Securities fairness opinion; related-party vote by postal ballot (promoter barred), approved 8-May-2026; completed Jul-2026'],
      ['Accounting', 'Common control: no goodwill or amortisation (MD, Aug-2026); consolidated from Q2FY27; we include it for all of FY27'],
      ['Management\'s case', 'Pro forma FY25: revenue +22%, EBITDA margin 12.8% to 13.9%, EPS +5% (₹683 to ₹720); "minimal" cost synergies'],
      ['Royalty', 'RBIC pays royalty and transfer prices "very similar" to Bosch Ltd (CFO, Apr-2026)'],
    ], source: 'RBIC deck, investor call (13-Apr-2026), postal ballot notice (8-Apr-2026), AR FY26 note 49, Q1FY27 call' } },
    { exhibit: { type: 'table', title: 'RBIC in our model (₹ crore)', head: ['', 'FY23', 'FY24', 'FY25', 'FY26E', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Revenue', n0(R.revenue.FY23), n0(R.revenue.FY24), n0(R.revenue.FY25), n0(BL.base.rbic), ...bld.map(r => n0(r.rb))],
      ['EBITDA margin', `${R.ebitdaMarginPct.FY23}%`, `${R.ebitdaMarginPct.FY24}%`, `${R.ebitdaMarginPct.FY25}%`, 'n.d.', ...BL.rbicMargin.map(x => n1(x) + '%')],
      ['EBITDA', n0(R.revenue.FY23 * R.ebitdaMarginPct.FY23 / 100), n0(R.revenue.FY24 * R.ebitdaMarginPct.FY24 / 100), n0(R.ebitdaFY25), 'n.d.', ...bld.map(r => n0(r.rbicE))],
      { hl: true, cells: ['**Net profit (FY27E-29E: GAM)**', n0(R.revenue.FY23 * R.patMarginPct.FY23 / 100), n0(R.revenue.FY24 * R.patMarginPct.FY24 / 100), `**${n0(R.patFY25)}**`, 'n.d.', ...rbicPat.map(v => `**${n0(v)}**`)] },
      ['  as % of the price paid', '', '', n1(R.patFY25 / R.consideration * 100) + '%', '', ...rbicPat.map(v => n1(v / R.consideration * 100) + '%')],
    ], source: 'RBIC deck (FY23-FY24 profit from stated margins); GAM estimates (depreciation ~₹100-120 cr, other income on its ~₹1,030 cr cash, tax 25%)' } },
    { callout: `**Our view:** RBIC is the part of the Bosch story we like most: regulated, powertrain-agnostic content with a 19% margin. We model ${BL.rbicGrowth.join('% / ')}% growth (MOSL: 12% CAGR FY26-28E). The deal lifts our FY27E EPS by ~${Math.round(X.accretion27)}% versus Bosch without RBIC (₹${n1(F.eps[0])} vs ₹${n1(X.exRbicEps27)}), because the ₹9,060 cr it cost earned only ~6.5% before tax in the treasury. But the market priced this in: the stock rose ~19% in three sessions after the announcement and is up again since.` },
  ],
};

const consumer = {
  id: 'consumer', nav: 'Power tools', kicker: 'Segment: Consumer Goods', title: 'Power tools: 9% of revenue, single-digit margins, a trading business',
  blocks: [
    { p: `Consumer Goods (Bosch power tools) earned ₹${n0(A26.cg)} cr in FY26 (+6.4%) and a segment result of ₹${n0(A26.cgResult)} cr (${n1(A26.cgResult / A26.cg * 100)}%), down from ${n1(SA[2].cgResult / SA[2].cg * 100)}% in FY24. It is largely a trading business: Bosch bought ₹966 cr of goods from Robert Bosch Power Tools GmbH in FY26. Q1FY27 was strong (+${Q1.consumerGoodsGrowthPct}%, segment margin ${Q1.segments.cgPbitPct}%) on construction demand and online sales. We grow it ${BL.cgGrowth.join('% / ')}%; it matters little to value.` },
    { exhibit: { type: 'table', title: 'Segment results (₹ crore and % of segment revenue)', head: ['', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'], rows: [
      ['Automotive result', ...SA.map(a => `${n0(a.autoResult)} (${n1(a.autoResult / a.auto * 100)}%)`)],
      ['Consumer Goods result', ...SA.map(a => `${n0(a.cgResult)} (${n1(a.cgResult / a.cg * 100)}%)`)],
      ['Others result', ...SA.map(a => n0(a.othersResult))],
    ], source: 'Annual reports, note 33 (after allocated depreciation; before unallocated income and corporate costs)' } },
  ],
};

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: a strong franchise, but much of the moat belongs to the parent',
  blocks: [
    { verdicts: D.moat.map(r => r.map(rup)), head: ['Dimension', 'Verdict', 'Evidence', 'So what'], title: 'Moat scorecard', source: 'GAM research compilation (annual reports, presentations and calls to Aug-2026, Screener.in peers)' },
    { callout: '**Honest verdict:** Bosch has a real moat in India, built on the Bosch name, technology and OEM relationships, and RBIC adds the most defensible piece (safety systems). But the moat is largely rented from Robert Bosch GmbH: the listed company pays for technology (₹478 cr royalty), engineering and IT services (₹1,097 cr) and buys much of what it sells from the group. That is why a dominant supplier earns a 13% EBITDA margin. The moat protects revenue; the parent decides how much of the profit stays in India.' },
  ],
};

module.exports = { mobility, rbic, consumer, moat };
