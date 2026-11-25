// Sai Life Sciences report, part 5: Q1FY27 and guidance, our forecasts vs the street, the street view.
const X = require('./SAILIFE.ctx');
const { C, D, F, A, AS, n0, n1, rup, Q1, FY26, YRS, KEYS, LBL, BL, LINES, oiTreas, oiBuild, TY, MISC, GROSS, BORR, LEASES, LR, LEASE_INT, OTHER_FIN, KD, intBorrow, intBuild, OI26, ttmOi, epsU, sep, ST, jef, kot, ms, jm, hsie, withTp, medTp, postQ1, medTpPost, rating, MULT, EVH, kev, SECTOR_EV, shortDate, price, atHsie, atJm2, cashPath, b } = X;

const q1 = {
  id: 'guidance', nav: 'Q1FY27 & guidance', kicker: 'Momentum', title: 'Q1FY27: revenue +12%, PAT +22%, CDMO only +6%; management keeps its 15-20% / 28-30% medium-term guide and points to a stronger H2',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (₹ crore)', head: ['', 'Q1FY26', 'Q1FY27', 'Change'], rows: [
      ['Revenue from operations', '496', n0(Q1.revenue), `+${Q1.revenueGrowthPct}%`],
      ['  CDMO (60%)', '~313', `~${n0(Q1.cdmo)}`, `+${Q1.cdmoGrowthPct}%`],
      ['  CRO (40%)', '~179', `~${n0(Q1.cro)}`, `+${Q1.croGrowthPct}%`],
      ['Material margin', '71.6%', `${Q1.materialMarginPct}%`, '+220bp'],
      ['Employee cost', '161', n0(Q1.employeeCost), '+12%; 32.5% of sales'],
      ['EBITDA (company, incl. ₹1 cr forex loss)', '125', n0(Q1.ebitdaCompany), `+18%; margin ${Q1.ebitdaCompanyPct}% (25.2%)`],
      ['Other income', '6', n1(Q1.otherIncome), 'IPO cash spent'],
      ['Finance cost', '12', n0(Q1.financeCost), 'Lower average debt; leases ~₹5.5 cr a quarter'],
      ['Depreciation', '38', n0(Q1.dep), '+21%'],
      { hl: true, cells: ['**Net profit**', '**60**', `**${n1(Q1.pat)}**`, `**+${Q1.patGrowthPct}%**`] },
      ['Capex in the quarter', '–', n0(Q1.capexQ1), 'Against ₹1,100-1,300 cr guided for FY27'],
    ], source: 'Q1FY27 investor presentation (7-Aug-2026, consolidated P&L p.28); Q1FY27 call; Screener.in' } },
    { bullets: Q1.commentary.map(c => rup(c)) },
    { exhibit: { type: 'table', title: 'What management has guided', head: ['Item', 'Guidance', 'Status at 30-Sep-2026'], wide: [1, 2], rows: [
      ['Revenue growth', '15-20% a year over three to five years (base FY25)', 'FY26 +29%; Q1FY27 +12%; "view over a longer time horizon"'],
      ['EBITDA margin (company basis, incl. forex)', '28-30% over the next two to three years', 'FY26 30.1% (with forex and a reversal); Q1FY27 26.7%'],
      ['FY27 capex', '₹1,100-1,300 cr (FY26: ₹633 cr vs ₹700 cr budget)', '₹263 cr in Q1; "largely on schedule"'],
      ['Capacity', '~1,150 KL by end-FY27; first 225 KL block in H2/Q3', 'On track (CFO, Aug-2026)'],
      ['H1/H2', 'H2FY27 stronger than H1', 'FY26 split 48/52; history ~40/60'],
    ], source: 'Q4FY26 deck pp.5, 8, 12; Q1FY27 deck and call' } },
    { callout: '**Why it matters:** the guidance is a range over years, not a quarterly promise, and Q1 sits at the bottom of it. Our FY27 revenue (+17%) needs Q2-Q4 up ~18%, which leans on the Bidar block arriving on time and the three new commercial molecules ramping. The margin guide includes forex; on our basis (forex in other income) it is ~1-1.5 points lower.' },
  ],
};

