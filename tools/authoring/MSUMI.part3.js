// Motherson Sumi Wiring India report, part 3: the greenfields, copper/wages and the margin, the JV and related parties, moat.
const X = require('./MSUMI.ctx');
const { C, D, SQ, QL, RP, n0, n1, feesFy26, feesPct, feesOfEbitda, rpPurchPct } = X;
const G = C.guidance, Q4 = C.q4fy26, Q1 = C.q1fy27;
const MQ = X.M.quarterly, ql8 = MQ.labels.slice(-8);

const greenfields = {
  id: 'greenfields', nav: 'The greenfields', kicker: 'New plants', title: 'Three new plants sell ~₹450 cr a quarter and have just reached breakeven; Pune is half empty',
  blocks: [
    { p: `MSWIL built its first new plants since the demerger in FY25-26 to follow customers\' new capacity: Kharkhoda in Haryana (combustion-engine cars, ~${Q4.utilisation.kharkhoda}% utilised), Navagam in Gujarat (EV and petrol, ~${Q4.utilisation.navagam}%, a new model started in Q4FY26) and Pune (EV and petrol, ~${Q4.utilisation.pune}% because a customer postponed a launch). Two smaller sites followed: Pathredi (EV and petrol, production from Q4FY26) and Chennai (EV, volumes delayed). Together they sold ₹1,040 cr in FY26 and ~₹450 cr a quarter by Q4FY26-Q1FY27, against capacity of ~₹2,000 cr a year. Start-up losses were ₹122 cr in FY25 and ₹127 cr in FY26 (1.1 points of margin), falling to ~₹14 cr in Q4FY26. Management says the plants were at breakeven in Q4 "if you just remove the copper... lag impact" and will contribute to profit "in one or two quarters". The existing plants run at ~${Q4.utilisation.existing}%, the level at which MSWIL starts building again.` },
    { pair: [
      { type: 'column', title: 'Greenfield revenue: ₹5 cr in Q1FY25, ₹452 cr in Q1FY27', unit: 'Greenfield revenue (₹ crore)', x: QL, series: [{ name: 'Greenfield revenue', values: SQ.map(q => q.greenfield), fmt: 'num' }], labels: 'all', source: 'Company decks; Emkay Exhibit 4 (Q1FY27 = Emkay estimate)' },
      { type: 'column', title: 'Start-up losses shrinking: −₹46 cr in Q2FY26, −₹14 cr in Q4FY26', unit: 'Greenfield EBITDA (₹ crore)', x: QL, series: [{ name: 'Greenfield EBITDA', values: SQ.map(q => q.greenfieldEbitda), fmt: 'num' }], labels: 'all', source: 'Company decks; Emkay Exhibit 4 (Q1FY27 = Emkay estimate)' },
    ] },
    { exhibit: { type: 'table', title: 'The new plants (status at Aug-2026)', head: ['Plant', 'Powertrain', 'Status', 'Utilisation'], rows: [
      ['Kharkhoda (Haryana)', 'Petrol/diesel', 'Operating, as planned', '~80%'],
      ['Navagam (Gujarat)', 'EV + petrol', 'Ramping up; new model from Q4FY26', '~60%'],
      ['Pune (Maharashtra)', 'EV + petrol', 'Customer volumes below plan (launch postponed)', '~40-50%'],
      ['Pathredi', 'EV + petrol', 'Production from Q4FY26', 'n.d.'],
      ['Chennai (Tamil Nadu)', 'EV', 'Customer volumes delayed', 'n.d.'],
    ], source: 'Q4FY26 presentation p5; Q4FY26 call (28-Apr-2026); Q1FY27 call (4-Aug-2026)' } },
    { callout: `**Our view:** the greenfields are the cleanest source of margin recovery: going from a ₹127 cr loss to breakeven adds ~1 point of margin on FY26 revenue. We assume greenfield revenue of ₹{{as.lineBuild.greenfield.0|num}} / {{as.lineBuild.greenfield.1|num}} / {{as.lineBuild.greenfield.2|num}} cr. The risk is Pune: a plant built for one customer\'s model sits half empty until that model arrives or a new customer is found ("it might... slow down maybe for a quarter or 2", Q4 call).` },
  ],
};

