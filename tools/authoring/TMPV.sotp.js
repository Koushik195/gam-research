// Tata Motors Passenger Vehicles: write the derived SOTP multiples into assumptions.json. TMPV.ctx.js derives them
// (house rule: JLR = the JLR multiple implied by TMPV's own price since the demerger; India PV = Maruti Suzuki's
// forward EV/EBITDA median since Apr-2021; consolidated EV/EBITDA cross-check = TMPV's own forward median since the
// demerger; each x the auto-OEM sector de-rating, nearest half-turn; bull = no de-rating, bear = 25th percentile
// de-rated). The forecasts do not depend on the multiples, but the implied JLR multiple uses the forward EBITDA, so
// run until "unchanged" (one extra pass after a forecast change). Usage: node tools/authoring/TMPV.sotp.js
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', '..', 'data', 'raw', 'TMPV', 'research', 'assumptions.json');

function syncSotp() {
  delete require.cache[require.resolve('./TMPV.ctx')];
  const X = require('./TMPV.ctx');
  const as = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  const P = as.valuation.parts, jlr = P.find(p => p.seg === 'jlr'), pv = P.find(p => p.seg === 'pv'), ttl = P.find(p => /Technologies/.test(p.name));
  const ev = as.valuation.blend.methods.find(m => m.key === 'ev');
  const ttlAdj = Math.round(X.TTL_VAL), same = (a, c) => ['base', 'bull', 'bear'].every(key => a?.[key] === c[key]);
  const changed = !same(jlr.multiple, X.MULT.jlr) || !same(pv.multiple, X.MULT.pv) || !same(ev.multiple, X.MULT.ev) || ttl.adj.base !== ttlAdj;
  if (changed) {
    jlr.multiple = X.MULT.jlr; pv.multiple = X.MULT.pv; ev.multiple = X.MULT.ev; ttl.adj = { base: ttlAdj, bull: ttlAdj, bear: ttlAdj };
    fs.writeFileSync(FILE, JSON.stringify(as, null, 1));
    console.log(`TMPV.sotp: updated. JLR ${JSON.stringify(X.MULT.jlr)}, India PV ${JSON.stringify(X.MULT.pv)}, EV/EBITDA ${JSON.stringify(X.MULT.ev)}. Re-run node src/model.js TMPV, then node tools/authoring/TMPV.js.`);
  } else console.log(`TMPV.sotp: unchanged. JLR ${X.MULT.jlr.base}x, India PV ${X.MULT.pv.base}x, EV/EBITDA ${X.MULT.ev.base}x; SOTP ₹${X.V.tp}`);
  return { changed };
}

module.exports = { syncSotp };
if (require.main === module) syncSotp();
