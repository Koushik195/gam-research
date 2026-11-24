// GSK India: write the derived multiples into assumptions.json. GLAXO.ctx.js derives the P/E (GSK India's median
// one-year-forward P/E since Apr-2021 on EPS before one-offs, i.e. consolidated continuing operations before exceptional
// items, house sampling and median, no trough years on that basis; x the pharma sector factor of 1.082 for names outside
// the nine-company set (PLAYBOOK §7c, A21), nearest half-turn; bull/bear = 75th/25th percentile x the factor) and the
// EV/EBITDA cross-check multiple (own trailing EV/EBITDA history on operating EBITDA with company net cash deducted, x the
// EV/EBITDA factor of 1.075). EPS does not depend on the multiples, but the forward P/E history uses our FY27E-28E EPS, so
// re-run after any forecast change. Usage: node tools/authoring/GLAXO.mult.js, then node src/model.js GLAXO.
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', '..', 'data', 'raw', 'GLAXO', 'research', 'assumptions.json');

function syncMult() {
  process.env.TP_NOCHECK = '1';
  delete require.cache[require.resolve('./GLAXO.ctx')];
  const X = require('./GLAXO.ctx');
  delete process.env.TP_NOCHECK;
  const as = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  const pe = as.valuation.blend.methods.find(m => m.key === 'pe'), ev = as.valuation.blend.methods.find(m => m.key === 'ev');
  const same = (a, c) => ['base', 'bull', 'bear'].every(key => a?.[key] === c[key]);
  const n1 = X.n1;
  const peWhy = `How the street values GSK India: P/E (Motilal Oswal 35x 12-month forward EPS, 3-Aug-2026; Nirmal Bang 50x FY27E, Aug-2025; ICICI Securities does not disclose its method). ${X.MULT.base}x = GSK India's ${n1(X.HB.med)}x median one-year-forward P/E since Apr-2021 on EPS before one-offs (consolidated continuing operations before exceptional items: the FY22 Iodex/Ostocalcium gain, the FY24 VRS charge and property gains are material; house sampling and median; no trough years on this basis) times the pharma sector factor of ${X.k} (GSK India is outside the nine-company set, so the median of all nine names' trailing P/E at the 30-Sep close vs their five-year medians: +${X.SET_FACTOR}%, PLAYBOOK §7c; our reproduction ${X.pc2(X.sectorCalc)}) = ${n1(X.derived)}x, rounded to the nearest half-turn. The house forwardMedian on reported EPS is ${n1(X.FM.median)}x because the FY22 gain (reported EPS ₹100) makes FY23-24 look like trough years (sensitivity row). No blend with GSK India's own de-rating (${X.pc1(X.ownDr)}) and no growth adjustment (sensitivity rows only). Bull ${X.MULT.bull}x (75th percentile ${n1(X.HB.p75)}x x factor); bear ${X.MULT.bear}x (25th percentile ${n1(X.HB.p25)}x x factor).`;
  const evWhy = `Counts net cash at face value and ignores other income. GSK India's own trailing EV/EBITDA since Apr-2021 (market value less company net cash after each August dividend, over operating EBITDA before other income) has a median of ${n1(X.HEV.med)}x (Screener's own series ${n1(X.HEVS.med)}x); times the EV/EBITDA factor for names outside the set (+${X.SET_FACTOR_EV}%, PLAYBOOK §7c; our reproduction ${X.pc2(X.sectorEv)}) = ${n1(X.HEV.med * X.kev)}x, rounded to ${X.EVM.base}x and applied to trailing EBITDA at the target date (half FY27E + half FY28E) plus net cash at Sep-2027. Bull ${X.EVM.bull}x / bear ${X.EVM.bear}x (75th / 25th percentile x factor).`;
  const changed = !same(pe.multiple, X.MULT) || !same(ev.multiple, X.EVM) || pe.why !== peWhy || ev.why !== evWhy;
  if (changed) {
    pe.multiple = { ...X.MULT }; ev.multiple = { ...X.EVM }; pe.why = peWhy; ev.why = evWhy;
    fs.writeFileSync(FILE, JSON.stringify(as, null, 1));
    console.log(`GLAXO.mult: updated. P/E ${JSON.stringify(X.MULT)}, EV/EBITDA ${JSON.stringify(X.EVM)}. Re-run node src/model.js GLAXO.`);
  } else console.log(`GLAXO.mult: unchanged. P/E ${JSON.stringify(X.MULT)}, EV/EBITDA ${JSON.stringify(X.EVM)}`);
  return { changed };
}

module.exports = { syncMult };
if (require.main === module) syncMult();
