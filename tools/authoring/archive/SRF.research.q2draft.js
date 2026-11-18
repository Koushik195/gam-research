// SRF report, part B: story, business, history, industry, tailwind test, chemicals, films &
// textiles, moat, earnings quality, ownership, governance, forecasts, street, valuation, verdict,
// glossary. Prose numbers come from research/company.json, deep.json, segments.json and the built
// model; forecast and valuation figures are live tokens ({{...}}) that follow assumptions.json.
const fs = require('fs');
const path = require('path');
const { forwardSeries } = require('./valuation-blend');
const { ruleText, buyBelow: buyAt, sellAbove: sellAt } = require('../../src/ratings');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'SRF', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'models', 'SRF.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf;
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const SRC = 'SRF results presentations and annual reports, GAM Research';

const SA = SG.annual, SQ = SG.quarterly, QL = SQ.map(q => q.q);
const A26 = SA.find(a => a.fy === 'FY26'), A21 = SA.find(a => a.fy === 'FY21'), A23 = SA.find(a => a.fy === 'FY23');
const qm = (e, r) => SQ.map(q => Math.round(q[e] / q[r] * 1000) / 10);
const price = M.price.last, mcap = M.meta.marketCap || price * F.shares;
const BM = V.blend.methods, mv = key => BM.find(m => m.key === key), P = V.sotp.parts;
const epsSep28 = mv('pe').metric;
const peNow = price / F.eps[0];

// One-year-forward P/E history (actual EPS, then our estimates).
const fwdPe = forwardSeries('SRF', M, 'eps').filter(x => x[0] >= '2019-04-01');
const fwdVals = fwdPe.map(x => x[1]).slice().sort((a, b) => a - b), fwdMed = fwdVals[Math.floor(fwdVals.length / 2)];

// Each broker's SOTP multiples applied to our segment EBITDA (same year basis they use).
const seg = (k, y) => F.seg[k].adjEbitda[F.years.indexOf(y)];
const segAvg = k => (seg(k, 'FY28E') + seg(k, 'FY29E')) / 2;
const nd = y => -F.treasury[F.years.indexOf(y)];
const atOurs = {
  pl: ((segAvg('chem') * 18 + segAvg('pack') * 8 + segAvg('text') * 6) - (nd('FY28E') + nd('FY29E')) / 2) / F.shares,
  mosl: (seg('chem', 'FY28E') * 23 + seg('pack', 'FY28E') * 11 + seg('text', 'FY28E') * 11 + seg('oth', 'FY28E') * 10 - nd('FY28E')) / F.shares,
  icici: (seg('chem', 'FY29E') * 20 + seg('pack', 'FY29E') * 9 + seg('text', 'FY29E') * 4 - nd('FY29E')) / F.shares,
};
// What the market pays for chemicals today: EV less the other businesses at our multiples.
const ev = mcap - F.treasury[0];
const impliedChem = (ev - P[1].value - P[2].value - P[3].value - P[4].value) / P[0].metric;

const streetRows = [
  ['Motilal Oswal', 'Buy', 3000, '22-Oct-26', 'SOTP EV/EBITDA', '23x', '11x', '11x', 'FY28E', n0(atOurs.mosl), 'Refrigerants, fluoropolymer ramp-up; specialty to recover'],
  ['ICICI Direct', 'Buy', 2845, '23-Oct-26', 'SOTP EV/EBITDA', '20x', '9x', '4x', 'FY29E', n0(atOurs.icici), 'Fluoro delivering; pivot to sunrise sectors'],
  ['Prabhudas Lilladher', 'Hold', 2349, '22-Oct-26', 'SOTP EV/EBITDA', '18x', '8x', '6x', 'avg FY28-29E', n0(atOurs.pl), 'Specialty weighed by China oversupply'],
  ['Kotak Inst. Equities', 'Sell', 2210, '23-Oct-26', 'SOTP EV/EBITDA', '15x (from 18x)', 'n.d.', 'n.d.', 'Sep-27E', '–', 'Specialty squeeze; growth waits till FY29'],
  ['Nuvama', 'n.d.', null, '22-Oct-26', 'SOTP EV/EBITDA', '20x (from 25x)', 'n.d.', 'n.d.', 'n.d.', '–', 'Specialty problems may last longer'],
  ['Jefferies*', 'Hold', 2540, '22-Oct-26', 'n.d.', '–', '–', '–', '–', '–', 'Q2 miss led by chemicals'],
  ['UBS*', 'Sell', 2300, '22-Oct-26', 'n.d.', '–', '–', '–', '–', '–', 'Refrigerant prices near peak'],
  ['Morgan Stanley*', 'Underweight', 2260, '22-Oct-26', 'n.d.', '–', '–', '–', '–', '–', 'Non-fluoro pressure; valuation'],
  ['Elara', 'Accumulate', 3258, '21-Jan-26', 'DCF (WACC 9.8%, g 5%)', '–', '–', '–', 'DCF', '–', 'Resilient refrigerant demand'],
];
const tpBrokers = streetRows.filter(r => r[2] && /Oct-26/.test(r[3]));
const rating = 'HOLD';

const cover = {
  headline: 'Refrigerants are carrying SRF while specialty chemicals stall: fairly priced, not a bargain',
  lead: `SRF makes refrigerant gases, chemical building blocks for global agrochemical and pharma companies, packaging films and tyre cord. Chemicals are half of revenue and three-quarters of profit. The record FY26 and first half of FY27 came from two things: refrigerant prices at a decade high as quotas tighten supply worldwide, and a one-off windfall in films during the Middle East war. Specialty chemicals, the growth engine of FY19-23, has shrunk for two years under Chinese overcapacity. We value SRF the way the street does, on the **sum of its parts: Sep-28E EV/EBITDA, with chemicals at 20x**. That gives **{{dcf.tp|inr}} ({{dcf.upside|chg}})**: **we initiate with HOLD.** A P/E cross-check (28x Sep-28E EPS of ₹${n1(epsSep28)}) lands in the same place; the DCF (₹${n0(mv('dcf').value)}) warns that cash flows alone support much less while capex runs at ₹2,500 cr a year. Bull case {{scen.bull.tp|inr}}; bear case {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'Refrigerants: a quota-protected boom, close to its peak?', p: 'Fluorochemical revenue rose 60% in FY26 to ₹3,598 cr. China caps HFC production and its R32 price hit a decade high in 2026. India\'s own HFC quotas, from 2028, will be based on 2024-26 output, so SRF has run its plants flat out. But calendar 2027 is a "free year" in which new Indian capacity can sell, and UBS argues prices are near the peak.' },
    { h: 'Specialty chemicals, the long-term story, is stuck', p: 'Specialty revenue fell from ₹4,165 cr in FY23 to ₹3,537 cr in FY26 as Chinese overcapacity cut prices and agrochemical customers ran down stock. In Q2FY27 the chemicals EBIT margin fell to 25.4% from 28.9%, all of it from specialty (Kotak). 7-8 new agro molecules are "in an advanced state", but their timing depends on customers\' registrations, and they have been "close" for three years.' },
    { h: 'Capex: chemicals has earned its money; films has not', p: 'Since FY21 chemicals capital rose ₹5,537 cr and earned a 28% pre-tax return on it. Films capital nearly doubled while its profit fell. The next ₹2,500 cr a year goes mainly into HFOs, fluoropolymers and battery foil, with the pay-off in FY28-29.' },
    { h: 'Valuation: the market already pays ~18x for chemicals', p: `Brokers value chemicals at 15-23x EV/EBITDA. After valuing the other businesses at our multiples, today's price implies ~${n1(impliedChem)}x Sep-28E for chemicals; our 20x leaves only modest upside. The stock has de-rated from 48x forward earnings (2021-25 median) to ~${n1(peNow)}x FY27E, which is why it is not expensive either.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'GREEN' },
    { k: 'Predictability', v: 'RED' },
    { k: 'Earnings momentum', v: 'AMBER' },
    { k: 'Competitive position', v: 'AMBER' },
    { k: 'Valuation', v: 'AMBER' },
  ],
  catalysts: [
    'Q3FY27 results (Jan-2027): evidence of the promised H2 specialty recovery.',
    'India\'s HFC quota rules (final view expected early 2027) and refrigerant prices in the 2027 "free year".',
    'Commissioning: PVDF (Q3FY27), Chemours fluoropolymer plants (Q4FY27, Q1FY28), Odisha HFO plant (Q4FY28).',
    'Promoter KAMA Holdings has approval to sell up to 3% by Mar-2027 (so far only an internal transfer).',
    'Sunset review of the anti-dumping duty on Chinese R32 (Dec-2026).',
  ],
};

