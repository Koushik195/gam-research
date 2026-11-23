// Divi's report, part 3: custom synthesis (dedicated projects, peptides, contrast media), generic APIs, nutraceuticals,
// capacity and capex (Kakinada, utilisation, asset turn).
const X = require('./DIVISLAB.ctx');
const { C, A, F, AS, n0, n1, pc, HIST, QH, LINES, BL, csShare, Q1, capexPct26, capexPctHist, assetTurn, ai } = X;
const CF = C.contracts.customerFunding, CX = C.capex;
const cg = (a, z) => Math.round((z / a - 1) * 100);
const H = HIST, Hf = fy => H.find(h => h.fy === fy);

const cs = {
  id: 'cs', nav: 'Custom synthesis', kicker: 'Segment: custom synthesis', title: 'Custom synthesis: three paid-for projects are validated and waiting for their customers\' approvals; peptides are the bigger, less certain prize',
  blocks: [
    { p: `Custom synthesis (CS) revenue fell from ₹${n0(Hf('FY22').cs)} cr in FY22 (Covid products) to ₹${n0(Hf('FY23').cs)} cr in FY23, then rebuilt to ₹${n0(Hf('FY25').cs)} cr in FY25 and ₹${n0(Hf('FY26').cs)} cr in FY26 (+${cg(Hf('FY25').cs, Hf('FY26').cs)}%). In Q1FY27 it grew ~45% to ~₹${n0(Q1.revenue * 0.6)} cr, 60% of revenue, helped by validation batches of the three dedicated projects (HDFC Securities, PL) and the weak rupee. Divi's does three kinds of CS work: late-life-cycle supply of mature innovator APIs (where it takes over volume as patents near expiry), advanced intermediates and APIs for drugs still in their patent life, and newer platforms (peptide fragments, iodine and gadolinium contrast agents).` },
    { h: 'The three dedicated projects' },
    { p: `Since April 2024 Divi's has signed contracts that need dedicated capacity: one disclosed in April 2024 (an analyst on the May-2026 call recalled a January-2027 start), a May-2025 agreement for advanced intermediates with a "major global pharmaceutical company" (₹650-750 cr of capex funded by the customer's capacity-reservation advance) and a third. Together they cost ~₹2,000 cr, ~70% is capitalised, validations are complete and validation batches have shipped; they are "three different products completely" (CEO, 1-Aug-2026). Commercial volumes start only after each customer files Divi's into its drug application and regulators approve, which management says can take six months to three years ("to be optimistic... the 2-year range"). The money is visible on the balance sheet: customers advanced ₹${n0(CF.advancesReceivedFY26)} cr in FY26 (₹${n0(CF.advancesReceivedFY25)} cr in FY25), including a ₹${CF.refundableAdvance} cr refundable advance and ₹${CF.deferredRevenue} cr of deferred capacity-reservation revenue.` },
    { pair: [
      { type: 'column', title: 'Custom synthesis revenue: rebuilt past the Covid peak', unit: 'Custom synthesis revenue (₹ crore)', x: [...H.map(h => h.fy), ...F.years], series: [{ name: 'Custom synthesis', values: [...H.map(h => Math.round(h.cs)), ...LINES.cs.map(Math.round)], fmt: 'num' }], labels: 'all', source: 'Company split × revenue (GAM); GAM estimates FY27-29E' },
      { type: 'column', title: 'Customers prepaid ₹1,207 cr in FY26', unit: 'Advances received from customers (₹ crore)', x: ['FY25', 'FY26'], series: [{ name: 'Advances received', values: [CF.advancesReceivedFY25, CF.advancesReceivedFY26], fmt: 'num' }], labels: 'all', source: 'AR FY26 note 15 (movement in contract liabilities)' },
    ] },
    { h: 'Peptides and GLP-1: real capability, little disclosure' },
    { p: "Divi's has made protected amino acids (the building blocks of peptides) for ~20 years. It has added a large pilot plant, several 3,000-litre solid-phase (SPPS) reactors, more being installed, and liquid-phase capacity, and opened a Peptide Centre of Excellence in FY26. It says it is the only maker integrated from basic raw materials through protected amino acids to fragments, and wants to be \"the largest integrated player\". Several fragments have been validated and supplied; customers are in Phase I-III. Management will not say whether any of this is GLP-1 (\"I cannot answer that question\", 1-Aug-2026). Citi (15-Jul-2026) expects GLP-1 API supplies from FY27 and links Divi's to Merck's enlicitide and J&J's icotrokinra (oral peptides) from CY2027; those are Citi's attributions, not the company's." },
    { h: 'Contrast media' },
    { p: "Divi's already supplies iodine-based contrast agents (used in CT scans) to innovators in \"several multiples of tons\". On 1-Aug-2026 the CEO said long-term contracts with two customers are being signed, one already commercial and the second starting \"in the next few months\", in \"substantial quantities\". Gadolinium agents (for MRI) remain with a customer in Phase II/III trials." },
    { exhibit: { type: 'table', title: 'Custom synthesis pipeline as disclosed (to 1-Aug-2026)', head: ['Item', 'Status', 'Revenue timing (management)', 'Our assumption'], wide: [1, 2, 3], rows: [
      ['Three dedicated projects (~₹2,000 cr capex)', 'Validated; batches shipped; ~70% capitalised', '"By 2027... or earlier or maybe later", subject to approvals', 'No commercial volume before Q4FY27; ~₹1,000 cr a year of added revenue in FY28-29E'],
      ['18-20 other commercial projects', 'Commercial or being commercialised', 'Ongoing', 'Base CS growth ~8-10% a year'],
      ['Peptide fragments', 'Several validated; customers in Phase I-III', 'Not given', 'Inside CS growth; no separate GLP-1 line'],
      ['Iodine contrast media', 'One customer commercial, second within months', 'FY27', 'Inside CS growth'],
      ['Gadolinium contrast media', 'Customer in Phase II/III', 'After the customer\'s approval', 'Nothing modelled'],
      ['Late-life-cycle products (e.g. sacubitril/valsartan, per analysts)', 'Volumes may fall as generics enter', 'Not given', 'A drag inside base growth'],
    ], source: 'Q4FY26 and Q1FY27 calls; AR FY26; Citi via Business Upturn (15-Jul-2026); GAM' } },
    { callout: `**Our view:** the dedicated projects are the most credible growth Divi's has had since Covid: customers are paying upfront and validations are done. But the timing belongs to customers and regulators, and Divi's discloses neither product nor size. We model CS +${AS.businessLines.growth.cs[0]}% / +${AS.businessLines.growth.cs[1]}% / +${AS.businessLines.growth.cs[2]}% (FY27-29E), taking it to ${Math.round(csShare(2))}% of revenue; a year's slip in approvals is our bear case.` },
  ],
};

