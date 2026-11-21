// L&T Finance report, part 5: ownership (Jun-2026), management and governance, forecasts vs the street, street view
// and critiques.
const X = require('./LTF.ctx');
const { C, D, F, A, fin, n0, n1, n2, pc, price, ST, CONS, SE, tpHi, tpLo, feeCutEps28, b, Q1, brandFeePct } = X;
const OW = D.ownership, GV = C.governance, J = OW.jun25;

const ownership = base => ({
  ...base,
  blocks: [
    { p: `In Jun-2026 Larsen & Toubro held ${OW.promoterGroup}% (165.25 cr shares at Mar-26); its share drifts down slowly as employee stock options are exercised. Domestic institutions held ${OW.dii}% (mutual funds, insurers; up from 8.7% in Mar-24), foreign investors ${OW.fii}% and the public ${OW.public}%. The number of shareholders fell from ${n0(J.shareholders)} to ${n0(OW.shareholders)} in a year as retail investors sold into the 2025-26 rally. L&T has no stated plan to reduce its stake; for an AAA-rated NBFC, the parent's control is part of the credit story.` },
    ...base.blocks,
    { exhibit: { type: 'table', title: 'Shareholding, 30-Jun-2026 vs a year earlier', head: ['Holder', 'Jun-2025', 'Jun-2026', 'Change (pp)'], rows: [
      ['Larsen & Toubro (promoter)', `${J.promoterGroup.toFixed(2)}%`, `${OW.promoterGroup.toFixed(2)}%`, n2(OW.promoterGroup - J.promoterGroup)],
      ['Foreign institutions', `${J.fii.toFixed(2)}%`, `${OW.fii.toFixed(2)}%`, n2(OW.fii - J.fii)], ['Domestic institutions', `${J.dii.toFixed(2)}%`, `${OW.dii.toFixed(2)}%`, n2(OW.dii - J.dii)], ['Public', `${J.public.toFixed(2)}%`, `${OW.public.toFixed(2)}%`, n2(OW.public - J.public)],
      ['Number of shareholders', n0(J.shareholders), n0(OW.shareholders), pc((OW.shareholders / J.shareholders - 1) * 100)],
    ], source: 'BSE shareholding pattern via Screener.in; Annual Report FY26 (L&T shareholding). Named institutional holders above 1% not available to us.' } },
  ],
});

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Management and governance: a strong parent and a professional team; watch the brand fee and the promises on returns',
  blocks: [
    { p: `LTF is run by Sudipta Roy (MD & CEO since 24-Jan-2024; previously ICICI Bank, Citibank and Deutsche Bank), with Sachinn Joshi as CFO and Raju Dodti as COO (both proposed as whole-time directors in April 2026). The board of eight is chaired by S.N. Subrahmanyan, Chairman & MD of L&T, with L&T's finance head R. Shankar Raman as a second non-executive director and five independent directors, including former SBI deputy MD Dhananjaya Tambe and former Yes Bank CEO Prashant Kumar. Joint auditors Brahmayya & Co and T R Chadha & Co LLP gave an unmodified FY26 opinion.` },
    { verdicts: [
      ['Promoter and group', 'Strong', 'L&T (66%) has kept LTF capitalised through the clean-up (FY21 rights issue) and lends it a AAA rating.', 'The single biggest support for the credit story.'],
      ['Management quality', 'Good', 'Executed the retail pivot (98% retail), built in-house tech (Cyclops, Nostradamus); candid on calls.', 'Execution on growth and quality goals is proven; on returns, not yet.'],
      ['Guidance reliability', 'Moderate', 'Lakshya 2026: growth, retailisation and asset-quality goals met; ROA goal missed by ~40-60bp. FY26 ROA at the bottom of its range.', 'Discount the return promises (ROE 16-18% by FY31), not the growth ones.'],
      ['Pay', 'Reasonable', 'MD & CEO ₹5.08 cr in FY26 (192.7x median employee pay; +7%).', 'Modest for a ₹66,000 cr company.'],
      ['Related parties', 'Watch', `Brand licence fee to L&T ₹${n0(GV.brandFee ? C.fy26.brandFeeToLT : 0)} cr in FY26 (~${n1(brandFeePct)}% of PBT), up 14%; small corporate-support charges.`, 'Disclosed and approved, but it grows with profit and goes to the controlling shareholder.'],
      ['Disclosure', 'Good', 'Stage-wise provisions, collection efficiency by product, wholesale and SR run-off, Cyclops cohort data.', 'Missing: segment profitability, split of insurance income by product.'],
      ['Capital allocation', 'Moderate', 'Sold the wealth and mutual-fund businesses, kept capital through the clean-up; ~25% payout; ₹712 cr gold acquisition.', 'Over-capitalisation held ROE down for years; now being used for growth.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'Annual Report FY26 (board\'s report, corporate governance report, related-party note); Q1FY27 presentation p71-72; company calls' },
    { callout: '**Our view:** governance is a strength: an AAA parent, an independent and experienced board and a professional management team. The two things to watch are the brand fee to L&T (a growing related-party payment) and the habit of setting return targets that slip (Lakshya 2026 ROA). Neither is a reason to avoid the stock; the second is a reason not to pay today for the FY31 targets.' },
  ],
};

const cmpRow = (...cells) => cells;
const forecasts = {
  id: 'forecasts', nav: 'Our forecasts vs the street', kicker: 'Forecasts', title: `Our forecasts: EPS ${pc(F.epsGrowth[0])} in FY27E on lower credit costs, slower in FY28E on the IRDAI haircut; ROE 13-15%`,
  blocks: [
    { exhibit: { type: 'table', title: 'Key forecasts (consolidated)', x: 'fin.labels', from: 'FY24', to: 'FY29E', rowsRef: [
      { name: 'Loan book (₹ cr)', ref: 'fin.aum', fmt: 'num' }, { name: 'Book growth (%)', ref: 'fin.aumGrowth', fmt: 'pct' }, { name: 'Net interest income (₹ cr)', ref: 'fin.nii', fmt: 'num' },
      { name: 'NIM on book (%)', ref: 'fin.nim', fmt: 'pct' }, { name: 'Fees & other operating income (₹ cr)', ref: 'fin.feeIncome', fmt: 'num' }, { name: 'Cost-to-income (%)', ref: 'fin.costToIncome', fmt: 'pct' },
      { name: 'Pre-provision profit (₹ cr)', ref: 'fin.ppop', fmt: 'num' }, { name: 'Credit cost (% avg book)', ref: 'fin.creditCost', fmt: 'pct' }, { name: 'Net profit (₹ cr)', ref: 'fin.pat', fmt: 'num', hl: true },
      { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n2', hl: true }, { name: 'EPS growth (%)', ref: 'fin.epsGrowth', fmt: 'pct' }, { name: 'Book value per share (₹)', ref: 'fin.bvps', fmt: 'n1' },
      { name: 'ROA on total assets (%)', ref: 'fin.roa', fmt: 'pct' }, { name: 'ROE (%)', ref: 'fin.roe', fmt: 'pct', hl: true },
    ], source: `Company, Screener.in; GAM estimates. Dividend ₹2.75 a share for FY26; we model a 23% payout (₹${n2(F.dps[0])} for FY27E). FY24 fees and opex on the audited basis.` } },
    { p: `FY27E EPS growth of {{F.epsGrowth.0|pct}} comes from a 24% larger average book and credit cost falling from {{fin.creditCost.11|pct}} to {{F.creditCost.0|pct}}. It is consistent with Q1: profit was ₹902 cr; our FY27E of ₹{{F.patAttrib.0|num}} cr needs ~₹${n0((F.patAttrib[0] - Q1.pat) / 3)} cr a quarter for the rest of the year, ${pc(((F.patAttrib[0] - Q1.pat) / 3 / Q1.pat - 1) * 100)} above Q1, while the book grows ~5% a quarter. FY28E growth slows to {{F.epsGrowth.1|pct}} mainly because of our IRDAI fee haircut (~₹${n1(feeCutEps28)} of EPS); FY29E recovers to {{F.epsGrowth.2|pct}}.` },
    { exhibit: { type: 'table', title: 'Our estimates vs the street (estimates standing on 30-Sep-2026)', head: ['Metric', 'GAM', 'Motilal Oswal', 'Emkay', 'ICICI Direct', 'UBS'], rows: [
      cmpRow('FY27E EPS (₹)', '{{F.eps.0|n2}}', n1(SE.mosl.eps.FY27E), n1(SE.emkay.eps.FY27E), n1(SE.idirect.eps.FY27E), '–'),
      cmpRow('FY28E EPS (₹)', '{{F.eps.1|n2}}', n1(SE.mosl.eps.FY28E), n1(SE.emkay.eps.FY28E), n1(SE.idirect.eps.FY28E), n1(SE.ubs.eps.FY28E)),
      cmpRow('FY29E EPS (₹)', '{{F.eps.2|n2}}', '–', n1(SE.emkay.eps.FY29E), '–', '–'),
      cmpRow('FY28E BVPS (₹)', '{{F.bvps.1|n1}}', n1(SE.mosl.bvps.FY28E), n1(SE.emkay.bvps.FY28E), '–', '–'),
      cmpRow('FY28E ROE (%)', '{{F.roe.1|pct}}', `${n1(SE.mosl.roe.FY28E)}%`, `${n1(SE.emkay.roe.FY28E)}%`, `${n1(SE.idirect.roe.FY28E)}%`, '–'),
      cmpRow('FY28E ROA (%)', '{{F.roa.1|pct}}', `${n1(SE.mosl.roa.FY28E)}%`, `${n1(SE.emkay.roa.FY28E)}%`, `${n1(SE.idirect.roa.FY28E)}%`, '–'),
      cmpRow('FY27E book growth', '{{F.aumGrowth.0|pct}}', '~26%', `${n1(SE.emkay.aumGrowth.FY27E)}%`, '~23% CAGR FY26-28E', '–'),
    ], source: 'Motilal Oswal, Emkay and ICICI Direct (13-Jul-2026), UBS via IndMoney (23-Sep-2026); all consolidated. No consensus EPS was available to us (gap).' } },
    { callout: '**Where we differ:** we are 2-3% below Motilal Oswal and Emkay on FY27E and ~10-13% below them on FY28E, for two reasons: our IRDAI fee haircut (published after every note except UBS\'s, which came the same day) and a credit-cost path 10-15bp above guidance. Our book value is close to the street\'s, so the gap is in ROE: {{F.roe.1|pct}} in FY28E against 15-16% at Motilal Oswal and Emkay. If IRDAI drops the caps, our FY28E EPS rises ~8%, close to ICICI Direct\'s.' },
  ],
};

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street: seven Buys, one Neutral, one Underweight; targets ₹${n0(tpLo)}-${n0(tpHi)}`,
  blocks: [
    { p: `After Q1FY27 (10-Jul-2026) brokers stayed positive. Motilal Oswal (₹380), ICICI Direct (₹380, upgraded from Hold), Emkay (₹370) and ICICI Securities (₹370, upgraded from Add) all value LTF at ~2.7x FY28E book. Nomura (Buy, ₹370) and Citi (Buy, ₹340) did not disclose a method in the sources we saw. JPMorgan is Neutral (₹320): good quarter, but NIM pressure, rising net slippages and a valuation of ~2.3x FY28 book that "already reflects much of the positive outlook". Morgan Stanley (Underweight, ₹150, secondary sources) argues ROE of 15% is 2.5-3 years away. UBS upgraded to Buy (₹380, 18x FY28E EPS) on 23-Sep-2026, the day IRDAI's paper came out, on a stronger unsecured-credit cycle. The median target was ₹${n0(CONS.medianTp)}, ${pc((CONS.medianTp / price - 1) * 100)} above the 30-Sep price; every target was set before IRDAI's proposal and the late-September fall.` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who', 'Our view'], wide: [0, 2], rows: [
      ['ROE of 15% is 2.5-3 years away; growth alone will not fix returns', 'Morgan Stanley', 'Agree: we reach ~15% only in FY29E.'],
      ['Valuation already reflects the good news', 'JPMorgan', 'Agree, more so after IRDAI; the price implies ~18% ROE for ever.'],
      ['Insurance distribution income at regulatory risk; LTF the most exposed', 'IIFL (24-Sep); Nomura and Emkay risk lists', `Agree: we take ~₹${n1(feeCutEps28)} off FY28E EPS; the bear case loses most of it.`],
      ['Personal-loan growth is unseasoned', 'Analysts on the Q1 call; UBS', 'Agree: 13% of the book, +80% in a year; we keep credit cost above guidance.'],
      ['Monsoon / El Niño risk to rural books', 'Nomura, Emkay', 'Partly: reservoirs are adequate (company), but group loans and tractors would be hit together.'],
      ['AI underwriting is a lasting edge (bull case)', 'Nomura, Emkay, Motilal Oswal', 'Proven in two-wheelers; not yet in personal loans or microfinance.'],
    ], source: 'Broker notes and press, 12-Jul to 24-Sep 2026; GAM Research' } },
  ],
};

module.exports = { ownership, governance, forecasts, street };
