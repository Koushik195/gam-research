// GNFC report, part B-3: industry (TDI, bulk chemicals and the war), tailwind test, chemicals segment.
const X = require('./GNFC.ctx');
const { SA, SQ, QL, FYS, A26, A25, A24, Q1, n0, n1, SRC, F, sep28 } = X;
const A5 = SA.filter(a => a.tdiPx != null);
const Q5 = SQ.filter(q => q.aceticPx != null);

// ---------------------------------------------------------------- Industry
const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'China sets the price of almost everything GNFC sells; the war lifted it for now',
  blocks: [
    { p: 'GNFC\'s chemicals are commodities. TDI, aniline, acetic acid and methanol trade at one Asian price, and China, with plants several times GNFC\'s size running on cheap coal, is the marginal supplier. GNFC prices at import parity (the landed cost of imports, including any anti-dumping duty), so its realisations rise and fall with Chinese prices and the rupee. Between FY22 and FY26 its TDI price fell from ₹229k a tonne (FY23) to ₹173k, its aniline-benzene spread from ₹77k to ₹44k and its acetic acid-methanol spread from ₹45k (FY22) to ₹7k. Then the US-Iran war, from late February 2026, disrupted Gulf supply and shipping: TDI jumped to ₹255k a tonne in Q1FY27 and every spread GNFC tracks widened, while fuel oil (+76% QoQ) and gas (+64%) costs also jumped.' },
    { exhibit: { type: 'table', title: 'What is moving (evidence to 30-Sep-2026)', head: ['Theme', 'Direction', 'Evidence'], wide: [2], rows: [
      ['Global TDI supply', 'Headwind', 'GNFC\'s marketing head (Aug-2026): "globally TDI production is quite high against the demand"; one-month outages at Covestro and Wanhua "will not affect the overall pricing".'],
      ['War premium', 'Tailwind (temporary)', 'Brent US$102.6 on 29-Sep-2026, up ~14% in September; China TDI guidance raised to RMB17,200/t (8-Sep) and Wanhua +US$300/t for South Asia (14-Sep). The same war raised GNFC\'s oil and gas costs.'],
      ['Indian TDI demand', 'Tailwind (slow)', '~1 lakh t of flexible foam plus 10-15 kt in system houses, growing ~10% a year; imports up from 33 kt (FY19) to 73 kt (FY25). GNFC sells ~60% of the market from 67 KTPA.'],
      ['Trade protection', 'Support', 'TDI duty on EU/Saudi imports renewed for five years (Feb-2026, US$102-344/t); on China/Japan/Korea (US$150-440/t) it expires in Sep-2027 unless renewed. Aniline duty runs to mid-2030 but is small (US$37/t for Wanhua).'],
      ['Aniline, acetic acid, methanol', 'Headwind', 'Aniline imports rose from 88 kt (FY19) to 279 kt (FY26); GNFC now makes aniline mainly as job work. Acetic acid spread ₹7k/t in FY26; methanol plants idle because gas is too dear. China removed export-tax rebates on acetic acid (Feb-2026 call).'],
      ['Ammonium nitrate', 'Tailwind', 'Demand +6-7% a year from coal mining; imports ~4-4.5 lakh t; GNFC, Chambal and Deepak all adding capacity (May-2026 call).'],
    ], source: 'GNFC calls (Feb, May, Aug 2026) and decks; Ventura Securities (30-Sep-2026); SunSirs (9 and 15-Sep-2026); CBIC Notification 03/2026-Customs (ADD); ICIS (Oct-2022)' } },
    { pair: [
      { type: 'column', title: 'TDI-toluene spread: ₹140k (FY23) to ₹93-102k (FY24-26)', unit: 'Annual average spread (₹ \'000 per tonne)', x: A5.map(a => a.fy), series: [{ name: 'TDI − toluene', values: A5.map(a => a.tdiSpread), fmt: 'num' }], labels: 'all', source: 'GNFC Q4FY26 deck p23' },
      { type: 'line', title: 'Acetic acid and aniline spreads collapsed, then spiked in Q1FY27', unit: 'Spread (₹ \'000 per tonne)', x: Q5.map(q => q.q), series: [{ name: 'Aniline − benzene', values: Q5.map(q => q.anilineSpread), fmt: 'num' }, { name: 'Acetic acid − methanol', values: Q5.map(q => q.aceticSpread), fmt: 'num' }], labels: 'all', min: 0, max: 80, source: 'GNFC Q1FY27 deck p8-9' },
    ] },
    { callout: '**So what:** this is a cyclical commodity business sitting under a structural Chinese overhang. The war has pushed prices up, but GNFC itself says global TDI capacity exceeds demand. When the war premium fades, prices revert towards Chinese cash costs, as they did in FY24-25. We treat the Q4FY26-Q1FY27 margins as a spike, not a new level.' },
  ],
};

