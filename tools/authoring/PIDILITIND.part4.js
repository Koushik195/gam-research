// Pidilite report, part 4: street view, valuation, risks & honest summary, glossary, statement notes.
const X = require('./PIDILITIND.ctx');
const { streetBlocks } = require('./valuation-blend');
const { ruleText } = require('../../src/ratings');
const { D, F, V, A, n0, n1, pc, ASOF_TXT, price, mv, epsSep28, peMult, evMult, H21, H16, H2y, fwdNow, evMed, ttmEbitda, ebitdaSep28, P, derate, OTHERS, sectorDr, afterDerate, shortName, rating, buyBelow, sellAbove, ST, CONS, postQ1, avgPost, shortDate, epsCagrHist, epsCagrFwd, b, PEERS, A26, segM } = X;

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: 'The street: mostly positive, with targets bunched around ₹1,700-1,900',
  blocks: [
    { p: `Four houses published after Q1FY27 (Aug-Sep 2026): Prabhudas Lilladher Accumulate ₹1,739 (downgraded from Buy), Motilal Oswal Neutral ₹1,700, Jefferies Hold ₹1,730 and Axis Capital Buy ₹1,800, an average of ~₹${n0(avgPost)}. In July HSBC initiated at Buy (₹1,890) and Macquarie kept Sell (₹1,350). Older calls from May still standing include Goldman Sachs Buy ₹1,700 and BofA Underperform ₹1,475. A consensus of ${CONS.analysts} analysts on ${shortDate(CONS.date)} had an average target of ₹${n0(CONS.avgTp)} (range ₹${n0(CONS.lowTp)}-${n0(CONS.highTp)}) and FY27E EPS of ₹${n1(CONS.epsFY27E)}, up from ₹${n1(CONS.epsFY27EPre)} before the results. The two notes with a method both use **50x P/E** on FY28E or Jun-28E earnings. Bulls focus on volume acceleration and growth categories; bears and neutrals on peak margins and valuation.` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who'], wide: [0], rows: D.critiques, source: 'Broker notes, earnings calls, CRISIL and filings to 30-Sep-2026' } },
  ],
};

