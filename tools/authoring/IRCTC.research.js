// IRCTC report, part B: cover, the story in charts, and the merger of part2-6 (business, history, industry, tailwind test,
// ticketing, catering, tourism and Rail Neer, moat, Q1FY27, earnings quality, ownership, governance, forecasts, street,
// valuation, verdict, glossary, statement notes). Shared inputs in IRCTC.ctx.js; forecast and valuation figures are live
// tokens ({{...}}) that follow assumptions.json. As of 30-Sep-2026.
const X = require('./IRCTC.ctx');
const { F, V, SA, SQ, n0, n1, pc, price, mv, FM, MV, MULT, SENS, epsSep, at, rating, ST, medTp, segShare, sepNow, A26, Q1 } = X;
const P2 = require('./IRCTC.part2'), P3 = require('./IRCTC.part3'), P4 = require('./IRCTC.part4'), P5 = require('./IRCTC.part5'), P6 = require('./IRCTC.part6');
const L8 = SQ.slice(-8), yoy = (k, qq) => { const i = SQ.indexOf(qq); return i >= 4 ? Math.round((qq[k] / SQ[i - 4][k] - 1) * 1000) / 10 : null; };

const cover = {
  headline: 'A ticketing monopoly at 22x earnings: cheap against its own history, but growth now comes from low-margin catering and the owner sets the price',
  lead: `IRCTC is the Railways' 62.4%-government-owned sole online ticket seller (89% of reserved tickets), its mandated caterer, its bottled-water supplier (Rail Neer) and a pilgrimage-train operator. Q1FY27 revenue rose 18% on catering (+34%), but EBITDA fell 2.7% as ticketing stalled (+0.6%) and one-off costs hit. We forecast EPS of ₹${n1(F.eps[0])} / ₹${n1(F.eps[1])} / ₹${n1(F.eps[2])} for FY27-29E, 2-3% below PL (14-Aug-2026). The street values IRCTC on **P/E** (PL 35x FY28E; Choice 25x the FY28-29E average). On the house rule we start from its own one-year-forward P/E median since Apr-2021 (${n1(FM.median)}x) and apply the sector move of the only five comparable names with a five-year P/E history: the internet platforms brokers group it with (Info Edge, IndiaMART) and the railway-PSU service companies the market trades it with (Container Corp, RailTel, RITES), median ${pc(MV.all)}. **${MULT.base}x Sep-28E EPS of ₹${n1(epsSep.base)} = {{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}.** The peer set matters: with no sector move the value is ₹${n0(at(SENS.none))}, with the internet platforms' move alone (${pc(MV.net)}) ₹${n0(at(SENS.net))}, and the DCF (Ke 11.9%) gives only ₹${n0(mv('dcf').value)}. Bull {{scen.bull.tp|inr}}; bear {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'The ticketing monopoly is a cash machine that has stopped growing', p: `Internet ticketing earned ~${Math.round(A26.itEbitEx / A26.segEbitEx * 100)}% of segment profit in FY26 at an 82% margin on ₹1,536 cr of revenue. But revenue rose only 0.6% in Q1FY27: the convenience fee (₹10/₹20 per ticket on UPI) has not risen for about seven years, UPI is now 51% of tickets, and non-fee income fell 8% after ads were removed and agents curbed. Management targets ~7% growth; we assume 4% then 6%, with no fee rise.` },
    { h: 'Growth now comes from catering, at a tenth of the margin', p: `Catering grew 13% in FY26 and 34% in Q1FY27 (prepaid Vande Bharat trains, licence fees, e-catering, election specials) and is 53% of Q1 revenue, but earns a 9-12% segment margin; prepaid trains pay 5% GST without input credit. Tourism (+19% in FY26) and Rail Neer (capacity-bound) are also low-margin. So the EBITDA margin fell from 36% (FY23) to 32% (FY26) and 28% (Q1FY27); we expect ~29%.` },
    { h: 'The owner is also the regulator, the customer and a seller', p: 'The Railways set the convenience fee, catering prices and licence terms, owe IRCTC ₹1,882 cr, run a rival app front-end (RailOne) and in Oct-2021 ordered a 50% fee share (withdrawn the next day). The government plans a ~5% OFS in FY27 (merchant bankers appointed) and the CMD post has been on additional charge since Jul-2026.' },
    { h: 'Valuation: the price has de-rated to half its own history', p: `At ₹${n0(price)} IRCTC trades at ${n1(price / F.eps[0])}x FY27E and ${n1(sepNow)}x Sep-28E EPS, against a ${n1(FM.median)}x forward median since 2021; foreign funds cut their stake from 7.2% to 3.9% in six months. Platform peers de-rated as much (Info Edge ${pc(X.dr5.NAUKRI)}, IndiaMART ${pc(X.dr5.INDIAMART)} vs five-year medians). The DCF at ₹${n0(mv('dcf').value)} says today's price is not obviously cheap on cash flows: the upside is about sentiment and the multiple, not about earnings.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg']],
  flags: [
    { k: 'Accounting', v: 'GREEN' },
    { k: 'Predictability', v: 'AMBER' },
    { k: 'Earnings momentum', v: 'AMBER' },
    { k: 'Competitive position', v: 'GREEN' },
    { k: 'Policy & governance', v: 'AMBER' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): catering growth without election specials, ticketing margin with the disaster-recovery spend, Rail Neer resin costs.',
    'Government OFS of ~5% in FY27 (merchant bankers appointed; floor price and dates not announced by 30-Sep-2026): a supply overhang until it is done.',
    'Appointment of a regular CMD (charge held by the Director, Tourism & Marketing since Jul-2026).',
    'RBI decision on the iPay payment-aggregator licence (final application filed by the 4-Aug-2026 deadline; response expected within FY27) and the full launch of the new website.',
    'Any Ministry decision on the convenience fee (unchanged for about seven years) or catering tariffs (last raised in 2019, per an analyst): the largest swing factor in either direction.',
  ],
};

