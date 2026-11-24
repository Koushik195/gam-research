// Ramkrishna Forgings report, part 2: what the company does, history and corporate actions, industry, tailwind test.
const X = require('./RKFORGE.ctx');
const { C, D, SA, n0, n1, pc } = X;
const B = C.business, MX = B.mixStandalonePct, UT = B.utilisation, CAP = B.capacityFY26, EG = B.exportsByGeography;

const business = {
  id: 'business', nav: 'What it does', kicker: 'The business', title: 'What Ramkrishna Forgings does: forged truck parts, two-thirds sold in India',
  blocks: [
    { p: `Ramkrishna Forgings (RKFL), founded in 1981 in Kolkata and run by the Jalan family, is India's second-largest forging company. It heats steel bars and shapes them in dies (hammers, presses, ring-rolling mills, cold and warm forging), then machines many of the parts. Since FY25 it also casts iron parts. Customers are mainly commercial-vehicle (truck and bus) makers in India, North America and Europe, plus railways, mining and farm equipment, oil & gas and, recently, passenger cars and EVs. Installed capacity is ${n0(CAP.total)} tonnes a year; FY26 production was ${n0(UT.productionFY26)} tonnes (~56%).` },
    { exhibit: { type: 'table', title: 'Where the revenue comes from (standalone, % of revenue)', head: ['', ...MX.years], rows: [
      ['Domestic auto (mainly trucks)', ...MX.domesticAuto.map(v => v + '%')],
      ['Railways', ...MX.railways.map(v => v + '%')],
      ['Mining, earth-moving and farm', ...MX.miningFarm.map(v => v + '%')],
      ['Industrial, steel, cement, power', ...MX.industrialOther.map(v => v + '%')],
      { hl: true, cells: ['**Total domestic**', ...MX.domestic.map(v => `**${v}%**`)] },
      ['Exports: auto', ...MX.exportAuto.map(v => v + '%')],
      ['Exports: other (incl. oil & gas)', ...MX.exportOther.map(v => v + '%')],
      { hl: true, cells: ['**Total exports**', ...MX.exports.map(v => `**${v}%**`)] },
    ], source: 'Q1FY27 investor presentation (24-Jul-2026)' } },
    { pair: [
      { type: 'hbar', title: 'Capacity: press lines dominate; ring rolling runs above 100%', unit: 'Installed capacity, tonnes a year (FY26)', x: ['Press lines', 'Forging (hammer)', 'Casting', 'Ring rolling'], series: [{ name: 'Capacity', values: [CAP.press, CAP.forgings, CAP.casting, CAP.ringRolling], fmt: 'num' }], labels: 'all', source: 'Q1FY27 investor presentation' },
      { type: 'column', title: 'Utilisation: 70% → 74% → 68% (new capacity added in Q4FY26)', unit: 'Capacity utilisation (%), annualised', x: ['Q1FY26', 'Q4FY26', 'Q1FY27'], series: [{ name: 'Total', values: [UT.Q1FY26.total, UT.Q4FY26.total, UT.Q1FY27.total], fmt: 'pct0' }, { name: 'Press', values: [UT.Q1FY26.press, UT.Q4FY26.press, UT.Q1FY27.press], fmt: 'pct0' }, { name: 'Casting', values: [UT.Q1FY26.casting, UT.Q4FY26.casting, UT.Q1FY27.casting], fmt: 'pct0' }], labels: 'all', source: 'Q1FY27 investor presentation' },
    ] },
    { exhibit: { type: 'table', title: 'The group (FY26)', head: ['Entity', 'What it does', 'FY26 revenue (₹ cr)', 'FY26 PBT (₹ cr)'], wide: [1], rows: [
      ['Ramkrishna Forgings (standalone)', 'Forgings, ring rolling, machining, castings from Mar-2026', '3,755', '84 (after JV loss)'],
      ['Ramkrishna Casting Solutions (ex-JMT Auto; Multitech and Mal Metalliks merged in)', 'Iron castings, machining, PV/2W parts', n0(B.subsidiariesFY26.rcsl.revenue), n1(B.subsidiariesFY26.rcsl.pbt)],
      ['Ramkrishna Forgings LLC (US)', 'Warehousing and sales in North America', n0(B.subsidiariesFY26.llcUs.revenue), n1(B.subsidiariesFY26.llcUs.pbt)],
      ['Ramkrishna Forgings Mexico', 'Resortes Libertad, bought in Aug-2024 for ₹3.5 cr; production started in 2026', n1(B.subsidiariesFY26.mexico.revenue), n1(B.subsidiariesFY26.mexico.pbt)],
      ['Ramkrishna Titagarh Rail Wheels (51%, JV)', 'Forged rail wheels for Indian Railways (equity-accounted)', '–', `${n1(B.subsidiariesFY26.rtrwl.pbt)} (share of loss ${n1(B.subsidiariesFY26.rtrwl.pat)})`],
    ], source: 'Annual report FY26 (directors\' report). Consolidated revenue ₹4,238 cr after inter-company eliminations.' } },
    { callout: `**So what:** this is still a truck-parts business. Domestic auto (mostly trucks) plus auto exports were ${(MX.domesticAuto[4] + MX.exportAuto[4]).toFixed(1)}% of FY26 standalone revenue. North America alone was ${Math.round(EG.FY25.northAmerica / EG.FY25.total * 100)}% of exports in FY25 and ${Math.round(EG.FY26.northAmerica / EG.FY26.total * 100)}% in FY26. Railways (7.5%) and the wheel JV are the main diversification; aluminium, stainless and aerospace forgings are years away.` },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'History: a fast-growing forger that bought, borrowed and then stumbled over its own inventory',
  blocks: [
    { exhibit: { type: 'table', title: 'Corporate actions and what they did to the numbers', head: ['When', 'What happened', 'Impact on the numbers'], wide: [1, 2], rows: [
      ['FY20-21', 'Indian truck downturn and Covid', 'Revenue −37% in FY20; PAT ₹10-21 cr'],
      ['FY22-24', 'Truck upcycle in India and the US; new press lines', 'Revenue ₹2,320 cr to ₹3,705 cr; EBITDA margin 21-22%; EPS ₹12.4 → ₹16.1'],
      ['Jul-2023', 'Bought Multitech Auto and Mal Metalliks (~₹205 cr; machining, PV/2W parts)', 'Entry into PV and two-wheeler parts; Screener shows ₹430 cr of acquisition outflow in FY24'],
      ['Nov-2023', 'QIP: ₹1,000 cr at ₹614 a share', 'Debt/equity 1.0x → 0.5x; ~10% dilution'],
      ['Jun-2023 onwards', 'Rail-wheel JV with Titagarh (51%); 80,000-wheel Indian Railways offtake', 'Equity-accounted loss ₹18 cr in FY26 before production'],
      ['Aug-2024', 'Bought a Mexican plant (₹3.5 cr)', 'Loss ₹14 cr in FY26; revenue from Q3FY27'],
      ['FY25', 'ACIL Ltd merged into RKFL (NCLT, 27-Mar-2025); travel unit Globe All India sold to Yatra (₹128 cr)', '₹187 cr deferred-tax asset on ACIL losses (FY25 tax credit); ₹83 cr discontinued-operations profit'],
      ['Apr-Jun 2025', 'Inventory overstatement found at the year-end count; independent fact-finding review', '₹220.5 cr overstated at Mar-25, ₹50.2 cr at Mar-24 (FY24 restated); ~₹170 cr charged in FY25'],
      ['Aug-2025 / Jan-2026', 'Promoter warrants: 9.75 lakh at ₹2,100 (₹205 cr) and 34 lakh at ₹588 (₹200 cr)', 'All converted by 24-Sep-2026; shares 18.18 cr → 18.56 cr (+2.1%)'],
      ['FY26', 'US tariffs; Class 8 down 13-14%; new press and casting capacity commissioned', 'Exports −20%; depreciation +23%, interest +27%; PAT ₹72 cr'],
    ], source: 'Annual reports, exchange filings, press (dates as cited in our research files)' } },
    { callout: '**Pattern:** strong execution in the up-cycle, then problems when growth, acquisitions and new plants all came at once. The FY25 inventory overstatement built up in the year the company was integrating two acquisitions and commissioning capacity. It is the main reason we put more weight on the earnings record than on management\'s targets.' },
  ],
};

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Industry: Indian trucks at a record, US trucks at a bottom, energy and freight costs up',
  blocks: [
    { bullets: [
      `**India:** FY26 commercial-vehicle retail sales crossed 10 lakh for the first time (${n0(D.industry.indiaCv.fy26RetailUnits)}, +${D.industry.indiaCv.fy26RetailGrowthPct}%); M&HCV production rose ~16% to ${n0(D.industry.indiaCv.fy26MhcvProduction)}. ICRA expects only ${D.industry.indiaCv.fy27OutlookPct} growth in FY27 off that high base.`,
      `**North America:** Class 8 retail sales were ${D.industry.usTrucks.class8Retail2025} in 2025: ${D.industry.usTrucks.comment.replace(/\s*\(AR FY26\)/, '')}.`,
      `**Tariffs:** ${D.industry.tariffs}`,
      `**Costs:** ${D.industry.costs}`,
      '**Competition:** Bharat Forge is far larger; Happy Forgings, GNA Axles and CIE Automotive compete in parts of the range. Global OEMs buy from several qualified suppliers; India\'s cost advantage is real but so is the customers\' bargaining power.',
    ] },
    { callout: '**So what:** RKFL\'s domestic business rides a strong Indian truck cycle that is now mature; its export business depends on a US truck recovery and on tariff policy, both outside its control.' },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Does the tailwind reach RKFL? Domestic yes, exports partly, new businesses not yet',
  blocks: [
    { exhibit: { type: 'table', title: 'Tailwind test', head: ['Tailwind', 'Reaches RKFL?', 'Evidence'], wide: [2], rows: [
      ['Indian truck cycle', 'Yes', `Standalone domestic revenue +20% in FY26 (₹${n0(SA[2].dom)} cr) and +20% in Q1FY27`],
      ['US truck recovery', 'Partly', `North America exports ₹${n0(EG.FY25.northAmerica)} cr (FY25) → ₹${n0(EG.FY26.northAmerica)} cr (FY26) → ₹${n0(EG.Q1FY27.northAmerica)} cr in Q1FY27 (+12% YoY)`],
      ['Railways capex (wheels, bogies, metro)', 'Yes, slowly', 'Railways 7.5% of FY26 revenue; wheel JV in trial production; ₹15 cr metro order in Q1FY27'],
      ['EVs and PV localisation', 'Early', '₹228 cr PV/EV order in Q1FY27 (4-year programme); PV to be ~10% of revenue in two years (management)'],
      ['Aerospace / semiconductor forgings', 'No (FY29+)', 'Zero order book; 8-10 quarters to meaningful revenue (management)'],
      ['China+1 sourcing by global OEMs', 'Partly', 'New export programmes cited; offset by US tariffs on Indian parts'],
    ], source: 'Investor presentations, call transcripts (May and Jul-2026), AR FY26' } },
  ],
};

module.exports = { business, history, industry, tailwind };
