// Neuland Laboratories report, part 5c: the street view (notes standing on 30-Sep-2026), the street multiples on our numbers,
// critiques.
const X = require('./NEULANDLAB.ctx2');
const { D, n0, n1, rup, ST, withTp, medTp, CONS, gs, nuv, unk, bk, rating, MULT, HB, k, SECTOR, shortDate, price, epsU, epsSep28, implPeAtPrice, evStreet, ebitdaSep } = X;

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street: Buy-rated, targets ₹${n0(Math.min(...withTp.map(s => s.tp)))}-${n0(Math.max(...withTp.map(s => s.tp)))}; most brokers that disclose a method use P/E`,
  blocks: [
    { p: `Neuland is thinly covered and the notes are hard to see from outside. The latest we could find: **Goldman Sachs** kept Buy and raised its target to ₹${n0(gs.tp)} after Q4FY26 (13-May-2026), expecting 20%+ revenue and 25%+ EBITDA growth a year over FY26-28E; Goldman values its Indian CRO/CDMO coverage on a sum of the parts based on P/E. **Nuvama** rated it Buy at ₹${n0(nuv.tp)} on **48x H1FY28E EPS** (9-Dec-2025; it initiated in Sep-2025 at 44x Sep-27E). A broker reported by Business Standard after Q1FY27 (6-Aug-2026) kept Buy at ₹${n0(unk.tp)} on **30x Jun-28E EV/EBITDA**. An older B&K Securities note (Oct-2024) used 38x FY27E P/E. S&P Global's consensus on 31-Jul-2026 (four analysts) was Strong Buy with a mean target of ₹${n0(CONS.meanTp)} (₹${n0(CONS.lowTp)}-${n0(CONS.highTp)}). Of the methods we could see, three are P/E and one EV/EBITDA, so we value on **P/E** and use EV/EBITDA as a cross-check. JM Financial and ICICI Securities also cover the stock; we could not find their notes.` },
    { exhibit: { type: 'table', title: 'The street on 30-Sep-2026 (latest notes found)', head: ['Broker', 'Date', 'Rating', 'Target (₹)', 'Method', 'FY28E EPS (₹)', 'Thesis'], wide: [6], rows: [
      ...ST.map(s => [s.broker, shortDate(s.date), s.rating, n0(s.tp), s.method ? `${s.method} ${s.multiple} ${s.on}` : 'n.d.', s.eps?.FY28E ? n1(s.eps.FY28E) : '–', rup(s.thesis)]),
      ['S&P Global consensus (4 analysts)', shortDate(CONS.date), CONS.rating, `${n0(CONS.meanTp)} (mean)`, '–', '–', `Range ₹${n0(CONS.lowTp)}-${n0(CONS.highTp)}`],
      { hl: true, cells: ['**GAM Research**', '30-Sep-26', `**${rating}**`, '**{{dcf.tp|num}}**', `**P/E ${MULT.base}x Sep-28E**`, `**${n1(epsU[1])}**`, 'Real CDMO step-up on a few molecules; own forward P/E × the sector\'s re-rating is far below the price'] },
    ], source: rup(D.street.note) } },
    { exhibit: { type: 'table', title: 'What the price and the street\'s multiples pay, on our numbers', head: ['Yardstick', 'Multiple and year', 'Our number for that year', 'Value (₹)'], rows: [
      ['Nuvama', '48x H1FY28E', `Sep-28E EPS ₹${n1(epsSep28)} (one-year-forward EPS at our target date; H1FY28E played that role in Nuvama's Dec-2025 note)`, n0(Math.round(48 * epsSep28 / 10) * 10)],
      ['Nuvama multiple on FY28E', '48x FY28E', `₹${n1(epsU[1])}`, n0(Math.round(48 * epsU[1] / 10) * 10)],
      ['EV/EBITDA user (Aug-2026)', '30x Jun-28E EBITDA', `Sep-28E EBITDA ₹${n0(ebitdaSep)} cr + net cash`, n0(evStreet)],
      ['The share price', `${n1(implPeAtPrice)}x Sep-28E`, `₹${n1(epsSep28)}`, n0(price)],
      { hl: true, cells: ['**GAM**', `**${MULT.base}x Sep-28E**`, `**₹${n1(epsSep28)}**`, '**{{dcf.tp|num}}**'] },
    ], source: 'Broker notes; GAM' } },
    { p: `**Where we stand.** On the street's own multiples our numbers give roughly today's price (₹${n0(Math.round(48 * epsSep28 / 10) * 10)} at Nuvama's 48x; ₹${n0(evStreet)} at 30x EV/EBITDA), so the gap is the multiple, not the earnings. Neuland's own one-year-forward P/E since Apr-2021 has a median of ${n1(HB.med)}x; pharma peers trade ${SECTOR}% above their five-year medians; ${n1(HB.med)}x × ${k.toFixed(3)} gives ${MULT.base}x. The street pays ~45-50x because it treats the FY24-26 step-ups as the new base and expects ~20% growth from here; our rule pays the stock's own history, in which the market repeatedly paid less because it could not see the next molecule coming. The rule's answer is a ${rating}.` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument'], rows: D.critiques.map(c => [rup(c)]), source: 'Broker notes, earnings calls, filings and CRISIL to 30-Sep-2026' } },
  ],
};

module.exports = { street };
