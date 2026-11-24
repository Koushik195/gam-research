// Ajanta Pharma report, part 3: India branded, Asia & Africa (branded and institutional), US generics, competitive advantage.
const X = require('./AJANTPHARM.ctx');
const { C, D, F, n0, n1, pc, SA, SQ, QL, Q1, FY26, BL, build, YRS, mixPct } = X;
const g = (a, z) => pc((z / a - 1) * 100);

const india = {
  id: 'india', nav: 'India branded', kicker: 'Segment: India', title: 'India (30% of sales): eye, skin, heart and pain niches, first-to-market launches, growing 1.4x the market; cardiology is the soft spot',
  blocks: [
    { p: `Ajanta's India business sold ₹${n0(FY26.india)} cr in FY26 (+${n1(FY26.growth.india)}%) and ₹${Q1.india} cr in Q1FY27 (+24%). It is a speciality, chronic franchise: ${Q1.chronicPct}% of sales are chronic, only ${Q1.nlemPct}% are under price control, the top ten brands make ${Q1.top10Pct}% and ${Q1.brands25cr} brands sell more than ₹25 cr a year. Ophthalmology is its strongest position: #2 in the IPM and #1 in its covered market (eye drops such as Soft Drops, Bimat and Nepaflam); dermatology climbed from #16 to #13 in a year (Melacare, Salisia KT); in cardiology (Met XL, Cinod), its biggest therapy at 37% of India sales, it is #17. It launched 26 products in FY26, five of them first to market, and 8 in Q1FY27. The field force is ${n0(Q1.mrsIndia)} reps (about 300 added in FY26, 250-300 more planned in FY27); productivity (PCPM) was ₹3.7 lakh a month in FY26 and ~₹4.5 lakh in Q1FY27 (management), with a ₹4-4.5 lakh steady-state target. Gynaecology and nephrology, entered in FY26, were ~2% of India sales in Q1FY27; trade generics (unbranded) were only ₹${Q1.tradeGenerics} cr in the quarter.` },
    { pair: [
      { type: 'hbar', title: 'India sales by therapy, Q1FY27', unit: '% of India branded sales', x: ['Cardiology', 'Ophthalmology', 'Dermatology', 'Pain', 'Gynaecology', 'Nephrology'], series: [{ name: 'Share', values: [Q1.therapyMix.cardiac, Q1.therapyMix.ophthal, Q1.therapyMix.derma, Q1.therapyMix.pain, Q1.therapyMix.gynaec, Q1.therapyMix.nephro], fmt: 'pct0' }], labels: 'all', highlight: 'Ophthalmology', source: 'Q1FY27 presentation; BOBCAPS (30-Jul-2026)' },
      { type: 'column', title: 'India: ₹769 cr (FY20) to ₹1,654 cr (FY26)', unit: 'India branded sales (₹ crore); FY27-29E = GAM', x: [...SA.map(s => s.fy), ...YRS], series: [{ name: 'India', values: [...SA.map(s => Math.round(s.india)), ...build.india.map(Math.round)], fmt: 'num' }], labels: 'all', highlight: 'FY26', source: 'ICICI Direct (FY20-23); company (FY24-26); GAM' },
    ] },
    { exhibit: { type: 'table', title: 'India: what we model and why', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E', 'Why'], wide: [5], rows: [
      ['India sales (₹ cr)', n0(FY26.india), ...build.india.map(n0), 'Q1 +24% partly from a soft base; mid-teens guided'],
      ['Growth', `+${n1(FY26.growth.india)}%`, ...BL.growth.india.map(v => `+${v}%`), 'IQVIA ~1.4x IPM; IPM ~10-11%; new therapies add 1-2pp'],
      ['Share of group revenue', '30%', ...mixPct('india').map(v => n1(v) + '%'), 'Rises as the US normalises'],
    ], source: 'Company; GAM (AJANTPHARM.ctx.js checks the build against model revenue)' } },
    { callout: '**Our view:** this is Ajanta\'s best business: sticky chronic prescriptions in niches where it leads, little price control and a launch engine that keeps refreshing the portfolio. The risk is concentration: the two therapies it leads (ophthal, derma) are small pools, and in the big one (cardiology) it is losing share on IQVIA data. If the "data capture" explanation is wrong, India growth settles nearer 11-12% than 15%.' },
  ],
};

