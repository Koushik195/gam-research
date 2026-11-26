// Syngene report, part 5: Q1FY27 and guidance, our forecasts vs the street, the street view.
const X = require('./SYNGENE.ctx2');
const { C, D, F, A, AS, n0, n1, Q1, FY26, YRS, KEYS, LBL, BL, LINES, oiTreas, oiBuild, TY, MISC, GROSS, LEASES, BANK, LR, LEASE_INT, OTHER_FIN, KD, intBuild, ttmOiCo, epsU, ST, withTp, medTp, rating, MULT, EVH, SECTOR_EV, shortDate, price, cashPath, b, SENS } = X;
const rup = s => String(s).replace(/Rs ?(?=[0-9])/g, '₹');
// Bloomberg consensus in HDFC Securities' CRDMO thematic (price 5-Jan-2026, before the Jan-2026 guidance cut): FY25-28E CAGR
// sales 12%, EBITDA 12%, PAT 13%; P/E 53.1x FY25 → 46.0x FY27E / 36.8x FY28E, so EPS ≈ FY25 EPS × 53.1 ÷ those multiples
const BBG = { sales28: A.sales[X.ai('FY25')] * 1.12 ** 3, ebitda28: A.ebitda[X.ai('FY25')] * 1.12 ** 3, eps27: A.eps[X.ai('FY25')] * 53.1 / 46.0, eps28: A.eps[X.ai('FY25')] * 53.1 / 36.8 };

const q1 = {
  id: 'guidance', nav: 'Q1FY27 & guidance', kicker: 'Momentum', title: 'Q1FY27: revenue −16%, operating margin 12%, a ₹9 cr loss; FY27 guidance cut to a single-digit decline with mid-20s margins',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (₹ crore, company presentation)', head: ['', 'Q1FY26', 'Q1FY27', 'Change'], rows: [
      ['Revenue from operations', '875', n0(Q1.revenue), `${Q1.revenueGrowthPct}%`],
      ['  Research services (78%)', '~583', `~${n0(Q1.revenue * 0.78)}`, '~−1.5% (GAM split)'],
      ['  CDMO (22%)', '~291', `~${n0(Q1.revenue * 0.22)}`, '~−44% (GAM split)'],
      ['Material costs', '218', n0(Q1.materialCost), '−20%'],
      ['Staff costs', '291', n0(Q1.staffCost), '−3%; 38% of revenue'],
      ['Forex hedge loss', '5', n0(Q1.fxHedgeLoss), 'Hedges below spot'],
      ['Operating EBITDA', '206', n0(Q1.opEbitda), `margin ${Q1.opEbitdaPct}% (${Q1.opEbitdaPctQ1FY26}%)`],
      ['Other income', '18', n0(Q1.otherIncome), 'Higher cash'],
      ['Depreciation / finance cost', '111', `${Q1.dep} / ${Q1.interest}`, ''],
      ['PAT before exceptional items', '87', n0(Q1.patPreExc), '−99%'],
      { hl: true, cells: ['**Reported PAT**', '**87**', `**${Q1.pat}**`, `Exceptional ₹${-Q1.exceptionalNet} cr (severance)`] },
      ['Net cash (company basis)', '–', n0(Q1.netCash), '₹1,800 cr at Mar-26; seasonal'],
    ], source: 'Q1FY27 investor presentation (29-Jul-2026) p.26; Q1FY27 call; GAM split' } },
    { bullets: Q1.commentary.map(rup) },
    { exhibit: { type: 'table', title: 'Guidance and how it moved', head: ['When', 'Revenue guide', 'Margin guide', 'Outcome'], wide: [3], rows: [
      ['Apr / Nov-2025 (FY26)', 'Mid-single-digit growth (cc), reiterated in Nov-2025', 'Mid-20s; PAT to fall', 'Cut in Jan-2026'],
      ['Jan-2026 (FY26)', '3-5% decline (cc)', '22-23% operating', 'Delivered +3% reported, 24.6% margin'],
      ['Apr-2026 (FY27)', 'Broadly flat', 'Mid-20s', 'Cut in Jul-2026'],
      { hl: true, cells: ['**Jul-2026 (FY27)**', '**Single-digit decline in rupees (mid-single-digit, CFO)**', '**Mid-20s**', `**GAM: {{F.salesGrowth.0|pct}}, {{F.ebitdaMargin.0|pct}}**`] },
    ], source: 'Q3FY26, Q4FY26 and Q1FY27 calls; Reuters (Apr-2025, Jan-2026)' } },
    { callout: '**Why it matters:** guidance has been cut twice in six months (Jan-2026 and Jul-2026), each time because of the same product. The new team asked for "a quarter" to diagnose the business and give better visibility. Until it does, we sit below the guide on both revenue and margin.' },
  ],
};

