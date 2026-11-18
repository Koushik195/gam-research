// Aster DM Quality Care report, part 5: street view, valuation (EV/EBITDA primary on post-Ind AS EBITDA after minorities,
// leases in net debt), risks & honest summary.
const X = require('./ASTERDM.ctx');
const { streetBlocks } = require('./valuation-blend');
const { ruleText } = require('../../src/ratings');
const { D, F, V, A, n0, n1, pc, ASOF_TXT, price, mv, evMult, evAttrMult, ebitdaSep28, peMult, epsSep28, treasurySep28, evTarget, HEV, HPE, HEVy, HPD, evNowAttr, evNowCons, peNow, FM, fwdEv, fwdPe,
  PEERS, P, drEv, drPe, CORE, LEFT_OUT, sectorDrEv, sectorDrPe, allDrEv, evAfter, peAfter, shortName, rating, buyBelow, sellAbove, ST, mo, ic, pl, hd, avgTp, plOurBasis, icOurBasis, ourPreBasis,
  MIN, LEASE, epsCagrFwd, ebitdaCagrFwd, pfCagrHist, shortDate, b, Q1, salValue } = X;

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: 'The street: four Buys/Adds and a Hold, targets ₹855-920, all on forward EV/EBITDA',
  blocks: [
    { p: `Five notes stood on ${ASOF_TXT}, all written after the merger took effect: Motilal Oswal initiated with Buy and ₹910 (27x 12-month-forward EBITDA after minorities, 28-Sep-2026), ICICI Securities' retail desk Buy ₹895 (28x FY28E EBITDA of ₹2,872 cr), Prabhudas Lilladher Buy ₹920 (32x pre-Ind AS FY28E EBITDA after minorities), HDFC Securities Add ₹910 (28x Q1FY29E blended EV/EBITDA) and ICICI Securities' institutional desk Hold ₹855. The average is ~₹${n0(avgTp)}, ~${Math.round((avgTp / price - 1) * 100)}% above the ₹${n0(price)} close. The bull case on the street: synergies plus new beds lift EBITDA ~25% a year to FY28 and the combined company earns a "mega-chain" multiple. The notes were written when the stock was ₹760-845; it fell ~20% from its August high, partly with the sector on 30-Sep-2026.` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who'], wide: [0], rows: D.critiques.map(r => r.map(X.rup)), source: 'Broker notes, earnings calls and filings to 30-Sep-2026' } },
  ],
};

