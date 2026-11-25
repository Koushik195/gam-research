// Granules India report, part 5b: valuation (first half: method, multiple derivation, sector factor, forward P/E history).
// P/E primary (the method of five of the six brokers that disclose one); multiple = house forwardMedian since Apr-2021 x 1.082 (names
// outside the nine-peer set, PLAYBOOK §7c), nearest half-turn. The second half (target, cross-checks, sensitivities, scenarios, DCF,
// peers) is part5d.
const X = require('./GRANULES.ctx');
const { D, n0, n1, pc1, ASOF_TXT, price, MULT, epsSep28, HB, HW, HEX, HPRE, FM, byFyMed, troughLine, epsRep, SET, MW, MWEV, sectorCalc, sectorEvCalc, SECTOR, SECTOR_EV, k, shortName, P, ownMv, ownEvMv, epsCagrPf, salesCagr, ebitdaCagr, implPeAtPrice, fwdNow, trailEps, sector24, H24, W24 } = X;
const P5d = require('./GRANULES.part5d');
const sortDesc = (arr, o) => [...arr].sort((a, c) => o[c].mv - o[a].mv);
const FMS = FM.series;

const blocksA = [
  { h: 'How the street values Granules' },
  { p: 'Of the seven brokers with notes standing on 30-Sep-2026, six disclose a method in what we could read. Five use **P/E**: ICICI Securities 28x FY28E, Choice 25x FY28E, MOSL 23x twelve-month-forward, Elara 24x FY28E "core" EPS plus cash per share, and DRChoksey (18x Sep-27E in its last disclosed note). Emkay uses a sum of the parts. We therefore value Granules on **P/E on Sep-28E EPS (half FY28E, half FY29E)** on the post-conversion share count (27.28 cr), with EV/EBITDA and a DCF as cross-checks.' },
  { h: `Our target multiple: ${MULT.base}x, and why` },
  { p: `The house starting point is Granules' own one-year-forward P/E (price ÷ the next full fiscal year's EPS) from Apr-2021 to ${ASOF_TXT}, from tools/authoring/valuation-blend.js (every 5th weekly close, ${HB.n} points; reported EPS for FY23-FY26, our estimates for FY27E-FY28E). **Trough rule:** no year is left out. FY24 EPS (₹${epsRep[2024]}, hit by the cyber incident) and FY25 (₹${epsRep[2025]}, hit by the Gagillapur pause) were both above half the prior three-year peak (₹${n1(troughLine(2024))} and ₹${n1(troughLine(2025))}). **Exceptional items** were 2-4% of profit (FY25 insurance gain, FY26 net charge), so the base uses reported EPS; EPS before them gives the same ${n1(HEX.med)}x. The median is **${n1(HB.med)}x**. Granules is outside the nine-name pharma set, so we multiply by the set's median move, **+${SECTOR}%**, and round to the nearest half-turn: ${n1(HB.med)}x × ${k.toFixed(3)} = ${n1(HB.med * k)}x → **${MULT.base}x**. No blend with Granules' own move, no growth uplift (sensitivities in part two). The turnaround rule does not apply: EPS never fell to a loss or near zero.` },
  { exhibit: { type: 'table', title: 'Deriving the target multiple', head: ['Yardstick', 'Evidence', 'What it implies'], wide: [1, 2], rows: [
    ['1. Its own history', `Forward P/E since Apr-2021: median **${n1(HB.med)}x** (25th-75th percentile ${n1(HB.p25)}-${n1(HB.p75)}x; range ${n1(HB.min)}-${n1(HB.max)}x). By forward year: FY23 EPS ${n1(byFyMed[2023].med)}x, FY24 ${n1(byFyMed[2024].med)}x, FY25 ${n1(byFyMed[2025].med)}x, FY26 ${n1(byFyMed[2026].med)}x, FY27E ${n1(byFyMed[2027].med)}x, FY28E ${n1(byFyMed[2028].med)}x. Every weekly close: ${n1(HW.med)}x; pre-issue share count: ${n1(HPRE.med)}x`, `Starting point: ${n1(HB.med)}x`],
    ['2. Sector move', `Nine pharma peers' trailing P/E at the ${ASOF_TXT} close vs their five-year medians (table below): median **+${SECTOR}%** (reproduced ${pc1(sectorCalc)}); all 15 pharma names also +8.2%`, `${n1(HB.med)}x × ${k.toFixed(3)} = ${n1(HB.med * k)}x → **${MULT.base}x**`],
    ['3. Growth', `EPS ~${Math.round(epsCagrPf)}% a year FY26-29E on the diluted base (revenue ~${Math.round(salesCagr)}%, EBITDA ~${Math.round(ebitdaCagr)}%); EPS flat over FY21-FY26`, 'No premium (growth view is a sensitivity row)'],
    ['4. Peers', `Trailing P/E on ${ASOF_TXT}: Aurobindo ${n1(P.AUROPHARMA.pe)}x, Zydus ${n1(P.ZYDUSLIFE.pe)}x, Cipla ${n1(P.CIPLA.pe)}x, Ipca ${n1(P.IPCALAB.pe)}x, Natco ${n1(P.NATCOPHARM.pe)}x, Laurus ${n1(P.LAURUSLABS.pe)}x; Granules ${n1(P.GRANULES.pe)}x (Screener)`, `${MULT.base}x Sep-28E ≈ ${n1(MULT.base * epsSep28 / trailEps)}x trailing EPS: near US-generics peers, below CDMOs`],
    ['5. Returns', 'ROE 13-14% (FY24-26), {{F.roe.0|pct}} / {{F.roe.2|pct}} in FY27E / FY29E vs a 12.5% cost of equity', 'No premium: returns only just above the cost of capital'],
    ['6. Street basis', `ICICI Securities 28x, Choice 25x FY28E; MOSL 23x forward; the price is ${n1(implPeAtPrice)}x our Sep-28E EPS and ${n1(fwdNow)}x FY28E`, 'We sit well below the street'],
  ], source: `Screener.in weekly prices to ${ASOF_TXT}; GAM estimates; peers' Screener files (asof-peers.js)` } },
  { exhibit: { type: 'table', title: `Pharma sector factor: trailing multiples at the ${ASOF_TXT} close vs five-year medians`, head: ['Company', 'P/E (x)', 'Five-year median (x)', 'P/E vs median', 'EV/EBITDA vs median'], rows: [
    ...sortDesc(SET, MW).map(s => [shortName(s), n1(MW[s].cur), n1(MW[s].med), pc1(MW[s].mv), pc1(MWEV[s].mv)]),
    { hl: true, cells: [`**Median of the nine (brief: +${SECTOR}% / +${SECTOR_EV}%)**`, '', '', `**${pc1(sectorCalc)}**`, `**${pc1(sectorEvCalc)}**`] },
    ['Granules (not in the set: own stock)', n1(MW.GRANULES.cur), n1(MW.GRANULES.med), pc1(ownMv), pc1(ownEvMv)],
    ...Object.entries(D.peers.excluded).map(([s, why]) => [shortName(s), '', '', '', `Excluded: ${why}`]),
  ], source: `Screener.in "Price to Earning" and "EV Multiple" series from 30-Sep-2021 to ${ASOF_TXT}, scaled to the NSE close (asof-peers.js); tools/authoring/sector-factor.js gives +8.20% (P/E) and +7.50% (EV/EBITDA)` } },
  { exhibit: { type: 'line', title: `Forward P/E since Apr-2021: median ${n1(HB.med)}x, our ${MULT.base}x, today ~${Math.round(fwdNow)}x FY28E`, unit: 'Price ÷ next full-year EPS (x)', x: FMS.map(x => x[0]), series: [{ name: 'Forward P/E', values: FMS.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, min: 0, max: 32, lines: [{ v: HB.med, text: `Median: ${n1(HB.med)}x` }, { v: MULT.base, text: `Our target: ${MULT.base}x`, color: '#cf8f1f' }], source: 'Screener.in weekly prices (every 5th week); reported EPS; GAM estimates FY27-28E' } },
  { callout: `**The re-rating, in one line.** For dates in FY22-FY24 the market paid ${n1(byFyMed[2023].med)}-${n1(byFyMed[2024].med)}x the next year's EPS; in FY25 ${n1(byFyMed[2026].med)}x (FY26 EPS), in FY26 ${n1(byFyMed[2027].med)}x (our FY27E) and in Apr-Sep 2026 ~${n1(byFyMed[2028].med)}x our FY28E. Over the window from Apr-2024 alone (the 'Granules 2.0' period) the median is ${n1(H24.med)}x; times the peers' move over that window (${pc1(sector24)}) that is ~${X.half(H24.med * (1 + sector24 / 100))}x, roughly where the stock trades. The house rule uses the whole history since Apr-2021, as for every name without a structural break, and gives ${MULT.base}x.` },
];

const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${MULT.base}x Sep-28E EPS gives {{dcf.tp|inr}}; the price pays ~${Math.round(implPeAtPrice)}x and the DCF says it needs ~${Math.round(X.gNeeded)}% growth for 15 years`,
  blocks: [...blocksA, ...P5d.blocks],
};

module.exports = { valuation };
