// Granules India report, part 3: finished dosages & complex generics; the legacy molecules (API, PFI).
const X = require('./GRANULES.ctx');
const { C, SA, SQ, YRS, LINES, BL, n0, n1, pc, cagr } = X;
const Q1 = C.q1fy27, CS = C.controlledSubstances, MO = C.molecules, H = SA.map(s => s.fy);

const fd = {
  id: 'fd', nav: 'Finished dosages', kicker: 'Segment: finished dosages', title: 'Finished dosages (74% of revenue): controlled substances and complex generics drove the recovery; nine approvals are waiting on Gagillapur',
  blocks: [
    { p: `FD revenue doubled from ₹1,944 cr in FY22 to ₹3,989 cr in FY26 (${n1(cagr(1944.2, 3989.3, 4))}% a year) and grew 22% to ₹1,093 cr in Q1FY27, even though Granules has had no new approval from Gagillapur, its main FD site, since the 2024 inspection. The growth came from the harder products. Complex generics rose from 1% of revenue in FY20 to 33% in FY26 and to 50% of FD in Q1FY27 (39% a year earlier). The engine is GPI in Virginia: Granules is now the 3rd largest US maker of controlled substances by value (8th in Jul-2025), top-3 in six of the seven ADHD products it sells, and lifted its Adderall XR share from 5% in 2024 to 29% in Aug-2026 (GPI's President). GPI moved from 74th to 27th among US generic companies in five years.` },
    { p: `What comes next is a pipeline that depends on regulators and courts. Eighteen US approvals are pending: nine need only an FDA re-inspection of Gagillapur (market ~USD11 bn), one is from GPI and the rest wait for patents to expire. Three more controlled products (incl. Adderall IR) are to be launched over the next ~12 months. ${CS.ftf}. Granules files 6-10 US ANDAs a year and aims for 10-15.` },
    { pair: [
      { type: 'column', title: 'FD revenue: ₹1,944 cr (FY22) to ~₹5,756 cr (FY29E)', unit: 'Finished dosages (₹ crore)', x: [...H, ...YRS], series: [{ name: 'FD', values: [...SA.map(s => Math.round(s.fd)), ...LINES.fd.map(Math.round)], fmt: 'num' }], labels: 'all', highlight: 'FY26', source: 'AR FY26 and company decks; GAM estimates FY27-29E' },
      { type: 'column', title: 'Complex generics: 31% of FD (FY25) to 50% (Q1FY27)', unit: 'Complex generics, % of FD revenue', x: ['FY25', 'Q1FY26', 'FY26', 'Q4FY26', 'Q1FY27'], series: [{ name: 'Complex share', values: [31, 39, 43, 46, 50], fmt: 'pct0' }], labels: 'all', highlight: 'Q1FY27', source: 'Company decks (Q4FY26, Q1FY27)' },
    ] },
    { exhibit: { type: 'table', title: 'The FD growth drivers and what we assume', head: ['Driver', 'Status on 30-Sep-2026', 'In our base case?'], wide: [1, 2], rows: [
      ['Controlled substances (GPI)', CS.text.split('; ').slice(1, 4).join('; '), 'Yes: the main source of FD growth'],
      ['Gagillapur re-inspection', '9 approvals (~USD11 bn market) wait; remediation complete; FDA visit awaited', 'Partly: approvals start to come through in FY28'],
      ['Genome Valley (GLS)', '10 bn dosages, FDA EIR (VAI) Dec-2025; utilisation very low in Q1, >50% by end-FY27', 'Yes: capacity for transferred and new products'],
      ['First-to-file products', '2 sole FTFs (generic Lumryz, generic Dyanavel XR) in litigation; >USD350 mn US market', 'No (bull case only)'],
      ['Oncology (Vizag)', '2 filings; first own launch FY28-29', 'Negligible before FY29'],
      ['Europe / ROW / Canada B2C', 'Europe FD rising on old filings; Canada B2C from next year', 'Yes, small'],
    ], source: 'Q1FY27 deck and call; webinar 29-Sep-2026; GAM Research' } },
    { callout: `**Our FD forecast:** +${BL.growth.fd[0]}% / +${BL.growth.fd[1]}% / +${BL.growth.fd[2]}% in FY27-29E to ₹${n0(LINES.fd[2])} cr, slower than Q1's +22% because FY26's later quarters set a high base and the legacy tablets inside FD face price pressure. MOSL models ~18% a year to FY28E and Emkay +15%/+20% for FY28-29E. The gap is mostly Gagillapur timing: we do not assume all nine launches in FY28.` },
  ],
};

