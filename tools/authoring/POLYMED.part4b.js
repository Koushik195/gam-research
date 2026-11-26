// Poly Medicure report, part 4b: management & governance, our forecasts vs the street.
const X = require('./POLYMED.ctx');
const { C, F, A, AS, b, n0, n1, n2, epsU, epsBase, epsRepAll, MIN, waya, lkp, CONS, oiBuild, oiTreas, oiFx, ASSOC, REC, TY, FXR, intBuild, india, intl, RB, grossCash, OIN, ttmOi } = X;
const PAY = C.management.pay;

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Management & governance: an entrepreneurial founder family that has added professional managers; promoter pay is among the highest in mid-cap India',
  blocks: [
    { p: `Himanshu Baid (Managing Director) and Rishi Baid (Joint MD) co-founded and still run Polymed; Vishal Baid became an Executive Director in May-2025 and Jugal Kishore Baid, a founding member, is a non-executive director. Since 2024 the family has hired professionals for the new phase: Rahul Gautam (President, Strategy & Corporate Development; M&A), Naresh Vijayvergiya (CFO), Indranil Mukherjee (CEO India & APAC from Jun-2026, ex-MD of B. Braun India), Renato Rocha (CEO Brazil) and a renal head from Nipro/Fresenius. The board is chaired by D.R. Mehta, a former SEBI chairman (89, non-executive, not independent); five directors are independent.` },
    { exhibit: { type: 'table', title: 'Governance scorecard', head: ['Area', 'Score', 'Evidence'], wide: [2], rows: [
      ['Control and board', 'AMBER', '62.4% family stake; three family executives plus a family non-executive director; 5 of 12 directors independent; chairman 89'],
      ['Pay', 'RED', `FY26: Himanshu Baid ₹${n1(PAY.FY26.himanshu)} cr, Rishi Baid ₹${n1(PAY.FY26.rishi)} cr, Vishal Baid ₹${n1(PAY.FY26.vishal)} cr (₹${n0(PAY.FY26.himanshu + PAY.FY26.rishi + PAY.FY26.vishal)} cr, ~${Math.round((PAY.FY26.himanshu + PAY.FY26.rishi + PAY.FY26.vishal) / C.fy26.pbt * 100)}% of PBT; ${PAY.ratioToMedian.himanshu}x / ${PAY.ratioToMedian.rishi}x / ${PAY.ratioToMedian.vishal}x the median employee); mostly profit-linked commission. FY25: ₹${n1(PAY.FY25.himanshu)} cr and ₹${n1(PAY.FY25.rishi)} cr`],
      ['Management depth and succession', 'GREEN', 'Professional CFO, strategy head and regional CEOs hired in 2024-26; next-generation family members in management'],
      ['Capital allocation', 'AMBER', 'QIPs raised at good prices (₹1,880 in 2024); but ROCE has halved, two acquisitions lose money, and FCF has been negative for four years'],
      ['Disclosure', 'AMBER', 'Therapy and regional splits each quarter; cardiology/oncology revenue withheld as "confidential"; acquisitions\' margins not given on calls'],
      ['Related parties', 'GREEN', 'No material related-party trading found in what we read; family companies hold shares'],
      ['Accounting and audit', 'GREEN', 'Doogar & Associates since 2024; provisional purchase-price allocation for the 2025 deals'],
      ['Minority treatment', 'AMBER', 'Payout only ~11%; two equity raises in four years; CRISIL AA-/Positive'],
    ], source: 'AR FY26 (directors\' report, corporate governance report, remuneration annexure, related-party note); Q1FY27 PPT pp.16-17' } },
    { callout: '**Overall: AMBER.** A capable, ambitious founder team with a good long-term record and a credible professional bench. The flags are pay (₹45 cr to three family executives is hard to justify for a company earning ₹322 cr) and capital allocation: shareholders funded an expansion whose returns have yet to show.' },
  ],
};

