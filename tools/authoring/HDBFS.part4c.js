// HDB Financial Services report, part 4c: Q1FY27 and guidance, earnings quality (incl. the BPO treatment and
// the FY26 Screener tie-out).
const X = require('./HDBFS.ctx');
const { C, F, n0, n1, n2, pc, Q1, F26, GD } = X;
const QK = C.quarterlyKpis, q4 = QK.find(q => q.q === 'Q4FY26');
const restQ = (F.pat[0] - Q1.pat) / 3;

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & guidance', kicker: 'Latest quarter', title: 'Q1FY27: record profit, Stage 3 down, margin up; growth still ~11%',
  blocks: [
    { p: `Q1FY27 (Apr-Jun 2026) was HDB's most profitable quarter: PAT ₹${Q1.pat} cr (+${Q1.patGrowth}%), ROA ${Q1.roaAssets}%, ROE ${n1(Q1.roe)}%. Net interest income grew ${Q1.niiGrowth}% on loans up only ${Q1.loanGrowth}%, because the margin widened (NIM ${Q1.nimLoans}% vs 7.74% a year earlier) as funding costs fell. Lending costs grew 11%, slower than income, so cost-to-income fell to ${Q1.costToIncomeLending}% (42.7%). Loan losses were flat at ₹${Q1.llp} cr and Stage 3 fell to ${Q1.stage3Pct}% in what is usually a weak quarter. The one soft number was growth: disbursements +${Q1.disbursementGrowth}% YoY but −11.5% QoQ, asset finance and business loans still flat. Management does not give annual guidance; its standing aims are below.` },
    { exhibit: { type: 'table', title: 'Management\'s standing aims vs Q1 and our forecast', head: ['Metric', 'Management (Apr/Jul-2026 calls)', 'FY26 actual', 'Q1FY27 actual', 'GAM FY27E'], wide: [1], rows: [
      ['Loan growth', GD.growth.split(';')[0], '10.9% (gross loans)', `${Q1.loanGrowth}% YoY`, '{{F.aumGrowth.0|pct}} (AUM)'],
      ['NIM (on average gross loans)', GD.nim, `${F26.nimLoans}%`, `${Q1.nimLoans}%`, '{{F.nim.0|pct}} on average AUM'],
      ['Opex', GD.opex, `${F26.opexToLoans}%`, `${Q1.opexToLoans}%`, `${n2(X.BB.lendingOpexPct[0])}% of AUM (lending only)`],
      ['Credit cost', '~2.3% plus/minus, steady state over three years', '2.50%', `${Q1.creditCostLoans}%`, '{{F.creditCost.0|n2}}% of average AUM'],
      ['ROA (on total assets)', '2.5%, consistently', `${F26.roaAssets}%`, `${Q1.roaAssets}%`, '{{F.roa.0|pct}}'],
      ['ROE', 'n.d.', `${F26.roe}%`, `${n1(Q1.roe)}%`, '{{F.roe.0|pct}}'],
    ], source: 'Q4FY26 call (15-Apr-2026), Q1FY27 presentation and call (15-Jul-2026); Annual Report FY2025-26; GAM estimates' } },
    { p: `**What FY27E needs.** Our FY27E profit of ₹{{F.pat.0|num}} cr (+{{F.patGrowth.0|pct}}) needs ~₹${n0(restQ)} cr a quarter for Q2-Q4 against ₹${Q1.pat} cr in Q1, ${pc((restQ / Q1.pat - 1) * 100)} above Q1, as the book grows ~3.5% a quarter and margins hold. Two things could break it: a repo hike (funding first, loans later) and a monsoon-driven rise in truck and tractor delinquencies in H2. Motilal Oswal (₹3,310 cr) is a little above us, Emkay (₹3,182 cr) a little below.` },
    { callout: '**Our read:** management has delivered what it controls (margin, costs, the asset-quality cleanup) and is behind on what depends on demand and risk appetite (growth). Its words on growth have been hopeful rather than firm ("let us deliver on our numbers and we\'ll discuss in a few months"). We model the margin and loss rate it guides to and a growth recovery below its aim.' },
  ],
};

const earningsQuality = {
  id: 'quality-earnings', nav: 'Earnings quality', kicker: 'Accounting', title: 'Earnings quality: clean audits and simple products; watch insurance fees and the related-party BPO line',
  blocks: [
    { p: 'We rate accounting **GREEN**. The joint statutory auditors (Kalyaniwalla & Mistry LLP and G.D. Apte & Co.) gave an unmodified opinion on FY26; the key audit matters were the expected-credit-loss provision and IT systems, as at every lender. Products are plain instalment loans; there is almost no off-balance-sheet lending (AUM is 0.2% above gross loans); provisions are recalculated every quarter on product-level loss histories, and management says there are no one-off overlays. Points to watch:' },
    { bullets: [
      `**Insurance commission:** ₹${n0(F26.insuranceCommission)} cr in FY26, up 64% from ₹${n0(F26.insuranceCommissionFY25)} cr, about 13% of pre-tax profit. It is the fastest-growing fee line and the one IRDAI\'s Sep-2026 proposal targets. We cut a third of it from FY28E.`,
      `**BPO revenue is 100% related-party:** ₹${n0(F26.bpoRevenue)} cr billed to HDFC Bank (sales support ₹737 cr, back office ₹207 cr, collections ₹280 cr). Approved by shareholders and the audit committee; pricing is not disclosed. Profit is small (₹${F26.bpoPbt} cr).`,
      `**One-offs:** the new labour codes cost ₹${F26.labourCodeCharge} cr in FY26 (₹56 cr lending, ₹5 cr BPO); FY26 PAT would have been ₹2,586 cr without it. Tax credits for earlier years (₹27 cr in FY26, ₹60 cr in FY25) flattered the tax rate.`,
      '**Screener vs company:** Screener moves ~₹35 cr a year from other expenses into interest, and its quarterly gross-NPA row runs one quarter behind the company\'s Stage 3; we use company figures for asset quality. Screener\'s FY26 EPS (₹30.64) uses year-end shares; the company\'s basic EPS is ₹30.97.',
    ] },
    { exhibit: { type: 'table', title: 'Tie-out: company vs Screener / our model (FY26, ₹ crore)', head: ['Line', 'Company', 'Screener / our model', 'Gap and why'], wide: [3], rows: [
      ['Total income (revenue from operations)', '18,430', '{{fin.sales.5|num}}', 'Rounding'],
      ['Interest expense', '6,820', '{{fin.interest.5|num}}', 'Screener adds ~₹36 cr moved from other expenses'],
      ['Net interest income', '8,968', '{{fin.nii.5|num}}', 'The same ₹34-36 cr'],
      ['Fees and other income (lending ₹1,417 cr + BPO ₹1,224 cr)', '2,641', '{{fin.feeIncome.5|num}}', 'From the company (history input)'],
      ['Operating expenses incl. depreciation (lending ₹4,266 cr + BPO ₹1,143 cr)', '5,408', '{{fin.opex.5|num}}', 'The same ₹34 cr, in the other direction'],
      ['Loan losses and provisions', '2,815', '{{fin.provisions.5|num}}', 'From the company (history input)'],
      ['Profit before tax', '3,386', '{{fin.pbt.5|num}}', 'Ties'],
      ['Net profit', '2,544', '{{fin.pat.5|num}}', 'Ties'],
    ], source: 'Annual Report FY2025-26 (P&L, segment note); Q4FY26 presentation p24-25; Screener.in (standalone); GAM Research' } },
  ],
};

module.exports = { guidance, earningsQuality };
