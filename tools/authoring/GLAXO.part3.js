// GSK India report, part 3: general medicines, vaccines, specialty & innovation, dealings with the parent, price control, moat.
const X = require('./GLAXO.ctx');
const { C, F, n0, n1, BL, build, innovShare, YRS, Q1 } = X;
const RP = C.relatedParty, PO = C.portfolio, PR = C.pricing;

const genmed = {
  id: 'genmed', nav: 'General medicines', kicker: 'General medicines', title: 'General medicines: 80% of revenue, iconic acute brands gaining share, but ~5% a year growth for a decade and ~40% under price control',
  blocks: [
    { p: 'General medicines are GSK India\'s cash engine: more than 80% of revenue, brands prescribed by 80% of doctors who prescribe at all (AR FY26), mostly made in India at its Nashik plant and by contract manufacturers. Augmentin is the most prescribed antibiotic in India and the third-largest brand in the market; Calpol holds nearly a third of paracetamol; T-Bact 57.5% of topical mupirocin; Ceftum doubled its volumes in FY26 despite price cuts mandated in 2023. In Q1FY27 every promoted brand grew faster than its market (evolution indices 101-106). The weaknesses are the growth rate and pricing. General medicines were "more or less flat" in FY26 (3-4% underlying) because a fire at a key contract manufacturer in Apr-2025 stopped Calpol, Cobadex CZS and other products for most of the year, costing more than ₹100 cr of sales. Older tail brands and the distributed portfolio were soft in Q4FY26. Management now expects 6-8% a year for general medicines.' },
    { pair: [
      { type: 'hbar', title: 'Market share of key brands in their own markets (Q1FY27)', unit: 'Value market share (%), IQVIA MAT Jun-2026', x: Q1.brands.filter(r => r.brand !== 'Key promoted brands').map(r => r.brand), series: [{ name: 'Share', values: Q1.brands.filter(r => r.brand !== 'Key promoted brands').map(r => r.msPct), fmt: 'pct' }], labels: 'all', highlight: 'T-Bact', source: 'Q1FY27 investor presentation' },
      { type: 'table', title: 'The supply shock in numbers', head: ['Period', 'What the company said'], wide: [1], rows: [
        ['Apr-2025', 'Fire at one of its most significant contract manufacturers (Calpol, Cobadex CZS and others)'],
        ['Q1-Q2FY26', 'Consolidated revenue −1% and −3% year on year'],
        ['Q3FY26', '₹25-30 cr of sales lost, ~3pp of growth; underlying growth ~11%'],
        ['Q4FY26', '₹28-30 cr lost (tail and distributed brands); underlying growth 5-6%'],
        ['FY26', 'More than ₹100 cr of general-medicine sales lost; general medicines flat'],
        ['Q1FY27', 'Supply remediated; no constraints; 4-5pp soft-base benefit'],
      ], source: 'Q3FY26, Q4FY26 and Q1FY27 calls; Screener.in' },
    ] },
    { callout: '**So what:** the brands are strong enough to hold or gain share in crowded, generic markets, which is rare. But this is a 6-8% growth business with capped pricing: ~40% of sales can raise prices only with wholesale inflation (+0.65% this year), the rest by up to 10%. We model the whole base business (general medicines plus established vaccines) at +10.5% in FY27 (the lost ₹100 cr+ returns) and +8% a year after.' },
  ],
};

