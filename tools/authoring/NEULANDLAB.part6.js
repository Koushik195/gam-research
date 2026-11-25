// Neuland Laboratories report, part 6: risks & honest summary, glossary, statement notes.
const X = require('./NEULANDLAB.ctx2');
const { n0, n1, price, mv, MULT, HB, SECTOR, epsU, epsSep28, fwdNow, trailPe, rating, ruleText, buyBelow, sellAbove, Q1, gNeeded, ptEps, implPeAtPrice, cmsShare26, SENS, medTp } = X;
const brk = SENS.find(r => /earnings break/.test(r.name)), nuvRow = SENS.find(r => /Nuvama 48x/.test(r.name));

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: `Our honest summary: a real CDMO step-up in a well-run chemistry company, priced as if the next one were certain; the rule says ${rating}`,
  blocks: [
    { callout: `**What you are buying:** a 40-year-old API maker with complex chemistry and a clean USFDA record that has turned itself into a contract manufacturer for innovators: CMS was ${Math.round(cmsShare26)}% of FY26 revenue, EPS rose from ₹50 (FY22) to ₹284 (FY26), Q1FY27 revenue rose 119% and net cash was ₹${n0(Q1.netCash)} cr at Jun-2026. **What you are not buying:** diversification (three customer groups were 54% of revenue; about three molecules drive CMS), predictable quarters, disclosure of those molecules, or a proven peptide business.` },
    { callout: `**What you are paying:** ₹${n0(price)} is ${n1(trailPe)}x trailing EPS, ${n1(fwdNow)}x our FY28E and ${n1(implPeAtPrice)}x Sep-28E. On the street's method (P/E), Neuland's own ${n1(HB.med)}x median since Apr-2021 lifted by the pharma sector's +${SECTOR}% gives ${MULT.base}x Sep-28E EPS of ₹${n1(epsSep28)} = {{dcf.tp|inr}} ({{dcf.upside|chg}}): a ${rating} under the house rule. The EV/EBITDA cross-check (₹${n0(mv('ev').value)}) agrees and the DCF (₹${n0(mv('dcf').value)}) is lower still. Starting the window at the FY23 earnings break gives ${brk.mult}x (₹${n0(brk.tp)}), still a ${rating}; only the street's own multiple (Nuvama's 48x: ₹${n0(nuvRow.tp)}) supports today's price. The latest broker targets (median ₹${n0(medTp)}) imply little upside too.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      ['New CMS commercialisations on schedule (one in FY27, one or two in FY28), widening the base beyond ~3 molecules', 'Medium', 'Commercial project count (19 for three years); top-5 product share'],
      ['Peptide plant validated and filled with commercial programmes', 'Medium', 'Module 1 qualification, contracts, USFDA inspection; revenue in FY28'],
      ['FY27 revenue well above +20% with margins near 31% despite the inflated Q4FY26 base', 'Medium', 'Q2FY27 results (due by mid-November 2026) and H2'],
      ['Working capital back below 100 days and free cash flow positive during heavy capex', 'Medium-high', 'Half-year balance sheet'],
      ['A lower share price', 'n.a.', `The rule gives HOLD below ~₹${n0(sellAbove)} and BUY below ~₹${n0(buyBelow)}`],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['A big CMS customer destocks, second-sources or changes owner (Esperion received a bid in May-2026)', 'Medium', 'A year of growth lost, as in FY25 (revenue −5%); bear case {{scen.bear.tp|inr}}'],
      ['The brands behind the commercial molecules disappoint or lose exclusivity', 'Medium, later', 'CMS margins and volumes; the DCF fades margins to 26%'],
      ['Capex runs ahead of orders (as in FY18-20) or an overseas acquisition goes wrong', 'Medium', 'ROE falls below our {{F.roe.2|pct}}; debt rises'],
      ['USFDA: an adverse outcome at any of the three plants (Unit III had one observation in Aug-2026)', 'Low', 'Supply disruption to innovators; the regulatory record is the moat'],
      ['A stronger rupee; FY26 benefited from a weak one', 'Medium', '~90% of revenue is exported by end market'],
      ['Pharma or CDMO de-rating (the pharma set trades 8.2% above its five-year median; Neuland +86%)', 'Medium', `Each 1x on the multiple ≈ ₹${n0(epsSep28)} a share`],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**The rule gives BUY below ~₹${n0(buyBelow)}** (upside to our target of at least 15%), HOLD between that and ~₹${n0(sellAbove)}, and SELL above it, on today's numbers. At ₹${n0(price)} the stock is ~${Math.round((price / sellAbove - 1) * 100)}% above the SELL line.`,
      `**Biggest swing factors:** the multiple and the CMS molecules. Each 1x on the P/E is ~₹${n0(epsSep28)} a share; each 1pp of FY28-29E EBITDA margin is ~₹${n1(ptEps)} of Sep-28E EPS (~₹${n0(ptEps * MULT.base)} a share at ${MULT.base}x). Without the sector factor the value is ~₹${n0(Math.round(X.half(HB.med) * epsSep28 / 10) * 10)}.`,
      '**We would revisit** if Neuland showed that its growth no longer depends on a handful of molecules (more commercial projects, peptides contracted, segment margins disclosed); that would argue for weighting the post-FY23 history more heavily.',
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'CMS share of FY26 revenue', v: `${Math.round(cmsShare26)}%`, d: '30% in FY22' },
      { k: 'Three customer groups, FY26', v: '54%', d: 'of revenue (34% in FY25)' },
      { k: 'Net cash, Jun-2026', v: `₹${n0(Q1.netCash)} cr`, d: 'Capex ₹1,460 cr approved in 13 quarters' },
      { k: 'Forward P/E', v: `${n1(fwdNow)}x`, d: `FY28E; median since Apr-2021 ${n1(HB.med)}x` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['API', 'Active pharmaceutical ingredient: the chemical in a medicine that does the work'],
      ['CMS / CDMO', 'Custom Manufacturing Solutions, Neuland\'s name for its contract development and manufacturing business: making an innovator\'s API to its specification, usually exclusively'],
      ['GDS: Prime and Specialty APIs', 'Generic Drug Substances. Prime: mature, large-volume generic APIs; Specialty: complex, low-volume generic APIs with fewer competitors'],
      ['Commercial vs development revenue', 'Commercial: supply of an approved drug\'s API; development: process work and clinical or launch batches'],
      ['Innovator / biotech / generic', 'The company that discovered a drug / a small, often venture-funded innovator / a company that copies a drug after its patent expires'],
      ['NDA / IND', 'New Drug Application (to sell a drug in the US) / Investigational New Drug application (to start human trials)'],
      ['DMF', 'Drug master file: the regulatory dossier describing how an API is made; changing supplier means changing it'],
      ['USFDA Form 483 / EIR / OAI', 'Inspection observations / the inspection report that closes an inspection / Official Action Indicated, the worst outcome'],
      ['Peptide', 'A short chain of amino acids; GLP-1 drugs for diabetes and obesity are peptides'],
      ['Exceptional item', 'A one-off gain or loss (here the FY25 property gain)'],
      ['Forward P/E', 'Share price ÷ next full fiscal year\'s EPS (as it actually turned out, for history)'],
      ['EV / EBITDA', 'Enterprise value (market value less net cash) ÷ operating profit before depreciation'],
      ['Sector factor', 'How far the nine pharma peers\' P/E at the 30-Sep-2026 close sits above their own five-year medians (+8.2%)'],
      ['DCF / WACC', 'Discounted cash flow value; WACC is the cost of capital used to discount (12.5%, equal to the cost of equity as Neuland has net cash)'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'pat@FY16': 'Low base: ₹16 cr in FY15.',
  'pat@FY17': '+74%: EBITDA margin 18.3%.',
  'ebitdaMargin@FY18': '9.7%: revenue fell on a mismatch between capacity and orders (company); Unit III bought.',
  'pat@FY18': '−74%: the capacity/order mismatch year.',
  'sales@FY19': '+27%: recovery after the FY18 capacity/order mismatch.',
  'pat@FY19': 'On a ₹12 cr base; FY19-20 margins hit by raw-material price spikes (company).',
  'ebitdaMargin@FY20': '13.4%: recovery; supply-chain de-risking after the FY19 raw-material spike.',
  'ebitdaMargin@FY23': '22.9%: CMS 37% of revenue; operating leverage.',
  'pat@FY23': '+156%: CMS commercial molecules ramp.',
  'sales@FY24': '+31%: CMS ₹765 cr incl. ₹303 cr of development and launch quantities.',
  'ebitdaMargin@FY24': '29.7%: CMS 49% of revenue.',
  'ebitdaMargin@FY25': '22.4%: revenue −5% on largely fixed costs; CMS down to 43%.',
  'ebitdaMargin@FY26': '28.7%: CMS 61% of revenue; a favourable rupee (CEO).',
  'pat@FY26': '+40%: CMS doubles; ₹10.6 cr forex gains; FY25 had the ₹76.4 cr property gain.',
  'sales@Q2FY25': '−26% YoY: CMS ₹132 cr after ₹235 cr in Q1FY25; FY25 flagged as flat.',
  'sales@Q1FY26': '−33% YoY: CMS ₹133 cr vs ₹235 cr; EBITDA margin 12%.',
  'sales@Q2FY26': '+65% YoY: CMS ₹310 cr vs ₹132 cr.',
  'sales@FY18': '−9%: orders fell short of capacity after Unit III was bought.',
  'ebitdaMargin@FY19': '8.7%: Unit III idle and raw-material price spikes.',
  'pat@FY21': 'Includes a ₹12.8 cr exceptional gain (Screener).',
  'sales@FY23': '+25%: CMS ₹282 cr → ₹448 cr as commercial molecules ramp.',
  'pat@FY24': '+83%: CMS ₹765 cr (49% of revenue), margin 29.7%.',
  'sales@FY25': '−5%: a "flattish" year flagged by management; CMS −17%.',
  'otherIncome@FY25': 'Includes the ₹76.4 cr exceptional gain on the Nanakramguda property (Screener nets it here).',
  'pat@FY25': '₹260 cr reported; ~₹191 cr before the property gain (GAM estimate).',
  'sales@FY26': '+37%: CMS ₹1,244 cr (+95%); Prime −5%, Specialty −16%.',
  'cfo@FY26': '₹348 cr: receivables +₹226 cr, inventory +₹125 cr.',
  'capex@FY26': '₹397 cr: peptide plant, R&D centre, Unit III block.',
  'sales@Q4FY26': '₹776 cr: management calls it "a Q3 plus Q4" quarter.',
  'sales@Q1FY27': '+119% YoY: CMS ₹438 cr vs ₹133 cr.',
  'sales@FY27E': 'GAM build: CMS +27%, Prime +10%, Specialty +8%, Others +10%.',
  'otherIncome@FY27E': '5.0% on average gross cash + ₹1.5 cr; no forex gains.',
  'capex@FY27E': 'Q1 ₹122 cr + committed projects (peptide Phase II, R&D centre, Unit I).',
  'eps@FY29E': `₹${n1(epsU[2])}; CMS ~69% of revenue.`,
};

module.exports = { risks, glossary, statementNotes };
