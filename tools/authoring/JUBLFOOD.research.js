// Jubilant FoodWorks report, part B: cover, the story in charts, and the merger of part2-6 (business, history, industry,
// tailwind test, Domino's India, Popeyes and emerging brands, International, margins before and after rent, moat, Q1FY27,
// earnings quality, ownership, governance, forecasts, street, valuation, verdict, glossary, statement notes). Shared inputs
// in JUBLFOOD.ctx.js / ctx2.js; forecast and valuation figures are live tokens ({{...}}). As of 30-Sep-2026.
const X = require('./JUBLFOOD.ctx');
const { F, V, A, b, Q1, CO, f26, f25, n0, n1, n2, pc1, price, mv, HEV, sectorEv, evMULT, ebitdaSep28, rating, post, medTp, preMultAt, preEbitda, preEbitda26, evSepNow, segM, SA, SQ, epsBei } = X;
const P2 = require('./JUBLFOOD.part2'), P3 = require('./JUBLFOOD.part3'), P4 = require('./JUBLFOOD.part4'), P5 = require('./JUBLFOOD.part5'), P6 = require('./JUBLFOOD.part6');
const sd = d => { const [y, m, dd] = d.split('-'); return `${+dd}-${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+m - 1]}`; };
const tpPre = preMultAt(V.tp);

const cover = {
  headline: 'India\'s pizza leader is cheap against its own history: growth is slower, but the multiple has fallen further',
  lead: `Jubilant FoodWorks (JFL) runs Domino's in India (2,455 stores), Popeyes and Hong's Kitchen, and since Feb-2024 owns 93.65% of DP Eurasia (Domino's and COFFY in Turkey, Azerbaijan, Georgia). FY26 revenue rose 17.4% to ₹${n0(A.sales[b])} cr, but Domino's India like-for-like (LFL) growth fell from 11.6% to 0.2% during the year and was 2.5% in Q1FY27. We forecast EPS of ₹${n2(F.eps[0])} / ₹${n2(F.eps[1])} / ₹${n2(F.eps[2])} for FY27-29E, in line with consensus. The street values JFL on **EV/EBITDA after rent, India plus International (24-30x and 15-18x FY28E)**. The house rule (its own forward EV/EBITDA median since Apr-2021, ${n1(HEV.med)}x, times the QSR peers' ${pc1(sectorEv)} move against their five-year medians) gives **${evMULT.base}x Sep-28E EBITDA of ₹${n0(ebitdaSep28)} cr, less minorities = {{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}.** That is ≈${n1(tpPre)}x EBITDA after rent on the street's basis, inside its range. Cross-checks: P/E ₹${n0(mv('pe').value)}, DCF ₹${n0(mv('dcf').value)}. Bull {{scen.bull.tp|inr}}; bear {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'The multiple has fallen more than the business', p: `At ₹${n2(price)} JFL trades at ${n1(evSepNow)}x Sep-28E EBITDA (after Ind AS 116, leases in debt), against a ${n1(HEV.med)}x one-year-forward median since Apr-2021 and ${n1(X.HEV24.med)}x since Turkey was consolidated. Its trailing EV/EBITDA is ${pc1(X.dr5Ev.JUBLFOOD)} below its five-year median; Westlife, Devyani and Sapphire are a median ${pc1(sectorEv)} below theirs. EBITDA still grew ~19% in FY26 and 14% in Q1FY27.` },
    { h: 'Domino\'s India: orders are growing, ticket size is not', p: `Q1FY27 orders +6.5%, delivery revenue +12.1%, but LFL only 2.5% as the ₹99 minimum order (matching aggregators) cut ticket sizes and dine-in kept shrinking. We assume LFL of ~4.5% in FY27E against the 5-7% guide and ~240-260 new stores a year: India revenue +{{as.segments.0.growth.0|pct0}} / +{{as.segments.0.growth.1|pct0}} / +{{as.segments.0.growth.2|pct0}}.` },
    { h: 'Popeyes and the supply chain are the operating leverage', p: 'Popeyes grew revenue 97% in Q1FY27 with LFL above 40% for a third quarter; management targets a ₹1,000 cr brand in 3-4 years. Supply-chain capex is past its peak (capacity for ~5,000 stores), so capex stays ~₹750-900 cr while revenue grows. Management keeps a +200 bp after-rent margin goal by FY28; we model about +125 bp over three years.' },
    { h: 'Turkey: real growth hidden by inflation accounting', p: `DP Eurasia (₹2,456 cr revenue, ₹204 cr PAT in FY26) grows ~28% in rupees, but Domino's Turkey LFL was −1.3% after inflation in Q1FY27 and reported EBITDA swings with the IAS 29 monetary gain. It brings minorities (6.35%), most of the ₹1,745 cr bank debt (euro loans due in FY27) and currency risk; we value it at the group multiple and show a lower one as a sensitivity.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin (before rent)', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n2'], ['EPS growth', 'epsGrowth', 'chg']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Governance', v: 'GREEN' },
    { k: 'Earnings momentum', v: 'AMBER' },
    { k: 'Competitive position', v: 'GREEN' },
    { k: 'Valuation', v: 'GREEN' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): management expects Domino\'s LFL above Q1\'s 2.5%; the base eases from Q3 (5.0%, then 0.2%).',
    'Refinancing of the two euro term loans (EUR 109.6 mn, ~₹1,183 cr) that fall due in FY27.',
    'Popeyes: 35-40 openings a year and the path to EBITDA break-even.',
    'Dunkin\' exit under way (27 stores at Mar-2026, 15 at Jun-2026): a cleaner standalone P&L from FY27.',
    'Turkish inflation and the lira: a lower monetary gain cuts reported International EBITDA.',
  ],
};

