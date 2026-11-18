// Asian Paints report, part 2b: the two modelled lines - standalone (decorative India, kitchens, bath) and
// subsidiaries & consolidation (international, Asian Paints PPG industrial coatings, home decor).
const X = require('./ASIANPAINT.ctx');
const { F, n0, n1, pc, SA, SQ, QL, A26, A25, A24, A22, A21, A20, Q1, FY26, DT } = X;
const sq = q => SQ.find(x => x.q === q);

const deco = {
  id: 'deco', nav: 'Decorative India (standalone)', kicker: 'Business line', title: 'Decorative India: volumes up 9%, prices up on costs, margins at the mercy of inputs and rivals',
  blocks: [
    { pair: [
      { type: 'column', title: 'Standalone revenue by quarter: +17% in Q1FY27', unit: 'Standalone revenue from operations (₹ crore)', x: QL, series: [{ name: 'Standalone', values: SQ.map(q => q.saRev), fmt: 'num' }], labels: 'all', source: 'Screener.in standalone results' },
      { type: 'column', title: 'Decorative volume growth by quarter', unit: 'Decorative India volume growth, year on year (%)', x: DT.map(q => q.q), series: [{ name: 'Volume', values: DT.map(q => q.volumePct), fmt: 'pct' }], labels: 'all', source: 'Company calls and decks' },
    ] },
    { bullets: [
      `**What it is.** Asian Paints Ltd itself: decorative paints in India (~97% of it), plus kitchens and bath fittings. Revenue ₹${n0(A26.saRev)} cr in FY26, ${Math.round(A26.saRev / A26.consRev * 100)}% of the group; it grew only ${n1((Math.pow(A26.saRev / A21.saRev, 1 / 5) - 1) * 100)}% a year since FY21 because FY22-23's price-led jump was followed by three flat years.`,
      `**Margins track inputs and competition.** Standalone EBITDA margin: ${SA.map(a => `${a.fy} ${n1(a.saMarginPct)}%`).join(', ')}. FY22 was the last input spike; FY25 was price cuts and competition; FY26 recovered on deflation. Standalone gross margin hit a record 45.6% in Q4FY26.`,
      `**Q1FY27.** Revenue +${n1(Q1.saRevenueYoYPct)}% (volume +9%, value +16.6%: ~7% weighted price plus ~3% better mix); gross margin ${Q1.saGrossMarginPct}% (+66 bp) and EBITDA margin ${Q1.saEbitdaMarginPct}% (+259 bp) on low-cost inventory and cost cuts. Material inflation was ~25%.`,
      '**Pricing.** ~10.4% cumulative increase by end-May 2026 (Q4FY26 deck) and further rises in June; dealers cite ~13-14% at list level. Management expects ~8-9% pricing benefit in Q2, no further increases unless costs become "alarming", and has flagged possible price changes in H2 if inputs ease.',
      '**Kitchen and bath** (inside standalone): kitchen revenue ₹108 cr in Q1FY27 (+10%), loss near break-even; bath ₹85 cr (−4%), loss ₹9 cr. Together ~₹750 cr a year after more than a decade: not a growth driver.',
    ] },
    { callout: `**Our view:** we model standalone revenue {{as.segments.0.growth.0|chg}} in FY27E (volume ~9%, price and mix ~5% after possible H2 give-backs), then {{as.segments.0.growth.1|chg}} and {{as.segments.0.growth.2|chg}}, with EBITDA margin of {{as.segments.0.marginPct.0}}% / {{as.segments.0.marginPct.1}}% / {{as.segments.0.marginPct.2}}% against ${n1(A26.saMarginPct)}% in FY26 and ${n1(A24.saMarginPct)}% in FY24. The risk is not volume; it is that competitors keep discounting while inputs stay high, as in FY22 (${n1(A22.saMarginPct)}%) and FY25 (${n1(A25.saMarginPct)}%).` },
  ],
};

