// Endurance Technologies report, part 3: India, Europe, the newer businesses, customers (Bajaj concentration) and the moat.
const X = require('./ENDURANCE.ctx');
const { C, D, SA, SQ, QL, F, n0, n1, pc, seg, segMargin, eurM, EUR, A26 } = X;
const E = C.europe, G = C.guidance, Q = C.q1fy27;
const yrs = ['FY26', ...F.years];
const buildRows = k => {
  const base = { india: [A26.india, A26.indiaEbitda], maxwell: [A26.maxwell, A26.maxwellEbitda], europe: [A26.europe, A26.europeEbitda] }[k];
  const rev = [base[0], ...seg(k).revenue], eb = [base[1], ...seg(k).adjEbitda];
  return [
    ['Total income', ...rev.map(n0)],
    ['growth', '', ...rev.slice(1).map((v, i) => pc((v / rev[i] - 1) * 100))],
    ['EBITDA (incl. other income)', ...eb.map(n0)],
    ['EBITDA margin', ...eb.map((v, i) => n1(v / rev[i] * 100) + '%')],
  ];
};
const head = ['₹ crore', ...yrs];

const india = {
  id: 'india', nav: 'India business', kicker: 'Segment: India (72% of income)', title: 'India: two-wheeler content keeps growing; the margin depends on how fast metal costs are passed on',
  blocks: [
    { p: `India (the listed company's standalone accounts) earned ₹${n0(A26.india)} cr of total income in FY26 (+20%) at a ${n1(A26.indiaEbitda / A26.india * 100)}% EBITDA margin (13.7% in FY25). Q1FY27 income was ₹${n0(Q.standalone.totalIncome)} cr (+${Q.standalone.growth}%), but raw materials rose to ${Q.standalone.rmcPct}% of income (${Q.standalone.rmcPctQ1FY26}% a year earlier) and the margin fell to ${Q.standalone.margin}%. Management's explanation: Q1 was billed on Q4FY26 metal prices while it paid Q1 prices (>₹300 cr up front); excluding the non-value-add metal increase, the margin would have been ${Q.standalone.marginExCommodity}%. From Q2 customers pay Q1-average rates, aluminium alloy has softened by ₹12-17/kg, and gas, fuel and wage increases are being negotiated. The standalone business still had ₹${n0(Q.standalone.netCash)} cr of net cash at Jun-2026.` },
    { pair: [
      { type: 'column', title: 'India income per quarter: ₹2,135 cr to ₹3,194 cr in two years', unit: 'Standalone total income (₹ crore)', x: QL, series: [{ name: 'India', values: SQ.map(q => q.india), fmt: 'num' }], labels: 'all', source: 'Results presentations' },
      { type: 'line', title: 'India margin: 13-14% in FY25, 11.2% in Q1FY27', unit: 'EBITDA incl. other income, % of total income', x: QL, series: [{ name: 'India', values: SQ.map(q => Math.round(q.indiaEbitda / q.india * 1000) / 10), fmt: 'pct' }], labels: 'all', min: 8, max: 16, source: 'Results presentations' },
    ] },
    { exhibit: { type: 'table', title: 'Where India\'s growth comes from (capacity and orders, to Aug-2026)', head: ['Product', 'Position', 'What is being added'], wide: [1, 2], rows: [
      ['Brakes and ABS', `${C.profile.marketShareFY26.brakeAssemblies}% of 2W brake assemblies; +30% a year for four years`, 'ABS +0.9 mn units (SOP Sep/Oct-2026) on 0.64 mn; dual-channel ABS for Bajaj; Chennai plant (3 mn assemblies); 9 mn assemblies by Q1FY28; Tata Motors 4W drum brakes; 3W to 1.5 mn'],
      ['Suspension', `${C.profile.marketShareFY26.frontForks}% of front forks, ${C.profile.marketShareFY26.shockAbsorbers}% of shock absorbers`, 'Inverted forks 60k → 100k a month by end-FY27; Bajaj mono-shocks and forks (25k sets/month, Q4FY27); Hero and Suzuki (₹120 cr a year, Q3FY27); HMSI facelift (₹220 cr)'],
      ['Alloy wheels', '4.8 mn wheel sets a year (Chakan full; Bidkin 60% used)', 'Bidkin to full by end-FY27 (Royal Enfield, Ather, Suzuki, Piaggio; ~₹600 cr a year)'],
      ['Castings and forgings', '4W ~6% of India sales (₹180 cr in Q1FY27)', 'Shendra (US EV maker, JLR, Valeo; ₹513 cr peak in early FY29); Chennai (Hyundai/Kia ₹80 cr, Isuzu hybrid); Chakan (Tata, Mahindra); fifth forging press (Q3FY27)'],
      ['Battery packs', 'SOP Jun-2026 for Hero MotoCorp', '17-18k packs a month, full by Oct-2026; ₹300-360 cr a year, up to ₹600 cr in FY28; 4W packs Q4FY27 (₹62 cr capex)'],
      ['Transmission, driveshafts, solar', 'Clutches 3.5% of India sales', 'Adler slip clutches (Royal Enfield, Kawasaki, Bajaj); driveshafts >₹100 cr in FY27; solar dampers and actuators ₹345 cr of orders'],
    ], source: 'Q4FY26 call (15-May-2026); Q1FY27 presentation and call (13/14-Aug-2026)' } },
    { exhibit: { type: 'table', title: 'Our build: India standalone', head, rows: buildRows('india'), source: 'Company (FY26); GAM estimates (assumptions.json segments)' } },
    { callout: `**Our view:** we assume India grows {{as.segments.0.growth.0|pct0}} in FY27E (Q1 +36%, then ~19% as the GST base bites) and 14% / 12% after, with the margin recovering to {{as.segments.0.marginPct.0|pct}} for the year and {{as.segments.0.marginPct.2|pct}} by FY29E. We do not assume a return to FY25's 13.7%: battery packs and metal pass-through inflate income more than profit, and new plants carry start-up costs.` },
  ],
};

