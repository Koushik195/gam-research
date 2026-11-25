// Granules India report, part 6b: glossary and statement notes.
const X = require('./GRANULES.ctx');
const { F, n0, n1, epsRep, SECTOR } = X;

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['API', 'Active pharmaceutical ingredient: the chemical in a medicine that does the work (e.g. paracetamol powder)'],
      ['PFI', 'Pharmaceutical formulation intermediate: API mixed with other ingredients into ready-to-press granules, sold to tablet makers'],
      ['FD', 'Finished dosage: the tablet or capsule the patient takes'],
      ['Integrated / complex generics', 'Granules\' own split of FD: integrated = high-volume tablets made from its own API (legacy molecules); complex = harder-to-make products (controlled substances, extended-release, MUPS, oncology)'],
      ['Legacy five', 'Paracetamol, metformin, ibuprofen, guaifenesin and methocarbamol'],
      ['Controlled substance / Schedule II', 'Drugs with abuse potential (ADHD stimulants, opioids) regulated by the US DEA; makers get yearly quotas and must make the API and tablet in the US'],
      ['ANDA / first-to-file / 180-day exclusivity', 'A generic drug application to the US FDA; the first filer challenging a patent can get 180 days with few competitors'],
      ['Form 483 / OAI / warning letter / EIR / VAI', 'FDA inspection observations / "official action indicated" (serious) / a formal letter that blocks new approvals from the site / establishment inspection report closing an inspection / "voluntary action indicated" (minor)'],
      ['CDMO / peptide', 'Contract development and manufacturing organisation / a chain of amino acids (e.g. GLP-1 drugs); liquid-phase (LPPS) and solid-phase (SPPS) synthesis are the two ways to make them'],
      ['MUPS', 'Multiple-unit pellet system: tablets made of many coated pellets, used for controlled release'],
      ['Preferential issue / warrant', 'New shares sold to chosen investors at a set price / the right to buy a share later at that price (25% paid up front here)'],
      ['Chargebacks and rebates', 'Payments US generic makers give back to wholesalers and buyers; they are deducted from gross invoiced sales'],
      ['Forward P/E', 'Share price ÷ next full fiscal year\'s EPS'],
      ['EV / EBITDA', 'Enterprise value (market value plus net debt) ÷ operating profit before depreciation'],
      ['Sector factor', `How far the nine pharma peers' P/E at the 30-Sep-2026 close sits above their own five-year medians (+${SECTOR}%)`],
      ['DCF / WACC', 'Discounted cash flow value; WACC is the cost of capital used to discount (12.5%, equal to the cost of equity as Granules is net cash)'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'ebitdaMargin@FY16': '20.3% (16.3% in FY15): EBITDA +31% on revenue +5% (Screener).',
  'pat@FY16': '+35%: EBITDA +31%; equity capital rose over FY16-FY18 (shares 20.5 cr to 25.5 cr).',
  'pat@FY17': '+34%: other income up from ₹5 cr to ₹35 cr.',
  'sales@FY18': '+19%; EBITDA fell 7%.',
  'ebitdaMargin@FY18': '16.5%: costs grew faster than revenue (expenses +26%).',
  'sales@FY19': '+35% to ₹2,279 cr.',
  'pat@FY19': '+77%: EBITDA +38%; other income ₹75 cr.',
  'ebitdaMargin@FY20': '20.2%: EBITDA +37% on revenue +14%.',
  'pat@FY20': '+42%: margin; other income ₹90 cr.',
  'ebitdaMargin@FY21': '26.4%: the COVID year; the peak margin of the decade.',
  'pat@FY21': '+64%: EBITDA +63%.',
  'sales@FY22': '+16%, but EBITDA −15% as the margin fell to 19.3%.',
  'pat@FY23': '+25%: revenue +20%; margin back to 20%.',
  'sales@Q2FY26': '+34% YoY: low base (Gagillapur pause in Q2FY25); FD +29%, PFI +76%.',
  'sales@Q3FY26': '+22% YoY: FD +22%, Europe +131% (Senn and API).',
  'sales@Q4FY26': '+23% YoY: FD +15%, API +33%, CDMO ₹70 cr (EBITDA positive).',
  'sales@FY21': '+25% in the COVID year; EBITDA margin 26%.',
  'ebitdaMargin@FY22': '19.3%: back from the FY21 peak as API prices normalised.',
  'sales@FY23': '+20%: FD +17%, API +38% (last year of high API volumes).',
  'sales@FY24': 'Flat: cyber incident (May-2023) disrupted production; API −26%, FD +28%.',
  'pat@FY24': '−22%: lost output, higher interest (₹106 cr).',
  'sales@FY25': '−1%: Gagillapur paused in Sep-2024 after the FDA inspection; API −37%, FD +18%.',
  'otherIncome@FY25': 'Includes a ₹28-31 cr exceptional gain: insurance claim for the FY24 cyber incident.',
  'sales@FY26': '+20%: FD +16% (complex generics 43% of FD), Europe +81% (Senn), CDMO ₹159 cr.',
  'ebitdaMargin@FY26': '22.1%: gross margin 65.0%; after Senn\'s ₹44.5 cr loss and ~₹60 cr of remediation.',
  'otherIncome@FY26': 'AR other income ₹20.3 cr (forex ₹9.2 cr) less exceptional items (Screener −₹13 cr; AR −₹10 cr: Senn deal costs, GPI settlements, gain on US Pharma stake).',
  'eps@FY26': `Pro forma ₹21.8 on 27.28 cr shares after the Sep-2026 warrant conversion; reported ₹${epsRep[2026]} (AR basic ₹24.47).`,
  'capex@FY26': 'Genome Valley completion, MUPS block, US packaging.',
  'cfo@FY26': '67% of EBITDA: inventory +₹330 cr.',
  'sales@Q2FY25': '−19% YoY: Gagillapur paused for risk assessment after the FDA inspection.',
  'otherIncome@Q1FY26': 'Includes a −₹26 cr exceptional charge (mainly GPI litigation settlements; Senn deal costs).',
  'otherIncome@Q4FY26': 'Includes a net exceptional gain of ₹16 cr (incl. the ₹26 cr gain on selling the US Pharma Ltd stake).',
  'sales@Q1FY27': '+22% YoY, flat QoQ: FD +22%, CDMO +106%; Europe −4% QoQ.',
  'sales@FY27E': 'GAM build: FD +14%, API +12%, PFI +4%, CDMO ~₹250 cr.',
  'otherIncome@FY27E': 'Q1 actual + 5.8% on the ₹1,097 cr warrant money from mid-Sep + recurring items; no forex.',
  'pbt@FY27E': 'Interest ₹83 cr: 4.45% on loans falling to ~₹900 cr + leases + other borrowing costs (₹114 cr in FY26).',
  'eps@FY29E': `₹${n1(F.eps[2])}; Gagillapur approvals and GLS volumes in FY28-29.`,
};

module.exports = { glossary, statementNotes };
