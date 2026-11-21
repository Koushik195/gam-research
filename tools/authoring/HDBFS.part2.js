// HDB Financial Services report, part 2: what the company does, history and corporate actions.
const X = require('./HDBFS.ctx');
const { C, SG, n0, n1, pc, Q1, F26 } = X;

const VB = SG.verticalBook, VJ = VB.find(v => v.q === 'Jun-26'), VJ0 = VB.find(v => v.q === 'Jun-25'), S3 = SG.verticalStage3['Jun-26'];
const QK = C.quarterlyKpis;
const business = {
  id: 'business', nav: 'What HDB does', kicker: 'Company', title: 'A retail lender to "aspirational India": small businesses, truckers and consumers, plus a back office for HDFC Bank',
  blocks: [
    { p: `HDB Financial Services is a non-deposit-taking NBFC owned 74.1% by HDFC Bank, India's largest private bank. The RBI treats it as an "upper-layer" NBFC, the tier with bank-like rules. It lends to people and small firms with thin credit histories in smaller towns: 71% of its 1,710 branches are in tier-4 towns or smaller, and it reaches customers through 160,000+ dealers and retailers. In FY26 it earned ₹15,788 cr of interest and ₹1,417 cr of lending fees and charges (incl. ₹455 cr of insurance commission), paid ₹6,820 cr of interest, spent ₹4,266 cr running the lending business and set aside ₹2,815 cr for bad loans, leaving ₹3,305 cr of lending profit before tax. The BPO business added ₹81 cr on ₹1,224 cr of revenue.` },
    { p: `The arithmetic is "high yield, high cost, high loss". In Q1FY27 the loan book yielded ${Q1.yieldLoans}% and interest cost ${Q1.cofLoans}% of loans, a net interest margin of ${Q1.nimLoans}%. Fees add ~1.2%. Running 1,700 branches and 63,500 lending staff costs ~${Q1.opexToLoans}% of loans and bad loans another ~${Q1.creditCostLoans}%. What is left is a ${Q1.roaAssets}% return on assets; ~6x leverage turns that into a ${n0(Q1.roe)}% ROE. Compare Bajaj Housing Finance: a 9% yield, almost no losses, a similar ROA. HDB earns its return by pricing for risk and then absorbing the losses.` },
    { exhibit: { type: 'table', title: 'Three lending verticals: size, growth and asset quality (Jun-2026)', head: ['Vertical', 'Gross loans (₹ cr)', 'YoY growth', 'Share', 'Stage 3', 'Stage 3 cover', 'What it is'], wide: [6], rows: [
      ...SG.verticals.map(v => [v.name, n0(VJ[v.key]), pc((VJ[v.key] / VJ0[v.key] - 1) * 100), `${n1(VJ[v.key] / VJ.total * 100)}%`, `${(S3[v.key][0] / VJ[v.key] * 100).toFixed(2)}%`, `${S3[v.key][1]}%`, v.what]),
      { hl: true, cells: ['**Total**', `**${n0(VJ.total)}**`, `**+${Q1.loanGrowth}%**`, '**100%**', `**${Q1.stage3Pct.toFixed(2)}%**`, `**${n0(Q1.pcr)}%**`, `74% secured; top 20 borrowers ${Q1.top20Share}% of loans`] },
    ], source: 'Q1FY27 presentation p11, p24, p31' } },
    { pair: [
      { type: 'stacked', title: 'Consumer finance is the growth engine; asset finance has stalled', unit: 'Gross loans by vertical (₹ \'000 crore)', x: VB.map(v => v.q), series: SG.verticals.map(v => ({ name: v.name, values: VB.map(r => Math.round(r[v.key] / 100) / 10), fmt: 'n1' })), minLabel: 10, source: 'Q4FY26 presentation p32; Q1FY27 presentation p24' },
      { type: 'column', title: 'Disbursements recovered through FY26: ₹15,171 cr to ₹19,922 cr a quarter', unit: 'New loans in the quarter (₹ crore)', x: QK.map(q => q.q), series: [{ name: 'Disbursements', values: QK.map(q => q.disbursements), fmt: 'num' }], labels: 'all', highlight: 'Q1FY27', source: 'Q4FY26 and Q1FY27 presentations p22' },
    ] },
    { p: `**The BPO business.** About 24,600 of HDB's 88,162 employees (Mar-2026) work for HDFC Bank: sales support (₹737 cr of FY26 revenue), back-office processing (₹207 cr) and collections (₹280 cr). HDFC Bank is the only client and the margin is thin (₹81 cr, 6.6% of revenue, 2.4% of HDB's profit). Revenue halved from ₹2,634 cr in FY23 to ₹1,217 cr in FY25 and has been flat since. In our model BPO revenue sits in fees and its costs in operating expenses, as on Screener, and both are forecast in rupees, so BPO adds ~₹100-110 cr a year and does not grow with the loan book.` },
    { callout: `**Why this matters:** HDB is three lenders with different cycles under one roof. Enterprise lending (mostly loans against property) is steady and secured; asset finance (trucks, equipment, tractors) moves with freight, monsoons and infrastructure spending and is where losses come from (Stage 3 ${(S3.af[0] / VJ.af * 100).toFixed(1)}%); consumer finance (durables, cars, two-wheelers, personal loans) is short-dated, fast-growing and partly unsecured. Diversification smooths the cycle; it does not remove it.` },
  ],
};

