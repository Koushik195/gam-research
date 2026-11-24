// Nykaa report, part 5: street view, valuation (sum of the parts, multiple derivation, cross-checks,
// scenarios, peers), rating and the cover arguments. Multiples are derived here and checked against
// assumptions.json (the build fails if they drift apart).
const C = require('./NYKAA.ctx');
const { ratingFor } = require('../../src/ratings');
const { streetBlocks } = require('./valuation-blend');
const { n0, n1, D, M, V, F, S, A26, q1, price, mcap, PB, PF, PO, PC, PM, impliedFX, impliedBX, roll, median, PR, drPe, sectorDr, FM, ASOF_TXT } = C;
const ST = D.street, SB = ST.brokers;
const rating = ratingFor(V.upside);
const VP = M.forecast.assumptions.valuation.parts;

// ---- derivation of the segment multiples (§4 / §7c; Eternal / Swiggy precedent) ----
const BEAUTY_STREET = [['MOFSL', 50, 'FY28E Beauty EBITDA'], ['JM Financial (DCF-implied)', 45, 'FY29E group EBITDA'], ['HSIE (DCF-implied, pre-Q1)', 60, 'Jun-28E group EBITDA']];
const bMed = median(BEAUTY_STREET.map(x => x[1])), bX = Math.round(bMed * 2) / 2;
const fRev = roll('fashion', 'revenue');
const FASH_EV = [['MOFSL (DCF)', 24900], ['Elara (4x sales on our Sep-28E Fashion revenue)', Math.round(4 * fRev)]];
const fMedEv = median(FASH_EV.map(x => x[1])), fX = Math.round(fMedEv / PF.metric * 10) / 10;
const fBull = Math.round(FASH_EV[0][1] / PF.metric * 10) / 10, fBear = Math.round(FASH_EV[1][1] / PF.metric * 10) / 10;
if (bX !== PB.mult || fX !== PF.mult || fBull !== VP[1].multiple.bull || fBear !== VP[1].multiple.bear) throw new Error(`multiples not derived: Beauty ${bX} vs ${PB.mult}; Fashion ${fX}/${fBull}/${fBear} vs ${PF.mult}/${VP[1].multiple.bull}/${VP[1].multiple.bear}`);
const drSens = bX * (1 + sectorDr / 100);
const pctTxt = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const dcfV = V.blend.methods[1], evV = V.blend.methods[2];

const headline = rating === 'BUY' ? 'India\'s beauty leader is growing faster and earning more: buy' : rating === 'SELL' ? 'India\'s beauty leader, priced beyond what it can earn' : 'India\'s beauty leader is accelerating and finally profitable, but the price already pays for it';
const coverArguments = [
  { h: 'Beauty: the profitable leader, growing faster again', p: `Beauty GMV rose ${q1.bGmvYoY}% in Q1FY27 (NSV +${n0(q1.bNsvYoY)}%; group revenue growth was the fastest in 13 quarters) at a ${q1.bEbitdaPctNsv}% EBITDA margin on NSV. Owned brands (House of Nykaa, ₹1,700 cr of NSV in FY26) and premium global brands lift the gross margin; 324 stores add reach. We assume 25-27% GMV growth, the low end of the FY30 ambition.` },
  { h: 'Fashion has turned the corner, but is not yet a profit engine', p: `Fashion GMV +${n0(q1.fGmvYoY)}% in Q1FY27 and EBITDA at breakeven for a second quarter, after a ₹93 cr loss in FY25, as marketing fell from 28% to 23% of NSV. The Nike partnership (from Feb-2026) flatters growth until Q4FY27. We value Fashion at ${PF.mult}x Sep-28E GMV.` },
  { h: 'Profit is finally scaling, with almost no dilution', p: `EBITDA +68% and profit ₹${q1.pat} cr in Q1FY27; cash from operations ₹644 cr in FY26 against capex of ₹154 cr. ESOP cost was only ₹17 cr in FY26, unlike most Indian internet peers. But depreciation, interest and a 38% tax rate leave net profit at ~3% of revenue, so EPS stays small: {{F.eps.0|n2}} in FY27E.` },
  { h: 'Valuation: fair, with the target just short of a Buy', p: `Our sum of the parts (Beauty ${PB.mult}x Sep-28E EBITDA, the street's median; Fashion ${PF.mult}x GMV) gives {{dcf.tp|inr}}, {{dcf.upside|chg}}. With Fashion at our value, the price implies ~${Math.round(impliedBX)}x Beauty's Sep-28E EBITDA. Our DCF at a 12.5% cost of equity gives only ₹${n0(dcfV.value)}: the street multiples assume very long, fast growth. Street median target ₹${n0(ST.summary.medianTp)}.` },
];

