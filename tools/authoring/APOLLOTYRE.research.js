// Apollo Tyres report, part B: cover, the story in charts, and the merger of part2-6 (business, history, industry, tailwind
// test, India, Europe, moat, Q1FY27, earnings quality, ownership, governance, forecasts, street, valuation, verdict, glossary,
// statement notes). Shared inputs in APOLLOTYRE.ctx.js; forecast and valuation figures are live tokens ({{...}}) that follow
// assumptions.json. As of 30-Sep-2026.
const X = require('./APOLLOTYRE.ctx');
const { F, V, SA, SQ, C, n0, n1, price, mv, HA, sectorDr, MULT, epsSep, rating, postQ1, medTp, Q1, FY26, b } = X;
const P2 = require('./APOLLOTYRE.part2'), P3 = require('./APOLLOTYRE.part3'), P4 = require('./APOLLOTYRE.part4'), P5 = require('./APOLLOTYRE.part5'), P6 = require('./APOLLOTYRE.part6');

const cover = {
  headline: 'India\'s replacement-tyre leader in a raw-material squeeze, with Europe finally being fixed: cheap on normal earnings',
  lead: `Apollo Tyres makes truck, car, farm and two-wheeler tyres in India (~69% of revenue) and, as Apollo Vredestein, premium car and farm tyres for Europe (~26%). Q1FY27 showed both sides of the story: India volume up ~12% and revenue +15.6%, but raw materials +17% q/q cut the consolidated EBITDA margin to 11.7%, and Europe earned 8.9% while the Enschede plant (Netherlands) was shut. We forecast EPS of ₹${n1(F.eps[0])} / ₹${n1(F.eps[1])} / ₹${n1(F.eps[2])} for FY27-29E, close to the street. The street values Apollo on **P/E on one-year-forward EPS** (MOSL 16x FY28E, Emkay 18x Jun-28E; ICICI Direct uses 7x EV/EBITDA). The house rule (its forward P/E median since 2021 on EPS before one-offs, ${n1(HA.med)}x, cut by the ${Math.abs(sectorDr).toFixed(1)}% tyre-sector de-rating) gives **${MULT.base}x Sep-28E EPS of ₹${n1(epsSep.base)} = {{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}**. Cross-checks: DCF ₹${n0(mv('dcf').value)}; EV/EBITDA ₹${n0(mv('ev').value)}, below the price. Bull case {{scen.bull.tp|inr}}; bear case {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'India is growing faster than the industry and gaining share', p: `Standalone revenue grew 15.6% in Q1FY27, the fastest in 14 quarters, with double-digit volume in replacement, OEM and exports; management estimates its TBR replacement share back above 30% and PCR at 21%+. Capacity runs in the 90s and a ₹5,800 cr Andhra Pradesh expansion (+17-20% India capacity) starts at end-FY27. We model APMEA revenue +${X.AS.segments[0].growth.join('% / +')}% for FY27-29E.` },
    { h: 'The margin squeeze is a lag, not a reset', p: `Raw materials rose ~17% in Q1 and ~8% more in Q2 (rubber ₹225 to ₹260+/kg). Apollo had taken ~11% of the 15-16% price increases needed by early August, competitors followed, and OEM formula prices catch up with a quarter's lag; CRISIL sees industry margins at 11.5-12% in FY27 and 13-13.5% in FY28. We assume {{F.ebitdaMargin.0|pct}} for FY27E and {{F.ebitdaMargin.2|pct}} by FY29E, below the FY24 peak (17.6%).` },
    { h: 'Europe: the expensive part is done', p: `Enschede stopped production in Jun-2026 after ₹1,128 cr of charges in FY25-26; volumes move to Hungary, India and offtake partners. Management says Europe would have earned ~11% in Q1 without overlap costs and targets "high teens". We assume 12% / 14% / 15% segment margins for FY27-29E (13.0% in FY26), still below the 16% the company calls normal. ~EUR55 mn of cash costs fall in FY27.` },
    { h: 'Valuation: cheap on normal earnings', p: `At ₹${n0(price)} Apollo trades at ${n1(price / F.eps[1])}x our FY28E and ${n1(X.sepNow)}x Sep-28E EPS, against a ${n1(HA.med)}x median since 2021 on EPS before one-offs; the stock is 26% below its all-time high and 22% below its 52-week high. Even after the ${Math.abs(sectorDr).toFixed(1)}% sector de-rating, ${MULT.base}x gives {{dcf.tp|inr}}, close to the post-Q1 street median (₹${n0(medTp)}). The risk is the capex cycle: FY27-28E free cash flow is thin and net debt rises.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'RED' },
    { k: 'Earnings momentum', v: 'AMBER' },
    { k: 'Competitive position', v: 'GREEN' },
    { k: 'Valuation', v: 'GREEN' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): the size of the second raw-material step-up (~8% q/q) against ~11% of price increases and OEM pass-through.',
    'Natural rubber after the monsoon: management expects it to cool from Q3FY27; Apollo buys about half its rubber abroad and domestic prices track import parity.',
    'Europe in H2FY27: the first quarters without Enschede\'s costs, the Hungary PCR ramp-up (17,000 to 21,000 tyres a day) and the agri offtake stabilising.',
    'Andhra Pradesh capacity from end-FY27 and FY28 capex (possibly above ₹3,000 cr): returns on the ₹5,800 cr plan.',
    'A new CFO after Gaurav Kumar\'s resignation (Aug-2026), and the 2026-31 strategy targets management said it would set out.',
  ],
};

// ---------------------------------------------------------------- Story in charts
const yrs = SA.map(r => r.fy), Fy = F.years;
const segRev = k => [...SA.map(r => Math.round(r[`${k}Rev`])), ...F.seg[k].revenue.map(Math.round)];
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'stacked', title: `India (APMEA) drives the growth; Europe adds little`, unit: 'External revenue by segment (₹ crore)', x: [...yrs, ...Fy], series: [{ name: 'APMEA (India-led)', values: segRev('apmea'), fmt: 'num' }, { name: 'Europe', values: segRev('eur'), fmt: 'num' }, { name: 'Others', values: segRev('oth'), fmt: 'num' }], labels: 'none', source: 'Annual reports FY21-26 (segment notes); GAM estimates FY27-29E' },
      { type: 'line', title: 'EBITDA margin: 11.7% in Q1FY27; we assume a recovery to ~15% by FY29E', unit: 'EBITDA margin (%)', x: 'fin.labels', from: 'FY18', to: 'FY29E', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 5, max: 20, source: 'Screener.in; GAM estimates FY27-29E' },
    ] },
    { pair: [
      { type: 'line', title: 'Quarterly margins: India recovered in FY26, then rubber hit; Europe weak', unit: 'EBITDA margin (%)', x: SQ.map(q => q.q), series: [{ name: 'India (standalone)', values: SQ.map(q => q.indiaMarginPct), fmt: 'pct' }, { name: 'Europe (excl. ReifenCom)', values: SQ.map(q => q.europeMarginPct), fmt: 'pct' }], labels: 'last', min: 5, max: 20, source: 'Company presentations (Aug-2024 to Aug-2026)' },
      { type: 'column', title: 'Europe in euros: flat for two years', unit: 'Europe manufacturing and sales revenue (EUR mn, excl. ReifenCom)', x: SQ.map(q => q.q), series: [{ name: 'Revenue', values: SQ.map(q => q.europeRevEurMn), fmt: 'num' }], labels: 'all', source: 'Company presentations' },
    ] },
    { pair: [
      { type: 'column', title: 'The Enschede bill: ₹1,034 cr of exceptional items in FY26', unit: 'Exceptional items before tax (₹ crore; + = charge)', x: SQ.map(q => q.q), series: [{ name: 'Exceptional items', values: SQ.map(q => q.exceptional), fmt: 'num' }], labels: 'all', source: 'Company presentations; MOSL (7-Aug-2026)' },
      { type: 'column', title: 'The build-out: capex jumps in FY27-28E; free cash flow thin', unit: '₹ crore', x: 'fin.labels', from: 'FY20', to: 'FY29E', series: [{ name: 'Cash from operations', ref: 'fin.cfo', fmt: 'num' }, { name: 'Capex', ref: 'fin.capex', fmt: 'num' }], labels: 'none', source: 'Screener.in; GAM estimates (forecast CFO excludes treasury income)' },
    ] },
    { pair: [
      { type: 'line', title: `Forward P/E on EPS before one-offs: ${n1(X.sepNow)}x Sep-28E now vs a ${n1(HA.med)}x median since 2021`, unit: 'Price ÷ next full-year EPS before one-offs (x)', x: X.HS.map(x => x[0]), series: [{ name: 'Forward P/E', values: X.HS.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: MULT.base, text: `Our multiple: ${MULT.base}x`, color: '#cf8f1f' }], source: 'Screener.in prices; MOSL adjusted EPS FY22-26; GAM estimates FY27-28E' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (post-Q1 notes)', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...postQ1.map(s => s.broker), 'GAM (base)'], series: [{ name: 'Target', values: [...postQ1.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: `MOSL (7-Aug), Emkay (9-Aug), ICICI Direct and ICICI Securities (10-Aug), Nomura (Aug), JPMorgan (11-Aug), UBS (23-Aug-2026); median ₹${n0(medTp)}; GAM Research` },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.india, P3.europe, P3.moat, p.financials, P4.guidance, p.capital, P4.quality, p.balance, P4.ownership(p.ownershipBase), P4.governance, P4.forecasts, P5.street, P5.valuation, P6.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