const fmtSt = (s, key, f) => s && s[key] ? Object.entries(s[key]).filter(([y]) => /FY2[789]E/.test(y)).map(([y, v]) => `${y.slice(0, 4)}: ${f(v)}`).join(' / ') : '–';
const forecasts = {
  id: 'forecasts', nav: 'Forecasts vs the street', kicker: 'Forecasts', title: `Our forecasts: EBITDA in line with the street, EPS well below it (₹${n1(epsU[0])} / ${n1(epsU[1])} / ${n1(epsU[2])}) because doubled capex brings depreciation and interest the older models do not have`,
  blocks: [
    { p: `We forecast revenue of {{F.sales.0|num}} / {{F.sales.1|num}} / {{F.sales.2|num}} cr for FY27-29E (+{{F.salesGrowth.0|pct}} / +{{F.salesGrowth.1|pct}} / +{{F.salesGrowth.2|pct}}), an EBITDA margin of {{F.ebitdaMargin.0|pct}} / {{F.ebitdaMargin.1|pct}} / {{F.ebitdaMargin.2|pct}} and EBITDA of {{F.ebitda.0|num}} / {{F.ebitda.1|num}} / {{F.ebitda.2|num}} cr (~${Math.round(X.ebitdaCagr)}% a year). Below EBITDA the picture changes. Depreciation rises from ₹167 cr to ₹${n0(F.dep[2])} cr as ₹2,800 cr of capex lands; interest rises from ₹41 cr to ₹${n0(F.interest[2])} cr as Sai borrows to fund it; and other income falls from ₹40 cr to ~₹10 cr because the IPO cash is spent and we forecast no forex gains. EPS therefore grows only ~${Math.round(X.epsCagr)}% a year: ₹${n1(epsU[0])} / ${n1(epsU[1])} / ${n1(epsU[2])}.` },
    { exhibit: { type: 'table', title: 'GAM vs the street (estimates standing on 30-Sep-2026)', head: ['', 'GAM FY27E', 'GAM FY28E', 'GAM FY29E', 'HDFC Securities (6-Jan-26)', 'Jefferies (Mar-26)'], wide: [0], rows: [
      ['Revenue (₹ cr)', '{{F.sales.0|num}}', '{{F.sales.1|num}}', '{{F.sales.2|num}}', fmtSt(hsie, 'sales', n0), '17% CAGR FY26-28E (≈₹3,000 cr FY28E)'],
      ['EBITDA (₹ cr)', '{{F.ebitda.0|num}}', '{{F.ebitda.1|num}}', '{{F.ebitda.2|num}}', fmtSt(hsie, 'ebitda', n0), '20% CAGR FY26-28E'],
      ['Depreciation + interest (₹ cr)', n0(F.dep[0] + F.interest[0]), n0(F.dep[1] + F.interest[1]), n0(F.dep[2] + F.interest[2]), 'FY27: 231 / FY28: 256', '–'],
      ['EPS (₹)', n1(epsU[0]), n1(epsU[1]), n1(epsU[2]), fmtSt(hsie, 'eps', n1), '–'],
    ], source: 'GAM; HDFC Securities CRDMO thematic (6-Jan-2026; EPS = its PAT ÷ 21.0 cr shares); Jefferies via Whalesbook (12-Mar-2026)' } },
    { exhibit: { type: 'column', title: 'FY28E: our EBITDA is 2% below HDFC Securities, our EPS 22% below', unit: 'GAM as % of HDFC Securities FY28E', x: ['Revenue', 'EBITDA', 'EPS'], series: [{ name: 'GAM ÷ HSIE', values: [Math.round(F.sales[1] / hsie.sales.FY28E * 100), Math.round(F.ebitda[1] / hsie.ebitda.FY28E * 100), Math.round(epsU[1] / hsie.eps.FY28E * 100)], fmt: 'pct' }], labels: 'all', min: 0, max: 110, source: 'GAM; HDFC Securities (Jan-2026)' } },
    { exhibit: { type: 'table', title: 'Our main assumptions and why', head: ['Driver', 'FY27E', 'FY28E', 'FY29E', 'Why'], wide: [4], rows: [
      ...KEYS.map(kk => [`${LBL[kk]} growth`, ...BL.growth[kk].map(g => g + '%'), { cdmo: 'Q1 +6%; Bidar block from Q3; three new commercial molecules; 14 late-phase molecules convert from FY28', cro: 'Q1 +24%; new discovery capacity sold out; large-pharma integrated programmes' }[kk]]),
      ['Revenue (₹ cr)', ...LINES.cdmo.map((_, i) => n0(X.buildTot[i])), 'Sum of the two lines (= model revenue)'],
      ['EBITDA margin', '{{F.ebitdaMargin.0|pct}}', '{{F.ebitdaMargin.1|pct}}', '{{F.ebitdaMargin.2|pct}}', 'Screener basis; FY26 28.9% incl. a ~1.2pt reversal; guide 28-30% incl. forex'],
      ['Capex (₹ cr)', ...AS.capex.map(n0), 'FY27 guided ₹1,100-1,300 cr; FY28-29 not guided (Choutuppal, peptides)'],
      ['Depreciation (₹ cr)', ...F.dep.map(n0), `${AS.depRateOnGrossBlock}% of gross block; Choutuppal sits in CWIP until 2028`],
      ['Interest (₹ cr)', ...F.interest.map(n0), 'Bank debt + leases + other (built below)'],
      ['Tax rate', ...AS.taxRate.map(t => t + '%'), 'New regime'],
      ['Payout', ...AS.payout.map(t => t + '%'), 'No dividend since listing'],
    ], source: 'GAM Research (assumptions.json)' } },
    { exhibit: { type: 'table', title: 'Other income and interest: built from their parts (₹ crore)', head: ['', 'FY26 actual', 'FY27E', 'FY28E', 'FY29E', 'Basis'], wide: [5], rows: [
      ['Interest on cash and deposits', n1(X.OIN.FY26.depositInterest), ...oiTreas.map(n1), `${TY.toFixed(1)}% (FY26 realised) on average gross cash of ₹${GROSS.map(n0).join(' → ')} cr; we assume Sai keeps ~₹200 cr and borrows the rest`],
      ['Other small items', n1(X.OIN.FY26.amortisedCostInterest + X.OIN.FY26.fvtplGain + X.OIN.FY26.other), n1(MISC), n1(MISC), n1(MISC), 'FY26 ₹0.9 cr'],
      ['Forex gains', n1(X.OIN.FY26.forex), '0', '0', '0', 'Not forecast (in company EBITDA)'],
      { hl: true, cells: ['**Other income (model)**', `**${n1(OI26)}**`, ...AS.otherIncome.map(v => `**${n1(v)}**`), `Screener FY26 ₹40 cr (net of the ₹9 cr exceptional); twelve months to Jun-26 ₹${n0(ttmOi)} cr; Q1FY27 ₹3.5 cr`] },
      ['Interest on bank debt', n1(X.FCN.borrowings), ...intBorrow.map(n1), `${KD}% on average bank debt of ₹${BORR.map(n0).join(' → ')} cr (engine net debt + ₹200 cr cash − ₹${LEASES} cr leases)`],
      ['Lease interest', n1(X.FCN.leases), n1(LEASE_INT), n1(LEASE_INT), n1(LEASE_INT), `${LR.toFixed(1)}% (FY26) on ₹${LEASES} cr of leases, held flat`],
      ['Other finance costs', n1(X.FCN.other + X.FCN.msme), n0(OTHER_FIN), n0(OTHER_FIN), n0(OTHER_FIN), 'FY26 ₹5.0 cr'],
      { hl: true, cells: ['**Interest (model)**', `**${n1(X.FCN.total)}**`, ...AS.interest.map(v => `**${n1(v)}**`), 'Q1FY27 ₹8 cr; no capitalised interest assumed'] },
    ], source: 'AR FY26 notes 28 and 32; Q1FY27 deck; GAM (checked in SAILIFE.ctx.js)' } },
  ],
};

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street: Buy everywhere, targets ₹${n0(Math.min(...withTp.map(s => s.tp)))}-${n0(Math.max(...withTp.map(s => s.tp)))}, all disclosed methods EV/EBITDA; the stock ran past most targets set before August`,
  blocks: [
    { p: `Two notes are dated after the Q1FY27 results: Jefferies raised its target to ₹${n0(jef.tp)} from ₹1,270 (Buy, 12-Aug-2026; its top Indian CRDMO pick) and Kotak to ₹${n0(kot.tp)} (Buy, 10-Aug-2026, per a tracker). Older notes still standing: Morgan Stanley Overweight ₹${n0(ms.tp)} (Apr-2026), JM Financial Buy ₹${n0(jm.tp)} (Feb-2026) and HDFC Securities Buy ₹${n0(hsie.tp)} (Jan-2026). Every broker that discloses a method uses **EV/EBITDA**: HDFC Securities 29x Q3FY28E, JM Financial 32x Sep-27E (Nov-2025) and Jefferies, whose initiation used 27x FY27 pre-Ind AS EV/EBITDA. The median target is ₹${n0(medTp)} (₹${n0(medTpPost)} for the two post-Q1 notes), against ₹${n0(price)} on 30-Sep-2026: the stock rose ~60% between April and September while most targets stood still. Notes from other brokers could not be retrieved (gap).` },
    { exhibit: { type: 'table', title: 'The street on 30-Sep-2026', head: ['Broker', 'Date', 'Rating', 'Target (₹)', 'Method', 'vs CMP', 'Thesis'], wide: [6], rows: [
      ...ST.map(s => [s.broker, shortDate(s.date), s.rating, n0(s.tp), s.method ? `${s.method} ${s.multiple}${s.on && s.on !== 'n.d.' ? ' ' + s.on : ''}` : 'n.d.', X.pc((s.tp / price - 1) * 100), rup(s.thesis)]),
      { hl: true, cells: ['**GAM Research**', '30-Sep-26', `**${rating}**`, '**{{dcf.tp|num}}**', `**EV/EBITDA ${MULT.base}x Sep-28E**`, '{{dcf.upside|chg}}', 'Good franchise; EBITDA in line with the street but EPS diluted by capex; own forward EV/EBITDA × the sector\'s move'] },
    ], source: rup(D.street.note) } },
    { exhibit: { type: 'table', title: 'The EV/EBITDA brokers\' multiples on our numbers', head: ['Broker', 'Multiple and year', 'Value on our EBITDA and net debt (₹)', 'Their target (₹)'], rows: [
      ['HDFC Securities', '29x Q3FY28E (≈ ¼ FY27E + ¾ FY28E)', n0(atHsie), n0(hsie.tp)],
      ['JM Financial (Nov-2025)', '32x Sep-27E (½ FY27E + ½ FY28E)', n0(atJm2), '1,197 (Nov-25); 1,318 (Feb-26)'],
      { hl: true, cells: ['**GAM**', `**${MULT.base}x Sep-28E**`, '**{{dcf.tp|num}}**', ''] },
    ], source: 'Broker notes; GAM' } },
    { p: `**Where we stand.** Our EBITDA is close to the street's; our multiple is the street's (EV/EBITDA, ~29x); the difference is time and the price. Sai's own one-year-forward EV/EBITDA since Jul-2025 has a median of ${n1(EVH.med)}x and pharma peers moved ${SECTOR_EV}% above their own medians over the same window, which gives ${MULT.base}x. At ₹${n0(price)} the stock trades at ${n1(X.evNowFwd)}x our FY28E EBITDA, a level it touched only in the last month of the window. The brokers that raised targets in August did so by rolling forward and lifting multiples; we do not lift ours.` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument'], rows: D.critiques.map(c => [rup(c)]), source: 'Broker notes, earnings calls and filings to 30-Sep-2026; GAM Research' } },
  ],
};

module.exports = { q1, forecasts, street };
