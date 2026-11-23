// Aurobindo Pharma report, part 2: what the company does, history (eras and corporate actions), industry, tailwind test.
const X = require('./AUROPHARMA.ctx');
const { C, D, A, F, n0, n1, FY26, Q1, rup, SA, b, ix } = X;
const IND = D.industry;
const pct26 = k => Math.round(FY26[k] / FY26.revenue * 1000) / 10;

const business = {
  id: 'business', nav: 'What Aurobindo does', kicker: 'Company', title: 'What Aurobindo does: a high-volume generics maker for the US and Europe, built on its own APIs',
  blocks: [
    { p: rup(`Aurobindo makes generic (off-patent) medicines and the active ingredients (APIs) that go into them, in 30+ plants, mostly around Hyderabad. It has five businesses. **US formulations** (₹${n0(FY26.us)} cr in FY26, ${pct26('us')}% of revenue; $${FY26.usUsdMn}mn) sells tablets, capsules, injectables and specialty products to US wholesalers and pharmacy chains; it has 737 approved generic applications (ANDAs), more than any other Indian company, and launches ~10 products a quarter. The injectables and specialty part sits in Eugia (~$513mn in FY26, ~70% in the US). **Europe** (₹${n0(FY26.europe)} cr, ${pct26('europe')}%; EUR${FY26.europeEurMn}mn) sells generics in the UK, Germany, France, Spain, Portugal, Italy, the Netherlands and other countries, through businesses bought from Actavis, Apotex and Generis. **Growth Markets** (₹${n0(FY26.gm)} cr, ${pct26('gm')}%) covers Canada, Brazil, South Africa, Indonesia, China and, since 2022, India. **ARV** (₹${n0(FY26.arv)} cr, ${pct26('arv')}%) sells HIV medicines to donor-funded programmes. **APIs** (₹${n0(FY26.api)} cr, ${pct26('api')}%) sells ingredients to other drug makers, led by penicillins and cephalosporins (beta-lactams), where it is one of the world's largest producers.`) },
    { pair: [
      { type: 'hbar', title: 'FY26 revenue: US 43%, Europe 31%', unit: 'Share of FY26 revenue (%)', x: ['US formulations', 'Europe formulations', 'APIs', 'Growth Markets', 'ARV'], series: [{ name: 'Share', values: [pct26('us'), pct26('europe'), pct26('api'), pct26('gm'), pct26('arv')], fmt: 'pct' }], labels: 'all', source: 'Q4FY26 presentation' },
      { type: 'column', title: 'Europe\'s share of revenue: 26% (FY23) to 31% (FY26); the US\'s fell from 47% to 43%', unit: 'Share of revenue (%)', x: SA.map(a => a.fy), series: [{ name: 'US', values: SA.map(a => Math.round(a.us / a.consRev * 1000) / 10), fmt: 'pct' }, { name: 'Europe', values: SA.map(a => Math.round(a.europe / a.consRev * 1000) / 10), fmt: 'pct' }], labels: 'all', min: 0, max: 55, source: 'Company Q4 presentations' },
    ] },
    { exhibit: { type: 'table', title: 'The five businesses at a glance', head: ['Business', 'FY26 revenue', 'Q1FY27', 'Position', 'What drives it'], wide: [3, 4], rows: [
      ['**US formulations**', `₹${n0(FY26.us)} cr ($${FY26.usUsdMn}mn, −7% in $)`, `₹${n0(Q1.us)} cr ($${Q1.usUsdMn}mn, +${Q1.usGrowthPct}% in ₹)`, '737 ANDA approvals, 896 filed; Eugia injectables ~$500mn; Lannett from Jun-2026', 'Launches vs price erosion on old products; plant compliance; occasional limited-competition products (gRevlimid FY24-26)'],
      ['**Europe formulations**', `₹${n0(FY26.europe)} cr (EUR${FY26.europeEurMn}mn, +9% in EUR)`, `₹${n0(Q1.europe)} cr (EUR${Q1.europeEurMn}mn, +${Q1.europeCcGrowthPct}% cc)`, 'Top ten in eight countries; EBITDA margin above 20%', 'Tenders and pharmacy markets; supply from own Indian and Chinese plants; biosimilar launches'],
      ['**Growth Markets**', `₹${n0(FY26.gm)} cr ($${FY26.gmUsdMn}mn)`, `₹${n0(Q1.gm)} cr ($${Q1.gmUsdMn}mn, +38% in ₹)`, 'Canada, Brazil, South Africa, Indonesia, China; small India branded business (₹104 cr in Q1)', 'New markets and small acquisitions (Khandelwal brands, Jan-2026)'],
      ['**ARV**', `₹${n0(FY26.arv)} cr ($${FY26.arvUsdMn}mn, +33% in ₹)`, `₹${n0(Q1.arv)} cr ($${Q1.arvUsdMn}mn)`, 'Large supplier of HIV generics to donor programmes', 'Tender wins; donor funding'],
      ['**APIs**', `₹${n0(FY26.api)} cr (−6%)`, `₹${n0(Q1.api)} cr (+${Q1.apiGrowthPct}%)`, '13 API units; Pen-G and 6-APA plants (Kakinada)', 'Beta-lactam prices (Chinese competition); India\'s import curbs; external Pen-G sales'],
    ], source: 'Company presentations Q4FY26 and Q1FY27; AR FY26. Growth rates as reported (₹ unless stated).' } },
    { callout: '**So what:** Aurobindo is a scale-and-cost business, not a franchise business. It wins by making a very wide range of medicines cheaply from its own ingredients and supplying them reliably. That protects volumes but not prices: in the US, the products it sells today lose value every year and must be replaced by new launches. Earnings therefore track three things: launch flow, plant compliance and costs.' },
  ],
};

