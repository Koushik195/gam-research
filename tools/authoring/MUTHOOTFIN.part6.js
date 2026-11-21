// Muthoot Finance report, part 6: valuation (street table, multiple derivation, forward P/B chart, cross-checks,
// scenarios, sensitivities, peers). Risks, glossary and statement notes are in part6b.
const X = require('./MUTHOOTFIN.ctx');
const { streetBlocks } = require('./valuation-blend');
const { F, V, AS, n0, n1, n2, pc, ASOF_TXT, price, mv, pbMult, bvSep28, peMult, epsSep28, PB21, PB23, PB2y, PE21, PE23, fwdPbNow, trailPb, PEERS, P, DR_SYMS, DR_PE_SYMS, sectorPbDr, sectorPeDr, shortName, regimePb, regimePe, pbRaw, rating, ST, shortDate, minDate, fwdPb } = X;

const drTxt = (s, k = 'pbVs') => `${shortName(s)} ${pc(P[s][k])}`;
const jpbV = mv('jpb').value, riV = mv('ri').value, peV = mv('pe').value;
const bookAtTarget = (F.bvps[0] + F.bvps[1]) / 2, multAtTarget = V.tp / bookAtTarget;
const f1 = v => (v == null || !Number.isFinite(v) ? 'n.a.' : n1(v)), f2 = v => (v == null || !Number.isFinite(v) ? 'n.a.' : n2(v));
const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${pbMult}x Sep-28E book gives {{dcf.tp|inr}}; the target needs book growth, not a re-rating`,
  blocks: [
    ...streetBlocks('MUTHOOTFIN', {
      rating, noOurEps: true,
      streetIntro: 'Brokers that disclose a method value Muthoot on **price to book value (P/B)**, the usual yardstick for a lender with high, fairly steady returns: Motilal Oswal ~2.0x Mar-28E book; Jefferies refers to 2.1x one-year-forward book, about the stock\'s five-year average. We use the same method on the book the market will look at in September 2027 (Sep-28E: half FY28E, half FY29E). Targets are as they stood on 30-Sep-2026; most were set on 2-10 Aug, after the Q1 results.',
      street: ST.map(s => [`${s.broker} (${shortDate(s.date)})`, s.rating, s.tp, s.method || 'n.d.', s.multiple || '–', s.on || '–', s.thesis]),
      ourThesis: 'Gold-price windfall resetting; franchise intact; trades below its median multiple; gold is the swing factor',
      streetSource: 'Motilal Oswal via DSIJ and Trendlyne (2-Aug-2026); Jefferies via BusinessToday (3-Aug, 10-Sep-2026); Kotak via Kotak Neo; Nirmal Bang, Nuvama, Morgan Stanley, 360 ONE via BusinessToday and GoodReturns (3-Aug-2026); CLSA, Investec via IIFL; Bernstein via Upstox; Joindre via Trendlyne. n.d. = not disclosed in the sources we saw',
      derivationIntro: `We start from the stock's own one-year-forward P/B since April 2021 (book does not collapse the way earnings can, so no years are excluded), adjust for how far listed lenders had re-rated or de-rated by ${ASOF_TXT}, and then for growth and returns versus that window. Peers and the street are checks.`,
      derivation: [
        ['1. Its own history', `Forward P/B (price ÷ next full-year book): median ${PB21.med.toFixed(1)}x since Apr-2021 (25th-75th percentile ${PB21.p25.toFixed(1)}-${PB21.p75.toFixed(1)}x; low ${PB21.min.toFixed(1)}x in ${shortDate(minDate(fwdPb, '2021-04-01', PB21.min))}, high ${PB21.max.toFixed(1)}x in ${shortDate(minDate(fwdPb, '2021-04-01', PB21.max))}); ${PB23.med.toFixed(1)}x since Apr-2023; ${PB2y.med.toFixed(1)}x over the last two years; ${n1(fwdPbNow)}x on ${ASOF_TXT} on our FY28E book`, `Starting point: ${PB21.med.toFixed(1)}x`],
        ['2. Sector move', `Trailing P/B vs five-year median on ${ASOF_TXT}, lender peers excluding Muthoot: ${DR_SYMS.map(s => drTxt(s)).join(', ')} (median ${n1(sectorPbDr)}%). Left out: HDB Financial (listed Jul-2025) and Bajaj Housing Finance (listed Sep-2024), which have no five-year history. Muthoot itself ${pc(P.MUTHOOTFIN.pbVs)}`, `${PB21.med.toFixed(1)}x × ${(1 + sectorPbDr / 100).toFixed(3)} ≈ ${n2(PB21.med * (1 + sectorPbDr / 100))}x`],
        ['3. Growth and returns', `The window spans the gold slump of FY23 (AUM +11%, ROE 18%) and the boom of FY25-26 (+37-49%, ROE 20-31%). Since Apr-2023 the median is the same ${PB23.med.toFixed(1)}x. We forecast AUM growth of 13-18% and ROE of 22-26% with gold flat: slower growth, similar returns. No further adjustment`, `× ${regimePb.toFixed(2)} = ${n2(pbRaw)}x ≈ **${pbMult}x Sep-28E book**`],
        ['4. Peers', `Trailing P/B: Manappuram ${n1(P.MANAPPURAM.pb)}x (FY26 ROE ${n1(P.MANAPPURAM.roe)}%, re-rated after Bain Capital's entry), Shriram ${n1(P.SHRIRAMFIN.pb)}x (${n1(P.SHRIRAMFIN.roe)}%), Cholamandalam ${n1(P.CHOLAFIN.pb)}x (${n1(P.CHOLAFIN.roe)}%), Bajaj Finance ${n1(P.BAJFINANCE.pb)}x (${n1(P.BAJFINANCE.roe)}%); Muthoot ${n1(trailPb)}x on FY26 book (ROE ${n1(P.MUTHOOTFIN.roe)}%)`, `${pbMult}x Sep-28E = ${n1(multAtTarget)}x book at the target date: Muthoot's returns are the highest, its multiple low because the returns ride on gold`],
        ['5. Returns', `ROE ~22-26% (FY27-29E) vs a ${n1(V.ke)}% cost of equity. Justified P/B = (20 − 8) ÷ (${n1(V.ke)} − 8) = ${n2(V.justifiedPb)}x Sep-27E book (₹${n0(jpbV)})`, 'Fundamentals support ~2.3x trailing book, close to the target'],
        ['6. Street', 'Motilal Oswal ~2.0x Mar-28E; Jefferies cites 2.1x one-year-forward (≈ five-year average)', `Our ${pbMult}x is in line`],
      ],
      derivationSource: `Screener.in (P/B history to ${ASOF_TXT}), broker notes, GAM Research. The forward series uses next-full-year book (6-18 months ahead); applying the multiple to Sep-28E book, 12 months beyond the target date, is consistent with its average horizon.`,
      history: { field: 'bvps', from: '2016-04-01', median: PB21.med, label: `Median since 2021: ${PB21.med.toFixed(1)}x`, title: `One-year-forward P/B: our ${pbMult}x vs history`, yearStep: 2, min: 0 },
      crossNote: `**What the cross-checks tell us.** P/E (${peMult}x Sep-28E EPS of ₹${n1(epsSep28)}, derived the same way: ${PE21.med.toFixed(1)}x median forward P/E since 2021 × peers ${n1(sectorPeDr)}% (eight peers; Manappuram left out because its FY26 EPS is a trough) × regime ${regimePe.toFixed(2)}) gives ₹${n0(peV)}, ${pc(mv('pe').vsTarget)} vs the target. Justified P/B gives ₹${n0(jpbV)} and residual income ₹${n0(riV)}. Residual income is the highest because ROE stays above the ${n1(V.ke)}% cost of equity for years; it also flatters a little, since the engine retains all profit in FY28-29E (we offset this by letting payout rise to 60% in the fade, so long-run book growth matches our 8% g). Put the other way, at ₹${n0(price)} the market prices a long-run ROE of only ~{{dcf.impliedRoe|pct0}} (residual income), against 18-31% in every year since FY20. The stock is cheap if gold holds; it is fairly priced if you believe gold will fall.`,
    }),
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Multiple ${AS.valuation.blend.methods[0].multiple.bull}x (75th percentile of forward P/B since 2021).`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Gold flat at the 30-Sep-2026 level; AUM +18% / +15% / +13%; yield 18.1% → 17.5%; NIM {{F.nim.0|pct}} → {{F.nim.2|pct}}; credit cost {{F.creditCost.0|pct}}-{{F.creditCost.2|pct}}; ROE {{F.roe.0|pct0}} → {{F.roe.2|pct0}}; ${pbMult}x Sep-28E book.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Multiple ${AS.valuation.blend.methods[0].multiple.bear}x (lowest forward P/B since 2021).`],
    ], source: 'GAM Research' } },
    { pair: [
      { type: 'table', title: 'Target sensitivity: P/B multiple × Sep-28E book (₹)', grid: 'dcf.sensPrimary.grid', rowsRef: 'dcf.sensPrimary.mults', colsRef: 'dcf.sensPrimary.metrics', rowFmt: 'n2', colFmt: 'inr1', corner: 'P/B (x) \\ book (bear, base, bull)', source: 'GAM Research' },
      { type: 'table', title: 'Justified P/B value (₹): cost of equity × sustainable ROE', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'Ke \\ ROE', source: 'GAM Research; g = 8%, book at Sep-27E' },
    ] },
    { exhibit: { type: 'table', title: 'Listed lenders at the 30-Sep-2026 close', head: ['Company', 'Market value (₹ cr)', 'P/B (x)', 'vs 5-yr median P/B', 'P/E (x)', 'ROE FY26', 'ROA FY26', 'Revenue growth FY26'], rows: PEERS.map(p => [p.symbol === 'MUTHOOTFIN' ? '**Muthoot Finance**' : shortName(p.symbol), n0(p.mcapCr), f1(p.pb), p.pbVs != null && !['BAJAJHFL', 'HDBFS'].includes(p.symbol) ? pc(p.pbVs) : 'n.m.', f1(p.pe), p.roe != null && Number.isFinite(p.roe) ? `${n1(p.roe)}%` : 'n.a.', p.roa != null && Number.isFinite(p.roa) ? `${n2(p.roa)}%` : 'n.a.', p.revG != null ? pc(p.revG) : 'n.a.']), source: `Screener.in (consolidated; SBI Cards and Bajaj Housing Finance standalone), trailing multiples scaled to the NSE close on ${ASOF_TXT}; ROA on total assets. HDB Financial (listed Jul-2025) and Bajaj Housing Finance (Sep-2024): n.m.` } },
  ],
};

module.exports = { valuation, ...require('./MUTHOOTFIN.part6b') };
