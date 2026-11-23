// Lupin report, part 3: United States (windfall and its fade), US pipeline and plants, India, other markets and API, moat.
const X = require('./LUPIN.ctx');
const { C, D, F, n0, n1, pc, rup, Q1, FY26, SQ, QL, BL, lines, YRS, share } = X;
const yoy = (arr, i) => (i >= 4 && arr[i - 4] ? Math.round((arr[i] / arr[i - 4] - 1) * 1000) / 10 : null);
const US = SQ.map(q => q.usUsd), IN = SQ.map(q => q.india), OD = SQ.map(q => q.odm), EM = SQ.map(q => q.em);
const US_Q = [285, 260, 259]; // our Q2-Q4FY27 path, summing to the FY27E $ figure
if (Q1.usUsdMn + US_Q.reduce((s, x) => s + x, 0) !== BL.usdMn[0]) throw new Error('LUPIN US quarterly path does not sum to FY27E');

const us = {
  id: 'us', nav: 'United States', kicker: 'Segment: United States (42% of sales)', title: 'United States: three exclusivities doubled the business; two are now being competed away',
  blocks: [
    { p: 'Lupin\'s US business has two layers. The **base**: 149 marketed generics (No.1 in 56, top-3 in 112), led by respiratory (over 20% of the base: albuterol, tiotropium, Xopenex), plus tablets, capsules and a growing injectables list (glucagon, liraglutide, gRisperdal Consta). It suffers low-to-mid single-digit price erosion each year and grows on volume and launches (15 in FY26). The **windfall**: generic Spiriva HandiHaler (first generic, Aug-2023; ~35-38% of the molecule and still no generic rival), Mirabegron (launched at risk in Apr-2024; settled with Astellas in Feb-2026 for $90mn plus a per-unit fee) and Tolvaptan (exclusive first-to-file from May-2025; the only generic for more than a year because rivals had patent and manufacturing hurdles). Lupin does not disclose product sales; brokers put the three at about half of group EPS (PL, Nuvama).' },
    { pair: [
      { type: 'column', title: 'US quarterly sales: our path vs Q1FY27\'s $366mn', unit: 'US sales (US$ mn); Q2-Q4FY27 = GAM estimates (guide $250-280mn)', x: [...QL, 'Q2FY27E', 'Q3FY27E', 'Q4FY27E'], series: [{ name: 'US', values: [...US, ...US_Q], fmt: 'num' }], labels: 'all', source: 'Company releases; GAM estimates' },
      { type: 'column', title: `Annual: US$${n0(BL.usdMn[0])}mn in FY27E, flattish after`, unit: 'US sales (US$ mn)', x: ['FY24', 'FY25', 'FY26', ...YRS], series: [{ name: 'US', values: [815, 944, FY26.usUsdMn, ...BL.usdMn], fmt: 'num' }], labels: 'all', source: 'Company releases (FY25 regrouped); GAM estimates' },
    ] },
    { h: 'The products that matter' },
    { exhibit: { type: 'table', title: 'US products and pipeline as of 30-Sep-2026', head: ['Product', 'Status', 'Size / competition', 'Source'], wide: [1, 2], rows: C.usProducts.map(p => [`**${p.product}**`, rup(p.status), rup(p.size), p.src]), source: 'Company releases, calls and filings; court and FDA documents; broker notes as cited' } },
    { p: 'What happens next is mostly known. **Tolvaptan**: Apotex and Teva launch from Q2FY27 and a fourth entrant may follow in September; management expects a "longer tail" because the drug is sold through specialty pharmacies under a safety (REMS) programme and generic penetration is still ~40%, but prices will fall. **Mirabegron**: a third generic arrived in Q1FY27; most settlements allow entry from Sep-2027; Lupin pays Astellas a per-unit fee and amortises the $75mn option until then. **Spiriva**: stable, but the brand market is moving to the Respimat version, which Lupin will only file in FY27.' },
    { callout: `**Our view:** we model US$${n0(BL.usdMn[0])}mn for FY27E (Q2-Q4: $${US_Q.join(' / ')}mn, the upper half of guidance, as Lupin beat its FY26 guidance), US$${n0(BL.usdMn[1])}mn for FY28E (the apixaban oral suspension, pegfilgrastim and exclusivities offset Tolvaptan and Mirabegron) and US$${n0(BL.usdMn[2])}mn for FY29E (apixaban generics arrive). That is above Citi ($975mn base by FY29) and below BOB ($1.33bn). Every $50mn of US sales is ~₹${n0(50 * BL.fx[1] / 10)} cr of revenue and, at ~60% incremental margin for exclusive products, ~₹${n0(50 * BL.fx[1] / 10 * 0.6)} cr of EBITDA (~${n1(50 * BL.fx[1] / 10 * 0.6 * 0.73 / F.pat[1] * 100)}% of FY28E EPS).` },
  ],
};

