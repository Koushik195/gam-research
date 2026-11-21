// M&M Finance report, part 4b: competitive advantage scorecard, Q1FY27 and guidance (with the Vision 2025 track
// record), earnings quality and the FY26 tie-out.
const X = require('./M&MFIN.ctx');
const { C, F, A, fin, fi, n0, n1, n2, pc, Q1, G, V25, P, insCom, insPctPbt, overlay, overlayEps } = X;

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: a real rural franchise that has never earned high returns',
  blocks: [
    { p: `A lender's moat shows up as a lasting gap between what it earns on loans and what it pays for money, costs and losses. M&M Finance has the ingredients (reach, a captive vehicle maker, AAA funding) but not the outcome: its ROE has been 6-12% for seven years and its ROA on assets (${n2(P['M&MFIN'].roa)}% in FY26) is the lowest of the large vehicle financiers. We test each source of advantage.` },
    { verdicts: [
      ['Rural reach and dealer network', 'Advantage', '1,348 offices, 6,000+ dealers, 95% of pin codes, 30 years of rural repayment data in its scorecards.', 'Hard to copy; but Shriram, Chola, HDB and banks are in the same towns.'],
      ['Mahindra ecosystem', 'Advantage', `${Q1.mAndMShare}% of the book is Mahindra vehicles; India's largest tractor financier; dealer programmes (trade advances, inventory funding).`, '"Earned, not given": no special scorecards; M&M\'s dealers use other financiers too.'],
      ['Funding cost', 'Modest advantage', 'AAA (vs AA+ for Chola), public deposits 11% of funding; cost of funds {{fin.costOfFunds.11|pct}} in FY26.', 'Better than most NBFCs; banks still undercut it in prime segments.'],
      ['Pricing power', 'Disadvantage', 'Yield on AUM down from {{fin.yieldOnAum.6|pct}} (FY21) to {{fin.yieldOnAum.11|pct}} (FY26); fleet HCV/CE and premium cars lost to banks.', 'It competes on reach and speed, not price.'],
      ['Underwriting and collections', 'Mixed', 'Stage 3 down from 9.0% to 3.45%; but credit cost was 5.4% of AUM in FY21 and the Aizawl fraud (FY24) showed control gaps.', 'Good in normal years; exposed in rural shocks.'],
      ['Cost efficiency', 'Parity', 'Opex ~2.7% of assets and cost-to-income 38% (standalone FY26) after the Udaan stack; headcount flat.', 'Management says much lower opex would raise credit cost.'],
      ['Fee franchise (insurance, AMC)', 'Advantage, at risk', `Insurance commission ₹${n0(insCom)} cr plus MIBL broking; AMC profitable.`, 'IRDAI\'s proposed caps target exactly this income.'],
    ], head: ['Source of advantage', 'Verdict', 'Evidence', 'Durability'], title: 'Moat scorecard', source: 'Company presentations, calls and annual reports; Screener.in; GAM Research' },
    { callout: '**Honest verdict:** M&M Finance has a narrow moat in rural distribution and the Mahindra ecosystem: it will not lose its place as the default financier for Mahindra tractors and utility vehicles. But a moat should show up in returns, and this one does not. The franchise protects volumes, not margins; banks set the price in the safer segments and the monsoon sets the credit cost in the riskier ones. We would not pay a premium for the moat.' },
  ],
};

const V = V25;
const guidance = {
  id: 'guidance', nav: 'Q1FY27 & guidance', kicker: 'Latest quarter', title: 'Q1FY27: the best quarter in years; guidance is long-term and has been missed before',
  blocks: [
    { p: `Q1FY27 (Apr-Jun 2026, reported 21-Jul) was strong: disbursements +22% to ₹15,564 cr, standalone AUM +13% to ₹${n0(Q1.aumSa)} cr, "NIM" 7.3% of assets (6.7% a year earlier), cost-to-income 36.5%, credit cost 1.5% (1.9%), ROA 2.4% and ROE 14.3% (standalone); consolidated profit rose 75% to ₹927 cr, with MRHFL (₹30 cr) and MIBL (₹38 cr) both contributing. Stage 3 was 3.45% and Stage 2+3 8.3%, both lower than a year earlier despite the usual Q1 seasonality. The weak spots: loan income fell ~25bp of assets as extra liquidity was held, cost of funds rose ~10bp, CV disbursements fell 3%, and management warned that tractor demand pulled into Q1 would make Q2 "contracted".` },
    { exhibit: { type: 'table', title: 'Guidance vs Q1FY27 and our forecast', head: ['Metric', 'Management guidance (to 21-Jul-2026)', 'Q1FY27 actual (standalone)', 'GAM FY27E (consolidated, on AUM)'], wide: [1], rows: [
      ['AUM growth', G.aumCagr, `${Q1.aumGrowth}% YoY (group ~14%)`, '{{F.aumGrowth.0|pct}}'],
      ['"NIM" (gross spread incl. fees)', G.nim, '7.3% of assets', '{{F.ntiPct.0|pct}} of AUM (FY26 {{fin.ntiPct.11|pct}})'],
      ['Fees', G.fee, '1.5% of assets', '{{F.feePct.0|pct}} of AUM, incl. MIBL'],
      ['Opex', G.opex, '2.7% of assets', '{{F.opexPct.0|pct}} of AUM incl. broker payouts'],
      ['Credit cost', G.creditCost, '1.5% of assets', '{{F.creditCost.0|n2}}% of AUM (≈1.6% of assets)'],
      ['ROA', G.roa, '2.4%', '{{F.roa.0|pct}} on assets; ROE {{F.roe.0|pct}}'],
      ['Capital', G.capital, 'Tier 1 16.5%; D/E 5.0x', 'No raise; D/E {{F.debtEquity.0|n2}}x'],
    ], source: 'Q4FY26 call (24-Apr-2026); Q1FY27 presentation and call (21-Jul-2026); GAM estimates' } },
    { exhibit: { type: 'table', title: 'Track record: Vision 2025 (set May-2022) vs FY25 delivery', head: ['Target', 'Promised', 'Delivered (FY25)', 'Verdict'], rows: [
      ['AUM', V.aum, V.aumActual, 'Close miss'], ['New businesses', V.nonVehicle, V.nonVehicleActual, 'Miss'], ['Stage 3', V.gs3, V.gs3Actual, 'Met'],
      ['NIM (company basis)', V.nim, V.nimActual, 'Miss (−100bp)'], ['Cost ÷ assets', V.costToAssets, V.costActual, 'Miss'], ['ROA', V.roa, V.roaActual, 'Miss (−60bp)'],
    ], source: 'Q4FY22 presentation p11; Q4FY26 presentation p12, p22, p28' } },
    { callout: '**Our read:** management no longer gives annual guidance, only ranges and FY31 aims; the credibility test is the last plan, and Vision 2025 delivered on asset quality only. The current team (since Apr-2024) has a better record: credit cost has stayed inside the 1.3-1.7% band, NIM is back above 7%, and the digital rebuild is done. We take the bands at face value but sit in the upper half for credit cost because of the monsoon, and below the 16-18% growth aim.' },
  ],
};

