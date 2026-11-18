// Bajaj Finance report, part 6: valuation (street table, multiple derivation, forward P/B chart, cross-checks,
// scenarios, sensitivities, peers). Risks, glossary and statement notes are in part6b.
const X = require('./BAJFINANCE.ctx');
const { streetBlocks } = require('./valuation-blend');
const { F, V, A, AS, SC, fin, n0, n1, n2, pc, ASOF_TXT, price, mv, pbMult, bvSep28, peMult, epsSep28, PB21, PB23, PB2y, PE21, PE23, fwdPbNow, fwdPeNow, PEERS, P, DR_SYMS, sectorPbDr, sectorPeDr, shortName, regimePb, regimePe, rating, ST, shortDate, bvps26, bhflPerShare } = X;

const drTxt = (s, k = 'pbVs') => `${shortName(s)} ${pc(P[s][k])}`;
const jpbV = mv('jpb').value, riV = mv('ri').value, peV = mv('pe').value;
const trailAtTarget = V.tp / F.bvps[0];
const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${pbMult}x Sep-28E book gives {{dcf.tp|inr}}; the intrinsic cross-checks are lower`,
  blocks: [
    ...streetBlocks('BAJFINANCE', {
      rating, noOurEps: true,
      streetIntro: 'Every broker that discloses a method values Bajaj Finance on **price to book value (P/B)**, the standard yardstick for lenders whose returns are steady: Motilal Oswal 4.8x FY28E book, Nomura 4.2x Sep-28E book, ICICI Direct 4.4x FY28E standalone book plus ₹119 a share for the subsidiaries (a sum-of-the-parts variant). We use the same method on the book the market will look at in September 2027 (Sep-28E: half FY28E, half FY29E), so our target is comparable. Targets are as they stood on 30-Sep-2026.',
      street: ST.map(s => [`${s.broker} (${shortDate(s.date)})`, s.rating, s.tp, s.method || 'n.d.', s.multiple || '–', s.on || '–', s.thesis]),
      ourThesis: 'Credit turn drives FY27; franchise intact; regulation and capital cap the multiple',
      streetSource: 'Motilal Oswal via DSIJ; ICICI Direct note (PDF); Nomura, HDFC Securities, Nuvama, CLSA, Citi, JPMorgan, BNP, HSBC, UBS, Macquarie, Ambit via BusinessToday (31-Jul and 21-Aug-2026); Jefferies via CNBC-TV18 (24-Sep-2026); Deven Choksey, Joindre via Trendlyne. n.d. = method not disclosed in the sources we saw',
      derivationIntro: `We start from the stock's own one-year-forward P/B since April 2021 (book does not collapse the way earnings can, so no years are excluded), adjust for how far listed lenders had re-rated or de-rated by ${ASOF_TXT}, and then for growth, which is lower now than in much of that window. Peers and returns are checks.`,
      derivation: [
        ['1. Its own history', `Forward P/B (price ÷ next full-year book): median ${PB21.med}x since Apr-2021 (25th-75th percentile ${PB21.p25}-${PB21.p75}x; range ${PB21.min}-${PB21.max}x); ${PB23.med}x since Apr-2023; ${PB2y.med}x over the last two years; ${n1(fwdPbNow)}x on ${ASOF_TXT} on our FY28E`, `Starting point: ${PB21.med}x`],
        ['2. Sector move', `Trailing P/B vs five-year median on ${ASOF_TXT}: ${DR_SYMS.map(s => drTxt(s)).join(', ')} (median ${pc(sectorPbDr)}). Consumer lenders de-rated, vehicle and diversified lenders re-rated. Bajaj Finance itself ${pc(P.BAJFINANCE.pbVs)}`, `${PB21.med}x × ${(1 + sectorPbDr / 100).toFixed(3)} ≈ ${n1(PB21.med * (1 + sectorPbDr / 100))}x`],
        ['3. Growth', `The 2021-22 part of the window priced 25-30% growth and peaked at ${PB21.max}x. Since Apr-2023 (AUM growth 22-34%, ROE 18-23%, the regime we forecast) the median is ${PB23.med}x, ${pc((regimePb - 1) * 100)} below the full window. We forecast AUM growth of 22-24% and EPS growth of ~18% after FY27`, `× ${regimePb.toFixed(3)} ≈ **${pbMult}x Sep-28E book**`],
        ['4. Peers', `Trailing P/B: Cholamandalam ${n1(P.CHOLAFIN.pb)}x (ROE ${n1(P.CHOLAFIN.roe)}%), SBI Cards ${n1(P.SBICARD.pb)}x (${n1(P.SBICARD.roe)}%), Muthoot ${n1(P.MUTHOOTFIN.pb)}x (${n1(P.MUTHOOTFIN.roe)}%), Shriram ${n1(P.SHRIRAMFIN.pb)}x; Bajaj Finance ${n1(P.BAJFINANCE.pb)}x`, `${pbMult}x Sep-28E = ${n1(trailAtTarget)}x Mar-27E book at the target date: a premium to every peer, as now`],
        ['5. Returns', `ROE ~20% (FY27-29E) vs a ${n1(V.ke)}% cost of equity. Justified P/B = (20 − 10) ÷ (${n1(V.ke)} − 10) = ${n2(V.justifiedPb)}x Sep-27E book (₹${n0(jpbV)})`, 'Fundamentals support a premium, but less than the market pays'],
        ['6. Street', 'Nomura 4.2x Sep-28E; Motilal Oswal 4.8x FY28E (~4.4x on Sep-28E book); ICICI Direct 4.4x FY28E standalone + subsidiaries', `Our ${pbMult}x is at the low end of the brokers that disclose a multiple`],
      ],
      derivationSource: `Screener.in (P/B history to ${ASOF_TXT}), broker notes, GAM Research. The forward series uses next-full-year book (~18 months ahead), so applying the multiple to 12-month-forward Sep-28E book is ~8% conservative.`,
      history: { field: 'bvps', from: '2016-04-01', median: PB21.med, label: `Median since 2021: ${PB21.med}x`, title: `One-year-forward P/B: our ${pbMult}x vs history`, yearStep: 2, min: 0 },
      crossNote: `**What the cross-checks tell us.** P/E (${peMult}x Sep-28E EPS of ₹${n1(epsSep28)}, derived the same way: ${PE21.med}x median forward P/E since 2021 × sector ${pc(sectorPeDr)} × growth ${regimePe.toFixed(2)}) gives ₹${n0(peV)}, close to the target. The two intrinsic methods are well below it: justified P/B ₹${n0(jpbV)} and residual income ₹${n0(riV)}, both at a ${n1(V.ke)}% cost of equity. Put the other way, at ₹${n0(price)} the market is already pricing a long-run ROE of ~{{dcf.impliedRoe|pct}} (residual income) against our 20% and the company's 19-21% corridor. Our P/B target therefore assumes the market keeps paying a franchise premium it has paid for a decade. That premium has shrunk from 8x to 4x since 2021 and could shrink further if growth or regulation disappoints.`,
    }),
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Multiple ${AS.valuation.blend.methods[0].multiple.bull}x (median forward P/B since 2021).`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `AUM +24% / +23% / +22%; NIM {{F.nim.0|pct}} → {{F.nim.2|pct}}; credit cost {{F.creditCost.0|pct}}-{{F.creditCost.2|pct}}; ROE ~20%; ${pbMult}x Sep-28E book.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Multiple ${AS.valuation.blend.methods[0].multiple.bear}x (lowest forward P/B since 2021).`],
    ], source: 'GAM Research' } },
    { pair: [
      { type: 'table', title: 'Target sensitivity: P/B multiple × Sep-28E book (₹)', grid: 'dcf.sensPrimary.grid', rowsRef: 'dcf.sensPrimary.mults', colsRef: 'dcf.sensPrimary.metrics', rowFmt: 'x', colFmt: 'inr1', corner: 'P/B \\ book (bear, base, bull)', source: 'GAM Research' },
      { type: 'table', title: 'Justified P/B value (₹): cost of equity × sustainable ROE', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'Ke \\ ROE', source: 'GAM Research; g = 10%, book at Sep-27E' },
    ] },
    { p: `**Sum of the parts, for reference.** At the 30-Sep close BFL's 86.7% of Bajaj Housing Finance was worth ₹${n0(bhflPerShare)} per BFL share (10% of the price). Taking that out, the market paid ~₹${n0(price - bhflPerShare)} for the rest: ${n1((price - bhflPerShare) / (bvps26 - 0.867 * 22523 / X.shares))}x Bajaj Finance's own Mar-26 book (excluding its share of BHFL's book). BHFL itself trades at ${n1(P.BAJAJHFL.pb)}x book on a 12% ROE, below its own short history. We do not use a SOTP because the street does not, and because BHFL's market value already sits inside the consolidated book and earnings we value.` },
    { exhibit: { type: 'table', title: 'Listed lenders at the 30-Sep-2026 close', head: ['Company', 'Market value (₹ cr)', 'P/B (x)', 'vs 5-yr median P/B', 'P/E (x)', 'ROE FY26', 'ROA FY26', 'Revenue growth FY26'], rows: PEERS.map(p => [p.symbol === 'BAJFINANCE' ? '**Bajaj Finance**' : shortName(p.symbol), n0(p.mcapCr), n1(p.pb), p.pbVs != null && p.pbMed != null && p.symbol !== 'BAJAJHFL' ? pc(p.pbVs) : 'n.m.', n1(p.pe), `${n1(p.roe)}%`, `${n2(p.roa)}%`, pc(p.revG)]), source: `Screener.in (consolidated), trailing multiples scaled to the NSE close on ${ASOF_TXT}; ROA on total assets. BHFL listed in Sep-2024 (n.m.).` } },
  ],
};

module.exports = { valuation, ...require('./BAJFINANCE.part6b') };
