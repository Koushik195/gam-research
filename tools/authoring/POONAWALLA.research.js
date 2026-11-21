// Poonawalla Fincorp report, part B: cover, story in charts, and the merger of part2-6 (business, history,
// industry, tailwind test, franchise and AUM mix, spread and NIM, asset quality, funding, capital, ROA tree, moat,
// Q1FY27 and guidance, earnings quality, ownership, governance, forecasts, street, valuation, verdict, glossary,
// statement notes). Shared inputs in POONAWALLA.ctx.js. Forecast and valuation figures are live tokens ({{...}})
// that follow assumptions.json. As of 30-Sep-2026.
const X = require('./POONAWALLA.ctx');
const { F, V, A, C, SG, AS, n0, n1, pc, price, pbMult, bvSep28, PBX, fwdPbChart, fwdPbNow, rating, ST, Q1, QK, mv, NORAISE, ASOF_TXT } = X;
const P2 = require('./POONAWALLA.part2'), P3 = require('./POONAWALLA.part3'), P4 = require('./POONAWALLA.part4'), P5 = require('./POONAWALLA.part5'), P6 = require('./POONAWALLA.part6');

const cover = {
  headline: 'The clean-up worked and the rebuild is growing fast; the price already assumes management hits a return target it has not yet come close to',
  lead: `Poonawalla Fincorp (the former Magma Fincorp, controlled by the Poonawalla family since 2021) is a ₹67,000 cr consumer and small-business lender. After a FY25 loss from a blown-up short-ticket personal-loan book, a new HDFC Bank-trained team launched six products and grew AUM 62.5% in a year; credit cost fell from ~3.1% to 2.40% and ROA rose from 0.68% to 1.98% in four quarters (Q1FY27). The street values the stock on **P/B (1.9-3.2x FY28E book)**. We forecast EPS of ₹${n1(F.eps[0])} / ₹${n1(F.eps[1])} / ₹${n1(F.eps[2])} for FY27-29E and ROE of {{F.roe.0|pct0}}-{{F.roe.2|pct0}}. Applying **${pbMult}x to Sep-28E book of ₹${n0(bvSep28)}** (its own forward P/B median of ${PBX.med}x since 2021 with the FY25-26 trough left out, adjusted for the sector) gives **{{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}**, a fragile one. Our intrinsic cross-checks (justified P/B ₹${n0(mv('jpb').value)}, residual income ₹${n0(mv('ri').value)}) are less than half the price, which implies a ~{{dcf.impliedRoe|pct0}} ROE for ever; and the BUY needs a FY28E equity raise at a premium to book (without it ₹${n0(NORAISE.tp)}, a HOLD). Bull {{scen.bull.tp|inr}}; bear {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'The clean-up worked, and the new engines are running', p: `The erstwhile short-ticket personal-loan book fell from 21% of loans (Sep-2024) to 8% (Mar-2025) after a ₹666 cr accelerated provision. Six-month delinquency on new loans fell from 6.74% (Apr-Jun 2024 cohort) to 0.64% (Oct-Dec 2025). New products (Prime PL, gold, consumer durables, CV, education) were 26% of Q1FY27 disbursements; AUM grew 62.5% to ₹67,054 cr; PAT rose from ₹63 cr to ₹308 cr a quarter in a year.` },
    { h: 'But growth is not yet profitable growth', p: `FY26 ROE was ~6%. Even on our improving forecast ROE is {{F.roe.0|pct}} / {{F.roe.1|pct}} / {{F.roe.2|pct}} in FY27-29E, below our ${n1(V.ke)}% cost of equity. 47% of AUM is unsecured, most new books are under two years old, and growth eats capital: ₹4,000 cr raised from the promoter and a QIP in seven months, and we pencil in another ₹3,000 cr in FY28E.` },
    { h: 'Targets are ambitious and have moved before', p: `The previous team guided a 4-4.5% ROA in Apr-2024 and delivered a loss. The current MD's 3-3.5% ROA target was "3 years from the day I joined" (Jun-2024) in Apr-2025 and a "June exit of 2028" in Jul-2026. We get to ~{{F.roaAum.2|pct}} by FY29E; brokers to 2.1-2.4% in FY28E. Reaching 3% needs credit cost near 1.5%, a level this book has not shown.` },
    { h: 'Valuation: fair on the street\'s yardstick, rich on fundamentals', p: `At ₹${n0(price)} the stock trades at ${n1(V.currentPb)}x Mar-26 book but ${n1(fwdPbNow)}x our FY28E book, below its ${PBX.med}x ex-trough median. ${pbMult}x Sep-28E book gives {{dcf.tp|inr}}. On returns it is expensive: residual income at our ROE path is ₹${n0(mv('ri').value)}; the price needs a ~{{dcf.impliedRoe|pct0}} long-run ROE, roughly management's target sustained for ever.` },
  ],
  keyRows: [['AUM (₹ cr)', 'aum', 'num'], ['AUM growth', 'aumGrowth', 'chg'], ['NII (₹ cr)', 'nii', 'num'], ['NIM', 'nim', 'pct'], ['Credit cost', 'creditCost', 'pct'], ['PAT (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n2'], ['BVPS (₹)', 'bvps', 'n1'], ['ROA (on assets)', 'roa', 'pct'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'RED' },
    { k: 'Earnings momentum', v: 'GREEN' },
    { k: 'Competitive position', v: 'AMBER' },
    { k: 'Governance', v: 'AMBER' },
    { k: 'Valuation', v: 'AMBER' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): whether credit cost keeps falling from 2.40% while ~400 gold branches are added and opex absorbs them.',
    'The next equity raise: the board\'s 12-month enabling approval (Jan-2026) was for ₹5,500 cr, of which ₹2,500 cr was used; size and price will set the dilution and the book per share.',
    'Seasoning of the new books (Prime PL, consumer durables, CV, gold, education) as they pass 12-24 months on book: early delinquency and Stage 2/3 by product.',
    'ROA progress against the 3-3.5% target (June-2028 exit): we model ~2.1-2.2% in FY28-29E.',
    'Regulation: RBI\'s draft on revolving credit (6-Aug-2026) and IRDAI\'s consultation on loan-linked insurance commissions (23-Sep-2026), which touches cross-sell income (₹91 cr in Q1FY27).',
  ],
};

