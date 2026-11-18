// KIMS report, part B: cover, story in charts, and the merger of part2-6 (business, history, industry, tailwind test,
// clusters & KPIs, new vs mature hospitals, expansion, moat, Q1FY27, earnings quality, ownership, governance, forecasts,
// street, valuation, verdict, glossary, statement notes). Shared inputs in KIMS.ctx.js. Forecast and valuation figures
// are live tokens ({{...}}) in body text; titles and sources are built here. As of 30-Sep-2026.
const X = require('./KIMS.ctx');
const { F, V, A, M, n0, n1, b, price, mv, evMult, ebitdaSep28, HEV, fwdEv, evNow, rating, ST, preMargin, sectorDrEv, pl, axis, avgPost, Q1, SU, ND, ndPf, SQ, QL, AK } = X;
const P2 = require('./KIMS.part2'), P3 = require('./KIMS.part3'), P4 = require('./KIMS.part4'), P5 = require('./KIMS.part5'), P6 = require('./KIMS.part6');
const tpTxt = `₹${n0(V.tp)}`;

const cover = {
  headline: 'Telangana\'s leading hospital chain, mid-way through a five-state build-out: the market already pays for the new beds to fill',
  lead: `KIMS runs 26 multi-specialty hospitals (7,459 beds, 5,639 operational) at tier-2 prices: its mature hospitals in Telangana and Andhra Pradesh earn 25-30% EBITDA margins at an ARPOB of ₹47,200, a fraction of metro chains'. Since FY24 it has added ~3,500 beds in four new states, which cut the FY26 margin to 21% (new units lost ₹128 cr), pushed net debt to 5.4x EBITDA and forced a ₹1,500 cr QIP and ₹600 cr of promoter warrants in Jun-Aug 2026. Q1FY27 revenue rose 35%, EBITDA 16%; profit fell 47%. The street values KIMS on **EV/EBITDA on FY28E (27-30x)**. We forecast EBITDA of ₹${n0(F.ebitda[0])} / ${n0(F.ebitda[1])} / ${n0(F.ebitda[2])} cr and EPS of ₹${n1(F.eps[0])} / ${n1(F.eps[1])} / ${n1(F.eps[2])} for FY27-29E (42.77 cr fully diluted shares). Applying **${evMult}x to Sep-28E EBITDA of ₹${n0(ebitdaSep28)} cr** (post-Ind AS; leases and minorities in net debt) gives **{{dcf.tp|inr}} ({{dcf.upside|chg}})**: **we initiate with ${rating}.** Cross-checks: P/E ₹${n0(mv('pe').value)}, DCF ₹${n0(mv('dcf').value)}. Bull case {{scen.bull.tp|inr}}; bear case {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'A low-cost regional leader', p: `Telangana (half of revenue, ~77% of EBITDA in Q1FY27) earns ~30% margins and Andhra Pradesh 21-25% at an ARPOB of only ~₹25,000. Doctor-partners own equity in ten hospital companies, which helps recruitment but leaks profit to minorities (₹30 cr in FY25).` },
    { h: 'The new hospitals are turning, one by one', p: `Nashik broke even and Mahadevapura turned positive in Q1FY27; Bengaluru's loss halved to ₹19 cr; Electronic City (−₹18 cr) and Thane (−₹7 cr) are next. We assume new-unit losses fall from ₹128 cr to ₹${SU.FY27E} cr in FY27E and model revenue +{{F.salesGrowth.0|pct}} / +{{F.salesGrowth.1|pct}} / +{{F.salesGrowth.2|pct}} from a five-cluster build.` },
    { h: 'Repaired with equity, not cash flow', p: `Net debt including leases and minorities was ₹${n0(ND[2026])} cr at Mar-26 (5.4x EBITDA); the QIP and warrants (7% dilution) cut it to ~₹${n0(ndPf)} cr pro forma. Promoters pledged another 6.67% of the company on 18-Sep-2026, and management plans new greenfields from FY28. Our margin ({{F.ebitdaMargin.1|pct}} in FY28E) is below PL and Axis.` },
    { h: 'Valuation: the recovery is in the price', p: `At ₹${n0(price)} KIMS trades at ${n1(evNow)}x our FY28E EV/EBITDA, above its ${n1(HEV.med)}x forward median since listing, while hospital peers sit ~${Math.round(-sectorDrEv)}% below their own medians. ${evMult}x on Sep-28E gives ${tpTxt}; the street's 27-30x would be ₹${n0(X.streetAt(27))}-${n0(X.streetAt(30))}. P/E and DCF are lower still.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹; FY26 pro forma)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'AMBER' },
    { k: 'Earnings momentum', v: 'AMBER' },
    { k: 'Competitive position', v: 'AMBER' },
    { k: 'Valuation', v: 'RED' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): the first quarter with lower interest after the QIP repayments, Thane and Electronic City breakeven, Kondapur\'s ramp and Bengaluru\'s path to an EBITDA-neutral year.',
    'Thrissur O&M hospital (351 beds) due within 3-4 months of Aug-2026; Secunderabad replacement block by end-CY27; Rajahmundry II under construction.',
    'Call options on O&M hospitals exercisable from Jan-2027, and the new greenfield or acquisition projects management expects to announce in FY28.',
    'Conversion of the promoter warrants (₹450 cr due within 18 months of Aug-2026) and any further change in promoter pledges.',
    'Insurer empanelment of Thane, Nashik and the Bengaluru hospitals (key panels expected by mid-September 2026).',
  ],
};

// ---------------------------------------------------------------- Story in charts
const QS = M.quarterly, qi = QS.labels.length - 5;
const ndVals = [ND[2023], ND[2024], ND[2025], ND[2026], Math.round(ndPf), ...F.treasury.map(t => -Math.round(t))];
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: 'Bed capacity: 3,975 → 7,459 in two and a quarter years', unit: 'Bed capacity, period end (excl. fee-based O&M hospitals)', x: [...AK.map(k => k.fy), 'Q1FY27'], series: [{ name: 'Capacity', values: [...AK.map(k => k.capacityBeds), Q1.capacityBeds], fmt: 'num' }], labels: 'all', highlight: 'Q1FY27', source: 'Company presentations' },
      { type: 'line', title: 'Occupancy stuck near 50% as beds keep coming', unit: 'Group occupancy (% of operational beds), quarterly', x: QL, series: [{ name: 'Occupancy', values: SQ.map(q => q.occupancyPct), fmt: 'pct' }], labels: 'all', min: 40, max: 65, source: 'Company presentations (operational beds redefined in FY25)' },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: down to 21% in FY26, back to ~23% by FY29E on our numbers', unit: 'EBITDA margin (%): post-Ind AS before other income; pre-Ind AS (after rent) for forecasts', x: ['FY22', 'FY23', 'FY24', 'FY25', 'FY26', ...F.years], series: [{ name: 'Post-Ind AS', values: [...A.ebitdaMargin.slice(b - 4), ...F.ebitdaMargin], fmt: 'pct' }, { name: 'Pre-Ind AS', values: [null, null, null, null, Math.round((A.ebitda[b] - 43.6) / A.sales[b] * 1000) / 10, ...preMargin.map(v => Math.round(v * 10) / 10)], fmt: 'pct' }], labels: 'all', min: 10, max: 35, source: 'Screener.in; company (rent); GAM estimates FY27-29E' },
      { type: 'column', title: 'New-hospital losses: ₹128 cr in FY26, halving in FY27E', unit: 'EBITDA lost in new units (₹ crore); FY27-29E GAM', x: ['FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], series: [{ name: 'Start-up losses', values: [SU.FY25, SU.FY26, SU.FY27E, SU.FY28E, SU.FY29E], fmt: 'num' }], labels: 'all', highlight: 'FY26', source: 'Company calls; GAM estimates' },
    ] },
    { pair: [
      { type: 'column', title: 'Revenue up 24-35% a quarter; EBITDA growth only now picking up', unit: 'Year-on-year growth (%), Screener basis', x: QS.labels.slice(qi), series: [{ name: 'Revenue', values: QS.salesYoY.slice(qi).length && QS.salesYoY.slice(qi).every(v => v != null) ? QS.salesYoY.slice(qi) : QS.sales.slice(qi).map((v, i) => Math.round((v / QS.sales[qi + i - 4] - 1) * 1000) / 10), fmt: 'pct' }, { name: 'EBITDA', values: QS.ebitda.slice(qi).map((v, i) => Math.round((v / QS.ebitda[qi + i - 4] - 1) * 1000) / 10), fmt: 'pct' }], labels: 'all', source: 'Screener.in quarterly results' },
      { type: 'column', title: 'Net debt: 5.4x EBITDA at Mar-26, ~2.8x after the QIP and warrants', unit: 'Net debt incl. leases and minorities (₹ crore); FY26 PF = pro forma; FY27-29E GAM', x: ['FY23', 'FY24', 'FY25', 'FY26', 'FY26 PF', ...F.years], series: [{ name: 'Net debt', values: ndVals, fmt: 'num' }], labels: 'all', highlight: 'FY26', source: 'Screener.in; company; GAM estimates' },
    ] },
    { pair: [
      { type: 'line', title: `Forward EV/EBITDA: median ${n1(HEV.med)}x since listing, ${n1(evNow)}x now`, unit: 'EV (incl. leases and minorities) ÷ next full-year EBITDA (x)', x: fwdEv.map(x => x[0]), series: [{ name: 'Forward EV/EBITDA', values: fwdEv.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: HEV.med, text: `Median since listing: ${n1(HEV.med)}x` }, { v: evMult, text: `Our target: ${evMult}x`, color: '#cf8f1f' }], source: 'Screener.in prices and balance sheets; company; GAM estimates FY27-29E' },
      { type: 'hbar', title: `Our ${tpTxt} vs the street (notes standing on 30-Sep-26)`, unit: `₹ per share; CMP ₹${n0(price)}`, x: [...ST.map(s => `${s.broker} (${X.shortDate(s.date)})`), 'GAM (base)'], series: [{ name: 'Target', values: [...ST.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes and aggregators (Nov-2025 to Aug-2026), GAM Research' },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.hospitals, P3.matureNew, P3.expansion, P3.moat, p.financials, P4.guidance, p.capital, P4.quality, p.balance, P4.ownership(p.ownershipBase), P4.governance, P4.forecasts, P5.street, P5.valuation, P5.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
