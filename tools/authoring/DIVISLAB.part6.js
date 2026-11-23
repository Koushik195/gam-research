// Divi's report, part 6: risks & honest summary, glossary, statement notes.
const X = require('./DIVISLAB.ctx');
const { F, V, n0, n1, price, mv, peMult, epsSep28, rating, ruleText, buyBelow, sellAbove, fwdNow, peFY27, csShare, FM, K, Q1, divYield } = X;

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: 'Our honest summary: own the business, not the price',
  blocks: [
    { callout: "**What you are buying:** India's best-run API and custom-synthesis platform: world-scale, lowest-cost chemistry, 12 of the top 20 pharma companies as customers, three customer-funded dedicated projects about to commercialise, a credible peptide and contrast-media pipeline, no debt and a clean regulatory record. Earnings should grow ~18% a year to FY29E on our numbers." },
    { callout: `**What you are paying:** ${n1(peFY27)}x our FY27E and ${n1(fwdNow)}x FY28E EPS, after a ~38% rise in three months. Our ${peMult}x Sep-28E multiple is Divi's own 2021-26 median (${n1(FM.median)}x) lifted ${Math.round((K - 1) * 1000) / 10}% for a sector trading above its history, and it gives {{dcf.tp|inr}} ({{dcf.upside|chg}}). The DCF (₹${n0(mv('dcf').value)}) says the cash flows support far less. The price already assumes the pipeline arrives on time and at scale.` },
    { p: "**Is it a SELL on the business?** No. Our call is about price, not quality: we expect earnings to grow strongly, and our base case already assumes custom synthesis rises to ~64% of sales. The stock is a SELL because the rule compares the price with a target built from the multiple the market has paid for Divi's over five years, and the price now sits above it. A strong Q2, a contract announcement or a GLP-1 confirmation could keep the stock above our target for a while; we would revisit the multiple only if the evidence of faster growth became public, not on price momentum." },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      ['Commercial approval of one or more dedicated projects in FY27', 'Medium', 'Custom-synthesis share and growth without validation batches; customer advances'],
      ['Disclosure of a large peptide/GLP-1 contract with capex', 'Medium', 'SEBI filings; new capex approvals (e.g. Kakinada Phase 2)'],
      ['Gross margin holds above ~62% as the stockpile is used', 'Low-medium', 'Quarterly material cost %, inventory'],
      [`A fall in the price towards ~₹${n0(buyBelow)}`, 'n.a.', 'At that level the rule turns BUY on today\'s numbers'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['Customers\' approvals for the dedicated projects slip a year or more', 'Medium', 'FY28E growth halves; bear case {{scen.bear.tp|inr}}'],
      ['Q1 inventory gain reverses as the stockpile is consumed', 'Medium', 'Gross margin back to ~58-60%; FY27E margin nearer 33%'],
      ['Rupee recovers after a West Asia ceasefire', 'Low-medium', 'Rupee revenue and margins lose part of the FY27 tailwind'],
      ['Generic API prices keep falling; Chinese competition', 'High', 'Generics flat or down in value'],
      ['Late-life-cycle products fade (e.g. sacubitril/valsartan, per analysts)', 'Medium', 'A hole in custom-synthesis growth'],
      ['US tariffs push innovators to localise supply', 'Low', 'Fewer new US-bound projects over time'],
      ['Promoter pay rises with profit', 'High', '~6% of after-tax profit goes to executive directors'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**We would turn buyers below ~₹${n0(buyBelow)}** and stay sellers above ~₹${n0(sellAbove)} on today's numbers; between the two the rule says HOLD.`,
      `**Biggest swing factors:** the multiple (each 1x on Sep-28E EPS of ₹${n1(epsSep28)} is ~₹${n0(epsSep28)} a share) and the margin (each point is ~₹4 of FY28E EPS, ~₹240 a share).`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Custom synthesis share', v: `${Q1.csPct}%`, d: `Q1FY27; FY29E ~${Math.round(csShare(2))}%` },
      { k: 'Constant-currency growth', v: '6.8% / 10%', d: 'FY26 / Q1FY27' },
      { k: 'Customer advances, FY26', v: '₹1,207 cr', d: 'capacity paid for upfront' },
      { k: 'Forward P/E', v: `${n1(fwdNow)}x`, d: `FY28E; target ${peMult}x Sep-28E` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['API', 'Active pharmaceutical ingredient: the chemical in a medicine that has the effect; Divi\'s sells APIs to companies that make the tablets.'],
      ['Intermediate / key starting material (KSM)', 'Chemicals made on the way to an API; "advanced intermediates" are the last steps before it.'],
      ['Custom synthesis (CS) / CDMO', 'Making an innovator\'s molecule to its specification under contract; CDMO = contract development and manufacturing organisation.'],
      ['Generic API', 'An API for a drug whose patents have expired, sold to many generic drug makers.'],
      ['DMF / CEP', 'Drug master file (US) and certificate of suitability (Europe): regulatory dossiers that let customers use Divi\'s API.'],
      ['CMC filing', 'The chemistry, manufacturing and controls part of a drug application; once Divi\'s is named there, switching supplier needs re-approval.'],
      ['Validation batch', 'Production batches that prove a process works at scale before commercial supply.'],
      ['Peptide / SPPS / LPPS', 'Peptides are short chains of amino acids (GLP-1 drugs are peptides); SPPS and LPPS are solid- and liquid-phase ways of making them.'],
      ['GLP-1', 'A class of diabetes and obesity drugs (e.g. semaglutide, tirzepatide), mostly peptides.'],
      ['Contrast media', 'Agents injected for CT (iodine-based) or MRI (gadolinium-based) scans.'],
      ['Constant-currency growth', 'Revenue growth with exchange rates held at last year\'s level.'],
      ['Gross margin / EBITDA margin', 'Revenue less materials; operating profit before depreciation, interest, tax and other income, as % of revenue.'],
      ['Forward P/E / EV/EBITDA', 'Share price ÷ next full year\'s EPS; enterprise value (market value less net cash) ÷ EBITDA.'],
      ['Sep-28E', 'Half FY28E plus half FY29E: the earnings the market will look at in twelve months.'],
      ['forwardMedian / sector factor', 'House rule: the stock\'s median forward P/E since Apr-2021 (trough years left out), multiplied by how far sector peers trade above or below their five-year median P/E.'],
      ['DCF / cost of equity', 'Discounted cash flow value; the return shareholders require (here 11.6%).'],
      ['Trough rule', 'Dates whose forward EPS is a loss or below half the prior three-year peak are left out of the median.'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'sales@FY18': '−4%: USFDA import alert on Unit 2 (Mar-Nov 2017).',
  'pat@FY18': '−17%: the import-alert year.',
  'sales@FY19': '+27%: recovery after the import alert was lifted (Nov-2017).',
  'sales@FY21': '+29%: Covid-era demand.',
  'sales@FY22': '+29%: Covid products incl. the molnupiravir API; North America ₹3,833 cr.',
  'ebitdaMargin@FY22': 'Peak 43%: windfall volumes and pricing.',
  'sales@FY23': '−13%: molnupiravir near nil from Q3FY23; North America −43%; constant currency −21%.',
  'ebitdaMargin@FY23': '−13pts: lost Covid volumes, generic price erosion, costly raw materials.',
  'pat@FY23': '−38%.',
  'otherIncome@FY23': 'Includes a ₹130 cr forex gain.',
  'ebitdaMargin@FY24': 'Trough 28%: generic price erosion and high-cost inventory.',
  'cfo@FY24': 'Working capital absorbed ₹607 cr.',
  'sales@FY25': '+19% (+18% in constant currency): custom synthesis rebuilt.',
  'pat@FY25': '+37%.',
  'capex@FY25': '₹1,438 cr: dedicated projects and Kakinada.',
  'sales@FY26': '+13% (+6.8% in constant currency); custom synthesis 55%.',
  'otherIncome@FY26': '₹507 cr before the ₹74 cr Labour Codes charge; includes ₹211 cr of forex gains.',
  'capex@FY26': '₹2,520 cr, 24% of sales.',
  'cfo@FY26': '₹2,738 cr, helped by ₹1,207 cr of customer advances received.',
  'otherIncome@Q3FY26': 'Net of the ₹74 cr Labour Codes exceptional charge.',
  'sales@Q1FY27': '+28% (~10% in constant currency); validation batches of the three dedicated projects.',
  'opm@Q1FY27': '41%: 68% gross margin with a ~₹500 cr inventory build.',
  'pat@Q1FY27': '+66%.',
};

module.exports = { risks, glossary, statementNotes };
