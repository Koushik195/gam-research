// Vishal Mega Mart report, part 3: the store engine, categories and own brands, and the moat scorecard.
const X = require('./VMM.ctx');
const { C, SA, SQ, sa, sq, n0, n1, build, BL, rpsBase, Q1 } = X;
const B = C.business, yrs = SA.filter(r => r.fy >= 'FY23');

const stores = {
  id: 'stores', nav: 'The store engine', kicker: 'Stores', title: 'The store engine: area +10-11% a year and revenue per sq ft +9-10%, the two halves of ~20% growth',
  blocks: [
    { p: `VMM opened 105 stores in FY26 (6 closures, 99 net) and 27 in Q1FY27 (3 closures), reaching ${Q1.stores} stores and ${n1(Q1.areaMnSqft)} mn sq ft at Jun-26 and ~833 by the Sep-2026 analyst meet. Growth comes in two ways. First, new towns: 77 new cities in FY26, with the south (Kerala, Andhra Pradesh, Karnataka) taking 47 openings and Gujarat and Maharashtra performing in line with the network (CEO, May-2026). Second, density: in UP and Haryana, where VMM has tapped ~85% of its target shoppers, it now opens ~8,000 sq ft small stores that earn the same revenue per sq ft and ROCE as large ones (16 at Jun-26). Management guides ~100 large stores a year and sees ~1,200 more large-store sites (~2,000 in all) plus ~4,000 small ones.` },
    { p: `Productivity is the other half. Revenue per average sq ft rose from ₹${n0(sa('FY23').revPerAvgSqft)} in FY23 to ₹${n0(sa('FY26').revPerAvgSqft)} in FY26 (+${sa('FY24').revPerSqftGrowthPct}% / +${sa('FY25').revPerSqftGrowthPct}% / +${sa('FY26').revPerSqftGrowthPct}%), on SSSG of 13.6% / 12.3% / 11.0%. Legacy stores (5+ years old) grow at double digits too (CEO), so the network is not living off new openings. The average store is shrinking (18.3k sq ft in FY23, 16.9k at Mar-26) as small formats are added and over-sized Karnataka stores were cut back, which lifted their sales per sq ft. Refurbished stores gain 10-15% in sales (Jefferies, Sep-2026).` },
    { pair: [
      { type: 'column', title: 'Retail area: 9.1 mn sq ft in FY22, 13.45 mn in FY26', unit: 'Retail area at year end (mn sq ft)', x: [...SA.map(r => r.fy), ...build.map(r => r.y)], series: [{ name: 'Area', values: [...SA.map(r => r.areaMnSqft), ...build.map(r => Math.round(r.area * 100) / 100)], fmt: 'n1' }], labels: 'all', source: 'Company KPI tables; GAM estimates FY27-29E' },
      { type: 'line', title: 'Revenue growth = area growth + productivity growth', unit: 'Growth y/y (%)', x: yrs.slice(1).map(r => r.fy), series: [{ name: 'Revenue', values: yrs.slice(1).map(r => r.revenueGrowthPct), fmt: 'pct' }, { name: 'Average retail area', values: yrs.slice(1).map(r => r.areaGrowthPct), fmt: 'pct' }, { name: 'Revenue per sq ft', values: yrs.slice(1).map(r => r.revPerSqftGrowthPct), fmt: 'pct' }], labels: 'all', source: 'Company; GAM calculation' },
    ] },
    { exhibit: { type: 'table', title: 'Quarterly store business', head: ['Quarter', 'Revenue (₹ cr)', 'y/y', 'SSSG', 'Gross margin', 'Op. EBITDA margin', 'Stores', 'Net added', 'Area (mn sq ft)', 'Sales/sq ft/month (₹)'], rows: SQ.map(q => [q.q, n0(q.revenue), q.revenueYoY != null ? q.revenueYoY + '%' : '–', q.sssgPct + '%', q.grossMarginPct + '%', q.operatingMarginPct + '%', String(q.stores), String(q.netAdds), n1(q.areaMnSqft), n0(q.monthlySalesPerSqft)]), source: 'Company presentations (SSSG adjusted; operating EBITDA before Ind AS 116 and ESOP); area Q1-Q3FY25 and monthly sales per sq ft per MOSL sector update (25-Sep-2026)' } },
    { callout: `**What we assume:** ${BL.netAdds.join(' / ')} net additions in FY27-29E at ${BL.sqftPerNetStore * 1000}k sq ft each, so effective area grows ${build.map(r => n1(r.effG)).join('% / ')}%, and revenue per effective sq ft +${BL.revPerSqftGrowth.join('% / +')}% (₹${n0(rpsBase)} in FY26 to ₹${n0(build[2].rps)} in FY29E), below the 9-10% of FY25-26 because we assume SSSG of ~8.5-9% rather than management's double-digit target. Each 1pp of revenue per sq ft growth is ~₹${n0(build[1].rev / 100)} cr of FY28E revenue.` },
  ],
};

