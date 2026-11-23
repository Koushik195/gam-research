// Aurobindo Pharma report, part 7: valuation (P/E primary on EPS before exceptional items, derived multiple, per-peer sector
// factor, sensitivities, cross-checks, scenarios, DCF, peers) and risks & honest summary.
const X = require('./AUROPHARMA.ctx');
const { streetBlocks } = require('./valuation-blend');
const { D, F, V, A, AS, SC, n0, n1, pc, pc1, rup, ASOF_TXT, ASOF, price, mcap, mv, MULT, IMPLIED, EPS_SEP, epsPost, SH_POST, SH_ADJ, FM, HA, HR, FWDFY, fwdAdj, troughExc, fy23Ratio, fy23RatioRep, epsExc, epsRep, peFY27, peFY28, peSep28, peTtm,
  PEER_SYMS, EXCL, PEERS, P, MED5, derate, USED, sectorCalc, sectorCalcAll, sectorEvCalc, sectorLarge, SECTOR_SET, k, derived, shortName, SENS, val, HEV, evMULT, evTtm, evFy28, roeSus, gSus, keV, justPe,
  rating, ruleText, buyBelow, sellAbove, dcfPost, evPost, epsCagrFwd, roeHist, ST, idir, pl_, mosl, shortDate, Q1, b, BL, S } = X;
