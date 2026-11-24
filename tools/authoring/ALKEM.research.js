// Alkem Laboratories report, part B: cover, the story in charts, and the merger of part2-6 (business, history, industry,
// tailwind test, India, US & USFDA, international/Enzene/MedTech, moat, Q1FY27 and guidance, earnings quality, ownership,
// governance, forecasts, street, valuation, risks, glossary, statement notes). Shared inputs in ALKEM.ctx.js. Forecast and
// valuation figures are live tokens ({{...}}) that follow assumptions.json. As of 30-Sep-2026.
const X = require('./ALKEM.ctx');
const { F, V, A, n0, n1, pc, SQ, QL, Q1, FY26, price, mv, MULT, ownersEps, ownersSep, HB, HR, k, SECTOR, rating, ST, ndCo, YRS, BL, derate, PEER_SET, P, shortName, shortDate, peFy28, peTtm, byBase, epsRep, ex26, mosl, bob, choice } = X;
const P2 = require('./ALKEM.part2'), P3 = require('./ALKEM.part3'), P4 = require('./ALKEM.part4'), P5 = require('./ALKEM.part5'), P5b = require('./ALKEM.part5b'), P6 = require('./ALKEM.part6');

const cover = {
  headline: `A steady acute franchise whose EPS resets on tax in FY27; on the street's P/E method, with the pharma re-rating applied, we see {{dcf.upside|chg}}, but the market has not yet granted Alkem that premium`,
  lead: `Alkem is India's #6 drug maker and #1 in antibiotics (67% of revenue from India), with a US generics arm (20%) and three young bets: Enzene biosimilars and contract manufacturing, MedTech (55% of Occlutech from Jul-2026) and generic semaglutide. Q1FY27 revenue rose 11% to ₹${n0(Q1.revenue)} cr and EBITDA 4%, but profit fell 22% as the tax rate jumped to 32% when the Sikkim tax holiday ended; on the same day the USFDA's OAI on the Daman plant (45% of US sales) was disclosed. We forecast EPS to shareholders of ₹${n1(ownersEps[0])} / ${n1(ownersEps[1])} / ${n1(ownersEps[2])} for FY27-29E, below FY26's ₹${n1(ex26)} in FY27 and below consensus. Every broker note since Q1FY27 that discloses a method uses **P/E** (Nuvama's last public note, Nov-2025, used a sum of the parts), and so do we: **${MULT.base}x Sep-28E EPS (₹${n1(ownersSep)})**, i.e. Alkem's ${n1(HB.med)}x median forward P/E since Apr-2021 (EPS before exceptional items) lifted ${SECTOR}% for the pharma sector's re-rating, gives **{{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}.** Cross-checks: EV/EBITDA ₹${n0(mv('ev').value)}; DCF ₹${n0(mv('dcf').value)}. Bull {{scen.bull.tp|inr}}; bear {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'A durable, cash-generative core', p: `#1 in anti-infectives for 15+ years, #3 by prescriptions, 17 brands above ₹100 cr (52% of domestic sales), 14,500+ reps and #1-2 in trade generics. Branded India grew ~12% in Q1FY27, 100bp ahead of the market on IQVIA. Net cash ₹${n0(Q1.netCashCompany)} cr; dividends ~25-30% of profit.` },
    { h: 'But growth is market-plus, not more, and FY27 EPS falls', p: `Alkem's lead therapies (antibiotics, gastro, pain, vitamins) grew 4-9% market-wide in FY26; chronic is only ~22-23% of branded sales. The tax rate goes from 18% to ~31% (Sikkim holiday over), so FY27E EPS (₹${n1(ownersEps[0])}) is ${pc(ownersEps[0] / ex26 * 100 - 100)} on FY26 even with EBITDA +10%.` },
    { h: 'The new bets and the US cost more than they earn today', p: 'Enzene\'s New Jersey CDMO spends ~₹60 cr a quarter and breaks even only at $25-30mn of sales (FY28); Occlutech runs at breakeven; US sales are flat in dollars and Daman, which makes 45% of them, is under an OAI. Governance is AMBER: founder in his mid-80s, CEO seat empty, high promoter pay, steady promoter selling.' },
    { h: 'Valuation: the house method says cheap; the market disagrees', p: `At ₹${n0(price)} Alkem trades at ${n1(peFy28)}x our FY28E EPS against a ${n1(HB.med)}x median one-year-forward P/E since Apr-2021, and its trailing P/E is ${pc(derate.ALKEM)} vs its five-year median while pharma peers are +${SECTOR}%. Our ${MULT.base}x applies the sector's move (house rule, no blend with Alkem's own); on Alkem's own move the value would be ~₹${n0(X.val(X.SENS.own))} (HOLD). The DCF (₹${n0(mv('dcf').value)}) is the warning.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'AMBER' },
    { k: 'Earnings momentum', v: 'RED' },
    { k: 'Competitive position', v: 'GREEN' },
    { k: 'Balance sheet', v: 'GREEN' },
    { k: 'Governance', v: 'AMBER' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): tax rate vs the 30-32% guidance, gross margin as costlier API flows through, trade-generics recovery, the first Occlutech quarter.',
    'USFDA: progress on the Daman (Amaliya) OAI; any re-inspection, or escalation to a warning letter; the delayed US denosumab biosimilar approval.',
    'US launches: generic tolvaptan (Q2FY27, limited competition); Enzene US CDMO contract wins towards the $25-30mn breakeven run-rate.',
    'People: appointment of a new CEO; further promoter-group sales after the Jun-2026 block (90-day lock-up).',
    'Monthly IQVIA data: whether branded growth stays ~1pp above the market; semaglutide share as prices fall.',
  ],
};

// ---------------------------------------------------------------- Story in charts
const STREET_TP = ST.filter(s => s.tp);
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: 'Revenue: ₹3,740 cr in Q1FY27, +11%', unit: 'Revenue (₹ crore), quarterly', x: QL, series: [{ name: 'Revenue', values: SQ.map(q => q.consRev), fmt: 'num' }], labels: 'all', highlight: 'Q1FY27', source: 'Company presentations' },
      { type: 'hbar', title: 'Two-thirds of revenue is India', unit: 'FY26 revenue by business (₹ crore)', x: ['India', 'United States', 'Other international', 'Other operating income'], series: [{ name: 'FY26', values: [FY26.india, FY26.us, FY26.row, FY26.otherOp].map(Math.round), fmt: 'num' }], labels: 'all', highlight: 'India', source: 'Q4FY26 investor presentation' },
    ] },
    { pair: [
      { type: 'line', title: 'Gross margin at a 10-year high; EBITDA margin flat', unit: 'Company-reported (%), quarterly', x: QL, series: [{ name: 'Gross margin', values: SQ.map(q => q.grossMarginPct), fmt: 'pct' }, { name: 'EBITDA margin', values: SQ.map(q => q.ebitdaMarginPct), fmt: 'pct' }], labels: 'last', min: 0, max: 75, source: 'Company presentations; broker result notes' },
      { type: 'column', title: 'The tax holiday is over: ~31% from FY27', unit: 'Effective tax rate (%); FY27-29E = GAM', x: ['FY23', 'FY24', 'FY25', 'FY26', 'Q1FY27', ...YRS], series: [{ name: 'Tax rate', values: [22.8, 10.5, 12.3, 18.0, 32.4, 31, 30, 29], fmt: 'pct' }], labels: 'all', highlight: 'Q1FY27', source: 'MOSL; AR FY26; GAM' },
    ] },
    { pair: [
      { type: 'column', title: 'EPS dips in FY27E on tax, then grows again', unit: 'EPS (₹); FY27-29E = GAM (to shareholders)', x: ['FY23', 'FY24', 'FY25', 'FY26', ...YRS], series: [{ name: 'Before exceptional items', values: [2023, 2024, 2025, 2026, 2027, 2028, 2029].map(y => Math.round(byBase[y] * 10) / 10), fmt: 'n1' }], labels: 'all', source: 'Screener.in; GAM Research' },
      { type: 'column', title: 'US sales: flat for three quarters; Daman (45%) under OAI', unit: 'US revenue (₹ crore), quarterly', x: QL, series: [{ name: 'US', values: SQ.map(q => q.us), fmt: 'num' }], labels: 'all', highlight: 'Q1FY27', source: 'Company presentations; MOSL/Choice notes' },
    ] },
    { pair: [
      { type: 'hbar', title: `Pharma re-rated (+${SECTOR}%); Alkem did not (${pc(derate.ALKEM)})`, unit: 'Trailing P/E at the 30-Sep-2026 close vs five-year median (%)', x: [...[...PEER_SET].sort((a, c) => derate[c] - derate[a]).map(shortName), 'Alkem'], series: [{ name: 'vs median', values: [...[...PEER_SET].sort((a, c) => derate[c] - derate[a]).map(s => Math.round(derate[s] * 10) / 10), Math.round(derate.ALKEM * 10) / 10], fmt: 'pct' }], labels: 'all', highlight: 'Alkem', source: 'Screener.in P/E series; asof-peers.js' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (notes standing on 30-Sep-26)', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...STREET_TP.map(s => `${s.broker} (${shortDate(s.date)})`), 'GAM (base)'], series: [{ name: 'Target', values: [...STREET_TP.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes (Nov-2025 to Aug-2026), GAM Research' },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.india, P3.us, P3.newbiz, P3.moat, p.financials, p.margins, P4.guidance, p.capital, P4.quality, p.balance, P4.ownership(p.ownershipBase), P4.governance, P4.forecasts, P5.street, P5b.valuation, P5.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
