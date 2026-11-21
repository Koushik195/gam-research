// Cholamandalam report, part 3c: spread and NIM, asset quality and credit cost.
const X = require('./CHOLAFIN.ctx');
const { C, SG, F, A, AS, fin, fi, n0, n1, n2, pc, Q1, cc10, insCom, insPctAum, feeCut28, feeCutEps28 } = X;
const st = SG.stages, s23 = s => (s.s2 + s.s3) / (s.s1 + s.s2 + s.s3) * 100, ecl = s => (s.ecl1 + s.ecl2 + s.ecl3) / (s.s1 + s.s2 + s.s3) * 100;
const QK = C.quarterlyKpis, AK = C.annualKpis.filter(k => k.fy >= 'FY23');

const spread = {
  id: 'spread', nav: 'Spread & NIM', kicker: 'Margins', title: 'NIM is back above 8% of assets on cheaper funding; rate hikes now push the other way',
  blocks: [
    { p: `Chola reports its margin on average total assets: 7.5% in FY24, 7.7% in FY25, 8.0% in FY26 and 8.2% in Q1FY27. On our basis (NII ÷ average business AUM) NIM was {{fin.nim.9|pct}}, {{fin.nim.10|pct}} and {{fin.nim.11|pct}} in FY24-26. The improvement came from funding: the RBI cut rates through 2025 and Chola's cost of funds fell from {{fin.costOfFunds.10|pct}} in FY25 to {{fin.costOfFunds.11|pct}} in FY26 (our measure), while the yield on AUM fell less ({{fin.yieldOnAum.10|pct}} to {{fin.yieldOnAum.11|pct}}) because most vehicle loans are fixed-rate. That cushion has run its course: the CFO expects funding costs flat for FY27 overall but 5-10bp higher in H2, assuming a 25-50bp repo hike.` },
    { exhibit: { type: 'table', title: 'Spread and margin: history and our forecast (% of average AUM or borrowings)', x: 'fin.labels', from: 'FY21', to: 'FY29E', rowsRef: [
      { name: 'Yield on average AUM (%)', ref: 'fin.yieldOnAum', fmt: 'pct' }, { name: 'Cost of funds on average borrowings (%)', ref: 'fin.costOfFunds', fmt: 'pct' },
      { name: 'Spread (pp)', ref: 'fin.spread', fmt: 'n2' }, { name: 'NIM: NII ÷ average AUM (%)', ref: 'fin.nim', fmt: 'pct', hl: true },
      { name: 'Fees & other income ÷ average AUM (%)', ref: 'fin.feePct', fmt: 'pct' }, { name: 'Net total income ÷ average AUM (%)', ref: 'fin.ntiPct', fmt: 'pct' },
    ], source: 'Annual reports (interest income), Screener.in, company presentations; GAM estimates. Interest income includes ~₹830 cr a year of treasury income on cash and G-secs (FY26).' } },
    { p: `**Fee income is a bigger issue than it looks.** Fees and other operating income were ₹2,670 cr in FY26 (1.31% of AUM), of which insurance agency commission was ₹${n0(insCom)} cr (${n2(insPctAum)}% of AUM), loan fees ₹967 cr and assignment gains ₹439 cr. Much of the insurance is sold alongside loans, some of it from group insurer Chola MS. IRDAI's 23-Sep-2026 paper would cap commission on loan-linked covers at ~2-5%, against 7-47% that NBFCs earn on credit life today. Chola has not said how much of its commission is loan-linked (gap). We assume a third is lost from FY28E: ₹${n0(feeCut28)} cr of pre-tax income in FY28E, about ₹${n1(feeCutEps28)} of EPS (${n1(feeCutEps28 / F.eps[1] * 100)}%). The bear case loses most of it.` },
    { pair: [
      { type: 'column', title: 'NII grew faster than AUM in FY26 as funding got cheaper', unit: 'Growth (%)', x: 'fin.labels', from: 'FY22', to: 'FY29E', series: [{ name: 'AUM growth', ref: 'fin.aumGrowth', fmt: 'pct0' }, { name: 'NII growth', ref: 'fin.niiGrowth', fmt: 'pct0' }], labels: 'all', source: 'Company, Screener.in; GAM estimates' },
      { type: 'line', title: 'Fee yield: rising until FY26, cut by our IRDAI haircut from FY28E', unit: 'Fees & other operating income ÷ average AUM (%)', x: 'fin.labels', from: 'FY21', to: 'FY29E', series: [{ name: 'Fee yield', ref: 'fin.feePct', fmt: 'pct' }], labels: 'all', min: 0, max: 1.6, source: 'Annual reports; GAM estimates' },
    ] },
    { callout: '**Our view:** we model NIM of {{F.nim.0|pct}} in FY27E (+12bp, in line with Q1\'s run-rate after the usual drift through the year) and ~{{F.nim.2|pct}} after that: yields rise slightly as CSEL, SBPL and gold grow and floating-rate mortgages reprice, offsetting a 15bp rise in funding costs. Management\'s "NIM ~8%, stable" guidance is on assets; ours is the same thing on loans. The bigger margin risk is not interest but fees.' },
  ],
};

