// Eicher Motors report, part B: cover, the story in charts, and the merger of part2-6 (business, history, industry,
// tailwind test, competition, Royal Enfield, VECV, moat, Q1FY27, earnings quality, ownership, governance, forecasts,
// street, valuation, verdict, glossary, statement notes). Shared inputs in EICHERMOT.ctx.js; forecast and valuation
// figures are live tokens ({{...}}) that follow assumptions.json. As of 30-Sep-2026.
const X = require('./EICHERMOT.ctx');
const { F, V, A, SA, SQ, QL, n0, n1, pc, price, mv, FM, reMed, sectorDr, SOTP, MULT, vecvSep28, rating, postQ1, medTp, C } = X;
const P2 = require('./EICHERMOT.part2'), P3 = require('./EICHERMOT.part3'), P4 = require('./EICHERMOT.part4'), P5 = require('./EICHERMOT.part5'), P6 = require('./EICHERMOT.part6');
const S = SOTP.base;

const cover = {
  headline: 'India\'s best two-wheeler franchise, priced for more than its own history allows',
  lead: `Royal Enfield sells ~85% of India's mid-size (250-750cc) motorcycles and earns a 24-25% EBITDA margin, far above any mass-market rival. GST 2.0 (Sep-2025) cut the tax on its 350cc range, ~92% of domestic volume, from 28% to 18%; volumes rose 22% in FY26 to 12.3 lakh and 27% in Q1FY27, and capacity is going from 1.5 mn to 2.45 mn by FY30. Eicher also owns 54.4% of VECV, India's #1 light-and-medium truck maker, which it equity-accounts. The street values the stock on a **sum of the parts: Royal Enfield on 29-35x FY28E P/E plus VECV**. We forecast EPS of ₹${n1(F.eps[0])} / ₹${n1(F.eps[1])} / ₹${n1(F.eps[2])} for FY27-29E, close to the street. Applying the house rule to each part (**Royal Enfield ${MULT.re.base}x Sep-28E EPS of ₹${n1(S.reEps)}, VECV ${MULT.vecv.base}x Eicher's share of ₹${n1(vecvSep28)}**) gives **{{dcf.tp|inr}} ({{dcf.upside|chg}})**: **we initiate with ${rating}.** Cross-checks: EV/EBITDA ₹${n0(mv('ev').value)}, DCF ₹${n0(mv('dcf').value)}. Bull case {{scen.bull.tp|inr}}; bear case {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'Demand is strong, broad and not capacity-bound any more', p: `Q1FY27 domestic volumes rose 32% (the four 350s +34%), then +34% in July and +11% in August; enquiries and bookings grow faster than dispatches and dealer stock is only 10-12 days. A new Cheyyar module took capacity to 1.5 mn in July; the next comes in October. International revenue crossed ₹1,000 cr in a quarter for the first time.` },
    { h: 'But FY27 is a year of two halves', p: `From Sep-2026 Royal Enfield laps the GST-boosted base (Q3FY26: 3 lakh domestic, +26% festive). The >350cc range only got back to pre-GST volumes in July after its tax rose to 40%, and exports fell 9% in Apr-Aug. We model domestic +12% for Sep-Mar, i.e. {{F.volume.0|num}} motorcycles in FY27E (+{{as.volume.growth.0|n1}}%), then ~10% and ~9% growth.` },
    { h: 'Margins: 24-25%, not the 26-31% of the past', p: `EBITDA margin was 31% in FY18, 26.2% in FY24, 24.7% in FY26 and 24.0% in Q1FY27 (a 4-4.5% commodity hit). Management now chases volume (refreshes at little extra price, more advertising), the EV brand is a start-up cost and depreciation jumped 40% in Q1. We model {{F.ebitdaMargin.0|pct}} / {{F.ebitdaMargin.1|pct}} / {{F.ebitdaMargin.2|pct}} and EPS growth of ~${Math.round(X.epsCagrFwd)}% a year for FY26-29E, against 33% in FY21-26.` },
    { h: 'Valuation: the premium is not in the history', p: `At ₹${n0(price)} the stock trades at ${n1(price / F.eps[1])}x our FY28E EPS. Its one-year-forward P/E has a median of ${n1(FM.median)}x since Apr-2021 (${n1(reMed)}x for Royal Enfield with VECV stripped out); auto peers were ${Math.abs(sectorDr).toFixed(1)}% below their five-year medians on ${X.ASOF_TXT}. That gives ${MULT.re.base}x for Royal Enfield, against the street's 29-35x. At the street's median 30x our target would be ~₹${n0(Math.round((30 * S.reEps + S.ve) / 10) * 10)}: the whole gap is the multiple, not the earnings.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'GREEN' },
    { k: 'Predictability', v: 'AMBER' },
    { k: 'Earnings momentum', v: 'GREEN' },
    { k: 'Competitive position', v: 'GREEN' },
    { k: 'Valuation', v: 'RED' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): festive-season dispatches, the margin after the commodity peak, and the cost of the Flying Flea roll-out.',
    'Festive retail (Oct-Nov 2026) against the GST-boosted base of Oct-Nov 2025: the first real test of whether the GST step-up in demand is permanent.',
    'Capacity: the second Cheyyar module (early Oct-2026) and 2 mn units by FY27-28; whether dealer stock can be rebuilt above 10-12 days.',
    'Launches: Flying Flea S6 and city expansion, 650cc refreshes (Bullet 650, Classic 650 anniversary edition), Indonesia CKD decision.',
    'VECV: the PARIVARTAN replacement scheme for Delhi-NCR, the CV cycle after the GST cut, and approval of the Volvo finance JV (up to ₹750 cr).',
  ],
};

