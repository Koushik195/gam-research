// Poonawalla Fincorp report, part 5: ownership (Jun-2026), management and governance, forecasts vs the street,
// street view and critiques.
const X = require('./POONAWALLA.ctx');
const { C, D, F, A, fin, fi, n0, n1, n2, pc, price, shares, ST, CONS, SE, tpHi, tpLo, tpMed, Q1, bvSep28, shortDate } = X;
const OW = D.ownership, GV = C.governance;

const ownership = base => ({
  ...base,
  blocks: [
    { p: `In Jun-2026 the promoter, Rising Sun Holdings (Adar Poonawalla), held ${OW.promoterGroup}%, down from ${OW.jun25.promoter}% a year earlier after the April QIP (and despite the ₹1,500 cr preferential issue in Sep-2025). Mutual funds more than doubled their stake to ${OW.mutualFunds}% (${OW.jun25.mutualFunds}% a year earlier), led by Kotak Midcap Fund at 6.75%; foreign investors held ${OW.fii}%, insurers ${OW.insurance}% and retail and others ${OW.public}%. Free float is ~41%; the register is now more institutional than a year ago.` },
    ...base.blocks,
    { exhibit: { type: 'table', title: 'Largest named shareholders, 30-Jun-2026', head: ['Holder', '% of shares'], rows: OW.holders.map(([h, v]) => [h, `${v.toFixed(2)}%`]), source: 'BSE shareholding pattern (Jun-2026) via Trendlyne; Q1FY27 presentation p42' } },
  ],
});

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Management and governance: a strong sponsor and an HDFC-trained team, with a short record and a 2021 scare',
  blocks: [
    { p: `Adar Poonawalla (CEO of Serum Institute of India) chairs the board as a non-executive promoter director. Arvind Kapil, who spent ~25 years at HDFC Bank (last as group head of mortgage banking), has been MD & CEO since 10-Jun-2024; he brought in business heads from banks and NBFCs and runs the company on six "vectors" (disbursement yield, NIM, credit cost, GNPA, opex, ROA). His predecessor Abhay Bhutada resigned in Sep-2021 after a SEBI interim insider-trading order, was reinstated in Feb-2022 after an internal probe, saw SEBI revoke the interim order against him in Jun-2022, and retired early in Jun-2024.` },
    { verdicts: [
      ['Promoter and sponsor', 'Strong', 'Rising Sun put in ₹3,206 cr in 2021 (of a ₹3,456 cr issue) and ₹1,500 cr in 2025, and owns 59%; brand and AAA rating follow from it.', 'Patient capital; likely to support future raises.'],
      ['Management quality', 'Good, unproven', 'Clean-up of the STPL book in FY25, six launches on time, opex and NIM promises kept.', 'Two years is less than one credit cycle for the new books.'],
      ['Guidance discipline', 'Weak', 'Previous team guided ROA 4-4.5% (Apr-2024) and lost money in FY25; current ROA target moved from ~Jun-2027 to Jun-2028.', 'Discount management targets; use the numbers.'],
      ['Regulatory and conduct record', 'Moderate', 'SEBI insider-trading order against the former MD (2021), revoked for him in 2022; no RBI action against the company found in our sources.', 'A past scare, not a current issue.'],
      ['Pay', 'Moderate', `MD ${n1(126.58)}x the median employee (+43% in FY26); managerial pay +${GV.managerialPayIncrease}% vs +${GV.otherPayIncrease}% for other staff; median pay fell 10% on front-line hiring; ESOP cost ₹70 cr in FY26.`, 'High for a company earning a ~6% ROE in FY26.'],
      ['Disclosure', 'Good', 'Stage-wise coverage, early-delinquency curves, product tables, ALM each quarter; no product-level profitability.', 'Better than most mid-sized NBFCs.'],
      ['Capital allocation', 'Moderate', 'Equity raised in 2021, 2025 and 2026 (₹7,456 cr in all); no dividend for FY25-FY26; housing arm sold at a good price.', 'Growth comes first; dilution will continue.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'Annual Reports FY25-FY26; company filings and calls; Business Standard, Business Today' },
    { callout: '**Our view:** governance is acceptable and improving. The sponsor is strong and the board has a majority of independent directors; the 2021 episode was resolved. The real governance question is credibility: two management teams in three years have set ROA targets the company has not met. We would want to see ROA above 2.5% for a few quarters before paying for 3%+.' },
  ],
};

const cmpRow = (label, ours, street, src) => [label, ours, street, src];
const forecasts = {
  id: 'forecasts', nav: 'Our forecasts vs the street', kicker: 'Forecasts', title: 'Our forecasts: EPS roughly doubles in FY27E and nearly doubles again by FY29E, ROE still only 11-14%',
  blocks: [
    { exhibit: { type: 'table', title: 'Key forecasts (consolidated)', x: 'fin.labels', from: 'FY24', to: 'FY29E', rowsRef: [
      { name: 'AUM (₹ cr)', ref: 'fin.aum', fmt: 'num' }, { name: 'AUM growth (%)', ref: 'fin.aumGrowth', fmt: 'pct' }, { name: 'Net interest income (₹ cr)', ref: 'fin.nii', fmt: 'num' },
      { name: 'NIM (%)', ref: 'fin.nim', fmt: 'pct' }, { name: 'Cost-to-income (%)', ref: 'fin.costToIncome', fmt: 'pct' }, { name: 'Pre-provision profit (₹ cr)', ref: 'fin.ppop', fmt: 'num' },
      { name: 'Credit cost (% avg AUM)', ref: 'fin.creditCost', fmt: 'pct' }, { name: 'Net profit (₹ cr)', ref: 'fin.pat', fmt: 'num', hl: true },
      { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n2', hl: true }, { name: 'Book value per share (₹)', ref: 'fin.bvps', fmt: 'n1' },
      { name: 'ROA on total assets (%)', ref: 'fin.roa', fmt: 'pct' }, { name: 'ROE (%)', ref: 'fin.roe', fmt: 'pct', hl: true },
    ], source: `Company, Screener.in; GAM estimates. FY24 profit incl. the ₹816 cr net exceptional gain. EPS on year-end shares: 80.8 cr (FY26), ${n1(F.sharesOut[0])} cr (FY27E, after the QIP), ${n1(F.sharesOut[1])} cr (FY28E, after the assumed raise). No dividend for FY26; we model 10% payout from FY28E.` } },
    { p: `FY27E EPS of ₹{{F.eps.0|n2}} looks like a big jump from FY26's ₹${n2(A.eps[X.b])}, but it is mostly the run-rate already achieved: Q1FY27 PAT of ₹${Q1.pat} cr annualises to ₹${n0(Q1.pat * 4)} cr and our FY27E is ₹{{F.pat.0|num}} cr. Growth after that comes from a larger book and slowly falling credit and operating costs, partly offset by more shares and higher leverage.` },
    { exhibit: { type: 'table', title: 'Our estimates vs the street (estimates standing on 30-Sep-2026)', head: ['Metric', 'GAM', 'Street', 'Source of street figure'], wide: [3], rows: [
      cmpRow('FY27E PAT (₹ cr)', '{{F.pat.0|num}}', `${n0(SE.hsie.pat.FY27E / 10)}-${n0(SE.mosl.pat.FY27E / 10)}`, 'HDFC Securities, Deven Choksey (₹1,540 cr), Motilal Oswal (Jul-2026)'),
      cmpRow('FY28E PAT (₹ cr)', '{{F.pat.1|num}}', `${n0(SE.hsie.pat.FY28E / 10)}-${n0(SE.mosl.pat.FY28E / 10)}`, 'HDFC Securities; Deven Choksey ₹2,626 cr; Motilal Oswal'),
      cmpRow('FY27E / FY28E EPS (₹)', '{{F.eps.0|n2}} / {{F.eps.1|n2}}', `${SE.hsie.eps.FY27E}-${SE.mosl.eps.FY27E} / ${SE.hsie.eps.FY28E}-${SE.mosl.eps.FY28E}`, 'HDFC Securities; Motilal Oswal'),
      cmpRow('FY28E BVPS (₹)', '{{F.bvps.1|n1}}', `${SE.mosl.bvps.FY28E}-${SE.hsie.abvps.FY28E}`, 'Motilal Oswal (no raise); HDFC Securities adjusted book; Deven Choksey ₹187.4'),
      cmpRow('FY28E ROE (%)', '{{F.roe.1|pct}}', `${SE.hsie.roe.FY28E}-${SE.deven.roe.FY28E}%`, 'HDFC Securities 12.1%; Motilal Oswal 16.5%; Deven Choksey 16.8%'),
      cmpRow('FY28E ROA (%)', '{{F.roa.1|pct}}', `${SE.hsie.roa.FY28E}-${SE.mosl.roa.FY28E}%`, 'HDFC Securities; Motilal Oswal'),
      cmpRow('Credit cost FY27E / FY28E', '{{F.creditCost.0|pct}} / {{F.creditCost.1|pct}}', `${SE.mosl.creditCost.FY27E}% / ${SE.mosl.creditCost.FY28E}% (MOSL); ~2% (HSIE)`, 'Motilal Oswal; HDFC Securities'),
    ], source: 'Broker notes and summaries dated 17-Jul to 10-Aug 2026; no dated consensus EPS was available to us (gap).' } },
    { callout: `**Where we differ:** on FY27E profit we are below every broker we found (₹{{F.pat.0|num}} cr vs ₹${n0(SE.hsie.pat.FY27E / 10)}-${n0(SE.mosl.pat.FY27E / 10)} cr), because we hold credit cost at 2.25% and opex at 3.95% of AUM for the whole year rather than extrapolating further gains from Q1. On FY28E we are ${pc((F.pat[1] / (SE.hsie.pat.FY28E / 10) - 1) * 100)} vs HDFC Securities and ${pc((F.pat[1] / (SE.mosl.pat.FY28E / 10) - 1) * 100)} vs Motilal Oswal: the bulls take credit cost to ~1.9% and opex lower, and we add ~7.7% more shares for the FY28E raise. Our book per share is higher than the street's because of that raise at ~2.2x book.` },
  ],
};

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street: split between growth believers and valuation sceptics, targets ₹${n0(tpLo)}-${n0(tpHi)}`,
  blocks: [
    { p: `On 30-Sep-2026 the brokers we could find were split. **Buy**: UBS ₹640 (17-Jul), Anand Rathi ₹663 (May), Deven Choksey ₹600 (3.2x FY28E adjusted book), Motilal Oswal ₹570 (3.0x Mar-28E book; reiterated 10-Aug), Jefferies ₹560 and ICICI Securities ₹555. **Reduce**: Emkay ₹440 (1.9x FY28E book, with a ₹3,000 cr raise built in), JM Financial ₹410 (2.2x FY28E book, May) and HDFC Securities ₹365 (residual income, ~1.9x Mar-28 adjusted book). The median target was ₹${n0(tpMed)}; S&P Global's consensus on 31-Jul was ₹${n2(CONS.avgTp)} across ${CONS.n} analysts. The split is not about the business, which everyone agrees is improving, but about how much of the ROA ramp to pay for in advance.` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who', 'Our view'], wide: [0, 2], rows: [
      ...D.critiques.map(([a, w], i) => [a, w, [
        'Agree: our ROE path (11-14%) is close to theirs; the price needs ~20%+.',
        'Partly agree: the trend is down, but write-offs (~2% of AUM) and coverage cuts say the true loss rate is not yet below 2%.',
        'Agree: cover fell from ~2.8% to ~1.5% of loans in a year.',
        'Agree: ~30% of FY26 pre-tax profit; we keep fees falling as a share of AUM.',
        'Agree: we build in ₹3,000 cr in FY28E too.',
        'Partly agree: the engines are real; 2.4% ROA in FY28E is plausible, ~16.5% ROE needs more leverage than capital rules allow without raises.',
      ][i]]),
    ], source: 'Broker notes and summaries, May-Aug 2026; GAM Research' } },
  ],
};

module.exports = { ownership, governance, forecasts, street };
