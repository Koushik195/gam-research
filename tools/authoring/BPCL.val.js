// Bharat Petroleum: write the derived SOTP inputs into assumptions.json. BPCL.ctx.js derives the EV/EBITDA multiple (own
// one-year-forward core EV/EBITDA median since Apr-2021, trough years out, × the OMC/refiner EV/EBITDA move vs five-year
// medians; bull = no move; bear = 25th percentile × move; nearest half-turn), the listed stakes at the 30-Sep-2026 closes
// (base less 20%, bull at market, bear less 30%), BPRL's E&P invested value (bear 40% lower) and the P/E cross-check.
// The multiples and adjustments do not change EPS or EBITDA, so one pass converges; the next `node src/model.js BPCL`
// carries them into the report and the Excel model. Usage: node tools/authoring/BPCL.val.js (also run by BPCL.js)
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', '..', 'data', 'raw', 'BPCL', 'research', 'assumptions.json');

function syncVal() {
  delete require.cache[require.resolve('./BPCL.ctx')];
  const X = require('./BPCL.ctx');
  const { MULT, OWN, sectorMv, PEMULT, PEOWN, SENSMV, STK, listedMv, listedBook, reval, DISC, epAdj, EPI, EP_BEAR, n0, n1, USED, shortName, evMove, peTroughFy, evTroughFy } = X;
  const as = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  const before = JSON.stringify(as.valuation);
  const P = as.valuation.parts, r0 = v => Math.round(v);
  const why = `Own one-year-forward core EV/EBITDA since Apr-2021 (EV less all investments at book; forward consolidated EBITDA; ${evTroughFy.join(', ')} left out as a trough): median ${n1(OWN.med)}x, × the OMC/refiner move vs five-year medians (${USED.map(s => `${shortName(s)} ${X.pc1(evMove[s])}`).join(', ')}; median ${X.pc1(sectorMv)}; HPCL excluded as distorted) = ${n1(OWN.med * (1 + sectorMv / 100))}x → ${MULT.base}x (bull ${MULT.bull}x = no move; bear ${MULT.bear}x = 25th percentile ${n1(OWN.p25)}x × move).`;
  const ds = P.find(p => p.seg === 'ds'); ds.multiple = { ...MULT }; ds.note = why;
  const ep = P.find(p => p.seg === 'ep');
  ep.adj = Object.fromEntries(Object.entries(epAdj).map(([c, v]) => [c, r0(v)]));
  ep.note = `BPRL's E&P assets other than its equity-accounted JVs (mainly Mozambique Area 1 and Brazil, ₹${n0(EPI.mozambiqueNonCurrentAssets)} cr of non-current assets in Mozambique) at Mar-26 book: segment assets ₹${n0(EPI.assets)} cr less segment liabilities ₹${n0(EPI.liabilities)} cr less JVs ₹${n0(EPI.investees)} cr (inside net debt at book). Not producing, so no EBITDA multiple; bear ${EP_BEAR}% lower (Motilal Oswal's discount on Mozambique). The debt that funds it is in net debt.`;
  const st = P.find(p => /Listed stakes/.test(p.name));
  st.adj = Object.fromEntries(Object.entries(reval).map(([c, v]) => [c, r0(v)]));
  st.metricLabel = `${STK.map(s => `${s.name.replace(/ \(.*\)/, '')} ${n1(s.shares)} cr × ₹${s.px.toFixed(2)}`).join('; ')} = ₹${n0(listedMv)} cr at market; less ${DISC.base}% (bull ${DISC.bull}%, bear ${DISC.bear}%), minus Mar-26 book ₹${n0(listedBook)} cr already inside net debt`;
  st.note = 'PLAYBOOK §7c: listed stakes in an operating company at the 30-Sep-2026 market value less 20% (BAJAJ-AUTO / M&M / IOC precedent). JM Financial also uses market less 20%; Motilal Oswal 25%; Emkay 30%.';
  const M0 = as.valuation.blend.methods;
  M0.find(m => m.key === 'sotp').why = `How the street values BPCL (Motilal Oswal 6x Dec-27E, JM Financial 5.5x FY28E, Emkay 5.8x Jun-28E, Antique 6.5x FY28E EV/EBITDA, each plus investments). Downstream EBITDA on Sep-28E × ${MULT.base}x, less net debt at Sep-27E, plus listed stakes at market less 20%, plus BPRL's E&P assets at invested value. ${why}`;
  const pe = M0.find(m => m.key === 'pe');
  pe.multiple = { ...PEMULT };
  pe.why = `Own one-year-forward P/E since Apr-2021 on BPCL's EPS basis (${peTroughFy.join(', ')} left out as trough years): median ${n1(PEOWN.med)}x, × the OMC/refiner P/E move vs five-year medians (${X.pc1(SENSMV.pe)}): ${PEMULT.base}x Sep-28E EPS. Bear = 25th percentile × move.`;
  const changed = JSON.stringify(as.valuation) !== before;
  if (changed) { fs.writeFileSync(FILE, JSON.stringify(as, null, 1)); console.log(`BPCL.val: updated. EV/EBITDA ${JSON.stringify(MULT)}, P/E ${JSON.stringify(PEMULT)}, stakes ${JSON.stringify(st.adj)}, E&P ${JSON.stringify(ep.adj)}. Re-run node src/model.js BPCL, then node tools/authoring/BPCL.js.`); }
  else console.log(`BPCL.val: unchanged. EV/EBITDA ${JSON.stringify(MULT)}, P/E ${JSON.stringify(PEMULT)}`);
  return { changed };
}

module.exports = { syncVal };
if (require.main === module) syncVal();
