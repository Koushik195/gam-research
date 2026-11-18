// Bajaj Finance report, part B: cover, story in charts, and the merger of part2-6 (business, history,
// industry, tailwind test, franchise and AUM mix, spread and NIM, asset quality, funding, capital, ROA tree,
// moat, Q1FY27 and guidance, earnings quality, ownership, governance, forecasts, street, valuation, verdict,
// glossary, statement notes). Shared inputs in BAJFINANCE.ctx.js. Forecast and valuation figures are live
// tokens ({{...}}) that follow assumptions.json. As of 30-Sep-2026.
const X = require('./BAJFINANCE.ctx');
const { F, V, A, C, SG, n0, n1, pc, price, pbMult, bvSep28, PB21, fwdPb, fwdPbNow, rating, ST, Q1, b, epsAdj26, mv, tpRaise } = X;
const P2 = require('./BAJFINANCE.part2'), P3 = require('./BAJFINANCE.part3'), P4 = require('./BAJFINANCE.part4'), P5 = require('./BAJFINANCE.part5'), P6 = require('./BAJFINANCE.part6');

const cover = {
  headline: 'The credit cycle has turned for India\'s largest consumer lender and the stock sits below its usual multiple; the catch is that the price already assumes ~20% returns for ever',
  lead: `Bajaj Finance lends to 124 million Indians across consumer durables, personal, gold, small-business and home loans, and has compounded profit ~31% a year for a decade at an average return on equity of ~20%. After two costly years for credit (loan losses 2.1% of loans in FY26, incl. a ₹1,406 cr one-off charge), Q1FY27 showed the turn: losses 1.31% before a ₹296 cr precautionary overlay, profit +28%, ROE 20.4%. The street values the stock on **P/B (4.2-4.8x FY28E or Sep-28E book)**. We forecast EPS of ₹${n1(F.eps[0])} / ₹${n1(F.eps[1])} / ₹${n1(F.eps[2])} for FY27-29E and ROE of ~20%. Applying **${pbMult}x to Sep-28E book of ₹${n0(bvSep28)}** (derived from its own ${PB21.med}x median since 2021, the sector's move and slower growth) gives **{{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}.** Be clear about the risk: our intrinsic cross-checks (justified P/B ₹${n0(mv('jpb').value)}, residual income ₹${n0(mv('ri').value)}) sit below the price, which already implies a ~{{dcf.impliedRoe|pct0}} ROE for ever. Bull {{scen.bull.tp|inr}}; bear {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'Credit costs are coming down, and that drives FY27', p: `Loan losses were 2.09% of average loans in FY26 (1.93% before one-offs) and 1.54% in Q1FY27 including a ₹296 cr overlay; Stage 2 and 3 loans fell to 1.87%, and new-loan vintages are "below FY'20, our pre-COVID benchmark" (MD). Guidance is 1.45-1.60% for FY27. At 1.50% of AUM, profit grows {{F.patGrowth.0|pct}} in FY27E (~26% on FY26 profit before one-offs).` },
    { h: 'A franchise few lenders can copy', p: `124 million customers, 5.1 million added in Q1 alone, 63% of business from existing customers, 2.5 lakh points of sale, a ₹68,500 cr deposit book and AAA ratings. Opex is 33% of income even after funding gold-loan and microfinance branch roll-outs. Gold loans (+112%), consumer finance (+38-49%) and mortgages (+27%) carry growth while small-business loans are pruned.` },
    { h: 'But margins are slipping and the regulator is circling', p: `NIM falls from {{fin.nim.11|pct}} in FY26 to {{F.nim.2|pct}} by FY29E in our model as the mix shifts to cheaper secured loans. The RBI's draft rule of 6-Aug-2026 would bar NBFCs from revolving credit; brokers put Bajaj's flexi loans at ~13-15% of AUM. This is the third RBI action touching its consumer book since Nov-2023, and a fresh equity raise was put to the board on 24-Sep-2026.` },
    { h: 'Valuation: below its history, not cheap on fundamentals', p: `At ₹${n0(price)} the stock trades at ${n1(fwdPbNow)}x our FY28E book and ${n1(price / F.eps[1])}x FY28E EPS, against a ${PB21.med}x median forward P/B since 2021. Our ${pbMult}x Sep-28E book gives {{dcf.tp|inr}}. A ₹15,000 cr raise at today's price would lift book per share ~6% (target ~₹${n0(tpRaise)} at the same multiple) but cut ROE by ~1.3pp, so we treat it as roughly neutral.` },
  ],
  keyRows: [['AUM (₹ cr)', 'aum', 'num'], ['AUM growth', 'aumGrowth', 'chg'], ['NII (₹ cr)', 'nii', 'num'], ['NIM', 'nim', 'pct'], ['Credit cost', 'creditCost', 'pct'], ['PAT (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n2'], ['BVPS (₹)', 'bvps', 'n1'], ['ROA (on assets)', 'roa', 'pct'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'AMBER' },
    { k: 'Earnings momentum', v: 'GREEN' },
    { k: 'Competitive position', v: 'GREEN' },
    { k: 'Regulation', v: 'RED' },
    { k: 'Valuation', v: 'AMBER' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): management promised to revisit FY27 guidance (AUM growth, credit cost, overlays) after one more quarter.',
    'The equity raise: the board meets at the start of October to consider a QIP and/or a preferential issue; size and price will set the dilution.',
    'RBI\'s final rules on revolving credit for NBFCs (draft of 6-Aug-2026): how much of the ~13-15% flexi book has to be re-papered, and at what yield.',
    'Sell-down of Bajaj Housing Finance from 86.7% to 75%, which management called the "first protocol" for capital.',
    'Succession: a decision on Rajeev Jain\'s renewal (term ends Mar-2028) is due by December 2027-January 2028.',
  ],
};

