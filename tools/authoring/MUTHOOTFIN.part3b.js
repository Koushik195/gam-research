// Muthoot Finance report, part 3b: spread and NIM, asset quality and credit cost.
const X = require('./MUTHOOTFIN.ctx');
const { C, SG, F, AS, fin, fi, n0, n1, n2, pc, Q1 } = X;
const GQ = SG.goldQuarterly.filter(q => q.yield != null), SAK = C.annualKpis.filter(k => k.saYield != null);
const ccBp = F.avgAum[1] * 0.001 * (1 - AS.taxRate[1] / 100) / F.patAttrib[1] * 100; // 10bp of credit cost, % of FY28E profit
const yBp = F.avgAum[1] * 0.001 * (1 - AS.taxRate[1] / 100) / F.patAttrib[1] * 100; // 10bp of yield (same base)
const S3 = SG.stage3Sa;

const spread = {
  id: 'spread', nav: 'Spread & NIM', kicker: 'Margins', title: 'The yield windfall is over: NIM fell from 13.4% to 10.4% in one quarter',
  blocks: [
    { p: `Muthoot charges more than banks for speed and convenience: its standalone yield (interest income ÷ average loans) has ranged from 17.7% to 20.2% over FY22-26. FY26 was the top of that range, and for reasons that will not repeat. The CFO listed them on 1-Aug-2026: rising gold let customers top up and roll over loans "without needing to give any discounts", old bad loans paid in full, ARC receipts flowed to profit after the principal was recovered, auctions added income, and a rush of renewals before the new rules. The MD called FY26 "a windfall, onetime". Muthoot also raised rates by 0.5-1% on some schemes in Q4FY26. In Q1FY27 the yield fell to 17.93% and the NIM to 10.41% (13.38% in Q4). Management guides 18-18.5% "steady state".` },
    { pair: [
      { type: 'column', title: 'Standalone yield by quarter: back to the pre-windfall level', unit: 'Interest income ÷ average loan assets (%), standalone', x: GQ.map(q => q.q), series: [{ name: 'Yield', values: GQ.map(q => q.yield), fmt: 'n2' }], labels: 'all', highlight: 'Q1FY27', min: 15, max: 22, source: 'Q4FY26 and Q1FY27 presentations' },
      { type: 'line', title: 'Standalone NIM: 15.5% in FY20, 12.8% in FY26, 10.4% in Q1FY27', unit: 'Net interest margin on average loan assets (%), standalone, company basis', x: [...C.annualKpis.map(k => k.fy), 'Q1FY27'], series: [{ name: 'NIM', values: [...C.annualKpis.map(k => k.saNim), Q1.saNim], fmt: 'n2' }], labels: 'all', min: 8, max: 17, source: 'Q4FY25, Q4FY26 and Q1FY27 presentations' },
    ] },
    { exhibit: { type: 'table', title: 'Spread and margin (consolidated, our basis): history and forecast', x: 'fin.labels', from: 'FY20', to: 'FY29E', rowsRef: [
      { name: 'Yield on average AUM (%)', ref: 'fin.yieldOnAum', fmt: 'pct' }, { name: 'Cost of funds on average borrowings (%)', ref: 'fin.costOfFunds', fmt: 'pct' },
      { name: 'Spread (pp)', ref: 'fin.spread', fmt: 'n2' }, { name: 'NIM: NII ÷ average AUM (%)', ref: 'fin.nim', fmt: 'pct', hl: true },
      { name: 'Fees & other income ÷ average AUM (%)', ref: 'fin.feePct', fmt: 'pct' }, { name: 'Net total income ÷ average AUM (%)', ref: 'fin.ntiPct', fmt: 'pct' },
    ], source: 'Company presentations, Screener.in; GAM estimates. Consolidated yields include Belstar (microfinance, ~22-24%) and Homefin (~13%); the consolidated NIM was 10.9% annualised in Q1FY27.' } },
    { p: `**Why we expect yields to keep slipping after FY27.** Three forces push the same way. Competition: new entrants with cheaper funding are pricing to win share, and asked whether Dec-2022 to Jun-2023 (when Muthoot's yield fell ~350bp) could repeat, with every gold lender cutting rates, the CFO said "Quite possible". Mix: bigger tickets (69% of the book above ₹3 lakh) carry lower rates. Product: under the new rules interest must be serviced or counted in LTV, so the practice of letting high-rate interest accrue on old loans fades. Against that, Muthoot can reprice quickly (loans churn every ~4 months) and has "a bouquet" of schemes from 12% to 23%. We model 18.1% / 17.8% / 17.5% for FY27-29E on a consolidated basis (≈17.7-17.1% standalone). Each 10bp of yield is ~${n1(yBp)}% of FY28E profit.` },
    { callout: `**Our view:** FY26's NIM of {{fin.nim.11|pct}} (consolidated) was a peak, and the Q1 run-rate is the better guide. We model {{F.nim.0|pct}} → {{F.nim.2|pct}} for FY27-29E. Funding will not help: the cost of borrowing rose in Q1 and the CFO expects no cut. The good news is that even at ~10.5% NIM, low costs and tiny losses still give an ROA above 5%.` },
  ],
};

