// Balkrishna Industries (BKT) report, part B: cover, the story in charts, and the merger of part2-6 (business, history,
// industry, tailwind test, OHT, carbon black & on-highway, moat, Q1FY27, earnings quality, ownership, governance, forecasts,
// street, valuation, verdict, glossary, statement notes). Shared inputs in BALKRISIND.ctx.js; forecast and valuation figures
// are live tokens ({{...}}) that follow assumptions.json. As of 30-Sep-2026.
const X = require('./BALKRISIND.ctx');
const { F, V, A, SQ, C, n0, n1, price, mv, FM, sectorDr, k, MULT, epsSep, rating, postQ1, medTp, bld, FY26, Q1, b } = X;
const P2 = require('./BALKRISIND.part2'), P3 = require('./BALKRISIND.part3'), P4 = require('./BALKRISIND.part4'), P5 = require('./BALKRISIND.part5'), P6 = require('./BALKRISIND.part6');

const cover = {
  headline: 'The world\'s off-highway tyre specialist, betting its balance sheet on new markets; fairly priced after the Q1 rally',
  lead: `Balkrishna Industries (BKT) makes off-highway tyres (OHT) for tractors, harvesters, mining trucks, loaders and industrial machines, ~64% of them exported (Europe 40%, Americas 13% of FY26 volume), from four Indian plants with captive carbon black. FY26 EPS fell 25% to ₹64.3 on currency-hedge losses and a 50% US duty; Q1FY27 bounced (volume +16%, profit +57%). We forecast EPS of ₹${n1(F.eps[0])} / ₹${n1(F.eps[1])} / ₹${n1(F.eps[2])} for FY27-29E, below the street's FY28E range (₹94-105). The street values BKT on **P/E on one-year-forward EPS** (22-28x FY28E). Applying the house rule (its forward P/E median since 2021, ${n1(FM.median)}x, cut by the ${Math.abs(sectorDr).toFixed(1)}% tyre-sector de-rating) gives **${MULT.base}x Sep-28E EPS of ₹${n1(epsSep.base)} = {{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}**, just short of the BUY threshold. Cross-checks: EV/EBITDA ₹${n0(mv('ev').value)}, DCF ₹${n0(mv('dcf').value)}, both below the price. Bull case {{scen.bull.tp|inr}}; bear case {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'The core is a real niche, and FY27 is a recovery year', p: `BKT has ~5-6% of the global OHT market with 3,600+ sizes, Indian costs and its own carbon black and power at Bhuj; its EBITDA margin (18-31% over FY16-26) is far above Indian tyre peers (12-16% in FY26). Q1FY27 brought record volume (93,770 MT, +16%), India up to ~40% of volume, the US reopening at a ~10% duty, and hedges rolling to ~₹107/EUR from ₹94-99. We model FY27E revenue +${Math.round(F.salesGrowth[0])}% and EPS +${Math.round(F.epsGrowth[0])}%.` },
    { h: 'But margins are hostage to things BKT does not control', p: `FY26 showed it: a ₹517 cr swing in currency gains and losses (standalone) and a US duty of 50% cut EPS by a quarter while volume rose 1%. In FY27 raw materials are up again (crude, Middle East freight): management expects ~2pp of margin to go in Q2. We assume {{F.ebitdaMargin.0|pct}} for FY27E and {{F.ebitdaMargin.2|pct}} by FY29E, below management's 23-25% "endeavour" and the street's bulls.` },
    { h: 'The new businesses are a bet, not a moat', p: `₹6,800 cr of capex to FY29 (two-thirds of net worth) goes largely into carbon black for third parties, truck and bus radials, two-wheeler and passenger-car tyres in India, crowded markets with entrenched leaders. Debt has risen to ₹4,690 cr (Jun-26) and ROCE fell to 11%. We assume on-highway revenue of ₹${n0(X.BL.onHighway[2])} cr by FY29E, well short of the ₹5,000 cr 2030 target.` },
    { h: 'Valuation: fair after the rally', p: `At ₹${n0(price)} BKT trades at ${n1(price / F.eps[1])}x our FY28E and ${n1(X.sepNow)}x Sep-28E EPS. Its own forward P/E has a median of ${n1(FM.median)}x since 2021, but Indian tyre stocks sat ${Math.abs(sectorDr).toFixed(1)}% below their five-year medians on 30-Sep-2026. That gives ${MULT.base}x and {{dcf.tp|inr}}. Our EPS, not the multiple, is why we sit below the post-Q1 street median (₹${n0(medTp)}): at the street's 27x we would be at ~₹${n0(Math.round(27 * epsSep.base / 10) * 10)}.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'RED' },
    { k: 'Earnings momentum', v: 'GREEN' },
    { k: 'Competitive position', v: 'GREEN' },
    { k: 'Valuation', v: 'AMBER' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): the size of the raw-material hit (management: ~2pp of margin) against the full ~5% price increase and the better euro hedges.',
    'US trade: whether the ~10% duty holds and whether the reciprocal-tariff refunds BKT has filed for (as importer of record) are paid; US back to 15-16% of revenue is management\'s aim.',
    'The European farm season (heat waves, farm incomes) and dealer inventories, which drive ~40% of volume.',
    'On-highway ramp-up: TBR and two-wheeler sales from Q2, the passenger-car pilot in Q3FY27; the first disclosure of on-highway revenue.',
    'Capex peaking in FY27 (₹2,500-3,000 cr) and free cash flow turning positive in FY28E; dividend policy once capex falls.',
  ],
};

