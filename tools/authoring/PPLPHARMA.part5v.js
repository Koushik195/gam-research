// Piramal Pharma report, part 5v: valuation (street table, multiple derivation, forward EV/EBITDA history, sum of the
// parts, sector factor peer by peer, sensitivities). Scenarios, DCF and peers in part5b.
const X = require('./PPLPHARMA.ctx');
const { streetBlocks } = require('./valuation-blend');
const { F, V, AS, n0, n1, pc1, r1, rup, shortDate, price, sh, mv, rating, MULT, EVM, EVH, EVH_BASE, EVH_BYFY, EVH_TRAIL, EVS, TROUGH, troughYears, K, SECTOR_EV, FW, F5, SET, P, shortName, ownDrEv, SOTP, JV_MULT, JV_VALUE, JV_BOOK, jvShareSep28, ebitdaSep28, SENS, postQ1, WIN_TXT, ASOF_TXT, evNow, evNowSep, ST } = X;

const streetRows = ST.map(s => [`${s.broker} (${shortDate(s.date)})`, s.rating, s.tp, s.method, s.multiple || null, s.on || null, rup(s.thesis).slice(0, 120)]);
const trEb = t => `${t.fy}: EBITDA ₹${n0(t.eb)} cr vs half-peak ₹${n0(t.ebHalfPeak)} cr`;
const tr = t => `${t.fy}: EPS ₹${n1(t.eps)} vs half-peak ₹${n1(t.epsHalfPeak)}${t.troughEps ? ' → trough' : ''}`;
const sotpRow = (p, c) => [rup(p.name), n0(p.value), n1(p.value / sh)];
const fwdChart = EVS.filter((_, i) => i % 2 === 0 || i === EVS.length - 1);
const peerRow = s => (s === 'PPLPHARMA' ? ['**Piramal Pharma**', n1(P[s].evEbitda), n1(FW.medEv[s]), pc1(FW.drEv[s]), 'n.m.', 'n.m.', 'n.m.', 'Self (not in set)'] : [shortName(s), n1(P[s].evEbitda), n1(FW.medEv[s]), pc1(FW.drEv[s]), n1(P[s].pe), n1(FW.med[s]), pc1(FW.dr[s]), 'Yes']);

