// Olectra Greentech report, part 4: Q1FY27 & outlook, earnings quality, ownership, governance, forecasts vs guidance.
const X = require('./OLECTRA.ctx');
const { C, D, F, A, AS, n0, n1, pc1, b, oiCheck, BL, bld, MULT, bridgeHist, Q1, standing } = X;
const rup = s => String(s).replace(/Rs ?/g, '₹');
const yoy = (a, p) => pc1((a / p - 1) * 100);

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & outlook', kicker: 'Momentum', title: 'Q1FY27: revenue +66%, vehicles +122%, attributable profit flat; guidance trimmed to 2,000-2,500',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (₹ crore)', head: ['', 'Q1FY26', 'Q1FY27', 'Change'], rows: [
      ['Vehicles sold', String(Q1.unitsQ1FY26), String(Q1.units), yoy(Q1.units, Q1.unitsQ1FY26)],
      ['Revenue', n1(Q1.revenueQ1FY26), n1(Q1.revenue), yoy(Q1.revenue, Q1.revenueQ1FY26)],
      ['Mobility revenue', n1(Q1.mobRevQ1FY26), n1(Q1.mobRev), yoy(Q1.mobRev, Q1.mobRevQ1FY26)],
      ['Insulator revenue', n1(Q1.enRevQ1FY26), n1(Q1.enRev), yoy(Q1.enRev, Q1.enRevQ1FY26)],
      ['EBITDA (Screener basis)', '48', '68', yoy(68, 48)],
      ['Finance costs', n1(Q1.financeQ1FY26), n1(Q1.finance), yoy(Q1.finance, Q1.financeQ1FY26)],
      ['Profit before tax', n1(Q1.pbtQ1FY26), n1(Q1.pbt), yoy(Q1.pbt, Q1.pbtQ1FY26)],
      { hl: true, cells: ['**Net profit (attributable)**', `**${n1(Q1.patAttrQ1FY26)}**`, `**${n1(Q1.patAttr)}**`, `**${yoy(Q1.patAttr, Q1.patAttrQ1FY26)}**`] },
    ], source: 'Q1FY27 investor presentation (17-Aug-2026); Screener.in; press summary of the call (Sahi, 18-Aug-2026). Segment EBIT: Mobility ₹40.4 cr (8.2%), Energy ₹17.9 cr (22.1%).' } },
    { bullets: [
      '**Volumes finally came through:** 358 vehicles against 161, the best first quarter yet, as the new plant ramped up.',
      '**Margins did not:** the EBITDA margin (Screener basis) was 11.8% against 13.8% a year earlier and 15.5% in Q4FY26; materials were 75.7% of revenue; insulators fell to a 22% EBIT margin from 38% in Q4.',
      '**Interest doubled** to ₹23.6 cr: the plant loan no longer capitalises interest (date of commercial operation 31-Dec-2025) and working-capital loans rose. Depreciation rose 44% to ₹14.6 cr.',
      '**Result:** PBT +3%, attributable profit ₹26.0 cr against ₹26.0 cr. EPS ₹3.16.',
    ] },
    { exhibit: { type: 'table', title: 'What management said (Jun and Aug 2026 calls)', head: ['Call', 'What was said'], wide: [1], rows: [
      ['Q4FY26 call (1-Jun-2026)', rup(C.guidance.q4call)],
      ['Q1FY27 call (17-Aug-2026)', rup(C.guidance.q1call)],
      ['Track record', rup(C.guidance.history)],
    ], source: 'Call summaries: Sovrenn; Sahi (18-Aug and 3-Sep-2026); Trendlyne (Geojit, 21-Aug-2025). The company\'s own transcript links no longer resolve.' } },
    { callout: '**Why it matters:** the guidance moved down within ten weeks (2,500 to 2,000-2,500) and needs 1,650-2,150 vehicles in the last three quarters after 358 in the first, i.e. 550-720 a quarter against a best-ever 450. We model 1,850 for the year.' },
  ],
};

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: clean audit and little other income, but three-quarters of sales go to the parent\'s companies',
  blocks: [
    { bullets: [
      `**Cash conversion is weak.** Cash from operations was ₹${n0(A.cfo[b - 2])} cr (FY24), ₹${n0(A.cfo[b - 1])} cr (FY25) and ₹${n0(A.cfo[b])} cr (FY26) against net profit of ₹${n0(A.pat[b - 2])} / ${n0(A.pat[b - 1])} / ${n0(A.pat[b])} cr; free cash flow was negative in FY25 and FY26 (Screener).`,
      `**The customer is usually a related party.** ${rup(C.structure.rptSales)} Receivables from related parties were ₹718 cr at Mar-26; the auditor made receivable recoverability a key audit matter.`,
      `**Other income is small and real.** ${rup(C.accounting.otherIncome)} It was ${Math.round(A.otherIncome[b] / A.pbt[b] * 100)}% of FY26 PBT; we model ₹${AS.otherIncome.join(' / ')} cr (four quarters to Jun-26: ₹${n0(oiCheck.ttm)} cr).`,
      `**Interest was capitalised.** ${rup(C.accounting.finance)} That flattered FY26 PBT by ~₹14 cr (~6%).`,
      `**Segment results include other income.** Segment EBIT less (EBITDA − depreciation) was ${bridgeHist.map(x => `₹${n0(x.v)} cr (${x.fy})`).join(', ')}, matching other income incl. associates; our build deducts it (₹${AS.otherIncome.join(' / ')} cr).`,
      `**Warranties are growing.** ${rup(C.accounting.auditor)}`,
    ] },
    { callout: '**Accounting flag: AMBER.** No qualification, small exceptional items and other income that is mostly deposit interest. But the profit is earned largely on sales to companies controlled by Olectra\'s own promoter, at prices set with them, and paid for when their lenders and the states pay. That is a quality issue even if every transaction is at arm\'s length.' },
  ],
};

