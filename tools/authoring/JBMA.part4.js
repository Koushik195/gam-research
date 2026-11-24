// JBM Auto report, part 4: Q1FY27 & outlook, earnings quality, ownership, governance, forecasts vs Crisil's expectations.
const X = require('./JBMA.ctx');
const { C, D, F, A, AS, n0, n1, pc1, b, oiCheck, nd0, BL, MULT, SQ, bridgeHist } = X;
const Q = C.q1fy27, rup = s => String(s).replace(/Rs ?/g, '₹');
const yoy = (a, p) => pc1((a / p - 1) * 100);
const q1 = SQ.find(r => r.q === 'Q1FY27'), q0 = SQ.find(r => r.q === 'Q1FY26');

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & outlook', kicker: 'Momentum', title: 'Q1FY27: revenue +15%, PAT +16%; components led, buses lumpy, debt down',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (₹ crore)', head: ['', 'Q1FY26', 'Q1FY27', 'Change'], rows: [
      ['Revenue', n0(Q.revenueQ1FY26), n0(Q.revenue), yoy(Q.revenue, Q.revenueQ1FY26)],
      ['Components revenue', n0(q0.coRev), n0(q1.coRev), yoy(q1.coRev, q0.coRev)],
      ['EV business revenue', n0(q0.evRev), n0(q1.evRev), yoy(q1.evRev, q0.evRev)],
      ['Tool room revenue', n0(q0.trRev), n0(q1.trRev), yoy(q1.trRev, q0.trRev)],
      ['EBITDA (Screener basis, after JV losses)', n0(Q.ebitdaScreenerQ1FY26), n0(Q.ebitdaScreener), yoy(Q.ebitdaScreener, Q.ebitdaScreenerQ1FY26)],
      ['EBITDA incl. other income (company)', n1(Q.ebitdaCoQ1FY26), n1(Q.ebitdaCo), yoy(Q.ebitdaCo, Q.ebitdaCoQ1FY26)],
      ['Profit before tax', n1(Q.pbtQ1FY26), n1(Q.pbt), yoy(Q.pbt, Q.pbtQ1FY26)],
      { hl: true, cells: ['**Net profit (attributable)**', `**${n1(Q.patQ1FY26)}**`, `**${n1(Q.pat)}**`, `**${yoy(Q.pat, Q.patQ1FY26)}**`] },
    ], source: 'Q1FY27 press release and XBRL results (30-Jul-2026); Screener.in. Q1FY27 segment EBIT: components ₹69 cr, tool room ₹15 cr, EV ₹49 cr.' } },
    { bullets: [
      '**Components carried the quarter** (+15.5%), helped by stronger car and utility-vehicle output after the GST cut of Sep-2025.',
      `**Buses grew 17% but were only ₹${n0(q1.evRev)} cr**, against ₹${n0(SQ.find(r => r.q === 'Q4FY26').evRev)} cr in Q4FY26: deliveries follow tender schedules and city flag-offs (Ahmedabad, Vadodara, Delhi, Panipat and others in Q1).`,
      `**Interest fell** to ₹${n0(Q.finance)} cr from ₹108 cr in Q4FY26 after ~₹500 cr of long-term debt was repaid; other income stayed high at ₹${n0(Q.otherIncome)} cr. JV losses were ₹${n1(-Q.jv)} cr and the minority share ₹${n1(Q.minority)} cr.`,
      `**Corporate news:** ${rup(Q.highlights)} ${rup(Q.board)}`,
    ] },
    { exhibit: { type: 'table', title: 'What we know about the outlook (no earnings calls)', head: ['Source', 'What was said'], wide: [1], rows: [
      ['Crisil (5-Aug-2026)', rup(C.guidance.crisil)],
      ['Company (Jun-2026)', rup(C.guidance.management)],
    ], source: 'Crisil rating rationale (5-Aug-2026); Motilal Oswal deal release (18-Jun-2026)' } },
    { callout: '**Why it matters:** JBM gives no numerical guidance and holds no calls, so the best outside view of its plans is its rating agency\'s. Crisil expects 14-16% revenue growth, a slightly better margin and, above all, falling debt as the JV funds itself. Our revenue and cash-accrual forecasts are close to Crisil\'s; we are more cautious on working capital.' },
  ],
};

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: clean audit, but revenue booked before delivery to a related customer, and a third of PBT from other income',
  blocks: [
    { bullets: [
      `**Cash conversion is poor.** Cash from operations was ₹${n0(A.cfo[b - 2])} cr (FY24), ₹${n0(A.cfo[b - 1])} cr (FY25) and ₹${n0(A.cfo[b])} cr (FY26) against net profit of ₹${n0(A.pat[b - 2])}-${n0(A.pat[b])} cr; free cash flow was negative in five of the last seven years (Screener).`,
      `**Revenue is recognised as buses are built.** ${rup(C.accounting.revenueRecognition)} Combined with receivables of ₹2,185 cr, unbilled revenue and receivables were ~61% of FY26 revenue.`,
      `**The customer is often a related party.** ${rup(C.accounting.relatedSales)} JBM Auto also guarantees the JV's and its SPVs' borrowings and has pledged its Ecolife shares.`,
      `**Other income is large and partly from the JV.** ${rup(C.accounting.otherIncome)} It was ${Math.round(A.otherIncome[b] / A.pbt[b] * 100)}% of FY26 PBT. Our forecast cuts it to ₹${AS.otherIncome.join(' / ')} cr as the JV loan is repaid (Q1FY27 ₹${n0(oiCheck.q1x4 / 4)} cr; four quarters to Jun-26 ₹${n0(oiCheck.ttm)} cr).`,
      `**Segment EBIT includes items outside operations.** Segment results add up to more than group operating profit: the gap (JV losses, unallocated items and other income booked in segments) was ₹${bridgeHist.map(x => `${n0(x.v)} cr (${x.fy})`).join(', ')}. We model it as a bridge of ₹${BL.bridge.join(' / ')} cr.`,
      '**Minorities.** 15% of JBM Electric Vehicles belongs to outside holders (₹19 cr of FY26 profit). We use attributable profit throughout.',
    ] },
    { callout: `**Accounting flag: AMBER.** ${rup(C.accounting.auditor)} No qualification and small exceptional items. But three features need watching together: revenue recognised before delivery, a large related customer funded by the group, and other income from that customer. None is improper; together they mean reported profit runs ahead of cash, as FY26 (net profit ₹219 cr, operating cash flow −₹60 cr) showed.` },
  ],
};

