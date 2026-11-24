// Glenmark report, part B: cover, story in charts, and the merger of part2-6 (business, history, industry, tailwind test,
// North America, US pipeline and plants, India, Europe/EM, ISB 2001 & IGI, moat, Q1FY27, earnings quality, ownership,
// governance, forecasts, street, valuation, risks, glossary, statement notes). Shared inputs in GLENMARK.ctx.js. Forecast and
// valuation figures are live tokens ({{...}}) or computed from the model, so they follow assumptions.json. As of 30-Sep-2026.
const X = require('./GLENMARK.ctx');
const { F, V, n0, n1, SQ, QL, Q1, FY26, price, mv, peMult, epsSep28, HA, FM, fwdAdj, rating, postQ1, avgTp, medTp, peSep28, peSep28Rep, lines, YRS, BL, k, repEps, mosl, isbRep, SENS, val, TROUGH, epsExc } = X;
const P2 = require('./GLENMARK.part2'), P3 = require('./GLENMARK.part3'), P3B = require('./GLENMARK.part3b'), P4 = require('./GLENMARK.part4'), P4B = require('./GLENMARK.part4b'), P5 = require('./GLENMARK.part5'), P6 = require('./GLENMARK.part6');
const coreQ1m = (Q1.ebitda - Q1.naDeferredCr) / (Q1.revenue - Q1.naDeferredCr) * 100;

