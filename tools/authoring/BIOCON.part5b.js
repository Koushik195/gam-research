// Biocon report, part 5b: valuation. Sum of the parts (biosimilars and generics on EV/EBITDA; Syngene and Bicara at market
// less 20%; less biopharma net debt at Sep-28E) carried as an implied P/E; consolidated EV/EBITDA and DCF cross-checks;
// sensitivities; scenarios; DCF detail; peers.
const X = require('./BIOCON.ctx2');
const { F, V, A, AS, SC, n0, n1, pc, rup, half, price, SHARES, ST, withTp, medTp, shortDate, ASOF_TXT, rating, ruleText, buyBelow, sellAbove, mv, SOTP, MBS, MGEN, HBS, HBS_BYFY, LOOK, SENS, AUD, kev, k, SECTOR_EV, SECTOR_DR,
  sectorEvCalc, sectorDrCalc, sectorEvAll, sectorDrAll, NINE, P, MED5, MED5EV, derate, derateEv, shortName, PEERS, EVH, EVM, ttmChart, ebitdaSep28, FM, PEADJ, BICARA, SYN_MV, DISC, dcfLessMi, SY, mAt, peNowSep } = X;
const r10 = v => Math.round(v / 10) * 10;
const S0 = SOTP.base, pv = (c, key) => SOTP[c].parts.find(p => p.key === key).value;
const valAt = ({ mbs = MBS.base, mgen = MGEN.base, synDisc = DISC } = {}) => r10((mbs * S0.bsEb + mgen * S0.genEb - S0.nd + SYN_MV * (1 - synDisc) + BICARA.valueCr * (1 - DISC)) / SHARES);
const ps = v => n0(v / SHARES);

const sotpRows = ['bs', 'gen', 'nd', 'syn', 'bic'].map(key => { const p = S0.parts.find(x => x.key === key); return [p.name, rup(p.method), n0(p.value), n1(p.value / SHARES), n1(pv('bull', key) / SHARES), n1(pv('bear', key) / SHARES)]; });
const drEvRow = s => [shortName(s), n1(P[s].evEbitda), n1(MED5EV[s]), pc(derateEv[s]), n1(P[s].pe), n1(MED5[s]), pc(derate[s])];
const sens = [
  ['Syngene at full market value (in the history and in the SOTP)', `Biosimilars median ${n1(SENS.synFull)}x → ${half(SENS.synFull * kev)}x; Syngene part +₹${ps(SYN_MV * DISC)}`, n0(valAt({ mbs: half(SENS.synFull * kev), synDisc: 0 }))],
  ['BBL minorities ignored in the history (consolidated EBITDA, no pro rata)', `Biosimilars median ${n1(SENS.noMinority)}x → ${half(SENS.noMinority * kev)}x`, n0(valAt({ mbs: half(SENS.noMinority * kev) }))],
  ['Generics stripped at 10x (MOSL) instead of 8.9x in the history', `Biosimilars median ${n1(SENS.gen10)}x → ${half(SENS.gen10 * kev)}x`, n0(valAt({ mbs: half(SENS.gen10 * kev) }))],
  ['Street multiples (MOSL: biosimilars 22x, generics 10x, Syngene less 15%)', '22x / 10x / 15%', n0(valAt({ mbs: 22, mgen: 10, synDisc: 0.15 }))],
  ['No sector factor (own history only)', `${half(HBS.med)}x / ${half(AUD.med)}x`, n0(valAt({ mbs: half(HBS.med), mgen: half(AUD.med) }))],
  ['Own re-rating: today\'s look-through multiple instead of the median', `${n1(HBS.now)}x vs ${n1(HBS.med)}x median (PLAYBOOK §7c: not blended)`, n0(valAt({ mbs: half(HBS.now * kev) }))],
  ['House P/E rule: forward median on reported EPS × the P/E factor', `${n1(FM.median)}x (trough years ${FM.troughYears.join(', ')} excluded; distorted by FY24-25 one-off gains) × ${k.toFixed(3)} = ${half(FM.median * k)}x Sep-28E EPS ₹${n1(S0.eps)}`, n0(r10(half(FM.median * k) * S0.eps))],
  ['P/E on EPS before one-offs', `Median ~${Math.round(PEADJ.med)}x since Apr-2022 (range ${Math.round(PEADJ.min)}-${Math.round(PEADJ.max)}x): not meaningful`, 'n.m.'],
  ['Growth premium', `EBITDA CAGR FY26-29E ${n1((Math.pow(F.ebitda[2] / A.ebitda[A.labels.length - 1], 1 / 3) - 1) * 100)}% vs ~10% FY24-26: no premium added (§7c)`, 'not applied'],
];

