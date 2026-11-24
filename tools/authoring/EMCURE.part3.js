// Emcure report, part 3: segment chapters (India, Europe & Canada, rest of world) and the moat scorecard.
const X = require('./EMCURE.ctx');
const { C, D, F, n0, n1, SA, SQ, QL, Q1, YRS, BL, build, mixPct, DEALS } = X;
const g = (k, i) => BL.growth[k][i];

const india = {
  id: 'india', nav: 'India', kicker: 'Segment: India (44%)', title: 'India: strong brands in iron, cardiac chirals and stroke; growth now leans on Sanofi, Novo and Roche brands while Zuventus recovers',
  blocks: [
    { p: `India revenue was ₹4,027 cr in FY26 (+10%): FY24 ₹3,144 cr, FY25 ₹3,660 cr (+16%, the first year of the Sanofi cardiac brands). Emcure's own franchise is built on products from its R&D (30-35% of India sales): the Orofer iron family (ferrous ascorbate and ferric carboxymaltose, #1 in iron combinations), chiral cardiac molecules (Metpure, Numlo, Asomex, "lower dose and better safety"), Tenectase (tenecteplase for stroke and heart attack, 100% share, ~24% CAGR FY22-26), Pause, Bevon and Maxtra. Women's health and cardio-metabolics are ~50% of India sales. On top sit in-licensed MNC brands (~15% of India sales): Sanofi's cardiac range (Cardace, Clexane, Lasilactone, Targocid, Lasix) since Mar-2024, its diabetes brands Amaryl and Cetapin since 2025, Novo Nordisk's Poviztra since Nov-2025 and Roche's nephrology/transplant brands from Apr-2026. Zuventus, the acute-focused subsidiary (₹1,041 cr revenue in FY26, −4%), is the weak spot: after the minority buyout (Oct-2025) and its founder-CEO's exit, a restructuring in Q4FY26 drove high attrition and India grew only 5.2% in the quarter.` },
    { pair: [
      { type: 'column', title: 'India revenue: +16% in FY25 (Sanofi), +10% in FY26', unit: 'India revenue (₹ crore); FY27-29E = GAM', x: [...SA.map(r => r.fy), ...YRS], series: [{ name: 'India', values: [...SA.map(r => r.india), ...build.india.map(Math.round)], fmt: 'num' }], labels: 'all', highlight: 'FY26', source: 'Company decks; GAM Research' },
      { type: 'hbar', title: 'Top brands lead their categories', unit: 'Value market share in category, FY26 (%)', x: ['Tenectase', 'Spegra', 'Metpure-XL', 'Orofer XT Liquid', 'Lasilactone (Sanofi)', 'Cardace (Sanofi)', 'Orofer XT', 'Orofer FCM'], series: [{ name: 'Share', values: [100.0, 98.8, 86.1, 79.5, 71.1, 56.8, 38.8, 23.2], fmt: 'pct' }], labels: 'all', source: 'Sep-2026 investor deck (IQVIA MAT Mar-2026; shares at sub-group level)' },
    ] },
    { exhibit: { type: 'table', title: 'India: what grows and what does not', head: ['Driver', 'Evidence', 'Our view'], wide: [1, 2], rows: [
      ['Own brands (women\'s health, cardiac, CNS)', 'Orofer XT double-digit, Orofer FCM back to growth, chiral cardiac and rosuvastatin brands ahead of market (AR FY26)', 'The core is healthy; growth ~market'],
      ['In-licensed (Sanofi, Roche)', '~15% of India sales; "growing in line with the industry"; ex-Sanofi diabetes and Roche, Q1FY27 growth ~6-7%', 'Adds scale, not margin; Sanofi cardiac term is an initial five years from Mar-2024'],
      ['Poviztra (semaglutide)', '~1,000 reps promote it; price cut Apr-2026; MASH approval Jul-2026; "month-over-month we are growing"', 'Option value; 40-50 generics compete; not in our numbers as a separate line'],
      ['Zuventus', 'Revenue −4% in FY26; Q4 restructuring; "Zuventus is no more my worry" (CEO, Aug-2026)', 'Recovery is the swing factor for H2FY27'],
      ['New areas (derma Emcutix, consumer Arth)', 'Early; Bitter Drops "early signs of scalable growth"', 'Too small to model separately'],
      ['Field productivity', '₹5.4 lakh → ₹7.0 lakh per rep per month (FY24-26); ~4,000 reps', 'Supports margins; attrition in Zuventus is the risk'],
    ], source: 'AR FY26; Q4FY26 and Q1FY27 calls; Sep-2026 deck' } },
    { callout: `**Our forecast:** India +${g('india', 0)}% / +${g('india', 1)}% / +${g('india', 2)}% to ₹${n0(build.india[2])} cr in FY29E. Management targets low double-digit growth and faster than the market in H2FY27. Our base case has India growing about with the market plus the full-year effect of the Sanofi diabetes and Roche brands; a real Zuventus recovery is upside, a second year of attrition is the bear case.` },
  ],
};