// ---------------------------------------------------------------- Story in charts
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'stacked', title: 'Chemicals now earns three-quarters of segment profit', unit: 'Segment EBIT (₹ crore)', x: 'R.segments.annual[].fy', series: [{ name: 'Chemicals', ref: 'R.segments.annual[].chemEbit', fmt: 'num' }, { name: 'Films & foil', ref: 'R.segments.annual[].packEbit', fmt: 'num' }, { name: 'Technical textiles', ref: 'R.segments.annual[].textEbit', fmt: 'num' }, { name: 'Others', ref: 'R.segments.annual[].othEbit', fmt: 'num' }], minLabel: 150, source: SRC },
      { type: 'column', title: 'Refrigerants carried FY26; specialty shrank for two years', unit: 'Chemicals product revenue (₹ crore)', x: 'R.segments.annual[].fy', series: [{ name: 'Fluorochemicals (refrigerants)', ref: 'R.segments.annual[].fluoroRev', fmt: 'num' }, { name: 'Specialty (agro & pharma)', ref: 'R.segments.annual[].specialtyRev', fmt: 'num' }], labels: 'none', source: 'SRF annual reports (revenue by major product)' },
    ] },
    { pair: [
      { type: 'line', title: 'Chemicals margin peaked in Q4FY26', unit: 'Chemicals EBIT margin (%)', x: QL, series: [{ name: 'Chemicals', values: qm('chemEbit', 'chemRev'), fmt: 'pct' }], labels: 'all', min: 10, max: 35, source: SRC },
      { type: 'line', title: 'Films: Q1FY27 was a war-time one-off', unit: 'Films & foil EBIT margin (%)', x: QL, series: [{ name: 'Films & foil', values: qm('packEbit', 'packRev'), fmt: 'pct' }], labels: 'all', min: 0, max: 20, source: SRC },
    ] },
    { pair: [
      { type: 'line', title: 'Returns: chemicals ~21%, films ~8%', unit: 'Segment pre-tax ROCE (%)', x: 'R.segments.annual[].fy', series: [{ name: 'Chemicals', ref: 'R.segments.annual[].chemRoce', fmt: 'pct0' }, { name: 'Films & foil', ref: 'R.segments.annual[].packRoce', fmt: 'pct0' }, { name: 'Technical textiles', ref: 'R.segments.annual[].textRoce', fmt: 'pct0' }], labels: 'last', source: 'SRF annual reports; GAM calculation (segment EBIT ÷ closing capital employed)' },
      { type: 'stacked', title: 'Capex: chemicals takes most of the money', unit: 'Capex by segment (₹ crore)', x: 'R.segments.annual[].fy', series: [{ name: 'Chemicals', ref: 'R.segments.annual[].chemCapex', fmt: 'num' }, { name: 'Films & foil', ref: 'R.segments.annual[].packCapex', fmt: 'num' }, { name: 'Technical textiles', ref: 'R.segments.annual[].textCapex', fmt: 'num' }], minLabel: 200, source: 'SRF annual reports (segment capex)' },
    ] },
    { pair: [
      { type: 'line', title: 'Forward P/E: from ~50x to below 30x', unit: 'Price ÷ next full-year EPS (x)', x: fwdPe.map(x => x[0]), series: [{ name: 'Forward P/E', values: fwdPe.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: Math.round(fwdMed), text: `Median since 2019: ${Math.round(fwdMed)}x` }], source: 'Screener.in prices; actual EPS, GAM estimates for FY27-28E' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (post-Q2 notes)', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...tpBrokers.map(b => b[0].replace('*', '')), 'GAM (base)'], series: [{ name: 'Target', values: [...tpBrokers.map(b => b[2]), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes and press reports (Oct-2026), GAM Research' },
    ] },
  ],
};

