// Cipla report, part 3: One India, North America (cliff, pipeline, plants), One Africa & EMEU, moat scorecard.
const X = require('./CIPLA.ctx');
const { C, D, F, n0, n1, pc, rup, Q1, FY26, SQ, QL, BL, lines, YRS, share } = X;
const yoy = (arr, i) => (i >= 4 && arr[i - 4] ? Math.round((arr[i] / arr[i - 4] - 1) * 1000) / 10 : null);
const IN = SQ.map(q => q.india);

const india = {
  id: 'india', nav: 'One India', kicker: 'Segment: One India (45% of revenue)', title: `One India: the inhaler franchise and a market-beating Q1 (+${Q1.indiaGrowthPct}%)`,
  blocks: [
    { p: `One India sells through three channels. **Branded prescriptions (Rx)** are the core: a ₹9,500 cr+ portfolio (AR FY26), 33 brands above ₹100 cr and 23 in the top 300 of the Indian market. Cipla is No.1 in respiratory, No.2 in urology and No.7 in cardiac. **Trade generics** (unbranded, sold to chemists through stockists) is India's largest such business: 15,000+ stockists, 150,000+ chemists, 7 brands above ₹50 cr. **Consumer health** (₹1,690 cr in FY26; ₹481 cr in Q1FY27) sells Nicotex, Omnigel and Cipladine, each No.1 in its segment. Growth slowed to 6-7% in H1FY26 (weak acute season, a muted Rx quarter) and recovered to 15% in Q4FY26 and 12% in Q1FY27.` },
    { pair: [
      { type: 'column', title: 'One India growth: 6% in Q1FY26, 12-15% in the last two quarters', unit: 'One India revenue growth, year on year (%)', x: QL.slice(4), series: [{ name: 'Growth', values: IN.map((_, i) => yoy(IN, i)).slice(4), fmt: 'pct' }], labels: 'all', source: 'Company presentations' },
      { type: 'hbar', title: 'Growth by therapy: double digits in all five focus areas', unit: 'Cipla growth, IQVIA MAT Jun-26 (%), with Cipla rank in the therapy', x: ['Anti-diabetes (rank 11)', 'Cardiac (rank 7)', 'Respiratory (rank 1)', 'Dermatology (rank 11)', 'Urology (rank 2)'], series: [{ name: 'Growth', values: [26, 14, 13, 11, 10], fmt: 'pct' }], labels: 'all', source: 'Q1FY27 presentation (IQVIA MAT Jun-26). Quarter to Jun-26: respiratory +15%, anti-diabetes +43%, cardiac +20%, Rx total +15.4% (call)' },
    ] },
    { h: 'Respiratory: the moat' },
    { p: 'Cipla holds ~26% of Indian respiratory (CARE) and its respiratory sales in the market crossed ₹5,000 cr (IQVIA MAT Dec-25). Four of its top ten brands are inhaled medicines: Foracort (budesonide-formoterol, ~₹1,070 cr, +16%), Duolin (~₹660 cr), Budecort (~₹580 cr) and Seroflo (~₹300 cr), plus Asthalin. The advantage is not the molecules, which are old, but 30 years of devices (Rotahaler, Synchrobreathe, Ciphaler), doctor education and patient habits. Rivals have sold inhalers in India for years without denting that lead. Respiratory is about one third of Cipla\'s group revenue.' },
    { h: 'What to watch' },
    { bullets: [
      `**Organic vs bought growth.** In-licensed products are 10-15% of One India (CEO). Elara estimates organic growth at ~8% in Q1FY27 after the Pfizer brands, Yurpeak (~₹${Q1.yurpeakCr} cr) and Inzpera; ICICI Direct puts in-licensing at ~1.5pp of Rx growth. Either way, Cipla's own portfolio grows a little below the market.`,
      `**Productivity, not headcount.** The field force is ~${n0(Q1.fieldForce)} with no additions planned in FY27, after two years of hiring.`,
      '**Price control.** Many respiratory and anti-infective drugs are under India\'s price-control list (DPCO); price increases are capped at the wholesale-price index each April.',
    ] },
    { callout: `**Our view:** One India is the best part of Cipla and the reason the stock holds a premium multiple. We model +11% / +10% / +10% (FY27-29E), in line with management's "double-digit, market-beating" guidance, taking India to ${n1(share('india', 2))}% of group revenue by FY29E.` },
  ],
};

