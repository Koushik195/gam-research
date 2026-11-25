// Natco Pharma report, part B: cover, the story in charts, and the merger of part2-6 (business, history, industry, tailwind
// test, the gRevlimid windfall and cliff, the US pipeline, India and international, Adcock Ingram, crop health, API/plants/
// innovation, moat, margins and earnings quality, ownership, governance, forecasts, street, valuation, verdict, glossary,
// statement notes). Shared inputs in NATCOPHARM.ctx.js / ctx2.js; forecast and valuation figures are live tokens ({{...}})
// that follow assumptions.json. As of 30-Sep-2026.
const X = require('./NATCOPHARM.ctx2');
const { F, V, A, SA, SQ, QL, BL, OB, n0, n1, pc, price, mv, HR, FM, MULT, SENS, epsSep, rating, medTp, tpLo, tpHi, peSep, peFY28, val, assocPct, k, RI } = X;
const P2 = require('./NATCOPHARM.part2'), P3 = require('./NATCOPHARM.part3'), P3b = require('./NATCOPHARM.part3b'), P4 = require('./NATCOPHARM.part4'), P4b = require('./NATCOPHARM.part4b'), P5 = require('./NATCOPHARM.part5'), P5b = require('./NATCOPHARM.part5c'), P6 = require('./NATCOPHARM.part6');
const lenSum = SA.filter(a => ['FY23', 'FY24', 'FY25', 'FY26'].includes(a.fy)).reduce((s, a) => s + a.lenalidomideEst, 0);

