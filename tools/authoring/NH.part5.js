// Narayana Hrudayalaya report, part 5: street view, valuation (sum of the parts on EV/EBITDA, post-Ind AS basis), risks.
const X = require('./NH.ctx');
const { D, F, V, A, AS, SC, n0, n1, pc, ASOF_TXT, price, mcap, mv, peMult, epsSep28, pInd, pIc, pCay, pCihl, pUk, pNd, LPV, icSep28, cihlSep28, lossPvTot, oldLossCharge, ebitdaSep28All, IND_X, CAY_X, UK_X, segEv, ebitdaSep28, blendX, sotpBull, sotpBear,
  netDebtMar26, evNow28, evNow27, evNowSep28, impliedInd, HEV, HEVy, HEVpost, troughEv, FM, fwdEv, fwdPe, PEP, peNow, PEERS, P, MED5EV, drEv, drPe, CORE, LEFT_OUT, sectorDrEv, sectorDrPe, allDrEv,
  coreEvNow, coreEv5, anchorX, anchorBull, anchorBear, peAfter, mixInd, RATIO, indImplied, cayImplied, indCagr, cayCagr, growthRatio, shortName, rating, buyBelow, sellAbove, ruleText,
  ST, pl, idir, kotak, hsbc, avgPost, CONS, idirEv, epsCagrFwd, ebitdaCagrFwd, ebitdaCagrHist, shortDate, b, Q1, RENT, preEbitda } = X;
const sh = F.shares, ps = v => (Math.abs(v / sh) < 5 ? n1(v / sh) : n0(v / sh));
const drTxt = (s, m) => `${shortName(s)} ${pc(m[s])}`;

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: 'The street: 14 Buys and no Sell, targets ₹2,250-2,350, all on a sum of the parts',
  blocks: [
    { p: `After Q1FY27, Prabhudas Lilladher raised its target to ₹2,350 (Buy; India 25x and international 15x FY28E EV/EBITDA), Kotak upgraded to Buy at ₹2,350 (its summary cites ~17x FY28E pre-Ind AS EBITDA for the India hospitals) and HSBC moved from Reduce to Hold at ₹1,835. ICICI Direct's Buy (₹2,310, raised on 29-Jun-2026) rests on India 24x, Cayman 16x and the UK at only 4x FY28E EBITDA. Business Today counted 14 Buys, no Sell and a ₹${n0(CONS.avgTp)} average target on 24-Aug-2026. At the ₹${n0(price)} close on ${ASOF_TXT} the street saw ~25-30% upside. The bull case is simple: India hospitals compound at 20%+ EBITDA growth and deserve peer multiples; Cayman insurance turns; the UK is a cheap option. The debate is about the price of India and the losses elsewhere.` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who'], wide: [0], rows: D.critiques, source: 'Broker notes, earnings calls and filings to 30-Sep-2026' } },
  ],
};

