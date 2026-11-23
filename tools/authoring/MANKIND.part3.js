// Mankind Pharma report, part 3: the India prescription business, BSV, consumer healthcare, exports, moat.
const X = require('./MANKIND.ctx');
const { C, D, F, n0, n1, SA, SQ, QL, Q1, FY26, DEAL, YRS, build, BL } = X;
const fy = k => SA.filter(a => a[k] != null);

const india = {
  id: 'india', nav: 'India prescription business', kicker: 'India Rx', title: 'India prescriptions (79% of revenue): #1 in prescriptions, #4 by value, 40% chronic, and growing with the market again after a lost year',
  blocks: [
    { p: `The domestic prescription business (₹11,338 cr in FY26, including BSV's India sales) is Mankind. It rests on scale in the doctor's office: 15.2% of all prescriptions in India (#1 for nine years), 84% of prescribers writing at least one Mankind brand, 13 brands above ₹200 cr and 54 above ₹50 cr. The portfolio is still 60% acute: antibiotics, gastro, vitamins, gynaecology, pain. Chronic therapies are 40% (ex-BSV) after rising from 28% in FY18, led by cardiac (Telmikind family ₹750 cr+, Lipirose and Statpure growing 23-31%) and diabetes (Glizid ₹230 cr+, gliflozins, insulin glargine). Two facts surprise people: Mankind's reach into Tier II-VI towns and villages is 47% of sales against 34% for the market (company), yet the share of its sales from metros and Class-1 towns has risen from 50.7% (FY17) to 56.5% (FY26) as it adds specialists, hospitals and chronic brands. FY26 was weak (organic growth ex-consumer 8.6%) because Mankind rebuilt its field force; Q1FY27 was +11.0% with chronic +15.8% and acute +10.9%.` },
    { pair: [
      { type: 'column', title: 'Domestic prescription revenue and our forecast', unit: 'Domestic revenue ex-consumer (₹ crore); FY27-29E = GAM', x: [...fy('domesticRx').map(a => a.fy), ...YRS], series: [{ name: 'Domestic Rx', values: [...fy('domesticRx').map(a => a.domesticRx), ...build.domesticRx.map(Math.round)], fmt: 'num' }], labels: 'all', highlight: 'FY26', source: 'Company decks; GAM (+11% / +11% / +10.5%)' },
      { type: 'hbar', title: 'Top brands: big franchises in ordinary molecules', unit: 'FY26 sales (₹ crore, IQVIA)', x: ['Manforce', 'Moxikind-CV', 'Amlokind-AT', 'Unwanted-Kit', 'Prega News', 'Dydroboon', 'Telmikind-AM', 'Gudcef', 'Glimestar-M', 'Candiforce'], series: [{ name: 'FY26 sales', values: [596, 408, 300, 256, 248, 240, 212, 208, 206, 202], fmt: 'num' }], labels: 'all', source: 'AR FY26 (IQVIA MAT Mar-26)' },
    ] },
    { exhibit: { type: 'table', title: 'Top brands: size, growth and position', head: ['Brand', 'Therapy', 'FY26 sales (₹ cr)', 'FY22-26 CAGR', 'Market share', 'Rank'], rows: [
      ['Manforce', 'Sexual wellness (Rx)', '596', '19.9%', '46.9%', '1'], ['Moxikind-CV', 'Anti-infective', '408', '10.7%', '9.3%', '3'], ['Amlokind-AT', 'Cardiac', '300', '14.6%', '39.4%', '1'],
      ['Unwanted-Kit', 'Gynaecology', '256', '9.9%', '57.0%', '1'], ['Prega News', 'Pregnancy test', '248', '13.6%', '82.6%', '1'], ['Dydroboon', 'Gynaecology', '240', '13.1%', '17.2%', '2'],
      ['Telmikind-AM', 'Cardiac', '212', '25.3%', '15.3%', '2'], ['Gudcef', 'Anti-infective', '208', '8.0%', '15.8%', '2'], ['Glimestar-M', 'Anti-diabetic', '206', '8.1%', '5.6%', '5'], ['Candiforce', 'Anti-fungal', '202', '5.4%', '14.4%', '2'],
    ], source: 'AR FY26 top-20 brand table (IQVIA MAT Mar-26)' } },
    { bullets: [
      '**What went wrong in FY26.** Management "did deep correction" of the field force ~18 months before Jul-2026: high attrition, people removed, new divisions formed. Acute growth fell to 3.3% in Q2FY26; secondary sales grew 6.3% vs ~10% for the market.',
      '**What has improved.** Gastro from −2.5% (Q2FY26) to +13.6% (Q1FY27); vitamins from 5% to 19.3%; gynaec from 6.9% to 12.7%; cardiac from 14.5% to 19.4%. Volume growth 4.7% (2.3% in FY26). Attrition and vacancies "back to normal".',
      '**Levers named by management:** chronic toward 50% of sales in 4-5 years; hospitals (share "significantly below peers"); a new division (Vistar) for under-promoted brands; under-penetrated states where its rank is below its national #4.',
      '**What still lags:** new introductions (2.8% of sales vs 4.1% for the market), anti-infectives (+3.6%), and GLP-1s, where Mankind is a late, small player by choice.',
    ] },
    { callout: '**Our view:** a top-tier franchise that has lost its growth premium. We forecast domestic prescription growth of 11% in FY27E (Q1: 11.0%) and 10.5-11% after, in line with the market; a return to 1.2x the market (management\'s aspiration) is our bull case.' },
  ],
};