const emerging = {
  id: 'emerging', nav: 'Asia & Africa', kicker: 'Segment: emerging markets', title: 'Asia and Africa (41% of sales incl. tenders): Africa is booming, Asia is stuck behind the Middle East war, tenders are lumpy',
  blocks: [
    { p: `Ajanta sells branded generics in about 32 emerging markets with its own field forces (~2,300 reps outside India), 220+ products and eight therapies. **Africa branded** (₹${n0(FY26.africa)} cr, +${n1(FY26.growth.africa)}% in FY26; ₹${Q1.africa} cr in Q1FY27, +29%) is growing far faster than its 7-12% market on launches (8 in FY26, 3 in Q1) and new countries. **Asia branded** (₹${n0(FY26.asia)} cr, ${n1(FY26.growth.asia)}%) stalled: the war in the Middle East that began at the end of Feb-2026 disrupted shipping (sea freight rerouted, costs up), so Q4FY26 fell 10% and Q1FY27 16% to ₹${Q1.asia} cr. Management says the orders were delayed, not lost, expects Q2FY27 to be "elevated" and cut its FY27 Asia guidance from high teens to mid-to-high teens. **Africa institutional** (₹${n0(FY26.inst)} cr) sells anti-malarials to aid agencies; it fell from ₹249 cr in FY24 to ₹147 cr in FY25 and recovered to ₹160 cr in FY26 and ₹${Q1.inst} cr in Q1FY27. The Biocon licence (23-Dec-2025) gives Ajanta semaglutide for 23 of these countries exclusively (3 semi-exclusive) once approved, which management expects in ~1.5-2 years.` },
    { pair: [
      { type: 'line', title: 'Asia falls, Africa rises', unit: '₹ crore, quarterly (Africa = branded + institutional before Q3FY25)', x: QL, series: [{ name: 'Asia branded', values: SQ.map(q => q.asia), fmt: 'num' }, { name: 'Africa branded + institutional', values: SQ.map(q => q.africaTotal), fmt: 'num' }], labels: 'last', source: 'Company press releases; MOSL (Q1-Q2FY25)' },
      { type: 'column', title: 'Africa institutional: lumpy tender income', unit: '₹ crore', x: ['FY24', 'FY25', 'FY26', 'Q1FY26', 'Q1FY27'], series: [{ name: 'Institutional', values: [249, 147, Math.round(FY26.inst), Q1.instPrev, Q1.inst], fmt: 'num' }], labels: 'all', source: 'Q1FY27 presentation; AR FY26' },
    ] },
    { exhibit: { type: 'table', title: 'Emerging markets: what we model', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E', 'Why'], wide: [5], rows: [
      ['Asia branded (₹ cr)', n0(FY26.asia), ...build.asia.map(n0), `Growth ${BL.growth.asia.join(' / ')}%: Q2 catch-up, but the war had not ended by 30-Sep; guidance mid-to-high teens`],
      ['Africa branded (₹ cr)', n0(FY26.africa), ...build.africa.map(n0), `Growth ${BL.growth.africa.join(' / ')}%: guidance high double digit; Q1 +29%`],
      ['Africa institutional (₹ cr)', n0(FY26.inst), ...build.inst.map(n0), `Growth ${BL.growth.inst.join(' / ')}%: Q1 strong; tenders depend on donor budgets`],
    ], source: 'Company; GAM' } },
    { callout: '**Our view:** Africa branded is the most underrated part of Ajanta: double-digit growth for three years with few Indian competitors on the ground. Asia is a genuine near-term problem: management\'s guidance assumes the war-related disruption eases, which we cannot assume on 30-Sep-2026. Tenders we treat as flat after FY27; they are small (3% of sales) but swing the quarterly numbers.' },
  ],
};

