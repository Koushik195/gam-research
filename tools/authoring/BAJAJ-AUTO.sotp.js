// Bajaj Auto: carry the P/E-led sum of the parts into the engine. The engine's primary method can only be
// multiple x consolidated EPS, but the street (and we) value Bajaj on STANDALONE EPS plus BACL and the KTM stake
// separately. BAJAJ-AUTO.ctx.js computes the SOTP per share (base, bull, bear) from the built model; this script
// writes it into assumptions.json as the primary method's multiple of the model's consolidated Sep-28E EPS (and the
// derived EV/EBITDA cross-check multiples). The next `node src/model.js BAJAJ-AUTO` then reproduces the SOTP target
// in the report and in the Excel model (TargetPrice = implied multiple x Sep-28E EPS). EPS does not depend on these
// multiples, so one pass converges; the script says whether anything changed.
// Usage: node tools/authoring/BAJAJ-AUTO.sotp.js   (also run by BAJAJ-AUTO.js)
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', '..', 'data', 'raw', 'BAJAJ-AUTO', 'research', 'assumptions.json');

function syncSotp() {
  delete require.cache[require.resolve('./BAJAJ-AUTO.ctx')];
  const { SOTP, EVX, CORE } = require('./BAJAJ-AUTO.ctx');
  const as = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  const methods = as.valuation.blend.methods;
  const prim = methods.find(m => m.role === 'primary'), ev = methods.find(m => m.key === 'ev');
  const want = Object.fromEntries(['base', 'bull', 'bear'].map(k => [k, Math.round(SOTP[k].implied * 10000) / 10000]));
  const changed = ['base', 'bull', 'bear'].filter(k => prim.multiple[k] !== want[k] || ev.multiple[k] !== EVX[k]);
  if (changed.length) {
    prim.multiple = want;
    prim.why = `P/E-led sum of the parts carried as a multiple of consolidated Sep-28E EPS (set by BAJAJ-AUTO.sotp.js): standalone Sep-28E EPS x ${CORE.base}x (bull ${CORE.bull}x, bear ${CORE.bear}x) + BACL at P/B on Sep-27E book + 74.94% of Bajaj Mobility at market less a holding discount, per post-buyback share. See the valuation chapter.`;
    ev.multiple = { ...EVX };
    ev.why = `Own trailing EV/EBITDA median since Apr-2021 x the auto-sector de-rating, restated from trailing to Sep-28E EBITDA (base ${EVX.base}x, bull ${EVX.bull}x, bear ${EVX.bear}x); applied to consolidated EBITDA plus net cash excluding BACL's operating borrowings.`;
    fs.writeFileSync(FILE, JSON.stringify(as, null, 1));
    console.log(`BAJAJ-AUTO.sotp: multiples updated (${changed.join(', ')}): SOTP ${JSON.stringify(want)}, EV/EBITDA ${JSON.stringify(EVX)}. Re-run node src/model.js BAJAJ-AUTO.`);
  } else console.log(`BAJAJ-AUTO.sotp: multiples unchanged ${JSON.stringify(want)}; SOTP Rs${SOTP.base.ps.toFixed(1)} / bull Rs${SOTP.bull.ps.toFixed(1)} / bear Rs${SOTP.bear.ps.toFixed(1)}`);
  return { changed: changed.length > 0, want };
}

module.exports = { syncSotp };
if (require.main === module) syncSotp();
