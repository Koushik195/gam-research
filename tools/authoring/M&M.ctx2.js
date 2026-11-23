// Mahindra & Mahindra initiation: shared context, part 2. Core-business multiple (own one-year-forward P/E since
// Apr-2021 on a look-through basis, x the auto-OEM sector de-rating), the sum of the parts (base/bull/bear), peers,
// cross-checks and the rating. As of 30-Sep-2026.
const X = require('./M&M.ctx');
const { fs, path, ROOT, SYM, M, F, V, AS, SC, ASOF, price, sh, mcap, ps, sep, t, coreEps, coreSep28, coreSep27, epsSep28, subsAt, SUBS_NOW, closes, scr, at, n0, n1, n2 } = X;
const { forwardMedian } = require('./valuation-blend');
const { peersAsOf } = require('./asof-peers');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor, ruleText } = require('../../src/ratings');
const med = a => { const s = a.filter(x => Number.isFinite(x)).sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : null; };
const pct = (a, p) => { const s = a.filter(x => Number.isFinite(x)).sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.floor(p * s.length))]; };
const half = v => Math.round(v * 2) / 2; // nearest half-turn (PLAYBOOK §7c)
const DISC = { base: 20, bull: 10, bear: 30 }; // holding discount (%): street convention, see valuation chapter

// ---- 1. Headline forward P/E (house tool: price / next-FY standalone EPS incl. dividends from group companies) ----
const HEAD = forwardMedian(SYM, M);
// ---- 2. Core forward P/E on a look-through basis: (price − stakes x (1 − discount)) / next-FY core EPS ----------
const fyOf = d => { const dt = new Date(d); return dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; };
const epsFy = fy => coreEps[`FY${String(fy).slice(2)}`] ?? coreEps[`FY${String(fy).slice(2)}E`];
const PRICE = M.price && scr(SYM).charts.price.Price.filter(([d]) => d >= '2021-04-01' && d <= ASOF);
if (PRICE[PRICE.length - 1][0] < ASOF) PRICE.push([ASOF, price]);
const sharesAt = () => sh; // 124.35 cr issued shares throughout (no buyback or issue since FY21 beyond ESOP-trust transfers)
const corePeAt = (d, px, disc) => { const s = d === ASOF ? SUBS_NOW : subsAt(d); const e = epsFy(fyOf(d)); return e > 0 ? (px - s.total * (1 - disc / 100) / sharesAt(d)) / e : null; };
const SERIES = PRICE.map(([d, px]) => ({ d, px, fy: fyOf(d), pe: corePeAt(d, px, DISC.base), head: px / ((X.reportedEps[`FY${String(fyOf(d)).slice(2)}`]) ?? F.eps[F.years.indexOf(`FY${String(fyOf(d)).slice(2)}E`)]) }));
// trough rule on core EPS (forward EPS a loss or below half the best of the previous three years): FY23-FY28 none
const trough = fy => { const prev = [1, 2, 3].map(k => epsFy(fy - k)).filter(v => v != null); const pk = prev.length ? Math.max(...prev) : null; return !(epsFy(fy) > 0) || (pk > 0 && epsFy(fy) < 0.5 * pk); };
const KEPT = SERIES.filter(r => !trough(r.fy));
const coreMed = med(KEPT.map(r => r.pe)), coreP25 = pct(KEPT.map(r => r.pe), 0.25), coreP75 = pct(KEPT.map(r => r.pe), 0.75);
const coreNow = (price - SUBS_NOW.total * (1 - DISC.base / 100) / sh) / coreEps.FY28E; // one-year-forward (FY28E) at 30-Sep
const coreNowTtm = (price - SUBS_NOW.total * (1 - DISC.base / 100) / sh) / coreSep27;
const discSens = [0, 10, 20, 30, 40].map(dd => ({ disc: dd, med: med(PRICE.map(([d, px]) => corePeAt(d, px, dd))) }));
const byYear = [2021, 2022, 2023, 2024, 2025, 2026].map(y => ({ y, med: med(KEPT.filter(r => r.d.startsWith(String(y))).map(r => r.pe)), head: med(SERIES.filter(r => r.d.startsWith(String(y))).map(r => r.head)) }));

