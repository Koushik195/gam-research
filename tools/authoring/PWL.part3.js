// Physicswallah report, part 3: the online channel, the offline channel, new bets, competitive advantage.
const X = require('./PWL.ctx');
const { F, D, f25, f26, q1, q1y, n0, n1, segM, segPre, AS } = X;
const pct = (a, b) => Math.round(a / b * 100);
// Online enrolments by category, thousands (company data via JM Financial, 14-Aug-2026, Exhibit 6)
const CAT = [['JEE', 421, 532, 573, 646], ['NEET', 665, 896, 927, 998], ['Foundation', 189, 382, 528, 753], ['Board and CUET', 0, 84, 194, 317], ['Civil services', 51, 104, 144, 292], ['Other government exams', 0, 989, 930, 907], ['CA + Commerce', 0, 73, 101, 158], ['Others (GATE, MBA, defence, skills, law, NEET PG ...)', 678, 892, 1462, 1643]];

const online = {
  id: 'online', nav: 'Online', kicker: 'Segment: Online', title: `Online: ~4.9 million paying students at ~₹4,100 a year, ~27% margin after rent, growing ~30%`,
  blocks: [
    { p: `Online revenue was ₹${n0(f26.onlineRev)} cr in FY26 on the new basis (₹${n0(f26.onlineRevOld)} cr as first reported, +39%) and ₹${q1.onlineRev} cr in Q1FY27 (+33%). Growth is volume plus price: paying users rose 18% to 4.87 million in FY26 and collection per user rose 11% to ₹4,104 as students bought add-ons (Infinity and Infinity Pro: +32% orders in Q1FY27). The mix is broadening: JEE and NEET were 54% of online enrolments in FY23 and 29% in FY26, as Foundation, boards, UPSC, CA and state-language batches grew. Q1FY27 lost NEET money to the re-held exam (NEET online collections −28%), then made it back from July (+51% to mid-August).` },
    { pair: [
      { type: 'hbar', title: 'Online enrolments: growth now comes from beyond JEE and NEET', unit: 'FY26 online enrolments by category (thousands)', x: CAT.map(c => c[0]), series: [{ name: 'FY26', values: CAT.map(c => c[4]), fmt: 'num' }], labels: 'all', source: 'Company data via JM Financial (14-Aug-2026)' },
      { type: 'column', title: 'Online margin after rent: 6% → 12% in the weak first quarter', unit: 'Online pre-IndAS EBITDA, Q1 (₹ crore)', x: ['Q1FY26', 'Q1FY27'], series: [{ name: 'Online pre-IndAS EBITDA', values: [q1y.onlinePre, q1.onlinePre], fmt: 'num' }], labels: 'all', source: 'Q1FY27 letter, Appendix C' },
    ] },
    { exhibit: { type: 'table', title: 'Online enrolments by category (thousands)', head: ['Category', 'FY23', 'FY24', 'FY25', 'FY26', 'FY23-26 growth'], rows: CAT.map(c => [c[0], ...c.slice(1).map(v => (v ? n0(v) : '–')), c[1] ? `${n0((Math.pow(c[4] / c[1], 1 / 3) - 1) * 100)}% a year` : 'new']), source: 'Company data via JM Financial (14-Aug-2026)' } },
    { p: `Profitability: management grades categories in three bands. JEE, NEET, CA, MBA, commerce and boards are "high profitability"; GATE, UPSC, state PSCs, Foundation and government exams are profitable with room to improve; NEET PG, skills, Curious Jr and vernacular are still investments (Curious Jr to break even in FY27). Online pre-IndAS margin was ~27% in FY26 and 12% in seasonally weak Q1FY27 (6% a year earlier). We forecast online channel EBITDA (Ind AS basis, before ESOP) of ${segM('online').map(n1).join('% / ')}% for FY27-29E, i.e. ~${n1(segPre('online')[0] / F.seg.online.revenue[0] * 100)}-${n1(segPre('online')[2] / F.seg.online.revenue[2] * 100)}% after rent, on revenue of ₹${F.seg.online.revenue.map(n0).join(' / ')} cr (${AS.segments[0].growth.join('% / ')}% growth).` },
    { callout: '**Why online works:** one recorded or live class serves thousands, the YouTube funnel brings students for little advertising, and prices of ~₹4,000 a year are a tenth of offline coaching, so the market expands rather than just shifting. The risk is the same feature in reverse: low prices leave little room if free AI tutors set the reference price at zero.' },
  ],
};

