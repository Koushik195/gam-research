// Wockhardt report, part 2: what the company does, history and corporate actions, industry, tailwind test.
const X = require('./WOCKPHARMA.ctx');
const { C, D, SA, n0, n1, shortDate, lines, share, YRS, epsRep, epsExc } = X;
const F26 = SA.find(a => a.fy === 'FY26'), F25 = SA.find(a => a.fy === 'FY25');
const sh = v => `${Math.round(v / F26.total * 100)}%`;

const business = {
  id: 'business', nav: 'What it does', kicker: 'The business', title: 'Three businesses under one roof: UK and Irish generics pay the bills, insulin grows, antibiotics are the bet',
  blocks: [
    { p: `Wockhardt had ₹${n0(F26.total)} cr of revenue in FY26, 78% of it outside India. **UK** (${sh(F26.ukCr)}; GBP ${F26.ukGbpMn}mn): CP Pharmaceuticals in Wrexham makes hospital injectables and runs pharmacy, OTC and export channels (18% of its covered market, top-5 generic company); the site also fills and finishes vaccines under a 15-year collaboration with a global vaccine maker. **Ireland and Europe** (${sh(F26.othersCr)}; EUR ${F26.othersEurMn}mn): Pinewood, the largest generic supplier to Irish hospitals (₹${F26.irelandCr} cr), plus continental Europe. **Emerging markets** (${sh(F26.em)}): mostly human insulin and glargine biosimilars sold to Brazil, Thailand, Egypt, Algeria, Malaysia and LatAm, often by tender. **India** (${sh(F26.indiaBranded + F26.indiaOthers)}): a branded business (₹${F26.indiaBranded} cr: diabetes, orthopaedics, pain, regenerative derma and the Emrok/Miqnaf antibiotics) and "India others" (₹${F26.indiaOthers} cr). The **US** generics business was closed in July 2025.` },
    { p: 'Cutting across the regions are two specialty platforms: biosimilars (₹697 cr in FY26, ~21% of revenue, +27%) and novel antibiotics (Emrok, Emrok O, Miqnaf in India; Zaynich approved in May 2026). Together management calls them 23% of revenue. Wockhardt has 11-12 plants (India, UK, Ireland), two R&D centres and ~3,200 employees; three Indian sites are still barred from the US.' },
    { pair: [
      { type: 'stacked', title: 'Revenue by region: UK the largest, emerging markets the fastest', unit: 'Revenue (₹ crore); FY27-29E GAM build', x: ['FY25', 'FY26', ...YRS], series: [{ name: 'UK', values: [F25.ukCr, F26.ukCr, ...lines.uk.map(Math.round)], fmt: 'num' }, { name: 'Ireland & Europe', grey: true, values: [F25.othersCr, F26.othersCr, ...lines.europe.map(Math.round)], fmt: 'num' }, { name: 'India', values: [F25.indiaBranded + F25.indiaOthers, F26.indiaBranded + F26.indiaOthers, ...YRS.map((_, i) => Math.round(lines.indiaBranded[i] + lines.indiaOthers[i]))], fmt: 'num' }, { name: 'Emerging markets', values: [F25.em, F26.em, ...lines.em.map(Math.round)], fmt: 'num' }, { name: 'US / Zaynich', slot: 1, values: [F25.usaCr, 0, ...lines.zaynich.map(Math.round)], fmt: 'num' }], minLabel: 250, source: 'Company press releases; FY25 UK/Europe/US rupee split derived; GAM estimates' },
      { type: 'hbar', title: 'FY26 revenue mix', unit: '% of FY26 revenue', x: ['UK', 'Emerging markets', 'India branded', 'Ireland & Europe', 'India others'], series: [{ name: 'Share', values: [F26.ukCr, F26.em, F26.indiaBranded, F26.othersCr, F26.indiaOthers].map(v => Math.round(v / F26.total * 1000) / 10), fmt: 'pct' }], labels: 'all', source: 'Q4FY26 press release (4-May-2026)' },
    ] },
    { exhibit: { type: 'table', title: 'The pieces, with what drives each (FY26)', head: ['Business', 'FY26 revenue', 'Growth', 'What drives it', 'Our FY29E share'], wide: [3], rows: [
      ['UK (CP Pharma, Wockhardt UK)', `₹${n0(F26.ukCr)} cr (GBP ${F26.ukGbpMn}mn)`, '+13% in ₹, +3% in GBP', 'Hospital injectables, 15 launches a year, vaccine fill-finish; sterling', `${n1(share('uk', 2))}%`],
      ['Ireland & Europe (Pinewood)', `₹${n0(F26.othersCr)} cr (EUR ${F26.othersEurMn}mn)`, 'Ireland +16%', 'Liquids and creams; Irish hospitals', `${n1(share('europe', 2))}%`],
      ['Emerging markets', `₹${n0(F26.em)} cr`, '+35%', 'Insulin tenders and partnerships (Brazil, Thailand, Algeria, Malaysia)', `${n1(share('em', 2))}%`],
      ['India branded', `₹${n0(F26.indiaBranded)} cr`, '+15%', 'Diabetes, Emrok (+60%), Miqnaf, regenerative derma', `${n1(share('indiaBranded', 2))}%`],
      ['India others', `₹${n0(F26.indiaOthers)} cr`, '−6%', 'Trade generics, institutions, contract work', `${n1(share('indiaOthers', 2))}%`],
      ['Zaynich (from FY27)', '–', '–', 'Launch India Dec-26/Jan-27, US early 2027, EU/EM from FY28', `${n1(share('zaynich', 2))}%`],
    ], source: 'Q4FY26 press release; AR FY26; investor meet (4-Jun-2026); GAM estimates' } },
  ],
};

