// Granules India: write the derived multiples and the built other income and interest into assumptions.json. GRANULES.ctx.js derives
// the P/E (house forwardMedian since Apr-2021 on reported EPS, every 5th week, no trough years, x the pharma factor 1.082 for names
// outside the nine-peer set, nearest half-turn; bull/bear = 75th/25th percentile x 1.082), the EV/EBITDA cross-check (own forward
// EV/EBITDA median over the same weeks x 1.075) and the other-income / interest builds. The forward history and the cash path use our
// forecasts, so run this after every forecast change: TP_NOCHECK=1 node tools/authoring/GRANULES.mult.js, then rebuild the model;
// repeat until "unchanged".
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', '..', 'data', 'raw', 'GRANULES', 'research', 'assumptions.json');

function syncMult() {
  process.env.TP_NOCHECK = '1';
  for (const m of ['./GRANULES.ctx', './GRANULES.ctxa', './GRANULES.ctxb']) delete require.cache[require.resolve(m)];
  const X = require('./GRANULES.ctx');
  const as = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  const pe = as.valuation.blend.methods.find(m => m.key === 'pe'), ev = as.valuation.blend.methods.find(m => m.key === 'ev');
  const same = (a, c) => ['base', 'bull', 'bear'].every(key => a?.[key] === c[key]);
  const { n1, HB, k, MULT, EVH, EVM, kev } = X;
  const peWhy = `How the street values Granules: of the six brokers that disclose a method, five use P/E (ICICI Securities 28x FY28E, Choice 25x FY28E, MOSL 23x 12-month forward, Elara 24x FY28E core EPS plus cash, DRChoksey 18x Sep-27E in its last disclosed note) and one a sum of the parts (Emkay). ${MULT.base}x = Granules' own one-year-forward P/E median since Apr-2021 (house forwardMedian: reported EPS, every 5th weekly close, ${HB.n} points; no trough years: FY24 EPS Rs16.72 and FY25 Rs20.68 are above half the prior three-year peak, Rs11.09 and Rs10.67) of ${n1(HB.med)}x x 1.082 (median of the nine-name pharma set's P/E at the 30-Sep close vs its five-year median; Granules is outside the set, PLAYBOOK §7c) = ${n1(HB.med * k)}x, nearest half-turn. Exceptional items are 2-4% of profit, so the base uses reported EPS (the ex-exceptional median is ${n1(X.HEX.med)}x, a sensitivity row). Bull ${MULT.bull}x / bear ${MULT.bear}x = 75th / 25th percentile (${n1(HB.p75)}x / ${n1(HB.p25)}x) x 1.082. No own-move blend, no growth uplift (sensitivities only). Written by GRANULES.mult.js.`;
  const evWhy = `Cross-check: Granules' own one-year-forward EV/EBITDA median since Apr-2021 over the same weeks (EV = price x shares then outstanding + latest published net debt incl. leases; fully diluted with the warrant balance as cash from the Feb-2026 issue; over the next full year's EBITDA, Screener basis) of ${n1(EVH.med)}x x 1.075 (the nine peers' EV/EBITDA move, five-year) = ${n1(EVH.med * kev)}x, nearest half-turn, on Sep-28E EBITDA plus Sep-28E net cash. Bull ${EVM.bull}x / bear ${EVM.bear}x = 75th / 25th percentile x 1.075.`;
  const oiChanged = as.otherIncome.some((v, i) => v !== X.oiBuild[i]), intChanged = as.interest.some((v, i) => v !== X.intBuild[i]);
  const changed = oiChanged || intChanged || !same(pe.multiple, MULT) || !same(ev.multiple, EVM) || pe.why !== peWhy || ev.why !== evWhy;
  if (changed) {
    pe.multiple = { ...MULT }; ev.multiple = { ...EVM }; pe.why = peWhy; ev.why = evWhy; as.otherIncome = X.oiBuild.slice(); as.interest = X.intBuild.slice();
    fs.writeFileSync(FILE, JSON.stringify(as, null, 1));
    console.log(`GRANULES.mult: updated. P/E ${JSON.stringify(MULT)}, EV/EBITDA ${JSON.stringify(EVM)}, other income ${JSON.stringify(X.oiBuild)}, interest ${JSON.stringify(X.intBuild)}. Re-run node src/model.js GRANULES.`);
  } else console.log(`GRANULES.mult: unchanged. P/E ${JSON.stringify(MULT)}, EV/EBITDA ${JSON.stringify(EVM)}, other income ${JSON.stringify(X.oiBuild)}, interest ${JSON.stringify(X.intBuild)}`);
  return { changed };
}

module.exports = { syncMult };
if (require.main === module) syncMult();
