// Exide report, part 3: the lead-acid core (business-line build), the lithium-ion subsidiary EESL (losses and how we
// value it), the HDFC Life stake and other investments, and the competitive-advantage scorecard.
const X = require('./EXIDEIND.ctx');
const { C, D, F, SQ, QL, BL, LINES, LN, bld, n0, n1, pc, shares, eesl, hdfcMV, hdfcVal, DISC, HDFC_PX, HDFC_SH, otherVal, CASES } = X;
const E = C.eesl, EB = BL.eesl, ps = v => n0(v / shares);

const core = {
  id: 'core', nav: 'Lead-acid core', kicker: 'The core business', title: `Lead-acid: ~9-13% growth a year to FY29E at a ~12% margin`,
  blocks: [
    { p: `We build revenue from five lines (sizes are management's ballpark figures for FY26; the company reports one segment). Auto is half the business and has the strongest near-term growth (OEM boom now, replacement later); solar is the fastest-growing line; exports should recover from a low base; industrial grows with infrastructure while telecom shrinks. The build gives revenue of ₹${n0(F.sales[0])} / ${n0(F.sales[1])} / ${n0(F.sales[2])} cr for FY27-29E (+{{F.salesGrowth.0|pct0}}, +{{F.salesGrowth.1|pct0}}, +{{F.salesGrowth.2|pct0}}), in line with management's "high single digit to early double digit" for the core. ${BL._why}` },
    { exhibit: { type: 'table', title: 'Business-line build (₹ crore)', head: ['Line', 'FY26', 'FY27E', 'FY28E', 'FY29E', 'Growth FY27E / 28E / 29E'], rows: [
      ...LINES.map(k => [LN[k], n0(BL.base[k]), ...bld.map(r => n0(r[k])), BL.growth[k].map(g => g + '%').join(' / ')]),
      { hl: true, cells: ['**Total = model revenue**', `**${n0(X.base26)}**`, ...bld.map(r => `**${n0(r.rev)}**`), bld.map(r => pc((r.rev / (r.y === 'FY27E' ? X.base26 : bld[bld.indexOf(r) - 1].rev) - 1) * 100)).join(' / ')] },
    ], source: 'GAM Research; FY26 split from AR FY26 and management calls (see "What Exide does")' } },
    { pair: [
      { type: 'column', title: 'Quarterly revenue: a seasonal Q1 peak, a Q2 trough', unit: 'Revenue (₹ crore), standalone', x: QL, series: [{ name: 'Revenue', values: SQ.map(q => q.sales), fmt: 'num' }], labels: 'all', source: 'Quarterly results (standalone)' },
      { type: 'line', title: 'Quarterly EBITDA margin: 9.5% to 12.3%', unit: 'EBITDA margin (%)', x: QL, series: [{ name: 'EBITDA margin', values: SQ.map(q => q.marginPct), fmt: 'pct' }], labels: 'all', min: 8, max: 14, source: 'Screener.in (standalone; company Q1FY27: 12.4%)' },
    ] },
    { p: `**Margin.** ${X.CORE._marginWhy} Gross margin fell from 31.6% in Q3FY26 to 30.1% in Q4FY26 (a ~₹150 cr cost hit, CEO) and to 29.5% in Q1FY27 (MOFSL), yet EBITDA margin held because factory, staff and warranty costs fell as a share of revenue. Each 0.5 point of margin is ~₹${n1(F.sales[1] * 0.005 * (1 - X.TAX) / shares)} of FY28E EPS (~${Math.round(F.sales[1] * 0.005 * (1 - X.TAX) / F.pat[1] * 100)}%).` },
    { callout: '**So what:** the core is not a growth story, but a reliable one: ~9-13% revenue growth, ~12% margin, capex of ~₹500 cr a year and EPS growth of ~15% a year to FY29E (helped by operating leverage and, from FY28E, interest on rebuilt cash). That is what the core P/E has to pay for.' },
  ],
};