const bsv = {
  id: 'bsv', nav: 'BSV: women\'s health & critical care', kicker: 'BSV', title: 'BSV: hard-to-copy biologics in fertility, pregnancy and critical care; growth recovered to 21%, but Mankind no longer discloses its numbers',
  blocks: [
    { p: `BSV makes biologics that few companies can: the world's only recombinant Anti-D (given to Rh-negative mothers to protect later pregnancies; 5-7% of Indian mothers, 80 lakh to 1 crore a year, with only 30-40% treated; patent in India until 2028 and, per management, 100% of the Indian market), India's first biosimilar recombinant FSH (Foligraf, for IVF), urinary hormones (Humog, HUCOG), immunoglobulins (IVIG, India's only anti-thymocyte globulin, anti-snake-venom and rabies immunoglobulins) and complex injectables (liposomal amphotericin B, leuprolide microspheres). It makes them at Ambernath (recombinant, equine, hormonal) and in Germany (USFDA-accredited, with its own enzyme and hormone APIs). In FY24 it had revenue of ₹1,723 cr (54% India) and a 28.4% adjusted EBITDA margin, above Mankind's 24.7%. Since the deal BSV has been run as a separate, professionally managed unit; its generic women's-health business moved into Mankind on 1-Nov-2025.` },
    { exhibit: { type: 'table', title: 'BSV since the acquisition (growth year on year)', head: ['Period', 'BSV growth', 'Detail', 'Source'], wide: [2], rows: [
      ['Q1FY26', 'Mid-to-high single digit', 'Integration; domestic weaker', 'Q3FY26 call'],
      ['Q2FY26', 'Mid-to-high single digit', '', 'Q3FY26 call'],
      ['Q3FY26', '20%+', 'Revenue ~₹464 cr incl. Rx business (~13% of group revenue)', 'Q3FY26 call'],
      ['Q4FY26', 'Domestic strong double digit; international dipped', 'LATAM, CIS and a Philippines leadership change', 'Q4FY26 call'],
      ['FY26', '"Early teens"', 'Domestic : international ≈ 50 : 50', 'Q1FY27 call'],
      ['Q1FY27', '+21%', 'Domestic ~17%, international ~25%; Foligraf and Humog +39%, Anti-D +23%', 'Q1FY27 deck and call'],
      ['FY27 guidance', 'High teens', 'Russia approved FSH; more approvals expected; GTM expansion in the Philippines, Malaysia, Africa', 'Q1FY27 call'],
    ], source: 'Mankind earnings calls (Feb-2026, May-2026, Jul-2026)' } },
    { bullets: [
      '**Where Mankind helps:** gynaecologist coverage up from ~32,000 at the deal to 37,000; IVF-centre coverage above 80-90% (3,000+ centres); Anti-D prescribing hospitals in 15+ states (10-12 before), campaigns with Amitabh Bachchan; clinical studies to widen use (Foligraf, Anti-D, an anti-allergy immunoglobulin).',
      '**Synergies:** the deal deck listed revenue levers (Mankind\'s reach, OTC switches such as Lactare and Ossopan, cross-selling in fertility clinics) and cost levers (rep productivity, moving outsourced manufacturing in-house) but never put a number on them. HDFC Securities cut estimates in Feb-2026 partly for "delayed BSV synergies".',
      '**Disclosure:** after Q4FY25 Mankind stopped giving BSV\'s revenue and margin; analysts could not reconcile the growth claims in Feb-2026 (Macquarie on the Q3FY26 call). We cannot test BSV\'s profitability independently (gap).',
      '**Risk:** the Anti-D patent runs to 2028 in India; a biosimilar or a revival of polyclonal products would hit BSV\'s largest brand (₹200 cr+).',
    ] },
    { callout: '**Our view:** strategically the right asset (it gives Mankind biologics, fertility and a specialist channel), bought at a full price and integrated slowly. Growth of 17-25% in Q1FY27 suggests the commercial engine is now working; we assume high-teens growth in FY27E inside our domestic and export lines but no margin re-rating for BSV beyond the group\'s +50bp a year.' },
  ],
};

