// Reliance report, part 7: multiple derivation, sensitivity rows, DCF detail, peers, risks and the honest summary.
const X = require('./RELIANCE.ctx');
const { V, F, n0, n1, pc, price, shares, E, MULT, VAL, sotpAt, streetMult, dcfRows, DCF, dcfTp, dcfSens, dcfClaims, B, ASOF_TXT, medTp, rating, buyBelow, sellAbove, FM, mv } = X;
const D = VAL.D, NM = VAL.NAMES;
const rowTxt = d => d.rows.map(r => `${NM[r.sym]} ${n1(r.med)}x${r.troughs.length ? ` (ex ${r.troughs.join(', ')})` : ''}`).join(', ');
const mvTxt = d => d.rows.map(r => `${NM[r.sym]} ${pc(r.evMove)}${r.excluded ? ' (excluded)' : ''}`).join(', ');
const step = (k, lab) => [`${lab}: level`, `Median one-year-forward EV/EBITDA, Apr-2021 to Mar-2025: ${rowTxt(D[k])}. Median of the set ${n1(D[k].level)}x (25th percentile ${n1(D[k].p25)}x)`, `${n1(D[k].level)}x`];
const stepMv = (k, lab) => [`${lab}: sector move`, `Trailing EV/EBITDA on ${ASOF_TXT} vs five-year median: ${mvTxt(D[k])}; median ${pc(D[k].move)} (P/E analogue ${pc(D[k].movePe)})`, `x ${(1 + D[k].move / 100).toFixed(3)} = ${n1(D[k].level * (1 + D[k].move / 100))}x → **${D[k].mult.base}x**`];

