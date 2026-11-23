// Zydus Lifesciences report, part B: cover, the story in charts, and the merger of part2-6 (business, history, industry,
// tailwind test, US, India and international, consumer and MedTech, pipeline and FDA, moat, margins and earnings quality,
// ownership, governance, forecasts, street, valuation, verdict, glossary, statement notes). Shared inputs in
// ZYDUSLIFE.ctx.js; forecast and valuation figures are live tokens ({{...}}) that follow assumptions.json. As of 30-Sep-2026.
const X = require('./ZYDUSLIFE.ctx');
const { M, F, V, A, SQ, QL, n0, n1, pc, price, mv, HA, FM, MULT, epsSep, epsPost, rating, postQ1, medTp, UE, OB, repDA, ndCo, Q1, SH_POST, sepNow, fwdNow, zwAtMarketPs, zwInPe } = X;
const P2 = require('./ZYDUSLIFE.part2'), P3 = require('./ZYDUSLIFE.part3'), P4 = require('./ZYDUSLIFE.part4'), P5 = require('./ZYDUSLIFE.part5'), P6 = require('./ZYDUSLIFE.part6');

const cover = {
  headline: 'The windfall years are over; the stock still prices them in',
  lead: `Zydus is India's #1 oncology company, the #3 generic supplier in the US by prescriptions and the owner of Sugar Free, Glucon-D and Complan. FY26 was its best year ever: ₹27,148 cr of revenue and a 31.2% EBITDA margin, lifted by two limited-competition US generics (gRevlimid and generic Myrbetriq) and ₹1,198 cr of forex gains. Q1FY27 showed the reset: revenue +22% (acquisitions, India +20%, international +34%) but EBITDA −8%, margin 24.1% and attributable profit −36%. The street values Zydus on **P/E on one-year-forward EPS (23-25x FY28E)**. We forecast EPS of ₹${n1(F.eps[0])} / ₹${n1(F.eps[1])} / ₹${n1(F.eps[2])} for FY27-29E, below the street. Zydus's own forward P/E since Apr-2021 has a median of ${n1(HA.med)}x on EPS before one-offs; times the pharma sector factor (+5.45%) that gives **${MULT.base}x Sep-28E EPS of ₹${n1(epsSep.base)} (per post-buyback share) = {{dcf.tp|inr}} ({{dcf.upside|chg}})**. **We initiate with ${rating}.** Cross-checks are higher (EV/EBITDA ₹${n0(mv('ev').value)} before minorities, DCF ₹${n0(mv('dcf').value)}), and we say why below. Bull case {{scen.bull.tp|inr}}; bear case {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'The US engine is smaller without its windfalls', p: `US sales were US$372 mn in Q1FY26 and US$313-327 mn a quarter since gRevlimid's volume limits ran out (end-Jan-2026). Generic Myrbetriq now carries a licence fee to Astellas until Sep-2027 and faces more competitors. Rolvedon (Assertio, US$15-20 mn a quarter), 505(b)(2) launches and biosimilars help, but management only guides "around single-digit growth". We model US$ sales +{{as.businessLines.naUsdGrowth.0|n1}}% / +{{as.businessLines.naUsdGrowth.1|n1}}% / +{{as.businessLines.naUsdGrowth.2|n1}}% for FY27-29E.` },
    { h: 'India, emerging markets and specialty are real, and growing', p: 'India formulations grew 20% in Q1FY27 against a market growing ~10-11%, with a rising chronic share (54%), first-in-world biosimilars (nivolumab) and in-house NCEs (saroglitazar, desidustat). International markets grew 40% in FY26. US branded sales are 10-11% of US sales and should pass 15% this year. This is the part of Zydus that deserves a premium; it is ~40% of revenue.' },
    { h: 'Acquisitions add revenue, not much EPS (yet)', p: `Zydus spent ₹7,000+ cr on deals in 15 months (Amplitude, Comfort Click, Agenus plants, Assertio) and ₹1,100 cr on a buyback. They lift FY27E revenue by ~6 points but bring amortisation, interest and a 42% minority in Zydus Wellness. D&A plus interest rise from 15% of EBITDA in FY25 to ~${Math.round((repDA[0] + F.interest[0]) / F.ebitda[0] * 100)}% in FY27E. We forecast EPS falling to {{F.eps.0|inr}} in FY27E and growing ~${Math.round(X.epsCagrFwd)}% a year FY26-29E, versus EBITDA margins of {{F.ebitdaMargin.0|pct}} / {{F.ebitdaMargin.1|pct}} / {{F.ebitdaMargin.2|pct}}.` },
    { h: 'Valuation: the market pays more than Zydus\'s own history', p: `At ₹${n0(price)} the stock trades at ${n1(fwdNow)}x our FY28E EPS and ${n1(sepNow)}x Sep-28E, against an ${n1(HA.med)}x median since 2021 (25th-75th percentile ${n1(HA.p25)}-${n1(HA.p75)}x). Part of the low history is the gRevlimid years, when the market refused to pay for windfall EPS; we cannot strip that out because Zydus never disclosed gRevlimid's sales. Even at the street's 23x, our target would be ~₹${n0(Math.round(23 * epsSep.base / 10) * 10)}: close to today's price, not well above it.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'AMBER' },
    { k: 'Earnings momentum', v: 'RED' },
    { k: 'Competitive position', v: 'GREEN' },
    { k: 'Valuation', v: 'RED' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): the first quarter with Assertio (Rolvedon) and its amortisation, Saroglitazar pre-launch spending and US sales after Mirabegron competition.',
    'Saroglitazar (PBC) NDA: priority review, approval expected by Q4FY27; US launch targeted Apr-2027 on Zydus\'s own front end (peak sales guided at US$200-300 mn).',
    'Mirabegron: the licence fee ends in Sep-2027; how many generics enter and when (settlement terms confidential).',
    'India: semaglutide (three brands plus Lupin and Torrent co-marketing), biosimilars (nivolumab, aflibercept), growth vs the IPM (+10.7% in Aug-2026).',
    'US price-fixing litigation: Zydus is a defendant in five bellwether trials scheduled for 2026-2028; FDA inspections at acquired sites (LiqMeds UK, Zylidac California).',
  ],
};

// ---------------------------------------------------------------- Story in charts
const fin = M.fin, fi = l => fin.labels.indexOf(l);
const q6 = SQ.filter(q => q.fxGain != null);
const epsRep = ['FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'].map(l => A.eps[A.labels.indexOf(l)]);
const epsUnd = ['FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'].map(l => UE[l]);
const daInt = ['FY24', 'FY25', 'FY26'].map(l => { const i = A.labels.indexOf(l); return Math.round((A.dep[i] + A.interest[i]) / A.ebitda[i] * 1000) / 10; });
const daIntF = F.years.map((_, i) => Math.round((repDA[i] + F.interest[i]) / F.ebitda[i] * 1000) / 10);
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: 'US sales: US$372 mn in Q1FY26, US$313-327 mn since gRevlimid faded', unit: 'North America formulations (US$ mn a quarter)', x: QL, series: [{ name: 'North America', values: SQ.map(q => q.naUsd), fmt: 'num' }], labels: 'all', source: 'Company presentations and Q1FY27 release' },
      { type: 'stacked', title: 'The mix has shifted: North America 38% of FY22 revenue, 43% of FY26, falling', unit: 'Revenue by business (₹ crore)', x: X.SA.map(a => a.fy), series: [{ name: 'North America', values: X.SA.map(a => a.na), fmt: 'num' }, { name: 'India', values: X.SA.map(a => a.india), fmt: 'num' }, { name: 'International', values: X.SA.map(a => a.im), fmt: 'num' }, { name: 'Consumer', values: X.SA.map(a => a.consumer), fmt: 'num' }, { name: 'MedTech', values: X.SA.map(a => a.medtech || 0), fmt: 'num' }], minLabel: 2000, source: 'Aug-2026 corporate presentation; Q4FY26 presentation' },
    ] },
    { pair: [
      { type: 'line', title: 'Forex gains flattered FY26 margins by up to 8 points a quarter', unit: 'EBITDA margin (%): reported vs excluding operating forex gains', x: q6.map(q => q.q), series: [{ name: 'Reported', values: q6.map(q => q.ebitdaMarginPct), fmt: 'pct' }, { name: 'Excl. forex gains', values: q6.map(q => Math.round((q.ebitda - q.fxGain) / q.revenue * 1000) / 10), fmt: 'pct' }], labels: 'all', min: 15, max: 36, source: 'Company presentations (exchange-rate fluctuation tables); PL and MOSL for Q1FY27' },
      { type: 'column', title: 'EPS before one-offs: ₹23.5 in FY21, ₹54.2 in FY26, ~₹38 in FY27E', unit: 'EPS (₹): reported vs before exceptional items and the FY22 sale gain', x: ['FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], series: [{ name: 'Reported', values: [...epsRep, ...F.eps], fmt: 'n1' }, { name: 'Before one-offs', values: [...epsUnd, ...F.eps], fmt: 'n1' }], labels: 'none', source: 'Screener.in; Aug-2026 corporate presentation (adjusted PAT); GAM estimates' },
    ] },
    { pair: [
      { type: 'column', title: `D&A plus interest: 15% of EBITDA in FY25, ~${Math.round(daIntF[0])}% in FY27E`, unit: 'Depreciation & amortisation (incl. the Mirabegron licence) + finance cost, % of EBITDA', x: ['FY24', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], series: [{ name: 'Share of EBITDA', values: [...daInt, ...daIntF], fmt: 'pct' }], labels: 'all', source: 'Screener.in; GAM estimates' },
      { type: 'column', title: 'Net debt: net cash of ₹4,888 cr in Mar-25 became ₹5,904 cr of debt by Jun-26', unit: 'Net debt, company basis (₹ crore; negative = net cash)', x: ['Mar-25', 'Mar-26', 'Jun-26', 'Mar-27E', 'Mar-28E', 'Mar-29E'], series: [{ name: 'Net debt', values: [-4888, 4305, Math.round(Q1.netDebtCo), ...ndCo.slice(1).map(Math.round)], fmt: 'num' }], labels: 'all', source: 'Company presentations; GAM estimates (engine cash path adjusted for JV stakes and leases)' },
    ] },
    { pair: [
      { type: 'line', title: `Forward P/E: ${Math.round(fwdNow)}x FY28E now vs an ${n1(HA.med)}x median since 2021`, unit: 'Price ÷ next full-year EPS before one-offs (x)', x: X.fwdAdj.map(x => x[0]), series: [{ name: 'Forward P/E', values: X.fwdAdj.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: HA.med, text: `Median: ${n1(HA.med)}x` }], source: 'Screener.in prices; company adjusted EPS; GAM estimates for FY27-28E' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (notes standing on 30-Sep-2026)', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...X.ST.filter(s => s.tp && s.date >= '2026-01').map(s => s.broker), 'GAM (base)'], series: [{ name: 'Target', values: [...X.ST.filter(s => s.tp && s.date >= '2026-01').map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: `Broker notes Jan to Sep-2026 (post-Q1FY27 median ₹${n0(medTp)}), GAM Research` },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.us, P3.india, P3.consumer, P3.pipeline, P3.moat, p.financials, P4.margins, p.capital, P4.quality, p.balance, P4.ownership(p.ownershipBase), P4.governance, P4.forecasts, P5.street, P5.valuation, P6.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
