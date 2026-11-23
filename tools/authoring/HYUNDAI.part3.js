// Hyundai Motor India report, part 3: the domestic business (volume x revenue per vehicle build), exports and
// the moat.
const X = require('./HYUNDAI.ctx');
const { C, D, SA, SQ, QL, A26, A25, F, AS, bld, n0, n1, pc, pc1, rup } = X;
const MO = C.monthly, Q1 = C.q1fy27, QK = C.quarterlyKpis;
const g = (a, p) => pc1((a / p - 1) * 100);

const domestic = {
  id: 'domestic', nav: 'Domestic business', kicker: 'Market: India', title: 'India: two years of lost share; Bayon, an EV and a third Pune shift to turn it',
  blocks: [
    { p: `Hyundai sold ${n0(A26.domestic)} vehicles in India in FY26 (−2.3%) while the market grew ${D.industry.pvFY26.growthPct}%. H1FY26 was weak (Q1 −11.5%, Q2 −6.8%) as the market waited for the GST cut; H2 recovered (Q3 +0.4%, Q4 +8.5%, a record quarter). FY27 started well (April-May +13%) until a fire at a supplier cost ~${n0(Q1.productionLost)} vehicles of June production, mostly the Creta: Q1FY27 domestic was ${n0(QK[4].domestic)} (+5.4%). July (+23.3%) and August (+23.6%) made up most of the loss; Apr-Aug was ${n0(MO.ytd.domestic)}, +${MO.ytd.domesticGrowthPct}%.` },
    { p: 'What drives FY27-FY28: (1) the **Bayon** mid-SUV (named on 14-Sep-2026, bookings from 23-Sep; a 4.0-4.4 m "technology-first" SUV between the Venue and the Creta, launched for the festive season); (2) a **localised compact EV** in H2FY27, Hyundai\'s first mass-market EV, aiming for PLI incentives; (3) the **Pune third shift** from Oct-2026 (more Venue for India and export); and (4) lower discounts (2.8% of price in Q1FY27 vs 3.4%). Against that: the industry laps the post-GST base from October, and a reported production-plan increase for CY26 (to ~820,000 from ~770,000; Autocar Pro, 15-Sep-2026, not confirmed by the company) suggests management sees demand but also that inventory will be built ahead of the launches.' },
    { pair: [
      { type: 'column', title: 'Domestic volumes by quarter: a record Q4FY26, then the fire', unit: 'Domestic wholesales (vehicles)', x: QL, series: [{ name: 'Domestic', values: SQ.map(q => q.domestic), fmt: 'num' }], labels: 'all', source: 'Investor presentations' },
      { type: 'line', title: 'Revenue per vehicle: ~₹9.1-9.2 lakh, rising slowly', unit: 'Revenue ÷ total vehicles sold (₹ lakh)', x: QL, series: [{ name: 'Revenue per vehicle', values: SQ.map(q => Math.round(q.revenue * 1e7 / q.units / 1000) / 100), fmt: 'n2' }], labels: 'ends', min: 8.5, max: 9.5, source: 'Screener.in revenue ÷ company volumes' },
    ] },
    { exhibit: { type: 'table', title: 'Our volume build (vehicles) and revenue (₹ crore)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Domestic', n0(A26.domestic), ...bld.map(r => n0(r.dom))],
      ['  growth', '−2.3%', ...bld.map((r, i) => g(r.dom, i ? bld[i - 1].dom : A26.domestic))],
      ['Exports', n0(A26.exports), ...bld.map(r => n0(r.ex))],
      ['  growth', '+16.4%', ...bld.map((r, i) => g(r.ex, i ? bld[i - 1].ex : A26.exports))],
      { hl: true, cells: ['**Total volume**', `**${n0(A26.units)}**`, ...bld.map(r => `**${n0(r.units)}**`)] },
      ['Revenue per vehicle (₹)', n0(X.rpu26), ...bld.map(r => n0(r.rpu))],
      { hl: true, cells: ['**Revenue**', `**${n0(A26.revenue)}**`, ...bld.map(r => `**${n0(r.rev)}**`)] },
      ['EBITDA margin', '12.1%', '{{F.ebitdaMargin.0|pct}}', '{{F.ebitdaMargin.1|pct}}', '{{F.ebitdaMargin.2|pct}}'],
      ['Capacity at year-end (company plan)', '994,000', '994,000', '~1,070,000 (Pune Phase 2, CY28)', '~1,070,000'],
    ], source: 'Company; GAM estimates (assumptions.json "build"); model and build agree on volume' } },
    { callout: `**Our view:** domestic +9% in FY27E (the middle of guidance; Sep-Mar needs ~+7% on a high base) and +10% / +8% in FY28-29E. That keeps Hyundai's share near 12.5-13% if the industry grows 6-8%. The street is a little more optimistic (JM: domestic +8.5% / +8.2%; MOSL volume CAGR ~9% incl. exports). The swing factor is Bayon: a hit like the Creta (~30% of its segment) would add share; a launch that mainly takes Creta buyers would not.` },
  ],
};