const derivation = {
  id: 'derivation', nav: 'Multiple derivation', kicker: 'Valuation detail', title: 'Deriving the multiples: each business priced like its listed peers, as they trade today',
  blocks: [
    { exhibit: { type: 'table', title: 'Deriving the segment multiples (house rule, PLAYBOOK §4 and §7c)', head: ['Step', 'Evidence', 'Result'], wide: [1], rows: [
      ['1. Own history', `RIL's own forward EV/EBITDA median since Apr-2021 is ${n1(VAL.own.med)}x (trailing ${pc(VAL.ownMove.evMove)} vs its five-year median at ${ASOF_TXT}); forward P/E median ${n1(FM.median)}x, no trough years. It is a blend of businesses with very different multiples, so it cannot price a segment.`, 'Cross-check only'],
      step('o2c', '2. O2C'), stepMv('o2c', '3. O2C'),
      step('jio', '4. Jio'), stepMv('jio', '5. Jio'),
      step('ret', '6. Retail'), stepMv('ret', '7. Retail'),
      ['8. E&P (broker-anchored)', 'BOBCAPS 4.5x, MOSL 5.0x, Emkay 6.0x. ONGC and Oil India consolidate refineries (HPCL and MRPL; NRL), so their history is not an E&P multiple', `**${MULT.ep.base}x** (bull ${MULT.ep.bull}x, bear ${MULT.ep.bear}x)`],
      ['9. New Energy, JioStar, RCPL', 'New Energy at the ₹75,000 cr committed capital (1.0x; street 1-2x); JioStar at the Nov-2024 merger value; RCPL at MOSL\'s value (only one disclosed)', 'Fixed values'],
      ['10. Bull / bear', 'Bull: no sector move. Bear: median of the peers\' 25th percentiles, with the move', `O2C ${MULT.o2c.bull}x / ${MULT.o2c.bear}x; Jio ${MULT.jio.bull}x / ${MULT.jio.bear}x; Retail ${MULT.ret.bull}x / ${MULT.ret.bear}x`],
      ['11. Against the street', `Street medians: O2C ${VAL.streetMed('o2c')}x, E&P ${VAL.streetMed('ep')}x, Jio ${VAL.streetMed('jio')}x, Retail ${VAL.streetMed('ret')}x. The street pays a premium to peers for RIL's integration (O2C), Jio's leadership and the IPO, and Retail's scale`, `Our numbers at street multiples: ₹${n0(streetMult)}`],
    ], source: `Screener.in prices, EBITDA and balance sheets to ${ASOF_TXT}; RELIANCE.val.js. EV = market value + borrowings (incl. leases; Bharti's include spectrum dues) + minority interest − cash − investments. Sector moves use EV/EBITDA because the segments are valued on EV/EBITDA (as TORNTPHARM).` } },
    { exhibit: { type: 'table', title: 'Views we did not put in the base (sensitivity rows only)', head: ['View', 'What it changes', 'Value / share (₹)'], wide: [0, 1], rows: [
      ['Street median multiples', `O2C ${VAL.streetMed('o2c')}x, E&P ${VAL.streetMed('ep')}x, Jio ${VAL.streetMed('jio')}x, Retail ${VAL.streetMed('ret')}x`, n0(streetMult)],
      ['Jio at the street\'s 12x (≈ the IPO talk of ~US$130-137 bn)', 'Jio only', n0(sotpAt({ jio: 12 }))],
      ['MOSL\'s 25% holding discount on the Jio stake', 'Jio attributable value x 0.75', n0(sotpAt({ jioDisc: 0.25 }))],
      ['P/E analogue of the sector moves', `O2C ${D.o2c.multPe}x, Jio ${D.jio.multPe}x, Retail ${D.ret.multPe}x`, n0(sotpAt({ o2c: D.o2c.multPe, jio: D.jio.multPe, ret: D.ret.multPe }))],
      ['No sector move', `O2C ${MULT.o2c.bull}x, Jio ${MULT.jio.bull}x, Retail ${MULT.ret.bull}x`, n0(sotpAt({ o2c: MULT.o2c.bull, jio: MULT.jio.bull, ret: MULT.ret.bull }))],
      ['O2C at the refiners\' move with HPCL included', `Move ${pc(D.o2c.moveAll)}`, n0(sotpAt({ o2c: VAL.half(D.o2c.level * (1 + D.o2c.moveAll / 100)) }))],
      ['New Energy at 2x committed capital (Emkay, PL)', '+₹75,000 cr', n0(sotpAt({ ne: 2 }))],
      ['Each 1x on O2C / Jio / Retail', 'Sep-28E EBITDA x 1 (attributable)', `${n0(E.o2c / shares)} / ${n0(E.jio * 0.6643 / shares)} / ${n0(E.ret * 0.8356 / shares)}`],
    ], source: 'GAM Research. Per PLAYBOOK §7c, these views are shown, not added to the base multiples.' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF (ours): engine free cash flow without the working-capital release (₹ crore)', head: ['Year', 'Revenue', 'EBITDA margin', 'FCFF (engine)', 'WC release removed', 'FCFF (ours)'], rows: dcfRows.map(r => [r.year, n0(r.sales), n1(r.margin) + '%', n0(r.fcff), n0(r.dWc), n0(r.fcffOwn)]), source: 'GAM Research. Tax line includes minorities, so FCFF is roughly RIL\'s share.' } },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore'], rows: [['PV of FY28-37E FCFF', n0(DCF.pv)], ['PV of terminal value (g 5%)', n0(DCF.tv)], ['Net debt Mar-27E (bridge), spectrum dues and leases, plus investments at book', n0(dcfClaims)], ['Equity value', n0(DCF.eq)], { hl: true, cells: ['**12-month DCF value per share (rounded)**', `**₹${n0(dcfTp)}**`] }, ['Terminal value share of EV', Math.round(DCF.tv / DCF.ev * 100) + '%']], source: 'GAM Research; WACC 11% (engine cost of equity with beta 0.75)' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): WACC down the side, terminal growth across', head: ['WACC \\ g', ...dcfSens.gs.map(g => n1(g) + '%')], rows: dcfSens.ws.map((w, i) => [n1(w) + '%', ...dcfSens.grid[i].map(n0)]), source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Listed peers at the 30-Sep-2026 close', head: ['Company', 'Set', 'Market value (₹ cr)', 'P/E (x)', 'EV/EBITDA (x)', 'vs 5-yr median EV/EBITDA', 'Fwd EV/EBITDA median since 2021'], rows: [
      ...Object.entries(D).flatMap(([k, d]) => d.rows.map(r => [NM[r.sym] + (r.excluded ? ' (move excluded)' : ''), d.label, n0(VAL.P[r.sym].mcapCr), n1(r.pe), n1(r.ev), pc(r.evMove), n1(r.med) + 'x'])),
      { hl: true, cells: ['**Reliance**', 'Group', n0(VAL.P.RELIANCE.mcapCr), n1(VAL.P.RELIANCE.pe), n1(VAL.P.RELIANCE.evEbitda), pc(VAL.ownMove.evMove), n1(VAL.own.med) + 'x'] },
    ], source: `Screener.in trailing multiples scaled to the NSE close on ${ASOF_TXT}; forward medians from RELIANCE.val.js` } },
  ],
};

