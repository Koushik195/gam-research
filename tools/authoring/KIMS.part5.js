// KIMS report, part 5: street view, valuation (EV/EBITDA primary, post-Ind AS, leases and minorities in net debt), risks.
const X = require('./KIMS.ctx');
const { streetBlocks } = require('./valuation-blend');
const { ruleText } = require('../../src/ratings');
const { D, F, V, A, n0, n1, pc, ASOF_TXT, price, mv, evMult, ebitdaSep28, peMult, epsSep28, treasurySep28, evTarget, HEV, HEVA, HEVy, evNow, evNow27, troughEv, FM, fwdEv, fwdEvAdj, fwdPe, peNow, HPEA,
  PEERS, P, drEv, drPe, CORE, LEFT_OUT, sectorDrEv, sectorDrPe, allDrEv, evAfter, evAfterAdj, peAfter, shortName, adjSep28, adjValue, rating, buyBelow, sellAbove, ST, pl, axis, avgPost,
  plOurBasis, ourPlBasis, ourPostFy28, streetAt, epsCagrFwd, ebitdaCagrFwd, ebitdaCagrHist, adjCagrFwd, adjCagrHist, shortDate, b, Q1, NCI, miMarket, miPerShare, sharesDil, ndPf, mcapDil } = X;
const TP = V.tp, tpTxt = `₹${n0(TP)}`;

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: 'The street: Buy, ₹850-890 after Q1, on 27-30x FY28E EV/EBITDA',
  blocks: [
    { p: `Two houses published full notes after the Q1FY27 results, both Buy: Prabhudas Lilladher ₹850 (30x FY28E EV/EBITDA, raised from ₹800) and Axis Securities ₹890 (27x FY28E, raised from 23x and ₹760), an average of ₹${n0(avgPost)}. Older calls standing include ICICI Direct (Buy ₹870, Jun-2026) and Geojit (Accumulate ₹780, Feb-2026); ICICI Securities' institutional desk was last seen at Sell ₹630 (Nov-2025). The stock was ~₹796 when the post-Q1 notes came out and fell to ₹${n0(price)} by 30-Sep-2026, so the street saw 14-19% upside on the as-of date. Bulls argue the new hospitals are turning faster than feared and that the QIP removes the balance-sheet risk (PL: 32% EBITDA CAGR FY26-28E); the debate is how fast Kondapur, Bengaluru and Thane fill and how soon KIMS starts spending again. We found no consensus dated before 30-Sep-2026.` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who'], wide: [0], rows: D.critiques, source: 'Broker notes, earnings calls and filings to 30-Sep-2026' } },
  ],
};

