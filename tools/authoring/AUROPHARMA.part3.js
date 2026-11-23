// Aurobindo Pharma report, part 3: US formulations (oral solids, gRevlimid, Lannett, US plants, tariffs) and injectables
// (Eugia and the US FDA status of its plants).
const X = require('./AUROPHARMA.ctx');
const { C, D, F, n0, n1, pc, rup, Q1, FY26, SQ, QL, BL, lines, YRS, share } = X;
const US = SQ.map(q => q.usUsd);
const LAN = [195, 290, 315], BASE = BL.usUsdMn.map((v, i) => v - LAN[i]); // US build: Lannett vs Aurobindo base (US$ mn)
const LN = C.deals.find(d => /Lannett/.test(d.deal));

const us = {
  id: 'us', nav: 'US formulations', kicker: 'Segment: US formulations (43% of revenue)', title: 'US: a ~$400mn-a-quarter base that is not growing; Lannett adds a plant and ~$240mn',
  blocks: [
    { p: `Aurobindo sells ~$1.6bn a year of generics in the US: tablets and capsules made mainly at Units III, VII and APL Healthcare in Telangana and Andhra Pradesh, plus injectables (Eugia, next chapter) and specialty products. It has 737 final ANDA approvals, 33 tentative and 126 under review (Jun-2026) and launched ${Q1.launches} products in Q1FY27. The business in dollars has gone nowhere: $1,750mn in FY25, $${FY26.usUsdMn}mn in FY26 (−7%), $${Q1.usUsdMn}mn in Q1FY27 vs $426mn in Q1FY25. Part of that is generic Revlimid (lenalidomide), sold under volume limits and never disclosed separately; excluding it, group revenue grew 9.5% in FY26 and US sales rose from $381mn (Q4FY26) to $399mn (Q1FY27). The rest is the usual US arithmetic: ~10 launches a quarter roughly offset price erosion on the existing portfolio. The US CEO agreed that ~$400mn a quarter is the base.` },
    { pair: [
      { type: 'column', title: 'US quarterly revenue: our path with Lannett from Q2FY27', unit: 'US formulations revenue (US$ mn); Q2-Q4FY27 = GAM estimates', x: [...QL, 'Q2FY27E', 'Q3FY27E', 'Q4FY27E'], series: [{ name: 'US', values: [...US, 465, 475, 461], fmt: 'num' }], labels: 'all', highlight: 'Q1FY27', source: 'Company presentations; GAM estimates (base US$405/410/391mn + Lannett US$60/65/70mn)' },
      { type: 'stacked', title: 'Annual: Lannett takes the US to ~$2bn by FY29E', unit: 'US revenue (US$ mn): Aurobindo base and Lannett', x: ['FY25', 'FY26', ...YRS], series: [{ name: 'Aurobindo base (incl. Eugia US)', values: [1750, FY26.usUsdMn, ...BASE], fmt: 'num' }, { name: 'Lannett', values: [0, 0, ...LAN], fmt: 'num' }], minLabel: 100, source: 'Company presentations; GAM estimates' },
    ] },
    { h: 'Lannett: what Aurobindo bought' },
    { p: rup(`${LN.terms}. ${LN.economics}. The FTC made Aurobindo sell four overlapping products to Quagen. Management's plan is to fill the Seymour plant by transferring Aurobindo products that are not yet launched or need US manufacturing (government contracts), cut overlapping staff (30-40 people at closing) and buy inputs more cheaply; it expects some benefit within nine months. Lannett's respiratory pipeline (generic Advair launching in August-2026; Spiriva and Flovent in development with its partner) is the upside.`) },
    { exhibit: { type: 'table', title: 'US manufacturing and pipeline levers', head: ['Lever', 'Status (30-Sep-2026)', 'What it could add', 'Source'], wide: [1, 2], rows: [
      ['**Lannett (Seymour, Indiana)**', 'Closed 29-Jun-2026; ~40% utilised; controlled substances within DEA quotas', '~$60mn a quarter base; utilisation and transfers over 12 months; US-made supply if tariffs come', 'Q1FY27 call'],
      ['**Generic Advair (via Lannett)**', 'Approved; launch planned Aug-2026 after inventory build', 'Respiratory entry; several rivals already on the market', 'Q1FY27 call'],
      ['**Dayton (NJ) and Raleigh (NC)**', 'Dayton commercial (transdermals, orals); Raleigh (inhalers) awaiting regulatory clearance', 'Complex products from FY27 ("contributing significantly")', 'Q3FY26 call'],
      ['**Base launches**', `${Q1.launches} launches and ${Q1.approvals} approvals in Q1FY27; 126 ANDAs under review`, 'Offsets annual price erosion on ~700 marketed products', 'Q1FY27 presentation'],
      ['**$2bn ambition**', '"Maybe in the next 1-2 years", Lannett (~$300mn) included; in-licensing, no "big bang" deal', 'Our FY29E is $2.0bn', 'Q4FY26 call'],
    ], source: 'Company calls and presentations' } },
    { h: 'Tariffs: a risk Aurobindo is better placed for than most' },
    { p: rup(`${D.industry.tariffs} Aurobindo is the most US-exposed large Indian generics maker by volume, so a tariff would hurt it most; but it is also one of the few with US plants (Lannett, AuroLife, Dayton, Raleigh). The US CEO's view is that a blanket rule would be "a level playing ground": prices would have to rise for everyone. We assume no tariff in our forecasts (they end in FY29) and treat it as a bear-case risk.`) },
    { callout: `**Our view:** we model US revenue of $${BL.usUsdMn.join(' / ')}mn for FY27-29E: a base of $${BASE.join(' / ')}mn (flat to +2.5% a year in dollars, as launches offset price erosion and Eugia cannot launch from its blocked sites) plus Lannett at $${LAN.join(' / ')}mn. That is close to management's $2bn by FY29E but gets there by acquisition, not organic growth. At FY27E rates the US is ${n1(share('us', 0))}% of revenue. Every $50mn of US revenue is ~₹480 cr of revenue and, at ~30% incremental margin, ~₹145 cr of EBITDA (~2% of FY28E EPS).` },
  ],
};

