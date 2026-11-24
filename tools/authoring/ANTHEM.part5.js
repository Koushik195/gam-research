// Anthem Biosciences report, part 5: Q1FY27 and guidance, our forecasts vs the street, the street view.
const X = require('./ANTHEM.ctx');
const { C, D, F, A, AS, n0, n1, rup, Q1, FY26, YRS, KEYS, LBL, BL, LINES, oiTreas, oiBuild, TY, RODTEP, MISC, cashPath, OI26, ttmOi, yld26, yldQ1, intBuild, KD, OTHER_FIN, BORR, epsU, sep, ST, jef, pll, bob, jm, hsie, nom, jpm, drc, withTp, medTp, postQ1, medTpPost, atOurs, rating, MULT, HB, k, SECTOR, shortDate, price, epsSep28 } = X;

const q1 = {
  id: 'guidance', nav: 'Q1FY27 & guidance', kicker: 'Momentum', title: 'Q1FY27: revenue −23% on deferred deliveries, margin held, profit −12%; management says the year is intact but will not give a number',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (₹ crore)', head: ['', 'Q1FY26', 'Q1FY27', 'Change'], rows: [
      ['Revenue from operations', '540.2', n1(Q1.revenue), `${Q1.revenueGrowthPct}%`],
      ['  CRDMO', '452.7', n1(Q1.crdmo), `${Q1.crdmoGrowthPct}%`],
      ['  Specialty ingredients', '87.5', n1(Q1.si), `${Q1.siGrowthPct}%`],
      ['Gross margin', '57.3%', `${Q1.grossMarginPct}%`, '+780bp (backward integration)'],
      ['EBITDA before other income (Screener)', '191', n1(Q1.ebitdaScreener), `margin ${Q1.ebitdaScreenerPct}% (35.4%)`],
      ['Other income', '22.8', n1(Q1.otherIncome), 'Treasury ₹23.6 cr; forex and incentives ₹1.3 cr'],
      ['EBITDA incl. other income (company)', '214.3', n1(Q1.ebitdaCompany), `${Q1.ebitdaCompanyPct}% (38.1%)`],
      ['Depreciation', '26.4', n1(Q1.dep), '+14%'],
      ['Tax rate', '27.1%', `${Q1.taxRatePct}%`, 'Guided 25-25.5% for FY27'],
      { hl: true, cells: ['**Net profit**', '**135.8**', `**${n1(Q1.pat)}**`, '**−11.7%**'] },
      ['Net cash (quarter-end)', '784.8', n1(Q1.netCash), '+₹935 cr YoY'],
    ], source: 'Q1FY27 investor presentation (21-Jul-2026); Screener.in; BOBCAPS (segment gross margins)' } },
    { bullets: Q1.commentary.map(c => rup(c)) },
    { exhibit: { type: 'table', title: 'What management has guided, and what happened', head: ['Guidance history'], rows: C.guidance.history.map(g => [g]), source: 'Earnings calls Aug-2025 to Jul-2026' } },
    { callout: '**Why it matters:** this is the second time in three quarters that revenue has fallen 15-25% (Q3FY26, Q1FY27), and the first full year as a listed company missed its revenue guide (15% vs 20%). Management\'s explanation (customers re-routing stock between markets, approvals arriving late) is credible for a CRDMO, and the margin held, but the year now depends on Q2-Q4. The 60% order cover helps; it is not a guarantee of 20%.' },
  ],
};

