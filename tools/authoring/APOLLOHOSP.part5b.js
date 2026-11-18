// Apollo report, part 5b: cross-checks, scenarios, DCF, peers (valuation chapter, continued) and risks & honest summary.
const X = require('./APOLLOHOSP.ctx');
const { F, V, AS, n0, n1, pc, ASOF_TXT, price, sh, mv, VP, part, vpart, hospMult, hospSep28, newcoMult, impliedHospMult, HEV, FM, peNow, PEERS, drEv, shortName, rating, buyBelow, sellAbove, ruleText, Q1, SEG, isec, NEWCO_PCT, netDebtSep28 } = X;
const so = mv('sotp'), pe = mv('pe'), dc = mv('dcf');
const pctv = v => `${v >= 0 ? '+' : ''}${Math.round(v)}%`;
const hm = vpart(/^Hospitals/).multiple;
const leasePs = 2877 / sh; // Jun-26 lease liabilities per share, left out of most street net-debt figures

const blocks = [
  { exhibit: { type: 'table', title: 'Target price and cross-checks', head: ['Method', 'Role', 'Basis', 'Multiple', 'Value / share (₹)', 'vs target', 'Bull (₹)', 'Bear (₹)'], rows: [
    ['**Sum of the parts**', '**Target**', 'Sep-28E EBITDA by business; Apollo\'s 59.6% of NewCo', `Hospitals ${hospMult}x (bull ${hm.bull}x, bear ${hm.bear}x)`, '**{{dcf.blend.methods.0.value|num}}**', '–', '{{scen.bull.blend.methods.0.value|num}}', '{{scen.bear.blend.methods.0.value|num}}'],
    ['P/E', 'Cross-check', `Sep-28E EPS ₹${n1(pe.metric)}`, `${pe.mult}x (bull ${pe.multiple.bull}x, bear ${pe.multiple.bear}x)`, '{{dcf.blend.methods.1.value|num}}', pctv(pe.vsTarget), '{{scen.bull.blend.methods.1.value|num}}', '{{scen.bear.blend.methods.1.value|num}}'],
    ['DCF', 'Cross-check', '15-year FCFF, 11.6% discount rate, g 6%', `implies ${n1(V.intrinsicTp / F.eps[1])}x FY28E EPS`, '{{dcf.blend.methods.2.value|num}}', pctv(dc.vsTarget), '{{scen.bull.blend.methods.2.value|num}}', '{{scen.bear.blend.methods.2.value|num}}'],
    { hl: true, cells: ['**12-month target (rounded)**', '', '', '', '**{{dcf.tp|inr}}**', '{{dcf.upside|chg}} vs price', '{{scen.bull.tp|inr}}', '{{scen.bear.tp|inr}}'] },
  ], source: 'GAM Research' } },
  { callout: `**What the cross-checks tell us.** The P/E value (₹${n0(pe.value)}) is ${pctv(pe.vsTarget)} above the SOTP because it capitalises 100% of HealthCo's earnings (Apollo's share falls to 59.6% after the scheme) and ignores the minorities' share of value; adjust for those and it lands close to the SOTP. The DCF (₹${n0(dc.value)}) is ${Math.abs(Math.round(dc.vsTarget))}% below the target and ~${Math.abs(Math.round((dc.value / price - 1) * 100))}% below the share price: with capex (incl. new leases) at ~6.5% of revenue and an ${n1(V.ke)}% cost of equity, the cash flows the business can show over 15 years do not support today's price unless margins and growth stay high for longer than we assume. Like every Indian hospital stock, Apollo trades on the multiple the market is willing to pay, which it has done consistently since 2021 (it has rarely paid less than ${n1(HEV.p25)}x forward EBITDA for the group).` },
  { exhibit: { type: 'table', title: 'Street basis vs ours: leases and minorities', head: ['Item', '₹ per share', 'Why it matters'], wide: [2], rows: [
    ['Lease liabilities (Jun-26 ₹2,877 cr)', `−${n0(leasePs)}`, 'Brokers apply multiples to post-Ind AS EBITDA (rent excluded) but most deduct net debt excluding leases; consistent treatment deducts them.'],
    ['Minorities in hospital subsidiaries and AHLL step-downs', `−${n0(X.minPs)}`, `${n1(X.HOSP_MIN_SHARE * 100)}% of hospital profit (₹${n1(X.HOSP_MIN26)} cr in FY26; ~₹${n0(X.minProfitSep28)} cr Sep-28E) belongs to partners in Assam, Lucknow, Ahmedabad, Imperial, Indore and others; valued at ${n1(X.minImpliedPe)}x, the hospital multiple converted to earnings (${hospMult}x × ${(1 - X.HOSP_NET_DEBT / (hospMult * hospSep28)).toFixed(3)} ÷ ${X.PAT_TO_EBITDA.toFixed(3)} PAT/EBITDA). HealthCo's minority is excluded (NewCo is valued at 59.6%).`],
    ['ICICI\'s 28x FY28E hospital multiple on our basis', `${n1(X.isecOnOurs)}x Sep-28E`, 'Our 24x is ~8% lower, the rest of the gap to the street is the two deductions above and our lower NewCo value.'],
  ], source: 'Q1FY27 presentation p.34 (leases); AR FY26 note 21 (minorities); GAM Research' } },
  { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
    ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Hospital growth +2pp a year and margin +1pp; HealthCo growth +3pp, margin +0.8pp; hospitals ${hm.bull}x (75th percentile of the group's forward history), NewCo ${newcoMult.bull}x, AHLL 22x.`],
    { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Group revenue +{{F.salesGrowth.0|pct}} / +{{F.salesGrowth.1|pct}} / +{{F.salesGrowth.2|pct}}; hospital margin ${n1(SEG.hcs.adjEbitda[0] / SEG.hcs.revenue[0] * 100)}% → ${n1(SEG.hcs.adjEbitda[2] / SEG.hcs.revenue[2] * 100)}%; hospitals ${hospMult}x, NewCo ${newcoMult.base}x, AHLL 18x Sep-28E EBITDA.`] },
    ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Hospital growth −3pp a year and margin −1.5pp; HealthCo growth −4pp, margin −1pp; hospitals ${hm.bear}x (25th percentile less the sector de-rating), NewCo ${newcoMult.bear}x, AHLL 14x.`],
  ], source: 'GAM Research' } },
  { h: 'The DCF cross-check in detail' },
  { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
    ['Present value of FY28-42E free cash flow (capex incl. new leases)', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
    ['Add: model net cash at Mar-27E (negative = net debt incl. leases and CCPS)', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
    { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
  ], source: 'GAM Research; tax line includes minorities (27.7%); consolidated cash flows incl. 100% of HealthCo, with the CCPS counted as debt' } },
  { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): discount rate down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
  { exhibit: { type: 'table', title: `Listed peers (trailing, at the ${ASOF_TXT} close)`, head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'EV/EBITDA (x)', 'vs 5-yr median', 'P/E (x)', 'ROE'], rows: PEERS.map(p => [p.symbol === 'APOLLOHOSP' ? '**Apollo (group)**' : shortName(p.symbol), n0(p.mcapCr), n0(p.revenue), p.ebitdaMargin + '%', n1(p.evEbitda), pc(drEv[p.symbol]), p.pe > 0 && p.pe < 200 ? n1(p.pe) : 'n.m.', p.roe + '%']), source: `Screener.in (post-Ind AS EBITDA; EV includes lease liabilities), multiples scaled to the NSE close on ${ASOF_TXT}. Apollo's P/E and ROE use Screener's profit before minorities.` } },
];

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: 'Our honest summary: own the franchise, but the price already pays for it',
  blocks: [
    { callout: '**What you are buying:** India\'s strongest hospital brand, with occupancy at 70%, ~26% margins in established hospitals, 25-28% hospital ROCE and a funded plan to add ~4,300 census beds; plus 59.6% of a soon-to-list pharmacy and digital company whose losses have almost gone.' },
    { callout: `**What you are paying:** ${n1(peNow)}x our FY28E EPS and ~${n1(impliedHospMult)}x Sep-28E EBITDA for the hospitals once the other parts are valued. On the street's method with our inputs the target is {{dcf.tp|inr}} ({{dcf.upside|chg}}): a ${rating}. The DCF (₹${n0(dc.value)}) is the warning that the stock already discounts a long run of high growth.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      ['Gurgaon and the five new hospitals break even on schedule (by Q3-Q4 FY28) without diluting the established margin', 'Medium', 'New-hospital losses vs ~₹150 cr guidance'],
      ['NewCo lists and the market values it above a distribution multiple', 'Medium', 'NCLT sanction, listing date, NewCo margin vs 6.5-7%'],
      ['Pricing review fades without caps', 'Medium', 'Government response to the 176th report'],
      ['A pull-back towards ~₹7,900', 'n.a.', `Below ~₹${n0(buyBelow)} the rule turns BUY`],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['Room-rent or package caps for metro hospitals', 'Low-medium', 'Revenue per patient growth halves; bear case {{scen.bear.tp|inr}}'],
      ['North and West greenfields ramp slowly (Worli, Dwarka, Varanasi, Ranchi)', 'Medium', 'Margins stuck near 23%; ROCE falls'],
      ['Keimed swap ratio or NewCo listing disappoints', 'Medium', 'Lower value for Apollo\'s 59.6%'],
      ['Doctor and nurse cost inflation in metros', 'Medium', 'Margin pressure as every chain adds beds'],
      ['Bangladesh and international volumes fall again', 'Low', '6% of in-patient revenue'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**We would turn buyers below ~₹${n0(buyBelow)}** and sellers above ~₹${n0(sellAbove)} on today's numbers; we would cut the hospital multiple if regulation caps prices or new hospitals miss their breakeven dates.`,
      `**Biggest swing factor:** the hospital multiple. Each 1x on Sep-28E hospital EBITDA (₹${n0(hospSep28)} cr) is ~₹${n0(hospSep28 / sh)} a share; each 1pp of hospital margin is ~₹${n0(SEG.hcs.revenue[1] / 100)} cr of FY28E EBITDA (~₹${n0(SEG.hcs.revenue[1] / 100 * hospMult / sh)} a share at our multiple).`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Occupancy, Q1FY27', v: `${Q1.occupancyPct}%`, d: `established ${Q1.estabOccPct}%; FY22 63%` },
      { k: 'Census beds, now → FY31', v: '9,857 → ~14,100', d: '~₹7,500 cr still to spend' },
      { k: 'Revenue per in-patient', v: `₹${n0(Q1.arpp)}`, d: '+8% YoY in Q1FY27' },
      { k: 'Implied hospital multiple', v: `${n1(impliedHospMult)}x`, d: `our ${hospMult}x Sep-28E EBITDA` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

module.exports = { blocks, risks };
