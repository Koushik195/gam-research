// Anthem Biosciences report, part 2: what Anthem does, history and the IPO, industry, tailwind test.
const X = require('./ANTHEM.ctx');
const { C, D, A, n0, n1, BL, KEYS, LBL, FY26, SA } = X;
const IN = D.industry, IPO = C.ipo;
const s26 = k => (BL.base[k] / A.sales[X.b] * 100).toFixed(1);

const business = {
  id: 'business', nav: 'What Anthem does', kicker: 'Company', title: 'A Bengaluru CRDMO that discovers, develops and makes innovators\' molecules, plus a fermentation-ingredients business; 61% of revenue comes from 14 commercial molecules',
  blocks: [
    { p: `Anthem is a CRDMO: a contract research, development and manufacturing organisation. Drug innovators (mostly small US and European biotechs, plus 9 large and 20 mid-sized pharma companies) pay it to (1) **discover** and test candidate molecules (R&D services, billed mostly fee-for-service rather than per scientist), (2) **develop** the chemical process and make batches for clinical trials, and (3) **manufacture** the active ingredient or advanced intermediate once a drug is approved. It works in both small molecules (chemistry, the bulk of revenue) and biologics (fermentation, enzymes, biotransformation), and in newer formats: peptides, antibody-drug conjugates (ADCs), RNA interference and oligonucleotides. Separately, its **specialty ingredients** business makes and sells its own fermentation products (enzymes, the serratiopeptidase protease, vitamin K2, probiotics, nutritional actives), mostly to Indian B2B buyers. It runs three sites in and around Bengaluru with ${n0(C.profile.employees.mar26)} employees (${n0(C.profile.employees.scientific)} scientists); 85% of FY26 revenue was exported, 54% to Europe and 27% to North America.` },
    { exhibit: { type: 'table', title: "Anthem's four revenue lines (FY26)", head: ['Line', 'Revenue (₹ cr)', 'Share', 'What it is', 'Who buys', 'Economics'], wide: [3, 4, 5], rows: [
      ['**Commercial molecules**', n0(BL.base.commercial), `${s26('commercial')}%`, 'API and advanced intermediates for 14 approved drugs (four launched in FY26); migraine, immunology, pain and oncology among the therapies (JM)', 'A few large clients and the big pharmas that bought its biotech clients; clients include AbbVie, Novartis and Pfizer (JM)', 'Long contracts for the life of a molecule; volumes follow the drug\'s sales and the client\'s stocking'],
      ['**Clinical development batches**', n0(BL.base.development), `${s26('development')}%`, 'Process development and material for Phase I-III trials; 10 molecules in Phase III', 'Emerging biotechs', 'Lumpy; a trial result can add or cancel an order; the funnel into commercial supply'],
      ['**R&D / discovery services**', n0(BL.base.rd), `${s26('rd')}%`, 'Discovery chemistry and biology, ~90% fee-for-service; 100+ early-stage programmes', '100+ biotechs, often introduced by US partner Davos', 'Small but feeds the funnel; ~97% success rate on FFS contracts (JM)'],
      ['**Specialty ingredients**', n0(BL.base.si), `${s26('si')}%`, 'Own fermentation products: enzymes (~37% of the segment in FY25), serratiopeptidase, vitamin analogues and K2, probiotics, nutritional actives, some APIs; semaglutide API filed', 'Indian and rest-of-world nutrition, pharma and food companies', 'Monthly orders, no order book; gross margin ~51% (BOBCAPS) vs ~68% in CRDMO'],
    ], source: 'AR FY26 (note 41; p.35); Q4FY26 deck and call (mix); JM Financial initiation 31-Oct-2025 (product and client detail)' } },
    { pair: [
      { type: 'hbar', title: 'Where FY26 revenue came from: Europe 54%, North America 27%', unit: 'FY26 revenue (₹ crore)', x: ['Europe', 'North America', 'India', 'Rest of Asia & others'], series: [{ name: 'FY26', values: [Math.round(FY26.geography.europe), Math.round(FY26.geography.northAmerica), Math.round(FY26.geography.india), Math.round(FY26.geography.restOfAsia)], fmt: 'num' }], labels: 'all', source: 'AR FY26 consolidated note 41' },
      { type: 'column', title: 'CRDMO has risen from 76% to 83% of revenue', unit: 'Revenue (₹ crore)', x: SA.map(s => s.fy), series: [{ name: 'CRDMO', values: SA.map(s => Math.round(s.crdmo)), fmt: 'num' }, { name: 'Specialty ingredients', values: SA.map(s => Math.round(s.si)), fmt: 'num' }], labels: 'all', source: 'RHP (FY23-25); AR FY26' },
    ] },
    { callout: '**So what:** Anthem is a manufacturing business with a research front door. The front door (discovery and development work for 100+ biotechs) is what makes it unusual among Indian CDMOs and keeps the funnel full; the money is made when one of those molecules is approved and Anthem becomes its filed supplier. That is also why revenue is concentrated: a few approved molecules owned by a few clients pay most of the bills.' },
  ],
};

