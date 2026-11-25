// Sai Life Sciences: write the built other income, interest and the derived multiples into assumptions.json, rebuilding the
// model until nothing changes. SAILIFE.ctx.js builds other income (FY26 realised deposit yield on the gross cash Sai keeps +
// small items) and interest (8.5% on average bank debt implied by the engine's net-debt path + lease interest + other), and
// derives the EV/EBITDA target multiple (Sai's median one-year-forward EV/EBITDA since 1-Jul-2025 on every weekly close plus the
// 30-Sep close x the pharma same-window EV/EBITDA factor of 1.091, nearest half-turn; bull/bear = 75th/25th percentile x the
// factor) and the P/E cross-check (median forward P/E over the same window x 1.185). Interest and the forward history depend
// on the forecast, so each pass rebuilds the model (node src/model.js SAILIFE).
// Usage: node tools/authoring/SAILIFE.mult.js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const ROOT = path.join(__dirname, '..', '..');
const FILE = path.join(ROOT, 'data', 'raw', 'SAILIFE', 'research', 'assumptions.json');
const r2 = v => Math.round(v * 100) / 100;

function pass() {
  process.env.TP_NOCHECK = '1';
  delete require.cache[require.resolve('./SAILIFE.ctx')];
  const X = require('./SAILIFE.ctx');
  const as = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  const ev = as.valuation.blend.methods.find(m => m.key === 'ev'), pe = as.valuation.blend.methods.find(m => m.key === 'pe');
  const n1 = X.n1;
  const oi = X.oiBuild.map(r2), int = X.intBuild.map(r2);
  const evWhy = `How the street values Sai Life: all three brokers that disclose a method use EV/EBITDA (HDFC Securities 29x Q3FY28E, Jan-2026; JM Financial 32x Sep-27E, Nov-2025; Jefferies initiated on 27x FY27 pre-Ind AS EV/EBITDA, Mar-2025); Kotak and Morgan Stanley targets come without a method. ${X.MULT.base}x = Sai's median one-year-forward EV/EBITDA since 1-Jul-2025 (listed 18-Dec-2024; IPO months skipped; every weekly close plus the 30-Sep close, ${X.EVH.n} points; EV = market value less the last published net cash incl. deposits and leases; forward EBITDA = our FY27E/FY28E, which carry no exceptional items, so the pre-exceptional and reported medians are the same) of ${n1(X.EVH.med)}x x 1.091 (nine pharma peers' trailing EV/EBITDA at the 30-Sep close vs their medians over the same window, PLAYBOOK §7c; reproduced ${X.pc1(X.sectorEvCalc)}) = ${n1(X.EVH.med * X.kev)}x, nearest half-turn, on Sep-28E EBITDA plus Sep-28E net cash (negative: net debt incl. leases). Bull ${X.MULT.bull}x / bear ${X.MULT.bear}x = 75th / 25th percentile (${n1(X.EVH.p75)}x / ${n1(X.EVH.p25)}x) x 1.091. No own-move blend, no growth uplift (sensitivities only). Written by SAILIFE.mult.js.`;
  const peWhy = `Cross-check: Sai's median one-year-forward P/E since 1-Jul-2025 (same weekly closes; forward EPS = our FY27E/FY28E) of ${n1(X.HB.med)}x x 1.185 (the nine peers' P/E move over the same window, PLAYBOOK §7c; reproduced ${X.pc1(X.sectorCalc)}) = ${n1(X.HB.med * X.k)}x, nearest half-turn, on Sep-28E EPS. Bull ${X.PEM_D.bull}x / bear ${X.PEM_D.bear}x = 75th / 25th percentile x 1.185.`;
  const oiWhy = `Built from sourced parts (checked in SAILIFE.ctx.js): (1) interest on cash, deposits and funds at ${X.TY.toFixed(2)}%, the yield Sai realised in FY26 (deposit interest Rs${X.OIN.FY26.depositInterest} cr on average gross treasury of ~Rs${Math.round((X.G25 + X.G0) / 2)} cr: Rs${Math.round(X.G25)} cr at Mar-25 incl. unspent IPO money, Rs${Math.round(X.G0)} cr at Mar-26), applied to the gross cash and deposits we assume Sai keeps (Rs${Math.round(X.G0)} cr at Mar-26, ~Rs200 cr thereafter, borrowing the rest of its capex); (2) other small items Rs${X.MISC} cr (FY26 Rs0.9 cr). No forex gains forecast (FY26 Rs29.8 cr, FY25 Rs19.1 cr; the company reports them inside EBITDA). Government incentives (Rs31.3 cr in FY26) are revenue, not other income. FY26 other income Rs49.1 cr incl. forex (Screener, net of the Rs9.0 cr exceptional: Rs40.2 cr); Q1FY27 Rs3.5 cr (Rs14 cr annualised) as the IPO cash was spent.`;
  const intWhy = `Built in SAILIFE.ctx.js: ${X.KD}% on average bank debt (Rs${X.BORR.map(v => Math.round(v)).join(' -> ')} cr, Mar-26 to Mar-29E: the engine's net debt plus the ~Rs200 cr of gross cash less Rs${X.LEASES} cr of leases; AA-rated borrower) plus lease interest at FY26's ${X.LR.toFixed(1)}% on Rs${X.LEASES} cr of lease liabilities (Rs${n1(X.LEASE_INT)} cr) plus ~Rs${X.OTHER_FIN} cr of other finance costs. FY26 finance cost Rs39.2 cr (borrowings Rs11.0 cr, leases Rs23.2 cr, other Rs5.0 cr); Q1FY27 Rs8 cr. Capitalised interest during construction (nil in FY26) is not assumed.`;
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
    console.log(`SAILIFE.mult pass ${i}: ${r.changed ? 'updated' : 'unchanged'}. EV ${JSON.stringify(r.MULT)}, P/E ${JSON.stringify(r.PEM)}, OI ${r.oi}, interest ${r.int}`);
    if (!r.changed) return true;
    execSync('node src/model.js SAILIFE', { cwd: ROOT, stdio: 'ignore', timeout: 120000 });
  }
  console.warn('SAILIFE.mult: did not converge');
  return false;
}

module.exports = { syncAll };
if (require.main === module) syncAll();