const q1 = sq('Q1FY27'), q1a = sq('Q1FY26');
const categories = {
  id: 'categories', nav: 'Categories & own brands', kicker: 'Categories', title: 'Three categories, one formula: FMCG brings shoppers in, own-brand apparel and GM earn the margin',
  blocks: [
    { p: `Apparel is the anchor: ₹${n0(sa('FY26').apparel)} cr in FY26 (${sa('FY26').apparelPct}%), all own brands, with fashion price points growing fastest (14.7% SSSG in Q4FY26, 13.9% in Q1FY27 vs 11.1% for entry price points). General merchandise (₹${n0(sa('FY26').gm)} cr) is household essentials (~35%), furnishings (~25%) and a long tail of toys, footwear, appliances and travel goods; Tandem kitchen appliances hold about half of that category. FMCG (₹${n0(sa('FY26').fmcg)} cr) grew fastest over FY22-26 (25% a year vs 23% for the group): own brands are ~60% of FMCG volume but only ~35% of value, because they are priced far below national brands. VMM does not make own brands in indulgence categories (chocolates, soft drinks); its FMCG is made by large contract manufacturers.` },
    { pair: [
      { type: 'column', title: 'Category growth in Q1FY27: all three +18-19%', unit: 'Revenue (₹ crore)', x: ['Apparel', 'General merchandise', 'FMCG'], series: [{ name: 'Q1FY26', values: [q1a.apparel, q1a.gm, q1a.fmcg], fmt: 'num' }, { name: 'Q1FY27', values: [q1.apparel, q1.gm, q1.fmcg], fmt: 'num' }], labels: 'all', source: 'Q1FY27 presentation' },
      { type: 'line', title: `Own brands: ${B.ownBrandsPct.FY22}% of revenue in FY22, ${B.ownBrandsPct.Q1FY27}% in Q1FY27`, unit: 'Own-brand share of revenue (%)', x: Object.keys(B.ownBrandsPct), series: [{ name: 'Own brands', values: Object.values(B.ownBrandsPct), fmt: 'pct' }], labels: 'all', min: 60, max: 80, source: 'Company KPI tables and presentations' },
    ] },
    { callout: '**So what:** the mix gives VMM something pure apparel chains lack (weekly footfall from FMCG) and something grocers lack (a 28-29% gross margin and apparel\'s higher margins). Seasonality follows apparel: Q2 is weak (monsoon, pre-festive), Q3 strong (festivals, winter wear). The digital channel is 70% grocery and dilutes gross margin, but 20% of its customers are new to VMM.' },
  ],
};

const moatRows = [
  ['Cost leadership', 'Strong', 'Lowest retailing cost per sq ft among value retailers (FY25 ₹1,794, 19.4% of revenue, vs V-Mart ₹2,406, DMart ₹2,370: HSIE); net trade working capital ~15 days', 'Lets VMM keep entry prices low and still earn ~10% pre-Ind AS EBITDA'],
  ['Own brands', 'Strong', '74% of revenue; 26 brands, two above ₹1,000 cr; FMCG 30-50% below leaders with ~10pp more margin', 'Price edge customers can see on a full basket; margin cushion in inflation'],
  ['Reach in small towns', 'Moderate', `${Q1.stores} stores in ${Q1.cities} cities, ~74% Tier 2 and below; ~85% of towns have one VMM store`, 'First-mover in many towns, but nothing stops rivals opening next door'],
  ['Data and loyalty', 'Moderate', '175 mn loyalty members, ~95% of revenue identified; 20% of app customers are new to VMM', 'Better assortment and targeting; not a barrier by itself'],
  ['Pricing power', 'Weak', 'By design: gross-margin gains are reinvested in price; apparel competition from Zudio, V2 Retail, V-Mart', 'Margins rise only through operating leverage'],
];
const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: a real cost and own-brand moat; no pricing power, and rivals are moving into the same towns',
  blocks: [
    { verdicts: moatRows, head: ['Dimension', 'Verdict', 'Evidence', 'So what'], title: 'Moat scorecard', source: 'HSIE initiation (13-Apr-2026) and analyst-meet note (25-Sep-2026); Jefferies via Business Today (24-Sep-2026); company calls' },
    { callout: '**Honest verdict:** VMM has a narrow but genuine moat: it runs value stores in small towns more cheaply than anyone listed, and its own brands make the price gap visible. The evidence is SSSG of 10% or more in eight of the last nine quarters (9.6% in the ninth, festival-adjusted) while competitors expanded. It does not have pricing power, and the moat is operational (execution, sourcing, data), so it must be re-earned every season; a determined rival with deep pockets (Reliance, Trent) could erode it town by town.' },
  ],
};

module.exports = { stores, categories, moat };
