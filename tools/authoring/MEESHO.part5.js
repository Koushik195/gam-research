// Meesho report, part 5: street view, valuation (sum of the parts, multiple derivation, cross-checks, scenarios, peers),
// rating and the cover arguments. The marketplace multiple is derived in MEESHO.ctx.js (the build fails if
// assumptions.json drifts from it).
const C = require('./MEESHO.ctx');
const { streetBlocks } = require('./valuation-blend');
const { n0, n1, n2, pc1, D, M, V, F, SO, AS, A26, q1, price, mcap, shares, nmvSep, PM, PN, PC, OWN, OWN_ALL, OWN_DEC, OWN_FY28, fwdNow, MULT, ALT, drW, dr5, sectorW, sector5, drMs, sectorMs, impliedX, rating, ST, cur, medTp, PR, ASOF_TXT, mv } = C;
const SB = ST.brokers;
// Method, multiple and basis per broker, as disclosed (see deep.json street for the full text)
const XB = { Ventura: ['DCF', 'WACC 11%, g 5%', 'FY29 target'], Jefferies: ['EV/NMV', '1.6x (initiation)', 'Jun-28E NMV'], 'Motilal Oswal': ['EV/EBITDA, discounted', '30x', 'FY31E adj. EBITDA'], Choice: ['EV/sales', '4.0x', 'FY28E revenue'], 'J.P. Morgan': ['EV/EBITDA, discounted', '35x', 'FY30E'], Citi: ['EV/EBITDA', '50x', 'FY29E adj. EBITDA'], BofA: ['DCF + EV/EBITDA (50:50)', '30x', 'FY29E'], 'JM Financial': ['DCF', '~45x FY29E implied', 'Mar-27 target'] };
const ke = V.ke, sepNow = (mcap - q1.cash) / nmvSep;
// Street-style cross-check (MOFSL): 30x FY31E EBITDA from our DCF path, discounted 2.5 years to Sep-28 at our cost of equity
const r31 = V.rows.find(r => r.year === 'FY31E'), mofsl = (30 * r31.ebitda / Math.pow(1 + ke / 100, 2.5) + PC.value) / shares;
const jefX = 1.6, jef = (jefX * nmvSep + PN.value + PC.value - 202) / shares; // street EV/NMV on our Sep-28E NMV

const headline = 'India\'s value-shopping leader, priced ahead of its margins';
const coverArguments = [
  { h: 'The biggest buyer base in Indian e-commerce, still growing fast', p: `${q1.atuMn} million annual buyers (+29%) and ${q1.atsMn} million sellers (+${q1.atsYoYPct}%); NMV +${q1.nmvYoYPct}% in Q1FY27. Zero commission and Valmo logistics make it the cheapest place to sell. Management guides to ~25% NMV growth a year for five years; we use 26% to FY29E.` },
  { h: 'Profit is a FY28-29 story, and slow by design', p: `Contribution margin recovered to ${q1.cmPct}% of NMV, but fixed costs take 5.8%, so the marketplace still lost ${-q1.mpAePct}% of NMV. Meesho passes logistics savings on to buyers; margins depend on ads. We forecast break-even in FY28E and 1.3% of NMV in FY29E, below the street.` },
  { h: 'Cash-rich, but the register is in flux', p: `₹${n0(q1.cash)} cr of cash and negative working capital mean no new money is needed. But venture investors (~40%) have been selling since the Jun-2026 lock-in expiry, and ₹2,072 cr of contested tax demands plus a GST question over Valmo hang over the cash.` },
  { h: 'Valuation: the stock already pays above its own history', p: `At ₹${n0(price)} the market pays ${n2(fwdNow)}x next year's NMV, against a median of ${n2(OWN.med)}x since January. At our derived ${PM.mult}x Sep-28E NMV the sum of the parts gives {{dcf.tp|inr}} ({{dcf.upside|chg}}): ${rating}. The street's median target is ₹${medTp}; its bulls (Jefferies 1.6x NMV) need margins we do not yet see.` },
];

