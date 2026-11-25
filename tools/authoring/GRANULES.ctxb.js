// Granules India initiation: shared context, part C (called by GRANULES.ctx.js with the merged context). Reverse-DCF test, sensitivity
// rows (not used in the base), rating from the house rule, the street as it stood on 30-Sep-2026, growth/returns/capital figures.
module.exports = X => {
  const { F, V, A, AS, D, b, ai, price, SHARES, sep, half, cagr, pct, medI, n1, epsRep, HB, HW, HEX, HPRE, FM, k, MULT, epsSep28, sectorAll, ownMv, SECTOR, ratingFor, buyAt, sellAt } = X;

  // 10) Reverse-DCF test (same mechanics as src/forecast.js dcf(), flat growth FY28-41E): growth the price needs
  const DC = AS.dcf, tTax = AS.taxRate[2] / 100, ke = V.ke;
  const dcfAt = g => { let s = F.sales[0], pv = 0, last = null; const n = DC.years;
    for (let kk = 1; kk <= n; kk++) { const sF = (kk - 3 + 1) / (n - 3 + 1); const m = kk < 3 ? F.ebitdaMargin[kk] : F.ebitdaMargin[2] + (DC.fadeMarginTo - F.ebitdaMargin[2]) * sF; const cx = kk < 3 ? F.capex[kk] / F.sales[kk] * 100 : F.capex[2] / F.sales[2] * 100 + (DC.fadeCapexPctTo - F.capex[2] / F.sales[2] * 100) * sF;
      s *= 1 + g / 100; const e = s * m / 100, dep = s * DC.depPctOfSales / 100, f = (e - dep) * (1 - tTax) + dep - s * cx / 100 - F.owcPct / 100 * s * (g / (100 + g)); pv += f / Math.pow(1 + ke / 100, kk - 0.5); last = f; }
    const tv = last * (1 + DC.terminalGrowth / 100) / ((ke - DC.terminalGrowth) / 100) / Math.pow(1 + ke / 100, n);
    return (pv + tv + F.treasury[0]) / SHARES * Math.pow(1 + ke / 100, 0.5); };
  let lo = 0, hi = 60; for (let i = 0; i < 50; i++) { const mid = (lo + hi) / 2; if (dcfAt(mid) < price) lo = mid; else hi = mid; }
  const gNeeded = (lo + hi) / 2, dcfAt12 = dcfAt(12), dcfAt15 = dcfAt(15);

  // 11) Sensitivity rows (not used in the base)
  const peV = (m, e) => Math.round(m * e / 10) * 10;
  const epsCagr = cagr(epsRep[2026], X.epsU[2], 3), epsCagrPf = cagr(A.eps[b], X.epsU[2], 3), salesCagr = cagr(A.sales[b], F.sales[2], 3), ebitdaCagr = cagr(A.ebitda[b], F.ebitda[2], 3);
  const SENS = [
    { name: `House base: forwardMedian since Apr-2021 (reported EPS, every 5th week) × ${k.toFixed(3)}`, mult: MULT.base, why: `${n1(HB.med)}x × ${k.toFixed(3)}` },
    { name: 'Every weekly close since Apr-2021 instead of every 5th week', mult: half(HW.med * k), why: `${n1(HW.med)}x × ${k.toFixed(3)}` },
    { name: 'EPS before exceptional items (FY25 insurance gain, FY26 net charge)', mult: half(HEX.med * k), why: `${n1(HEX.med)}x × ${k.toFixed(3)}: exceptionals are 2-4% of profit` },
    { name: 'Pre-issue share count for dates before Feb-2026 (FY27E EPS ex the raise\'s interest)', mult: half(HPRE.med * k), why: `${n1(HPRE.med)}x × ${k.toFixed(3)}` },
    { name: `Window from Apr-2024 only (after the cyber incident; the 'Granules 2.0' re-rating) × the nine peers' move over that window (${X.pc1(X.sector24)})`, mult: half(X.H24.med * (1 + X.sector24 / 100)), why: `${n1(X.H24.med)}x × ${(1 + X.sector24 / 100).toFixed(3)} (${X.H24.n} points)` },
    { name: 'No sector factor (own median only)', mult: half(HB.med), why: `${n1(HB.med)}x` },
    { name: `Blend with Granules' own move (${X.pc1(ownMv)}; not house policy)`, mult: half(HB.med * (1 + (SECTOR + ownMv) / 200)), why: `midpoint of +${SECTOR}% and ${X.pc1(ownMv)}` },
    { name: `Growth view: PEG 1.0x on our FY26-29E EPS growth (${n1(epsCagrPf)}% on the diluted base; not house policy)`, mult: half(1.0 * epsCagrPf), why: `1.0 × ${n1(epsCagrPf)}` },
    { name: 'Street P/E users: ICICI Securities 28x FY28E, Choice 25x FY28E, MOSL 23x 12M fwd (average, on our Sep-28E EPS)', mult: half((28 + 25 + 23) / 3), why: 'Jul-2026 notes' },
  ].map(r => ({ ...r, tp: peV(r.mult, epsSep28), up: (r.mult * epsSep28 / price - 1) * 100 }));
  const implPeAtPrice = price / epsSep28;

  // 12) Rating from the house rule; street as it stood on 30-Sep-2026
  const rating = ratingFor(V.upside);
  const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;
  const ST = D.street.brokers, br = n => ST.find(s => s.broker.startsWith(n));
  const withTp = ST.filter(s => s.tp), medTp = medI(withTp.map(s => s.tp));
  const postQ1 = ST.filter(s => s.date >= '2026-07-21'), medTpQ1 = medI(postQ1.map(s => s.tp));
  const nBuy = ST.filter(s => /Buy/.test(s.rating)).length, nAcc = ST.filter(s => /Accumulate|Add/.test(s.rating)).length;
  const icici = br('ICICI'), emkay = br('Emkay'), mosl = br('Motilal'), choice = br('Choice'), drc = br('DRChoksey'), geojit = br('Geojit'), elara = br('Elara');
  const patGap = (s, y, i) => (s?.pat?.[y] ? (F.pat[i] / s.pat[y] - 1) * 100 : null);

  // 13) Growth, returns, capital
  const capY = ['FY22', 'FY23', 'FY24', 'FY25', 'FY26'];
  const capex5 = capY.reduce((s, y) => s + (A.capex[ai(y)] || 0), 0), cfo5 = capY.reduce((s, y) => s + (A.cfo[ai(y)] || 0), 0);
  const salesCagr10 = cagr(A.sales[ai('FY16')], A.sales[b], 10), salesCagr3 = cagr(A.sales[ai('FY23')], A.sales[b], 3), divYield = F.dps[0] / price * 100;
  const cdmoShare26 = AS.businessLines.base.cdmo / A.sales[b] * 100, fdShare26 = AS.businessLines.base.fd / A.sales[b] * 100;
  return { dcfAt, gNeeded, dcfAt12, dcfAt15, peV, epsCagr, epsCagrPf, salesCagr, ebitdaCagr, SENS, implPeAtPrice, rating, buyBelow, sellAbove, ST, br, withTp, medTp, postQ1, medTpQ1, nBuy, nAcc,
    icici, emkay, mosl, choice, drc, geojit, elara, patGap, capex5, cfo5, salesCagr10, salesCagr3, divYield, cdmoShare26, fdShare26 };
};
