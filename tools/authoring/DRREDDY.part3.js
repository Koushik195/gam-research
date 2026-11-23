// Dr. Reddy's report, part 3: North America after gRevlimid, semaglutide and peptides, biosimilars and the USFDA record.
const X = require('./DRREDDY.ctx');
const { C, D, SA, SQ, QL, Q1, FY26, F, bld, BL, n0, n1, pc, rup } = X;
const f26 = SA.find(a => a.fy === 'FY26'), q = Q1.ifrs;
const yrs = ['FY26', ...F.years], memo = BL.memo;

const us = {
  id: 'us', nav: 'North America after gRevlimid', kicker: 'North America', title: 'North America: the gRevlimid cliff has happened; the base is ~US$950 mn a year and barely growing',
  blocks: [
    { p: `North America was ₹${n0(f26.na)} cr (US$1.30 bn) in FY26, down 22%, and US$${q.naUsdMn} mn in Q1FY27, down 41% YoY. The reason is one product. **Generic Revlimid** (lenalidomide, a blood-cancer drug) was sold from FY23 under settlements that capped every generic maker's volumes; the caps ended in Jan-2026 and prices fell. Dr. Reddy's sales fell from US$400 mn a quarter (Q1FY26) to US$338 mn (Q3) and US$251 mn (Q4, before a ₹453 cr, ~US$50 mn shelf-stock adjustment that a customer claimed for stock it held when prices dropped; the CEO said "we were also surprised by that"). The company never disclosed lenalidomide's sales. What is left is a US generics base that an IIFL analyst put at ~US$1 bn in FY22 and ~US$950 mn annualised now despite 90-100 launches and the Mayne portfolio; the CEO agreed: "if you take out product like lenalidomide, your analysis is correct".` },
    { pair: [
      { type: 'column', title: 'US$ sales: US$400 mn a quarter in Q1FY26, US$236 mn in Q1FY27', unit: 'North America revenue (US$ mn a quarter; Q4FY26 after the ~US$50 mn SSA)', x: QL, series: [{ name: 'US$ mn', values: SQ.map(s => s.naUsd), fmt: 'num' }], labels: 'all', source: 'Company calls (Q2FY26-Q1FY27); Q1FY26 implied from the -41% YoY in Q1FY27' },
      { type: 'column', title: 'Annual: from US$1.0 bn (FY22) to US$1.72 bn (FY25) and back', unit: 'North America revenue (US$ mn; FY27-29E GAM)', x: [...SA.map(a => a.fy), ...F.years], series: [{ name: 'US$ mn', values: [...SA.map(a => a.naUsd), ...BL.naUsdMn], fmt: 'num' }], labels: 'all', source: 'MOSL 23-Jul-2026 (FY21-FY25, average rates); company (FY26); GAM estimates' },
    ] },
    { h: 'What has to rebuild it' },
    { exhibit: { type: 'table', title: 'North America growth levers and their size', head: ['Lever', 'Status by 30-Sep-2026', 'Size', 'Our view'], wide: [1, 3], rows: [
      ['Base generics', '76 ANDAs pending (45 Para IV, 24 possible first-to-file); 27 launches targeted in FY27, 6 in Q1; price erosion "moderate"', '~US$950 mn a year; "double-digit growth ex-lenalidomide" guided for FY27', 'Launches offset erosion; we assume roughly flat dollars beyond FY27.'],
      ['Bosutinib 400mg', 'First to market, 180-day exclusivity, launched Jun-2026 (two weeks of sales in Q1)', 'Brand ~US$300 mn; margin above company average', 'A FY27 boost that fades in FY28.'],
      ['Sugammadex 200mg', 'First-to-market generic launched 28-Jul-2026', 'Not disclosed ("tens of millions of dollars" for a Q2 launch)', 'Helpful; more entrants likely.'],
      ['Semaglutide in Canada', 'First generic approval and launch in Q1FY27; supplies halted 9-Jul-2026; restart targeted Nov-2026', 'Most of the 6-7 mn pens guided for Nov-Mar', 'We assume ~US$70 mn in FY27E and ~US$120 mn in FY28E.'],
      ['Abatacept biosimilar (US)', 'IV BLA goal date mid-Dec-2026; SC around Feb/Mar-2028', 'Orencia is ~50:50 IV/SC in the US', 'We assume US$5 / 80 / 180 mn in FY27-29E.'],
      ['US tariff on generics', 'Announced 22-Jul-2026 with a two-year window (per the announcement)', '25-30% of US sales already made by US CMOs', 'Not in our numbers; a risk to the rest.'],
    ], source: 'Q1FY27 release, presentation and call; Q4FY26 call; sugammadex launch release (28-Jul-2026)' } },
    { pair: [
      { type: 'column', title: 'Our North America path: ₹10,134 cr in FY27E, ₹12,935 cr in FY29E', unit: 'North America revenue (₹ crore)', x: yrs, series: [{ name: 'North America', values: [f26.na, ...bld.map(r => Math.round(r.na))], fmt: 'num' }], labels: 'all', source: `GAM estimates: US${BL.naUsdMn.map(n0).join(' / ')} mn at ₹${BL.fx.join(' / ')} per US$` },
      { type: 'column', title: 'North America falls to ~30% of revenue by FY29E (34% in FY26)', unit: 'North America as % of revenue (IFRS)', x: yrs, series: [{ name: 'Share', values: [Math.round(f26.na / f26.revenue * 1000) / 10, ...bld.map((r, i) => Math.round(r.na / X.ifrsRev[i] * 1000) / 10)], fmt: 'pct' }], labels: 'all', source: 'AR FY26; GAM estimates' },
    ] },
    { callout: `**Our view:** management's "double-digit growth ex-lenalidomide" is plausible for FY27 thanks to two first-to-market launches and the weaker rupee, but the base it grows from is smaller than the street hoped (Emkay: "closer to our bear case", ~US$900 mn). We model US$${n0(BL.naUsdMn[0])} mn in FY27E (MOSL US$1,066 mn), US$${n0(BL.naUsdMn[1])} mn in FY28E and US$${n0(BL.naUsdMn[2])} mn in FY29E, with Canada semaglutide and abatacept providing almost all of the growth. Without them North America would be flat in dollars.` },
  ],
};

