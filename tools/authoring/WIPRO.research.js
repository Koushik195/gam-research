// Wipro report, part B: cover, story in charts, and the merger of part2-4 (business, history, industry, the AI
// question, tailwind test, SMUs, deals & people, moat, Q1FY27, earnings quality, ownership, governance, forecasts,
// street, valuation, verdict, glossary, statement notes). Shared inputs in WIPRO.ctx.js. Forecast and valuation
// figures are live tokens ({{...}}) that follow assumptions.json. As of 30-Sep-2026.
const X = require('./WIPRO.ctx');
const { F, V, n0, n1, pc, QR, Q1, price, mv, epsSep28, peMult, FM, fwdPe, rating, b, sectorDr, D, usdGrowth, impliedG } = X;
const P2 = require('./WIPRO.part2'), P3 = require('./WIPRO.part3'), P4 = require('./WIPRO.part4');
const G = D.peers.q1fy27YoyPct;
const dy = F.dps[0] / price * 100;

const cover = {
  headline: 'No turnaround yet, but priced for permanent decline: 11x earnings, a 5% yield and net cash',
  lead: `Wipro is India's fourth-largest IT services company ($10.5 bn of revenue, ~243,000 staff), controlled by the Premji family (72.6%). Its constant-currency revenue fell in each of the last three years (−4.4%, −2.3%, −1.6%), Q1FY27 grew only 0.9% with two acquisitions included, and the Q2 guide (−1.5% to +0.5% QoQ) implies organic decline; the IT Services margin slipped to 16.0%, below the 17-17.5% band management wants back. In June Wipro bought back 6% of its shares at ₹250; by ${X.ASOF_TXT} the stock was ₹${n1(price)}, down ~40% in 2026 with the whole sector on fears that AI shrinks traditional IT work, and it left the Nifty 50 that day. The street values Wipro on **P/E (10-15x FY28E EPS)**. We forecast EPS of ₹${n1(F.eps[0])} in FY27E and ₹${n1(F.eps[1])} in FY28E, a little below the street. Applying **${peMult}x to Sep-28E EPS of ₹${n1(epsSep28)}** gives **{{dcf.tp|inr}} ({{dcf.upside|chg}})**: **we initiate with ${rating}**, on valuation and yield, not on a turnaround. Cross-checks: EV/EBITDA ₹${n0(mv('ev').value)}, DCF ₹${n0(mv('dcf').value)}. Bull case {{scen.bull.tp|inr}}; bear case {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'No turnaround yet', p: `Dollar revenue has fallen from $11.23 bn (FY23) to $10.48 bn (FY26). We forecast ${n1(usdGrowth[0])}% in FY27E even with ~3 pp from DTS and Mindsprint, so the underlying business shrinks ~3%. Americas 2 (banks, insurers, energy) fell 7.3% YoY in Q1; growth comes only from Europe and APMEA, partly bought.` },
    { h: 'AI is eating the run business', p: 'Management says clients\' traditional IT, BPO and support budgets are "getting compressed" and that cost-takeout deals carry forward productivity and lower margins. Headcount fell ~2,500 in Q1 excluding Mindsprint. Peers that grow are those with more engineering and AI work; Wipro discloses no AI revenue.' },
    { h: 'Margins: below the band, and staying there', p: `IT Services EBIT margin 17.2% in FY26, 16.0% in Q1FY27 (wage hike, deal ramp-ups, AI-native unit). Management gave no date for a return to 17-17.5%. We model ${n1(X.itsEbit(0))}% / ${n1(X.itsEbit(1))}% / ${n1(X.itsEbit(2))}% (company basis) for FY27-29E, at the low end of the street.` },
    { h: 'Valuation already prices decline', p: `At ₹${n1(price)} the stock trades at ${n1(price / F.eps[1])}x our FY28E EPS (median since 2021: ${n1(FM.median)}x) with a ~${n1(dy)}% FY27E dividend yield. A DCF at ${n1(V.ke)}% equals the price only if rupee cash flows shrink ~${Math.abs(Math.round(impliedG))}% a year forever. Even after cutting its post-2021 median by the peers' ~${Math.abs(Math.round(sectorDr))}% de-rating, our ${peMult}x gives {{dcf.tp|inr}}. The risk is a value trap if dollar revenue keeps shrinking (bear case {{scen.bear.tp|inr}}).` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'GREEN' },
    { k: 'Predictability', v: 'AMBER' },
    { k: 'Earnings momentum', v: 'RED' },
    { k: 'Competitive position', v: 'RED' },
    { k: 'Valuation', v: 'GREEN' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-October 2026): delivery against the −1.5% to +0.5% QoQ guide, the Q3 guide, and whether the margin climbs back from 16.0%.',
    'Deal conversion: Q1 bookings were $3.4 bn (−32% YoY) with decisions slipping into Q2; ramp-up of the Americas BFSI and European EMR wins management pointed to.',
    'AI pricing: how much productivity Wipro gives back on renewals, and whether it starts disclosing AI revenue as TCS, Infosys and HCLTech do.',
    'US macro and policy: a Fed that hiked in September, 10-year yields near 5%, the extended $100,000 H-1B fee; Accenture\'s Aug-quarter results (due in early October).',
    'Capital return: the January interim dividend (₹2 declared in July vs ₹5 a year earlier) and any new buyback under the 70% payout policy.',
  ],
};

