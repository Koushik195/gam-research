// Endurance Technologies report, part B: cover, the story in charts, and the merger of part2-6 (business, history,
// industry, tailwind test, India, Europe, new businesses, customers, moat, Q1FY27, earnings quality, ownership, governance,
// forecasts, street, valuation, verdict, glossary, statement notes). Shared inputs in ENDURANCE.ctx.js; forecast and
// valuation figures are live tokens ({{...}}) that follow assumptions.json. As of 30-Sep-2026.
const X = require('./ENDURANCE.ctx');
const { F, V, SQ, QL, C, n0, n1, price, mv, FM, sectorDr, MULT, epsSep, rating, postQ1, medTp, medEps, A26 } = X;
const P2 = require('./ENDURANCE.part2'), P3 = require('./ENDURANCE.part3'), P4 = require('./ENDURANCE.part4'), P5 = require('./ENDURANCE.part5'), P6 = require('./ENDURANCE.part6');
const sd = d => { const [y, m, dd] = d.split('-'); return `${+dd}-${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+m - 1]}`; };

const cover = {
  headline: 'Bajaj\'s favourite supplier at a fair price: the growth is real, the margins are the catch',
  lead: `Endurance makes aluminium castings, suspension, brakes and transmission parts for Indian two-wheelers (Bajaj Auto alone is 35% of income) and machined castings for European carmakers (27%). Revenue grew 17% a year over FY21-26 and 30% in Q1FY27, but net profit only 8% as metal costs ran ahead of price resets and Europe wrote off old engine-programme assets. We forecast EPS of ₹${n1(F.eps[0])} / ₹${n1(F.eps[1])} / ₹${n1(F.eps[2])} for FY27-29E, below the street. The street values Endurance on **P/E on one-year-forward EPS** (MOSL 32x and Choice 30x FY28E). The house rule (its own forward P/E median since 2021, ${n1(FM.median)}x, cut by the ${Math.abs(sectorDr).toFixed(1)}% auto-component de-rating) gives **${MULT.base}x Sep-28E EPS of ₹${n1(epsSep.base)} = {{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}.** Cross-checks: EV/EBITDA ₹${n0(mv('ev').value)}, DCF ₹${n0(mv('dcf').value)}. Bull case {{scen.bull.tp|inr}}; bear case {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'India keeps outgrowing two-wheeler volumes', p: `India standalone income rose 20% in FY26 and 36% in Q1FY27 (~24% without metal pass-through) against 2W sales growth of 13% and 24%. Sales to Bajaj grew 16% in FY26 vs Bajaj's own 12%; to Honda 17% vs 8%. The drivers are content: brakes (+30% a year for four years; ABS capacity doubling), inverted front forks, alloy wheels (Bidkin plant), and new lines (battery packs from Jun-2026, 4W castings for a US EV maker and JLR). Orders won since FY23: ₹5,270 cr a year at peak, excluding Bajaj. We model India +{{as.segments.0.growth.0|pct0}} / +{{as.segments.0.growth.1|pct0}} / +{{as.segments.0.growth.2|pct0}}.` },
    { h: 'But India\'s margin is hostage to metal prices and to Bajaj', p: `Aluminium is ~60% of purchases and is passed on a quarter late, at cost: in Q1FY27 raw materials rose to 68.4% of standalone income and the India EBITDA margin fell to 11.2% (12.6% in FY26, 13.7% in FY25). Management says Q2 and Q3 will be "better than Q1", without a number. Bajaj Auto takes 35% of group income (38% in FY25): the relationship is deep, but the customer sets the price. We assume {{as.segments.0.marginPct.0|pct}} / {{as.segments.0.marginPct.1|pct}} / {{as.segments.0.marginPct.2|pct}}.` },
    { h: 'Europe: high margins, little organic growth', p: `Endurance Overseas (Italy, Germany) earns an ~18% EBITDA margin, but its euro revenue grew 2% in FY26 without the Stöferle purchase and 1% in Q1FY27, while European car production fell 5% and Chinese brands took the growth. A Mercedes hybrid part (100% share from Jan-2027) helps; combustion-engine programmes (~30% of sales) run off. We assume euro revenue +2% / +5% / +4% and an 18.0-18.3% margin; management talks openly about more European acquisitions.` },
    { h: 'Valuation: fair; the gap to the street is earnings', p: `At ₹${n0(price)} the stock trades at ${n1(price / F.eps[1])}x our FY28E and ${n1(X.sepNow)}x Sep-28E EPS, just below its own ${n1(FM.median)}x forward median since 2021; auto-component stocks sat ${Math.abs(sectorDr).toFixed(1)}% below their five-year medians on 30-Sep-2026. The street's 30-32x is similar to ours; its targets (₹3,350-3,380) are higher because its FY28E EPS (₹${n1(medEps('FY28E'))} median) is ${Math.round((medEps('FY28E') / F.eps[1] - 1) * 100)}% above ours: it assumes margins recover to ~14% and European depreciation normalises fast. We would rather see the margin first.` },
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
    'Q2FY27 results (due by mid-November 2026): whether India margins recover as Q1-average metal rates and gas, fuel and wage claims are settled with customers, as management promised.',
    'ABS: the government\'s final rule on ABS for smaller motorcycles (draft Jun-2025); new ABS/CBS capacity starting Sep/Oct-2026; dual-channel ABS for Bajaj (Q2FY27) and a second programme (Q3FY27).',
    'Ramp-ups: Shendra 4W machined castings (SOP Sep-2026; ₹513 cr a year at peak by early FY29), Bidkin alloy wheels at full capacity by Q4FY27, battery-pack line full by Oct-2026, Chennai brakes plant.',
    'Europe: the Mercedes hybrid programme from Jan-2027; a casting-capacity deal for Stöferle by Jan-2027; any acquisition ("more clarity in the next investor call").',
    'Festive-season two-wheeler volumes (Oct-Dec 2026) against a GST-boosted base, and Bajaj Auto\'s market share.',
  ],
};

