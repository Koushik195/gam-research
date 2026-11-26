// Poly Medicure report, part 2: what the company does, history & corporate actions, industry, tailwind test.
const X = require('./POLYMED.ctx');
const { C, D, n0, n1, SA, P, price } = X;
const PXS = [...X.M.price.series.filter(([d]) => d >= '2019-04-01' && d < X.ASOF), [X.ASOF, X.price]];
const sa = fy => SA.find(a => a.fy === fy);

const business = {
  id: 'business', nav: 'What the company does', kicker: 'The business', title: 'What Polymed does: makes ~1.9 bn low-cost disposable devices a year in India and sells two-thirds of them abroad; now adding dialysis, cardiology and orthopaedics',
  blocks: [
    { p: '**Products.** Polymed makes single-use medical devices: **infusion therapy** (IV cannulae, where it is the world\'s third-largest maker with ~11% share and ~600 mn pieces a year, infusion sets, needle-free connectors, stopcocks, extension lines, prefilled saline syringes), **vascular access and critical care** (PICC lines, central venous catheters, implantable ports and midlines, much of it from Plan1Health in Italy), **renal care** (haemodialysers, blood lines, fistula needles, peritoneal dialysis sets and its own dialysis machine, ~1,100 installed), **transfusion** (blood bags, leukodepletion filters), and newer lines: **cardiology** (drug-eluting stents, balloons, drug-coated balloons, lithotripsy, plus PendraCare\'s guiding and diagnostic catheters) and **orthopaedics** (Citieffe\'s trauma implants and fixators). Most items sell for ₹10-20; the new lines sell for thousands of rupees.' },
    { p: '**Customers.** About two-thirds of revenue is exported to 125+ countries, mainly through 1,000+ distributors and to other device makers (OEMs) that sell under their own brands; in India it sells to corporate and standalone hospitals and government tenders through distributors and 590+ own sales staff. **Factories:** 15 plants in five countries, heavily automated (400+ moulding machines, 530+ automatic assembly machines, 130+ robots) with in-house mould making and sterilisation. That cost base is the business: Polymed wins by making a quality-approved product (EU MDR, CE, some FDA) more cheaply than multinationals.' },
    { exhibit: { type: 'table', title: 'The business in numbers (FY26 unless stated)', head: ['Item', 'Value', 'What it tells you'], wide: [2], rows: [
      ['Revenue / of which exports', '₹1,875 cr / ₹1,280 cr (68%)', 'Europe 32%, rest of world 37%, India 31%'],
      ['Infusion therapy share', '53% (68% in FY20)', '~50% in Q4FY26 and Q1FY27 as new lines and acquisitions grow'],
      ['Renal care', '₹188 cr (+24.5%)', 'Only Indian maker of dialysers; Chinese imports undercut it'],
      ['Acquired businesses (PendraCare, Citieffe)', '₹117 cr in FY26; ₹72 cr in Q1FY27', '~₹290 cr a year, at low margins so far'],
      ['Gross margin / EBITDA margin', '68.2% / 24.4% (company)', 'Standalone 26.8%; subsidiaries much lower'],
      ['Patents / products / new launches', '399 / 225+ / 35 in FY26', 'R&D only 1.6% of revenue (₹30 cr), to double'],
      ['Capacity used', '65-70% of post-2021 capacity', 'Room to grow without new plants, yet two more are coming'],
      ['Employees', '3,300+', 'Plus contract labour in Haryana and Rajasthan'],
    ], source: 'Q4FY26 PPT pp.11-13, 19-31; Q1FY27 PPT; Q4FY26 call' } },
    { pair: [
      { type: 'stacked', title: 'Revenue by therapy: infusion fell from 68% to 53%', unit: 'Revenue (₹ crore)', x: ['FY20', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'], series: [{ name: 'Infusion therapy', values: ['FY20', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'].map(f => Math.round(sa(f).infusion)), fmt: 'num' }, { name: 'Renal', values: ['FY20', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'].map(f => Math.round(sa(f).renal)), fmt: 'num' }, { name: 'Others', values: ['FY20', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'].map(f => Math.round(sa(f).others)), fmt: 'num' }], minLabel: 60, source: 'Q1FY27 PPT p.6; Q4FY26 PPT p.33 (FY23-26 restated split)' },
      { type: 'stacked', title: 'Revenue by geography: India the fastest grower', unit: 'Revenue (₹ crore)', x: ['FY20', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'], series: [{ name: 'India', values: ['FY20', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'].map(f => Math.round(sa(f).india)), fmt: 'num' }, { name: 'Europe', values: ['FY20', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'].map(f => Math.round(sa(f).europe)), fmt: 'num' }, { name: 'Rest of world', values: ['FY20', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'].map(f => Math.round(sa(f).row + (sa(f).otherOp || 0))), fmt: 'num' }], minLabel: 60, source: 'Q1FY27 PPT p.6; Q4FY26 PPT p.33' },
    ] },
    { callout: '**So what:** Polymed is a world-class low-cost manufacturer of commodity-like disposables that is trying to become a med-tech company. The first business is proven: high gross margins, sticky distributor relationships, 15-20% growth for a decade. The second (cardiology, orthopaedics, dialysis machines, the US) is where the growth story now rests, and it is early, sub-scale and partly bought.' },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'History: 25 years self-funded, then two QIPs, two plants, two European acquisitions and a share price that tripled and then halved',
  blocks: [
    { exhibit: { type: 'table', title: 'Key events and what they did to the numbers', head: ['When', 'Event', 'Impact on the numbers'], wide: [1, 2], rows: [
      ['1995-96', 'Founded by the Baid family (Faridabad); IPO in 1996', 'Grew to ~₹700 cr of revenue by FY20 from internal accruals'],
      ['2003 / 2009', 'Egypt joint venture (Assiut; now a 30% associate) / plant in Laiyang, China', 'Associate profit ₹5-6 cr a year, booked in other income'],
      ['2018-19', 'Renal care launched (first Indian dialysers); Plan1Health (Italy) bought for EV ~€4.2 mn', 'Renal ₹26 cr (FY20) → ₹188 cr (FY26); P1H revenue 3.2x'],
      ['Sep-2020', 'First QIP, ₹400 cr', 'Shares 8.8 cr → 9.6 cr; funded the 2021-24 capacity build-out'],
      ['2024', 'Entered cardiology (stents, balloons)', 'Stents only ~₹10-12 cr of revenue by FY26'],
      ['22-Aug-2024', 'Second QIP: 53.2 lakh shares at ₹1,880 (₹1,000 cr)', 'Shares +5.5% to 10.13 cr; treasury income +₹30-40 cr a year in FY25-26'],
      ['2025', 'DES launched in India; 2,000-patient PACIFIER registry (840+ enrolled by Aug-2026)', 'Clinical data for exports of stents'],
      ['Sep / Nov-2025', 'PendraCare (90%) and Citieffe (100%) acquired, ~₹390 cr cash', 'FY26 revenue +₹117 cr; loss before tax ₹14 cr; goodwill ₹224 cr'],
      ['Nov-2025', 'Labour codes notified', '₹6.8 cr one-time provision (Q3FY26)'],
      ['2026', 'Haridwar plant 2 and gamma-sterilisation plant operational; Medyneo (Brazil); new CEOs for India/APAC and Brazil', 'D&A ₹116 cr (FY26) → ~₹145 cr run-rate (Q1FY27)'],
    ], source: 'Q1FY27 PPT pp.8-14; Q4FY26 PPT; AR FY25-26; Q4FY26 and Q1FY27 calls' } },
    { pair: [
      { type: 'line', title: 'Share price: ₹837 (Apr-21) → ₹3,129 (Nov-24) → ₹1,674', unit: '₹ per share, weekly', x: PXS.map(p => p[0]), series: [{ name: 'Price', values: PXS.map(p => p[1]), fmt: 'inr', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, source: 'Screener.in weekly prices; NSE close on 30-Sep-2026' },
      { type: 'column', title: 'Share count: two QIPs in six years', unit: 'Shares outstanding (crore), year-end', x: ['FY20', 'FY21', 'FY24', 'FY25', 'FY26'], series: [{ name: 'Shares', values: [8.84, 9.60, 9.60, 10.13, 10.14], fmt: 'n2' }], labels: 'all', min: 8, max: 10.5, source: 'Screener.in; AR FY25 note 50; AR FY26 note 14' },
    ] },
    { callout: `**So what:** the history matters for valuation in two ways. (1) The Aug-2024 QIP changed the share count (+5.5%) and added ₹985 cr of cash, so we compute the forward P/E on market value at each date rather than on today's share count. (2) The stock's multiple has swung wildly: ~25-40x forward earnings in 2022-23, 60-95x in 2024 (when it peaked at ₹3,129), back to ~42x on our FY28E today at ₹${n0(price)}. A median over these years is a blunt instrument.` },
  ],
};

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Industry: a USD 680 bn global market growing ~5%, India only USD 16 bn but growing ~13%; disposables are competitive and tender-priced',
  blocks: [
    { p: D.industry.summary },
    { pair: [
      { type: 'column', title: 'Global medical devices: ~5% a year', unit: 'Market size (USD bn)', x: ['2024', '2025F', '2027F', '2030F'], series: [{ name: 'Global', values: [647, 682, 758, 880], fmt: 'num' }], labels: 'all', source: 'Q4FY26 PPT p.27 (BCG; industry reports)' },
      { type: 'column', title: 'India medical devices: ~13% a year to USD 30 bn', unit: 'Market size (USD bn)', x: ['2024', '2025F', '2030F'], series: [{ name: 'India', values: [14, 16, 30], fmt: 'num' }], labels: 'all', source: 'Q4FY26 PPT p.28 (BCG; EY; IBEF)' },
    ] },
    { exhibit: { type: 'table', title: 'What drives demand, and what holds Polymed back', head: ['Factor', 'Effect'], wide: [1], rows: [
      ...D.industry.drivers.map(d => [d, 'More volume for an Indian low-cost maker']),
      ...D.industry.threats.map(t => [t, 'Caps prices, takes share or blocks shipments']),
    ], source: 'Q4FY26 and Q1FY27 calls and PPTs; CRISIL (Jun-2026)' } },
    { exhibit: { type: 'table', title: 'Who Polymed competes with', head: ['Group', 'Names', 'Where they meet Polymed'], wide: [1, 2], rows: [
      ['Global multinationals', 'Becton Dickinson, B. Braun, Terumo, Nipro, Fresenius, Teleflex, ICU Medical', 'IV cannulae, infusion and vascular access worldwide; also Polymed\'s OEM customers in some products'],
      ['Chinese makers', 'Many, some with ASEAN plants', 'Dialysers in India (duty-free via ASEAN); price-led tenders in export markets'],
      ['Indian private makers (unlisted)', D.peers.domesticUnlisted, 'Syringes, catheters, stents and surgical consumables in India'],
      ['Listed Indian med-tech (small)', `Laxmi Dental (₹${n0(P.LAXMIDENTL.mcapCr)} cr), Tarsons (₹${n0(P.TARSONS.mcapCr)} cr; lab plastics)`, 'Not direct competitors; too small or too new to be valuation peers'],
    ], source: 'deep.json peer notes; LKP (Mar-2025) global peer table; asof-peers.js (market values at 30-Sep-2026)' } },
    { callout: `**Pricing is the weak point.** ${D.industry.pricing}` },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Tailwind test: India\'s import substitution reaches Polymed (+20% a year); the "make in India for the world" story mostly has not yet',
  blocks: [
    { exhibit: { type: 'table', title: 'Does each tailwind reach Polymed?', head: ['Tailwind', 'Reaches Polymed?', 'Evidence'], wide: [2], rows: [
      ['Import substitution and insured hospital demand in India', '**Yes**', 'India revenue +19.6% (FY26), +16.2% (Q1FY27); present in "almost every corporate hospital"'],
      ['Global sourcing shift to India', 'Not yet', 'International organic revenue −0.6% in FY26; Q1FY27 +10.4% (Europe +17.6%, RoW +4.0%)'],
      ['US market opening', '**No** (so far)', 'Only ~4 own FDA approvals; US exports USD 3.5-4 mn in FY27 (<2% of revenue); 10% tariff'],
      ['Dialysis demand in India', 'Partly', 'Renal +24.5% in FY26, −3.8% in Q1FY27 on Chinese prices; anti-dumping probe pending'],
      ['High-tech devices (cardiology, orthopaedics)', 'Bought, not built', 'Cardiology ₹28.6 cr and orthopaedics ₹49.2 cr in Q1FY27, mostly PendraCare and Citieffe'],
      ['Weak rupee', '**Yes**', 'Two-thirds of revenue exported; forex gains ₹15.7 / 21.6 / 38.6 cr in FY24-26'],
      ['Pricing', '**No**', '3-5% price increases only to pass on a ~20% jump in raw-material costs'],
    ], source: 'Q4FY26 and Q1FY27 PPTs and calls; AR FY24-26 other-income notes' } },
    { pair: [
      { type: 'column', title: 'India keeps growing; exports stalled in FY26', unit: 'Revenue growth (%)', x: ['FY24', 'FY25', 'FY26', 'Q1FY27'], series: [{ name: 'India', values: [19.1, 16.3, 19.6, 16.2], fmt: 'pct' }, { name: 'International (organic in FY26-27)', values: [25.2, 22.2, -0.6, 10.4], fmt: 'pct' }], labels: 'all', source: 'Q4FY26 PPT p.33; Q1FY27 PPT p.26; GAM (organic = ex PendraCare and Citieffe)' },
      { type: 'column', title: 'Renal: fast growth, then Chinese prices bite', unit: 'Renal revenue growth (%)', x: ['FY24', 'FY25', 'FY26', 'Q1FY27'], series: [{ name: 'Renal', values: [23.7, 60.3, 24.5, -3.8], fmt: 'pct' }], labels: 'all', source: 'Q4FY26 PPT p.33; Q1FY27 PPT p.27' },
    ] },
    { callout: '**Verdict:** the India tailwind is real and Polymed captures it; it is why we model 16-18% domestic growth. The export tailwind that justified the 2024 rating ("China+1", the US) has not shown up in the numbers: organic exports were flat in FY26 and the US is still tiny. We model international organic growth of 11.5-13%, which needs the Middle East to reopen and the new CE/FDA registrations to sell.' },
  ],
};

module.exports = { business, history, industry, tailwind };