// ---------------------------------------------------------------- Business
const geo = C.geography.revenueByCountryFY26;
const geoTop = Object.entries(geo).filter(([k]) => k !== 'Others').sort((a, b) => b[1] - a[1]).slice(0, 9);
const business = {
  id: 'business', nav: 'What SRF does', kicker: 'The business', title: 'Four businesses: one chemicals franchise and three industrial ones',
  blocks: [
    { p: 'SRF started in 1973 making nylon tyre cord, added refrigerant gases in 1989 and packaging films in 1995, and moved into complex chemicals for global agrochemical and pharma companies from 2004. Today it runs 16 plants in India, Thailand, South Africa and Hungary. Half its revenue is exported. The four businesses look very different on growth, margins and returns, which is why the market values each one separately.' },
    { exhibit: { type: 'table', title: 'The four segments in FY26', head: ['Segment', 'What it makes', 'Revenue (₹ cr)', 'EBITDA margin', 'EBIT (₹ cr)', 'Capital employed (₹ cr)', 'Pre-tax ROCE'], wide: [1], rows: [
      ['**Chemicals**', 'Refrigerant gases (HFC-32, 125, 134a and blends, brand Floron), chloromethanes, fluoropolymers (PTFE, PVDF); intermediates and active ingredients for agro and pharma innovators', n0(A26.chemRev), n1(A26.chemEbitda / A26.chemRev * 100) + '%', n0(A26.chemEbit), n0(A26.chemCapEmployed), A26.chemRoce + '%'],
      ['**Performance Films & Foil**', 'BOPET, BOPP and CPP packaging films; aluminium foil; capacitor films', n0(A26.packRev), n1(A26.packEbitda / A26.packRev * 100) + '%', n0(A26.packEbit), n0(A26.packCapEmployed), A26.packRoce + '%'],
      ['**Technical Textiles**', 'Nylon and polyester tyre cord, belting fabric, industrial yarn (#1 in India)', n0(A26.textRev), n1(A26.textEbitda / A26.textRev * 100) + '%', n0(A26.textEbit), n0(A26.textCapEmployed), A26.textRoce + '%'],
      ['**Others**', 'Coated and laminated fabrics', n0(A26.othRev), n1(A26.othEbitda / A26.othRev * 100) + '%', n0(A26.othEbit), '197', '–'],
      { hl: true, cells: ['**Total (before corporate costs)**', '', n0(A26.consRev), '', n0(A26.consEbit), '', ''] },
    ], source: 'SRF annual report FY26; ROCE = segment EBIT ÷ closing capital employed (GAM)' } },
    { h: 'Inside chemicals: two very different businesses' },
    { p: '**Fluorochemicals** (₹3,598 cr of FY26 product revenue) are refrigerant gases for air-conditioners, fridges and car ACs, plus industrial chemicals and fluoropolymers. Prices follow a global commodity cycle shaped by regulation: as countries phase down climate-warming HFC gases, supply is rationed by quota, which lifts prices for those who hold quota. **Specialty chemicals** (₹3,537 cr) are custom-made intermediates and active ingredients for global agrochemical (and, increasingly, pharma) innovators. This is a contract business: SRF develops a process for a customer\'s molecule and supplies it for years. It earns better margins in good times, but it has lost pricing to Chinese makers since FY24 and depends on customers\' launch timetables.' },
    { pair: [
      { type: 'hbar', title: 'Half of revenue is exported', unit: 'FY26 revenue by customer country (₹ crore)', x: geoTop.map(g => g[0].replace(/([a-z])([A-Z])/g, '$1 $2')), series: [{ name: 'Revenue', values: geoTop.map(g => Math.round(g[1])), fmt: 'num' }], labels: 'all', highlight: 'India', source: 'SRF annual report FY26 (other countries ₹2,599 cr)' },
      { type: 'stacked', title: 'Chemicals revenue mix', unit: 'Product revenue (₹ crore)', x: 'R.segments.annual[].fy', series: [{ name: 'Fluorochemicals', ref: 'R.segments.annual[].fluoroRev', fmt: 'num' }, { name: 'Specialty', ref: 'R.segments.annual[].specialtyRev', fmt: 'num' }, { name: 'Industrial chemicals', ref: 'R.segments.annual[].industrialRev', fmt: 'num' }], minLabel: 400, source: 'SRF annual reports' },
    ] },
  ],
};

// ---------------------------------------------------------------- History
const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'From a DCM tyre-cord plant (1973) to a global fluorochemicals maker',
  blocks: [
    { exhibit: { type: 'table', title: 'Key events and what they did to the numbers', head: ['When', 'Event', 'Impact'], wide: [1, 2], rows: [
      ['1970-73', 'Shri Ram Fibres set up by DCM; first tyre-cord plant at Manali, Chennai', 'Still SRF\'s technical textiles base (#1 in India)'],
      ['1989', 'Enters refrigerant gases at Bhiwadi, Rajasthan', 'Seed of the chemicals business, now ~75% of profit'],
      ['1995', 'Buys a BOPET film plant at Kashipur', 'Start of the films business'],
      ['2004', 'Indore films plant; enters specialty (fine) chemicals for agro and pharma', 'Specialty became the largest chemicals business by FY19'],
      ['2008-19', 'Films plants in Thailand, South Africa and (2020) Hungary', 'Films became global; Hungary was loss-making for years'],
      ['2015', 'Buys DuPont\'s Dymel pharma-propellant (HFA 134a) business', 'Entry into medical propellants'],
      ['FY20', 'Exits engineering plastics and Thai tyre cord', 'Portfolio focused on four businesses'],
      ['Oct-2020', 'QIP: ₹750 cr at ₹4,250 a share (₹850 after the bonus)', 'Funded the chemicals capex cycle'],
      ['Oct-2021', '4:1 bonus issue (29.6 cr shares after)', 'No cash effect; per-share figures restated'],
      ['FY21-23', 'Big chemicals capex (₹4,061 cr in three years); FY23 record profit ₹2,162 cr', 'Chemicals capital employed up from ₹5,032 cr to ₹8,382 cr'],
      ['FY24-25', 'Downcycle: agro destocking, Chinese dumping, film oversupply', 'Profit −38% in FY24; films EBIT margin 4.6%'],
      ['FY26', 'Refrigerant upcycle: fluoro revenue +60%; 300-acre Odisha site for HFOs; CFO change', 'Profit +47% to ₹1,835 cr'],
      ['Feb-2026', 'Promoter KAMA Holdings gets approval to sell up to 3% of SRF by Mar-2027', 'So far only a 1.08% transfer to a group company'],
      ['Q1FY27', 'Best quarter ever (profit ₹759 cr): refrigerants plus a war-time films windfall', 'Management called the films result "an aberration"'],
      ['Oct-2026', 'Q2FY27 margin miss; ₹600 cr battery-foil plant approved', 'Stock hit a 52-week low of ₹2,178'],
    ], source: 'Company filings, annual reports, press' } },
    { callout: '**Corporate actions:** one QIP (Oct-2020, ₹750 cr) and one bonus (4:1, Oct-2021). No buyback and no stock split since 2000. Dividends have been small (₹9 a share in FY26, ~15% of profit) because almost all cash goes back into capex.' },
  ],
};

