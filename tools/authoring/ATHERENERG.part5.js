// Ather Energy report, part 5: the street and the valuation (EV/Sales on Sep-28E revenue; EV/EBITDA on FY29E
// and DCF cross-checks; scenarios; peers). Recently listed: 12-month window for the forward-multiple median.
const X = require('./ATHERENERG.ctx');
const { D, F, n0, n1, pc, rup, price, shares, mv, EVS, EVSH1, EVSH2, sector12, sector12All, sector5, sectorTW, k, k5, kTW, dr12, dr5, P, PEERS, USED, EXCL, TW, shortName,
  MULT, ALT, peerEv, evMULT, salesSep, rating, ST, medTp, shortDate, ASOF_TXT, evNow, evSep, evTtm, ttmSales, FM, medStreetMult, atMult, impliedMult, netCashPF, evSalesOf } = X;
const drTxt = s => `${shortName(s)} ${pc(dr12[s])}`;

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street: all Buy, targets ₹1,398-2,200 (median ₹${n0(medTp)}), all on EV/Sales`,
  blocks: [
    { p: `Eight houses published targets between the Q1FY27 results (3-Aug-2026) and our as-of date: Emkay Buy ₹2,200, Axis Capital ₹2,100, Nomura Buy ₹1,926, CLSA Accumulate ₹1,850, JPMorgan Overweight ₹1,850, Nirmal Bang Buy ₹1,538, HSBC Buy ₹1,450 and Ambit ₹1,398: median ₹${n0(medTp)}, ${pc((medTp / price - 1) * 100)} vs the ${ASOF_TXT} close of ₹${n0(price)}. A 4-Aug roundup counted 13 Buys and no Sells. ${rup(D.street.methodsNote)} The bulls' case is a structural EV upcycle, Konarc doubling the addressable market, AURIC removing the supply cap and 15-20% long-run margins. The stock rose from ₹1,260 (31-Jul) to ₹1,656 (11-Sep) as targets were raised, then fell 14% into the as-of date.` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who'], wide: [0], rows: D.critiques.map(r => r.map(rup)), source: 'Broker notes, news and call transcripts to 30-Sep-2026' } },
  ],
};