const us = {
  id: 'us', nav: 'US generics', kicker: 'Segment: US', title: 'US generics (29% of sales): +49% in FY26 on launches and a flu season; management guides mid-single digit, and we think FY26 was the peak growth year',
  blocks: [
    { p: `US sales rose from ₹${n0(SA.find(s => s.fy === 'FY24').us)} cr in FY24 to ₹${n0(FY26.us)} cr in FY26 (+${n1(FY26.growth.us)}% in FY26), driven by eight launches in 15 months, share gains with wholesalers and a strong seasonal flu product in Q4FY26 (₹505 cr, the record quarter). Q1FY27 was ₹${Q1.us} cr (+57% YoY), but US$${Q1.usUsdMn} mn was 7% below Q4 in dollars (PL); the rupee did the rest. Management guides mid-single to upper-mid-single-digit growth for FY27 in constant currency, expects price erosion and share loss, has no launches planned for Q2-Q3, and cut the FY27 filing plan to 5-7 ANDAs (8-12 in the annual report). The pipeline: ${Q1.anda.commercialised} products on the shelf, ${Q1.anda.pending} awaiting approval, ${Q1.anda.tentative} tentative approvals. Regulatory status is clean: the Paithan plant's Apr-2026 inspection (five observations) closed as VAI in Jul-2026; generics are exempt from US Section 232 tariffs until Apr-2027.` },
    { pair: [
      { type: 'column', title: 'US sales by quarter: the surge and the plateau', unit: 'US generics (₹ crore)', x: QL, series: [{ name: 'US', values: SQ.map(q => Math.round(q.us)), fmt: 'num' }], labels: 'all', highlight: 'Q4FY26', source: 'Company press releases; MOSL (Q1-Q2FY25)' },
      { type: 'column', title: 'Our US path: +14% in FY27E, then +4%', unit: 'US generics (₹ crore); FY27-29E = GAM', x: ['FY23', 'FY24', 'FY25', 'FY26', ...YRS], series: [{ name: 'US', values: [827, 964, 1047, Math.round(FY26.us), ...build.us.map(Math.round)], fmt: 'num' }], labels: 'all', highlight: 'FY26', source: 'ICICI Direct; company; GAM' },
    ] },
    { exhibit: { type: 'table', title: 'US: the arithmetic of FY27E', head: ['', 'Value', 'Note'], wide: [2], rows: [
      ['FY26 US sales', `₹${n0(FY26.us)} cr`, 'Q1-Q4: ₹310 / 343 / 399 / 505 cr'],
      ['Q1FY27 actual', `₹${Q1.us} cr`, `US$${Q1.usUsdMn} mn (−7% QoQ in dollars)`],
      ['Our FY27E', `₹${n0(build.us[0])} cr (+${BL.growth.us[0]}%)`, `Q2-Q4 average ₹${n0((build.us[0] - Q1.us) / 3)} cr, +${n1(((build.us[0] - Q1.us) / (FY26.us - 310) - 1) * 100)}% on FY26's Q2-Q4`],
      ['Guidance', 'Mid-single digit (constant currency)', 'Plus a weaker rupee (~₹95/$ in Q1FY27 vs ~₹92 in Q4FY26)'],
      ['FY28E / FY29E', `+${BL.growth.us[1]}% / +${BL.growth.us[2]}%`, 'Erosion on recent launches offsets the 4-5 launches planned from Q4FY27'],
    ], source: 'Company; PL (31-Jul-2026); GAM' } },
    { callout: '**Our view:** Ajanta is a good US operator (supplier awards, clean plants) in a business with no pricing power. FY26 combined a launch wave, a flu season and a falling rupee; FY27 has none of the first two after Q1, and the filing pace has slowed. We are below MOSL and BOBCAPS on US growth beyond FY27 and think the street\'s 16-21% a year FY26-28 profit growth (MOSL, PL, ICICI Direct) is too dependent on the US holding up.' },
  ],
};

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: a narrow moat in branded niches and emerging-market reach; none in US generics',
  blocks: [
    { exhibit: { type: 'table', title: 'Moat scorecard', head: ['Source', 'Evidence', 'Strength'], wide: [1], rows: D.moat.map(([s, e, w]) => [s, e, `**${w}**`]), source: 'GAM Research, from company filings, IQVIA data via company presentations, CARE and calls' } },
    { exhibit: { type: 'table', title: 'Returns: the moat shows up in ROCE', head: ['', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26', 'FY27E'], rows: [
      ['ROCE (Screener / GAM on equity)', ...['FY22', 'FY23', 'FY24', 'FY25', 'FY26'].map(f => X.A.roce[X.ix(f)] + '%'), '{{F.roce.0|pct}}'],
      ['ROE', ...['FY22', 'FY23', 'FY24', 'FY25', 'FY26'].map(f => n1(X.A.roe[X.ix(f)]) + '%'), '{{F.roe.0|pct}}'],
      ['Gross margin', '–', '–', '–', '77.0%', '78.3%', '~78-80%'],
    ], source: 'Screener.in; ICICI Direct; GAM' } },
    { callout: `**Verdict:** ${D.moatVerdict} The proof is in returns (ROCE 29-35% in four of the last five years with net cash) rather than in scale.` },
  ],
};

module.exports = { india, emerging, us, moat };
