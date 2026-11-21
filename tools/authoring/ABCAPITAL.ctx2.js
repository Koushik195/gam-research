// Aditya Birla Capital initiation: shared context, part 2. Holding-company discount history (house method,
// as GODREJIND: ABCL's market value vs its look-through value at each quarter-end, on the same conventions
// and constant multiples as our SOTP), peers at the 30-Sep-2026 close (lenders, HFCs, insurers) and the
// derivation of each SOTP multiple. As of 30-Sep-2026.
const X = require('./ABCAPITAL.ctx');
const { fs, path, ROOT, D, AS, CS, M, F, S, SB, SOTP, sharesNow, price, closes, ASOF, hBook, ev, gwp, inv, othersValue } = X;
const scr = s => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', s, 'screener.json'), 'utf8'));
const at = (s, d) => { const f = (s || []).filter(([x, v]) => x <= d && v != null); return f.length ? f[f.length - 1][1] : null; };
const med = a => { const s = a.filter(x => x != null && Number.isFinite(x)).sort((x, y) => x - y), m = s.length / 2; return s.length ? (s.length % 2 ? s[Math.floor(m)] : (s[m - 1] + s[m]) / 2) : null; };
const step = (list, d) => { let v = list[0][1]; for (const [x, y] of list) if (x <= d) v = y; return v; };

// ---- Holding discount history -------------------------------------------------------------------------
const HH = D.holdcoHistory, MP = HH.march;
const px = { abc: scr('ABCAPITAL').charts.price.Price, amc: scr('ABSLAMC').charts.price.Price, money: scr('BIRLAMONEY').charts.price.Price };
const yr = d => +d.slice(0, 4), mo = d => +d.slice(5, 7);
const fy27 = { nbfcBook: F.netWorth[0] - inv[1], hfcBook: hBook[1], lifeEv: ev[1], healthGwp: gwp[1] };
const jun26 = { ...HH.jun2026, lifeEv: MP[2026].lifeEv + (ev[1] - MP[2026].lifeEv) * 0.25, healthGwp: HH.jun2026.healthGwpTtm };
const lastMarch = (d, k) => { const y = mo(d) >= 5 ? yr(d) : yr(d) - 1; return d > '2026-06-30' || y >= 2026 ? MP[2026][k] : MP[y][k]; };
function pointAt(d, k) { // linear between March points; Jun-26 actual; Sep-26 between Jun-26 and Mar-27E
  if (d === '2026-06-30') return jun26[k];
  if (d > '2026-06-30') return jun26[k] + (fy27[k] - jun26[k]) * (1 / 3);
  const y = mo(d) <= 3 ? yr(d) : yr(d) + 1, w = mo(d) <= 3 ? 1 : (mo(d) - 3) / 12;
  const a = MP[mo(d) <= 3 ? y - 1 : y - 1]?.[k], c = MP[y]?.[k];
  return mo(d) === 3 ? MP[yr(d)][k] : a + (c - a) * w;
}
const sharesList = [['2022-03-31', 241.6], ['2023-03-31', 241.8], ['2023-09-30', 260.0], ['2025-03-31', 260.7], ['2026-03-31', 261.96], ['2026-06-30', sharesNow]];
const mN = SB.nbfcTrail, mH = SB.hfcTrail, mL = S.life.multiple.base, mG = S.health.multiple.base;
function discRow(d, close) {
  const sh = step(sharesList, d), mc = close * sh;
  const amcSt = step(HH.stakes.amc, d), hSt = step(HH.stakes.health, d), hfcSt = step(HH.stakes.hfc, d);
  const parts = { nbfc: mN * pointAt(d, 'nbfcBook'), hfc: mH * pointAt(d, 'hfcBook') * hfcSt / 100, amc: amcSt / 100 * HH.amcShares * at(px.amc, d), life: mL * lastMarch(d, 'lifeEv') * S.life.stake / 100,
    health: mG * lastMarch(d, 'healthGwp') * hSt / 100, money: HH.moneyStake / 100 * HH.moneyShares * at(px.money, d), others: othersValue };
  const ltv = Object.values(parts).reduce((s, x) => s + x, 0);
  return { d, close, shares: sh, mcap: mc, parts, ltv, ltvPs: ltv / sh, disc: (1 - mc / ltv) * 100, discSubs: (1 - (mc - parts.nbfc) / (ltv - parts.nbfc)) * 100 };
}
const QE = []; for (let y = 2022; y <= 2026; y++) for (const m of ['03-31', '06-30', '09-30', '12-31']) { const d = `${y}-${m}`; if (d >= '2022-03-31' && d <= '2026-06-30') QE.push(d); }
const discHist = QE.map(d => discRow(d, at(px.abc, d)));
const discNow = discRow(ASOF, price);
const discMedAll = med(discHist.map(r => r.disc)), discRecent = discHist.filter(r => r.d >= '2024-09-30'), discMedRecent = med(discRecent.map(r => r.disc));
const discMin = Math.min(...discHist.map(r => r.disc)), discMax = Math.max(...discHist.map(r => r.disc));
const discSubsMedAll = med(discHist.map(r => r.discSubs)), discSubsNow = discNow.discSubs;
const derivedDisc = { base: Math.round(discMedRecent), bull: Math.max(0, Math.round(discNow.disc)), bear: Math.round(discMedAll) };
for (const k of ['base', 'bull', 'bear']) if (S.holdco[k] !== derivedDisc[k]) console.warn(`ABCAPITAL: holding discount ${k} ${S.holdco[k]}% in assumptions differs from derived ${derivedDisc[k]}%`);

