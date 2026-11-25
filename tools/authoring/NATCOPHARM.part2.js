// Natco Pharma report, part 2: what the company does, history & corporate actions, industry, tailwind test.
const X = require('./NATCOPHARM.ctx2');
const { C, D, SA, SQ, FY26, Q1, BL, n0, n1, A, ix } = X;
const s26 = SA.find(a => a.fy === 'FY26'), s22 = SA.find(a => a.fy === 'FY22'), s25 = SA.find(a => a.fy === 'FY25');
const pct = (a, t) => Math.round(a / t * 100);

const business = {
  id: 'business', nav: 'What Natco does', kicker: 'The business', title: 'What Natco does: picks fights over patents, sells the winners through partners, and has branched into India, Brazil, South Africa and pesticides',
  blocks: [
    { p: `Natco Pharma was founded in Hyderabad in 1981 by V.C. Nannapaneni, who still chairs it; his son Rajeev is Vice Chairman and CEO. It is a **niche generics** company: it looks for medicines that are hard to make or legally risky to copy, challenges the patents (a "para-IV" filing in the US), and, if it wins or settles, sells the generic with few competitors for a while. In the US it mostly works with partners (Teva, Mylan/Viatris, Breckenridge, Lupin, Dr. Reddy's, Sun) who market the drug and share litigation costs; Natco makes the product and takes a **profit share**. Total revenue was ₹${n0(FY26.totalRevenue)} cr in FY26 (revenue from operations ₹${n0(FY26.revenue)} cr) and profit ₹${n0(FY26.pat)} cr.` },
    { exhibit: { type: 'table', title: 'Natco in five businesses (FY26, ₹ crore)', head: ['Business', 'FY26 revenue', 'Share of total revenue', 'What it is', 'Q1FY27'], wide: [3], rows: [
      ['Export formulations', n0(s26.exports), `${pct(s26.exports, s26.total)}%`, `US ₹${n0(FY26.segments.us)} cr (profit shares and Natco Pharma USA, the front end bought in 2021), Brazil ₹${n0(FY26.segments.brazil)} cr, Canada ₹${n0(FY26.segments.canada)} cr, MENA/Asia tenders and China`, `₹${n0(Q1.exports)} cr (Brazil ₹178 cr, Canada ₹56 cr)`],
      ['Domestic formulations', n0(s26.domestic), `${pct(s26.domestic, s26.total)}%`, 'Branded generics in India: oncology (pioneer; 40+ brands), hepatology (Velpanat), cardiology (Apigat), diabetology (semaglutide from Mar-2026); ~900 field staff', `₹${n0(Q1.domestic)} cr (+27%)`],
      ['API', n0(s26.api), `${pct(s26.api, s26.total)}%`, 'Active ingredients for its own products and for sale (Mekaguda and Chennai; 45 active US DMFs; oncology, peptides)', `₹${n0(Q1.api)} cr`],
      ['Crop Health Sciences', n0(s26.chs), `${pct(s26.chs, s26.total)}%`, 'Agrochemicals in India since 2019: chlorantraniliprole (CTPR) and 34 other products; to be demerged', `₹${n0(Q1.chs)} cr (EBITDA loss)`],
      ['Other operating and non-operating income', n0(s26.other), `${pct(s26.other, s26.total)}%`, 'Interest on cash (₹231.5 cr), forex, licensing and export incentives', `₹${n0(Q1.totalRevenue - Q1.exports - Q1.domestic - Q1.api - Q1.chs)} cr`],
      { hl: true, cells: ['**Total revenue**', `**${n0(s26.total)}**`, '**100%**', '', `**₹${n0(Q1.totalRevenue)} cr**`] },
      ['Associate: Adcock Ingram (49%)', 'Equity-accounted', '–', 'South Africa\'s #2 pharma company (US$592 mn revenue, US$57 mn profit, year to Jun-2026); Natco books its share of profit below tax', `Share of profit ₹${n1(Q1.assocShare)} cr`],
    ], source: 'Q1FY27 investor presentation (segment table); AR FY26 MD&A and note 41; Q1FY27 call' } },
    { p: `Two things follow. First, Natco's profit has always been **lumpy**: a few exclusivity products (Copaxone and Tamiflu generics in 2016-18, Revlimid in 2022-26) made most of the money for a few years each. Second, the base underneath (India, Brazil, Canada, APIs, a US front end) is small: domestic formulations were ₹${n0(s26.domestic)} cr in FY26 against ₹${n0(s22.domestic)} cr in FY22. Management's stated aim is to flip the mix so the base makes ~70% of profit and first-to-file products 25-30%; "earlier, the ratio was the other way around" (CEO, 29-May-2026).` },
    { callout: `**So what:** an investor in Natco buys a portfolio of patent bets plus a modest branded base, with ~${n1(X.assocPct[0])}% of FY27E profit coming from a South African company it does not control. Value depends on how many bets pay off and how management spends the cash in between.` },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'History: four decades of patent fights, three jackpots, and the first big acquisition in 2025',
  blocks: [
    { exhibit: { type: 'table', title: 'Milestones and what they did to the numbers', head: ['Year', 'Event'], wide: [1], rows: C.history.map(([y, e]) => [y, e]), source: 'Q1FY27 investor presentation (company evolution); AR FY24-FY26; FDA warning-letter and close-out pages; FiercePharma (Dec-2015) for the Revlimid settlement' } },
    { p: 'The corporate actions that matter for today\'s numbers: (1) the Dec-2015 Revlimid settlement gave Natco a volume-limited US licence from Mar-2022 and full entry from 31-Jan-2026, which is the whole FY23-FY26 hump; (2) the FY23-FY24 open-market buyback of 3.45 mn shares took the count to 179.11 mn, unchanged since; (3) Adcock Ingram, 35.75% in Nov-2025 and 49% from Jul-2026, equity-accounted; (4) the board-approved demerger of Crop Health Sciences (pending approvals; ~Mar-2027); (5) the rights issue set on 25-Sep-2026 (₹750 a share, 2 for 21, record date 1-Oct-2026), which will lift the share count to ~196.2 mn in Oct-2026.' },
    { callout: '**Track record of the big bets:** Revlimid paid off hugely; the Tamiflu and Copaxone generics (2016-17) lifted EPS from ₹9 (FY16) to ₹37 (FY18) before it faded to ₹25 (FY20); the hepatitis-C launches (sofosbuvir, 2015) lifted the India business, which then shrank from ₹540 cr (FY20) to ₹375 cr (FY23); Crop Health has taken six years to reach ₹138 cr of sales and still loses money in some quarters. The pattern is a few large wins, several small ones and long gaps.' },
  ],
};

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Industry: US first-to-file windfalls are getting rarer; emerging markets and Indian GLP-1s are crowded but growing',
  blocks: [
    { p: `**US generics.** ${D.industry.usGenerics.text} ${D.industry.usFilerReality.text}` },
    { p: `**India.** ${D.industry.indiaGlp1.text} Natco's own India business is small (₹${n0(s26.domestic)} cr, FY26) and was flat for years before semaglutide.` },
    { p: `**Emerging markets.** Brazil, Canada and South Africa are markets where generics are sold under company brands or via tenders; registration takes 18-24 months, so new entrants need years or an acquisition. ${D.industry.southAfrica.text}` },
    { p: `**Crop protection.** ${D.industry.cropProtection.text}` },
    { h: 'Two tailwinds' },
    { bullets: [
      '**GLP-1 genericisation:** semaglutide is off patent in India (Mar-2026) and in more emerging markets in 2026-27; in the US, Natco is a sole first-to-file on some strengths of Ozempic and Wegovy (partner Mylan/Viatris), though launch is years away.',
      '**Weaker rupee:** most of Natco\'s revenue is earned in dollars, reais, Canadian dollars and (via Adcock) rand.',
    ] },
    { h: 'And three headwinds' },
    { bullets: [
      '**Fewer windfalls:** most new US filings now face 8-20 day-one filers; Natco made no major new first-to-file in FY26.',
      '**Price wars in India:** 10-15 semaglutide generics; Natco\'s own brand sells ~₹2 cr a month and "doesn\'t make much money".',
      '**Regulation and tariffs:** US tariff talk on generics and USFDA inspections (Visakhapatnam due); input costs up 25-30% for agrochemicals after the West Asia war.',
    ] },
  ],
};

