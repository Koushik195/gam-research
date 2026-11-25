// Dr Lal PathLabs report, part 3: network & unit economics, regions, Suburban, bundles & specialised tests,
// competition & pricing, competitive-advantage scorecard.
const X = require('./LALPATHLAB.ctx');
const { C, D, F, n0, n1, rup, SA, SQ, QL, FY26, patients, rpp, rpp0, RB, YRS, Q1 } = X;

const network = {
  id: 'network', nav: 'Network & unit economics', kicker: 'Unit economics', title: 'Network and unit economics: revenue = patients × revenue per patient; both levers are working, and the hub-and-spoke keeps ~81% gross margin',
  blocks: [
    { p: `Revenue is patients times revenue per patient (RPP). From FY23 to FY26 patients grew only 4% a year (26.9 mn → 30.3 mn) while RPP grew 7% a year (₹750 → ₹912): the growth came from selling more tests per visit (SwasthFit bundles, specialised tests) and from richer mix (Delhi NCR, B2C), not from list prices. In the last three quarters patient growth has stepped up (Q3FY26 +2.7% in a weak fever season, Q4 +8.2%, Q1FY27 +8.2%) as the 32 labs and ~2,000 collection centres added in FY25-26 mature, and RPP jumped 10% in Q1 with the CGHS/ECHS rate revision (2-3pp).` },
    { exhibit: { type: 'table', title: 'Our revenue build: patients × revenue per patient', head: ['', 'FY24', 'FY25', 'FY26', ...YRS], rows: [
      ['Patients (mn)', '27.6', '28.8', n1(RB.patientsMn), ...patients.map(n1)],
      ['  growth', '+2.6%', '+4.3%', '+5.3%', ...RB.patientGrowth.map(g => `+${g}%`)],
      ['Revenue per patient (₹)', '807', '855', n0(rpp0), ...rpp.map(n0)],
      ['  growth', '+7.6%', '+6.0%', '+6.7%', ...RB.rppGrowth.map(g => `+${g}%`)],
      { hl: true, cells: ['**Revenue (₹ cr)**', '2,227', '2,461', '{{A.sales.11|num}}', '**{{F.sales.0|num}}**', '**{{F.sales.1|num}}**', '**{{F.sales.2|num}}**'] },
    ], source: 'Company presentations; AR FY26 MD&A (RPP FY25-26); GAM (LALPATHLAB.ctx.js checks the build equals model revenue)' } },
    { pair: [
      { type: 'column', title: 'Revenue per sample: ₹286 → ₹308 in a year', unit: 'Revenue per sample (₹), quarterly', x: ['Q1FY26', 'Q2FY26', 'Q3FY26', 'Q4FY26', 'Q1FY27'], series: [{ name: 'Revenue per sample', values: [286, 288, 297, 298, 308], fmt: 'num' }], labels: 'all', source: 'Emkay result update (24-Jul-2026), exhibit 3' },
      { type: 'line', title: 'Tests per patient: 2.97 → 3.21', unit: 'Tests per patient, quarterly', x: ['Q3FY25', 'Q4FY25', 'Q1FY26', 'Q3FY26', 'Q4FY26', 'Q1FY27'], series: [{ name: 'Tests per patient', values: [2.97, 3.07, 3.07, 3.11, 3.21, 3.14], fmt: 'n2' }], labels: 'all', min: 2.8, max: 3.3, source: 'Company calls (Q2FY26 not disclosed)' },
    ] },
    { exhibit: { type: 'table', title: 'Where the margin comes from (FY26, % of revenue, company)', head: ['Cost', '% of revenue', 'Comment'], wide: [2], rows: [
      ['Reagents and consumables', '19.4%', 'Mostly imported via Indian distributors; long-term contracts and 3-4 months of stock; gross margin ~81%'],
      ['Employees (incl. ₹24 cr ESOP)', '18.2%', 'Q1FY27 16.6% after courier costs were reclassified to other expenses; pay up 6.75% for the median employee'],
      ['Fees to collection centres', '14.6%', 'Franchisee commission: the cost of an asset-light network'],
      ['Other expenses', '19.5%', 'Courier ₹118 cr, advertising ₹91 cr, rent ₹33 cr (short leases), repairs, power, IT, CSR'],
      { hl: true, cells: ['**EBITDA (before labour code)**', '**28.3%**', 'Q1FY27 31.0%'] },
    ], source: 'AR FY26 consolidated P&L and note 32; Q1FY27 call' } },
    { callout: `**So what:** each new lab costs money for 2-3 years before it fills up; the 32 labs added in FY25-26 are now starting to pay, which is why margin rose even as Dr Lal invested. Management will add 12-15 labs a year and keeps the margin target at 27-28%, i.e. it intends to spend some of the operating leverage. We model {{F.ebitdaMargin.0|pct}} / {{F.ebitdaMargin.1|pct}} / {{F.ebitdaMargin.2|pct}}: above guidance, below Q1's 31%.` },
  ],
};

