// Cohance Lifesciences report, part 3: one chapter per segment (small-molecule CDMO, ADC and oligonucleotide platforms, API+,
// specialty chemicals) and the plants with their US FDA status.
const X = require('./COHANCE.ctx');
const { C, n0, n1, YRS, LINES, growthOf, NJ, njPbt, spPat, SP, Q1, SQ } = X;
const CD = C.cdmo;

const cdmo = {
  id: 'cdmo', nav: 'Pharma CDMO: small molecules', kicker: 'Segment', title: 'Small-molecule CDMO: Suven\'s engine stalled when two big molecules destocked; one is restocking, two new ones are commercial, 10 sit in Phase III',
  blocks: [
    { p: `This is the old Suven business: intermediates and APIs for innovator drugs, made under long contracts with the top 20 innovators (>85% of small-molecule revenue). It is lumpy because a few molecules matter a lot. In FY26 two large commercial molecules were **destocked** (customers ran down their inventories), costing ~₹260 cr of revenue, and two older molecules are past patent expiry (already declining). Pharma CDMO revenue fell from ₹1,128 cr to ₹889 cr, and to ₹${n1(Q1.pharmaCdmo)} cr in Q1FY27 (−39%); stripping out NJ Bio and Sapala, small-molecule revenue was only ~₹62 cr in Q1 against ~₹163 cr a quarter in FY26. The pipeline is the case for recovery: ${CD.newCommercial.toLowerCase()}; a **restocking order** has been received for one destocked molecule with deliveries in Q4FY27 and FY28; the second is still "in discussion"; there are ${CD.phase3} molecules in Phase III (management expects more than half to be approved) and 140+ active projects. Commercial work was 57% of Q1FY27 standalone CDMO revenue (over 70% in FY26). Customer concentration is not disclosed.` },
    { pair: [
      { type: 'column', title: 'Pharma CDMO revenue by quarter: ₹345 cr peak, ₹125 cr now', unit: 'Pharma CDMO revenue (₹ crore), incl. NJ Bio and Sapala', x: SQ.map(q => q.q), series: [{ name: 'Pharma CDMO', values: SQ.map(q => q.pharmaCdmo), fmt: 'num' }], labels: 'all', highlight: 'Q1FY27', source: 'Company decks' },
      { type: 'column', title: `Small-molecule CDMO: ₹1,024 cr (FY25) → ₹651 cr → ₹${n0(LINES.smallMol[0])} cr (FY27E)`, unit: '₹ crore (Pharma CDMO less NJ Bio and Sapala)', x: ['FY25', 'FY26', ...YRS], series: [{ name: 'Small molecules', values: [1024, 651, ...LINES.smallMol.map(Math.round)], fmt: 'num' }], labels: 'all', source: 'Q4FY26 deck; AR FY26 notes 18(b), 43; GAM estimates' },
    ] },
    { exhibit: { type: 'table', title: 'What drives small-molecule CDMO, FY27-29E', head: ['Driver', 'Evidence (to 30-Sep-2026)', 'In our numbers'], wide: [1, 2], rows: [
      ['Destocked molecule 1', 'Restocking order received; spread over two years; deliveries from Q4FY27', 'Part of FY28E +25%'],
      ['Destocked molecule 2', '"In active discussion"; value not given', 'Not assumed'],
      ['Two new commercial molecules', 'Orders for six intermediates; deliveries Q2-Q3FY27', 'FY27E H2 recovery'],
      ['Two more within 12-15 months', 'One already US FDA approved', 'FY28E'],
      ['Phase III book (10 molecules)', '>50% expected to be approved; reloads coming', 'FY29E +15%'],
      ['Patent expiries', 'Two molecules; the decline already seen in FY25-26', 'No further drop assumed'],
    ], source: 'Q1FY27 deck p.24; Q1FY27 and Q4FY26 calls' } },
    { callout: `**Our view:** small-molecule CDMO falls to ₹${n0(LINES.smallMol[0])} cr in FY27E, then recovers to ₹${n0(LINES.smallMol[1])} cr and ₹${n0(LINES.smallMol[2])} cr: still below FY25's ~₹1,024 cr in FY29E. The bull case needs the second molecule back and faster Phase III conversion; the bear case is that the reloads are smaller than the destocking.` },
  ],
};

