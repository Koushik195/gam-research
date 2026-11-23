// Sun Pharma: carry the sum of the parts into the engine. The street values Sun on P/E (12-month-forward / FY28E); the
// pending Organon acquisition (closing guided for Q4FY27, i.e. before our Sep-28E valuation point) is not in our standalone
// forecasts, so it enters as a separate part: Organon at what Sun pays (no value created in the base case), less the excess
// value the standalone P/E puts on the $2.25 bn of cash that leaves Sun, plus cost synergies (bull) or less an EBITDA
// shortfall (bear). SUNPHARMA.ctx.js derives the standalone multiples (house rule: own forward median on adjusted EPS x the
// pharma factor of +10.25%, nearest half-turn) and the per-share Organon parts; this script writes the IMPLIED P/E per case
// (sum of the parts / Sep-28E standalone EPS) into the primary method, plus the derived EV/EBITDA cross-check multiple, and
// records the parts under organon.valuation. EPS does not depend on the multiples, so one pass converges; the next
// `node src/model.js SUNPHARMA` reproduces the target in the report and in the Excel model.
// Usage: node tools/authoring/SUNPHARMA.sotp.js   (also run by SUNPHARMA.js)
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', '..', 'data', 'raw', 'SUNPHARMA', 'research', 'assumptions.json');

function syncSotp() {
  delete require.cache[require.resolve('./SUNPHARMA.ctx')];
  const X = require('./SUNPHARMA.ctx');
  const as = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  const prim = as.valuation.blend.methods.find(m => m.role === 'primary'), ev = as.valuation.blend.methods.find(m => m.key === 'ev');
  const r2 = v => Math.round(v * 100) / 100;
  const want = Object.fromEntries(['base', 'bull', 'bear'].map(c => [c, r2(X.ORG[c].implied)]));
  const parts = Object.fromEntries(['base', 'bull', 'bear'].map(c => [c, { standaloneMultiple: X.MULT[c], sep28Eps: r2(X.ORG[c].eps), standalonePerShare: Math.round(X.ORG[c].standalone), cashAdjPerShare: r2(X.ORG[c].cashAdj), synergyOrShortfallPerShare: r2(X.ORG[c].extra), organonPerShare: r2(X.ORG[c].adj), totalPerShare: Math.round(X.ORG[c].total) }]));
  const same = (a, c) => ['base', 'bull', 'bear'].every(key => a?.[key] === c[key]);
  const changed = !same(prim.multiple, want) || !same(ev.multiple, X.evMULT) || JSON.stringify(as.organon.valuation) !== JSON.stringify(parts);
  if (changed) {
    prim.multiple = want; ev.multiple = X.evMULT; as.organon.valuation = parts;
    prim.why = `How the street values Sun: P/E on 12-month-forward or FY28E EPS (Motilal Oswal 38x 12-month forward, Geojit 30x FY28E, Prabhudas Lilladher 25x FY28E combined-entity EPS; ICICI Securities and Emkay use a sum of the parts). Standalone multiple ${X.MULT.base}x = Sun's median one-year-forward P/E since Apr-2021 on EPS before exceptional items (${X.n1(X.ADJ.med)}x; no trough years) x the pharma sector factor of +${X.SET_FACTOR}% (median of eight peers' P/E vs their five-year medians on 30-Sep-2026, excluding Sun; PLAYBOOK §7c) = ${X.n1(X.ADJ.med * X.k)}x, rounded to the half-turn. The house median on reported EPS is ${X.n1(X.HOUSE.med)}x (=> ${X.houseMult}x, a sensitivity). Organon, still pending on 30-Sep-2026, is valued at what Sun pays (6.2x EBITDA): its base-case part is ${X.n1(X.ORG.base.adj)} rupees a share (the $2.25 bn of cash that leaves Sun is worth face value, not ${X.MULT.base}x its interest income), so the implied multiple on standalone Sep-28E EPS is ${want.base}x. Bull ${X.MULT.bull}x (75th percentile x factor) plus synergies => ${want.bull}x; bear ${X.MULT.bear}x (25th percentile x factor) less a 10% Organon EBITDA shortfall => ${want.bear}x.`;
    ev.why = `Counts net cash at face value. ${X.evMULT.base}x Sep-28E EBITDA = Sun's ${X.n1(X.evMed)}x median trailing EV/EBITDA since Apr-2021 x the +${X.SET_FACTOR}% pharma factor, restated for Sep-28E EBITDA (Rs${X.n0(X.ebitdaSep28)} cr, before forex) vs the twelve months to Jun-26 on Screener (Rs${X.n0(X.ttmEbitda)} cr). Bull ${X.evMULT.bull}x and bear ${X.evMULT.bear}x use the 75th and 25th percentiles. Standalone: the Organon part is not added.`;
    fs.writeFileSync(FILE, JSON.stringify(as, null, 1));
    console.log(`SUNPHARMA.sotp: updated. Standalone ${JSON.stringify(X.MULT)}, implied P/E ${JSON.stringify(want)}, EV/EBITDA ${JSON.stringify(X.evMULT)}. Re-run node src/model.js SUNPHARMA, then node tools/authoring/SUNPHARMA.js.`);
  } else console.log(`SUNPHARMA.sotp: unchanged. SOTP Rs${X.ORG.base.total.toFixed(0)} (bull Rs${X.ORG.bull.total.toFixed(0)}, bear Rs${X.ORG.bear.total.toFixed(0)}); implied P/E ${JSON.stringify(want)}`);
  return { changed, want };
}

module.exports = { syncSotp };
if (require.main === module) syncSotp();
