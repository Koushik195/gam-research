// HPCL: write the derived SOTP inputs into assumptions.json. HINDPETRO.ctx.js derives the EV/EBITDA multiple (own
// one-year-forward core EV/EBITDA median since Apr-2021, trough years out, × the OMC/refiner EV/EBITDA move vs five-year
// medians; bull = no move; bear = 25th percentile × move; nearest half-turn), the MRPL and Oil India stakes at the
// 30-Sep-2026 closes (base less 20%, bull at market, bear less 30%), the HRRL loan line and the P/E cross-check multiple.
// The multiples and adjustments do not change EPS or EBITDA, so one pass converges; the next `node src/model.js HINDPETRO`
// carries them into the report and the Excel model. Usage: node tools/authoring/HINDPETRO.val.js (also run by HINDPETRO.js)
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', '..', 'data', 'raw', 'HINDPETRO', 'research', 'assumptions.json');

function syncVal() {
  delete require.cache[require.resolve('./HINDPETRO.ctx')];
  const X = require('./HINDPETRO.ctx');
  const { MULT, OWN, sectorMv, PEMULT, PEOWN, SENSMV, STK, listedMv, listedBook, reval, DISC, n0, n1, USED, shortName, evMove, peTroughFy, evTroughFy, HR, hrrlInvested, hrrlBear } = X;
  const as = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  const before = JSON.stringify(as.valuation);
  const P = as.valuation.parts, r0 = v => Math.round(v);
  const why = `Own one-year-forward core EV/EBITDA since Apr-2021 (EV less all investments at book; forward consolidated EBITDA; ${evTroughFy.join(' and ')} left out as troughs): median ${n1(OWN.med)}x, × the OMC/refiner move vs five-year medians (${USED.map(s => `${shortName(s)} ${X.pc1(evMove[s])}`).join(', ')}; median ${X.pc1(sectorMv)}; HPCL itself excluded) = ${n1(OWN.med * (1 + sectorMv / 100))}x → ${MULT.base}x (bull ${MULT.bull}x = no move; bear ${MULT.bear}x = 25th percentile ${n1(OWN.p25)}x × move).`;
  const seg = P.find(p => p.seg); seg.multiple = { ...MULT }; seg.note = why;
  const st = P.find(p => /Listed stakes/.test(p.name)), hr = P.find(p => /HRRL/.test(p.name));
  st.adj = Object.fromEntries(Object.entries(reval).map(([c, v]) => [c, r0(v)]));
  st.metricLabel = `${STK.map(s => `${s.name.replace(/ \(.*\)/, '')} ${n1(s.shares)} cr × ₹${s.px.toFixed(2)}`).join('; ')} = ₹${n0(listedMv)} cr at market; less ${DISC.base}% (bull ${DISC.bull}%, bear ${DISC.bear}%), minus Mar-26 book ₹${n0(listedBook)} cr already inside net debt`;
  st.note = 'PLAYBOOK §7c: listed stakes in an operating company at the 30-Sep-2026 market value less 20% (BAJAJ-AUTO / M&M precedent; IOC template). MOSL takes 25% off MRPL, Emkay 30%.';
  hr.adj = { base: r0(HR.subDebt), bull: r0(HR.subDebt), bear: r0(hrrlBear) };
  hr.metricLabel = `₹${n0(HR.subDebt)} cr disbursed by Mar-26, to be converted into HRRL equity (base and bull at book). Bear: HRRL at 0.8x invested capital (MOSL's basis) = 0.8 × ₹${n0(hrrlInvested)} cr less the ₹${n0(HR.carrying)} cr book equity already in net debt`;
  const M0 = as.valuation.blend.methods;
  M0.find(m => m.key === 'sotp').why = `How the street values HPCL (Motilal Oswal 6x Dec-27E, BOB Capital 6x Jun-28E, Emkay 6x Jun-28E EV/EBITDA on standalone EBITDA, each plus investments). Consolidated EBITDA on Sep-28E × ${MULT.base}x, less net debt at Sep-27E (investments, incl. HRRL and HMEL equity, at book), plus MRPL and Oil India at market less 20%, plus the HRRL loan. ${why}`;
  const pe = M0.find(m => m.key === 'pe');
  pe.multiple = { ...PEMULT };
  pe.why = `Own one-year-forward P/E since Apr-2021 (${peTroughFy.join(', ')} left out as trough years): median ${n1(PEOWN.med)}x, × the OMC/refiner P/E move vs five-year medians (${X.pc1(SENSMV.pe)}): ${PEMULT.base}x Sep-28E EPS. Bear = 25th percentile × move.`;
  const changed = JSON.stringify(as.valuation) !== before;
  if (changed) { fs.writeFileSync(FILE, JSON.stringify(as, null, 1)); console.log(`HINDPETRO.val: updated. EV/EBITDA ${JSON.stringify(MULT)}, P/E ${JSON.stringify(PEMULT)}, stakes ${JSON.stringify(st.adj)}, HRRL ${JSON.stringify(hr.adj)}. Re-run node src/model.js HINDPETRO, then node tools/authoring/HINDPETRO.js.`); }
  else console.log(`HINDPETRO.val: unchanged. EV/EBITDA ${JSON.stringify(MULT)}, P/E ${JSON.stringify(PEMULT)}`);
  return { changed };
}

module.exports = { syncVal };
if (require.main === module) syncVal();
