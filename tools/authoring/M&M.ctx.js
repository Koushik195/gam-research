// Mahindra & Mahindra initiation: shared context, part 1 (data, built model, business-line check, core EPS, group
// stakes and their value over time). Part 2 (M&M.ctx2.js) adds the multiple derivation, the sum of the parts, peers,
// street and cross-checks. As of 30-Sep-2026 (Q1FY27 basis).
// The engine models the STANDALONE company (auto + farm; Screener standalone after M&M.patch.js). Everything the
// standalone accounts carry at cost (Tech Mahindra, M&M Finance, MEAL, other group companies) is valued here.
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..', '..');
const SYM = 'M&M';
const RD = path.join(ROOT, 'data', 'raw', SYM, 'research');
const rd = (f, d) => { try { return JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8')); } catch { return d; } };
const C = rd('company.json', {}), D = rd('deep.json', {}), SG = rd('segments.json', { annual: [], quarterly: [] }), AS = rd('assumptions.json');
const CS = rd('screener-consolidated.json', null); // consolidated Screener file saved before the switch to standalone
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', `${SYM}.json`), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, SC = M.forecast.scenarios, fin = M.fin;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const n2 = v => (Math.round(v * 100) / 100).toFixed(2);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const SRC = 'M&M annual reports FY24-FY26, Q1FY27 results, presentation and call (30-Jul-2026), monthly sales releases, Screener.in (standalone), GAM Research';
const b = A.labels.length - 1; // FY26
const closes = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'market', 'closes', `${ASOF}.json`), 'utf8')).closes;
const price = M.price.last, sh = F.shares, mcap = price * sh, ps = v => v / sh;
const sep = (a, i0) => (a[i0] + a[i0 + 1]) / 2; // Sep-27E = sep(x, 0); Sep-28E = sep(x, 1)
const t = AS.taxRate[0] / 100;

// ---- Business-line build (volume x realisation) vs model revenue -------------------------------------------
const BL = AS.businessLines, LN = Object.fromEntries(BL.lines.map(l => [l.key, l])), R = BL.realisation;
const real = (r, i) => r.base * r.growth.slice(0, i + 1).reduce((p, g) => p * (1 + g / 100), 1);
const BUILD = [0, 1, 2].map(i => {
  const iceU = LN.iceSuv.units[i] + LN.lcv.units[i] + LN.exports.units[i];
  const ice = iceU * real(R.iceLakh, i) / 100, esuv = LN.esuv.units[i] * real(R.esuvLakh, i) / 100, farm = LN.tractors.units[i] * real(R.tractorLakh, i) / 100;
  const elim = R.elimPct / 100 * (ice + esuv + farm), total = ice + esuv + farm + elim;
  return { year: F.years[i], iceU, ice, esuv, auto: ice + esuv, farm, elim, total, model: F.sales[i], gap: (total / F.sales[i] - 1) * 100,
    vehicles: iceU + LN.esuv.units[i], uvDom: LN.iceSuv.units[i] + LN.esuv.units[i], tractors: LN.tractors.units[i], iceReal: real(R.iceLakh, i), farmReal: real(R.tractorLakh, i), esuvReal: real(R.esuvLakh, i) };
});
const BUILD26 = { iceU: LN.iceSuv.base + LN.lcv.base + LN.exports.base, ice: 96942, esuv: 12413, auto: 109355, farm: 36409, uvDom: LN.iceSuv.base + LN.esuv.base, tractors: LN.tractors.base };
BUILD.forEach(x => { if (Math.abs(x.gap) > 0.5) console.warn(`M&M: business-line build ${x.year} differs from model revenue by ${x.gap.toFixed(2)}%`); });

// ---- Core EPS: standalone EPS before one-offs, excluding income from group companies (valued in the SOTP) ----------
// History: AR FY24/FY26 (income from investments related to subsidiaries; loss from investments; exceptional items).
const HIST = {
  FY23: { pat: 6549, exAT: -1105, loss: 63, group: 1684.37 }, FY24: { pat: 10642, exAT: 0, loss: 253, group: 2456.00 },
  FY25: { pat: 11855, exAT: 0, loss: 847.91, group: 2140.85 }, FY26: { pat: 15639, exAT: -78, loss: 677.31, group: 2189.58 },
};
const corePat = {};
for (const [fy, h] of Object.entries(HIST)) corePat[fy] = h.pat - h.exAT + h.loss - h.group * (1 - t);
F.years.forEach((y, i) => (corePat[y] = F.pat[i] - AS.groupIncome[i] * (1 - t)));
const coreEps = Object.fromEntries(Object.entries(corePat).map(([k, v]) => [k, v / sh]));
const coreEpsArr = F.years.map(y => coreEps[y]);
const coreSep28 = sep(coreEpsArr, 1), coreSep27 = sep(coreEpsArr, 0), epsSep28 = sep(F.eps, 1);
const reportedEps = { FY23: 52.66, FY24: 85.58, FY25: 95.33, FY26: 125.76 }; // Screener standalone, on 124.36 cr shares

