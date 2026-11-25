// Jubilant FoodWorks: write the derived multiples and the minorities deduction into assumptions.json. JUBLFOOD.ctx.js derives
// the EV/EBITDA multiple (own one-year-forward EV/EBITDA median since Apr-2021 x the QSR peers' EV/EBITDA move against their
// five-year medians; bull 75th / bear 25th percentile x the move; nearest half-turn) and the P/E cross-check multiple (own
// forward P/E on EPS before exceptional items x the retail set's P/E move). Minorities = their share of profit (3.0%) x
// equity value before them, per case (case EBITDA from the scenario deltas; base-case net cash for all three, as the
// scenarios change Sep-28E net cash by under 2% of equity). The forward histories use our FY27E/FY28E EBITDA and EPS,
// which do not depend on the multiples, so one pass converges; the next `node src/model.js JUBLFOOD` carries them through.
// Usage: node tools/authoring/JUBLFOOD.val.js   (also run by JUBLFOOD.js)
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', '..', 'data', 'raw', 'JUBLFOOD', 'research', 'assumptions.json');

function syncMultiples() {
  process.env.JUBLFOOD_NOCHECK = '1';
  for (const k of Object.keys(require.cache)) if (/JUBLFOOD\.ctx/.test(k)) delete require.cache[k];
  const X = require('./JUBLFOOD.ctx');
  delete process.env.JUBLFOOD_NOCHECK;
  const as = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  const parts = as.valuation.parts, pe = as.valuation.blend.methods.find(m => m.key === 'pe');
  const caseSep = (k, key) => { const sg = as.segments.find(s => s.key === key), d = (k === 'base' ? {} : as.scenarios[k].segments[key]) || {}; let r = sg.base; const e = [];
    sg.growth.forEach((g, i) => { r *= 1 + (g + (d.growthDelta || 0)) / 100; e.push(r * (sg.marginPct[i] + (d.marginDelta || 0)) / 100); }); return (e[1] + e[2]) / 2; };
  const minAdj = {}; ['base', 'bull', 'bear'].forEach(k => { const ev = (caseSep(k, 'india') + caseSep(k, 'intl')) * X.evMULT[k]; minAdj[k] = -Math.round(X.mShare * (ev + X.netCashSep28)); });
  const before = JSON.stringify(as);
  parts.filter(p => p.seg).forEach(p => (p.multiple = { ...X.evMULT }));
  const mp = parts.find(p => /minorities/.test(p.name)); mp.adj = minAdj;
  mp.metricLabel = `${as.minorities.sharePct}% (minorities' share of profit) × equity value before minorities`;
  mp.note = 'DP Eurasia\'s outside holders (6.35%) and the 49% partner in Bangladesh; base-case Sep-28E net cash used in all three cases. Set by JUBLFOOD.val.js.';
  pe.multiple = { ...X.peMULT };
  const changed = JSON.stringify(as) !== before;
  if (changed) fs.writeFileSync(FILE, JSON.stringify(as, null, 1));
  console.log(`JUBLFOOD.val: ${changed ? 'updated (re-run node src/model.js JUBLFOOD, then node tools/authoring/JUBLFOOD.js)' : 'unchanged'}. EV/EBITDA ${JSON.stringify(X.evMULT)}, P/E ${JSON.stringify(X.peMULT)}, minorities ${JSON.stringify(minAdj)}`);
  return { changed };
}

module.exports = { syncMultiples };
if (require.main === module) syncMultiples();