const vaccines = {
  id: 'vaccines', nav: 'Vaccines', kicker: 'Vaccines', title: 'Vaccines: leader of the private paediatric market, growing double digits for six quarters; Shingrix is building adult vaccination from scratch',
  blocks: [
    { p: 'GSK India is the largest private vaccine company in India: "a GSK vaccine administered to an infant every seven seconds" (AR FY26), with a 26.1% value share of the private market (IQVIA Jun-2026) across hexavalent (Infanrix Hexa), Tdap (Boostrix), hepatitis A (Havrix), chickenpox (Varilrix), pneumococcal (Synflorix), MMR (Priorix), meningococcal (Menveo) and flu (Fluarix Tetra). Vaccines grew 11-12% in FY26 and double digits for six successive quarters (MD). The vaccines are imported from GSK Biologicals in Belgium (₹370 cr of purchases in FY26). Adult vaccination is new: Shingrix (shingles) sold ~100,000 doses (~₹70-75 cr) in calendar 2025, crossed ₹100 cr on a moving-annual basis by Q1FY27 and grew 65% in that quarter, after GSK repositioned it towards older patients with heart disease and diabetes, who are at higher shingles risk. Arexvy, an RSV vaccine for older adults, received marketing authorisation in 2026; management calls it "a new category creation" with 10-12 million affluent over-50s as the potential pool.' },
    { exhibit: { type: 'table', title: 'Vaccine portfolio', head: ['Segment', 'Brands', 'Evidence', 'What to watch'], wide: [2, 3], rows: [
      ['Paediatric (private, self-pay)', 'Infanrix Hexa, Boostrix, Havrix, Varilrix, Synflorix, Priorix, Menveo', '26.1% value share; double-digit unit growth for Varilrix, Havrix, Boostrix (Q3FY26)', 'Indian competitors (Serum, Bharat Biotech) and government programmes; supply phasing (Q4FY26 shipments slipped into Q1FY27)'],
      ['Flu', 'Fluarix Tetra', 'Strong private demand (Motilal Oswal, Q1FY27)', 'Seasonal; price competition'],
      ['Adult: shingles', 'Shingrix', '+65% in Q1FY27; ~45,000-50,000 doses a quarter; ₹100 cr+ MAT', 'Institutional and public accounts; cardio-metabolic positioning'],
      ['Adult: RSV', 'Arexvy (authorised 2026)', 'First adult RSV vaccine in India', 'Category creation; launch timing and price'],
    ], source: 'AR FY26; Q3FY26, Q4FY26 and Q1FY27 calls and decks; Motilal Oswal (3-Aug-2026)' } },
    { callout: '**So what:** vaccines are the best part of the base business: market leadership, double-digit growth and self-pay customers who are less price-sensitive than they look. Shingrix shows GSK can build an adult category; at ~₹100 cr it is still ~3% of sales. Management expects "strong high double-digit numbers for the vaccines business". We include established vaccines in the base business and Shingrix in innovation.' },
  ],
};

