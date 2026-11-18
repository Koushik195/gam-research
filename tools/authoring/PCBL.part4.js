// PCBL report, part B (3/3): Aquapharm, growth projects & guidance record, moat, earnings quality,
// ownership and governance. As of 30-Sep-2026 (Q1FY27 basis).
const { ctx } = require('./PCBL.ctx');
const { C, D, F, A, n0, n1, pc, ai, SQ, A26, A25, AQA, CBA } = ctx;
const QA = SQ.filter(q => q.aqRev != null);
const aqEnd = { FY25: { 'Home care': 34390, 'Oil & gas': 29361, 'Water solutions': 17284, 'Application-specific': 14771 }, FY26: { 'Home care': 38218, 'Oil & gas': 23640, 'Water solutions': 15219, 'Application-specific': 17368 } };

// ---------------------------------------------------------------- Aquapharm
const aquapharm = {
  id: 'aquapharm', nav: 'Aquapharm', kicker: 'Specialty & Solutions', title: 'Aquapharm: ₹3,800 cr for ₹417 cr of EBITDA that has become ₹162 cr',
  blocks: [
    { p: `PCBL agreed to buy 100% of Aquapharm Chemicals on 28-Nov-2023 for ₹3,800 cr, about 9x the ₹417 cr of EBITDA Aquapharm made in FY23 on revenue of ₹2,045 cr (a 20% margin). The deal closed in Jan-2024 and was "majorly debt funded" (CARE). Since then the business has shrunk: revenue was ₹${n0(A25.aqRev)} cr in FY25 and ₹${n0(A26.aqRev)} cr in FY26, EBITDA ₹${A25.aqEbitda} cr (13.7%) and ₹${A26.aqEbitda} cr (11.2%). After ₹143 cr of depreciation and amortisation (including amortisation of the ₹2,310 cr of customer, product and IP intangibles created by the deal), the Chemicals segment made a profit before interest and tax of ₹17 cr in FY26 on ₹4,226 cr of segment assets, a fraction of the interest on the debt raised to buy it. Causes: US oil & gas drilling slowed (oil & gas volume −19% in FY26, −35% YoY in Q1FY27), European detergent makers are moving from phosphonates to green chelates, raw materials (yellow phosphorus, acrylic acid) and freight jumped with the West Asia conflict, and low utilisation turned fixed costs into losses.` },
    { pair: [
      { type: 'column', title: 'Quarterly Aquapharm EBITDA: ₹50 cr → ₹29 cr → ₹47 cr', unit: 'Aquapharm revenue and EBITDA (₹ crore)', x: QA.map(q => q.q), series: [{ name: 'Revenue', values: QA.map(q => q.aqRev), fmt: 'num' }, { name: 'EBITDA', values: QA.map(q => q.aqEbitda), fmt: 'num' }], labels: 'all', source: 'Company presentations (Q1FY25 and Q4FY25 not disclosed in what we read)' },
      { type: 'hbar', title: 'FY26 volume: home care up, oil & gas and water down', unit: 'Aquapharm sales volume by end use (tonnes)', x: Object.keys(aqEnd.FY26), series: [{ name: 'FY26', values: Object.values(aqEnd.FY26), fmt: 'num' }, { name: 'FY25', values: Object.keys(aqEnd.FY26).map(k => aqEnd.FY25[k]), fmt: 'num' }], labels: 'all', source: 'Q4FY26 presentation' },
    ] },
    { exhibit: { type: 'table', title: 'Aquapharm promises vs delivery', head: ['When said', 'Promise', 'What happened'], wide: [1, 2], rows: [
      ['Jul-2025 (Q1FY26 call)', 'FY26 EBITDA ~₹300 cr "maintained"', `FY26 EBITDA ₹${A26.aqEbitda} cr (−46%)`],
      ['Oct-2025 (Q2FY26 call)', 'Exit FY26 at ~₹75 cr a quarter', 'Q4FY26 ₹29 cr'],
      ['Apr-2026 (Q4FY26 call)', 'FY27 revenue +20-25%; ₹50-55 cr a quarter; ₹75 cr run-rate in 2-3 quarters', 'Q1FY27 revenue +3%, EBITDA ₹47 cr incl. inventory and surcharge help'],
      ['Jul-2026 (Q1FY27 call)', 'New CEO (ex-Eastman): "early days"; plan next quarter; FY27 "better than FY26, led by volume"', 'No numerical target reaffirmed'],
    ], source: 'Earnings call transcripts, Jul-2025 to Jul-2026' } },
    { callout: `**Honest verdict:** on today's numbers PCBL overpaid. ₹3,800 cr of mostly borrowed money now earns ~₹160 cr of EBITDA, a ~4% pre-tax cash return, well below the ~8-9% interest it pays. Aquapharm is a real franchise (world #3 in phosphonates, long relationships with P&G, Henkel and Reckitt, plants in the US and Saudi Arabia), and green chelates are an opportunity. But we need evidence before modelling a recovery: we assume revenue +${AQA.growth.join('% / +')}% and EBITDA margins of ${AQA.marginPct.join('% / ')}% for FY27-29E (EBITDA ₹{{F.seg.aq.adjEbitda.0|num}} / {{F.seg.aq.adjEbitda.1|num}} / {{F.seg.aq.adjEbitda.2|num}} cr), still well short of the ₹417 cr it made before the deal and of management's ₹75 cr a quarter.` },
  ],
};

