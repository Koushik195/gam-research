// Hyundai Motor India report, part 5: the street and the valuation (P/E on Sep-28E EPS; EV/EBITDA and DCF
// cross-checks; scenarios; peers). Recently listed: 12-month window for the forward-multiple median.
const X = require('./HYUNDAI.ctx');
const { D, F, V, n0, n1, pc, rup, price, mv, PEL, PE12, PE6, PEH2, sector12, sector12All, sector5, k, k5, dr12, dr5, P, PEERS, USED, EXCL, MED12, MED5, shortName,
  MULT, ALT, epsSep, evMed, evP25, evMULT, ttmEbitda, ebitdaSep28, rest, rating, ST, medTp, shortDate, ASOF_TXT, fwdNow, trailPe, medStreetMult } = X;
const r10 = v => Math.round(v / 10) * 10;
const drTxt = s => `${shortName(s)} ${pc(dr12[s])}`;
const at = m => n0(r10(m * epsSep.base));

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street: mostly Buy, targets ₹2,069-2,520, all on 24-30x FY28E P/E`,
  blocks: [
    { p: `Seven houses published after the Q1FY27 results (30-Jul to 3-Sep-2026): ICICI Securities Buy ₹2,520, Nuvama Buy ₹2,500, Morgan Stanley Overweight ₹2,438, Motilal Oswal Buy ₹2,334, BOB Caps Buy ₹2,327, JM Financial Add ₹2,130 and Nirmal Bang Hold ₹2,069: median ₹${n0(medTp)}, ~${Math.round((medTp / price - 1) * 100)}% above the ${ASOF_TXT} close of ₹${n0(price)}. Nomura kept Buy (Aug-2026; target not in our source). Every house that discloses a method uses **P/E on FY28E or Jun-28E EPS: 24-30x (median ${medStreetMult}x)**. Most raised targets after Q1 because the launches are now dated; the bulls lean on Bayon, the EV, Pune and exports; the cautious (Nirmal Bang, JM) on exports and margin volatility.` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who'], wide: [0], rows: D.critiques.map(r => r.map(rup)), source: 'Broker notes, news and call transcripts to 30-Sep-2026' } },
  ],
};

const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${MULT.base}x Sep-28E EPS gives {{dcf.tp|inr}}; the stock already trades at ~${Math.round(fwdNow)}x FY28E`,
  blocks: [
    { h: 'How the street values Hyundai' },
    { p: 'We use the street\'s method so our target is comparable: P/E on the earnings the market will look at in September 2027 (Sep-28E: half FY28E, half FY29E). The "At our EPS" column applies each broker\'s multiple to our Sep-28E EPS: the gap to the street is mostly earnings, not the multiple.' },
    { exhibit: { type: 'table', title: 'How the street values the stock', head: ['Broker', 'Rating', 'Target (₹)', 'Method', 'Multiple', 'On', 'At our EPS (₹)', 'Thesis'], wide: [7], rows: [
      ...ST.map(s => [`${s.broker} (${shortDate(s.date)})`, s.rating, n0(s.tp), s.method, rup(s.multiple || '–'), s.on || '–', parseFloat(s.multiple) > 0 ? at(parseFloat(s.multiple)) : '–', rup(s.thesis)]),
      { hl: true, cells: ['**GAM Research**', `**${rating}**`, '**{{dcf.tp|num}}**', '**P/E**', `**${MULT.base}x**`, '**Sep-28E**', '**{{dcf.tp|num}}**', 'Recovery is priced in; share loss and the parent\'s take cap the multiple'] },
    ], source: 'ICICI Direct, JM, Nirmal Bang and BOB Caps notes (PDFs); MOSL via DSIJ; Nuvama via Business Today (31-Jul-2026); Morgan Stanley via Finwire/Placera (3-Sep-2026). Nuvama adds ~₹100 a share of cash to its multiple.' } },
    { h: `Our target multiple: ${MULT.base}x, and why` },
    { p: `Hyundai listed on 22-Oct-2024, so it has under two years of history. Under our rule for recently listed stocks we use its one-year-forward P/E over the last 12 months (Oct-2025 to Sep-2026), skipping the first year after listing, and adjust it by how far auto peers trade below their own medians over the same 12 months, so the two windows match.` },
    { exhibit: { type: 'table', title: 'Deriving the multiple (house rule, PLAYBOOK §4 and §7c)', head: ['Yardstick', 'Evidence', 'What it implies'], wide: [1], rows: [
      ['1. Own history (12 months)', `Forward P/E on every weekly close, 1-Oct-2025 to ${ASOF_TXT}: median ${n1(PE12.med)}x (25th-75th percentile ${n1(PE12.p25)}-${n1(PE12.p75)}x). Oct-25 to Mar-26 on FY27E EPS: ${n1(PEH2.med)}x; Apr-26 to Sep-26 on FY28E: ${n1(PE6.med)}x. No trough years (FY27E EPS is above half the FY24 peak)`, `Starting point ${n1(PE12.med)}x`],
      ['2. Since listing (shown)', `Median ${n1(PEL.med)}x over all ${PEL.n} weeks since 22-Oct-2024`, 'Similar; not used (first year skipped)'],
      ['3. Sector move (same window)', `Auto-OEM peers' trailing P/E on ${ASOF_TXT} vs their own 12-month medians: ${USED.map(drTxt).join(', ')}; median ${pc(sector12)}. Excluded as distorted: ${EXCL.map(s => `${shortName(s)} (${pc(dr12[s])})`).join(', ')}; with them ${pc(sector12All)}. Hyundai itself and Tata Motors PV (listed Oct-2025, one-off gains) not used`, `× ${k.toFixed(3)}`],
      ['4. Result (nearest half-turn)', `${n1(PE12.med)}x × ${k.toFixed(3)} = ${n1(PE12.med * k)}x`, `**${MULT.base}x**`],
      ['5. Bull / bear', `Bull: no sector move (${n1(PE12.med)}x). Bear: 25th percentile, de-rated (${n1(PE12.p25)}x × ${k.toFixed(3)})`, `${MULT.bull}x / ${MULT.bear}x`],
    ], source: `Screener.in prices and P/E to ${ASOF_TXT}; GAM estimates for FY27-28E EPS in the forward series` } },
    { pair: [
      { type: 'line', title: 'Forward P/E since listing (every weekly close)', unit: 'Price ÷ next full-year EPS (x)', x: X.fwdPe.map(x => x[0]), series: [{ name: 'Forward P/E', values: X.fwdPe.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: MULT.base, text: `Our multiple: ${MULT.base}x`, color: '#cf8f1f' }], source: 'Screener.in prices; actual EPS to FY26, GAM estimates FY27-28E' },
      { type: 'hbar', title: 'Target and cross-checks vs the share price', unit: '₹ per share (base case)', x: ['P/E (target)', 'EV/EBITDA', 'DCF', 'Street median target', 'Share price'], series: [{ name: 'Value', values: [Math.round(mv('pe').value), Math.round(mv('ev').value), Math.round(mv('dcf').value), medTp, price], fmt: 'inr' }], labels: 'all', highlight: 'P/E (target)', source: 'GAM Research' },
    ] },
    { exhibit: { type: 'table', title: 'Target price and cross-checks', head: ['Method', 'Role', 'Basis', 'Multiple', 'Value / share (₹)', 'vs target', 'Bull (₹)', 'Bear (₹)'], rows: [
      ['**P/E**', '**Target**', `Sep-28E EPS ₹${n1(epsSep.base)}`, `${MULT.base}x (bull ${MULT.bull}x, bear ${MULT.bear}x)`, '**{{dcf.blend.methods.0.value|num}}**', '–', '{{scen.bull.blend.methods.0.value|num}}', '{{scen.bear.blend.methods.0.value|num}}'],
      ['EV/EBITDA', 'Cross-check', `Sep-28E EBITDA ₹${n0(ebitdaSep28)} cr + net cash`, `${evMULT.base}x (bull ${evMULT.bull}x, bear ${evMULT.bear}x)`, '{{dcf.blend.methods.1.value|num}}', pc(mv('ev').vsTarget), '{{scen.bull.blend.methods.1.value|num}}', '{{scen.bear.blend.methods.1.value|num}}'],
      ['DCF', 'Cross-check', 'FCFF FY28-42E, Ke {{dcf.ke|n1}}%, g 5.5%', '–', '{{dcf.blend.methods.2.value|num}}', pc(mv('dcf').vsTarget), '{{scen.bull.blend.methods.2.value|num}}', '{{scen.bear.blend.methods.2.value|num}}'],
      { hl: true, cells: ['**12-month target (rounded)**', '', '', '', '**{{dcf.tp|inr}}**', '{{dcf.upside|chg}} vs CMP', '{{scen.bull.tp|inr}}', '{{scen.bear.tp|inr}}'] },
    ], source: 'GAM Research' } },
    { callout: `**What the cross-checks tell us.** Both sit below the target. EV/EBITDA: Hyundai's median trailing EV/EBITDA over the same 12 months was ${n1(evMed)}x; de-rated by ${Math.abs(sector12).toFixed(1)}% and restated to Sep-28E EBITDA (₹${n0(ebitdaSep28)} cr vs ₹${n0(ttmEbitda)} cr in the year to Jun-26, ratio ${rest.toFixed(2)}) it is ${evMULT.base}x, worth ₹${n0(mv('ev').value)}. The DCF gives ₹${n0(mv('dcf').value)}: capex of ₹7,500-8,500 cr a year keeps free cash flow thin for three years. Our P/E target assumes the market keeps paying for a recovery in earnings; the cash-flow methods say there is little margin of safety if it does not.` },
    { exhibit: { type: 'table', title: 'Views we did not put in the base (sensitivity rows only)', head: ['View', 'What it changes', 'Value / share (₹)'], wide: [0, 1], rows: [
      ['Since-listing median with the five-year sector move', `${n1(PEL.med)}x × ${k5.toFixed(3)} (peers vs five-year medians: ${pc(sector5)}) = ${ALT.listing5}x`, at(ALT.listing5)],
      ['Only the last six months (all on FY28E EPS)', `${n1(PE6.med)}x × ${k.toFixed(3)} = ${ALT.six}x`, at(ALT.six)],
      ['No sector move (bull multiple)', `${MULT.bull}x on base earnings`, at(MULT.bull)],
      ['Street median multiple', `${medStreetMult}x on our EPS`, at(medStreetMult)],
      ['Street EPS at our multiple', `${MULT.base}x on consensus FY28E ₹${D.street.consensus.FY28E} (FY28E basis)`, n0(r10(MULT.base * D.street.consensus.FY28E))],
      ['Growth premium', `EPS CAGR ~${Math.round(X.epsCagrFwd)}% FY26-29E from a depressed FY27 base`, 'not applied'],
      ['Returns premium', 'ROE ~24-25% vs Ke 11.9%, but similar through the window that set the median', 'not applied'],
    ], source: 'GAM Research. Per PLAYBOOK §7c, growth and returns views are shown, not added to the base multiple.' } },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Multiple ${MULT.bull}x (no sector move).`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Volume +{{as.volume.growth.0|n1}}% / +{{as.volume.growth.1|n1}}% / +{{as.volume.growth.2|n1}}%; EBITDA margin {{F.ebitdaMargin.0|pct}} → {{F.ebitdaMargin.2|pct}}; ${MULT.base}x Sep-28E.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Multiple ${MULT.bear}x (25th percentile, de-rated).`],
    ], source: 'GAM Research' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-42E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Add: net cash at Mar-27', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
      { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of capital down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Listed auto peers', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', 'vs 12-month median', 'vs 5-yr median', 'EV/EBITDA (x)', 'ROE'], rows: PEERS.map(p => [p.symbol === 'HYUNDAI' ? '**Hyundai Motor India**' : shortName(p.symbol) + (EXCL.includes(p.symbol) ? ' (excluded)' : p.symbol === 'TMPV' ? ' (not in set)' : ''), n0(p.mcapCr), n0(p.revenue), p.ebitdaMargin + '%', n1(p.pe), dr12[p.symbol] != null ? pc(dr12[p.symbol]) : '–', dr5[p.symbol] != null ? pc(dr5[p.symbol]) : '–', n1(p.evEbitda), p.roe + '%']), source: `Screener.in, trailing multiples at the NSE close on ${ASOF_TXT}. M&M and TVS Motor on Screener's standalone basis. Hyundai's trailing P/E is on depressed TTM EPS (₹${n1(X.trailEps)}; ${n1(trailPe)}x on the as-of close).` } },
  ],
};

module.exports = { street, valuation };