const { wcArtefact } = require('./AUROPHARMA.part6');
const pc2 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(2)}%`;

const drRow = s => [shortName(s) + (EXCL.includes(s) ? ' (excluded)' : s === 'AUROPHARMA' ? ' (not used)' : ''), n1(P[s].pe), n1(MED5[s]), pc1(derate[s]), EXCL.includes(s) ? rup(D.peers.excluded[s]) : s === 'AUROPHARMA' ? 'The company itself' : 'Used'];
const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${MULT.base}x Sep-28E EPS gives {{dcf.tp|inr}}; after a 53% rally the price is fair`,
  blocks: [
    ...streetBlocks('AUROPHARMA', {
      rating,
      streetIntro: `Every note with a disclosed method values Aurobindo on **P/E**: ICICI Direct 18x FY28E, Prabhudas Lilladher 18x FY28E, Motilal Oswal 20x 12-month-forward EPS (HDFC Securities' Feb-2026 note used 16x Q3FY28E). We use the same method on the EPS the market will look at in September 2027 (Sep-28E: half FY28E, half FY29E), per post-buyback share (${SH_POST.toFixed(2)} cr shares). The engine carries the multiple as ${IMPLIED.base}x its own EPS on the FY26 share count, which is the same target.`,
      street: ST.map(s => [`${s.broker} (${shortDate(s.date)})`, s.rating, s.tp, s.method || 'n.d.', s.multiple || '–', s.on || '–', rup(s.thesis)]),
      ourThesis: 'FY27 lifted by the rupee, Lannett and Pen-G; US base flat and Eugia blocked; fair at 18x',
      streetSource: 'ICICI Direct and PL notes (PDF); Motilal Oswal (DSIJ summary); HDFC Securities (askfuzz, HDFC Sky); Investing.com rows (ICICI Securities, HSBC, Macquarie); Business Today (Nuvama). n.d. = not disclosed. "At our EPS" uses engine EPS.',
      derivationTitle: `Our target multiple: ${MULT.base}x (${IMPLIED.base}x on the engine's FY26 share count), and why`,
      derivationIntro: 'We start from Aurobindo\'s own one-year-forward P/E since Apr-2021, on EPS before exceptional items (batch practice A18: exceptional items are material, above all FY21\'s Natrol gain; forecasts carry none), apply the pharma sector factor and test the result against growth, peers, returns and the street.',
      derivation: [
        ['1. Its own history', `On EPS before exceptional items the median is ${n1(HA.med)}x (25th-75th percentile ${n1(HA.p25)}-${n1(HA.p75)}x; range ${n1(HA.min)}-${n1(HA.max)}x; ${HA.n} fortnightly points). Trough test: none excluded; FY23's forward EPS (₹${n1(epsExc[2023])}) was ${Math.round(fy23Ratio * 100)}% of the prior three-year peak (₹${n1(epsExc[2021])}), above the 50% line. By forward year: ${FWDFY.map(f => `${f.fy} ${n1(f.med)}x`).join(', ')}. The house forwardMedian on reported EPS is ${n1(FM.median)}x, because the FY21 Natrol gain (reported EPS ₹${n1(epsRep[2021])}) makes FY23 look like a trough (${Math.round(fy23RatioRep * 100)}% of peak) and drops it`, `Starting point: ${n1(HA.med)}x (A18; reported-EPS median shown as a sensitivity)`],
        ['2. Sector factor', `Pharma peers' trailing P/E at the ${ASOF_TXT} close vs their five-year medians (table below): median of the eight-company set excluding Aurobindo ${pc2(SECTOR_SET)} (PLAYBOOK §7c; our reproduction gives ${pc2(sectorCalc)}, the same with all 14 names; the EV/EBITDA analogue is ${pc2(sectorEvCalc)}). Pharma trades above its history, so this is a re-rating`, `${n1(HA.med)}x × ${k.toFixed(4)} = ${n1(derived)}x → **${MULT.base}x**`],
        ['3. Growth', `EPS before exceptional items grew only ~1% a year FY21-26 (5.7% a year FY19-26); we forecast ${n1(epsCagrFwd)}% a year FY26-29E per post-buyback share, but roughly half of FY27's jump is the rupee and Lannett. Faster growth than the history the median was paid for, of lower quality`, 'No adjustment (sensitivity only)'],
        ['4. Peers', `Trailing P/E on ${ASOF_TXT}: Zydus ${n1(P.ZYDUSLIFE.pe)}x, Alkem ${n1(P.ALKEM.pe)}x, Cipla ${n1(P.CIPLA.pe)}x, Sun ${n1(P.SUNPHARMA.pe)}x, Ipca ${n1(P.IPCALAB.pe)}x, Abbott India ${n1(P.ABBOTINDIA.pe)}x, Torrent ${n1(P.TORNTPHARM.pe)}x, Divi's ${n1(P.DIVISLAB.pe)}x; Aurobindo ${n1(P.AUROPHARMA.pe)}x, ${pc1(derate.AUROPHARMA)} above its own five-year median, the most re-rated in the set after Torrent`, `${MULT.base}x Sep-28E is ${n1(V.tp / epsPost[1])}x our FY28E: the cheapest in the set, as it has been for a decade`],
        ['5. Returns', `ROE ${roeHist.map(r => n1(r)).join(' / ')}% in FY22-26 and ~{{F.roe.1|pct}} in FY28E vs an ${n1(keV)}% cost of equity. A Gordon-growth P/E at ${n1(roeSus)}% ROE and ${gSus}% growth is only ~${n1(justPe)}x`, 'Argues for a lower multiple; sensitivity only (§7c)'],
        ['6. Street', `ICICI Direct and PL use 18x FY28E, MOSL 20x 12-month forward. Our target is ${n1(V.tp / idir.eps.FY28E)}x ICICI Direct's FY28E EPS and ${n1(V.tp / pl_.eps.FY28E)}x PL's`, 'Same method and multiple as two of three; our EPS is near PL\'s'],
      ],
      derivationSource: `Screener.in prices, EPS, exceptional items and P/E history to ${ASOF_TXT}; peersAsOf at the NSE close; broker notes; GAM Research`,
      history: { field: 'eps', from: '2016-04-01', median: FM.median, label: `House median since Apr-2021 (reported EPS, FY23 excluded): ${n1(FM.median)}x`, title: 'Forward P/E on reported EPS since 2016 (house series)', yearStep: 2 },
      crossNote: `**What the cross-checks tell us.** EV/EBITDA (${evMULT.base}x trailing EBITDA at the target date, plus the engine's net cash) gives ₹${n0(mv('ev').value)}: ${evMULT.base}x is Aurobindo's ${n1(HEV.med)}x trailing median since 2021 times the same sector factor; the stock trades at ${n1(evTtm)}x trailing and ${n1(evFy28)}x our FY28E EBITDA today, well above that history. The DCF (₹${n0(mv('dcf').value)}) is ${Math.abs(Math.round(mv('dcf').vsTarget))}% below the target and below today's price: at an ${n1(keV)}% cost of equity, 5% terminal growth and a 21.5% margin, Aurobindo's cash flows are held back by working capital (~${n1(F.owcPct)}% of revenue) and capex (~5% of revenue). Both cross-checks are on the engine's FY26 share count and FY27 cash (per post-buyback share they are ~1% higher, and the working-capital artefact described in Forecasts adds ~₹${n0(wcArtefact / SH_POST)}). Even so, the cross-checks say the same thing as the P/E: no upside unless the business improves faster than we model.`,
    }),
    { exhibit: { type: 'table', title: 'The sector factor, peer by peer (trailing P/E at the 30-Sep-2026 close vs five-year median)', head: ['Company', 'P/E at 30-Sep (x)', '5-yr median (x)', 'vs median', 'Status'], wide: [4], rows: [
      ...[...USED, 'AUROPHARMA', ...EXCL].map(drRow),
      { hl: true, cells: ['**Median of the eight used**', '', '', `**${pc2(sectorCalc)}**`, `PLAYBOOK §7c sets ${pc2(SECTOR_SET)} (factor ${k.toFixed(4)}); our reproduction ${pc2(sectorCalc)}; all 14 peers ${pc2(sectorCalcAll)}; five large caps (Sun, Divi's, Torrent, Zydus, Cipla) ${pc1(sectorLarge)}`] },
    ], source: `Screener.in (P/E charts), multiples scaled to the NSE close on ${ASOF_TXT} (asof-peers); five-year window Sep-2021 to Sep-2026; PLAYBOOK §7c pharma set` } },
    { exhibit: { type: 'table', title: 'Sensitivity of the target to the multiple (not in the base case)', head: ['View', 'Multiple', 'Target (₹)', 'vs CMP', 'Why we do not use it in the base'], wide: [4], rows: [
      ['House median on reported EPS (FY23 dropped as a trough) × factor', `${SENS.reported}x (${n1(FM.median)}x × ${k.toFixed(3)})`, n0(val(SENS.reported)), pc((val(SENS.reported) / price - 1) * 100), 'The FY21 Natrol gain distorts both the EPS and the trough test (A18)'],
      ['Reported EPS, no trough exclusion × factor', `${SENS.reportedAll}x (${n1(FM.medianAll)}x)`, n0(val(SENS.reportedAll)), pc((val(SENS.reportedAll) / price - 1) * 100), 'Same as the base: exceptional items barely move the full-window median'],
      ['Aurobindo\'s own re-rating instead of the sector\'s', `${SENS.own}x (${pc1(derate.AUROPHARMA)})`, n0(val(SENS.own)), pc((val(SENS.own) / price - 1) * 100), 'House rule: sector factor only (§7c)'],
      ['Large-cap sub-set (Sun, Divi\'s, Torrent, Zydus, Cipla)', `${SENS.large}x (${pc1(sectorLarge)})`, n0(val(SENS.large)), pc((val(SENS.large) / price - 1) * 100), 'Hand-picked sub-set (§7c)'],
      ['No sector factor (own median only)', `${SENS.noFactor}x`, n0(val(SENS.noFactor)), pc((val(SENS.noFactor) / price - 1) * 100), 'Ignores the sector re-rating the house applies in both directions'],
      ['Returns-based (Gordon, ROE vs cost of equity)', `~${n1(justPe)}x`, n0(val(justPe)), pc((val(justPe) / price - 1) * 100), 'No returns adjustment in the base (§7c); the market has not paid this since 2021'],
      { hl: true, cells: ['**Base**', `**${MULT.base}x**`, '**{{dcf.tp|num}}**', '**{{dcf.upside|chg}}**', 'Own median before exceptional items × sector factor'] },
    ], source: `GAM Research; targets = multiple × Sep-28E EPS per post-buyback share (₹${n1(EPS_SEP.base)})` } },
    { pair: [
      { type: 'line', title: `Forward P/E before exceptional items: ${n1(HA.med)}x median, ${n1(peFY28)}x now on FY28E`, unit: 'Price ÷ next full-year EPS before exceptional items (x)', x: fwdAdj.map(x => x[0]), series: [{ name: 'Forward P/E', values: fwdAdj.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: HA.med, text: `Median ${n1(HA.med)}x` }, { v: MULT.base, text: `Target ${MULT.base}x`, color: '#cf8f1f' }], source: 'Screener.in prices; EPS before exceptional items; GAM estimates FY27-28E' },
      { type: 'line', title: `Trailing EV/EBITDA: median ${n1(HEV.med)}x since 2021`, unit: 'EV ÷ trailing EBITDA (x), Screener', x: S.charts.evEbitda['EV Multiple'].filter(([d]) => d >= '2021-04-01' && d <= ASOF).map(x => x[0]), series: [{ name: 'EV/EBITDA', values: S.charts.evEbitda['EV Multiple'].filter(([d]) => d >= '2021-04-01' && d <= ASOF).map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: HEV.med, text: `Median ${n1(HEV.med)}x` }, { v: evMULT.base, text: `Cross-check ${evMULT.base}x`, color: '#cf8f1f' }], source: 'Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Revenue growth +2.5pp a year, margin +1.5pp (EPS ₹${n1(SC.bull.eps[1] * SH_ADJ)} FY28E); ${MULT.bull}x (75th percentile × factor).`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Revenue +{{F.salesGrowth.0|pct}} / +{{F.salesGrowth.1|pct}} / +{{F.salesGrowth.2|pct}}; margin {{F.ebitdaMargin.0|pct}} → {{F.ebitdaMargin.2|pct}}; US $${BL.usUsdMn.join(' / ')}mn; ${MULT.base}x Sep-28E EPS of ₹${n1(EPS_SEP.base)}.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Revenue growth −3pp a year, margin −2pp (EPS ₹${n1(SC.bear.eps[1] * SH_ADJ)} FY28E); ${MULT.bear}x (25th percentile × factor).`],
    ], source: 'GAM Research (EPS per post-buyback share)' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary (engine, FY26 share count)', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-42E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Add: engine net cash at Mar-27', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
      { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Per post-buyback share', `₹${n0(dcfPost)}`], ['Terminal value share of EV', '{{dcf.tvShare|pct}}'], ['Cost of equity (rf 6.5% + 0.9 × 6%)', '{{dcf.ke|pct}}'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of capital down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'Ke \\ g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Listed pharma peers (trailing, at the 30-Sep-2026 close)', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', 'vs 5-yr median P/E', 'EV/EBITDA (x)', 'ROE'], rows: PEERS.map(p => [p.symbol === 'AUROPHARMA' ? '**Aurobindo**' : shortName(p.symbol) + (EXCL.includes(p.symbol) ? ' (excluded)' : ''), n0(p.mcapCr), n0(p.revenue), p.ebitdaMargin + '%', n1(p.pe), pc(derate[p.symbol]), n1(p.evEbitda), p.roe + '%']), source: `Screener.in, trailing multiples scaled to the NSE close on ${ASOF_TXT}; ROE on FY26 profit (Screener basis)` } },
  ],
};

