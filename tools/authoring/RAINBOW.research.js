// Rainbow Children's Medicare report, part B: cover, story in charts, and the merger of part2-6 (business, history,
// industry, tailwind test, hospitals & KPIs, mature vs new, expansion, moat, Q1FY27, earnings quality, ownership,
// governance, forecasts, street, valuation, verdict, glossary, statement notes). Shared inputs in RAINBOW.ctx.js.
// Forecast and valuation figures are live tokens ({{...}}) that follow assumptions.json. As of 30-Sep-2026.
const X = require('./RAINBOW.ctx');
const { F, V, A, n0, n1, SA, SQ, QL, Q1, FY26, AK, b, price, mv, evMult, ebitdaSep28, HEV, fwdEv, evNow, rating, ST, preMargin, sectorDrEv, epsCagrFwd, pl, isec, avgPost } = X;
const P2 = require('./RAINBOW.part2'), P3 = require('./RAINBOW.part3'), P4 = require('./RAINBOW.part4'), P5 = require('./RAINBOW.part5'), P6 = require('./RAINBOW.part6');

const cover = {
  headline: 'India\'s children\'s-hospital leader, priced below its own history: the bet is that 1,200 new beds fill as well as the last 780',
  lead: `Rainbow runs India's largest paediatric hospital chain (24 hospitals, 2,435 beds excluding the 130 Delhi beds it only staffs), with full-time doctors, a third of its beds in intensive care and a BirthRight maternity brand feeding the children's business. It earns a 32% EBITDA margin after Ind AS 116 (26% after rent) with no bank debt. The catch is occupancy: ~780 beds added in two years pushed it from 55% (FY23) to 41% (Q1FY27), and management now plans ~2,500 more beds (to ~5,000) for ~₹2,200 cr over five years, mostly outside the South. Q1FY27 revenue rose 33% (24% organic). The street values Rainbow on **EV/EBITDA on FY28E (22-28x)**. We forecast EBITDA of ₹${n0(F.ebitda[0])} / ${n0(F.ebitda[1])} / ${n0(F.ebitda[2])} cr and EPS of ₹${n1(F.eps[0])} / ${n1(F.eps[1])} / ${n1(F.eps[2])} for FY27-29E, below the street on margins. Applying **${evMult}x to Sep-28E EBITDA of ₹${n0(ebitdaSep28)} cr** (post-Ind AS, lease liabilities in net debt) gives **{{dcf.tp|inr}} ({{dcf.upside|chg}})**: **we initiate with ${rating}.** Cross-checks: P/E ₹${n0(mv('pe').value)}, DCF ₹${n0(mv('dcf').value)}. Bull case {{scen.bull.tp|inr}}; bear case {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'A specialty that is hard to copy', p: `Children's hospitals need dozens of sub-specialists on call 24/7; Rainbow has 1,075+ full-time doctors, transplant, cardiac and ECMO programmes, and hub-and-spoke density in Hyderabad (~1,000 beds) and Bengaluru (~600). Mature hospitals earned ₹${n0(Q1.mature.arpob)} per occupied bed-day in Q1FY27 (+10%); mothers who deliver at BirthRight stay for paediatric care.` },
    { h: 'Growth is back, but it is bought with beds', p: `Capacity +26% in a year to 2,435 beds; IP discharges +28%, deliveries +23% in Q1FY27. Occupancy only rose to ${Q1.occupancyPct}% (Q1FY26 ${Q1.occupancyPriorPct}%), far below management's 56-58% target. We model revenue +{{F.salesGrowth.0|pct}}, +{{F.salesGrowth.1|pct}}, +{{F.salesGrowth.2|pct}} (FY27-29E), from a bed-by-bed build.` },
    { h: 'Margins fall before they rise', p: `Pre-Ind AS EBITDA margin: 26.6% (FY25), 26.3% (FY26), 23.0% (Q1FY27); guidance is 24-25% for FY27. New hospitals lose money for 12-18 months, and Malad, Coimbatore, Gurugram and Pune all open in FY28-29. We model ${n1(preMargin[0])}% / ${n1(preMargin[1])}% / ${n1(preMargin[2])}% pre-Ind AS ({{F.ebitdaMargin.0|pct}} / {{F.ebitdaMargin.1|pct}} / {{F.ebitdaMargin.2|pct}} post): FY28E EPS ${Math.round((1 - F.eps[1] / pl.eps.FY28E) * 100)}% below Prabhudas Lilladher.` },
    { h: 'Valuation: cheap to history, fair on cash flows', p: `At ₹${n0(price)} the stock trades at ${n1(evNow)}x our FY28E EV/EBITDA, against a ${n1(HEV.med)}x forward median since listing; hospital peers had de-rated ~${Math.round(-sectorDrEv)}% by 30-Sep-2026, giving ${evMult}x and {{dcf.tp|inr}}. Our DCF (₹${n0(mv('dcf').value)}) is lower: the expansion has to earn its cost of capital for the multiple to hold.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'GREEN' },
    { k: 'Predictability', v: 'AMBER' },
    { k: 'Earnings momentum', v: 'AMBER' },
    { k: 'Competitive position', v: 'GREEN' },
    { k: 'Valuation', v: 'AMBER' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): growth "above 20%" was guided; the first read on the season after a late, deficient monsoon; occupancy and the pre-Ind AS margin (guided 24-25% for FY27).',
    'Ramp-up of the new Bengaluru hospitals (Electronic City breakeven guided within 2-3 months of Jul-2026; HRBR 12-15 months).',
    'Openings: Guntur (50 beds, "in a couple of months" from end-July), Indore (Q3FY27), Malad, Mumbai (Q1FY28), Coimbatore and Gurugram Sector 56 (H2FY28), Gurugram Sector 44 hub (Q1FY29), Pune and Seegehalli (FY29).',
    'The detailed five-year plan management promised, and the terms of the Nellore acquisition and the Malad JV.',
    'Any move into government-scheme patients (higher occupancy, lower prices).',
  ],
};

// ---------------------------------------------------------------- Story in charts
const K = AK, MD = X.C.q1fy27;
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: 'Beds: +62% since FY22, +26% in the last twelve months', unit: 'Capacity beds (excl. Madhukar, Delhi), year end; Q1FY27 = Jun-26', x: [...K.map(k => k.fy), 'Q1FY27'], series: [{ name: 'Capacity beds', values: [...K.map(k => k.capacityBeds), Q1.capacityBeds], fmt: 'num' }], labels: 'all', highlight: 'Q1FY27', source: 'Company presentations' },
      { type: 'line', title: 'Occupancy: 55% in FY23, 46% in FY26, 41% in Q1FY27', unit: 'Occupancy (% of weighted operational beds)', x: [...K.map(k => k.fy), 'Q1FY26', 'Q1FY27'], series: [{ name: 'Occupancy', values: [...K.map(k => k.occupancyPct), Q1.occupancyPriorPct, Q1.occupancyPct], fmt: 'pct' }], labels: 'all', min: 30, max: 60, source: 'Company presentations; Q1 is the seasonal low' },
    ] },
    { pair: [
      { type: 'column', title: 'ARPOB: +23% in three years, mostly case mix', unit: 'Revenue per occupied bed-day (₹)', x: K.map(k => k.fy), series: [{ name: 'ARPOB', values: K.map(k => k.arpob), fmt: 'num' }], labels: 'all', source: 'Company presentations (FY22 includes Covid-vaccine revenue)' },
      { type: 'hbar', title: 'New hospitals: lower occupancy and ARPOB than mature ones', unit: 'Q1FY27; occupancy (%) and ARPOB (₹ \'000 per bed-day)', x: ['Mature: occupancy %', 'New: occupancy %', 'Mature: ARPOB ₹\'000', 'New: ARPOB ₹\'000'], series: [{ name: 'Q1FY27', values: [MD.mature.occupancyPct, MD.newUnits.occupancyPct, Math.round(MD.mature.arpob / 100) / 10, Math.round(MD.newUnits.arpob / 100) / 10], fmt: 'n1' }], labels: 'all', source: 'Q1FY27 presentation (mature = 1,202 operational beds; new = 660)' },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: down before it is up', unit: 'EBITDA margin (%): post-Ind AS (rent excluded) and pre-Ind AS (after rent)', x: ['FY24', 'FY25', 'FY26', ...F.years], series: [{ name: 'Post-Ind AS', values: [A.ebitdaMargin[b - 2], A.ebitdaMargin[b - 1], A.ebitdaMargin[b], ...F.ebitdaMargin], fmt: 'pct' }, { name: 'Pre-Ind AS', values: [null, 26.6, 26.3, ...preMargin.map(v => Math.round(v * 10) / 10)], fmt: 'pct' }], labels: 'all', min: 15, max: 40, source: 'Screener.in; company (pre-Ind AS FY25-26); GAM estimates FY27-29E' },
      { type: 'column', title: 'Quarterly revenue growth: 7% in Q2FY26, 33% in Q1FY27', unit: 'Revenue growth, year on year (%)', x: QL.slice(4), series: [{ name: 'Growth', values: SQ.slice(4).map((q, i) => Math.round((q.consRev / SQ[i].consRev - 1) * 1000) / 10), fmt: 'pct' }], labels: 'all', source: 'Screener.in' },
    ] },
    { pair: [
      { type: 'line', title: `Forward EV/EBITDA: median ${n1(HEV.med)}x since listing, ${n1(evNow)}x now`, unit: 'EV (incl. lease liabilities) ÷ next full-year EBITDA, post-Ind AS (x)', x: fwdEv.map(x => x[0]), series: [{ name: 'Forward EV/EBITDA', values: fwdEv.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: HEV.med, text: `Median since listing: ${n1(HEV.med)}x` }, { v: evMult, text: `Our target: ${evMult}x`, color: '#cf8f1f' }], source: 'Screener.in prices and balance sheets; AR FY24/FY26 (bank deposits); GAM estimates FY27-29E' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (notes standing on 30-Sep-26)', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...ST.map(s => `${s.broker} (${X.shortDate(s.date)})`), 'GAM (base)'], series: [{ name: 'Target', values: [...ST.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes and aggregators (Nov-2025 to Aug-2026), GAM Research' },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.hospitals, P3.matureNew, P3.expansion, P3.moat, p.financials, p.seasons, P4.guidance, p.capital, P4.quality, p.balance, P4.ownership(p.ownershipBase), P4.governance, P4.forecasts, P5.street, P5.valuation, P5.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
