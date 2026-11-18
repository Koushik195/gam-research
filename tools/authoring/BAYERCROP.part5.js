// Bayer CropScience report, part B (extra): earnings quality, ownership additions, management & governance.
const S = require('./BAYERCROP.research');
const { C, D, A, b, n0, n1, TX, Q1, CT } = S;
const AC = C.accounting, FY = C.fy26;

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: clean audit and real cash, but big estimates, one-offs and a tax dispute',
  blocks: [
    { bullets: [
      `**Rebates, discounts and returns.** Revenue is shown after ₹${n0(FY.revenueAdjustments.discounts)} cr of discounts and ₹${n0(FY.revenueAdjustments.anticipatedReturns)} cr of expected returns (together ~15% of the ₹${n0(FY.revenueAdjustments.contractedPrice)} cr contracted price). Refund liabilities were ₹${n0(AC.refundLiabilities.mar26.anticipatedReturns + AC.refundLiabilities.mar26.discountsPayable)} cr at Mar-2026 (₹${n0(AC.refundLiabilities.mar25.anticipatedReturns + AC.refundLiabilities.mar25.discountsPayable)} cr a year earlier), and expected returns rose 51%. The auditor calls the estimate "complex, subjective and susceptible to material misstatement" (key audit matter).`,
      `**Receivables.** Expected-credit-loss charges were ₹${n0(FY.otherExpenses.eclFY25)} cr in FY25 ("unprecedented" collection problems) and ₹${n0(FY.otherExpenses.eclProvisionReceivables)} cr in FY26; the company also earned ₹${n1(FY.otherIncomeDetail.penalInterestOnOverdueReceivables)} cr of penal interest on overdue dealer bills.`,
      `**One-offs in other income.** Profit on selling products: ₹${n1(FY.otherIncomeDetail.fy25.divestment)} cr (FY25), ₹${n1(FY.otherIncomeDetail.profitOnDivestmentOfProducts)} cr (FY26) and the ₹${n1(Q1.oneOffGain)} cr flubendiamide gain in Q1FY27. We treat them as non-recurring.`,
      `**Tax.** The 19-20% tax rate depends on treating seed-production income as exempt agricultural income (₹${n1(-TX.fy26.agriIncomeTaxEffect)} cr of tax saved in FY26). ₹233 cr of that position is disputed up to the Supreme Court; indirect-tax demands rose to ₹${n0(C.contingentLiabilities.indirectTax)} cr. A Kerala suit seeks ₹162 cr jointly from Bayer and 15 other endosulfan makers.`,
      `**Agency revenue.** Group seed products sold as an agent are booked net (₹${n0(C.relatedParty.fy26.purchasesFromBayerBioScienceGross)} cr of gross purchases in FY26), which flatters margin percentages slightly but not profit.`,
      `**Inventory.** ₹${n1(FY.inventoryWriteDown)} cr of inventory was written down in FY26 (₹${n1(FY.inventoryWriteDownFY25)} cr in FY25); 289 inventory days (Screener) make write-downs a recurring risk in bad seasons.`,
      `**Cash conversion is good.** Operating cash flow was ₹${n0(A.cfo[b])} cr in FY26 (${Math.round(A.cfo[b] / A.pat[b] * 100)}% of profit) and ₹3,804 cr over FY21-26 against ₹3,893 cr of profit; FY25 was weak (₹${n0(A.cfo[b - 1])} cr) when inventory rose ₹821 cr.`,
    ] },
    { callout: '**Accounting flag: AMBER.** Deloitte Haskins & Sells\' opinion is unqualified and profits turn into cash over time. The amber is for the size of the rebate and return estimates (~12% of revenue sits in refund liabilities), recurring "one-off" divestment gains, and a tax rate that rests on a disputed exemption.' },
  ],
};

const OH = D.ownership;
const ownership = base => ({ ...base, blocks: [
  { p: `The Bayer group owns ${OH.categoriesPct.promoter}% through six entities, with nothing pledged. Of the ~28.6% free float, Indian mutual funds held ${OH.categoriesPct.mutualFunds}% and insurers ${OH.categoriesPct.insurance}% in Jun-2026; foreign investors only ${OH.categoriesPct.fii}%. The number of shareholders rose to ${n0(OH.counts.shareholdersJun26)} (${n0(OH.counts.shareholdersMar26)} in Mar-2026) as the price fell.` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Holders: promoter entities and the largest funds', head: ['Holder', 'Stake', 'Note'], wide: [2], rows: [
    ...OH.promoterEntities.map(h => [h.name, h.pct + '%', 'Promoter group; nil pledge']),
    ...OH.namedMar26.map(h => [h.name, h.pct + '%', 'Mar-2026 (annual report)']),
    ['All mutual funds', OH.categoriesPct.mutualFunds + '%', 'Jun-2026'],
    ['Insurance companies', OH.categoriesPct.insurance + '%', 'Jun-2026'],
    ['Foreign portfolio investors', OH.categoriesPct.fii + '%', 'Jun-2026'],
  ], source: 'BSE shareholding pattern (Jun-2026, latest public on 30-Sep-2026) via Screener/Trendlyne; named fund holdings from the FY26 annual report (31-Mar-2026), as the Jun-2026 holder list was not accessible' } },
  { callout: '**Our read:** with ~13% held by the public outside institutions and a single parent controlling the rest, the stock is thinly traded and moves on small flows. At 71.4% the group has room for only ~3.6% more before the 75% cap set by the minimum-public-shareholding rule; we found no sign of a buyback, delisting or stake sale.' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: a professionally run subsidiary where minorities ride on the parent\'s decisions',
  blocks: [
    { exhibit: { type: 'table', title: 'Key people (as of 30-Sep-2026)', head: ['Name', 'Role', 'Note'], wide: [2], rows: C.management.map(m => [m.name, m.role, m.note]), source: C.managementSrc } },
    { verdicts: [
      ['Audit and accounts', 'Strong', 'Deloitte Haskins & Sells LLP; unqualified opinion; key audit matters on rebates and tax.', 'No red flags; estimates are large.'],
      ['Board', 'Moderate', 'Seven directors at Mar-2026: three independents (chair Pankaj Patel to 11-Sep-2026, then Ravi Kirpalani), two executives, two Bayer nominees.', 'Independent chair; parent nominees hold key finance roles at Bayer AG.'],
      ['Related parties', 'Moderate', 'Purchases from the group ~50% of the total; FY28 limit ₹3,500 cr approved with promoters abstaining.', 'Normal for an MNC subsidiary; transfer pricing is the key issue.'],
      ['Pay', 'Strong', 'MD paid 73x and CFO 28x the median employee in FY26; MD pay +2%.', 'Reasonable for the size.'],
      ['Capital allocation', 'Moderate', '~95-105% payout since FY21; no acquisitions; capex ~₹50-80 cr a year.', 'Shareholder-friendly, but no reinvestment for growth.'],
      ['Disclosure', 'Weak', 'One reportable segment; no corn vs crop-protection margins; one investor meet a year; no quarterly calls.', 'Makes the stock hard to model.'],
      ['Legal and environment', 'Moderate', 'Tax contingent liabilities ₹749 cr; endosulfan suit (joint, ₹162 cr).', 'Manageable against ₹1,480 cr of cash.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'GAM research compilation (annual report FY26, AGM notice, company announcements to Sep-2026)' },
  ],
};

module.exports = { quality, ownership, governance };
