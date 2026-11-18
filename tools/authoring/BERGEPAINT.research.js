// Berger Paints report, part B: cover, story in charts, and the merger of part2-4 (business, history,
// industry, tailwind test, competition, decorative, industrial & subsidiaries, moat, Q1FY27, earnings
// quality, ownership, governance, forecasts, street, valuation, verdict, glossary, statement notes).
// Shared inputs in BERGEPAINT.ctx.js. Forecast and valuation figures are live tokens ({{...}}) that follow
// assumptions.json. As of 30-Sep-2026.
const X = require('./BERGEPAINT.ctx');
const { F, V, A, n0, n1, SQ, QL, Q1, price, mv, epsSep28, peMult, FM, fwdPe, rating, ST, b, decoF, indF, BL, sectorDr, nom, isec, mncl, avgPost } = X;
const P2 = require('./BERGEPAINT.part2'), P3 = require('./BERGEPAINT.part3'), P4 = require('./BERGEPAINT.part4');

const cover = {
  headline: 'A strong No.2 that new rivals have made cheaper to fight: volumes keep growing, pricing power has not come back, and the stock is fairly priced',
  lead: `Berger is India's second-largest paint company (~20% of listed players' sales), with 64,000+ dealers, No.1 in protective coatings and net cash. Its problem since 2024 is not volume (standalone volume grew 4-12% a quarter) but value: Grasim's Birla Opus pushed dealer schemes up and prices down, JSW took over Dulux in Dec-2025, and Berger's revenue grew only 3% a year in FY25-26. The 2026 crude spike reversed that for now: Q1FY27 revenue rose 12% (volume +8.4%, price ~5%) and PAT 29%. The street values Berger on **P/E (46-50x FY28E EPS)**. We forecast EPS of ₹${n1(F.eps[0])} (FY27E), ₹${n1(F.eps[1])} (FY28E) and ₹${n1(F.eps[2])} (FY29E). Applying **${peMult}x to Sep-28E EPS of ₹${n1(epsSep28)}** gives **{{dcf.tp|inr}} ({{dcf.upside|chg}})**: **we initiate with ${rating}.** Cross-checks: EV/EBITDA ₹${n0(mv('ev').value)}, DCF ₹${n0(mv('dcf').value)}. Bull case {{scen.bull.tp|inr}}; bear case {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'Volume yes, pricing no', p: `In the eight quarters to Q4FY26 standalone volume grew 4-12% but value only −0.4% to +6.7%: cheaper products (putty, textures, tile adhesives), economy-emulsion price cuts and heavier dealer schemes. Q1FY27's 12.7% value growth is the industry's crude-led price rise (list prices +12-13%, ~5% realised), not new pricing power.` },
    { h: 'Competition changed the economics', p: 'Birla Opus sold ₹1,661 cr of paint in Q1FY27 (+64%), half Berger\'s standalone quarter, and calls itself the No.3 organised decorative player. Berger\'s share stopped rising at ~20% and the MD admitted a small loss in 9MFY26, "mostly to Birla". The challenger has raised its list prices, but rebates and "10% free material" continue.' },
    { h: 'FY27 is a good year; FY28 is the test', p: `We model EPS +{{F.epsGrowth.0|pct}} in FY27E (price, operating leverage, a low FY26 base hit by one-offs), then +{{F.epsGrowth.1|pct}} and +{{F.epsGrowth.2|pct}} as price laps and part is given back. EBITDA margin {{F.ebitdaMargin.0|pct}} / {{F.ebitdaMargin.1|pct}} / {{F.ebitdaMargin.2|pct}}, inside the 15-17% band Berger has lived in for a decade.` },
    { h: 'Valuation: fair, not cheap', p: `At ₹${n0(price)} the stock trades at ${n1(price / F.eps[0])}x our FY27E and ${n1(price / F.eps[1])}x FY28E EPS. Its ${Math.round(FM.median)}x median forward P/E since 2021, cut by the ~${Math.round(-sectorDr)}% de-rating of paint and adhesive peers, gives ${peMult}x and {{dcf.tp|inr}}. The DCF (₹${n0(mv('dcf').value)}) shows the price still assumes long, high growth.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'GREEN' },
    { k: 'Predictability', v: 'AMBER' },
    { k: 'Earnings momentum', v: 'GREEN' },
    { k: 'Competitive position', v: 'AMBER' },
    { k: 'Valuation', v: 'AMBER' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): realised price (guided 7.5-8.5%), volume (guided 7.5-8%) and whether the margin rose year on year as promised.',
    'Post-Diwali pricing: if crude stays lower, a price cut or bigger dealer rebates would hit FY28 value growth; past cuts came 3-4 months after inputs fell.',
    'Birla Opus and JSW Dulux: Grasim\'s quarterly paint revenue, dealer schemes, painter incentives.',
    'Panagarh plant start (end of FY27) and the capex run-rate (₹600-800 cr guided for FY27).',
    'East India demand: West Bengal (a large market for Berger) after the change of government; North-East floods.',
  ],
};