const pipeline = {
  id: 'pipeline', nav: 'US pipeline & plants', kicker: 'United States: what replaces the windfall', title: 'The replacements: apixaban, biosimilars, inhalers and nasal sprays, mostly from FY28',
  blocks: [
    { p: 'Management\'s plan: 50+ US launches in three years, including 10 exclusive first-to-files, five biosimilars and two or three 505(b)(2)s (new versions of existing drugs, with their own approval and some protection), and 15+ filings in FY27 (seven or more in respiratory). It expects the US to grow again from FY28 on the FY27 base. The timing below is management\'s, as stated on the Q4FY26 and Q1FY27 calls.' },
    { exhibit: { type: 'table', title: 'Launch timetable (management, Aug-2026)', head: ['Year', 'Products', 'What they could be worth'], wide: [1, 2], rows: [
      ['**FY27 (H2)**', 'Pegfilgrastim biosimilar (via Valorum), dalbavancin 505(b)(2), fluticasone nasal spray (Rx), sugammadex, epinephrine and eribulin injections, raltegravir (exclusive FTF), gSaxenda', 'Pegfilgrastim "a really good size opportunity"; biosimilars ~$50mn today, "multiple times" in FY27 (MD)'],
      ['**FY28**', 'Apixaban oral suspension (505(b)(2), tentative approval 25-Sep-2026; launch around summer 2027), full-year pegfilgrastim, ranibizumab, iron sucrose, diazepam and epinephrine nasal sprays (exclusive FTFs), ivacaftor (exclusive FTF), Suflave (exclusive FTF), midazolam nasal spray, gDulera (if approved)', 'Apixaban "could potentially get" to Tolvaptan/Mirabegron size for 10-12 months; ivacaftor $20-30mn (Bernstein)'],
      ['**FY29+**', 'Aflibercept and pegfilgrastim on-body biosimilars, gDulera (if not FY28), gSpiriva Respimat (subject to patents), Breo Ellipta, etanercept (CY29), Xywav (FY33)', 'Biosimilars "a couple of hundred million dollars" across US and Europe in three years (CEO)'],
    ], source: 'Q4FY26 call (8-May-2026), Q1FY27 call (7-Aug-2026), FDA letter (NDA 220446), Bernstein via StockGro (27-Aug-2026)' } },
    { exhibit: { type: 'table', title: 'Manufacturing sites and USFDA status (30-Sep-2026)', head: ['Site', 'Status', 'Why it matters'], wide: [1, 2], rows: C.regulatory.map(r => [`**${r.site}**`, rup(r.status), rup(r.impact)]), source: 'Q1FY27 presentation and call; Q3FY26 call; ICRA (8-Jul-2026); Medical Dialogues (Pithampur)' } },
    { callout: '**Our view:** the pipeline is broader than most Indian peers\' and the compliance picture improved in FY26-27 (Somerset, Goa, Nagpur, Ankleshwar cleared). But the big items are back-ended and several are one-year opportunities (apixaban before generics, nasal-spray exclusivities). We give them credit in FY28 (US +3%) but do not assume a new Tolvaptan-sized windfall every year. Two warning letters and Pithampur Unit-2\'s OAI rating remain open.' },
  ],
};

const india = {
  id: 'india', nav: 'India', kicker: 'Segment: India (30% of sales)', title: `India: a chronic-heavy franchise growing ahead of the market (+${Q1.indiaGrowthPct}% in Q1FY27)`,
  blocks: [
    { p: `Lupin is No.8 in the Indian market (IQVIA MAT Jun-26). About 67% of its prescription portfolio is chronic (diabetes, heart, respiratory, CNS), sold by ~${n0(Q1.salesForce)} people (${n0(Q1.mrs)} medical representatives). It leads in anti-TB and is No.2 in respiratory and No.3 in cardiac and diabetes (ICRA) (it markets Lilly's Huminsulin and launched generic semaglutide in Q4FY26). FY26 India sales grew only 7.1% because tender sales to government (the Global Institutional Business) fell and some in-licensed diabetes products lost exclusivity; prescriptions grew 10.6% (IPM 9.9%). Q1FY27 was the best quarter in two years: +${Q1.indiaGrowthPct}%, prescriptions +${Q1.indiaRxGrowthPct}% vs the market's ${Q1.ipmGrowthPct}%, volume +6.1%.` },
    { pair: [
      { type: 'column', title: 'India growth: 3-12% in FY26, 14% in Q1FY27', unit: 'India sales growth, year on year (%)', x: QL.slice(4), series: [{ name: 'Growth', values: IN.map((_, i) => yoy(IN, i)).slice(4), fmt: 'pct' }], labels: 'all', source: 'Company releases' },
      { type: 'hbar', title: 'Q1FY27: diabetes and cardiac led; respiratory lagged', unit: 'Growth vs the market\'s category growth (x)', x: ['Anti-diabetes', 'Cardiac', 'Rx total', 'Respiratory'], series: [{ name: 'x market', values: [1.8, 1.2, 1.1, 0.6], fmt: 'n1' }], labels: 'all', source: 'Q1FY27 call and presentation (respiratory +6.9% vs category +11.3%)' },
    ] },
    { bullets: [
      '**Mix shift:** in-licensed products fell from ~12% of the Rx portfolio (FY25) to ~6%, lifting margins; target 70% chronic by FY31 and one-third of India sales from proprietary products in ten years (in-house, in-licensed and new chemical entities such as Bofanglutide).',
      '**Obesity:** semaglutide injection launched under two brands with a dedicated ~200-person division; oral and vial forms due in H2FY27. Management called the opportunity ~₹1,500 cr for the market in year one and ₹50-60 cr for Lupin, before launch.',
      '**Adjacencies:** diagnostics (7 lakh patients a quarter), digital health and consumer health still lose money; together with CDMO they cost 100-150bp of group margin (CFO); diagnostics to break even in FY28.',
      '**Price control:** many respiratory and anti-infective drugs are under the price-control list; increases are capped each April.',
    ] },
    { callout: `**Our view:** India is the steadiest part of Lupin. We model +13% / +12% / +12% (FY27-29E), consistent with 1.2-1.3x a market growing ~10-11%, taking India to ${n1(share('india', 2))}% of product sales by FY29E (30% in FY26).` },
  ],
};

