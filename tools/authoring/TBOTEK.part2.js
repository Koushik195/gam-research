// TBO Tek report, part 2: what the company does, history and corporate actions, industry and the tailwind test.
const X = require('./TBOTEK.ctx');
const { C, D, A26, Q1, q, n0, n1, pc } = X;
const I = D.industry;
const sh = (x, t) => n1(x / t * 100) + '%';
const q1 = q('Q1FY27'), q0 = q('Q1FY26');

const business = {
  id: 'business', nav: 'What TBO does', kicker: 'The business', title: 'A wholesaler of travel to travel agents: hotels make the money, air brings the traffic, Classic Vacations adds the US',
  blocks: [
    { p: 'TBO Tek runs TBO.com, a two-sided B2B platform. On one side are suppliers: 1 million+ hotels (directly contracted or through bed banks and channel managers), 750+ airlines (through GDSs, direct APIs and NDC), transfers, car rental, cruises and insurance. On the other are ~159,000 travel buyers in 100+ countries, mostly small retail travel agents, plus tour operators, OTAs, travel-management companies and loyalty programmes (enterprise buyers via API). An agent searches, books and pays on TBO in its own currency; TBO pays the supplier, carries the credit and handles the service. It earns a markup or commission: **revenue** is that margin for most bookings, and **gross profit** is revenue less service fees paid to partners. About 64% of FY26 GTV and ~87% of organic gross profit came from hotels and ancillaries; air tickets, sold mainly by Indian agents, are a low-margin traffic engine.' },
    { exhibit: { type: 'table', title: 'The businesses, FY26 (₹ crore)', head: ['Business', 'GTV', 'Revenue (take rate)', 'Gross profit (GP/GTV)', 'Share of GP', 'Q1FY27 GTV growth'], wide: [0], rows: [
      ['**Hotels, ancillary & others (organic)**', n0(A26.hotGtv), `${n0(A26.hotRev)} (${n1(A26.hotTake)}%)`, `${n0(A26.hotGp)} (${n1(A26.hotGpGtv)}%)`, sh(A26.hotGp, A26.gp), pc((q1.hotGtv / q0.hotGtv - 1) * 100) + ' (~16% in constant currency)'],
      ['**Airlines (organic)**', n0(A26.airGtv), `${n0(A26.airRev)} (${n1(A26.airTake)}%)`, `${n0(A26.airGp)} (${n1(A26.airGpGtv)}%)`, sh(A26.airGp, A26.gp), pc((q1.airGtv / q0.airGtv - 1) * 100)],
      ['**Classic Vacations (from 1-Oct-2025)**', n0(A26.cvGtv), `${n0(A26.cvRev)} (${n1(A26.cvTake)}%)`, `${n0(A26.cvGp)} (${n1(A26.cvGpGtv)}%)`, sh(A26.cvGp, A26.gp), 'not in the base (acquired)'],
      { hl: true, cells: ['**TBO Tek (consolidated)**', `**${n0(A26.gtv)}**`, `**${n0(A26.sales)} (${A26.takeRate}%)**`, `**${n0(A26.gp)} (${n1(A26.gp / A26.gtv * 100)}%)**`, '100%', `${pc((Q1.gtv / Q1.gtvPrior - 1) * 100)} (+30% CC)`] },
    ], source: 'Quarterly shareholders\' letters and investor decks summed (Q2FY26 airline/hotel split estimated; see gaps); AR FY26 (GTV ₹36,809 cr, take rate 7.27%). Consolidated GTV is net of intercompany sales; Classic Vacations GTV on a check-in basis.' } },
    { exhibit: { type: 'table', title: 'Where the hotel business comes from (share of hotels & ancillaries GTV by source market)', head: ['Region', 'FY25', 'FY26', 'Q1FY27 growth (INR / constant currency)'], rows: [
      ['Europe (incl. UK, Ireland, Israel)', '36%', '34%', '+37% / +24%'],
      ['Middle East & Africa', '25%', '24%', 'flat / +1%'],
      ['North America (incl. Classic Vacations)', '8%', '15%', '24% of Q1 hotel GTV (CV peak season)'],
      ['India', '12%', '10%', '−2% (air +14.7%)'],
      ['Asia-Pacific', '8%', '9%', '+56% / +41%'],
      ['Latin America', '10%', '8%', '+20% / +9%'],
    ], source: 'AR FY26 pp. 32-33 (region-wise GTV); Q1FY27 shareholders\' letter pp. 7-10' } },
    { callout: '**So what:** TBO is no longer an Indian air-ticket consolidator. Two-thirds of GTV and nearly 90% of gross profit now come from agents outside India (Q1FY27: 64% and 89%), mostly hotel business booked through its Dubai holding company. That diversification is why the business kept growing through the Middle East shock; it is also why the rupee now moves reported growth by up to ~11 points a quarter.' },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'Twenty years from a Delhi air consolidator to a global hotel platform: four acquisitions, three private-equity owners and a May-2024 IPO',
  blocks: [
    { p: `TBO was founded in 2006 by Ankush Nijhawan and Gaurav Bhatnagar. It grew first as an air-ticket platform for Indian agents, went international from Dubai (2011), and bought its way into hotel supply and new markets: Island Hopper, Bookabed (2022), Jumbonline (Spain, 2023) and Classic Vacations (USA, Oct-2025, USD 125 mn). Naspers (2012), Affirma Capital (ex-Standard Chartered PE), General Atlantic (Oct-2023) and other funds were shareholders before the IPO. The IPO in May-2024 at ₹${C.ipo.price} raised ₹${C.ipo.freshCr} cr of new money and let existing holders sell ₹${n0(C.ipo.ofsCr)} cr. The stock peaked at ₹1,903 (weekly close) in Jun-2024, fell to ₹1,024 in Apr-2025, and traded between ₹1,068 and ₹1,711 in the twelve months to Sep-2026.` },
    { exhibit: { type: 'table', title: 'Corporate actions and what they did to the numbers', head: ['When', 'What happened'], wide: [1], rows: C.history.map(([w, t]) => [w, t]), source: 'Company investor presentation (Jun-2026, "Our journey"); AR FY26 notes 48-49; General Atlantic press release (22-Oct-2023)' } },
    { exhibit: { type: 'table', title: 'Classic Vacations: the deal', head: ['', 'Detail'], wide: [1], rows: [
      ['Business', 'US B2B2C luxury travel company serving ~10,000 high-end travel advisors; average booking ~USD 8,600 vs ~USD 600 at TBO; booking window ~245 days vs ~50 (Choice)'],
      ['Price', `USD ${C.acquisition.considerationUsdMn} mn (USD ${C.acquisition.closingUsdMn} mn at closing + USD ${C.acquisition.adjustmentsUsdMn} mn of adjustments); ~1.1x revenue (Choice)`],
      ['Funding', C.acquisition.funding],
      ['Accounting', `Goodwill ₹${n1(C.acquisition.goodwillCr)} cr; acquisition costs ₹${C.acquisition.acqCostsCr} cr expensed in FY26; consolidated from 1-Oct-2025 (FY26: revenue ₹${C.acquisition.fy26Revenue} cr)`],
      ['Early results', `Q1FY27 (its peak season): GTV ₹${n0(Q1.gtvCvGross)} cr, adj. EBITDA ₹${Q1.adjEbitdaCV} cr (3.4% of GTV); management guides ~2.5% for a full year; platform migration by end-CY2026`],
    ], source: 'AR FY26 note 49 and note 4; Q1FY27 letter and call; Choice initiation (22-Sep-2026)' } },
  ],
};

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Assisted travel is not dying: hotels are fragmented, agents need a wholesaler, and the rich are travelling more',
  blocks: [
    { p: `${I.structure} ${I.hotelsVsAir}` },
    { bullets: [
      `**Demand.** ${I.demand}`,
      `**The 2026 shock.** ${I.shock}`,
      `**Currency.** ${I.fx}`,
      `**Scale economics.** ${I.globalPeers} TBO's organic adjusted EBITDA was ${Q1.adjEbitdaToGpOrganicPct}% of gross profit in Q1FY27.`,
      '**Competition.** Global bed banks (Hotelbeds, WebBeds), OTAs\' B2B arms (Expedia TAAP, Booking, MakeMyTrip, Yatra) and regional wholesalers all sell to the same agents, who use several platforms at once (Choice). TBO says it took share in Europe and APAC in Q1FY27 ("there isn\'t any organic growth in the market").',
    ] },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Does the outbound-travel boom reach TBO? Yes in hotels, less in air, and the 2026 shock shows it is not immune',
  blocks: [
    { exhibit: { type: 'table', title: 'Four tailwinds, tested', head: ['Tailwind', 'Evidence it is real', 'Does it reach TBO?', 'Catch'], wide: [1, 3], rows: [
      ['More outbound travel (India, Gulf, Europe, LATAM)', 'India outbound ~USD 19 bn (FY24) growing ~11% a year (Choice); air passenger growth ~9%', 'Yes: monthly transacting buyers +14% in Q1FY27 (international +39%)', 'India hotel GTV −2% in Q1FY27 as travel rerouted to cheaper destinations; air earns ~1.2% of GTV'],
      ['Luxury and complex travel needs advisors', 'Luxury leisure spend USD 239 bn (2023) to 391 bn (2028) (McKinsey)', 'Yes, via Classic Vacations (GP ~13% of GTV) and the Platinum hotel collection', 'CV standalone growth is "a few quarters away"; integration by end-CY2026'],
      ['Shift from bed banks to direct hotel contracts', 'Only 2-3% of 3-4 mn properties are in big chains (Choice)', 'Yes: H&A GP/GTV rose from 4.1% (Q3FY25) to 5.5% (Q4FY26) (Choice; letters)', 'Fell to 5.2% in Q1FY27 when TBO cut prices to hold Middle East volume'],
      ['Operating leverage after the sales build-out', 'Organic SG&A +4% in CC vs GP +16% (Q1FY27)', 'Yes: organic EBITDA/GP 27.5% vs 25.4% a year ago', 'Management may restart market-development spend; rupee inflates the cost base'],
    ], source: 'Company letters and calls; Choice initiation (22-Sep-2026); GAM Research' } },
    { callout: `**Verdict:** the tailwind reaches TBO where it matters, in international hotels, and Q1FY27 showed it can keep growing through a regional shock (organic GTV +${Q1.growthCcPct.organicGtv}% in constant currency with the Middle East flat). But reported growth overstates the organic, constant-currency trend by a wide margin: consolidated GTV +${n0((Q1.gtv / Q1.gtvPrior - 1) * 100)}% reported, +30% in constant currency, +${Q1.growthCcPct.organicGtv}% organic in constant currency. We forecast the organic rupee numbers, not the headline.` },
  ],
};

module.exports = { business, history, industry, tailwind };
