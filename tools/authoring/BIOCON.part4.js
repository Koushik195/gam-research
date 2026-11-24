// Biocon report, part 4: competitive advantage scorecard, Q1FY27 results and what management guided.
const X = require('./BIOCON.ctx');
const { C, D, F, A, AS, n0, n1, pc, rup, SG } = X;
const Q1 = C.q1fy27;

const moat = {
  id: 'moat', nav: 'Moat', kicker: 'Competitive advantage', title: 'Moat: narrow but real in biologic manufacturing and insulin; none in pricing; not yet visible in returns',
  blocks: [
    { exhibit: { type: 'table', title: 'Competitive advantage scorecard (0 = none, 5 = very strong)', head: ['Source', 'Score', 'Evidence'], wide: [2], rows: D.moat.map(m => [m.factor, `${m.score} / 5`, rup(m.evidence)]), source: 'Company presentations and calls; Screener.in; GAM Research' } },
    { p: 'The best evidence of an advantage is durability: Biocon\'s US pegfilgrastim and trastuzumab still hold 20-25% shares seven and more years after launch, and its glargine is the only biosimilar insulin in the US. Those positions come from reliable supply of hard-to-make products, not from patents. The weakest evidence is returns: ROCE has been 4-6% since the Viatris deal, so the advantage has not yet covered the price paid for scale. Competition is getting stronger: Sandoz, Amgen, Celltrion, Samsung Bioepis, Teva/Alvotech and, in insulin, Chinese makers partnering with European companies (CEO, Q4FY26 call).' },
    { callout: `**Verdict:** ${rup(D.moatVerdict)} It justifies valuing biosimilars at a premium to generics, not at a premium to the market.` },
  ],
};

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & guidance', kicker: 'Latest quarter and guidance', title: 'Q1FY27: revenue in line, EBITDA 16% below MOSL; the second half has to do the work',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (₹ crore)', head: ['', 'Q1FY27', 'Q1FY26', 'YoY', 'Q4FY26', 'What happened'], wide: [5], rows: [
      ['Biosimilars revenue', '2,855', '2,458', '+16%', '2,756', 'North America (denosumab ramp, oncology stable); ~10 points of the growth is the rupee'],
      ['Generics revenue', '760', '630', '+21%', '776', 'Liraglutide in the US and other markets (single digits of the segment)'],
      ['Services (Syngene) revenue', '736', '875', '−16%', '1,037', 'Lower offtake from a key biologics client; forex hedge loss'],
      { hl: true, cells: ['**Revenue from operations**', '**4,336**', '**3,942**', '**+10%**', '**4,517**', 'MOSL expected ₹4,589 cr'] },
      ['EBITDA before other income (Screener)', '847', '766', '+11%', '1,020', 'Margin 19.5%, flat YoY; MOSL expected ₹1,005 cr'],
      ['Company EBITDA (incl. other income)', '902', '846', '+7%', '1,073', 'Other income ₹55 cr vs ₹80 cr'],
      ['Interest', '213', '277', '−23%', '232', 'Structured debt retired with the Jun-2025 QIP'],
      ['Depreciation and amortisation', '548', '455', '+20%', '513', 'Launch intangibles amortised; plants capitalised'],
      ['Net profit before exceptional items', '145', '42', '+245%', '179', 'Tax credit (−₹6 cr on ₹141 cr of PBT)'],
      ['Net profit (reported, attributable)', '141', '31', '+355%', '126', 'Exceptional −₹13 cr (termination benefits)'],
    ], source: 'Q1FY27 press release and fact sheet (5-Aug-2026); MOSL 6-Aug-2026 (estimates)' } },
    { h: 'What management said (Q1FY27 call, 6-Aug-2026)' },
    { exhibit: { type: 'table', title: 'Call takeaways and our read', head: ['Management said', 'Our read'], wide: [0, 1], rows: C.call.points.map((p, i) => [rup(p), ['Second-half acceleration is the whole FY27 case; we model ~₹970 cr of EBITDA a quarter in Q2-Q4.', 'Capacity is no longer the constraint; demand and pricing are.', 'Three of the launches face established rivals; Yesafili\'s interchangeability helps in pharmacies but most aflibercept is a hospital drug.', 'Contract wins would show up from Jan-2027.', 'We use 25% for FY27E: the normalised level, not the 27% of FY26.', 'Real progress, partly from cutting R&D: a lower R&D budget also means fewer future launches.', 'We assume −8% in FY27E and 18% margin; the stake is valued at market anyway.', 'Inventory build is consistent with launches but also with slower sell-through; watch Q2.', 'Policy risk is not in our numbers; a tariff on biosimilars would hit ~47% of revenue.', 'A sale (~₹985 cr at 30-Sep) would cut net debt by ~9%.'][i] || '']), source: 'Q1FY27 earnings call transcript; GAM Research' } },
    { p: `**Guidance in numbers is thin.** Biocon does not give revenue or EBITDA targets. What it has said: growth "to accelerate through the year" with a stronger second half; biosimilars margin "mid-20s" and rising; generics margins expanding; Syngene down single digits in rupees in FY27 and back to growth in FY28; lower capex; free cash to debt. MOSL reads the consolidated margin aspiration as ~24-25% on the company basis (incl. other income), which would be ~₹4,700 cr of company EBITDA on our FY27E revenue, against our ₹${n0(F.ebitda[0])} cr before other income (≈₹${n0(F.ebitda[0] + 220)} cr on the company basis). We think that aspiration needs both a fast launch ramp and a Syngene recovery in the same year.` },
    { callout: '**So what:** Q1 was a soft start: revenue in line, profit helped by a tax credit, EBITDA well below the street, and net debt up ~₹1,100 cr for inventory. FY27 now hangs on three quarters of acceleration. We build in a ramp, but less than the company implies.' },
  ],
};

module.exports = { moat, guidance };
