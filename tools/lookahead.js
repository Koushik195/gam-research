// Look-ahead check for a report frozen at an as-of date. Two lists:
//  - late: ISO dates (YYYY-MM-DD) after the as-of date -> publish refuses these;
//  - monthHits: dates written with month names ("30-Oct-2026", "Oct-26", "October 2026") after the
//    as-of month, with context -> listed for review, since forward guidance ("by Mar-2027") is fine
//    but anything announced after the as-of date is not.
// Usage: node tools/lookahead.js SYM 2026-09-30
const fs = require('fs');
const path = require('path');
const MON = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12 };

function lookahead(SYM, asOf) {
  const I = fs.readFileSync(path.join(__dirname, '..', 'data', 'raw', SYM, 'research', 'initiation.json'), 'utf8');
  const late = [...new Set(I.match(/\b20\d\d-\d\d-\d\d\b/g) || [])].filter(d => d > asOf);
  const asOfYm = +asOf.slice(0, 4) * 12 + +asOf.slice(5, 7);
  const txt = I.replace(/\\n/g, ' ');
  const re = /\b(?:\d{1,2}[- ])?(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[- ,]+(20\d\d|\d\d)\b/g;
  const monthHits = []; let m;
  while ((m = re.exec(txt))) {
    const yr = m[2].length === 2 ? 2000 + +m[2] : +m[2];
    if (yr * 12 + MON[m[1].toLowerCase()] <= asOfYm) continue;
    const ctx = txt.slice(Math.max(0, m.index - 70), m.index + m[0].length + 30).replace(/\s+/g, ' ');
    if (!monthHits.includes(ctx)) monthHits.push(ctx);
  }
  return { late, monthHits };
}
module.exports = { lookahead };

if (require.main === module) {
  const [sym, asOf] = process.argv.slice(2);
  const { late, monthHits } = lookahead(sym.toUpperCase(), asOf);
  console.log(`ISO dates after ${asOf}: ${late.length ? late.join(', ') : 'none'}`);
  console.log(`Later month-dates to review: ${monthHits.length}`);
  for (const c of monthHits) console.log(`  ... ${c} ...`);
}