const quality = {
  id: 'quality', nav: 'Asset quality & credit cost', kicker: 'Asset quality', title: 'Asset quality: tiny losses on gold, a Stage 2 bump from the new rules, and Belstar\'s recovery',
  blocks: [
    { p: `Gold loans rarely go bad in the way unsecured loans do: if a borrower stops paying, Muthoot sells the jewellery and usually recovers everything (FY26 auctions realised ₹366 cr against ₹316 cr of dues). Bad debts written off were 0.14% of standalone loans in FY26 and 0.05% in Q1FY27. Reported Stage 3 (non-performing) loans look high for such a safe book, 2.28% in Jun-2026, because an overdue bullet loan becomes "non-performing" even when the gold covers it: management says Stage 3 dues incl. interest were only ~58% of the gold's value in Mar-2026. From Mar-2026 the RBI asked Muthoot to classify NPAs borrower-wise rather than loan-wise, which lifted Stage 3 from 1.58% (Dec-25) to 2.35%.` },
    { pair: [
      { type: 'line', title: 'Standalone Stage 3: 4.3% to 2.3% in two years', unit: 'Stage 3 % of loans, quarter-end (borrower-wise from Mar-26)', x: S3.head, series: [{ name: 'Stage 3', values: S3.values, fmt: 'n2' }], labels: 'all', min: 0, max: 5, source: 'Q4FY25, Q4FY26 and Q1FY27 presentations' },
      { type: 'column', title: 'Group credit cost: the FY25 microfinance spike is gone', unit: 'Impairment ÷ average AUM (%), consolidated; Q1FY27 annualised', x: ['FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26', 'Q1FY27'], series: [{ name: 'Credit cost', values: [...['FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'].map(y => Math.round(fin.creditCost[fi(y)] * 100) / 100), 0.26], fmt: 'n2' }], labels: 'all', highlight: 'Q1FY27', source: 'Company presentations, Screener.in; GAM Research' },
    ] },
    { exhibit: { type: 'table', title: 'Standalone loans by stage (₹ crore)', head: ['', 'Jun-25', 'Mar-26', 'Jun-26', 'Change in Q1'], rows: [
      ['Stage 1 (performing)', '1,15,881', '1,57,940', n0(Q1.saStage1Cr), pc((Q1.saStage1Cr / 157940 - 1) * 100)],
      ['Stage 2 (30-90 days overdue)', '1,056', n0(Q1.saStage2CrMar26), n0(Q1.saStage2Cr), pc((Q1.saStage2Cr / Q1.saStage2CrMar26 - 1) * 100)],
      ['Stage 3 (90+ days, non-performing)', '3,095', '3,824', n0(Q1.saStage3Cr), pc((Q1.saStage3Cr / 3824 - 1) * 100)],
      ['ECL provisions (% of loans)', '1.30%', '1.10%', `${Q1.eclPct}%`, ''],
      ['Excess provision held (₹ cr)', '295', '295', n0(Q1.excessProvisionCr), ''],
    ], source: 'Q1FY27 presentation p31' } },
    { p: `**Two things to watch.** First, standalone Stage 2 loans jumped 77% in Q1 to ₹1,876 cr. An analyst on the call linked it to the new rules ("Stage 1, Stage 2 loans actually increased because of this regulation"): customers used to letting interest accrue for a year are being pushed to pay at least quarterly, and some fall behind on paper. If that normalises, it is noise; if not, it becomes Stage 3 and, under borrower-wise classification, drags other loans of the same customer with it. Second, **Belstar** (microfinance, 66% owned) was the source of the FY25 spike: group impairment hit ₹1,576 cr (1.5% of AUM) against ₹746 cr at the parent. Belstar's Stage 3 has since fallen from 5.5% (Mar-26) to 2.9% (Jun-26) and it earned ₹66 cr in Q1, but its book is not growing (+2% YoY).` },
    { callout: `**Our forecast:** credit cost of {{F.creditCost.0|n2}}% / {{F.creditCost.1|n2}}% / {{F.creditCost.2|n2}}% of average AUM for FY27-29E, up from 0.26% in Q1 (annualised) to allow for the Stage 2 bump, a normal microfinance cycle and a less forgiving gold market. Each 10bp of credit cost is ~${n1(ccBp)}% of FY28E profit. In the bear case (gold −20%) we add 40bp: auctions and LTV breaches rise, but history (FY14, FY23) says losses stay small; the damage is to growth and yield.` },
  ],
};

module.exports = { spread, quality };
