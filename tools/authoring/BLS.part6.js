// BLS report, part 6: risks and honest summary, glossary, statement notes.
const X = require('./BLS.ctx');
const { ruleText } = require('../../src/ratings');
const { F, AS, n0, n1, pc, price, MULT, SENS, MV, FM, rating, buyBelow, sellAbove, epsSep, at, mv, sepNow, Q1 } = X;

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: `Our honest summary: a 40%-margin visa franchise at ${n1(sepNow)}x Sep-28E EPS; ${rating}, because the sector and the stock have de-rated for reasons that are not all wrong`,
  blocks: [
    { callout: '**What you are buying:** one of two global visa-outsourcing leaders (46 client governments, 44 lakh applications a year, ~40% segment margin), a six-year Aadhaar contract, a fast-growing but thin-margin digital arm (~47% owned by others), ₹1,617 cr of net cash (Jun-26) and ROE near 30%.' },
    { callout: `**What you are paying:** ${n1(price / F.eps[0])}x our FY27E and ${n1(sepNow)}x Sep-28E EPS for ~${Math.round(X.epsCagrFwd)}% a year EPS growth, flat visa volumes, re-tender and government risk, a low tax rate that may rise, and a management that prefers acquisitions to buybacks. Since 2021 the market has paid a median ${n1(FM.median)}x forward. On the house rule (own median × the travel + internet sector move of ${pc(MV.set)}) the target is {{dcf.tp|inr}} ({{dcf.upside|chg}}): ${rating}. With no sector move it would be ~₹${n0(at(SENS.none))}; with IRCTC's five-name set ~₹${n0(at(SENS.irctc))}; the DCF says ~₹${n0(mv('dcf').value)}.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      ['Visa volumes grow again (Slovakia, Cyprus, China ramp; West Asia calm)', 'Medium', 'Q2FY27 applications (results due by mid-November 2026)'],
      ['A large new global tender win (management cites a US$1-2 bn pipeline)', 'Medium', 'Exchange filings; each big European contract can add 5-10% to visa revenue'],
      ['Aadhaar at the top of its margin range (15%+)', 'Low-Medium', 'Segment margin as Aadhaar reaches run-rate in Q4FY27'],
      ['A buyback or higher payout instead of more acquisitions', 'Low-Medium', 'Board decisions; management said it "may be discussed"'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['Loss or re-pricing of a large contract (Spain, Italy/Germany via iDATA, Indian missions)', 'Medium', 'Country revenue is not disclosed; a top contract could be 10%+ of visa EBITDA'],
      ['A fresh MEA show-cause notice and debarment (the court left the door open)', 'Low-Medium', 'Indian missions were ~12% of revenue in Q1FY26; new Indian tenders (China, Aadhaar-type work) at risk'],
      ['Caps on value-added services or e-visas replacing in-person applications', 'Low-Medium', 'VAS drive net revenue per application; a cap would hit the 40% margin'],
      ['Tax: UAE rate change or more profit in India', 'Medium', 'Each 3 points of tax is ~3-4% of EPS'],
      ['Value-destroying acquisitions (₹2,000 cr budget) or goodwill impairment', 'Medium', 'Lower ROE; impairment would hit reported profit'],
      ['Sector and stock de-rate further', 'Medium', `At the bear multiple (${MULT.bear}x) on base EPS the stock is worth ~₹${n0(at(MULT.bear))}`],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**This is close to the BUY line, and the peer set decides it.** The house rule takes BLS's own forward P/E median (${n1(FM.median)}x) and applies the four-name travel + internet move (${pc(MV.set)}): ${MULT.base}x. With IRCTC's five-name set (${pc(MV.irctc)}) the value would be ~₹${n0(at(SENS.irctc))}; with no sector move ~₹${n0(at(SENS.none))}. We do not pick the friendlier set (§7c).`,
      `**We would turn buyers below ~₹${n0(buyBelow)}** and sellers above ~₹${n0(sellAbove)} on today's numbers; sooner either way on a large contract win or loss.`,
      `**Biggest swing factors:** the multiple (each 1x is ~₹${n0(epsSep.base)} a share), visa volumes, and the tax-plus-minority rate (${AS.taxRate[0]}% in FY27E; each point is ~1.2% of EPS).`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Visa & Consular EBITDA margin', v: `${Q1.visaMargin}%`, d: 'Q1FY27; 14.6% in FY22' },
      { k: 'Visa applications, Q1FY27', v: `${Q1.applicationsLakh} lakh`, d: 'flat year on year' },
      { k: 'Net cash (Jun-26)', v: '₹1,617 cr', d: '~₹39 a share' },
      { k: 'Price ÷ our Sep-28E EPS', v: `${n1(sepNow)}x`, d: `own median since 2021: ${n1(FM.median)}x` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['Visa outsourcing / VAC', 'A government hires a company to run its visa application centres (VACs): appointments, document checks, biometrics, passport return. The embassy still decides.'],
      ['User-pay', 'The applicant, not the government, pays the outsourcer\'s service fee (set in the tender).'],
      ['Value-added services (VAS)', 'Optional paid extras: premium lounge, courier, SMS updates, form filling, photocopies, insurance, home biometrics.'],
      ['Net revenue per application (NRPA)', 'Visa revenue less cost of services (partner and vendor shares), divided by applications: what BLS keeps per applicant.'],
      ['Partner-run vs self-managed', 'Centres run by a local partner who takes a share of the fee, vs centres BLS runs itself.'],
      ['Aadhaar Seva Kendra', 'A UIDAI centre where residents enrol for or update their Aadhaar (India\'s biometric ID); BLS is paid per transaction.'],
      ['Business correspondent (BC)', 'An agent outlet that offers basic banking (deposits, withdrawals, account opening) on behalf of a bank; paid a commission per transaction. GTV = gross transaction value.'],
      ['Citizenship / residency by investment', 'Programmes that grant residency or citizenship in return for an investment; Citizenship Invest advises applicants.'],
      ['MEA / GFR debarment', 'The Ministry of External Affairs; under Rule 151 of the General Financial Rules a ministry can bar a supplier from its tenders.'],
      ['Minorities (non-controlling interests)', 'Outside shareholders of subsidiaries; their share of profit is not BLS shareholders\' profit.'],
      ['P/E, EV/EBITDA', 'Share price ÷ earnings per share; enterprise value (market value less net cash) ÷ EBITDA.'],
      ['Sep-28E', 'Half of FY28E plus half of FY29E: the 12-month-forward earnings the market will look at in September 2027.'],
      ['Sector move', 'How far comparable stocks trade below (or above) their own five-year median P/E on the valuation date.'],
      ['DCF', 'Discounted cash flow valuation; future free cash flow discounted at the cost of equity (net cash here).'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'sales@FY21': '−39%: Covid; visa centres shut for much of the year.',
  'sales@FY22': '+78%: travel reopened.',
  'sales@FY23': '+78%: first full normal year; Zero Mass (BC) bought.',
  'ebitdaMargin@FY24': '21%: shift to self-managed centres lifts the visa margin to 22%.',
  'ebitdaMargin@FY25': '30%: visa margin 34.5%; iDATA, Citizenship Invest consolidated.',
  'sales@FY26': '+37%: first full year of Aadifidelis (loan distribution); visa +11%.',
  'ebitdaMargin@FY26': '28%: digital (7% margin) grew to 39% of revenue.',
  'pat@FY26': 'Owners\' profit ₹687 cr (₹724 cr before ₹37 cr of minorities).',
  'cfo@FY25': '₹829 cr: advance fees and payables rose with acquisitions.',
  'sales@Q4FY25': '+55%: Aadifidelis consolidated from Nov-2024.',
  'sales@Q1FY27': '+25%: Visa +22% (Aadhaar, hotel, Citizenship Invest; applications flat), Digital +32%.',
  'dep@Q1FY27': '+39%: Aadhaar centres and leases.',
  'sales@FY27E': 'GAM: visa ex-Aadhaar +13%, Aadhaar ₹180 cr, digital organic +20%, Atyati ₹206 cr (9 months).',
  'ebitdaMargin@FY27E': 'GAM: visa ~38%, digital ~7.8% (company basis); Screener basis adds bank charges.',
  'pat@FY27E': `GAM: tax ~12% plus minorities ~5.5% of PBT (${AS.taxRate[0]}% in all).`,
  'otherIncome@FY27E': 'GAM: ~5% on gross cash and deposits plus ₹18 cr of other items; FX gains not forecast.',
};

module.exports = { risks, glossary, statementNotes };
