// UPL report, part B (4b of 4): risks & honest summary, glossary, annotated-statement notes.
const X = require('./UPL.common');
const { F, V, n0, n1, price, mv, epsSep28 } = X;
const { ruleText, buyBelow: buyAt, sellAbove: sellAt } = require('../../src/ratings');
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;
const sotpV = mv('sotp').value;

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: 'Our honest summary: a better business than in FY24, at a fair price for its earnings',
  blocks: [
    { callout: '**What you are buying:** a global off-patent crop-protection group with unmatched registrations and reach, a high-quality seeds business (Advanta), a growing specialty-chemicals arm, and a management team that has cut gross debt by $850 mn in a year. Attached: net debt of $1.6-2.5 bn depending on the season, ₹10,000 cr of factored receivables, a 3.7% net margin, minority partners in three of four platforms, and a reorganisation that will turn UPL Ltd into a holding company.' },
    { callout: `**What you are paying:** ${n1(price / F.eps[0])}x FY27E and ${n1(price / F.eps[1])}x FY28E EPS on our numbers (which are below the street's), and roughly half of what the platforms would be worth if listed separately. On the street's own method and our inputs the target is {{dcf.tp|inr}} ({{dcf.upside|chg}}): short of our 15% BUY threshold. The upside case is real but depends on two things UPL does not fully control: the crop-protection cycle and the size of the holding-company discount after the reorganisation.` },
    { exhibit: { type: 'table', title: 'What would make it a BUY', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      [`Price below ~₹${n0(buyBelow)} (15%+ upside to our target)`, 'Medium', 'Share price around the Q2FY27 results'],
      ['EPS beats our path: finance costs and FX/associate losses fall faster', 'Medium', 'Quarterly net finance cost below ₹550 cr; PATMI conversion of EBITDA above 30%'],
      ['Advanta lists at a high multiple and UPL uses the proceeds to cut debt', 'Medium', 'IPO pricing (SEBI approval valid to ~Jun-2027); net debt/EBITDA towards 1.2-1.5x'],
      ['Holding-company discount narrows after UPL Global lists', 'Low-medium', 'Market value of UPL Ltd vs its stakes in UPL Global and Advanta'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What would make it a SELL', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['A new Chinese generic price war (FY24 repeat)', 'Medium', 'UPL Corp margin back to single digits; EPS could halve (bear case {{scen.bear.tp|inr}})'],
      ['Latin American credit stress', 'Medium', 'More credit-loss provisions (₹750 cr in FY26); banks less willing to factor receivables'],
      ['Weather (El Niño) and a weak Indian season', 'Medium', 'H2FY27 volumes in India, Australia and parts of Latin America'],
      ['Reorganisation leaks value or stalls', 'Low-medium', 'Larger holdco discount; PE investors sell UPL Global shares after listing'],
      ['Rupee strength', 'Low', 'Reverses the FX tailwind in reported revenue'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: HOLD, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**Buy below ~₹${n0(buyBelow)}**, or on evidence that earnings, not just EBITDA, are compounding (Sep-28E EPS of ₹${n1(epsSep28)} looking conservative).`,
      `**Sell above ~₹${n0(sellAbove)}** without a matching rise in earnings, or on signs of a new generic price war.`,
      `**Biggest swing factor:** how much of UPL's EBITDA reaches its shareholders. The sum of the parts says ₹${n0(sotpV)}; earnings say {{dcf.tp|inr}}.`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Company EBITDA, FY26', v: '₹9,588 cr', d: '+18%; profit for shareholders ₹1,922 cr' },
      { k: 'Finance costs, FY26', v: '₹3,401 cr', d: '37% of statutory EBITDA' },
      { k: 'Net debt, Jun-26', v: '$2.5 bn', d: '2.4x EBITDA; plus ₹6,755 cr factored' },
      { k: 'Minority partners', v: '9-22%', d: 'in UPL Corp, UPL SAS and Advanta' },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'UPL FY26 and Q1FY27 presentations, GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['Crop protection / agrochemicals', 'Herbicides (weeds), fungicides (diseases) and insecticides (pests) sprayed on crops.'],
      ['Off-patent / post-patent (generic)', 'A molecule whose patent has expired, so any registered maker can sell it; prices are set by competition, often from China.'],
      ['Active ingredient (AI)', 'The chemical that does the work; it is formulated with other ingredients into the product farmers buy.'],
      ['Registration', 'Government approval to sell a product in a country; costly and slow to obtain, so a barrier to entry.'],
      ['Destocking', 'Distributors running down their inventories instead of buying, which cuts manufacturers\' sales (FY24).'],
      ['Biosolutions / NPP', 'Biological crop-protection and nutrition products; UPL calls its range Natural Plant Protection.'],
      ['Platform', 'UPL\'s term for each of its four businesses (UPL Corp, UPL SAS, Advanta, SUPERFORM), each with its own board and, in three cases, outside investors.'],
      ['Contribution', 'Revenue less variable costs (materials, freight); UPL\'s key margin measure before SG&A.'],
      ['Company vs statutory EBITDA', 'UPL\'s EBITDA excludes exchange losses on trade balances and associate losses; the statutory (Screener) figure includes them.'],
      ['PATMI', 'Profit after tax and minority interests: the profit that belongs to UPL\'s own shareholders.'],
      ['Minority (non-controlling) interests', 'The share of a subsidiary\'s profit and equity owned by outside investors (here TPG, ADIA, Brookfield, KKR, Alpha Wave).'],
      ['Holding-company (holdco) discount', 'The gap between a parent\'s market value and the value of its stakes in subsidiaries.'],
      ['Non-recourse factoring', 'Selling receivables to a bank for cash; the bank bears the credit risk, and the receivable leaves the balance sheet.'],
      ['Offer for sale (OFS)', 'An IPO in which existing shareholders sell shares; the company itself raises no money.'],
      ['Sum of the parts (SOTP)', 'Valuing each business separately and adding them up, less debt and outside owners\' shares.'],
      ['EV/EBITDA', 'Enterprise value (market value plus net debt) divided by EBITDA.'],
      ['DCF / WACC', 'Discounted cash flow valuation; WACC is the blended cost of debt and equity used to discount the cash flows.'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'sales@FY20': 'Arysta LifeScience consolidated for the first full year: revenue +64%.',
  'pat@FY20': 'Interest and amortisation on the Arysta acquisition absorb most of the extra EBITDA.',
  'sales@FY24': 'Global destocking and Chinese generic price collapse: revenue −20%.',
  'ebitdaMargin@FY24': 'Margin halves to 10% on price cuts, high-cost inventory and credit-loss provisions.',
  'pat@FY24': 'Attributable loss of ₹1,200 cr; minorities absorbed part of the group loss.',
  'pat@FY25': 'Includes a ₹592 cr tax reversal after an appellate order.',
  'pat@FY26': 'EBITDA +27% (statutory) and lower finance costs; minorities take ₹298 cr.',
  'otherIncome@FY26': 'Includes a ₹61 cr exceptional gain.',
  'sales@FY27E': 'GAM: +9% (guidance 7-11%); currency helps, crop-protection volumes recover from Q2.',
  'pat@FY28E': 'Lower finance costs; minorities rise after UPL sells 7.8% of Advanta in the IPO.',
  'pat@FY29E': 'EBITDA margin 19.5% (statutory), finance costs ₹2,550 cr.',
};

module.exports = { sections: () => [risks], glossary, statementNotes };
