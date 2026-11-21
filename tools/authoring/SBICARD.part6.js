// SBI Cards report, part 6: valuation (street table, multiple derivation, forward P/E chart, cross-checks,
// scenarios, sensitivities, peers). Risks, glossary and statement notes are in part6b.
const X = require('./SBICARD.ctx');
const { streetBlocks } = require('./valuation-blend');
const { F, V, A, AS, SC, fin, n0, n1, n2, pc, ASOF_TXT, price, mv, peMult, epsSep28, pbMult, bvSep28, PE21, PE24, PEN21, PEN24, PB21, PB24, fmPe, fwdPeNow, fwdPbNow, pe27,
  PEERS, P, DR_SYMS, sectorPbDr, sectorPeDr, shortName, peNorm, convK, peDerivedRaw, peReportedPath, peBull, peBear, CCN, sep28n, rating, ST, shortDate, bvps26 } = X;

const drTxt = (s, k = 'peVs') => `${shortName(s)} ${pc(P[s][k])}`;
const jpbV = mv('jpb').value, riV = mv('ri').value, pbV = mv('pb').value;
const ke = V.ke, S0 = AS.valuation.sustainableRoe, g = AS.valuation.g;
const jPe = (1 - g / S0) / ((ke - g) / 100);
const tpOnFy28 = V.tp / F.eps[1];
const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${peMult}x Sep-28E EPS gives {{dcf.tp|inr}}; the intrinsic cross-checks are well below`,
  blocks: [
    ...streetBlocks('SBICARD', {
      rating,
      streetIntro: 'Every broker that discloses a method values SBI Card on **price to earnings (P/E)**: Motilal Oswal 18x FY28E EPS, Emkay 22x FY28E (for a Jun-27 target), Equirus 22x one-year-forward EPS. P/E suits a card issuer because most of its income is fees and its book turns over every few months; book value says less about earning power than it does for a mortgage lender. We use the same method on the earnings the market will look at in September 2027 (Sep-28E: half FY28E, half FY29E), so our target is comparable. Targets are as they stood on 30-Sep-2026.',
      street: ST.map(s => [`${s.broker} (${shortDate(s.date)})`, s.rating, s.tp, s.method || 'n.d.', s.multiple || '–', s.on || '–', s.thesis]),
      ourThesis: 'Credit turn drives FY27-28; growth must follow for the multiple to hold',
      streetSource: 'Motilal Oswal via DSIJ; Emkay note (PDF, via investmentguruindia); UBS research disclosures; CLSA, Jefferies via CNBC-TV18 / Upstox (27-Jul-2026); Bernstein via stockanalysis.com; Geojit, ICICI Securities, Anand Rathi via Trendlyne; Equirus note via Business Standard. n.d. = not disclosed in the sources we saw',
      derivationIntro: `We start from the stock's own one-year-forward P/E since April 2021, as the house rule asks (no trough years: forward EPS never fell below half its prior peak). SBI Card's history needs one adjustment the rule does not make by itself: in FY25-FY26 credit costs of ~9% depressed EPS without collapsing it, so the forward P/E of those years looks inflated. We therefore also measure the history on EPS normalised to a ${CCN}% through-cycle credit cost, take the growth regime we forecast, apply the sector move, and convert back to our (below-normal credit cost) Sep-28E EPS. Peers, returns and the street are checks.`,
      derivation: [
        ['1. Its own history', `Forward P/E on reported EPS (price ÷ next full-year EPS): median ${PE21.med}x since Apr-2021 (25th-75th percentile ${PE21.p25}-${PE21.p75}x; range ${PE21.min}-${PE21.max}x); ${PE24.med}x since Apr-2024; ${n1(fwdPeNow)}x on ${ASOF_TXT} on our FY28E (${n1(pe27)}x FY27E). Trough years: ${fmPe.troughYears.length ? fmPe.troughYears.join(', ') : 'none'}`, `Starting point: ${PE21.med}x`],
        ['2. Credit-cycle adjustment', `EPS normalised to a ${CCN}% gross credit cost (median of FY19, FY23-FY26; actual 6.0-9.1%): FY25 ₹${n1(X.normEps.FY25)} vs ₹${n1(A.eps[10])} reported, FY26 ₹${n1(X.normEps.FY26)} vs ₹${n1(A.eps[11])}. Median forward P/E on that basis: ${PEN21.med}x since Apr-2021`, `${PEN21.med}x on normalised EPS`],
        ['3. Growth regime', `Since Apr-2024 receivables growth has been below 10% and ROE 15-17%, the regime we forecast (not FY22-24's 25%+ growth and 22-26% ROE). Normalised median since then: ${PEN24.med}x (${pc((PEN24.med / PEN21.med - 1) * 100)} vs the full window)`, `${PEN24.med}x`],
        ['4. Sector move', `Trailing P/E vs own five-year median on ${ASOF_TXT}: ${DR_SYMS.map(s => drTxt(s)).join(', ')} (median ${pc(sectorPeDr)}). Left out: SBI Cards itself (${pc(P.SBICARD.peVs)}), HDB Financial (listed 2025) and Bajaj Housing Finance (2024), which lack five-year histories`, `${PEN24.med}x × ${(1 + sectorPeDr / 100).toFixed(3)} = ${n1(peNorm)}x on normalised EPS`],
        ['5. Back to our EPS', `Our Sep-28E EPS (₹${n1(epsSep28)}) assumes credit cost of 6.4-6.5%, below ${CCN}%; normalised Sep-28E EPS is ₹${n1(sep28n)}. ${n1(peNorm)}x × ${n1(sep28n)} ÷ ${n1(epsSep28)} = ${n1(peDerivedRaw)}x. (On reported EPS the same steps give ${n1(peReportedPath)}x; we do not use it because FY25-26 EPS were cyclically depressed)`, `**${peMult}x Sep-28E EPS** (= ${n1(tpOnFy28)}x FY28E)`],
        ['6. Peers', `Trailing P/E: Bajaj Finance ${n1(P.BAJFINANCE.pe)}x (ROE ${n1(P.BAJFINANCE.roe)}%), Cholamandalam ${n1(P.CHOLAFIN.pe)}x (${n1(P.CHOLAFIN.roe)}%), Shriram ${n1(P.SHRIRAMFIN.pe)}x (${n1(P.SHRIRAMFIN.roe)}%); SBI Cards ${n1(P.SBICARD.pe)}x on FY26 ROE of ${n1(P.SBICARD.roe)}%`, 'In line with consumer lenders of similar growth'],
        ['7. Returns', `ROE ~17% vs a ${n1(ke)}% cost of equity. Justified forward P/E = (1 − g ÷ ROE) ÷ (Ke − g) = ${n1(jPe)}x at g = ${g}%; justified P/B ${n2(V.justifiedPb)}x`, 'Fundamentals alone support far less'],
        ['8. Street', 'Motilal Oswal 18x FY28E; Emkay 22x FY28E; Equirus 22x one-year forward', `Our ${n1(tpOnFy28)}x FY28E is at the top of the range`],
      ],
      derivationSource: `Screener.in prices to ${ASOF_TXT}; reported EPS FY22-FY26, GAM estimates FY27-29E; normalised EPS = reported EPS + (actual − ${CCN}%) × average receivables × (1 − tax) ÷ shares; broker notes; GAM Research. The forward series uses next-full-year EPS (~18 months ahead), so applying the multiple to 12-month-forward Sep-28E EPS is slightly generous.`,
      history: { field: 'eps', from: '2021-01-01', median: PE21.med, label: `Median since 2021 (reported): ${PE21.med}x`, title: `One-year-forward P/E: our ${peMult}x vs history`, yearStep: 1, min: 0 },
      crossNote: `**What the cross-checks tell us.** P/B (${pbMult}x Sep-28E book of ₹${n0(bvSep28)}, derived the same way: ${PB21.med}x median forward P/B since 2021 × sector ${pc(sectorPbDr)} × regime ${(PB24.med / PB21.med).toFixed(2)}) gives ₹${n0(pbV)}, above the target, but that history was set when ROE was 15-26% and the market expected a return to 20%+. The intrinsic methods are far lower: justified P/B ₹${n0(jpbV)} and residual income ₹${n0(riV)}, both at a ${n1(ke)}% cost of equity and a ${S0}% long-run ROE. Put the other way, at ₹${n0(price)} the market already prices a long-run ROE of ~{{dcf.impliedRoe|pct}} (residual income), above the ~16-18% that management's 4-4.5% ROA target implies at today's leverage. Our P/E target therefore assumes the market goes back to paying ~21x for a franchise it has de-rated to 16x. That is a judgement on sentiment as much as on numbers.`,
    }),
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} ${peBull}x Sep-28E EPS of ₹${n1((SC.bull.eps[1] + SC.bull.eps[2]) / 2)} (regime median without the sector de-rating).`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Receivables +{{F.aumGrowth.0|pct0}} / +{{F.aumGrowth.1|pct0}} / +{{F.aumGrowth.2|pct0}}; credit cost {{F.creditCost.0|pct}} → {{F.creditCost.2|pct}}; ROE ~17%; ${peMult}x Sep-28E EPS of ₹${n1(epsSep28)}.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} ${peBear}x Sep-28E EPS of ₹${n1((SC.bear.eps[1] + SC.bear.eps[2]) / 2)} (the de-rated multiple of 30-Sep-2026 persists).`],
    ], source: 'GAM Research' } },
    { pair: [
      { type: 'table', title: 'Target sensitivity: P/E multiple × Sep-28E EPS (₹)', grid: 'dcf.sensPrimary.grid', rowsRef: 'dcf.sensPrimary.mults', colsRef: 'dcf.sensPrimary.metrics', rowFmt: 'x', colFmt: 'inr1', corner: 'P/E \\ EPS (bear, base, bull)', source: 'GAM Research' },
      { type: 'table', title: 'Justified P/B value (₹): cost of equity × sustainable ROE', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'Ke \\ ROE', source: `GAM Research; g = ${g}%, book at Sep-27E` },
    ] },
    { p: `**What the price implies.** At ₹${n0(price)}, SBI Card trades at ${n1(price / bvps26)}x FY26 book and ${n1(fwdPbNow)}x our FY28E book, ${n1(pe27)}x FY27E and ${n1(fwdPeNow)}x FY28E EPS. Our target of {{dcf.tp|inr}} is {{dcf.impliedPe|n1}}x FY28E EPS and {{dcf.impliedPb|n2}}x FY28E book. At a 12.1% cost of equity the justified P/B rises to ~${n2((S0 - g) / (12.1 - g))}x; at 14.1% it falls to ~${n2((S0 - g) / (14.1 - g))}x: the intrinsic value is very sensitive to the discount rate, which is why we use it as a check and not as the target.` },
    { exhibit: { type: 'table', title: 'Listed lenders at the 30-Sep-2026 close', head: ['Company', 'Market value (₹ cr)', 'P/B (x)', 'vs 5-yr median P/B', 'P/E (x)', 'vs 5-yr median P/E', 'ROE FY26', 'ROA FY26'], rows: PEERS.map(p => [p.symbol === 'SBICARD' ? '**SBI Cards**' : shortName(p.symbol), n0(p.mcapCr), p.pb ? n1(p.pb) : 'n.a.', p.pbVs != null && !['HDBFS', 'BAJAJHFL'].includes(p.symbol) ? pc(p.pbVs) : 'n.m.', p.pe ? n1(p.pe) : 'n.a.', p.peVs != null && !['HDBFS', 'BAJAJHFL'].includes(p.symbol) ? pc(p.peVs) : 'n.m.', Number.isFinite(p.roe) ? `${n1(p.roe)}%` : 'n.a.', Number.isFinite(p.roa) ? `${n2(p.roa)}%` : 'n.a.']), source: `Screener.in, trailing multiples scaled to the NSE close on ${ASOF_TXT}; five-year medians from Sep-2021; ROA on total assets. HDB Financial (2025) and Bajaj Housing Finance (2024) listed too recently for five-year medians (n.m.).` } },
  ],
};

module.exports = { valuation, ...require('./SBICARD.part6b') };
