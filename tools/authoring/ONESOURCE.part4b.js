// OneSource report, part 4b: ownership (named holders, pledge, promoter selling) and management & governance, including
// the related-party links to Strides and the withdrawn Steriscience acquisition.
const X = require('./ONESOURCE.ctx');
const { C, D, n0, n1, FY26, price, SHARES, rup } = X;
const MG = C.management, OW = D.ownership, RC = C.relatedCosts.FY26, RR = C.relatedRevenue;

const ownership = base => ({ ...base, blocks: [
  { p: `At Jun-2026 the promoter group (Arun Kumar and family, mainly through Tenshi Pharmaceuticals and Karuna Business Solutions) owned ${OW.promoters}%, of which **${OW.pledgedPctOfPromoter}% was pledged** (${n0(OW.pledgedShares / 1e5)} lakh shares, ~${n1(OW.pledgedShares / (SHARES * 1e7) * 100)}% of the company). Domestic institutions owned ${OW.diis}% (mutual funds ${OW.mutualFunds}%, led by Motilal Oswal at 7.1%), foreign investors ${OW.fiis}% and ~${n0(OW.shareholders / 1000)},000 others ${OW.public}%. Authum Investment (4.96%) and long-only funds (Route One, Amansa, Think, 360 One) are among the large holders.` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Who sold, and when', head: ['When', 'Seller', 'Stake', 'Value / price'], wide: [1], rows: OW.blocks.map(x => [x[0].length === 10 ? X.shortDate(x[0]) : x[0], x[1], x[2], rup(x[3])]), source: OW.src } },
  { exhibit: { type: 'table', title: 'Named holders, Jun-2026', head: ['Holder', '% of shares'], rows: OW.named.map(h => [h[0], `${n1(h[1])}%`]), source: 'BSE shareholding pattern (Jun-2026), via Trendlyne' } },
  { callout: `**Our read:** the promoters own less than a third, have pledged more than a third of it and sold ~8 points within six months of listing at ~₹1,550 a share. That is not unusual for a founder who funds several companies, but it means the controlling shareholder's interests are spread across OneSource, Strides, Steriscience and others, and pledged shares can be sold in a falling market.` },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Management & governance: a strong operator and an independent-majority board, but heavy related-party links to Strides, a pledged promoter stake and an acquisition minorities blocked',
  blocks: [
    { p: rup(`${MG.ceo} runs the business with ${MG.cfo}; ${MG.chair}. ${MG.board}. Independent directors were awarded ₹2.9 cr of commission for FY26 (up to ₹60 lakh each, subject to AGM approval). Auditor: ${MG.auditor}.`) },
    { exhibit: { type: 'table', title: 'Related-party links with the Strides / Arun Kumar group (FY26, ₹ crore)', head: ['Flow', '₹ cr', 'Counterparty'], wide: [2], rows: [
      ['Revenue from related parties (goods and services)', n1(RR.FY26), `${n1(RR.FY26pct)}% of revenue; Strides Pharma Inc alone ₹${n1(RR.stridesIncFY26)} cr`],
      ['Process and conversion charges paid', n1(RC.processConversionStrides), 'Strides Pharma Science (soft-gel site transition agreement)'],
      ['Support-service charges paid', n1(RC.supportServices), `Arcolab ₹${n1(RC.supportArcolab)} cr, Strides ₹${n1(RC.supportStrides)} cr, Tenshi and others`],
      ['Rent paid', n1(RC.rentKaruna + RC.rentChayadeep), 'Karuna Business Solutions (promoter), Chayadeep Properties'],
      ['Assets bought', n1(RC.assetsFromSteriscience), 'Steriscience Pte (promoter-owned)'],
      ['Reimbursements paid', n1(RC.reimbursementsInstapill), 'Instapill (promoter group), among others'],
      ['Loan repaid (12% interest)', n1(RC.loanRepaidSteriscience), 'Steriscience Specialties; inter-corporate loan inherited in the merger'],
      ['Receivables outstanding, Mar-26', n1(RR.receivablesMar26), 'Strides-group and promoter entities'],
    ], source: 'AR FY26 note 32' } },
    { verdicts: [
      ['Management', 'Strong', 'CEO Neeraj Sharma and CFO Anurag Bhagania; execution on capacity and compliance has been good', 'Credible operators'],
      ['Board independence', 'Moderate', '5 of 8 independent, non-executive chair (the founder); an independent sub-committee reviewed the Steriscience scheme', 'Better than the minimum'],
      ['Related parties', 'Weak', `~28% of revenue and ~₹${n0(RC.processConversionStrides + RC.supportServices + RC.rentKaruna + RC.rentChayadeep)} cr of costs with group companies`, 'Arm\'s length cannot be tested from outside'],
      ['Steriscience scheme', 'Weak', 'All-share purchase of promoter/TPG-owned businesses (~18.5% dilution) announced Sep-2025, dropped May-2026 after minority objections; "to revisit after FY28"', 'Minorities had to push back'],
      ['Promoter pledge and selling', 'Weak', `${OW.pledgedPctOfPromoter}% of promoter shares pledged; ~8 points sold Jan-Jun 2025`, 'Overhang'],
      ['Guidance record', 'Weak', 'FY26 guided ~30% growth, delivered −2%; FY28 target raised with the deal and cut back without it', 'Treat FY28 guidance as a ceiling'],
      ['Balance sheet discipline', 'Moderate', 'Covenant waivers for FY26; net debt guided below 1.5x EBITDA; five rating upgrades', 'Watch FY27 covenants'],
      ['Disclosure', 'Moderate', 'No segment, customer or product revenue; detailed capacity and approvals commentary', 'Thin for a ₹17,000 cr company'],
    ], head: ['Area', 'Score', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'AR FY26 (notes 12, 32, 32A); Q2FY26 and Q4FY26 decks and calls; shareholding patterns' },
    { callout: '**Overall: RED-AMBER.** We see no evidence of wrongdoing, and the independent directors did their job on the Steriscience deal. But for a minority shareholder the structure is the risk: the founder\'s family sits on both sides of a quarter of revenue and of several cost lines, has pledged a large part of a small stake, and has shown it will propose buying its own businesses with OneSource shares. We apply no explicit discount (the house method does not), but this is a reason the multiple should not be generous.' },
  ],
};

module.exports = { ownership, governance };
