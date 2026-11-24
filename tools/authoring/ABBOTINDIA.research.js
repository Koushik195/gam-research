// Abbott India report, part B: cover, the story in charts, and the merger of part2-6 (business, history, industry,
// tailwind test, own brands, Novo partner brands, dealings with the parent, price control, moat, Q1FY27, earnings
// quality, ownership, governance, forecasts, street, valuation, risks, glossary, statement notes). Shared inputs in
// ABBOTINDIA.ctx.js. Forecast and valuation figures are live tokens ({{...}}) or computed from the model, so they follow
// assumptions.json. As of 30-Sep-2026.
const X = require('./ABBOTINDIA.ctx');
const { F, V, A, SC, n0, n1, pc, pc1, SQ, QL, Q1, price, mv, MULT, HR, sAllWk, epsSep, rating, ST, withTp, peFY28, peSep28, SET_FACTOR, ownDr, derate, USED, P, shortName, shortDate, CONS, netCash26, BL, build, YRS, SA, ownShare } = X;
const P2 = require('./ABBOTINDIA.part2'), P3 = require('./ABBOTINDIA.part3'), P4 = require('./ABBOTINDIA.part4'), P5 = require('./ABBOTINDIA.part5'), P6 = require('./ABBOTINDIA.part6');
const PEAK = 34940, fromPeak = (price / PEAK - 1) * 100;

const cover = {
  headline: 'A quality franchise de-rated while pharma re-rated: on the street\'s P/E method and its own history Abbott India has {{dcf.upside|chg}} upside; the DCF is the caution',
  lead: `Abbott India is the largest listed Indian subsidiary of a foreign drug maker: 75% owned by Abbott Laboratories, ₹6,929 cr of FY26 revenue, two-thirds from its own brands (Thyronorm, Udiliv, Duphalac, Cremaffin, Duphaston, Vertin) at a ~40% EBITDA margin and one-third from Novo Nordisk insulin and diabetes brands it distributes for a thin margin. It pays no royalty to its parent, has no debt and ₹${n0(netCash26)} cr of net cash. Q1FY27 revenue rose only 4.3% as Novo brands fell, but own brands grew ~11%, gross margin rose 283bp and profit 17%. At ₹${n0(price)} the stock is ${Math.abs(Math.round(fromPeak))}% below its Jun-2025 peak (weekly close) and trades at ${n1(peSep28)}x Sep-28E EPS against a ${n1(HR.med)}x forward median since 2021, while pharma peers trade ${SET_FACTOR}% above their own medians. The street values Abbott on **P/E (32-38x)**. We forecast EPS of ₹${n0(F.eps[0])} / ${n0(F.eps[1])} / ${n0(F.eps[2])} for FY27-29E, below consensus (₹${n0(CONS.epsFY28E)} for FY28E). Applying **${MULT.base}x to Sep-28E EPS of ₹${n1(epsSep.base)}** (Abbott's ${n1(HR.med)}x forward median × the pharma sector factor of 1.1025) gives **{{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}.** Cross-checks: EV/EBITDA ₹${n0(mv('ev').value)}; DCF ₹${n0(mv('dcf').value)}, which says the price already capitalises a lot. Bull {{scen.bull.tp|inr}}; bear {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'The own-brand engine is intact', p: `Own brands (~65% of revenue) grew ~11% in Q1FY27 and ~10% over the year to Jul-2026 (Pharmarack): Thyronorm +12.7%, Vertin +18%, Cremaffin Plus +20%, Influvac +25% (IQVIA). They earn ~40% EBITDA margins (BOBCAPS), use almost no capital and pay no royalty. The laggards are Udiliv, Digene and Duphaston (generic dydrogesterone). We model own brands at +${BL.growth.own.join('% / +')}%.` },
    { h: 'The Novo third is shrinking: it hurts revenue more than profit', p: `Novo Nordisk is discontinuing insulin cartridges and pens in India (Mixtard −31%), and semaglutide generics hit Rybelsus (−16%); Extensior (a second Ozempic brand) launched one month before the patent expired. Partner brands earn ~3-5% EBITDA margins, so they are ~35% of revenue but only ~4-6% of EBITDA. We model them at ${BL.growth.partner.map(g => (g > 0 ? '+' : '') + g + '%').join(' / ')}: reported growth of +{{F.salesGrowth.0|pct}} / +{{F.salesGrowth.1|pct}} / +{{F.salesGrowth.2|pct}} with margins rising to {{F.ebitdaMargin.2|pct}}.` },
    { h: 'Cash-rich, asset-light, high payout; but the parent decides', p: `Capex was ₹41 cr in FY26 against ₹1,319 cr of operating cash; 71-90% of profit is paid out (FY26: ₹656 a share incl. a ₹131 special) and deposits still grew to ₹4,410 cr. ROE is 34%. The catch: Abbott owns 75%, the free float trades ~US$3mn a day, there are no earnings calls and no split of own vs partner revenue.` },
    { h: 'Valuation: cheap on history, expensive on cash flows', p: `Abbott's trailing P/E is ${pc1(ownDr)} below its five-year median, the most de-rated name in the pharma set, and ${n1(peFY28)}x FY28E vs a ${n1(HR.med)}x forward median. Our house rule ignores that de-rating and the slower growth (EPS ~9% a year vs 18% in FY21-26), which gives ${MULT.base}x and {{dcf.tp|inr}}. On a DCF at an 11.3% cost of equity it is worth ₹${n0(mv('dcf').value)}; on BOBCAPS' 32x, ₹${n0(Math.round(32 * epsSep.base / 10) * 10)}. The upside needs the market to pay its old multiple again.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'GREEN' },
    { k: 'Balance sheet', v: 'GREEN' },
    { k: 'Predictability', v: 'AMBER' },
    { k: 'Earnings momentum', v: 'AMBER' },
    { k: 'Competitive position', v: 'AMBER' },
    { k: 'Governance', v: 'AMBER' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): revenue growth with a full quarter of the Novo decline, margin, and other income after the ₹1,394 cr dividend paid in Aug-2026.',
    'Monthly IQVIA / Pharmarack data: Udiliv and Duphaston vs the market; Thyronorm and Vertin; Extensior\'s share of the semaglutide generic market.',
    'Novo Nordisk\'s Indian portfolio decisions (insulin formats, new products routed through Abbott) and any change to the arrangement.',
    'FY27 dividend and any special dividend (May-2027); use of ₹4,400 cr of cash; any return of analyst meetings.',
    'Price policy: April-2027 WPI-linked revision for NLEM drugs; any new NLEM list.',
  ],
};