const HS = C.history;
const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'Four eras: penicillin APIs, the US generics push, the margin slump, the platform build',
  blocks: [
    { p: 'Aurobindo\'s numbers make sense only against its history: each era changed the mix, the margin and the balance sheet.' },
    { exhibit: { type: 'table', title: 'The four eras of Aurobindo', head: ['Era', 'What happened', 'EBITDA margin', 'What it did to the numbers'], wide: [1, 3], rows: [
      ['**1986-2006: APIs**', 'Founded by P.V. Ramprasad Reddy and K. Nithyananda Reddy; semi-synthetic penicillin APIs; IPO 1992; became a large beta-lactam API maker.', 'n.a.', 'An API exporter with thin margins and heavy working capital.'],
      ['**2007-2020: US and Europe generics**', 'US plants (AuroLife, 2007), hundreds of ANDA filings; Europe built by buying Actavis (2014), Generis (2017) and Apotex\'s businesses (2019); Spectrum\'s oncology injectables (2019).', '~20-23%', `Revenue from ₹12,103 cr (FY15) to ₹${n0(A.sales[ix('FY20')])} cr (FY20); ROE above 18%.`],
      ['**FY21-FY23: The slump**', 'Natrol sold (FY21 gain ₹2,815 cr); US price erosion; Eugia compliance problems; input-cost spike; heavy capex starts (Pen-G, China, biosimilars).', '21% → 15%', 'EPS before exceptional items fell from ₹58 (FY21) to ₹33 (FY23); ROE 7.5% in FY23.'],
      ['**FY24-FY27: The platform build**', 'gRevlimid sales; margins back to 20-21%; Pen-G plant and China plant running; MSD biologics contract; buybacks (2024, 2026); Zentiva bid lost (2025); Lannett bought (2026); Eugia warning letters.', '20-21%', `EPS ₹54 (FY24) to ₹60 (FY26); capex ~₹3,000 cr a year; net cash ~zero after Lannett.`],
    ], source: 'Company filings and presentations; AR FY26 milestones; Screener.in; GAM Research' } },
    { exhibit: { type: 'table', title: 'Corporate actions and their impact', head: ['When', 'Event', 'Impact on the numbers'], wide: [1, 2], rows: HS.map(h => [h.year, rup(h.event), rup({ '1986-1992': '-', 2007: 'US revenue base built over the next decade', 2014: 'Europe becomes a second leg (EUR1bn by FY26)', '2017-2019': 'Europe and US injectables scale up; amortisation rises', FY21: 'One-off gain inflates FY21 EPS to ₹91', 'FY22-FY23': 'EBITDA margin 18.7% (FY22), 14.9% (FY23)', 'FY24-FY25': 'Margin 20.1% / 20.8%; ₹750 cr buyback cuts shares 0.9%', 2025: 'Avoided a ~$5bn debt-funded deal; Lannett adds ~$240-300mn of US sales', FY26: 'Revenue +6% (+9.5% ex-gRevlimid); Pen-G turns EBITDA positive in Q4', 'Apr-Sep 2026': 'Shares 580.8mn → 575.4mn; US$247mn paid for Lannett; net cash ₹397 cr at Jun-26' }[h.year] || '-')]), source: rup(C.historySrc) } },
    { pair: [
      { type: 'column', title: 'Borrowings: rising again since FY23 as capex and working capital grew', unit: 'Borrowings incl. leases (₹ crore)', x: 'A.labels', from: 'FY15', series: [{ name: 'Borrowings', ref: 'A.borrowings', fmt: 'num' }], labels: 'all', source: 'Screener.in' },
      { type: 'column', title: 'EPS before exceptional items: ₹58 (FY21), ₹33 (FY23), ₹61 (FY26)', unit: 'EPS before exceptional items (₹)', x: ['FY19', 'FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'], series: [{ name: 'EPS', values: [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026].map(y => Math.round(X.epsExc[y] * 10) / 10), fmt: 'n1' }], labels: 'all', source: 'Screener.in (EPS less exceptional items after tax per share)' },
    ] },
  ],
};

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Industry: US generics pay for volume and cost; Europe for reliability; tariffs are the new wild card',
  blocks: [
    { p: rup(`**United States.** ${IND.usGenerics}`) },
    { p: rup(`**Tariffs.** ${IND.tariffs}`) },
    { p: rup(`**Europe.** ${IND.europe}`) },
    { p: rup(`**Growth Markets, ARV and APIs.** ${IND.growthMarkets} ${IND.arv} ${IND.api}`) },
    { p: rup(`**Biosimilars.** ${IND.biosimilars}`) },
    { pair: [
      { type: 'hbar', title: 'Aurobindo\'s 896 US filings by therapy: brain and heart medicines lead', unit: 'ANDAs filed at 30-Jun-2026 (number); 237 of them are injectables', x: ['CNS', 'Cardiovascular', 'Oncology & hormones', 'Gastro', 'Antibiotics (SSP & cephs)', 'ARV', 'Anti-diabetic', 'Respiratory', 'Dermatology', 'Ophthalmic', 'Controlled substances', 'Others'], series: [{ name: 'ANDAs', values: [166, 125, 65, 50, 35, 30, 27, 22, 20, 19, 16, 321], fmt: 'num' }], labels: 'all', source: 'Q1FY27 presentation (filings snapshot); Others incl. penem injectables' },
      { type: 'column', title: 'US filing pipeline: 737 approved, 159 waiting', unit: 'US ANDA filings (number)', x: ['Final approval', 'Tentative approval', 'Under review'], series: [{ name: 'ANDAs', values: [737, 33, 126], fmt: 'num' }], labels: 'all', source: 'Q1FY27 presentation (30-Jun-2026)' },
    ] },
  ],
};