const innovation = {
  id: 'innovation', nav: 'Specialty & innovation', kicker: 'Innovation', title: `Specialty and innovation: from ~2% to 7% of sales in five quarters; we model ${n1(innovShare(2))}% by FY29E, management aims for 10-15%`,
  blocks: [
    { p: `GSK India's "innovation portfolio" is GSK plc's patented products launched in India in the last few years: adult vaccines (Shingrix), new respiratory (Nucala, a biologic for severe eosinophilic asthma; Trelegy Ellipta, a once-daily triple inhaler) and oncology (Jemperli for first-line endometrial cancer and Zejula for ovarian cancer, launched Sep-2025). It was ~2% of sales in Q4FY25 (like-for-like), 4% in Q1FY26, 6% in Q4FY26 and 7% in Q1FY27, when it contributed about 4 points of growth. Evidence by product: Nucala ~600 patients on treatment, 100-120 new patients a month (double a year earlier); Trelegy holds 10,000-12,000 units a month despite 10-12 generics of one of its molecules since Apr-2025; oncology treated 263 patients in Q1FY27 and is running at ~₹10 cr a month with ~45 representatives. Next: Blenrep (belantamab mafodotin, an antibody-drug conjugate for second-line multiple myeloma; 18,000 new patients a year) is approved and guided for launch in Q2 or Q3FY27; Arexvy is authorised; bepirovirsen, the first potential functional cure for chronic hepatitis B (~25% functional cure in trials; 40 mn Indians infected), is "three to four quarters away"; 26 clinical trials run in India, cutting the launch lag behind the US to 6-8 months.` },
    { pair: [
      { type: 'stacked', title: `Our build: innovation ₹${n0(BL.base.innovation)} cr (FY26E) to ₹${n0(build.innovation[2])} cr (FY29E)`, unit: 'Revenue (₹ crore); FY26 split GAM estimate; FY27-29E GAM', x: ['FY26', ...YRS], series: [{ name: 'Base business', values: [BL.base.base, ...build.base.map(Math.round)], fmt: 'num' }, { name: 'Innovation portfolio', values: [BL.base.innovation, ...build.innovation.map(Math.round)], fmt: 'num' }], minLabel: 150, source: 'Company (innovation share of sales); GAM estimates' },
      { type: 'column', title: 'Innovation share of revenue: company, then our build', unit: '% of revenue', x: ['Q4FY25', 'Q1FY26', 'Q4FY26', 'Q1FY27', ...YRS], series: [{ name: 'Share', values: [...PO.innovationShare.map(r => r.pct), ...YRS.map((_, i) => Math.round(innovShare(i) * 10) / 10)], fmt: 'n1' }], labels: 'all', source: 'Company decks and calls; GAM estimates (FY27-29E)' },
    ] },
    { exhibit: { type: 'table', title: 'The launch calendar as known on 30-Sep-2026', head: ['Product', 'Use', 'Status', 'What would make it matter'], wide: [3], rows: [
      ['Shingrix', 'Shingles vaccine (adults 50+)', 'On market; +65% (Q1FY27)', 'Institutional and public accounts; cardio-metabolic clinics'],
      ['Nucala / Trelegy', 'Severe asthma / COPD', 'On market; Trelegy faces generics', 'Patient access programmes; Trelegy defending share'],
      ['Jemperli / Zejula', 'Endometrial / ovarian cancer', 'Launched Sep-2025; first-line approvals', 'Public "CARE" accounts (CGHS, Army, Railways, ESIC); rectal-cancer indication later'],
      ['Blenrep', 'Multiple myeloma, second line', 'CDSCO approved; launch guided for Q2/Q3FY27', 'Haematology field force; pricing vs Darzalex-based regimens'],
      ['Arexvy', 'RSV vaccine, older adults', 'Marketing authorisation received', 'Category awareness; price'],
      ['Bepirovirsen', 'Chronic hepatitis B (functional cure)', 'Expected within FY27 (May-2026) / 3-4 quarters (Aug-2026)', 'Government partnership; pricing for a 40 mn-patient disease'],
      ['Ojjaara, efruxifermin, B7-H4 ADC', 'Myelofibrosis, MASH, solid tumours', 'Trials / 18-24 months', 'Liver franchise build-out'],
    ], source: 'Q4FY26 and Q1FY27 calls; AR FY26; Motilal Oswal (3-Aug-2026)' } },
    { callout: `**So what:** this is the growth story, and it is real but early. Even at +${BL.growth.innovation.join('% / +')}% (our build) innovation is only ~${Math.round(innovShare(2))}% of FY29E revenue, so it adds ~3 points a year to group growth. Imported, IP-protected products carry high prices but lower gross margins than local generics and need heavy medical investment; management says it will hold, not expand, margins while it launches. The upside case is management's: 10-15% of sales in FY27-28 and ₹8,000 cr of revenue in four to five years, which needs ~13% a year.` },
  ],
};

