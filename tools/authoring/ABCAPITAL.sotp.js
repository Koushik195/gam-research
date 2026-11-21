// Aditya Birla Capital: carry the sum of the parts into the lender engine. The engine values lenders only on
// P/E, P/B, justified P/B or residual income (src/forecast-lender.js), so the SOTP value per share (base, bull,
// bear; computed in ABCAPITAL.ctx.js from the built model) is written into assumptions.json as the primary
// method's multiple of standalone Sep-28E book. The next `node src/model.js ABCAPITAL` then reproduces the SOTP
// target in the report and in the Excel model (TargetPrice = multiple × Sep-28E book). Book does not depend on
// the multiple, so one pass converges; the script reports whether anything changed.
// Usage: node tools/authoring/ABCAPITAL.sotp.js   (also run by ABCAPITAL.js)
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', '..', 'data', 'raw', 'ABCAPITAL', 'research', 'assumptions.json');

function syncSotp() {
  delete require.cache[require.resolve('./ABCAPITAL.ctx')];
  const { SOTP } = require('./ABCAPITAL.ctx');
  const as = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  const prim = as.valuation.blend.methods.find(m => m.role === 'primary');
  const want = Object.fromEntries(['base', 'bull', 'bear'].map(k => [k, Math.round(SOTP[k].implied * 10000) / 10000]));
  const changed = ['base', 'bull', 'bear'].filter(k => prim.multiple[k] !== want[k]);
  if (changed.length) {
    prim.multiple = want;
    fs.writeFileSync(FILE, JSON.stringify(as, null, 1));
    console.log(`ABCAPITAL.sotp: implied multiples updated (${changed.join(', ')}): ${JSON.stringify(want)}. Re-run node src/model.js ABCAPITAL, then this script again.`);
  } else console.log(`ABCAPITAL.sotp: implied multiples unchanged ${JSON.stringify(want)}; SOTP ₹${SOTP.base.perShare.toFixed(1)} / bull ₹${SOTP.bull.perShare.toFixed(1)} / bear ₹${SOTP.bear.perShare.toFixed(1)}`);
  return { changed: changed.length > 0, want };
}

module.exports = { syncSotp };
if (require.main === module) syncSotp();