const modalities = {
  id: 'modalities', nav: 'ADC & oligonucleotides', kicker: 'Segment', title: 'ADC and oligonucleotides: NJ Bio cost ₹548 cr for 56% and loses ~₹50 cr a quarter; Sapala cost ₹258 cr for 67.5% and is growing 2.5x',
  blocks: [
    { p: `These are the platforms that were meant to make Cohance a "technology-driven CDMO" (niche technologies were 15-16% of revenue). **ADC**: in India Cohance makes payloads (the toxic drug) and linkers in Vizag, with two commercial payload supplies to large innovators, three payload DMFs filed in FY26 and MMAE and exatecan added; a customised payload order is due in Q2FY27. **NJ Bio** (Princeton, New Jersey; 56% bought on 20-Dec-2024 for ₹548 cr, goodwill ₹419 cr; the other 44% can be put to Cohance) does research and clinical-scale bioconjugation: revenue ₹188 cr and a loss of ₹66 cr in FY26, then revenue of ₹${n1(Q1.njBioRevenue)} cr and an EBITDA loss of ₹${n1(-Q1.njBioAdjEbitda)} cr in Q1FY27 alone, after biotech funding dried up and full-time-equivalent (FTE) research contracts were lost. Management's goal is to make its cost "commensurate" with revenue; profitability is "a medium-term objective". **Oligonucleotides**: **Sapala** (Hyderabad; 67.5% bought on 11-Jul-2024 for ₹258 cr) makes amidites and modified nucleosides, the building blocks of antisense and siRNA drugs: FY26 revenue ₹49.7 cr (a small loss after acquisition accounting), Q1FY27 ₹27.4 cr (2.5x) at a strong margin, with orders in hand and a new amidites plant. Founder Dr P.Y. Reddy now leads the combined nucleic-acid business, with a path to 100% ownership by FY30.` },
    { exhibit: { type: 'table', title: 'What the bolt-ons cost and earn (₹ crore)', head: ['', 'NJ Bio (56%)', 'Sapala (67.5%)'], rows: [
      ['Price paid for the majority stake', '548 (Dec-2024)', '258 (Jul-2024)'],
      ['Liability to buy the rest (Mar-26, combined)', '696 (both)', '—'],
      ['Goodwill', '419', 'part of ₹1,284 cr group goodwill'],
      ['FY26 revenue / profit', '188 / −66', '50 / −1'],
      ['Q1FY27 revenue / EBITDA', `${n1(Q1.njBioRevenue)} / ${n1(Q1.njBioAdjEbitda)}`, `${n1(Q1.sapalaRevenue)} / ~9 (our derivation)`],
      [`Our FY27E-29E revenue`, LINES.njBio.map(n0).join(' / '), LINES.sapala.map(n0).join(' / ')],
      ['Our FY27E-29E pre-tax profit', njPbt.map(n0).join(' / '), X.spPbt.map(n0).join(' / ')],
      ['Minorities\' share in our EPS', `+${n0(-NJ.nci * njPbt[0])} / +${n0(-NJ.nci * njPbt[1])} / +${n0(-NJ.nci * njPbt[2])} (44% of losses)`, `−${n0(SP.nci * spPat[0])} / −${n0(SP.nci * spPat[1])} / −${n0(SP.nci * spPat[2])}`],
    ], source: 'AR FY26 notes 18(b), 43; Q1FY27 deck and call; GAM estimates (NJ Bio EBITDA −₹95 / −55 / −25 cr; Sapala margin ~30%)' } },
    { callout: '**Our view:** Sapala looks like a good buy at a fair price; NJ Bio has not worked. Together they cost ~₹1,500 cr including the buy-out liability, against ₹238 cr of FY26 revenue and a loss. Our EPS counts only Cohance\'s 56% of NJ Bio\'s losses; when the put is exercised, Cohance will own all of them unless NJ Bio is fixed first. A write-down of NJ Bio goodwill is a real possibility.' },
  ],
};