const drTxt = (s, m) => `${shortName(s)} ${pc(m[s])}`;
const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${evAttrMult}x Sep-28E EBITDA after minorities gives ₹${n0(V.tp)}`,
  blocks: [
    ...streetBlocks('ASTERDM', {
      rating, noOurEps: true,
      streetIntro: `Every note with a disclosed method values the merged company on **EV/EBITDA on FY28E or 12-month-forward EBITDA** (27-32x). We use the same method on the EBITDA the market will look at in September 2027 (Sep-28E: half FY28E, half FY29E). Two choices matter. (1) **Minorities**: about ${Math.round(MIN * 100)}% of EBITDA belongs to partners in subsidiaries, so like Motilal Oswal and PL we apply the multiple to EBITDA after minorities; in the model this is ${evMult}x consolidated EBITDA (= ${evAttrMult}x × ${(1 - MIN).toFixed(2)}). (2) **Leases**: we use post-Ind AS EBITDA with lease liabilities (~₹${n0(LEASE)} cr) in net debt; PL uses pre-Ind AS EBITDA without leases. The derivation table translates.`,
      street: ST.map(s => [`${s.broker} (${shortDate(s.date)})`, s.rating, s.tp, s.method || 'n.d.', s.multiple || '–', X.rup(s.on) || '–', X.rup(s.thesis)]),
      ourThesis: 'Accretive merger, credible growth, but synergies unproven and peers de-rated: fairly priced',
      streetSource: 'Broker PDFs (Motilal Oswal, ICICI Securities retail, PL, HDFC Securities); ICICI Securities institutional via Trendlyne listing. n.d. = method not disclosed',
      derivationIntro: 'We start from the stock\'s own one-year-forward EV/EBITDA since the merger was announced, computed in our files on the target\'s basis (market value of the 87.17 cr post-merger shares + pro-forma net debt including leases, over the next full year\'s pro-forma EBITDA after minorities), adjust for how far listed hospital peers had de-rated by 30-Sep-2026, and check growth, peers, returns and the street.',
      derivation: [
        ['1. Its own history', `Look-through forward EV/EBITDA (after minorities) from 29-Nov-2024 to ${ASOF_TXT}: median ${n1(HEV.med)}x (25th-75th percentile ${n1(HEV.p25)}-${n1(HEV.p75)}x; low ${n1(HEV.min)}x in Mar-2025, high ${n1(HEV.max)}x); calendar medians 2025 ${n1(HEVy('2025').med)}x, 2026 ${n1(HEVy('2026').med)}x. No trough years (pro-forma EBITDA rose every year). Not used: pre-FY25 history (Gulf business) and Aster alone in Apr-Nov 2024 (median ${n1(HPD.med)}x forward). On ${ASOF_TXT}: ${n1(evNowAttr)}x our FY28E after minorities (${n1(evNowCons)}x consolidated)`, `Starting point: ${n1(HEV.med)}x`],
        ['2. Sector de-rating', `Trailing EV/EBITDA vs each stock's five-year median on ${ASOF_TXT}: ${CORE.map(s => drTxt(s, drEv)).join(', ')} (median ${pc(sectorDrEv)}). Left out: Aster itself (Screener divides the merged market value by Aster-only EBITDA: ${n1(P.ASTERDM.evEbitda)}x) and ${LEFT_OUT.map(s => drTxt(s, drEv)).join(', ')} (new-hospital losses inflate its trailing multiple); with KIMS the median is ${pc(allDrEv)}`, `${n1(HEV.med)}x × ${(1 + sectorDrEv / 100).toFixed(3)} ≈ ${n1(evAfter)}x → **${evAttrMult}x** after minorities = **${evMult}x** consolidated`],
        ['3. Growth', `Pro-forma operating EBITDA grew ${Math.round(pfCagrHist)}% a year in FY24-26; we forecast ~${Math.round(ebitdaCagrFwd)}% for FY26-29E (post-Ind AS), helped by synergies and ~₹5,450 cr of capex over three years`, 'No premium: growth is bought with capex and depends on unproven synergies'],
        ['4. Peers', `Trailing EV/EBITDA on ${ASOF_TXT}: Narayana ${n1(P.NH.evEbitda)}x, Jupiter ${n1(P.JLHL.evEbitda)}x, Rainbow ${n1(P.RAINBOW.evEbitda)}x, Fortis ${n1(P.FORTIS.evEbitda)}x, Apollo ${n1(P.APOLLOHOSP.evEbitda)}x, Medanta ${n1(P.MEDANTA.evEbitda)}x, Max ${n1(P.MAXHEALTH.evEbitda)}x`, `${evMult}x Sep-28E consolidated ≈ ${n1(evTarget / F.ebitda[1])}x our FY28E: between Narayana/Jupiter and Fortis/Apollo`],
        ['5. Returns', `Company ROCE (excl. CWIP and intangibles) 22.9% in Q1FY27, but our ROE on all equity is {{F.roe.0|pct}} → {{F.roe.2|pct}} (FY27-29E) against an ${n1(V.ke)}% cost of equity, because QCIL's acquisition goodwill sits in the book`, 'Supports a premium to book, not to peers'],
        ['6. Street basis', `On our basis PL's 32x pre-Ind AS ≈ ${n1(plOurBasis)}x, ICICI Securities' 28x consolidated ≈ ${n1(icOurBasis)}x, Motilal Oswal 27x; our ${evAttrMult}x ≈ ${n1(ourPreBasis)}x on PL's pre-Ind AS basis`, 'We are below the street: it pays above the stock\'s own history since the deal'],
      ],
      derivationSource: `Screener.in prices and peer multiples to ${ASOF_TXT}; company pro-forma net debt and EBITDA; broker notes; GAM Research`,
      crossNote: `**What the cross-checks tell us.** P/E (${peMult}x Sep-28E EPS of ₹${n1(epsSep28)}) gives ₹${n0(mv('pe').value)}: ${peMult}x is the ${n1(HPE.med)}x look-through forward P/E median since the deal cut by the ${Math.abs(Math.round(sectorDrPe))}% P/E de-rating of the same seven peers. The house forwardMedian on Screener EPS returns no median from May-2024: every year is a 'trough' against FY25 EPS of ₹107.66, which includes the ₹4,981 cr Gulf gain (all-points median ${n1(FM.medianAll)}x), so we use the one-off-free series. The DCF (₹${n0(mv('dcf').value)}) is ${Math.abs(Math.round(mv('dcf').vsTarget))}% below the target: with capex at 14-15% of revenue to FY29E, minorities in the tax line and an ${n1(V.ke)}% cost of capital, cash flows support well under today's price. The market is paying for growth beyond FY30 that a 15-year DCF at 6% terminal growth does not capture; our target relies on it continuing to pay ~${evAttrMult}x forward EBITDA, below the ${n1(HEV.med)}x it has paid since the deal.`,
    }),
    { pair: [
      { type: 'line', title: `Look-through forward EV/EBITDA since the deal: our ${evAttrMult}x vs history`, unit: 'EV ÷ next-year EBITDA after minorities (x)', x: fwdEv.map(x => x[0]), series: [{ name: 'Forward EV/EBITDA', values: fwdEv.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: HEV.med, text: `Median: ${n1(HEV.med)}x` }, { v: evAttrMult, text: `Our target: ${evAttrMult}x`, color: '#cf8f1f' }], source: 'Screener.in prices; company pro-forma; GAM estimates FY27-29E' },
      { type: 'line', title: `Look-through forward P/E: median ${n1(HPE.med)}x, ${n1(peNow)}x now`, unit: 'Price ÷ next-year pro-forma EPS (x)', x: fwdPe.map(x => x[0]), series: [{ name: 'Forward P/E', values: fwdPe.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: HPE.med, text: `Median: ${n1(HPE.med)}x` }, { v: peMult, text: `Cross-check: ${peMult}x`, color: '#cf8f1f' }], source: 'Screener.in prices; pro-forma EPS on 87.17 cr shares; GAM estimates' },
    ] },
    { exhibit: { type: 'table', title: 'From EV to target price (₹ crore unless stated)', head: ['', 'Base', 'Note'], wide: [2], rows: [
      ['Sep-28E EBITDA, post-Ind AS (consolidated)', n0(ebitdaSep28), 'Half FY28E ({{F.ebitda.1|num}}) + half FY29E ({{F.ebitda.2|num}})'],
      ['Less minorities\' share (11%)', n0(-ebitdaSep28 * MIN), 'KIMSHEALTH founder, hospital partners'],
      ['= EBITDA after minorities', n0(ebitdaSep28 * (1 - MIN)), ''],
      ['× target multiple', `${evAttrMult}x`, 'Look-through median since the deal, less sector de-rating'],
      ['= Enterprise value (shareholders\' share)', n0(evTarget), `Same as ${evMult}x consolidated EBITDA`],
      ['Less: net debt incl. leases, Sep-28E', n0(treasurySep28), 'Model (debt + ~₹1,800-2,000 cr leases less cash)'],
      ['= Equity value', n0(evTarget + treasurySep28), ''],
      { hl: true, cells: ['**÷ 87.17 cr shares = target (rounded)**', `**₹${n0(V.tp)}**`, `vs CMP ₹${n0(price)}: {{dcf.upside|chg}}`] },
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Scenarios (merged company) and the standalone check', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Revenue growth +3pp a year, margin +1pp; ${n1(V.blend.methods[0].multiple.bull / (1 - MIN))}x after minorities (75th percentile since the deal).`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Revenue +{{F.salesGrowth.0|pct}} / +{{F.salesGrowth.1|pct}} / +{{F.salesGrowth.2|pct}}; post-Ind AS margin {{F.ebitdaMargin.0|pct}} → {{F.ebitdaMargin.2|pct}}; ${evAttrMult}x Sep-28E EBITDA after minorities.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Revenue growth −3pp a year, margin −1.5pp; ${n1(V.blend.methods[0].multiple.bear / (1 - MIN))}x (the low since the deal).`],
      ['Aster alone (no merger)', `₹${n0(Math.round(salValue / 10) * 10)}`, `${pc((Math.round(salValue / 10) * 10) / price * 100 - 100)}`, 'Legacy Aster at the same multiple on its own EBITDA and 51.81 cr shares: the merger adds value per share at equal multiples.'],
    ], source: 'GAM Research' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-42E free cash flow (capex incl. new leases)', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Add: net cash at Mar-27 (negative = net debt incl. leases)', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
      { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ], source: 'GAM Research (tax rate 34.3% incl. minorities and associates, so NOPAT is roughly after minorities)' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of capital down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Listed hospital peers (trailing, at the 30-Sep-2026 close)', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'EV/EBITDA (x)', 'vs 5-yr median', 'P/E (x)', 'ROE'], rows: PEERS.map(p => [p.symbol === 'ASTERDM' ? '**Aster DM (Screener, not meaningful)**' : shortName(p.symbol), n0(p.mcapCr), n0(p.revenue), p.ebitdaMargin + '%', n1(p.evEbitda), pc(drEv[p.symbol]), n1(p.pe), p.roe + '%']), source: `Screener.in (post-Ind AS EBITDA; EV includes lease liabilities), multiples scaled to the NSE close on ${ASOF_TXT}. Aster's row divides the merged market value (87.17 cr shares) by Aster-only FY26 figures.` } },
  ],
};

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: 'Our honest summary: a good merger at a full price; buy on delivery or on weakness',
  blocks: [
    { callout: '**What you are buying:** India\'s third-largest listed hospital chain, with a dominant Kerala franchise, strong complex-care programmes, 87% cash-and-insurance payors, a 15,000-bed plan that is half brownfield, and a margin path to ~24% that needs no heroics, run by a professional CEO under joint founder and Blackstone control.' },
    { callout: `**What you are paying:** ${n1(evNowAttr)}x our FY28E EBITDA after minorities and ${n1(peNow)}x FY28E EPS, about the ${n1(HEV.med)}x and ${n1(HPE.med)}x it has averaged since the deal, at a time when listed peers trade ~${Math.round(-sectorDrEv)}% below their own five-year medians. On the street's method and our inputs the target is {{dcf.tp|inr}} ({{dcf.upside|chg}}): a ${rating}. The DCF (₹${n0(mv('dcf').value)}) is the warning: the price already assumes the expansion and synergies work for a long time.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      ['Synergies visible in FY27 numbers (margin above 23% post-Ind AS)', 'Medium', 'Quarterly margin, procurement savings'],
      ['Focus and under-performing hospitals (25% of beds) move up a bucket', 'Medium', 'Maturity table each quarter'],
      ['Trivandrum and Hyderabad open on time and break even within a year', 'Medium', 'Opening dates, emerging-unit margin'],
      ['A clean first merged balance sheet (minorities, debt, goodwill as expected)', 'Medium', 'Q2FY27 accounts'],
      ['A price nearer ₹610 (15% below our target)', '–', 'Valuation discipline'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['Integration slips: doctor exits, culture clash between Aster and CARE/KIMSHEALTH teams', 'Medium', 'Growth back to ~12%; bear case {{scen.bear.tp|inr}}'],
      ['Drug and consumable price caps after the Supreme Court remarks', 'Medium', 'Pharmacy is part of every in-patient bill; a few points of margin at risk'],
      ['QCIL\'s audited numbers weaker than the pro-forma (interest, minorities, one-offs)', 'Medium', 'EPS 5-15% lower than we model'],
      ['Share overhang from Blackstone (~31%) and TPG (~3%)', 'High', 'Caps the multiple; block deals at discounts'],
      ['Competition in Bengaluru, Hyderabad and Kerala', 'Medium', 'Slower ramp-ups; more capex per bed'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**We would turn buyers below ~₹${n0(buyBelow)}** and sellers above ~₹${n0(sellAbove)} on today's numbers, and raise the multiple only once synergies show up in reported margins.`,
      `**Biggest swing factor:** margin. Each 1pp on Sep-28E revenue (₹${n0((F.sales[1] + F.sales[2]) / 2)} cr) is ~₹${n0((F.sales[1] + F.sales[2]) / 200)} cr of EBITDA, or ~₹${n0((F.sales[1] + F.sales[2]) / 200 * (1 - MIN) * evAttrMult / F.shares)} a share at our multiple.`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Beds, Jun-2026 → plan', v: '10,898 → 15,077', d: '53% brownfield' },
      { k: 'Q1FY27 pro-forma growth', v: '+20% / +30%', d: 'revenue / operating EBITDA' },
      { k: 'Margin target', v: '24-25%', d: 'FY28-29; Q1FY27 22.2%' },
      { k: 'Forward EV/EBITDA (after minorities)', v: `${n1(evNowAttr)}x`, d: `median since the deal ${n1(HEV.med)}x` },
      { k: 'Target', v: `₹${n0(V.tp)}`, d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

module.exports = { street, valuation, risks };
