// SBI Cards report, part 3: franchise (cards, sourcing, receivables), the fee engine (spends × take rate),
// spread and NIM. Asset quality is in part3b.
const X = require('./SBICARD.ctx');
const { C, SG, F, A, AS, AK, fin, fi, n0, n1, n2, pc, Q1, G27, K26, fee, spends26, take10 } = X;
const FY = ['FY19', 'FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'];
const FS = SG.annual, FB = AS.feeBuild;

const franchise = {
  id: 'franchise', nav: 'Franchise & receivables', kicker: 'Franchise and growth', title: 'Cards are growing again; receivables are not, yet',
  blocks: [
    { p: `SBI Card sources new customers through two channels. **Banca** (State Bank of India's branches and its YONO app) brought 47% of new accounts in Q1FY27 and 46% in FY26; it gives SBI Card customers whose banking history SBI already sees (salaried, government and PSU employees among them), which is the cheapest, lowest-risk sourcing any Indian issuer has. **Open market** (53%) means co-brand partners (BPCL, Flipkart, Tata Neu, IndiGo, PhonePe, Apollo, IRCTC and others) and direct sales. Management's target is 50-55% banca. New accounts fell from 52 lakh in FY23 to 36 lakh in FY26 as underwriting was tightened, and are now rising again: 10.2 lakh in Q1FY27 (+17%), with the industry's highest net card additions (4.84 lakh).` },
    { pair: [
      { type: 'column', title: 'New accounts: cut back after FY23, now rising again', unit: 'New accounts (lakh)', x: FY, series: [{ name: 'New accounts', values: FY.map(l => AK[l].newAccountsLakh), fmt: 'n1' }], labels: 'all', source: 'Annual reports FY21, FY22, FY26' },
      { type: 'column', title: 'Receivables per card are falling', unit: 'Gross receivables ÷ cards in force at March (₹)', x: FY, series: [{ name: 'Receivables per card', values: FY.map(l => Math.round(AK[l].receivables * 1e7 / (AK[l].cifMm * 1e6))), fmt: 'num' }], labels: 'all', source: 'Annual reports; GAM arithmetic' },
    ] },
    { p: `Why receivables stalled while cards grew: (1) tighter credit limits after the FY25 stress ("maybe we were slightly conservative", MD) — limits are now being raised again for eligible customers; (2) more customers paying in full: transactors rose from 40% to 45-46% of receivables; (3) revolvers shrank from 24% to 22% as some moved to cheaper personal loans; (4) the new accounts of FY26 were fewer and take a year or more to build balances. Management expects growth to pick up from H2FY27 (higher acquisition, festive season), but gave no number.` },
    { exhibit: { type: 'table', title: 'Our receivables build vs history', head: ['', 'FY24', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Gross receivables (₹ cr)', '{{fin.aum.9|num}}', '{{fin.aum.10|num}}', '{{fin.aum.11|num}}', '{{F.aum.0|num}}', '{{F.aum.1|num}}', '{{F.aum.2|num}}'],
      ['Growth', '{{fin.aumGrowth.9|pct}}', '{{fin.aumGrowth.10|pct}}', '{{fin.aumGrowth.11|pct}}', '{{F.aumGrowth.0|pct}}', '{{F.aumGrowth.1|pct}}', '{{F.aumGrowth.2|pct}}'],
      ['Card spends (₹ \'000 cr)', n0(AK.FY24.spends / 1000), n0(AK.FY25.spends / 1000), n0(spends26 / 1000), n0(fee[0].spends / 1000), n0(fee[1].spends / 1000), n0(fee[2].spends / 1000)],
      ['Receivables ÷ annual spends', `${n1(AK.FY24.receivables / AK.FY24.spends * 100)}%`, `${n1(AK.FY25.receivables / AK.FY25.spends * 100)}%`, `${n1(K26.receivables / spends26 * 100)}%`, ...[0, 1, 2].map(i => `${n1(F.aum[i] / fee[i].spends * 100)}%`)],
      ['Management guidance', '–', '–', 'none given', 'pick-up from H2', 'none', 'none'],
    ], source: 'Annual reports; GAM estimates. Q1FY27 receivables ₹58,269 cr (+2.9% YoY, +2.4% QoQ).' } },
    { callout: `**Our view:** we assume receivables grow 8% in FY27E (Q1 already +2.4%; Q2FY26 alone added 5.7%) and 12-13% in FY28-29E as the larger FY27 card cohorts build balances and limits are raised. That is half the FY19-24 pace. Receivables fall from 13% of annual spends in FY26 to ~12% because spends (corporate, UPI) grow faster than lendable balances. Bull case: +11/15/16%; bear: +4/8/9%.` },
  ],
};

