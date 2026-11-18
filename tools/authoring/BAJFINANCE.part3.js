// Bajaj Finance report, part 3: franchise and AUM mix, spread and NIM, asset quality and credit cost.
const X = require('./BAJFINANCE.ctx');
const { C, SG, F, A, AS, fin, fi, n0, n1, n2, pc, Q1, G27 } = X;
const SA = SG.annual, QN = SG.quarterly.find(q => q.q === 'Q1FY27'), A26 = SA.find(a => a.fy === 'FY26'), A25 = SA.find(a => a.fy === 'FY25');
const NAMES = Object.fromEntries(SG.lines.map(l => [l.key, l.name.replace(/ \(.*\)$/, '')]));
const add26 = SG.lines.map(l => [NAMES[l.key], A26[l.key] - A25[l.key]]).sort((a, c) => c[1] - a[1]);
const st = SG.stages, s2s3 = s => (s.s2 + s.s3) / (s.s1 + s.s2 + s.s3) * 100, ecl = s => (s.ecl1 + s.ecl2 + s.ecl3) / (s.s1 + s.s2 + s.s3) * 100;
const avgAum28 = F.avgAum[1], cc10 = avgAum28 * 0.001 * (1 - AS.taxRate[1] / 100) / F.patAttrib[1] * 100;

const franchise = {
  id: 'franchise', nav: 'Franchise & AUM mix', kicker: 'Franchise and growth', title: 'Growth comes from mining 124 million customers, and the mix is tilting to safer loans',
  blocks: [
    { p: `The engine is the customer base. Bajaj Finance added 17.5 million customers in FY26 and 5.1 million in Q1FY27, to 124.4 million; 79.2 million of them (64%) qualify for cross-sell offers. It booked 52.5 million loans in FY26 and expects 60-62 million in FY27; guidance for new customers was raised from 15-17 million to 18-20 million in Q1. Existing customers bring 63% of business, which lowers acquisition cost and credit risk because the company already knows their repayment history.` },
    { pair: [
      { type: 'hbar', title: 'Where FY26\'s ₹93,314 cr of AUM growth came from', unit: 'Increase in AUM, Mar-25 to Mar-26 (₹ crore)', x: add26.map(r => r[0]), series: [{ name: 'Added', values: add26.map(r => r[1]), fmt: 'num' }], labels: 'all', source: 'Q4FY26 presentation p63 (GAM grouping)' },
      { type: 'hbar', title: 'Growth by business, Q1FY27 year on year', unit: 'AUM growth Jun-25 to Jun-26 (%)', x: SG.lines.map(l => NAMES[l.key].replace('(mostly Bajaj Housing Finance)', '')), series: [{ name: 'Growth', values: SG.lines.map(l => Math.round((QN[l.key] / SG.quarterly[0][l.key] - 1) * 1000) / 10), fmt: 'pct0' }], labels: 'all', source: 'Q1FY27 presentation p54' },
    ] },
    { p: `Three engines are firing and two are stalled. **Mortgages** (+27%) are a third of the book and mostly sit in Bajaj Housing Finance. **Gold loans** (+112% to ₹21,152 cr) are the fastest grower: 1,701 branches, ~110 added a month, AUM guided to ₹29-31k cr by Mar-27. **Consumer finance** (+38% urban, +49% rural), although half of that is pricier phones and appliances. **Small-business loans** grew 2% after a year of pruning ("it should come back into growth momentum by Q3"), and the **captive two- and three-wheeler book** has shrunk 64% in a year (gross NPA 15%). Urban personal loans, the most profitable book, grew 19%.` },
    { exhibit: { type: 'table', title: 'Our AUM build vs guidance', head: ['', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['AUM (₹ cr)', '{{fin.aum.10|num}}', '{{fin.aum.11|num}}', '{{F.aum.0|num}}', '{{F.aum.1|num}}', '{{F.aum.2|num}}'],
      ['Growth', '{{fin.aumGrowth.10|pct}}', '{{fin.aumGrowth.11|pct}}', '{{F.aumGrowth.0|pct}}', '{{F.aumGrowth.1|pct}}', '{{F.aumGrowth.2|pct}}'],
      ['Company guidance', 'n.d.', '24-25% (delivered 22%)', '22-24%', 'long-term 23-25%', 'long-term 23-25%'],
      ['Customers (million)', '101.8', '119.3', '+18-20 guided', '', ''],
    ], source: 'Company presentations; GAM estimates. FY25 guidance not in our sources (n.d.).' } },
    { callout: `**Our view:** we take the top of FY27 guidance (24%) because Q1 added a record ₹36,969 cr and the main engines (mortgages, gold, consumer finance, loans against securities, car loans) are growing faster than the book, with MSME due back from Q3. We fade growth by 1pp a year after that: at ₹6-9 lakh cr the law of large numbers bites, and FY26 itself fell 2-3pp short of guidance. Bajaj Housing Finance (₹1.50 lakh cr, ROE 12.5%) grows with the group but earns far less; as BFL sells down to 75%, more of its profit goes to minorities (we model ₹{{F.minority.2|num}} cr in FY29E vs ₹315 cr in FY26).` },
  ],
};

