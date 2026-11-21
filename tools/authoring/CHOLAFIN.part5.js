// Cholamandalam report, part 5: ownership (Jun-2026), management and governance, forecasts vs the street,
// street view and critiques.
const X = require('./CHOLAFIN.ctx');
const { C, D, F, A, fin, fi, n0, n1, n2, pc, price, sharesNow, ST, CONS, SE, tpHi, tpLo, feeCutEps28, b, Q1 } = X;
const OW = D.ownership, GV = C.governance;

const ownership = base => ({
  ...base,
  blocks: [
    { p: `In Jun-2026 the promoter group held ${OW.promoterGroup}%: the listed Murugappa holding company Cholamandalam Financial Holdings ${OW.holders[0][1]}%, Ambadi Investments ${OW.holders[1][1]}% and other group entities and family members ${OW.holders[2][1]}%. The promoter share has slipped below 50% as the CCDs converted. Foreign investors held ${OW.fii}% (27.96% a year earlier) and domestic institutions ${OW.dii}% (16.05%), of which mutual funds ~${OW.mutualFunds}%. Retail investors own just ${OW.public}%. The company names its holders above 1% (Axis, SBI, Kotak, ICICI Prudential, HDFC, Invesco and DSP mutual funds; Capital Group, Vanguard, BlackRock, Fidelity, JP Morgan and Norges Bank) but not their stakes.` },
    ...base.blocks,
    { exhibit: { type: 'table', title: 'Shareholding, 30-Jun-2026 vs a year earlier', head: ['Holder', 'Jun-2025', 'Jun-2026', 'Change (pp)'], rows: [
      ['Promoter group', '49.90%', `${OW.promoterGroup.toFixed(2)}%`, n2(OW.promoterGroup - 49.90)], ['– Cholamandalam Financial Holdings', 'n.d.', `${OW.holders[0][1].toFixed(2)}%`, '–'], ['– Ambadi Investments', 'n.d.', `${OW.holders[1][1].toFixed(2)}%`, '–'],
      ['Foreign institutions', '27.96%', `${OW.fii.toFixed(2)}%`, n2(OW.fii - 27.96)], ['Domestic institutions', '16.05%', `${OW.dii.toFixed(2)}%`, n2(OW.dii - 16.05)], ['Public', '6.07%', `${OW.public.toFixed(2)}%`, n2(OW.public - 6.07)],
    ], source: 'BSE shareholding pattern via Screener.in; Q1FY27 presentation p16 (promoter split)' } },
  ],
});

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Management and governance: a steady group and team, a well-paid family chairman, and related parties to watch',
  blocks: [
    { p: `Chola is run by Ravindra Kundu (Managing Director since Oct-2024, a director since 2020) with Arul Selvan as CFO; Vellayan Subbiah of the Murugappa family became whole-time Executive Chairman in Apr-2025. The board has eight members: the two executives, one non-executive promoter director (M.A.M. Arunachalam) and five independent directors. Joint auditors KKC & Associates and B.K. Khare & Co gave an unmodified FY26 opinion.` },
    { verdicts: [
      ['Promoter and group', 'Strong', 'Murugappa group (126 years; 10 listed companies) controls 49% through Cholamandalam Financial Holdings; patient owner through FY20-21.', 'Supports funding and brand; no explicit parental support for ratings.'],
      ['Management quality and continuity', 'Strong', 'Profit growth of 23-44% in each of the six years since FY20; candid calls; MD promoted from inside.', 'Execution has been the investment case.'],
      ['Guidance reliability', 'Moderate', 'Growth guidance met; FY26 credit-cost guidance (1.3%) missed by 30-40bp.', 'Discount the credit-cost promises, not the growth ones.'],
      ['Pay', 'Moderate', 'Executive Chairman ₹13.01 cr (367.5x median pay); MD ₹7.78 cr (219.7x, +20%); median pay −23% (entry-level hiring).', 'High for a family executive chairman; MD pay in line with performance.'],
      ['Related parties', 'Watch', 'Borrower insurance placed with group insurer Chola MS; services from group entities; Cobrapost allegations (Dec-2025) rebutted, no regulatory action found by 30-Sep-2026.', 'Disclosed, but a reputational risk and now exposed to IRDAI rules.'],
      ['Disclosure', 'Good', 'Segment P&Ls, stage-wise provisions by product, 15-year history.', 'Missing: split of insurance commission, borrowing mix detail.'],
      ['Capital allocation', 'Good', 'Raises in FY20 and FY24 timed for growth and accretive to book; ~97% of profit retained.', 'Dividend (₹2 a share) is token.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'Annual Report FY26 (directors\' report, corporate governance report); company calls; Business Standard (Dec-2025)' },
    { callout: '**Our view:** governance is solid for an Indian family-group lender and the management team has delivered. The two things we would watch are the size and flow of related-party business with group insurers (exactly the income IRDAI is targeting) and the gap between pay at the top and the falling median wage. Neither is a reason to avoid the stock; both are reasons not to pay a governance premium.' },
  ],
};

const cmpRow = (...cells) => cells;
const forecasts = {
  id: 'forecasts', nav: 'Our forecasts vs the street', kicker: 'Forecasts', title: `Our forecasts: EPS ${pc(F.epsGrowth[0])} in FY27E on lower credit costs, then ~18-20% a year; ROE ~19-20%`,
  blocks: [
    { exhibit: { type: 'table', title: 'Key forecasts (consolidated)', x: 'fin.labels', from: 'FY24', to: 'FY29E', rowsRef: [
      { name: 'Business AUM (₹ cr)', ref: 'fin.aum', fmt: 'num' }, { name: 'AUM growth (%)', ref: 'fin.aumGrowth', fmt: 'pct' }, { name: 'Net interest income (₹ cr)', ref: 'fin.nii', fmt: 'num' },
      { name: 'NIM on AUM (%)', ref: 'fin.nim', fmt: 'pct' }, { name: 'Fees & other operating income (₹ cr)', ref: 'fin.feeIncome', fmt: 'num' }, { name: 'Cost-to-income (%)', ref: 'fin.costToIncome', fmt: 'pct' },
      { name: 'Pre-provision profit (₹ cr)', ref: 'fin.ppop', fmt: 'num' }, { name: 'Credit cost (% avg AUM)', ref: 'fin.creditCost', fmt: 'pct' }, { name: 'Net profit (₹ cr)', ref: 'fin.pat', fmt: 'num', hl: true },
      { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n2', hl: true }, { name: 'EPS growth (%)', ref: 'fin.epsGrowth', fmt: 'pct' }, { name: 'Book value per share (₹)', ref: 'fin.bvps', fmt: 'n1' },
      { name: 'ROA on total assets (%)', ref: 'fin.roa', fmt: 'pct' }, { name: 'ROE (%)', ref: 'fin.roe', fmt: 'pct', hl: true },
    ], source: `Company, Screener.in; GAM estimates. Dividend ₹2.00 a share for FY26; we model a 3% payout (₹${n2(F.dps[0])} for FY27E). FY27E includes the ₹630 cr CCD conversion (85.75 cr shares).` } },
    { p: `FY27E EPS growth of {{F.epsGrowth.0|pct}} comes from credit cost falling from {{fin.creditCost.11|pct}} to {{F.creditCost.0|pct}} of AUM and a slightly better margin; it is consistent with Q1, when profit was ₹1,656 cr (consolidated). Our FY27E of ₹{{F.pat.0|num}} cr needs ~₹${n0((F.pat[0] - 1656) / 3)} cr a quarter for the rest of the year, ${pc(((F.pat[0] - 1656) / 3 / 1656 - 1) * 100)} above Q1, while AUM grows ~5% a quarter and Q4 is seasonally the strongest. FY28E growth slows to {{F.epsGrowth.1|pct}} mainly because of our IRDAI fee haircut (~₹${n1(feeCutEps28)} of EPS).` },
    { exhibit: { type: 'table', title: 'Our estimates vs the street (estimates standing on 30-Sep-2026)', head: ['Metric', 'GAM', 'Motilal Oswal', 'Emkay', 'Prabhudas Lilladher'], rows: [
      cmpRow('FY27E EPS (₹)', '{{F.eps.0|n2}}', n1(SE.mosl.eps.FY27E), n1(SE.emkay.eps.FY27E), n1(SE.pl.eps.FY27E)),
      cmpRow('FY28E EPS (₹)', '{{F.eps.1|n2}}', n1(SE.mosl.eps.FY28E), n1(SE.emkay.eps.FY28E), n1(SE.pl.eps.FY28E)),
      cmpRow('FY29E EPS (₹)', '{{F.eps.2|n2}}', '–', n1(SE.emkay.eps.FY29E), '–'),
      cmpRow('FY28E BVPS (₹)', '{{F.bvps.1|n1}}', n0(SE.mosl.bvps.FY28E), n1(SE.emkay.bvps.FY28E), n1(SE.pl.bvps.FY28E)),
      cmpRow('FY28E ROE (%)', '{{F.roe.1|pct}}', `${n1(SE.mosl.roe.FY28E)}%`, `${n1(SE.emkay.roe.FY28E)}%`, `${n1(SE.pl.roe.FY28E)}%`),
      cmpRow('FY27E AUM growth', '{{F.aumGrowth.0|pct}}', '~21% CAGR FY26-28E', '~22% (guidance)', '23%'),
      cmpRow('FY27E credit cost', '{{F.creditCost.0|pct}} of AUM', '~1.5% (guidance)', '<1.5% (guidance)', '1.6%'),
    ], source: 'Motilal Oswal (28-Jul and 8-Sep-2026), Emkay (29-Jul-2026), Prabhudas Lilladher (29-Jul-2026); all standalone. No consensus EPS was available to us (gap).' } },
    { callout: '**Where we differ:** we are in line with the street on FY27E and below it on FY28E (by 2-5%) because we cut fee income for IRDAI\'s proposal, which came after every note in this table. Our book value is close to the street\'s; our FY28E ROE (~19.4%) is below the 20-21% the brokers assume. If IRDAI softens or drops the caps, our FY28E EPS would rise ~4%, to the street\'s level.' },
  ],
};

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street: mostly Buy, targets ₹${n0(tpLo)}-${n0(tpHi)}, one Neutral`,
  blocks: [
    { p: `After Q1FY27 (28-Jul-2026) brokers stayed positive. Motilal Oswal raised its target to ₹2,140 and then ₹2,160 on 8-Sep (Buy, ~4x Mar-28E book), arguing that growth is broadening beyond vehicles and that Chola's premium to vehicle financiers is earned. IDBI Capital (₹2,020, Buy), Deven Choksey (₹2,003, Accumulate), Emkay (₹2,000, Add, 3.8x FY28E book), Axis Direct (₹1,945, Buy) and Prabhudas Lilladher (₹1,950, Accumulate, 3.8x FY28E adjusted book) followed. Nomura is the sceptic: Neutral, ₹1,820, calling the credit-cost beat "not clean". The median target was ₹${n0(CONS.medianTp)}, ${pc((CONS.medianTp / price - 1) * 100)} above the 30-Sep price. All targets predate the September sell-off and IRDAI's proposal.` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who', 'Our view'], wide: [0, 2], rows: [
      ['Q1 credit-cost beat is not clean: Stage 2+3 up 49bp QoQ, vehicle Stage 3 4.05%, LAP slipping', 'Nomura', 'Agree: we keep credit cost at 1.50% of AUM and do not assume the overlay is released.'],
      ['Asset-quality seasonality worse than vehicle-finance peers', 'Emkay', 'Agree; the gap matters more if the monsoon disappoints.'],
      ['Insurance-commission income at regulatory risk', 'Motilal Oswal (risks); market on 24-Sep', `Agree, and it is now concrete: we take ~₹${n1(feeCutEps28)} off FY28E EPS.`],
      ['New businesses (SME, SBPL) not yet seasoned', 'Motilal Oswal (risks)', 'Agree: Stage 3 rose in both in Q1; small books for now.'],
      ['Governance: related parties and cash deposits', 'Cobrapost (Dec-2025)', 'Rebutted and disclosed; we see a reputational, not an accounting, risk.'],
      ['Premium to vehicle financiers is justified by growth and diversification', 'Motilal Oswal', 'Partly agree: mortgages earn the premium; vehicles and CSEL do not.'],
    ], source: 'Broker notes and press, 28-Jul to 24-Sep 2026; GAM Research' } },
  ],
};

module.exports = { ownership, governance, forecasts, street };
