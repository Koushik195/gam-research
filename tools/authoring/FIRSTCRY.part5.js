// FirstCry report, part 5: street view, valuation (sum of the parts, multiple derivation, cross-checks, scenarios, peers),
// rating and the cover arguments. Multiples are derived in FIRSTCRY.ctx.js (the build fails if assumptions drift).
const C = require('./FIRSTCRY.ctx');
const { streetBlocks } = require('./valuation-blend');
const { n0, n1, n2, pc1, D, V, F, SO, AS, A26, q1, price, mcap, shares, attSep, PI, PX, PG, PN, PEO, PC, OWN, OWN_LONG, OWN_ALL, OWN_IPO, OWN_FY27, OWN_FY28, fwdNow,
  MULT, ALT, drMs, drPe, drRetPe, SENS, sectorMs, impliedX, rating, ST, cur, medTp, medNamed, cons, PR, ASOF_TXT, mv, evNow, JM, jmX, vsIssue, NCI, EARN26 } = C;
const NM = { FIRSTCRY: 'FirstCry', ETERNAL: 'Eternal', SWIGGY: 'Swiggy', NAUKRI: 'Info Edge', INDIAMART: 'IndiaMART', NYKAA: 'Nykaa', PAYTM: 'Paytm', POLICYBZR: 'PB Fintech', MEESHO: 'Meesho', URBANCO: 'Urban Company', LENSKART: 'Lenskart' };
const msList = C.NET.map(s => `${NM[s]} ${pc1(drMs[s])}`).join(', ');
const jmGb = JM.parts.gb[3], jmGbOwn = Math.round(jmGb * (1 - NCI));

const headline = 'A leader that lost its growth, priced as if it will not get it back';
const coverArguments = [
  { h: 'India is re-accelerating on fixes FirstCry controls', p: `India multi-channel revenue grew ${q1.imcRevYoYPct}% in Q1FY27, up every quarter from 7.5% a year earlier, as its own delivery network (RocketBees, >50% of online shipments), 2-3 hour FirstCry Qwik and re-assorted stores (offline GMV +15%) took hold; ~100 new stores are planned for FY27. The specialist assortment, home brands (>58% of India GMV) and 1,188 stores are hard to copy.` },
  { h: 'But margins went the wrong way, and the loss persists', p: `A diaper price war with quick-commerce apps and higher input costs cut India gross margin ~260bp; India adjusted EBITDA fell to ${q1.imcAePct}% of revenue (8.6% a year earlier). The group still lost ₹${-q1.patOwners} cr in Q1FY27. Adjusted EBITDA flatters: it excludes ESOP cost (₹224 cr in FY26) and rent (₹255 cr).` },
  { h: 'Half of Globalbees belongs to others', p: `Minorities own 48.32% of Globalbees and FirstCry owes ₹388 cr of earn-outs to its brand founders. JM Financial values Globalbees at 100% (₹${jmGb}/share); at FirstCry's share it is worth ~₹${jmGbOwn}. We deduct both.` },
  { h: 'Valuation: below 1x sales, the stock has de-rated too far', p: `At ₹${n0(price)} (${Math.abs(Math.round(vsIssue))}% below the ₹465 IPO price) the market pays ${n2(fwdNow)}x next year's attributable sales, against a 12-month median of ${n2(OWN.med)}x, while internet peers de-rated ${pc1(sectorMs)}. At our derived ${PI.mult}x Sep-28E sales the sum of the parts gives {{dcf.tp|inr}} ({{dcf.upside|chg}}): ${rating}. The street's consensus target is ₹${n0(medTp)}.` },
];

