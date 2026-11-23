// TCS report, part 4: street view, valuation, risks & honest summary. Glossary and statement notes in part4b.
const X = require('./TCS.ctx');
const { streetBlocks } = require('./valuation-blend');
const { ruleText } = require('../../src/ratings');
const { D, F, V, A, n0, n1, pc, rup, ASOF_TXT, price, mv, eps, epsSep28, peMult, evMult, FM, HA, H16, H2y, fwdNow, peFY27, evMed, evNow, ttmEbitda, ebitdaSep28, P, derate, OTHERS, sectorDr, incDr, afterSector, afterOwn, midpoint, shortName, justified, impliedG, rating, buyBelow, sellAbove, ST, TONLY, medTp, avgTp, allTp, ratingMix, shortDate, epsCagrHist, epsCagrFwd, PEERS, usdGrowth } = X;

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street: mostly positive, targets bunched at ₹2,200-2,600, multiples cut to 14-15x`,
  blocks: [
    { p: `After the Q1FY27 results (9-10 Jul 2026) we count ${ST.length} brokers with a rating and ${TONLY.length} more with a target only. Ratings: ${ratingMix.pos} Buy/Add/Accumulate/Overweight, ${ratingMix.neu} Hold/Neutral, ${ratingMix.neg} Sell (ICICI Securities ₹1,860, Nirmal Bang ₹1,682). The ${allTp.length} targets have a median of ₹${n0(medTp)} and an average of ₹${n0(avgTp)} (range ₹${n0(allTp[0])}-${n0(allTp.at(-1))}), set when the stock was ~₹2,050-2,130; on ${ASOF_TXT} it was back at ₹${n0(price)}. Every house that discloses a method uses **P/E**, and the multiples were cut hard between April and July: 17-19x FY28E in April (MOSL, Nomura 18x, Nirmal Bang 19x) to 14-15x after Q1 (MOSL and PL 15x, ICICI Direct, 360 ONE and Antique 14x; bears at 12-12.7x, Nuvama 18x at the top). Broker FY28E EPS ranges ₹155-166. Later notes: Deven Choksey cut to Accumulate on the MHP deal (25-Aug); JM Financial kept Add, ₹2,375, before Q2 (28-Sep).` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who'], wide: [0], rows: D.critiques.map(r => r.map(rup)), source: 'Broker notes, calls and filings to 30-Sep-2026' } },
  ],
};

const drTxt = s => `${shortName(s)} ${pc(derate[s])}`;
const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${peMult}x Sep-28E earnings gives {{dcf.tp|inr}}`,
  blocks: [
    ...streetBlocks('TCS', {
      rating,
      streetIntro: 'The brokers that disclose a method all value TCS on **P/E**, mostly on FY28E (a few on Jun-28E or Sep-28E). We use the same method so our target is comparable, applied to the earnings the market will look at in September 2027 (Sep-28E: half FY28E, half FY29E). The "At our EPS" column applies each broker\'s multiple to our EPS for its year: our EPS is ~4% above the street\'s FY28E, so most of the gap to the bears is the multiple.',
      street: ST.map(s => [`${s.broker} (${shortDate(s.date)})`, s.rating, s.tp, s.method || 'n.d.', s.multiple || '–', s.on || '–', rup(s.thesis || '')]),
      ourThesis: 'Growth permanently slower, not gone; priced for no growth; payout yield supports',
      streetSource: 'Broker PDFs (MOSL, PL, ICICI Direct, Emkay, BOBCAPS, Choice, Religare); Business Today roundups (10-Jul-2026, 28-Sep-2026); AnalyticsInsight, Upstox, Univest, Trendlyne. n.d. = method not disclosed in the sources we saw. Target-only (BT): ' + TONLY.map(t => `${t[0]} ${n0(t[1])}`).join(', '),
      derivationIntro: "We start from TCS's own one-year-forward P/E since April 2021 and cut it by how far the IT-services sector had de-rated by 30-Sep-2026 (the library rule: sector de-rating only, on the batch's eight peers, TCS and Tech Mahindra excluded). TCS's own, larger de-rating is shown as a sensitivity, not blended in. Growth, returns, peers and the street are tests of the result, not further adjustments.",
      derivation: [
        ['1. Its own history', `House forwardMedian: ${n1(FM.median)}x since Apr-2021 (no trough years). On EPS before the FY24 and FY26 one-offs: ${n1(HA.med)}x (25th-75th percentile ${n1(HA.p25)}-${n1(HA.p75)}x; low ${n1(HA.min)}x, now). ${n1(H16.med)}x since 2016; ${n1(H2y.med)}x over the last two years; ${n1(fwdNow)}x on ${ASOF_TXT} on our FY28E`, `Starting point: ${n1(HA.med)}x`],
        ['2. Sector de-rating', `On ${ASOF_TXT} the eight IT-services peers traded below their five-year median P/E: ${OTHERS.map(drTxt).join(', ')}: median ${pc(sectorDr)}. Tech Mahindra (${pc(derate.TECHM)}; FY24 earnings trough) and TCS itself excluded. Sensitivity: incumbents only (Infosys, HCLTech, Wipro) ${pc(incDr)}, i.e. ${n1(HA.med * (1 + incDr / 100))}x`, `${n1(HA.med)}x × ${(1 + sectorDr / 100).toFixed(2)} ≈ ${n1(afterSector)}x`],
        ['3. Sensitivities (not the base)', `Incumbents only (Infosys, HCLTech, Wipro) ${pc(incDr)}: ${n1(HA.med * (1 + incDr / 100))}x. TCS's own de-rating, ${pc(derate.TCS)} vs its five-year median: ${n1(afterOwn)}x (₹${n0(afterOwn * epsSep28)} a share on our Sep-28E EPS). Midpoint of the sector and own figures: ${n1(midpoint)}x (₹${n0(midpoint * epsSep28)})`, "Shown for reference; the market prices TCS on its own de-rating, close to today's price"],
        ['4. Growth and returns (test)', `We forecast ~${n1(epsCagrFwd)}% EPS growth a year in FY26-29E (from ₹146.0 before one-offs) vs ${n1(epsCagrHist)}% in FY21-26. A Gordon-growth P/E at an ${n1(V.ke)}% cost of equity and ~52% ROE: ${n1(justified(5))}x for 5%, ${n1(justified(6))}x for 6%, ${n1(justified(6.5))}x for 6.5% long-run growth`, `**${peMult}x** needs ~6.5% long-run rupee earnings growth: above the street's view, near our FY26-29E pace`],
        ['5. Peers', `Trailing P/E: Infosys ${n1(P.INFY.pe)}x, HCLTech ${n1(P.HCLTECH.pe)}x, Wipro ${n1(P.WIPRO.pe)}x, LTM ${n1(P.LTM.pe)}x, Persistent ${n1(P.PERSISTENT.pe)}x; TCS ${n1(P.TCS.pe)}x`, `${peMult}x Sep-28E = ${n1(peMult * epsSep28 / eps[1])}x our FY28E: at HCLTech's trailing level, above Infosys and Wipro`],
        ['6. The street and the price', `Street mode 14-15x FY28E (12x to 18x). At ₹${n0(price)} TCS trades at ${n1(price / epsSep28)}x Sep-28E, which with a 52% ROE implies ~${n1(impliedG)}% a year rupee earnings growth forever`, `Our ${peMult}x is above the street's 14-15x: the gap is the street's extra, TCS-specific discount, which the library rule does not apply`],
      ],
      derivationSource: `Screener.in (P/E history and peers at the ${ASOF_TXT} close), TCS EPS before exceptional items, broker notes, GAM Research`,
      history: { field: 'eps', from: '2016-04-01', median: Math.round(FM.median), label: `Median since 2021: ${n1(FM.median)}x`, title: `One-year-forward P/E: our ${peMult}x vs history`, yearStep: 2 },
      crossNote: `**What the cross-checks tell us.** EV/EBITDA at ${evMult}x Sep-28E EBITDA (₹${n0(ebitdaSep28)} cr) plus net cash gives ₹${n0(mv('ev').value)}, ${Math.abs(Math.round(mv('ev').vsTarget))}% ${mv('ev').vsTarget < 0 ? 'below' : 'above'} the P/E target: ${evMult}x is TCS's ${n1(evMed)}x median trailing EV/EBITDA since 2021 cut by the same ${Math.abs(Math.round(sectorDr))}% sector de-rating (${n1(evMed * (1 + sectorDr / 100))}x trailing, against ${n1(evNow)}x today), restated for Sep-28E EBITDA being ${Math.round((ebitdaSep28 / ttmEbitda - 1) * 100)}% above the twelve months to Jun-26. The DCF (₹${n0(mv('dcf').value)}) is ${Math.abs(Math.round(mv('dcf').vsTarget))}% ${mv('dcf').vsTarget < 0 ? 'below' : 'above'} the target at an ${n1(V.ke)}% cost of equity, 5% terminal growth and EBIT margins easing to ~24.7%: cash flows support well more than today's price, but not all of the P/E target, which assumes TCS re-rates to the sector's de-rated level. All three methods land between ₹${n0(Math.min(...X.BMV))} and ₹${n0(Math.max(...X.BMV))}, ${Math.round((Math.min(...X.BMV) / price - 1) * 100)}-${Math.round((Math.max(...X.BMV) / price - 1) * 100)}% above the price.`,
    }),
    { exhibit: { type: 'line', title: 'One-year-forward P/E: house series vs EPS before one-offs', unit: 'Price ÷ next full-year EPS (x)', x: X.fwdAdj.map(x => x[0]), series: [{ name: 'Before one-offs (GAM)', values: X.fwdAdj.map(x => x[1]), fmt: 'x', thin: true }, { name: 'Reported EPS (house forwardSeries)', values: X.fwdAdj.map(x => (X.houseFwd.find(h => h[0] === x[0]) || [])[1] ?? null), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 2, lines: [{ v: HA.med, text: `Median since 2021 (adjusted): ${n1(HA.med)}x` }, { v: peMult, text: `Our target: ${peMult}x`, color: '#cf8f1f' }], source: 'Screener.in prices; reported EPS (Screener) vs GAM EPS before the FY24 and FY26 one-offs; GAM estimates FY27-29E' } },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Revenue growth +1.5 pts and margin +0.6 pts a year vs base; multiple ${V.blend.methods[0].multiple.bull}x (TCS's 25th-percentile forward P/E since 2021, ${n1(HA.p25)}x).`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `USD revenue +${usdGrowth.map(g => n1(g)).join('% / +')}% (FY27-29E), rupee ₹95.4 → ₹98.3; EBIT margin 24.6% → 25.2%; ${peMult}x Sep-28E EPS of ₹${n1(epsSep28)}.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Revenue growth −2 pts and margin −1.1 pts a year vs base; multiple ${V.blend.methods[0].multiple.bear}x (TCS's own de-rating level, ${n1(afterOwn)}x, and its low since 2016).`],
    ], source: 'GAM Research' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-42E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Add: net cash at Mar-27 (after leases)', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
      { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ], source: 'GAM Research. The engine divides by 363.6 cr shares (Screener basis, incl. the minority ratio) vs 361.8 cr actual, which understates per-share DCF value by ~0.5%.' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of capital down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Listed IT-services peers (30-Sep-2026 close)', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', 'vs 5-yr median P/E', 'EV/EBITDA (x)', 'ROE'], rows: PEERS.map(p => [p.symbol === 'TCS' ? '**TCS**' : shortName(p.symbol), n0(p.mcapCr), n0(p.revenue), p.ebitdaMargin + '%', n1(p.pe), pc(derate[p.symbol]), n1(p.evEbitda), p.roe + '%']), source: `Screener.in, trailing multiples at the NSE close on ${ASOF_TXT} (consolidated). Sector de-rating median uses the eight services peers; Tech Mahindra (earnings trough) and OFSS (software products) are shown for reference only. LTIMindtree trades as LTM.` } },
  ],
};

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: `Our honest summary: a slower TCS, priced as a shrinking one; ${rating} at ${n1(price / eps[1])}x FY28E`,
  blocks: [
    { callout: `**What you are buying:** India's largest and most profitable IT-services company (25% EBIT margin, ~52% ROE), with US$40 bn of annual order intake, ~₹38,000 cr of net cash after leases, a 71.7% owner that wants payouts, and a ~90% payout of earnings through dividends and buybacks (₹110 a share in FY26, a ${n1(110 / price * 100)}% yield at today's price).` },
    { callout: `**What you are paying:** ${n1(peFY27)}x our FY27E and ${n1(price / eps[1])}x FY28E EPS, the lowest forward multiple in at least ten years, for ~${n1(epsCagrFwd)}% EPS growth that leans on the rupee. Growth is structurally lower than in the 2010s: AI takes 10-15% out of every renewal and the new AI work is still ~8.5% of revenue. On the street's method, our inputs and the sector de-rating the target is {{dcf.tp|inr}} ({{dcf.upside|chg}}): ${rating}, a valuation call, not a growth call.` },
    { callout: `**What the market's own de-rating implies:** TCS trades ${Math.abs(Math.round(derate.TCS))}% below its five-year median P/E, against ${Math.abs(Math.round(sectorDr))}% for its peers. The market is saying TCS's earnings are more exposed to AI repricing than peers', or will grow more slowly. Applied to our numbers, that discount gives ${n1(afterOwn)}x Sep-28E EPS, ~₹${n0(Math.round(afterOwn * epsSep28 / 10) * 10)} a share, about today's price; the midpoint of the two de-ratings (${n1(midpoint)}x) gives ~₹${n0(Math.round(midpoint * epsSep28 / 10) * 10)}. Our ${peMult}x target assumes TCS de-rates only as much as the sector. If the next few quarters confirm that TCS is losing ground to peers (CC growth below Infosys and HCLTech again in FY27), the own-de-rating level is the right anchor and the stock is fairly priced; the bear case uses it.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      ['CC growth reaches ~1% QoQ from Q2FY27 as deferred projects resume', 'Medium', 'Q2FY27 results (due in October 2026); Consumer and LSH verticals'],
      ['AI revenue keeps compounding and TCV converts (SKF, UK telecom, BSNL add-on)', 'Medium', 'AI run-rate above US$3 bn; book-to-bill vs revenue growth'],
      ['Margin back to 25%+ by Q4FY27 as promised', 'Medium-high', 'Quarterly EBIT margin; subcontracting costs'],
      ['A buyback at today\'s price', 'Low-medium', 'Board announcements; management says it "remains an option"'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['AI deflation accelerates (renewals repriced 20-30%, as in some anecdotes)', 'Medium', 'USD growth near zero; EPS 10-15% below ours (bear case)'],
      ['Rupee strengthens (oil falls, capital returns to India)', 'Medium', 'Each 1% appreciation ≈ −1% revenue, −20-30 bp margin, ~−2% EPS'],
      ['West Asia conflict and tariffs deepen the discretionary freeze', 'Medium', 'Q2-Q3FY27 growth below 1% QoQ'],
      ['HyperVault and M&A dilute returns (capex, losses, integration of MHP)', 'Medium', 'ROE drifts down; lower payout'],
      ['More US litigation or visa restrictions', 'Low-medium', 'One-off charges; higher onsite costs'],
      ['IT de-rating continues', 'Medium', `At ${V.blend.methods[0].multiple.bear}x Sep-28E on our EPS the stock is worth ~₹${n0(Math.round(V.blend.methods[0].multiple.bear * epsSep28 / 10) * 10)}`],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**We would stay buyers below ~₹${n0(buyBelow)}** and turn sellers above ~₹${n0(sellAbove)} on today's numbers; we would cut the multiple if Q2-Q3FY27 show CC growth still near zero with renewals repricing faster.`,
      `**Biggest swing factor:** the rupee and the margin together. Each 1 pt of EBIT margin is ~${Math.round(F.sales[1] * 0.01 * 0.75 / F.pat[1] * 100)}% of our FY28E EPS and ~₹${n0(Math.round(F.sales[1] * 0.01 * 0.75 / F.shares * peMult / 10) * 10)} a share at our multiple.`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'CC growth, Q1FY27 YoY', v: '+3.2%', d: 'FY26 −2.4%' },
      { k: 'TCV, FY26', v: 'US$40.7 bn', d: 'Q1FY27 US$9.5 bn' },
      { k: 'AI services run-rate', v: 'US$2.6 bn', d: '~8.5% of revenue' },
      { k: 'Price ÷ our FY28E EPS', v: `${n1(price / eps[1])}x`, d: `median since 2021: ${n1(FM.median)}x (forward)` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

module.exports = { street, valuation, risks, ...require('./TCS.part4b') };
