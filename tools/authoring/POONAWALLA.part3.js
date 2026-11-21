// Poonawalla Fincorp report, part 3: franchise and AUM growth, spread and NIM, asset quality and credit cost.
const X = require('./POONAWALLA.ctx');
const { C, SG, F, A, AS, fin, fi, n0, n1, n2, pc, Q1, QK, SE, cc10 } = X;
const DB = SG.disbursements, ST = SG.stages;
const qGrowth = QK.slice(1).map((q, i) => Math.round((q.aumCo / QK[i].aumCo - 1) * 1000) / 10);
const eclPct = i => (ST.s1[i] * ST.s1Pcr[i] + ST.s2[i] * ST.s2Pcr[i] + ST.s3[i] * ST.s3Pcr[i]) / (ST.s1[i] + ST.s2[i] + ST.s3[i]); // % of gross loans
const ecl = ST.head.slice(1).map((_, i) => Math.round(eclPct(i) * 100) / 100);
const eqAumQ1 = Q1.netWorth / Q1.aum * 100, levDrag = (eqAumQ1 - F.equityToAum[2]) * AS.costOfFunds[2] / 100;
const wo = 277.5 * 4 / ((Q1.aum + 60348) / 2) * 100; // write-off run-rate (mid of ₹275-280 cr a quarter), % of average AUM

const franchise = {
  id: 'franchise', nav: 'Franchise & AUM growth', kicker: 'Franchise and growth', title: 'Growth: six new engines and a branch roll-out, aiming at 35-40% a year',
  blocks: [
    { p: `Disbursements (new loans made) rose from ₹${n0(DB.annual.FY25)} cr in FY25, a year spent cleaning up, to ₹${n0(DB.annual.FY26)} cr in FY26. In Q1FY27 the monthly run-rate was ~₹537 cr in Prime PL, ~₹292 cr in gold, ~₹144 cr each in education and consumer durables and ~₹97 cr in CV; new products made up 26% of disbursements against 20% two quarters earlier. AUM grew 10-16% a quarter through FY26 and 11.1% in Q1FY27. Management guides ~35-40% a year "over the next couple of years" and speaks of an "aspiration for 5-6x AUM over the next 5 years" (a ~40% CAGR).` },
    { pair: [
      { type: 'column', title: 'AUM growth: 10-16% every quarter', unit: 'AUM growth quarter on quarter (%)', x: QK.slice(1).map(q => q.q), series: [{ name: 'QoQ growth', values: qGrowth, fmt: 'n1' }], labels: 'all', source: 'Company presentations' },
      { type: 'column', title: 'Disbursements: down 9% in the clean-up year, +63% in FY26', unit: 'Disbursements (₹ crore)', x: ['FY22', 'FY23', 'FY24', 'FY25', 'FY26'], series: [{ name: 'Disbursements', values: ['FY22', 'FY23', 'FY24', 'FY25', 'FY26'].map(y => DB.annual[y]), fmt: 'num' }], labels: 'all', source: 'Motilal Oswal history table (17-Jul-2026)' },
    ] },
    { p: 'Which products carry the growth matters for risk. In the June quarter alone, LAP added ₹2,030 cr, instant consumer loans ₹1,776 cr, Prime PL ₹991 cr, mid-market ₹613 cr and gold ₹526 cr; business loans and pre-owned cars were flat, the MD having chosen to "go gradual" on them (growth of 10-16%). Shopkeeper loans were stopped from scaling. So the mix is drifting slightly toward unsecured (53% secured from 54%), in line with the stated ~50:50 target.' },
    { exhibit: { type: 'table', title: 'Our AUM build vs guidance and the street', head: ['', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['AUM (₹ cr)', '{{fin.aum.10|num}}', '{{fin.aum.11|num}}', '{{F.aum.0|num}}', '{{F.aum.1|num}}', '{{F.aum.2|num}}'],
      ['Growth (GAM)', '{{fin.aumGrowth.10|pct}}', '{{fin.aumGrowth.11|pct}}', '{{F.aumGrowth.0|pct}}', '{{F.aumGrowth.1|pct}}', '{{F.aumGrowth.2|pct}}'],
      ['Company guidance', '–', '–', '35-40%', '35-40%', '5-6x in 5 years (aspiration)'],
      ['Motilal Oswal', '', '', `${n0(SE.mosl.aum.FY27E)} (+46%)`, `${n0(SE.mosl.aum.FY28E)} (+41%)`, ''],
      ['HDFC Securities / Deven Choksey', '', '', '~35% CAGR / ~30%', '', ''],
    ], source: 'Company presentations; broker notes (Jul-2026); GAM estimates' } },
    { callout: `**Our view:** we take the top of guidance for FY27 (+{{F.aumGrowth.0|pct0}}: Q1 alone added ₹6,706 cr, and only ~8% a quarter is needed for the rest of the year), then fade to {{F.aumGrowth.1|pct0}} and {{F.aumGrowth.2|pct0}}. Two things argue for the fade: the base passes ₹1 lakh cr in FY28E, and capital binds (the April QIP covers "4 to 5 quarters"; we assume a further ₹3,000 cr raise in FY28E). Motilal Oswal is ~4% above us on FY28E AUM.` },
  ],
};

