// Medanta report, part 5: street view, valuation (EV/EBITDA primary, post-Ind AS EBITDA with leases in net debt), risks & honest summary.
const X = require('./MEDANTA.ctx');
const { streetBlocks } = require('./valuation-blend');
const { ruleText } = require('../../src/ratings');
const { D, F, V, A, n0, n1, pc, ASOF_TXT, price, mv, evMult, ebitdaSep28, peMult, epsSep28, treasurySep28, evTarget, HEV, HEVy, evNow, evNow27, troughEv, FM, fwdEv, fwdPe, peNow,
  PEERS, P, drEv, CORE, LEFT_OUT, sectorDrEv, sectorDrPe, allDrEv, evAfter, shortName, rating, buyBelow, sellAbove, ST, pl, avgPost, plOurBasis, ourExLease, leaseSep28,
  ebitdaCagrFwd, ebitdaCagrHist, shortDate, b, Q1, SC } = X;

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: 'The street: Buy or Add everywhere, targets ₹1,550-1,750 after Q1, all on 27-28x EV/EBITDA',
  blocks: [
    { p: `Four houses published after the Q1FY27 results: Prabhudas Lilladher Buy ₹1,750 (28x Sep-28E EV/EBITDA; raised from ₹1,600 on 1-Aug and ₹1,450 at initiation), Motilal Oswal Buy ₹1,670 (28x 12-month forward), Anand Rathi Buy ₹1,550 (28x FY28E, up from 26x) and Choice Add ₹1,550 (27x FY28E; downgraded from Buy on valuation), an average of ~₹${n0(avgPost)}. Earlier calls: Antique initiated at Buy ₹1,520 (27x FY28E) on 29-Jun-2026 and JM Financial had Buy ₹1,382 (25x FY28E) in Mar-2026. The stock was ~₹1,406-1,414 when the post-Q1 notes came out and ₹${n0(price)} on 30-Sep-2026, so the street saw ~${Math.round((avgPost / price - 1) * 100)}% upside. Bulls argue Noida breaks even early, Lucknow and Patna keep compounding and the balance sheet funds a doubling of beds (PL: EBITDA ~24% a year FY26-29E). Almost all of the debate is about the multiple: every house has raised it this year. We found no Sell or Hold call and no consensus dated before 30-Sep-2026.` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who'], wide: [0], rows: D.critiques, source: 'Broker notes, earnings calls and filings to 30-Sep-2026' } },
  ],
};

