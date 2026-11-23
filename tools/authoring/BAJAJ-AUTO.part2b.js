// Bajaj Auto report, part 2b: business lines - domestic motorcycles and Chetak, exports, three-wheelers, BACL, KTM.
const X = require('./BAJAJ-AUTO.ctx');
const { n0, n1, pc, SA, SQ, QL, A26, A25, Q1, FY26, KTM, BACL, BACLF, build } = X;
const Q5 = SQ.filter(q => q.units), Q5L = Q5.map(q => q.q);
// Monthly sales releases (1st of the following month): [domestic 2W, export 2W, domestic CV, export CV]
const MON = ['Apr', 'May', 'Jun', 'Jul', 'Aug'];
const M26 = [[210063, 229890, 38147, 35692], [209528, 183676, 38503, 29550], [166956, 222439, 42881, 30926], [165747, 222972, 54445, 31513], [201898, 241850, 53810, 38206]];
const M25 = [[188615, 129322, 32000, 15873], [191412, 140958, 34321, 17930], [149317, 149167, 39143, 23179], [139279, 156968, 43864, 25889], [184109, 157778, 48289, 27440]];
const SR = 'Bajaj Auto monthly sales releases (Apr-Aug 2026, released 4-May to 1-Sep-2026)';

const domestic = {
  id: 'domestic', nav: 'Domestic 2W & Chetak', kicker: 'Business line', title: 'Domestic two-wheelers: losing the commuter, winning premium and electric',
  blocks: [
    { pair: [
      { type: 'line', title: 'Bajaj sells ~2 mn motorcycles a year in India, flat for three years', unit: "Bajaj domestic motorcycle sales ('000)", x: SA.filter(a => a.domMc).map(a => a.fy), series: [{ name: "Units ('000)", values: SA.filter(a => a.domMc).map(a => Math.round(a.domMc / 1000)), fmt: 'num' }], labels: 'all', source: 'AR FY26 Table 1' },
      { type: 'column', title: 'Domestic 2W (incl. Chetak), Apr-Aug: +12% in 2026', unit: 'Domestic two-wheeler wholesale (units)', x: MON, series: [{ name: '2025', values: M25.map(m => m[0]), fmt: 'num' }, { name: '2026', values: M26.map(m => m[0]), fmt: 'num' }], labels: 'none', source: SR },
    ] },
    { bullets: [
      `**Share loss is real.** Bajaj's share of domestic motorcycles was 18.2% in FY24, 16.6% in FY25 and 15.6% in FY26 while the market grew 13.9%, 5.1% and 6.6%. Its own sales: 2.12 mn, 2.03 mn, 2.04 mn. Management says it will participate in 100cc "on its own terms" and favour profit over share; the 100cc segment has shrunk from ~55% to ~46% of motorcycles.`,
      `**Premium is where it wins.** 125cc+ is 77.5% of Bajaj's motorcycles. Pulsar passed ₹11,000 cr of domestic revenue in FY26 (₹16,500 cr globally); N and NS series are ~60% of its 150cc+ sales and gained "a couple of points" of Vahan share in five months. KTM and Triumph sold 1.30 lakh bikes in India in FY26 and ~40,000 in Q1FY27 (+50%). The festive relaunch: an all-new 150cc Pulsar and ~10 facelifts by September, then a new 125cc Pulsar and two new 125cc brands within FY27.`,
      `**GST.** The Sep-2025 cut (28% to 18% up to 350cc) boosted H2FY26; bikes above 350cc went to 40% and Bajaj absorbed much of it on KTM/Triumph and launched 350cc versions. Price rises from April 2026 handed back 30-40% of the GST benefit (management).`,
      `**Chetak** sold ${n0(FY26.chetak)} scooters in FY26 (+16%; rare-earth magnet shortages cut H1) with 20.7% of e-scooters, crossed 1 lakh retail in Q4FY26, grew ~80% in Q1FY27 and turned EBITDA positive. Capacity is the limit: 50k a month, going to 60k; exclusive stores 530+ (target ~1,000). EV 2W+3W were ~30% of domestic revenue in Q1FY27 at a double-digit EBITDA margin.`,
    ] },
    { callout: `**Our view:** we model domestic two-wheelers +${n1((build[0].dom2w / A26.dom2w - 1) * 100)}% in FY27E (Apr-Aug +12%, Sep-Mar +4% on a GST-boosted base), +7% in FY28E and +6% in FY29E: Chetak and premium grow fast, commuters stay soft. We do not assume Bajaj regains its FY24 share. The risk to us is that the new brands work and share recovers; the risk to the street is that commuter share keeps falling.` },
  ],
};

