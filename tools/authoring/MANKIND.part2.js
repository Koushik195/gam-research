// Mankind Pharma report, part 2: what the company does, history & the BSV deal, industry, tailwind test.
const X = require('./MANKIND.ctx');
const { C, D, F, A, n0, n1, SA, SQ, QL, Q1, FY26, DEAL, YRS, LINES, LBL, BL, build, mixPct } = X;

const CHRONIC = { x: ['FY17', 'FY18', 'FY19', 'FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26', 'Q1FY27'], v: [26.7, 27.9, 31.9, 32.2, 34.1, 32.9, 33.9, 35.5, 37.1, 38.5, 40.0] };

const business = {
  id: 'business', nav: 'What Mankind does', kicker: 'The business', title: 'India\'s #4 drug maker by value and #1 by prescriptions: a mass-market brand machine adding chronic, specialty and consumer arms',
  blocks: [
    { p: `Mankind sells branded generic medicines in India. It is the 4th-largest company in the Indian pharmaceutical market (IPM) by value with a 4.7% share, 2nd by volume (6.1%), and has had the most prescriptions written for its brands for nine years running (15.2% of all prescriptions in Q1FY27). It built that position the unusual way: low-priced, high-volume brands for common acute conditions (antibiotics, antacids, vitamins, pain), sold by one of India's largest field forces (18,500+ including managers, covering 5 lakh+ doctors) and with a deeper reach into smaller towns than its peers. On top of that base it has added four layers: chronic therapies (cardiac, diabetes, respiratory; 40% of domestic sales ex-BSV), in-licensed specialty products from multinationals (AstraZeneca's Symbicort, Novartis' inclisiran as Crenzlo, Takeda's vonoprazan as Vonalong, Roche's Rivotril), a consumer-healthcare business built on household brands (Manforce condoms, Prega News pregnancy kits, Gas-O-Fast antacid), and since Oct-2024 Bharat Serums and Vaccines (BSV), a maker of complex biologics for women's health, fertility and critical care. Exports (14% of revenue) are mostly BSV's emerging-market business plus 49 US generic launches.` },
    { pair: [
      { type: 'hbar', title: 'FY26 revenue by business: 79% is the Indian prescription market', unit: 'FY26 revenue (₹ crore)', x: LINES.map(l => LBL[l]), series: [{ name: 'FY26', values: LINES.map(l => BL.base[l]), fmt: 'num' }], labels: 'all', highlight: LBL.domesticRx, source: 'Q4FY26 investor presentation' },
      { type: 'column', title: 'Chronic share (ex-BSV): 27% to 40% in nine years', unit: 'Chronic therapies, % of Mankind domestic sales (IQVIA)', x: CHRONIC.x, series: [{ name: 'Chronic share', values: CHRONIC.v, fmt: 'pct' }], labels: 'all', highlight: 'Q1FY27', min: 20, max: 45, source: 'AR FY26 (IQVIA MAT Mar); Q1FY27 call' },
    ] },
    { exhibit: { type: 'table', title: 'Four engines and how big each is', head: ['Engine', 'What it sells', 'FY26 size', 'Growth', 'Position'], wide: [1, 4], rows: [
      ['Mass-market base (acute ~60% of domestic)', 'Anti-infectives (Moxikind-CV, Gudcef), gastro (Pantakind), VMN (Nurokind), gynaec (Dydroboon), derma, pain', '~60% of ₹11,338 cr domestic Rx', 'Acute +10.9% in Q1FY27 (3.3% in Q2FY26)', '#2 in acute covered market; #1 in gynaecology (10.3% share)'],
      ['Specialty chronic', 'Cardiac (Telmikind family ₹750 cr+, Amlokind-AT), diabetes (Glizid ₹230 cr+, Glimestar-M, gliflozins, insulin glargine), respiratory inhalers, CNS (Rivotril)', '40% of domestic ex-BSV', 'Chronic +15.8% in Q1FY27; cardiac +19.4%', '#3 in chronic covered market (4.3% share); #4 cardiac and anti-diabetic'],
      ['Consumer healthcare (OTC)', 'Manforce condoms (#1, 28%), Prega News (#1, 84%), Gas-O-Fast (#2 antacid powder, 12%), emergency contraceptive (#1, 68%), anti-acne, VMN', '₹879 cr (6%)', '+9% FY26; +4% Q1FY27', 'Category leaders; 15% of sales via modern trade and e-commerce'],
      ['BSV super specialty', 'Recombinant Anti-D (only one in the world; India patent to 2028), Foligraf (rFSH), Humog (HMG), HUCOG, IVIG, anti-snake-venom, liposomal amphotericin B', '~13% of group revenue (Q3FY26 ₹464 cr)', '+21% in Q1FY27 (India ~17%, international ~25%)', '#1 in women\'s health/fertility in India; ~50% of BSV sales abroad'],
    ], source: 'AR FY26; Q4FY26 and Q1FY27 decks and calls (IQVIA); BSV deal presentation (25-Jul-2024)' } },
    { callout: '**So what:** Mankind is a distribution and brand-building company first. Its edge is reach (towns, doctors, chemists) and the ability to make a ₹100-200 cr brand out of an ordinary molecule. The strategy now is to move up the value chain (chronic, specialty, biologics) without losing the mass-market engine that still produces most of the profit.' },
  ],
};

