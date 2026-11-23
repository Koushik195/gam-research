// Dr. Reddy's report, part 3b: India and emerging markets, Europe / NRT / consumer health and nutrition, PSAI, moat.
const X = require('./DRREDDY.ctx');
const { C, D, SA, SQ, QL, Q1, FY26, F, bld, BL, n0, n1, pc, rup } = X;
const f26 = SA.find(a => a.fy === 'FY26'), f25 = SA.find(a => a.fy === 'FY25'), f22 = SA.find(a => a.fy === 'FY22'), q = Q1.ifrs;
const qp = SQ.find(s => s.q === 'Q1FY26');

const branded = {
  id: 'branded', nav: 'India & emerging markets', kicker: 'Branded markets', title: 'India and emerging markets: 39% of revenue, growing 15-30%, and the steadiest part of the business',
  blocks: [
    { p: `**India** revenue was ₹${n0(f26.india)} cr in FY26 (+16%) and ₹${n0(q.india)} cr in Q1FY27 (+17%; 15.5% organic, i.e. excluding acquired brands). Dr. Reddy's out-grew the market on IQVIA data (14.6% vs 13.5% in the quarter to Jun-2026) and ranks #9-10. The drivers are specific: in-licensed innovation (toripalimab, a PD-1 cancer drug, passed ₹100 cr in under two years), new launches (28 brands in FY26, 7 in Q1FY27), price increases, vaccines (#2) and bought brands (Progynova and Cyclo-Progynova in hormone therapy, Stugeron). Semaglutide (Obeda injection, oral tablets) added little in Q1 because of the supply halt. Its biggest brands (Atarax ₹274 cr, Ketorol ₹265 cr, Econorm ₹249 cr MAT Jun-2026) grow 10-20%.` },
    { p: `**Emerging Markets** grew from ₹${n0(f22.em)} cr (FY22) to ₹${n0(f26.em)} cr (FY26) and +31% in Q1FY27 to ₹${n0(q.em)} cr: Russia ₹${n0(q.russia)} cr (+28%, price increases, launches and a stronger rouble), other CIS and Romania ₹${n0(q.cisr)} cr (+12%), Rest of World ₹${n0(q.row)} cr (+42%). The model is to take products developed for the US and launch them across 48 countries (129 launches in FY26, 43 in Q1FY27), plus in-licensed brands (XACDURO, tegoprazan). Adjusted for currency, Elara estimates Russia/CIS grew only low single digits in Q1FY27, and IQVIA shows Dr. Reddy's growing slower than the Russian market (10.9% vs 15.2%).` },
    { pair: [
      { type: 'column', title: 'India: +17% in Q1FY27', unit: 'India revenue (₹ crore a quarter, IFRS)', x: QL, series: [{ name: 'India', values: SQ.map(s => s.india), fmt: 'num' }], labels: 'all', source: 'Q1FY27 presentation' },
      { type: 'column', title: 'Emerging markets: +31% in Q1FY27', unit: 'Emerging Markets revenue (₹ crore a quarter, IFRS)', x: QL, series: [{ name: 'Emerging Markets', values: SQ.map(s => s.em), fmt: 'num' }], labels: 'all', source: 'Q1FY27 presentation' },
    ] },
    { exhibit: { type: 'table', title: 'Branded markets: proof points (to Jun-2026)', head: ['Measure', "Dr. Reddy's", 'Context'], rows: [
      ['India growth vs IPM (MQT / MAT)', `${D.industry.india.drlMqtGrowthPct}% / ${D.industry.india.drlMatGrowthPct}%`, `IPM ${D.industry.india.ipmMqtGrowthPct}% / ${D.industry.india.ipmMatGrowthPct}% (IQVIA Jun-2026)`],
      ['India rank', '#9 (MQT), #10 (MAT)', 'Not a top-five player'],
      ['Brands above ₹100 cr / in IPM top 300', `${D.industry.india.brands100cr} / ${D.industry.india.brandsTop300}`, 'Atarax, Ketorol, Econorm, Voveran, Omez lead'],
      ['Russia growth vs market', `${D.industry.russia.drlGrowthPct}%`, `Market ${D.industry.russia.marketGrowthPct}% (IQVIA MQT May-2026)`],
      ['Emerging-market launches', '129 in FY26; 43 in Q1FY27', '48 countries'],
    ], source: 'Q1FY27 presentation and release; ICICI Direct 24-Jul-2026 (brand sales, IQVIA)' } },
    { callout: `**Our view:** this is the part of Dr. Reddy's that deserves a premium: double-digit growth, pricing power in branded markets and low regulatory risk. We model India +${BL.indiaGrowth.join('% / +')}% and Emerging Markets +${BL.emGrowth.join('% / +')}% for FY27-29E (including semaglutide in both). The caveats: a good part of the growth is currency (rouble, rupee) and acquired or in-licensed brands, which cost money upfront and amortise.` },
  ],
};