// ---- Peers at the 30-Sep-2026 close ----------------------------------------------------------------------
function peer(sym) {
  const P = scr(sym), wk = at(P.charts.price.Price, ASOF), c = closes[sym] ?? wk, k = c / wk, ser = (ch, nm) => P.charts[ch]?.[nm] || [];
  const md = s => { const v = s.filter(([d0, x]) => d0 >= '2021-09-30' && d0 <= ASOF && x > 0).map(x => x[1]).sort((a, z) => a - z); return v.length > 50 ? v[Math.floor(v.length / 2)] : null; };
  const pb = at(ser('pb', 'Price to book value'), ASOF), pe = at(ser('pe', 'Price to Earning'), ASOF);
  const pl = P.tables['profit-loss'], bs = P.tables['balance-sheet'], i = pl.periods.indexOf('Mar 2026'), j = bs.periods.indexOf('Mar 2026'), j0 = bs.periods.indexOf('Mar 2025');
  const nw = jj => (bs.rows['Equity Capital']?.[jj] || 0) + (bs.rows['Reserves']?.[jj] || 0), pat = pl.rows['Net Profit']?.[i];
  const r = { symbol: sym, price: c, pb: pb ? pb * k : null, pbMed: md(ser('pb', 'Price to book value')), pe: pe ? pe * k : null, peMed: md(ser('pe', 'Price to Earning')), roe: j >= 0 && j0 >= 0 ? pat / ((nw(j) + nw(j0)) / 2) * 100 : null, eqCap: bs.rows['Equity Capital'] };
  r.pbVs = r.pb && r.pbMed ? (r.pb / r.pbMed - 1) * 100 : null; r.pbPerRoe = r.pb && r.roe > 0 ? r.pb / r.roe : null; return r;
}
const LENDERS = ['BAJFINANCE', 'CHOLAFIN', 'SHRIRAMFIN', 'MUTHOOTFIN', 'SBICARD', 'MANAPPURAM', 'LTF', 'M&MFIN', 'POONAWALLA', 'HDBFS'];
const HFCS = ['BAJAJHFL', 'LICHSGFIN', 'PNBHOUSING', 'AAVAS', 'APTUS', 'HOMEFIRST', 'CANFINHOME', 'AADHARHFC'];
const PEERS = Object.fromEntries([...LENDERS, ...HFCS, 'STARHEALTH', 'NIVABUPA', 'HDFCLIFE', 'SBILIFE', 'ABSLAMC'].map(s => [s, peer(s)]));
const DR = ['BAJFINANCE', 'CHOLAFIN', 'SHRIRAMFIN', 'MUTHOOTFIN', 'SBICARD', 'MANAPPURAM', 'LTF', 'M&MFIN', 'POONAWALLA']; // five-year history, ABCL excluded
const sectorPbDr = med(DR.map(s => PEERS[s].pbVs));
const DIV = ['BAJFINANCE', 'CHOLAFIN', 'SHRIRAMFIN', 'LTF', 'M&MFIN', 'HDBFS']; // diversified retail/MSME lenders for P/B per point of ROE
const pbPerRoe = med(DIV.map(s => PEERS[s].pbPerRoe));
const HFC_DR = ['LICHSGFIN', 'PNBHOUSING', 'AAVAS', 'APTUS', 'HOMEFIRST', 'CANFINHOME'], hfcPbDr = med(HFC_DR.map(s => PEERS[s].pbVs));
const HFC_REL = ['BAJAJHFL', 'PNBHOUSING', 'AAVAS', 'APTUS', 'HOMEFIRST', 'AADHARHFC'], hfcPbPerRoe = med(HFC_REL.map(s => PEERS[s].pbPerRoe));
// NBFC: ROE of the lending book alone (model PAT less the AMC dividend, on standalone book less investments at cost)
const nbfcRoe = [0, 1, 2].map(i => { const nb0 = (i ? F.netWorth[i - 1] : M.annual.netWorth.at(-1)) - inv[i], nb1 = F.netWorth[i] - inv[i + 1]; return (F.pat[i] - X.div[i] * (1 - AS.taxRate[i] / 100)) / ((nb0 + nb1 + (i === 0 ? AS.capitalRaise[0] * 0.25 : 0)) / 2) * 100; });
const nbfcRoeFwd = (nbfcRoe[1] + nbfcRoe[2]) / 2;
const nbfcTrailDer = pbPerRoe * nbfcRoeFwd, nbfcFwdDer = nbfcTrailDer * SB.nbfcBookMar27 / SB.nbfcBook28; // trailing multiple on Mar-27E book at the target date, restated on Sep-28E book
const nbfcDerived = Math.round(nbfcFwdDer * 10) / 10;
const hfcRoeFwd = (X.hRoe[1] + X.hRoe[2]) / 2, hfcTrailDer = hfcPbPerRoe * hfcRoeFwd, hfcFwdDer = hfcTrailDer * SB.hfcBookMar27 / SB.hfcBook28, hfcDerived = Math.round(hfcFwdDer * 10) / 10;
const adventPb = S.hfc.advent / 0.14286 / (S.hfc.bookFY26 + S.hfc.advent); // post-money P/B of Advent's entry
// Life: listed peers' P/EV on Mar-26 EV at the 30-Sep close; P/EV ÷ operating RoEV applied to ABSLI's RoEV
const LIFE = { HDFCLIFE: { ev: 62139, roev: 15.0, sh: 217.25, hist: { 2021: 26600, 2022: 30000, 2023: 39500, 2024: 47500, 2025: 55423, 2026: 62139 } }, SBILIFE: { ev: 80790, roev: 19.7, sh: 100.33, hist: { 2021: 36400, 2022: 39630, 2023: 46040, 2024: 58260, 2025: 70250, 2026: 80790 } }, ICICIPRULI: { ev: 52989, roev: 11.9, sh: 145.08 } };
for (const [s, L] of Object.entries(LIFE)) L.pev = closes[s] * L.sh / L.ev;
function pevHist(sym) { const L = LIFE[sym], P = scr(sym), bs = P.tables['balance-sheet']; const shAt = d => { const y = mo(d) <= 3 ? yr(d) : yr(d) + 1; const i = bs.periods.indexOf(`Mar ${Math.min(y, 2026)}`); return (bs.rows['Equity Capital'][i] || bs.rows['Equity Capital'].at(-1)) / 10; };
  return P.charts.price.Price.filter(([d]) => d >= '2021-09-30' && d <= ASOF).map(([d, p]) => { const evY = mo(d) >= 5 ? yr(d) : yr(d) - 1; return [d, p * shAt(d) / L.hist[evY]]; }); }
