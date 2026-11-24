// Vishal Mega Mart report, part 2: what the company does, history and corporate actions, industry and the tailwind test.
const X = require('./VMM.ctx');
const { C, D, BL, build, n0, n1, sa, rpsBase } = X;
const I = D.industry, B = C.business, K = C.fy26, s26 = sa('FY26'), s22 = sa('FY22');

const business = {
  id: 'business', nav: 'What VMM does', kicker: 'The business', title: 'A one-stop value store for small-town families: 74% own brands, all stores leased, ~17,000 sq ft each',
  blocks: [
    { p: `Vishal Mega Mart sells a family's everyday needs under one roof at low prices: apparel (${B.categoriesFY26.apparelPct}% of FY26 revenue: men's, women's and children's clothing, footwear), general merchandise (${B.categoriesFY26.gmPct}%: kitchenware, home furnishings, household essentials, toys, travel goods, small appliances) and FMCG (${B.categoriesFY26.fmcgPct}%: staples, packaged food, home and personal care). Its customers are middle- and lower-middle-income households; FMCG brings them in often, apparel and GM earn the margin. ${B.ownBrandsPct.FY26}% of FY26 revenue came from 26 own brands (two above ₹1,000 cr of sales, six above ₹500 cr): 100% of apparel, ~73-74% of GM and ~60% of FMCG volume. Own brands let VMM undercut national brands (FMCG 30-50% cheaper than market leaders, CEO) while earning more per item (~10pp more margin in FMCG, 3-4pp in GM: analyst meet, Sep-2026).` },
    { p: `At Mar-26 it had ${K.storesClose} stores in ${K.cities} cities (${Q1n()} at Jun-26) and ${K.areaMnSqft} mn sq ft of retail space; ~74% of stores are in Tier 2 and smaller towns, the north and east are home ground (~63% of stores) and the south is the fastest-growing region (47 of FY26's 105 openings). Every store is leased on long contracts with ~15% rent escalation every three years (CFO). Goods move from one central DC and 17 third-party regional warehouses; a four-hub network is being built. A loyalty programme with ${B.loyaltyCustomersMn.Q1FY27} mn members accounts for ~95% of revenue, and VMM's own app delivers from ${'767'} stores (~5% of revenue, cash break-even). ${B.formats}` },
    { exhibit: { type: 'table', title: 'Our store build: FY26 and FY27E-29E', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E', 'Basis'], wide: [5], rows: [
      ['Net stores added', String(K.netAdds), ...build.map(r => String(r.adds)), '~100 large stores a year + small formats (management, Sep-2026)'],
      ['Stores at year end', String(K.storesClose), ...build.map(r => String(r.stores)), ''],
      ['Retail area at year end (mn sq ft)', n1(BL.base.areaClose), ...build.map(r => n1(r.area)), `${BL.sqftPerNetStore * 1000}k sq ft per net store (FY26 13.0k, Q1FY27 14.6k)`],
      ['Effective (average) area (mn sq ft)', n1(BL.base.areaEff), ...build.map(r => n1(r.eff)), `Opening + ${BL.phasing * 100}% of additions (openings spread through the year)`],
      ['Revenue per effective sq ft (₹)', n0(rpsBase), ...build.map(r => n0(r.rps)), `+${BL.revPerSqftGrowth.join('% / +')}%: SSSG of ~8.5-9% less young-store drag`],
      { hl: true, cells: ['**Revenue (= model)**', `**${n0(K.revenue)}**`, '**{{F.sales.0|num}}**', '**{{F.sales.1|num}}**', '**{{F.sales.2|num}}**', 'Effective area × revenue per sq ft'] },
      { hl: true, cells: ['**EBITDA margin (Screener basis)**', `**${n1(X.A.ebitdaMargin[X.b])}%**`, '**{{F.ebitdaMargin.0|pct}}**', '**{{F.ebitdaMargin.1|pct}}**', '**{{F.ebitdaMargin.2|pct}}**', 'After Ind AS 116 and ESOP; bank charges in finance cost'] },
    ], source: 'AR FY26; FY26 and Q1FY27 presentations; analyst meet (HSIE 25-Sep-2026); GAM estimates (assumptions.json "build", checked against the model in VMM.ctx.js)' } },
  ],
};
function Q1n() { return String(C.q1fy27.stores); }

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'From a bankrupt founder business to a PE-built listed chain: two owners, one IPO for sale, two big block deals',
  blocks: [
    { p: 'The Vishal name belongs to a chain that grew on debt in the 2000s and ran into distress by 2010. In 2011 TPG Capital and the Shriram Group bought its core business; the old listed company carried on as V2 Retail, now a competitor. In 2018 Kedaara Capital and Partners Group bought VMM for ~₹5,000 cr through Samayat Services LLP, which is why ₹4,284 cr of goodwill sits on the balance sheet. Under CEO Gunender Kapur (ex-HUL) the business pushed own brands, added FMCG and roughly doubled its store count. The Dec-2024 IPO was a pure offer for sale: the company received no money, and the sponsor has since sold down in two large blocks.' },
    { exhibit: { type: 'table', title: 'Corporate actions and what they did to the numbers', head: ['When', 'What happened', 'Source'], wide: [1], rows: C.history.map(h => [h.year, h.event, h.src]), source: 'AR FY26; HSIE initiation (13-Apr-2026, from the RHP); press reports as cited' } },
    { callout: '**Impact on the numbers:** none of these events changed the operating accounts (no acquisitions or demergers since 2020), but they matter for the stock: the share count rises only through ESOPs (450.9 cr shares in Apr-2024, 468.4 cr in Jun-2026; 5.6 cr options still outstanding), the goodwill halves reported ROE, and the sponsor\'s remaining 40.1% is the main supply risk.' },
  ],
};

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Indian retail: ~₹70 trn and still ~80% unorganised; value retail in small towns is the fastest-growing corner, and the most crowded',
  blocks: [
    { p: I.size },
    { bullets: [
      `**Value retail is booming, and crowding.** ${I.valueRetail}`,
      `**DMart is a neighbour, not the main rival.** ${I.dmartOverlap}`,
      `**Quick commerce matters less in VMM's towns.** ${I.quickCommerce}`,
      `**Whitespace.** ${I.whitespace}`,
      '**Apparel is the contested category.** Trent\'s Zudio, V2 Retail, V-Mart and Baazar Style Retail all target the same young, value-seeking shopper in Tier 2-3 towns; management says no new competitor or step-up in expansion pace appeared in Q1FY27 (CEO, 23-Jul-2026).',
    ] },
    { callout: '**What matters for VMM:** the shift from unorganised to organised retail in small towns has years to run, and VMM\'s mix (FMCG traffic plus own-brand apparel and GM) is hard to copy. But apparel, its biggest and most profitable category, is where the new value chains are expanding fastest.' },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Does the tailwind reach VMM? Yes: formalisation and down-trading show up in its same-store growth',
  blocks: [
    { exhibit: { type: 'table', title: 'Four tailwinds, tested', head: ['Tailwind', 'Evidence it is real', 'Does it reach VMM?', 'Catch'], wide: [1, 3], rows: [
      ['Unorganised to organised retail in small towns', 'Organised retail projected ~20% a year to CY2028 vs ~9% for all retail (AR FY26 MD&A)', `Yes: revenue +${s26.revenueGrowthPct}% in FY26; 77 new cities added in FY26`, 'Competitors open in the same towns (V2 Retail +73% area in Q1FY27)'],
      ['Aspiration and premiumisation', 'Entry price points fell from 60% of sales four years ago to 20%; fashion price points grew 13.9% SSSG in Q1FY27', 'Yes: SSSG 10-13% with ~2% from trading up (FY26)', 'Higher price points face Zudio and branded value chains'],
      ['Down-trading in inflation', 'Own-brand FMCG 30-50% below leaders; 7-8% more customers in Q1FY27', 'Yes, in the past (Ukraine-war cotton spike) and so far in FY27', 'VMM absorbs part of the cost: margin risk if inflation persists'],
      ['Income-tax cuts and GST rate reductions', 'CEO credits them for the Q4FY26 SSSG spike (13.2%)', 'Yes, mechanically: lower prices, more disposable income', 'One-off step-ups, not a recurring tailwind'],
    ], source: 'AR FY26; FY26 and Q1FY27 calls; HSIE analyst-meet note (25-Sep-2026); MOSL sector update (25-Sep-2026)' } },
    { callout: `**Verdict:** the tailwinds reach VMM, and its numbers show it: SSSG has stayed at 10-13% while DMart's fell to 5.5%, and revenue per sq ft rose from ₹${n0(sa('FY23').revPerAvgSqft)} (FY23) to ₹${n0(s26.revPerAvgSqft)} (FY26). The risk is not the tailwind but how many others share it in the same towns.` },
  ],
};

module.exports = { business, history, industry, tailwind, s22 };
