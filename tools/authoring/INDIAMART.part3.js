// IndiaMART report, part 3: the marketplace, Busy, the strategic stakes, and the competitive-advantage scorecard.
const X = require('./INDIAMART.ctx');
const { C, D, F, AS, SA, SQ, A26, Q1, n0, n1, pc, seg, imM } = X;
const QL = SQ.filter(x => x.imRev).map(x => x.q), QI = SQ.filter(x => x.imRev);
const ST = C.stakes;

const marketplace = {
  id: 'marketplace', nav: 'The marketplace', kicker: 'Segment: IndiaMART', title: 'The marketplace: 92% of revenue, a 38-41% margin, growth now all from ARPU',
  blocks: [
    { p: `Standalone revenue was ₹${n0(A26.imRev)} cr in FY26 (+9.3%) and ₹${Q1.standalone.sales} cr in Q1FY27 (+9%), with adjusted EBITDA (before ESOP) of ₹${n0(A26.imAdjEbitda)} cr (${A26.imMargin}%) and ₹${Q1.standalone.adjEbitda} cr (${n1(Q1.standalone.adjEbitda / Q1.standalone.sales * 100)}%). Collections, the cash paid by customers, grew 10% in FY26 and 8% in Q1FY27; deferred revenue was ₹${n0(Q1.standalone.deferredRevenue)} cr (+14%), of which ~20% is recognised within three months, so revenue growth of 9-10% is largely booked for FY27. The paying base fell by ${n0(-Q1.standalone.netAddsK * 1000)} in Q1FY27 to ${Q1.standalone.payingSuppliersK}K: management raised Silver prices in Q2FY26, gross additions slowed, and it now refuses to buy low-quality customers that churn within a year. ARPU rose ~8% to ₹${Q1.standalone.arpuK}K.` },
    { pair: [
      { type: 'column', title: 'Standalone revenue: ₹346 cr to ₹376 cr in five quarters', unit: 'Standalone revenue (₹ crore)', x: QL, series: [{ name: 'Revenue', values: QI.map(x => x.imRev), fmt: 'num' }], labels: 'all', source: 'Q4FY26 and Q1FY27 investor presentations (legal-entity view)' },
      { type: 'line', title: 'Paying suppliers fell in each of the last three quarters', unit: 'Paying suppliers (000s)', x: SQ.map(x => x.q), series: [{ name: 'Paying suppliers', values: SQ.map(x => x.suppliersK), fmt: 'num' }], labels: 'all', min: 210, max: 225, source: 'Q4FY26 and Q1FY27 investor presentations' },
    ] },
    { exhibit: { type: 'table', title: 'Standalone cost structure (functional P&L, ₹ crore)', head: ['', 'FY23', 'FY24', 'FY25', 'FY26', 'Q1FY27'], rows: [
      ['Revenue', '939', '1,139', '1,320', '1,443', '376'],
      ['Customer service cost', '237', '309', '303', '343', '85'],
      ['Selling & marketing (% of revenue)', '189 (20%)', '211 (18%)', '181 (14%)', '229 (16%)', '54 (14%)'],
      ['Technology & content (%)', '175 (19%)', '199 (17%)', '201 (15%)', '226 (16%)', '58 (15%)'],
      ['General & administration', '76', '87', '122', '125', '29'],
      { hl: true, cells: ['**EBITDA after ESOP (margin)**', '**262 (28%)**', '**334 (29%)**', '**513 (39%)**', '**520 (36%)**', '**149 (40%)**'] },
    ], source: 'Q1FY27 investor presentation p46 (functional P&L, standalone)' } },
    { p: `**Our forecast:** standalone revenue +${AS.segments[0].growth[0]}% / +${AS.segments[0].growth[1]}% / +${AS.segments[0].growth[2]}% (₹${n0(seg.im.revenue[0])} cr / ₹${n0(seg.im.revenue[1])} cr / ₹${n0(seg.im.revenue[2])} cr), with a flat-to-slightly-rising supplier base and ARPU up 8-9% a year, and an adjusted margin of ${n1(imM[0])}%. The margin is the key judgement: selling and marketing fell from 20% of revenue (FY23) to 14% (Q1FY27). If management decides to re-accelerate gross additions, each percentage point of revenue spent on acquisition takes ~1 point off the margin.` },
    { callout: '**So what:** this is a business with pricing power over its best customers and no momentum in customer numbers. The bull case needs Silver churn to fall (management: results "visible after a year or so"); the bear case is that AI assistants erode the buyer enquiries that make the subscriptions worth paying for. Neither shows in the Q1FY27 numbers yet.' },
  ],
};

