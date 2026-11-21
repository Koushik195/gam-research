// Bajaj Housing Finance report, part 4b: the parent's sell-down (minimum public shareholding), competitive
// advantage scorecard. Q1FY27/guidance and earnings quality are in part4c.
const X = require('./BAJAJHFL.ctx');
const { C, F, n0, n1, n2, pc, price, shares, Q1, MPS, toSellPct, toSellSh, toSellCr, floatNowCr, adtvCr, daysOfVolume, P } = X;

// Fresh-issue route (illustrative): BHFL issues new shares so the parent's 86.7% becomes 75% without a sale
const parentSh = 0.867 * shares, newShFresh = parentSh / 0.75 - shares, freshCr = newShFresh * price;
const bvAfter = (Q1.netWorth + freshCr) / (shares + newShFresh), bvBefore = Q1.netWorth / shares;
const postTaxCof = F.costOfFunds[0] / 100 * (1 - 0.23);
const roeFresh = (F.patAttrib[0] + freshCr * postTaxCof) / ((Q1.netWorth + F.netWorth[0]) / 2 + freshCr) * 100;

const selldown = {
  id: 'selldown', nav: 'The parent\'s sell-down', kicker: 'The central question (1)', title: 'The parent must sell ~₹8,000 cr of stock by Sep-2029; the market has to absorb it',
  blocks: [
    { p: `Indian rules require every listed company to have at least 25% of its shares with the public. BHFL listed with Bajaj Finance holding 88.75%. The parent sold ~2% in a bulk deal on 2-Dec-2025 (16.66 cr shares, stake now 86.70%); the stock fell 9% that day to a then-record low of ₹94.90. In March 2026 a change to the Securities Contracts Rules moved BHFL's deadline from Sep-2027 to **15-Sep-2029**. Bajaj Finance has said: "We will go down to 75%, while we have time and we are in no hurry. First protocol most likely will be BHFL dilution" (30-Jul-2026). Eight weeks later it put its own equity raise to its board, which suggests it does not need BHFL cash urgently.` },
    { exhibit: { type: 'table', title: 'The sell-down in numbers', head: ['Item', 'Value', 'Comment'], wide: [2], rows: [
      ['Stake still to sell', `${n2(toSellPct)}% (${n1(toSellSh)} cr shares)`, 'From 86.70% to 75% by 15-Sep-2029'],
      [`Value at the ${X.ASOF_TXT} close (₹${n0(price)})`, `₹${n0(toSellCr)} cr`, `Equal to ~${n0(toSellCr / 103122 * 100)}% of the parent's Mar-26 standalone net worth (₹1.03 lakh cr)`],
      ['Today\'s free float (public 13.3%)', `₹${n0(floatNowCr)} cr`, `The sale is ${n1(toSellCr / floatNowCr)}x the current float`],
      ['Average daily trading (3 months to Jul-2026)', `~₹${n0(adtvCr)} cr`, `The stake equals ~${n0(daysOfVolume)} days of total trading (Emkay; Motilal's 12-month average ~₹77 cr)`],
      ['Institutional ownership (Jun-26)', `FIIs ${X.D.ownership.fii.toFixed(2)}%, DIIs ${X.D.ownership.dii.toFixed(2)}%`, 'Retail (23 lakh holders) owns 11.3%: the natural buyers are institutions, which so far have stayed out'],
      ['Fresh-issue route (illustrative)', `~${n0(newShFresh)} cr new shares, ~₹${n0(freshCr)} cr`, `Book per share ₹${n1(bvBefore)} → ₹${n1(bvAfter)}, but FY27E ROE ~${n1(roeFresh)}% (vs {{F.roe.0|pct}}) until the cash is lent out; not announced`],
    ], source: 'Annual Report FY2025-26 (directors\' report); Bajaj Finance Q1FY27 call; BusinessToday (2-Dec-2025); Emkay and Motilal Oswal (Jul-2026); GAM Research' } },
    { p: `**What it does to the share price.** Supply of this size usually comes at a discount (block deals and offers for sale are priced below market), and every tranche resets the price for the next. Over the long run a bigger float is a positive: index providers weight by free float, so BHFL\'s weight in indices would roughly double at 25% public, and institutions could own more of it. But the near-term arithmetic is unfriendly: the stock needs ~₹8,000 cr of new buyers over three years at a time when foreign and domestic funds together own under 2%. We see the overhang as one reason the stock trades below its own history; we do not see it as a reason for the multiple to recover.` },
    { callout: `**Consistency with our Bajaj Finance report:** that report (same date) assumed BFL sells down to 75% in two tranches by H1FY28 at ₹82, adding the after-tax gain to BFL's equity and a larger minority interest to its accounts. The deadline is in fact 15-Sep-2029 (confirmed in BHFL's FY26 annual report), so the sale can be slower; the amount (~11.7%) is the same. For BHFL\'s own shareholders, a secondary sale changes nothing in the business; a fresh issue would add capital BHFL does not need yet and cut its ROE. **Our base case assumes secondary sales and no new BHFL shares.**` },
  ],
};

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: real against other HFCs, absent against banks',
  blocks: [
    { p: 'A lender\'s moat shows up as returns that stay above its cost of capital. BHFL\'s ROE (12-15% in FY23-FY26) has hovered around our 12.5% cost of equity, so whatever advantages it has are being competed away in price. We test where its edge comes from.' },
    { verdicts: [
      ['Parentage, brand and AAA funding', 'Advantage (vs HFCs)', 'Bajaj name, AAA from CRISIL and India Ratings, 18 banks, cost of funds 7.2%; the parent buys loan pools.', 'Lower funding cost than most HFCs; still above a bank\'s deposit cost.'],
      ['Underwriting and collections', 'Advantage', 'Gross NPA ~0.3% for nine quarters, credit cost 6-17bp in FY24-26; centralised hubs, tele-interviews for every salaried loan.', 'Durable while it stays in prime; untested in near-prime and in a commercial-property downturn.'],
      ['Operating efficiency', 'Advantage', 'Opex 19.6% of income, ~0.6% of AUM, 2,025 staff for ₹1.5 lakh cr of AUM.', 'Hard to beat; also hard to improve further.'],
      ['Developer and commercial relationships', 'Advantage', '9,800+ approved projects, 608 developers, 332 lease-rental customers incl. REITs and sovereign funds.', 'A sourcing funnel for home loans and a niche banks serve less nimbly.'],
      ['Pricing power in prime home loans', 'Disadvantage', 'Banks set the price; BT-out ~10% of the home-loan book a year, mostly to public-sector banks.', 'Margin compression in a stable or falling rate cycle.'],
      ['Regulatory position', 'Disadvantage', 'No deposits; 50% individual-housing floor (at 50.45%); upper-layer rules; float rule forcing the parent to sell.', 'Caps the mix shift toward higher-margin loans.'],
    ], head: ['Source of advantage', 'Verdict', 'Evidence', 'Durability'], title: 'Moat scorecard', source: 'Company presentations, calls and annual report; GAM Research' },
    { callout: '**Honest verdict:** BHFL is a high-quality franchise without a moat that shows up in returns. Against other housing-finance companies it wins on funding, underwriting and cost; against banks, which own prime home loans, it has no edge in price. The result is a business that grows fast and safely and earns roughly its cost of capital. Quality of that kind deserves a premium to book, but not the ~3x the stock trades at.' },
  ],
};

module.exports = { selldown, moat, ...require('./BAJAJHFL.part4c') };
