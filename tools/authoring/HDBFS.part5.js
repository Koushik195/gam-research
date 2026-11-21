// HDB Financial Services report, part 5: ownership (Jun-2026), management and governance, forecasts vs the
// street, street view and critiques.
const X = require('./HDBFS.ctx');
const { C, D, F, n0, n1, n2, pc, price, ST, CONS, SE, tpHi, tpLo, mosl, emkay } = X;
const OW = D.ownership, GV = C.governance;

const ownership = base => ({
  ...base,
  blocks: [
    { p: `In Jun-2026 HDFC Bank held ${OW.promoter}% (74.19% at listing; the small fall is ESOP shares issued since). Domestic institutions held ${OW.dii}% and foreign investors ${OW.fii}% (up from 3.0% in March); retail and other holders ${OW.public}% through ${(OW.shareholders / 1e5).toFixed(1)} lakh shareholders, down from ${(OW.shareholdersSep25 / 1e5).toFixed(1)} lakh in Sep-2025 as IPO applicants sold. The company names its largest institutional holders without percentages: Mirae, ICICI Prudential, Kotak, SBI and Nippon mutual funds at home; Vanguard, Baillie Gifford, MFS, Daiwa and Norway's sovereign fund abroad.` },
    ...base.blocks,
    { exhibit: { type: 'table', title: 'Shareholding, 30-Jun-2026', head: ['Holder', '% of shares', 'Comment'], rows: [
      ['HDFC Bank (promoter)', `${OW.promoter.toFixed(2)}%`, '~61.5 cr shares; no obligation to sell (public float 25.9%)'],
      ['Domestic institutions (mutual funds, insurers, pension funds)', `${OW.dii.toFixed(2)}%`, `Named: ${OW.namedHolders.domestic.join(', ')}`],
      ['Foreign portfolio investors', `${OW.fii.toFixed(2)}%`, `Named: ${OW.namedHolders.foreign.join(', ')}`],
      ['Retail and others', `${(OW.public + OW.others).toFixed(2)}%`, `${n0(OW.shareholders)} shareholders`],
    ], source: 'BSE shareholding pattern via Screener.in (Jun-2026); Q1FY27 presentation p38 (names only)' } },
    { callout: '**So what:** unlike most recent IPOs of subsidiaries, there is no forced seller here, and domestic funds already own a meaningful 12%. Foreign ownership is low (3.6%) for a AAA lender of this size; rising foreign interest would help the multiple, but nothing forces it.' },
  ],
});

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Management and governance: a long-serving team and a bank-standard board; the parent sits on both sides of some deals',
  blocks: [
    { p: `HDB is run by ${GV.md} and ${GV.cfo}; HDFC Bank is represented on the board by a non-executive nominee, and more than 75% of directors are independent. The independent chairman, Arijit Basu, resigned on 23-Jan-2026. The joint auditors gave an unmodified opinion for FY26. Disclosure is good for an NBFC: an 11-year history, product-level loan book, vertical-level Stage 3 and cover, stage-wise provisions and a liquidity gap table every quarter. On 29-Sep-2026 the company secretary and head of legal resigned with effect from 30-Oct-2026; no reason was given.` },
    { verdicts: [
      ['Promoter and group', 'Strong', 'HDFC Bank (74.1%): AAA funding, brand, risk culture of India\'s largest private bank.', 'Underpins the funding cost.'],
      ['Management execution', 'Moderate', 'Margin, costs and the asset-quality cleanup delivered; growth below the stated aim for two years.', 'Credible on risk, still to prove on growth.'],
      ['Related-party dealings', 'Moderate', `BPO revenue ₹1,224 cr from HDFC Bank, logo licence fee ₹39 cr, HDFC Bank loans ₹8,767 cr; FY27 related-party limit ₹48,197 cr approved by shareholders.`, 'Arm\'s length per the company; pricing not disclosed.'],
      ['Minority-shareholder alignment', 'Moderate', 'HDFC Bank decides product boundaries between itself and HDB; minorities have no say.', 'No forced sale, but group priorities come first.'],
      ['Board independence', 'Strong', 'More than 75% independent; two women directors; chairman role changed in Jan-2026.', 'Bank-standard board.'],
      ['Pay', 'Strong', `MD pay ${GV.mdPayRatio}x the median employee (+${GV.mdPayIncreasePct}% in FY26 vs +${GV.medianPayIncreasePct}% for the median employee); ESOPs through a trust.`, 'Restrained for a lender of this size (the median is pulled down by ~88,000 staff).'],
      ['Dividends and capital', 'Moderate', 'First dividends as a listed company (₹4 for FY26, 13% payout); policy adopted Jan-2026.', 'Sensible; leaves capital for growth.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'Annual Report FY2025-26 (corporate information, directors\' report, Annexure B, note 38); postal ballot (Feb-2026); company announcements' },
    { callout: '**Our view:** governance is solid and the reporting is better than most NBFCs. Two things to keep an eye on: turnover at the top of the board and the legal/secretarial function within nine months (chairman in January, company secretary in September), and the growing share of business done with the parent and its affiliates. Neither is a red flag on what we know.' },
  ],
};

const forecasts = {
  id: 'forecasts', nav: 'Our forecasts vs the street', kicker: 'Forecasts', title: 'Our forecasts: EPS +28% in FY27, then 11-14% a year; below the street from FY28',
  blocks: [
    { exhibit: { type: 'table', title: 'Key forecasts', x: 'fin.labels', from: 'FY24', to: 'FY29E', rowsRef: [
      { name: 'AUM (₹ cr)', ref: 'fin.aum', fmt: 'num' }, { name: 'AUM growth (%)', ref: 'fin.aumGrowth', fmt: 'pct' }, { name: 'Net interest income (₹ cr)', ref: 'fin.nii', fmt: 'num' },
      { name: 'NIM on average AUM (%)', ref: 'fin.nim', fmt: 'pct' }, { name: 'Cost-to-income incl. BPO (%)', ref: 'fin.costToIncome', fmt: 'pct' }, { name: 'Pre-provision profit (₹ cr)', ref: 'fin.ppop', fmt: 'num' },
      { name: 'Credit cost (% avg AUM)', ref: 'fin.creditCost', fmt: 'n2' }, { name: 'Net profit (₹ cr)', ref: 'fin.pat', fmt: 'num', hl: true },
      { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n2', hl: true }, { name: 'EPS growth (%)', ref: 'fin.epsGrowth', fmt: 'pct' }, { name: 'Book value per share (₹)', ref: 'fin.bvps', fmt: 'n1' },
      { name: 'ROA on total assets (%)', ref: 'fin.roa', fmt: 'pct' }, { name: 'ROE (%)', ref: 'fin.roe', fmt: 'pct', hl: true },
    ], source: 'Company, Screener.in; GAM estimates. Payout 13%.' } },
    { exhibit: { type: 'table', title: 'Our estimates vs the street (estimates standing on 30-Sep-2026)', head: ['Metric', 'GAM', 'Street', 'Source of street figure'], wide: [3], rows: [
      ['FY27E EPS (₹)', '{{F.eps.0|n2}}', `${SE.emkay.eps.FY27E}-${SE.mosl.eps.FY27E}`, 'Emkay ₹38.3, Motilal Oswal ₹39.8 (JM ₹40.2, I-Sec ₹37.8 in Apr-2026)'],
      ['FY28E EPS (₹)', '{{F.eps.1|n2}}', `${SE.emkay.eps.FY28E}-${SE.mosl.eps.FY28E}`, 'Emkay ₹46.3, Motilal Oswal ₹47.6 (JM ₹49.5, I-Sec ₹46.7, Jefferies ₹46.5 in Apr-2026)'],
      ['FY29E EPS (₹)', '{{F.eps.2|n2}}', `${SE.emkay.eps.FY29E}-${SE.jefferies.eps.FY29E}`, 'Emkay ₹55.7; Jefferies ₹56.0 (Apr-2026)'],
      ['FY28E BVPS (₹)', '{{F.bvps.1|n1}}', `${SE.emkay.bvps.FY28E}-${SE.mosl.bvps.FY28E}`, 'Emkay ₹333.5, Motilal Oswal ₹336 (JM ₹331, I-Sec ₹333)'],
      ['FY28E ROE (%)', '{{F.roe.1|pct}}', `${SE.emkay.roe.FY28E}-${SE.mosl.roe.FY28E}%`, 'Emkay 14.9%, Motilal Oswal 15.2% (JM 16.0%, I-Sec 15.1%)'],
      ['FY27E PAT (₹ cr)', '{{F.pat.0|num}}', `${n0(SE.emkay.pat.FY27E)}-${n0(SE.mosl.pat.FY27E)}`, 'Emkay, Motilal Oswal'],
      ['AUM growth FY27E / FY28E', '{{F.aumGrowth.0|pct}} / {{F.aumGrowth.1|pct}}', '15% / 16.5-17.8%', 'Emkay 15.0/17.8%; Motilal Oswal ~15/16.5% (AUM ₹1,36,419 / 1,58,935 cr)'],
      ['Credit cost FY27E / FY28E', '{{F.creditCost.0|n2}}% / {{F.creditCost.1|n2}}%', '2.3% / 2.2-2.3%', 'Emkay 2.3/2.3%, Motilal Oswal 2.3/2.2% (on loans)'],
    ], source: 'Motilal Oswal (28-Aug-2026), Emkay (15-Jul-2026), JM Financial, ICICI Securities and Jefferies (15-16 Apr-2026, latest estimates we have). No dated consensus EPS was available to us (gap).' } },
    { callout: '**Where we differ:** not on FY27 (our EPS is between Emkay and Motilal Oswal), but on FY28-29E, where we are 6-11% below. Three reasons: we assume growth of 16-17% rather than 18%; we cut a third of insurance commission from FY28E after IRDAI\'s proposal (the street notes predate it); and we let fee income dilute as the flat BPO business shrinks relative to the loan book. Our book value is ~4% below the street\'s for FY28E, so the gap matters less for a P/B target than for the case that ROE heads to 16-17%.' },
  ],
};

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street: split, targets ₹${n0(tpLo)}-${n0(tpHi)}, median ₹${n0(CONS.medianTp)}`,
  blocks: [
    { p: `On 30-Sep-2026 we count 12 broker targets from ₹${tpLo} (Emkay, Reduce) to ₹${tpHi} (ICICI Securities, Buy); the average was ₹${n0(CONS.avgTp)} and the median ₹${n0(CONS.medianTp)}, ~${pc((CONS.medianTp / price - 1) * 100)} above the 30-Sep price, which had fallen ~11% in the last two weeks of September. Five say Buy (or equivalent), one Add, five Neutral, one Reduce. Several targets are stale (Goldman Sachs and BofA from their Aug-2025 initiations; Jefferies and Equirus from April). The cautious notes say the same thing: the quality is there, growth is not yet. Motilal Oswal (Neutral, ₹760, 2.3x Mar-28E book) says the valuation already prices 15-18% growth; Emkay (Reduce, ₹725) says peers grow faster.` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who', 'Our view'], wide: [0, 2], rows: [
      ['Growth lags peers; a re-rating needs growth without slippage', 'Emkay, Motilal Oswal', 'Agree. We model a recovery to 16-17%, below management\'s aim.'],
      ['The valuation already prices 15-18% growth', 'Motilal Oswal', 'Partly. At ~1.9x FY28E book the price implies an ~18% long-run ROE at our cost of equity; we model ~14.5%.'],
      ['Credit cost is still above the 2.3% steady state and the customers are cyclical', 'Nomura', 'Agree; FY27 has monsoon and rate risks. We use 2.35% for FY27E.'],
      ['Asset quality has turned and ROA is back at 2.5%: a top pick', 'Nirmal Bang, ICICI Securities, the Aug-2026 Overweight upgrade', 'Agree on the facts; the price already reflects a recovery in returns.'],
      ['Dependence on HDFC Bank (BPO, funding, product boundaries, bank-group rules)', 'IPO risk factors; RBI directions', 'Real but manageable; the overlap risk was removed in Oct-Dec 2025.'],
    ], source: 'Broker notes and press reports (Jul-Aug 2026); RBI; GAM Research' } },
  ],
};

module.exports = { ownership, governance, forecasts, street };