const regulated = {
  id: 'regulated', nav: 'Europe & Canada', kicker: 'Segments: Europe (20%) and Canada (16%)', title: 'Europe and Canada: own front ends and a complex-injectables pipeline; 20%+ growth helped by the rupee, mid-teens without it',
  blocks: [
    { p: `**Europe (Tillomed)** grew from ₹1,411 cr (FY24) to ₹1,850 cr (FY26, +25.5%) and ₹537 cr in Q1FY27 (+32.8%, of which ~12pp currency). Emcure sells hospital and retail generics directly in the UK and Italy and through partners elsewhere. Growth drivers are liposomal amphotericin B (the first EU generic of a ~US$270 mn product; tendered in "pretty much all" EU countries, supplies ramping), the Manx portfolio bought in 2025 (120+ marketing authorisations) and a 55+ product pipeline (ferric carboxymaltose, liposomal doxorubicin next). Management expects mid-teens CAGR over two years. **Canada (Marcan, Mantra)** grew from ₹923 cr (FY24) to ₹1,487 cr (FY26, +18.7%) and ₹427 cr in Q1FY27 (+24.6%): a top-10 generic company with a pan-Canadian front end since Mantra (Quebec, 2023), present in hospital, retail and OTC, with 50+ products in development and 8 near-term first-generic opportunities. Semaglutide is the most visible: Mantra will sell Dr. Reddy's generic in Quebec (timing depends on Dr. Reddy's supply) and Emcure is filing its own.` },
    { pair: [
      { type: 'column', title: 'Europe: ₹1,411 cr to ₹1,850 cr in two years', unit: 'Europe revenue (₹ crore); FY27-29E = GAM', x: [...SA.map(r => r.fy), ...YRS], series: [{ name: 'Europe', values: [...SA.map(r => r.europe), ...build.europe.map(Math.round)], fmt: 'num' }], labels: 'all', highlight: 'FY26', source: 'Company decks; GAM Research' },
      { type: 'column', title: 'Canada: ₹923 cr to ₹1,487 cr after Mantra', unit: 'Canada revenue (₹ crore); FY27-29E = GAM', x: [...SA.map(r => r.fy), ...YRS], series: [{ name: 'Canada', values: [...SA.map(r => r.canada), ...build.canada.map(Math.round)], fmt: 'num' }], labels: 'all', highlight: 'FY26', source: 'Company decks; GAM Research' },
    ] },
    { exhibit: { type: 'line', title: 'Quarterly revenue: Europe and Canada keep climbing', unit: '₹ crore; Q1-Q3 FY25 derived from reported growth', x: QL, series: [{ name: 'Europe', values: SQ.map(q => q.europe), fmt: 'num' }, { name: 'Canada', values: SQ.map(q => q.canada), fmt: 'num' }], labels: 'last', source: 'Company decks; Motilal Oswal (7-Aug-2026) quarterly table; GAM' } },
    { callout: `**Our forecast:** Europe +${g('europe', 0)}% / +${g('europe', 1)}% / +${g('europe', 2)}% and Canada +${g('canada', 0)}% / +${g('canada', 1)}% / +${g('canada', 2)}%. FY27E keeps some currency tailwind (the rupee was much weaker in Q1FY27 than a year earlier); FY28-29E assume none. These are generics businesses: the gross margin is below India's (one reason group gross margin fell to 58.4% in Q1FY27), price erosion on plain generics is constant, and growth depends on a few complex launches (amphotericin B, semaglutide). We count no semaglutide revenue in Canada.` },
  ],
};

