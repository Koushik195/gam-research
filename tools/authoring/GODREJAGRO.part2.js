// Godrej Agrovet initiation, part 2: cover, the story in charts, the business and its history.
const X = require('./GODREJAGRO.ctx');
const { C, D, F, V, n0, n1, pctChg, SRC, SA, SQ, QL, FYS, A26, A25, price, sh, mv, P, Q1, BR, ML, rating, peFm, derivedPe, segShare26, opsMult } = X;
const dcfV = mv('dcf').value, peV = mv('pe').value, eps28 = mv('pe').metric;
const SEGS = [['an', 'Animal Nutrition'], ['veg', 'Vegetable Oil'], ['cc', 'Crop Care (standalone)'], ['ast', 'Astec'], ['dairy', 'Dairy'], ['food', 'Godrej Foods']];
const fwd = require('./valuation-blend').forwardSeries('GODREJAGRO', X.M, 'eps').filter(x => x[0] >= '2019-04-01');

const cover = {
  headline: 'Two strong businesses, four ordinary ones, and a price that already assumes the turnaround works',
  lead: `Godrej Agrovet is India's largest cattle-feed maker and largest crude palm oil producer, with crop protection, a loss-making listed chemicals arm (Astec), a South Indian dairy and a chicken brand attached. In FY26 oil palm and feed earned ${Math.round(segShare26('an') + segShare26('veg'))}% of segment EBITDA; dairy and foods earned 9% on 22% of revenue. Q1FY27 showed the swings: feed EBIT +30%, oil palm +14%, but crop care −38% after a dry June, and attributable profit fell 17%. A new CEO (from Sep-2025) is pruning the portfolio. We value the company the way the street does, as a **sum of the parts on Sep-28E EV/EBITDA (blended ${n1(opsMult)}x), with Astec at market value less 20%**. That gives **{{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}.** P/E on the stock's own de-rated history (₹${n0(peV)}) is higher, the DCF (₹${n0(dcfV)}) lower. Bull case {{scen.bull.tp|inr}}; bear case {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'Oil palm is the best business, and a price-taker', p: `Vegetable Oil earned ₹${n0(A26.vegEbitda)} cr of EBITDA in FY26 (${A26.vegEbitdaPct}% margin, ~66% return on segment capital) as FFB volume rose 19% and CPO realisations 9%. Q1FY27 CPO was ₹1,34,783/t (+18%), inflated by the Middle East war. Farmers are paid by a CPO-linked formula and domestic prices follow import costs: on 24-Sep-2026 the government halved the duty on crude palm oil (10% to 5%). We model margins of 20.5% / 19.5% / 19.5%; every point is ~₹${n1(X.vegPt)} of FY28E EPS.` },
    { h: 'Feed is a volume winner with thin margins', p: `Animal Nutrition sold 16.5 lakh t in FY26 (+12%; cattle feed +18%) and earned an 8.3% EBITDA margin, helped by Q4 commodity buying and pet-food manufacturing income. Management guides EBIT of ₹2,050-2,150 a tonne; we model 8.0-8.1%. Part of the working-capital gain is supplier financing: payables rose ₹766 cr in FY26.` },
    { h: 'Crop care is shrinking and Astec still loses money', p: `Standalone crop care EBIT fell from ₹308 cr (FY25) to ₹224 cr (FY26) and 38% in Q1FY27, as the cotton herbicide franchise met bad weather and new in-licensed products earn less. Astec lost ₹81 cr in FY26 (₹135 cr in FY25); its structure is "under evaluation". We model crop care margins of 28-30% (not the 40%+ of FY25) and a slow Astec recovery.` },
    { h: 'Valuation: fair, not cheap', p: `Brokers use SOTP: Motilal Oswal ₹${n0(BR[0].tp)} (10-11x FY28E EV/EBITDA, Aug-2026). Our multiples come from the stock's own forward EV/EBITDA median since 2021 (${n1(X.evMed)}x) less the peers' ${Math.abs(Math.round(X.sectorDerateEv))}% de-rating. Our FY28E EPS of ₹${n1(F.eps[1])} is ${Math.abs(pctChg(F.eps[1], ML.FY28E.eps))}% below Motilal Oswal's ₹${n1(ML.FY28E.eps)}. At ₹${n0(price)} the stock trades at ${n1(price / F.eps[1])}x our FY28E EPS.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA (₹ cr)', 'ebitda', 'num'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'RED' },
    { k: 'Earnings momentum', v: 'AMBER' },
    { k: 'Competitive position', v: 'AMBER' },
    { k: 'Valuation', v: 'AMBER' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): Crop Care\'s FY27 outlook, which management promised once the cotton-herbicide season was clear (end-September).',
    'Domestic CPO prices after the 24-Sep-2026 duty cut on crude palm oil (10% to 5%): the biggest swing factor for oil-palm margins.',
    'Astec: the group said in May-2026 it would decide the "most optimal structure" for Astec and its chemicals business within two to three quarters.',
    'Specialty-fats refinery ramp-up in H2FY27 and the integrated palm complex: the start of the downstream (value-added) strategy.',
    'Milk procurement costs (Creamline) and the route-to-market reset; Godrej Foods\' branded growth vs live-bird run-down.',
  ],
};