const parent = {
  id: 'parent', nav: 'Dealings with the parent', kicker: 'Parent dealings', title: 'Dealings with GSK plc: no royalty disclosed, ₹504 cr of purchases from group companies, ₹480 cr of dividends, and a history of asset sales',
  blocks: [
    { p: `Many Indian subsidiaries of foreign drug makers pay their parent a royalty or brand fee. GSK India's FY26 related-party note shows none: the flows are purchases, recharges, manufacturing charges and dividends. **Purchases** from GSK group companies were ₹${n0(RP.purchasesFy26.groupTotal)} cr in FY26 (₹${n0(RP.purchasesFy25.groupTotal)} cr in FY25): vaccines from GSK Biologicals, Belgium (₹${n0(RP.purchasesFy26.gskBiologicalsBelgium)} cr), products from GlaxoSmithKline Pharma India Pvt Ltd, an unlisted GSK company in India (₹${n0(RP.purchasesFy26.gskPharmaIndiaPvt)} cr, up from ₹${n0(RP.purchasesFy25.gskPharmaIndiaPvt)} cr), and GSK Export, UK (₹${n0(RP.purchasesFy26.gskExportUK)} cr). **Recharges:** GSK India recharged ₹${n0(RP.rechargesToGroupFy26)} cr of costs to group companies (₹${n0(RP.rechargesToGroupFy25)} cr in FY25, of which ₹148 cr to GSK Biologicals) and was charged ₹${n1(RP.rechargesByGroupFy26)} cr. **Dividends:** ₹${n0(RP.dividendsToPromotersFy26.total)} cr to the four promoter companies in FY26 (net of tax deducted). **Asset deals:** in FY22 the Iodex and Ostocalcium brands went to GlaxoSmithKline Asia, a group company, for ₹1,649 cr with minority shareholders' approval.` },
    { exhibit: { type: 'table', title: 'Related-party flows with the GSK group (₹ crore)', head: ['Flow', 'Counterparty', 'FY25', 'FY26', 'Direction'], wide: [1], rows: [
      ['Royalty / brand fee', 'GSK group', '0 (none disclosed)', '0 (none disclosed)', '–'],
      ['Vaccines purchased', 'GlaxoSmithKline Biologicals SA, Belgium', n0(RP.purchasesFy25.gskBiologicalsBelgium), n0(RP.purchasesFy26.gskBiologicalsBelgium), 'Out'],
      ['Products purchased', 'GlaxoSmithKline Pharma India Pvt Ltd; GSK Export, UK', n0(RP.purchasesFy25.gskPharmaIndiaPvt + RP.purchasesFy25.gskExportUK), n0(RP.purchasesFy26.gskPharmaIndiaPvt + RP.purchasesFy26.gskExportUK), 'Out'],
      ['Expenses recharged to the group', 'GSK Biologicals, GSK Pharma India, GSK Services and others', n0(RP.rechargesToGroupFy25), n0(RP.rechargesToGroupFy26), 'In'],
      ['Expenses recharged by the group', 'GSK Services Unlimited, UK and others', n1(RP.rechargesByGroupFy25), n1(RP.rechargesByGroupFy26), 'Out'],
      { hl: true, cells: ['**Dividends to the promoter group (net of TDS)**', '**Glaxo Group, GSK Pte, Eskaylab, Burroughs Wellcome**', `**${n0(RP.dividendsToPromotersFy25)}**`, `**${n0(RP.dividendsToPromotersFy26.total)}**`, '**Out**'] },
    ], source: 'AR FY26 standalone note 50 (related-party disclosures); AR FY22 note 55' } },
    { callout: '**Our read: GREEN on terms, AMBER on structure.** No royalty is a real plus, and the specialty launches are coming to the listed company rather than to an unlisted affiliate. But the parent controls the brands and the pipeline, decides which products are routed through the listed company or GSK Pharma India Pvt Ltd, sets the payout, and has used the listed company to sell assets to group companies. Purchases from GSK Biologicals will rise with Shingrix and Arexvy (they already exceed ₹350 cr a year), so their transfer prices matter for gross margins and for minority approval under SEBI related-party rules.' },
  ],
};

