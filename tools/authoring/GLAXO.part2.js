// GSK India report, part 2: what the company does, history & corporate actions, industry, tailwind test.
const X = require('./GLAXO.ctx');
const { C, n0, n1, SQ, QL, Q1, FY26, YRS, BL, innovShare } = X;
const BR = Q1.brands, PO = C.portfolio;
const yoyQ = SQ.slice(4).map((q, i) => Math.round((q.revenue / SQ[i].revenue - 1) * 1000) / 10);

const business = {
  id: 'business', nav: 'What GSK India does', kicker: 'The business', title: 'A 75%-owned GSK subsidiary: India\'s most trusted antibiotic and fever brands, the leading private vaccine business, and a young specialty portfolio',
  blocks: [
    { p: `GSK India sells prescription medicines and vaccines in India (98.6% of revenue; exports ₹${n0(FY26.exports)} cr). It is 75% owned by GSK plc of the UK through four holding companies. Revenue was ₹${n0(FY26.revenue)} cr in FY26 (consolidated) from three businesses. **General medicines (more than 80%)**: anti-infectives (Augmentin, the #3 brand in the Indian market and the most prescribed antibiotic; Ceftum), pain (Calpol, ~one-third of the paracetamol market), dermatology (Betnovate, T-Bact with a 57.5% share of its market, Neosporin, Tenovate, Physiogel), thyroid (Eltroxin) and vitamins (CCM, Cobadex CZS). Seven of its brands are in the market's top 100. **Vaccines**: the leading private (self-pay) paediatric vaccine business (Infanrix Hexa, Boostrix, Havrix, Varilrix, Synflorix, Priorix, Menveo, Fluarix Tetra; 26% value share) and, since 2023, adult vaccination (Shingrix, ₹100 cr+ a year). **Specialty**: respiratory biologics and inhalers (Nucala, Trelegy Ellipta) and, since Sep-2025, oncology (Jemperli, Zejula), with Blenrep (multiple myeloma) approved. General medicines are made at its own Nashik plant (334 mn packs a year) and by ~20 contract manufacturers; vaccines and specialty products are imported from GSK group companies (₹370 cr from GSK Biologicals, Belgium in FY26).` },
    { pair: [
      { type: 'hbar', title: 'Key brands in Q1FY27: all growing at or above their markets', unit: 'Value growth year on year, Q1FY27 (%), IQVIA; evolution index in brackets', x: BR.map(r => `${r.brand} (EI ${r.ei})`), series: [{ name: 'Growth', values: BR.map(r => r.growthPct), fmt: 'pct' }], labels: 'all', highlight: 'T-Bact (EI 105)', source: 'Q1FY27 investor presentation (IQVIA Jun-2026); EI = brand growth ÷ market growth × 100' },
      { type: 'column', title: 'Innovation portfolio: ~2% to 7% of sales in five quarters', unit: 'Innovation (Shingrix, Nucala, Trelegy, Jemperli, Zejula) as % of standalone sales', x: PO.innovationShare.map(r => r.q), series: [{ name: 'Share', values: PO.innovationShare.map(r => r.pct), fmt: 'pct0' }], labels: 'all', highlight: 'Q1FY27', source: 'Company decks and calls (Q4FY25 like-for-like figure from the Q4FY26 call)' },
    ] },
    { exhibit: { type: 'table', title: 'The franchises, and how they are doing', head: ['Franchise', 'Main brands', 'Size and growth', 'Position'], wide: [1, 2], rows: [
      ['Anti-infectives', 'Augmentin, Ceftum', 'Augmentin +12.8% (Q1FY27, 22% share); Ceftum volumes doubled in FY26 despite 2023 price cuts', '#3 brand in the IPM (Augmentin); amoxicillin-clavulanate faces many generics'],
      ['Pain and fever', 'Calpol, Calpol T, Calpol+', 'Calpol +8.1% (Q1FY27); hit by the CMO fire for most of FY26', '~31% share of paracetamol; most prescribed brand in India'],
      ['Dermatology', 'Betnovate, T-Bact, Neosporin, Tenovate, Physiogel', 'T-Bact +17.9%; Physiogel +21% (FY26)', '#1 in its three main dermatology segments'],
      ['Thyroid and vitamins', 'Eltroxin, CCM, Cobadex CZS', 'Eltroxin soft in Q4FY26; Cobadex hit by the CMO fire', 'Smaller, older brands'],
      ['Paediatric vaccines', 'Infanrix Hexa, Boostrix, Havrix, Varilrix, Synflorix, Priorix', 'Vaccines +11-12% in FY26; double digit for six quarters', '#1 in private vaccines (26.1% value share)'],
      ['Adult vaccines', 'Shingrix; Arexvy (authorised)', 'Shingrix +65% in Q1FY27; ~100,000 doses in CY25', 'Building a new category; cardio-metabolic patients targeted'],
      ['Specialty', 'Nucala, Trelegy Ellipta; Jemperli, Zejula; Blenrep (approved)', 'Nucala ~600 active patients; oncology ~₹10 cr a month', 'Innovation 7% of sales; imported from GSK plc'],
    ], source: 'AR FY26 (IQVIA MAT Mar-2026); Q1FY27 deck and call (IQVIA Jun-2026); Q3FY26 and Q4FY26 calls' } },
    { callout: '**So what:** GSK India is two companies in one. The large one is a mature, cash-rich brand business in acute therapies (antibiotics, fever, skin) where it has lost share of the overall market for a decade, partly to price control and generics, partly because it is absent from cardiac and diabetes. The small one is the Indian launch pad for GSK plc\'s specialty pipeline, growing ~100% a year from a low base. The investment case depends on how fast the second grows and whether the first keeps growing at 7-8%.' },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'A century in India: two mergers, a recall, a written-off plant, land and brand sales, and a turnaround in margins',
  blocks: [
    { p: 'GSK India was incorporated in 1924 and reached its present shape through the global mergers of its parents: SmithKline Beecham\'s Indian business merged in from 2001 and Burroughs Wellcome (India) from 2004. Since then the listed company has mostly shrunk its asset base: it sold its Thane land to Oberoi Realty (2019), wrote off and sold the new Vemgal plant after GSK\'s worldwide recall of ranitidine (Zinetac) in 2019, and sold the Iodex and Ostocalcium consumer brands to GSK\'s consumer arm (2021-22) as GSK plc separated its consumer business (now Haleon). Each event produced a large one-off in the accounts, which is why reported EPS is a poor guide to the trend. The share count has been 16.94 cr since a 1:1 bonus in 2018.' },
    { exhibit: { type: 'table', title: 'Corporate actions and what they did to the numbers', head: ['When', 'Event', 'Impact'], wide: [1, 2], rows: C.history.map(h => [h.date, h.event, h.impact || '–']), source: 'AR FY21-FY26; Q3FY26-Q1FY27 call transcripts; Medical Dialogues (Thane sale, 2019); scanx.trade (MD re-appointment, 3-Aug-2026)' } },
    { exhibit: { type: 'table', title: 'One-offs, year by year: why we value on EPS before them', head: ['Year', 'What happened', 'Net exceptional (₹ cr)', 'EPS reported (₹)', 'EPS before one-offs (₹)'], wide: [1], rows: C.exceptional.rows.map(r => [r.fy, r.item, r.net.toLocaleString('en-IN'), n1(r.epsReported), n1(r.epsBefore) + (r.epsBeforeExPriorTax ? ` (${n1(r.epsBeforeExPriorTax)} ex prior-year tax)` : '')]), source: 'AR FY21 note 38, FY22 notes 39 and 55, FY23 note 38, FY24 note 37, FY25 note 37, FY26 note 36. Before one-offs = consolidated continuing operations before exceptional items; FY20 standalone, all operations' } },
    { callout: '**Our read:** the listed company has been run for cash and margins, not for growth or assets, and minority holders have shared in the proceeds (₹20 and ₹60 special dividends). The structural question is how the parent splits its Indian business between the listed company and its unlisted Indian entities (GlaxoSmithKline Pharma India Pvt Ltd sold it ₹73 cr of products in FY26). So far the specialty launches have come to the listed company.' },
  ],
};

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'The Indian drug market: ₹2.57 lakh crore, growing ~10% (13.5% in Q1FY27) with regulated prices; GSK sits in the acute, price-controlled part',
  blocks: [
    { p: 'India\'s domestic drug market was worth ₹2,565 bn at chemist prices in FY26, up 9.9% (IQVIA). It accelerated in Q1FY27 to 13.5%, "fairly balanced between volume, price, and new introductions" (GSK). Acute therapies (infections, pain, skin) are still 60% of the market, but chronic therapies (heart, diabetes) grow faster, and GSK is "conspicuous by our absence" in cardiology and diabetes (MD). Four forces matter for GSK. (1) **Price control:** medicines on the National List of Essential Medicines (NLEM) may raise prices only by the wholesale price index each April (+0.65% from 1-Apr-2026); about 40% of GSK India\'s sales are covered, and the 2022 list added "two or three of our big brands". (2) **Generics:** amoxicillin-clavulanate, cefuroxime, paracetamol and umeclidinium (Trelegy, since Apr-2025) all face dozens of copies. (3) **Vaccines:** the private paediatric market is concentrated and GSK leads it; adult vaccination is a new self-pay category. (4) **Specialty and oncology:** the fastest-growing segment (+27% in Q1FY27) but small in volume, priced at ₹10-16 lakh a course and reliant on patient-assistance and public "CARE" accounts.' },
    { exhibit: { type: 'table', title: 'Industry forces and what they mean for GSK India', head: ['Force', 'Evidence', 'Effect on GSK India'], wide: [1, 2], rows: [
      ['Market growth ~10-13%', 'IPM +9.9% in FY26, +13.5% in Q1FY27; GSK\'s represented market +10%', 'Base business can grow 7-9% if supply holds'],
      ['Acute vs chronic', 'Acute 60% of IPM; chronic grows faster', 'GSK is acute-heavy; absent from cardiac and diabetes'],
      ['Price control (NLEM/DPCO)', 'WPI ceiling +0.65% for FY27; ~40% of GSK sales controlled', 'Volume-led growth; margin from mix and sourcing'],
      ['Generic competition', 'Many amoxiclav, cefuroxime and paracetamol brands; 10-12 umeclidinium generics', 'Brand equity holds share (EIs 101-106) but caps price'],
      ['Private vaccines', 'GSK 26.1% value share; double-digit growth', 'Positive; Shingrix and Arexvy build adult vaccination'],
      ['Specialty and oncology', 'Oncology +27% (Q1FY27); 18,000 new myeloma patients a year', 'Positive but small; launches need access programmes'],
      ['Supply-chain concentration', 'Apr-2025 CMO fire', 'More than ₹100 cr of FY26 sales lost'],
    ], source: 'IQVIA via Mankind AR FY26 and GSK decks; GSK Q3FY26-Q1FY27 calls; NPPA order S.O. 1575(E) (25-Mar-2026)' } },
    { callout: '**So what:** GSK India plays where the Indian market is slowest and most regulated (acute, price-controlled) and, now, where it is fastest and least regulated (specialty, oncology, adult vaccines). Its blended growth will sit between the two: below the market until innovation is a meaningful share of sales.' },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Does the market tailwind reach GSK India? Yes in Q1FY27, after a decade of lagging; the proof will be FY27-28',
  blocks: [
    { p: `For years GSK India grew well below the market: revenue +5.5% a year in FY21-26 against ~9-10% for the IPM, and +1.9% in FY26 (the CMO fire). Q1FY27 broke the pattern: standalone revenue +15% against IPM growth of 13.5%, though 4-5 points came from the soft base. Underlying growth of 9-10% is close to the market for the first time in years, helped by ~4 points from innovation. Volume grew 3-3.5%, price ~6% and new introductions the rest (MD).` },
    { pair: [
      { type: 'column', title: 'Revenue growth: from a fire-hit FY26 to +16.5% in Q1FY27', unit: 'Revenue growth year on year (%), consolidated', x: QL.slice(4), series: [{ name: 'Revenue growth', values: yoyQ, fmt: 'pct' }], labels: 'all', highlight: 'Q1FY27', source: 'Screener.in quarterly results' },
      { type: 'column', title: 'Q1FY27: GSK ahead of its market, close to the IPM underlying', unit: 'Growth year on year, Q1FY27 (%)', x: ['IPM (IQVIA)', 'GSK represented market', 'GSK standalone reported', 'GSK underlying (ex soft base)'], series: [{ name: 'Growth', values: [13.5, 10, 15, 9.5], fmt: 'pct' }], labels: 'all', highlight: 'GSK underlying (ex soft base)', source: 'Q1FY27 deck and call (underlying = midpoint of the 9-10% stated)' },
    ] },
    { exhibit: { type: 'table', title: 'Tailwind scorecard', head: ['Tailwind', 'Reaches GSK India?', 'Evidence'], wide: [2], rows: [
      ['Market growth back in double digits', '**Partly**', 'Q1FY27 underlying 9-10% vs IPM 13.5%'],
      ['Acute season (Q2)', '**Yes**', 'Augmentin, Calpol, T-Bact all above market (EIs 105-106)'],
      ['Chronic therapies', '**No**', 'Absent from cardiac and diabetes'],
      ['Preventive care and vaccines', '**Yes**', 'Vaccines +11-12% (FY26); Shingrix +65%'],
      ['Specialty and oncology', '**Yes, small**', 'Innovation 7% of sales; Blenrep and Arexvy next'],
      ['Pricing', '**Partly**', '~6% price in Q1FY27 on the uncontrolled part; NLEM +0.65%'],
      ['Supply', '**Restored**', 'CMO supply normal from Q1FY27 (MD)'],
    ], source: 'GSK Q1FY27 deck and call; AR FY26' } },
    { callout: `**Verdict:** the tailwind now reaches GSK India, mostly through vaccines and innovation and a recovered base. We model the base business at +${BL.growth.base.join('% / +')}% and innovation at +${BL.growth.innovation.join('% / +')}% for FY27-29E, so revenue grows +{{F.salesGrowth.0|pct}} / +{{F.salesGrowth.1|pct}} / +{{F.salesGrowth.2|pct}} and innovation reaches ~${Math.round(innovShare(2))}% of sales. Motilal Oswal (+14.3% / +13.3%) and management's 12-13% ambition are higher.` },
  ],
};

module.exports = { business, history, industry, tailwind };
