// Acutaas Chemicals: write the derived multiples and the built other income into assumptions.json. ACUTAAS.ctx.js derives the P/E
// (Acutaas's median one-year-forward P/E since 1-Apr-2022 on every weekly close plus the 30-Sep close, forward EPS before the FY24
// JV impairment, x the pharma same-window factor of 1.078, nearest half-turn; bull/bear = 75th/25th percentile x the factor), the
// EV/EBITDA cross-check (median forward EV/EBITDA over the same window x 1.075) and other income (3.5% on average net cash +
// Rs0.5 cr). The forward history and the cash path use our forecasts, so run this after every forecast change. Run with
// TP_NOCHECK=1, then rebuild the model; repeat until "unchanged".
// Usage: TP_NOCHECK=1 node tools/authoring/ACUTAAS.mult.js
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', '..', 'data', 'raw', 'ACUTAAS', 'research', 'assumptions.json');

function syncMult() {
  process.env.TP_NOCHECK = '1';
  delete require.cache[require.resolve('./ACUTAAS.ctx')];
  const X = require('./ACUTAAS.ctx');
  const as = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  const pe = as.valuation.blend.methods.find(m => m.key === 'pe'), ev = as.valuation.blend.methods.find(m => m.key === 'ev');
  const same = (a, c) => ['base', 'bull', 'bear'].every(key => a?.[key] === c[key]);
  const n1 = X.n1;
  const peWhy = `How the street values Acutaas: of the brokers that disclose a method, PL uses P/E (56x FY28E) and Kotak Institutional Equities a sum of the parts that puts 35x Jun-28E P/E on the business outside the Nubeqa contract; HSIE frames its SELL against the stock's ~41x five-year average one-year-forward P/E. ${X.MULT.base}x = Acutaas's median one-year-forward P/E since 1-Apr-2022 (listed 14-Sep-2021; IPO months skipped; every weekly close plus the 30-Sep close, ${X.HB.n} points; forward EPS = FY24 before the Rs32.1 cr JV impairment (Rs${n1(X.eps24ex)} vs Rs5.80 reported; the median is ${n1(X.HREP.med)}x on reported EPS too), FY25-26 reported, our FY27E/FY28E) of ${n1(X.HB.med)}x x 1.078 (nine pharma peers' trailing P/E at the 30-Sep close vs their medians over the same window, PLAYBOOK §7c; reproduced ${X.pc1(X.sectorCalc)}) = ${n1(X.HB.med * X.k)}x, nearest half-turn. Trough rule: FY24 reported EPS Rs5.80 is just above half the prior three-year peak (Rs5.72), so no year is left out. Bull ${X.MULT.bull}x / bear ${X.MULT.bear}x = 75th / 25th percentile (${n1(X.HB.p75)}x / ${n1(X.HB.p25)}x) x 1.078. No own-move blend, no growth uplift, no chemicals factor (sensitivities only). Written by ACUTAAS.mult.js.`;
  const evWhy = `Cross-check: Acutaas's median one-year-forward EV/EBITDA since 1-Apr-2022 (EV at each weekly close = price x shares then outstanding less the last published net cash, over the next full year's EBITDA, Screener basis) of ${n1(X.EVH.med)}x x 1.075 (the nine peers' EV/EBITDA move over the same window; reproduced ${X.pc1(X.sectorEvCalc)} unrounded) = ${n1(X.EVH.med * X.kev)}x, nearest half-turn, on Sep-28E EBITDA plus Sep-28E net cash. Bull ${X.EVM.bull}x / bear ${X.EVM.bear}x = 75th / 25th percentile x 1.075.`;
  const oiChanged = as.otherIncome.some((v, i) => v !== X.oiBuild[i]);
  const changed = oiChanged || !same(pe.multiple, X.MULT) || !same(ev.multiple, X.EVM) || pe.why !== peWhy || ev.why !== evWhy;
  if (changed) {
    pe.multiple = { ...X.MULT }; ev.multiple = { ...X.EVM }; pe.why = peWhy; ev.why = evWhy; as.otherIncome = X.oiBuild.slice();
    fs.writeFileSync(FILE, JSON.stringify(as, null, 1));
    console.log(`ACUTAAS.mult: updated. P/E ${JSON.stringify(X.MULT)}, EV/EBITDA ${JSON.stringify(X.EVM)}, other income ${JSON.stringify(X.oiBuild)}. Re-run node src/model.js ACUTAAS.`);
  } else console.log(`ACUTAAS.mult: unchanged. P/E ${JSON.stringify(X.MULT)}, EV/EBITDA ${JSON.stringify(X.EVM)}, other income ${JSON.stringify(X.oiBuild)}`);
  return { changed };
}

module.exports = { syncMult };
if (require.main === module) syncMult();
