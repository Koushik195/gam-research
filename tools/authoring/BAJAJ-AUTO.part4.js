// Bajaj Auto report, part 4: street view and valuation (street table, multiple derivation, SOTP, cross-checks,
// scenarios, DCF, peers). Risks, glossary and statement notes are in part4b.
const X = require('./BAJAJ-AUTO.ctx');
const { streetBlocks } = require('./valuation-blend');
const { D, F, V, A, AS, n0, n1, pc, rup, ASOF_TXT, price, mv, SOTP, CORE, SAPE, FM, fwdFyMed, fwdNow, houseAfter, P, MED5, derate, EXCL, OTHERS, sectorDr, drTwoWheelers, PEERS, EVX, evMed, restate, BACL_PB, BPB, KS, ktmMkt, SH, STR, CONS, medTp, avgTp, shortDate, shortName, rating, saEpsSep28, baclBookSep27, SAEPS } = X;
const S = SOTP.base;
const ps = (mult, eps = S.eps) => mult * eps + S.bacl + S.ktm;

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: 'The street: 30 Buys, 8 Holds, 8 Sells; most targets ₹10,600-13,700 on 23-25x FY28E standalone EPS',
  blocks: [
    { p: `Brokers published around the Q1FY27 results (21-26 Jul 2026), when the stock was ~₹10,400-11,100. Business Today counted 30 Buy, 8 Hold and 8 Sell calls and a ${CONS.analysts}-analyst consensus target of ₹${n0(CONS.avgTp)}. Targets ranged from Morgan Stanley's ₹9,259 (Underweight) to Emkay's ₹13,700; the median of the ${STR.filter(s => s.tp).length} we list is ₹${n0(medTp)}. Every house that discloses its method uses **P/E on FY28E (or Sep-28E) standalone EPS at 23-25x**: Motilal Oswal 24x "core" EPS (upgraded to Buy), PL 23x (Hold), ICICI Direct 25x, Elara 23x Sep-28E plus ₹178 for KTM, Anand Rathi 25x core EPS plus KTM (₹162), BACL (₹246) and cash (₹965). We found no rating or target changes between August and 30-Sep-2026. The stock hit ₹12,470 in early September on the August sales and closed at ₹${n0(price)} on ${ASOF_TXT}.` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who'], wide: [0], rows: D.critiques.map(r => r.map(rup)), source: 'Broker notes, calls and filings to 30-Sep-2026' } },
  ],
};