const val = (o, key) => (o && o[key] ? Object.entries(o[key]).map(([y, v]) => `${y} ${key === 'eps' ? n1(v) : n0(v)}`).join(' · ') : '–');
const forecasts = {
  id: 'forecasts', nav: 'Forecasts vs the street', kicker: 'Forecasts', title: `Our forecasts: EPS ₹${n1(epsU[0])} / ${n1(epsU[1])} / ${n1(epsU[2])}; FY27 profit growth is modest because depreciation, interest and lower treasury income absorb the EBITDA gain`,
  blocks: [
    { p: `We forecast revenue of {{F.sales.0|num}} / {{F.sales.1|num}} / {{F.sales.2|num}} cr for FY27-29E (+{{F.salesGrowth.0|pct}} / +{{F.salesGrowth.1|pct}} / +{{F.salesGrowth.2|pct}}), EBITDA margin of {{F.ebitdaMargin.0|pct}} / {{F.ebitdaMargin.1|pct}} / {{F.ebitdaMargin.2|pct}} and EPS to shareholders of ₹{{F.eps.0|n1}} / {{F.eps.1|n1}} / {{F.eps.2|n1}} (after adding back PendraCare's minority share of losses, ₹${MIN.map(v => Math.abs(v)).join(' / ')} cr). FY27E EPS is up only ${Math.round((epsU[0] / epsBase[2026] - 1) * 100)}% on FY26's ₹${n1(epsBase[2026])} before one-offs: EBITDA grows ~₹90 cr, but D&A rises ~₹34 cr, interest ~₹4 cr, other income falls ~₹18 cr and tax rises. FY28-29E EPS grows 18% a year as the acquisitions and new plants contribute.` },
    { exhibit: { type: 'table', title: 'Revenue build (₹ crore)', head: ['', 'FY26', ...F.years, 'Basis'], wide: [4], rows: [
      ['India', n1(RB.india), ...india.map(n1), `+${RB.indiaGrowth.join(' / ')}%`],
      ['International, organic', n1(RB.intlOrganic), ...intl.map(n1), `+${RB.intlGrowth.join(' / ')}%`],
      ['PendraCare + Citieffe', n1(RB.acquisitions), ...RB.acqLevel.map(n1), 'Full year from FY27; +10% a year'],
      ['Export incentives', n1(RB.otherOp), ...RB.otherOpLevel.map(n1), 'Other operating revenue'],
      { hl: true, cells: ['**Revenue (model)**', `**${n0(A.sales[b])}**`, '**{{F.sales.0|num}}**', '**{{F.sales.1|num}}**', '**{{F.sales.2|num}}**', 'Checked in POLYMED.ctx.js'] },
    ], source: 'Q4FY26 and Q1FY27 PPTs; AR FY26 note 38; GAM' } },
    { exhibit: { type: 'table', title: 'GAM vs the street (estimates we could find)', head: ['', 'GAM FY27E', 'GAM FY28E', 'GAM FY29E', 'Waya (24-Dec-25)', 'Others'], wide: [5], rows: [
      ['Revenue (₹ cr)', '{{F.sales.0|num}}', '{{F.sales.1|num}}', '{{F.sales.2|num}}', '~20% growth FY27-28E', 'Guidance FY27 ₹2,300-2,400 cr'],
      ['EBITDA margin', '{{F.ebitdaMargin.0|pct}}', '{{F.ebitdaMargin.1|pct}}', '{{F.ebitdaMargin.2|pct}}', '~28% by FY28E', 'Guidance 23-25% (consolidated)'],
      ['EPS (₹)', '{{F.eps.0|n1}}', '{{F.eps.1|n1}}', '{{F.eps.2|n1}}', val(waya, 'eps'), `LKP (Mar-25) FY27E ₹${lkp.eps.FY27E}; consensus target ₹${n0(CONS.trendlyneTp)} (Trendlyne, ${X.shortDate(CONS.trendlyneDate)})`],
    ], source: 'Waya initiation (24-Dec-2025); LKP (12-Mar-2025); Trendlyne consensus; company guidance; GAM. Consensus EPS standing on 30-Sep-2026 was not retrievable.' } },
    { exhibit: { type: 'table', title: 'How we build profit below EBITDA (₹ crore)', head: ['', 'FY26', ...F.years, 'Basis'], wide: [4], rows: [
      ['Treasury income', n1(X.T26), ...oiTreas.map(n1), `${TY}% on average gross cash (₹${n0(grossCash[0])} cr at Mar-26)`],
      ['Associate (Egypt, 30%)', '5.7', ...ASSOC.map(n1), '+10% a year'],
      ['Grants and miscellaneous', n1(OIN.FY26.grants + OIN.FY26.misc), ...F.years.map(() => n1(REC)), 'FY24-26 average'],
      ['Forex gains', n1(OIN.FY26.forex), ...oiFx.map(n1), `${n2(FXR * 100)}% of international organic revenue (FY24-26 average)`],
      { hl: true, cells: ['**Other income**', '**125.8**', ...oiBuild.map(v => `**${v}**`), `FY26 incl. associate and ₹2.0 cr written back; TTM Jun-26 ₹${n1(ttmOi)} cr`] },
      ['Interest', '18.3', ...intBuild.map(n1), `${AS.debtBuild.rate}% of average debt ₹${AS.debtBuild.mar26} → ${AS.debtBuild.closing.join(' / ')} cr`],
      ['D&A (engine, 5.8% of gross block)', '115.5', ...F.dep.map(n1), 'Q1FY27 run-rate ₹145 cr + new plants'],
      ['Tax + minorities (% of PBT)', '25.0%', ...AS.taxRate.map(v => `${v}%`), `${AS.taxBuild.taxOnPbt.join(' / ')}% tax + minorities`],
    ], source: 'AR FY24-26 other-income notes; Q4FY26 and Q1FY27 PPTs; GAM (checked in POLYMED.ctx.js)' } },
    { callout: `**Where we differ from the street:** the notes we could read (Waya FY28E ₹${waya.eps.FY28E}, LKP FY27E ₹${lkp.eps.FY27E}) were written when margins were expected to rise to ~28%; we keep consolidated margins near 24% because the acquired businesses dilute and costs (wages, freight, R&D) are rising. Our FY28E EPS (₹${n1(epsU[1])}) is ~${Math.round((1 - epsU[1] / waya.eps.FY28E) * 100)}% below Waya's. The swing items are forex gains (~₹2.2-2.7 of EPS a year in our numbers) and the acquisitions' margins.` },
  ],
};

module.exports = { governance, forecasts };
