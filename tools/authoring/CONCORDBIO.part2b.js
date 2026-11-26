// Concord Biotech report, part 2b: industry and the tailwind test.
const X = require('./CONCORDBIO.ctx2');
const { D, n1, P, SECTOR, Q1, FY26 } = X;

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Fermentation APIs: a slow-growing, high-barrier corner of the API market, dominated by a few Chinese, European and Indian makers',
  blocks: [
    { p: `About 30% of the world's APIs by value are biological rather than synthetic (Fortune Business Insights, cited in AR FY26), and the microbial (fermentation) API market is growing ~6.7% a year to 2030. The barriers are physical and technical: large sterile fermenters, strains that must be improved for years to give a commercial yield, long cycles and heavy working capital, plus regulatory approval for every site and molecule. That keeps the number of credible suppliers per molecule small, which is why Concord's gross margin (after materials) has stayed at 74-79%. The flip side is that the molecules are old: tacrolimus, mycophenolate and cyclosporine have been generic for years, demand grows slowly, with the number of patients on lifelong therapy, and each new supplier usually wins share on price.` },
    { exhibit: { type: 'table', title: 'What drives demand for Concord\'s molecules, and what holds it back', head: ['Force', 'Direction', 'Evidence (to 30-Sep-2026)'], wide: [2], rows: [
      ['Transplants and chronic immunosuppression', 'Slow, steady', 'Lifelong therapy after a transplant; immunosuppressants are "chronic therapies where supply disruptions cannot persist" (Q4FY26 call)'],
      ['Supply-chain de-risking away from single sources', 'Positive', 'Customers "increasingly focused on derisking their supply chain and shifting business towards us" (Q4FY26 call); second-source wins in Nystatin and fusidic acid'],
      ['US tariffs', 'Negative in H1FY26, then neutral', 'Uncertainty froze orders in H1FY26; "tariffs do not apply to generic products" (Q3FY26 call); a later talk of 100% tariffs on generics drew no customer concern (Q1FY27 call)'],
      ['Regulatory approvals for exports', 'Swing factor', 'CDSCO written-confirmation delay stopped EU supplies for ~3 months in FY26; ANVISA, Kenya and Uganda inspections in Q1FY27'],
      ['Geopolitics', 'Negative', 'Middle East exposure ~₹50 cr; a ~₹25 cr tender on hold since Q3FY26'],
      ['Pricing', 'Negative for mature molecules', 'No price growth in FY26 ("all volume"); Q1FY27 wallet-share gains "primarily driven by pricing"'],
      ['India-EU free trade agreement; Biopharma SHAKTI (₹10,000 cr over five years)', 'Positive, long term', 'Announced early 2026 (Q3FY26 call)'],
    ], source: 'AR FY26 MD&A; Q3FY26, Q4FY26 and Q1FY27 calls; ICRA' } },
    { p: `**Competition.** Concord does not name its competitors. Its own decks describe fusidic acid as having "limited competition mainly from European manufacturers", and its new launches enter "as a second source" at "an aggressive price". In India the other large fermentation API maker is Biocon (its generics business makes several of the same immunosuppressants and statins); Biocon trades at ${n1(P.BIOCON.pe)}x trailing EPS, distorted by its biologics business. Most listed Indian API makers (Divi's, Laurus, Granules, Neuland) are mostly chemistry-based.` },
    { callout: '**So what:** the industry gives Concord pricing power through scarcity, not growth. Its growth has to come from taking share (often on price), launching the next niche molecule every year, and moving into formulations, injectables and contract work.' },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Does the sector tailwind reach Concord? Partly: supply de-risking yes, the CDMO boom and pharma re-rating not yet',
  blocks: [
    { exhibit: { type: 'table', title: 'Sector tailwinds and whether Concord captures them', head: ['Tailwind', 'Reaches Concord?', 'Evidence'], wide: [2], rows: [
      ['China+1 / second sourcing', '**Yes, partly**', `Exports +46% in Q1FY27; new customers and higher wallet share, but won mostly on price`],
      ["Indian CDMO boom (Divi's, Sai Life, Anthem re-rated)", '**Not yet**', `CDMO is 1-2% of revenue; "a time-consuming process"; one animal-health project worth "a couple of million dollars"`],
      ['US generic demand', '**Indirectly**', `US direct sales ₹${n1(FY26.usa)} cr in FY26 (−22%); most US exposure runs through Indian formulators`],
      ['Injectables shortage / Indian sterile capacity', '**Not yet**', `Plant ~${Q1.utilisation.injectables}% utilised; contract sales from H2FY27; emerging-market approvals take 12-15 months`],
      ['Pharma re-rating', '**Not in the price**', `Pharma peers trade +${SECTOR}% above their medians since Jan-2024; Concord trades ~${Math.round(-X.ownFwdMv)}% below its own forward median`],
    ], source: 'Q1FY27 deck and call; AR FY26 note 40; Screener.in; GAM Research' } },
    { callout: `**Verdict:** the tailwind Concord is best placed for is the one it has always had, being one of few qualified fermentation suppliers. The newer tailwinds (CDMO, injectables, the US front end) are where its growth story points, but in Q1FY27 they were still costs. We give them some credit in FY28-29E formulation growth (+18-20%), not in the multiple.` },
  ],
};

module.exports = { industry, tailwind };
