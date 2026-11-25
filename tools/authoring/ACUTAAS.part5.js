// Acutaas Chemicals report, part 5: Q1FY27 and guidance, our forecasts vs the street (the street view is in part5c).
const X = require('./ACUTAAS.ctx');
const { C, F, A, AS, n0, n1, rup, Q1, YRS, KEYS, LBL, BL, LINES, oiTreas, TY, MISC, cashPath, OI26, OIN, ttmOi, yld26, yldQ1, intBuild, KD, OTHER_FIN, BORR, epsU, pll, hsie, sbi, CONS } = X;
const P5c = require('./ACUTAAS.part5c');
const q0 = Q1.q1fy26;

const q1 = {
  id: 'guidance', nav: 'Q1FY27 & guidance', kicker: 'Momentum', title: 'Q1FY27: revenue +59%, EBITDA ×2.2, profit +70%; battery supplies started; 25% growth guidance kept',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (₹ crore)', head: ['', 'Q1FY26', 'Q1FY27', 'Change'], rows: [
      ['Revenue from operations', n1(q0.revenue), n1(Q1.revenue), `+${Q1.revenueGrowthPct}%`],
      ['  Advanced pharma intermediates', n1(q0.pharma), n1(Q1.pharma), `+${Q1.pharmaGrowthPct}%`],
      ['  Specialty chemicals', n1(q0.specialty), n1(Q1.specialty), `${Q1.specialtyGrowthPct}%`],
      ['Gross margin', `${q0.grossMarginPct}%`, `${Q1.grossMarginPct}%`, '+466bp (CDMO mix)'],
      ['EBITDA (before other income)', n1(q0.ebitda), n1(Q1.ebitda), `margin ${Q1.ebitdaMarginPct}% (${q0.ebitdaMarginPct}%)`],
      ['Other income', n1(q0.otherIncome), n1(Q1.otherIncome), 'Forex gains ₹0.1 cr (vs ~₹10 cr in Q4FY26)'],
      ['Depreciation', '8.1', n1(Q1.dep), '+21%'],
      ['Tax rate', '24.2%', `${Q1.taxRatePct}%`, 'Subsidiary losses get no tax credit'],
      { hl: true, cells: ['**Net profit (company)**', `**${n1(q0.pat)}**`, `**${n1(Q1.pat)}**`, `**+${Q1.patGrowthPct}%**`] },
      ['Net cash (quarter-end)', '–', n0(Q1.netCash), '₹198 cr at Mar-26'],
    ], source: 'Q1FY27 investor presentation (24-Jul-2026) and call; Screener.in' } },
    { bullets: Q1.commentary.map(c => rup(c)) },
    { exhibit: { type: 'table', title: 'What management has guided, and what happened', head: ['Guidance history'], rows: C.guidance.history.map(g => [rup(g)]), source: 'Earnings calls May-2025 to Jul-2026' } },
    { callout: '**Why it matters:** Q1 is always Acutaas\'s weakest quarter, so a 59% rise is strong evidence that FY27 will at least meet the 25% guide; the street (PL, HSIE, SBICAP) already models 27-32%. The margin dipped from Q4 as usual, and other income collapsed without forex gains, which is why profit grew less than EBITDA. The things to watch are not volumes but mix: how fast battery revenue (low margin) grows against CDMO (high margin).' },
  ],
};