// ---------------------------------------------------------------- Story in charts
const STL = post.slice().sort((a, c) => a.tp - c.tp);
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: `Revenue: ₹4,396 cr (FY22) to ₹${n0(A.sales[b])} cr (FY26), ₹{{F.sales.2|num}} cr in FY29E`, unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY22', to: 'FY29E', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'all', source: 'Screener.in; GAM estimates FY27-29E' },
      { type: 'stacked', title: 'Revenue mix: International a quarter of the total in FY25, 28% in FY26', unit: 'Revenue (₹ crore)', x: ['FY23', 'FY24', 'FY25', 'FY26', ...F.years], series: [{ name: 'India', values: [...SA.map(a => Math.round(a.indiaRev)), ...X.SEG.india.revenue.map(Math.round)], fmt: 'num' }, { name: 'International', values: [...SA.map(a => Math.round(a.intlRev)), ...X.SEG.intl.revenue.map(Math.round)], fmt: 'num' }], minLabel: 300, source: 'AR FY24/FY26 geographic note; GAM estimates. FY23-24 India incl. Dunkin\'.' },
    ] },
    { pair: [
      { type: 'column', title: 'Domino\'s India LFL: 11.6% (Q1FY26) to 0.2% (Q4FY26), 2.5% in Q1FY27', unit: 'LFL revenue growth (%)', x: ['Q1FY26', 'Q2FY26', 'Q3FY26', 'Q4FY26', 'Q1FY27'], series: [{ name: 'LFL', values: [...X.C.business.dominosIndia.lfl.FY26, X.C.business.dominosIndia.lfl.Q1FY27], fmt: 'pct' }], labels: 'all', source: 'Q4FY26 presentation slide 15; Q1FY27 letter' },
      { type: 'column', title: 'EBITDA margin before and after rent: ~20% and ~13%', unit: 'EBITDA margin (%)', x: ['FY25', 'FY26', ...F.years], series: [{ name: 'After Ind AS 116 (before rent)', values: [Math.round(CO.ebitdaFY25 / CO.revenueFY25 * 1000) / 10, Math.round(CO.ebitda / CO.revenue * 1000) / 10, ...F.ebitdaMargin.map(v => Math.round(v * 10) / 10)], fmt: 'pct' }, { name: 'After rent (pre-Ind AS)', values: [Math.round((CO.ebitdaFY25 - 545.0) / CO.revenueFY25 * 1000) / 10, Math.round(preEbitda26 / CO.revenue * 1000) / 10, ...preEbitda.map((e, i) => Math.round(e / F.sales[i] * 1000) / 10)], fmt: 'pct' }], labels: 'all', source: 'AR FY26 (EBITDA less lease payments); GAM estimates' },
    ] },
    { pair: [
      { type: 'column', title: `EPS before one-offs: ₹${n2(epsBei[2022])} (FY22), ₹${n2(epsBei[2025])} (FY25), ₹{{F.eps.2|n2}} in FY29E`, unit: 'EPS before exceptional and discontinued items (₹)', x: ['FY22', 'FY23', 'FY24', 'FY25', 'FY26', ...F.years], series: [{ name: 'EPS', values: [2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029].map(y => Math.round(epsBei[y] * 100) / 100), fmt: 'n2' }], labels: 'all', source: 'Screener.in (profit for P/E), AR FY26 (continuing PAT before exceptional items less minorities); GAM estimates' },
      { type: 'line', title: `Forward EV/EBITDA: ${n1(X.evNow)}x FY28E now vs a ${n1(HEV.med)}x median since Apr-2021`, unit: 'EV (incl. leases and minorities) ÷ next full-year EBITDA (x)', x: X.fwdEvChart.map(x => x[0]), series: [{ name: 'Forward EV/EBITDA', values: X.fwdEvChart.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', lines: [{ v: evMULT.base, text: `Our multiple: ${evMULT.base}x`, color: '#cf8f1f' }], source: 'Screener.in weekly prices; realised EBITDA, FY27-28E GAM estimates' },
    ] },
    { pair: [
      { type: 'line', title: `Share price: ₹${n2(price)} on 30-Sep-2026, ${Math.round((1 - price / X.evAll[0].p) * 100)}% below Apr-2021`, unit: '₹ per share (weekly close)', x: X.evAll.map(x => x.d), series: [{ name: 'Price', values: X.evAll.map(x => x.p), fmt: 'inr', thin: true }], labels: 'last', source: 'Screener.in; NSE close on 30-Sep-2026' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (post-results notes)', unit: `₹ per share; CMP ₹${n2(price)}`, x: [...STL.map(s => `${s.broker} (${sd(s.date)})`), 'GAM (base)'], series: [{ name: 'Target', values: [...STL.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: `Dated notes 13-Aug to 26-Aug-2026 (see the street table); median ₹${n0(medTp)}; GAM Research` },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.dominos, P3.emerging, P3.intl, P3.margins, P3.moat, p.financials, P4.guidance, p.capital, P4.quality, p.balance, P4.ownership(p.ownershipBase), P4.governance, P4.forecasts, P5.street, P5.valuation, P6.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
