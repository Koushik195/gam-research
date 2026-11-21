// Aditya Birla Capital report, part 2: what the company does, history and corporate actions, industry, tailwind test.
const X = require('./ABCAPITAL.ctx3');
const { C, SG, n0, n1, SB, part, CONS } = X;
const S26 = C.standalone.FY26, N = C.nbfc, HF = C.hfc, LI = C.life, HE = C.health, AM = C.amc;

const business = {
  id: 'business', nav: 'What the company does', kicker: 'The business', title: 'One listed lender, five partly-owned businesses around it',
  blocks: [
    { p: 'ABCL started as the Birla group\'s financial-services holding company (listed 2017). Since its main subsidiary, Aditya Birla Finance, was merged into it on 1-Apr-2025, ABCL is itself the operating NBFC: an RBI "upper layer" lender with ₹1,67,456 cr of loans in June 2026, 463 branches and a AAA rating. Around it sit the businesses it owns with partners. Grasim Industries owns 53.1% of ABCL and other promoter entities 15.7%.' },
    { exhibit: { type: 'table', title: 'What ABCL owns (June 2026)', head: ['Business', 'ABCL stake', 'Partner(s)', 'Size', 'FY26 profit (100%)', 'How we value it'], wide: [5], rows: [
      ['**NBFC (inside ABCL)**', '100%', '–', 'AUM ₹1,67,456 cr', 'PAT ₹3,001 cr', `P/B ${X.S.nbfc.multiple.base}x Sep-28E book`],
      ['Aditya Birla Housing Finance', '85.5%', 'Advent International 14.3% (Apr-2026)', 'AUM ₹51,833 cr', 'PAT ₹647 cr', `P/B ${X.S.hfc.multiple.base}x Sep-28E book`],
      ['Aditya Birla Sun Life Insurance', '51%', 'Sun Life Financial 49%', 'EV ₹15,447 cr; AUM ₹1.17 lakh cr', 'PAT ₹171 cr (statutory)', `${X.S.life.multiple.base}x embedded value`],
      ['Aditya Birla Sun Life AMC (listed)', '44.9%', 'Sun Life (co-promoter)', 'MF QAAUM ₹4.28 lakh cr', 'PAT ₹975 cr', 'Market value on 30-Sep'],
      ['Aditya Birla Health Insurance', '45.9%', 'Momentum 44.1%, ADIA 10.0%', 'GWP ₹7,292 cr', 'PAT ₹61 cr (IFRS)', `${X.S.health.multiple.base}x gross written premium`],
      ['Aditya Birla Money (listed broking)', '73.5%', 'public', 'Revenue ₹469 cr', 'PAT ₹58 cr', 'Market value'],
      ['Aditya Birla ARC; ABCD digital platform; others', '100%', '–', 'ARC book ₹489 cr', 'ABCD loss ₹264 cr', 'ARC at book; ABCD at zero'],
    ], source: 'Q1FY27 presentation p2; Annual Report FY26 AOC-1; GAM Research' } },
    { pair: [
      { type: 'hbar', title: 'Where the value sits: two-thirds of it in lending', unit: 'Share of our gross sum of the parts (%)', x: SB.parts.map(p => p.name), series: [{ name: 'Share', values: SB.parts.map(p => Math.round(p.value / SB.gross * 1000) / 10), fmt: 'pct' }], labels: 'all', source: 'GAM Research' },
      { type: 'column', title: 'Group profit before one-offs: ₹2,057 cr to ₹3,797 cr in three years', unit: 'Consolidated PAT after minorities, excluding one-offs (₹ crore); FY27-29E = GAM rebuild', x: ['FY23', 'FY24', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], series: [{ name: 'PAT', values: [2057, 2902, 3142, 3797, ...CONS.map(c => Math.round(c.pat))], fmt: 'num' }], labels: 'all', highlight: 'FY26', source: 'Q4FY23 and Q4FY26 presentations; GAM estimates' },
    ] },
    { p: `**How the money flows.** Almost all of ABCL's own profit is lending profit: interest income of ₹${n0(S26.interestIncome)} cr, fees and commission of ₹${n0(S26.fees)} cr and the AMC's dividend (₹${n0(S26.dividend)} cr) in FY26. The insurers pay no dividends; they need capital (₹750 cr into the life insurer in FY26, another ₹950 cr in July 2026, half of it from ABCL). The group reports a consolidated profit that adds its share of the housing-finance company, the life insurer, the AMC and the health insurer, less the digital platform's losses. That consolidated number (₹${n0(C.consolidated.FY26.patOwners)} cr in FY26, EPS ₹${C.consolidated.FY26.eps}) is what the street forecasts; our lender model covers the standalone company and we rebuild the consolidated figure around it.` },
    { callout: '**Why it matters for the stock:** ABCL is a lender wrapped around minority-shared insurance and asset-management stakes. Investors pay for the lender\'s growth and returns, and they apply a discount to the stakes they cannot control or cash in. That discount, not the NBFC\'s growth, has driven most of the share price over the last two years.' },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'Ten years of building, selling down and recapitalising',
  blocks: [
    { exhibit: { type: 'table', title: 'Corporate actions and what they did to the numbers', head: ['When', 'What happened', 'Impact'], wide: [1, 2], rows: C.corporateActions.map(a => [a.date, a.event, a.impact || '–']), source: 'Company filings and presentations; Business Standard, Business Today (see sources)' } },
    { p: '**What to take from it.** The group has repeatedly raised equity (₹3,000 cr in 2023, ₹4,000 cr in 2026) and sold partial stakes (AMC shares to the public, 10% of the health insurer to ADIA, 14% of the housing-finance company to Advent) to fund growth. Each sale crystallised value at a premium to book (Advent paid 2.2x post-money book), but each also left ABCL with less than full control. The merger with Aditya Birla Finance removed one layer: the lender\'s equity now sits in the listed company.' },
  ],
};

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Five industries, all growing faster than GDP, none of them easy',
  blocks: [
    { exhibit: { type: 'table', title: 'The markets ABCL competes in', head: ['Market', 'ABCL position', 'What drives it', 'The catch'], wide: [2, 3], rows: [
      ['NBFC lending (MSME, personal, corporate)', 'AUM ₹1.67 lakh cr, +28% YoY; secured MSME leader', 'Formalisation of small business credit; NBFCs grew credit faster than banks', 'Banks compete hard in prime MSME; unsecured cycles (FY24-25 clean-up); IRDAI caps on loan-linked insurance fees'],
      ['Housing finance', 'AUM ₹51,833 cr, +50%; Stage 3 0.41%', 'Affordable and mid-ticket housing, tier 2-3 demand', 'Listed HFC peers de-rated ~32% vs five-year medians; banks dominate prime home loans'],
      ['Life insurance', 'Private-sector rank ~5th; 5.3% share of private individual FYP (Q1FY27)', 'Protection gap, annuities, bank distribution', 'Surrender-value rules (FY25) and GST changes compressed margins; listed peers trade 35% below five-year P/EV medians'],
      ['Health insurance (standalone)', '16.2% share of SAHI premium (Q1FY27), fastest-growing SAHI', 'Retail health cover growing 20%+ a year', 'Medical inflation, claims ratios; combined ratio ~105%'],
      ['Asset management', 'MF QAAUM ₹4.28 lakh cr; 3.97% share', 'SIP flows, equity mix', 'Losing equity market share; fee caps; passive competition'],
    ], source: 'Q1FY27 presentation and call; GAM Research' } },
    { callout: '**Our read:** ABCL is a mid-sized player in every market except secured MSME loans and SAHI health insurance, where it is a leader. Breadth gives it cross-selling (33% of the life insurer\'s credit-life business comes from the group\'s own lenders) but not pricing power.' },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Does the sector tailwind reach ABCL? Yes in lending, partly in insurance',
  blocks: [
    { exhibit: { type: 'table', title: 'Tailwind test', head: ['Tailwind', 'Reaches ABCL?', 'Evidence'], wide: [2], rows: [
      ['Credit growth to small businesses', '**Yes**', 'MSME AUM +31% YoY to ₹95,099 cr (57% of the book); secured MSME +27%, above industry'],
      ['Falling credit costs after the unsecured clean-up', '**Yes**', 'NBFC credit cost 1.31% (FY25) → 1.03% (Q1FY27); personal-loan Stage 2+3 −230bp YoY'],
      ['Lower funding costs as rates fell in 2025', '**Partly**', 'Interest cost ÷ lending book 6.88% (FY25) → 6.52% (Q1FY27), but yields fell as fast: NIM flat'],
      ['Housing demand in smaller cities', '**Yes**', 'ABHFL disbursements +39%, AUM +50%, 50 new branches in Q1FY27'],
      ['Life-insurance shift to protection and annuities', '**Yes**', 'VNB margin 7.5% → 15.1% YoY on non-par, protection and annuity mix'],
      ['Health-insurance penetration', '**Yes in growth, not yet in profit**', 'GWP +50% YoY; combined ratio 106%'],
      ['Mutual-fund flows', '**Weakly**', 'QAAUM +6% YoY; equity share slipping'],
    ], source: 'Q1FY27 presentation and call; GAM Research' } },
  ],
};

module.exports = { business, history, industry, tailwind };
