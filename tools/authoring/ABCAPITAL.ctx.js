// Aditya Birla Capital initiation: shared context, part 1 (data, built model, subsidiary forecasts,
// consolidated rebuild, sum of the parts). Part 2 (ABCAPITAL.ctx2.js) adds the holding-discount history,
// peers and the multiple derivations. As of 30-Sep-2026 (Q1FY27 basis).
// The lender engine models the STANDALONE company (the NBFC, with subsidiaries at cost); everything else is here.
const fs = require('fs');
const path = require('path');
const { buyBelow: buyAt, sellAbove: sellAt, ratingFor, ruleText } = require('../../src/ratings');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'ABCAPITAL', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json'), AS = rd('assumptions.json');
const CS = rd('screener-consolidated.json'); // consolidated Screener file saved before the switch to standalone
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'ABCAPITAL.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, SC = M.forecast.scenarios, fin = M.fin;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const n2 = v => (Math.round(v * 100) / 100).toFixed(2);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const SRC = 'ABCL presentations and calls (Q4FY21-Q1FY27), annual reports FY25-FY26, Screener.in (standalone), GAM Research';
const shortDate = d => { const [y, m, dd] = d.split('-'); const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+m - 1]; return dd ? `${+dd}-${mon}-${y.slice(2)}` : `${mon}-${y.slice(2)}`; };
const fi = l => fin.labels.indexOf(l);
const b = A.labels.length - 1; // FY26
const closes = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'market', 'closes', `${ASOF}.json`), 'utf8')).closes;
const price = M.price.last, sharesNow = F.sharesOut[0], mcap = price * sharesNow;
const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const S = AS.sotp, YRS = F.years; // FY27E-FY29E
const sep = (a, i0) => (a[i0] + a[i0 + 1]) / 2; // Sep-27E = sep(x, 0); Sep-28E = sep(x, 1) (FY-end arrays)

// ---- Subsidiary forecasts (FY26 actual + FY27E-FY29E) --------------------------------------------
const H = S.hfc, hAum = [H.aum.FY26, H.aum.FY27E, H.aum.FY28E, H.aum.FY29E];
const hPat = [647, ...[0, 1, 2].map(i => H.roa[i] / 100 * (hAum[i] + hAum[i + 1]) / 2)];
const hBook = [H.bookFY26]; [0, 1, 2].forEach(i => hBook.push(hBook[i] + hPat[i + 1] + (i === 0 ? H.advent : 0)));
const hRoe = [0, 1, 2].map(i => hPat[i + 1] / ((i === 0 ? hBook[0] + H.advent : hBook[i]) + hBook[i + 1]) * 2 * 100);
const L = S.life, ev = [L.evFY26]; [0, 1, 2].forEach(i => ev.push(ev[i] * (1 + L.roev[i] / 100) + L.capital[i]));
const evSep27 = ev[1] * Math.sqrt(1 + L.roev[1] / 100); // EV at the 12-month target date
const HE = S.health, gwp = [HE.gwp.FY26, HE.gwp.FY27E, HE.gwp.FY28E, HE.gwp.FY29E], gwpSep27 = (gwp[1] + gwp[2]) / 2;
const inv = [S.nbfc.investmentsAtCost.FY26, S.nbfc.investmentsAtCost.FY27E, S.nbfc.investmentsAtCost.FY28E, S.nbfc.investmentsAtCost.FY29E];
const amcClose = closes.ABSLAMC, moneyClose = closes.BIRLAMONEY;
const amcValue = S.amc.shares * amcClose, moneyValue = S.money.stake / 100 * S.money.shares * moneyClose, othersValue = S.others.valueCr;
const amcMcap = D.holdcoHistory.amcShares * amcClose;

// ---- Consolidated rebuild (owners' basis): model PAT − AMC dividend (after tax) + share of subsidiaries ----
const t = AS.taxRate[0] / 100, div = [0, 1, 2].map(i => S.amc.dps * Math.pow(1.1, i + 1) * S.amc.shares);
const amcPat = [S.amc.pat.FY27E, S.amc.pat.FY28E, S.amc.pat.FY29E], lifePat = [L.pat.FY27E, L.pat.FY28E, L.pat.FY29E];
const healthPat = [HE.pat.FY27E, HE.pat.FY28E, HE.pat.FY29E], othPat = [S.others.pat.FY27E, S.others.pat.FY28E, S.others.pat.FY29E];
const hfcShareYr = [H.stake / 100 + (1 - H.stake / 100) * (16 / 365), H.stake / 100, H.stake / 100]; // Advent from 17-Apr-2026
const CONS = [0, 1, 2].map(i => {
  const nbfc = F.pat[i] - div[i] * (1 - t);
  const parts = { nbfc, hfc: hfcShareYr[i] * hPat[i + 1], amc: S.amc.stake / 100 * amcPat[i], life: L.stake / 100 * lifePat[i], health: HE.stake / 100 * healthPat[i], others: othPat[i] };
  return { year: YRS[i], parts, pat: Object.values(parts).reduce((s, x) => s + x, 0) };
});
const consEq26 = C.consolidated.FY26.equityOwners, adventAccretion = H.stake / 100 * (H.bookFY26 + H.advent) - H.bookFY26;
const consEq = [consEq26]; CONS.forEach((c, i) => consEq.push(consEq[i] + c.pat + AS.capitalRaise[i] + (i === 0 ? adventAccretion : 0)));
CONS.forEach((c, i) => { c.eps = c.pat / F.sharesOut[i]; c.bvps = consEq[i + 1] / F.sharesOut[i]; c.roe = c.pat / ((consEq[i] + consEq[i + 1]) / 2) * 100; });
const consEps26 = C.consolidated.FY26.eps, consBvps26 = consEq26 / C.standalone.sharesMar26;
const consPatG = (CONS[0].pat / C.consolidated.FY26.patOwners - 1) * 100;

