// Infosys report, part B: cover, story in charts, and the merger of part2-4b (business, history, industry, the AI
// question, tailwind test, verticals, deals & people, moat, Q1FY27, earnings quality, ownership, governance,
// forecasts, street, valuation, verdict, glossary, statement notes). Shared inputs in INFY.ctx.js.
// Forecast and valuation figures are live tokens ({{...}}) that follow assumptions.json. As of 30-Sep-2026.
const X = require('./INFY.ctx');
const { F, V, A, n0, n1, pc, SA, SQ, QL, Q1, FY26, price, mv, epsSep28, peMult, FM, fwdPe, rating, b, sectorDr, derate, PEER_SYMS, shortName, post, medTp, usdG, impliedG } = X;
const P2 = require('./INFY.part2'), P2b = require('./INFY.part2b'), P3 = require('./INFY.part3'), P3b = require('./INFY.part3b'), P4 = require('./INFY.part4'), P4b = require('./INFY.part4b');

const cover = {
  headline: 'The growth has gone and may not fully return; the cash, the margins and a 12x multiple make it worth owning anyway',
  lead: `Infosys is India's second-largest IT services company: US$20.2 bn of revenue in FY26, 328,000 people, ~2,000 large clients. The 2026 fall in IT shares is, in our view, mostly a lasting de-rating rather than a cycle: Infosys's volumes were flat in FY26, it now openly talks of "AI-led deflation" in renewals, and in Jul-2026 it cut FY27 guidance to 1.5-3.0% in constant currency even though 1.7 points now come from acquisitions, leaving ~0.5% organic growth. But it still earns a ~21% operating margin, converts more than all its profit into cash and returns ~85% of it. The street values Infosys on **P/E (13-15x FY28E EPS)**. We forecast US$ revenue growth of ${n1(usdG[0])}% / ${n1(usdG[1])}% / ${n1(usdG[2])}% (FY27-29E) and EPS of ₹${n1(F.eps[0])} / ₹${n1(F.eps[1])} / ₹${n1(F.eps[2])}, slightly above the street because of the weaker rupee. Applying **${peMult}x to Sep-28E EPS of ₹${n1(epsSep28)}** - its own ${n1(FM.median)}x median forward P/E cut by the IT sector's median de-rating of ${pc(sectorDr)} - gives **{{dcf.tp|inr}} ({{dcf.upside|chg}})**: **we initiate with ${rating}**. Most of the upside is the multiple recovering from ~12x, not earnings growth. Cross-checks: EV/EBITDA ₹${n0(mv('ev').value)}, DCF ₹${n0(mv('dcf').value)}. Bull {{scen.bull.tp|inr}}; bear {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'Growth is the problem', p: `Constant-currency growth was 4.2% (FY25), 3.1% (FY26) and 2.4% YoY in Q1FY27; organic revenue fell 0.1% QoQ in Q1. Clients ask for AI productivity at every renewal and now mid-contract; headcount has barely moved (323,578 in Mar-25, 328,062 in Jun-26). We model only ~3-3.5% US$ growth in FY28-29.` },
    { h: 'Margins and cash are the anchor', p: `EBIT margin ~21% for four years (21.1% in Q1FY27, guidance 20-22%); free cash flow above 100% of profit; no debt; ₹37,065 cr of cash and investments at Jun-26. The 85%-of-FCF payout policy means a ~5% dividend yield at ₹${n0(price)} plus buybacks.` },
    { h: 'AI cuts both ways', p: `AI-first services rose from 5.5% to 8.2% of revenue in two quarters and large deals are strong (US$3.6 bn in Q1, 61% net new; 20% from vendor consolidation). But AI also shrinks the work in the other ~92%. Our forecasts assume the two roughly cancel; the bear case assumes they do not.` },
    { h: 'The de-rating has already happened', p: `At ₹${n0(price)} Infosys trades at ${n1(price / F.eps[1])}x our FY28E EPS against a ${n1(FM.median)}x median forward P/E since 2021 (Infosys ${pc(derate.INFY)} vs its five-year median trailing P/E). Our ${peMult}x applies the IT sector's median de-rating (${pc(sectorDr)}) to that history; on the large incumbents' deeper de-rating alone it would be ${Math.round(X.afterInc)}x, and a justified P/E is ${n1(X.justPe(5))}x - so the target needs the market to stop marking Infosys down. On our ten-year cash flows the price implies long-run growth of ${X.sg1(impliedG)}% a year.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'GREEN' },
    { k: 'Predictability', v: 'AMBER' },
    { k: 'Earnings momentum', v: 'RED' },
    { k: 'Competitive position', v: 'AMBER' },
    { k: 'Valuation', v: 'GREEN' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): whether organic growth turns positive after Q1\'s -0.1% QoQ, how much the October wage hikes cost, and whether the 1.5-3.0% guidance holds.',
    'CEO transition: Ashiss Dash is mentored from October 2026 and takes over on 1-Apr-2027; his first FY28 guidance (April 2027) will show whether Infosys resets its strategy or targets.',
    'Capital return: FY25-26 returned 82.1% of free cash flow; another buyback or special dividend would keep the policy on track while cash rebuilds after the Dec-2025 buyback.',
    'AI revenue share each quarter (8.2% in Q1FY27) against the pace of AI-led price deflation in renewals - the single most important number for the multiple.',
    'US policy: H-1B and L-1 fees (from 9-Sep-2026), the DOJ investigation into H-1B classification for one client, tariffs and US interest rates.',
  ],
};

