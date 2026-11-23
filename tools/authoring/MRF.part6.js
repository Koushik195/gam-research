// MRF report, part 6: risks and honest summary, glossary, statement notes.
const X = require('./MRF.ctx');
const { ruleText } = require('../../src/ratings');
const { F, n0, n1, price, MULT, FM, rating, buyBelow, sellAbove, medTp, epsSep, k } = X;
const r10 = v => Math.round(v / 10) * 10;
const perPp = F.sales[1] * 0.01 * 0.75 / F.shares; // FY28E EPS per 1pp of margin

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: `Our honest summary: a margin trough in India's best tyre franchise, at a fair-to-cheap multiple; ${rating}, but only just`,
  blocks: [
    { callout: '**What you are buying:** India\'s largest tyre maker (~32% of units, rising), with the strongest replacement brand and dealer network, no net debt and ~₹7,600 cr of cash and liquid investments. Its profit is a spread between tyre prices and rubber and crude, and that spread is at a cyclical low: Q1FY27 EBITDA margin 11.8% against a ten-year median of 15.0%.' },
    { callout: `**What you are paying:** ${n1(price / F.eps[1])}x our FY28E and ${n1(X.sepNow)}x Sep-28E EPS. Since 2021 the market has paid a median ${n1(FM.median)}x one-year-forward for MRF; tyre stocks were ${Math.abs(X.sectorDr).toFixed(1)}% below their five-year medians on 30-Sep-2026. On the street's method and the house multiple (${MULT.base}x) the target is {{dcf.tp|inr}} ({{dcf.upside|chg}}): ${rating}. The upside is close to the 15% line, the DCF (₹${n0(X.mv('dcf').value)}) says the price is about fair on cash flows, and a history window without FY22-23 would give HOLD. This is a "margins recover on schedule" call, with low returns on capital as the main argument against.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      ['Rubber below ~₹250/kg (CRISIL\'s trigger) with price increases holding', 'Medium', 'Kottayam RSS-4 prices; Q3-Q4FY27 gross margin'],
      ['Replacement volume above industry as the GST-boosted parc ages', 'Medium', 'CARE/ATMA data; MRF\'s unit share (31.9% in FY26)'],
      ['A higher payout or a buyback using the ~₹7,600 cr of liquid funds', 'Low', 'AGM and board outcomes'],
      ['Exports recover (Middle East, Africa, Europe launches)', 'Low-Medium', 'Standalone exports (₹2,324 cr in FY26)'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['Rubber at ₹275-300/kg into FY28 and crude-linked inputs rise further', 'Medium', `Each 1pp of margin ≈ ₹${n0(perPp)} of FY28E EPS (~${Math.round(perPp / F.eps[1] * 100)}%)`],
      ['Price war as ~₹18,000 cr of industry capacity arrives (FY27-28)', 'Medium', 'Margin capped below 14%; replacement share at risk'],
      ['Below-normal monsoon hits farm and rural replacement demand', 'Medium', 'Revenue growth 2-3pp lower'],
      ['CCI penalty (₹622 cr) upheld by the Supreme Court', 'Low-Medium', '~₹14,700 a share, one-off; ~10% of our target'],
      ['Chinese imports if DGFT licensing or anti-dumping duties lapse', 'Low', 'Pressure on truck and car radial prices'],
      ['Tyre sector de-rates further', 'Medium', `At the bear multiple (${MULT.bear}x) on base EPS: ~₹${n0(r10(MULT.bear * epsSep.base))}`],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**The rule flips to HOLD above ~₹${n0(buyBelow)}** (a ~${Math.round((buyBelow / price - 1) * 100)}% rise from ₹${n0(price)}) and to SELL above ~₹${n0(sellAbove)}, on today's numbers.`,
      `**This is an earnings-recovery call.** We assume the margin climbs from 11.8% (Q1) to {{F.ebitdaMargin.1|pct}} in FY28E. If it stays at ~12.5%, FY28E EPS falls ~₹${n0(perPp * 1.5)} and the target falls to ~₹${n0(r10(MULT.base * (epsSep.base - perPp * 1.5)))}, about today's price.`,
      `**Against the street:** our target is above the post-Q1 median (₹${n0(medTp)}) because our Sep-28E EPS (₹${n0(epsSep.base)}) includes a margin recovery that MOSL and Kotak do not yet assume, and because the house multiple (${MULT.base}x) is above MOSL's 19x. At 19x our target would be ~₹${n0(r10(19 * epsSep.base))}.`,
      `**Biggest swing factor:** the rubber spread, then the multiple. Each 1x is ~₹${n0(epsSep.base)} a share.`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Q1FY27 EBITDA margin', v: '11.8%', d: 'FY26 15.8%; ten-year median 15.0%' },
      { k: 'Natural rubber, Sep-2026', v: '~₹273/kg', d: 'FY26 average ~₹220/kg' },
      { k: 'Unit share of the industry', v: '31.9%', d: 'FY26 (CARE); ~30% in FY25' },
      { k: 'Price ÷ our Sep-28E EPS', v: `${n1(X.sepNow)}x`, d: `own forward median since 2021: ${n1(FM.median)}x` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['Replacement / OEM', 'Tyres sold to vehicle owners through dealers to replace worn tyres / tyres sold to vehicle makers (original equipment manufacturers) for new vehicles.'],
      ['Radial / bias (nylon) tyre', 'Two tyre constructions. Radials (steel-belted) last longer and save fuel; bias tyres use nylon plies and are cheaper. Indian trucks are moving to radials.'],
      ['TBR, PCR', 'Truck-bus radial and passenger-car radial tyres.'],
      ['RSS-4', 'Ribbed smoked sheet grade 4: the benchmark grade of natural rubber in India, quoted at Kottayam (Kerala).'],
      ['Crude-linked inputs', 'Synthetic rubber, carbon black, nylon tyre cord and chemicals made from oil.'],
      ['Gross margin', 'Revenue less raw-material cost, as % of revenue.'],
      ['EPR', 'Extended Producer Responsibility: tyre makers must buy recycling certificates for the tyres they sell (₹150 cr in FY26 for MRF).'],
      ['GST 2.0', 'India\'s Sep-2025 goods and services tax reform, which cut rates on vehicles and tractors.'],
      ['CCI', 'Competition Commission of India, which fined tyre makers in 2018 for coordinating prices in 2011-12.'],
      ['Treasury', 'Cash, bank deposits, debt and arbitrage mutual funds and bonds; net treasury deducts bank loans and leases.'],
      ['P/E, EV/EBITDA', 'Share price ÷ earnings per share; enterprise value (market value less net cash) ÷ EBITDA.'],
      ['Forward P/E', 'Price ÷ earnings per share of the next full financial year.'],
      ['Sep-28E', 'Half of FY28E plus half of FY29E: the 12-month-forward earnings the market will look at in September 2027.'],
      ['Sector de-rating', 'How far comparable stocks trade below their own five-year median P/E on the valuation date.'],
      ['DCF / WACC', 'Discounted cash flow valuation; WACC is the required annual return used to discount future cash (here the cost of equity).'],
      ['ROE / ROCE', 'Net profit ÷ shareholders\' equity / operating profit ÷ capital employed.'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'sales@FY18': '+11.5%: GST from Jul-2017 (FY17 revenue included excise duty, so growth is understated).',
  'ebitdaMargin@FY18': '−450bp to 15.3%: material cost up from 56% to 61% of revenue.',
  'sales@FY21': '−0.5%: the Covid year.',
  'ebitdaMargin@FY21': '18.3%: material cost 58% of revenue, the lowest since FY17.',
  'pat@FY20': '+26% on a lower tax rate (new regime; tax charge 1% of PBT).',
  'cfo@FY21': '₹4,325 cr: working capital released (payables up).',
  'ebitdaMargin@FY22': '−760bp to 10.7%: material cost jumped to 65% of revenue (67% in FY23).',
  'pat@FY22': '−48%: the raw-material squeeze.',
  'cfo@FY22': 'Negative: inventory and receivables built up, payables fell.',
  'capex@FY23': '₹3,291 cr: the peak of the capacity build.',
  'ebitdaMargin@FY24': '17.0%: material cost fell back to 60% of revenue while prices held.',
  'pat@FY24': '+171%: margin recovery.',
  'ebitdaMargin@FY25': '−250bp to 14.5%: material cost back up to 64% of revenue (rubber; CARE).',
  'otherIncome@FY26': '₹440 cr on Screener: ₹505 cr reported less the ₹63 cr labour-code exceptional charge.',
  'pat@FY26': '+30%: GST 2.0 demand in H2, operating leverage.',
  'cfo@FY26': '₹4,590 cr: inventory fell; capex only ₹1,434 cr, so FCF was ₹3,164 cr.',
  'otherIncome@Q3FY26': '₹50 cr after the ₹63 cr labour-code exceptional charge.',
  'opm@Q1FY27': '12%: raw material 67.3% of revenue (61.7% in Q4FY26).',
  'otherIncome@Q1FY27': '₹195 cr: treasury gains on a larger cash pile.',
  'ebitdaMargin@FY27E': 'GAM: H1 ~12%, H2 ~13.5% as price increases catch up with rubber.',
  'otherIncome@FY27E': 'GAM: 6.2% on average gross treasury plus ~₹82 cr of recurring items.',
  'pat@FY28E': 'GAM: margin recovery to 14.0%.',
};

module.exports = { risks, glossary, statementNotes };