const pevMed = { HDFCLIFE: med(pevHist('HDFCLIFE').map(x => x[1])), SBILIFE: med(pevHist('SBILIFE').map(x => x[1])) };
const lifeDr = med(['HDFCLIFE', 'SBILIFE'].map(s => (LIFE[s].pev / pevMed[s] - 1) * 100));
const pevPerRoev = med(Object.values(LIFE).map(L => L.pev / L.roev)), absliRoev = 13.2, lifeDerived = Math.round(pevPerRoev * absliRoev * 10) / 10;
// Health: listed SAHI peers' price ÷ FY26 GWP (without 1/n); ABHI runs a ~105% combined ratio vs ~99-101%
const HEALTH = { STARHEALTH: { gwp: 20369, sh: 58.84, cor: 98.8 }, NIVABUPA: { gwp: 9432.9, sh: 184.75, cor: 101.4 } };
for (const [s, Hh] of Object.entries(HEALTH)) Hh.pg = closes[s] * Hh.sh / Hh.gwp;
const healthPeerPg = med(Object.values(HEALTH).map(Hh => Hh.pg)), healthHaircut = 1 / 3, healthDerived = Math.round(healthPeerPg * (1 - healthHaircut) * 10) / 10;
const CHECK = [['NBFC P/B', nbfcDerived, S.nbfc.multiple.base], ['HFC P/B', hfcDerived, S.hfc.multiple.base], ['life P/EV', lifeDerived, S.life.multiple.base], ['health P/GWP', healthDerived, S.health.multiple.base]];
for (const [nm, d0, a] of CHECK) if (Math.abs(d0 - a) > 0.051) console.warn(`ABCAPITAL: derived ${nm} ${d0}x differs from assumptions ${a}x`);