const sotpRows = [
  ['India hospitals', pInd, 'Own forward EV/EBITDA history less sector de-rating, split by growth (see derivation)'],
  ['Less: India clinics + insurance (PV of losses to breakeven)', pIc, `Present value at Sep-2027 of losses still to come, breakeven ${LPV.ic.base.breakeven} (bull ${LPV.ic.bull.breakeven}, bear ${LPV.ic.bear.breakeven}); not a perpetuity`],
  ['Cayman hospitals', pCay, `${RATIO}x the India multiple (Cayman EBITDA growth ${n1(cayCagr)}% vs India ${n1(indCagr)}% a year, FY26-29E)`],
  ['Less: Cayman insurance (PV of losses to breakeven)', pCihl, `PV of the remaining losses (half of FY28E) to breakeven in ${LPV.cihl.base.breakeven}; later profits show up in Cayman hospital volumes`],
  ['UK (Practice Plus Group)', pUk, 'At cost: ~₹2,860 cr EV paid incl. ₹708 cr of leases ≈ 7x our Sep-28E EBITDA'],
];
const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: a sum of the parts at ${n1(blendX)}x Sep-28E EBITDA gives {{dcf.tp|inr}}, below the share price`,
  blocks: [
    { h: 'How the street values Narayana' },
    { p: 'Every broker method we could see is a **sum of the parts on EV/EBITDA**, with India at 24-25x and Cayman/international at 15-16x on FY28E. We use the same method, applied to the EBITDA the market will look at in September 2027 (Sep-28E: half FY28E, half FY29E), with three differences. (1) Our EBITDA is post-Ind AS 116 and we count lease liabilities (₹991 cr) as debt; PL and ICICI use post-Ind AS EBITDA but leave leases out of debt, which flatters their targets by ~₹45-50 a share. (2) We deduct the present value of the start-up losses (India clinics + insurer, Cayman insurer) until breakeven, instead of capitalising a negative EBITDA at a multiple, which would assume the losses never end. (3) We derive the multiples from Narayana\'s own trading history and the sector de-rating rather than from where larger peers trade.' },
    { exhibit: { type: 'table', title: 'How the street values the stock', head: ['Broker', 'Rating', 'Target (₹)', 'Date', 'Method', 'Multiples', 'On', 'Thesis'], wide: [7], rows: [
      ...ST.map(s => [s.broker, s.rating, n0(s.tp), shortDate(s.date), s.method || 'n.d.', s.multiple || '–', s.on || '–', X.rup(s.thesis)]),
      { hl: true, cells: ['**GAM Research**', `**${rating}**`, '**{{dcf.tp|num}}**', '30-Sep-26', '**SOTP EV/EBITDA**', `**India ${IND_X}x, Cayman ${CAY_X}x, UK ${UK_X}x (${n1(blendX)}x)**`, '**Sep-28E**', 'Great India franchise, full price; group dilution and below-street EPS'] },
    ], source: 'PL Q1FY27 note (PDF); ICICI Direct Q4FY26 note (PDF) and Trendlyne; Kotak via DSIJ and Kotak Neo; HSBC via Business Today; Geojit and BP Wealth via Trendlyne. n.d. = method not disclosed' } },
    { h: 'Our sum of the parts' },
    { exhibit: { type: 'table', title: 'Sum of the parts (base case)', head: ['Part', 'Sep-28E EBITDA (₹ cr)', 'Multiple', 'Value (₹ cr)', '₹ / share', 'Why'], wide: [5], rows: [
      ...sotpRows.map(([nm, p, why]) => [nm, p.metric == null ? 'PV' : n0(p.metric), p.metric == null ? '–' : `${p.mult}x`, n0(p.value), ps(p.value), why]),
      ['Less: net debt incl. leases at Sep-27E', '–', '–', n0(pNd.value), ps(pNd.value), 'Model: borrowings incl. lease liabilities less cash and investments (half Mar-27E + half Mar-28E)'],
      { hl: true, cells: ['**Equity value / target (rounded to ₹5)**', `**${n0(ebitdaSep28)}**`, `**${n1(blendX)}x** (profitable parts)`, '**{{dcf.sotp.equity|num}}**', '**{{dcf.tp|num}}**', 'vs CMP ₹{{P.last|num}}: {{dcf.upside|chg}}'] },
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Start-up losses: present value until breakeven, not a perpetuity (₹ crore)', head: ['', 'H2FY28E', 'FY29E', 'FY30E', 'FY31E', 'FY32E', 'Breakeven', 'PV at Sep-2027'], rows: [
      ...['base', 'bull', 'bear'].map(c => [`India clinics + insurance (${c})`, ...['H2FY28E', 'FY29E', 'FY30E', 'FY31E', 'FY32E'].map(y => { const f = LPV.ic[c].flows.find(x => x[0] === y); return f ? n0(f[2]) : '0'; }), LPV.ic[c].breakeven, n0(LPV.ic[c].pv)]),
      ...['base', 'bull', 'bear'].map(c => [`Cayman insurance (${c})`, ...['H2FY28E', 'FY29E', 'FY30E', 'FY31E', 'FY32E'].map(y => { const f = LPV.cihl[c].flows.find(x => x[0] === y); return f ? n0(f[2]) : '0'; }), LPV.cihl[c].breakeven, n0(LPV.cihl[c].pv)]),
      ['Memo: perpetuity treatment (Sep-28E EBITDA × India / Cayman multiple)', '', '', '', '', '', '–', n0(oldLossCharge)],
    ], source: `GAM Research (NH.losspv.js). FY27E and H1FY28E losses are already in net debt at Sep-27E. FY28-29E = our segment forecasts (scenario margins for bull/bear), then a straight-line run-off to zero in the breakeven year; pre-tax; discounted at a ${AS.valuation.lossPV.ke}% cost of equity. Management gives no breakeven date for the India units (Kotak expects Cayman insurance to break even by end-FY28). The insurers' capital (insurance segment capital employed ₹170 cr at Mar-26) is in consolidated cash and so already in net debt.` } },
    { h: `Deriving the multiples: India ${IND_X}x, Cayman ${CAY_X}x, UK ${UK_X}x` },
    { exhibit: { type: 'table', title: 'Deriving the target multiples', head: ['Yardstick', 'Evidence', 'What it implies'], wide: [1, 2], rows: [
      ['1. Its own history', `One-year-forward EV/EBITDA since Apr-2021 (EV incl. leases; post-Ind AS EBITDA; before the Nov-2025 UK deal, forward EBITDA excludes the UK): median **${n1(HEV.med)}x** (25th-75th percentile ${n1(HEV.p25)}-${n1(HEV.p75)}x; ${n1(HEV.min)}x in 2021, ${n1(HEV.max)}x in 2025). Calendar medians: 2022 ${n1(HEVy('2022').med)}x, 2023 ${n1(HEVy('2023').med)}x, 2024 ${n1(HEVy('2024').med)}x, 2025 ${n1(HEVy('2025').med)}x, 2026 ${n1(HEVy('2026').med)}x; since the deal ${n1(HEVpost.med)}x. Trough years left out: ${troughEv ? troughEv + ' points' : 'none (forward EBITDA never fell below half its prior three-year peak)'}. On ${ASOF_TXT}: ${n1(fwdEv.at(-1)[1])}x FY28E`, `Starting point: ${n1(HEV.med)}x for India + Cayman`],
      ['2. Sector de-rating', `Trailing EV/EBITDA vs each stock's five-year median on ${ASOF_TXT}: ${CORE.map(s => drTxt(s, drEv)).join(', ')} (median ${pc(sectorDrEv)}); Narayana itself ${pc(drEv.NH)}. Left out: ${LEFT_OUT.map(s => drTxt(s, drEv)).join(', ')} (start-up losses at KIMS's new hospitals; Aster's 2024 GCC demerger and merger); with them the median is ${pc(allDrEv)}`, `${n1(HEV.med)}x × ${(1 + sectorDrEv / 100).toFixed(3)} ≈ **${n1(anchorX)}x** for India + Cayman`],
      ['3. Split by growth', `India hospital EBITDA grows ${n1(indCagr)}% a year in FY26-29E, Cayman hospitals ${n1(cayCagr)}% (ratio ${growthRatio.toFixed(2)}); the street's Cayman/India ratio is 0.60 (PL) to 0.67 (ICICI). With Cayman at ${RATIO}x India and the FY25-26 mix (India ${Math.round(mixInd * 100)}% of the two businesses' EBITDA, losses included)`, `India ${n1(indImplied)}x → **${IND_X}x**; Cayman ${n1(cayImplied)}x → **${CAY_X}x**`],
      ['4. UK', 'NH paid £188.8 mn (₹2,201 cr) plus ₹708 cr of assumed leases, less ₹46 cr of cash: ~₹2,860 cr of EV, 9.2x FY25 pre-IFRS EBITDA. ICICI Direct uses 4x', `At cost: **${UK_X}x** our Sep-28E post-IFRS 16 EBITDA (bull 9x, bear 5x)`],
      ['5. Peers', `Trailing EV/EBITDA on ${ASOF_TXT}: core peers' median ${n1(coreEvNow)}x (five-year median ${n1(coreEv5)}x); Narayana ${n1(P.NH.evEbitda)}x vs its own ${n1(MED5EV.NH)}x five-year median; on five-year medians Narayana has traded at a ~${Math.round((1 - MED5EV.NH / coreEv5) * 100)}% discount to peers (lower growth, overseas mix)`, 'No reason to close the discount now'],
      ['6. Growth and returns', `EBITDA grew ${Math.round(ebitdaCagrHist)}% a year in FY23-26 (incl. the UK); we forecast ~${Math.round(ebitdaCagrFwd)}% for FY26-29E (full-year UK in FY27). ROE ${n1(A.roe[b])}% (FY26), our {{F.roe.0|pct}} → {{F.roe.2|pct}}; ROCE fell from 32% to 16% and new beds cost ~3x the old ones`, 'No premium'],
      ['7. What the market pays', `At ₹${n0(price)}, valuing Cayman and the UK at our multiples, the price implies ~${n1(impliedInd)}x Sep-28E EBITDA for India hospitals (after deducting the PV of the start-up losses); the group trades at ${n1(evNowSep28)}x Sep-28E (${n1(evNow28)}x FY28E)`, `The price already assumes India ~${n1(impliedInd - IND_X)}x above what we derive`],
    ], source: `Screener.in prices, balance sheets and multiples to ${ASOF_TXT}; broker notes; GAM Research (NH.ctx.js)` } },
    { pair: [
      { type: 'line', title: `Forward EV/EBITDA since Apr-2021: median ${n1(HEV.med)}x; our SOTP ${n1(blendX)}x`, unit: 'EV (incl. lease liabilities) ÷ next full-year EBITDA, post-Ind AS (x)', x: fwdEv.map(x => x[0]), series: [{ name: 'Forward EV/EBITDA', values: fwdEv.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: HEV.med, text: `Median: ${n1(HEV.med)}x` }, { v: Math.round(anchorX * 10) / 10, text: `De-rated: ${n1(anchorX)}x`, color: '#cf8f1f' }], source: 'Screener.in; AR FY25-26; GAM estimates for FY27-29E; pre-deal points exclude the UK' },
      { type: 'line', title: `Forward P/E since Apr-2021: median ${n1(FM.median)}x, ${n1(peNow)}x now`, unit: 'Price ÷ next full-year EPS (x)', x: fwdPe.map(x => x[0]), series: [{ name: 'Forward P/E', values: fwdPe.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: FM.median, text: `Median: ${n1(FM.median)}x` }, { v: peMult, text: `Cross-check: ${peMult}x`, color: '#cf8f1f' }], source: 'Screener.in; GAM estimates (forwardMedian; no trough years)' },
    ] },
    { exhibit: { type: 'table', title: 'Target price and cross-checks', head: ['Method', 'Role', 'Basis', 'Multiple', 'Value / share (₹)', 'vs target', 'Bull (₹)', 'Bear (₹)'], rows: [
      ['**Sum of the parts**', '**Target**', 'Sep-28E segment EBITDA', `India ${IND_X}x (bull 22x, bear 15.5x); Cayman ${CAY_X}x (13.5x, 9x); UK ${UK_X}x (9x, 5x)`, '**{{dcf.blend.methods.0.value|num}}**', '–', '{{scen.bull.blend.methods.0.value|num}}', '{{scen.bear.blend.methods.0.value|num}}'],
      ['P/E', 'Cross-check', `Sep-28E EPS ₹${n1(epsSep28)}`, `${peMult}x (bull 33x, bear 23x)`, '{{dcf.blend.methods.1.value|num}}', pc(mv('pe').vsTarget), '{{scen.bull.blend.methods.1.value|num}}', '{{scen.bear.blend.methods.1.value|num}}'],
      ['DCF', 'Cross-check', `15-year FCFF at ${n1(V.ke)}%, g ${AS.dcf.terminalGrowth}%`, `implies ${n1(V.impliedEvEbitda)}x FY28E EV/EBITDA`, '{{dcf.blend.methods.2.value|num}}', pc(mv('dcf').vsTarget), '{{scen.bull.blend.methods.2.value|num}}', '{{scen.bear.blend.methods.2.value|num}}'],
      { hl: true, cells: ['**12-month target (rounded)**', '', '', '', '**{{dcf.tp|inr}}**', '{{dcf.upside|chg}} vs CMP', '{{scen.bull.tp|inr}}', '{{scen.bear.tp|inr}}'] },
    ], source: 'GAM Research' } },
    { callout: `**What the cross-checks tell us.** P/E at ${peMult}x (Narayana's ${n1(FM.median)}x forward median since Apr-2021, cut by the peers' ${Math.abs(Math.round(sectorDrPe))}% P/E de-rating) on Sep-28E EPS of ₹${n1(epsSep28)} gives ₹${n0(mv('pe').value)}, ${pc(mv('pe').vsTarget)} vs the target. The DCF (₹${n0(mv('dcf').value)}) is lower still: capex of ₹950-1,350 cr a year to FY29E and a ${n1(V.ke)}% cost of capital do not support today's price unless India margins and the UK improve well beyond our forecasts. All three methods sit below ₹${n0(price)}. The street's higher targets come from peer-like India multiples (24-25x on FY28E, a year earlier than our Sep-28E), higher EPS and leaving leases out of debt; on our numbers, ICICI Direct's own multiples would give ~₹${n0((pInd.metric * 24 + icSep28 * 24 + (pCay.metric + cihlSep28) * 16 + pUk.metric * 4 + pNd.value) / sh)} a share on Sep-28E.` },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} India 22x, Cayman 13.5x, UK 9x (the 75th percentile of the history); losses end a year earlier; FY28E EPS ₹${n1(SC.bull.eps[1])}.`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `India revenue +{{as.segments.0.growth.0|pct}} / +{{as.segments.0.growth.1|pct}} / +{{as.segments.0.growth.2|pct}} at 23-23.5% margins; Cayman +8% / +7% / +6% in US$ at ~44%; UK 9.5% → 12%; insurance and clinic losses ₹196 cr in FY27E falling to ₹56 cr in FY29E, deducted at their present value until breakeven (FY32E India, FY29E Cayman); India ${IND_X}x, Cayman ${CAY_X}x, UK ${UK_X}x; FY28E EPS ₹${n1(F.eps[1])}.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} India 15.5x, Cayman 9x, UK 5x (25th percentile); losses last a year longer; FY28E EPS ₹${n1(SC.bear.eps[1])}.`],
    ], source: 'GAM Research' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-42E free cash flow (capex incl. new leases)', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Add: net cash at Mar-27E (negative = net debt incl. leases)', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
      { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ], source: 'GAM Research. Discount rate 11.6% = 6.5% + 0.85 × 6%, set so the single rate equals our WACC (~9% of EV is debt).' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of capital down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Listed hospital peers (trailing, at the 30-Sep-2026 close)', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'EV/EBITDA (x)', 'vs 5-yr median', 'P/E (x)', 'vs 5-yr median', 'ROE'], rows: PEERS.map(p => [p.symbol === 'NH' ? '**Narayana**' : shortName(p.symbol), n0(p.mcapCr), n0(p.revenue), p.ebitdaMargin + '%', n1(p.evEbitda), pc(drEv[p.symbol]), n1(p.pe), pc(drPe[p.symbol]), p.roe + '%']), source: `Screener.in (post-Ind AS EBITDA; EV incl. lease liabilities), multiples scaled to the NSE close on ${ASOF_TXT}. KIMS and Aster DM are shown but left out of the de-rating median.` } },
  ],
};

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: 'Our honest summary: own the India hospitals some day, but not at a price that already pays for them',
  blocks: [
    { callout: `**What you are buying:** India's lowest-cost large hospital network with rising margins and a credible ₹3,000 cr bed plan; a high-margin US-dollar hospital in the Cayman Islands; a UK turnaround; and two start-up insurers. A founding family with 63%, an AA balance sheet and net debt of ~1x forward EBITDA.` },
    { callout: `**What you are paying:** ${n1(evNow28)}x our FY28E EV/EBITDA and ${n1(peNow)}x FY28E EPS, in line with Narayana's own history although the sector has de-rated ~${Math.abs(Math.round(sectorDrEv))}%, for EPS ~${Math.round(100 - F.eps[1] / pl.eps.FY28E * 100)}% below the street's. On the street's method with our inputs and derived multiples, the target is {{dcf.tp|inr}} ({{dcf.upside|chg}}): a ${rating}. The bull case ({{scen.bull.tp|inr}}) needs India to earn peer multiples and the UK and insurers to turn quickly.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      ['India hospital margin above 25% while the new beds open', 'Medium', 'Quarterly India margin, new-centre losses'],
      ['Cayman insurance at breakeven by FY28 and hospital growth back near 10%', 'Medium', 'CIHL EBITDA after the July and January renewals'],
      ['UK margins in the low teens with a rising private share', 'Low-medium', 'UK post-IFRS EBITDA, private-pay mix, software roll-out'],
      [`A price nearer ₹${n0(buyBelow)} (our buy-below level)`, '–', 'Valuation'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['New India beds ramp slowly at ~3x the old cost per bed', 'Medium', 'ROCE stays near 16%; bear case {{scen.bear.tp|inr}}'],
      ['India insurance losses keep rising with growth (219% claims ratio)', 'Medium', 'Each ₹50 cr of extra loss is ~₹2 of EPS'],
      ['UK NHS tariff squeeze or another operational shock', 'Medium', 'UK margins stuck near 8-9%; £150 mn loan to service'],
      ['Cayman: hurricane, regulation or a competitor', 'Low', 'Over a third of group EBITDA from one island'],
      ['Rupee strengthens', 'Low-medium', `Each 1% is ~₹${n0((X.segE('cay')[1] + X.segE('cihl')[1] + X.segE('uk')[1]) / 100)} cr of FY28E EBITDA`],
      ['Governance: more acquisitions or related-party growth', 'Low-medium', 'Capital allocation already stretched'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**We would turn buyers below ~₹${n0(buyBelow)}** and stay sellers above ~₹${n0(sellAbove)} on today's numbers. We would raise the India multiple if new beds fill at the old margins, and value insurance at more than its losses if India's claims ratio falls below 100%.`,
      `**Biggest swing factor:** the India multiple. Each 1x on India is ~₹${n0(pInd.metric / sh)} a share; India at the street's 24x would give ~₹${n0((V.sotp.equity + pInd.metric * (24 - IND_X)) / sh)}. If the start-up losses never ended, capitalising Sep-28E's ₹${n0(-(icSep28 + cihlSep28))} cr at our multiples would cost ~₹${n0((-oldLossCharge + lossPvTot) / sh)} a share more than our PV treatment.`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'India ARPOB, Q1FY27', v: `₹${n1(Q1.indiaHospitals.arpobMn)} mn`, d: '+9% YoY; occupied beds ~flat since FY24' },
      { k: 'India hospital margin', v: `${Q1.indiaHospitals.marginPct}%`, d: 'company basis; 18.2% in FY23' },
      { k: 'Insurance + clinic losses', v: '₹68 cr', d: 'in Q1FY27 alone (₹139 cr in FY26)' },
      { k: 'Forward EV/EBITDA', v: `${n1(fwdEv.at(-1)[1])}x`, d: `median since Apr-21 ${n1(HEV.med)}x; sector −${Math.abs(Math.round(sectorDrEv))}%` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

module.exports = { street, valuation, risks };
