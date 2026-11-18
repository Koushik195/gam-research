// Berger Paints report, part 4: street view, valuation, risks & honest summary, glossary, statement notes.
const X = require('./BERGEPAINT.ctx');
const { streetBlocks } = require('./valuation-blend');
const { ruleText } = require('../../src/ratings');
const { D, F, V, A, n0, n1, pc, ASOF_TXT, price, mv, epsSep28, peMult, evMult, FM, H21, H16, H2y, fwdNow, evMed, ttmEbitda, ebitdaSep28, P, derate, OTHERS, sectorDr, worstDr, afterDerate, shortName, rating, buyBelow, sellAbove, ST, postQ1, avgPost, avgAll, shortDate, epsCagrHist, epsCagrFwd, epsCagr2729, b, PEERS } = X;

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: 'The street: mostly positive, targets ₹425-675, method P/E on FY28E',
  blocks: [
    { p: `Three houses published after Q1FY27 (5-6 Aug 2026): Nomura Buy ₹675 (50x FY28E EPS, raised from ₹650), Monarch Networth Accumulate ₹577 (48x FY28E) and ICICI Securities Add ₹575 (DCF, raised from ₹550; its May note said the DCF value equalled ~40x FY28E EPS), an average of ~₹${n0(avgPost)}. Before the results, Macquarie kept Underperform (₹425, Jul-2026) and Morgan Stanley is Underweight (₹429; the item we saw is undated). From the Q4FY26 round in May: Equirus Long ₹577 (46x Jun-28E EPS), Nuvama Buy ₹635, Investec Hold ₹525 (upgraded from Sell) and Systematix (top pick) ₹570; Geojit had ₹554 in June. The average of all ten targets is ~₹${n0(avgAll)}. We found no dated consensus as of 30-Sep-2026. The stock fell 16% between mid-August and 30-Sep-2026, with the rest of the sector, so most targets now sit above the price. Bulls focus on volume share gains and easing competition; bears on weak industry growth visibility and the new entrants.` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who'], wide: [0], rows: D.critiques.map(r => r.map(X.rup)), source: 'Broker notes, earnings calls, CRISIL and filings to 30-Sep-2026' } },
  ],
};