module.exports = { ...X, at, med, discHist, discNow, discMedAll, discMedRecent, discRecent, discMin, discMax, discSubsMedAll, discSubsNow, derivedDisc, mN, mH, mL, mG, sharesList,
  PEERS, LENDERS, HFCS, DR, sectorPbDr, DIV, pbPerRoe, HFC_DR, hfcPbDr, HFC_REL, hfcPbPerRoe, nbfcRoe, nbfcRoeFwd, nbfcTrailDer, nbfcFwdDer, nbfcDerived, hfcRoeFwd, hfcTrailDer, hfcFwdDer, hfcDerived, adventPb,
  LIFE, pevMed, lifeDr, pevPerRoev, absliRoev, lifeDerived, HEALTH, healthPeerPg, healthHaircut, healthDerived };

if (require.main === module) {
  const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
  discHist.forEach(r => console.log(r.d, r.close, n1(r.shares), Math.round(r.mcap), Math.round(r.ltv), n1(r.ltvPs), n1(r.disc), n1(r.discSubs)));
  console.log('NOW', Math.round(discNow.ltv), n1(discNow.ltvPs), n1(discNow.disc), n1(discNow.discSubs), '| medAll', n1(discMedAll), 'medRecent', n1(discMedRecent), 'min', n1(discMin), 'max', n1(discMax), 'subsMed', n1(discSubsMedAll), JSON.stringify(derivedDisc));
  console.log('sectorPbDr', n1(sectorPbDr), 'pbPerRoe', pbPerRoe.toFixed(3), 'nbfcRoe', nbfcRoe.map(n1), 'trail', n1(nbfcTrailDer), 'fwd', nbfcFwdDer.toFixed(2), '| hfcDr', n1(hfcPbDr), 'hfcPbPerRoe', hfcPbPerRoe.toFixed(3), 'hfcRoeFwd', n1(hfcRoeFwd), 'fwd', hfcFwdDer.toFixed(2), 'advent', adventPb.toFixed(2));
  console.log('life', JSON.stringify(Object.fromEntries(Object.entries(LIFE).map(([s, L]) => [s, L.pev.toFixed(2)]))), 'pevMed', JSON.stringify(pevMed), 'lifeDr', n1(lifeDr), 'pevPerRoev', pevPerRoev.toFixed(3), 'derived', lifeDerived, '| health', JSON.stringify(Object.fromEntries(Object.entries(HEALTH).map(([s, Hh]) => [s, Hh.pg.toFixed(2)]))), healthDerived);
  console.log(Object.values(PEERS).map(p => `${p.symbol} pb ${n1(p.pb)} med ${p.pbMed} vs ${p.pbVs == null ? '-' : n1(p.pbVs)} roe ${p.roe == null ? '-' : n1(p.roe)} pb/roe ${p.pbPerRoe == null ? '-' : p.pbPerRoe.toFixed(3)}`).join('\n'));
}
