// Devyani International: write the derived multiples and the minorities deduction into assumptions.json. DEVYANI.ctx.js derives
// the EV/EBITDA multiple (own one-year-forward EV/EBITDA median since listing x the QSR peers' EV/EBITDA move against their
// five-year medians; bull 75th / bear 25th percentile x the move; nearest half-turn). The P/E cross-check uses Jubilant
// FoodWorks' derived forward P/E (Devyani's own P/E history is unusable). Minorities = phi (Camas's 52.45% x Thailand's 91% of
// International x International's share of group EBITDA, Sep-28E, per case) x equity value before minorities (case EBITDA from
// the scenario deltas; base-case net cash for all three, as the scenarios move Sep-28E net cash by under 2% of equity).
// The forward history uses our FY27E/FY28E EBITDA, which does not depend on the multiples, so one pass converges; the next
// `node src/model.js DEVYANI` carries them through.
// Usage: node tools/authoring/DEVYANI.val.js   (also run by DEVYANI.js)
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', '..', 'data', 'raw', 'DEVYANI', 'research', 'assumptions.json');

function syncMultiples() {
  process.env.DEVYANI_NOCHECK = '1';
  for (const k of Object.keys(require.cache)) if (/DEVYANI\.ctx/.test(k)) delete require.cache[k];
  const X = require('./DEVYANI.ctx');
  delete process.env.DEVYANI_NOCHECK;
  const as = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  const parts = as.valuation.parts, pe = as.valuation.blend.methods.find(m => m.key === 'pe');
  const caseSep = (k, key) => { const sg = as.segments.find(s => s.key === key), d = (k === 'base' ? {} : as.scenarios[k].segments[key]) || {}; let r = sg.base; const e = [];
    sg.growth.forEach((g, i) => { r *= 1 + (g + (d.growthDelta || 0)) / 100; e.push(r * (sg.marginPct[i] + (d.marginDelta || 0)) / 100); }); return (e[1] + e[2]) / 2; };
  const M = as.minorities, minAdj = {}, phiCase = {};
  ['base', 'bull', 'bear'].forEach(k => { const ind = caseSep(k, 'india'), intl = caseSep(k, 'intl'), phi = M.thaiNciPct / 100 * M.thaiShareOfIntlPct / 100 * intl / (ind + intl);
    phiCase[k] = Math.round(phi * 1000) / 10; minAdj[k] = -Math.round(phi * ((ind + intl) * X.evMULT[k] + X.netCashSep28)); });
  const before = JSON.stringify(as);
  parts.filter(p => p.seg).forEach(p => (p.multiple = { ...X.evMULT }));
  const mp = parts.find(p => /minorities/.test(p.name)); mp.adj = minAdj;
  mp.metricLabel = `${phiCase.base}% (Camas's 52.45% of Thailand ≈ minorities' share of Sep-28E EBITDA) × equity value before minorities`;
  mp.note = `Bull ${phiCase.bull}%, bear ${phiCase.bear}%; Thailand taken as 91% of International EBITDA and as carrying the group's leverage per rupee of EBITDA; base-case Sep-28E net cash used in all three cases. Set by DEVYANI.val.js.`;
  M.sharePct = phiCase.base;
  pe.multiple = { ...X.peMULT };
  const changed = JSON.stringify(as) !== before;
  if (changed) fs.writeFileSync(FILE, JSON.stringify(as, null, 1));
  console.log(`DEVYANI.val: ${changed ? 'updated (re-run node src/model.js DEVYANI, then node tools/authoring/DEVYANI.js)' : 'unchanged'}. EV/EBITDA ${JSON.stringify(X.evMULT)}, P/E ${JSON.stringify(X.peMULT)}, minorities ${JSON.stringify(minAdj)} (${JSON.stringify(phiCase)})`);
  return { changed };
}

module.exports = { syncMultiples };
if (require.main === module) syncMultiples();
