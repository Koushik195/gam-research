// Samvardhana Motherson report, part 2: what the company does, history and corporate actions, industry, tailwind
// test and competition.
const X = require('./MOTHERSON.ctx');
const { C, D, SG, A26, A25, n0, n1, pc } = X;
const I = D.industry, DV = C.profile.diversificationFY26;
const m = (e, r) => n1(e / r * 100) + '%';

const business = {
  id: 'business', nav: 'What SAMIL does', kicker: 'The business', title: 'A global parts assembler: five divisions, 425+ plants in 47 countries, no customer above 9%',
  blocks: [
    { p: 'Samvardhana Motherson International (SAMIL) makes the large, bulky and customised parts that car makers buy from suppliers: **wiring harnesses** (the car\'s nervous system), **bumpers, door panels, instrument panels and other plastic modules**, **rear-view mirrors and camera systems**, and it **assembles whole cockpits and front-ends** for European car makers. Since 2023 it has added "emerging businesses": lighting and electronics, elastomers, precision metal parts, and businesses outside cars (cover glass for consumer electronics, aircraft parts, logistics, medical devices). It runs 425+ facilities in 47 countries and almost every large car maker is a customer.' },
    { p: 'Two reporting quirks matter. First, SAMIL reports its divisions **including 100% of its joint ventures** ("economic revenue": ₹1,43,288 cr in FY26) and then deducts the JVs (₹17,184 cr) to get the reported ₹1,26,104 cr; JV profits come back below EBITDA as a ₹583 cr "share of profit". The biggest JV is its 33.43% of **Motherson Sumi Wiring India (MSWIL)**, the listed domestic harness business demerged in 2022. Second, Integrated Assemblies reports revenue **net** of the parts customers nominate, so its margins look high. "Gross revenue" in the Vision 2030 target (USD 22.9 bn in FY26) adds back those pass-through parts.' },
    { exhibit: { type: 'table', title: 'The divisions, FY26 (economic revenue incl. 100% of JVs, ₹ crore)', head: ['Division', 'Revenue', 'EBITDA', 'Margin', 'What it is'], wide: [4], rows: [
      ...C.profile.divisionsFY26.map(([nm, r, e, w]) => [`**${nm}**`, n0(r), n0(e), m(e, r), w]),
      ['Less: inter-segment', n0(A26.elimRev), n0(A26.elimEbitda), '–', ''],
      { hl: true, cells: ['**Economic revenue / EBITDA**', `**${n0(A26.econRev)}**`, `**${n0(A26.econEbitda)}**`, `**${m(A26.econEbitda, A26.econRev)}**`, 'Including 100% of JVs and associates'] },
      ['Less: equity-accounted JVs', n0(A26.jvRev), n0(A26.jvEbitda), m(-A26.jvEbitda, -A26.jvRev), 'MSWIL, Ningbo SMR Huaxiang, Marelli Motherson lighting, Kyungshin, others'],
      { hl: true, cells: ['**Reported (consolidated)**', `**${n0(A26.consRev)}**`, `**${n0(A26.consEbitda)}**`, `**${m(A26.consEbitda, A26.consRev)}**`, 'JV profit returns as ₹583 cr share of profit'] },
    ], source: 'Q4FY26 investor presentation (slide 32); AR FY26 note 48' } },
    { pair: [
      { type: 'hbar', title: 'Biggest customers: Volkswagen 9%, Mercedes 7%, Audi 7%', unit: '% of FY26 gross revenue (incl. JVs)', x: DV.customers.map(c => c[0]), series: [{ name: 'Share', values: DV.customers.map(c => c[1]), fmt: 'pct0' }], labels: 'all', source: 'Q4FY26 presentation slide 20' },
      { type: 'hbar', title: 'Where it makes things: India 22%, USA 17%, Germany 15%', unit: '% of FY26 gross revenue, by manufacturing location', x: DV.countries.map(c => c[0]), series: [{ name: 'Share', values: DV.countries.map(c => c[1]), fmt: 'pct0' }], labels: 'all', source: 'Q4FY26 presentation slide 20' },
    ] },
    { callout: '**So what:** SAMIL is a diversified bet on global car production, not on India. About three quarters of its revenue is made outside India, Europe is the largest region, and the German premium brands (VW group incl. Audi and Porsche, Mercedes, BMW) are close to a third of the business. Its "3CX10" rule (no customer, country or component above 10%) is nearly met; only wiring harness (25% of revenue) and India (22%) exceed it.' },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'Forty years of buying distressed suppliers and fixing them; a 2022 reorganisation that changed the share count',
  blocks: [
    { p: 'Vivek Chaand Sehgal set up Motherson Sumi Systems with Sumitomo Wiring Systems in 1986 to make harnesses for Maruti. The group grew by buying European suppliers in trouble (Visiocorp mirrors in 2009, Peguform plastics in 2011, PKC truck harnesses in 2017, Reydel interiors in 2018) and turning them round. In January 2022 the structure was simplified: the Indian harness business went to a new listed company (MSWIL) and the promoters\' SAMIL, which owned the other 49% of the mirror and plastics arms, was merged in. Since then: two 1:2 bonus issues, an equity raise, and a burst of acquisitions, many of them asked for by customers.' },
    { exhibit: { type: 'table', title: 'Corporate actions and what they did to the numbers', head: ['When', 'What', 'Impact on the numbers', 'Source'], wide: [1, 2], rows: C.history.map(r => [r[0], r[1], r[2], r[3]]) } },
    { callout: '**For the history charts:** Screener restates EPS for both bonus issues, so EPS is comparable over time; but before FY22 the company owned only 51% of SMRP BV (large minorities) and included the domestic harness business, so FY15-FY22 profit is not like-for-like with today. That is why we start the valuation history at the January 2022 reorganisation.' },
  ],
};

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'A flat global car market, costly inputs, a weak rupee and a consolidating supplier base',
  blocks: [
    { bullets: [
      `**Production is not growing.** ${I.production.what}`,
      `**Inputs spiked in 2026.** ${I.commodities.what}`,
      `**Currency flatters rupee growth.** ${I.fx.what}`,
      `**Europe is the problem region.** ${I.europe.what}`,
      `**Consolidation is the opportunity.** ${I.consolidation.what}`,
    ] },
    { pair: [
      { type: 'line', title: 'The euro went from ₹90 to ₹110 in two years', unit: 'INR per EUR, quarter average', x: X.QL, series: [{ name: 'INR/EUR', values: X.SQ.map(q => q.inrEur), fmt: 'n1' }, { name: 'INR/USD', values: X.SQ.map(q => q.inrUsd), fmt: 'n1' }], labels: 'ends', min: 75, max: 115, source: 'SAMIL presentations (Q4FY26 value from the Q4FY26 deck)' },
      { type: 'column', title: 'Copper: USD9,519/t to USD13,324/t in a year', unit: 'LME copper, USD per tonne (quarter average)', x: ['Q1FY26', 'Q4FY26', 'Q1FY27'], series: [{ name: 'Copper', values: [9519, 12852, 13324], fmt: 'num' }], labels: 'all', source: 'Q1FY27 presentation slide 24' },
    ] },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Do the sector tailwinds reach SAMIL? Content and India yes; volume growth in its main market, no',
  blocks: [
    { exhibit: { type: 'table', title: 'Four tailwinds, tested', head: ['Tailwind', 'Evidence it is real', 'Does it reach SAMIL?', 'Catch'], wide: [1, 3], rows: [
      ['Premiumisation and EVs raise content per car', 'Bigger cars and EVs need more harness, mirrors and plastics (MOSL: EV harness content 2.4x ICE)', 'Yes: 22% of the USD96 bn booked business is pure EV programmes', 'EV launches in Europe have disappointed; SAMIL restructured plants built for EV volumes that did not come'],
      ['India growth', 'India LV production +12.8%, CV +16.2% in Q1FY27', 'Partly: India is 22% of revenue, much of it via JVs (MSWIL, Marelli lighting) that sit below EBITDA', 'Copper inflation hurt the India harness business most (rupee depreciation)'],
      ['Supplier distress and consolidation', '15 acquisitions since Sep-2022; Nexans and Yutaka in Jul-2026', 'Yes: revenue grows ~10% a year from deals alone', 'Bought businesses start at 4-7% EBITDA margins and need restructuring'],
      ['Non-auto diversification', 'Consumer electronics 7.5x revenue in FY26; aerospace order book USD1.6 bn', 'Starting to: non-auto ~3% of booked business', 'Heavy capex (₹7,500 cr) into one customer programme with undisclosed terms'],
    ], source: 'Q4FY26 and Q1FY27 presentations and calls; MOSL (6-Aug-2026); GAM Research' } },
    { callout: `**Verdict:** the tailwinds that reach SAMIL are content and consolidation, not volume. We estimate FY27E reported revenue growth of {{F.salesGrowth.0|pct}}, of which ~${n1(X.organic27)}% is "organic" in rupees (incl. currency and copper pass-through) and the rest the two acquisitions. Strip out a ~10% weaker rupee and Modules & Polymer Products, the biggest division, shrank in Q1FY27 in euro terms.` },
  ],
};

const competition = {
  id: 'competition', nav: 'Competition', kicker: 'Competition', title: 'Competition: global giants in every division; SAMIL wins on breadth, cost and willingness to buy',
  blocks: [
    { p: 'In each product SAMIL faces specialist global suppliers: in wiring harnesses Yazaki, Sumitomo Wiring Systems (its own 9.4% shareholder), Aptiv, Lear and Leoni; in exterior and interior plastics Forvia, OPmobility (Plastic Omnium), Magna and Toyota Boshoku; in mirrors Gentex and Ficosa; in cockpit assembly the OEMs themselves. SAMIL is rarely the technology leader. Its edge is that it does many of these parts for the same customer, from low-cost plants, and that customers trust it to take over a failing supplier without disrupting their lines. In India it competes with Uno Minda, Bosch and others; most listed Indian peers trade at higher multiples because they grow faster from a domestic base.' },
    { exhibit: { type: 'table', title: 'Listed Indian auto-component peers on 30-Sep-2026', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'Trailing P/E (x)', 'ROE'], rows: X.PEERS.map(p => [p.symbol === 'MOTHERSON' ? '**Samvardhana Motherson**' : X.shortName(p.symbol), n0(p.mcapCr), p.revenue ? n0(p.revenue) : 'n.a. (Dec year)', p.ebitdaMargin != null ? p.ebitdaMargin + '%' : '–', n1(p.pe), p.roe != null ? p.roe + '%' : '–']), source: `Screener.in; prices at the NSE close on ${X.ASOF_TXT}. SAMIL's revenue is the largest by far; its ROE is the lowest.` } },
    { callout: '**Our read:** SAMIL is the scale player in a fragmented global industry. Scale buys it customer access and purchasing power, not pricing power: its EBITDA margin (9-10%) is near the bottom of the table (only MSWIL and Gabriel are lower) and its ROE is the lowest.' },
  ],
};

module.exports = { business, history, industry, tailwind, competition };
