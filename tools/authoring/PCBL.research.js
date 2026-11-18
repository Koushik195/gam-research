// PCBL report, part B: merges PCBL.part2-5.js and adds forecasts, street view and valuation.
// Written as of 30-Sep-2026 (Q1FY27 basis). Forecast and valuation figures are live tokens ({{...}})
// that follow assumptions.json; shared numbers come from PCBL.ctx.js.
const P2 = require('./PCBL.part2'), P3 = require('./PCBL.part3'), P4 = require('./PCBL.part4'), P5 = require('./PCBL.part5');
const { streetBlocks } = require('./valuation-blend');
const { ctx } = require('./PCBL.ctx');
const { D, F, V, A, S, n0, n1, pc, ai, A26, price, mv, epsSep28, ebitdaSep28, rating, PE_X, EV_X, CBA, AQA, ndEngine, ndTrue, sepND, grpInv,
  fwdPe, fwdMed, fwdMedAll, troughTxt, preDeal, postDeal, fwdPeNow, fwdEv, fwdEvMed, fwdEvPre, fwdEvPost, fwdEvNow, PEERS, peerOnly, sectorDerate,
  specPe, specEv, specShare, mixPe, mixEv, SELF, HS, ST, stAvg, PL, IDIR, ASOF_TXT } = ctx;
const epsCagr = (Math.pow(F.eps[2] / F.eps[0], 1 / 2) - 1) * 100;
const sv = s => { const p = PEERS.find(x => x.symbol === s); return `${p.peVs > 0 ? '+' : '−'}${Math.abs(Math.round(p.peVs))}%`; };
const segRow = (k, name, field, hist) => [name, hist, ...[0, 1, 2].map(i => `{{F.seg.${k}.${field}.${i}|num}}`)];

