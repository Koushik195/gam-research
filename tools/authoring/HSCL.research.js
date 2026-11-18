// Himadri report, part B: merges HSCL.part2-6.js and adds valuation, verdict, glossary and statement notes.
// Prose numbers come from research/company.json, deep.json, segments.json and the built model; forecast and
// valuation figures are live tokens ({{...}}) that follow assumptions.json.
const P2 = require('./HSCL.part2'), P3 = require('./HSCL.part3'), P4 = require('./HSCL.part4'), P5 = require('./HSCL.part5'), P6 = require('./HSCL.part6');
const { streetBlocks } = require('./valuation-blend');
const { ruleText, buyBelow: buyAt, sellAbove: sellAt } = require('../../src/ratings');
const { ctx } = P2;
const { F, V, n0, n1, price, mv, epsSep28, rating, FM, fwdMed, fwdSince24, fwdTo23, PEERS, DR, CHEM, sectorDerate, ASOF_TXT, A26, impliedNem } = ctx;
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;
const pct = s => `${DR[s].chg >= 0 ? '+' : '−'}${Math.abs(Math.round(DR[s].chg))}%`;
const nm = { SRF: 'SRF', NAVINFLUOR: 'Navin', PIIND: 'PI', AARTIIND: 'Aarti', DEEPAKNTR: 'Deepak', VINATIORGA: 'Vinati', CLEAN: 'Clean Science', ATUL: 'Atul' };
const pname = p => ({ PCBL: 'PCBL Chemical', EPIGRAL: 'Epigral', NEOGEN: 'Neogen Chemicals', FLUOROCHEM: 'Gujarat Fluorochemicals', HEGAM: 'HEG Advanced Materials', GRAPHITE: 'Graphite India' }[p.symbol] || p.name);
const g2629 = (Math.pow(F.eps[2] / 14.89, 1 / 3) - 1) * 100;
const trough = FM.troughYears.length ? FM.troughYears.join(', ') : 'none';