const consumer = {
  id: 'consumer', nav: 'Consumer healthcare', kicker: 'Consumer healthcare', title: 'Consumer healthcare (6%): category-leading brands, ~5% growth for two years',
  blocks: [
    { p: 'Mankind\'s over-the-counter business sells brands most Indians know: Manforce condoms (#1, 28% share), Prega News pregnancy kits (#1, 84%), an emergency contraceptive (#1, 68%), Gas-O-Fast antacid powder (#2, 12%), an anti-acne brand (#1, 34%) and a vitamin brand (#8, 2.3%) (IQVIA retail MAT Jun-2026). Revenue grew from ₹692 cr (FY23) to ₹879 cr (FY26), 8% a year, at an ~18-20% EBITDA margin. Growth slowed in FY26-Q1FY27: a GST change hurt Q2FY26, and Mankind stopped selling to "cash and carry" wholesalers who were undercutting its own general-trade distributors. Modern trade and e-commerce grew 38% in Q1FY27 and are now 15% of consumer sales.' },
    { pair: [
      { type: 'column', title: 'Consumer revenue: ₹692 cr to ₹879 cr in three years', unit: 'Consumer healthcare revenue (₹ crore); FY27-29E = GAM', x: [...fy('consumer').map(a => a.fy), ...YRS], series: [{ name: 'Consumer', values: [...fy('consumer').map(a => a.consumer), ...build.consumer.map(Math.round)], fmt: 'num' }], labels: 'all', highlight: 'FY26', source: 'Company decks; GAM (+7% / +9% / +9%)' },
      { type: 'line', title: 'Consumer EBITDA margin: 19-20%, drifting down', unit: 'Consumer healthcare EBITDA margin (%), adjusted', x: ['FY24', 'FY25', 'FY26', 'Q1FY26', 'Q1FY27'], series: [{ name: 'Margin', values: [19.9, 19.0, 18.7, 18.0, 18.6], fmt: 'pct' }], labels: 'all', min: 15, max: 22, source: 'Q1FY27 deck (FY26 reported 18.3%)' },
    ] },
    { callout: '**Our view:** valuable brands in a slow channel. Management guides high single digit to double digit growth from Q2FY27; we model 7% in FY27E and 9% a year after. At 6% of revenue it matters less to value than its visibility suggests.' },
  ],
};