const AK = C.annualKpis;
const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'Nineteen years, two credit cycles and an IPO the RBI required',
  blocks: [
    { p: `HDFC Bank set HDB up in 2007 (registered in Ahmedabad) to lend where the bank did not: smaller tickets, thinner files, smaller towns. It grew AUM from ₹25,906 cr in FY16 to ₹1,18,733 cr in FY26 (16% a year) mostly on its own capital and retained profit. Two credit cycles shaped it: the IL&FS-to-Covid shock (FY20-FY22: gross NPA up to 5.0%, ROE down to 4.8%, AUM flat for three years) and the FY25-FY26 stress in trucks and unsecured business loans (credit cost back to 2.5%). The listing was not optional: the RBI's scale-based rules require upper-layer NBFCs to list within three years of being identified, and HDB was on the first list in 2022. The ₹12,500 cr IPO (Jun-2025) was mostly HDFC Bank selling (₹10,000 cr); HDB raised ₹2,500 cr.` },
    { exhibit: { type: 'table', title: 'Key events and what they did to the numbers', head: ['When', 'Event', 'Impact on the numbers'], wide: [1, 2], rows: [
      ['FY16-FY19', 'Fast growth across three verticals', 'AUM ₹25,906 cr → ₹55,425 cr; ROE 16-17%; credit cost 0.9-1.4%'],
      ['FY20-FY22', 'IL&FS liquidity squeeze, then Covid and the moratorium', 'Credit cost 2.5% / 5.1% / 4.0%; gross NPA peaked at 5.0% (FY22); ROE 13.2% → 4.8% → 11.2%; AUM flat at ~₹61,000 cr'],
      ['FY23-FY24', 'Recovery', 'Credit cost 2.0% → 1.3%; ROE 18.7% → 19.5% (peak); AUM +14% and +29%'],
      ['FY23-FY25', 'BPO revenue from HDFC Bank falls', '₹2,634 cr → ₹1,217 cr; BPO profit ₹158 cr (FY24) → ₹71 cr (FY25)'],
      ['FY25-FY26', 'Stress in used/high-value CVs and unsecured business loans; HDB cuts back', 'Credit cost 2.1% → 2.5%; Stage 3 2.81% at Sep/Dec-25; AUM growth 19% → 11%; ROE 14.7% → 13.9%'],
      ['Jun/Jul-2025', 'IPO at ₹740 (₹2,500 cr fresh, ₹10,000 cr sold by HDFC Bank), 16.7x subscribed; listed at ₹835', 'Equity +31% in FY26; HDFC Bank 94.3% → 74.2%; leverage 6.9x → 6.0x'],
      ['1-Oct-2025 / 5-Dec-2025', 'RBI drops the ban on bank-group overlap; final rules allow it with a board-recorded rationale', 'Removes the risk of HDB being merged or restructured; bank-style loan restrictions apply'],
      ['Oct-2025 / Apr-2026', 'First dividends as a listed company (₹2 interim, ₹2 final)', 'FY26 payout 13%'],
      ['Q1FY27', 'Record profit, Stage 3 down to 2.34%, NIM 8.35%', 'PAT +38%; ROE 15.0%; loans still only +11.4%'],
    ], source: 'Q1FY27 presentation p32; annual reports FY23, FY24, FY26; BusinessToday (2-Jul-2025); RBI' } },
    { pair: [
      { type: 'column', title: 'Gross NPA: 5.0% at the Covid peak, 2.4% now', unit: 'Gross NPA / Stage 3 at March (% of loans)', x: AK.map(k => k.fy), series: [{ name: 'Gross NPA', values: AK.map(k => k.gnpa), fmt: 'n1' }], labels: 'all', source: 'Q1FY27 presentation p32' },
      { type: 'line', title: 'AUM growth: from flat (Covid) to 29%, now 11%', unit: 'AUM growth (%)', x: 'fin.labels', from: 'FY22', to: 'FY29E', series: [{ name: 'AUM growth', ref: 'fin.aumGrowth', fmt: 'pct' }], labels: 'all', min: -5, max: 32, source: 'Company presentations; GAM estimates' },
    ] },
  ],
  _ca: C.corporateActions,
};

module.exports = { business, history, ...require('./HDBFS.part2b') };