const STREET_F = [['PL (22-Jul)', pll], ['BOBCAPS (22-Jul)', bob], ['Jefferies (21-Aug)', jef], ['JM Financial (31-Oct-25)', jm]];
const fmtSt = (s, key, f) => s[key] ? Object.entries(s[key]).filter(([y]) => /FY2[789]E/.test(y)).map(([y, v]) => `${y.slice(0, 4)}: ${f(v)}`).join(' / ') : '–';
const forecasts = {
  id: 'forecasts', nav: 'Forecasts vs the street', kicker: 'Forecasts', title: `Our forecasts: EPS ₹${n1(epsU[0])} / ${n1(epsU[1])} / ${n1(epsU[2])}, at the low end of the street for FY27-28 because we do not assume the full Q1 shortfall is recovered`,
  blocks: [
    { p: `We forecast revenue of {{F.sales.0|num}} / {{F.sales.1|num}} / {{F.sales.2|num}} cr for FY27-29E (+{{F.salesGrowth.0|pct}} / +{{F.salesGrowth.1|pct}} / +{{F.salesGrowth.2|pct}}), an EBITDA margin of {{F.ebitdaMargin.0|pct}} / {{F.ebitdaMargin.1|pct}} / {{F.ebitdaMargin.2|pct}} and EPS of ₹${n1(epsU[0])} / ${n1(epsU[1])} / ${n1(epsU[2])}. FY27 revenue growth of ~14% is below management's "historical" ~20% and the street's ~20%: it still needs Q2-Q4 revenue up ~19% on last year. EPS growth in FY27 (${Math.round((epsU[0] / 10.54 - 1) * 100)}%) is held back by the absence of FY26's ₹58 cr of forex gains and lower treasury yields, helped by a lower tax rate (25.5% vs 28.2%).` },
    { exhibit: { type: 'table', title: 'GAM vs the street (estimates standing on 30-Sep-2026)', head: ['', 'GAM FY27E', 'GAM FY28E', 'GAM FY29E', ...STREET_F.map(s => s[0])], wide: [0], rows: [
      ['Revenue (₹ cr)', '{{F.sales.0|num}}', '{{F.sales.1|num}}', '{{F.sales.2|num}}', ...STREET_F.map(([, s]) => fmtSt(s, 'sales', n0))],
      ['EBITDA (₹ cr)', '{{F.ebitda.0|num}}', '{{F.ebitda.1|num}}', '{{F.ebitda.2|num}}', ...STREET_F.map(([, s]) => fmtSt(s, 'ebitda', n0))],
      ['EPS (₹)', n1(epsU[0]), n1(epsU[1]), n1(epsU[2]), ...STREET_F.map(([, s]) => fmtSt(s, 'eps', n1))],
    ], source: 'GAM; PL and BOBCAPS (22-Jul-2026), Jefferies (21-Aug-2026; FY27-28E EPS derived from its stated growth), JM Financial (31-Oct-2025, before Q2-Q4FY26). Bloomberg consensus EPS FY27E ₹12.9 / FY28E ₹15.6 (BOBCAPS, 22-Jul-2026)' } },
    { exhibit: { type: 'column', title: 'FY28E EPS: GAM at the low end of the street', unit: 'FY28E EPS (₹)', x: ['Jefferies', 'GAM', 'BOBCAPS', 'JM (Oct-25)', 'PL'], series: [{ name: 'FY28E EPS', values: [jef.eps.FY28E, Math.round(epsU[1] * 10) / 10, bob.eps.FY28E, jm.eps.FY28E, pll.eps.FY28E], fmt: 'n1' }], labels: 'all', highlight: 'GAM', source: 'Broker notes; GAM' } },
    { exhibit: { type: 'table', title: 'Our main assumptions and why', head: ['Driver', 'FY27E', 'FY28E', 'FY29E', 'Why'], wide: [4], rows: [
      ...KEYS.map(kk => [`${LBL[kk]} growth`, ...BL.growth[kk].map(g => g + '%'), { commercial: 'Destocking over, four FY26 launches ramp; Q1 deferrals; Phase III conversions from FY28', development: '10 Phase III molecules; lumpy', rd: 'Biotech funding recovering; smaller projects', si: 'Q1 −11.5%; semaglutide API on approval' }[kk]]),
      ['Revenue (₹ cr)', ...LINES.commercial.map((_, i) => n0(X.buildTot[i])), 'Sum of the four lines (= model revenue)'],
      ['EBITDA margin', '{{F.ebitdaMargin.0|pct}}', '{{F.ebitdaMargin.1|pct}}', '{{F.ebitdaMargin.2|pct}}', 'Gross margin ~64% after backward integration; fixed costs ~23-24% of sales'],
      ['Capex (₹ cr)', ...AS.capex.map(n0), 'Guided ~₹700 cr FY27; Unit IV Phase I ₹1,200 cr over FY27-28; ~₹500 cr after'],
      ['Depreciation (₹ cr)', ...F.dep.map(n0), `${AS.depRateOnGrossBlock}% of gross block; Unit IV depreciates only from end-FY28`],
      ['Tax rate', ...AS.taxRate.map(t => t + '%'), 'NeoAnthem breaks even; 25-25.5% guided'],
      ['Payout', ...AS.payout.map(t => t + '%'), '₹2 a share for FY26'],
    ], source: 'GAM Research (assumptions.json)' } },
    { exhibit: { type: 'table', title: 'Other income: built from its parts (₹ crore)', head: ['', 'FY26 actual', 'FY27E', 'FY28E', 'FY29E', 'Basis'], wide: [5], rows: [
      ['Treasury income', n1(X.OIN.FY26.interest + X.OIN.FY26.capitalGains + X.OIN.FY26.fvGainFunds), ...oiTreas.map(n1), `${TY}% on average net cash (₹${cashPath.map(n0).join(' → ')} cr, Mar-26 to Mar-29E, engine basis); FY26 earned ~${n1(yld26)}% on gross treasury, Q1FY27 ${n1(yldQ1)}% annualised on net cash`],
      ['Export incentives (RoDTEP)', n1(X.OIN.FY26.rodtep), n0(RODTEP), n0(RODTEP), n0(RODTEP), 'FY25 ₹5.6 cr, FY26 ₹5.0 cr'],
      ['Grants, lease rent and other', n1(X.OIN.FY26.grant + X.OIN.FY26.other + X.OIN.FY26.leaseRent), n0(MISC), n0(MISC), n0(MISC), 'FY26 ₹3.6 cr'],
      ['Forex gains', n1(X.OIN.FY26.forex), '0', '0', '0', 'Not forecast (Q1FY27 forex and incentives together ₹1.3 cr)'],
      { hl: true, cells: ['**Total (model)**', `**${n1(OI26)}**`, ...AS.otherIncome.map(v => `**${n1(v)}**`), `Twelve months to Jun-26 (Screener, net of the ₹25 cr Q3 exceptional): ₹${n0(ttmOi)} cr; the FY27E drop is the forex gain and lower yields`] },
    ], source: 'AR FY26 note 24; Q1FY27 deck; GAM (checked in ANTHEM.ctx.js)' } },
    { p: `**Interest** is built the same way: ${KD}% on average borrowings (₹${BORR.map(n0).join(' → ')} cr) plus ~₹${OTHER_FIN} cr of lease and other finance costs = ₹${intBuild.map(n1).join(' / ')} cr (FY26 ₹6.9 cr; Q1FY27 ₹0.9 cr).` },
  ],
};

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street: targets ₹${n0(Math.min(...withTp.map(s => s.tp)))}-${n0(Math.max(...withTp.map(s => s.tp)))}, mostly on P/E; everyone likes the business, the debate is the multiple`,
  blocks: [
    { p: `Four notes are dated after the Q1FY27 results: PL kept Buy at ₹${n0(pll.tp)} (55x FY28E EPS; estimates unchanged), BOBCAPS kept Buy at ₹${n0(bob.tp)} (57x Jun-28E EPS), DRChoksey kept Accumulate at ₹${n0(drc.tp)}, and Jefferies initiated with Buy at ₹${n0(jef.tp)} on 21-Aug-2026 (65x Sep-28E EPS, a 10% premium to the sector's ~60x forward average). Older notes still standing: HDFC Securities Add ₹${n0(hsie.tp)} (35x Q3FY28E EV/EBITDA, Feb-2026), Nomura Buy ₹${n0(nom.tp)} (50x Dec-27E EPS, Nov-2025), JM Financial Add ₹${n0(jm.tp)} (40x Sep-27E EV/EBITDA, Oct-2025) and JPMorgan Neutral ₹${n0(jpm.tp)} (Aug-2025). Of the six that disclose a method, four use P/E. The median target is ₹${n0(medTp)} (₹${n0(medTpPost)} for the post-Q1 notes), against ₹${n0(price)} on 30-Sep-2026: the stock had run through most targets set before Aug-2026. Notes from Citi, Kotak, Motilal Oswal and others could not be retrieved (gap).` },
    { exhibit: { type: 'table', title: 'The street on 30-Sep-2026', head: ['Broker', 'Date', 'Rating', 'Target (₹)', 'Method', 'FY28E EPS (₹)', 'Thesis'], wide: [6], rows: [
      ...ST.map(s => [s.broker, shortDate(s.date), s.rating, n0(s.tp), s.method ? `${s.method} ${s.multiple} ${s.on}` : 'n.d.', s.eps?.FY28E ? n1(s.eps.FY28E) : '–', rup(s.thesis)]),
      { hl: true, cells: ['**GAM Research**', '30-Sep-26', `**${rating}**`, '**{{dcf.tp|num}}**', `**P/E ${MULT.base}x Sep-28E**`, `**${n1(epsU[1])}**`, 'Best-in-class economics; concentrated revenue; own forward P/E × the sector\'s re-rating'] },
    ], source: rup(D.street.note) } },
    { exhibit: { type: 'table', title: 'The P/E brokers\' multiples on our EPS', head: ['Broker', 'Multiple and year', 'Our EPS for that year (₹)', 'Value (₹)', 'Their target (₹)'], rows: [
      ['Jefferies', '65x Sep-28E', n1(sep(epsU)), n0(Math.round(atOurs.jef / 10) * 10), n0(jef.tp)],
      ['BOBCAPS', '57x Jun-28E', n1(0.75 * epsU[1] + 0.25 * epsU[2]), n0(Math.round(atOurs.bob / 10) * 10), n0(bob.tp)],
      ['PL', '55x FY28E', n1(epsU[1]), n0(Math.round(atOurs.pl / 10) * 10), n0(pll.tp)],
      { hl: true, cells: ['**GAM**', `**${MULT.base}x Sep-28E**`, `**${n1(epsSep28)}**`, '**{{dcf.tp|num}}**', ''] },
    ], source: 'Broker notes; GAM' } },
    { p: `**Where we stand.** Our EPS is at the low end of the street, our multiple at the high end. Anthem's own one-year-forward P/E since Oct-2025 has a median of ${n1(HB.med)}x, and pharma peers re-rated ${SECTOR}% above their own medians over the same window; ${n1(HB.med)}x × ${k.toFixed(3)} gives ${MULT.base}x, the same multiple Jefferies uses on the same year. PL and BOBCAPS apply 55-57x, close to Anthem's history without the sector move.` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument'], rows: D.critiques.map(c => [rup(c)]), source: 'Broker notes, earnings calls and filings to 30-Sep-2026' } },
  ],
};

module.exports = { q1, forecasts, street };