const drTxt = (s, m) => `${shortName(s)} ${pc(m[s])}`;
const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${evMult}x Sep-28E EBITDA gives {{dcf.tp|inr}}; the street pays 27-28x`,
  blocks: [
    ...streetBlocks('MEDANTA', {
      rating, noOurEps: true,
      streetIntro: 'Every note we found values Medanta on **EV/EBITDA on FY28E or Sep-28E**, at 25-28x. We use the same method, applied to the EBITDA the market will look at in September 2027 (Sep-28E: half FY28E, half FY29E). Two basis points matter. (1) EBITDA: we use Screener\'s basis (after ESOP cost, before other income, post-Ind AS 116), which is what PL and Choice use (₹919-930 cr in FY26), not the company\'s ₹1,056 cr (before ESOP, including other income). (2) Leases: we count lease liabilities as debt, as we must when rent is left out of EBITDA; PL leaves them out of EV. Leases are small for Medanta (~₹600 cr), so the translation is under half a turn of EBITDA.',
      street: ST.map(s => [`${s.broker} (${shortDate(s.date)})`, s.rating, s.tp, s.method || 'n.d.', s.multiple || '–', s.on || '–', X.rup(s.thesis)]),
      ourThesis: 'Excellent franchise at a full price; FY29 air pocket before the greenfields',
      streetSource: 'PL notes (PDF); Choice (PDF); Motilal Oswal and Anand Rathi via DSIJ; Antique via Business Today; JM Financial via Business Standard',
      derivationIntro: 'We start from Medanta\'s own one-year-forward EV/EBITDA since listing (Nov-2022), computed in our files on the same basis as the target (EV = market value + bank debt + lease liabilities − cash, deposits and investments; EBITDA after ESOP, before other income), adjust for how far listed hospital peers had de-rated by 30-Sep-2026, and then check growth, peers and returns.',
      derivation: [
        ['1. Its own history', `One-year-forward EV/EBITDA since listing: median ${n1(HEV.med)}x (25th-75th percentile ${n1(HEV.p25)}-${n1(HEV.p75)}x; ${n1(HEV.min)}x at listing, ${n1(HEV.max)}x peak in 2024); calendar medians 2023 ${n1(HEVy('2023').med)}x, 2024 ${n1(HEVy('2024').med)}x, 2025 ${n1(HEVy('2025').med)}x, 2026 ${n1(HEVy('2026').med)}x. Trough years left out: ${troughEv ? troughEv + ' points' : 'none (forward EBITDA never fell below half its prior three-year peak)'}. On ${ASOF_TXT}: ${n1(evNow)}x our FY28E, ${n1(evNow27)}x FY27E`, `Starting point: ${n1(HEV.med)}x`],
        ['2. Sector de-rating', `Trailing EV/EBITDA vs each stock's five-year median on ${ASOF_TXT}: ${CORE.map(s => drTxt(s, drEv)).join(', ')} (median ${pc(sectorDrEv)}); Medanta itself ${pc(drEv.MEDANTA)} (its trailing multiple is inflated by Noida's FY26 loss). Left out: ${LEFT_OUT.map(s => drTxt(s, drEv)).join(', ')} (new-hospital losses and the 2024 GCC demerger inflate their multiples); with them the median is ${pc(allDrEv)}`, `${n1(HEV.med)}x × ${(1 + sectorDrEv / 100).toFixed(3)} ≈ ${n1(evAfter)}x → **${evMult}x**`],
        ['3. Growth', `EBITDA grew ${Math.round(ebitdaCagrHist)}% a year in FY23-26; we forecast ~${Math.round(ebitdaCagrFwd)}% for FY26-29E, but most of it is Noida swinging from a ₹78 cr loss to profit, growth slows to ~10% in FY29E, and ~₹3,650 cr of capex goes in before the greenfields earn`, 'No premium, no further discount'],
        ['4. Peers', `Trailing EV/EBITDA on ${ASOF_TXT}: Narayana ${n1(P.NH.evEbitda)}x, Jupiter ${n1(P.JLHL.evEbitda)}x, Rainbow ${n1(P.RAINBOW.evEbitda)}x, Fortis ${n1(P.FORTIS.evEbitda)}x, Apollo ${n1(P.APOLLOHOSP.evEbitda)}x, Max ${n1(P.MAXHEALTH.evEbitda)}x; Medanta ${n1(P.MEDANTA.evEbitda)}x`, `${evMult}x Sep-28E = ${n1(evTarget / F.ebitda[1])}x our FY28E: between Rainbow/Narayana and Fortis/Apollo`],
        ['5. Returns', `ROE ${n1(A.roe[b])}% (FY26); company ROCE 14.9% consolidated, 21.3% excluding Noida and projects, vs an ${n1(V.ke)}% cost of equity; our ROE {{F.roe.0|pct}} → {{F.roe.2|pct}} as capital goes in ahead of the greenfields`, 'Supports a premium to book, not a re-rating'],
        ['6. Street basis', `PL's 28x Sep-28E (EV without leases) ≈ ${n1(plOurBasis)}x on our basis; our ${evMult}x ≈ ${n1(ourExLease)}x on PL's basis (Choice and Antique 27x, JM 25x)`, 'Our multiple is ~5-6 turns below the street\'s'],
      ],
      derivationSource: `Screener.in prices, balance sheets and multiples to ${ASOF_TXT}; Q4FY26 presentation (company cash and debt); broker notes; GAM Research`,
      crossNote: `**What the cross-checks tell us.** P/E (${peMult}x Sep-28E EPS of ₹${n1(epsSep28)}) gives ₹${n0(mv('pe').value)}: ${peMult}x is Medanta's ${n1(FM.median)}x forward P/E median since listing cut by the ${Math.abs(Math.round(sectorDrPe))}% P/E de-rating of the same six peers, so earnings and EBITDA agree. The DCF (₹${n0(mv('dcf').value)}) is ${Math.abs(Math.round(mv('dcf').vsTarget))}% below the target: with capex at ~20% of revenue to FY29E, growth averaging ~9% after FY29E and margins reaching 25% by FY42E, cash flows at an ${n1(V.ke)}% cost of capital support well under half of today's price. To justify ₹${n0(price)} on cash flows you need margins near 30% or a cost of capital near 9%. Like the street's targets, ours rests on the market continuing to pay well over 20x forward EBITDA for scarce, growing hospital franchises, which it has done since 2023 (it has rarely paid less than ${n1(HEV.p25)}x).`,
    }),
    { pair: [
      { type: 'line', title: `Forward EV/EBITDA since listing: our ${evMult}x vs history`, unit: 'EV (incl. lease liabilities) ÷ next full-year EBITDA, after ESOP (x)', x: fwdEv.map(x => x[0]), series: [{ name: 'Forward EV/EBITDA', values: fwdEv.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: HEV.med, text: `Median: ${n1(HEV.med)}x` }, { v: evMult, text: `Our target: ${evMult}x`, color: '#cf8f1f' }], source: 'Screener.in; Q4FY26 presentation (company cash); GAM estimates for FY27-29E' },
      { type: 'line', title: `Forward P/E since listing: median ${n1(FM.median)}x, ${n1(peNow)}x our FY28E now`, unit: 'Price ÷ next full-year EPS (x)', x: fwdPe.map(x => x[0]), series: [{ name: 'Forward P/E', values: fwdPe.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: FM.median, text: `Median: ${n1(FM.median)}x` }, { v: peMult, text: `Cross-check: ${peMult}x`, color: '#cf8f1f' }], source: 'Screener.in; GAM estimates (forwardMedian)' },
    ] },
    { exhibit: { type: 'table', title: 'From EV to target price (₹ crore unless stated)', head: ['', 'Base', 'Note'], wide: [2], rows: [
      ['Sep-28E EBITDA (after ESOP, ex other income)', n0(ebitdaSep28), 'Half FY28E ({{F.ebitda.1|num}}) + half FY29E ({{F.ebitda.2|num}})'],
      ['× target multiple', `${evMult}x`, 'Own forward median since listing, less sector de-rating'],
      ['= Enterprise value', n0(evTarget), 'Includes leased assets'],
      ['Less: net debt incl. lease liabilities, Sep-28E', n0(-treasurySep28), `Bank debt and ~₹${n0(leaseSep28)} cr of leases less cash (model)`],
      ['= Equity value', n0(evTarget + treasurySep28), 'Minorities (DLF\'s half of the South Delhi company) not deducted: book value ₹23 cr'],
      { hl: true, cells: ['**÷ shares (cr) = target (rounded)**', `**${n1(F.shares)} → {{dcf.tp|inr}}**`, `vs CMP ₹${n0(price)}: {{dcf.upside|chg}}`] },
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Revenue growth +3pp a year, margin +1.5pp; ${V.blend.methods[0].multiple.bull}x (75th percentile since listing, close to the street).`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Revenue +{{F.salesGrowth.0|pct}} / +{{F.salesGrowth.1|pct}} / +{{F.salesGrowth.2|pct}}; margin {{F.ebitdaMargin.0|pct}} → {{F.ebitdaMargin.2|pct}}; ${evMult}x Sep-28E EBITDA.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Revenue growth −4pp a year, margin −2pp; ${V.blend.methods[0].multiple.bear}x (25th percentile since listing).`],
    ], source: 'GAM Research' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-42E free cash flow (capex incl. new leases)', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Add: net cash at Mar-27 (after bank debt and lease liabilities)', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
      { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of capital down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Listed hospital peers (trailing, at the 30-Sep-2026 close)', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'EV/EBITDA (x)', 'vs 5-yr median', 'P/E (x)', 'ROE'], rows: PEERS.map(p => [p.symbol === 'MEDANTA' ? '**Medanta**' : shortName(p.symbol), n0(p.mcapCr), n0(p.revenue), p.ebitdaMargin + '%', n1(p.evEbitda), pc(drEv[p.symbol]), n1(p.pe), p.roe + '%']), source: `Screener.in (post-Ind AS EBITDA; EV includes lease liabilities), multiples scaled to the NSE close on ${ASOF_TXT}. Medanta's five-year median runs from its Nov-2022 listing.` } },
  ],
};

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: 'Our honest summary: a franchise worth owning, at a price that already assumes the plan works',
  blocks: [
    { callout: '**What you are buying:** one of India\'s best hospital brands, run by its founder-surgeon and a professional CEO, with a proven record of filling greenfield hospitals in under-served cities, Noida about to turn profitable, net cash before leases, and a plan to nearly double beds that the balance sheet can fund.' },
    { callout: `**What you are paying:** ${n1(evNow)}x our FY28E EV/EBITDA and ${n1(peNow)}x FY28E EPS, close to Medanta's own forward medians since listing (${n1(HEV.med)}x and ${n1(FM.median)}x) at a time when listed hospital peers trade ~${Math.round(-sectorDrEv)}% below theirs. On the street's method and our inputs the target is {{dcf.tp|inr}} ({{dcf.upside|chg}}): a ${rating}. The street's 27-28x needs the FY30+ greenfields to be priced in today; the DCF (₹${n0(mv('dcf').value)}) says cash flows alone do not support the price.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      ['Noida above 10% EBITDA margin within FY28', 'Medium', 'Quarterly Noida income and EBITDA'],
      ['Tariff increases in Lucknow and Patna without losing volume', 'Medium', 'Cluster 2 ARPOB and in-patient growth'],
      ['Mumbai and Pitampura approvals, keeping greenfields on a 2029-30 timeline', 'Medium', 'Project updates each quarter'],
      ['A pull-back to below ~₹' + n0(buyBelow), 'Medium', 'Price (BUY level on our numbers)'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['Greenfield delays or cost overruns (five greenfields, ₹3,300 cr+ left; three in Delhi and Mumbai)', 'Medium', 'Capex without EBITDA for longer; bear case {{scen.bear.tp|inr}}'],
      ['Noida stalls near breakeven against NCR competition', 'Medium', 'Each ₹50 cr of EBITDA is ~₹42 a share at our multiple'],
      ['Gurugram growth slows to mid-single digits', 'Medium', 'Cluster 1 is 63% of income'],
      ['EPCG grant income fades faster', 'Medium', '₹56 cr in FY26 vs ₹30 cr assumed in FY27E'],
      ['Price controls (CGHS, procedure caps) or insurer pressure', 'Low-medium', 'Cardiac and cancer-heavy mix'],
      ['Block sales by Temasek or the co-founder', 'Medium', '~25% of shares held by the two; thin free float'],
      ['Key-person risk around the founder', 'Low', 'Brand and referrals built around Dr Trehan'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**We would turn buyers below ~₹${n0(buyBelow)}** and sellers above ~₹${n0(sellAbove)} on today's numbers: the stock sits at the top of our HOLD band.`,
      '**Biggest swing factor:** the multiple, not the estimates. Our EBITDA is close to the street\'s; each 1x of Sep-28E EV/EBITDA is ~₹58 a share.',
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Beds, Jun-2026 → plan', v: '3,737 → ~7,105', d: '₹4,858 cr of capex left' },
      { k: 'Noida EBITDA, Q1FY27', v: '−₹4.9 cr', d: 'from −₹32 cr in Q3FY26' },
      { k: 'Lucknow + Patna margin', v: '32%', d: 'Q1FY27, company basis' },
      { k: 'Forward EV/EBITDA', v: `${n1(evNow)}x`, d: `median since listing ${n1(HEV.med)}x` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

module.exports = { street, valuation, risks };
