// Physicswallah report, part B: research chapters. This file holds the cover, the story in charts and the business chapter,
// and merges part2 (history, industry, tailwind), part3 (online, offline, new bets, moat), part4 (earnings quality,
// ownership, governance, forecasts), part5 (street, valuation) and part6 (risks, glossary).
// Written as of 30-Sep-2026 (Q1FY27 basis). Forecast and valuation figures are live tokens or come from the built model.
const X = require('./PWL.ctx');
const { F, V, n0, n1, pc, f26, f25, q1, q1y, SQ, price, MULT, EVX, fwdEv, FROM, preIndAs, medTp, vsIssue, fromHigh, hi, lo, mvk } = X;
const P2 = require('./PWL.part2'), P3 = require('./PWL.part3'), P4 = require('./PWL.part4'), P5 = require('./PWL.part5'), P6 = require('./PWL.part6');
const SRC = 'PW shareholders\' letters (Q2FY26-Q1FY27), AR FY26, GAM Research';

const cover = {
  headline: P5.headline,
  lead: `Physicswallah (PW) turned a YouTube physics channel into India's largest test-prep company: 4.87 million students paid for its online courses in FY26 at about ₹4,100 a year, and 0.47 million attended its 353 centres. Revenue grew 35% to ₹3,900 cr in FY26 and 24% in Q1FY27 despite the re-held NEET exam; the online channel earns ~27% margins, the offline network still loses money. At ₹{{P.last|num}} the stock is ${pc(vsIssue)} above the ₹109 IPO price and trades at ${n1(X.evNow)}x our FY28E EBITDA, against a median one-year-forward multiple of ${n1(EVX.med)}x since January. Adjusted for the internet platforms' ${X.pc1(X.sectorEvAll)} move over the same months and rolled forward a year, ${MULT.base}x Sep-28E EBITDA gives **{{dcf.tp|inr}} ({{dcf.upside|chg}})**: **we initiate with ${P5.rating}.** Bull case {{scen.bull.tp|inr}}; bear case {{scen.bear.tp|inr}} ({{scen.bear.upside|chg}}). The street's median target is ₹${n0(medTp)}.`,
  arguments: P5.coverArguments,
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA (₹ cr)', 'ebitda', 'num'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n2']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'AMBER' },
    { k: 'Earnings momentum', v: 'GREEN' },
    { k: 'Competitive position', v: 'GREEN' },
    { k: 'Balance sheet', v: 'GREEN' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): the delayed NEET enrolments should show up; the test is whether H1 revenue growth gets back to ~30%.',
    'Offline break-even: management guides near break-even (after rent) for FY27; Q1 was −22%. Each quarter of Q2-Q3 will show whether the cohort maths holds.',
    'Capital allocation: ₹5,600 cr of treasury, the FinZ sale, Sarrthi IAS tranches and any new acquisition or school investment.',
    'Supply: free float is under 30%; the founders\' 18-month lock-in on their minimum contribution ends in May-2027.',
  ],
};

