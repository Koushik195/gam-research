// Himadri report, part B (3/4): industry, tailwind test, core carbon business, carbon black, tyres, battery materials.
const { ctx } = require('./HSCL.part2');
const { D, F, n0, n1, SA, SQ, QL, A26, PEERS, ebt, qEbt, q1CoreEbt, segE, sep28, impliedNem, mcap, ndSep27 } = ctx;
const I = D.industry;

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Coal tar is a by-product business; carbon black and batteries are global commodities',
  blocks: [
    { p: 'Coal tar supply is set by steel-making, not by demand for pitch: every tonne of metallurgical coke yields a few per cent of tar, so supply grows with India\'s blast-furnace steel output and imports fill the gap. Demand comes from three places. **Aluminium smelters** need pitch to bind their carbon anodes (India is adding smelter and refinery capacity). **Graphite electrodes** for electric-arc steel use pitch as binder and impregnant (an oversupplied industry: HEG and Graphite India earned 3-7% ROE in FY26). **Carbon black** for tyres is a ~15 mn t global market growing ~2-3% a year, of which speciality grades (~1.1 mn t) grow ~4% (Notch Consulting via the annual report). Battery materials are a different world: China makes essentially all LFP cathode and most anode material, and cell-component prices fell 50-60% in 4-5 years.' },
    { exhibit: { type: 'table', title: 'Forces acting on Himadri\'s markets', head: ['Theme', 'Direction', 'What it means'], wide: [2], rows: I.forces.map(r => r.map(c => c.replace(/Rs /g, '₹'))), source: 'FY26 annual report, Q4FY26 and Q1FY27 calls, Screener.in (peers)' } },
    { exhibit: { type: 'table', title: 'Listed Indian peers on 30-Sep-2026: Himadri earns the best returns of the carbon names', head: ['Company', 'Business', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'ROE', 'Trailing P/E'], wide: [1], rows: [
      ['**Himadri**', 'Pitch, carbon black, chemicals, tyres', n0(PEERS.HSCL.revenue), PEERS.HSCL.ebitdaMargin + '%', PEERS.HSCL.roe + '%', n1(PEERS.HSCL.pe) + 'x'],
      ['PCBL Chemical', 'Carbon black (India #1), Aquapharm water chemicals, battery-material plans', n0(PEERS.PCBL.revenue), PEERS.PCBL.ebitdaMargin + '%', PEERS.PCBL.roe + '%', n1(PEERS.PCBL.pe) + 'x'],
      ['HEG Advanced Materials', 'Graphite electrodes (a pitch customer)', n0(PEERS.HEGAM.revenue), PEERS.HEGAM.ebitdaMargin + '%', PEERS.HEGAM.roe + '%', n1(PEERS.HEGAM.pe) + 'x'],
      ['Graphite India', 'Graphite electrodes (a pitch customer)', n0(PEERS.GRAPHITE.revenue), PEERS.GRAPHITE.ebitdaMargin + '%', PEERS.GRAPHITE.roe + '%', n1(PEERS.GRAPHITE.pe) + 'x'],
      ['Gujarat Fluorochemicals', 'Fluoropolymers, refrigerants, battery chemicals', n0(PEERS.FLUOROCHEM.revenue), PEERS.FLUOROCHEM.ebitdaMargin + '%', PEERS.FLUOROCHEM.roe + '%', n1(PEERS.FLUOROCHEM.pe) + 'x'],
      ['Neogen Chemicals', 'Bromine chemicals, battery electrolytes', n0(PEERS.NEOGEN.revenue), PEERS.NEOGEN.ebitdaMargin + '%', PEERS.NEOGEN.roe + '%', n1(PEERS.NEOGEN.pe) + 'x'],
      ['Epigral', 'Chlor-alkali, CPVC, derivatives', n0(PEERS.EPIGRAL.revenue), PEERS.EPIGRAL.ebitdaMargin + '%', PEERS.EPIGRAL.roe + '%', n1(PEERS.EPIGRAL.pe) + 'x'],
    ], source: 'Screener.in (consolidated FY26; multiples at the 30-Sep-2026 NSE close)' } },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Tailwind test: the speciality shift has reached Himadri; batteries have not yet',
  blocks: [
    { verdicts: [
      ['Speciality carbon black demand', 'Yes', 'Speciality capacity 60 kt to 130 kt (FY26); new line expected at 85-90% use in FY27; EBITDA per tonne +13% in FY26.', 'The main reason margins rose.'],
      ['Aluminium growth in India and the Gulf', 'Yes', '65%+ domestic pitch share; liquid pitch terminals at Haldia and Mangalore; first Middle East shipment Nov-2025; ~50 kt of pitch for export by FY28.', 'Steady volume, not a margin driver.'],
      ['Electric-arc steel and graphite electrodes', 'Partly', 'Electrode makers are oversupplied with weak returns; pitch is a small cost for them.', 'Volume support, little pricing power.'],
      ['China+1 in chemicals', 'Partly', 'Customers in 61 countries (from 56); anthraquinone and carbazole replace imports from Q2FY27.', 'Small revenue (₹250-300 cr potential).'],
      ['Lithium-ion batteries (LFP, anode)', 'No (not yet)', 'Anode 200 tpa since Apr-2026, samples at stage B; LFP 2,000 tpa from Q3FY27; no orders disclosed; China prices set the market.', 'An option worth watching, not yet earnings.'],
      ['Tyre demand', 'Partly', 'Birla Tyres revenue ₹187 cr in FY26, ~₹127 cr in Q1FY27; target ₹3,000 cr in 4-5 years.', 'Revenue yes, profit not yet.'],
    ], head: ['Industry tailwind', 'Captured?', 'Evidence', 'So what'], title: 'Tailwind test', source: 'Company filings and calls to Sep-2026, GAM Research' },
  ],
};