const forecasts = {
  id: 'forecasts', nav: 'Forecasts vs the street', kicker: 'Forecasts', title: `Our forecasts: FY27E is the trough (EPS ₹${n1(epsU[0])}), FY28-29E recover to ₹${n1(epsU[1])} / ₹${n1(epsU[2])}; the January consensus was ~2x higher`,
  blocks: [
    { p: `We forecast revenue of {{F.sales.0|num}} / {{F.sales.1|num}} / {{F.sales.2|num}} cr for FY27-29E ({{F.salesGrowth.0|chg}} / {{F.salesGrowth.1|chg}} / {{F.salesGrowth.2|chg}}), an EBITDA margin of {{F.ebitdaMargin.0|pct}} / {{F.ebitdaMargin.1|pct}} / {{F.ebitdaMargin.2|pct}} and EBITDA of {{F.ebitda.0|num}} / {{F.ebitda.1|num}} / {{F.ebitda.2|num}} cr. Depreciation rises from ₹453 cr to ₹${n0(F.dep[2])} cr as Bayview is capitalised; interest stays ~₹40 cr (mostly leases); other income grows with cash (₹${n0(F.otherIncome[0])} cr to ₹${n0(F.otherIncome[2])} cr). EPS: ₹${n1(epsU[0])} / ${n1(epsU[1])} / ${n1(epsU[2])}, against ₹${n1(X.epsEx[2026])} before exceptional items in FY26 and ₹${n1(X.epsEx[2024])} in FY24.` },
    { exhibit: { type: 'table', title: 'GAM vs the street', head: ['', 'GAM FY27E', 'GAM FY28E', 'GAM FY29E', 'Bloomberg consensus, 5-Jan-2026 (before the cut)', 'Guidance (Jul-2026)'], wide: [0], rows: [
      ['Revenue (₹ cr)', '{{F.sales.0|num}}', '{{F.sales.1|num}}', '{{F.sales.2|num}}', `12% a year FY25-28E (≈₹${n0(BBG.sales28)} cr FY28E)`, 'FY27: single-digit decline'],
      ['EBITDA (₹ cr)', '{{F.ebitda.0|num}}', '{{F.ebitda.1|num}}', '{{F.ebitda.2|num}}', `12% a year (≈₹${n0(BBG.ebitda28)} cr FY28E)`, 'FY27 margin mid-20s'],
      ['EPS (₹)', n1(epsU[0]), n1(epsU[1]), n1(epsU[2]), `≈₹${n1(BBG.eps27)} FY27E / ₹${n1(BBG.eps28)} FY28E (from its P/E)`, '–'],
    ], source: 'GAM; Bloomberg consensus as shown in HDFC Securities\' CRDMO thematic (6-Jan-2026, Exhibits 85-86; EPS implied from its P/E and FY25 EPS); company guidance. No broker estimates standing on 30-Sep-2026 were accessible (gap).' } },
    { exhibit: { type: 'column', title: `FY28E: our revenue is ${100 - Math.round(F.sales[1] / BBG.sales28 * 100)}% and our EPS ${100 - Math.round(epsU[1] / BBG.eps28 * 100)}% below the January consensus`, unit: 'GAM as % of Bloomberg consensus (Jan-2026), FY28E', x: ['Revenue', 'EBITDA', 'EPS'], series: [{ name: 'GAM ÷ consensus', values: [Math.round(F.sales[1] / BBG.sales28 * 100), Math.round(F.ebitda[1] / BBG.ebitda28 * 100), Math.round(epsU[1] / BBG.eps28 * 100)], fmt: 'pct' }], labels: 'all', min: 0, max: 110, source: 'GAM; HDFC Securities thematic (Bloomberg, Jan-2026)' } },
    { exhibit: { type: 'table', title: 'Our main assumptions and why', head: ['Driver', 'FY27E', 'FY28E', 'FY29E', 'Why'], wide: [4], rows: [
      ...KEYS.map(kk => [`${LBL[kk]} growth`, ...BL.growth[kk].map(g => g + '%'), { research: 'Q1 ~−1.5%; client attrition; BMS to 2035; recovery with the funding lag', cdmo: 'Librela to minor volumes; Mangaluru and Unit 3 ramp; Bayview from FY28' }[kk]]),
      ['Revenue (₹ cr)', ...X.buildTot.map(n0), 'Sum of the two lines (= model revenue)'],
      ['EBITDA margin', '{{F.ebitdaMargin.0|pct}}', '{{F.ebitdaMargin.1|pct}}', '{{F.ebitdaMargin.2|pct}}', 'Screener basis incl. hedge results; guide mid-20s for FY27'],
      ['Capex (₹ cr)', ...AS.capex.map(n0), 'Not guided; FY26 ₹368 cr; Bayview fit-out'],
      ['Depreciation (₹ cr)', ...F.dep.map(n0), `${AS.depRateOnGrossBlock}% of gross block; Bayview capitalised in FY28`],
      ['Tax rate', ...AS.taxRate.map(t => t + '%'), 'FY26 22% normalised; SEZ benefits run off'],
      ['Payout', ...AS.payout.map(t => t + '%'), '₹1.25 a share kept'],
    ], source: 'GAM Research (assumptions.json)' } },
    { exhibit: { type: 'table', title: 'Other income and interest: built from their parts (₹ crore)', head: ['', 'FY26 actual', 'FY27E', 'FY28E', 'FY29E', 'Basis'], wide: [5], rows: [
      ['Treasury income (deposits, ICDs, liquid funds)', n1(X.OIN.FY26.depositInterest + X.OIN.FY26.mfGains), ...oiTreas.map(n1), `${TY.toFixed(2)}% (FY26 realised on average year-end gross treasury) on ₹${GROSS.map(n0).join(' → ')} cr`],
      ['Interest on lease and security deposits', n1(X.OIN.FY26.leaseDepositInterest), n1(MISC), n1(MISC), n1(MISC), 'FY25 ₹3.6 cr, FY26 ₹1.1 cr'],
      ['Interest on tax refunds', n1(X.OIN.FY26.taxRefundInterest), '0', '0', '0', 'Not recurring'],
      { hl: true, cells: ['**Other income (model)**', `**${n1(X.OIN.FY26.total)}**`, ...AS.otherIncome.map(v => `**${n1(v)}**`), `Q1FY27 ₹25 cr; twelve months to Jun-26 ~₹${n0(ttmOiCo)} cr; Screener history nets exceptional items`] },
      ['Lease interest', n1(X.FCN.leases), n1(LEASE_INT), n1(LEASE_INT), n1(LEASE_INT), `${LR.toFixed(1)}% (FY26) on ₹${n0(LEASES)} cr of leases, held flat`],
      ['Bank debt and other finance costs', n1(X.FCN.borrowings + X.FCN.exchangeDifference), ...intBuild.map(v => n1(v - LEASE_INT)), `${KD}% on ₹${BANK} cr + ~₹${OTHER_FIN} cr exchange differences/other (packing credit fell from ₹120 cr)`],
      { hl: true, cells: ['**Interest (model)**', `**${n1(X.FCN.total)}**`, ...AS.interest.map(v => `**${n1(v)}**`), 'Q1FY27 ₹10 cr'] },
    ], source: 'AR FY26 notes 5, 6, 11, 19, 23; Q1FY27 deck; GAM (checked in SYNGENE.ctx.js)' } },
  ],
};

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street: split from Underperform ₹${n0(X.br('Jefferies').tp)} (Jefferies) to Outperform ₹${n0(X.br('Macquarie').tp)} (Macquarie); the brokers that disclose a method use EV/EBITDA; consensus median ₹532 after Q1`,
  blocks: [
    { p: `After Q1FY27 the LSEG consensus showed eight brokerages with an average Buy and a median target of ₹532 (it was ₹725 in Jan-2026 and ₹835 in Apr-2025). The named views we could find: Macquarie Outperform ₹735 (kept on 30-Jul-2026 despite "an all-round miss"; cut from ₹835 in Jun-2026), Jefferies Underperform ₹410 (May-2026; downgraded in Jan-2026), YES Securities Sell ₹450 (Jan-2026), Goldman Sachs Buy ₹775 (Jul-2025; no later note found) and ICICI Securities, which called Q1 "below par on all parameters". On method: ICICI Securities' last accessible note valued Syngene at 24x FY27E EV/EBITDA; Nuvama values it at 22x EV/EBITDA inside its Biocon sum of the parts; YES Securities shows EV/EBITDA in its valuation table. No broker in the material we could access stated P/E as its basis. That makes **EV/EBITDA** the street's method.` },
    { exhibit: { type: 'table', title: 'The street on 30-Sep-2026 (latest note found)', head: ['Broker', 'Date', 'Rating', 'Target (₹)', 'Method', 'vs CMP', 'Thesis'], wide: [6], rows: [
      ...ST.map(s => [s.broker, shortDate(s.date), s.rating || '–', s.tp ? n0(s.tp) : '–', s.method ? rup(`${s.method}${s.multiple ? ': ' + s.multiple : ''}`) : 'n.d.', s.tp ? X.pc((s.tp / price - 1) * 100) : '–', rup(s.thesis)]),
      { hl: true, cells: ['**GAM Research**', '30-Sep-26', `**${rating}**`, '**{{dcf.tp|num}}**', `**EV/EBITDA ${MULT.base}x Sep-28E**`, '{{dcf.upside|chg}}', 'Earnings trough in FY27; own forward EV/EBITDA × the sector\'s move; DCF below the price'] },
    ], source: rup(D.street.note) } },
    { exhibit: { type: 'table', title: 'The EV/EBITDA brokers\' multiples on our numbers (Sep-28E EBITDA and net cash)', head: ['Broker', 'Multiple', 'Value on our numbers (₹)'], rows: [
      ['ICICI Securities (Apr-2025)', '24x', n0(SENS.find(r => /ICICI/.test(r.name)).tp)],
      ['Nuvama (in its Biocon SOTP, Nov-2025)', '22x', n0(SENS.find(r => /Nuvama/.test(r.name)).tp)],
      { hl: true, cells: ['**GAM**', `**${MULT.base}x**`, '**{{dcf.tp|num}}**'] },
    ], source: 'Broker notes; GAM' } },
    { p: `**Where we stand.** We are below every forecast we can see for FY28 and below management's FY27 guide, yet our target is near the top of the street's range. The reason is the multiple: the street's targets fell with the share price (median ₹835 → ₹532), which implies multiples well below Syngene's own ${n1(EVH.med)}x forward median since 2021; we apply the house method and do not cut the multiple for the de-rating (sensitivities in the valuation chapter show what that would do).` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument'], rows: D.critiques.map(c => [rup(c)]), source: 'Broker views, earnings calls and filings to 30-Sep-2026; GAM Research' } },
  ],
};

module.exports = { q1, forecasts, street };