const NA = SQ.map(q => q.naUsd);
const PL = C.pipeline;
const us = {
  id: 'us', nav: 'North America', kicker: 'Segment: North America (24% of revenue)', title: 'North America: the windfall is gone; inhalers and a peptide must rebuild it',
  blocks: [
    { p: 'Cipla\'s US business has three layers. The **base**: 186 approved ANDAs and NDAs (incl. partners, Jun-2026), led by albuterol inhalers (No.1, 21% share, 50mn+ inhalers supplied), plus solid orals from InvaGen (New York) and injectables. The **windfall**: generic Revlimid, approved in Sep-2022 and sold under a settlement that capped generic volumes until 31-Jan-2026, so prices stayed high; Cipla shipped most of its last volumes in the Sep-2025 quarter, a little in Dec-2025 and none after. It never disclosed the revenue. And **lanreotide**, a long-acting injectable made by partner Pharmathen in Greece: production stopped after a Nov-2025 inspection and the plant was put under a USFDA import alert in Apr-2026. Together, these explain the fall from $250mn a quarter (Q1FY25) to $155mn (Q4FY26).' },
    { pair: [
      { type: 'column', title: 'US quarterly revenue: our path vs management\'s ~$250mn exit', unit: 'North America revenue (US$ mn); Q2-Q4FY27 = GAM estimates', x: [...QL, 'Q2FY27E', 'Q3FY27E', 'Q4FY27E', 'Mgmt exit'], series: [{ name: 'North America', values: [...NA, 180, 205, 228, 250], fmt: 'num' }], labels: 'all', highlight: 'Mgmt exit', source: 'Company presentations; GAM estimates; management: $1bn annualised run-rate by end-FY27 (excl. lanreotide)' },
      { type: 'column', title: 'Annual: FY27E $775mn, FY28E $900mn, below the FY25 peak until FY29E', unit: 'North America revenue (US$ mn)', x: ['FY24', 'FY25', 'FY26', ...YRS], series: [{ name: 'North America', values: [906, 934, 780, ...BL.usdMn], fmt: 'num' }], labels: 'all', source: 'Company presentations; GAM estimates' },
    ] },
    { h: 'The pipeline that has to fill the gap' },
    { exhibit: { type: 'table', title: 'US launches and pipeline as of 30-Sep-2026', head: ['Product', 'Status', 'Size / competition', 'Source'], wide: [1, 2], rows: PL.map(p => [`**${p.product}**`, rup(p.status), rup(p.size), p.src]), source: 'Company calls and releases; broker notes as cited' } },
    { p: 'Management\'s bridge to a $1bn annual run-rate (~$250mn a quarter) by Q4FY27 rests on five products: gVentolin\'s ramp-up, gAdvair, gSymbicort, a third inhaler and one large peptide, plus smaller launches (liraglutide, nintedanib, dapagliflozin). It excludes lanreotide. Two inhalers are filed from US plants, one from Goa; the peptide is made at a partner site. Brokers are split: Elara thinks the run-rate is "unlikely" and that US revenue settles near $160mn a quarter until launches land; ICICI Securities expected $880mn for FY27 in April.' },
    { exhibit: { type: 'table', title: 'Manufacturing sites and regulatory status', head: ['Site', 'Status', 'Why it matters'], wide: [1, 2], rows: C.regulatory.map(r => [`**${r.site}**`, rup(r.status), rup(r.impact)]), source: 'Company calls; exchange filings; CARE (10-Sep-2026); Indian Pharma Post (25-Aug-2026, Pithampur)' } },
    { callout: `**Our view:** we model $${BL.usdMn[0]}mn for FY27E (Q2-Q4: $180 / 205 / 228mn), $${BL.usdMn[1]}mn for FY28E and $${BL.usdMn[2]}mn for FY29E: gVentolin and gAdvair arrive, one or two of the other three products land in H2FY27, lanreotide partly returns in FY28, and prices erode as rivals enter. That is ~$100mn below the ~$1bn a year that management's run-rate implies for FY28. Every $50mn of US revenue is ~₹480 cr of revenue and, at ~40% incremental margin, ~₹190 cr of EBITDA (~3% of FY28E EPS).` },
  ],
};