const generics = {
  id: 'generics', nav: 'Generic APIs', kicker: 'Segment: generic APIs', title: 'Generic APIs: world-scale and lowest-cost, but in a price war; volumes hold, value does not grow',
  blocks: [
    { p: `Divi's makes ~30 large-volume generic APIs and is the world's largest maker of 10 of them, with 60-70% shares in several (CEO, Aug-2025). Generic API revenue (ex-nutraceuticals) was ₹${n0(Hf('FY22').gen)} cr in FY22, ₹${n0(Hf('FY23').gen)} cr in FY23 and has been flat since: ₹${n0(Hf('FY25').gen)} cr in FY25 and ₹${n0(Hf('FY26').gen)} cr in FY26 (+${cg(Hf('FY25').gen, Hf('FY26').gen)}%), +6% in Q1FY27. Management says volumes are stable and no customer has been lost; the problem is price, as Chinese producers and squeezed generic formulators push it down. Recent price rises only pass on solvent costs: "It's not based on the markets have corrected and the pricing pressure has gone down" (CEO, 1-Aug-2026). Most generic volume is on long-term contracts with raw-material clauses, with some spot sales in South America, Eastern Europe and Asia.` },
    { pair: [
      { type: 'column', title: 'Generic API revenue: flat at ~₹3,600-3,800 cr for four years', unit: 'Generic APIs ex-nutraceuticals (₹ crore)', x: [...H.map(h => h.fy), ...F.years], series: [{ name: 'Generic APIs', values: [...H.map(h => Math.round(h.gen)), ...LINES.generics.map(Math.round)], fmt: 'num' }], labels: 'all', source: 'Company split × revenue less nutraceuticals (GAM); GAM estimates FY27-29E' },
      { type: 'column', title: 'Named products: valsartan shrinking', unit: '% of standalone turnover (BRSR)', x: ['Valsartan FY25', 'Valsartan FY26', 'Naproxen FY25', 'Naproxen FY26', 'Levetiracetam FY26'], series: [{ name: 'Share', values: [6.37, 4.98, 5.20, 4.95, 3.24], fmt: 'pct' }], labels: 'all', source: 'AR FY25 and FY26, business responsibility report (life-cycle assessments)' },
    ] },
    { p: "**New products help at the margin.** Divi's has filed four new DMFs (drug master files) for APIs coming off patent, naming brivaracetam and ticagrelor; validation quantities are with customers and commercial volumes are expected within 3-6 months, and one customer wants long-term exclusivity. Kakinada lets Divi's make more of its own starting materials, which is how it held share through the price war. Against a ₹3,800 cr base, four launches add a few points of growth, not a new leg." },
    { callout: `**Our view:** generics are a cash-generating, low-growth business that Divi's runs for volume, scale and customer loyalty. We model +${BL.growth.generics[0]}% in FY27 (currency and launches) and +${BL.growth.generics[1]}% a year after. The risk is not share loss but continued price erosion; the upside would be a market correction as high-cost producers exit, which management says has not started.` },
  ],
};

