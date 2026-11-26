// Concord Biotech report, part 6: risks & honest summary, glossary, statement notes.
const X = require('./CONCORDBIO.ctx2');
const { n0, n1, price, mv, MULT, HB, HFY, SECTOR, epsU, epsSep28, fwdNow, trailPe, rating, ruleText, buyBelow, sellAbove, Q1, gNeeded, implPeAtPrice, SENS, medTp, F, AS, SHARES } = X;
const ex26 = SENS[4], s40 = SENS[8];
const ptEps = X.sep(F.sales) / 100 * (1 - AS.taxRate[1] / 100) / SHARES;

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: `Our honest summary: a rare fermentation franchise after a bad year; the rule says ${rating}, the cash flows say be careful`,
  blocks: [
    { callout: `**What you are buying:** one of few companies anywhere that can make immunosuppressant, oncology and anti-infective APIs by fermentation at scale, with a clean regulatory record, 74-79% gross margins, no debt and ₹${Q1.cash} cr of cash. FY26 was a bad year (revenue −12%, EPS −30%) for reasons management calls timing; Q1FY27 (+26% revenue) supports that. Against it: 58% of revenue from mature immunosuppressants, share gains bought with price, a formulation and injectable push that has so far cost ~₹48 cr a year, and cash that may go to acquisitions.` },
    { callout: `**What you are paying:** ₹${n0(price)} is ${n1(trailPe)}x trailing EPS, ${n1(fwdNow)}x our FY28E and ${n1(implPeAtPrice)}x Sep-28E. On the street's method (P/E), Concord's own ${n1(HB.med)}x median since Jan-2024, lifted by the pharma peers' +${SECTOR}% over the same window, gives ${MULT.base}x Sep-28E EPS: {{dcf.tp|inr}}, {{dcf.upside|chg}}, a **${rating}**. We are uneasy with the size of that number: the median comes from a three-year history in which the market paid ${Math.round(HFY[2026].min)}-${Math.round(HFY[2026].max)}x the FY26 EPS that arrived; brokers use 25-40x (Choice's 40x is ₹${n0(s40.tp)}, +${Math.round(s40.up)}%); and the DCF (₹${n0(mv('dcf').value)}) needs ~${Math.round(gNeeded)}% growth for 15 years to justify even today's price. The BUY is robust to the window choice (every start date gives ≥ +${Math.round(Math.min(...SENS.slice(1, 6).map(r => r.up)))}%), but not to the multiple the street thinks Concord deserves.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      ['Customers return to bulk Q4 orders and FY27 revenue grows ≥18%', 'Medium', 'Q2FY27 results (due by mid-November 2026) and Q4FY27'],
      ['Injectables sign third-party contracts and Stellon scales; margin reaches ~40% in FY28', 'Medium', 'Injectable utilisation (5% in Q1FY27); quarterly margin ex new units (37%)'],
      ['A CDMO project with an innovator converts', 'Medium', 'CDMO share of revenue (1-2%)'],
      ['Inventory unwinds and working capital returns to ~53% of sales', 'Medium-high', 'Half-year balance sheet'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['Customers keep staggering orders or destock again (tariffs, inventories)', 'Medium', 'Another flat year, as FY26; bear case {{scen.bear.tp|inr}}'],
      ['Price erosion in tacrolimus/mycophenolate deepens as Concord and rivals chase share', 'Medium', 'Gross margin below 74%; the DCF fades margins to 34%'],
      ['The injectable plant stays sub-scale', 'Medium', '~₹38-39 cr a year of costs with little revenue'],
      ['A large acquisition in an unfamiliar adjacency', 'Low-medium', 'Cash (₹442 cr) and returns'],
      ['USFDA or other regulatory setback at Dholka or Limbasi', 'Low', 'Supply disruption; the regulatory record is the moat'],
      ['A 24% block (Jhunjhunwala trusts) is sold', 'Low-medium', 'Supply of shares; price pressure'],
      ['A stronger rupee (Q1FY27 had ~3-5 points of currency help)', 'Medium', 'Revenue and margin'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}), ₹${n0(X.V.tp / 2)} after the 1:1 bonus.** ${ruleText}`,
      `**The rule gives BUY below ~₹${n0(buyBelow)}**, HOLD between that and ~₹${n0(sellAbove)}, and SELL above it, on today's numbers.`,
      `**Biggest swing factor: the multiple.** Each 1x on the P/E is ~₹${n0(epsSep28)} a share; each point of FY28-29E EBITDA margin ~₹${n1(ptEps)} of Sep-28E EPS (~₹${n0(ptEps * MULT.base)} a share at ${MULT.base}x). Leaving out the FY26-priced weeks gives ${ex26.mult}x (₹${n0(ex26.tp)}); the street's 40x gives ₹${n0(s40.tp)}.`,
      `**For a reviewer:** the BUY is the rule's answer, not a high-conviction call. The latest broker targets (median ₹${n0(medTp)}) and our own DCF both sit far below it.`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Immunosuppressants, FY26', v: '58%', d: 'of revenue (74% of APIs)' },
      { k: 'FY26 EPS', v: '₹24.9', d: '−30%; ₹35.5 in FY25' },
      { k: 'Injectable utilisation', v: `${Q1.utilisation.injectables}%`, d: '₹600 cr peak revenue potential' },
      { k: 'Forward P/E', v: `${n1(fwdNow)}x`, d: `FY28E; median since Jan-2024 ${n1(HB.med)}x` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['API', 'Active pharmaceutical ingredient: the chemical in a medicine that does the work'],
      ['Fermentation API', 'An API made by microbes grown in large tanks (fermenters), then extracted and purified, rather than by chemical synthesis'],
      ['m³ (fermentation capacity)', 'Cubic metres of fermenter volume; Concord has 1,250 m³ across two API plants'],
      ['Immunosuppressant', 'A drug that damps the immune system, mainly so the body does not reject a transplanted organ (tacrolimus, mycophenolate, cyclosporine)'],
      ['Formulation', 'The finished medicine (tablet, capsule, injection) made from an API'],
      ['CDMO', 'Contract development and manufacturing for another company\'s (often an innovator\'s) molecule'],
      ['DMF / ANDA / CEP', 'Drug master file (the dossier on how an API is made) / Abbreviated New Drug Application (US approval for a generic medicine) / certificate that an API meets the European Pharmacopoeia'],
      ['Second source', 'A supplier a customer adds alongside its existing one, usually at a lower price'],
      ['USFDA Form 483 / EIR', 'Inspection observations / the establishment inspection report that closes an inspection'],
      ['WHO-GMP / EU-GMP', 'Good manufacturing practice certificates from the World Health Organization / European regulators'],
      ['Bonus issue (1:1)', 'Free shares: one new share for each held; the share count doubles and the price halves, value unchanged'],
      ['Forward P/E', 'Share price ÷ next full fiscal year\'s EPS (as it actually turned out, for history)'],
      ['EV / EBITDA', 'Enterprise value (market value less net cash) ÷ operating profit before depreciation'],
      ['Sector factor (same window)', `How far the nine pharma peers' P/E at the 30-Sep-2026 close sits above their own medians since 1-Jan-2024 (+${SECTOR}%)`],
      ['DCF / WACC', 'Discounted cash flow value; WACC is the cost of capital used to discount (12.5%, equal to the cost of equity as Concord has no debt)'],
      ['OCI', 'Other comprehensive income: gains recorded in equity, not in profit (Concord\'s Palvella shares)'],
      ['Sep-28E EPS', 'Half of FY28E plus half of FY29E: the earnings a buyer looks at one year from now'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'ebitdaMargin@FY18': '37%: standalone year; formulations plant (FY2016) still small.',
  'ebitdaMargin@FY21': '53%: the peak year (first consolidated years from FY20); we found no company explanation.',
  'ebitdaMargin@FY22': '38%: Limbasi (Unit III) start-up costs; depreciation +₹22 cr.',
  'pat@FY22': '−26%: the Limbasi start-up year.',
  'sales@FY24': '+19%: formulations doubled to ₹189 cr.',
  'sales@FY25': '+18%: record Q4 (₹430 cr) on bulk year-end orders.',
  'sales@FY26': '−12%: staggered orders, EU supply halt (~3 months, CDSCO), Middle East and US VA tenders lost.',
  'ebitdaMargin@FY26': '34.9%: ~₹48 cr of injectable and Stellon costs; 38.8% excluding them (company).',
  'pat@FY26': '−30%; attributable profit (25% of Stellon\'s loss with the partner).',
  'otherIncome@FY26': '₹52 cr incl. ₹16 cr forex gains and ₹21 cr fund gains.',
  'sales@FY27E': 'Q1FY27 +26%; we assume +17% for the year.',
  'ebitdaMargin@FY28E': 'Injectables and Stellon at breakeven; below management\'s ~40%.',
};

module.exports = { risks, glossary, statementNotes };
