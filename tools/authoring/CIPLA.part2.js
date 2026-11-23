// Cipla report, part 2: what the company does, history (four eras), industry, tailwind test.
const X = require('./CIPLA.ctx');
const { C, D, A, F, n0, n1, FY26, Q1, rup } = X;
const GEO = C.geoRevenue.rows;

const business = {
  id: 'business', nav: 'What Cipla does', kicker: 'Company', title: 'What Cipla does: India\'s inhaler company, with a US generics arm and an African franchise',
  blocks: [
    { p: rup(`Cipla makes and sells medicines in ~70 countries from 48 plants. It has four businesses. **One India** (₹${n0(FY26.india)} cr in FY26, 45% of revenue) sells branded prescription drugs through ~12,000 medical representatives, unbranded "trade generics" through 15,000+ stockists to chemists, and consumer brands (Nicotex, Omnigel, Cipladine). **North America** ($${C.fy26.naUsdMn}mn, 24%) sells generics in the US: albuterol inhalers (No.1, 21% share), injectables such as lanreotide (until supply stopped), and until Dec-2025 generic Revlimid. **One Africa** ($${C.fy26.oneAfricaUsdMn}mn, 15%) is mainly South Africa, where Cipla is the No.2 prescription company, plus tenders and global-access sales of HIV and malaria drugs. **Emerging Markets & Europe** ($${C.fy26.emeuUsdMn}mn, 13%) sells under its own brand or through partners. Respiratory drugs are about a third of group revenue.`) },
    { pair: [
      { type: 'hbar', title: 'FY26 revenue: India 45%, US 24%', unit: 'Share of FY26 revenue (%)', x: ['One India', 'North America', 'One Africa', 'Emerging Markets & Europe', 'API and others'], series: [{ name: 'Share', values: [45, 24, 15, 13, 3], fmt: 'pct0' }], labels: 'all', source: 'Q4FY26 presentation; CARE (10-Sep-2026)' },
      { type: 'column', title: 'India\'s share of revenue rose from 40% to 45% in five years', unit: 'India revenue as % of total (by customer location)', x: GEO.map(g => g.fy), series: [{ name: 'India share', values: GEO.map(g => Math.round(g.india / g.total * 1000) / 10), fmt: 'pct' }], labels: 'all', min: 30, max: 50, source: 'Annual reports (segment notes)' },
    ] },
    { exhibit: { type: 'table', title: 'The four businesses at a glance', head: ['Business', 'FY26 revenue', 'Q1FY27', 'Position', 'What drives it'], wide: [3, 4], rows: [
      ['**One India**', `₹${n0(FY26.india)} cr (+9%)`, `₹${n0(Q1.india)} cr (+${Q1.indiaGrowthPct}%)`, '#1 by volume; #2 in chronic; #1 in respiratory (26% share); 33 brands above ₹100 cr', 'Chronic therapies (60% of Rx), new launches, in-licensing (Yurpeak, Pfizer brands), trade-generics reach'],
      ['**North America**', `$${C.fy26.naUsdMn}mn (−16%)`, `$${Q1.naUsdMn}mn (−28%)`, '#1 in US albuterol MDIs (21%); 1.57% of US generics, top 20', 'A few complex launches at a time: inhalers, peptides, injectables; exclusivity windows'],
      ['**One Africa**', `$${C.fy26.oneAfricaUsdMn}mn (+7%)`, `$${Q1.oneAfricaUsdMn}mn (+1%)`, '#2 in SA prescriptions (8.8%), #3 overall; 10 brands above ZAR100mn', 'SA private market (+6.5% vs market +5.7%); public tenders (lost one in FY26)'],
      ['**Emerging Markets & Europe**', `$${C.fy26.emeuUsdMn}mn (+4%)`, `$${Q1.emeuUsdMn}mn (+5%)`, 'Direct-to-market subsidiaries plus B2B partners', 'Inhalers in Europe; West Asia conflict hit Q4FY26'],
    ], source: 'Company presentations Q4FY26 and Q1FY27; AR FY26; growth in rupees for India, dollars elsewhere' } },
    { callout: '**So what:** Cipla is two businesses with different economics. India (plus Africa) is a steady, branded franchise growing ~10% with high returns. The US is a pipeline business: it earns big profits from a few hard-to-copy products for a few years, then has to replace them. FY24-26 showed both sides: the US made the windfall and then took it away.' },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'Four eras: global access, the US bet, the windfall, the reset',
  blocks: [
    { p: 'Cipla\'s numbers only make sense against its history. Each era changed the mix of businesses, the margin and the balance sheet.' },
    { exhibit: { type: 'table', title: 'The four eras of Cipla', head: ['Era', 'What happened', 'EBITDA margin', 'What it did to the numbers'], wide: [1, 3], rows: [
      ['**To FY15: India and global access**', 'Founded 1935 by Dr K A Hamied; low-cost HIV drugs for Africa from 2001; Cipla Medpro (South Africa) bought in 2013; family-run, conservative.', '~19%', 'Little debt; Africa and global access a large share of profit.'],
      ['**FY16-22: The US bet**', 'InvaGen and Exelan bought for $550mn with debt (FY16); Umang Vohra becomes CEO (2016); gAdvair delayed for years; albuterol and lanreotide built up; debt repaid by FY22.', '17% → 21%', 'Depreciation and amortisation jumped (FY17 ₹1,323 cr); profit flat until FY20; then COVID products and cost control lifted margins.'],
      ['**FY23-25: The windfall**', 'gRevlimid approved Sep-2022 and sold under a volume-limited settlement; lanreotide grows; QCIL (Uganda) sold; promoters sell 4.3% in 2024.', '22% → 26%', 'Profit doubled from ₹2,802 cr (FY23) to ₹5,273 cr (FY25); net cash from ₹5,470 cr to ₹10,369 cr.'],
      ['**FY26-27: The reset**', 'gRevlimid ends (last shipments Dec-2025 quarter); lanreotide partner\'s plant barred (import alert Apr-2026); Pithampur still under a warning letter; new CEO Achin Gupta (Apr-2026); gVentolin and gAdvair approved.', '21% → 16.7% (Q1FY27)', 'FY26 profit −26%; FY27 guided 18.5-20% margin; R&D up to 7% of sales; capex doubled.'],
    ], source: 'Company filings and presentations; GAM Research' } },
    { exhibit: { type: 'table', title: 'Corporate actions and their impact', head: ['When', 'Event', 'Impact on the numbers'], wide: [1, 2], rows: C.history.map(h => [h.year, rup(h.event), '']).filter(r => !/1935|2001/.test(r[0])).map(r => { const imp = { FY14: 'Africa becomes a consolidated front end', FY16: 'Debt peaks at ₹5,202 cr; amortisation rises', 'Sep-2016': '-', 'FY20-22': 'Debt falls to ₹1,056 cr by FY22', 'Sep-2022': 'US revenue $594mn (FY22) → $934mn (FY25)', 2023: 'Overhang on the stock; US filings moved to the US and Goa', 'FY24-25': 'EBITDA margin 24.5% and 25.9%; promoter stake 33.5% → 29.2%', FY26: 'US $780mn; profit ₹3,879 cr; exceptional charge ₹276 cr', 'Apr-2026': 'First US-made inhaler approval', 'Jul-Aug 2026': 'Q1FY27 EBITDA ₹1,192 cr (−33%)' }; return [r[0], r[1], imp[r[0]] || '-']; }), source: 'Company filings; exchange disclosures; GAM Research' } },
    { pair: [
      { type: 'column', title: 'Debt: borrowed for the US in FY16, repaid by FY22', unit: 'Borrowings incl. leases (₹ crore)', x: 'A.labels', from: 'FY15', series: [{ name: 'Borrowings', ref: 'A.borrowings', fmt: 'num' }], labels: 'all', source: 'Screener.in' },
      { type: 'column', title: 'US revenue: $594mn to $934mn and back to $780mn', unit: 'North America revenue (US$ mn)', x: ['FY22', 'FY23', 'FY24', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], series: [{ name: 'North America', values: [594, 733, 906, 934, 780, ...X.BL.usdMn], fmt: 'num' }], labels: 'all', source: 'Company presentations; GAM estimates FY27-29E' },
    ] },
  ],
};

const IND = D.industry;
const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Industry: India is growing faster; US generics pay only for complexity',
  blocks: [
    { p: rup(`**India.** ${IND.ipm} Growth is now led by chronic diseases (diabetes, heart, obesity) and by price increases on non-controlled drugs; acute drugs such as antibiotics and cough syrups depend on the season. Respiratory is a ~₹19,000-20,000 cr market (Cipla's ₹5,000 cr+ is 26% of it) growing low double digits, where inhalers replace tablets slowly as doctors and patients learn to use them; this is Cipla's home ground.`) },
    { p: rup(`**United States.** ${IND.usGenerics} The money is in products that few companies can copy: inhalers need a device, a formulation and clinical studies; long-acting injectables and peptides need specialised plants. Approval depends as much on plant inspections as on the science, which is why Pithampur matters.`) },
    { p: rup(`**Africa and other markets.** ${IND.southAfrica} ${IND.emeu}`) },
    { pair: [
      { type: 'column', title: 'Indian pharma market growth picked up to ~13% in Q1FY27', unit: 'IPM value growth (%), various measures', x: ['MAT Jun-26 (Pharmarack)', 'MAT Jun-26 (IQVIA)', 'Q1FY27 (IQVIA)', 'Cipla Rx, Q1FY27'], series: [{ name: 'Growth', values: [9.8, 11.1, 13.5, 15.4], fmt: 'pct' }], labels: 'all', highlight: 'Cipla Rx, Q1FY27', source: 'Pharmarack and IQVIA via BioSpectrum and Kotak Neo; Q1FY27 presentation' },
      { type: 'hbar', title: 'Cipla\'s top Indian brands: four respiratory in the top ten', unit: 'IQVIA MAT Jun-26 sales (₹ crore)', x: ['Foracort (resp.)', 'Duolin (resp.)', 'Budecort (resp.)', 'Dytor (cardiac)', 'Montair-LC', 'Asthalin (resp.)', 'Ibugesic Plus', 'Seroflo (resp.)', 'Dytor Plus', 'Urimax-D'], series: [{ name: 'Sales', values: [1068.8, 659.8, 578.4, 453.1, 405.3, 318.3, 297.3, 295.9, 269.1, 249.8], fmt: 'num' }], labels: 'all', source: 'IQVIA via ICICI Direct (24-Jul-2026)' },
    ] },
  ],
};