const regions = {
  id: 'regions', nav: 'Regions', kicker: 'Regions', title: 'Regions: Delhi NCR and the North pay the bills; growth outside the core comes from smaller North and East towns, not from Mumbai or the South',
  blocks: [
    { p: `Dr Lal's regional mix has barely moved in three years: **Delhi NCR 31%**, **UP & Uttarakhand 19%**, **rest of North 13%**, **East 15%**, **West 14%**, **South 6%**, others (incl. Nepal and Bangladesh) 2% (FY26). North and East together are ~77%. Delhi NCR is both the largest and the highest-realisation market (B2C, specialised tests); management aims to grow it at double digits, "as near to the overall revenue as possible", and did so in FY26 and Q1FY27. The fastest growth comes from Tier-3-and-below towns, mostly in the North and East, priced like the nearest city cluster: ₹685 cr (FY23) → ₹1,090 cr (FY26), 39% of revenue.` },
    { pair: [
      { type: 'column', title: 'Regional mix: unchanged for three years', unit: '% of revenue', x: ['FY24', 'FY25', 'FY26'], series: [{ name: 'Delhi NCR', values: [31, 31, 31], fmt: 'pct0' }, { name: 'Rest of North (incl. UP & UK)', values: [31, 32, 32], fmt: 'pct0' }, { name: 'East', values: [15, 14, 15], fmt: 'pct0' }, { name: 'West', values: [15, 15, 14], fmt: 'pct0' }, { name: 'South + others', values: [8, 8, 8], fmt: 'pct0' }], labels: 'none', source: 'Q4FY24 PPT; AR FY26 MD&A p.127' },
      { type: 'column', title: 'Tier-3+ towns: 34% → 39% of revenue', unit: 'Revenue from Tier-3-and-below towns (₹ crore)', x: ['FY23', 'FY24', 'FY25', 'FY26'], series: [{ name: 'Tier-3+ revenue', values: [685, 789, 917, 1090], fmt: 'num' }], labels: 'all', source: 'Q1FY27 PPT p.11' },
    ] },
    { exhibit: { type: 'table', title: 'Region by region (FY26 revenue ≈ share × ₹2,763 cr)', head: ['Region', 'Share', '≈ ₹ cr', 'What is happening'], wide: [3], rows: [
      ['Delhi NCR', '31%', n0(0.31 * 2763), 'Home market since 1949; double-digit growth sustained; new testing locations to cut turnaround; radiology centres and Sovaaka here'],
      ['UP & Uttarakhand', '19%', n0(0.19 * 2763), 'Lucknow and smaller towns; Tier-3 penetration through franchised centres; GraminFit rural drive'],
      ['Rest of North', '13%', n0(0.13 * 2763), 'Punjab, Haryana, Rajasthan, J&K; same cluster model'],
      ['East', '15%', n0(0.15 * 2763), 'Kolkata reference lab; share up from 14% to 15% in FY26'],
      ['West', '14%', n0(0.14 * 2763), 'Mumbai (Suburban + Dr Lal); share down from 15%; Suburban "very close double digits" in Q1FY27; Shahbazkers and SN Genelab (Gujarat) added'],
      ['South', '6%', n0(0.06 * 2763), 'Bengaluru reference lab; management wants a top-3/5 platform in a city through M&A'],
      ['Others', '2%', n0(0.02 * 2763), 'Nepal, Bangladesh; Ghana from FY27'],
    ], source: 'AR FY26 MD&A p.127; Q3FY26, Q4FY26 and Q1FY27 calls; GAM arithmetic' } },
    { callout: '**Concentration cuts both ways.** It is the source of Dr Lal\'s margins: dense networks in markets where it is the default choice for doctors. It is also the main strategic risk: a well-funded rival (a hospital chain\'s lab, an aggregator, a pharma entrant) attacking Delhi NCR would hurt more than any gain elsewhere could offset, and twenty years of trying have not produced a second home market.' },
  ],
};