const busy = {
  id: 'busy', nav: 'Busy (accounting software)', kicker: 'Segment: Busy', title: 'Busy: ₹119 cr of revenue growing ~30%, but only 8% of the group and a ₹509 cr purchase',
  blocks: [
    { p: `Busy sells accounting, inventory and GST software to MSMEs (4.54 lakh licences sold to date, ~45K new a year). FY26 revenue was ₹${A26.busyRev} cr (+80%; ~44% normalised for the switch from perpetual licences to subscriptions, which spreads revenue over time) and EBITDA ₹${A26.busyEbitda} cr (${A26.busyMargin}%). In Q1FY27 revenue rose 47% to ₹${Q1.busy.revenue} cr but EBITDA was only ₹${Q1.busy.ebitda} cr as Busy relaunched its product (Busy Magic); billing rose 10% (~30% excluding ~₹10 cr of one-off win-backs a year earlier) and deferred revenue 44% to ₹${Q1.busy.deferredRevenue} cr. Management targets 27-30% growth for the next couple of years and 15-20% licence growth.` },
    { pair: [
      { type: 'column', title: 'Busy revenue: ₹43 cr (FY23) to ₹119 cr (FY26)', unit: '₹ crore', x: SA.filter(a => a.busyRev).map(a => a.fy), series: [{ name: 'Revenue', values: SA.filter(a => a.busyRev).map(a => a.busyRev), fmt: 'num' }, { name: 'Billing', values: SA.filter(a => a.busyRev).map(a => a.busyBilling), fmt: 'num' }], labels: 'all', source: 'Q1FY27 investor presentation (Busy slides)' },
      { type: 'column', title: 'Busy EBITDA margin swings with investment', unit: 'EBITDA margin (%)', x: [...SA.filter(a => a.busyRev).map(a => a.fy), 'Q1FY27'], series: [{ name: 'EBITDA margin', values: [...SA.filter(a => a.busyRev).map(a => a.busyMargin), Math.round(Q1.busy.ebitda / Q1.busy.revenue * 1000) / 10], fmt: 'pct' }], labels: 'all', source: 'Q1FY27 investor presentation' },
    ] },
    { callout: `**Our forecast:** revenue +${AS.segments[1].growth.join('% / +')}% (₹${n0(seg.busy.revenue[2])} cr by FY29E) at ${AS.segments[1].marginPct.join('% / ')}% EBITDA margins: ₹${n0(seg.busy.adjEbitda[2])} cr of EBITDA in FY29E. Even on these numbers Busy is ~3-4% of group EBITDA. It is a good business, but it does not change the investment case; the ₹509 cr price looks full against ₹21 cr of FY26 EBITDA.` },
  ],
};

