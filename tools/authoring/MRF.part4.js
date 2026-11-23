// MRF report, part 4: Q1FY27 and outlook, earnings quality, ownership, governance, forecasts vs the street.
const X = require('./MRF.ctx');
const { C, D, F, A, b, n0, n1, pc, pc1, mosl, ttmOI, ttmOIex, tr, gross0, RECUR } = X;
const Q = C.q1fy27, OI = C.otherIncomeFY26, MG = C.management;
const SQ1 = X.SQ.find(q => q.q === 'Q1FY26'), SQ4 = X.SQ.find(q => q.q === 'Q4FY26');
const yoy = (a, p) => pc1((a / p - 1) * 100);

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & outlook', kicker: 'Momentum', title: 'Q1FY27: revenue +9.6%, EBITDA −7%, margin 11.8%: demand fine, costs not',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (₹ crore, consolidated)', head: ['', 'Q1FY26', 'Q4FY26', 'Q1FY27', 'YoY'], rows: [
      ['Revenue from operations', n0(SQ1.sales), n0(SQ4.sales), n0(Q.revenue), yoy(Q.revenue, SQ1.sales)],
      ['EBITDA', n0(SQ1.ebitda), n0(SQ4.ebitda), n0(Q.ebitda), yoy(Q.ebitda, SQ1.ebitda)],
      ['EBITDA margin', `${Q.ebitdaMarginPrevPct}%`, `${n1(SQ4.ebitda / SQ4.sales * 100)}%`, `${Q.ebitdaMarginPct}%`, `${Math.round((Q.ebitdaMarginPct - Q.ebitdaMarginPrevPct) * 100)}bp`],
      ['Raw material, % of revenue (standalone)', `${SQ1.rmPct}%`, `${SQ4.rmPct}%`, `${Q.rmPctStandalone}%`, `+${Math.round((Q.rmPctStandalone - SQ1.rmPct) * 100)}bp`],
      ['Other income', n0(SQ1.otherIncome), n0(SQ4.otherIncome), n0(Q.otherIncome), yoy(Q.otherIncome, SQ1.otherIncome)],
      { hl: true, cells: ['**Net profit**', `**${n0(SQ1.pat)}**`, `**${n0(SQ4.pat)}**`, `**${n0(Q.pat)}**`, `**${yoy(Q.pat, SQ1.pat)}**`] },
      ['EPS (₹)', '1,183', '1,656', n0(Q.eps), ''],
    ], source: 'Screener.in (as reported, 11-Aug-2026); CARE (28-Sep-2026: total operating income ₹8,610.6 cr incl. other income, PAT ₹495.35 cr); raw material from MOSL (11-Aug-2026)' } },
    { bullets: [
      '**Demand was good.** OEM demand was "buoyant" as vehicle sales grew across segments and replacement "continued to be robust" (MOSL). Revenue grew 9.6% with only part of the price increases in.',
      '**Costs were not.** Raw material jumped to 67.3% of revenue (63.4% in FY26); gross margin fell 566bp quarter on quarter (Moneycontrol). Price increases and cost measures only partly offset it.',
      `**Other income carried the profit.** ₹${n0(Q.otherIncome)} cr against ₹${n0(SQ1.otherIncome)} cr a year earlier (MOSL had expected ₹140 cr), mostly treasury gains on a larger cash pile; without the ₹66 cr increase, net profit would have fallen ~11% instead of ~1%.`,
      '**Outlook (as known on 30-Sep-2026).** MRF holds no calls; MOSL reports management "cautious" on demand given the risk of a sub-normal monsoon, with raw material firm on the Middle East conflict. The AR FY26 says margins "are likely to be impacted". CARE (28-Sep-2026) expects pricing actions and cost control to support "a gradual recovery in margins". Q2FY27 results are due by mid-November 2026.',
    ] },
  ],
};

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: clean and conservative, but treasury income will be a fifth of pre-tax profit in FY27E',
  blocks: [
    { bullets: [
      `**Cash conversion is good over a cycle.** Cash from operations was ${Math.round(A.cfoToPat[b])}% of net profit in FY26 (₹${n0(A.cfo[b])} cr) and ${Math.round(A.cfoToPat[b - 1])}% in FY25, when inventory rose ₹1,156 cr. Over FY17-26 operating cash (₹24,153 cr) was 1.7x net profit (₹14,267 cr). Working capital swings with rubber stocking: FY22 operating cash was negative.`,
      `**Few one-offs.** Exceptional items: ₹63 cr in FY26 (labour codes); nothing material in FY24-25. Screener nets the FY26 charge into other income (₹440 cr vs ₹${n0(OI.total)} cr reported).`,
      `**Treasury income is growing and partly mark-to-market.** FY26 other income of ₹${n0(OI.total)} cr included ₹${n0(OI.mfFairValueGain)} cr of fair-value gains on debt and arbitrage mutual funds (₹97.5 cr of it unrealised, per the cash flow statement), ₹${n0(OI.interest)} cr of interest and ₹${n0(OI.insuranceClaims)} cr of insurance claims (one-off). It was ${Math.round(OI.total / C.fy26.pbt * 100)}% of profit before tax. We forecast ₹{{F.otherIncome.0|num}} cr in FY27E (twelve months to Jun-26: ₹${n0(ttmOIex)} cr before the labour-code charge), ${n1(tr[0].yieldAvg)}% on average gross treasury plus ~₹${n0(RECUR)} cr of export incentives, grant unwinding and sundry income.`,
      '**Conservative on provisions, but one big item is off the books.** The ₹622 cr CCI penalty is disclosed, not provided. EPR costs for waste tyres (₹150 cr in FY26, +24%) are a new, growing charge that peers also bear.',
      `**Pay is a real cost.** Directors' remuneration of ₹${n0(MG.remunerationFY26Cr.total)} cr in FY26 (incl. ₹${n0(MG.remunerationFY26Cr.commissionTotal)} cr of commission payable) is ${n1(MG.remunerationFY26Cr.total / C.fy26.pat * 100)}% of net profit, and it now rises with profit.`,
    ] },
    { callout: '**Accounting flag: GREEN.** Joint statutory auditors, unqualified opinion, simple structure (one business, small subsidiaries), no acquisitions or capitalised development costs, and little use of exceptional items. Two things to watch: mark-to-market fund gains inside other income, and the unprovided CCI penalty.' },
  ],
};

