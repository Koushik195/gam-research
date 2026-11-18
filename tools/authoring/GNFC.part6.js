// GNFC report, part B-6: valuation (street table, multiple derivation with trough years left out,
// forward P/E and EV/EBITDA history, the cash question, cross-checks, scenarios, DCF, peers).
const X = require('./GNFC.ctx');
const { streetBlocks } = require('./valuation-blend');
const { F, V, AS, SC, A, n0, n1, pc, price, sh, mcap, mv, epsSep28, peMult, evMult, ebitdaSep28, FM, peByFy, exPeak, fwdNow, fwdPreWar, evAll, evMed, evMedAll, evTroughYears, evByFy, evNow,
  PEER_SYMS, PEERS, MED5, drPe, drEv, PE_PEERS, EV_PEERS, sectorDrPe, sectorDrEv, derivedPe, derivedEv, shortName, ST, rating, ASOF_TXT, treasury26, tps, opsEps28, impliedOpsPe, tpOpsPe, b, shortDate } = X;

const treasSep27 = (F.treasury[0] + F.treasury[1]) / 2;
const opsPat28 = opsEps28 * sh;
const evChart = evAll.filter((_, i) => i % 2 === 0);
const peerTxt = (arr, fn) => arr.map(s => `${shortName(s)} ${pc(fn(s))}`).join(', ');
const PM = AS.valuation.blend.methods[0].multiple, EM = AS.valuation.blend.methods[1].multiple;