const exportsSec = {
  id: 'exports', nav: 'Exports', kicker: 'Exports', title: 'Exports (14%): BSV took them from ₹296 cr to ₹2,061 cr; the rupee did a third of Q1\'s growth',
  blocks: [
    { p: 'Before BSV, Mankind\'s exports were small (₹296 cr in FY23): US generics (49 products launched cumulatively by Q1FY27; an ophthalmic product gave a one-off bulge in FY25) and semi-regulated markets. BSV added an emerging-market specialty business (~half of its sales) in Latin America, the CIS, South-East Asia and Africa. Exports were ₹2,061 cr in FY26 (+35%, BSV\'s first full year) and ₹605 cr in Q1FY27 (+29%, of which 12-13 points from the weaker rupee). Udaipur and Ambernath received EU-GMP certification in FY26. Management guides high-teens constant-currency growth for both Mankind and BSV international.' },
    { exhibit: { type: 'column', title: 'Exports: BSV changed the scale', unit: 'Export revenue (₹ crore); FY27-29E = GAM', x: [...fy('exports').map(a => a.fy), ...YRS], series: [{ name: 'Exports', values: [...fy('exports').map(a => a.exports), ...build.exports.map(Math.round)], fmt: 'num' }], labels: 'all', highlight: 'FY26', source: 'Company decks; GAM (+20% / +14% / +13%)' } },
    { callout: '**Our view:** we model +20% in FY27E (currency plus high-teens guidance) and +14% / +13% after. Exports are ~15% of revenue and exposed to geopolitics (Q4FY26 growth was 4%) and currency; they are not a moat.' },
  ],
};

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: a real but narrow moat in reach and brands; little pricing power and a thin pipeline',
  blocks: [
    { exhibit: { type: 'table', title: 'Moat scorecard', head: ['Source of advantage', 'Score', 'Evidence'], wide: [2], rows: [
      ['Prescription franchise and reach', '**Strong**', '#1 in prescriptions for nine years (15.2%); 84% prescriber penetration; 18,500+ reps; 47% of sales in Tier II-VI and rural vs 34% for the market'],
      ['Brand building', '**Strong**', '22 brands above ₹100 cr; #2 by volume; consumer brands with 28-84% category shares'],
      ['Cost position', '**Strong**', 'In-house manufacturing; employee cost held at ~22% of sales; gross margin 71-73%'],
      ['Chronic depth', '**Medium**', '40% of sales; #3-4 in chronic covered market, behind chronic-led peers'],
      ['Specialty and biologics (BSV)', '**Medium**', 'Only recombinant Anti-D (patent to 2028), rFSH biosimilar; small scale (~13% of revenue)'],
      ['Innovation and pipeline', '**Weak**', 'R&D 2.8% of sales; new introductions below the market; in-licensing rather than own molecules; AI-led discovery tie-up (Denovo) is early'],
      ['Pricing power', '**Weak**', 'Price growth 4.2% vs market 4.4%; large NLEM exposure in acute; trade generics'],
    ], source: 'GAM assessment from AR FY26, company decks and calls (IQVIA)' } },
    { p: 'The moat is distribution and doctor relationships: any company can make amoxicillin-clavulanate, but few can sell ₹408 cr of it under one brand. That moat protects market share, not prices, and it showed its limits in FY26 when an internal overhaul cost Mankind its growth premium for a year. BSV adds a genuine technology moat in a few biologics, but at ~13% of revenue it does not yet change the character of the company.' },
    { callout: '**Verdict:** narrow moat. Mankind deserves a premium to the generic-export pharma names for its domestic franchise and balance-sheet recovery, but not the multiple of a company with proprietary products; its returns on capital (12-14% after the deal) are the honest measure of what the moat earns today.' },
  ],
};

module.exports = { india, bsv, consumer, exportsSec, moat };
