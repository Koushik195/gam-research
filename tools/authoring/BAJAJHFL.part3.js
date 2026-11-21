// Bajaj Housing Finance report, part 3: franchise and AUM mix (retail: home loans, LAP, Sambhav), the commercial
// book (lease rental discounting, developer finance), spread and NIM.
const X = require('./BAJAJHFL.ctx');
const { C, SG, F, A, AS, fin, fi, n0, n1, n2, pc, Q1, G27 } = X;
const SA = SG.annual, A24 = SA[0], A26 = SA.find(a => a.fy === 'FY26'), QN = SG.quarterly.find(q => q.q === 'Q1FY27');
const NAMES = Object.fromEntries(SG.lines.map(l => [l.key, l.name.replace(' (incl. top-ups)', '')]));
const add2y = SG.lines.map(l => [NAMES[l.key], A26[l.key] - A24[l.key]]).sort((a, c) => c[1] - a[1]);
const SB = C.sambhav, PR = Object.fromEntries(C.products.rows.map(r => [r.key, r]));

const franchise = {
  id: 'franchise', nav: 'Franchise & AUM mix', kicker: 'Retail lending', title: 'Retail: a prime home-loan machine that wins on speed, not price; Sambhav is the yield lever',
  blocks: [
    { p: `Home loans (₹${n0(QN.hl)} cr, 54% of AUM) are the core: prime borrowers, an average ticket of ₹48.9 lakh at origination, 83% salaried, 78% with a credit score above 750. BHFL wins business through builders whose projects it has approved and often financed (9,800+ approved projects), through agents and digital partners, and on turnaround time. It does not win on price; it matches the banks. Home loans grew 18% in FY26 and 20% in Q1FY27, below the company as a whole, because of the ~20% annual attrition. Loans against property (₹${n0(QN.lap)} cr) are prime, high-ticket (₹91.6 lakh), 79% to self-employed borrowers and 70% against self-occupied homes; 15% of the book is "flexi" (a drawable limit).` },
    { pair: [
      { type: 'hbar', title: 'Where the last two years\' ₹49,336 cr of growth came from', unit: 'Increase in AUM, Mar-24 to Mar-26 (₹ crore)', x: add2y.map(r => r[0]), series: [{ name: 'Added', values: add2y.map(r => r[1]), fmt: 'num' }], labels: 'all', source: 'Annual reports FY2024-25 and FY2025-26 (table 1a)' },
      { type: 'hbar', title: 'Growth by business, Q1FY27 year on year', unit: 'AUM growth Jun-25 to Jun-26 (%), as reported', x: ['Home loans', 'Loans against property', 'Lease rental discounting', 'Developer finance', 'Total'], series: [{ name: 'Growth', values: [PR.hl.growthQ1, PR.lap.growthQ1, PR.lrd.growthQ1, PR.df.growthQ1, Q1.aumGrowth], fmt: 'pct0' }], labels: 'all', highlight: 'Total', source: 'Q1FY27 presentation p4' },
    ] },
    { p: `**Sambhav** is BHFL's near-prime and affordable unit, launched in 2024 with its own sales and underwriting teams. It now lends ₹450-465 cr a month (₹325-350 cr two quarters earlier), at an average ticket of ₹28 lakh, two-thirds near-prime (target yield 9-11%) and one-third affordable (11-13%), with 65% of borrowers above a 750 credit score. Management wants ₹600 cr+ a month within nine months and the prime : Sambhav mix of home loans to move from 84 : 16 to 80 : 20 by Mar-27. It is the one lever that lifts yields without taking construction risk, but the book is young (most loans are under 12 months old) and its credit costs have not been tested.` },
    { exhibit: { type: 'table', title: 'Our AUM build vs guidance', head: ['', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['AUM (₹ cr)', '{{fin.aum.5|num}}', '{{fin.aum.6|num}}', '{{F.aum.0|num}}', '{{F.aum.1|num}}', '{{F.aum.2|num}}'],
      ['Growth', '{{fin.aumGrowth.5|pct}}', '{{fin.aumGrowth.6|pct}}', '{{F.aumGrowth.0|pct}}', '{{F.aumGrowth.1|pct}}', '{{F.aumGrowth.2|pct}}'],
      ['Company guidance', 'n.d.', `${C.fy26Guidance.aumGrowth} (delivered ${C.fy26Guidance.aumActual})`, G27.aumGrowth, 'n.d.', 'n.d.'],
      ['Street (Motilal / Emkay / JM)', '', '', '~25% / 23.5% / 22.3%', '~23% / 24% / 22.6%', '– / 23.5% / –'],
    ], source: 'Company presentations; broker notes (29-30 Jul 2026; JM 23-Mar-2026); GAM estimates. n.d. = not disclosed' } },
    { callout: `**Our view:** we take the top of FY27 guidance (23%) because Q1 added a record ₹8,918 cr and balance-transfer attrition eased, then fade 2pp a year. We are below the street from FY28 because the industry is growing ~9-10%, prime pricing is set by banks, and the 50% housing-share floor limits how fast the commercial book can grow on balance sheet. Sambhav helps yields at the margin; it is too small to change the group\'s economics before FY29.` },
  ],
};

