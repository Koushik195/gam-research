// Kansai Nerolac report, part 5: our forecasts vs the street, street view and critiques, valuation.
const X = require('./KANSAINER.ctx');
const { streetBlocks, forwardSeries } = require('./valuation-blend');
const { C, D, M, F, V, A, AS, n0, n1, pc, rup, shortDate, b, price, mv, epsSep28, peMult, evMult, ebitdaSep28, UE, BL, lines, FM, fwdAdj, HA, H24, evMed, evMin, ttmEbitda, PEERS, P, MED5, derate, PAINT, sectorDr, ownDr, afterSector, afterOwn, midpoint, shortName, relYr, RELY, relNow, rating, ST, br, pl, mncl, isec, epsCagrHist, epsCagrFwd, peFY28, multForBuy, cashPerShare, avgTp, current, ASOF_TXT } = X;
const g1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;

const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: ~11% EPS growth a year to FY29E, a little below the street',
  blocks: [
    { p: `We forecast consolidated revenue as one line (the company reports one segment) and check it against a decorative vs industrial build. FY27E revenue rises ${n1(AS.revenueGrowth[0])}%: ~7-8% from price (5% in Q1, ~3% more in Q2) and the rest from industrial volume; FY28-29E grow ~7% as price laps. EBITDA margin edges up from 12.1% to ${n1(AS.ebitdaMargin[2])}%, below management's 13-14% range. Depreciation rises with the ₹601 cr expansion; other income follows the cash pile at 6%; tax 26.5%; payout 33%. Every assumption is in the Excel model's Assumptions sheet, which recalculates this report's target price.` },
    { exhibit: { type: 'table', title: 'Business-line build (₹ crore; FY26 split approximate)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Industrial coatings', n0(BL.base.industrial), ...lines.ind.map(n0)],
      ['  growth', '', ...BL.industrialGrowth.map(pc)],
      ['Decorative paint', n0(BL.base.decorative), ...lines.deco.map(n0)],
      ['  growth', '', ...BL.decorativeGrowth.map(pc)],
      { hl: true, cells: ['**Revenue (model)**', '**8,052**', '**{{F.sales.0|num}}**', '**{{F.sales.1|num}}**', '**{{F.sales.2|num}}**'] },
    ], source: 'Management statements (FY26 split ~45:55), GAM estimates; the build sums to model revenue' } },
    { exhibit: { type: 'rows', title: 'P&L and cash flow summary (₹ crore)', from: 'FY23', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' },
      { name: 'Other income (actuals incl. exceptionals)', ref: 'fin.otherIncome' },
      { name: 'Net profit (attributable)', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n1' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Free cash flow', ref: 'fin.fcf' }, { name: 'Cash & investments (net of borrowings in forecasts)', ref: 'fin.treasury' }, { name: 'ROE', ref: 'fin.roe', fmt: 'pct' },
    ], source: 'Company, GAM Research estimates' } },
    { exhibit: { type: 'table', title: 'GAM vs management and the street (estimates standing on 30-Sep-2026)', head: ['', 'FY27E', 'FY28E', 'FY29E', 'Comment'], wide: [4], rows: [
      ['GAM revenue growth', '{{F.salesGrowth.0|chg}}', '{{F.salesGrowth.1|chg}}', '{{F.salesGrowth.2|chg}}', 'ICICI Securities (May-2026): +12.1% / +9.6%; MNCL: ~8% a year FY26-28E'],
      ['GAM EBITDA margin', '{{F.ebitdaMargin.0|pct}}', '{{F.ebitdaMargin.1|pct}}', '{{F.ebitdaMargin.2|pct}}', 'Management: 13-14% (FY27), "14%+" in 2-3 years; ICICI Securities 12.2% / 12.4% (consolidated); PL 13.0% / 13.5% (standalone)'],
      { hl: true, cells: ['**GAM EPS (₹, consolidated)**', '**{{F.eps.0|n1}}**', '**{{F.eps.1|n1}}**', '**{{F.eps.2|n1}}**', `EPS before exceptional items: ₹${n1(UE.FY26)} in FY26`] },
      ['PL EPS (₹, standalone, 4-Aug-2026)', n1(pl.eps.FY27E), n1(pl.eps.FY28E), '–', 'Standalone excludes loss-making subsidiaries (~₹0.3-0.4 a share in FY26)'],
      ['ICICI Securities EPS (₹, consolidated, 7-May-2026)', n1(isec.eps.FY27E), n1(isec.eps.FY28E), '–', 'Pre-Q1FY27; we found no later update'],
      ['MNCL (4-Aug-2026)', '–', '~10.1', '–', 'Implied by ₹232 at 23x FY28E'],
      ['GAM dividend per share (₹)', '{{F.dps.0|n1}}', '{{F.dps.1|n1}}', '{{F.dps.2|n1}}', 'Regular ₹2.50 for FY24-26; we assume a 33% payout'],
    ], source: 'GAM Research; broker notes as cited (PL, ICICI Securities, MNCL)' } },
    { callout: `**Where we could be wrong:** our FY26-29E EPS growth (~${n1(epsCagrFwd)}% a year from an underlying ₹${n1(UE.FY26)}) is far above the ~${n1(epsCagrHist)}% Nerolac managed in FY21-26. It needs the price rises to stick, auto demand to stay healthy after the GST-cut surge and the margin to rise ~90bp. If decorative revenue stalls (+2%) and the margin slips back to ~11.5%, FY28E EPS would be ~₹{{scen.bear.eps.1|n1}}: our bear case.` },
  ],
};

