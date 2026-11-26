// Concord Biotech: write the derived multiples and the built other income into assumptions.json.
// CONCORDBIO.ctx2.js derives the P/E (Concord's median one-year-forward P/E since 1-Jan-2024 on every weekly close plus the
// 30-Sep close, reported EPS on the pre-bonus share count, x the nine pharma peers' move over the same window (+10.7%), nearest
// half-turn; bull/bear = 75th/25th percentile x the factor), the EV/EBITDA cross-check (median forward EV/EBITDA over the same
// window x the peers' same-window EV move, +4.3%) and other income (6.0% on average yield-bearing cash + Rs7.9 cr GSBTM
// incentives + Rs4.0 cr write-backs/misc + Rs2.0 cr Japan JV share). The forward history and the cash path use our forecasts, so
// run this after every forecast change: node tools/authoring/CONCORDBIO.mult.js, then node src/model.js CONCORDBIO; repeat
// until "unchanged".
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', '..', 'data', 'raw', 'CONCORDBIO', 'research', 'assumptions.json');

function syncMult() {
  process.env.TP_NOCHECK = '1';
  for (const f of ['./CONCORDBIO.ctx', './CONCORDBIO.ctx2']) delete require.cache[require.resolve(f)];
  const X = require('./CONCORDBIO.ctx2');
  const as = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  const pe = as.valuation.blend.methods.find(m => m.key === 'pe'), ev = as.valuation.blend.methods.find(m => m.key === 'ev');
  const same = (a, c) => ['base', 'bull', 'bear'].every(key => a?.[key] === c[key]);
  const { n1, HB, MULT, EVH, EVM, SECTOR, SECTOR_EV, k, kev, troughChk: T } = X;
  const peWhy = `How the street values Concord: both brokers that disclose a method use P/E on FY28E EPS (Choice 40x, Add, 4-Aug-2026; Antique 25x, Buy, 6-Jan-2026); Kotak (Buy), Citi and Jefferies (Hold) do not disclose one in the summaries we found. Concord listed on 18-Aug-2023, so there is no five-year history: we skip the post-listing months and start on 1-Jan-2024, when the post-listing re-rating had run its course (Rs943 at listing to ~Rs1,505-1,550 by late Dec-2023, then sideways at Rs1,395-1,560 to mid-2024), the 90-day anchor lock-in had ended (Nov-2023) and two quarters had been reported as a listed company. ${MULT.base}x = Concord's median one-year-forward P/E since 1-Jan-2024 (every weekly close plus the 30-Sep close, ${HB.n} points; forward EPS = the next full fiscal year's reported EPS on the pre-bonus 10.46 cr shares: FY25 Rs35.52, FY26 Rs24.94, our FY27E/FY28E) of ${n1(HB.med)}x x ${k.toFixed(3)} (the nine pharma peers' trailing P/E at the 30-Sep close vs their medians since 1-Jan-2024, PLAYBOOK §7c same-window rule; tools/authoring/sector-factor.js --from 2024-01-01 = +${SECTOR}%) = ${n1(HB.med * k)}x, nearest half-turn. Trough rule: no year is left out (FY26 Rs24.94 vs a Rs${n1(T[2026].line)} line, half of FY25's Rs35.52; FY27E Rs${n1(T[2027].eps)} vs Rs${n1(T[2027].line)}). Exceptional items are immaterial (Rs3.3 cr labour-code charge in FY26), so the base uses reported EPS. The median is high because FY26 EPS fell 30%: the 52 weeks priced on it trade at ${n1(X.HFY[2026].med)}x; leaving them out gives ${X.SENS[4].mult}x (sensitivity). Bull ${MULT.bull}x / bear ${MULT.bear}x = 75th / 25th percentile (${n1(HB.p75)}x / ${n1(HB.p25)}x) x ${k.toFixed(3)}. No own-move blend, no growth uplift (sensitivities only). Written by CONCORDBIO.mult.js.`;
  const evWhy = `Cross-check: Concord's median one-year-forward EV/EBITDA since 1-Jan-2024 (EV at each weekly close = price x 10.46 cr shares less the last published net cash, Screener basis; over the next full year's EBITDA; FY26 EBITDA Rs368 cr is above half of FY25's Rs506 cr, so no trough year) of ${n1(EVH.med)}x x ${kev.toFixed(3)} (the nine peers' EV/EBITDA move over the same window, +${SECTOR_EV}%) = ${n1(EVH.med * kev)}x, nearest half-turn, on Sep-28E EBITDA plus Sep-28E net cash. Bull ${EVM.bull}x / bear ${EVM.bear}x = 75th / 25th percentile x ${kev.toFixed(3)}.`;
  const oiWhy = `Built from sourced parts (checked in CONCORDBIO.ctx.js; written by CONCORDBIO.mult.js): (1) treasury income at ${X.TY}% on average yield-bearing cash = engine net cash (Rs${X.cashPath.map(v => Math.round(v)).join(' / ')} cr, Mar-26 to Mar-29E) less the Palvella Therapeutics shares (Rs84.1 cr, fair value through OCI) and the Japan JV stake (Rs3.7 cr), plus Rs2.3 cr of leases: Rs${X.ybPath.map(v => Math.round(v)).join(' / ')} cr. FY26 earned ${n1(X.yld26)}% (bank interest Rs2.5 cr, gains on sale of funds Rs11.5 cr, fair-value gains Rs9.6 cr on average cash and funds of ~Rs367 cr); (2) Gujarat (GSBTM) power-tariff and employment incentives for the Limbasi plant Rs${X.SUBSIDY} cr (FY25 Rs7.9 cr, FY26 Rs7.9 cr); (3) write-backs and miscellaneous income Rs${X.MISC} cr (FY25 Rs4.4 cr, FY26 Rs4.9 cr); (4) share of the 50% Japan JV Rs${X.JV} cr (FY26 Rs2.9 cr, FY25 -Rs1.3 cr; Screener includes it in other income). No forex gains are forecast (FY26 Rs16.0 cr, FY25 Rs8.2 cr). FY26 other income Rs52.4 cr, Rs${n1(X.oi26exFx)} cr before forex; twelve months to Jun-26 Rs${n1(X.ttmOi)} cr (Screener).`;
  const changed = as.otherIncome.some((v, i) => v !== X.oiBuild[i]) || !same(pe.multiple, MULT) || !same(ev.multiple, EVM) || pe.why !== peWhy || ev.why !== evWhy || as._otherIncomeWhy !== oiWhy;
  if (changed) {
    pe.multiple = { ...MULT }; ev.multiple = { ...EVM }; pe.why = peWhy; ev.why = evWhy;
    as.otherIncome = X.oiBuild.slice(); as._otherIncomeWhy = oiWhy;
    fs.writeFileSync(FILE, JSON.stringify(as, null, 1));
    console.log(`CONCORDBIO.mult: updated. P/E ${JSON.stringify(MULT)}, EV/EBITDA ${JSON.stringify(EVM)}, other income ${JSON.stringify(X.oiBuild)}. Re-run node src/model.js CONCORDBIO.`);
  } else console.log(`CONCORDBIO.mult: unchanged. P/E ${JSON.stringify(MULT)}, EV/EBITDA ${JSON.stringify(EVM)}, other income ${JSON.stringify(X.oiBuild)}`);
  return { changed };
}

module.exports = { syncMult };
if (require.main === module) syncMult();