const eq = SQ.filter(q => q.europeEurM);
const europe = {
  id: 'europe', nav: 'Europe business', kicker: 'Segment: Europe (27% of income)', title: 'Europe: an 18% margin business with no organic growth; Stöferle bought the growth',
  blocks: [
    { p: `Endurance Overseas made EUR${E.fy26EurM} mn of total income in FY26 (+28.9%) and EUR${E.fy26EbitdaEurM} mn of EBITDA (${E.fy26MarginPct}%). Without Stöferle, income grew ${E.growthExStoferlePct}% (parts only: +${E.partsGrowthExStoferlePct}%). Stöferle, bought on 2-Apr-2025, contributed EUR${E.stoferle.fy26RevenueEurM} mn of income, EUR${E.stoferle.fy26EbitdaEurM} mn of EBITDA and EUR${E.stoferle.fy26PatEurM} mn of profit, a little better than planned, plus ~EUR20 mn of cash. In Q1FY27 income was EUR${E.q1fy27EurM} mn (+1.1%) and EBITDA EUR${E.q1fy27EbitdaEurM} mn (18.2%), but profit fell to EUR${E.q1fy27PatEurM} mn from EUR${E.q1fy26PatEurM} mn because Endurance is writing off, over ~18 months, the remaining value of machines tied to combustion-engine programmes that are ending (depreciation EUR${E.q1fy27DepEurM} mn vs EUR${E.q1fy26DepEurM} mn). Orders won: EUR${E.ordersEurM.fy26} mn in FY26 and EUR${E.ordersEurM.q1fy27} mn in Q1FY27, including a Mercedes hybrid-transmission part where Endurance takes 100% of the volume from Jan-2027 after a rival went bankrupt (~EUR40 mn a year, MOSL).` },
    { pair: [
      { type: 'column', title: 'Euro income: ~EUR90-107 mn a quarter since Stöferle', unit: 'Europe total income (EUR mn)', x: eq.map(q => q.q), series: [{ name: 'Europe', values: eq.map(q => q.europeEurM), fmt: 'n1' }], labels: 'all', source: 'Q4FY26 and Q1FY27 calls; MOSL (Q2-Q3FY26); Q4FY25 from the Q4FY26 call' },
      { type: 'line', title: 'Europe margin: 16-20% (EBITDA incl. other income)', unit: '% of total income (₹ basis)', x: QL, series: [{ name: 'Europe', values: SQ.map(q => Math.round(q.europeEbitda / q.europe * 1000) / 10), fmt: 'pct' }], labels: 'all', min: 10, max: 24, source: 'Results presentations' },
    ] },
    { exhibit: { type: 'table', title: 'Our build: Europe', head, rows: [...buildRows('europe'), ['Memo: EUR mn at ₹' + EUR + '/EUR (FY26 actual)', String(E.fy26EurM), ...[0, 1, 2].map(i => n1(eurM(i)))]], source: `Company (FY26); GAM estimates. FY27-29E converted at the Q1FY27 rate of ~₹${EUR} per euro (FY26 average ~₹102.6).` } },
    { bullets: [
      '**Why the margin is high:** machined castings for premium German brands (VW-Audi-Porsche 7.8% of group income, Mercedes 7.4%), indexed metal prices (quarterly, on the previous quarter\'s average) and support from customers when energy costs spiked.',
      '**Why growth is low:** European car production fell 5% in Q1FY27; Chinese brands import their powertrains; combustion-engine work (~30% of Europe sales) runs down to ~25% by FY28; Stöferle buys its castings from outside and its full integration benefit starts only from Sep-2027.',
      '**What could change it:** acquisitions ("good companies available at good prices", MD) and work moved from bankrupt suppliers. The put/call price for the rest of Stöferle rises with its EBITDA above EUR17 mn (4.5x the excess), so the better Stöferle does, the more the remaining 32% costs.',
    ] },
  ],
};