// ---------------------------------------------------------------- Street
const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street: thin coverage, targets ₹${cons.low}-${cons.high}, consensus ₹${n0(medTp)}`,
  blocks: [
    { exhibit: { type: 'table', title: `Broker calls found, standing on ${ASOF_TXT}`, head: ['Broker', 'Rating', 'Target (₹)', 'Date', 'Method'], wide: [4], rows: ST.brokers.map(b => [b.short + (b.dateUnverified ? '*' : '') + (b.current ? '' : ' (superseded)'), b.rating, n0(b.tp), b.date, b.method.split(';')[0]]), source: 'JM Financial notes (Business Standard broker PDFs), Business Today, Inc42. JM\'s Q1FY27 update (Aug-2026) could not be found; its May note is the latest we could verify.' } },
    { pair: [
      { type: 'hbar', title: 'Named targets sit above our target; the consensus is close to it', unit: '₹ per share', x: ['JM Financial (May)', 'Morgan Stanley (May)', 'S&P consensus (Sep)', 'GAM (base)'], series: [{ name: 'Target', values: [265, 300, Math.round(medTp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes and reports; S&P Global consensus (8-Sep-2026); GAM Research' },
      { type: 'column', title: 'JM Financial\'s target: cut by 62% in 18 months', unit: 'JM Financial target price (₹)', x: ST.history.filter(h => h[1] === 'JM Financial').map(h => h[0]), series: [{ name: 'Target', values: ST.history.filter(h => h[1] === 'JM Financial').map(h => h[3]), fmt: 'inr' }], labels: 'all', source: ST.historySrc },
    ] },
    { p: `Public coverage is thin. JM Financial is the only broker whose full notes we could read: it cut its target from ₹692 (Dec-2024) to ₹260 (Apr-2026) as growth slowed, downgraded to Add, and raised it to ₹265 in May (its post-Q1 update could not be found). Morgan Stanley moved from Overweight to Equal-weight with ₹300 (May-2026). On 8-Sep-2026 S&P Global counted seven analysts with a Hold consensus and an average target of ₹${n0(medTp)} (range ₹${cons.low}-${cons.high}). JM's method is a sum of the parts on FY28E: India multi-channel and Globalbees at 20x pre-Ind AS adjusted EBITDA (after rent), Others at 15x, International at 1x sales, plus cash.` },
    { bullets: D.critiques.concat(D.streetNotes.slice(2)) },
  ],
};