const sema = {
  id: 'semaglutide', nav: 'Semaglutide & peptides', kicker: 'The GLP-1 bet', title: 'Semaglutide: first to market in Canada and India, then an API failure; 6-7 mn pens promised for Nov-Mar',
  blocks: [
    { p: 'Semaglutide (Novo Nordisk\'s Ozempic/Wegovy molecule) is the largest generic opportunity of 2026-27 outside the US. Dr. Reddy\'s makes the peptide API itself by chemical synthesis (the originator uses recombinant DNA), which gives it cost and supply control, and fills pens through partners (OneSource). It was first to approval in India (Nov-2025; brand Obeda launched on the day the patent expired in Mar-2026) and in Canada (approval in Q4FY26, launch in Q1FY27), and has filed in ~30 countries of an 80-country programme. In May-2026 it guided ~12 mn pens for FY27 and 6-7 mn by Dec-2026.' },
    { p: 'Then, on 9-Jul-2026, it disclosed that an impurity in the API from a scaled-up process went out of specification in the finished product during validation. Supplies stopped. Management found the root cause, put the success odds of re-validation at "80% to 90%", targeted completion around 22-23 Sep-2026, and now expects 6-7 mn pens between Nov-2026 and Mar-2027 (backed by orders), not 10-11 mn. Q1FY27 carried a ₹240 cr provision for unusable inventory and costs; only ~180,000 pens were sold. The oral tablets (launched in India in Q1FY27) use a different API and are unaffected. A backup API supplier needs a prior-approval supplement, about a year away.' },
    { exhibit: { type: 'table', title: 'Semaglutide: what we know and what we assume', head: ['Item', 'Company (to 30-Sep-2026)', 'GAM assumption'], wide: [1, 2], rows: [
      ['Volume', 'May: ~12 mn pens in FY27; Jul: 6-7 mn in Nov-26 to Mar-27 (3-4 mn a quarter run-rate)', '~5 mn pens in FY27E (one more slip of a few weeks), ~15 mn in FY28E'],
      ['Price', 'List ~half of Novo\'s; net US$30+ typical, not below US$25; Canada list CAD78; "much more" in some markets', '~US$31 net in FY27E, falling ~15% a year as competitors arrive'],
      ['Revenue', 'Not guided', `₹${n0(memo.semaglutideRs[0])} / ${n0(memo.semaglutideRs[1])} / ${n0(memo.semaglutideRs[2])} cr in FY27-29E across North America, India, EM and PSAI`],
      ['Contribution', 'Margin accretive: "most of the cost associated with the peptide business is already in the cost base" (ICICI Direct)', '~60% in FY27-28E, ~55% in FY29E'],
      ['Competition', 'Canada: Apotex approved; a partner using Dr. Reddy\'s product approved; price already reflects 3+ players; Brazil approval expected "in the next few weeks" (Jul-2026)', 'More entrants in Canada through 2027; Brazil from H2FY27'],
      ['Capacity', 'API "north of 300" (up to 550 theoretically; units not given); FTO-11 cartridges in FY28; "it can be 40 mn" pens if demand exists', 'Not a constraint after re-validation'],
    ], source: 'Q4FY26 call (12-May-2026); semaglutide update call (9-Jul-2026); Q1FY27 call (22-Jul-2026); ICICI Direct 24-Jul-2026' } },
    { callout: `**Our view:** this is a good franchise hurt by a self-inflicted delay. The lost four months cost Dr. Reddy's its head start in Canada, where Apotex keeps selling while Dr. Reddy's and its partner wait for API. We include ₹${n0(memo.semaglutideRs[0])} cr of semaglutide revenue in FY27E and ₹${n0(memo.semaglutideRs[1])} cr in FY28E, below management's run-rate. If validation failed again (management gives it a 10-20% chance), FY27E EPS would fall by roughly ₹${n1(memo.semaglutideRs[0] * 0.6 * (1 - 0.24) / F.shares)} and the bear case becomes likely.` },
  ],
};

