// Wipro report, part 2b: IT Services by SMU and sector (with our US-dollar build), and deals & people (KPIs).
const X = require('./WIPRO.ctx');
const { C, F, n0, n1, pc, pc1, Q1, FY26, QR, UB, SMU, SMU_NAME, smuUsd, usdF, usdGrowth, mixF } = X;
const MX = C.smuMixQuarterly.rows, QQ = QR.slice(1);
const a = (fy) => C[fy];

const smu = {
  id: 'smu', nav: 'Markets & sectors', kicker: 'Where the revenue comes from', title: 'Markets and sectors: the Americas are shrinking; Europe and APMEA grow, partly through acquisitions',
  blocks: [
    { p: `Wipro runs its client business through four Strategic Market Units (SMUs). **Americas 1** (35% of revenue: technology, communications, media, health and consumer clients in the US, Canada and Latin America) was flat in Q1FY27; technology & communications grew 10.8% but US health insurers and hospitals cut budgets (health −3.0% YoY). **Americas 2** (25%: banks, insurers, capital markets, energy and manufacturing) is the problem: −6.7% YoY in Q4FY26 and −7.3% in Q1FY27, on delayed ramp-ups of large banking deals and a client-specific loss that management says ended in Q1. **Europe** (27%) grew 6% YoY on banking deal ramps and DTS; **APMEA** (12%) grew 13.5%, helped by Mindsprint (Olam, Singapore) from May-2026. Europe and APMEA earned 12.7% and 14.6% segment margins in FY26 against 21.3% and 18.7% in the Americas, so the mix shift itself costs margin.` },
    { pair: [
      { type: 'stacked', title: 'Europe and APMEA are taking a bigger share', unit: 'SMU mix (% of IT Services revenue, restated)', x: MX.map(r => r.q), series: [{ name: 'Americas 1', values: MX.map(r => r.americas1), fmt: 'n1' }, { name: 'Americas 2', values: MX.map(r => r.americas2), fmt: 'n1' }, { name: 'Europe', values: MX.map(r => r.europe), fmt: 'n1' }, { name: 'APMEA', values: MX.map(r => r.apmea), fmt: 'n1' }], minLabel: 8, source: 'Wipro Q1FY27 datasheet' },
      { type: 'hbar', title: 'Q1FY27: technology grew, energy/manufacturing and health shrank', unit: 'Year-on-year growth by sector, constant currency (%)', x: ['Technology & communications', 'BFSI', 'Consumer', 'Health', 'Energy, manufacturing & resources'], series: [{ name: 'YoY CC', values: [Q1.sectorYoyCcPct.techComms, Q1.sectorYoyCcPct.bfsi, Q1.sectorYoyCcPct.consumer, Q1.sectorYoyCcPct.health, Q1.sectorYoyCcPct.emr], fmt: 'pct' }], labels: 'all', source: 'Wipro Q1FY27 datasheet' },
    ] },
    { h: 'Our US-dollar build' },
    { p: `We forecast IT Services revenue in dollars by SMU, then convert at our rupee path (₹${UB.inrUsd.join(' / ')} per $ for FY27-29E; ₹87.91 realised in FY26, ₹93.53 in Q1FY27, ₹94.50 in the Q2 guide). We assume no cross-currency effect. FY27E dollar revenue of $${n0(usdF[0])} mn (${pc1(usdGrowth[0])}) includes ~3 pp from DTS (eight more months) and Mindsprint (from May), so the underlying business shrinks ~3%. FY28E and FY29E (${pc1(usdGrowth[1])}, ${pc1(usdGrowth[2])}) assume no acquisitions, a slow recovery in Americas banking and 2-3% a year of AI price deflation. The build is checked against model revenue in our authoring script.` },
    { exhibit: { type: 'table', title: 'US-dollar build: IT Services revenue by SMU ($ million)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E', 'Growth FY27E / 28E / 29E'], rows: [
      ...SMU.map(k => [SMU_NAME[k], n0(smuUsd[k][0]), n0(smuUsd[k][1]), n0(smuUsd[k][2]), n0(smuUsd[k][3]), UB.growthPct[k].map(pc1).join(' / ')]),
      { hl: true, cells: ['**IT Services ($ mn)**', `**${n0(UB.base.itsUsdM)}**`, `**${n0(usdF[0])}**`, `**${n0(usdF[1])}**`, `**${n0(usdF[2])}**`, `**${usdGrowth.map(pc1).join(' / ')}**`] },
      ['INR per US$ (realised)', '87.91', ...UB.inrUsd.map(v => v.toFixed(1)), ''],
      ['IT Services revenue (₹ cr)', n0(FY26.itsRevInrM / 10), ...usdF.map((u, i) => n0(u * UB.inrUsd[i] / 10)), ''],
      ['IT Products and Ind AS reconciliation (₹ cr)', n0(92624 - FY26.itsRevInrM / 10), ...UB.itProductsAndReconCr.map(n0), ''],
      { hl: true, cells: ['**Revenue from operations (₹ cr)**', '**92,624**', '**{{F.sales.0|num}}**', '**{{F.sales.1|num}}**', '**{{F.sales.2|num}}**', '**{{F.salesGrowth.0|chg}} / {{F.salesGrowth.1|chg}} / {{F.salesGrowth.2|chg}}**'] },
      ['Memo: SMU mix FY29E (A1 / A2 / Europe / APMEA)', `${FY26.smuMixPct.americas1} / ${FY26.smuMixPct.americas2} / ${FY26.smuMixPct.europe} / ${FY26.smuMixPct.apmea}`, '', '', SMU.map(k => n1(mixF(2)[k])).join(' / '), ''],
    ], source: 'Wipro datasheets (FY26 base, SMU mix restated); GAM estimates. The reconciliation line is IT Products (₹694 cr in FY26) less FX gains included in segment revenue (₹185 cr), which Ind AS books in other income.' } },
    { callout: '**So what:** the dollar line is the honest measure of Wipro\'s business, and on our numbers it is roughly where it was in FY22 by FY29E. Rupee revenue still grows 4-7% a year because the rupee keeps falling. That flatters reported growth and margins, but it is not something Wipro controls, and a stronger rupee would cut our FY28E EPS by ~2.5% for every 1% move (our estimate: ~30 bp of margin plus the smaller rupee revenue base).' },
  ],
};