// ---------------------------------------------------------------- Industry
const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Refrigerants are rationed by regulation; specialty and films are not',
  blocks: [
    { p: 'HFC refrigerants are powerful greenhouse gases, so the 2016 Kigali Amendment to the Montreal Protocol makes every country phase them down. That turns a commodity into a quota business: once production is capped, holders of quota earn more. **China**, the largest producer, has capped HFC output since 2024 (797,800 tonnes in 2026, with the top six firms holding ~90%), and its R32 price reached a decade high of ~CNY 63,000 a tonne in 2026. **India** freezes HFC production from 1 January 2028 at a baseline set by 2024-26 output, which is why SRF has run its plants flat out and is debottlenecking to over 65,000 tonnes a year. The catch is **calendar 2027**: a "free year" in which anyone with capacity may sell before the quotas start.' },
    { exhibit: { type: 'table', title: 'HFC phase-down rules in SRF\'s markets', head: ['Market', 'Rule', 'What it means for SRF'], wide: [1, 2], rows: [
      ['China', 'Production quota since 2024 (797,800 t in 2026; Juhua holds 37.6%); use falls to 90% of baseline by 2029', 'Caps the world\'s cheapest supplier: supports global prices'],
      ['India (Kigali group 2)', 'Freeze from 1-Jan-2028 on the 2024-26 average; cuts of 10% by 2032, 20% by 2037, 30% by 2042, 85% by 2047', 'Quota goes to existing producers: rewards SRF\'s full plants. 2027 is open to new entrants'],
      ['United States (AIM Act)', 'Allowances 60% of baseline 2024-28, 30% 2029-33, 15% from 2036', 'Shrinking HFC market; R32 faces US tariffs, so SRF sells cargo by cargo'],
      ['European Union (F-gas)', 'HFC production down to 15% by 2036; full consumption phase-out by 2050', 'Pushes demand towards HFOs, SRF\'s next product'],
    ], source: 'MoEFCC, US EPA, EU, SRF earnings calls (via research file)' } },
    { exhibit: { type: 'table', title: 'Other market forces', head: ['Theme', 'Direction', 'What it means'], wide: [2], rows: [
      ['China quotas and record R32 prices', 'Tailwind', 'China R32 exports fell 50% in Jan-Apr 2026; prices +19% to +77% YoY by series.'],
      ['India\'s 2027 "free year"', 'Headwind', 'New capacity can sell before quotas start; several R32 projects announced.'],
      ['Chinese overcapacity in agro intermediates', 'Headwind', 'Has kept specialty prices down since FY24; SRF chose to defend volume.'],
      ['Innovators moving supply out of China and Europe', 'Tailwind', 'Management sees more enquiries; converting them needs customers\' registrations.'],
      ['Film overcapacity in India', 'Headwind', 'BOPET capacity +45% and BOPP +20% in FY22-23 against demand +11%; industry profit at a decade low.'],
      ['Batteries, electronics, semiconductors', 'Tailwind', 'India targets >150 GWh of cell capacity by 2030; SRF building battery foil and electronic-grade HF.'],
      ['Raw materials and freight', 'Headwind', 'Hydrofluoric acid +~40% in 2026; freight up 15-20% on some routes; not all passed on.'],
    ], source: 'Company calls, broker notes, industry press (via research file)' } },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Tailwind test: SRF captures the refrigerant cycle, not (yet) the rest',
  blocks: [
    { verdicts: [
      ['HFC quotas and tight refrigerant supply', 'Yes', 'Fluoro revenue +60% in FY26 to ₹3,598 cr; chemicals EBIT margin 32% in Q4FY26.', 'The main driver of today\'s profits.'],
      ['Shift from HFCs to HFOs', 'No', 'Odisha HFO plant (₹2,300 cr) starts in Q4FY28; no revenue before FY29.', 'An option, not yet earnings.'],
      ['China+1 in agro and pharma chemicals', 'No', 'Specialty revenue fell 15% from FY23 to FY26; margin squeeze again in Q2FY27.', 'The thesis of FY19-23 has not played out since.'],
      ['Fluoropolymers and electronics', 'Partly', 'PTFE value-added grades ramping; PVDF from Q3FY27; Chemours FEP/FKM plants Q4FY27-Q1FY28.', 'Material only from FY28-29.'],
      ['Indian packaging demand', 'Partly', 'Films revenue +46% in H1FY27, but on war-time supply loss; EBIT margins 5-10% in FY24-26.', 'Volume yes, profit no.'],
      ['Indian air-conditioner growth', 'Yes', 'Domestic R32 demand 17-18k tonnes; SRF is a leading Indian producer (the only one for some gases, per Crisil).', 'Steady local demand under the quota.'],
    ], head: ['Industry tailwind', 'Captured?', 'Evidence', 'So what'], title: 'Tailwind test', source: SRC },
  ],
};

// ---------------------------------------------------------------- Chemicals
const projects = C.capex.projects.filter(p => /HFO|PVDF|Chemours|Electronic|Pharma|HFC deb/i.test(p.project));
const chemicals = {
  id: 'chemicals', nav: 'Chemicals: fluoro & specialty', kicker: 'Segment', title: 'Chemicals: refrigerants are booming, specialty is waiting for customers',
  blocks: [
    { pair: [
      { type: 'column', title: 'Chemicals revenue by quarter', unit: 'Chemicals revenue (₹ crore)', x: QL, series: [{ name: 'Chemicals', values: SQ.map(q => q.chemRev), fmt: 'num' }], labels: 'all', source: SRC },
      { type: 'column', title: 'Chemicals EBIT by quarter', unit: 'Chemicals EBIT (₹ crore)', x: QL, series: [{ name: 'EBIT', values: SQ.map(q => q.chemEbit), fmt: 'num' }], labels: 'all', source: SRC },
    ] },
    { bullets: [
      '**Refrigerants.** Q1FY27 was helped by a harsh global summer and full plants; Q2FY27 chemicals revenue was still +25% on higher HFC volumes and prices, with Middle East sales replacing a softer US (where R32 now faces tariffs). Management expects refrigerant demand and prices to stay "broadly stable". SRF will not disclose capacity; analysts estimate ~27-28k tonnes of R32 against Indian demand of 17-18k tonnes, so a large share is exported.',
      '**Specialty.** "Linear, slow recovery", says management: H2FY27 should be stronger than H1 on volumes, and "the worst of price destruction is behind". Pharma is ~10% of specialty today; the target is 20-30% by 2030, with two Western innovators (one oncology molecule) about to contribute. 7-8 agro products are "in a very advanced state" with customers; registrations for two are progressing in Brazil.',
      '**Fluoropolymers.** PTFE is shifting to value-added grades; PVDF (batteries, coatings) is being capitalised in Q3FY27; two plants built for Chemours (FEP/FKM) start in Q4FY27 and Q1FY28 on a return-on-investment contract, reaching full run-rate in FY29.',
      '**HFOs.** The ₹2,300 cr Odisha project (20,000 tonnes of HFOs plus hydrofluoric acid) uses SRF\'s own non-infringing process and is due in Q4FY28. HFOs sell at "significantly" higher prices than HFCs. Meaningful volumes come 8-12 months after start-up, i.e. in FY29.',
    ] },
    { exhibit: { type: 'table', title: 'Chemicals projects under way', head: ['Project', 'Cost (₹ cr)', 'Status / timing'], wide: [0, 2], rows: projects.map(p => [p.project, p.cost ? n0(p.cost) : 'n.d.', p.status]), source: 'SRF calls and board approvals (via research file); n.d. = not disclosed' } },
    { callout: '**Our view:** chemicals is a good business. Its pre-tax ROCE has been 17-28% since FY22, and new capital since FY21 has earned 28%. But FY26-27 profits sit at the top of the refrigerant cycle, while the specialty recovery keeps being pushed out. We model chemicals growth of 19% / 12% / 16% (FY27-29E) and an EBITDA margin of ~32-33%, below FY26\'s 35.7%.' },
  ],
};

