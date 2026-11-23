// Sun Pharma report, part 2: what the company does, history and corporate actions, industry, tailwind test.
const X = require('./SUNPHARMA.ctx');
const { C, D, F, A, SA, n0, n1, pc, rup, b, build, LINES, LINE_NAME, buildTot, indiaShare, FY26 } = X;
const shareOf = (k, i) => (build[k][i] / buildTot[i] * 100);

const business = {
  id: 'business', nav: 'What Sun does', kicker: 'The business', title: 'Four businesses of similar size, and a global specialty arm that runs through three of them',
  blocks: [
    { p: `Sun makes and sells medicines in 100+ countries from 40 plants. Its FY26 gross sales of ₹58,220 cr came from five lines: **India formulations** (₹19,290 cr, 33%; branded generics sold through ~16,800 medical representatives), **US formulations** (₹16,824 cr, 29%; $1.9 bn, now more than half innovative medicines, the rest generics incl. Taro), **Emerging Markets** (₹11,187 cr, 19%; branded generics in 80+ countries, focus on Romania, Russia, South Africa, Brazil and Mexico), **Rest of World** (₹8,568 cr, 15%; Western Europe, Canada, Japan, Australia, Israel) and **API** (₹2,185 cr, 4%). Cutting across the US, RoW and EM is the **innovative medicines** business: 29 branded products in dermatology, ophthalmology and onco-dermatology, $1,420 mn of sales in FY26 (22% of the total), led by the psoriasis biologic Ilumya ($796 mn).` },
    { pair: [
      { type: 'hbar', title: 'FY26 sales mix: India the largest single piece', unit: '% of FY26 gross sales', x: ['India', 'US', 'Emerging Markets', 'Rest of World', 'API & other'], series: [{ name: 'Share', values: [33.1, 28.9, 19.2, 14.7, 4.0], fmt: 'pct' }], labels: 'all', highlight: 'India', source: 'Q1FY27 investor presentation p.54' },
      { type: 'column', title: 'Innovative medicines: 13% of sales in FY22, 22% in FY26', unit: 'Innovative medicines, % of sales', x: ['FY22', 'FY23', 'FY24', 'FY25', 'FY26'], series: [{ name: 'Share of sales', values: SA.map(a => a.innovPct), fmt: 'pct' }], labels: 'all', source: 'Investor presentation Jun-2026 p.20' },
    ] },
    { exhibit: { type: 'table', title: 'The businesses at a glance', head: ['Business', 'FY26 sales', 'FY26 growth', 'Q1FY27 growth', 'What drives it', 'Our FY27E-29E'], wide: [4], rows: [
      ['India formulations', '₹19,290 cr', '+14.0%', '+16.0%', 'No.1 (8.5% share); chronic therapies (neuro, cardiac, gastro, diabetes); volume + new launches (semaglutide)', '+14% / +12% / +11.5%'],
      ['US formulations', '$1,905 mn', '−0.8% ($)', '−9.7% ($)', 'Innovative medicines up; generics down (gRevlimid ended Jan-2026; FDA issues limit approvals)', '$ −4% / +6% / +6%'],
      ['Emerging Markets', '$1,265 mn', '+13.6% ($); +8.2% cc', '+4.2% ($)', 'Branded generics; Ilumya in Romania, Brazil; semaglutide in South Africa, Brazil; currency and geopolitics', '$ +6% / +7% / +7%'],
      ['Rest of World', '$969 mn', '+14.4% ($)', '0% ($)', 'Ilumya and Odomzo in Europe, Japan, Canada, ANZ; generics in Canada, Israel, Japan', '$ +3% / +6% / +6%'],
      ['API', '₹2,185 cr', '+2.6%', '+10.5%', '400+ APIs, 13 sites; supports cost and supply', '+8% / +7% / +6%'],
      { hl: true, cells: ['**Innovative medicines (inside US/RoW/EM)**', '**$1,420 mn**', '**+16.8%**', '**+12.8%**', 'Ilumya $796 mn; Cequa, Odomzo, Winlevi, Levulan; new: Leqselvi (Jul-2025), Unloxcyt (Jan-2026)', 'Not modelled separately'] },
    ], source: 'Company presentations and calls (FY26, Q1FY27); GAM estimates. cc = constant currency.' } },
    { callout: `**So what:** Sun is not one business but a portfolio. India (${n1(indiaShare(0))}% of FY27E revenue in our build) is a high-margin, steady compounder; innovative medicines are the growth engine and the reason Sun trades at a premium to generic peers; US generics, once the core, are now a shrinking, low-margin drag held back by factory problems. Organon would add a fifth, larger piece: mature off-patent brands, women's health and biosimilars.` },
  ],
};