// ---------------------------------------------------------------- forecasts
const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: EPS recovers to ₹{{F.eps.2|n1}} by FY29E, 20-30% below the street',
  blocks: [
    { p: `We model the two businesses the way management reports them. **Carbon black (incl. power)** = tonnes × realisation for revenue and tonnes × EBITDA per tonne for profit; corporate costs and Nanovace development sit inside it. **Aquapharm** = revenue growth × EBITDA margin. FY27E: carbon black volume +5% (Q1 flat, Q2 soft by management's own warning; guidance 'high single digit'), realisation ₹125/kg, EBITDA/t ₹16,400 on our basis (≈₹16,900 on the company's, inside the ₹16,500-17,000 guidance); Aquapharm +8% at 11.5%. FY28-29E: volume +7% / +6% (900 kt is ~82% used by FY29E; Andhra Pradesh adds from FY30), EBITDA/t ₹17,200 / ₹17,700, Aquapharm 12.5% / 13.5%. Capex ₹300 / 800 / 900 cr, interest ₹370 / 355 / 360 cr, tax 25%, payout 50%. Every input is on the Excel model's Assumptions sheet, which recalculates this report's target.` },
    { exhibit: { type: 'table', title: 'Segment forecasts', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      { sec: 'Carbon black (incl. power)' },
      ['Volume (kt)', n0(A26.cbVol / 1000), ...CBA.volumeT.map(v => n0(v / 1000))],
      ['Realisation incl. power (₹/kg)', n0(A26.cbRealisation), ...CBA.realisationRsKg.map(n0)],
      ['EBITDA per tonne (₹, Screener basis)', n0(A26.cbEbitdaPerT), ...CBA.ebitdaPerT.map(n0)],
      segRow('cb', 'Revenue (₹ cr)', 'revenue', n0(A26.cbRev)), segRow('cb', 'EBITDA (₹ cr)', 'adjEbitda', n0(A26.cbEbitda)),
      { sec: 'Aquapharm (Specialty & Solutions)' },
      segRow('aq', 'Revenue (₹ cr)', 'revenue', n0(A26.aqRev)), segRow('aq', 'EBITDA (₹ cr)', 'adjEbitda', n0(A26.aqEbitda)),
      ['EBITDA margin', '11.2%', ...AQA.marginPct.map(m => m + '%')],
    ], source: 'Company (FY26), GAM Research estimates. Carbon black = consolidated less Aquapharm; EBITDA excludes other income' } },
    { exhibit: { type: 'rows', title: 'P&L and cash flow summary (₹ crore)', from: 'FY23', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' },
      { name: 'Depreciation', ref: 'fin.dep' }, { name: 'Other income', ref: 'fin.otherIncome' },
      { name: 'Net profit', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n1' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Capex', ref: 'fin.capex' }, { name: 'Free cash flow', ref: 'fin.fcf' }, { name: 'ROE', ref: 'fin.roe', fmt: 'pct' },
    ], source: 'Company, GAM Research estimates' } },
    { exhibit: { type: 'table', title: 'Net debt path (₹ crore)', head: ['', 'FY24', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Net debt, model basis (borrowings incl. leases less cash and group shares)', ...['FY24', 'FY25', 'FY26'].map(l => n0(A.netDebt[ai(l)])), ...[0, 1, 2].map(i => n0(ndEngine(i)))],
      ['Net debt excluding the ₹464 cr of group-company shares', ...['FY24', 'FY25', 'FY26'].map(l => n0(A.netDebt[ai(l)] + (A.investments[ai(l)] || 0))), ...[0, 1, 2].map(i => n0(ndTrue(i)))],
      ['Net debt / EBITDA, model basis (x)', ...['FY24', 'FY25', 'FY26'].map(l => n1(A.netDebt[ai(l)] / A.ebitda[ai(l)])), ...[0, 1, 2].map(i => n1(ndEngine(i) / F.ebitda[i]))],
    ], source: 'Screener.in (history; company "net borrowings" ₹4,536 cr at Mar-26 excludes leases), GAM estimates. The engine counts the group shares as cash in forecasts; we show both.' } },
    { exhibit: { type: 'table', title: 'GAM vs the street (estimates standing on 30-Sep-2026)', head: ['', 'GAM FY27E', 'PL FY27E', 'ICICI Direct FY27E', 'GAM FY28E', 'PL FY28E', 'ICICI Direct FY28E'], rows: [
      ['Revenue (₹ cr)', '{{F.sales.0|num}}', n0(PL.estimates.FY27E.revenue), n0(IDIR.estimates.FY27E.revenue), '{{F.sales.1|num}}', n0(PL.estimates.FY28E.revenue), n0(IDIR.estimates.FY28E.revenue)],
      ['EBITDA (₹ cr)', '{{F.ebitda.0|num}}', n0(PL.estimates.FY27E.ebitda), n0(IDIR.estimates.FY27E.ebitda), '{{F.ebitda.1|num}}', n0(PL.estimates.FY28E.ebitda), n0(IDIR.estimates.FY28E.ebitda)],
      ['EPS (₹)', '{{F.eps.0|n1}}', n1(PL.estimates.FY27E.eps), n1(IDIR.estimates.FY27E.eps), '{{F.eps.1|n1}}', n1(PL.estimates.FY28E.eps), n1(IDIR.estimates.FY28E.eps)],
    ], source: 'Prabhudas Lilladher (8-Sep-2026), ICICI Direct (30-Jul-2026); no consensus dated Jul-Sep 2026 was found' } },
    { callout: `Our FY28E EPS (₹${n1(F.eps[1])}) is ${Math.round((1 - F.eps[1] / PL.estimates.FY28E.eps) * 100)}% below PL and ${Math.round((1 - F.eps[1] / IDIR.estimates.FY28E.eps) * 100)}% below ICICI Direct. The gaps: Aquapharm (we have ₹{{F.seg.aq.adjEbitda.1|num}} cr of FY28E EBITDA; ICICI Direct ₹305 cr), carbon black volume (695 kt vs ~710 kt), tax (25% vs PL's 21.5%) and other income (₹30 cr vs PL's ₹64 cr). We still forecast strong growth from the FY26 trough: EPS ₹5.0 → ₹${n1(F.eps[2])} (FY29E), ~${Math.round(epsCagr)}% a year over FY27-29E. What we do not forecast is deleveraging: with ₹1,700 cr of capex in FY28-29E and a 50% payout, net debt stays near ₹4,200-4,400 cr.` },
  ],
};

