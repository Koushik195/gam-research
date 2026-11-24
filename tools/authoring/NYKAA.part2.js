// Nykaa report, part 2: history & corporate actions, industry, tailwind test.
const C = require('./NYKAA.ctx');
const { n0, n1, A25, A26, q1, IPO_ADJ, price, M } = C;

// ---------------------------------------------------------------- History
const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'From a 2021 IPO darling to a 70% fall, and back above the IPO price',
  blocks: [
    { p: `Nykaa listed in November 2021 at the peak of India's internet boom: the IPO was priced at ₹1,125 and the stock opened ~78% higher. A 5:1 bonus issue in November 2022 multiplied the share count by six (equity capital rose from ₹47 cr to ₹285 cr), so every per-share number before then must be divided by six: the IPO price is ₹${IPO_ADJ} on today's basis. The stock then fell ~70% from its listing-month high to ~₹121 in April 2023 (weekly closes), as pre-IPO investors sold after their lock-ins expired, profits stayed tiny and the market turned against loss-making or barely profitable internet stocks. It has since recovered to ₹${n0(price)} as growth re-accelerated and margins rose.` },
    { exhibit: { type: 'table', title: 'Milestones and corporate actions', head: ['When', 'What happened', 'Impact on the numbers'], wide: [1, 2], rows: [
      ['2012', 'Company incorporated; Falguni Nayar a director from April 2012', 'Online beauty retail; inventory-led model from the start'],
      ['2015', 'First owned brand (Nykaa Cosmetics): the start of House of Nykaa', 'Owned brands now ~16% of GMV and lift the gross margin'],
      ['Sep-2021', 'Buys 51% of Dot & Key (skincare); put option on the other 49%', 'Put option liability ₹270 cr at Mar-26 (deducted in our SOTP)'],
      ['Nov-2021', 'IPO at ₹1,125 (₹187.5 bonus-adjusted); lists ~78% above it', 'Cash from financing ₹927 cr in FY22'],
      ['Nov-2022', '5:1 bonus issue (record date 11-Nov-2022); one-year lock-in of pre-IPO investors ends', 'Share count ×6 to ~285 cr; EPS history restated'],
      ['FY23', 'Superstore (eB2B) and Fashion losses peak; warehouses and stores expand', 'Profit falls to ₹19 cr; depreciation +80%'],
      ['Nov-2024', 'Earth Rhythm stake raised to 74.6%', 'Small minority interest'],
      ['Feb-2026', 'Takes over Nike.in and the Nike app in India', 'Lifts Fashion GMV growth to 53% in Q1FY27 until it laps in Q4FY27'],
      ['FY26', 'Resegments into Beauty (including Superstore) and Fashion', 'eB2B losses no longer shown separately'],
      ['Jun-2026', 'Investor Day: GMV 2.5-3x and EBITDA 4-5x by FY30', 'Sets the bar the market now judges'],
      ['Aug-2026', 'Agrees to buy 51% of Aminu Wellness (premium skincare) for ₹32 cr', 'Small; closing expected in Q2FY27'],
    ], source: 'FY26 annual report (note 53), Nykaa presentations, Business Standard (bonus and lock-in reports, Oct-Nov 2022)' } },
    { exhibit: { type: 'line', title: 'Share price since listing: a long round trip', unit: '₹, weekly (bonus-adjusted)', x: 'P.series[].0', series: [{ name: 'Price', ref: 'P.series[].1', fmt: 'num', thin: true }], labels: 'extremes', yearTicks: true, yearStep: 1, lines: [{ v: IPO_ADJ, text: 'IPO price' }], source: 'Screener.in, NSE' } },
  ],
};