const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'stacked', title: 'Catering is now 46% of segment revenue, ticketing 29%', unit: 'Segment revenue (₹ crore)', x: SA.map(a => a.fy), series: [{ name: 'Catering', values: SA.map(a => Math.round(a.catRev)), fmt: 'num' }, { name: 'Internet ticketing', values: SA.map(a => Math.round(a.itRev)), fmt: 'num' }, { name: 'Tourism', values: SA.map(a => Math.round(a.tourRev)), fmt: 'num' }, { name: 'Rail Neer', values: SA.map(a => Math.round(a.rnRev)), fmt: 'num', color: '#7a8b99' }], minLabel: 300, source: 'Quarterly segment results (via PL Capital result updates), summed by year' },
      { type: 'column', title: 'But ticketing still makes three-quarters of the profit', unit: 'FY26 segment result before exceptional items (₹ crore)', x: ['Internet ticketing', 'Catering', 'Tourism', 'Rail Neer'], series: [{ name: 'Segment result', values: [A26.itEbitEx, A26.catEbitEx, A26.tourEbitEx, A26.rnEbitEx].map(Math.round), fmt: 'num' }], labels: 'all', source: 'Quarterly segment results; AR FY26 note 53 (exceptional items by segment)' },
    ] },
    { pair: [
      { type: 'line', title: 'Ticketing growth has stalled; catering has accelerated', unit: 'Revenue growth year on year (%)', x: L8.map(x => x.q), series: [{ name: 'Catering', values: L8.map(x => yoy('catRev', x)), fmt: 'pct' }, { name: 'Internet ticketing', values: L8.map(x => yoy('itRev', x)), fmt: 'pct' }], labels: 'last', source: 'Quarterly segment results' },
      { type: 'column', title: 'EBITDA margin: 34% a year ago, 28% in Q1FY27', unit: 'EBITDA margin (%)', x: X.M.quarterly.labels.slice(-8), series: [{ name: 'EBITDA margin', values: X.M.quarterly.ebitda.slice(-8).map((e, i) => Math.round(e / X.M.quarterly.sales.slice(-8)[i] * 1000) / 10), fmt: 'pct' }], labels: 'all', min: 20, source: 'Quarterly results as reported' },
    ] },
    { pair: [
      { type: 'column', title: 'Convenience fee +5%, non-fee income −8% in Q1FY27', unit: '₹ crore', x: ['Fee Q1FY26', 'Fee Q1FY27', 'Non-fee Q1FY26', 'Non-fee Q1FY27'], series: [{ name: 'Ticketing income', values: [Q1.kpi.convFeePrior, Q1.kpi.convFee, Q1.kpi.nonConvFeePrior, Q1.kpi.nonConvFee], fmt: 'num' }], labels: 'all', source: 'Q1FY27 call (13-Aug-2026)' },
      { type: 'column', title: `EPS growth slows to ~${Math.round(X.epsCagrFwd)}% a year (FY26-29E) from 11.5% (FY23-26)`, unit: 'EPS (₹)', x: ['FY23', 'FY24', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], series: [{ name: 'EPS', values: [12.57, 13.89, 16.44, 17.42, ...F.eps.map(e => Math.round(e * 10) / 10)], fmt: 'n1' }], labels: 'all', source: 'Screener.in; GAM estimates' },
    ] },
    { pair: [
      { type: 'line', title: `Forward P/E: ${n1(price / F.eps[1])}x FY28E now vs a ${n1(FM.median)}x median since 2021`, unit: 'Price ÷ next full-year EPS (x)', x: FM.series.map(x => x[0]), series: [{ name: 'Forward P/E', values: FM.series.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: MULT.base, text: `Our multiple: ${MULT.base}x`, color: '#cf8f1f' }, { v: SENS.none, text: `Own median: ${SENS.none}x` }], source: 'Screener.in prices; actual EPS, GAM estimates for FY27-28E' },
      { type: 'hbar', title: 'Our target vs the street and the sensitivities', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...ST.map(s => s.short), 'Street median', 'DCF', 'Internet move only', 'No sector move', 'GAM (base)'], series: [{ name: 'Value', values: [...ST.map(s => s.tp), medTp, Math.round(mv('dcf').value), at(SENS.net), at(SENS.none), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'PL and IDBI Capital (14-Aug-2026), Choice (22-Sep-2026); GAM Research' },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.ticketing, P3.catering, P3.others, P3.moat, p.financials, P4.guidance, p.capital, P4.quality, p.balance, P4.ownership(p.ownershipBase), P4.governance, P4.forecasts, P5.street, P5.valuation, P6.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
