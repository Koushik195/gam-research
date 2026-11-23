// Mahindra & Mahindra: carry the sum of the parts into the engine. The engine values the standalone company on a
// P/E primary method, so the SOTP value per share (base, bull, bear; computed in M&M.ctx2.js from the built model) is
// written into assumptions.json as that method's multiple of standalone Sep-28E EPS. The next `node src/model.js "M&M"`
// then reproduces the SOTP target in the report and in the Excel model (TargetPrice = multiple x Sep-28E EPS). EPS does
// not depend on the multiple, so one pass converges; the script reports whether anything changed (as ABCAPITAL.sotp.js).
// Usage: node "tools/authoring/M&M.sotp.js"   (also run by M&M.js)
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', '..', 'data', 'raw', 'M&M', 'research', 'assumptions.json');

function syncSotp() {
  for (const k of ['./M&M.ctx', './M&M.ctx2']) delete require.cache[require.resolve(k)];
  const { SOTP } = require('./M&M.ctx2');
  const as = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  const prim = as.valuation.blend.methods.find(m => m.role === 'primary');
  const want = Object.fromEntries(['base', 'bull', 'bear'].map(k => [k, Math.round(SOTP[k].implied * 100) / 100]));
  const changed = ['base', 'bull', 'bear'].filter(k => prim.multiple[k] !== want[k]);
  if (changed.length) {
    prim.multiple = want;
    fs.writeFileSync(FILE, JSON.stringify(as, null, 1));
    console.log(`M&M.sotp: implied multiples updated (${changed.join(', ')}): ${JSON.stringify(want)}. Re-run node src/model.js "M&M", then this script again.`);
  } else console.log(`M&M.sotp: implied multiples unchanged ${JSON.stringify(want)}; SOTP ₹${SOTP.base.perShare.toFixed(1)} / bull ₹${SOTP.bull.perShare.toFixed(1)} / bear ₹${SOTP.bear.perShare.toFixed(1)}`);
  return { changed: changed.length > 0, want };
}

module.exports = { syncSotp };
if (require.main === module) syncSotp();