const tailwind = {
  id: 'tailwinds', nav: 'Tailwind test', kicker: 'Does the tailwind reach Natco?', title: 'Tailwind test: Brazil and India reach it; GLP-1s barely; the US windfall has gone',
  blocks: [
    { p: 'A sector tailwind helps a shareholder only if the company captures it and keeps the profit. We score each driver.' },
    { verdicts: [
      ['Indian GLP-1 (semaglutide)', 'Partly', `First generic vial on day one; brand ~₹2 cr a month plus partners Eris and Glenmark; ₹75-100 cr annualised targeted; "cutthroat" pricing.`, 'Adds ~₹4 cr a month of sales at thin margins.'],
      ['Brazil oncology launches', 'Yes', 'Brazil ₹287.5 cr in FY26; ₹178 cr in Q1FY27 (+180%); single source for everolimus four years running; US$55-60 mn guided for FY27.', 'The fastest-growing piece of the base; tender-driven and lumpy.'],
      ['Canada', 'Yes, slowly', `₹${n0(FY26.segments.canada)} cr in FY26; top-10 generic company; +10-15% guided; big launches only in FY28.`, 'Steady, small.'],
      ['South Africa (via Adcock)', 'Partly', '49% of the #2 player; profit ~₹100 cr a quarter (₹242 cr in the Apr-Jun flu season); Natco products only from ~2028.', 'Earnings are real but not controlled; return ~7% on cost today.'],
      ['US limited-competition generics', 'No (FY27)', 'Lenalidomide "negligible"; pomalidomide launched with 4-5 generics; carfilzomib and two unnamed exclusivities from FY28.', 'The engine of past profits is idle for a year at least.'],
      ['Crop protection', 'Not yet', `CHS ₹${n0(s26.chs)} cr in FY26 (₹59.8 cr in FY25); EBITDA loss in Q1FY27; breakeven targeted.`, 'To be demerged; small either way.'],
      ['Weaker rupee', 'Yes', 'Exports ~74% of FY26 total revenue; Adcock profits in rand.', 'Cyclical.'],
    ], head: ['Tailwind', 'Captured?', 'Evidence', 'So what'], title: 'Tailwind scorecard: two captured, three partly or slowly, two not yet', source: 'Company calls (Feb, May and Aug-2026) and presentations; GAM Research' },
    { callout: '**Our view:** the tailwinds Natco captures (Brazil, India, the rupee, Adcock) together replace perhaps a third of the profit gRevlimid made at its peak. The rest has to come from new US exclusivities, which the company cannot name and which we model from FY28 at a modest size.' },
  ],
};

module.exports = { business, history, industry, tailwind };