// ---- Group stakes: shares held by M&M standalone (AR FY25/FY26 note 8) and value at each date --------------------
const PXD = path.join('C:', 'Users', 'Gam', 'AppData', 'Local', 'Temp', 'claude', 'c7e8afa9d0e0b507', 'd7679ed4-ace6-4f73-9178-88e73d31363d', 'scratchpad', 'wave11-MM', 'prices');
const scr = s => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', s, 'screener.json'), 'utf8'));
const pxSeries = s => { try { return scr(s).charts.price.Price; } catch { return JSON.parse(fs.readFileSync(path.join(PXD, `${s}.json`), 'utf8')).price; } };
const at = (ser, d) => { const f = ser.filter(([x, v]) => x <= d && v != null); return f.length ? f[f.length - 1][1] : null; };
const step = (list, d) => { let v = 0; for (const [x, y] of list) if (x <= d) v = y; return v; };
const LISTED = [ // [symbol, name, [[from, crore shares]], note]
  ['TECHM', 'Tech Mahindra', [['2000-01-01', 24.8022598]], 'associate, 25.3%'],
  ['M&MFIN', 'M&M Financial Services', [['2000-01-01', 64.4399987], ['2025-06-30', 72.9582599]], 'subsidiary, 52.5% (rights issue Jun-2025)'],
  ['SMLMAH', 'SML Mahindra', [['2025-08-31', 0.8533726]], 'subsidiary, 59.0% (acquired Aug-2025)'],
  ['MAHLIFE', 'Mahindra Lifespace Developers', [['2000-01-01', 7.931955], ['2025-06-30', 11.1805708]], 'subsidiary, 52.4%'],
  ['MHRIL', 'Mahindra Holidays & Resorts', [['2000-01-01', 13.4835922]], 'subsidiary, 66.7%'],
  ['MAHLOG', 'Mahindra Logistics', [['2000-01-01', 4.1812257], ['2025-06-30', 5.9112927]], 'subsidiary, 59.6%'],
  ['SWARAJENG', 'Swaraj Engines', [['2000-01-01', 0.6331141]], 'subsidiary, 52.1%'],
  ['FIRSTCRY', 'Brainbees (FirstCry)', [['2024-08-13', 5.0233661], ['2025-06-30', 4.5041821]], 'associate'],
];
const PX = Object.fromEntries(LISTED.map(([s]) => [s, pxSeries(s)]));
// Unlisted group companies at M&M's investment (cost net of impairment) at each year-end, the street's "investment value"
// and the only basis observable throughout: MEAL Rs1,469 cr (Mar-23), 3,199 (Mar-24), 5,454 (Mar-25), 6,950 (Mar-26)
// (AR FY24/FY26 note 8; EV business inside M&M before the Jul-2022 BII deal); LMM Rs860 cr from May-2023, 901 at Mar-26.
const MEAL_COST = [['2022-07-07', 1469], ['2024-03-31', 3199], ['2025-03-31', 5454], ['2026-03-31', 6950]];
const LMM_COST = [['2023-05-29', 860], ['2026-03-31', 901]];
const OTHERS_BOOK = [['2000-01-01', 9005], ['2026-03-31', 9774]]; // other unlisted at cost net of impairment (ex MEAL, LMM, trusts)
// External transaction values, for the bull case and sensitivity only (not mixed into the history):
const MEAL_TX = { bii2022: 70070, temasek2023: 80580, conversion2026: 40400, mmStake: 92.45 }; // AR FY26 AGM notice: M&M 92.45%, BII 4.58%, Temasek 2.97%
const LMM_TX = { ifc2023: 6600, conversion: 4849, mmStake: 78.11 }; // IJF conversion at Rs42.03/share x 115.36 cr shares
function subsAt(d, closeMap) {
  const listed = LISTED.map(([s, , sl]) => { const n = step(sl, d); const p = closeMap?.[s] ?? at(PX[s], d); return n && p ? n * p : 0; });
  const lv = listed.reduce((x, y) => x + y, 0), meal = step(MEAL_COST, d), lmm = step(LMM_COST, d), oth = step(OTHERS_BOOK, d);
  return { listed, lv, meal, lmm, oth, total: lv + meal + lmm + oth };
}
const SUBS_NOW = subsAt(ASOF, closes);

module.exports = { fs, path, ROOT, SYM, RD, C, D, SG, AS, CS, M, F, V, A, SC, fin, ASOF, ASOF_TXT, n0, n1, n2, pc, pc1, SRC, b, closes, price, sh, mcap, ps, sep, t,
  BL, LN, R, BUILD, BUILD26, HIST, corePat, coreEps, coreEpsArr, coreSep28, coreSep27, epsSep28, reportedEps, LISTED, PX, MEAL_COST, LMM_COST, OTHERS_BOOK, MEAL_TX, LMM_TX, subsAt, SUBS_NOW, at, scr, step };

if (require.main === module) {
  BUILD.forEach(x => console.log(x.year, 'build', n0(x.total), 'model', n0(x.model), 'gap', x.gap.toFixed(2) + '%', 'auto', n0(x.auto), 'farm', n0(x.farm)));
  console.log('core EPS', Object.entries(coreEps).map(([k, v]) => `${k} ${n1(v)}`).join(' | '), '| Sep-28E core', n1(coreSep28), 'standalone', n1(epsSep28));
  console.log('subs now', LISTED.map(([s], i) => `${s} ${n0(SUBS_NOW.listed[i])}`).join(' | '), '| listed', n0(SUBS_NOW.lv), 'MEAL', n0(SUBS_NOW.meal), 'LMM', n0(SUBS_NOW.lmm), 'others', n0(SUBS_NOW.oth), 'total', n0(SUBS_NOW.total), '₹/sh', n0(ps(SUBS_NOW.total)));
}
