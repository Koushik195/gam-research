// Poly Medicure: write the derived inputs into assumptions.json, then rebuild the model, until nothing changes.
// POLYMED.ctx.js derives (1) revenue growth from the revenue build, (2) other income from its sourced parts (6.33% on average
// gross treasury + Egyptian associate + ₹10 cr recurring grants/misc + forex at the FY24-26 ratio to international organic
// revenue), (3) the engine tax rate = (tax on PBT + minorities) / PBT, (4) the P/E multiples (own one-year-forward median
// since Apr-2021 on profit before the FY26 exceptional items, market value at each date so the QIP is handled, x the
// pharma factor 1.082 for names outside the nine-name set, nearest half-turn) and (5) the EV/EBITDA cross-check multiples
// (own forward EV/EBITDA median x 1.075). The ctx refuses to load while the assumptions and the derivation differ, so this
// runs it with TP_NOCHECK=1. Usage: node tools/authoring/POLYMED.mult.js (runs src/model.js itself; repeats until unchanged)
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const ROOT = path.join(__dirname, '..', '..');
const FILE = path.join(ROOT, 'data', 'raw', 'POLYMED', 'research', 'assumptions.json');
const same = (a, c) => JSON.stringify(a) === JSON.stringify(c);

function syncOnce() {
  process.env.TP_NOCHECK = '1';
  for (const m of ['./POLYMED.ctx', './POLYMED.base']) delete require.cache[require.resolve(m)];
  const X = require('./POLYMED.ctx');
  const { n1, n2 } = X;
  const as = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  const pe = as.valuation.blend.methods.find(m => m.key === 'pe'), ev = as.valuation.blend.methods.find(m => m.key === 'ev');
  const want = { revenueGrowth: X.growthBuild, otherIncome: X.oiBuild, taxRate: X.taxRateBuild, pe: { ...X.MULT }, ev: { ...X.EVM } };
  const oiWhy = `Built from sourced parts (AR FY26 note 29, AR FY25 note 25; checked in POLYMED.ctx.js): (1) treasury income at ${X.TY}% (FY26 return on mutual funds, AR FY26 key ratios; FY26 treasury income ₹${n1(X.T26)} cr = ${n2(X.yld26)}% of average gross cash) on average gross cash and investments on our path (engine net cash plus debtBuild): ₹${X.oiTreas.map(n1).join(' / ')} cr; (2) share of profit of the Egyptian associate (Ultra for Medical Products, 30%; FY25 ₹5.2 cr, FY26 ₹5.7 cr, Q1FY27 ₹1.6 cr; Screener books it in other income) ₹${X.ASSOC.join(' / ')} cr; (3) recurring government grants and miscellaneous income ₹${X.REC} cr (FY24 ₹6.2 cr, FY25 ₹8.4 cr, FY26 ₹15.4 cr); (4) foreign-exchange gains at ${n2(X.FXR * 100)}% of international organic revenue, the FY24-26 average (FY24 ₹15.7 cr = ${n2(X.fx.FY24 * 100)}%, FY25 ₹21.6 cr = ${n2(X.fx.FY25 * 100)}%, FY26 ₹38.6 cr = ${n2(X.fx.FY26 * 100)}%): ₹${X.oiFx.map(n1).join(' / ')} cr. Exporters gain when the rupee drifts down while receivables are outstanding; a flat rupee would remove this part (~₹2.2-2.7 of EPS). Not forecast: provisions written back. FY26 ₹120.1 cr (treasury ₹64.0 cr, forex ₹38.6 cr, grants/misc ₹15.4 cr, other ₹2.0 cr); twelve months to Jun-26 ₹117 cr (Screener). FY27E is lower because the QIP cash was spent on PendraCare, Citieffe and capex (gross cash ₹1,227 cr at Mar-25, ₹842 cr at Mar-26).`;
  const peWhy = `How the street values Polymed: every broker note we could read that discloses a method uses P/E on forward EPS (Waya 50x FY28E, Dec-2025; IIFL 52x FY27 in Feb-2025 before its Feb-2026 downgrade; LKP ~50x FY27E; FundsIndia 61x FY26E) except ICICI Securities (30x FY26E EV/EBITDA, 2024). ${X.MULT.base}x Sep-28E EPS = Polymed's median one-year-forward P/E from 1-Apr-2021 to 30-Sep-2026 (every weekly close plus the 30-Sep close, ${X.HB.n} points; market value at each date over the next full year's profit to shareholders, so the Aug-2024 QIP shares count only from their allotment; FY26 before the ₹16.5 cr labour-code and acquisition costs), ${n1(X.HB.med)}x, x ${X.k.toFixed(3)} (thin-peer-set rule: listed med-tech names are too few or too new, so the nine-name pharma factor for names outside the set, +${X.SECTOR}%, PLAYBOOK §7c; reproduced ${X.pc1(X.sectorCalc)}) = ${n1(X.HB.med * X.k)}x, nearest half-turn ${X.MULT.base}x. No trough years. Bull ${X.MULT.bull}x / bear ${X.MULT.bear}x = 75th / 25th percentiles x the factor. Sensitivities (not used): reported profit ${X.SENS.rep}x, Screener EPS on year-end shares ${X.SENS.ye}x, from Apr-2022 ${X.SENS.from22}x, wider healthcare set ${X.SENS.wide}x, Laxmi Dental's same-window move ${X.SENS.medtech}x. Checked in POLYMED.ctx.js; written by POLYMED.mult.js.`;
  const evWhy = `Cross-check. Polymed's median one-year-forward EV/EBITDA since 1-Apr-2021 (EV = price x shares at the date + net debt at the latest March, with the ₹${n0(X.QIP_NET)} cr net QIP proceeds deducted from the 22-Aug-2024 allotment; EBITDA = next full fiscal year, Screener FY22-26 and our FY27-28E), ${n1(X.HEV.med)}x, x ${X.kev.toFixed(3)} (the pharma EV/EBITDA factor for names outside the set, +${X.SECTOR_EV}%; reproduced ${X.pc1(X.sectorEvCalc)}) = ${X.EVM.base}x, applied to Sep-28E EBITDA plus the engine's Sep-28E net cash. Bull ${X.EVM.bull}x / bear ${X.EVM.bear}x = 75th / 25th percentiles x the factor.`;
  function n0(v) { return Math.round(v).toLocaleString('en-IN'); }
  const changed = !same(as.revenueGrowth, want.revenueGrowth) || !same(as.otherIncome, want.otherIncome) || !same(as.taxRate, want.taxRate) || !same(pe.multiple, want.pe) || !same(ev.multiple, want.ev) || pe.why !== peWhy || ev.why !== evWhy || as._otherIncomeWhy !== oiWhy;
  if (changed) {
    Object.assign(as, { revenueGrowth: want.revenueGrowth, otherIncome: want.otherIncome, taxRate: want.taxRate, _otherIncomeWhy: oiWhy });
    pe.multiple = want.pe; ev.multiple = want.ev; pe.why = peWhy; ev.why = evWhy;
    fs.writeFileSync(FILE, JSON.stringify(as, null, 1));
  }
  return { changed, want };
}

if (require.main === module) {
  for (let i = 0; i < 10; i++) {
    const { changed, want } = syncOnce();
    console.log(`POLYMED.mult pass ${i + 1}: ${changed ? 'updated' : 'unchanged'} ${JSON.stringify(want)}`);
    if (!changed) break;
    execFileSync(process.execPath, [path.join(ROOT, 'src', 'model.js'), 'POLYMED'], { stdio: 'inherit' });
  }
}
module.exports = { syncOnce };