const molecules = {
  id: 'molecules', nav: 'Legacy molecules, API & PFI', kicker: 'Concentration', title: 'The legacy molecules: more than half of revenue still rests on paracetamol, metformin and a few others, and Granules has no pricing power in them',
  blocks: [
    { p: `Granules' "legacy five" are paracetamol, metformin, ibuprofen, guaifenesin and methocarbamol. ${MO.share} Granules does not disclose volumes or prices by molecule, so the trend has to be read from revenue and from what management says. API revenue rose from ₹975 cr in FY22 to ₹1,341 cr in FY23 and then fell to ₹619 cr in FY25 (−54%) as post-COVID prices collapsed and more API went into Granules' own tablets; PFI fell from ₹902 cr to ₹429 cr. FY26 brought a modest recovery (API +10%, PFI +25%) from new APIs and from European demand, not from price.` },
    { pair: [
      { type: 'column', title: 'API revenue: ₹1,341 cr (FY23) to ₹619 cr (FY25)', unit: 'API (₹ crore)', x: [...H, ...YRS], series: [{ name: 'API', values: [...SA.map(s => Math.round(s.api)), ...LINES.api.map(Math.round)], fmt: 'num' }], labels: 'all', source: 'AR FY26; GAM estimates FY27-29E' },
      { type: 'column', title: 'PFI revenue: halved FY23-FY25, small recovery', unit: 'PFI (₹ crore)', x: [...H, ...YRS], series: [{ name: 'PFI', values: [...SA.map(s => Math.round(s.pfi)), ...LINES.pfi.map(Math.round)], fmt: 'num' }], labels: 'all', source: 'AR FY26; GAM estimates FY27-29E' },
    ] },
    { exhibit: { type: 'table', title: 'Price and volume signals in the legacy molecules', head: ['Period', 'What happened'], wide: [1], rows: MO.priceTrend.map(t => [t.period, t.text]), source: 'AR FY26; Elara initiation (5-Mar-2026); Q4FY26 and Q1FY27 calls; webinar 29-Sep-2026' } },
    { exhibit: { type: 'table', title: 'How concentrated is Granules?', head: ['Measure', 'Value', 'Source'], wide: [2], rows: [
      ['Legacy generics, % of FY26 revenue', '56%', 'AR FY26 (value-creation page)'],
      ['Products built on paracetamol, metformin and guaifenesin APIs (incl. PFI and FD stages), % of turnover', '~65%', 'AR FY26 BRSR life-cycle table (a different basis; we show both)'],
      ['Integrated generics, % of FD revenue', '63% (FY25) → 52% (FY26) → 46% (Q1FY27)', 'Company decks'],
      ['North America, % of revenue', '~72-75%', 'Company decks; webinar'],
      ['Gagillapur share of FD capacity', `26.8 of ${n0(26.8 + 10 + 1.5 + 1.1)} bn dosages (~${Math.round(26.8 / 39.4 * 100)}%)`, 'Q1FY27 deck (plant capacities)'],
    ], source: 'As stated per row' } },
    { callout: `**Our view:** the legacy molecules are a real cost advantage (Granules makes the chemical, the granule and the tablet) but they are commodities. In Q1FY27 Granules held back supply rather than absorb higher costs, which tells you the customer, not Granules, sets the price. We forecast API +${BL.growth.api[0]}% in FY27 (the Q1 run-rate) and +${BL.growth.api[1]}% a year after, PFI +${BL.growth.pfi[0]}% a year. A 10% fall in legacy prices on ~56% of revenue would cut revenue ~5-6%; that is the bear case.` },
  ],
};

module.exports = { fd, molecules };