// ---- 3. Sector de-rating: auto-OEM peers' P/E at the 30-Sep close vs their five-year medians (M&M excluded) ------
const PEER_SYMS = ['MARUTI', 'BAJAJ-AUTO', 'EICHERMOT', 'HEROMOTOCO', 'TVSMOTOR', 'ASHOKLEY', 'ESCORTS'];
const EXCLUDE = { 'BAJAJ-AUTO': 'Q4FY26 other income of Rs1,894 cr (vs ~Rs400-600 cr a quarter) and the consolidation of KTM from FY26 inflate trailing EPS (+47% in FY26); its consolidated P/E history is not comparable' };
const PEERS = peersAsOf([...PEER_SYMS, SYM], ASOF).map(p => {
  const S2 = scr(p.symbol), ser = (S2.charts.pe || {})['Price to Earning'] || [], ev = (S2.charts.evEbitda || {})['EV Multiple'] || [];
  const w = s => s.filter(([d, x]) => d >= '2021-10-01' && d <= ASOF && x > 0).map(x => x[1]);
  const m5 = med(w(ser)), e5 = med(w(ev));
  return { ...p, basis: S2.basis, pe5y: m5, ev5y: e5, n5y: w(ser).length, vs: p.pe && m5 ? (p.pe / m5 - 1) * 100 : null, evVs: p.evEbitda && e5 ? (p.evEbitda / e5 - 1) * 100 : null, excluded: EXCLUDE[p.symbol] || null };
});
const DR_SET = PEERS.filter(p => p.symbol !== SYM && !p.excluded && p.vs != null);
const derate = med2(DR_SET.map(p => p.vs)), derateAll = med2(PEERS.filter(p => p.symbol !== SYM && p.vs != null).map(p => p.vs));
function med2(a) { const s = [...a].sort((x, y) => x - y), m = s.length / 2; return s.length % 2 ? s[Math.floor(m)] : (s[m - 1] + s[m]) / 2; }
const evPeerMed = med2(PEERS.filter(p => p.symbol !== SYM && !p.excluded && p.evEbitda).map(p => p.evEbitda));
const tataNote = 'Tata Motors demerged on 1-Oct-2025: TMPV (the old listing, now passenger vehicles + JLR) carries a P/E history that includes the CV business and a demerger gain, and TMCV listed only on 12-Nov-2025, so neither has a usable five-year median; both are left out of the de-rating and shown for reference only.';

// ---- 4. Core multiple and the sum of the parts --------------------------------------------------------------------
const MULT = { base: half(coreMed * (1 + derate / 100)), bull: half(coreP75 * (1 + derate / 100)), bear: half(coreP25 * (1 + derate / 100)) };
// MEAL and LMM at cost in the base and bear (the basis of the multiple history); the bull case lifts them to the latest
// arm's-length prices (MEAL: BII/Temasek CCPS conversion at ~Rs40,400 cr; LMM: IJF conversion at ~Rs4,849 cr).
const TX = X.MEAL_TX, LX = X.LMM_TX;
const MEAL_CASE = { base: [SUBS_NOW.meal, 'M&M investment at cost, Mar-26 (AR FY26 note 8)'], bull: [TX.conversion2026 * TX.mmStake / 100, `${TX.mmStake}% x ₹${n0(TX.conversion2026)} cr (CCPS conversion, 1-May-2026)`], bear: [SUBS_NOW.meal, 'At cost'] };
const LMM_CASE = { base: [SUBS_NOW.lmm, 'At cost, Mar-26'], bull: [LX.conversion * LX.mmStake / 100, `${LX.mmStake}% x ₹${n0(LX.conversion)} cr (IJF conversion price)`], bear: [SUBS_NOW.lmm, 'At cost'] };
const NEWINV = AS.groupInvestment.perYear[0] + AS.groupInvestment.perYear[1] / 2; // invested by Sep-27E at cost
const caseEps = k => (k === 'base' ? F.eps : SC[k].eps), caseCore = k => caseEps(k).map((e, i) => e - AS.groupIncome[i] * (1 - t) / sh);
function sotp(k) {
  const core = caseCore(k), c28 = sep(core, 1), mult = MULT[k], disc = DISC[k];
  const parts = [
    { key: 'core', name: 'Standalone auto + farm (incl. its cash)', method: `${mult}x Sep-28E core EPS ₹${n1(c28)}`, gross: mult * c28 * sh, disc: 0 },
    ...X.LISTED.map(([s, nm, sl], i) => ({ key: s, name: nm, method: `${n2(sl.at(-1)[1])} cr shares x ₹${n0(closes[s])} (30-Sep close)`, gross: SUBS_NOW.listed[i], disc, listed: true })),
    { key: 'meal', name: 'Mahindra Electric Automobile (MEAL)', method: MEAL_CASE[k][1], gross: MEAL_CASE[k][0], disc },
    { key: 'lmm', name: 'Mahindra Last Mile Mobility', method: LMM_CASE[k][1], gross: LMM_CASE[k][0], disc },
    { key: 'oth', name: 'Other unlisted group companies', method: 'Cost net of impairment (AR FY26 note 8)', gross: SUBS_NOW.oth, disc },
    { key: 'new', name: 'New investment in group companies to Sep-27E', method: 'At cost (mainly MEAL; ₹15,925 cr approved)', gross: NEWINV, disc },
  ];
  parts.forEach(p => { p.net = p.gross * (1 - p.disc / 100); p.ps = p.net / sh; });
  const equity = parts.reduce((s, p) => s + p.net, 0), perShare = equity / sh, subsGross = parts.filter(p => p.key !== 'core').reduce((s, p) => s + p.gross, 0);
  return { k, mult, disc, parts, equity, perShare, c28, eps28: sep(caseEps(k), 1), implied: perShare / sep(caseEps(k), 1), subsGross, subsNet: subsGross * (1 - disc / 100) };
}
const SOTP = { base: sotp('base'), bull: sotp('bull'), bear: sotp('bear') };
const SB = SOTP.base;

