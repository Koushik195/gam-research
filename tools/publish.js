// Publish a report into the coverage library: freezes it at its as-of date, applies the rating
// rule to the target vs the as-of price, snapshots the report, and appends to history.json.
// Usage:
//   node tools/publish.js SRF --asof 2026-09-30                      (initiation as of that date)
//   node tools/publish.js SRF --asof 2026-11-17 --type results-update --note "Q2FY27: ..."
//   node tools/publish.js SRF --asof ... --rating BUY --reason "..."   (override the rule; reason required)
const fs = require('fs');
const path = require('path');
const { writeModel } = require('../src/model');
const { publish } = require('../src/coverage');

const [sym, ...rest] = process.argv.slice(2);
if (!sym) { console.error('Usage: node tools/publish.js <SYMBOL> --asof YYYY-MM-DD [--type initiation|results-update] [--rating X --reason "..."] [--note "..."]'); process.exit(1); }
const arg = k => { const i = rest.indexOf(`--${k}`); return i >= 0 ? rest[i + 1] : undefined; };
const SYM = sym.toUpperCase();
const asOf = arg('asof');
const af = path.join(__dirname, '..', 'data', 'raw', SYM, 'research', 'assumptions.json');
if (asOf) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(asOf)) throw new Error('--asof must be YYYY-MM-DD');
  const as = JSON.parse(fs.readFileSync(af, 'utf8'));
  if (as.asOf !== asOf) { fs.writeFileSync(af, JSON.stringify({ asOf, ...Object.fromEntries(Object.entries(as).filter(([k]) => k !== 'asOf')) }, null, 1)); }
}
writeModel(SYM);
// Regenerate the report text from the frozen model, so the snapshot is exactly what readers see.
const authoring = path.join(__dirname, 'authoring', `${SYM}.js`);
if (fs.existsSync(authoring)) require('child_process').execFileSync(process.execPath, [authoring], { stdio: 'inherit' });
const M = writeModel(SYM);
// Look-ahead check: a report frozen at its as-of date must not carry later-dated data points.
if (asOf) {
  const { late, monthHits } = require('./lookahead').lookahead(SYM, asOf);
  if (late.length && !rest.includes('--allow-late')) { console.error(`${SYM}: report contains dates after the as-of date ${asOf}: ${late.slice(0, 8).join(', ')}. Fix the source (or pass --allow-late if intended).`); process.exit(1); }
  // Month-name dates after the as-of month are listed for review (forward guidance is allowed).
  if (monthHits.length) console.warn(`${SYM}: ${monthHits.length} later month-dates to review with: node tools/lookahead.js ${SYM} ${asOf}`);
}
const ev = publish(M, { type: arg('type'), date: asOf, rating: arg('rating'), reason: arg('reason'), note: arg('note'), updateFile: arg('update') });
const M2 = writeModel(SYM); // rebuild so the model carries the new history and published rating
console.log(`${SYM} ${ev.type} ${ev.date}: ${ev.rating} (rule ${ev.ruleRating}), target ₹${ev.tp} vs ₹${ev.price} on ${ev.priceDate} = ${ev.upside}% upside; basis ${ev.basisQuarter}; change: ${ev.change.rating}${ev.change.from ? ` from ${ev.change.from} ₹${ev.change.tpFrom}` : ''}`);
const s = M2.coverage; if (s?.flags?.length) console.log('  flags:', s.flags.map(f => f.t).join(' | '));
