// Emcure report, part 2: what the company does, history & corporate actions, industry, tailwind test.
const X = require('./EMCURE.ctx');
const { C, D, F, A, n0, n1, SA, SQ, QL, Q1, FY26, YRS, LINES, LBL, BL, build, mixPct } = X;

const business = {
  id: 'business', nav: 'What Emcure does', kicker: 'The business', title: 'A US$1 bn Pune drug maker: a mid-sized Indian brand business (44%) plus generics fronts in Europe and Canada and an ARV tender business (56%)',
  blocks: [
    { p: `Emcure develops, makes and sells medicines in two very different ways. **In India (44% of FY26 revenue)** it sells branded generics to doctors through ~4,000 medical representatives: #13 in the Indian market, #2 in gynaecology, strongest in women's health (the Orofer iron franchise), cardiology (its own chiral molecules plus Sanofi's Cardace, Clexane and Lasilactone, distributed since Mar-2024), diabetes (Sanofi's Amaryl and Cetapin since 2025, Novo Nordisk's semaglutide brand Poviztra since Nov-2025), CNS (Tenectase for stroke) and oncology/nephrology. About 15% of India sales are in-licensed MNC brands. **Abroad (56%)** it sells generics through its own subsidiaries: Tillomed in the UK and Europe (20% of revenue; complex injectables such as liposomal amphotericin B), Marcan and Mantra in Canada (16%; a top-10 generic company), and in 80+ emerging markets (20%), where roughly half is anti-HIV (ARV) medicines sold in tenders. It does not sell in the US (that business was demerged to a promoter-owned company in 2020-21). Manufacturing is in 13 Indian plants, with in-house APIs and biologics (Gennova).` },
    { pair: [
      { type: 'hbar', title: 'FY26 revenue by geography: India is less than half', unit: 'FY26 revenue (₹ crore)', x: LINES.map(l => LBL[l]), series: [{ name: 'FY26', values: LINES.map(l => Math.round(BL.base[l])), fmt: 'num' }], labels: 'all', highlight: 'India', source: 'Q4FY26 investor presentation' },
      { type: 'stacked', title: 'International has grown faster every year', unit: 'Revenue by geography (₹ crore)', x: SA.map(r => r.fy), series: [{ name: 'India', values: SA.map(r => r.india), fmt: 'num' }, { name: 'Europe', values: SA.map(r => r.europe), fmt: 'num' }, { name: 'Canada', values: SA.map(r => r.canada), fmt: 'num' }, { name: 'Rest of world', values: SA.map(r => r.row), fmt: 'num' }], labels: 'all', source: 'Company decks (FY24-26)' },
    ] },
    { exhibit: { type: 'table', title: 'Four businesses and how big each is', head: ['Business', 'What it sells', 'FY26 revenue', 'Growth', 'Position'], wide: [1, 4], rows: [
      ['India (Emcure + Zuventus)', 'Iron (Orofer XT, Orofer FCM), chiral cardiac molecules (Metpure, Numlo), Tenectase, Bevon, Maxtra; in-licensed Sanofi cardiac and diabetes brands, Poviztra, Roche nephrology', '₹4,027 cr (44%)', `FY26 +10%; Q1FY27 +${Q1.indiaGrowthPct}% (6-7% organic)`, '#13 in IPM; #2 gynaecology (8.3% share); 19 of top 20 brands top-3 in category'],
      ['Europe (Tillomed)', 'Complex injectables and specialty generics; hospital and retail in the UK; partners elsewhere; Manx portfolio (2025)', '₹1,850 cr (20%)', `FY26 +25.5%; Q1FY27 +${Q1.europeGrowthPct}% (~12pp currency)`, 'First EU generic liposomal amphotericin B; 55+ products in development'],
      ['Canada (Marcan, Mantra)', 'Generics across hospital, retail and OTC; pan-Canadian since Mantra (Quebec, 2023); Cutimed (2026)', '₹1,487 cr (16%)', `FY26 +18.7%; Q1FY27 +${Q1.canadaGrowthPct}%`, 'Top-10 generic company; #1 Indian company by prescriptions'],
      ['Rest of world', 'ARV (anti-HIV) tenders in Africa and Latin America (50-55% of the region); branded non-ARV generics in Asia, Africa, LATAM', '₹1,840 cr (20%)', `FY26 +21.8%; Q1FY27 +${Q1.rowGrowthPct}%`, 'Voluntary licensee for Gilead\'s lenacapavir and MSD\'s monthly PrEP pill'],
    ], source: 'Q4FY26 and Q1FY27 decks and calls; Sep-2026 investor presentation (IQVIA MAT Mar-2026)' } },
    { callout: '**So what:** Emcure is a mix of a mid-sized Indian brand business (good, but sub-scale against the top-10 players and growing at market pace) and an international generics platform that has been the growth engine for three years. The international half earns lower gross margins and grows in lumps (tenders, launches, currency). Investors are paying for both; the street usually values the whole on P/E as if it were an Indian branded company.' },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'From a 1981 Pune start-up to a 2024 IPO: private equity for a decade, a US exit, and a run of buyouts since listing',
  blocks: [
    { p: 'Satish Mehta founded Emcure in 1981 and entered Indian branded generics in 1995. Subsidiaries Gennova (biotech) and Zuventus (acute brands) were set up in 2001-02 with outside shareholders. Blackstone invested in 2006; Bain Capital bought its ~13% stake in 2013-14 for ~₹700 cr. Emcure expanded abroad by acquisition: Tillomed (UK, 2014), Marcan (Canada, 2015) and Mantra (Quebec, 2023). Its US business (Heritage, now Avet) was demerged to a promoter-owned company in 2020-21 together with the US drug-pricing litigation. An IPO filed in 2021 was not pursued; the Jul-2024 IPO raised ₹800.6 cr of new money and let Bain and the promoters sell 1.14 cr shares. Since listing, Emcure has bought out the minorities in Zuventus and Gennova and added three in-licensing deals (Sanofi diabetes, Novo Nordisk, Roche).' },
    { exhibit: { type: 'table', title: 'Corporate actions and what they did to the numbers', head: ['When', 'Event', 'Impact'], wide: [1, 2], rows: C.history.map(h => [h.date, h.event, h.impact || '–']), source: 'Company filings, annual report FY26 and Sep-2026 investor deck; Sanofi India press release (Mar-2024); Outlook Business (Jun-2026); GAM' } },
    { h: 'The IPO in one table' },
    { exhibit: { type: 'table', title: 'Emcure IPO, July 2024', head: ['Item', 'Detail'], wide: [1], rows: [
      ['Price / listing', '₹1,008 a share (₹918 for employees); listed 10-Jul-2024; first weekly close ₹1,362'],
      ['Fresh issue', '78.37 lakh shares + 1.09 lakh employee shares: ₹800.6 cr gross, ₹758.9 cr net of costs'],
      ['Offer for sale', '1.14 cr shares (₹1,151.5 cr): BC Investments IV (Bain) up to 72.3 lakh, promoters incl. Satish Mehta (up to 4.2 lakh) and Namita Thapar (up to 12.7 lakh)'],
      ['Use of proceeds', '₹600 cr to repay borrowings; ₹158.9 cr general corporate purposes; fully used by Mar-25'],
      ['Effect', 'Net debt ₹1,558 cr (Mar-24) → ₹434 cr (Mar-25); finance cost ₹237 cr (FY24) → ₹176 cr (FY25) → ₹144 cr (FY26)'],
      ['Since', 'Stock ₹1,943 on 30-Sep-2026 (+93% on the IPO price); Bain sold its remaining 8.7% in five blocks (Jul-2025 to Jun-2026)'],
    ], source: 'AR FY26 note 64; prospectus summaries (Kotak, Jul-2024); Screener.in; Outlook Business' } },
    { callout: '**Our read:** the history explains today\'s structure. Private equity backed a founder-led company for 18 years and has now exited; the US business and its legal problems sit with the promoters, not with Emcure, but a commercial link remains (Emcure sold ₹276 cr of products to Avet in FY26). The post-IPO priority has been control (100% of every subsidiary) and distribution deals with MNCs, rather than large new platforms.' },
  ],
};

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Three markets: Indian branded generics (~10% growth), regulated-market generics in Europe and Canada (low growth, price deflation), and donor-funded ARV tenders',
  blocks: [
    { p: `**India.** The domestic formulations market was ₹2.57 lakh cr in FY26 (+9.9%, IQVIA); growth comes from price (4-5% a year, capped for essential drugs), new products and low-single-digit volume. Emcure expects 8-9% industry growth in FY27; the market grew 13.0% in Q1FY27 (excluding tirzepatide). Two shifts matter for Emcure: chronic therapies (cardiac, diabetes) gain share, and multinationals increasingly hand mature brands to Indian partners with larger field forces (Sanofi, Novo Nordisk and Roche all chose Emcure). Semaglutide went off patent in Mar-2026 and 40-50 generic brands launched. **Europe and Canada.** Generic markets of US$70 bn+ (Europe) where the money is in hard-to-make products (complex injectables, first generics); plain generics face steady price erosion. Emcure has its own front ends in the UK, Italy and Canada. **Rest of world.** Anti-HIV medicines bought in large tenders (Global Fund, governments) at thin prices, plus branded generics in 80+ countries; the next leg is long-acting HIV prevention (lenacapavir, monthly pills) under voluntary licences.` },
    { exhibit: { type: 'table', title: 'Where Emcure stands in India (IQVIA MAT Mar-2026)', head: ['Measure', 'Emcure', 'Comment'], wide: [2], rows: [
      ['Rank in the Indian market', '#13', 'Mid-sized; well behind the top-10 in reach and portfolio breadth'],
      ['Gynaecology rank / share', '#2 / 8.3%', 'Orofer iron franchise; anaemia affects 50%+ of Indian women'],
      ['Cardiac covered market rank / share of sales', '#7 / 19.1%', 'Own chiral molecules plus Sanofi\'s Cardace, Clexane, Lasilactone'],
      ['Anti-diabetic rank / share of sales', '#13 / 7.9%', 'Sanofi\'s Amaryl and Cetapin; Poviztra (semaglutide)'],
      ['Chronic share of India sales', '~60%+', '~46% in FY23 (reclassifying ARV and gynaecology)'],
      ['Field force productivity', '₹7.0 lakh / rep / month', '₹5.4 lakh in FY24; ~4,000 reps'],
      ['Price growth (Q1FY27)', '4-5%', 'New launches 1-2%; the rest volume'],
    ], source: 'Sep-2026 investor presentation; Q1FY27 call' } },
    { bullets: [
      '**Covered-market share and brands per doctor are below peers** (Kotak\'s question on the Q1FY27 call); management\'s answer is in-licensing to raise co-prescription.',
      '**In-licensed brands grow with the market, not faster** (management, Aug-2026), and they are distribution rights: Sanofi\'s cardiac deal has an initial term of five years from Mar-2024.',
      '**GLP-1s:** Emcure sells the innovator\'s rDNA semaglutide (Poviztra) against 40-50 cheaper synthetic generics; price cut in Apr-2026; MASH indication added in Jul-2026; revenue not disclosed.',
      '**Currency:** a weaker rupee lifts international revenue (6-7pp of group growth in Q1FY27) and produced ₹119 cr of exchange gains in FY26; management assumes ₹92/US$ for FY27.',
    ] },
    { callout: '**So what:** none of Emcure\'s markets is a high-growth one on its own. Growth has to come from share gains: launches of hard-to-make products abroad, in-licensed brands and field-force productivity at home. That makes execution, not the industry, the main driver of the numbers.' },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Does the sector tailwind reach Emcure? Abroad, yes (and the rupee helps); in India, only at market pace after a messy Zuventus year',
  blocks: [
    { p: `India grew 10% in FY26, broadly in line with the market, but the quality was mixed: the Sanofi diabetes brands (from Q2FY26) and Roche (from Apr-2026) added growth, while Zuventus, the acute-focused subsidiary with ~40% of the field force, shrank after the minority buyout (Oct-2025), the founder-CEO's exit and a restructuring that drove attrition. India grew only 5.2% in Q4FY26. Q1FY27 was +${Q1.indiaGrowthPct}%, about 6-7% excluding Sanofi diabetes and Roche; management promises market-pace growth in Q2 and faster growth in H2 on a weak base. International grew 22% in FY26 and 34% in Q1FY27 (~21% in constant currency), on liposomal amphotericin B in Europe, share gains in Canada and the ARV order book.` },
    { pair: [
      { type: 'column', title: 'India revenue: Q4FY26 dip, back to +10% in Q1FY27', unit: 'India revenue (₹ crore), quarterly; Q1-Q3 FY25 derived', x: QL, series: [{ name: 'India', values: SQ.map(q => q.india), fmt: 'num' }], labels: 'all', highlight: 'Q1FY27', source: 'Company decks; GAM' },
      { type: 'hbar', title: 'Q1FY27 growth by geography: international carried the quarter', unit: 'YoY growth, Q1FY27 (%)', x: ['Rest of world', 'Europe', 'Canada', 'Group', 'India', 'India excl. Sanofi diabetes & Roche'], series: [{ name: 'Growth', values: [Q1.rowGrowthPct, Q1.europeGrowthPct, Q1.canadaGrowthPct, Q1.revenueGrowthPct, Q1.indiaGrowthPct, 6.5], fmt: 'pct' }], labels: 'all', highlight: 'India', source: 'Q1FY27 deck and call (organic India "about 6%, 7%")' },
    ] },
    { exhibit: { type: 'table', title: 'Tailwind scorecard', head: ['Tailwind', 'Reaches Emcure?', 'Evidence'], wide: [2], rows: [
      ['Chronic shift in India', '**Partly**', 'Chronic share 60%+ (46% in FY23), much of it from in-licensed Sanofi brands; own cardiac brands (Metpure, Numlo) growing'],
      ['MNCs out-licensing Indian brands', '**Yes**', 'Sanofi (cardiac 2024, diabetes 2025), Novo Nordisk (Poviztra 2025), Roche (2026); ~15% of India sales; distribution margins only'],
      ['GLP-1 / obesity', '**Not yet**', 'Innovator brand in a market flooded with generics; no revenue disclosed; Canada generic via Dr. Reddy\'s delayed'],
      ['Complex generics in Europe', '**Yes**', 'Europe +25.5% FY26, +32.8% Q1FY27; amphotericin B tenders in "pretty much all" EU countries'],
      ['Canadian share gains', '**Yes**', '+18.7% FY26, +24.6% Q1FY27; pan-Canadian front end'],
      ['HIV prevention (long-acting)', '**Later**', 'Lenacapavir registration in FY27; monthly PrEP pill in late-stage development'],
      ['Weaker rupee', '**Yes, but temporary**', '6-7pp of Q1FY27 group growth; ₹119 cr exchange gains in FY26'],
    ], source: 'Company decks and calls (Q4FY26, Q1FY27); Sep-2026 deck' } },
    { callout: `**Verdict:** the international tailwinds reach Emcure today; the Indian one only partly. We model India at +10.5% / +11% / +10.5% (FY27-29E), market growth plus a little, not the 1.1-1.2x outperformance management targets, and international at +${n1(((build.europe[0] + build.canada[0] + build.row[0]) / (BL.base.europe + BL.base.canada + BL.base.row) - 1) * 100)}% in FY27E (with currency) slowing to ~12% (without). International rises from 56% to ~${Math.round(100 - mixPct('india')[2])}% of revenue by FY29E.` },
  ],
};

module.exports = { business, history, industry, tailwind };