const spread = {
  id: 'spread', nav: 'Spread & NIM', kicker: 'Margins', title: 'Margins are recovering on mix, but rising leverage and funding costs will cap them',
  blocks: [
    { p: `Net interest margin (NII ÷ average AUM, our basis, before fees) fell from {{fin.nim.9|pct}} in FY24 to {{fin.nim.11|pct}} in FY26: the high-yield STPL book was cut, LAP and mid-market loans (9.75-12%) grew, and cheap equity was used up as borrowings rose from 1.9x to 4.7x equity. The company's own "NIM" (which includes fees) has since recovered from 8.62% (Q3FY26) to 9.05% (Q4FY26) and 9.10% (Q1FY27) as disbursement yields rose ~40bp and ~50bp in successive quarters on Prime PL, gold, consumer durables and CV. The April QIP also helped: equity funded ${n1(eqAumQ1)}% of AUM in Jun-2026.` },
    { exhibit: { type: 'table', title: 'Spread and margin: history and our forecast', x: 'fin.labels', from: 'FY24', to: 'FY29E', rowsRef: [
      { name: 'Yield on average AUM (%)', ref: 'fin.yieldOnAum', fmt: 'pct' }, { name: 'Cost of funds on average borrowings (%)', ref: 'fin.costOfFunds', fmt: 'pct' },
      { name: 'Spread (pp)', ref: 'fin.spread', fmt: 'n2' }, { name: 'NIM: NII ÷ average AUM (%)', ref: 'fin.nim', fmt: 'pct', hl: true },
      { name: 'Fees & other income ÷ average AUM (%)', ref: 'fin.feePct', fmt: 'pct' }, { name: 'Net total income ÷ average AUM (%)', ref: 'fin.ntiPct', fmt: 'pct' },
    ], source: 'Annual Reports FY25-FY26, Screener.in; GAM estimates. Our cost of funds uses the average of year-end borrowings (incl. lease liabilities), so it reads ~0.2-0.3pp below the company\'s 7.6-8.1%.' } },
    { pair: [
      { type: 'column', title: 'Cost of borrowing: down 44bp, then up 9bp in Q1FY27', unit: 'Cost of borrowing, company basis (%)', x: QK.map(q => q.q), series: [{ name: 'Cost of borrowing', values: QK.map(q => q.cofCo), fmt: 'n2' }], labels: 'all', min: 7, max: 8.3, source: 'Company presentations' },
      { type: 'line', title: 'Our NIM: up in FY27E, then flat as leverage rises', unit: 'NII ÷ average AUM (%), excl. fees', x: 'fin.labels', from: 'FY24', to: 'FY29E', series: [{ name: 'NIM', ref: 'fin.nim', fmt: 'pct' }, { name: 'Yield on AUM', ref: 'fin.yieldOnAum', fmt: 'pct' }], labels: 'ends', min: 5, max: 15, source: 'Company, Screener.in; GAM estimates' },
    ] },
    { callout: `**Our view:** we add ~15bp of yield in FY27E and ~10bp in FY28E for mix (yield {{F.yieldOnAum.0|pct}} / {{F.yieldOnAum.1|pct}}), and take the cost of funds up to {{F.costOfFunds.1|pct}}. The hidden drag is leverage: as equity falls from ~${n1(eqAumQ1)}% of AUM (Jun-2026) to {{F.equityToAum.2|pct}} by FY29E, more of the book is funded by borrowing at ~7.6%, worth ~${n0(levDrag * 100)}bp of NIM. So NIM rises from {{fin.nim.11|pct}} to {{F.nim.0|pct}} and then stalls near {{F.nim.2|pct}}. Motilal Oswal (7.6-7.7% on its basis) is similar; management's view that NIM keeps expanding needs yields to keep rising faster than leverage.` },
  ],
};

