// Asian Paints report, part 4: street view, valuation, risks & honest summary, glossary, statement notes.
const X = require('./ASIANPAINT.ctx');
const { streetBlocks } = require('./valuation-blend');
const { ruleText } = require('../../src/ratings');
const { D, F, V, A, n0, n1, pc, ASOF_TXT, price, mv, epsSep28, peMult, evMult, FM, H21, H16, H2y, exFy25, fy25Band, fwdNow, evMed, ttmEbitda, ebitdaSep28, P, derate, OTHERS, sectorDr, afterDerate, shortName, rating, buyBelow, sellAbove, ST, CONS, postQ1, medTp, avgTp, shortDate, epsCagrHist, epsCagrFwd, epsCagr2829, b, PEERS, A26 } = X;

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street: mostly Buy, targets ₹2,720-3,750, set when the stock was ~₹2,760`,
  blocks: [
    { p: `Ten houses published around the Q1FY27 results (28-31 Jul 2026). Buys: ICICI Securities ₹3,180, Anand Rathi ₹3,180 (upgraded), Axis Securities ₹3,270, MNCL ₹3,165 (initiation) and Nomura ₹3,750 (upgraded to Buy in May). Accumulate: Elara ₹3,100 and Deven Choksey ₹2,970. Neutral/Hold: Motilal Oswal ₹3,050 and Prabhudas Lilladher ₹2,720. JM Financial raised its target to ₹2,930. The median target is ~₹${n0(medTp)} (average ₹${n0(avgTp)}), set when the stock was ~₹2,720-2,760; by ${ASOF_TXT} the price had fallen to ₹${n0(price)} with the rest of the paint and consumer sector, so the same targets now imply ~${Math.round((medTp / price - 1) * 100)}% upside. Every house that discloses a method uses **P/E on FY28E EPS, at 46.5-52x**. Before the results, a consensus of ${CONS.analysts} analysts had an average target of ₹${n0(CONS.avgTp)}. Bulls focus on volume recovery, backward integration and an end to the price war; bears and neutrals on competition, input costs and valuation.` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who'], wide: [0], rows: D.critiques, source: 'Broker notes, calls and filings to 30-Sep-2026' } },
  ],
};

const drTxt = s => `${shortName(s)} ${pc(derate[s])}`;
const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${peMult}x Sep-28E earnings gives {{dcf.tp|inr}}`,
  blocks: [
    ...streetBlocks('ASIANPAINT', {
      rating,
      streetIntro: 'The brokers that disclose a method value Asian Paints on **P/E on FY28E EPS**: Motilal Oswal, ICICI Securities and Anand Rathi at 50x, MNCL at 52x and Prabhudas Lilladher at ~46.5x. We use the same method so our target is comparable, applied to the earnings the market will look at in September 2027 (Sep-28E: half FY28E, half FY29E). The "At our EPS" column applies each broker\'s multiple to our EPS for its year: most of the gap to the street is the multiple, not the earnings.',
      street: ST.map(s => [`${s.broker} (${shortDate(s.date)})`, s.rating, s.tp, s.method || 'n.d.', s.multiple || '–', s.on || '–', X.rup(s.thesis)]),
      ourThesis: 'Volumes back, pricing power not; margins reset to 18-20%; fair value a little above the price',
      streetSource: 'MOSL, PL and ICICI Direct notes (PDFs); Anand Rathi via DSIJ; MNCL website; Nomura, Elara and JM Financial via InvestingCube; Axis Securities and Deven Choksey via Trendlyne. n.d. = method not disclosed in the sources we saw',
      derivationIntro: 'We start from the stock\'s own one-year-forward P/E since April 2021 (the house rule, leaving out trough years), adjust for how far comparable paint and consumer stocks had de-rated by 30-Sep-2026, and then check growth, peers and returns.',
      derivation: [
        ['1. Its own history', `One-year-forward P/E since Apr-2021: median ${n1(FM.median)}x (25th-75th percentile ${n1(H21.p25)}-${n1(H21.p75)}x; peak ${Math.round(H21.max)}x); trough years excluded: ${FM.troughYears.length ? FM.troughYears.join(', ') : 'none (FY25 EPS of ₹38 was above half of FY24\'s ₹57)'}. ${n1(H16.med)}x since 2016; ${n1(H2y.med)}x over the last two years; ${n1(fwdNow)}x on ${ASOF_TXT} on our FY28E`, `Starting point: ${n1(FM.median)}x`],
        ['2. Sector de-rating', `On ${ASOF_TXT} six comparable stocks traded below their five-year median P/E: ${OTHERS.map(drTxt).join(', ')} (median ${pc(sectorDr)}); Asian Paints itself ${pc(derate.ASIANPAINT)}`, `${n1(FM.median)}x × ${(1 + sectorDr / 100).toFixed(2)} ≈ ${n1(afterDerate)}x`],
        ['3. Growth', `EPS grew only ${n1(epsCagrHist)}% a year in FY21-26; we forecast ~${Math.round(epsCagrFwd)}% for FY26-29E (~${Math.round(epsCagr2829)}% after FY27's price boost). Competition risk is already in our margins (19%, not 21-22%)`, `No further adjustment: **${peMult}x**`],
        ['4. Peers', `Trailing P/E: Berger ${n1(P.BERGEPAINT.pe)}x, Kansai ${n1(P.KANSAINER.pe)}x, Indigo ${n1(P.INDIGOPNTS.pe)}x, Pidilite ${n1(P.PIDILITIND.pe)}x, HUL ${n1(P.HINDUNILVR.pe)}x; Asian Paints ${n1(P.ASIANPAINT.pe)}x`, `${peMult}x Sep-28E = ${n1(peMult * epsSep28 / F.eps[1])}x our FY28E: a premium to Berger and HUL, below Pidilite`],
        ['5. Returns', `ROE ${n1(A.roe[b])}% in FY26 (31.5% in FY24), ~${Math.round(F.roe[1])}% in our FY28E, against an ${n1(V.ke)}% cost of equity`, 'Supports a premium to the market, not a return to 60x'],
        ['6. A check on step 1', `In Apr-2023 to Mar-2024 the forward P/E ran at ${Math.round(fy25Band[0])}-${Math.round(fy25Band[1])}x because FY25 EPS collapsed; that year is not a "trough" under the house rule. Leaving it out, the median would be ${n1(exFy25)}x, i.e. ~${Math.round(exFy25 * (1 + sectorDr / 100))}x after de-rating (~₹${n0(Math.round(exFy25 * (1 + sectorDr / 100)) * epsSep28)})`, 'We keep the house rule; the risk to our multiple is on the downside'],
      ],
      derivationSource: `Screener.in (P/E history to ${ASOF_TXT}), broker notes, GAM Research`,
      history: { field: 'eps', from: '2016-04-01', median: Math.round(FM.median), label: `Median since 2021: ${Math.round(FM.median)}x`, title: `One-year-forward P/E: our ${peMult}x vs history`, yearStep: 2 },
      crossNote: `**What the cross-checks tell us.** EV/EBITDA (${evMult}x Sep-28E EBITDA of ₹${n0(ebitdaSep28)} cr plus net cash) gives ₹${n0(mv('ev').value)}, ~${Math.abs(Math.round(mv('ev').vsTarget))}% below the P/E target: ${evMult}x comes from the ${n1(evMed)}x median trailing EV/EBITDA since 2021, cut by the same sector de-rating and restated for Sep-28E EBITDA being ${Math.round((ebitdaSep28 / ttmEbitda - 1) * 100)}% above the twelve months to Jun-26 (₹${n0(ttmEbitda)} cr). Trailing EV/EBITDA history does not carry the FY24-25 earnings distortion that lifts the forward P/E median, so it is the more conservative yardstick. The DCF (₹${n0(mv('dcf').value)}) is far lower: at an ${n1(V.ke)}% cost of equity, 6% terminal growth and margins held near 19%, 15 years of ~8% growth support only ~${Math.round(mv('dcf').value / price * 100)}% of today's price. Asian Paints has always looked expensive on a DCF; the market pays for the length and safety of its growth. With competition now permanent, that premium deserves to be smaller than it was.`,
    }),
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Multiple ${V.blend.methods[0].multiple.bull}x (its 25th-percentile forward P/E since 2021).`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Standalone {{as.segments.0.growth.0|chg}} / {{as.segments.0.growth.1|chg}} / {{as.segments.0.growth.2|chg}}, subsidiaries {{as.segments.1.growth.0|chg}} / {{as.segments.1.growth.1|chg}} / {{as.segments.1.growth.2|chg}} (FY27-29E); EBITDA margin {{F.ebitdaMargin.0|pct}} → {{F.ebitdaMargin.2|pct}}; ${peMult}x Sep-28E EPS.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Multiple ${V.blend.methods[0].multiple.bear}x (~5% below its lowest forward P/E since 2016).`],
    ], source: 'GAM Research' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-42E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Add: net cash at Mar-27', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
      { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ], source: 'GAM Research. The DCF values operating cash flows only; the share of PPG Asian Paints\' profit (~₹170-200 cr a year) is not included, which understates it slightly.' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of capital down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Listed peers: paints and consumer compounders', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', 'vs 5-yr median P/E', 'EV/EBITDA (x)', 'ROE'], rows: PEERS.map(p => [p.symbol === 'ASIANPAINT' ? '**Asian Paints**' : shortName(p.symbol), n0(p.mcapCr), n0(p.revenue), p.ebitdaMargin + '%', n1(p.pe), pc(derate[p.symbol]), n1(p.evEbitda), p.roe + '%']), source: `Screener.in, trailing multiples at the NSE close on ${ASOF_TXT}. JSW Dulux is left out: its Screener multiples around the as-of date are distorted by a later change in share count. Birla Opus is part of Grasim.` } },
  ],
};

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: `Our honest summary: a leader worth owning lower down; ${rating} at ${n1(price / F.eps[1])}x FY28E`,
  blocks: [
    { callout: `**What you are buying:** India's paint leader, with the strongest brand and distribution, volume growth back at 8-12%, a backward-integration cost edge coming, net cash of ~₹6,600 cr, a ${n1(A.roe[b])}% ROE and a reliable 60% payout.` },
    { callout: `**What you are paying:** ${n1(price / F.eps[0])}x our FY27E and ${n1(price / F.eps[1])}x FY28E EPS for ~${Math.round(epsCagr2829)}% EPS growth after FY27, in an industry where two deep-pocketed rivals are still taking share and margins have reset to 18-20%. On the street's method and our inputs the target is {{dcf.tp|inr}} ({{dcf.upside|chg}}): ${rating}, close to the BUY line.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      [`Price below ~₹${n0(buyBelow)} (BUY on our rule)`, 'Medium', `The stock is only ~${Math.round((price / buyBelow - 1) * 100)}% above that level`],
      ['Discounting eases as Birla Opus turns to profitability (Nomura\'s thesis)', 'Medium', 'Value-volume gap, dealer schemes, Grasim\'s paint losses'],
      ['Margins hold near 20% as inputs fall without big price cuts', 'Medium', 'Gross margin vs crude and TiO2; H2 pricing'],
      ['VAM-VAE delivers 300-500 bp on a growing share of products', 'Medium', 'Gross margin from FY28'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['Price war re-intensifies; Birla Opus or JSW Dulux cut prices', 'Medium', 'Margins below 18% (as in FY22 and FY25); EPS 10-15% below ours'],
      ['Inflation persists (West Asia, TiO2) and demand slows on higher prices', 'Medium', 'FY27-28 volume below the 8-10% band'],
      ['Further share loss in economy products and among contractors', 'Medium', 'Revenue growth in low single digits'],
      ['Adverse CCI finding', 'Low-Medium', 'Penalty and limits on dealer practices'],
      ['More money into loss-making home decor or a large acquisition', 'Low', 'Lower returns; more impairments'],
      ['Consumer de-rating continues', 'Medium', `At ${V.blend.methods[0].multiple.bear}x Sep-28E (bear multiple) on our EPS the stock is worth ~₹${n0(Math.round(V.blend.methods[0].multiple.bear * epsSep28 / 10) * 10)}`],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**We would turn buyers below ~₹${n0(buyBelow)}** and sellers above ~₹${n0(sellAbove)} on today's numbers, or sooner if Q2-Q3FY27 show margins holding inside the band with volumes at 8-10% and no rise in discounting.`,
      `**Biggest swing factor:** the margin. Each 1pp of consolidated EBITDA margin is ~${Math.round(F.sales[1] * 0.01 * 0.734 / F.pat[1] * 100)}% of our FY28E EPS and ~₹${n0(Math.round(F.sales[1] * 0.01 * 0.734 / F.shares * peMult / 10) * 10)} a share at our multiple.`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Decorative volume growth, Q1FY27', v: '9.0%', d: 'FY26 8.7%; guidance 8-10%' },
      { k: 'Value minus volume, FY26', v: '−4.4 pts', d: 'Q1FY27 +7.6 pts on price rises' },
      { k: 'Birla Opus Q1FY27 revenue growth', v: '+64%', d: '#3 in organised decorative' },
      { k: 'Price ÷ our FY28E EPS', v: `${n1(price / F.eps[1])}x`, d: `median since 2021: ${Math.round(FM.median)}x (forward)` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

module.exports = { street, valuation, risks, ...require('./ASIANPAINT.part4b') };