const tailwind = {
  id: 'tailwinds', nav: 'Tailwind test', kicker: 'Does the tailwind reach Cipla?', title: 'Tailwind test: Cipla captures India\'s respiratory and chronic growth, but not obesity or the US price cycle',
  blocks: [
    { p: 'A sector tailwind helps shareholders only if the company captures it. We score each driver.' },
    { verdicts: [
      ['Faster IPM growth (~13%)', 'Yes', `Cipla Rx +${Q1.rxSecondaryGrowthPct}% in Q1FY27, 183bp ahead of the market; respiratory +15%, anti-diabetes +43%, cardiac +20%.`, 'Cipla grows with the market and a little faster; the gap is driven by chronic and new launches.'],
      ['Shift to chronic therapies', 'Partly', 'Chronic is 60.4% of Cipla\'s Rx (from 58-59%); Dytor ~₹700 cr; but acute is still ~40% and seasonal.', 'Improves mix and margins slowly.'],
      ['Respiratory and inhalers', 'Yes', '26% share of Indian respiratory; all top-5 respiratory brands; new devices (Synchrobreathe, Ciphaler).', 'The category leader captures most of the growth.'],
      ['GLP-1 / obesity boom', 'Partly', 'Yurpeak (tirzepatide, in-licensed from Lilly) ~₹80 cr in Q1FY27, No.2 in its class; semaglutide generics crowded.', 'A distribution fee, not owned IP: thinner margins than own brands.'],
      ['US complex generics', 'Partly', 'gVentolin (CGT exclusivity), gAdvair approved; but Advair already has 3-4 competitors and Pithampur is under a warning letter.', 'Cipla has the capability; the economics are temporary product by product.'],
      ['Weaker rupee', 'Yes', 'Rupee at ~₹95/$ in Q1FY27 vs ~₹86/$ a year earlier; ~55% of revenue is outside India.', 'Lifts rupee revenue and EBITDA; war-related input costs offset part of it.'],
      ['Biosimilars (new US guidelines)', 'No', 'Two global biosimilar assets, one in a US clinical study; Kemwell JV; plan for 6-8 in-house assets over 5-8 years.', 'No earnings before FY30; a cost today.'],
    ], head: ['Tailwind', 'Captured?', 'Evidence', 'So what'], title: 'Tailwind scorecard: India yes, US partly', source: 'IQVIA via company; company calls; GAM Research' },
    { callout: '**Our view:** Cipla captures the Indian growth tailwind well: its share of India in revenue rose from 40% to 45% in five years and its Rx business is beating the market. The US is not a tailwind but a series of bets. The weaker rupee is a real, if unglamorous, help: every ₹1 move in the rupee against the dollar changes FY28E revenue by ~₹150-200 cr (the US, Africa and other markets are priced in dollars or local currencies).' },
  ],
};

module.exports = { business, history, industry, tailwind };
