// CEAT report, part B: cover, the story in charts, and the merger of part2-6 (business, history, industry, tailwind test,
// standalone business, Camso, moat, Q1FY27, earnings quality, ownership, governance, forecasts, street, valuation, verdict,
// glossary, statement notes). Shared inputs in CEATLTD.ctx.js; forecast and valuation figures are live tokens ({{...}}) that
// follow assumptions.json. As of 30-Sep-2026.
const X = require('./CEATLTD.ctx');
const { F, V, SA, SQ, n0, n1, price, mv, HA, sectorDr, MULT, epsSep, rating, postQ1, medTp, Q1 } = X;
const P2 = require('./CEATLTD.part2'), P3 = require('./CEATLTD.part3'), P4 = require('./CEATLTD.part4'), P5 = require('./CEATLTD.part5'), P6 = require('./CEATLTD.part6');
const QC = Q1.consolidated, QS = Q1.standalone;

const cover = {
  headline: 'A strong domestic tyre brand caught in a raw-material squeeze, with a Camso bet still losing money: fairly priced after the sector de-rating',
  lead: `CEAT makes two-wheeler, car, truck, farm and off-highway tyres in six Indian plants and, since Sep-2025, Camso construction tyres and rubber tracks in Sri Lanka (bought from Michelin). Q1FY27 showed both sides of the story: standalone revenue +${QS.growthPct}% (volume +13-14%), but raw materials up 16-18% in a quarter cut the EBITDA margin to 8.5%, and a ₹48 cr Sri Lankan-rupee loss plus Camso start-up costs left consolidated profit at ₹${QC.pat} cr. We forecast EPS of ₹${n1(F.eps[0])} / ₹${n1(F.eps[1])} / ₹${n1(F.eps[2])} for FY27-29E, close to Motilal Oswal. The street values CEAT on **P/E on one-year-forward EPS** (MOSL ~18x FY28E; Emkay 18x FY28E). The house rule (its forward P/E median since 2021, ${n1(HA.med)}x, cut by the ${Math.abs(sectorDr).toFixed(1)}% tyre-sector de-rating) gives **${MULT.base}x Sep-28E EPS of ₹${n1(epsSep.base)} = {{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}**. Cross-checks: DCF ₹${n0(mv('dcf').value)}; EV/EBITDA ₹${n0(mv('ev').value)}. Bull case {{scen.bull.tp|inr}}; bear case {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'A domestic franchise that keeps growing', p: `CEAT leads two-wheeler replacement (~31% share), is third in cars (~17%) and holds ~25% of OEM electric car and two-wheeler fitments. Standalone revenue grew 15.5% in FY26 and 18.3% in Q1FY27, with replacement up mid-teens, OEM low teens and exports ~30%. New car-tyre (Chennai) and two-wheeler (Nagpur, plus ₹1,205 cr approved in July) capacity supports it. We model standalone revenue +${X.AS.segments[0].growth.map(n1).join('% / +')}% for FY27-29E.` },
    { h: 'The margin squeeze is a lag, but a deep one', p: `Gross margin fell to 33.5% in Q1 against the 40-41% management calls normal; Q2 adds another 8-10% of raw-material inflation. CEAT had taken ~11% of the ~15-16% price increase it needs by mid-July, with OEM index increases from 1-Jul. We assume a standalone margin of ${X.AS.segments[0].marginPct[0]}% for FY27E and ${X.AS.segments[0].marginPct[2]}% by FY29E, below FY26's 13.4%.` },
    { h: 'Camso: a long-dated bet', p: `CEAT paid ₹1,186 cr for Camso and owes ~₹420 cr (USD44 mn) more for the brand in 2028. Until customers move from Michelin (90% by Sep-2026) and the plant gets its own mixers (by Mar-2027), CEAT sells through Michelin at 25-30% less and Camso loses money at EBITDA. We assume a 0% margin in FY27E, 8% in FY28E and 10% in FY29E on ₹1,200-1,330 cr of revenue.` },
    { h: 'Valuation: fair, not cheap', p: `At ₹${n0(price)} CEAT trades at ${n1(price / F.eps[1])}x our FY28E and ${n1(X.sepNow)}x Sep-28E EPS, against a ${n1(HA.med)}x forward median since 2021. Tyre stocks were ${Math.abs(sectorDr).toFixed(1)}% below their five-year medians on 30-Sep-2026 (MRF and Apollo much more), so ${MULT.base}x gives {{dcf.tp|inr}}, below the post-Q1 street median (₹${n0(medTp)}), which applies 16-18x without that de-rating. The stock is 21% below its Oct-2025 high.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg']],
  flags: [
    { k: 'Accounting', v: 'GREEN' },
    { k: 'Predictability', v: 'RED' },
    { k: 'Earnings momentum', v: 'RED' },
    { k: 'Competitive position', v: 'GREEN' },
    { k: 'Valuation', v: 'AMBER' },
  ],
  catalysts: [
    'Q2FY27 results (typically mid-October): the size of the second raw-material step-up (8-10% q/q) against ~15% of replacement price increases and the OEM index increase from 1-Jul.',
    'Natural rubber after the monsoon: domestic ~₹280/kg in July (a 15-year high, ₹15-20 above import parity); management expects it to follow crude down once the West Asia conflict eases.',
    'Camso in H2FY27: the first quarters with ~90% of customers billed directly; whether the business turns EBITDA positive.',
    'The Sri Lankan rupee: USD24.5 mn of the USD80 mn intra-group loan converts to equity; further LKR falls still hit finance cost.',
    'Capacity: Chennai car tyres to 130 lakh a year by FY28, Nagpur two-wheeler to 100,000 a day, and the ₹1,205 cr two-wheeler project.',
  ],
};

// ---------------------------------------------------------------- Story in charts
const yrs = SA.map(r => r.fy), Fy = F.years;
const segRev = k => [...SA.map(r => Math.round(r[`${k}Rev`])), ...F.seg[k].revenue.map(Math.round)];
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'stacked', title: 'India drives the growth; Camso adds ~6% of revenue from FY28E', unit: 'Revenue (₹ crore)', x: [...yrs, ...Fy], series: [{ name: 'CEAT standalone (India plants)', values: segRev('india'), fmt: 'num' }, { name: 'Camso and other subsidiaries', values: segRev('subs'), fmt: 'num' }], labels: 'none', source: 'Emkay (18-Jul-2026) quarterly tables; Q4FY26 call; GAM estimates FY27-29E' },
      { type: 'line', title: 'EBITDA margin: 8.5% in Q1FY27; we assume a recovery to ~13% by FY29E', unit: 'EBITDA margin (%)', x: 'fin.labels', from: 'FY18', to: 'FY29E', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 0, max: 18, source: 'Screener.in; GAM estimates FY27-29E' },
    ] },
    { pair: [
      { type: 'line', title: 'Gross margin fell 6pp in one quarter; EBITDA margin followed', unit: '%', x: SQ.map(q => q.q), series: [{ name: 'Gross margin (consolidated)', values: SQ.map(q => q.grossMarginPct), fmt: 'pct' }, { name: 'Standalone EBITDA margin', values: SQ.map(q => q.indiaMarginPct), fmt: 'pct' }], labels: 'last', min: 0, max: 45, source: 'Emkay result update (18-Jul-2026), company data' },
      { type: 'column', title: 'Standalone revenue growth: double digits for five quarters', unit: 'Standalone revenue (₹ crore)', x: SQ.map(q => q.q), series: [{ name: 'Revenue', values: SQ.map(q => Math.round(q.indiaRev)), fmt: 'num' }], labels: 'all', source: 'Emkay result update (18-Jul-2026)' },
    ] },
    { pair: [
      { type: 'column', title: 'Camso so far: revenue through Michelin, EBITDA around zero', unit: 'Subsidiaries = consolidated less standalone (₹ crore)', x: SQ.slice(4).map(q => q.q), series: [{ name: 'Revenue', values: SQ.slice(4).map(q => Math.round(q.subsRev)), fmt: 'num' }, { name: 'EBITDA', values: SQ.slice(4).map(q => Math.round(q.subsEbitda)), fmt: 'num' }], labels: 'all', source: 'Emkay quarterly tables (18-Jul-2026); GAM calculation' },
      { type: 'column', title: 'Finance cost jumped in Q1FY27 on a Sri Lankan-rupee loss', unit: 'Finance cost (₹ crore)', x: SQ.map(q => q.q), series: [{ name: 'Finance cost', values: SQ.map(q => Math.round(q.interest)), fmt: 'num' }], labels: 'all', source: 'Emkay quarterly tables; Q1FY27 call (₹48 cr LKR loss on the USD80 mn loan)' },
    ] },
    { pair: [
      { type: 'line', title: `Forward P/E: ${n1(X.sepNow)}x Sep-28E now vs a ${n1(HA.med)}x median since 2021`, unit: 'Price ÷ next full-year EPS (x)', x: X.HS.map(x => x[0]), series: [{ name: 'Forward P/E', values: X.HS.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: MULT.base, text: `Our multiple: ${MULT.base}x`, color: '#cf8f1f' }], source: 'Screener.in prices and reported EPS; GAM estimates FY27-28E (FY23 forward year left out as a trough)' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (post-Q1 notes)', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...postQ1.map(s => s.broker), 'GAM (base)'], series: [{ name: 'Target', values: [...postQ1.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: `MOSL (17-Jul), Emkay (18-Jul), ICICI Securities and Nomura (20-Jul), Nirmal Bang (Jul-2026); median ₹${n0(medTp)}; GAM Research` },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.india, P3.camso, P3.moat, p.financials, P4.guidance, p.capital, P4.quality, p.balance, P4.ownership(p.ownershipBase), P4.governance, P4.forecasts, P5.street, P5.valuation, P6.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