const suburban = {
  id: 'suburban', nav: 'Suburban (Mumbai)', kicker: 'Suburban', title: 'Suburban Diagnostics: bought for ₹925 cr in 2021 to build the West; a stumble in FY25-26, now recovering, but the West has not grown its share',
  blocks: [
    { p: rup(`${C.suburban.deal} ${C.suburban.since}`) },
    { exhibit: { type: 'table', title: 'Suburban: what we can and cannot measure', head: ['Question', 'Answer', 'Source'], wide: [1, 1], rows: [
      ['Price paid', 'EV ₹925 cr (18.5x FY22 EBITDA; cap ₹1,150 cr); FY21 revenue ₹294 cr, EBITDA ₹57.5 cr', 'Deal announcement (Oct-2021)'],
      ['Accounting legacy', `Goodwill ₹548 cr; intangibles amortised ₹${n1(X.acq26)} cr in FY26 (brand ₹39.2 cr, ends FY27; customer relationships ₹16.2 cr a year to ~FY35)`, 'AR FY26 notes 4-5'],
      ['Tax legacy', 'Liquidation into the parent (Mar-2025) stepped up the tax base of the intangibles: ₹40.8 cr deferred-tax credit in FY25 and tax-deductible amortisation since', 'AR FY26 note 41(b)'],
      ['Growth', 'Weak for ~3 quarters in FY25-26 (IT/LIMS change, move to franchised collection); "picking up" in Q4FY26; "very close double digits" in Q1FY27', 'Q4FY26 and Q1FY27 calls'],
      ['West region share of revenue', '15% (FY24) → 15% (FY25) → 14% (FY26)', 'Company presentations'],
      ['Margin', 'Not disclosed; West below Delhi NCR "with room to improve"; high-teens in an earlier quarter per an investor on the Q4FY26 call (not confirmed)', 'Q4FY26 call'],
      ['Return on the ₹925 cr', 'Cannot be measured: Suburban is no longer reported separately', 'GAM'],
    ], source: 'Business Today (27-Oct-2021); AR FY26; company calls' } },
    { callout: '**Our read:** Suburban was a sensible, fairly priced attempt to buy a Mumbai brand, but the integration cost a year and the West has not gained share since. The good news is that it now grows again and is fully merged, so the West can be run as one Dr Lal business. The lesson matters for the next deals (SN Genelab, a South platform): Dr Lal\'s model works best where it is already dense.' },
  ],
};

const bundles = {
  id: 'bundles', nav: 'SwasthFit & specialised tests', kicker: 'Mix', title: 'SwasthFit bundles (27% of revenue) and specialised tests lift revenue per patient; genomics is still small',
  blocks: [
    { p: `**SwasthFit** is Dr Lal's range of preventive health packages (a bundle of routine tests at one price, sold to walk-in patients, online and through doctors). It rose from 22% of revenue in FY24 to 24% in FY25 and 27% in FY26, growing ~20% a year, and was 27% again in Q1FY27 (growth ~20%, in line with the company). Bundles raise tests per patient (3.1 in FY26) and are "not margin dilutive" (Q3FY26 call); Suburban's packages are included. They now sell in Tier-2/3 towns as well as metros, sometimes on a doctor's recommendation. **Specialised tests** (genomics, oncology, transplant immunology, autoimmune, reproductive) carry higher prices and higher reagent costs: Dr Lal launched 136 new tests in FY26 (13 first in India) and 116 in Q1FY27, set up specialty verticals (Genevolve for genomics, L-CoRD for reproductive, L-ACE for autoimmune) and hosted a clinician conference (Medllumina). Genomics is still <5% of revenue; SN Genelab (₹58 cr of revenue) would add roughly 2% to group revenue.` },
    { pair: [
      { type: 'column', title: 'SwasthFit: 22% → 27% of revenue', unit: '% of revenue', x: ['FY24', 'FY25', 'FY26', 'Q1FY27'], series: [{ name: 'SwasthFit share', values: [22, 24, 27, 27], fmt: 'pct0' }], labels: 'all', source: 'Company presentations' },
      { type: 'column', title: 'SwasthFit revenue ≈ ₹490 cr → ₹746 cr', unit: '₹ crore (share × revenue, GAM)', x: ['FY24', 'FY25', 'FY26'], series: [{ name: 'SwasthFit (approx.)', values: [Math.round(0.22 * 2227), Math.round(0.24 * 2461), Math.round(0.27 * 2763)], fmt: 'num' }], labels: 'all', source: 'Company shares × Screener revenue (GAM arithmetic)' },
    ] },
    { callout: '**So what:** bundles have been the main source of Dr Lal\'s revenue-per-patient growth without a price increase. Their share has flattened (27% in FY26 and Q1FY27), so the next leg of RPP growth has to come from specialised tests, Delhi NCR mix or price. We assume RPP growth slows from 8% (FY27E, with CGHS) to 6% and 5.5%.' },
  ],
};

