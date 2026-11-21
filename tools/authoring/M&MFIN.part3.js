// M&M Finance report, part 3: franchise and AUM mix (with our segment build), wheels, non-wheels and the fee
// businesses. Spread/NIM and asset quality are in part3b.
const X = require('./M&MFIN.ctx');
const { C, SG, F, A, AS, fin, fi, n0, n1, n2, pc, Q1, G, BUILD, SA26, WHEELS, NONW, insCom } = X;
const MX = Object.fromEntries(SG.mixPct.map(r => [r.fy || r.q, r]));
const NAMES = Object.fromEntries(SG.lines.map(l => [l.key, l.name]));
const keys = Object.keys(AS.aumBuild.growth);
const amt = (r, k) => (k === 'mrhfl' ? r.mrhfl : r[k] / 100 * r.businessAssets);
const SHORT = { pv: 'Cars & UVs', cv: 'CV & CE', used: 'Used vehicles', tractor: 'Tractors', tw3: 'Three-wheelers', sme: 'SME', others: 'Others', mrhfl: 'Housing (MRHFL)' };
const add26 = keys.map(k => [SHORT[k], amt(MX.FY26, k) - amt(MX.FY25, k)]).sort((a, c) => c[1] - a[1]);
const SUB = SG.subsidiaries, DS = Object.fromEntries(SG.disbursements.rows.map(r => [r[0], r]));

const franchise = {
  id: 'franchise', nav: 'Franchise & AUM mix', kicker: 'Franchise and growth', title: 'Growth is ~12% in vehicles and ~30% elsewhere; the mix will shift, slowly',
  blocks: [
    { p: `MMFSL disbursed ₹61,118 cr in FY26 (+6%) and ₹15,564 cr in Q1FY27 (+22%). Group AUM grew 13% in FY26 to ₹{{fin.aum.11|num}} cr and the standalone book 13% in the year to Jun-2026. Management now describes the plan in two parts: the wheels business (83% of group AUM) should grow at about the vehicle market, ~11-12% a year, while the non-wheels businesses (SME, personal loans, leasing and housing, 17%) compound at 30% or more, for a 16-18% group CAGR over FY26-31. In Q1FY27 wheels AUM grew ~11-12% and non-wheels ~28-30%, exactly on that plan. The problem is arithmetic: with 83% of the book growing at 11-12%, the group grows ~14-15% for the next two or three years, and the 16-18% only arrives late in the period, if at all.` },
    { pair: [
      { type: 'hbar', title: 'Where FY26\'s AUM growth came from', unit: 'Increase in AUM, Mar-25 to Mar-26 (₹ crore; standalone asset classes from % shares)', x: add26.map(r => r[0]), series: [{ name: 'Added', values: add26.map(r => Math.round(r[1])), fmt: 'num' }], labels: 'all', source: 'Q4FY26 presentation p19, p22; GAM arithmetic' },
      { type: 'stacked', title: 'Our build: non-wheels from 16% to 24% of AUM by FY29E', unit: 'Group AUM (₹ \'000 crore)', x: ['FY26', ...F.years], series: [
        { name: 'Wheels', values: [SA26.wheels, ...BUILD.map(r => r.wheels)].map(v => Math.round(v / 100) / 10), fmt: 'n1' },
        { name: 'Non-wheels (SME, others, housing)', values: [SA26.nonw, ...BUILD.map(r => r.nonw)].map(v => Math.round(v / 100) / 10), fmt: 'n1' },
      ], minLabel: 10, source: 'Company; GAM estimates' },
    ] },
    { exhibit: { type: 'table', title: 'Our AUM build by asset class (₹ crore) vs guidance', head: ['Asset class', 'FY26', 'FY27E', 'FY28E', 'FY29E', 'Growth FY27-29E', 'Guidance / evidence'], wide: [6], rows: [
      ...keys.map(k => [NAMES[k], n0(SA26[k]), ...BUILD.map(r => n0(r[k])), AS.aumBuild.growth[k].map(g => `${g}%`).join(' / '), { pv: 'Disb. +24% in Q1; rural PV ahead of urban', cv: 'Disb. −3% in Q1; exiting fleet HCV/CE', used: 'Disb. +16% in Q1', tractor: 'Disb. +45% in Q1; Q2 "contracted" (CEO); weak monsoon', tw3: 'Shift to electric 3W', sme: 'AUM +32% in FY26; 30%+ target', others: 'PL to existing customers, leasing', mrhfl: 'Loans +29% YoY; merging Apr-2027' }[k]]),
      { hl: true, cells: ['**Total (build)**', `**${n0(SA26.total)}**`, ...BUILD.map(r => `**${n0(r.total)}**`), '', '**16-18% CAGR FY26-31**'] },
      ['Model AUM (one line)', '{{fin.aum.11|num}}', '{{F.aum.0|num}}', '{{F.aum.1|num}}', '{{F.aum.2|num}}', '{{F.aumGrowth.0|pct}} / {{F.aumGrowth.1|pct}} / {{F.aumGrowth.2|pct}}', ''],
    ], source: 'Q4FY26 and Q1FY27 presentations and calls; GAM estimates. The build is illustrative and sums to the model AUM within 0.5%.' } },
    { callout: `**Our view:** we take {{F.aumGrowth.0|pct}} for FY27E and {{F.aumGrowth.1|pct}} after, below management's 16-18% and Emkay's 16-18%, for three reasons: management itself plans only ~11-12% a year for wheels (83% of AUM), which is what Q1FY27 delivered; the 2026 monsoon will slow tractor and rural lending in H2; and the company missed its last growth target (2x AUM by FY25). Faster growth is possible (bull case +17-18%), but at a 36% payout it would also bring the next equity raise forward.` },
  ],
};