const rpe = fy => { const r = a(fy); return r ? r.itsUsdM : null; };
const people = {
  id: 'people', nav: 'Deals & people', kicker: 'Leading indicators', title: 'Deals and people: bookings are decent, but fewer people are doing the work',
  blocks: [
    { p: `Two sets of numbers tell us where revenue is heading. **Bookings** (total contract value signed) were strong in FY26: $16.4 bn, with $7.8 bn of large deals (+45% CC), a book-to-bill of ~1.6x. But they were front-loaded (H1FY26 $9.7 bn) and slowed to $3.3-3.5 bn a quarter since; Q1FY27's $3.37 bn was 32% below a year earlier, with some decisions slipping into Q2. Large cost-takeout and vendor-consolidation deals convert slowly and at low margins, and they include productivity give-backs. **People**: headcount was ~233,000 for two years, jumped to ~242,000 with DTS (Q3FY26) and to 243,044 with Mindsprint, but fell ~2,500 in Q1FY27 excluding Mindsprint. Utilisation is 83-84% (87.7% in Q1FY25), attrition is a manageable 13.9%. Revenue per average employee fell from ~$45,100 (FY25) to ~$44,100 (FY26).` },
    { pair: [
      { type: 'column', title: 'Headcount: flat organically; acquisitions added ~10,000', unit: 'Closing headcount', x: QR.map(q => q.q), series: [{ name: 'Headcount', values: QR.map(q => q.headcount), fmt: 'num' }], labels: 'ends', min: 200000, source: 'Wipro datasheets' },
      { type: 'line', title: 'Utilisation down from 88% to 84%; attrition steady at ~14%', unit: '%', x: QQ.map(q => q.q), series: [{ name: 'Net utilisation', values: QQ.map(q => q.utilPct), fmt: 'pct' }, { name: 'Voluntary attrition (TTM)', values: QQ.map(q => q.attrPct), fmt: 'pct' }], labels: 'last', min: 0, max: 100, source: 'Wipro datasheets' },
    ] },
    { exhibit: { type: 'table', title: 'Operating KPIs', head: ['', 'FY24', 'FY25', 'FY26', 'Q1FY27'], rows: [
      ['IT Services revenue ($ mn)', n0(C.fy24.itsUsdM), n0(C.fy25.itsUsdM), n0(FY26.itsUsdM), n0(Q1.itsUsdM)],
      ['Constant-currency growth (YoY)', `${C.fy24.itsCcGrowthPct}%`, `${C.fy25.itsCcGrowthPct}%`, `${FY26.itsCcGrowthPct}%`, `+${Q1.yoyCcPct}%`],
      ['IT Services EBIT margin', `${C.fy24.itsMarginPct}%`, `${C.fy25.itsMarginPct}%`, `${FY26.itsMarginPct}%`, `${Q1.itsMarginPct}%`],
      ['Total bookings ($ mn) / large deals ($ mn)', `${n0(C.fy24.bookingsUsdM)} / ${n0(C.fy24.largeDealsUsdM)}`, `${n0(C.fy25.bookingsUsdM)} / ${n0(C.fy25.largeDealsUsdM)}`, `${n0(FY26.bookingsUsdM)} / ${n0(FY26.largeDealsUsdM)}`, `${n0(Q1.bookingsUsdM)} / ${n0(Q1.largeDealsUsdM)}`],
      ['Book-to-bill (bookings ÷ revenue)', n1(C.fy24.bookingsUsdM / C.fy24.itsUsdM) + 'x', n1(C.fy25.bookingsUsdM / C.fy25.itsUsdM) + 'x', n1(FY26.bookingsUsdM / FY26.itsUsdM) + 'x', n1(Q1.bookingsUsdM / Q1.itsUsdM) + 'x'],
      ['Closing headcount', n0(C.fy24.headcount), n0(C.fy25.headcount), n0(FY26.headcount), n0(Q1.headcount)],
      ['Revenue per average employee ($ \'000)', '–', n1(rpe('fy25') / ((C.fy24.headcount + C.fy25.headcount) / 2) * 1000), n1(rpe('fy26') / ((C.fy25.headcount + FY26.headcount) / 2) * 1000), n1(Q1.itsUsdM * 4 / ((FY26.headcount + Q1.headcount) / 2) * 1000) + ' (annualised)'],
      ['Net utilisation / voluntary attrition', `${C.fy24.utilisationPct}% / ${C.fy24.attritionPct}%`, `${C.fy25.utilisationPct}% / ${C.fy25.attritionPct}%`, `${FY26.utilisationPct}% / ${FY26.attritionPct}%`, `${Q1.utilisationPct}% / ${Q1.attritionPct}%`],
      ['Clients above $100 mn a year', String(C.fy24.clients100mPlus), String(C.fy25.clients100mPlus), String(FY26.clients100mPlus), '16'],
    ], source: 'Wipro datasheets Q4FY25, Q4FY26, Q1FY27; AR FY26 key ratios; GAM calculations' } },
    { callout: '**What it means:** the fall in $100 mn+ clients from 22 to 16 in two years matters more than any single quarter: Wipro\'s biggest relationships are shrinking, and the large deals it wins are mostly cost-takeout contracts that replace old revenue at lower prices. Bookings need to stay above ~$4 bn a quarter for revenue to grow; they have not since Q2FY26.' },
  ],
};

module.exports = { smu, people };
