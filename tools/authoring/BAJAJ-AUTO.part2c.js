// Bajaj Auto report, part 2c: KTM (Bajaj Mobility AG) - the 2025 rescue, the turnaround and how we treat it.
const X = require('./BAJAJ-AUTO.ctx');
const { n0, n1, FY26, KTM, KS, ktmMkt, SOTP, SQ, SH } = X;
const H = KTM.history, q1 = KTM.q1_2026, q2 = KTM.q2_2026, h1 = KTM.h1_2026;

const ktm = {
  id: 'ktm', nav: 'KTM', kicker: 'Business line', title: 'KTM: Bajaj bought control of a broken company cheaply; the turnaround has started but is not yet profitable',
  blocks: [
    { p: `Bajaj has owned part of KTM since 2007 and builds KTM's small bikes in Chakan. In 2024 KTM's parent ran out of cash after over-producing into a falling market: revenue fell from €${n0(H[2].revenueEurM)} m (2023) to €${n0(H[3].revenueEurM)} m and it lost €${n0(-H[3].netEurM)} m. KTM AG went through court-supervised restructuring; production stopped until the end of July 2025. Bajaj arranged an €880 m equity-and-debt package to pay the creditors' cash quota and restart the plants, then exercised call options on the founder's stake. Since 18-Nov-2025 BAIH BV owns 100% of Bajaj Auto International Holdings AG, which owns 74.94% of Bajaj Mobility AG (listed in Zurich and Vienna), which owns KTM AG. In Feb-2026 KTM AG refinanced €550 m with four international banks and repaid Bajaj's loans.` },
    { pair: [
      { type: 'column', title: 'KTM revenue: €2.7 bn to €1.0 bn, now rebuilding', unit: 'Bajaj Mobility (KTM) revenue (EUR m)', x: H.map(h => String(h.y)), series: [{ name: 'Revenue', values: H.map(h => h.revenueEurM), fmt: 'num' }], labels: 'all', source: 'Bajaj Mobility AG annual report 2025' },
      { type: 'column', title: 'Quarterly: EBITDA turning up, still a net loss', unit: 'Bajaj Mobility, EUR m (IFRS)', x: ['Q1-26', 'Q2-26'], series: [{ name: 'Revenue ÷ 10', values: [Math.round(q1.revenueEurM / 10), Math.round(q2.revenueEurM / 10)], fmt: 'num' }, { name: 'EBITDA', values: [q1.ebitdaEurM, q2.ebitdaEurM], fmt: 'n1' }, { name: 'Net result', values: [q1.netEurM, q2.netEurM], fmt: 'n1' }], labels: 'all', source: 'Bajaj Mobility AG Q1 and H1 2026 reports' },
    ] },
    { exhibit: { type: 'table', title: 'KTM by the numbers', head: ['', '2023', '2024', '2025', 'H1 2026'], rows: [
      ['Revenue (EUR m)', n0(H[2].revenueEurM), n0(H[3].revenueEurM), n0(H[4].revenueEurM), n1(h1.revenueEurM)],
      ['EBITDA margin', `${H[2].ebitdaMarginPct}%`, `${H[3].ebitdaMarginPct}%`, '86.6% (incl. EUR1,193 m restructuring gain)', `${n1(h1.ebitdaEurM / h1.revenueEurM * 100)}%`],
      ['EBIT (EUR m)', n0(H[2].ebitEurM), n0(H[3].ebitEurM), n0(H[4].ebitEurM), n1(h1.ebitEurM)],
      ['Net result (EUR m)', n0(H[2].netEurM), n0(H[3].netEurM), n0(H[4].netEurM), n1(h1.netEurM)],
      ['Net debt (EUR m, period end)', n0(H[2].netDebtEurM), n0(H[3].netDebtEurM), n0(H[4].netDebtEurM), n1(h1.netDebtEurM)],
      ['KTM/Husqvarna/GASGAS bikes sold by Bajaj Mobility', '–', '–', '209,704 (all brands)', `${n0(h1.ktmBrandUnits)} (H1-25: ${n0(h1.ktmBrandUnitsPy)})`],
    ], source: 'Bajaj Mobility AG annual report 2025 (5-year key figures) and H1 2026 report (27-Aug-2026)' } },
    { bullets: [
      `**What is improving.** H1 2026 revenue +65% (motorcycles +109%); gross margin 21.2%; EBIT positive in Q2 (€1.3 m); dealer and factory stock cut by another 10,190 bikes; fixed costs and headcount cut (average employees −16%); financing cost down after the refinancing (Q2 financial result −€16.6 m vs −€24.1 m in Q1).`,
      `**What is not.** Net debt €${n0(h1.netDebtEurM)} m against equity of €${n0(h1.equityEurM)} m (gearing 243%); still a net loss (−€${n0(-h1.netEurM)} m in H1); bank covenants tighten from Jun-2027 (net debt/EBITDA ≤4.5x, then 3.5x, then 2.5x); US tariffs and the West Asia conflict are named risks; no numeric 2026 guidance.`,
      `**In Bajaj's accounts.** Six weeks of KTM cost Bajaj ₹${n0(FY26.ktmLossBeforeTax6wk)} cr before tax in Q4FY26 (minorities took ₹170 cr), offset by ₹${n0(FY26.remeasurementGain + FY26.fctrGain)} cr of one-off accounting gains on taking control. In Q1FY27 the "KTM, other subsidiaries and consolidation" line made ₹${n0(SQ.at(-1).subEbitda)} cr of EBITDA and minorities absorbed a ₹37 cr loss. Bajaj also earns on KTM indirectly: it builds India-made KTMs (exports ~17,500 in Q4FY26) and sells KTM and Triumph in India.`,
    ] },
    { callout: `**How we value it:** like the street, separately and at market. Bajaj's 74.94% of Bajaj Mobility was worth ₹${n0(ktmMkt)} cr at the 30-Sep-2026 close (€${KS.priceEur} x ${KS.sharesM} mn shares, ~₹${KS.eurInr} per euro); less a ${KS.discountPct.base}% holding discount (thin free float, no plan to sell; Anand Rathi uses 20%) that is ₹${n0(SOTP.base.ktm * SH)} cr or ₹${n0(SOTP.base.ktm)} a share, ~${Math.round(SOTP.base.ktm / SOTP.base.ps * 100)}% of our target. KTM's profit is NOT in the standalone EPS we value on P/E, so there is no double count. The market price already assumes a turnaround (EV ~€1.9 bn, ~1.4x 2026 revenue at H1 run-rate); Bajaj's own fair value at acquisition implied ~₹7,880 cr for 100% of the holding company.` },
  ],
};

module.exports = { ktm };
