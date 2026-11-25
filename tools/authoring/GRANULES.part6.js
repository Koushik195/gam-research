// Granules India report, part 6: risks & honest summary, glossary, statement notes.
const X = require('./GRANULES.ctx');
const { F, n0, n1, price, MULT, HB, SECTOR, epsSep28, fwdNow, trailPe, rating, ruleText, buyBelow, sellAbove, gNeeded, implPeAtPrice, medTp, SENS } = X;
const w24 = SENS.find(r => /Apr-2024/.test(r.name)), streetRow = SENS.find(r => /Street P\/E/.test(r.name));
const ptEps = X.sep(F.sales) / 100 * 0.75 / X.SHARES; // 1pp of Sep-28E EBITDA margin, after tax, per share

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: `Our honest summary: a better business than three years ago, but the price already pays for the better version; the rule says ${rating}`,
  blocks: [
    { callout: `**What you are buying:** a vertically integrated generics maker whose finished dosages (74% of revenue) are moving from commodity tablets to harder products: complex generics are 50% of FD, Granules is the 3rd largest US maker of controlled substances, and Q1FY27 grew 22% with a 23% EBITDA margin. It is net cash after the Sep-2026 warrant money. Against that: its largest plant has been under an FDA warning letter since Feb-2025, more than half of revenue is still legacy molecules sold on price, the peptide CDMO is small and loss-making, and EPS was flat for five years.` },
    { callout: `**What you are paying:** ₹${n0(price)} is ${n1(trailPe)}x trailing EPS, ${n1(fwdNow)}x our FY28E and ${n1(implPeAtPrice)}x Sep-28E. On the street's method (P/E), Granules' own ${n1(HB.med)}x median since Apr-2021 lifted by the pharma sector's +${SECTOR}% gives ${MULT.base}x Sep-28E EPS of ₹${n1(epsSep28)} = {{dcf.tp|inr}} ({{dcf.upside|chg}}): a ${rating} under the house rule. The street's median target is ₹${n0(medTp)}; at the street's average P/E (${streetRow.mult}x) on our EPS the stock is worth ₹${n0(streetRow.tp)}, only ${X.pc(streetRow.up)} from here. The DCF says the price needs ~${Math.round(gNeeded)}% revenue growth a year for 15 years.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      ['A clean FDA re-inspection of Gagillapur and the 9 approvals launched', 'Medium', 'FDA visit (awaited "anytime now"); launch pace in FY28'],
      ['A sole first-to-file win (generic Lumryz or Dyanavel XR) with exclusivity', 'Low-medium', 'Litigation outcomes; launch timing'],
      ['Margin above 24% while R&D stays at ~6% (operating leverage proven)', 'Medium', 'Q2-Q4FY27 margins once US inventory is used up'],
      ['Senn at a USD50 mn run-rate with 30% EBITDA and three USD10 mn+ customers', 'Low-medium', 'Quarterly CDMO revenue and EBITDA'],
      ['Evidence the Apr-2024+ valuation regime is permanent (several years of 15%+ EPS growth)', 'Medium', `The Apr-2024 window gives ${w24.mult}x (₹${n0(w24.tp)})`],
      ['A lower share price', 'n.a.', `The rule gives HOLD below ~₹${n0(sellAbove)} and BUY below ~₹${n0(buyBelow)}`],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['Failed or delayed Gagillapur re-inspection; another OAI', 'Medium', 'Approvals blocked into FY29; bear case {{scen.bear.tp|inr}}'],
      ['Legacy molecule prices fall; 2026 cost inflation not passed on', 'Medium-high', '~56% of revenue; each 1pp of margin ≈ ₹' + n1(ptEps) + ' of Sep-28E EPS'],
      ['Price erosion in ADHD generics as competitors gain quota', 'Medium', 'Complex generics are the margin engine'],
      ['A large, expensive acquisition with the new cash', 'Medium', 'Not in our numbers; the CMD is "very actively looking"'],
      ['Peptide CDMO losses persist; more capex in Zurich and Vizag', 'Medium', 'FY26 EBITDA loss ₹44.5 cr; ~₹300 cr of India peptide capex planned'],
      ['DEA or FDA action at GPI Virginia (one plant carries the controlled franchise)', 'Low', 'High: the most valuable part of the business'],
      ['Pharma de-rating (the set trades 8.2% above its five-year medians)', 'Medium', `Each 1x on the multiple ≈ ₹${n0(epsSep28)} a share`],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**The rule gives BUY below ~₹${n0(buyBelow)}** (upside to our target of at least 15%), HOLD between that and ~₹${n0(sellAbove)}, and SELL above it, on today's numbers. At ₹${n0(price)} the stock is ~${Math.round((price / sellAbove - 1) * 100)}% above the SELL line.`,
      `**Biggest swing factors:** the multiple and Gagillapur. Each 1x on the P/E is ~₹${n0(epsSep28)} a share; each 1pp of FY28-29E EBITDA margin is ~₹${n1(ptEps)} of Sep-28E EPS (~₹${n0(ptEps * MULT.base)} a share at ${MULT.base}x). Without the sector factor the value is ~₹${n0(Math.round(X.half(HB.med) * epsSep28 / 10) * 10)}.`,
      '**We would revisit** after a clean FDA re-inspection with launches under way, or if FY27-28 show the margin rising above 24% while R&D stays near 6%; either would support a case that the post-2024 valuation regime is earned.',
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Complex generics, % of FD', v: '50%', d: '31% in FY25 (Q1FY27)' },
      { k: 'Legacy generics, % of revenue', v: '56%', d: 'FY26 (AR); price-takers' },
      { k: 'Gagillapur', v: 'Warning letter', d: 'Since Feb-2025; 9 approvals waiting' },
      { k: 'Forward P/E', v: `${n1(fwdNow)}x`, d: `FY28E; median since Apr-2021 ${n1(HB.med)}x` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

module.exports = { risks, ptEps };