const competition = {
  id: 'competition', nav: 'Competition & pricing', kicker: 'Competition', title: 'Competition and pricing: aggregators, hospital labs and new entrants keep a lid on prices; Dr Lal has not raised list prices in three years',
  blocks: [
    { exhibit: { type: 'table', title: 'Who competes for Dr Lal\'s patients', head: ['Competitor type', 'Examples', 'How they compete', 'Effect on Dr Lal'], wide: [2, 3], rows: [
      ['Online aggregators / e-pharmacies', 'Tata 1mg, PharmEasy (owns Thyrocare), Healthians, Redcliffe', 'Deep discounts on home-collection packages; price comparison online', 'Pressure on routine and package prices in metros; JM (Mar-2026) sees patients "returning to organised offline" labs'],
      ['Hospital chains\' labs', 'Apollo, Fortis (Agilus), Max', 'Capture in-patient and referral testing; some sell to outside patients', 'Takes B2B and super-specialised volume; management sees no clear share shift either way'],
      ['National and regional chains', 'Metropolis, Vijaya, Neuberg, regional brands', 'Network and doctor relationships', 'Fight for Mumbai, the South and Tier-2 towns'],
      ['Unorganised labs', '>3 lakh standalone labs', 'Low prices, convenience', 'Slow share loss to chains; new small labs keep entering'],
      ['New entrants', 'Pharma companies and corporate healthcare groups', 'Bundled offers, capital', '"Several large pharmaceutical and hospital players" entered (CARE)'],
    ], source: 'AR FY26 MD&A (threats); CARE (1-Apr-2026); JM Financial (14-Mar-2026); Q1FY27 call' } },
    { p: 'Pricing has been passive: no list-price increase since ~FY23, the Q3FY26 GST cut on reagents (12% → 5%) was passed to patients, and the only price gain in FY27 is the government\'s CGHS/ECHS rate revision. Management calls price "a strategic lever" and will reassess after H1FY27 depending on "how the pricing table of the competition is moving" and costs; it said competition "has always been intense and is likely to stay intense". A weak rupee and West-Asia freight could raise reagent costs from late FY27 (stock covers 3-4 months).' },
    { callout: '**So what:** this is a volume-and-mix business in a market where price is a weapon used by others. A list-price increase of 3-5% after H1FY27 would add ~₹1-2 of EPS a year if volumes hold; we assume only ~1pp of price in FY28E. The bigger risk is the reverse: a renewed discount war in Delhi NCR.' },
  ],
};

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: a narrow, regional moat built on brand and density; no pricing power, and it has not travelled',
  blocks: [
    { exhibit: { type: 'table', title: 'Competitive-advantage scorecard', head: ['Source', 'Strength', 'Evidence'], wide: [2], rows: D.moat.scores, source: 'GAM assessment; company filings and calls; CARE' } },
    { callout: `**Verdict:** ${rup(D.moat.verdict)}` },
  ],
};

module.exports = { network, regions, suburban, bundles, competition, moat };