const history = {
  id: 'history', nav: 'History & the IPO', kicker: 'History', title: 'Twenty years from a discovery lab to a listed CRDMO; the IPO was a pure sale by insiders and the PE investor, and no new money came in',
  blocks: [
    { p: 'Ajay Bhardwaj, a chemical engineer who ran marketing and technical services at Biocon, founded Anthem in 2006 with Ganesh Sambasivam (previously Syngene\'s chief scientific officer) and K Ravindra Chandrappa (operations). It began as a discovery-chemistry shop at Bommasandra, added biology and fermentation, built Unit II at Harohalli (2017-18) for commercial scale and Unit III (NeoAnthem) for peptides and high-potency work (commissioned in FY26). True North invested in 2021. A 12:1 bonus (Nov-2022) and a ₹149 cr buy-back (Dec-2023) preceded the IPO.' },
    { exhibit: { type: 'table', title: 'Corporate actions and events that changed the numbers', head: ['When', 'Event', 'Impact'], wide: [1, 2], rows: C.timeline.map(t => [t.date, t.event, t.impact]), source: 'AR FY26 (journey, notes 15 and 48); RHP (abridged prospectus); exchange block-deal reports (Mar and Jun-2026)' } },
    { h: 'The IPO: ₹3,395 cr, all of it an offer for sale' },
    { p: `Anthem listed on 21-Jul-2025 at ₹570 a share (67x subscribed; +27% on day one). It sold ${n0(IPO.sharesSold / 1e5 / 10)} lakh existing shares (~10.6% of the company) and issued none, so the company received nothing and paid nothing (the sellers bore the costs). The largest seller was the PE investor True North (₹1,325 cr), followed by two founders, Ganesh Sambasivam and K Ravindra Chandrappa (₹350 cr each), another early investor and four individual early shareholders. Ajay Bhardwaj and his son Ishaan sold nothing. True North sold its remaining 3.62% on 9-Mar-2026, and a promoter-group member, Aruna Ganesh, sold her entire 3.05% on 18-Jun-2026.` },
    { exhibit: { type: 'table', title: 'Who sold in the IPO', head: ['Seller', 'Type', 'Amount (₹ cr)', 'Average cost per share (₹)'], rows: [...IPO.sellers.map(s => [s.name, s.type, n0(s.amountCr), s.wacc ? String(s.wacc) : 'Nil']), { hl: true, cells: ['**Total offer for sale**', '', `**${n0(IPO.sizeCr)}**`, '**Issue price ₹570**'] }], source: 'Abridged prospectus (RHP dated 8-Jul-2025); AR FY26 note 48' } },
    { callout: '**Lesson from history:** the FY23 dip (revenue −14%) came from one Phase III failure and one withdrawn product, a reminder that each client molecule is a binary bet. And the IPO tells you who wanted liquidity: every share sold came from insiders and the PE fund, at an average cost of a few rupees for the founders. That is normal for a founder-built company, but buyers should know that the company itself did not need the money and that promoter-group selling has continued since.' },
  ],
};

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Industry: India\'s CRDMO market is forecast to grow ~13% a year to USD15 bn by 2029, faster than the world\'s 9%; Anthem is still a small player in it',
  blocks: [
    { p: `Frost & Sullivan (in Anthem's AR) puts the global CRDMO market at ~USD ${IN.global.crdmoUsdBn2024} bn in 2024, rising to over USD ${IN.global.crdmoUsdBn2029} bn by 2029 (${IN.global.cagrPct2024_29}% a year), with commercial manufacturing the largest part. India's market was ~USD ${IN.india.crdmoUsdBn2024} bn in 2024 (CRO ~USD ${IN.india.croUsdBn2024} bn, CDMO ~USD ${IN.india.cdmoUsdBn2024} bn) and is forecast to reach USD ${IN.india.crdmoUsdBn2029} bn by 2029 (${IN.india.cagrPct2024_29}% a year). Anthem's FY26 revenue of ~USD 0.25 bn is ~3% of the Indian market. The drivers are familiar: innovators outsource more, biologics and new modalities need specialist capability, most of the ~${n0(IN.global.clinicalCandidates)} drugs in clinical trials belong to biotechs that own no plants, and China+1 and the US BIOSECURE Act push work towards India. GLP-1 peptides are a separate opportunity: semaglutide's Indian patent expired in Mar-2026 and most Indian launches still use Chinese API.` },
    { pair: [
      { type: 'column', title: 'India\'s CRDMO market: USD8 bn to 15 bn by 2029', unit: 'USD bn (Frost & Sullivan)', x: ['2019', '2024', '2029F'], series: [{ name: 'India CRDMO', values: [IN.india.crdmoUsdBn2019, IN.india.crdmoUsdBn2024, IN.india.crdmoUsdBn2029], fmt: 'num' }], labels: 'all', source: 'AR FY26 MD&A (Frost & Sullivan, Evaluate Pharma)' },
      { type: 'column', title: 'India is forecast to grow ~1.5x faster than the world', unit: 'Expected annual growth 2024-29 (%)', x: ['Global CRDMO', 'India CRDMO'], series: [{ name: 'Growth', values: [IN.global.cagrPct2024_29, IN.india.cagrPct2024_29], fmt: 'pct' }], labels: 'all', source: 'AR FY26 MD&A (Frost & Sullivan)' },
    ] },
    { exhibit: { type: 'table', title: 'Forces at 30-Sep-2026', head: ['Force', 'What it is', 'What it means for Anthem'], wide: [1, 2], rows: [
      ['Innovator outsourcing', 'More development and commercial work handed to trusted partners', 'The core case: 14 commercial molecules, 10 in Phase III'],
      ['Biotech funding', 'Funding recovered ~50% YoY in Jan-Apr 2026 after two weak years (CFO)', 'More discovery requests, but smaller projects; the FY26 destocking is "behind us" (CEO)'],
      ['M&A of biotechs by big pharma', 'Acquirers take over Anthem\'s client molecules', 'A route into big pharma (two direct additions in FY26, a third in Q1FY27) and a risk of re-sourcing'],
      ['China+1 / BIOSECURE Act', 'Innovators dual-source away from Chinese CDMOs', 'Supportive; Anthem also stopped buying a key intermediate from China in FY26'],
      ['GLP-1 peptides', 'Indian generic semaglutide launched from Mar-2026 on mostly Chinese API', 'Semaglutide API ready, awaiting CDSCO approval; "cost of goods rivalling even the Chinese" (CEO)'],
      ['US tariffs', 'Section 232 pharma tariff threats in 2025-26', '"No impact": big-pharma clients have their own arrangements with the US administration (CFO, 20-May-2026)'],
      ['West Asia war', 'Raw-material and logistics disruption from Feb-2026', 'Hit the domestic specialty-ingredients business in Q1FY27'],
    ], source: 'AR FY26; Q4FY26 and Q1FY27 calls' } },
  ],
};