// ---------------------------------------------------------------- Story in charts
const A26 = SG.annual.find(a => a.fy === 'FY26');
const mixKeys = SG.lines.map(l => l.key), mixName = Object.fromEntries(SG.lines.map(l => [l.key, l.name.replace(/ \(.*\)$/, '')]));
const ccCo = C.annualKpis.map(k => k.creditCost);
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: 'AUM: from ₹0.8 to ₹5.1 lakh crore in eight years', unit: 'Consolidated AUM at March (₹ \'000 crore)', x: 'fin.labels', from: 'FY18', to: 'FY29E', series: [{ name: 'AUM', ref: 'fin.aum', scale: 0.001, fmt: 'num' }], labels: 'all', source: 'Company presentations; GAM estimates FY27-29E' },
      { type: 'hbar', title: 'A lender with ten businesses; mortgages are a third', unit: 'Share of consolidated AUM, Mar-2026 (%)', x: mixKeys.map(k => mixName[k]), series: [{ name: 'Share', values: mixKeys.map(k => Math.round(A26[k] / A26.total * 1000) / 10), fmt: 'pct' }], labels: 'all', source: 'Q4FY26 presentation p63 (GAM grouping)' },
    ] },
    { pair: [
      { type: 'column', title: 'Loan losses: two expensive years, now turning', unit: 'Loan losses ÷ average AUF (%), company basis; Q1FY27 annualised; dashed lines = FY27 guidance of 1.45-1.60%', x: [...C.annualKpis.map(k => k.fy), 'Q1FY27'], series: [{ name: 'Credit cost', values: [...ccCo, Q1.creditCost], fmt: 'pct' }], labels: 'all', highlight: 'Q1FY27', lines: [{ v: 1.45, text: '' }, { v: 1.6, text: '' }], source: 'Q1FY27 presentation p26-27, p37 (after the Q4FY26 presentation change)' },
      { type: 'line', title: 'Spread is narrowing as the mix moves to secured loans', unit: '% of average AUM (yield) or borrowings (cost)', x: 'fin.labels', from: 'FY22', to: 'FY29E', series: [{ name: 'Yield on AUM', ref: 'fin.yieldOnAum', fmt: 'pct' }, { name: 'Cost of funds', ref: 'fin.costOfFunds', fmt: 'pct' }, { name: 'NIM', ref: 'fin.nim', fmt: 'pct' }], labels: 'ends', min: 5, max: 18, source: 'Company, Screener.in; GAM estimates' },
    ] },
    { pair: [
      { type: 'column', title: 'Customer franchise: 26 million to 124 million', unit: 'Customers (million), March; Q1FY27 = Jun-2026', x: [...C.annualKpis.map(k => k.fy), 'Q1FY27'], series: [{ name: 'Customers', values: [...C.annualKpis.map(k => k.customersMm), Q1.customersMm], fmt: 'n1' }], labels: 'all', highlight: 'Q1FY27', source: 'Q1FY27 presentation p26, p49' },
      { type: 'line', title: 'ROE back to ~20% as credit costs fall', unit: 'ROE and ROA on total assets (%), attributable', x: 'fin.labels', from: 'FY18', to: 'FY29E', series: [{ name: 'ROE', ref: 'fin.roe', fmt: 'pct' }, { name: 'ROA', ref: 'fin.roa', fmt: 'pct' }], labels: 'ends', min: 0, max: 26, source: 'Screener.in; GAM estimates' },
    ] },
    { pair: [
      { type: 'line', title: `Forward P/B: from ${PB21.max}x in 2021 to ~4x`, unit: `Price ÷ next full-year book value per share (x); ${n1(fwdPbNow)}x at the 30-Sep-2026 close; orange line = our ${pbMult.toFixed(1)}x`, x: fwdPb.map(x => x[0]), series: [{ name: 'Forward P/B', values: fwdPb.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 2, lines: [{ v: PB21.med, text: `Median since 2021: ${PB21.med}x` }, { v: pbMult, text: '', color: '#cf8f1f' }], source: 'Screener.in prices; book value per share on attributable profit; GAM estimates FY27-28E' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (Jul-Sep 2026)', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...ST.map(s => s.broker.replace(/ \(.*\)$/, '')), 'GAM (base)'], series: [{ name: 'Target', values: [...ST.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: price, axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes and press roundups (31-Jul to 24-Sep 2026), GAM Research' },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.franchise, P3.spread, P3.quality, P4.funding, P4.capital, P4.roaTree, p.financials, P4.moat, P4.guidance, P4.earningsQuality, p.balance, P5.ownership(p.ownershipBase), P5.governance, P5.forecasts, P5.street, P6.valuation, P6.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
