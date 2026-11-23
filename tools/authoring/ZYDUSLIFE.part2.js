// Zydus Lifesciences report, part 2: what the company does, history and corporate actions, industry, tailwind test.
const X = require('./ZYDUSLIFE.ctx');
const { C, D, SA, SQ, Q1, FY26, n0, n1, pc, rup } = X;
const f26 = SA.find(a => a.fy === 'FY26'), f22 = SA.find(a => a.fy === 'FY22');
const sh = v => `${n1(v / f26.revenue * 100)}%`;

const business = {
  id: 'business', nav: 'What Zydus does', kicker: 'Company', title: 'Four businesses: US generics, India brands, international markets and consumer, plus a new MedTech arm',
  blocks: [
    { p: 'Zydus Lifesciences (Cadila Healthcare until 2022) is the Patel family\'s pharmaceutical group from Ahmedabad. It has ~30,000 employees, 44 manufacturing sites (India, the US, France, the UK, Brazil, Myanmar) and ten R&D centres with 1,500+ scientists. It reports three segments: Pharmaceuticals (₹22,412 cr of FY26 revenue), Consumer Products, i.e. its 57.59%-owned listed subsidiary Zydus Wellness (₹3,954 cr), and Medical Technologies, mostly Amplitude Surgical of France (₹782 cr). Inside pharma, the money is made in three markets.' },
    { exhibit: { type: 'table', title: 'FY26 revenue by business and what drives each', head: ['Business', 'FY26 (₹ cr)', 'Share', 'Q1FY27 growth', 'What it is'], wide: [4], rows: [
      ['**North America formulations**', n0(f26.na), sh(f26.na), pc((Q1.na / Q1.naPrior - 1) * 100), `US generics (#3 by prescriptions; 274 products; oral solids, injectables, transdermals) plus a young branded arm: rare disease (Sentynl), 505(b)(2) products, Rolvedon from Q2FY27. US$${f26.naUsd} mn in FY26; US$${Q1.naUsd} mn in Q1FY27.`],
      ['**India formulations**', n0(f26.india), sh(f26.india), pc((Q1.india / Q1.indiaPrior - 1) * 100), '#1 in oncology; cardio-diabetes, respiratory, pain, gynaecology, nephrology; in-house NCEs (Lipaglyn, Oxemia), biosimilars (16 approved), vaccines, semaglutide. 7,000+ reps, 54% chronic.'],
      ['**International markets**', n0(f26.im), sh(f26.im), pc((Q1.im / Q1.imPrior - 1) * 100), 'Branded generics in emerging markets (Mexico, Philippines, Sri Lanka, Myanmar, South Africa, Brazil) and generics in France, Spain and the UK.'],
      ['**Consumer Wellness**', n0(f26.consumer), sh(f26.consumer), pc((Q1.consumer / Q1.consumerPrior - 1) * 100), 'Zydus Wellness: Sugar Free, Glucon-D, Complan, Everyuth, Nycil, Nutralite, RiteBite; Comfort Click (UK digital vitamins) since Aug-2025.'],
      ['**MedTech**', n0(f26.medtech), sh(f26.medtech), 'n.m.', 'Amplitude Surgical (hip and knee implants, ~EUR100 mn revenue, from Jul-2025), stents in India, a dialyser-membrane plant being built.'],
      ['APIs, alliances, other operating revenue', n0(f26.api + f26.alliances + f26.otherOp), sh(f26.api + f26.alliances + f26.otherOp), pc((Q1.api / 157.5 - 1) * 100), 'API sales to third parties; JV/alliance income; export incentives and licence income.'],
      { hl: true, cells: ['**Total**', `**${n0(f26.revenue)}**`, '100%', `**${pc((Q1.revenue / Q1.revenuePrior - 1) * 100)}**`, ''] },
    ], source: 'Q4FY26 presentation; Q1FY27 release; Aug-2026 corporate presentation; AR FY26 note 44' } },
    { pair: [
      { type: 'stacked', title: 'Quarterly revenue by business: Consumer and MedTech jumped with acquisitions', unit: '₹ crore', x: SQ.map(q => q.q), series: [{ name: 'North America', values: SQ.map(q => q.na), fmt: 'num' }, { name: 'India', values: SQ.map(q => q.india), fmt: 'num' }, { name: 'International', values: SQ.map(q => q.im), fmt: 'num' }, { name: 'Consumer', values: SQ.map(q => q.consumer), fmt: 'num' }, { name: 'MedTech', values: SQ.map(q => q.medtech || 0), fmt: 'num' }], minLabel: 900, source: 'Company releases; MOSL and PL KPI tables' },
      { type: 'column', title: 'FY26 segment profit: pharma earns almost everything', unit: 'Segment profit before exceptional items and tax (₹ crore)', x: ['Pharmaceuticals', 'Consumer Products', 'Medical Technologies'], series: [{ name: 'FY26', values: [FY26.segments.pharmaResult, FY26.segments.consumerResult, FY26.segments.medtechResult], fmt: 'num' }], labels: 'all', source: 'AR FY26 consolidated note 44' },
    ] },
    { callout: '**So what:** Zydus is still a pharma company that happens to own consumer brands and an orthopaedics business. Pharma produced ₹7,049 cr of segment profit in FY26; Consumer ₹267 cr (after acquisition interest and amortisation at Zydus Wellness, of which Zydus owns 57.59%) and MedTech a ₹178 cr loss. Branded businesses are now more than 55% of revenue and management wants two-thirds; that mix shift, not the US, is the long-term story.' },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'Seven decades, four eras: Indian brands, US generics, the windfall years, and the buying spree',
  blocks: [
    { p: 'Zydus\'s numbers make sense only against the eras that shaped them. Each era left a mark on the statements: the consumer goodwill from 2019, the FY22 sale gain, the FY23-FY26 windfall margins and the FY26-27 jump in debt, amortisation and minorities.' },
    { exhibit: { type: 'table', title: 'Corporate actions and what they did to the numbers', head: ['When', 'What happened', 'Impact on the numbers'], wide: [1, 2], rows: [
      ['1952-1995', 'Ramanbhai B. Patel co-founds Cadila Laboratories (1952); the Patel family\'s business is incorporated as Cadila Healthcare in 1995.', 'An India-first branded generics company.'],
      ['2000s-2010s', 'Builds a US generics business (now 274 products, #3 by prescriptions) and buys Sentynl Therapeutics in the US (Jan-2017).', 'North America became the largest market.'],
      ['2019', 'Zydus Wellness buys Heinz India (Complan, Glucon-D, Nycil).', 'Most of today\'s ₹4,966 cr consumer goodwill; Zydus Wellness minorities.'],
      ['FY22', 'Sells the animal-health business; renames itself Zydus Lifesciences; launches generic Revlimid under a volume-limited settlement (Mar-2022).', 'Reported FY22 EPS ₹43.8 vs ₹20.8 before the gain. gRevlimid lifts FY23-FY26 margins.'],
      ['FY23-FY24', 'Buybacks: 11.5 mn shares at ₹650 (Jul-2022), 6.0 mn at ₹1,005 (Mar-2024). Buys LiqMeds (UK oral liquids, GBP68 mn, Oct-2023).', 'Share count 102.4 cr → 100.6 cr. Liquid-orals goodwill ₹545 cr; contingent-consideration unwinding in finance cost.'],
      ['FY25', 'Record margin (30.4%); generic Myrbetriq becomes a big product; net cash ₹4,888 cr at Mar-25.', 'Brazil goodwill and a product intangible written off (₹220 cr exceptional).'],
      ['FY26', 'Amplitude Surgical (₹2,570 cr, Jul-2025), Comfort Click via Zydus Wellness (₹2,877 cr, Aug-2025), Agenus biologics plants (₹1,080 cr, Jan-2026), Mirabegron settlement with Astellas (US$45 mn + US$75 mn licence, Feb-2026); gRevlimid ends.', 'Revenue +17%, EBITDA margin 31.2% incl. ₹1,198 cr forex gains; D&A +54%, interest 2.6x; borrowings ₹3,213 cr → ₹12,496 cr; exceptional ₹517 cr.'],
      ['Q1FY27', 'Buyback of 8.73 mn shares at ₹1,260 (₹1,100 cr, Jun-2026); Assertio Holdings (US$166.4 mn, 16-Jun-2026); Saroglitazar NDA filed (priority review).', 'Shares 100.62 cr → 99.75 cr; net debt ₹5,904 cr; Rolvedon from Q2FY27.'],
    ], source: 'AR FY26 (notes 30, 48, 54, 55; buyback history); company presentations and calls; Business Standard (Sentynl, 2017); Outlook Business (LiqMeds, 2023)' } },
    { exhibit: { type: 'table', title: 'Acquisitions since 2023: price, consolidation and funding', head: ['Deal', 'Completed', 'Price', 'Consolidated', 'Funding'], wide: [3], rows: C.acquisitions.filter(a => !/Sentynl/.test(a.deal)).map(a => [`**${a.deal}**`, a.date, a.price, a.consolidated, a.funding]), source: 'AR FY26 notes 5, 49, 54 and 55; company calls; Medical Dialogues (Assertio, Jun-2026)' } },
  ],
};

const IPM = D.industry.ipm, ZI = D.industry.zydusIndia, US = D.industry.usGenerics;
const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Two different industries: a 10%-growth Indian brand market and a price-taking US generics market',
  blocks: [
    { p: `**India.** The Indian pharmaceutical market (IPM) grew ${IPM[0].valueGrowthPct}% in FY25 with volumes up only ${IPM[0].volumeGrowthPct}%: growth comes from price and new products, not more pills. It sped up in FY26 and 2026 (${IPM[1].valueGrowthPct}% in Mar-2026, ${IPM[2].valueGrowthPct}% in Aug-2026), and Pharmarack raised its 2026 forecast to ${IPM[3].valueGrowthPct}%. Chronic therapies (cardiac, diabetes, oncology) grow faster than acute. Zydus's chronic sales grew ${ZI.chronicGrowthZydus}% against ${ZI.chronicGrowthIpm}% for the market (MAT Jun-2026). Price controls and trade generics cap the upside; differentiated launches (biosimilars, new molecules, semaglutide after patent expiry in Mar-2026) are where share is won.` },
    { p: `**US generics.** The US is the world's largest generics market but a price-taker business: buyer consortia force prices down every year and profits come from a few products with limited competition. Zydus's prescriptions grew ${US.zydusTrxCagr4y}% a year over four years against ${US.industryTrxCagr4y}% for the market, and it ranks #${US.zydusRankRx}. But the profit pool of FY23-FY26 came from gRevlimid and generic Myrbetriq. The industry is also moving into biosimilars (Zydus launched ranibizumab in Q1FY27) and 505(b)(2) specialty products, where competition is thinner.` },
    { p: `**Consumer health and medtech.** India's packaged-wellness categories (sugar substitutes, glucose powder, health drinks, skin care) are growing with modern trade and e-commerce (38% of Zydus Wellness sales); European digital vitamins (Comfort Click) grew 25-31% like-for-like. Orthopaedic implants in Europe grow low-to-mid single digits with periodic French price cuts (3-4% in FY26).` },
    { h: 'Three tailwinds' },
    { bullets: [
      '**India chronic and specialty:** an ageing, diabetic population, government cancer schemes and first-wave biosimilars. Zydus is #1 in oncology and has two in-house NCEs on the market.',
      '**The rupee:** ₹88.3/US$ on average in FY26, ₹95.81 on 30-Sep-2026. About 55% of revenue is earned abroad, so a weaker rupee lifts reported sales and margins (₹1,198 cr of forex gains in FY26 EBITDA).',
      '**US specialty and biosimilars:** a changing FDA framework for biosimilars and Medicare Part B oncology access (Rolvedon) give mid-sized companies a way past plain generics.',
    ] },
    { h: 'And three headwinds' },
    { bullets: [
      '**The end of limited-competition windfalls:** gRevlimid volume limits ended in Jan-2026; generic Myrbetriq competition grows; price erosion in the US base business is single-digit a year.',
      '**Regulation:** USFDA inspections can block launches (Zydus\'s Jarod injectables site was cleared only after its Sep-2025 inspection); India\'s price controls and trade-generic growth limit pricing.',
      '**US policy and litigation:** tariffs on pharmaceuticals were debated in 2025-26; Zydus is a defendant in the US generic price-fixing bellwether trials (2026-2028).',
    ] },
  ],
};