// ---------------------------------------------------------------- 1. Story in charts
const QL = SQ.map(q => q.q);
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: 'Online is half of revenue and growing faster than offline', unit: 'Revenue by channel, ₹ crore (as reported at the time)', x: ['FY25', 'FY26'], series: [{ name: 'Online', values: [f25.onlineRevOld, f26.onlineRevOld], fmt: 'num' }, { name: 'Offline', values: [f25.offlineRevOld, f26.offlineRevOld], fmt: 'num' }, { name: 'Others', values: [f25.othersRevOld, f26.othersRevOld], fmt: 'num' }], labels: 'all', source: 'Q4FY26 shareholders\' letter (old channel basis; AR FY26 restates FY26 to 2,011 / 1,844 / 44)' },
      { type: 'column', title: 'EBITDA after rent: ₹52 cr (FY23) to ₹300 cr (FY26); guided to double in FY27', unit: 'Pre-IndAS EBITDA (after rent, before other income and ESOP), ₹ crore', x: ['FY23', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], series: [{ name: 'Pre-IndAS EBITDA', values: [52, Math.round(f25.preIndAs), Math.round(f26.preIndAs), ...preIndAs.map(Math.round)], fmt: 'num' }], labels: 'all', source: 'Company (FY23-26); GAM estimates (FY27-29E)' },
    ] },
    { pair: [
      { type: 'column', title: 'Q1 is the weak quarter, but both channels improved', unit: 'Q1 pre-IndAS EBITDA margin by channel (%)', x: ['Online', 'Offline', 'Group'], series: [{ name: 'Q1FY26', values: [Math.round(q1y.onlinePre / q1y.onlineRev * 100), Math.round(q1y.offlinePre / q1y.offlineRev * 100), Math.round(q1y.preIndAs / q1y.revenue * 1000) / 10], fmt: 'pct0' }, { name: 'Q1FY27', values: [Math.round(q1.onlinePre / q1.onlineRev * 100), Math.round(q1.offlinePre / q1.offlineRev * 100), Math.round(q1.preIndAs / q1.revenue * 1000) / 10], fmt: 'pct0' }], labels: 'all', source: 'Q1FY27 shareholders\' letter, Appendix C (auditor-reviewed channel split)' },
      { type: 'column', title: 'Offline centres: 198 → 366 in 15 months, now slowing', unit: 'Offline centres (period end)', x: ['Mar-25', 'Jun-25', 'Sep-25', 'Dec-25', 'Mar-26', 'Jun-26'], series: [{ name: 'Centres', values: [198, ...SQ.map(q => q.centres)], fmt: 'num' }], labels: 'all', source: SRC },
    ] },
    { pair: [
      { type: 'line', title: `Share price: ${pc(vsIssue)} vs the ₹109 IPO price, ${pc(fromHigh)} from the ₹${n0(hi)} listing-day close`, unit: '₹, daily', x: 'P.series[].0', series: [{ name: 'Price', ref: 'P.series[].1', fmt: 'num', thin: true }], labels: 'extremes', maxTicks: 6, source: 'Screener.in, NSE' },
      { type: 'line', title: `Forward EV/EBITDA since January: median ${n1(EVX.med)}x; ${n1(X.evNow)}x FY28E now`, unit: 'EV ÷ next full-year EBITDA (x)', x: fwdEv.filter(x => x[0] >= FROM).map(x => x[0]), series: [{ name: 'Forward EV/EBITDA', values: fwdEv.filter(x => x[0] >= FROM).map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', maxTicks: 6, lines: [{ v: MULT.base, text: `Our multiple ${MULT.base}x` }], source: 'Screener.in prices; FY27-28E EBITDA GAM estimates (the step in Apr-2026 is the switch from FY27E to FY28E)' },
    ] },
    { pair: [
      { type: 'column', title: 'Our forecast: EBITDA ₹370 cr (FY26) to ₹{{F.ebitda.2|num}} cr (FY29E)', unit: 'EBITDA after ESOP, Ind AS 116 basis (₹ crore)', x: 'fin.labels', from: 'FY23', series: [{ name: 'EBITDA', ref: 'fin.ebitda', fmt: 'num' }], labels: 'all', source: 'Company, GAM Research estimates' },
      { type: 'hbar', title: 'Target, cross-checks and the street', unit: '₹ per share', x: ['EV/EBITDA (target)', 'P/E', 'DCF', 'Street median', 'Share price'], series: [{ name: '₹/share', values: [Math.round(mvk('ev').value), Math.round(mvk('pe').value), Math.round(mvk('dcf').value), Math.round(medTp), Math.round(price)], fmt: 'inr' }], labels: 'all', highlight: 'EV/EBITDA (target)', source: 'GAM Research; street median of eight brokers\' targets standing on 30-Sep-2026' },
    ] },
  ],
};

// ---------------------------------------------------------------- 2. Business
const business = {
  id: 'business', nav: 'What PW does', kicker: 'The business', title: 'A low-price online test-prep platform that also runs a fast-grown offline network',
  blocks: [
    { p: 'PW prepares students for India\'s competitive exams: engineering (JEE), medicine (NEET), civil services (UPSC), CA, government jobs, MBA and others, plus school-level "Foundation" (grades 6-10), state boards, K-12 tuition (Curious Jr) and short skills courses. It earns in two ways. **Online** (52% of FY26 revenue on the new basis): live and recorded classes, tests and doubt-solving on its app, sold as yearly "batches" at about ₹4,000 (ACPU ₹4,104 in FY26), with add-ons (Infinity, Power Batch). **Offline** (47%): classroom courses at 366 centres (Jun-2026), at ₹36,625 of revenue per student in FY26 (about nine times the online price): Vidyapeeth (classic classrooms, ~70% of offline revenue), Pathshala (a star teacher on screen plus a local doubt teacher), category centres (UPSC, CA, defence) and three acquired regional chains (Xylem in Kerala, Utkarsh in Rajasthan, Knowledge Planet in the UAE). Its funnel is largely free: 142 million+ followers on social media, mostly YouTube (9.5 billion+ views), so advertising was only 9.1% of revenue in FY26.' },
    { exhibit: { type: 'table', title: 'PW in FY26 and Q1FY27', head: ['Measure', 'FY25', 'FY26', 'Q1FY27', 'What it tells you'], wide: [4], rows: [
      ['Revenue (₹ cr)', n0(f25.revenue), n0(f26.revenue), n0(q1.revenue), '+35% in FY26, +24% in Q1 (NEET re-exam pushed enrolments into Q2)'],
      ['Online paying users (mn)', f25.onlineUsersMn, f26.onlineUsersMn, `${q1.onlineUsersMn} (quarter)`, '+18% in FY26; JEE/NEET now 29% of online enrolments (54% in FY23)'],
      ['Online collection per user (₹)', n0(f25.acpu), n0(f26.acpu), n0(q1.acpu), 'Rising with add-ons; still a fraction of offline fees'],
      ['Offline students (mn)', f25.offlineEnrolMn, f26.offlineEnrolMn.toFixed(2), q1.offlineEnrolMn, '+43% in FY26 on 155 new centres'],
      ['Offline revenue per student (₹)', n0(f25.arpu), n0(f26.arpu), `${n0(q1.arpu)} (quarter)`, 'Fell 9% in FY26 (mix); +7% in Q1FY27'],
      ['Centres', f25.centres, f26.centres, q1.centres, 'Expansion slowed after FY26'],
      ['Pre-IndAS EBITDA (₹ cr)', n0(f25.preIndAs), n0(f26.preIndAs), n0(q1.preIndAs), 'After rent, before other income and ESOP'],
      ['Treasury (₹ cr)', '–', n0(f26.treasury), n0(q1.treasury), 'IPO cash plus fees paid in advance'],
    ], source: 'Q4FY26 and Q1FY27 shareholders\' letters, AR FY26' } },
    { exhibit: { type: 'tiles', title: 'PW in numbers (Q1FY27)', tiles: [
      { k: 'Daily active users', v: `${q1.dauMn} mn`, d: '+26% YoY; 35 mn monthly' },
      { k: 'K-12 & early learning', v: `₹${q1.k12Rev} cr`, d: `revenue in Q1, +88% (₹${q1.k12RevY} cr a year earlier)` },
      { k: 'Centres', v: `${q1.centres}`, d: '165 Vidyapeeth, 70 Pathshala, 66 other, 65 subsidiary' },
      { k: 'Faculty', v: '7,268', d: 'of 19,567 employees' },
      { k: 'Treasury', v: `₹${n0(q1.treasury)} cr`, d: 'Jun-2026; bank debt ₹10 cr' },
    ], source: 'Q1FY27 shareholders\' letter' } },
    { callout: '**Two businesses with opposite economics.** Online is a one-teacher-to-many product: the content is made once, the marginal student costs little, and margins were ~27% in FY26 after rent. Offline is a classroom business with rent, local faculty and 80-student batches; it earns 13-15% only when a centre is mature and full, and the network as a whole lost ~10% of revenue in FY26. The valuation question is how much of the group\'s future profit comes from each.' },
  ],
};

module.exports = {
  rating: P5.rating, cover,
  sections: p => [narrative, business, P2.history, P2.industry, P2.tailwind, P3.online, P3.offline, P3.newBets, P3.moat, p.financials, P4.earnings, p.capital, p.balance,
    P4.ownership(p.ownershipBase), P4.governance, P4.forecasts, P5.street, P5.valuation, P6.risks, p.statements, P6.glossary],
  statementNotes: { ...P4.statementNotes },
};
