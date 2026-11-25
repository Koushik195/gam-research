// Cohance Lifesciences report, part 2: what the company does, history & corporate actions (the merger, the bolt-ons, Advent),
// why the stock and the earnings moved as they did since the merger, industry, tailwind test.
const X = require('./COHANCE.ctx');
const { C, D, A, n0, n1, price, pxAll, LINES, YRS, epsU, Q1 } = X;
const px = d => { const p = pxAll.filter(([x]) => x <= d).at(-1); return p ? p[1] : null; };

const business = {
  id: 'business', nav: 'What it does', kicker: 'The business', title: 'What Cohance does: makes molecules for drug companies (Pharma CDMO, 39%), sells niche APIs and formulations (API+, 48%) and makes agro and performance chemicals (13%)',
  blocks: [
    { p: 'Cohance is a contract manufacturer and API maker for the pharmaceutical industry. **Pharma CDMO** (contract development and manufacturing; 39% of FY26 revenue) makes intermediates and active ingredients to an innovator\'s recipe, mostly for drugs still under patent: Suven\'s old business, built on 30-year relationships with large drug companies (the top 20 innovators give over 85% of small-molecule revenue). It also includes two newer platforms: payloads and linkers for antibody-drug conjugates (ADCs, "guided missile" cancer drugs) made in Vizag and the US bioconjugation services of **NJ Bio** (56% owned), and building blocks for oligonucleotide drugs from **Sapala** (67.5% owned). **API+** (48%) is Cohance\'s old business: niche, low-volume generic APIs (central nervous system drugs, controlled substances; top-three global position in 8 of its top 10 molecules), pellets and finished formulations sold to generic companies and some innovators. **Specialty Chemicals** (13%) makes agrochemical intermediates and active ingredients for an anchor global innovator and performance materials (photochromic dyes for lenses, OLED materials).' },
    { exhibit: { type: 'table', title: 'The business at a glance (FY26 unless stated)', head: ['Line', 'Revenue (₹ cr)', 'Share', 'What it is', 'Trend'], wide: [3, 4], rows: [
      ['Small-molecule CDMO incl. ADC payloads', n0(C.fy26.pharmaCdmo - C.fy26.njBioRevenue - C.fy26.sapalaRevenue), '29%', '18 commercial and 10 Phase III molecules; intermediates and APIs for innovators', '₹1,024 cr in FY25; two molecules destocked (~₹260 cr); Q1FY27 ~₹62 cr'],
      ['NJ Bio (USA, 56%)', n0(C.fy26.njBioRevenue), '8%', 'ADC/XDC research, development and clinical bioconjugation (Princeton, NJ)', 'Loss ₹66 cr in FY26; EBITDA −₹33 cr in Q1FY27'],
      ['Sapala (India, 67.5%)', n1(C.fy26.sapalaRevenue), '2%', 'Oligonucleotide building blocks, amidites, modified nucleosides', 'Q1FY27 ₹27 cr, 2.5x; new amidites plant'],
      ['API+', n0(C.fy26.apiPlus), '48%', 'Niche APIs (CNS, controlled substances), pellets, formulations (Nacharam)', '−8% in FY26 (Nacharam Warning Letter); −10% in Q1FY27'],
      ['Specialty Chemicals', n0(C.fy26.specChem), '13%', 'Agrochemical CDMO for an anchor innovator; photochromic and OLED materials', '−2% in FY26, −35% in Q1FY27; FY27 a qualification year'],
      { hl: true, cells: ['**Total**', `**${n0(A.sales[7])}**`, '100%', 'Exports dominate; ~15 sites, 3,000+ kL', '−13% in FY26; −23% in Q1FY27'] },
    ], source: 'Q4FY26 deck p.12, 17 (restated segments); AR FY26 note 18(b); Q1FY27 deck and call' } },
    { callout: '**So what:** this is no longer the Suven that investors paid 40x for. About half of revenue is now API+, a good niche-API business but a lower-margin one than innovator CDMO; the high-value CDMO book is concentrated in a few molecules; and the two "new modality" platforms are small (NJ Bio and Sapala ~10% of revenue) and one of them loses money.' },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'History: Advent bought Suven (2023), built Cohance alongside, merged them (May-2025), bought two bolt-ons and sold 8.9% at ₹906',
  blocks: [
    { p: `Suven Pharmaceuticals was demerged from Suven Life Sciences in 2020 and run by the Jasti family. Advent International bought 50.1% in 2023 (~₹6,313 cr agreed in Dec-2022) with a plan to merge it with **Cohance Lifesciences**, an API, formulations and CDMO platform Advent had assembled from acquisitions (AR FY26 lists land held in the names of RA Chem Pharma, Avra Laboratories and Inventis Drug Delivery Systems). The board approved the merger on 29-Feb-2024; the NCLT sanctioned it on 27-Mar-2025 and it became effective on **1-May-2025**: Suven issued **12,80,02,184 new shares at 11 Suven shares for every 295 Cohance shares** (record date 9-May-2025), taking the share count from 25.46 cr to 38.26 cr and Advent's stake to 66.41%; the merged company took the Cohance name. Because both companies were under Advent's control, the merger was booked by **pooling of interests**: FY25 was restated as if they had always been one and no assets were marked up, so there is no large amortisation of merger intangibles in the numbers. Before the merger each side bought a bolt-on: Cohance bought 67.5% of Sapala for ₹258 cr (Jul-2024) and Suven 56% of NJ Bio for ₹548 cr (Dec-2024), both with obligations to buy the rest (₹696 cr liability at Mar-26).` },
    { exhibit: { type: 'table', title: 'Timeline and what each event did to the numbers', head: ['Date', 'Event', 'Impact'], wide: [1, 2], rows: C.timeline.map(t => [t[0], t[1], t[2]]), source: C.timelineSrc } },
    { exhibit: { type: 'table', title: 'The merger in numbers', head: ['', 'Suven (as reported)', 'Merged (restated)', 'Note'], wide: [3], rows: [
      ['FY25 revenue (₹ cr)', n0(C.fy25.revenueSuvenAsReported), n0(C.fy25.revenueRestated), 'Cohance added ~₹1,411 cr'],
      ['FY25 profit after tax (₹ cr)', n0(C.fy25.patSuvenAsReported), n0(C.fy25.patRestated), 'Cohance added ~₹219 cr'],
      ['Shares (cr)', '25.46', '38.26', '+12.80 cr issued to Cohance holders (Advent)'],
      ['FY25 EPS (₹)', n1(C.fy25.patSuvenAsReported / 25.46), '12.68', 'Diluted, weighted post-merger count: ~22% above Suven alone, so the merger was EPS-accretive in FY25'],
    ], source: 'AR FY26 notes 59, 62; Q4FY26 deck' } },
    { callout: '**So what:** for a Suven shareholder the merger looked accretive in FY25 (EPS ₹12.68 merged vs ₹10.40 for Suven alone). It brought scale and a second leg (API+), and diluted Suven\'s margin (39% in FY24 alone vs 31% merged in FY25). The bolt-ons cost ~₹806 cr for majority stakes plus ₹696 cr owed for the rest; together they earned ₹238 cr of revenue and lost ₹66 cr in FY26.' },
  ],
};

const pricestory = {
  id: 'pricestory', nav: 'Why the stock fell', kicker: 'Since the merger', title: `Why the stock fell ${Math.round((1 - price / 1135.7) * 100)}% since the merger: two guidance cuts, a block sale, a Warning Letter and leadership churn, then a bounce on a new chief`,
  blocks: [
    { p: `On the merger's effective date the stock closed the week at ₹1,136 (2-May-2025): ~90x the merged FY25 EPS reported later that month, a price that leaned on the US$1 bn revenue / mid-30s-margin FY30 target. Each step since took the earnings and the multiple down together. **Aug-2025**: a weak Q1FY26. **18-Sep-2025**: Advent's Jusmiral Holdings sold 8.92% at ~₹906 to repay holdco debt (210-day lock-up). **Oct-Nov 2025**: the MD resigned and Q2FY26 cut FY26 revenue guidance to flat and margins to the high-20s (stock −27% in 11 sessions). **Feb-2026**: FY26 revenue guidance cut again to an early-to-mid double-digit decline, a US FDA Warning Letter at Nacharam, the CEO left: the stock touched ~₹280 in Mar-2026 (−75% from the merger). **27-Apr-2026**: Umang Vohra, who ran Cipla for a decade, was named Executive Chairman and Group CEO; the stock hit a 20% upper circuit and rose 43% in two days. **May and Aug-2026**: Q4FY26 and Q1FY27 were as weak as guided (Q1 loss) and the stock has held at ₹420-460 since: the market is paying for Vohra and a FY28 recovery, not for current earnings.` },
    { exhibit: { type: 'table', title: 'Price and earnings since the merger', head: ['Date', 'Event', 'Price (₹)', 'Earnings news'], wide: [1, 3], rows: [
      ['2-May-2025', 'Merger effective', n0(px('2025-05-02')), 'FY25 merged EPS ₹12.68; US$1 bn FY30 target'],
      ['19-Sep-2025', 'Advent block (8.92% at ~₹906)', n0(px('2025-09-19')), 'Q1FY26 EPS ₹1.28 (−35% YoY)'],
      ['14-Nov-2025', 'Q2FY26: FY26 guidance cut to flat', n0(px('2025-11-14')), 'Q2 EPS ₹1.94; MD left 28-Oct'],
      ['6-Mar-2026', 'Second cut; Warning Letter; CEO exit', n0(px('2026-03-06')), 'Q3 EPS ₹0.96'],
      ['1-May-2026', 'Umang Vohra joins', n0(px('2026-05-01')), '—'],
      ['15-May-2026', 'Q4FY26; Jefferies downgrade', n0(px('2026-05-15')), 'Q4 EPS ₹0.51; FY26 ₹4.68'],
      ['7-Aug-2026', 'Q1FY27 loss; Form 483 at Pashamylaram', n0(px('2026-08-07')), 'Q1 EPS −₹0.63'],
      { hl: true, cells: ['**30-Sep-2026**', '**As of this report**', `**${n0(price)}**`, `Our FY27E ₹${n1(epsU[0])}, FY28E ₹${n1(epsU[1])}`] },
    ], source: 'Screener.in weekly closes (NSE close for 30-Sep-2026); company filings; press reports' } },
    { callout: `**So what:** the de-rating is mostly earnings, not sentiment: EPS fell ~63% from FY25 to FY26 and the stock ~61%. On our FY28E EPS the stock still trades at ~${Math.round(price / epsU[1])}x, above any forward P/E the stock traded at from Apr-2021 to Mar-2024 (29-59x); the recovery is in the price.` },
  ],
};

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Industry: CDMO grows ~7% a year, ADC and oligonucleotide services ~11-15%; India gains from China de-risking, slowly',
  blocks: [
    { p: `${D.industry.cdmoGlobal}. ${D.industry.adc}. ${D.industry.oligo}. ${D.industry.china}. API+ sits in the slower generic API market (${D.industry.apiGlobal.split('(')[0].trim()}), and specialty chemicals in a ~3.5%-growth market with agrochemicals in a global downturn.` },
    { exhibit: { type: 'table', title: 'Where Cohance plays', head: ['Market', 'Size and growth', 'Cohance position'], wide: [1, 2], rows: [
      ['Small-molecule CDMO', '~US$197 bn (2025) → ~US$369 bn (2034), ~7%', 'Mid-sized Indian player; 18 commercial molecules; a few large molecules dominate'],
      ['ADC services (payload-linker, conjugation)', 'Bioconjugation ~US$2.2 bn → ~US$4.4 bn (2025-30), ~15%', 'Payloads in India (two commercial supplies); NJ Bio in the US, loss-making'],
      ['Oligonucleotide building blocks', 'Oligo CDMO ~US$0.9 bn (2024) → ~US$3.2 bn (2033), ~15%', 'Sapala: niche amidites and tc-DNA; one of few specialists globally'],
      ['Niche generic APIs', '~US$270 bn API market, ~5.5%', 'Top-3 in 8 of its top 10 molecules; controlled substances'],
      ['Agro and performance chemicals', '~3.5% growth; agro in downturn', 'Anchor innovator; qualifying Japanese and EU customers'],
    ], source: 'AR FY26 MD&A (industry reports cited there); Q1FY27 deck' } },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Tailwind test: Indian CDMO peers are growing; Cohance is not, yet. The tailwind reaches it with a lag and through a few molecules',
  blocks: [
    { p: `Indian CDMOs had a strong FY26: on Screener, Neuland grew revenue 37%, Acutaas 33%, Sai Life 29%, Laurus 23%, Anthem 15% and Divi's 13%, helped by innovators adding non-Chinese suppliers. Cohance's revenue fell 13%. Its new chairman said it plainly: "some of our peers may have actually moved faster than Cohance", partly because of leadership churn, and its anchor customers "did not necessarily increase the width of their business with us in the past 2 to 3 years". The tailwind is real for Cohance too (RFQs have doubled since FY23; late-stage inquiries from large pharma and Western CDMOs are rising) but conversion takes years because customers already have one or two qualified sources. Our forecasts assume it shows up from FY28 (small-molecule CDMO +25%), not in FY27.` },
    { callout: `**Verdict:** the sector tailwind reaches Cohance weakly and late. Unlike Sai Life or Anthem, which are compounding broad customer books, Cohance's CDMO revenue swings with a handful of molecules (two destocked at once). Q1FY27 small-molecule CDMO revenue was only ~₹62 cr against ~₹163 cr a quarter in FY26.` },
  ],
};

module.exports = { business, history, pricestory, industry, tailwind };
