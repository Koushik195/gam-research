// OneSource: write the built interest, other income and derived multiples into assumptions.json. ONESOURCE.ctx.js derives
// the EV/EBITDA multiple (OneSource's median one-year-forward EV/EBITDA since 13-May-2026 on every weekly close plus the
// 30-Sep close, x the nine pharma peers' EV/EBITDA move over the same window, nearest half-turn; bull/bear = 75th/25th
// percentile x the factor) and the P/E cross-check the same way. Interest depends on the engine's net-debt path, and the
// forward histories on our FY28E EBITDA/EPS, so run this after every forecast change, rebuild the model and repeat until
// "unchanged". Usage: TP_NOCHECK=1 node tools/authoring/ONESOURCE.mult.js
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', '..', 'data', 'raw', 'ONESOURCE', 'research', 'assumptions.json');

function syncMult() {
  process.env.TP_NOCHECK = '1';
  for (const m of ['./ONESOURCE.ctx', './ONESOURCE.ctxA']) delete require.cache[require.resolve(m)];
  const X = require('./ONESOURCE.ctx');
  const as = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  const ev = as.valuation.blend.methods.find(m => m.key === 'ev'), pe = as.valuation.blend.methods.find(m => m.key === 'pe');
  const n1 = X.n1, r1 = v => Math.round(v * 10) / 10, r2 = v => Math.round(v * 100) / 100;
  const evWhy = `How the street values OneSource: three of the four brokers that disclose a method use EV/EBITDA (ICICI Securities a sum of the parts at 19x DDC and 16x soft gel and injectables FY28E EBITDA, Sep-2026; JM Financial 22x Sep-27E, Nov-2025; Investec 23x FY27E, May-2025); DAM Capital uses 30x FY28E EPS; SBICAP states no method. ${X.EVM.base}x = OneSource's median one-year-forward EV/EBITDA since ${X.FROM_TXT} (listed 24-Jan-2025; the window starts at the Q4FY26 results, the first of the profitable quarters after the Q3FY26 loss, and the forward year is FY28E throughout; every weekly close plus the 30-Sep close, ${X.EVH.n} points; EV = market value + the last published company net debt excl. leases, as in the engine; forward EBITDA = our FY28E, before exceptional items, so the pre-exceptional and reported medians are the same) of ${n1(X.EVH.med)}x x ${X.kev.toFixed(3)} (nine pharma peers' trailing EV/EBITDA at the 30-Sep close vs their medians over the same window, PLAYBOOK §7c; reproduced ${X.pc1(X.sectorEvCalc)}) = ${n1(X.EVH.med * X.kev)}x, nearest half-turn, on Sep-28E EBITDA plus Sep-28E net debt. Bull ${X.EVM.bull}x / bear ${X.EVM.bear}x = 75th / 25th percentile (${n1(X.EVH.p75)}x / ${n1(X.EVH.p25)}x) x ${X.kev.toFixed(3)}. Trough test on EBITDA: FY28E is far above half the best of FY24-26 (FY25 Rs467 cr); none. No own-move blend, no growth uplift (sensitivities only). Written by ONESOURCE.mult.js.`;
  const peWhy = `Cross-check: OneSource's median one-year-forward P/E since ${X.FROM_TXT} (same weekly closes; forward EPS = our FY28E, reported basis incl. the Rs137.8 cr scheme amortisation, no exceptional items) of ${n1(X.PEH.med)}x x ${X.k.toFixed(3)} (the nine peers' P/E move over the same window, PLAYBOOK §7c; reproduced ${X.pc1(X.sectorPeCalc)}) = ${n1(X.PEH.med * X.k)}x, nearest half-turn, on Sep-28E EPS. Bull ${X.PEM.bull}x / bear ${X.PEM.bear}x = 75th / 25th percentile x ${X.k.toFixed(3)}. DAM Capital: 30x FY28E EPS.`;
  const interest = X.intBuild.map(r2), otherIncome = X.oiBuild.map(r2);
  const sameM = (a, c) => ['base', 'bull', 'bear'].every(key => a?.[key] === c[key]);
  const sameA = (a, c) => a.length === c.length && a.every((x, i) => Math.abs(x - c[i]) < 0.01);
  const changed = !sameM(ev.multiple, X.EVM) || !sameM(pe.multiple, X.PEM) || ev.why !== evWhy || pe.why !== peWhy || !sameA(as.interest, interest) || !sameA(as.otherIncome, otherIncome);
  if (changed) {
    ev.multiple = { ...X.EVM }; pe.multiple = { ...X.PEM }; ev.why = evWhy; pe.why = peWhy; as.interest = interest; as.otherIncome = otherIncome;
    fs.writeFileSync(FILE, JSON.stringify(as, null, 1));
    console.log(`ONESOURCE.mult: updated. EV ${JSON.stringify(X.EVM)}, P/E ${JSON.stringify(X.PEM)}, interest ${interest}, OI ${otherIncome}. Re-run node src/model.js ONESOURCE.`);
  } else console.log(`ONESOURCE.mult: unchanged. EV ${JSON.stringify(X.EVM)}, P/E ${JSON.stringify(X.PEM)}, interest ${interest}`);
  return { changed, r1 };
}

module.exports = { syncMult };
if (require.main === module) syncMult();
