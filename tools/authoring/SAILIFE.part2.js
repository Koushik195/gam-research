// Sai Life Sciences report, part 2: what Sai does, history and the IPO, industry, tailwind test.
const X = require('./SAILIFE.ctx');
const { C, D, A, n0, n1, BL, FY26, SA, b } = X;
const IN = D.industry, IPO = C.ipo;

const business = {
  id: 'business', nav: 'What Sai Life does', kicker: 'Company', title: 'A Hyderabad CRDMO that discovers molecules for innovators (CRO, 35% of revenue) and develops and makes them (CDMO, 65%); 99% of revenue is exported',
  blocks: [
    { p: `Sai Life is a CRDMO: a contract research, development and manufacturing organisation for drug innovators. It does two things. (1) **Discovery (CRO)**: medicinal and synthetic chemistry, biology, DMPK (how a drug is absorbed and cleared) and toxicology that help a client find a drug candidate and file it for human trials, sold mostly by the scientist-year (FTE) or by project from its Hyderabad campus and labs in Greater Boston. (2) **Development and manufacturing (CDMO, which Sai calls CMC)**: designing the chemical process, making material for Phase I-III trials and then supplying the active ingredient (API) or advanced intermediates for approved drugs from 700 KL of reactors at Bidar, with process R&D in Hyderabad and Manchester. It works almost only in small molecules, with early work in peptides, ADC payloads and linkers and oligonucleotide building blocks (~4% of revenue). FY26 revenue was ₹${n0(FY26.revenue)} cr: CDMO ₹${n0(FY26.cdmoDeck)} cr (+33%) and CRO ₹${n0(FY26.croDeck)} cr (+24%); 99.4% came from outside India. It has ${n0(C.profile.employees.mar26)} employees, 2,000+ of them in R&D.` },
    { exhibit: { type: 'table', title: "Sai Life's two businesses (FY26)", head: ['Business', 'Revenue (₹ cr)', 'Share', 'What it is', 'Who buys', 'Economics'], wide: [3, 4, 5], rows: [
      ['**CDMO / CMC** (development and manufacturing)', n0(BL.base.cdmo), `${(BL.base.cdmo / A.sales[b] * 100).toFixed(0)}%`, 'Process development, clinical batches and commercial supply of APIs and intermediates; 34 commercial molecules and 11 in Phase III or pre-registration at Mar-26 (33 and 14 at Jun-26); 155 programmes in early development', 'Mostly large pharma (~91% of CDMO revenue in FY25, HSIE); 19 of the top 25 pharma companies are customers', 'Lumpy campaigns; commercial supply runs for the life of a molecule; capital-heavy (700 KL, ~1,150 KL by end-FY27)'],
      ['**CRO** (discovery services)', n0(BL.base.cro), `${(BL.base.cro / A.sales[b] * 100).toFixed(0)}%`, 'Integrated discovery from target validation to candidate nomination: chemistry, biology, DMPK, toxicology, computational chemistry', 'Biotechs and, increasingly, large pharma (pharma ~48% of discovery revenue in FY26 on our reading of the deck, from ~38%)', 'Steadier; billed by FTE or project; ~65% of customers buy more than one service; feeds the CDMO funnel'],
    ], source: 'AR FY26 note 27; Q4FY26 deck pp.11, 22, 25, 30; Q1FY27 deck and call; HDFC Securities (Jan-2026)' } },
    { pair: [
      { type: 'stacked', title: 'Both businesses grew: CDMO ₹959 cr → ₹1,361 cr, CRO ₹497 cr → ₹775 cr', unit: 'Contract revenue (₹ crore, audited)', x: ['FY24', 'FY25', 'FY26'], series: [{ name: 'CDMO', values: [959, 1034, 1361], fmt: 'num' }, { name: 'CRO', values: [497, 626, 775], fmt: 'num' }], minLabel: 300, source: 'AR FY25-26 revenue notes (excludes other operating income: ₹56 cr in FY26)' },
      { type: 'column', title: 'Largest customer: 21.5% of revenue for two in FY25, 12.2% for one in FY26', unit: 'Revenue from customers above 10% (% of revenue)', x: ['FY24', 'FY25', 'FY26'], series: [{ name: 'Customers >10%', values: [0, FY26.topCustomer.fy25Pct, FY26.topCustomer.pct], fmt: 'pct' }], labels: 'all', source: 'AR FY25-26 segment notes (FY24: none above 10%; FY25: two; FY26: one)' },
    ] },
    { callout: '**So what:** Sai is closer to a large-pharma supplier than a biotech-funded CRO. The discovery business wins relationships early; the CDMO business earns from them once a molecule reaches late trials or the market. That model is why repeat customers bring over 90% of revenue and no customer is more than ~12% of sales. It also means growth follows a few dozen molecules and campaign timing, which makes quarters lumpy.' },
  ],
};