// ---------------------------------------------------------------- Films & textiles
const films = {
  id: 'films', nav: 'Films, foil & textiles', kicker: 'Segments', title: 'Films, foil and textiles: cyclical businesses with low returns',
  blocks: [
    { pair: [
      { type: 'line', title: 'Films EBIT margin: 27% in FY21, 5-9% since FY24', unit: 'Films & foil EBIT margin (%, annual)', x: 'R.segments.annual[].fy', series: [{ name: 'Films & foil', fn: 'g("R.segments.annual")[i].packEbit/g("R.segments.annual")[i].packRev*100', fmt: 'pct' }, { name: 'Technical textiles', fn: 'g("R.segments.annual")[i].textEbit/g("R.segments.annual")[i].textRev*100', fmt: 'pct' }], labels: 'all', min: 0, max: 30, source: SRC },
      { type: 'column', title: 'Films revenue by quarter: +46% in H1FY27', unit: 'Films & foil revenue (₹ crore)', x: QL, series: [{ name: 'Films & foil', values: SQ.map(q => q.packRev), fmt: 'num' }], labels: 'all', source: SRC },
    ] },
    { bullets: [
      `**Films & foil** (37% of FY26 revenue, 17% of segment EBIT). Commodity BOPET/BOPP films made in India, Thailand, South Africa, Hungary and Indonesia. Margins collapsed from 27% EBIT in FY21 to 4.6% in FY24 when the industry added far more capacity than demand. In Q1FY27 the Middle East war shut rival plants, customers panic-bought and SRF earned 17.3%; Q2 fell back to 9.7%. Management says the "baseline" should settle higher as it moves to value-added products: capacitor films, BOPA, thick BOPET and aluminium foil (₹568 cr revenue in FY26, to turn profitable by the end of FY27; a ₹600 cr battery-foil plant from 2028).`,
      `**Technical textiles** (12% of revenue). India's #1 tyre-cord maker (60,000 tonnes) and a large belting-fabric exporter. EBIT margin fell from 22.6% in FY22 to 10.1% in FY26 on cheap imports and US tariffs; H1FY27 recovered to 15% as US tariffs were cut and a quality-control order protected industrial yarn.`,
    ] },
    { exhibit: { type: 'table', title: 'Listed film makers: SRF earns more than most, still below its cost of capital', head: ['Company', 'FY26 revenue (₹ cr)', 'FY26 EBITDA margin', 'ROCE', 'EV/EBITDA (x)'], rows: [
      ['**SRF films & foil**', n0(A26.packRev), n1(A26.packEbitda / A26.packRev * 100) + '%', A26.packRoce + '% (pre-tax)', '7x (our SOTP)'],
      ...D.peers.filter(p => /COSMO|POLYPLEX|UFLEX|JINDAL/.test(p.symbol)).map(p => [p.name.replace(/ Ltd$/, '').replace(' Corporation', ''), n0(p.revenueFy26), p.ebitdaMarginFy26 + '%', p.roce + '%', p.ebitdaFy26 > 0 ? n1(p.evEbitda) : 'n.m.']),
    ], source: 'Screener.in (28-Oct-2026), SRF annual report' } },
    { callout: '**Our view:** films and textiles earn 8-10% pre-tax on ₹8,100 cr of capital, below SRF\'s ~12.5% cost of capital. They generate cash and diversify the group, but they are not why investors own SRF. We assume films revenue is flat in FY28 as war-time prices fade, with a 13.5-14% EBITDA margin.' },
  ],
};

// ---------------------------------------------------------------- Moat
const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: real in fluorine chemistry, absent in films',
  blocks: [
    { verdicts: D.moat.map(m => [m.dimension, m.verdict[0].toUpperCase() + m.verdict.slice(1), m.evidence, m.verdict === 'advantage' ? 'Supports returns above the cost of capital.' : m.verdict === 'parity' ? 'Competitive, but does not set SRF apart.' : 'Limits margins; China sets the price.']), head: ['Dimension', 'Verdict', 'Evidence', 'So what'], title: 'Moat scorecard', source: 'GAM research compilation' },
    { callout: '**Honest verdict:** SRF\'s moat is **fluorine chemistry plus regulation**: it can run hazardous fluorination at scale, it owns processes (including a non-infringing HFO route), Chemours chose it as a partner, and India\'s quota system will lock in existing producers from 2028. That is a genuine, durable advantage. But in **specialty chemicals** China is cheaper and customers choose who makes their molecules; and **films** are a commodity. Two-thirds of the business is therefore cyclical, which is why SRF\'s ROE swings with the cycle (25% in FY22, 10% in FY25, 14% in FY26) instead of compounding steadily like the best Indian chemical franchises.' },
  ],
};

// ---------------------------------------------------------------- Earnings quality
const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: clean books, but hedging losses and one-offs to strip out',
  blocks: [
    { bullets: [
      '**Forex hedge losses.** SRF sells forward its export dollars for long periods. As the rupee weakened, these hedges lost ₹119 cr in FY25, ₹188 cr in FY26 and ₹165 cr in H1FY27. The company reports them below its own EBITDA; Screener (and this report) treats them as an operating cost. That is why Q2FY27 EBITDA is ₹946 cr here and ~₹1,010 cr in some broker notes.',
      '**One-offs.** FY26 included an ₹85 cr exceptional charge for the new Labour Codes and a ₹99 cr tax credit from a favourable tribunal order (Q3FY26). Q1FY27 films and textiles margins included low-cost inventory gains that reversed in Q2.',
      '**Corporate costs.** Segment EBIT (₹3,008 cr in FY26) is before ₹343 cr of unallocated costs (net of other income). Sum-of-the-parts valuations that ignore this flatter the result; ours deducts it.',
      '**Depreciation before revenue.** New plants are capitalised and depreciated a couple of quarters before they earn. With ₹2,122 cr in CWIP, depreciation will keep rising ahead of profits.',
      '**Audit.** B S R & Co. (KPMG network) gives a clean opinion; its key audit matter is hedge accounting. It notes that edit logs were not enabled on some accounting master tables during FY26 (a common IT-controls remark).',
    ] },
    { callout: '**Accounting flag: GREEN.** Segment disclosure is detailed and reconciles to reported profit; the auditor is a Big-4 firm with no qualification. Hedge losses and one-offs are disclosed clearly; investors simply need to strip them out.' },
  ],
};

// ---------------------------------------------------------------- Ownership additions
const H = D.ownership.holders;
const ownership = base => ({ ...base, blocks: [
  { p: 'The Bharat Ram family controls SRF through KAMA Holdings (listed), which with a group company owns 50.26%, with no shares pledged. Foreign investors have cut their stake from 19.6% to 15.2% over three years; Indian mutual funds, insurers and pension funds have more than taken it up (DIIs 22.5%).' },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Named holders and recent deals', head: ['Holder / deal', 'Stake', 'Note'], wide: [2], rows: [
    ['KAMA Holdings (promoter)', '49.13%', 'Approved in Feb-2026 to sell up to 3% of SRF by Mar-2027; so far only a 1.08% transfer to its own subsidiary'],
    ['KAMA Realty (Delhi) (promoter group)', '1.08%', 'Off-market transfer from KAMA Holdings, Sep-2026'],
    ...H.filter(h => !/KAMA/.test(h.name)).map(h => [h.name.replace(/ \(.*\)/, '').replace(/ - .*/, ''), h.pct + '%', /Kotak|SBI/.test(h.name) ? 'Shown under one scheme name; likely the fund house\'s total' : '']),
    ['Mutual funds (all)', '13.6%', '37 schemes (Sep-2026)'],
  ], source: 'BSE shareholding pattern (Sep-2026), Trendlyne, company filings' } },
  { callout: '**Our read:** a stable promoter with no pledge is a strength. The approved 3% sale is a modest overhang: if executed in the market it would take KAMA Holdings below 50%.' },
] });