// ---------------------------------------------------------------- Story in charts
const QQ = QR.slice(1); // Q1FY25 on
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: 'Nine quarters of growth around zero: −2.4% in constant currency since Q4FY24', unit: 'IT Services, sequential growth in constant currency (%)', x: QQ.map(q => q.q), series: [{ name: 'QoQ CC growth', values: QQ.map(q => q.qoqCcPct), fmt: 'pct' }], labels: 'all', source: 'Wipro datasheets' },
      { type: 'hbar', title: 'Q1FY27: Wipro grew slowest of the large Indian IT firms', unit: 'Revenue growth, Jun-2026 quarter, year on year (%)', x: ['Persistent', 'Mphasis', 'Tech Mahindra', 'LTM', 'TCS', 'HCLTech', 'Infosys', 'Wipro'], series: [{ name: 'Growth', values: [G.PERSISTENT, G.MPHASIS, G.TECHM, G.LTM, G.TCS, G.HCLTECH, G.INFY, G.WIPRO], fmt: 'pct' }], labels: 'all', highlight: 'Wipro', source: 'Company releases and press coverage (CC where stated); Wipro CC' },
    ] },
    { pair: [
      { type: 'line', title: 'Margin fell to 16.0%, below the 17-17.5% band', unit: 'IT Services EBIT margin (%); dashed lines = management band', x: QQ.map(q => q.q), series: [{ name: 'IT Services margin', values: QQ.map(q => q.marginPct), fmt: 'pct' }], labels: 'all', min: 14, max: 19, lines: [{ v: 17, text: '' }, { v: 17.5, text: '' }], source: 'Wipro datasheets' },
      { type: 'hbar', title: 'Q1FY27: Americas shrank, Europe and APMEA grew', unit: 'Year-on-year growth in constant currency, Jun-2026 quarter (%)', x: ['APMEA', 'Europe', 'Americas 1', 'Americas 2'], series: [{ name: 'YoY CC', values: [Q1.smuYoyCcPct.apmea, Q1.smuYoyCcPct.europe, Q1.smuYoyCcPct.americas1, Q1.smuYoyCcPct.americas2], fmt: 'pct' }], labels: 'all', source: 'Wipro Q1FY27 datasheet' },
    ] },
    { pair: [
      { type: 'column', title: 'Bookings: big FY26 first half, weaker since', unit: 'Total bookings and large deals ($ million)', x: QQ.map(q => q.q), series: [{ name: 'Total bookings', values: QQ.map(q => q.bookingsUsdM), fmt: 'num' }, { name: 'Large deals', values: QQ.map(q => q.largeDealsUsdM), fmt: 'num' }], labels: 'none', source: 'Wipro datasheets' },
      { type: 'column', title: `EPS: ~4% a year to FY29E on post-buyback shares`, unit: 'EPS (₹; FY26 pro-forma on 990 cr shares, reported ₹12.58)', x: 'fin.labels', from: 'FY19', to: 'FY29E', series: [{ name: 'EPS', ref: 'fin.eps', fmt: 'n1' }], labels: 'all', source: 'Screener.in; GAM estimates FY27-29E' },
    ] },
    { pair: [
      { type: 'line', title: `Forward P/E: ~${Math.round(price / F.eps[1])}x now vs a ${Math.round(FM.median)}x median since 2021`, unit: 'Price ÷ next full-year EPS (x)', x: fwdPe.map(x => x[0]), series: [{ name: 'Forward P/E', values: fwdPe.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 2, lines: [{ v: Math.round(FM.median), text: `Median since 2021: ${Math.round(FM.median)}x` }], source: 'Screener.in prices; actual EPS, GAM estimates for FY27-28E' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (Jul-Sep 2026)', unit: `₹ per share; CMP ₹${n1(price)}`, x: [...X.withTp.map(s => s.broker), 'GAM (base)'], series: [{ name: 'Target', values: [...X.withTp.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes and press round-ups (16-Jul to 10-Sep 2026), GAM Research' },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.aiQuestion, P2.tailwind, P2.smu, P2.people, P3.moat, p.financials, P3.guidance, p.capital, P3.quality, p.balance, P3.ownership(p.ownershipBase), P3.governance, P3.forecasts, P4.street, P4.valuation, P4.risks, p.statements, P4.glossary],
  statementNotes: P4.statementNotes,
};
