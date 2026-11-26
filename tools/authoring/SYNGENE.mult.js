// Syngene: write the built other income, interest and the derived multiples into assumptions.json, rebuilding the model until
// nothing changes. SYNGENE.ctx.js builds other income (FY26 realised yield on average gross treasury + lease-deposit interest) and
// interest (lease interest at FY26's rate + small bank debt + other); SYNGENE.ctx2.js derives the EV/EBITDA target multiple
// (Syngene's median one-year-forward EV/EBITDA since 1-Apr-2021 on every weekly close plus the 30-Sep close x the pharma five-year
// EV/EBITDA factor of 1.075, nearest half-turn; bull/bear = 75th/25th percentile x the factor) and the P/E cross-check (forward
// P/E on EPS before exceptional items, trough year FY27 left out, x 1.082). Other income and the forward history depend on the
// forecast, so each pass rebuilds the model (node src/model.js SYNGENE). Usage: node tools/authoring/SYNGENE.mult.js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const ROOT = path.join(__dirname, '..', '..');
const FILE = path.join(ROOT, 'data', 'raw', 'SYNGENE', 'research', 'assumptions.json');
const r2 = v => Math.round(v * 100) / 100;

function pass() {
  process.env.TP_NOCHECK = '1';
  for (const m of ['./SYNGENE.ctx', './SYNGENE.ctx2']) delete require.cache[require.resolve(m)];
  const X = require('./SYNGENE.ctx2');
  delete process.env.TP_NOCHECK;
  const as = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  const ev = as.valuation.blend.methods.find(m => m.key === 'ev'), pe = as.valuation.blend.methods.find(m => m.key === 'pe');
  const { n1, n0 } = X;
  const oi = X.oiBuild.map(r2), int = X.intBuild.map(r2);
  const evWhy = `How the street values Syngene: the brokers that disclose a method use EV/EBITDA (ICICI Securities 24x FY27E in its last accessible note, Apr-2025; Nuvama values Syngene at 22x EV/EBITDA inside its Biocon sum of the parts, Nov-2025; YES Securities shows EV/EBITDA in its valuation table); Macquarie, Jefferies, Goldman Sachs and Kotak targets come without a method. ${X.MULT.base}x = Syngene's median one-year-forward EV/EBITDA since 1-Apr-2021 (every weekly close plus the 30-Sep close, ${X.EVH.n} points; EV = price x shares then outstanding less the net cash last published at the March year-end, incl. leases; forward EBITDA = the next full year's: actual FY23-26, our FY27E/FY28E; EBITDA is before exceptional items, so the pre-exceptional and reported medians are the same; no trough year: FY27E EBITDA is above half the FY24-26 peak) of ${n1(X.EVH.med)}x x 1.075 (the nine pharma peers' EV/EBITDA at the 30-Sep close vs their five-year medians; Syngene is outside the set, PLAYBOOK §7c; reproduced ${X.pc1(X.sectorEvCalc)}) = ${n1(X.EVH.med * X.kev)}x, nearest half-turn, on Sep-28E EBITDA plus Sep-28E net cash. Bull ${X.MULT.bull}x / bear ${X.MULT.bear}x = 75th / 25th percentile (${n1(X.EVH.p75)}x / ${n1(X.EVH.p25)}x) x 1.075. No own-move blend, no growth uplift (sensitivities only). Written by SYNGENE.mult.js.`;
  const peWhy = `Cross-check: Syngene's median one-year-forward P/E since 1-Apr-2021 on EPS before exceptional items (same weekly closes; FY27 left out as a trough year: FY27E EPS Rs${X.epsU[0].toFixed(2)} is below half of FY24's Rs${X.epsEx[2024].toFixed(2)}) of ${n1(X.HB.med)}x x 1.082 (nine peers' five-year P/E move, PLAYBOOK §7c; reproduced ${X.pc1(X.sectorCalc)}) = ${n1(X.HB.med * X.k)}x, nearest half-turn, on Sep-28E EPS. Reported-EPS median ${n1(X.HB_rep.med)}x (sensitivity). Bull ${X.PEM_D.bull}x / bear ${X.PEM_D.bear}x = 75th / 25th percentile x 1.082.`;
  const oiWhy = `Built from sourced parts (checked in SYNGENE.ctx.js): (1) treasury income at ${X.TY.toFixed(2)}%, the yield Syngene realised in FY26 (interest on deposits and ICDs Rs${X.OIN.FY26.depositInterest} cr + gains on liquid funds Rs${X.OIN.FY26.mfGains} cr on average year-end gross treasury of ~Rs${n0((X.G25 + X.G26) / 2)} cr: Rs${n0(X.G25)} cr at Mar-25, Rs${n0(X.G26)} cr at Mar-26), applied to average gross treasury (engine net cash + Rs${n0(X.LEASES)} cr of leases + Rs${X.BANK} cr of bank debt - Rs${X.STRAT} cr of strategic unlisted stakes): Rs${X.GROSS.map(v => n0(v)).join(' -> ')} cr, Mar-26 to Mar-29E; (2) interest on lease and security deposits ~Rs${X.MISC} cr (FY26 Rs1.1 cr). Tax-refund interest (FY26 Rs1.1 cr, FY25 Rs4.7 cr) is not repeated; forex sits in EBITDA. FY26 company other income Rs70.7 cr; Q1FY27 Rs25 cr; twelve months to Jun-26 ~Rs${n0(X.ttmOiCo)} cr. Screener's history nets exceptional items (FY26 -Rs9 cr).`;
  const intWhy = `Built in SYNGENE.ctx.js: lease interest at FY26's ${X.LR.toFixed(1)}% (Rs${X.FCN.leases} cr on average leases of ~Rs454 cr) on Rs${n0(X.LEASES)} cr of lease liabilities held flat (Rs${n1(X.LEASE_INT)} cr) + ${X.KD}% on Rs${X.BANK} cr of short-term bank debt + ~Rs${X.OTHER_FIN} cr of exchange differences and other finance costs (FY26 Rs4.0 cr as packing-credit debt fell from Rs120 cr). FY26 finance cost Rs48.8 cr (borrowings Rs6.6 cr, leases Rs38.2 cr, exchange difference Rs4.0 cr); Q1FY27 Rs10 cr.`;
  const same = (a, c) => ['base', 'bull', 'bear'].every(key => a?.[key] === c[key]);
  const eqArr = (a, c) => a.length === c.length && a.every((v, i) => Math.abs(v - c[i]) < 0.005);
  const changed = !same(ev.multiple, X.MULT) || !same(pe.multiple, X.PEM_D) || ev.why !== evWhy || pe.why !== peWhy || !eqArr(as.otherIncome, oi) || !eqArr(as.interest, int) || as._otherIncomeWhy !== oiWhy || as._interestWhy !== intWhy;
  if (changed) {
    ev.multiple = { ...X.MULT }; pe.multiple = { ...X.PEM_D }; ev.why = evWhy; pe.why = peWhy;
    as.otherIncome = oi; as.interest = int; as._otherIncomeWhy = oiWhy; as._interestWhy = intWhy;
    fs.writeFileSync(FILE, JSON.stringify(as, null, 1));
  }
  return { changed, MULT: X.MULT, PEM: X.PEM_D, oi, int };
}

function syncAll(maxPasses = 12) {
  for (let i = 1; i <= maxPasses; i++) {
    const r = pass();
    console.log(`SYNGENE.mult pass ${i}: ${r.changed ? 'updated' : 'unchanged'}. EV ${JSON.stringify(r.MULT)}, P/E ${JSON.stringify(r.PEM)}, OI ${r.oi}, interest ${r.int}`);
    if (!r.changed) return true;
    execSync('node src/model.js SYNGENE', { cwd: ROOT, stdio: 'ignore', timeout: 120000 });
  }
  console.warn('SYNGENE.mult: did not converge');
  return false;
}

module.exports = { syncAll };
if (require.main === module) syncAll();
