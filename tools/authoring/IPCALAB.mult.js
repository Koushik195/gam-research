// Ipca Laboratories: write the derived inputs into assumptions.json, then rebuild the model, until nothing changes.
// IPCALAB.ctx.js derives (1) the other-income build (7.5% on average gross cash, deposits and liquid funds + ₹12 cr of
// recurring miscellaneous income − ₹5 cr share of JV/associate losses), (2) the engine tax rate = (26% tax on PBT +
// minorities) / PBT from taxBuild, (3) the P/E multiples (Ipca's median one-year-forward P/E since the Unichem deal on
// EPS before exceptional items and one-off gains, x the pharma sector factor of 1.1025, nearest half-turn; bull/bear =
// 75th/25th percentile x the factor) and (4) the EV/EBITDA cross-check multiples. The ctx refuses to load while the
// assumptions and the derivation differ, so this runs it with TP_NOCHECK=1.
// Usage: node tools/authoring/IPCALAB.mult.js   (runs src/model.js itself; repeats until "unchanged")
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const ROOT = path.join(__dirname, '..', '..');
const FILE = path.join(ROOT, 'data', 'raw', 'IPCALAB', 'research', 'assumptions.json');
const same = (a, c) => JSON.stringify(a) === JSON.stringify(c);

function syncOnce() {
  process.env.TP_NOCHECK = '1';
  delete require.cache[require.resolve('./IPCALAB.ctx')];
  const X = require('./IPCALAB.ctx');
  const as = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  const pe = as.valuation.blend.methods.find(m => m.key === 'pe'), ev = as.valuation.blend.methods.find(m => m.key === 'ev');
  const want = { otherIncome: X.oiBuild, taxRate: X.taxRateBuild, pe: { ...X.MULT }, ev: { ...X.EVM } };
  const changed = !same(as.otherIncome, want.otherIncome) || !same(as.taxRate, want.taxRate) || !same(pe.multiple, want.pe) || !same(ev.multiple, want.ev);
  if (changed) {
    as.otherIncome = want.otherIncome; as.taxRate = want.taxRate; pe.multiple = want.pe; ev.multiple = want.ev;
    fs.writeFileSync(FILE, JSON.stringify(as, null, 1));
  }
  return { changed, want };
}

if (require.main === module) {
  for (let i = 0; i < 8; i++) {
    const { changed, want } = syncOnce();
    console.log(`IPCALAB.mult pass ${i + 1}: ${changed ? 'updated' : 'unchanged'} ${JSON.stringify(want)}`);
    if (!changed) break;
    execFileSync(process.execPath, [path.join(ROOT, 'src', 'model.js'), 'IPCALAB'], { stdio: 'inherit' });
  }
}
module.exports = { syncOnce };
