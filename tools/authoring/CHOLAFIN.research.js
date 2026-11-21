// Cholamandalam report, part B: cover, story in charts, and the merger of part2-6 (business, history, industry,
// tailwind test, franchise and AUM mix, three segment chapters, spread and NIM, asset quality, funding, capital,
// ROA tree, moat, Q1FY27 and guidance, earnings quality, ownership, governance, forecasts, street, valuation,
// verdict, glossary, statement notes). Shared inputs in CHOLAFIN.ctx.js. Forecast and valuation figures are live
// tokens ({{...}}) that follow assumptions.json. As of 30-Sep-2026.
const X = require('./CHOLAFIN.ctx');
const { F, V, A, C, SG, n0, n1, pc, pc1, price, pbMult, bvSep28, PB21, fwdPbChart, fwdPbNow, rating, ST, Q1, mv, insPctPbt, insCom, sectorPbDr } = X;
const P2 = require('./CHOLAFIN.part2'), P3 = require('./CHOLAFIN.part3'), P4 = require('./CHOLAFIN.part4'), P5 = require('./CHOLAFIN.part5'), P6 = require('./CHOLAFIN.part6');

const cover = {
  headline: 'A diversified compounder trading below its own history; the catch is asset quality in vehicles and a regulator now looking at insurance commissions',
  lead: `Cholamandalam (Chola), the Murugappa group's lender, has grown profit ~25% a year for a decade at a 19-21% return on equity, moving from a vehicle financier to an eight-engine lender: vehicles (53% of AUM), loans against property and home loans (33%), and newer small-business, consumer and gold loans. Q1FY27 was strong (profit +46%, ROE 21.2%, credit cost down to 1.5%), but Stage 3 loans rose to 3.29% and vehicle-finance Stage 3 to 4.05%. The street values Chola on **P/B (3.8-4.0x FY28E book)**. We forecast EPS of ₹${n1(F.eps[0])} / ₹${n1(F.eps[1])} / ₹${n1(F.eps[2])} for FY27-29E at ~19-20% ROE, including a haircut for IRDAI's proposed caps on insurance commission. Applying **${pbMult}x to Sep-28E book of ₹${n0(bvSep28)}** (its own ${PB21.med}x median since 2021, adjusted for the sector's ${pc1(sectorPbDr)} move) gives **{{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}**, only just above our 15% line. The intrinsic cross-checks (justified P/B ₹${n0(mv('jpb').value)}, residual income ₹${n0(mv('ri').value)}) are below the price, which already implies a ~{{dcf.impliedRoe|pct0}} ROE for ever. Bull {{scen.bull.tp|inr}}; bear {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'Eight engines, all firing for the first time', p: `In FY25 growth came from three businesses; by Q1FY27 all eight were growing: vehicles +19%, LAP +23%, home loans +22%, SME +39%, SBPL +40%, CSEL +12% and gold to ₹2,143 cr from ₹97 cr. Guidance is 20-23% AUM growth ("23% ... doable"); we model {{F.aumGrowth.0|pct}} / {{F.aumGrowth.1|pct}} / {{F.aumGrowth.2|pct}}. Equity grows ~20% a year from retained profit, so growth needs no new capital at this pace.` },
    { h: 'Credit costs are turning, but the evidence is mixed', p: `Loan losses were 1.6% of assets in FY26 before a ₹200 cr overlay (1.7% with it) and 1.5% in Q1FY27, meeting FY27 guidance in the seasonally weakest quarter. Against that, Stage 2+3 rose 49bp in the quarter and vehicle-finance Stage 3 hit 4.05%. We model {{F.creditCost.0|pct}} of AUM (about 1.4-1.5% on the company's asset basis), keep the overlay, and do not extrapolate Q1.` },
    { h: 'Two new risks the street had not priced on 30 September', p: `IRDAI's 23-Sep-2026 consultation proposes capping commission on loan-linked insurance at ~2-5%. Chola earned ₹${n0(insCom)} cr of insurance commission in FY26, ${n1(insPctPbt)}% of pre-tax profit; we cut fee income by ~0.15% of AUM from FY28E. Rate hikes are the second: Chola is wholesale-funded and AA+ rated (not AAA), and most economists expected a repo hike in October.` },
    { h: 'Valuation: below its history, not cheap on fundamentals', p: `At ₹${n0(price)} the stock trades at ${n1(fwdPbNow)}x our FY28E book and ${n1(price / F.eps[1])}x FY28E EPS, against a ${PB21.med}x median forward P/B since 2021, after a ~12% fall in the September sell-off. Our ${pbMult}x Sep-28E book gives {{dcf.tp|inr}} ({{dcf.upside|chg}}). The margin over the BUY line is thin: at 3.1x the target would be a HOLD.` },
  ],
  keyRows: [['AUM (₹ cr)', 'aum', 'num'], ['AUM growth', 'aumGrowth', 'chg'], ['NII (₹ cr)', 'nii', 'num'], ['NIM (on AUM)', 'nim', 'pct'], ['Credit cost', 'creditCost', 'pct'], ['PAT (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n2'], ['BVPS (₹)', 'bvps', 'n1'], ['ROA (on assets)', 'roa', 'pct'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'AMBER' },
    { k: 'Earnings momentum', v: 'GREEN' },
    { k: 'Competitive position', v: 'AMBER' },
    { k: 'Regulation', v: 'AMBER' },
    { k: 'Valuation', v: 'AMBER' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): management promised the usual Q2-Q3 fall in Stage 2 and 3 after Q1\'s seasonal rise; disbursements should normalise after the cheque-clearance change.',
    'IRDAI\'s insurance-distribution reforms: consultation paper of 23-Sep-2026, comments due 25-Oct-2026; caps of ~2-5% on loan-linked commission would hit Chola\'s fee income.',
    'RBI\'s October 2026 policy: most economists polled expected a 25bp repo hike; the CFO already assumes 25-50bp and a 5-10bp rise in funding costs in H2FY27.',
    'Gold loans: 360 new branches and an AUM target of ~₹5,000 cr by Mar-27 (₹2,143 cr in Jun-2026).',
    'The ₹200 cr management overlay: kept intact in Q1; management will "take a view on it at the end of this financial year".',
  ],
};

