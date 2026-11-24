// Ipca Laboratories report, part 2: what the company does, history & the Unichem deal, industry, tailwind test.
const X = require('./IPCALAB.ctx');
const { C, F, A, n0, n1, SA, SQ, QL, Q1, FY26, UD, LINES, LBL, BL, YRS, stakeMv, uniMcap } = X;
const SEG = C.segmentsFy26;

const business = {
  id: 'business', nav: 'What Ipca does', kicker: 'The business', title: 'Ipca in one page: a pain-and-rheumatology franchise in India, branded and generic exports, its own APIs, and 52.67% of Unichem',
  blocks: [
    { p: `Ipca is an integrated drug maker: it makes most of the active ingredients (APIs) in its own medicines and sells them in more than 100 countries. FY26 revenue was ₹9,646 cr (company) in five businesses. (1) **India branded formulations** (₹3,817 cr, 40%): rank 16 in the Indian pharmaceutical market (IPM) with a 2.08% share, ~7,000 medical representatives in 22 divisions, 172 brands; 53% of sales in pain and rheumatology (the Zerodol family, HCQS, Folitrax), 17% cardio-diabetic, then derma, urology, anti-bacterials, CNS. (2) **Branded exports** (₹664 cr): its own field forces in French-speaking Africa, CIS, Asia and LatAm. (3) **Generic exports** (₹1,149 cr ex-tenders): UK/EU (own label in the UK), Australia/NZ, Canada and, since the FY24 lifting of the USFDA import alerts, the US. (4) **Institutional** (₹270 cr): anti-malarial tenders for donor-funded programmes. (5) **APIs** (₹1,396 cr, 75% exported): ~80 molecules from Ratlam and other plants, sold to drug makers worldwide. On top sit the **subsidiaries** (₹2,303 cr net): mainly Unichem Laboratories (US generics, Europe, Brazil), plus Trophic Wellness (nutraceuticals), Onyx (UK research services) and Pisgah (US APIs).` },
    { pair: [
      { type: 'hbar', title: 'FY26 revenue by business: India is 40%, but exports and APIs are as large', unit: 'FY26 revenue (₹ crore); subsidiaries net of inter-company sales', x: LINES.map(l => LBL[l]), series: [{ name: 'FY26', values: LINES.map(l => Math.round(BL.base[l])), fmt: 'num' }], labels: 'all', highlight: LBL.domForm, source: 'AR FY26 MD&A; Q4FY26 call; GAM (subsidiaries = consolidated less standalone)' },
      { type: 'hbar', title: 'Domestic sales by therapy: pain is over half', unit: 'FY26, % of domestic branded sales', x: Object.keys(SEG.domesticTherapyMixPct), series: [{ name: 'Share', values: Object.values(SEG.domesticTherapyMixPct), fmt: 'pct0' }], labels: 'all', highlight: 'Pain management', source: 'AR FY26 MD&A' },
    ] },
    { exhibit: { type: 'table', title: 'Six engines, how big each is and how it is doing', head: ['Engine', 'What it sells', 'FY26 (₹ cr)', 'Q1FY27 growth', 'Position'], wide: [1, 4], rows: [
      ['India branded formulations', 'Pain/rheumatology (Zerodol-SP/P/TH, HCQS, Folitrax, Saaz), cardio (CTD, CTD-T), anti-diabetic, derma, urology, CNS, cough (Solvin Cold)', '3,817', `+${Q1.domesticGrowthPct}% (chronic +17.2%, acute +8.9%)`, 'Rank 16, share 2.08%; six brands in India\'s top 300; top 10 brands 38% of sales'],
      ['Branded exports', 'Own-brand formulations through local field forces', '664', '+16%', 'Strongest in French-speaking West Africa (+41% in 9MFY26), CIS ₹269 cr'],
      ['Generic exports', 'UK own label, EU, Australia/NZ, Canada, US (via Unichem USA)', '1,149', '+27% (Europe/UK ₹33 cr → ₹137 cr)', '60 EU dossiers registered, 76 in Australasia; 32 US ANDAs approved'],
      ['Institutional', 'Artemisinin-combination anti-malarials for donor-funded tenders', '270', '+107% (₹40 cr delayed shipments)', 'Shrinking with donor budgets: ₹355 cr (FY25) → ₹270 cr'],
      ['APIs & intermediates', '~80 APIs (pain, anti-malarials, cardio, anti-infectives), 75% exported', '1,396', '+30%', 'Ratlam near full; Dewas and Wardha capacity added'],
      ['Subsidiaries (mainly Unichem)', 'US generics (Goa plant), Europe (Niche), Brazil, South Africa, APIs; Trophic Wellness nutraceuticals', '2,303 (net)', '+19%', `Unichem margin 11% in Q1 (8.6% FY26); Ipca owns ${UD.stakePct}%`],
    ], source: 'AR FY26; Q4FY26 and Q1FY27 calls; ICICI Direct (17-Aug-2026, IQVIA MAT Jul-2026); PL (16-Aug-2026)' } },
    { callout: '**So what:** Ipca is three companies in one: an Indian branded franchise that compounds at 10-13% with ~30% margins, an export and API business that is cyclical but well run, and a US/EU generics business that is still being built (Ipca\'s own approved products, sold through Unichem\'s front end). The India franchise is the profit engine; exports and APIs decide whether a year is good or bad.' },
  ],
};

