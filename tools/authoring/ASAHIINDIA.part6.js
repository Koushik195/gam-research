// Asahi India Glass report, part 6: risks and honest summary, glossary, statement notes.
const X = require('./ASAHIINDIA.ctx');
const { ruleText } = require('../../src/ratings');
const { F, n0, n1, price, shares, EVM, HEV, rating, buyBelow, sellAbove, ebitdaSep, ndSep, sectorEv, seg, evNowSep, q1Est, isec } = X;
const fltRev = (seg('float').revenue[1] + seg('float').revenue[2]) / 2;
const perPp = r => Math.round(r * 0.01 * EVM.base / shares / 10) * 10; // value per share of 1pp of Sep-28E segment margin at the target multiple
const at = m => Math.round((m * ebitdaSep - ndSep) / shares / 10) * 10;

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: `Our honest summary: a strong franchise at a full price, with float profits on borrowed time; ${rating}`,
  blocks: [
    { callout: '**What you are buying:** the dominant supplier of car glass in India (~80% share), owned with its Japanese technology partner and its biggest customer, plus three float-glass lines that now make the company self-sufficient in raw glass. Earnings have just turned up sharply after a long, expensive build-out. Against that: auto margins capped by powerful customers, float profits that swing with import prices and depend today on trade protection, returns on capital below its cost, and another ₹2,000 cr of capex already approved.' },
    { callout: `**What you are paying:** ${n1(evNowSep)}x our Sep-28E EBITDA and ${n1(price / F.eps[1])}x FY28E EPS, at a time when our numbers already assume float margins near their Q1FY27 level for FY27. Since 2021 the market has paid a median ${n1(HEV.med)}x forward EBITDA for AIS, and auto-component stocks were ${Math.abs(sectorEv).toFixed(1)}% below their five-year EV/EBITDA medians on 30-Sep-2026. On the street's own method and the house multiple the target is {{dcf.tp|inr}} ({{dcf.upside|chg}}): ${rating}.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      [`Price below ~₹${n0(buyBelow)} (BUY on our rule)`, 'Low', `The stock would have to fall ~${Math.round((1 - buyBelow / price) * 100)}%`],
      [`Price below ~₹${n0(sellAbove)} (HOLD on our rule)`, 'Medium', `A ~${Math.round((1 - sellAbove / price) * 100)}% fall, or higher EBITDA that lifts the target`],
      ['MIP made permanent or anti-dumping duties widened', 'Medium', 'DGFT/DGTR decisions before Aug-2027; float segment EBIT margin above 20% through FY28'],
      ['Auto margin holds above 17% EBITDA as content rises', 'Medium', 'Auto segment EBIT margin (13.4% in Q1FY27)'],
      ['Greenfield capex deferred or cut', 'Low-Medium', 'Board updates on the ₹2,000 cr plan; capex below ₹600 cr a year would lift free cash flow'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['MIP lapses (Aug-2027) and imports return; new domestic float lines', 'Medium-High', `Each 1pp of float margin in FY28-29E ≈ ₹${perPp(fltRev)} a share at ${EVM.base}x; float at FY25's 18% would cut ~₹${perPp(fltRev) * 8} a share`],
      ['Car demand slows against the GST-boosted base from Q3FY27', 'Medium', 'Auto growth below our 10-11% in FY28-29E'],
      ['Maruti presses prices or dual-sources', 'Low-Medium', 'Maruti is 17.5% of revenue and a 10.6% shareholder'],
      ['Gas, soda ash and power costs rise (West Asia)', 'Medium', 'FY23: auto EBITDA margin fell to 12%'],
      ['Capex overruns or new capacity into a weak market', 'Medium', 'Net debt above ₹2,500 cr; ROCE stays ~11-12%'],
      ['Auto sector de-rates further', 'Medium', `At the bear multiple (${EVM.bear}x) on base EBITDA the stock is worth ~₹${n0(at(EVM.bear))}`],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**We would move to HOLD below ~₹${n0(sellAbove)}** and to BUY below ~₹${n0(buyBelow)} on today's numbers, or sooner if float protection is made permanent and margins hold (our bull case).`,
      `**This is a multiple call, not an earnings call.** Our EBITDA is above the (pre-Q1) street; ICICI Securities' 22x on our Sep-28E EBITDA would give ~₹${n0(at(22))}. We will not pay 22x, above AIS's own ${n1(HEV.med)}x median, for profits that lean on a one-year import-price floor.`,
      `**Biggest swing factor:** float-glass margins. Each 1x of EV/EBITDA is ~₹${n0(Math.round(ebitdaSep / shares / 10) * 10)} a share; each 1pp of float margin ~₹${perPp(fltRev)}.`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Share of Indian car glass', v: '~80%', d: 'AR FY26' },
      { k: 'Float EBITDA margin', v: `~${n1(q1Est.floatM)}%`, d: 'Q1FY27 (our estimate); 18% in FY25' },
      { k: 'ROCE', v: '11%', d: 'FY26; 21% in FY22-23' },
      { k: 'EV ÷ Sep-28E EBITDA', v: `${n1(evNowSep)}x`, d: `median since 2021: ${n1(HEV.med)}x` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['Float glass', 'Flat glass made by floating molten glass on a bath of molten tin; the raw material for windows, mirrors and car glass. A float line runs non-stop for 15+ years between "cold repairs".'],
      ['Laminated / tempered glass', 'Laminated: two sheets bonded with a plastic layer (windshields; holds together when broken). Tempered: heat-treated to be stronger and to break into small pieces (side and back glass).'],
      ['TPD', 'Tonnes per day: the melting capacity of a float line.'],
      ['OEM', 'Original equipment manufacturer: the vehicle maker (Maruti, Hyundai, Tata, Mahindra and others).'],
      ['Gross / external segment revenue', 'Gross includes sales to AIS\'s other segments (float glass sold to the auto business); external is sales to customers outside AIS.'],
      ['Inter-segment eliminations', 'The internal sales removed on consolidation so group revenue counts each sale once.'],
      ['MIP', 'Minimum import price: imports below a set price are restricted. India set ₹34,000 a tonne on clear float glass for one year from 18-Aug-2026.'],
      ['Anti-dumping duty', 'An extra import duty on goods sold in India below their home-market price; reviewed every five years ("sunset review").'],
      ['QIP', 'Qualified institutional placement: a sale of new shares to institutions; AIS raised ₹1,000 cr in Sep-2025.'],
      ['Related-party transaction', 'A deal with a shareholder, director or their companies; here mainly sales to Maruti Suzuki, a promoter.'],
      ['EV/EBITDA, P/E', 'Enterprise value (market value plus net debt) ÷ EBITDA; share price ÷ earnings per share.'],
      ['Sep-28E', 'Half of FY28E plus half of FY29E: the 12-month-forward figures the market will look at in September 2027.'],
      ['Sector de-rating', 'How far comparable stocks trade below their own five-year median multiple on the valuation date.'],
      ['DCF / WACC', 'Discounted cash flow valuation; WACC is the blended cost of debt and equity used to discount future cash.'],
      ['ROCE', 'Return on capital employed: operating profit ÷ debt plus equity.'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'sales@FY21': '−8%: Covid lockdowns (first half of FY21).',
  'sales@FY22': '+31%: car output recovered and float-glass prices soared on scarce imports.',
  'ebitdaMargin@FY22': '24.0%: float segment EBITDA margin 34% (peak).',
  'pat@FY22': '+162%: float-glass boom.',
  'ebitdaMargin@FY23': '19.8%: auto margin fell to 12% on energy and soda-ash costs; float still 31%.',
  'ebitdaMargin@FY24': '16.7%: float margin halved to 20% as imports returned.',
  'capex@FY24': '₹901 cr: Soniyana float line, Patan phase 2.',
  'capex@FY25': '₹1,268 cr: Soniyana (float capex ₹993 cr), Roorkee cold repair.',
  'otherIncome@FY25': '₹67 cr incl. a ₹31.8 cr exceptional gain.',
  'dep@FY26': '+48%: Soniyana and Patan capitalised (float depreciation ₹44 cr → ₹126 cr).',
  'interest@FY26': '+59%: interest on the new plants expensed after commissioning, before the QIP repaid debt.',
  'otherIncome@FY26': '₹37 cr = other income ₹48.9 cr less the ₹11.7 cr exceptional charge (labour codes, subsidiary merger).',
  'eps@FY26': 'Screener ₹13.52 (shown ₹13.53 on 25.49 cr post-QIP shares); reported ₹13.82 on 24.94 cr weighted shares.',
  'sales@Q3FY26': '+12%: GST-cut boost to car sales; float from Soniyana.',
  'otherIncome@Q3FY26': 'Net of the ₹12 cr exceptional charge.',
  'opm@Q4FY26': '21%: float segment EBIT +133% YoY (ICICI Securities).',
  'pat@Q1FY27': '₹149 cr vs ₹55 cr: float EBIT ₹117 cr vs ₹37 cr; interest down after the QIP.',
  'opm@Q1FY27': '23%: in-house float glass for auto; float margin ~28% (our estimate).',
  'sales@FY27E': 'GAM: auto +14%, float +29% (gross), eliminations up with internal float sales.',
  'ebitdaMargin@FY27E': 'GAM: auto 17%, float 28% (MIP from Aug-2026).',
  'ebitdaMargin@FY28E': 'GAM: float margin 27% as the one-year MIP ends (Aug-2027).',
  'capex@FY27E': 'GAM: brownfield ~₹350 cr plus the start of the ₹2,000 cr greenfield plan.',
};

module.exports = { risks, glossary, statementNotes };
