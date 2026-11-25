// TBO Tek report, part 3: hotels & ancillary, Classic Vacations, airlines, operating leverage (SG&A) and the moat scorecard.
const X = require('./TBOTEK.ctx');
const { D, F, AS, SQ, A26, Q1, q, seg, n0, n1, pc, cvEbitda, cvEbitdaGtv, orgSga, ebitdaToGp } = X;
const QS = SQ.map(x => x.q), r1 = v => Math.round(v * 100) / 100, gg = (a, p) => pc((a / p - 1) * 100);
const q1 = q('Q1FY27'), q0 = q('Q1FY26'), q4 = q('Q4FY26');

const hotels = {
  id: 'hotels', nav: 'Hotels & ancillary', kicker: 'Segment', title: `Hotels: ~${n0(A26.hotGp / A26.gp * 100)}% of gross profit, growing ~16% in constant currency, with margins dented by the Middle East`,
  blocks: [
    { p: `Organic hotels, ancillaries and other products (TBO without Classic Vacations) booked ₹${n0(A26.hotGtv)} cr of GTV in FY26 (+19.3% for hotels and ancillaries, AR) and earned ₹${n0(A26.hotGp)} cr of gross profit, ${n1(A26.hotGpGtv)}% of GTV. Growth comes from new source markets and cities, key-account managers (KAMs) hired in FY25-26 and more agents transacting each month; the margin comes from directly contracted supply (Platinum collection) and the mix of markets. In Q1FY27 organic hotel GTV grew ${gg(q1.hotGtv, q0.hotGtv)} in rupees but only ~16% in constant currency, and GP/GTV fell to ${n1(q1.hotGp / q1.hotGtv * 100)}% from ${n1(q4.hotGp / q4.hotGtv * 100)}% in Q4FY26: the Middle East (a higher-margin market) shrank in the mix, and TBO chose to cut prices to keep volume "as long as incremental revenue remained contribution margin positive". Management expects GP/GTV to drift back towards its average.` },
    { pair: [
      { type: 'column', title: 'Organic hotel GTV: +27% in Q1FY27 in rupees (~16% in constant currency)', unit: 'GTV (₹ crore)', x: QS, series: [{ name: 'Hotels, ancillary & others GTV', values: SQ.map(x => Math.round(x.hotGtv)), fmt: 'num' }], labels: 'all', source: 'Shareholders\' letters and decks (Q2FY26 estimated as 64% of GTV)' },
      { type: 'line', title: 'Hotel GP/GTV: 5.6-5.9% in FY26, 5.3% in Q1FY27', unit: 'Gross profit ÷ GTV (%)', x: QS, series: [{ name: 'GP/GTV', values: SQ.map(x => r1(x.hotGp / x.hotGtv * 100)), fmt: 'n1' }], labels: 'all', min: 4.5, max: 6.5, source: 'Shareholders\' letters and decks; GAM Research (includes other products)' },
    ] },
    { callout: `**Our forecast:** GTV +${AS.segments[1].growth.join('% / +')}% (FY27-29E), take rate ${AS.segments[1].revPct.join('% / ')}% and GP/GTV ${AS.segments[1].marginPct.join('% / ')}% (FY26: ${n1(A26.hotGpGtv)}%). That gives gross profit of ₹${seg.hot.adjEbitda.map(n0).join(' / ')} cr. We assume the Middle East stays subdued through FY27 and only part of the margin comes back; the rupee keeps adding a few points to growth.` },
  ],
};

const classic = {
  id: 'classic', nav: 'Classic Vacations', kicker: 'Segment', title: 'Classic Vacations: a quarter of gross profit at ~2.5% of GTV in EBITDA; the synergies are still ahead',
  blocks: [
    { p: `Classic Vacations sells luxury hotels, packages and air to ~10,000 US travel advisors; revenue is booked when the traveller checks in, so Q1 (Apr-Jun) is its peak and Q2 its low. Since 1-Oct-2025 it has added GTV of ₹${n0(q('Q3FY26').cvGtv)} cr, ₹${n0(q4.cvGtv)} cr and ₹${n0(q1.cvGtv)} cr a quarter (net of TBO's own sales to it, ₹64 cr in Q1FY27) and gross profit of ₹${n0(q('Q3FY26').cvGp)} cr, ₹${n0(q4.cvGp)} cr and ₹${n0(q1.cvGp)} cr. Its take rate is ~25% of GTV because it books gross revenue and pays about half of it on to advisors as commission; gross profit is ~13% of GTV. Adjusted EBITDA was ₹${Q1.adjEbitdaCV} cr in Q1FY27 (3.4% of GTV); management calls ~2.5% for a full year "a fair assessment". The cost work (CRM, back office, more US sales staff) is mostly done; the revenue synergy (TBO hotels sold to Classic's advisors, and Classic's luxury supply sold to TBO's agents) needs the platform migration due by end-CY2026.` },
    { exhibit: { type: 'table', title: 'Classic Vacations since acquisition (₹ crore)', head: ['', 'Q3FY26', 'Q4FY26', 'Q1FY27', 'FY27E (GAM)'], rows: [
      ['GTV (net of intercompany)', n0(q('Q3FY26').cvGtv), n0(q4.cvGtv), n0(q1.cvGtv), n0(seg.cv.driver[0])],
      ['Revenue', n0(q('Q3FY26').cvRev), n0(q4.cvRev), n0(q1.cvRev), n0(seg.cv.revenue[0])],
      ['Gross profit', n0(q('Q3FY26').cvGp), n0(q4.cvGp), n0(q1.cvGp), n0(seg.cv.adjEbitda[0])],
      ['Adjusted EBITDA', n1(q('Q3FY26').adjEbitdaCV), n1(q4.adjEbitdaCV), n1(q1.adjEbitdaCV), `~${n0(cvEbitda[0])}`],
      ['EBITDA ÷ GTV', n1(q('Q3FY26').adjEbitdaCV / q('Q3FY26').cvGtv * 100) + '%', n1(q4.adjEbitdaCV / q4.cvGtv * 100) + '%', n1(q1.adjEbitdaCV / q1.cvGtv * 100) + '%', n1(cvEbitdaGtv[0]) + '%'],
    ], source: 'Consolidated less organic (shareholders\' letters and decks); Q1FY27 letter Q2 (Classic: GTV ₹1,300 cr gross, adj. EBITDA ₹43.9 cr); GAM estimates' } },
    { callout: `**So what:** at ~₹${n0(cvEbitda[0])} cr of EBITDA in FY27E, Classic Vacations is ~${n0(cvEbitda[0] / F.ebitda[0] * 100)}% of group EBITDA for a ~₹1,100 cr price: about 10x EBITDA, reasonable for a business that brings TBO a US luxury advisor network it did not have. We model no revenue synergy (GTV +8% a year after FY27E); it is the main upside in our bull case.` },
  ],
};

