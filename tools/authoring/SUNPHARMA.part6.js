// Sun Pharma report, part 6: risks and the honest summary, glossary, statement notes.
const X = require('./SUNPHARMA.ctx');
const { F, V, SC, n0, n1, pc, price, MULT, ORG, epsSep, rating, buyBelow, sellAbove, medTp } = X;

const risks = {
  id: 'risks', nav: 'Risks & verdict', kicker: 'Risks & honest summary', title: `Verdict: ${rating}. A great franchise at a fair price, with a large, leveraged bet attached`,
  blocks: [
    { exhibit: { type: 'table', title: 'Key risks', head: ['Risk', 'Likelihood', 'Impact', 'What we watch'], wide: [3], rows: [
      ['Organon integration and leverage: revenue keeps falling, synergies slip, financing costs more than ~5.5%', 'Medium', 'High', 'Closing terms (Q4FY27), bond pricing, Nexplanon and China trends, first combined guidance'],
      ['US FDA: more plants flagged, Halol/Baska/Dadra not cleared, consent-decree escalation at Mohali', 'Medium', 'High', 'Re-inspections, warning letters, new ANDA approvals'],
      ['Specialty launches disappoint (Leqselvi vs JAK rivals incl. AbbVie\'s Rinvoq; Unloxcyt vs Libtayo/Keytruda); Ilumya psoriatic-arthritis decision delayed', 'Medium', 'Medium-High', 'Quarterly innovative sales, prescriber data, FDA action in late Oct-2026'],
      ['US Section 232 tariff (100% on patented imports from 29-Sep-2026) or its extension to generics', 'Medium', 'Medium', 'Sun\'s sourcing disclosures; Commerce review of generics within a year'],
      ['US litigation: GxMDL claims beyond the settled end-payer class, opioids, Ranbaxy-era cases', 'Medium', 'Medium', 'Exceptional charges (₹130-950 cr a year after tax in FY23-26)'],
      ['India price controls and trade-margin caps; GLP-1 generic price war', 'Medium', 'Medium', 'NLEM revisions, NPPA notices, semaglutide pricing'],
      ['Tax rate stays near 28% or rises after Organon; forex reverses (a stronger rupee cuts rupee revenue and creates forex losses)', 'Medium', 'Low-Medium', 'Quarterly ETR; rupee'],
      ['Succession and management bandwidth during the largest integration in Sun\'s history', 'Low-Medium', 'Medium', 'Senior hires, integration office updates'],
    ], source: 'GAM Research' } },
    { h: 'The honest summary' },
    { exhibit: { type: 'table', title: 'What you buy, what you pay', head: ['', ''], wide: [1], rows: [
      ['What you buy', `India's No.1 pharma franchise (8.5% share, still gaining), the only scaled global specialty business among Indian companies ($1.42 bn), a shrinking US generics arm hobbled by FDA issues, and, from ~Q1 2027, Organon: twice the revenue, ~$9.5 bn of net debt, a slow-declining portfolio and a women's-health and biosimilar platform.`],
      ['What you pay', `₹${n0(price)}: ${n1(X.fwdNow)}x our standalone FY28E EPS and ${n1(X.fwdNowSep)}x Sep-28E, against a ${n1(X.ADJ.med)}x median forward P/E on adjusted EPS since 2021 (${n1(X.HOUSE.med)}x on reported EPS). Our ${MULT.base}x standalone multiple plus Organon at cost gives {{dcf.tp|inr}} ({{dcf.upside|chg}}); the post-results street median is ₹${n0(medTp)}.`],
      ['Why HOLD, not BUY', `Our standalone EPS is ~10% below the street, the multiple the market pays is already at the top of its post-2021 range, and Organon adds risk faster than it adds value. Accretion is not a reason to pay more: it is bought with debt.`],
      ['Why not SELL', 'The core businesses are excellent and growing, the balance sheet is strong until closing, Ilumya has a near-term catalyst, and the street\'s P/E basis supports the current price.'],
      ['What would make us more positive', `Proof that Leqselvi/Unloxcyt are building (innovative sales growing >15% again), Ilumya approved in psoriatic arthritis, an FDA clearance at Halol or Baska, Organon financed well below 5.5% with revenue stabilising; or a price below ~₹${n0(buyBelow)}.`],
      ['What would make us negative', `A delay or re-pricing of Organon, a new FDA action, a tariff hit on Ilumya, or Organon EBITDA falling 10% (our bear case: {{scen.bear.tp|inr}}); or a price above ~₹${n0(sellAbove)}.`],
    ], source: 'GAM Research' } },
    { callout: `**How we would act:** hold existing positions; this is a quality compounder priced roughly at our fair value, with the next 12 months dominated by the Organon closing. Our bull case ({{scen.bull.tp|inr}}, ${MULT.bull}x plus synergies on Sep-28E EPS of ₹${n1(epsSep.bull)}) needs both faster specialty growth and a smooth integration; our bear case ({{scen.bear.tp|inr}}) needs only one of the risks above to bite. That asymmetry is why we do not chase the street's ~₹2,100.` },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['Generic', 'A copy of a medicine whose patent has expired; sold at a fraction of the original price. "Branded generic": a generic sold under a brand name and promoted to doctors (India, emerging markets).'],
      ['Innovative medicines / specialty', 'Patented or differentiated branded products (Ilumya, Leqselvi, Unloxcyt, Cequa…) sold at high prices; Sun\'s name for its specialty business.'],
      ['ANDA / NDA / BLA', 'US marketing applications for a generic (Abbreviated New Drug Application), a new drug or new formulation (NDA), and a biologic (Biologics License Application).'],
      ['USFDA, OAI, warning letter, import alert, consent decree', 'The US regulator; "Official Action Indicated" is its worst inspection outcome; a warning letter lists violations; an import alert blocks shipments from a plant; a consent decree is a court order imposing remedial steps (Ranbaxy, 2012).'],
      ['gRevlimid', 'Generic lenalidomide (a cancer drug) that several companies sold in limited, agreed volumes in the US from 2022 until full generic entry in Jan-2026: a temporary windfall.'],
      ['IL-23, JAK, PD-L1', 'Drug classes: IL-23 blockers treat psoriasis (Ilumya); JAK inhibitors treat alopecia and other immune diseases (Leqselvi); PD-L1 antibodies are cancer immunotherapies (Unloxcyt).'],
      ['Medicare Part B', 'The US government insurance programme that pays for drugs given in a doctor\'s office or clinic (infusions, injections).'],
      ['Biosimilar', 'A near-copy of a biologic drug after its patent expires (e.g., Organon\'s Hadlima, a copy of Humira).'],
      ['IPM, MAT, AWACS, SMSRC', 'Indian Pharmaceutical Market; Moving Annual Total (last 12 months); AIOCD AWACS (pharmacy sales audit); SMSRC (prescription audit).'],
      ['Section 232 tariff', 'A US import duty justified on national-security grounds; for pharma, 100% on patented drugs from 29-Sep-2026 unless a lower rate or exemption applies; generics excluded for now.'],
      ['EBITDA before forex', 'Operating profit before depreciation, interest, tax and foreign-exchange gains; Sun\'s own EBITDA includes forex gains.'],
      ['Exceptional items / adjusted EPS', 'Charges or gains the company treats as one-offs (litigation, impairments, restructuring); adjusted EPS excludes them.'],
      ['One-year-forward P/E', 'Share price divided by the next full financial year\'s EPS. Sep-28E EPS = half FY28E plus half FY29E (the year ahead of our 12-month target date).'],
      ['Sector factor', 'The median premium or discount of pharma peers\' P/E on 30-Sep-2026 to their own five-year medians (+10.25%); applied to Sun\'s own median multiple.'],
      ['Sum of the parts (SOTP)', 'Valuing a company as the sum of separately valued pieces; here standalone Sun on P/E plus the pending Organon deal at cost.'],
      ['Synergies', 'Cost savings or extra sales from combining two companies; Sun expects ~$350 mn of cost synergies from Organon in 2-4 years.'],
      ['DCF, FCFF, Ke', 'Discounted cash flow; free cash flow to the firm; cost of equity (the return shareholders require: 11.3% here).'],
      ['CWIP, PPA', 'Capital work in progress; purchase-price allocation (how an acquisition\'s price is split into assets, intangibles and goodwill, which sets future amortisation).'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'sales@FY16': '+4%: first full year with Ranbaxy (merged Mar-2015).',
  'sales@FY18': '−16%: US limited-competition launches of FY17 faded, US generic prices fell and Halol\'s FDA problems hit supplies.',
  'ebitdaMargin@FY18': '−1,070bp to 21%: lower US sales on a fixed cost base.',
  'pat@FY18': '−70%: lower US profits plus ₹947 cr of exceptional charges.',
  'pat@FY21': '−23%: ₹4,292 cr of exceptional charges (US litigation provisions) in other income.',
  'otherIncome@FY21': 'Negative: Screener nets the ₹4,292 cr of exceptional charges into other income.',
  'otherIncome@FY22': 'Negative: ₹4,532 cr of exceptional charges (Ranbaxy-era US litigation ₹3,936 cr, Taro MDL, impairments).',
  'pat@FY22': '+13% despite ₹3,444 cr of after-tax exceptional charges.',
  'pat@FY23': '+159%: exceptional charges fell to ₹164 cr; gRevlimid and specialty growth.',
  'ebitdaMargin@FY25': '+190bp to 28.7%: innovative medicines and India mix.',
  'pat@FY25': '+14%: ₹694 cr of exceptional charges (opioid settlement, Lyndra write-off, restructuring) and a deferred-tax write-off.',
  'otherIncome@FY26': '₹1,895 cr = ₹1,972 cr other income + ₹1,240 cr forex gain − ₹1,314 cr exceptional charges (GxMDL, labour codes, SCD-044).',
  'pat@FY26': '+5%: forex gains offset ₹949 cr of after-tax exceptional charges; tax rate up to 23.5%.',
  'sales@FY27E': '+10.3%: ~5 points from the weaker rupee; India +14%, US −4% in dollars. Standalone (no Organon).',
  'ebitdaMargin@FY27E': '28.4% before forex: no gRevlimid, R&D back to ~6.3% of sales.',
  'eps@FY27E': 'Standalone, before exceptional items; tax 27.5%; only Q1\'s ₹122 cr of forex gains.',
  'eps@FY28E': 'Standalone. Organon (closing guided for Q4FY27) would add 30-40% before amortisation on street numbers; we value it separately at cost.',
  'otherIncome@FY28E': '6% on opening net cash (₹38,122 cr) + ₹50 cr; would fall sharply after Organon.',
};

module.exports = { risks, glossary, statementNotes };