const earningsQuality = {
  id: 'quality-earnings', nav: 'Earnings quality', kicker: 'Accounting', title: 'Earnings quality: clean audits, but provisions have been the swing factor in three years out of three',
  blocks: [
    { p: 'We rate accounting **AMBER**. Joint auditors M M Nissim & Co and M.P. Chitale & Co gave an unmodified opinion on FY26, and disclosure is good (stage-wise provisions, an IRACP comparison, a credit-cost split between provisions and write-offs). But reported profit has been shaped by provisioning decisions in each of the last three years:' },
    { bullets: [
      '**ECL model refreshes (every Q3).** In Q3FY25 the refresh released ₹434 cr of provisions and Stage 3 cover fell from 63% to 51%, flattering FY25 profit (+16%). In Q3FY26 the refresh would have released provisions again; management parked the release as a ₹635 cr "management overlay" instead. That was prudent, but it means the overlay is partly a re-labelled model release that can come back into profit.',
      `**₹${n0(overlay)} cr of overlays** (₹635 cr Q3FY26 + ₹217 cr Q4FY26), 0.6% of AUM, explicitly built for "a possible compromised monsoon". If FY27-28 stress is absorbed by releasing them, reported credit cost will look better than the underlying loss rate; a full release is worth ~₹${n1(overlayEps)} a share after tax. We assume no release.`,
      '**Write-offs have not fallen much.** End losses (write-offs) were ₹1,715 cr, ₹1,559 cr and ₹1,959 cr in FY24-26 (1.6%, 1.2% and 1.4% of assets) while Stage 3 fell from 4.5% (FY23) to 3.4%; the year-to-year swings in credit cost came mostly from provisions (+₹108 cr, +₹59 cr, +₹482 cr, standalone).',
      '**One-offs.** The new labour codes cost ₹133 cr (Q3FY26, exceptional; Screener shows it inside other income). The Aizawl branch fraud (₹136 cr, FY24: forged KYC on ~2,900 loans with staff collusion) was fully provided and written off in Q3FY26; the company says it found no similar fraud elsewhere.',
      '**Fee optics.** Standalone fee income includes dividends from MIBL (eliminated on consolidation); consolidated fees include MIBL\'s gross broking income (₹1,456 cr) with payouts in opex (₹1,318 cr of fees and commission expense), which inflates both lines. Non-interest-bearing trade advances to dealers swing AUM and yields between Q2 and Q3.',
    ] },
    { exhibit: { type: 'table', title: 'Tie-out: annual report vs Screener / our model (FY26, ₹ crore, consolidated)', head: ['Line', 'Annual report', 'Screener / model', 'Gap and why'], wide: [3], rows: [
      ['Revenue from operations', '21,005', '{{fin.sales.11|num}}', 'Screener moves ~₹36 cr of other income into revenue'],
      ['Fees & other operating income', '2,577', '{{fin.feeIncome.11|num}}', 'Ties (revenue less interest income)'],
      ['Interest income', '18,428', '{{fin.interestIncome.11|num}}', 'Same ₹36 cr'],
      ['Finance costs', '8,934', '{{fin.interest.11|num}}', 'Ties'],
      ['Opex incl. depreciation and fees & commission expense', '5,781', '{{fin.opex.11|num}}', 'Ties (1,318 + 2,510 + 1,568 + 386)'],
      ['Impairment (provisions)', '2,483', '{{fin.provisions.11|num}}', 'Ties (incl. ₹217 cr Q4 overlay)'],
      ['Other income + associates + exceptional', '18', '−17', '81 + 70 − 133; ₹36 cr moved to revenue'],
      ['Profit before tax', '3,826', '{{fin.pbt.11|num}}', 'Ties'],
      ['Net profit (before minorities)', '2,861', '{{fin.pat.11|num}}', 'Ties; owners\' share ₹2,855 cr'],
    ], source: 'Annual Report FY26 (consolidated statement of profit and loss, notes 25-34); Screener.in; GAM Research' } },
  ],
};

module.exports = { moat, guidance, earningsQuality };
