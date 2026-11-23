// ZF CV India report, part 6: risks and honest summary, glossary, statement notes.
const X = require('./ZFCVINDIA.ctx');
const { ruleText } = require('../../src/ratings');
const { F, V, n0, n1, price, MULT, FM, rating, buyBelow, sellAbove, medTp, epsSep, k, tre0, shares } = X;

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: `Our honest summary: the right franchise for the 2027 safety rules, fairly priced at ${Math.round(X.sepNow)}x Sep-28E EPS; ${rating}`,
  blocks: [
    { callout: `**What you are buying:** India's incumbent maker of truck and bus air brakes, with ESC nominations from three major OEMs ahead of the Oct-2027 mandate, a growing aftermarket, and an export and engineering business with its German parent. No debt, ₹${n0(tre0)} cr of net treasury (~₹${n0(tre0 / shares)} a share), ROCE ~20% on Screener's basis even with the cash.` },
    { callout: `**What you are paying:** ${n1(price / F.eps[0])}x our FY27E and ${n1(price / F.eps[1])}x FY28E EPS. EPS barely grows in FY27E (no repeat of FY26's FX gains, metal costs) and then ~20% a year as truck ESC arrives. Since 2021 the market has paid a median ${n1(FM.median)}x forward for ZF CV India, and auto-component stocks were ${Math.abs(X.sectorDr).toFixed(1)}% below their five-year medians on 30-Sep-2026. On the street's method and the house multiple the target is {{dcf.tp|inr}} ({{dcf.upside|chg}}): ${rating}. The street's Buy ratings (median target ₹${n0(medTp)}) assume the full 50x.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      [`Price below ~₹${n0(buyBelow)} (BUY on our rule)`, 'Medium', `A ~${Math.round((1 - buyBelow / price) * 100)}% fall; the stock traded at ₹2,071 in Oct-2025`],
      ['Cost recoveries restore a 16%+ margin from Q2FY27', 'Medium', 'Q2FY27 results (due by mid-November 2026): gross margin, OEM price settlements'],
      ['ESC content per truck and share higher than we assume; ADAS wins beyond two OEMs', 'Medium', 'OEM nominations; homologation; localisation >75% by SOP'],
      ['US exports recover to FY25 levels within a year', 'Low-Medium', 'US Class 8 truck production; new North American programmes'],
      ['A special dividend or buyback from the ₹2,177 cr treasury', 'Low', 'FY27 dividend (with the results in May-2027)'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      [`Price above ~₹${n0(sellAbove)} (SELL on our rule)`, 'Medium', 'Above ~46x Sep-28E EPS the price would need our bull case'],
      ['Truck cycle turns after a regulation-led pre-buy in 2027', 'Medium', 'FY29E OEM revenue flat instead of +15%; EPS 15-20% below ours'],
      ['OEMs split ESC or award ADAS to rivals; ESC electronics dilute margin', 'Medium', 'Content step smaller; margin stuck at ~15%'],
      ['Parent changes transfer prices, export volumes or engineering work allocation', 'Low-Medium', 'A third of revenue; each 1pp on that third ≈ 2-3% of EPS'],
      ['Another promoter sell-down (60% to nearer 51%)', 'Medium', 'Temporary supply overhang'],
      ['Metal and energy inflation recovered late again', 'Medium', 'Each 1pp of margin ≈ 6% of EPS'],
      ['Auto sector de-rates further', 'Medium', `At the bear multiple (${MULT.bear}x) on base EPS the stock is worth ~₹${n0(Math.round(MULT.bear * epsSep.base / 10) * 10)}`],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**We would move to BUY below ~₹${n0(buyBelow)}** and to SELL above ~₹${n0(sellAbove)} on today's numbers, or earlier if the Q2-Q3 margins show that metal costs are recovered and ESC volumes look larger than we assume.`,
      `**This is a timing and multiple call, not a business call.** We like the franchise; our EPS is below the street because we strip out FX gains and take the Q1 margin seriously. Its own history (${n1(FM.median)}x) less the sector de-rating (× ${k.toFixed(3)}) supports ${MULT.base}x; at the street's 50x our target would be ~₹${n0(Math.round(50 * epsSep.base / 10) * 10)}.`,
      `**Biggest swing factor:** truck ESC timing and content. Each 1x of multiple is ~₹${n0(epsSep.base)} a share; each 1pp of EBITDA margin is ~₹${n0(Math.round(F.sales[1] * 0.01 * 0.745 / F.shares * MULT.base / 10) * 10)} at our multiple.`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'CV >6t production, FY26', v: '+16.6%', d: 'Q1FY27 +8.4%' },
      { k: 'ESC on all trucks >6t', v: 'Oct-2027', d: 'nominated by three major OEMs' },
      { k: 'Revenue with one ZF company, FY26', v: '₹1,351 cr', d: '33% of revenue, cost-plus' },
      { k: 'Price ÷ our Sep-28E EPS', v: `${n1(X.sepNow)}x`, d: `own median since 2021: ${n1(FM.median)}x` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['Air brakes / air management', 'Trucks and buses brake with compressed air: a compressor, air dryer, valves and brake chambers/actuators at each wheel.'],
      ['ABS / EBS', 'Anti-lock braking system (stops wheels locking); electronic braking system (brakes controlled electronically, faster and more precise).'],
      ['ESC', 'Electronic stability control: brakes individual wheels to stop a vehicle rolling over or skidding. Mandatory on most buses since Sep-2025 and on all trucks and buses above 6 tonnes from Oct-2027.'],
      ['ADAS / AEBS', 'Advanced driver-assistance systems; AEBS is automatic emergency braking, one of the five ADAS functions required from Oct-2027.'],
      ['ECAS', 'Electronically controlled air suspension: keeps a bus at the right height and lets it "kneel" at stops.'],
      ['e-compressor', 'An electrically driven air compressor for electric buses and trucks, which have no engine to drive one.'],
      ['CV >6T', 'Commercial vehicles above 6 tonnes gross weight: medium and heavy trucks and buses, ZF CV India\'s core market.'],
      ['Value per vehicle (VPV)', 'ZF CV India\'s OEM revenue per vehicle produced: ₹39.5-45.5k in H2FY26.'],
      ['Cost-plus pricing', 'Price = cost plus an agreed mark-up; used for goods and services sold to ZF group companies.'],
      ['Bonus issue (5:1)', 'Five free shares for every share held (Jun-2026); EPS and prices are divided by six for comparison.'],
      ['Treasury', 'Cash, bank deposits and debt mutual funds, less lease liabilities.'],
      ['P/E, EV/EBITDA', 'Share price ÷ earnings per share; enterprise value (market value less net cash) ÷ EBITDA.'],
      ['Sep-28E', 'Half of FY28E plus half of FY29E: the 12-month-forward earnings the market will look at in September 2027.'],
      ['Sector de-rating', 'How far comparable stocks trade below their own five-year median P/E on the valuation date.'],
      ['DCF / WACC', 'Discounted cash flow valuation; WACC is the required annual return used to discount future cash (here the cost of equity, as there is no debt).'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'sales@FY20': '−32%: CV production collapsed ahead of BS-VI (Apr-2020) and with Covid at year-end.',
  'pat@FY20': '−44%: lower volumes on a fixed cost base.',
  'ebitdaMargin@FY21': '11%: Covid; employee costs did not flex.',
  'sales@FY22': '+36%: truck recovery from the Covid trough (consolidated from FY22).',
  'ebitdaMargin@FY22': '10%, the low point: commodity inflation recovered late.',
  'sales@FY23': '+35%: truck upcycle.',
  'pat@FY23': '+124%: margin back to 14%, other income up on a larger treasury.',
  'cfo@FY24': '₹193 cr: receivables up (debtor days 90).',
  'sales@FY25': '+0.4%: OEM −9% in a flat truck year, offset by exports (+7%) and services.',
  'cfo@FY25': '₹286 cr: receivables at 107 days (₹437 cr owed by ZF CV Systems Global).',
  'otherIncome@FY26': '₹173 cr (note 19: ₹183 cr) incl. ₹61 cr FX gains and a ₹10 cr credit-loss reversal; net of the ₹7.9 cr labour-code charge.',
  'sales@FY26': '+7.5%: OEM +17.5% (production +16.6%), aftermarket +15.6%, exports −11% (US tariffs), services +11%.',
  'cfo@FY26': '₹810 cr: group receivables collected (ZF CV Systems Global ₹437 cr to ₹192 cr).',
  'otherIncome@Q1FY26': '₹67 cr incl. a ₹39 cr FX gain on services billing.',
  'otherIncome@Q3FY26': 'Net of the ₹7.9 cr labour-code exceptional charge.',
  'opm@Q3FY26': '19%: one-off price settlements with OEMs (value per vehicle ₹45.5k).',
  'sales@Q1FY27': '+9.3%: OEM +8.6%, aftermarket +15.6%, exports +9.7%, services +12.5%.',
  'opm@Q1FY27': '13%: aluminium (~₹260 to >₹360/kg), gas, oil and labour costs; recoveries lag.',
  'otherIncome@FY27E': 'GAM: 6.0% on opening net treasury (₹2,177 cr) + ₹4 cr; no FX gains.',
  'pat@FY27E': 'GAM: −3%: no FX gain, margin 15.0%.',
  'sales@FY28E': 'GAM: +14%: ESC on all trucks from Oct-2027 (half year).',
  'pat@FY28E': 'GAM: +22%: ESC content and operating leverage (margin 16.0%).',
};

module.exports = { risks, glossary, statementNotes };
