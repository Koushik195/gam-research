// TBO Tek report, part B: cover, the story in charts, and the merger of part2-6 (business, history, industry, tailwind test,
// hotels, Classic Vacations, air and operating leverage, moat, Q1FY27, earnings quality, ownership, governance, forecasts,
// street, valuation, verdict, glossary, statement notes). Shared inputs in TBOTEK.ctx.js; forecast and valuation figures
// are live tokens ({{...}}) that follow assumptions.json. As of 30-Sep-2026.
const X = require('./TBOTEK.ctx');
const { F, V, SQ, A26, Q1, n0, n1, pc, price, mv, PE12, MV, MULT, SENS, epsSep, at, rating, ST, medTp, sepNow, fwdNow, fwdPe, ebitdaToGp, gp } = X;
const P2 = require('./TBOTEK.part2'), P3 = require('./TBOTEK.part3'), P4 = require('./TBOTEK.part4'), P5 = require('./TBOTEK.part5'), P6 = require('./TBOTEK.part6');
const QS = SQ.map(x => x.q);

const cover = {
  headline: `A global hotel platform whose costs have stopped outrunning its gross profit; at ${Math.round(sepNow)}x Sep-28E EPS the price already assumes the Middle East heals`,
  lead: `TBO Tek is a B2B travel wholesaler: ~159,000 agents in 100+ countries book hotels, air and ancillaries on TBO.com, and since Oct-2025 its Classic Vacations unit sells US luxury travel through ~10,000 advisors. Q1FY27 GTV rose 37% (organic +15% in constant currency) and EBITDA 84%, as organic SG&A grew only 4% in constant currency. We forecast EPS of ₹${n1(F.eps[0])} / ₹${n1(F.eps[1])} / ₹${n1(F.eps[2])} for FY27-29E, below the street in FY27-28E because we assume a slow Middle East recovery. The street values TBO on **P/E** (MOSL 35x and Anand Rathi 40x FY28E; Choice 35x FY28-29E). TBO listed in May-2024, so we start from its one-year-forward P/E median over the twelve months to 30-Sep-2026 (${n1(PE12.med)}x) and apply the same-window move of a widened travel + internet peer set (IRCTC, Thomas Cook, Info Edge, IndiaMART: ${pc(MV.set)}). **${MULT.base}x Sep-28E EPS of ₹${n1(epsSep.base)} = {{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}.** With no sector move the value is ₹${n0(at(SENS.none))}; on the longer post-IPO window ₹${n0(at(SENS.postIpo))}; the DCF gives ₹${n0(mv('dcf').value)}. Bull {{scen.bull.tp|inr}}; bear {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'A real platform, now mostly international hotels', p: `Hotels, ancillaries and Classic Vacations made ~${n0((A26.hotGp + A26.cvGp) / A26.gp * 100)}% of FY26 gross profit; agents outside India made 64% of Q1FY27 GTV and 89% of gross profit. Europe (+24% CC) and APAC (+41% CC) grew strongly enough to offset a flat Middle East: the diversification works.` },
    { h: 'Operating leverage has arrived, but it is the whole bull case', p: `Organic EBITDA/GP rose from 23.5% (Q4FY26) to 27.5% (Q1FY27) as the KAM hiring cycle ended. We take group EBITDA/GP from 22.6% (FY26) to ${ebitdaToGp.map(n1).join('% / ')}% (FY27-29E), so EBITDA grows ~37% a year on ~20% gross-profit growth. Scaled peers earn 45-60% of GP, so there is room, but management has said it may restart investment.` },
    { h: 'Reported growth flatters the trend', p: 'The rupee added ~11 points to Q1FY27 hotel GTV growth; Classic Vacations added most of the rest. Organic GTV grew +15% in constant currency and organic hotel GP/GTV fell as TBO cut prices to hold Middle East volume. Classic Vacations\' own growth and synergies are "a few quarters away".' },
    { h: `Valuation: fair, not cheap`, p: `At ₹${n0(price)} TBO trades at ${n1(price / F.eps[0])}x FY27E, ${n1(fwdNow)}x FY28E and ${n1(sepNow)}x Sep-28E EPS, against a ${n1(PE12.med)}x forward median over the past year; the four peers are ${n0(Math.abs(MV.set))}% below their own medians. The street median target is ₹${n0(medTp)}; it is higher mainly because street FY27E EPS is 15-29% above ours. Pre-IPO funds still hold 22%.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'AMBER' },
    { k: 'Earnings momentum', v: 'GREEN' },
    { k: 'Competitive position', v: 'AMBER' },
    { k: 'Governance', v: 'GREEN' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): organic growth in the seasonal peak, hotel GP/GTV recovery, Classic Vacations in its weakest quarter.',
    'Middle East travel: agent activity was back to Jan-2026 levels by Jun-2026, but management "has given up on predicting" the region.',
    'Classic Vacations platform migration (targeted by end-CY2026) and the start of two-way cross-selling.',
    'Acquisition-loan repayment from Q3FY27 (USD 70 mn over four years) and any further acquisition.',
    'Block sales by pre-IPO funds (General Atlantic 14.4%, Augusta 5.1%, TBO Korea 2.9% in Jun-2026).',
  ],
};

