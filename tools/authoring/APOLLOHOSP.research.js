// Apollo Hospitals report, part B: cover, story in charts, and the merger of part2-6 (business, history, industry,
// tailwind test, hospitals & KPIs, expansion, HealthCo/NewCo, AHLL, moat, Q1FY27, earnings quality, ownership,
// governance, forecasts, street, valuation, verdict, glossary, statement notes). Shared inputs in APOLLOHOSP.ctx.js.
// Forecast and valuation figures are live tokens ({{...}}) that follow assumptions.json. As of 30-Sep-2026.
const X = require('./APOLLOHOSP.ctx');
const { F, V, A, n0, n1, SA, SQ, Q1, AK, b, price, mv, part, hospMult, hospSep28, impliedHospMult, HEV, evAll, evNow, rating, ST, sectorDrEv, pl, isec, avgPost, SEG, YRS } = X;
const P2 = require('./APOLLOHOSP.part2'), P3 = require('./APOLLOHOSP.part3'), P4 = require('./APOLLOHOSP.part4'), P5 = require('./APOLLOHOSP.part5'), P6 = require('./APOLLOHOSP.part6');
const minPs = X.minPs;

const cover = {
  headline: 'India\'s best hospital franchise at a fair price: the hospitals justify today\'s value, but there is little left over for the pharmacy spin-off',
  lead: `Apollo runs India's largest private hospital network (48 owned and 6 managed hospitals, ~10,000 census beds), supplies ~7,440 Apollo pharmacies through Apollo HealthCo, and owns clinics and diagnostics (AHLL). Hospitals are the engine: occupancy rose to 70% in Q1FY27, revenue per in-patient grew 8%, and established hospitals earn a 25.9% EBITDA margin. The pharmacy and digital arm is being spun off: after a scheme approved by shareholders in Jun-2026, Apollo's shareholders will own **59.6%** of a listed NewCo that also absorbs Keimed, a promoter-linked wholesaler. The street values Apollo on a **sum of the parts (SOTP)**, hospitals at 26-30x EV/EBITDA. We forecast EBITDA of ₹${n0(F.ebitda[0])} / ${n0(F.ebitda[1])} / ${n0(F.ebitda[2])} cr and EPS of ₹${n1(F.eps[0])} / ${n1(F.eps[1])} / ${n1(F.eps[2])} for FY27-29E, below the street. Valuing hospitals at **${hospMult}x Sep-28E EBITDA**, NewCo at 18x (Apollo's 59.6%), AHLL at 18x, and deducting minorities the street ignores gives **{{dcf.tp|inr}} ({{dcf.upside|chg}})**: **we initiate with ${rating}.** Cross-checks: P/E ₹${n0(mv('pe').value)}, DCF ₹${n0(mv('dcf').value)}. Bull case {{scen.bull.tp|inr}}; bear case {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'The best hospital franchise in India, getting better', p: `Q1FY27: in-patient volumes +13%, occupancy ${Q1.occupancyPct}% (${Q1.occupancyPriorPct}% a year earlier), revenue per in-patient ₹${n0(Q1.arpp)} (+8%), hospital ROCE 28.5%. Cardiac, oncology, transplant, neuro, gastro and ortho are 62% of in-patient revenue; self-pay and insurance ~85% of in-patient revenue. We model group revenue +{{F.salesGrowth.0|pct}} in FY27, with hospitals +19.5% from a bed-by-bed build.` },
    { h: 'A bigger bed plan, and harder markets', p: `Census beds go from 9,857 to ~14,100 by FY31 (+4,330) for ~₹11,150 cr, with ~₹7,500 cr still to spend; most new beds are in the North and West (Gurgaon from Oct-2026, then Worli, Dwarka, Varanasi, Ranchi), where Apollo's record is weaker (West occupancy 58%). New hospitals lose ~₹150 cr in FY27; we hold the hospital margin at ${n1(SEG.hcs.adjEbitda[0] / SEG.hcs.revenue[0] * 100)}-${n1(SEG.hcs.adjEbitda[2] / SEG.hcs.revenue[2] * 100)}% (FY27-29E).` },
    { h: 'Pharmacy: losses gone, value shared', p: `Apollo 24/7 ran up ~₹2,100 cr of operating costs over FY23-26; its cash loss was down to ₹10 cr in Q1FY27. NewCo (pharmacy distribution, 24/7, Keimed) targets ₹25,000 cr of annualised revenue at a 6.5-7% EBITDA margin by Q4FY27 and listing by Q4FY27. But it is a distribution business, and Advent (12.1%) and Keimed's owners (25.3%) share it; we value Apollo's 59.6% at ~₹${n0((part(/^Apollo HealthCo/).value + part(/^Keimed/).value) / X.sh)} a share.` },
    { h: 'Valuation: fair, not cheap', p: `At ₹${n0(price)} the market pays ~${n1(impliedHospMult)}x our Sep-28E hospital EBITDA once the other parts are valued, against our derived ${hospMult}x (Apollo's ${n1(HEV.med)}x forward median since 2021, less the ~${Math.round(-sectorDrEv)}% hospital-sector de-rating). The street's higher targets (avg ~₹${n0(avgPost)} after Q1) use 26-30x and deduct nothing for minorities (~₹${n0(minPs)} a share). The Parliamentary panel's pricing ideas are the main threat to the multiple.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'GREEN' },
    { k: 'Earnings momentum', v: 'GREEN' },
    { k: 'Competitive position', v: 'GREEN' },
    { k: 'Valuation', v: 'AMBER' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): digital cash breakeven (guided for Q2), hospital margin with Gurgaon pre-opening costs, the seasonal quarter\'s occupancy.',
    'Gurgaon (380 census beds): soft launch in Sep-2026 and opening in Oct-2026 guided; revenue from Q4FY27.',
    'NCLT sanction of the HealthCo-Keimed scheme and the NewCo listing (estimated by Q4FY27 "post all approvals").',
    'Completion of the Cloudnine deal (CCI approved on 1-Sep-2026; ~₹750 cr of cash and a 9.9% stake).',
    'Any government move on the Parliamentary committee\'s hospital-pricing recommendations (room-rent benchmarks, package rates).',
  ],
};

// ---------------------------------------------------------------- Story in charts
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: 'Operating beds barely grew in FY22-26; the jump starts now', unit: 'Operating beds, network incl. Delhi (year end; Q1FY27 = Jun-26)', x: [...AK.map(k => k.fy), 'Q1FY27'], series: [{ name: 'Operating beds', values: [...AK.map(k => k.beds), Q1.beds], fmt: 'num' }], labels: 'all', highlight: 'Q1FY27', min: 7000, source: 'AR FY26 KPIs; Q1FY27 presentation' },
      { type: 'line', title: 'Occupancy: 63% in FY22, 70% in Q1FY27', unit: 'Bed occupancy (%)', x: [...AK.map(k => k.fy), 'Q1FY26', 'Q1FY27'], series: [{ name: 'Occupancy', values: [...AK.map(k => k.occupancyPct), Q1.occupancyPriorPct, Q1.occupancyPct], fmt: 'pct' }], labels: 'all', min: 55, max: 75, source: 'AR FY26 KPIs; Q1FY27 presentation' },
    ] },
    { pair: [
      { type: 'column', title: 'Revenue per in-patient: +26% in three years', unit: 'Average revenue per in-patient (₹)', x: [...AK.map(k => k.fy), 'Q1FY27'], series: [{ name: 'ARPP', values: [...AK.map(k => k.arpp), Q1.arpp], fmt: 'num' }], labels: 'all', highlight: 'Q1FY27', source: 'AR FY26 KPIs; Q1FY27 presentation' },
      { type: 'line', title: 'Patients stay almost a day less than in FY22', unit: 'Average length of stay (days)', x: [...AK.map(k => k.fy), 'Q1FY27'], series: [{ name: 'ALOS', values: [...AK.map(k => k.alos), Q1.alos], fmt: 'n1' }], labels: 'all', min: 2.5, max: 4.2, source: 'AR FY26 KPIs; Q1FY27 presentation' },
    ] },
    { pair: [
      { type: 'stacked', title: 'Revenue: hospitals and pharmacy grow side by side', unit: 'Revenue by business (₹ crore)', x: ['FY23', 'FY24', 'FY25', 'FY26', ...YRS], series: [{ name: 'Hospitals', values: [...SA.slice(1).map(a => a.hcsRev), ...SEG.hcs.revenue.map(Math.round)], fmt: 'num' }, { name: 'HealthCo', values: [...SA.slice(1).map(a => a.hcoRev), ...SEG.hco.revenue.map(Math.round)], fmt: 'num' }, { name: 'AHLL', values: [...SA.slice(1).map(a => a.ahllRev), ...SEG.ahll.revenue.map(Math.round)], fmt: 'num' }], minLabel: 1500, source: 'Company presentations; GAM estimates FY27-29E' },
      { type: 'stacked', title: 'EBITDA: hospitals are ~76% of it even in FY29E', unit: 'EBITDA by business, post-Ind AS (₹ crore)', x: ['FY23', 'FY24', 'FY25', 'FY26', ...YRS], series: [{ name: 'Hospitals', values: [...SA.slice(1).map(a => a.hcsEbitda), ...SEG.hcs.adjEbitda.map(Math.round)], fmt: 'num' }, { name: 'HealthCo (after 24/7 costs)', values: [...SA.slice(1).map(a => a.hcoEbitda), ...SEG.hco.adjEbitda.map(Math.round)], fmt: 'num' }, { name: 'AHLL', values: [...SA.slice(1).map(a => a.ahllEbitda), ...SEG.ahll.adjEbitda.map(Math.round)], fmt: 'num' }], minLabel: 400, source: 'Company presentations; GAM estimates FY27-29E' },
    ] },
    { pair: [
      { type: 'line', title: `Forward EV/EBITDA: median ${n1(HEV.med)}x since 2021, ${n1(evNow)}x now`, unit: 'EV (incl. leases and CCPS) ÷ next full-year EBITDA, post-Ind AS (x)', x: evAll.map(x => x[0]), series: [{ name: 'Forward EV/EBITDA', values: evAll.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: HEV.med, text: `Median: ${n1(HEV.med)}x` }, { v: hospMult, text: `Hospitals target: ${hospMult}x`, color: '#cf8f1f' }], source: 'Screener.in prices and balance sheets; GAM estimates FY27-29E' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (notes standing on 30-Sep-26)', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...ST.map(s => `${s.broker} (${X.shortDate(s.date)})`), 'GAM (base)'], series: [{ name: 'Target', values: [...ST.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes and aggregators (Mar-2026 to Aug-2026), GAM Research' },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.hospitals, P3.expansion, P3.healthco, P3.ahll, P3.moat, p.financials, P4.guidance, p.capital, P4.quality, p.balance, P4.ownership(p.ownershipBase), P4.governance, P4.forecasts, P5.street, P5.valuation, P5.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
