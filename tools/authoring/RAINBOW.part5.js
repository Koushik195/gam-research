// Rainbow report, part 5: street view, valuation (EV/EBITDA primary on the post-Ind AS basis), risks & honest summary.
const X = require('./RAINBOW.ctx');
const { streetBlocks } = require('./valuation-blend');
const { ruleText } = require('../../src/ratings');
const { D, F, V, A, AS, n0, n1, pc, ASOF_TXT, price, mcap, mv, evMult, ebitdaSep28, peMult, epsSep28, treasurySep28, evTarget, HEV, HEVy, evNow, evNow27, troughEv, FM, fwdEv, fwdPe, peNow,
  PEERS, P, drEv, drPe, CORE, LEFT_OUT, sectorDrEv, sectorDrPe, allDrEv, evAfter, peAfter, shortName, rating, buyBelow, sellAbove, ST, pl, isec, ar, avgPost, plPost, ourPreFy28, ourPostFy28,
  LEASE, RENT, preEbitda, netDebtLeases, epsCagrFwd, ebitdaCagrFwd, ebitdaCagrHist, shortDate, b, Q1 } = X;

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: 'The street: all Buy, targets ₹1,750-1,900 after Q1, all on EV/EBITDA FY28E',
  blocks: [
    { p: `Three houses published after the Q1FY27 results, all Buy: Prabhudas Lilladher ₹1,900 (28x pre-Ind AS FY28E EBITDA, raised from ₹1,700), ICICI Securities ₹1,860 (25x FY28E EBITDA of ₹723 cr) and Anand Rathi ₹1,750 (22x FY28E EV/EBITDA), an average of ~₹${n0(avgPost)}. Older calls standing include Geojit (Buy ₹1,679, May-2026) and Axis Securities (Buy ₹1,625, last dated Nov-2025). The stock was ~₹1,550-1,580 when those notes came out and fell ~15% to ₹${n0(price)} by 30-Sep-2026, so the street saw 33-45% upside at the as-of date. Bulls argue the expansion cycle is over and new beds will now fill (PL: 22% EBITDA CAGR FY26-28E); the main debate is how fast occupancy and margins recover. We found no consensus dated before 30-Sep-2026 and no Sell or Hold call.` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who'], wide: [0], rows: D.critiques, source: 'Broker notes, earnings calls, SRS and filings to 30-Sep-2026' } },
  ],
};

