// Neuland Laboratories report, part 5: Q1FY27 and guidance, our forecasts vs the street (the street view is in part5c).
const X = require('./NEULANDLAB.ctx2');
const { C, F, A, AS, n0, n1, rup, Q1, YRS, KEYS, LBL, BL, LINES, oiTreas, TY, MISC, cashPath, grossPath, DEBT, LEASE, OI26, OIN, ttmOi, yld26, intBuild, KD, KL, OTHER_FIN, epsU, nuv, gs } = X;
const P5c = require('./NEULANDLAB.part5c');
const q0 = Q1.q1fy26, q4 = Q1.q4fy26;

const q1 = {
  id: 'guidance', nav: 'Q1FY27 & guidance', kicker: 'Momentum', title: 'Q1FY27: revenue +119%, EBITDA ×5, profit ×11 on CMS commercial molecules; no formal guidance, but "about 20%" growth for FY27 and FY28',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (₹ crore)', head: ['', 'Q1FY26', 'Q4FY26', 'Q1FY27', 'YoY'], rows: [
      ['Revenue from operations', n0(q0.revenue), n0(q4.revenue), n1(Q1.revenue), `+${Q1.revenueGrowthPct}%`],
      ['  CMS (commercial + development)', String(q0.cms), String(q4.cms), `${Q1.cms} (${Q1.cmsCommercial} + ${Q1.cmsDevelopment})`, `×${n1(Q1.cms / q0.cms)}`],
      ['  Prime + Specialty APIs (from disclosed shares)', n0(X.SQ[4].prime + X.SQ[4].specialty), n0(X.SQ[7].prime + X.SQ[7].specialty), n0(X.SQ[8].prime + X.SQ[8].specialty), `+${Math.round(((X.SQ[8].prime + X.SQ[8].specialty) / (X.SQ[4].prime + X.SQ[4].specialty) - 1) * 100)}%`],
      ['Gross margin (company, after manufacturing costs)', `${q0.grossMarginCompanyPct}%`, `${q4.grossMarginCompanyPct}%`, `${Q1.grossMarginCompanyPct}%`, '+590bp (mix)'],
      ['EBITDA before other income (Screener)', '34', '307', String(Q1.ebitdaScreener), `margin ${n1(Q1.ebitdaScreener / Q1.revenue * 100)}% (11.6%)`],
      ['EBITDA incl. other income (company)', n1(q0.ebitdaCompanyInclOI), n1(q4.ebitdaCompanyInclOI), n1(Q1.ebitdaCompanyInclOI), `margin ${Q1.ebitdaMarginCompanyPct}% (${q0.ebitdaMarginCompanyPct}%)`],
      { hl: true, cells: ['**Net profit**', `**${n1(q0.pat)}**`, `**${n1(q4.pat)}**`, `**${n1(Q1.pat)}**`, `**EPS ₹${Q1.eps}**`] },
      ['Net cash (quarter-end, company)', '164.7', '156.8', n1(Q1.netCash), 'Working capital 84 days (137 at Mar-26)'],
    ], source: 'Q1FY27 investor presentation (5-Aug-2026) and call; Q4FY26 deck; Screener.in' } },
    { bullets: Q1.commentary.map(c => rup(c)) },
    { exhibit: { type: 'table', title: 'What management has said, and what happened', head: ['Guidance history'], rows: C.guidance.history.map(g => [rup(g)]), source: 'Earnings calls (May-2026, Aug-2026)' } },
    { callout: `**Why it matters:** Q1FY27 was strong, but it follows a Q4FY26 that management calls inflated, and the company gives no formal guidance. The ~20% growth "aspiration" for FY27-28 and the "25% plus" margin plan are conservative anchors that FY26-Q1FY27 beat. With Q1 at ₹642 cr, FY27 at +20% needs Q2-Q4 only ~3% above a year earlier; the debate is FY28 and beyond, when today's few molecules must be joined by new ones.` },
  ],
};