const drTxt = s => `${shortName(s)} ${pc(derate[s])}`;
const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${CORE.base}x Sep-28E standalone EPS plus BACL and KTM gives {{dcf.tp|inr}}`,
  blocks: [
    ...streetBlocks('BAJAJ-AUTO', {
      rating, noOurEps: true,
      streetIntro: `The street values Bajaj on **P/E on standalone EPS** one to two years out, and two houses add KTM and BACL separately. We use the same structure: P/E on Sep-28E standalone EPS (half FY28E, half FY29E, per post-buyback share) for the core business, plus BACL at P/B and the KTM stake at market. The engine can only multiply consolidated EPS, so it carries our SOTP as an implied multiple of consolidated Sep-28E EPS (${n1(S.implied)}x), which is why the table shows a decimal multiple.`,
      street: STR.map(s => [`${s.broker} (${shortDate(s.date)})`, s.rating, s.tp, s.method || 'n.d.', s.multiple || '–', s.on || '–', rup(s.thesis || '')]),
      ourThesis: 'Great exporter, eroding commuter share, margins helped by the rupee and PLI; the street pays a re-rated multiple',
      streetSource: 'MOSL, PL, Elara, ICICI Direct and Anand Rathi notes (PDFs); other targets as reported by Business Today (22-Jul-2026). n.d. = method not disclosed in the sources we saw',
      derivationTitle: `Our core multiple: ${CORE.base}x Sep-28E standalone EPS, and why`,
      derivationIntro: 'House rule for this batch: the stock\'s own one-year-forward P/E median since April 2021 (trough years left out) times the auto sector\'s de-rating at the 30-Sep close; no growth or returns adjustment (those are sensitivities below).',
      derivation: [
        ['1. Its own history (standalone EPS)', `Price ÷ next full-year standalone EPS since Apr-2021: median ${n1(SAPE.med)}x (25th-75th ${n1(SAPE.p25)}-${n1(SAPE.p75)}x; ${SAPE.n} weekly points; trough years: ${SAPE.troughs.length ? SAPE.troughs.join(', ') : 'none'}). By forward year: FY23 ${n1(fwdFyMed[2023])}x, FY24 ${n1(fwdFyMed[2024])}x, FY25 ${n1(fwdFyMed[2025])}x, FY26 ${n1(fwdFyMed[2026])}x (2024 re-rating), FY27 ${n1(fwdFyMed[2027])}x, FY28 ${n1(fwdFyMed[2028])}x. Now ${n1(fwdNow)}x Sep-28E`, `Starting point: ${n1(SAPE.med)}x`],
        ['2. House function on consolidated EPS (shown, not used)', `forwardMedian on consolidated EPS: ${n1(FM.median)}x (no trough years). Consolidated EPS carries one-offs: the ₹915 cr KTM associate loss in FY25 and ₹1,599 cr of remeasurement and currency-reserve gains in FY26; standalone EPS has neither and is the street's basis`, `${n1(FM.median)}x × ${(1 + sectorDr / 100).toFixed(3)} ≈ ${n1(houseAfter)}x on consolidated EPS (cross-reference)`],
        ['3. Sector de-rating', `Auto OEM peers' trailing P/E on ${ASOF_TXT} vs their five-year medians: ${OTHERS.map(drTxt).join(', ')}; median ${pc(sectorDr)}. Excluded: Bajaj itself (${pc(derate['BAJAJ-AUTO'])}) and ${EXCL.map(s => `${shortName(s)} (${pc(derate[s])}: ${D.peers.excludedFromDerating[s].split(':')[0]})`).join('; ')}`, `${n1(SAPE.med)}x × ${(1 + sectorDr / 100).toFixed(3)} = ${n1(SAPE.med * (1 + sectorDr / 100))}x → **${CORE.base}x** (nearest half-turn)`],
        ['4. Growth (not applied)', `Standalone EPS grew 17% a year in FY21-26; we forecast +25% in FY27E (exports, rupee) and ~11% a year after. The street's 23-25x is a bet that FY27's growth lasts`, 'No uplift (batch rule); see sensitivities'],
        ['5. Peers (context)', `Trailing P/E at 30-Sep: Eicher ${n1(P.EICHERMOT.pe)}x, TVS ${n1(P.TVSMOTOR.pe)}x, Maruti ${n1(P.MARUTI.pe)}x, M&M ${n1(P['M&M'].pe)}x, Hero ${n1(P.HEROMOTOCO.pe)}x; Bajaj ${n1(P['BAJAJ-AUTO'].pe)}x (consolidated)`, `${CORE.base}x Sep-28E = ${n1(CORE.base * S.eps / SAEPS[1])}x our FY28E: between Hero and Maruti`],
      ],
      derivationSource: `Screener.in (prices and P/E history to ${ASOF_TXT}); standalone EPS (Screener standalone, GAM estimates); broker notes`,
      crossNote: `**What the cross-checks tell us.** EV/EBITDA (${EVX.base}x Sep-28E consolidated EBITDA plus net cash) gives ₹${n0(mv('ev').value)}: ${EVX.base}x is Bajaj's ${n1(evMed)}x median trailing EV/EBITDA since 2021, cut by the same sector de-rating and restated for Sep-28E standalone EBITDA being ${Math.round((1 / restate - 1) * 100)}% above the last twelve months. It values BACL and KTM at the auto multiple and per FY26 share, so it sits above the SOTP. The DCF (₹${n0(mv('dcf').value)}) is higher still: at an ${n1(V.ke)}% cost of equity and 5.5% terminal growth, consolidated cash flows support ~${Math.round(mv('dcf').value / price * 100)}% of the price, but it counts 100% of KTM's cash flows (Bajaj owns 74.94%; the minorities' share of KTM's market value is ~₹${n0(ktmMkt / KS.stakePct * (100 - KS.stakePct) / SH)} a share) and BACL's equity cash flows inside FCFF. All three methods agree the stock is not cheap; only the DCF says it is worth more than today's price.`,
    }),
    { h: 'The sum of the parts' },
    { exhibit: { type: 'table', title: 'SOTP: base, bull and bear (₹ per post-buyback share)', head: ['Part', 'Basis', 'Base', 'Bull', 'Bear'], wide: [1], rows: [
      ['Bajaj Auto standalone (core)', `P/E ${CORE.base}x (bull ${CORE.bull}x = 75th-percentile forward P/E × de-rating; bear ${CORE.bear}x = 25th percentile) on Sep-28E standalone EPS ₹${n1(S.eps)} (bull ₹${n1(SOTP.bull.eps)}, bear ₹${n1(SOTP.bear.eps)})`, n0(S.core), n0(SOTP.bull.core), n0(SOTP.bear.core)],
      ['Bajaj Auto Credit (100%)', `P/B ${BACL_PB.base}x (median of Cholamandalam ${BPB.CHOLAFIN}x, Shriram ${BPB.SHRIRAMFIN}x, M&M Financial ${BPB['M&MFIN']}x; bull ${BACL_PB.bull}x, bear ${BACL_PB.bear}x as Anand Rathi) on Sep-27E book ₹${n0(S.book)} cr`, n0(S.bacl), n0(SOTP.bull.bacl), n0(SOTP.bear.bacl)],
      ['KTM: 74.94% of Bajaj Mobility AG', `Market value ₹${n0(ktmMkt)} cr at the 30-Sep close less a ${KS.discountPct.base}% holding discount (bull ${KS.discountPct.bull}%, bear ${KS.discountPct.bear}%)`, n0(S.ktm), n0(SOTP.bull.ktm), n0(SOTP.bear.ktm)],
      { hl: true, cells: ['**Equity value per share**', '', `**${n0(S.ps)}**`, `**${n0(SOTP.bull.ps)}**`, `**${n0(SOTP.bear.ps)}**`] },
      ['Implied multiple of consolidated Sep-28E EPS (engine)', `Consolidated Sep-28E EPS ₹${n1(S.consEps)} on the FY26 count`, `${n1(S.implied)}x`, `${n1(SOTP.bull.implied)}x`, `${n1(SOTP.bear.implied)}x`],
      { hl: true, cells: ['**12-month target (rounded)**', '', '**{{dcf.tp|inr}}**', '**{{scen.bull.tp|inr}}**', '**{{scen.bear.tp|inr}}**'] },
    ], source: 'GAM Research. Standalone EPS includes treasury income, so cash is not added separately (as PL, ICICI Direct and Elara do). BAIH BV\'s own net cash is not added (not disclosed).' } },
    { exhibit: { type: 'table', title: 'Sensitivities (not in the target)', head: ['View', 'Core multiple', 'Value / share (₹)', 'vs CMP'], wide: [0], rows: [
      ['Our base (own median × sector de-rating)', `${CORE.base}x`, n0(S.ps), pc((S.ps / price - 1) * 100)],
      ['No sector de-rating (own median only)', `${X.half(SAPE.med)}x`, n0(ps(X.half(SAPE.med))), pc((ps(X.half(SAPE.med)) / price - 1) * 100)],
      [`Two-wheeler peers only (Eicher, Hero, TVS: ${pc(drTwoWheelers)})`, `${X.half(SAPE.med * (1 + drTwoWheelers / 100))}x`, n0(ps(X.half(SAPE.med * (1 + drTwoWheelers / 100)))), pc((ps(X.half(SAPE.med * (1 + drTwoWheelers / 100))) / price - 1) * 100)],
      ['Street multiple (PL, Elara)', '23x', n0(ps(23)), pc((ps(23) / price - 1) * 100)],
      ['Street multiple (ICICI Direct, Anand Rathi)', '25x', n0(ps(25)), pc((ps(25) / price - 1) * 100)],
      ['KTM at market with no discount', `${CORE.base}x`, n0(S.ps + ktmMkt * KS.discountPct.base / 100 / SH), pc(((S.ps + ktmMkt * KS.discountPct.base / 100 / SH) / price - 1) * 100)],
      ['What the price implies for the core', `${n1((price - S.bacl - S.ktm) / S.eps)}x`, n0(price), '0%'],
    ], source: 'GAM Research' } },
    ...require('./BAJAJ-AUTO.part4c').tail,
  ],
};

module.exports = { street, valuation, ...require('./BAJAJ-AUTO.part4b') };