const take = FY.slice(2).map(l => [l, FS.find(a => a.fy === l)]).map(([l, a]) => [l, a.interchange / a.spends * 100]);
const fees = {
  id: 'fees', nav: 'Fee engine', kicker: 'Fees and spends', title: 'Half the revenue comes from fees; we model them from spends, and the take rate is falling',
  blocks: [
    { p: `Fees and other operating income were ₹${n0(K26.feesAndOther)} cr in FY26, as large as interest income (₹${n0(K26.interestIncome)} cr). Interchange alone was ₹${n0(K26.interchange)} cr: ${(K26.interchange / spends26 * 100).toFixed(2)}% of ₹${(spends26 / 1e5).toFixed(1)} lakh cr of spends, down from ~1.4% in FY21-FY22 as lower-rate spending (corporate cards, UPI-RuPay) grew faster. Late and other fees (₹${n0(K26.feeBased)} cr) fell 2% as fewer customers paid late, and membership fees (₹${n0(K26.membership)} cr) grew 2%. We therefore build fees bottom-up from spends rather than as a flat share of receivables.` },
    { pair: [
      { type: 'stacked', title: 'Fee income by type: interchange is half', unit: '₹ crore', x: FS.map(a => a.fy), series: [{ name: 'Interchange', values: FS.map(a => a.interchange), fmt: 'num' }, { name: 'Late & other fees', values: FS.map(a => a.feeBased), fmt: 'num' }, { name: 'Membership', values: FS.map(a => a.membership), fmt: 'num' }, { name: 'Network incentives & other', values: FS.map(a => a.bd + a.other), fmt: 'num' }], minLabel: 600, source: 'Annual reports FY22-FY26 (notes on fees and commission income)' },
      { type: 'line', title: 'Interchange take rate: 1.40% to 1.19% in five years', unit: 'Interchange ÷ total card spends (%)', x: take.map(t => t[0]), series: [{ name: 'Take rate', values: take.map(t => Math.round(t[1] * 100) / 100), fmt: 'n2' }], labels: 'all', min: 1, max: 1.5, source: 'Annual reports; GAM arithmetic (FY23-24 spends rounded)' },
    ] },
    { exhibit: { type: 'table', title: 'Our fee build (₹ crore)', head: ['', 'FY26A', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Retail spends (₹ \'000 cr)', n0(FB.base.retail / 1000), ...fee.map(f => n0(f.retail / 1000))],
      ['Corporate spends (₹ \'000 cr)', n0(FB.base.corporate / 1000), ...fee.map(f => n0(f.corporate / 1000))],
      ['Interchange take rate', `${(K26.interchange / spends26 * 100).toFixed(2)}%`, ...FB.takeRate.map(t => `${t.toFixed(2)}%`)],
      ['Interchange', n0(K26.interchange), ...fee.map(f => n0(f.interchange))],
      ['Late and other fees', n0(K26.feeBased), ...fee.map(f => n0(f.feeBased))],
      ['Membership fees', n0(K26.membership), ...fee.map(f => n0(f.membership))],
      ['Network incentives', n0(K26.bdIncentive), ...fee.map(f => n0(f.bd))],
      ['Other (services, insurance)', n0(K26.saleOfServices + K26.insurance), ...fee.map(f => n0(f.other))],
      { hl: true, cells: ['**Fees & other operating income**', `**${n0(K26.feesAndOther)}**`, ...fee.map(f => `**${n0(f.total)}**`)] },
      ['% of average receivables', '{{fin.feePct.11|pct}}', '{{F.feePct.0|pct}}', '{{F.feePct.1|pct}}', '{{F.feePct.2|pct}}'],
    ], source: `GAM Research. Retail spends +${FB.retailGrowth.join('/')}%; corporate ${FB.corporateShare[0]}% of spends (management: "around 20%"); fees flat in FY27 (late fees fall), then +8-10%; membership with cards in force.` } },
    { p: `**The cost side moves with spends too.** Rewards (₹${n0(K26.rewardPoints)} cr in FY26, +35%), card transaction charges (₹${n0(K26.cardTxnCharges)} cr, +28%), fees and commission paid (₹${n0(K26.feeCommissionExpense)} cr, +92%, mainly pass-backs on corporate spends) and sales promotion (₹${n0(K26.salesPromotion)} cr) together were ~${n0((K26.rewardPoints + K26.cardTxnCharges + K26.feeCommissionExpense + K26.salesPromotion) / K26.opexTotal * 100)}% of FY26 operating cost. That is why a spend boom does not lift profit one for one: management guides cost-to-income of 56-58% for FY27 (58.7% in Q1). Each 1bp of interchange take rate is worth ~${n2(take10)}% of FY28E profit.` },
    { callout: `**Our view:** fees grow ~${n0((fee[0].total / K26.feesAndOther - 1) * 100)}% in FY27E and ~11-12% a year after, a little faster than receivables, because spends grow 15%+. The risk is the take rate: we cut it 2-4bp a year; a faster shift to UPI-RuPay and corporate spends would cost more.` },
  ],
};