const wheels = {
  id: 'wheels', nav: 'Wheels: tractors, cars, trucks', kicker: 'Segment: vehicle finance (83% of group AUM)', title: 'Wheels: market leader in tractors, a price-taker in cars and trucks',
  blocks: [
    { p: `Vehicle finance is the core: ~₹1.2 lakh cr of AUM in Jun-2026 and 92% of FY26 disbursements. The mix tells the strategy. Passenger vehicles (41.5% of the book) are mostly utility vehicles and entry-level cars for rural and semi-urban buyers; M&M Finance "sits out" premium-car loans where banks price at very low returns, and lost unit share there in FY26. Commercial vehicles and construction equipment (19.2%, down from 22.9% in FY24) are being re-shaped away from large fleet operators, who now borrow from banks, toward small and light trucks. Tractors (12.4%, up from 10.7%) are where it leads: management calls it "the number 1 tractor financier in the country by a fair margin", with separate teams for Mahindra and Swaraj tractors. Used vehicles (12.3%) carry the highest yields.` },
    { exhibit: { type: 'table', title: 'Wheels disbursements by product (₹ crore, standalone)', head: ['Product', 'FY25', 'FY26', 'FY26 YoY', 'Q1FY26', 'Q1FY27', 'Q1 YoY'], rows: [
      ...[['Passenger vehicles', 1], ['Pre-owned vehicles', 2], ['CV & CE', 3], ['Tractors', 4], ['Three-wheelers', 5]].map(([nm, j]) => [nm, n0(DS.FY25[j]), n0(DS.FY26[j]), pc((DS.FY26[j] / DS.FY25[j] - 1) * 100), n0(DS.Q1FY26[j]), n0(DS.Q1FY27[j]), pc((DS.Q1FY27[j] / DS.Q1FY26[j] - 1) * 100)]),
      { hl: true, cells: ['**Wheels total**', ...['FY25', 'FY26'].map(p => `**${n0([1, 2, 3, 4, 5].reduce((s, j) => s + DS[p][j], 0))}**`), pc(([1, 2, 3, 4, 5].reduce((s, j) => s + DS.FY26[j], 0) / [1, 2, 3, 4, 5].reduce((s, j) => s + DS.FY25[j], 0) - 1) * 100), ...['Q1FY26', 'Q1FY27'].map(p => `**${n0([1, 2, 3, 4, 5].reduce((s, j) => s + DS[p][j], 0))}**`), pc(([1, 2, 3, 4, 5].reduce((s, j) => s + DS.Q1FY27[j], 0) / [1, 2, 3, 4, 5].reduce((s, j) => s + DS.Q1FY26[j], 0) - 1) * 100)] },
    ], source: 'Q4FY26 presentation p21; Q1FY27 presentation p9' } },
    { pair: [
      { type: 'stacked', title: 'The book is tilting to tractors and cars, away from trucks', unit: 'Share of MMFSL business assets (%)', x: ['FY24', 'FY25', 'FY26', 'Jun-26'], series: [
        { name: 'PV', values: ['FY24', 'FY25', 'FY26', 'Q1FY27'].map(p => MX[p].pv), fmt: 'n1' }, { name: 'CV & CE', values: ['FY24', 'FY25', 'FY26', 'Q1FY27'].map(p => MX[p].cv), fmt: 'n1' },
        { name: 'Pre-owned', values: ['FY24', 'FY25', 'FY26', 'Q1FY27'].map(p => MX[p].used), fmt: 'n1' }, { name: 'Tractors', values: ['FY24', 'FY25', 'FY26', 'Q1FY27'].map(p => MX[p].tractor), fmt: 'n1' },
        { name: '3W', values: ['FY24', 'FY25', 'FY26', 'Q1FY27'].map(p => MX[p].tw3), fmt: 'n1' }, { name: 'SME + others', values: ['FY24', 'FY25', 'FY26', 'Q1FY27'].map(p => MX[p].sme + MX[p].others), fmt: 'n1' },
      ], minLabel: 3, source: 'Q4FY26 presentation p22; Q1FY27 presentation p22' },
      { type: 'column', title: 'Collection efficiency: 94-98% every quarter, Q1 always weakest', unit: 'Collection efficiency (%), Q1FY25 to Q1FY27', x: ['Q1FY25', 'Q2FY25', 'Q3FY25', 'Q4FY25', 'Q1FY26', 'Q2FY26', 'Q3FY26', 'Q4FY26', 'Q1FY27'], series: [{ name: 'Collection efficiency', values: [94, 96, 95, 97, 95, 96, 95, 98, 95], fmt: 'pct0' }], labels: 'all', min: 85, max: 100, source: 'Q1FY27 presentation p23 (demand plus overdues collected ÷ demand)' },
    ] },
    { callout: '**Our view:** the wheels franchise is a real asset (deep dealer reach, the Mahindra link, 30 years of rural repayment data), but it does not earn high returns. Yields have fallen as banks and well-funded NBFCs compete for the better borrowers, so M&M Finance\'s growth leans on tractors and used vehicles, where risk is higher and the monsoon matters most. We model wheels growth of ~11% a year and no improvement in vehicle yields.' },
  ],
};

