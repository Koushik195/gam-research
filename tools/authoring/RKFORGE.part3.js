// Ramkrishna Forgings report, part 3: domestic and export markets, the profit collapse (inventory affair and one-offs),
// the new businesses (castings, wheels, Mexico, new materials) and the competitive-advantage scorecard.
const X = require('./RKFORGE.ctx');
const { C, D, SA, SQ, QL, F, AS, n0, n1, pc, bld, BL, JV, expShare } = X;
const EG = C.business.exportsByGeography, AC = C.accounting, INV = C.inventoryIssue, G = C.guidance;
const yoy = (a, p) => pc((a / p - 1) * 100);

const markets = {
  id: 'markets', nav: 'Domestic & exports', kicker: 'Markets', title: 'Domestic revenue +20% a year; exports fell 20% in FY26 and are only now recovering',
  blocks: [
    { p: `Standalone domestic revenue grew from ₹${n0(SA[0].dom)} cr (FY24) to ₹${n0(SA[2].dom)} cr (FY26) as Indian truck production hit records and RKFL won railway, mining and PV business. Exports went the other way: ₹${n0(SA[1].exp)} cr in FY25, ₹${n0(SA[2].exp)} cr in FY26 (${yoy(SA[2].exp, SA[1].exp)}), with North America down ${pc((EG.FY26.northAmerica / EG.FY25.northAmerica - 1) * 100)} after US tariffs and a weak Class 8 market; Europe grew ${pc((EG.FY26.europe / EG.FY25.europe - 1) * 100)}. In Q1FY27 exports were ₹${n0(EG.Q1FY27.total)} cr (+11%), the best quarter since Q3FY25.` },
    { pair: [
      { type: 'column', title: 'Domestic revenue now ~2x exports', unit: 'Standalone revenue (₹ crore)', x: QL, series: [{ name: 'Domestic', values: SQ.map(q => Math.round(q.dom)), fmt: 'num' }, { name: 'Exports', values: SQ.map(q => Math.round(q.exp)), fmt: 'num' }], labels: 'none', source: 'Quarterly investor presentations' },
      { type: 'column', title: 'North America exports fell 35% in FY26', unit: 'Standalone exports (₹ crore)', x: ['FY25', 'FY26'], series: [{ name: 'North America', values: [EG.FY25.northAmerica, EG.FY26.northAmerica].map(Math.round), fmt: 'num' }, { name: 'Europe', values: [EG.FY25.europe, EG.FY26.europe].map(Math.round), fmt: 'num' }], labels: 'all', source: 'Q1FY27 investor presentation' },
    ] },
    { exhibit: { type: 'table', title: 'Our revenue build (₹ crore)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Standalone domestic', n0(BL.base.dom), ...bld.map(r => n0(r.dom))], ['  growth', '+20%', ...BL.domGrowth.map(g => `+${g}%`)],
      ['Standalone exports', n0(BL.base.exp), ...bld.map(r => n0(r.exp))], ['  growth', '−20%', ...BL.expGrowth.map(g => `+${g}%`)],
      ['Subsidiaries and other (net of eliminations)', n0(BL.base.oth), ...bld.map(r => n0(r.oth))], ['  growth', '+18%', ...BL.othGrowth.map(g => `+${g}%`)],
      { hl: true, cells: ['**Consolidated revenue**', '**4,238**', ...bld.map(r => `**${n0(r.rev)}**`)] },
      ['Exports, % of consolidated', `${Math.round(BL.base.exp / 4238 * 100)}%`, ...expShare.map(v => `${Math.round(v)}%`)],
    ], source: 'Investor presentations; GAM estimates. Management expects exports ~35% of consolidated revenue in FY27.' } },
    { p: AS.build._why },
  ],
};