// ---- Sum of the parts (base / bull / bear) --------------------------------------------------------
const nwCase = k => (k === 'base' ? F.netWorth : SC[k].bvps.map((x, i) => x * F.sharesOut[i]));
const bvCase = k => (k === 'base' ? F.bvps : SC[k].bvps);
function sotp(k) {
  const nw = nwCase(k), nb = [0, 1, 2].map(i => nw[i] - inv[i + 1]);
  const nbfcBook28 = sep(nb, 1), nbfcBook27 = sep(nb, 0), hfcBook28 = sep(hBook.slice(1), 1), hfcBook27 = sep(hBook.slice(1), 0);
  const mult = x => x[k] ?? x.base;
  const parts = [
    { key: 'nbfc', name: 'Lending (NBFC, inside ABCL)', method: 'P/B, Sep-28E book', metric: nbfcBook28, mult: mult(S.nbfc.multiple), stake: 100 },
    { key: 'hfc', name: 'Aditya Birla Housing Finance', method: 'P/B, Sep-28E book', metric: hfcBook28, mult: mult(H.multiple), stake: H.stake },
    { key: 'amc', name: 'Aditya Birla Sun Life AMC (listed)', method: 'Market value, 30-Sep close', metric: amcMcap, mult: 1, stake: S.amc.stake },
    { key: 'life', name: 'Aditya Birla Sun Life Insurance', method: 'P/EV, Mar-27E EV', metric: ev[1], mult: mult(L.multiple), stake: L.stake },
    { key: 'health', name: 'Aditya Birla Health Insurance', method: 'P/GWP, FY27E premium', metric: gwp[1], mult: mult(HE.multiple), stake: HE.stake },
    { key: 'money', name: 'Aditya Birla Money (listed) + ARC at book', method: 'Market value; book', metric: moneyValue + othersValue, mult: 1, stake: 100 },
  ];
  parts.forEach(p => { p.value = p.metric * p.mult * p.stake / 100; p.perShare = p.value / sharesNow; });
  const gross = parts.reduce((s, p) => s + p.value, 0), disc = S.holdco[k] ?? S.holdco.base;
  const equity = gross * (1 - disc / 100), perShare = equity / sharesNow;
  const bv28 = sep(bvCase(k), 1);
  return { k, parts, gross, grossPs: gross / sharesNow, disc, discValue: gross * disc / 100, equity, perShare, bv28, implied: perShare / bv28, nbfcBook27, nbfcBook28, hfcBook27, hfcBook28,
    nbfcTrail: mult(S.nbfc.multiple) * nbfcBook28 / nbfcBook27, hfcTrail: mult(H.multiple) * hfcBook28 / hfcBook27, nbfcBookMar27: nb[0], hfcBookMar27: hBook[1], subsShare: (gross - parts[0].value) / gross * 100 };
}
const SOTP = { base: sotp('base'), bull: sotp('bull'), bear: sotp('bear') };
const SB = SOTP.base, part = key => SB.parts.find(p => p.key === key);

// Rating from the house rule (never typed)
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;
const ST = D.street.brokers, tps = ST.map(s => s.tp), tpHi = Math.max(...tps), tpLo = Math.min(...tps);

module.exports = { fs, path, ROOT, RD, C, D, SG, AS, CS, M, F, V, A, SC, fin, fi, b, ASOF, ASOF_TXT, n0, n1, n2, pc, pc1, SRC, shortDate, closes, price, sharesNow, mcap, BM, mv, S, YRS, sep,
  hAum, hPat, hBook, hRoe, ev, evSep27, gwp, gwpSep27, inv, amcClose, amcValue, amcMcap, moneyValue, othersValue, div, CONS, consEq, consEps26, consBvps26, consPatG, adventAccretion,
  SOTP, SB, part, rating, buyBelow, sellAbove, ruleText, ST, tpHi, tpLo };
