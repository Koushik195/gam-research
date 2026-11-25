// Acutaas Chemicals report, part 5c: the street view (notes standing on 30-Sep-2026), the P/E users' multiple on our EPS,
// critiques.
const X = require('./ACUTAAS.ctx');
const { D, n0, n1, rup, ST, withTp, medTp, pll, hsie, kie, jm, sbi, idbi, drc, atOurs, rating, MULT, HB, k, SECTOR, shortDate, price, epsU, epsSep28, sep, implPeAtPrice } = X;

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street: targets ₹${n0(Math.min(...withTp.map(s => s.tp)))}-${n0(Math.max(...withTp.map(s => s.tp)))}, median ₹${n0(medTp)}; five Buys, one Accumulate, one Reduce, one Sell`,
  blocks: [
    { p: `Seven notes stood on 30-Sep-2026, all written after the Q1FY27 results. PL upgraded to Buy at ₹${n0(pll.tp)} (56x FY28E EPS, 24-Jul); Kotak Institutional Equities cut to Reduce at ₹${n0(kie.tp)} (a sum of the parts with the Nubeqa stream valued separately and the rest at 35x Jun-28E P/E, 27-Jul); IDBI Capital Buy ₹${n0(idbi.tp)} and DRChoksey Accumulate ₹${n0(drc.tp)} (late Jul); SBICAP Buy ₹${n0(sbi.tp)} (27-Aug); JM Financial resumed with Buy at ₹${n0(jm.tp)} (10-Sep); and HDFC Securities kept Sell at ₹${n0(hsie.tp)} (21-Sep). Only PL and Kotak disclose a method in what we could read, and both rest on P/E; HSIE argues against the price using the stock's ~41x five-year average forward P/E. The median target is ₹${n0(medTp)}, ${Math.round((medTp / price - 1) * 100)}% above the ₹${n0(price)} close: the street, too, sees limited upside after the run.` },
    { exhibit: { type: 'table', title: 'The street on 30-Sep-2026', head: ['Broker', 'Date', 'Rating', 'Target (₹)', 'Method', 'FY28E EPS (₹)', 'Thesis'], wide: [6], rows: [
      ...ST.map(s => [s.broker, shortDate(s.date), s.rating, n0(s.tp), s.method ? `${s.method} ${s.multiple} ${s.on}` : 'n.d.', s.eps?.FY28E ? n1(s.eps.FY28E) : '–', rup(s.thesis)]),
      { hl: true, cells: ['**GAM Research**', '30-Sep-26', `**${rating}**`, '**{{dcf.tp|num}}**', `**P/E ${MULT.base}x Sep-28E**`, `**${n1(epsU[1])}**`, 'Real step-change on one molecule; own forward P/E × the sector\'s re-rating gives far less than the price'] },
    ], source: rup(D.street.note) } },
    { exhibit: { type: 'table', title: 'What the price and the P/E users pay, on our EPS', head: ['Yardstick', 'Multiple and year', 'Our EPS for that year (₹)', 'Value (₹)'], rows: [
      ['PL', '56x FY28E', n1(epsU[1]), n0(Math.round(atOurs.pl / 10) * 10)],
      ['PL multiple on Sep-28E', '56x Sep-28E', n1(sep(epsU)), n0(Math.round(atOurs.plSep / 10) * 10)],
      ['Kotak Inst. (business ex-Nubeqa only)', '35x Jun-28E', 'n.a.', `Target ₹${n0(kie.tp)}`],
      ['The share price', `${n1(implPeAtPrice)}x Sep-28E`, n1(epsSep28), n0(price)],
      { hl: true, cells: ['**GAM**', `**${MULT.base}x Sep-28E**`, `**${n1(epsSep28)}**`, '**{{dcf.tp|num}}**'] },
    ], source: 'Broker notes; GAM' } },
    { p: `**Where we stand.** Our EPS is 7-18% below the street and our multiple well below PL's. The P/E gap matters most. Acutaas's own one-year-forward P/E since Apr-2022 has a median of ${n1(HB.med)}x; pharma peers re-rated ${SECTOR}% above their medians over the same window; ${n1(HB.med)}x × ${k.toFixed(3)} gives ${MULT.base}x. The street pays ~50-56x because it treats FY26's step-change as the new base and extrapolates ~20-25% growth from there; our rule pays the stock's own history, which includes years when the market valued a lower-margin business. Both are honest views; the rule's result is a ${rating}.` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument'], rows: D.critiques.map(c => [rup(c)]), source: 'Broker notes, earnings calls and filings to 30-Sep-2026' } },
  ],
};

module.exports = { street };
