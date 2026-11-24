// Abbott India: write the derived multiples into assumptions.json. ABBOTINDIA.ctx.js derives the P/E (house forwardMedian:
// Abbott's median one-year-forward P/E since Apr-2021 on reported EPS, no trough years, x the pharma sector factor of
// 1.1025 (PLAYBOOK §7c, A20), nearest half-turn; bull/bear = 75th/25th percentile x the factor) and the EV/EBITDA
// cross-check multiple (own EV/EBITDA history on operating EBITDA with all treasury deducted, x the EV/EBITDA analogue of
// the factor). EPS does not depend on the multiples, but the forward P/E history uses our FY27E-28E EPS, so re-run after
// any forecast change. Usage: node tools/authoring/ABBOTINDIA.mult.js, then node src/model.js ABBOTINDIA.
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', '..', 'data', 'raw', 'ABBOTINDIA', 'research', 'assumptions.json');

function syncMult() {
  process.env.TP_NOCHECK = '1';
  delete require.cache[require.resolve('./ABBOTINDIA.ctx')];
  const X = require('./ABBOTINDIA.ctx');
  delete process.env.TP_NOCHECK;
  const as = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  const pe = as.valuation.blend.methods.find(m => m.key === 'pe'), ev = as.valuation.blend.methods.find(m => m.key === 'ev');
  const same = (a, c) => ['base', 'bull', 'bear'].every(key => a?.[key] === c[key]);
  const n1 = X.n1;
  const peWhy = `How the street values Abbott India: P/E (BOB Capital Markets 32x Sep-28E EPS, 3-Sep-2026; ICICI Direct 36x FY28E, 13-Aug-2026; ICICI Securities 38x FY27E, Nov-2025). ${X.MULT.base}x = Abbott's ${n1(X.HR.med)}x median one-year-forward P/E since Apr-2021 (house forwardMedian on reported EPS; exceptional items are immaterial, so the pre-exceptional median is also ${n1(X.HX.med)}x; no trough years: forward EPS was never below ${n1(Math.min(...X.troughCheck.map(t => t.ratio)) * 100)}% of its prior three-year peak) times the pharma sector factor of ${X.k} (median of SUNPHARMA, DIVISLAB, TORNTPHARM, ZYDUSLIFE, CIPLA, AUROPHARMA, ALKEM, IPCALAB trailing P/E at the 30-Sep close vs their five-year medians: +${X.SET_FACTOR}%, PLAYBOOK §7c; our reproduction ${X.pc2(X.sectorCalc)}) = ${n1(X.derived)}x, rounded to the nearest half-turn. No blend with Abbott's own de-rating (${X.pc1(X.ownDr)}) and no growth adjustment (sensitivity rows only). Bull ${X.MULT.bull}x (75th percentile ${n1(X.HR.p75)}x x factor); bear ${X.MULT.bear}x (25th percentile ${n1(X.HR.p25)}x x factor).`;
  const evWhy = `Counts net cash at face value and ignores other income. Abbott's own trailing EV/EBITDA since Apr-2021 (market value less company net cash incl. long deposits, over operating EBITDA before other income; Screener's series includes other income and ignores long deposits) has a median of ${n1(X.HEV.med)}x; times the EV/EBITDA analogue of the sector factor (${X.pc1(X.sectorEv)}, same eight peers) = ${n1(X.HEV.med * X.kev)}x, rounded to ${X.EVM.base}x and applied to trailing EBITDA at the target date (half FY27E + half FY28E) plus net cash at Sep-2027. Bull ${X.EVM.bull}x / bear ${X.EVM.bear}x (75th / 25th percentile x factor).`;
  const changed = !same(pe.multiple, X.MULT) || !same(ev.multiple, X.EVM) || pe.why !== peWhy || ev.why !== evWhy;
  if (changed) {
    pe.multiple = { ...X.MULT }; ev.multiple = { ...X.EVM }; pe.why = peWhy; ev.why = evWhy;
    fs.writeFileSync(FILE, JSON.stringify(as, null, 1));
    console.log(`ABBOTINDIA.mult: updated. P/E ${JSON.stringify(X.MULT)}, EV/EBITDA ${JSON.stringify(X.EVM)}. Re-run node src/model.js ABBOTINDIA.`);
  } else console.log(`ABBOTINDIA.mult: unchanged. P/E ${JSON.stringify(X.MULT)}, EV/EBITDA ${JSON.stringify(X.EVM)}`);
  return { changed };
}

module.exports = { syncMult };
if (require.main === module) syncMult();
