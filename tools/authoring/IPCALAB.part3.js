// Ipca Laboratories report, part 3: India branded formulations, exports (branded, generic, institutional), APIs, Unichem &
// subsidiaries, the USFDA record, competitive advantage.
const X = require('./IPCALAB.ctx');
const { C, F, A, n0, n1, SA, SQ, QL, Q1, FY26, UD, BL, YRS, build, TB, uniMcap, stakeMv } = X;
const SEG = C.segmentsFy26, RG = C.regulatory;
const AFY = SA.map(s => s.fy);

const india = {
  id: 'india', nav: 'India branded', kicker: 'Segment: India', title: 'India branded formulations (40% of revenue): pain pays the bills, anti-malarials have faded, cardio and derma are the push',
  blocks: [
    { p: `Domestic formulations doubled from ₹1,913 cr (FY20) to ₹3,817 cr (FY26), 12% a year, and grew 12.6% to ₹1,082 cr in Q1FY27. Ipca's strength is a handful of very large, old brands in pain and rheumatology: the Zerodol family (aceclofenac and combinations), HCQS (hydroxychloroquine, used in rheumatoid arthritis and lupus), Folitrax (methotrexate) and Saaz: pain/analgesics was ₹2,152 cr of IQVIA sales in the year to Jul-2026, 39% of the total, growing 11-12% a year. Its top 10 brands are ₹2,135 cr, 38% of IQVIA sales. Anti-malarials, once a signature franchise, fell from 6% of domestic sales in FY20 to 2% in FY26 and ~1% in Q1FY27. The push is into chronic therapies: cardio-diabetic (17%; CTD, CTD-T), derma, urology, CNS and ophthalmology, each growing 16-25%, after a reorganisation of the cardio division at the start of FY26. Growth in Q1FY27 split into ~5% volume (above the industry), 4.5-5% price and ~2% new products.` },
    { pair: [
      { type: 'column', title: 'Domestic formulations: ₹1,913 cr to ₹3,817 cr in six years', unit: 'Domestic formulations (₹ crore), standalone', x: AFY, series: [{ name: 'Domestic', values: SA.map(s => s.domForm), fmt: 'num' }], labels: 'all', highlight: 'FY26', source: 'AR FY20-FY26 MD&A' },
      { type: 'line', title: 'Therapy mix: pain up, anti-malarials down', unit: '% of domestic branded sales', x: AFY, series: [{ name: 'Pain management', values: SA.map(s => s.painPct), fmt: 'pct0' }, { name: 'Cardio & anti-diabetic', values: SA.map(s => s.cardioPct), fmt: 'pct0' }, { name: 'Anti-malarials', values: SA.map(s => s.antimalarialPct), fmt: 'pct0' }], labels: 'last', min: 0, max: 60, source: 'AR FY20-FY26 MD&A' },
    ] },
    { exhibit: { type: 'table', title: 'Ipca\'s top therapies on IQVIA (₹ crore, moving annual total to July)', head: ['Therapy', 'Jul-23', 'Jul-24', 'Jul-25', 'Jul-26', 'CAGR 23-26', 'Growth to Jul-26'], rows: [
      ['Pain / analgesics', '1,550', '1,764', '1,931', '2,152', '11.6%', '11.5%'],
      ['Cardiac', '494', '578', '641', '719', '13.3%', '12.3%'],
      ['Antineoplast / immunomodulator', '207', '242', '288', '370', '21.5%', '28.4%'],
      ['Anti-infectives', '313', '342', '356', '366', '5.3%', '2.9%'],
      ['Derma', '209', '252', '277', '323', '15.7%', '16.6%'],
      ['Urology', '149', '197', '239', '285', '24.0%', '18.9%'],
      ['Gastro-intestinal', '203', '224', '252', '269', '9.9%', '7.0%'],
      ['Neuro / CNS', '162', '183', '216', '258', '16.9%', '19.5%'],
      ['Anti-diabetic', '129', '159', '179', '199', '15.5%', '11.3%'],
      { hl: true, cells: ['**Total IQVIA sales**', '**3,935**', '**4,513**', '**4,984**', '**5,576**', '**12.3%**', '**11.9%**'] },
    ], source: 'ICICI Direct result update (17-Aug-2026), IQVIA MAT Jul-2026' } },
    { bullets: [
      '**Field force:** ~7,000 medical representatives; expansion "completed", with ~200 more for new divisions in FY27 (Q1FY27 call). Ipca launches few products (18-20 a year across 20-odd divisions) to keep focus on power brands.',
      '**Pricing:** normally 5-6% a year on non-controlled products; 6-7% planned in FY27 to offset input costs; price-controlled (NLEM) products cannot move.',
      '**Guidance:** 12-13% growth for FY27 (1-2pp from new products); management says chronic growth is now in line with the market and acute ahead of it.',
      '**Gaps:** no first-wave GLP-1 launch; small in respiratory and gastro; anti-infectives barely growing (+1% in Q1FY27).',
    ] },
    { callout: `**So what:** the India business is a steady compounder, not a growth story: market-plus growth (we model ${BL.growth.domForm.join(' / ')}%) at margins we estimate in the high 20s to 30s, earned by brands built over decades. Its risk is concentration: pain is over half of it, and some of its biggest molecules are price-controlled.` },
  ],
};

