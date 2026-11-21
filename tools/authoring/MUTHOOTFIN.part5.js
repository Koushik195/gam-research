// Muthoot Finance report, part 5: ownership (Jun-2026), management and governance, forecasts vs the street,
// street view and critiques.
const X = require('./MUTHOOTFIN.ctx');
const { C, D, F, A, fin, fi, n0, n1, n2, pc, price, shares, ST, tpHi, tpLo, tpMed, streetEps, mosl, jef, b, Q1 } = X;
const OW = D.ownership, GV = C.governance;
const subsQ1 = 2825 - 2551, subsQ1ly = 1974 - 2046; // consolidated − standalone PAT, ₹ cr

const ownership = base => ({
  ...base,
  blocks: [
    { p: `In Jun-2026 the Muthoot family (promoter group) held ${OW.promoterGroup}%, unchanged for years and with nothing pledged. The holdings are spread across the second and third generations: chairman George Jacob Muthoot and George Thomas Muthoot ${OW.holders[0][1]}% each, MD George Alexander Muthoot ${OW.holders[4][1]}%, and family members 3.7-7.5% each. The free float is only ~27%. Foreign investors held ${OW.fii}% (12.31% in Mar-2026) and mutual funds ${OW.mf}%, led by SBI Mutual Fund (${OW.holders[12][1]}%). Retail holders own ${OW.public}%.` },
    ...base.blocks,
    { exhibit: { type: 'table', title: 'Largest named shareholders, 30-Jun-2026', head: ['Holder', '% of shares'], rows: OW.holders.map(([h, v]) => [h, `${v.toFixed(2)}%`]), source: 'BSE shareholding pattern for Jun-2026 (via Trendlyne); Screener.in' } },
    { callout: '**So what:** a 73% family stake means no takeover risk and no pressure from activists, but also a small free float (index weights and liquidity are lower than the company\'s size suggests) and a board the family controls. The steady promoter holding through a 34% fall in the share price since January is a mild positive.' },
  ],
});

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Management and governance: family-run, conservative with the balance sheet, generous with its own pay',
  blocks: [
    { p: `Muthoot is run by the family that founded it. George Jacob Muthoot is chairman and George Alexander Muthoot managing director; George Thomas Muthoot (joint MD) and four other family members are whole-time directors, including three of the next generation. Eight independent directors sat on the board in Jun-2026. The company is an RBI "upper layer" NBFC with bank-like governance rules. Joint auditors Krishnamoorthy & Krishnamoorthy and PSDY & Associates (appointed to 2027) reported no qualification on FY26.` },
    { verdicts: [
      ['Promoter alignment', 'Strong', '73.35% family stake, no pledge, no equity issued since 2015; dividends paid for 14 years since listing.', 'Owners\' money is at risk alongside minority holders.'],
      ['Management quality', 'Strong', 'Decades of gold-lending experience; navigated the FY13-15 LTV cap and the FY23 rate war with losses kept tiny.', 'Operations are excellent; communication with investors is terse.'],
      ['Disclosure', 'Moderate', 'Tonnes, gold price and margin of safety every quarter (rare); but no split of one-off vs clean yield, no incremental yields, no profit guidance.', 'Makes margins hard to forecast; contributed to the Q1 surprise.'],
      ['Pay', 'Weak', `${GV.promoterPay}. Directors' remuneration ₹${GV.directorsRemunerationCr.FY26} cr in FY26 (₹${GV.directorsRemunerationCr.FY22} cr in FY22), ~1% of standalone PBT.`, 'High for a family-run lender; partly profit-linked commission.'],
      ['Related parties', 'Moderate', 'Parent lends ₹3,890 cr to Muthoot Money; some premises acquired from or linked to promoter-family members.', 'Disclosed and small relative to the balance sheet.'],
      ['Succession', 'Moderate', 'Three next-generation family members already whole-time directors.', 'Planned within the family; no outside CEO.'],
      ['Capital allocation', 'Moderate', 'Disciplined in gold; subsidiaries (Belstar, Homefin, Sri Lanka) have earned little on the capital put in until FY26.', 'Diversification has added risk more than value, except Muthoot Money.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'Annual Report FY2025-26 (directors\' report, remuneration annexure, notes); Q1FY27 presentation p12; GAM Research' },
    { callout: '**Our view:** governance is adequate and the family has been a careful steward of the balance sheet through two hard cycles. The weak points are pay (four family executives at 766x the median employee) and disclosure on the one number that now matters most, the yield. Neither is a reason to avoid the stock; both are reasons not to pay a premium multiple.' },
  ],
};

const cmpRow = (label, ours, street, src) => [label, ours, street, src];
const forecasts = {
  id: 'forecasts', nav: 'Our forecasts vs the street', kicker: 'Forecasts', title: 'Our forecasts: EPS +9% in FY27E as yields reset, then ~11-13% a year; ROE from 26% to 22%',
  blocks: [
    { exhibit: { type: 'table', title: 'Key forecasts (consolidated)', x: 'fin.labels', from: 'FY23', to: 'FY29E', rowsRef: [
      { name: 'AUM (₹ cr)', ref: 'fin.aum', fmt: 'num' }, { name: 'AUM growth (%)', ref: 'fin.aumGrowth', fmt: 'pct' }, { name: 'Net interest income (₹ cr)', ref: 'fin.nii', fmt: 'num' },
      { name: 'NIM (%)', ref: 'fin.nim', fmt: 'pct' }, { name: 'Cost-to-income (%)', ref: 'fin.costToIncome', fmt: 'pct' }, { name: 'Pre-provision profit (₹ cr)', ref: 'fin.ppop', fmt: 'num' },
      { name: 'Credit cost (% avg AUM)', ref: 'fin.creditCost', fmt: 'pct' }, { name: 'Net profit (₹ cr)', ref: 'fin.pat', fmt: 'num', hl: true }, { name: 'Minority interest (₹ cr)', ref: 'fin.minority', fmt: 'num' },
      { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n2', hl: true }, { name: 'EPS growth (%)', ref: 'fin.epsGrowth', fmt: 'pct' }, { name: 'Book value per share (₹)', ref: 'fin.bvps', fmt: 'n1' },
      { name: 'ROA on total assets (%)', ref: 'fin.roa', fmt: 'pct' }, { name: 'ROE (%)', ref: 'fin.roe', fmt: 'pct', hl: true },
    ], source: `Company, Screener.in; GAM estimates (gold price flat at the 30-Sep-2026 level). Dividend ₹30 for FY26; we model a 12% payout, ₹${n2(F.dps[0])} for FY27E.` } },
    { p: `FY27E profit growth of {{F.patGrowth.0|pct}} rests on two things. First, the book: AUM was ₹1,91,532 cr in June and we need ~4% a quarter to reach ₹{{F.aum.0|num}} cr by March. Second, the yield holding near Q1's level: Q1 profit of ₹2,825 cr annualises to ₹11,300 cr; our ₹{{F.pat.0|num}} cr needs ~₹${n0((F.pat[0] - 2825) / 3)} cr a quarter for the rest of the year, ${pc(((F.pat[0] - 2825) / 3 / 2825 - 1) * 100)} above Q1, on a book ~${Math.round(((F.aum[0] + 191532) / 2 / ((191532 + 181917) / 2) - 1) * 100)}% larger. The subsidiaries help too: they earned ₹${subsQ1} cr in Q1FY27 against a loss of ₹${Math.abs(subsQ1ly)} cr a year earlier, so consolidated profit grows faster than the parent's.` },
    { exhibit: { type: 'table', title: 'Our estimates vs the street (estimates standing on 30-Sep-2026)', head: ['Metric', 'GAM', 'Street', 'Source of street figure'], wide: [3], rows: [
      cmpRow('FY27E PAT (₹ cr)', '{{F.patAttrib.0|num}} (group, attributable)', '10,580 (standalone)', 'Motilal Oswal (2-Aug-2026); FY27 PAT +4-5%'),
      cmpRow('FY28E PAT (₹ cr)', '{{F.patAttrib.1|num}} (group)', '12,690 (standalone)', 'Motilal Oswal'),
      cmpRow('FY27E EPS growth', '{{F.epsGrowth.0|pct}}', '~5%', 'Jefferies (3-Aug-2026)'),
      cmpRow('Mar-28E BVPS (₹)', '{{F.bvps.1|n1}}', `~${n0(streetEps.moslBvFY28)}`, 'Motilal Oswal implied: ₹2,850 target ÷ ~2.0x Mar-28E book'),
      cmpRow('FY27E ROE', '{{F.roe.0|pct}}', '25%', 'Motilal Oswal, Nirmal Bang; Jefferies "can generate 25%"'),
      cmpRow('FY27E ROA', '{{F.roa.0|pct}} (on assets)', '5.3-5.5%', 'Motilal Oswal 5.3%, Nirmal Bang 5.5%; Nuvama standalone 4.8-5.3%'),
      cmpRow('NIM, steady state', '{{F.nim.0|pct}} → {{F.nim.2|pct}}', '~10.3-11%', 'Motilal Oswal ~10.3%, Nirmal Bang ~11%'),
      cmpRow('AUM growth FY27E', '{{F.aumGrowth.0|pct}} (group)', '22% (standalone gold)', 'Motilal Oswal'),
      cmpRow('Credit cost FY27E', '{{F.creditCost.0|pct}}', '0.25-0.30%', 'Motilal Oswal'),
    ], source: 'Broker notes and press summaries dated 2-Aug to 10-Sep 2026; implied figures are our arithmetic. No consensus EPS was available to us (gap).' } },
    { callout: `**Where we differ:** on the parent we are close to Motilal Oswal (their standalone FY27E ₹10,580 cr vs ~₹10,500 cr in our group number after taking out the subsidiaries' ~₹1,100 cr run-rate). At the group level we are above the ~5% EPS growth Jefferies expects mainly because subsidiary profit roughly doubles (consolidated minus standalone profit was ₹473 cr in FY26 and already ₹274 cr in Q1FY27 alone, led by Muthoot Money and Belstar's recovery). We are more cautious on credit cost (0.40% vs 0.25-0.30%) and on AUM (18% vs 22% for gold).` },
  ],
};

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street: split after Q1, targets ₹${n0(tpLo)}-${n0(tpHi)}, median ~₹${n0(tpMed)}`,
  blocks: [
    { p: `Q1FY27 turned much of the street cautious. On 3-Aug-2026 Jefferies cut to Hold (target ₹3,300 from ₹4,350), Nirmal Bang to Hold (₹3,000 from ₹4,265) and Investec to Sell; Motilal Oswal stayed Neutral (₹2,850, ~2x Mar-28E book) and called FY26 "the cyclical profitability peak"; Nuvama cut to ₹3,300 and Kotak to ₹3,400 (Add). The bulls stayed: Bernstein (Outperform, ₹4,500), CLSA (Accumulate, ₹4,000 from ₹4,600), Morgan Stanley (₹3,705) and Joindre (Buy, ₹3,402). 360 ONE had the lowest target, ₹2,425. On 10-Sep Jefferies repeated Hold, noting the stock traded at 2.1x one-year-forward book, about its five-year average.` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who', 'Our view'], wide: [0, 2], rows: D.critiques.map(r => [r[0], r[1], r[2]]), source: 'Broker notes and press, 2-Aug to 10-Sep 2026; Q1FY27 call; GAM Research' } },
  ],
};

module.exports = { ownership, governance, forecasts, street };