const tpRows = current.slice().sort((a, c) => c.tp - a.tp);
const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: 'The street: mostly Accumulate/Add, targets of ₹220-259, and a P/E of 22-25x',
  blocks: [
    { p: `We found ${current.length} named calls dated Feb-Sep 2026. After Q1FY27, **PL** kept Accumulate and raised its target to **₹${pl.tp}** (25x Jun-28E standalone EPS; ${shortDate(pl.date)}) and **MNCL** initiated at Accumulate, **₹${mncl.tp}** (23x FY28E). Before Q1: ICICI Securities Add ₹${isec.tp} (DCF, implied 22x FY28E), Investec upgraded to Buy at ₹250, Geojit Hold ₹240, Macquarie Neutral ₹220, HDFC Securities Reduce ₹235 (DCF) and Elara Accumulate ₹240 (25x FY28E). The average of these targets is ~₹${n0(avgTp)}. The bulls point to industrial share gains, price-led recovery and a cheap multiple; the doubters to decorative competition and margins that never reach guidance. Nomura's ₹325 Buy (Aug-2025) is stale.` },
    { exhibit: { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (named calls, Feb-Sep 2026)', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...tpRows.map(s => `${s.broker} (${shortDate(s.date)})`), 'GAM (base)'], series: [{ name: 'Target', values: [...tpRows.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes and press reports as cited in deep.json; GAM Research' } },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who'], wide: [0], rows: D.critiques.map(r => r.map(rup)), source: 'Calls, filings, broker notes and press to 30-Sep-2026; GAM' } },
  ],
};