// ---------------------------------------------------------------- Governance
const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: a professional family company with a strong board',
  blocks: [
    { exhibit: { type: 'table', title: 'Key people', head: ['Name', 'Role', 'Note'], wide: [2], rows: C.management.slice(0, 8).map(m => [m.name, m.role.replace(/ \(.*\)/, ''), (m.note || '').replace(/Tenure start not verified\.?/, '').trim()]), source: 'SRF annual report FY26, company filings' } },
    { verdicts: [
      ['Board', 'Strong', 'Ten directors, 60% independent, fully independent audit committee; well-known independent directors.', 'Better than most Indian family companies.'],
      ['Promoter and pledge', 'Strong', '50.26% with nil pledge; no open-market selling found.', 'The 3% sale approval is the one watch-point.'],
      ['Related parties', 'Strong', 'Rent ₹10 cr, sales to director-linked firms ₹49 cr, CSR ₹37 cr in FY26.', 'Small and routine.'],
      ['Pay', 'Moderate', 'Chairman/MD and Joint MD each paid ~328x the median employee; segment heads\' pay +53-56% in FY26.', 'High, but in line with large Indian groups.'],
      ['Management continuity', 'Moderate', 'CFO resigned Dec-2025; successor joined Jan-2026.', 'Segment CEOs are long-serving.'],
      ['Tax and legal', 'Moderate', 'Standalone contingent liabilities ₹264 cr; an AY2022-23 tax demand of ₹327 cr the company says is a computation error.', 'Manageable against ₹14,000 cr of net worth.'],
      ['Capital allocation', 'Moderate', 'Chemicals capex earned well; films capex did not. One QIP in 20 years; low payout.', 'Good in chemicals; the films spending is the blemish.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'GAM research compilation' },
  ],
};

// ---------------------------------------------------------------- Forecasts
const segRow = (k, name, field, hist, fmt = 'num') => [name, n0(hist), ...[0, 1, 2].map(i => `{{F.seg.${k}.${field}.${i}|${fmt}}}`)];
const cons = D.street.consensus.estimates;
const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: in line for FY27, below the street for FY28',
  blocks: [
    { p: 'We forecast each segment\'s revenue and EBITDA margin (segment EBIT plus its depreciation). Group EBITDA is the sum less corporate costs and hedge losses. Capex follows guidance (₹2,500 cr in FY27, more in FY28 for the HFO plant), so depreciation and interest rise ahead of the new plants\' profits. Every assumption, with our reasoning, is in the Excel model\'s Assumptions sheet, which recalculates this report\'s target price.' },
    { exhibit: { type: 'table', title: 'Segment forecasts (₹ crore)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      { sec: 'Chemicals' }, segRow('chem', 'Revenue', 'revenue', A26.chemRev), segRow('chem', 'EBITDA', 'adjEbitda', A26.chemEbitda),
      { sec: 'Performance Films & Foil' }, segRow('pack', 'Revenue', 'revenue', A26.packRev), segRow('pack', 'EBITDA', 'adjEbitda', A26.packEbitda),
      { sec: 'Technical Textiles' }, segRow('text', 'Revenue', 'revenue', A26.textRev), segRow('text', 'EBITDA', 'adjEbitda', A26.textEbitda),
      { sec: 'Others' }, segRow('oth', 'Revenue', 'revenue', A26.othRev), segRow('oth', 'EBITDA', 'adjEbitda', A26.othEbitda),
      ['Corporate costs & hedge losses', '−434', '{{F.unalloc.0|num}}', '{{F.unalloc.1|num}}', '{{F.unalloc.2|num}}'],
    ], source: 'Company (FY26), GAM Research estimates' } },
    { exhibit: { type: 'rows', title: 'Group P&L and cash flow summary (₹ crore)', from: 'FY24', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' },
      { name: 'Net profit', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n1' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Capex', ref: 'fin.capex' }, { name: 'Free cash flow', ref: 'fin.fcf' }, { name: 'ROE', ref: 'fin.roe', fmt: 'pct' },
    ], source: 'Company, GAM Research estimates' } },
    { exhibit: { type: 'table', title: 'GAM vs consensus', head: ['', 'GAM FY27E', 'Consensus FY27E', 'GAM FY28E', 'Consensus FY28E', 'GAM FY29E', 'Consensus FY29E'], rows: [
      ['Revenue (₹ cr)', '{{F.sales.0|num}}', n0(cons.FY27E.salesCr), '{{F.sales.1|num}}', n0(cons.FY28E.salesCr), '{{F.sales.2|num}}', n0(cons.FY29E.salesCr)],
      ['EBITDA (₹ cr)', '{{F.ebitda.0|num}}', n0(cons.FY27E.ebitdaCr), '{{F.ebitda.1|num}}', n0(cons.FY28E.ebitdaCr), '{{F.ebitda.2|num}}', n0(cons.FY29E.ebitdaCr)],
      ['EPS (₹)', '{{F.eps.0|n1}}', n1(cons.FY27E.eps), '{{F.eps.1|n1}}', n1(cons.FY28E.eps), '{{F.eps.2|n1}}', n1(cons.FY29E.eps)],
    ], source: 'MarketScreener consensus (28-Oct-2026), GAM Research' } },
    { callout: `For FY27 we are in line with consensus: H1 already delivered ₹1,268 cr of profit. For FY28 our EPS is ~${Math.abs(Math.round((F.eps[1] / cons.FY28E.eps - 1) * 100))}% below the street because we assume (1) refrigerant prices soften in the 2027 "free year", and (2) films margins fall back as war-time prices fade. FY29 recovers on HFOs and fluoropolymers if they start on time; that is the swing factor.` },
  ],
};

// ---------------------------------------------------------------- Street
const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: 'The street: split after the Q2 miss',
  blocks: [
    { p: `After the Q2FY27 results (22-Oct-2026) the street is split: 2 Buys (Motilal Oswal, ICICI Direct), 2 Holds (Prabhudas Lilladher, Jefferies) and 3 Sells (Kotak, UBS, Morgan Stanley). Targets range from ₹2,210 to ₹3,000. The broader consensus (29 analysts, MarketScreener) still averages ₹${n0(D.street.consensus.targets.mean)}, but much of it predates the miss. Bulls point to refrigerants, fluoropolymers and HFOs; bears to Chinese specialty pricing, peak refrigerant prices and a long wait for capex to pay off.` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who'], wide: [0], rows: D.critiques.slice(0, 8).map(c => [c.point, c.who]), source: 'Broker notes and press (via research file)' } },
  ],
};

