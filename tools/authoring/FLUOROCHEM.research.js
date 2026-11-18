// GFL report, part B: merges FLUOROCHEM.part2-4.js and adds valuation, verdict, glossary and statement notes.
// Prose numbers come from research/company.json, deep.json, segments.json and the built model; forecast and
// valuation figures are live tokens ({{...}}) that follow assumptions.json.
const P2 = require('./FLUOROCHEM.part2'), P3 = require('./FLUOROCHEM.part3'), P4 = require('./FLUOROCHEM.part4');
const { streetBlocks } = require('./valuation-blend');
const { ruleText } = require('../../src/ratings');
const { ctx } = P2;
const { F, V, n0, n1, price, mv, epsSep28, rating, impliedEvBiz, fwdMed, fwdMedAll, troughTxt, TARGET_PE, PEER_SYMS, PEERS, DR, sectorDerate, ASOF_TXT, A26 } = ctx;
const { dcfWc41, buyBelow, sellAbove } = P4;
const pct = s => `${DR[s].chg >= 0 ? '+' : '−'}${Math.abs(Math.round(DR[s].chg))}%`;
const pname = p => p.name.replace(/ Ltd$/, '').replace(' International', '').replace(' India', '');

const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${TARGET_PE}x Sep-28E earnings gives {{dcf.tp|inr}}`,
  blocks: [
    ...streetBlocks('FLUOROCHEM', {
      rating,
      streetIntro: 'Most brokers that disclose a method put **one multiple on FY28E consolidated earnings**: Prabhudas Lilladher 52x P/E; ICICI Direct 30x EV/EBITDA, which is ~54x P/E. Neither values the battery business separately any more (ICICI Direct did in May). JM Financial (Feb) uses a sum of the parts with the battery business at ₹1,241 a share; Elara uses a DCF. We follow the majority: P/E, applied to the earnings the market will look at in September 2027 (Sep-28E: half FY28E, half FY29E).',
      street: [
        ['ICICI Direct (13-Aug)', 'Buy', 5800, 'EV/EBITDA', '30x', 'FY28E EBITDA', 'Fluoropolymers 18-20%, R32/R134a; battery scale-up from Q4FY27'],
        ['ICICI Securities (13-Aug)', 'Add*', 5050, 'n.d.', '–', '–', 'Raised from ₹4,250 after Q1'],
        ['Axis Capital (13-Aug)', 'Buy*', 4800, 'n.d.', '–', '–', 'Raised from ₹4,500'],
        ['Elara (26-May)', 'Buy', 4698, 'DCF', 'WACC 9.3%, g 5%', 'FY28-47E', 'FY27 a transition year; batteries pay from FY29'],
        ['DRChoksey (13-Aug)', 'Sell†', 4612, 'n.d.', '–', '–', 'Growth fine, valuation leaves little cushion'],
        ['Prabhudas Lilladher (13-Aug)', 'Hold', 4498, 'P/E', '52x', 'FY28E EPS', 'Fluoropolymers drive growth; batteries take longer'],
        ['AMSEC (19-Mar)', 'Buy', 3817, 'n.d.', '–', '–', 'Initiation on battery chemicals; likely stale'],
        ['JM Financial (12-Feb)', 'Reduce', 3505, 'SOTP', '15x base + battery ₹1,241/sh', 'Mar-28E', 'Battery approval and ramp-up risk'],
      ],
      ourThesis: 'Good core; battery bet already in the price',
      streetSource: 'Broker notes and press to 30-Sep-2026. * rating and target from a later aggregator table, method not verified; † label as tagged by Trendlyne. "At our EPS" applies each P/E multiple to GAM FY28E EPS; n.d. = not disclosed',
      derivationIntro: 'We start from the stock\'s own one-year-forward P/E, adjust for how far the sector has de-rated, and check growth, peers and returns.',
      derivation: [
        ['1. Its own history', `One-year-forward P/E since Apr-2021: median ${n1(fwdMed)}x excluding trough years. ${troughTxt} are left out under the house rule (forward EPS below half the peak of the previous three years: FY24 EPS ₹39.6 vs ₹121 in FY23), because a multiple on depressed earnings overstates what the market pays; ${n1(fwdMedAll)}x including them`, `Starting point: ${n1(fwdMed)}x`],
        ['2. Sector de-rating', `On ${ASOF_TXT} listed chemical peers traded below their five-year median P/E: SRF ${pct('SRF')}, Navin Fluorine ${pct('NAVINFLUOR')}, PI ${pct('PIIND')}, Aarti ${pct('AARTIIND')}, Deepak ${pct('DEEPAKNTR')}, Vinati ${pct('VINATIORGA')}, Clean Science ${pct('CLEAN')} (median ${Math.round(sectorDerate)}%). GFL re-rated instead (${pct('FLUOROCHEM')})`, `${n1(fwdMed)}x × ${(1 + sectorDerate / 100).toFixed(2)} ≈ **${TARGET_PE}x**`],
        ['3. Growth', `Our EPS grows ~${Math.round((Math.pow(F.eps[1] / 52.56, 0.5) - 1) * 100)}% a year over FY26-28E; the street's 52-54x FY28E multiples come with 28-42% a year`, 'In line with the low end: no adjustment'],
        ['4. Peers', `Navin Fluorine ${n1(PEERS.NAVINFLUOR.pe)}x trailing (ROE ${PEERS.NAVINFLUOR.roe}%), SRF ${n1(PEERS.SRF.pe)}x, PI ${n1(PEERS.PIIND.pe)}x; GFL ${n1(PEERS.FLUOROCHEM.pe)}x (ROE ${PEERS.FLUOROCHEM.roe}%)`, `${TARGET_PE}x Sep-28E = ${n1(TARGET_PE * epsSep28 / F.eps[1])}x our FY28E: below Navin's trailing multiple, a premium to the rest`],
        ['5. Returns', `ROE ~8% in FY24-26, ${n1(F.roe[2])}% in FY29E on our numbers, vs a ~12.5% cost of equity`, 'No case for paying more'],
        ['6. What the price implies', `${n1(price / epsSep28)}x Sep-28E EPS; after valuing chemicals at 20x EBITDA, ~₹${n0(impliedEvBiz)} cr for the battery business`, 'The market is already paying for the battery ramp'],
      ],
      derivationSource: `Screener.in (P/E history to ${ASOF_TXT}), broker notes, GAM Research`,
      history: { field: 'eps', from: '2021-04-01', median: fwdMed, label: `Median excl. ${troughTxt}: ${n1(fwdMed)}x`, title: `One-year-forward P/E: our ${TARGET_PE}x vs history`, yearStep: 1 },
      crossNote: `**What the cross-checks tell us.** EV/EBITDA (20x Sep-28E EBITDA less net debt at Sep-27E) gives ₹${n0(mv('ev').value)}, above the P/E target, because its 20x starts from GFL's five-year trailing EV/EBITDA median, which still includes the FY24-26 trough years. The DCF (₹${n0(mv('dcf').value)}) is far lower: free cash flow is negative until the early 2030s because capex runs at ₹1,500-3,150 cr a year and working capital (held at the FY26 ratio, 65% of revenue including capital advances) grows with sales. Even at 41% (Q1FY27's 149 days) the DCF would be only ~₹${n0(dcfWc41)}. Today's price needs the battery business to reach something close to management's ₹12,000 cr revenue potential.`,
    }),
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', '{{as.scenarios.bull.narrative}} Battery revenue ~₹4,200 cr in FY29 at ~20% margin; 45x Sep-28E EPS (the trough-free median with no sector de-rating).'],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', 'Fluoropolymers +15-16%, refrigerants +70% in FY27, battery revenue ₹2,200 cr by FY29 at 14% margin; ' + TARGET_PE + 'x Sep-28E EPS.'] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', '{{as.scenarios.bear.narrative}} 25x Sep-28E EPS (the base cut ~20% for slower growth).'],
    ], source: 'GAM Research' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-42E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Less: net debt at Mar-27E (shown negative)', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
      { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ], source: 'GAM Research (discount rate 11.9% = our WACC, set through beta 0.9; terminal growth 6%)' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): discount rate down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Listed peers', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', 'EV/EBITDA (x)', 'ROE', 'P/E vs 5-yr median'], rows: PEER_SYMS.map(s => PEERS[s]).map(p => [p.symbol === 'FLUOROCHEM' ? '**Gujarat Fluorochemicals**' : pname(p), n0(p.mcapCr), n0(p.revenue), p.ebitdaMargin + '%', n1(p.pe), n1(p.evEbitda), p.roe + '%', pct(p.symbol)]), source: `Screener.in, trailing multiples at the NSE close on ${ASOF_TXT}` } },
  ],
};

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: 'Our honest summary: buy the business, not at this price',
  blocks: [
    { callout: '**What you are buying:** India\'s leading fluoropolymer maker, integrated from fluorspar, gaining share as 3M and AGC leave; a refrigerant business enjoying an R32 windfall until India\'s 2028 freeze; and a ₹6,000 cr battery-materials build-out that could be large but has not yet shown revenue.' },
    { callout: `**What you are paying:** ${n1(price / F.eps[1])}x our FY28E EPS and ${n1(price / epsSep28)}x Sep-28E, for a company earning ~8% on equity with net debt heading to ~₹${n0(-F.treasury[1])} cr. On the street's own method and our inputs the target is {{dcf.tp|inr}} ({{dcf.upside|chg}}). The EV/EBITDA cross-check is higher (its starting multiple is not cleaned of trough years); the DCF is far lower.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      [`Price below ~₹${n0(sellAbove)} (HOLD) or ~₹${n0(buyBelow)} (BUY)`, 'Medium', 'Share price around the Q2FY27 results'],
      ['Battery revenue ramps on management\'s schedule', 'Medium', '₹100 cr+ quarterly revenue by Q4FY27; LFP and PVDF orders; EBITDA break-even'],
      ['Funding for GFCL EV at a high valuation, with little dilution of GFL', 'Medium', 'Size and price of the next round'],
      ['Fluoropolymer growth at the top of guidance (20%)', 'Medium', 'AGC customers qualified; new capacity on time'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['Battery qualification slips again', 'Medium', 'FY28E EPS 15-25% lower; multiple towards 25x'],
      ['R32 prices fall in 2027 as new Indian capacity sells', 'Medium', 'Refrigerant profits down; FY28E EPS −10%'],
      ['EU PFAS restriction without durable exemptions for fluoropolymers', 'Low-medium (from ~2028)', 'Europe is 26% of revenue'],
      ['Chinese price war in fluoropolymers returns', 'Medium', 'Chemicals margin back to ~24%'],
      ['Rising debt and pledges in a weak market', 'Low-medium', 'Equity raise at GFL or GFCL EV'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**We would move to HOLD if the price fell below ~₹${n0(sellAbove)} and to BUY below ~₹${n0(buyBelow)}**, or sooner on proof that battery revenue is ramping with positive EBITDA.`,
      '**Biggest swing factor:** the battery business. Our base case gives it about a fifth of the stated potential by FY29; most of the gap between our bull and bear cases is its pace.',
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Fluoropolymers, FY26', v: `₹${n0(A26.fpRev)} cr`, d: '63% of revenue; +15% in Q1FY27' },
      { k: 'Battery revenue, Q1FY27', v: '₹14 cr', d: 'EBITDA −₹30 cr; ₹6,000 cr capex plan' },
      { k: 'Return on equity, FY26', v: '7.6%', d: 'company metric 12.2% excludes new capital' },
      { k: 'Our FY28E EPS', v: `₹${n1(F.eps[1])}`, d: 'street ₹86.5-122.5' },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['Fluoropolymer', 'A plastic or rubber made with fluorine (PTFE, PFA, FEP, PVDF, FKM); resists heat, chemicals and fire.'],
      ['PTFE / PFA / FEP', 'Polytetrafluoroethylene (best known as Teflon) and two melt-processable relatives used in cables, tubing and semiconductor parts.'],
      ['PVDF', 'Polyvinylidene fluoride: used in coatings, chemical plants and as the binder in lithium-ion battery electrodes.'],
      ['FKM', 'Fluoroelastomer: a heat- and fuel-resistant rubber used in seals for cars and chemical plants.'],
      ['R22, R32, R125, R134a, R410a', 'Refrigerant gases; R22 is an HCFC being phased out, the others are HFCs used in air-conditioners, fridges and car ACs.'],
      ['HFC phase-down / Kigali', 'The global agreement to cut HFC production; India freezes output from 2028 at a 2024-26 baseline.'],
      ['PFAS', '"Forever chemicals": thousands of fluorinated substances; the EU is preparing a broad restriction.'],
      ['LiPF6, electrolyte, LFP, anode', 'Battery materials: the lithium salt, the liquid that carries it, the cathode powder (lithium iron phosphate) and the graphite electrode.'],
      ['CCPS', 'Compulsorily convertible preference shares: here IFC\'s ₹430 cr in GFCL EV, which will turn into its equity.'],
      ['AHF / TFE', 'Anhydrous hydrofluoric acid (basic fluorine raw material) and tetrafluoroethylene (the building block of PTFE).'],
      ['P/E, EV/EBITDA', 'Share price ÷ earnings per share; enterprise value (market value plus net debt) ÷ operating profit before depreciation.'],
      ['ROE / ROCE', 'Profit as % of shareholders\' equity / operating profit as % of capital employed.'],
      ['DCF / WACC', 'Discounted cash flow valuation; WACC is the blended required return used to discount future cash.'],
    ], source: 'GAM Research' } },
  ],
};

