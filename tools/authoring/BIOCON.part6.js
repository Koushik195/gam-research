// Biocon report, part 6: risks and the honest summary, glossary, statement notes.
const X = require('./BIOCON.ctx2');
const { F, V, SC, n0, n1, pc, price, SHARES, SOTP, MBS, MGEN, HBS, rating, buyBelow, sellAbove, medTp, peNowSep, dcfLessMi, mv } = X;

const risks = {
  id: 'risks', nav: 'Risks & verdict', kicker: 'Risks & honest summary', title: `Verdict: ${rating}. Good assets, a fixed structure and real upside, if the launches finally deliver`,
  blocks: [
    { exhibit: { type: 'table', title: 'Key risks', head: ['Risk', 'Likelihood', 'Impact', 'What we watch'], wide: [3], rows: [
      ['The second-half ramp slips again (aflibercept against an entrenched rival, denosumab and aspart contracts, Malaysia line fill)', 'Medium-High', 'High', 'Q2/Q3FY27 biosimilars revenue vs ~₹3,000-3,300 cr a quarter; CY2027 payer contracts'],
      ['US price erosion faster than expected as the FDA eases entry and Chinese/Korean rivals arrive', 'Medium', 'High', 'Biosimilars margin vs 25%; insulin and oncology share'],
      ['FDA action at Biocon Park, Biocon Campus or Johor (a biologic plant cannot be swapped quickly)', 'Low-Medium', 'High', 'Classification of the Apr-2026 pre-licence inspection; re-inspections'],
      ['US tariffs extended to generics and biosimilars (~47% of revenue is US)', 'Low-Medium', 'High', 'Legislation; management says current law exempts them'],
      ['Syngene\'s client loss is not replaced; its share price falls further (each ₹100 = ~₹10 on our target)', 'Medium', 'Medium', 'Syngene quarterly revenue and margin; new CDMO contracts'],
      ['Generics plants stay under-used; GLP-1 prices collapse', 'Medium', 'Low-Medium', 'Generics margin vs 6-9%'],
      ['Overhang: Viatris (5.6%) and other swap holders sell; another equity raise', 'Medium', 'Medium', 'Block deals; capital-allocation statements'],
      ['Rupee strengthens (revenue in dollars and euros) or rates rise (dollar debt)', 'Low-Medium', 'Medium', 'INR/USD; refinancing of the 6.67% notes'],
      ['Governance: related-party dealings with Bicara; succession; the 2022 CBI case', 'Low', 'Medium', 'Board changes, related-party disclosures, court records'],
    ], source: 'GAM Research' } },
    { h: 'The honest summary' },
    { exhibit: { type: 'table', title: 'What you buy, what you pay', head: ['', ''], wide: [1], rows: [
      ['What you buy', 'A top-tier global biosimilars business (insulins, oncology, immunology, bone, eye) with US plants cleared by the FDA, five launches under way, the investment phase done and full ownership of it since June 2026; a small, recovering generics arm; 52.4% of a struggling Syngene; ~10% of Bicara. Also net debt of ~3x EBITDA, ROCE of ~4-6% and a history of one-offs.'],
      ['What you pay', `₹${n0(price)}: ${n1(peNowSep)}x Sep-28E EPS (expensive on earnings), ~${n1(X.LOOK.at(-1).mult)}x forward EBITDA for biosimilars on our look-through (below its ${n1(HBS.med)}x median since FY24 and the street's 20-22x). Our SOTP gives {{dcf.tp|inr}} ({{dcf.upside|chg}}); the median of street targets is ₹${n0(medTp)}.`],
      ['Why BUY, not HOLD', 'The upside comes from the rule: biosimilars valued on their own history plus listed stakes at market. FY26 removed the structural reasons for the discount (minorities, structured debt), and interest and capex are falling while the launches arrive.'],
      ['Why not more confident', `Both cross-checks (EV/EBITDA ₹${n0(mv('ev').value)}, DCF ₹${n0(mv('dcf').value)} / ₹${n0(dcfLessMi)} after minorities) sit near the price; our EPS is below the street; and the company has promised second-half acceleration before. The bear case ({{scen.bear.tp|inr}}) is only slightly below today's price, the bull case ({{scen.bull.tp|inr}}) far above: the asymmetry is the argument.`],
      ['What would make us more positive', 'Biosimilars revenue above ₹3,200 cr a quarter by Q4FY27 with margins at 26%+; refinancing of the 6.67% notes; a Bicara or Syngene monetisation that cuts debt; FDA approval of pertuzumab from Biocon Park.'],
      ['What would make us negative', `Q2-Q3FY27 biosimilars growth below 10% in rupees, margins below 24%, an FDA warning letter, or a new equity raise; or a price above ~₹${n0(sellAbove)} on unchanged estimates.`],
    ], source: 'GAM Research' } },
    { callout: `**How we would act:** buy in stages rather than all at once, with Q2FY27 results (due by mid-November 2026) as the first checkpoint. The thesis is simple to monitor: biosimilars EBITDA has to move from ~₹730 cr a quarter towards ~₹900 cr through FY28 (our Sep-28E run-rate is ₹${n0(SOTP.base.bsEb / 4)} cr a quarter incl. corporate costs), and net debt has to fall. If both happen, ${MBS.base}x forward EBITDA gives the target; if the ramp stalls, the stock is worth roughly what it trades at.` },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['Biologic / biosimilar', 'A biologic is a medicine made in living cells (insulin, antibodies). A biosimilar is an approved near-copy sold after the original\'s patents expire, usually 15-35% cheaper at launch.'],
      ['Interchangeable', 'A US designation allowing pharmacists to substitute the biosimilar for the original without asking the doctor (Biocon\'s glargine, aspart and aflibercept have it).'],
      ['Pharmacy vs medical benefit (Part B)', 'US drugs bought at pharmacies through insurers\' formularies vs drugs given in clinics and hospitals and paid on average selling prices (ASP), which fall as competition rises.'],
      ['Generic / API', 'A copy of an off-patent small-molecule drug; an API (active pharmaceutical ingredient) is the drug substance sold to other manufacturers.'],
      ['GLP-1', 'Peptide drugs for diabetes and obesity (liraglutide, semaglutide); Biocon makes them by fermentation.'],
      ['CRDMO', 'Contract research, development and manufacturing organisation: Syngene\'s business.'],
      ['USFDA, Form 483, VAI, OAI, PLI', 'The US regulator; a Form 483 lists inspection observations; VAI ("voluntary action indicated") means cleared with fixes, OAI ("official action") is the bad outcome; a pre-licence inspection (PLI) precedes approval of a new biologic.'],
      ['QIP', 'Qualified institutions placement: a share sale to institutional investors.'],
      ['Minority interest / NCI', 'The part of a subsidiary owned by outside shareholders (Syngene\'s 47.6%; BBL\'s ~23% until Jan-2026).'],
      ['EBITDA (before other income)', 'Operating profit before depreciation, amortisation, interest, tax and other income (Screener basis); Biocon\'s own "EBITDA" includes other income.'],
      ['EV/EBITDA', 'Enterprise value (market value + net debt) divided by EBITDA; the street\'s yardstick for biosimilars and generics.'],
      ['Look-through multiple', 'The multiple the market implicitly pays for one part of a group after subtracting the market value of its other parts.'],
      ['SOTP', 'Sum of the parts: each business valued separately, plus listed stakes, less net debt.'],
      ['Sep-28E', 'The twelve months to Sep-2028 (half FY28E + half FY29E): what the market will look at in Sep-2027, our target date.'],
      ['DCF, WACC', 'Discounted cash flow; weighted average cost of capital (the blended cost of debt and equity).'],
      ['ROCE / ROE', 'Return on capital employed / return on equity.'],
      ['Constant currency', 'Growth excluding exchange-rate changes.'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'sales@FY19': '+34%: biosimilars scale up (US launch of Fulphila, pegfilgrastim, in 2018 via Mylan) and Syngene growth.',
  'sales@FY23': '+37%: Viatris biosimilars business consolidated from 29-Nov-2022 (four months).',
  'sales@FY24': '+32%: first full year of the Viatris business.',
  'sales@FY25': '+3%: India branded formulations sold (Q1FY25); one-time US lenalidomide (~₹300 cr) in Q4.',
  'sales@FY26': '+11%: biosimilars +16%, generics +5% reported (+17% ex-lenalidomide), Syngene +3%.',
  'ebitdaMargin@FY20': '25.5%: peak before the Viatris integration and the new-plant costs.',
  'interest@FY23': '₹419 cr: acquisition debt for the Viatris deal from Nov-2022.',
  'interest@FY24': '₹974 cr: full year of the deal debt and structured instruments.',
  'otherIncome@FY24': '₹853 cr incl. ₹530 cr Bicara dilution/fair-value gain and ₹350 cr from two divested branded units.',
  'otherIncome@FY25': '₹1,217 cr incl. the ₹1,057 cr gain on selling the India branded formulations business.',
  'otherIncome@FY26': '−₹76 cr: Screener nets −₹335 cr of exceptional items (integration, transaction costs, labour codes, inventory) into other income.',
  'pat@FY23': '−29%: interest and amortisation of the Viatris deal; ₹230 cr after-tax exceptional charges; minorities.',
  'pat@FY24': '+121%: one-off gains (Bicara, branded units) in other income.',
  'pat@FY25': '−1%: the ₹1,057 cr branded-business gain offset weaker operations; minorities took ₹416 cr.',
  'pat@FY26': '−62%: no one-off gains, ₹403 cr pre-tax exceptional costs, higher amortisation; minorities absorbed part of BBL\'s loss.',
  'eps@FY26': '₹2.37 on 162.97 cr shares (36% more than in Mar-25 after two QIPs and the BBL share swap); reported basic EPS ₹2.82 on weighted shares.',
  'dep@FY26': '+16%: launch intangibles amortised; rupee depreciation raises the value of foreign assets.',
  'cfo@FY26': '₹1,994 cr: inventory build (₹4,931 cr to ₹6,086 cr) for the FY27 launches.',
};

module.exports = { risks, glossary, statementNotes };