// ---------------------------------------------------------------- Story in charts
const opus = { q: 'Q1FY27', BERGER: Q1.saRevenue, OPUS: 1661 };
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: 'Two years of volume without value, then price arrived', unit: 'Standalone growth, year on year (%)', x: QL, series: [{ name: 'Volume', values: SQ.map(q => q.volumePct), fmt: 'pct' }, { name: 'Value (revenue)', values: SQ.map(q => q.valuePct), fmt: 'pct' }], labels: 'none', source: 'Company presentations (Q1FY26 volume = decorative)' },
      { type: 'column', title: 'Share of listed players: ~20-21% on the company count, slipping in 9MFY26', unit: 'Berger India share of five listed paint companies\' sales (%, company estimate)', x: ['FY22', 'FY23', 'FY24', 'FY25', 'Q1FY26'], series: [{ name: 'Share', values: [18.9, 19.3, 19.5, 20.3, 21.2], fmt: 'pct' }], labels: 'all', min: 15, max: 23, source: 'Q4FY25 and Q1FY26 decks; Q4FY26 deck says "~20%"; MD (Feb-2026): 19.4-19.6% in 9MFY26 on his basis' },
    ] },
    { pair: [
      { type: 'hbar', title: 'Birla Opus already sells half as much paint as Berger India', unit: 'Revenue, Jun-2026 quarter (₹ crore)', x: ['Asian Paints (standalone)', 'Berger (standalone)', 'Kansai Nerolac (consolidated)', 'Birla Opus (Grasim paints)', 'Indigo Paints'], series: [{ name: 'Revenue', values: [9156, opus.BERGER, 2374, opus.OPUS, 370], fmt: 'num' }], labels: 'all', highlight: 'Berger (standalone)', source: 'Company results (Asian Paints standalone net sales per press summaries; Kansai and Indigo per Screener.in); Grasim Q1FY27 release' },
      { type: 'line', title: 'Standalone margins: gross 39-42%, EBITDA 13-18%', unit: 'Standalone margin (%)', x: QL, series: [{ name: 'Gross margin', values: SQ.map(q => q.saGrossMarginPct), fmt: 'pct' }, { name: 'EBITDA margin', values: SQ.map(q => q.saEbitdaMarginPct), fmt: 'pct' }], labels: 'last', min: 0, max: 50, source: 'Company presentations (margin-trend slides)' },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: inside 15-17% for most of a decade', unit: 'Consolidated EBITDA margin (%); dashed lines = management\'s 15-17% range', x: 'fin.labels', from: 'FY17', to: 'FY29E', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 10, max: 20, lines: [{ v: 15, text: '' }, { v: 17, text: '' }], source: 'Screener.in; GAM estimates FY27-29E' },
      { type: 'stacked', title: 'Our build: decorative carries the growth', unit: "Revenue by business line (₹ '000 crore)", x: ['FY26', ...F.years], series: [{ name: 'Decorative', values: [BL.base.deco, ...decoF].map(v => Math.round(v / 100) / 10), fmt: 'n1' }, { name: 'Industrial', values: [BL.base.industrial, ...indF].map(v => Math.round(v / 100) / 10), fmt: 'n1' }], minLabel: 1, source: 'AR FY26 (industrial 18% of FY26 sales); GAM estimates' },
    ] },
    { pair: [
      { type: 'line', title: `Forward P/E: from ${Math.round(X.H21.max)}x in 2021 to ~${Math.round(price / F.eps[1])}x`, unit: 'Price ÷ next full-year EPS (x)', x: fwdPe.map(x => x[0]), series: [{ name: 'Forward P/E', values: fwdPe.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 2, lines: [{ v: Math.round(FM.median), text: `Median since 2021: ${Math.round(FM.median)}x` }], source: 'Screener.in prices (bonus-adjusted); actual EPS, GAM estimates for FY27-28E' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (latest notes standing on 30-Sep-26)', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...ST.map(s => s.broker), 'GAM (base)'], series: [{ name: 'Target', values: [...ST.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes and aggregators (May-Sep 2026), GAM Research' },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.competition, P2.deco, P2.industrial, P3.moat, p.financials, P3.guidance, p.capital, P3.quality, p.balance, P3.ownership(p.ownershipBase), P3.governance, P3.forecasts, P4.street, P4.valuation, P4.risks, p.statements, P4.glossary],
  statementNotes: P4.statementNotes,
};
