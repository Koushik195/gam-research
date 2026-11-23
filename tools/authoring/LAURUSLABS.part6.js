// Laurus Labs report, part 6: risks & honest summary, glossary, statement notes.
const X = require('./LAURUSLABS.ctx');
const { F, V, n0, n1, price, mv, peMult, epsSep28, rating, ruleText, buyBelow, sellAbove, fwdNow, peSep, EXM, K, Q1, cdmoShare, impliedPeAtPrice } = X;

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: 'Our honest summary: a better business than the market paid ₹300 for in 2023, but not one worth twice its history',
  blocks: [
    { callout: `**What you are buying:** an ARV leader that supplies a third of the world's HIV patients at low cost, turned into one of India's larger contract manufacturers for innovators: CDMO 43% of Q1FY27 revenue, three patented APIs in commercial supply, >125 projects, a clean USFDA record and capex tied to customer demand, plus options in fermentation, peptides, cell and gene therapy and ADCs. Earnings should grow ~${n1(X.epsCagrFwd)}% a year to FY29E on our numbers.` },
    { callout: `**What you are paying:** ${n1(peSep)}x our Sep-28E and ${n1(fwdNow)}x FY28E EPS after the stock doubled in six months. Our ${peMult}x Sep-28E multiple is Laurus's own 2021-26 median (${n1(EXM.med)}x, trough years out) lifted ${Math.round((K - 1) * 1000) / 10}% for a sector trading above its history, and gives {{dcf.tp|inr}} ({{dcf.upside|chg}}). The EV/EBITDA cross-check agrees (₹${n0(mv('ev').value)}); the DCF (₹${n0(mv('dcf').value)}) says cash flows support far less. The price assumes the CDMO ramp continues for years without a stumble.` },
    { p: `**Is it a SELL on the business?** No. We expect strong earnings growth and our forecasts sit with the street. The stock is a SELL because the rule compares the price with a target built from the multiple the market has paid for Laurus over five years, and the price (~${n1(impliedPeAtPrice)}x Sep-28E EPS) is far above it, above even our bull case. Momentum, index inclusion and a strong Q2 could keep the stock high for a while; we would revisit the multiple only on public evidence of a structurally larger CDMO business (disclosed commercial contracts, sustained commercial share above 60%, asset turns back above 1.2x), not on price.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      ['CDMO holds ~₹800 cr+ a quarter through FY27 as Phase III programmes convert', 'Medium', 'Quarterly CDMO revenue; commercial share above 55%'],
      ['A disclosed large peptide or new-modality contract', 'Low-medium', 'SEBI filings; customer advances; capex approvals'],
      ['Asset turns rise above 1.2x and free cash flow turns positive despite capex', 'Low-medium', 'Revenue ÷ gross block; operating cash flow vs capex'],
      [`A fall in the price towards ~₹${n0(buyBelow)}`, 'n.a.', 'At that level the rule turns BUY on today\'s numbers'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['Launch and Phase III stocking pauses (45% of Q1 CDMO revenue)', 'Medium', 'CDMO falls back towards ₹500-600 cr a quarter; bear case {{scen.bear.tp|inr}}'],
      ['A large CDMO programme fails in the clinic or loses share', 'Medium', 'A hole like FY24; operating leverage works in reverse'],
      ['ARV prices or volumes fall (donor funding, long-acting injectables)', 'Low-medium', 'Pressure on ~₹2,800 cr of revenue and plant utilisation'],
      ['New plants run below capacity; capex overruns', 'Medium', 'Depreciation and interest rise ahead of revenue; ROE falls'],
      ['Regulatory action at a key site', 'Low', 'Lost CDMO awards; customers move products'],
      ['Advanced-biologics bets need more money', 'Medium', 'R&D stays near 5-6% of sales; associate losses'],
      ['The multiple reverts to its history', 'High', 'Even with our earnings, ~40% downside at the median multiple'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**We would turn buyers below ~₹${n0(buyBelow)}** and stay sellers above ~₹${n0(sellAbove)} on today's numbers; between the two the rule says HOLD.`,
      `**Biggest swing factor: the multiple.** Each 1x on Sep-28E EPS of ₹${n1(epsSep28)} is ~₹${n0(epsSep28)} a share; the street's P/E users pay 55-65x.`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'CDMO share of revenue', v: `${Math.round((Q1.cdmoSM + Q1.bio) / Q1.revenue * 100)}%`, d: `Q1FY27; FY29E ~${Math.round(cdmoShare(2))}%` },
      { k: 'Commercial share of CDMO', v: `${Q1.cdmoCommercialPct}%`, d: 'Q1FY27 (50% in FY26)' },
      { k: 'Capex FY27E', v: '₹2,000 cr', d: '~24% of sales; asset turn ~1.0x' },
      { k: 'Forward P/E', v: `${n1(fwdNow)}x`, d: `FY28E; target ${peMult}x Sep-28E` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['API', 'Active pharmaceutical ingredient: the chemical in a medicine that has the effect.'],
      ['Intermediate', 'A chemical made on the way to an API; "advanced intermediates" are the last steps before it.'],
      ['CDMO / CMO', 'Contract development and manufacturing organisation: makes an innovator\'s patented molecule to its process. Laurus uses CMO for contract supply of off-patent (generic) products.'],
      ['NCE', 'New chemical entity: a new, patented drug molecule.'],
      ['Phase III / commercial supply', 'Phase III is the last clinical trial stage before approval; commercial supply starts after the customer\'s drug is approved.'],
      ['ARV / TLD', 'Anti-retroviral HIV medicines; TLD is the standard tablet of tenofovir, lamivudine and dolutegravir.'],
      ['Long-acting injectable / lenacapavir', 'HIV medicines injected every few months instead of daily tablets; lenacapavir is Gilead\'s twice-yearly injection.'],
      ['FDF', 'Finished dosage form: the tablet or capsule a patient takes.'],
      ['DMF / dossier', 'Regulatory files that let customers use Laurus\'s API, or let Laurus sell a formulation, in a market.'],
      ['USFDA / EIR / warning letter', 'US drug regulator; an establishment inspection report closes an inspection; a warning letter or import alert can stop shipments.'],
      ['Precision fermentation', 'Using engineered microbes in fermenters to make enzymes, proteins or chemicals.'],
      ['CAR-T / gene therapy / ADC', 'Cell therapy using a patient\'s modified immune cells; therapy that delivers genes; antibody-drug conjugates that carry a drug to cancer cells.'],
      ['Peptide / GLP-1', 'Short chains of amino acids; GLP-1 drugs for diabetes and obesity are peptides.'],
      ['Gross margin / EBITDA margin', 'Revenue less materials; operating profit before depreciation, interest, tax and other income, as % of revenue (Screener basis).'],
      ['Asset turn', 'Revenue ÷ gross block of plant and equipment.'],
      ['Forward P/E / EV/EBITDA', 'Share price ÷ next full year\'s EPS; enterprise value (market value plus net debt) ÷ EBITDA.'],
      ['Sep-28E', 'Half FY28E plus half FY29E: the earnings the market will look at in twelve months.'],
      ['forwardMedian / sector factor / trough rule', 'House rule: the stock\'s median forward P/E since Apr-2021, leaving out dates whose forward EPS was below half the prior three-year peak, multiplied by how far sector peers trade above or below their five-year median P/E.'],
      ['DCF / WACC', 'Discounted cash flow value; weighted average cost of capital (here 12.3%).'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'sales@FY21': '+70%: ARV formulation and API surge; EBITDA margin 32%.',
  'pat@FY21': '+285%: peak profit year (EPS ₹18.3).',
  'ebitdaMargin@FY21': 'Peak 32%.',
  'sales@FY23': '+22%: a very large one-off CDMO purchase order (CDMO ₹2,167 cr); ARV formulations fell.',
  'sales@FY24': '−17%: the purchase order ended; ARV destocking.',
  'ebitdaMargin@FY24': 'Trough 15.5%: lost CDMO volume on a larger fixed-cost base.',
  'pat@FY24': '−80%: EPS ₹3.0.',
  'otherIncome@FY25': 'Includes the ₹57 cr profit on land sold to the KRKA JV (Screener: exceptional).',
  'pat@FY25': '+122%, incl. ~₹39 cr after-tax land-sale gain.',
  'sales@FY26': '+23%: CDMO +38%, formulations +26%.',
  'ebitdaMargin@FY26': '+7pts: gross margin 60.4% on CDMO mix and softer raw materials.',
  'cfo@FY26': '₹1,624 cr, helped by customer advances (₹645 cr at Mar-26).',
  'capex@FY26': '₹1,070 cr, 16% of sales; FY27 guided at ₹2,000 cr.',
  'capex@FY27E': 'Company guidance: ₹2,000 cr.',
  'sales@Q1FY27': '+29%: CDMO +69% to ₹835 cr.',
  'opm@Q1FY27': '31.5%: gross margin 62.7%.',
  'pat@Q1FY27': '+126% (attributable ₹368 cr; Laurus Bio minority absorbed a ₹6 cr loss).',
};

module.exports = { risks, glossary, statementNotes };
