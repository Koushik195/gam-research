// Bajaj Housing Finance report, part 4c: Q1FY27 and guidance, earnings quality.
const X = require('./BAJAJHFL.ctx');
const { C, F, A, fin, fi, n0, n1, n2, pc, Q1, G27, G26 } = X;
const F26 = C.fy26;
const ntiAr = F.ntiPct[0] / ((F26.loanAssets / F26.aum + Q1.loanAssets / Q1.aum) / 2); // FY27E NTI on loan assets (approx.)

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & guidance', kicker: 'Latest quarter', title: 'Q1FY27: record growth, profit +23%, margin −14bp; FY27 guidance held',
  blocks: [
    { p: `Q1FY27 (Apr-Jun 2026) was strong on volume: AUM +24% to ₹1,49,624 cr with a record ₹8,918 cr added (₹5,736 cr a year earlier), disbursements +33% to ₹19,509 cr, PAT +23% to ₹715 cr, ROE 12.5%. Under the surface: net interest income grew only 9% (NIM down 14bp in one quarter to 3.7%); fee and other income jumped 64% (insurance commissions and a ₹2,300 cr loan sale); and loan losses were just ₹16 cr because that sale released provisions. With loan losses at a normal 10-15bp, profit would have grown ~20%, in line with our FY27E. Management kept its FY27 assessment and said it would upgrade growth only if the easing in balance-transfer attrition lasts another quarter.` },
    { exhibit: { type: 'table', title: 'FY27 management assessment vs Q1 and our forecast', head: ['Metric', 'FY27 assessment (29-Jul-2026)', 'Q1FY27 actual', 'GAM FY27E'], wide: [1], rows: [
      ['AUM growth', G27.aumGrowth, `${Q1.aumGrowth}% YoY`, '{{F.aumGrowth.0|pct}}'],
      ['NIM (on loan assets)', G27.nimModeration, `${Q1.nim}% (−14bp QoQ)`, `≈${n2(ntiAr)}% (on AUM {{F.ntiPct.0|pct}}; FY26 {{fin.ntiPct.6|pct}})`],
      ['Opex to net total income', G27.opexToNti, `${Q1.opexToNti}%`, '{{F.costToIncome.0|pct}}'],
      ['Credit cost', G27.creditCost, `${Q1.creditCostAr}% (assignment release)`, '{{F.creditCost.0|n2}}% of avg AUM ≈ 0.12% of loans'],
      ['Gross NPA', G27.gnpa, `${Q1.gnpa}%`, 'n.m. (not modelled)'],
      ['ROA (on loan assets)', G27.roa, `${Q1.roaAr}%`, '{{F.roaAum.0|pct}} on avg AUM (≈2.2% on loans)'],
      ['Leverage (assets ÷ equity)', G27.leverage, `${Q1.leverage}x`, '{{F.assetsToEquity.0|n2}}x'],
      ['ROE', G27.roe, `${Q1.roe}%`, '{{F.roe.0|pct}}'],
    ], source: 'Q1FY27 presentation p41-42 and call; GAM estimates' } },
    { exhibit: { type: 'table', title: 'Track record: FY26 assessment vs delivery', head: ['Metric', 'Assessed (Jul-2025)', 'Delivered', 'Verdict'], rows: [
      ['AUM growth', G26.aumGrowth, G26.aumActual, 'Top of range'], ['NIM moderation', G26.nimModeration, G26.nimActual, 'Better (fees, assignments)'], ['Opex to NTI', G26.opexToNti, G26.opexActual, 'Better'],
      ['Gross NPA', G26.gnpa, G26.gnpaActual, 'Better'], ['Credit cost', G26.creditCost, G26.creditCostActual, 'In range'], ['ROA', G26.roa, G26.roaActual, 'Beat'], ['ROE', G26.roe, G26.roeActual, 'Top of range'],
    ], source: 'Q1FY27 presentation p42' } },
    { callout: '**Our read:** management guides cautiously and has met or beaten every FY26 metric. We sit at the top of FY27 AUM guidance and a touch below on margin, which nets to EPS growth of {{F.epsGrowth.0|pct}}, in line with Motilal Oswal, Emkay and JM (₹3.6). Credibility is not the issue with BHFL; the level of returns is.' },
  ],
};

const earningsQuality = {
  id: 'quality-earnings', nav: 'Earnings quality', kicker: 'Accounting', title: 'Earnings quality: clean books; loan sales to the parent and up-front gains deserve a look',
  blocks: [
    { p: 'We rate accounting **AMBER**, leaning green. The joint auditors (Mukund M. Chitale & Co. and Singhi & Co.) gave an unmodified FY26 opinion; products are simple; BHFL recognises interest only from the day a cheque is encashed (it has done so for six years, before the regulator asked lenders to); and asset quality leaves little room for provisioning games. Four points deserve attention:' },
    { bullets: [
      '**Loan sales to the parent.** BHFL sold ₹3,645 cr of loans to Bajaj Finance in FY26 and keeps servicing them for a fee (₹25 cr received). Its 2026 AGM sought omnibus approval for up to ₹12,500 cr of such transfers. They are described as arm\'s length and they help BHFL stay above the 50% housing-share floor, but the buyer is the controlling shareholder, and pricing is not disclosed.',
      '**Up-front gains on assignments.** When BHFL sells a pool and keeps the excess interest, Ind AS lets it book the present value of that spread at once. "Income on derecognised (assigned) loans" was ₹195 cr in FY26 (₹144 cr in FY25), ~6% of pre-tax profit; together with sale of services it was ₹216 cr. Lumpy assignment quarters (Q1FY27: ~₹2,300 cr) lift fees and, by releasing Stage 1 provisions, cut credit cost.',
      '**Model recalibration.** Expected-loss rates are recalibrated every January; after two clean years Stage 1 rates came down, which is why Stage 1 provisions stayed at ₹401 cr while Stage 1 loans grew ₹7,400 cr in Q1FY27. Reasonable, but it means provisions are cyclically low.',
      '**One-offs both ways.** Q4FY25 had a ₹34 cr tax credit (FY26 PAT growth 18% reported, 20% without it); FY26 had a ₹13 cr Labour Code charge. Small.',
    ] },
    { exhibit: { type: 'table', title: 'Tie-out: company vs Screener / our model (FY26, ₹ crore)', head: ['Line', 'Company', 'Screener / our model', 'Gap and why'], wide: [3], rows: [
      ['Total income', '11,151', '{{fin.sales.6|num}}', 'Rounding'],
      ['Interest expense', '6,760', '{{fin.interest.6|num}}', 'Rounding'],
      ['Net interest income', '3,752', '{{fin.nii.6|num}}', 'Rounding'],
      ['Fees and other income', '639', '{{fin.feeIncome.6|num}}', 'From the company (history input)'],
      ['Operating expenses (incl. depreciation)', '867', '{{fin.opex.6|num}}', '₹4 cr: Screener classifies a small item outside expenses'],
      ['Loan losses and provisions', '191', '{{fin.provisions.6|num}}', 'From the company (history input)'],
      ['Profit before tax', '3,320', '{{fin.pbt.6|num}}', 'Ties (after the ₹13 cr exceptional charge)'],
      ['Net profit', '2,560', '{{fin.pat.6|num}}', 'Ties'],
    ], source: 'Q1FY27 presentation p22; Screener.in (standalone); GAM Research' } },
  ],
};

module.exports = { guidance, earningsQuality };
