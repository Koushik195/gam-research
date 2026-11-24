// Ramkrishna Forgings report, part 6: risks and honest summary, glossary, statement notes.
const X = require('./RKFORGE.ctx');
const { ruleText } = require('../../src/ratings');
const { F, AS, n0, n1, price, OWN, MULT, SENS, rating, buyBelow, sellAbove, medTp, epsSep, sepNow, shares } = X;
const r10 = v => Math.round(v / 10) * 10;
const mPt = F.sales[1] / 100, epsPt = mPt * (1 - AS.taxRate[1] / 100) / shares;

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: `Our honest summary: a recovery worth watching, not paying ${n1(sepNow)}x Sep-28E for; ${rating}`,
  blocks: [
    { callout: '**What you are buying:** India\'s second-largest forger, two-thirds domestic and mostly trucks, coming out of a bad two years (an inventory overstatement, US tariffs, a capex bulge) with new press, casting and wheel capacity to fill, ~₹1,900 cr of net debt and a family that put ₹405 cr of fresh equity in.' },
    { callout: `**What you are paying:** ${n1(price / F.eps[1])}x our FY28E and ${n1(sepNow)}x Sep-28E EPS. On normal earnings the stock traded at 7-17x forward in 2021-23; the own median since 2021 on EPS before one-offs is ${n1(OWN.med)}x, and auto-component stocks were below their five-year medians on 30-Sep-2026. That gives ${MULT.base}x and {{dcf.tp|inr}} ({{dcf.upside|chg}}): ${rating}. Kinder readings of the history (${SENS.house}x on reported EPS, ${SENS.inv}x adding back the inventory charge) still give ₹${n0(r10(SENS.house * epsSep.base))}-${n0(r10(SENS.inv * epsSep.base))}.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      [`Price below ~₹${n0(buyBelow)} (BUY on our rule)`, 'Low', `The stock would have to fall ~${Math.round((1 - buyBelow / price) * 100)}%`],
      ['Margins back to 20%+ with utilisation near 80%', 'Medium', 'Quarterly EBITDA margin; press and casting utilisation'],
      ['Net debt below ₹1,500 cr by Mar-2027 and ratings outlook back to Stable', 'Medium', 'Half-year balance sheet; CRISIL review'],
      ['Clean FY27 audit, inventory days falling', 'Medium', 'Inventory days (~210 on Screener) and auditor commentary'],
      ['Wheel JV in profit; exports +20% for a year', 'Medium', 'JV share of profit; North America exports above ₹250 cr a quarter'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['Indian truck cycle turns after a record FY26', 'Medium', 'Domestic is ~60% of revenue; operating leverage works both ways'],
      ['US tariffs or a weak Class 8 market return', 'Medium', 'FY26 showed exports −20% and margin ~15%'],
      ['Energy and freight costs stay high (West Asia)', 'Medium-High', `Each 1pp of margin ≈ ₹${n0(mPt)} cr of FY28E EBITDA, ~₹${n1(epsPt)} of EPS`],
      ['Further accounting surprises or a write-back that flatters a quarter', 'Low-Medium', 'De-rating; lender and rating pressure'],
      ['Pledged promoter shares in a falling market', 'Low', '6.75% of the company pledged at Jun-2026'],
      ['Our multiple is too low if the market keeps paying for the recovery', 'Medium', `At the price-implied ${n1(sepNow)}x the stock is fairly valued on our EPS; at 27x (D&B) ~₹${n0(r10(27 * epsSep.base))}`],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**On today's numbers the rule gives HOLD below ~₹${n0(sellAbove)} and BUY below ~₹${n0(buyBelow)}.** On fundamentals, two clean quarters of 19-20% margins with falling debt would lift our EPS, not our multiple.`,
      `**This is mostly a valuation call.** The street (D&B ₹663, consensus average ₹634; average ₹${n0(medTp)}) is near the price; our EPS is a little lower and our multiple, derived from the stock's own history, is half of what the market pays.`,
      `**Biggest swing factor:** each 1x of P/E is ~₹${n0(epsSep.base)} a share; each 1pp of EBITDA margin is ~₹${n1(epsPt)} of FY28E EPS, ~₹${n0(epsPt * MULT.base)} a share at our multiple.`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'EPS before one-offs', v: '₹16.1 → ₹3.9', d: 'FY24 → FY26; reported FY25 ₹22.9 hid it' },
      { k: 'Inventory overstated, Mar-25', v: '₹220.5 cr', d: '~5.5% of FY25 revenue; FY24 restated' },
      { k: 'Q1FY27 EBITDA margin', v: '18.0%', d: '14.6% a year earlier; FY22-24 21-22%' },
      { k: 'Price ÷ our Sep-28E EPS', v: `${n1(sepNow)}x`, d: `own median ${n1(OWN.med)}x (forward, before one-offs)` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['Forging', 'Shaping hot (or warm/cold) steel by pressing or hammering it in dies; gives stronger parts than casting.'],
      ['Ring rolling', 'Forming seamless rings (bearings, gears, flanges) by rolling a pierced blank.'],
      ['Casting', 'Pouring molten iron into moulds; cheaper for complex shapes, weaker than forging.'],
      ['Standalone / consolidated', 'Standalone = Ramkrishna Forgings Ltd alone. Consolidated = with Ramkrishna Casting Solutions, the US and Mexico units and the JV share.'],
      ['RCSL', 'Ramkrishna Casting Solutions (formerly JMT Auto): castings and machining subsidiary.'],
      ['RTRWL / wheel JV', 'Ramkrishna Titagarh Rail Wheels: 51% joint venture with Titagarh Rail Systems making forged rail wheels; equity-accounted.'],
      ['Class 8', 'The heaviest North American truck class; RKFL\'s largest export end-market.'],
      ['Inventory overstatement', 'Book stock higher than physical stock; here caused by erroneous entries and unrecorded rejections (scrap).'],
      ['Restatement', 'Re-issuing prior-year figures corrected for an error (FY24 here).'],
      ['Deferred tax asset', 'Future tax saving recognised as an asset; RKFL booked ₹187 cr on ACIL\'s past losses in FY25.'],
      ['Discontinued operations', 'A business sold or closed, reported separately (the travel unit in FY24-25).'],
      ['Warrant', 'Right to buy a new share at a fixed price; 25% paid upfront, 75% on conversion within 18 months.'],
      ['Pledge', 'Shares given as loan collateral; a lender can sell them if the price falls.'],
      ['EPS before one-offs', 'EPS from continuing operations before exceptional items and one-off tax credits; our multiple history and target use it.'],
      ['Trough year', 'A year whose EPS is a loss or below half the highest EPS of the previous three years; left out of the multiple history.'],
      ['Sep-28E', 'Half of FY28E plus half of FY29E: the 12-month-forward earnings the market will look at in September 2027.'],
      ['Sector de-rating', 'How far comparable stocks trade below their own five-year median P/E on the valuation date.'],
      ['P/E, EV/EBITDA', 'Share price ÷ EPS; enterprise value (market value plus net debt) ÷ EBITDA.'],
      ['DCF / WACC / Ke', 'Discounted cash flow; weighted cost of capital; cost of equity (the engine discounts at Ke).'],
      ['ECL', 'Expected credit loss: a provision for receivables that may not be collected.'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'sales@FY18': '+62%: truck upcycle; new press line.',
  'sales@FY20': '−37%: Indian truck downturn and Covid at year-end.',
  'pat@FY20': '₹10 cr: volumes collapsed.',
  'sales@FY22': '+80%: truck recovery in India and the US.',
  'sales@FY23': '+38%: exports at a record.',
  'pat@FY24': 'Restated for the ₹50.2 cr inventory overstatement at Mar-24; includes ₹8 cr from the travel unit sold in FY25.',
  'ebitdaMargin@FY25': '13.9%: ~₹170 cr inventory correction (~4pp of revenue) and weaker exports.',
  'pat@FY25': '₹415 cr incl. a ₹193 cr deferred-tax credit (ACIL merger) and an ₹83 cr discontinued gain; ~₹110 cr before them.',
  'otherIncome@FY25': 'Includes the discontinued travel unit\'s profit and sale gain (Screener basis).',
  'sales@FY26': '+5%: domestic +20%, standalone exports −20% (US tariffs).',
  'pat@FY26': '₹72 cr: depreciation +23%, interest +27%, JV loss ₹18 cr, net exceptional −₹11 cr.',
  'eps@FY26': 'Reported ₹3.95; shown pro forma ₹3.88 on the 18.557 cr shares in issue after the Sep-2026 warrant conversion (forecasts use the same count).',
  'otherIncome@FY26': 'Net of ₹10.7 cr exceptional items (labour codes; electricity-duty refund offset by an ECL provision).',
  'opm@Q4FY25': 'Inventory correction booked in the quarter.',
  'pat@Q4FY25': '₹200 cr profit on a pre-tax loss: deferred-tax credit on ACIL\'s losses.',
  'sales@Q2FY26': '−14% YoY: exports −32% after US tariffs.',
  'opm@Q1FY27': '18%: gross margin 54%; energy and freight not passed on.',
  'sales@FY27E': 'GAM: domestic +19%, exports +18%, subsidiaries/other +30%.',
  'otherIncome@FY27E': 'GAM: ~₹12 cr recurring less ₹8 cr wheel-JV start-up loss.',
  'pat@FY28E': 'GAM: margin 19%, wheel JV in profit, lower interest.',
  'sales@FY29E': 'GAM: ~₹6,630 cr vs management\'s ₹8,000 cr target.',
};

module.exports = { risks, glossary, statementNotes };