// ---------------------------------------------------------------- projects, battery, Vision 2030
const projects = {
  id: 'projects', nav: 'Growth projects & Vision 2030', kicker: 'Growth projects', title: 'Vision 2030 asks for 3x EBITDA in five years; the track record says haircut it heavily',
  blocks: [
    { p: `At the RPSG Investor Day (8-Sep-2025) PCBL promised to double revenue to ~₹16,000 cr, triple EBITDA to ~₹4,000 cr and multiply profit 5x by FY30 from FY25, with specialty products rising from 28% to 63% of EBITDA and net debt falling from 3.6x to below 1x EBITDA. The bridge: ₹150 cr from cost savings, ₹400 cr from carbon black capacity (Tamil Nadu brownfield, Andhra Pradesh greenfield), ₹100 cr from specialty blacks, ₹600 cr from Aquapharm and ₹1,400 cr from battery materials (super-conductive carbons, nano-silicon, acetylene black). The CFO reaffirmed it in Apr-2026. In the year since, FY26 EBITDA fell 22%, Aquapharm missed its targets and battery revenue is still nil. Our FY29E EBITDA is ₹{{F.ebitda.2|num}} cr, ~${Math.round((1 - F.ebitda[2] / 4000) * 100)}% below the FY30 target a year earlier.` },
    { exhibit: { type: 'table', title: 'Projects: status in Jul-Sep 2026', head: ['Project', 'Detail', 'Status'], wide: [2], rows: C.projects.map(p => [p.name, p.detail, p.status]), source: 'Q1FY27 call (29-Jul-2026), CARE (7-Jul-2026), RPSG Investor Day' } },
    { exhibit: { type: 'table', title: 'Vision 2030 vs GAM FY29E', head: ['Metric', 'FY25 (actual)', 'FY30 target (company)', 'GAM FY29E'], rows: [
      ['Revenue (₹ cr)', '8,404', '~16,000', '{{F.sales.2|num}}'],
      ['EBITDA (₹ cr)', '1,337 (company: ~1,400)', '~4,000', '{{F.ebitda.2|num}}'],
      ['EBITDA margin', '15.9%', '24%', '{{F.ebitdaMargin.2|pct}}'],
      ['Net profit (₹ cr)', '435', '5x (~2,200)', '{{F.pat.2|num}}'],
      ['Net debt / EBITDA', '3.6x', '<1x', `${n1(ctx.ndEngine(2) / F.ebitda[2])}x`],
      ['Battery-materials EBITDA (₹ cr)', '0', '~1,400', '0 (not modelled)'],
    ], source: 'RPSG Investor Day (8-Sep-2025); GAM estimates' } },
    { p: '**Battery materials, honestly.** Nanovace (PCBL 51%, in a joint venture with Kindia of Australia) holds a US process patent for making nano-silicon for lithium-ion anodes. Its 80-tonne pilot plant at Palej received consent to operate in Jul-2026 and was due to start sampling to battery makers in Aug-2026; management expects qualification within the year and commercial volumes in FY28, and CRISIL was told margins could exceed 30%. Alongside, a 1,000 tpa super-conductive black line has started and a 4,000 tpa acetylene black plant is in engineering. These are good businesses to be in, but qualification with cell makers typically takes years, the competition (Chinese and Western silicon-anode start-ups) is well funded, and no customer, price or capacity plan has been disclosed. We put nothing in our forecasts, even in the bull case: any battery-materials revenue would be upside to all three scenarios.' },
    { callout: '**Honest verdict:** management has a habit of setting ambitious numbers (₹20-22/kg EBITDA in carbon black, ₹300 cr for Aquapharm in FY26, ₹4,000 cr of EBITDA by FY30) and keeping them after the year turns out badly. We give credit for what is in its control (volume growth, specialty lines, cost savings) and none yet for battery materials.' },
  ],
};

