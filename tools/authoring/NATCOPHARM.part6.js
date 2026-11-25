// Natco Pharma report, part 6: risks and honest summary, glossary, statement notes.
const X = require('./NATCOPHARM.ctx2');
const { F, A, OB, n0, n1, pc, price, FM, MULT, SENS, val, rating, buyBelow, sellAbove, ruleText, peFY27, peFY28, peSep, peTtm, assocPct, RI } = X;

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: `Our honest summary: a patent-bet company between jackpots, with a third of profit from a minority stake; ${rating} on the house multiple`,
  blocks: [
    { callout: `**What you are buying:** a ~₹3,000 cr revenue generics business with a strong record of finding limited-competition US products, fast-growing Brazil and India franchises, a steady Canadian business, ~₹1,400 cr of net cash after the July Adcock tranche (before the ₹1,279 cr rights issue), and 49% of South Africa's #2 drug maker that adds ~${n1(assocPct[1])}% of FY28E profit. Also some lottery tickets: eGenesis, NRC-2694, US semaglutide.` },
    { callout: `**What you are paying:** ${n1(peFY27)}x our FY27E and ${n1(peFY28)}x FY28E EPS (${n1(peSep)}x Sep-28E; ${n1(peTtm)}x trailing EPS that still includes gRevlimid quarters). Natco's own forward P/E since 2021 has a median of ${n1(FM.median)}x once the trough years are dropped; the street pays ~18x core earnings. On our rule (${ruleText}) the stock is a BUY below ~₹${n0(buyBelow)} and a SELL above ~₹${n0(sellAbove)}.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      [`A reviewer decision that the trough rule should not cut the post-windfall years`, 'Policy', `The all-years median gives ${SENS.all}x and ₹${n0(val(SENS.all))} (see the valuation chapter)`],
      ['FY28 US exclusivities named and launched with few competitors', 'Medium', 'Carfilzomib launch date (CY2027 expected); the second product; FY28 US sales above our ₹1,080 cr'],
      ['Olaparib trial win with exclusivity kept', 'Low-Medium', 'Trial "in the next few months"; FDA exclusivity determination'],
      ['Brazil and India keep compounding at 20%+', 'Medium', 'Brazil above US$60 mn in FY27; domestic above ₹540 cr'],
      ['A cheap acquisition, or a buyback', 'Low', 'Price paid vs the 11.9% cost of equity; management has ruled out buybacks'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['US launches slip or face many generics (carfilzomib shared on 60 mg; olaparib exclusivity in doubt)', 'Medium', 'FY28E EPS down 10-15%; the bear case'],
      ['Adcock profits fall (rand, South African pricing) or Natco overpays for the remaining 51%', 'Medium', 'A third of profit; Bidvest controls the dividend'],
      ['An expensive "very large" acquisition', 'Medium', 'Management wants one outside India; the rights issue gives it more cash'],
      ['USFDA: Visakhapatnam inspection or a repeat at Kothur', 'Low-Medium', 'Would delay the FY28 launches (the 2024 Kothur warning letter took 17 months to close)'],
      ['Semaglutide price war in India deepens; crop-protection losses', 'Medium', 'Small in rupees; signals the base is weaker than it looks'],
      ['US tariffs on Indian generics', 'Low-Medium', 'Partners absorb part; exclusivity products less price-sensitive'],
    ], source: 'GAM Research' } },
    { callout: `**How we would act:** ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}), bull {{scen.bull.tp|inr}}, bear {{scen.bear.tp|inr}}. We are not saying Natco is a bad company: its base is growing and its balance sheet is strong. We are saying that on the house method, which anchors the multiple to what the market paid for Natco's own earnings since 2021, ₹${n0(price)} already prices more than our ₹${n1(X.epsSep.base)} of Sep-28E EPS supports. The decision for a reviewer is whether the trough rule should apply at the end of a windfall; if not, the stock is closer to fair value (₹${n0(val(SENS.all))} at ${SENS.all}x).` },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['Generic / gRevlimid', 'A copy of a drug whose patent has expired or been settled. gRevlimid = generic lenalidomide (Revlimid), which Natco\'s partner sold in the US under a volume-limited licence from Mar-2022 until full generic entry on 31-Jan-2026.'],
      ['Para-IV filing / FTF', 'A US generic application that challenges the brand\'s patents. The first to file (FTF) can win 180 days of exclusivity, shared if several file on the same day.'],
      ['Tentative approval (TA)', 'FDA says the generic is approvable but cannot launch until patents or exclusivities end; missing a TA within 30 months can forfeit the 180 days.'],
      ['Profit share', 'Natco makes the product; a US partner sells it and pays Natco a share of the profit, booked as revenue (partly on estimates).'],
      ['Refund liability / price protection', 'A provision for credits owed to the sales channel when a product\'s price falls; ₹494.5 cr at Mar-26.'],
      ['Associate (equity method)', 'A company in which Natco owns 20-50% (Adcock, 49%): Natco books its share of profit in one line below tax, not the revenue or costs.'],
      ['Limited-competition windfall', 'Profits from a generic sold with only a few competitors that end when competition arrives. Not a one-off accounting item, so it stays in the reported history (PLAYBOOK §7c).'],
      ['Trough year (house rule)', 'A forward year whose EPS is a loss or below half the best EPS of the previous three years; left out of the own-history P/E median (PLAYBOOK §4).'],
      ['Sep-28E EPS', 'Half of FY28E plus half of FY29E EPS: the earnings the market looks at for a 12-month target set in Sep-2026.'],
      ['EBITDA (Screener basis)', 'Revenue from operations less operating costs, before other income, depreciation, interest and tax. Natco\'s own "EBITDA" includes other income.'],
      ['CTPR', 'Chlorantraniliprole, an insecticide; the first big product of Natco\'s Crop Health Sciences division.'],
      ['Rights issue / TERP', 'New shares offered to existing holders in proportion to holdings (2 for 21 at ₹750). TERP = theoretical price after the issue.'],
      ['EIR / Form 483 / warning letter', 'USFDA documents: a 483 lists inspection observations; a warning letter is a formal finding of serious violations; an EIR closes an inspection.'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'sales@FY17': '+94%: US launches (generic Tamiflu, first to file, 2016) and hepatitis-C sales in India (company milestones).',
  'pat@FY18': '+43%: generic Copaxone (2017) and a full year of the US exclusivity products.',
  'pat@FY20': '−29%: exclusivity profits faded; US price erosion.',
  'sales@FY22': '−5%; EBITDA margin 14%: the pre-gRevlimid trough; API sales halved (₹512 cr to ₹248 cr) while exports grew slowly (AR FY24 segment table).',
  'pat@FY22': '−62% to ₹170 cr (EPS ₹9.2): the trough year before gRevlimid.',
  'sales@FY23': '+39%: first full year of gRevlimid in the US (launched Mar-2022); US revenue ₹1,606 cr.',
  'pat@FY23': '4.2x: gRevlimid profit share.',
  'sales@FY24': '+48%: gRevlimid volume quota rose; US revenue ₹2,805 cr.',
  'ebitdaMargin@FY24': 'Up ~930bp to 43.9%: high-margin profit share.',
  'sales@FY25': '+11% to the ₹4,430 cr peak; US revenue ₹3,149 cr.',
  'pat@FY25': '+36% to ₹1,883 cr (EPS ₹104.4), incl. a ₹90 cr gain on sale of land (other income).',
  'ebitdaMargin@FY25': '49.6%: the peak windfall year.',
  'sales@FY26': '−8%: lenalidomide sold in Q1-Q2 only (Q3 "0 Revlimid"); unlimited generic entry from 31-Jan-2026.',
  'pat@FY26': '−25% to ₹1,418 cr, incl. a ₹115 cr one-time deferred-tax credit and ₹46.6 cr of Adcock profit (from 11-Nov-2025).',
  'sales@FY27E': 'GAM: no lenalidomide; Brazil, India and the US base partly offset.',
  'pat@FY27E': 'GAM: ~₹720 cr vs ~₹750 cr guidance; Adcock ~30% of profit.',
};

module.exports = { risks, glossary, statementNotes };