const collapse = {
  id: 'collapse', nav: 'The profit collapse', kicker: 'What happened', title: 'The profit collapse: an inventory write-down hidden by one-offs, then a tariff year with none',
  blocks: [
    { p: `Peer screens (including our own Bharat Forge initiation) leave RKFL out because "its profit collapsed". The record: reported EPS went ₹16.1 (FY24) → ₹22.9 (FY25) → ₹3.9 (FY26), which looks like a sudden collapse in FY26. In fact FY25 was already weak. ${INV.what} ${INV.accounting}` },
    { exhibit: { type: 'table', title: 'From EBITDA to EPS: FY24-Q1FY27 (₹ crore, company basis)', head: ['', 'FY24 (restated)', 'FY25', 'FY26', 'Q1FY27'], rows: [
      ['Revenue', '3,705', '4,034', '4,238', '1,217'],
      ['EBITDA (before other income)', '773', '560', '643', '218'],
      ['  margin', '20.9%', '13.9%', '15.2%', '18.0%'],
      ['  of which inventory overstatement charged', '(FY24 share ₹50 cr in restated figures)', '~170', '–', '–'],
      ['Depreciation + interest', '403', '437', '543', '156'],
      ['Other income', '28', '26', '13', '3'],
      ['Exceptional items and JV share', '−1', '−1', '−29', '−1'],
      ['Tax', '114', `−184 (incl. ₹187 cr ACIL deferred-tax asset)`, '12', '18'],
      ['Discontinued operations (travel unit, sold)', '8', '83', '–', '–'],
      { hl: true, cells: ['**Net profit (reported)**', '**291**', '**415**', '**72**', '**47**'] },
      ['EPS reported (₹)', '16.1', '22.9', '3.9', '2.6'],
      { hl: true, cells: ['**EPS before one-offs (₹)**', '**16.1**', `**${C.annualKpis[3].cleanEps}**`, `**${C.annualKpis[4].cleanEps}**`, '**2.6**'] },
    ], source: 'Q1FY27 investor presentation (consolidated income statement); AR FY26 notes 11, 48, 50, 51. EPS before one-offs taxes continuing profit before exceptional items at 25.17%.' } },
    { bullets: [
      `**FY25:** EBITDA fell ₹213 cr, of which ~₹170 cr was the inventory correction (₹220.5 cr at Mar-25 less ₹50.2 cr already at Mar-24). Reported profit still rose to ₹415 cr because of a ₹193 cr deferred-tax credit (ACIL merger) and the ₹83 cr gain on the travel unit: ₹277 cr of one-offs, ~2.5x the underlying ~₹110 cr.`,
      '**FY26:** no inventory charge, but standalone exports fell 20% (US tariffs, Class 8 down 13-14%), energy and freight costs rose, depreciation (+23%) and interest (+27%) jumped as the new press lines and casting plant were commissioned, and the wheel JV lost ₹18 cr before production. Exceptional items netted −₹11 cr (labour codes −₹9 cr; an electricity-duty refund of +₹42 cr offset by a ₹42 cr provision on export receivables).',
      '**Forensic work:** the fact-finding study was done by independent external agencies and included forensic imaging of devices and interviews of SAP custodians; it found erroneous entries and unrecorded rejections, not misappropriation. The joint auditors (S.R. Batliboi, S.K. Naredi) signed FY25 and FY26 accounts with the effects booked; there is no open restatement as of 30-Sep-2026.',
      `**For valuation (PLAYBOOK §4):** FY25 and FY26 are trough years on EPS before one-offs (₹${C.annualKpis[3].cleanEps} and ₹${C.annualKpis[4].cleanEps}, both below half of FY24's ₹16.1), so the house rule leaves the forward P/E for those years out of our median. On reported EPS only FY26 is a trough: FY25's one-offs would let a year of inflated earnings into the history.`,
    ] },
    { callout: '**Our read:** the collapse was mostly operational (inventory errors, exports, a capex bulge) dressed up and then exposed by one-offs. Nothing found so far points to fraud, and Q1FY27 shows the operating recovery. But a company that overstated stock by ~5% of revenue for a year without noticing has to earn back the market\'s trust in its numbers: we flag accounting RED until a clean FY27.' },
  ],
};

const newbiz = {
  id: 'newbiz', nav: 'New businesses', kicker: 'Growth options', title: 'New businesses: castings and wheels are real and near; aerospace is a slide',
  blocks: [
    { exhibit: { type: 'table', title: 'What is being built, and what we put in the numbers', head: ['Business', 'Status (Sep-2026)', 'Management says', 'In our model'], wide: [1, 2], rows: [
      ['Iron castings (RCSL + RKFL)', '62,400 t; 79% used in Q1FY27; RKFL\'s 28,800 t line from 31-Mar-2026', G.castings, 'Part of +30% in subsidiaries/other and domestic growth'],
      ['Rail wheels (51% JV with Titagarh)', 'Trial production; 300 sample wheels in Aug-2026', G.wheels, `Equity-accounted: ₹${JV[0]} / ${JV[1]} / ${JV[2]} cr share of profit (FY27-29E)`],
      ['Mexico plant', 'Production started; ~₹6 cr revenue in Q1FY27', G.mexico, 'Inside subsidiaries/other'],
      ['Trailer axles', '~₹120 cr in FY26, ~4-5% share', G.trailerAxles, 'Inside domestic'],
      ['PV / EV forgings', '₹228 cr order in Q1FY27 (domestic EV maker)', G.pvEv, 'Inside domestic'],
      ['Aluminium, stainless, Inconel, titanium', 'Aluminium in bulk supply; others at RFQ stage', G.newMaterials, 'Nothing before FY29'],
    ], source: 'Q4FY26 and Q1FY27 calls and presentations' } },
    { callout: '**So what:** the wheel JV is the best new business: an assured Indian Railways buyer for 80,000 wheels and a partner that builds wagons. But it is equity-accounted (its revenue never shows in RKFL\'s), its capex and debt are not disclosed, and it lost money before starting. Castings and Mexico add revenue at margins below the forging core (castings 15-16% per management).' },
  ],
};

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: real customer stickiness, no pricing power',
  blocks: [
    { verdicts: D.moat, head: ['Source', 'Evidence', 'Verdict', 'So what'], title: 'Competitive advantage scorecard', source: 'GAM Research; AR FY26, investor presentations' },
    { callout: '**Verdict: a narrow edge, not a moat.** Qualification on safety-critical truck parts makes RKFL hard to replace on a running programme, and scale across processes is useful. But customers set prices, energy and freight are not passed through, and margins swing with utilisation (14-22% in five years). Returns were below the cost of capital in three of the last six years (FY21, FY25, FY26) on Screener\'s ROCE.' },
  ],
};

module.exports = { markets, collapse, newbiz, moat };