const margins = {
  id: 'margins', nav: 'Copper, wages & margins', kicker: 'Margins', title: 'Copper, wages and the arithmetic of pass-through: why 13% margins are not coming back',
  blocks: [
    { p: `Three things took the EBITDA margin from 10.9% in Q1FY25 to 7.6% in Q1FY27. **Copper**: it is 24-28% of cost of goods and is passed to customers at cost, but with a lag: most customers reset prices every three months, a few every six. Copper rose from ₹883/kg in Q1FY26 to ₹1,348/kg in Q1FY27, so MSWIL kept paying today\'s price while billing yesterday\'s; the CFO put the Q4FY26 hit at "2% to 2.5% on the bottom line". Raw materials rose to ${n1(MQ.materialPct.at(-2))}% of revenue in Q4FY26 and ${n1(MQ.materialPct.at(-1))}% in Q1FY27. **Wages**: minimum wages in the NCR region, where many plants are, rose 35-40% in 2026, "much higher than what would have been anticipated"; employee cost jumped to ₹${n0(Q1.employeeCost)} cr in Q1FY27 (+${Q1.employeeGrowth}% year on year). Recovery is "constructive discussions" with no timeline. **Greenfields**: covered in the previous chapter.` },
    { pair: [
      { type: 'line', title: 'Raw materials up from 65% to 69-70% of revenue', unit: '% of revenue', x: ql8, series: [{ name: 'Materials', values: MQ.materialPct.slice(-8), fmt: 'pct0' }], labels: 'all', min: 60, max: 72, source: 'Quarterly results (Screener.in cost split)' },
      { type: 'line', title: 'Staff cost: 15.5% of revenue in Q4FY26, 17.7% in Q1FY27', unit: '% of revenue', x: ql8, series: [{ name: 'Employee cost', values: MQ.employeePct.slice(-8), fmt: 'pct0' }], labels: 'all', min: 10, max: 22, source: 'Quarterly results (Screener.in cost split); Q1 carries the annual wage revision' },
    ] },
    { exhibit: { type: 'table', title: 'The pass-through arithmetic: copper alone lowers the margin even when fully recovered', head: ['', 'Before', 'Copper +50%, fully passed on', 'Change'], rows: [
      ['Revenue', '100.0', '111.7', '+12%'], ['Copper cost (26% of costs)', '23.4', '35.1', '+50%'], ['Other costs', '66.6', '66.6', '–'],
      ['EBITDA', '10.0', '10.0', 'unchanged in rupees'], { hl: true, cells: ['**EBITDA margin**', '**10.0%**', '**9.0%**', '**−1.0 point**'] },
    ], source: 'GAM illustration using the CFO\'s 24-28% copper share of cost (Q4FY26 call). With a lag, the margin first falls further, then recovers to the lower level.' } },
    { callout: `**What we assume:** Q2-Q4 FY27 at ~8.5% as the copper lag unwinds and greenfields turn positive, the wage increase recovered only partly and late: FY27E {{as.ebitdaMargin.0|pct}}, FY28E {{as.ebitdaMargin.1|pct}}, FY29E {{as.ebitdaMargin.2|pct}}. Brokers assume 8.9-9.5% for FY27 and 9.5-10.5% for FY28. Management\'s own frame is ROCE ("idea is to have it more than 40%"), not margin, which tells you where the bargaining with customers ends: a fair return on capital, not a fixed share of revenue.` },
  ],
};