const drTxt = (s, m) => `${shortName(s)} ${pc(m[s])}`;
const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${evMult}x Sep-28E EBITDA gives {{dcf.tp|inr}}`,
  blocks: [
    ...streetBlocks('RAINBOW', {
      rating, noOurEps: true,
      streetIntro: 'Every post-Q1 note with a disclosed method values Rainbow on **EV/EBITDA on FY28E**: Prabhudas Lilladher 28x pre-Ind AS EBITDA, ICICI Securities 25x and Anand Rathi 22x (basis not stated). We use the same method, applied to the EBITDA the market will look at in September 2027 (Sep-28E: half FY28E, half FY29E). One difference matters: we use **post-Ind AS EBITDA with lease liabilities counted as debt** (the basis of the model and of Screener\'s history), while PL uses pre-Ind AS EBITDA with leases left out of debt. Both are internally consistent; mixing them is not. The translation table below puts the street\'s multiples on our basis.',
      street: ST.map(s => [`${s.broker} (${shortDate(s.date)})`, s.rating, s.tp, s.method || 'n.d.', s.multiple || '–', s.on || '–', X.rup(s.thesis)]),
      ourThesis: 'Strong franchise; occupancy and margins must recover; cheap to own history',
      streetSource: 'PL note (PDF); ICICI Securities via DSIJ; Anand Rathi via Trendlyne and askfuzz.ai; Geojit via Trendlyne; Axis via Business Standard and Trendlyne. n.d. = method not disclosed',
      derivationIntro: 'We start from Rainbow\'s own one-year-forward EV/EBITDA since listing (May-2022), computed in our files on the same basis as the target (EV = market value + lease liabilities − cash, deposits and funds; EBITDA post-Ind AS), adjust for how far listed hospital peers had de-rated by 30-Sep-2026, and then check growth, peers and returns.',
      derivation: [
        ['1. Its own history', `One-year-forward EV/EBITDA since listing: median ${n1(HEV.med)}x (25th-75th percentile ${n1(HEV.p25)}-${n1(HEV.p75)}x; ${n1(HEV.min)}x after the weak 2022 listing, ${n1(HEV.max)}x peak in 2024); calendar medians 2023 ${n1(HEVy('2023').med)}x, 2024 ${n1(HEVy('2024').med)}x, 2025 ${n1(HEVy('2025').med)}x, 2026 ${n1(HEVy('2026').med)}x. Trough years left out: ${troughEv ? troughEv + ' points' : 'none (forward EBITDA never fell below half its prior three-year peak)'}. On ${ASOF_TXT}: ${n1(evNow)}x our FY28E, ${n1(evNow27)}x FY27E`, `Starting point: ${n1(HEV.med)}x`],
        ['2. Sector de-rating', `Trailing EV/EBITDA vs each stock's five-year median on ${ASOF_TXT}: ${CORE.map(s => drTxt(s, drEv)).join(', ')} (median ${pc(sectorDrEv)}); Rainbow itself ${pc(drEv.RAINBOW)}. Left out: ${LEFT_OUT.map(s => drTxt(s, drEv)).join(', ')} (new-hospital losses and the 2024 GCC demerger inflate their multiples); with them the median is ${pc(allDrEv)}`, `${n1(HEV.med)}x × ${(1 + sectorDrEv / 100).toFixed(3)} ≈ ${n1(evAfter)}x → **${evMult}x**`],
        ['3. Growth', `EBITDA grew ${Math.round(ebitdaCagrHist)}% a year in FY23-26; we forecast ~${Math.round(ebitdaCagrFwd)}% for FY26-29E, but it is bought with ~₹1,640 cr of capex and new leases over three years, mostly in new markets`, 'No premium, no further discount'],
        ['4. Peers', `Trailing EV/EBITDA on ${ASOF_TXT}: Narayana ${n1(P.NH.evEbitda)}x, Jupiter ${n1(P.JLHL.evEbitda)}x, Fortis ${n1(P.FORTIS.evEbitda)}x, Apollo ${n1(P.APOLLOHOSP.evEbitda)}x, Medanta ${n1(P.MEDANTA.evEbitda)}x, Max ${n1(P.MAXHEALTH.evEbitda)}x; Rainbow ${n1(P.RAINBOW.evEbitda)}x`, `${evMult}x Sep-28E = ${n1(ourPostFy28)}x our FY28E: at the low end, with Narayana and Jupiter`],
        ['5. Returns', `ROE ${n1(A.roe[b])}% (FY26) and company ROCE excl. cash 23.7% (26.0% in FY25) vs a ${n1(V.ke)}% cost of equity; returns fall in FY27-29E as capex doubles (our ROE {{F.roe.0|pct}} → {{F.roe.2|pct}})`, 'Supports a premium to the cost of capital, not a re-rating'],
        ['6. Street basis', `PL\'s 28x pre-Ind AS FY28E ≈ ${n1(plPost)}x on our basis; our ${evMult}x Sep-28E ≈ ${n1(ourPreFy28)}x pre-Ind AS FY28E (ICICI 25x, Anand Rathi 22x)`, 'Our multiple is below PL\'s, near ICICI\'s'],
      ],
      derivationSource: `Screener.in prices, balance sheets and multiples to ${ASOF_TXT}; AR FY24/FY26 (bank deposits); broker notes; GAM Research`,
      crossNote: `**What the cross-checks tell us.** P/E (${peMult}x Sep-28E EPS of ₹${n1(epsSep28)}) gives ₹${n0(mv('pe').value)}: ${peMult}x is Rainbow's ${n1(FM.median)}x forward P/E median since listing cut by the ${Math.abs(Math.round(sectorDrPe))}% P/E de-rating of the same six peers. It is a little below the EV/EBITDA value because interest on leases and depreciation of new hospitals weigh on earnings more than on EBITDA. The DCF (₹${n0(mv('dcf').value)}) is ${Math.abs(Math.round(mv('dcf').vsTarget))}% below the target and close to today's price: with capex plus new leases at ~19-23% of revenue to FY29E and 11% thereafter, cash flows at an ${n1(V.ke)}% cost of capital support the current price, not much more. The target relies on the market continuing to pay ~${evMult}x forward EBITDA for a growing hospital chain, which it has done since 2023 (it has rarely paid less than ${n1(HEV.p25)}x).`,
    }),
    { pair: [
      { type: 'line', title: `Forward EV/EBITDA since listing: our ${evMult}x vs history`, unit: 'EV (incl. lease liabilities) ÷ next full-year EBITDA, post-Ind AS (x)', x: fwdEv.map(x => x[0]), series: [{ name: 'Forward EV/EBITDA', values: fwdEv.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: HEV.med, text: `Median: ${n1(HEV.med)}x` }, { v: evMult, text: `Our target: ${evMult}x`, color: '#cf8f1f' }], source: 'Screener.in; AR FY24/FY26; GAM estimates for FY27-29E' },
      { type: 'line', title: `Forward P/E since listing: median ${n1(FM.median)}x, ${n1(peNow)}x now`, unit: 'Price ÷ next full-year EPS (x)', x: fwdPe.map(x => x[0]), series: [{ name: 'Forward P/E', values: fwdPe.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: FM.median, text: `Median: ${n1(FM.median)}x` }, { v: peMult, text: `Cross-check: ${peMult}x`, color: '#cf8f1f' }], source: 'Screener.in; GAM estimates (forwardMedian)' },
    ] },
    { exhibit: { type: 'table', title: 'From EV to target price (₹ crore unless stated)', head: ['', 'Base', 'Note'], wide: [2], rows: [
      ['Sep-28E EBITDA, post-Ind AS', n0(ebitdaSep28), 'Half FY28E ({{F.ebitda.1|num}}) + half FY29E ({{F.ebitda.2|num}})'],
      ['× target multiple', `${evMult}x`, 'Own forward median since listing, less sector de-rating'],
      ['= Enterprise value', n0(evTarget), 'Includes the value of leased hospitals'],
      ['Less: net debt incl. lease liabilities, Sep-28E', n0(-treasurySep28), `Lease liabilities ~₹${n0((LEASE.FY28E + LEASE.FY29E) / 2)} cr less cash and funds (model)`],
      ['= Equity value', n0(evTarget + treasurySep28), ''],
      { hl: true, cells: ['**÷ shares (cr) = target (rounded)**', `**${n1(F.shares)} → {{dcf.tp|inr}}**`, `vs CMP ₹${n0(price)}: {{dcf.upside|chg}}`] },
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Revenue growth +3pp a year, margin +1.5pp; ${V.blend.methods[0].multiple.bull}x (75th percentile since listing).`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Revenue +{{F.salesGrowth.0|pct}} / +{{F.salesGrowth.1|pct}} / +{{F.salesGrowth.2|pct}}; post-Ind AS margin {{F.ebitdaMargin.0|pct}} → {{F.ebitdaMargin.2|pct}}; ${evMult}x Sep-28E EBITDA.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Revenue growth −4pp a year, margin −2pp; ${V.blend.methods[0].multiple.bear}x (25th percentile since listing).`],
    ], source: 'GAM Research' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-42E free cash flow (capex incl. new leases)', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Add: net cash at Mar-27 (negative = net debt incl. lease liabilities)', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
      { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of capital down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Listed hospital peers (trailing, at the 30-Sep-2026 close)', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'EV/EBITDA (x)', 'vs 5-yr median', 'P/E (x)', 'ROE'], rows: PEERS.map(p => [p.symbol === 'RAINBOW' ? '**Rainbow**' : shortName(p.symbol), n0(p.mcapCr), n0(p.revenue), p.ebitdaMargin + '%', n1(p.evEbitda), pc(drEv[p.symbol]), n1(p.pe), p.roe + '%']), source: `Screener.in (post-Ind AS EBITDA; EV includes lease liabilities), multiples scaled to the NSE close on ${ASOF_TXT}. No listed peer focuses on mothers and children; Cloudnine is unlisted.` } },
  ],
};

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: 'Our honest summary: buy the franchise at a discount, knowing the expansion must work',
  blocks: [
    { callout: `**What you are buying:** India's leading children's-hospital network, with a hard-to-copy clinical model, ~32% post-Ind AS EBITDA margins, no bank debt, a founder who owns half the company, and a plan to double beds that the balance sheet can fund.` },
    { callout: `**What you are paying:** ${n1(evNow)}x our FY28E EV/EBITDA and ${n1(peNow)}x FY28E EPS, below Rainbow's own history (${n1(HEV.med)}x and ${n1(FM.median)}x forward medians since listing) for ~${Math.round(ebitdaCagrFwd)}% EBITDA growth. On the street's method and our inputs the target is {{dcf.tp|inr}} ({{dcf.upside|chg}}): a ${rating}. The DCF (₹${n0(mv('dcf').value)}) is the warning: if the new beds fill slowly, the stock is worth about what it costs today.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      ['Occupancy back above 50% for the year with the new beds open', 'Medium', 'Quarterly occupancy, mature vs new'],
      ['Pre-Ind AS margin above 25% in FY27 despite openings', 'Medium', 'Margin vs the 24-25% guidance; new-unit breakeven'],
      ['Gurugram and Mumbai open on time with high-acuity mix', 'Medium', 'Opening dates, ARPOB at new units'],
      ['A normal-to-strong infection season', 'Medium', 'Q2-Q3 occupancy'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['New markets ramp slowly (Mumbai, Pune, Indore, Gurugram) and keep group occupancy near 41-46%', 'Medium', 'Margins near 28% post-Ind AS; bear case {{scen.bear.tp|inr}}'],
      ['Another weak season', 'Medium', 'FY27 growth nearer 15% than 22%'],
      ['Doctor attrition or cost inflation in premium metros', 'Medium', 'Doctor fees already 26% of revenue in Q1FY27'],
      ['Government-scheme patients or price caps', 'Low-medium', 'Higher occupancy at lower ARPOB'],
      ['A large acquisition or debt-funded expansion', 'Low', 'Cash ~₹600 cr; management says capex is internally funded'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**We would stay buyers below ~₹${n0(buyBelow)}** and turn sellers above ~₹${n0(sellAbove)} on today's numbers; we would cut the multiple if occupancy at the new hospitals stops rising.`,
      '**Biggest swing factor:** occupancy. Each 1pp on the existing network is ~₹45 cr of revenue and, at incremental margins, ~₹25-30 cr of EBITDA (~₹50-60 a share at our multiple).',
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Occupancy, Q1FY27', v: `${Q1.occupancyPct}%`, d: 'target 56-58%; FY23 55%' },
      { k: 'Beds, Jun-2026 → plan', v: '2,435 → ~5,000', d: '~₹2,200 cr over five years' },
      { k: 'ARPOB, Q1FY27', v: `₹${n0(Q1.arpob)}`, d: '+6% YoY; mature ₹70,662' },
      { k: 'Forward EV/EBITDA', v: `${n1(evNow)}x`, d: `median since listing ${n1(HEV.med)}x` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

module.exports = { street, valuation, risks };