const subs = {
  id: 'subs', nav: 'International, industrial & decor', kicker: 'Business line', title: 'International and industrial are growing well; home decor still loses money',
  blocks: [
    { pair: [
      { type: 'column', title: 'Subsidiaries & consolidation: revenue by quarter', unit: 'Consolidated less standalone revenue (₹ crore)', x: QL, series: [{ name: 'Revenue', values: SQ.map(q => q.subRev), fmt: 'num' }], labels: 'all', source: 'Screener.in; GAM Research' },
      { type: 'column', title: 'Their EBITDA margin: 9-12%', unit: 'Consolidated less standalone EBITDA margin (%)', x: QL, series: [{ name: 'Margin', values: SQ.map(q => q.subMarginPct), fmt: 'pct' }], labels: 'all', min: 0, source: 'Screener.in; GAM Research' },
    ] },
    { exhibit: { type: 'table', title: 'Business lines outside decorative India, Q1FY27 vs Q1FY26 (₹ crore)', head: ['Business', 'Revenue Q1FY26', 'Revenue Q1FY27', 'Growth', 'PBT Q1FY26', 'PBT Q1FY27'], rows: [
      ['International (AP Global)', n0(Q1.prior.intlRevenue), n0(Q1.intlRevenue), pc(Q1.intlRevenueYoYPct), n0(Q1.prior.intlPbt), n0(Q1.intlPbt)],
      ['Asian Paints PPG (protective, powder; consolidated)', '307', n0(Q1.apppgRevenue), pc(Q1.apppgYoYPct), '25', n0(Q1.apppgPbt)],
      ['PPG Asian Paints (auto OE; associate)', '575', n0(Q1.ppgapRevenue), pc(Q1.ppgapYoYPct), '97', n0(Q1.ppgapPbt)],
      ['Kitchen (in standalone)', '98', n0(Q1.kitchenRevenue), pc(Q1.kitchenYoYPct), '−9', '~0'],
      ['Bath (in standalone)', '89', n0(Q1.bathRevenue), pc(Q1.bathYoYPct), n0(Q1.bathPbtPy), n0(Q1.bathPbt)],
      ['White Teak (lighting)', '20', n0(Q1.whiteTeakRevenue), pc(Q1.whiteTeakYoYPct), 'n.d.', 'n.d.'],
      ['Weatherseal (uPVC windows)', '15', n0(Q1.weathersealRevenue), pc(Q1.weathersealYoYPct), 'n.d.', 'n.d.'],
    ], source: 'Q1FY27 investor presentation (29-Jul-2026); PL Q1FY27 note. n.d. = not disclosed' } },
    { bullets: [
      `**International** (₹${n0(FY26.intlRevenue)} cr in FY26, PBT ₹${n0(FY26.intlPbt)} cr): Q1FY27 revenue +27% (+20% in constant currency), led by Egypt, UAE, Oman, Nepal and Bangladesh; PBT margin 7.9% (+275 bp) after exiting loss-making Indonesia in FY25. Risks: the West Asia conflict (Middle East units) and currencies (Ethiopia's devaluation cost ₹56 cr in FY25).`,
      `**Industrial coatings** (two 50:50 JVs with PPG, renewed for 15 years in FY26): Asian Paints PPG (₹${n0(FY26.apppgRevenue)} cr) grew 21% in Q1FY27 but its PBT margin fell to 6.9% because price increases to key accounts lag; PPG Asian Paints (₹${n0(FY26.ppgapRevenue)} cr, associate) grew 13.5% with a 15.7% PBT margin.`,
      `**Home decor** (White Teak ₹${n0(FY26.whiteTeakRevenue)} cr, Weatherseal ₹${n0(FY26.weathersealRevenue)} cr in FY26): net losses of ₹${n0(-FY26.whiteTeakNetLoss)} cr and ₹${n0(-FY26.weathersealNetLoss)} cr; White Teak's goodwill and intangibles were impaired in FY25 (₹202 cr) and FY26 (₹94 cr) even as the company bought the remaining 40% for ₹188 cr in Jun-2025. The white-cement plant in the UAE lost ₹43 cr in its first year.`,
    ] },
    { callout: 'We model this line\'s revenue {{as.segments.1.growth.0|chg}} in FY27E and {{as.segments.1.growth.1|chg}} a year after, with an EBITDA margin of {{as.segments.1.marginPct.0}}%: international and industrial gains offset by start-up losses. It is ~14% of revenue and ~8% of EBITDA; it cannot offset a weak decorative business.' },
  ],
};

module.exports = { deco, subs };
