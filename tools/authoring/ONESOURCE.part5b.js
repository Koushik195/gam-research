// OneSource report, part 5b: valuation. EV/EBITDA primary (the street's majority method) with the multiple from OneSource's
// own forward EV/EBITDA since 13-May-2026 x the same-window pharma factor (-1.7%); P/E and DCF cross-checks; CDMO peers.
const X = require('./ONESOURCE.ctx');
const { D, F, V, SC, n0, n1, pc, pc1, ASOF_TXT, FROM_TXT, price, mv, EVM, PEM, EVH, PEH, EVH1, EVH2, EVH2a, PEH2, sEv, sEv2, PEER_SET, CDMO, P, W, ALT_F, SECTOR_EV, SECTOR_PE, sectorEvCalc, sectorPeCalc, kev, k, shortName, ebitdaSep, treasSep, epsSep28, epsAdjSep, evNowFwd, evNowFY27, evTrail, SENS, leaseTp, gNeeded, dcfAt15, SHARES, rating, PEERS, epsU, sep, ndAt, ASOF } = X;
const vs = v => pc(v / V.tp * 100 - 100);
const sortDesc = (arr, key) => [...arr].sort((a, c) => W[key][c].mv - W[key][a].mv);

const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${EVM.base}x Sep-28E EBITDA gives {{dcf.tp|inr}}; the multiple comes from the months after the turnaround, not the ramp-up year`,
  blocks: [
    { h: 'How the street values OneSource' },
    { p: `Three of the four brokers that disclose a method value OneSource on **EV/EBITDA** (ICICI Securities: a sum of the parts at 19x DDC and 16x soft gel and injectables FY28E EBITDA; JM Financial 22x Sep-27E; Investec 23x FY27E); DAM Capital uses 30x FY28E EPS. EV/EBITDA also suits the company: profit after tax is still distorted by ₹138 cr a year of merger amortisation, heavy interest and tax losses, none of which touch EBITDA. We follow the majority: **EV/EBITDA on Sep-28E EBITDA (half FY28E, half FY29E) less Sep-28E net debt**. P/E and a DCF are cross-checks.` },
    { h: `Our target multiple: ${EVM.base}x, and why the window starts on ${FROM_TXT}` },
    { p: `OneSource listed on 24-Jan-2025 and is a turnaround, so it has neither a five-year history nor a clean one. We start its own window **on ${FROM_TXT}, the day the Q4FY26 results were published**: (1) it skips the post-listing months; (2) it is the first result after the Q3FY26 loss, and the quarters since (Q4FY26 PAT ₹4.6 cr, Q1FY27 ₹25 cr) are the first run of profitable quarters as a combined company: the break to sustained profits; (3) throughout the window the next full year is FY28E, the first year with all three cartridge lines, so every point is measured on post-ramp EBITDA. Earlier points mislead: from the FY25 results (5-May-2025) to Mar-2026 the forward year was FY27, a ramp-up year (our FY27E EBITDA is ${n0(F.ebitda[0] / F.ebitda[1] * 100)}% of FY28E), so the stock traded at ${n1(EVH2a.med)}x forward EBITDA while the market was paying for FY28-29 capacity; applying that multiple to Sep-28E EBITDA would count the ramp twice. The trough rule, tested on EBITDA, excludes nothing (FY28E is far above half of FY25's ₹467 cr). On every weekly close plus the ${ASOF_TXT} close (${EVH.n} points), EV = market value + the last published company net debt (excluding leases, like the engine), over our FY28E EBITDA (before exceptional items, so the pre-exceptional and reported medians are the same). We multiply the median by the nine pharma peers' EV/EBITDA move over the **same window** (${pc1(SECTOR_EV)}) and round to the nearest half-turn. The window is short (4.5 months); the alternatives are sensitivity rows below.` },
    { exhibit: { type: 'table', title: 'Deriving the target multiple', head: ['Yardstick', 'Evidence', 'What it implies'], wide: [1, 2], rows: [
      ['1. Its own history', `Forward EV/EBITDA since ${FROM_TXT}: median **${n1(EVH.med)}x** (25th-75th percentile ${n1(EVH.p25)}-${n1(EVH.p75)}x; range ${n1(EVH.min)}-${n1(EVH.max)}x). From 1-Apr-2026 ${n1(EVH1.med)}x; from 5-May-2025 ${n1(EVH2.med)}x (FY27E-forward points ${n1(EVH2a.med)}x). No trough years`, `Starting point: ${n1(EVH.med)}x`],
      ['2. Sector move, same window', `Nine pharma peers' trailing EV/EBITDA at the ${ASOF_TXT} close vs each one's median since ${FROM_TXT} (table below): median **${pc1(SECTOR_EV)}** (our reproduction ${pc1(sectorEvCalc)}); P/E ${pc1(SECTOR_PE)}. Since 5-May-2025 the move is ${pc1(ALT_F.ev2)}`, `${n1(EVH.med)}x × ${kev.toFixed(3)} = ${n1(EVH.med * kev)}x → **${EVM.base}x**`],
      ['3. Growth', `EBITDA ~${Math.round(X.ebitdaCagr)}% a year FY26-29E from a depressed base; street FY28E EBITDA 17-33% above ours`, 'No premium or discount (sensitivities below)'],
      ['4. Peers', `Trailing EV/EBITDA on ${ASOF_TXT}: Gland ${n1(P.GLAND.evEbitda)}x, Divi's ${n1(P.DIVISLAB.evEbitda)}x, Sai Life ${n1(P.SAILIFE.evEbitda)}x, Anthem ${n1(P.ANTHEM.evEbitda)}x; OneSource ${n1(evTrail)}x trailing, ${n1(evNowFwd)}x our FY28E`, `The target implies ${n1((V.tp * SHARES + ndAt(ASOF)) / F.ebitda[1])}x our FY28E EBITDA on today's net debt: below the listed CDMOs' trailing multiples`],
      ['5. Returns', 'ROE negative to FY26 on ₹5,092 cr of merger goodwill and intangibles; {{F.roe.2|pct}} in FY29E vs a 12.8% cost of equity', 'No premium'],
      ['6. Street basis', 'ICICI 16-19x FY28E; JM 22x Sep-27E; Investec 23x FY27E (earlier earnings years)', 'Lower multiple on a later, post-ramp year'],
    ], source: `Screener.in weekly prices to ${ASOF_TXT}; company net debt; GAM estimates; peers' Screener files (asof-peers.js)` } },
    { exhibit: { type: 'table', title: `Pharma sector factor over OneSource's window: trailing multiples at the ${ASOF_TXT} close vs medians since ${FROM_TXT}`, head: ['Company', 'EV/EBITDA (x)', 'Median since 13-May-26 (x)', 'vs median', 'P/E vs median, same window', 'EV/EBITDA vs median since 5-May-25', 'vs five-year median'], rows: [
      ...sortDesc(PEER_SET, 'ev').map(s => [shortName(s), n1(W.ev[s].cur), n1(W.ev[s].med), pc1(W.ev[s].mv), pc1(W.pe[s].mv), pc1(W.ev2[s].mv), pc1(W.ev5[s].mv)]),
      { hl: true, cells: [`**Median of the nine (used: ${pc1(SECTOR_EV)} EV, ${pc1(SECTOR_PE)} P/E)**`, '', '', `**${pc1(sectorEvCalc)}**`, `**${pc1(sectorPeCalc)}**`, pc1(ALT_F.ev2), pc1(ALT_F.ev5)] },
      ['OneSource (own stock, not in the set)', n1(W.ev.ONESOURCE.cur), n1(W.ev.ONESOURCE.med), pc1(W.ev.ONESOURCE.mv), 'n.m. (loss)', pc1(W.ev2.ONESOURCE.mv), '–'],
      ...Object.entries(D.peers.excluded).map(([s, why]) => [shortName(s), '', '', '', '', '', `Excluded: ${why}`]),
    ], source: `Screener.in "EV Multiple" and "Price to Earning" series to ${ASOF_TXT}, scaled to the NSE close (asof-peers.js); node tools/authoring/sector-factor.js --from 2026-05-13 --metric ev|pe; peer set per PLAYBOOK §7c` } },
    { pair: [
      { type: 'line', title: `Forward EV/EBITDA since listing: ${n1(EVH2a.med)}x on FY27E, ${n1(EVH.med)}x on FY28E; target ${EVM.base}x`, unit: 'EV ÷ next full-year EBITDA (x)', x: sEv2.map(x => x[0]), series: [{ name: 'Forward EV/EBITDA', values: sEv2.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', min: 10, max: 40, lines: [{ v: EVH.med, text: `Median since ${FROM_TXT}: ${n1(EVH.med)}x` }, { v: EVM.base, text: `Our target: ${EVM.base}x`, color: '#cf8f1f' }], source: 'Screener.in weekly prices; company net debt; GAM estimates FY27-28E' },
      { type: 'hbar', title: 'Target and cross-checks vs the share price', unit: '₹ per share (base case)', x: ['EV/EBITDA (target)', 'P/E', 'DCF', 'Share price'], series: [{ name: 'Value', values: [Math.round(mv('ev').value), Math.round(mv('pe').value), Math.round(mv('dcf').value), price], fmt: 'inr' }], labels: 'all', highlight: 'EV/EBITDA (target)', source: 'GAM Research' },
    ] },
    { exhibit: { type: 'table', title: 'From multiple to target', head: ['', 'Base', 'Note'], wide: [2], rows: [
      ['Sep-28E EBITDA (₹ cr)', n0(ebitdaSep), 'Half FY28E ({{F.ebitda.1|num}}) + half FY29E ({{F.ebitda.2|num}})'],
      ['× target multiple', `${EVM.base}x`, `Own median ${n1(EVH.med)}x × ${kev.toFixed(3)}`],
      ['= Enterprise value (₹ cr)', n0(EVM.base * ebitdaSep), ''],
      ['− Net debt at Sep-28E (engine, excl. leases)', n0(-treasSep), 'Half Mar-28E + half Mar-29E'],
      ['= Equity value (₹ cr) / per share (₹)', `${n0(EVM.base * ebitdaSep + treasSep)} / ${n0(mv('ev').value)}`, `${n1(SHARES)} cr shares at 30-Sep-2026`],
      { hl: true, cells: ['**12-month target (rounded)**', '**{{dcf.tp|inr}}**', `vs CMP ₹${n0(price)}: {{dcf.upside|chg}} → ${rating}`] },
    ], source: 'GAM Research (checked in ONESOURCE.ctx.js)' } },
    { exhibit: { type: 'table', title: 'Target price and cross-checks', head: ['Method', 'Role', 'Basis', 'Multiple', 'Value / share (₹)', 'vs target', 'Bull (₹)', 'Bear (₹)'], rows: [
      ['**EV/EBITDA**', '**Target**', `Sep-28E EBITDA ₹${n0(ebitdaSep)} cr; net debt ₹${n0(-treasSep)} cr`, `${EVM.base}x (bull ${EVM.bull}x, bear ${EVM.bear}x)`, '**{{dcf.blend.methods.0.value|num}}**', '–', '{{scen.bull.blend.methods.0.value|num}}', '{{scen.bear.blend.methods.0.value|num}}'],
      ['P/E', 'Cross-check', `Sep-28E EPS ₹${n1(epsSep28)} (reported)`, `${PEM.base}x (bull ${PEM.bull}x, bear ${PEM.bear}x)`, '{{dcf.blend.methods.1.value|num}}', pc(mv('pe').vsTarget), '{{scen.bull.blend.methods.1.value|num}}', '{{scen.bear.blend.methods.1.value|num}}'],
      ['DCF', 'Cross-check', 'FCFF, 12.8%, g 5.5%, 15 years', '–', '{{dcf.blend.methods.2.value|num}}', pc(mv('dcf').vsTarget), '{{scen.bull.blend.methods.2.value|num}}', '{{scen.bear.blend.methods.2.value|num}}'],
      { hl: true, cells: ['**12-month target (rounded)**', '', '', '', '**{{dcf.tp|inr}}**', '{{dcf.upside|chg}} vs CMP', '{{scen.bull.tp|inr}}', '{{scen.bear.tp|inr}}'] },
    ], source: 'GAM Research' } },
    { callout: `**What the cross-checks tell us.** P/E: OneSource's forward P/E since ${FROM_TXT} (on FY28E reported EPS, after amortisation) has a median of ${n1(PEH.med)}x; × the peers' P/E move (${pc1(SECTOR_PE)}) that is ${PEM.base}x, worth ₹${n0(mv('pe').value)}, ${Math.abs(Math.round(mv('pe').vsTarget))}% ${mv('pe').vsTarget < 0 ? 'below' : 'above'} the target (on EPS before amortisation, ₹${n1(epsAdjSep)}, it would be ₹${n0(Math.round(PEM.base * epsAdjSep / 10) * 10)}). The DCF (₹${n0(mv('dcf').value)}) is ${Math.abs(Math.round(mv('dcf').vsTarget))}% ${mv('dcf').vsTarget < 0 ? 'below' : 'above'}: at 12.8% the price needs ~${Math.round(gNeeded)}% a year flat growth from FY28 to FY42 (at 15% a year the DCF gives ~₹${n0(Math.round(dcfAt15 / 10) * 10)}). The three methods agree within ~10%: the market is pricing roughly our ramp, and the upside comes from the ramp being delivered.` },
    { exhibit: { type: 'table', title: 'Sensitivity: other ways to value it (not used in the base)', head: ['Alternative', 'Multiple', 'Basis', 'Value (₹)', 'vs base'], wide: [0], rows: [
      ...SENS.slice(1).map(r => [r.name, `${r.mult}x`, r.why, n0(r.tp), vs(r.tp)]),
      ['Leases counted as debt (₹228 cr)', `${EVM.base}x`, `Sep-28E net debt ₹${n0(-X.ndLease)} cr`, n0(leaseTp), vs(leaseTp)],
      ['Prestige claim lost in full (₹1,286 cr)', `${EVM.base}x`, 'Deducted from equity', n0(Math.round((mv('ev').value - 1286.22 / SHARES) / 10) * 10), vs(mv('ev').value - 1286.22 / SHARES)],
    ], source: 'GAM Research' } },
  ],
};

module.exports = { valuation };