const tailwind = {
  id: 'tailwinds', nav: 'Tailwind test', kicker: 'Does the tailwind reach Aurobindo?', title: 'Tailwind test: the rupee and supply-chain shifts help; US pricing does not',
  blocks: [
    { p: 'A sector tailwind helps shareholders only if the company captures it. We score each driver.' },
    { verdicts: [
      ['Weaker rupee', 'Yes', 'Rupee ₹94.5/$ in Q1FY27 vs ₹85.5 a year earlier; roughly 90% of revenue is earned abroad. CFO: ~₹100 cr of EBITDA a year from the dollar-rupee move, partly offset by costlier solvents, raw materials and freight.', 'The biggest single driver of FY27 rupee growth; it is not a business improvement.'],
      ['"China plus one" and supply security', 'Yes', 'Own Pen-G and 6-APA; minimum import price on penicillin inputs; Europe\'s buyers favour reliable suppliers; EMA asks Aurobindo to stock antibiotics.', 'Supports volumes and gross margin (60%+).'],
      ['US reshoring push / generics tariffs', 'Partly', 'Lannett (Indiana) at ~40% utilisation, AuroLife, Dayton, Raleigh; management: 350mn+ units at Lannett "at ease".', 'A hedge few Indian rivals have, but US-made generics cost more; the tariff is a proposal, not law.'],
      ['US generic drug shortages', 'Partly', 'Injectables are the shortage category, but Eugia Units I and III cannot get new approvals.', 'Aurobindo cannot fully exploit it until Eugia is fixed.'],
      ['Biosimilars wave (US$50bn+ of biologics losing patents)', 'Not yet', 'Four EU/UK approvals, Mexico tenders; US filings due in 2026; 10+ rivals per molecule.', 'Revenue small before FY29; a cost today.'],
      ['Biologics outsourcing (CDMO/CMO boom)', 'Later', 'MSD contract plant (Unit 1 qualification Nov-2026; revenue from 2028); Unit 2 from 2031; US$150-200mn of revenue targeted from 2032.', 'Real but distant; capex first.'],
      ['Indian pharma market growth', 'Barely', 'India branded sales only ₹104 cr in Q1FY27 (inside Growth Markets).', 'Unlike Cipla or Sun, Aurobindo has almost no Indian franchise.'],
    ], head: ['Tailwind', 'Captured?', 'Evidence', 'So what'], title: 'Tailwind scorecard: currency and supply security yes, pricing no', source: 'Company calls and presentations; DGFT; GAM Research' },
    { callout: '**Our view:** the tailwinds that reach Aurobindo are mostly on the cost side (own APIs, China plant, supply security) and the currency. The ones investors pay up for in Indian pharma (domestic branded growth, specialty products, US price discipline) mostly do not. That is why Aurobindo has traded at a discount to the sector for a decade, and why we do not add a premium.' },
  ],
};

module.exports = { business, history, industry, tailwind };
