// Bajaj Housing Finance report, part 3b: asset quality and credit cost.
const X = require('./BAJAJHFL.ctx');
const { C, SG, F, AS, n0, n1, n2, Q1 } = X;
const st = SG.stages, AQ = SG.assetQualityJun26, QK = C.quarterlyKpis;
const s23 = s => (s.s2 + s.s3) / (s.s1 + s.s2 + s.s3) * 100, ecl = s => (s.ecl1 + s.ecl2 + s.ecl3) / (s.s1 + s.s2 + s.s3) * 100;
const cc5 = F.avgAum[1] * 0.0005 * (1 - AS.taxRate[1] / 100) / F.patAttrib[1] * 100; // 5bp of credit cost as % of FY28E profit

const quality = {
  id: 'quality', nav: 'Asset quality & credit cost', kicker: 'Asset quality', title: 'Asset quality: among the cleanest books in Indian lending, with a commercial tail risk',
  blocks: [
    { p: `Gross bad loans (Stage 3) were ${Q1.gnpa}% of loans in Jun-2026 and net ${Q1.nnpa}%, in a 0.26-0.30% range for nine quarters; Stage 2 (30-90 days overdue) was ${Q1.stage2Pct}%. Loan losses have been 6-17bp of average loans for three years (FY24-FY26), and 5bp annualised in Q1FY27. That Q1 figure flatters: a ~₹2,300 cr loan sale released Stage 1 provisions and the January model recalibration lowered Stage 1 rates after two clean years. Management guides 10-15bp for FY27. By product, home loans run at 0.34% gross NPA, loans against property at 0.62% (normal range 50-70bp), developer loans at 0.12% (one account) and lease-rental loans at zero.` },
    { pair: [
      { type: 'line', title: 'Gross and net NPA: flat at ~0.3% and ~0.1%', unit: 'Gross / net Stage 3 (% of loans), quarter-end', x: QK.map(q => q.q), series: [{ name: 'Gross NPA', values: QK.map(q => q.gnpa), fmt: 'n2' }, { name: 'Net NPA', values: QK.map(q => q.nnpa), fmt: 'n2' }], labels: 'ends', min: 0, max: 0.5, source: 'Screener.in quarterly (company results); Q1FY27 presentation p37' },
      { type: 'column', title: 'Provisions cover every Stage 2 and 3 loan 0.9x', unit: 'ECL provisions and Stage 2+3 loans (% of gross loans)', x: ['Jun-25', 'Mar-26', 'Jun-26'], series: [{ name: 'Stage 2+3 loans', values: [st.jun25, st.mar26, st.jun26].map(s => Math.round(s23(s) * 100) / 100), fmt: 'n2' }, { name: 'Total ECL provisions', values: [st.jun25, st.mar26, st.jun26].map(s => Math.round(ecl(s) * 100) / 100), fmt: 'n2' }], labels: 'all', source: 'Q1FY27 presentation p39' },
    ] },
    { exhibit: { type: 'table', title: 'Asset quality by product (Jun-2026)', head: AQ.head, rows: AQ.rows.map(r => [r[0], n0(r[1]), ...r.slice(2, 6).map(v => `${v.toFixed(2)}%`), r[6] != null ? `${r[6].toFixed(1)}%` : '–']), source: 'Q1FY27 presentation p38-39' } },
    { p: `**Why losses are so low:** prime salaried borrowers with high credit scores, collateral worth well above the loan, centralised underwriting with tele/video interviews for every salaried loan, and, in the commercial book, escrowed cash flows from rated tenants and milestone-based releases to builders. Provisions held (₹${n0(st.jun26.ecl1 + st.jun26.ecl2 + st.jun26.ecl3)} cr in Jun-2026, ${n2(ecl(st.jun26))}% of loans) are small in absolute terms, but so is the problem they cover. The two things that could change the picture are an untested Sambhav book (young loans to near-prime and affordable borrowers) and the commercial property book (big tickets).` },
    { callout: `**Our forecast:** credit cost of {{F.creditCost.0|n2}}% / {{F.creditCost.1|n2}}% / {{F.creditCost.2|n2}}% of average AUM for FY27-29E (≈12-15bp of loan assets), inside the 10-15bp guidance and edging up as Sambhav and LAP season. Credit cost barely matters to the valuation: each 5bp is ~${n1(cc5)}% of FY28E profit. Margin is what matters. The bear case adds 10bp across the board (a commercial-property shock), which still leaves losses below most lenders\' good years.` },
  ],
};

module.exports = { quality };
