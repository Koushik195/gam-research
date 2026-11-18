// Atul report, part B: merges ATUL.part2-4.js and adds forecasts, street, valuation, verdict, glossary
// and statement notes. Written as of 30-Sep-2026 (Q1FY27 basis). Forecast and valuation figures are live
// tokens ({{...}}) that follow assumptions.json.
const P2 = require('./ATUL.part2'), P3 = require('./ATUL.part3'), P4 = require('./ATUL.part4');
const { streetBlocks } = require('./valuation-blend');
const { ruleText } = require('../../src/ratings');
const { ctx } = P2;
const { D, M, F, V, AS, n0, n1, pctChg, A26, price, mv, epsSep28, pe28, peSep28, nc, rating, buyBelow, sellAbove, BR, moslE, nuvE, pocPt,
  PEER_SYMS, PEERS, sectorDerate, AT, pname, fwdMed21, fwdMed19, fwdMed24, FM, fwdMedX, troughTxt, PE_X, PE_BULL, PE_BEAR, deratedMed, ASOF_TXT } = ctx;
const dcfV = mv('dcf').value, evV = mv('ev').value;
const epsCagr = (Math.pow(F.eps[2] / M.annual.eps[M.annual.eps.length - 1], 1 / 3) - 1) * 100;
const ndSep28 = (nc(1) + nc(2)) / 2;
const sv = s => `${PEERS[s].peVs > 0 ? '+' : '−'}${Math.abs(Math.round(PEERS[s].peVs))}%`;

// ---------------------------------------------------------------- Forecasts
const segRow = (k, name, field, hist) => [name, n0(hist), ...[0, 1, 2].map(i => `{{F.seg.${k}.${field}.${i}|num}}`)];
const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: the Q1 spike washes out; EPS grows ~10% a year from FY26',
  blocks: [
    { p: 'We forecast each segment\'s gross revenue and EBITDA margin (segment EBIT plus its depreciation), remove inter-segment sales, and deduct the gap between segment EBITDA and reported EBITDA (other income allocated to segments, less central costs). Other income is modelled as a 4.75% return on the opening treasury plus ₹20 cr. Capex rises from ₹175 cr (FY26) to ₹300-400 cr a year for debottlenecking, the herbicide plant and maintenance. Every assumption, with our reasoning, is in the Excel model\'s Assumptions sheet, which recalculates this report\'s target price.' },
    { exhibit: { type: 'table', title: 'Segment forecasts (₹ crore)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      { sec: 'Life Science Chemicals' }, segRow('lsc', 'Revenue', 'revenue', A26.lscRev), segRow('lsc', 'EBITDA', 'adjEbitda', A26.lscEbitda),
      { sec: 'Performance & Other Chemicals' }, segRow('poc', 'Revenue', 'revenue', A26.pocRev), segRow('poc', 'EBITDA', 'adjEbitda', A26.pocEbitda),
      { sec: 'Others and eliminations' }, segRow('oth', 'Others revenue', 'revenue', A26.othRev), segRow('oth', 'Others EBITDA', 'adjEbitda', A26.othEbitda),
      ['Inter-segment eliminations (revenue)', '−' + n0(A26.interSeg), '{{F.seg.elim.revenue.0|num}}', '{{F.seg.elim.revenue.1|num}}', '{{F.seg.elim.revenue.2|num}}'],
      ['Segment EBITDA above reported EBITDA', '−' + n0(A26.unalloc), '{{F.unalloc.0|num}}', '{{F.unalloc.1|num}}', '{{F.unalloc.2|num}}'],
    ], source: 'Company (FY26), GAM Research estimates; reported EBITDA excludes other income (Screener basis)' } },
    { exhibit: { type: 'rows', title: 'Group P&L and cash flow summary (₹ crore)', from: 'FY24', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' },
      { name: 'Other income', ref: 'fin.otherIncome' }, { name: 'Depreciation', ref: 'fin.dep' },
      { name: 'Net profit', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n1' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Capex', ref: 'fin.capex' }, { name: 'Free cash flow', ref: 'fin.fcf' }, { name: 'ROE', ref: 'fin.roe', fmt: 'pct' },
    ], source: 'Company, GAM Research estimates' } },
    { exhibit: { type: 'table', title: 'GAM vs broker estimates (latest before 30-Sep-2026)', head: ['', 'GAM FY27E', 'Nuvama FY27E', 'GAM FY28E', 'Nuvama FY28E', 'MOSL FY28E'], rows: [
      ['Revenue (₹ cr)', '{{F.sales.0|num}}', 'n.d.', '{{F.sales.1|num}}', 'n.d.', 'n.d.'],
      ['EBITDA (₹ cr)', '{{F.ebitda.0|num}}', 'n.d.', '{{F.ebitda.1|num}}', 'n.d.', 'n.d.'],
      ['EPS (₹)', '{{F.eps.0|n1}}', '~' + n0(nuvE.FY27E.eps) + ' (implied)', '{{F.eps.1|n1}}', '~' + n0(nuvE.FY28E.eps) + ' (implied)', '~' + n0(moslE.FY28E.eps) + ' (implied)'],
    ], source: 'Motilal Oswal (25-Jul-2026; EPS implied by ₹8,400 ÷ 25x), Nuvama (3-May-2026, before Q1; implied by its 30x target and quoted multiples), GAM Research. No dated FY27-28 consensus table was published in Jul-Sep 2026.' } },
    { callout: `Our FY27E EPS (₹${n1(F.eps[0])}) includes Q1's ₹83; for the remaining three quarters we assume ~₹${n0((F.eps[0] - 83.3) / 3)} a quarter, close to the FY26 run-rate, as war-time prices fade. Our FY28E (₹${n1(F.eps[1])}) is ${Math.abs(pctChg(F.eps[1], moslE.FY28E.eps))}% below Motilal Oswal's implied ₹${n0(moslE.FY28E.eps)} because we assume P&OC margins settle at 15.5% (Q1FY27: ~21%) and LSC at 24.5% (FY26: ${A26.lscEbitdaPct}%), and we do not forecast exchange gains. EPS growth is ~${Math.round(epsCagr)}% a year FY26-29E, roughly Atul's ten-year record.` },
  ],
};

