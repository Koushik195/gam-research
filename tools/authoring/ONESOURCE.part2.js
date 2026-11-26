// OneSource report, part 2: what OneSource does, history (the Strides demerger, listing and the withdrawn Steriscience
// deal), industry (generic GLP-1 timing by market), tailwind test.
const X = require('./ONESOURCE.ctx');
const { C, D, A, n0, n1, BL, FY26 } = X;
const IN = D.industry, G = C.geography;

const business = {
  id: 'business', nav: 'What OneSource does', kicker: 'Company', title: 'A Bengaluru contract manufacturer for complex products: GLP-1 pens and cartridges are the growth engine, soft gels and sterile injectables the base, biologics the option',
  blocks: [
    { p: 'OneSource is a CDMO (contract development and manufacturing organisation): it develops and makes medicines that other companies own and sell. It does four things. (1) **Drug-device combinations (DDC)**: it fills peptide drugs such as generic semaglutide (Ozempic/Wegovy) and liraglutide into cartridges, pre-filled syringes and vials, inspects them, assembles them into pens, labels and packs them, end to end. The customer usually supplies the active ingredient; OneSource earns a development fee while a product is being filed (MSA, master service agreement) and a conversion fee per unit once it is approved (CSA, commercial supply agreement). (2) **Biologics**: drug substance (microbial 1KL, mammalian 2 x 2KL) and drug product on one site, for biosimilar makers, innovators and animal-health companies; still mostly development work. (3) **Sterile injectables**: vials and syringes, including one of few USFDA-approved penicillin fill-finish plants, focused on products in shortage. (4) **Oral technologies**: soft gelatin capsules (2.4bn a year), until 2024 made mainly for Strides\' own brands. It has five sites in Bengaluru, ~1,600 people and 80+ customers.' },
    { exhibit: { type: 'table', title: "OneSource's businesses (FY26; the company does not disclose the split)", head: ['Business', 'GAM estimate of FY26 revenue', 'What it is', 'Who buys', 'Economics'], wide: [2, 3, 4], rows: [
      ['**DDC (incl. GLP-1) and biologics**', `~₹${n0(BL.base.ddc)} cr (GAM)`, 'Fill-finish, inspection, pen assembly and packing of peptides and biologics; development batches; biologics DS and DP', '20+ DDC customers: Dr Reddy\'s, Orbicular and its Canadian partner, Hikma, Indian and global generic companies; Formycon and other biosimilar firms', 'Development fees (MSA) then per-unit fees (CSA); capacity reserved with upfront fees and take-or-pay; customer-funded components'],
      ['**Base business: sterile injectables and soft gels**', `~₹${n0(BL.base.core)} cr (GAM; "trending closer to US$100m")`, 'Vials, PFS and lyophilised products; penicillin; soft gelatin capsules (oncology NDA, OTC and Rx)', 'Strides-group companies (₹372 cr of FY26 sales), US generic companies, European customers moving supply', 'Steady, H2-heavy (soft gels); new lyophilisation and PFS capacity from FY28'],
    ], source: 'AR FY26 (pp.18-27, notes 32, 35); Q4FY26 and Q1FY27 decks and calls; GAM estimates (no segment disclosure)' } },
    { pair: [
      { type: 'hbar', title: 'Where FY26 revenue came from: US 35%, India 28%, Europe 16%', unit: 'FY26 revenue (₹ crore)', x: ['United States', 'India', 'Rest of world', 'Spain', 'Ireland'], series: [{ name: 'FY26', values: [G.FY26.usa, G.FY26.india, G.FY26.row, G.FY26.spain, G.FY26.ireland].map(Math.round), fmt: 'num' }], labels: 'all', source: 'AR FY26 note 20.1 (by customer location)' },
      { type: 'hbar', title: 'Two customers 32% and Strides-group entities 28% of FY26 revenue', unit: 'Share of FY26 revenue (%)', x: ['Two customers above 10%', 'Strides group and other related parties', 'Of which Strides Pharma Inc (US)'], series: [{ name: 'FY26', values: [C.topCustomers.FY26.pct, C.relatedRevenue.FY26pct, Math.round(C.relatedRevenue.stridesIncFY26 / FY26.revenue * 1000) / 10], fmt: 'pct' }], labels: 'all', source: 'AR FY26 notes 32, 35 (the groups overlap)' },
    ] },
    { callout: '**So what:** OneSource is a capacity business at an inflection. For two years it sold scarce GLP-1 fill-finish capacity in advance (development fees, reservation fees), and the money now depends on how many pens its partners sell once their approvals arrive. The base business is steady but tied to the founder\'s other companies, and biologics will not earn commercial revenue before FY29.' },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'Built from three Arun Kumar companies in 2024, listed in Jan-2025 without an IPO; a related-party acquisition was announced and then withdrawn',
  blocks: [
    { p: 'OneSource began as the biotech arm of the Strides group (Stelis Biopharma, a biologics venture whose terminated Sputnik Light vaccine contract is still in arbitration). Its founder, Arun Kumar, built Strides, sold its injectables business Agila to Mylan for US$1.6bn in 2013 and re-entered injectables through Steriscience after the non-compete ended. A scheme announced in Sep-2023 merged Strides\' soft-gel CDMO business and Steriscience\'s injectables CDMO business into Stelis, renamed OneSource; it took effect on 1-Apr-2024 (NCLT order 14-Nov-2024). Strides shareholders received OneSource shares, so the stock listed on 24-Jan-2025 without an IPO; ₹801 cr had been raised privately in Nov-2024 at a ~US$1.65bn valuation.' },
    { exhibit: { type: 'table', title: 'Corporate actions and events that changed the numbers', head: ['When', 'Event', 'Impact'], wide: [1, 2], rows: [
      ['Sep-2023', 'Composite scheme announced: Strides soft gels + Steriscience injectables + Stelis', 'Goodwill ₹3,828 cr and intangibles ₹1,393 cr recognised; ₹138 cr a year of amortisation'],
      ['FY24', 'Stelis sold its Unit 3 multimodal facility to Syngene', 'Biologics capacity reduced; losses cut'],
      ['Nov-2024', '₹801 cr equity raise at ~US$1.65bn; NCLT sanction (effective 1-Apr-2024)', 'Expensive debt prepaid; capex programme started'],
      ['24-Jan-2025', 'Listed on NSE/BSE (first close ₹1,710)', 'Promoter group sold 6.8% for ₹1,202 cr on 31-Jan-2025, and ~4.5 points more by Jun-2025'],
      ['Sep-2025', 'Proposed all-share acquisition of Steriscience Pte (Poland site) and Brooks Steriscience, promoter-owned with TPG', '~18.5% dilution; FY28 target raised to US$500m+'],
      ['Jan-2026', 'Q3FY26 loss; Canadian approvals delayed; 12.5% NCDs prepaid', 'FY26 EBITDA −35%'],
      ['13-May-2026', 'Board drops the Steriscience scheme "in its current form" after minority pushback on valuation', 'FY28 back to US$400m organic'],
      ['Apr-Jul 2026', 'Canada approvals and launches; India >40% of generic pens; Dr Reddy\'s pauses supply (9-Jul) on an API issue', 'Q1FY27 revenue +37%'],
    ], source: 'AR FY26 (journey pp.2-3; notes 4D-4E, 39); CARE (5-Mar-2026); Q2FY26 and Q4FY26 decks and calls; Business Standard (31-Jan-2025)' } },
    { callout: '**Lesson from history:** OneSource is a Strides-family construct, and that cuts both ways. The founder\'s deal-making record (Agila) and relationships brought customers and investors quickly. But the same family owns its biggest customer group, its landlord and the businesses it tried to buy; and the first act of the promoter group after listing was to sell about a fifth of its stake.' },
  ],
};

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Industry: generic semaglutide opens market by market from 2026; capacity, not demand, is the constraint for now; the US and Europe only open from ~2031',
  blocks: [
    { p: `Semaglutide (Novo Nordisk's Ozempic and Wegovy) is the largest drug going off patent outside the US and Europe. The markets losing protection by mid-2026 sold ~US$${n0(IN.semaMarkets.reduce((s, x) => s + x[1], 0) / 100) / 10} bn of the brand in 2025 (IQVIA, in OneSource's deck), led by Canada (US$2.2bn) and Brazil (US$0.8bn); the brand was scarce in most of them, so generics are expanding the market rather than just replacing it (India: from <2,000 to 150,000-160,000 generic pens a month within a year). Generic companies need sterile fill-finish and pen-assembly capacity that takes about two years to build, which is why OneSource could reserve its line years ahead. ${IN.competition}.` },
    { exhibit: { type: 'table', title: 'Generic semaglutide: where and when (as known on 30-Sep-2026)', head: ['Market', 'Status', 'OneSource'], wide: [1], rows: IN.timing.map(t => t), source: IN.timingSrc } },
    { exhibit: { type: 'hbar', title: 'Brand semaglutide sales in markets opening by H1-2026 (2025)', unit: 'US$ million (IQVIA)', x: IN.semaMarkets.map(x => x[0]), series: [{ name: '2025 sales', values: IN.semaMarkets.map(x => x[1]), fmt: 'num' }], labels: 'all', source: 'OneSource Q4FY26 deck p.8 (IQVIA)' } },
    { callout: `**So what:** the near-term market is real but smaller than the GLP-1 headlines suggest: the US and Europe, by far the largest markets, stay closed until ~2031. Until then OneSource's volumes come from Canada, India, Brazil and other emerging markets, at falling generic prices. ${IN.biologics}.` },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Does the GLP-1 tailwind reach OneSource? Yes, for now: it fills every Canadian approval and ~40% of Indian generic pens; the test is whether that share survives new capacity',
  blocks: [
    { exhibit: { type: 'table', title: 'Tailwind test', head: ['Question', 'Evidence', 'Verdict'], wide: [1], rows: [
      ['Is OneSource exposed to the trend?', 'All three Canadian generic approvals, the first US tentative approval and day-one Indian launches are on its site; 20+ DDC customers', 'Yes'],
      ['Does it capture value or only volume?', 'Per-unit conversion fees, fixed per customer and the same in every market (CEO); customer supplies the API; reservation fees and take-or-pay', 'Partly: rates are not linked to end prices, but contracts are renegotiated as capacity grows'],
      ['Is capacity the bottleneck it can sell?', 'Line 1 sold out; lines 2-3 take sterile days from 225 to 675 by FY28; competitors add capacity (a listed peer 40m → 140m devices)', 'Yes until ~FY28, less after'],
      ['Are partners reliable?', "Dr Reddy's paused semaglutide supply on 9-Jul-2026 (API impurity); OneSource says other customers filled the gap", 'Mixed'],
      ['Do the biologics and biosimilar tailwinds reach it?', 'RFP funnel ~4x; Formycon and a US biosimilar major signed; commercial revenue from FY29', 'Later'],
    ], source: 'Q4FY26 and Q1FY27 calls; Q2FY26 call; Dr Reddy\'s BSE filing (9-Jul-2026)' } },
    { callout: '**Verdict:** the tailwind reaches OneSource directly and early; few companies have its approvals on file. The open question is price: once generic capacity is no longer scarce (management itself says the supply gap lasts "at least for next 2 years"), conversion fees will compete, which is why our steady-state margin sits below the guided 40%.' },
  ],
};

module.exports = { business, history, industry, tailwind };
