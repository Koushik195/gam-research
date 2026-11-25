// Physicswallah report, part 5: the street and the valuation (EV/EBITDA on Sep-28E EBITDA, as the street does; multiple
// derived from the stock's own one-year-forward EV/EBITDA since 1-Jan-2026; the two-peer internet sector move, P/E and DCF
// are cross-checks or sensitivities; scenarios; peers).
const X = require('./PWL.ctx');
const { D, F, V, SC, n0, n1, n2, pc, pc1, price, shares, sep, EVX, EVL, EVA, EVD, PEX, MULT, peMULT, ALT, NET, DR_SET, EV_ALL, P, evW, peW, ev5, sectorEv, sectorPe, sectorEvAll, sectorEv5,
  shortName, kEv, treas0, pickTreas, treasGross, leasesNow, preSep, segPre, streetSotp, preMultAt, rating, ST, cur, medTp, medPost, nBuy, ASOF_TXT, LISTED, FROM, evNow, evSepNow, peSepNow, mvk, buyBelow, sellAbove, monthMed } = X;
const sd = d => { if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return d; const [y, m, dd] = d.split('-'); return `${+dd}-${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+m - 1]}-${y.slice(2)}`; };
const ebSep = sep(F.ebitda), ebSc = k => SC[k].blend.methods.find(m => m.key === 'ev').metric;
const at = m => n0((m * ebSep + pickTreas) / shares);
const tpPre = preMultAt(V.tp);
const headline = `Initiate at ${rating}: the online franchise is worth the price; offline is the swing factor`;