const drTxt = (s, m) => `${shortName(s)} ${pc(m[s])}`;
const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${evMult}x Sep-28E EBITDA gives ${tpTxt}, below the share price`,
  blocks: [
    ...streetBlocks('KIMS', {
      rating, noOurEps: true,
      streetIntro: `Both post-Q1 notes value KIMS on **EV/EBITDA on FY28E** (PL 30x, Axis 27x); ICICI Direct used 30x FY27E in 2025. We use the same method, applied to the EBITDA the market will look at in September 2027 (Sep-28E: half FY28E, half FY29E). Our EBITDA is post-Ind AS and before other income, and we count lease liabilities (₹1,009 cr) and minority interests at book (₹${n0(NCI)} cr) as debt, because the EBITDA includes 100% of leased and partly owned hospitals. PL's EBITDA is on the same basis but its debt leaves out leases and minorities, so its 30x is ~${n1(plOurBasis)}x on our basis. Per-share values use 42.77 cr shares (after the QIP, with the warrants converted and their ₹600 cr counted as cash).`,
      street: ST.map(s => [`${s.broker} (${shortDate(s.date)})`, s.rating, s.tp, s.method || 'n.d.', s.multiple || '–', s.on || '–', X.rup(s.thesis)]),
      ourThesis: 'Good regional franchise, but the stock already pays for the new hospitals filling up',
      streetSource: 'PL and Axis Securities notes (PDF, 5-Aug-2026); ICICI Direct, Geojit and ICICI Securities via Trendlyne. n.d. = method not disclosed',
      derivationIntro: 'We start from KIMS\'s own one-year-forward EV/EBITDA since listing (June 2021), computed in our files on the same basis as the target (EV = market value + borrowings + lease liabilities + minorities at book − cash and investments; EBITDA post-Ind AS), show it before start-up losses too (the one-offs rule), adjust for how far listed hospital peers had de-rated by 30-Sep-2026, and then check growth, peers, returns and the street\'s basis.',
      derivation: [
        ['1. Its own history', `One-year-forward EV/EBITDA since listing: median ${n1(HEV.med)}x (25th-75th percentile ${n1(HEV.p25)}-${n1(HEV.p75)}x; ${n1(HEV.min)}x in 2021, ${n1(HEV.max)}x peak in 2025); calendar medians 2021 ${n1(HEVy('2021').med)}x, 2022 ${n1(HEVy('2022').med)}x, 2023 ${n1(HEVy('2023').med)}x, 2024 ${n1(HEVy('2024').med)}x, 2025 ${n1(HEVy('2025').med)}x, 2026 ${n1(HEVy('2026').med)}x. Trough years left out: ${troughEv ? troughEv + ' points' : 'none (forward EBITDA never fell below half its prior three-year peak)'}. On ${ASOF_TXT}: ${n1(evNow)}x our FY28E, ${n1(evNow27)}x FY27E`, `Starting point: ${n1(HEV.med)}x`],
        ['2. Before start-up losses', `Adding back new-unit EBITDA losses of the forward year (FY25 ₹18 cr, FY26 ₹128 cr, our FY27-29E ₹60 / 25 / 30 cr): median ${n1(HEVA.med)}x (2025 ${n1(HEVy('2025', fwdEvAdj).med)}x instead of ${n1(HEVy('2025').med)}x: the market looked through FY26's losses). Applied to Sep-28E EBITDA before start-up losses (₹${n0(adjSep28)} cr) after the de-rating below, it gives ₹${n0(adjValue)}`, 'Lower; we keep the reported basis because KIMS opens hospitals every year'],
        ['3. Sector de-rating', `Trailing EV/EBITDA vs each stock's five-year median on ${ASOF_TXT}: ${CORE.map(s => drTxt(s, drEv)).join(', ')} (median ${pc(sectorDrEv)}). KIMS itself excluded (its trailing multiple, ${pc(drEv.KIMS)} vs its median, is inflated by start-up losses in trailing EBITDA). Left out: ${LEFT_OUT.map(s => drTxt(s, drEv)).join(', ')} (the 2024 GCC demerger distorts its history); with it the median is ${pc(allDrEv)}`, `${n1(HEV.med)}x × ${(1 + sectorDrEv / 100).toFixed(3)} ≈ ${n1(evAfter)}x → **${evMult}x**`],
        ['4. Growth', `EBITDA grew ${Math.round(ebitdaCagrHist)}% a year in FY23-26 (${Math.round(adjCagrHist)}% before start-up losses); we forecast ~${Math.round(ebitdaCagrFwd)}% for FY26-29E (${Math.round(adjCagrFwd)}% before start-up losses), mostly beds already built filling up`, 'Supports holding the multiple, not raising it'],
        ['5. Peers', `Trailing EV/EBITDA on ${ASOF_TXT}: Narayana ${n1(P.NH.evEbitda)}x, Jupiter ${n1(P.JLHL.evEbitda)}x, Rainbow ${n1(P.RAINBOW.evEbitda)}x, Fortis ${n1(P.FORTIS.evEbitda)}x, Apollo ${n1(P.APOLLOHOSP.evEbitda)}x, Medanta ${n1(P.MEDANTA.evEbitda)}x, Max ${n1(P.MAXHEALTH.evEbitda)}x; KIMS ${n1(P.KIMS.evEbitda)}x (depressed trailing EBITDA)`, `${evMult}x Sep-28E = ${n1(ourPostFy28)}x our FY28E: below Fortis and Apollo's trailing multiples, for a smaller, lower-ARPOB chain`],
        ['6. Returns', `ROE ${n1(A.roe[b - 1])}% (FY25) and 11% (FY26, reported); on the enlarged post-QIP equity our ROE is {{F.roe.0|pct}} / {{F.roe.1|pct}} / {{F.roe.2|pct}} in FY27-29E vs an ${n1(V.ke)}% cost of equity; ROCE (Screener) 10% in FY26`, 'No premium: returns only reach the cost of equity in FY29E'],
        ['7. Street basis', `PL's 30x ≈ ${n1(plOurBasis)}x on our basis; our ${evMult}x Sep-28E ≈ ${n1(ourPlBasis)}x FY28E on PL's basis. The street's 27-30x on our FY28E EBITDA and net debt would give ₹${n0(streetAt(27))}-${n0(streetAt(30))}`, 'The street pays 7-9 turns more than KIMS\'s de-rated history'],
      ],
      derivationSource: `Screener.in prices, balance sheets and multiples to ${ASOF_TXT}; company (new-unit losses, QIP and warrants); broker notes; GAM Research`,
      crossNote: `**What the cross-checks tell us.** P/E (${peMult}x Sep-28E EPS of ₹${n1(epsSep28)}) gives ₹${n0(mv('pe').value)}: ${peMult}x is KIMS's ${n1(FM.median)}x forward P/E median since listing cut by the ${Math.abs(Math.round(sectorDrPe))}% P/E de-rating of the same seven peers (before start-up losses the median is ${n1(HPEA.med)}x). It is below the EV/EBITDA value because interest and depreciation on the new hospitals, and the minorities' rising share, weigh on earnings. The DCF (₹${n0(mv('dcf').value)}) is ${Math.abs(Math.round(mv('dcf').vsTarget))}% below the target: at an ${n1(V.ke)}% cost of capital the cash flows support less than today's price unless margins go well beyond our 23.5% FY29E. Minorities are at book in net debt here, as in the history; at market value (their Sep-28E profit of ~₹${n0(X.miSep28)} cr × ${peMult}x ≈ ₹${n0(miMarket)} cr) the target would be ~₹${n0(miPerShare)} a share lower. Every method points below ₹${n0(price)}.`,
    }),
    { pair: [
      { type: 'line', title: `Forward EV/EBITDA since listing: our ${evMult}x vs history`, unit: 'EV (incl. leases and minorities) ÷ next full-year EBITDA, post-Ind AS (x)', x: fwdEv.map(x => x[0]), series: [{ name: 'Reported', values: fwdEv.map(x => x[1]), fmt: 'x', thin: true }, { name: 'Before start-up losses', values: fwdEvAdj.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: HEV.med, text: `Median: ${n1(HEV.med)}x` }, { v: evMult, text: `Our target: ${evMult}x`, color: '#cf8f1f' }], source: 'Screener.in prices and balance sheets; company; GAM estimates for FY27-29E' },
      { type: 'line', title: `Forward P/E since listing: median ${n1(FM.median)}x, ${n1(peNow)}x now`, unit: 'Price ÷ next full-year EPS (x)', x: fwdPe.map(x => x[0]), series: [{ name: 'Forward P/E', values: fwdPe.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: FM.median, text: `Median: ${n1(FM.median)}x` }, { v: peMult, text: `Cross-check: ${peMult}x`, color: '#cf8f1f' }], source: 'Screener.in; GAM estimates (forwardMedian)' },
    ] },
    { exhibit: { type: 'table', title: 'From EV to target price (₹ crore unless stated)', head: ['', 'Base', 'Note'], wide: [2], rows: [
      ['Sep-28E EBITDA, post-Ind AS', n0(ebitdaSep28), 'Half FY28E ({{F.ebitda.1|num}}) + half FY29E ({{F.ebitda.2|num}})'],
      ['× target multiple', `${evMult}x`, 'Own forward median since listing, less sector de-rating'],
      ['= Enterprise value', n0(evTarget), 'Includes leased hospitals and 100% of partly owned ones'],
      ['Less: net debt incl. leases and minorities, Sep-28E', n0(-treasurySep28), `Borrowings + lease liabilities + minorities (book ₹${n0(NCI)} cr) − cash and investments (incl. ₹88 cr in associate KHL), model`],
      ['= Equity value', n0(evTarget + treasurySep28), ''],
      { hl: true, cells: ['**÷ shares (cr, fully diluted) = target (rounded)**', `**${n1(sharesDil)} → {{dcf.tp|inr}}**`, `vs CMP ₹${n0(price)}: {{dcf.upside|chg}}`] },
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Revenue growth +3pp a year, margin +1.5pp; ${V.blend.methods[0].multiple.bull}x (75th percentile since listing).`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Revenue +{{F.salesGrowth.0|pct}} / +{{F.salesGrowth.1|pct}} / +{{F.salesGrowth.2|pct}}; margin {{F.ebitdaMargin.0|pct}} → {{F.ebitdaMargin.2|pct}}; ${evMult}x Sep-28E EBITDA.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Revenue growth −4pp a year, margin −2pp; ${V.blend.methods[0].multiple.bear}x (25th percentile since listing).`],
    ], source: 'GAM Research' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-42E free cash flow (capex incl. new leases)', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Add: net cash at Mar-27 (negative = net debt incl. leases and minorities)', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
      { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of capital down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Listed hospital peers (trailing, at the 30-Sep-2026 close)', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'EV/EBITDA (x)', 'vs 5-yr median', 'P/E (x)', 'ROE'], rows: PEERS.map(p => [p.symbol === 'KIMS' ? '**KIMS**' : shortName(p.symbol), n0(p.mcapCr), n0(p.revenue), p.ebitdaMargin + '%', n1(p.evEbitda), pc(drEv[p.symbol]), n1(p.pe), p.roe + '%']), source: `Screener.in (post-Ind AS EBITDA; EV includes lease liabilities), multiples scaled to the NSE close on ${ASOF_TXT}. KIMS's market value is on 42.0 cr shares (before warrants); its ROE uses reported (pre-QIP) equity.` } },
  ],
};

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: 'Our honest summary: a good regional operator whose recovery is already in the price',
  blocks: [
    { callout: `**What you are buying:** the leading hospital chain in Telangana and Andhra Pradesh, with mature hospitals earning 25-30% margins at low prices, ~3,500 new beds already built and starting to fill, a balance sheet repaired by ₹2,100 cr of new equity, and a founder family adding money through warrants.` },
    { callout: `**What you are paying:** ${n1(evNow)}x our FY28E EV/EBITDA and ${n1(peNow)}x FY28E EPS, above KIMS's own ${n1(HEV.med)}x forward EV/EBITDA median since listing at a time when hospital peers trade ~${Math.round(-sectorDrEv)}% below theirs. On the street's method and our inputs the target is {{dcf.tp|inr}} ({{dcf.upside|chg}}): a ${rating}. The market is paying for the new hospitals to fill on schedule; KIMS's record (Thane, Electronic City) says some will be late.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      ['Bengaluru EBITDA-neutral for FY27 and Electronic City profitable by Q4', 'Medium', 'Quarterly Karnataka EBITDA'],
      ['Kondapur at ₹55-60 cr a month by Mar-2027 without a margin dip in Telangana', 'Medium', 'Telangana revenue and margin'],
      ['Group margin (before other income) above 22% in H2FY27', 'Low-medium', 'Quarterly EBITDA margin; new-unit losses'],
      ['Discipline on the next round of projects (O&M before buying, no new states)', 'Medium', 'Capex announcements in FY28; call-option exercises'],
      ['A fall in the share price toward our buy level', 'n.a.', `Below ~₹${n0(buyBelow)} the upside to our target would exceed 15%`],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['New hospitals fill slowly (insurer empanelment, doctor hiring in Maharashtra)', 'Medium', 'Margins stuck near 20%; bear case {{scen.bear.tp|inr}}'],
      ['A new capex or acquisition cycle before this one pays back', 'Medium-high', 'Net debt back above 3x EBITDA; more start-up losses'],
      ['Competition for doctors and patients in Hyderabad', 'Medium', 'Telangana is ~77% of group EBITDA'],
      ['Promoter pledges and governance (associate-owned Kondapur building)', 'Low-medium', 'Forced selling risk in a downturn; related-party value leakage'],
      ['Minorities\' share of profit rising faster than we assume', 'Medium', `Each extra 1pp of profit to minorities is ~₹${(F.pat[1] * 0.01 / 0.92 / sharesDil).toFixed(2)} of FY28E EPS`],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**We would turn buyers below ~₹${n0(buyBelow)}** and stay sellers above ~₹${n0(sellAbove)} on today's numbers; we would raise the multiple if Bengaluru and Thane deliver mid-teens margins in FY28 without a new round of start-up losses.`,
      `**Biggest swing factor:** occupancy at the new hospitals. Each 1pp of group occupancy is ~₹100 cr of revenue and, at incremental margins of ~40%, ~₹40 cr of EBITDA (~₹18 a share at our multiple).`,
      `**Bull case {{scen.bull.tp|inr}}** needs everything to go right at once; **bear case {{scen.bear.tp|inr}}** is a slower fill plus a new spending cycle, which is not far-fetched given management's plans.`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Occupancy, Q1FY27', v: `${Q1.occupancyPct}%`, d: 'on 5,639 operational beds; 61-65% like-for-like in Telangana' },
      { k: 'New-unit losses', v: '₹128 cr', d: 'FY26 EBITDA; we assume ₹60 cr in FY27E' },
      { k: 'Net debt / EBITDA', v: '5.4x → 2.8x', d: 'Mar-26 reported → pro forma for QIP and warrants' },
      { k: 'Forward EV/EBITDA', v: `${n1(evNow)}x`, d: `median since listing ${n1(HEV.med)}x` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

module.exports = { street, valuation, risks };
