// Eternal report, part 5: street view, valuation (sum of the parts, multiple derivation, cross-checks,
// scenarios, peers), rating and the cover arguments. Multiples are derived here and checked against
// assumptions.json (the build fails if they drift apart).
const C = require('./ETERNAL.ctx');
const { ratingFor } = require('../../src/ratings');
const { streetBlocks } = require('./valuation-blend');
const { n0, n1, D, M, V, F, S, A26, q1, SW, price, mcap, cashNow, PF, PQ, PG, PH, PO, PC, PL, impliedQc, impliedQcX, impliedFoodX, median, PR, drPe, MED5PE, sectorDr, FM, ASOF_TXT } = C;
const ST = D.street, SB = ST.brokers;
const rating = ratingFor(V.upside);
const ratingTxt = `${rating}`;

// ---- derivation of the segment multiples (§4 / §7c; Swiggy precedent) ----
const FOOD_STREET = [['Motilal Oswal', 35, 'basis not stated'], ['Emkay (DCF-implied)', 34.5, 'FY28E'], ['Nuvama', 40, 'FY28E (Apr-2026)'], ['Elara', 42, 'Sep-28E']];
const foodMed = median(FOOD_STREET.map(x => x[1])), foodX = Math.round(foodMed * 2) / 2;
const QC_EV = [['Elara (52x Sep-28E EBITDA)', 193440], ['Motilal Oswal (DCF)', 170372], ['Emkay (DCF)', 245200]]; // ₹ cr
const qcMedEv = median(QC_EV.map(x => x[1])), qcX = Math.round(qcMedEv / PQ.metric * 10) / 10;
const qcBear = Math.round(170372 / PQ.metric * 20) / 20;
if (foodX !== PF.mult || qcX !== PQ.mult || qcBear !== M.forecast.assumptions.valuation.parts[1].multiple.bear) throw new Error(`multiples not derived: food ${foodX} vs ${PF.mult}; Blinkit ${qcX}/${qcBear} vs ${PQ.mult}`);
const swFood = 30; // our Swiggy food multiple (published 30-Sep-2026 initiation)
const drSens = foodX * (1 + sectorDr / 100);

const headline = 'The best franchise in Indian consumer internet, fairly priced';
const coverArguments = [
  { h: 'Food delivery: the profitable leader, growing faster again', p: `Zomato's NOV grew ${q1.foodNovYoYPct}% in Q1FY27 (four quarters of acceleration) at a ${q1.foodAePctNov}% margin, near the top of the 5-6% target. It is bigger, faster-growing and roughly twice as profitable as Swiggy's food business. Price-led entrants (Toing, Ownly) are the risk to watch.` },
  { h: 'Blinkit has won the quick-commerce scale race', p: `NOV +${q1.qcNovYoYPct}% to ₹${n0(q1.qcNov)} cr, ~${n1(q1.qcNov / SW.imNov)}x Instamart; ${n0(q1.qcStores)} stores; adjusted EBITDA +₹${q1.qcAdjEbitda} cr while every rival loses money. Management raised the steady-state margin target to 6% of NOV. We assume only 3.4% by FY29E.` },
  { h: 'Self-funding, but profit is thin and the tax rate is rising', p: `Cash rose to ₹${n0(cashNow)} cr in Q1FY27; the business now pays for its own stores and inventory. But reported profit is small (₹${q1.pat} cr in Q1FY27) and tax jumped to 66% of profit before tax as the parent's past losses ran out. Our FY27E EPS ({{F.eps.0|n1}}) is well below consensus.` },
  { h: 'Valuation: fair, with Blinkit priced at ~1x order value', p: `Our sum of the parts (food ${PF.mult}x Sep-28E EBITDA, the street's median; Blinkit ${PQ.mult}x Sep-28E NOV, the median broker value) gives {{dcf.tp|inr}}, {{dcf.upside|chg}}: just short of our BUY line. Valuing the other parts as we do, the price implies ~${n1(impliedQcX)}x Blinkit's NOV. The street's median target is ₹${n0(ST.summary.medianTp)}.` },
];