const drTxt = s => `${shortName(s)} ${pc(derate[s])}`;
const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${peMult}x Sep-28E earnings gives {{dcf.tp|inr}}`,
  blocks: [
    ...streetBlocks('BERGEPAINT', {
      rating,
      streetIntro: 'The brokers that disclose a method value Berger on **P/E**: Nomura 50x and Monarch Networth 48x FY28E EPS, Equirus 46x Jun-28E EPS; ICICI Securities uses a DCF that it equates to ~40x FY28E. We use the same method so our target is comparable, applied to the earnings the market will look at in September 2027 (Sep-28E: half FY28E, half FY29E). The "At our EPS" column applies each broker\'s multiple to our EPS for its year: the gap to the street is mostly our lower multiple.',
      street: ST.map(s => [`${s.broker} (${s.date ? shortDate(s.date) : 'undated, 2026'})`, s.rating, s.tp, s.method || 'n.d.', s.multiple || '–', s.on || '–', X.rup(s.thesis)]),
      ourThesis: 'Strong No.2, volumes fine, pricing power gone; fairly priced',
      streetSource: 'Nomura via Business Standard and Investing.com; ICICI Securities via Investing.com and its May-2026 note (PDF); Monarch Networth company update; Equirus note (PDF); Macquarie via Investing.com; Morgan Stanley via Stockopedia (undated); Nuvama, Investec, Systematix via Multibagg/Informist summaries; Geojit via Trendlyne. n.d. = method not disclosed in the sources we saw',
      derivationIntro: 'We start from the stock\'s own one-year-forward P/E since April 2021, adjust for how far comparable paint and adhesive stocks had de-rated by 30-Sep-2026, and then check growth, peers and returns.',
      derivation: [
        ['1. Its own history', `One-year-forward P/E: median ${n1(FM.median)}x since Apr-2021 (${FM.troughYears.length ? `trough years excluded: ${FM.troughYears.join(', ')}` : 'no trough years to exclude: forward EPS never fell below half its prior three-year peak'}); 25th-75th percentile ${n1(H21.p25)}-${n1(H21.p75)}x; peak ${Math.round(H21.max)}x in 2021; ${n1(H16.med)}x since 2016; ${n1(H2y.med)}x over the last two years; ${n1(fwdNow)}x on 30-Sep-2026 on our FY28E`, `Starting point: ${Math.round(FM.median)}x`],
        ['2. Sector de-rating', `On ${ASOF_TXT} four paint and adhesive peers traded below their five-year median trailing P/E: ${OTHERS.map(drTxt).join(', ')} (median ${pc(sectorDr)}); Berger itself ${pc(derate.BERGEPAINT)}`, `${n1(FM.median)}x × ${(1 + sectorDr / 100).toFixed(2)} ≈ ${n1(afterDerate)}x`],
        ['3. Growth', `EPS grew ${Math.round(epsCagrHist)}% a year in FY21-26; we forecast ~${Math.round(epsCagrFwd)}% for FY26-29E, but that includes a price-led FY27 off a base hit by one-offs; FY27-29E is ~${Math.round(epsCagr2729)}%, in line with history. The street's 46-50x come with FY28E EPS of ₹12-13.7, close to ours`, `No further adjustment: **${peMult}x** (rounded)`],
        ['4. Peers', `Trailing P/E: Asian Paints ${n1(P.ASIANPAINT.pe)}x, Pidilite ${n1(P.PIDILITIND.pe)}x, Indigo ${n1(P.INDIGOPNTS.pe)}x, Kansai Nerolac ${n1(P.KANSAINER.pe)}x; Berger ${n1(P.BERGEPAINT.pe)}x`, `${peMult}x Sep-28E = ${n1(peMult * epsSep28 / F.eps[1])}x our FY28E: below Asian Paints and Pidilite, above Indigo and Kansai`],
        ['5. Returns', `ROE ${n1(A.roe[b])}% in FY26 and ~18-19% in FY27-29E against an ${n1(V.ke)}% cost of equity`, 'Supports a premium to the market, not a re-rating'],
        ['6. What the price implies', `${n1(price / epsSep28)}x Sep-28E EPS. A DCF reaches only ~₹${n0(V.sens.grid[0][4])} even with a ${n1(V.sens.waccs[0])}% cost of capital and ${n1(V.sens.gs[4])}% terminal growth`, 'The price already assumes long, high growth'],
      ],
      derivationSource: `Screener.in (P/E history to ${ASOF_TXT}), broker notes, GAM Research`,
      history: { field: 'eps', from: '2016-04-01', median: Math.round(FM.median), label: `Median since 2021: ${Math.round(FM.median)}x`, title: `One-year-forward P/E: our ${peMult}x vs history`, yearStep: 2 },
      crossNote: `**What the cross-checks tell us.** EV/EBITDA (${evMult}x Sep-28E EBITDA of ₹${n0(ebitdaSep28)} cr plus net cash) gives ₹${n0(mv('ev').value)}, ${Math.abs(Math.round(mv('ev').vsTarget))}% below the P/E target: ${evMult}x comes from Berger's ${n1(evMed)}x median trailing EV/EBITDA since 2021, cut by the same sector de-rating and restated for Sep-28E EBITDA being ${Math.round((ebitdaSep28 / ttmEbitda - 1) * 100)}% above the twelve months to Jun-26 (₹${n0(ttmEbitda)} cr). The gap says our P/E target is not conservative. The DCF (₹${n0(mv('dcf').value)}) is far lower: at an ${n1(V.ke)}% cost of equity and 6% terminal growth, revenue growth fading from ~10% to 8% over 15 years at a 16% margin supports only ~${Math.round(mv('dcf').value / price * 100)}% of today's price. Paint stocks have always looked expensive on a DCF; the multiple reflects the long runway of Indian paint demand. But with pricing power weaker than in the past, we would not pay above the de-rated history.`,
    }),
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Revenue growth +3pp a year and margin +1pp vs base; ${V.blend.methods[0].multiple.bull}x (its 25th-percentile forward P/E since 2021).`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Revenue {{F.salesGrowth.0|chg}} / {{F.salesGrowth.1|chg}} / {{F.salesGrowth.2|chg}} (FY27-29E); EBITDA margin {{F.ebitdaMargin.0|pct}} → {{F.ebitdaMargin.2|pct}}; ${peMult}x Sep-28E EPS.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Revenue growth −4pp a year and margin −1.5pp vs base; ${V.blend.methods[0].multiple.bear}x (the median forward P/E cut by the worst peer de-rating, Kansai Nerolac's ${pc(worstDr)}).`],
    ], source: 'GAM Research' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-42E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Add: net cash at Mar-27 (Screener basis)', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
      { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of capital down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Listed peers: paints and adhesives', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', 'vs 5-yr median P/E', 'EV/EBITDA (x)', 'ROE'], rows: PEERS.map(p => [p.symbol === 'BERGEPAINT' ? '**Berger Paints**' : shortName(p.symbol), n0(p.mcapCr), n0(p.revenue), p.ebitdaMargin + '%', n1(p.pe), pc(derate[p.symbol]), n1(p.evEbitda), p.roe + '%']), source: `Screener.in, trailing multiples at the NSE close on ${ASOF_TXT}` } },
  ],
};

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: 'Our honest summary: a good business at a fair price; wait for a better entry',
  blocks: [
    { callout: `**What you are buying:** India's No.2 paint company with ~20% of listed players' sales, 64,000+ dealers, No.1 in protective coatings, volume growth of 8-10% a year through a competitive shock, net cash, a ${n1(A.roe[b])}% ROE and a professional MD re-appointed to 2031.` },
    { callout: `**What you are paying:** ${n1(price / F.eps[0])}x our FY27E and ${n1(price / F.eps[1])}x FY28E EPS for an industry that has lost much of its pricing power to Birla Opus and JSW. FY27 earnings are flattered by the crude-led price rise. On the street's method and our inputs the target is {{dcf.tp|inr}} ({{dcf.upside|chg}}): a ${rating}.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      [`Price below ~₹${n0(buyBelow)} (BUY on our rule)`, 'Medium', 'Share price around the Q2FY27 results; the stock was ₹408 in March-2026'],
      ['Value growth holds near volume growth after inputs ease (no big price cut)', 'Medium', 'Standalone value vs volume each quarter; dealer price lists after Diwali'],
      ['Share gains confirmed against Asian Paints and Birla Opus', 'Medium', 'Quarterly growth vs peers; Grasim paints revenue'],
      ['EBITDA margin settles at 16.5-17% (top of the band)', 'Low', 'Other expenses and staff costs as % of revenue'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['A price war: post-Diwali cuts plus heavier schemes as inputs fall', 'Medium', 'FY28 revenue growth in low single digits; margin toward 14-15%'],
      ['Birla Opus or JSW Dulux steps up dealer terms again; Berger loses share in East India', 'Medium', 'Volume growth falls to 5-6% (our bear case)'],
      ['A renewed crude spike that outruns price rises', 'Medium', 'Gross margin down 1-2pp for two to three quarters'],
      ['New plants commissioned into a market with too much capacity', 'Medium', 'ROE drifts toward 15%; depreciation rises ahead of volume'],
      ['De-rating of paint stocks continues', 'Medium', `At ${V.blend.methods[0].multiple.bear}x Sep-28E (bear multiple) on bear EPS the stock is worth {{scen.bear.tp|inr}}`],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**We would turn buyers below ~₹${n0(buyBelow)}** and sellers above ~₹${n0(sellAbove)} on today's numbers, or sooner if FY28 visibility improves (value growth near volume growth after inputs ease, with margin near 16.5%).`,
      `**Biggest swing factors:** realised price and the EBITDA margin. Each 1pp of margin is ~₹${n0(F.sales[1] / 100)} cr of EBITDA in FY28E, ~${Math.round(F.sales[1] / 100 * 0.75 / F.shares / F.eps[1] * 100)}% of our FY28E EPS (~₹${n0((F.sales[1] + F.sales[2]) / 200 * 0.75 / F.shares * peMult)} a share at ${peMult}x Sep-28E).`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Standalone volume growth, Q1FY27', v: '8.4%', d: 'value 12.7%, price ~5%' },
      { k: 'Value growth, FY25-26 quarters', v: '−0.4% to +6.7%', d: 'while volume grew 4-12%' },
      { k: 'Birla Opus paint revenue, Q1FY27', v: '₹1,661 cr', d: '+64% YoY; half of Berger India' },
      { k: 'Price ÷ our FY28E EPS', v: `${n1(price / F.eps[1])}x`, d: `median since 2021: ${Math.round(FM.median)}x (forward)` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['Decorative paints', 'Paints for homes and buildings (emulsions, enamels, distempers, putty, wood finishes), plus waterproofing and construction chemicals sold through the same dealers.'],
      ['Industrial coatings', 'Coatings sold to companies: protective (steel structures, pipelines, refineries), automotive, general industrial, powder and coil coatings.'],
      ['Emulsion / enamel / distemper / putty', 'Water-based wall paint / solvent-based glossy paint for wood and metal / cheap chalk-based wall finish / filler applied before paint.'],
      ['Volume growth vs value growth', 'Growth in tonnes or litres sold vs growth in revenue. Value below volume means lower prices or a cheaper mix; value above volume means price rises or a richer mix.'],
      ['Tinting machine', 'A machine at the dealer that mixes a base paint with colourants to make any shade on demand; a key tool for winning dealers.'],
      ['Dealer price list (DPL), rebates, schemes', 'The list price to dealers; discounts paid later for volume; free goods or incentives. Schemes are deducted from revenue.'],
      ['Birla Opus', "Grasim Industries' paint business, launched in 2024; No.3 organised decorative player by its own account."],
      ['JSW Dulux', 'Akzo Nobel India after JSW Paints bought 60.76% from AkzoNobel (Dec-2025).'],
      ['ETICS', "External thermal insulation composite systems, Bolix's main product in Poland."],
      ['Gross margin', 'Revenue less raw-material cost, as % of revenue (company definition).'],
      ['EBITDA', 'Operating profit before depreciation, interest and tax (excludes other income and JV profit).'],
      ['JV (joint venture) share of profit', "Berger's 49% share of the profit of Berger Nippon Paint Automotive Coatings and Berger Becker Coatings; their revenue is not in Berger's revenue."],
      ['P/E, EV/EBITDA', 'Share price ÷ earnings per share; enterprise value (market value less net cash) ÷ EBITDA.'],
      ['Sep-28E', 'Half of FY28E plus half of FY29E: the 12-month-forward earnings the market will look at in September 2027.'],
      ['DCF / WACC', 'Discounted cash flow valuation; WACC is the required annual return used to discount future cash (here the cost of equity, as Berger has net cash).'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'sales@FY22': '+29%: post-Covid demand rebound plus price rises as raw materials spiked.',
  'ebitdaMargin@FY22': '−210bp: raw-material inflation ran ahead of price rises.',
  'sales@FY23': '+21%: price rises passed through plus volume growth (split not collected).',
  'ebitdaMargin@FY23': '−120bp: input costs peaked.',
  'ebitdaMargin@FY24': '+260bp: raw materials eased; ~5% price cuts in Q3-Q4FY24 came later.',
  'pat@FY24': '+36%: margin recovery.',
  'sales@FY25': '+3%: volume ~7-8% but price cuts, cheaper mix and new competition (Birla Opus).',
  'sales@FY26': '+2.9%: decorative volume +7.7%, value +3%: long monsoon, early Diwali, competition.',
  'ebitdaMargin@FY26': '−70bp: gross margin up, but brand, dealer and staff costs rose faster.',
  'pat@FY26': '−4.6%: includes a ₹53 cr Labour Code charge; EBITDA −1%.',
  'cfo@FY22': '−29%: inventory built as input prices rose (inventory days 178).',
  'cfo@FY24': '+63%: inventory released as input costs fell.',
  'capex@FY22': '₹774 cr, then ₹748 cr in FY23: the last big capacity wave.',
  'pat@Q1FY26': 'Includes −₹36.8 cr warehouse fire loss (Barasat).',
  'opm@Q2FY26': '12%: weak value growth in a long monsoon, lower operating leverage, higher brand spend.',
  'pat@Q3FY26': 'Includes −₹53.3 cr Labour Code charge.',
  'sales@Q4FY26': '+6%: standalone volume +11.8%, helped by dealer buying ahead of price rises.',
  'pat@Q4FY26': 'Includes +₹36.8 cr insurance claim for the Q1FY26 fire.',
  'sales@Q1FY27': '+12%: standalone volume +8.4%, price/mix ~5%; decorative value ~13.5%.',
  'sales@FY27E': 'GAM: volume ~8% plus ~4% net price; double-digit growth guided.',
  'ebitdaMargin@FY27E': 'GAM: 16.0%, the middle of the 15-17% band.',
  'sales@FY28E': 'GAM: price laps and part is given back; volume ~9%.',
  'capex@FY28E': 'GAM: Panagarh and Khordha plants (₹1,800-2,000 cr in total).',
};

module.exports = { street, valuation, risks, glossary, statementNotes };
