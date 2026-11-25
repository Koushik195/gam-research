// Granules India report, part 2: what the company does, history & corporate actions, industry, tailwind test.
const X = require('./GRANULES.ctx');
const { C, SA, SQ, YRS, LINES, n0, n1, pc, fdShare26, cdmoShare26 } = X;
const G = C.geographyAnnual, F26 = C.fy26, Q1 = C.q1fy27, H = SA.map(s => s.fy);

const business = {
  id: 'business', nav: 'What it does', kicker: 'The business', title: 'What Granules does: it makes the medicine from the chemical up (API → granules → tablet), mostly for the US; finished dosages are 74% of revenue',
  blocks: [
    { p: `Granules started in 1984 making paracetamol, the chemical inside Tylenol and Crocin. It still makes paracetamol, metformin (diabetes), guaifenesin (cough), ibuprofen and methocarbamol at scale, but it now sells most of them as finished tablets rather than as bulk chemicals. It works at three steps: the **API** (the active chemical), the **PFI** (pharmaceutical formulation intermediate: ready-to-press granules, sold to other tablet makers) and the **finished dosage** (FD: tablets and capsules, sold to US retailers, wholesalers and generic companies). In FY26 FD was ${Math.round(fdShare26)}% of revenue, API 13%, PFI 10% and the new peptide CDMO (contract manufacturing for drug innovators, bought in Apr-2025) ${Math.round(cdmoShare26)}%. About 72-75% of revenue comes from North America, 15-16% from Europe and the rest from other markets; India is only ~4% (₹${n0(G.india.FY26)} cr in FY26).` },
    { p: 'Inside FD there are two very different businesses. **Integrated generics** (46% of FD in Q1FY27) are high-volume tablets made from Granules\' own API, such as paracetamol and metformin: cheap to make, sold on price. **Complex generics** (50% of FD in Q1FY27, up from 31% in FY25) are harder products: US-made ADHD stimulants and opioid combinations (controlled substances), extended-release and multi-particulate (MUPS) tablets, and a few oncology drugs. This second group is where the margin gains came from.' },
    { pair: [
      { type: 'stacked', title: 'FD carries the business; API shrank, CDMO is new', unit: 'Revenue (₹ crore)', x: [...H, ...YRS], series: [{ name: 'Finished dosages', values: [...SA.map(s => Math.round(s.fd)), ...LINES.fd.map(Math.round)], fmt: 'num' }, { name: 'API', values: [...SA.map(s => Math.round(s.api)), ...LINES.api.map(Math.round)], fmt: 'num' }, { name: 'PFI', values: [...SA.map(s => Math.round(s.pfi)), ...LINES.pfi.map(Math.round)], fmt: 'num' }, { name: 'Peptide CDMO', values: [...SA.map(s => Math.round(s.cdmo)), ...LINES.cdmo.map(Math.round)], fmt: 'num' }], minLabel: 300, source: 'AR FY26 and company decks (FY22-26); GAM estimates FY27-29E' },
      { type: 'stacked', title: 'North America ~72%; Europe doubled in FY26 (half of it Senn)', unit: 'Revenue (₹ crore)', x: SQ.map(q => q.q), series: [{ name: 'North America', values: SQ.map(q => Math.round(q.na)), fmt: 'num' }, { name: 'Europe', values: SQ.map(q => Math.round(q.europe)), fmt: 'num' }, { name: 'Rest of world incl. India', values: SQ.map(q => Math.round(q.row)), fmt: 'num' }], minLabel: 120, source: 'Company decks (Q3FY25 derived); Europe includes Senn from Q1FY26' },
    ] },
    { exhibit: { type: 'table', title: 'The four divisions in FY26 and Q1FY27', head: ['Division', 'FY26 (₹ cr)', 'Share', 'FY26 growth', 'Q1FY27 YoY', 'Margin (disclosed or our read)'], wide: [5], rows: [
      ['Finished dosages (FD)', n0(3989.3), `${Math.round(fdShare26)}%`, '+16%', `+${Q1.divisions.fdYoY}%`, 'Not disclosed. Complex generics "structurally higher" margins (company); integrated generics sold on price'],
      ['API', n0(682.2), '13%', '+10%', `+${Q1.divisions.apiYoY}%`, 'Lowest: commodity molecules against Chinese makers; FY26 growth from new APIs, not price'],
      ['PFI', n0(534.8), '10%', '+25%', `+${Q1.divisions.pfiYoY}%`, 'Low-to-mid: granules for other tablet makers, partly from Gagillapur'],
      ['Peptide CDMO (Senn)', n0(159.3), `${Math.round(cdmoShare26)}%`, 'New', `+${Q1.divisions.cdmoYoY}%`, `EBITDA loss ₹${F26.ascelisEbitdaLoss} cr in FY26; positive in Q4FY26; loss ₹12.4 cr in Q1FY27`],
      { hl: true, cells: ['**Total**', '**5,366**', '100%', '+20%', '+22%', `Gross margin ${F26.grossMarginPct}%, EBITDA margin ${F26.ebitdaMarginPct}% (Q1FY27: ${Q1.grossMarginPct}% / ${Q1.ebitdaMarginPct}%)`] },
    ], source: 'Q4FY26 and Q1FY27 decks; AR FY26. Granules does not report margins by division or region' } },
    { exhibit: { type: 'table', title: 'By region (₹ crore)', head: ['Region', 'FY25', 'FY26', 'FY26 growth', 'Q1FY27', 'Q1 YoY', 'What sells there'], wide: [6], rows: [
      ['North America', n0(G.rows[1].na), n0(G.rows[2].na), '+15%', n0(Q1.regions.na), `+${Q1.regions.naYoY}%`, 'FD: OTC paracetamol/ibuprofen, Rx metformin, ADHD and opioid controlled substances (GPI Virginia)'],
      ['Europe (incl. Senn)', n0(G.rows[1].europe), n0(G.rows[2].europe), '+81% (+49% ex-Senn)', n0(Q1.regions.europe), `+${Q1.regions.europeYoY}%`, 'API and FD from dossiers filed earlier; peptide CDMO'],
      ['Rest of world', n0(G.rows[1].row - G.india.FY25), n0(G.rows[2].row - G.india.FY26), pc((G.rows[2].row - G.india.FY26) / (G.rows[1].row - G.india.FY25) * 100 - 100), '–', '–', 'API and PFI (LatAm, Asia, Canada)'],
      ['India', n0(G.india.FY25), n0(G.india.FY26), pc(G.india.FY26 / G.india.FY25 * 100 - 100), '–', '–', 'Domestic customers (~4% of revenue)'],
    ], source: 'Q4FY26 and Q1FY27 decks; AR FY26 (revenue within India). The decks report India inside ROW (Q1FY27 ROW ₹177 cr, +56%)' } },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'History: a paracetamol maker that integrated forward into tablets; the last three years brought a cyber attack, an FDA warning letter, an acquisition and ₹1,762 cr of new equity',
  blocks: [
    { p: 'The company built its base on cost leadership in a few molecules (the Bonthapally API site makes 34,560 tonnes a year), then integrated forward: PFI granules at Gagillapur, finished dosages in India, and later its own US subsidiary and plant in Chantilly, Virginia (Granules Pharmaceuticals Inc., GPI), which began launching Schedule II controlled substances in 2018. The table lists what happened since FY23 and what each event did to the numbers.' },
    { exhibit: { type: 'table', title: 'Corporate actions and events since FY23, with their impact', head: ['When', 'Event', 'Impact on the numbers'], wide: [2], rows: [
      ['FY23', 'Buyback: shares 24.8 cr → 24.2 cr', 'EPS +2-3%'],
      ['Jan-2023', 'CZRO plan: green paracetamol/metformin starting materials at Kakinada with Greenko ZeroC (~₹2,000 cr over five years)', 'Now a ~₹200 cr DCDA plant after a Vizag pilot; Chinese DCDA prices fell'],
      ['May-2023', 'Cyber (information-security) incident', 'FY24 production lost; ₹30.8 cr insurance claim booked as an exceptional gain in FY25'],
      ['May-2024', 'CMD sells 3.09% (₹304 cr) to repay personal debt and release pledged shares', 'Promoters 42.0% → 38.9%'],
      ['Aug-Sep 2024', 'FDA inspects Gagillapur: six observations; Granules pauses the site for a few days', 'Q2FY25 revenue −19% YoY; air freight and failure-to-supply costs'],
      ['Dec-2024 / Feb-2025', 'Gagillapur classified OAI; warning letter (26-Feb-2025)', 'No new approvals from the site since; ~₹60 cr of consultants in FY26; products moved to Genome Valley and GPI'],
      ['Apr-2025', 'Senn Chemicals (Switzerland) acquired: CHF20 mn equity, EV ~₹450 cr', '₹159 cr revenue and a ₹44.5 cr EBITDA loss in FY26; ₹12.2 cr deal costs (exceptional)'],
      ['Aug-2025', 'Joint MD & CEO Dr K.V.S. Ram Rao leaves', 'Four family members remain the executive directors'],
      ['Dec-2025', 'Genome Valley (10 bn dosages) gets its FDA EIR (VAI)', 'FD capacity +40%; utilisation still low in Q1FY27'],
      ['Feb-2026', '₹1,762.5 cr preferential issue at ₹585: 51 lakh shares + 2.5 cr warrants', '₹665.6 cr received; net debt ₹706 cr → ₹402 cr'],
      ['Sep-2026', 'CMD sells ~1.72 cr shares (~₹1,500 cr) on 11-Sep; warrants converted on 16-Sep', '₹1,096 cr received; shares 24.78 cr → 27.28 cr (+10%); net cash'],
    ], source: 'AR FY26 (notes 23, 39); FDA warning letter 320-25-48; BSE filings (summaries); Q4FY26 call; Business Standard (May-2024)' } },
  ],
};

module.exports = { business, history };
