// Ajanta Pharma report, part 2: what the company does, history & corporate actions, industry, tailwind test.
const X = require('./AJANTPHARM.ctx');
const { C, D, n0, n1, SA, SQ, QL, Q1, FY26, BL } = X;
const IND = D.industry;

const business = {
  id: 'business', nav: 'What Ajanta does', kicker: 'The business', title: 'Five businesses, one model: first-to-market branded generics in India, Asia and Africa, plus US generics and African anti-malarial tenders',
  blocks: [
    { p: `Ajanta makes and sells medicines in India and 30-odd other countries. Its core is the **branded generic**: an off-patent medicine sold under Ajanta's own brand and promoted to doctors by its ${n0(Q1.mrsGlobal)}+ medical representatives. About two-thirds of revenue comes from three such businesses: **India** (₹${n0(FY26.india)} cr in FY26; cardiology, ophthalmology, dermatology and pain, with gynaecology and nephrology added in FY26), **Asia** (₹${n0(FY26.asia)} cr; the Middle East, South-East and Central Asia) and **Africa** (₹${n0(FY26.africa)} cr; about 21 countries). The playbook is speed: about half its products were the first of their kind in their market, and it launched 53 products across markets in FY26. The other third: **US generics** (₹${n0(FY26.us)} cr, 29% of FY26 sales; unbranded copies sold to US wholesalers from two FDA-approved plants) and **Africa institutional** (₹${n0(FY26.inst)} cr; anti-malarials bought by aid agencies). Everything is made in seven Indian plants; there are no acquisitions and no minority shareholders in any subsidiary.` },
    { pair: [
      { type: 'hbar', title: 'FY26 revenue by market: branded generics ~68%', unit: 'FY26 revenue (₹ crore)', x: ['India branded', 'US generics', 'Asia branded', 'Africa branded', 'Africa institutional', 'Other operating revenue'], series: [{ name: 'FY26', values: [FY26.india, FY26.us, FY26.asia, FY26.africa, FY26.inst, FY26.otherOp].map(Math.round), fmt: 'num' }], labels: 'all', highlight: 'India branded', source: 'AR FY26 note 53 and MD&A exhibit 1' },
      { type: 'stacked', title: 'Mix over time: the US went from 20% to 29%', unit: 'Revenue by market (₹ crore); Africa = branded + institutional', x: SA.map(s => s.fy), series: [{ name: 'India', values: SA.map(s => Math.round(s.india)), fmt: 'num' }, { name: 'Asia', values: SA.map(s => Math.round(s.asia)), fmt: 'num' }, { name: 'Africa', values: SA.map(s => Math.round(s.africaTotal)), fmt: 'num' }, { name: 'US', values: SA.map(s => Math.round(s.us)), fmt: 'num' }], labels: 'none', source: 'ICICI Direct (FY20-23); Q1FY27 presentation (FY24); AR FY26 (FY25-26)' },
    ] },
    { exhibit: { type: 'table', title: 'The five businesses', head: ['Business', 'What it sells', 'FY26 sales', 'Recent growth', 'Position'], wide: [1, 4], rows: [
      ['India branded generics', 'Cardiology 37%, ophthalmology 29%, dermatology 22%, pain 10%, gynaecology and nephrology 2% (Q1FY27); 65% chronic; 17 brands above ₹25 cr', `₹${n0(FY26.india)} cr (30%)`, `FY26 +${n1(FY26.growth.india)}%; Q1FY27 +24%`, '#24 in the IPM (from #26); #1 in ophthalmology and dermatology and #5 in pain in its covered markets; 3,750 reps'],
      ['Asia branded generics', 'Cardio, diabetes, ophthal, derma, pain, gynaec, antibiotics in ~11 countries (Middle East, South-East and Central Asia)', `₹${n0(FY26.asia)} cr (22%)`, `FY26 ${n1(FY26.growth.asia)}%; Q1FY27 −16%`, 'Top-5 in major markets (company); Middle East war disrupted shipping from Mar-2026'],
      ['Africa branded generics', '8 therapies incl. anti-malarials, in ~21 countries', `₹${n0(FY26.africa)} cr (16%)`, `FY26 +${n1(FY26.growth.africa)}%; Q1FY27 +29%`, 'Leader in many molecules; market grows 7-12% a year (MD)'],
      ['US generics', '51 products on the shelf, 17 awaiting approval, 5 tentative approvals; from Paithan and Dahej', `₹${n0(FY26.us)} cr (29%)`, `FY26 +${n1(FY26.growth.us)}%; Q1FY27 +57%`, 'Price-taker; 20%+ share on most products (MD); DIANA and Cencora supplier awards'],
      ['Africa institutional', 'Anti-malarials sold to multilateral aid agencies', `₹${n0(FY26.inst)} cr (3%)`, `FY26 +${n1(FY26.growth.inst)}%; Q1FY27 ₹70 cr vs ₹38 cr`, 'WHO-prequalified products; lumpy tenders'],
    ], source: 'AR FY26 MD&A and note 53; Q1FY27 press release and presentation (30-Jul-2026); Q1FY27 call; CARE (14-Aug-2026)' } },
    { callout: '**So what:** Ajanta is a portfolio of small, defensible niches (eye drops and skin creams in India, branded generics in African markets) run with high gross margins and tight cost control, plus a US generics business that brings volume and volatility. The branded two-thirds compounds at low-to-mid teens; the US third decides whether a year looks spectacular (FY26) or ordinary.' },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'From a 1973 repackaging unit to ₹5,450 cr of revenue: a second-generation turnaround, then two decades of organic growth and buybacks',
  blocks: [
    { p: 'Three brothers, Mannalal, Purushottam and Madhusudan Agrawal, set up Ajanta in 1973 as a small repackaging unit supplying simple medicines to doctors (Forbes India). Before the second generation joined it had made losses for years and carried heavy debt. Mannalal\'s sons Yogesh and Rajesh took charge in the early 2000s and rebuilt it around first-to-market branded generics: in Indian niches (eye care, skin, heart) and in African and Asian markets where few Indian companies had their own field forces. The US business followed, on two FDA-approved plants. Since then growth has been organic: no acquisitions, five buybacks since FY19, a 1:2 bonus in FY23. Promoter entities have sold stock several times (Jul-2017, Dec-2022, Jun-2026).' },
    { exhibit: { type: 'table', title: 'Corporate actions and what they did to the numbers', head: ['When', 'Event', 'Impact'], wide: [1, 2], rows: C.history.map(h => [h.date, h.event, h.impact || '–']), source: `${C.historySrc}; GAM` } },
    { callout: '**Our read:** the second generation built a high-return business with almost no M&A and no equity raising, and has returned most of the cash. The open questions are the next ones: whether the ~₹1,000 cr in-licensing budget changes the organic model, and how the family\'s third generation and non-executive branches (now selling and pledging shares) fit into ownership and management.' },
  ],
};

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Industry: India grows ~10%, Africa\'s private market 7-12%, US generics low single digit with price erosion',
  blocks: [
    { p: `${IND.ipm} Value growth comes from price (Ajanta FY26: 4.8 points), new products (4.7) and volume (3.6) (Q4FY26 call). Chronic therapies grow faster than acute. ${IND.global}` },
    { exhibit: { type: 'table', title: 'Ajanta\'s four Indian therapies (FY26, IQVIA)', head: ['Therapy', 'Market (₹ cr)', 'Market growth', 'Ajanta growth', 'Ajanta rank'], rows: IND.therapy.map(([t, s, g, a, r]) => [t, n0(s), `${g}%`, `${a}%`, `#${r}`]), source: `${IND.therapySrc}. Ajanta overall: +13% vs IPM +10%; rank #24 (from #26)` } },
    { exhibit: { type: 'table', title: 'Industry themes and what they mean for Ajanta', head: ['Theme', 'For Ajanta', 'Evidence'], wide: [2], rows: IND.themes, source: IND.src } },
    { callout: '**So what:** Ajanta does not need a hot market: its Indian niches (ophthalmology ₹4,900 cr, dermatology ₹17,400 cr) grow 7-10% and it gains share with launches. Its weak spot is the biggest pool: in cardiology (₹34,400 cr, +14%) it is only #17 and grew half as fast as the market on IQVIA data in FY26. Abroad, it chose markets with little Indian competition, at the price of currency and conflict risk.' },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Does the market\'s growth reach Ajanta? In India and Africa, yes (well ahead); in Asia, not this year; in the US, the tailwind is a one-off',
  blocks: [
    { p: `On IQVIA's moving annual total to Jun-2026 Ajanta grew ${Q1.iqvia.ajanta}% against the IPM's ${Q1.iqvia.ipm}%, beating it in ophthalmology (15% vs 10%), dermatology (14% vs 8%) and pain (15% vs 10%), but not cardiology (9% vs 15%; the company says IQVIA under-captures its cardiac sales). Volume growth was 1.4x the market's and new-launch growth 1.8x (Q1FY27 presentation). In Africa the private market grows 7-12% a year and Ajanta's branded sales grew 15% in FY26 and 29% in Q1FY27. In Asia the Middle East war cut sales 10% in Q4FY26 and 16% in Q1FY27. In the US, FY26's 49% came from launches and a flu season, not from the market.` },
    { pair: [
      { type: 'column', title: 'India branded sales: +24% in Q1FY27', unit: 'India branded (₹ crore), quarterly', x: QL, series: [{ name: 'India', values: SQ.map(q => Math.round(q.india)), fmt: 'num' }], labels: 'all', highlight: 'Q1FY27', source: 'Company press releases; MOSL (Q1-Q2FY25)' },
      { type: 'hbar', title: 'Ajanta vs the market, IQVIA MAT Jun-2026', unit: 'Growth (%)', x: IND.jun26.map(r => r[0]), series: [{ name: 'Ajanta', values: IND.jun26.map(r => r[2]), fmt: 'pct' }, { name: 'Market', values: IND.jun26.map(r => r[1]), fmt: 'pct' }], labels: 'all', source: IND.jun26Src },
    ] },
    { exhibit: { type: 'table', title: 'Tailwind scorecard', head: ['Tailwind', 'Reaches Ajanta?', 'Evidence'], wide: [2], rows: [
      ['India market growth (~10-11%)', '**Yes, well ahead**', 'IQVIA +15% vs +11% (MAT Jun-26); reported India +24% in Q1FY27'],
      ['Chronic shift', '**Yes**', '65% of India sales chronic; ophthal/derma share gains'],
      ['Cardiology (largest IPM therapy)', '**No**', 'Ajanta +7-9% vs market +14-15%; #17 in the IPM'],
      ['Africa private-market growth (7-12%)', '**Yes, ahead**', 'Africa branded +15% FY26, +29% Q1FY27'],
      ['Asia / Middle East', '**Not this year**', 'Shipping disrupted by the war; −1% FY26, −16% Q1FY27; guidance cut'],
      ['US generics', '**Partly, one-off**', '+49% FY26 on launches; guidance mid-single digit for FY27; no launches until Q4'],
      ['GLP-1 generics', '**Not yet**', 'India semaglutide "plateaued"; EM approvals ~2 years away'],
    ], source: 'Q1FY27 presentation and call; AR FY26' } },
    { callout: `**Verdict:** the branded tailwinds reach Ajanta, and its share gains add to them. We model India ${BL.growth.india.join(' / ')}% and Africa branded ${BL.growth.africa.join(' / ')}% for FY27-29E, below Q1's pace. We are less generous than management on Asia (${BL.growth.asia.join(' / ')}%) while the war continues, and on the US (${BL.growth.us.join(' / ')}% in rupees) where FY26 will be hard to repeat.` },
  ],
};

module.exports = { business, history, industry, tailwind };