// ---------------------------------------------------------------- Industry
const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Beauty: a $23bn market growing 12% a year, and online twice as fast',
  blocks: [
    { p: 'India\'s beauty and personal-care (BPC) market was about $23bn in FY26 and is expected to grow 12%+ a year to ~$42bn by FY31 (by then the fourth-largest in the world), according to Redseer research presented at Nykaa\'s June 2026 Investor Day. Online is growing 20%+ a year. Growth comes from more urban households, skincare routines spreading beyond the big cities and "premiumisation" (people trading up to costlier brands). Fashion is a much bigger market, where online grows ~22-25% a year and premium online fashion is expected to roughly triple by FY31. These are the company\'s own commissioned forecasts: useful for direction, optimistic by design.' },
    { exhibit: { type: 'table', title: 'The markets Nykaa sells into', head: ['Market', 'FY26 size', 'Expected growth to FY31', 'Nykaa\'s position'], wide: [3], rows: [
      ['Beauty & personal care (India)', '~$23bn', '12%+ a year; online 20%+', `Largest specialist; Beauty GMV ₹${n0(A26.bGmv)} cr in FY26`],
      ['Online fashion (India)', 'much larger than beauty', '22-25% a year (premium ~3x by FY31)', `Niche premium player; GMV ₹${n0(A26.fGmv)} cr in FY26`],
      ['General-trade beauty (small shops)', 'large, fragmented', 'n.a.', `Superstore: ₹${n0(A26.ssGmv)} cr GMV in FY26, ${q1.ssRetailersK}k retailers`],
    ], source: 'Redseer and Euromonitor data in Nykaa\'s Investor Day presentation (18-Jun-2026); company data' } },
    { h: 'Competition' },
    { bullets: [
      '**Reliance (Tira)**: deep-pocketed omnichannel beauty retailer with its own stores and app; the main specialist rival.',
      '**Myntra (Flipkart)**: sells both fashion and beauty to a much larger fashion customer base; Nykaa Fashion\'s main rival.',
      '**Amazon, Purplle and brand-owned websites (D2C)**: compete on mass and mid-priced beauty.',
      '**Quick-commerce apps** (Blinkit, Zepto, Swiggy Instamart, Flipkart Minutes): deliver mass beauty in 10-30 minutes. Elara (25-Aug-2026) argues Nykaa\'s curated range and higher order values (₹2,102 in Beauty) protect it; Nykaa launched Nykaa Now (60-minute delivery in 13 cities) and says it does not discount from its own pocket.',
    ] },
    { callout: '**So what:** the market is large and growing, and Nykaa is the specialist leader. But it is not a winner-takes-all market: brands sell everywhere, and the same lipstick is available on Tira, Myntra, Amazon and Blinkit at a price the brand sets. Nykaa wins on choice (10,000+ brands), authenticity, content and exclusive launches, not on price.' },
  ],
};

// ---------------------------------------------------------------- Tailwind test
const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Does the beauty boom reach Nykaa? Yes: it is growing ~2x the market',
  blocks: [
    { p: `If the BPC market grows ~12% a year and online ~20%, a specialist that grows Beauty GMV at ${q1.bGmvYoY}% (Q1FY27) and ${n0((A26.bGmv / A25.bGmv - 1) * 100)}% (FY26) is gaining share. HSIE (22-Jun-2026) points out that part of FY24-26 growth came from two tailwinds that will fade: House of Nykaa (~60% a year, helped by the Dot & Key purchase) and Superstore (~41% a year); core Beauty grew ~22%. So the tailwind is real, but our forecast of 25-27% GMV growth asks core Beauty to keep beating the online market.` },
    { exhibit: { type: 'table', title: 'Tailwind scorecard', head: ['Tailwind', 'Reaches Nykaa?', 'Evidence'], wide: [2], rows: [
      ['Online beauty growth (20%+)', '**Yes**', `Beauty GMV +${q1.bGmvYoY}%; annual buyers +25% to ${q1.bAutcMn} mn (Q1FY27)`],
      ['Premiumisation', '**Yes**', `Beauty AOV +5% to ₹${n0(q1.bAov)}; Rare Beauty, SK-II, K18 and other premium launches`],
      ['Smaller cities', '**Partly**', 'Stores in 105 cities, 50% in tier 2 and beyond; Superstore in 1,200+ cities; but quick commerce is chasing the same buyers'],
      ['Online fashion growth (22-25%)', '**Yes, recently**', `Fashion GMV +${n0(q1.fGmvYoY)}% in Q1FY27, but only +${n0((A26.fGmv / A25.fGmv - 1) * 100)}% in FY26 and +12% in FY25`],
      ['Owned brands', '**Yes**', 'House of Nykaa NSV ₹1,700 cr in FY26 (+65%), 13 consumer brands growing 43% in Q1FY27'],
    ], source: 'Nykaa presentations (Q1FY27, Investor Day), HSIE (22-Jun-2026), GAM Research' } },
  ],
};

module.exports = { history, industry, tailwind };