const stakes = {
  id: 'stakes', nav: 'Strategic stakes & treasury', kicker: 'Investments', title: '₹750 cr in 13 start-ups: equity losses of ₹55 cr a year, fair-value gains that flatter EPS',
  blocks: [
    { p: `Between FY21 and FY26 IndiaMART invested ~₹750 cr in minority stakes (book value ₹${n0(C.fy26.strategic)} cr at Mar-26, ₹${Q1.strategic} cr at Jun-26). Associates (where it has significant influence) are equity-accounted: their share of losses was ₹${n1(C.fy26.assoc)} cr in FY26 and ₹${Q1.assoc} cr in Q1FY27, and Screener deducts it inside expenses (so the model EBITDA is ~₹55 cr below the company's). Other stakes are carried at fair value, and their revaluation runs through other income: ₹78 cr of gains in FY26. Management continues follow-on rounds (Bizom 10% → 32%, Fleetx 16-17% → 22%) and says it does not want "too many strategic investments".` },
    { exhibit: { type: 'table', title: 'The portfolio at cost (₹ crore, holding)', head: ['Company', 'What it does', 'Invested', 'Holding'], wide: [1], rows: [
      ...ST.rows.slice(0, 8).map(([nm, cost, h]) => [nm, { 'Fleetx Technologies': 'Fleet telematics and logistics SaaS', 'IB MonotaRO (Industry Buying)': 'B2B industrial e-commerce', 'Baldor Technologies (IDfy)': 'Identity and KYC verification', 'Simply Vyapar Apps (Vyapar)': 'Mobile billing and accounting for micro businesses', 'Mobisy Technologies (Bizom)': 'Retail distribution SaaS', 'Mynd Solutions (M1xchange)': 'Invoice-discounting exchange (TReDS)', 'Truckhall (SuperProcure)': 'Freight procurement SaaS', 'Agillos E-Commerce (Aerchain)': 'Procurement software' }[nm] || '', n0(cost), h + '%']),
      ['Five others', 'EasyEcom, Zimyo, Adansa, Legistify, Instant Procurement', n0(ST.rows.slice(8).reduce((s, r) => s + r[1], 0)), '10-26%'],
      { hl: true, cells: ['**Total strategic**', '', `**${n0(ST.rows.reduce((s, r) => s + r[1], 0))}**`, `book ₹${n0(C.fy26.strategic)} cr`] },
      ['Subsidiaries: Busy Infotech, Livekeeping', 'Accounting software', '509 + 96', '100%'],
    ], source: 'AR FY26 (strategic investments); Q1FY27 call (follow-on rounds)' } },
    { exhibit: { type: 'table', title: 'Other income: treasury return vs one-offs (₹ crore)', head: ['', ...C.otherIncomeBuild.years], rows: [
      ...C.otherIncomeBuild.rows.map(([nm, ...v]) => [nm, ...v.map(x => (x == null ? 'not split' : n1(x)))]),
      { hl: true, cells: ['**Total other income**', ...C.otherIncomeBuild.total.map(v => `**${n1(v)}**`)] },
      ['One-offs (rows 3-4) as % of EPS', ...C.otherIncomeBuild.years.map(fy => pc(X.oneOffEps[2000 + +fy.slice(2)] / X.epsRep[2000 + +fy.slice(2)] * 100).replace('+', ''))],
    ], source: 'AR FY24 and AR FY26 (consolidated note 20); FY23-FY24 interest and write-backs (₹6 cr, ₹4 cr) not split in our extract; GAM Research (one-offs after 25% tax)' } },
    { callout: `**How we treat them:** the treasury return (debt funds and bonds, marked to market) is real and recurring over time, so we forecast it: ${AS.treasuryYield[0]}% on opening treasury in FY27E. Fair-value gains on start-ups are not cash and not forecast; we remove them from the EPS history used to derive the multiple. The stakes themselves are worth their book value (~₹125 a share) at most in our view: they are minority positions in loss-making private companies with no visible exit.` },
  ],
};

const MO = D.moat;
const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: a real network and pricing power, now being tested by stalled volumes and AI search',
  blocks: [
    { verdicts: MO.map(([a, v, e, r]) => [a, v, e, r]), head: ['Source of advantage', 'Strength', 'Evidence', 'What could erode it'], title: 'Competitive advantage scorecard', source: 'Company presentations and calls; MOSL (21-Jul-2026); GAM Research' },
    { callout: '**Honest verdict: a moat, but a narrowing one.** IndiaMART is the default B2B listing site in India and its best customers pay more every year, which is what a moat looks like. But a moat should also show in volumes: buyer enquiries have been flat for several quarters and the paying base has not grown for two years. If AI assistants become the place where Indian buyers start a procurement search, IndiaMART\'s data stays valuable but its control of the lead weakens. We score the moat as moderate, with the direction of travel negative until enquiries grow again.' },
  ],
};

module.exports = { marketplace, busy, stakes, moat };