// ---------------------------------------------------------------- Story in charts
const PS = PEER_SYMS.filter(s => s !== 'INFY').sort((a, c) => derate[a] - derate[c]);
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: 'Constant-currency growth stuck at 2-4% for nine quarters', unit: 'Revenue growth YoY in constant currency (%)', x: QL, series: [{ name: 'CC growth', values: SQ.map(q => q.ccGrowthPct), fmt: 'n1' }], labels: 'all', source: 'Infosys fact sheets' },
      { type: 'column', title: 'Yet large deals keep coming: US$3-5 bn a quarter', unit: 'Large-deal TCV (US$ bn)', x: QL, series: [{ name: 'Large-deal TCV', values: SQ.map(q => q.tcvLargeBn), fmt: 'n1' }], labels: 'all', source: 'Infosys fact sheets' },
    ] },
    { pair: [
      { type: 'line', title: 'Operating margin pinned at ~21%', unit: 'EBIT margin (%), Q3FY26 adjusted for the Labour Codes charge', x: QL, series: [{ name: 'EBIT margin', values: SQ.map(q => q.opMarginAdjPct), fmt: 'pct' }], labels: 'all', min: 18, max: 23, lines: [{ v: 20, text: '' }, { v: 22, text: '' }], source: 'Infosys fact sheets; dashed lines = 20-22% guidance' },
      { type: 'column', title: 'More revenue per person: the work needs fewer people', unit: 'US$ revenue per average employee (US$ \'000)', x: SA.filter(a => a.revPerEmployeeK).map(a => a.fy), series: [{ name: 'Revenue per employee', values: SA.filter(a => a.revPerEmployeeK).map(a => a.revPerEmployeeK), fmt: 'n1' }], labels: 'all', min: 40, source: 'Infosys fact sheets; GAM Research' },
    ] },
    { pair: [
      { type: 'column', title: `EPS: ₹73 in FY26, ₹${Math.round(F.eps[2])} by FY29E (~${Math.round(X.epsCagrFwd)}% a year)`, unit: 'EPS (₹, attributable; FY26 on the year-end share count)', x: 'fin.labels', from: 'FY19', to: 'FY29E', series: [{ name: 'EPS', ref: 'fin.eps', fmt: 'n1' }], labels: 'all', source: 'Screener.in; GAM estimates FY27-29E' },
      { type: 'hbar', title: 'Every IT peer trades below its five-year median P/E', unit: 'Trailing P/E at the 30-Sep-2026 close vs five-year median (%)', x: [...PS.map(shortName), 'Infosys'], series: [{ name: 'vs median', values: [...PS.map(s => Math.round(derate[s])), Math.round(derate.INFY)], fmt: 'pct0' }], labels: 'all', highlight: 'Infosys', source: 'Screener.in; GAM Research' },
    ] },
    { pair: [
      { type: 'line', title: `Forward P/E: ~${Math.round(price / F.eps[1])}x now vs a ${Math.round(FM.median)}x median since 2021`, unit: 'Price ÷ next full-year EPS (x)', x: fwdPe.map(x => x[0]), series: [{ name: 'Forward P/E', values: fwdPe.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 2, lines: [{ v: Math.round(FM.median), text: `Median since 2021: ${Math.round(FM.median)}x` }, { v: peMult, text: `Our multiple: ${peMult}x`, color: '#cf8f1f' }], source: 'Screener.in prices; actual EPS, GAM estimates for FY27-28E' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (notes of 23-24 Jul 2026)', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...post.slice().sort((a, c) => a.tp - c.tp).map(s => s.broker), 'GAM (base)'], series: [{ name: 'Target', values: [...post.slice().sort((a, c) => a.tp - c.tp).map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: `Broker notes and press reports (23-24 Jul 2026); median target ₹${n0(medTp)}` },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.aiQuestion, P2.tailwind, P2b.verticals, P2b.engine, P3.moat, p.financials, P3.guidance, p.capital, P3.quality, p.balance, P3.ownership(p.ownershipBase), P3.governance, P3b.forecasts, P4.street, P4.valuation, P4b.risks, p.statements, P4b.glossary],
  statementNotes: P4b.statementNotes,
};