const cover = {
  headline: 'A better company on a stricter yardstick: AbbVie\'s cheque fixed the balance sheet, but core earnings and Glenmark\'s own valuation history do not support ₹2,335',
  lead: `Glenmark is India's No.13 drug maker, with leading dermatology, respiratory and cardiac brands, branded businesses in Europe and emerging markets, a US generics arm and a biotech (IGI) that licensed its lead antibody to AbbVie for US$700mn upfront in 2025. That cheque cleared the debt and made FY26 profit (₹${n0(FY26.patOwnersCr)} cr) possible despite ₹2,266 cr of exceptional charges. Q1FY27 sales grew 23%, but the core EBITDA margin (excluding US$17.5mn a quarter of deferred licensing income that brings no cash) fell to ${n1(coreQ1m)}%. The stock is ₹${n0(price)}: ${n1(peSep28)}x our Sep-28E core EPS (${n1(peSep28Rep)}x on the street's reported basis). The street values Glenmark on **P/E (25x forward EPS; MOSL adds ₹290 for ISB 2001)**. We forecast core EPS of ₹${n1(F.eps[0])} / ${n1(F.eps[1])} / ${n1(F.eps[2])} for FY27-29E (₹${n1(repEps[0])} / ${n1(repEps[1])} on the reported basis, in line with MOSL's ₹${n1(mosl.eps.FY27E)} / ${n1(mosl.eps.FY28E)}). Applying **${peMult}x to Sep-28E core EPS of ₹${n1(epsSep28)}** (Glenmark's own forward median of ${n1(HA.med)}x since 2021 on EPS before exceptional items and licensing income, leaving out the ${TROUGH.join(' and ')} troughs, re-rated by the pharma sector's +8.2%) gives **{{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}.** Cross-checks: EV/EBITDA ₹${n0(mv('ev').value)}, DCF ₹${n0(mv('dcf').value)}. Bull case {{scen.bull.tp|inr}}; bear case {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'Reported earnings flatter Glenmark until March 2028', p: `US$175mn of the AbbVie upfront, already received in cash, is being booked as revenue at US$17.5mn a quarter to Mar-2028 (~₹${n0(isbRep[0])} cr in FY27E, ~₹${n1(repEps[0] - F.eps[0])} of EPS). It roughly offsets IGI's research bill, which stays after the income stops. Q1FY27's 20.0% EBITDA margin was ${n1(coreQ1m)}% without it. We treat the whole upfront as a one-off and forecast no milestones or royalties.` },
    { h: 'The branded business underneath is genuinely good', p: `India grew ${n1((Q1.india / Q1.indiaPrior - 1) * 100)}% in Q1FY27 (secondary sales +${Q1.indiaSecondaryPct}% vs the market's ${Q1.ipmPct}%), emerging markets +${n1((Q1.em / Q1.emPrior - 1) * 100)}%, Europe +${n1((Q1.europe / Q1.europePrior - 1) * 100)}%; Ryaltris passed US$100mn and grows 40%; Monroe (Nov-2025) and Goa (Sep-2026) were cleared by the USFDA, and North America core sales grew ${Q1.naCoreGrowthPct}% on the first respiratory launches.` },
    { h: 'The record says haircut the promises', p: 'Exceptional charges in five straight years (₹261 cr to ₹2,266 cr), two India destocking episodes in two years, negative operating cash flow in FY24 and FY25, margin targets missed (23% by FY27 promised in 2022; 21-22% guided now), and Indore still under a USFDA warning letter. Debt was repaid twice with one-off money (the GLS sale, the AbbVie upfront).' },
    { h: 'Valuation: the price already pays for the plan', p: `Glenmark's comparable forward P/E has two regimes since 2021: ~16x in its debt-and-warning-letter years and ~32x since the AbbVie deal; the ex-trough median is ${n1(HA.med)}x. ${peMult}x Sep-28E core EPS gives {{dcf.tp|inr}}, and EV/EBITDA and the DCF are also below the price. The strongest counter-argument is the house median on reported EPS (${n1(FM.median)}x), which would give ~₹${n0(val(SENS.reported))}, a HOLD; the street's post-Q1 median target is ₹${n0(medTp)}.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'RED' },
    { k: 'Predictability', v: 'RED' },
    { k: 'Earnings momentum', v: 'AMBER' },
    { k: 'Competitive position', v: 'AMBER' },
    { k: 'Valuation', v: 'RED' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): the first full quarter of gFlovent 44; core margin against the 21-22% reported guide and the freight/API squeeze.',
    'US approvals in H2FY27 (gFlovent 110mcg, prescription fluticasone nasal spray, an ipratropium inhaler) and the two sole first-to-file launches late in Q3 and in Q4FY27.',
    'ISB 2001: AbbVie\'s development decisions and any milestone (none received by Aug-2026); ISB 2301 IND by the end of 2026.',
    'Launches in India and emerging markets: Aumolertinib (H2FY27), Trastuzumab Rezetecan filings (from Q2FY27), Ryaltris in Brazil (H2FY27).',
    'USFDA re-inspection of Indore; settlements with the remaining US antitrust groups.',
  ],
};

// ---------------------------------------------------------------- Story in charts
const coreM = q => Math.round((q.ebitdaCore ?? q.ebitda) / (q.revenue - (q.isb || 0)) * 1000) / 10;
const SQx = SQ.filter(q => q.q !== 'Q2FY26');
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: 'India: the GST destocking (Q2FY26) and a clean Q1FY27 (+15.5%)', unit: 'India sales (₹ crore)', x: QL, series: [{ name: 'India', values: SQ.map(q => q.india), fmt: 'num' }], labels: 'all', highlight: 'Q1FY27', source: 'Company releases' },
      { type: 'column', title: 'North America core: flat for two years, +20% in Q1FY27', unit: 'North America excl. ISB 2001 income (₹ crore)', x: QL, series: [{ name: 'NA core', values: SQ.map(q => q.naCore), fmt: 'num' }], labels: 'all', highlight: 'Q1FY27', source: 'Company releases (core growth rates); GAM' },
    ] },
    { pair: [
      { type: 'line', title: `EBITDA margin: reported 20.0% vs core ${n1(coreQ1m)}% in Q1FY27`, unit: 'EBITDA margin (%); core excludes ISB 2001 income (Q2FY26 left out)', x: SQx.map(q => q.q), series: [{ name: 'Reported', values: SQx.map(q => Math.round(q.ebitda / q.revenue * 1000) / 10), fmt: 'pct' }, { name: 'Core', values: SQx.map(coreM), fmt: 'pct' }], labels: 'all', min: 10, max: 25, source: 'Company releases; Screener; GAM' },
      { type: 'column', title: 'EPS: a loss in FY24, a deal-made FY26, core growth after', unit: 'EPS (₹); reported to FY26, GAM core estimates FY27-29E', x: 'fin.labels', from: 'FY21', series: [{ name: 'EPS', ref: 'fin.eps', fmt: 'n1' }], labels: 'all', source: 'Screener.in, GAM Research' },
    ] },
    { pair: [
      { type: 'line', title: `Forward P/E (core, ex-trough): ~16x, then ~32x; median ${n1(HA.med)}x`, unit: 'Price ÷ next full-year EPS before exceptional items and licensing income (x)', x: fwdAdj.map(x => x[0]), series: [{ name: 'Forward P/E', values: fwdAdj.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: HA.med, text: `Median ${n1(HA.med)}x` }, { v: peMult, text: `Our target ${peMult}x`, color: '#cf8f1f' }], source: 'Screener.in prices; company EPS before exceptional items; GAM core estimates FY27-28E' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (notes standing on 30-Sep-26)', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...postQ1.map(s => `${s.broker} (${s.rating})`), 'GAM (base)'], series: [{ name: 'Target', values: [...postQ1.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes and aggregators, 3-7 Aug 2026; GAM Research' },
    ] },
    { pair: [
      { type: 'stacked', title: 'Core revenue by region: India leads the growth', unit: 'Revenue by region (₹ crore); FY26 excl. ISB 2001 income; FY27-29E = GAM build', x: ['FY26', ...YRS], series: [{ name: 'India', values: [BL.base.india, ...lines.india], fmt: 'num' }, { name: 'North America (core)', values: [BL.base.na, ...lines.na], fmt: 'num' }, { name: 'Europe', values: [BL.base.europe, ...lines.europe], fmt: 'num' }, { name: 'Emerging markets', values: [BL.base.em, ...lines.em], fmt: 'num' }], minLabel: 1500, source: 'AR FY26; GAM estimates' },
      { type: 'hbar', title: 'Target, cross-checks and scenarios', unit: '₹ per share', x: ['Bear case', 'DCF', 'GAM target', 'EV/EBITDA', 'CMP', 'Street average', 'Bull case'], series: [{ name: 'Value', values: [X.SC.bear.tp, Math.round(mv('dcf').value), V.tp, Math.round(mv('ev').value), price, Math.round(avgTp), X.SC.bull.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM target', source: 'GAM Research; street average of the four post-Q1 targets' },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.us, P3.pipeline, P3.india, P3B.others, P3B.igi, P3B.moat, p.financials, p.margins, P4.guidance, p.capital, P4.quality, p.balance, P4.ownership(p.ownershipBase), P4.governance, P4B.forecasts, P5.street, P5.valuation, P5.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
