// HPCL report, part B: cover, the story in charts, and the merger of part2-6 (business, history, industry, tailwind test,
// refining & marketing, JV refineries, moat, Q1FY27, earnings quality, ownership, governance, forecasts, street, valuation,
// verdict, glossary, statement notes). Shared inputs in HINDPETRO.ctx.js; forecast and valuation figures are live tokens.
const X = require('./HINDPETRO.ctx');
const { F, V, A, SG, EPT, bld, n0, n1, price, mv, OWN, MULT, sectorMv, rating, medTp, medPost, ebSep, fwdEvNow, fwdPe, SP, evKept, ST, FYH } = X;
const P2 = require('./HINDPETRO.part2'), P3 = require('./HINDPETRO.part3'), P4 = require('./HINDPETRO.part4'), P5 = require('./HINDPETRO.part5'), P6 = require('./HINDPETRO.part6');
const ps = name => SP.find(p => p.name.startsWith(name))?.perShare || 0;
const bvps = A.bvps[A.labels.length - 1];

const cover = {
  headline: 'The most marketing-heavy OMC, priced for a normal year: SELL',
  lead: `HPCL refines ~26 MMT a year but sells ~51 MMT through 25,098 fuel stations and India's second-largest LPG network, so it gains most when retail prices are generous and loses most when the Government holds them. It earned ₹18,047 cr in FY26, then lost ₹12,265 cr in Q1FY27 as crude passed US$100/bbl. At ₹${n1(price)} the stock is ${n1(fwdPe)}x our FY28E EPS of ₹${n1(F.eps[1])} and ${n1(price / bvps)}x book, and ${n1(fwdEvNow)}x FY28E EBITDA after taking out its investments: about what its own history pays (median ${n1(OWN.med)}x since Apr-2021, trough years left out), while oil marketers and refiners trade ${Math.abs(sectorMv).toFixed(1)}% below their five-year medians. On ${MULT.base}x Sep-28E EBITDA of ₹${n0(ebSep)} cr, less net debt, plus MRPL and Oil India at market less 20% and the HRRL loan, we get **{{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}.** The street (median ₹${n0(medTp)}; ₹${n0(medPost)} after Q1) uses 6x standalone EBITDA. Bull {{scen.bull.tp|inr}}; bear {{scen.bear.tp|inr}}: debt makes the equity a geared bet on margins.`,
  arguments: [
    { h: 'A marketing company with refineries attached', p: `HPCL's own refineries cover only about half of its sales; the rest comes from its JV refineries (HMEL, MRPL, now HRRL) and other refiners. EBITDA per tonne sold was −₹${n0(-EPT.FY23)} in FY23, ₹${n0(EPT.FY25)} in FY25 and ₹${n0(EPT.FY26)} in FY26: a range set by Delhi's pricing and global cracks, not by HPCL. Q1FY27 marketing under-recoveries topped ₹26,000 cr. We forecast ₹700/t in FY27E and ₹4,300-4,500/t after, the FY22-26 average without the FY23 loss year.` },
    { h: 'HRRL is finally running, but it is a geared bet', p: `The 9 MMTPA Barmer refinery-cum-petrochemical complex started commercial operation in end-June/July 2026, ~4 years late, at ₹79,459 cr (from ₹43,129 cr). HPCL owns 74% and has put in ₹${n0(X.hrrlInvested)} cr; HRRL's ~₹53,000 cr of debt is off HPCL's balance sheet. We carry it at book (₹${n0(X.HR.carrying + X.HR.subDebt)} cr, ~₹${n0((X.HR.carrying + X.HR.subDebt) / X.shares)} a share); the street ranges from nothing (BOB, Emkay) to 0.8x invested (MOSL).` },
    { h: 'The balance sheet swings with crude', p: `Net debt after counting every investment fell to ~₹27,800 cr at Mar-26, then gross debt jumped ₹25,000 cr to ₹72,600 cr in Q1FY27. A ₹16,410 cr negative LPG buffer is not on the balance sheet. With ~₹${n0(-F.treasury[0])} cr of net debt at Mar-27E against a market value of ₹${n0(X.mcap)} cr, each 0.5x on the multiple moves the value by ~₹${n0(0.5 * ebSep / X.shares)} a share.` },
    { h: 'Valuation: we follow the street\'s method, not its multiple', p: `The street pays 6x standalone EBITDA plus investments. HPCL's own history says the market pays ~${n1(OWN.med)}x for the business once investments are taken out (${n1(X.grossMed)}x if they are left in), and the sector trades below its averages. ${MULT.base}x gives {{dcf.tp|inr}}. Cross-checks: P/E ₹${n0(mv('pe').value)}; DCF ₹${n0(mv('dcf').value)} (only if a 4% EBITDA margin held for a decade without another squeeze).` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting (inventory losses, LPG buffer off balance sheet)', v: 'AMBER' },
    { k: 'Governance (1 independent director; state pricing)', v: 'RED' },
    { k: 'Earnings momentum', v: 'RED' },
    { k: 'Competitive position', v: 'AMBER' },
    { k: 'Valuation (vs own history)', v: 'AMBER' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): marketing margins after the price rises, LPG losses (~₹490/cylinder in July), inventory effects, debt after the Q1 jump.',
    'HRRL ramp-up: ~50-60% in Q2FY27, 80-85% in Q3, full refinery capacity in Q4FY27; petrochemicals by end-FY27.',
    'Stable running of the Vizag residue upgrade (expected Q2-Q3FY27; ~US$2.5/bbl on Vizag\'s GRM per BOB).',
    'Government decisions: retail prices, SAED and export duties, compensation for the ₹16,410 cr negative LPG buffer.',
    'Crude and the Strait of Hormuz: each US$10/bbl moves HPCL\'s working capital and its marketing margin.',
  ],
};

// ---------------------------------------------------------------- Story in charts
const qs = SG.quarterly;
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: 'EBITDA per tonne sold: −₹1,655 to +₹5,956 in five years', unit: 'Consolidated EBITDA per tonne of market sales (₹)', x: [...FYH, ...F.years], series: [{ name: '₹ per tonne', values: [...FYH.map(f => EPT[f]), ...bld.map(r => r.ept)].map(Math.round), fmt: 'num' }], labels: 'all', source: 'Screener.in (EBITDA), AR FY26 (volumes); GAM estimates FY27-29E' },
      { type: 'column', title: 'HPCL sells about twice what it refines', unit: 'MMT', x: FYH, series: [{ name: 'Market sales incl. exports', values: FYH.map(f => X.yr(f).dpVol), fmt: 'n1' }, { name: 'Own refinery throughput', values: FYH.map(f => X.yr(f).throughput), fmt: 'n1' }], labels: 'all', source: 'AR FY26 performance profile' },
    ] },
    { pair: [
      { type: 'column', title: 'Quarterly EBITDA: ₹9,211 cr in Q4FY26, −₹16,122 cr in Q1FY27', unit: 'EBITDA (₹ crore)', x: qs.map(q => q.q), series: [{ name: 'EBITDA', values: qs.map(q => q.ebitda), fmt: 'num' }], labels: 'all', source: 'Screener.in (consolidated)' },
      { type: 'line', title: 'Refining margins boomed in the war: GRM US$23.8 in Q1FY27', unit: 'Reported GRM (US$/bbl)', x: qs.map(q => q.q), series: [{ name: 'GRM', values: qs.map(q => q.grm), fmt: 'n1' }], labels: 'all', min: 0, source: 'Prabhudas Lilladher (24-Jul-2026, Exhibit 3), company; Q1FY27 before the export duty' },
    ] },
    { pair: [
      { type: 'column', title: 'Net debt after investments: ~₹27,800 cr at Mar-26', unit: 'Net debt (₹ crore)', x: ['Mar-24', 'Mar-25', 'Mar-26', 'FY27E', 'FY28E', 'FY29E'], series: [{ name: 'Net debt', values: [A.netDebt[A.labels.length - 3], A.netDebt[A.labels.length - 2], A.netDebt[A.labels.length - 1], ...F.treasury.map(t => -t)].map(Math.round), fmt: 'num' }], labels: 'all', source: 'Screener.in; GAM estimates (investments held at Mar-26 book). Gross debt was ₹72,600 cr at Jun-26.' },
      { type: 'line', title: `Forward core EV/EBITDA: ${n1(OWN.med)}x median, our ${MULT.base}x`, unit: 'EV less investments ÷ next year\'s EBITDA (x); trough years left out', x: evKept.map(r => r.d), series: [{ name: 'Forward EV/EBITDA', values: evKept.map(r => Math.round(r.m * 100) / 100), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: OWN.med, text: `Median ${n1(OWN.med)}x` }, { v: MULT.base, text: `Our multiple: ${MULT.base}x`, color: '#cf8f1f' }], source: 'Screener.in prices and accounts; GAM estimates for FY28E EBITDA. Weeks pricing FY23 (loss) and FY27E (trough) left out' },
    ] },
    { pair: [
      { type: 'hbar', title: `What makes up our ₹${n0(V.tp)} target (₹ per share)`, unit: '₹ per share', x: ['Refining & marketing', 'Net debt (Sep-27E)', 'MRPL, Oil India: revaluation', 'HRRL loan'], series: [{ name: '₹/share', values: ['Refining', 'Less: net debt', 'Listed', 'HRRL'].map(nm => Math.round(ps(nm))), fmt: 'inr' }], labels: 'all', source: 'GAM Research. HRRL, HMEL and other JV equity (₹22,897 cr at book) sit inside net debt.' },
      { type: 'hbar', title: `Our ₹${n0(V.tp)} vs the street and the price`, unit: `₹ per share; CMP ₹${n0(price)}`, x: [...ST.map(s => `${s.broker.replace(' Institutional Equities', '').replace(' Capital Markets', '').replace(' BNP Paribas', '')} (${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'][+s.date.slice(5, 7) - 1]})`), 'GAM (base)'], series: [{ name: 'Target', values: [...ST.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes and listings as cited in the street table; GAM Research' },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.refmkt, P3.jv, P3.moat, p.financials, P4.quarter, p.capital, P4.quality, p.balance, P4.ownership(p.ownershipBase), P4.governance, P4.forecasts, P5.street, P5.valuation, P6.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