const exportsSec = {
  id: 'exports', nav: 'Exports', kicker: 'Segment: exports', title: 'Exports (22% of revenue): branded emerging markets and UK/EU generics are growing fast; institutional anti-malarials are shrinking',
  blocks: [
    { p: `Export formulations were ₹2,083 cr in FY26 (+9%) and ₹603 cr in Q1FY27 (+34%). They are three different businesses. **Branded (₹664 cr, +14%):** Ipca's own brands sold by its own field forces in French-speaking West Africa (the fastest, +41% in 9MFY26), CIS (₹228 cr of formulations; flat in Q3FY26 with the war), Asia and LatAm. **Generics (₹1,149 cr ex-tenders, +17%):** the UK (own label, after a loss-making FY26 for the UK subsidiary as prices collapsed), the EU (Germany subsidiary set up in FY26), Australia/NZ (₹314 cr), Canada and the US, where Ipca's approved products are sold through Unichem USA (8 marketed, 6-8 more commercialised in FY27, 46 ANDAs filed and 32 approved). In Q1FY27 Europe/UK went from ₹33 cr to ₹137 cr. **Institutional (₹270 cr, −24%):** anti-malarial tenders for donor-funded programmes, which management now expects at ₹260-300 cr a year.` },
    { pair: [
      { type: 'column', title: 'Export formulations: ₹2,083 cr in FY26; institutional is a shrinking slice', unit: 'Export formulations (₹ crore), standalone', x: AFY, series: [{ name: 'Branded + generic', values: SA.map(s => Math.round(s.expForm - (s.expInstitutional || 0))), fmt: 'num' }, { name: 'Institutional', values: SA.map(s => s.expInstitutional ?? null), fmt: 'num' }], stacked: true, labels: 'none', source: 'AR FY20-FY26 (institutional from FY23; earlier years shown in total)' },
      { type: 'hbar', title: 'Where FY26 exports went (formulations + APIs)', unit: 'FY26 exports (₹ crore), standalone', x: Object.keys(SEG.exportsByRegion), series: [{ name: 'Exports', values: Object.values(SEG.exportsByRegion).map(Math.round), fmt: 'num' }], labels: 'all', source: 'AR FY26 MD&A (continent-wise exports)' },
    ] },
    { exhibit: { type: 'table', title: 'The three export businesses (₹ crore)', head: ['', 'FY25', 'FY26', 'Q1FY26', 'Q1FY27', 'Our FY27E', 'Driver'], wide: [6], rows: [
      ['Branded (promotional ROW markets)', '582', '664', '124', '143', n0(build.expBranded[0]), 'Field-force expansion in Africa, LatAm, Asia; CIS steady'],
      ['Generics ex-tenders', '982', '1,149', '268', '340', n0(build.expGeneric[0]), 'UK/EU launches, Australia/NZ, US (Ipca products via Unichem)'],
      ['Institutional (tenders)', '355', '270', '58', '112', n0(build.expInstitutional[0]), 'Donor funding; ₹40 cr of March shipments slipped into Q1'],
      { hl: true, cells: ['**Export formulations**', '**1,919**', '**2,083**', '**450**', '**603**', `**${n0(X.expFormTot[0])}**`, ''] },
    ], source: 'AR FY26 note 23; Q4FY26 and Q1FY27 calls; GAM' } },
    { callout: `**So what:** the regulated-market generics business is the part of Ipca that changed most in two years: back in the US, growing fast in Europe, with a stated pipeline of 4-5 Ipca filings and 7-8 group launches a year. It is also where prices are least secure (the UK lost money in FY26) and where a USFDA setback would hurt. We model generics +${BL.growth.expGeneric.join('% / +')}% and institutional +${BL.growth.expInstitutional.join('% / +')}%.` },
  ],
};

