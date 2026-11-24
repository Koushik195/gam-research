// DMart report, part 2: what the company does, history and corporate actions, industry and the tailwind test.
const X = require('./DMART.ctx');
const { C, D, AS, BL, build, n0, n1, sa, F } = X;
const I = D.industry, B = C.business, K = C.fy26.kpi, s26 = sa('FY26'), SUB = C.fy26.subsidiaries;
const states = Object.entries(B.storesByStateMar26);

const business = {
  id: 'business', nav: 'What DMart does', kicker: 'The business', title: 'A no-frills hypermarket chain that wins on price: owned stores, fast vendor payment, a 14-15% gross margin',
  blocks: [
    { p: `DMart sells everyday goods at the lowest prices it can sustain: foods (staples, dairy, snacks, fruit and vegetables; ${B.categoriesFY26.foods}% of FY26 revenue), non-food FMCG (home and personal care; ${B.categoriesFY26.nonFoods}%) and general merchandise and apparel (kitchenware, plastics, home textiles, garments; ${B.categoriesFY26.gma}%). Its formula is "everyday low cost, everyday low price": it owns most of its stores (no rent escalation), runs simple formats of ~40,000 sq ft, pays suppliers in about a week in return for better terms, and passes savings to shoppers rather than to margin. The result is a gross margin of only ~14-15% and an EBITDA margin of ~8%, on very high sales per sq ft (₹${n0(K.revPerSqftCompany)} in FY26 on year-end area).` },
    { p: `At Mar-26 it had ${K.stores} stores and ${n1(K.areaMnSqft)} mn sq ft in ${states.length} states and union territories, still concentrated in the west and south: ${states.slice(0, 6).map(([s, v]) => `${s} ${v}`).join(', ')}; ${K.leasedStores} stores are on long leases. ${n0(K.billCutsCr * 10)} mn bills were cut in FY26 (average bill ~₹1,683, HSIE). The listed company (standalone) is the store business: ₹${n0(s26.standaloneRev)} cr of revenue and ₹${n0(s26.standaloneEbitda)} cr of EBITDA (${n1(s26.standaloneMarginPct)}%). The subsidiaries add ₹${n0(s26.subsRev)} cr of revenue net of intra-group sales: DMart Ready (Avenue E-Commerce, online grocery, ₹${n0(SUB.dmartReady.sales)} cr of sales, EBITDA −₹${-SUB.dmartReady.ebitda} cr), Align Retail Trades (packing, ₹${n0(SUB.alignRetail.sales)} cr, mostly sold to DMart) and Avenue Food Plaza (in-store food counters, ₹${n0(SUB.foodPlaza.sales)} cr).` },
    { exhibit: { type: 'table', title: 'Our store build: FY26 and FY27E-29E', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E', 'Basis'], wide: [5], rows: [
      ['Stores added', String(K.storeAdds), ...build.map(r => String(r.adds)), '~15% of the opening base (management benchmark)'],
      ['Stores at year end', String(K.stores), ...build.map(r => String(r.stores)), ''],
      ['Retail area at year end (mn sq ft)', n1(BL.base.areaClose), ...build.map(r => n1(r.area)), `${BL.sqftPerNewStore * 1e6 / 1000}k sq ft per new store`],
      ['Effective average area (mn sq ft)', n1(BL.base.areaEff), ...build.map(r => n1(r.eff)), `Opening + ${BL.phasing * 100}% of additions (openings are back-ended)`],
      ['Revenue per effective sq ft (₹)', n0(X.rpsBase), ...build.map(r => n0(r.rps)), `${BL.revPerSqftGrowth.map(g => (g > 0 ? '+' : '') + g).join('% / ')}%: LFL less new-store dilution`],
      ['DMart stores revenue (₹ cr)', n0(BL.base.standaloneRev), ...build.map(r => n0(r.st)), 'Effective area × revenue per sq ft'],
      ['  EBITDA margin', n1(BL.base.standaloneEbitda / BL.base.standaloneRev * 100) + '%', ...build.map(r => n1(r.stM) + '%'), 'Company band 7.8-8.6% since FY20'],
      ['Subsidiaries revenue (₹ cr)', n0(BL.base.subsRev), ...build.map(r => n0(r.sub)), `+${BL.subsGrowth.join('% / +')}% (DMart Ready in 11 cities)`],
      ['  Subsidiaries EBITDA (₹ cr)', n0(BL.base.subsEbitda), ...build.map(r => n0(r.subE)), 'DMart Ready losses narrow after the city exits'],
      { hl: true, cells: ['**Revenue (sum = model)**', `**${n0(s26.consRev)}**`, '**{{F.sales.0|num}}**', '**{{F.sales.1|num}}**', '**{{F.sales.2|num}}**', ''] },
      { hl: true, cells: ['**EBITDA margin (sum = model)**', `**${n1(s26.consEbitda / s26.consRev * 100)}%**`, '**{{F.ebitdaMargin.0|pct}}**', '**{{F.ebitdaMargin.1|pct}}**', '**{{F.ebitdaMargin.2|pct}}**', ''] },
    ], source: 'AR FY26; FY26 and Q1FY27 presentations; Screener.in (standalone and consolidated); GAM estimates (assumptions.json "build", checked against the model in DMART.ctx.js)' } },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'From one Mumbai store in 2002 to 500: two equity raises, no dividends, no acquisitions',
  blocks: [
    { p: 'Radhakishan Damani, a stock-market investor, founded Avenue Supermarts in 2000 and opened the first DMart in Mumbai in 2002. The chain grew slowly and profitably in Maharashtra and Gujarat before listing in 2017; since then it has entered the south, central and north India in clusters. There have been no acquisitions, demergers or bonus issues; the share count rose only through the 2020 QIP and employee stock options, so per-share history needs no adjustment.' },
    { exhibit: { type: 'table', title: 'Corporate actions and what they did to the numbers', head: ['When', 'What happened', 'Source'], wide: [1], rows: C.history.map(h => [h.year, h.event, h.src]), source: 'Annual reports; presentations; Business Standard and Business Today (IPO and QIP)' } },
    { callout: `**Impact on the numbers:** the QIP added ~₹4,100 cr of equity in FY20 (cash that funded land purchases until FY25), which is part of why ROE fell from ~18% to ~13%. The 2026 CEO change was planned: Anshul Asawa became CEO on 1-Feb-2026 when Ignatius Navil Noronha completed his tenure, after what Mr Asawa called a well-planned transition year spent in stores and distribution centres.` },
  ],
};

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Indian retail: a ₹112 trn market, only ~13% organised, and a new channel growing far faster than stores',
  blocks: [
    { p: `${I.size} ${I.dmartShare}` },
    { bullets: [
      `**Quick commerce is the new competitor.** ${I.quickCommerce}`,
      `**Metros vs smaller towns.** ${I.metroVsTier2}`,
      '**Other formats.** Reliance Retail\'s Smart Bazaar and Vishal Mega Mart (listed Dec-2024) are the large store-based rivals Emkay tracks; Amazon (Amazon Now) and Flipkart (Flipkart Minutes) compete online and in quick commerce. Management says FMCG vendors are doubling down on DMart, often their largest single customer.',
      '**Pricing is set by MRP.** Packaged goods carry a printed maximum retail price, so shoppers compare discounts easily; DMart\'s edge is the depth of the discount across a whole basket, not a cheaper product (CEO, 28-Jul-2026).',
    ] },
    { callout: '**What matters for DMart:** organised retail still has decades of runway, but the share of that runway that goes to large-format stores is no longer obvious. Quick commerce has taken the convenience basket in metros in under three years; whether it can take the monthly stock-up basket, and how fast it reaches Tier 2 towns, decides DMart\'s same-store growth.' },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Does the tailwind reach DMart? Consumption and formalisation yes; the channel shift works against it',
  blocks: [
    { exhibit: { type: 'table', title: 'Four tailwinds, tested', head: ['Tailwind', 'Evidence it is real', 'Does it reach DMart?', 'Catch'], wide: [1, 3], rows: [
      ['Organised retail gaining share', 'Organised retail +15% in FY26 vs ~10% for all retail; ~13% of the total (CRISIL)', 'Yes: DMart standalone revenue +16% in FY26, +15% in Q1FY27', 'E-retail (+16%) and quick commerce are taking a growing part of the gain'],
      ['Consumption in Tier 2-3 towns', 'New stores in Tier 1-2 cities ramp ahead of plan (management); non-metro LFL ~14-15% (Elara)', 'Yes: most new stores open there', 'Lower revenue per sq ft than metros at first; QC is moving into the next 50-100 cities'],
      ['FMCG inflation and GST changes', 'FMCG price increases in 2026; GST rate cuts on food in Q3FY26', 'Yes, mechanically: DMart passes prices through', 'Deflation hurt Q3FY26 growth (13%); pantry-loading in March flattered Q4'],
      ['Digital grocery', 'Quick commerce ~1.5x modern trade in key metros (Emkay)', 'No: DMart Ready lost ₹307 cr in FY26, growth ~5% in Q1FY27, retreated to 11 cities', 'The fastest-growing part of grocery is where DMart is weakest'],
    ], source: 'AR FY26 (CRISIL); analyst meet (28-Jul-2026); Elara and Emkay via Business Today (13-Jul-2026); Emkay initiation (12-Apr-2026); GAM Research' } },
    { callout: '**Verdict:** the consumption and formalisation tailwind reaches DMart through new stores; it no longer lifts the old stores much. The fastest channel shift in Indian grocery (quick commerce) runs against DMart in its densest markets, so the company has to grow by building more stores, which is slower and more capital-hungry than growing sales in the ones it has.' },
  ],
};

module.exports = { business, history, industry, tailwind };
