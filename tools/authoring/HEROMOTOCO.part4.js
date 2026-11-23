// Hero MotoCorp report, part 4: street view, valuation (own blocks: the engine's P/E line carries a composite
// multiple, so we show the core multiple and the stakes separately), risks & honest summary. Glossary and
// statement notes in part4b.
const X = require('./HEROMOTOCO.ctx');
const { ruleText } = require('../../src/ratings');
const { D, F, V, A, AS, n0, n1, pc, rup, ASOF_TXT, price, mv, epsSep28, coreMult, stakePs, core, CMP, FM, medCore, medOneoff, coreP25, coreP75, fwdCore, fwdNow, afterCore, afterHouse, afterOneoff, sectorDr, derate, OTHERS, P, PEERS, shortName, evMed, evP25, evP75, ttmEbitda, ebitdaSep28, rating, buyBelow, sellAbove, ST, CONS, postQ1, medTp, avgTp, shortDate, b, priceExStakes, half } = X;
const tpAt = m => Math.round((m * epsSep28 + stakePs) / 10) * 10, upAt = m => pc((tpAt(m) / price - 1) * 100);
const stakeHistShare = 0.075; // Ather at IPO price (11.51 cr x Rs321) + Hero FinCorp at book (Mar-25) ~Rs300 a share vs ~Rs4,000 Hero price in May-2025
const histAdj = half(medCore * (1 - stakeHistShare) * (1 + sectorDr / 100));

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street: mostly Buy, targets ₹5,000-6,845 set when the stock was ~₹5,550-5,790`,
  blocks: [
    { p: `Nine houses published after the Q1FY27 results (7-11 Aug 2026). Buy/Add/Outperform: Motilal Oswal ₹6,560, Emkay ₹6,700, Choice ₹6,450, Citi ₹6,670, JPMorgan ₹6,845, CLSA ₹6,555. Accumulate: Prabhudas Lilladher ₹6,000. Hold: Nomura ₹6,124. Sell: Kotak ₹5,000 (Jefferies, Hold ₹5,000 since May). The median is ₹${n0(medTp)} (average ₹${n0(avgTp)}), set when the stock was ₹5,550-5,790; by ${ASOF_TXT} it had fallen to ₹${n0(price)}, so the same targets imply ~${Math.round((medTp / price - 1) * 100)}% upside. Every house that discloses a method values the **core business on P/E (16-18x FY28E or Jun-28E core EPS) and adds Ather and Hero FinCorp separately** at a 20-30% holding discount (stakes worth ₹484-1,001 a share). ${CONS.analysts} analysts on a MultiBagg panel average ~₹${n0(CONS.avgTp)} (undated). Bulls point to share gains in scooters, EVs and exports, parts growth and the dividend yield; bears to structural decline in commuter bikes, EV competition and margins.` },
    { exhibit: { type: 'table', title: 'How the street values Hero', head: ['Broker (date)', 'Rating', 'Target (₹)', 'Method', 'Multiple', 'On', 'Stakes', 'Thesis'], wide: [6, 7], rows: [
      ...ST.map(s => [`${s.broker} (${shortDate(s.date)})`, s.rating, n0(s.tp), s.method || 'n.d.', s.multiple || '–', s.on || '–', rup(s.stakes || '–'), rup(s.thesis || '–')]),
      { hl: true, cells: ['**GAM Research**', `**${rating}**`, '**{{dcf.tp|num}}**', '**P/E + stakes**', `**${coreMult}x**`, '**Sep-28E EPS before associates**', `**₹${n0(stakePs)} (Ather at market, Hero FinCorp at book, 20% discount)**`, 'Core priced for decline; stakes free'] },
    ], source: 'PL PDF; Emkay PDF; MOSL via DSIJ; Choice via InvestmentGuruIndia; Citi, JPMorgan, CLSA, Nomura, Kotak via MultiBagg (24-Sep-2026); Jefferies via Whalesbook. n.d. = method not disclosed in the sources we saw' } },
    { exhibit: { type: 'table', title: 'Street methods on our numbers (₹ per share)', head: ['Core multiple', 'On our Sep-28E EPS', '+ our stakes', '= value', 'vs CMP'], rows: [12.5, 15, 16, 18].map(m => [`${m}x${m === coreMult ? ' (GAM)' : m === 16 ? ' (PL)' : m === 18 ? ' (MOSL, Emkay, Choice)' : ' (GAM bear)'}`, n0(m * epsSep28), n0(stakePs), n0(tpAt(m)), upAt(m)]), source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who'], wide: [0], rows: D.critiques.map(r => r.map(rup)), source: 'Broker notes, filings and data to 30-Sep-2026' } },
  ],
};

const drTxt = s => `${shortName(s)} ${pc(derate[s])}`;
const M3 = AS.valuation.blend.methods, iPe = M3.findIndex(m => m.key === 'pe'), iEv = M3.findIndex(m => m.key === 'ev'), iDcf = M3.findIndex(m => m.key === 'dcf');
const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${coreMult}x core earnings plus ₹${n0(stakePs)} of stakes gives {{dcf.tp|inr}}`,
  blocks: [
    { h: 'Method: the street\'s, on our numbers' },
    { p: `We value Hero the way the street does: **P/E on core earnings plus the stakes**. Core earnings = our consolidated EPS before the share of associates, for the twelve months the market will look at in September 2027 (Sep-28E: half FY28E, half FY29E) = ₹${n1(epsSep28)}. The stakes are valued separately (previous chapter). Because the engine has no "plus stakes" line, the P/E line in our model and Excel carries a **composite multiple** of ${n1(CMP.base.multiple)}x = ${coreMult}x + ₹${n0(stakePs)} ÷ ₹${n1(epsSep28)} (bull ${n1(CMP.bull.multiple)}x, bear ${n1(CMP.bear.multiple)}x); it is arithmetic, not a view that Hero deserves ${n1(CMP.base.multiple)}x.` },
    { exhibit: { type: 'table', title: 'Target price build (₹ per share)', head: ['', 'Base', 'Bull', 'Bear'], rows: [
      ['Core multiple (x Sep-28E EPS before associates)', `${coreMult}x`, `${CMP.bull.core}x`, `${CMP.bear.core}x`],
      ['Sep-28E EPS (₹)', n1(CMP.base.eps), n1(CMP.bull.eps), n1(CMP.bear.eps)],
      ['Core business', n0(CMP.base.coreValue), n0(CMP.bull.coreValue), n0(CMP.bear.coreValue)],
      ['Ather Energy (30-Sep close; discount 20% / 10% / 30%)', n0(CMP.base.v.ather / F.shares), n0(CMP.bull.v.ather / F.shares), n0(CMP.bear.v.ather / F.shares)],
      ['Hero FinCorp (1.0x / 1.0x / 0.7x Mar-26 book, less 20%)', n0(CMP.base.v.hfcl / F.shares), n0(CMP.bull.v.hfcl / F.shares), n0(CMP.bear.v.hfcl / F.shares)],
      ['Euler and other holdings (book)', n0(CMP.base.v.others / F.shares), n0(CMP.bull.v.others / F.shares), n0(CMP.bear.v.others / F.shares)],
      { hl: true, cells: ['**12-month target (rounded)**', '**{{dcf.tp|inr}}**', '**{{scen.bull.tp|inr}}**', '**{{scen.bear.tp|inr}}**'] },
      ['vs CMP', '{{dcf.upside|chg}}', '{{scen.bull.upside|chg}}', '{{scen.bear.upside|chg}}'],
      ['Memo: composite multiple used by the engine', `${n1(CMP.base.multiple)}x`, `${n1(CMP.bull.multiple)}x`, `${n1(CMP.bear.multiple)}x`],
    ], source: 'GAM Research' } },
    { h: `Our core multiple: ${coreMult}x, and why` },
    { exhibit: { type: 'table', title: 'Deriving the core multiple (house rule, batch rule for autos)', head: ['Yardstick', 'Evidence', 'What it implies'], wide: [1, 2], rows: [
      ['1. Its own history', `One-year-forward P/E since Apr-2021, no trough years (FY23-28 EPS never fell below half the prior peak). On EPS before associates and one-offs: median ${n1(medCore)}x (25th-75th percentile ${n1(coreP25)}-${n1(coreP75)}x). House forwardMedian on reported EPS: ${n1(FM.median)}x; adjusting only one-offs (FY24 VRS, FY26 dilution gain, labour code, Zero write-down): ${n1(medOneoff)}x`, `Starting point: ${n1(medCore)}x (core basis, matching our EPS)`],
      ['2. Sector de-rating', `At the ${ASOF_TXT} close the seven other auto OEMs traded vs their five-year median trailing P/E: ${OTHERS.map(drTxt).join(', ')}; median ${pc(sectorDr)}. None excluded (no peer's trailing P/E is distorted by one-offs at that date)`, `${n1(medCore)}x x ${(1 + sectorDr / 100).toFixed(3)} = ${n1(afterCore)}x → **${coreMult}x** (nearest half-turn)`],
      ['3. Why the core basis', `Our EPS excludes associates (Ather's losses, Hero FinCorp, one-off dilution gains) because we add the stakes at market. History must be on the same EPS. Reported basis gives ${n1(afterHouse)}x → ${half(afterHouse)}x (₹${n0(tpAt(half(afterHouse)))}); one-offs only ${n1(afterOneoff)}x → ${half(afterOneoff)}x (₹${n0(tpAt(half(afterOneoff)))})`, `We keep ${coreMult}x, the lowest of the three`],
      ['4. Stakes', `Ather at the 30-Sep close less 20%, Hero FinCorp at 1.0x book less 20%, Euler and others at book (₹${n0(stakePs)} a share)`, `${coreMult}x x ₹${n1(epsSep28)} + ₹${n0(stakePs)} = ₹${n0(core.value)}`],
      ['Sensitivity: history adjusted for the stakes', `Hero's price always included some value for the stakes. At Ather's IPO price and Hero FinCorp's book they were ~${Math.round(stakeHistShare * 100)}% of Hero's price in May-2025 (₹~300 of ~₹4,000); stripping that out of the history: ${n1(medCore * (1 - stakeHistShare))}x x 0.931 → ${histAdj}x`, `₹${n0(tpAt(histAdj))} (${upAt(histAdj)}): a HOLD. Not in our base (the batch rule fixes the base), but it is the main risk to our multiple`],
      ['Sensitivity: own de-rating, growth, returns', `Hero's own trailing P/E is ${pc(derate.HEROMOTOCO)} vs its five-year median, the same as the sector, so the batch rule (sector only) changes nothing. EPS growth ~${Math.round(X.epsCagrFwd)}% a year (FY26-29E) vs ~${Math.round(X.epsCagrHist)}% in FY21-26; ROE ~${Math.round(F.roe[1])}% vs an ${n1(V.ke)}% cost of equity`, 'No uplift or discount applied (batch rule)'],
      ['Peers', `Trailing P/E at 30-Sep: Bajaj ${n1(P['BAJAJ-AUTO'].pe)}x, TVS ${n1(P.TVSMOTOR.pe)}x, Eicher ${n1(P.EICHERMOT.pe)}x, Maruti ${n1(P.MARUTI.pe)}x; Hero ${n1(P.HEROMOTOCO.pe)}x reported, ~${n1(priceExStakes / F.eps[0])}x our FY27E ex-stakes`, 'Hero is the cheapest two-wheeler stock in the set even before counting the stakes'],
    ], source: `Screener.in prices and P/E history to ${ASOF_TXT}; AR FY24-26; GAM Research` } },
    { pair: [
      { type: 'line', title: `Forward P/E on core EPS vs our ${coreMult}x`, unit: 'Price ÷ next full-year EPS before associates and one-offs (x)', x: fwdCore.map(x => x[0]), series: [{ name: 'Forward P/E (core)', values: fwdCore.map(x => Math.round(x[1] * 10) / 10), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: Math.round(medCore * 10) / 10, text: `Median ${n1(medCore)}x` }, { v: coreMult, text: `Our ${coreMult}x`, color: '#cf8f1f' }], source: 'Screener.in prices; GAM-adjusted EPS; GAM estimates FY27-28E' },
      { type: 'hbar', title: 'Target and cross-checks vs the share price', unit: '₹ per share (base case)', x: ['P/E core + stakes (target)', 'EV/EBITDA (stakes at book)', 'DCF (stakes at book)', 'Share price today'], series: [{ name: 'Value', values: [Math.round(mv('pe').value), Math.round(mv('ev').value), Math.round(mv('dcf').value), price], fmt: 'inr' }], labels: 'all', highlight: 'P/E core + stakes (target)', source: 'GAM Research' },
    ] },
    { exhibit: { type: 'table', title: 'Target price and cross-checks', head: ['Method', 'Role', 'Basis', 'Multiple', 'Value / share (₹)', 'vs target', 'Bull (₹)', 'Bear (₹)'], rows: [
      ['**P/E (core) + stakes**', '**Target**', `EPS Sep-28E ₹${n1(epsSep28)} + stakes ₹${n0(stakePs)}`, `${coreMult}x core (composite ${n1(CMP.base.multiple)}x)`, `**{{dcf.blend.methods.${iPe}.value|num}}**`, '–', `{{scen.bull.blend.methods.${iPe}.value|num}}`, `{{scen.bear.blend.methods.${iPe}.value|num}}`],
      ['EV/EBITDA', 'Cross-check', `EBITDA Sep-28E ₹${n0(ebitdaSep28)} cr + net cash`, `${mv('ev').mult}x (bull ${M3[iEv].multiple.bull}x, bear ${M3[iEv].multiple.bear}x)`, `{{dcf.blend.methods.${iEv}.value|num}}`, pc(mv('ev').vsTarget), `{{scen.bull.blend.methods.${iEv}.value|num}}`, `{{scen.bear.blend.methods.${iEv}.value|num}}`],
      ['DCF', 'Cross-check', 'FCFF FY28-42E, Ke 11.6%, g 5%', '–', `{{dcf.blend.methods.${iDcf}.value|num}}`, pc(mv('dcf').vsTarget), `{{scen.bull.blend.methods.${iDcf}.value|num}}`, `{{scen.bear.blend.methods.${iDcf}.value|num}}`],
      { hl: true, cells: ['**12-month target (rounded)**', '', '', '', '**{{dcf.tp|inr}}**', '{{dcf.upside|chg}} vs CMP', '{{scen.bull.tp|inr}}', '{{scen.bear.tp|inr}}'] },
    ], source: 'GAM Research' } },
    { callout: `**What the cross-checks tell us.** EV/EBITDA (${mv('ev').mult}x Sep-28E EBITDA of ₹${n0(ebitdaSep28)} cr: Hero's ${n1(evMed)}x median trailing multiple since 2021, cut by the ${Math.abs(Math.round(sectorDr))}% sector de-rating and restated for Sep-28E EBITDA being ${Math.round((ebitdaSep28 / ttmEbitda - 1) * 100)}% above the last twelve months' ₹${n0(ttmEbitda)} cr) gives ₹${n0(mv('ev').value)}, ${Math.abs(Math.round(mv('ev').vsTarget))}% below the target, but it counts the stakes at book (~₹6,300 cr by Mar-27) inside net cash; at market it would be ~₹${n0(mv('ev').value + (core.v.total - 6300) / F.shares)}. The DCF (₹${n0(mv('dcf').value)}, also with stakes at book) is ${Math.round(mv('dcf').vsTarget)}% above: at an ${n1(V.ke)}% cost of equity, revenue growth fading to 7% and a 14% margin, Hero's cash flows are worth more than ${coreMult}x earnings implies. The checks bracket the target; neither suggests the core is expensive.` },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Volume +2 pts a year, margin +0.7 pt; core ${CMP.bull.core}x (75th percentile of its core history after de-rating).`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Volume +{{as.volume.growth.0|n1}}% / +{{as.volume.growth.1|n1}}% / +{{as.volume.growth.2|n1}}% (FY27-29E); EBITDA margin {{F.ebitdaMargin.0|pct}} → {{F.ebitdaMargin.2|pct}}; ${coreMult}x Sep-28E core EPS + stakes ₹${n0(stakePs)}.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Volume −3 pts a year, margin −1.2 pts; core ${CMP.bear.core}x (25th percentile after de-rating).`],
    ], source: 'GAM Research' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-42E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Add: net cash at Mar-27 (incl. stakes at book)', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
      { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ], source: 'GAM Research. Stakes are inside net cash at book value; at market they would add ~₹550 a share.' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of capital down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Listed auto OEM peers (30-Sep-2026 close)', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', 'vs 5-yr median P/E', 'EV/EBITDA (x)', 'ROE'], rows: PEERS.map(p => [p.symbol === 'HEROMOTOCO' ? '**Hero MotoCorp**' : shortName(p.symbol), n0(p.mcapCr), n0(p.revenue), p.ebitdaMargin + '%', n1(p.pe), pc(derate[p.symbol]), n1(p.evEbitda), p.roe + '%']), source: `Screener.in, trailing multiples at the NSE close on ${ASOF_TXT}. Mahindra & Mahindra and TVS Motor on standalone figures (their listed and financing subsidiaries excluded).` } },
  ],
};

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: `Our honest summary: cheap for a reason, but cheap; ${rating} with a thin margin of safety`,
  blocks: [
    { callout: `**What you are buying:** the world's largest two-wheeler maker with a near-monopoly in India's 100-110cc motorcycles, ~₹15,400 cr of net cash, 35% ROCE, negative working capital, a 70% payout, a fast-growing parts business, credible share gains in scooters and EVs, and ~₹${n0(stakePs)} a share of stakes (mostly Ather).` },
    { callout: `**What you are paying:** ₹${n0(price)}, i.e. ${n1(fwdNow)}x our FY28E EPS, or ~${n1(priceExStakes / F.eps[1])}x for the core once the stakes are counted, for ~${Math.round(X.epsCagrFwd)}% EPS growth in a home segment that keeps losing share of the market. On the street's method and our inputs the target is {{dcf.tp|inr}} ({{dcf.upside|chg}}): ${rating}, but only just; a history adjusted for the stakes would make it a HOLD.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      ['Rural demand holds through the festive season despite the weak monsoon', 'Medium', 'VAHAN retail Oct-Nov 2026; entry and deluxe dispatches'],
      ['VIDA reaches EBITDA breakeven with PLI on the whole range', 'Medium', 'Loss per unit (₹40,000 in Q1FY27); EV investment per quarter'],
      ['Premium launches finally take share', 'Low-Medium', 'Premium share above 3%; Harley-Davidson volumes'],
      ['Commodities ease and margin returns to 14-15%', 'Medium', 'Gross margin; aluminium and steel prices'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['Weak monsoon and fading GST boost stall motorcycles in H2FY27-FY28', 'Medium-High', 'Volume growth near zero; EPS 5-10% below ours'],
      ['Ather falls 30% (valued at ~15x sales)', 'Medium', `~₹${n0(core.v.ather * 0.3 / F.shares)} off our target`],
      ['EV price war (TVS, Bajaj, Ather, Ola) delays VIDA breakeven', 'Medium', 'Margin stuck near 13%'],
      ['Commuter motorcycles start to electrify faster than expected', 'Low (near term)', 'Erodes the core moat; multiple de-rates further'],
      ['More capital into minority stakes or Hero FinCorp support', 'Medium', 'Lower returns; less cash for dividends'],
      ['Adverse outcome in the ED/DRI cases against the chairman', 'Low', 'Governance discount'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**We would add below ~₹${n0(buyBelow)}** (the stock is only ~${Math.round((price / buyBelow - 1) * 100)}% above that) and turn sellers above ~₹${n0(sellAbove)} on today's numbers. With the target only ~1.6 points above the BUY line, a fall in Ather or a weak festive season could tip it to HOLD.`,
      `**Biggest swing factors:** the core margin (each 1pp of EBITDA margin is ~${Math.round(F.sales[1] * 0.01 * 0.75 / F.pat[1] * 100)}% of FY28E EPS, ~₹${n0(Math.round(F.sales[1] * 0.01 * 0.75 / F.shares * coreMult / 10) * 10)} a share at ${coreMult}x) and Ather's price (₹100 on Ather = ~₹50 on our target).`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: '100-110cc share, Q1FY27', v: '96%', d: 'segment = 32% of the market (42% in FY21)' },
      { k: 'Volume growth, Q1FY27', v: '+23%', d: 'August-26 only +2.7%' },
      { k: 'Stakes per share', v: `₹${n0(stakePs)}`, d: 'Ather at market, 20% discount' },
      { k: 'Core P/E at CMP, FY28E', v: `${n1(priceExStakes / F.eps[1])}x`, d: `core median since 2021: ${n1(medCore)}x` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

module.exports = { street, valuation, risks, ...require('./HEROMOTOCO.part4b') };