const jv = {
  id: 'jv', nav: 'The JV & related parties', kicker: 'Structure', title: `Two partners, two tolls: ${Math.round(rpPurchPct)}% of purchases and ${n1(feesPct)}% of revenue in fees go to SAMIL and Sumitomo`,
  blocks: [
    { p: `MSWIL\'s two promoters are also its biggest suppliers. In FY26 it bought ₹${n0(RP.samilPurchasesFy26)} cr of wires, terminals, connectors, tubes and EV components from SAMIL and ₹${n0(RP.swsPurchasesFy26)} cr of child parts from Sumitomo: ₹${n0(RP.purchasesFromJvPartnersFy26)} cr, ~${Math.round(rpPurchPct)}% of its ₹${n0(RP.rawMaterialPurchasesFy26)} cr of raw-material purchases (FY25: ₹${n0(RP.purchasesFromJvPartnersFy25)} cr). On top, it pays Sumitomo a royalty for technology (₹${RP.royaltyToSwsFy26} cr; ₹${RP.royaltyFy24} cr in FY24) and SAMIL a management fee set equal to that royalty (₹${RP.mgmtFeeToSamilFy26} cr), plus ₹${RP.samilFunctionalSupportFy26} cr for SAMIL\'s "functional support services" and ~₹${RP.samilLeaseAndDepositsFy26} cr of rent and deposits for plants SAMIL owns. The fees alone were ₹${n0(feesFy26)} cr, ${n1(feesPct)}% of revenue and ${Math.round(feesOfEbitda)}% of EBITDA. For FY27 shareholders were asked (Jul-2026 AGM) to approve up to ₹${n0(RP.fy27ApprovedSamil)} cr of dealings with SAMIL and ₹${n0(RP.fy27ApprovedSws)} cr with Sumitomo, including ₹${RP.fy27ApprovedRoyalty} cr each of royalty and management fee and a new ₹${RP.fy27ApprovedCopperWireSaleToSamil} cr sale of copper wire to SAMIL.` },
    { exhibit: { type: 'table', title: 'What flows to the JV partners (₹ crore)', head: ['Item', 'FY25', 'FY26', 'FY27 approved (ceiling)', 'Who'], rows: [
      ['Purchases of materials and capital goods', n0(RP.purchasesFromJvPartnersFy25), n0(RP.purchasesFromJvPartnersFy26), n0(RP.fy27ApprovedSamilPurchases + RP.fy27ApprovedSwsPurchases), 'SAMIL and Sumitomo'],
      ['Royalty (technology)', n1(RP.royaltyFy25), n1(RP.royaltyToSwsFy26), RP.fy27ApprovedRoyalty, 'Sumitomo Wiring Systems'],
      ['Management fee (= royalty)', n1(RP.mgmtFeeFy25), n1(RP.mgmtFeeToSamilFy26), RP.fy27ApprovedMgmtFee, 'SAMIL'],
      ['Functional support services', 'n.d.', RP.samilFunctionalSupportFy26, n0(RP.fy27ApprovedSamilSupport), 'SAMIL'],
      ['Leases and deposits', 'n.d.', `~${RP.samilLeaseAndDepositsFy26}`, '115', 'SAMIL'],
      { hl: true, cells: ['**Fees as % of revenue**', '', `**${n1(feesPct)}%**`, '', 'Royalty + management fee + support + design'] },
      ['Memo: payables to the JV partners at year-end', n0(RP.payablesToJvPartnersMar25), n0(RP.payablesToJvPartnersMar26), '', 'They fund part of the working capital'],
    ], source: 'AR FY26 notes 26 and 31; AGM notice (material related-party transactions for FY2026-27)' } },
    { bullets: [
      '**Why it exists:** the partners bring real things: Sumitomo\'s harness technology and design tools, SAMIL\'s in-house wires, connectors and terminals, and their joint relationships with Japanese and Indian carmakers. The annual report states that sales and purchases are at list prices available to third parties.',
      '**Why it matters:** a minority shareholder in MSWIL owns the assembly margin; the component margin stays with SAMIL (which owns 33% of MSWIL) and Sumitomo. As MSWIL grows, so do the partners\' sales to it and the fees, which rise with revenue.',
      '**Customer allocation:** Hyundai and Kia are served by a different SAMIL joint venture (Q4FY26 presentation), not by MSWIL. The group decides which listed or unlisted entity serves which customer.',
    ] },
  ],
};

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: incumbency and scale in Indian harnesses, but no pricing power',
  blocks: [
    { verdicts: D.moat, head: ['Dimension', 'Verdict', 'Evidence', 'So what'], title: 'Moat scorecard', source: 'GAM research compilation (annual report, presentations and calls to Aug-2026; broker notes)' },
    { callout: '**Verdict: a real but narrow moat.** MSWIL is the incumbent supplier on most of India\'s best-selling cars, with Sumitomo\'s technology and plants next to every major customer; a harness is chosen for each model, so the incumbent keeps the business for that model\'s life. That shows up in growth well above the market and ROCE near 40%. But it has no pricing power: copper and parts are passed through, labour costs must be negotiated, and one customer takes 41% of output. Part of the value it creates is captured by its two partners. It is a high-return toll on Indian car production, not a franchise that sets its own prices.' },
  ],
};

module.exports = { greenfields, margins, jv, moat };
