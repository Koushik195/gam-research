// Trent report, part 6: risks and honest summary, glossary, statement notes.
const X = require('./TRENT.ctx');
const { ruleText } = require('../../src/ratings');
const { F, AS, n0, n1, price, MULT, HA, rating, buyBelow, sellAbove, medTp, epsSep, sectorDr, build } = X;
const r10 = v => Math.round(v / 10) * 10;
const epsPerPp = F.sales[1] * 0.001 * (1 - AS.taxRate[1] / 100) / F.shares; // 10bp of margin
const epsPerRps = build[1].st * 0.01 * AS.build.standaloneMargin[1] / 100 * (1 - AS.taxRate[1] / 100) / F.shares; // 1% revenue per sq ft

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: `Our honest summary: an excellent retailer at a price that still assumes the old growth; ${rating}`,
  blocks: [
    { callout: '**What you are buying:** India\'s best-run fashion retailer, with own brands, a fast supply chain, ~19% EBITDA margins and ~28% ROE, adding ~250 stores a year with a clear runway (management talks of ~5,000 Zudio stores). Growth has become space-led: like-for-like sales are growing in low single digits, revenue per sq ft fell ~15% in FY26 and ~10% in Q1FY27, and depreciation is outgrowing revenue. Star is still loss-making, Zara\'s profit fell, and a ₹2,500 cr equity raise is pending.' },
    { callout: `**What you are paying:** ${n1(price / F.eps[0])}x our FY27E and ${n1(price / F.eps[1])}x FY28E EPS. Trent's own forward P/E has a median of ${n1(HA.med)}x since 2021; listed retailers were ${Math.abs(sectorDr).toFixed(1)}% below their five-year medians on 30-Sep-2026, which gives ${MULT.base}x Sep-28E EPS and {{dcf.tp|inr}} ({{dcf.upside|chg}}): ${rating} on our rule. EV/EBITDA (₹${n0(X.mv('ev').value)}) is higher because Ind AS EBITDA outgrows profit; a DCF at a 12.2% cost of capital (₹${n0(X.mv('dcf').value)}) is far below. The street (median ₹${n0(medTp)}) sees ~35% upside; we think it is paying for a growth rate the store economics no longer deliver.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      ['Like-for-like growth back to mid-to-high single digits', 'Low-Medium', 'The company\'s LFL wording each quarter; revenue per sq ft (−10% in Q1FY27)'],
      ['Revenue per sq ft stabilises as the FY26 cohort matures', 'Medium', 'Standalone revenue growth vs area growth in H2FY27'],
      ['Gross margin holds at ~46-47% despite input costs', 'Medium', 'Quarterly EBITDA margin (19.6% standalone in Q1FY27)'],
      ['A further fall in the share price without an earnings cut', 'Medium', `Below ~₹${n0(buyBelow)} the stock would be a BUY on our rule`],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['Value-fashion competition (Reliance, Landmark, Vishal) and QC fashion take Zudio\'s share in small towns', 'Medium', `Each 1% of revenue per sq ft ≈ ₹${n1(epsPerRps)} of FY28E EPS, ~₹${n0(r10(epsPerRps * MULT.base))} a share at ${MULT.base}x`],
      ['Input-cost inflation (West Asia, cotton) with stable prices', 'Medium', `Each 10bp of EBITDA margin ≈ ₹${n1(epsPerPp)} of FY28E EPS (~₹${n0(r10(epsPerPp * MULT.base))} a share)`],
      ['Discretionary slowdown hits LFL (already low single digit)', 'Medium', 'Negative LFL would put revenue per sq ft down another 5-10%'],
      ['Equity raise at a low price; money into Star and new brands', 'Medium', '~1.8% dilution at the 30-Sep price; returns on Star unproven after a decade'],
      ['Leadership change at the board (chairman due to retire on turning 70 in Nov-2026)', 'Low', 'Strategy continuity with the MD in place'],
      ['Retail stocks de-rate further', 'Medium', `At the bear multiple (${MULT.bear}x) on base EPS the stock is worth ~₹${n0(r10(MULT.bear * epsSep.base))}`],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**We would turn HOLD below ~₹${n0(sellAbove)}** and BUY below ~₹${n0(buyBelow)} on today's numbers. We would raise the target if revenue per sq ft stabilises and LFL recovers; cut it if LFL turns negative.`,
      `**This is mainly a multiple call, and it is close to the line.** Our Sep-28E EPS (₹${n1(epsSep.base)}) is in line with the street on a consolidated basis; our ${MULT.base}x is well below the 58-64x the street uses. About 3% more EPS or 1.5 turns more multiple would make it a HOLD.`,
      `**Biggest swing factor:** the multiple. Each 5x of P/E is ~₹${n0(r10(5 * epsSep.base))} a share; each 1% of revenue per sq ft is ~₹${n1(epsPerRps)} of FY28E EPS.`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Fashion stores at Jun-2026', v: '1,312', d: '~250 net added a year; 982 Zudio' },
      { k: 'Revenue per sq ft, Q1FY27 y/y', v: '−10%', d: 'LFL low single digit; space +33%' },
      { k: 'Depreciation / revenue', v: `${n1(X.daPct26)}%`, d: 'FY26 (5.2% in FY25); 7.1% in Q1FY27' },
      { k: 'Price ÷ our Sep-28E EPS', v: `${n1(price / epsSep.base)}x`, d: `own median since 2021: ${n1(HA.med)}x` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['Westside / Zudio', 'Trent\'s two main fashion chains: Westside a department store (~24,000 sq ft), Zudio a value-fashion store (10,000-12,000 sq ft).'],
      ['Star', 'Food and grocery chain run by Trent Hypermarket, a 50:50 joint venture with Tesco; equity-accounted (only Trent\'s share of profit is reported).'],
      ['Inditex associates', 'The companies that run Zara (Trent 20%) and Massimo Dutti stores in India with Inditex of Spain.'],
      ['LFL', 'Like-for-like (same-store) sales growth: revenue growth of stores open for over 18 months (Trent\'s definition).'],
      ['Revenue per effective sq ft', 'Our productivity measure: standalone revenue ÷ average retail area, weighting stores by the part of the year they were open.'],
      ['Emerging categories', 'Beauty and personal care, innerwear and footwear: over 21% of Trent\'s revenue.'],
      ['Ind AS 116 / operating EBITDA', 'Lease accounting that moves rent out of operating costs into depreciation and interest; Trent also reports EBITDA before it ("operating EBITDA").'],
      ['Standalone / consolidated', 'Trent Ltd alone (Westside, Zudio) / the group incl. subsidiaries and the share of JV and associate profits.'],
      ['Bonus issue', 'Free shares to existing holders (1 for every 2 in June 2026); value-neutral, all per-share figures restated.'],
      ['P/E, EV/EBITDA', 'Share price ÷ earnings per share; enterprise value (market value plus net debt incl. leases) ÷ EBITDA.'],
      ['Sep-28E', 'Half of FY28E plus half of FY29E: the 12-month-forward earnings the market will look at in September 2027.'],
      ['Sector de-rating', 'How far comparable stocks trade below their own five-year median P/E on the valuation date.'],
      ['SOTP', 'Sum of the parts: valuing each business separately and adding them up.'],
      ['DCF / cost of capital', 'Discounted cash flow valuation; the cost of capital is the required annual return used to discount future cash.'],
      ['ROE / ROCE', 'Return on equity (profit ÷ net worth) / return on capital employed (operating profit ÷ debt plus equity).'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'sales@FY21': '−26%: Covid lockdowns.',
  'pat@FY21': 'Loss of ₹181 cr: Covid lockdowns.',
  'sales@FY22': '+73%: reopening and Zudio roll-out.',
  'sales@FY23': '+83%: Zudio 233 to 352 stores; full year without lockdowns.',
  'otherIncome@FY24': 'Includes the ₹576 cr exceptional gain from reassessing lease terms (Screener adds exceptional items here).',
  'pat@FY24': 'Includes a ₹439 cr after-tax lease-reassessment gain; before it ~₹1,038 cr.',
  'pat@FY25': '+4% reported; +48% before the FY24 one-off.',
  'dep@FY26': '+52%: 272 store openings and more leased space; 6.8% of revenue.',
  'otherIncome@FY26': '₹85 cr on Screener\'s basis: ₹115 cr reported, net of the ₹26 cr labour-code charge.',
  'pat@FY26': '₹1,721 cr, +12%: EBITDA +33% but depreciation +52%.',
  'capex@FY26': '₹1,763 cr of cash capex; lease payments another ₹797 cr.',
  'pat@Q4FY24': 'Includes the lease-reassessment gain.',
  'sales@Q1FY27': '+18%: space +33%, revenue per sq ft −10%, LFL low single digit.',
  'ebitda@Q1FY27': '+32%: gross margin +149bp to 46.6%.',
  'pat@Q1FY27': '₹518 cr, +22%: depreciation +40%.',
  'sales@FY27E': 'GAM: 250 net openings, effective area +28%, revenue per sq ft −8%.',
  'capex@FY27E': 'GAM: ₹1,900 cr cash capex + ₹950 cr lease payments.',
  'dep@FY28E': 'GAM: 16% of gross block; ~7.4% of revenue.',
};

module.exports = { risks, glossary, statementNotes };