const risks = {
  id: 'risks', nav: 'Risks & summary', kicker: 'Risks and the honest summary', title: `${rating}: a fair price for good businesses; the Jio IPO is the event that could prove us too cautious`,
  blocks: [
    { exhibit: { type: 'table', title: 'Risks to our view', head: ['Risk', 'Direction', 'What it would do'], wide: [2], rows: [
      ['Jio IPO priced near the street\'s 12x', 'Upside', `Target ~₹${n0(sotpAt({ jio: 12 }))}; a listed Jio also re-rates the parent's stake if the market does not apply a holding discount`],
      ['Tariff increase in FY27', 'Upside', `Every 10% on ARPU adds ~₹${n0(X.C.q1fy27.jio.opRev * 4 * 0.1 * 0.9 / 1000)}K cr of Jio EBITDA (Q1FY27 operating revenue run-rate, ~90% flow-through): ~₹${n0(X.C.q1fy27.jio.opRev * 4 * 0.1 * 0.9 * MULT.jio.base * 0.6643 / shares)} a share at our multiple`],
      ['Hormuz stays shut, cracks hold', 'Upside', `FY28E O2C EBITDA held at FY27E's ₹${n0(X.seg('o2c').adjEbitda[0])} cr; our bull case adds 1pt of O2C margin`],
      ['Ceasefire and fast normalisation; export duties linger', 'Downside', `O2C margin 1.5 points lower (our bear case): −₹${n0(X.sep(X.seg('o2c').revenue) * 0.015 * MULT.o2c.base / shares)} a share at our multiple`],
      ['Retail\'s hyper-local spend does not pay back', 'Downside', 'Flat EBITDA to FY29E: −₹100+ a share at our multiple'],
      ['New Energy cost overruns or Chinese price competition', 'Downside', 'Value at 0.5x cost: −₹28 a share; more capex funded by debt'],
      ['Capex keeps absorbing cash', 'Downside', 'Net debt rises instead of falling; holding-company discounts widen'],
    ], source: 'GAM Research' } },
    { h: 'The honest summary' },
    { p: `**What you buy:** India's best telecom franchise, its largest retailer and a world-scale refinery, plus options on media, consumer brands and clean energy, run by a management that executes. **What you pay:** ₹${n0(price)}, ${n1(price / X.sep(F.eps))}x Sep-28E EPS, a ${pc((price / X.FM.median / X.sep(F.eps) - 1) * 100)} discount to its own forward P/E history, but roughly what the parts are worth if each is priced like its listed peers are priced today. **Why not a BUY:** the street's ₹${n0(medTp)} needs Jio at 12x, Retail at ~30x and O2C at ~7x when Bharti, the listed retailers and the refiners have all de-rated; and the group still turns record EBITDA into thin free cash flow. **Why not a SELL:** our earnings are in line with the street, the balance sheet is strong, and the Jio IPO could re-price the largest part. **How we would act:** ${rating} at {{dcf.tp|inr}}; we would buy below ₹${n0(buyBelow)} and sell above ₹${n0(sellAbove)}, and we will revisit when the Jio IPO is priced.` },
  ],
};

module.exports = { derivation, risks };