// ---------------------------------------------------------------- Valuation
const vrow = (p, i) => [p.name, AS.valuation.parts[i].metricLabel || '', p.metric != null && p.metric !== 0 ? n0(p.metric) : '–', p.mult ? `${n2(p.mult)}x` : '–', `{{dcf.sotp.parts.${i}.value|num}}`, `{{dcf.sotp.parts.${i}.perShare|n1}}`];
const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: 'Valuation: sum of the parts on sales gives {{dcf.tp|inr}}',
  blocks: [
    ...streetBlocks('FIRSTCRY', {
      rating, noOurEps: true,
      streetIntro: 'FirstCry makes a loss, so P/E is no use. The street values it as a sum of the parts (JM Financial: segment EBITDA multiples for the profitable parts, sales for International). JM\'s multiples work out to roughly 1.0-1.2x sales for every segment, so we keep the sum of the parts but value each segment on EV/sales, the one yardstick we can derive from the stock\'s own trading (EBITDA is too small and too distorted by ESOP and rent to be a base). We deduct Globalbees\' minorities and earn-outs and add net cash. A DCF and the street-implied EV/EBITDA are cross-checks.',
      street: [['JM Financial (May-26)', 'Add', 265, 'SOTP', '20x / 20x / 15x pre-Ind AS adj. EBITDA; 1x sales (Intl)', 'FY28E (Mar-27 TP)', 'India GMV to pick up in FY27; GM pressure transitory'], ['Morgan Stanley (May-26)', 'Equal-weight', 300, 'n.d.', '–', '–', 'Kept EW after Q4FY26'], ['S&P consensus (8-Sep-26)', 'Hold', Math.round(medTp), '–', '–', '–', `Seven analysts; range ₹${cons.low}-${cons.high}`]],
      ourThesis: `Each segment ${PI.mult}x Sep-28E sales; Globalbees minorities and earn-outs out; net cash`,
      streetSource: 'Broker notes and reports published on or before 30-Sep-2026; n.d. = not disclosed',
      derivationTitle: `Our multiple: ${PI.mult}x sales, and why`,
      derivationIntro: `FirstCry listed on 13-Aug-2024; in its first week it traded ~44% above the ₹465 issue price, and it has fallen ~73% from there. We skip the IPO-premium months (Aug-Nov 2024: median ${n2(OWN_IPO.med)}x forward sales) and, following our rule for recent listings (HYUNDAI, HDBFS), use the last 12 months: every weekly close from 1-Oct-2025 to ${ASOF_TXT} (${OWN.n} points), paired with the sector's move over the same window.`,
      derivation: [
        ['1. Own forward P/E (house starting point)', 'Forward EPS was a loss or close to nil in every year of the window (FY26 actual, FY27E)', 'Not usable; not applied'],
        ['2. Own EV / forward attributable sales, 1-Oct-2025 to 30-Sep-2026', `Median ${n2(OWN.med)}x (25th-75th percentile ${n2(OWN.p25)}-${n2(OWN.p75)}x; range ${n2(OWN.min)}-${n2(OWN.max)}x). EV = diluted market value (53.24 cr shares) − net cash after leases + FirstCry's share of Globalbees earn-outs; sales = next full year's revenue less 48.32% of Globalbees (FY27E to Mar-26, FY28E from Apr-26). At ${ASOF_TXT}: ${n2(fwdNow)}x`, `Starting point ${n2(OWN.med)}x`],
        ['3. Sector move, same window (§7c, thin-peer-set rule)', `Only Info Edge and IndiaMART have a usable P/E history, too few, so we use all seven internet platforms on market value ÷ sales, the analogue of our multiple, vs their medians since 1-Oct-2025: ${msList}; median ${pc1(sectorMs)}. Meesho, Urban Company and Lenskart listed inside or just before the window and are excluded`, `× ${n2(1 + sectorMs / 100)} → ${n2(OWN.med * (1 + sectorMs / 100))}x → **${PI.mult}x** (nearest 0.05x)`],
        ['4. Sensitivities (not applied)', `Two-name P/E move (${pc1(SENS.pe2)}): ${ALT.pe2}x. Internet set + three recent listings (${pc1(SENS.recent)}): ${ALT.recent}x. Retail set (DMart, Trent, Metro, Bata, Page) P/E move (${pc1(SENS.retPe)}): ${ALT.retPe}x; retail market value/sales (${pc1(SENS.retMs)}): ${ALT.retMs}x. Since Dec-2024 (own ${n2(OWN_LONG.med)}x × internet move ${pc1(SENS.long)}): ${ALT.long}x. Apr-Sep 2026 only (FY28E sales): ${ALT.fy28only}x. No sector move: ${ALT.none}x`, `Range ${Math.min(...Object.values(ALT))}-${Math.max(...Object.values(ALT))}x`],
        ['5. The street', `JM Financial's May-2026 SOTP (20x pre-Ind AS EBITDA, 1x sales for International) equals ~1.0-1.2x FY28E sales per segment; its target EV is ${n1(jmX)}x its FY28E reported EBITDA`, 'Consistent with ~1.1-1.2x; EV/EBITDA used as a cross-check'],
        ['6. Bull / bear', `Bull: own median with no sector move (${MULT.bull}x). Bear: own 25th percentile × the move (${MULT.bear}x)`, `${MULT.bull}x / ${MULT.bear}x`],
      ],
      derivationSource: 'Screener.in weekly prices and market value/sales series, NSE close 30-Sep-2026, company balance sheets, GAM estimates',
      crossNote: `Cross-checks: the DCF (13.1% cost of equity, 6% terminal growth, reported EBITDA margin fading to 9%) gives only ₹${n0(mv('dcf').value)} (${pc1(mv('dcf').vsTarget)}): on our numbers FirstCry earns too little after ESOP, rent and capex for cash flows to support even today's price until margins approach 9%, and the DCF still counts all of Globalbees. The street-implied ${mv('ev').mult}x Sep-28E reported EBITDA gives ₹${n0(mv('ev').value)} (${pc1(mv('ev').vsTarget)}). Both say the same thing: the upside in our target depends on the sales multiple recovering toward the stock's own recent history, not on cash flows already visible.`,
    }),
    { h: 'Sum of the parts in detail' },
    { p: `We value each segment on our Sep-28E revenue (the average of FY28E and FY29E) at one derived multiple, deduct the 48.32% of Globalbees that belongs to other shareholders and FirstCry's share of the ₹388 cr owed to Globalbees brand founders (₹${n0(EARN26)} cr), and add the net cash (after lease liabilities) we expect at March 2027. Every input is live in the SOTP sheet of the Excel model, with Base / Bull / Bear switches.` },
    { exhibit: { type: 'table', title: 'Sum-of-the-parts valuation (base case)', head: ['Part', 'Method', 'Metric (₹ cr)', 'Multiple', 'Value (₹ cr)', '₹ / share'], wide: [1], rows: [
      ...SO.parts.map(vrow),
      { hl: true, cells: ['**Equity value**', '', '', '', n0(SO.equity), n1(SO.equity / F.shares)] },
      { hl: true, cells: ['**SOTP target (rounded)**', '', '', '', '', '{{dcf.tp|inr}}'] },
    ], source: `GAM Research estimates; ${n2(shares)} cr fully diluted shares` } },
    { bullets: [`**Operating segments (India, International, Globalbees, Others, inter-segment):** ${AS.valuation.parts[0].note}`, ...SO.parts.slice(5).map((p, i) => `**${p.name}:** ${AS.valuation.parts[i + 5].note}`)] },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Value / share', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', '{{as.scenarios.bull.narrative}}'],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `India GMV +13% a year and India adjusted EBITDA back to 8.6% of revenue in FY28E (9.2% in FY29E); International losses shrinking to ~1.5% of revenue; Globalbees ~16% growth at 5.5-6.5%; ${PI.mult}x Sep-28E sales (own 12-month median × sector move).`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', '{{as.scenarios.bear.narrative}}'],
    ], source: 'GAM Research estimates' } },
    { callout: `**What is the market paying for?** At ₹${n0(price)} the enterprise value (after leases and earn-outs) is ~₹${n0(evNow)} cr, ~${n2(impliedX)}x our Sep-28E attributable sales (₹${n0(attSep)} cr), against ${n2(OWN.med)}x the stock's own 12-month median and ${PI.mult}x in our target. Put differently, the price assumes either our forecasts are too high (India margins do not recover) or the de-rating continues. Each 0.1x of sales is worth ~₹${n0(attSep * 0.1 / shares)} a share.` },
    { exhibit: { type: 'table', title: `Internet peers at the ${ASOF_TXT} close`, head: ['Company', 'Market value (₹ cr)', 'Trailing P/E', 'Trailing EV/EBITDA', 'FY26 revenue (₹ cr)', 'FY26 EBITDA margin', 'Mcap/sales vs 12-month median'], rows: ['FIRSTCRY', ...C.NET].map(s => { const p = PR[s]; return [s === 'FIRSTCRY' ? '**FirstCry**' : NM[s], n0(s === 'FIRSTCRY' ? mcap : p.mcapCr), p.pe > 0 && s !== 'FIRSTCRY' ? `${n1(p.pe)}x` : 'loss', p.evEbitda > 0 ? `${n1(p.evEbitda)}x` : 'n.m.', n0(p.revenue), `${p.ebitdaMargin}%`, s === 'FIRSTCRY' ? '–' : pc1(drMs[s])]; }), source: `Screener.in data at the NSE close on ${ASOF_TXT} (FirstCry market value on 53.24 cr diluted shares), GAM Research` } },
  ],
};

module.exports = { rating, headline, coverArguments, street, valuation };