// ---------------------------------------------------------------- Street
const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: 'The street: mostly Buy, with one loud Sell; we are below the bulls on earnings',
  blocks: [
    { p: `${D.street.split} Bulls (Motilal Oswal, Nuvama) point to volume growth from new capacity, the P&OC recovery and an undemanding valuation. ICICI Securities stays Buy but warns that Q1's spreads and inventory gains will not last. Kotak (Sell, ₹5,900) argues the chairman's own letter signals a tough environment and much smaller growth headroom than presented in April. Our target sits between them: lower earnings than the bulls, a higher multiple than Kotak implies.` },
    { exhibit: { type: 'table', title: 'Earlier calls (for context)', head: ['Broker', 'Rating', 'Target (₹)', 'Date', 'Note'], wide: [4], rows: D.street.older.map(o => [o.broker, o.rating, o.tp ? n0(o.tp) : '–', o.date, o.method || '–']), source: 'Trendlyne research-report list, Investing.com (calls dated to 30-Sep-2026 only)' } },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who'], wide: [0], rows: D.critiques.map(c => [c.argument, c.who]), source: 'Broker notes, press and company filings to 30-Sep-2026' } },
  ],
};

// ---------------------------------------------------------------- Valuation
const derivation = [
  ['1. The street', 'Motilal Oswal 25x FY28E EPS (Jul-2026), Nuvama 30x FY28E (May-2026); ICICI Securities, Kotak and PhillipCapital do not disclose a method in sources we could access', 'Range 25-30x'],
  ['2. Atul\'s own history', `One-year-forward P/E median ${n1(fwdMedX)}x since Apr-2021, leaving out ${troughTxt} as a trough year under the house rule (forward EPS below half the previous three-year peak: ₹110 vs ₹204 in FY22). Including it the median is ${n1(FM.medianAll)}x (${Math.round(fwdMed19)}x since 2019), inflated when earnings collapsed and the forward P/E hit 50-80x; since Apr-2024 the median is ${Math.round(fwdMed24)}x`, `Starting point: ${n1(fwdMedX)}x (forward, since 2021, ex-${troughTxt}: our house window)`],
  ['3. Sector de-rating', `On ${ASOF_TXT} Atul traded at ${n1(AT.pe)}x trailing, ${Math.abs(Math.round(AT.peVs))}% below its ${n1(AT.pe5)}x five-year median; the median of nine Indian chemical stocks was ${Math.abs(Math.round(sectorDerate))}% below its own (Vinati ${sv('VINATIORGA')}, Deepak ${sv('DEEPAKNTR')}, SRF ${sv('SRF')}, Navin ${sv('NAVINFLUOR')}, Aarti ${sv('AARTIIND')})`, `${n1(fwdMedX)}x × ${n1(1 + sectorDerate / 100)} ≈ **${Math.round(deratedMed)}x**`],
  ['4. Growth', `Our EPS grows ~${Math.round(epsCagr)}% a year FY26-29E (FY28E only +${Math.round(F.epsGrowth[1])}% as the spike fades), below the street's path; the lower earnings are already in our target`, 'No change to the multiple'],
  ['5. Returns vs cost of capital', `ROE ~${Math.round(F.roe[1])}% in FY28E vs a cost of equity of ${n1(V.ke)}%: a large, low-yielding treasury dilutes strong operating returns (LSC ROCE ${A26.lscRoce}%, P&OC ${A26.pocRoce}%)`, `Discount ~15%: ${n1(deratedMed * 0.85)}x, rounded to **${PE_X}x**`],
  ['6. Peers', `Trailing P/E on ${ASOF_TXT}: Vinati ${n1(PEERS.VINATIORGA.pe)}x, Deepak ${n1(PEERS.DEEPAKNTR.pe)}x, PI ${n1(PEERS.PIIND.pe)}x, Aarti ${n1(PEERS.AARTIIND.pe)}x, SRF ${n1(PEERS.SRF.pe)}x`, `${PE_X}x on forward earnings is below the whole peer range: Atul's lower returns and growth justify a discount`],
];
const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${PE_X}x Sep-28E earnings gives {{dcf.tp|inr}}`,
  blocks: [
    ...streetBlocks('ATUL', {
      rating,
      streetIntro: 'Brokers value Atul on **P/E on FY28E earnings**: both brokers whose method we could find (Motilal Oswal 25x, Nuvama 30x) use it. We set our target the same way so it is comparable; the differences are in the inputs. The "At our EPS" column applies each broker\'s multiple to our own FY28E EPS.',
      street: BR.map(b => [b.broker, b.rating, b.tp, b.method, b.multiple, b.on, `${b.thesis} (${b.date})`]),
      streetSource: 'Broker notes and press reports to 30-Sep-2026 (latest call per broker); n.d. = method not disclosed',
      ourThesis: 'Q1 spike fades; fairly priced on normal earnings; cash-rich',
      derivationIntro: `The target is a 12-month price, so we apply a one-year-forward multiple to the earnings the market will look at in September 2027: **Sep-28E EPS of ₹${n1(epsSep28)}** (half FY28E, half FY29E).`,
      derivation,
      derivationSource: `Screener.in (P/E history to ${ASOF_TXT}; nine peers' trailing P/E vs five-year medians), broker notes, GAM Research`,
      history: { field: 'eps', from: '2019-04-01', median: Math.round(fwdMedX), label: `Median since 2021 ex-${troughTxt}: ${Math.round(fwdMedX)}x`, title: `One-year-forward P/E: ${PE_X}x vs history`, yearStep: 1 },
      crossNote: `**What the cross-checks tell us.** EV/EBITDA at 14x Sep-28E (the 24x five-year median less the same de-rating and returns discount) lands ${Math.abs(Math.round(mv('ev').vsTarget))}% above the P/E target because it credits the ~₹${n0(Math.round(ndSep28 / 100) * 100)} cr of net cash at Sep-28 in full, while the P/E method only captures the ~4.75% it earns. The DCF is lower (₹${n0(dcfV)}): with growth fading to 8%, an 18% EBITDA margin and an ${n1(V.ke)}% cost of equity, today's cash flows support roughly today's price. The P/E target sits between the two, close to today's price: the market already pays a fair multiple for normalised earnings and the cash.`,
    }),
  ],
};