const offline = {
  id: 'offline', nav: 'Offline', kicker: 'Segment: Offline', title: 'Offline: 366 centres, still losing money after rent; mature centres earn 13-15%',
  blocks: [
    { p: `Offline revenue was ₹${n0(f26.offlineRev)} cr in FY26 (new basis; ₹${n0(f26.offlineRevOld)} cr as first reported, +31%) and ₹${q1.offlineRev} cr in Q1FY27 (+14%; 20-25% without the NEET delay, management). The network grew from ${f25.centres} centres at Mar-25 to ${f26.centres} at Mar-26 and ${q1.centres} at Jun-26; students from 0.33 to 0.47 million. Vidyapeeth is ~70% of offline revenue. The economics depend on centre age: centres opened in 2022-24 were EBITDA-positive in FY26 (the 2023-24 cohort at 13-15%, except Kota, where student numbers have fallen), while the 2025 cohort lost a single-digit margin. Newer centres are smaller ("hyperlocal") and are meant to break even within 24 months.` },
    { exhibit: { type: 'table', title: 'Offline network (centres; enrolments in thousands)', head: ['Format', 'Centres Mar-25', 'Centres Mar-26', 'Centres Jun-26', 'Enrolments FY25', 'Enrolments FY26', 'Q1FY27 enrolments'], rows: [
      ['PW Vidyapeeth (classroom)', '79', '139', '165', '180', '257', '219'], ['PW Pathshala (hybrid, two teachers)', '47', '84', '70', '28', '43', '30'],
      ['Other centres (UPSC, CA, defence, govt exams)', '19', '62', '66', '17', '48', '39'], ['Subsidiaries (Xylem, Utkarsh, Knowledge Planet)', '53', '68', '65', '100', '120', '59'],
      { hl: true, cells: ['**Total**', '**198**', '**353**', '**366**', '**326**', '**468**', '**347**'] },
    ], source: 'Q4FY26 and Q1FY27 shareholders\' letters. Pathshalas that grow are converted into Vidyapeeths (none closed, management).' } },
    { pair: [
      { type: 'column', title: 'Offline margin after rent: still deeply negative in Q1', unit: 'Offline pre-IndAS EBITDA margin (%)', x: ['FY25', 'FY26', 'Q1FY26', 'Q1FY27'], series: [{ name: 'Offline', values: [f25.offlinePreIndAsPct, f26.offlinePreIndAsPct, pct(q1y.offlinePre, q1y.offlineRev), pct(q1.offlinePre, q1.offlineRev)], fmt: 'pct0' }], labels: 'all', source: 'FY25-26: Q4FY26 call (approximate); Q1: Q1FY27 letter Appendix C' },
      { type: 'column', title: 'Our forecast: offline after rent turns positive only in FY29E', unit: 'Offline pre-IndAS EBITDA (₹ crore, GAM estimate)', x: F.years, series: [{ name: 'Offline pre-IndAS', values: segPre('offline').map(Math.round), fmt: 'num' }], labels: 'all', source: 'GAM estimates (channel EBITDA less ~92% of group lease payments, the Q1FY27 split)' },
    ] },
    { callout: `**Our view:** management guides offline to near break-even after rent in FY27. We are a year behind that (−${Math.abs(Math.round(segPre('offline')[0] / F.seg.offline.revenue[0] * 100))}% in FY27E), as are JM Financial and DAM Capital. The levers are credible (fewer openings, fuller centres, more students per teacher, fees up 7% in Q1), but offline is a crowded, results-driven market where PW still trails the incumbents on top ranks, and every new centre restarts the two-year loss cycle.` },
  ],
};

const newBets = {
  id: 'newbets', nav: 'New bets', kicker: 'New bets', title: 'K-12, AI products and schools: small today, and where the capital-allocation risk sits',
  blocks: [
    { p: 'Online K-12 and early learning (Foundation, pre-Foundation, Curious Jr, commerce, boards incl. 14 state boards) earned ₹105 cr in Q1FY27, +88%, on 0.78 million enrolments (+41%); management sees state boards (~6 crore students) as the next JEE/NEET-sized category. AI products are both cost levers and new revenue: Ask AI answers most doubts, AI Guru handled 102 million queries in Q1, PW Books (AI digital books from ₹999) took 23,000 paid orders in ten days, and a one-to-one AI tutor is in beta at ~$0.20 an hour of voice tutoring. Capital-heavy bets are being scaled back: FinZ (student loans) is being sold and management says there will be no large school-running programme, after allocating ₹400 cr to a school-management company in FY26.' },
    { exhibit: { type: 'table', title: 'New bets: size and what we assume', head: ['Bet', 'Where reported', 'Size / traction', 'In our model'], wide: [2], rows: [
      ['K-12 online (Curious Jr, boards, state boards)', 'Online', '₹105 cr in Q1FY27 (+88%)', 'Inside online growth of 32/28/25%'],
      ['AI products (Books, Pi, Talk, AI tutor)', 'Online', 'Books 23k paid orders in 10 days; Pi 38k subscribers', 'No separate revenue'],
      ['Schools (Gurukulam, Tender Heart partnership)', 'Others / offline', '<0.5% of revenue; ₹400 cr allocated in FY26; ₹44 cr lent to the Gurukulam Education Trust (10.6%, AR FY26)', 'No value; capital spent is a risk'],
      ['FinZ lending', 'Others', 'Small loan book (size not disclosed); term sheet signed to transfer it', 'Others losses shrink'],
      ['Sarrthi IAS (UPSC)', 'Offline/online', 'Q3FY26 revenue ₹22 cr, EBITDA ₹15 cr; 51% owned, up to 85% by FY31', 'Consolidated; future tranches paid from treasury'],
    ], source: 'Q1FY27 letter and call; Q3FY26 call; AR FY26' } },
  ],
};

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'A real cost and brand advantage online; no moat offline',
  blocks: [
    { exhibit: { type: 'table', title: 'Competitive advantage scorecard', head: ['Source', 'Score', 'Why'], wide: [2], rows: D.moat.map(m => [m.k, `**${m.score}**`, m.why]), source: 'GAM Research, from company data' } },
    { callout: '**Verdict:** PW has a moat online, built on Alakh Pandey\'s brand, a free YouTube funnel and the lowest price point in the market; it shows up as ~27% margins with advertising at 9% of revenue. It is a narrow moat: a student is a customer for a year or two, there are no switching costs, and the brand is tied to a few teachers. Offline has no moat: it is a local, capital-hungry business where PW is a newcomer competing with established chains on results. AI is both the biggest opportunity (cheaper teaching at scale) and the biggest threat (free substitutes).' },
  ],
};

module.exports = { online, offline, newBets, moat };
