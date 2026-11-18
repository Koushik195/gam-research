// Aster DM Quality Care report, part 2: business, history, the merger (terms; standalone vs merged), industry, tailwind test.
const fs = require('fs');
const path = require('path');
const X = require('./ASTERDM.ctx');
const { rup, C, D, F, V, A, ROOT, n0, n1, pc, SRC, SA, Q1, FY26, REP, salValue, salSep28, SAL, evAttrMult, MIN, price } = X;
const NW = C.network, MG = C.merger;

// Peer growth from each company's Screener file: Jun-2026 quarter YoY and FY23-26 revenue CAGR (reported).
const scr = sym => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')).tables;
const q1g = sym => { const q = scr(sym).quarters, r = q.rows.Sales || q.rows.Revenue, i = q.periods.indexOf('Jun 2026'), j = q.periods.indexOf('Jun 2025'); return i >= 0 && j >= 0 ? Math.round((r[i] / r[j] - 1) * 1000) / 10 : null; };
const IND = ['APOLLOHOSP', 'MAXHEALTH', 'FORTIS', 'NH', 'MEDANTA', 'KIMS', 'RAINBOW', 'JLHL'];
const indX = ['Aster DM Quality Care (pro-forma)', ...IND.map(X.shortName)], indV = [Q1.proForma.revenueYoYPct, ...IND.map(q1g)];

