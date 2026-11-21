// Cholamandalam report, part 6: valuation (street table, multiple derivation, forward P/B chart, cross-checks,
// scenarios, sensitivities, peers). Risks, glossary and statement notes are in part6b.
const X = require('./CHOLAFIN.ctx');
const { streetBlocks } = require('./valuation-blend');
const { F, V, A, AS, SC, fin, n0, n1, n2, pc, pc1, ASOF_TXT, price, mv, pbMult, bvSep28, peMult, epsSep28, PB21, PB23, PB2y, PB2122, fwdPbChart, PE21, PE23, fwdPbNow, fwdPeNow, PEERS, P, DR_SYMS, sectorPbDr, sectorPeDr, shortName, REGIME, rating, ST, shortDate, aumCagrHist, epsCagrHist, epsCagrFwd } = X;

const drTxt = (s, k = 'pbVs') => `${shortName(s)} ${pc(P[s][k])}`;
const jpbV = mv('jpb').value, riV = mv('ri').value, peV = mv('pe').value;
const trailAtTarget = V.tp / F.bvps[0];
const onSep28 = x => x * F.bvps[1] / bvSep28; // a multiple of Mar-28E book restated on Sep-28E book
// streetBlocks' own history chart drops the 30-Sep close (5th-point sampling) and hides the median line when it is
// within 2 turns of the multiple (a P/E-sized threshold), so we pair our own chart with its target bar instead.
const histChart = { type: 'line', title: `One-year-forward P/B: our ${pbMult}x vs history`, unit: 'Price ÷ next full-year book value per share (x)', x: fwdPbChart.map(x => x[0]), series: [{ name: 'Forward multiple', values: fwdPbChart.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 2, min: 0, lines: [{ v: PB21.med, text: `Median since 2021: ${PB21.med}x` }, { v: pbMult, text: `Our target: ${pbMult}x`, color: '#cf8f1f' }], source: 'Screener.in prices; book value per share; GAM estimates FY27-28E; last point = 30-Sep-2026 close' };
const withHist = blocks => blocks.map(bk => (bk.exhibit && bk.exhibit.type === 'hbar' && /cross-checks vs the share price/.test(bk.exhibit.title) ? { pair: [histChart, bk.exhibit] } : bk));
const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${pbMult}x Sep-28E book gives {{dcf.tp|inr}}; the intrinsic cross-checks are lower`,
  blocks: [
    ...withHist(streetBlocks('CHOLAFIN', {
      rating, noOurEps: true,
      streetIntro: 'Every broker that discloses a method values Chola on **price to book value (P/B)** on FY28E (Mar-28E) book: Motilal Oswal ~4.0x, Emkay 3.8x, Prabhudas Lilladher 3.8x adjusted book. P/B suits a lender whose returns have been steady (ROE 19-21% for five years). We use the same method on the book the market will look at in September 2027 (Sep-28E: half FY28E, half FY29E). Targets are as they stood on 30-Sep-2026; all were set before the late-September sell-off and IRDAI\'s proposal.',
      street: ST.map(s => [`${s.broker} (${shortDate(s.date)})`, s.rating, s.tp, s.method || 'n.d.', s.multiple || '–', s.on || '–', s.thesis]),
      ourThesis: 'Eight engines and mortgages hold ROE ~19-20%; vehicles, fees and rates cap the multiple',
      streetSource: 'Motilal Oswal and Emkay via InvestmentGuru India; Prabhudas Lilladher (PDF); Nomura via Moneycontrol/TradingView (29-Jul-2026); IDBI Capital, Deven Choksey, Axis Direct via Trendlyne. n.d. = method not disclosed in the sources we saw',
      derivationIntro: `We start from the stock's own one-year-forward P/B since April 2021 (book does not collapse the way earnings can, so no years are excluded), adjust for how far listed lenders had re-rated or de-rated by ${ASOF_TXT}, and then ask whether the growth we forecast differs from what the window priced. Peers, returns and the street are checks.`,
      derivation: [
        ['1. Its own history', `Forward P/B (price ÷ next full-year book): median ${PB21.med}x since Apr-2021 (25th-75th percentile ${PB21.p25}-${PB21.p75}x; range ${PB21.min}-${PB21.max}x); ${PB2122.med}x in FY22-FY23, ${PB23.med}x since Apr-2023, ${PB2y.med}x over the last two years; ${n1(fwdPbNow)}x on ${ASOF_TXT} on our FY28E`, `Starting point: ${PB21.med}x`],
        ['2. Sector move', `Trailing P/B vs five-year median on ${ASOF_TXT}, eight lenders excluding Chola: ${DR_SYMS.map(s => drTxt(s)).join(', ')} (median ${pc1(sectorPbDr)}). Bajaj Housing Finance and HDB Financial left out (listed 2024-25, no five-year median). Vehicle financiers Shriram and L&T Finance re-rated; consumer lenders de-rated. Chola itself ${pc(P.CHOLAFIN.pbVs)}`, `${PB21.med}x × ${(1 + sectorPbDr / 100).toFixed(3)} ≈ ${n2(PB21.med * (1 + sectorPbDr / 100))}x`],
        ['3. Growth', `The window mixes slow years (FY21-22 AUM growth 10-16%, ~${PB2122.med}x) and fast ones (FY23-25, 27-38%, ~${PB23.med}x); over FY21-26 AUM grew ${n1(aumCagrHist)}% and EPS ${n1(epsCagrHist)}% a year. We forecast 20-22% AUM growth, ${n1(epsCagrFwd)}% EPS CAGR (FY26-29E) and ROE ~19-20%, inside that range`, `× ${REGIME.toFixed(2)} ≈ **${pbMult}x Sep-28E book**`],
        ['4. Peers', `Trailing P/B: Bajaj Finance ${n1(P.BAJFINANCE.pb)}x (ROE ${n1(P.BAJFINANCE.roe)}%), Shriram ${n1(P.SHRIRAMFIN.pb)}x (${n1(P.SHRIRAMFIN.roe)}%), Muthoot ${n1(P.MUTHOOTFIN.pb)}x (${n1(P.MUTHOOTFIN.roe)}%), L&T Finance ${n1(P.LTF.pb)}x, M&M Financial ${n1(P['M&MFIN'].pb)}x; Chola ${n1(P.CHOLAFIN.pb)}x (${n1(P.CHOLAFIN.roe)}%)`, `${pbMult}x Sep-28E = ${n1(trailAtTarget)}x Mar-27E book at the target date: a premium to every vehicle financier, below Bajaj Finance`],
        ['5. Returns', `ROE ~19-20% (FY27-29E) vs a ${n1(V.ke)}% cost of equity. Justified P/B = (19 − 10) ÷ (${n1(V.ke)} − 10) = ${n2(V.justifiedPb)}x Sep-27E book (₹${n0(jpbV)})`, 'Fundamentals support a premium to book, but less than the market pays'],
        ['6. Street', `Motilal Oswal ~4.0x and Emkay / Prabhudas Lilladher 3.8x Mar-28E book, i.e. ${n1(onSep28(4))}x and ${n1(onSep28(3.8))}x on Sep-28E book`, `Our ${pbMult}x is below every broker that discloses a multiple`],
      ],
      derivationSource: `Screener.in (P/B history to ${ASOF_TXT}), broker notes, GAM Research. The forward series uses next-full-year book (~12-23 months ahead, ~17 on average), so applying it to 12-month-forward Sep-28E book is ~8-10% conservative.`,
      crossNote: `**What the cross-checks tell us.** P/E (${peMult}x Sep-28E EPS of ₹${n1(epsSep28)}, derived the same way: ${PE21.med}x median forward P/E since 2021 × sector ${pc1(sectorPeDr)} × growth ${REGIME.toFixed(2)}) gives ₹${n0(peV)}, ${pc((peV / V.tp - 1) * 100)} vs the target. The two intrinsic methods are well below it: justified P/B ₹${n0(jpbV)} and residual income ₹${n0(riV)}, both at a ${n1(V.ke)}% cost of equity. Put the other way, at ₹${n0(price)} the market already prices a long-run ROE of ~{{dcf.impliedRoe|pct}} (residual income) against our 19% and Chola's 19-21% record. Our P/B target therefore assumes the market keeps paying a premium for growth it has paid for a decade; that premium has drifted from ~4x forward book in 2023-24 to ~3x today.`,
    })),
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Multiple ${AS.valuation.blend.methods[0].multiple.bull}x (median forward P/B since Apr-2023).`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `AUM +22% / +21% / +20%; NIM {{F.nim.0|pct}} → {{F.nim.2|pct}}; credit cost {{F.creditCost.0|pct}}-{{F.creditCost.2|pct}}; a third of insurance commission lost from FY28E; ROE ~19-20%; ${pbMult}x Sep-28E book.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Multiple ${AS.valuation.blend.methods[0].multiple.bear}x (lowest forward P/B since 2021).`],
    ], source: 'GAM Research' } },
    { pair: [
      { type: 'table', title: 'Target sensitivity: P/B multiple × Sep-28E book (₹)', grid: 'dcf.sensPrimary.grid', rowsRef: 'dcf.sensPrimary.mults', colsRef: 'dcf.sensPrimary.metrics', rowFmt: 'x', colFmt: 'inr1', corner: 'P/B \\ book (bear, base, bull)', source: 'GAM Research' },
      { type: 'table', title: 'Justified P/B value (₹): cost of equity × sustainable ROE', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'Ke \\ ROE', source: 'GAM Research; g = 10%, book at Sep-27E' },
    ] },
    { p: `**How sensitive the rating is.** Each 0.1x on the multiple moves the target by ~₹${n0(bvSep28 * 0.1)}. At 3.1x Sep-28E book the target would be ~₹${n0(Math.round(3.1 * bvSep28 / 10) * 10)} (HOLD); at the street's 3.8x Mar-28E book (~${n1(onSep28(3.8))}x Sep-28E) it would be ~₹${n0(Math.round(3.8 * F.bvps[1] / 10) * 10)}. The rating sits just above the BUY line, so a small change in the multiple or in the book (for example, a deeper IRDAI cut) would turn it into a HOLD.` },
    { exhibit: { type: 'table', title: 'Listed lenders at the 30-Sep-2026 close', head: ['Company', 'Market value (₹ cr)', 'P/B (x)', 'vs 5-yr median P/B', 'P/E (x)', 'vs 5-yr median P/E', 'ROE FY26', 'ROA FY26'], rows: PEERS.map(p => [p.symbol === 'CHOLAFIN' ? '**Cholamandalam**' : shortName(p.symbol), n0(p.mcapCr), p.pb != null ? n1(p.pb) : 'n.a.', p.pbVs != null && !['BAJAJHFL', 'HDBFS'].includes(p.symbol) ? pc(p.pbVs) : 'n.m.', n1(p.pe), p.peVs != null && !['BAJAJHFL', 'HDBFS'].includes(p.symbol) ? pc(p.peVs) : 'n.m.', p.roe != null ? `${n1(p.roe)}%` : 'n.a.', p.roa != null ? `${n2(p.roa)}%` : 'n.a.']), source: `Screener.in (consolidated; SBI Cards and Bajaj Housing Finance standalone), trailing multiples scaled to the NSE close on ${ASOF_TXT}; ROA on total assets. Bajaj Housing Finance (listed Sep-2024) and HDB Financial (Jul-2025) have no five-year history (n.m.); HDB's book data are not on file (n.a.).` } },
  ],
};

module.exports = { valuation, ...require('./CHOLAFIN.part6b') };