const apis = {
  id: 'apis', nav: 'APIs', kicker: 'Segment: APIs', title: 'APIs (15% of revenue): the backward integration behind Ipca\'s 71% gross margin, and a cyclical business in its own right',
  blocks: [
    { p: `Ipca makes ~80 APIs and intermediates, most of the molecules in its own brands (hydroxychloroquine, aceclofenac, anti-malarials, cardiovascular and anti-infective APIs), and sells the surplus to drug makers in 100+ countries (75% exported; Europe ₹362 cr, Americas ₹321 cr, Asia ₹264 cr in FY26). The integration does two things. It keeps material cost low: ~25% of standalone sales in FY26 (24% in Q3FY26, 28.7% in 9MFY25), so consolidated gross margin is ~71%. And it gives Ipca security of supply: the Krebs merger is explicitly about a fermentation API used in its largest-selling brand. External API sales are cyclical: ₹1,506 cr in FY21, ₹1,249 cr in FY24, ₹1,396 cr in FY26, then +30% to ₹424 cr in Q1FY27 as volumes and prices recovered. Ratlam is running out of capacity; a ₹182 cr intermediates plant at Wardha started in Feb-2026 and more API capacity is being built at Dewas, with continuous-process conversions.` },
    { pair: [
      { type: 'column', title: 'External API sales: a cycle, now rising again', unit: 'APIs & intermediates (₹ crore), standalone', x: AFY, series: [{ name: 'Export', values: SA.map(s => s.apiExport), fmt: 'num' }, { name: 'Domestic', values: SA.map(s => s.apiDomestic), fmt: 'num' }], stacked: true, labels: 'none', source: 'AR FY20-FY26 MD&A' },
      { type: 'column', title: 'Quarterly API sales: ₹424 cr in Q1FY27, +30%', unit: 'APIs (₹ crore), quarterly', x: QL, series: [{ name: 'APIs', values: SQ.map(q => q.api), fmt: 'num' }], labels: 'all', highlight: 'Q1FY27', source: 'PL result update (16-Aug-2026)' },
    ] },
    { bullets: [
      '**Regulatory depth:** 62 EDQM certificates of suitability and 50 US DMFs; Ratlam (Ipca\'s largest API site) has been VAI since its Jun-2023 USFDA inspection; Tarapur VAI in Feb-2026; WHO prequalification inspection of Ratlam API in Oct-2025.',
      '**Unichem:** Unichem\'s own API business grew from ₹33-34 cr to ₹58 cr in Q1FY27 as it makes more of its own inputs; Ipca\'s APIs replacing bought-in ones in Unichem\'s US products need USFDA approvals (CBE-30 or prior approval), one product approved so far (Q1FY27 call).',
      '**Pricing:** management says API cost increases are passed on fully (Q4FY26 call); prices were not renegotiated down after the rupee fell (Q1FY27 call).',
    ] },
    { callout: `**So what:** APIs are both a cost moat for the formulations business and a cyclical earnings line. FY27 starts strong; we model +${BL.growth.api.join('% / +')}%, below Q1's pace because Ratlam is near capacity until Dewas and Wardha ramp up.` },
  ],
};

