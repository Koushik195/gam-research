// Glenmark report, part 3: North America (core business, respiratory push, Ryaltris), US pipeline and USFDA sites, India.
const X = require('./GLENMARK.ctx');
const { C, F, n0, n1, rup, Q1, FY26, SQ, QL, BL, lines, YRS, share, naUsd26, SHARES } = X;
const yoy = (arr, i) => (i >= 4 && arr[i - 4] ? Math.round((arr[i] / arr[i - 4] - 1) * 1000) / 10 : null);
const NA = SQ.map(q => q.naCore), IN = SQ.map(q => q.india);
const NA_Q = [960, 1010, 1088.1]; // our Q2-Q4FY27 core path (₹ cr), summing to the FY27E build
if (Math.abs(Q1.na - Q1.naDeferredCr + NA_Q.reduce((s, x) => s + x, 0) - lines.na[0]) > 1) throw new Error('GLENMARK NA quarterly path does not sum to FY27E');
const usdQ = NA_Q.map(v => Math.round(v * 10 / BL.fx[0]));
const per25 = 25 * BL.fx[1] / 10, ebitda25 = per25 * 0.5, eps25 = ebitda25 * (1 - 0.26) / SHARES;

const us = {
  id: 'us', nav: 'North America', kicker: 'Segment: North America (24% of core revenue)', title: 'North America: flat for four years; respiratory launches finally lifted core sales 20% in Q1FY27',
  blocks: [
    { p: `Glenmark's North America business has three parts. The **base generics** portfolio (225 products authorised for sale, 53 applications pending) is mostly oral solids, creams and, increasingly, partnered injectables; it suffers yearly price erosion and has not grown: core sales were ₹3,037 cr in FY22 and ₹${n0(FY26.naCoreCr)} cr (~US$${n0(naUsd26)}mn) in FY26. The **respiratory push** started to pay in Q1FY27: the first generic of GSK's Flovent HFA 44mcg inhaler (approved Mar-2026, with a 180-day CGT exclusivity from launch) and an OTC fluticasone nasal spray. **Ryaltris**, Glenmark's own allergy nasal spray, has been sold by its own US team since April 2026 after the Hikma partnership ended. Reported North America revenue also carries ₹${n0(Q1.naDeferredCr)} cr a quarter of ISB 2001 income (US$17.5mn), which we strip out: it is a slice of the upfront AbbVie paid in 2025, not sales.` },
    { pair: [
      { type: 'column', title: `Core sales: ₹${n0(Q1.na - Q1.naDeferredCr)} cr in Q1FY27 (+${Q1.naCoreGrowthPct}%); our path for the rest of FY27`, unit: 'North America excl. ISB 2001 income (₹ crore); Q2-Q4FY27 = GAM', x: [...QL, 'Q2FY27E', 'Q3FY27E', 'Q4FY27E'], series: [{ name: 'NA core', values: [...NA, ...NA_Q], fmt: 'num' }], labels: 'all', source: 'Company releases (core growth rates); GAM estimates' },
      { type: 'column', title: `In dollars: US$${n0(naUsd26)}mn (FY26) to US$${BL.naUsdMn.join(' / ')}mn`, unit: 'North America core sales (US$ mn); FY26 at ₹88.33/$', x: ['FY26', ...YRS], series: [{ name: 'NA core', values: [Math.round(naUsd26), ...BL.naUsdMn], fmt: 'num' }], labels: 'all', source: 'AR FY26; GAM estimates' },
    ] },
    { h: 'The products that matter' },
    { exhibit: { type: 'table', title: 'North America: products and drivers as of 30-Sep-2026', head: ['Product', 'Status', 'Size / competition', 'Source'], wide: [1, 2], rows: C.usProducts.map(p => [`**${p.product}**`, rup(p.status), rup(p.size), p.src]), source: 'Company calls and presentations (Q4FY26, Q1FY27, Investor Day); Glenmark does not disclose product sales' } },
    { callout: `**Our view:** we model North America core at US$${BL.naUsdMn[0]}mn for FY27E (Q2-Q4: US$${usdQ.join(' / ')}mn, +18% in dollars on gFlovent 44's first full quarters, OTC nasal spray, Ryaltris and the two first-to-files late in the year), US$${BL.naUsdMn[1]}mn in FY28E (Monroe injectables, further respiratory approvals, exclusivities fading) and US$${BL.naUsdMn[2]}mn in FY29E. That is faster than anything Glenmark has managed since FY21 and depends on approvals from sites other than Indore. Every US$25mn of US sales is ~₹${n0(per25)} cr of revenue and, at ~50% incremental margin, ~₹${n0(ebitda25)} cr of EBITDA (~₹${n1(eps25)} of EPS).` },
  ],
};

