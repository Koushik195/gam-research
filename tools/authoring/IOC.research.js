// Indian Oil report, part B: cover, the story in charts, and the merger of part2-6 (business, history, industry,
// tailwind test, petroleum products, petchem/gas, moat, Q1FY27, earnings quality, ownership, governance, forecasts,
// street, valuation, verdict, glossary, statement notes). Shared inputs in IOC.ctx.js; forecast and valuation figures
// are live tokens ({{...}}) that follow assumptions.json.
const X = require('./IOC.ctx');
const { F, V, A, SG, EPT, bld, n0, n1, price, mv, OWN, MULT, sectorMv, rating, medTp, medPost, epsSep, ebSep, fwdEvNow, fwdPe, SP, evRows, ST, A26, Q1 } = X;
const P2 = require('./IOC.part2'), P3 = require('./IOC.part3'), P4 = require('./IOC.part4'), P5 = require('./IOC.part5'), P6 = require('./IOC.part6');
const ps = name => SP.find(p => p.name.startsWith(name))?.perShare || 0;

const cover = {
  headline: 'Cheap on paper, but the cycle and the state set the margins: SELL',
  lead: `Indian Oil refines ~31% of India's crude, owns >20,000 km of pipelines and sells 42% of its fuel. It earned ₹42,096 cr for shareholders in FY26, then lost ₹1,631 cr in Q1FY27 as crude hit US$100/bbl and retail prices were held. The stock looks cheap: ${n1(fwdPe)}x our FY28E EPS of ₹${n1(F.eps[1])} and ~${n1(price / A.bvps[A.labels.length - 1])}x book. But it has always looked cheap: its own one-year-forward EV/EBITDA (after taking out its investments) has a median of ${n1(OWN.med)}x since Apr-2021, and oil marketers and refiners trade ${Math.abs(sectorMv).toFixed(1)}% below their five-year medians. On ${MULT.base}x Sep-28E EBITDA of ₹${n0(ebSep)} cr, less net debt and minorities, plus its ONGC, GAIL, Oil India and Petronet stakes at market less 20%, we get **{{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}.** The street (median ₹${n0(medTp)}; ₹${n0(medPost)} for the three notes after Q1) uses 4.5-5.5x. Bull {{scen.bull.tp|inr}}; bear {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'Earnings are a policy variable', p: 'Petroleum-segment EBITDA per tonne sold was ₹3,800 in FY23 and FY25 and ₹8,300-8,600 in FY24 and FY26. The difference was not volume or efficiency but whether retail prices kept up with crude and how wide refining cracks were. In Q1FY27 the government cut excise by ₹10/litre and allowed staggered price rises, yet IOC still lost money before a ~₹15,000 cr inventory gain. We forecast ₹3,800/t in FY27E and ₹5,600-5,900/t after, a little below the FY22-26 average.' },
    { h: 'The expansions are real; the returns are not guaranteed', p: `~₹90,000 cr of projects (Panipat 15→25 MMTPA, Gujarat 13.7→18, Barauni 6→9, PX-PTA) are 89-95% complete and due by Dec-2026; throughput is guided at 77 / 85 / 90 MMT for FY27-29. That lifts our petroleum volumes ~3% a year. But capex stays at ₹30,000-40,000 cr a year (petrochemicals next), so free cash flow stays thin: ₹${F.fcf.map(v => (v < 0 ? "−" : "") + n0(Math.abs(v))).join(" / ")} cr in FY27-29E.` },
    { h: 'Investments are ~₹20 a share, not a free option', p: `The listed stakes are worth ₹${n0(X.listedMv)} cr at the 30-Sep close (ONGC alone ₹${n0(X.STK[0].mv)} cr), ₹${n0(X.listedMv * 0.8 / X.shares)} a share after a 20% discount; Petronet and ~30 unlisted JVs (fertiliser, LNG, Russian upstream) add ~₹${n0(22223 / X.shares)} a share at book. Against that, 48% of Chennai Petroleum belongs to others (₹${n0(X.cpclMin)} cr at market) and net debt was ~₹54,000 cr even after counting every investment.` },
    { h: 'Valuation: we follow the street\'s method, not its multiple', p: `The street adds investments to 4.5-5.5x EBITDA. IOC's own history says the market pays ~${n1(OWN.med)}x for the operating business once the stakes are taken out (${n1(X.grossMed)}x if they are left in), and the sector trades below its averages. ${MULT.base}x gives {{dcf.tp|inr}}; the stock at ₹${n0(price)} prices ~${n1(fwdEvNow)}x FY28E core EBITDA, i.e. our FY28E earnings with little discount for another policy squeeze. Cross-checks: P/E ₹${n0(mv('pe').value)}, DCF ₹${n0(mv('dcf').value)} (only if mid-cycle margins hold for a decade).` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting (inventory gains, LPG compensation timing)', v: 'AMBER' },
    { k: 'Governance (no independent directors; state pricing)', v: 'RED' },
    { k: 'Earnings momentum', v: 'AMBER' },
    { k: 'Competitive position', v: 'GREEN' },
    { k: 'Valuation (vs own history)', v: 'AMBER' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): marketing margins after the May-June price rises, LPG under-recovery (~₹250/cylinder guided), inventory effects, debt after the Q1 jump.',
    'Commissioning of Gujarat (Nov-2026), Panipat and Barauni (Dec-2026) and PX-PTA: first crude in, then a 60% / 80% / 100% ramp over three years.',
    'Government decisions: retail price changes, SAED and export duties (reviewed fortnightly), compensation for the ₹29,730 cr negative LPG buffer.',
    'Crude and the Strait of Hormuz: each US$10/bbl moves IOC\'s working capital and its marketing margin.',
    'Board appointments: independent directors and a reconstituted Audit Committee.',
  ],
};

