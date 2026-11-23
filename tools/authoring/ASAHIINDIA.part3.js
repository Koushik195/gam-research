// Asahi India Glass report, part 3: automotive glass, float glass, consumer glass, Maruti (customer and promoter), moat.
const X = require('./ASAHIINDIA.ctx');
const { C, D, SA, SQ, QL, F, n0, n1, pc, seg, qEst, q1Est, A26 } = X;
const Q = C.q1fy27, PR = C.profile, FLI = D.industry.float;
const yrs = ['FY26', ...F.years];
const buildRows = (k, lbl = 'Gross revenue') => {
  const rev = [A26[k], ...seg(k).revenue], eb = [A26[k + 'Ebitda'], ...seg(k).adjEbitda];
  return [
    [lbl, ...rev.map(n0)],
    ['growth', '', ...rev.slice(1).map((v, i) => pc((v / rev[i] - 1) * 100))],
    ['EBITDA', ...eb.map(n0)],
    ['EBITDA margin', ...eb.map((v, i) => n1(v / rev[i] * 100) + '%')],
  ];
};
const head = ['₹ crore', ...yrs];
const ebitM = (k, q) => Math.round(q[k + 'Ebit'] / q[k] * 1000) / 10;

const auto = {
  id: 'auto', nav: 'Automotive glass', kicker: 'Segment: automotive glass (~60% of gross revenue)', title: 'Automotive glass: ~80% share and growing with car content; the margin is set by customers and costs',
  blocks: [
    { p: `Gross automotive revenue was ₹${n0(A26.auto)} cr in FY26 (+12.4%; external sales ₹3,369 cr, +12.7%) and ₹${n0(Q.autoGross)} cr in Q1FY27 (+${n1((Q.autoGross / Q.autoGrossQ1FY26 - 1) * 100)}%). AIS supplies every Indian car maker and supported glass for 13 model launches in FY26; laminated capacity is ~10 mn pieces and tempered ~7.5 mn car sets a year. Segment EBITDA (result + depreciation) was ${n1(A26.autoEbitda / A26.auto * 100)}% in FY26, down from ~16% in FY24-25 as depreciation, staff and new-plant costs rose (ICICI Securities: auto EBIT +1% YoY in Q4FY26). Q1FY27 segment EBIT rose to ₹${n0(Q.autoEbit)} cr (${n1(Q.autoEbit / Q.autoGross * 100)}% of gross revenue vs ${n1(Q.autoEbitQ1FY26 / Q.autoGrossQ1FY26 * 100)}%); with depreciation the EBITDA margin was ~${n1(q1Est.autoM)}% by our estimate, helped by raw glass now coming from AIS's own Soniyana line rather than imports. Brownfield work continues at Patan (phase 3 under way, phase 4 initiated), Chennai and Bawal.` },
    { pair: [
      { type: 'column', title: `Auto revenue per quarter: ₹703 cr to ₹${n0(Q.autoGross)} cr in two years`, unit: 'Gross segment revenue (₹ crore)', x: QL, series: [{ name: 'Automotive glass', values: SQ.map(q => Math.round(q.auto)), fmt: 'num' }], labels: 'all', source: 'Quarterly results, segment tables' },
      { type: 'line', title: 'Auto EBIT margin 10-14%; EBITDA ~15-17% (our estimate)', unit: '% of gross segment revenue', x: QL, series: [{ name: 'EBIT (reported)', values: SQ.map(q => ebitM('auto', q)), fmt: 'pct' }, { name: 'EBITDA (est.)', values: qEst.map(q => Math.round(q.autoM * 10) / 10), fmt: 'pct' }], labels: 'last', min: 5, max: 20, source: 'Quarterly results; EBITDA adds quarterly D&A split in the annual segment-depreciation shares (not disclosed quarterly)' },
    ] },
    { exhibit: { type: 'table', title: 'Our build: automotive glass', head, rows: buildRows('auto'), source: 'AR FY26 (FY26); GAM estimates (assumptions.json segments)' } },
    { callout: '**Our view:** auto glass grows with car output plus content: {{as.segments.0.growth.0|pct0}} in FY27E (Q1 +22%, then slower against the GST-boosted base), {{as.segments.0.growth.1|pct0}} and {{as.segments.0.growth.2|pct0}} after. We hold the EBITDA margin at {{as.segments.0.marginPct.0|pct}}, near Q1FY27 and above FY26, because in-house float glass should stick; we do not assume more, because the customers are few, large and include a shareholder.' },
  ],
};