const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${MULT.base}x Sep-28E EBITDA plus the AbbVie JV, less net debt, gives {{dcf.tp|inr}}: upside on the street's method, none on cash flows`,
  blocks: [
    ...streetBlocks('PPLPHARMA', {
      rating, noOurEps: true,
      streetIntro: 'Nobody values Piramal on P/E: profits are near zero. Of the brokers that disclose a method in their latest note, two use a **sum of the parts built on EV/EBITDA** (Motilal Oswal: CDMO 23x, CHG 11x, ICH 13x 12-month-forward EBITDA; ICICI Direct: CDMO 17x and CHG 15x FY28E EBITDA, PCH 2x sales, the AbbVie JV 10x profit) and two a single consolidated EV/EBITDA (Choice 24x FY28E; InCred 24.6x FY27F, a year old); JM Financial\'s last disclosed method was also a sum of the parts. We follow the majority: a sum of the parts on EV/EBITDA, with the JV valued separately because its profit sits below EBITDA.',
      street: streetRows,
      ourThesis: 'Recovery real; upside on its own EV/EBITDA history; EBITDA not yet profit',
      streetSource: 'Broker notes and summaries as cited in deep.json; n.d. = not disclosed in the sources we saw',
      derivationTitle: `Our operating multiple: ${MULT.base}x, and why`,
      derivationIntro: `House rule (PLAYBOOK §4, §7c): the stock's own one-year-forward multiple (EV ÷ next full year's EBITDA) over its window, leaving out trough years (tested on forward EBITDA for an EV/EBITDA history), times the sector factor over the same window, rounded to the half-turn. Piramal listed in October 2022, so its window starts on ${WIN_TXT} (post-listing months skipped) and pairs with the nine pharma peers' move since then. Piramal reports one segment, so the three businesses take one multiple; the street's segment multiples are sensitivity rows. No blend with Piramal's own re-rating and no growth uplift.`,
      derivation: [
        ['1. Own history', `Forward EV/EBITDA since ${WIN_TXT}, every weekly close plus the 30-Sep close (${EVH.n} points): EV = market value + net debt incl. leases (latest March published by end-May; the Aug-2023 rights money deducted from its listing), less the AbbVie JV's value above book (10x its profit share). Median ${n1(EVH.med)}x; by forward year: FY25 ${n1(EVH_BYFY.FY25.med)}x, FY26 ${n1(EVH_BYFY.FY26.med)}x, FY27E ${n1(EVH_BYFY.FY27.med)}x, FY28E ${n1(EVH_BYFY.FY28.med)}x`, `${n1(EVH.med)}x with every point`],
        ['2. Trough rule (§4, on EBITDA)', `For an EV/EBITDA history the house applies §4's test to forward EBITDA (precedent: NH, FORTIS and MAXHEALTH compute troughs on EBITDA; TORNTPHARM: "no trough years: forward EBITDA rose every year"). Forward EBITDA below half the prior three-year peak? ${TROUGH.map(trEb).join('; ')}: no year qualifies, so every point stays, including Apr-2024 to Mar-2025 (median ~${n1(EVH_BYFY.FY26.med)}x as FY26 EBITDA fell 36%). The EPS reading (forward FY26 EPS a loss) would drop those dates: ${n1(X.EVH_EX26.med)}x → ${SENS[1].mult}x → ₹${n0(SENS[1].tp)}, a sensitivity row. FY23-24's depressed EBITDA is outside the forward window; it sits in the early months of Screener's trailing series (median ${n1(EVH_TRAIL.med)}x)`, `**${n1(EVH_BASE.med)}x** (${EVH_BASE.n} points)`],
        ['3. One-offs rule', 'EBITDA here is Screener\'s operating profit, which excludes exceptional items (FY26 ₹196 cr; FY24 ₹59 cr) and other income; forecasts carry none. The fire loss (₹42 cr, FY26) stays in, as reported', 'No adjustment needed'],
        ['4. Sector factor', `Nine pharma peers' trailing EV/EBITDA at the ${ASOF_TXT} close vs their medians since ${WIN_TXT}: median +${SECTOR_EV}% (each peer rounded to 0.1pt; reproduced ${pc1(FW.ev)} with sector-factor.js; P/E ${pc1(FW.pe)}). Five-year check: ${pc1(F5.ev)} EV/EBITDA, ${pc1(F5.pe)} P/E (PLAYBOOK §7c: +7.5% / +8.2%)`, `${n1(EVH_BASE.med)}x × ${K.toFixed(3)} = ${n1(EVH_BASE.med * K)}x → **${MULT.base}x**`],
        ['5. Own re-rating', `Piramal trades ${pc1(ownDrEv)} above its own median trailing EV/EBITDA since ${WIN_TXT}`, 'Not blended (PLAYBOOK §7c); sensitivity row'],
        ['6. Growth and returns', `EBITDA +${Math.round((F.ebitda[2] / 922 - 1) * 100)}% FY26-29E on our numbers, but ROE only {{F.roe.2|pct}} in FY29E vs a ~12% cost of capital`, 'Growth is a recovery from a trough; returns stay below the cost of capital; no uplift'],
        ['7. Bull / bear', `75th / 25th percentile of the same history (${n1(EVH_BASE.p75)}x / ${n1(EVH_BASE.p25)}x) × ${K.toFixed(3)}`, `${MULT.bull}x / ${MULT.bear}x`],
      ],
      derivationSource: `Screener.in (prices, balance sheets, peer EV/EBITDA and P/E histories); NSE closes on ${ASOF_TXT}; GAM Research`,
      crossNote: `**What the cross-checks say, and why we do not average them in.** On earnings, the nine peers' median P/E (${mv('pe').mult}x) on Sep-28E EPS of ₹${n1(mv('pe').metric)} gives ₹${n0(mv('pe').value)}; the DCF gives ₹${n0(mv('dcf').value)} (₹${n0(X.DCFV.both)} if tax fell to 25% and margins reached 25%). Both are far below the EV/EBITDA value because depreciation (~${n1(F.dep[1] / F.sales[1] * 100)}% of FY28E sales), interest and an over-sized tax bill sit between EBITDA and shareholders, and working capital (~27% of sales) absorbs cash as Piramal grows. The market prices Piramal on EBITDA and on the FY30 margin goal; the cash flows do not yet justify today's price. That is the main risk to the stock, and the reason our bear case is so far below.`,
    }),
    { exhibit: { type: 'line', title: `Forward EV/EBITDA since listing: target ${MULT.base}x; today ${n1(evNow)}x FY28E, ${n1(evNowSep)}x Sep-28E`, unit: 'EV ÷ next full-year EBITDA (x), JV looked through; every point counts (EBITDA trough test)', x: fwdChart.map(x => x[0]), series: [{ name: 'Forward EV/EBITDA', values: fwdChart.map(x => r1(x[1])), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: r1(EVH_BASE.med), text: `Median ${n1(EVH_BASE.med)}x` }, { v: MULT.base, text: `Target ${MULT.base}x`, color: '#cf8f1f' }], source: 'Screener.in prices and balance sheets; actual EBITDA (Screener basis), GAM estimates FY27-28E' } },
    { exhibit: { type: 'table', title: 'Sum of the parts at Sep-28E (₹ crore)', head: ['Part', 'Base (₹ cr)', '₹ / share'], rows: [
      ...SOTP.base.parts.map(p => sotpRow(p, 'base')),
      { hl: true, cells: ['**Equity value**', `**${n0(SOTP.base.total)}**`, `**${n1(SOTP.base.perShare)}**`] },
      ['Implied EV/EBITDA on Sep-28E EBITDA after net debt (carried into the model)', `${EVM.base}x`, ''],
      { hl: true, cells: ['**12-month target (rounded to ₹5)**', '', '**{{dcf.tp|inr}}**'] },
      [`Bull: ${MULT.bull}x on bull EBITDA ₹${n0(SOTP.bull.eb)} cr`, n0(SOTP.bull.total), n1(SOTP.bull.perShare)],
      [`Bear: ${MULT.bear}x on bear EBITDA ₹${n0(SOTP.bear.eb)} cr`, n0(SOTP.bear.total), n1(SOTP.bear.perShare)],
    ], source: `GAM Research. Sep-28E EBITDA ₹${n0(ebitdaSep28)} cr (½ FY28E + ½ FY29E). JV: ${JV_MULT}x its Sep-28E profit share of ₹${n1(jvShareSep28)} cr (ICICI Direct's basis); its ₹${n1(JV_BOOK)} cr book value is taken out of net debt so it is counted once. Net debt incl. leases from the model; Yapan Bio and other investments at book; ${n1(sh)} cr shares.` } },
    { exhibit: { type: 'table', title: `Sector factor, peer by peer (at the ${ASOF_TXT} close vs medians since ${WIN_TXT})`, head: ['Company', 'EV/EBITDA now', 'Median', 'vs median', 'P/E now', 'Median', 'vs median', 'In the set?'], wide: [7], rows: [...SET, 'PPLPHARMA'].map(peerRow), source: `Screener.in weekly histories, scaled to NSE closes; PLAYBOOK §7c nine-name set; median of the nine: EV/EBITDA ${pc1(FW.ev)}, P/E ${pc1(FW.pe)}. Piramal's P/E is not meaningful (near-zero profit)` } },
    { exhibit: { type: 'table', title: `Target sensitivity (Sep-28E EBITDA ₹${n0(ebitdaSep28)} cr; JV and net debt as in the base)`, head: ['Case', 'Multiple', 'Target (₹)', 'vs CMP', 'Basis'], wide: [4], rows: SENS.map((r, i) => (i === 0 ? { hl: true, cells: [`**${r.name}**`, `**${r.mult}x**`, `**${n0(r.tp)}**`, `**${pc1(r.up)}**`, r.why] } : [r.name, `${r.mult}x`, n0(r.tp), pc1(r.up), rup(r.why)])), source: 'GAM Research; only the first row is the house method' } },
    ...require('./PPLPHARMA.part5b').blocks,
  ],
};

module.exports = { valuation };