// ---------------------------------------------------------------- Story in charts
const fyH = ['FY22', 'FY23', 'FY24', 'FY25', 'FY26'];
const qs = X.M.quarterly, ql = qs.labels;
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: 'EBITDA per tonne: ₹3,800 in bad years, ₹8,300+ in good ones', unit: 'Petroleum-segment EBITDA per tonne sold (₹)', x: [...fyH, ...F.years], series: [{ name: '₹ per tonne', values: [...fyH.map(f => EPT[f]), ...bld.map(r => r.ept)].map(Math.round), fmt: 'num' }], labels: 'all', source: 'AR FY22-26 segment notes, AR FY26 volumes; GAM estimates FY27-29E' },
      { type: 'column', title: 'Throughput guided to 90 MMT by FY29 as three expansions start', unit: 'Standalone refinery throughput (MMT)', x: ['FY22', 'FY23', 'FY24', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], series: [{ name: 'Throughput', values: [67.7, 72.4, 73.3, 71.6, 75.5, 77, 85, 90], fmt: 'n1' }], labels: 'all', source: 'AR FY26 five-year summary; Q1FY27 call (guidance)' },
    ] },
    { pair: [
      { type: 'column', title: 'Quarterly EBITDA: ₹24,800 cr in Q4FY26, ₹4,100 cr in Q1FY27', unit: 'EBITDA (₹ crore)', x: ql, series: [{ name: 'EBITDA', values: qs.ebitda, fmt: 'num' }], labels: 'all', source: 'Screener.in (consolidated)' },
      { type: 'line', title: 'Reported GRM: US$2-12 in FY25-26, US$15.6 in Q1FY27 (net of export duty)', unit: 'GRM (US$/bbl)', x: SG.grmQuarterly.labels.filter((_, i) => SG.grmQuarterly.values[i] != null), series: [{ name: 'GRM', values: SG.grmQuarterly.values.filter(v => v != null), fmt: 'n1' }], labels: 'all', min: 0, source: 'Prabhudas Lilladher (1-Aug-2026), company; Q4FY26 not disclosed' },
    ] },
    { pair: [
      { type: 'column', title: 'Net debt after all investments: ~₹54,000 cr', unit: 'Net debt (₹ crore)', x: ['Mar-24', 'Mar-25', 'Mar-26', 'FY27E', 'FY28E', 'FY29E'], series: [{ name: 'Net debt', values: [A.netDebt[A.labels.length - 3], A.netDebt[A.labels.length - 2], A.netDebt[A.labels.length - 1], ...F.treasury.map(t => -t)].map(Math.round), fmt: 'num' }], labels: 'all', source: 'Screener.in; GAM estimates (investments held at Mar-26 book)' },
      { type: 'line', title: `Forward core EV/EBITDA: ${n1(OWN.med)}x median, our ${MULT.base}x`, unit: 'EV less investments ÷ next year\'s EBITDA (x)', x: evRows.map(r => r.d), series: [{ name: 'Forward EV/EBITDA', values: evRows.map(r => Math.round(r.m * 100) / 100), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: OWN.med, text: `Median ${n1(OWN.med)}x` }, { v: MULT.base, text: `Our multiple: ${MULT.base}x`, color: '#cf8f1f' }], source: 'Screener.in prices and accounts; GAM estimates for FY27-28E EBITDA' },
    ] },
    { pair: [
      { type: 'hbar', title: `What makes up our ₹${n0(V.tp)} target (₹ per share)`, unit: '₹ per share', x: ['Petroleum products', 'Petrochemicals', 'Gas & other', 'FX / unallocated', 'Net debt (Sep-27E)', 'Listed stakes: revaluation', 'Minorities (CPCL)'], series: [{ name: '₹/share', values: ['Petroleum', 'Petrochem', 'Gas', 'Less: unalloc', 'Less: net debt', 'Listed', 'Less: minor'].map(nm => Math.round(ps(nm))), fmt: 'inr' }], labels: 'all', source: 'GAM Research' },
      { type: 'hbar', title: `Our ₹${n0(V.tp)} vs the street and the price`, unit: `₹ per share; CMP ₹${n0(price)}`, x: [...ST.map(s => `${s.broker} (${s.date.slice(5, 7) === '08' ? 'Aug' : 'May'})`), 'GAM (base)'], series: [{ name: 'Target', values: [...ST.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes and listings as cited in the street table; GAM Research' },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.petroleum, P3.other, P3.moat, p.financials, P4.quarter, p.capital, P4.quality, p.balance, P4.ownership(p.ownershipBase), P4.governance, P4.forecasts, P5.street, P5.valuation, P6.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