const flt = {
  id: 'float', nav: 'Float glass', kicker: 'Segment: float glass (~31% of gross revenue)', title: 'Float glass: Soniyana doubled the profit in a year; protection and prices decide what happens next',
  blocks: [
    { p: `AIS makes float glass on three lines (${FLI.aisCapacityTpd} tonnes a day in total): Roorkee, Taloja and Soniyana (Rajasthan), commissioned in FY25 and now used fully for the auto business's raw glass. Gross float revenue was ₹${n0(A26.float)} cr in FY26 (external ₹1,262 cr; ₹${n0(C.segmentsFY26.float.internal)} cr sold to the auto business), and ₹${n0(Q.floatGross)} cr in Q1FY27 (+${n1((Q.floatGross / Q.floatGrossQ1FY26 - 1) * 100)}%). Segment EBIT went from ₹${n0(Q.floatEbitQ1FY26)} cr (Q1FY26) to ₹${n0(Q.floatEbit)} cr (Q1FY27), 21.5% of gross revenue. The history is a warning: float EBITDA margins were ${n1(SA[1].floatEbitda / SA[1].float * 100)}% in FY22 and ${n1(SA[2].floatEbitda / SA[2].float * 100)}% in FY23 when import prices were high, then ${n1(SA[3].floatEbitda / SA[3].float * 100)}% (FY24) and ${n1(SA[4].floatEbitda / SA[4].float * 100)}% (FY25) when Malaysian and Chinese glass flowed in. ICICI Securities saw architectural EBIT +133% YoY in Q4FY26. AIS does not disclose float volumes, prices or utilisation.` },
    { pair: [
      { type: 'column', title: `Float revenue per quarter: ₹300 cr (Q4FY25) to ₹${n0(Q.floatGross)} cr`, unit: 'Gross segment revenue incl. sales to auto (₹ crore)', x: QL, series: [{ name: 'Float glass', values: SQ.map(q => Math.round(q.float)), fmt: 'num' }], labels: 'all', source: 'Quarterly results, segment tables' },
      { type: 'line', title: 'Float EBIT margin: 10% in H1FY26, 21.5% in Q1FY27', unit: '% of gross segment revenue', x: QL, series: [{ name: 'EBIT (reported)', values: SQ.map(q => ebitM('float', q)), fmt: 'pct' }, { name: 'EBITDA (est.)', values: qEst.map(q => Math.round(q.floatM * 10) / 10), fmt: 'pct' }], labels: 'last', min: 0, max: 32, source: 'Quarterly results; EBITDA estimated as for auto' },
    ] },
    { exhibit: { type: 'table', title: 'Trade protection on clear float glass (to Sep-2026)', head: ['Measure', 'What it does', 'How long'], wide: [1, 2], rows: [
      ['Minimum import price (DGFT 29/2026-27)', `Imports of clear float glass 4-12 mm below ₹${n0(FLI.mipRsPerTonne)}/t CIF are restricted; one report put landed prices near ₹25,000/t`, 'One year from 18-Aug-2026'],
      ['Anti-dumping duty, Malaysia', `Malaysian suppliers shipped ${n0(FLI.malaysiaImportTonnes)} t, ${FLI.malaysiaShareOfImportsPct}% of imports, despite duties`, 'Five more years recommended (2026 sunset review)'],
      ['Duties on some Chinese and Thai glass', 'Similar measures', 'Various'],
    ], source: 'AR FY26 p28; DGFT notification as reported (18-Aug-2026)' } },
    { exhibit: { type: 'table', title: 'Our build: float glass (gross, incl. sales to auto)', head, rows: buildRows('float'), source: 'AR FY26 (FY26); GAM estimates' } },
    { callout: '**Our view:** we assume float grows {{as.segments.1.growth.0|pct0}} in FY27E (Q1 run-rate, Soniyana full, MIP support from Aug-2026) and {{as.segments.1.growth.1|pct0}} a year after, with the EBITDA margin at {{as.segments.1.marginPct.0|pct}} → {{as.segments.1.marginPct.2|pct}}: well above the FY24-25 trough (18-20%), below the FY22-23 peak. The risk is the timetable: the MIP ends in Aug-2027 unless renewed, and the ₹2,000 cr greenfield plan adds AIS\'s own capacity to a market already fighting imports.' },
  ],
};

