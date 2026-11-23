// TMPV report, part 6: risks and honest summary, glossary, statement notes.
const X = require('./TMPV.ctx');
const { ruleText } = require('../../src/ratings');
const { F, V, n0, n1, price, MULT, jlrSep, pvSep, jlrNow, rating, buyBelow, sellAbove, medTp, sotpAt, shares } = X;

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: `Our honest summary: cheap if JLR recovers, and that "if" is the whole case; ${rating} at {{dcf.tp|inr}}`,
  blocks: [
    { callout: '**What you are buying:** India\'s #2 and fastest-growing car maker with ~40% of its electric-car market, and Jaguar Land Rover, a luxury SUV maker with three of the strongest nameplates in the industry, four new models coming and a GBP1.7bn cost programme. Plus 53% of Tata Technologies.' },
    { callout: `**What you are paying:** ₹${n1(price)}, ${n1(price / F.eps[1])}x our FY28E EPS and ${n1(price / X.sep(F.eps))}x Sep-28E. After valuing India PV like Maruti (de-rated) and Tata Technologies at market, the price implies ~${n1(jlrNow)}x EBITDA for JLR, below the ${n1(X.jlrMed)}x the stock itself implied on average since the demerger. Our target {{dcf.tp|inr}} ({{dcf.upside|chg}}) assumes JLR earns ~11-12% EBITDA margins again in FY28-29E; management has guided only FY27.` },
    { exhibit: { type: 'table', title: 'What would make us more confident', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      ['JLR delivers c.4% EBIT and breakeven FCF in FY27', 'Medium', 'Q2FY27 results (due by mid-November 2026); quarterly wholesales and VME'],
      ['Range Rover Electric and Sport Electric launch on time and add volume', 'Medium', 'Order books, production ramp, cannibalisation of ICE Range Rovers'],
      ['India margins recover to 7%+ with PLI on new models', 'Medium', 'PLI certification from Q3FY27; price increases; commodity trend'],
      ['Stellantis US production deal signed', 'Low-Medium', 'Definitive agreement targeted by end-2026'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['JLR misses guidance; EBIT stays 2-3%', 'Medium-High', `At JLR ${MULT.jlr.bear}x on bear earnings, the bear case is {{scen.bear.tp|inr}}`],
      ['China luxury market keeps shrinking; US tariffs rise again', 'Medium', 'Each 1pp of JLR margin ≈ ₹3.5K cr of EBITDA'],
      ['India EV competition and commodities hold margins near 4-5%', 'Medium', `Each 1x on India PV ≈ ₹${n0(pvSep / shares)} a share`],
      ['PLI ends after FY28 without replacement savings', 'Medium', '~2% of India revenue'],
      ['JLR credit rating cut below investment grade', 'Low-Medium', 'Higher funding cost on GBP5bn+ of debt'],
      ['Another cyber or supply shock (supplier fire, chips)', 'Low-Medium', 'One lost month cost GBP~0.8bn of FCF in Q2FY26'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**The rule would move us to HOLD above ~₹${n0(buyBelow)}** and to SELL above ~₹${n0(sellAbove)} on today's numbers.`,
      `**This is a JLR call.** Each 0.5x on JLR is ~₹${n0(jlrSep * 0.5 / shares)} a share; at the market's current implied ${n1(jlrNow)}x the SOTP is ₹${n0(sotpAt(jlrNow, MULT.pv.base))}. Our target is ${medTp < V.tp ? 'above' : 'below'} the street median of ₹${n0(medTp)} because we use Sep-28E earnings and value Tata Technologies at market.`,
      '**What we are not saying:** that JLR\'s problems are over. Our FY27E JLR margin is below guidance. The upside comes from FY28-29E, when the new models and the cost programme should show; if they do not, the bear case applies.',
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'India PV volume growth, Q1FY27', v: '+46%', d: 'industry +24%; share 14.3%' },
      { k: 'JLR EBIT margin, Q1FY27', v: '2.8%', d: 'FY25 8.5%; FY27 guidance c.4%' },
      { k: 'Net debt, Jun-2026', v: '₹42.2K cr', d: 'JLR GBP3.6bn; India net cash' },
      { k: 'JLR multiple implied by the price', v: `${n1(jlrNow)}x`, d: `post-demerger median ${n1(X.jlrMed)}x` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['Demerger', 'Splitting a company into two listed companies. Tata Motors moved its trucks and buses into TMCV (effective 1-Oct-2025); shareholders got one TMCV share for each share held.'],
      ['JLR', 'Jaguar Land Rover Automotive plc, TMPV\'s 100%-owned UK luxury car maker (Range Rover, Defender, Discovery, Jaguar).'],
      ['Wholesales / retails', 'Cars sold to dealers / cars sold by dealers to customers. JLR wholesales exclude its China joint venture.'],
      ['VME', 'Variable marketing expense: discounts and incentives as % of revenue.'],
      ['PLI', 'Production Linked Incentive: Indian government payments on qualifying EVs and advanced cars, until FY28; booked as grant income in EBITDA.'],
      ['EBITDA (company vs Screener)', 'The company\'s EBITDA includes grant income and excludes unrealised FX; Screener\'s excludes grants (shown in other income). Both are used here, clearly labelled.'],
      ['Net automotive debt', 'Borrowings including leases less cash, bank deposits and liquid funds.'],
      ['Sum of the parts (SOTP)', 'Valuing each business separately and adding the values, less net debt and minority claims.'],
      ['EV/EBITDA', 'Enterprise value (market value plus net debt) ÷ EBITDA.'],
      ['Sep-28E', 'Half of FY28E plus half of FY29E: the 12-month-forward earnings the market will look at in September 2027.'],
      ['Sector de-rating', 'How far comparable stocks trade below their own five-year median P/E on the valuation date.'],
      ['CCPS / NCI', 'Compulsorily convertible preference shares (held by investors in the EV subsidiary) / non-controlling (minority) interests.'],
      ['EMA', 'JLR\'s new electric modular architecture for mid-size models (first: Range Rover GT).'],
      ['DCF / WACC', 'Discounted cash flow valuation; WACC is the blended cost of debt and equity used to discount future cash.'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'sales@FY21': 'Covid year; old Tata Motors (cars, JLR, trucks).',
  'pat@FY19': '−₹28,826 cr: large JLR impairment (Screener exceptional items −₹29,523 cr).',
  'sales@FY23': '+24%: JLR chip supply recovered; trucks and cars grew.',
  'pat@FY24': '₹31,399 cr: JLR EBIT 8.5% on GBP29bn; includes the CV business.',
  'sales@FY25': 'Restated without commercial vehicles (₹3,66,094 cr); not comparable with FY24.',
  'pat@FY25': 'Includes ₹8,755 cr from the CV business (discontinued operations).',
  'sales@FY26': '−8%: JLR lost production to the cyber attack (Sep to mid-Nov 2025); India +21%.',
  'ebitdaMargin@FY26': '5.6% (Screener basis): JLR EBITDA 6.7%, India 6.9% (company basis).',
  'pat@FY26': '₹82,390 cr incl. the ₹82,616 cr non-cash demerger gain; continuing business −₹1,632 cr.',
  'otherIncome@FY26': '₹86,291 cr incl. ₹79,880 cr of exceptional items (demerger gain net of cyber and other costs).',
  'sales@Q2FY26': 'JLR plants shut for September (cyber attack).',
  'ebitda@Q2FY26': 'Negative: JLR EBIT −8.6%.',
  'otherIncome@Q2FY26': '₹81,507 cr incl. the demerger gain.',
  'sales@Q1FY27': '+9%: India +65%, JLR −9.6% in GBP but +1% in rupees.',
  'pat@Q1FY27': '₹775 cr: JLR PBT GBP109m; India breakeven.',
  'sales@FY27E': 'GAM: JLR GBP25.5bn at ₹128.4/GBP; India volumes +20%.',
  'ebitdaMargin@FY27E': 'GAM: JLR 8.8%, India 5.8% (company basis, incl. grants), less grants.',
  'pat@FY28E': 'GAM: JLR EBITDA 11.0% with new launches and cost savings.',
  'ebitdaMargin@FY29E': 'GAM: India PLI ends; India margin 6.0%.',
};

module.exports = { risks, glossary, statementNotes };