const commercial = {
  id: 'commercial', nav: 'Commercial book: LRD & developers', kicker: 'Commercial lending', title: 'Lease-rental and developer loans: a third of the book, zero losses so far, and big tickets',
  blocks: [
    { p: `**Lease rental discounting (LRD, ₹${n0(QN.lrd)} cr, 23% of AUM)** lends against the contracted rent of completed offices, warehouses and industrial parks: the tenant pays rent into an escrow account and the lender takes its instalment first. BHFL has 332 such customers with an average loan of ₹137 cr at origination; 68% are REITs, sovereign and pension funds, MNC funds, large companies and large developers. It has had no bad loans since inception. LRD grew 44% in FY26 and 41% in Q1FY27, making it the main source of growth. The MD groups it with home loans as "lower margin" than developer loans, but the cost of servicing a ₹137 cr loan per rupee is tiny.` },
    { p: `**Developer finance (₹${n0(QN.df)} cr, 11%)** funds the construction of residential and commercial projects for 608 developers across 895 projects (average ₹58.8 cr), released in tranches against construction milestones, with sales receipts swept through escrow and interest paid from day one. It is the highest-margin product in the book (MD, Q4FY26 call) and a feeder for retail home loans. Growth slowed to 13% in FY26 and 19% in Q1FY27 because funded projects are repaying faster. One account moved to Stage 3 in Q1FY27 (gross NPA 0.12%); it was already provided at ~48%.` },
    { pair: [
      { type: 'column', title: 'LRD: ₹17,637 cr to ₹34,604 cr in nine quarters', unit: 'Lease rental discounting AUM (₹ crore)', x: ['FY24', 'FY25', 'FY26', 'Q1FY27'], series: [{ name: 'LRD', values: [...SA.map(a => a.lrd), QN.lrd], fmt: 'num' }], labels: 'all', highlight: 'Q1FY27', source: 'Annual reports; Q1FY27 presentation p38' },
      { type: 'hbar', title: 'Commercial real estate is 27% of AUM on the regulator\'s definition', unit: 'AUM by regulatory category, Mar-26 (% of AUM)', x: ['Housing loans (individuals)', 'Non-housing loans (incl. LAP)', 'Commercial real estate: residential', 'Commercial real estate: other'], series: [{ name: 'Share', values: [C.products.regulatory.FY26.housingAum, C.products.regulatory.FY26.nonHousingAum, C.products.regulatory.FY26.creResidentialAum, C.products.regulatory.FY26.creAum].map(v => Math.round(v / 140706 * 1000) / 10), fmt: 'pct' }], labels: 'all', source: 'Annual Report FY2025-26, MD&A table 1(b)' },
    ] },
    { callout: '**The honest risk:** the commercial book has never been through a property downturn under BHFL. LRD depends on tenants renewing leases and on office values; developer loans on project sales. Both are secured and escrowed, and BHFL picks large, rated counterparties, but tickets of ₹60-140 cr mean a handful of defaults would move credit costs from ~10bp to 30-50bp. Our bear case adds 10bp; a real commercial-property slump would cost more.' },
  ],
};