const coreSeg = {
  id: 'core', nav: 'Pitch & chemicals', kicker: 'Segment', title: 'Carbon materials & chemicals: the cash engine, now priced off higher raw-material costs',
  blocks: [
    { pair: [
      { type: 'column', title: 'Core revenue: flat for three years, +15% in Q1FY27', unit: 'Carbon materials & chemicals incl. power, external (₹ crore)', x: QL, series: [{ name: 'Core revenue', values: SQ.map(q => Math.round(q.coreRev)), fmt: 'num' }], labels: 'all', source: 'Quarterly segment results; GAM Research' },
      { type: 'line', title: 'Segment EBIT margin: 13% to 21%', unit: 'Carbon materials & chemicals EBIT margin (%)', x: QL, series: [{ name: 'EBIT margin', values: SQ.map(q => Math.round(q.cmcEbit / q.cmcRev * 1000) / 10), fmt: 'pct' }], labels: 'all', min: 0, max: 25, source: 'Quarterly segment results (Q2FY26 restated split derived)' },
    ] },
    { bullets: [
      '**What drives it.** Volume (capacity ~80% used in Q1FY27, 90%+ expected in FY27) times realisation (raw-material costs are passed on with a lag) times the mix of higher-value products. The company does not disclose product-wise volumes or prices, so we cannot split pitch from carbon black or oils.',
      '**Q1FY27.** Standalone volume 131,844 t (-6% YoY) but revenue +16%: coal tar and oil prices rose after the April-May West Asia crisis and Himadri passed them on. Standalone EBITDA per tonne was ~₹22,900, up from ~₹16,700 a year ago and ~₹18,600 in Q4FY26. Management says the margins are "sustainable" and denies inventory gains.',
      '**New capacity.** Distillation debottlenecked from 500 kt to 600 kt; liquid pitch terminals at Haldia and Mangalore; anthraquinone and carbazole (2,600 tpa in Q2FY27, 5,300 tpa by Q2FY28, ₹248 cr capex); CNT 200 tpa (Q4FY27, ₹70 cr). Management says there is no further capex in distillation.',
      '**Competition.** Domestic pitch rivals are small (Himadri 65%+), and management says it sells pitch in India below Chinese prices. Carbon black competes with PCBL and global majors.',
    ] },
    { callout: `**Our view:** this is a good business with scale and integration that newcomers cannot copy quickly. But FY22-26 profit growth came almost entirely from EBITDA per tonne, which is partly cyclical (raw-material spreads). We assume ~₹20,500 per tonne in FY27 (Q1: ~₹${n0(q1CoreEbt)} on a consolidated core basis), rising to ~₹21,500 by FY29 with the mix, on volume growth of 6% / 8% / 5%. Core EBITDA: ₹{{F.seg.core.adjEbitda.0|num}} cr / ₹{{F.seg.core.adjEbitda.1|num}} cr / ₹{{F.seg.core.adjEbitda.2|num}} cr (FY26: ₹${n0(A26.coreEbitda)} cr).` },
  ],
};

const carbonBlack = {
  id: 'carbonblack', nav: 'Speciality carbon black', kicker: 'Segment', title: 'Carbon black: the move to speciality grades is the real story of FY22-26',
  blocks: [
    { p: 'Carbon black is fine soot made by burning heavy oil in a controlled way; ~90% of the world\'s output goes into tyres and rubber. Speciality grades (for plastics, masterbatch, inks, coatings, cables and battery electrodes) need tighter control of particle size and purity and sell at higher prices per kilogram, not per tonne. Himadri makes its own feedstock oil from coal tar, which is its edge. It has 250 kt of carbon black capacity, of which 130 kt is speciality after a 70 kt line (₹220 cr) started in FY26, sold under nine brands (Energex and Electra for batteries, Jetex for cables, Klarex and Colorx for plastics and inks, among others). Next: 6,000 tpa of **super speciality black** (₹170 cr, Q4FY28), converted from commodity rubber-black lines, which management says carries margins "significantly higher" than speciality.' },
    { exhibit: { type: 'table', title: 'Carbon black: what we know and what we do not', head: ['Item', 'Disclosed', 'Not disclosed'], wide: [1, 2], rows: [
      ['Capacity', '250 kt total; 130 kt speciality; +6 kt super speciality by Q4FY28', 'Utilisation by line'],
      ['Profitability', 'Basket EBITDA ~₹17,000/t in FY26; speciality "significantly higher"', 'Carbon black EBITDA per tonne; commodity vs speciality split'],
      ['Market', 'Speciality ~1.1 mn t globally growing ~4%; super speciality ~0.3 mn t', 'Himadri\'s share by grade'],
      ['Customers', 'Global tyre and polymer majors (Bridgestone, Continental, Goodyear, Yokohama, Apollo, CEAT, BASF, among those listed in the deck)', 'Customer concentration (no customer above 10% of revenue in FY26)'],
    ], source: 'Q3FY26 and Q1FY27 presentations, Q4FY26 and Q1FY27 calls, FY26 annual report' } },
    { callout: '**Our view:** the speciality shift is genuine and it is why ICICI Securities saw "EBITDA/kg continues to surprise positively" in 2025. It is also where spreads can compress: in Q3FY26 EBITDA per kilogram dipped as speciality spreads came under pressure (ICICI Securities, Jan-2026). The new 70 kt line is the main volume driver of FY27; super speciality is too small (6 kt) to move group numbers before FY29.' },
  ],
};

module.exports = { industry, tailwind, coreSeg, carbonBlack };