const bio = {
  id: 'biosimilars', nav: 'Biosimilars, pipeline & USFDA', kicker: 'Pipeline and compliance', title: 'Biosimilars: abatacept is the prize (goal date mid-Dec-2026); the biologics plant passed its first US approval in Aug-2026',
  blocks: [
    { p: 'Dr. Reddy\'s has spent years and much of its R&D budget on biosimilars (copies of biological drugs). Global biologics sales are only ~US$100 mn (about 2% of revenue) and not yet profitable. The pivot is **abatacept** (biosimilar Orencia, for rheumatoid arthritis): the intravenous (IV) version\'s BLA was accepted in Feb-2026 with a mid-December 2026 goal date, the subcutaneous (SC) version follows around Feb/Mar-2028 in the US. In June 2026 the FDA\'s pre-licence inspection of the Bachupally biologics plant (which covered abatacept and rituximab) ended with seven observations; on 1-Aug-2026 the FDA approved Dr. Reddy\'s **rituximab** biosimilar after that inspection. Management hopes for US$500-700 mn of biosimilar sales by FY29, "the lion\'s share" from abatacept.' },
    { exhibit: { type: 'table', title: 'Pipeline: what matters and when', head: ['Asset', 'Status by 30-Sep-2026', 'Value', 'Source'], wide: [1, 2], rows: C.pipeline.map(r => [r[0], rup(r[1]), rup(r[2]), r[3]]), source: 'Company calls, releases and presentations to Sep-2026' } },
    { exhibit: { type: 'table', title: 'USFDA inspection record, FY26 to Sep-2026', head: ['Site', 'Outcome', 'When', 'Source'], wide: [1], rows: C.fda, source: 'Company releases and calls; Medical Dialogues' } },
    { callout: `**Our view:** the rituximab approval is the most important regulatory fact of the quarter: it shows the Bachupally biologics site can pass an FDA pre-licence inspection, which de-risks abatacept's December goal date. We still model a slow ramp (US$${memo.abataceptUsdMn.join(' / ')} mn in FY27-29E), well below management's US$500-700 mn biosimilar hope for FY29, because the first Orencia biosimilar must win over rheumatologists and payers and the SC form (half the US market) comes only in 2028. Compliance is acceptable rather than strong: three Form 483s in 2025-26 but no warning letter or OAI.` },
  ],
};

module.exports = { us, sema, bio };