const history = {
  id: 'history', nav: 'History', kicker: 'History & corporate actions', title: 'Built by acquisition: Caraco, Taro, Ranbaxy, then specialty assets, now Organon',
  blocks: [
    { p: 'Dilip Shanghvi started Sun in 1983 with five psychiatry products and ₹10,000 of capital. Its rise has been a sequence of acquisitions, mostly of troubled assets bought cheaply and fixed: Caraco (US entry, 1997), Taro (2010), DUSA (2012), Ranbaxy (2015, all-stock) and a string of specialty products in 2014-25. Organon (2026) is the largest by far and the first funded with heavy debt.' },
    { exhibit: { type: 'table', title: 'Key events and what they did to the numbers', head: ['Year', 'Event', 'Impact'], wide: [1, 2], rows: C.history.map(r => [r[0], rup(r[1]), rup(r[2])]), source: 'Investor presentations (key deals); AR FY26; Screener.in cash flows; company press releases' } },
    { callout: '**The pattern to remember:** Sun\'s best deals were cheap and small relative to the company (Taro, DUSA, Ilumya\'s licence, Concert). Ranbaxy was large, took five years to fix (Halol and Mohali still carry its legacy) and diluted shareholders ~15%. Organon is Ranbaxy-sized, but paid in cash and debt, so the dilution risk is replaced by a leverage risk.' },
  ],
};