const OH = D.ownership;
const ownership = base => ({ ...base, blocks: [
  { p: `The Mammen family and its companies own ${OH.categories.promoters}% (Jun-2026): Comprehensive Investment and Finance Co 10.42%, Peninsular Investments 2.93%, individual family members 11.53% and other family companies (incl. The Malayala Manorama Co) ~2.9%; ${OH.pledged}% is pledged. Foreign portfolio investors own ${OH.categories.fpi}%, mutual funds ${OH.categories.mutualFunds}%, insurers ${OH.categories.insurance}%. The largest non-promoter holder is the Mowi Foundation (11.98%); Evertrue Charitable & Educational Foundation (2.99%) and Enam Securities (2.59%) follow. With ${n0(OH.shareholders)} shareholders and a price of ₹1.25 lakh a share, MRF is one of the least-traded large Indian stocks.` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Largest holders (30-Jun-2026)', head: ['Holder', 'Stake'], wide: [0], rows: [...OH.promoterEntities.map(([h, p]) => [h + ' (promoter)', n1(p) + '%']), ...OH.named.map(([h, p]) => [h, p + '%'])], source: OH.src } },
  { callout: '**Our read:** control is secure with a family that has run MRF for three generations, even with under 28% directly. Minorities have little say: payout policy, pay and capital allocation are the family\'s choices. We do not know who controls the Mowi Foundation; the sources we read do not say.' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: clean books, a family-run board, and directors\' pay larger than the dividend',
  blocks: [
    { p: `${MG.board} Auditors: ${MG.auditors}.` },
    { verdicts: [
      ['Audit and accounts', 'Strong', D.governance.auditor, 'No accounting red flags.'],
      ['Board', 'Moderate', D.governance.board + '; 50% independent', 'Meets the rules; the family runs the company.'],
      ['Executive pay', 'Weak', `₹${n0(MG.remunerationFY26Cr.total)} cr to five family directors in FY26 (K.M. Mammen ₹${n1(MG.remunerationFY26Cr.KMMammen)} cr, Arun Mammen ₹${n1(MG.remunerationFY26Cr.ArunMammen)} cr); KMP pay +45%; 271-541x the median employee`, 'More than the ~₹100 cr paid to all shareholders as dividends.'],
      ['Capital allocation', 'Weak', 'Payout ~4%; cash and liquid investments ₹7,572 cr at Mar-26 earning ~6%; no buybacks', 'Keeps ROE at 10-13%.'],
      ['Related parties', 'Moderate', MG.relatedParty, 'Small next to revenue; disclosed.'],
      ['Legal', 'Watch', 'CCI penalty ₹622 cr (2011-12 conduct) before the Supreme Court; unprovided', 'Low probability of a near-term hit; not in our numbers.'],
      ['Labour', 'Moderate', MG.industrialRelations, 'Normal for a large manufacturer.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'AR FY26 (corporate governance report, remuneration annexure, note 27c, note 25q); CARE (28-Sep-2026)' },
  ],
};

const gap = (g, s) => Math.round((g / s - 1) * 100);
const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: EPS ₹{{F.eps.0|num}} / ₹{{F.eps.1|num}} / ₹{{F.eps.2|num}}: a dip in FY27, then recovery',
  blocks: [
    { p: 'Revenue comes from the channel build (replacement, OEM, exports; chapter above). The EBITDA margin is our call on the rubber spread ({{F.ebitdaMargin.0|pct}} / {{F.ebitdaMargin.1|pct}} / {{F.ebitdaMargin.2|pct}}). Capex is ₹2,000-2,200 cr a year (commitments doubled to ₹1,514 cr); depreciation 7.4% of gross block. Other income is built: 6.2% on average gross treasury (FY26 actual) plus ~₹82 cr of recurring non-treasury items. Interest ₹360-370 cr; tax 25%; payout 4.5%. Every assumption, with our reasoning, is in the Excel model\'s Assumptions sheet.' },
    { exhibit: { type: 'rows', title: 'P&L and cash flow summary (₹ crore)', from: 'FY23', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }, { name: 'Depreciation', ref: 'fin.dep' },
      { name: 'Other income (actuals incl. exceptional items)', ref: 'fin.otherIncome' },
      { name: 'Net profit', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n1' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Capex', ref: 'fin.capex' }, { name: 'Free cash flow', ref: 'fin.fcf' }, { name: 'ROE', ref: 'fin.roe', fmt: 'pct' },
    ], source: 'Company, GAM Research estimates' } },
    { exhibit: { type: 'table', title: 'GAM vs the street (estimates standing on 30-Sep-2026)', head: ['', 'GAM FY27E', 'MOSL FY27E', 'GAM FY28E', 'MOSL FY28E'], rows: [
      ['Revenue (₹ cr)', '{{F.sales.0|num}}', n0(mosl.revenue.FY27E), '{{F.sales.1|num}}', n0(mosl.revenue.FY28E)],
      ['EBITDA margin', '{{F.ebitdaMargin.0|pct}}', mosl.ebitdaMarginPct.FY27E + '%', '{{F.ebitdaMargin.1|pct}}', mosl.ebitdaMarginPct.FY28E + '%'],
      ['Other income (₹ cr)', '{{F.otherIncome.0|num}}', '555', '{{F.otherIncome.1|num}}', '611'],
      { hl: true, cells: ['**EPS (₹)**', '**{{F.eps.0|num}}**', `**${n0(mosl.eps.FY27E)}**`, '**{{F.eps.1|num}}**', `**${n0(mosl.eps.FY28E)}**`] },
      ['Gap (GAM vs MOSL)', pc(gap(F.eps[0], mosl.eps.FY27E)), '', pc(gap(F.eps[1], mosl.eps.FY28E)), ''],
    ], source: 'MOSL 1QFY27 results update (11-Aug-2026, consolidated). Kotak, Axis Capital and CLSA estimates were not visible to us; no dated consensus before 30-Sep-2026 was found.' } },
    { callout: `Our FY27E EPS is ${Math.abs(gap(F.eps[0], mosl.eps.FY27E))}% below MOSL's (a lower margin: we give more weight to Q1's 11.8% and to rubber still at ~₹273/kg in September); our FY28E is ${Math.abs(gap(F.eps[1], mosl.eps.FY28E))}% above (similar margin, more treasury income on a cash pile that keeps growing). From FY26's ₹${n0(A.eps[b])}, EPS compounds ~${Math.round(X.epsCagrFwd)}% a year to FY29E, on ~9% revenue growth, a margin back near (but below) its long-run median and rising treasury income; the FY27 dip is the cycle, not the franchise.` },
  ],
};

module.exports = { guidance, quality, ownership, governance, forecasts };
