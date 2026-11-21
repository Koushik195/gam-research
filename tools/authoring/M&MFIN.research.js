// M&M Finance report, part B: cover, story in charts, and the merger of part2-6 (business, history, industry,
// tailwind test, franchise and AUM mix, wheels, non-wheels and fee businesses, spread and NIM, asset quality,
// funding, capital, ROA tree and the value-trap question, moat, Q1FY27 and guidance, earnings quality, ownership,
// governance, forecasts, street, valuation, verdict, glossary, statement notes). Shared inputs in M&MFIN.ctx.js.
// Forecast and valuation figures are live tokens ({{...}}) that follow assumptions.json. As of 30-Sep-2026.
const X = require('./M&MFIN.ctx');
const { F, V, A, C, SG, AK, QK, n0, n1, n2, pc, pc1, price, pbMult, bvSep28, PB21, fwdPbChart, fwdPbNow, rating, ST, Q1, mv, insPctPbt, insCom, sectorPbDr, regimePb, CONS, overlay, overlayEps } = X;
const P2 = require('./M&MFIN.part2'), P3 = require('./M&MFIN.part3'), P4 = require('./M&MFIN.part4'), P5 = require('./M&MFIN.part5'), P6 = require('./M&MFIN.part6');

const cover = {
  headline: 'The clean-up worked, the returns problem did not go away: a ~13% ROE rural lender facing a drought year, priced about right',
  lead: `M&M Finance, the Mahindra group's rural lender (group AUM ₹1.46 lakh cr: cars and utility vehicles, commercial vehicles, used vehicles, tractors, plus small-business and housing loans), has finished a three-year clean-up: Stage 3 loans 3.45% (9.0% in FY21), Stage 2+3 at an eight-year low of 8.3%, credit cost 1.5% of assets and Q1FY27 profit up 75%. The street values it on **P/B (1.8-2.0x FY28E book)** and expects ROE to reach ~15%. We are more cautious: the 2026 monsoon ended ~13% below normal, IRDAI wants to cap the insurance commissions that lifted fee income, and growing 14-15% a year while paying out 36% of profit pushes leverage up and margins down. We forecast EPS of ₹${n1(F.eps[0])} / ₹${n1(F.eps[1])} / ₹${n1(F.eps[2])} for FY27-29E and ROE of 12.5-13.4%. Applying **${pbMult}x to Sep-28E book of ₹${n0(bvSep28)}** (its own ${PB21.med}x median forward P/B since 2021, adjusted for the sector's ${pc1(sectorPbDr)} move and for its higher level since 2023, ×${regimePb.toFixed(2)}) gives **{{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}**. P/E gives ₹${n0(mv('pe').value)}; the intrinsic cross-checks are lower (justified P/B ₹${n0(mv('jpb').value)}, residual income ₹${n0(mv('ri').value)}): the price already assumes a ~{{dcf.impliedRoe|pct0}} long-run ROE. Bull {{scen.bull.tp|inr}}; bear {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'The clean-up is real', p: `Stage 3 fell from 9.0% of loans in FY21 to ${Q1.gnpa}% in Jun-2026 and Stage 2+3 from over 10% to ${Q1.stage23}%; collection efficiency holds at 95-98%; provision cover is ${Q1.pcr}% with ₹${n0(overlay)} cr of management overlays on top. The whole vehicle-loan business now runs on a digital stack (Udaan) with a flat headcount of ~22,600. Q1FY27 delivered a 2.4% ROA and 14.3% ROE (standalone), the best since FY19.` },
    { h: 'But returns are still structurally low', p: `ROE has been 6-12% for seven years, below a ~13.4% cost of equity. The 2022 "Vision 2025" promised a 2.5% ROA, 7.5% NIM and 2x AUM; FY25 delivered 1.9%, 6.5% and 1.84x. The new FY31 aim (ROA 2.2-2.5%) gives a 13-15% ROE at the planned 6x leverage: about the cost of equity, not far above it. We model {{F.roe.0|pct}} / {{F.roe.1|pct}} / {{F.roe.2|pct}}.` },
    { h: 'Three headwinds arrived in September', p: `The monsoon ended ~13% below normal, the fourth-weakest since 2001 (tractors are 12% of AUM; after the back-to-back deficient monsoons of 2014-15, profit fell 43% by FY17). IRDAI's 23-Sep consultation would cap loan-linked insurance commission; M&M Finance earned ₹${n0(insCom)} cr of insurance commission in FY26, ${n1(insPctPbt)}% of pre-tax profit. And a repo hike was expected in October. The stock fell 20% from its August high.` },
    { h: 'Valuation: fair, not cheap', p: `At ₹${n2(price)} the stock trades at ${n2(fwdPbNow)}x our FY28E book and ${n1(price / F.eps[1])}x FY28E EPS, in line with its ${PB21.med}x median forward P/B since 2021. Our ${pbMult}x Sep-28E book gives {{dcf.tp|inr}}, below the street's median ₹${n0(CONS.medianTp)}: we see less ROE improvement than the brokers (FY28E ROE {{F.roe.1|pct}} vs their 13-15%). We would buy below ~₹${n0(X.buyBelow)}.` },
  ],
  keyRows: [['AUM (₹ cr)', 'aum', 'num'], ['AUM growth', 'aumGrowth', 'chg'], ['NII (₹ cr)', 'nii', 'num'], ['NIM (on AUM)', 'nim', 'pct'], ['Credit cost', 'creditCost', 'pct'], ['PAT (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n2'], ['BVPS (₹)', 'bvps', 'n1'], ['ROA (on assets)', 'roa', 'pct'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'RED' },
    { k: 'Earnings momentum', v: 'GREEN' },
    { k: 'Competitive position', v: 'AMBER' },
    { k: 'Regulation', v: 'AMBER' },
    { k: 'Valuation', v: 'AMBER' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): the first read of the weak monsoon on tractor and rural collections; Q2 is seasonally soft and Q1 pulled tractor buying forward.',
    'IRDAI\'s insurance-distribution reforms: consultation paper of 23-Sep-2026, comments due 25-Oct-2026; caps of ~2-5% on loan-linked commission would cut fee income.',
    'RBI\'s October 2026 policy: most economists polled expected a 25bp repo hike; 44% of M&M Finance\'s borrowings are floating-rate.',
    `The ₹${n0(overlay)} cr management overlays: built "specifically" for a compromised monsoon; using them would protect FY27 profit (worth ~₹${n1(overlayEps)} a share after tax if released in full).`,
    'MRHFL merger: board approval on 5-Aug-2026, effective 1-Apr-2027 subject to NCLT, RBI and NHB approval; mortgages move into the parent.',
  ],
};