const pipeline = {
  id: 'pipeline', nav: 'US pipeline & plants', kicker: 'North America: launches and compliance', title: 'US launches are back-ended and compliance is still mixed: Monroe and Goa cleared, Indore under a warning letter',
  blocks: [
    { p: 'Management\'s US plan (Q4FY26 and Q1FY27 calls, Investor Day): 2-3 respiratory launches in FY27 (gFlovent 110mcg, prescription fluticasone nasal spray, an ipratropium inhaler: "my hope is at least 2 of these 3 come through" in H2), two exclusive first-to-file products at the end of Q3 and in Q4FY27, Monroe\'s differentiated injectables from FY28, and Ryaltris sold directly. The timing below is management\'s.' },
    { exhibit: { type: 'table', title: 'US launch timetable (management, to Aug-2026)', head: ['When', 'Products', 'What they could be worth'], wide: [1, 2], rows: [
      ['**Q1-Q2FY27 (done / under way)**', 'gFlovent HFA 44mcg (CGT exclusivity), fluticasone nasal spray OTC, nine launches in Q1 incl. methylene blue, vancomycin, olanzapine injections, progesterone insert; fulvestrant relaunched from Monroe', '"This Q2 we\'ll see the full quarter financial out of fluti 44" (CMD); sizes not disclosed'],
      ['**H2FY27**', 'gFlovent 110mcg, fluticasone nasal spray Rx, ipratropium MDI (2 of 3 hoped for); two sole first-to-file products (late Q3, Q4)', 'Management: "U.S. will be a major growth driver" in FY27'],
      ['**FY28+**', 'Monroe differentiated injectables; more MDI and nasal-spray filings; Ryaltris growth (30-40% a year)', '"Next year, I think some of the Monroe differentiated injectables will start contributing" (CMD)'],
    ], source: 'Q4FY26 call (1-Jun-2026), Investor Day (9-Jun-2026), Q1FY27 call (3-Aug-2026)' } },
    { exhibit: { type: 'table', title: 'Manufacturing sites and USFDA status (30-Sep-2026)', head: ['Site', 'Status', 'Why it matters'], wide: [1, 2], rows: C.regulatory.map(r => [`**${r.site}**`, rup(r.status), rup(r.impact)]), source: 'FDA warning letter 320-25-92 (Indore); company filings via Business Standard, IIFL, Indian Pharma Post, SAHI (Goa EIR, 23-Sep-2026)' } },
    { callout: '**Our view:** the compliance picture improved a lot in FY26-27 (Monroe after four years, Goa after almost four), but Glenmark received three warning letters between Dec-2022 and Jul-2025 and Indore is still under one. We give the US launches credit in FY27-28 but no new exclusivity windfall, and we treat a fresh USFDA action as a live risk, not a tail risk.' },
  ],
};

const india = {
  id: 'india', nav: 'India', kicker: 'Segment: India (29% of FY26 core revenue)', title: `India: a strong branded franchise (+${n1((Q1.india / Q1.indiaPrior - 1) * 100)}% in Q1FY27) with a fragile distribution model`,
  blocks: [
    { p: `Glenmark is No.${Q1.indiaRank} in the Indian market with a ${Q1.indiaSharePct}% share (IQVIA MAT Jun-26) but much stronger in its chosen areas: No.2 in dermatology, No.3 in respiratory, No.4 in cardiac, with 11 brands in the market's top 300. About ${n0(Q1.mrs)} medical representatives sell it, with 300-400 added a year. Secondary (pharmacy-level) sales have outgrown the market for three years (1.5x the IPM in FY26). Reported sales are another matter: Glenmark sells through a legacy three-tier system (super-stockists who own the stock), and twice in two years distributors cut inventory sharply: in Q3FY24 (India sales ₹262 cr, when stock points were consolidated) and in Q2FY26 (₹165 cr, after the GST rate change), costing ~₹1,000 cr of sales and an inventory write-down. Q1FY27 was clean: ₹${n0(Q1.india)} cr, +${n1((Q1.india / Q1.indiaPrior - 1) * 100)}%, secondary +${Q1.indiaSecondaryPct}% vs the market's ${Q1.ipmPct}%.` },
    { pair: [
      { type: 'column', title: 'India quarterly sales: the Q2FY26 destocking and the recovery', unit: 'India sales (₹ crore)', x: QL, series: [{ name: 'India', values: IN, fmt: 'num' }], labels: 'all', highlight: 'Q1FY27', source: 'Company releases' },
      { type: 'column', title: 'India annual: FY24 and FY26 hit by destocking; FY27E rebounds', unit: 'India sales (₹ crore); FY27-29E = GAM', x: ['FY22', 'FY23', 'FY24', 'FY25', 'FY26', ...YRS], series: [{ name: 'India', values: [4085.5, 4046.3, 3399.4, 4484.5, FY26.indiaCr, ...lines.india], fmt: 'num' }], labels: 'all', source: 'Company presentations; GAM estimates' },
    ] },
    { bullets: [
      '**Growth mix (CMD):** volume 6-7%, new products ~3%, price 3-4%; management expects 12-15% a year "on a consistent basis".',
      '**What is driving it:** chronic respiratory (the nebulised triple therapy, ~₹70-80 cr in its first year, "the world\'s first"), the Telma cardiac franchise, dermatology, and oncology brands in-licensed from BeOne (Tevimbra, Brukinsa: ₹100 cr+ in their first 12 months). Aumolertinib (lung cancer, from Hansoh) and Trastuzumab Rezetecan (HER2 ADC, from Hengrui) follow.',
      '**Consumer care:** Glenmark Consumer Care (Candid powder, La Shield, Scalpe) had primary sales of ₹155.8 cr in Q1FY27 (+28%); moved into a wholly owned subsidiary in FY26.',
      '**Diabetes:** declining until FY26 (remogliflozin and teneligliptin lost to generic rivals); generic semaglutide (Glipiq) at ₹20-25 cr annualised should stabilise it, not drive growth.',
      '**Concentration:** the top brands are still Telma and its extensions (an analyst flagged the risk on the Q1 call); management sees strong brands as a strength.',
    ] },
    { callout: `**Our view:** India is the best business Glenmark owns. We model ₹${n0(lines.india[0])} cr in FY27E (+45% on a depressed FY26; management said "over ₹4,800 cr", MOSL ₹5,207 cr) and +13% a year after, taking India to ${n1(share('india', 2))}% of revenue by FY29E. The risk is not demand but the channel: a third destocking episode would hit a quarter's profit hard.` },
  ],
};

module.exports = { us, pipeline, india };