// ---------------------------------------------------------------- Street
const nBuy = cur.filter(b => /buy|overweight/i.test(b.rating)).length, nSell = cur.filter(b => /reduce|underperform|sell/i.test(b.rating)).length;
const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street: ${nBuy} Buys, ${cur.length - nBuy - nSell} Holds, ${nSell} Sells; median target ₹${n0(medTp)}`,
  blocks: [
    { exhibit: { type: 'table', title: `Broker calls standing on ${ASOF_TXT} (latest per broker)`, head: ['Broker', 'Rating', 'Target (₹)', 'Date', 'Method'], wide: [4], rows: SB.map(b => [b.short + (b.confidence === 'article-only' ? '*' : ''), b.rating, n0(b.tp), b.date, b.methodShort]), source: 'Broker notes as reported on or before 30-Sep-2026 (Business Today, Inc42, Business Upturn, DSIJ, Reuters/LSEG via Zerodha and others). * = secondary or aggregator source only; n.d. = not disclosed.' } },
    { pair: [
      { type: 'hbar', title: `Targets range from ₹${ST.summary.lowTp} to ₹${ST.summary.highTp}; the price is above the median`, unit: '₹ per share', x: [...SB.map(b => b.short), 'GAM (base)'], series: [{ name: 'Target', values: [...SB.map(b => b.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes, GAM Research' },
      { type: 'column', title: 'Most targets were raised as the stock rallied', unit: 'Median target of the brokers covering at the time (₹, LSEG)', x: D.consensus.lseg.filter(x => x.medianTarget).map(x => x.date).reverse(), series: [{ name: 'Median target', values: D.consensus.lseg.filter(x => x.medianTarget).map(x => x.medianTarget).reverse(), fmt: 'inr' }], labels: 'all', source: 'Reuters items citing LSEG data (via Zerodha), Jun-Sep 2026' },
    ] },
    { p: `The street is split. ${nBuy} of ${cur.length} brokers rate Meesho a Buy, on the case that it is the only scaled value platform, that ads are under-monetised (J.P. Morgan: 1.8% of NMV vs 3.7% globally) and that operating leverage will follow. The sceptics (JM Financial, Nomura, CLSA, Macquarie) argue that falling order values cap unit economics, that the price already discounts years of fast growth and margin gains, and that Flipkart, Amazon and quick commerce are closing in. The LSEG median target was ₹215 (16 analysts) on 25-Sep-2026; our own table gives ₹${n0(medTp)}. The disclosed methods are EV/NMV (Jefferies), EV/EBITDA on FY29-31E discounted back (MOFSL, J.P. Morgan, Citi, BofA), EV/sales (Choice) and DCF (Ventura, JM Financial).` },
  ],
};

// ---------------------------------------------------------------- Valuation
const vrow = (p, i) => [p.name, AS.valuation.parts[i].metricLabel || '', p.metric != null && p.metric !== 0 ? n0(p.metric) : '–', p.mult ? `${p.mult}x` : '–', p.adj ? n0(p.adj) : '–', `{{dcf.sotp.parts.${i}.value|num}}`, `{{dcf.sotp.parts.${i}.perShare|n1}}`];
const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: 'Valuation: sum of the parts on order value gives {{dcf.tp|inr}}',
  blocks: [
    ...streetBlocks('MEESHO', {
      rating, noOurEps: true,
      streetIntro: 'Meesho makes losses, so P/E cannot be used. Brokers value it on order value (EV/NMV), on EBITDA two to five years out discounted back, on EV/sales, or with a DCF. We value the marketplace on EV/NMV, the one yardstick we can derive from the stock\'s own trading history, add the cost of the new-initiative losses still to come and the cash, and use a DCF and the street\'s EV/EBITDA as cross-checks.',
      street: SB.map(b => [b.short, b.rating, b.tp, ...(XB[b.short] || ['n.d.', '–', '–']), b.thesis.slice(0, 110) + (b.thesis.length > 110 ? '…' : '')]),
      ourThesis: `Marketplace ${PM.mult}x Sep-28E NMV; new initiatives at the PV of losses; Kirana Club price; net cash`,
      streetSource: 'Broker notes as reported on or before 30-Sep-2026; n.d. = not disclosed',
      derivationTitle: `Our marketplace multiple: ${PM.mult}x NMV, and why`,
      derivationIntro: `Meesho listed on 10-Dec-2025, so its own history is short. Following our rule for recent listings (HYUNDAI, HDBFS, TENNIND), we skip the listing month, when the stock traded at an IPO premium (median ${n2(OWN_DEC.med)}x, peak ${n2(OWN_DEC.max)}x forward NMV), and use every daily close from 1-Jan-2026 to ${ASOF_TXT}: ${OWN.n} closes, nine months rather than the usual twelve. We pair it with the sector's move over the same window.`,
      derivation: [
        ['1. Own forward P/E (house starting point)', 'Forward EPS is a loss in every year of the window (FY27E, FY28E break-even)', 'Not usable; not applied'],
        ['2. Own EV / forward NMV, 1-Jan to 30-Sep-2026', `Median ${n2(OWN.med)}x (25th-75th percentile ${n2(OWN.p25)}-${n2(OWN.p75)}x; range ${n2(OWN.min)}-${n2(OWN.max)}x). EV = diluted market value − company cash; NMV of the next full year (FY27E to Mar-26, FY28E from Apr-26). At ${ASOF_TXT}: ${n2(fwdNow)}x`, `Starting point ${n2(OWN.med)}x`],
        ['3. Sector move, same window (§7c)', `Internet peers with a usable P/E (the Eternal set): Info Edge ${pc1(drW.NAUKRI)}, IndiaMART ${pc1(drW.INDIAMART)} vs their medians since 1-Jan-2026; median ${pc1(sectorW)}. Eternal, Swiggy, Nykaa, Paytm and PB Fintech excluded (loss years or P/E above 300x)`, `× ${n2(1 + sectorW / 100)} → ${n2(OWN.med * (1 + sectorW / 100))}x → **${PM.mult}x** (nearest 0.05x)`],
        ['4. Sensitivities (not applied)', `Including Dec-2025: ${ALT.withDec}x. Apr-Sep 2026 only (FY28E NMV): ${ALT.fy28only}x. Market value/sales of all seven platforms vs their medians since Jan (median ${pc1(sectorMs)}): ${ALT.ms}x. Five-year P/E move of Info Edge/IndiaMART (${pc1(sector5)}) is a different window and not comparable`, 'All within 1.20-1.25x'],
        ['5. The street', `Jefferies values Meesho at 1.6x Jun-28E NMV ("broadly similar to Blinkit"); on our Sep-28E NMV that is ~₹${n0(jef)}. Our Eternal report values Blinkit at 1.2x NOV`, 'Shown as the bull-side reference; not applied'],
        ['6. Bull / bear', `Bull: own median with no sector move (${MULT.bull}x). Bear: own 25th percentile × the move (${MULT.bear}x)`, `${MULT.bull}x / ${MULT.bear}x`],
      ],
      derivationSource: 'Screener.in daily prices, company NMV and cash, GAM estimates; peers from Screener.in P/E series',
      crossNote: `Cross-checks: the DCF (${n1(ke)}% cost of equity, 6% terminal growth, margin fading to 12% of revenue ≈ 3.9% of NMV) gives ₹${n0(mv('dcf').value)} (${pc1(mv('dcf').vsTarget)} vs our SOTP), close to the SOTP. The street's FY29E EV/EBITDA (${mv('ev').mult}x) on our FY29E EBITDA gives only ₹${n0(mv('ev').value)}: the street's targets rest on margins of 2-4% of NMV by FY29-31E, two to three times ours. Done MOFSL's way (30x FY31E EBITDA, discounted to Sep-28 at ${n1(ke)}%) on our DCF path, Meesho is worth ~₹${n0(mofsl)}.`,
    }),
    { h: 'Sum of the parts in detail' },
    { p: 'We value the marketplace on our Sep-28E NMV (the average of FY28E and FY29E), deduct the present value of new-initiative losses and the Kirana Club purchase price, and add the net cash we expect at March 2027. Every input is live in the SOTP sheet of the Excel model, with Base / Bull / Bear switches.' },
    { exhibit: { type: 'table', title: 'Sum-of-the-parts valuation (base case)', head: ['Part', 'Method', 'Metric (₹ cr)', 'Multiple', 'Adjustment (₹ cr)', 'Value (₹ cr)', '₹ / share'], wide: [1], rows: [
      ...SO.parts.map(vrow),
      { hl: true, cells: ['**Equity value**', '', '', '', '', n0(SO.equity), n1(SO.equity / F.shares)] },
      { hl: true, cells: ['**SOTP target (rounded)**', '', '', '', '', '', '{{dcf.tp|inr}}'] },
    ], source: `GAM Research estimates; ${n1(shares)} cr fully diluted shares` } },
    { bullets: SO.parts.map((p, i) => `**${p.name}:** ${AS.valuation.parts[i].note}`) },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Value / share', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', '{{as.scenarios.bull.narrative}}'],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `NMV +26% a year to FY29E; marketplace break-even in FY28E and 1.3% of NMV in FY29E; ${PM.mult}x Sep-28E NMV (own median × sector move).`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', '{{as.scenarios.bear.narrative}}'],
    ], source: 'GAM Research estimates' } },
    { callout: `**What is the market paying for?** At ₹${n0(price)} the enterprise value is ~₹${n0(mcap - q1.cash)} cr. With new initiatives at our value, that is ~${n2(impliedX)}x our Sep-28E NMV (₹${n0(nmvSep)} cr), against ${n2(OWN.med)}x the stock's own median since January and ${PM.mult}x in our target. Put differently, the price needs Jefferies-style margins (3% of NMV by FY30) and a multiple near the top of its short history. Each 0.1x of NMV is worth ~₹${n0(nmvSep * 0.1 / shares)} a share.` },
    { exhibit: { type: 'table', title: `Internet peers at the ${ASOF_TXT} close`, head: ['Company', 'Market value (₹ cr)', 'Trailing P/E', 'Trailing EV/EBITDA', 'FY26 revenue (₹ cr)', 'FY26 EBITDA margin'], rows: ['MEESHO', 'ETERNAL', 'SWIGGY', 'NAUKRI', 'INDIAMART', 'NYKAA', 'PAYTM', 'POLICYBZR'].map(s => { const p = PR[s]; return [s === 'MEESHO' ? '**Meesho**' : p.name.replace(/ (India )?Ltd\.?$/, ''), n0(p.mcapCr), p.pe ? `${n1(p.pe)}x` : 'loss', p.evEbitda > 0 ? `${n1(p.evEbitda)}x` : 'n.m.', n0(p.revenue), `${p.ebitdaMargin}%`]; }), source: `Screener.in data at the NSE close on ${ASOF_TXT} (Meesho market value on Screener's issued shares), GAM Research` } },
  ],
};

module.exports = { rating, headline, coverArguments, street, valuation, mofsl, jef };
