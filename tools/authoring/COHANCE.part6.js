// Cohance Lifesciences report, part 6: risks & honest summary, glossary, statement notes.
const X = require('./COHANCE.ctx');
const { n0, n1, n2, price, mv, MULT, HB, HF28, k, km, SECTOR, epsU, epsSep28, fwdNow, trailPe, rating, ruleText, buyBelow, sellAbove, Q1, gNeeded, implPeAtPrice, SENS, medTp, sectorK, line, ex, AS, F, SHARES, sep } = X;
const ptEps = sep(F.sales) / 100 * (1 - AS.taxRate[1] / 100) / SHARES;
const f28 = SENS.find(r => /merger-window move/.test(r.name));

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: `Our honest summary: a fixable business with a credible new chief, priced for a recovery that has not started; the rule says ${rating}`,
  blocks: [
    { callout: `**What you are buying:** a niche-API franchise with top-three global positions (API+, ~half of revenue), innovator CDMO relationships with a Phase III pipeline and a restocking order, a fast-growing oligonucleotide building-block business (Sapala), net cash on the company's definition (₹${n0(Q1.netCash)} cr at Jun-2026) and Umang Vohra. **What you are also buying:** a loss-making US ADC business (NJ Bio) with a put option on the rest, ₹696 cr owed to minority partners, a Warning Letter and a Form 483, a cost base built for a bigger company, and an owner whose shares are 94.6% pledged.` },
    { callout: `**What you are paying:** ₹${n0(price)} is ${n1(trailPe)}x trailing EPS, ${n1(fwdNow)}x our FY28E and ${n1(implPeAtPrice)}x Sep-28E. On the street's method (P/E), the listed share's own ${n1(HB.med)}x median since Apr-2021 (trough years left out) lifted by the pharma sector's +${SECTOR}% gives ${MULT.base}x Sep-28E EPS of ₹${n2(epsSep28)} = {{dcf.tp|inr}} ({{dcf.upside|chg}}): a ${rating} under the house rule. EV/EBITDA (₹${n0(mv('ev').value)}) and the DCF (₹${n0(mv('dcf').value)}) are also below the price. Only if one waives the trough rule and uses the post-merger FY28E points with the merger-window factor (${f28.mult}x, ₹${n0(f28.tp)}) does the value exceed the price. The street median target (₹${n0(medTp)}) is below the price too.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      ['Q2-Q4FY27 margins back near 20% reported with revenue growth in H2', 'Medium', 'Q2FY27 results (due by mid-November 2026)'],
      ['The second destocked molecule restocks; Phase III conversions', 'Medium', 'CDMO revenue and order commentary'],
      ['NJ Bio losses cut sharply (or a restructuring)', 'Medium', 'Quarterly NJ Bio EBITDA (−₹33 cr in Q1FY27)'],
      ['FY28E EPS rising above ~₹6.6 (half of FY25\'s)', 'Medium', `Would make the post-merger window usable under our rule (sensitivity ~${X.half(HF28.med * (1 + sectorK / 100))}-${f28.mult}x)`],
      ['A lower share price', 'n.a.', `The rule gives HOLD below ~₹${n0(sellAbove)} and BUY below ~₹${n0(buyBelow)}`],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['Restocking smaller or later than hoped; more destocking', 'Medium', 'Bear case {{scen.bear.tp|inr}}'],
      ['NJ Bio keeps losing ~₹150-200 cr a year; goodwill impairment (₹419 cr)', 'Medium-high', 'EPS, book value; cash for the put'],
      ['US FDA escalation at Pashamylaram or Nacharam', 'Low-medium', 'CDMO customer awards; API+ US supplies'],
      ['Advent sells down or the holdco pledge is enforced', 'Medium', 'Supply of shares; sentiment'],
      ['Further management changes (CFO vacancy)', 'Medium', 'Execution, credibility'],
      ['Pharma de-rating (the sector trades 8% above its five-year median)', 'Medium', `Each 1x on the multiple ≈ ₹${n1(epsSep28)} a share`],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**The rule gives BUY below ~₹${n0(buyBelow)}** and HOLD up to ~₹${n0(sellAbove)}; at ₹${n0(price)} the stock is ~${Math.round((price / sellAbove - 1) * 100)}% above the SELL line.`,
      `**Biggest swing factors:** the multiple window and FY28E. Each 1x on the P/E is ~₹${n1(epsSep28)} a share; each 1pp of FY28-29E margin is ~₹${n2(ptEps)} of Sep-28E EPS (~₹${n0(ptEps * MULT.base)} a share at ${MULT.base}x). FY28E EPS is ~${Math.round((1 - epsU[1] / line(ex, 2028)) * 100)}% below the trough line; crossing it would change the method's window.`,
      '**We would revisit** after Q2FY27 and Umang Vohra\'s strategy update (promised by December 2026), and if the second molecule restocks or NJ Bio is fixed.',
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'EPS, FY25 → FY26 → Q1FY27', v: '₹12.7 → ₹4.7 → loss', d: 'Post-merger basis' },
      { k: 'Adjusted EBITDA margin', v: '33.7% → 2.2%', d: 'FY25 to Q1FY27' },
      { k: 'Owed to minority partners', v: '₹696 cr', d: 'NJ Bio put, Sapala tranches' },
      { k: 'Forward P/E', v: `${n1(fwdNow)}x`, d: `FY28E; base median ${n1(HB.med)}x` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['CDMO', 'Contract development and manufacturing organisation: makes molecules to a drug company\'s recipe under contract'],
      ['API / intermediate / KSM', 'Active pharmaceutical ingredient (the chemical that does the work); intermediates and key starting materials are earlier steps'],
      ['Innovator / generic', 'The company that owns a new drug / a company that copies it after its patent expires'],
      ['Destocking / restocking', 'A customer running down / rebuilding its inventory of a molecule, so orders fall / rise for a while regardless of patient demand'],
      ['Phase III', 'The last stage of clinical trials before approval'],
      ['ADC, payload, linker, bioconjugation', 'Antibody-drug conjugate: an antibody that carries a toxic "payload" to cancer cells via a chemical "linker"; bioconjugation is attaching them'],
      ['Oligonucleotide, amidite', 'Short strands of DNA/RNA used as drugs (antisense, siRNA); amidites are their building blocks'],
      ['FTE contract', 'Full-time-equivalent research contract: a customer pays for a team of scientists'],
      ['Form 483 / OAI / Warning Letter', 'US FDA inspection observations / "official action indicated" / a formal letter that can block supplies until fixed'],
      ['Pooling of interests', 'Merger accounting for companies under common control: books combined at old values, past years restated'],
      ['Minority interest (NCI) / put option', 'The share of a subsidiary owned by outside partners / their right to sell it to the parent at an agreed formula'],
      ['Pledge', 'Shares given as security for a loan; the lender can sell them if the loan is not repaid'],
      ['Exceptional item', 'A one-off gain or charge outside normal operations'],
      ['Trough year (house rule)', 'A forward year whose EPS is a loss or below half the highest EPS of the previous three years; left out of the P/E median'],
      ['Forward P/E', 'Share price ÷ next full fiscal year\'s EPS'],
      ['EV / EBITDA', 'Enterprise value (market value plus net debt) ÷ operating profit before depreciation'],
      ['Sector factor', 'How far the nine pharma peers\' P/E at the 30-Sep-2026 close sits above their own five-year medians (+8.2%)'],
      ['DCF / WACC', 'Discounted cash flow value; WACC is the cost of capital used to discount (12.8%)'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'sales@FY20': '+121%: not comparable; FY19 predates the full CDMO business (demerged from Suven Life Sciences and listed in 2020).',
  'pat@FY20': '+191%: not comparable with FY19 (see revenue).',
  'sales@FY22': '+31%: Suven alone.',
  'ebitdaMargin@FY24': '−4.2pp: Suven alone; revenue fell 22% on a largely fixed cost base.',
  'sales@FY24': '−22%: Suven alone; lower CDMO and specialty-chemical volumes.',
  'sales@FY25': '+148%: the Cohance merger (pooling of interests; FY25 restated). Suven alone: ₹1,198 cr.',
  'ebitdaMargin@FY25': '30.6%: merged with Cohance\'s lower-margin API business (Suven alone FY24: 38.6%).',
  'eps@FY25': '₹12.68 on the post-merger share count (AR FY26); Screener shows ₹19.14 on the pre-merger count.',
  'pat@FY25': 'Restated, merged; includes Sapala from Jul-2024 and NJ Bio from Dec-2024.',
  'sales@FY26': '−13%: destocking of two CDMO molecules (~₹260 cr), Nacharam Warning Letter (~₹61 cr), agro pricing.',
  'ebitdaMargin@FY26': '−11.8pp: costs up (employees +13%, other +23%) while revenue fell; ₹45 cr one-time costs.',
  'otherIncome@FY26': '₹34.1 cr less ₹29.5 cr exceptional charges (settlement, labour code, merger restructuring).',
  'pat@FY26': 'Owners ₹179 cr after minorities absorbed ₹29 cr of NJ Bio losses.',
  'sales@Q1FY27': '−23% YoY: CDMO deliveries moved to Q2, agro to H2, API+ timing.',
  'ebitda@Q1FY27': '₹1.2 cr reported (0.3%); company "adjusted" ₹9.2 cr (2.2%) incl. FX gains.',
  'pat@Q1FY27': 'Owners −₹24 cr; −₹45 cr before minorities (NCI absorbed ₹21 cr).',
  'sales@FY27E': 'GAM build: small-molecule CDMO −9%, NJ Bio −20%, Sapala 2x, API+ +3%, spec chem −9%.',
  'otherIncome@FY27E': '6.5% on average liquid funds + ₹3 cr; no FX gains.',
  'eps@FY28E': `₹${n2(epsU[1])}: below the trough line (half of FY25's ₹13.11 before exceptional items).`,
  'eps@FY29E': `₹${n2(epsU[2])}: still a third below FY25.`,
};

module.exports = { risks, glossary, statementNotes };