const exportsCh = {
  id: 'exports', nav: 'Exports', kicker: 'Market: exports', title: 'Exports: a quarter of volume, record FY26, then the West Asia shock',
  blocks: [
    { p: `Exports were ${n0(A26.exports)} vehicles in FY26 (+16.4%, against a 7-8% guide) and ₹${n0(A26.vehExportCr)} cr of vehicle revenue (+21%), helped by a push into Central and South America and by the new Venue, which HMC now sources from India. Then the US-Iran conflict disrupted shipping to the Middle East, a key export region (Nirmal Bang calls the exposure 'meaningful'), from the end of FY26: Q1FY27 exports fell 19.6% to ${n0(QK[4].exports)}; July recovered to 21,150 (+31%, the highest in over 100 months) but August fell to 11,400 (−31%) on logistics. Apr-Aug exports were ~${n0(MO.ytd.exports)}, about ${pc(MO.ytd.exports / MO.ytd.exportsPrior * 100 - 100)}. Export prices are rising (ASP +7% YoY in Q1FY27) as the rupee weakens and the mix moves to SUVs (only 13-14% of exports are SUVs today, vs 70% at home).` },
    { pair: [
      { type: 'column', title: 'Export volumes by quarter: 51k peak in Q2FY26', unit: 'Export volumes (vehicles)', x: QL, series: [{ name: 'Exports', values: SQ.map(q => q.exports), fmt: 'num' }], labels: 'all', source: 'Investor presentations' },
      { type: 'column', title: 'Exports\' share of revenue: 22% → 26% in FY26', unit: 'Exports, % of revenue', x: ['FY24', 'FY25', 'FY26', 'Q1FY27'], series: [{ name: 'Export share', values: [22.3, 22.0, 25.6, 23.8], fmt: 'pct' }], labels: 'all', source: 'Investor presentations (Other Key Metrics)' },
    ] },
    { callout: '**Our view:** management still guides 8-10% export growth for FY27 and promises to beat 48,000 a quarter, but Apr-Aug is ~12% down and shipping to the Gulf is still disrupted. We model flat exports in FY27E (H2 +12% on a weak FY26 base) and +10% / +8% after that. Exports earn higher prices than domestic sales and are part of the bull case, but they are also the most uncertain line in our model.' },
  ],
};

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: a strong parent and export base, but no moat in Indian SUVs',
  blocks: [
    { verdicts: D.moat.map(r => r.map(rup)), head: ['Dimension', 'Verdict', 'Evidence', 'So what'], title: 'Moat scorecard', source: 'GAM research compilation (company filings and calls, SIAM, Autocar Pro, broker notes to Sep-2026)' },
    { callout: '**Honest verdict:** Hyundai India has real advantages (a global parent\'s technology, a respected brand, a lean cost base and an export network no Indian rival has) but no moat in its home market. FY25-FY26 proved it: when M&M and Tata out-launched it, Hyundai lost two points of share in two years and slipped to #4. Its margins (12-13%) are good for a mass-market carmaker but are not protected; they depend on launches, utilisation and the parent\'s product pipeline, and they are paid for with a permanent 2.8% royalty.' },
  ],
};

module.exports = { domestic, exports: exportsCh, moat };
