// ZF CV India report, part B: cover, the story in charts, and the merger of part2-6 (business, history, industry, tailwind
// test, domestic OEM & ESC, aftermarket, exports & services, moat, Q1FY27, earnings quality, ownership, governance,
// forecasts, street, valuation, verdict, glossary, statement notes). Shared inputs in ZFCVINDIA.ctx.js; forecast and
// valuation figures are live tokens ({{...}}) that follow assumptions.json. As of 30-Sep-2026.
const X = require('./ZFCVINDIA.ctx');
const { F, V, SA, SQ, QL, n0, n1, price, mv, FM, sectorDr, MULT, epsSep, rating, standing, medTp, arn, tre0, RP } = X;
const P2 = require('./ZFCVINDIA.part2'), P3 = require('./ZFCVINDIA.part3'), P4 = require('./ZFCVINDIA.part4'), P5 = require('./ZFCVINDIA.part5'), P6 = require('./ZFCVINDIA.part6');

const cover = {
  headline: 'The incumbent for India\'s 2027 truck-safety rules, priced for most of it',
  lead: `ZF Commercial Vehicle Control Systems India (the former WABCO India, 60% owned by ZF) makes the air brakes in most Indian trucks and buses, sells spares, and exports goods and engineering services to its parent. Revenue grew 7.5% in FY26 and 9.3% in Q1FY27, but the Q1 margin fell to 12.9% on aluminium costs and FY26's ₹61 cr of FX gains will not repeat. We forecast EPS (post-bonus) of ₹${n1(F.eps[0])} / ₹${n1(F.eps[1])} / ₹${n1(F.eps[2])} for FY27-29E, with the step-up when ESC becomes mandatory on all trucks from Oct-2027. The street values ZF CV on **P/E on one-year-forward EPS** (Anand Rathi 50x Mar-28E). The house rule (its own forward P/E median since 2021, ${n1(FM.median)}x, cut by the ${Math.abs(sectorDr).toFixed(1)}% auto-component de-rating) gives **${MULT.base}x Sep-28E EPS of ₹${n1(epsSep.base)} = {{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}.** Cross-checks: EV/EBITDA ₹${n0(mv('ev').value)}, DCF ₹${n0(mv('dcf').value)}. Bull case {{scen.bull.tp|inr}}; bear case {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'A real moat, and regulation is about to widen it', p: `ZF CV India has supplied Indian truck makers\' air brakes for six decades and the ZF group claims ~80% of CV braking in India. ESC has been mandatory on most buses since Sep-2025; from Oct-2027 every truck and bus above 6 tonnes needs ESC and five ADAS functions. ZF holds pneumatic ESC nominations from three major OEMs and full ADAS-suite awards from two. We model OEM revenue +${X.BL.oemGrowth[1]}% in FY28E and +${X.BL.oemGrowth[2]}% in FY29E.` },
    { h: 'But the next twelve months are about costs and the cycle', p: 'Q1FY27 EBITDA margin was 12.9%: aluminium went from ~₹260 to >₹360/kg and OEMs pay back with a lag ("over the next quarter"). The CFO\'s May outlook was "flattish... single-digit small growth". Trucks above 6 tonnes grew 16.6% in FY26, so the base is high, and a rule that raises truck prices in 2027 may pull demand forward. FY27E EPS is flat on FY26 in our model.' },
    { h: 'A third of revenue is with the parent, on the parent\'s terms', p: `Goods exports (₹1,025 cr, −11% in FY26 on US tariffs) and engineering services (₹504 cr, +11%) go mostly to ZF CV Systems Global at cost-plus prices: ₹${n0(RP.zfGlobalTotal)} cr of transactions in FY26, with ₹2,500 cr approved for FY27. Royalty is 2.5% of revenue. This cushions the Indian cycle but caps the margin, and ZF has sold 15% of the company since 2024.` },
    { h: 'Valuation: fair, with the street\'s Buys assuming 50x', p: `At ₹${n0(price)} the stock trades at ${n1(price / F.eps[1])}x our FY28E and ${n1(X.sepNow)}x Sep-28E EPS, below its own ${n1(FM.median)}x forward median since 2021, with ₹${n0(tre0)} cr of net cash inside. Auto-component stocks sat ${Math.abs(sectorDr).toFixed(1)}% below their five-year medians on 30-Sep-2026. The four standing broker targets (median ₹${n0(medTp)}) are all Buy; Anand Rathi's 50x on its higher pre-squeeze EPS (FY28E ₹${n1(arn.eps.FY28E)} vs our ₹${n1(F.eps[1])}) explains the gap.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'AMBER' },
    { k: 'Earnings momentum', v: 'AMBER' },
    { k: 'Competitive position', v: 'GREEN' },
    { k: 'Valuation', v: 'AMBER' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): margin recovery after the July price increases and OEM cost settlements; Jul-Sep truck volumes.',
    'ESC/ADAS: more OEM nominations, homologation at the ZF Proving Ground, and the start of localised ESC production ahead of Oct-2027.',
    'Exports: US truck production and tariffs; new North American actuator and disc-brake-chamber programmes; the India-EU trade agreement.',
    'The parent: further stake sales by WABCO Asia (60.00%), new engineering or sourcing work moved to India, and any change to the payout policy.',
    'Metal prices: aluminium had eased ~₹25/kg in July from its >₹360/kg peak.',
  ],
};

// ---------------------------------------------------------------- Story in charts
const yoyQ = X.M.quarterly.sales.map((s, i, a) => (i >= 4 ? Math.round((s / a[i - 4] - 1) * 1000) / 10 : null)).slice(-8);
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: `Revenue: ₹4,119 cr in FY26; ₹${n0(F.sales[2])} cr by FY29E`, unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY19', to: 'FY29E', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'all', source: 'Screener.in; GAM estimates FY27-29E' },
      { type: 'column', title: 'Quarterly growth: −8% to +14%; +9% in Q1FY27', unit: 'Revenue growth year on year (%)', x: X.M.quarterly.labels.slice(-8), series: [{ name: 'Revenue growth', values: yoyQ, fmt: 'pct' }], labels: 'all', source: 'Quarterly results as reported (Screener.in)' },
    ] },
    { pair: [
      { type: 'stacked', title: 'Domestic OEM ~45%; exports ~25%; services + other income ~15%', unit: 'Total income by line (₹ crore)', x: QL, series: [{ name: 'Domestic OEM', values: SQ.map(q => q.oem), fmt: 'num' }, { name: 'Aftermarket', values: SQ.map(q => q.aftermarket), fmt: 'num' }, { name: 'Exports', values: SQ.map(q => q.exports), fmt: 'num' }, { name: 'Services + other income', values: SQ.map(q => q.svcOi), fmt: 'num', color: '#7a5c99' }], minLabel: 100, source: 'Q4FY26 presentation p32; Q1FY27 call (OEM derived)' },
      { type: 'line', title: 'EBITDA margin: 12.9% in Q1FY27, the lowest in two years', unit: 'EBITDA margin excl. other income (%)', x: QL, series: [{ name: 'EBITDA margin', values: SQ.map(q => q.marginPct), fmt: 'pct' }], labels: 'all', min: 8, max: 22, source: 'Screener.in quarterly results' },
    ] },
    { pair: [
      { type: 'column', title: 'Trucks and buses >6t: 463k in FY26; ESC on all from Oct-2027', unit: 'Production (thousand vehicles)', x: ['FY25', 'FY26'], series: [{ name: 'Production', values: [X.D.industry.production.fy25CvK, X.D.industry.production.fy26CvK], fmt: 'num' }], labels: 'all', source: 'Q4FY26 call' },
      { type: 'line', title: `EBITDA margin: 10% in FY22, 16% in FY26, ${n1(F.ebitdaMargin[2])}% in FY29E`, unit: 'EBITDA margin excl. other income (%)', x: 'fin.labels', from: 'FY16', to: 'FY29E', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 6, max: 20, source: 'Screener.in; GAM estimates FY27-29E' },
    ] },
    { pair: [
      { type: 'line', title: `Forward P/E: ${n1(X.sepNow)}x Sep-28E now vs a ${n1(FM.median)}x median since 2021`, unit: 'Price ÷ next full-year EPS (x)', x: FM.series.map(x => x[0]), series: [{ name: 'Forward P/E', values: FM.series.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: MULT.base, text: `Our multiple: ${MULT.base}x`, color: '#cf8f1f' }], source: 'Screener.in prices and EPS (bonus-adjusted); GAM estimates for FY27-28E' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (standing targets, post-bonus ₹)', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...standing.map(s => `${s.broker} (${X.shortDate(s.date)})`), 'GAM (base)'], series: [{ name: 'Target', values: [...standing.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: `Trendlyne listing (ICICI Securities, ICICI Direct, Geojit); Anand Rathi PDF; pre-bonus targets ÷ 6; median ₹${n0(medTp)}; GAM Research` },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.oem, P3.aftermarket, P3.parent, P3.moat, p.financials, P4.guidance, p.capital, P4.quality, p.balance, P4.ownership(p.ownershipBase), P4.governance, P4.forecasts, P5.street, P5.valuation, P6.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