// ---------------------------------------------------------------- moat
const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: scale, locations and free power; no pricing power in rubber black',
  blocks: [
    { verdicts: D.moat.map(m => [m.dimension, m.verdict, m.evidence, { Advantage: 'Real and hard to copy', Parity: 'Competitive, not decisive', Disadvantage: 'A drag on returns', Unproven: 'An option, not a moat' }[m.verdict]]), head: ['Dimension', 'Verdict', 'Evidence', 'So what'], title: 'Moat scorecard', source: 'GAM research compilation (filings, calls, rating rationales to Sep-2026)' },
    { callout: '**Honest verdict:** PCBL has a **cost-and-scale position** in carbon black (largest Indian producer, port-side plants, by-product power) and a **genuine specialty-black business**. That is enough to win volume and survive downturns. It is **not** enough to set prices: in rubber black the spread is decided by crude, by Russian and Chinese imports and by Indian rivals\' spare capacity, which is why EBITDA per tonne fell 26% in FY26. Aquapharm has a franchise but has not shown it can earn its cost of capital under PCBL. ROE of 5% (FY26) and ~11-12% in our FY28-29E is the honest scorecard: no moat premium.' },
  ],
};

// ---------------------------------------------------------------- earnings quality
const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: clean audit, but inventory swings, deal accounting and donations sit in the numbers',
  blocks: [
    { bullets: [
      '**Inventory gains and losses.** Formula pricing passes crude through with a lag, so rising crude creates gains on cheap stock and falling crude creates losses. Q1FY27 included ~₹70 cr of gains (CFO), ₹40-50 cr of which he expected to reverse in Q2FY27; FY26 margins were hurt the other way.',
      '**Working capital flatters FY26 cash.** Operating cash flow of ₹1,576 cr included a ₹529 cr release of working capital as crude fell; Q1FY27 rebuilt inventory (₹117 cr increase) as crude rose. Expect much of that release to reverse.',
      '**Deal accounting.** The Aquapharm purchase created ₹1,161 cr of goodwill and ~₹2,310 cr of customer, product and IP intangibles. Their amortisation inflates Chemicals D&A (₹143 cr in FY26) and depresses EPS by a non-cash charge. In FY25 a ₹555 cr goodwill impairment was booked as an exceptional item and exactly offset by a ₹554 cr deferred-tax reversal from merging Aquapharm into Advaya Chemical: a large write-down that left no trace in profit.',
      '**Political donations in operating costs.** "Subscriptions and donations" include ₹35 cr (FY26) and ₹44.5 cr (FY25) of contributions under Section 182 of the Companies Act, booked in other expenses, i.e. inside EBITDA (3% of FY26 EBITDA, 18% of net profit).',
      '**Power is a transfer-price profit.** The Power segment\'s ₹239 cr PBIT includes captive power sold to the carbon black plants at the price of grid power (₹131 cr of inter-segment revenue). It is real value, but the segment split depends on that price.',
      '**Exceptional and one-off items.** FY26: −₹25 cr for the new labour codes. FY27: a ₹40-45 cr US tariff refund was expected (accounting not decided); we exclude it.',
      '**Investments are group-company shares.** The ₹464 cr shown as investments (CESC ₹253 cr, RPSG Ventures, Spencer\'s and unquoted group firms) is not liquid treasury; their fair-value changes go through OCI (−₹42 cr in FY26).',
    ] },
    { callout: `**Accounting flag: AMBER.** S.R. Batliboi & Co. gave a clean opinion (key audit matters: revenue recognition, contingencies and the goodwill/intangible impairment test). We see no sign of manipulation, but reported profit swings with crude-driven inventory effects, is reduced by non-cash deal amortisation, and carries political donations inside operating costs. CFO/EBITDA was ${Math.round(A.cfo[ai('FY26')] / A.ebitda[ai('FY26')] * 100)}% in FY26 and ${Math.round(A.cfo[ai('FY25')] / A.ebitda[ai('FY25')] * 100)}% in FY25: the working-capital swing, not a change in quality.` },
  ],
};

