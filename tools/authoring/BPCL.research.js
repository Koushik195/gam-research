// Bharat Petroleum report, part B: cover, the story in charts, and the merger of part2-6 (business, history, industry,
// tailwind test, downstream, upstream & projects, moat, Q1FY27, earnings quality, ownership, governance, forecasts,
// street, valuation, verdict, glossary, statement notes). Shared inputs in BPCL.ctx.js; forecast and valuation figures
// are live tokens ({{...}}) that follow assumptions.json.
const X = require('./BPCL.ctx');
const { F, V, A, SG, EPT, FYH, bld, n0, n1, price, mv, OWN, MULT, sectorMv, rating, medTp, medPost, ebSep, fwdEvNow, fwdPe, SP, evRows, ST, epInv, shares } = X;
const P2 = require('./BPCL.part2'), P3 = require('./BPCL.part3'), P4 = require('./BPCL.part4'), P5 = require('./BPCL.part5'), P6 = require('./BPCL.part6');
const ps = name => SP.find(p => p.name.startsWith(name))?.perShare || 0;
const mon = d => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+d.slice(5, 7) - 1];

const cover = {
  headline: 'The best refiner of the three, priced for it: HOLD',
  lead: `Bharat Petroleum runs three complex refineries (35.3 MMTPA, 116% utilised) and sells 27% of PSU fuel through India's most productive pump network. It earned ₹25,843 cr in FY26, then lost ₹1,873 cr in Q1FY27 (₹3,962 cr standalone) as crude hit US$100/bbl and retail prices lagged. Its own one-year-forward EV/EBITDA (after taking out its investments) has a median of ${n1(OWN.med)}x since Apr-2021, and oil marketers and refiners trade ${Math.abs(sectorMv).toFixed(1)}% below their five-year medians. On ${MULT.base}x Sep-28E downstream EBITDA of ₹${n0(ebSep)} cr, less net debt, plus BPRL's upstream at invested value and the Petronet, IGL and Oil India stakes at market less 20%, we get **{{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}.** The street (median ₹${n0(medTp)}; ₹${n0(medPost)} for the four notes after Q1) uses 5.5-6.5x. Bull {{scen.bull.tp|inr}}; bear {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'Earnings are a policy variable', p: `Downstream EBITDA per tonne sold in India was ₹2,260 in FY23 and ₹8,640 in FY24. The difference was not volume or efficiency but whether retail prices kept up with crude and how wide refining cracks were. In Q1FY27 BPCL's refineries earned US$41.4/bbl before the special export duty (US$17.0 after it), yet the group lost money because marketing lost ~₹5.4/litre. We forecast ₹3,600/t in FY27E and ₹5,400-5,500/t after, a little below the FY22-26 average of ₹${n0(X.eptAvg)}.` },
    { h: 'A better refiner and retailer than its peers', p: 'Mumbai, Kochi and Bina have Nelson complexity of 9.8-11.8, run 116% of nameplate and process 76% high-sulphur crude; BPCL\'s GRM has beaten Singapore\'s for four years (US$11.74 in FY26) and Bina earned US$56/bbl in Q1. Its pumps sell 139 KL a month each, the most of the three PSU marketers. That is why it has usually traded at a higher multiple than IOC.' },
    { h: 'From cash machine to builder again', p: `Net debt was only ~₹6,500 cr at Mar-26 after counting investments. Now ~₹1.7 lakh cr of capex is planned to FY29 (Bina petchem ₹49,800 cr, Mumbai PRFCC, Kochi polypropylene, Brazil and Mozambique upstream, CGD), with an Andhra refinery (~₹95,000 cr) in pre-project work. Free cash flow turns negative: ₹${F.fcf.map(v => (v < 0 ? '−' : '') + n0(Math.abs(v))).join(' / ')} cr in FY27-29E on our numbers.` },
    { h: 'Valuation: the street\'s method, a derived multiple', p: `The street adds investments to 5.5-6.5x EBITDA. BPCL's own history says the market pays ~${n1(OWN.med)}x for the operating business once investments are taken out (${n1(X.grossMed)}x if they are left in), and the sector trades below its averages. ${MULT.base}x gives {{dcf.tp|inr}}, of which ₹${n0(epInv / shares)} a share is upstream at book; the stock at ₹${n0(price)} prices ~${n1(fwdEvNow)}x FY28E core EBITDA. Cross-checks: P/E ₹${n0(mv('pe').value)}, DCF ₹${n0(mv('dcf').value)}.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting (inventory gains, LPG compensation timing, one-off FCTR gain)', v: 'AMBER' },
    { k: 'Governance (no independent directors; state pricing)', v: 'RED' },
    { k: 'Earnings momentum', v: 'AMBER' },
    { k: 'Competitive position', v: 'GREEN' },
    { k: 'Valuation (vs own history)', v: 'AMBER' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): marketing margins after the May-June price rises, LPG under-recovery (~₹210/cylinder expected for August), GRM net of the export duty, debt after the Q1 jump.',
    'Government decisions: retail prices, SAED and export duties, compensation for the ₹15,804 cr negative LPG buffer (the ₹7,594 cr package ends in Oct-2026).',
    'Projects: Bina petchem and refinery expansion (30.7% complete; 2028), Kochi polypropylene (May-2028), Mozambique LNG first cargo (mid-2028), Andhra refinery decision.',
    'Crude and the Strait of Hormuz: each US$10/bbl moves BPCL\'s working capital and marketing margin.',
    'Board appointments: independent directors and a reconstituted Audit Committee.',
  ],
};

// ---------------------------------------------------------------- Story in charts
const qs = X.M.quarterly, ql = qs.labels;
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: 'EBITDA per tonne: ₹2,300 in a bad year, ₹8,600 in a good one', unit: 'Downstream EBITDA per tonne of domestic sales (₹)', x: [...FYH, ...F.years], series: [{ name: '₹ per tonne', values: [...FYH.map(f => EPT[f]), ...bld.map(r => r.ept)].map(Math.round), fmt: 'num' }], labels: 'all', source: 'AR FY22/FY24/FY26 segment notes; July-2026 presentation (volumes); GAM estimates FY27-29E' },
      { type: 'column', title: 'GRM: US$4-20/bbl over six years', unit: 'Reported GRM (US$/bbl)', x: ['FY21', ...FYH], series: [{ name: 'GRM', values: [4.1, ...FYH.map(f => X.yr(f).grm)], fmt: 'n1' }], labels: 'all', source: 'BPCL July-2026 presentation (p28); Q1FY27 handout' },
    ] },
    { pair: [
      { type: 'column', title: 'Quarterly EBITDA: ₹9,600 cr in Q4FY26, −₹4,055 cr in Q1FY27', unit: 'EBITDA (₹ crore)', x: ql, series: [{ name: 'EBITDA', values: qs.ebitda, fmt: 'num' }], labels: 'all', source: 'Screener.in (consolidated)' },
      { type: 'line', title: 'Quarterly GRM: US$17-18 in the last two quarters (net of export duty in Q1FY27)', unit: 'GRM (US$/bbl)', x: SG.grmQuarterly.labels, series: [{ name: 'GRM', values: SG.grmQuarterly.values, fmt: 'n1' }], labels: 'all', min: 0, source: 'BPCL handouts; JM Financial (20-May-2026) for Q2-Q4FY25, Q2-Q3FY26; PL for Q1FY27 net' },
    ] },
    { pair: [
      { type: 'column', title: 'Net debt after investments: ~₹6,500 cr, rising with capex', unit: 'Net debt (₹ crore)', x: ['Mar-24', 'Mar-25', 'Mar-26', 'FY27E', 'FY28E', 'FY29E'], series: [{ name: 'Net debt', values: [A.netDebt[A.labels.length - 3], A.netDebt[A.labels.length - 2], A.netDebt[A.labels.length - 1], ...F.treasury.map(t => -t)].map(Math.round), fmt: 'num' }], labels: 'all', source: 'Screener.in; GAM estimates (investments held at Mar-26 book)' },
      { type: 'line', title: `Forward core EV/EBITDA: ${n1(OWN.med)}x median, our ${MULT.base}x`, unit: 'EV less investments ÷ next year\'s EBITDA (x)', x: evRows.map(r => r.d), series: [{ name: 'Forward EV/EBITDA', values: evRows.map(r => Math.round(r.m * 100) / 100), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: OWN.med, text: `Median ${n1(OWN.med)}x` }, { v: MULT.base, text: `Our multiple: ${MULT.base}x`, color: '#cf8f1f' }], source: 'Screener.in prices and accounts; GAM estimates for FY27-28E EBITDA' },
    ] },
    { pair: [
      { type: 'hbar', title: `What makes up our ₹${n0(V.tp)} target (₹ per share)`, unit: '₹ per share', x: ['Downstream', 'E&P at invested value', 'Net debt (Sep-27E)', 'Listed stakes: revaluation'], series: [{ name: '₹/share', values: ['Downstream', 'E&P', 'Less: net debt', 'Listed'].map(nm => Math.round(ps(nm))), fmt: 'inr' }], labels: 'all', source: 'GAM Research' },
      { type: 'hbar', title: `Our ₹${n0(V.tp)} vs the street and the price`, unit: `₹ per share; CMP ₹${n0(price)}`, x: [...ST.map(s => `${s.broker} (${mon(s.date)})`), 'GAM (base)'], series: [{ name: 'Target', values: [...ST.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes and listings as cited in the street table; GAM Research' },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.downstream, P3.upstream, P3.moat, p.financials, P4.quarter, p.capital, P4.quality, p.balance, P4.ownership(p.ownershipBase), P4.governance, P4.forecasts, P5.street, P5.valuation, P6.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