const others = {
  id: 'others', nav: 'Other markets & API', kicker: 'Segments: other developed markets (12%), emerging markets (13%), API (4%)', title: 'Europe, emerging markets and API: a quarter of sales, growing 15-50%',
  blocks: [
    { p: `**Other developed markets** (₹${n0(FY26.odmCr)} cr in FY26) are Europe, Canada and Australia. Europe passed $200mn in FY26 and grew 83% in Q1FY27 as VISUfarma joined: a Dutch-Italian eye-care company with 60+ products in Italy, Spain, the UK, Germany and France, bought from GHO Capital at an enterprise value of €190mn (~₹1,970 cr, cash) and consolidated from April 2026 (€53mn revenue in 2025; management cites ~25% margins and $100mn+ revenue in two to three years). Lupin also sells inhalers (Luforbec), NaMuscla (a rare-disease drug) and biosimilars through partners such as Sandoz. Management guides Europe +10-20% a year.` },
    { p: `**Emerging markets** (₹${n0(FY26.emCr)} cr, +35% in FY26) turned around: Brazil grew 117% in local currency in Q1FY27 on dapagliflozin and empagliflozin; South Africa (Pharma Dynamics) and the Philippines (Multicare, 56.3% owned) are steady; Mexico (Grin) profitable. **API** (₹${n0(FY26.apiCr)} cr) is mostly captive and fluctuates; the Dabhasa and Vizag sites were moved into Lupin Manufacturing Solutions to sell more to third parties.` },
    { pair: [
      { type: 'column', title: 'Other developed markets: ₹1,149 cr in Q1FY27 with VISUfarma', unit: 'Sales (₹ crore)', x: QL, series: [{ name: 'Other developed', values: OD, fmt: 'num' }], labels: 'all', highlight: 'Q1FY27', source: 'Company releases' },
      { type: 'column', title: 'Emerging markets: a step up from Q2FY26', unit: 'Sales (₹ crore)', x: QL, series: [{ name: 'Emerging', values: EM, fmt: 'num' }], labels: 'all', source: 'Company releases' },
    ] },
    { callout: `**Our view:** these markets are no longer a footnote: ₹${n0(lines.odm[0] + lines.em[0])} cr in FY27E on our numbers (${n1(share('odm', 0) + share('em', 0))}% of product sales). We model other developed markets +39% / +13% / +12% (FY27 includes VISUfarma) and emerging markets +16% / +11% / +10%. Margins are improving from a subscale base, but neither business has the pricing power of the US exclusivities.` },
  ],
};

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: real capability in hard US generics and Indian chronic brands; no lasting moat in the US',
  blocks: [
    { verdicts: D.moat.map(m => [m.area, m.verdict, rup(m.evidence), rup(m.soWhat)]), head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Competitive advantage scorecard', source: 'GAM Research; company; IQVIA via company; ICRA' },
    { callout: '**Honest verdict:** Lupin has genuine capabilities: it made the first generic Spiriva, won and settled patent fights that rivals lost, and has a chronic-heavy Indian franchise. But in the US those capabilities produce temporary profits, not a moat: every exclusive product attracts rivals within one to three years, and Lupin\'s compliance record (warning letters in 2017 and still two open today) has cost it launches before. The right way to think about Lupin is a solid Indian and emerging-market business plus a US product machine whose output is lumpy.' },
  ],
};

module.exports = { us, pipeline, india, others, moat };