const MXr = buildRows('maxwell');
const newbiz = {
  id: 'newbiz', nav: 'New businesses', kicker: 'Segment: Maxwell and new products', title: 'Electronics and battery packs: small today, the main source of new content',
  blocks: [
    { p: `Maxwell (BMS, motor controllers, telematics, DC-DC converters) had ₹${n0(A26.maxwell)} cr of income in FY26 (₹70 cr in FY25) and turned its first profit in Q1FY27 (₹1 cr; income ₹57 cr, +85%). It supplied ~1 lakh BMS units in the quarter to scooter, 3W, tractor and construction-equipment makers; cumulative orders are ₹238 cr a year at peak (Q2FY28) with ₹300 cr+ of quotes outstanding. The bigger change is in the standalone business: a battery-pack plant near Pune started supplying Hero MotoCorp in June 2026, using Maxwell's BMS and Endurance's castings, with a 4W battery pack to follow in Q4FY27. Management will not yet give a battery-pack margin; it is "a very high-value business" where the target is the company's average margin.` },
    { exhibit: { type: 'table', title: 'Our build: Maxwell', head, rows: MXr, source: 'Company (FY26); GAM estimates' } },
    { exhibit: { type: 'table', title: 'Orders won since FY23 in India (peak annual value, excluding Bajaj Auto)', head: ['', '₹ crore'], rows: [
      ['Total orders won FY23-Q1FY27 (excl. Maxwell, incl. battery packs)', '5,270'],
      ['  of which new business', '4,241'],
      ['EV orders in conventional products (excl. Bajaj)', '1,496'],
      ['EV orders including Bajaj', '1,806'],
      ['Battery packs (FY26 order)', '300'],
      ['Shendra 4W/non-auto castings (cumulative)', '513'],
      ['Solar dampers and actuators', '345'],
      ['Maxwell cumulative orders', '238'],
      ['Requests for quotation in hand (Jun-2026)', '4,526'],
    ], source: 'Q1FY27 presentation pp7-8, 11 and call (14-Aug-2026)' } },
    { callout: '**Our view:** these are the right products (EV-agnostic or EV-specific, higher content per vehicle), but they are early. Maxwell is still ~1% of income; battery packs bring revenue with heavy bought-in cells. We model Maxwell at +50% / +30% / +25% with margins rising to 9%, and include battery packs in India\'s growth.' },
  ],
};

const CU = C.profile.customers;
const customers = {
  id: 'customers', nav: 'Customers & Bajaj', kicker: 'Customer concentration', title: 'Bajaj Auto: 35% of income, falling slowly as other customers and Europe grow',
  blocks: [
    { p: 'Bajaj Auto bought 35% of the group\'s FY26 income (38% in FY25, 39.4% in FY24). If, as we assume, nearly all of it is billed from India, Bajaj is roughly half of standalone income (~₹5,150 cr of ₹10,696 cr; the company does not disclose the standalone share). The relationship goes back to the company\'s start, and Endurance gains share inside Bajaj (FY26: sales to Bajaj +16% vs Bajaj volumes +12%), including EV programmes, ABS and alloy wheels. The order statistics Endurance publishes exclude Bajaj, so they understate total new business. The risk is the mirror image: Bajaj sets prices, delays metal pass-through by a quarter, and any loss of Bajaj\'s market share (motorcycles are ~70% of India income, against a market moving to scooters) flows straight to Endurance.' },
    { exhibit: { type: 'table', title: 'Top customers, share of consolidated total income', head: ['Customer', 'FY25', 'FY26'], rows: CU.map(([c, a, b2]) => [c, a + '%', b2 + '%']), source: 'Q4FY26 presentation p29; Q4FY25 presentation p27' } },
    { callout: '**So what:** concentration is falling in percentage terms because Europe (Mercedes, VW) and other Indian two-wheeler makers grow faster, not because Bajaj is shrinking. Scooters are 14.3% of India income (under 10% a few years ago) as Endurance wins Honda, TVS, Ather and Suzuki programmes.' },
  ],
};

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: scale in 2W suspension and brakes, not pricing power',
  blocks: [
    { verdicts: D.moat, head: ['Dimension', 'Verdict', 'Evidence', 'So what'], title: 'Moat scorecard', source: 'GAM research compilation (annual report, presentations and calls to Aug-2026; broker notes)' },
    { callout: '**Verdict: a narrow moat.** Endurance has real advantages in Indian two-wheeler suspension and brakes: the largest share, 15-25 years of programmes with each customer, in-house testing and now ABS electronics. Switching a supplier of safety parts is slow, which shows up in steady share gains. But it has no pricing power (metal is passed through at cost, late), depends on one customer for a third of income, and its European castings business competes on cost and capacity in a shrinking market.' },
  ],
};

module.exports = { india, europe, newbiz, customers, moat };