const tailwind = {
  id: 'tailwinds', nav: 'Tailwind test', kicker: 'Does the tailwind reach Anthem?', title: 'Tailwind test: Anthem captures outsourcing and big-pharma M&A directly; peptides, biosimilars and large molecules are still options',
  blocks: [
    { p: 'A sector tailwind helps a shareholder only if the company turns it into revenue. We score each driver on whether Anthem is a main beneficiary, a partial one or a bystander.' },
    { verdicts: [
      ['Innovator outsourcing of small molecules', 'Yes', 'CRDMO revenue ₹808 cr (FY23) → ₹1,773 cr (FY26); four commercialisations in FY26 now 8-9% of revenue', 'Visible in the numbers'],
      ['Biotech pipelines and funding', 'Yes', '100+ early programmes, 10 Phase III, all four FY26 Phase III additions from its own funnel', 'The engine of future commercial supply'],
      ['Big pharma buying biotechs', 'Partly', 'Brought it two big-pharma relationships; a late-stage client acquired in Jul-2026 with "no meaningful discussions" yet with the acquirer', 'Can widen or end a relationship'],
      ['China+1 / BIOSECURE', 'Partly', 'Indian sites with USFDA, PMDA, TGA approvals; inbound interest, but no disclosed transfer from China', 'Supportive over years'],
      ['Peptides / GLP-1', 'Partly', 'Semaglutide API awaiting CDSCO approval; peptide CRDMO programmes mostly early-stage', 'Optional; not in revenue yet'],
      ['Biosimilars and large molecules', 'Partly', 'One microbial biosimilar for a US client to hit the P&L in FY27; 4-5 large-molecule development projects; no mammalian capacity at scale', 'Small and early; Korea and China have the capacity'],
      ['ADCs and oligonucleotides', 'Partly', 'Two ADC molecules in late phase; 15-20 payloads worked on', 'Could be the next commercial molecules'],
      ['Weak rupee', 'Yes', '85% exports; FY26 forex gains ₹58 cr', 'Helps profit, but we do not forecast it'],
    ], head: ['Tailwind', 'Captured?', 'Evidence', 'So what'], title: 'Tailwind scorecard: 3 of 8 captured directly, 5 partly', source: 'Company calls and filings; GAM Research' },
    { callout: '**Our view:** the tailwinds that drive the next three years (outsourcing and biotech pipelines) reach Anthem directly, which is why we forecast ~18% a year of growth after FY27. The ones that excite the market most (GLP-1, biosimilars, ADCs) are real capabilities but not yet revenue, and we do not pay for them separately.' },
  ],
};

module.exports = { business, history, industry, tailwind };