const tailwind = {
  id: 'tailwinds', nav: 'Tailwind test', kicker: 'Does the tailwind reach Zydus?', title: 'Tailwind test: Zydus captures the India and rupee tailwinds; the US windfalls are fading',
  blocks: [
    { p: 'A sector tailwind helps a shareholder only if the company captures it and keeps the profit. We score each driver.' },
    { verdicts: [
      ['India chronic and oncology growth', 'Yes', 'India +20% in Q1FY27 vs IPM ~10-11%; chronic 54.2% of sales; #1 in oncology; 78 brands above ₹25 cr.', 'The clearest structural win; ~24% of revenue.'],
      ['Biosimilars and NCEs in India', 'Yes', 'World\'s first nivolumab biosimilar (Tishtha), first Indian aflibercept (Anyra); Lipaglyn/Bilypsa ₹481 cr MAT; desidustat.', 'High-margin, defensible for a few years.'],
      ['Semaglutide off patent (India, Mar-2026)', 'Partly', 'Three own brands plus Lupin and Torrent co-marketing; "a small contributor" (Aug-2026).', 'Crowded market; volume yes, profit pool uncertain.'],
      ['Weaker rupee', 'Yes', '₹1,198 cr of operating forex gains in FY26; US sales of ~US$1.3 bn translate at ₹95-96 instead of ₹88.', 'Cyclical: it can reverse; we do not capitalise forex gains.'],
      ['US generics volume growth', 'Partly', '#3 by prescriptions, 6% TRx CAGR, but price erosion; US sales flat in US$ after gRevlimid.', 'Scale without pricing power.'],
      ['US limited-competition launches', 'No', 'gRevlimid ended; Mirabegron now licensed and contested; next big one (palbociclib) uncertain.', 'The FY23-26 profit engine is being replaced, not repeated.'],
      ['US specialty / biosimilars', 'Partly', 'Rare disease ~US$60 mn, 505(b)(2) ~US$60-70 mn, Rolvedon US$60-80 mn a year; Saroglitazar from FY28; biosimilars from CY29.', 'Real but early; requires spending before revenue.'],
      ['Consumer wellness premiumisation', 'Partly', 'Skin care +35-40%, Comfort Click +25%, but seasonal brands fell; segment profit fell to ₹267 cr.', 'Revenue captured, profit not yet.'],
    ], head: ['Tailwind', 'Captured?', 'Evidence', 'So what'], title: 'Tailwind scorecard: three captured, four partly, one fading', source: 'Company presentations and calls; Pharmarack; GAM Research' },
    { callout: '**Our view:** the tailwinds Zydus captures (India, biosimilars, the rupee) are worth a premium, but together they are smaller than the US windfalls that are leaving. That is why we see EPS falling in FY27 and recovering only in FY29.' },
  ],
};

module.exports = { business, history, industry, tailwind };