const air = {
  id: 'air', nav: 'Airlines & operating leverage', kicker: 'Segment', title: 'Air is a 1.2%-of-GTV traffic engine; the real lever is SG&A, which has stopped growing faster than gross profit',
  blocks: [
    { p: `Airlines were ₹${n0(A26.airGtv)} cr of organic GTV in FY26, 93% sold by Indian agents, but only ₹${n0(A26.airGp)} cr of gross profit (${n1(A26.airGpGtv)}% of GTV). The take rate has fallen from 2.6% (Q1FY26) to 2.2% (Q1FY27) as airlines cut commissions and push direct and NDC channels. Air still matters: it brings agents onto the platform daily and lets TBO cross-sell hotels, especially in India, where Q1FY27 air GTV grew 14.7% while India hotels fell 2%.` },
    { p: `**Operating leverage.** TBO spent FY25-26 building its sales force (KAMs) in Europe, APAC, LATAM and the Middle East; organic SG&A growth peaked at ~29% a year and has slowed every quarter since, to 12.3% in Q1FY27 (4% in constant currency). Employee cost rose 17.4% (rupee and increments), hosting fell 13.7%, payment-gateway cost rose with retail GTV. Organic adjusted EBITDA rose 25% on 16% gross-profit growth: EBITDA/GP ${Q1.adjEbitdaToGpOrganicPriorQ}% in Q4FY26 to ${Q1.adjEbitdaToGpOrganicPct}% in Q1FY27. We assume organic SG&A of ₹${n0(orgSga[0])} cr in FY27E (+11.5%, of which the rupee is ~6 points) and +10% a year after, against gross-profit growth of ~16-18%: group EBITDA/GP rises from ${n1(A26.ebitda / A26.gp * 100)}% (FY26) to ${ebitdaToGp.map(n1).join('% / ')}% in FY27-29E.` },
    { pair: [
      { type: 'line', title: 'Air take rate: 2.6% to 2.2% in five quarters', unit: 'Revenue ÷ GTV (%)', x: QS, series: [{ name: 'Airlines take rate', values: SQ.map(x => r1(x.airRev / x.airGtv * 100)), fmt: 'n1' }], labels: 'all', min: 1.5, max: 3, source: 'Shareholders\' letters and decks (Q2FY26 estimated)' },
      { type: 'column', title: 'Organic SG&A growth has slowed from ~29% to 12% (4% in constant currency)', unit: 'Organic SG&A growth, year on year (%)', x: ['Q2FY25', 'Q3FY25', 'Q4FY25', 'Q1FY26', 'Q2FY26', 'Q3FY26', 'Q4FY26', 'Q1FY27'], series: [{ name: 'SG&A growth', values: [29, 27, 25, 23, 22, 20, 18, 13], fmt: 'pct0' }], labels: 'all', source: 'Q1FY27 shareholders\' letter (Q4 chart; excludes CV, Jumbonline, ESOP and M&A costs)' },
    ] },
  ],
};

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: real scale and a two-sided network, but agents multi-home and the take rate is negotiable',
  blocks: [
    { verdicts: D.moat, head: ['Source', 'Verdict', 'Evidence', 'The catch'], title: 'Competitive advantage scorecard', source: 'Company letters and calls; AR FY26; Choice (22-Sep-2026); GAM Research' },
    { callout: '**Honest verdict: a moderate moat.** TBO\'s advantage is scale: one platform, aggregated supply and credit across 100+ countries, which a small regional wholesaler cannot match and which lets each new market be added at low marginal cost. But it is not a monopoly: agents use several platforms, global bed banks and OTAs compete for the same bookings, and Q1FY27 showed TBO has to give up margin to hold volume when demand drops. The moat shows up in growth and share gains, not in pricing power.' },
  ],
};

module.exports = { hotels, classic, air, moat };