const consumer = {
  id: 'consumer', nav: 'Consumer glass', kicker: 'Segment: consumer glass & others', title: 'Consumer glass: windows and windshield repair, small and only now profitable',
  blocks: [
    { p: `AIS Consumer Glass Solutions (AIS Windows, Glasxperts, Windshield Experts) was formed by merging four downstream subsidiaries from Jul-2025 (AIS owns 98.5%). It sells uPVC and aluminium windows, interior and façade glass through dealers and two experience centres, and repairs and replaces car glass through 151 service centres in 79 cities (cashless insurance claims). Reported "Others" gross revenue excluding other income was ₹754 cr in FY26 (incl. sales to other segments); our balancing line (Screener operating profit less auto and float EBITDA) earned ~₹${n0(A26.otherEbitda)} cr (${n1(A26.otherEbitda / A26.other * 100)}%) in FY26 and lost money in FY21-24. The chairman: "We have remained small and slow in this business… I am extremely optimistic about exponential growth of AIS-CG." We model +{{as.segments.2.growth.0|pct0}} / +{{as.segments.2.growth.1|pct0}} / +{{as.segments.2.growth.2|pct0}} at {{as.segments.2.marginPct.0|pct}}.` },
    { exhibit: { type: 'table', title: 'Our build: consumer glass & unallocated (balancing line)', head, rows: buildRows('other', 'Revenue'), source: 'Screener.in less segment notes (FY26); GAM estimates' } },
  ],
};

const maruti = {
  id: 'maruti', nav: 'Maruti: customer and owner', kicker: 'Customers', title: 'Maruti Suzuki: the biggest customer, a 10.6% shareholder and a promoter',
  blocks: [
    { p: `One customer bought ₹872.97 cr of automotive glass in FY26 (₹656.93 cr in FY25): Maruti Suzuki, which also owns 10.59% of AIS and is classified as a promoter. That is 17.5% of FY26 revenue and ~26% of external auto sales. In Q1FY27 sales to Maruti were ₹301.42 cr (21% of revenue), and shareholders approved related-party transactions with Maruti of up to ₹1,500 cr for FY27 (30% of FY26 turnover) at the 18-Sep-2026 AGM. AIS runs an on-site assembly unit inside Maruti's new Kharkhoda plant (glass goes straight to the line on returnable racks). AGC, the 21% shareholder, provides technical support; it has ~12% of the world float-glass market and ~30% of auto glass (Screener company profile).` },
    { bullets: [
      '**Good for volume:** Maruti is India\'s largest car maker and AIS is its glass partner from design to the assembly line; switching is slow and costly.',
      '**Bad for price:** a customer that owns 10.6% and approves the related-party resolution has every reason to keep glass cheap. The auto margin has stayed in a 12-18% band through every cycle.',
      '**A governance point:** shareholders, not only independent directors, must approve the Maruti transactions each year; the approval for FY27 (₹1,500 cr) is double FY26\'s actual sales, leaving room to grow.',
    ] },
  ],
};

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: a narrow moat in car glass, none in clear float glass',
  blocks: [
    { verdicts: D.moat, head: ['Dimension', 'Verdict', 'Evidence', 'So what'], title: 'Moat scorecard', source: 'GAM research compilation (annual reports FY22-FY26, results filings, broker notes)' },
    { callout: `**Verdict:** ${D.moatVerdict}` },
  ],
};

module.exports = { auto, float: flt, consumer, maruti, moat };