const IND = D.industry, shares = IND.indiaShares.rows;
const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Three different markets: a growing Indian branded market, a deflating US generics market and a niche specialty market',
  blocks: [
    { h: 'India: ₹2.5 lakh crore, growing ~10% a year, fragmented' },
    { p: `The Indian pharmaceutical market was ₹${n0(IND.ipm.sizeRsBn * 100)} cr in the 12 months to Jun-2026 (Pharmarack). Growth is mostly price and new products; volume grew only ~2% in Q1FY27. The market is fragmented: the top 12 companies hold ~54%. Sun leads with 8.5%, ahead of Abbott (5.9%), Cipla (5.8%) and Mankind (5.5%). Chronic therapies (cardiac, diabetes, neuro, gastro) grow faster than acute ones and are where Sun is strongest. GLP-1 generics (semaglutide went off patent in India in Mar-2026) pushed diabetes growth to ~15%.` },
    { pair: [
      { type: 'hbar', title: 'India: Sun has 8.5%, nobody else above 6%', unit: 'Share of Indian formulation sales, 12 months to Jun-2026 (%)', x: shares.map(r => r[0]), series: [{ name: 'Share', values: shares.map(r => r[2]), fmt: 'pct' }], labels: 'all', highlight: 'Sun Pharma', source: 'AIOCD AWACS via Sun investor presentation Sep-2026' },
      { type: 'hbar', title: 'Sun India by therapy: neuro, cardiac, gastro = half', unit: '% of Sun India sales (MAT Mar-2026)', x: IND.sunIndiaMix.rows.map(r => r[0]), series: [{ name: 'Share', values: IND.sunIndiaMix.rows.map(r => r[1]), fmt: 'pct0' }], labels: 'all', source: 'AIOCD AWACS via Sun investor presentation Jun-2026' },
    ] },
    { h: 'US generics: volume grows, prices fall every year' },
    { p: `US generics are a commodity market: buying groups negotiate hard, each new competitor cuts prices, and growth comes only from new approvals and limited-competition launches (such as gRevlimid in 2022-26). Sun is the 13th largest player, with 558 approved ANDAs and 119 pending (Jun-2026), but its Indian plants' FDA problems have slowed approvals. From 29-Sep-2026 the US charges a 100% Section 232 tariff on imported **patented** drugs (15% for the EU and Japan, 0% for companies with pricing-and-onshoring agreements); **generics and biosimilars are excluded**, for now: the Commerce Department must report within a year on whether to extend them.` },
    { h: 'Specialty: dermatology, ophthalmology, onco-derm; women\'s health and biosimilars with Organon' },
    { p: `Sun's innovative medicines compete in niches: IL-23 biologics in psoriasis (Ilumya vs J&J's Tremfya and AbbVie's Skyrizi, and cheap Stelara biosimilars), JAK inhibitors in alopecia (Leqselvi vs Lilly's Olumiant, Pfizer's Litfulo and soon AbbVie's Rinvoq), PD-1/PD-L1 drugs in skin cancer (Unloxcyt vs Libtayo and Keytruda). Organon would add women's health (a $35 bn market growing 6-10%, Organon No.2 in contraception, No.3 in fertility) and biosimilars ($320 bn of drugs lose exclusivity by 2035, a ~$70 bn biosimilar opportunity per Sun).` },
    { callout: '**So what:** two of Sun\'s three markets are attractive (India branded, global specialty). The third (US generics) is structurally deflationary and needs a clean factory record, which Sun currently lacks in India.' },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Does the sector tailwind reach Sun? In India yes, in the US no, in specialty only if the launches work',
  blocks: [
    { exhibit: { type: 'table', title: 'Tailwind test', head: ['Tailwind', 'Is it real?', 'Does it reach Sun?', 'Evidence'], wide: [3], rows: [
      ['Indian market growth (~10%), chronic shift', 'Yes', 'Yes, more than peers', 'Sun India +14% in FY26, +16% in Q1FY27; share 8.1% → 8.4% → 8.5%; volume +5.4% vs market +2%'],
      ['GLP-1 generics (semaglutide off patent in India Mar-2026, then Brazil, South Africa, Canada)', 'Yes', 'Partly', 'No.2 generic semaglutide player in India, auto-injector; approvals in Brazil and South Africa; many rivals, prices falling'],
      ['US generics (new launches, shortages)', 'Weak', 'No', 'US sales $1.92 bn (FY25) → $1.91 bn (FY26) → $427 mn in Q1FY27 (−9.7%); four plants under FDA action'],
      ['Global specialty demand (IL-23, JAK, PD-L1)', 'Yes', 'Yes, but slowly', 'Innovative sales +16.8% in FY26 but flat sequentially for three quarters; Leqselvi >1,000 prescribers, Unloxcyt still small'],
      ['Weak rupee', 'Yes (FY26-27)', 'Yes, in rupee terms', 'Rupee ~88.5 → ~95.8 per $: adds ~5 points to FY27 rupee growth; FY26 forex gain ₹1,240 cr; not a recurring source of value'],
      ['US tariffs on patented drugs', 'Headwind', 'Marginally (management)', '100% on patented imports from 29-Sep-2026 unless exempt; Sun: "marginal impact" in FY27'],
    ], source: 'Company calls and presentations; IQVIA/AIOCD via company; JD Supra (Section 232)' } },
    { callout: '**Verdict:** Sun captures the Indian tailwind better than any large peer and has the only scaled global specialty business among Indian companies. It does not capture the US generics opportunity and will not until the FDA issues are resolved. Much of FY27\'s rupee growth is currency.' },
  ],
};

module.exports = { business, history, industry, tailwind };