// ---------------------------------------------------------------- Tailwind test
const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Tailwind test: GNFC captures shocks, not structural growth',
  blocks: [
    { verdicts: [
      ['War-time chemical prices', 'Yes, for now', `Chemicals EBIT ₹463 cr in Q4FY26 and ₹${n0(Q1.segments.chem[1])} cr in Q1FY27, vs ₹136-158 cr a quarter before.`, 'Large but temporary; it can reverse as fast ("it can go either side").'],
      ['Indian TDI demand (~10% a year)', 'Partly', 'GNFC already runs TDI at ~80% (the global norm); no TDI expansion is planned; extra demand is met by imports.', 'GNFC gets the price, not the volume.'],
      ['Mining and explosives (ammonium nitrate)', 'From mid-2027', 'AN melt-II (163 KTPA) and WNA-III (200 KTPA) due mid-2027; management: +₹1,200-1,500 cr revenue, +₹500-600 cr contribution at current prices.', 'The one real volume growth driver.'],
      ['Coal over gas (energy cost)', 'Yes', 'CCPP steam running by Aug-2026 saves ₹30-40k per tonne of TDI-II at current prices (~₹80-120 cr a year); GMDC coal-gasification study.', 'Lowers costs; does not change who sets the price.'],
      ['Urea policy reform', 'Partly', 'Energy norm 6.20 → 6.37 Gcal/t (~₹49 cr a year plus ~₹61 cr arrears); fixed-cost revision still pending.', 'Losses shrink; the segment still loses money.'],
      ['Trade protection ("China+1")', 'Partly', 'TDI duties renewed (EU/Saudi to 2031); China/Japan/Korea duty expires Sep-2027; aniline uneconomic despite duties.', 'Supports TDI pricing at the margin.'],
    ], head: ['Tailwind', 'Captured?', 'Evidence', 'So what'], title: 'Tailwind test', source: SRC },
  ],
};

// ---------------------------------------------------------------- Chemicals
const chemicals = {
  id: 'chemicals', nav: 'Chemicals: the earner', kicker: 'Segment', title: 'Chemicals: a good TDI franchise in a bad neighbourhood, now enjoying a war',
  blocks: [
    { p: `Chemicals earned ₹${n0(A26.chemEbit)} cr of EBIT on ₹${n0(A26.chemRev)} cr of revenue in FY26 (${n1(A26.chemMargin)}%), but ₹463 cr of that came in the war-hit March quarter; the first nine months earned ₹450 cr (13.2%), close to FY24-25 (11.5-13.6%). TDI is the core: GNFC is the only producer in South Asia, makes ~57 kt a year across two plants (TDI-II at 77% utilisation in FY26) and sells ~60% of India's needs. In Q1FY27 revenue rose to ₹${n0(Q1.segments.chem[0])} cr and EBIT to ₹${n0(Q1.segments.chem[1])} cr (${n1(Q1.segments.chem[1] / Q1.segments.chem[0] * 100)}%) on record prices, even though acetic acid (6-May to 1-Aug), ethyl acetate and part of TDI were shut because the feedstock cost more than the product was worth, and sales lagged production so inventory built up.` },
    { pair: [
      { type: 'column', title: 'Chemicals EBIT by quarter: ₹136 cr to ₹463 cr', unit: 'Chemicals segment result (₹ crore)', x: QL, series: [{ name: 'Chemicals EBIT', values: SQ.map(q => q.chemEbit), fmt: 'num' }], labels: 'all', source: 'GNFC investor decks' },
      { type: 'line', title: 'Fuel oil and gas costs jumped ~65-75% in Q1FY27', unit: '₹ \'000 per tonne (oil) / per \'000 SM3 (gas)', x: QL, series: [{ name: 'Fuel oil', values: SQ.map(q => q.oilPx), fmt: 'num' }, { name: 'Gas (non-urea)', values: SQ.map(q => q.gasPx), fmt: 'num' }], labels: 'all', min: 0, max: 80, source: 'GNFC investor decks' },
    ] },
    { bullets: [
      '**TDI economics:** management said in Aug-2025 that TDI-II "does not fully recover" its fixed costs at recent prices. The coal-fired steam and power plant (CCPP, ₹613 cr) was supplying steam by the August 2026 call and should cut TDI-II costs by ₹30-40k a tonne at current gas and coal prices. That fixes part of the cost problem; it does not fix the price problem.',
      '**Aniline:** uneconomic on its own against Chinese aniline made with coal-based hydrogen at 7-8x the scale; GNFC mostly processes it for other companies on a fixed margin.',
      '**Acetic acid and methanol:** GNFC\'s methanol plants have been idle since Nov-2024 because gas is too expensive; it buys methanol or acetic acid, whichever is cheaper, to keep ethyl acetate running. Spreads were ₹7-12k a tonne through FY26.',
      '**Ammonium nitrate and nitric acid:** the growth leg. AN prices rose ~20% QoQ in Q4FY26; AN melt-II and WNA-III double AN capacity from mid-2027.',
      '**Technical-grade urea:** a quiet winner. When the war cut diesel-exhaust-fluid supply in March 2026, GNFC doubled TGU output; TGU was "one of the significant contributors" to Q1 profit.',
    ] },
    { callout: `**Our view:** we model chemicals revenue +18% in FY27E (Q1 at war prices, ~₹1,400 cr a quarter after), −10% in FY28E (prices normalise; the April-2027 Bharuch shutdown) and +18% in FY29E (first full year of the new AN and nitric acid capacity). EBIT margin 19.5% / 16% / 17%: well below the last two quarters (27-31%) and the FY22 peak (37%), but above the FY24-25 trough (12.5%) because of CCPP savings and new capacity. Sep-28E chemicals EBIT of ₹${n0(sep28(F.seg.chem.adjEbitda))} cr compares with ₹${n0(A25.chemEbit)} cr in FY25 and ₹${n0(A26.chemEbit)} cr in FY26.` },
  ],
};

module.exports = { industry, tailwind, chemicals };
