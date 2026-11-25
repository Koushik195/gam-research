// Granules India report, part 5c: the street view and critiques.
const X = require('./GRANULES.ctx');
const { D, F, V, n0, n1, sep, shortDate, ST, medTp, medTpQ1, nBuy, nAcc, price, MULT, rating } = X;
const ourAt = s => { const k = parseFloat(s.multiple); if (s.method !== 'P/E' || !k) return '–'; if (/FY28/.test(s.on)) return n0(k * F.eps[1]); if (/Sep-27/.test(s.on)) return n0(k * (F.eps[0] + F.eps[1]) / 2); if (/12M/.test(s.on)) return `${n0(k * sep(F.eps))} (Sep-28E)`; return '–'; };

const street = {
  id: 'street', nav: 'Street view', kicker: 'The street', title: `The street: ${nBuy} Buys and ${nAcc} Accumulates, median target ₹${n0(medTp)} (₹${n0(medTpQ1)} for the post-Q1 notes), mostly on 23-28x FY28E P/E; we see the same company at a lower multiple`,
  blocks: [
    { p: `Every broker we found with a note standing on 30-Sep-2026 is positive. The post-results notes of July 2026 (MOSL, ICICI Securities, Choice, Emkay, DRChoksey) have targets of ₹950-1,110, 12-31% above the 30-Sep close of ₹${n0(price)}. Their case: complex generics now drive the mix and the gross margin; Genome Valley and Gagillapur's clearance will unlock launches; Senn turns profitable; operating leverage lifts the EBITDA margin to 24-26% by FY28-29E; and the warrant money removes the balance-sheet constraint. Five of the six brokers that disclose a method use P/E, at 23-28x FY28E or one-year-forward EPS; Emkay uses a sum of the parts (implied ~12x EV/EBITDA at its March initiation).` },
    { exhibit: { type: 'table', title: 'The street on 30-Sep-2026 (latest note per broker)', head: ['Broker', 'Date', 'Rating', 'Target (₹)', 'Method', 'Multiple', 'On', 'At our EPS (₹)', 'Thesis'], wide: [8], rows: [
      ...ST.map(s => [s.broker, shortDate(s.date), s.rating, n0(s.tp), s.method || 'n.d.', s.multiple || '–', s.on || '–', ourAt(s), s.thesis]),
      { hl: true, cells: ['**GAM Research**', '30-Sep-26', `**${rating}**`, '**{{dcf.tp|num}}**', '**P/E**', `**${MULT.base}x**`, '**Sep-28E**', '**{{dcf.tp|num}}**', 'Same company, its own historical multiple: the re-rating is already in the price'] },
    ], source: 'Broker notes and summaries as cited in deep.json; n.d. = method not disclosed in what we could read' } },
    { h: 'Critiques: what the bull case glosses over' },
    { bullets: D.critiques.map(c => c) },
    { callout: `**Where we disagree with the street.** Not on the direction of the business: the shift to complex generics is real and Q1FY27 was good. We disagree on the multiple. The street pays 23-28x forward earnings for a company whose own one-year-forward P/E had a median of ${n1(X.HB.med)}x from Apr-2021 to Sep-2026 and that has delivered no EPS growth over five years. At ${MULT.base}x our Sep-28E EPS of ₹${n1(X.epsSep28)}, Granules is worth {{dcf.tp|inr}}; the street's own multiples applied to our EPS give ₹${n0(23 * sep(F.eps))}-${n0(28 * F.eps[1])}, close to today's price.` },
  ],
};

module.exports = { street };
