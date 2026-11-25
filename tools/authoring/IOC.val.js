// Indian Oil: write the derived SOTP inputs into assumptions.json. IOC.ctx.js derives the EV/EBITDA multiple (own
// one-year-forward core EV/EBITDA median since Apr-2021, trough years out, × the OMC/refiner EV/EBITDA move vs five-year
// medians; bull = no move; bear = 25th percentile × move; nearest half-turn), the listed stakes at the 30-Sep-2026 closes
// (base less 20%, bull at market, bear less 30%), the minorities (CPCL at market) and the P/E cross-check multiple.
// The multiples and adjustments do not change EPS or EBITDA, so one pass converges; the next `node src/model.js IOC`
// carries them into the report and the Excel model. Usage: node tools/authoring/IOC.val.js (also run by IOC.js)
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', '..', 'data', 'raw', 'IOC', 'research', 'assumptions.json');

function syncVal() {
  delete require.cache[require.resolve('./IOC.ctx')];
  const X = require('./IOC.ctx');
  const { MULT, OWN, sectorMv, PEMULT, PEOWN, kPe, SENSMV, STK, listedMv, listedBook, reval, DISC, cpclMcap, cpclMin, otherNci, n0, n1, USED, shortName, evMove, peTroughFy, evTroughFy } = X;
  const as = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  const before = JSON.stringify(as.valuation);
  const P = as.valuation.parts, r0 = v => Math.round(v);
  const why = `Own one-year-forward core EV/EBITDA since Apr-2021 (EV less all investments at book; forward consolidated EBITDA; ${evTroughFy.join(', ')} left out as a trough): median ${n1(OWN.med)}x, × the OMC/refiner move vs five-year medians (${USED.map(s => `${shortName(s)} ${X.pc1(evMove[s])}`).join(', ')}; median ${X.pc1(sectorMv)}; HPCL excluded as distorted) = ${n1(OWN.med * (1 + sectorMv / 100))}x → ${MULT.base}x (bull ${MULT.bull}x = no move; bear ${MULT.bear}x = 25th percentile ${n1(OWN.p25)}x × move).`;
  for (const p of P.filter(p => p.seg || p.unalloc)) { p.multiple = { ...MULT }; p.note = why; }
  const st = P.find(p => /Listed stakes/.test(p.name)), mi = P.find(p => /minorities/.test(p.name));
  st.adj = Object.fromEntries(Object.entries(reval).map(([c, v]) => [c, r0(v)]));
  st.metricLabel = `${STK.map(s => `${s.name.replace(/ \(.*\)/, '')} ${n1(s.shares)} cr × ₹${s.px.toFixed(2)}`).join('; ')} = ₹${n0(listedMv)} cr at market; less ${DISC.base}% (bull ${DISC.bull}%, bear ${DISC.bear}%), minus Mar-26 book ₹${n0(listedBook)} cr already inside net debt`;
  st.note = 'PLAYBOOK §7c: listed stakes in an operating company at the 30-Sep-2026 market value less 20% (BAJAJ-AUTO / M&M precedent). ICICI Securities adds them at market (our bull case).';
  const minV = -(cpclMin + otherNci);
  mi.adj = { base: r0(minV), bull: r0(minV), bear: r0(minV) };
  mi.metricLabel = `48.11% × CPCL market value ₹${n0(cpclMcap)} cr (30-Sep-2026 close) = ₹${n0(cpclMin)} cr; other minorities (mainly 25% of Lanka IOC) at Mar-26 book ₹${n0(otherNci)} cr`;
  mi.note = 'Consolidated EBITDA includes 100% of CPCL, so the outside shareholders\' 48.11% is deducted (PLAYBOOK §7c: deduct minorities only in parts valued at 100%).';
  const M0 = as.valuation.blend.methods;
  M0.find(m => m.key === 'sotp').why = `How the street values IOC (Motilal Oswal 4.5x Dec-27E, BOB Capital 5.5x Jun-28E, ICICI Securities 5.5x FY28E EV/EBITDA, each plus investments). Segment EBITDA on Sep-28E × ${MULT.base}x, less net debt at Sep-27E, plus listed stakes at market less 20%, less minorities. ${why}`;
  const pe = M0.find(m => m.key === 'pe');
  pe.multiple = { ...PEMULT };
  pe.why = `Own one-year-forward P/E since Apr-2021 on IOC's EPS basis (${peTroughFy.join(', ')} left out as trough years): median ${n1(PEOWN.med)}x, × the OMC/refiner P/E move vs five-year medians (${X.pc1(SENSMV.pe)}): ${PEMULT.base}x Sep-28E EPS. Bear = 25th percentile × move.`;
  const changed = JSON.stringify(as.valuation) !== before;
  if (changed) { fs.writeFileSync(FILE, JSON.stringify(as, null, 1)); console.log(`IOC.val: updated. EV/EBITDA ${JSON.stringify(MULT)}, P/E ${JSON.stringify(PEMULT)}, stakes ${JSON.stringify(st.adj)}, minorities ${mi.adj.base}. Re-run node src/model.js IOC, then node tools/authoring/IOC.js.`); }
  else console.log(`IOC.val: unchanged. EV/EBITDA ${JSON.stringify(MULT)}, P/E ${JSON.stringify(PEMULT)}`);
  return { changed };
}

module.exports = { syncVal };
if (require.main === module) syncVal();