const spread = {
  id: 'spread', nav: 'Spread & NIM', kicker: 'Margins', title: 'NIM: high by lending standards, but drifting down as revolvers shrink',
  blocks: [
    { p: `On our basis (all interest income ÷ average March receivables), the yield was {{fin.yieldOnAum.11|pct}} in FY26 and NIM {{fin.nim.11|pct}}; on the company's basis (cardholder interest only, monthly averages) yield was 16.5% and NIM 11.2%. Both are high because only ~55% of receivables earn interest, and those revolve or EMI balances earn far more than a bank loan. The direction is down: company yield fell from 17.6% (FY22) to 16.5% (FY26) and 16.0% in Q1FY27, and NIM fell 28bp QoQ to 10.8% in Q1, as revolvers fell to 22% and lower-yield EMI balances grew. Cost of funds helped in FY26 (6.7% vs 7.4%) but management now expects it to "trend higher in line with market rates".` },
    { exhibit: { type: 'table', title: 'Spread and margin: history and our forecast (our basis)', x: 'fin.labels', from: 'FY22', to: 'FY29E', rowsRef: [
      { name: 'Yield: interest income ÷ average receivables (%)', ref: 'fin.yieldOnAum', fmt: 'pct' }, { name: 'Cost of funds ÷ average borrowings (%)', ref: 'fin.costOfFunds', fmt: 'pct' },
      { name: 'NIM: NII ÷ average receivables (%)', ref: 'fin.nim', fmt: 'pct', hl: true },
      { name: 'Fees & other income ÷ average receivables (%)', ref: 'fin.feePct', fmt: 'pct' }, { name: 'Net total income ÷ average receivables (%)', ref: 'fin.ntiPct', fmt: 'pct' },
    ], source: 'Annual reports, Screener.in; GAM estimates. Company-basis NIM (monthly averages, cardholder interest): 13.9% FY22, 12.1% FY23, 11.1% FY24, 10.8% FY25, 11.2% FY26, 10.8% Q1FY27.' } },
    { pair: [
      { type: 'column', title: 'Company NIM: 13.9% to 10.8% in four years', unit: 'NIM, company basis (%)', x: ['FY22', 'FY23', 'FY24', 'FY25', 'FY26', 'Q1FY27'], series: [{ name: 'NIM', values: [13.9, 12.1, 11.1, 10.8, 11.2, 10.8], fmt: 'n1' }], labels: 'all', highlight: 'Q1FY27', min: 0, max: 15, source: 'Annual report FY26 p24; Q1FY27 presentation p12' },
      { type: 'column', title: 'Cost of funds fell 1pp in a year, now flat', unit: 'Cost of funds, company basis (%)', x: ['Q4FY25', 'Q1FY26', 'Q2FY26', 'Q3FY26', 'Q4FY26', 'Q1FY27'], series: [{ name: 'Cost of funds', values: [7.2, 7.1, 6.4, 6.5, 6.4, 6.5], fmt: 'n1' }], labels: 'all', min: 5, max: 8, source: 'Quarterly presentations (Q4FY25 7.2% reported, 7.3% before a lease one-off)' },
    ] },
    { callout: `**Our view:** management says NIM "should be around this range"; we hold our yield near Q1's run-rate ({{F.yieldOnAum.0|pct}} → {{F.yieldOnAum.2|pct}}) and add ~10-20bp to funding costs, so NIM on our basis eases from {{fin.nim.11|pct}} to {{F.nim.0|pct}} and stays there. Upside if limit increases and the festive season revive revolve; downside if personal loans keep taking revolvers.` },
  ],
};

module.exports = { franchise, fees, spread, ...require('./SBICARD.part3b') };