valuation.blocks.push(
  { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
    ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} ${PE_BULL}x Sep-28E EPS (no returns discount).`],
    { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `LSC revenue +6% / +8% / +8% (FY27-29E) at a 24.5% EBITDA margin; P&OC +12% / +8% / +9% at 17% / 15.5% / 16%; ${PE_X}x Sep-28E EPS.`] },
    ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} ${PE_BEAR}x Sep-28E EPS.`],
  ], source: 'GAM Research' } },
  { h: 'The DCF cross-check in detail' },
  { p: `A ten-year DCF on free cash flow to the firm, excluding treasury income: explicit FY28-29, then growth fades from ~9% to 8% by FY37, the EBITDA margin holds at ~18%, capex rises to 5% of revenue (FY25-26: 3-4%), then 5.5% growth for ever. We discount at the cost of equity (${n1(V.ke)}% = 6.5% risk-free + 0.9 beta × 6% equity risk premium), which equals WACC for a company without debt, and add net cash at Mar-27 (₹${n0(nc(0))} cr in the model).` },
  { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
    ['Present value of FY28-37E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
    ['Add: net cash at Mar-27', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
    { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
  ], source: 'GAM Research' } },
  { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): discount rate down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'Ke \\ g', source: 'GAM Research' } },
  { exhibit: { type: 'table', title: 'Listed peers (trailing multiples at the 30-Sep-2026 close)', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'ROE', 'P/E (x)', '5-yr median P/E (x)', 'vs median', 'EV/EBITDA (x)'], rows: PEER_SYMS.map(s => PEERS[s]).map(p => [p.symbol === 'ATUL' ? '**Atul**' : pname(p), n0(p.mcapCr), n0(p.revenue), p.ebitdaMargin + '%', p.roe + '%', n1(p.pe), n1(p.pe5), `${p.peVs > 0 ? '+' : '−'}${Math.abs(Math.round(p.peVs))}%`, n1(p.evEbitda)]), source: `Screener.in: trailing P/E and EV/EBITDA at the NSE close on ${ASOF_TXT}; five-year median of weekly trailing P/E (Oct-2021 to Sep-2026). Tata Chemicals' P/E is distorted by depressed earnings.` } },
);