// ---------------------------------------------------------------- Story in charts
const yoyQ = X.M.quarterly.sales.map((s, i, a) => (i >= 4 ? Math.round((s / a[i - 4] - 1) * 1000) / 10 : null)).slice(-8);
const ENT = [['india', 'India (standalone)'], ['maxwell', 'Maxwell'], ['europe', 'Europe']];
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: `Revenue: ₹14,596 cr in FY26; ₹${n0(F.sales[2])} cr by FY29E`, unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY19', to: 'FY29E', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'all', source: 'Screener.in; GAM estimates FY27-29E' },
      { type: 'column', title: 'Growth of 23-38% in each of the last four quarters (Stöferle from Q1FY26)', unit: 'Revenue growth year on year (%)', x: X.M.quarterly.labels.slice(-8), series: [{ name: 'Revenue growth', values: yoyQ, fmt: 'pct' }], labels: 'all', source: 'Quarterly results as reported (Screener.in)' },
    ] },
    { pair: [
      { type: 'stacked', title: 'India is ~72% of income; Europe ~27%', unit: 'Total income by entity (₹ crore)', x: QL, series: ENT.map(([k, nm]) => ({ name: nm, values: SQ.map(q => q[k]), fmt: 'num' })), minLabel: 300, source: 'Results presentations, Q4FY25-Q1FY27 (before consolidation adjustments)' },
      { type: 'line', title: 'Europe earns 16-20%; India slipped to 11.2% in Q1FY27', unit: 'EBITDA incl. other income, % of total income', x: QL, series: [{ name: 'India', values: SQ.map(q => Math.round(q.indiaEbitda / q.india * 1000) / 10), fmt: 'pct' }, { name: 'Europe', values: SQ.map(q => Math.round(q.europeEbitda / q.europe * 1000) / 10), fmt: 'pct' }], labels: 'last', min: 8, max: 22, source: 'Results presentations (company EBITDA definition includes other income)' },
    ] },
    { pair: [
      { type: 'hbar', title: 'Bajaj Auto is 35% of income; the next seven 42%', unit: 'Share of FY26 consolidated total income (%)', x: C.profile.customers.slice(0, 8).map(c => c[0]), series: [{ name: 'FY26', values: C.profile.customers.slice(0, 8).map(c => c[2]), fmt: 'pct' }], labels: 'all', source: 'Q4FY26 presentation p29' },
      { type: 'line', title: `EBITDA margin: 16% in FY20-21, 13-14% since FY24; ${n1(F.ebitdaMargin[2])}% in FY29E`, unit: 'EBITDA margin excl. other income (%)', x: 'fin.labels', from: 'FY16', to: 'FY29E', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 8, max: 18, source: 'Screener.in; GAM estimates FY27-29E' },
    ] },
    { pair: [
      { type: 'line', title: `Forward P/E: ${n1(X.sepNow)}x Sep-28E now vs a ${n1(FM.median)}x median since 2021`, unit: 'Price ÷ next full-year EPS (x)', x: FM.series.map(x => x[0]), series: [{ name: 'Forward P/E', values: FM.series.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: MULT.base, text: `Our multiple: ${MULT.base}x`, color: '#cf8f1f' }], source: 'Screener.in prices and EPS; GAM estimates for FY27-28E' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (post-Q1 notes)', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...postQ1.map(s => `${s.broker} (${sd(s.date)})`), 'GAM (base)'], series: [{ name: 'Target', values: [...postQ1.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: `MOSL and Choice result updates (14-Aug-2026); median ₹${n0(medTp)}; GAM Research` },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.india, P3.europe, P3.newbiz, P3.customers, P3.moat, p.financials, P4.guidance, p.capital, P4.quality, p.balance, P4.ownership(p.ownershipBase), P4.governance, P4.forecasts, P5.street, P5.valuation, P6.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
