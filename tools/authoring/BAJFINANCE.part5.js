// Bajaj Finance report, part 5: ownership (Jun-2026), management and governance, forecasts vs the street,
// street view and critiques.
const X = require('./BAJFINANCE.ctx');
const { C, D, F, A, fin, fi, n0, n1, n2, pc, price, shares, ST, CONS, tpHi, tpLo, streetEps, icici, mosl, nomura, epsAdj26, b } = X;
const OW = D.ownership, GV = C.governance;

const ownership = base => ({
  ...base,
  blocks: [
    { p: `In Jun-2026 the promoter group held ${OW.promoterGroup}%: Bajaj Finserv ${OW.holders[0][1]}% and Maharashtra Scooters ${OW.holders[1][1]}%. Foreign investors held ${OW.fii}% (21.7% a year earlier) and domestic institutions ${OW.dii}% (14.5%). The biggest move was the Government of Singapore cutting from 2.41% to 1.34%, while LIC, SBI Life and SBI Mutual Fund added. Retail holders own ${OW.public}%. The register is institutional and stable; the only large seller in the last year was a sovereign fund.` },
    ...base.blocks,
    { exhibit: { type: 'table', title: 'Largest named shareholders, 30-Jun-2026', head: ['Holder', '% of shares'], rows: OW.holders.map(([h, v]) => [h, `${v.toFixed(2)}%`]), source: 'Q1FY27 presentation p25 (top-20 list); LIC includes its P&GS and ASM non-par funds' } },
  ],
});

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Management and governance: a strong group, a stellar operator, and an unresolved succession',
  blocks: [
    { p: `Rajeev Jain has led Bajaj Finance (MD from 2015) and is the architect of its model. The planned hand-over failed: Anup Saha became MD in Apr-2025 and quit after four months (Jul-2025), reportedly for a bank CEO role. Jain is back as Vice-Chairman & MD until 31-Mar-2028 and says a decision will come "by December '27-January '28". Sanjiv Bajaj (Bajaj Finserv) chairs the board; seven of ten directors are independent. Joint auditors PwC and Kirtane & Pandit gave an unmodified FY26 opinion.` },
    { verdicts: [
      ['Promoter and group', 'Strong', 'Bajaj Finserv (51.3%) is a long-term, well-capitalised parent that also owns the group life and general insurers.', 'Patient capital; may subscribe to raises (a preferential issue was one option on 24-Sep-2026).'],
      ['Management quality', 'Strong', 'Two decades of 30%+ compounding; open about mistakes (MSME pruning, overlays); detailed guidance scorecards.', 'Execution is the core of the investment case.'],
      ['Succession and key-person risk', 'Weak', 'Designated successor quit in 2025; Jain\'s term ends Mar-2028; no new successor named by 30-Sep-2026.', 'A messy transition is the largest governance risk.'],
      ['Regulatory record', 'Moderate', 'RBI barred two digital products in Nov-2023 for missing key fact statements; lifted in six months.', 'Process gaps at speed; the RBI watches the largest NBFC closely.'],
      ['Disclosure', 'Strong', '19-year history, stage-wise ECL by business, vintage curves, guidance vs delivery each year.', 'Among the best of any Indian lender.'],
      ['Pay', 'Moderate', `MD pay ${n0(GV.mdPayRatio)}x the median employee (+${GV.mdPayIncreasePct}% fixed pay in FY26 vs +${GV.medianPayIncreasePct}% for the median); chairman ${n0(GV.chairPayRatio)}x incl. a ₹5.5 cr extra commission; ESOPs in use.`, 'High but in line with performance; the extra commission to a non-executive promoter chairman is unusual.'],
      ['Capital allocation', 'Moderate', 'Equity raised in FY18, FY20, FY24 and again proposed in Sep-2026, weeks after being ruled out; BHFL listed and being sold down.', 'Raises are accretive to book at 4-5x, but the messaging was poor.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'Annual report FY2025-26; company filings and calls; BusinessToday (Jul-2025)' },
    { callout: '**Our view:** governance is better than most Indian financials, and disclosure is excellent. The weak point is succession: the business is built around one executive whose term ends in 18 months, and the first attempt to hand over failed. Brokers (Nuvama) flag that the "top management reset" has only been pushed back to Mar-2028, not solved.' },
  ],
};

const cmpRow = (label, ours, street, src) => [label, ours, street, src];
const forecasts = {
  id: 'forecasts', nav: 'Our forecasts vs the street', kicker: 'Forecasts', title: 'Our forecasts: ~20% ROE, EPS +34% in FY27E on lower credit costs, then ~18% a year',
  blocks: [
    { exhibit: { type: 'table', title: 'Key forecasts (consolidated)', x: 'fin.labels', from: 'FY24', to: 'FY29E', rowsRef: [
      { name: 'AUM (₹ cr)', ref: 'fin.aum', fmt: 'num' }, { name: 'AUM growth (%)', ref: 'fin.aumGrowth', fmt: 'pct' }, { name: 'Net interest income (₹ cr)', ref: 'fin.nii', fmt: 'num' },
      { name: 'NIM (%)', ref: 'fin.nim', fmt: 'pct' }, { name: 'Cost-to-income (%)', ref: 'fin.costToIncome', fmt: 'pct' }, { name: 'Pre-provision profit (₹ cr)', ref: 'fin.ppop', fmt: 'num' },
      { name: 'Credit cost (% avg AUM)', ref: 'fin.creditCost', fmt: 'pct' }, { name: 'Net profit (₹ cr)', ref: 'fin.pat', fmt: 'num', hl: true }, { name: 'Minority interest (₹ cr)', ref: 'fin.minority', fmt: 'num' },
      { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n2', hl: true }, { name: 'EPS growth (%)', ref: 'fin.epsGrowth', fmt: 'pct' }, { name: 'Book value per share (₹)', ref: 'fin.bvps', fmt: 'n1' },
      { name: 'ROA on total assets (%)', ref: 'fin.roa', fmt: 'pct' }, { name: 'ROE (%)', ref: 'fin.roe', fmt: 'pct', hl: true },
    ], source: 'Company, Screener.in; GAM estimates. Dividend: ₹6.00 a share for FY26 (incl. a ₹0.60 special); we model an 18% payout, ₹{{F.dps.0|n2}} for FY27E.' } },
    { p: `FY27E EPS growth of {{F.epsGrowth.0|pct}} looks high but is mostly the reversal of FY26's ₹1,813 cr of one-off charges: on FY26 EPS before one-offs (₹${n2(epsAdj26)}) it is ${pc((F.eps[0] / epsAdj26 - 1) * 100)}. It is also in line with Q1: profit was ₹6,081 cr in Q1 and our FY27E of ₹{{F.pat.0|num}} cr needs ~₹${n0((F.pat[0] - 6081) / 3)} cr a quarter for the rest of the year, ${pc(((F.pat[0] - 6081) / 3 / 6081 - 1) * 100)} above Q1, as AUM grows ~5% a quarter.` },
    { exhibit: { type: 'table', title: 'Our estimates vs the street (estimates standing on 30-Sep-2026)', head: ['Metric', 'GAM', 'Street', 'Source of street figure'], wide: [3], rows: [
      cmpRow('FY27E EPS (₹)', '{{F.eps.0|n2}}', n1(streetEps.iciciFY27), 'ICICI Direct: PAT ₹23,409 cr ÷ 622 cr shares (31-Jul-2026)'),
      cmpRow('FY28E EPS (₹)', '{{F.eps.1|n2}}', `${n1(streetEps.iciciFY28)}-${n1(streetEps.moslFY28)}`, 'ICICI Direct (₹28,168 cr PAT); Motilal Oswal implied by ~20x FY28E P/E at ₹1,054'),
      cmpRow('FY28E BVPS (₹)', '{{F.bvps.1|n1}}', n0(streetEps.moslBvFY28), 'Motilal Oswal implied by 3.9x FY28E P/B at ₹1,054'),
      cmpRow('Sep-28E BVPS (₹)', `${n1(X.bvSep28)}`, n0(streetEps.nomuraBvSep28), 'Nomura implied: ₹1,270 target ÷ 4.2x Sep-28E P/B (21-Aug-2026)'),
      cmpRow('FY28E ROE (%)', '{{F.roe.1|pct}}', '20-21.4%', 'Motilal Oswal 21.4%; HDFC Securities, Nuvama 20-21%; Jefferies 21%'),
      cmpRow('Credit cost FY27E / FY28E', '{{F.creditCost.0|pct}} / {{F.creditCost.1|pct}}', '1.50% / 1.45%', 'Motilal Oswal'),
      cmpRow('AUM growth FY27E', '{{F.aumGrowth.0|pct}}', '23-25%', 'HDFC Securities 23%; Motilal Oswal ~25% CAGR FY26-28E; Nomura 25%'),
    ], source: 'Broker notes and press summaries dated 31-Jul to 24-Sep 2026; implied figures are our arithmetic on published multiples. No consensus EPS was available to us (gap).' } },
    { callout: `**Where we differ:** we are above ICICI Direct on FY27 (they assume little quarterly growth from Q1) and between it and Motilal Oswal on FY28. Our book value is close to the street because we, like the street on 30-Sep, exclude the announced equity raise. On ROE we are slightly below the bulls (20% vs 21%) because we model lower yields from FY28 (mix and the revolving-credit draft).` },
  ],
};

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street: mostly Buy, targets ₹${n0(tpLo)}-${n0(tpHi)}, and a vocal minority of sellers`,
  blocks: [
    { p: `After Q1FY27 (31-Jul-2026) most brokers stayed positive: Motilal Oswal upgraded to Buy (₹1,300, 4.8x FY28E book), CLSA and Citi ₹1,300, JPMorgan ₹1,295, ICICI Direct ₹1,290 (4.4x FY28E standalone book plus ₹119 a share for subsidiaries), Jefferies ₹1,280, HSBC ₹1,270; Nomura raised to ₹1,270 on 21-Aug (4.2x Sep-28E book). HDFC Securities kept Buy at ₹1,100 but noted the stock already traded at 4.1x Mar-28 book. Sellers: UBS ₹910, Macquarie ₹850 (Underperform), Ambit ₹815. The Bloomberg consensus target was ₹${n2(CONS.avgTp)} on 31-Jul. Jefferies reiterated Buy after the 24-Sep raise notice.` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who', 'Our view'], wide: [0, 2], rows: [
      ['Valuation caps upside: the stock already prices ~4x forward book', 'HDFC Securities; Macquarie, UBS, Ambit (Sell/Underperform)', 'Partly agree: our intrinsic cross-checks are below the price; the P/B target relies on the market keeping a franchise premium.'],
      ['The RBI revolving-credit draft could hit flexi loans (~13-15% of AUM) and growth', 'Nomura, Jefferies, press', 'Agree it is the key regulatory risk; yield impact small (~7bp), growth impact uncertain. In our bear case.'],
      ['Competition in personal loans is intense; urban PL growth below 20%', 'Nomura', 'Agree: we fade growth and yields.'],
      ['Top-management reset only postponed to Mar-2028', 'Nuvama, Jefferies', 'Agree: biggest governance risk.'],
      ['Credit cycle has turned; earnings upgrades ahead', 'Motilal Oswal, Nomura', 'Agree for FY27; we do not extrapolate Q1\'s 1.31% credit cost.'],
      ['Capital raise dilutes', 'Market reaction 24-Sep', 'Disagree on value: issuance at ~4.4x book is accretive to book per share; ROE dips ~1.3pp.'],
    ], source: 'Broker notes and press, 31-Jul to 24-Sep 2026; GAM Research' } },
  ],
};

module.exports = { ownership, governance, forecasts, street };