const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'stacked', title: 'Oil palm and feed now earn ~70% of segment EBITDA', unit: 'Segment EBITDA (₹ crore; Astec excluded)', x: FYS.slice(1), series: [...SEGS.filter(([k]) => !['ast', 'dairy', 'food'].includes(k)).map(([k, n]) => ({ name: n, values: SA.slice(1).map(a => Math.round(a[k + 'Ebitda'])), fmt: 'num' })), { name: 'Dairy & foods', values: SA.slice(1).map(a => Math.round(a.dairyEbitda + a.foodEbitda)), fmt: 'num' }], minLabel: 120, source: 'Annual reports (segment note); EBITDA = segment result + segment D&A; crop care less Astec' },
      { type: 'line', title: 'Margins: oil palm ~20%, feed ~8%, dairy and foods ~4-6%', unit: 'Segment EBITDA margin (%)', x: FYS, series: [['an', 'Animal Nutrition'], ['veg', 'Vegetable Oil'], ['dairy', 'Dairy'], ['food', 'Godrej Foods']].map(([k, n]) => ({ name: n, values: SA.map(a => a[k + 'EbitdaPct']), fmt: 'pct' })), labels: 'last', min: -10, max: 25, source: 'Annual reports, GAM calculation' },
    ] },
    { pair: [
      { type: 'column', title: 'Oil palm profit follows the season and the CPO price', unit: 'Oil palm segment result (₹ crore)', x: QL, series: [{ name: 'Segment result', values: SQ.map(q => q.vegEbit), fmt: 'num' }], labels: 'all', source: SRC },
      { type: 'line', title: 'CPO realisation: ₹84,339/t to ₹1,34,783/t in two years', unit: 'CPO realisation (₹ per tonne)', x: QL, series: [{ name: 'CPO', values: SQ.map(q => q.cpoRealisation), fmt: 'num' }], labels: 'ends', source: SRC },
    ] },
    { pair: [
      { type: 'column', title: 'Crop care: Q1 is the big quarter, and it fell 38%', unit: 'Crop Care standalone segment result (₹ crore)', x: QL, series: [{ name: 'Segment result', values: SQ.map(q => q.ccEbit), fmt: 'num' }], labels: 'all', source: SRC },
      { type: 'column', title: 'Astec: from heavy losses to break-even', unit: 'Astec EBITDA (₹ crore, quarterly)', x: QL, series: [{ name: 'EBITDA', values: SQ.map(q => q.astEbitda), fmt: 'num' }], labels: 'all', source: SRC + '; Q1FY25 excludes an ₹18 cr inventory write-down' },
    ] },
    { pair: [
      { type: 'line', title: `Forward P/E: ${n1(price / F.eps[1])}x our FY28E; median since 2021 ${n1(peFm.median)}x`, unit: 'Price ÷ next full-year EPS (x)', x: fwd.map(x => x[0]), series: [{ name: 'Forward P/E', values: fwd.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: peFm.median, text: `Median since 2021: ${n1(peFm.median)}x` }, { v: derivedPe, text: `De-rated: ${n1(derivedPe)}x`, color: '#cf8f1f' }], source: 'Screener.in prices; reported EPS, GAM estimates for FY27-29E' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street', unit: `₹ per share; price ₹${n0(price)}`, x: [...BR.map(b => `${b.broker} (${X.dmy(b.date)})`), 'GAM (base)'], series: [{ name: 'Target', values: [...BR.map(b => b.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'Price', color: '#b4232a' }], source: 'Broker notes standing on 30-Sep-2026, GAM Research' },
    ] },
  ],
};

