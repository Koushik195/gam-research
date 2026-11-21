// SBI Cards report, part 3b: asset quality and credit cost.
const X = require('./SBICARD.ctx');
const { SG, F, AS, AK, fin, fi, n0, n1, n2, Q1, cc10, CCN } = X;
const AQ = SG.assetQuality, FY = ['FY19', 'FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'];

const quality = {
  id: 'quality', nav: 'Asset quality & credit cost', kicker: 'Asset quality', title: 'Credit costs: down from 9.5% to 6.5% in a year; the question is where they settle',
  blocks: [
    { p: `A card book is unsecured and short: when a customer stops paying, there is no collateral, so SBI Card writes the balance off quickly (Stage 3 covers only 90-179 days past due) and books most of its loss as write-offs rather than as provisions. That is why "credit cost" here means gross write-offs plus the change in provisions, and why it is so much higher than at a secured lender: 6-9% of receivables a year, against interest and fee income of ~35%. In FY25 write-offs jumped 64% to ₹4,732 cr as stress in unsecured consumer credit across the industry came through; FY26 was almost as bad (₹4,926 cr). The cycle turned during FY26: gross credit cost fell from 9.5% (Q1FY26) to 7.7% (Q4FY26) and 6.5% in Q1FY27, GNPA from 3.07% to ${Q1.gnpa}%, and Stage 2 (30-89 days overdue) to ${Q1.stage2}%, the lowest since Covid.` },
    { pair: [
      { type: 'line', title: 'Gross and net NPA: back near FY23 levels', unit: 'Gross / net Stage 3 (% of receivables), quarter-end', x: AQ.labels, series: [{ name: 'Gross NPA', values: AQ.gnpa, fmt: 'n2' }, { name: 'Net NPA', values: AQ.nnpa, fmt: 'n2' }], labels: 'ends', min: 0, max: 3.6, source: 'Screener.in quarterly (company results)' },
      { type: 'column', title: 'Write-offs doubled in two years; recoveries lag', unit: 'Bad debts written off and recovered (₹ crore)', x: FY, series: [{ name: 'Written off', values: FY.map(l => AK[l].writeOffs), fmt: 'num' }, { name: 'Recovered', values: FY.map(l => AK[l].recoveries), fmt: 'num' }], labels: 'none', source: 'Annual reports FY20-FY26 (impairment and other income notes)' },
    ] },
    { exhibit: { type: 'table', title: 'Credit cost: company and our basis', head: ['', 'FY23', 'FY24', 'FY25', 'FY26', 'Q1FY27', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Impairment (₹ cr)', '{{fin.provisions.8|num}}', '{{fin.provisions.9|num}}', '{{fin.provisions.10|num}}', '{{fin.provisions.11|num}}', '948', '{{F.provisions.0|num}}', '{{F.provisions.1|num}}', '{{F.provisions.2|num}}'],
      ['Gross credit cost, our basis (% avg receivables)', '{{fin.creditCost.8|pct}}', '{{fin.creditCost.9|pct}}', '{{fin.creditCost.10|pct}}', '{{fin.creditCost.11|pct}}', `${n1(948 * 4 / ((56926 + 58269) / 2) * 100)}%`, '{{F.creditCost.0|pct}}', '{{F.creditCost.1|pct}}', '{{F.creditCost.2|pct}}'],
      ['Gross credit cost, company basis', 'n.d.', 'n.d.', '9.0%', '8.6%', '6.5%', '–', '–', '–'],
      ['Recoveries in other income (₹ cr)', '585', '491', '555', '686', '157', ...[0, 1, 2].map(i => n0(F.otherIncome[i] - AS.otherBuild.sundry))],
      ['Net credit cost, our basis (%)', ...['FY23', 'FY24', 'FY25', 'FY26'].map(l => `${n1(fin.creditCost[fi(l)] - AK[l].recoveries / fin.avgAum[fi(l)] * 100)}%`), `${n1(791 * 4 / ((56926 + 58269) / 2) * 100)}%`, ...[0, 1, 2].map(i => `${n1(F.creditCost[i] - AS.otherBuild.recoveryPct)}%`)],
    ], source: 'Annual reports; Q1FY27 presentation p11-14 (net credit cost 5.5% company basis); GAM estimates' } },
    { p: `**Provisions and buffers.** Expected-credit-loss provisions were 3.1% of receivables in Jun-2026 (3.5% a year earlier) and covered 59.9% of Stage 3 loans. The annual model refresh in Q1FY27 used ₹180 cr of the ₹220 cr management overlay held at March; ₹65 cr was released as the portfolio mix improved, and ₹70 cr of overlay is still held against geopolitical risk. Q1's 6.5% therefore includes a small release; gross write-offs alone were 7.0% of average receivables. A card book turns over fast, so a new stress wave would reach profit within two or three quarters.` },
    { pair: [
      { type: 'column', title: 'Gross credit cost by quarter', unit: 'Company basis, % of average receivables (annualised)', x: Object.keys(AQ.grossCreditCost), series: [{ name: 'Gross credit cost', values: Object.values(AQ.grossCreditCost), fmt: 'n1' }], labels: 'all', highlight: 'Q1FY27', min: 0, max: 11, source: 'Quarterly presentations' },
      { type: 'line', title: 'Through the cycle: 6.0% in a good year, 9%+ in a bad one', unit: 'Gross credit cost, our basis (%); dashed line = our through-cycle level', x: 'fin.labels', from: 'FY19', to: 'FY29E', series: [{ name: 'Credit cost', ref: 'fin.creditCost', fmt: 'pct' }], labels: 'all', min: 0, max: 12, lines: [{ v: CCN, text: `Through-cycle ${CCN}%` }], source: 'Annual reports; GAM estimates' },
    ] },
    { callout: `**Our forecast:** gross credit cost of {{F.creditCost.0|pct}} / {{F.creditCost.1|pct}} / {{F.creditCost.2|pct}} for FY27-29E: Q1's run-rate for FY27 (management: "within the current range", "some more moderation"), then a little lower and edging up as the larger new-card cohorts season. That is below our ${CCN}% through-cycle level (the median of FY19 and FY23-FY26), so our profits are cyclically flattered and we adjust for it in the valuation. Each 10bp of credit cost is ~${n1(cc10)}% of FY28E profit; the bear case (7.4-7.6%) cuts FY28E EPS to ₹{{scen.bear.eps.1|n2}}.` },
  ],
};

module.exports = { quality };
