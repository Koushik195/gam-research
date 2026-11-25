// Wockhardt report, part 3: Zaynich (regulatory status on 30-Sep-2026, launch, pricing, competition, forecast), the rest of
// the pipeline (with sourced success rates), and earnings without the new drugs.
const X = require('./WOCKPHARMA.ctx'), Y = require('./WOCKPHARMA.ctx2');
const { C, F, AS, n0, n1, YRS, lines, zParts, zEbitda, baseRev, baseEbitda } = X;
const ZP = C.pipeline.find(p => p.code === 'WCK 5222'), SR = C.successRates, BLZ = AS.businessLines.zaynich;

const zaynich = {
  id: 'zaynich', nav: 'Zaynich', kicker: 'The new antibiotic', title: 'Zaynich: approved in the US and India in May 2026, launching in early 2027, and priced like its rivals',
  blocks: [
    { p: 'Zaynich combines the old antibiotic cefepime with zidebactam, a Wockhardt molecule that both blocks bacterial enzymes and attacks the cell wall. It works against carbapenem-resistant Enterobacterales and Pseudomonas, the hospital superbugs for which few drugs remain. In the ENHANCE-1 phase 3 trial in complicated urinary tract infections (cUTI) it beat meropenem (Business Today: 89% vs 68.4% composite cure at test-of-cure; management cites ~20 points of superiority), and 85+ patients with no other option were treated under compassionate use. It is the first Indian-discovered new chemical entity approved by the USFDA.' },
    { exhibit: { type: 'table', title: 'Zaynich regulatory status exactly as known on 30-Sep-2026', head: ['Market', 'Status on 30-Sep-2026', 'Launch (company / press)'], wide: [1, 2], rows: [
      ['United States', 'Approved 30-May-2026 (NDA 220787, holder Wockhardt Bio AG; filed 30-Sep-2025; priority review, fast track, QIDP) for adults with cUTI incl. pyelonephritis. Label mentions activity against Enterobacterales and Pseudomonas; other infections need new trials.', 'End-2026/early 2027 (available ~Q1 CY2027); made by a USFDA-approved contract manufacturer in Europe; own leadership team plus an operating partner'],
      ['India', 'CDSCO import and marketing authorisation 27-May-2026 (cUTI incl. pyelonephritis, with concurrent Gram-negative bacteraemia), after the expert committee\'s favourable view of 10-Mar-2026. The Q1FY27 release still says full approval after CMC review is expected by Q3FY27 (carried over; we read it as the locally made product).', 'Dec-2026/Jan-2027 through the anti-infectives field force (Business Today, Jul-2026); priced at a 75-80% discount to the US'],
      ['European Union', 'Marketing application under EMA accelerated assessment; dossier accepted for cUTI, cIAI, HAP/VAP and bloodstream infection. No CHMP opinion.', 'Management expected approval by end-2026'],
      ['Emerging markets', 'Filings planned off the US/EU files', '7-8 high-resistance markets within 18-24 months of Jun-2026'],
      ['United Kingdom', 'Not approved; NHS subscription (up to GBP 20mn a year) needs approval and an award: none found', '–'],
    ], source: 'USFDA approval letter; CDSCO/company (BioSpectrum, 28-May-2026); Q4FY26 and Q1FY27 press releases; investor meet (4-Jun-2026); Business Today (7-Jul-2026)' } },
    { bullets: [
      '**Price:** new US antibiotics cost US$1,200-1,500 a day, US$10,000-15,000 a course; Wockhardt will be price-neutral to them, i.e. it competes on efficacy, not on price. India at 20-25% of the US price.',
      '**Ramp:** the chairman expects a slow start and a "hockey stick" after 12-18 months; his US director said new anti-infectives typically sell ~US$30-50mn in total over their first ~three years. Zaynich costs money until breakeven 12-18 months after launch (management).',
      '**Peak:** management says US$1.5-2bn a year globally (no year given), the US ~40% of it, and a 20-25% share of resistant cases in the long run. The chairman also put today\'s US market for new branded antibiotics at ~US$1bn in total.',
      '**Exclusivity:** composition patent to 2038; QIDP adds five years of US exclusivity. The US NDA and the US/EU business sit in Wockhardt Bio AG (85.85% owned).',
      '**Competition:** Shionogi\'s Fetroja (cefiderocol) is the broadest rival and already in US hospitals; AbbVie\'s Emblaveo targets the same metallo-beta-lactamase niche. Zaynich\'s US commercial chief helped launch Fetroja.',
    ] },
    { pair: [
      { type: 'stacked', title: 'Our Zaynich revenue build: India first, the US from FY28', unit: 'Zaynich revenue (₹ crore), GAM estimates', x: YRS, series: [{ name: 'India', values: zParts.india.map(Math.round), fmt: 'num' }, { name: 'United States', values: zParts.us.map(Math.round), fmt: 'num' }, { name: 'EU + emerging markets', values: zParts.euEm.map(Math.round), fmt: 'num' }], minLabel: 20, source: 'GAM estimates (assumptions.json businessLines.zaynich)' },
      { type: 'column', title: 'Zaynich EBITDA: losses until FY29E', unit: '₹ crore, GAM estimates', x: YRS, series: [{ name: 'Zaynich EBITDA', values: zEbitda, fmt: 'num' }], labels: 'all', source: 'GAM estimates; management: slight loss/neutral for 12-18 months' },
    ] },
    { callout: `**Our base case is deliberately slower than management.** US sales of US$${BLZ.usUsdMn.join(' / ')}mn in FY27-29E (~US$36mn in the first 27 months, inside the US$30-50mn three-year norm), India ₹${BLZ.indiaCr.join(' / ')} cr, EU and emerging markets ₹${BLZ.euEmCr.join(' / ')} cr: total ₹${lines.zaynich.map(n0).join(' / ')} cr. That is ~${n1(lines.zaynich[2] / (1500 * 94 / 10) * 100)}% of the low end of management's peak by FY29E. We assume no UK subscription income. The valuation chapter shows what the price implies.` },
  ],
};