const exportsSec = {
  id: 'exports', nav: 'Exports', kicker: 'Business line', title: 'Exports: 44% of volume, ~40% of revenue, and the engine of FY27',
  blocks: [
    { pair: [
      { type: 'column', title: 'Export two-wheelers, Apr-Aug: +50% in 2026', unit: 'Export two-wheelers (units)', x: MON, series: [{ name: '2025', values: M25.map(m => m[1]), fmt: 'num' }, { name: '2026', values: M26.map(m => m[1]), fmt: 'num' }], labels: 'none', source: SR },
      { type: 'stacked', title: 'Quarterly volumes: exports overtook domestic in Q1FY27', unit: "Units ('000)", x: Q5L, series: [{ name: 'Domestic 2W', values: Q5.map(q => Math.round(q.dom2w / 1000)), fmt: 'num' }, { name: 'Export 2W', values: Q5.map(q => Math.round(q.exp2w / 1000)), fmt: 'num' }, { name: 'Domestic 3W', values: Q5.map(q => Math.round(q.dom3w / 1000)), fmt: 'num' }, { name: 'Export 3W', values: Q5.map(q => Math.round(q.exp3w / 1000)), fmt: 'num' }], minLabel: 60, source: 'Sales releases; GAM Research' },
    ] },
    { bullets: [
      `**Scale and reach.** FY26 exports: ${n0(A26.exp2w + A26.exp3w)} units (+20.8%), $${n0(FY26.exportUsdM)} m, ₹${n0(FY26.exportRevCr)} cr. #1 in 9 of 15 key motorcycle markets and 11 of 12 three-wheeler markets; exports passed 2 lakh a month in Oct-2025 for the first time in 39 months. Q1FY27: a record 7.32 lakh units and $735 m (40% of revenue).`,
      `**Where.** Latin America (Mexico, Colombia, Brazil, where Bajaj has a plant making ~32,000 bikes a year and is #5) had its best year; Africa more than doubled in Q1FY27 (Nigeria ~60% retail share with the Boxer 125 Heavy Duty, helped by pre-election institutional buying); Asia was muted (Bangladesh, Nepal); the Middle East was hit by the conflict. India-made KTM exports revived to ~17,500 in Q4FY26 from nearly nil.`,
      `**Why it can bust.** Nigeria was a quarter of exports before 2023; its devaluation and inflation took Bajaj's monthly sales there from ~50,000 to under 5,000 (Business Today, Jul-2024) and export 2W fell 25% in FY23 and 10% in FY24. Bajaj's response was to widen the base, so FY26 exports ex-Nigeria were at a record.`,
      `**Currency.** Exports are invoiced in dollars: the realised rate rose from ₹85.6 (Q1FY26) to ₹94.4 (Q1FY27). That alone is worth ~10% on 40% of revenue, which explains most of the margin resilience.`,
    ] },
    { callout: `**Our view:** exports of ${n0(build[0].exp2w + build[0].exp3w)} units in FY27E (+${n1(((build[0].exp2w + build[0].exp3w) / (A26.exp2w + A26.exp3w) - 1) * 100)}%: Apr-Aug actual +50%, Sep-Mar +22%), $${n0(build[0].expUsd)} m at ₹${X.AS.businessLines.rsPerExportUsd[0]} per export dollar; +10% and +8% in volume after that. This is where we, the street and management are most bullish, and where a single currency crisis would hurt most.` },
  ],
};