const api = {
  id: 'apiplus', nav: 'API+', kicker: 'Segment', title: 'API+: the stable half, hurt by a US FDA Warning Letter at Nacharam; niche APIs with top-3 global positions; guided to double-digit growth from FY28',
  blocks: [
    { p: `API+ (₹${n0(C.fy26.apiPlus)} cr, 48% of FY26 revenue) is Cohance's legacy business: low-to-mid-volume generic APIs where it has built cost leadership through backward integration (8 of its top 10 molecules hold top-three global positions; the top 15 products are about half of API revenue), pellets and finished formulations. About two-thirds of revenue is with innovators or large generic companies. FY26 revenue fell 8%: shipment delays, softer demand in some mature products and the **Nacharam formulations plant**, which received an OAI and then a **US FDA Warning Letter (Feb-2026)**, was voluntarily shut for remediation and cost ~₹61 cr of revenue; supplies have resumed (US supplies restarted) and the site should be "audit-ready" by end-FY27. Q1FY27 revenue fell 10% on order timing and a customer-site event, with prices passed through. Management targets seven API filings in FY27 (nine in FY26) and ~10 formulation launches, and sees "steady", double-digit growth from FY28.` },
    { callout: `**Our view:** API+ is the bedrock: we forecast ${growthOf('apiPlus').map(v => `+${Math.round(v)}%`).join(' / ')} for FY27-29E. It is a good niche-generic business, but not innovator CDMO economics: BOBCAPS calls API+ at ~60% of Q1 sales "an industry-low margin for a CDMO company" and uses that to justify a 40x multiple.` },
  ],
};

const specchem = {
  id: 'specchem', nav: 'Specialty chemicals', kicker: 'Segment', title: 'Specialty chemicals: agrochemicals in a downturn and a "qualification year"; photochromic stable, OLED in transition',
  blocks: [
    { p: `Specialty Chemicals (₹${n0(C.fy26.specChem)} cr, 13%) makes agrochemical intermediates and active ingredients, mostly for one anchor global innovator, and performance materials (photochromic dyes for spectacle lenses, OLED and deuterated materials, early semiconductor chemistry). Revenue fell 2% in FY26 on Chinese generic pricing in agro and fell 35% in Q1FY27 as agro shipments shifted to H2. Management calls FY27 "a year of qualification" (a key active ingredient entered registration; first campaigns with two Japanese innovators) and sees double-digit growth from FY28. The business is being "revamped" with new capacity, governance and an innovator-led portfolio.` },
    { callout: `**Our view:** ${growthOf('specChem').map(v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`).join(' / ')} for FY27-29E. Too small to move the valuation; a source of quarterly noise.` },
  ],
};

const plants = {
  id: 'plants', nav: 'Plants & US FDA', kicker: 'Operations', title: 'Plants and US FDA status: a Warning Letter (Nacharam formulations) and a Form 483 (Pashamylaram CDMO) in one year; Jaggaiahpet clean',
  blocks: [
    { p: `${C.profile.plants}. In FY26 the network had 12 regulatory audits and 143 customer audits; 11 regulatory audits were closed. Two US FDA issues are open at 30-Sep-2026: the Nacharam Warning Letter and a Form 483 with five observations (none on data integrity) after an inspection of the Pashamylaram CDMO site from 27-Jul to 5-Aug-2026. Customer audits of CDMO and API sites in Q1FY27 had no critical findings.` },
    { exhibit: { type: 'table', title: 'US FDA and regulatory status (to 30-Sep-2026)', head: ['Site', 'Status'], wide: [1], rows: C.regulatory, source: C.regulatorySrc } },
    { callout: '**Our view:** a Warning Letter at a formulations plant is manageable (it is a small part of API+), but a 483 at a CDMO site matters more: innovator customers audit their suppliers and the new chairman has made quality and safety his first priority. We assume no further disruption; an escalation is a bear-case risk.' },
  ],
};

module.exports = { cdmo, modalities, api, specchem, plants };
