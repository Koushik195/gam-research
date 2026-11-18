// Linde India report, part B (6 of 7): valuation (street method, multiple derivation, cross-checks,
// scenarios, DCF detail, peers).
const X = require('./LINDEINDIA.ctx');
const { streetBlocks } = require('./valuation-blend');
const { D, F, V, A, n0, n1, pc, price, mv, peMult, evMult, epsSep28, ebitdaSep28, H, P, derate, DR_SET, sectorDr, afterDerate, shortName, rating, PEERS, MED5, evMed, ttmEbitdaUnd, epsUnderlyingFY26, epsCagrFwdUnd, ASOF_TXT, b } = X;
const UB = D.street.brokers.filter(s => /Univest/.test(s.broker));
const drRow = s => `${shortName(s)} ${pc(derate[s])}`;
const gordon = (1 - 6 / Math.round(F.roe[1])) / ((V.ke - 6) / 100);

const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${peMult}x Sep-28E earnings gives {{dcf.tp|inr}}; every cross-check is lower`,
  blocks: [
    ...streetBlocks('LINDEINDIA', {
      rating,
      streetIntro: 'No broker note with a disclosed method was found for Linde India. The method the Indian street uses for listed industrial-gas companies is one-year-forward P/E (Motilal Oswal initiated Ellenbarrie at 40x FY27E in Sep-2025), and the global majors are quoted on P/E too. We therefore value Linde India on P/E, applied to the earnings the market will look at in September 2027 (Sep-28E: half FY28E, half FY29E). With no usable broker multiples, the derivation leans on the stock\'s own history, the sector\'s de-rating and returns.',
      street: [
        ...UB.map(s => [s.broker.replace(' (as reported by Univest blog)', ' (blog, undated)'), s.rating, s.tp, null, null, null, 'Unverified secondary source; no method or date']),
      ],
      ourThesis: 'Contracted growth, contested governance; priced for far more growth than the plants deliver',
      streetSource: 'Univest blog (updated 16-Jun-2026), unverified; n.d. = not disclosed',
      derivationIntro: `We start from the stock's own median one-year-forward P/E since Apr-2021 (house rule: forwardMedian, trough years excluded), cut it by the de-rating of quality Indian industrial and chemical stocks by ${ASOF_TXT}, then test it against growth, peers and returns.`,
      derivation: [
        ['1. Its own history', `Median one-year-forward P/E ${n1(H.med)}x (25th-75th percentile ${n1(H.p25)}-${n1(H.p75)}x; range ${n1(H.min)}-${n1(H.max)}x). No trough years excluded${H.trough.length ? ` (${H.trough.join(', ')})` : ''}. The series starts in Apr-2022: FY23 was a 15-month year, so Apr-2021 to Mar-2022 has no comparable forward EPS.`, `Starting point: ${n1(H.med)}x`],
        ['2. Sector de-rating', `On ${ASOF_TXT}, Indian industrial and chemical compounders traded at ${DR_SET.map(drRow).join(', ')} vs their five-year median P/E (median ${pc(sectorDr)}). Linde India itself ${pc(derate.LINDEINDIA)}; Ellenbarrie ${pc(derate.ELLEN)} (listed only since Jul-2025). Gujarat Alkalies excluded (P/E on trough earnings).`, `${n1(H.med)}x × ${(1 + sectorDr / 100).toFixed(2)} ≈ ${n1(afterDerate)}x`],
        ['3. Growth', `The ${n1(H.med)}x was paid while EPS was roughly flat (FY24 ₹50.9, FY25 ₹53.3, FY26 ~₹${n1(epsUnderlyingFY26)} underlying). We forecast ~${n1(epsCagrFwdUnd)}% a year underlying to FY29E (~8% a year in FY28-29E): no better than what the market already paid for.`, `No change: **${peMult}x**`],
        ['4. Peers', `Trailing P/E: Ellenbarrie ${n1(P.ELLEN.pe)}x, Solar Industries ${n1(P.SOLARINDS.pe)}x, 3M India ${n1(P['3MINDIA'].pe)}x, Pidilite ${n1(P.PIDILITIND.pe)}x, SRF ${n1(P.SRF.pe)}x; Linde plc ~25x 2026E (GAM estimate); Linde India ${n1(P.LINDEINDIA.pe)}x.`, `${peMult}x forward is still ~2x Ellenbarrie and >3x Linde plc: generous`],
        ['5. Returns', `ROE ~${Math.round(F.roe[1])}% in FY27-29E against an ${n1(V.ke)}% cost of equity. A steady-state P/E with ${Math.round(F.roe[1])}% ROE and 6% growth is only ~${Math.round(gordon)}x; our DCF is ₹${n0(mv('dcf').value)}.`, `We keep ${peMult}x for consistency with the house method, but returns do not support it`],
      ],
      derivationSource: `Screener.in (P/E history and peers at the ${ASOF_TXT} close), GAM Research`,
      history: { field: 'eps', from: '2021-04-01', median: Math.round(H.med * 10) / 10, label: `Median since 2021: ${n1(H.med)}x`, title: `One-year-forward P/E: our ${peMult}x vs history`, yearStep: 1 },
      crossNote: `**What the cross-checks tell us.** EV/EBITDA (${evMult}x Sep-28E EBITDA of ₹${n0(ebitdaSep28)} cr, less net debt) gives ₹${n0(mv('ev').value)}, ${Math.abs(Math.round(mv('ev').vsTarget))}% below the P/E target. The ${evMult}x comes from the stock's ~${Math.round(evMed)}x median trailing EV/EBITDA since Apr-2021, less the same ~${Math.abs(Math.round(sectorDr))}% de-rating, restated for Sep-28E EBITDA being ~${Math.round((ebitdaSep28 / ttmEbitdaUnd - 1) * 100)}% above the twelve months to Jun-2026 (₹${n0(ttmEbitdaUnd)} cr without the reversal). The DCF (₹${n0(mv('dcf').value)}) is ${Math.abs(Math.round(mv('dcf').vsTarget))}% lower still: at an ${n1(V.ke)}% cost of equity, 6% terminal growth and capex of ~14% of sales to sustain 8% growth, the cash flows support only a fraction of today's price. Even our ${peMult}x target therefore embeds a large premium for scarcity and control. That is why we are confident in the direction (${rating}), less in the size of the fall.`,
    }),
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Multiple ${V.blend.methods[0].multiple.bull}x (its own forward median, no de-rating).`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Gases +11% / +12% / +10%, margin 35.5-36.5%; PED ~₹640-740 cr at ~15-16%; ${peMult}x Sep-28E EPS.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Multiple ${V.blend.methods[0].multiple.bear}x (Ellenbarrie's trailing P/E on ${ASOF_TXT}).`],
    ], source: 'GAM Research' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-42E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Add: net cash at Mar-27 (negative = net debt; after leases)', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
      { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ], source: 'GAM Research. The engine discounts at the cost of equity (11.6%); with little debt this is close to WACC.' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of capital down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
    { callout: `**Reading the DCF honestly:** even at a 10.6% discount rate and 7% terminal growth the DCF stays far below the share price. To justify ₹${n0(price)} on cash flows, Linde India would need roughly Linde plc's global margins and much lower capital intensity for decades, or a buyer. The engine also counts ~₹755 cr of capital advances as working capital, which understates the DCF by ~₹200 a share; it changes nothing.` },
    { exhibit: { type: 'table', title: 'Listed Indian peers and context', head: ['Company', 'Market value (₹ cr)', 'Last FY revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', 'vs 5-yr median P/E', 'EV/EBITDA (x)', 'ROE'], rows: PEERS.map(p => [p.symbol === 'LINDEINDIA' ? '**Linde India**' : `${shortName(p.symbol)}${p.fy !== 'FY26' ? ` (${p.fy})` : ''}`, n0(p.mcapCr), n0(p.revenue), p.ebitdaMargin + '%', n1(p.pe), MED5[p.symbol] ? pc(derate[p.symbol]) : '–', n1(p.evEbitda), p.roe + '%']), source: `Screener.in, trailing multiples at the NSE close on ${ASOF_TXT}; Ellenbarrie standalone (listed Jul-2025, so its five-year median covers ~14 months)` } },
  ],
};

module.exports = { valuation };