// ---------------------------------------------------------------- Story in charts
const fx = [['FY25', C.fy26.fy25standalone], ['FY26', C.fy26.standalone], ['Q1FY27', Q1.standalone]];
const vq = SQ.filter(q => q.volumeMt);
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: `Revenue: ₹10,823 cr in FY26; we forecast ₹${n0(F.sales[2])} cr by FY29E`, unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY19', to: 'FY29E', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'all', source: 'Screener.in; GAM estimates FY27-29E' },
      { type: 'column', title: 'Volume: a record 93,770 MT in Q1FY27 after the tariff-hit Q2FY26', unit: 'OHT sales volume (tonnes, standalone)', x: vq.map(q => q.q), series: [{ name: 'Volume', values: vq.map(q => q.volumeMt), fmt: 'num' }], labels: 'all', source: 'Company calls and presentations (Jan-2025 to Jul-2026)' },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: 25-31% to FY21, ~21% now; we assume a slow climb to 22%', unit: 'EBITDA margin (%)', x: 'fin.labels', from: 'FY16', to: 'FY29E', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 10, max: 35, source: 'Screener.in; GAM estimates FY27-29E' },
      { type: 'column', title: 'FY26 was a currency year: a ₹517 cr swing in FX gains and losses', unit: 'Foreign-exchange gain (+) / loss (−), standalone (₹ crore)', x: fx.map(r => r[0]), series: [{ name: 'Realised (in revenue)', values: fx.map(r => r[1].realisedFx), fmt: 'num' }, { name: 'Unrealised (below EBITDA)', values: fx.map(r => r[1].unrealisedFx), fmt: 'num' }], labels: 'all', source: 'Q4FY26 and Q1FY27 presentations (standalone P&L)' },
    ] },
    { pair: [
      { type: 'column', title: 'India is now ~40% of volume, above Europe for the first time', unit: 'Share of OHT volume (%)', x: ['Europe', 'Americas', 'India', 'Rest of world'], series: [{ name: 'FY26', values: [FY26.mix.europePct, FY26.mix.americasPct, FY26.mix.indiaPct, FY26.mix.rowPct], fmt: 'pct' }, { name: 'Q1FY27', values: [Q1.mix.europePct, Q1.mix.americasPct, Q1.mix.indiaPct, Q1.mix.rowPct], fmt: 'pct' }], labels: 'all', source: 'AR FY26 p.25; Q1FY27 presentation p.7 (decoded from the chart) and call' },
      { type: 'column', title: 'The build-out: capex peaks in FY27E, then free cash flow turns positive', unit: '₹ crore', x: 'fin.labels', from: 'FY21', to: 'FY29E', series: [{ name: 'Cash from operations', ref: 'fin.cfo', fmt: 'num' }, { name: 'Capex', ref: 'fin.capex', fmt: 'num' }], labels: 'none', source: 'Screener.in; GAM estimates (forecast CFO excludes treasury income)' },
    ] },
    { pair: [
      { type: 'line', title: `Forward P/E: ${n1(X.sepNow)}x Sep-28E now vs a ${n1(FM.median)}x median since 2021`, unit: 'Price ÷ next full-year EPS (x)', x: FM.series.map(x => x[0]), series: [{ name: 'Forward P/E', values: FM.series.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: MULT.base, text: `Our multiple: ${MULT.base}x`, color: '#cf8f1f' }], source: 'Screener.in prices and EPS; GAM estimates for FY27-28E' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (post-Q1 notes)', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...postQ1.map(s => s.broker), 'GAM (base)'], series: [{ name: 'Target', values: [...postQ1.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: `MOSL (30-Jul-2026), ICICI Direct (31-Jul-2026), Anand Rathi (2-Aug-2026); median ₹${n0(medTp)}; GAM Research` },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.oht, P3.newbiz, P3.moat, p.financials, P4.guidance, p.capital, P4.quality, p.balance, P4.ownership(p.ownershipBase), P4.governance, P4.forecasts, P5.street, P5.valuation, P6.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
