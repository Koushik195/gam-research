// Trent report, part 2: what the company does, history and corporate actions, industry and the tailwind test.
const X = require('./TRENT.ctx');
const { C, D, BL, build, n0, n1, sa, rpsBase } = X;
const I = D.industry, B = C.business, K = C.fy26.kpi, s26 = sa('FY26'), Q1 = C.q1fy27;

const business = {
  id: 'business', nav: 'What Trent does', kicker: 'The business', title: 'Two own-brand fashion chains (Zudio and Westside) that own the shopper, the product and the store; Star and Zara on the side',
  blocks: [
    { p: `Trent, the Tata group\'s retailer, sells fashion and lifestyle goods under its own brands in its own stores. **Zudio** (${K.zudio} stores at Mar-26, ${Q1.kpi.zudio} at Jun-26) is a value-fashion chain of 10,000-12,000 sq ft stores selling apparel, footwear and beauty at sharp price points, sourced almost entirely in India, with no discounting and little advertising; over 80% of new stores open in Tier II-III towns and the edges of big cities. **Westside** (${K.westside} stores, ~24,000 sq ft on average) is a department-store brand one notch up, with a growing online channel (over 6% of its revenue). Smaller concepts (Samoh, Burnt Toast) had ${K.others} stores. Together the fashion business had ${n1(K.areaMnSqft)} mn sq ft at Mar-26 and ${n1(Q1.kpi.areaMnSqft)} mn sq ft at Jun-26 in ${Q1.kpi.cities} cities. Beauty, innerwear and footwear ("emerging categories") are over 21% of revenue.` },
    { p: `The listed company (standalone) is the fashion business: ₹${n0(s26.standaloneRev)} cr of revenue and ₹${n0(s26.standaloneEbitda)} cr of EBITDA (${n1(s26.standaloneMarginPct)}%) in FY26. Subsidiaries add only ₹${n0(s26.subsRev)} cr net (Zudio UAE, Booker cash-and-carry, a few Star stores). Two businesses sit outside revenue because they are equity-accounted: **Star**, a food and grocery chain (86 stores at Jun-26) run by Trent Hypermarket, a 50:50 joint venture with Tesco, with ₹2,774 cr of income and a ₹128 cr pre-tax loss in FY26; and the **Inditex** associates that run Zara (Trent 20%, ₹2,768 cr of income, ₹204 cr of profit) and Massimo Dutti. Their net share of profit was just ₹3.9 cr in FY26 (₹86.5 cr in FY25): Star's loss now offsets Zara.` },
    { exhibit: { type: 'table', title: 'Our store build: FY26 and FY27E-29E', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E', 'Basis'], wide: [5], rows: [
      ['Net fashion stores added', '~250', ...build.map(r => String(r.adds)), 'Westside ~50 + Zudio 200-250 a year (AGM), less closures'],
      ['Fashion stores at year end', String(K.stores), ...build.map(r => n0(r.stores)), 'Incl. other concepts and Zudio UAE'],
      ['Retail area at year end (mn sq ft)', n1(BL.base.areaClose), ...build.map(r => n1(r.area)), `${BL.sqftPerNewStore * 1000}k sq ft per net new store`],
      ['Effective average area (mn sq ft)', n1(BL.base.areaEff), ...build.map(r => n1(r.eff)), `Opening + ${BL.phasing * 100}% of additions (openings are back-ended)`],
      ['Revenue per effective sq ft (₹)', n0(rpsBase), ...build.map(r => n0(r.rps)), `${BL.revPerSqftGrowth.map(g => (g > 0 ? '+' : '') + g).join('% / ')}%: low LFL, young stores in small towns`],
      ['Fashion (standalone) revenue (₹ cr)', n0(BL.base.standaloneRev), ...build.map(r => n0(r.st)), 'Effective area × revenue per sq ft'],
      ['  EBITDA margin', n1(BL.base.standaloneEbitda / BL.base.standaloneRev * 100) + '%', ...build.map(r => n1(r.stM) + '%'), 'Q1FY27 19.6%; input-cost pressure flagged'],
      ['Subsidiaries revenue (₹ cr)', n0(BL.base.subsRev), ...build.map(r => n0(r.sub)), `${BL.subsGrowth.map(g => (g > 0 ? '+' : '') + g).join('% / ')}%`],
      ['  Subsidiaries EBITDA (₹ cr)', n0(BL.base.subsEbitda), ...build.map(r => n0(r.subE)), ''],
      { hl: true, cells: ['**Revenue (sum = model)**', `**${n0(s26.consRev)}**`, '**{{F.sales.0|num}}**', '**{{F.sales.1|num}}**', '**{{F.sales.2|num}}**', ''] },
      { hl: true, cells: ['**EBITDA margin (sum = model)**', `**${n1(s26.consEbitda / s26.consRev * 100)}%**`, '**{{F.ebitdaMargin.0|pct}}**', '**{{F.ebitdaMargin.1|pct}}**', '**{{F.ebitdaMargin.2|pct}}**', ''] },
    ], source: 'AR FY26; Q4FY26 and Q1FY27 presentations; Screener.in (standalone and consolidated); GAM estimates (assumptions.json "build", checked against the model in TRENT.ctx.js)' } },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'From one Westside store to 1,300 fashion stores: Zudio changed the company; a bonus in 2026 and a raise approved',
  blocks: [
    { p: 'Trent started with Westside in 1998 and for two decades grew slowly; Zudio, launched in 2016, turned it into one of India\'s fastest-growing retailers after Covid. Food retail and the Zara stores were built with partners (Tesco and Inditex) and are equity-accounted, so the reported numbers are almost entirely Westside and Zudio. Per-share history needs one adjustment: the 1:2 bonus of June 2026 (35.55 cr to 53.32 cr shares); all EPS and prices in this report are on the post-bonus basis.' },
    { exhibit: { type: 'table', title: 'Corporate actions and what they did to the numbers', head: ['When', 'What happened', 'Source'], wide: [1], rows: C.history.map(h => [h.year, h.event, h.src]), source: 'Annual reports; presentations; press reports as cited' } },
    { callout: '**Impact on the numbers:** FY24 profit and ROE are flattered by the ₹439 cr after-tax lease gain (we show the forward P/E median both with and without it); FY26 carries a ₹26 cr labour-code charge. The bonus is neutral to value. The ₹2,500 cr raise, if it happens, adds ~1.8% to the share count at the 30-Sep price; it is not in our numbers. The chairman, Noel Tata, said the June-2026 AGM was his last; succession is a board decision still to come.' },
  ],
};

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Fashion and lifestyle: a ~₹12 lakh crore market growing ~12% a year, organised players faster, and value fashion getting crowded',
  blocks: [
    { p: `${I.size} ${I.trentShare}` },
    { bullets: [
      `**Categories.** ${I.categories}`,
      `**Competition.** ${I.competition}`,
      `**Smaller towns.** ${I.tier2}`,
      '**Pricing.** Zudio keeps prices stable rather than discounting, and says it is calibrating its "price architecture" as input costs rise (Q1FY27). In value fashion, a few rupees on a low-priced T-shirt matter; there is little room to pass on inflation.',
    ] },
    { callout: '**What matters for Trent:** the market is big enough for Zudio to keep growing at 20%+ in revenue for years on share gains alone (2% share today). The question is the quality of that growth: whether new stores in smaller towns reach the productivity of the old ones, and how much of Zudio\'s lead survives as Reliance, Landmark and Vishal copy the format.' },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Does the tailwind reach Trent? Formalisation and smaller-town spending yes; same-store growth no',
  blocks: [
    { exhibit: { type: 'table', title: 'Four tailwinds, tested', head: ['Tailwind', 'Evidence it is real', 'Does it reach Trent?', 'Catch'], wide: [1, 3], rows: [
      ['Organised fashion gaining share', 'Organised fashion +15% a year vs +9% unorganised, FY25-30 (industry reports in AR FY26)', 'Yes: standalone revenue +18% in FY26, +19% in Q1FY27', 'Space grew faster (~+31% in FY26); revenue per sq ft fell ~15%'],
      ['Spending in Tier II-III towns', '>80% of new Zudio stores there; 47 new cities in FY26, 9 more in Q1FY27', 'Yes: it drives store count', 'Sales per sq ft ~18% below metros (₹12,504 vs ₹15,318); two to three years to mature'],
      ['Emerging categories (beauty, innerwear, footwear)', 'Markets of ₹2.4 / 0.84 / 1.04 lakh crore growing 11-12%+ a year', 'Yes: over 21% of Trent revenue', 'Branded competition is stronger in beauty and footwear'],
      ['Online and quick commerce', 'Fast-growing channels for fashion basics', 'Partly: Westside online >6% of Westside revenue; Zudio is offline only', 'QC platforms now sell basics and could take the low-ticket Zudio basket'],
    ], source: 'AR FY26; Q4FY26 and Q1FY27 presentations; GAM Research' } },
    { callout: '**Verdict:** the tailwind reaches Trent through new stores, not through the old ones. Like-for-like growth has been low single digit for over a year, so the company grows by adding space in smaller towns, where each sq ft earns less. That is still a profitable way to grow (a Zudio store needs only ₹3-4 cr of capital), but it is slower in profit than the store count suggests.' },
  ],
};

module.exports = { business, history, industry, tailwind };