const nutra = {
  id: 'nutra', nav: 'Nutraceuticals', kicker: 'Segment: nutraceuticals', title: 'Nutraceuticals: a steady carotenoid business growing ~20%, now 9-10% of revenue',
  blocks: [
    { p: `Divi's has made carotenoids at Unit 2 since 2007: astaxanthin, beta-carotene, lycopene, canthaxanthin and apocarotenal, plus vitamins A, D2, D3, E and K2, sold to food, supplement and animal-feed makers as powders, beadlets and liquids. Revenue rose from ₹629 cr (FY22) to ₹${n0(Hf('FY25').nutra)} cr (FY25) and ₹${n0(Hf('FY26').nutra)} cr (FY26, +21%); Q1FY27 was ₹${Q1.nutraRev} cr (+19%). Covid hurt multivitamin demand; it has recovered steadily, and capacity is being added "as and when required".` },
    { exhibit: { type: 'column', title: 'Nutraceutical revenue: +21% in FY26, +19% in Q1FY27', unit: 'Nutraceutical revenue (₹ crore)', x: [...H.map(h => h.fy), ...F.years], series: [{ name: 'Nutraceuticals', values: [...H.map(h => h.nutra), ...LINES.nutra.map(Math.round)], fmt: 'num' }], labels: 'all', source: 'Earnings calls; GAM estimates FY27-29E' } },
    { callout: `**Our view:** a good niche (few large carotenoid makers outside Europe and China) but too small to move the valuation. We model +${BL.growth.nutra[0]}% / +${BL.growth.nutra[1]}% / +${BL.growth.nutra[2]}%.` },
  ],
};

const cap = ['FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'];
const capacity = {
  id: 'capacity', nav: 'Capacity & capex', kicker: 'Capacity', title: 'Capacity: ~₹5,400 cr of capex in four years has pushed asset turns to a low; the payback depends on the projects above',
  blocks: [
    { p: `Divi's spent ₹1,003 cr (FY24), ₹1,438 cr (FY25) and ₹2,520 cr (FY26) on capex, ${n1(capexPct26)}% of FY26 sales against an FY16-25 average of ~${Math.round(capexPctHist)}%. Gross block rose from ₹${n0(A.grossBlock[ai('FY23')])} cr (Mar-23) to ₹${n0(A.grossBlock[ai('FY26')])} cr (Mar-26), with ₹2,034 cr more in capital work in progress at Jun-26. The spend has three parts: the dedicated CS projects (~₹2,000 cr), Kakinada (a ₹1,500 cr first phase, ₹600 cr capitalised; six blocks running, two under construction; a second phase of four blocks under evaluation) and peptide capacity. Utilisation is ~80-85% across the three units (1-Aug-2026). Revenue per rupee of gross block fell from ${n1(assetTurn('FY21'))}x (FY21) to ${n1(assetTurn('FY26'))}x (FY26); management aims to get back towards 1.5-1.8x over 4-5 years.` },
    { pair: [
      { type: 'column', title: 'Capex vs depreciation: building far ahead of wear and tear', unit: '₹ crore', x: [...cap, ...F.years], series: [{ name: 'Capex', values: [...cap.map(y => A.capex[ai(y)]), ...F.capex], fmt: 'num' }, { name: 'Depreciation', values: [...cap.map(y => A.dep[ai(y)]), ...F.dep.map(Math.round)], fmt: 'num' }], labels: 'all', source: 'Screener.in; GAM estimates FY27-29E' },
      { type: 'line', title: 'Asset turn at a decade low', unit: 'Revenue ÷ gross block (x)', x: ['FY16', 'FY18', 'FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'], series: [{ name: 'Asset turn', values: ['FY16', 'FY18', 'FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'].map(y => Math.round(assetTurn(y) * 100) / 100), fmt: 'n2' }], labels: 'all', min: 0, max: 2, source: 'Screener.in (gross block)' },
    ] },
    { callout: `**Our view:** Divi's has historically built capacity about two years ahead of revenue and then filled it, and the customer prepayments say this round is wanted. But we are at the expensive point of the cycle: depreciation rises from ₹463 cr to ~₹${n0(F.dep[2])} cr by FY29E, and free cash flow stays thin until the projects ramp. We model capex of ₹${n0(F.capex[0])} / ${n0(F.capex[1])} / ${n0(F.capex[2])} cr and no big new project; a Kakinada Phase 2 approval would add to it.` },
  ],
};

module.exports = { cs, generics, nutra, capacity };