const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${MULT.base}x Sep-28E revenue gives {{dcf.tp|inr}}; the stock trades at ${n1(evSep)}x`,
  blocks: [
    { h: 'How the street values Ather' },
    { p: `Ather has no earnings to put a P/E on: FY26 EPS was −₹13.5 and we forecast −₹${n1(-F.eps[0])} in FY27E. The house P/E routine (forward P/E median since listing, leaving out loss years) is meaningless here: FY27 is a loss year, and the only "valid" points are Apr-Sep 2026 on our FY28E EPS of ₹${n1(F.eps[1])}, a median of ~${Math.round(FM.median)}x. So, like every broker, we use **EV/Sales on the revenue the market will look at in September 2027 (Sep-28E: half FY28E, half FY29E)**, plus net cash.` },
    { exhibit: { type: 'table', title: 'How the street values the stock', head: ['Broker', 'Rating', 'Target (₹)', 'Method', 'Multiple', 'On', 'EV/Sales implied on our Sep-28E', 'Thesis'], wide: [7], rows: [
      ...ST.map(s => [`${s.broker} (${shortDate(s.date)})`, s.rating, n0(s.tp), s.method, s.multiple || '–', s.on || '–', `${n1(impliedMult(s.tp))}x`, rup(s.thesis)]),
      { hl: true, cells: ['**GAM Research**', `**${rating}**`, '**{{dcf.tp|num}}**', '**EV/Sales**', `**${MULT.base}x**`, '**Sep-28E**', `**${MULT.base}x**`, 'A good business priced for the bull case; capacity and competition still to be proven'] },
    ], source: 'Business Today (4-Aug, 31-Aug, 10-Sep-2026), Outlook Business (4-Aug-2026). "Implied" = (target × 40.41 cr shares − our Sep-28E net cash) ÷ our Sep-28E revenue. Axis\'s 31-Aug note: date of the roundup.' } },
    { h: `Our target multiple: ${MULT.base}x, and why` },
    { p: `Ather listed on 6-May-2025, so it has under 18 months of history. Under our rule for recently listed stocks we use its one-year-forward EV/Sales over the last 12 months (Oct-2025 to Sep-2026), which skips the post-listing months, and adjust it by how far auto peers trade below their own medians over the same 12 months, so the two windows match.` },
    { exhibit: { type: 'table', title: 'Deriving the multiple (house rule, PLAYBOOK §4 and §7c)', head: ['Yardstick', 'Evidence', 'What it implies'], wide: [1], rows: [
      ['1. Own history (12 months)', `Forward EV/Sales on every weekly close, 1-Oct-2025 to ${ASOF_TXT} (${EVS.n} points): median ${n1(EVS.med)}x (25th-75th percentile ${n1(EVS.p25)}-${n1(EVS.p75)}x; range ${n1(EVS.min)}-${n1(EVS.max)}x). Oct-25 to Mar-26 on FY27E revenue: ${n1(EVSH2)}x; Apr-26 to Sep-26 on FY28E: ${n1(EVSH1)}x. EV = price × shares − net cash, stepping up with the Jul/Aug-2026 raise`, `Starting point ${n1(EVS.med)}x`],
      ['2. P/E history (shown)', `Loss in FY27E: every point before Apr-2026 is a trough year; Apr-Sep 2026 on FY28E EPS ₹${n1(F.eps[1])}: median ~${Math.round(FM.median)}x`, 'Not usable'],
      ['3. Sector move (same window)', `Auto-OEM peers' trailing P/E on ${ASOF_TXT} vs their own 12-month medians: ${USED.map(drTxt).join(', ')}; median ${pc(sector12)}. Excluded as distorted: ${EXCL.map(s => `${shortName(s)} (${pc(dr12[s])})`).join(', ')}; with them ${pc(sector12All)}. EV peers are too few for their own set: Ola Electric is loss-making with no P/E history`, `× ${k.toFixed(3)}`],
      ['4. Result (nearest half-turn)', `${n1(EVS.med)}x × ${k.toFixed(3)} = ${n1(EVS.med * k)}x`, `**${MULT.base}x**`],
      ['5. Bull / bear', `Bull: no sector move (${n1(EVS.med)}x). Bear: 25th percentile, de-rated (${n1(EVS.p25)}x × ${k.toFixed(3)})`, `${MULT.bull}x / ${MULT.bear}x`],
    ], source: `Screener.in prices to ${ASOF_TXT}; GAM estimates for FY27-28E revenue in the forward series; peers' P/E from their Screener files` } },
    { pair: [
      { type: 'line', title: 'Forward EV/Sales: ~3-4.5x for a year, 6.6x in September', unit: 'EV ÷ next full-year revenue (x)', x: X.evs.map(x => x[0]), series: [{ name: 'Forward EV/Sales', values: X.evs.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', lines: [{ v: MULT.base, text: `Our multiple: ${MULT.base}x`, color: '#cf8f1f' }], source: 'Screener.in prices; GAM estimates; the step down in April is the roll from FY27E to FY28E revenue' },
      { type: 'hbar', title: 'Target and cross-checks vs the share price', unit: '₹ per share (base case)', x: ['EV/Sales (target)', 'EV/EBITDA FY29E', 'DCF', 'Street median target', 'Share price'], series: [{ name: 'Value', values: [Math.round(mv('evs').value), Math.round(mv('ev').value), Math.round(mv('dcf').value), medTp, price], fmt: 'inr' }], labels: 'all', highlight: 'EV/Sales (target)', source: 'GAM Research' },
    ] },
    { exhibit: { type: 'table', title: 'Target price and cross-checks', head: ['Method', 'Role', 'Basis', 'Multiple', 'Value / share (₹)', 'vs target', 'Bull (₹)', 'Bear (₹)'], rows: [
      ['**EV/Sales**', '**Target**', `Sep-28E revenue ₹${n0(salesSep.base)} cr + net cash`, `${MULT.base}x (bull ${MULT.bull}x, bear ${MULT.bear}x)`, '**{{dcf.blend.methods.0.value|num}}**', '–', '{{scen.bull.blend.methods.0.value|num}}', '{{scen.bear.blend.methods.0.value|num}}'],
      ['EV/EBITDA', 'Cross-check', `FY29E EBITDA ₹${n0(F.ebitda[2])} cr + net cash`, `${evMULT.base}x (peers' median)`, '{{dcf.blend.methods.1.value|num}}', pc(mv('ev').vsTarget), '{{scen.bull.blend.methods.1.value|num}}', '{{scen.bear.blend.methods.1.value|num}}'],
      ['DCF', 'Cross-check', 'FCFF FY28-42E, Ke {{dcf.ke|n1}}%, g 6%', '–', '{{dcf.blend.methods.2.value|num}}', pc(mv('dcf').vsTarget), '{{scen.bull.blend.methods.2.value|num}}', '{{scen.bear.blend.methods.2.value|num}}'],
      { hl: true, cells: ['**12-month target (rounded)**', '', '', '', '**{{dcf.tp|inr}}**', '{{dcf.upside|chg}} vs CMP', '{{scen.bull.tp|inr}}', '{{scen.bear.tp|inr}}'] },
    ], source: 'GAM Research' } },
    { callout: `**What the cross-checks tell us.** Both sit far below the target, which is itself below the price. Valued like a profitable auto maker (${evMULT.base}x EV/EBITDA, the auto peers' median on ${ASOF_TXT}) on FY29E EBITDA, Ather is worth ₹${n0(mv('ev').value)}; the DCF, which already assumes revenue compounding to ~₹33,000 cr by FY35 and a 12% margin, gives ₹${n0(mv('dcf').value)}. The market price needs margins well above 12% or growth well beyond our FY29E for longer. At ₹${n0(price)} the stock trades on ${n1(evNow)}x FY28E and ${n1(evTtm)}x trailing revenue (₹${n0(ttmSales)} cr to Jun-2026).` },
    { exhibit: { type: 'table', title: 'Views we did not put in the base (sensitivity rows only)', head: ['View', 'What it changes', 'Value / share (₹)'], wide: [0, 1], rows: [
      ['Two-wheeler peers only for the sector move', `${TW.map(drTxt).join(', ')}: median ${pc(sectorTW)}; ${n1(EVS.med)}x × ${kTW.toFixed(3)} = ${ALT.tw}x`, n0(atMult(ALT.tw))],
      ['Only Apr-Sep 2026 (all on FY28E revenue)', `${n1(EVSH1)}x × ${k.toFixed(3)} = ${ALT.h1}x`, n0(atMult(ALT.h1))],
      ['Five-year sector move instead of 12-month', `${n1(EVS.med)}x × ${k5.toFixed(3)} (peers vs five-year medians ${pc(sector5)}) = ${ALT.five}x`, n0(atMult(ALT.five))],
      ['No sector move (bull multiple)', `${MULT.bull}x on base revenue`, n0(atMult(MULT.bull))],
      ['Street median multiple', `~${medStreetMult}x (Emkay 7x, Nomura 5.5x) on our Sep-28E revenue`, n0(atMult(medStreetMult))],
      ['Growth premium', 'Revenue CAGR ~47% FY26-29E vs the 12-month window\'s expectations', 'not applied'],
    ], source: 'GAM Research. Per PLAYBOOK §7c, growth views are shown, not added to the base multiple.' } },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Multiple ${MULT.bull}x (no sector move).`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Volume +{{as.volume.growth.0|n1}}% / +{{as.volume.growth.1|n1}}% / +{{as.volume.growth.2|n1}}%; EBITDA margin {{F.ebitdaMargin.0|pct}} → {{F.ebitdaMargin.2|pct}}; ${MULT.base}x Sep-28E revenue.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Multiple ${MULT.bear}x (25th percentile, de-rated).`],
    ], source: 'GAM Research' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-42E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Add: net cash at Mar-27 (pro forma)', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
      { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of capital down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Listed auto peers', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', 'vs 12-month median', 'EV/EBITDA (x)', '≈ EV/Sales (x)', 'ROE'], rows: PEERS.map(p => [p.symbol === 'ATHERENERG' ? '**Ather Energy**' : shortName(p.symbol) + (EXCL.includes(p.symbol) ? ' (excluded)' : p.symbol === 'OLAELEC' ? ' (not in set)' : ''), n0(p.symbol === 'ATHERENERG' ? price * shares : p.mcapCr), n0(p.revenue), p.ebitdaMargin + '%', p.pe ? n1(p.pe) : 'loss', dr12[p.symbol] != null ? pc(dr12[p.symbol]) : '–', p.evEbitda > 0 ? n1(p.evEbitda) : 'neg.', evSalesOf(p) ? n1(evSalesOf(p)) : p.symbol === 'ATHERENERG' ? n1(evTtm) + ' (TTM)' : '–', p.roe != null ? p.roe + '%' : '–']), source: `Screener.in, trailing multiples at the NSE close on ${ASOF_TXT}. EV/Sales ≈ EV/EBITDA × FY26 EBITDA margin. Ather's market value on 40.41 cr fully diluted shares.` } },
  ],
};

module.exports = { street, valuation };
