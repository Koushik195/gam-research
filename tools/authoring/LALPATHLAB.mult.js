// Dr Lal PathLabs: write the derived inputs into assumptions.json, then rebuild the model, until nothing changes.
// LALPATHLAB.ctx.js derives (1) the other-income build (6.75% on average gross cash, deposits and liquid funds + ₹6 cr of
// recurring rent and miscellaneous income), (2) the engine tax rate = (25.4% tax on PBT + minorities) / PBT from taxBuild,
// (3) the P/E multiples (Dr Lal's median one-year-forward P/E since Apr-2021 on EPS before exceptional items x the
// diagnostics sector factor of 0.994, nearest half-turn; bull/bear = 75th/25th percentile x the factor) and (4) the
// EV/EBITDA cross-check multiples (own forward EV/EBITDA median x 1.215). The ctx refuses to load while the assumptions
// and the derivation differ, so this runs it with TP_NOCHECK=1. Writes the `why` texts with the derived numbers.
// Usage: node tools/authoring/LALPATHLAB.mult.js   (runs src/model.js itself; repeats until "unchanged")
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const ROOT = path.join(__dirname, '..', '..');
const FILE = path.join(ROOT, 'data', 'raw', 'LALPATHLAB', 'research', 'assumptions.json');
const same = (a, c) => JSON.stringify(a) === JSON.stringify(c);
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);

function syncOnce() {
  process.env.TP_NOCHECK = '1';
  delete require.cache[require.resolve('./LALPATHLAB.ctx')];
  const X = require('./LALPATHLAB.ctx');
  const as = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  const pe = as.valuation.blend.methods.find(m => m.key === 'pe'), ev = as.valuation.blend.methods.find(m => m.key === 'ev');
  const want = { otherIncome: X.oiBuild, taxRate: X.taxRateBuild, pe: { ...X.MULT }, ev: { ...X.EVM } };
  const peWhy = `How the street values Dr Lal: of the notes standing on 30-Sep-2026 that disclose a method, three use P/E on forward EPS (JM Financial 48x Jun-28E, Nomura 45x Mar-28E, HDFC Securities 44x Q3FY28E) and one uses DCF (Emkay, cross-checked at 46-48x FY28E P/E); Kotak, ICICI Securities and 360 ONE do not disclose theirs. ${X.MULT.base}x Sep-28E EPS = Dr Lal's median one-year-forward P/E from 1-Apr-2021 to 30-Sep-2026 (every weekly close plus the 30-Sep close, ${X.HB.n} points) on EPS before exceptional items (FY25 ex the ₹40.8 cr Suburban-liquidation tax credit, FY26 ex the ₹30.1 cr labour-code charge), ${n1(X.HB.med)}x, x ${X.k.toFixed(3)} (the three diagnostics peers' P/E at the 30-Sep close vs their five-year medians: Metropolis ${X.dr5.METROPOLIS}%, Vijaya +${X.dr5.VIJAYA}%, Thyrocare ${X.dr5.THYROCARE}%; median ${X.SECTOR}%, PLAYBOOK §7c) = ${n1(X.HB.med * X.k)}x, nearest half-turn ${X.MULT.base}x. No trough years (FY23's ₹14.33 is above half of FY22's COVID-boosted ₹20.69). The window includes the FY22 COVID-testing year as §4 requires (a windfall is not a one-off); the median from 1-Apr-2022 (${n1(X.H22.med)}x, ${X.mult22}x after the factor) is a sensitivity. Bull ${X.MULT.bull}x / bear ${X.MULT.bear}x = 75th / 25th percentiles x the factor. The model's EPS is EPS to shareholders (minorities in the tax line) with no exceptional items, so the engine multiple equals the derived one. Checked in LALPATHLAB.ctx.js; written by LALPATHLAB.mult.js.`;
  const evWhy = `Cross-check. Dr Lal's median one-year-forward EV/EBITDA since 1-Apr-2021 (EV = price x 16.76 cr shares + net debt at the latest March, lease liabilities less cash, investments and disclosed non-current deposits; EBITDA = next full fiscal year, FY22-26 actual and FY27-28E ours), ${n1(X.HEV.med)}x, x ${X.kev.toFixed(3)} (the same three peers' EV/EBITDA at the 30-Sep close vs their five-year medians: Metropolis ${X.dr5ev.METROPOLIS}%, Vijaya +${X.dr5ev.VIJAYA}%, Thyrocare +${X.dr5ev.THYROCARE}%; median +${X.SECTOR_EV}%) = ${X.EVM.base}x, applied to Sep-28E EBITDA plus the engine's Sep-28E net cash (after lease liabilities). Bull ${X.EVM.bull}x / bear ${X.EVM.bear}x = 75th / 25th percentiles x the same factor. The EV factor is far above the P/E factor because Thyrocare, the median peer in both, grew profit much faster than EBITDA in FY26; see the valuation chapter.`;
  const changed = !same(as.otherIncome, want.otherIncome) || !same(as.taxRate, want.taxRate) || !same(pe.multiple, want.pe) || !same(ev.multiple, want.ev) || pe.why !== peWhy || ev.why !== evWhy;
  if (changed) {
    as.otherIncome = want.otherIncome; as.taxRate = want.taxRate; pe.multiple = want.pe; ev.multiple = want.ev; pe.why = peWhy; ev.why = evWhy;
    fs.writeFileSync(FILE, JSON.stringify(as, null, 1));
  }
  return { changed, want };
}

if (require.main === module) {
  for (let i = 0; i < 8; i++) {
    const { changed, want } = syncOnce();
    console.log(`LALPATHLAB.mult pass ${i + 1}: ${changed ? 'updated' : 'unchanged'} ${JSON.stringify(want)}`);
    if (!changed) break;
    execFileSync(process.execPath, [path.join(ROOT, 'src', 'model.js'), 'LALPATHLAB'], { stdio: 'inherit' });
  }
}
module.exports = { syncOnce };