const fmtSt = (s, key, f) => (s?.[key] ? Object.entries(s[key]).filter(([y]) => /FY2[789]E/.test(y)).map(([y, v]) => `${y.slice(0, 4)}: ${f(v)}`).join(' / ') : '–');
const forecasts = {
  id: 'forecasts', nav: 'Forecasts vs the street', kicker: 'Forecasts', title: `Our forecasts: EPS ₹${n1(epsU[0])} / ${n1(epsU[1])} / ${n1(epsU[2])}, below Nuvama's Dec-2025 numbers on revenue and margin`,
  blocks: [
    { p: `We forecast revenue of {{F.sales.0|num}} / {{F.sales.1|num}} / {{F.sales.2|num}} cr for FY27-29E (+{{F.salesGrowth.0|pct}} / +{{F.salesGrowth.1|pct}} / +{{F.salesGrowth.2|pct}}), an EBITDA margin of {{F.ebitdaMargin.0|pct}} / {{F.ebitdaMargin.1|pct}} / {{F.ebitdaMargin.2|pct}} and EPS of ₹${n1(epsU[0])} / ${n1(epsU[1])} / ${n1(epsU[2])}. FY27 matches management's ~20% aspiration; FY28-29 sit below its 18-20% five-year aim because the commercial CMS base is concentrated and peptides start small. The only full set of street estimates we found is Nuvama's (9-Dec-2025, before Q4FY26 and Q1FY27): EPS ₹${nuv.eps.FY27E} / ₹${nuv.eps.FY28E} for FY27-28E on revenue of ₹${n0(nuv.sales.FY27E)} / ${n0(nuv.sales.FY28E)} cr and a 32% margin. We are ${Math.round((1 - epsU[0] / nuv.eps.FY27E) * 100)}% / ${Math.round((1 - epsU[1] / nuv.eps.FY28E) * 100)}% lower, on less revenue in FY27 and lower margins. Goldman Sachs (May-2026) expects 20%+ revenue and 25%+ EBITDA growth a year over FY26-28E; our EBITDA grows ~${Math.round(X.ebitdaCagr)}% a year over FY26-29E.` },
    { exhibit: { type: 'table', title: 'GAM vs the street (latest estimates we could find)', head: ['', 'GAM FY27E', 'GAM FY28E', 'GAM FY29E', 'Nuvama (9-Dec-25)', 'Goldman (13-May-26)'], wide: [0], rows: [
      ['Revenue (₹ cr)', '{{F.sales.0|num}}', '{{F.sales.1|num}}', '{{F.sales.2|num}}', fmtSt(nuv, 'sales', n0), '20%+ CAGR FY26-28E'],
      ['EBITDA (₹ cr)', '{{F.ebitda.0|num}}', '{{F.ebitda.1|num}}', '{{F.ebitda.2|num}}', fmtSt(nuv, 'ebitda', n0), '25%+ CAGR FY26-28E'],
      ['EPS (₹)', n1(epsU[0]), n1(epsU[1]), n1(epsU[2]), fmtSt(nuv, 'eps', n1), 'FY27-29E raised up to 8%'],
    ], source: 'GAM; Nuvama company update (9-Dec-2025, original PDF); Goldman Sachs via news summaries (13-May-2026). No consensus EPS standing on 30-Sep-2026 was available to us.' } },
    { exhibit: { type: 'table', title: 'Our main assumptions and why', head: ['Driver', 'FY27E', 'FY28E', 'FY29E', 'Why'], wide: [4], rows: [
      ...KEYS.map(kk => [`${LBL[kk]} (₹ cr)`, ...LINES[kk].map(n0), { cms: 'Q1 ₹438 cr; ~3 molecules; one launch a year', prime: 'Ezetimibe; price pressure', specialty: 'Paliperidone recovery; Gland collaboration', others: 'With the business' }[kk]]),
      ['Revenue (₹ cr)', ...X.buildTot.map(n0), 'Sum of the four lines (= model revenue)'],
      ['EBITDA margin', '{{F.ebitdaMargin.0|pct}}', '{{F.ebitdaMargin.1|pct}}', '{{F.ebitdaMargin.2|pct}}', 'Mix and leverage up; new plants, FX down'],
      ['Capex (₹ cr)', ...AS.capex.map(n0), '₹590 cr committed + land and new blocks'],
      ['Depreciation (₹ cr)', ...F.dep.map(n0), `${AS.depRateOnGrossBlock}% of gross block incl. capex`],
      ['Tax rate', ...AS.taxRate.map(t => t + '%'), 'FY26 25.6%'],
      ['Payout', ...AS.payout.map(t => t + '%'), '₹34 a share for FY26'],
    ], source: 'GAM Research (assumptions.json)' } },
    { exhibit: { type: 'table', title: 'Other income: built from its parts (₹ crore)', head: ['', 'FY26 actual', 'FY27E', 'FY28E', 'FY29E', 'Basis'], wide: [5], rows: [
      ['Treasury income (interest + fund gains)', n1(OIN.FY26.interestFd + OIN.FY26.interestDeposits + OIN.FY26.mfGain), ...oiTreas.map(n1), `${TY}% on average gross cash (₹${grossPath.map(n0).join(' → ')} cr) = engine net cash (₹${cashPath.map(n0).join(' → ')} cr, after leases) + debt (₹${DEBT.map(n0).join(' → ')} cr) + leases (₹${LEASE.map(n0).join(' → ')} cr); FY26 earned ${n1(yld26)}%`],
      ['Forex gains', n1(OIN.FY26.forex), '0', '0', '0', 'Not forecast'],
      ['Write-backs and claims', n1(OIN.FY26.writeBacks), n1(MISC), n1(MISC), n1(MISC), 'FY25 ₹1.6 cr, FY26 ₹2.0 cr'],
      { hl: true, cells: ['**Total (model)**', `**${n1(OI26)}**`, ...AS.otherIncome.map(v => `**${n1(v)}**`), `Screener FY26 ₹24.9 cr (net of a ₹5.3 cr asset-sale loss); twelve months to Jun-26 ₹${n1(ttmOi)} cr; the FY27E drop is the forex gain`] },
    ], source: 'AR FY26 notes 21, 28; GAM (checked in NEULANDLAB.ctx.js)' } },
    { p: `**Interest** is built the same way: ${KD}% on average bank debt (₹${DEBT.map(n0).join(' → ')} cr, rising as capex is partly debt-funded) plus ${KL}% on average lease liabilities (₹${LEASE.map(n0).join(' → ')} cr) plus ~₹${OTHER_FIN} cr of other borrowing costs = ₹${intBuild.map(n1).join(' / ')} cr (FY26 ₹23.9 cr; Q1FY27 ₹7 cr). Neuland has no minorities, so EPS = net profit ÷ 1.283 cr shares.` },
  ],
};

module.exports = { q1, forecasts, street: P5c.street };