const mPs = F.sales[1] / 100 * (1 - AS.taxRate[1] / 100) / SH_POST * MULT.base; // ₹ a share per 1pp of FY28E margin
const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: 'Our honest summary: a solid, cheap-looking generics machine that is fairly priced after the rally',
  blocks: [
    { callout: '**What you are buying:** one of the world\'s largest generics suppliers, with its own APIs (now including penicillin starting materials), a US business of ~$1.6bn growing again only through Lannett, a profitable EUR1bn European business, a China plant turning profitable, and options in biosimilars and biologics manufacturing. Founder-controlled, with a professional board, a 7% pledge and recurring FDA problems at its injectable plants.' },
    { callout: `**What you are paying:** ${n1(peFY28)}x our FY28E EPS and ${n1(peSep28)}x Sep-28E, above Aurobindo's ${n1(HA.med)}x forward median since 2021, after a {{P.returns.1y|chg}} one-year rally. On the street's method and our inputs the target is {{dcf.tp|inr}} ({{dcf.upside|chg}}): a ${rating}. The DCF (₹${n0(mv('dcf').value)}) says the cash flows do not support more; the upside needs the US base and Eugia to grow again.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      ['Eugia Unit III (and Unit I) cleared by the FDA', 'Low-medium', 'Re-inspection outcome; new injectable approvals'],
      ['US base grows in dollars ex-Lannett; Lannett synergies early', 'Medium', 'US revenue above $480mn a quarter incl. Lannett by Q4FY27'],
      ['Biosimilars: US filings accepted; omalizumab approved in Europe', 'Medium', 'FDA filing acceptance; EMA timeline'],
      ['Generics tariff enacted with US-made exemption', 'Low-medium', 'US trade action; Lannett utilisation'],
      ['Share price below ~₹' + n0(buyBelow), '–', 'Our buy level on today\'s numbers'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['Import alert at a Eugia site, or new warning letters at oral-solid units', 'Low-medium', 'Loss of existing US sales; bear case {{scen.bear.tp|inr}}'],
      ['US price erosion faster than launches; Lannett slips', 'Medium', 'US stuck near $1.7bn; each $50mn ≈ 2% of EPS'],
      ['Minimum import price on Pen-G not renewed (Jan-2027); Chinese prices fall', 'Medium', 'Pen-G profit shrinks to the PLI subsidy'],
      ['US 100% tariff on imported generics from 2028', 'Low-medium', 'Margin pressure in FY29+; partly offset by US plants'],
      ['Rupee strengthens back to ₹88/$', 'Low', 'FY27E revenue −6%, EPS −10% or more'],
      ['Large debt-funded acquisition (a Zentiva-style bid)', 'Low-medium', 'Leverage and integration risk'],
      ['Sector de-rating reverses (pharma back to its five-year medians)', 'Medium', `At ${SENS.noFactor}x the target would be ~₹${n0(val(SENS.noFactor))}`],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**We would turn buyers below ~₹${n0(buyBelow)}** and sellers above ~₹${n0(sellAbove)} on today's numbers; we would raise the multiple only if Eugia is cleared, and cut it if the US base falls below $380mn a quarter excluding Lannett.`,
      `**Biggest swing factors:** the rupee, US launches and margin. Every 1pp of FY28E margin is ~₹${n0(mPs)} a share at ${MULT.base}x; every ₹1 move in the rupee against the dollar changes FY28E revenue by ~₹${n0((BL.usUsdMn[1] + BL.gmUsdMn[1] + BL.arvUsdMn[1]) / 10)} cr.`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'US revenue, Q1FY27', v: `$${Q1.usUsdMn}mn`, d: '$426mn two years earlier' },
      { k: 'Europe growth, Q1FY27', v: `+${Q1.europeCcGrowthPct}%`, d: 'constant currency; margin >20%' },
      { k: 'Eugia sites under warning letters', v: '2', d: 'Unit III (2024), Unit I (Aug-2026)' },
      { k: 'Forward P/E (FY28E)', v: `${n1(peFY28)}x`, d: `median ${n1(HA.med)}x before one-offs` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

module.exports = { valuation, risks };
