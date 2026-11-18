// Godrej Agrovet initiation, part 3: industry, tailwind test, Animal Nutrition, Vegetable Oil (oil palm).
const X = require('./GODREJAGRO.ctx');
const { C, F, AS, n0, n1, SRC, SA, SQ, QL, FYS, ann, A26, A25, Q1 } = X;
const segM = k => F.years.map((_, i) => Math.round(F.seg[k].adjEbitda[i] / F.seg[k].revenue[i] * 1000) / 10);
const histF = (k, from = 'FY21') => { const s = SA.filter(a => a.fy >= from); return { x: [...s.map(a => a.fy), ...F.years], v: [...s.map(a => Math.round(a[k + 'Ebitda'])), ...F.seg[k].adjEbitda.map(Math.round)] }; };
const anH = histF('an'), vegH = histF('veg');

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Five markets, one common thread: farm commodities and the monsoon set the margin',
  blocks: [
    { p: 'GAVL does not sit in one industry. It buys and sells farm commodities in five markets, and in each the margin depends on prices it does not set. **Feed** competes with home-mixed feed and many regional players; costs are maize and soymeal, and maize now also feeds ethanol distilleries. **Palm oil** is the one market where India is short: domestic crude palm oil output was 3.80 lakh t in 2024-25 against a national target of 11.2 lakh t, so prices follow imports, and imports follow world prices and Indian duties. **Crop protection** is seasonal and monsoon-timed. **Dairy** is a procurement game: when milk is scarce, processors pay more than they can pass on. **Chicken** is mostly sold live and unbranded; branded frozen chicken is new.' },
    { exhibit: { type: 'table', title: 'Market forces at 30-Sep-2026', head: ['Theme', 'Direction', 'What it means for GAVL'], wide: [0, 2], rows: [
      ['CPO realisation ₹1,34,783/t in Q1FY27 (+18%): the Middle East war lifted crude oil and, through biodiesel, palm oil', 'Tailwind (temporary)', 'Oil palm EBITDA could be ~₹480-500 cr in FY27; it falls back when prices do.'],
      ['24-Sep-2026: basic duty on crude palm and soybean oil cut from 10% to 5% (effective 16.5% to 11%)', 'Headwind', 'Lower landed import prices pull domestic CPO down; GAVL\'s realisation follows with a lag.'],
      ['National Mission on Edible Oils (oil palm): area 6.2 lakh ha (Nov-2025), output far below target', 'Tailwind', 'State support for planting in GAVL\'s factory zones; GAVL plans ~1.5 lakh ha from ~80,000 ha.'],
      ['2026 monsoon 87% of normal; June 65% (one of the driest in decades), July 101%', 'Headwind', 'Kharif sowing and herbicide use delayed: crop care revenue −17% in Q1FY27. Trees react slowly: little effect on palm this year.'],
      ['Maize pulled into ethanol; feed-grain prices up', 'Headwind', 'Feed passes on 60-70% of cost increases; margins hold only if buying is good.'],
      ['Milk procurement prices high for four quarters', 'Mixed', 'Good for cattle feed (farmers upgrade to branded feed), bad for Creamline\'s margins.'],
      ['Quick commerce and cold chains', 'Tailwind', 'Makes frozen chicken, momos and value-added dairy sellable nationally.'],
      ['Generic agrochemical prices bottomed; China competition stable', 'Mixed', 'Helps Astec\'s CDMO recovery; 47% of Astec\'s imports still come from China.'],
    ], source: 'Q1FY27/Q4FY26 calls and decks, PIB (Dec-2025), Business Today (24-Sep-2026), IMD (30-Sep-2026)' } },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Tailwind test: GAVL captures the palm-oil and feed tailwinds, not the consumer ones (yet)',
  blocks: [
    { verdicts: [
      ['Edible-oil import substitution (oil palm)', 'Yes', 'FFB +19% and segment result +68% in FY26; area +17,000 ha a year; ~50% of trees still juvenile.', 'The best structural growth in the group.'],
      ['High palm-oil prices', 'Yes, for now', 'CPO realisation +9% (FY26), +18% (Q1FY27); margin 21.4%.', 'Temporary: duty cut on 24-Sep-2026 and any fall in crude work the other way.'],
      ['Formalisation of cattle feed', 'Yes', 'Cattle feed volume +18% (FY26), +15% (Q1FY27); premium products Dhanalaxmi, Bypro Plus.', 'Volume, not margin: EBIT ~₹2,100 a tonne.'],
      ['Branded protein and dairy (quick commerce)', 'Partly', 'Yummiez volume +22% and value-added dairy 49% of sales in Q1FY27, but dairy and foods margins fell to 1.5% and 2.6%.', 'Still in the investment phase: no profit yet.'],
      ['Agrochemical recovery', 'No (domestic) / partly (Astec)', 'Standalone crop care EBIT −27% (FY26), −38% (Q1FY27); Astec at break-even.', 'GAVL\'s two-crop portfolio missed the recovery.'],
      ['Bangladesh feed (ACI JV)', 'Partly', 'Q1FY27 volume +14.5%, PBT +12%; profit hit by tax rate rising to 27.5%.', 'A dividend payer (₹70 cr in FY26), small in value.'],
    ], head: ['Industry tailwind', 'Captured?', 'Evidence', 'So what'], title: 'Tailwind test', source: SRC },
  ],
};

