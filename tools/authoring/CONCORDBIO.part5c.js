// Concord Biotech report, part 5c: the street as it stood on 30-Sep-2026, and the bear critiques with our answers.
const X = require('./CONCORDBIO.ctx2');
const { D, ST, CONS, n0, n1, price, epsU, sep, shortDate, medTp, rating, MULT } = X;
const atOurs = (m, on) => (m && on === 'FY28E' ? n0(parseFloat(m) * epsU[1]) : '–');

const street = {
  id: 'street', nav: 'Street view & critiques', kicker: 'Street', title: `The street: two Buys, one Add, two Holds; targets ₹1,190-1,645 (median ₹${n0(medTp)}); both disclosed methods are P/E on FY28E`,
  blocks: [
    { exhibit: { type: 'table', title: 'Broker views standing on 30-Sep-2026 (pre-bonus ₹)', head: ['Broker', 'Date', 'Rating', 'Target (₹)', 'Previous (₹)', 'Method', 'At our FY28E EPS (₹)', 'Thesis'], wide: [7], rows: [
      ...ST.map(s => [s.broker, shortDate(s.date), s.rating, n0(s.tp), s.prevTp ? n0(s.prevTp) : '–', s.method ? `${s.method} ${s.multiple} ${s.on}` : 'n.d.', atOurs(s.multiple, s.on), s.thesis]),
      { hl: true, cells: ['**GAM Research**', '30-Sep-26', `**${rating}**`, '**{{dcf.tp|num}}**', '–', `**P/E ${MULT.base}x Sep-28E**`, '–', 'Own median since Jan-2024 × the pharma move over the same window'] },
    ], source: `${D.street.note} n.d. = method not disclosed in the sources we could read.` } },
    { p: `**Consensus.** S&P Global's poll on 22-Jul-2026 (five analysts; four Buy, one Hold) had a mean target of ₹${n0(CONS.meanTp)} (range ₹${n0(CONS.lowTp)}-${n0(CONS.highTp)}), below the then price; Choice's Aug-2026 upgrade to ₹1,645 came after it. The street has been cutting: Citi from ₹1,680 to ₹1,190, Jefferies from ₹1,500 to ₹1,290, Choice down to ₹1,045 in June before raising to ₹1,645 after Q1FY27. At our FY28E EPS of ₹${n1(epsU[1])}, Choice's 40x is worth ₹${n0(40 * epsU[1])} and Antique's 25x ₹${n0(25 * epsU[1])}. **Our target is far above every broker** because our multiple comes from Concord's own trading history (median ${n1(X.HB.med)}x forward), not from a judgement about what the stock deserves.` },
    { h: 'The bear case, and our answers' },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Critique', 'Our answer'], wide: [0, 1], rows: D.critiques.map((c, i) => [c, [
      'Partly accepted. Gross margins rose and no inventory was written off, which argues against lost share; but we haircut management\'s growth and margin targets.',
      'Accepted. We hold FY28-29E margins 1.5-2 points below management\'s 40%.',
      'Accepted. The engine holds working capital at 61% of sales; an unwind is upside to cash, not in our numbers.',
      `Accepted. We assume breakeven only in FY28E and a 38% margin, not 40%.`,
      'A real risk we cannot model; we assume no acquisition.',
      `Accepted in part. On our rule the stock is cheap against its own history (${n1(X.fwdNow)}x FY28E vs a ${n1(X.HB.med)}x median), but that history is short and was set when the market expected much higher earnings.`,
    ][i]]), source: 'GAM Research' } },
    { callout: `**Where we differ from the street:** not on the business (our FY28E EPS is ${Math.round((1 - epsU[1] / X.choice.eps.FY28E) * 100)}% below Choice's), but on the multiple. Brokers apply 25-40x FY28E; our rule reads Concord's own forward median since Jan-2024 (${n1(X.HB.med)}x), which is high because the market paid ${Math.round(X.HFY[2026].min)}-${Math.round(X.HFY[2026].max)}x the FY26 EPS that then arrived. At ₹${n0(price)} the price is ${n1(price / sep(epsU))}x our Sep-28E EPS.` },
  ],
};

module.exports = { street };