module.exports = {
  rating, cover: P2.cover,
  sections: p => [P2.narrative, P2.business, P2.history, P3.industry, P3.tailwind, P3.fluoropolymers, P3.fluorochem, P3.battery, P3.moat, p.financials, p.capital, P3.quality, p.balance, P4.ownership(p.ownershipBase), P4.governance, P4.forecasts, P4.street, valuation, risks, p.statements, glossary],
  statementNotes: {
    'pat@FY21': 'Loss after an unusually high tax charge (146% of pre-tax profit) in the demerger period.',
    'sales@FY23': '+44%: refrigerant and PTFE upcycle; fluorochemicals revenue more than doubled.',
    'sales@FY24': '−25%: Chinese supply and customer destocking cut fluoropolymer and refrigerant prices.',
    'pat@FY24': '−67%; EBITDA margin fell from 35% to 21%.',
    'otherIncome@FY26': 'Includes ₹88.6 cr forex gain, net of a ₹19.5 cr labour-code charge.',
    'pat@FY26': 'After a ₹104 cr loss in battery materials.',
    'capex@FY26': 'Battery materials ₹787 cr of the company\'s ₹1,057 cr.',
    'sales@FY27E': 'GAM: R32 doubles to 20kt; fluoropolymers +15%; battery ₹220 cr.',
    'capex@FY27E': 'Plan ₹3,150 cr, of which ₹2,300 cr battery materials.',
    'pat@FY28E': 'Battery materials turn EBITDA-positive; interest rises with debt.',
  },
};
