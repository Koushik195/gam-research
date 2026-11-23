// Bosch Ltd report, part 4: Q1FY27 & guidance, earnings quality, ownership, governance, forecasts vs street.
const X = require('./BOSCHLTD.ctx');
const { C, D, F, A, AS, A26, T, n0, n1, pc, pc1, rup, b, shortDate, tr, mosl, ttmOI, tre0, treBefore } = X;
const Q = C.q1fy27, OI = C.otherIncomeFY26;
const yoy = (a, p) => pc1((a / p - 1) * 100);

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & guidance', kicker: 'Momentum', title: 'Q1FY27: revenue +22%, margin 14.0%, profit +10% before last year\'s one-off gain',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (₹ crore; before RBIC, which is consolidated from Q2)', head: ['', 'Q1FY26', 'Q1FY27', 'Change'], rows: [
      ['Revenue from operations', n0(Q.revenuePrior), n0(Q.revenue), yoy(Q.revenue, Q.revenuePrior)],
      ['EBITDA', n0(Q.ebitdaPrior), n0(Q.ebitda), yoy(Q.ebitda, Q.ebitdaPrior)],
      ['EBITDA margin', '13.4%', `${Q.ebitdaMarginPct}%`, '+65bp'],
      ['Gross margin', `${Q.grossMarginPriorPct}%`, `${Q.grossMarginPct}%`, '−420bp'],
      ['Other income (treasury)', n0(Q.otherIncomePrior), n0(Q.otherIncome), yoy(Q.otherIncome, Q.otherIncomePrior)],
      ['Exceptional gain (building-technology sale)', '556', '–', ''],
      { hl: true, cells: ['**Net profit, consolidated**', `**${n0(Q.patPrior)}**`, `**${n0(Q.patConsolidated)}**`, `**${yoy(Q.patConsolidated, Q.patPrior)}**`] },
      ['Net profit before exceptional items (standalone)', n0(Q.patPriorExExceptional), n0(Q.patStandalone), yoy(Q.patStandalone, Q.patPriorExExceptional)],
      ['EPS, consolidated (₹)', '378.4', n1(Q.epsConsolidated), ''],
    ], source: 'Q1FY27 presentation and call (10/11-Aug-2026); consolidated lines via Kotak Neo (11-Aug-2026); gross margin and Q1FY26 adjusted PAT from MOSL (11-Aug-2026)' } },
    { bullets: Q.callPoints.map(rup) },
    { exhibit: { type: 'table', title: 'What management said (Apr-2026 to Aug-2026)', head: ['When', 'Topic', 'What was said', 'Outcome so far'], wide: [2, 3], rows: C.guidance.map(g => [shortDate(g.date), g.item, rup(g.said), g.outcome || '–']), source: 'RBIC investor call (13-Apr-2026); Q4FY26 call (21-May-2026); Q1FY27 call (11-Aug-2026)' } },
    { callout: '**Why it matters:** Bosch does not give numerical guidance, and its May "flattish" outlook was overtaken within one quarter. The questions for the rest of FY27 are the GST base from Q3, the gross margin (more traded goods and a weaker rupee: ~₹96.6 to the dollar on 22-Jul-2026, MOSL daily), and how RBIC looks once consolidated. Our FY27E margin of {{F.ebitdaMargin.0|pct}} includes RBIC at ~19%; Bosch\'s own businesses at 13.6%, below Q1\'s 14.0%.' },
  ],
};

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: clean audit and good cash conversion, but one-offs and group charges cloud the history',
  blocks: [
    { bullets: [
      `**Cash conversion is good.** Cash from operations was ${Math.round(A.cfoToPat[b - 1])}% of net profit in FY25 and ${Math.round(A.cfoToPat[b])}% in FY26 (${n0(A.cfo[b])} cr); against profit before the ₹556 cr FY26 gain it was ~${Math.round(A.cfo[b] / (C.fy26.patPreExceptional) * 100)}%. Screener's CFO/EBITDA was 111-115% in FY25-26.`,
      `**One-offs are frequent.** Exceptional items moved reported profit materially in four of the last seven years: −₹645 cr (FY20), −₹745 cr (FY21), +₹844 cr (FY24), +₹556 cr (FY26). Gains came from selling businesses, twice to group companies. We value on EPS before exceptional items and forecast none.`,
      `**Treasury income was large and partly mark-to-market.** FY26 other income of ₹${n0(OI.total)} cr included ₹${n0(OI.fundGains)} cr of gains on debt mutual funds, ₹${n0(OI.depositInterest)} cr of deposit interest and ₹${n0(OI.icdInterestGroup)} cr of interest on loans to group companies. After the RBIC payment we forecast ₹{{F.otherIncome.0|num}} cr in FY27E and ₹{{F.otherIncome.1|num}} cr in FY28E (twelve months to Jun-26: ₹${n0(ttmOI)} cr).`,
      `**Group charges grow faster than revenue.** Royalty and technical fees rose 29% to ₹${n0(C.fy26.royaltyTechFee)} cr (2.4% of revenue) and professional charges from group companies 24% to ₹${n0(C.fy26.professionalChargesToGroup)} cr (5.5%) in FY26, against revenue growth of 10.8%. These are expenses decided with the controlling shareholder.`,
      '**Lending to the group.** Bosch lends surplus cash to sister companies (₹950 cr at Mar-26, ₹1,370 cr a year earlier, secured and guaranteed by Robert Bosch GmbH, at 8.90-9.55%). It earns a fair rate, but it is a related-party exposure inside "treasury".',
      '**The FY27 accounts will look different.** RBIC will be pooled (no goodwill) and FY26 restated; FY27 revenue growth of ~40% and a lower other-income line are accounting, not momentum.',
    ] },
    { callout: '**Accounting flag: AMBER.** Unqualified audit by S.R. Batliboi & Associates, no debt, good cash conversion. The amber is for frequent exceptional gains from business sales (some to group companies), the size and growth of royalties and group service fees, and the related-party lending; none is improper, but together they make reported EPS a poor guide and leave the minority dependent on the parent\'s transfer pricing.' },
  ],
};