const history = {
  id: 'history', nav: 'History', kicker: 'History & corporate actions', title: 'History: import alerts, a fire sale to Dr Reddy\'s, four equity raises, and finally an approval',
  blocks: [
    { p: `Wockhardt was a fast-growing exporter until 2013, when the USFDA put its Waluj (May) and Chikalthana (November) plants on import alert for manufacturing failures; Ankleshwar followed in 2016 and the US Morton Grove plant came under a consent decree. All three Indian alerts are still in force. To pay lenders it sold 62 Indian brands and the Baddi plant to Dr Reddy's for ₹1,850 cr in 2020: FY21's reported EPS of ₹${n1(epsRep[2021])} is that gain (₹1,470 cr pre-tax, in discontinued operations); the continuing business lost ₹297 cr after ₹142 cr of exceptional charges. From 2021 to 2024 the company raised ₹2,216 cr of equity, which cut the promoters from 74% to 49%. The antibiotic programme survived all of it.` },
    { exhibit: { type: 'table', title: 'Corporate actions and their effect on the numbers', head: ['When', 'What happened', 'Effect'], wide: [1, 2], rows: C.history.map(h => [/^\d{4}-\d{2}(-\d{2})?$/.test(h.date) ? shortDate(h.date) : h.date, h.event, h.impact]), source: 'Annual reports FY21 and FY26; QIP placement document (Nov-2024); USFDA import alert 66-40; ICRA; company releases' } },
    { exhibit: { type: 'table', title: 'FY21 checked: the Dr Reddy\'s gain, not the business (₹ crore)', head: ['', 'FY21', 'Source'], rows: [
      ['Loss before exceptional items and tax, continuing operations', '(426)', 'AR FY21 consolidated P&L'], ['Exceptional items, continuing operations', '(142)', ''], ['Tax credit, continuing operations', '272', ''],
      ['Loss from continuing operations', '(297)', ''], ['Profit from discontinued operations (incl. ₹1,470 cr gain on sale, after ₹499 cr tax)', '985', 'Note 38'],
      { hl: true, cells: ['**Profit attributable to owners**', '**686**', `EPS ₹${n1(epsRep[2021])}; Screener EPS before exceptional items ₹${n1(epsExc[2021])} still includes the gain`] },
    ], source: 'AR FY21 (BSE)' } },
  ],
};

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Industry: superbugs are a big medical need but a hard market; insulin and UK generics are steadier',
  blocks: [
    { p: D.industry.amr },
    { p: `${D.industry.usMarket} ${D.industry.indiaMarket}` },
    { p: `${D.industry.pullIncentives} ${D.industry.biosimilarInsulin} ${D.industry.ukGenerics}` },
    { exhibit: { type: 'table', title: 'Zaynich\'s competition in carbapenem-resistant Gram-negative infections', head: ['Drug', 'Company', 'Approved', 'Note'], wide: [3], rows: D.competitors.map(c => [c.drug, c.company, c.approved, c.note]), source: 'Investor meet (4-Jun-2026); company labels; GAM Research' } },
    { exhibit: { type: 'hbar', title: 'US Gram-negative hospital infections a year (Zaynich is approved only for cUTI)', unit: 'Thousand cases', x: ['cUTI', 'cIAI', 'Other healthcare-associated', 'HAP/VAP', 'Bloodstream'], series: [{ name: 'Cases', values: [600, 290, 165, 157, 60], fmt: 'num' }], labels: 'all', highlight: 'cUTI', source: 'Company investor presentation (4-Jun-2026), citing an independent agency' } },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Tailwind test: AMR is a real tailwind, but it reaches Wockhardt only through a slow hospital launch',
  blocks: [
    { verdicts: true, title: 'Does each sector tailwind reach Wockhardt?', head: ['Tailwind', 'Verdict', 'Evidence'], verdicts: [
      ['Rising carbapenem resistance', 'Partly', 'Zaynich covers the key resistant pathogens, but US stewardship rules ration new antibiotics; the label is cUTI only until a HAP/VAP trial reads out'],
      ['Pull incentives (UK subscription, QIDP)', 'Partly', 'QIDP gives exclusivity to at least 2036; UK subscription (up to GBP 20mn a year) needs approval and an award: none confirmed by 30-Sep'],
      ['India/EM diabetes and insulin demand', 'Yes', 'Biosimilars +27% in FY26, +112% in Q1FY27; capacity doubling in 12-15 months'],
      ['Pharma sector re-rating (+17% over the year)', 'Yes', 'The stock rose ~45% over the same window (₹1,460 on 3-Oct-2025 to ₹2,116); our multiple carries the same factor'],
      ['US generics recovery', 'No', 'Wockhardt has left US generics; three Indian plants remain on import alert'],
      ['UK NHS generic volume', 'Partly', 'Volumes grow, but UK revenue was flat in sterling in Q1FY27 (GBP 27mn)'],
    ], source: 'GAM Research; sources as cited in the chapters' },
  ],
};

module.exports = { business, history, industry, tailwind };