const history = {
  id: 'history', nav: 'History & the IPO', kicker: 'History', title: 'Twenty-seven years from a chemistry shop to a listed CRDMO; the IPO raised ₹950 cr to repay debt, and TPG sold out within nine months of listing',
  blocks: [
    { p: 'The Kanumuri family founded Sai in Hyderabad in 1999 as a medicinal-chemistry partner to US biotechs. It pivoted to manufacturing in 2009-13 (Unit IV at Bidar won its first USFDA approval), added process R&D and integrated biology, and in 2019-23 opened labs in Manchester and Greater Boston and built HPAPI, clean-room and amidite blocks at Bidar. TPG became the largest outside investor before the IPO. The heavy investment of FY19-FY23 came with thin profits and rising debt (₹933 cr at Mar-23), which the IPO repaid.' },
    { exhibit: { type: 'table', title: 'Corporate actions and events that changed the numbers', head: ['When', 'Event', 'Impact'], wide: [1, 2], rows: C.timeline.map(t => [t.date, t.event, t.impact]), source: 'AR FY26 (notes 17, 49); Q4FY26 and Q1FY27 decks; Business Standard and PTI (block deals)' } },
    { h: 'The IPO: ₹3,043 cr, of which ₹950 cr was new money' },
    { p: `Sai listed on ${C.profile.listed.split(' on')[0]} at ₹${IPO.price} a share (a ~20% listing gain). It issued ${(IPO.freshShares / 1e7).toFixed(2)} cr new shares for ₹${n0(IPO.freshIssueCr)} cr and selling shareholders sold ${(IPO.ofsShares / 1e7).toFixed(2)} cr shares for ₹${n0(IPO.ofsCr)} cr. Net proceeds of ₹910 cr went to repaying ₹720 cr of borrowings and ₹190 cr of general corporate purposes, all used by Mar-2026. Offer expenses (₹128 cr) were split pro rata, and the company's share was charged to securities premium, not profit. The ESOP charge was only ₹2-3 cr a year in FY24-FY26, so the IPO left no one-off in the P&L to adjust. TPG then sold ~10% on 20-Jun-2025 at ~₹722 and its last 14.72% on 26-Aug-2025 at ~₹871; Nippon India MF, Invesco MF, BlackRock and Societe Generale were among the buyers.` },
    { callout: '**Lesson from history:** Sai has been here before. In FY20-FY23 it built capacity and people ahead of revenue and profit almost disappeared (FY22 PAT ₹6 cr). The FY27-29 capex cycle is larger (₹1,100-1,300 cr in FY27 alone) but starts from a healthier base: 29% margins, a full order book and an AA balance sheet. The risk is the same: costs arrive before revenue.' },
  ],
};

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Industry: India\'s CRDMO market is ~USD3.4-4.0 bn and forecast to grow 15-16% a year to 2035, faster than the world\'s 8-9%; Sai is one of a handful of scaled integrated players',
  blocks: [
    { p: `Sai's annual report cites a global CDMO market of ~USD ${IN.global.cdmoUsdBn2026} bn in 2026 growing ${IN.global.cdmoCagrPct}% a year to ~USD ${IN.global.cdmoUsdBn2034} bn by 2034, and a global CRO (research) market of USD ${IN.global.croUsdBn2025} bn in 2025 growing ~${IN.global.croCagrPct}% a year. India's CRDMO market is estimated at USD ${IN.india.crdmoUsdBnCY25Low}-${IN.india.crdmoUsdBnCY25High} bn in CY2025 and forecast to grow ${IN.india.cagrPctCY26_35}% a year to USD ${IN.india.usdBnCY30} bn by CY2030 and USD ${IN.india.usdBnCY35} bn by CY2035. Sai's FY26 revenue of ~USD 0.25 bn is ~7% of that Indian market. The same report flags the near term honestly: CRDMO revenue growth of 8-10% in FY27 because biopharma funding has been weak. The long-term drivers: innovators outsource more, large pharma wants integrated partners outside China, new modalities need specialist capacity, and patent expiries push innovators to cut costs.` },
    { pair: [
      { type: 'column', title: 'India\'s CRDMO market: ~USD3.7 bn (CY25) to USD7-9 bn (CY30) and USD14-18 bn (CY35)', unit: 'USD bn, mid-point of range (company MD&A)', x: ['CY2025', 'CY2030F', 'CY2035F'], series: [{ name: 'India CRDMO', values: [3.7, 8, 16], fmt: 'n1' }], labels: 'all', source: 'AR FY26 MD&A (industry sources cited there)' },
      { type: 'column', title: 'India is forecast to grow ~2x as fast as the global market', unit: 'Expected annual growth (%)', x: ['Global CRO (2026-33)', 'Global CDMO (2026-34)', 'India CRDMO (CY26-35)'], series: [{ name: 'Growth', values: [IN.global.croCagrPct, IN.global.cdmoCagrPct, 15.5], fmt: 'pct' }], labels: 'all', source: 'AR FY26 MD&A (Grand View Research, Fortune Business Insights)' },
    ] },
    { exhibit: { type: 'table', title: 'Forces at 30-Sep-2026', head: ['Force', 'What it is', 'What it means for Sai'], wide: [1, 2], rows: [
      ['Large-pharma outsourcing and integration', 'Pharma wants partners that own whole discovery and development programmes, not single tasks', 'The core case: 19 of the top 25 pharma; dedicated FTE teams; one relationship now runs from discovery to commercial'],
      ['China+1 and IP concerns', '"Geopolitical uncertainty and concerns around intellectual property have made India an increasingly important part" of diversification (CEO, Aug-2026)', 'Inbound discovery and development work; formulation offered for early clinical supply as a China alternative'],
      ['US BIOSECURE Act', 'Enacted 18-Dec-2025 (FY2026 NDAA s.851) with no named companies; WuXi AppTec\'s Jun-2026 Pentagon listing was enjoined on 7-Aug-2026; OMB list due by Dec-2026', 'Supportive over years, but no forced transfer from Chinese CDMOs yet'],
      ['Biotech funding', 'Recovering, skewed to mid-to-late-stage assets; ~18 US biotech IPOs and several large acquisitions in 2026', 'Matters less than for peers: CDMO revenue is ~91% large pharma; acquired biotech molecules have stayed with Sai'],
      ['New modalities', 'Peptides beyond GLP-1, ADC/XDC conjugates, oligonucleotides', 'Early: ~4% of revenue; commercial peptide plant only in 2028'],
      ['US tariffs', 'Section 232 pharma tariff threats', '"No impact seen so far"; big pharma handles its own tariff exposure (Q4FY26 deck)'],
      ['West Asia conflict', 'Higher input and logistics costs from 2026', 'Price revisions sought, but "recoveries may not always be contemporaneous"'],
    ], source: 'AR FY26 MD&A; Q4FY26 deck p.10; Q1FY27 call; law-firm alerts on BIOSECURE (Ropes & Gray, Holland & Knight, Greenberg Traurig)' } },
  ],
};

