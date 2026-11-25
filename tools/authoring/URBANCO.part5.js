// Urban Company report, part 5: street view, valuation (sum of the parts, multiple derivation, cross-checks, scenarios,
// peers), rating and the cover arguments. Multiples are derived in URBANCO.ctx.js (the build fails if assumptions drift).
const C = require('./URBANCO.ctx');
const { streetBlocks } = require('./valuation-blend');
const { n0, n1, n2, pc1, D, V, F, SO, AS, A26, q1, price, mcap, shares, coreSep, PI, PX, PN, PH, PC, OWN, OWN12, OWN_ALL, OWN_SEP, OWN_OCT, OWN_FY28, fwdNow,
  MULT, ALT, drMs, drPe, sectorMs, sectorPe, sectorMsM, impliedX, rating, ST, cur, medTp, PR, ASOF_TXT, mv, IHF, ihPvBase, evNow, ke } = C;
const SB = ST.brokers;
// Method, multiple and basis per broker, as disclosed (deep.json street for the full text)
const XB = { 'Goldman Sachs': ['DCF + P/E (50:50)', '~9x FY28E EV/sales', 'Sep-26 target'], 'Morgan Stanley': ['n.d.', '–', '–'], 'JM Financial': ['SOTP', '45x FY28E EBITDA (India services)', 'Jun-27'],
  Kotak: ['SOTP', 'n.d.', 'Sep-27'], BofA: ['n.d.', '–', '–'], 'Motilal Oswal': ['SOTP', '50x EBITDA (India services)', 'FY28E'], Ambit: ['DCF', 'Ke 13%, g 6%', '–'],
  UBS: ['n.d.', '–', '–'], Emkay: ['DCF-based SOTP', 'WACC 14.4%; ~57x FY28E (India services)', 'Jun-27'], Ventura: ['n.d.', '–', '–'], Mastertrust: ['n.d.', '–', '–'] };
const sepNow = evNow / coreSep;
const NM = { ETERNAL: 'Eternal', SWIGGY: 'Swiggy', NAUKRI: 'Info Edge', INDIAMART: 'IndiaMART', NYKAA: 'Nykaa', PAYTM: 'Paytm', POLICYBZR: 'PB Fintech', MEESHO: 'Meesho' };
const msList = C.NET.map(s => `${NM[s]} ${pc1(drMs[s])}`).join(', ');

const headline = 'A trusted franchise, with a costly new bet and a full price';
const coverArguments = [
  { h: 'The core is a quality business, and it is accelerating', p: `India services NTV grew ${q1.icsNtvYoYPct}% in Q1FY27, the fourth quarter of acceleration, at a ${q1.icsAePct}% of NTV margin (+170 bp). International (+${Math.round((q1.intlNtv / C.q1y.intlNtv - 1) * 100)}% NTV) and Native are profitable or close to it. Together the core earned ₹${q1.adjEbitdaExIH} cr of adjusted EBITDA in one quarter, against ₹106 cr in all of FY26.` },
  { h: 'InstaHelp is a subsidy war that will run for years', p: `The house-help service lost ₹${-q1.ihAe} cr in Q1FY27, twice what the core earned, at ₹${-q1.ihLossPerOrder} an order, against venture-funded Snabbit and Pronto. Management needs pricing to rise from ~₹150 to ~₹200 an hour and says that could take up to five years. We forecast losses of ₹380-560 cr a year to FY29E and value them at −₹${n0(ihPvBase)} cr.` },
  { h: 'Cash-rich, but supply is heavy', p: `₹${n0(q1.cash)} cr of cash and no debt mean no new money is needed on our numbers. But venture funds still own ~40% and have sold into every rally since the Mar-2026 lock-in expiry; SBI Mutual Fund has been the buyer.` },
  { h: 'Valuation: the price already assumes the good outcome', p: `At ₹${n0(price)} the market pays ${n2(fwdNow)}x next year's core NTV, against a median of ${n2(OWN.med)}x since Nov-2025, while internet stocks de-rated ${pc1(sectorMs)} over the same months. At our derived ${PI.mult}x Sep-28E core NTV, less InstaHelp losses, the sum of the parts gives {{dcf.tp|inr}} ({{dcf.upside|chg}}): ${rating}. The street's median target is ₹${n1(medTp).replace(/\.0$/, '')}.` },
];

