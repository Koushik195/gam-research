// Sun Pharma report, part 3: innovative medicines (global specialty), US generics incl. Taro, FDA status and tariffs, India.
const X = require('./SUNPHARMA.ctx');
const { C, D, F, SA, SQ, QL, n0, n1, pc, rup, build, usdBuild, BL } = X;
const IN = C.innovative, Q1 = C.q1fy27;

const innovative = {
  id: 'innovative', nav: 'Innovative medicines', kicker: 'Segment: global innovative medicines', title: '$1.42 bn of specialty sales, growing ~13-17%; the new launches are slower than hoped',
  blocks: [
    { p: `Sun began building a branded ("innovative" or "specialty") business in 2012 with DUSA's Levulan and now sells 29 such products, mostly in the US through its own sales force. Sales grew from $674 mn in FY22 to $1,420 mn in FY26 (+16.8% in FY26) and were $351 mn in Q1FY27 (+12.8%, 21.9% of Sun's sales). In the US, innovative medicines passed $1 bn in FY26 and are now bigger than Sun's US generics. The engine is **Ilumya** (tildrakizumab, an IL-23 biologic for psoriasis licensed from Merck in 2014): $796 mn in FY26 (+16.7%), launched in ~40 countries, with a US decision on psoriatic arthritis due in late Oct-2026. Behind it come Cequa (dry eye), Odomzo (basal cell carcinoma), Winlevi (acne) and Levulan, and two launches: **Leqselvi** (oral JAK for severe alopecia areata; US launch 14-Jul-2025 after a royalty-bearing settlement with Incyte) and **Unloxcyt** (PD-L1 antibody for advanced cutaneous squamous cell carcinoma; available from 15-Jan-2026).` },
    { pair: [
      { type: 'column', title: 'Innovative sales: +24% a year since FY21, +17% in FY26', unit: 'Global innovative medicines ($ mn)', x: ['FY22', 'FY23', 'FY24', 'FY25', 'FY26'], series: [{ name: 'Innovative medicines', values: SA.map(a => a.innovUsdM), fmt: 'num' }], labels: 'all', source: 'Investor presentation Jun-2026 p.20; Q4FY26 call' },
      { type: 'column', title: 'Quarterly: $354 mn in Q4FY26, $351 mn in Q1FY27', unit: 'Innovative medicines ($ mn per quarter; Q2-Q3FY26 not disclosed separately)', x: ['Q4FY25', 'Q1FY26', 'Q4FY26', 'Q1FY27'], series: [{ name: 'Innovative medicines', values: [295, 311, 354, 351], fmt: 'num' }], labels: 'all', source: 'Q4FY26 and Q1FY27 calls (growth rates applied to back out the year-ago quarters)' },
    ] },
    { exhibit: { type: 'table', title: 'The innovative portfolio', head: ['Product', 'What it is', 'Status / numbers'], wide: [1, 2], rows: IN.products.map(r => r.map(rup)), source: 'Company presentations and calls; Business Standard (14-Jul-2025); sunpharma.com/usa (15-Jan-2026); Emkay (4-Aug-2026)' } },
    { h: 'What we watch' },
    { p: `Three questions decide this business. (1) **Can Ilumya keep growing?** IL-23 is the fastest-growing class in psoriasis, and Ilumya's Medicare Part B channel is not affected by cheap Stelara biosimilars (management), but it is the third IL-23 in a market led by J&J's Tremfya and AbbVie's Skyrizi; psoriatic arthritis (decision late Oct-2026) adds a second indication. (2) **How fast do Leqselvi and Unloxcyt build?** Management will not give product numbers; Leqselvi passed 1,000 prescribers in June 2026 and has most US covered lives, Unloxcyt is being added to cancer-centre formularies. But global innovative sales were broadly flat for three quarters despite both launches (an analyst's point on the Q1 call), launch spend (~$100 mn in FY26) is now permanent, and AbbVie's Rinvoq could be approved in alopecia by early 2027. (3) **Can Sun replace products that lose exclusivity?** The in-house pipeline is thin (Fibromun in Phase 3, Nidlegy refiled in Europe by its partner, GL0034 and MM-II to be partnered; SCD-044 was dropped in FY26).` },
    { callout: '**Our view:** a valuable, profitable franchise (we estimate it earns well above the group margin) that has moved Sun from a generics company to a hybrid. But it is mid-sized by global standards ($1.4 bn), built on in-licensed molecules with limited patent life, and its growth is slowing from 20%+ to low-to-mid teens. We do not model it separately; our US dollar growth of −4% / +6% / +6% assumes innovative medicines grow ~12-15% a year and offset generic erosion from FY28.' },
  ],
};

