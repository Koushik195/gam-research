// IndiaMART report, part 6: risks and honest summary, glossary, statement notes.
const X = require('./INDIAMART.ctx');
const { ruleText } = require('../../src/ratings');
const { F, V, AS, n0, n1, pc, price, MULT, SENS, MV, cleanMed, rating, buyBelow, sellAbove, medTp, epsSep, at, mv, sepNow, Q1, coMargin } = X;

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: `Our honest summary: ${n1(sepNow)}x Sep-28E EPS for a stalled but cash-rich platform; ${rating}, if the multiple recovers part of its de-rating`,
  blocks: [
    { callout: `**What you are buying:** India's largest B2B listing platform: 2.2 lakh paying MSME suppliers, an ARPU that has risen 57% in four years, a ~34% EBITDA margin, no debt, ₹${n0(Q1.cashTreasury)} cr of cash and treasury (~₹590 a share) and customers who pay up to years in advance. Also a ₹750 cr start-up portfolio and Busy, which add noise more than value today.` },
    { callout: `**What you are paying:** ${n1(price / F.eps[0])}x our FY27E and ${n1(sepNow)}x Sep-28E EPS, ~${n1(X.exCashPe)}x FY28E operating EPS after its cash and stakes. Since 2021 the market has paid a median ${n1(cleanMed)}x forward (before one-offs). On the street's method and the house multiple the target is {{dcf.tp|inr}} ({{dcf.upside|chg}}): ${rating}. With the last two years' multiples only it would be ~₹${n0(at(SENS.two))}; with classifieds peers only ~₹${n0(at(SENS.cls))}; the DCF says ~₹${n0(mv('dcf').value)}. The street median is ₹${n0(medTp)}.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      ['Silver churn falls and net supplier additions turn positive for two or more quarters', 'Low-Medium', 'Quarterly net adds (management gives no guidance until "multiple quarters of continual success")'],
      ['Unique business enquiries grow again (Meta/YouTube buyer acquisition, repeat buyers)', 'Medium', 'UBE above 27-28 Mn a quarter'],
      ['Category-based Platinum pricing lifts ARPU >10% without more churn', 'Medium', 'ARPU and Gold/Platinum retention'],
      ['A buyback or higher regular payout from ~₹3,500 cr of cash', 'Medium', 'Board decisions; FY26 payout 76%'],
      ['IndiaMART Finance and paid buyer services start producing revenue', 'Low-Medium', 'Disclosure in the deck'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['AI assistants take B2B discovery: fewer enquiries reach IndiaMART, subscriptions lose value', 'Medium', 'Bear case: base shrinks ~2K a quarter, revenue growth ~5%'],
      ['Price rises meet resistance beyond Silver (Gold/Platinum churn rises)', 'Low-Medium', 'ARPU growth halves; EPS growth to mid-single digits'],
      ['Management re-accelerates acquisition spending to restore growth', 'Medium', `Each 1 pt of revenue on sales and marketing is ~₹17 cr, ~2% of EPS; margin below the ${n1(coMargin[0])}% we assume`],
      ['Bond yields rise (treasury marks) or start-up write-downs', 'Medium', 'Quarterly EPS swings of ±₹5-10 (Q4FY26 other income −₹34 cr)'],
      ['More capital into minority stakes', 'Medium', 'Lower cash returns; more equity-accounted losses'],
      ['The de-rating continues (classifieds and internet peers fall further)', 'Medium', `At the bear multiple (${MULT.bear}x) on base EPS the stock is worth ~₹${n0(at(MULT.bear))}`],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**This is a multiple call, and we say so.** Our EPS is within ~3% of the street's. The house rule takes IndiaMART's own forward P/E median before one-offs (${n1(cleanMed)}x) and applies the three-name sector move (${pc(MV.all)}): ${MULT.base}x. IndiaMART has de-rated by ${pc(X.dr5.INDIAMART)} against its five-year median, more than its peers, which is why the rule finds upside. Part of that de-rating is deserved (two years without customer growth, AI risk to discovery), which the rule does not capture: on the last two years' multiples the value is ~₹${n0(at(SENS.two))}.`,
      `**We would move to HOLD above ~₹${n0(buyBelow)}** and to SELL above ~₹${n0(sellAbove)} on today's numbers, or sooner if paying suppliers keep falling and enquiries decline.`,
      `**Biggest swing factors:** the multiple (each 1x is ~₹${n0(epsSep.base)} a share), the paying-supplier trend and the standalone margin (each point is ~₹16 cr of EBITDA).`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Paying suppliers', v: `${Q1.standalone.payingSuppliersK}K`, d: 'Jun-26; 217K at Mar-25' },
      { k: 'ARPU growth, Q1FY27', v: '+8%', d: `₹${Q1.standalone.arpuK}K per supplier` },
      { k: 'EBITDA margin (company basis)', v: `${n1(Q1.ebitdaCo / Q1.sales * 100)}%`, d: 'Q1FY27; guidance ~33%' },
      { k: 'Price ÷ our Sep-28E EPS', v: `${n1(sepNow)}x`, d: `own median since 2021: ${n1(cleanMed)}x` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['Paying supplier', 'A seller with a paid IndiaMART subscription at period end.'],
      ['Silver / Gold / Platinum', 'IndiaMART\'s subscription tiers, from entry (monthly or annual) to premium (more leads, better ranking, category and location targeting).'],
      ['ARPU', 'Average revenue per paying supplier: trailing-twelve-month standalone revenue ÷ average paying suppliers.'],
      ['Churn', 'The share of paying suppliers who do not renew, usually quoted per month.'],
      ['Gross / net additions', 'New paying suppliers in a period / new ones less those who left.'],
      ['Unique business enquiries (UBE)', 'Distinct buyer requirements (product, quantity, location) received in a quarter.'],
      ['BuyLead / RFQ', 'A buyer\'s requirement that IndiaMART sells to paying suppliers.'],
      ['Collections / deferred revenue', 'Cash received from customers / subscriptions paid for but not yet recognised as revenue.'],
      ['Adjusted EBITDA', 'EBITDA before employee share-based payment (ESOP) cost, as the company reports it.'],
      ['Associates / FVTPL', 'Start-ups where IndiaMART has significant influence (its share of their profit or loss is booked) / investments carried at fair value with gains and losses through profit.'],
      ['Mark-to-market (MTM)', 'Revaluing bond funds to market prices; rising yields cause losses, falling yields gains.'],
      ['TrustSEAL', 'IndiaMART\'s verified-seller badge.'],
      ['P/E, EV/EBITDA', 'Share price ÷ earnings per share; enterprise value (market value less net cash) ÷ EBITDA.'],
      ['Sep-28E', 'Half of FY28E plus half of FY29E: the 12-month-forward earnings the market will look at in September 2027.'],
      ['Sector move', 'How far comparable stocks trade below (or above) their own five-year median P/E on the valuation date.'],
      ['DCF', 'Discounted cash flow valuation; future free cash flow discounted at the cost of equity (no debt here).'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'ebitdaMargin@FY21': 'Covid year: hiring and marketing frozen; company-basis margin 49%.',
  'sales@FY23': '+31%: Busy consolidated; paying suppliers +34K.',
  'ebitdaMargin@FY23': 'Investment phase: headcount and sales teams up; associates\' losses ₹38 cr inside Screener EBITDA.',
  'otherIncome@FY23': 'Incl. ₹84 cr of fair-value gains on start-up stakes.',
  'pat@FY24': 'FY24: buyback and 1:1 bonus; EPS bonus-adjusted.',
  'ebitdaMargin@FY25': 'Margin recovery: lower customer acquisition, price rises.',
  'otherIncome@FY25': 'Incl. ₹43 cr start-up fair-value gains and ₹29 cr gain on selling an associate stake.',
  'pat@FY25': '+65%: margin recovery, one-offs and a 22% tax rate.',
  'otherIncome@FY26': 'Incl. ₹78 cr start-up gains; treasury return cut by bond losses in Q4.',
  'pat@FY26': '−14%: lower treasury return, higher tax (26.7%), ESOP ₹37 cr.',
  'otherIncome@Q4FY26': '−₹34 cr: bond mark-to-market loss.',
  'pat@Q4FY26': '₹50 cr: treasury loss and a 36% tax rate.',
  'otherIncome@Q1FY27': '₹107 cr: treasury marks reversed.',
  'sales@FY27E': `GAM: IndiaMART +${AS.segments[0].growth[0]}%, Busy +${AS.segments[1].growth[0]}%.`,
  'ebitdaMargin@FY27E': `GAM: ${n1(coMargin[0])}% before associates (guidance ~33%).`,
  'otherIncome@FY27E': `GAM: ${AS.treasuryYield[0]}% on opening treasury, no fair-value gains.`,
};

module.exports = { risks, glossary, statementNotes };