const AF = SQ.filter(q => q.oneAfricaUsd);
const africa = {
  id: 'africa', nav: 'One Africa & EMEU', kicker: 'Segments: One Africa (15%) and Emerging Markets & Europe (13%)', title: 'One Africa and EMEU: steady, but FY27 starts slow (tender loss, war)',
  blocks: [
    { p: `**One Africa** ($${FY26.oneAfricaUsdMn}mn in FY26, +7%) is mostly South Africa, where Cipla bought Medpro in 2013 and is now No.2 in prescriptions (8.8% share) and No.3 overall (8.5%), with 10 brands above ZAR100mn and the most top-100 generic brands. Its private business grew 6.5% in secondary sales in Q1FY27 against a market up 5.7% (ZAR ${n0(Q1.saPrivateZarMn)}mn of revenue). The **tender** business is price-driven: Cipla lost a government contract last year, which management says will hurt reported growth for the next few quarters; the new revenue presentation (marketing spend netted from revenue) also falls mostly on South Africa. One Africa grew only 1% in dollars in Q1FY27.` },
    { p: `**Emerging Markets & Europe** ($${FY26.emeuUsdMn}mn, +4%) sells inhalers and other products directly in markets such as Australia and Europe and through B2B partners elsewhere. It crossed $400mn in FY26 but was hit by the West Asia conflict in Q4FY26 ($90mn vs $103mn a year earlier) and recovered to $${Q1.emeuUsdMn}mn (+5%) in Q1FY27.` },
    { pair: [
      { type: 'column', title: 'One Africa: seasonal, flat in dollars in Q1FY27', unit: 'One Africa revenue (US$ mn)', x: AF.map(q => q.q), series: [{ name: 'One Africa', values: AF.map(q => q.oneAfricaUsd), fmt: 'num' }], labels: 'all', source: 'Company presentations' },
      { type: 'column', title: 'EMEU: $100-110mn a quarter; the war hit Q4FY26', unit: 'Emerging Markets & Europe revenue (US$ mn)', x: AF.map(q => q.q), series: [{ name: 'EMEU', values: AF.map(q => q.emeuUsd), fmt: 'num' }], labels: 'all', source: 'Company presentations' },
    ] },
    { exhibit: { type: 'table', title: 'South Africa: Cipla\'s position (IQVIA MAT May-26)', head: ['Market segment', 'Rank', 'Share', 'Cipla growth', 'Market growth'], rows: [
      ['Prescription', '2', '8.8%', '9.8%', '6.9%'], ['OTC', '3', '7.8%', '0.6%', '3.5%'], { hl: true, cells: ['**Overall**', '**3**', '**8.5%**', '**6.5%**', '**5.7%**'] },
    ], source: 'Q1FY27 presentation' } },
    { callout: `**Our view:** these are steady franchises, not growth engines. We model One Africa +5% in rupees in FY27E (flat in dollars) and +8% after, and Rest of world (EMEU, API and others) +10% / +8% / +8%, helped by the weaker rupee. Together they stay ~${n1(share('africa', 2) + share('row', 2))}% of revenue.` },
  ],
};

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: a real moat in Indian respiratory; none in US generics',
  blocks: [
    { verdicts: D.moat.map(m => [m.area, m.verdict, rup(m.evidence), rup(m.soWhat)]), head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Competitive advantage scorecard', source: 'GAM Research; company; IQVIA via company and brokers' },
    { callout: '**Honest verdict:** Cipla has one genuine moat, Indian respiratory, and a strong position in Indian distribution and South Africa. In the US it has capability (inhalers, peptides) but no lasting advantage: each product earns well for a few years until competitors arrive, and plant problems (Pithampur, Pharmathen) have repeatedly cost it launches. So the right way to think about Cipla is a high-quality Indian franchise with a US option attached, not a compounding global specialty company.' },
  ],
};

module.exports = { india, us, africa, moat };