const business = {
  id: 'business', nav: 'What the company does', kicker: 'The business', title: 'Multi-specialty hospitals in South, Central and East India, plus labs and a brand-licensed pharmacy chain',
  blocks: [
    { p: `Aster DM Quality Care runs **39 hospitals** (10,898 capacity and 10,559 operational beds at June 2026), 321 labs and patient-experience centres and the Aster brand on 205 pharmacies run by an associate company. Almost all revenue (~97%) comes from hospitals and clinics: in-patient treatment (cardiac, oncology, neurosciences, gastroenterology, orthopaedics, transplants) and out-patient care. It has **four brands**: **Aster** (Medcity Kochi, MIMS in north Kerala, CMI/RV/Whitefield in Bengaluru, Ramesh in Andhra), **CARE Hospitals** (Hyderabad, Vizag, Nagpur, Raipur, Bhubaneswar, Indore and others), **KIMSHEALTH** (Trivandrum and south Kerala) and **Evercare** (Dhaka and Chattogram, Bangladesh). Kerala is the core: 4,642 beds and ~53% of Aster's hospital revenue, with a ~25% margin.` },
    { p: `The two halves were similar in size in FY26: Aster ₹${n0(FY26.aster.revenue)} cr revenue and ₹${n0(FY26.aster.opEbitda)} cr operating EBITDA (20.4%), QCIL ₹${n0(FY26.qcil.revenue)} cr and ₹${n0(FY26.qcil.opEbitda)} cr (23.0%). Patients pay mostly in cash (53%) or through corporate and insurance cover (34%); government schemes are 9% and international patients (medical value travel) 4%. About 65% of beds are in tier-2 and tier-3 cities, where competition is thinner and land cheaper, but prices are lower than in metros.` },
    { pair: [
      { type: 'hbar', title: 'Kerala is 43% of beds; no other state above 13%', unit: 'Capacity beds by state, Jun-2026', x: NW.bedsByState.map(r => r[0]), series: [{ name: 'Beds', values: NW.bedsByState.map(r => r[1]), fmt: 'num' }], labels: 'all', highlight: 'Kerala', source: 'Q1FY27 presentation p.5; Motilal Oswal (28-Sep-2026) exhibit from company decks' },
      { type: 'hbar', title: 'Specialty mix: no single specialty above 15%', unit: 'Share of Q1FY27 hospital revenue, pro-forma (%)', x: ['Cardiac sciences', 'Neurosciences', 'Oncology', 'Gastroenterology', 'Orthopaedics', 'Nephrology', 'Others'], series: [{ name: 'Share', values: [15, 11, 10, 10, 10, 6, 38], fmt: 'pct0' }], labels: 'all', source: 'Q1FY27 presentation p.10' },
    ] },
    { exhibit: { type: 'table', title: 'The two halves in FY26', head: ['', 'Aster', 'Quality Care', 'Combined'], rows: [
      ['Hospitals / capacity beds', '20 / 5,449', '19 / 5,174', '39 / 10,623'],
      ['Revenue (₹ cr) / growth', '4,643 / +12%', '4,630 / +17%', '9,273 / +14%'],
      ['Operating EBITDA (₹ cr) / margin', '947 / 20.4%', '1,066 / 23.0%', '2,013 / 21.7%'],
      ['Occupancy / ARPP IP (₹)', '61% / 1,21,016', '63% / 1,33,734', '62% / 1,27,074'],
      ['Net debt excl. leases, Mar-26 (₹ cr)', '−626 (net cash)', '1,388', '763'],
      ['Doctors', '3,620+', '3,790+', '7,410+'],
    ], source: 'June-2026 investor presentation p.11 (QCIL unaudited); Q4FY26 presentation' } },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'From a Dubai clinic to a Gulf group, then an India-only chain, now merged with Blackstone\'s platform',
  blocks: [
    { exhibit: { type: 'table', title: 'Key events and what they did to the numbers', head: ['When', 'Event', 'Impact'], wide: [1, 2], rows: C.history.map(h => [h.when, rup(h.event), rup(h.impact) || '–']), source: C.historySrc } },
    { callout: `**What this does to the history:** Screener's data before FY23 includes the Gulf business (FY22 revenue ₹10,253 cr vs ₹2,994 cr for India alone in FY23), FY25 profit includes a ₹4,981 cr post-tax gain on the sale (EPS ₹107.66), and FY26 is Aster alone (₹388 cr profit, EPS ₹${REP.eps} on 51.81 cr shares). Screener also books the ₹374 cr equity component of convertible preference shares as debt and its FY26 "net profit" (₹427 cr) is before minorities. We put profit on the after-minorities basis, neutralise the ₹374 cr in our net-debt figure and, because the merger took effect on 1-Jul-2026, put FY26 on a **pro-forma combined basis** (₹9,273 cr revenue, EPS ₹8.94 on 87.17 cr shares) as the model's base year. Per-share and multiple history before the deal describes a different company, so our valuation history starts at the merger announcement (29-Nov-2024).` },
  ],
};

const merger = {
  id: 'merger', nav: 'The merger: terms and basis', kicker: 'Merger', title: 'The merger is done: we value the merged company; standalone Aster is a scenario',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms and timeline', head: ['Item', 'Detail'], wide: [1], rows: [
      ['Structure', rup(MG.structure)], ['Valuation and split', rup(MG.terms)], ['Approvals', MG.approvals], ['Completion', rup(MG.completion)], ['Accounting', MG.accounting], ['Synergies', rup(MG.synergies)], ['After the deal', rup(MG.postDealSales)],
    ], source: MG.src } },
    { p: `**Which entity do we value?** The merged one. On 30-Sep-2026 the merger had been effective for three months, the 35.36 cr new shares were listed, QCIL had ceased to exist and the company was reporting the two businesses as one. A share bought at ₹${n0(price)} is 1/87.17 crore of the combined company, so valuing Aster alone on 51.81 cr shares would answer a question nobody can trade. We show standalone Aster below as a scenario, because it tells us whether the merger added value for Aster's old shareholders.` },
    { exhibit: { type: 'table', title: 'Scenario: Aster alone vs the merged company (same multiple, after minorities)', head: ['', 'Aster alone (no merger)', 'Merged company (our base)'], rows: [
      ['Sep-28E EBITDA, post-Ind AS (₹ cr)', n0(salSep28), n0(X.ebitdaSep28)],
      ['Minorities\' share of EBITDA', `${SAL.minorityPct}%`, `${Math.round(MIN * 100)}%`],
      ['Multiple on EBITDA after minorities', `${evAttrMult}x`, `${evAttrMult}x`],
      ['Net debt incl. leases at Sep-28E (₹ cr)', n0(SAL.netDebtSep28), n0(-X.treasurySep28)],
      ['Shares (crore)', '51.81', '87.17'],
      { hl: true, cells: ['**Value per share (₹)**', `**${n0(Math.round(salValue / 10) * 10)}**`, `**${n0(V.tp)}**`] },
    ], source: 'GAM estimates (assumptions.json standalone block and base model)' } },
    { callout: `**So what:** at the same multiple, the merged company is worth ~${Math.round((V.tp / (Math.round(salValue / 10) * 10) - 1) * 100)}% more per share than Aster alone would be, because QCIL brought 53% of combined operating EBITDA for 42.7% of the shares. That is the accretion management promised. The flip side: in November 2024 the deal valued Aster at 36.6x FY24 EBITDA and QCIL at 25.2x; today the market pays ~25x forward for the combination, so Aster's old shareholders swapped a richly valued stock for a larger, cheaper one with more debt, more minorities and a private-equity co-owner.` },
  ],
};

