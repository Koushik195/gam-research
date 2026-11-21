// Bajaj Housing Finance report, part 6: valuation (street table, multiple derivation, forward P/B chart,
// cross-checks, scenarios, sensitivities, peers). Risks, glossary and statement notes are in part6b.
const X = require('./BAJAJHFL.ctx');
const { streetBlocks } = require('./valuation-blend');
const { F, V, AS, n0, n1, n2, pc, ASOF_TXT, price, mv, pbMult, bvSep28, peMult, epsSep28, PBL, PB12, PBD, PEL, PE12, fwdPbNow, fwdPeNow, trailPb,
  PEERS, P, HFC_SYMS, LEND_SYMS, HFC5, hfcPb12, hfcPe12, hfcPbL, hfcPb5, lendPb5, lendPb12, shortName, altLiteral, altTriple, tpAt, rating, ST, shortDate, moslSep28 } = X;

const drTxt = (s, k) => `${shortName(s)} ${pc(P[s][k])}`;
const jpbV = mv('jpb').value, riV = mv('ri').value, peV = mv('pe').value;
const trailAtTarget = V.tp / F.bvps[0];
const MU = AS.valuation.blend.methods[0].multiple;
const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${pbMult}x Sep-28E book gives {{dcf.tp|inr}}; every intrinsic check is lower`,
  blocks: [
    ...streetBlocks('BAJAJHFL', {
      rating, noOurEps: true,
      streetIntro: 'Brokers that disclose a method value BHFL on **price to book value (P/B) on FY28E book**: Motilal Oswal 2.7x, Emkay 2.6x (for a Jun-27 target), JM Financial 2.5x at its March initiation. P/B is the standard yardstick for lenders with steady returns. We use the same method on the book the market will look at in September 2027 (Sep-28E: half FY28E, half FY29E), which is ~7% larger than FY28E book, so our multiple reads lower than the street\'s for the same price. Targets are as they stood on 30-Sep-2026.',
      street: ST.map(s => [`${s.broker} (${shortDate(s.date)})`, s.rating, s.tp, s.method || 'n.d.', s.multiple || '–', s.on || '–', s.thesis]),
      ourThesis: 'Excellent franchise, utility returns, ~₹8,000 cr of parent stock to place',
      streetSource: 'Motilal Oswal (29-Jul-2026) and Emkay (30-Jul-2026) notes; JM Financial initiation (23-Mar-2026); other targets and ratings from BusinessToday (1-Aug-2026). n.d. = method not disclosed in the sources we saw',
      derivationIntro: `BHFL has only two years of trading history, and the first of them priced an IPO scarcity premium: 63.6x subscription, a listing at 2.1x the issue price and a forward P/B of ${PBL.max}x. Since then the stock has de-rated almost every month. So we anchor on the most recent regime, the last 12 months (the same ${PBD.med}x median applies since the parent's first sale in Dec-2025), and adjust it for how far housing-finance multiples moved over the same 12 months. Measuring both over the same window avoids counting the sector's de-rating twice. Peers and returns are checks.`,
      derivation: [
        ['1. Its own history', `Forward P/B (price ÷ next full-year book): median ${PBL.med}x since listing (range ${PBL.min}-${PBL.max}x); **${PB12.med}x over the last 12 months** (range ${PB12.min}-${PB12.max}x); ${n1(fwdPbNow)}x on ${ASOF_TXT} on our FY28E book`, `Starting point: ${PB12.med}x`],
        ['2. Sector move', `HFC P/B on ${ASOF_TXT} vs their own last-12-month median: ${HFC_SYMS.map(s => drTxt(s, 'pbVs12')).join(', ')} (median ${pc(hfcPb12)}). BHFL itself ${pc(P.BAJAJHFL.pbVs12)}`, `${PB12.med}x × ${(1 + hfcPb12 / 100).toFixed(3)} ≈ **${pbMult}x Sep-28E book**`],
        ['3. Growth', `Street multiples (2.5-2.7x FY28E) assume ~20% EPS growth and ROE rising to 13.5-14% by FY28-29E. We forecast EPS growth of 17-18% and ROE of ${n1(F.roe[1])}-${n1(F.roe[2])}%`, 'Supports a multiple at or below the street\'s, not above'],
        ['4. Peers', `Trailing P/B: Home First ${n1(P.HOMEFIRST.pb)}x (ROE ${n1(P.HOMEFIRST.roe)}%), Aadhar ${n1(P.AADHARHFC.pb)}x (${n1(P.AADHARHFC.roe)}%), Aptus ${n1(P.APTUS.pb)}x (${n1(P.APTUS.roe)}%), Can Fin ${n1(P.CANFINHOME.pb)}x (${n1(P.CANFINHOME.roe)}%), PNB Housing ${n1(P.PNBHOUSING.pb)}x (${n1(P.PNBHOUSING.roe)}%), LIC Housing ${n1(P.LICHSGFIN.pb)}x (${n1(P.LICHSGFIN.roe)}%); BHFL ${n1(trailPb)}x (${n1(P.BAJAJHFL.roe)}%)`, `${pbMult}x Sep-28E = ${n1(trailAtTarget)}x Mar-27E book at the target date: still the dearest HFC`],
        ['5. Returns', `ROE ${n1(F.roe[0])}-${n1(F.roe[2])}% (FY27-29E) vs a ${n1(V.ke)}% cost of equity. Justified P/B = (14 − 10) ÷ (${n1(V.ke)} − 10) = ${n2(V.justifiedPb)}x Sep-27E book (₹${n0(jpbV)})`, 'Fundamentals support about half the multiple the market pays'],
        ['6. Street', `Motilal Oswal 2.7x FY28E (its ₹95 = ${n1(X.mosl.tp / bvSep28)}x our Sep-28E book); Emkay 2.6x FY28E; JM 2.5x FY28E (Mar-2026)`, `Our ${pbMult}x is below every broker that discloses a multiple`],
        ['Not used', `(a) Since-listing median × HFC move vs five-year medians (${pc(hfcPb5)}, six HFCs with five years of history) = ${altLiteral}x → ₹${n0(tpAt(altLiteral))}; (b) the same × our 12-month regime ratio (${PB12.med} ÷ ${PBL.med}) = ${altTriple}x → ₹${n0(tpAt(altTriple))}`, '(a) anchors on the IPO year; (b) counts the sector de-rating twice'],
      ],
      derivationSource: `Screener.in (P/B and P/E history to ${ASOF_TXT}; peers scaled to the NSE close), broker notes, GAM Research. The forward series uses next-full-year book (12-24 months ahead), so applying it to Sep-28E book at the target date is mildly conservative.`,
      history: { field: 'bvps', from: '2024-09-16', median: PBL.med, label: `Median since listing: ${PBL.med}x`, title: `One-year-forward P/B: our ${pbMult}x vs history`, yearStep: 1, min: 0 },
      crossNote: `**What the cross-checks tell us.** P/E, derived the same way (${PE12.med}x median forward P/E over 12 months × HFC P/E move ${pc(hfcPe12)} = ${peMult}x Sep-28E EPS of ₹${n2(epsSep28)}), gives ₹${n0(peV)}, the same as the target. The intrinsic methods are far lower: justified P/B ₹${n0(jpbV)} and residual income ₹${n0(riV)}, both at a ${n1(V.ke)}% cost of equity and a 14% long-run ROE. Put the other way, at ₹${n0(price)} the market prices a long-run ROE of ~{{dcf.impliedRoe|pct}} (residual income), above anything BHFL has earned (peak 15.2% in FY24) or guides to (12-13%). The gap is the "Bajaj premium": investors pay for safety, parentage and growth. We keep it in the target because the street and the market do, but it is the part of the price most at risk.`,
    }),
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Multiple ${MU.bull}x (the 12-month median: the sector recovers its recent level).`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `AUM +23% / +21% / +20%; net total income ÷ AUM {{F.ntiPct.0|pct}} → {{F.ntiPct.2|pct}}; credit cost {{F.creditCost.0|pct}}-{{F.creditCost.2|pct}}; ROE {{F.roe.0|pct}} → {{F.roe.2|pct}}; ${pbMult}x Sep-28E book.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Multiple ${MU.bear}x (justified P/B; where affordable-housing lenders trade): the Bajaj premium goes.`],
    ], source: 'GAM Research' } },
    { pair: [
      { type: 'table', title: 'Target sensitivity: P/B multiple × Sep-28E book (₹)', grid: 'dcf.sensPrimary.grid', rowsRef: 'dcf.sensPrimary.mults', colsRef: 'dcf.sensPrimary.metrics', rowFmt: 'x', colFmt: 'inr1', corner: 'P/B \\ book (bear, base, bull)', source: 'GAM Research' },
      { type: 'table', title: 'Justified P/B value (₹): cost of equity × sustainable ROE', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'Ke \\ ROE', source: 'GAM Research; g = 10%, book at Sep-27E' },
    ] },
    { p: `**What would justify today's price on fundamentals?** On Sep-27E book, ₹${n0(price)} is ${n2(price / V.book)}x. In the justified-P/B formula that needs a cost of equity of ${n1(V.g + (14 - V.g) / (price / V.book))}% with a 14% long-run ROE, or ${n1(V.g + (15 - V.g) / (price / V.book))}% with 15%, against our ${n1(V.ke)}%, and a 10% growth rate held for ever. That is not absurd: a AAA mortgage book with 0.3% bad loans arguably deserves a lower cost of equity than a consumer lender. But a 14-15% ROE needs 7-8x leverage on today's margins, and it has to last for decades. The price assumes the optimistic end on every input, which is why we would not buy here.` },
    { exhibit: { type: 'table', title: `Listed lenders at the ${ASOF_TXT} close: P/B and P/E vs their own history`, head: ['Company', 'P/B (x)', 'vs 5-yr median', 'vs 12-month median', 'P/E (x)', 'vs 12-month median', 'ROE FY26'], rows: [...HFC_SYMS, ...LEND_SYMS, 'BAJAJHFL'].map(s => P[s]).map(p => [p.symbol === 'BAJAJHFL' ? '**Bajaj Housing Finance**' : shortName(p.symbol), p.pb != null ? n1(p.pb) : 'n.a.', p.pbVs5 != null ? pc(p.pbVs5) : 'n.m.', p.pbVs12 != null ? pc(p.pbVs12) : 'n.a.', p.pe != null ? n1(p.pe) : 'n.a.', p.peVs12 != null ? pc(p.peVs12) : 'n.a.', p.roe != null ? `${n1(p.roe)}%` : 'n.a.']), source: `Screener.in; trailing multiples scaled to the NSE close on ${ASOF_TXT}. Housing-finance median vs 12-month medians: P/B ${pc(hfcPb12)}, P/E ${pc(hfcPe12)}; vs five-year medians (six HFCs; Aadhar listed 2024): ${pc(hfcPb5)}. Other lenders vs five-year medians ${pc(lendPb5)} (HDB Financial listed 2025, no P/B history). BHFL excluded from all medians. n.m. = under five years listed.` } },
  ],
};

module.exports = { valuation, ...require('./BAJAJHFL.part6b') };
