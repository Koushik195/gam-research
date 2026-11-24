// Amara Raja: write the built other income and finance cost, the derived SOTP parts and the P/E cross-check multiple into
// assumptions.json. ARE&M.ctx.js builds net liquid funds after ARACT infusions (other income and finance cost follow from
// them), derives the core P/E (own core forward P/E since Apr-2021 x auto-component de-rating, nearest half-turn) and
// values ARACT at book less the PV of losses to breakeven; this script stores those values so the engine and the Excel
// model carry the same target. Other income and finance cost feed EPS, so run model -> val until it reports 'unchanged'.
// Usage: node "tools/authoring/ARE&M.val.js" (also run by ARE&M.js)
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', '..', 'data', 'raw', 'ARE&M', 'research', 'assumptions.json');

function syncMultiples() {
  delete require.cache[require.resolve('./ARE&M.ctx')];
  const X = require('./ARE&M.ctx');
  const as = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  const r = o => Object.fromEntries(X.CASES.map(c => [c, Math.round(o[c])]));
  const r1 = v => Math.round(v * 10) / 10;
  const [core, aract] = as.valuation.parts;
  const want = { core: r(X.coreVal), aract: r(Object.fromEntries(X.CASES.map(c => [c, X.aract[c].value]))) };
  const oi = X.oiB.map(x => r1(x.oi)), fin = X.oiB.map(x => r1(x.fin));
  const pe = as.valuation.blend.methods.find(m => m.key === 'pe');
  const same = (a, c) => X.CASES.every(k => a?.[k] === c[k]);
  const near = (a, c) => a.every((v, i) => Math.abs(v - c[i]) <= 0.15);
  const changed = !same(core.adj, want.core) || !same(aract.adj, want.aract) || !same(pe.multiple, X.peMULT) || !near(as.otherIncome, oi) || !near(as.interest, fin);
  core.adj = want.core; aract.adj = want.aract; pe.multiple = { ...X.peMULT }; as.otherIncome = oi; as.interest = fin;
  core.multiple = undefined;
  core.metricLabel = `Sep-28E standalone EPS Rs${X.n1(X.epsSep.base)} x ${X.MULT.base}x (bull ${X.MULT.bull}x on Rs${X.n1(X.epsSep.bull)}, bear ${X.MULT.bear}x on Rs${X.n1(X.epsSep.bear)}) x ${X.shares.toFixed(2)} cr shares`;
  core.note = `Core P/E = Amara Raja's own forward P/E net of its subsidiaries and before exceptional items (median ${X.coreMed}x, Apr-2021 to Sep-2026) x the auto-component sector move (${X.pc1(X.sectorDr)}), nearest half-turn.`;
  aract.metricLabel = `Book equity at Sep-27E Rs${X.n0(X.aract.base.book)} cr (Mar-26 Rs1,431 cr + Rs${X.n0(X.BL.aract.infusion[0])} cr FY27 infusion − losses) x ${X.aract.base.mult} less PV of losses to breakeven Rs${X.n0(X.aract.base.pv)} cr (bear: 0.5x book)`;
  aract.note = `GAM loss path FY27-30E Rs${X.BL.aract.loss.base.join('/')} cr (bull ${X.BL.aract.loss.bull.join('/')}, bear ${X.BL.aract.loss.bear.join('/')}), discounted at ${X.BL.aract.pvRate}% (PLAYBOOK §7c: present value of losses to breakeven).`;
  fs.writeFileSync(FILE, JSON.stringify(as, null, 1));
  console.log(`ARE&M.val: ${changed ? 'updated' : 'unchanged'}. core ${JSON.stringify(want.core)}, ARACT ${JSON.stringify(want.aract)}, P/E ${JSON.stringify(X.peMULT)}, OI ${oi}, finance ${fin}.${changed ? ' Re-run node src/model.js "ARE&M", then this script again.' : ''}`);
  return { changed };
}

module.exports = { syncMultiples };
if (require.main === module) syncMultiples();
