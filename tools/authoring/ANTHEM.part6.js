// Anthem Biosciences report, part 6: risks & honest summary, glossary, statement notes.
const X = require('./ANTHEM.ctx');
const { F, V, SC, n0, n1, pc, price, mv, MULT, HB, k, SECTOR, epsU, sep, epsSep28, fwdNow, trailPe, rating, ruleText, buyBelow, sellAbove, SHARES, Q1, FY26, gNeeded, ptEps } = X;

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: 'Our honest summary: a high-quality CRDMO bought at a full price; the rating clears BUY by a whisker and depends on the multiple holding',
  blocks: [
    { callout: '**What you are buying:** the most profitable CRDMO in India (gross margin 65%, EBITDA ~40% before other income, ROE ~21%), a discovery-to-commercial platform that keeps filling its own funnel (100+ programmes, 10 in Phase III, 14 commercial), ₹1,720 cr of net cash and a founder team with a 20-year record. **What you are not buying:** scale, diversification or predictability: three customers pay 57% of revenue, two molecules ~37%, and quarters swing 15-25%.' },
    { callout: `**What you are paying:** ₹${n0(price)} is ${n1(trailPe)}x trailing EPS and ${n1(fwdNow)}x our FY28E EPS. On the street's method (P/E), Anthem's own ${n1(HB.med)}x median since Oct-2025 lifted by the sector's +${SECTOR}% re-rating gives ${MULT.base}x Sep-28E EPS of ₹${n1(epsSep28)} = {{dcf.tp|inr}} ({{dcf.upside|chg}}): a ${rating} under the house rule, but only just above the 15% line. The EV/EBITDA cross-check (₹${n0(mv('ev').value)}) is lower and the DCF (₹${n0(mv('dcf').value)}) far lower: the price already assumes ~${Math.round(gNeeded)}% a year growth for well over a decade. This is a quality compounder at a quality price, not a bargain.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      ['Q2-Q4FY27 recover the Q1 shortfall and FY27 growth reaches ~20%', 'Medium', 'Q2FY27 results (due by mid-November 2026); order cover'],
      ['One or two Phase III molecules (incl. the ADCs) approved', 'Medium (18-24 months)', 'Client approvals; development-batch revenue'],
      ['The third big-pharma contract is signed and scales', 'Medium', 'Management commentary; customer-concentration note in the FY27 AR'],
      ['Semaglutide API approved and supplied in India', 'Medium-high', 'CDSCO approval; specialty-ingredient growth'],
      ['Customer concentration falls below 50% for the top three', 'Low-medium', 'AR note on customers above 10%'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['A top molecule loses volume (destocking, competition, an acquirer re-sourcing)', 'Medium', 'A fifth of revenue at risk; bear case {{scen.bear.tp|inr}}'],
      ['A Phase III failure or product withdrawal (as in FY23)', 'Medium', 'Revenue −10-15% in a year; multiple de-rates'],
      ['FY27 growth stays in single digits after the weak Q1', 'Medium', 'EPS −8-10% vs our FY27E; the multiple would compress too'],
      ['Unit IV start-up costs or delays', 'Medium', 'Margin −1-2pp in FY29; returns dip'],
      ['Promoter-group selling after the lock-in (~Jan-2027)', 'Medium', 'Supply overhang; sentiment'],
      ['Treasury credit event in NBFC bonds or lower yields', 'Low', 'Other income ~15% of PBT'],
      ['Sector de-rating (pharma trades 17% above its own window median)', 'Medium', `Each 1x on the multiple ≈ ₹${n0(epsSep28)} a share`],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**The rule gives BUY below ~₹${n0(buyBelow)}** (where upside to our target is at least 15%); HOLD between that and ~₹${n0(sellAbove)}, and SELL above it, on today's numbers. At ₹${n0(price)} the stock is only ~₹${n0(buyBelow - price)} below the BUY line, so a small rise in price, or a small cut to EPS, turns the call into HOLD.`,
      `**Biggest swing factors:** the multiple and FY27 revenue. Each 1x on the P/E is ~₹${n0(epsSep28)} a share; each 1pp of FY28-29E EBITDA margin is ~₹${n1(ptEps)} of Sep-28E EPS (~₹${n0(ptEps * MULT.base)} a share at ${MULT.base}x). If the sector's re-rating reverses (no factor), the value is ~₹${n0(Math.round(X.half(HB.med) * epsSep28 / 10) * 10)}; at PL's and BOBCAPS's 55-57x it is ₹${n0(Math.round(55 * epsSep28 / 10) * 10)}-${n0(Math.round(57 * epsSep28 / 10) * 10)}.`,
      '**We would add on weakness** that does not come from a lost molecule (a soft quarter on deferred deliveries, a promoter block) and reassess immediately if a top-three customer or molecule is lost.',
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Top-three customers, FY26', v: '56.7%', d: '61.2% in FY25' },
      { k: 'Gross margin, Q1FY27', v: `${Q1.grossMarginPct}%`, d: '+780bp YoY after backward integration' },
      { k: 'Net cash, Jun-2026', v: `₹${n0(Q1.netCash)} cr`, d: 'Funds Unit IV (₹1,200 cr) without debt' },
      { k: 'Forward P/E', v: `${n1(fwdNow)}x`, d: `FY28E; median since Oct-2025 ${n1(HB.med)}x` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['CRDMO / CDMO / CRO', 'Contract research, development and manufacturing organisation: does discovery research (CRO work), process development and manufacturing (CDMO work) for drug innovators'],
      ['Innovator / emerging biotech / big pharma', 'Companies that own new drugs; emerging biotechs are small, often venture-funded, and usually own no plants'],
      ['NCE / NBE', 'New chemical entity (small-molecule drug) / new biological entity (protein or other biologic)'],
      ['API / intermediate / KSM', 'Active pharmaceutical ingredient (the chemical that does the work); intermediates and key starting materials are the steps before it'],
      ['Phase I / II / III', 'Stages of clinical trials; Phase III is the last before a drug is filed for approval'],
      ['Commercial molecule', 'A client drug that is approved and sold, for which Anthem supplies API or intermediates'],
      ['Custom synthesis / KL', 'Making a molecule to a client\'s specification in chemical reactors; capacity is measured in kilolitres (KL) of reactor volume'],
      ['Fermentation / biotransformation / biocatalysis', 'Using microbes or enzymes to make or modify molecules'],
      ['ADC / RNAi / oligonucleotides / peptides', 'Newer drug types: antibody-drug conjugates, RNA-interference drugs, short DNA/RNA chains, short protein chains (e.g., semaglutide)'],
      ['GLP-1 / semaglutide', 'A class of diabetes and obesity drugs; semaglutide\'s Indian patent expired in Mar-2026'],
      ['Biosimilar', 'A near-copy of an off-patent biologic drug'],
      ['Specialty ingredients', 'Anthem\'s own fermentation products (enzymes, probiotics, vitamin K2, nutritional actives) sold to other companies'],
      ['FFS / FTE', 'Fee-for-service (paid per result) vs full-time-equivalent (paid per scientist) research contracts'],
      ['Destocking', 'Customers running down their inventories, which cuts orders below their real usage for a while'],
      ['Backward integration', 'Making an input in-house instead of buying it'],
      ['Offer for sale (OFS)', 'An IPO in which existing shareholders sell shares; the company receives no money'],
      ['Lock-in', 'A period after an IPO during which certain shareholders may not sell'],
      ['RoDTEP', 'An Indian export-incentive scheme refunding embedded taxes'],
      ['Forward P/E', 'Share price ÷ next full fiscal year\'s EPS'],
      ['EV / EBITDA', 'Enterprise value (market value less net cash) ÷ operating profit before depreciation'],
      ['Sector factor', 'How far the nine pharma peers\' P/E at the 30-Sep-2026 close sits above their own medians since 1-Oct-2025 (+17.2%)'],
      ['DCF / WACC', 'Discounted cash flow value; WACC is the cost of capital used to discount (12.5% here, equal to the cost of equity because Anthem has no debt)'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'sales@FY21': '+74%: commercial molecules scale up; crosses ₹1,000 cr in its 14th year.',
  'ebitdaMargin@FY22': '45.9%: peak margin; gross margin ~67%.',
  'sales@FY23': '−14%: a client\'s Phase III molecule failed and a commercial molecule was withdrawn (RHP).',
  'otherIncome@FY23': 'Includes a ₹54 cr exceptional gain (Screener; nature not disclosed in the documents we read).',
  'ebitdaMargin@FY24': '−510bp: an intermediate bought largely from China raised material costs; gross margin 57.8%.',
  'sales@FY24': '+34%: commercial supply recovers.',
  'cfo@FY24': '₹140 cr: receivables +₹216 cr and inventory +₹82 cr.',
  'sales@FY25': '+30%: development and manufacturing ₹1,306 cr (+45%).',
  'sales@FY26': '+15%: customer destocking; four molecules commercialised (8-9% of revenue).',
  'ebitdaMargin@FY26': '+290bp: backward integration lifts gross margin from H2.',
  'dep@FY26': '+50%: Unit III commissioned and Unit II expanded.',
  'otherIncome@FY26': 'Treasury ₹89 cr, forex ₹58 cr, incentives ₹5 cr, less the ₹22 cr labour-code charge (Screener nets it here).',
  'pat@FY26': '+31%: margin, forex gains and lower ESOP cost; tax 28% (NeoAnthem losses).',
  'cfo@FY26': '₹844 cr: inventory built for FY25 deliveries shipped (−₹216 cr).',
  'sales@Q3FY26': '−15%: high base and destocking.',
  'otherIncome@Q3FY26': 'Net of the ₹25 cr labour-code exceptional charge.',
  'sales@Q4FY26': '+26%: record quarter.',
  'sales@Q1FY27': '−23%: deliveries deferred to Q2-Q4 by key customers.',
  'pat@Q1FY27': '−12%: tax rate 17%; margin held.',
  'sales@FY27E': 'GAM build: commercial +17%, development +10%, R&D +8%, specialty ingredients +8%.',
  'otherIncome@FY27E': '6.0% on average net cash + ₹8 cr; no forex gains.',
  'capex@FY27E': 'Guided ~₹700 cr (Unit IV Phase I and Unit II/III completion).',
  'eps@FY29E': `₹${n1(epsU[2])}; Unit IV commissioned at end-FY28.`,
};

module.exports = { risks, glossary, statementNotes };
