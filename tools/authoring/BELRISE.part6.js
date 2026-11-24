// Belrise Industries report, part 6: risks and honest summary, glossary, statement notes.
const X = require('./BELRISE.ctx');
const { ruleText } = require('../../src/ratings');
const { F, n0, n1, n2, price, MULT, PE12, rating, buyBelow, sellAbove, medTp, epsSep, mergerAccretion, epsMerged } = X;
const tpPerPp = pp => MULT.base * (F.sales[1] + F.sales[2]) / 2 * pp / 100 * (1 - 0.255) / F.shares; // target change per point of margin

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: `Our honest summary: a good operator at ${n1(X.sepNow)}x Sep-28E EPS; ${rating} on price, not on the business`,
  blocks: [
    { callout: '**What you are buying:** a well-automated, vertically integrated maker of chassis, exhausts and other metal parts for India\'s two-wheeler makers, steadily adding parts per vehicle and new customers, now debt-free with ₹1,657 cr of fresh cash. You are also buying a family-controlled company in a hurry: four acquisitions in eighteen months, a related-party merger, a fifth of revenue in low-margin trading and plans to spend the QIP money on aerospace deals.' },
    { callout: `**What you are paying:** ${n1(price / F.eps[0])}x our FY27E and ${n1(price / F.eps[1])}x FY28E EPS for ~${Math.round(X.epsCagrFwd)}% a year EPS growth and a ~15% ROCE. Over the last year the market paid a median ${n1(PE12.med)}x forward; today it pays ${n1(X.fwdNow)}x, near the top of the range, while auto-component peers have de-rated. The street\'s targets (median ₹${n0(medTp)}) assume the merger and more growth.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      ['NCLT approves the merger', 'High', `+${n1(mergerAccretion)}% to Sep-28E EPS (₹${n2(epsMerged)}); filings`],
      ['QIP money buys earnings at sensible prices', 'Medium', 'Price paid vs EBITDA (Chester Hall ~6x, Hyva ~3.6x so far)'],
      ['New 2W/3W programmes start on time in Q4FY27', 'Medium-High', '2W/3W revenue growth vs industry'],
      ['Manufacturing margin back to 13.8-14%', 'Medium', 'Quarterly manufacturing EBITDA margin (12.7% in Q1FY27)'],
      ['A price below ~₹' + n0(sellAbove), '–', 'The rating moves to HOLD below ~₹' + n0(sellAbove)],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['Largest customer keeps losing two-wheeler share', 'Medium', '2W/3W is 82% of manufacturing revenue; Q1FY27 already lagged the industry'],
      ['Overpaying for aerospace acquisitions', 'Medium', 'Up to ₹1,657 cr of cash; small units already lost money (SDM ₹9.5 cr in Q4FY26)'],
      ['Steel and wage costs recovered late', 'Medium', `Each point of FY28-29E EBITDA margin moves the target by ~₹${n0(tpPerPp(1))}`],
      ['Two-wheeler demand fades after the GST-cut boost', 'Medium', 'Revenue growth falls towards single digits'],
      ['Electric two-wheelers gain share', 'Medium (slow)', 'Exhausts and fuel tanks (~25% of manufacturing revenue) are not needed'],
      ['Related-party terms move against minorities', 'Low-Medium', 'Merger terms, purchases from promoter companies, pay'],
      ['Trading arm shrinks further', 'Medium', 'Lower revenue, little profit effect (~5% margin)'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**We would move to HOLD below ~₹${n0(sellAbove)}** and to BUY below ~₹${n0(buyBelow)} on today\'s numbers.`,
      `**The SELL is narrow and is about price.** At ${MULT.base}x the merger alone would take the target to ~₹${n0(MULT.base * epsMerged)} (HOLD), though the history would then have to be measured on merged EPS too. We would buy a well-run supplier like this nearer ₹${n0(buyBelow)}, or on proof that the QIP money buys earnings cheaply.`,
      `**Biggest swing factor:** the multiple. Each 1x is ~₹${n2(epsSep.base)} a share; the stock has traded at ${n1(PE12.min)}-${n1(PE12.max)}x forward in the last year.`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Manufacturing growth Q1FY27', v: '+20%', d: 'trading −19%' },
      { k: 'Manufacturing EBITDA margin', v: '12.7%', d: 'Q1FY27; 13.7% in FY26' },
      { k: 'ROCE', v: '~15%', d: 'company ROACE 14.7% FY26' },
      { k: 'Price ÷ our Sep-28E EPS', v: `${n1(X.sepNow)}x`, d: `12-month median: ${n1(PE12.med)}x` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['OEM', 'Original equipment manufacturer: the vehicle maker.'],
      ['Chassis / BIW', 'The frame of a two-wheeler / body-in-white: the welded metal body of a car before painting.'],
      ['Sheet metal, stamping, fabrication', 'Cutting and pressing steel sheet into shapes, then welding and assembling them.'],
      ['High-tensile steel', 'Stronger steel (here up to 1,470 MPa) that allows thinner, lighter parts; harder to press and weld.'],
      ['Tier 1 / Tier 0.5', 'A supplier of components to the OEM / of complete systems (several components assembled and engineered together).'],
      ['Powertrain-agnostic', 'A part needed whatever the engine (petrol or electric), e.g. a chassis; an exhaust is not.'],
      ['Content per vehicle', 'Value of a supplier\'s parts in one vehicle.'],
      ['Trading of goods', 'Buying and reselling goods (mainly abroad) without manufacturing them.'],
      ['Pass-through', 'Raw-material price changes billed to customers at cost, usually with a lag.'],
      ['IPO / QIP', 'Initial public offering / qualified institutional placement: a share sale to institutions by a listed company.'],
      ['Scheme of amalgamation / NCLT', 'A court-approved merger / the National Company Law Tribunal that approves it.'],
      ['Related-party transaction', 'A deal between the company and its promoters or their companies.'],
      ['ROCE / ROACE', 'Return on (average) capital employed: operating profit ÷ (equity + debt).'],
      ['P/E, EV/EBITDA', 'Share price ÷ earnings per share; enterprise value (market value plus net debt) ÷ EBITDA.'],
      ['Sep-28E', 'Half of FY28E plus half of FY29E: the 12-month-forward earnings the market will look at in September 2027.'],
      ['Sector move (same window)', 'How far comparable stocks trade above or below their own median P/E over the same 12 months, on the valuation date.'],
      ['DCF', 'Discounted cash flow valuation, here at the cost of equity.'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'sales@FY23': '+22%: new customers and plants; consolidated (FY18-21 columns were standalone and are dropped).',
  'ebitdaMargin@FY24': '12.4% from 13.3%: more trading and higher materials.',
  'interest@FY25': '₹307 cr: borrowings peaked at ₹2,964 cr (incl. H-One, bought Mar-2025).',
  'pat@FY24': 'Flat: interest +16% absorbed EBITDA growth.',
  'sales@FY26': '+15%: manufacturing +17% (cars +37%, trucks +35%), trading +5%.',
  'interest@FY26': '−25%: IPO proceeds repaid ₹1,596 cr of debt in Jun-2025.',
  'pat@FY26': '+40% (₹502 cr before a ₹5 cr labour-code charge): lower interest, higher other income.',
  'eps@FY26': 'Pro forma ₹5.14 on 96.7 cr post-QIP shares; reported ₹5.58 (89 cr shares).',
  'cfo@FY25': 'Working capital absorbed ₹239 cr.',
  'otherIncome@FY26': 'Interest on IPO money ₹45 cr, miscellaneous ₹53 cr, FX ₹11 cr.',
  'sales@Q1FY27': '+13%: manufacturing +20%, trading −19% (Middle East).',
  'opm@Q1FY27': '11.5%: steel and polymer lag, wage hikes, hiring for four new plants.',
  'interest@Q1FY27': '−42% YoY: debt repaid from the IPO.',
  'sales@Q4FY26': '+12%: manufacturing +21%, trading −21%.',
};

module.exports = { risks, glossary, statementNotes };