const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: 'Valuation: 25x Sep-28E earnings gives {{dcf.tp|inr}}',
  blocks: [
    ...streetBlocks('HSCL', {
      rating,
      streetIntro: 'Only one institutional broker covers Himadri: **ICICI Securities values it on a sum of the parts, with the core business on FY28E EV/EBITDA** (12x in Jan-2026, 15x in Apr-2026; the July multiple behind its ₹720 target is not public). We use **P/E** instead, for four reasons: Himadri has net cash and little interest, so for the core EV/EBITDA and P/E carry the same information; ICICI\'s other parts (tyres, batteries, investments) are not disclosed, so we cannot copy them; management sets its goal in profit (₹1,100 cr+ PAT in FY28); and retail brokers use P/E. Our EV/EBITDA cross-check replicates ICICI\'s core method. We apply the multiple to the earnings the market will look at in September 2027 (Sep-28E: half FY28E, half FY29E).',
      street: [
        ['ICICI Securities (17-Jul-26)', 'Hold', 720, 'SoTP (core EV/EBITDA)', 'n.d.', 'FY28E', 'Continued value creation in the core; Birla Tyres ramping up'],
        ['ICICI Securities (28-Apr-26)', 'Hold', 550, 'SoTP (core EV/EBITDA)', '15x', 'FY28E', 'Raised EBITDA 16-25% on Others; batteries from FY28'],
        ['ICICI Securities (22-Jan-26)', 'Hold', 470, 'SoTP (core EV/EBITDA)', '12x', 'FY28E', 'Speciality black spreads under pressure'],
        ['Mehta Equities (17-Feb-26)', 'Buy on dips', 571, 'P/E (+ battery at EV/IC)', '30x', 'FY27E', 'Better mix; battery growth; investment phase temporary'],
        ['IDBI Capital, derivatives desk (9-Jun-26)', 'Buy', 900, 'Technical', '–', '–', 'Momentum; stop-loss ₹579'],
      ],
      ourThesis: 'Excellent core; the price already pays for FY28 goals and the battery bet',
      streetSource: 'Broker notes and press to 30-Sep-2026 (Trendlyne, Whalesbook, Business Today, Multibagg). Only the 17-Jul ICICI Securities call was standing as an institutional view on 30-Sep-2026. "At our EPS" applies P/E multiples to GAM EPS; n.d. = not disclosed',
      derivationIntro: 'We start from the stock\'s own one-year-forward P/E since April 2021 and test it against the sector, growth, peers and returns.',
      derivation: [
        ['1. Its own history', `One-year-forward P/E median ${n1(fwdMed)}x since Apr-2021 (trough years excluded: ${trough}). Two regimes: ~${Math.round(fwdTo23)}x in 2021-23 as a commodity tar processor (ROE 2-10%), ~${Math.round(fwdSince24)}x since 2024 as a speciality mix (ROE 15-18%)`, `Starting point: ${n1(fwdMed)}x ≈ **25x**`],
        ['2. Sector de-rating', `On ${ASOF_TXT} listed chemical peers traded a median ${Math.abs(Math.round(sectorDerate))}% below their five-year median P/E (${CHEM.map(s => `${nm[s]} ${pct(s)}`).join(', ')}). Carbon and graphite names traded above theirs only on depressed earnings (PCBL ${pct('PCBL')}, HEG ${pct('HEGAM')}, Graphite India ${pct('GRAPHITE')}). Himadri re-rated: ${n1(DR.HSCL.now)}x trailing vs a ${n1(DR.HSCL.med)}x median`, 'No cut: Himadri\'s median already includes 2021-23 at 8-13x, when chemical peers were at their richest. Applying the cut gives ~18x (our bear case)'],
        ['3. Growth', `Our EPS grows ~${Math.round(g2629)}% a year over FY26-29E; the street's FY27 profit growth is ~24%; management's FY28 goal implies ~21% a year from FY26`, 'No premium: growth slows as margins normalise'],
        ['4. Peers', `Epigral ${n1(PEERS.EPIGRAL.pe)}x (ROE ${PEERS.EPIGRAL.roe}%), PCBL ${n1(PEERS.PCBL.pe)}x (ROE ${PEERS.PCBL.roe}%), HEG ${n1(PEERS.HEGAM.pe)}x, Gujarat Fluorochemicals ${n1(PEERS.FLUOROCHEM.pe)}x trailing; Himadri ${n1(PEERS.HSCL.pe)}x (ROE ${PEERS.HSCL.roe}%)`, `25x Sep-28E = ${n1(25 * epsSep28 / F.eps[1])}x our FY28E: in line with large chemical peers, below trough-inflated carbon names`],
        ['5. Returns', `ROE ~${Math.round(F.roe[1])}% in FY28E vs a 12.5% cost of equity; free cash flow negative in FY27-28E (−₹${n0(-F.fcf[0])} cr and −₹${n0(-F.fcf[1])} cr) as ₹2,000 cr of capex and working capital absorb cash`, 'Supports the historical multiple, not a premium to it'],
        ['6. What the price implies', `${n1(price / epsSep28)}x Sep-28E EPS; after valuing the core at 16x and Others at 10x EBITDA, ~₹${n0(Math.round(impliedNem / 100) * 100)} cr for battery materials`, 'The market already pays for a large battery business'],
      ],
      derivationSource: `Screener.in (P/E history to ${ASOF_TXT}); forwardMedian (valuation-blend.js); broker notes; GAM Research`,
      history: { field: 'eps', from: '2021-04-01', median: Math.round(fwdMed), label: `Median since 2021: ${n1(fwdMed)}x`, title: 'One-year-forward P/E: our 25x vs history', yearStep: 1 },
      crossNote: `**What the cross-checks tell us.** EV/EBITDA (16x Sep-28E EBITDA, close to ICICI Securities' 15x core multiple, plus net cash and investments at Sep-27E) gives ₹${n0(mv('ev').value)}, ${Math.abs(Math.round(mv('ev').vsTarget))}% below the P/E target, so the street's method lands in the same place on our numbers. The DCF (₹${n0(mv('dcf').value)}) is lower still: capex of ~₹1,000 cr a year in FY27-28 and working capital at ~29% of revenue keep free cash flow negative until FY29, and ${Math.round(V.tvShare)}% of the value sits in the terminal year. On every method the share price needs EBITDA per tonne to stay near Q1FY27's peak and batteries to arrive on time.`,
    }),
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', '{{as.scenarios.bull.narrative}} FY29E EPS ₹{{scen.bull.eps.2|n1}}; 32x Sep-28E EPS (the post-2024 forward median).'],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', 'Core EBITDA per tonne ~₹20,500-21,500, volume +5-8% a year; tyres at half of management\'s path; LFP a third of Phase 1 by FY29; 25x Sep-28E EPS.'] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', '{{as.scenarios.bear.narrative}} FY29E EPS ₹{{scen.bear.eps.2|n1}}; 18x (our median cut by the sector de-rating).'],
    ], source: 'GAM Research' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-39E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Add: net cash and investments at Mar-27E (model basis)', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
      { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ], source: 'GAM Research (discount rate 12.5% = cost of equity = WACC with net cash, beta 1.0; terminal growth 5.5%)' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): discount rate down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Listed peers', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', 'EV/EBITDA (x)', 'ROE', 'P/E vs 5-yr median'], rows: ctx.PEER_SYMS.map(s => PEERS[s]).map(p => [p.symbol === 'HSCL' ? '**Himadri Speciality**' : pname(p), n0(p.mcapCr), n0(p.revenue), p.ebitdaMargin + '%', n1(p.pe), n1(p.evEbitda), p.roe + '%', pct(p.symbol)]), source: `Screener.in, trailing multiples at the NSE close on ${ASOF_TXT}` } },
  ],
};

const P7 = require('./HSCL.part7');
module.exports = {
  rating, cover: P2.cover,
  sections: p => [P3.narrative, P3.business, P3.history, P4.industry, P4.tailwind, P4.coreSeg, P4.carbonBlack, P5.tyres, P5.battery, P5.moat, p.financials, p.capital, P5.quality, p.balance, P6.ownership(p.ownershipBase), P6.governance, P6.forecasts, P6.street, valuation, P7.risks, p.statements, P7.glossary],
  statementNotes: P7.statementNotes,
};
