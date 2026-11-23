// TVS Motor report, part B: cover, the story in charts, and the merger of part2-6 (business, history, industry, tailwind
// test, domestic ICE, EV, exports & 3W, TVS Credit, Norton & subsidiaries, moat, Q1FY27, earnings quality, ownership,
// governance, forecasts, street, valuation, verdict, glossary, statement notes). Shared inputs in TVSMOTOR.ctx.js.
// Forecast and valuation figures are live tokens where the engine has them. As of 30-Sep-2026.
const X = require('./TVSMOTOR.ctx');
const { F, V, SC, C, D, SG, n0, n1, pc, price, EPS, FM, fwdNow, sectorDr, MULT, PB, SOTP, tcBook, stake, ST, medTp, rating, W, deal } = X;
const P2 = require('./TVSMOTOR.part2'), P3 = require('./TVSMOTOR.part3'), P4 = require('./TVSMOTOR.part4'), P5 = require('./TVSMOTOR.part5'), P6 = require('./TVSMOTOR.part6');
const B = SOTP.base;
const fwdSeries = require('./valuation-blend').forwardSeries('TVSMOTOR', X.M, 'eps').filter(x => x[0] >= '2016-04-01');

const cover = {
  headline: 'The best growth story in Indian two-wheelers, priced as if it can only get better',
  lead: `TVS Motor has nearly doubled its volumes in five years (3.05mn vehicles in FY21, 5.89mn in FY26), lifted its domestic two-wheeler share from ~17.6% (FY24) to ~19.6% (FY26), leads India's electric two-wheeler market (24.3% in FY26, 27.1% in Aug-2026) and grew exports 31% last year. Q1FY27 was its best quarter: revenue +38%, EBITDA margin 12.8% despite a 3.5% commodity hit, profit +51%. The street values TVS as the standalone auto business on P/E plus TVS Credit on book; so do we: **${MULT.base}x Sep-28E standalone EPS** (its own ${n1(FM.median)}x median one-year-forward P/E since 2021, cut by the ${n1(Math.abs(sectorDr))}% de-rating of auto peers) gives ₹${n0(B.standalone)}, TVS Credit at ${PB.base}x book adds ₹${n0(B.tvsCredit)} and the loss-making subsidiaries (Norton, the Swiss e-bike group) take off ₹${n0(-B.others)}. That is **{{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}.** At ₹${n0(price)} the stock trades at ${n1(fwdNow)}x our FY28E EPS, near the top of its history. Bull {{scen.bull.tp|inr}}; bear {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'The franchise is winning on every front that matters', p: `Domestic ICE two-wheelers grew 19% in FY26 against 9% for the industry and 21% vs 13% in Q1FY27; TVS sold more two-wheelers than Hero or Honda (domestic plus exports) in June and August 2026. iQube and Orbiter made it #1 in EVs; HLX motorcycles crossed 5mn units in Africa and LatAm. We forecast {{F.volume.0|mn}}mn vehicles in FY27E (+18%) and EPS of {{F.eps.0|inr}} / {{F.eps.1|inr}} / {{F.eps.2|inr}} for FY27-29E.` },
    { h: 'But it is still a 13% margin business, and the PLI ends in FY28', p: 'EBITDA margin has sat at 12.5-13.1% for six quarters, below Hero (14.9%) and far below Bajaj (20.8%) and Eicher (24.7%). Roughly 0.6-0.9% of revenue is a production-linked incentive that the scheme stops paying after March 2028; we take it out of FY29E. Commodity inflation of ~4% of revenue in H1FY27 was offset, not reversed.' },
    { h: 'The cash leaks into subsidiaries', p: `TVS put ~₹2,400 cr into subsidiaries in FY26 and guides ₹1,700-1,900 cr for FY27. Norton lost ₹723 cr and the Swiss e-bike group ₹417 cr in FY26; the subsidiaries other than TVS Credit lose ~₹1,300 cr a year (Q1FY27 run-rate unchanged). TVS Credit is the valuable one (ROE ~16%, July-2026 deal at ${n1(deal.pbTrail)}x book) and a separation is being explored; we value TVS Motor's ${n1(stake * 100)}% at ₹${n0(B.tvsCredit)} a share.` },
    { h: 'The price assumes the premium is permanent', p: `The street's 33-35x standalone P/E plus TVS Credit equals TVS Motor's own peak-period multiple, not its median. Our ${MULT.base}x needs no view on growth: it is the house method (median since 2021 × sector de-rating). Even the post-2023 median (${n1(W.since23)}x) would leave the stock overvalued. Street targets ₹${n0(Math.min(...ST.map(s => s.tp)))}-${n0(Math.max(...ST.map(s => s.tp)))} (median ₹${n0(medTp)}); ours is the lowest. Our DCF (₹${n0(V.blend.methods.find(m => m.key === 'dcf').value)}) and EV/EBITDA (₹${n0(V.blend.methods.find(m => m.key === 'ev').value)}) cross-checks bracket the target.` },
  ],
  keyRows: [['Vehicles sold (mn)', 'kpi.units', 'mn'], ['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['PAT (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE (standalone)', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'AMBER' }, { k: 'Predictability', v: 'AMBER' }, { k: 'Earnings momentum', v: 'GREEN' },
    { k: 'Competitive position', v: 'GREEN' }, { k: 'Capital allocation', v: 'RED' }, { k: 'Valuation', v: 'RED' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026) and festive retail (October-November 2026): the first test of demand against the post-GST base from Q3.',
    'TVS Credit separation: the chairman said at the July 2026 AGM that options including a separation are being evaluated "in stages"; TVS paid ₹711 cr for 4.39% on 27-Jul-2026.',
    'Norton: four models launched in Europe and India in Q1FY27, US entry due in summer FY27; any volume and loss disclosure.',
    'Capacity to 8.3mn two-wheelers and 0.42mn three-wheelers by Q4FY27; EV capacity 50k+ a month.',
    'Policy: PM E-DRIVE e-2W subsidy (₹5,000 cap) runs to Mar-2028; auto PLI ends Mar-2028; draft Delhi proposal to stop ICE two-wheeler sales from 2028.',
  ],
};

// ---------------------------------------------------------------- Story in charts
const S26 = C.subsidiariesFY26.rows.filter(r => !/Non-controlling|Others/.test(r[0]));
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: 'Volumes: 3.3mn (FY20) to 5.9mn (FY26), ~8.3mn by FY29E', unit: 'Vehicles sold, 2W + 3W incl. exports (mn); FY27-29E = GAM', x: 'fin.labels', from: 'FY20', series: [{ name: 'Vehicles', fn: "g('kpi.units')[i] / 1e6", fmt: 'n2', growth: true }], source: 'Company releases; GAM estimates' },
      { type: 'line', title: 'Share gains at home and leadership in EVs', unit: 'TVS share (%): domestic 2W (SIAM-based) and e-2W registrations (Vahan)', x: ['FY24', 'FY25', 'FY26', 'Apr-Aug 26'], series: [{ name: 'Domestic 2W', values: [17.56, 17.96, 19.56, null], fmt: 'pct' }, { name: 'Electric 2W', values: [null, 20.7, 24.3, 26.0], fmt: 'pct' }], labels: 'all', min: 10, max: 30, source: 'PwC/ACMA (FY24), company and AR FY26 (FY25-26 derived), Autocar Pro / Vahan' },
    ] },
    { pair: [
      { type: 'hbar', title: 'FY26 revenue: exports and EVs are a third', unit: 'Standalone revenue by source, FY26 (₹ crore)', x: ['Domestic ICE 2W, 3W & spares', 'Exports (2W + 3W)', 'Electric two-wheelers', 'Government incentives (PLI, export)'], series: [{ name: '₹ cr', values: [30016, 11280, 5000, 974], fmt: 'num' }], labels: 'all', source: 'FY26 earnings calls (IB and EV revenue); AR FY26 note 21; domestic = residual' },
      { type: 'line', title: 'Margin has been flat at ~13% for six quarters', unit: 'Quarterly EBITDA margin (%), standalone', x: 'Q.labels', series: [{ name: 'EBITDA margin', fn: "g('Q.ebitda')[i] / g('Q.sales')[i] * 100", fmt: 'pct' }], labels: 'all', min: 8, max: 16, source: 'Screener.in (Q4FY25 includes the full-year PLI)' },
    ] },
    { pair: [
      { type: 'hbar', title: 'FY26: TVS Credit earns, Norton and e-bikes burn', unit: 'Contribution to consolidated profit, FY26 (₹ crore)', x: S26.map(r => r[0].replace(/ \(.*\)/, '')), series: [{ name: '₹ cr', values: S26.map(r => Math.round(r[1])), fmt: 'num' }], labels: 'all', source: 'AR FY26 consolidated note 49' },
      { type: 'hbar', title: `Our sum of the parts: {{dcf.tp|inr}} vs ₹${n0(price)}`, unit: '₹ per share (base case)', x: [`Standalone ${MULT.base}x Sep-28E EPS`, `TVS Credit ${PB.base}x book × ${n1(stake * 100)}%`, 'Other subsidiaries (PV of losses)', 'Target price', 'Share price 30-Sep-2026'], series: [{ name: '₹', values: [Math.round(B.standalone), Math.round(B.tvsCredit), Math.round(B.others), V.tp, price], fmt: 'num' }], labels: 'all', highlight: 'Target price', source: 'GAM Research' },
    ] },
    { pair: [
      { type: 'line', title: `Forward P/E ${n1(fwdNow)}x vs a ${n1(FM.median)}x median since 2021`, unit: 'Price ÷ next full-year standalone EPS (x), weekly', x: fwdSeries.map(x => x[0]), series: [{ name: 'Forward P/E', values: fwdSeries.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 2, lines: [{ v: FM.median, text: `Median since Apr-2021: ${n1(FM.median)}x (our standalone multiple ${MULT.base}x)` }], source: 'Screener.in prices; actual EPS, GAM estimates for FY27-29E' },
      { type: 'hbar', title: 'Our target is the lowest on the street', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...ST.map(s => s.broker.replace(/ (Institutional Equities|Capital Markets|Global|Securities|Capital)$/, '')), 'GAM (base)'], series: [{ name: 'Target', values: [...ST.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', source: 'Broker notes dated 21-Jul to 24-Jul-2026 (see the street chapter), GAM Research' },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P3.tailwind, P3.domestic, P3.ev, P3.exports, P4.tvsCredit, P4.subsidiaries, P4.moat, p.financials, P5.q1, P5.earningsQuality, p.balance, P5.ownership(p.ownershipBase), P5.governance, P6.forecasts, P6.street, P6.valuation, P6.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
