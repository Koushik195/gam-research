// Lemon Tree report, part 5b: cross-checks, scenarios, DCF, peers (valuation chapter, continued) and risks & honest summary.
const X = require('./LEMONTREE.ctx');
const { F, V, AS, n0, n1, pc, ASOF_TXT, price, mv, hm, pem, HPE, HPErep, FM, peNow, PEERS, drEv, drPe, CORE, sectorDrPe, peAfter, shortName, rating,
  buyBelow, sellAbove, ruleText, Q1, SEG, impliedHotelMult, impliedWacc, MIN_PCT, perTurn, tpAt, WIN, shortDate, HEV, evNow, medAll, streetMultFor, schemeUpliftPs, minPs } = X;
const so = mv('sotp'), pe = mv('pe'), dc = mv('dcf');
const pctv = v => `${v >= 0 ? '+' : ''}${Math.round(v)}%`;

const blocks = [
  { exhibit: { type: 'table', title: 'Target price and cross-checks', head: ['Method', 'Role', 'Basis', 'Multiple', 'Value / share (₹)', 'vs target', 'Bull (₹)', 'Bear (₹)'], rows: [
    ['**Sum of the parts (EV/EBITDA)**', '**Target**', 'Sep-28E EBITDA; less minorities and net debt', `${hm.base}x (bull ${hm.bull}x, bear ${hm.bear}x)`, '**{{dcf.blend.methods.0.value|num}}**', '–', '{{scen.bull.blend.methods.0.value|num}}', '{{scen.bear.blend.methods.0.value|num}}'],
    ['P/E', 'Cross-check', `Sep-28E EPS ₹${n1(pe.metric)}`, `${pe.mult}x (bull ${pem.bull}x, bear ${pem.bear}x)`, '{{dcf.blend.methods.1.value|num}}', pctv(pe.vsTarget), '{{scen.bull.blend.methods.1.value|num}}', '{{scen.bear.blend.methods.1.value|num}}'],
    ['DCF', 'Cross-check', `15-year FCFF, ${n1(V.ke)}% WACC, g ${V.terminalGrowth}%`, `implies ${n1(V.intrinsicTp / F.eps[1])}x FY28E EPS`, '{{dcf.blend.methods.2.value|num}}', pctv(dc.vsTarget), '{{scen.bull.blend.methods.2.value|num}}', '{{scen.bear.blend.methods.2.value|num}}'],
    { hl: true, cells: ['**12-month target (rounded)**', '', '', '', '**{{dcf.tp|inr}}**', '{{dcf.upside|chg}} vs price', '{{scen.bull.tp|inr}}', '{{scen.bear.tp|inr}}'] },
  ], source: 'GAM Research' } },
  { callout: `**What the cross-checks tell us.** The P/E check uses Lemon Tree's own one-year-forward P/E since ${shortDate(WIN)} on attributable EPS before exceptional items (median ${n1(HPE.med)}x; ${n1(HPErep.med)}x on reported EPS; forwardMedian since Apr-2021 ${n1(FM.median)}x), cut by the ${Math.abs(Math.round(sectorDrPe))}% P/E move of the same peers (${CORE.map(s => `${shortName(s)} ${pc(drPe[s])}`).join(', ')}) = ${n1(peAfter)}x → ${pe.mult}x: ₹${n0(pe.value)}, ${pctv(pe.vsTarget)} vs the target, because EPS grows faster than EBITDA as interest falls. The DCF (₹${n0(dc.value)}) is also above the target: at an 11.3% WACC the cash flows of a business that needs little capex justify more than ₹${n0(price)}; the price implies a ~${n1(impliedWacc)}% discount rate. The DCF deducts minorities only through the tax line (${AS.taxRate[0]}% incl. ~21% of profit after tax), which is approximate. Both cross-checks sit above the SOTP, so the target is the most conservative of the three.` },
  { exhibit: { type: 'table', title: 'What moves the target', head: ['Item', '₹ per share', 'Why it matters'], wide: [2], rows: [
    ['Each 1x on Sep-28E EBITDA (net of minorities)', `~${n0(perTurn)}`, `So ${hm.base}x → ${n1(HEV.med)}x (own median, no sector move) adds ~₹${n0((HEV.med - hm.base) * perTurn)} a share.`],
    ['Minorities (Warburg Pincus\'s 41.09% of Fleur)', `−${n0(minPs)}`, `${MIN_PCT}% of the equity value; the share of profit they took in FY26.`],
    ['The scheme on its announced terms', `~+${n0(schemeUpliftPs)}`, 'Warburg\'s claim falls to 26.01% of a larger Fleur; before its ₹960 cr primary. Not in the target.'],
    ['Each 1 pp of FY28E-29E margin', `~${n0(SEG.hotel.revenue[1] / 100 * hm.base * (1 - MIN_PCT / 100) / X.sh)}`, 'The GST and renovation promises are worth ~2-3 pp.'],
    [`Street median ₹${n0(medAll)}`, n0(medAll), `Needs ~${n1(streetMultFor(medAll))}x Sep-28E on our numbers.`],
  ], source: 'GAM Research' } },
  { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
    ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Revenue growth +2 pp a year, margin +1.5 pp; ${hm.bull}x (75th percentile of the own history after the sector move).`],
    { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Revenue +{{F.salesGrowth.0|pct}} / +{{F.salesGrowth.1|pct}} / +{{F.salesGrowth.2|pct}}; margin ${n1(F.ebitdaMargin[0])}% → ${n1(F.ebitdaMargin[2])}%; ${hm.base}x Sep-28E EBITDA.`] },
    ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Revenue growth −4 pp a year, margin −2 pp; ${hm.bear}x (25th percentile after the sector move).`],
  ], source: 'GAM Research (scenario minorities use the base-case net debt)' } },
  { h: 'The DCF cross-check in detail' },
  { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
    ['Present value of FY28-42E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
    ['Less: model net debt at Mar-27E (incl. lease liabilities)', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
    { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
  ], source: `GAM Research; discount rate ${n1(V.ke)}% = our WACC (beta set to ${AS.dcf.beta}, see Assumptions); the tax line includes minorities (${AS.taxRate[0]}%); capex fades to ${AS.dcf.fadeCapexPctTo}% of revenue` } },
  { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): discount rate down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
  { exhibit: { type: 'table', title: `Listed hotel peers (trailing, at the ${ASOF_TXT} close)`, head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'EV/EBITDA (x)', 'vs median', 'P/E (x)', 'ROE'], rows: PEERS.map(p => [p.symbol === 'LEMONTREE' ? '**Lemon Tree**' : shortName(p.symbol), n0(p.mcapCr), n0(p.revenue), p.ebitdaMargin + '%', n1(p.evEbitda), pc(drEv[p.symbol]), p.pe > 0 && p.pe < 200 ? n1(p.pe) : 'n.m.', p.roe + '%']), source: `Screener.in (post-Ind AS EBITDA; EV includes lease liabilities), scaled to the NSE close on ${ASOF_TXT}. Medians since Apr-2022; ITC Hotels since Apr-2025.` } },
];

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: 'Our honest summary: a good mid-market franchise priced for the 2026 shock; buy it for the margin recovery and the fee growth, not for the rates',
  blocks: [
    { callout: `**What you are buying:** India's largest mid-market hotel platform, owned hotels at ~74-76% occupancy and ~52% hotel-level margins, a fee business growing 23-42% a year with a signed pipeline almost twice today's managed rooms, and a plan to separate the asset-light manager from the asset owner with Warburg Pincus's capital. Attributable EPS should grow ~${Math.round(X.epsCagrFwd)}% a year as margins recover and debt falls.` },
    { callout: `**What you are paying:** ${n1(evNow.gross)}x one-year-forward EV/EBITDA (its own post-Covid median is ${n1(HEV.med)}x) and ${n1(peNow)}x our FY28E EPS. The peers sit ~${Math.abs(Math.round(X.sectorDrEv))}% below their medians; Lemon Tree ${Math.abs(Math.round(drEv.LEMONTREE))}% below its own. On the street's method with our inputs and the house rule for the multiple, the target is {{dcf.tp|inr}} ({{dcf.upside|chg}}): a ${rating}. The rating does not need a re-rating of the sector, only that Lemon Tree trades in line with it. Without the sector adjustment the same SOTP gives ~₹${n0(tpAt(Math.round(HEV.med * 2) / 2))}.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      ['ARR growth back to high single digits in H2FY27', 'Medium', 'Q2-Q3 ARR, corporate demand, rooms above ₹7,500'],
      ['Margin at or above 50% in FY28 as renovation ends', 'Medium', 'Renovation and GST cost as % of revenue (guide ~3.7%)'],
      ['The scheme approved and Fleur listed on its terms', 'Medium', 'SEBI observations, NCLT orders; ~₹' + n0(schemeUpliftPs) + ' a share on our numbers'],
      ['Managed openings on plan (~2,000 keys in FY27)', 'Medium-high', 'Quarterly openings and fee growth'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['Corporate travel stays weak; ARR flat for another year', 'Medium', 'Margin stuck near 47%; bear case {{scen.bear.tp|inr}}'],
      ['Fleur overpays for acquisitions at the top of the cycle, or debt rises past 2x EBITDA', 'Medium', 'Lemon Tree holders own ~74% of Fleur after the scheme'],
      ['The scheme is delayed or changed by regulators or shareholders', 'Medium', 'The minority stays at 41%; structure remains complex'],
      ['APG sells its 14.99% in the market', 'Low-medium', 'Overhang on a stock with ~22% promoter holding'],
      ['New mid-market supply in Mumbai, Bengaluru and NCR', 'Medium', 'Local rates; Aurika Mumbai pricing'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**We would stay buyers below ~₹${n0(buyBelow)}** and turn sellers above ~₹${n0(sellAbove)} on today's numbers; a re-rating of the listed hotel peers would lift our multiple mechanically.`,
      `**Biggest swing factor:** the margin. Each 1 pp of margin is ~₹${n0(SEG.hotel.revenue[1] / 100)} cr of FY28E EBITDA (~₹${n0(SEG.hotel.revenue[1] / 100 * hm.base * (1 - MIN_PCT / 100) / X.sh)} a share at our multiple); each 1x on the multiple is ~₹${n0(perTurn)} a share.`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Owned-hotel occupancy, Q1FY27', v: `${Q1.occPct}%`, d: `ARR ₹${n0(Q1.arr)} (+2%)` },
      { k: 'Third-party fees, Q1FY27', v: `+${Math.round((Q1.fees3p / Q1.fees3pPy - 1) * 100)}%`, d: `₹${Q1.fees3p} cr` },
      { k: 'Forward EV/EBITDA now', v: `${n1(evNow.gross)}x`, d: `median ${n1(HEV.med)}x since Apr-22` },
      { k: 'Hotel peers vs median', v: `${Math.round(X.sectorDrEv)}%`, d: 'IHCL, EIH, ITC Hotels' },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

module.exports = { blocks, risks };