// ---------------------------------------------------------------- Street
const cur = SB.filter(b => !b.stale), stale = SB.filter(b => b.stale);
const rshort = r => (/^Buy/.test(r) ? 'Buy' : /Not stated/.test(r) ? 'n.d.' : r.replace('High Conviction ', 'HC '));
const mshort = b => (b.foodMultiple ? (/DCF/.test(b.method) && !/SOTP/.test(b.method) ? 'DCF (by segment)' : 'SOTP') : /SOTP/.test(b.method) ? 'SOTP' : /DCF/.test(b.method) ? 'DCF' : /P\/E/.test(b.method) ? 'P/E (65x NTM, Mar-26)' : 'n.d.');
const nBuy = cur.filter(b => /buy|overweight|outperform/i.test(b.rating) && !/not stated/i.test(b.rating)).length;
const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street: ${nBuy} Buys and 1 Underperform after Q1FY27; median target ₹${n0(ST.summary.medianTp)}`,
  blocks: [
    { exhibit: { type: 'table', title: 'Broker calls standing on 30-Sep-2026', head: ['Broker', 'Rating', 'Target (₹)', 'Date', 'Method'], wide: [0], rows: [
      ...cur.map(b => [b.short, rshort(b.rating), n0(b.tp), b.date, mshort(b)]),
      ...stale.map(b => [`${b.short} (pre-Q1, stale)`, rshort(b.rating), n0(b.tp), b.date, mshort(b)]),
    ], source: 'Broker notes and press reports published on or before 30-Sep-2026; n.d. = not disclosed. Stale calls are kept out of the median.' } },
    { pair: [
      { type: 'hbar', title: `Targets range from ₹${ST.summary.lowTp} to ₹${ST.summary.highTp}; we are below the median`, unit: '₹ per share', x: [...cur.map(b => b.short), 'GAM (base)'], series: [{ name: 'Target', values: [...cur.map(b => b.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes, GAM Research' },
      { type: 'hbar', title: 'What brokers pay for Zomato food', unit: 'EV/EBITDA multiple on food EBITDA (x)', x: [...FOOD_STREET.map(x => x[0]), 'GAM (base)', 'GAM on Swiggy food'], series: [{ name: 'Multiple', values: [...FOOD_STREET.map(x => x[1]), PF.mult, swFood], fmt: 'x' }], labels: 'all', highlight: 'GAM (base)', source: 'Broker notes (Apr-Jul 2026), GAM Research' },
    ] },
    { p: `The street is almost uniformly positive: ${nBuy} of ${cur.length} brokers with a post-Q1 call rate Eternal a Buy (Overweight / Outperform), on the argument that Blinkit has won quick commerce and food delivery is a growing cash engine. Macquarie (Underperform, ₹190) is the lone bear: the price already discounts much of the quick-commerce opportunity. The median target is ₹${n0(ST.summary.medianTp)} (consensus from S&P Capital IQ ₹${n0(D.consensus['trendlyne_2026-09-11'].tpMedian)}). The brokers that disclose their method use a sum of the parts or a segment DCF: food at 34.5-42x EBITDA and Blinkit at ₹209-257 a share. Our Blinkit value (₹${n0(PQ.perShare)} a share) is at the low end; our food value is close to the median.` },
  ],
};

// ---------------------------------------------------------------- Valuation
const pctTxt = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const vrow = (p, i) => [p.name, M.forecast.assumptions.valuation.parts[i].metricLabel || '', p.metric != null ? n0(p.metric) : '–', p.mult ? `${p.mult}x` : '–', p.adj ? n0(p.adj) : '–', `{{dcf.sotp.parts.${i}.value|num}}`, `{{dcf.sotp.parts.${i}.perShare|num}}`];
const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: 'Valuation: sum of the parts, the street\'s method, gives {{dcf.tp|inr}}',
  blocks: [
    ...streetBlocks('ETERNAL', {
      rating: ratingTxt, noOurEps: true,
      streetIntro: 'Brokers value Eternal **part by part (sum of the parts)** or with a DCF built segment by segment: food delivery on EV/EBITDA (34.5-42x, FY28E or Sep-28E), Blinkit on EV/EBITDA (50-52x), EV/NOV or a DCF, District and Hyperpure on EV/sales, plus cash. P/E is not useful: earnings are small, the tax rate is changing and the own forward P/E has averaged over 200x. We use the same method as for Swiggy, so the two reports can be compared line by line.',
      street: [
        ['Elara', 'Buy', 400, 'SOTP', 'Food 42x, Blinkit 52x', 'Sep-28E', 'District 5x sales, Hyperpure 3x sales'],
        ['Motilal Oswal', 'Buy', 400, 'SOTP', 'Food 35x', 'n.d.', 'Blinkit DCF (WACC 12%, g 4.5%)'],
        ['Emkay', 'Buy', 400, 'DCF by segment', 'Food ~34.5x implied', 'FY28E', 'Blinkit ~1.75x FY28E NOV implied'],
        ['Nuvama (Apr-2026)', 'Buy', 380, 'SOTP', 'Food 40x, Blinkit 50x', 'FY28E', 'Pre-Q1 call, stale'],
        ['Kotak (retail)', 'Buy', 395, 'SOTP', 'n.d.', 'Sep-27', 'Components not disclosed'],
        ['Axis Securities', 'Buy', 360, 'SOTP', 'n.d.', '–', 'Components not disclosed'],
        ['JM Financial', 'Buy', 400, 'P/E (Mar-26 note)', '65x NTM', '–', 'Q1 note not seen'],
        ['Macquarie', 'Underperform', 190, 'n.d.', '–', '–', 'Price discounts much of the QC opportunity'],
      ],
      ourThesis: `Food ${PF.mult}x Sep-28E adj. EBITDA; Blinkit ${PQ.mult}x Sep-28E NOV; District, Hyperpure, new bets, net cash`,
      streetSource: 'Broker notes published on or before 30-Sep-2026 (Elara, MOFSL, Emkay PDFs read directly; others from press); n.d. = not disclosed',
      derivationTitle: `Our multiples: food ${PF.mult}x EBITDA, Blinkit ${PQ.mult}x NOV, and why`,
      derivation: [
        ['1. Own forward P/E (house starting point)', `Median one-year-forward P/E since Apr-2021: ${n1(FM.median)}x (no trough years under the house rule, but earnings were losses or near zero until FY24)`, 'Not meaningful for a business whose profit is small and whose tax rate is changing; not used'],
        ['2. The street on Zomato food', FOOD_STREET.map(x => `${x[0]} ${x[1]}x (${x[2]})`).join('; '), `Median ${n1(foodMed)}x → **${PF.mult}x** Sep-28E adjusted EBITDA`],
        ['3. Sector move (§7c)', `Internet peers with a five-year P/E history: Info Edge ${pctTxt(drPe.NAUKRI)} and IndiaMART ${pctTxt(drPe.INDIAMART)} vs their medians (median ${pctTxt(sectorDr)}). Swiggy, Paytm and PB Fintech (losses for most of the window) and Nykaa (P/E above 1,000x) excluded`, `Not applied: the street multiples are already current (Jul-2026), not five-year averages; applying it would give ${n1(drSens)}x (sensitivity only)`],
        ['4. Consistency with Swiggy', `Our Swiggy food multiple is ${swFood}x: a ~20% discount for a lower margin (3.1% of GOV vs 5.6% of NOV) and slower growth (17% vs 20%)`, `Consistent with ${PF.mult}x for the leader`],
        ['5. Blinkit', `The three disclosed broker values of Blinkit: ${QC_EV.map(x => `${x[0]} ₹${n0(x[1])} cr`).join('; ')}. Median ₹${n0(qcMedEv)} cr`, `= **${PQ.mult}x** our Sep-28E NOV (₹${n0(PQ.metric)} cr); bull 1.75x (Emkay), bear ${qcBear}x (MOFSL)`],
        ['6. Smaller parts', 'District 0.6x NOV less losses to breakeven (as Swiggy\'s out-of-home); Hyperpure 0.5x sales; Bistro/Nugget three years of losses (as Swiggy\'s new bets)', 'Together ~₹14/share'],
      ],
      crossNote: `Cross-checks: the DCF (13.1% cost of equity, 6% terminal growth) gives ₹${n0(V.blend.methods[1].value)} (${pctTxt(V.blend.methods[1].vsTarget)} vs our SOTP), because it credits Blinkit with reaching its 6% margin over 15 years; EV/EBITDA at ${M.forecast.assumptions.valuation.blend.methods[2].multiple.base}x Sep-28E group EBITDA gives ₹${n0(V.blend.methods[2].value)} (${pctTxt(V.blend.methods[2].vsTarget)}). The swing factor is Blinkit: each 0.1x of NOV is worth ~₹${n0(PQ.metric * 0.1 / F.shares)} a share.`,
    }),
    { h: 'Sum of the parts in detail' },
    { p: 'We value each business separately on our Sep-28E forecasts (the average of FY28E and FY29E), add the net cash we expect at March 2027 and add back lease liabilities (rent is already deducted in segment EBITDA). Every input is live in the SOTP sheet of the Excel model, with Base / Bull / Bear switches.' },
    { exhibit: { type: 'table', title: 'Sum-of-the-parts valuation (base case)', head: ['Business', 'Method', 'Metric (₹ cr)', 'Multiple', 'Adjustment (₹ cr)', 'Value (₹ cr)', '₹ / share'], wide: [1], rows: [
      ...S.parts.map(vrow),
      { hl: true, cells: ['**Equity value**', '', '', '', '', n0(S.equity), n0(S.equity / F.shares)] },
      { hl: true, cells: ['**SOTP target (rounded)**', '', '', '', '', '', '{{dcf.tp|inr}}'] },
    ], source: 'GAM Research estimates' } },
    { bullets: S.parts.map((p, i) => `**${p.name}:** ${M.forecast.assumptions.valuation.parts[i].note}`) },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Value / share', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', '{{as.scenarios.bull.narrative}}'],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Food grows ~18% at ~5.8% margins (${PF.mult}x); Blinkit grows ~57% a year to FY29E and reaches 3.4% of NOV (${PQ.mult}x NOV); District breaks even in FY29E.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', '{{as.scenarios.bear.narrative}}'],
    ], source: 'GAM Research estimates' } },
    { callout: `**Cross-check: what is the market paying for?** Market value is ~₹${n0(mcap)} cr. If food, District, Hyperpure, new bets and net cash are worth what we think (₹${n0(mcap - impliedQc)} cr), the market is valuing Blinkit at ~₹${n0(impliedQc)} cr, or ~${n1(impliedQcX)}x its Sep-28E NOV, against the ${PQ.mult}x median of broker values. Put the other way, with Blinkit at our value the price buys food delivery at ~${n1(impliedFoodX)}x Sep-28E EBITDA. Neither looks stretched; neither is a bargain.` },
    { exhibit: { type: 'table', title: 'Internet peers at the 30-Sep-2026 close', head: ['Company', 'Market value (₹ cr)', 'Trailing P/E', 'Trailing EV/EBITDA', 'FY26 revenue (₹ cr)', 'FY26 EBITDA margin'], rows: ['ETERNAL', 'SWIGGY', 'NAUKRI', 'INDIAMART', 'NYKAA', 'PAYTM', 'POLICYBZR'].map(s => { const p = PR[s]; return [s === 'ETERNAL' ? '**Eternal**' : p.name.replace(/ (India )?Ltd$/, ''), n0(p.mcapCr), p.pe ? `${n1(p.pe)}x` : 'loss', p.evEbitda > 0 ? `${n1(p.evEbitda)}x` : 'n.m.', n0(p.revenue), `${p.ebitdaMargin}%`]; }), source: `Screener.in data at the NSE close on ${ASOF_TXT}, GAM Research` } },
  ],
};

module.exports = { rating, headline, coverArguments, street, valuation, FOOD_STREET, QC_EV };