// ---------------------------------------------------------------- street
const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street: four Holds or worse and one Buy; average target ~₹${n0(stAvg)}`,
  blocks: [
    { p: `Five houses had calls standing on 30-Sep-2026: Prabhudas Lilladher BUY ₹391 (8-Sep, upgraded from Accumulate on the Russian import squeeze; 25x FY28E EPS of ₹15.5), ICICI Direct HOLD ₹350 (20x FY28E), Nuvama HOLD ₹350, IDBI Capital HOLD ₹352 and ICICI Securities REDUCE ₹315 (20x FY27-28E). The average, ~₹${n0(stAvg)}, is ${pc((stAvg / price - 1) * 100)} vs the 30-Sep price. Every house that discloses a method uses P/E. The cautious houses point to Q1's inventory gains, a likely Q2 dip and Aquapharm; the bull (PL) argues that guidance of ~₹17,000/t is conservative if Russian supply stays short. Targets fell from ₹474 (PL, Sep-2025) to ₹270-310 (May-2026) and recovered after Q1FY27.` },
    { exhibit: { type: 'table', title: 'Earlier calls (for context)', head: ['Broker', 'Date', 'Rating', 'Target (₹)', 'Method'], rows: D.streetHistory.map(o => [o.broker, o.date, o.rating, n0(o.tp), o.method ? `${o.method} ${o.multiple} ${o.on}` : 'n.d.']), source: 'PL recommendation history, ICICI Direct notes, Trendlyne, Business Today (calls dated to 30-Sep-2026 only)' } },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who'], wide: [0], rows: D.critiques.map(c => [c.point, c.who]), source: 'Broker notes, rating rationales and filings to 30-Sep-2026' } },
  ],
};

