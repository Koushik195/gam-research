// ONGC: write the build-derived segment path, the effective tax rate and the derived SOTP parts into assumptions.json.
// ONGC.ctx.js runs the price x volume build, derives the core P/E (ONGC's own implied history x the oil-and-gas sector move),
// values the stakes at the 30-Sep-2026 closes less the §7c holding discount, OVL from the street's two values and the unlisted
// subsidiaries at cost. The tax rate depends on PBT, so run model -> this -> model until it reports "unchanged".
// Usage: node tools/authoring/ONGC.val.js (also run by ONGC.js)
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', '..', 'data', 'raw', 'ONGC', 'research', 'assumptions.json');

function syncParts() {
  delete require.cache[require.resolve('./ONGC.ctx')];
  const X = require('./ONGC.ctx');
  const { build, buildGrowth, F, T, SOTP, CM, DISC, OVLPS, UNL, OPAL, ST, LSYM, stakeMv, CLOSE, coreSep, implMed, sectorDr, FM, PEM, k, n0, n1, AS: A0 } = X;
  const as = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  const r1 = v => Math.round(v * 100) / 100, r0 = v => Math.round(v);
  const seg = as.segments[0];
  const growth = buildGrowth.map(r1), margin = build.map(r => r1(r.margin));
  // effective tax: 25.17% on PBT less dividends (s.80M), PBT from the build and the model's depreciation
  const tax = build.map((r, i) => { const pbt = r.ebitda - F.dep[i] + as.otherIncome[i] - as.interest[i]; return r1((pbt - as.dividendIncome[i]) * T / pbt * 100); });
  const cases = ['base', 'bull', 'bear'], of = f => Object.fromEntries(cases.map(c => [c, r0(f(c))]));
  const NAMES = { HINDPETRO: 'HPCL', MRPL: 'MRPL', IOC: 'Indian Oil', GAIL: 'GAIL', PETRONET: 'Petronet LNG' };
  const parts = [
    { name: 'ONGC standalone (core): P/E on Sep-28E core profit', adj: of(c => SOTP[c].core),
      metricLabel: `Sep-28E core profit (½ FY28E + ½ FY29E, before dividends from the stakes) ₹${n0(coreSep('base'))} cr × ${CM.base}x (bull ${CM.bull}x on ₹${n0(coreSep('bull'))} cr, bear ${CM.bear}x on ₹${n0(coreSep('bear'))} cr)`,
      note: `ONGC's own implied forward P/E on core profit since Apr-2021 (median ${n1(implMed)}x), times the ${sectorDr >= 0 ? '+' : ''}${sectorDr.toFixed(1)}% oil-and-gas sector move at 30-Sep-2026.` },
    ...LSYM.map(s => ({ name: `${NAMES[s]}: ${ST[s].pct}% stake at market`, adj: of(() => stakeMv[s]), metricLabel: `${ST[s].sharesCr.toFixed(2)} cr shares × ₹${CLOSE[s].toFixed(2)} (NSE close, 30-Sep-2026)`, note: `${ST[s].type}; AR FY26 note 11.1.` })),
    { name: 'Less: holding discount on the listed stakes', adj: of(c => SOTP[c].disc), metricLabel: `Base ${DISC.base}%, bull ${DISC.bull}%, bear ${DISC.bear}% of the listed stakes`, note: 'House rule for listed stakes inside an operating company: 20% unless the street clearly differs (JM and BOB 20%, MOSL and PL 25%, Geojit 50%).' },
    { name: 'ONGC Videsh (100%)', adj: of(c => SOTP[c].ovl), metricLabel: `₹${OVLPS.base} a share: midpoint of JM (7x FY28E EPS, ₹${OVLPS.bear}) and MOSL (0.5x FY25 book, ₹${OVLPS.bull}); bull MOSL, bear JM`, note: 'Overseas E&P; Sakhalin-1 restored from Jan-2026; ONGC cost ₹15,000 cr.' },
    { name: 'Other unlisted subsidiaries, JVs and associates at cost', adj: of(c => SOTP[c].unl), metricLabel: `OPaL ₹${n0(OPAL)} cr, ONGC Green ₹4,700 cr, others ₹${n0(UNL.base - OPAL - 4700)} cr (bear: OPaL at zero)`, note: 'At ONGC\'s cost (AR FY26 note 11.1).' },
  ];
  const pe = as.valuation.blend.methods.find(m => m.key === 'pe');
  const peWhy = `ONGC's own one-year-forward P/E on reported standalone EPS since Apr-2021: median ${n1(FM.median)}x (no trough years in the window), times the ${sectorDr.toFixed(1)}% sector move: ${PEM.base}x. It prices the stakes through their dividends, at ONGC's multiple.`;
  const before = JSON.stringify([seg.growth, seg.marginPct, as.taxRate, as.valuation.parts, pe.multiple, pe.why]);
  seg.growth = growth; seg.marginPct = margin; as.taxRate = tax; as.valuation.parts = parts; pe.multiple = { ...PEM }; pe.why = peWhy;
  const changed = before !== JSON.stringify([seg.growth, seg.marginPct, as.taxRate, as.valuation.parts, pe.multiple, pe.why]);
  if (changed) { fs.writeFileSync(FILE, JSON.stringify(as, null, 1)); console.log(`ONGC.val: updated. growth ${growth}, margin ${margin}, tax ${tax}, CM ${JSON.stringify(CM)}, PEM ${JSON.stringify(PEM)}, k ${k.toFixed(4)}. Re-run node src/model.js ONGC.`); }
  else console.log(`ONGC.val: unchanged. CM ${JSON.stringify(CM)}, PEM ${JSON.stringify(PEM)}`);
  return { changed };
}

module.exports = { syncParts };
if (require.main === module) syncParts();
