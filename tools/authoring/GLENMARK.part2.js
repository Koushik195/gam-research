// Glenmark report, part 2: what the company does, history (four eras), industry, tailwind test.
const X = require('./GLENMARK.ctx');
const { C, D, A, F, n0, n1, FY26, Q1, rup, SA, BL, core26, lines, share } = X;
const sh = v => Math.round(v / core26 * 100);

const business = {
  id: 'business', nav: 'What Glenmark does', kicker: 'Company', title: 'What Glenmark does: an Indian branded franchise, a flat US generics business, growing Europe and EM arms, and a biotech that just sold its best asset',
  blocks: [
    { p: rup(`Glenmark sells medicines in 80+ countries from 11 plants. **India** (Rs${n0(FY26.indiaCr)} cr in FY26, ${sh(FY26.indiaCr)}% of core revenue) is a branded franchise ranked No.13 in the market but No.2 in dermatology, No.3 in respiratory and No.4 in cardiac, with brands such as Telma, Ascoril, Candid and Alex and a consumer arm (Glenmark Consumer Care). **North America** (Rs${n0(FY26.naCoreCr)} cr excluding licensing income, ${sh(FY26.naCoreCr)}%, ~US$${n0(X.naUsd26)}mn) sells 225 generics plus Glenmark's own nasal spray Ryaltris; it has barely grown in four years. **Europe** (Rs${n0(FY26.europeCr)} cr, ${sh(FY26.europeCr)}%) mixes generics with branded respiratory and dermatology products. **Emerging markets** (Rs${n0(FY26.emCr)} cr, ${sh(FY26.emCr)}%: Russia/CIS, Latin America, Middle East & Africa, Asia-Pacific) are branded generics. **Ichnos Glenmark Innovation (IGI)**, the US/Swiss biotech arm, licensed its lead antibody ISB 2001 to AbbVie in Jul-2025 for US$700mn upfront; it now spends ~US$70mn a year on the next molecules.`) },
    { pair: [
      { type: 'hbar', title: 'FY26 core revenue: four regions of similar size', unit: 'Share of FY26 revenue excl. ISB 2001 income (%)', x: ['India', 'North America (core)', 'Europe', 'Emerging markets'], series: [{ name: 'Share', values: [sh(FY26.indiaCr), sh(FY26.naCoreCr), sh(FY26.europeCr), sh(FY26.emCr)], fmt: 'pct0' }], labels: 'all', source: 'AR FY26 segment table; GAM (licensing income removed)' },
      { type: 'column', title: 'India grows, North America does not', unit: 'Revenue (₹ crore); FY27E = GAM build', x: ['FY23', 'FY24', 'FY25', 'FY26', 'FY27E'], series: [{ name: 'India', values: [...SA.filter(r => r.fy >= 'FY23').map(r => r.india), lines.india[0]], fmt: 'num' }, { name: 'North America (core)', values: [...SA.filter(r => r.fy >= 'FY23').map(r => r.naCore ?? r.na), lines.na[0]], fmt: 'num' }], labels: 'all', source: 'Company presentations (continuing operations); GAM estimates' },
    ] },
    { exhibit: { type: 'table', title: 'The businesses at a glance', head: ['Business', 'FY26', 'Q1FY27', 'Position', 'What drives it'], wide: [3, 4], rows: [
      ['**India**', `₹${n0(FY26.indiaCr)} cr (−17%: GST destocking in Q2)`, `₹${n0(Q1.india)} cr (+${n1((Q1.india / Q1.indiaPrior - 1) * 100)}%)`, `No.${Q1.indiaRank} (${Q1.indiaSharePct}% share); No.2 dermatology, No.3 respiratory, No.4 cardiac; ~${n0(Q1.mrs)} reps`, 'Chronic respiratory, cardiac (Telma), dermatology, oncology in-licensing (Tevimbra, Brukinsa), consumer care'],
      ['**North America**', `₹${n0(FY26.naCoreCr)} cr core (+5%); ₹${n0(FY26.isbIncomeCr)} cr ISB 2001 income`, `₹${n0(Q1.na)} cr incl. ₹${n0(Q1.naDeferredCr)} cr deferred (core +${Q1.naCoreGrowthPct}%)`, '225 generics; Ryaltris; 20+ partnered injectables', 'Respiratory launches (gFlovent 44 with CGT exclusivity), two first-to-files in H2FY27, Monroe injectables from FY28'],
      ['**Europe**', `₹${n0(FY26.europeCr)} cr (+9%)`, `₹${n0(Q1.europe)} cr (+${n1((Q1.europe / Q1.europePrior - 1) * 100)}%)`, 'Branded ~30% of sales (target ~60% in five years)', 'Ryaltris, inhalers, Winlevi (acne), Hilkota'],
      ['**Emerging markets**', `₹${n0(FY26.emCr)} cr (+5%)`, `₹${n0(Q1.em)} cr (+${n1((Q1.em / Q1.emPrior - 1) * 100)}%)`, 'No.8 in Russian dermatology; Ryaltris the leading allergy spray in most markets', 'Ryaltris Brazil (H2FY27), oncology launches (Aumolertinib, Trastuzumab Rezetecan, envafolimab)'],
      ['**IGI (innovation)**', 'US$525mn of the upfront booked; ~US$70mn a year of R&D', '>160 patients dosed on ISB 2001 (AbbVie runs the programme)', 'Multispecific antibody (BEAT) platform', 'ISB 2001 milestones (up to US$1.225bn) and royalties; ISB 2301 IND by end-2026'],
    ], source: 'Company presentations and calls (Q4FY26, Q1FY27); AR FY26; growth in rupees' } },
    { callout: '**So what:** Glenmark is a branded-generics company (India, Europe, EM: ~75% of core revenue) attached to a sub-scale US generics business and a biotech option. The branded side grows 10-15% a year; the US side has been flat for five years; the biotech produced one big cheque. The share price now reflects all three, and only the first is a dependable earner.' },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'Four eras: building, debt and compliance trouble, the clean-up, and the AbbVie cheque',
  blocks: [
    { p: 'Glenmark\'s numbers only make sense against its history. Each era changed the mix, the margin and the balance sheet, and each was paid for with one-off money or one-off charges.' },
    { exhibit: { type: 'table', title: 'The four eras of Glenmark', head: ['Era', 'What happened', 'EBITDA margin', 'What it did to the numbers'], wide: [1, 3], rows: [
      ['**To FY17: Building**', 'Founded 1977; listed 2000; new-drug research from 2000 and a Swiss biologics centre from 2004; US generics and a Monroe (NC) injectables plant; the generic Zetia exclusivity lifts FY17.', '16-22%', 'Profit up to ₹1,109 cr (FY17, EPS ₹39.3); debt builds to ~₹4,700 cr.'],
      ['**FY18-23: Debt and compliance**', 'US price erosion; GLS (API) listed in Jul-2021 to raise ₹1,012 cr; all Monroe products recalled (Aug-2021); Goa warning letter (Dec-2022); ₹766 cr Zetia antitrust settlement (FY23).', '16-19%, then 14%', 'Profit ₹776-970 cr a year (FY18-22), then ₹297 cr in FY23; net debt ₹3,189 cr (Mar-23).'],
      ['**FY24-25: Clean-up**', 'GLS 75% sold to Nirma (₹5,651 cr, Mar-2024); India stock points consolidated (Q3FY24 India sales ₹262 cr); IGI restructured, Swiss plant shut; Zetia settlements; Indore warning letter (Jul-2025).', '10% → 18%', 'Loss of ₹1,502 cr in FY24; net cash ₹668 cr (Mar-24), back to net debt ₹489 cr (Mar-25); FY25 profit ₹1,047 cr.'],
      ['**FY26-: "Glenmark 3.0"**', 'ISB 2001 to AbbVie (US$700mn upfront); GST-driven India destocking (Q2FY26 India ₹165 cr); ₹2,266 cr of exceptional charges; Monroe (Nov-2025) and Goa (Sep-2026) cleared; oncology in-licensing.', '27% reported; ~4.5% core', 'FY26 profit ₹1,362 cr only because ₹3,982 cr of licensing income offset the charges; zero gross debt.'],
    ], source: 'Company filings and presentations; AR FY26; Screener.in; GAM Research' } },
    { exhibit: { type: 'table', title: 'Corporate actions and events, and their impact', head: ['When', 'Event', 'Impact on the numbers'], wide: [1, 2], rows: C.history.filter(h => h.year !== '1977').map(h => [h.year, rup(h.event), { '2000s': 'R&D spend of 7-12% of sales for two decades', 'FY15-FY20': 'Peak profit in FY17; antitrust bills arrived in FY23-26', 'Jul-2021': '17% minority in GLS until Mar-2024; Monroe revenue lost', FY23: 'The FY23 dip is in our base history (before exceptional items)', FY24: 'Trough year (loss); API revenue gone from FY24', FY25: 'FY25 is the clean base year: EPS ₹47.0 before exceptional items', 'Jul-2025': 'One-off: excluded from our base EPS history and forecasts', FY26: 'Trough year on core EPS (₹7.2)', 'Apr-Sep 2026': 'Drivers of our FY27-28E US and margin path' }[h.year] || '–']), source: 'Company filings and releases; GAM Research' } },
    { pair: [
      { type: 'column', title: 'Profit: a peak in FY17, a loss in FY24, a deal-made FY26', unit: 'Net profit attributable to owners (₹ crore)', x: 'A.labels', from: 'FY15', series: [{ name: 'Net profit', ref: 'A.pat', fmt: 'num' }], labels: 'all', source: 'Screener.in (patched to owners)' },
      { type: 'column', title: 'Borrowings: cut by the GLS sale, cleared by the upfront', unit: 'Borrowings incl. leases (₹ crore)', x: 'A.labels', from: 'FY15', series: [{ name: 'Borrowings', ref: 'A.borrowings', fmt: 'num' }], labels: 'all', source: 'Screener.in' },
    ] },
  ],
};

const IND = D.industry;
const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Industry: India grows ~10-12% with brands; US generics pay only for complexity; biotech value is binary',
  blocks: [
    { p: rup(`**India.** ${IND.ipm}`) },
    { p: rup(`**United States.** ${IND.usGenerics}`) },
    { p: rup(`**Europe and emerging markets.** ${IND.europe} ${IND.emergingMarkets}`) },
    { p: rup(`**Innovation.** ${IND.innovation}`) },
    { pair: [
      { type: 'column', title: 'Glenmark India has grown ahead of the market for three years', unit: 'Secondary sales growth (%), IQVIA as quoted by Glenmark', x: ['IPM Q2FY26', 'Glenmark Q2FY26', 'IPM Q4FY26', 'Glenmark Q4FY26', 'IPM Q1FY27', 'Glenmark Q1FY27'], series: [{ name: 'Growth', values: [6.4, 10.8, 10.1, 12.3, Q1.ipmPct, Q1.indiaSecondaryPct], fmt: 'pct' }], labels: 'all', highlight: 'Glenmark Q1FY27', source: 'Q2FY26, Q4FY26 and Q1FY27 calls (IQVIA)' },
      { type: 'column', title: 'Ryaltris: over US$100mn now, US$250-300mn hoped for at peak', unit: 'Global Ryaltris sales (US$ mn)', x: ['FY26 (actual, >)', 'Peak, low (FY32-33)', 'Peak, high (FY32-33)'], series: [{ name: 'Sales', values: [100, 250, 300], fmt: 'num' }], labels: 'all', source: 'Q4FY26 call (CMD); Investor Day 2026 (management estimate)' },
    ] },
  ],
};