const an = {
  id: 'animal', nav: 'Animal Nutrition', kicker: 'Segment', title: 'Animal Nutrition: market-beating volume, commodity-sized margins',
  blocks: [
    { pair: [
      { type: 'column', title: 'Revenue by quarter: +12.6% in Q1FY27', unit: 'Revenue (₹ crore)', x: QL, series: [{ name: 'Animal Nutrition', values: SQ.map(q => q.anRev), fmt: 'num' }], labels: 'all', source: SRC },
      { type: 'line', title: 'EBIT margin: reported vs underlying (ex supplier financing)', unit: 'Segment result margin (%)', x: QL, series: [{ name: 'Reported', values: SQ.map(q => q.anEbitPct), fmt: 'pct' }, { name: 'Underlying', values: SQ.map(q => Math.round(q.anEbitUnderlying / q.anRev * 1000) / 10), fmt: 'pct' }], labels: 'last', min: 0, max: 12, source: SRC + '; underlying = company figure excluding supplier-financing cost (and Q4FY26 one-off income)' },
    ] },
    { bullets: [
      `**Volume leader.** 16.5 lakh t sold in FY26 (+12%) and 4.0 lakh t in Q1FY27 (+7%), with cattle feed +18% and +15%. Management says it is gaining share in East and Central India and that high milk prices push farmers to branded feed. Poultry feed is being cut in chosen regions; fish feed (~7% of volume) grew 20%+.`,
      `**Margins move with commodities.** Segment EBITDA margin: ${SA.map(a => `${a.anEbitdaPct}% (${a.fy})`).join(', ')}. Reported EBIT per tonne was ₹${n0(A26.anEbitPerT)} in FY26; guidance is ₹2,050-2,150. Q4FY26's 10.4% included ~₹9.5 cr of pet-food manufacturing income (for Godrej Pet Care, a group company), and Q1FY27 had 'smart' maize buying that management says "may not be exactly structural".`,
      `**Supplier financing.** From FY26 the segment pays for vendor invoice discounting inside its costs (reported Q1FY27 EBIT ₹84 cr vs underlying ₹102 cr). Segment liabilities rose from ₹648 cr to ₹1,379 cr, so capital employed fell to ₹${n0(A26.anCe)} cr and the reported ROCE (${A26.anRoce}%) is not meaningful.`,
      '**Strategy.** From "feed" to "nutrition": premium cattle feed, technical service, geographic expansion; shrimp feed under strategic review; broiler feed to be restricted.',
    ] },
    { pair: [
      { type: 'column', title: 'Volume growth: 7-15% YoY for five quarters', unit: 'Sales volume growth YoY (%)', x: QL.slice(4), series: [{ name: 'Volume growth', values: SQ.slice(4).map((q, i) => Math.round((q.anVol / SQ[i].anVol - 1) * 1000) / 10), fmt: 'pct' }], labels: 'all', source: SRC },
      { type: 'column', title: 'Our forecast: EBITDA ~₹440-520 cr', unit: 'Animal Nutrition EBITDA (₹ crore)', x: anH.x, series: [{ name: 'EBITDA', values: anH.v, fmt: 'num' }], labels: 'all', source: 'Company, GAM Research estimates' },
    ] },
    { callout: `**Our view:** a well-run, share-gaining business with no pricing power. We model revenue +11% / +9% / +8% (FY27-29E) and EBITDA margin ${segM('an').join('% / ')}%, i.e. EBIT per tonne in the guided range, not the Q4FY26 peak. Upside: premium mix and a softer maize market. Risk: a commodity spike like FY23 (margin 4.6%).` },
  ],
};