// ---------------------------------------------------------------- Story in charts
const QN = SG.quarterly.find(q => q.q === 'Q1FY27');
const mixKeys = SG.lines.map(l => l.key), mixName = Object.fromEntries(SG.lines.map(l => [l.key, l.name]));
const AK = C.annualKpis;
const grp = a => [a.vf, a.lap + a.sme + a.sbpl, a.hl + a.csel + a.gold];
const periods = [...SG.annual, QN];
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: 'Business AUM: ₹0.43 to ₹2.24 lakh crore in eight years', unit: 'Business AUM at March (₹ \'000 crore)', x: 'fin.labels', from: 'FY18', to: 'FY29E', series: [{ name: 'AUM', ref: 'fin.aum', scale: 0.001, fmt: 'num' }], labels: 'all', source: 'Company presentations; GAM estimates FY27-29E' },
      { type: 'hbar', title: 'Vehicles are still half the book; mortgages a third', unit: 'Share of business AUM, Jun-2026 (%)', x: mixKeys.map(k => mixName[k]), series: [{ name: 'Share', values: mixKeys.map(k => Math.round(QN[k] / QN.total * 1000) / 10), fmt: 'pct' }], labels: 'all', source: 'Q1FY27 presentation p13' },
    ] },
    { pair: [
      { type: 'stacked', title: 'The mix has shifted from vehicles to MSME and consumer loans', unit: 'Business AUM by ecosystem (₹ \'000 crore)', x: periods.map(a => a.fy || a.q), series: [
        { name: 'Vehicle finance', values: periods.map(a => Math.round(grp(a)[0] / 100) / 10), fmt: 'n1' },
        { name: 'MSME (LAP, SME, SBPL)', values: periods.map(a => Math.round(grp(a)[1] / 100) / 10), fmt: 'n1' },
        { name: 'Consumer (HL, CSEL, gold)', values: periods.map(a => Math.round(grp(a)[2] / 100) / 10), fmt: 'n1' },
      ], minLabel: 15, source: 'Q4FY24 and Q1FY27 presentations' },
      { type: 'column', title: 'Loan losses: up for three years, back to 1.5% in Q1', unit: 'Loan losses ÷ average assets (%), company basis; Q1FY27 annualised; line = FY27 guidance ~1.5%', x: [...AK.map(k => k.fy), 'Q1FY27'], series: [{ name: 'Credit cost', values: [...AK.map(k => k.creditCostCo), Q1.creditCostCo], fmt: 'n1' }], labels: 'all', highlight: 'Q1FY27', lines: [{ v: 1.5, text: '' }], source: 'Q1FY27 presentation p10, p18' },
    ] },
    { pair: [
      { type: 'line', title: 'Funding costs fell in FY26; margin holds ~7% of AUM', unit: '% of average AUM (yield, NIM) or borrowings (cost)', x: 'fin.labels', from: 'FY21', to: 'FY29E', series: [{ name: 'Yield on AUM', ref: 'fin.yieldOnAum', fmt: 'pct' }, { name: 'Cost of funds', ref: 'fin.costOfFunds', fmt: 'pct' }, { name: 'NIM', ref: 'fin.nim', fmt: 'pct' }], labels: 'ends', min: 5, max: 16, source: 'Company, Screener.in; GAM estimates' },
      { type: 'line', title: 'ROE steady at 19-21%; ROA ~2.4% on assets', unit: 'ROE and ROA on total assets (%)', x: 'fin.labels', from: 'FY18', to: 'FY29E', series: [{ name: 'ROE', ref: 'fin.roe', fmt: 'pct' }, { name: 'ROA', ref: 'fin.roa', fmt: 'pct' }], labels: 'ends', min: 0, max: 24, source: 'Screener.in; GAM estimates' },
    ] },
    { pair: [
      { type: 'line', title: `Forward P/B: ${n1(fwdPbNow)}x now vs a ${PB21.med}x median since 2021`, unit: `Price ÷ next full-year book value per share (x); orange line = our ${pbMult.toFixed(1)}x`, x: fwdPbChart.map(x => x[0]), series: [{ name: 'Forward P/B', values: fwdPbChart.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 2, lines: [{ v: PB21.med, text: `Median since 2021: ${PB21.med}x` }, { v: pbMult, text: '', color: '#cf8f1f' }], source: 'Screener.in prices; book value per share; GAM estimates FY27-28E' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (Jul-Sep 2026)', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...ST.map(s => s.broker), 'GAM (base)'], series: [{ name: 'Target', values: [...ST.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: price, axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes and Trendlyne (27-Jul to 8-Sep 2026), GAM Research' },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.franchise, P3.vehicle, P3.mortgages, P3.newbiz, P3.spread, P3.quality, P4.funding, P4.capital, P4.roaTree, p.financials, P4.moat, P4.guidance, P4.earningsQuality, p.balance, P5.ownership(p.ownershipBase), P5.governance, P5.forecasts, P5.street, P6.valuation, P6.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
