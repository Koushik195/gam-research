// Neuland Laboratories: write the derived multiples, the built other income and the built interest into assumptions.json.
// NEULANDLAB.ctx2.js derives the P/E (Neuland's median one-year-forward P/E since 1-Apr-2021 on every weekly close plus the
// 30-Sep close, FY25 EPS before the Rs76.4 cr property gain, x the pharma five-year factor of 1.082, nearest half-turn; bull/bear
// = 75th/25th percentile x the factor), the EV/EBITDA cross-check (median forward EV/EBITDA over the same window x 1.075), other
// income (5.0% on average gross cash + Rs1.5 cr) and interest (7.5% on average debt and leases + Rs5 cr). The forward history and
// the cash path use our forecasts, so run this after every forecast change: TP_NOCHECK=1 node tools/authoring/NEULANDLAB.mult.js,
// then node src/model.js NEULANDLAB; repeat until "unchanged".
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', '..', 'data', 'raw', 'NEULANDLAB', 'research', 'assumptions.json');

function syncMult() {
  process.env.TP_NOCHECK = '1';
  for (const f of ['./NEULANDLAB.ctx', './NEULANDLAB.ctx2']) delete require.cache[require.resolve(f)];
  const X = require('./NEULANDLAB.ctx2');
  const as = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  const pe = as.valuation.blend.methods.find(m => m.key === 'pe'), ev = as.valuation.blend.methods.find(m => m.key === 'ev');
  const same = (a, c) => ['base', 'bull', 'bear'].every(key => a?.[key] === c[key]);
  const n1 = X.n1;
  const peWhy = `How the street values Neuland: of the brokers whose method we could see, Nuvama uses P/E (48x H1FY28E EPS, Dec-2025), Goldman Sachs a sum of the parts on P/E (its CRO/CDMO framework) and B&K P/E (38x FY27E, 2024); one broker reported in Aug-2026 uses 30x Jun-28E EV/EBITDA. ${X.MULT.base}x = Neuland's median one-year-forward P/E since 1-Apr-2021 (every weekly close plus the 30-Sep close, ${X.HB.n} points; forward EPS = the next full fiscal year's realised EPS, FY25 before the Rs76.4 cr gain on the Nanakramguda property (Rs${n1(X.eps25ex)} vs Rs202.7 reported; the median is ${n1(X.HREP.med)}x on reported EPS), our FY27E/FY28E) of ${n1(X.HB.med)}x x 1.082 (the nine pharma peers' trailing P/E at the 30-Sep close vs their five-year medians, PLAYBOOK §7c, Neuland outside the set; reproduced ${X.pc1(X.sectorCalc)}) = ${n1(X.HB.med * X.k)}x, nearest half-turn. Trough rule: no year is left out (FY23 Rs127.5 vs a Rs31.4 line, half of FY21's Rs62.9; FY25 Rs${n1(X.eps25ex)} vs Rs116.9). Earnings stepped up from FY23 but not from a loss, so the turnaround rule does not apply: the window from the break (1-Apr-2022) x the peers' same-window move gives ${X.SENS.find(r => /earnings break/.test(r.name)).mult}x, a sensitivity row. Bull ${X.MULT.bull}x / bear ${X.MULT.bear}x = 75th / 25th percentile (${n1(X.HB.p75)}x / ${n1(X.HB.p25)}x) x 1.082. No own-move blend, no growth uplift (sensitivities only). Written by NEULANDLAB.mult.js.`;
  const evWhy = `Cross-check: Neuland's median one-year-forward EV/EBITDA since 1-Apr-2021 (EV at each weekly close = price x 1.283 cr shares less the last published company net cash, over the next full year's EBITDA, Screener basis) of ${n1(X.EVH.med)}x x 1.075 (the nine peers' five-year EV/EBITDA move; reproduced ${X.pc1(X.sectorEvCalc)}) = ${n1(X.EVH.med * X.kev)}x, nearest half-turn, on Sep-28E EBITDA plus Sep-28E net cash. Bull ${X.EVM.bull}x / bear ${X.EVM.bear}x = 75th / 25th percentile x 1.075.`;
  const oiWhy = `Built from sourced parts (checked in NEULANDLAB.ctx.js; written by NEULANDLAB.mult.js): (1) treasury income at ${X.TY}% on average gross cash and deposits = engine net cash (Rs${X.cashPath.map(v => Math.round(v)).join(' / ')} cr, Mar-26 to Mar-29E, after leases) plus our borrowing path (debt Rs${X.DEBT.map(v => Math.round(v)).join(' / ')} cr, leases Rs${X.LEASE.map(v => Math.round(v)).join(' / ')} cr); FY26 earned ${n1(X.yld26)}% (interest on deposits Rs10.1 cr plus mutual-fund gains Rs7.6 cr on average cash, deposits and funds of ~Rs361 cr); (2) write-backs of Rs${X.MISC} cr (FY25 Rs1.6 cr, FY26 Rs2.0 cr). No forex gains are forecast (FY26 Rs10.6 cr, helped by the weak rupee). FY26 other income Rs30.2 cr (company) / Rs24.9 cr (Screener, net of a Rs5.3 cr loss on asset sales); twelve months to Jun-26 Rs${n1(X.ttmOi)} cr (Screener).`;
  const intWhy = `Built in NEULANDLAB.ctx.js: ${X.KD}% on average bank debt (Rs${X.DEBT.map(v => Math.round(v)).join(' → ')} cr; CRISIL: capex partly debt-funded, Rs130 cr R&D-centre loan tied up, Rs522 cr of proposed term loans rated) + ${X.KL}% on average lease liabilities (Rs${X.LEASE.map(v => Math.round(v)).join(' → ')} cr; the R&D-centre lease) + Rs${X.OTHER_FIN} cr of other borrowing costs net of capitalisation. FY26 finance cost Rs23.9 cr (borrowings Rs11.7 cr, leases Rs7.0 cr, other Rs6.8 cr, capitalised -Rs1.5 cr); Q1FY27 Rs7 cr.`;
  const intRound = X.intBuild.map(v => Math.round(v * 10) / 10);
  const changed = as.otherIncome.some((v, i) => v !== X.oiBuild[i]) || as.interest.some((v, i) => v !== intRound[i]) || !same(pe.multiple, X.MULT) || !same(ev.multiple, X.EVM) || pe.why !== peWhy || ev.why !== evWhy || as._otherIncomeWhy !== oiWhy || as._interestWhy !== intWhy;
  if (changed) {
    pe.multiple = { ...X.MULT }; ev.multiple = { ...X.EVM }; pe.why = peWhy; ev.why = evWhy;
    as.otherIncome = X.oiBuild.slice(); as.interest = intRound; as._otherIncomeWhy = oiWhy; as._interestWhy = intWhy;
    fs.writeFileSync(FILE, JSON.stringify(as, null, 1));
    console.log(`NEULANDLAB.mult: updated. P/E ${JSON.stringify(X.MULT)}, EV/EBITDA ${JSON.stringify(X.EVM)}, other income ${JSON.stringify(X.oiBuild)}, interest ${JSON.stringify(intRound)}. Re-run node src/model.js NEULANDLAB.`);
  } else console.log(`NEULANDLAB.mult: unchanged. P/E ${JSON.stringify(X.MULT)}, EV/EBITDA ${JSON.stringify(X.EVM)}, other income ${JSON.stringify(X.oiBuild)}, interest ${JSON.stringify(intRound)}`);
  return { changed };
}

module.exports = { syncMult };
if (require.main === module) syncMult();
