// Wockhardt: write the derived multiples into assumptions.json. WOCKPHARMA.ctx.js derives them under the PLAYBOOK §7c
// turnaround rule: P/E = Wockhardt's own one-year-forward P/E since the earnings break (1-Oct-2025; all weekly closes;
// forward EPS FY27E/FY28E carry no exceptional items) x the nine pharma peers' P/E move over the same window (+17.2%),
// nearest half-turn; bull/bear = 75th/25th percentile x the same factor. EV/EBITDA cross-check the same way with the
// EV/EBITDA factor (+6.7%). EPS does not depend on the multiples, so one pass converges; the next
// `node src/model.js WOCKPHARMA` carries them into the report and the Excel model.
// Usage: node tools/authoring/WOCKPHARMA.mult.js   (also run by WOCKPHARMA.js)
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', '..', 'data', 'raw', 'WOCKPHARMA', 'research', 'assumptions.json');

function syncMult() {
  delete require.cache[require.resolve('./WOCKPHARMA.ctx')];
  const X = require('./WOCKPHARMA.ctx');
  const as = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  const pe = as.valuation.blend.methods.find(m => m.key === 'pe'), ev = as.valuation.blend.methods.find(m => m.key === 'ev');
  const same = (a, c) => ['base', 'bull', 'bear'].every(key => a?.[key] === c[key]);
  const changed = !same(pe.multiple, X.MULT) || !same(ev.multiple, X.EVM);
  pe.why = `Turnaround rule (PLAYBOOK §7c, decided 24-Nov-2026): earnings broke from losses to profit in the Jul-Sep 2025 quarter (PBT Rs91 cr, the first of four profitable quarters), the same day the Zaynich NDA was filed (30-Sep-2025), so Wockhardt's own window starts on 1-Oct-2025. Its one-year-forward P/E over the 52 weekly closes since then: median ${X.n1(X.OWN.med)}x (25th-75th ${X.n1(X.OWN.p25)}-${X.n1(X.OWN.p75)}x; forward EPS FY27E/FY28E, no exceptional items). Nine pharma peers' P/E moved ${X.pc1(X.facPe)} over the same window (sector-factor.js --from 2025-10-01; +17.2%). ${X.n1(X.OWN.med)}x x 1.172 = ${X.n1(X.derived)}x, nearest half-turn ${X.MULT.base}x on Sep-28E EPS. Bull ${X.MULT.bull}x (75th percentile x factor), bear ${X.MULT.bear}x (25th). Since-2021 median ${X.n1(X.S21.med)}x (EPS before exceptional items, FY23-25 troughs out) x the five-year +8.2% = ${X.SENS.since21}x is a sensitivity row.`;
  ev.why = `Cross-check: own one-year-forward EV/EBITDA since 1-Oct-2025 (EV = market value + net debt incl. promoter loans and the Bio AG minority, less net deferred tax and assets held for sale; forward EBITDA FY27E/FY28E): median ${X.n1(X.HEV.med)}x x the peers' EV/EBITDA move over the same window (+6.7%) = ${X.EVM.base}x on Sep-28E EBITDA; bull ${X.EVM.bull}x, bear ${X.EVM.bear}x.`;
  if (changed || true) fs.writeFileSync(FILE, JSON.stringify(as, null, 1));
  console.log(`WOCKPHARMA.mult: ${changed ? 'updated' : 'unchanged'}. P/E ${JSON.stringify(X.MULT)}, EV/EBITDA ${JSON.stringify(X.EVM)}${changed ? '. Re-run node src/model.js WOCKPHARMA, then node tools/authoring/WOCKPHARMA.js.' : ''}`);
  if (changed) { pe.multiple = { ...X.MULT }; ev.multiple = { ...X.EVM }; fs.writeFileSync(FILE, JSON.stringify(as, null, 1)); }
  return { changed };
}

module.exports = { syncMult };
if (require.main === module) syncMult();