const pricing = {
  id: 'pricing', nav: 'Price control', kicker: 'Policy', title: 'Price control: ~40% of sales under NLEM; FY27\'s allowed increase is 0.65%, so growth must come from volume, mix and launches',
  blocks: [
    { p: `India caps the prices of medicines on the National List of Essential Medicines (NLEM) through the Drug Price Control Order (DPCO); the National Pharmaceutical Pricing Authority (NPPA) sets a ceiling and lets it rise each April by the wholesale price index: +${PR.wpiRevisionApr26Pct}% from 1-Apr-2026. Other medicines may rise up to 10% a year. GSK India gives three figures for its exposure: 35-38% of the portfolio (Feb-2026), "almost 40% of our business" (May-2026) and 44-45% of the general-medicine portfolio (Aug-2026). The 2022 NLEM brought two or three of its big brands under control; Ceftum took a mandated price cut in 2023 and doubled volumes since. GSK also carries a 40-year-old price-control dispute: the government's 1981-87 betamethasone price-equalisation demand (principal paid; ₹247 cr interest claim provided, ₹137 cr deposited, writ pending).` },
    { exhibit: { type: 'table', title: 'Price-control exposure (GAM illustration for FY27)', head: ['Bucket', 'Share of sales', 'Allowed / assumed price rise', 'Contribution'], rows: [
      ['NLEM (scheduled) products', '~40%', `+${PR.wpiRevisionApr26Pct}% (WPI)`, `+${n1(0.4 * PR.wpiRevisionApr26Pct)}pp`],
      ['Non-scheduled products', '~60%', '~+8% (GAM; up to 10% allowed; Q1FY27 company price growth ~6% overall)', `+${n1(0.6 * 8)}pp`],
      { hl: true, cells: ['**Portfolio price growth**', '**100%**', '', `**~+${n1(0.4 * PR.wpiRevisionApr26Pct + 0.6 * 8)}%**`] },
    ], source: 'Q3FY26, Q4FY26 and Q1FY27 calls (NLEM share; Q1 price ~6%); NPPA order S.O. 1575(E), 25-Mar-2026; GAM' } },
    { callout: '**So what:** price control explains why GSK India\'s revenue lagged the market even as its brands held share, and why its margin gains came from mix and sourcing rather than price. It also limits the downside of the innovation shift: patented imports are outside NLEM. The risk is a new NLEM list adding more large brands (management says it is "well ring-fenced" this time) and a low-WPI year like FY27.' },
  ],
};

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: a real moat in prescriber trust and vaccine leadership, plus privileged access to GSK\'s pipeline; little pricing power',
  blocks: [
    { exhibit: { type: 'table', title: 'Moat scorecard', head: ['Source of advantage', 'Score', 'Evidence'], wide: [2], rows: [
      ['Brand equity and prescriber trust', '**Strong**', '7 brands in the IPM top 100; Augmentin #3 brand; Calpol ~31% of paracetamol; T-Bact 57.5%; EIs 101-106 in Q1FY27'],
      ['Vaccine leadership', '**Strong**', '#1 in private vaccines (26.1% value share); GSK Biologicals\' global portfolio'],
      ['Access to GSK plc\'s pipeline', '**Strong (at the parent\'s discretion)**', 'Jemperli, Zejula, Blenrep, Arexvy, bepirovirsen; 26 trials in India; 6-8 month launch lag'],
      ['Cost position and capital needs', '**Strong**', 'Capex ~1.4% of sales; ROCE 61% (company); negative trade working capital'],
      ['Field force and reach', '**Medium**', '~2,000 general-medicine reps at ₹15-16 lakh a month each; GoApptiv as super-distributor for tail towns'],
      ['Pricing power', '**Weak**', '~40% of sales under NLEM; generics in every large molecule'],
      ['Supply resilience', '**Weak**', 'One CMO fire cost more than ₹100 cr of FY26 sales'],
      ['Therapy breadth', '**Weak**', 'Absent from cardiac and diabetes, the largest chronic segments'],
    ], source: 'GAM assessment from AR FY26, Q3FY26-Q1FY27 calls and decks' } },
    { p: 'The moat is in trust: doctors have prescribed Augmentin, Calpol and Betnovate for decades and keep doing so at a premium to dozens of cheaper copies, and parents pay for GSK vaccines privately. Together with very low capital needs, that is why GSK India earns a return on equity of ~45% even with ₹2,755 cr of low-yielding cash. The second advantage is newer and borrowed: GSK plc now uses India as a launch market for patented products, which no domestic competitor can copy. The moat does not protect prices, and the listed company does not own its pipeline: it is licensed from a parent that also decides what to sell and to whom.' },
    { callout: '**Verdict:** a genuine, if narrow, moat. The brands and vaccines justify a premium to generic-led pharma, and the pipeline access is a real option. But the base business has grown slower than the market for a decade, so the premium has to be earned by the launches.' },
  ],
};

module.exports = { genmed, vaccines, innovation, parent, pricing, moat };