const history = {
  id: 'history', nav: 'History & the Unichem deal', kicker: 'History', title: 'From the Bachchan-backed takeover of 1975 to a ₹49,000 cr company: the USFDA ban, the COVID boom, the bust and the Unichem bet',
  blocks: [
    { p: 'Ipca was incorporated in Mumbai in 1949 as The Indian Pharmaceutical Combine Association. Premchand Godha, a chartered accountant who handled the Bachchan family\'s finances, joined the board in 1975 when the family invested, became MD in 1983; in 1997 the company\'s four whole-time directors bought the Bachchans\' 36% (the Godha and Chandurkar families are today\'s promoters). Under him Ipca built two things that still define it: a pain and anti-malarial franchise in India and emerging markets, and backward integration into APIs. The 2014-16 USFDA ban on its three main plants shut it out of the US for nine years; the COVID-19 boom (hydroxychloroquine) gave it a record FY21; the FY22-23 bust halved profit; and in 2023 it bought control of Unichem Laboratories, a struggling Mumbai peer with a US business and a USFDA-approved plant in Goa.' },
    { exhibit: { type: 'table', title: 'Corporate actions and what they did to the numbers', head: ['When', 'Event', 'Impact'], wide: [1, 2], rows: C.history.map(h => [h.date, h.event, h.impact || '–']), source: 'AR FY20-FY26; company filings; Business Today (19-Jul-2026); Business Standard; Medical Dialogues' } },
    { h: 'The Unichem deal in one table' },
    { exhibit: { type: 'table', title: 'Unichem Laboratories: price, structure and status', head: ['Item', 'Detail'], wide: [1], rows: [
      ['Announced / completed', '24-Apr-2023 (SPA with a promoter shareholder) / open offer closed 8-Sep-2023; subsidiary from Q2FY24'],
      ['Stake and price', `${UD.stakePct}% (3,70,81,011 shares): 33.38% block (₹1,034 cr announced at ₹440, ₹945 cr recorded) + 19.29% in the open offer at ₹440 (₹598 cr); total ₹${n0(UD.costCr)} cr`],
      ['What it bought (FY23)', 'Revenue ~₹1,340 cr, an EBITDA loss (Screener: −₹46 cr), a USFDA-approved Goa formulation plant, Unichem USA (a US front end), Niche Generics (UK/Ireland), Brazil and South Africa units, API plants at Roha, Kolhapur and Pithampur'],
      ['What it is now (FY26 / Q1FY27)', `Revenue ₹2,202 cr, EBITDA margin 8.6% (FY26), 11% in Q1FY27; sells Ipca's own US products; Bayshore (Ipca's US arm) folded into it and sold; Jogeshwari land sold for ₹279 cr; EU fine and interest settled (₹204 cr in all, 28-Oct-2025)`],
      ['Value today', `Unichem's market value ₹${n0(uniMcap)} cr at ₹${UD.close30Sep} (30-Sep-2026); Ipca's stake ₹${n0(stakeMv)} cr; promoter group (incl. Ipca) ${UD.promoterGroupPct}%`],
      ['Merger?', 'None proposed by 30-Sep-2026. Ipca is merging Krebs Biochemicals (board approval 26-Jun-2026); Unichem remains a separately listed 52.67% subsidiary with 47.33% outside holders'],
    ], source: 'Ipca press release (24-Apr-2023) and open-offer completion filing (Sep-2023); AR FY26; Screener.in (UNICHEMLAB); Medical Dialogues (28-Jun-2026)' } },
    { callout: `**Our read:** Ipca bought Unichem for what it could not build quickly after nine years outside the US: a working US front end and an approved US plant. It paid ~₹2,930 cr for 100% of a loss-making company, close to the top of Ipca's own share-price cycle (the stock fell 15% in the week of the announcement). Three years on, the strategic logic is visible (Ipca's products drive Unichem's US growth) but the economics are still thin. Because Unichem stays listed with 47% outside holders, every rupee of synergy is shared; a merger would fix that but would cost Ipca shares.` },
  ],
};

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'The industry: India\'s drug market grows ~10%, tilting to chronic; generics abroad are a price game where clean plants are scarce',
  blocks: [
    { p: 'India\'s domestic formulations market was worth ₹2,565 bn (₹2.57 lakh cr) in FY26, up 9.9% (IQVIA). Growth comes from price (4-5% a year: scheduled drugs follow a wholesale-price formula, others may rise up to 10%), new products (~2-4%) and volume (low single digits). Chronic therapies (cardiac, diabetes, CNS, urology) grow faster than acute (anti-infectives, pain, cough), and the market rewards companies with large, old brands that doctors trust. Abroad, Ipca competes in three different games: branded generics in emerging markets (field-force driven, currency risk), regulated generics in the UK/EU, Australia, Canada and the US (price erosion, supply reliability, regulatory compliance), and APIs (cost and reliability; Chinese competition).' },
    { exhibit: { type: 'table', title: 'Ipca vs the market (IQVIA)', head: ['Period', 'Market (IPM)', 'Ipca', 'Acute: market / Ipca', 'Chronic: market / Ipca'], rows: [
      ['Q3FY26 (Dec-2025 quarter)', '+8.9%', '+10.6%', '+6.9% / +8.4%', '+12% / +15%'],
      ['Q1FY27 (Jun-2026 quarter)', 'n.d.', '+11.7%', '+4.5% / +8.9%', '+15.2% / +17.2%'],
      ['Market share', '', '2.07% (Mar-26) → 2.08% (Jun-26)', '', ''],
    ], source: 'Ipca Q3FY26 (16-Feb-2026) and Q1FY27 (14-Aug-2026) calls, quoting IQVIA' } },
    { bullets: [
      '**Pain is a big, slow, old-brand market.** Ipca\'s Zerodol family (aceclofenac combinations) and HCQS are among India\'s largest brands; pain grew ~11-13% for Ipca, close to the market. Its rheumatology position (HCQS, Folitrax) is hard to dislodge but also price-controlled in parts.',
      '**Anti-malarials are fading.** Domestic anti-malarials fell 21-24% a quarter through FY26 and are now ~1-2% of Ipca\'s domestic sales (6% in FY20); institutional anti-malarial tenders depend on donor funding, which tightened in FY26.',
      '**GLP-1s.** Semaglutide\'s Indian patent expired in Mar-2026 and many companies launched; Ipca was not in the first wave and is looking to in-license (Q3FY26 call). It matters for Ipca\'s small anti-diabetic franchise, not for pain.',
      '**Input costs and freight.** The West Asia conflict lifted solvent prices 40-50%, packaging (aluminium, PVC) and freight (a US container from ~US$7,000-7,500 to $12,500-13,000; South America ~3x) from Feb-2026 (Q4FY26 and Q1FY27 calls).',
      '**Clean US plants are scarce.** Years of USFDA action against Indian plants make an approved, VAI-rated site a real asset; Ipca regained that status in FY24 after nine years.',
    ] },
    { callout: '**So what:** Ipca\'s core market (India branded) grows ~10% a year with little cyclicality; its other markets are where the cycles come from. The structural change for Ipca is not the market but its own position: back in the US after nine years, and pushing into chronic therapies where it is under-represented.' },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Does the market\'s growth reach Ipca? In India chronic and in regulated generics, yes; in anti-malarials and tenders, it runs the other way',
  blocks: [
    { p: `Ipca has grown faster than the IPM for several quarters (Q3FY26 +10.6% vs +8.9%; Q1FY27 IQVIA +11.7% with both acute and chronic ahead), with volume growth (~5%) above the industry. Two of its own drags are fading in importance: anti-malarials (now ~1% of domestic sales) and the institutional business (₹270 cr). The regulated-markets tailwind is the newest: Europe/UK generics quadrupled in Q1FY27 and Ipca's own US products are finally selling. The headwinds are cost-side (freight, solvents) and the slow pace of Unichem's own portfolio.` },
    { pair: [
      { type: 'column', title: 'Domestic formulations: ₹1,082 cr in Q1FY27, +12.6%', unit: 'Domestic formulations (₹ crore), quarterly', x: QL, series: [{ name: 'Domestic', values: SQ.map(q => q.domForm), fmt: 'num' }], labels: 'all', highlight: 'Q1FY27', source: 'PL result update (16-Aug-2026); Q1FY27 call' },
      { type: 'hbar', title: 'Q1FY27 domestic growth by therapy', unit: 'Growth, Q1FY27 (%), company', x: ['Urology', 'CNS', 'Cardio & anti-diabetic', 'Derma', 'Ophthalmology', 'Pain (incl. RA, OA)', 'Domestic total', 'Cough & cold', 'Anti-bacterials', 'Anti-malarials'], series: [{ name: 'Growth', values: [25, 19, 17, 17, 17, 13, 13, 9, 1, -24], fmt: 'pct0' }], labels: 'all', highlight: 'Domestic total', source: 'Q1FY27 call (14-Aug-2026)' },
    ] },
    { exhibit: { type: 'table', title: 'Tailwind scorecard', head: ['Tailwind', 'Reaches Ipca?', 'Evidence'], wide: [2], rows: [
      ['Chronic shift in India', '**Yes**', 'Chronic +17.2% vs market +15.2% (Q1FY27); cardio-diabetic +16-17%, CNS +19%, urology +25%; but chronic is still a minority of Ipca\'s sales (cardio-diabetic 17%)'],
      ['Price increases', '**Yes, partly**', '5-6% a year normally, 6-7% planned for FY27; price-controlled products cannot move'],
      ['Regulated-market generics', '**Yes**', 'Europe/UK ₹33 cr → ₹137 cr in Q1FY27; US shipments +8%; Ipca US growth potential 15-17%; 7-8 US launches a year across Ipca and Unichem'],
      ['US re-entry after the import alert', '**Yes, slowly**', 'Ipca\'s products drove Unichem\'s US +27% in Q1FY27; consolidated US ₹1,567 cr in FY26 (+14%)'],
      ['Emerging-market branded growth', '**Yes**', 'Branded exports +14% in FY26, +16% in Q1FY27 (West Africa strongest; CIS flat)'],
      ['Weak rupee', '**Yes, for now**', '~5pp of Q1FY27\'s 21% growth; partly offset by dollar-linked costs'],
      ['Anti-malarials and donor tenders', '**No (headwind)**', 'Domestic anti-malarials −24%; institutional ₹355 cr → ₹270 cr in FY26'],
      ['GLP-1 / obesity', '**Not yet**', 'No first-wave semaglutide launch; in-licensing being explored'],
    ], source: 'Ipca calls (Q3FY26, Q4FY26, Q1FY27); AR FY26' } },
    { callout: `**Verdict:** the tailwinds that matter for profit (India chronic, regulated generics, US re-entry) reach Ipca; the ones running against it (anti-malarials, tenders) are now small. We model domestic growth of ${BL.growth.domForm.join(' / ')}% for FY27-29E, a little above a ~10% market, and generics growth of ${BL.growth.expGeneric.join(' / ')}%.` },
  ],
};

module.exports = { business, history, industry, tailwind };
