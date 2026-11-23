// Torrent Pharma report, part B: cover, the story in charts, and the merger of part2-6 (business, history & the JB deal,
// industry, tailwind test, India, JB, international, moat, Q1FY27, earnings quality, ownership, governance, forecasts,
// street, valuation, verdict, glossary, statement notes). Shared inputs in TORNTPHARM.ctx.js. Forecast and valuation
// figures are live tokens ({{...}}) that follow assumptions.json. As of 30-Sep-2026.
const X = require('./TORNTPHARM.ctx');
const { F, V, A, n0, n1, SQ, QL, Q1, price, mv, MULT, adjEps, adjSep, epsSep, FMA, fwdAdj, rating, ST, lev, ndOwn, nd0, k, SECTOR_DR, peNowAdj, peNowRep, YRS, BL, LINES, LBL, JB_M, C } = X;
const P2 = require('./TORNTPHARM.part2'), P3 = require('./TORNTPHARM.part3'), P4 = require('./TORNTPHARM.part4'), P5 = require('./TORNTPHARM.part5'), P5b = require('./TORNTPHARM.part5b'), P6 = require('./TORNTPHARM.part6');

const cover = {
  headline: `India's best brand-builder has bought JB with debt: a franchise worth owning, but at ₹4,800 the price runs well ahead of Torrent's own valuation history`,
  lead: `Torrent is India's 5th-largest pharma company after merging J.B. Chemicals (effective 8-Jul-2026; 38.04 cr shares), #1 in cardiac, with 75% of India sales in chronic therapies, plus branded generics in Brazil and generics in the US and Germany. Q1FY27 revenue rose 55% to ₹4,921 cr (base business +17%, India +19%; JB +10% with its margin up from 28.8% to 35.3%). The price of the deal is a reset: ₹12,500 cr of debt (net debt 2.3x EBITDA) and ₹1,340 cr a year of non-cash brand amortisation, so FY26 pro forma EPS is ₹${n1(X.PATCH.B.eps)}. We forecast EBITDA of ₹${n0(F.ebitda[0])} / ${n0(F.ebitda[1])} / ${n0(F.ebitda[2])} cr and EPS of ₹{{F.eps.0|n1}} / {{F.eps.1|n1}} / {{F.eps.2|n1}} for FY27-29E (₹${n1(adjEps[0])} / ${n1(adjEps[1])} / ${n1(adjEps[2])} before the JB amortisation). Two of the three brokers that disclose a method value Torrent on **EV/EBITDA on FY28E** (PL 28x, ICICI Direct 27x; Motilal Oswal uses P/E), and so do we: **${X.EVM.base}x Sep-28E EBITDA of ₹${n0(X.ebitdaSep)} cr** (Torrent's own ${n1(X.HEV.med)}x forward median since 2021, lifted ${X.SECTOR_EV}% for the sector's EV/EBITDA re-rating), less net debt, gives **{{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}.** Cross-checks: P/E ${MULT.base}x Sep-28E EPS before the JB amortisation (₹${n1(adjSep)}) gives ₹${n0(mv('pe').value)}; DCF ₹${n0(mv('dcf').value)}. Bull {{scen.bull.tp|inr}}; bear {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'A domestic compounder with a proven acquisition playbook', p: `Base business +15% in FY26 (India +13%) and India +19% in Q1FY27 against the market's 9-12%, 27 brands above ₹100 cr, a 7,000-rep field force with high productivity. Elder (2014), Unichem (2017) and Curatio (2022, +27-34% a year since) all grew faster under Torrent; JB's brands (Cilacar, Nicardia, Metrogyl, Rantac) make it #1 in cardiac.` },
    { h: 'JB is working so far, earlier than planned', p: `JB's margin jumped to 35.3% in its first full quarter (26.7% in its own FY26 books), field-force attrition fell from ~30% to 16%, and FY27 cost synergies will be "definitely above ₹100 cr" against ₹90 cr planned (₹400-450 cr by year 3). The risk is the brand transfers into Torrent divisions in Q2-Q3, which management says can dent revenue for 2-3 quarters.` },
    { h: 'The generics half is not a moat', p: `US sales are about where they were in FY14 in dollars; Germany is "in the middle of the woods" after a supplier failure and lost tenders; Brazil grows but lost the first-mover slot in semaglutide. With the rest of world and JB international these are ~44% of pro forma revenue and grow mid-single digits in local currency.` },
    { h: 'Valuation: above its own history on every yardstick', p: `At ₹${n0(price)} the stock trades at ${n1(X.evNow)}x our FY28E EV/EBITDA against a ${n1(X.HEV.med)}x forward median since 2021 (${n1(X.HEVpre)}x before the deal, ${n1(X.HEVpost)}x since), and at ${n1(peNowRep)}x FY28E reported EPS (${n1(peNowAdj)}x before the JB amortisation, vs a ${n1(X.medExc)}x median). The street's 27-28x FY28E EBITDA assumes the post-deal re-rating lasts; our ${X.EVM.base}x does not. Net debt should fall to ~${lev[3].toFixed(1)}x EBITDA by FY29E, and the DCF (₹${n0(mv('dcf').value)}) says the price already assumes a lot.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'GREEN' },
    { k: 'Earnings momentum', v: 'GREEN' },
    { k: 'Competitive position', v: 'GREEN' },
    { k: 'Balance sheet', v: 'AMBER' },
    { k: 'Valuation', v: 'RED' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): the first quarter of JB brand transfers into Torrent divisions, semaglutide injectable back in stock (expected end-August), and the full-year margin guidance management deferred in July.',
    'Brazil: ANVISA approval of Torrent\'s generic semaglutide (five rival approvals in Jul-2026) and the recovery to mid-teens constant-currency growth after Q1\'s destocking.',
    'Synergy updates: FY27 "above ₹100 cr" vs ₹90 cr planned; ₹400-450 cr by year 3, possibly in year 2.',
    'Debt: ₹1,500 cr of commercial paper falls due in Jan-2027 and ₹2,000 cr of NCDs in Jan-2028; any use of the ₹5,000 cr QIP enabling resolution.',
    'India launches: resmetirom (NASH) after patent expiry, guided within 12-18 months of May-2026; more first-to-market molecules.',
  ],
};

// ---------------------------------------------------------------- Story in charts
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: 'India revenue: +19% organic in Q1FY27, +60% with JB', unit: 'India revenue (₹ crore), quarterly; JB from 21-Jan-2026', x: QL, series: [{ name: 'India', values: SQ.map(q => q.india), fmt: 'num' }], labels: 'all', highlight: 'Q1FY27', source: 'Company results (PL tables)' },
      { type: 'hbar', title: 'With JB, India is 56% of a ₹17,350 cr business', unit: 'FY26 pro forma revenue by line (₹ crore)', x: LINES.map(l => LBL[l]), series: [{ name: 'FY26 PF', values: LINES.map(l => BL.base[l]), fmt: 'num' }], labels: 'all', highlight: LBL.indiaBase, source: 'AR FY26 MD&A; JB FY26 (Screener); GAM split' },
    ] },
    { pair: [
      { type: 'column', title: 'JB\'s margin: 27% in its own books, 35% under Torrent', unit: 'JB EBITDA margin (%); FY27-29E = GAM', x: ['FY24', 'FY25', 'FY26', 'Q1FY26', 'Q1FY27', ...YRS], series: [{ name: 'JB EBITDA margin', values: [25.7, 26.3, 26.7, 28.8, 35.3, ...JB_M], fmt: 'pct' }], labels: 'all', highlight: 'Q1FY27', source: 'Screener JBCHEPHARM (FY24-26); Torrent Q1FY27 call; GAM' },
      { type: 'line', title: 'Group margin: steady at 32-34% through the deal', unit: 'Consolidated EBITDA margin (%), quarterly', x: QL, series: [{ name: 'EBITDA margin', values: SQ.map(q => q.ebitdaMarginPct), fmt: 'pct' }], labels: 'all', min: 28, max: 36, source: 'Screener.in' },
    ] },
    { pair: [
      { type: 'column', title: 'EPS: the JB amortisation costs ~₹26 a share every year', unit: 'EPS (₹), 38.04 cr shares; FY26 = pro forma', x: ['FY26 PF', ...YRS], series: [{ name: 'Reported', values: [n1(X.PATCH.B.eps), ...X.epsU.map(v => Math.round(v * 10) / 10)].map(Number), fmt: 'n1' }, { name: 'Before JB amortisation', values: [Math.round((X.PATCH.B.pat + 1340 * 0.7483) / X.SHARES * 10) / 10, ...adjEps.map(v => Math.round(v * 10) / 10)], fmt: 'n1' }], labels: 'all', source: 'GAM Research' },
      { type: 'line', title: 'Net debt / EBITDA: 2.4x now, ~0.6x by FY29E on our numbers', unit: 'Net debt incl. leases ÷ EBITDA (x)', x: ['FY26', ...YRS], series: [{ name: 'Net debt / EBITDA', values: lev.map(v => Math.round(v * 100) / 100), fmt: 'x' }], labels: 'all', min: 0, max: 3, source: 'GAM Research (FY26 on pro forma EBITDA)' },
    ] },
    { pair: [
      { type: 'line', title: `Forward EV/EBITDA: median ${n1(X.HEV.med)}x since 2021, ${n1(X.evNow)}x our FY28E now`, unit: 'EV ÷ next full-year EBITDA (x); merged basis from the Jun-2025 announcement', x: X.fwdEv.map(x => x[0]), series: [{ name: 'Forward EV/EBITDA', values: X.fwdEv.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: X.HEV.med, text: `Median since Apr-2021: ${n1(X.HEV.med)}x` }, { v: X.EVM.base, text: `Our target: ${X.EVM.base}x`, color: '#cf8f1f' }], source: 'Screener.in prices and balance sheets; GAM estimates FY27-29E' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (notes standing on 30-Sep-26)', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...ST.map(s => `${s.broker} (${X.shortDate(s.date)})`), 'GAM (base)'], series: [{ name: 'Target', values: [...ST.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes and aggregators (Jun-Jul 2026), GAM Research' },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.india, P3.jb, P3.international, P3.moat, p.financials, P4.guidance, p.capital, P4.quality, p.balance, P4.ownership(p.ownershipBase), P4.governance, P4.forecasts, P5.street, P5b.valuation, P5.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
