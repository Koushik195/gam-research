// Himadri report, part B: honest summary, glossary and statement notes.
const { ctx } = require('./HSCL.part2');
const { ruleText, buyBelow: buyAt, sellAbove: sellAt } = require('../../src/ratings');
const { F, V, n0, n1, price, epsSep28, rating, A26, q1CoreEbt } = ctx;
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: 'Our honest summary: a better business than it was, at a price that assumes it keeps getting better',
  blocks: [
    { callout: '**What you are buying:** India\'s dominant coal tar pitch and naphthalene maker, with a fast-growing speciality carbon black arm, a debt-free balance sheet and ~18% ROE; plus two early bets, battery materials (LFP and anode) and a revived tyre brand, that will absorb most of the next ₹2,000 cr of capex.' },
    { callout: `**What you are paying:** ${n1(price / F.eps[1])}x our FY28E EPS and ${n1(price / epsSep28)}x Sep-28E, against a forward median of ~25x since 2021, for EPS growth of ~15% a year once margins normalise. On P/E and our inputs the target is {{dcf.tp|inr}} ({{dcf.upside|chg}}); ICICI Securities' EV/EBITDA approach on our numbers lands slightly lower, and the DCF lower still.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      [`Price below ~₹${n0(sellAbove)} (HOLD) or ~₹${n0(buyBelow)} (BUY)`, 'Medium', 'Share price around the Q2FY27 results'],
      ['EBITDA per tonne holds above ~₹22,000 for several quarters', 'Medium', `Q1FY27 ~₹${n0(q1CoreEbt)} (consolidated core basis); a second strong quarter after raw-material prices settle`],
      ['LFP or anode orders with named customers', 'Low-medium', 'Approvals (sample stages C-D) after the 2,000 tpa plant starts in Q3FY27'],
      ['Birla Tyres profitable at scale', 'Low-medium', 'EBITDA break-even in FY27; revenue run-rate above ₹200 cr a quarter'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['Raw-material spreads compress (coal tar, carbon black feedstock)', 'Medium', 'Each ₹1,000/t of EBITDA ≈ ₹65 cr, ~5% of FY28E EPS'],
      ['LFP approvals slip or Chinese prices make it loss-making', 'Medium', 'Bear case: battery losses continue into FY29'],
      ['Tyres need more capital without profit', 'Medium', '~₹1,000 cr tied up by FY28 for little EBITDA'],
      ['Other income falls further (no fair-value gains, less cash)', 'Medium', 'FY26 had ₹100 cr of fair-value gains; we assume none'],
      ['Steel sector shifts from blast furnaces (less coal tar)', 'Low (long term)', 'Feedstock tightness, higher import dependence'],
      ['Related-party transactions grow (promoter holding company, DBRL)', 'Low-medium', 'Governance discount'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**We would move to HOLD if the price fell below ~₹${n0(sellAbove)} and to BUY below ~₹${n0(buyBelow)}**, or sooner if EBITDA per tonne proves sustainable near Q1FY27's level (our bull case) or LFP wins named orders.`,
      '**Biggest swing factor:** core EBITDA per tonne. Our base case assumes it eases from ~₹23,700 in Q1FY27 to ~₹20,500 for FY27; holding the Q1 level would add ~13% to FY28E EPS.',
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Core EBITDA per tonne, FY26', v: `₹${n0(A26.coreEbitda * 1e7 / A26.volume)}`, d: '~₹4,400 in FY22; ~₹23,700 in Q1FY27' },
      { k: 'Volume growth, FY26', v: '+2%', d: 'Q1FY27 −6% YoY; prices +23%' },
      { k: 'New capex, FY27-28E', v: '~₹2,000 cr', d: 'LFP ₹1,125 cr, tyres ~₹500 cr' },
      { k: 'Our FY28E EPS', v: `₹${n1(F.eps[1])}`, d: 'management goal implies ~₹21.8' },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['Coal tar', 'A thick liquid by-product of turning coal into coke for steel-making; Himadri\'s main raw material.'],
      ['Coal tar pitch (CTP)', 'The solid or liquid residue of distilling coal tar; binds the carbon anodes in aluminium smelters and graphite electrodes.'],
      ['Carbon black', 'Fine carbon powder made by burning heavy oil; reinforces tyres and rubber. Speciality grades colour and conduct in plastics, inks, cables and batteries.'],
      ['SSCB / CNT', 'Super speciality carbon black (high-purity niche grades) and carbon nanotubes (rolled graphene, used as conductive additives in batteries and electronics).'],
      ['Naphthalene / SNF', 'A coal tar fraction used for phthalic anhydride, dyes and mothballs; SNF (sulphonated naphthalene formaldehyde) is a concrete admixture.'],
      ['Anthraquinone / carbazole', 'Speciality chemicals from coal tar used in dyes, hydrogen peroxide, pharma and electronics; India imports them today.'],
      ['LFP cathode / anode', 'Lithium iron phosphate, the positive-electrode powder in most EV and storage batteries; the anode is the negative electrode, usually graphite.'],
      ['EBITDA per tonne', 'Operating profit before depreciation divided by tonnes sold; our main measure of the core\'s profitability.'],
      ['OTR / PCR / TBB', 'Off-the-road tyres (mining, construction), passenger-car radial tyres, truck-bus bias tyres.'],
      ['SoTP', 'Sum of the parts: valuing each business separately and adding them up.'],
      ['P/E, EV/EBITDA', 'Share price ÷ earnings per share; enterprise value (market value plus net debt) ÷ operating profit before depreciation.'],
      ['ROE / ROCE', 'Profit as % of shareholders\' equity / operating profit as % of capital employed.'],
      ['DCF / WACC', 'Discounted cash flow valuation; WACC is the blended required return used to discount future cash.'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'pat@FY21': 'Profit trough: raw-material costs ran ahead of prices; EBITDA margin 8%.',
  'pat@FY22': '₹39 cr: EBITDA margin 6% (company EBITDA ₹163 cr).',
  'sales@FY23': '+49%: higher prices across the coal tar chain.',
  'pat@FY23': 'Recovery: EBITDA per tonne ~₹10,400.',
  'pat@FY24': '+90%: speciality carbon black mix; EBITDA per tonne ~₹13,400.',
  'otherIncome@FY26': 'Includes ₹100 cr fair-value gain on investments (IBC, Sicona etc.).',
  'ebitda@FY26': 'After a ₹43.6 cr forex loss (company EBITDA ₹1,006 cr).',
  'capex@FY26': 'New 70 kt speciality carbon black line (₹220 cr).',
  'sales@FY27E': 'GAM: core +17% (volume +6%, prices +11%); tyres ₹620 cr.',
  'capex@FY27E': 'Management: ~₹1,000 cr (LFP, tyres, CNT, SSCB, anthraquinone).',
  'pat@FY28E': 'GAM ₹{{F.pat.1|num}} cr vs management goal ₹1,100 cr+.',
};

module.exports = { risks, glossary, statementNotes };
