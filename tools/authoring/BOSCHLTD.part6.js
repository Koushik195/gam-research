// Bosch Ltd report, part 6: risks and honest summary, glossary, statement notes.
const X = require('./BOSCHLTD.ctx');
const { ruleText } = require('../../src/ratings');
const { F, V, n0, n1, price, MULT, cleanMed, rating, buyBelow, sellAbove, medTp, epsSep, k } = X;

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: `Our honest summary: a quality franchise priced at ${Math.round(X.sepNow)}x Sep-28E EPS; ${rating}`,
  blocks: [
    { callout: `**What you are buying:** Robert Bosch's Indian mobility flagship: the leading supplier of engine management and fuel injection to Indian OEMs, a large aftermarket and power-tools business, and since Jul-2026 India's leading ESP/ABS and airbag-electronics maker (RBIC, 19% EBITDA margin). No debt, ~₹5,600 cr of treasury after the deal, a 55-85% payout policy and regulation (CAFE 3, CV ADAS, safety rules) adding content every year.` },
    { callout: `**What you are paying:** ${n1(price / F.eps[0])}x our FY27E and ${n1(price / F.eps[1])}x FY28E EPS for ~10-12% a year growth in Bosch's own businesses plus a one-time ~${Math.round(X.accretion27)}% lift from RBIC. Since 2021 the market has paid a median ${n1(cleanMed)}x forward for Bosch on clean earnings, and auto-component stocks were ${Math.abs(X.sectorDr).toFixed(1)}% below their five-year medians on 30-Sep-2026. On the street's own method and the house multiple the target is {{dcf.tp|inr}} ({{dcf.upside|chg}}): ${rating}. Even our bull case ({{scen.bull.tp|inr}}) is below the price.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      [`Price below ~₹${n0(sellAbove)} (HOLD) or ~₹${n0(buyBelow)} (BUY) on our rule`, 'Low-Medium', `The stock would have to fall ~${Math.round((1 - sellAbove / price) * 100)}% / ~${Math.round((1 - buyBelow / price) * 100)}%`],
      ['RBIC grows ~17% a year with a 19%+ margin once consolidated', 'Medium', 'Q2FY27 results (due by mid-November 2026, first consolidated quarter) and the Chakan analyst visit'],
      ['Bosch\'s own margin moves to 15%+ (localisation, lower parent imports)', 'Low-Medium', 'Gross margin; royalty and group fees as % of revenue'],
      ['2-wheeler ABS mandate and CV ADAS confirmed with dates', 'Medium', 'Government notifications'],
      ['Payout at the top of the 55-85% range or a special dividend', 'Low-Medium', 'FY27 final dividend (with the results in May)'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['GST step-up fades: production flat to +3% from H2FY27', 'Medium', 'FY28E EPS 8-12% below ours; multiple compresses'],
      ['Faster EV adoption in cars, buses and small LCVs cuts fuel-injection content', 'Medium (3-5 years)', 'Power Solutions is the largest business line; e-axles come through a 50:50 JV'],
      ['Royalty, service fees and parent import prices keep rising faster than revenue', 'Medium', 'Each 1pp of margin ≈ 7% of EPS'],
      ['Weaker rupee and commodity inflation (Q1 gross margin −420bp)', 'Medium', 'Margin back to 12-13%'],
      ['More related-party deals or cash lent to the group', 'Low-Medium', 'Lower returns for minorities'],
      ['Auto sector de-rates further', 'Medium', `At the bear multiple (${MULT.bear}x) on base EPS the stock is worth ~₹${n0(Math.round(MULT.bear * epsSep.base / 10) * 10)}`],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**We would move to HOLD below ~₹${n0(sellAbove)}** and to BUY below ~₹${n0(buyBelow)} on today's numbers, or sooner if RBIC and the 2027 regulations lift FY29 earnings well above our ₹{{F.eps.2|num}}.`,
      `**This is a valuation call, not a business call.** Our EPS is within ~2-3% of MOSL's. The stock trades at ${n1(price / epsSep.base)}x Sep-28E EPS; its own clean history (${n1(cleanMed)}x) less the sector de-rating (× ${k.toFixed(3)}) supports ${MULT.base}x. At the street's ~40x our target would be ~₹${n0(Math.round(40 * epsSep.base / 10) * 10)}, close to the post-Q1 street median of ₹${n0(medTp)}.`,
      `**Biggest swing factor:** the multiple. Each 1x is ~₹${n0(epsSep.base)} a share; each 1pp of EBITDA margin is ~₹${n0(Math.round(F.sales[1] * 0.01 * 0.75 / F.shares * MULT.base / 10) * 10)} at our multiple.`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Q1FY27 revenue growth', v: '+22%', d: 'mobility +25.7%; before RBIC' },
      { k: 'RBIC EBITDA margin (FY25)', v: '19.3%', d: 'Bosch Ltd FY26: 13.2%' },
      { k: 'Royalty + group service fees, FY26', v: '₹1,575 cr', d: '7.9% of revenue, +25%' },
      { k: 'Price ÷ our Sep-28E EPS', v: `${n1(price / epsSep.base)}x`, d: `clean median since 2021: ${n1(cleanMed)}x` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['RBIC', 'Bosch Chassis Systems India Pvt Ltd, the Bosch group\'s Vehicle Motion (braking and safety) business in India, bought by Bosch Ltd in Jul-2026.'],
      ['ESP / ABS', 'Electronic stability programme / anti-lock braking system: electronics that stop wheels locking and keep a vehicle stable under braking or in a skid.'],
      ['Power Solutions', 'Bosch\'s engine business: fuel injection, engine management systems (EMS) and sensors for diesel, petrol and CNG engines.'],
      ['EMS', 'Engine management system: the electronic control unit and sensors that run an engine.'],
      ['BS-VI, OBD-II, CAFE', 'Emission norms (Bharat Stage VI, from Apr-2020); on-board diagnostics for two-wheelers (from Apr-2025); corporate average fuel efficiency targets for car makers (Phase 3 from Apr-2027, draft).'],
      ['CV ADAS', 'Advanced driver-assistance systems (e.g. automatic emergency braking) for trucks and buses, required for new models from Jan-2027 and all models from Oct-2027.'],
      ['GST 2.0', 'India\'s Sep-2025 goods and services tax reform, which cut the rate on small cars, most two-wheelers, tractors and commercial vehicles.'],
      ['Common control / pooling', 'Accounting for a deal between companies with the same owner: assets are combined at book value, no goodwill is recorded, and earlier periods are restated.'],
      ['Related-party transaction (RPT)', 'A deal with the parent or a sister company; large ones need a vote in which the promoter cannot take part.'],
      ['Royalty and technical fee', 'What Bosch Ltd pays the group for using its technology and brand: ₹478 cr in FY26.'],
      ['Exceptional items', 'One-off gains or costs (business sales, restructuring) shown separately; we value on EPS before them ("clean EPS").'],
      ['Treasury', 'Cash, bank deposits, debt mutual funds, bonds and loans to group companies, less lease liabilities.'],
      ['P/E, EV/EBITDA', 'Share price ÷ earnings per share; enterprise value (market value less net cash) ÷ EBITDA.'],
      ['Sep-28E', 'Half of FY28E plus half of FY29E: the 12-month-forward earnings the market will look at in September 2027.'],
      ['Sector de-rating', 'How far comparable stocks trade below their own five-year median P/E on the valuation date.'],
      ['DCF / WACC', 'Discounted cash flow valuation; WACC is the required annual return used to discount future cash (here the cost of equity, as Bosch has no debt).'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'sales@FY16': 'First 12-month March year after the 15-month FY15 (December to March year-end change).',
  'sales@FY20': '−19%: BS-VI transition, weak vehicle demand and the end of small diesel cars.',
  'ebitdaMargin@FY20': '−270bp to 15.1%: lower volumes on a fixed cost base.',
  'otherIncome@FY20': 'Negative after ₹645 cr of restructuring charges (exceptional).',
  'pat@FY20': '−59%: restructuring charges and lower volumes.',
  'ebitdaMargin@FY21': '12.0%, the low point: Covid and under-used diesel capacity.',
  'otherIncome@FY21': 'Negative after ₹745 cr of restructuring charges (exceptional).',
  'pat@FY22': '+153%: no exceptional charges and a volume recovery.',
  'sales@FY23': '+27%: production recovery, 2-wheeler and gasoline content.',
  'otherIncome@FY24': '₹1,566 cr incl. an ₹844 cr exceptional gain (Project House business sold to a group company, ₹785 cr; provision reversal ₹59 cr).',
  'pat@FY24': '+75% reported; +29% before exceptional items.',
  'pat@FY25': '−19% reported (no FY24 gain); +9% before exceptional items.',
  'cfo@FY25': '₹2,373 cr: working capital released and lower taxes paid.',
  'otherIncome@FY26': '₹1,410 cr incl. a ₹556 cr gain on the building-technology sale to Keenfinity.',
  'pat@FY26': '+38% reported; +17% before exceptional items (₹2,347 cr).',
  'sales@Q2FY26': '+9%: as reported (₹4,795 cr), before RBIC.',
  'otherIncome@Q1FY26': '₹844 cr incl. the ₹556 cr building-technology gain.',
  'sales@Q1FY27': '+22%: Power Solutions +29%, 2-wheelers +41%, aftermarket +9.6%, power tools +21%. As reported, before RBIC.',
  'opm@Q1FY27': '14%: gross margin −420bp offset by lower employee and other costs.',
  'sales@FY27E': 'GAM: +41%, of which RBIC (full year, pooled) ~26 points and Bosch\'s own businesses +14.7%.',
  'ebitdaMargin@FY27E': 'GAM: Bosch 13.6% and RBIC 19.0% blended.',
  'otherIncome@FY27E': 'GAM: Q1 ₹226 cr on the old treasury, then ~6.25% on the post-deal treasury; the ₹9,060 cr RBIC payment (net of RBIC cash) costs ~₹500 cr a year of income before tax.',
  'pat@FY28E': 'GAM: +8%: Bosch +10%, RBIC +12%, other income lower.',
};

module.exports = { risks, glossary, statementNotes };