// ---------------------------------------------------------------- valuation
const derivation = [
  ['1. Its own history', `One-year-forward P/E median since Apr-2021: ${n1(fwdMed)}x, leaving out ${troughTxt} as a trough year (EPS ₹5.0 vs ₹13.0 in FY24, below half the three-year peak); ${n1(fwdMedAll)}x including it. The history has two regimes: ${n1(preDeal)}x as a pure carbon black maker (Apr-2021 to Oct-2023) and ${n1(postDeal)}x after the Aquapharm deal (ex-trough); ${n1(fwdPeNow)}x on our FY28E today`, `Starting point: ${n1(fwdMed)}x`],
  ['2. Sector de-rating', `On ${ASOF_TXT} the peers traded a median ${Math.abs(Math.round(sectorDerate))}% below their five-year P/E medians (Vinati ${sv('VINATIORGA')}, Apollo ${sv('APOLLOTYRE')}, Deepak ${sv('DEEPAKNTR')}, Aarti ${sv('AARTIIND')}, CEAT ${sv('CEATLTD')}, Himadri ${sv('HSCL')})`, 'No case to pay above PCBL\'s own history; no further cut, because PCBL\'s commodity-era multiple was never inflated by the 2021 chemicals boom'],
  ['3. Business mix', `Specialty products were ${Math.round(specShare * 100)}% of EBITDA in FY25 (company). Weighting ${Math.round((1 - specShare) * 100)}% at the commodity-era ${n1(preDeal)}x and ${Math.round(specShare * 100)}% at the specialty-chemical peers' ${n1(specPe)}x (Aarti, Deepak, Vinati)`, `${n1(mixPe)}x`],
  ['4. Growth', `EPS grows ~${Math.round(epsCagr)}% a year over FY27-29E (recovery from the FY26 trough), faster than in 2021-23; the street's 20-25x FY28E sits on EPS ${Math.round((PL.estimates.FY28E.eps / F.eps[1] - 1) * 100)}-${Math.round((IDIR.estimates.FY28E.eps / F.eps[1] - 1) * 100)}% above ours`, 'Add ~1x'],
  ['5. Returns and leverage', `ROE ~${Math.round(F.roe[1])}-${Math.round(F.roe[2])}% in FY28-29E vs a cost of equity of ~13%; net debt ~${n1(ndEngine(1) / F.ebitda[1])}x EBITDA; three Negative rating outlooks`, `No premium: **${PE_X}x** Sep-28E`],
];
const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${PE_X}x Sep-28E EPS gives {{dcf.tp|inr}}`,
  blocks: [
    ...streetBlocks('PCBL', {
      rating,
      streetIntro: `Every broker that discloses a method values PCBL on **P/E**: PL 25x and ICICI Direct 20x FY28E EPS, ICICI Securities 20x FY27-28E. We do the same, on Sep-28E EPS (half FY28E, half FY29E) of ₹${n1(epsSep28)}, and use EV/EBITDA (which charges the ~₹4,300 cr of net debt directly) and a DCF as cross-checks. The difference from the street is less the method than the inputs: our EPS is 20-30% lower, and our multiple starts from the stock's own history rather than from the 2024-25 enthusiasm.`,
      street: ST.map(s => [`${s.broker} (${s.date.slice(8)}-${s.date.slice(5, 7) === '09' ? 'Sep' : 'Jul'})`, s.rating, s.tp, s.method, s.multiple, s.on, s.thesis]),
      ourThesis: 'Sound core, value-destroying acquisition, leverage; the price assumes Vision 2030',
      streetSource: 'Broker notes (Jul-Sep 2026); Business Today (30-Jul-2026) for ICICI Securities and Nuvama; "At our EPS" applies P/E multiples to GAM FY28E EPS; n.d. = not disclosed in what we read',
      derivationIntro: `We start from the house window (one-year-forward P/E since Apr-2021, trough years excluded), check it against the sector's de-rating, then adjust for what has changed in PCBL: more specialty, faster (recovery) growth, much more debt and lower returns.`,
      derivation,
      derivationSource: `Screener.in (multiples to ${ASOF_TXT}), company, broker notes, GAM Research`,
      crossNote: `**What the cross-checks tell us.** EV/EBITDA at ${EV_X}x Sep-28E EBITDA of ₹${n0(ebitdaSep28)} cr less ~₹${n0(sepND)} cr of net debt gives ₹${n0(mv('ev').value)} (${mv('ev').vsTarget >= 0 ? '+' : ''}${mv('ev').vsTarget.toFixed(0)}%); ${EV_X}x is the stock's ${n1(fwdEvMed)}x forward median since Apr-2021 (${n1(fwdEvPre)}x commodity years, ${n1(fwdEvPost)}x post-deal; no EBITDA trough year), re-weighted for the specialty mix (${n1(mixEv)}x) plus ~0.5x for growth. Deducting the ₹${grpInv} cr of group shares from cash would lower it by ~₹${Math.round(grpInv / F.shares)}. The DCF (₹${n0(mv('dcf').value)}, 11.3% WACC, 5.5% terminal growth) implies ~${n1(V.ev / F.ebitda[1])}x FY28E EBITDA. Three methods cluster at ₹${n0(Math.min(mv('pe').value, mv('ev').value, mv('dcf').value))}-${n0(Math.max(mv('pe').value, mv('ev').value, mv('dcf').value))}; the market price needs ~${n1(price / epsSep28)}x our Sep-28E EPS.`,
    }),
    { pair: [
      { type: 'line', title: `Forward P/E: our ${PE_X}x vs the ${n1(fwdMed)}x house median`, unit: 'Price ÷ next full-year EPS (x)', x: fwdPe.map(x => x[0]), series: [{ name: 'Forward P/E', values: fwdPe.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: PE_X, text: `Our target: ${PE_X}x (median ex-${troughTxt}: ${n1(fwdMed)}x)`, color: '#cf8f1f' }], source: 'Screener.in prices; actual EPS, GAM estimates FY27-29E. Apr-2024 to Mar-2025 points (forward year FY26) are the excluded trough' },
      { type: 'line', title: `Forward EV/EBITDA: our ${EV_X}x cross-check vs the ${n1(fwdEvMed)}x median`, unit: 'EV ÷ next full-year EBITDA (x)', x: fwdEv.map(x => x[0]), series: [{ name: 'Forward EV/EBITDA', values: fwdEv.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: EV_X, text: `Cross-check: ${EV_X}x (median since Apr-2021: ${n1(fwdEvMed)}x)`, color: '#cf8f1f' }], source: 'Screener.in prices; reported EBITDA and net debt; GAM estimates FY27-29E' },
    ] },
    { exhibit: { type: 'table', title: 'From EPS to target price (base case)', head: ['', '₹'], rows: [
      ['FY28E EPS / FY29E EPS', `${n1(F.eps[1])} / ${n1(F.eps[2])}`], ['Sep-28E EPS (half each)', n1(epsSep28)], ['× P/E multiple', `${PE_X}x`],
      ['= Value per share', n0(mv('pe').value)], { hl: true, cells: ['**12-month target (rounded to ₹5)**', '**{{dcf.tp|inr}}**'] }, ['Upside vs ₹' + n1(price), '{{dcf.upside|chg}}'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Multiple ${mv('pe').multiple.bull}x; FY28E EPS ₹${n1(S.bull.eps[1])}.`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Volume +5% / +7% / +6%, EBITDA/t ₹16,400-17,700, Aquapharm margin 11.5-13.5%; ${PE_X}x Sep-28E EPS; FY28E EPS ₹${n1(F.eps[1])}.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Multiple ${mv('pe').multiple.bear}x; FY28E EPS ₹${n1(S.bear.eps[1])}.`],
    ], source: 'GAM Research' } },
        { callout: `**Why the range is so wide:** interest and depreciation absorb ~${Math.round((F.interest[1] + F.dep[1]) / F.ebitda[1] * 100)}% of FY28E EBITDA, so small changes in operating profit move EPS a lot: the bull case (1.5 points more carbon black margin, faster volume, an Aquapharm recovery) lifts FY28E EPS by ~${Math.round((S.bull.eps[1] / F.eps[1] - 1) * 100)}% and the bear case cuts it by ~${Math.round((1 - S.bear.eps[1] / F.eps[1]) * 100)}%, and each case also moves the multiple. The bear case is close to FY26 repeating itself (FY28E EPS ~₹${n1(S.bear.eps[1])}); the bull case needs the Russian squeeze, US/EU contracts and an Aquapharm recovery all at once.` },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-38E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Less: net debt at Mar-27E', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
      { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ], source: 'GAM Research. Net debt shown as a negative number (model basis). The engine discounts at one rate: we enter a WACC of ~11.3% (cost of equity ~13.1%, post-tax cost of debt ~6.3%, ~26% debt weight).' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): discount rate down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Listed peers at the 30-Sep-2026 close', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', 'EV/EBITDA (x)', 'ROE', 'P/E vs 5-yr median'], rows: PEERS.map(p => [p.symbol === 'PCBL' ? '**PCBL Chemical**' : p.short, n0(p.mcapCr), n0(p.revenue), n1(p.ebitdaMargin) + '%', n1(p.pe), n1(p.evEbitda), n1(p.roe) + '%', p.peVs != null ? pc(p.peVs) : '–']), source: `Screener.in, trailing multiples at the NSE close on ${ASOF_TXT}. Himadri is the only listed carbon black peer; Apollo and CEAT are customers; Aarti, Deepak and Vinati are specialty-chemical benchmarks` } },
  ],
};

module.exports = {
  rating, cover: P2.cover,
  sections: p => [P2.narrative, P3.business, P3.history, P3.industry, P3.tailwind, P3.carbonBlack, P4.aquapharm, P4.projects, P4.moat, p.seasons, p.financials, P4.quality, p.balance, P4.ownership(p.ownershipBase), P4.governance, forecasts, street, valuation, P5.risks, p.statements, P5.glossary],
  statementNotes: P5.statementNotes,
};