const spread = {
  id: 'spread', nav: 'Spread & NIM', kicker: 'Margins', title: 'NIM: down 20-25bp this year as the old book runs off; banks leave no room to reprice',
  blocks: [
    { p: `BHFL's reported net interest margin (net total income ÷ average loan assets) was 3.9% in FY26 and 3.7% in Q1FY27. Management expects FY27 to be 20-25bp below FY26, of which 14bp is already in Q1 and "6 bps to 10 bps" more is to come. The reason is mechanical: in a stable-rate market the old book, written at higher rates, keeps repaying and is replaced by new loans at today\'s lower acquisition rates. The 2025 rate cuts were passed through to ~₹17,000 cr of repo-linked loans and to the lending rate (another 15bp in Dec-2025). Funding costs fell more slowly (7.9% in Q4FY25 → 7.2% in Q1FY27) and the incremental money-market rate rose in Q4-Q1. The CFO\'s summary: "largely it will still have compression because of the yields going down".` },
    { exhibit: { type: 'table', title: 'Spread and margin on AUM: history and our forecast', x: 'fin.labels', from: 'FY22', to: 'FY29E', rowsRef: [
      { name: 'Interest income ÷ average AUM (%)', ref: 'fin.yieldOnAum', fmt: 'pct' }, { name: 'Cost of funds on average borrowings (%)', ref: 'fin.costOfFunds', fmt: 'pct' },
      { name: 'Spread (pp)', ref: 'fin.spread', fmt: 'n2' }, { name: 'NIM: NII ÷ average AUM (%)', ref: 'fin.nim', fmt: 'pct', hl: true },
      { name: 'Fees & other income ÷ average AUM (%)', ref: 'fin.feePct', fmt: 'pct' }, { name: 'Net total income ÷ average AUM (%)', ref: 'fin.ntiPct', fmt: 'pct', hl: true },
    ], source: 'Company, Screener.in; GAM estimates. On AUM (incl. ~12% assigned loans that earn no interest on BHFL\'s books), so ratios are ~12% below the company\'s ratios on loan assets: FY26 net total income ÷ average loan assets = 3.9%.' } },
    { pair: [
      { type: 'column', title: 'NII growth has fallen below AUM growth', unit: 'Growth (%)', x: 'fin.labels', from: 'FY23', to: 'FY29E', series: [{ name: 'AUM growth', ref: 'fin.aumGrowth', fmt: 'pct0' }, { name: 'NII growth', ref: 'fin.niiGrowth', fmt: 'pct0' }], labels: 'all', source: 'Company, Screener.in; GAM estimates' },
      { type: 'line', title: 'Gross spread: 1.9pp in FY25, 1.7pp now', unit: 'Portfolio yield minus cost of funds, company-reported (pp)', x: C.quarterlyKpis.map(q => q.q), series: [{ name: 'Gross spread', values: C.quarterlyKpis.map(q => Math.round((q.portfolioYield - q.costOfFunds) * 10) / 10), fmt: 'n1' }], labels: 'all', min: 0, max: 2.5, source: 'Q1FY27 presentation p24 (our subtraction of rounded figures)' },
    ] },
    { p: `**Rates: which way helps?** Counter-intuitively, BHFL\'s margin would benefit from a rate *hike*. 63% of its borrowings are floating (including swaps), so its funding cost rises with rates, but so do its repo-linked loans and its lending rate; management says that in a hike "it has never happened that there is no pass-through", typically 10-20bp of a 25bp move, and that without a hike it cannot pass on dearer money-market funding. In a long pause, competition grinds yields down; that is the scenario management assumes for FY27, and so do we.` },
    { callout: `**Our forecast:** net total income ÷ average AUM falls from {{fin.ntiPct.6|pct}} in FY26 to {{F.ntiPct.0|pct}} in FY27E (≈3.65% on loan assets, slightly below the ~3.7% management guides) and {{F.ntiPct.2|pct}} by FY29E: yields drift down a few basis points a year while the Sambhav mix and a slightly lower cost of funds offset part of it, and rising leverage means more of the book is debt-funded. We do not assume the margin recovery that Emkay (NIM up in FY28-29E) builds in.` },
  ],
};

module.exports = { franchise, commercial, spread, ...require('./BAJAJHFL.part3b') };
