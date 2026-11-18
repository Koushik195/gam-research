// Fortis report, Part A continued: annotated statements and statement notes (reported financials).
const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY15–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 15 }, hl: true }, { key: 'ebitda', name: 'EBITDA (post-Ind AS, after ESOP)', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 200 } }, { key: 'dep', name: 'Depreciation (incl. right-of-use)' },
      { key: 'otherIncome', name: 'Other income (incl. associates; history incl. exceptional items)' }, { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit (owners)', hl: true, flag: { type: 'pct', th: 25 } }, { key: 'eps', name: 'EPS (₹)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' }, { key: 'capex', name: 'Capex' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 20 }, hl: true }, { key: 'ebitda', name: 'EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' }, { key: 'otherIncome', name: 'Other income (incl. exceptional)' },
      { key: 'dep', name: 'Depreciation' }, { key: 'pat', name: 'Net profit (owners)', hl: true },
    ] } },
  ],
};

const statementNotes = {
  'pat@FY16': 'Small profit after a FY15 loss; rent to RHT Health Trust weighed on margins (EBITDA margin 2%).',
  'pat@FY17': '₹422 cr owners\' profit thanks to ~₹650 cr of other income (one-off gains).',
  'pat@FY18': '−₹1,009 cr (owners) after ~₹790 cr of exceptional items in the crisis year; the former promoters lost their stake (Feb-2018).',
  'ebitdaMargin@FY19': '5%: crisis year; rent to RHT and lost doctors.',
  'ebitdaMargin@FY20': '+800bp: IHH capital used to buy back the RHT hospitals, so rent stopped.',
  'sales@FY21': '−13%: Covid lockdowns emptied hospitals; Agilus Covid testing partly offset.',
  'sales@FY22': '+42%: recovery plus a Covid-testing boom at Agilus (diagnostics EBITDA ₹412 cr).',
  'pat@FY22': 'Includes ₹255 cr of exceptional gains; minorities took ₹235 cr (Agilus 43% minority).',
  'ebitdaMargin@FY23': 'Down: Agilus EBITDA fell 42% after Covid testing ended; hospitals improved to 16.9%.',
  'sales@FY25': '+13%: ARPOB +9%, occupied beds +5%; Manesar opened (Sep-2024).',
  'pat@FY25': 'Owners\' profit +29%; Fortis bought 31% of Agilus late in the year (minorities ₹35 cr vs ₹46 cr); −₹89 cr exceptional items.',
  'otherIncome@FY25': 'Screener figure is after −₹89 cr of exceptional items (other income ₹67 cr, associates ₹11.5 cr).',
  'sales@FY26': '+17%: hospitals +19% (Jalandhar, Greater Noida, People Tree added), Agilus +9%.',
  'ebitdaMargin@FY26': '22.8%: hospital margin 22.2% (20.5%), Agilus 23.6% (17.7%, rebranding one-offs in FY25).',
  'pat@FY26': '+35% to ₹1,042 cr; −₹22 cr exceptional (Labour Codes ₹55 cr less ₹33 cr impairment reversal).',
  'capex@FY26': '₹945 cr plus ~₹640 cr of acquisitions and other investing (Jalandhar ₹462 cr, People Tree ₹430 cr deal values).',
  'otherIncome@Q3FY26': 'Includes −₹46 cr of exceptional items (Labour Codes).',
  'opm@Q1FY27': '21%: first ESOP charge (₹31 cr); before ESOP 22.3%. New units, legal costs and bad-debt provisions also weighed.',
  'sales@Q1FY27': '+17.5%: hospitals +19% (occupied beds +17%, ARPOB +2.6%), Agilus gross +10%.',
  'sales@FY27E': 'GAM bed build: ~5,090 operational beds, 69% occupancy, ARPOB ₹2.72 cr (gross); Agilus +11%.',
  'ebitdaMargin@FY27E': 'Hospitals 22.6% and Agilus 24.0% before ESOP, less ~₹151 cr of ESOP: 21.8%.',
  'ebitdaMargin@FY28E': 'Hospitals 23.4% before ESOP (management target 25% after ESOP).',
  'capex@FY27E': '₹1,150 cr: FMRI tower, brownfield beds, robots and part of the ₹252 cr proton centre; no acquisitions modelled.',
  'sales@FY29E': '702 new beds (Mohali, Shalimar Bagh, Amritsar towers) start filling.',
};

module.exports = { statements, statementNotes };