const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${peMult}x Sep-28E earnings gives {{dcf.tp|inr}}`,
  blocks: [
    ...streetBlocks('GNFC', {
      rating,
      streetIntro: 'Brokers have valued GNFC on **P/E** of one- to two-year-forward EPS, with no separate value for the cash (HDFC Securities, Aug-2022: 6.5x FY24E). The two 2026 calls we can see (JM Financial and ICICI Securities, both Neutral) do not disclose a method. We use P/E on Sep-28E EPS (half FY28E, half FY29E), the earnings the market will look at in September 2027.',
      street: ST.map(s => [`${s.broker} (${shortDate(s.date)})`, s.rating, s.tp, s.method, s.multiple || '–', /FY24/.test(s.multiple || '') ? 'FY24E' : '–', s.note]),
      ourThesis: 'War-time earnings fade; chemicals revert to mid-cycle; cash is not free',
      streetSource: 'JM Financial and ICICI Securities via Univest (updated 11-Jun-2026; notes not found, unverified); HDFC Securities stock note (1-Aug-2022, PDF)',
      derivationIntro: 'House rule: start from the stock\'s own one-year-forward P/E since April 2021, leave out trough years, adjust for how far comparable stocks had de-rated by 30-Sep-2026, then check growth, peers, returns and what the multiple says about the cash.',
      derivation: [
        ['1. Its own history', `Median ${n1(FM.median)}x since Apr-2021 after leaving out the trough years ${FM.troughYears.join(' and ')} (forward EPS below half the prior three-year peak, when the P/E ballooned to 15-25x); ${n1(FM.medianAll)}x on all dates. By forward year: ${Object.entries(peByFy).map(([k, v]) => `${k} ${n1(v)}x`).join(', ')}. The FY23 boom year pulls the median down; without it, ${n1(exPeak)}x. ${n1(fwdNow)}x at the ${ASOF_TXT} close on our FY28E`, `Starting point: ${n1(FM.median)}x`],
        ['2. Sector de-rating', `On ${ASOF_TXT}, trailing P/E vs five-year median: ${peerTxt(PE_PEERS, drPe)} (median ${pc(sectorDrPe)}); Tata Chemicals and Gujarat Alkalies left out (P/E of 61x and 69x on collapsed earnings). EV/EBITDA basis, seven peers: median ${pc(sectorDrEv)}. GNFC itself ${pc(drPe('GNFC'))}`, `${n1(FM.median)}x × ${(1 + sectorDrPe / 100).toFixed(2)} = ${n1(derivedPe)}x → **${peMult}x**`],
        ['3. Growth', `Sep-28E EPS ₹${n1(epsSep28)} vs FY26 ₹${n1(A.eps[b])}: no growth over 2.5 years; FY26-29E EPS CAGR ~${Math.round((Math.pow(F.eps[2] / A.eps[b], 1 / 3) - 1) * 100)}%`, 'No premium'],
        ['4. Peers', `Trailing P/E: Chambal ${n1(PEERS.CHAMBLFERT.pe)}x, GSFC ${n1(PEERS.GSFC.pe)}x, GHCL ${n1(PEERS.GHCL.pe)}x, DCM Shriram ${n1(PEERS.DCMSHRIRAM.pe)}x, Deepak Fertilisers ${n1(PEERS.DEEPAKFERT.pe)}x; GNFC ${n1(PEERS.GNFC.pe)}x on war-boosted TTM EPS`, `${peMult}x Sep-28E = ${n1(peMult * epsSep28 / F.eps[1])}x our FY28E: in line with Chambal, GSFC and GHCL`],
        ['5. Returns', `ROE {{F.roe.0|pct}} / {{F.roe.1|pct}} / {{F.roe.2|pct}} in FY27-29E vs a ${n1(V.ke)}% cost of equity`, `No premium; ${peMult}x implies ~${n1(V.tp / F.bvps[0])}x FY27E book`],
        ['6. The cash', `Treasury ₹${n0(tps(treasury26))} a share at Mar-26 (~₹${n0(tps(treasSep27))} by Sep-27 after capex). At ₹${n0(price)} the market pays ${n1(impliedOpsPe)}x Sep-28E operating EPS (₹${n1(opsEps28)}, excluding treasury income); at our target ${n1(tpOpsPe)}x`, 'The target keeps the deep discount the market has applied to GNFC\'s cash: at the Mar-2026 low the operations were valued at ~₹180 cr'],
      ],
      derivationSource: `Screener.in (prices, EPS, peer multiples to ${ASOF_TXT}), AR FY26, GAM Research`,
      history: { field: 'eps', from: '2016-04-01', median: Math.round(FM.median), label: `Median since 2021 (ex-trough): ${n1(FM.median)}x`, title: `One-year-forward P/E: our ${peMult}x vs history`, yearStep: 2, min: 0 },
      crossNote: `**What the cross-checks tell us.** EV/EBITDA (${evMult}x Sep-28E EBITDA of ₹${n0(ebitdaSep28)} cr plus the Sep-28E treasury) gives ₹${n0(mv('ev').value)}, ${Math.round(mv('ev').vsTarget)}% above the P/E target: ${evMult}x is GNFC's own ${n1(evMed)}x median forward EV/EBITDA since 2021 leaving out ${evTroughYears.join(', ')} (${n1(evMedAll)}x on all dates), cut by the ${pc(sectorDrEv)} peer de-rating. That the market has paid only ~2-4x EBITDA for the operations once cash is netted off is the clearest sign of how little it trusts the use of that cash. The DCF (₹${n0(mv('dcf').value)}) is more than double the target: it counts the ₹${n0(F.treasury[0])} cr treasury at full value and assumes a 12% EBITDA margin and 5-13% revenue growth for fifteen years. The DCF is the value if the cash were returned and margins held at the long-run median; the P/E is what the market has actually paid. We side with the market's history, and show the gap.`,
    }),
    { h: 'The cash question: what the price pays for the operations' },
    { exhibit: { type: 'table', title: 'Market value less treasury (₹ crore)', head: ['', 'Mar-2026 low (31-Mar)', 'Price on 30-Sep-26', 'GAM target'], rows: [
      ['Market value', '5,385', n0(mcap), n0(V.tp * sh)],
      ['Less: treasury at Mar-26 (model basis)', n0(treasury26), n0(treasury26), n0(treasury26)],
      { hl: true, cells: ['**= Value put on the operations**', `**${n0(5385 - treasury26)}**`, `**${n0(mcap - treasury26)}**`, `**${n0(V.tp * sh - treasury26)}**`] },
      ['… as a multiple of Sep-28E EBITDA (₹' + n0(ebitdaSep28) + ' cr)', `${n1((5385 - treasury26) / ebitdaSep28)}x`, `${n1((mcap - treasury26) / ebitdaSep28)}x`, `${n1((V.tp * sh - treasury26) / ebitdaSep28)}x`],
      ['… of Sep-28E operating profit after tax (₹' + n0(opsPat28) + ' cr)', `${n1((5385 - treasury26) / opsPat28)}x`, `${n1((mcap - treasury26) / opsPat28)}x`, `${n1((V.tp * sh - treasury26) / opsPat28)}x`],
    ], source: 'Company Q4FY26 deck (Mar-26 market value); AR FY26; GAM Research' } },
    { pair: [
      { type: 'line', title: 'Forward EV/EBITDA: the market rarely paid more than 4x', unit: 'EV ÷ next full-year EBITDA (x)', x: evChart.map(x => x[0]), series: [{ name: 'Forward EV/EBITDA', values: evChart.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: evMed, text: `Median ex-trough: ${n1(evMed)}x` }, { v: evMedAll, text: `All dates: ${n1(evMedAll)}x`, color: '#cf8f1f' }], source: 'Screener.in; EV = market value + borrowings − cash − investments − ICDs; GAM estimates for FY27-28E' },
      { type: 'hbar', title: 'Peers vs their five-year medians (P/E)', unit: 'Trailing P/E at 30-Sep-2026 vs five-year median (%)', x: ['GNFC', ...PE_PEERS.map(shortName)], series: [{ name: 'vs median', values: ['GNFC', ...PE_PEERS].map(s => Math.round(drPe(s))), fmt: 'num' }], labels: 'all', highlight: 'GNFC', source: 'Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs price', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} EPS ₹{{scen.bull.eps.1|n1}} (FY28E) / ₹{{scen.bull.eps.2|n1}} (FY29E).`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Chemicals EBIT margin 19.5% / 16% / 17% (FY27-29E), fertiliser loss 5% → 4% of revenue, treasury yield 6%; ${peMult}x Sep-28E EPS of ₹${n1(epsSep28)}.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} EPS ₹{{scen.bear.eps.1|n1}} / ₹{{scen.bear.eps.2|n1}}. In practice the treasury (~₹${n0(tps(treasSep27))} a share by Sep-27) would act as a soft floor: the stock's Mar-2026 low (₹365) was close to its treasury per share.`],
    ], source: 'GAM Research' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-42E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Add: treasury at Mar-27E (cash, deposits, ICDs, G-secs, equity stakes, net of debt)', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
      { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ], source: 'GAM Research; cost of equity 13.1% (no debt), terminal growth 5%, EBITDA margin fading to 12%' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): discount rate down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'Ke \\ g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Listed peers', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', '5-yr median P/E', 'EV/EBITDA (x)', '5-yr median EV/EBITDA', 'ROE'], rows: PEER_SYMS.map(s => [s === 'GNFC' ? '**GNFC**' : shortName(s), n0(PEERS[s].mcapCr), n0(PEERS[s].revenue), PEERS[s].ebitdaMargin + '%', PEERS[s].pe > 0 && PEERS[s].pe < 50 ? n1(PEERS[s].pe) : 'n.m.', n1(MED5[s].pe), n1(PEERS[s].evEbitda), n1(MED5[s].ev), PEERS[s].roe + '%']), source: `Screener.in, trailing multiples at the NSE close on ${ASOF_TXT}; GNFC's Screener EV excludes the ICDs from cash` } },
  ],
};

module.exports = { valuation };