const pipeline = {
  id: 'pipeline', nav: 'Pipeline', kicker: 'Pipeline', title: 'The rest of the pipeline: two antibiotics selling in India, one filing soon, one four years away, five insulins',
  blocks: [
    { exhibit: { type: 'table', title: 'Novel antibiotics and insulin pipeline on 30-Sep-2026', head: ['Molecule', 'What it is', 'Status', 'Capitalised cost (Mar-26)'], wide: [1, 2], rows: C.pipeline.filter(p => p.code !== 'WCK 5222').map(p => [`**${p.brand}** (${p.code})`, p.what, p.indiaStatus || p.status, p.capitalised ? p.capitalised.split(' intangible')[0] : '–']), source: 'Q1FY27 press release; ICRA (21-May-2026); investor meet (4-Jun-2026); AR FY26 note 6' } },
    { exhibit: { type: 'table', title: 'What history says about the odds (all drugs, 2011-2020)', head: ['Stage', 'Chance of moving to the next stage', 'Wockhardt molecule at this stage'], rows: [
      ['Phase 2 → phase 3', `${SR.phase2to3}%`, 'WCK 6777 (Odrate; phase 1 done, phase 2 likely needed)'],
      ['Phase 3 → filing', `${SR.phase3toNda}%`, 'Zaynich HAP/VAP label expansion (trial not started)'],
      ['Filing → approval', `${SR.ndaToApproval}%`, 'Zaynich EU; Foviscu India (filing planned Q3FY27)'],
      { hl: true, cells: ['**Phase 2 → approval (product of the above)**', `**${n1(SR.phase2to3 * SR.phase3toNda * SR.ndaToApproval / 1e4)}%**`, 'WCK 6777'] },
    ], source: 'BIO / Informa Pharma Intelligence / QLS, Clinical Development Success Rates 2011-2020 (Feb-2021)' } },
    { callout: '**Our view:** Emrok (+60% in FY26) and Miqnaf show Wockhardt can launch antibiotics in India, but both are India-only and together were ~2% of revenue (ICRA). Foviscu is an India product. WCK 6777 has a ~15% historical chance of approval and is at least four years away (chairman). We put no value on anything beyond Zaynich, Emrok and Miqnaf in our forecasts; the five insulin analogues are a FY29+ story.' },
  ],
};

const withoutZ = {
  id: 'without-zaynich', nav: 'Earnings without Zaynich', kicker: 'Earnings before the new drugs', title: `Without Zaynich, EPS would be ₹${n1(Y.exZ[0].eps)} / ${n1(Y.exZ[1].eps)} / ${n1(Y.exZ[2].eps)}: the new drug lowers earnings until FY29E`,
  blocks: [
    { p: `Strip out Zaynich and Wockhardt is a ₹${n0(baseRev[0])} cr (FY27E) generics-and-insulin company growing ~10% a year after FY27 with a 21-22% EBITDA margin. Zaynich adds launch costs before revenue (EBITDA ${zEbitda.join(' / ')} ₹ cr) and, once its ₹1,055 cr capitalised development cost is amortised (we assume from launch, ~₹88 cr a year), a non-cash charge. Our EPS forecast therefore stalls in FY28E before Zaynich turns profitable in FY29E.` },
    { exhibit: { type: 'table', title: 'Earnings with and without Zaynich (₹ crore unless stated)', head: ['', ...YRS], rows: [
      ['Base-business revenue', ...baseRev.map(n0)], ['Base-business EBITDA', ...baseEbitda.map(n0)], ['  margin', ...baseEbitda.map((e, i) => `${n1(e / baseRev[i] * 100)}%`)],
      ['Depreciation (base)', ...Y.BASE_DEP.map(n0)], ['Other income', ...F.otherIncome.map(n0)], ['Finance cost', ...Y.FIN.map(n0)],
      { hl: true, cells: ['**EPS without Zaynich (₹)**', ...Y.exZ.map(e => `**${n1(e.eps)}**`)] },
      ['Zaynich revenue', ...lines.zaynich.map(n0)], ['Zaynich EBITDA', ...zEbitda.map(n0)], ['Zaynich amortisation', ...Y.Z_AMORT.map(n0)],
      { hl: true, cells: ['**Reported EPS, our forecast (₹)**', ...F.eps.map(v => `**${n1(v)}**`)] },
      ['Zaynich effect on EPS (₹)', ...Y.zDrag.map(v => `${v >= 0 ? '+' : '−'}${n1(Math.abs(v))}`)],
    ], source: 'GAM estimates; tax at the model rate (12% / 18% / 22%)' } },
    { callout: '**So what:** anyone buying Wockhardt at ₹2,116 is not paying for FY27-29 earnings, which are mostly the base business; they are paying for Zaynich\'s next decade. That is why we test the price against a Zaynich risked NPV in the valuation chapter.' },
  ],
};

module.exports = { zaynich, pipeline, withoutZ };
