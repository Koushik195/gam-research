// IndiaMART report, part 2: what the company does, history & corporate actions, industry, tailwind test.
const X = require('./INDIAMART.ctx');
const { C, D, SA, SQ, A26, Q1, n0, n1, pc } = X;
const H = C.history;

const business = {
  id: 'business', nav: 'What the company does', kicker: 'The business', title: 'A subscription business that sells B2B buy leads to 2.2 lakh paying MSME suppliers',
  blocks: [
    { p: `${C.profile.what} ${C.profile.scale}` },
    { exhibit: { type: 'table', title: 'How IndiaMART makes money', head: ['Line', 'What the customer pays for', 'FY26 revenue', 'FY26 EBITDA'], wide: [1], rows: [
      ['IndiaMART marketplace (standalone)', 'Annual or multi-year subscription (Silver monthly/annual, Gold, Platinum) for a verified storefront, ranking in search and a quota of buy leads (BuyLeads/RFQs); category and location targeting in Platinum; export site (~₹60-70 cr of collections)', `₹${n0(A26.imRev)} cr (92%)`, `₹${n0(A26.imAdjEbitda)} cr before ESOP (${A26.imMargin}%)`],
      ['Busy Infotech (100%)', 'Desktop, mobile and cloud accounting, inventory and GST software for MSMEs; moving from perpetual licences to subscriptions', `₹${n0(A26.busyRev)} cr (8%)`, `₹${A26.busyEbitda} cr (${A26.busyMargin}%)`],
      ['Others', 'Livekeeping (a cloud/mobile layer on Tally), other small subsidiaries, inter-company items', `₹${A26.othRev} cr`, `−₹${-A26.othEbitda} cr`],
      ['Strategic stakes (not consolidated)', '13 start-ups in accounting (Vyapar), distribution and logistics software (Bizom, Fleetx, SuperProcure), B2B procurement (Industry Buying), identity (IDfy), invoice finance (M1xchange)', '–', `Share of associates' losses −₹${n1(C.fy26.assoc)} cr`],
    ], source: 'Q1FY27 and Q4FY26 investor presentations; AR FY26; GAM Research' } },
    { pair: [
      { type: 'column', title: 'Paying suppliers: +45K in FY22-24, then flat at ~218-222K', unit: 'Paying suppliers at period end (000s)', x: [...SA.map(a => a.fy), 'Q1FY27'], series: [{ name: 'Paying suppliers', values: [...SA.map(a => a.suppliersK), Q1.standalone.payingSuppliersK], fmt: 'num' }], labels: 'all', source: 'Q1FY27 investor presentation' },
      { type: 'column', title: 'ARPU: ₹44K to ₹69K, +57% since FY22', unit: 'Annualised revenue per paying supplier (₹000)', x: [...SA.map(a => a.fy), 'Q1FY27'], series: [{ name: 'ARPU', values: [...SA.map(a => a.arpuK), Q1.standalone.arpuK], fmt: 'num' }], labels: 'all', source: 'Q1FY27 investor presentation' },
    ] },
    { callout: `**The one thing to understand:** revenue = paying suppliers × ARPU, recognised over the subscription. The supplier count has not grown for two years, so all of the growth since FY25 is price and mix. Platinum and Gold customers (~50% of the base, >75% of revenue) renew and upgrade; Silver customers, the entry tier, churn at ~7% a month (monthly plans) and ~4% a month (annual), mostly in their first year. Collections, which lead revenue by several quarters, grew 8% in Q1FY27.` },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'From a 1996 directory to a cash-rich listed platform: IPO 2019, QIP 2021, Busy 2022, bonus and buyback 2023',
  blocks: [
    { exhibit: { type: 'table', title: 'Milestones and what they did to the numbers', head: ['When', 'Event'], wide: [1], rows: H.map(([d, e]) => [d, e]), source: 'AR FY24 and FY26; Q1FY27 investor presentation (cash utilisation); GAM Research' } },
    { bullets: [
      '**Per-share data are bonus-adjusted.** The 1:1 bonus in Q1FY24 doubled the share count to ~6.0 crore; Screener and this report show EPS and prices on the post-bonus basis.',
      '**The FY21 QIP is why the balance sheet is cash-heavy.** Cash and treasury rose from ₹931 cr to ₹2,365 cr in FY21 and has grown to ₹3,553 cr since, despite ~₹1,220 cr of strategic investments and ~₹1,650 cr of capital returned.',
      '**Busy changed the mix and added goodwill.** ₹454 cr of goodwill since FY23; Busy\'s FY26 revenue (+80%) is flattered by the switch to subscription billing (normalised ~44%).',
      '**One-offs in reported profit:** fair-value gains on strategic stakes of ₹84 cr (FY23), ₹29 cr (FY24), ₹43 cr (FY25) and ₹78 cr (FY26), and a ₹29 cr gain on selling an associate stake in FY25. We strip them out of the EPS history used for valuation.',
    ] },
  ],
};

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Indian B2B discovery: a big MSME base, half of it already on IndiaMART, and a new gatekeeper in AI search',
  blocks: [
    { p: `${D.industry.market} ${D.industry.b2b}` },
    { exhibit: { type: 'table', title: 'Who IndiaMART competes with', head: ['Type', 'Names', 'How they compete'], wide: [2], rows: [
      ['Horizontal listings and search', 'Just Dial, TradeIndia, Google Search and Maps', 'Free discovery for buyers; Just Dial sells paid listings to local SMEs in a similar way'],
      ['Transactional B2B', 'Udaan, Moglix, OfBusiness, Amazon Business, Industry Buying (IndiaMART 21%)', 'Hold inventory or take a commission; win repeat procurement, not discovery'],
      ['Public digital rails', 'ONDC, GeM (government procurement)', 'Lower the cost of reaching buyers outside IndiaMART'],
      ['AI assistants', 'ChatGPT, Gemini, Google AI Overviews', 'Answer "who sells X near Y" directly; may keep traffic that used to land on listing sites'],
      ['MSME accounting software (Busy)', 'Tally (60-70% share), Vyapar (IndiaMART 28.6%), Zoho Books, Marg', 'Busy is far smaller than Tally; Vyapar targets the smallest businesses on mobile'],
    ], source: 'Q4FY26 and Q1FY27 calls; GAM Research' } },
    { p: D.industry.traffic + ' ' + D.industry.competition },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Does the MSME digitisation tailwind reach IndiaMART? In price, yes; in customers and buyer traffic, no',
  blocks: [
    { exhibit: { type: 'table', title: 'The tailwind test', head: ['Tailwind', 'Evidence it is real', 'Does it reach IndiaMART?', 'Verdict'], wide: [1, 2], rows: [
      ['More MSMEs formalised (GST)', '~1.6 crore GST-registered businesses; ~50 lakh GST-identified sellers registered on IndiaMART', 'Paying suppliers 217K (Mar-25) → 218K (Jun-26); management: ~50% of the serviceable free market already on the platform', '**No** (volumes)'],
      ['Willingness to pay for digital leads', 'ARPU ₹44K (FY22) → ₹69K (Q1FY27); Platinum churn <1% a month', 'Standalone revenue +9% in Q1FY27 on flat suppliers; deferred revenue +14%', '**Yes** (price)'],
      ['Online B2B buying', 'Buyers who come back: 90-day repeat rate 50-51% → 58-59%', 'Unique business enquiries flat-to-down at ~26 Mn; active buyers −5% YoY (analyst on the Q1FY27 call)', '**Not visibly**'],
      ['MSME software adoption', 'Busy billing +10% (+~30% normalised), revenue +47% in Q1FY27', 'Busy is 8% of revenue; Tally dominates', '**Yes, small**'],
      ['Embedded credit', 'Board approved IndiaMART Finance (Jul-2026), partner-lender model', 'No revenue yet; no own-book lending planned', '**Option only**'],
    ], source: 'Q4FY26 and Q1FY27 calls and presentations; GAM Research' } },
    { callout: '**Verdict:** the tailwind is real but IndiaMART now captures it through price, not volume. That is a sign of pricing power with core customers, and a warning: a marketplace whose buyer traffic is flat and whose seller count has stalled is mature in its core, and the next leg needs either the Silver tier fixed or new products (credit, buyer services, Busy).' },
  ],
};

module.exports = { business, history, industry, tailwind };