const tailwind = {
  id: 'tailwinds', nav: 'Tailwind test', kicker: 'Does the tailwind reach Glenmark?', title: 'Tailwind test: Glenmark captures India\'s branded growth and the weak rupee; US complexity only partly; obesity hardly',
  blocks: [
    { p: 'A sector tailwind helps shareholders only if the company captures it. We score each driver.' },
    { verdicts: [
      ['Indian market growth (~10-12%)', 'Yes', `Secondary sales +${Q1.indiaSecondaryPct}% vs IPM +${Q1.ipmPct}% in Q1FY27 and +${Q1.indiaMatPct}% vs +${Q1.ipmMatPct}% over twelve months; chronic respiratory 25%+, cardiac ~15%.`, 'Glenmark grows faster than the market, but its reported sales have twice been knocked off course by its distribution model.'],
      ['Shift to chronic and specialty therapies', 'Yes', 'Nebulised triple therapy (~₹70-80 cr in year one), Telma franchise gaining share, Tevimbra/Brukinsa ₹100 cr+ in 12 months.', 'Better mix; margins improve slowly.'],
      ['GLP-1 / obesity boom', 'Barely', `Semaglutide (Glipiq) at ₹20-25 cr annualised; management: "not a big area of focus", it mainly revives a declining diabetes franchise.`, 'No meaningful upside in our numbers.'],
      ['US complex generics (inhalers, nasal sprays, injectables)', 'Partly', 'First generic Flovent 44 (CGT), OTC fluticasone nasal spray, 2-3 approvals hoped for in H2FY27; Monroe restarted; 20+ partnered injectables, "mostly commodity".', 'Capability is real but late; North America core sales were flat FY22-26.'],
      ['Oncology in-licensing for India and EM', 'Not yet', 'Aumolertinib (H2FY27), Trastuzumab Rezetecan (filings from Q2FY27), envafolimab (FY28); management: US$50-60mn from the three over 5-6 years.', 'Upfronts and launch costs now, revenue later.'],
      ['Weaker rupee', 'Yes', `~75% of core revenue outside India; FY26 forex gain ₹${n0(FY26.forexGainCr)} cr (other income); Q1FY27 at ₹${Q1.fx}/US$ vs ₹${Q1.fxPrior}.`, 'Helps translated revenue; we forecast no forex gains.'],
      ['Biotech licensing (out-licensing to big pharma)', 'Yes, once', 'ISB 2001: US$700mn upfront, up to US$1.225bn milestones, double-digit royalties; ISB 2301 next.', 'A real asset, but its value from here depends on AbbVie and the clinic.'],
    ], head: ['Tailwind', 'Captured?', 'Evidence', 'So what'], title: 'Tailwind scorecard: India yes, US partly, innovation once', source: 'Company calls and presentations; IQVIA via company; GAM Research' },
    { callout: '**Our view:** the tailwinds Glenmark captures best (India branded growth, a weak rupee) are the ones every Indian peer also enjoys. Its distinctive bets (US respiratory, in-licensed oncology, IGI) are early and lumpy. That is why we value it on its own history rather than on the hopes in its Investor Day plan.' },
  ],
};

module.exports = { business, history, industry, tailwind };