const quality = {
  id: 'quality', nav: 'Asset quality & credit cost', kicker: 'Asset quality', title: 'Credit cost is falling, but provision cover has halved and the new books are unseasoned',
  blocks: [
    { p: `Credit cost (provisions plus losses on selling bad loans) was ${n1(fin.creditCost[fi('FY25')])}% of average AUM in FY25, incl. the ₹666 cr STPL clean-up, and ${n1(fin.creditCost[fi('FY26')])}% in FY26. Quarterly it fell from ~3.1% (Q4FY25) to 2.40% in Q1FY27 (company basis). Gross NPA fell from 1.84% to 1.37% and net NPA from 0.85% to 0.70% over the same period, and collection efficiency was 99.6%. Write-offs run at ₹275-280 cr a quarter (~${n1(wo)}% of AUM a year), which management says is now "natural policy" write-off with the legacy book "behind us".` },
    { pair: [
      { type: 'line', title: 'Gross and net NPA have fallen for five quarters', unit: 'Gross / net Stage 3 (% of loans), quarter-end', x: ST.head.slice(1), series: [{ name: 'Gross NPA', values: ST.gnpa, fmt: 'n2' }, { name: 'Net NPA', values: ST.nnpa, fmt: 'n2' }], labels: 'ends', min: 0, max: 2.2, source: 'Q4FY26 and Q1FY27 presentations' },
      { type: 'column', title: 'Total provision cover: 2.8% to 1.4% of loans', unit: 'Expected-credit-loss provisions ÷ gross loans (%), from stage-wise coverage', x: ST.head.slice(1), series: [{ name: 'ECL cover', values: ecl, fmt: 'n2' }], labels: 'all', min: 0, max: 3.2, source: 'Q4FY26 and Q1FY27 presentations; GAM arithmetic' },
    ] },
    { exhibit: { type: 'table', title: 'Stage-wise loans and coverage (₹ crore)', head: ST.head, rows: [
      ['Stage 1 loans', ...ST.s1.map(n0)], ['Stage 2 loans', ...ST.s2.map(n0)], ['Stage 3 (gross NPA)', ...ST.s3.map(n0)],
      ['Stage 1 coverage (%)', ...ST.s1Pcr.map(v => v.toFixed(1))], ['Stage 2 coverage (%)', ...ST.s2Pcr.map(v => v.toFixed(1))], ['Stage 3 coverage (%)', ...ST.s3Pcr.map(v => v.toFixed(1))],
      { hl: true, cells: ['**Total ECL ÷ gross loans (%)**', ...ecl.map(v => `**${v.toFixed(2)}**`)] },
    ], source: 'Q4FY26 presentation p25; Q1FY27 presentation p25; GAM arithmetic for the total' } },
    { p: `**Why coverage matters.** Provisions held against performing loans (Stage 1) fell from 1.3% to 0.6% and against Stage 2 loans from 27% to 18% while the book doubled. Management attributes this to the run-off of the high-loss legacy book and a mix shift to low-loss products (gold, education), and that is partly right. But lower coverage also lowers reported credit cost: had coverage stayed at Mar-2025's ${ecl[0]}%, the provisions on Jun-2026's book would have been ~₹${n0((ecl[0] - ecl.at(-1)) / 100 * (ST.s1.at(-1) + ST.s2.at(-1) + ST.s3.at(-1)))} cr higher. JM Financial flags ~1.5% cover as thin for a ~46% unsecured, unseasoned book; Bajaj Finance holds ~2% against a more seasoned one.` },
    { callout: `**Our forecast:** credit cost of {{F.creditCost.0|n2}}% / {{F.creditCost.1|n2}}% / {{F.creditCost.2|n2}}% of average AUM for FY27-29E (Motilal Oswal 2.2% / 1.9%; HDFC Securities ~2%). We take ~10bp off Q1's run-rate for FY27 and stop near 2%: the new products are 12-24 months old, instant consumer loans (22-29% rates) are 19% of AUM, and coverage has little room left to fall. Each 10bp of credit cost is ~${n1(cc10)}% of FY28E profit. Bear case: ~3% (FY25 was 5.1% on our basis incl. one-offs).` },
  ],
};

module.exports = { franchise, spread, quality };