const quality = {
  id: 'quality', nav: 'Asset quality & credit cost', kicker: 'Asset quality', title: 'Asset quality: credit cost is improving, but bad loans are still edging up',
  blocks: [
    { p: `Loan losses rose from 1.0% of assets in FY24 to 1.4% in FY25 and 1.7% in FY26 (1.6% before the ₹200 cr overlay), well above the 1.3% management guided for FY26. Two things drove it: a vehicle "down cycle" in FY24-FY25 and the fintech-sourced CSEL loans. Q1FY27 brought the credit cost down to 1.5%, meeting the full-year guidance in the seasonally weakest quarter, and Stage 2 (loans 30-90 days overdue) is 33bp lower than a year ago. But Stage 3 is not falling: ${Q1.stage3}% in Jun-2026 vs 3.16% a year earlier, and 4.50% on the RBI's stricter NPA definition.` },
    { pair: [
      { type: 'line', title: 'Stage 3 and Stage 2+3: both higher than a year ago', unit: '% of gross loans, quarter-end', x: QK.map(k => k.q), series: [{ name: 'Stage 3 (Ind AS)', values: QK.map(k => k.stage3), fmt: 'n2' }, { name: 'Stage 2 + 3', values: QK.map(k => k.stage23), fmt: 'n2' }], labels: 'ends', min: 0, max: 7, source: 'Company presentations (Q4FY25-Q1FY27); Sep-25 and Dec-25 Stage 2+3 read from the Q1FY27 chart' },
      { type: 'column', title: 'RBI-norm GNPA: 3.5% to 4.4% in two years', unit: 'GNPA on RBI norms (%), March; Q1FY27 = Jun-2026', x: [...AK.map(k => k.fy), 'Q1FY27'], series: [{ name: 'GNPA (RBI)', values: [...AK.map(k => k.gnpa), Q1.gnpaRbi], fmt: 'n2' }], labels: 'all', highlight: 'Q1FY27', source: 'Company presentations' },
    ] },
    { exhibit: { type: 'table', title: 'Stage 3 by business: vehicles, SME and SBPL are the sore spots', head: SG.stage3.head, rows: SG.stage3.rows.map(r => [r[0], n0(r[1]), `${r[2].toFixed(2)}%`, `${r[3].toFixed(2)}%`, `${n1(r[4])}%`, `${r[5].toFixed(2)}%`]), source: 'Q1FY27 presentation p22' } },
    { p: `**Provisions.** Chola held ₹${n0(st.jun26.ecl1 + st.jun26.ecl2 + st.jun26.ecl3)} cr of expected-credit-loss provisions in Jun-2026, ${n2(ecl(st.jun26))}% of gross loans, including the ₹200 cr overlay. That covers 46% of Stage 3 loans and 29% of Stage 2+3 (${n2(s23(st.jun26))}% of the book): thinner than Bajaj Finance, whose provisions roughly equal all its Stage 2 and 3 loans, but normal for a secured lender that recovers by repossessing vehicles and property. Ind AS provisions exceed the RBI's minimum (IRAC) by ₹1,577 cr. Write-offs of fully provided vehicle loans in Q1 lowered the coverage ratio a little.` },
    { callout: `**Our forecast:** credit cost of {{F.creditCost.0|n2}}% / {{F.creditCost.1|n2}}% / {{F.creditCost.2|n2}}% of average AUM in FY27-29E (FY26 {{fin.creditCost.11|n2}}%). On the company's asset basis that is about 1.4-1.5%, in line with guidance. We keep the overlay and do not assume management's hoped-for further fall; FY29E edges up as the higher-loss new businesses grow. Each 10bp of credit cost is ~${n1(cc10)}% of FY28E profit. Bear case: ~2.0%, Chola's Covid-year level.` },
  ],
};

module.exports = { spread, quality };