const OH = D.ownership;
const ownership = base => ({ ...base, blocks: [
  { p: `The Arya family and its companies own 67.53% (Jun-2026), a stake unchanged for at least ten quarters. Foreign portfolio investors own ${OH.categories.fii}%, domestic institutions ${OH.categories.dii}% and the public ${OH.categories.public}% (${n0(OH.categories.shareholders)} shareholders). ${rup(OH.trend)}` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Largest holders we can name (promoter group)', head: ['Holder', 'Stake'], wide: [0], rows: OH.named.map(([h, p]) => [h, p != null ? p + '%' : 'n.d.']), source: rup(OH.namedNote) } },
  { callout: '**Our read:** a family-controlled company with almost no institutional owners. That cuts both ways: the stock can re-rate fast when institutions arrive (an equity raise or a large EV-business deal could bring them), and it can fall fast when retail sentiment turns, as it did after Feb-2024 (−50%). The promoter stake is held through a web of group investment companies.' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: family-run, heavy related-party dealings, thin disclosure',
  blocks: [
    { p: rup(`${C.management.chair} ${C.management.md} ${C.management.others}`) },
    { verdicts: [
      ['Audit and accounts', 'Good', 'Marwah & Co. LLP; unmodified opinion on FY26', 'No accounting red flags'],
      ['Board', 'Moderate', 'Founder-chairman and his son as MD; re-appointed at the Sep-2026 AGM', 'Typical promoter-led board'],
      ['Related parties', 'Watch', rup(C.management.rpt), 'The group trades heavily with itself; the JV is both customer and borrower'],
      ['Capital allocation', 'Watch', 'Growth funded with debt and JV-level outside money; two ₹1,500 cr fundraising authorities (Sep-2025, Jul-2026)', 'Possible dilution at JBM Auto or the EV subsidiary'],
      ['Disclosure', 'Weak', 'No earnings calls or presentations found; order book stated loosely (10,000+ vs 7,000-7,500)', 'Hard to track bus volumes, pricing and the JV'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'AR FY26 (Board\'s report, secretarial audit, notes); Crisil (5-Aug-2026)' },
  ],
};

const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: EPS ₹{{F.eps.0|n1}} / ₹{{F.eps.1|n1}} / ₹{{F.eps.2|n1}}; cash accrual in line with Crisil',
  blocks: [
    { p: `We build revenue and EBIT by segment (see the segment chapters), deduct the bridge and add back depreciation to reach EBITDA: components +${BL.coGrowth.join('% / +')}% at ${BL.coMargin.join('% / ')}% EBIT; tool room +${BL.trGrowth.join('% / +')}% at ${BL.trMargin.join('% / ')}%; e-buses +${BL.evGrowth.join('% / +')}% at ${BL.evMargin.join('% / ')}%; bridge ₹${BL.bridge.join(' / ')} cr. Capex ₹${AS.capex.join(' / ')} cr; depreciation ${AS.depRateOnGrossBlock}% of gross block; interest ₹${AS.interest.join(' / ')} cr; other income ₹${AS.otherIncome.join(' / ')} cr; tax including the minority share ${AS.taxRate[0]}%; payout ${AS.payout[0]}%. Working capital stays at the pro forma FY26 ratio (~30% of revenue), so net debt barely falls from ~₹${n0(nd0)} cr.` },
    { exhibit: { type: 'rows', title: 'P&L and cash flow summary (₹ crore)', from: 'FY23', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }, { name: 'Depreciation', ref: 'fin.dep' },
      { name: 'Other income (actuals incl. exceptional items)', ref: 'fin.otherIncome' }, { name: 'Interest', ref: 'fin.interest' },
      { name: 'Net profit', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n2' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Capex', ref: 'fin.capex' }, { name: 'Free cash flow', ref: 'fin.fcf' }, { name: 'ROE', ref: 'fin.roe', fmt: 'pct' },
    ], source: 'Company, Screener.in, GAM Research estimates. FY26 balance sheet pro forma for the Jun-2026 debt repayment.' } },
    { exhibit: { type: 'table', title: 'GAM vs Crisil\'s expectations (no broker estimates dated on or before 30-Sep-2026 were found)', head: ['', 'Crisil (5-Aug-2026)', 'GAM Research'], rows: [
      ['Revenue growth', '14-16% a year, medium term', '{{F.salesGrowth.0|n1}}% / {{F.salesGrowth.1|n1}}% / {{F.salesGrowth.2|n1}}%'],
      ['Operating margin', '~12% in FY26 (Crisil basis), +50-60bp over the medium term', '{{F.ebitdaMargin.0|pct}} → {{F.ebitdaMargin.2|pct}} (Screener basis, after JV losses; FY26 11.1%)'],
      ['Cash accrual (profit + depreciation)', '~₹450 cr in FY27; ₹455-500 cr a year after', `₹${n0(F.pat[0] + F.dep[0])} / ${n0(F.pat[1] + F.dep[1])} / ${n0(F.pat[2] + F.dep[2])} cr`],
      ['Debt', '₹3,204 cr (Mar-26) to ₹2,500-2,550 cr (Mar-27)', `Net debt ₹${n0(-F.treasury[0])} cr at Mar-27; gross ~₹2,700 cr if cash and JV investments stay at Mar-26 levels`],
      ['Working capital', 'Gross current assets 297 days to ~250 days (Mar-27)', 'Held at the pro forma FY26 ratio (no improvement assumed)'],
    ], source: 'Crisil rating rationale (5-Aug-2026); GAM Research' } },
    { callout: `**Where we could be wrong:** on the upside, if receivables fall as Crisil expects, interest would drop faster than our ₹${AS.interest.join(' / ')} cr and free cash flow would turn clearly positive. On the downside, bus revenue is lumpy and booked as built; a slip in city payments or in Ecolife's funding would show up first as higher receivables and interest, then as lower EPS. At our ${MULT.base}x, each ₹10 cr of FY28-29E net profit is worth ~₹${n0(10 / F.shares * MULT.base)} a share.` },
  ],
};

module.exports = { guidance, quality, ownership, governance, forecasts };