// ---------------------------------------------------------------- Story in charts
const STREET_TP = withTp;
const sortedPeers = [...USED].sort((a, c) => derate[c] - derate[a]);
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: 'Quarterly revenue: growth slowed to 4% in Q1FY27', unit: 'Revenue from operations (₹ crore)', x: QL, series: [{ name: 'Revenue', values: SQ.map(q => q.revenue), fmt: 'num' }], labels: 'all', highlight: 'Q1FY27', source: 'Company results' },
      { type: 'stacked', title: 'Own brands vs Novo partner brands: the partner third shrinks', unit: 'Revenue (₹ crore); FY21-24 company split, FY26 65/35, FY27-29E GAM', x: ['FY21', 'FY22', 'FY23', 'FY24', 'FY26', ...YRS], series: [{ name: 'Own brands', values: [...SA.filter(a => a.core).map(a => a.core), BL.base.own, ...build.own.map(Math.round)], fmt: 'num' }, { name: 'Novo partner brands', values: [...SA.filter(a => a.partner).map(a => a.partner), BL.base.partner, ...build.partner.map(Math.round)], fmt: 'num' }], minLabel: 1500, source: 'BOBCAPS (company split, 65/35); GAM estimates' },
    ] },
    { pair: [
      { type: 'line', title: 'Mix lifts margins: gross 48.6%, EBITDA 28.8% in Q1FY27', unit: '% of revenue', x: QL, series: [{ name: 'Gross margin', values: SQ.map(q => q.grossMarginPct), fmt: 'pct' }, { name: 'EBITDA margin', values: SQ.map(q => q.ebitdaMarginPct), fmt: 'pct' }], labels: 'all', min: 20, max: 52, source: 'Company results' },
      { type: 'column', title: 'EPS: +18% a year FY21-26, ~9% a year on our numbers', unit: 'EPS (₹); FY27-29E = GAM', x: 'fin.labels', from: 'FY20', series: [{ name: 'EPS', ref: 'fin.eps', fmt: 'num' }], labels: 'all', source: 'Screener.in; GAM Research' },
    ] },
    { pair: [
      { type: 'line', title: `Forward P/E: ${n1(peFY28)}x now vs a ${n1(HR.med)}x median since 2021`, unit: 'Price ÷ next full-year EPS (x)', x: sAllWk.map(x => x[0]), series: [{ name: 'Forward P/E', values: sAllWk.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: HR.med, text: `Median ${n1(HR.med)}x` }, { v: MULT.base, text: `Our target ${MULT.base}x`, color: '#cf8f1f' }], source: 'Screener.in prices; reported EPS; GAM estimates FY27-28E' },
      { type: 'hbar', title: `Pharma re-rated (+${SET_FACTOR}%); Abbott de-rated (${pc1(ownDr)})`, unit: 'Trailing P/E at the 30-Sep-2026 close vs five-year median (%)', x: [...sortedPeers.map(shortName), 'Abbott India'], series: [{ name: 'vs median', values: [...sortedPeers.map(s => Math.round(derate[s] * 10) / 10), Math.round(ownDr * 10) / 10], fmt: 'pct' }], labels: 'all', highlight: 'Abbott India', source: 'Screener.in P/E series; asof-peers.js' },
    ] },
    { pair: [
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (notes standing on 30-Sep-26)', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...STREET_TP.map(s => `${s.broker} (${shortDate(s.date)})`), 'GAM (base)'], series: [{ name: 'Target', values: [...STREET_TP.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes (Nov-2025 to Sep-2026); GAM Research' },
      { type: 'hbar', title: 'Target, cross-checks and scenarios', unit: '₹ per share', x: ['DCF', 'CMP', 'Bear case', 'GAM target', 'Bull case', 'EV/EBITDA'], series: [{ name: 'Value', values: [Math.round(mv('dcf').value), price, SC.bear.tp, V.tp, SC.bull.tp, Math.round(mv('ev').value)], fmt: 'inr' }], labels: 'all', highlight: 'GAM target', source: 'GAM Research' },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.ownBrands, P3.partner, P3.parent, P3.pricing, P3.moat, p.financials, p.margins, P4.guidance, p.capital, P4.quality, p.balance, P4.ownership(p.ownershipBase), P4.governance, P4.forecasts, P5.street, P5.valuation, P5.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
