// TVS Motor: carry the sum of the parts into the engine. The engine cannot add parts to a P/E (src/forecast.js blend),
// so the SOTP value per share (base, bull, bear; computed in TVSMOTOR.ctx.js from the built model) is written into
// assumptions.json as the primary method's multiple of standalone Sep-28E EPS, and the derived EV/EBITDA cross-check
// multiples are written alongside. The next `node src/model.js TVSMOTOR` reproduces the SOTP target in the report and
// in the Excel model (TargetPrice = implied multiple x Sep-28E EPS). EPS does not depend on the multiples, so one
// pass converges; the script reports whether anything changed.
// Usage: node tools/authoring/TVSMOTOR.sotp.js   (also run by TVSMOTOR.js)
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', '..', 'data', 'raw', 'TVSMOTOR', 'research', 'assumptions.json');

function syncSotp() {
  delete require.cache[require.resolve('./TVSMOTOR.ctx')];
  const { SOTP, evMult } = require('./TVSMOTOR.ctx');
  const as = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  const ms = as.valuation.blend.methods, prim = ms.find(m => m.role === 'primary'), ev = ms.find(m => m.key === 'ev');
  const want = Object.fromEntries(['base', 'bull', 'bear'].map(k => [k, Math.round(SOTP[k].implied * 100) / 100]));
  const changed = ['base', 'bull', 'bear'].filter(k => prim.multiple[k] !== want[k] || ev.multiple[k] !== evMult[k]);
  if (changed.length) {
    prim.multiple = want; ev.multiple = { ...evMult };
    ev.why = `Counts net cash (incl. subsidiaries at cost) at face value. ${evMult.base}x Sep-28E EBITDA = TVS Motor's median trailing EV/EBITDA since Apr-2021 less the same sector de-rating, restated for Sep-28E EBITDA being above the twelve months to Jun-26; bull/bear scale with the P/E multiples. Derived in TVSMOTOR.ctx.js.`;
    fs.writeFileSync(FILE, JSON.stringify(as, null, 1));
    console.log(`TVSMOTOR.sotp: multiples updated (${changed.join(', ')}): P/E-implied ${JSON.stringify(want)}, EV/EBITDA ${JSON.stringify(evMult)}. Re-run node src/model.js TVSMOTOR, then this script again.`);
  } else console.log(`TVSMOTOR.sotp: multiples unchanged ${JSON.stringify(want)}; SOTP ₹${SOTP.base.perShare.toFixed(1)} / bull ₹${SOTP.bull.perShare.toFixed(1)} / bear ₹${SOTP.bear.perShare.toFixed(1)}`);
  return { changed: changed.length > 0, want };
}

module.exports = { syncSotp };
if (require.main === module) syncSotp();
