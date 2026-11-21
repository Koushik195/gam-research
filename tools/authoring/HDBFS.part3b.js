// HDB Financial Services report, part 3b: asset quality and credit cost.
const X = require('./HDBFS.ctx');
const { C, F, AS, n0, n1, n2, Q1 } = X;
const QK = C.quarterlyKpis;
const s2pct = q => q.stage2Cr / q.grossLoans * 100;
const cc10 = F.avgAum[1] * 0.001 * (1 - AS.taxRate[1] / 100) / F.patAttrib[1] * 100; // 10bp of credit cost as % of FY28E profit

const quality = {
  id: 'quality', nav: 'Asset quality & credit cost', kicker: 'Asset quality', title: 'Asset quality: the FY25-FY26 stress has passed its peak; a 2.3% loss rate is the normal cost of this business',
  blocks: [
    { p: `Gross Stage 3 (loans 90+ days overdue) rose from 2.26% in Mar-2025 to 2.81% in Sep and Dec-2025, as stress in trucks and unsecured business loans worked through, and is back to ${Q1.stage3Pct}% (Jun-2026); net Stage 3 is ${Q1.netStage3Pct}% after ${Q1.pcr}% provision cover. Stage 2 (30-90 days overdue) rose only 0.4pp from March to June, against the 0.6-0.7pp an analyst on the call called normal for a seasonally weak first quarter, and loan losses were flat at ₹697 cr (${Q1.creditCostLoans}% of loans, annualised). Management calls ~2.3% the steady state: "we believe a 2.3% is a fair number" over a three-year view (CFO, Q1FY27 call).` },
    { pair: [
      { type: 'line', title: 'Stage 3 peaked at 2.81%; now 2.34%', unit: 'Gross and net Stage 3 (% of gross loans), company', x: QK.map(q => q.q), series: [{ name: 'Gross Stage 3', values: QK.map(q => q.stage3Pct), fmt: 'n2' }, { name: 'Net Stage 3', values: QK.map(q => q.netStage3Pct), fmt: 'n2' }], labels: 'all', min: 0, max: 3.2, source: 'Q4FY26 and Q1FY27 presentations (Stage 3 ÷ gross loans)' },
      { type: 'column', title: 'Loan losses: ₹634-748 cr a quarter for six quarters', unit: 'Impairment charge in the quarter (₹ crore)', x: QK.map(q => q.q), series: [{ name: 'Loan losses', values: QK.map(q => q.llpCr), fmt: 'num' }], labels: 'all', highlight: 'Q1FY27', source: 'Company presentations; Q2FY26 = FY26 less the other quarters' },
    ] },
    { exhibit: { type: 'table', title: 'Loan staging and provisions (₹ crore)', head: ['', 'Mar-25', 'Jun-25', 'Sep-25', 'Dec-25', 'Mar-26', 'Jun-26'], rows: [
      ['Gross loans', ...QK.map(q => n0(q.grossLoans))],
      ['Stage 2 (30-90 days)', ...QK.map(q => n0(q.stage2Cr))],
      ['Stage 2 (% of loans)', ...QK.map(q => `${n2(s2pct(q))}%`)],
      ['Stage 3 (90+ days)', ...QK.map(q => n0(q.stage3Cr))],
      ['Stage 3 (% of loans)', ...QK.map(q => `${q.stage3Pct.toFixed(2)}%`)],
      ['Stage 3 provision cover', ...QK.map(q => `${n1(q.pcr)}%`)],
      ['Loan losses in the quarter', ...QK.map(q => n0(q.llpCr))],
    ], source: 'Q4FY26 presentation p30-31; Q1FY27 presentation p30-31' } },
    { p: `**Why losses are structurally ~2-2.5%:** HDB lends to borrowers with thin files and volatile incomes (owner-drivers, small traders, first-time borrowers), much of it unsecured (26%) or against depreciating vehicles. In good years (FY24) losses fall to ~1.3%; in bad ones (FY21) they reach 5%. Provisions held (₹${n0(1872 + 454 + 1589)} cr in Jun-2026, 3.2% of loans) and a 56% cover on Stage 3 are adequate for a normal year, not for a Covid. The ECL model is refreshed every quarter on product-level loss histories; management says there are no one-off overlays.` },
    { callout: `**Our forecast:** credit cost of {{F.creditCost.0|n2}}% / {{F.creditCost.1|n2}}% / {{F.creditCost.2|n2}}% of average AUM for FY27-29E, at management's steady state, with a little extra in FY27 for the weak-monsoon and rate risks management itself flags. Each 10bp is ~${n1(cc10)}% of FY28E profit. The bear case adds 50bp (back above FY26's 2.5%); a Covid-style 4-5% year would wipe out most of a year's profit, which is why we use a 1.1 beta.` },
  ],
};

module.exports = { quality };
