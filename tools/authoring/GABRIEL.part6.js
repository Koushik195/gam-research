// Gabriel India report, part 6: risks and honest summary, glossary, statement notes.
const X = require('./GABRIEL.ctx');
const { ruleText } = require('../../src/ratings');
const { F, AS, n0, n1, price, shares, MULT, FMs, rating, buyBelow, sellAbove, medTp, epsSep, k, sepNow, jvTot, jvPctPbt, oldMed, accretion } = X;
const E = epsSep.base;
const marginRs = Math.round((F.sales[1] + F.sales[2]) / 2 * 0.01 * (1 - AS.opTaxRate[1] / 100) / shares * MULT.base / 10) * 10;
const jvRs = Math.round(jvTot[1] * 0.2 / shares * MULT.base / 10) * 10;

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: `Our honest summary: a good franchise wrapped in a group holding structure, fairly priced at ${n1(sepNow)}x Sep-28E EPS; ${rating}`,
  blocks: [
    { callout: '**What you are buying:** India\'s leading shock-absorber maker (88% of trucks, ~60% of electric two-wheelers, a third of two-wheelers, a quarter of cars), a fluids business, a sunroof maker, and minority stakes in five group companies run by Dana, Henkel, SK, HL Mando and HL Klemove, three of them highly profitable. The Anand family owns ~66% and uses Gabriel to consolidate the group.' },
    { callout: `**What you are paying:** ${n1(price / F.eps[0])}x our FY27E and ${n1(price / F.eps[1])}x FY28E EPS. That is in line with the ${n1(FMs.median)}x the market has paid since the scheme was announced, but more than twice the ~${Math.round(oldMed)}x it paid for the old Gabriel, at a time when auto-component peers trade ~${Math.abs(X.sectorW).toFixed(0)}% below their own medians over the same period. ~${Math.round(jvPctPbt[1])}% of our FY28E profit before tax is a share of other companies' profit. On the street's method and the house multiple the target is {{dcf.tp|inr}} ({{dcf.upside|chg}}): ${rating}.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      [`Price below ~₹${n0(buyBelow)} (BUY on our rule)`, 'Medium', `A fall of ~${Math.round((1 - buyBelow / price) * 100)}%`],
      ['Standalone margin back above 9.5% as commodity recoveries come through', 'Medium', 'Q2-Q3FY27 standalone results'],
      ['HL Mando Anand and HL Klemove grow faster than our 12% / 25%', 'Medium', 'First full quarters (Q3FY27); JV disclosures in decks'],
      ['Dividends from the JVs that cover the NCD interest (₹81.5 cr a year)', 'Medium', 'FY27 cash flow statement'],
      ['Car share regained on new UV platforms', 'Low-Medium', 'PV revenue growth vs industry'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      [`Price above ~₹${n0(sellAbove)} with unchanged numbers (SELL on our rule)`, 'Medium', `The stock is ~${Math.round((sellAbove / price - 1) * 100)}% from that level`],
      ['Further related-party deals priced in Gabriel shares', 'Medium-High', 'Dilution; returns fall further; governance discount'],
      ['JV profits below our build (partner decisions, Dana-Eaton, PPA amortisation)', 'Medium', `A 20% shortfall in FY28E JV profit ≈ ₹${n0(jvRs)} a share at our multiple`],
      ['Commodity costs not recovered; customer price-downs', 'Medium', `Each 1pp of FY28-29E EBITDA margin ≈ ₹${n0(marginRs)} a share`],
      ['Two-wheeler slowdown after the GST-cut boost; PV share loss', 'Medium', 'Two-wheelers are ~58% of revenue'],
      ['IGSS diluted to 65%', 'High (timing unknown)', '35% of the sunroof profit, ~₹0.5-1 of FY28E EPS'],
      ['Refinancing of the NCDs in Sep-2029', 'Low', 'AA+ rating; JV dividends and cash flow cover interest'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**The price is close to fair on the new structure.** The stock trades at ${n1(sepNow)}x our Sep-28E EPS against a house multiple of ${MULT.base}x (${n1(FMs.median)}x × ${k.toFixed(3)}). The street's higher targets (median ₹${n0(medTp)}) rest on ~₹41 of FY28E EPS; ours is ₹${n1(F.eps[1])} after interest and a slower HL Mando Anand.`,
      `**We would turn BUY below ~₹${n0(buyBelow)}** and SELL above ~₹${n0(sellAbove)} on today's numbers.`,
      `**Biggest swing factors:** the multiple (each 1x ≈ ₹${n0(E)} a share), the JV profits (20% ≈ ₹${n0(jvRs)}) and the operating margin (1pp ≈ ₹${n0(marginRs)}). Jupiter adds ~${Math.round(accretion[1])}% to FY28E EPS.`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Restated FY26 revenue', v: '₹5,245 cr', d: 'reported ₹4,667 cr' },
      { k: 'EBITDA margin', v: '9.6%', d: 'FY26 restated; 6-10% for years' },
      { k: 'JV share of FY28E PBT', v: `${Math.round(jvPctPbt[1])}%`, d: 'none before the scheme' },
      { k: 'Price ÷ our Sep-28E EPS', v: `${n1(sepNow)}x`, d: `median since Jul-25: ${n1(FMs.median)}x` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['Shock absorber / strut / front fork', 'Parts that damp the up-and-down movement of a wheel; a strut also carries the vehicle\'s weight; a front fork does both on a two-wheeler.'],
      ['Ride control', 'The industry name for shock absorbers and related suspension dampers.'],
      ['Scheme of arrangement ("Project Rise")', 'A court (NCLT)-approved restructuring: here Anchemco merged into the promoter company and its automotive businesses and JV stakes were then demerged into Gabriel for new Gabriel shares.'],
      ['Pooling of interests', 'Accounting for a deal between companies under common control at book values, restating past figures as if they had always been together.'],
      ['Project Jupiter', 'Gabriel\'s Jul-Sep 2026 purchase of 28.99% of HL Mando Anand and ~30% of HL Klemove India.'],
      ['Equity-accounted investee / associate / JV', 'A company Gabriel does not control (20-50% owned); Gabriel books its share of the profit as one line, not the revenue.'],
      ['ADAS', 'Advanced driver-assistance systems: radar- and camera-based features such as emergency braking and lane keeping.'],
      ['NCD', 'Non-convertible debenture: a bond (here ₹1,000 cr at 8.15% for three years).'],
      ['Press Note 3 (PN3)', 'India\'s rule requiring government approval for investment from countries that share a land border; it delays Inalfa\'s subscription in IGSS.'],
      ['Pro forma', 'Restated as if an event (here the scheme and Project Jupiter) had already happened at Mar-2026.'],
      ['P/E, EV/EBITDA', 'Share price ÷ earnings per share; enterprise value (market value plus net debt) ÷ EBITDA.'],
      ['Sep-28E', 'Half of FY28E plus half of FY29E: the 12-month-forward earnings the market will look at in September 2027.'],
      ['Sector move', 'How far comparable stocks trade above or below their own median P/E over a window, on the valuation date.'],
      ['DCF', 'Discounted cash flow valuation at the cost of equity (here 12.5%).'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'sales@FY20': '−10%: auto downturn and the Mar-2020 Covid lockdown (standalone).',
  'sales@FY21': '−9%: Covid year (standalone).',
  'ebitdaMargin@FY21': '6.1%, the low: fixed costs on lower volumes.',
  'sales@FY22': '+38%: recovery in two-wheelers and trucks (standalone).',
  'sales@FY23': '+27% (standalone; the last year before consolidated accounts).',
  'sales@FY24': 'Consolidated from FY24 (sunroof subsidiary IGSS from May-2023); standalone ₹3,343 cr.',
  'pat@FY24': '+36%: EBITDA margin up to 8.6%.',
  'sales@FY25': '+19%: two-wheelers and sunroofs.',
  'sales@FY26': 'Restated for the scheme (pooling): ₹5,245 cr incl. Anchemco and ACYM; as reported ₹4,667 cr (+15%). Growth vs FY25 mixes bases.',
  'otherIncome@FY26': 'Restated: other income ₹28.6 cr + share of JV profit ₹157.6 cr (Dana, Henkel) − labour-code charge ₹15.3 cr. As reported ₹13 cr.',
  'pat@FY26': 'Restated ₹430.6 cr (reported ₹252 cr). EPS shown on 19.16 cr shares (₹22.47); company restated EPS ₹24.29 on 17.72 cr; reported ₹17.55.',
  'cfo@FY26': 'As reported, pre-scheme (₹345 cr).',
  'capex@FY26': 'As reported, pre-scheme (₹240 cr); standalone ~₹190 cr.',
  'sales@Q1FY26': 'Restated (incl. Anchemco and ACYM); not comparable with Q1FY25.',
  'pat@Q1FY26': 'Restated incl. ₹38.7 cr share of JV profit.',
  'sales@Q2FY26': 'GAM split of the restated half-year (restated FY26 less restated Q1 and Q4).',
  'sales@Q3FY26': 'GAM split of the restated half-year.',
  'otherIncome@Q3FY26': 'Includes the ₹14.2 cr labour-code charge (restated FY26 less Q4).',
  'sales@Q4FY26': 'Restated (Q1FY27 filing); as reported ₹1,210 cr.',
  'sales@Q1FY27': '+15.5% vs restated Q1FY26: 2W +17.5%, PV +10%, CV +15.5%; aftermarket strong.',
  'pat@Q1FY27': '+2%: EBITDA margin −87bp (commodities); JV share +10%.',
  'sales@FY27E': 'GAM: standalone +16%, subsidiaries +12% (sunroof recovery after Q1).',
  'otherIncome@FY27E': `GAM: recurring ₹${AS.recurringOI[0]} cr + JV/associate share ₹${n0(jvTot[0])} cr (HL Mando Anand from 11-Sep-2026).`,
  'pat@FY27E': 'GAM: on 19.16 cr shares; NCD interest from Sep-2026.',
  'pat@FY28E': 'GAM: first full year of HL Mando Anand and HL Klemove.',
};

module.exports = { risks, glossary, statementNotes };