const lithium = {
  id: 'lithium', nav: 'Lithium-ion (EESL)', kicker: 'The lithium-ion bet', title: `EESL: ₹4,902 cr invested, samples shipped, losses rising before revenue: worth ~₹${ps(eesl.base.value)} a share to us`,
  blocks: [
    { p: `${E.capacity} ${E.status} ${E.funding}` },
    { exhibit: { type: 'table', title: 'EESL so far (₹ crore)', head: ['', 'FY23', 'FY24', 'FY25', 'FY26', 'Q1FY27 / Jul-26'], rows: [
      ['Equity from Exide (cumulative, at cost)', '715', '2,302', '3,302', '4,802', '4,902'],
      ['Book equity (net worth)', '655', '~1,981', '2,772', '4,025', '~4,069 (GAM)'],
      ['Revenue (packs and modules with imported cells)', 'n.a.', 'n.a.', '117', '158', 'n.a.'],
      ['Profit / (loss) after tax', '(38)', 'n.a.', '(209)', '(248)', '~(56) group drag'],
    ], source: 'Form AOC-1 in AR FY23, FY25, FY26; Q1FY27 call; FY24 book derived; Q1FY27 = consolidated less standalone profit (includes Chloride Metals)' } },
    { p: `**Why losses rise first.** Once the plant is declared in commercial production, depreciation on ~₹4,500-5,000 cr of plant (~₹300 cr a year) and interest on ~₹1,200 cr of subsidiary borrowings arrive in full, while utilisation is guided at 25-30% in year one and cells must go through 2-3 months (2W OEMs: longer) of customer validation. Pricing must match landed Chinese cells; management targets that at 85% utilisation, 90% yield and some local sourcing. China's export VAT rebate on cells ends on 1-Jan-2027, which helps. Our loss path is a GAM estimate (no company guidance; no broker publishes EESL forecasts): breakeven in FY30E in the base case, in FY30E with smaller losses in the bull case (faster approvals, support for local cells, the Hyundai-Kia line) and in FY31E in the bear case.` },
    { exhibit: { type: 'table', title: 'How we value EESL (₹ crore unless stated)', head: ['', 'Bull', 'Base', 'Bear'], rows: [
      ['Losses FY27E / FY28E / FY29E / FY30E', ...['bull', 'base', 'bear'].map(c => EB.loss[c].join(' / '))],
      ['Book equity at Sep-27E (Mar-26 ₹4,025 cr + ₹1,400 cr FY27 infusion − losses)', ...['bull', 'base', 'bear'].map(c => n0(eesl[c].book))],
      ['× multiple of book', ...['bull', 'base', 'bear'].map(c => eesl[c].mult + 'x')],
      ['Less: PV of losses after Sep-27E, to breakeven (12.5%)', ...['bull', 'base', 'bear'].map(c => '(' + n0(eesl[c].pv) + ')')],
      { hl: true, cells: ['**EESL value**', ...['bull', 'base', 'bear'].map(c => `**${n0(eesl[c].value)}**`)] },
      ['Per Exide share (₹)', ...['bull', 'base', 'bear'].map(c => ps(eesl[c].value))],
      ['Street: MOFSL (book) / ICICI Securities (1x invested capital), ₹ per share', '', '82 / 70', ''],
    ], source: 'GAM Research (PLAYBOOK §7c: start-up losses valued as the present value of losses to breakeven); MOFSL 3-Aug-2026; ICICI Securities 4-Aug-2026' } },
    { callout: `**Our view:** EESL is a real option (India needs local cells; Exide is first with a working 6 GWh plant and a trade channel for 3W retrofits), but today it is a cost centre with Chinese technology, imported materials and no PLI support. We value it at what has been put in, net of the losses still to come: ₹${ps(eesl.base.value)} a share, below the street's ₹70-82. If yields and approvals come through, the bull case adds ~₹${n0((eesl.bull.value - eesl.base.value) / shares)}; if the plant earns well below its cost of capital, half of book (bear) costs ~₹${n0((eesl.base.value - eesl.bear.value) / shares)}. Phase 2 (12 GWh) and the Hyundai-Kia line are not in our numbers.` },
  ],
};