const veg = {
  id: 'oilpalm', nav: 'Oil palm', kicker: 'Segment', title: 'Oil palm: a structural growth business with a price-linked margin',
  blocks: [
    { pair: [
      { type: 'column', title: 'Revenue by quarter (ex trading)', unit: 'Revenue (₹ crore)', x: QL, series: [{ name: 'Vegetable Oil', values: SQ.map(q => q.vegRev), fmt: 'num' }], labels: 'all', source: SRC },
      { type: 'line', title: 'Segment margin: 16.7% in Q1FY27 vs 18.9%', unit: 'Segment result margin (%, ex trading)', x: QL, series: [{ name: 'Margin', values: SQ.map(q => q.vegEbitPct), fmt: 'pct' }], labels: 'all', min: 0, max: 26, source: SRC },
    ] },
    { bullets: [
      '**Volume engine.** ~80,000 ha of farmer plantations; 17,000 ha added in FY26 and the same targeted for FY27; plan to reach ~1,50,000 ha (Telangana, North-East). About half the trees are 0-4 years old: yields rise steeply from year 4 to year 8, which management calls a "demographic dividend". FFB processed ~6.37 lakh t a year; FFB growth guided at high single to early double digits for 4-5 years.',
      '**Efficiency.** Oil extraction ratio improved 70 bp in FY26 and was 18.8% in Q1FY27 (18.4%); 24 farmer service centres; boilers run on fruit-bunch residue.',
      `**Price.** Farmers are paid a monthly state-set price linked to CPO, so the mill keeps a share of price moves. CPO realisation: ₹1,03,708/t (FY25), ₹1,12,781/t (FY26), ₹1,34,783/t (Q1FY27). Management said ~65-70% of FY26's profit jump came from its own efforts and ~30% from price. A formula change cut Q1FY27 margins; the 24-Sep-2026 duty cut (crude palm oil 16.5% to 11% all-in) lowers the landed price of imports by ~4.7% at unchanged world prices.`,
      '**Downstream.** Specialty-fats refinery from H2FY27; integrated palm complex (nursery, mill; seed garden and refinery to follow). Target: 50-55% of the business in value-added products by FY31, adding ~200 bp to group EBITDA margin "when fully scaled". Half of group capex goes here; hurdle IRR 16-18%.',
    ] },
    { pair: [
      { type: 'column', title: 'Oil palm revenue: ₹674 cr (FY20) to ₹1,998 cr (FY26)', unit: 'Vegetable Oil segment revenue (₹ crore, incl. trading)', x: FYS, series: [{ name: 'Revenue', values: SA.map(a => Math.round(a.vegRev)), fmt: 'num' }], labels: 'all', source: 'Annual reports (segment note)' },
      { type: 'column', title: 'Our forecast: EBITDA ~₹480-540 cr', unit: 'Vegetable Oil EBITDA (₹ crore)', x: vegH.x, series: [{ name: 'EBITDA', values: vegH.v, fmt: 'num' }], labels: 'all', source: 'Company, GAM Research estimates' },
    ] },
    { callout: `**Our view:** the best business in the group, and the one investors pay for. But FY26-27 profits are flattered by war-time prices. We model revenue +18% / +6% / +10% and EBITDA margin ${segM('veg').join('% / ')}% (FY26 21.4%; FY21 15.4%), i.e. volume growth with prices easing from FY28. Every 1 point of margin moves FY28E EPS by ~₹${n1(X.vegPt)} (~${Math.round(X.vegPt / F.eps[1] * 100)}%). A fall back to FY21's 15.4% margin would cut FY28E EPS by ~₹${n1(X.vegPt * 4.1)} (~${Math.round(X.vegPt * 4.1 / F.eps[1] * 100)}%).` },
  ],
};

module.exports = { industry, tailwind, an, veg };