const unichem = {
  id: 'unichem', nav: 'Unichem & subsidiaries', kicker: 'Segment: subsidiaries', title: `Unichem and the subsidiaries (24% of revenue): margins from 4% to 11% in a year; the US front end is now selling Ipca's products`,
  blocks: [
    { p: `Unichem (52.67% owned, listed) had revenue of ₹2,202 cr in FY26 (+4%) and ₹633 cr in Q1FY27 (+20%). Most of it is US generics made at its Goa plant and sold by Unichem Pharmaceuticals (USA), which since FY26 also sells Ipca's US products (Bayshore, Ipca's former US arm, was folded in and sold). FY26 was poor: Unichem lost high-volume US products, its own portfolio grew ~2%, its margin fell to ~8% (12.6% in FY25), it closed its Irish plant (severance; overheads of €4-5 mn a year end in FY27), and it paid the EU perindopril fine and interest. Q1FY27 turned: US +27% (Unichem's own products +9%, Ipca's much faster), Brazil +52%, ROW ₹8 cr → ₹17 cr, APIs ₹33-34 cr → ₹58 cr, margin 11%. Management guides +10% revenue and a 13% margin for FY27, rising as filings in Europe, Australia, Canada and Chile convert (~1.5 years after filing). The other subsidiaries: Trophic Wellness (58.88%; nutraceuticals, ~₹125 cr of sales and ~₹40 cr of profit), Pisgah Laboratories (US APIs; a US$22 mn liquid-injectables plant due for trial production in FY27), Onyx Scientific (UK research services; weak demand) and Ipca's UK and German generics arms (the UK lost £2-3 mn in FY26).` },
    { pair: [
      { type: 'column', title: 'Unichem revenue: ₹633 cr in Q1FY27', unit: 'Unichem consolidated revenue (₹ crore), quarterly', x: QL, series: [{ name: 'Revenue', values: SQ.map(q => q.unichemRev), fmt: 'num' }], labels: 'all', highlight: 'Q1FY27', source: 'Screener.in (UNICHEMLAB, consolidated)' },
      { type: 'line', title: 'Unichem EBITDA margin: 4% to 11% in a year', unit: 'Operating margin (%), Unichem consolidated', x: QL, series: [{ name: 'Margin', values: SQ.map(q => q.unichemOpm), fmt: 'pct0' }], labels: 'all', min: 0, max: 18, source: 'Screener.in (UNICHEMLAB)' },
    ] },
    { exhibit: { type: 'table', title: 'Unichem: what we assume (₹ crore)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E', 'Basis'], wide: [5], rows: [
      ['Revenue growth', '+4%', '+10%', '+10%', '+10%', 'Guidance +10% for FY27; Q1 +20%'],
      ['EBITDA margin', '8.6%', '12.5%', '14%', '15%', 'Guided 13% for FY27; mid-teens medium term (management, Emkay)'],
      ['Profit as consolidated by Ipca', 'n.d.', ...TB.unichemPat.map(n0), 'After Ipca\'s 2023 fair-value adjustments (below Unichem\'s own reported profit)'],
      ['Minorities (Unichem 47.33% + Trophic 41.12%)', '43', ...TB.minorities.map(n0), 'Q1FY27 ~₹21 cr'],
      ['Ipca\'s share of Unichem profit', '', ...TB.unichemPat.map(v => n0(v * UD.stakePct / 100)), `${UD.stakePct}%`],
    ], source: 'Screener.in (UNICHEMLAB); Q4FY26 and Q1FY27 calls; AR FY26; GAM' } },
    { callout: `**So what:** Unichem is turning from a drag into a modest contributor; its real value to Ipca is the US front end and the Goa plant. Two things keep it from being worth more to Ipca shareholders: 47% of every rupee it earns goes to minorities, and its Goa plant had 5 USFDA observations on 26-Sep-2026 (classification pending). At ₹${UD.close30Sep} the market values Unichem at ₹${n0(uniMcap)} cr (Ipca's stake ₹${n0(stakeMv)} cr), ~${n1(X.uniPe)}x trailing earnings.` },
  ],
};

