// Asian Paints report, part B: cover, story in charts, and the merger of part2-4 (business, history,
// industry, competition, tailwind test, segments, moat, Q1FY27, earnings quality, ownership, governance,
// forecasts, street, valuation, verdict, glossary, statement notes). Shared inputs in ASIANPAINT.ctx.js.
// Forecast and valuation figures are live tokens ({{...}}) that follow assumptions.json. As of 30-Sep-2026.
const X = require('./ASIANPAINT.ctx');
const { F, V, A, n0, n1, pc, SA, SQ, QL, A26, Q1, price, mv, epsSep28, peMult, FM, fwdPe, rating, mosl, pl, isec, ST, b, sectorDr, D } = X;
const P2 = require('./ASIANPAINT.part2'), P3 = require('./ASIANPAINT.part3'), P4 = require('./ASIANPAINT.part4');
const G = D.peers.q1fy27SalesGrowthPct;

const cover = {
  headline: 'Volumes are back, pricing power is not: a great franchise in a permanently tougher market, now priced about right',
  lead: `Asian Paints is India's largest paint company, with ~1.7 lakh retail touchpoints and 27 plants. Since Grasim launched Birla Opus in Feb-2024 (now the #3 player, Q1FY27 paint revenue ₹1,661 cr, +64%) and JSW bought Akzo Nobel India, it has lost share (59% to 52% of branded decorative paints in the year to Mar-2025, Elara) and pricing power: value growth trailed volume by 4-7 points for two years. Volumes recovered to +8.7% in FY26 and +9.0% in Q1FY27, and price rises to offset the 2026 input spike lifted Q1FY27 revenue 18% and EBITDA 34%, helped by low-cost inventory that management says has now run out. The street values Asian Paints on **P/E (46.5-52x FY28E EPS)**. We forecast EPS of ₹${n1(F.eps[0])} in FY27E and ₹${n1(F.eps[1])} in FY28E, in line with the street. Applying **${peMult}x to Sep-28E EPS of ₹${n1(epsSep28)}** gives **{{dcf.tp|inr}} ({{dcf.upside|chg}})**: **we initiate with ${rating}.** Cross-checks: EV/EBITDA ₹${n0(mv('ev').value)}, DCF ₹${n0(mv('dcf').value)}. Bull case {{scen.bull.tp|inr}}; bear case {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'Volumes are back', p: `Decorative volume growth recovered from −0.5% (Q2FY25) to 10.9%, 7.9%, 12.4% and 9.0% in the last four quarters; FY27 guidance is 8-10%. In the 2026 supply shock large players gained from small ones. Industrial JVs and international (+27% in Q1FY27) add growth.` },
    { h: 'Pricing power has been lost, for now', p: `FY26 value growth was only 4.3% on 8.7% volume: price cuts, rebates and down-trading. Discounting has seen "no let-up" (MD, May-2026) and competition is "at an all-time high" (Jul-2026). Birla Opus gained another ~30 bp of share in Q1FY27 alone. Q1FY27's value growth (+16.6%) is price pass-through, not regained pricing power.` },
    { h: 'Margins: inside the band, not back to FY24', p: `Consolidated EBITDA margin: 21.4% (FY24), 17.7% (FY25), 18.8% (FY26), 20.6% in Q1FY27 on cheap inventory; ~25% input inflation hits Q2. We model {{F.ebitdaMargin.0|pct}} / {{F.ebitdaMargin.1|pct}} / {{F.ebitdaMargin.2|pct}}, inside the 18-20% guidance. VAM-VAE (from Aug-2026) helps from FY28.` },
    { h: 'Valuation: the de-rating has happened', p: `At ₹${n0(price)} the stock trades at ${n1(price / F.eps[0])}x our FY27E and ${n1(price / F.eps[1])}x FY28E EPS, against a ${n1(FM.median)}x median forward P/E since 2021. After the sector's ~${Math.abs(Math.round(sectorDr))}% de-rating our ${peMult}x gives {{dcf.tp|inr}}, just short of a BUY. A DCF at an 11.3% cost of equity gives only ₹${n0(mv('dcf').value)}: the price still assumes decades of growth.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'GREEN' },
    { k: 'Predictability', v: 'AMBER' },
    { k: 'Earnings momentum', v: 'AMBER' },
    { k: 'Competitive position', v: 'AMBER' },
    { k: 'Valuation', v: 'AMBER' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): how much margin the high-cost inventory takes, and whether volumes hold in the 8-10% band through the festive season.',
    'Raw materials: crude-linked inputs eased from June while TiO2 started rising; management has flagged possible price cuts in H2FY27, which would slow FY28 revenue.',
    'Competition: Birla Opus share gains (Grasim reports quarterly), JSW Dulux\'s strategy after the Akzo deal, and whether dealer discounting finally eases.',
    'VAM-VAE ramp-up at Dahej (first phase from Aug-2026, 2-2.5 years to approach 150,000 t): the 300-500 bp gross-margin benefit on products using in-house emulsion.',
    'CCI investigation into alleged abuse of dominance (ordered Jul-2025): a finding against the company would bring a penalty and curbs on dealer practices.',
  ],
};

// ---------------------------------------------------------------- Story in charts
const dq = X.DT;
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: 'Volume came back in FY26; value lagged until 2026\'s price rises', unit: 'Decorative India, growth year on year (%)', x: dq.map(q => q.q), series: [{ name: 'Volume', values: dq.map(q => q.volumePct), fmt: 'pct' }, { name: 'Value', values: dq.map(q => q.valuePct), fmt: 'pct' }], labels: 'all', source: 'Company calls and decks (value for Q1-Q3FY25 not collected)' },
      { type: 'hbar', title: 'Birla Opus grew 64% in Q1FY27; Asian Paints 18%', unit: 'Revenue growth, Jun-2026 quarter, year on year (%)', x: ['Birla Opus (Grasim)', 'Indigo Paints', 'Asian Paints', 'Berger Paints', 'Kansai Nerolac', 'JSW Dulux'], series: [{ name: 'Growth', values: [G.BIRLAOPUS, G.INDIGOPNTS, G.ASIANPAINT, G.BERGEPAINT, G.KANSAINER, G.JSWDULUX], fmt: 'pct' }], labels: 'all', highlight: 'Asian Paints', source: 'Grasim Q1FY27 release (paints revenue); Screener.in (consolidated revenue)' },
    ] },
    { pair: [
      { type: 'line', title: 'Standalone gross margin: record 45.6% on deflation, then the 2026 spike', unit: 'Standalone gross margin (% of net sales)', x: QL, series: [{ name: 'Gross margin', values: SQ.map(q => q.saGrossMarginPct), fmt: 'pct' }], labels: 'all', min: 38, max: 48, source: 'Company decks (Q1-Q3FY25 read from the deck chart)' },
      { type: 'line', title: 'EBITDA margin: inside the 18-20% band in our forecasts', unit: 'Consolidated EBITDA margin (%); dashed lines = management band of 18-20%', x: 'fin.labels', from: 'FY19', to: 'FY29E', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 12, max: 24, lines: [{ v: 18, text: '' }, { v: 20, text: '' }], source: 'Screener.in; GAM estimates FY27-29E' },
    ] },
    { pair: [
      { type: 'stacked', title: 'India standalone is 86% of revenue', unit: "Revenue by line (₹ '000 crore)", x: SA.map(a => a.fy), series: [{ name: 'Standalone (decorative India)', values: SA.map(a => Math.round(a.saRev / 100) / 10), fmt: 'n1' }, { name: 'Subsidiaries & consolidation', values: SA.map(a => Math.round(a.subRev / 100) / 10), fmt: 'n1' }], minLabel: 2, source: 'Screener.in standalone and consolidated P&L; GAM Research' },
      { type: 'column', title: `EPS: ₹57 in FY24, ₹38 in FY25, ₹${Math.round(F.eps[2])} by FY29E`, unit: 'EPS (₹, attributable)', x: 'fin.labels', from: 'FY19', to: 'FY29E', series: [{ name: 'EPS', ref: 'fin.eps', fmt: 'n1' }], labels: 'all', source: 'Screener.in; GAM estimates FY27-29E' },
    ] },
    { pair: [
      { type: 'line', title: `Forward P/E: ~${Math.round(price / F.eps[1])}x now vs a ${Math.round(FM.median)}x median since 2021`, unit: 'Price ÷ next full-year EPS (x)', x: fwdPe.map(x => x[0]), series: [{ name: 'Forward P/E', values: fwdPe.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 2, lines: [{ v: Math.round(FM.median), text: `Median since 2021: ${Math.round(FM.median)}x` }], source: 'Screener.in prices; actual EPS, GAM estimates for FY27-28E' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (Jul-2026 notes)', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...X.postQ1.map(s => s.broker), 'GAM (base)'], series: [{ name: 'Target', values: [...X.postQ1.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes and aggregators (29-31 Jul 2026), GAM Research' },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.competition, P2.tailwind, P2.deco, P2.subs, P3.moat, p.financials, P3.guidance, p.capital, P3.quality, p.balance, P3.ownership(p.ownershipBase), P3.governance, P3.forecasts, P4.street, P4.valuation, P4.risks, p.statements, P4.glossary],
  statementNotes: P4.statementNotes,
};