const EU = C.regulatory;
const injectables = {
  id: 'injectables', nav: 'Injectables (Eugia) & FDA status', kicker: 'Segment: injectables and specialty (Eugia, ~$500mn)', title: 'Injectables: a $500mn business with two warning letters; growth is on hold',
  blocks: [
    { p: 'Eugia Pharma Specialities makes Aurobindo\'s injectables (sterile medicines given by drip or syringe), oncology and hormone products and penems in five sites near Hyderabad, plus a US unit. Global specialty and injectables revenue was $513mn in FY26, ~$480mn excluding generic Revlimid, ~70% of it in the US. Injectables are the most attractive part of US generics: hard to make, often in shortage, fewer competitors. But the FDA has blocked new approvals from the two sites that matter most. Unit III (injectables and ophthalmics, 149 ANDAs) has been under a warning letter since Aug-2024; it was re-inspected in Jan-Feb 2026 (11 observations, which management called "procedural") and classified OAI again. Unit I (oncology and hormones, 61 ANDAs) was inspected in Feb-2026, classified OAI and received a warning letter dated 13-Aug-2026 that criticises its aseptic processing and calls Units II and III "unacceptable" too. Management now guides single-digit growth and ~$500mn+ of revenue for FY27.' },
    { pair: [
      { type: 'column', title: '59 of the 159 US applications awaiting approval sit at the two blocked Eugia sites', unit: 'ANDAs awaiting final approval (tentative + under review), 30-Jun-2026', x: ['Eugia Unit III', 'Eugia Unit I', 'Other Aurobindo sites'], series: [{ name: 'ANDAs', values: [41, 18, 100], fmt: 'num' }], labels: 'all', source: 'Q1FY27 presentation (unit-wise ANDA filings)' },
      { type: 'column', title: 'Specialty and injectables: ~$500mn, growth stalled', unit: 'Global specialty & injectables revenue (US$ mn)', x: ['FY26 reported', 'FY26 ex-gRevlimid', 'FY27 guidance'], series: [{ name: 'Revenue', values: [513, 480, 500], fmt: 'num' }], labels: 'all', source: 'Q4FY26 call (22-May-2026); Q1FY27 call (6-Aug-2026: "around 500 million plus")' },
    ] },
    { exhibit: { type: 'table', title: 'Manufacturing sites and regulatory status (30-Sep-2026)', head: ['Site', 'Status', 'Why it matters'], wide: [1, 2], rows: EU.map(r => [`**${rup(r.site)}**`, rup(r.status), rup(r.impact)]), source: 'FDA warning letter 320-26-115; company calls; Medical Dialogues (13-Jun and 14-Aug 2026); AR FY26' } },
    { bullets: [
      '**What a warning letter does:** existing products keep shipping (the company says there is no impact on current US supplies), but the FDA can withhold approval of new products made at the site until it re-inspects and is satisfied. That can take years: Unit III has been under a warning letter since Aug-2024.',
      '**How much is at stake:** Unit I is ~2% of group revenue (company); Unit III holds 108 of Eugia\'s 167 approved US products. The bigger cost is the launches that cannot happen: 59 pending applications.',
      '**History repeats:** Unit III\'s 2024 warning letter followed data-integrity findings; the 2026 Unit I letter cites repeat aseptic-processing failures across Eugia. This is the main compliance risk in the group.',
    ] },
    { callout: '**Our view:** we assume Eugia grows ~5% a year in dollars and that no blocked site is cleared before FY28; we do not cut existing supplies. A clean re-inspection of Unit III would add ~$50-100mn of US revenue over two years (our bull case); an import alert at either site (not our base case) would remove existing sales and is the single biggest downside risk in the US.' },
  ],
};

module.exports = { us, injectables };