// ---------------------------------------------------------------- ownership additions
const OH = D.ownership;
const ownership = base => ({ ...base, blocks: [
  { p: `The RP-Sanjiv Goenka group owns ${OH.categoriesPct.promoter}% (Jun-2026), almost all through Rainbow Investments (47.4%); nothing is pledged, and 1.6 cr shares from the ₹280 warrant conversion are locked in. Domestic institutions own ${OH.categoriesPct.dii}% (mutual funds ${OH.categoriesPct.mutualFunds}%, insurers ${OH.categoriesPct.insurance}%), up from ~6% in early 2024; foreign investors own only ${OH.categoriesPct.fii}% (7.1% in Dec-2023). About ${Math.round(OH.shareholders / 1000)},000 shareholders hold the rest; small individuals alone own ${OH.smallHoldersPct}%.` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Named holders (Jun-2026)', head: ['Holder', 'Stake', 'Note'], wide: [2], rows: [
    ...OH.promoterGroup.map(h => [h.name, n1(h.pct) + '%', 'Promoter group']),
    ...OH.named.map(h => [h.name, n1(h.pct) + '%', '']),
    ['Foreign portfolio investors (total)', OH.categoriesPct.fii + '%', 'None at 1% or more'],
    ['Resident individuals (holdings up to ₹2 lakh)', OH.smallHoldersPct + '%', `${n0(OH.shareholders)} shareholders in all`],
  ], source: 'Shareholding pattern for the quarter ended 30-Jun-2026 (filed 21-Jul-2026), the latest public on 30-Sep-2026' } },
  { callout: '**Our read:** the promoters put ₹448 cr of fresh equity in at ₹280 a share (FY25-26), which helped the balance sheet and shows commitment. Domestic institutions have doubled their stake since early 2024 (small-cap and balanced-advantage funds, LIC and SBI Life are the named holders); foreign investors have not returned. A 53% promoter stake and a large retail base mean the stock can stay disconnected from fundamentals for long periods, in both directions.' },
] });

// ---------------------------------------------------------------- governance
const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: a professional board on paper, group-first habits in practice',
  blocks: [
    { exhibit: { type: 'table', title: 'Key people', head: ['Name', 'Role', 'Note'], wide: [2], rows: C.management.map(m => [m.name, m.role, m.note]), source: 'Integrated Report FY26 (25-Aug-2026); Q1FY27 call' } },
    { verdicts: [
      ['Audit and accounts', 'Strong', 'S.R. Batliboi & Co.; unqualified opinion; KAMs on revenue, contingencies and impairment.', 'No red flags in the audit.'],
      ['Board', 'Moderate', '11 directors: 7 independent, 3 non-executive promoter family members (Chairman Sanjiv Goenka, Shashwat and Preeti Goenka), 1 executive (MD).', 'Majority independent; family keeps the chair.'],
      ['Management stability', 'Weak', 'MD Kaushik Roy resigned (3-Nov-2025) for Nilesh Koul; new Aquapharm CEO (Rohit Narang, mid-2026).', 'Two key leaders new in the last 12 months.'],
      ['Guidance and disclosure', 'Weak', 'Aquapharm FY26 target missed by 46%, exit-quarter target by 61%; Vision 2030 reaffirmed after a 22% EBITDA fall. Good operating data each quarter (volumes, EBITDA/t, power).', 'Data are good; targets are not reliable.'],
      ['Capital allocation', 'Weak', `₹3,800 cr debt-funded acquisition now earning ~₹160 cr EBITDA; ₹464 cr held in group-company shares; dividend of 119% of FY26 EPS while net debt ~4x EBITDA.`, 'Group priorities and payouts ahead of deleveraging.'],
      ['Political donations and related parties', 'Weak', '₹35 cr (FY26) and ₹44.5 cr (FY25) of political contributions; group companies (CESC, Saregama, Firstsource) among related parties.', 'A recurring cost to minority shareholders.'],
      ['Promoter alignment and pay', 'Moderate', 'Promoters invested ₹448 cr at ₹280 (FY25-26); no pledge. Non-executive Chairman and Shashwat Goenka each paid ~92x the median employee.', 'Skin in the game, but generous pay for non-executive roles.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'GAM research compilation (Integrated Report FY26, calls, rating rationales)' },
  ],
};

module.exports = { aquapharm, projects, moat, quality, ownership, governance };