const consumer = {
  id: 'consumer', nav: 'Europe, NRT & consumer', kicker: 'Diversification', title: 'Europe, NRT and the Nestle venture: a bought consumer franchise that works, and a nutrition JV still losing money',
  blocks: [
    { p: `**Europe** jumped from ₹${n0(f25.europe)} cr (FY25) to ₹${n0(f26.europe)} cr (FY26, +55%; +14% excluding NRT) and was ₹${n0(q.europe)} cr in Q1FY27 (+13%). It has two parts. Generics in Germany (₹${n0(q.germany)} cr in Q1FY27, +29%), the UK (₹${n0(q.uk)} cr, +33%), France, Italy and Spain grew on launches (24 in Q1FY27) and a stronger euro against price erosion. **NRT** (nicotine replacement therapy: Nicotinell, Nicabate, Thrive, Habitrol) was bought from Haleon for GBP458 mn upfront plus up to GBP42 mn of earn-out (completed 30-Sep-2024); Nicotinell is the #2 NRT brand outside the US. NRT revenue was ₹${n0(q.nrt)} cr in Q1FY27 (−2% YoY) because, after integration ended in Mar-2026, rebates to distributors are now deducted from revenue (profit-neutral, with lower SG&A). Management says NRT grows high single digit to low double digit with a "very healthy" margin.` },
    { p: '**Consumer health and nutrition.** In Apr-2024 Dr. Reddy\'s and Nestle India agreed to form "Dr. Reddy\'s and Nestle Health Science Limited" (Dr. Reddy\'s 51%, Nestle India 49%) to sell nutraceuticals in India: Nestle licensed Nature\'s Bounty, Osteo Bi-Flex and Ester-C; Dr. Reddy\'s transferred Celevida, Rebalanz, Antoxid, Kidrich-D3 and Becozinc (receiving ₹811 cr in FY25). In 2026 it launched Celevida GLP+, nutrition for patients on GLP-1 drugs, alongside the semaglutide launch. The JV lost money in FY26: Nestle\'s 49% absorbed a ₹38 cr loss (Dr. Reddy\'s share ~₹40 cr). Management runs consumer health as a separate pillar under its own head.' },
    { pair: [
      { type: 'column', title: 'Europe: NRT doubled the business', unit: 'Europe revenue (₹ crore, IFRS)', x: SA.map(a => a.fy), series: [{ name: 'Europe', values: SA.map(a => a.europe), fmt: 'num' }], labels: 'all', source: 'Annual reports (MD&A revenue tables)' },
      { type: 'column', title: 'Europe quarterly: flat at ~₹1,450 cr since Q3FY26', unit: 'Europe revenue (₹ crore a quarter, IFRS; Q1FY27 NRT net of distributor rebates)', x: QL, series: [{ name: 'Europe', values: SQ.map(s => s.europe), fmt: 'num' }], labels: 'all', source: 'Q1FY27 presentation' },
    ] },
    { callout: `**Our view:** NRT has been a sensible use of gRevlimid cash: a durable OTC brand in a defensive category, integrated on time. Europe should grow ~${BL.europeGrowth[0]}% a year (generic launches, NRT, currency) against generic price erosion. The Nestle JV is small and loss-making; it matters for the semaglutide ecosystem (nutrition for GLP-1 users) more than for earnings. We model minorities of ₹${TBtxt()} cr (the minority's share of JV losses).` },
  ],
};
function TBtxt() { return X.TB.minorities.map(v => v).join(' / '); }

const psai = {
  id: 'psai', nav: 'PSAI (APIs & CDMO)', kicker: 'PSAI', title: 'PSAI: a ₹3,500 cr API and CDMO arm with thin margins, now carrying the semaglutide API',
  blocks: [
    { p: `PSAI (Pharmaceutical Services and Active Ingredients) sells APIs to other generic makers and runs contract development and manufacturing. Revenue was ₹${n0(SA.find(a => a.fy === 'FY21').psai)} cr in FY21 and ₹${n0(f26.psai)} cr in FY26 (+3%): it has barely grown in five years. Gross margin was 17.2% in FY26 (27% in FY25, 23% in FY24 on the five-year summary) and 4.5% in Q1FY27 (12.9% excluding the semaglutide API provision). It filed 128 drug master files in FY26 and 38 in Q1FY27. PSAI makes the semaglutide API for Dr. Reddy's own pens and for other generic companies (management: "plenty of capacity for both third parties as well as ourselves").` },
    { pair: [
      { type: 'column', title: 'PSAI revenue: flat for five years', unit: 'PSAI revenue (₹ crore, IFRS)', x: SA.map(a => a.fy), series: [{ name: 'PSAI', values: SA.map(a => a.psai), fmt: 'num' }], labels: 'all', source: 'Annual reports' },
      { type: 'column', title: 'PSAI quarterly: ₹800-950 cr', unit: 'PSAI revenue (₹ crore a quarter, IFRS)', x: QL, series: [{ name: 'PSAI', values: SQ.map(s => s.psai), fmt: 'num' }], labels: 'all', source: 'Q1FY27 presentation' },
    ] },
    { callout: `**Our view:** PSAI is strategically useful (in-house APIs underpin semaglutide and cost control) but commercially ordinary. We model +${BL.psaiGrowth.join('% / +')}% for FY27-29E, with semaglutide API sales to third parties in FY28-29E as the only real growth driver.` },
  ],
};

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: moderate in branded markets and complex APIs, weak in US generics',
  blocks: [
    { verdicts: D.moat.map(m => [m[0], m[1], rup(m[2]), rup(m[3])]), head: ['Source of advantage', 'Strength', 'Evidence', 'Limits'], title: 'Moat scorecard', source: 'Company presentations, calls and AR FY26; GAM Research' },
    { callout: '**Honest verdict:** Dr. Reddy\'s has no wide moat. Its excess profits in FY23-FY25 came from one time-limited US product. What it does have is a good, diversified branded-generics business (India, Russia, Rest of World, NRT) worth ~half of revenue, real chemistry skill in complex APIs, and a strong balance sheet. Biosimilars could become a moat if abatacept succeeds; today they are a cost. In US generics, by the CEO\'s own account, R&D productivity lagged peers for years.' },
  ],
};

module.exports = { branded, consumer, psai, moat };