// ---------------------------------------------------------------- Street
const cur = SB.filter(b => !b.stale), stale = SB.filter(b => b.stale);
const mshort = b => (/SOTP/.test(b.method) ? 'SOTP' : /DCF/.test(b.method) ? 'DCF' : 'n.d.');
const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street: ${ST.summary.buy} Buys, 1 Neutral after Q1FY27; median target ₹${n0(ST.summary.medianTp)}`,
  blocks: [
    { exhibit: { type: 'table', title: 'Broker calls standing on 30-Sep-2026', head: ['Broker', 'Rating', 'Target (₹)', 'Date', 'Method'], wide: [0], rows: [
      ...cur.map(b => [b.short, b.rating, n0(b.tp), b.date, mshort(b)]),
      ...stale.map(b => [`${b.short} (pre-Q1, stale)`, b.rating, n0(b.tp), b.date, mshort(b)]),
    ], source: 'Broker notes and press reports published on or before 30-Sep-2026; n.d. = not disclosed. Stale calls are kept out of the median.' } },
    { pair: [
      { type: 'hbar', title: `Targets range from ₹${ST.summary.lowTp} to ₹${ST.summary.highTp}; we are at the low end`, unit: '₹ per share', x: [...cur.map(b => b.short), 'GAM (base)'], series: [{ name: 'Target', values: [...cur.map(b => b.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes, GAM Research' },
      { type: 'hbar', title: 'What brokers pay for Beauty', unit: 'EV/EBITDA multiple (x)', x: [...BEAUTY_STREET.map(x => x[0]), 'GAM (base)'], series: [{ name: 'Multiple', values: [...BEAUTY_STREET.map(x => x[1]), PB.mult], fmt: 'x' }], labels: 'all', highlight: 'GAM (base)', source: 'MOFSL (4-Aug-2026), JM Financial (5-Aug-2026), HSIE (22-Jun-2026), GAM Research' },
    ] },
    { p: `After Q1FY27 the street turned almost uniformly positive: ${ST.summary.buy} of ${cur.length} brokers with a post-Q1 call rate Nykaa a Buy or Outperform, on faster Beauty growth, the Fashion turnaround and margin expansion. MOFSL (Neutral, ₹370) likes the business but calls valuation "a key deterrent". Before the results, HSIE was at Sell (₹220, DCF), arguing that the FY30 ambitions are lofty. The median post-Q1 target is ₹${n0(ST.summary.medianTp)}. Brokers that disclose a method use a sum of the parts (MOFSL, Nuvama, Elara) or a DCF (JM Financial, HSIE); Beauty is valued at 45-60x EV/EBITDA or 75x P/E (Elara), Fashion at a DCF value (MOFSL ₹24,900 cr) or 4x sales (Elara).` },
    { exhibit: { type: 'table', title: 'GAM vs MOFSL estimates (the only post-Q1 forecasts published in full)', head: ['', 'GAM FY27E', 'MOFSL FY27E', 'GAM FY28E', 'MOFSL FY28E'], rows: [
      ['Revenue (₹ cr)', '{{F.sales.0|num}}', '13,428', '{{F.sales.1|num}}', '17,403'],
      ['EBITDA (₹ cr)', '{{F.ebitda.0|num}}', '1,256', '{{F.ebitda.1|num}}', '1,755'],
      ['EPS (₹)', '{{F.eps.0|n2}}', '1.75', '{{F.eps.1|n2}}', '2.94'],
    ], source: 'MOFSL 1QFY27 result update (4-Aug-2026), GAM Research estimates' } },
    { p: 'We are below MOFSL on revenue (we grow Beauty GMV at 27% and keep revenue at ~61% of GMV, in line with Q1FY27) and on margins (we add ~0.4pp of GMV a year in Beauty and assume Fashion reaches only ~3% of NSV in FY28E). No as-of consensus capture was available, so we compare with the one broker whose full model we read.' },
  ],
};

// ---------------------------------------------------------------- Valuation
const vrow = (p, i) => [p.name, VP[i].metricLabel || '', p.metric != null ? n0(p.metric) : '–', p.mult ? `${p.mult}x` : '–', p.adj ? n0(p.adj) : '–', `{{dcf.sotp.parts.${i}.value|num}}`, `{{dcf.sotp.parts.${i}.perShare|num}}`];
const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: 'Valuation: sum of the parts, the street\'s method, gives {{dcf.tp|inr}}',
  blocks: [
    ...streetBlocks('NYKAA', {
      rating, noOurEps: true,
      streetIntro: 'Brokers value Nykaa **part by part (sum of the parts)** or with a DCF: Beauty on EV/EBITDA (45-60x, FY28E-FY29E) or P/E (Elara 75x), Fashion on a DCF or a sales multiple, plus net debt. A plain P/E is not useful: profit is only ~3% of revenue, so the own forward P/E has rarely been below 100x. We use the same method as for Eternal and Swiggy, so the internet reports can be compared.',
      street: [
        ['Elara', 'Buy', 475, 'SOTP', 'BPC 75x P/E', 'n.d.', 'Fashion 4x sales'],
        ['Nuvama', 'Buy', 414, 'SOTP', 'n.d.', '–', 'Switched from DCF; components not disclosed'],
        ['Nomura', 'Buy', 411, 'n.d.', '–', '–', 'Margin levers starting to work'],
        ['Jefferies', 'Buy', 400, 'n.d.', '–', '–', 'Strong beat; valuation elevated'],
        ['JM Financial', 'n.d. (positive)', 395, 'DCF (Jun-27)', '45x EV/EBITDA implied', 'FY29E', 'Margins raised 30-70bp'],
        ['HSBC', 'Buy', 380, 'n.d.', '–', '–', 'Third quarter of 150bp+ margin gain'],
        ['CLSA', 'Outperform', 376, 'n.d.', '–', '–', 'Owned brands support margins'],
        ['MOFSL', 'Neutral', 370, 'SOTP', 'BPC 50x EV/EBITDA', 'FY28E', 'Fashion DCF ₹87/sh; valuation a deterrent'],
        ['HSIE (Jun-2026)', 'Sell', 220, 'DCF', '60x EV/EBITDA implied', 'Jun-28E', 'Pre-Q1, stale: ambitions lofty'],
      ],
      ourThesis: `Beauty ${PB.mult}x Sep-28E EBITDA; Fashion ${PF.mult}x Sep-28E GMV; others' losses; net debt; Dot & Key minority`,
      streetSource: 'Broker notes published on or before 30-Sep-2026 (MOFSL and HSIE PDFs read directly; others from press); n.d. = not disclosed',
      derivationTitle: `Our multiples: Beauty ${PB.mult}x EBITDA, Fashion ${PF.mult}x GMV, and why`,
      derivation: [
        ['1. Own forward P/E (house starting point)', `Median one-year-forward P/E since listing (Nov-2021): ${n0(FM.median)}x, excluding ${FM.troughYears.join(', ')} as a trough year (${n0(FM.medianAll)}x with it)`, 'Not meaningful: earnings were 0.2-2% of revenue for most of the window; not used'],
        ['2. The street on Beauty', BEAUTY_STREET.map(x => `${x[0]} ${x[1]}x (${x[2]})`).join('; '), `Median ${n1(bMed)}x → **${PB.mult}x** Sep-28E Beauty EBITDA; bull 60x, bear 45x`],
        ['3. Sector move (§7c)', `Internet peers with a five-year P/E history: Info Edge ${pctTxt(drPe.NAUKRI)} and IndiaMART ${pctTxt(drPe.INDIAMART)} vs their medians (median ${pctTxt(sectorDr)}). Eternal, Swiggy, Paytm and PB Fintech excluded (losses or P/E in the hundreds inside the window), as in our Eternal report`, `Not applied: the street multiples are already current (Aug-2026), not five-year averages; applying it would give ${n1(drSens)}x (sensitivity only)`],
        ['4. Fashion', `Two disclosed broker values: ${FASH_EV.map(x => `${x[0]} ₹${n0(x[1])} cr`).join('; ')}. Median ₹${n0(fMedEv)} cr`, `= **${PF.mult}x** our Sep-28E GMV (₹${n0(PF.metric)} cr); bull ${fBull}x (MOFSL), bear ${fBear}x (Elara)`],
        ['5. Consistency', `Our Eternal food multiple is 37.5x EBITDA for a 20%-growth business with no store capex; Beauty grows ~26% and earns ~10% of NSV`, `${PB.mult}x for faster growth with a smaller, store-heavy margin: consistent`],
        ['6. Smaller parts', 'GCC and international: three years of FY28E losses; Dot & Key minority at the put-option value (₹270 cr)', 'Together ~₹1-2/share'],
      ],
      crossNote: `Cross-checks: the DCF (12.5% cost of equity, 6% terminal growth, margin rising to 15%) gives ₹${n0(dcfV.value)} (${pctTxt(dcfV.vsTarget)} vs our SOTP). That gap is the honest bear case: a 50x EBITDA multiple prices in fast growth for well over a decade. EV/EBITDA at ${PB.mult}x Sep-28E group EBITDA gives ₹${n0(evV.value)} (${pctTxt(evV.vsTarget)}): Fashion's GMV is worth more than its still-small EBITDA. Each 5x on Beauty is worth ~₹${n0(PB.metric * 5 / F.shares)} a share; each 0.5x of Fashion GMV ~₹${n0(PF.metric * 0.5 / F.shares)}.`,
    }),
    { h: 'Sum of the parts in detail' },
    { p: 'We value each business on our Sep-28E forecasts (the average of FY28E and FY29E), deduct the net debt (including lease liabilities, because segment EBITDA is before rent) we expect at March 2027, and deduct the value of the Dot & Key minority that Nykaa has agreed to buy. Every input is live in the SOTP sheet of the Excel model, with Base / Bull / Bear switches.' },
    { exhibit: { type: 'table', title: 'Sum-of-the-parts valuation (base case)', head: ['Business', 'Method', 'Metric (₹ cr)', 'Multiple', 'Adjustment (₹ cr)', 'Value (₹ cr)', '₹ / share'], wide: [1], rows: [
      ...S.parts.map(vrow),
      { hl: true, cells: ['**Equity value**', '', '', '', '', n0(S.equity), n0(S.equity / F.shares)] },
      { hl: true, cells: ['**SOTP target (rounded)**', '', '', '', '', '', '{{dcf.tp|inr}}'] },
    ], source: 'GAM Research estimates' } },
    { bullets: S.parts.map((p, i) => `**${p.name}:** ${VP[i].note}`) },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Value / share', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', '{{as.scenarios.bull.narrative}}'],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Beauty GMV grows 25-27% and its margin reaches ~11.8% of NSV by FY29E (${PB.mult}x); Fashion grows 30-42% and reaches ~5% of NSV (${PF.mult}x GMV).`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', '{{as.scenarios.bear.narrative}}'],
    ], source: 'GAM Research estimates' } },
    { callout: `**Cross-check: what is the market paying for?** Market value is ~₹${n0(mcap)} cr. If Fashion is worth our ${PF.mult}x GMV, the price values Beauty at ~${Math.round(impliedBX)}x Sep-28E EBITDA, below the street's ${PB.mult}x. Put the other way, with Beauty at ${PB.mult}x the price gives Fashion only ~${n1(impliedFX)}x GMV, below Elara's bear-case 0.7x. The stock is not expensive against the street's own yardsticks; it is expensive against cash flows.` },
    { exhibit: { type: 'table', title: 'Internet peers at the 30-Sep-2026 close', head: ['Company', 'Market value (₹ cr)', 'Trailing P/E', 'Trailing EV/EBITDA', 'FY26 revenue (₹ cr)', 'FY26 EBITDA margin'], rows: ['NYKAA', 'ETERNAL', 'SWIGGY', 'NAUKRI', 'INDIAMART', 'PAYTM', 'POLICYBZR'].map(s => { const p = PR[s]; return [s === 'NYKAA' ? '**Nykaa**' : p.name.replace(/ (India )?Ltd$/, ''), n0(p.mcapCr), p.pe ? `${n1(p.pe)}x` : 'loss', p.evEbitda > 0 ? `${n1(p.evEbitda)}x` : 'n.m.', n0(p.revenue), `${p.ebitdaMargin}%`]; }), source: `Screener.in data at the NSE close on ${ASOF_TXT}, GAM Research` } },
  ],
};

module.exports = { rating, headline, coverArguments, street, valuation, BEAUTY_STREET, FASH_EV };
