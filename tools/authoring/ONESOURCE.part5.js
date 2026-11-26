// OneSource report, part 5: Q1FY27 and guidance, our forecasts vs the street (other income and interest builds), the street.
const X = require('./ONESOURCE.ctx');
const { C, D, F, A, AS, n0, n1, rup, Q1, FY26, YRS, KEYS, LBL, BL, LINES, oiTreas, oiBuild, TY, BUF, UNWIND, SCRAP, SUPPORT, OIN, cashPath, intBuild, KD, LEASE_INT, BANK, CAPZ, epsU, epsAdj, sep, ST, isec, jm, sbi, dam, inv, withTp, medTp, atOurs, rating, EVM, EVH, kev, SECTOR_EV, shortDate, price, ebitdaSep } = X;

const q1 = {
  id: 'guidance', nav: 'Q1FY27 & guidance', kicker: 'Momentum', title: 'Q1FY27: revenue +37%, EBITDA +39%, first meaningful reported profit; FY28 target reaffirmed, still no FY27 number',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (₹ crore)', head: ['', 'Q1FY26', 'Q4FY26', 'Q1FY27', 'YoY'], rows: [
      ['Revenue from operations', '327.3', '428.2', n1(Q1.revenue), `+${Q1.revenueGrowthPct}%`],
      ['Gross margin', '71.6%', '65.8%', `${Q1.grossMarginPct}%`, ''],
      ['EBITDA (before other income)', '88.5', '91.9', n1(Q1.ebitda), '+39%'],
      ['EBITDA margin', '27.0%', '21.5%', `${Q1.ebitdaPct}%`, '+43bp'],
      ['Finance costs / depreciation', '27 / 68', '23 / 72', `${Q1.financeCost} / ${Q1.da}`, ''],
      ['Exceptional items', '−2.9', '0.0', n1(Q1.exceptional), 'Prestige arbitration legal costs'],
      { hl: true, cells: ['**Reported net profit**', '**−0.2**', '**4.6**', `**${n1(Q1.pat)}**`, 'Tax credit of ~₹5 cr'] },
      ['Company adjusted PAT', '37.1', '39.0', n1(Q1.adjPat), '+72%'],
    ], source: 'Q1FY27 deck (24-Jul-2026); Q4FY26 deck; Screener.in' } },
    { bullets: Q1.commentary.map(c => rup(c)) },
    { exhibit: { type: 'table', title: 'What management has guided, and what happened', head: ['Guidance history'], rows: C.guidance.history.map(g => [g]), source: 'JM Financial (6-May-2025); Q2FY26 deck; Q3FY26, Q4FY26 and Q1FY27 calls' } },
    { callout: `**Why it matters:** Q1FY27 is the first quarter that looks like the plan, but it was achieved on one line. The FY28 target (~US$400m, ~₹3,780 cr at ₹94.5/US$) needs revenue to grow ~2.1x from the Q1FY27 annualised run-rate of ~₹${n0(Q1.revenue * 4)} cr in seven quarters. Management says the Q4FY27 exit run-rate will be "a good reflection" of FY28; that is the number to watch.` },
  ],
};