const row = {
  id: 'row', nav: 'Rest of world & ARV', kicker: 'Segment: rest of world (20%)', title: 'Rest of world: an ARV tender business that is growing fast but lumpy, plus branded generics in 80+ countries',
  blocks: [
    { p: `Rest-of-world revenue grew from ₹1,181 cr (FY24) to ₹1,840 cr (FY26, +21.8%) and ₹522 cr in Q1FY27 (+44.8%). Two businesses sit here. **ARV** (anti-HIV medicines for Africa and Latin America, sold in large tenders) was about two-thirds of the region in Q1FY27 and should be 50-55% for the year (management); Emcure competes on cost (backward integration into APIs) and holds voluntary licences for Gilead's twice-yearly lenacapavir (one of six licensees; DMF filed, registration expected in FY27) and, since Jul-2026, MSD's once-monthly oral PrEP candidate (royalty-free, 129 countries). **Non-ARV** branded generics are sold directly in Kenya, South Africa, Brazil, Mexico, Chile, Peru, the Philippines and the Dominican Republic and through partners elsewhere (15+ approvals in Q1FY27, 3 new territories).` },
    { pair: [
      { type: 'column', title: 'Rest of world: ₹1,181 cr to ₹1,840 cr', unit: 'Rest-of-world revenue (₹ crore); FY27-29E = GAM', x: [...SA.map(r => r.fy), ...YRS], series: [{ name: 'Rest of world', values: [...SA.map(r => r.row), ...build.row.map(Math.round)], fmt: 'num' }], labels: 'all', highlight: 'FY26', source: 'Company decks; GAM Research' },
      { type: 'column', title: 'Quarterly: tenders make it lumpy', unit: 'Rest-of-world revenue (₹ crore); Q1-Q3 FY25 derived', x: QL, series: [{ name: 'Rest of world', values: SQ.map(q => q.row), fmt: 'num' }], labels: 'all', highlight: 'Q1FY27', source: 'Company decks; GAM' },
    ] },
    { callout: `**Our forecast:** +${g('row', 0)}% / +${g('row', 1)}% / +${g('row', 2)}%. The ARV order book gives visibility for FY27, but tenders are price-competitive, donor-funded (budgets can be cut) and lumpy: Q2FY26 grew only 8.8%. We treat lenacapavir and the monthly PrEP pill as upside: volumes and prices under voluntary licences are set by funders, and launch timing is uncertain.` },
  ],
};

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: real chemistry and a few category-leading brands, but no wide moat; much of the recent growth is borrowed (in-licensed) or cyclical (tenders, currency)',
  blocks: [
    { exhibit: { type: 'table', title: 'Competitive advantage scorecard', head: ['Source', 'Strength', 'Evidence'], wide: [2], rows: D.moat.map(m => [m.area, `**${m.score}**`, m.evidence]), source: 'Sep-2026 investor deck (IQVIA MAT Mar-2026); AR FY26; Q1FY27 call; GAM assessment' } },
    { callout: '**Verdict: narrow moat at best.** Emcure\'s genuine edge is in chemistry and complex manufacturing (chiral molecules, iron, liposomal injectables, biologics), which gives it first-to-market products in India and first generics abroad. Its brands lead in a handful of categories. But it is a mid-sized player in India, its fastest-growing domestic products are other companies\' brands on time-limited distribution deals, and more than half of revenue is generics and tenders where advantages erode. We do not pay a premium for the moat; the multiple we use is the stock\'s own history adjusted only for the sector.' },
  ],
};

module.exports = { india, regulated, row, moat };