const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'stacked', title: 'Gross profit by business: hotels dominate, Classic Vacations now ~30%', unit: 'Gross profit (₹ crore)', x: QS, series: [{ name: 'Hotels, ancillary & others', values: SQ.map(x => Math.round(x.hotGp)), fmt: 'num' }, { name: 'Classic Vacations', values: SQ.map(x => Math.round(x.cvGp || 0)), fmt: 'num' }, { name: 'Airlines', values: SQ.map(x => Math.round(x.airGp)), fmt: 'num' }], minLabel: 30, source: 'Shareholders\' letters and decks (Q2FY26 split estimated)' },
      { type: 'stacked', title: 'GTV: +37% in Q1FY27, but organic +22% (+15% in constant currency)', unit: 'GTV (₹ crore)', x: QS, series: [{ name: 'Organic', values: SQ.map(x => Math.round(x.airGtv + x.hotGtv)), fmt: 'num' }, { name: 'Classic Vacations', values: SQ.map(x => Math.round(x.cvGtv || 0)), fmt: 'num' }], minLabel: 500, source: 'Shareholders\' letters and decks' },
    ] },
    { pair: [
      { type: 'line', title: 'Organic SG&A growth has fallen from ~29% to 12% (4% CC)', unit: 'Organic SG&A growth, year on year (%)', x: ['Q2FY25', 'Q3FY25', 'Q4FY25', 'Q1FY26', 'Q2FY26', 'Q3FY26', 'Q4FY26', 'Q1FY27'], series: [{ name: 'SG&A growth', values: [29, 27, 25, 23, 22, 20, 18, 13], fmt: 'pct0' }], labels: 'all', source: 'Q1FY27 shareholders\' letter' },
      { type: 'column', title: `EBITDA ÷ gross profit: 22.6% in FY26, ${n1(ebitdaToGp[2])}% by FY29E in our model`, unit: 'EBITDA ÷ gross profit (%)', x: ['FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], series: [{ name: 'EBITDA/GP', values: [25.2, 22.6, ...ebitdaToGp.map(v => Math.round(v * 10) / 10)], fmt: 'pct' }], labels: 'all', source: 'AR FY26 (FY25 EBITDA ₹300.9 cr on GP ₹1,193.5 cr); GAM estimates' },
    ] },
    { pair: [
      { type: 'line', title: 'Organic hotel GP/GTV dipped to 5.3% as the Middle East shrank', unit: 'Gross profit ÷ GTV (%)', x: QS, series: [{ name: 'Hotels, ancillary & others', values: SQ.map(x => Math.round(x.hotGp / x.hotGtv * 1000) / 10), fmt: 'n1' }], labels: 'all', min: 4.5, max: 6.5, source: 'Shareholders\' letters and decks' },
      { type: 'column', title: `EPS: ₹22.5 (FY26) to ₹${n1(F.eps[2])} (FY29E)`, unit: 'EPS (₹)', x: ['FY23', 'FY24', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], series: [{ name: 'EPS', values: [13.84, 19.39, 21.17, 22.5, ...F.eps.map(e => Math.round(e * 10) / 10)], fmt: 'n1' }], labels: 'all', source: 'Screener.in; GAM estimates' },
    ] },
    { pair: [
      { type: 'line', title: `Forward P/E since listing: ${n1(fwdNow)}x FY28E now, ${n1(PE12.med)}x 12-month median`, unit: 'Price ÷ next full-year EPS (x)', x: fwdPe.map(x => x[0]), series: [{ name: 'Forward P/E', values: fwdPe.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: MULT.base, text: `Our multiple: ${MULT.base}x`, color: '#cf8f1f' }, { v: SENS.none, text: `12-month median: ${SENS.none}x` }], source: 'Screener.in weekly prices; actual EPS FY25-26, GAM estimates FY27-28E' },
      { type: 'hbar', title: 'Our target vs the street and the sensitivities', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...ST.map(s => s.short), 'Street median', 'DCF', 'Since Nov-2024', 'No sector move', 'GAM (base)'], series: [{ name: 'Value', values: [...ST.map(s => s.tp), medTp, Math.round(mv('dcf').value), at(SENS.postIpo), at(SENS.none), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'MOSL, Anand Rathi, I-Sec (30-Jul-2026), Choice (22-Sep-2026); GAM Research' },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.hotels, P3.classic, P3.air, P3.moat, p.financials, P4.guidance, p.capital, P4.quality, p.balance, P4.ownership(p.ownershipBase), P4.governance, P4.forecasts, P5.street, P5.valuation, P6.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