// ---------------------------------------------------------------- Verdict
const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: 'Our honest summary: a good business at a fair price, with a spike in the base to look through',
  blocks: [
    { callout: '**What you are buying:** a world-scale crop-protection actives franchise with ~40% returns, a large but low-return performance-chemicals business whose new plants are only now filling up, one of India\'s most integrated chemical sites, and a fortress balance sheet run by a conservative, long-tenured family management.' },
    { callout: `**What you are paying:** ${n1(pe28)}x our FY28E EPS and ${n1(peSep28)}x Sep-28E, against a ${n1(fwdMedX)}x forward median since 2021 (ex-${troughTxt}) and 25-30x that brokers use on higher earnings; ~₹${n0(nc(0) / F.shares)} a share of the price is net cash at Mar-27. On the street's method and our below-consensus inputs the target is {{dcf.tp|inr}} ({{dcf.upside|chg}}). That is fair value: the strong LSC franchise and the cash are in the price, and Q1FY27 flattered the trend; the next two quarters will show how much of it fades.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      ['P&OC margins hold well above FY26 after the war-time spike', 'Medium', 'P&OC EBIT margin above 11% in Q2-Q3FY27'],
      ['A large, sensible use of the cash pile', 'Low-medium', 'A big buyback, or a project/acquisition with disclosed returns'],
      ['Epoxy and caustic plants fill up', 'Medium', 'Performance Materials volume growth; Atul Products profit'],
      ['Crop protection upturn', 'Medium', 'LSC revenue growth back above 8%; 2,4-D prices'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What would make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['War-time margins unwind fully and Chinese dumping returns', 'Medium', `Bear-case FY28E EPS ₹${n1(M.forecast.scenarios.bear.eps[1])}, ${Math.abs(pctChg(M.forecast.scenarios.bear.eps[1], F.eps[1]))}% below our base; target {{scen.bear.tp|inr}}`],
      ['Growth headroom smaller than hoped (₹436 cr from existing capacity per the AR)', 'Medium', 'Revenue growth below our 8-9% for FY28-29'],
      ['Capital misallocation (non-core ventures, Anaven losses)', 'Low-medium', 'Lower ROE; more write-downs'],
      ['US trade action on epoxy and other exports', 'Medium', 'Lower export volumes and prices'],
      ['Succession at the top', 'Low (near term)', 'CMD has led the company for four decades'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**We would buy below ~₹${n0(buyBelow)}** (the BUY line on our target) or on a large, sensible use of the cash; **we would turn negative above ~₹${n0(sellAbove)}**, or sooner if Q2-Q3FY27 show P&OC margins back at FY26 levels with no growth.`,
      `**Biggest swing factor:** P&OC margins. Every one-point change in the P&OC EBITDA margin moves FY28E EPS by ~₹${n1(pocPt)} (≈${Math.round(pocPt / F.eps[1] * 100)}%).`,
      '**Second swing factor:** what management does with ~₹3,000-4,000 cr of surplus cash.',
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'LSC pre-tax ROCE, FY26', v: `${A26.lscRoce}%`, d: `P&OC: ${A26.pocRoce}%` },
      { k: 'P&OC EBIT margin, Q1FY27', v: '16.8%', d: 'FY26: ~9%' },
      { k: 'Free cash flow, FY26', v: '₹848 cr', d: 'capex only ₹175 cr' },
      { k: 'Net cash, Mar-27E', v: `₹${n0(Math.round(nc(0) / 100) * 100)} cr`, d: `~${Math.round(nc(0) / (price * F.shares) * 100)}% of market value` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'Company, GAM Research' } },
  ],
};

