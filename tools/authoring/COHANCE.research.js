// Cohance Lifesciences report, part B: cover, the story in charts, and the merger of part2-6. Shared inputs in COHANCE.ctx.js.
// Forecast and valuation figures are live tokens ({{...}}) that follow assumptions.json.
const X = require('./COHANCE.ctx');
const { V, n0, n1, price, mv, MULT, HB, k, SECTOR, rating, epsU, epsSep28, fwdNow, YRS, SA, SQ, LINES, cdmoTot, ST, M5, PEER_SET, shortName, shortDate, sPe, gNeeded, implPeAtPrice, medTp, HF28, Q1, pxAll, MERGER, bob } = X;
const P2 = require('./COHANCE.part2'), P3 = require('./COHANCE.part3'), P4 = require('./COHANCE.part4'), P5 = require('./COHANCE.part5'), P5b = require('./COHANCE.part5b'), P6 = require('./COHANCE.part6');
const fall = Math.round((1 - price / 1135.7) * 100);

const cover = {
  headline: `The Suven-Cohance merger has not worked yet: EPS fell from ₹12.7 to a Q1 loss and the stock ${fall}% since the merger; on our rule ${MULT.base}x Sep-28E EPS gives {{dcf.tp|inr}}, ${rating}`,
  lead: `Cohance Lifesciences is Advent International's merger of Suven Pharmaceuticals (a high-margin contract manufacturer for innovator drug companies) with Cohance (niche APIs and formulations), effective 1-May-2025, plus two bolt-ons: 56% of NJ Bio (US antibody-drug-conjugate services) and 67.5% of Sapala (oligonucleotide building blocks). Since the merger two big CDMO molecules destocked, a US FDA Warning Letter hit the Nacharam formulations plant, NJ Bio's losses grew and four senior leaders left; FY26 revenue fell 13%, and Q1FY27 had a 0.3% EBITDA margin and a loss. Ex-Cipla CEO Umang Vohra took charge in May-2026 and guides recovery from H2FY27. We forecast EPS of ₹${n1(epsU[0])} / ${n1(epsU[1])} / ${n1(epsU[2])} for FY27-29E, 14-23% below BOBCAPS. We value on **P/E**, the street's method. Both forward years since the merger are trough years under our rule, so the multiple comes from the listed share's history since Apr-2021 (${n1(HB.med)}x, trough years left out) × the pharma sector's +${SECTOR}%: **${MULT.base}x Sep-28E EPS of ₹${n1(epsSep28)} = {{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}**. Cross-checks: EV/EBITDA ₹${n0(mv('ev').value)}; DCF ₹${n0(mv('dcf').value)}. Bull {{scen.bull.tp|inr}}; bear {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'Earnings have collapsed, not dipped', p: `Attributable EPS ₹12.68 (FY25, merged) → ₹4.68 (FY26) → −₹0.63 in Q1FY27. The cost base (~₹300 cr a quarter) did not fall with revenue. Without NJ Bio's US partners absorbing 44% of its losses, the Q1 loss would have been ₹45 cr, not ₹24 cr.` },
    { h: 'A recovery is likely, its size is not', p: 'A restocking order for one destocked molecule (deliveries Q4FY27-FY28), two newly commercial molecules, 10 Phase III molecules, Sapala up 2.5x and Nacharam back to supplying the US. But the second molecule, NJ Bio (₹33 cr EBITDA loss in Q1) and agrochemicals (a qualification year) are open; the US$1 bn FY30 target is now an "aspiration".' },
    { h: 'Governance overhangs', p: 'Advent controls 57.5%, sold 8.9% at ~₹906 in Sep-2025 to repay holdco debt and has pledged 54% of the company for a US$285 mn loan. Executive chairman, MD, CEO and CFO all changed in eleven months; a Form 483 (five observations) at the Pashamylaram CDMO site in Aug-2026.' },
    { h: 'The price already pays for the recovery', p: `₹${n0(price)} is ${n1(fwdNow)}x our FY28E and ~${Math.round(implPeAtPrice)}x Sep-28E EPS. Pre-merger Suven traded at 30-45x forward; BOBCAPS uses 40x. The DCF supports ~₹${n0(mv('dcf').value)} and needs ~${Math.round(gNeeded)}% revenue growth for 15 years to reach the price. Street median target ₹${n0(medTp)}.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'AMBER' }, { k: 'Predictability', v: 'RED' }, { k: 'Earnings momentum', v: 'RED' }, { k: 'Competitive position', v: 'AMBER' },
    { k: 'Balance sheet', v: 'AMBER' }, { k: 'Governance', v: 'AMBER' }, { k: 'Valuation', v: 'RED' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): management guides better than Q1; watch the CDMO deliveries moved from Q1, the ADC payload order and NJ Bio losses.',
    'Umang Vohra\'s strategy update and a view on the US$1 bn FY30 aspiration, promised by December 2026; a new CFO (Himanshu Agarwal left on 13-Sep-2026).',
    'US FDA: response to the Pashamylaram Form 483 (five observations); Nacharam CAPA audit-ready by end-FY27.',
    'Restocking: deliveries for the first destocked molecule from Q4FY27; any order for the second.',
    'Advent: the Sep-2025 lock-up has expired; any further block sale or change to the holdco pledge.',
  ],
};

// ---------------------------------------------------------------- Story in charts
const STREET_TP = ST.filter(s => s.tp).slice().sort((a, c) => c.tp - a.tp);
const pxM = pxAll.filter(([d]) => d >= '2025-04-01');
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'stacked', title: 'Revenue by segment: down in FY26-27, back above FY25 only in FY29E', unit: 'Revenue (₹ crore)', x: ['FY25', 'FY26', ...YRS], series: [{ name: 'Pharma CDMO (incl. NJ Bio, Sapala)', values: [1128, 889, ...cdmoTot.map(Math.round)], fmt: 'num' }, { name: 'API+', values: [1183, 1088, ...LINES.apiPlus.map(Math.round)], fmt: 'num' }, { name: 'Specialty Chemicals', values: [298, 291, ...LINES.specChem.map(Math.round)], fmt: 'num' }], minLabel: 150, source: 'Q4FY26 deck (restated FY25-26); GAM estimates FY27-29E' },
      { type: 'stacked', title: 'Quarterly revenue by segment: Pharma CDMO halved', unit: 'Revenue (₹ crore)', x: SQ.map(q => q.q), series: [{ name: 'Pharma CDMO', values: SQ.map(q => q.pharmaCdmo), fmt: 'num' }, { name: 'API+', values: SQ.map(q => q.apiPlus), fmt: 'num' }, { name: 'Specialty Chemicals', values: SQ.map(q => q.specChem), fmt: 'num' }], minLabel: 120, source: 'Company decks (as first reported; Q4FY25 restated)' },
    ] },
    { pair: [
      { type: 'column', title: `EPS: ₹12.7 (FY25) to ₹${n1(epsU[0])} (FY27E), ₹${n1(epsU[2])} by FY29E`, unit: 'EPS (₹), post-merger basis; FY27-29E = GAM', x: ['FY23', 'FY24', 'FY25', 'FY26', ...YRS], series: [{ name: 'EPS', values: [16.16, 11.8, 12.68, 4.68, ...epsU.map(v => Math.round(v * 10) / 10)], fmt: 'n1' }], labels: 'all', highlight: 'FY26', source: 'Screener.in (FY23-24 Suven alone); AR FY26 (FY25 restated); GAM' },
      { type: 'line', title: `Share price since the merger: ₹1,136 → ₹${n0(price)}`, unit: '₹ per share, weekly close', x: pxM.map(x => x[0]), series: [{ name: 'Price', values: pxM.map(x => x[1]), fmt: 'inr', thin: true }], labels: 'last', min: 0, yearTicks: true, yearStep: 1, source: 'Screener.in weekly prices; NSE close 30-Sep-2026' },
    ] },
    { pair: [
      { type: 'column', title: 'The bolt-ons: NJ Bio loses money, Sapala is small but growing', unit: '₹ crore', x: ['NJ Bio revenue FY26', 'NJ Bio loss FY26', 'NJ Bio EBITDA Q1FY27', 'Sapala revenue FY26', 'Sapala revenue Q1FY27'], series: [{ name: '₹ cr', values: [188, -66, -33, 50, 27], fmt: 'num' }], labels: 'all', source: 'AR FY26 note 18(b); Q1FY27 deck and call' },
      { type: 'line', title: `Forward P/E since Apr-2021 (trough years left out): median ${n1(HB.med)}x, target ${MULT.base}x`, unit: 'Price ÷ next full-year EPS (x), EPS before exceptional items', x: sPe.map(x => x[0]), series: [{ name: 'Forward P/E', values: sPe.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, min: 0, max: 70, lines: [{ v: HB.med, text: `Median ${n1(HB.med)}x` }, { v: MULT.base, text: `Target ${MULT.base}x (× ${k.toFixed(3)})`, color: '#cf8f1f' }], source: `Screener.in weekly prices; FY23-25 forward years; FY26-28 are trough years (FY28E points alone: ${n1(HF28.med)}x)` },
    ] },
    { pair: [
      { type: 'hbar', title: `Pharma trades +${SECTOR}% above its five-year median P/E`, unit: 'Trailing P/E at the 30-Sep-2026 close vs five-year median (%)', x: [...PEER_SET].sort((a, c) => M5[c].mv - M5[a].mv).map(shortName), series: [{ name: 'vs median', values: [...PEER_SET].sort((a, c) => M5[c].mv - M5[a].mv).map(s => Math.round(M5[s].mv * 10) / 10), fmt: 'pct' }], labels: 'all', source: 'Screener.in P/E series; asof-peers.js; PLAYBOOK §7c peer set (Cohance is outside the set)' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (notes standing on 30-Sep-26)', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...STREET_TP.map(s => `${s.broker.replace(/ \(.*\)/, '')} (${shortDate(s.date)})`), 'GAM (base)'], series: [{ name: 'Target', values: [...STREET_TP.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes and press summaries (May-Aug 2026), GAM Research' },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.pricestory, P2.industry, P2.tailwind, P3.cdmo, P3.modalities, P3.api, P3.specchem, P3.plants, P4.moat, p.financials, p.quarters, P4.margins, P5.q1, P4.earnings, p.balance, P4.capital, P4.ownership(p.ownershipBase), P4.governance, P5.forecasts, P5.street, P5b.valuation, P6.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