// ---------------------------------------------------------------- Story in charts
const fy = ['FY22', 'FY23', 'FY24', 'FY25', 'FY26'], ix = l => A.labels.indexOf(l);
const reEbit = fy.map(l => { const a = SA.find(x => x.fy === l); return Math.round(a.reEbitda - A.dep[ix(l)] - A.interest[ix(l)]); });
const M6 = C.monthly.rows, jun = M6[0], aug = M6[2];
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: 'Royal Enfield volumes: 6 lakh in FY22, 12.3 lakh in FY26, ~17 lakh by FY29E', unit: 'Motorcycles sold (lakh), financial-statement basis', x: 'fin.labels', from: 'FY21', to: 'FY29E', series: [{ name: 'Volume', ref: 'kpi.units', fmt: 'lakh' }], labels: 'all', source: 'Investor presentations; GAM estimates FY27-29E' },
      { type: 'column', title: 'After GST 2.0: the 350s boom, the big bikes lag', unit: 'Dispatches, growth year on year (%)', x: ['Jun-2026', 'Aug-2026'], series: [{ name: 'Up to 350cc', values: [Math.round((jun.upTo350 / jun.upTo350Prior - 1) * 1000) / 10, Math.round((aug.upTo350 / aug.upTo350Prior - 1) * 1000) / 10], fmt: 'pct' }, { name: 'Above 350cc', values: [Math.round((jun.above350 / jun.above350Prior - 1) * 1000) / 10, Math.round((aug.above350 / aug.above350Prior - 1) * 1000) / 10], fmt: 'pct' }], labels: 'all', source: 'Monthly sales releases via Rushlane (Jun) and Autocar Pro (Aug)' },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: 26% in FY24, ~24-25% in our forecasts', unit: 'Consolidated EBITDA margin (%)', x: 'fin.labels', from: 'FY19', to: 'FY29E', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 15, max: 32, source: 'Screener.in; GAM estimates FY27-29E' },
      { type: 'column', title: 'VECV: a CV-cycle recovery worth ₹798 cr to Eicher in FY26', unit: "Eicher's 54.4% share of VECV profit (₹ crore)", x: ['FY22', 'FY23', 'FY24', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], series: [{ name: 'VECV share', values: [...SA.map(a => a.jvShare), ...X.vb.map(r => Math.round(r.share))], fmt: 'num' }], labels: 'all', source: 'Investor presentations; GAM estimates' },
    ] },
    { pair: [
      { type: 'stacked', title: 'A third of pre-tax profit is treasury income and VECV', unit: 'Pre-tax profit by source (₹ crore)', x: fy, series: [{ name: 'Royal Enfield (EBIT less interest)', values: reEbit, fmt: 'num' }, { name: 'Treasury and other income', values: SA.map(a => a.treasuryOI), fmt: 'num' }, { name: 'VECV share (after tax)', values: SA.map(a => a.jvShare), fmt: 'num' }], minLabel: 300, source: 'Investor presentations; Screener.in' },
      { type: 'column', title: `EPS: ₹61 in FY22, ₹201 in FY26, ₹${Math.round(F.eps[2])} by FY29E`, unit: 'EPS (₹)', x: 'fin.labels', from: 'FY19', to: 'FY29E', series: [{ name: 'EPS', ref: 'fin.eps', fmt: 'n1' }], labels: 'all', source: 'Screener.in; GAM estimates FY27-29E' },
    ] },
    { pair: [
      { type: 'line', title: `Forward P/E: ${Math.round(price / F.eps[1])}x now vs a ${Math.round(FM.median)}x median since 2021`, unit: 'Price ÷ next full-year EPS (x)', x: X.fwdPe.map(x => x[0]), series: [{ name: 'Forward P/E', values: X.fwdPe.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 2, lines: [{ v: Math.round(FM.median), text: `Median since 2021: ${n1(FM.median)}x` }], source: 'Screener.in prices; actual EPS, GAM estimates for FY27-28E' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (notes standing on 30-Sep-2026)', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...postQ1.map(s => s.broker), 'GAM (base)'], series: [{ name: 'Target', values: [...postQ1.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: `Broker notes, 29-Jul to 30-Sep-2026 (median ₹${n0(medTp)}), GAM Research` },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P2.competition, P3.re, P3.vecv, P3.moat, p.financials, P4.guidance, p.capital, P4.quality, p.balance, P4.ownership(p.ownershipBase), P4.governance, P4.forecasts, P5.street, P5.valuation, P6.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
