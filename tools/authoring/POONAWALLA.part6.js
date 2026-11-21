// Poonawalla Fincorp report, part 6: valuation (street table, multiple derivation with the trough handled, our own
// forward P/B chart, cross-checks, what the price assumes, scenarios, sensitivities, peers). Risks, glossary and
// statement notes are in part6b.
const X = require('./POONAWALLA.ctx');
const { streetBlocks } = require('./valuation-blend');
const { F, V, A, AS, fin, n0, n1, n2, pc, pc1, ASOF_TXT, price, mv, pbMult, bvSep28, peMult, epsSep28, PB21, PBX, PB25, PB2123, PBT, fwdPbChart, PE21, PEADJ, PEADJ_ALL, fwdPbNow, fwdPeNow,
  PEERS, P, DR_SYMS, sectorPbDr, sectorPeDr, shortName, REGIME, rating, ST, shortDate, NORAISE, onSep28, roe24ex, epsAdj } = X;

const drTxt = (s, k = 'pbVs') => `${shortName(s)} ${pc(P[s][k])}`;
const jpbV = mv('jpb').value, riV = mv('ri').value, peV = mv('pe').value;
const trailAtTarget = V.tp / F.bvps[0];
const roePath = `FY23 ${n1(fin.roe[X.fi('FY23')])}%, FY24 ~${n1(roe24ex)}% before one-offs, FY27E ${n1(F.roe[0])}%, FY28E ${n1(F.roe[1])}%`;
// streetBlocks' own history chart drops the 30-Sep close (5th-point sampling) and hides the median line when it is
// within 2 turns of the multiple (a P/E-sized threshold), so we pair our own chart with its target bar instead.
const histChart = { type: 'line', title: `One-year-forward P/B: our ${pbMult}x vs history`, unit: `Price ÷ next full-year book value per share (x); median since 2021 ${PB21.med}x on all dates, ${PBX.med}x ex-trough (line)`, x: fwdPbChart.map(x => x[0]), series: [{ name: 'Forward multiple', values: fwdPbChart.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, min: 0, lines: [{ v: PBX.med, text: `Ex-trough median: ${PBX.med}x` }, { v: pbMult, text: `Our target: ${pbMult}x`, color: '#cf8f1f' }], source: 'Screener.in prices; book value per share; GAM estimates FY27-28E; last point = 30-Sep-2026 close' };
const withHist = blocks => blocks.map(bk => (bk.exhibit && bk.exhibit.type === 'hbar' && /cross-checks vs the share price/.test(bk.exhibit.title) ? { pair: [histChart, bk.exhibit] } : bk));
const sc = AS.scenarios, mPb = AS.valuation.blend.methods[0].multiple;

const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${pbMult}x Sep-28E book gives {{dcf.tp|inr}}; the intrinsic cross-checks are less than half that`,
  blocks: [
    ...withHist(streetBlocks('POONAWALLA', {
      rating, noOurEps: true,
      streetIntro: 'Brokers that disclose a method value Poonawalla on **price to book value (P/B)** on FY28E (Mar-28E) book: Motilal Oswal 3.0x, Deven Choksey 3.2x adjusted book, JM Financial 2.2x and Emkay 1.9x; HDFC Securities uses residual income (implying ~1.9x). P/B is the standard yardstick for lenders and the right one here: earnings have swung from a write-back-flattered FY24 to a FY25 loss, so P/E history is close to meaningless. We use the same method on the book the market will look at in September 2027 (Sep-28E: half FY28E, half FY29E). Targets are as they stood on 30-Sep-2026.',
      street: ST.map(s => [`${s.broker} (${shortDate(s.date)})`, s.rating, s.tp, s.method || 'n.d.', s.multiple || '–', s.on || '–', s.thesis]),
      ourThesis: 'Rebuild working, ROE still below cost of equity; BUY only on the street\'s yardstick',
      streetSource: 'UBS research disclosures; Deven Choksey and Motilal Oswal via DSIJ/InvestmentGuru India; Emkay and JM Financial (PDFs); HDFC Securities Results Daily (18-Jul-2026); Jefferies via Whalesbook; ICICI Securities and Anand Rathi via Trendlyne. n.d. = method not disclosed in the sources we saw',
      derivationIntro: `We start from the stock's own one-year-forward P/B since April 2021. The FY25 trough distorts it: on dates whose forward year was FY25 (a loss) or FY26 (EPS below half the prior peak), the forward book barely grew, so the ratio was inflated (median ${PBT.med}x). We leave those dates out, as the house trough rule does for P/E, and show both bases. Then we adjust for how far listed lenders had re-rated by ${ASOF_TXT} and ask whether the returns we forecast differ from what the window priced.`,
      derivation: [
        ['1. Its own history', `Forward P/B median since Apr-2021: ${PB21.med}x on all dates (range ${PB21.min}-${PB21.max}x); **${PBX.med}x excluding the FY25-FY26 trough windows** (25th-75th percentile ${PBX.p25}-${PBX.p75}x); ${PB2123.med}x in FY22-FY23; ${PB25.med}x since the reset (Apr-2025); ${n1(fwdPbNow)}x on ${ASOF_TXT} on our FY28E`, `Starting point: ${PBX.med}x (${PB21.med}x on all dates)`],
        ['2. Sector move', `Trailing P/B vs five-year median on ${ASOF_TXT}, nine lenders excluding Poonawalla: ${DR_SYMS.map(s => drTxt(s)).join(', ')} (median ${pc1(sectorPbDr)}). Left out: Bajaj Housing Finance and HDB Financial (listed 2024-25, no five-year median). Consumer and card lenders de-rated; vehicle and diversified lenders re-rated. Poonawalla itself ${pc(P.POONAWALLA.pbVs)}`, `${PBX.med}x × ${(1 + sectorPbDr / 100).toFixed(3)} ≈ ${n2(PBX.med * (1 + sectorPbDr / 100))}x`],
        ['3. Growth and returns', `The ex-trough window priced 32-55% AUM growth and 11-14% forward ROE (${roePath}). We forecast 27-40% growth and ROE of ${n1(F.roe[0])}-${n1(F.roe[2])}%, the same regime`, `× ${REGIME.toFixed(2)} ≈ **${pbMult}x Sep-28E book**`],
        ['4. Peers', `Trailing P/B: Bajaj Finance ${n1(P.BAJFINANCE.pb)}x (ROE ${n1(P.BAJFINANCE.roe)}%), Cholamandalam ${n1(P.CHOLAFIN.pb)}x (${n1(P.CHOLAFIN.roe)}%), Shriram ${n1(P.SHRIRAMFIN.pb)}x (${n1(P.SHRIRAMFIN.roe)}%), L&T Finance ${n1(P.LTF.pb)}x (${n1(P.LTF.roe)}%), M&M Financial ${n1(P['M&MFIN'].pb)}x (${n1(P['M&MFIN'].roe)}%), HDB Financial ${n1(P.HDBFS.pb)}x (${n1(P.HDBFS.roe)}%); Poonawalla ${n1(P.POONAWALLA.pb)}x (${n1(P.POONAWALLA.roe)}%)`, `${pbMult}x Sep-28E = ${n1(trailAtTarget)}x Mar-27E book at the target date: a premium to every lender with a similar ROE`],
        ['5. Returns', `ROE ${n1(F.roe[0])}-${n1(F.roe[2])}% (FY27-29E) vs a ${n1(V.ke)}% cost of equity. Justified P/B = (15 − 10) ÷ (${n1(V.ke)} − 10) = ${n2(V.justifiedPb)}x Sep-27E book (₹${n0(jpbV)})`, 'Fundamentals support about half the multiple the market pays'],
        ['6. Street', `Motilal Oswal 3.0x and Deven Choksey 3.2x FY28E book (≈${n1(onSep28(3.0))}x and ${n1(onSep28(3.2))}x on our Sep-28E book); JM Financial 2.2x and Emkay 1.9x (≈${n1(onSep28(2.2))}x and ${n1(onSep28(1.9))}x)`, `Our ${pbMult}x sits between the bulls and the bears`],
      ],
      derivationSource: `Screener.in (P/B history to ${ASOF_TXT}), broker notes, GAM Research. The forward series uses next-full-year book (~12-23 months ahead), so applying it to 12-month-forward Sep-28E book is mildly conservative for a book growing 13-25% a year.`,
      crossNote: `**What the cross-checks tell us.** P/E (${peMult}x Sep-28E EPS of ₹${n1(epsSep28)}, derived the same way: ${PEADJ}x median forward P/E since 2021 on EPS before one-offs with the FY26 trough left out (${PE21.med}x on reported EPS, which carries the FY23-FY24 exceptional gains) × sector ${pc1(sectorPeDr)}) gives ₹${n0(peV)}, in line with the target. The two intrinsic methods are far below it: justified P/B ₹${n0(jpbV)} and residual income ₹${n0(riV)}, both at a ${n1(V.ke)}% cost of equity and a 15% long-run ROE. Put the other way, at ₹${n0(price)} the market already prices a long-run ROE of ~{{dcf.impliedRoe|pct}} (residual income). Our P/B target is a statement about what the market has paid for this kind of growth story, not about what the cash returns are worth today.`,
    })),
    { h: 'What the price already assumes' },
    { exhibit: { type: 'table', title: 'Long-run ROE: what the price implies vs what anyone forecasts', head: ['Measure', 'ROE (%)', 'Basis'], wide: [2], rows: [
      { hl: true, cells: ['**Implied by the 30-Sep price (residual income)**', '**{{dcf.impliedRoe|pct}}**', `₹${n0(price)}; ${n1(V.ke)}% cost of equity; our FY27-29E then a fade`] },
      ['Implied by the price (Gordon P/B on Mar-26 book)', '{{dcf.impliedRoeJpb|pct}}', `${n2(V.currentPb)}x Mar-26 book; g = 10%`],
      ['Management target, if delivered', '18-21', '3-3.5% ROA × ~6x AUM ÷ equity (our arithmetic)'],
      ['Street bulls, FY28E', '16.5-16.8', 'Motilal Oswal, Deven Choksey'],
      ['Street bears, FY28E', '~12', 'HDFC Securities; JM Financial 13.7% average FY26-28E'],
      ['GAM, FY27E / FY28E / FY29E', `${n1(F.roe[0])} / ${n1(F.roe[1])} / ${n1(F.roe[2])}`, 'This report'],
      ['GAM long-run (residual income, justified P/B)', String(AS.valuation.sustainableRoe), '2.5% ROA × ~6x'],
    ], source: 'GAM Research; broker notes (Jul-2026); Q1FY27 call (target)' } },
    { p: `**Read this right:** the market is not paying for today's Poonawalla (ROE ~6% in FY26) or for our forecast (11-14%); it is paying for management's target delivered and held for ever. That can work: if ROA reaches 2.7% and long-run ROE 18% (our bull case), the target is {{scen.bull.tp|inr}}. But it leaves no room for a second credit accident in a book that is young and half unsecured.` },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Multiple ${mPb.bull}x (median forward P/B since 2021, all dates).`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `AUM +{{F.aumGrowth.0|pct0}} / +{{F.aumGrowth.1|pct0}} / +{{F.aumGrowth.2|pct0}}; NIM {{F.nim.0|pct}} → {{F.nim.2|pct}}; credit cost {{F.creditCost.0|pct}} → {{F.creditCost.2|pct}}; ROE {{F.roe.0|pct0}} → {{F.roe.2|pct0}}; ₹3,000 cr raise in FY28E; ${pbMult}x Sep-28E book.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Multiple ${mPb.bear}x (the low since the reset, and the bears' multiple).`],
    ], source: 'GAM Research' } },
    { pair: [
      { type: 'table', title: 'Target sensitivity: P/B multiple × Sep-28E book (₹)', grid: 'dcf.sensPrimary.grid', rowsRef: 'dcf.sensPrimary.mults', colsRef: 'dcf.sensPrimary.metrics', rowFmt: 'x', colFmt: 'inr1', corner: 'P/B \\ book (bear, base, bull)', source: 'GAM Research' },
      { type: 'table', title: 'Justified P/B value (₹): cost of equity × sustainable ROE', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'Ke \\ ROE', source: 'GAM Research; g = 10%, book at Sep-27E' },
    ] },
    { p: `**How sensitive the rating is.** Each 0.1x on the multiple moves the target by ~₹${n0(bvSep28 * 0.1)}: at 2.3x Sep-28E book it would be ~₹${n0(Math.round(2.3 * bvSep28 / 10) * 10)} (HOLD), at the all-dates median of 2.8x ~₹${n0(Math.round(2.8 * bvSep28 / 10) * 10)}. Without the assumed FY28E raise, book per share is ~${n0((1 - NORAISE.bvSep28 / bvSep28) * 100)}% lower and the same ${pbMult}x gives ~₹${n0(NORAISE.tp)} (HOLD). The BUY therefore rests on the multiple holding near the stock's own history and on the company raising equity at a premium to book, as it did in 2025 and 2026.` },
    { exhibit: { type: 'table', title: 'Listed lenders at the 30-Sep-2026 close', head: ['Company', 'Market value (₹ cr)', 'P/B (x)', 'vs 5-yr median P/B', 'P/E (x)', 'vs 5-yr median P/E', 'ROE FY26', 'ROA FY26'], rows: PEERS.map(p => [p.symbol === 'POONAWALLA' ? '**Poonawalla Fincorp**' : shortName(p.symbol), n0(p.mcapCr), p.pb != null ? n1(p.pb) : 'n.a.', p.pbVs != null && !['BAJAJHFL', 'HDBFS'].includes(p.symbol) ? pc(p.pbVs) : 'n.m.', p.pe != null ? n1(p.pe) : 'n.a.', p.peVs != null && !['BAJAJHFL', 'HDBFS'].includes(p.symbol) ? pc(p.peVs) : 'n.m.', p.roe != null ? `${n1(p.roe)}%` : 'n.a.', p.roa != null ? `${n2(p.roa)}%` : 'n.a.']), source: `Screener.in (consolidated; SBI Cards, Bajaj Housing Finance, Aditya Birla Capital and HDB Financial standalone), trailing multiples scaled to the NSE close on ${ASOF_TXT}; ROA on total assets. Bajaj Housing Finance (listed Sep-2024) and HDB Financial (Jul-2025) have no five-year history (n.m.). Manappuram's P/E is inflated by depressed FY26 earnings.` } },
  ],
};

module.exports = { valuation, ...require('./POONAWALLA.part6b') };
