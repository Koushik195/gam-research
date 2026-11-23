// Hero MotoCorp: value of the stakes the street adds on top of the core P/E (Ather Energy, Hero FinCorp,
// other strategic holdings), per scenario, from the `stakes` block in assumptions.json.
//
// Engine workaround: src/forecast.js has no "P/E plus stakes" method (a P/E value is EPS x multiple; SOTP
// parts can only use segment metrics). So the P/E line in the engine and the Excel Valuation sheet carries a
// COMPOSITE multiple = core multiple + stakes per share / Sep-28E EPS of that scenario. EPS does not depend on
// the multiple, so one sync pass is exact. Usage:
//   node tools/authoring/HEROMOTOCO.stakes.js          -> prints the check
//   node tools/authoring/HEROMOTOCO.stakes.js --sync   -> writes the composite multiples into assumptions.json
//   (then rebuild: node src/model.js HEROMOTOCO)
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..', '..');
const AF = path.join(ROOT, 'data', 'raw', 'HEROMOTOCO', 'research', 'assumptions.json');
const MF = path.join(ROOT, 'data', 'models', 'HEROMOTOCO.json');

// Rs crore values of each stake in one scenario
function stakeValues(S, kase = 'base') {
  const a = S.ather, h = S.hfcl, o = S.others;
  const pick = x => (typeof x === 'object' ? x[kase] ?? x.base : x);
  const atherShares = a.shares * a.price / 1e7;                                   // listed shares held at 30-Sep close
  const atherWarrants = a.warrants * Math.max(a.price - a.warrantBalancePerShare, 0) / 1e7; // intrinsic value of 25%-paid warrants
  const atherGross = atherShares + atherWarrants;
  const ather = atherGross * (1 - pick(a.discount) / 100);
  const hfclGross = h.bookMar26 * h.stakePct / 100 * pick(h.pb);
  const hfcl = hfclGross * (1 - pick(h.discount) / 100);
  const others = o.value;
  return { atherShares, atherWarrants, atherGross, ather, hfclGross, hfcl, others, total: ather + hfcl + others };
}

// Composite multiple per scenario, given the built model (EPS Sep-28E from the engine's blend metric)
function composite(S, M) {
  const shares = M.forecast.F.shares;
  const eps = { base: M.forecast.dcf.blend.methods.find(m => m.key === 'pe').metric };
  for (const k of ['bull', 'bear']) eps[k] = M.forecast.scenarios[k].blend.methods.find(m => m.key === 'pe').metric;
  const out = {};
  for (const k of ['base', 'bull', 'bear']) {
    const v = stakeValues(S, k), core = S.coreMultiple[k];
    const perShare = v.total / shares;
    out[k] = { core, eps: eps[k], stakesPerShare: perShare, coreValue: core * eps[k], value: core * eps[k] + perShare, multiple: Math.round((core + perShare / eps[k]) * 1000) / 1000, v };
  }
  return out;
}

module.exports = { stakeValues, composite };

if (require.main === module) {
  const A = JSON.parse(fs.readFileSync(AF, 'utf8')), M = JSON.parse(fs.readFileSync(MF, 'utf8'));
  const C = composite(A.stakes, M);
  for (const [k, c] of Object.entries(C)) console.log(k.padEnd(5), `core ${c.core}x x EPS ${c.eps.toFixed(1)} = ${c.coreValue.toFixed(0)} | stakes Rs${c.v.total.toFixed(0)} cr = Rs${c.stakesPerShare.toFixed(0)}/sh (Ather ${c.v.ather.toFixed(0)}, HFCL ${c.v.hfcl.toFixed(0)}, other ${c.v.others}) | value ${c.value.toFixed(0)} | composite ${c.multiple}x`);
  const pe = A.valuation.blend.methods.find(m => m.key === 'pe');
  const name = `P/E (${A.stakes.coreMultiple.base}x core) + stakes`;
  const stale = ['base', 'bull', 'bear'].filter(k => Math.abs(pe.multiple[k] - C[k].multiple) > 0.0005).concat(pe.name === name ? [] : ['name']);
  if (process.argv.includes('--sync')) {
    if (!stale.length) console.log('composite multiples already in sync');
    else { for (const k of ['base', 'bull', 'bear']) pe.multiple[k] = C[k].multiple; pe.name = name; fs.writeFileSync(AF, JSON.stringify(A, null, 1) + '\n'); console.log('assumptions.json updated; rebuild with node src/model.js HEROMOTOCO'); }
  } else console.log(stale.length ? `STALE: ${stale.join(', ')} (run with --sync)` : 'in sync');
}