const OH = D.ownership;
const ownership = base => ({ ...base, blocks: [
  { p: `MEIL Holdings owns 50.02% (Jun-2026), a stake unchanged for at least twelve quarters. Foreign portfolio investors own ${OH.categories.fii}%, domestic institutions ${OH.categories.dii}% and the public ${OH.categories.public}% (${n0(OH.categories.shareholders)} shareholders). ${rup(OH.trend)}` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Largest holders we can name', head: ['Holder', 'Stake'], wide: [0], rows: OH.named.map(([h, p]) => [h, p != null ? p + '%' : 'n.d.']), source: rup(OH.namedNote) } },
  { callout: '**Our read:** a promoter with exactly half the company and almost no Indian institutions. The stock is driven by retail flows and news (order wins, MSRTC headlines), which is why it moved between ₹880 and ₹1,550 in the twelve months to Sep-2026.' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: a professional MD under a group chairman; the group trades heavily with itself',
  blocks: [
    { p: rup(`${C.management.chair} ${C.management.md} ${C.management.board}`) },
    { verdicts: [
      ['Audit and accounts', 'Good', 'Sarath & Associates; unmodified opinion on FY26; KAMs on receivables and warranties', 'No accounting red flags'],
      ['Board', 'Moderate', 'Group chairman (MEIL\'s MD); four independents of eight', 'Typical promoter-led board'],
      ['Related parties', 'Watch', rup(C.structure.rptApprovals), 'Sales, receivables, guarantees and loans all run through MEIL companies'],
      ['Management stability', 'Watch', 'MD changed in 2025; a whole-time director served four months', 'New team must deliver the plant ramp-up'],
      ['Disclosure', 'Moderate', 'Quarterly presentations and calls; no order book in rupees, no Evey accounts', 'Volumes are trackable, contract economics are not'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'AR FY26 (corporate governance report, AGM notice, notes 33-34); presentations' },
  ],
};

const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: EPS ₹{{F.eps.0|n1}} / ₹{{F.eps.1|n1}} / ₹{{F.eps.2|n1}}; below guidance on volumes and margins',
  blocks: [
    { p: `We build revenue and EBIT by segment, deduct other income (booked inside segment results) and add back depreciation to reach EBITDA: ${bld.map(r => n0(r.units)).join(' / ')} vehicles at ₹${BL.revPerUnit.join(' / ')} cr each and ${BL.mobMargin.join('% / ')}% Mobility EBIT; insulators +${BL.enGrowth.join('% / +')}% at ${BL.enMargin[0]}%. Capex ₹${AS.capex.join(' / ')} cr; depreciation ${AS.depRateOnGrossBlock}% of gross block; interest ₹${AS.interest.join(' / ')} cr; other income ₹${AS.otherIncome.join(' / ')} cr; tax including the small minority share ${AS.taxRate[0]}%; payout ${AS.payout[0]}%. Working capital stays at the FY26 ratio (~30% of revenue), so net debt rises to ~₹${n0(-F.treasury[1])} cr by FY28E.` },
    { exhibit: { type: 'rows', title: 'P&L and cash flow summary (₹ crore)', from: 'FY23', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }, { name: 'Depreciation', ref: 'fin.dep' },
      { name: 'Other income (incl. associates)', ref: 'fin.otherIncome' }, { name: 'Interest', ref: 'fin.interest' },
      { name: 'Net profit', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n2' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Capex', ref: 'fin.capex' }, { name: 'Free cash flow', ref: 'fin.fcf' }, { name: 'ROE', ref: 'fin.roe', fmt: 'pct' },
    ], source: 'Company, Screener.in, GAM Research estimates' } },
    { exhibit: { type: 'table', title: 'GAM vs management and the one standing outside target', head: ['', 'Management / street', 'GAM Research'], rows: [
      ['FY27 vehicles', '2,000-2,500 (Aug-2026); 2,500 (Jun-2026)', n0(bld[0].units)],
      ['EBITDA margin', '12-15% near term; 10-12% long term', '{{F.ebitdaMargin.0|pct}} / {{F.ebitdaMargin.1|pct}} / {{F.ebitdaMargin.2|pct}}'],
      ['Insulator revenue', '5x in three years', `+${BL.enGrowth.join('% / +')}%`],
      ['Capex', '~₹400-600 cr over two years (platforms, infrastructure, trucks)', `₹${AS.capex.join(' / ')} cr`],
      ['Target price', standing.map(s => `${s.broker}: ₹${n0(s.tp)} (${s.date}; method not disclosed)`).join('; '), '{{dcf.tp|inr}}'],
    ], source: 'Call summaries (Jun and Aug 2026); Univest/Uniresearch (2-Jul-2026); GAM Research. No broker EPS estimates dated on or before 30-Sep-2026 were found.' } },
    { callout: `**Where we could be wrong:** volumes. If Olectra delivers its 2,000-2,500 in FY27 and fills half the plant by FY28, revenue and EPS would be 15-25% above ours (our bull case). If MSRTC or BEST slips again, or Evey cannot fund new SPVs, the bear case follows: lower volumes, higher receivables and interest. At our ${MULT.base}x, each ₹10 cr of FY28-29E net profit is worth ~₹${n0(10 / F.shares * MULT.base)} a share.` },
  ],
};

module.exports = { guidance, quality, ownership, governance, forecasts };