const coverArguments = [
  { h: 'A low-cost online machine', p: `~4.9 million paying students at ~₹4,100 a year, a free YouTube funnel (ads 9% of revenue) and ~27% margins after rent. Online grew 39% in FY26 and 33% in Q1FY27 despite the NEET re-exam.` },
  { h: 'Offline is the swing factor', p: 'The network doubled to 366 centres in 15 months and still lost ~10% of revenue after rent in FY26. Mature centres earn 13-15%; management guides break-even in FY27, we assume FY29E.' },
  { h: `Valuation: ${MULT.base}x Sep-28E EBITDA`, p: `The stock's own forward EV/EBITDA has a median of ${n1(EVX.med)}x since January; it trades at ${n1(evNow)}x our FY28E EBITDA. Internet platforms de-rated ${pc1(X.sectorEvAll)} over the same months, so we apply ${MULT.base}x to Sep-28E EBITDA: {{dcf.tp|inr}}; the DCF (₹${n0(mvk('dcf').value)}) is lower.` },
  { h: 'What could go wrong', p: 'Free AI tutors, exam disruptions, a slower offline turnaround and acquisitive capital allocation. Founders own 71%; the float is thin.' },
];

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street: ${nBuy} of ${cur.length} brokers positive; median target ₹${n0(medTp)}, mostly on EV/EBITDA by channel`,
  blocks: [
    { p: `Coverage started after the IPO quiet period (Goldman Sachs Neutral ₹135 on 24-Dec-2025; Axis Capital Add ₹138 in Jan-2026) and widened through 2026 (JM Financial, JPMorgan, HSBC, DAM Capital, Motilal Oswal, BofA). On ${ASOF_TXT} the latest targets of these eight brokers had a median of ₹${n0(medTp)} (${pc((medTp / price - 1) * 100)} vs the ₹${n2(price)} close); the four notes after the Q1FY27 results have a median of ₹${n0(medPost)}. LSEG counted nine analysts with an average Buy and a median target of ₹144 (22-Sep-2026). The range is wide: Motilal Oswal ₹200 (50x online EBITDA) to BofA ₹110 (Underperform: "valuations ahead of fundamentals"). Where the method is disclosed it is EV/EBITDA on FY28E or Jun-28E: by channel (online 30-50x, offline 10-15x) or for the group (HSBC 35x).` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who', 'Our view'], wide: [0, 2], rows: [
      ['Offline unit economics are unproven and loss-making centres dilute a great online business', 'BofA, Goldman Sachs', 'Agree it is the key risk; our forecasts put break-even a year after guidance'],
      ['The stock rallied 55% in six months to September; valuation ran ahead of earnings', 'BofA', `Partly: at ₹${n2(price)} it trades at ${n1(evNow)}x FY28E EBITDA, at its own one-year-forward median; it is not cheap on P/E (${n1(peSepNow)}x)`],
      ['Capital allocation (lending, schools, acquisitions with put options)', 'JM Financial (before Q1), investors', 'FinZ exit helps; the ₹5,600 cr treasury is still the biggest discretionary lever'],
      ['Test-prep demand could slow (fewer students, exam reforms, AI)', 'BofA', 'Long-term risk; online share gains offset it for now'],
    ], source: 'Broker reports as cited in deep.json; GAM Research' } },
  ],
};

const sens = [
  ['Natural set only: Info Edge and IndiaMART (five-year usable history)', `EV/EBITDA ${DR_SET.map(s => `${shortName(s)} ${pc1(evW[s])}`).join(', ')}: median ${pc1(sectorEv)} → ${ALT.sector}x`, at(ALT.sector)],
  ['No sector move (bull multiple)', `Own median ${n1(EVX.med)}x unadjusted → ${ALT.noMove}x`, at(ALT.noMove)],
  ['75th-percentile own multiple with the sector move', `${n1(EVX.p75)}x × ${kEv.toFixed(3)} → ${ALT.p75}x`, at(ALT.p75)],
  ['Five-year move of the two peers (not the same window)', `${pc1(sectorEv5)} → ${ALT.sector5}x`, at(ALT.sector5)],
  ['Window from listing (incl. IPO weeks)', `Own median ${n1(EVL.med)}x × ${kEv.toFixed(3)} → ${ALT.listed}x`, at(ALT.listed)],
  ['Window from 1-Dec-2025', `Own median ${n1(EVD.med)}x × ${kEv.toFixed(3)} → ${ALT.fromDec}x`, at(ALT.fromDec)],
  ['Only months valued on FY28E (Apr-Sep 2026)', `Own median ${n1(EVA.med)}x × ${kEv.toFixed(3)} → ${ALT.fy28only}x`, at(ALT.fy28only)],
  ['JM Financial\'s channel multiples on our numbers', `32x online + 15x offline Sep-28E pre-IndAS EBITDA plus gross treasury`, n0(streetSotp(32, 15))],
  ['JPMorgan\'s channel multiples on our numbers', '30x online + 10x offline', n0(streetSotp(30, 10))],
  ['Motilal Oswal\'s channel multiples on our numbers', '50x online + 15x offline', n0(streetSotp(50, 15))],
  ['Minorities and the put-option liability deducted', `JM estimates ~₹35 cr a year of profit to minorities (~₹${n0(35 * 35 / shares)}/share at ~35x P/E); other financial liabilities ₹463 cr (~₹${n0(463 / shares)}/share)`, `~${n0(V.tp - 35 * 35 / shares - 463 / shares)}`],
];

const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${MULT.base}x Sep-28E EBITDA gives {{dcf.tp|inr}}; the market pays ${n1(evNow)}x FY28E`,
  blocks: [
    { h: 'How the street values PW' },
    { p: `The street values PW on EV/EBITDA 1.5-2 years forward, mostly channel by channel (JM 32x online / 15x offline on Jun-28E; JPMorgan 30x / 10x; Motilal 50x / 15x on FY28E) and once for the group (HSBC 35x FY28E adjusted EBITDA). P/E is not used: profit is small and mostly interest on the IPO cash. We use EV/EBITDA on the same horizon (Sep-28E: half FY28E, half FY29E) for the group, on EBITDA after ESOP and before rent, with lease liabilities (₹${n0(leasesNow)} cr at Mar-2026) counted as debt, the basis on which the stock's own short history can be measured. On the street's basis (EBITDA after rent, before ESOP, gross treasury) our target equals **${n1(tpPre)}x** Sep-28E pre-IndAS EBITDA of ₹${n0(preSep)} cr.` },
    { exhibit: { type: 'table', title: 'How the street values the stock (latest note per broker standing on 30-Sep-2026)', head: ['Broker', 'Rating', 'Target (₹)', 'Method', 'Basis', 'Thesis'], wide: [5], rows: [
      ...ST.map(s => [`${s.broker} (${sd(s.date)})${s.preQ1 ? ' – before Q1FY27' : ''}`, s.rating, n0(s.tp), s.methodShort, s.basis, s.thesis]),
      { hl: true, cells: ['**GAM Research**', `**${rating}**`, '**{{dcf.tp|num}}**', `**EV/EBITDA ${MULT.base}x (≈${n1(tpPre)}x after rent)**`, '**Sep-28E**', 'Online franchise priced fairly at its own median; offline turnaround a year behind guidance'] },
    ], source: 'Broker notes and dated press reports listed in deep.json; only notes published on or before 30-Sep-2026.' } },
    { h: `Our target multiple: ${MULT.base}x, and why` },
    { exhibit: { type: 'table', title: 'Deriving the multiple (PLAYBOOK §4 and §7c; recently listed)', head: ['Yardstick', 'Evidence', 'What it implies'], wide: [1], rows: [
      ['1. Window', `Listed ${sd(LISTED)}: 10.4 months of history, so no 12-month window exists. We skip the listing weeks and December, when the stock traded at an IPO premium (median ₹${n0(monthMed('2025-11'))} in Nov and ₹${n0(monthMed('2025-12'))} in Dec vs ₹${n0(monthMed('2026-06'))} in Jun-26) and before research coverage began (24-Dec-2025), and use 1-Jan to 30-Sep-2026 on every daily close (${EVX.n} points): nine months, as for Meesho`, 'Window: 1-Jan-2026 to 30-Sep-2026'],
      ['2. Own forward EV/EBITDA (used)', `EV (price × ${n1(shares)} cr shares less ₹${n0(treas0)} cr treasury net of leases at Mar-2026) ÷ next full-year EBITDA (FY27E to Mar-2026, FY28E from Apr-2026; ours): median ${n1(EVX.med)}x, 25th-75th percentile ${n1(EVX.p25)}-${n1(EVX.p75)}x, range ${n1(EVX.min)}-${n1(EVX.max)}x. No trough years: forward EBITDA is positive throughout`, `**Starting point: ${n1(EVX.med)}x**`],
      ['3. One-offs', 'Exceptional items (IPO costs, impairments, the Sarrthi fair-value charge) sit outside our forecast EBITDA', 'No adjustment'],
      ['4. Sector move (same window)', `No listed Indian test-prep peer of size exists. The natural internet set with a usable five-year history (${DR_SET.map(shortName).join(' and ')}, as in our Eternal report) has only two names, so we widen it to the group the brokers place PW in (India internet): every platform with positive EBITDA through the window. EV/EBITDA on ${ASOF_TXT} vs each name's own median since 1-Jan-2026: ${EV_ALL.map(s => `${shortName(s)} ${pc1(evW[s])}`).join(', ')}; median ${pc1(sectorEvAll)} (P/E basis ${pc1(X.sectorPeAll)}). Swiggy excluded (negative EBITDA); PW itself not used. The two-name subset (${pc1(sectorEv)}) is a sensitivity`, `× ${kEv.toFixed(3)}`],
      ['5. Growth vs the street', `Our Sep-28E EBITDA (₹${n0(ebSep)} cr after ESOP) is 5-9% below JM Financial's; channel multiples of 30-50x online assume ~30% growth and margins we also forecast`, 'No adjustment (§7c); see sensitivity'],
      ['6. Peers', `Internet peers trade at ${NET.filter(s => P[s]?.evEbitda > 0).map(s => `${shortName(s)} ${n1(P[s].evEbitda)}x`).join(', ')} trailing EV/EBITDA; PW ${n1(P.PWL?.evEbitda)}x trailing`, 'PW sits between the profitable classifieds (Info Edge, IndiaMART) and the scaling platforms'],
      ['7. Returns', `FY27E ROE ~{{F.roe.0|n1}}% on a cash-rich balance sheet; returns on the online business are very high, on offline low`, 'Consistent with a growth multiple, not a reason to add one'],
      ['8. Result (nearest half-turn)', `${n1(EVX.med)}x × ${kEv.toFixed(3)} = ${n1(EVX.med * kEv)}x`, `**${MULT.base}x Sep-28E EBITDA of ₹${n0(ebSep)} cr**`],
      ['9. Bull / bear', `Bull: own median with no sector move (${n1(EVX.med)}x). Bear: 25th percentile with the move (${n1(EVX.p25)}x × ${kEv.toFixed(3)})`, `${MULT.bull}x / ${MULT.bear}x`],
    ], source: `Screener.in daily prices to ${ASOF_TXT}; GAM estimates for FY27-28E EBITDA; peers' Screener EV/EBITDA series` } },
    { pair: [
      { type: 'line', title: `Forward EV/EBITDA since listing: ${n1(EVX.med)}x median since January; ${n1(evNow)}x FY28E now`, unit: 'EV ÷ next full-year EBITDA (x)', x: X.fwdEv.map(x => x[0]), series: [{ name: 'Forward EV/EBITDA', values: X.fwdEv.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', maxTicks: 6, lines: [{ v: MULT.base, text: `Our multiple: ${MULT.base}x`, color: '#cf8f1f' }], source: 'Screener.in daily prices; GAM FY27-28E EBITDA (step in Apr-2026: switch from FY27E to FY28E). Nov-Dec 2025 shown, not used.' },
      { type: 'hbar', title: 'Target and cross-checks vs the share price', unit: '₹ per share (base case)', x: ['EV/EBITDA (target)', 'P/E', 'DCF', 'Street median', 'Share price'], series: [{ name: 'Value', values: [Math.round(mvk('ev').value), Math.round(mvk('pe').value), Math.round(mvk('dcf').value), Math.round(medTp), Math.round(price)], fmt: 'inr' }], labels: 'all', highlight: 'EV/EBITDA (target)', source: 'GAM Research' },
    ] },
    { exhibit: { type: 'table', title: 'Target price and cross-checks', head: ['Method', 'Role', 'Basis', 'Multiple', 'Value / share (₹)', 'vs target', 'Bull (₹)', 'Bear (₹)'], rows: [
      ['**EV/EBITDA**', '**Target**', `Sep-28E EBITDA ₹${n0(ebSep)} cr plus net treasury after leases`, `${MULT.base}x (bull ${MULT.bull}x, bear ${MULT.bear}x)`, '**{{dcf.blend.methods.0.value|n1}}**', '–', '{{scen.bull.blend.methods.0.value|n1}}', '{{scen.bear.blend.methods.0.value|n1}}'],
      ['P/E', 'Cross-check', `Sep-28E EPS ₹${n2(sep(F.eps))}`, `${peMULT.base}x (bull ${peMULT.bull}x, bear ${peMULT.bear}x)`, '{{dcf.blend.methods.1.value|n1}}', pc(mvk('pe').vsTarget), '{{scen.bull.blend.methods.1.value|n1}}', '{{scen.bear.blend.methods.1.value|n1}}'],
      ['DCF', 'Cross-check', 'FCFF FY28-42E (lease principal as capex), Ke {{dcf.ke|n1}}%, g 6%', '–', '{{dcf.blend.methods.2.value|n1}}', pc(mvk('dcf').vsTarget), '{{scen.bull.blend.methods.2.value|n1}}', '{{scen.bear.blend.methods.2.value|n1}}'],
      { hl: true, cells: ['**12-month target (rounded)**', '', '', '', '**{{dcf.tp|inr}}**', '{{dcf.upside|chg}} vs CMP', '{{scen.bull.tp|inr}}', '{{scen.bear.tp|inr}}'] },
    ], source: 'GAM Research' } },
    { callout: `**What the cross-checks tell us.** P/E (${peMULT.base}x Sep-28E EPS: PW's forward median since January × the same peers' P/E move) gives ₹${n0(mvk('pe').value)}, close to the target, but most of the near-term EPS is interest income. The DCF gives ₹${n0(mvk('dcf').value)}: at a ${n1(V.ke)}% cost of equity, 6% terminal growth and EBITDA rising to 24% of revenue, cash flows support roughly today's price, not much more. **So the upside rests on the market paying close to its own multiple while EBITDA grows ~60% over two years; if offline stalls, both the EBITDA and the multiple fall (bear {{scen.bear.tp|inr}}).** Rating rule: BUY below ₹${buyBelow}, SELL above ₹${sellAbove} on our target.` },
    { exhibit: { type: 'table', title: 'Views we did not put in the base (sensitivity rows only)', head: ['View', 'What it changes', 'Value / share (₹)'], wide: [0, 1], rows: sens, source: 'GAM Research. Per PLAYBOOK §7c, sub-windows, peer sub-sets, no move, street multiples and minority deductions are shown, not added to the base.' } },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} ${MULT.bull}x Sep-28E EBITDA of ₹${n0(ebSc('bull'))} cr.`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Revenue {{F.sales.0|num}} / {{F.sales.1|num}} / {{F.sales.2|num}} cr; EBITDA margin {{F.ebitdaMargin.0|pct}} → {{F.ebitdaMargin.2|pct}}; ${MULT.base}x Sep-28E EBITDA of ₹${n0(ebSep)} cr.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} ${MULT.bear}x on ₹${n0(ebSc('bear'))} cr.`],
    ], source: 'GAM Research' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-42E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Net treasury after lease liabilities at Mar-27', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|n1}}'],
      { hl: true, cells: ['**12-month DCF value (rolled forward 6 months at Ke)**', '**₹{{dcf.blend.methods.2.value|n1}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ], source: 'GAM Research. Bank debt is negligible and leases are deducted as debt, so the cost of equity is the discount rate.' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of equity down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'Ke / g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Internet-platform peers (no listed test-prep peer of size)', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', 'EV/EBITDA (x)', 'EV/EBITDA vs median since Jan-26', 'P/E vs median since Jan-26', 'EV/EBITDA vs five-year median'], rows: ['PWL', ...NET].filter(s => P[s]).map(s => { const p = P[s]; return [s === 'PWL' ? '**Physicswallah**' : shortName(s) + (DR_SET.includes(s) ? ' (usable history)' : ''), n0(p.mcapCr), p.revenue ? n0(p.revenue) : '–', p.ebitdaMargin != null ? p.ebitdaMargin + '%' : '–', p.pe != null ? n1(p.pe) : '–', p.evEbitda != null ? n1(p.evEbitda) : '–', evW[s] != null ? pc(evW[s]) : '–', peW[s] != null ? pc(peW[s]) : '–', ev5[s] != null ? pc(ev5[s]) : '–']; }), source: `Screener.in, trailing multiples at the NSE close on ${ASOF_TXT}. ${D.peers.education}` } },
  ],
};

module.exports = { headline, coverArguments, rating, street, valuation };