// ---------------------------------------------------------------- Valuation
const VP = M.forecast.assumptions.valuation.parts;
const partRows = P.map((p, i) => [`**${p.name}**`, VP[i].netCash ? '–' : `{{dcf.sotp.parts.${i}.metric|num}}`, VP[i].netCash ? '–' : `${p.mult}x`, `{{dcf.sotp.parts.${i}.value|num}}`, `{{dcf.sotp.parts.${i}.perShare|num}}`, M.forecast.assumptions.valuation.parts[i].note || '']);
const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: 'Valuation: sum of the parts gives {{dcf.tp|inr}}',
  blocks: [
    { h: 'How the street values SRF' },
    { p: 'Brokers value SRF as **four businesses on EV/EBITDA** (enterprise value to operating profit), because chemicals deserves a far higher multiple than films or tyre cord. Every broker whose method we could find, except Elara (DCF), uses this sum of the parts on FY28-29E EBITDA. They differ mainly on the chemicals multiple: from 15x (Kotak) to 23x (Motilal Oswal). We use the same method, so our target is comparable; the last column shows each broker\'s multiples applied to our own estimates.' },
    { exhibit: { type: 'table', title: 'How the street values SRF', head: ['Broker', 'Rating', 'Target (₹)', 'Date', 'Method', 'Chemicals', 'Films', 'Textiles', 'On', 'At our estimates (₹)', 'Thesis'], wide: [10], rows: [
      ...streetRows.map(r => [r[0], r[1], r[2] ? n0(r[2]) : '–', ...r.slice(3)]),
      { hl: true, cells: ['**GAM Research**', '**HOLD**', '**{{dcf.tp|num}}**', '28-Oct-26', '**SOTP EV/EBITDA**', '**20x**', '**7x**', '**6x**', '**Sep-28E**', '**{{dcf.tp|num}}**', 'Fair value: refrigerants near peak, specialty slow'] },
    ], source: 'Broker notes and press reports; * = figures from press extracts of paywalled notes, not verified; n.d. = not disclosed' } },
    { h: 'Our sum of the parts' },
    { p: 'The target is a 12-month price, so each business is valued on the EBITDA the market will look at in October 2027: **Sep-28E** (half FY28E, half FY29E), the same basis Prabhudas Lilladher uses. We deduct corporate costs, which most brokers leave out, and net debt at the target date.' },
    { exhibit: { type: 'table', title: 'Sum of the parts (base case)', head: ['Business', 'Sep-28E EBITDA (₹ cr)', 'EV/EBITDA', 'Value (₹ cr)', '₹ / share', 'Why this multiple'], wide: [5], rows: [
      ...partRows,
      { hl: true, cells: ['**Equity value / target (rounded)**', '', '', '**{{dcf.sotp.equity|num}}**', '**{{dcf.tp|num}}**', 'vs CMP ₹{{P.last|num}}: {{dcf.upside|chg}}'] },
    ], source: 'GAM Research' } },
    { h: 'Why 20x for chemicals' },
    { exhibit: { type: 'table', title: 'Deriving the chemicals multiple', head: ['Yardstick', 'Evidence', 'What it implies'], wide: [1, 2], rows: [
      ['1. The street', 'Kotak 15x, PL 18x, ICICI Direct 20x, Nuvama 20x, MOSL 23x', 'Middle of the range: 20x'],
      ['2. What the market pays today', `At ₹${n0(price)}, after valuing the other businesses at our multiples, chemicals is priced at ~${n1(impliedChem)}x Sep-28E EBITDA`, 'Our 20x is ~10% above the market'],
      ['3. SRF\'s own history', 'Group EV/EBITDA median 26x since Oct-2021 (22x since 2019); 18x today, a 30% de-rating', '20x is below SRF\'s post-2021 norm'],
      ['4. Peers', 'Navin Fluorine ~34x and Gujarat Fluorochemicals ~35x trailing (fluoro); PI Industries ~16x (agro custom synthesis, down from a 26x median)', 'Chemicals is ~53% fluoro, ~47% specialty: ~0.53 × 24x + 0.47 × 16x ≈ 20x'],
      ['5. Returns', 'Chemicals pre-tax ROCE 21% in FY26 (17-28% since FY22) vs ~12.5% cost of capital', 'Supports a premium to the market, not to Navin'],
    ], source: 'Screener.in (EV/EBITDA history to 28-Oct-2026), broker notes, GAM Research' } },
    { pair: [
      { type: 'line', title: 'One-year-forward P/E: our 28x cross-check vs history', unit: 'Price ÷ next full-year EPS (x)', x: fwdPe.map(x => x[0]), series: [{ name: 'Forward P/E', values: fwdPe.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: Math.round(fwdMed), text: `Median since 2019: ${Math.round(fwdMed)}x` }, { v: 28, text: 'P/E cross-check: 28x', color: '#cf8f1f' }], source: 'Screener.in prices; actual EPS, GAM estimates for FY27-28E' },
      { type: 'hbar', title: 'Target and cross-checks vs the share price', unit: '₹ per share (base case)', x: ['Sum of the parts (target)', 'P/E 28x Sep-28E', 'DCF', 'Share price today'], series: [{ name: 'Value', values: [Math.round(mv('sotp').value), Math.round(mv('pe').value), Math.round(mv('dcf').value), price], fmt: 'inr' }], labels: 'all', highlight: 'Sum of the parts (target)', source: 'GAM Research' },
    ] },
    { exhibit: { type: 'table', title: 'Target price and cross-checks', head: ['Method', 'Role', 'Basis', 'Multiple', 'Value / share (₹)', 'vs target', 'Bull (₹)', 'Bear (₹)'], rows: [
      ['**Sum of the parts**', '**Target**', 'Sep-28E segment EBITDA', 'Chemicals 20x (bull 24x, bear 15x)', '**{{dcf.blend.methods.0.value|num}}**', '–', '{{scen.bull.blend.methods.0.value|num}}', '{{scen.bear.blend.methods.0.value|num}}'],
      ['P/E', 'Cross-check', `Sep-28E EPS ₹${n1(epsSep28)}`, '28x (bull 34x, bear 22x)', '{{dcf.blend.methods.1.value|num}}', `${Math.round(mv('pe').vsTarget) > 0 ? '+' : ''}${Math.round(mv('pe').vsTarget) || 0}%`, '{{scen.bull.blend.methods.1.value|num}}', '{{scen.bear.blend.methods.1.value|num}}'],
      ['DCF', 'Cross-check', '15-year FCFF, Ke 12.5%, g 6%', `implies ${n1(V.intrinsicTp / F.eps[1])}x FY28E`, '{{dcf.blend.methods.2.value|num}}', `${mv('dcf').vsTarget.toFixed(0)}%`, '{{scen.bull.blend.methods.2.value|num}}', '{{scen.bear.blend.methods.2.value|num}}'],
      { hl: true, cells: ['**12-month target (rounded)**', '', '', '', '**{{dcf.tp|inr}}**', '{{dcf.upside|chg}} vs CMP', '{{scen.bull.tp|inr}}', '{{scen.bear.tp|inr}}'] },
    ], source: 'GAM Research' } },
    { callout: `**What the cross-checks tell us.** The P/E check lands on the target: 28x Sep-28E EPS, SRF's post-2019 forward median cut by the sector's ~20-25% de-rating. The DCF is ${Math.abs(mv('dcf').vsTarget).toFixed(0)}% lower: with ₹2,500 cr a year of capex, free cash flow is thin until FY29, and at a 12.5% cost of capital the cash flows alone do not support today's price. The market (and our target) is paying for HFOs and fluoropolymers to lift returns from FY29. If they slip, the multiple has room to fall.` },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', '{{as.scenarios.bull.narrative}} Chemicals valued at 24x.'],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', 'Chemicals revenue +19% / +12% / +16% (FY27-29E) at a ~32-33% EBITDA margin; films margin ~14%; chemicals at 20x Sep-28E EBITDA.'] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', '{{as.scenarios.bear.narrative}} Chemicals valued at 15x (Kotak).'],
    ], source: 'GAM Research' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-42E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Less: net debt at Mar-27', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
      { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of capital down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Listed peers', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', 'EV/EBITDA (x)', 'ROE'], rows: D.peers.filter(p => !/COSMO|POLYPLEX|UFLEX|JINDAL/.test(p.symbol)).map(p => [p.symbol === 'SRF' ? '**SRF**' : p.name.replace(/ Ltd$/, '').replace(' International', ''), n0(p.mcapCr), n0(p.revenueFy26), p.ebitdaMarginFy26 + '%', `${n1(p.pe)} (fwd ${p.peFwd ? n1(p.peFwd) : '–'})`, n1(p.evEbitda), p.roe + '%']), source: 'Screener.in, stockanalysis.com (forward P/E = consensus next 12 months), 28-Oct-2026' } },
  ],
};