const STREET_F = [['PL (24-Jul)', pll], ['SBICAP (27-Aug)', sbi], ['HSIE (21-Sep)', hsie]];
const fmtSt = (s, key, f) => (s[key] ? Object.entries(s[key]).filter(([y]) => /FY2[789]E/.test(y)).map(([y, v]) => `${y.slice(0, 4)}: ${f(v)}`).join(' / ') : '–');
const forecasts = {
  id: 'forecasts', nav: 'Forecasts vs the street', kicker: 'Forecasts', title: `Our forecasts: EPS ₹${n1(epsU[0])} / ${n1(epsU[1])} / ${n1(epsU[2])}, below the street mainly on other income and FY28-29 margins`,
  blocks: [
    { p: `We forecast revenue of {{F.sales.0|num}} / {{F.sales.1|num}} / {{F.sales.2|num}} cr for FY27-29E (+{{F.salesGrowth.0|pct}} / +{{F.salesGrowth.1|pct}} / +{{F.salesGrowth.2|pct}}), an EBITDA margin of {{F.ebitdaMargin.0|pct}} / {{F.ebitdaMargin.1|pct}} / {{F.ebitdaMargin.2|pct}} and EPS of ₹${n1(epsU[0])} / ${n1(epsU[1])} / ${n1(epsU[2])}. FY27 revenue is in line with the 25% guide; our EPS sits below the street because (1) we forecast other income of only ₹${n1(AS.otherIncome[0])} cr in FY27 against PL's ₹53 cr and HSIE's ₹28 cr (FY26 included ₹32.5 cr of forex gains), and (2) we let the margin ease to 34.5% by FY29 as battery additives grow, where HSIE has 36.4%. Consensus EPS (Bloomberg, via HSIE) is ₹${CONS.FY27E} / ₹${CONS.FY28E} for FY27-28E.` },
    { exhibit: { type: 'table', title: 'GAM vs the street (estimates standing on 30-Sep-2026)', head: ['', 'GAM FY27E', 'GAM FY28E', 'GAM FY29E', ...STREET_F.map(s => s[0])], wide: [0], rows: [
      ['Revenue (₹ cr)', '{{F.sales.0|num}}', '{{F.sales.1|num}}', '{{F.sales.2|num}}', ...STREET_F.map(([, s]) => fmtSt(s, 'sales', n0))],
      ['EBITDA (₹ cr)', '{{F.ebitda.0|num}}', '{{F.ebitda.1|num}}', '{{F.ebitda.2|num}}', ...STREET_F.map(([, s]) => fmtSt(s, 'ebitda', n0))],
      ['EPS (₹)', n1(epsU[0]), n1(epsU[1]), n1(epsU[2]), ...STREET_F.map(([, s]) => fmtSt(s, 'eps', n1))],
    ], source: 'GAM; PL (24-Jul-2026), SBICAP (27-Aug-2026, DSIJ summary; EPS from its PAT ÷ 8.19 cr shares), HSIE (21-Sep-2026). Bloomberg consensus EPS FY27E ₹54.9 / FY28E ₹72.7 (HSIE)' } },
    { exhibit: { type: 'column', title: 'FY28E EPS: GAM at the low end of the street', unit: 'FY28E EPS (₹)', x: ['SBICAP', 'Consensus', 'PL', 'HSIE', 'GAM'], series: [{ name: 'FY28E EPS', values: [sbi.eps.FY28E, CONS.FY28E, pll.eps.FY28E, hsie.eps.FY28E, Math.round(epsU[1] * 10) / 10], fmt: 'n1' }], labels: 'all', highlight: 'GAM', source: 'Broker notes; GAM' } },
    { exhibit: { type: 'table', title: 'Our main assumptions and why', head: ['Driver', 'FY27E', 'FY28E', 'FY29E', 'Why'], wide: [4], rows: [
      ...KEYS.map(kk => [`${LBL[kk]} (₹ cr)`, ...LINES[kk].map(n0), { cdmo: 'Nubeqa growth; ₹1,000 cr guide in FY28; four new molecules', exCdmo: 'Reshuffle done; apixaban generics', battery: '4,000 MT contracted over three years', semis: 'BFC recovers; Indichem from FY28', commodity: 'Phased out in FY27, replaced on the same plant' }[kk]]),
      ['Revenue (₹ cr)', ...X.buildTot.map(n0), 'Sum of the five lines (= model revenue)'],
      ['EBITDA margin', '{{F.ebitdaMargin.0|pct}}', '{{F.ebitdaMargin.1|pct}}', '{{F.ebitdaMargin.2|pct}}', 'Guide "similar" to FY26 for FY27; battery mix after'],
      ['Capex (₹ cr)', ...AS.capex.map(n0), '~₹95 cr guided for FY27 + electronics plant + R&D centre/land allowance'],
      ['Depreciation (₹ cr)', ...F.dep.map(n0), `${AS.depRateOnGrossBlock}% of gross block incl. capex`],
      ['Tax rate', ...AS.taxRate.map(t => t + '%'), 'Subsidiary losses shrink'],
      ['Payout', ...AS.payout.map(t => t + '%'), '₹2.50 a share for FY26'],
    ], source: 'GAM Research (assumptions.json)' } },
    { exhibit: { type: 'table', title: 'Other income: built from its parts (₹ crore)', head: ['', 'FY26 actual', 'FY27E', 'FY28E', 'FY29E', 'Basis'], wide: [5], rows: [
      ['Treasury income', n1(OIN.FY26.interest), ...oiTreas.map(n1), `${TY}% on average net cash (₹${cashPath.map(n0).join(' → ')} cr, Mar-26 to Mar-29E, engine basis); FY26 earned ${n1(yld26)}% on average cash and bank balances, Q1FY27 ${n1(yldQ1)}% annualised on net cash`],
      ['Forex gains', n1(OIN.FY26.forex), '0', '0', '0', 'Not forecast (Q1FY27 ₹0.1 cr)'],
      ['Asset sales, ECL reversal, other', n1(OIN.FY26.assetSale + OIN.FY26.eclReversal), n1(MISC), n1(MISC), n1(MISC), 'Small'],
      { hl: true, cells: ['**Total (model)**', `**${n1(OI26)}**`, ...AS.otherIncome.map(v => `**${n1(v)}**`), `Twelve months to Jun-26: ₹${n1(ttmOi)} cr (Screener); the FY27E drop is the forex gain`] },
    ], source: 'AR FY26 note 27; Q1FY27 call; GAM (checked in ACUTAAS.ctx.js)' } },
    { p: `**Interest** is built the same way: ${KD}% on average borrowings (₹${BORR.map(n0).join(' → ')} cr) plus ~₹${OTHER_FIN} cr of lease interest and other finance costs = ₹${intBuild.map(n1).join(' / ')} cr (FY26 ₹3.3 cr; Q1FY27 ₹1.1 cr). Minorities (BFC 45%, Indichem 25%, the electrolyte subsidiary 10%) are below 1% of our profit and are not modelled separately.` },
  ],
};

module.exports = { q1, forecasts, street: P5c.street };