const cover = {
  headline: 'gRevlimid is over; what is left earns ₹40-55 a share, and on the house multiple that is worth less than the price',
  lead: `Natco Pharma is a Hyderabad generics company that lives on hard-to-copy US generics. Its biggest one, generic Revlimid (lenalidomide), sold under a volume-limited licence from Mar-2022 to Jan-2026 and lifted EPS from ₹9 (FY22) to ₹104 (FY25); we estimate ~₹${n0(lenSum)} cr of lenalidomide revenue over FY23-FY26. That windfall is gone: Q1FY27 EPS was ₹11.5 and 41% of the profit came from Adcock Ingram, the South African company Natco now owns 49% of. The street values Natco on **P/E on one-year-forward EPS** (ICICI Securities: 18x FY28E core EPS plus ₹100 a share for exclusive products). We forecast EPS of ₹${n1(F.eps[0])} / ₹${n1(F.eps[1])} / ₹${n1(F.eps[2])} for FY27-29E. Natco's own forward P/E since Apr-2021 has a median of **${n1(FM.median)}x** once the rule drops the trough years (${FM.troughYears.join(' and ')}: forward EPS below half the FY25 peak), because what remains are the windfall years when the market paid 7-8x for gRevlimid profits. Times the pharma factor (+8.2%) that gives **${MULT.base}x Sep-28E EPS of ₹${n1(epsSep.base)} = {{dcf.tp|inr}} ({{dcf.upside|chg}})**. **We initiate with ${rating}.** We flag plainly that the cross-checks are far higher (EV/EBITDA ₹${n0(mv('ev').value)}, DCF ₹${n0(mv('dcf').value)}) and that the since-2021 median with no years dropped would give ₹${n0(val(SENS.all))}. Bull {{scen.bull.tp|inr}}; bear {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'The windfall has ended, and it was most of the profit', p: `Export formulations were ₹1,127 cr in Q1FY26 and ₹421 cr in Q3FY26, the first quarter with "0 Revlimid". EBITDA margin (before other income) went from 50% in FY25 to 25% in Q1FY27. We estimate gRevlimid added ~₹4,300 cr of EBITDA over FY23-FY26; FY27E profit (~₹${n0(F.pat[0])} cr) is about half of FY26's.` },
    { h: 'What is left: a ₹3,000 cr business plus 49% of Adcock', p: `Brazil (+180% in Q1), India (+27%, semaglutide), Canada and the US base make ~₹3,000 cr of revenue at a mid-20s margin. Adcock adds ₹${OB.assoc[0]} cr of profit in FY27E, ${n1(assocPct[0])}% of our PAT, from a company Natco does not control. Management guides ~₹750 cr of FY27 profit and 15-25% growth a year from FY28; we are slightly below on both.` },
    { h: 'The pipeline is real but unnamed and lumpy', p: 'Carfilzomib (sole FTF on one strength, settlement launch expected in CY2027), two FY28 US exclusivities management will not name, olaparib still in court, semaglutide in the US years away. Natco filed no major new first-to-file in FY26. The CEO calls it "a roller coaster"; we agree.' },
    { h: 'Valuation: the house rule says expensive; the street and our cross-checks disagree', p: `At ₹${n0(price)} the stock trades at ${n1(peFY28)}x our FY28E EPS and ${n1(peSep)}x Sep-28E. The street (post-Q4 notes, median ₹${n0(medTp)}) pays ~18x core earnings. Our ${MULT.base}x comes from the rule as written; on a since-2021 median with no trough years dropped (${SENS.all}x) the target would be ₹${n0(val(SENS.all))}. The rating hangs on that multiple.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'RED' },
    { k: 'Earnings momentum', v: 'RED' },
    { k: 'Competitive position', v: 'AMBER' },
    { k: 'Valuation', v: 'RED' },
  ],
  catalysts: [
    'Rights issue: record date 1-Oct-2026 (30-Sep-2026 was the last cum-rights day); ₹1,279 cr at ₹750, 2 for 21, mostly to repay ₹810.5 cr of loans.',
    'Q2FY27 results (due by mid-November 2026): the first full quarter at 49% of Adcock and the test of the ₹3,300-3,400 cr sales guidance.',
    'US launches: carfilzomib (settlement date confidential; CY2027 expected) and the two FY28 exclusivities; the olaparib patent trial ("in the next few months").',
    'Crop Health Sciences demerger (moved from Dec-2026 to ~Mar-2027) and the USFDA inspection of the Visakhapatnam plant (due).',
    'A second large acquisition (management: one outside India, one smaller in India); eGenesis kidney-xenotransplant registration trial from early 2027.',
  ],
};

// ---------------------------------------------------------------- Story in charts
const nonLen = SA.map(a => Math.round(a.total - a.lenalidomideEst));
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: 'Export formulations: ₹1,127 cr in Q1FY26, ₹421 cr once lenalidomide stopped', unit: 'Export formulations (₹ crore a quarter; incl. profit share and subsidiaries)', x: QL, series: [{ name: 'Export formulations', values: SQ.map(s => s.exports), fmt: 'num' }], labels: 'all', source: 'Q3FY26 and Q1FY27 investor presentations' },
      { type: 'stacked', title: `gRevlimid: ~₹${n0(lenSum)} cr of revenue over FY23-FY26 (GAM estimate)`, unit: 'Total revenue (₹ crore): estimated lenalidomide vs everything else', x: SA.map(a => a.fy), series: [{ name: 'Everything else', values: nonLen, fmt: 'num' }, { name: 'Lenalidomide (est.)', values: SA.map(a => a.lenalidomideEst), fmt: 'num' }], minLabel: 400, source: 'AR FY24 segment table, Q1FY27 presentation; lenalidomide is a GAM estimate (not disclosed)' },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin halved as the windfall ended', unit: 'Quarterly EBITDA margin, Screener basis (%)', x: 'Q.labels', series: [{ name: 'EBITDA margin', ref: 'Q.opm', fmt: 'pct0' }], labels: 'all', source: 'Screener.in quarterly results (to Q1FY27)' },
      { type: 'column', title: 'EPS: ₹104 at the peak, ~₹40 in FY27E', unit: 'EPS (₹)', x: 'fin.labels', from: 'FY19', to: 'FY29E', series: [{ name: 'EPS', ref: 'fin.eps', fmt: 'n1' }], labels: 'all', source: 'Screener.in; GAM estimates' },
    ] },
    { pair: [
      { type: 'column', title: 'The base that is growing: Brazil and India', unit: 'Q1 revenue (₹ crore): Q1FY26 vs Q1FY27', x: ['Brazil', 'India (domestic)', 'API', 'Crop health'], series: [{ name: 'Q1FY26', values: [Math.round(178 / 2.8), 107, 52.6, 34.7], fmt: 'num' }, { name: 'Q1FY27', values: [178, 136.4, 66.7, 40.8], fmt: 'num' }], labels: 'all', source: 'Q1FY27 call (Brazil ₹178 cr, +180%: Q1FY26 implied) and presentation' },
      { type: 'stacked', title: `Adcock: ${n1(assocPct[0])}% of our FY27E profit`, unit: 'Natco PAT (₹ crore): before vs from the Adcock share', x: F.years, series: [{ name: 'Natco ex-Adcock', values: X.taxRows.map(r => Math.round(r.patExAssoc)), fmt: 'num' }, { name: 'Adcock share', values: OB.assoc, fmt: 'num' }], minLabel: 50, source: 'GAM estimates (otherIncomeBuild, taxBuild)' },
    ] },
    { pair: [
      { type: 'line', title: `Forward P/E: ${n1(peSep)}x Sep-28E now vs a ${n1(FM.median)}x house median`, unit: 'Price ÷ next full-year EPS (x), house sampling', x: X.ALL.map(x => x[0]), series: [{ name: 'Forward P/E', values: X.ALL.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: FM.median, text: `Median ex-troughs: ${n1(FM.median)}x` }, { v: X.HALL.med, text: `All years: ${n1(X.HALL.med)}x`, color: '#cf8f1f' }], source: 'Screener.in prices and EPS; GAM estimates for FY27-28E' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street and our cross-checks', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...X.ST.map(s => s.broker), 'EV/EBITDA (GAM)', 'DCF (GAM)', 'GAM (base)'], series: [{ name: 'Target / value', values: [...X.ST.map(s => s.tp), Math.round(mv('ev').value), Math.round(mv('dcf').value), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes standing on 30-Sep-2026 (ICICI Securities 31-May, Investec 2-Jun, Geojit 18-Mar-2026); GAM Research' },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.windfall, P3.us, P3b.intl, P3b.adcock, P4.chs, P4.plants, P4.moat, p.financials, P4b.margins, p.capital, P4b.quality, p.balance, P4b.ownership(p.ownershipBase), P4b.governance, P5.forecasts, P5.street, P5b.valuation, P6.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
