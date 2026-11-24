// Gland report, part 6: risks & honest summary, glossary, statement notes.
const X = require('./GLAND.ctx');
const { F, V, AS, n0, n1, price, mv, peMult, epsSep28, rating, ruleText, buyBelow, sellAbove, fwdNow, peFY27, FMA, FM21, KW, Q1, ytd, epsCagrFwd, SENS } = X;

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: 'Our honest summary: a better business than its last five years suggest, at a price that already knows it',
  blocks: [
    { callout: `**What you are buying:** India's largest pure-play injectables manufacturer: a base business earning 36-40% EBITDA margins on low-cost, compliant sterile capacity across every format; a European CDMO (Cenexi) that has just stopped losing money; signed contracts with big pharma, GLP-1 developers and a Chinese liposome developer that start to pay from FY28-30; and ₹3,300 cr of net cash. Earnings should grow ~${Math.round(epsCagrFwd)}% a year to FY29E on our numbers, from a depressed base.` },
    { callout: `**What you are paying:** ${n1(peFY27)}x our FY27E and ${n1(fwdNow)}x FY28E EPS after a ~${Math.round(ytd)}% rise in 2026. Our ${peMult}x Sep-28E multiple is Gland's own median since the Cenexi deal (${n1(FMA.median)}x) lifted ${n1((KW - 1) * 100)}% for a sector trading above its history; it gives {{dcf.tp|inr}} ({{dcf.upside|chg}}). The DCF (₹${n0(mv('dcf').value)}) is lower. The since-2021 median (${n1(FM21.median)}x) would support more, but it prices a standalone Gland in the 2021 boom, before Cenexi and before FY23's shock.` },
    { p: "**Why HOLD and not BUY, given the momentum?** Because the rule compares the price with a target built from the multiple the market has paid for this Gland (with Cenexi) since 2023, and the price is already there. The drivers that would justify more (the 55-SKU contract, GLP-1 in the US, large complex launches) arrive after the twelve months the target covers, and management's growth guidance has moved twice in a year. A strong Q2, the bag-line approval or an early GLP-1 launch could carry the stock higher for a while; we would raise estimates on delivered numbers, not on ambitions." },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      ['Base business keeps growing 15%+ in constant currency after Q1', 'Medium', 'US revenue, launches, GPO wins; constant-currency disclosure'],
      ['Cenexi reaches high single-digit margins by Q4FY27', 'Medium', 'Management stopped the separate split; watch commentary and the CDMO line'],
      ['USFDA approval of the bag and ophthalmic lines', 'Medium-high', 'Company filings; Q2-Q3FY27'],
      ['GLP-1 partner launches outside the US in FY27-28', 'Low-medium', 'Partner announcements (Canada, Brazil, India)'],
      [`A fall in the price towards ~₹${n0(buyBelow)}`, 'n.a.', 'At that level the rule turns BUY on today\'s numbers'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['US price erosion returns as competitors match recent launches (Dalbavancin, multivitamin)', 'Medium', 'Base growth halves; bear case {{scen.bear.tp|inr}}'],
      ['Cenexi stalls near breakeven; goodwill impairment', 'Medium', 'Group margin stuck at ~26%; write-down of up to ₹294 cr'],
      ['A partner failure or re-sourcing (as Athenex in FY23)', 'Low-medium', 'One customer was 13.5% of FY26 revenue'],
      ['Regulatory: an adverse USFDA inspection at Dundigal or Pashamylaram', 'Low', 'Launch delays; the record so far is clean'],
      ['Further Fosun stake sales; tension over a Chinese parent with US partners', 'Medium', 'Supply overhang; partner caution under BIOSECURE-type rules'],
      ['Rupee recovery', 'Low-medium', 'Removes ~5 points of reported growth (Q1FY27: 20% vs ~15% constant currency)'],
      ['Capital allocation: another large acquisition', 'Low-medium', 'Management is looking at in-licensing and biologics'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**We would turn buyers below ~₹${n0(buyBelow)}** and sellers above ~₹${n0(sellAbove)} on today's numbers; between the two the rule says HOLD.`,
      `**Biggest swing factors:** the multiple (each 1x on Sep-28E EPS of ₹${n1(epsSep28)} is ~₹${n0(epsSep28)} a share; the window choice alone is worth ~₹${n0(SENS[4].tp - SENS[0].tp)}) and the margin (each point is ~₹${n1(F.sales[1] / 100 * (1 - AS.taxRate[1] / 100) / X.sh)} of FY28E EPS).`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Base-business EBITDA margin', v: '36.5%', d: 'FY26; 40% in Q4FY26' },
      { k: 'Cenexi EBITDA', v: '€2 mn', d: 'Q1FY27, after −€19 mn in FY25' },
      { k: 'Revenue growth', v: `${Math.round(Q1.growthPct)}% / ${Q1.ccGrowthPct}%`, d: 'Q1FY27 reported / constant currency' },
      { k: 'Forward P/E', v: `${n1(fwdNow)}x`, d: `FY28E; target ${peMult}x Sep-28E` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['Injectable / sterile manufacturing', 'Medicines given by injection or infusion; they must be made in sterile (germ-free) conditions, which is costly and closely inspected.'],
      ['Vial, ampoule, PFS, lyo, RTU bag, cartridge', 'Formats: glass vials and ampoules, pre-filled syringes, freeze-dried (lyophilised) powders, ready-to-use infusion bags, and cartridges used in pens (e.g., GLP-1).'],
      ['B2B model', 'Gland sells to other pharma companies that market the product under their own label, rather than to doctors or pharmacies.'],
      ['ANDA / 505(b)(2)', 'US filings to sell a generic copy (ANDA) or a modified version of an approved drug (505(b)(2)).'],
      ['Profit share / milestones', 'Gland\'s share of a partner\'s profit on products Gland developed, and one-off payments at development or approval stages.'],
      ['CDMO / tech transfer', 'Contract development and manufacturing: making a customer\'s product to its process; a tech transfer moves an existing product from another plant to Gland.'],
      ['GPO', 'Group purchasing organisation: US buyers for hospitals that award supply contracts on price and reliability.'],
      ['Form 483 / EIR / warning letter', 'USFDA inspection observations (483), the report closing an inspection (EIR), and a formal letter for serious failures.'],
      ['GLP-1', 'Diabetes and obesity drugs (liraglutide, semaglutide, tirzepatide), mostly injected with pens.'],
      ['NDDS / microsphere / liposome', 'Novel drug-delivery systems: particles or fat bubbles that release a drug slowly or target it; hard to copy.'],
      ['Constant-currency growth', 'Revenue growth with exchange rates held at last year\'s level.'],
      ['EBITDA / adjusted EBITDA', 'Operating profit before depreciation, interest, tax and other income; Gland\'s "adjusted" figure also adds back ESOP cost.'],
      ['Forward P/E / EV/EBITDA', 'Share price ÷ next full year\'s EPS; enterprise value (market value less net cash) ÷ EBITDA.'],
      ['Sep-28E', 'Half FY28E plus half FY29E: the earnings the market will look at in twelve months.'],
      ['forwardMedian / sector factor', 'House rule: the stock\'s median forward P/E over its window (trough years left out), multiplied by how far sector peers trade above or below their own median over the same window.'],
      ['DCF / cost of equity', `Discounted cash flow value; the return shareholders require (here ${n1(V.ke)}%).`],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'sales@FY21': '+32%: Covid-era demand; IPO in Nov-2020.',
  'sales@FY22': '+27%: peak standalone year.',
  'pat@FY22': 'Peak profit ₹1,212 cr (EPS ₹73.75) until FY27E.',
  'sales@FY23': '−18%: Athenex bankruptcy, a lost customer, Chinese enoxaparin/heparin competition, Penems line shutdown.',
  'ebitdaMargin@FY23': '−6pts to 28%: lost volumes and price erosion.',
  'otherIncome@FY23': 'Net of the ₹54 cr exceptional provision for Athenex.',
  'pat@FY23': '−36%.',
  'sales@FY24': '+56%: Cenexi consolidated from 27-Apr-2023 (₹1,488 cr).',
  'ebitdaMargin@FY24': '−5pts to 24%: Cenexi at −5.5% and higher employee costs.',
  'capex@FY24': 'Plus ₹1,022 cr paid for Cenexi and ₹777 cr of its debt repaid.',
  'sales@FY25': '−1%: US price −5% offset volume +9%; Saudi tender lost; Cenexi flat in euros.',
  'ebitdaMargin@FY25': 'Low point 22.6%: Cenexi EBITDA −₹176 cr.',
  'pat@FY25': '−10%: EPS ₹42.4.',
  'sales@FY26': '+14.5%: base +11% (31 US launches, GPO wins), Cenexi +25% in rupees.',
  'ebitdaMargin@FY26': '25.3%: base 36.5%, Cenexi −1.8%.',
  'otherIncome@FY26': '₹316 cr before the ₹24 cr Labour Codes charge; includes ₹92 cr of forex gains.',
  'pat@FY26': '+47%.',
  'sales@Q3FY26': '+22%: new GPO contracts; Cenexi €50 mn (+22% in euros).',
  'otherIncome@Q3FY26': 'Net of the ₹24 cr Labour Codes exceptional charge.',
  'opm@Q4FY26': '29%: base business 40% with ~6% milestone income; Dalbavancin launched.',
  'otherIncome@Q4FY26': 'Includes ₹51 cr of forex gains.',
  'sales@Q1FY27': '+20% (~15% constant currency): US +32%, Europe +20%.',
  'opm@Q1FY27': '27%: base ~37%, Cenexi 4% (€2 mn).',
  'pat@Q1FY27': '+47%.',
};

module.exports = { risks, glossary, statementNotes };
