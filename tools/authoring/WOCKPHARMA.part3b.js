// Wockhardt report, part 3b: the regional businesses (UK incl. vaccine fill-finish, Ireland/Europe, emerging markets and
// biosimilars, India, the US exit) and the competitive-advantage scorecard.
const X = require('./WOCKPHARMA.ctx');
const { D, SA, SQ, QL, Q1, AS, n0, n1, YRS, lines } = X;
const F26 = SA.find(a => a.fy === 'FY26'), BL = AS.businessLines;
const q = l => SQ.find(x => x.q === l);

const regions = {
  id: 'regions', nav: 'The regions', kicker: 'Businesses', title: 'The base business: UK flat in sterling, Ireland and India growing, insulin doubling, US gone',
  blocks: [
    { h: 'UK (39% of revenue): a steady generics franchise, flat in sterling' },
    { p: `CP Pharmaceuticals (Wrexham) and Wockhardt UK sold GBP ${F26.ukGbpMn}mn in FY26 (₹${n0(F26.ukCr)} cr), +3% in sterling and +13% in rupees. The business is hospital injectables (its specialty), pharmacy, OTC and export, with 18% of its covered market and 15 launches in FY26. Wrexham also fills and finishes vaccines: a 2020 UK-government line for COVID-19 vaccines and, since 2022, a 15-year collaboration with a global vaccine company (Serum) for up to 150mn doses a year, with profits shared 51:49 in Wockhardt Bio AG's favour. The split between vaccines and generics is not disclosed. Q1FY27 was GBP ${Q1.ukGbpMn}mn, flat on a year ago. We assume GBP ${BL.ukGbpMn.join(' / ')}mn (+3-4% a year) at ₹${BL.gbpInr.join(' / ')}/GBP.` },
    { h: 'Ireland and Europe (11%): Pinewood is growing' },
    { p: `Pinewood, the largest generic supplier to Irish hospitals (liquids and creams), grew 16% in FY26 to ₹${F26.irelandCr} cr and 28% in Q1FY27 (₹${Q1.irelandCr} cr). With continental Europe the region was EUR ${F26.othersEurMn}mn in FY26 and EUR ${q('Q1FY27').othersEurMn}mn in Q1FY27. Pinewood carries a EUR 25.6mn loan at EURIBOR + 8% with a EUR 16.6mn bullet in July 2028. We assume EUR ${BL.europeEurMn.join(' / ')}mn.` },
    { h: 'Emerging markets and biosimilars (28%): the growth engine, but lumpy' },
    { p: `Emerging-market sales rose 35% to ₹${n0(F26.em)} cr in FY26 and 64% to ₹${Q1.em} cr in Q1FY27, almost all insulin (human insulin and glargine) under partnerships and tenders in Brazil, Thailand, Egypt, Algeria, Malaysia and LatAm. Biotech revenue (India + EM) was ₹697 cr in FY26 (+27%) and ₹${Q1.biotech} cr in Q1FY27 (+112%). Management expects biosimilars to double in 24-36 months, with capacity doubling in 12-15 months and five insulin analogues after ~two years. Quarterly sales swing with tender timing (₹320 cr in Q4FY26, ₹263 cr in Q1FY27). We assume +${BL.growth.em.join('% / +')}%.` },
    { pair: [
      { type: 'column', title: 'Biotech (insulin) revenue: +112% in Q1FY27', unit: 'Biotech revenue (₹ crore)', x: ['FY25', 'FY26', 'Q4FY25', 'Q4FY26', 'Q1FY26', 'Q1FY27'], series: [{ name: 'Biotech', values: [551, 697, 112, 252, 111, 236], fmt: 'num' }], labels: 'all', highlight: 'Q1FY27', source: 'Company press releases (4-May-2026, 10-Aug-2026)' },
      { type: 'column', title: 'UK in sterling: GBP 26-29mn a quarter', unit: 'UK revenue (GBP mn)', x: QL, series: [{ name: 'UK', values: SQ.map(x => x.ukGbpMn), fmt: 'num' }], labels: 'all', source: 'Company press releases' },
    ] },
    { h: 'India (22%): branded growing, the rest shrinking' },
    { p: `India branded grew 15% to ₹${F26.indiaBranded} cr in FY26 and 21% to ₹${Q1.indiaBranded} cr in Q1FY27, led by diabetes, Emrok (+60% in FY26; anti-MRSA), regenerative derma and Miqnaf (launched May-2025; DCGI lifted its supply restriction). "India others" fell from ₹230 cr to ₹${F26.indiaOthers} cr and was ₹${Q1.indiaOthers} cr in Q1FY27. After the 2020 sale to Dr Reddy's, India is a small business for Wockhardt; Zaynich will be sold through the same anti-infectives field force.` },
    { pair: [
      { type: 'column', title: 'India branded: +21% in Q1FY27', unit: 'India branded revenue (₹ crore)', x: QL, series: [{ name: 'India branded', values: SQ.map(x => x.indiaBranded), fmt: 'num' }], labels: 'all', highlight: 'Q1FY27', source: 'Company press releases' },
      { type: 'column', title: 'Our regional build: emerging markets and Zaynich drive growth', unit: 'Revenue added FY26 to FY29E (₹ crore), GAM', x: ['UK', 'Ireland & Europe', 'India branded', 'India others', 'Emerging markets', 'Zaynich'], series: [{ name: 'Increase', values: [lines.uk[2] - F26.ukCr, lines.europe[2] - F26.othersCr, lines.indiaBranded[2] - F26.indiaBranded, lines.indiaOthers[2] - F26.indiaOthers, lines.em[2] - F26.em, lines.zaynich[2]].map(Math.round), fmt: 'num' }], labels: 'all', source: 'GAM estimates' },
    ] },
    { h: 'United States: generics closed, Zaynich next' },
    { p: 'US generics made US$11mn in FY25 at a loss. On 11-Jul-2025 Morton Grove Pharmaceuticals and Wockhardt USA filed for Chapter 7 liquidation and were deconsolidated (₹110 cr exceptional charge). The MD said the decision was taken three to four years earlier because the business was ~5% of revenue, loss-making and weighed down by the 2013 import alerts. Wockhardt re-enters the US with Zaynich only, made by a European contract manufacturer.' },
  ],
};

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: world-class antibiotic science, weak commercial and manufacturing record',
  blocks: [
    { verdicts: true, title: 'Competitive advantage scorecard', head: ['Source of advantage', 'Verdict', 'Evidence'], verdicts: D.moat, source: 'GAM Research; company filings' },
    { callout: '**Honest verdict:** Wockhardt has one real moat, its antibiotic discovery engine, now proven by a USFDA approval and protected by patents to 2038. Everything else is ordinary: a mid-sized UK/Irish generics business, a tender-driven insulin business against 6-7 rivals, and three Indian plants still barred from the US after a decade. Whether the science becomes a franchise depends on a US hospital launch by a company that has never run one.' },
  ],
};

module.exports = { regions, moat };
