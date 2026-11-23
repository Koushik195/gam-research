// Gabriel India report, part B: cover, the story in charts, and the merger of part2-6 (business, history, industry,
// tailwind test, ride control, subsidiaries, JVs and associates, moat, Q1FY27, earnings quality, ownership, governance,
// forecasts, street, valuation, verdict, glossary, statement notes). Shared inputs in GABRIEL.ctx.js; forecast and
// valuation figures are live tokens ({{...}}) that follow assumptions.json. As of 30-Sep-2026.
const X = require('./GABRIEL.ctx');
X.assertBuild();
const { F, V, A, n0, n1, pc, price, mv, FMs, sectorW, MULT, epsSep, rating, postQ1, medTp, sepNow, trailPe, jvPctPbt, jvPct26, accretion, b } = X;
const P2 = require('./GABRIEL.part2'), P3 = require('./GABRIEL.part3'), P4 = require('./GABRIEL.part4'), P5 = require('./GABRIEL.part5'), P6 = require('./GABRIEL.part6');
const E = epsSep.base;

const cover = {
  headline: 'A shock-absorber maker turned group holding vehicle: the deals add earnings, and the price already counts them',
  lead: `Gabriel India makes shock absorbers and struts for two-wheelers, cars and trucks (FY26 restated revenue ₹5,245 cr). Since mid-2025 the Anand Group has made it its listed consolidation vehicle: a scheme (effective May-2026) brought in Anchemco's fluids and stakes in Dana Anand and Henkel Anand, and in Sep-2026 Gabriel bought 28.99% of HL Mando Anand from its promoter and ~30% of HL Klemove India, paid with 1.44 cr new shares, ₹350 cr of cash and ₹1,000 cr of NCDs. We forecast EPS of ₹${n1(F.eps[0])} / ₹${n1(F.eps[1])} / ₹${n1(F.eps[2])} for FY27-29E on today's 19.16 cr shares, below the street's ~₹35-41 for FY28E, with ~${Math.round(jvPctPbt[1])}% of FY28E profit before tax coming from JVs and associates (${Math.round(jvPct26)}% in restated FY26). The street values Gabriel on **P/E on FY28E EPS** (Motilal Oswal and ICICI Securities ~40x, Choice 32x). The house multiple, its ${n1(FMs.median)}x forward-P/E median since the scheme was announced (Jul-2025) cut by the ${Math.abs(sectorW).toFixed(1)}% auto-component move over the same window, is **${MULT.base}x Sep-28E EPS of ₹${n1(E)} = {{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}.** Cross-checks: EV/EBITDA ₹${n0(mv('ev').value)}, DCF ₹${n0(mv('dcf').value)} (both value the JV stakes only at book). Bull {{scen.bull.tp|inr}}; bear {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'A solid ride-control franchise with little pricing power', p: 'Market leader in CV shock absorbers (88%) and electric two-wheelers (~60%), 32% of 2W/3W and 25% of cars (company, FY26); revenue ~₹4,600 cr standalone. But EBITDA margins have stayed at 6-10% for two decades, commodity costs are passed on late (Q1FY27 standalone margin 8.4%), and it lost car share in Q1FY27 on model mix.' },
    { h: 'The deals buy good businesses, paid partly in expensive paper', p: `Dana Anand (ROE 33%), Henkel Anand (62%) and HL Mando Anand (FY26 PAT ₹358 cr) are better businesses than Gabriel's own. HL Mando Anand came at 21.5x earnings, largely in Gabriel shares at ~54x restated FY26 EPS, so the deal lifts our FY28E EPS by ~${Math.round(accretion[1])}%. But Gabriel holds minority stakes that partners (Dana, Henkel, HL) run, the promoter sat on both sides, and the profit share is not cash until paid as dividends.` },
    { h: 'Growth is real but the base is now harder to read', p: 'Q1FY27 revenue +15.5% (restated base), EBITDA +5%, PAT +2% as margins fell and the JV share rose 10%. FY24-25 are pre-scheme, FY26 is restated and FY27 holds the Jupiter stakes for part of the year, so like-for-like growth is hard to see. We model revenue +{{F.salesGrowth.0|n1}}% in FY27E and EPS growth of ~25% in FY28E as HL Mando Anand counts for a full year.' },
    { h: 'Valuation: fair for the new Gabriel, rich for the old one', p: `At ₹${n0(price)} the stock trades at ${n1(sepNow)}x our Sep-28E EPS and ${n1(trailPe)}x trailing (restated, on today's shares), near its ${n1(FMs.median)}x post-scheme median but more than twice the ~15x it traded at on the old business's forward earnings in FY22-25. Brokers' post-Q1 targets (median ₹${n0(medTp)}) assume 32-40x on FY28E EPS of ₹35-41; on our EPS the same multiples give ₹1,100-1,375.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n2'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'AMBER' },
    { k: 'Earnings momentum', v: 'GREEN' },
    { k: 'Balance sheet', v: 'AMBER' },
    { k: 'Valuation', v: 'AMBER' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): the first quarter with HL Mando Anand, HL Klemove and the NCD interest; the first restated half-year balance sheet; whether commodity recoveries lift the standalone margin back above 9%.',
    'Purchase-price allocation for the two new stakes (any amortisation of fair-value uplifts would cut the reported share of profit).',
    'IGSS: PN3 approval for Inalfa to take 35% of the sunroof company (Gabriel to 65%).',
    'Further group consolidation: ~30% of Anand Group businesses still sit outside Gabriel; any new related-party deal and its price.',
    'Dana Inc. combining with Eaton\'s mobility business (announced Jun-2026): any effect on the Dana Anand JV.',
  ],
};

// ---------------------------------------------------------------- Story in charts
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: `Revenue: ₹1,695 cr (FY21) to ₹5,245 cr (FY26 restated), ₹${n0(F.sales[2])} cr by FY29E`, unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY19', to: 'FY29E', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'all', source: 'Screener.in (FY19-23 standalone; FY26 restated); GAM estimates FY27-29E' },
      { type: 'stacked', title: 'Where profit before tax comes from: JVs and associates go from 0% to ~45%', unit: 'Profit before tax by source (₹ crore)', x: ['FY25 (reported)', 'FY26 (restated)', 'FY27E', 'FY28E', 'FY29E'], series: [{ name: 'Operations (after interest)', values: [A.pbt[b - 1], Math.round(X.R26.pbt - X.R26.jv), ...F.pbt.map((p, i) => Math.round(p - X.jvTot[i]))], fmt: 'num' }, { name: 'Share of JV / associate profit', values: [0, Math.round(X.R26.jv), ...X.jvTot.map(Math.round)], fmt: 'num' }], source: 'Q1FY27 results (restated FY26); GAM estimates. FY26 operations after the ₹15 cr labour-code charge.' },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: 6-10% for years; ~{{F.ebitdaMargin.2|pct}} by FY29E', unit: 'EBITDA margin (%)', x: 'fin.labels', from: 'FY19', to: 'FY29E', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 4, max: 12, source: 'Screener.in; GAM estimates' },
      { type: 'hbar', title: 'Gabriel\'s share of FY28E profit by stake (₹ crore)', unit: '₹ crore (after the partners\' share; post-tax)', x: X.jv.map(j => j.name), series: [{ name: 'FY28E', values: X.jv.map(j => Math.round(j.share[1])), fmt: 'num' }], labels: 'all', source: 'Company decks (FY26 PAT of each JV); GAM estimates (growth, HL Klemove PAT)' },
    ] },
    { pair: [
      { type: 'column', title: 'EPS: ₹{{F.eps.0|n1}} / ₹{{F.eps.1|n1}} / ₹{{F.eps.2|n1}} (FY27-29E) on 19.16 cr shares', unit: 'EPS (₹)', x: 'fin.labels', from: 'FY22', to: 'FY29E', series: [{ name: 'EPS', ref: 'fin.eps', fmt: 'n1' }], labels: 'all', source: 'Screener.in; FY26 restated on 19.16 cr shares (₹22.47; ₹24.29 on 17.72 cr); GAM estimates' },
      { type: 'column', title: 'Borrowings: ~₹150 cr to ~₹1,500 cr; equity tripled with the share-paid deals', unit: '₹ crore', x: ['Mar-25', 'Mar-26 reported', 'Mar-26 pro forma'], series: [{ name: 'Net worth', values: [A.netWorth[b - 1], 1368, Math.round(A.netWorth[b])], fmt: 'num' }, { name: 'Borrowings', values: [A.borrowings[b - 1], 148, 1512], fmt: 'num' }], labels: 'all', source: 'Screener.in; GAM pro forma for the scheme and Project Jupiter' },
    ] },
    { pair: [
      { type: 'line', title: `Forward P/E since the scheme: median ${n1(FMs.median)}x; ${n1(sepNow)}x on Sep-28E now`, unit: 'Price ÷ next full-year EPS (x)', x: X.fwdAll.map(x => x[0]), series: [{ name: 'Forward P/E', values: X.fwdAll.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: FMs.median, text: `Median since Jul-25: ${n1(FMs.median)}x` }, { v: MULT.base, text: `Our multiple: ${MULT.base}x`, color: '#cf8f1f' }], source: 'Screener.in weekly prices; old-company EPS to Jun-2025, post-scheme (pre-Jupiter until 20-Jul-2026) GAM EPS after' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (notes after Q1FY27)', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...postQ1.map(s => s.broker), 'GAM (base)'], series: [{ name: 'Target', values: [...postQ1.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: `Broker notes 22-24 Jul-2026; median ₹${n0(medTp)}; GAM Research` },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.ride, P3.subs, P3.jvs, P3.moat, p.financials, P4.guidance, p.capital, P4.quality, p.balance, P4.ownership(p.ownershipBase), P4.governance, P4.forecasts, P5.street, P5.valuation, P6.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