const OH = D.ownership;
const ownership = base => ({ ...base, blocks: [
  { p: `Robert Bosch GmbH owns ${OH.categories.promoters}% (Jun-2026) through Robert Bosch Internationale Beteiligungen AG (67.75%), Bosch Global Software Technologies (2.78%) and, since the RBIC deal, two tiny holdings (1,230 shares each). Nothing is pledged. Mutual funds own ${OH.categories.mutualFunds}%, insurers ${OH.categories.insurance}% (GIC, New India and LIC together 5.9%), pension funds ${OH.categories.pension}%, foreign portfolio investors ${OH.categories.fpi}% and resident individuals ~5.7%: the free float is under 30%, which keeps the stock thinly traded and index weights small.` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Largest holders (30-Jun-2026)', head: ['Holder', 'Stake'], wide: [0], rows: OH.named.map(([h, p]) => [h, p + '%']), source: 'Shareholding pattern for the quarter ended 30-Jun-2026 (bosch.in). Foreign holders above 1% are not named in the filing.' } },
  { callout: '**Our read:** this is a subsidiary, not an owner-run company. The parent controls the board, the product roadmap, transfer prices and capital allocation, and it was on the other side of the largest deal in Bosch Ltd\'s history. Minority shareholders have protections (related-party votes, independent directors, a 55-85% payout policy) but not control.' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: professional and well audited, with large and rising related-party flows',
  blocks: [
    { p: rup(`Board (Mar-2026): ${D.governance.board}. ${C.management.md}; ${C.management.jmd}; ${C.management.cfo}. Auditor: ${C.management.auditor}.`) },
    { verdicts: [
      ['Audit and accounts', 'Strong', D.governance.auditor + '; consolidated and standalone nearly identical before RBIC.', 'No accounting red flags.'],
      ['Board', 'Moderate', 'Four independent directors out of eight; the chair is a former MD treated as related to the promoter.', 'Independent at the legal minimum; the parent sets strategy.'],
      ['Related-party flows', 'Watch', rup(D.governance.relatedParty), 'The single biggest governance issue: margin and cash stay where the parent decides.'],
      ['The RBIC deal', 'Moderate', 'Bought from the parent with a PwC valuation, a fairness opinion and a minority vote; 10.6x EV/EBITDA versus Bosch\'s own ~35x.', 'Fair price and process; also a large cash transfer to the parent.'],
      ['Capital allocation', 'Moderate', rup(D.governance.capitalAllocation), 'Cash used well in RBIC; earlier years sat in deposits and group loans.'],
      ['Pay', 'Strong', `${C.management.pay}.`, 'Moderate for a company this size.'],
      ['Promoter and pledges', 'Strong', '70.54% held by the Bosch group; no pledges.', 'A long-term, well-capitalised owner.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'AR FY26 (corporate governance report, remuneration annexure, notes 26, 36, 7(c)); RBIC postal ballot notice; shareholding pattern Jun-2026' },
  ],
};

const gap = (g, s) => Math.round((g / s - 1) * 100);
const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: EPS ₹{{F.eps.0|num}} / ₹{{F.eps.1|num}} / ₹{{F.eps.2|num}}, close to the street',
  blocks: [
    { p: `We forecast revenue from the business-line build (Bosch's three segments plus RBIC from 1-Apr-2026), the EBITDA margin as the build's blend ({{F.ebitdaMargin.0|pct}} / {{F.ebitdaMargin.1|pct}} / {{F.ebitdaMargin.2|pct}}), capex of ₹600-700 cr and depreciation at 9.1% of Bosch's gross block (to include RBIC's). Other income is built: Q1FY27's actual ₹${n0(C.q1fy27.otherIncome)} cr on the old treasury, then ~6.25% on the post-deal interest-bearing treasury (₹${n0(tre0 - X.STRAT)} cr pro forma at Mar-26) plus dividends on the HDFC Bank and ICICI Bank stakes. Tax 25%; payout 55% (bottom of the policy). Every assumption, with our reasoning, is in the Excel model's Assumptions sheet.` },
    { exhibit: { type: 'rows', title: 'P&L and cash flow summary (₹ crore)', from: 'FY23', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }, { name: 'Depreciation', ref: 'fin.dep' },
      { name: 'Other income (actuals incl. exceptional items)', ref: 'fin.otherIncome' },
      { name: 'Net profit', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n1' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Capex', ref: 'fin.capex' }, { name: 'Free cash flow', ref: 'fin.fcf' },
    ], source: 'Company, GAM Research estimates. FY27E growth includes a full year of RBIC; FY24-FY26 profit includes exceptional gains.' } },
    { exhibit: { type: 'table', title: 'GAM vs the street (estimates standing on 30-Sep-2026)', head: ['', 'GAM FY27E', 'MOSL FY27E', 'GAM FY28E', 'MOSL FY28E'], rows: [
      ['Revenue (₹ cr)', '{{F.sales.0|num}}', n0(mosl.revenue.FY27E), '{{F.sales.1|num}}', n0(mosl.revenue.FY28E)],
      ['EBITDA margin', '{{F.ebitdaMargin.0|pct}}', mosl.ebitdaMarginPct.FY27E + '%', '{{F.ebitdaMargin.1|pct}}', mosl.ebitdaMarginPct.FY28E + '%'],
      ['Other income (₹ cr)', '{{F.otherIncome.0|num}}', '441 (standalone)', '{{F.otherIncome.1|num}}', '346 (standalone)'],
      { hl: true, cells: ['**EPS (₹)**', '**{{F.eps.0|n1}}**', `**${n1(mosl.eps.FY27E)}**`, '**{{F.eps.1|n1}}**', `**${n1(mosl.eps.FY28E)}**`] },
      ['Gap (GAM vs MOSL)', `${pc(gap(F.eps[0], mosl.eps.FY27E))}`, '', `${pc(gap(F.eps[1], mosl.eps.FY28E))}`, ''],
    ], source: 'MOSL 1QFY27 results update (11-Aug-2026). The Reduce-rated note (Business Standard, 31-Aug-2026) raised FY27-29E EPS by 3-4% but its numbers were not visible to us; no post-Q1 consensus dated before 30-Sep-2026 was found.' } },
    { callout: `Our EPS is within ~${Math.max(Math.abs(gap(F.eps[0], mosl.eps.FY27E)), Math.abs(gap(F.eps[1], mosl.eps.FY28E)))}% of MOSL's and compounds ~${Math.round(X.epsCagrFwd)}% a year over FY26-29E from FY26 EPS before exceptional items (₹${n1(X.epsClean[2026])}), helped in FY27 by RBIC (+~${Math.round(X.accretion27)}%). Underneath, Bosch's own businesses grow EPS ~10-12% a year. As with most of the street, our disagreement is about the multiple, not the earnings.` },
  ],
};

module.exports = { guidance, quality, ownership, governance, forecasts };
