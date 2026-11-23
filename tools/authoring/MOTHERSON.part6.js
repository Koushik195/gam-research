// Samvardhana Motherson report, part 6: risks and honest summary, glossary, statement notes.
const X = require('./MOTHERSON.ctx');
const { ruleText } = require('../../src/ratings');
const { F, V, n0, n1, n2, price, FM, MULT, epsSep, rating, buyBelow, sellAbove, medTp } = X;
const E = epsSep.base;

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: `Our honest summary: a strong operator with thin margins, priced for street earnings we do not forecast; ${rating}`,
  blocks: [
    { callout: `**What you are buying:** the world's most diversified auto-component group (no customer above 9%, 425+ plants), a top-3 mirror maker and India's harness leader, a proven acquirer of distressed suppliers, leverage at a record-low 0.8x, a USD96 bn order book and an option on consumer electronics and aerospace.` },
    { callout: `**What you are paying:** ${n1(price / F.eps[0])}x our FY27E and ${n1(price / F.eps[1])}x our FY28E EPS for a business that has earned 7-10% EBITDA margins and 13-16% ROCE for a decade, whose FY27 growth is mostly acquisitions and a weak rupee, and whose stock has traded at a ${n1(FM.median)}x forward median since 2022. With component stocks ~9% below their own five-year medians on 30-Sep-2026, the house multiple is ${MULT.base}x Sep-28E EPS: {{dcf.tp|inr}} ({{dcf.upside|chg}}), ${rating}.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      [`Price below ~₹${n0(buyBelow)} (BUY on our rule)`, 'Low', `The stock would have to fall ~${Math.round((1 - buyBelow / price) * 100)}%`],
      ['Margins in Q3-Q4FY27 above 10% after copper and polymer recoveries', 'Medium', 'Divisional EBITDA margins; MPP above 9%'],
      ['Nexans and Yutaka margins disclosed and rising toward 8-9%', 'Medium', 'Q2-Q4FY27 presentations'],
      ['Consumer-electronics third plant ramps with disclosed revenue and margin', 'Medium', 'Q3FY27 commissioning; management promised more detail "in a couple of quarters"'],
      ['A value-unlocking listing of an incubated business', 'Low-Medium', 'Within the five-year plan'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['European car production falls further as Chinese brands take share', 'Medium', 'MPP and Integrated Assemblies volumes; more restructuring charges'],
      ['Commodity recovery from customers falls short or comes late', 'Medium', 'Each 0.5pp of group margin ≈ ₹' + n0(F.sales[1] * 0.005) + ' cr of FY28E EBITDA, ~' + Math.round(F.sales[1] * 0.005 * 0.71 / F.pat[1] * 100) + '% of EPS'],
      ['Rupee strengthens against the euro', 'Low-Medium', 'Translation reverses; a 10% stronger rupee cuts rupee revenue by ~7-8%'],
      ['Acquisition indigestion (Nexans, Yutaka, more to come)', 'Medium', 'Low-margin revenue, higher depreciation and debt'],
      ['Consumer-electronics programme disappoints (single customer)', 'Medium', '~₹5,000 cr still to be spent; impairment risk'],
      ['US tariffs on Mexican or European parts', 'Medium', 'North America is ~17% of revenue'],
      ['Street holds 24x and earnings beat us', 'Medium', `24x our Sep-28E EPS is ₹${n0(24 * E)}; 24x MOSL's FY28E is ₹180`],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**We would move to HOLD if the price fell below ~₹${n0(sellAbove)}** on today's numbers, or sooner if earnings visibility improves (acquired units' margins disclosed and rising; group margin above 10%).`,
      `**Two disagreements with the street, about equal in size:** our FY28E EPS (₹${n2(F.eps[1])}) is ~13% below the street's ₹7.1-7.5 because we carry the acquired plants' depreciation and debt; and the house multiple (${MULT.base}x) is below the 23-26x brokers use because SAMIL's forward P/E median since 2022 is ~21x and component stocks are de-rating. The street median target is ₹${n0(medTp)}.`,
      `**Biggest swing factor:** the margin. Each 1x on the multiple is ~₹${n1(E)} a share; each 0.5pp of FY28-29E EBITDA margin is ~₹${n1(F.sales[1] * 0.005 * 0.71 / F.shares * MULT.base)} a share at ${MULT.base}x.`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Largest customer share', v: '9%', d: 'Volkswagen; FY26 gross revenue' },
      { k: 'EBITDA margin FY26', v: '9.5%', d: 'Q1FY27 8.8%; a decade at 7-10%' },
      { k: 'ROCE (company basis)', v: '16.1%', d: 'FY26; Vision 2030 target 40%' },
      { k: 'Price ÷ our FY28E EPS', v: `${n1(price / F.eps[1])}x`, d: `forward median since 2022: ${n1(FM.median)}x` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['SAMIL', 'Samvardhana Motherson International Ltd, the listed parent (NSE: MOTHERSON); formerly Motherson Sumi Systems (MSSL).'],
      ['MSWIL', 'Motherson Sumi Wiring India: the domestic harness business demerged in Jan-2022, separately listed; SAMIL owns 33.43% and equity-accounts it.'],
      ['Wiring harness', 'The bundle of wires, connectors and terminals that carries power and signals around a vehicle; copper is the main raw material.'],
      ['MPP / SMP / SMRC', 'Modules & Polymer Products division: bumpers, door and instrument panels (businesses bought as Peguform and Reydel).'],
      ['SMR / Vision Systems', 'Rear-view mirrors and camera-based vision systems (business bought as Visiocorp in 2009).'],
      ['Integrated Assemblies (SAS)', 'Assembly of cockpit and front-end modules for car makers; revenue is booked net of parts the customer nominates.'],
      ['Economic revenue', 'Division revenue including 100% of joint ventures and associates; reported revenue deducts the equity-accounted JVs.'],
      ['Gross revenue', 'Economic revenue plus pass-through parts in Integrated Assemblies; the basis of the USD108 bn Vision 2030 target.'],
      ['Equity method / JV share', 'A JV\'s revenue and costs are not consolidated; the owner books its share of the JV\'s profit as one line.'],
      ['Minority interest', 'The share of a subsidiary\'s profit that belongs to outside shareholders (e.g. Honda\'s 19% of Yutaka Giken).'],
      ['CCD', 'Compulsorily convertible debenture: SAMIL\'s ₹1,500 cr 6.5% CCDs convert into shares after Sep-2027 at ≥₹126.67.'],
      ['3CX10', 'Management rule: no Country, Customer or Component above 10% of revenue.'],
      ['Pass-through (commodity)', 'Contract clauses that pass changes in copper, resin and other input prices on to customers, usually with a lag.'],
      ['Effective net debt / leverage ratio', 'Company measures: net debt plus leases less CCDs; divided by trailing EBITDA.'],
      ['Sep-28E', 'Half of FY28E plus half of FY29E: the 12-month-forward earnings the market will look at in September 2027.'],
      ['Sector de-rating', 'How far comparable stocks trade below their own five-year median P/E on the valuation date.'],
      ['P/E, EV/EBITDA, DCF, ROCE', 'Price ÷ EPS; (market value + net debt) ÷ EBITDA; discounted cash-flow value; operating profit ÷ capital employed.'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'sales@FY20': '−4%: global car production fell; Covid from March 2020.',
  'sales@FY21': '−6%: Covid lockdowns in Europe and India.',
  'pat@FY22': '−16%: chip shortage and European energy costs; Jan-2022 reorganisation (domestic harness demerged, SAMIL merged).',
  'sales@FY23': '+24%: production recovery and a full year of the merged structure.',
  'pat@FY23': '+71%: recovery from the FY22 trough.',
  'sales@FY24': '+25%: SAS (cockpit assembly) and other acquisitions; FX.',
  'pat@FY24': '+82%: operating leverage; ₹251 cr exceptional costs.',
  'interest@FY24': '₹1,811 cr: debt taken on for acquisitions before the Sep-2024 equity raise.',
  'pat@FY25': '+40%: includes a ₹178 cr fair-value gain (MASL); minorities ₹343 cr.',
  'sales@FY26': '+11%: emerging businesses +50%; core divisions +5-11% in rupees, helped by a weaker rupee.',
  'otherIncome@FY26': '₹259 cr on Screener = other income ₹310 cr + JV share ₹583 cr − ₹413 cr exceptional restructuring.',
  'pat@FY26': '+1.5% reported; normalised +17% to ₹4,258 cr (company).',
  'cfo@FY26': '₹11,284 cr: +₹6,075 cr of supplier credit.',
  'pat@Q1FY26': 'Depressed by a ₹136 cr restructuring charge in Europe.',
  'sales@Q1FY27': '+17%: wiring harness +31%, emerging +30%; rupee ~13% weaker vs the euro.',
  'opm@Q1FY27': '8.8%, +60bp YoY despite copper +40% and polymer +55%.',
  'sales@FY27E': 'GAM: includes ~₹13,350 cr from Nexans Autoelectric (from 3-Jul) and Yutaka Giken (from 21-Jul).',
  'capex@FY27E': 'GAM: ₹6,000 cr guided capex + ~₹3,900 cr for the two acquisitions (engine has no acquisition line).',
  'dep@FY27E': 'GAM: includes the acquired plants.',
  'ebitdaMargin@FY28E': 'GAM: 9.8%: restructuring savings, commodity recovery, acquired units improving.',
};

module.exports = { risks, glossary, statementNotes };