const threeW = {
  id: 'threew', nav: 'Three-wheelers', kicker: 'Business line', title: 'Three-wheelers: a near-monopoly in ICE, leadership but no monopoly in electric',
  blocks: [
    { pair: [
      { type: 'column', title: 'Domestic 3W (incl. electric), Apr-Aug: +15% in 2026', unit: 'Domestic commercial vehicles (units)', x: MON, series: [{ name: '2025', values: M25.map(m => m[2]), fmt: 'num' }, { name: '2026', values: M26.map(m => m[2]), fmt: 'num' }], labels: 'none', source: SR },
      { type: 'column', title: 'Export 3W, Apr-Aug: +50% in 2026', unit: 'Export commercial vehicles (units)', x: MON, series: [{ name: '2025', values: M25.map(m => m[3]), fmt: 'num' }, { name: '2026', values: M26.map(m => m[3]), fmt: 'num' }], labels: 'none', source: SR },
    ] },
    { bullets: [
      `**FY26:** domestic 3W ${n0(A26.dom3w)} (+8%, above 5 lakh for the first time; with exports, 8.0 lakh); ICE share 73.8% (passenger 79.1%, goods 52.5%), CNG 87.9%. Electric L5: 90,342 units, 33.5% share, #1 within three years. E-rickshaws (Riki) started in 100+ cities.`,
      `**The shift.** E-autos were 44% of the L5 market in Q1FY27 and doubled; the PM E-DRIVE subsidy for e-3Ws ran out at the end of Q3FY26 and Bajaj absorbed it. Bajaj's e-3W margins are "healthy" and the EV portfolio (2W+3W) runs at a double-digit EBITDA margin.`,
      `**Exports:** 2.82 lakh in FY26 (+49%) and a record 1 lakh in Q1FY27 (+70%), >65% of India's 3W exports; capacity has been a constraint.`,
    ] },
    { callout: 'We model domestic 3W +11% in FY27E and +7% / +6% after; export 3W +35% in FY27E. The business stays very profitable, but the move to electric brings in rivals (Mahindra, TVS, many start-ups), so Bajaj\'s share of the segment is likely to drift down from ICE levels.' },
  ],
};

const bacl = {
  id: 'bacl', nav: 'Bajaj Auto Credit', kicker: 'Business line', title: 'Bajaj Auto Credit: a fast-growing, high-ROE captive lender that is still young',
  blocks: [
    { exhibit: { type: 'table', title: 'BACL in numbers (₹ crore)', head: ['', 'FY25', 'FY26', 'Q1FY27', 'FY27E', 'FY28E'], rows: [
      ['Total income', n0(BACL.fy25.income), n0(BACL.fy26.income), n0(BACL.q1fy27.income), n0(BACLF.base[0].rev), n0(BACLF.base[1].rev)],
      ['Finance cost', n0(BACL.fy25.finCost), n0(BACL.fy26.finCost), '~305', '–', '–'],
      ['Impairment (credit cost)', n0(BACL.fy25.impairment), n0(BACL.fy26.impairment), 'n.d.', '–', '–'],
      ['Profit after tax', n0(BACL.fy25.pat), n0(BACL.fy26.pat), n0(BACL.q1fy27.pat), n0(BACLF.base[0].pat), n0(BACLF.base[1].pat)],
      ['Loans (period end)', n0(BACL.fy25.loans), n0(BACL.fy26.loans), 'AUM ~20,000', '–', '–'],
      ['Net worth (period end)', n0(BACL.fy25.netWorth), n0(BACL.fy26.netWorth), '–', n0(BACLF.base[0].bookEnd), n0(BACLF.base[1].bookEnd)],
    ], source: 'BACL audited results (5-May-2026), Q1FY27 results (Capital Market via JM Financial), Q1FY27 call; GAM estimates' } },
    { bullets: [
      `**What it is.** A wholly owned NBFC started to finance Bajaj's own customers; 65-75% of Indian two- and three-wheelers are bought on credit. ~1.8 mn customers, ~6,200 outlets, penetration ~40-45% of Bajaj's retail. AAA-rated.`,
      `**Returns.** ROE ~23% in FY26 and >25% in Q1FY27; GNPA 1.85%, NNPA 1.0%; capital adequacy 19.5% (Tier 1 16.6%). Low operating cost because it is digital and sits inside the dealer network.`,
      `**The catch.** Credit cost was ₹543 cr in FY26, ~3.9% of average loans: a high-yield, high-loss book that has not been through a downturn. AUM grows ~70% a year, so the book is unseasoned. Its ₹16,000 cr of borrowings sit in Bajaj's consolidated balance sheet.`,
    ] },
    { callout: `**How we treat it:** BACL's funding cost is part of its EBITDA (patch), its borrowings are operating debt, and in the valuation we take its profit out of the P/E and value it on book instead: ${X.BACL_PB.base}x Sep-27E book of ₹${n0(X.baclBookSep27('base'))} cr, the median P/B of listed vehicle financiers (Cholamandalam ${X.BPB.CHOLAFIN}x, Shriram ${X.BPB.SHRIRAMFIN}x, M&M Financial ${X.BPB['M&MFIN']}x) at 30-Sep-2026. That is ₹${n0(X.SOTP.base.bacl)} a share, ~${Math.round(X.SOTP.base.bacl / X.SOTP.base.ps * 100)}% of our target.` },
  ],
};

module.exports = { domestic, exportsSec, threeW, bacl, ...require('./BAJAJ-AUTO.part2c') };