// ---------------------------------------------------------------- Story in charts
const QM = SG.mixPct.find(r => r.q === 'Q1FY27');
const mixKeys = SG.lines.filter(l => l.key !== 'mrhfl').map(l => l.key), mixName = Object.fromEntries(SG.lines.map(l => [l.key, l.name]));
const SHORT = { pv: 'Cars & UVs', cv: 'CV & CE', used: 'Used vehicles', tractor: 'Tractors', tw3: 'Three-wheelers', sme: 'SME', others: 'Others' };
const gnpaX = [...AK.map(k => k.fy), 'Q1FY27'], gnpaV = [...AK.map(k => k.gnpa), Q1.gnpa];
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: 'Group AUM: flat through Covid, growth slowing every year since FY23', unit: 'Group lending AUM at March (₹ \'000 crore)', x: 'fin.labels', from: 'FY18', to: 'FY29E', series: [{ name: 'AUM', ref: 'fin.aum', scale: 0.001, fmt: 'num' }], labels: 'all', source: 'Company presentations; GAM estimates FY27-29E' },
      { type: 'hbar', title: 'Still a vehicle lender: wheels are 88% of MMFSL (83% with housing)', unit: 'Share of MMFSL business assets, Jun-2026 (%); MRHFL housing adds ₹8,976 cr outside this', x: mixKeys.map(k => SHORT[k]), series: [{ name: 'Share', values: mixKeys.map(k => QM[k]), fmt: 'pct' }], labels: 'all', source: 'Q1FY27 presentation p22' },
    ] },
    { pair: [
      { type: 'column', title: 'Bad loans: from 9% to 3.5% in five years', unit: 'Gross Stage 3 (% of business assets), March; Q1FY27 = Jun-2026', x: gnpaX, series: [{ name: 'Gross Stage 3', values: gnpaV, fmt: 'n1' }], labels: 'all', highlight: 'Q1FY27', source: 'Company presentations (Q4FY20-Q1FY27)' },
      { type: 'line', title: 'Credit cost: 5% in the Covid year, ~1.8% now', unit: 'Provisions ÷ average group AUM (%)', x: 'fin.labels', from: 'FY19', to: 'FY29E', series: [{ name: 'Credit cost', ref: 'fin.creditCost', fmt: 'pct' }], labels: 'all', min: 0, max: 6, source: 'Annual reports, company; GAM estimates' },
    ] },
    { pair: [
      { type: 'line', title: 'Yields fell faster than funding costs since FY21', unit: '% of average AUM (yield, NIM) or borrowings (cost)', x: 'fin.labels', from: 'FY19', to: 'FY29E', series: [{ name: 'Yield on AUM', ref: 'fin.yieldOnAum', fmt: 'pct' }, { name: 'Cost of funds', ref: 'fin.costOfFunds', fmt: 'pct' }, { name: 'NIM', ref: 'fin.nim', fmt: 'pct' }], labels: 'ends', min: 5, max: 17, source: 'Company, Screener.in; GAM estimates' },
      { type: 'line', title: 'ROE: better, but around the cost of equity', unit: 'ROE (%); red line = 13.4% cost of equity', x: 'fin.labels', from: 'FY16', to: 'FY29E', series: [{ name: 'ROE', ref: 'fin.roe', fmt: 'pct' }], labels: 'all', min: 0, max: 20, lines: [{ v: 13.4, text: 'Cost of equity', color: '#b4232a' }], source: 'Screener.in; GAM estimates' },
    ] },
    { pair: [
      { type: 'line', title: `Forward P/B: ${n2(fwdPbNow)}x on 30-Sep vs a ${PB21.med}x median since 2021`, unit: `Price ÷ next full-year book value per share (x); orange line = our ${pbMult.toFixed(1)}x`, x: fwdPbChart.map(x => x[0]), series: [{ name: 'Forward P/B', values: fwdPbChart.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 2, min: 0, lines: [{ v: PB21.med, text: `Median since 2021: ${PB21.med}x` }, { v: pbMult, text: '', color: '#cf8f1f' }], source: 'Screener.in prices; book value per share; GAM estimates FY27-28E; last point = 30-Sep-2026 close' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (Jul-Sep 2026)', unit: `₹ per share; CMP ₹${n2(price)}`, x: [...ST.map(s => s.broker), 'GAM (base)'], series: [{ name: 'Target', values: [...ST.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: price, axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes, Trendlyne and press reports (22-Jul to 24-Sep 2026), GAM Research' },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.franchise, P3.wheels, P3.nonwheels, P3.spread, P3.quality, P4.funding, P4.capital, P4.roaTree, p.financials, P4.moat, P4.guidance, P4.earningsQuality, p.balance, P5.ownership(p.ownershipBase), P5.governance, P5.forecasts, P5.street, P6.valuation, P6.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