const investments = {
  id: 'investments', nav: 'HDFC Life & investments', kicker: 'Investments', title: `HDFC Life: ₹${n0(hdfcMV)} cr at market (₹${ps(hdfcMV)} a share); we count ₹${ps(hdfcVal.base)} after a ${DISC.base}% discount`,
  blocks: [
    { p: `Exide received 8,70,22,222 HDFC Life shares on 1-Jan-2022 as part of the price for Exide Life (valued then at ₹5,652.5 cr, ₹649.5 a share). It has sold none (CFO, May-2026), and HDFC Life's Jun-2026 shareholding pattern still shows the same count (~4.0%). At the 30-Sep-2026 close of ₹${HDFC_PX} the stake was worth ₹${n0(hdfcMV)} cr (₹${ps(hdfcMV)} per Exide share, ~13% of Exide's market value); at Mar-2026 (₹590.6) it was ₹5,140 cr. The stake earns only dividends (₹18.5 cr in FY26, with two small holdings) and its value change goes through other comprehensive income, not profit.` },
    { exhibit: { type: 'table', title: 'HDFC Life stake and other investments in the sum of the parts', head: ['Item', 'Basis', 'Bull', 'Base', 'Bear'], rows: [
      ['HDFC Life: market value', `${HDFC_SH.toFixed(2)} cr shares × ₹${HDFC_PX}`, n0(hdfcMV), n0(hdfcMV), n0(hdfcMV)],
      ['Discount', 'Base = the discount MOFSL applies (₹45 a share at a ₹548.5 price: ~20%)', DISC.bull + '%', DISC.base + '%', DISC.bear + '%'],
      { hl: true, cells: ['**HDFC Life value (₹ crore)**', '', ...['bull', 'base', 'bear'].map(c => `**${n0(hdfcVal[c])}**`)] },
      ['Per Exide share (₹)', '', ...['bull', 'base', 'bear'].map(c => ps(hdfcVal[c]))],
      ['Other investments and subsidiaries', 'Book, Mar-26 (Chloride Metals, small subsidiaries, Faering fund, unquoted stakes)', n0(otherVal), n0(otherVal), n0(otherVal)],
    ], source: 'AR FY26 note 4; AR FY23 note 54; HDFC Life Jun-2026 shareholding pattern; NSE close 30-Sep-2026; MOFSL 3-Aug-2026' } },
    { bullets: [
      '**Why a discount at all:** the shares are a passive minority stake that Exide has not said it will sell, a sale would be a large block (~4% of HDFC Life), and the FY26 accounts show a tax effect on the stake\'s value changes (₹120 cr on the ₹834 cr fall), so a sale could carry tax. MOFSL\'s ₹45 a share implies ~20%; ICICI Securities values the stake on its own HDFC Life target (₹700).',
      '**Bull 10% / bear 30%:** a sale to fund lithium-ion at close to market (bull) or a holding-company-style discount if the stake stays idle (bear).',
      `**Sensitivity:** each ₹50 on HDFC Life's share price moves our target by ~₹${n0(HDFC_SH * 50 * (1 - DISC.base / 100) / shares)} a share.`,
    ] },
  ],
};

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: a strong franchise in a two-player market, but no pricing power and no edge in lithium',
  blocks: [
    { verdicts: [
      ['Brand and distribution', 'Strong', D.moat.brand, 'The replacement buyer chooses by brand and availability; this is Exide\'s real moat.'],
      ['Scale and recycling', 'Strong', D.moat.scale, 'Captive recycled lead gives cost and supply control that a new entrant would take years to match.'],
      ['OEM relationships', 'Moderate', D.moat.oem, 'Sticky, but OEM business is priced on lead formulas with thin margins.'],
      ['Pricing power', 'Weak', 'Margin 13-15% (FY16-21) down to 10.8-11.7% (FY22-26); price increases follow costs with a lag.', 'A duopoly that competes; costs are passed on, not marked up.'],
      ['Technology (lithium-ion)', 'Weak', 'Licensed from SVOLT (China); materials imported; not in the ACC PLI scheme; first-generation plant.', 'No advantage yet; Exide\'s edge is the trade channel for 3W and stationary batteries.'],
    ], head: ['Source', 'Verdict', 'Evidence', 'So what'], title: 'Competitive advantage scorecard', source: 'AR FY26; Q1FY27 presentation and call; MOFSL 3-Aug-2026' },
    { callout: '**Verdict:** a narrow moat in lead-acid (brand, distribution, recycling scale) shared with one rival, which keeps returns on operating capital high but margins ordinary. In lithium there is no moat today; it has to be built.' },
  ],
};

module.exports = { core, lithium, investments, moat };