const regulatory = {
  id: 'regulatory', nav: 'The USFDA record', kicker: 'Regulatory', title: 'The USFDA record: nine years under import alert (2015-2023), all plants clean on 30-Sep-2026, two Unichem inspections open',
  blocks: [
    { p: `Ipca's US story is a regulatory one. In 2014 USFDA inspectors found data-integrity failures at the Ratlam API plant; Ipca stopped shipping, and import alerts followed on Ratlam (Jan-2015) and on its two main formulation plants, Pithampur (SEZ Indore) and Piparia (Silvassa) (Mar-2015), then a warning letter (Feb-2016). For eight years Ipca sold almost nothing in the US. In FY24 all three plants were re-inspected, classified Voluntary Action Indicated (VAI: objectionable conditions found, but no regulatory action) and taken off import alert. Since then: Tarapur API (VAI, Feb-2026), and WHO prequalification inspections of Pithampur and Ratlam in 2025. ${RG.status30Sep}` },
    { exhibit: { type: 'table', title: 'USFDA and other inspections: timeline', head: ['When', 'What happened'], wide: [1], rows: RG.timeline.map(t => [t.date, t.event]), source: X.rup(RG.src) } },
    { exhibit: { type: 'table', title: 'Plant status on 30-Sep-2026', head: ['Plant', 'Owner', 'What it makes', 'Last USFDA outcome', 'Status'], wide: [2, 3], rows: [
      ['Ratlam (MP)', 'Ipca', 'APIs (largest site); also formulations', 'Inspected Jun-2023, VAI; import alert lifted FY24', '**Clean**'],
      ['Pithampur SEZ Indore (MP)', 'Ipca', 'Formulations for regulated markets; new extended-release and mAb capacity', 'Form 483 Jun-2023; EIR VAI (Oct-2023); import alert lifted FY24', '**Clean**'],
      ['Piparia, Silvassa', 'Ipca', 'Formulations', 'Re-inspected in FY24; VAI; import alert lifted FY24', '**Clean**'],
      ['Tarapur (Maharashtra)', 'Ipca', 'APIs', '3 observations (Dec-2025), VAI (Feb-2026)', '**Clean**'],
      ['Goa (Pilerne)', 'Unichem', 'US formulations (main US plant)', 'VAI after Jul-2024; 5 observations on 26-Sep-2026', '**Open**: response due in 15 days'],
      ['Kolhapur', 'Unichem', 'APIs', '5 procedural observations (Feb-2026)', '**Open**: no EIR reported'],
      ['Roha, Pithampur', 'Unichem', 'APIs', 'VAI (2025)', '**Clean**'],
    ], source: 'AR FY24 MD&A; Medical Dialogues (Oct-2023, Dec-2025, Feb-2026, 27-Sep-2026); Bajaj Broking (Feb-2026); company filings' } },
    { callout: '**Why it matters:** Ipca\'s regulated-market growth (US, Europe, the extended-release capacity at Pithampur, the biosimilars) rests on these plants staying clean. The history shows the cost of failure: the 2015 alerts closed the US for eight years. The open item on 30-Sep-2026 is Unichem\'s Goa plant (five observations described as procedural); a VAI outcome would be the base case for "procedural" findings, an OAI (official action) would hit Unichem\'s US sales and Ipca\'s products sold through it. We flag regulatory risk as AMBER, not RED.' },
  ],
};

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: a narrow moat built on old brands and API integration; no pricing power, no proprietary pipeline yet',
  blocks: [
    { exhibit: { type: 'table', title: 'Moat scorecard', head: ['Source of advantage', 'Score', 'Evidence'], wide: [2], rows: [
      ['Brands in pain and rheumatology', '**Strong**', 'Pain ₹2,152 cr on IQVIA (Jul-2026), 53% of domestic sales; top 10 brands ₹2,135 cr; six brands in India\'s top 300'],
      ['Cost position (API integration)', '**Strong**', 'Makes most of its own APIs; material cost ~25% of standalone sales; gross margin ~71%'],
      ['Geographic and channel diversification', '**Medium-strong**', 'India, branded EM, regulated generics, institutional and APIs; no market above 40% of revenue'],
      ['Regulatory standing', '**Medium**', 'All Ipca plants VAI since FY24, but a 2014-2023 history of import alerts; two Unichem inspections open'],
      ['Chronic depth in India', '**Medium-weak**', 'Cardio-diabetic 17% of domestic; rank 16 overall with 2.08% share'],
      ['Innovation and pipeline', '**Weak (building)**', 'R&D 3.4% of sales; 7 biosimilar candidates, revenue only from FY29-30; mAb plant under construction'],
      ['Pricing power', '**Weak**', 'Price growth 4.5-5% in Q1FY27, in line with the market; price-controlled molecules; generics abroad are price takers'],
      ['Scale in US generics', '**Weak**', 'Unichem\'s US base lost high-volume products in FY26; 8 Ipca products marketed'],
    ], source: 'GAM assessment from AR FY26, company calls and ICICI Direct (IQVIA)' } },
    { p: 'Ipca\'s moat is the combination of doctor loyalty to a few large pain and rheumatology brands and the cost advantage of making their APIs in-house. It protects margins in India and gives it staying power in API-driven export markets. It does not give pricing power (many molecules are price-controlled; generics abroad are commodities) or a growth engine of its own; that is what the biosimilar and regulated-generics investments are meant to build.' },
    { callout: '**Verdict:** narrow moat. Ipca deserves a multiple near the Indian branded-pharma pack for its domestic franchise and balance sheet, but not a premium: its ROE (15% in FY26, ~17% in our forecasts) is respectable, not exceptional, and half its business is cyclical.' },
  ],
};

module.exports = { india, exportsSec, apis, unichem, regulatory, moat };
