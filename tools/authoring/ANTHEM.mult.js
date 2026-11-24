// Anthem Biosciences: write the derived multiples into assumptions.json. ANTHEM.ctx.js derives the P/E (Anthem's median
// one-year-forward P/E since 1-Oct-2025 on every weekly close plus the 30-Sep close, x the pharma same-window factor of
// 1.172, nearest half-turn; bull/bear = 75th/25th percentile x the factor) and the EV/EBITDA cross-check (median forward
// EV/EBITDA over the same window x 1.067). The forward history uses our FY27E/FY28E, so run this after every forecast
// change. Run with TP_NOCHECK=1 (the ctx refuses to load while assumptions and derivation differ), then rebuild the model;
// repeat until "unchanged" (EPS does not depend on the multiple, so one pass normally suffices).
// Usage: TP_NOCHECK=1 node tools/authoring/ANTHEM.mult.js
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', '..', 'data', 'raw', 'ANTHEM', 'research', 'assumptions.json');

function syncMult() {
  process.env.TP_NOCHECK = '1';
  delete require.cache[require.resolve('./ANTHEM.ctx')];
  const X = require('./ANTHEM.ctx');
  const as = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  const pe = as.valuation.blend.methods.find(m => m.key === 'pe'), ev = as.valuation.blend.methods.find(m => m.key === 'ev');
  const same = (a, c) => ['base', 'bull', 'bear'].every(key => a?.[key] === c[key]);
  const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
  const peWhy = `How the street values Anthem: four of the six brokers that disclose a method use P/E (Jefferies 65x Sep-28E, BOBCAPS 57x Jun-28E, PL 55x FY28E, Nomura 50x Dec-27E); HDFC Securities and JM Financial use EV/EBITDA. ${X.MULT.base}x = Anthem's median one-year-forward P/E since 1-Oct-2025 (listed 21-Jul-2025; IPO months skipped; every weekly close plus the 30-Sep close, ${X.HB.n} points; forward EPS = our FY27E/FY28E, which carry no exceptional items, so the pre-exceptional and reported medians are the same) of ${n1(X.HB.med)}x x 1.172 (nine pharma peers' trailing P/E at the 30-Sep close vs their medians over the same window, PLAYBOOK §7c; reproduced ${X.pc1(X.sectorCalc)}) = ${n1(X.HB.med * X.k)}x, nearest half-turn. Bull ${X.MULT.bull}x / bear ${X.MULT.bear}x = 75th / 25th percentile (${n1(X.HB.p75)}x / ${n1(X.HB.p25)}x) x 1.172. No own-move blend, no growth uplift (sensitivities only). Written by ANTHEM.mult.js.`;
  const evWhy = `Cross-check: Anthem's median one-year-forward EV/EBITDA since 1-Oct-2025 (EV at each weekly close less the last published company net cash, over our next-year EBITDA, Screener basis) of ${n1(X.EVH.med)}x x 1.067 (the peers' EV/EBITDA move over the same window, PLAYBOOK §7c; reproduced ${X.pc1(X.sectorEvCalc)}) = ${n1(X.EVH.med * X.kev)}x, nearest half-turn, on Sep-28E EBITDA plus Sep-28E net cash. Bull ${X.EVM.bull}x / bear ${X.EVM.bear}x = 75th / 25th percentile x 1.067. Street: HDFC Securities 35x Q3FY28E, JM Financial 40x Sep-27E.`;
  const changed = !same(pe.multiple, X.MULT) || !same(ev.multiple, X.EVM) || pe.why !== peWhy || ev.why !== evWhy;
  if (changed) {
    pe.multiple = { ...X.MULT }; ev.multiple = { ...X.EVM }; pe.why = peWhy; ev.why = evWhy;
    fs.writeFileSync(FILE, JSON.stringify(as, null, 1));
    console.log(`ANTHEM.mult: updated. P/E ${JSON.stringify(X.MULT)}, EV/EBITDA ${JSON.stringify(X.EVM)}. Re-run node src/model.js ANTHEM.`);
  } else console.log(`ANTHEM.mult: unchanged. P/E ${JSON.stringify(X.MULT)}, EV/EBITDA ${JSON.stringify(X.EVM)}`);
  return { changed };
}

module.exports = { syncMult };
if (require.main === module) syncMult();