// ---------------------------------------------------------------- Glossary
const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['2,4-D', 'A widely used herbicide (weed killer); Atul is one of the world\'s largest makers.'],
      ['Indoxacarb, sulfonylureas, MCPA, MCPP-p', 'Crop-protection active ingredients: an insecticide, a herbicide family and two phenoxy herbicides.'],
      ['API', 'Active pharmaceutical ingredient: the medically active part of a medicine.'],
      ['Epoxy resin (LER) / curing agent', 'A liquid resin that hardens with a curing agent into tough plastics, coatings, adhesives and wind-blade composites.'],
      ['Caustic soda / chlorine (chlor-alkali)', 'Basic chemicals made together by passing electricity through salt water; chlorine feeds many of Atul\'s chains.'],
      ['Para-cresol, anisole, resorcinol', 'Aromatic intermediates used in fragrances, antioxidants, tyres and UV absorbers.'],
      ['Anti-dumping duty', 'An import tax imposed when a country finds foreign goods are sold below their home price and hurt local makers.'],
      ['Segment EBIT / EBITDA', 'Operating profit of a segment before (EBIT) or before and adding back (EBITDA) its depreciation, before head-office items.'],
      ['Treasury', 'Cash, liquid funds and investments held by the company, net of borrowings in our forecasts.'],
      ['OCI', 'Other comprehensive income: gains and losses (e.g. on equity stakes) that go straight to equity, not profit.'],
      ['P/E; EV/EBITDA', 'Share price ÷ earnings per share; enterprise value (market value − net cash) ÷ EBITDA.'],
      ['Sep-28E EPS', 'Earnings for the twelve months to September 2028 (half FY28E, half FY29E): what the market will look at in a year.'],
      ['DCF / Ke', `Discounted cash flow valuation; Ke is the cost of equity (here ${n1(V.ke)}% = 6.5% risk-free + 0.9 × 6% equity risk premium).`],
      ['ROCE / ROE', 'Return on capital employed / on shareholders\' equity.'],
    ], source: 'GAM Research' } },
  ],
};

module.exports = {
  rating, cover: P2.cover,
  sections: p => [P2.narrative, P3.business, P3.history, P3.industry, P3.tailwind, P3.lsc, P4.poc, P4.moat, p.financials, p.capital, P4.quality, p.balance, P4.ownership(p.ownershipBase), P4.governance, forecasts, street, valuation, risks, p.statements, glossary],
  statementNotes: {
    'sales@FY18': '+24%: higher volumes and prices across both segments.',
    'pat@FY18': 'Lower margin year (OPM 14%) despite revenue growth.',
    'ebitdaMargin@FY20': 'P&OC EBITDA margin 23% as Chinese supply was disrupted; ROCE peaked at 28%.',
    'ebitdaMargin@FY21': 'Peak EBITDA margin (25%): P&OC 26%, LSC 21%.',
    'sales@FY22': '+36%: higher price levels of inputs and outputs; low Covid base in Q1FY21.',
    'ebitdaMargin@FY22': 'Raw material inflation outran prices; LSC margin fell to 15%.',
    'sales@FY23': 'LSC revenue +34% to ₹1,959 cr (agchem upcycle); P&OC flat.',
    'ebitdaMargin@FY23': 'P&OC EBITDA margin collapsed to 10% on Chinese pricing.',
    'sales@FY24': '−13%: crop-protection destocking (LSC −27%) and lower prices (−19%), volume +5%.',
    'pat@FY24': 'Trough: EPS ₹110; losses in Atul Products (start-up) and Anaven.',
    'capex@FY23': 'Peak capex ₹875 cr: epoxy, caustic-chlorine (Atul Products), APIs.',
    'sales@FY25': '+18%, volume-led; LER expansion from Oct-2024.',
    'pat@FY26': 'Record profit; includes ₹203 cr of other income (exchange gains ₹44 cr, tax-refund interest).',
    'otherIncome@FY26': 'Fair-value gains on treasury funds ₹77 cr, exchange gains ₹44 cr, interest subsidy ₹15.5 cr.',
    'capex@FY26': 'Capex cut to ₹175 cr; free cash flow ₹848 cr.',
    'sales@Q1FY27': 'Record: P&OC +34% on war-time prices and volume; LSC +4%.',
    'pat@Q1FY27': 'Includes inventory gains (inventory drawdown ₹188 cr); EPS ₹83.',
    'sales@FY27E': 'GAM: Q1 +25%; ~₹1,250 cr a quarter in P&OC thereafter as prices normalise.',
    'pat@FY28E': 'Q1FY27 spike drops out; P&OC margin 15.5%.',
    'pat@FY29E': 'Volume growth on existing plants; herbicide plant contributes.',
  },
};
