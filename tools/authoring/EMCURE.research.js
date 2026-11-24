// Emcure report, part B: cover, the story in charts, and the merger of part2-6 (business, history, industry, tailwind
// test, India, Europe & Canada, rest of world, moat, Q1FY27, earnings quality, ownership, governance, forecasts, street,
// valuation, verdict, glossary, statement notes). Shared inputs in EMCURE.ctx.js. Forecast and valuation figures are live
// tokens ({{...}}) that follow assumptions.json. As of 30-Sep-2026.
const X = require('./EMCURE.ctx');
const { F, V, A, n0, n1, pc, SQ, QL, Q1, price, mv, MULT, epsU, epsSep, HB, k, SECTOR, rating, ST, lev, ndCo, YRS, fwdNow, trailPe, drW, PEER_SET, P, shortName, shortDate, byBase, epsRep, sectorCalc } = X;
const P2 = require('./EMCURE.part2'), P3 = require('./EMCURE.part3'), P4 = require('./EMCURE.part4'), P5 = require('./EMCURE.part5'), P5b = require('./EMCURE.part5b'), P6 = require('./EMCURE.part6');

const cover = {
  headline: `A science-led mid-cap whose growth now comes mostly from abroad: on the street's P/E method, with the multiple re-rated like the sector's, we see {{dcf.upside|chg}}`,
  lead: `Emcure (FY26 revenue ₹9,204 cr) is two businesses: a #13-ranked Indian branded franchise (44%; iron, chiral cardiac molecules, Tenectase, plus Sanofi, Novo Nordisk and Roche brands it distributes) and generics front ends in Europe and Canada with an ARV tender business in emerging markets (56%). Q1FY27 revenue rose ${Q1.revenueGrowthPct}% (international +${Q1.internationalGrowthPct}% with ~12pp from the rupee, India +${Q1.indiaGrowthPct}%), EBITDA 26% and profit 36%; Bain has exited and the subsidiaries are now wholly owned. We forecast EPS of ₹${n1(epsU[0])} / ${n1(epsU[1])} / ${n1(epsU[2])} for FY27-29E, ~5% below the bulls for FY28 because we assume no currency tailwind. Every broker that discloses a method uses **P/E**, and so do we: **${MULT.base}x Sep-28E EPS (₹${n1(epsSep)})**, i.e. Emcure's ${n1(HB.med)}x median forward P/E since Jan-2025 lifted ${SECTOR}% for the pharma sector's re-rating over the same window, gives **{{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}.** Cross-checks: EV/EBITDA ₹${n0(mv('ev').value)}; DCF ₹${n0(mv('dcf').value)}. Bull {{scen.bull.tp|inr}}; bear {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'Real chemistry, a few category leaders', p: 'Chiral cardiac molecules, the Orofer iron family (#1 in iron combinations), Tenectase (100% share) and the first EU generic of liposomal amphotericin B: ~50% of India revenue and ~30% of international revenue come from complex products, and 30-35% of India sales from in-house R&D. #2 in gynaecology. This is a better business than a #13 rank suggests.' },
    { h: 'But recent growth is borrowed or cyclical', p: `India grew ${Q1.indiaGrowthPct}% in Q1FY27, only 6-7% without the in-licensed Sanofi and Roche brands, after a Zuventus restructuring hit Q4FY26. International (+${Q1.internationalGrowthPct}%) carried the quarter on ARV tenders (two-thirds of rest of world) and a weaker rupee (6-7pp of group growth). Gross margin fell 340bp to ${Q1.grossMarginPct}% on that mix.` },
    { h: 'Cleaner structure, family control', p: `Bain sold its last shares in Jun-2026; Zuventus (₹725 cr) and Gennova (₹232 cr, from its CEO, ~₹1,924 cr implied for a ₹5 cr-profit company) are now 100% owned. The founder becomes Chairman too and his son COO. ₹276 cr of sales to the promoters' US company with ₹197 cr outstanding, and a pending ~2.8% promoter sale to meet the public-float rule, argue against a premium. Net debt ₹${n0(ndCo[0])} cr (0.6x EBITDA), ~nil by Mar-28E on our numbers.` },
    { h: 'Valuation: fair after the re-rating', p: `At ₹${n0(price)} the stock is ${n1(trailPe)}x trailing and ${n1(fwdNow)}x our FY28E EPS, against a ${n1(HB.med)}x forward median since Jan-2025: it has re-rated with the sector (trailing P/E ${pc(drW.EMCURE)} vs its own median; peers +${SECTOR}%). Our ${MULT.base}x sits inside the street's 24-30x. The DCF (₹${n0(mv('dcf').value)}) says cash flow, held back by working capital, does not support the price on its own.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'AMBER' },
    { k: 'Earnings momentum', v: 'GREEN' },
    { k: 'Competitive position', v: 'AMBER' },
    { k: 'Balance sheet', v: 'GREEN' },
    { k: 'Governance', v: 'AMBER' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): India growth vs the market (Zuventus), gross margin as Europe and ARV grow, net debt after the July payouts (~₹1,450 cr guided).',
    'Promoter sale or share issue to take public shareholding to 25% (~2.8% of equity; on our reading due by Jul-2027).',
    'Launches abroad: liposomal amphotericin B tenders across Europe, semaglutide in Canada (Dr. Reddy\'s supply in Quebec; own filing), lenacapavir registration (FY27).',
    'Poviztra traction after the Apr-2026 price cut and the Jul-2026 MASH approval; Roche and Sanofi diabetes brands in the base from Q2FY27.',
    'AR FY27 related-party note: the Avet receivable (₹197 cr at Mar-26) and the Gennova payment terms.',
  ],
};

// ---------------------------------------------------------------- Story in charts
const STREET_TP = ST.filter(s => s.tp);
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: 'Revenue: ₹2,580 cr in Q1FY27, +23%', unit: 'Revenue (₹ crore), quarterly', x: QL, series: [{ name: 'Revenue', values: SQ.map(q => q.consRev), fmt: 'num' }], labels: 'all', highlight: 'Q1FY27', source: 'Company investor presentations' },
      { type: 'stacked', title: 'International is 58% of revenue and rising', unit: 'Revenue by geography (₹ crore), quarterly; Q1-Q3 FY25 derived', x: QL, series: [{ name: 'India', values: SQ.map(q => q.india), fmt: 'num' }, { name: 'Europe', values: SQ.map(q => q.europe), fmt: 'num' }, { name: 'Canada', values: SQ.map(q => q.canada), fmt: 'num' }, { name: 'Rest of world', values: SQ.map(q => q.row), fmt: 'num' }], labels: 'none', source: 'Company decks; GAM' },
    ] },
    { pair: [
      { type: 'line', title: 'Gross margin down 340bp in a year; EBITDA margin still up', unit: 'Company basis (%), quarterly', x: QL.slice(3), series: [{ name: 'Gross margin', values: SQ.slice(3).map(q => q.grossMarginPct), fmt: 'pct' }, { name: 'EBITDA margin', values: SQ.slice(3).map(q => q.ebitdaMarginPct), fmt: 'pct' }], labels: 'all', min: 15, max: 65, source: 'Company decks; Motilal Oswal (Q2FY26)' },
      { type: 'column', title: 'EPS: +31% and +36%, then ~15-20% a year on our numbers', unit: 'EPS (₹); FY27-29E = GAM', x: ['FY24', 'FY25', 'FY26', ...YRS], series: [{ name: 'Reported / GAM', values: [epsRep[2024], epsRep[2025], epsRep[2026], ...epsU.map(v => Math.round(v * 10) / 10)], fmt: 'n1' }, { name: 'Before exceptional items', values: [Math.round((epsRep[2024] - X.EXC_AT[2024] / X.SHR[2024]) * 10) / 10, Math.round((epsRep[2025] - X.EXC_AT[2025] / X.SHR[2025]) * 10) / 10, Math.round(byBase[2026] * 10) / 10, ...epsU.map(v => Math.round(v * 10) / 10)], fmt: 'n1' }], labels: 'all', source: 'Screener.in; GAM Research' },
    ] },
    { pair: [
      { type: 'column', title: 'Net debt: cut by the IPO, raised by buyouts, ~nil by FY28E', unit: 'Net debt (₹ crore), company basis; FY27-29E = GAM', x: ['Mar-24', 'Mar-25', 'Mar-26', 'Jun-26', ...YRS], series: [{ name: 'Net debt', values: [1558, 434, 1054, 1103, ...ndCo.slice(1).map(Math.round)], fmt: 'num' }], labels: 'all', highlight: 'Jun-26', source: 'Company decks; GAM Research' },
      { type: 'column', title: 'Bain\'s stake: 8.7% to zero in fifteen months', unit: 'BC Investments IV (Bain Capital) holding (%)', x: ['Mar-25', 'Mar-26', 'Jun-26'], series: [{ name: 'Bain', values: [8.68, 3.87, 0], fmt: 'pct' }], labels: 'all', source: 'AR FY26 note 17; Outlook Business (25-Jun-2026)' },
    ] },
    { pair: [
      { type: 'hbar', title: `Pharma re-rated over Emcure's window (+${SECTOR}%); Emcure less so`, unit: 'Trailing P/E at the 30-Sep-2026 close vs median since 1-Jan-2025 (%)', x: [...[...PEER_SET].sort((a, c) => drW[c] - drW[a]).map(shortName), 'Emcure'], series: [{ name: 'vs median', values: [...[...PEER_SET].sort((a, c) => drW[c] - drW[a]).map(s => Math.round(drW[s] * 10) / 10), Math.round(drW.EMCURE * 10) / 10], fmt: 'pct' }], labels: 'all', highlight: 'Emcure', source: 'Screener.in P/E series; asof-peers.js' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (notes standing on 30-Sep-26)', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...STREET_TP.map(s => `${s.broker.replace(/ \(.*\)/, '')} (${shortDate(s.date)})`), 'GAM (base)'], series: [{ name: 'Target', values: [...STREET_TP.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes and summaries (Nov-2025 to Sep-2026); GAM Research' },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.india, P3.regulated, P3.row, P3.moat, p.financials, P4.guidance, p.capital, P4.quality, p.balance, P4.ownership(p.ownershipBase), P4.governance, P4.forecasts, P5.street, P5b.valuation, P5.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