const history = {
  id: 'history', nav: 'History & the BSV deal', kicker: 'History', title: 'From a 1995 start-up to a ₹1 lakh crore company: the IPO, the private-equity exit and the BSV bet',
  blocks: [
    { p: 'Co-founders Ramesh and Rajeev Juneja started Mankind in 1995 with a focus on affordable brands for general practitioners in smaller towns. Brands such as Manforce and Prega News (2007-10) took it into consumer health; the push into chronic therapies (2018-19) and specialty (Panacea Biotec\'s brands, FY22; in-licensing from AstraZeneca, Novartis, Takeda and Roche) followed. ChrysCapital and Capital Group were long-time private-equity investors. The May-2023 IPO at ₹1,080 was entirely an offer for sale (4.0 cr shares, ~₹4,326 cr): the company raised nothing. The private-equity funds then sold the rest of their stakes in block deals (Dec-2023 to Jul-2024), and the promoters sold 1.62% in Feb-2024 to meet the 25% public-shareholding rule.' },
    { exhibit: { type: 'table', title: 'Corporate actions and what they did to the numbers', head: ['When', 'Event', 'Impact'], wide: [1, 2], rows: C.history.map(h => [h.date, h.event, h.impact || '–']), source: 'Company filings and annual reports; Business Standard; GAM' } },
    { h: 'The BSV deal in one table' },
    { exhibit: { type: 'table', title: 'Bharat Serums and Vaccines: price, funding and accounting', head: ['Item', 'Detail'], wide: [1], rows: [
      ['Signed / completed', '25-Jul-2024 / 23-Oct-2024 (consolidated from that date)'],
      ['Seller', 'Advent International (Ansamira, Miransa) and two minority holders'],
      ['Price', `Enterprise value ₹${n0(DEAL.evAnnounced)} cr at signing; purchase consideration ₹${n0(DEAL.consideration)} cr (cash ₹${n0(DEAL.considerationCash)} cr incl. the US$ portion)`],
      ['What it bought (FY24)', `Revenue ₹${n0(DEAL.bsvFy24.revenue)} cr (54% India, 46% international), adjusted EBITDA ₹${DEAL.bsvFy24.ebitda} cr (${DEAL.bsvFy24.ebitdaMarginPct}% margin): ~28x EBITDA`],
      ['Funding', '₹5,000 cr of secured NCDs (7.97-7.99%, 18-37 months), up to ₹5,000 cr of commercial paper (repaid by Q3FY26); later a ₹3,000 cr QIP (Dec-2024) and the ₹562 cr Mahananda sale'],
      ['Purchase accounting', `Intangibles ₹${n0(DEAL.ppa.intangibles)} cr (+₹${n0(DEAL.ppa.intangiblesUnderDevelopment)} cr under development), goodwill ₹${n0(DEAL.ppa.goodwillProvisional)} cr, deferred tax liability ₹${n0(DEAL.ppa.dtl)} cr`],
      ['Annual amortisation (GAM)', `~₹${DEAL.ppa.amortisationPerYearCr} cr a year (half of ~₹225 cr quarterly D&A, Q1FY27 call; intangible amortisation +₹200 cr in FY25's 160 days); not tax-deductible; ~₹${n1(X.ppaPs)} a share after the deferred-tax credit`],
      ['Leverage promise / delivery', 'Net debt/EBITDA below 2x by FY26 (deal deck) / 1.1x at Mar-26, 0.9x at Jun-26; acquisition debt repaid by FY28 (guided)'],
    ], source: 'BSV deal presentation (25-Jul-2024); AR FY25 note 53; AR FY26 note 22; Q4FY26 and Q1FY27 calls' } },
    { callout: '**Our read:** the deal bought Mankind something it could not build quickly (recombinant biologics, a fertility portfolio, a women\'s-health specialist field force and an emerging-market business) at a full price. Integration was bumpy: BSV grew only mid-to-high single digits in Q1-Q2FY26 and Mankind stopped disclosing its revenue, then growth recovered to 20%+ from Q3FY26. Two years in, the deal has been de-risked financially (debt down by ~40%) but not yet proven commercially.' },
  ],
};

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'The Indian drug market: ₹2.57 lakh crore growing ~10%, tilting to chronic and specialty, with a GLP-1 price war under way',
  blocks: [
    { p: `India's domestic formulations market was worth ₹2,565 bn (₹2.57 lakh cr) at the chemist level in FY26, up 9.9% (IQVIA). Growth comes from three parts that move differently: price (4-5% a year; scheduled drugs follow the WPI-linked price-control formula, others may rise up to 10%), new products (~3-4% of sales a year) and volume (low single digits). The mix is shifting toward chronic therapies (cardiac, diabetes, respiratory, CNS) as lifestyle diseases and diagnosis rates rise, and toward specialty and biologics. Two forces stand out in 2026: (1) semaglutide's patent expired in Mar-2026 and 20+ companies launched 35-40 brands, adding to market growth while prices collapse, and (2) trade generics and e-pharmacies keep pressing on prices of older acute molecules, Mankind's heartland. The market grew 10.7% in Q4FY26 (excluding the GLP-1 innovator) and 13.0% in Q1FY27 (excluding tirzepatide).` },
    { exhibit: { type: 'table', title: 'Where Mankind ranks (IQVIA, covered market)', head: ['Therapy', 'Rank', 'Market share', 'Mankind FY21-26 CAGR', 'Market FY21-26 CAGR'], rows: [
      ['Overall', '2', '4.7%', '12.4%', '10.3%'], ['Chronic therapies', '3', '4.3%', '14.3%', '11.4%'], ['Cardiovascular', '4', '5.5%', '17.3%', '11.1%'], ['Anti-diabetic', '4', '4.5%', '12.1%', '8.2%'],
      ['Acute therapies', '2', '5.0%', '11.4%', '9.6%'], ['Anti-infectives', '5', '6.0%', '12.2%', '10.3%'], ['Gynaecology', '1', '10.3%', '23.2%', '10.1%'], ['Gastro-intestinal', '6', '4.3%', '8.7%', '10.5%'], ['Respiratory', '6', '4.5%', '13.9%', '12.7%'], ['Vitamins, minerals, nutrients', '2', '5.1%', '7.8%', '9.1%'],
    ], source: 'Q1FY27 investor presentation (IQVIA MAT Mar-2026; covered market = molecules in which Mankind sells; gynaecology includes BSV from Oct-2024)' } },
    { bullets: [
      '**Chronic is where the growth is.** Mankind outgrew the market by 1.25x in chronic over FY21-26 and by 1.55x in cardiac; it lags in gastro and vitamins, two acute categories where it is large.',
      '**GLP-1s.** Mankind deliberately stayed out of the first wave of semaglutide launches ("let this storm pass"; it launched an in-licensed pen in Apr-May 2026 through its diabetes and gynaec divisions, without price cuts). That protects margins but costs share in the fastest-growing molecule; the market-growth figures it quotes exclude tirzepatide.',
      '**Price controls.** FY26 price growth was 4.2% for Mankind vs 4.4% for the market (IQVIA); a large NLEM share in acute caps pricing.',
      '**Consumer health.** Modern trade and e-commerce are taking share from general trade; Mankind\'s share of OTC sales through them rose from 9% (FY25) to 15% (Q1FY27).',
    ] },
    { callout: '**So what:** the market Mankind serves grows ~10% a year in value with little cyclicality. Its value is in chronic and specialty; Mankind is a top-5 player in most chronic segments but is still 60% acute, so its growth depends on whether the acute recovery of the last four quarters holds.' },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Does the market\'s growth reach Mankind? In chronic and BSV, yes; in acute, only at market pace since FY25',
  blocks: [
    { p: `For years Mankind grew 1.3-1.7x the market (management). That ended in FY25-26: an enforced overhaul of the field force (high attrition, people removed and replaced about 18 months before Jul-2026) hit acute sales, where relationships with general practitioners matter most. Secondary sales grew only 6.3% in Q2FY26 (acute 3.3%), against a market growing ~10%; organic domestic growth excluding consumer was 8.6% for FY26. The recovery since is real: secondary sales +8.7% in Q4FY26 and +12.7% in Q1FY27 (market +13.0%), acute back to 10.9%, volume growth 4.7% (2.3% in FY26, 0.5% in FY25), field-force productivity ₹7.2 lakh a month per rep in FY26 (₹6.5 lakh in FY25), attrition "back to normal".` },
    { pair: [
      { type: 'column', title: 'Domestic prescription revenue: back to double-digit growth', unit: 'Domestic revenue ex-consumer (₹ crore), quarterly; BSV India from Q3FY25', x: QL, series: [{ name: 'Domestic Rx', values: SQ.map(q => q.domesticRx), fmt: 'num' }], labels: 'all', highlight: 'Q1FY27', source: 'Company investor presentations' },
      { type: 'hbar', title: 'Q1FY27 growth vs the market, by therapy', unit: 'Secondary sales growth, Q1FY27 (%), IQVIA', x: ['Cardiac', 'VMN', 'Chronic (all)', 'Gastro', 'Mankind overall', 'Market (IPM)', 'Gynaec', 'Anti-diabetic', 'Acute (all)', 'Anti-infectives'], series: [{ name: 'Growth', values: [19.4, 19.3, 15.8, 13.6, 12.7, 13.0, 12.7, 12.7, 10.9, 3.6], fmt: 'pct' }], labels: 'all', highlight: 'Market (IPM)', source: 'Q1FY27 deck and call (IQVIA Jun-2026; anti-diabetic and market ex-tirzepatide)' },
    ] },
    { exhibit: { type: 'table', title: 'Tailwind scorecard', head: ['Tailwind', 'Reaches Mankind?', 'Evidence'], wide: [2], rows: [
      ['Chronic shift', '**Yes**', 'Chronic +15.8% in Q1FY27 (1.1x market in cardiac and anti-diabetic, 1.3x in chronic respiratory); share of sales 40% and rising ~1pp a year'],
      ['Specialty and biologics', '**Yes**', 'BSV +21% in Q1FY27; IVF brands Foligraf and Humog +39%; Anti-D +23% with 100% share in India'],
      ['Volume growth in smaller towns', '**Partly**', 'Volume +4.7% in Q1FY27; Metro & Class-1 towns are now 56.5% of sales (50.7% in FY17): growth has come from bigger towns'],
      ['New launches', '**Weak**', 'New introductions 2.8% of sales vs 4.1% for the market in Q1FY27; few, larger launches by choice'],
      ['GLP-1 / obesity', '**Not yet**', 'Late, cautious entry; the IPM growth Mankind compares itself with excludes tirzepatide'],
      ['Consumer health premiumisation', '**Partly**', 'E-commerce/modern trade +38% but total consumer sales +4% after shutting cash-and-carry'],
    ], source: 'Company decks and calls (Q4FY26, Q1FY27); AR FY26 (IQVIA)' } },
    { callout: `**Verdict:** the sector tailwind reaches Mankind's chronic and specialty half; the acute half grows with the market, not ahead of it. We model domestic prescription growth of 11% / 11% / 10.5% (FY27-29E), i.e. about market growth, not the 1.2-1.3x outperformance management aspires to. That is the main difference between us and the bulls (Motilal Oswal models a 22% EPS CAGR over FY26-28).` },
  ],
};

module.exports = { business, history, industry, tailwind, CHRONIC };
