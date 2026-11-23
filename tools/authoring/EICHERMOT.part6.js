// Eicher Motors report, part 6: risks and honest summary, glossary, statement notes.
const X = require('./EICHERMOT.ctx');
const { ruleText } = require('../../src/ratings');
const { F, V, A, n0, n1, price, FM, reMed, MULT, SOTP, vecvSep28, rating, buyBelow, sellAbove, b, medTp, epsSep } = X;
const S = SOTP.base;

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: `Our honest summary: a business we admire at a price we do not; ${rating} at ${n1(price / F.eps[1])}x FY28E`,
  blocks: [
    { callout: `**What you are buying:** the dominant mid-size motorcycle brand in the world's largest two-wheeler market, with ~85% share at home, a 24-25% EBITDA margin, negative working capital, ~₹19,700 cr of net treasury, a 54.4% stake in India's #1 light-truck maker and capacity going to 2.45 mn units.` },
    { callout: `**What you are paying:** ${n1(price / F.eps[0])}x our FY27E and ${n1(price / F.eps[1])}x FY28E EPS for ~${Math.round(X.epsCagrFwd)}% a year EPS growth, after a GST-driven surge that the base will soon absorb. The market has historically paid ~${n1(FM.median)}x forward for this company (${n1(reMed)}x for Royal Enfield alone), and auto stocks were below their five-year medians on 30-Sep-2026. On the street's own method and the house multiples the target is {{dcf.tp|inr}} ({{dcf.upside|chg}}): ${rating}.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      [`Price below ~₹${n0(buyBelow)} (BUY on our rule)`, 'Low-Medium', `The stock would have to fall ~${Math.round((1 - buyBelow / price) * 100)}%`],
      ['Volumes keep growing 15%+ through the high-base months (Oct-2026 to Mar-2027)', 'Medium', 'Monthly releases; dealer stock; retail (Vahan) vs dispatches'],
      ['Margin back above 26% (mix, commodities, operating leverage)', 'Low-Medium', '>350cc recovery; gross margin; marketing spend'],
      ['Exports recover to 15k+ a month (Brazil, Indonesia CKD, US tariff relief)', 'Medium', 'Monthly export numbers'],
      ['Higher payout or buyback of part of the ~₹19,700 cr treasury', 'Low', 'Board dividend decision with the FY27 results (usually in May)'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['GST step-up proves a pull-forward; growth slows to low single digits from H2FY27', 'Medium', 'FY28E EPS 10-15% below ours; multiple compresses'],
      ['Competition in 350-450cc (Honda, Bajaj-Triumph, Jawa-Yezdi, Hero-Harley) forces price cuts or heavier spending', 'Medium', 'EBITDA margin toward 22-23% (bear case)'],
      ['Commodity inflation persists (aluminium, steel, precious metals)', 'Medium', 'Each 1pp of margin ≈ 3-4% of EPS'],
      ['CV downturn at VECV', 'Medium', `VECV share could halve (₹${n0(vecvSep28 / 2 * MULT.vecv.base)} a share of value)`],
      ['Electric disruption reaches premium motorcycles faster than expected; Flying Flea fails', 'Low (3-5 years)', 'Brand advantage may not carry over; heavy EV spending'],
      ['Capital allocation: more money into JVs and strategic stakes', 'Low-Medium', 'Treasury earns less than Royal Enfield; lower returns'],
      ['Auto sector de-rates further', 'Medium', `At our bear multiples (RE ${MULT.re.bear}x, VECV ${MULT.vecv.bear}x) on base EPS the stock is worth ~₹${n0(Math.round((MULT.re.bear * S.reEps + MULT.vecv.bear * vecvSep28) / 10) * 10)}`],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**We would move to HOLD below ~₹${n0(sellAbove)}** and to BUY below ~₹${n0(buyBelow)} on today's numbers, or sooner if FY28 earnings visibility improves (volumes holding 12%+ through the high base with margins back above 25%).`,
      `**This is a valuation call, not a business call.** Our EPS is within ~5% of the street (below it in FY28E). The street pays ~30x for Royal Enfield; its own history and today's auto-sector de-rating support ~${MULT.re.base}x. At 30x our target would be ~₹${n0(Math.round((30 * S.reEps + S.ve) / 10) * 10)}, still below the street median of ₹${n0(medTp)}.`,
      `**Biggest swing factor:** the multiple. Each 1x on Royal Enfield is ~₹${n0(S.reEps)} a share; each 1pp of EBITDA margin is ~₹${n0(Math.round(F.sales[1] * 0.01 * 0.745 / F.shares * MULT.re.base / 10) * 10)} at our multiple.`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Royal Enfield share of India\'s 250-750cc', v: '~85%', d: 'Q1FY27, SIAM (company)' },
      { k: 'Domestic volume growth, Q1FY27', v: '+32%', d: 'Apr-Aug 2026 +28%; exports −9%' },
      { k: 'EBITDA margin, Q1FY27', v: '24.0%', d: 'FY24 26.2%; FY18 31%' },
      { k: 'Price ÷ our FY28E EPS', v: `${n1(price / F.eps[1])}x`, d: `median since 2021: ${n1(FM.median)}x (forward)` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['Mid-size / middleweight motorcycles', 'Motorcycles of roughly 250-750cc engine size; Royal Enfield\'s home segment. "cc" is engine capacity in cubic centimetres.'],
      ['J / Sherpa / 650 twin platforms', 'Royal Enfield\'s engine families: 350cc single (Classic, Bullet, Hunter, Meteor), 450cc single (Himalayan, Guerrilla) and 650cc two-cylinder.'],
      ['Flying Flea', 'Royal Enfield\'s electric motorcycle brand (C6 launched Apr-2026; S6 to follow).'],
      ['VECV', 'VE Commercial Vehicles: trucks and buses joint venture of Eicher (54.4%) and Volvo (45.6%).'],
      ['Joint venture / equity method', 'A company controlled jointly with a partner. Its revenue and costs are not added line by line; the owner books its share of profit as one line.'],
      ['GST 2.0', 'India\'s Sep-2025 goods and services tax reform: two-wheelers up to 350cc cut from 28% to 18%; above 350cc raised to 40%; trucks and buses cut to 18%.'],
      ['CKD', 'Completely knocked down: motorcycles shipped as kits and assembled abroad (Thailand, Brazil, Argentina, Colombia, Nepal, Bangladesh).'],
      ['Allied business', 'Spares, accessories, riding gear (apparel), service and warranties: ~15% of Royal Enfield revenue.'],
      ['Realisation / revenue per unit', 'Revenue ÷ motorcycles sold. Motorcycle realisation uses two-wheeler revenue only; revenue per unit uses total revenue.'],
      ['Monthly release vs financial-statement volumes', 'Royal Enfield\'s monthly sales numbers count CKD exports differently from its accounts; FY26: 12,38,659 vs 12,27,977.'],
      ['LMD / HD / SCV', 'Light-and-medium-duty trucks (5-18 tonnes), heavy-duty trucks, small commercial vehicles (2-3.5 tonnes).'],
      ['Treasury', 'Cash, bank deposits, debt mutual funds and bonds, less borrowings. The model\'s net cash also includes the VECV stake at book value.'],
      ['Sum of the parts (SOTP)', 'Valuing each business separately and adding the values.'],
      ['P/E, EV/EBITDA', 'Share price ÷ earnings per share; enterprise value (market value less net cash) ÷ EBITDA.'],
      ['Sep-28E', 'Half of FY28E plus half of FY29E: the 12-month-forward earnings the market will look at in September 2027.'],
      ['Sector de-rating', 'How far comparable stocks trade below their own five-year median P/E on the valuation date.'],
      ['DCF / WACC', 'Discounted cash flow valuation; WACC is the required annual return used to discount future cash (here the cost of equity, as Eicher has no debt).'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'sales@FY19': '+9%: volumes peaked at 8.3 lakh.',
  'sales@FY20': '−7%: volumes fell to 7.0 lakh as new safety (ABS) and insurance rules raised prices in a slowing market.',
  'ebitdaMargin@FY20': '−580bp to 23.8%: lower volumes and higher costs.',
  'sales@FY21': '−5%: Covid lockdowns; volumes 6.1 lakh.',
  'ebitdaMargin@FY21': '20.4%, the low point: under-used plants.',
  'pat@FY21': '−26%: lower volumes; VECV barely profitable.',
  'sales@FY23': '+40%: volumes +38% to 8.24 lakh as chip supply returned; Hunter 350 launched.',
  'pat@FY23': '+74%: operating leverage plus VECV share of ₹315 cr (₹60 cr in FY22).',
  'ebitdaMargin@FY24': '+230bp to 26.2%, the recent peak: softer commodities, Himalayan 450 launch.',
  'otherIncome@FY24': '₹1,521 cr: treasury income nearly doubled to ₹1,076 cr as rates rose; VECV share ₹448 cr.',
  'pat@FY24': '+37%.',
  'cfo@FY25': '+7% only: working capital and taxes; profit includes ₹700 cr VECV share (non-cash beyond ₹136 cr of dividends).',
  'sales@FY26': '+24%: volumes +22% (GST 2.0 from 22-Sep-2025, record festive season), revenue per unit +1.3%.',
  'ebitdaMargin@FY26': '−30bp to 24.7%: mix toward the 350s, marketing, commodity inflation in Q4.',
  'pat@FY26': '+16%; after a ₹55 cr exceptional charge for the new Labour Codes.',
  'sales@Q2FY26': '+45%: GST cut on 350cc motorcycles from 22-Sep-2025 plus festive stocking.',
  'otherIncome@Q4FY26': '₹675 cr incl. VECV share of ₹323 cr (Q4 is VECV\'s biggest quarter).',
  'sales@Q1FY27': '+32%: volume +27% (domestic +32%), revenue per unit +3%.',
  'opm@Q1FY27': '24%: commodity hit of 4-4.5% offset by price, value engineering and lower marketing.',
  'dep@Q1FY27': '+40% to ₹278 cr: Flying Flea line, first Cheyyar module and tools capitalised.',
  'sales@FY27E': 'GAM: volume +15.8% (domestic +17.8%, international −2%), revenue per unit +2.2%.',
  'ebitdaMargin@FY27E': 'GAM: 24.2%: commodities ease, marketing and EV costs rise.',
  'otherIncome@FY27E': 'GAM: treasury ~₹1,370 cr + VECV share ~₹840 cr + ~₹100 cr other.',
  'pat@FY28E': 'GAM: +14%: volume +10%, margin 24.8%.',
};

module.exports = { risks, glossary, statementNotes };
