// Tenneco Clean Air India report, part B: cover, the story in charts, and the merger of part2-6 (business, history,
// industry, tailwind test, the two segments, margins and VAR, the parent and related parties, moat, Q1FY27, earnings
// quality, ownership, governance, forecasts, street, valuation, verdict, glossary, statement notes). Shared inputs in
// TENNIND.ctx.js; forecast and valuation figures are live tokens ({{...}}) that follow assumptions.json. As of 30-Sep-2026.
const X = require('./TENNIND.ctx');
const { F, V, A, b, SQ, QL, C, Q1, n0, n1, n2, pc1, price, mv, PEL, sectorL, MULT, epsSep, rating, latest, medTp, feesPct, feesOfEbitda, VAR, var26, mVar, ISSUE } = X;
const P2 = require('./TENNIND.part2'), P3 = require('./TENNIND.part3'), P4 = require('./TENNIND.part4'), P5 = require('./TENNIND.part5'), P6 = require('./TENNIND.part6');
const sd = d => { const [y, m, dd] = d.split('-'); return `${+dd}-${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+m - 1]}`; };

const cover = {
  headline: 'India\'s exhaust and shock-absorber leader: ride control carries the growth, the parent carries the risk',
  lead: `Tenneco Clean Air India makes exhaust and after-treatment systems, spark plugs and bearings (49% of value-added revenue, VAR) and shock absorbers and struts (51%) for Indian car, truck and tractor makers; it leads in truck exhaust (58% share), off-highway exhaust (68%) and car shock absorbers (55%). It listed on 19-Nov-2025 through a ₹3,600 cr sale of shares by its US parent at ₹${ISSUE}. VAR grew 12.3% in FY26 and 18.4% in Q1FY27, but almost all of the growth is ride control (+28% in Q1); exhaust grew 9.6% against a 16% market, and the margin slipped to 17.9% of VAR. We forecast EPS of ₹${n2(F.eps[0])} / ₹${n2(F.eps[1])} / ₹${n2(F.eps[2])} for FY27-29E, below the street. The street values the stock on **P/E on one-year-forward EPS** (JM Financial 29x FY28E, Motilal Oswal 30x Sep-28E). The house rule (its own forward P/E median since listing, ${n1(PEL.med)}x, adjusted by the auto-component peers' ${pc1(sectorL)} move over the same ten months) gives **${MULT.base}x Sep-28E EPS of ₹${n2(epsSep.base)} = {{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}.** Cross-checks: EV/EBITDA ₹${n0(mv('ev').value)}, DCF ₹${n0(mv('dcf').value)}, both close to the price. Bull {{scen.bull.tp|inr}}; bear {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'Ride control is the growth engine, and it does not care about EVs', p: `ART VAR grew 19.7% in FY26 and 27.9% in Q1FY27 (₹${n0(Q1.artVar)} cr), with plants above 90% utilised. DCx DaVinci (a mechanical "passive-plus" damper at about twice the content of a conventional one) has moved from one launch customer to four new customers in a quarter, and a smaller DCx32 targets A/B-segment cars. Every car needs dampers, electric or not. We model ART VAR +{{as.lineBuild.artGrowth.0|pct0}} / +{{as.lineBuild.artGrowth.1|pct0}} / +{{as.lineBuild.artGrowth.2|pct0}}.` },
    { h: 'Exhaust is a regulation business that is lagging its market until FY28', p: `CA&PT grew 5.5% in FY26 and 9.6% in Q1FY27 while its served market grew 16%: it has no content in battery EVs and no clean-air business at India's largest car maker, whose sales jumped after the GST cut. Entry there comes with CAFE-3 (expected FY28-29); CAFE-3 and BS-VII add ₹1,300-1,400 cr of industry content. Until then we model +{{as.lineBuild.caGrowth.0|pct0}} / +{{as.lineBuild.caGrowth.1|pct0}} / +{{as.lineBuild.caGrowth.2|pct0}}.` },
    { h: 'The parent is both the moat and the toll', p: `Tenneco supplies the technology (thousands of patents, Euro VII work, semi-active suspension) and ~70% of the export order book. In return it takes a 2.5% royalty on revenue including pass-through substrates plus network fees: ₹${n0(X.feesFy26)} cr in FY26, ${n1(feesPct)}% of revenue and ${Math.round(feesOfEbitda)}% of EBITDA. It took ₹1,037 cr of dividends before the IPO, sold 22% at the IPO and another 15% in August 2026; a 90-day lock-up ends around mid-November.` },
    { h: 'Valuation: a fair price for the history, a discount to the street', p: `At ₹${n2(price)} the stock trades at ${n1(X.fwdNow)}x our FY28E and ${n1(X.sepNow)}x Sep-28E EPS against a ${n1(PEL.med)}x forward median since listing (range ${n1(PEL.min)}-${n1(PEL.max)}x). Our ${MULT.base}x sits just below the street's 29-30x; the target is below the street's median (₹${n0(medTp)}) because our EPS is lower (FY28E ₹${n2(F.eps[1])} vs JM's ₹23.3). The DCF (₹${n0(mv('dcf').value)}) and EV/EBITDA (₹${n0(mv('ev').value)}) only support today's price: the upside rests on the P/E holding.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin (on revenue)', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n2'], ['EPS growth', 'epsGrowth', 'chg']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Governance (parent)', v: 'AMBER' },
    { k: 'Earnings momentum', v: 'AMBER' },
    { k: 'Competitive position', v: 'GREEN' },
    { k: 'Valuation', v: 'GREEN' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): the half-yearly order book (domestic and export split), H1 capex and whether non-indexed cost increases were recovered.',
    'End of the parent\'s 90-day lock-up (around mid-November 2026): Tenneco no longer needs to sell for minimum public shareholding, but any further sale is an overhang.',
    'CAFE-3 for cars (expected from 2027; management: "mid of 2027") and the BS-VII notification: content per vehicle and the entry into India\'s largest car maker.',
    'Kharkhoda Clean Air plant (start of production ~Q3FY27 per JM Financial) and the western-India ride-control plant.',
    'Value of the spark-plug order from a large PV maker (not yet disclosed) and any acquisition (management: "wait for the right time").',
  ],
};

// ---------------------------------------------------------------- Story in charts
const yoy = f => SQ.map((q, i) => (i >= 4 && q[f] && SQ[i - 4][f] ? Math.round((q[f] / SQ[i - 4][f] - 1) * 1000) / 10 : null)).slice(4);
const varLabels = [...A.labels, ...F.years], varVals = [...X.SA.map(a => a.var), ...VAR];
const STL = latest.slice().sort((a, c) => a.date.localeCompare(c.date));
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'stacked', title: 'Ride control overtook exhaust in FY26', unit: 'Value-added revenue (₹ crore)', x: QL, series: [{ name: 'Clean Air & Powertrain', values: SQ.map(q => q.caVar), fmt: 'num' }, { name: 'Advanced Ride Technologies', values: SQ.map(q => q.artVar), fmt: 'num' }], minLabel: 300, source: 'Company calls and decks; Q2-Q4FY25 derived from reported growth rates' },
      { type: 'column', title: 'Ride control +24-28%; exhaust +3-10%', unit: 'VAR growth year on year (%)', x: QL.slice(4), series: [{ name: 'Clean Air & Powertrain', values: yoy('caVar'), fmt: 'pct' }, { name: 'Advanced Ride Technologies', values: yoy('artVar'), fmt: 'pct' }], labels: 'all', source: 'Company calls' },
    ] },
    { pair: [
      { type: 'column', title: `VAR: ₹3,902 cr in FY23, ₹${n0(var26)} cr in FY26, ₹${n0(VAR[2])} cr in FY29E`, unit: 'Value-added revenue (₹ crore)', x: varLabels, series: [{ name: 'VAR', values: varVals.map(Math.round), fmt: 'num' }], labels: 'all', source: 'Company (FY23-26); GAM estimates FY27-29E' },
      { type: 'line', title: 'EBITDA margin on VAR: 19.6% in Q1FY26, 17.9% in Q1FY27', unit: 'EBITDA ÷ VAR (%)', x: QL, series: [{ name: 'EBITDA margin on VAR', values: SQ.map(q => q.ebitdaVarPct), fmt: 'pct' }], labels: 'all', min: 15, max: 21, source: 'Company; GAM (Q2-Q3FY25 on derived VAR)' },
    ] },
    { pair: [
      { type: 'column', title: 'Lifetime order book: ₹9,840 cr (Sep-25) to ₹12,400 cr (Mar-26)', unit: '₹ crore', x: ['Sep-2025 order book', 'Net additions H2FY26', 'Moved into production', 'Mar-2026 order book'], series: [{ name: 'Order book', values: [9840, 6025, -3465, 12400], fmt: 'num' }], labels: 'all', source: 'Q4FY26 presentation p11 (orders confirmed but not yet in production; 5-6 year visibility)' },
      { type: 'column', title: `EPS: ₹9.44 in FY23, ₹${n2(A.eps[b])} in FY26, ₹${n2(F.eps[2])} in FY29E`, unit: 'EPS (₹)', x: 'fin.labels', from: 'FY23', to: 'FY29E', series: [{ name: 'EPS', ref: 'fin.eps', fmt: 'n2' }], labels: 'all', source: 'Screener.in; GAM estimates FY27-29E' },
    ] },
    { pair: [
      { type: 'line', title: `Forward P/E: ${n1(X.fwdNow)}x FY28E now vs a ${n1(PEL.med)}x median since listing`, unit: 'Price ÷ next full-year EPS (x)', x: X.fwdPe.map(x => x[0]), series: [{ name: 'Forward P/E', values: X.fwdPe.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', lines: [{ v: MULT.base, text: `Our multiple: ${MULT.base}x`, color: '#cf8f1f' }], source: 'Screener.in daily prices; FY27-28E EPS are GAM estimates' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (latest note per broker)', unit: `₹ per share; CMP ₹${n2(price)}`, x: [...STL.map(s => `${s.broker} (${sd(s.date)})`), 'GAM (base)'], series: [{ name: 'Target', values: [...STL.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: `Citi (1-Apr-2026), JM Financial (3-Jun-2026), Axis Capital (~4-Jun-2026), Motilal Oswal (15-Sep-2026); median ₹${n0(medTp)}; GAM Research` },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.segments, P3.margins, P3.parent, P3.moat, p.financials, P4.guidance, p.capital, P4.quality, p.balance, P4.ownership(p.ownershipBase), P4.governance, P4.forecasts, P5.street, P5.valuation, P6.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