const spread = {
  id: 'spread', nav: 'Spread & NIM', kicker: 'Margins', title: 'NIM has fallen from 10.3% to 9.5% and will keep drifting lower',
  blocks: [
    { p: `Net interest margin (NII ÷ average AUM, our basis) peaked at {{fin.nim.8|pct}} in FY23 and was {{fin.nim.11|pct}} in FY26. The yield on AUM fell from {{fin.yieldOnAum.9|pct}} (FY24) to {{fin.yieldOnAum.11|pct}} as the mix moved to mortgages, gold and loans against securities. The cost of funds peaked at 7.97% in FY25 (company basis) and fell to 7.54% in FY26 and 7.40% in Q1FY27, which cushioned the fall. That cushion is now gone: management says incremental funding is 30-60bp dearer and expects the cost of funds to stay "range bound with a slight upward bias".` },
    { exhibit: { type: 'table', title: 'Spread and margin: history and our forecast', x: 'fin.labels', from: 'FY22', to: 'FY29E', rowsRef: [
      { name: 'Yield on average AUM (%)', ref: 'fin.yieldOnAum', fmt: 'pct' }, { name: 'Cost of funds on average borrowings (%)', ref: 'fin.costOfFunds', fmt: 'pct' },
      { name: 'Spread (pp)', ref: 'fin.spread', fmt: 'n2' }, { name: 'NIM: NII ÷ average AUM (%)', ref: 'fin.nim', fmt: 'pct', hl: true },
      { name: 'Fees & other income ÷ average AUM (%)', ref: 'fin.feePct', fmt: 'pct' }, { name: 'Net total income ÷ average AUM (%)', ref: 'fin.ntiPct', fmt: 'pct' },
    ], source: 'Company presentations, Screener.in (interest expense ~₹230 cr above the company figure, a classification difference); GAM estimates. Our cost of funds uses the average of year-end borrowings, so it reads ~0.3pp below the company\'s 7.5-8.0%.' } },
    { p: `**The revolving-credit risk, in numbers.** The RBI's draft of 6-Aug-2026 would let NBFCs offer only term loans. Brokers estimate Bajaj Finance's flexi (revolving) loans at ~13-15% of AUM, earning ~50bp more than plain term loans (Jefferies). Re-papering them as term loans at a normal yield would cost ~7bp of group yield, about 1-1.5% of profit, before any loss of customers who valued the flexibility. The larger risk is growth: flexi products sit inside the personal-loan and small-business books that already grow slowest. We cut yield by ~15-20bp a year in our base case; the bear case takes another 30bp.` },
    { pair: [
      { type: 'column', title: 'NII growth has fallen below AUM growth', unit: 'Growth (%)', x: 'fin.labels', from: 'FY23', to: 'FY29E', series: [{ name: 'AUM growth', ref: 'fin.aumGrowth', fmt: 'pct0' }, { name: 'NII growth', ref: 'fin.niiGrowth', fmt: 'pct0' }], labels: 'all', source: 'Company, Screener.in; GAM estimates' },
      { type: 'line', title: 'Fees are a shrinking share of income', unit: 'Fees & other operating income ÷ average AUM (%)', x: 'fin.labels', from: 'FY22', to: 'FY29E', series: [{ name: 'Fee yield', ref: 'fin.feePct', fmt: 'pct' }], labels: 'all', min: 1, max: 3, source: 'Company presentations; GAM estimates' },
    ] },
    { callout: `**Our view:** management guides a 10-15bp NIM moderation in FY27; we model {{fin.nim.11|pct}} → {{F.nim.0|pct}}. Beyond FY27 the MD himself expects the balance sheet to "look" different in three years: "NIM could look lower, opex would look lower, credit cost could look lower". We take him at his word on NIM (−20-30bp a year in FY28-29E) and credit him only partly on opex and credit cost.` },
  ],
};

