// Lupin report, part 2: what the company does, history (four eras), industry, tailwind test.
const X = require('./LUPIN.ctx');
const { C, D, A, F, n0, n1, FY26, Q1, rup, SA, BL } = X;
const sh = k => Math.round(FY26[k] / FY26.salesCr * 100);

const business = {
  id: 'business', nav: 'What Lupin does', kicker: 'Company', title: 'What Lupin does: a US generics company with an Indian branded franchise, now growing in Europe and emerging markets',
  blocks: [
    { p: rup(`Lupin makes and sells medicines in 100+ countries from 15 plants. **United States** (Rs${n0(FY26.usSalesCr)} cr in FY26, ${sh('usSalesCr')}% of sales; $${FY26.usUsdMn}mn) sells 149 generic products: inhalers (generic Spiriva, albuterol, Xopenex), tablets and capsules, and a growing list of injectables; it is No.3 in US generics by prescriptions and No.1 in 56 products. **India** (Rs${n0(FY26.indiaCr)} cr, ${sh('indiaCr')}%) sells branded prescription drugs through ~11,300 sales staff, mostly for chronic diseases (diabetes, heart, respiratory: 67% of the portfolio), plus consumer health (LupinLife), diagnostics labs and digital health. **Other developed markets** (Rs${n0(FY26.odmCr)} cr, ${sh('odmCr')}%: Europe, Canada, Australia) and **emerging markets** (Rs${n0(FY26.emCr)} cr, ${sh('emCr')}%: Brazil, South Africa, Philippines, Mexico) sell branded generics and specialty products. **API** (Rs${n0(FY26.apiCr)} cr, 4%) sells drug ingredients, where Lupin is a global leader in anti-TB drugs and cephalosporin antibiotics.`) },
    { pair: [
      { type: 'hbar', title: 'FY26 sales: US 42%, India 30%', unit: 'Share of FY26 product sales (%)', x: ['United States', 'India', 'Emerging markets', 'Other developed markets', 'API'], series: [{ name: 'Share', values: [sh('usSalesCr'), sh('indiaCr'), sh('emCr'), sh('odmCr'), sh('apiCr')], fmt: 'pct0' }], labels: 'all', source: 'Q4FY26 press release' },
      { type: 'column', title: 'US sales in dollars: $632mn (FY23) to $1,318mn (FY26)', unit: 'US sales (US$ mn); FY27-29E = GAM', x: ['FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], series: [{ name: 'US', values: [800, 720, 738, 632, 815, 944, 1318, ...BL.usdMn], fmt: 'num' }], labels: 'all', source: 'Company releases (FY25 regrouped); GAM estimates' },
    ] },
    { exhibit: { type: 'table', title: 'The five businesses at a glance', head: ['Business', 'FY26 sales', 'Q1FY27', 'Position', 'What drives it'], wide: [3, 4], rows: [
      ['**United States**', `₹${n0(FY26.usSalesCr)} cr (+46%)`, `$${Q1.usUsdMn}mn (+30% in $)`, 'No.3 generics by prescriptions; ~35-38% of Spiriva; ~16% albuterol', 'A few limited-competition products at a time; launches (15 in FY26); price erosion on the base'],
      ['**India**', `₹${n0(FY26.indiaCr)} cr (+7%; Rx +10.6%)`, `₹${n0(Q1.india)} cr (+${Q1.indiaGrowthPct}%)`, 'No.8 in the IPM; No.1 anti-TB, No.2 respiratory, No.3 cardiac and diabetes', 'Chronic therapies, new launches (~20 in FY27), insulin and semaglutide'],
      ['**Other developed markets**', `₹${n0(FY26.odmCr)} cr (+13%)`, `₹${n0(Q1.odm)} cr (+${Q1.odmGrowthPct}%)`, 'Europe passed $200mn in FY26; No.4 generics in Australia', 'VISUfarma (eye care), biosimilars via partners, inhalers (Luforbec)'],
      ['**Emerging markets**', `₹${n0(FY26.emCr)} cr (+35%)`, `₹${n0(Q1.em)} cr (+${Q1.emGrowthPct}%)`, 'Brazil turnaround; No.7 generics in South Africa; Philippines', 'Diabetes launches (dapagliflozin, empagliflozin, semaglutide)'],
      ['**API**', `₹${n0(FY26.apiCr)} cr (−18%)`, `₹${n0(Q1.api)} cr (+8%)`, 'Global leader in anti-TB and cephalosporin APIs', 'Mostly captive; external sales fluctuate'],
    ], source: 'Company releases Q4FY26 and Q1FY27; ICRA (8-Jul-2026); growth in rupees unless stated' } },
    { callout: '**So what:** Lupin is two businesses with different economics. The US is a pipeline business: it earns large profits from a few hard-to-copy products for a year or two, then has to replace them. Everything else (India, Europe, emerging markets, API: 58% of sales) is a steadier branded franchise growing ~12-15%. FY23-26 showed how violently the first can swing the total: margin from 10% to 29%.' },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'Four eras: building the US, the compliance crisis, the trough, the windfall',
  blocks: [
    { p: 'Lupin\'s numbers only make sense against its history. Each era changed the mix, the margin and the balance sheet.' },
    { exhibit: { type: 'table', title: 'The four eras of Lupin', head: ['Era', 'What happened', 'EBITDA margin', 'What it did to the numbers'], wide: [1, 3], rows: [
      ['**To FY17: Building the US**', 'Founded 1968 by Dr Desh Bandhu Gupta on anti-TB drugs; US generics from the 2000s; Gavis (US) bought for $880mn in FY16.', '26-28%', 'Profit ~₹2,250-2,560 cr a year (FY15-17); EPS ₹50-57.'],
      ['**FY18-20: Compliance crisis and US price war**', 'Warning letter for Goa and Pithampur (Nov-2017) blocks approvals; US generic prices fall; Japan (Kyowa) sold in FY20.', '20% → 15%', 'Profit from ₹2,557 cr (FY17) to ₹251 cr (FY18) and a ₹269 cr loss in FY20; debt from the Gavis deal.'],
      ['**FY21-23: The trough**', 'COVID, a ₹1,878 cr Glumetza antitrust settlement and a ₹708 cr Solosec write-down (FY22), US price erosion and cost inflation (FY23).', '17% → 1% → 10%', 'Loss of ₹1,528 cr in FY22; EPS ₹9.45 in FY23; net debt ₹2,527 cr (Mar-23).'],
      ['**FY24-26: The windfall**', 'First generic Spiriva (Aug-2023), Mirabegron at risk (Apr-2024), Tolvaptan exclusive (May-2025); Goa/Pithampur letter resolved (Jul-2023); India pivots to chronic.', '19% → 23% → 29%', 'Profit ₹1,914 → 3,282 → 5,333 cr; net cash ₹4,636 cr (Mar-26); VISUfarma bought.'],
    ], source: 'Company filings and releases; Screener.in; GAM Research' } },
    { exhibit: { type: 'table', title: 'Corporate actions and events, and their impact', head: ['When', 'Event', 'Impact on the numbers'], wide: [1, 2], rows: C.history.filter(h => h.year !== '1968').map(h => [h.year, rup(h.event), { FY16: 'Goodwill and intangibles; later impairments', 'Nov-2017': 'Approvals from two key plants delayed for years', FY20: 'Japan revenue gone; one-off charges', FY22: 'FY22 EBITDA margin 1.3%', FY23: 'The trough year used in our valuation rule', 'Aug-2023': 'US $632mn (FY23) to $815mn (FY24)', 'Apr-2024': 'EBITDA margin 19% (FY24) to 23% (FY25)', 'May-2025': 'US $1,318mn and margin 29% in FY26', FY26: 'Profit +62%; ₹558 cr exceptional charge', 'Apr-Sep 2026': 'FY27E EPS below FY26' }[h.year] || '-']), source: 'Company filings and releases; GAM Research' } },
    { pair: [
      { type: 'column', title: 'Profit: two losses in seven years, then a record', unit: 'Net profit attributable to owners (₹ crore)', x: 'A.labels', from: 'FY15', series: [{ name: 'Net profit', ref: 'A.pat', fmt: 'num' }], labels: 'all', source: 'Screener.in (patched to owners)' },
      { type: 'column', title: 'Borrowings: the Gavis debt was repaid, then rebuilt in dollars', unit: 'Borrowings incl. leases (₹ crore)', x: 'A.labels', from: 'FY15', series: [{ name: 'Borrowings', ref: 'A.borrowings', fmt: 'num' }], labels: 'all', source: 'Screener.in' },
    ] },
  ],
};

const IND = D.industry;
const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Industry: US generics pay only for complexity and exclusivity; India grows steadily',
  blocks: [
    { p: rup(`**United States.** ${IND.usGenerics} Approval also depends on plant inspections: a warning letter or an 'Official Action Indicated' rating stops new approvals from that plant, which is why Lupin's compliance record matters as much as its R&D.`) },
    { p: rup(`**India.** ${IND.ipm} Price increases on drugs under India's price-control list are capped at the wholesale-price index each April.`) },
    { p: rup(`**Europe, emerging markets and API.** ${IND.europe} ${IND.emergingMarkets} ${IND.api}`) },
    { pair: [
      { type: 'column', title: 'The three products behind the windfall were big US brands', unit: 'Brand US sales before Lupin\'s generic (US$ mn)', x: ['Spiriva HandiHaler (MAT Mar-23)', 'Jynarque (CY24)'], series: [{ name: 'Brand sales', values: [1264, 1467], fmt: 'num' }], labels: 'all', source: 'Lupin launch releases (Aug-2023, May-2025); Myrbetriq size not disclosed by Lupin' },
      { type: 'column', title: 'Indian market growth: ~11-13%; Lupin Rx a little faster', unit: 'Value growth (%)', x: ['IPM MAT Jun-26 (IQVIA)', 'IPM Q1FY27 (IQVIA)', 'IPM Aug-26 (Pharmarack)', 'Lupin Rx Q1FY27'], series: [{ name: 'Growth', values: [11.1, 13.5, 10.7, Q1.indiaRxGrowthPct], fmt: 'pct' }], labels: 'all', highlight: 'Lupin Rx Q1FY27', source: 'IQVIA via Kotak Neo and Lupin; Pharmarack via BioSpectrum' },
    ] },
  ],
};

const tailwind = {
  id: 'tailwinds', nav: 'Tailwind test', kicker: 'Does the tailwind reach Lupin?', title: 'Tailwind test: Lupin captures India\'s chronic growth and US complex generics; the rupee helps; obesity only partly',
  blocks: [
    { p: 'A sector tailwind helps shareholders only if the company captures it. We score each driver.' },
    { verdicts: [
      ['Faster Indian market growth (~11-13%)', 'Yes', `Rx +${Q1.indiaRxGrowthPct}% vs IPM +${Q1.ipmGrowthPct}% in Q1FY27; volume +6.1%; diabetes +31.8%, cardiac 1.2x the market; respiratory lagged (+6.9% vs 11.3%).`, 'Lupin grows with the market and a little faster; guided 1.2-1.3x.'],
      ['Shift to chronic therapies', 'Yes', 'Chronic ~67% of the portfolio (65% in FY26), target 70% by FY31; in-licensed share down from 12% to 6%.', 'Better mix and margins, slowly.'],
      ['GLP-1 / obesity boom', 'Partly', 'Semaglutide generic (Semanext, Livarise) launched in Q4FY26, No.2-3 among generics; oral and vial forms in H2FY27; Bofanglutide in-licensed from Gan & Lee.', 'Crowded generic market: volume yes, pricing power no.'],
      ['US complex generics (inhalers, injectables, biosimilars)', 'Yes, temporarily', 'Spiriva first generic; Tolvaptan exclusivity; gRisperdal Consta (CGT); pegfilgrastim and ranibizumab biosimilars approved; 45+ injectables and 20+ inhalation products in the pipeline.', 'Lupin has the capability; each product is worth a few years.'],
      ['US onshoring and tariffs', 'Partly', 'Somerset (NJ) and Coral Springs (FL) plants; apixaban suspension made in Somerset.', 'Some protection if tariffs on Indian generics rise; not a profit driver yet.'],
      ['Weaker rupee', 'Yes', `~₹94-96/US$ in FY27 vs ₹${n1(X.fx26)} for FY26 US sales; ~70% of sales outside India.`, 'Each ₹1 move changes FY28E revenue by ~₹200 cr.'],
      ['European biosimilar substitution', 'Partly', 'France pushing substitution; German ophthalmology biosimilars outside tenders; VISUfarma field force.', 'A real option from FY28; small today (~$50mn of biosimilar sales).'],
    ], head: ['Tailwind', 'Captured?', 'Evidence', 'So what'], title: 'Tailwind scorecard: mostly yes, but the US gains are temporary', source: 'Company calls and presentations; IQVIA via company; GAM Research' },
    { callout: '**Our view:** Lupin captures the Indian chronic tailwind well and has proven it can win in hard US products. But the US gains are product-by-product and temporary, which is exactly what FY27 shows: the same tailwind that lifted EBITDA margin to 31% in Q2FY26 now runs in reverse as rivals launch.' },
  ],
};

module.exports = { business, history, industry, tailwind };