const FDA = C.usfda, TF = C.tariffs;
const us = {
  id: 'us', nav: 'US generics & FDA', kicker: 'Segment: US formulations', title: 'US: $1.9 bn for three years, falling in FY27; four plants under FDA action',
  blocks: [
    { p: `US formulations were $1,921 mn in FY25, $1,905 mn in FY26 and $427 mn in Q1FY27 (−9.7%; 26.6% of sales). The mix has changed: innovative medicines grew to over $1 bn while generics (including Taro, fully owned since Jun-2024) shrank, first through price erosion and then through the end of gRevlimid (the limited-volume generic of Revlimid that boosted many Indian companies in FY23-26 until full generic entry in Jan-2026). Management blames "additional competition in certain products" and, more fundamentally, the plants: "because of the compliance issue, we haven't been getting approval" (chairman, 22-May-2026).` },
    { pair: [
      { type: 'column', title: 'US quarterly sales: no growth for two years, then a drop', unit: 'US formulations ($ mn)', x: QL, series: [{ name: 'US', values: SQ.map(q => q.usUsdM), fmt: 'num' }], labels: 'all', source: 'PL Q1FY27 note; company calls' },
      { type: 'column', title: 'Our US build: down in FY27E, +6% a year after', unit: 'US formulations ($ mn), GAM estimates', x: ['FY26', 'FY27E', 'FY28E', 'FY29E'], series: [{ name: 'US', values: usdBuild.us.map(Math.round), fmt: 'num' }], labels: 'all', source: 'GAM estimates (businessLines in assumptions.json)' },
    ] },
    { exhibit: { type: 'table', title: 'US FDA status of key Indian plants (as disclosed by 30-Sep-2026)', head: ['Site', 'Status', 'What it means'], wide: [1, 2], rows: FDA.rows.filter(r => r[0] !== 'Others').map(r => r.map(rup)), source: 'AR FY26 standalone note 54 and BRSR; FDA warning letters (15-Dec-2022, 16-Oct-2023, 18-Jun-2024); Business Standard (9-Sep-2025, 18-Dec-2025). No new FDA actions found for Jun-Sep 2026.' } },
    { h: 'Tariffs: generics are exempt; patented products are not' },
    { p: `${TF.summary} Sun has three US formulation plants (Levulan is made in the US); it does not disclose where Ilumya, Cequa, Odomzo, Winlevi, Leqselvi or Unloxcyt are made. Its North America CEO called the FY27 impact "marginal" (22-May-2026) and said Sun is looking at all alternatives. We model no tariff cost; it is a risk to our innovative growth assumption if Sun has to absorb the duty on a large product.` },
    { callout: '**Our view:** US generics are a drag, not a driver, and will remain so until Halol, Mohali, Dadra and Baska are cleared; the greenfield sterile plant in Madhya Pradesh is years away. We assume US dollar sales fall 4% in FY27E (gRevlimid out of the base; Q1 annualises at ~$1.71 bn) and grow 6% a year in FY28-29E on innovative medicines. Street estimates (Emkay: US ~$1.9 bn for a third year) are similar.' },
  ],
};

const IND = D.industry, ranks = IND.prescriberRanks.rows, brands = IND.topBrands.rows;
const india = {
  id: 'india', nav: 'India', kicker: 'Segment: India formulations', title: 'India: No.1 and still gaining share; the most valuable part of Sun',
  blocks: [
    { p: `India formulations grew 14% to ₹19,290 cr in FY26 and 16% to ₹5,475 cr in Q1FY27 (36% of sales). Sun's share of the Indian market rose from 8.1% to 8.4% in FY26, "the highest gain since the Ranbaxy acquisition" (MD), and to 8.5% in the 12 months to Jun-2026. Growth is unusually volume-led: in Q1FY27 40% came from volume and 20% from new products (volume +5.4% vs the market's +2%), helped by field-force expansion into tier-2 and tier-3 towns (medical reps up from 11,149 in FY22 to 16,767 in FY26) while productivity held at ₹11.5 mn per rep, the industry's highest. Sun is No.1 by prescriptions with 12 groups of specialists, has 30 brands in India's top 300 and its top 10 brands are only ~17% of India sales. Semaglutide (launched 21-Mar-2026 as Noveltreat and Sematrinity, with the only auto-injector) made Sun the No.2 generic player within four months.` },
    { pair: [
      { type: 'column', title: 'India sales: +14% in FY26, +16% in Q1FY27', unit: 'India formulations (₹ crore per quarter)', x: QL, series: [{ name: 'India', values: SQ.map(q => Math.round(q.india)), fmt: 'num' }], labels: 'all', source: 'PL Q1FY27 note; company presentations' },
      { type: 'column', title: 'Field force up 50% in four years, productivity held', unit: 'Medical representatives (number)', x: ['FY22', 'FY23', 'FY24', 'FY25', 'FY26'], series: [{ name: 'Medical reps', values: SA.map(a => a.mrs), fmt: 'num' }], labels: 'all', source: 'Investor presentation Jun-2026 p.31' },
    ] },
    { pair: [
      { type: 'table', title: 'Top brands (MAT Jun-2026)', head: ['Brand', '₹ cr', '3-yr CAGR'], rows: brands.map(r => [r[0], n1(r[1]), `${r[2]}%`]), source: 'ICICI Direct Q1FY27 note (AWACS data)' },
      { type: 'table', title: 'Prescription rank by specialist', head: ['Specialist', 'Feb-23', 'Feb-24', 'Feb-25', 'Feb-26'], rows: ranks.map(r => [r[0], r[1], r[2], r[3], r[4]]), source: 'SMSRC via Sun investor presentation Jun-2026' },
    ] },
    { callout: `**Our view:** this is the crown jewel: a broad, chronic-heavy, prescription-led franchise growing faster than a ~10% market with a light dependence on any one brand. We model +14% in FY27E (semaglutide, field force), then +12% and +11.5%. Risks: price controls (NLEM revisions, trade margin caps), generic-generic competition in GLP-1s, and the Organon deal shrinking India to ~17% of the combined company, which dilutes the best business.` },
  ],
};

module.exports = { innovative, us, india };