const quality = {
  id: 'quality', nav: 'Asset quality & credit cost', kicker: 'Asset quality', title: 'Credit costs: the FY25-26 spike is fading, helped by ₹2,200 cr of extra provisions already taken',
  blocks: [
    { p: `Loan losses rose from 0.96% of average assets under finance (AUF) in FY23 to 1.93% in FY25 and 2.09% in FY26 (company basis), as stress in small-business, personal and captive two-wheeler loans hit. Management responded by tightening: it pruned MSME lending from Jul-2025, let the captive 2W book run off and kept its risk "thresholds" at 30-40% of the industry's 30- and 60-day delinquency rates (call). Q1FY27 shows the result: loan losses 1.54% including a ₹296 cr "management and macro-economic" overlay (1.31% without), new Stage 2 and 3 additions of only ₹328 cr, and gross / net NPA of ${Q1.gnpa}% / ${Q1.nnpa}% with 60% coverage.` },
    { pair: [
      { type: 'line', title: 'Gross and net NPA: back below 1%', unit: 'Gross / net Stage 3 (% of loans), quarter-end', x: 'Q.labels', series: [{ name: 'Gross NPA', values: [0.91, 0.95, 0.85, 0.86, 1.06, 1.12, 0.96, 1.03, 1.24, 1.21, 1.01, 0.96], fmt: 'n2' }, { name: 'Net NPA', values: [0.31, 0.37, 0.37, 0.38, 0.46, 0.48, 0.44, 0.5, 0.6, 0.47, 0.41, 0.39], fmt: 'n2' }], labels: 'ends', min: 0, max: 1.4, source: 'Screener.in quarterly (company results)' },
      { type: 'column', title: 'Stage 2+3 loans: 2.3% to 1.9% of the book in a year', unit: 'Stage 2 + Stage 3 gross loans (% of gross loans)', x: ['Jun-25', 'Mar-26', 'Jun-26'], series: [{ name: 'Stage 2+3', values: [st.jun25, st.mar26, st.jun26].map(s => Math.round(s2s3(s) * 100) / 100), fmt: 'n2' }], labels: 'all', source: 'Q1FY27 presentation p58' },
    ] },
    { exhibit: { type: 'table', title: 'Gross NPA by business: MSME and captive 2W are the sore spots', head: SG.assetQualityJun26.head, rows: SG.assetQualityJun26.rows.map(r => [r[0], `${r[1].toFixed(2)}%`, `${r[2].toFixed(2)}%`, `${r[3].toFixed(2)}%`]), source: 'Q1FY27 presentation p57' } },
    { p: `**Provisions held beyond the models.** Since Q4FY25 the company has booked ₹2,203 cr of extra provisions: ₹359 cr (Q4FY25), an accelerated ₹1,406 cr (Q3FY26), ₹142 cr (Q4FY26) and ₹296 cr (Q1FY27). Total expected-credit-loss provisions were ₹${n0(st.jun26.ecl1 + st.jun26.ecl2 + st.jun26.ecl3)} cr in Jun-2026, ${n2(ecl(st.jun26))}% of gross loans, roughly equal to all Stage 2 and 3 loans (${n2(s2s3(st.jun26))}%), against ${n2(ecl(st.jun25))}% a year earlier. Stage 1 coverage rose from 0.75% to 1.06%. That buffer is why we do not expect a credit-cost spike in FY27 even if the monsoon or the West Asia conflict bites; it also gives management room to smooth profit (see earnings quality).` },
    { callout: `**Our forecast:** credit cost of {{F.creditCost.0|n2}}% / {{F.creditCost.1|n2}}% / {{F.creditCost.2|n2}}% of average AUM for FY27-29E (≈1.53% of AUF in FY27, the middle of the 1.45-1.60% guidance). Each 10bp of credit cost is ~${n1(cc10)}% of FY28E profit. We do not assume the Q1 run-rate of 1.31% lasts: the overlays have been recurring, and FY29E edges up as a normal cycle. Bear case: 2.1% (FY26 level incl. one-offs).` },
  ],
};

module.exports = { franchise, spread, quality };
