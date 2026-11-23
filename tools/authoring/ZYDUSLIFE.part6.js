// Zydus Lifesciences report, part 6: risks and honest summary, glossary, statement notes.
const X = require('./ZYDUSLIFE.ctx');
const { ruleText } = require('../../src/ratings');
const { F, V, n0, n1, price, HA, MULT, epsSep, rating, buyBelow, sellAbove, medTp, fwdNow, sepNow, taxRows, SH_POST, mv } = X;
const eps = epsSep.base;

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: `Our honest summary: a better company than its US business suggests, at a price that assumes the best; ${rating}`,
  blocks: [
    { callout: '**What you are buying:** India\'s #1 oncology company with a 54%-chronic branded franchise growing ~15-20%, a fast-growing emerging-markets business, two home-grown new molecules and a US NDA under priority review; the #3 US generics supplier by prescriptions with a clean FDA record; leading consumer brands; and a family owner that thinks in decades. Also: ₹7,000+ cr of recent acquisitions that have yet to earn their cost, a 42% minority leak in the consumer arm and a US business that has lost its two windfalls.' },
    { callout: `**What you are paying:** ${n1(price / F.eps[0])}x our FY27E and ${n1(fwdNow)}x FY28E EPS (${n1(sepNow)}x Sep-28E) for EPS that falls ~{{F.epsGrowth.0|chg}} in FY27E and is back above FY26's ₹50.1 only in FY29E. Zydus's own forward P/E since 2021 has a median of ${n1(HA.med)}x on EPS before one-offs; pharma trades ~5% above its five-year medians. On the street's method and the house multiple the target is {{dcf.tp|inr}} ({{dcf.upside|chg}}): ${rating}.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      [`Price below ~₹${n0(buyBelow)} (BUY on our rule)`, 'Low-Medium', `The stock would have to fall ~${Math.round((1 - buyBelow / price) * 100)}%`],
      ['Saroglitazar approved on time with a strong first year in PBC', 'Medium', 'FDA action by Q4FY27; launch Apr-2027; scripts vs the two PPAR incumbents'],
      ['US$ sales hold above US$330 mn a quarter despite Mirabegron competition', 'Low-Medium', 'Quarterly US$ sales; generic entrants on Myrbetriq'],
      ['Acquisitions earn their keep: MedTech profitable, Zydus Wellness PAT back above ₹350 cr', 'Medium', 'Segment results; Zydus Wellness quarterly profit'],
      ['Margin back to 26%+ without forex gains', 'Low', 'EBITDA margin excluding the forex line'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['Faster erosion in generic Myrbetriq and the US base', 'Medium', 'Each US$10 mn a quarter of lost sales at ~60% contribution is ~₹230 cr of EBITDA, ~4% of EPS'],
      ['Saroglitazar delayed, rejected or slow; launch costs continue', 'Medium', 'FY29E EPS 5-10% lower; our bear case'],
      ['USFDA action at a key site (injectables, Moraiya, acquired UK/US plants)', 'Low-Medium', 'Launch freeze; remediation costs'],
      ['US price-fixing bellwether verdicts (2026-2028)', 'Low-Medium', 'Unprovided liability; headline risk'],
      ['Rupee strengthens', 'Low-Medium', 'Each ₹1/US$ is ~₹140 cr of North America revenue; forex gains reverse to losses'],
      ['More large acquisitions', 'Medium', 'Higher debt, amortisation and minorities; EPS dilution'],
      ['Pharma sector de-rates back to its medians', 'Medium', `At ${MULT.bear}x (bear multiple) on base EPS the stock is worth ~₹${n0(Math.round(MULT.bear * eps / 10) * 10)}`],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**We would move to HOLD above a target-to-price gap of −5%, i.e. a price below ~₹${n0(sellAbove)},** and to BUY below ~₹${n0(buyBelow)} on today's numbers, or sooner if Saroglitazar's launch and US$ sales beat our base.`,
      `**This is mostly a valuation call.** Our FY28E EPS is ~11% below the post-Q1 street, but the bigger gap is the multiple: the street pays 23-25x one-year-forward EPS; Zydus's own history supports ~${MULT.base}x after the sector re-rating. At the street's 23x on our Sep-28E EPS the stock would be worth ~₹${n0(Math.round(23 * eps / 10) * 10)}, roughly today's price: there is no upside even on the street's multiple.`,
      `**Biggest swing factors:** the multiple (each 1x is ~₹${n0(eps)} a share) and the US (each US$10 mn a quarter is ~₹${n0(230 * (1 - taxRows[1].rate / 100) / SH_POST * MULT.base)} a share at our multiple).`,
      `**Where we could be wrong:** our EV/EBITDA and DCF cross-checks (₹${n0(mv('ev').value)} and ₹${n0(mv('dcf').value)}) say the business is worth more if the acquisitions' amortisation and interest are temporary costs of growth. If Zydus proves that in FY28-29, the right multiple is the street's, not its history.`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'India formulations growth, Q1FY27', v: '+20%', d: 'IPM ~+10-11%; chronic 54.2%' },
      { k: 'US sales, Q1FY27', v: 'US$327 mn', d: 'US$372 mn a year earlier (gRevlimid)' },
      { k: 'EBITDA margin, Q1FY27', v: '24.1%', d: 'FY26 31.2% incl. 4.4 points of forex gains' },
      { k: 'Price ÷ our Sep-28E EPS', v: `${n1(sepNow)}x`, d: `median since 2021: ${n1(HA.med)}x (forward, before one-offs)` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['Generic / gRevlimid', 'A copy of a drug whose patent has expired or been settled. gRevlimid = generic lenalidomide (Revlimid), sold under settlements that capped volumes until end-Jan-2026.'],
      ['Limited-competition windfall', 'Profits from a generic launched with only a few competitors (volume caps, patent settlements), which fall away when competition arrives. Not a one-off accounting item, so it stays in reported EPS.'],
      ['ANDA / NDA / 505(b)(2)', 'US filings: ANDA for a generic copy; NDA for a new drug; 505(b)(2) for a new form of an existing drug (e.g. a ready-to-use liquid) that relies partly on existing data.'],
      ['Biosimilar', 'A near-copy of a biological drug (antibody, protein), e.g. nivolumab or ranibizumab. Harder and costlier to make than a generic, so fewer competitors.'],
      ['NCE / PBC', 'New chemical entity (a new molecule). PBC = primary biliary cholangitis, a chronic liver disease; Saroglitazar\'s US target.'],
      ['IPM / chronic', 'Indian pharmaceutical market; chronic therapies are long-term treatments (heart, diabetes, cancer) as opposed to acute (antibiotics, pain).'],
      ['USFDA inspection: EIR, NAI, VAI, OAI', 'Establishment inspection report closes an inspection. NAI = no action, VAI = voluntary action (minor issues), OAI = official action (can block approvals).'],
      ['EBITDA (company basis)', 'Profit before interest, tax, depreciation and amortisation; Zydus\'s includes exchange gains booked in other expenses (₹1,198 cr in FY26).'],
      ['Exceptional items / one-offs', 'Large unusual gains or charges (settlements, impairments, sale gains). We compute the multiple on EPS before them.'],
      ['Minorities (non-controlling interest)', 'The share of a subsidiary\'s profit owned by others: 42.41% of Zydus Wellness.'],
      ['Forward P/E', 'Share price ÷ next full year\'s EPS. Sep-28E = half FY28E + half FY29E, the earnings the market looks at in a year.'],
      ['Sector factor', 'How far pharma peers trade above or below their own five-year median P/E (+5.45% for Zydus, PLAYBOOK §7c).'],
      ['EV/EBITDA', 'Enterprise value (market value plus net debt and minorities) ÷ EBITDA.'],
      ['DCF / WACC / Ke', 'Discounted cash flow; weighted average cost of capital; cost of equity (risk-free rate + beta × equity risk premium).'],
      ['PPA', 'Purchase price allocation: splitting an acquisition\'s price into identifiable assets (brands, customer lists) that are amortised and goodwill that is not.'],
      ['Buyback', 'The company buys its own shares: 8.73 mn at ₹1,260 in Jun-2026 (₹1,100 cr), cutting the count to 99.75 cr.'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'pat@FY20': '−36%, including ₹297 cr of exceptional items after tax (Screener).',
  'otherIncome@FY22': '₹2,581 cr: includes the gain on selling the animal-health business (Screener nets one-offs into other income).',
  'pat@FY22': '₹4,487 cr incl. the animal-health sale gain; ₹2,129 cr before one-offs (company adjusted PAT).',
  'pat@FY23': '₹1,960 cr after ₹428 cr of exceptional charges; ₹2,569 cr adjusted.',
  'otherIncome@FY23': '−₹422 cr: exceptional charges netted into other income.',
  'ebitdaMargin@FY24': '+510bp to 27.5%: gRevlimid and generic Myrbetriq in the US.',
  'pat@FY24': '+97%: the windfall years begin in earnest.',
  'ebitdaMargin@FY25': '30.4%: record at the time; US$1,307 mn of North America sales.',
  'cfo@FY25': '₹6,781 cr: working capital released; net cash ₹4,888 cr at Mar-25.',
  'sales@FY26': '+17%: Comfort Click (₹1,186 cr) and Amplitude (₹772 cr) consolidated; international +40%.',
  'ebitdaMargin@FY26': '31.2% incl. ₹1,198 cr of operating forex gains (26.8% without).',
  'dep@FY26': '+54%: acquisitions (Amplitude, Comfort Click, Agenus plants) and the Mirabegron licence from Feb-2026.',
  'otherIncome@FY26': '−₹7 cr: other income ₹509.5 cr less ₹516.6 cr of exceptional items (Mirabegron settlement ₹397.5 cr, labour codes ₹84.9 cr, deal costs).',
  'cfo@FY26': '₹2,117 cr, 25% of EBITDA: Mirabegron payments (₹1,060 cr incl. the licence), acquired working capital.',
  'capex@FY26': '₹2,672 cr on Screener incl. capitalised items; organic capex ₹1,715 cr.',
  'sales@FY27E': 'Acquisitions annualising (~6 points), India +15%, international +22%, a weaker rupee; US$ sales +2.5%.',
  'ebitdaMargin@FY27E': 'No gRevlimid, Mirabegron licence fee in costs, Saroglitazar spending; guidance ~24%.',
  'dep@FY27E': 'Excludes the Mirabegron licence amortisation (₹418 cr), carried in other income; reported D&A ~₹2,374 cr.',
  'otherIncome@FY27E': 'Treasury ₹400 cr + JV ₹100 cr − licence amortisation ₹418 cr (engine workaround).',
  'pat@FY27E': 'Down ~25%: lower margin, higher D&A, interest and minorities.',
  'capex@FY27E': 'Organic ₹1,550 cr + Assertio ₹1,594 cr (no acquisitions line in the engine).',
  'ebitdaMargin@FY28E': 'Saroglitazar launch year; more Mirabegron competition.',
  'pat@FY29E': '+25%: Saroglitazar ramp, the licence amortisation ends, lower interest.',
};

module.exports = { risks, glossary, statementNotes };