// ---------------------------------------------------------------- Street
const isBuy = r => /buy|overweight|add/i.test(r), isSell = r => /sell|reduce|underperform|underweight/i.test(r);
const nBuy = cur.filter(b => isBuy(b.rating)).length, nSell = cur.filter(b => isSell(b.rating)).length;
const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street: ${nBuy} buys, ${cur.length - nBuy - nSell} holds, ${nSell} sells; median target ₹${n1(medTp).replace(/\.0$/, '')}`,
  blocks: [
    { exhibit: { type: 'table', title: `Broker calls standing on ${ASOF_TXT} (latest per broker)`, head: ['Broker', 'Rating', 'Target (₹)', 'Date', 'Method'], wide: [4], rows: SB.map(b => [b.short + (b.confidence === 'article-only' ? '*' : '') + (b.stale ? ' (stale)' : ''), b.rating, n0(b.tp), b.date, b.methodShort]), source: 'Broker notes and reports as published on or before 30-Sep-2026 (Business Standard broker PDFs, Business Today, Inc42, investing.com, Trendlyne, Reuters/LSEG via Zerodha). * = secondary source only; n.d. = not disclosed. Mastertrust (a week after listing) is not counted.' } },
    { pair: [
      { type: 'hbar', title: `Targets range from ₹${ST.summary.lowTp} to ₹${ST.summary.highTp}; the price sits near the median`, unit: '₹ per share', x: [...cur.map(b => b.short), 'GAM (base)'], series: [{ name: 'Target', values: [...cur.map(b => b.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes, GAM Research' },
      { type: 'column', title: 'The consensus target rose as the stock recovered', unit: 'Median (or average*) target of covering brokers, ₹', x: D.consensus.lseg.map(x => x.date), series: [{ name: 'Target', values: D.consensus.lseg.map(x => x.medianTarget ?? Math.round(x.avgTarget)), fmt: 'inr' }], labels: 'all', source: 'Reuters items citing LSEG data (via Zerodha); *27-Feb-2026 is an aggregator average' },
    ] },
    { p: `The street is split almost evenly. The bulls (UBS, Emkay, Morgan Stanley, Kotak, Ventura) argue that Urban Company is the only scaled, trusted online brand in a market less than 1% online, that core margins are heading to the 9-10% of NTV target, and that InstaHelp can become a frequency engine (UBS calls it a "Blinkit moment" for home services). The sceptics (Ambit, JM Financial, BofA) say the core grows ~18-20% a year rather than 30%, InstaHelp has poor unit economics against well-funded rivals, and the price already pays 45-60x FY28E EBITDA for the core. Most brokers use a sum of the parts with the core on EV/EBITDA (JM 45x, MOSL 50x, Emkay ~57x FY28E); Goldman Sachs and Ambit lean on a DCF. The LSEG median was ₹145 (9 brokers) on 26-Aug-2026; our table of 10 gives ₹${n1(medTp).replace(/\.0$/, '')}.` },
  ],
};

// ---------------------------------------------------------------- Valuation
const vrow = (p, i) => [p.name, AS.valuation.parts[i].metricLabel || '', p.metric != null && p.metric !== 0 ? n0(p.metric) : '–', p.mult ? `${p.mult}x` : '–', `{{dcf.sotp.parts.${i}.value|num}}`, `{{dcf.sotp.parts.${i}.perShare|n1}}`];
const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: 'Valuation: sum of the parts on order value gives {{dcf.tp|inr}}',
  blocks: [
    ...streetBlocks('URBANCO', {
      rating, noOurEps: true,
      streetIntro: 'Urban Company makes a loss, so P/E is no use. Brokers value it as a sum of the parts: the core on EV/EBITDA two years out, Native and International on sales, InstaHelp on NTV or at nil; Goldman Sachs and Ambit use a DCF. We keep the sum of the parts, but value the core on EV/NTV, the one yardstick we can derive from the stock\'s own trading (EBITDA is too small and too volatile a base), deduct the present value of InstaHelp\'s losses to breakeven (our house rule for start-up losses), and add the cash. A DCF and Goldman Sachs\' EV/sales are cross-checks.',
      street: SB.filter(b => !b.stale).map(b => [b.short, b.rating, b.tp, ...(XB[b.short] || ['n.d.', '–', '–']), b.thesis.slice(0, 110) + (b.thesis.length > 110 ? '…' : '')]),
      ourThesis: `Core ${PI.mult}x Sep-28E NTV; InstaHelp at the PV of losses; net cash`,
      streetSource: 'Broker notes as reported on or before 30-Sep-2026; n.d. = not disclosed',
      derivationTitle: `Our core multiple: ${PI.mult}x NTV, and why`,
      derivationIntro: `Urban Company listed on 17-Sep-2025 at a 57% premium to its ₹103 issue price, so its own history is short. Following our rule for recent listings (HYUNDAI, HDBFS, MEESHO), we skip the IPO-premium months: September (median ${n2(OWN_SEP.med)}x forward core NTV, peak ${n2(OWN_SEP.max)}x) and October (${n2(OWN_OCT.med)}x), until the anchor lock-in expiry, the first broker initiations and the first results as a listed company. We use every daily close from 1-Nov-2025 to ${ASOF_TXT}: ${OWN.n} closes, eleven months rather than twelve. We pair it with the sector's move over the same window.`,
      derivation: [
        ['1. Own forward P/E (house starting point)', 'Forward EPS is a loss in every year of the window (FY27E, FY28E)', 'Not usable; not applied'],
        ['2. Own EV / forward core NTV, 1-Nov-2025 to 30-Sep-2026', `Median ${n2(OWN.med)}x (25th-75th percentile ${n2(OWN.p25)}-${n2(OWN.p75)}x; range ${n2(OWN.min)}-${n2(OWN.max)}x). EV = diluted market value − (company cash − leases); NTV of India services + International + Native in the next full year (FY27E to Mar-26, FY28E from Apr-26). At ${ASOF_TXT}: ${n2(fwdNow)}x`, `Starting point ${n2(OWN.med)}x`],
        ['3. Sector move, same window (§7c, thin-peer-set rule)', `Only Info Edge and IndiaMART have a usable P/E history, too few, so we use all seven internet platforms on market value ÷ sales, the analogue of our multiple, vs their medians since 1-Nov-2025: ${msList}; median ${pc1(sectorMs)}. Meesho excluded (listed Dec-2025)`, `× ${n2(1 + sectorMs / 100)} → ${n2(OWN.med * (1 + sectorMs / 100))}x → **${PI.mult}x** (nearest 0.05x)`],
        ['4. Sensitivities (not applied)', `Two-name P/E move (Info Edge ${pc1(drPe.NAUKRI)}, IndiaMART ${pc1(drPe.INDIAMART)}; ${pc1(sectorPe)}): ${ALT.pe2}x. With Meesho in the set (${pc1(sectorMsM)}): ${ALT.withMeesho}x. Twelve months from 1-Oct-2025: ${ALT.twelve}x. Since listing: ${ALT.all}x. Apr-Sep 2026 only (FY28E NTV): ${ALT.fy28only}x. No sector move: ${MULT.bull}x`, 'Range 2.45-3.05x'],
        ['5. The street', `Brokers value the core on EV/EBITDA (JM 45x, MOSL 50x, Emkay ~57x FY28E); on our FY28E India-services adjusted EBITDA that would be ${n2(45 * C.SEG.ics.adjEbitda[1] / coreSep)}-${n2(57 * C.SEG.ics.adjEbitda[1] / coreSep)}x our Sep-28E core NTV before International and Native. Goldman Sachs uses ~9x FY28E EV/sales`, 'Shown as cross-checks; not applied'],
        ['6. Bull / bear', `Bull: own median with no sector move (${MULT.bull}x). Bear: own 25th percentile × the move (${MULT.bear}x)`, `${MULT.bull}x / ${MULT.bear}x`],
      ],
      derivationSource: 'Screener.in daily prices and market value/sales series, company NTV and cash, GAM estimates',
      crossNote: `Cross-checks: the DCF (${n1(ke)}% cost of equity, 6% terminal growth, margin fading to 22% of revenue) gives only ₹${n0(mv('dcf').value)} (${pc1(mv('dcf').vsTarget)} vs our SOTP): on our forecasts the group only reaches a meaningful profit after FY29E, and 70%+ of DCF value sits in the terminal year. Goldman Sachs' ~9x FY28E EV/sales on our FY28E revenue gives ₹${n0(mv('evs').value)} (${pc1(mv('evs').vsTarget)}), close to the price: the market is paying the street's sales multiple, not a discount for InstaHelp.`,
    }),
    { h: 'Sum of the parts in detail' },
    { p: `We value the three core businesses on our Sep-28E NTV (the average of FY28E and FY29E) at one derived multiple, deduct the present value of InstaHelp's losses after Mar-2027 (₹${n0(ihPvBase)} cr; factor ${IHF.base} on the FY28E loss) and add the net cash we expect at March 2027. Every input is live in the SOTP sheet of the Excel model, with Base / Bull / Bear switches.` },
    { exhibit: { type: 'table', title: 'Sum-of-the-parts valuation (base case)', head: ['Part', 'Method', 'Metric (₹ cr)', 'Multiple', 'Value (₹ cr)', '₹ / share'], wide: [1], rows: [
      ...SO.parts.map(vrow),
      { hl: true, cells: ['**Equity value**', '', '', '', n0(SO.equity), n1(SO.equity / F.shares)] },
      { hl: true, cells: ['**SOTP target (rounded)**', '', '', '', '', '{{dcf.tp|inr}}'] },
    ], source: `GAM Research estimates; ${n1(shares)} cr fully diluted shares` } },
    { bullets: SO.parts.map((p, i) => `**${p.name}:** ${AS.valuation.parts[i].note}`) },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Value / share', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', '{{as.scenarios.bull.narrative}}'],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `India services NTV +21% a year to FY29E and 7.8% of NTV by FY29E; InstaHelp losses ₹480 cr in FY28E falling to nil by FY32E; ${PI.mult}x Sep-28E core NTV (own median × sector move).`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', '{{as.scenarios.bear.narrative}}'],
    ], source: 'GAM Research estimates' } },
    { callout: `**What is the market paying for?** At ₹${n0(price)} the enterprise value is ~₹${n0(evNow)} cr. With InstaHelp at our (negative) value, that is ~${n2(impliedX)}x our Sep-28E core NTV (₹${n0(coreSep)} cr), against ${n2(OWN.med)}x the stock's own median since November and ${PI.mult}x in our target. Put differently, the price either gives InstaHelp a positive value (Emkay ₹28 a share, MOSL ₹10) or pays above the stock's own history for the core while internet stocks de-rated. Each 0.1x of core NTV is worth ~₹${n0(coreSep * 0.1 / shares)} a share; each year of InstaHelp losses at ₹480 cr ~₹${n0(480 / shares)}.` },
    { exhibit: { type: 'table', title: `Internet peers at the ${ASOF_TXT} close`, head: ['Company', 'Market value (₹ cr)', 'Trailing P/E', 'Trailing EV/EBITDA', 'FY26 revenue (₹ cr)', 'FY26 EBITDA margin', 'Mcap/sales vs median since Nov-25'], rows: ['URBANCO', ...C.NET, 'MEESHO'].map(s => { const p = PR[s]; return [s === 'URBANCO' ? '**Urban Company**' : NM[s], n0(s === 'URBANCO' ? mcap : p.mcapCr), p.pe > 0 && s !== 'URBANCO' ? `${n1(p.pe)}x` : 'loss', p.evEbitda > 0 ? `${n1(p.evEbitda)}x` : 'n.m.', n0(p.revenue), `${p.ebitdaMargin}%`, s === 'URBANCO' ? '–' : pc1(drMs[s])]; }), source: `Screener.in data at the NSE close on ${ASOF_TXT} (Urban Company market value on 156.2 cr diluted shares), GAM Research` } },
  ],
};

module.exports = { rating, headline, coverArguments, street, valuation, sepNow };
