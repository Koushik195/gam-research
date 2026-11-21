// SBI Cards report, part 5: ownership (Jun-2026), management and governance, forecasts vs the street,
// street view and critiques.
const X = require('./SBICARD.ctx');
const { C, D, F, A, fin, fi, n0, n1, n2, pc, price, shares, ST, SE, tpHi, tpLo, tpPostMed, postQ1, streetEps, b, eps26, shortDate } = X;
const OW = D.ownership, GV = C.governance;

const ownership = base => ({
  ...base,
  blocks: [
    { p: `In Jun-2026 the promoter group held ${OW.promoterGroup}% (State Bank of India ${OW.holders[0][1]}%). Domestic institutions held ${OW.dii}% (mutual funds ${OW.categories.mutualFunds}%, insurers ${OW.categories.insurance}%, led by LIC with ~6.1%) and foreign investors ${OW.fii}%, down from 10.2% a year earlier. Retail holders own only ${OW.categories.residentIndividuals}%. ICICI Prudential's funds are the largest active holders (~6.4% across five schemes in the top 20) and added in the June quarter. The free float is small (~31%), which limits index weight and liquidity.` },
    ...base.blocks,
    { exhibit: { type: 'table', title: 'Largest named shareholders, 30-Jun-2026', head: ['Holder', '% of shares'], rows: OW.holders.map(([h, v]) => [h, `${v.toFixed(2)}%`]), source: 'Q1FY27 presentation p21 (top-20 list)' } },
  ],
});

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Management and governance: a strong parent, a rotating CEO, and a board in flux',
  blocks: [
    { p: `SBI Card is run as an SBI subsidiary. Its MD & CEO is an SBI officer on deputation: Salila Pande took over on 1-Apr-2025 for two years (previously CGM of SBI's Mumbai Metro Circle and CEO of SBI California), succeeding Abhijit Chakravorty; Ashwini Kumar Tewari, now SBI's MD for subsidiaries and a board member, ran the company in 2020. SBI's chairman (C. S. Setty) chairs the board. The professional team below the MD (CFO Rashmi Mohanty, CRO Krishna Kant Bishnoi, sales head Girish Budhiraja) provides continuity. The MD's pay was 16.6x the median employee's in FY26, modest by private-sector standards.` },
    { verdicts: [
      ['Promoter (SBI)', 'Strong', '68.6% owner; lends 45% of borrowings; brand, branches and customer data; AAA rating rests on it.', 'The core of the investment case; also the main concentration risk.'],
      ['Management quality', 'Moderate', 'Delivered the credit-cost turnaround it promised in FY26; growth promises ("asset growth in the coming days") not yet met.', 'Execution on risk is good; on growth, unproven.'],
      ['Succession and continuity', 'Weak', 'CEOs rotate from SBI every two to three years; the current term runs to about Mar-2027 with no decision announced by 30-Sep-2026.', 'Strategy can shift with each CEO; long-term incentives are short.'],
      ['Board', 'Moderate', 'Four independent directors left in 2025 (Jun, Aug, two in Nov); three joined (Apr, Nov, Dec-2025).', 'Unusual churn; we found no stated reason in the annual report.'],
      ['Disclosure', 'Strong', 'Quarterly stage-wise asset quality, write-offs, recoveries, ECL rates, spends and mix.', 'Better than most Indian lenders.'],
      ['Capital allocation', 'Moderate', 'No equity raised since the 2020 IPO; payout 11-12%; capital ratio 25.6% vs 15% required.', 'Conservative; surplus capital is not being returned.'],
      ['Related parties', 'Moderate', `SBI: ₹19,876 cr of loans, ₹1,357 cr of interest, ₹177 cr of fees and commission, ₹${n1(GV.royaltyToSbi)} cr royalty (FY26).`, 'Arm\'s length per the accounts; minority holders depend on that staying true.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'Annual report FY26 (directors report, Annexure 4, note 40); Business Standard (Feb-2025); company calls' },
    { callout: '**Our view:** governance risk at SBI Card is not about honesty or accounting; it is about control. SBI decides who runs the company, for how long, how much capital it keeps and how much it pays out. That has kept the business safe and funded, but it also explains the low payout, the rotating leadership and the lack of a long-term equity incentive for management.' },
  ],
};

const cmpRow = (label, ours, street, src) => [label, ours, street, src];
const forecasts = {
  id: 'forecasts', nav: 'Our forecasts vs the street', kicker: 'Forecasts', title: 'Our forecasts: EPS +31% in FY27E on credit cost, then ~13-22%; ROE back to ~17%',
  blocks: [
    { exhibit: { type: 'table', title: 'Key forecasts', x: 'fin.labels', from: 'FY24', to: 'FY29E', rowsRef: [
      { name: 'Gross receivables (₹ cr)', ref: 'fin.aum', fmt: 'num' }, { name: 'Receivables growth (%)', ref: 'fin.aumGrowth', fmt: 'pct' }, { name: 'Interest income (₹ cr)', ref: 'fin.interestIncome', fmt: 'num' },
      { name: 'Fees & other operating income (₹ cr)', ref: 'fin.feeIncome', fmt: 'num' }, { name: 'NIM, our basis (%)', ref: 'fin.nim', fmt: 'pct' }, { name: 'Operating cost (₹ cr)', ref: 'fin.opex', fmt: 'num' },
      { name: 'Pre-provision profit (₹ cr)', ref: 'fin.ppop', fmt: 'num' }, { name: 'Gross credit cost (% avg receivables)', ref: 'fin.creditCost', fmt: 'pct' }, { name: 'Net profit (₹ cr)', ref: 'fin.pat', fmt: 'num', hl: true },
      { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n2', hl: true }, { name: 'EPS growth (%)', ref: 'fin.epsGrowth', fmt: 'pct' }, { name: 'Book value per share (₹)', ref: 'fin.bvps', fmt: 'n1' },
      { name: 'ROA on total assets (%)', ref: 'fin.roa', fmt: 'pct' }, { name: 'ROE (%)', ref: 'fin.roe', fmt: 'pct', hl: true },
    ], source: `Company, Screener.in; GAM estimates. Dividend: ₹2.50 a share for FY26; we model a 12% payout (₹${n2(F.dps[0])} for FY27E).` } },
    { p: `FY27E EPS growth of {{F.epsGrowth.0|pct}} rests on credit cost: Q1 profit was ₹664 cr and our FY27E of ₹{{F.pat.0|num}} cr needs ~₹${n0((F.pat[0] - 664) / 3)} cr a quarter for the rest of the year, ${pc(((F.pat[0] - 664) / 3 / 664 - 1) * 100)} above Q1, as credit cost stays near 6.5% against 8.3-9.0% in Q2-Q3FY26 and receivables pick up. FY28E (+{{F.epsGrowth.1|pct0}}) adds growth (receivables +12%) and a little operating leverage; FY29E (+{{F.epsGrowth.2|pct0}}) is closer to the business's normal pace once credit costs stop falling.` },
    { exhibit: { type: 'table', title: 'Our estimates vs the street (estimates standing on 30-Sep-2026)', head: ['Metric', 'GAM', 'Street', 'Source of street figure'], wide: [3], rows: [
      cmpRow('FY27E EPS (₹)', '{{F.eps.0|n2}}', `${n1(streetEps.emkay27)}-${n1(streetEps.mosl27)}`, `Emkay ₹${streetEps.emkay27} (27-Jul-2026); Motilal Oswal implied by PAT ₹${n0(SE.moslPat.FY27E)} cr ÷ ${n1(shares)} cr shares (24-Jul-2026)`),
      cmpRow('FY28E EPS (₹)', '{{F.eps.1|n2}}', `${n1(streetEps.emkay28)}-${n1(streetEps.mosl28)}`, `Emkay ₹${streetEps.emkay28}; Motilal Oswal PAT ₹${n0(SE.moslPat.FY28E)} cr`),
      cmpRow('FY29E EPS (₹)', '{{F.eps.2|n2}}', n1(streetEps.emkay29), 'Emkay'),
      cmpRow('FY28E BVPS (₹)', '{{F.bvps.1|n1}}', n1(SE.emkayBvps.FY28E), 'Emkay'),
      cmpRow('FY28E ROE (%)', '{{F.roe.1|pct}}', `${SE.emkayRoe.FY28E}-${SE.moslRoeFY28}%`, 'Emkay 16.5%; Motilal Oswal 18%'),
      cmpRow('Credit cost FY27E / FY28E', '{{F.creditCost.0|pct}} / {{F.creditCost.1|pct}}', `${SE.moslCreditCost.FY27E}-${SE.emkayCreditCost.FY27E}% / ${SE.moslCreditCost.FY28E}-${SE.emkayCreditCost.FY28E}%`, 'Motilal Oswal (low); Emkay (high); bases may differ'),
      cmpRow('Receivables growth FY27E / FY28E', '{{F.aumGrowth.0|pct}} / {{F.aumGrowth.1|pct}}', `${SE.emkayAumGrowth.FY27E}% / ${SE.emkayAumGrowth.FY28E}%`, 'Emkay'),
    ], source: 'Broker notes and summaries dated 24-27 Jul 2026; no consensus EPS standing on 30-Sep-2026 was available to us (gap).' } },
    { callout: `**Where we differ:** for FY27-28E our EPS sits between the two detailed broker models: above Emkay (which keeps credit cost above 7%) and below Motilal Oswal (credit cost ~6.1-6.4%). Our receivables growth matches Emkay's for FY27-28E; by FY29E we are slightly below Emkay because it assumes 15% receivables growth to our 13%. Our book value is ~2% above Emkay's because we assume the same low payout and slightly higher profit.` },
  ],
};

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street: split between Buy, Hold and Sell, targets ₹${n0(tpLo)}-${n0(tpHi)}`,
  blocks: [
    { p: `After Q1FY27 (24-Jul-2026) the street was divided. Motilal Oswal stayed Neutral with ₹700 (18x FY28E EPS: easing credit cost, but tepid growth and margin pressure); UBS cut to ₹700 (Neutral); Emkay kept Buy but cut to ₹750 (22x FY28E: "credit cost improves, but revenue growth challenges persist"); CLSA upgraded to Outperform, arguing slippage is well below normal; Jefferies stayed at Hold, saying stepped-up card additions should lift receivables "with lag, but pace is uncertain"; Bernstein stayed at Sell (₹430 per an aggregator, after ₹610 in April). Older notes still standing: Anand Rathi Buy ₹870, Equirus Long ₹785 (22x one-year-forward EPS), Geojit Accumulate ₹698, ICICI Securities Hold ₹665. The median post-Q1 target with a disclosed price is ₹${n0(tpPostMed)}.` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who', 'Our view'], wide: [0, 2], rows: [
      ['Growth has stalled: receivables +2% in FY26, +3% in Q1', 'Motilal Oswal, Emkay, Jefferies', 'Agree. We assume a pick-up to 8% in FY27E and 12-13% after; the bear case keeps it at 4-9%.'],
      ['Revenue quality is slipping: corporate spends, falling revolve', 'Emkay, Motilal Oswal', 'Agree. We cut the take rate and keep yields near Q1\'s level; fee growth outpaces receivables only because spends grow 15%+.'],
      ['Profit growth is all credit cost; pre-provision profit is falling', 'Emkay, Bernstein', 'Agree for FY27E (pre-provision profit flat in our model). FY28E onward needs growth.'],
      ['Credit cost could fall further than expected', 'CLSA, Motilal Oswal', 'Possible: Q1 entry rates are at a decadal low. In our bull case (~6%).'],
      ['Funding costs may rise; personal loans compete for revolve', 'Motilal Oswal; management', 'Agree; in our cost of funds and yield paths.'],
    ], source: 'Broker notes and press, 24-Jul to 21-Aug 2026; GAM Research' } },
  ],
};

module.exports = { ownership, governance, forecasts, street };