const IN = D.industry;
const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Private hospitals: consolidation, pricier care and expansion into smaller cities, with regulation as the cloud',
  blocks: [
    { p: IN.summary },
    { exhibit: { type: 'table', title: 'Forces acting on the market (as of 30-Sep-2026)', head: ['Theme', 'Direction', 'What it means for Aster DM Quality Care'], wide: [2], rows: IN.themes.map(r => r.map(rup)), source: IN.src } },
    { pair: [
      { type: 'hbar', title: 'Q1FY27 growth: Aster (pro-forma) among the faster listed chains', unit: 'Revenue growth, Jun-2026 quarter, YoY (%)', x: indX, series: [{ name: 'Growth', values: indV, fmt: 'pct' }], labels: 'all', highlight: 'Aster DM Quality Care (pro-forma)', source: 'Screener.in quarterly results (peers, consolidated); company pro-forma for Aster' },
      { type: 'hbar', title: 'Peer trailing EV/EBITDA: 22-41x at the 30-Sep-2026 close', unit: 'Trailing EV/EBITDA at the 30-Sep-2026 close (x)', x: ['Max Healthcare', 'KIMS', 'Medanta', 'Apollo Hospitals', 'Fortis', 'Rainbow', 'Jupiter Life Line', 'Narayana Hrudayalaya'], series: [{ name: 'EV/EBITDA', values: ['MAXHEALTH', 'KIMS', 'MEDANTA', 'APOLLOHOSP', 'FORTIS', 'RAINBOW', 'JLHL', 'NH'].map(s => X.P[s].evEbitda), fmt: 'x' }], labels: 'all', source: 'Screener.in, scaled to the 30-Sep-2026 close (Aster\'s trailing figure is not meaningful: merged market value over Aster-only EBITDA)' },
    ] },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Tailwind test: Aster captures case mix and medical travel; regulation is the headwind',
  blocks: [
    { verdicts: [
      ['Sicker patients, complex procedures', 'Yes', 'ARPP IP +10% in Q1FY27 (pro-forma); robotics +80%, transplants +19%; CONGO-T mix 55-59%.', 'The main driver of 7-8% price/mix growth.'],
      ['Insurance penetration', 'Yes', 'Corporate & insurance 34% of revenue (33% a year earlier); cash 53%.', 'Supports pricing and fast collections (Aster receivables ~24 days).'],
      ['Medical value travel', 'Yes, from a low base', 'International revenue +62% in Q1FY27, only 4% of revenue; GCC, Maldives, Africa referrals.', 'Upside, not yet material.'],
      ['Tier-2/3 demand', 'Yes', '65% of beds outside metros/tier-1; Kasargod broke even in nine months; Nagercoil at ~30% margin.', 'Faster ramp-ups than metro greenfields.'],
      ['Consolidation and scale', 'Partly', 'Procurement savings at QCIL (~₹85 cr in FY26); merger synergies (₹150-200 cr) not yet started.', 'Proof will come in FY27-28.'],
      ['Regulation', 'No (headwind)', 'Supreme Court remarks on drug mark-ups (30-Sep-2026); 9% of revenue from government schemes at fixed tariffs.', 'A risk to pharmacy margins across the sector.'],
    ], head: ['Industry tailwind', 'Captured?', 'Evidence', 'So what'], title: 'Tailwind test', source: SRC },
  ],
};

module.exports = { business, history, merger, industry, tailwind };