const MR = SUB.mrhfl.rows, MB = SUB.mibl.rows;
const nonwheels = {
  id: 'nonwheels', nav: 'Non-wheels & fee businesses', kicker: 'Segment: SME, housing, insurance broking (17% of AUM)', title: 'Non-wheels: growing 30%, but from a small base; insurance broking is a hidden profit pool',
  blocks: [
    { p: `The diversification has three legs. **SME loans** (6.2% of MMFSL's book; ~₹8,500 cr) to small businesses, dealers and supply-chain partners grew 32% in FY26; management wants faster growth but calls it "still capability building". **Housing** sits in MRHFL (₹${n0(MR[1][6])} cr of loans, Jun-2026), which lost ₹228 cr in FY25 while it wrote down a legacy rural book (Stage 3 from 9.0% to 2.4%) and has since returned to profit (₹${MR[3][6]} cr in Q1FY27) and growth (disbursements ${pc((MR[0][6] / MR[0][5] - 1) * 100)}); it merges into the parent from Apr-2027, which lets the NBFC branches sell home loans and loans against property directly. **Personal loans and leasing** to existing customers are the third leg ("others", 5.3%).` },
    { p: `The fee businesses matter as much. The corporate insurance agency (licensed in FY25) earned ₹${n0(insCom)} cr of commission in FY26, 2.4x FY25. Mahindra Insurance Brokers (MIBL, 100%) placed ₹4,590 cr of premium and earned ₹${MB[2][2]} cr of profit in FY26 (₹${MB[2][4]} cr in Q1FY27, +83%), motor insurance in the Mahindra ecosystem plus open-market, commercial-lines and reinsurance business; it pays regular dividends to the parent. The AMC joint venture (51%) turned profitable in FY26. Together these lifted fee income from 0.8% of AUM in FY23 to 1.9% in FY26, the main reason ROA reached 2%.` },
    { exhibit: { type: 'table', title: 'MRHFL and MIBL: the two subsidiaries that matter (₹ crore)', head: ['', ...SUB.mrhfl.head.slice(1)], rows: [
      ...MR.map(r => [`MRHFL: ${r[0]}`, ...r.slice(1).map(v => (typeof v === 'number' && !/Stage/.test(r[0]) ? n0(v) : `${v}%`))]),
      ['MIBL: net premium', '–', '–', n0(MB[0][1]), n0(MB[0][2]), n0(MB[0][3]), n0(MB[0][4])],
      ['MIBL: total income', '–', '–', n0(MB[1][1]), n0(MB[1][2]), n0(MB[1][3]), n0(MB[1][4])],
      ['MIBL: PAT', '–', '–', n0(MB[2][1]), n0(MB[2][2]), n0(MB[2][3]), n0(MB[2][4])],
    ], source: 'Q4FY24-Q4FY26 and Q1FY27 presentations (subsidiary pages)' } },
    { callout: `**Our view:** the non-wheels businesses are the right strategy and are finally working (mortgages clean, SME growing, broking profitable), but they are 17% of AUM and will be ~24% by FY29E in our build. They cannot change group ROE quickly. The fee businesses can, in both directions: IRDAI's proposed caps on loan-linked insurance commission (23-Sep-2026) put the fastest-growing income line at risk. Management said in July that its products are "very clean" and it does not expect "a very big departure" in fee income; we cut ~0.13% of AUM from FY28E anyway.` },
  ],
};

module.exports = { franchise, wheels, nonwheels, ...require('./M&MFIN.part3b') };