const drRow = s => `${shortName(s)} ${pc(derate[s])}`;
const houseFwd = forwardSeries('KANSAINER', M, 'eps').filter(x => x[0] >= '2021-04-01');
const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${peMult}x Sep-28E earnings gives {{dcf.tp|inr}}`,
  blocks: [
    ...streetBlocks('KANSAINER', {
      rating,
      streetIntro: `Most brokers value Kansai Nerolac on **P/E**: PL 25x Jun-28E, MNCL 23x FY28E, Elara 25x FY28E; ICICI Securities and HDFC Securities use DCF (ICICI's implies 22x FY28E). We use P/E on the earnings the market will look at in September 2027 (Sep-28E: half FY28E, half FY29E), so our target is comparable.`,
      street: [
        [`PL (${shortDate(pl.date)})`, pl.rating, pl.tp, 'P/E', pl.multiple, 'Jun-28E EPS (standalone)', 'Steady demand; margin guidance kept'],
        [`MNCL (${shortDate(mncl.date)})`, mncl.rating, mncl.tp, 'P/E', mncl.multiple, 'FY28E EPS', 'Growth back; margins near low end'],
        [`ICICI Securities (${shortDate(isec.date)})`, isec.rating, isec.tp, 'DCF', '22x implied', 'FY28E EPS', 'FY27 a turnaround year'],
        [`Investec (${shortDate(br('Investec').date)})`, 'Buy', 250, null, null, null, 'Peak competition behind'],
        [`Geojit (${shortDate(br('Geojit BNP Paribas').date)})`, 'Hold', 240, null, null, null, 'Post-Q4FY26'],
        ['Macquarie (Mar-26)', 'Neutral', 220, null, null, null, 'Price-hike strategy'],
        [`HDFC Securities (${shortDate(br('HDFC Securities').date)})`, 'Reduce', 235, 'DCF', null, null, 'Decorative weak'],
        [`Elara (${shortDate(br('Elara Capital').date)})`, 'Accumulate', 240, 'P/E', '25x', 'FY28E EPS', 'No near-term trigger'],
      ],
      ourThesis: 'Industrial franchise at a de-rated multiple; decorative priced for decline',
      streetSource: 'PL, MNCL, ICICI Securities notes; Investec, Geojit, Macquarie, HDFC Securities, Elara via press/aggregators; n.d. = method not disclosed in the sources we saw',
      derivationIntro: 'We start from the house one-year-forward P/E median since Apr-2021, correct it for the land-sale gains that distort it, cut it for the de-rating of listed paint companies and for Nerolac\'s own loss of standing in decorative, and test the result against growth, peers and returns.',
      derivation: [
        ['1. Its own history', `House forwardMedian: ${n1(FM.median)}x since Apr-2021 (${FM.troughYears.join(', ')} excluded as a trough year; ${n1(FM.medianAll)}x with it). Both are distorted: ₹1,327 cr of land gains doubled FY24-25 EPS, which cut the forward P/E for Apr-2022 to Mar-2024 to ~20-22x and made FY26 look like a trough. On EPS before exceptional items the median is ${n1(HA.med)}x (25th-75th percentile ${n1(HA.p25)}-${n1(HA.p75)}x; low ${n1(HA.min)}x)`, `Starting point: ${n1(HA.med)}x`],
        ['2. Sector de-rating', `On ${ASOF_TXT} listed paint peers traded below their five-year median P/E: ${PAINT.map(drRow).join(', ')} (median ${pc(sectorDr)}); Pidilite ${pc(derate.PIDILITIND)}`, `${n1(HA.med)}x × ${(1 + sectorDr / 100).toFixed(2)} ≈ ${n1(afterSector)}x`],
        ['3. Nerolac\'s own de-rating', `Nerolac fell further: ${pc(ownDr)} vs its five-year median; its P/E relative to Asian Paints dropped from ${relYr[RELY.indexOf('2023')]} (2023) to ${relNow}. Part of that reflects real decorative share loss to Birla Opus; part is overdone for a business that is ~55% industrial`, `On its own de-rating: ${n1(afterOwn)}x. Midpoint ${n1(midpoint)}x`],
        ['4. Growth', `EPS before exceptionals grew ~${n1(epsCagrHist)}% a year in FY21-26; we forecast ~${n1(epsCagrFwd)}% for FY26-29E, but a third of FY27's growth is price taken to recover costs`, `Round down: **${peMult}x**`],
        ['5. Peers and returns', `Trailing P/E: Asian Paints ${n1(P.ASIANPAINT.pe)}x, Berger ${n1(P.BERGEPAINT.pe)}x, Indigo ${n1(P.INDIGOPNTS.pe)}x; Nerolac ${n1(P.KANSAINER.pe)}x. Nerolac's ROE (${n1(P.KANSAINER.roe)}% in FY26, ~10-11% forecast) is below its ~12% cost of equity and the peers' ${Math.round(Math.min(P.INDIGOPNTS.roe, P.BERGEPAINT.roe, P.ASIANPAINT.roe))}-${Math.round(Math.max(P.ASIANPAINT.roe, P.BERGEPAINT.roe, P.PIDILITIND.roe))}%`, `${peMult}x stays far below peers; we do not go higher`],
      ],
      derivationSource: `Screener.in (P/E history and peers at the ${ASOF_TXT} close), company EPS before exceptional items, GAM Research`,
      crossNote: `**What the cross-checks tell us.** EV/EBITDA at ${evMult}x Sep-28E EBITDA (₹${n0(ebitdaSep28)} cr), about today's trailing ${n1(P.KANSAINER.evEbitda)}x and near the five-year low of ${n1(evMin)}x (median ${n1(evMed)}x), plus net cash gives ₹${n0(mv('ev').value)}: the target needs no EV/EBITDA re-rating, because cash is ~18% of the market value. The DCF (₹${n0(mv('dcf').value)}) is ${Math.abs(Math.round(mv('dcf').vsTarget))}% lower: at an ${n1(V.ke)}% cost of equity, ~7% long-run growth and a 13% margin, cash flows support roughly today's price, not more. The upside rests on the market paying ${peMult}x for a business it now values at ~${n1(peFY28)}x FY28E. That is why this is a low-conviction ${rating}.`,
    }),
    { exhibit: { type: 'line', title: 'One-year-forward P/E: the house series vs EPS before exceptional items', unit: 'Price ÷ next full-year EPS (x)', x: fwdAdj.map(x => x[0]), series: [{ name: 'Before exceptional items (GAM)', values: fwdAdj.map(x => x[1]), fmt: 'x', thin: true }, { name: 'Reported EPS (house forwardSeries)', values: fwdAdj.map(x => (houseFwd.find(h => h[0] === x[0]) || [])[1] ?? null), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: HA.med, text: `Median (adjusted): ${n1(HA.med)}x` }, { v: peMult, text: `Our target: ${peMult}x`, color: '#cf8f1f' }], source: 'Screener.in prices; reported EPS (Screener) vs GAM EPS before exceptional items; GAM estimates FY27-28E' } },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', '{{as.scenarios.bull.narrative}} Multiple 26x (sector de-rating only).'],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Revenue +${n1(AS.revenueGrowth[0])}% / +${n1(AS.revenueGrowth[1])}% / +${n1(AS.revenueGrowth[2])}% (FY27-29E), EBITDA margin ${n1(AS.ebitdaMargin[0])}-${n1(AS.ebitdaMargin[2])}%; ${peMult}x Sep-28E EPS.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', '{{as.scenarios.bear.narrative}} Multiple 17x (below its lowest forward P/E since 2021).'],
    ], source: 'GAM Research' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-42E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Add: net cash at Mar-27 (after leases)', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
      { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of capital down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Listed paint and adhesive peers', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', 'vs 5-yr median P/E', 'EV/EBITDA (x)', 'ROE'], rows: PEERS.map(p => [p.symbol === 'KANSAINER' ? '**Kansai Nerolac**' : shortName(p.symbol), n0(p.mcapCr), n0(p.revenue), p.ebitdaMargin + '%', n1(p.pe), pc(derate[p.symbol]), n1(p.evEbitda), p.roe + '%']), source: `Screener.in, trailing multiples at the NSE close on ${ASOF_TXT} (consolidated)` } },
  ],
};

module.exports = { forecasts, street, valuation };
