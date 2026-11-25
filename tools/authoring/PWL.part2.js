// Physicswallah report, part 2: history and corporate actions, industry, tailwind test.
const X = require('./PWL.ctx');
const { C, D, f25, f26, n0, n1 } = X;

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'From a YouTube channel (2014) to a listed company (2025) in eleven years',
  blocks: [
    { p: 'Alakh Pandey started teaching physics on YouTube in 2014; the channel had 2 million subscribers by 2019. He and Prateek Boob incorporated the company in 2020 and launched the app. Growth after that came in three waves: low-priced online batches for JEE and NEET (2020-22), offline centres from 2022 plus acquisitions of regional coaching chains (Xylem, Utkarsh, Knowledge Planet, Sarrthi IAS), and from 2025 a push into school-age learners (K-12 tuition, state boards, a school-management company). The IPO in Nov-2025 raised ₹3,100 cr of new money; the founders sold ₹380 cr and still own 71%.' },
    { exhibit: { type: 'table', title: 'Milestones and what they did to the numbers', head: ['When', 'What happened', 'Impact on the numbers'], wide: [1, 2], rows: [
      ['2014-2020', 'YouTube channel, then company and app', 'Built the free funnel that keeps advertising at ~9% of revenue'],
      ['2022-FY24', 'First offline centres; regional chains acquired; venture money (WestBridge, Hornbill, Lightspeed)', 'Revenue ₹744 cr (FY23) → ₹1,940 cr (FY24); loss ₹1,131 cr in FY24'],
      ['FY25', '198 centres; offline margin ~-19% after rent', 'Revenue ₹2,887 cr (+49%); loss ₹243 cr'],
      ['Sep-2025', '40% of Sarrthi IAS (UPSC) for ₹95 cr; 51% after tranche II, up to 85% by FY31', 'UPSC leadership; adds a put-option liability and a ₹44 cr fair-value charge in Q1FY27'],
      ['Nov-2025', 'IPO at ₹109 (₹3,100 cr fresh, ₹380 cr sale); listed at ₹145 on 18-Nov-2025', 'Treasury to ~₹5,000 cr; other income ₹232 cr in FY26; 35:1 bonus before the IPO'],
      ['FY26', '155 centres added (353); K-12 school company (₹400 cr allocated); PW Talk, Earners, PW Books', 'Revenue ₹3,900 cr (+35%); PBT ₹10 cr, the first positive year'],
      ['May-Aug 2026', 'NEET-UG cancelled and re-held; FinZ lending exit; first auditor-reviewed channel EBITDA', 'Q1FY27 growth 24% instead of 20-25% offline / ~33% online run-rate; lower "Others" losses'],
    ], source: 'Company letters, AR FY26 (IPO utilisation, group structure, note 43), Screener' } },
    { callout: '**Corporate actions to remember when reading the numbers:** (1) the pre-IPO bonus (35 new shares for each one held) means all per-share history is restated; (2) the preference shares were liabilities at fair value until FY24, which explains part of the FY24 loss; (3) acquisitions came with put options for the sellers\' remaining stakes, carried as a redemption liability rather than debt; (4) FY26 channel revenue was restated in Q1FY27 (B2B and some "others" moved into online and offline), so old and new channel numbers do not compare directly.' },
  ],
};

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Test prep is a ₹1.1 lakh crore market growing ~13%, and only a small part of it is online',
  blocks: [
    { p: 'India spends ₹15-16 lakh crore a year on education (FY25, Redseer in AR FY26). Test preparation is ₹1.0-1.1 lakh crore (~7%), K-12 ₹7.7-8.7 lakh crore (~52%) and higher education ₹5.5-6 lakh crore. Online is only ~4% of education spending, the lowest of any big consumer category (retail 7-10%, travel 35-40%). Redseer, quoted by JPMorgan, expects test prep to grow ~13% a year over FY25-30 and online test prep ~29%. Demand rests on a hard fact: far more students sit JEE, NEET, UPSC and government-job exams than there are seats or posts, and families pay to improve the odds. Management puts the test-prep pool at ~6 crore students growing 13-15% a year (Q3FY26 call).' },
    { exhibit: { type: 'table', title: 'Indian education market, FY25 (Redseer via AR FY26)', head: ['Segment', 'Size (₹ lakh crore)', 'Share', 'PW presence'], rows: [
      ['K-12 (schools, tuition)', '7.7-8.7', '~52%', 'Curious Jr, Foundation, state boards, school-integrated programmes; a few schools'],
      ['Higher education', '5.5-6.0', '~36%', 'Minimal (online degrees through partners)'],
      ['Test preparation', '1.0-1.1', '~7%', 'Core: JEE, NEET, UPSC, CA, government exams, MBA, GATE'],
      ['Pre-K', '0.45-0.55', '~3%', 'PW Kids (small)'],
      ['Upskilling', '0.21-0.25', '~2%', 'PW Skills, Earners'],
    ], source: 'AR FY26 MD&A (Redseer report), Q1FY27 letter' } },
    { h: 'Competition' },
    { p: 'Offline JEE and NEET coaching is led by long-established chains (Allen, Aakash, FIITJEE and regional institutes in Kota, Hyderabad and Kerala), which compete on top ranks; PW competes on price and its online brand, and says it now produces the most JEE and NEET selections but still trails on top-100 ranks. Online, the venture-funded wave of 2020-22 (Byju\'s, Unacademy, Vedantu) shrank after the pandemic, leaving PW as the only scaled profitable online test-prep player (DAM Capital estimates ~20% share of online JEE/NEET). The next competitor may not be a coaching company at all: general AI tutors are free, which is why PW is building its own (Ask AI, AI Guru, an AI tutor in beta).' },
    { h: 'Regulation' },
    { p: `${D.industryView.split('Regulation: ')[1]} Coaching guidelines mainly affect offline centres (age limits, fees, space per student); they are advisory until states legislate. The NEET-UG paper was cancelled and re-held in 2026, the second disruption in three years, and NTA plans to move NEET online from 2027, which management sees as a tailwind for digital preparation.` },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Does the tailwind reach PW? Online yes, clearly; offline only by spending capital',
  blocks: [
    { exhibit: { type: 'table', title: 'Tailwind test', head: ['Question', 'Evidence', 'Verdict'], wide: [1], rows: [
      ['Is PW growing faster than its market?', `Online revenue +39% in FY26 vs ~29% for online test prep (Redseer); total +35% vs ~13% for test prep`, '**Yes: gaining share**'],
      ['Is growth broad or one category?', 'JEE/NEET fell from 54% to 29% of online enrolments (FY23-26) while still growing 51% in absolute terms; 13 of 16 categories grew enrolments by double digits in FY26', '**Broad**'],
      ['Is offline growth earned or bought?', `Offline revenue +31% in FY26 came with centres up from ${f25.centres} to ${f26.centres}; revenue per student fell 9%; enrolments per centre fell`, '**Mostly bought with new centres**'],
      ['Is pricing power improving?', 'Online ACPU +11% in FY26 and +10% in Q1FY27 (add-ons); offline ARPU +7% in Q1FY27 after a 9% fall', '**Improving, from a low base**'],
      ['What can break it?', 'Exam disruptions (NEET 2024 and 2026), cyclical government-job notifications (Utkarsh enrolments fell in Q1FY27), Kota-style shifts in where students study, AI tutors', '**Real but mostly timing risks**'],
    ], source: 'Company letters and calls; Redseer via AR FY26 and JPMorgan (Apr-2026)' } },
    { callout: `**Verdict:** the sector tailwind (more students chasing scarce seats, a slow shift online) reaches PW directly in online, where it grows faster than the market at high margins and low acquisition cost. In offline it has grown mainly by opening centres, which shows up as revenue before it shows up as profit. With centre openings now slowed, offline growth will have to come from fuller centres and higher fees; that is the test for FY27-28.` },
  ],
};

module.exports = { history, industry, tailwind };
