// Deepak Fertilisers report, part B: valuation chapter (sum of the parts primary; P/E and DCF cross-checks). As of 30-Sep-2026.
const { ctx } = require('./DEEPAKFERT.ctx');
const { F, V, S, n0, n1, pc, price, rating, mv, PE_X, epsSep28, pChem, pFert, pCorp, pCcd, pNd, CHEM_X, FERT_X, CORP_X, segEv, segEbitdaSep28, blendX, sotpBull, sotpBear,
  FM, fwdPe, fwdMed, fwdMedAll, troughTxt, pe23, pe24, fwdEv, fwdEvMed, ev21, ev23, ev24, fwdEvNow, fwdPeNow, PEERS, sectorDerate, sectorDerateEv, fertPeerEv, fertPeerEv5,
  pv, anchorX, chemShareHist, chemImplied, chemShare28, ST, EMK, KEY, ASOF_TXT } = ctx;
const sh = F.shares, ps = v => n0(v / sh);
const impliedChem = (price * sh - pNd.value - pCcd.value - pFert.value - pCorp.value) / pChem.metric; // what the market pays for Chemicals
const sv = s => pc(pv(s).evVs);

const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: a sum of the parts at ${n1(blendX)}x Sep-28E EBITDA gives {{dcf.tp|inr}}`,
  blocks: [
    { h: 'How the street values Deepak Fertilisers' },
    { p: `Coverage is thin. The only detailed method we found is Emkay's (initiation, 18-Nov-2025): a **sum of the parts on EV/EBITDA** for Dec-27E, with the mining subsidiary DMSL (TAN, ammonia, Australian blasting) at 12x, industrial chemicals at 10x and crop nutrition at 6x, ~10x overall, for a ₹2,000 target. Emkay set 12x for DMSL below the ~17x at which its ₹800 cr convertibles were priced. Keynote Capitals moved to Neutral with a ₹1,534 target on 3-Jun-2026 (method not visible to us); FundsIndia used 17x FY27E P/E in Aug-2025. A sum of the parts on EV/EBITDA is the right tool here: the businesses differ in quality, debt is material, and management intends to list DMSL and MAL separately. We use the company's reported segments (Chemicals, Fertilisers) because profit by legal entity is not disclosed quarterly.` },
    { exhibit: { type: 'table', title: 'How the street values the stock', head: ['Broker', 'Rating', 'Target (₹)', 'Date', 'Method', 'Multiples', 'On', 'Thesis'], wide: [7], rows: [
      [KEY.broker, KEY.rating, n0(KEY.tp), '3-Jun-26', 'n.d.', '–', '–', KEY.thesis],
      [EMK.broker, EMK.rating, n0(EMK.tp), '18-Nov-25', 'SOTP EV/EBITDA', 'DMSL 12x, IC 10x, crop 6x (~10x)', 'Dec-27E', EMK.thesis],
      ['FundsIndia (earlier)', 'Buy', '1,751', '8-Aug-25', 'P/E', '17x', 'FY27E', 'From volume to value'],
      { hl: true, cells: ['**GAM Research**', `**${rating}**`, '**{{dcf.tp|num}}**', '30-Sep-26', '**SOTP EV/EBITDA**', `**Chemicals ${CHEM_X}x, Fertilisers ${FERT_X}x (${n1(blendX)}x)**`, '**Sep-28E**', 'War-time spreads fade; capacity and gas offset them; EPS flat'] },
    ], source: 'Emkay initiation (18-Nov-2025); Trendlyne research listing (Keynote, 3-Jun-2026); FundsIndia (8-Aug-2025). n.d. = not disclosed in what we could read' } },
    { h: 'Our sum of the parts' },
    { p: `The target is a 12-month price, so each segment is valued on the EBITDA the market will look at in September 2027: **Sep-28E** (half FY28E, half FY29E). We deduct corporate costs at the blended multiple (brokers usually leave them out), the convertible holders' claim on DMSL and net debt at the target date.` },
    { exhibit: { type: 'table', title: 'Sum of the parts (base case)', head: ['Part', 'Sep-28E metric (₹ cr)', 'Multiple', 'Value (₹ cr)', '₹ / share', 'Why'], wide: [5], rows: [
      ['Chemicals (TAN, nitric acid, IPA, ammonia)', n0(pChem.metric), `${CHEM_X}x`, n0(pChem.value), ps(pChem.value), 'Own history de-rated, adjusted for mix; see the derivation'],
      ['Fertilisers (Mahadhan)', n0(pFert.metric), `${FERT_X}x`, n0(pFert.value), ps(pFert.value), `Fertiliser peers (ex-Coromandel) ${n1(fertPeerEv)}x trailing, ${n1(fertPeerEv5)}x five-year median; Emkay 6x`],
      ['Less: corporate costs', n0(pCorp.metric), `${CORP_X}x`, n0(pCorp.value), ps(pCorp.value), 'Real costs, valued at the blended multiple'],
      ['Less: DMSL convertible holders\' claim', '–', '–', n0(pCcd.value), ps(pCcd.value), 'Equity part of the ₹800 cr CCDs (minority interest at Mar-26); they convert into ~6-7% of DMSL'],
      ['Less: net debt at Sep-27E', '–', '–', n0(pNd.value), ps(pNd.value), 'Model: borrowings incl. leases and the CCD debt part, less cash (half Mar-27E + half Mar-28E)'],
      { hl: true, cells: ['**Equity value / target (rounded to ₹10)**', '', `**${n1(blendX)}x**`, '**{{dcf.sotp.equity|num}}**', '**{{dcf.tp|num}}**', 'vs CMP ₹{{P.last|num}}: {{dcf.upside|chg}}'] },
    ], source: 'GAM Research' } },
    { h: `Deriving the multiples: Chemicals ${CHEM_X}x, Fertilisers ${FERT_X}x` },
    { exhibit: { type: 'table', title: 'Deriving the target multiples', head: ['Yardstick', 'Evidence', 'What it implies'], wide: [1, 2], rows: [
      ['1. Its own history', `One-year-forward EV/EBITDA median since Apr-2021: **${n1(fwdEvMed)}x** (no trough year on EBITDA): ${n1(ev21)}x in Apr-2021 to Mar-2023, ${n1(ev23)}x since Apr-2023 (after the ammonia plant), ${n1(ev24)}x since Apr-2024. Forward P/E median ${n1(fwdMed)}x leaving out ${troughTxt} as a trough year (${n1(fwdMedAll)}x including it). Today ${n1(fwdEvNow)}x and ${n1(fwdPeNow)}x on our estimates`, `Starting point: ${n1(fwdEvMed)}x group EV/EBITDA`],
      ['2. Sector de-rating', `On ${ASOF_TXT} the peers traded a median ${Math.abs(Math.round(sectorDerateEv))}% below their five-year EV/EBITDA medians (${Math.abs(Math.round(sectorDerate))}% on P/E): Chambal ${sv('CHAMBLFERT')}, Paradeep ${sv('PARADEEP')}, GNFC ${sv('GNFC')}, GSFC ${sv('GSFC')}, RCF ${sv('RCF')}, Deepak Nitrite ${sv('DEEPAKNTR')}, Coromandel ${sv('COROMANDEL')}, Solar ${sv('SOLARINDS')}`, `${n1(anchorX)}x for the group`],
      ['3. Mix', `Chemicals were ${Math.round(chemShareHist * 100)}% of segment EBITDA in FY25-26 (${Math.round(chemShare28 * 100)}% in FY28E). With Fertilisers at ${FERT_X}x (fertiliser peers ex-Coromandel ${n1(fertPeerEv)}x), the group anchor implies ~${n1(chemImplied)}x for Chemicals`, `Chemicals ~${n1(chemImplied)}x, Fertilisers ${FERT_X}x`],
      ['4. Growth', 'Gopalpur and Dahej fill over two years (FY27-28), more than a one-year-forward multiple captures; but EPS is flat over FY27-29E as Q1FY27\'s windfall fades', `Round Chemicals up to **${CHEM_X}x**`],
      ['5. Returns and risk', `ROE ~${Math.round(F.roe[1])}-${Math.round(F.roe[0])}% (FY27-28E) vs a ~13% cost of equity; net debt falls below 1.5x EBITDA by FY28E; no pricing power, promoter-linked financing`, `No further premium: blended **${n1(blendX)}x** Sep-28E`],
      ['6. What the market pays', `At ₹${n0(price)}, after valuing the other parts as above, Chemicals is priced at ~${n1(impliedChem)}x Sep-28E EBITDA`, `The price assumes ~${n1(impliedChem - CHEM_X)}x more than we derive`],
    ], source: `Screener.in (prices and multiples to ${ASOF_TXT}), company, Emkay, GAM Research` } },
    { pair: [
      { type: 'line', title: `Forward EV/EBITDA: ${n1(fwdEvMed)}x median; our SOTP ${n1(blendX)}x`, unit: 'EV ÷ next full-year EBITDA (x)', x: fwdEv.map(x => x[0]), series: [{ name: 'Forward EV/EBITDA', values: fwdEv.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: Math.round(blendX * 10) / 10, text: `SOTP: ${n1(blendX)}x (median ${n1(fwdEvMed)}x)`, color: '#cf8f1f' }], source: 'Screener.in prices; reported EBITDA and net debt; GAM estimates FY27-29E' },
      { type: 'line', title: `Forward P/E: our ${PE_X}x cross-check vs the ${n1(fwdMed)}x house median`, unit: 'Price ÷ next full-year EPS (x)', x: fwdPe.map(x => x[0]), series: [{ name: 'Forward P/E', values: fwdPe.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: PE_X, text: `Cross-check: ${PE_X}x (median ex-${troughTxt}: ${n1(fwdMed)}x)`, color: '#cf8f1f' }], source: `Screener.in prices; actual EPS, GAM estimates FY27-29E. Apr-2022 to Mar-2023 points (forward year ${troughTxt}) are the excluded trough` },
    ] },
    { exhibit: { type: 'table', title: 'Target price and cross-checks', head: ['Method', 'Role', 'Basis', 'Multiple', 'Value / share (₹)', 'vs target', 'Bull (₹)', 'Bear (₹)'], rows: [
      ['**Sum of the parts**', '**Target**', 'Sep-28E segment EBITDA', `Chemicals ${CHEM_X}x (bull 9x, bear 6x); Fertilisers ${FERT_X}x (7x, 5x)`, '**{{dcf.blend.methods.0.value|num}}**', '–', '{{scen.bull.blend.methods.0.value|num}}', '{{scen.bear.blend.methods.0.value|num}}'],
      ['P/E', 'Cross-check', `Sep-28E EPS ₹${n1(epsSep28)}`, `${PE_X}x (bull 11x, bear 7x)`, '{{dcf.blend.methods.1.value|num}}', `${Math.round(mv('pe').vsTarget)}%`, '{{scen.bull.blend.methods.1.value|num}}', '{{scen.bear.blend.methods.1.value|num}}'],
      ['DCF', 'Cross-check', '10-year FCFF at an 11.7% WACC, g 5.5%', `implies ${n1(V.impliedEvEbitda)}x FY28E EV/EBITDA`, '{{dcf.blend.methods.2.value|num}}', `+${Math.round(mv('dcf').vsTarget)}%`, '{{scen.bull.blend.methods.2.value|num}}', '{{scen.bear.blend.methods.2.value|num}}'],
      { hl: true, cells: ['**12-month target (rounded)**', '', '', '', '**{{dcf.tp|inr}}**', '{{dcf.upside|chg}} vs CMP', '{{scen.bull.tp|inr}}', '{{scen.bear.tp|inr}}'] },
    ], source: 'GAM Research' } },
    { callout: `**What the cross-checks tell us.** P/E at ${PE_X}x (the ${n1(fwdMed)}x forward median cut by the sector's ${Math.abs(Math.round(sectorDerate))}% P/E de-rating) on Sep-28E EPS of ₹${n1(epsSep28)} gives ₹${n0(mv('pe').value)}, ${Math.abs(Math.round(mv('pe').vsTarget))}% below the target, because interest and depreciation rise as the projects start. The DCF (₹${n0(mv('dcf').value)}) is ${Math.round(mv('dcf').vsTarget)}% above: it credits a decade of free cash flow at an 11.7% WACC with margins fading to 17.5%, and 52% of its value is terminal. The market price (₹${n0(price)}) sits between them, nearer the DCF: it pays ~${n1(impliedChem)}x for Chemicals, i.e. it is pricing a slower fade of war-time spreads than we are.` },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Chemicals 9x, Fertilisers 7x; FY28E EPS ₹${n1(S.bull.eps[1])}.`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Chemicals revenue +39.5% / +11.5% / +2.5% at 37.5% / 32% / 31% EBITDA margins; Fertilisers 5.5-8%; Chemicals ${CHEM_X}x, Fertilisers ${FERT_X}x Sep-28E; FY28E EPS ₹${n1(F.eps[1])}.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Chemicals 6x, Fertilisers 5x; FY28E EPS ₹${n1(S.bear.eps[1])}.`],
    ], source: 'GAM Research' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-37E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Less: net debt at Mar-27E', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
      { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ], source: 'GAM Research. Net debt shown as a negative number (model basis). The engine discounts at one rate: we enter a WACC of ~11.7% (cost of equity ~13.1%, post-tax cost of debt ~6.6%, ~22% debt weight) via beta 0.87. The DCF does not deduct the CCD holders\' claim (~₹49 a share)' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): discount rate down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: `Listed peers at the ${ASOF_TXT} close`, head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', 'EV/EBITDA (x)', 'ROE', 'EV/EBITDA vs 5-yr median'], rows: PEERS.map(p => [p.symbol === 'DEEPAKFERT' ? '**Deepak Fertilisers**' : p.short, n0(p.mcapCr), n0(p.revenue), n1(p.ebitdaMargin) + '%', n1(p.pe), n1(p.evEbitda), n1(p.roe) + '%', p.evVs != null ? pc(p.evVs) : '–']), source: `Screener.in, trailing multiples at the NSE close on ${ASOF_TXT}. Solar Industries is an explosives maker (a TAN buyer, not a like-for-like peer); Deepak Nitrite a nitration chemicals benchmark` } },
  ],
};

module.exports = { valuation, impliedChem };
