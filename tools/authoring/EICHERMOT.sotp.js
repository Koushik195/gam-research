// Eicher Motors: carry the sum of the parts into the engine. The street values Eicher as Royal Enfield on P/E plus
// VECV (54.4%, equity-accounted) on P/E or EV/EBITDA; the engine's SOTP method only takes segment EBITDA/revenue
// metrics, and VECV is not a segment (its profit share sits in other income). So EICHERMOT.ctx.js derives the two
// multiples (house rule: own forward median x auto-OEM de-rating, nearest half-turn) and the SOTP value per case,
// and this script writes them into assumptions.json: the SOTP block (for the record) and the primary method's
// multiple of consolidated Sep-28E EPS (implied P/E = SOTP value / Sep-28E EPS, base/bull/bear), plus the derived
// EV/EBITDA cross-check multiple. EPS does not depend on these multiples, so one pass converges; the next
// `node src/model.js EICHERMOT` reproduces the SOTP target in the report and in the Excel model.
// Usage: node tools/authoring/EICHERMOT.sotp.js   (also run by EICHERMOT.js)
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', '..', 'data', 'raw', 'EICHERMOT', 'research', 'assumptions.json');

function syncSotp() {
  delete require.cache[require.resolve('./EICHERMOT.ctx')];
  const X = require('./EICHERMOT.ctx');
  const as = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  const prim = as.valuation.blend.methods.find(m => m.role === 'primary'), ev = as.valuation.blend.methods.find(m => m.key === 'ev');
  const want = Object.fromEntries(['base', 'bull', 'bear'].map(c => [c, Math.round(X.SOTP[c].implied * 100) / 100]));
  const sotp = { ...as.sotp, reMultiple: X.MULT.re, vecvMultiple: X.MULT.vecv };
  const same = (a, c) => ['base', 'bull', 'bear'].every(key => a?.[key] === c[key]);
  const changed = !same(prim.multiple, want) || !same(as.sotp.reMultiple, X.MULT.re) || !same(as.sotp.vecvMultiple, X.MULT.vecv) || !same(ev.multiple, X.evMULT);
  if (changed) {
    prim.multiple = want; as.sotp = sotp; ev.multiple = X.evMULT;
    fs.writeFileSync(FILE, JSON.stringify(as, null, 1));
    console.log(`EICHERMOT.sotp: updated. RE ${JSON.stringify(X.MULT.re)}, VECV ${JSON.stringify(X.MULT.vecv)}, implied P/E ${JSON.stringify(want)}, EV/EBITDA ${JSON.stringify(X.evMULT)}. Re-run node src/model.js EICHERMOT, then node tools/authoring/EICHERMOT.js.`);
  } else console.log(`EICHERMOT.sotp: unchanged. SOTP ₹${X.SOTP.base.perShare.toFixed(0)} (bull ₹${X.SOTP.bull.perShare.toFixed(0)}, bear ₹${X.SOTP.bear.perShare.toFixed(0)}); implied P/E ${JSON.stringify(want)}`);
  return { changed, want };
}

module.exports = { syncSotp };
if (require.main === module) syncSotp();