const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: a sum of the parts gives {{dcf.tp|inr}}; biosimilars at ${MBS.base}x forward EBITDA carry the case`,
  blocks: [
    { h: 'How the street values Biocon' },
    { p: 'Every broker that discloses a method values Biocon as a sum of the parts: biosimilars and generics on EV/EBITDA, Syngene at its market value less a holding discount (MOSL 15%), sometimes Bicara. We do the same on Sep-28E EBITDA (half FY28E, half FY29E), deduct biopharma net debt at the same date and carry the result into the model as an implied P/E. Since BBL became wholly owned on 29-Jun-2026 there are no minorities left in the parts we value at 100%; Syngene\'s minorities are not deducted because we value only Biocon\'s 52.4%.' },
    { exhibit: { type: 'table', title: 'How the street values the stock (latest note per broker found by 30-Sep-2026)', head: ['Broker', 'Rating', 'Target (₹)', 'Method', 'Multiples', 'Thesis'], wide: [5], rows: [
      ...ST.map(s => [`${s.broker} (${shortDate(s.date)})`, s.rating, s.tp ? n0(s.tp) : '–', s.method, rup(s.multiple), rup(s.thesis)]),
      { hl: true, cells: ['**GAM Research**', `**${rating}**`, '**{{dcf.tp|num}}**', '**SOTP**', `**Biosimilars ${MBS.base}x, generics ${MGEN.base}x Sep-28E EV/EBITDA; Syngene, Bicara at market −20%**`, 'The structure is fixed and debt is falling; value rests on biosimilars holding a ~20x forward multiple'] },
    ], source: 'MOSL PDF (6-Aug-2026); Axis Securities via DSIJ (19-Sep-2026); BofA and Bernstein via investing.com; Nuvama and JM Financial via Business Standard (Nov-2025); ICICI Direct PDF; Geojit and ICICI Securities via Trendlyne; Citi via Muthoot Securities. n.d. = not disclosed' } },
    { h: `Sum of the parts: {{dcf.tp|inr}} a share` },
    { exhibit: { type: 'table', title: 'Sum of the parts at Sep-28E (₹ crore; ₹ a share)', head: ['Part', 'Method', 'Value (₹ cr)', 'Per share (₹)', 'Bull (₹)', 'Bear (₹)'], wide: [1], rows: [
      ...sotpRows,
      { hl: true, cells: ['**Equity value**', `**162.97 cr shares**`, `**${n0(S0.total)}**`, `**${n1(S0.perShare)}**`, `**${n1(SOTP.bull.perShare)}**`, `**${n1(SOTP.bear.perShare)}**`] },
      ['Implied P/E on Sep-28E EPS (carried into the model)', `EPS ₹${n1(S0.eps)} (bull ₹${n1(SOTP.bull.eps)}, bear ₹${n1(SOTP.bear.eps)})`, '', `${n1(S0.implied)}x`, `${n1(SOTP.bull.implied)}x`, `${n1(SOTP.bear.implied)}x`],
      { hl: true, cells: ['**12-month target (rounded)**', '', '', '**{{dcf.tp|inr}}**', '**{{scen.bull.tp|inr}}**', '**{{scen.bear.tp|inr}}**'] },
    ], source: `GAM Research. Biopharma net debt = group net debt on our path (incl. working capital the engine misses) + Syngene's net cash (valued inside its market price) + the Bicara stake's book value (valued separately). Syngene ₹${SY.price} x 40.3 cr shares x 52.4%; Bicara 5,523,897 shares x $${BICARA.px} x ₹${BICARA.fx}/$` } },
    { h: 'Deriving the multiples' },
    { p: `**Biosimilars: Biocon's own history, looked through.** BBL is not listed, but Biocon's share price has priced it every day. We strip out what else the market cap contains and divide by next year's biosimilars EBITDA: (Biocon's market value − 80% of its Syngene stake at market + net debt outside Syngene − generics at Aurobindo's forward multiple − FY25's one-time lenalidomide EBITDA) ÷ biosimilars EBITDA incl. corporate costs. Until January 2026 ~23-24% of BBL belonged to minorities, so both net debt and EBITDA are taken at Biocon's economic share (1 − m). The window starts in FY24 (1-Apr-2023): before the Viatris deal closed (Nov-2022) and Biocon sold down Syngene (70% to 55%), the share price valued a different company. On ${HBS.n} weekly points the median is **${n1(HBS.med)}x** (25th-75th percentile ${n1(HBS.p25)}-${n1(HBS.p75)}x; FY24 ${n1(HBS_BYFY.FY24)}x, FY25 ${n1(HBS_BYFY.FY25)}x, FY26 ${n1(HBS_BYFY.FY26)}x, FY27 to date ${n1(HBS_BYFY.FY27)}x) and **${n1(HBS.now)}x on ${ASOF_TXT}**. × the pharma EV/EBITDA factor (+${SECTOR_EV}%) = ${n1(HBS.med * kev)}x → **${MBS.base}x** (bull ${MBS.bull}x, bear ${MBS.bear}x from the 75th/25th percentiles). The street uses 20-22x.` },
    { p: `**Generics: a stated peer basis.** Biocon's generics have no listed history of their own. The closest listed Indian peer is Aurobindo Pharma (vertically integrated API + US/EU formulations, low-to-mid margins). Its one-year-forward EV/EBITDA since Apr-2021 (EV = price × shares + latest published net debt; EBITDA = next full year, actuals then our published AUROPHARMA forecasts) has a median of **${n1(AUD.med)}x** (${n1(AUD.p25)}-${n1(AUD.p75)}x; ${n1(AUD.now)}x on ${ASOF_TXT}). × ${kev.toFixed(4)} = ${n1(AUD.med * kev)}x → **${MGEN.base}x** (bull ${MGEN.bull}x, bear ${MGEN.bear}x). MOSL uses 10x, Nuvama 9x.` },
    { exhibit: { type: 'table', title: 'Deriving the multiples (PLAYBOOK §4 and §7c)', head: ['Yardstick', 'Evidence', 'What it implies'], wide: [1], rows: [
      ['1. Biosimilars: own look-through history', `Forward EV/EBITDA, Apr-2023 to ${ASOF_TXT}, ${HBS.n} weekly points: median ${n1(HBS.med)}x (${n1(HBS.p25)}-${n1(HBS.p75)}x); no trough years (EBITDA rose every year)`, `**Starting point ${n1(HBS.med)}x**`],
      ['2. Generics: stated peer (Aurobindo)', `Forward EV/EBITDA since Apr-2021: median ${n1(AUD.med)}x (${n1(AUD.p25)}-${n1(AUD.p75)}x)`, `**Starting point ${n1(AUD.med)}x**`],
      ['3. Sector factor (EV/EBITDA analogue)', `Nine-name pharma set, trailing EV/EBITDA on ${ASOF_TXT} vs five-year medians: median +${sectorEvCalc.toFixed(2)}% (P/E version +${sectorDrCalc.toFixed(2)}%, settled +${SECTOR_DR}% for Biocon, which is outside the set). Pharma trades above its history, so the factor is a re-rating`, `× ${kev.toFixed(4)}`],
      ['4. Results (nearest half-turn)', `${n1(HBS.med)}x × ${kev.toFixed(4)} = ${n1(HBS.med * kev)}x; ${n1(AUD.med)}x × ${kev.toFixed(4)} = ${n1(AUD.med * kev)}x`, `**Biosimilars ${MBS.base}x; generics ${MGEN.base}x**`],
      ['5. Listed stakes', `Syngene ₹${n0(SYN_MV)} cr and Bicara ₹${n0(BICARA.valueCr)} cr at the 30-Sep close, less 20% (BAJAJ-AUTO / M&M / HEROMOTOCO precedent; MOSL uses 15%)`, `₹${n0(SYN_MV * 0.8 + BICARA.valueCr * 0.8)} cr`],
      ['6. Start-up losses', 'None to value: novel-biologics R&D sits inside the segments (no separate segment since FY25); Bicara is a listed fair-value investment whose losses are in its share price', 'No PV-of-losses part'],
      ['7. Minorities', 'BBL wholly owned from 29-Jun-2026; Syngene valued at Biocon\'s share only', 'No deduction'],
      ['8. Growth, returns, own de-rating', `EBITDA ~${n1((Math.pow(F.ebitda[2] / A.ebitda[A.labels.length - 1], 1 / 3) - 1) * 100)}% a year FY26-29E; ROCE ~4-6%; today's look-through ${n1(HBS.now)}x vs median ${n1(HBS.med)}x: shown as sensitivity rows only (§7c)`, 'No adjustment'],
    ], source: `Screener.in prices, balance sheets and EV/EBITDA series to ${ASOF_TXT}; AR FY25/FY26 notes 39-40; GAM estimates for forward EBITDA` } },
    { exhibit: { type: 'table', title: `Pharma sector factors: trailing multiples on ${ASOF_TXT} vs five-year medians (Sep-2021 to Sep-2026)`, head: ['Company', 'EV/EBITDA now (x)', 'Five-year median (x)', 'vs median', 'P/E now (x)', 'Five-year median (x)', 'vs median'], rows: [
      ...NINE.map(drEvRow),
      { hl: true, cells: ['**Median of the nine (factor)**', '', '', `**${pc(sectorEvCalc)}**`, '', '', `**${pc(sectorDrCalc)}**`] },
      ['Median of all 14 names except Biocon', '', '', pc(sectorEvAll), '', '', pc(sectorDrAll)],
      ['Biocon (not used)', n1(P.BIOCON.evEbitda), n1(MED5EV.BIOCON), pc(derateEv.BIOCON), n1(P.BIOCON.pe), n1(MED5.BIOCON), pc(derate.BIOCON)],
    ], source: 'Screener.in EV/EBITDA and P/E series and NSE closes on 30-Sep-2026 (asof-peers.js); set per PLAYBOOK §7c (Lupin, Glenmark, Biocon, Laurus, Dr Reddy\'s, Mankind excluded)' } },
    { pair: [
      { type: 'line', title: `Biosimilars look-through forward EV/EBITDA: median ${n1(HBS.med)}x since FY24`, unit: 'EV ÷ next full-year biosimilars EBITDA (x)', x: LOOK.map(r => r.d), series: [{ name: 'Look-through', values: LOOK.map(r => Math.round(r.mult * 10) / 10), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, min: 10, lines: [{ v: Math.round(HBS.med * 10) / 10, text: `Median ${n1(HBS.med)}x` }, { v: MBS.base, text: `Our multiple: ${MBS.base}x`, color: '#cf8f1f' }], source: 'GAM Research from Screener.in (Biocon and Syngene prices, balance sheets), AR segment data, GAM forecasts for FY27-28E EBITDA' },
      { type: 'hbar', title: 'Target and cross-checks vs the share price', unit: '₹ per share (base case)', x: ['SOTP (target)', 'EV/EBITDA (consolidated)', 'DCF', 'DCF less Syngene minorities', 'Street median target', 'Share price'], series: [{ name: 'Value', values: [Math.round(mv('pe').value), Math.round(mv('ev').value), Math.round(mv('dcf').value), Math.round(dcfLessMi), medTp, price], fmt: 'inr' }], labels: 'all', highlight: 'SOTP (target)', source: 'GAM Research' },
    ] },
    { exhibit: { type: 'table', title: 'Target price and cross-checks', head: ['Method', 'Role', 'Basis', 'Multiple', 'Value / share (₹)', 'vs target', 'Bull (₹)', 'Bear (₹)'], rows: [
      ['**Sum of the parts (implied P/E)**', '**Target**', `Sep-28E EPS ₹${n1(S0.eps)}`, `${n1(S0.implied)}x implied (bull ${n1(SOTP.bull.implied)}x, bear ${n1(SOTP.bear.implied)}x)`, '**{{dcf.blend.methods.0.value|num}}**', '–', '{{scen.bull.blend.methods.0.value|num}}', '{{scen.bear.blend.methods.0.value|num}}'],
      ['EV/EBITDA (consolidated)', 'Cross-check', `Sep-28E EBITDA ₹${n0(ebitdaSep28)} cr less net debt (model)`, `${EVM.base}x (bull ${EVM.bull}x, bear ${EVM.bear}x)`, '{{dcf.blend.methods.1.value|num}}', pc(mv('ev').vsTarget), '{{scen.bull.blend.methods.1.value|num}}', '{{scen.bear.blend.methods.1.value|num}}'],
      ['DCF', 'Cross-check', `FCFF FY28-42E at {{dcf.ke|n1}}% (= WACC), g ${AS.dcf.terminalGrowth}%`, '–', '{{dcf.blend.methods.2.value|num}}', pc(mv('dcf').vsTarget), '{{scen.bull.blend.methods.2.value|num}}', '{{scen.bear.blend.methods.2.value|num}}'],
      ['DCF less Syngene minorities at market', 'Memo', `47.6% x ₹${n0(SY.price * SY.shares)} cr`, '–', n0(dcfLessMi), pc((dcfLessMi / mv('pe').value - 1) * 100), '–', '–'],
      { hl: true, cells: ['**12-month target (rounded)**', '', '', '', '**{{dcf.tp|inr}}**', '{{dcf.upside|chg}} vs CMP', '{{scen.bull.tp|inr}}', '{{scen.bear.tp|inr}}'] },
    ], source: 'GAM Research (engine methods; the DCF and EV/EBITDA cross-checks count 100% of Syngene\'s EBITDA)' } },
    { callout: `**What the cross-checks tell us.** Both sit below the target. Consolidated EV/EBITDA (${EVM.base}x Sep-28E EBITDA = Biocon's ${n1(EVH.med)}x median trailing multiple since 2021 × the factor, restated from the ₹${n0(ttmChart)} cr trailing EBITDA incl. other income to Sep-28E) gives ₹${n0(mv('ev').value)}; that history understates the multiple because Screener's EV leaves out BBL's minorities while its EBITDA counts them in full, and because Syngene (once 30x+) has de-rated. The DCF gives ₹${n0(mv('dcf').value)} at ${n1(V.ke)}% and ${AS.dcf.terminalGrowth}% terminal growth, ₹${n0(dcfLessMi)} after Syngene's minorities: Biocon's heavy working capital and capex leave free cash flow well below EBITDA. **Brutal summary: the market price is roughly what Biocon's cash flows and its consolidated history justify today; our target needs the market to keep paying the ~${n1(HBS.med)}x forward EBITDA it has paid for biosimilars since FY24 while EBITDA grows ~15% a year.** That is why the bear case ({{scen.bear.tp|inr}}) is close to the price.` },
    { exhibit: { type: 'table', title: 'Views we did not put in the base (sensitivity rows only)', head: ['View', 'What it changes', 'Value / share (₹)'], wide: [0, 1], rows: sens, source: 'GAM Research' } },
    { h: 'Scenarios' },
    { exhibit: { type: 'table', title: 'Bull, base and bear', head: ['', 'Bear', 'Base', 'Bull'], rows: [
      ['Revenue growth vs base (pp a year)', `${AS.scenarios.bear.revenueGrowthDelta}`, '0', `+${AS.scenarios.bull.revenueGrowthDelta}`],
      ['EBITDA margin vs base (pp)', `${AS.scenarios.bear.marginDelta}`, '0', `+${AS.scenarios.bull.marginDelta}`],
      ['FY28E EPS (₹)', n1(SC.bear.eps[1]), n1(F.pat[1] / SHARES), n1(SC.bull.eps[1])],
      ['Sep-28E biosimilars EBITDA (₹ cr)', n0(SOTP.bear.bsEb), n0(S0.bsEb), n0(SOTP.bull.bsEb)],
      ['Biosimilars / generics multiple', `${MBS.bear}x / ${MGEN.bear}x`, `${MBS.base}x / ${MGEN.base}x`, `${MBS.bull}x / ${MGEN.bull}x`],
      ['Biopharma net debt at Sep-28E (₹ cr)', n0(SOTP.bear.nd), n0(S0.nd), n0(SOTP.bull.nd)],
      { hl: true, cells: ['**Target (₹)**', '**{{scen.bear.tp|inr}}**', '**{{dcf.tp|inr}}**', '**{{scen.bull.tp|inr}}**'] },
      ['Upside', '{{scen.bear.upside|chg}}', '{{dcf.upside|chg}}', '{{scen.bull.upside|chg}}'],
      ['What has to happen', rup(AS.scenarios.bear.narrative), 'Our forecasts: launches ramp in 2HFY27, margins rise ~1.5pp a year, free cash repays debt', rup(AS.scenarios.bull.narrative)],
    ], source: 'GAM Research' } },
    { h: 'DCF detail' },
    { pair: [
      { type: 'table', title: 'DCF summary (consolidated, ₹ crore)', head: ['', 'Value'], rows: [
        ['Discount rate = WACC (rf 6.5% + 0.72 × 6%)', `${n1(V.ke)}%`], ['Terminal growth', `${AS.dcf.terminalGrowth}%`], ['PV of FCFF, FY28-42E', n0(V.pvExplicit)], ['PV of terminal value', `${n0(V.pvTv)} (${Math.round(V.tvShare)}% of EV)`],
        ['Net debt at Mar-27E (model)', n0(-V.netCash)], ['Equity value per share (Mar-27)', n0(V.perShare)], ['Rolled to Sep-27 (12-month value)', n0(mv('dcf').value)], ['Less Syngene minorities at market', n0(dcfLessMi)],
      ], source: 'GAM Research (engine DCF)' },
      { type: 'table', title: 'DCF value per share: discount rate vs terminal growth', head: ['WACC \\ g', ...V.sens.gs.map(g => `${n1(g)}%`)], rows: V.sens.waccs.map((w, i) => [`${n1(w)}%`, ...V.sens.grid[i].map(n0)]), source: 'GAM Research' },
    ] },
    { h: 'Peers on 30-Sep-2026' },
    { exhibit: { type: 'table', title: 'Indian pharma peers at the 30-Sep-2026 close', head: ['Company', 'Price (₹)', 'Market cap (₹ cr)', 'Trailing P/E (x)', 'EV/EBITDA (x)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'ROE'], rows: PEERS.filter(p => !p.missing && (NINE.includes(p.symbol) || ['BIOCON', 'LUPIN', 'DRREDDY'].includes(p.symbol))).map(p => [p.symbol === 'BIOCON' ? '**Biocon**' : shortName(p.symbol), n0(p.price), n0(p.mcapCr), n1(p.pe), n1(p.evEbitda), n0(p.revenue), `${n1(p.ebitdaMargin)}%`, `${n1(p.roe)}%`]), source: 'Screener.in via asof-peers.js (NSE closes on 30-Sep-2026; FY26 financials). Biocon\'s ROE uses Screener\'s pre-minority profit' } },
    { callout: `**Rating: ${rating}.** ${ruleText} At ₹${n0(price)} the upside to {{dcf.tp|inr}} is {{dcf.upside|chg}}. On unchanged estimates the rating would fall to HOLD above ~₹${n0(buyBelow)} and to SELL above ~₹${n0(sellAbove)}. It is a BUY with a lot of execution risk: the P/E is ${n1(peNowSep)}x Sep-28E EPS, and the bear case is roughly the current price.` },
  ],
};

module.exports = { valuation };