const drTxt = s => `${shortName(s)} ${pc(derate[s])}`;
const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${peMult}x Sep-28E earnings gives {{dcf.tp|inr}}`,
  blocks: [
    ...streetBlocks('PIDILITIND', {
      rating,
      streetIntro: 'The brokers that disclose a method value Pidilite on **P/E**: Motilal Oswal 50x FY28E EPS and Prabhudas Lilladher 50x Jun-28E EPS (it moved from a DCF in August). We use the same method so our target is comparable, applied to the earnings the market will look at in September 2027 (Sep-28E: half FY28E, half FY29E). The "At our EPS" column applies each broker\'s multiple to our EPS for its year: the gap to the street is split between our lower FY28 earnings and our lower multiple.',
      street: ST.map(s => [`${s.broker} (${shortDate(s.date)})`, s.rating, s.tp, s.method || 'n.d.', s.multiple || '–', s.on || '–', X.rup(s.thesis)]),
      ourThesis: 'Great franchise; FY27 growth is price; fair value near the price',
      streetSource: 'PL note (PDF); MOSL via DSIJ; Jefferies, Axis Capital, Macquarie via Investing.com; HSBC via MarketScreener; Goldman Sachs and BofA via ScanX; Geojit and FundsIndia via Trendlyne. n.d. = method not disclosed in the sources we saw',
      derivationIntro: 'We start from the stock\'s own one-year-forward P/E since April 2021, adjust for how far comparable consumer and building-material stocks had de-rated by 30-Sep-2026, and then check growth, peers and returns.',
      derivation: [
        ['1. Its own history', `One-year-forward P/E: median ${n1(H21.med)}x since Apr-2021 (25th-75th percentile ${n1(H21.p25)}-${n1(H21.p75)}x; peak ${Math.round(H21.max)}x in 2021); ${n1(H16.med)}x since 2016; ${n1(H2y.med)}x over the last two years; ${n1(fwdNow)}x on 30-Sep-2026 on our FY28E`, `Starting point: ${Math.round(H21.med)}x`],
        ['2. Sector de-rating', `On ${ASOF_TXT} six comparable stocks traded below their five-year median P/E: ${OTHERS.map(drTxt).join(', ')} (median ${pc(sectorDr)}); Pidilite itself ${pc(derate.PIDILITIND)}`, `${Math.round(H21.med)}x × ${(1 + sectorDr / 100).toFixed(2)} ≈ ${n1(afterDerate)}x`],
        ['3. Growth', `EPS grew ${Math.round(epsCagrHist)}% a year in FY21-26; we forecast ~${Math.round(epsCagrFwd)}% for FY26-29E, with FY27 helped by price and margins already near the top of the corridor`, `A further ~4% discount: **${peMult}x**`],
        ['4. Peers', `Trailing P/E: Asian Paints ${n1(P.ASIANPAINT.pe)}x, Berger ${n1(P.BERGEPAINT.pe)}x, Hindustan Unilever ${n1(P.HINDUNILVR.pe)}x, Astral ${n1(P.ASTRAL.pe)}x, Titan ${n1(P.TITAN.pe)}x; Pidilite ${n1(P.PIDILITIND.pe)}x`, `${peMult}x Sep-28E = ${n1(peMult * epsSep28 / F.eps[1])}x our FY28E: a premium to paints and HUL, below Astral and Titan`],
        ['5. Returns', `ROE ${n1(A.roe[b])}% and ROCE ~31% in FY26 against an ${n1(V.ke)}% cost of equity`, 'Supports a premium to the market, not a re-rating'],
        ['6. What the price implies', `${n1(price / epsSep28)}x Sep-28E EPS. A DCF only reaches ~₹${n0(V.sens.grid[0][4])} even with a ${n1(V.sens.waccs[0])}% cost of capital and ${n1(V.sens.gs[4])}% terminal growth`, 'The price already assumes very long, high growth'],
      ],
      derivationSource: `Screener.in (P/E history to ${ASOF_TXT}), broker notes, GAM Research`,
      history: { field: 'eps', from: '2016-04-01', median: Math.round(H21.med), label: `Median since 2021: ${Math.round(H21.med)}x`, title: `One-year-forward P/E: our ${peMult}x vs history`, yearStep: 2 },
      crossNote: `**What the cross-checks tell us.** EV/EBITDA (${evMult}x Sep-28E EBITDA of ₹${n0(ebitdaSep28)} cr plus net cash) gives ₹${n0(mv('ev').value)}, in line with the P/E target: ${evMult}x comes from Pidilite's ${n1(evMed)}x median trailing EV/EBITDA since 2021, cut by the same sector de-rating and restated for Sep-28E EBITDA being ${Math.round((ebitdaSep28 / ttmEbitda - 1) * 100)}% above the twelve months to Jun-26 (₹${n0(ttmEbitda)} cr). The DCF (₹${n0(mv('dcf').value)}) is far lower. At an ${n1(V.ke)}% cost of equity and 6% terminal growth, even revenue growth fading only slowly from ~12% to 9% over 15 years supports ~60% of today's price. Pidilite has always looked expensive on a DCF; the multiple reflects how rare and durable its growth has been. But it means the stock needs growth to stay high for very long just to earn its cost of capital.`,
    }),
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Multiple ${V.blend.methods[0].multiple.bull}x (its 25th-percentile forward P/E since 2021).`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `C&B {{as.segments.0.growth.0|chg}} / +11% / +12%, B2B {{as.segments.1.growth.0|chg}} / +10% / +11% (FY27-29E); EBITDA margin {{F.ebitdaMargin.0|pct}} → {{F.ebitdaMargin.2|pct}}; ${peMult}x Sep-28E EPS.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Multiple ${V.blend.methods[0].multiple.bear}x (its 10th-percentile forward P/E since 2016).`],
    ], source: 'GAM Research' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-42E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Add: net cash at Mar-27', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
      { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of capital down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Listed peers: building materials and consumer compounders', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', 'vs 5-yr median P/E', 'EV/EBITDA (x)', 'ROE'], rows: PEERS.map(p => [p.symbol === 'PIDILITIND' ? '**Pidilite**' : shortName(p.symbol), n0(p.mcapCr), n0(p.revenue), p.ebitdaMargin + '%', n1(p.pe), pc(derate[p.symbol]), n1(p.evEbitda), p.roe + '%']), source: `Screener.in, trailing multiples at the NSE close on ${ASOF_TXT}` } },
  ],
};

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: 'Our honest summary: buy the franchise on weakness, not at 46x FY28E',
  blocks: [
    { callout: `**What you are buying:** India's dominant adhesives brand and the leader in waterproofing and tile adhesives, with a distribution reach rivals cannot easily copy, volume growth of 10%+ a year, a ${n1(A.roe[b])}% ROE, net cash of ~₹4,200 cr and a professional management team.` },
    { callout: `**What you are paying:** ${n1(price / F.eps[0])}x our FY27E and ${n1(price / F.eps[1])}x FY28E EPS, for ~${Math.round(epsCagrFwd)}% EPS growth that includes a one-off price boost in FY27 and margins at the top of the company's own range. On the street's method and our inputs the target is {{dcf.tp|inr}} ({{dcf.upside|chg}}): a HOLD.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      [`Price below ~₹${n0(buyBelow)} (BUY on our rule)`, 'Medium', 'Share price around the Q2FY27 results'],
      ['UVG holds at 11%+ after prices stop rising, without heavy rebates', 'Medium', 'UVG and gross margin each quarter'],
      ['Margins hold near 24% as VAM falls (price kept)', 'Medium', 'Gross margin vs VAM; rebate commentary'],
      ['A pioneer category (electronics, Unofin, paints) reaches scale', 'Low', 'Management disclosure of ₹100 cr+ categories'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['A renewed VAM/crude spike from the West Asia conflict', 'Medium', 'Margins back toward 20-21%; EPS 10-15% below our estimate'],
      ['Price give-backs faster than input relief; demand compression from industry-wide price rises', 'Medium', 'FY27-28 revenue growth in single digits'],
      ['New entrants take share in tile adhesives and waterproofing', 'Medium', 'Growth categories slow to 1-2x GDP'],
      ['A large, diversifying acquisition with the cash', 'Low', 'Lower returns; CRISIL\'s downgrade trigger is gearing above 0.3x'],
      ['De-rating of consumer stocks continues', 'Medium', 'At 40x Sep-28E (bear multiple) on our EPS the stock is worth ~₹1,350'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**We would turn buyers below ~₹${n0(buyBelow)}** and sellers above ~₹${n0(sellAbove)} on today's numbers, or sooner if FY28 earnings visibility improves (UVG 11%+ with margins near 24% after price laps).`,
      '**Biggest swing factor:** the gross margin. Each 1pp of EBITDA margin is ~4% of our EPS; the width of the 20-24% corridor is worth ~₹260 a share at our multiple.',
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Underlying volume growth, FY26', v: '11.1%', d: 'Q1FY27 11.3%, C&B 12.2%' },
      { k: 'Q1FY27 revenue growth', v: '+21%', d: 'about half price' },
      { k: 'C&B segment EBITDA margin, FY26', v: `${n1(segM(A26, 'cb'))}%`, d: '23.4% in FY23' },
      { k: 'Price ÷ our FY28E EPS', v: `${n1(price / F.eps[1])}x`, d: `median since 2021: ${Math.round(H21.med)}x (forward)` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['C&B (Consumer & Bazaar)', 'Pidilite\'s branded products sold to households and, through dealers ("bazaar"), to tradesmen such as carpenters, plumbers and masons.'],
      ['B2B (Business to Business)', 'Industrial adhesives, resins, project construction chemicals and pigments sold to other companies.'],
      ['UVG (underlying volume growth)', 'Pidilite\'s measure of growth at constant prices, including product mix. Tonnage growth is higher, because cheaper products (e.g. tile adhesives) grow faster.'],
      ['VAM (vinyl acetate monomer)', 'A petrochemical used to make the polymer in white glue (Fevicol); under 10% of Pidilite\'s raw materials in FY26 but the most volatile.'],
      ['Gross margin', 'Revenue less raw-material cost, as % of revenue.'],
      ['EBITDA / segment EBITDA', 'Operating profit before depreciation, interest and tax. Segment EBITDA here = the segment result reported by the company plus the depreciation it allocates to that segment.'],
      ['A&SP', 'Advertising and sales promotion spending.'],
      ['Core / growth / pioneer', 'Management\'s portfolio buckets: established brands (1-2x GDP growth), emerging categories (2-4x GDP) and new bets (target ₹100 cr revenue in three years).'],
      ['Rurban', 'Rural and very small towns.'],
      ['Bonus issue', 'Free shares to existing holders (1:1 in Sep-2025): the share count doubles and the price halves; nothing else changes.'],
      ['P/E, EV/EBITDA', 'Share price ÷ earnings per share; enterprise value (market value less net cash) ÷ EBITDA.'],
      ['Sep-28E', 'Half of FY28E plus half of FY29E: the 12-month-forward earnings the market will look at in September 2027.'],
      ['DCF / WACC', 'Discounted cash flow valuation; WACC is the required annual return used to discount future cash (here the cost of equity, as Pidilite has no net debt).'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'ebitdaMargin@FY16': '+600bp: input costs fell with crude; gross margin 45% → 52%.',
  'ebitdaMargin@FY19': '−270bp: VAM and other inputs rose; gross margin 52.5% → 49.3%.',
  'sales@FY19': '+16.5%: strong demand; gross margin fell as input costs rose.',
  'sales@FY21': 'Flat: Covid lockdown in Q1FY21, then a sharp recovery; Araldite (Huntsman) consolidated from Nov-2020.',
  'sales@FY22': '+36%: demand rebound, full year of Araldite, and price rises as inputs spiked.',
  'ebitdaMargin@FY22': '−440bp: raw-material inflation (VAM peak); gross margin 53.7% → 45.1%.',
  'sales@FY23': '+19%: price rises to pass on input inflation plus volume growth (split not collected).',
  'ebitdaMargin@FY23': '−190bp: gross margin trough of 42.7%.',
  'sales@FY24': '+5%: prices cut as input costs fell, so value growth lagged volumes.',
  'ebitdaMargin@FY24': '+510bp: gross margin back to 51.6% on cheaper inputs.',
  'pat@FY24': '+36%: margin recovery; includes −₹72 cr exceptional items.',
  'otherIncome@FY25': '+250%: income on a cash pile that rose to ₹3,887 cr.',
  'sales@FY26': '+11%: UVG 11.1%; little price.',
  'ebitdaMargin@FY26': '+120bp to a record 24.1% despite an ₹80 cr Labour Code charge.',
  'cfo@FY22': 'Down 31%: inventory built up as input prices rose.',
  'sales@Q4FY26': '+14%: UVG 15.3%, the fastest in years; exports hit from March by the West Asia conflict.',
  'sales@Q1FY27': '+21%: UVG 11.3% plus price rises of ~4-5% (Apr) and ~7-8% (May).',
  'opm@Q1FY27': '26%: low-cost VAM inventory, price rises and fewer schemes; management expects Q2 to give some back.',
  'pat@Q4FY24': 'Includes −₹72 cr exceptional items before tax.',
  'sales@FY27E': 'GAM: UVG ~10.5% plus ~7% price and mix after rebates.',
  'ebitdaMargin@FY27E': 'GAM: below FY26 as high-cost inventory and rebates offset Q1\'s 26%.',
  'sales@FY28E': 'GAM: price laps; growth back to ~11% (volume).',
};

module.exports = { street, valuation, risks, glossary, statementNotes };