// ---- 5. Cross-checks (subsidiaries at SOTP value, not at cost) ------------------------------------------------------
const invAtCost = y => AS.groupInvestment.atCostFY26 + AS.groupInvestment.perYear.slice(0, y + 1).reduce((s, x) => s + x, 0);
const ke = V.ke, roll = Math.pow(1 + ke / 100, (AS.dcf.rollForwardMonths ?? 6) / 12);
const dcfAdj = ((V.blend ? V.ev : V.ev) + (F.treasury[0] - invAtCost(0)) + SB.subsNet) / sh * roll;
const ev27 = sep(F.ebitda, 0), liq27 = sep(F.treasury.map((x, i) => x - invAtCost(i)), 0);
const evAdj = (14 * ev27 + liq27 + SB.subsNet) / sh;
const headPe = { med: HEAD.median, val: half(HEAD.median * (1 + derate / 100)) * epsSep28 };
const rating = ratingFor(V.upside), buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;

module.exports = { ...X, X, DISC, HEAD, SERIES, KEPT, coreMed, coreP25, coreP75, coreNow, coreNowTtm, discSens, byYear, PEERS, DR_SET, derate, derateAll, evPeerMed, tataNote, EXCLUDE,
  MULT, MEAL_CASE, LMM_CASE, NEWINV, SOTP, SB, invAtCost, dcfAdj, evAdj, ev27, liq27, headPe, rating, buyBelow, sellAbove, ruleText, half, med };

if (require.main === module) {
  console.log('headline fwd median', HEAD.median, '| core median', n1(coreMed), 'p25', n1(coreP25), 'p75', n1(coreP75), '| core now (FY28E)', n1(coreNow), 'TTM-ish', n1(coreNowTtm), '| kept', KEPT.length, 'of', SERIES.length);
  console.log('by year', byYear.map(r => `${r.y}: core ${n1(r.med)} head ${n1(r.head)}`).join(' | '));
  console.log('disc sens', discSens.map(r => `${r.disc}%: ${n1(r.med)}`).join(' | '));
  PEERS.forEach(p => console.log(p.symbol.padEnd(11), p.basis.padEnd(12), 'PE', p.pe, '5y', p.pe5y, 'vs', p.vs?.toFixed(1), '| EV', p.evEbitda, '5y', p.ev5y, p.excluded ? 'EXCLUDED' : ''));
  console.log('derate', derate.toFixed(1), 'all', derateAll.toFixed(1), 'EV peer med', evPeerMed, '| MULT', JSON.stringify(MULT));
  for (const k of ['base', 'bull', 'bear']) { const s = SOTP[k]; console.log(k, 'per share', n0(s.perShare), 'implied P/E', s.implied.toFixed(3), 'core', n0(s.parts[0].ps), 'subs net', n0(s.subsNet / sh), 'eps28', n1(s.eps28)); }
  console.log('engine TP', V.tp, 'upside', V.upside.toFixed(1), 'rating', rating, '| DCF adj', n0(dcfAdj), 'EV adj', n0(evAdj), '| headline P/E check', n0(headPe.val));
}
