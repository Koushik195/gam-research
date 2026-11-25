// Physicswallah report, part 6: risks and the honest summary; glossary.
const X = require('./PWL.ctx');
const { n0, n1, price, MULT, EVX, evSepNow, buyBelow, sellAbove, rating, mvk } = X;

const risks = {
  id: 'risks', nav: 'Risks & summary', kicker: 'Risks and summary', title: 'Risks, and what we would do',
  blocks: [
    { exhibit: { type: 'table', title: 'Key risks', head: ['Risk', 'What would happen', 'Likelihood', 'What to watch'], wide: [1, 3], rows: [
      ['Offline turnaround slips', 'Offline stays loss-making after rent; group EBITDA 15-20% below our FY28-29E; the multiple compresses', 'Medium', 'Quarterly offline pre-IndAS margin; centre openings; ARPU'],
      ['AI substitutes', 'Free or near-free AI tutors cap online prices (~₹4,000 a year) and engagement', 'Medium (long term)', 'ACPU, paid conversion, DAU; PW\'s own AI tutor launch'],
      ['Exam and regulatory shocks', 'Paper leaks, re-tests (NEET 2024 and 2026), fewer government-job notifications, coaching rules for under-16s', 'High (recurring) but mostly timing', 'NTA calendar; state coaching laws; Utkarsh enrolments'],
      ['Key people', 'The brand rests on Alakh Pandey and star teachers; departures would hurt the funnel', 'Low-medium', 'Faculty attrition; YouTube engagement'],
      ['Capital allocation', '₹5,600 cr treasury spent on low-return acquisitions, schools or put-option buy-outs (Sarrthi to 85% by FY31)', 'Medium', 'Acquisition announcements; treasury; redemption liability'],
      ['Competition in offline', 'Allen, Aakash and local chains fight for seats and teachers; results gap at the top ranks', 'Medium', 'Top-100 ranks; teacher costs; centre utilisation'],
      ['Supply and float', 'Thin float (~29%) magnifies moves; the founders\' minimum-contribution lock-in ends May-2027', 'Medium', 'Block deals; FII/DII flows'],
    ], source: 'GAM Research' } },
    { h: 'The honest summary' },
    { exhibit: { type: 'table', title: 'What you buy, what you pay, what would change our mind', head: ['', ''], wide: [1], rows: [
      ['**What you buy**', 'India\'s cheapest and largest online test-prep platform, profitable and growing ~30%, with a free funnel and a cash-rich, debt-free balance sheet; plus a young offline network that may or may not reach 13-15% margins.'],
      ['**What you pay**', `₹${n1(price)} = ${n1(X.evNow)}x our FY28E EBITDA (after ESOP), about the ${n1(EVX.med)}x median the market has paid since January; our ${MULT.base}x gives {{dcf.tp|inr}} ({{dcf.upside|chg}}); the DCF (₹${n0(mvk('dcf').value)}) says the price already assumes a good outcome.`],
      ['**Upgrade / add triggers**', 'Offline at or near break-even in H1FY27; online growth staying above 30% after JEE/NEET normalise; AI products earning revenue.'],
      ['**Downgrade / sell triggers**', 'Offline losses not narrowing in Q2-Q3; a large acquisition or school programme; ACPU falling as AI competition arrives.'],
      ['**How we would act**', `${rating} with a 12-month target of {{dcf.tp|inr}}. On our rating rule the stock is a BUY below ₹${buyBelow} and a SELL above ₹${sellAbove}. The bear case ({{scen.bear.tp|inr}}) is real: size the position for it.`],
    ], source: 'GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'Meaning'], wide: [1], rows: [
      ['ACPU', 'Average collection per user (online): fees collected from online students in the period ÷ unique paying users.'],
      ['ARPU (offline)', 'Revenue recognised from offline students in the period ÷ offline enrolments.'],
      ['Pre-IndAS EBITDA', 'The company\'s main profit measure: revenue less all operating costs including rent (lease payments), before share-based pay and other income.'],
      ['Adjusted EBITDA', 'Company measure: pre-IndAS EBITDA plus rent and other income; before ESOP and exceptional items. Flattering.'],
      ['EBITDA (this report)', 'Revenue less operating costs including ESOP, before rent (Ind AS 116 puts rent in depreciation and interest) and before other income. Screener\'s basis.'],
      ['Ind AS 116', 'Accounting rule that treats leases as debt and the right to use the premises as an asset; rent leaves EBITDA.'],
      ['ESOP', 'Employee stock options; their cost is charged to profit though no cash is paid.'],
      ['EV/EBITDA', 'Enterprise value (market value less net treasury after lease liabilities) ÷ EBITDA.'],
      ['Sep-28E', 'Half of FY28E plus half of FY29E: the 12-month-forward earnings base for a target set on 30-Sep-2026.'],
      ['Vidyapeeth / Pathshala', 'PW\'s classroom centres / hybrid centres with a teacher on screen and a local doubt teacher.'],
      ['JEE / NEET / UPSC', 'Engineering entrance / medical entrance / civil services exams.'],
      ['NTA', 'National Testing Agency, which runs JEE Main and NEET-UG.'],
      ['Contract liabilities', 'Fees received for courses not yet delivered.'],
      ['Redemption liability', 'The value of PW\'s promise to buy out minority shareholders of acquired companies.'],
      ['Treasury', 'Company definition: investments, bank deposits, cash and other financial assets held as cash.'],
      ['DCF', 'Discounted cash flow: the value today of future free cash flows.'],
    ], source: 'GAM Research' } },
  ],
};

module.exports = { risks, glossary };
