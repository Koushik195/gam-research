// Solar Industries report, part 2: business, history, industry, tailwind test.
const fs = require('fs');
const path = require('path');
const X = require('./SOLARINDS.ctx');
const { C, D, A, ROOT, n0, n1, pc, rup, SRC, SA, A26, A25, Q1, defExports, volShare } = X;

// Jun-2026 quarter revenue growth for each listed peer (Screener, consolidated or standalone basis as fetched)
const q1g = sym => { const q = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')).tables.quarters; const i = q.periods.indexOf('Jun 2026'), j = q.periods.indexOf('Jun 2025'); return Math.round((q.rows.Sales[i] / q.rows.Sales[j] - 1) * 1000) / 10; };
const PG = ['SOLARINDS', 'BEL', 'HAL', 'BDL', 'PREMEXPLN'];
const g = (a, z, k) => pc((z[k] / a[k] - 1) * 100);

const business = {
  id: 'business', nav: 'What Solar does', kicker: 'The business', title: 'Explosives for mines, and now rockets, shells and drones for armies',
  blocks: [
    { p: `Solar Industries makes the explosives that break rock in coal, iron-ore and limestone mines, quarries and tunnels, and the detonators and cords that set them off ("initiating systems"). It sells **bulk explosives** (emulsions pumped into blast holes at the mine, often from trucks), **packaged explosives** (cartridges; management calls Solar the world's largest maker) and **initiating systems**. Since about 2010 it has added **defence**: high-energy materials (HMX, RDX, TNT), propellants for the Akash, Pinaka and BrahMos missiles, complete Pinaka rockets, warheads, 23-155 mm ammunition, Nagastra loitering munitions (drones that dive onto a target) and the Bhargavastra counter-drone system now in trials. The company reports one segment; its fact sheets split revenue by customer.` },
    { exhibit: { type: 'table', title: 'What Solar sells, FY26 (by customer line)', head: ['Line', 'Revenue (₹ cr)', 'Share', 'Growth', 'What it is'], wide: [4], rows: [
      ['**Domestic explosives**', `**${n0(A26.domestic)}**`, `**${Math.round(X.share(A26, 'domestic'))}%**`, `**${g(A25, A26, 'domestic')}**`, ''],
      ['  Coal India (CIL)', n0(A26.cil), `${Math.round(X.share(A26, 'cil'))}%`, g(A25, A26, 'cil'), 'Bulk explosives for CIL\'s open-cast coal mines, bought by tender (Solar ~20-23% of CIL\'s purchases)'],
      ['  Non-CIL & institutional', n0(A26.nonCil), `${Math.round(X.share(A26, 'nonCil'))}%`, g(A25, A26, 'nonCil'), 'Singareni, captive and commercial coal mines, iron ore, limestone, other miners'],
      ['  Housing & infrastructure', n0(A26.housingInfra), `${Math.round(X.share(A26, 'housingInfra'))}%`, g(A25, A26, 'housingInfra'), 'Packaged explosives and detonators through dealers for quarries, roads, tunnels, dams'],
      ['**International**', `**${n0(A26.intl)}**`, `**${Math.round(X.share(A26, 'intl'))}%**`, `**${g(A25, A26, 'intl')}**`, 'Exports from India plus plants in Africa (Zambia, South Africa, Nigeria, Ghana, Tanzania, Zimbabwe), Turkey, Kazakhstan, South-East Asia'],
      ['**Defence**', `**${n0(A26.defence)}**`, `**${Math.round(X.share(A26, 'defence'))}%**`, `**${g(A25, A26, 'defence')}**`, 'High-energy materials, propellants, Pinaka rockets, warheads, ammunition, drones; India and export customers'],
      ['Others', n0(A26.others), '0%', g(A25, A26, 'others'), ''],
      { hl: true, cells: ['**Total**', `**${n0(A26.total)}**`, '**100%**', `**${g(A25, A26, 'total')}**`, ''] },
    ], source: 'Q4FY26 fact sheet (15-May-2026)' } },
    { pair: [
      { type: 'hbar', title: 'By customer, defence was 27% of FY26 revenue', unit: 'FY26 revenue by customer line (₹ crore)', x: ['International', 'Defence', 'Non-CIL & institutional', 'Housing & infra', 'Coal India'], series: [{ name: 'Revenue', values: [A26.intl, A26.defence, A26.nonCil, A26.housingInfra, A26.cil], fmt: 'num' }], labels: 'all', highlight: 'Defence', source: 'Q4FY26 fact sheet' },
      { type: 'hbar', title: 'By product, defence was 42%', unit: 'Product-wise revenue mix (%)', x: ['Explosives FY26', 'Initiating systems FY26', 'Defence FY26', 'Explosives FY25', 'Initiating systems FY25', 'Defence FY25'], series: [{ name: 'Share', values: [47, 11, 42, 59, 13, 28], fmt: 'pct0' }], labels: 'all', highlight: 'Defence FY26', source: 'AR FY26, MD&A ("Product-Wise Revenue Mix" chart)' },
    ] },
    { callout: `**Why two numbers for defence?** The fact sheet counts sales "to defence customers" (₹${n0(A26.defence)} cr, 27%); the annual report's product chart counts "defence products" (42%, roughly ₹4,100 cr). The likely difference is defence products sold abroad being booked under "International". Either way, Solar is more of a defence company than its customer split suggests, and more of an exporter: ${Math.round(A26.geoOutside / (A26.geoIndia + A26.geoOutside) * 100)}% of FY26 revenue came from customers outside India.` },
    { exhibit: { type: 'table', title: 'Reach and assets', head: ['', 'Detail'], wide: [1], rows: [
      ['Plants', 'Core complex at Nagpur (packaged explosives, initiating systems, defence); new explosives plants at Dhule (West India, commissioned) and in North India (acquired), Dholpur expansion; Odisha and Telangana/Andhra Pradesh next. Manufacturing in 11 countries; Australia and Sierra Leone starting'],
      ['Customers', `Coal India (₹964 cr, ~10% of revenue, the only customer above 10%), Singareni, private and captive miners, dealers for quarries and infrastructure; Indian Army and MoD (Pinaka); export defence customers; miners in 90+ countries`],
      ['Defence subsidiary', 'Solar Defence and Aerospace Ltd (formerly Economic Explosives): FY26 turnover ₹1,577 cr, pre-tax profit ₹474 cr (30% margin), 20% of group profit'],
      ['Backward integration', 'Emulsifiers, detonator shells, PETN, TNT and RDX made in-house (MOFSL); ammonium nitrate is bought (Solar is India\'s largest AN consumer, PL)'],
      ['People', `${n0(C.profile.employeesStandalone)} permanent employees in the parent company (AR FY26); 3,500+ more would come with Omnia`],
    ], source: 'AR FY26; Q4FY26 call; MOFSL and PL initiations (Sep-2026)' } },
    { exhibit: { type: 'table', title: 'Largest subsidiaries, FY26 (₹ crore)', head: ['Subsidiary', 'Turnover', 'Net profit', 'Note'], wide: [3], rows: C.subsidiariesFy26.map(s => [s.name, n0(s.turnover), n0(s.pat), s.note || '']), source: rup(C.subsidiariesSrc) } },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'From a Nagpur cartridge maker (1995) to a global explosives and defence group',
  blocks: [
    { exhibit: { type: 'table', title: 'Key events and what they did to the numbers', head: ['When', 'Event', 'Impact'], wide: [1, 2], rows: C.history.map(h => [h.when, rup(h.event), rup(h.impact) || '–']), source: 'AR FY26; Solar calls (May-2026, Sep-2026); ICRA (Feb-2025); broker notes' } },
    { callout: '**Corporate actions and per-share data:** no bonus, split, buyback or equity raise in FY15-FY27 to date; 9.049 cr shares of ₹2. Per-share data need no restatement. Management has ruled out issuing equity for Omnia. The one capital event that changes the numbers is Omnia itself: if completed (expected early-to-mid 2027), it would roughly double revenue from FY28 at a ~20% group EBITDA margin and add ₹10,000-11,000 cr of debt.' },
  ],
};

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Two industries: a slow-growing, price-led explosives market and a fast-growing defence market',
  blocks: [
    { p: `India produced about ${n1(SA.find(a => a.fy === 'FY25').industryKt / 1000)} million tonnes of commercial explosives in FY25, up from ${n1(SA.find(a => a.fy === 'FY20').industryKt / 1000)} million in FY20 (~9% a year, PESO data via MOFSL). Mining, mostly coal, takes a substantial share (AR FY26); the rest goes to quarries, roads, tunnels and dams. Demand follows overburden removal (the rock stripped to reach coal) more than coal output itself. FY26 was weak: coal output was "quite muted" at 1,036 mt as heavy rain cut Coal India and Singareni production, though captive and commercial mines grew 10%. Explosives are sold largely by tender, so suppliers compete on cost, and ammonium nitrate (the main input) is passed on with a lag.` },
    { p: 'Defence is a different market. India\'s defence capital spending is expected to grow ~16% a year for four years and private companies\' share of listed defence revenue rose from 9% to 16% over FY23-26 (Jefferies). Abroad, wars in Europe and West Asia have created a shortage of artillery shells, rockets and explosives, with demand visibility of 5-7 years (AR FY26). Solar sits at the intersection: it makes the energetic materials every munition needs and is integrating up into complete rockets and drones.' },
    { exhibit: { type: 'table', title: 'Forces acting on Solar\'s markets (as of 30-Sep-2026)', head: ['Theme', 'Direction', 'What it means for Solar'], wide: [2], rows: D.industry.themes.map(r => r.map(rup)), source: D.industry.src } },
    { pair: [
      { type: 'column', title: 'Solar\'s domestic volume share rose from ~23% to ~26%', unit: 'Solar domestic explosives volume ÷ India production (%)', x: volShare.map(v => v.fy), series: [{ name: 'Share', values: volShare.map(v => Math.round(v.pct * 10) / 10), fmt: 'pct' }], labels: 'all', min: 0, max: 30, source: 'Company year-end decks (volumes); PESO production via MOFSL; GAM calculation' },
      { type: 'hbar', title: 'Jun-2026 quarter: Solar +70%, behind only BDL\'s low-base rebound', unit: 'Revenue growth, Jun-2026 quarter, year on year (%)', x: PG.map(X.shortName), series: [{ name: 'Growth', values: PG.map(q1g), fmt: 'pct' }], labels: 'all', highlight: 'Solar Industries', source: 'Screener.in quarterly results (BDL standalone)' },
    ] },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Tailwind test: Solar captures the defence and export tailwinds; domestic mining has not helped',
  blocks: [
    { verdicts: [
      ['Indian defence indigenisation', 'Yes', `Pinaka rockets (~₹6,000 cr order), propellants and explosives for Indian missiles; first private firm to dispatch Pinaka Enhanced Mk-I.`, 'Domestic defence is a smaller part of defence revenue than exports, but it anchors credibility.'],
      ['Global ammunition shortage', 'Yes', `~₹11,000 cr of international defence orders in the book; we infer ~₹${n0(Math.round(defExports / 100) * 100)} cr of FY26 defence revenue was exported.`, 'The biggest driver, and the most cyclical.'],
      ['Coal and mining growth in India', 'No (FY26)', 'Domestic explosives +3% in FY26; CIL revenue −4%; overburden removal fell. Q1FY27 +52% includes price.', 'Steady, not a growth engine.'],
      ['Infrastructure and housing', 'Partly', `Housing & infra ₹${n0(A26.housingInfra)} cr, +3% in FY26 after +4% in FY25; Q4FY26 +25%.`, 'Recovering from a weak base.'],
      ['Mining abroad (Africa, Turkey, Asia)', 'Yes', `International +32% in FY26, +65% in Q1FY27; new plants in Zimbabwe, Kazakhstan, Ghana.`, 'Real share gains, now to be supercharged (and diluted) by Omnia.'],
      ['Input-cost cycle (ammonium nitrate)', 'Mixed', 'Price rises lift revenue (18-20% of FY27 explosives growth) but pass-through is partial (~60%).', 'A revenue tailwind, a margin headwind.'],
      ['Electronic detonators (2025 rule change)', 'Probably', 'Electric detonators banned from Jul-2025; Solar makes electronic systems and Omnia owns the AXXIS brand.', 'Mix upgrade in initiating systems.'],
    ], head: ['Industry tailwind', 'Captured?', 'Evidence', 'So what'], title: 'Tailwind test', source: SRC },
  ],
};

module.exports = { business, history, industry, tailwind };