const ce = k => A26[k + 'Ce'], roce = k => A26[k + 'Roce'];
const segRow = (k, name, what) => [name, what, n0(A26[k + 'Rev']), n0(A26[k + 'Ebitda']), A26[k + 'EbitdaPct'] + '%', n0(A26[k + 'Ebit']), ce(k) != null ? n0(ce(k)) : '–', roce(k) != null ? roce(k) + '%' : '–'];
const business = {
  id: 'business', nav: 'What Godrej Agrovet does', kicker: 'The business', title: 'Six businesses under one roof, with very different economics',
  blocks: [
    { p: 'Godrej Agrovet (GAVL) sells to farmers and buys from farmers. **Animal Nutrition** makes compound feed for dairy cattle (55-56% of volume), poultry, fish and shrimp. **Vegetable Oil** buys fresh fruit bunches (FFB) from ~80,000 ha of oil palm planted by farmers in factory zones allotted by state governments, and crushes them into crude palm oil (CPO) and palm kernel oil. **Crop Care** sells branded herbicides, insecticides and plant-growth regulators (Hitweed for cotton, Gracia for chilli, new Ashitaka, Takai, Ghassnash) and consolidates 67%-owned **Astec LifeSciences**, a listed maker of agrochemical active ingredients and contract manufacturer (CDMO). **Dairy** is Creamline (Godrej Jersey milk, curd, paneer, flavoured milk in the South). **Poultry & processed foods** is Godrej Foods (Real Good Chicken, Yummiez). It also owns 50% of ACI Godrej Agrovet, a Bangladeshi feed maker (revenue ₹1,501 cr, profit ₹80 cr in FY26).' },
    { exhibit: { type: 'table', title: 'The segments in FY26 (₹ crore)', head: ['Segment', 'What it sells', 'Revenue', 'EBITDA', 'Margin', 'Segment result', 'Capital employed', 'ROCE'], wide: [1], rows: [
      segRow('an', '**Animal Nutrition**', '16.5 lakh t of cattle, poultry, fish and shrimp feed; pet-food contract manufacturing'),
      segRow('veg', '**Vegetable Oil**', 'CPO and palm kernel oil from farmer FFB; ~₹90 cr of trading'),
      segRow('cp', '**Crop Care (incl. Astec)**', `Standalone branded agrochemicals ₹${n0(A26.ccRev)} cr net of sales to and from Astec; Astec ₹${n0(A26.astRev)} cr (EBITDA −₹${Math.abs(A26.astEbitda)} cr)`),
      segRow('dairy', '**Dairy**', 'Creamline: milk, curd, paneer, value-added products 40-49% of sales'),
      segRow('food', '**Poultry & processed foods**', 'Godrej Foods: branded chicken and frozen snacks; live birds being run down'),
      segRow('oth', 'Others', 'Seeds, cattle genetics, windmills'),
      ['Less inter-segment', '', '−' + n0(-A26.elimRev), '', '', '', '', ''],
      { hl: true, cells: ['**Consolidated**', '', n0(A26.consRev), `${n0(A26.screenerEbitda)} (after ₹${n0(A26.unallocVsScreener)} cr central costs)`, '8.4%', '', '', ''] },
    ], source: 'Annual Report 2025-26 (note 46); EBITDA = segment result + D&A; capital employed = segment assets − segment liabilities (Animal Nutrition\'s is small because supplier credit funds its working capital, so its ROCE is not meaningful); Astec from Screener' } },
    { h: 'How each business makes money' },
    { p: '**Feed** is a conversion business: maize, soymeal and rice bran go in, feed comes out at ₹2,000-2,200 of EBIT a tonne; margins move with commodity prices and how fast they can be passed on. **Oil palm** earns a share of the CPO price: the state fixes the monthly price paid for FFB by a formula linked to CPO, so when CPO rises the mill keeps part of the gain, and the reverse. Oil extraction (18.8% in Q1FY27) and volume are the levers it controls. **Crop care** earns 30-45% margins on in-house molecules sold through dealers, but sales are packed into a few weeks of the kharif season. **Dairy and poultry** buy milk and birds at market prices and sell branded products; margins are thin until brands carry a premium.' },
    { pair: [
      { type: 'column', title: 'Dairy and foods: 22% of revenue, 9% of EBITDA', unit: 'Share of FY26 segment total (%)', x: ['Feed', 'Oil palm', 'Crop care', 'Astec', 'Dairy', 'Foods'], series: [{ name: 'Share of revenue', values: SEGS.map(([k]) => Math.round(A26[k + 'Rev'] / (A26.consRev - A26.elimRev) * 1000) / 10), fmt: 'pct' }, { name: 'Share of EBITDA', values: SEGS.map(([k]) => Math.round(A26[k + 'Ebitda'] / A26.segEbitda * 1000) / 10), fmt: 'pct' }], labels: 'all', source: 'Annual Report 2025-26, GAM calculation' },
      { type: 'column', title: 'Feed volume: +12% in FY26 after a flat FY25', unit: 'Animal Nutrition sales volume (lakh t, quarterly)', x: QL, series: [{ name: 'Volume', values: SQ.map(q => q.anVol), fmt: 'n1' }], labels: 'all', source: SRC },
    ] },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'From a feed company to an agri conglomerate, and now a clean-up',
  blocks: [
    { exhibit: { type: 'table', title: 'Key events and what they did to the numbers', head: ['When', 'Event', 'Impact'], wide: [1, 2], rows: C.history.map(h => [h.when, h.event, h.impact || '–']), source: 'Annual reports FY21-26, company calls, BSE shareholding patterns, Business Standard (Oct-2017)' } },
    { exhibit: { type: 'table', title: 'Changes in ownership of subsidiaries', head: ['When', 'Transaction', 'Accounting impact'], wide: [1, 2], rows: C.ownershipChanges.map(o => [o.when, o.event, o.impact]), source: 'Annual Report 2025-26 (notes 51, 55B)' } },
    { callout: `**What it means for the numbers:** the minorities that mattered (49% of Godrej Foods, 37-48% of Creamline) are gone, so from FY26 almost all minority interest is Astec's 32.97%, which absorbs a third of Astec's losses. That is why profit attributable to owners (₹473 cr) was higher than total profit (₹445 cr) in FY26. If Astec turns profitable the effect reverses.` },
  ],
};

module.exports = { cover, narrative, business, history };