const tailwind = {
  id: 'tailwinds', nav: 'Tailwind test', kicker: 'Does the tailwind reach Sai?', title: 'Tailwind test: Sai captures large-pharma outsourcing and integration directly; China+1 and BIOSECURE help at the margin; new modalities are still options',
  blocks: [
    { p: 'A sector tailwind helps a shareholder only if the company turns it into revenue. We score each driver on whether Sai is a main beneficiary, a partial one or a bystander.' },
    { verdicts: [
      ['Large-pharma outsourcing', 'Yes', 'CDMO revenue +33% in FY26; ~91% from large pharma; commercial supply qualification from two more large pharmas in FY26', 'Visible in the numbers'],
      ['Integrated discovery programmes', 'Yes', 'CRO +24% in FY26 and Q1FY27; 65% of customers buy integrated services; discovery capacity opened in Q1 already sold out', 'The steadier engine'],
      ['FTE development model (the "WuXi model")', 'Yes', 'Five of six late-phase molecules added in 15 months came via large-pharma FTE teams; another FTE deal due by end-Q2FY27', 'Builds the commercial pipeline'],
      ['China+1 / BIOSECURE', 'Partly', 'Inbound interest and early clinical formulation for "China+1" supply; no named transfers; the law names no company yet', 'Supportive over years'],
      ['Biotech funding recovery', 'Partly', 'Discovery customers include biotechs; CDMO largely pharma', 'Smaller lever than for biotech-heavy peers'],
      ['Peptides and conjugates', 'Partly', 'Large peptide discovery team; pilot GMP peptide supplies; commercial plant 2028; XDC centre opening', 'Optional; not in our numbers'],
      ['Biologics', 'No', 'No biologics or antibody capability; "we will discuss this strategy at a later point"', 'Absent from the fastest-growing part of the market'],
      ['Weak rupee', 'Yes', '99% exports; forex gains ₹30 cr in FY26', 'Helps profit, but we do not forecast it'],
    ], head: ['Tailwind', 'Captured?', 'Evidence', 'So what'], title: 'Tailwind scorecard: 4 of 8 captured directly, 3 partly, 1 not at all', source: 'Company decks, calls and filings; GAM Research' },
    { callout: '**Our view:** the tailwinds that drive the next three years (large-pharma outsourcing, integrated discovery, FTE development) reach Sai directly, which is why we forecast ~18% revenue growth a year. The ones that excite the market most (BIOSECURE, peptides/GLP-1, conjugates) are real but not yet revenue, and we do not pay for them separately.' },
  ],
};

module.exports = { business, history, industry, tailwind };
