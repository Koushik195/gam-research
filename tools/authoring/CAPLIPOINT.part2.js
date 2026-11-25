// Caplin Point report, part 2: what the company does, history and corporate actions, the industry, the tailwind test.
const X = require('./CAPLIPOINT.ctx');
const { C, D, n0, n1, FY26, Q1, SA, CC } = X;

const business = {
  id: 'business', nav: 'What Caplin does', kicker: 'The business', title: 'What Caplin does: a "stock-and-sale" generics distributor in small Latin American markets, plus a US injectables maker',
  blocks: [
    { p: `Caplin Point makes and buys generic medicines in India and China and sells them where big companies do not bother. **Rest of the World (₹${n0(FY26.row)} cr, 79% of FY26 revenue)** is mostly Central America and the Caribbean (Guatemala, Honduras, Nicaragua, El Salvador, the Dominican Republic, Ecuador, Panama, Costa Rica), now extending to Chile, Mexico and Colombia, plus ~3% from French-speaking Africa. Caplin owns the importing and distribution companies in these countries, keeps about six months of fast-moving stock in its own warehouses next to the customer, and sells 300-odd products (tablets, syrups, injections, ointments) straight to pharmacies, through two or three co-distributors per country (10-12% of sales) and to governments in tenders (18-20% in Central America). About 60% is made in its own plants in Puducherry and Chennai; ~40% is bought from Indian (76%) and Chinese (24%) contract makers. **USA (₹${n0(FY26.us)} cr, 21%)** is Caplin Steriles: a sterile injectables and eye-drops plant at Gummidipoondi near Chennai, approved by the USFDA, which sells to US distributors under partners' labels (B2B, ~70%) and, since 2025, under its own label through Caplin Steriles USA (~30%).` },
    { pair: [
      { type: 'hbar', title: 'FY26 revenue: Latin America dominates', unit: '% of FY26 revenue (company)', x: ['Latin America & Caribbean', 'US & other regulated', 'Africa'], series: [{ name: 'Share', values: [76, 21, 3], fmt: 'pct' }], labels: 'all', highlight: 'US & other regulated', source: 'AR FY26 (MD\'s letter)' },
      { type: 'hbar', title: 'Registrations: depth in small markets', unit: 'Products registered (AR FY26 map)', x: ['Guatemala', 'Nicaragua', 'Honduras', 'Dominican Rep.', 'El Salvador', 'Ecuador', 'Chile', 'USA (ANDAs launched)', 'Mexico'], series: [{ name: 'Registered', values: [951, 689, 632, 504, 468, 354, 109, 38, 17], fmt: 'num' }], labels: 'all', highlight: 'Mexico', source: 'AR FY26 registration map (Mexico 29 approvals by Aug-2026 per the Q1FY27 release)' },
    ] },
    { exhibit: { type: 'table', title: 'The two businesses at a glance (FY26)', head: ['', 'Rest of the World', 'USA (Caplin Steriles)'], wide: [1, 2], rows: [
      ['Revenue (₹ cr) / growth', `${n0(FY26.row)} / +${SA[2].rowGrowthPct}%`, `${n0(FY26.us)} / +${SA[2].usGrowthPct}%`],
      ['Segment PBT (₹ cr) / margin', `${n0(FY26.rowResult)} / ${SA[2].rowMarginPct}%`, `${n0(FY26.usResult)} / ${SA[2].usMarginPct}% (EBITDA ₹${FY26.lines.cslEbitda} cr, 30%)`],
      ['Products', 'Plain and branded generics across 36 therapies; 5,000+ registrations', '60 ANDAs approved, 5 pending, 38 launched; injectables, ophthalmics, IV bags, pre-filled syringes'],
      ['Customers', 'Pharmacies (direct), co-distributors, governments (tenders)', 'US wholesalers (Big 4), 30+ hospital networks (IDNs), 14,300 end users; B2B partners'],
      ['Assets', 'CP1 Puducherry (oral, liquids, lyophilised), outsourcing, warehouses in each country', 'One USFDA site at Gummidipoondi (6 lines, 7th coming); COL-II block under construction'],
      ['Currency', 'US dollar (El Salvador, Panama, Ecuador) and Central American currencies', 'US dollar'],
    ], source: 'AR FY26; Q1FY27 presentation and call; Q4FY26 call' } },
    { callout: `**In one line:** Caplin earns high margins not from clever molecules but from logistics, registrations and credit in markets that are too small for multinationals and too far for most Indian rivals; the US is a second, faster engine that is still capacity-bound.` },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'History: 35 years, one founder, no acquisitions of note, and one outside investor in the US arm',
  blocks: [
    { p: `C.C. Paarthipan founded Caplin in 1990 and listed it in 1994. It went to Angola and then to Latin America in the early 2000s; his son Ashok has run Latin America since 2002. The "stock-and-sale" model (own warehouses, local subsidiaries, outsourcing from China and India) dates from 2005-06. The US business began in 2014 with Caplin Steriles; its plant passed its first USFDA inspection in 2016 and shipped to the US from 2018. In Jan-2019 Eight Roads Ventures (Fidelity International's proprietary investment arm) and F-Prime Capital put ₹218 cr into Caplin Steriles through compulsorily convertible preference shares (CCPS) that convert into **at least ${CC.minStakePct}%** of Caplin Steriles. Since then Caplin has funded a ₹600 cr and then a ~₹1,000 cr expansion from its own cash, bought an API plant in Vizag (2022), built an oncology plant (Caplin One Labs), opened subsidiaries in Chile and Mexico, launched its own US label (2025) and bought 15 ANDAs (FY26). There has been no equity issue (other than ESOPs), no buyback and no bonus issue in the last five years, and no large acquisition.` },
    { exhibit: { type: 'table', title: 'Milestones and what they did to the numbers', head: ['When', 'Event'], wide: [1], rows: C.history, source: C.historySrc } },
    { callout: `**Impact on the numbers:** the share count has barely moved (7.56 cr in FY21, ${n1(FY26.shares)} cr now: ESOPs only), so EPS growth equals profit growth. The one structural item is the CCPS in Caplin Steriles: the accounts show them as Caplin Point's own equity and give none of Caplin Steriles' profit to the holders (₹${n1(FY26.lines.cslPat)} cr in FY26), so reported EPS includes 100% of a business of which shareholders will own at most ~75% on conversion (governance chapter).` },
  ],
};

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Industry: two very different markets: small, credit-driven Latin American generics and the US sterile injectables market',
  blocks: [
    { h: 'Latin America and the Caribbean' },
    { bullets: D.industry.latam },
    { h: 'US sterile injectables' },
    { bullets: D.industry.us },
    { exhibit: { type: 'table', title: 'Where Caplin competes', head: ['Market', 'Who sells there', 'What decides share', "Caplin's position"], wide: [1, 2, 3], rows: [
      ['Central America private market', 'Multinational brands, local makers, importers of Indian/Chinese generics', 'Registrations, stock availability, credit to pharmacies', 'Leader among generic suppliers in independent pharmacies (~41% shelf share, management)'],
      ['Central America / Andean tenders', 'Local and Indian generic makers', 'Price, registrations, delivery speed', 'Wins large tenders (El Salvador ~$16 mn, FY26-27); lumpy'],
      ['Chile and Mexico', 'Large local groups, multinationals, chains', 'Registrations, bio-studies, local manufacturing (Mexico)', 'New: Chile $10 mn of contracts for FY27; Mexico 29 approvals'],
      ['US injectables', 'Pfizer/Hospira, Fresenius, Hikma, Sagent, Gland, Aurobindo (Eugia), Zydus, Amneal', 'Reliability of supply, compliance, cost, capacity', 'Small (FY26 ~$51 mn); niche products, own label; capacity-bound'],
    ], source: 'AR FY26; Q4FY26 and Q1FY27 calls; GAM Research' } },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Does the tailwind reach Caplin?', title: 'Tailwind test: Caplin captures the US injectables shortage and the weak rupee; Latin American market growth helps only slowly',
  blocks: [
    { p: 'A sector tailwind helps a shareholder only if the company turns it into revenue. We score each driver on whether Caplin is a main beneficiary, a partial one or a bystander.' },
    { verdicts: [
      ['US injectable shortages and pricing', 'Yes', 'Caplin Steriles +28% in FY26, +26% in Q1FY27; "booked out till February"; lower-margin volume turned away', 'Visible in the numbers, capped by capacity'],
      ['US own-label / IDN channel', 'Yes', 'Own label ~₹100 cr in its first full year; Q1FY27 ₹43.7 cr vs ₹14.4 cr', 'Higher margin per product'],
      ['Weak rupee', 'Yes', 'Nearly all revenue is in dollars or dollar-linked currencies; FY26 average ₹88.4/$, Mar-26 ₹94.65/$', 'Adds ~6-7pp to FY27E rupee growth; not repeatable every year'],
      ['Latin American healthcare spending', 'Partly', 'LatAm sales +3% in dollars in FY26; Central America +7%', 'The core markets are mature for Caplin'],
      ['Government tenders in larger markets', 'Partly', '$24 mn of tender wins (Guatemala, El Salvador, Nicaragua) + Chile $9.5 mn for FY27', 'Lumpy, lower margin, slower to pay'],
      ['China+1 / supply-chain shifts', 'Partly', 'Caplin is itself an outsourcer from China (24% of LatAm outsourcing); "China 2.0" deals bring 46 licensed products', 'Cost lever, not demand'],
      ['India pharma re-rating', 'No', 'Caplin has no India business', 'Valuation only'],
      ['GLP-1 generics', 'No (not yet)', 'Under registration in Central America; no revenue (12-Aug-2026)', 'Optional'],
    ], head: ['Tailwind', 'Captured?', 'Evidence', 'So what'], title: 'Tailwind scorecard: 3 of 8 captured directly, 3 partly, 2 not yet', source: 'Company filings and calls; GAM Research' },
    { callout: `**Verdict:** the strongest tailwind (US injectable shortages) reaches Caplin but is capped by one plant until FY28-29; the second (the weak rupee) is a one-time lift to reported growth. The underlying Latin American market is growing slowly for Caplin. That is why we model Rest of World growth of +14% in FY27E (half of it the rupee) and +10% thereafter, and the US at +25% / +20% / +20%.` },
  ],
};

module.exports = { business, history, industry, tailwind };