const STREET_F = [['ICICI Sec (6-Sep-26)', isec], ['SBICAP (5-Jan-26)', sbi], ['JM (6-May-25)', jm]];
const fmtSt = (s, key, f) => s[key] ? Object.entries(s[key]).filter(([y]) => /FY2[78]E/.test(y)).map(([y, v]) => `${y.slice(0, 4)}: ${f(v)}`).join(' / ') : '–';
const forecasts = {
  id: 'forecasts', nav: 'Forecasts vs the street', kicker: 'Forecasts', title: `Our forecasts: EBITDA ₹{{F.ebitda.0|num}} / {{F.ebitda.1|num}} / {{F.ebitda.2|num}} cr, 15-40% below the street for FY27-28 because we assume the ramp runs a year late`,
  blocks: [
    { p: `We forecast revenue of ₹{{F.sales.0|num}} / {{F.sales.1|num}} / {{F.sales.2|num}} cr for FY27-29E (+{{F.salesGrowth.0|pct}} / +{{F.salesGrowth.1|pct}} / +{{F.salesGrowth.2|pct}}), EBITDA margins of {{F.ebitdaMargin.0|pct}} / {{F.ebitdaMargin.1|pct}} / {{F.ebitdaMargin.2|pct}} and reported EPS of ₹${n1(epsU[0])} / ${n1(epsU[1])} / ${n1(epsU[2])} (₹${n1(epsAdj[0])} / ${n1(epsAdj[1])} / ${n1(epsAdj[2])} before the scheme amortisation, after its tax effect). Our FY28E revenue is ~18% below the US$400m target and our FY29E roughly equals it. EPS is held back by ₹138 cr a year of amortisation, ~₹105-140 cr of interest and, from FY29E, a full tax rate; the street's "adjusted" EPS adds back amortisation and assumes lower tax.` },
    { exhibit: { type: 'table', title: 'GAM vs the street (estimates standing on 30-Sep-2026)', head: ['', 'GAM FY27E', 'GAM FY28E', 'GAM FY29E', ...STREET_F.map(s => s[0])], wide: [0], rows: [
      ['Revenue (₹ cr)', '{{F.sales.0|num}}', '{{F.sales.1|num}}', '{{F.sales.2|num}}', ...STREET_F.map(([, s]) => fmtSt(s, 'sales', n0))],
      ['EBITDA (₹ cr)', '{{F.ebitda.0|num}}', '{{F.ebitda.1|num}}', '{{F.ebitda.2|num}}', ...STREET_F.map(([, s]) => fmtSt(s, 'ebitda', n0))],
      ['EPS (₹; street adjusted)', `${n1(epsU[0])} (${n1(epsAdj[0])} adj.)`, `${n1(epsU[1])} (${n1(epsAdj[1])} adj.)`, `${n1(epsU[2])} (${n1(epsAdj[2])} adj.)`, ...STREET_F.map(([, s]) => fmtSt(s, 'eps', n1))],
    ], source: 'GAM; ICICI Securities (6-Sep-2026, DSIJ summary; adjusted EPS); SBICAP (5-Jan-2026, before the Q3FY26 miss); JM Financial (6-May-2025). Guidance FY28: ~US$400m revenue, ~US$160m EBITDA' } },
    { exhibit: { type: 'column', title: 'FY28E EBITDA: GAM well below the street and guidance', unit: 'FY28E EBITDA (₹ crore)', x: ['Guidance (US$160m at ₹94.5)', 'ICICI Securities', 'SBICAP', 'JM (May-25)', 'GAM'], series: [{ name: 'FY28E EBITDA', values: [1512, isec.ebitda.FY28E, sbi.ebitda.FY28E, jm.ebitda.FY28E, Math.round(F.ebitda[1])], fmt: 'num' }], labels: 'all', highlight: 'GAM', source: 'Company; broker notes; GAM' } },
    { exhibit: { type: 'table', title: 'Our main assumptions and why', head: ['Driver', 'FY27E', 'FY28E', 'FY29E', 'Why'], wide: [4], rows: [
      ...KEYS.map(kk => [`${LBL[kk]} growth`, ...BL.growth[kk].map(g => `${n0(g)}%`), { ddc: 'Line 2 from Q2FY27, line 3 within FY27, line 4 in FY28; Brazil/MENA from H2FY27', core: 'Injectables shutdown in FY27; new capacity and full soft-gel plant in FY28' }[kk]]),
      ['Revenue (₹ cr)', ...X.buildTot.map(n0), 'Sum of the two lines (= model revenue)'],
      ['EBITDA margin', '{{F.ebitdaMargin.0|pct}}', '{{F.ebitdaMargin.1|pct}}', '{{F.ebitdaMargin.2|pct}}', 'Fixed costs already built for three lines; no forex gains'],
      ['Capex (₹ cr)', ...AS.capex.map(n0), 'US$100m programme ~80% committed; biologics, soft-gel greenfield, fourth line'],
      ['Depreciation & amortisation (₹ cr)', ...F.dep.map(n0), 'Incl. ₹137.8 cr scheme amortisation a year'],
      ['Tax rate', ...AS.taxRate.map(t => `${t}%`), '₹448 cr of unrecognised tax losses; full rate from FY29E'],
    ], source: 'GAM Research (assumptions.json)' } },
    { exhibit: { type: 'table', title: 'Other income and interest: built from their parts (₹ crore)', head: ['', 'FY26 actual', 'FY27E', 'FY28E', 'FY29E', 'Basis'], wide: [5], rows: [
      ['Interest on the cash buffer', n1(OIN.FY26.interest), ...oiTreas.map(n1), `${TY}% on ~₹${BUF} cr of cash and margin money (Mar-26 ₹97.6 cr); net debt, so no treasury book`],
      ['Deposit unwinding, scrap, support services', n1(OIN.FY26.depositUnwind + OIN.FY26.scrap + OIN.FY26.supportServices), ...YRS.map(() => n1(UNWIND + SCRAP + SUPPORT)), 'FY26 levels (support services from promoter-group entities)'],
      ['One-offs (investment gains, tax-refund interest)', n1(OIN.FY26.investmentGains + OIN.FY26.taxRefundInterest), '0', '0', '0', 'Not forecast'],
      { hl: true, cells: ['**Other income (model)**', `**${n1(OIN.FY26.total)}**`, ...AS.otherIncome.map(v => `**${n1(v)}**`), `Twelve months to Jun-26 ₹${n1(OIN.ttmJun26)} cr; FY26 interest was earned on a larger cash balance (₹301 cr at Mar-25)`] },
      ['Finance costs (model)', '122.2', ...AS.interest.map(n1), `${KD}% on average borrowings (engine net debt ₹${cashPath.map(v => n0(-v)).join(' → ')} cr + ₹${BUF} cr cash) + ₹${LEASE_INT} cr lease interest + ₹${BANK} cr bank charges − ₹${CAPZ[0]} cr capitalised in FY27E`],
    ], source: 'AR FY26 notes 21, 24; Screener.in; GAM (checked in ONESOURCE.ctx.js)' } },
  ],
};

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street: all Buys, targets ₹${n0(Math.min(...withTp.map(s => s.tp)))}-${n0(Math.max(...withTp.map(s => s.tp)))}, mostly on EV/EBITDA; the debate is timing, not direction`,
  blocks: [
    { p: `The most recent note we found is ICICI Securities' 6-Sep-2026 update: Buy, ₹${n0(isec.tp)} on a sum of the parts at ${isec.multiple} FY28E EBITDA. Older notes still standing: SBICAP Buy ₹${n0(sbi.tp)} (Jan-2026, no method stated), JM Financial Buy ₹${n0(jm.tp)} (22x Sep-27E EV/EBITDA, Nov-2025), DAM Capital Buy ₹${n0(dam.tp)} (30x FY28E EPS, Jun-2025) and Investec Buy ₹${n0(inv.tp)} (23x FY27E EV/EBITDA, May-2025). Of the four that disclose a method, three use **EV/EBITDA**. The median target is ₹${n0(medTp)} against ₹${n0(price)} on 30-Sep-2026; most targets were set before the Q3FY26 miss and have not been visibly cut. Kotak and CLSA analysts ask questions on the calls, but we could not retrieve their notes (gap).` },
    { exhibit: { type: 'table', title: 'The street on 30-Sep-2026', head: ['Broker', 'Date', 'Rating', 'Target (₹)', 'Method', 'FY28E EBITDA (₹ cr)', 'Thesis'], wide: [6], rows: [
      ...ST.map(s => [s.broker, shortDate(s.date), s.rating, n0(s.tp), s.method ? `${s.method} ${s.multiple} ${s.on}` : 'n.d.', s.ebitda?.FY28E ? n0(s.ebitda.FY28E) : '–', rup(s.thesis)]),
      { hl: true, cells: ['**GAM Research**', '30-Sep-26', `**${rating}**`, '**{{dcf.tp|num}}**', `**EV/EBITDA ${EVM.base}x Sep-28E**`, '**{{F.ebitda.1|num}}**', 'Real capacity, late ramp; own post-break forward multiple'] },
    ], source: rup(D.street.note) } },
    { exhibit: { type: 'table', title: "The brokers' multiples on our numbers", head: ['Broker', 'Multiple and year', 'Value on our estimates (₹)', 'Their target (₹)'], rows: [
      ['ICICI Securities', '16-19x FY28E EV/EBITDA', `${n0(Math.round(atOurs.isecLo / 10) * 10)}-${n0(Math.round(atOurs.isecHi / 10) * 10)}`, n0(isec.tp)],
      ['JM Financial', '22x Sep-27E EV/EBITDA', n0(Math.round(atOurs.jm / 10) * 10), n0(jm.tp)],
      ['Investec', '23x FY27E EV/EBITDA', n0(Math.round(atOurs.inv / 10) * 10), n0(inv.tp)],
      ['DAM Capital', '30x FY28E EPS', `${n0(Math.round(atOurs.dam / 10) * 10)} (reported) / ${n0(Math.round(atOurs.damAdj / 10) * 10)} (before amortisation)`, n0(dam.tp)],
      { hl: true, cells: ['**GAM**', `**${EVM.base}x Sep-28E EV/EBITDA**`, '**{{dcf.tp|num}}**', ''] },
    ], source: 'Broker notes; GAM' } },
    { p: `**Where we stand.** The gap to the street is mostly in the numbers, not the multiple: applied to our lower EBITDA, each EV/EBITDA broker's own multiple gives ₹${n0(Math.round(atOurs.inv / 10) * 10)}-${n0(Math.round(atOurs.isecHi / 10) * 10)} (our target: {{dcf.tp|inr}}). Our ${EVM.base}x on Sep-28E is lower than the 22-23x the brokers used on earlier years, because the forward multiple falls as the earnings year moves past the ramp (OneSource's own forward EV/EBITDA since 13-May-2026, on FY28E, has a median of ${n1(EVH.med)}x).` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument'], rows: D.critiques.map(c => [rup(c)]), source: 'Broker notes, earnings calls and filings to 30-Sep-2026; GAM' } },
  ],
};

module.exports = { q1, forecasts, street };
