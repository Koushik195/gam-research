// Godrej Agrovet initiation, part 5: earnings quality, ownership, management and governance.
const X = require('./GODREJAGRO.ctx');
const { C, D, n0, n1 } = X;
const OW = D.ownership, RP = C.relatedParty, G = C.governance;

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: clean audit, but working capital, buyouts and one-offs need adjusting',
  blocks: [
    { bullets: [
      '**Supplier financing flatters cash flow.** Operating cash flow was ₹1,281 cr in FY26 against ₹864 cr of EBITDA, because trade payables rose ₹766 cr as Animal Nutrition moved to vendor invoice discounting. The financing cost now sits in segment costs, not interest (Q1FY27: reported feed EBIT ₹84 cr vs ₹102 cr "underlying"). Treat part of the payables as debt: on our reading net debt plus supplier credit is well above the reported ₹1,157 cr (the split is not disclosed).',
      '**Buyouts shrink equity and lift ROE.** ₹953 cr paid above book value for the Godrej Foods and Creamline minorities went straight to equity (AR FY26 note 55B). ROE rose to 21% in FY26 partly because the denominator fell. CRISIL notes the hit to net worth and the rise in adjusted gearing to 0.81x.',
      '**One-offs both ways in FY26.** Land-sale gains of ~₹34 cr sat inside EBITDA (company EBITDA ₹969 cr reported, ₹936 cr underlying); a ₹30 cr labour-code charge was exceptional. FY25 had a ₹15 cr long-term-incentive reversal. Company "EBITDA" includes other income; Screener\'s (₹864 cr, our model basis) does not.',
      '**Other income inside segments.** ~₹9.5 cr a quarter of pet-food manufacturing income for Godrej Pet Care (a group company) is booked in other income but included in the Animal Nutrition segment result. We neutralise it through central costs in the model.',
      '**Minorities run the "wrong" way.** Astec\'s minorities absorb a third of its losses, so attributable profit exceeded total profit by ₹28 cr in FY26. Screener\'s headline "Net Profit" (₹445 cr) and EPS (₹24.58 on ₹473 cr) are on different bases; we use attributable throughout.',
      `**Related parties are small but real.** Sales to Godrej Industries ₹${n0(RP.salesToGIL)} cr and to Godrej Pet Care ₹${n0(RP.salesToGodrejPetCare)} cr; expenses charged by Godrej Industries ₹${n0(RP.expensesChargedByGIL)} cr (₹${n0(RP.expensesChargedByGILPrev)} cr in FY25); dividends of ₹${n0(RP.dividendToGIL)} cr paid to the parent and ₹${n0(RP.dividendFromACI)} cr received from the ACI JV (FY26).`,
      `**Audit.** BSR & Co. (KPMG network); no qualifications; contingent liabilities ₹${n0(G.contingent)} cr, mostly old excise disputes. Brands and goodwill (~₹320 cr) are not amortised and were not impaired in FY26.`,
    ] },
    { callout: '**Accounting flag: AMBER.** Nothing suggests aggressive revenue recognition, and the auditor is clean. But three things make reported numbers look better than the underlying business: supplier financing in working capital, ROE inflated by buyouts charged to equity, and FY26 one-off land gains inside EBITDA. Our forecasts use Screener\'s EBITDA (no other income), attributable profit, and assume supplier credit stays at the Mar-26 level.' },
  ],
};

const ownership = base => ({ ...base, blocks: [
  { p: `Godrej Industries Ltd owns ${OW.named[0].pct}% and members and trusts of the Nadir and Adi Godrej families another ~${n1(OW.pattern.promoters - OW.named[0].pct)}%: promoters ${OW.pattern.promoters}% in Jun-2026, with no pledge reported. The 6.5-point drop in Dec-2024 was not a sale: after the 2024 Godrej family realignment, the holdings of the Jamshyd and Smita Godrej branch (now the separate Godrej Enterprises Group) were reclassified from promoter to public. Institutions own little: FIIs ${OW.pattern.fiis}% (Temasek's V-Sciences ${OW.named[2].pct}%, down from 4.49% in Sep-2024) and DIIs ${OW.pattern.diis}% (Nippon India ${OW.named[3].pct}%, LIC ${OW.named[5].pct}%).` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Named holders (Jun-2026)', head: ['Holder', 'Stake', 'Type'], rows: OW.named.map(h => [h.name, h.pct.toFixed(2) + '%', h.type]), source: 'BSE shareholding pattern via Screener.in (Jun-2026 quarter)' } },
  { callout: '**Our read:** GAVL is a subsidiary inside a listed holding company (Godrej Industries, itself controlled by the family). Minority shareholders have little say; decisions such as the Creamline buyout and Astec\'s future are taken at group level. Free float is ~32% and institutional ownership ~12%, which limits liquidity and index demand. Former MD B.S. Yadav still owns 1.74%.' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: a new generation and a new CEO; group-level decisions are the risk',
  blocks: [
    { exhibit: { type: 'table', title: 'Key people', head: ['Name', 'Role', 'Note'], wide: [2], rows: C.management.map(m => [m.name, m.role, m.note || '']), source: 'Annual Report 2025-26, company calls' } },
    { verdicts: [
      ['Board', 'Moderate', '12 directors, 6 independent (incl. agri economist Ashok Gulati); four family non-executives.', 'Adequate, family-weighted.'],
      ['Promoter and pledge', 'Strong', '67.75% promoter (65.05% via Godrej Industries), no pledge reported.', 'Aligned and stable.'],
      ['Succession', 'Moderate', 'CEO changed (Sep-2025) and Chairman changed (Aug-2026) within a year; strategy reset under way.', 'Execution risk while the new team settles.'],
      ['Capital allocation', 'Weak', '₹1,245 cr on minority buyouts in businesses earning 3-6% margins; ₹199 cr more into loss-making Astec.', 'Money went where returns are lowest.'],
      ['Pay', 'Moderate', `KMP pay ₹${n0(G.kmpPay)} cr in FY26 vs ₹${n0(G.kmpPayPrev)} cr (two MDs during the handover); CEO 180x median employee.`, 'Normal for the group; watch FY27.'],
      ['Disclosure', 'Moderate', 'Good business-level quarterly data (volumes, CPO, EBIT); no split of feed by species, no segment D&A quarterly, project costs not given.', 'Enough to model, not to audit margins.'],
      ['Audit and legal', 'Strong', 'BSR & Co. (KPMG); no qualifications; contingent liabilities ₹165 cr.', 'Clean.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'GAM research compilation' },
  ],
};

module.exports = { quality, ownership, governance };