// ---------------------------------------------------------------- Story in charts
const QN = SG.quarterly.find(q => q.q === 'Q1FY27');
const mixKeys = SG.lines.map(l => l.key).filter(k => QN[k] > 1), mixName = Object.fromEntries(SG.lines.map(l => [l.key, l.name]));
const mixSorted = mixKeys.sort((a, c) => QN[c] - QN[a]);
const aumX = [...SG.annual.map(a => a.fy), 'Q1FY27', ...F.years], aumV = [...SG.annual.map(a => a.total), Q1.aum, ...F.aum].map(v => Math.round(v / 100) / 10);
const ED = SG.earlyDelinquency;
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: 'AUM: ₹10,000 cr to ₹67,000 cr in five years', unit: 'AUM at March (₹ \'000 crore); Q1FY27 = Jun-2026; FY27-29E GAM', x: aumX, series: [{ name: 'AUM', values: aumV, fmt: 'n1' }], labels: 'all', highlight: 'Q1FY27', source: 'Company presentations; Motilal Oswal (FY21-22, standalone); GAM estimates' },
      { type: 'hbar', title: 'Thirteen products; LAP and digital personal loans lead', unit: 'Share of AUM, Jun-2026 (%)', x: mixSorted.map(k => mixName[k]), series: [{ name: 'Share', values: mixSorted.map(k => Math.round(QN[k] / QN.total * 1000) / 10), fmt: 'pct' }], labels: 'all', source: 'Q1FY27 presentation p12-13' },
    ] },
    { pair: [
      { type: 'column', title: 'Credit cost has fallen for five straight quarters', unit: 'Credit cost, % of average AUM (company basis); Q4FY25 and Q1FY26 read from charts', x: QK.map(q => q.q), series: [{ name: 'Credit cost', values: QK.map(q => q.creditCostCo), fmt: 'n2' }], labels: 'all', highlight: 'Q1FY27', min: 0, max: 3.5, source: 'Company presentations Q4FY26-Q1FY27' },
      { type: 'column', title: 'ROA tripled in a year, but the target is 3-3.5%', unit: 'ROA on average total assets, quarterly annualised (%); dashed lines = 3.0-3.5% target (Jun-2028 exit)', x: QK.map(q => q.q), series: [{ name: 'ROA', values: QK.map(q => q.roaCo), fmt: 'n2' }], labels: 'all', highlight: 'Q1FY27', lines: [{ v: 3, text: '' }, { v: 3.5, text: '' }], min: 0, max: 4, source: 'Company presentations; Q1FY27 call (target)' },
    ] },
    { pair: [
      { type: 'column', title: 'New loans go bad far less often than in 2024', unit: '6-MoB 30+: share of a quarter\'s disbursements 30+ days overdue after six months (%), retail, by sourcing quarter', x: ED.head, series: [{ name: '6-MoB 30+', values: ED.values, fmt: 'n2' }], labels: 'all', highlight: 'Q3FY26', source: 'Q4FY26 and Q1FY27 presentations' },
      { type: 'line', title: 'ROE stays below the cost of equity to FY29E', unit: `ROE (%); red line = our ${n1(V.ke)}% cost of equity; FY24 incl. one-offs`, x: 'fin.labels', from: 'FY24', to: 'FY29E', series: [{ name: 'ROE', ref: 'fin.roe', fmt: 'pct' }], labels: 'all', min: -5, max: 25, lines: [{ v: V.ke, text: `Cost of equity ${n1(V.ke)}%`, color: '#b4232a' }], source: 'Screener.in; GAM estimates' },
    ] },
    { pair: [
      { type: 'line', title: `Forward P/B: ${n1(fwdPbNow)}x at the 30-Sep close, below the ${PBX.med}x ex-trough median`, unit: `Price ÷ next full-year book value per share (x); orange line = our ${pbMult}x; last point = ${ASOF_TXT} close`, x: fwdPbChart.map(x => x[0]), series: [{ name: 'Forward P/B', values: fwdPbChart.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, min: 0, lines: [{ v: PBX.med, text: `Median ex-trough: ${PBX.med}x` }, { v: pbMult, text: '', color: '#cf8f1f' }], source: 'Screener.in prices; book value per share; GAM estimates FY27-28E' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (May-Sep 2026)', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...ST.map(s => s.broker), 'GAM (base)'], series: [{ name: 'Target', values: [...ST.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: price, axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes and summaries dated 5-May to 10-Aug 2026 (standing on 30-Sep), GAM Research' },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.franchise, P3.spread, P3.quality, P4.funding, P4.capital, P4.roaTree, p.financials, P4.moat, P4.guidance, P4.earningsQuality, p.balance, P5.ownership(p.ownershipBase), P5.governance, P5.forecasts, P5.street, P6.valuation, P6.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