// ---------------------------------------------------------------- Verdict
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;
const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: 'Our honest summary: a good chemicals business at a fair price',
  blocks: [
    { callout: '**What you are buying:** India\'s leading fluorochemicals maker, with a quota-protected refrigerant business, real process know-how and a pipeline of new products (HFOs, fluoropolymers, battery foil). Attached are three cyclical, low-return businesses (specialty chemicals today, films and tyre cord).' },
    { callout: `**What you are paying:** ${n1(price / F.eps[1])}x FY28E earnings and ~${n1(impliedChem)}x Sep-28E EBITDA for chemicals, well below SRF's own history. On the street's method and our inputs the target is {{dcf.tp|inr}} ({{dcf.upside|chg}}): short of our 15% BUY threshold. Profits today rest on refrigerant prices that may be at a peak; the next leg needs specialty to recover and HFOs to start on time.` },
    { exhibit: { type: 'table', title: 'What would make it a BUY', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      [`Price below ~₹${n0(buyBelow)} (15%+ upside to our target)`, 'Medium', 'Share price after Q3FY27'],
      ['Specialty recovery shows up in the numbers', 'Medium', 'Chemicals EBIT margin back above 28%; new agro molecules commercialised'],
      ['Refrigerant prices hold through 2027', 'Medium', 'China R32 prices; India quota rules (early 2027)'],
      ['HFO and fluoropolymer plants on time', 'Medium', 'Chemours plants Q4FY27/Q1FY28; HFO Q4FY28'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What would make it a SELL', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['HFC prices fall in the 2027 "free year"', 'Medium', 'Chemicals margin down 3-5pp; FY28 EPS 15-20% below our estimate'],
      ['Specialty stays weak into FY28', 'Medium', 'Multiple contracts towards Kotak\'s 15x'],
      ['Capex delays or cost overruns', 'Low-medium', 'Depreciation and interest without the revenue'],
      ['Further hedge losses if the rupee keeps falling', 'Medium', '₹100-200 cr a year off profit'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: HOLD, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**Buy below ~₹${n0(buyBelow)}**, or on clear evidence of the specialty recovery (chemicals EBIT margin back above 28% without help from refrigerant prices).`,
      `**Sell above ~₹${n0(sellAbove)}**, or if Indian HFC prices fall sharply in 2027.`,
      '**Biggest swing factor:** the refrigerant price. It made FY26 and could unmake FY28.',
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Chemicals share of segment EBIT', v: '75%', d: 'on 49% of revenue (FY26)' },
      { k: 'Refrigerant revenue, FY26', v: '+60%', d: 'specialty −7%' },
      { k: 'Chemicals EBIT margin, Q2FY27', v: '25.4%', d: '28.9% a year earlier' },
      { k: 'Capex, FY27E', v: '₹2,500 cr', d: 'HFO plant from Q4FY28' },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

// ---------------------------------------------------------------- Glossary
const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['HFC', 'Hydrofluorocarbon: today\'s main refrigerant gases (e.g. R32 for home ACs, R134a for car ACs, R125 for blends). Powerful greenhouse gases, now being phased down.'],
      ['HFO', 'Hydrofluoro-olefin: next-generation refrigerants with very low global-warming impact; replacing HFCs in cars and, gradually, ACs.'],
      ['Kigali Amendment / phase-down', 'The 2016 global agreement to cut HFC production and use, country by country, through quotas.'],
      ['Quota baseline', 'The production level on which a country\'s quotas are based; for India the 2024-26 average, frozen from 2028.'],
      ['"Free year"', 'SRF\'s term for calendar 2027: after the baseline period but before quotas apply, so any producer may sell.'],
      ['HF / AHF', '(Anhydrous) hydrofluoric acid: the basic raw material for all fluorochemicals.'],
      ['PTFE, PVDF, FEP, FKM', 'Fluoropolymers: plastics and rubbers made from fluorine chemistry, used in cables, batteries, semiconductors and seals.'],
      ['Specialty chemicals / custom synthesis', 'Making a specific intermediate or active ingredient for one agrochemical or pharma innovator under a long-term contract.'],
      ['Innovator', 'A company that discovers and patents new molecules (e.g. a global agrochemical major) and outsources some manufacturing.'],
      ['BOPET / BOPP / BOPA / CPP', 'Types of plastic packaging film (polyester, polypropylene, nylon, cast polypropylene).'],
      ['Tyre cord fabric', 'Nylon or polyester fabric that reinforces tyres.'],
      ['Forex (ECF) hedge loss', 'Loss on forward contracts that lock in the rupee value of future export earnings, when the rupee weakens.'],
      ['Sum of the parts (SOTP)', 'Valuing each business separately and adding them up, less net debt.'],
      ['EV/EBITDA', 'Enterprise value (market value plus net debt) divided by operating profit before depreciation.'],
      ['ROCE', 'Return on capital employed: operating profit (EBIT) as % of the capital tied up in the business.'],
      ['DCF / WACC', 'Discounted cash flow valuation; WACC is the required annual return used to discount future cash.'],
    ], source: 'GAM Research' } },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, business, history, industry, tailwind, chemicals, films, moat, p.financials, p.capital, quality, p.balance, ownership(p.ownershipBase), governance, forecasts, street, valuation, risks, p.statements, glossary],
  statementNotes: {
    'sales@FY22': 'Specialty +30% and refrigerants nearly doubled; films revenue +45% on high film prices.',
    'sales@FY24': 'Agrochemical destocking and Chinese price cuts in specialty; film oversupply.',
    'pat@FY24': 'Films EBIT margin fell to 4.6%; chemicals EBIT −30%.',
    'ebitdaMargin@FY24': 'Films margin collapse (BOPET/BOPP overcapacity).',
    'pat@FY26': 'Refrigerant revenue +60%; includes an ₹85 cr Labour Codes charge and a ₹99 cr tax credit.',
    'otherIncome@FY26': 'Other income ₹107 cr less the ₹85 cr exceptional charge.',
    'sales@FY27E': 'GAM: H1 +33% (refrigerants, war-time film prices); H2 slows to ~13%.',
    'pat@FY28E': 'Flat: refrigerant prices soften in the 2027 "free year"; films normalise; depreciation rises.',
    'pat@FY29E': 'HFOs and fluoropolymers run for a full year.',
  },
};
